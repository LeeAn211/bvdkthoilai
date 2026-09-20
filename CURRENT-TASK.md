# CURRENT TASK — Kiểm tra & sửa lỗi local

## Trạng thái: ✅ HOÀN THÀNH

## Vấn đề đã phát hiện và sửa

### Lỗi 1: File `danh-cho-nguoi-benh/page.tsx` bị corrupt encoding
- Agent cũ đã dùng `Set-Content` PowerShell sai encoding → toàn bộ text tiếng Việt bị biến thành `?`
- **Fix**: Khôi phục file từ `git show HEAD` bằng StreamWriter UTF-8

### Lỗi 2: RichText crash khi render list node thiếu trường `tag`
- **Nguyên nhân gốc**: Dữ liệu Lexical lưu trong DB (`content_block_content`) có `list` node với `listType: "bullet"` nhưng không có trường `tag`
- Payload's `ListJSXConverter` mặc định dùng `const NodeTag = node.tag` → `undefined` → "Element type is invalid: got: undefined"
- **Các trang bị ảnh hưởng**: `/danh-cho-nguoi-benh`, `/dieu-tri-noi-tru`, `/chat-luong-benh-vien` (đều có `content_block_content` có data với list node)
- **Fix**: Thêm custom converter `list` vào `RichText.tsx` để tự suy ra `tag` từ `listType` khi `tag` bị thiếu

```typescript
list: (args: any) => {
  const { node, nodesToJSX } = args
  const tag = node.tag || (node.listType === 'number' ? 'ol' : 'ul')
  const children = nodesToJSX({ nodes: node.children })
  const Tag = tag as 'ul' | 'ol'
  return <Tag className={`list-${node?.listType}`}>{children}</Tag>
},
```

## Kết quả kiểm tra sau fix
- ✅ `/danh-cho-nguoi-benh` — 200 OK
- ✅ `/dieu-tri-noi-tru` — 200 OK
- ✅ `/chat-luong-benh-vien` — 200 OK
- ✅ Trang chủ, quy-trinh, so-do, goi-kham, hoi-dap, gop-y, lien-he — đều OK
