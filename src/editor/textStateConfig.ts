export const textStateConfig = {
  fontSize: {
    '12': { label: 'Cỡ chữ 12', css: { 'font-size': '12px' } },
    '14': { label: 'Cỡ chữ 14', css: { 'font-size': '14px' } },
    '16': { label: 'Cỡ chữ 16', css: { 'font-size': '16px' } },
    '18': { label: 'Cỡ chữ 18', css: { 'font-size': '18px' } },
    '20': { label: 'Cỡ chữ 20', css: { 'font-size': '20px' } },
    '24': { label: 'Cỡ chữ 24', css: { 'font-size': '24px' } },
    '28': { label: 'Cỡ chữ 28', css: { 'font-size': '28px' } },
    '32': { label: 'Cỡ chữ 32', css: { 'font-size': '32px' } },
    '36': { label: 'Cỡ chữ 36', css: { 'font-size': '36px' } }
  },
  color: {
    default: { label: 'Màu mặc định', css: { color: '#18344e' } },
    blue: { label: 'Xanh bệnh viện', css: { color: '#0878d1' } },
    darkBlue: { label: 'Xanh đậm', css: { color: '#075fa5' } },
    red: { label: 'Đỏ', css: { color: '#d9363e' } },
    green: { label: 'Xanh lá', css: { color: '#198754' } },
    orange: { label: 'Cam', css: { color: '#c96b15' } },
    gray: { label: 'Xám', css: { color: '#667f93' } }
  },
  highlight: {
    highlightYellow: { label: 'Nền vàng', css: { 'background-color': '#fff3bf' } },
    highlightBlue: { label: 'Nền xanh nhạt', css: { 'background-color': '#eaf6ff' } },
    highlightGreen: { label: 'Nền xanh lá nhạt', css: { 'background-color': '#eaf7ef' } },
    highlightRed: { label: 'Nền đỏ nhạt', css: { 'background-color': '#fff0f0' } }
  }
} as const
