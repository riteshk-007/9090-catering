import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#10110F',
        border: '4px solid #D5A64A',
        color: '#E7CC91',
        fontSize: 120,
        fontFamily: 'Georgia, serif',
      }}
    >
      9
    </div>,
    size,
  )
}
