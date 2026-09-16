import Link from 'next/link'
import { getGlobal } from '@/lib/payload'

export interface NavItem {
  key: string
  label: string
  href: string
  icon: string
  badge?: string
}

const DEFAULT_CARE_NAV_ITEMS: NavItem[] = [
  { key: 'danh-cho-nguoi-benh', label: 'Cổng tổng hợp', href: '/danh-cho-nguoi-benh', icon: '🏥' },
  { key: 'quy-trinh', label: 'Quy trình khám', href: '/quy-trinh-kham-benh', icon: '🩺' },
  { key: 'noi-tru', label: 'Điều trị nội trú', href: '/dieu-tri-noi-tru', icon: '🛏️' },
  { key: 'goi-kham', label: 'Gói khám sức khỏe', href: '/goi-kham', icon: '📦' },
  { key: 'so-do', label: 'Sơ đồ bệnh viện', href: '/so-do-benh-vien', icon: '🗺️' },
  { key: 'khao-sat', label: 'Khảo sát ý kiến', href: '/khao-sat', icon: '📝' },
  { key: 'gop-y', label: 'Góp ý – Phản ánh', href: '/gop-y', icon: '💬' },
  { key: 'tra-cuu', label: 'Tra cứu phản ánh', href: '/gop-y/tra-cuu', icon: '🔍' },
  { key: 'hoi-dap', label: 'Hỏi đáp y tế (FAQ)', href: '/hoi-dap', icon: '❓' },
  { key: 'bieu-mau', label: 'Biểu mẫu điện tử', href: '/bieu-mau', icon: '📋' },
  { key: 'chat-luong', label: 'Chất lượng bệnh viện', href: '/chat-luong-benh-vien', icon: '⭐' },
  { key: 'lien-he', label: 'Liên hệ & Hotline', href: '/lien-he', icon: '📞' },
]

export async function PatientCareSubNav({
  activeKey,
  customTabs,
}: {
  activeKey: string
  customTabs?: NavItem[]
}) {
  let navItems = DEFAULT_CARE_NAV_ITEMS

  if (customTabs && customTabs.length > 0) {
    navItems = customTabs
  } else {
    try {
      const portalSettings: any = await getGlobal('patient-portal-settings').catch(() => null)
      if (Array.isArray(portalSettings?.subNavTabs) && portalSettings.subNavTabs.length > 0) {
        const activeTabs = portalSettings.subNavTabs
          .filter((t: any) => t?.enabled !== false)
          .map((t: any) => ({
            key: t.key || '',
            label: t.label || '',
            href: t.href || '',
            icon: t.icon || '🏥',
            badge: t.badge || undefined,
          }))
        if (activeTabs.length > 0) {
          navItems = activeTabs
        }
      }
    } catch {}
  }

  return (
    <nav className="patientCareSubNav" aria-label="Chuyên mục Chăm sóc người bệnh">
      <div className="patientCareSubNavInner">
        {navItems.map((item) => {
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
