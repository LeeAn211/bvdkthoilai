/**
 * Helper kiểm tra trạng thái hiển thị đa thiết bị
 * Các giá trị hỗ trợ:
 * - 'both': Hiển thị trên cả hai (mặc định)
 * - 'desktop_only': Chỉ hiển thị trên Desktop (màn hình >= 900px hoặc >= 1024px)
 * - 'mobile_only': Chỉ hiển thị trên Mobile (màn hình < 900px hoặc < 1024px)
 * - 'hidden': Tắt hoàn toàn trên cả hai
 */

export type DeviceVisibility = 'both' | 'desktop_only' | 'mobile_only' | 'hidden'

export function isVisibleOnDevice(mode?: string | null): boolean {
  if (!mode || mode === 'both' || mode === 'desktop_only' || mode === 'mobile_only') {
    return true
  }
  return false
}

/**
 * Trả về class CSS để điều khiển ẩn/hiện theo media query
 * - 'desktop_only' -> 'show-desktop-only' (ẩn trên mobile < 1024px / < 900px)
 * - 'mobile_only'  -> 'show-mobile-only'  (ẩn trên desktop >= 1024px / >= 900px)
 * - 'hidden'       -> 'hide-all-devices'   (display: none)
 * - 'both'         -> ''                  (hiển thị bình thường)
 */
export function getVisibilityClass(mode?: string | null): string {
  if (mode === 'desktop_only') return 'showOnDesktopOnly'
  if (mode === 'mobile_only') return 'showOnMobileOnly'
  if (mode === 'hidden') return 'hideOnAllDevices'
  return ''
}

export function shouldRender(mode?: string | null): boolean {
  return mode !== 'hidden'
}
