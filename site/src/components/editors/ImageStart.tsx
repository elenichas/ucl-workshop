import { useEffect, useRef, useState } from 'react'
import { ImageUp, Sparkles } from 'lucide-react'
import { extractOutline, extractPalette, fileToPixels, type Pixels } from '@/geometry/imageProfile'
import { Button } from '@/components/ui/button'
import type { Design } from '@/design/design'

const SAMPLE = `${import.meta.env.BASE_URL}samples/vase-sketch.png`

/**
 * Image → outline. Upload a photo or a drawing; we find the vase in it,
 * show the outline we found in red, and offer its colours.
 */
export function ImageStart({ design, threshold, onChange, onUseColours }: {
  design: Design
  threshold: number
  onChange: (imageStart: Design['imageStart']) => void
  onUseColours: (palette: string[]) => void
}) {
  const [pixels, setPixels] = useState<Pixels | null>(null)
  const [preview, setPreview] = useState<string>(design.imageStart?.preview ?? '')
  const [error, setError] = useState('')
  const overlay = useRef<HTMLCanvasElement>(null)

  async function load(file: Blob) {
    setError('')
    try {
      const { pixels: px, preview: pv } = await fileToPixels(file)
      setPixels(px)
      setPreview(pv)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  // Re-run the outline whenever the image or the sensitivity changes.
  useEffect(() => {
    if (!pixels) return
    const { samples, mask, found } = extractOutline(pixels, threshold)
    if (!found) {
      setError('No vase found. Move the outline sensitivity, or use an image with a plain background.')
      return
    }
    setError('')
    onChange({ samples, palette: extractPalette(pixels), preview })
    // draw the detected shape in red over the image
    const c = overlay.current
    if (!c) return
    c.width = pixels.width; c.height = pixels.height
    const ctx = c.getContext('2d')!
    const img = ctx.createImageData(pixels.width, pixels.height)
    for (let i = 0; i < mask.length; i++) {
      if (!mask[i]) continue
      img.data[i * 4] = 210; img.data[i * 4 + 1] = 60; img.data[i * 4 + 2] = 40; img.data[i * 4 + 3] = 110
    }
    ctx.putImageData(img, 0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixels, threshold])

  const palette = design.imageStart?.palette ?? []

  return (
    <div>
      <p className="mb-2 text-xs leading-snug text-ink-muted">
        A photo or drawing of a vase on a plain background works best. The red area is what the app sees as "vase".
      </p>
      <div className="relative grid min-h-48 place-items-center overflow-hidden border border-line bg-paper-raised">
        {preview ? (
          <>
            <img src={preview} alt="Your reference image" className="max-h-72 w-auto" />
            <canvas ref={overlay} aria-hidden className="pointer-events-none absolute inset-0 m-auto max-h-72 h-full w-auto object-contain" style={{ aspectRatio: pixels ? `${pixels.width}/${pixels.height}` : undefined }} />
          </>
        ) : (
          <p className="p-6 text-center text-sm text-ink-muted">No image yet.</p>
        )}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-fail">{error}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" asChild>
          <label className="cursor-pointer">
            <ImageUp aria-hidden /> Upload image
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
          </label>
        </Button>
        <Button size="sm" variant="outline" onClick={async () => load(await (await fetch(SAMPLE)).blob())}>
          <Sparkles aria-hidden /> Try a sample sketch
        </Button>
      </div>
      {palette.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">Colours found in the image</p>
          <div className="mt-2 flex items-center gap-2">
            {palette.map((c) => <span key={c} className="size-7 rounded-sm border border-line" style={{ background: c }} title={c} />)}
            <Button size="sm" variant="ghost" onClick={() => onUseColours(palette)}>Use these</Button>
          </div>
        </div>
      )}
    </div>
  )
}
