import 'server-only'

export type NotifyInput = {
  id: string
  name: string
  phone: string
  email: string
  eventType: string
  eventDate: string
  eventTime?: string | null
  guests: number
  location: string
  notes?: string | null
  adminUrl?: string
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Remove CR/LF so user input can never inject headers into the subject line. */
const oneLine = (s: string) =>
  s
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, 120)

function render(e: NotifyInput) {
  const rows: [string, string][] = [
    ['Name', e.name],
    ['Phone', e.phone],
    ['Email', e.email],
    ['Event type', e.eventType],
    ['Event date', e.eventDate],
    ['Start time', e.eventTime || 'Not specified'],
    ['Guests', String(e.guests)],
    ['Location', e.location],
    ['Requirements', e.notes || '—'],
  ]
  const text =
    `New catering enquiry\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n` +
    (e.adminUrl ? `\nOpen in admin: ${e.adminUrl}\n` : '')

  const html = `<!doctype html><html><body style="margin:0;background:#10110f;padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#191815;border-top:2px solid #d5a64a;color:#f8f5ee;font-family:Arial,Helvetica,sans-serif">
<tr><td style="padding:28px 28px 8px">
  <p style="margin:0 0 8px;letter-spacing:.25em;font-size:11px;color:#d5a64a">9090 CATERING</p>
  <h1 style="margin:0;font-family:Georgia,serif;font-weight:400;font-size:26px;color:#f8f5ee">New catering enquiry</h1>
</td></tr>
<tr><td style="padding:12px 28px 8px">
<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px;line-height:1.5">
${rows
  .map(
    ([k, v]) =>
      `<tr><td valign="top" style="padding:10px 12px 10px 0;border-bottom:1px solid #2c2a25;color:#a69a87;width:110px">${k}</td><td valign="top" style="padding:10px 0;border-bottom:1px solid #2c2a25;color:#f8f5ee;word-break:break-word">${esc(v).replace(/\n/g, '<br>')}</td></tr>`,
  )
  .join('')}
</table></td></tr>
${
  e.adminUrl
    ? `<tr><td style="padding:20px 28px 28px"><a href="${esc(e.adminUrl)}" style="display:inline-block;background:#d5a64a;color:#10110f;text-decoration:none;font-weight:bold;font-size:12px;letter-spacing:.15em;padding:14px 22px">OPEN IN ADMIN</a></td></tr>`
    : '<tr><td style="padding-bottom:20px"></td></tr>'
}
</table>
<p style="max-width:560px;margin:14px auto 0;font-size:11px;color:#6f675a;font-family:Arial,sans-serif">Sent automatically from the 9090 Catering website contact form.</p>
</td></tr></table></body></html>`
  return { text, html }
}

/**
 * Emails the admin through Brevo. Never throws: a mail failure must not lose a saved enquiry.
 * Returns true only when Brevo accepted the message.
 */
export async function notifyAdmin(e: NotifyInput): Promise<boolean> {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, ADMIN_NOTIFY_EMAIL } = process.env
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !ADMIN_NOTIFY_EMAIL) {
    console.warn('Admin notification skipped: Brevo env vars are not set')
    return false
  }
  if (BREVO_API_KEY.startsWith('xsmtpsib-')) {
    console.error(
      'BREVO_API_KEY is an SMTP key (xsmtpsib-...). The email API needs an API key (xkeysib-...) from Brevo > SMTP & API > API Keys.',
    )
    return false
  }
  const { html, text } = render(e)
  const payload = JSON.stringify({
    sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME || '9090 Catering' },
    to: [{ email: ADMIN_NOTIFY_EMAIL }],
    replyTo: { email: e.email, name: oneLine(e.name) || e.email },
    subject: oneLine(`New enquiry: ${e.eventType} · ${e.name}`),
    htmlContent: html,
    textContent: text,
    tags: ['enquiry'],
  })

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
        body: payload,
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) return true
      console.error(`Brevo responded ${res.status} (attempt ${attempt})`)
      if (res.status < 500 && res.status !== 429) return false // retrying a 4xx will not help
    } catch (err) {
      console.error(`Brevo request failed (attempt ${attempt})`, err)
    }
    await new Promise((r) => setTimeout(r, 600))
  }
  return false
}
