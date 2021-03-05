var Module = {};
Module.wasmBinary = "/stockfish.wasm"
Module.wasmBinaryFile = "https://wl-chess.glitch.me/stockfish.wasm";
const engine = new Worker("stockfish.js");

const cmd = function(x) {
  window.log("CMD: "+x);
  engine.postMessage(x);
}

function oninit() {
  
}

const uci_command = function() {
  
}

engine.onmessage = function(event) {
  window.log("MSG: "+event.data)
}

//cmd("uci");