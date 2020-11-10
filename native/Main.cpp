#include <enet/enet.h>
#include <napi.h>
#include <unordered_map>

#define ARG Napi::CallbackInfo& info
std::unordered_map<uint32_t, ENetPeer*> peers;

ENetHost* host;

void __init(ARG) {
  Napi::Env env = info.Env();

  if (enet_initialize() != 0)
    return Napi::Error::New(env, "ENet failed to Initialize.").ThrowAsJavaScriptException();

  ENetAddress address;
  address.host = ENET_HOST_ANY;
  address.port = 17091;

  host = enet_host_create(&address, 1024, 2, 0, 0);
  host->checksum = enet_crc32;
  enet_host_compress_with_range_coder(host);
}

void __send(ARG) {
  Napi::Env env = info.Env();

  uint32_t peerID  = info[0].ToNumber().Uint32Value();
  uint32_t count   = info[1].ToNumber().Uint32Value();
  Napi::Object arr = info[2].ToObject();

  auto peer = peers[peerID];
  if (!peer || peer->state != ENET_PEER_STATE_CONNECTED) return;

  for (uint32_t i = 0; i < count; ++i) {
    auto buffer = arr.Get(i).As<Napi::Buffer<unsigned char>>();
    auto packet = enet_packet_create(buffer.Data(),
                                    buffer.Length(),
                                    ENET_PACKET_FLAG_RELIABLE);

    enet_peer_send(peer, 0, packet);
  }
}

Napi::Object __reg(Napi::Env env, Napi::Object exports) {
  exports["init"] = Napi::Function::New(env, __init);
  exports["send"] = Napi::Function::New(env, __send);
}

NODE_API_MODULE(GrowSockets, __reg)