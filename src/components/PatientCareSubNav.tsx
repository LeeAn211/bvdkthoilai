import Link from 'next/link'

interface NavItem {
  key: string
  label: string
  href: string
  icon: string
  badge?: string
}

const CARE_NAV_ITEMS: NavItem[] = [
  { key: 'danh-cho-nguoi-benh', label: 'Cổng tổng hợp', href: '/danh-cho-nguoi-benh', icon: '🏥' },
  { key: 'khao-sat', label: 'Khảo sát ý kiến', href: '/khao-sat', icon: '📝' },
  { key: 'gop-y', label: 'Góp ý – Phản ánh', href: '/gop-y', icon: '💬' },
  { key: 'tra-cuu', label: 'Tra cứu phản ánh', href: '/gop-y/tra-cuu', icon: '🔍' },
  { key: 'hoi-dap', label: 'Hỏi đáp y tế (FAQ)', href: '/hoi-dap', icon: '❓' },
  { key: 'bieu-mau', label: 'Biểu mẫu điện tử', href: '/bieu-mau', icon: '📋' },
  { key: 'chat-luong', label: 'Chất lượng bệnh viện', href: '/chat-luong-benh-vien', icon: '⭐' },
  { key: 'lien-he', label: 'Liên hệ & Hotline', href: '/lien-he', icon: '📞' },
]

export function PatientCareSubNav({ activeKey }: { activeKey: string }) {
  return (
    <nav className="patientCareSubNav" aria-label="Chuyên mục Chăm sóc người bệnh">
      <div className="patientCareSubNavInner">
        {CARE_NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`patientCareSubNavLink ${isActive ? 'active' : ''}`}
            >
              <span className="patientCareSubNavIcon" aria-hidden="true">{item.icon}</span>
              <span className="patientCareSubNavLabel">{item.label}</span>
              {item.badge && <span className="patientCareSubNavBadge">{item.badge}</span>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
