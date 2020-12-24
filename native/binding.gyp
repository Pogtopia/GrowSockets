{
  "targets": [
    {
      "target_name": "index",
      "sources": [
        "main.cc",
        "src/callbacks.c",
        "src/compress.c",
        "src/host.c",
        "src/list.c",
        "src/packet.c",
        "src/peer.c",
        "src/protocol.c",
        "src/unix.c",
        "src/win32.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "<(module_root_dir)/include"
      ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "conditions": [
        [
          "OS==\"win\"",
          {
            "msbuild_settings": {
              "Link": {
                "ImageHasSafeExceptionHandlers": "false"
              }
            },
            "libraries": ["winmm.lib", "ws2_32.lib"]
          }
        ]
      ]
    }
  ]
}
