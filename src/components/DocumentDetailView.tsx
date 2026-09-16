'use client'

import React, { useState, useEffect } from 'react'
import styles from './DocumentDetailView.module.css'
import { DocumentProtection } from './DocumentProtection'

export interface DocumentDetailData {
  id: string | number
  title: string
  number?: string
  issuedAt?: string
  effectiveAt?: string
  documentType?: string
  category?: string
  issuer?: string
  signer?: string
  summary?: string
  content?: any
  fileUrl?: string
  fileName?: string
  fileSize?: string | number
  fileFormat?: string
  accessMode?: 'public' | 'pin' | 'internal' | 'locked'
  pinCode?: string
  defaultPin?: string
  allowDownload?: boolean
  preventCopy?: boolean
  showViewer?: boolean
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  titleColor?: 'default' | 'navy' | 'blue' | 'green' | 'red'
  titleSize?: 'normal' | 'large' | 'xlarge'
  summaryColor?: 'default' | 'slate' | 'dark'
  summarySize?: 'normal' | 'large' | 'small'
}

export function DocumentDetailView({ doc }: { doc: DocumentDetailData }) {
  const isPinProtected = doc.accessMode === 'pin'
  const isFullyLocked = doc.accessMode === 'locked'
  const sessionKey = `doc_pin_unlocked_${doc.id}`

  // Trạng thái đã mở khóa mã PIN hay chưa
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false)
  const [pinInput, setPinInput] = useState<string>('')
  const [pinError, setPinError] = useState<string>('')
  const [showPinModal, setShowPinModal] = useState<boolean>(false)

  // Đọc trạng thái đã mở khóa từ sessionStorage khi vào trang
  useEffect(() => {
    if (!isPinProtected) {
      setIsUnlocked(true)
      return
    }
    try {
      const saved = sessionStorage.getItem(sessionKey)
      if (saved === 'true') {
        setIsUnlocked(true)
      }
    } catch {}
  }, [isPinProtected, sessionKey])

  const [activeViewer, setActiveViewer] = useState<boolean>(doc.showViewer !== false && Boolean(doc.fileUrl))
  const [fullscreen, setFullscreen] = useState<boolean>(false)

  const isPdf = (doc.fileFormat || '').toLowerCase().includes('pdf') || (doc.fileUrl || '').toLowerCase().endsWith('.pdf')
  const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].some(ext =>
    (doc.fileFormat || '').toLowerCase().includes(ext) || (doc.fileUrl || '').toLowerCase().includes(`.${ext}`)
  )

  // Mã PIN hợp lệ: lấy mã riêng nếu có, nếu không lấy mã chung của viện (mặc định BVTL2026)
  const requiredPin = (doc.pinCode || doc.defaultPin || 'BVTL2026').trim().toLowerCase()

  // Hàm xử lý kiểm tra mã PIN
  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setPinError('')
    const inputClean = pinInput.trim().toLowerCase()
    if (!inputClean) {
      setPinError('Vui lòng nhập mã bảo mật.')
      return
    }

    if (inputClean === requiredPin) {
      setIsUnlocked(true)
      setShowPinModal(false)
      setPinError('')
      try {
        sessionStorage.setItem(sessionKey, 'true')
      } catch {}
    } else {
      setPinError('Mã xác thực không chính xác. Vui lòng kiểm tra lại.')
    }
  }

  // Quyền thao tác thực tế: Nếu là PIN thì phải đã unlock, nếu là locked thì luôn cấm
  const canAccessDocument = (!isPinProtected || isUnlocked) && !isFullyLocked
  const canDownload = canAccessDocument && doc.allowDownload !== false

  // Link viewer: nếu chưa unlock thì tuyệt đối không tải url file vào iframe
  const embedViewerUrl = (canAccessDocument && doc.fileUrl)
    ? isPdf
      ? `${doc.fileUrl}#toolbar=${canDownload ? '1' : '0'}&navpanes=0`
      : `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(doc.fileUrl)}`
    : ''

  return (
    <DocumentProtection
      preventCopy={Boolean(doc.preventCopy) || (isPinProtected && !isUnlocked)}
      preventPrint={isPinProtected && !isUnlocked}
    >
      <article className={styles.container}>
        {/* Banner cảnh báo bảo mật nếu có mã PIN hoặc preventCopy = true */}
        {isPinProtected && !isUnlocked && (
          <div className={styles.protectionNotice} style={{ background: '#fff2f0', borderColor: '#ffccc7', color: '#a8071a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>
              <strong>Tài liệu giới hạn lưu hành nội bộ:</strong> Toàn bộ trình xem trước, tải file và in PDF đã được bảo vệ. Vui lòng nhập mã xác thực do Bệnh viện Đa khoa Khu vực Thới Lai cung cấp để mở khóa.
            </span>
          </div>
        )}

        {(!isPinProtected || isUnlocked) && doc.preventCopy && (
          <div className={styles.protectionNotice}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>
              <strong>Tài liệu bảo vệ nội bộ:</strong> Nội dung đã được thiết lập giới hạn sao chép và chia sẻ theo quy định của Bệnh viện Đa khoa Khu vực Thới Lai.
            </span>
          </div>
        )}

        {/* Tiêu đề chính của văn bản / phác đồ điều trị */}
        <header className={`${styles.header} ${styles[`align_${doc.textAlign || 'left'}`] || ''}`}>
          <div className={`${styles.badgeGroup} ${doc.textAlign === 'center' ? styles.justifyCenter : doc.textAlign === 'right' ? styles.justifyEnd : ''}`}>
            <span className={styles.docBadge}>{doc.documentType || 'Văn bản – Tài liệu'}</span>
            {doc.category && <span className={styles.categoryBadge}>{doc.category}</span>}
            {isPinProtected && (
              <span className={styles.lockBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>{isUnlocked ? 'Đã mở khóa nội bộ' : 'Yêu cầu mã xác thực'}</span>
              </span>
            )}
            {isFullyLocked && (
              <span className={styles.lockBadge} style={{ background: '#f5f5f5', color: '#595959', borderColor: '#d9d9d9' }}>
                <span>Chỉ xem trích yếu</span>
              </span>
            )}
          </div>
          <h1 className={`${styles.title} ${styles[`titleColor_${doc.titleColor || 'default'}`] || ''} ${styles[`titleSize_${doc.titleSize || 'normal'}`] || ''}`}>
            {doc.title}
          </h1>
        </header>

        {/* Bảng thuộc tính chuẩn phong cách Cổng thông tin Sở Y tế Cần Thơ */}
        <div className={styles.tableWrapper}>
          <table className={styles.propertyTable}>
            <tbody>
              {doc.number && (
                <tr>
                  <td className={styles.colLabel}>Số ký hiệu văn bản</td>
                  <td className={styles.colValue}>
                    <strong className={styles.docNumber}>{doc.number}</strong>
                  </td>
                </tr>
              )}
              {doc.issuedAt && (
                <tr>
                  <td className={styles.colLabel}>Ngày ban hành</td>
                  <td className={styles.colValue}>{doc.issuedAt}</td>
                </tr>
              )}
              {doc.effectiveAt && (
                <tr>
                  <td className={styles.colLabel}>Ngày hiệu lực</td>
                  <td className={styles.colValue}>{doc.effectiveAt}</td>
                </tr>
              )}
              {doc.summary && (
                <tr>
                  <td className={styles.colLabel}>Trích yếu nội dung</td>
                  <td className={styles.colValue}>
                    <p className={`${styles.summaryText} ${styles[`align_${doc.textAlign || 'left'}`] || ''} ${styles[`summaryColor_${doc.summaryColor || 'default'}`] || ''} ${styles[`summarySize_${doc.summarySize || 'normal'}`] || ''}`}>
                      {doc.summary}
                    </p>
                  </td>
                </tr>
              )}
              {doc.documentType && (
                <tr>
                  <td className={styles.colLabel}>Hình thức văn bản</td>
                  <td className={styles.colValue}>{doc.documentType}</td>
                </tr>
              )}
              {doc.category && (
                <tr>
                  <td className={styles.colLabel}>Lĩnh vực / Chuyên mục</td>
                  <td className={styles.colValue}>{doc.category}</td>
                </tr>
              )}
              {doc.issuer && (
                <tr>
                  <td className={styles.colLabel}>Cơ quan ban hành</td>
                  <td className={styles.colValue}>{doc.issuer}</td>
                </tr>
              )}
              {doc.signer && (
                <tr>
                  <td className={styles.colLabel}>Người ký duyệt</td>
                  <td className={styles.colValue}>{doc.signer}</td>
                </tr>
              )}
              <tr className={`${styles.docAttachmentRow} ${isPinProtected && !isUnlocked ? styles.securityLockedRow : ''}`}>
                <td className={styles.colLabel}>Tài liệu đính kèm</td>
                <td className={styles.colValue}>
                  {doc.fileUrl ? (
                    <div className={styles.attachmentWrap}>
                      <div className={styles.fileInfo}>
                        <span className={styles.fileIcon} aria-hidden="true">
                          {isPdf ? 'PDF' : isOfficeDoc ? 'DOC' : 'FILE'}
                        </span>
                        <span className={styles.fileName}>{doc.fileName || 'Tài liệu đính kèm'}</span>
                      </div>

                      <div className={styles.actionButtonGroup}>
                        {/* Khi tài liệu được bảo vệ bằng PIN và chưa mở khóa */}
                        {isPinProtected && !isUnlocked ? (
                          <>
                            <button
                              type="button"
                              className={styles.btnUnlockModal}
                              onClick={() => setShowPinModal(true)}
                              title="Nhập mã xác thực để mở khóa tài liệu"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              <span>Nhập mã để xem & tải</span>
                            </button>
                            <span className={styles.lockedTextNotice}>
                              🔒 Đã khóa xem & tải về
                            </span>
                          </>
                        ) : isFullyLocked ? (
                          <span className={styles.downloadLocked} title="Chỉ cho phép đọc trực tuyến theo quy định">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Chỉ xem trích yếu</span>
                          </span>
                        ) : (
                          <>
                            {/* Nút xem trực tiếp */}
                            <button
                              type="button"
                              className={styles.btnView}
                              onClick={() => setActiveViewer(prev => !prev)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              <span>{activeViewer ? 'Thu gọn xem' : 'Xem trực tiếp'}</span>
                            </button>

                            {/* Nút tải về: chỉ hiển thị khi canDownload === true */}
                            {canDownload ? (
                              <a
                                href={doc.fileUrl}
                                download={doc.fileName || true}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnDownload}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7 10 12 15 17 10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Tải về</span>
                              </a>
                            ) : (
                              <span className={styles.downloadLocked} title="Chỉ cho phép đọc trực tuyến theo quy định">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <span>Chỉ xem trực tuyến</span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className={styles.noFileText}>Chưa có tệp đính kèm</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Khung khóa bảo mật khi tài liệu có PIN nhưng chưa mở khóa */}
        {isPinProtected && !isUnlocked && (
          <div className={styles.lockedViewerCard}>
            <div className={styles.lockedViewerInner}>
              <div className={styles.lockIconWrap} aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className={styles.lockedTitle}>Tài liệu lưu hành nội bộ đã được khóa</h3>
              <p className={styles.lockedDesc}>
                Để xem trực tuyến, tải tệp hoặc in tài liệu này, vui lòng nhập mã xác thực do Bệnh viện Đa khoa Khu vực Thới Lai cấp.
              </p>
              <form onSubmit={handleVerifyPin} className={styles.pinForm}>
                <div className={styles.pinInputGroup}>
                  <input
                    type="password"
                    autoComplete="off"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value)
                      setPinError('')
                    }}
                    placeholder="Nhập mã PIN bảo mật..."
                    className={`${styles.pinInput} ${pinError ? styles.pinInputError : ''}`}
                    aria-label="Mã PIN bảo mật tài liệu"
                  />
                  <button type="submit" className={styles.btnSubmitPin}>
                    <span>Mở khóa tài liệu</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
                {pinError && <p className={styles.pinErrorMsg}>{pinError}</p>}
                <p className={styles.pinHelp}>
                  Bác sĩ và Cán bộ nhân viên liên hệ Phòng Kế hoạch tổng hợp hoặc xem thông báo nội bộ để nhận mã xác thực.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Khung nhúng xem tài liệu trực tiếp khi ĐÃ MỞ KHÓA */}
        {canAccessDocument && activeViewer && doc.fileUrl && (
          <section className={`${styles.viewerSection} ${fullscreen ? styles.viewerFullscreen : ''}`}>
            <div className={styles.viewerToolbar}>
              <div className={styles.viewerTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Trình đọc tài liệu trực tiếp</span>
              </div>
              <div className={styles.toolbarActions}>
                {canDownload && (
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.toolbarBtn} title="Mở trong tab mới">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>Mở cửa sổ mới</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setFullscreen(prev => !prev)}
                  className={styles.toolbarBtn}
                  title={fullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {fullscreen ? (
                      <>
                        <polyline points="4 14 10 14 10 20"></polyline>
                        <polyline points="20 10 14 10 14 4"></polyline>
                        <line x1="14" y1="10" x2="21" y2="3"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </>
                    ) : (
                      <>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </>
                    )}
                  </svg>
                  <span>{fullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                </button>
              </div>
            </div>

            <div className={styles.frameContainer}>
              <iframe
                src={embedViewerUrl}
                className={styles.iframe}
                loading="lazy"
                title={`Nội dung ${doc.title}`}
              />
            </div>
          </section>
        )}

        {/* Modal Popup Nhập mã PIN bảo mật khi bấm nút thao tác */}
        {showPinModal && (
          <div className={styles.modalBackdrop} onClick={() => setShowPinModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowPinModal(false)}
                title="Đóng hộp thoại"
              >
                ✕
              </button>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div className={styles.lockIconWrap} style={{ width: 54, height: 54, margin: '0 auto 12px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#820014', margin: '0 0 8px' }}>
                  Xác thực mã bảo mật nội bộ
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Vui lòng nhập mã PIN do Bệnh viện ĐKKV Thới Lai cấp để mở khóa xem và tải file <strong>{doc.fileName || 'tài liệu'}</strong>:
                </p>
              </div>

              <form onSubmit={handleVerifyPin} className={styles.pinForm}>
                <input
                  type="password"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    setPinError('')
                  }}
                  placeholder="Nhập mã PIN..."
                  className={`${styles.pinInput} ${pinError ? styles.pinInputError : ''}`}
                />
                {pinError && <p className={styles.pinErrorMsg} style={{ margin: 0 }}>{pinError}</p>}
                <button type="submit" className={styles.btnSubmitPin} style={{ width: '100%', marginTop: 6 }}>
                  <span>Xác nhận & Mở khóa ngay</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </article>
    </DocumentProtection>
  )
}

