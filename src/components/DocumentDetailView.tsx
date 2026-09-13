'use client'

import React, { useState } from 'react'
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
  const [activeViewer, setActiveViewer] = useState<boolean>(doc.showViewer !== false && Boolean(doc.fileUrl))
  const [fullscreen, setFullscreen] = useState<boolean>(false)

  const isPdf = (doc.fileFormat || '').toLowerCase().includes('pdf') || (doc.fileUrl || '').toLowerCase().endsWith('.pdf')
  const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].some(ext =>
    (doc.fileFormat || '').toLowerCase().includes(ext) || (doc.fileUrl || '').toLowerCase().includes(`.${ext}`)
  )

  // Link viewer: nếu là Office doc hoặc môi trường cần proxy, dùng Google Docs Viewer. Nếu là PDF thì có thể nhúng trực tiếp hoặc qua Viewer.
  const embedViewerUrl = doc.fileUrl
    ? isPdf
      ? `${doc.fileUrl}#toolbar=${doc.allowDownload !== false ? '1' : '0'}&navpanes=0`
      : `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(doc.fileUrl)}`
    : ''

  return (
    <DocumentProtection preventCopy={Boolean(doc.preventCopy)}>
      <article className={styles.container}>
        {/* Banner cảnh báo bảo mật nếu preventCopy = true */}
        {doc.preventCopy && (
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
              <tr className={styles.docAttachmentRow}>
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
                        {/* Nút xem trực tiếp */}
                        <button
                          type="button"
                          className={styles.btnView}
                          onClick={() => setActiveViewer(prev => !prev)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>{activeViewer ? 'Thu gọn xem' : 'Xem trực tiếp'}</span>
                        </button>

                        {/* Nút tải về: chỉ hiển thị khi allowDownload !== false */}
                        {doc.allowDownload !== false ? (
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

        {/* Khung nhúng xem tài liệu trực tiếp (Document Viewer tương tự Sở Y tế Cần Thơ) */}
        {activeViewer && doc.fileUrl && (
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
                {doc.allowDownload !== false && (
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
      </article>
    </DocumentProtection>
  )
}
