import 'server-only'
import sanitizeHtml from 'sanitize-html'

/** Only these tags/attributes survive; anything else typed or pasted into the editor is stripped. */
export function cleanRichText(html: string | null | undefined): string | null {
  const clean = sanitizeHtml(html ?? '', {
    allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'a', 'blockquote', 'h3'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }) },
  }).trim()
  const text = clean.replace(/<[^>]*>/g, '').trim()
  return text ? clean : null
}
