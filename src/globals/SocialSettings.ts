import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
export const SocialSettings: GlobalConfig = {
  slug: 'social-settings', label: 'Mạng xã hội', admin: { group: 'Trang chủ & Giao diện', hidden: true, description: 'Dữ liệu tương thích cũ. Mạng xã hội hiện được quản lý tập trung tại Header & Nhận diện.' }, access: { read: loggedIn, update: loggedIn }, versions: { max: 20 },
  fields: [
    { name: 'facebookUrl', label: 'Facebook', type: 'text' }, { name: 'zaloUrl', label: 'Zalo', type: 'text' },
    { name: 'youtubeUrl', label: 'YouTube', type: 'text' }, { name: 'tiktokUrl', label: 'TikTok', type: 'text' },
  ],
}
