'use client'

import React, { useState, useEffect } from 'react'
import styles from './AdminDashboardCustomizer.module.css'

export interface CardItem {
  id: string
  title: string
  subtext: string
  visible: boolean
}

export interface ChartVisibility {
  showAreaChart: boolean
  showDepartmentBar: boolean
  showSatisfactionGauge: boolean
  showSlaStats: boolean
}

interface AdminDashboardCustomizerProps {
  initialCards: CardItem[]
  initialCharts: ChartVisibility
  onUpdate: (cards: CardItem[], charts: ChartVisibility) => void
  onClose: () => void
}

export default function AdminDashboardCustomizer({
  initialCards,
  initialCharts,
  onUpdate,
  onClose,
}: AdminDashboardCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'charts'>('cards')
  const [cards, setCards] = useState<CardItem[]>(initialCards)
  const [charts, setCharts] = useState<ChartVisibility>(initialCharts)

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Di chuyển thứ tự thẻ
  const moveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= cards.length) return
    const newCards = [...cards]
    const temp = newCards[index]
    newCards[index] = newCards[targetIndex]
    newCards[targetIndex] = temp
    setCards(newCards)
  }

  // Bật/tắt thẻ số liệu
  const toggleCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    )
  }

  // Bật/tắt biểu đồ
  const toggleChart = (key: keyof ChartVisibility) => {
    setCharts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Khôi phục mặc định
  const handleReset = () => {
    const resetCards = cards.map((c) => ({ ...c, visible: true }))
    const resetCharts: ChartVisibility = {
      showAreaChart: true,
      showDepartmentBar: true,
      showSatisfactionGauge: true,
      showSlaStats: true,
    }
    setCards(resetCards)
    setCharts(resetCharts)
    try {
      localStorage.removeItem('thoilai_admin_dashboard_cards')
      localStorage.removeItem('thoilai_admin_dashboard_charts')
    } catch {
      // ignore
    }
  }

  // Lưu cấu hình
  const handleSave = () => {
    try {
      localStorage.setItem('thoilai_admin_dashboard_cards', JSON.stringify(cards))
      localStorage.setItem('thoilai_admin_dashboard_charts', JSON.stringify(charts))
    } catch {
      // ignore
    }
    onUpdate(cards, charts)
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Tùy chỉnh thống kê Dashboard
          </h3>
          <button type="button" className={styles.closeButton} onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.modalTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'cards' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            Thẻ số liệu chính ({cards.filter((c) => c.visible).length}/{cards.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'charts' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            Khối biểu đồ & Phân tích ({Object.values(charts).filter(Boolean).length}/4)
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.helpTip}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              {activeTab === 'cards'
                ? 'Dùng nút mũi tên ▲ ▼ để đổi vị trí, gạt công tắc để ẩn bớt các mục không cần thiết.'
                : 'Bật/tắt các biểu đồ xu hướng, năng suất và chỉ số hài lòng người bệnh.'}
            </span>
          </div>

          {activeTab === 'cards' && (
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Danh sách các thẻ thống kê:</span>
              <div className={styles.itemList}>
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className={`${styles.itemRow} ${!card.visible ? styles.itemRowDisabled : ''}`}
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.itemOrderBtns}>
                        <button
                          type="button"
                          className={styles.orderBtn}
                          disabled={idx === 0}
                          onClick={() => moveCard(idx, 'up')}
                          title="Chuyển lên trên"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className={styles.orderBtn}
                          disabled={idx === cards.length - 1}
                          onClick={() => moveCard(idx, 'down')}
                          title="Chuyển xuống dưới"
                        >
                          ▼
                        </button>
                      </div>
                      <div>
                        <div className={styles.itemTitle}>{card.title}</div>
                        <div className={styles.itemDesc}>{card.subtext}</div>
                      </div>
                    </div>

                    <label className={styles.switchWrap}>
                      <input
                        type="checkbox"
                        checked={card.visible}
                        onChange={() => toggleCard(card.id)}
                      />
                      <span className={styles.slider} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Các khối biểu đồ phân tích:</span>
              <div className={styles.itemList}>
                <div className={`${styles.itemRow} ${!charts.showAreaChart ? styles.itemRowDisabled : ''}`}>
                  <div>
                    <div className={styles.itemTitle}>Biểu đồ xu hướng xuất bản tin bài</div>
                    <div className={styles.itemDesc}>Biểu đồ dạng vùng theo dõi số lượng tin tức, thông báo, thầu qua từng tháng.</div>
                  </div>
                  <label className={styles.switchWrap}>
                    <input
                      type="checkbox"
                      checked={charts.showAreaChart}
                      onChange={() => toggleChart('showAreaChart')}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={`${styles.itemRow} ${!charts.showDepartmentBar ? styles.itemRowDisabled : ''}`}>
                  <div>
                    <div className={styles.itemTitle}>Biểu đồ phân bổ nhân lực khoa phòng</div>
                    <div className={styles.itemDesc}>Tỷ lệ bác sĩ, nhân viên trực tại các khoa phòng mũi nhọn.</div>
                  </div>
                  <label className={styles.switchWrap}>
                    <input
                      type="checkbox"
                      checked={charts.showDepartmentBar}
                      onChange={() => toggleChart('showDepartmentBar')}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={`${styles.itemRow} ${!charts.showSatisfactionGauge ? styles.itemRowDisabled : ''}`}>
                  <div>
                    <div className={styles.itemTitle}>Đồng hồ chỉ số hài lòng người bệnh</div>
                    <div className={styles.itemDesc}>Tổng hợp điểm khảo sát trải nghiệm dịch vụ theo chuẩn Bộ Y tế.</div>
                  </div>
                  <label className={styles.switchWrap}>
                    <input
                      type="checkbox"
                      checked={charts.showSatisfactionGauge}
                      onChange={() => toggleChart('showSatisfactionGauge')}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>

                <div className={`${styles.itemRow} ${!charts.showSlaStats ? styles.itemRowDisabled : ''}`}>
                  <div>
                    <div className={styles.itemTitle}>Bảng hiệu suất cam kết xử lý SLA</div>
                    <div className={styles.itemDesc}>Tỷ lệ giải quyết góp ý đúng hẹn và thời gian phản hồi trung bình.</div>
                  </div>
                  <label className={styles.switchWrap}>
                    <input
                      type="checkbox"
                      checked={charts.showSlaStats}
                      onChange={() => toggleChart('showSlaStats')}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            Khôi phục mặc định
          </button>
          <div className={styles.footerActionGroup}>
            <button type="button" className={styles.resetBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              Áp dụng thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
