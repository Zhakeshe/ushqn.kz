import { describe, expect, it } from 'vitest'
import { MAX_UPLOAD_BYTES, validateUpload } from './upload'

function file(name: string, type: string, size = 10) {
  return new File([new Uint8Array(size)], name, { type })
}

describe('validateUpload', () => {
  it('accepts a supported image', () => {
    expect(validateUpload(file('avatar.png', 'image/png'))).toBeNull()
  })

  it('rejects executable extensions even with a spoofed MIME type', () => {
    expect(validateUpload(file('payload.exe', 'image/png'))).toMatch(/extension/i)
  })

  it('rejects unsupported MIME types', () => {
    expect(validateUpload(file('archive.zip', 'application/zip'))).toMatch(/type/i)
  })

  it('rejects files larger than the server limit', () => {
    const oversized = new File([new Uint8Array(1)], 'proof.pdf', { type: 'application/pdf' })
    Object.defineProperty(oversized, 'size', { value: MAX_UPLOAD_BYTES + 1 })
    expect(validateUpload(oversized)).toMatch(/10 MB/i)
  })
})
