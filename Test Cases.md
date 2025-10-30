# Test Cases
PortLink Orchestrator — v1.0 (Demo)

Tham chiếu yêu cầu: RQF-001..015, RQN-001..012

---

## 1. Auth & RBAC
TC-A01 (RQF-001): Đăng nhập OPS thành công
- Steps: POST /auth/login (ops01/valid); GET /me
- Expected: 200, role=OPS; truy cập /schedule OK

TC-A02 (RQF-002): Đăng nhập Driver thành công (mobile)
- Steps: Đăng nhập; truy cập Incident form
- Expected: 200; thấy form; không thấy dashboard đầy đủ

TC-A03 (RQF-004): RBAC chặn truy cập trái phép
- Steps: Driver gọi /assets POST
- Expected: 403 Forbidden

---

## 2. Dashboard & Gantt
TC-D01 (RQF-005): Hiển thị Gantt đúng dữ liệu seed
- Steps: Gọi /schedule/active; render Gantt
- Expected: Tàu A 10:00–12:00; Tàu B 12:00–14:00; tài nguyên đúng

TC-D02 (RQF-006): Nút Refresh cập nhật lịch mới
- Steps: Tạo incident; nhấn Refresh
- Expected: Gantt cập nhật đúng phiên bản mới

TC-D03 (RQF-007): KPIs hiển thị
- Steps: GET /kpis
- Expected: Có conflictRate, avgWaitingMinutes, berthUtilization

---

## 3. Incident & Engine
TC-E01 (RQF-008/009/010): Gửi incident tàu trễ 60 phút
- Steps: POST /incidents { visitId=1, delayMinutes=60 }
- Expected: 202 accepted; EventLog ghi nhận

TC-E02 (RQF-011): Giải quyết xung đột bằng push-forward
- Pre: Seed A:10-12, B:12-14 cùng Berth1
- Steps: E01
- Expected: A → 11-13; B → 13-15; không overlap cùng Asset

TC-E03 (RQF-012): Gantt cập nhật ngay
- Steps: Sau E02, gọi /schedule/active và UI refresh
- Expected: Thấy thanh thời gian mới

---

## 4. Logs & Export
TC-L01 (RQF-013): Notification Center có log mới nhất
- Steps: Sau incident, GET /logs?limit=10
- Expected: Có 2 log: incident + schedule update

TC-L02 (RQF-014): Xuất CSV
- Steps: GET /logs/export.csv
- Expected: Content-Type text/csv, có header, có dòng log

---

## 5. Admin
TC-AD01 (RQF-015): Quản lý tài sản
- Steps: Admin POST /assets, GET /assets
- Expected: Tài sản mới xuất hiện, có thể dùng cho task

---

## 6. Non-Functional
TC-NF00: Health endpoint
- Steps: GET /healthz
- Expected: 200 { ok: true }

TC-NF01 (RQN-001): Engine < 5s
- Steps: Đo thời gian từ POST /incidents đến khi /schedule/active đổi version
- Expected: < 5s (demo scale)

TC-NF02 (RQN-002): Dashboard load < 3s
- Steps: đo TTFB + render nhẹ
- Expected: < 3s trên máy demo

TC-NF03 (RQN-003): Responsive
- Steps: Inspect responsive UI (mobile width)
- Expected: Incident form dùng component phù hợp

TC-NF04 (RQN-010): Log retention
- Steps: Thiết lập job dọn dữ liệu cũ > 90 ngày; test bằng dữ liệu giả
- Expected: Không còn bản ghi quá hạn

TC-NF05: cPanel deployable
- Steps: Upload backend (Node App) + frontend (static) và cấu hình JWT_SECRET
- Expected: UI hoạt động, API trả dữ liệu, không cần Docker
