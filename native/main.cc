#include <enet/enet.h>
#include <napi.h>
#include <unordered_map>

#define ARG const Napi::CallbackInfo& info

std::unordered_map<unsigned int, ENetPeer*> peers;
ENetHost* host;
Napi::FunctionReference emitter;
bool usingNewPacket = false;

unsigned int netID = 0;

enum Disconnect {
  NOW,
  LATER,
  NORMAL
};

template <typename T>
void __finalizer(Napi::Env env, T* data) {
  delete[] data;
}

void __init(ARG) {
  Napi::Env env     = info.Env();
  unsigned int port = info[0].As<Napi::Number>().Uint32Value();

  if (enet_initialize() != 0)
    return Napi::Error::New(env, "ENet failed to Initialize.").ThrowAsJavaScriptException();

  ENetAddress address;
  address.host = ENET_HOST_ANY;
  address.port = static_cast<uint16_t>(port);

  host = enet_host_create(&address, 1024, 2, 0, 0);
  
  host->checksum = enet_crc32;
  host->usingNewPacket = usingNewPacket;

  enet_host_compress_with_range_coder(host);
}

void __set_using_new_packet(ARG) {
  usingNewPacket = true;
}

void __send(ARG) {
  Napi::Env env = info.Env();

  unsigned int peerID  = info[0].As<Napi::Number>().Uint32Value();
  unsigned int count   = info[1].As<Napi::Number>().Uint32Value();
  Napi::Object arr     = info[2].As<Napi::Object>();

  ENetPeer* peer = peers[peerID];
  if (!peer || peer->state != ENET_PEER_STATE_CONNECTED) return;

  for (unsigned int i = 0; i < count; ++i) {
    auto buffer        = arr.Get(i).As<Napi::Buffer<unsigned char>>();
    ENetPacket* packet = enet_packet_create(buffer.Data(),
                                            buffer.Length(),
                                            ENET_PACKET_FLAG_RELIABLE);

    enet_peer_send(peer, 0, packet);
  }
}

void __accept(ARG) {
  Napi::Env env = info.Env();

  if (!emitter)
    return Napi::Error::New(env, "Can't watch for events without the emit function.").ThrowAsJavaScriptException();

  ENetEvent event;

  if (enet_host_service(host, &event, 0) > 0)
    switch (event.type) {
      case ENET_EVENT_TYPE_CONNECT: {
        unsigned int lastNetID = netID++;
        event.peer->data       = new unsigned char[sizeof(unsigned int)];

        memcpy(event.peer->data, &lastNetID, sizeof(unsigned int));
        peers[lastNetID] = event.peer;

        emitter.Call({
          Napi::String::New(env, "connect"),
          Napi::Number::New(env, lastNetID)
        });
        break;
      }

      case ENET_EVENT_TYPE_RECEIVE: {
        unsigned char* packet = new unsigned char[event.packet->dataLength];
        memcpy(packet, event.packet->data, event.packet->dataLength);

        emitter.Call({
          Napi::String::New(env, "data"),
          Napi::Number::New(env, *reinterpret_cast<unsigned int*>(event.peer->data)),
          Napi::Buffer<unsigned char>::New(env,
                                    packet,
                                    event.packet->dataLength,
                                    __finalizer<unsigned char>)
        });

        enet_packet_destroy(event.packet);
        break;
      }

      case ENET_EVENT_TYPE_DISCONNECT: {
        unsigned int userNetID = *reinterpret_cast<unsigned int*>(event.peer->data);
        ENetPeer* peer = peers[userNetID];

        if (!peer) {
          delete[] event.peer->data;
          return;
        }
        
        emitter.Call({
          Napi::String::New(env, "disconnect"),
          Napi::Number::New(env, *reinterpret_cast<unsigned int*>(peer->data))
        });

        peers.erase(userNetID);
        delete[] event.peer->data;

        break;
      }
    }
}

void __set_netID(ARG) {
  netID = info[0].As<Napi::Number>().Uint32Value();
}

void __close(ARG) {
  enet_deinitialize();
}

void __set_emitter(ARG) {
  emitter = Napi::Persistent(info[0].As<Napi::Function>());
}

void __disconnect(ARG) {
  unsigned int peerID = info[0].As<Napi::Number>().Uint32Value();
  Disconnect dType = static_cast<Disconnect>(info[1].As<Napi::Number>().Uint32Value());
  
  ENetPeer* peer = peers[peerID];

  if (!peer) return;
  switch (dType) {
    case NOW: {
      enet_peer_disconnect_now(peer, 0);
      break;
    }

    case LATER: {
      enet_peer_disconnect_later(peer, 0);
      break;
    }

    case NORMAL: {
      enet_peer_disconnect(peer, 0);
      break;
    }
  }
}

Napi::Object __reg(Napi::Env env, Napi::Object exports) {
  exports["init"]         = Napi::Function::New(env, __init);
  exports["send"]         = Napi::Function::New(env, __send);
  exports["accept"]       = Napi::Function::New(env, __accept);
  exports["setNetID"]     = Napi::Function::New(env, __set_netID);
  exports["deInit"]       = Napi::Function::New(env, __close);
  exports["emitter"]      = Napi::Function::New(env, __set_emitter);
  exports["disconnect"]   = Napi::Function::New(env, __disconnect);
  exports["useNewPacket"] = Napi::Function::New(env, __set_using_new_packet);

  return exports;
}

NODE_API_MODULE(GrowSockets, __reg)