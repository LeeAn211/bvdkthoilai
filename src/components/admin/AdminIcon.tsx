export default function AdminIcon() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 9, display: 'grid',
      placeItems: 'center', background: 'linear-gradient(145deg,#0878D1,#22B4DE)', color: '#fff',
      boxShadow: '0 5px 14px rgba(8,120,209,.22)'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
