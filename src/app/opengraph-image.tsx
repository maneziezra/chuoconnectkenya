import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Chuo Connect'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A', // Dark navy background for premium look
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <svg width="140" height="120" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5H7.5L3.5 12L7.5 19H12" stroke="#F9FAFB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 5H19.5L15.5 12L19.5 19H24" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'sans-serif' }}>
            <span style={{ color: '#F9FAFB' }}>Chuo</span>
            <span style={{ color: '#FBBF24' }}>Connect</span>
          </div>
        </div>
        <div style={{ color: '#94A3B8', fontSize: 32, marginTop: 40, fontWeight: 500, fontFamily: 'sans-serif' }}>
          The Premier University Discovery Platform
        </div>
      </div>
    ),
    { ...size }
  )
}
