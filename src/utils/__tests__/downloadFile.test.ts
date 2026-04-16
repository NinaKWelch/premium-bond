// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import downloadFile from '../downloadFile'

describe('downloadFile', () => {
  const fakeUrl = 'blob:fake-url'

  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(fakeUrl)
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  it('creates a blob with the given content and MIME type', () => {
    const click = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement)

    downloadFile('hello', 'test.txt', 'text/plain')

    expect(URL.createObjectURL).toHaveBeenCalledWith(new Blob(['hello'], { type: 'text/plain' }))
  })

  it('sets href, download, and triggers a click on the anchor', () => {
    const anchor = { href: '', download: '', click: vi.fn() }
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement)

    downloadFile('data', 'export.csv', 'text/csv')

    expect(anchor.href).toBe(fakeUrl)
    expect(anchor.download).toBe('export.csv')
    expect(anchor.click).toHaveBeenCalledOnce()
  })

  it('revokes the object URL after clicking', () => {
    const anchor = { href: '', download: '', click: vi.fn() }
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement)

    downloadFile('data', 'file.csv', 'text/csv')

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeUrl)
  })
})
