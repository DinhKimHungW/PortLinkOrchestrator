# Deployment Plan
PortLink Orchestrator — v1.0 (Demo, cPanel / Static Friendly)

---

## 1. Mục tiêu
- Cung cấp cách triển khai đơn giản, ổn định cho demo trên cPanel/shared hosting: Node.js backend + static frontend, không cần Docker.

## 2. Kiến trúc triển khai
Option A (đề xuất): cPanel Node App + Static Frontend
- Backend: Node.js (file `backend/server.js`) chạy như một Node App trên cPanel.
- Frontend: Thư mục `frontend/` (Vue + Plotly + Three.js) upload vào `public_html`.
- Data: JSON files ở `backend/data/` (đảm bảo quyền ghi).

Option B: Tách Backend & Static Hosting
- Backend chạy ở một VPS/Node hosting nhỏ.
- Frontend vẫn là static files trên cPanel (public_html).

## 3. Biến môi trường
- PORT=8000 (tuỳ chỉnh nếu cần)
- JWT_SECRET=<random-strong-string>
- DEFAULT_LANG=vi

## 4. Quy trình triển khai (tổng quát)
- Upload mã nguồn: `backend/` và `frontend/` lên hosting.
- Tạo Node.js App trong cPanel, trỏ Application root tới `backend/`, Startup file: `server.js`.
- Cấu hình biến môi trường (JWT_SECRET), đảm bảo `backend/data/` có quyền ghi.
- Mở `frontend/index.html` qua domain public để dùng UI.

## 5. Chuẩn bị dữ liệu
- Lần chạy đầu, backend sẽ tự seed: users (admin/ops/driver), assets (berth/cranes), visits & tasks A/B.

## 6. Kiểm tra sau triển khai (Smoke)
- GET /healthz trả 200 với { ok: true }
- Đăng nhập được (admin, ops, driver)
- Dashboard hiển thị Gantt
- Gửi incident → lịch cập nhật (schedule version tăng)
- Logs có bản ghi mới; Export CSV tải về được

## 7. Giám sát & Log
- Xem stdout/stderr của Node App trên cPanel.
- Sao lưu thư mục `backend/data/` định kỳ.
- Nếu public internet: bật HTTPS qua cPanel/Cloudflare.

## 8. Rollback
- Giữ bản sao `backend/` và `frontend/` version N-1.
- Khôi phục thư mục `backend/data/` từ backup hoặc để backend tự seed lại demo.

## 9. Bảo mật
- Băm mật khẩu (demo dùng SHA-256; sản xuất nên dùng bcrypt/argon2).
- Không commit JWT_SECRET; cấu hình qua env.
- Bật HTTPS nếu internet-facing.

## 10. Hạn chế Shared Hosting
- Không hỗ trợ Process manager phức tạp: dùng Node App chuẩn của cPanel.
- Tài nguyên thấp: giữ JSON nhỏ gọn; giới hạn log; giảm tần suất refresh ở UI.
