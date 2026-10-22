# 06 · Exports → `stage-05-exports`

## The request

```text
Step 5: exports. Binary STL and OBJ written by hand from our mesh arrays
(so students can read how simple these formats are), and 3DM with rhino3dm,
loaded only when the button is clicked. Convert y-up to z-up for all of
them. Units mm. Tests: STL byte size, STL is z-up, OBJ counts.
```

## What happened

1. **rhino3dm's type definitions were incomplete** — the methods to add vertices and faces (`add`, `addTriFace`) weren't listed. Claude loaded the library in Node and *inspected the real object* to find the method names, then wrote a 4-triangle test file, read it back, and confirmed it was closed and in millimetres. **When documentation is missing, look at the thing itself.**

2. **The type checker stopped a commit** — `doc.delete()` wasn't in the types either. Fixed with an explicit, commented cast.

3. **Unit tests passed — the real browser failed.** Much later, an automated browser test clicked "3DM" and… nothing downloaded. The page error:

   ```
   Failed to resolve module specifier "ws"
   ```

   rhino3dm is compiled with Emscripten, which mentions the Node.js `ws` package for code that never runs in a browser. The bundler still tried to import it. Fix: point `ws` at an empty stub (`src/lib/ws-stub.ts`, aliased in `vite.config.ts`). Then the 5 MB `.3dm` downloaded, and reading it back confirmed: closed mesh, 98,818 vertices, z from 0 to 180 mm, named "Amphora".

> Unit tests check your logic. **Only a real browser checks the whole chain** — bundler, WebAssembly, downloads. You need both.
