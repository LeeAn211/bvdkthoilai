import React from 'react'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 42, height: 42, display: 'grid', placeItems: 'center',
        borderRadius: 12, background: '#0878D1', color: '#fff',
        fontWeight: 900, fontSize: 15
      }}>TL</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <strong style={{ color: '#17324d', fontSize: 13 }}>BVĐK KHU VỰC</strong>
        <span style={{ color: '#0878D1', fontSize: 11, fontWeight: 800 }}>THỚI LAI</span>
      </div>
    </div>
  )
}
