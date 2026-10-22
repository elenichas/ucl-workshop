// rhino3dm is compiled with Emscripten, which mentions the Node.js "ws" package
// for code paths that only run outside the browser. The bundler still tries to
// resolve it, so we point it here: an empty stand-in that is never used.
export default {}
