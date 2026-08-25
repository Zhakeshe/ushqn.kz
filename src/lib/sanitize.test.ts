import { describe, expect, it } from 'vitest'
import { sanitizeUserText } from './sanitize'

describe('sanitizeUserText', () => {
  it('removes markup while retaining safe text', () => {
    expect(sanitizeUserText('<b>Hello</b> <img src=x onerror=alert(1)>world')).toBe('Hello world')
  })

  it('removes script content', () => {
    expect(sanitizeUserText('safe<script>alert(1)</script>text')).toBe('safetext')
  })
})
