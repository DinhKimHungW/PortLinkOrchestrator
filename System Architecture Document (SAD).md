# System Architecture Document (SAD)
PortLink Orchestrator — Phiên bản 1.0 (Demo, Node.js + Vue)

Tài liệu này mô tả kiến trúc hệ thống để đáp ứng SRS v1.0. Ngôn ngữ: Tiếng Việt (có phụ đề tiếng Anh khi cần).

---

## 1. Mục tiêu kiến trúc (Architecture Goals)
- Chứng minh năng lực cốt lõi: khi có sự cố (ví dụ tàu trễ) hệ thống tự tối ưu lại lịch trong < 5 giây (RQN-001), cập nhật biểu đồ Gantt ngay (RQF-012).
- Giao diện nhanh, đơn giản, responsive (RQN-003, RQN-004).
- Kiến trúc modular, có thể nâng cấp dần lên microservices (RQN-006), vẫn đơn giản để demo và đóng gói (RQN-009).
- Hỗ trợ phân quyền: OPS, Driver, Admin (RQF-004).
- Hỗ trợ song ngữ VN/EN (RQN-012).

Assumptions:
- Backend Node.js expose REST API (HTTP core, no external deps) theo API Spec v1.
- Frontend dùng Vue 3 (static) gọi REST API để hiển thị Gantt (Plotly), form sự cố, log, KPI; có 3D cơ bản (Three.js).
- Lưu trữ: JSON files cho demo/cPanel; có phương án chuyển lên DB thật nếu mở rộng.

---

## 2. Sơ đồ ngữ cảnh (Context)
Actors:
- P-1 OPS (Desktop Web)
- P-2 Driver/Thuyền trưởng (Mobile Web Responsive)
- P-3 Admin (Desktop Web)

Context Flow:
- Người dùng → Streamlit UI → Backend API → Database
- Backend sinh Log (EventLog) → UI hiển thị Notification Center
- Backend Engine Greedy tính toán lại Schedule/Tasks khi nhận Incident

---

## 3. Kiến trúc logic (Logical View)
Các thành phần chính:
- UI (Vue 3 static):
  - Dashboard (Gantt Plotly, KPIs, Refresh)
  - Incident Form (báo sự cố)
  - Notification Center (log + CSV export)
  - Admin UI (quản lý tài sản)
  - i18n switch (VN/EN) + 3D view (Three.js)
- API (Node.js REST):
  - Auth & RBAC: Đăng nhập, JWT, kiểm tra vai trò (OPS/Driver/Admin)
  - Assets Service: Quản lý Berth/Crane/Truck
  - ShipVisit & Task Service: Lưu và truy xuất lịch
  - Incident Service: Nhận sự cố và kích hoạt Engine
  - Schedule Service: Xuất lịch hiện tại (phiên bản, window thời gian)
  - Log Service: Ghi/đọc EventLog (JSON), xuất CSV
  - KPI Service: Tính các chỉ số mô phỏng
- Greedy Scheduling Engine:
  - Input: Sự cố + Tasks hiện có + Ràng buộc đơn giản
  - Rule: Push-forward theo Asset để loại bỏ xung đột
  - Output: Lịch mới (Task Start/End cập nhật), log thay đổi, tăng version
- Data Layer: Đọc/ghi JSON files (backend/data)
- Storage: JSON (demo) / nâng cấp DB khi cần

Boundary/Interfaces:
- UI ↔ API: JSON over HTTP, Bearer JWT, Accept-Language: vi|en
- API ↔ DB: ORM/SQL; migrations (Alembic) khi cần

---

## 4. Luồng nghiệp vụ chính (Process View)
### 4.1. Xử lý sự cố → Tự sắp lịch (Greedy)
1) P-2 hoặc P-1 mở Form, gửi Incident (tàu A trễ +60m, lý do…)
2) API xác thực, ghi EventLog("Incident received")
3) Incident Service nạp lịch/constraints, gọi Greedy Engine
4) Engine:
   - Cập nhật ETA/Start/End của tàu A
   - Tìm xung đột trên cùng tài nguyên (berth/crane)
   - Đẩy (push-forward) các task sau theo thứ tự thời gian đến khi hết xung đột
   - Ghi EventLog chi tiết thay đổi
5) Schedule Service ghi phiên bản lịch mới, trả kết quả cho UI
6) UI tự refresh/hoặc nhấn Refresh để thấy Gantt cập nhật

### 4.2. Đăng nhập & phân quyền
- Admin tạo tài khoản (P-1, P-2)
- Người dùng đăng nhập → JWT → UI lưu tạm (session)
- Mỗi request kèm Bearer token → API kiểm tra role → cho phép/không cho phép

---

## 5. Kiến trúc triển khai (Deployment View)
Option A (khuyến nghị v1.0 trên cPanel):
- Node App (API) chạy `backend/server.js`.
- Static UI: phục vụ `frontend/index.html` từ `public_html`.
- Storage: `backend/data/*.json`.

Option B (chuẩn hóa, thuận microservices):
- API Node.js riêng; UI static trên CDN/cPanel; DB thật (Postgres).

Networking & Ports:
- UI: static (HTTP/HTTPS qua web server/cPanel)
- API: 8000 (Node HTTP) hoặc port do hosting cung cấp

Config qua biến môi trường:
- JWT_SECRET, PORT, DEFAULT_LANG=vi

---

## 6. Mô hình dữ liệu (Data View)
Thực thể (rút gọn), theo SRS:
- User(UserID, Username, PasswordHash, Role)
- Asset(AssetID, Name, Type{Berth,Crane,Truck}, Status)
- ShipVisit(VisitID, ShipName, ETA_original, ETA_actual, Status)
- Task(TaskID, VisitID, AssetID, StartTime, EndTime, Type)
- Schedule(ScheduleID, Version, CreatedAt, IsActive)
- Schedule_Task_Link(FK_ScheduleID, FK_TaskID)
- EventLog(LogID, Timestamp, UserID, EventType, Description, Affected_AssetID, Affected_VisitID)

Chỉ mục gợi ý:
- Task(AssetID, StartTime)
- EventLog(Timestamp DESC)
- User(Username UNIQUE)

---

## 7. Bảo mật (Security)
- JWT Bearer cho API; HTTPS khi triển khai.
- Mật khẩu băm (bcrypt/argon2).
- RBAC: P-1 (full dashboard), P-2 (incident form + my tasks), P-3 (admin mgmt).
- Log sự kiện có dấu vết người dùng; retention ≥ 90 ngày (RQN-010).

---

## 8. Thuộc tính chất lượng (Quality Attributes)
- Performance: Greedy O(n log n) với sắp xếp tasks theo thời gian; mục tiêu < 5s cho quy mô demo (10–50 events/h) (RQN-001, RQN-005).
- Usability: Streamlit components + responsive layout; tối thiểu thao tác cho P-2 (mobile) (RQN-003, RQN-004).
- Modifiability: Phân lớp rõ (UI/API/Engine/DAL), dễ thay Greedy bằng CP-SAT sau này (RQN-006).
- Deployability: Docker image nhỏ gọn; SQLite/PG tùy môi trường (RQN-009).

---

## 9. Rủi ro & Biện pháp
- R1: Engine Greedy không xử lý hết ràng buộc nghiệp vụ phức tạp → Giới hạn phạm vi demo, thêm test case mô phỏng và log rõ.
- R2: Streamlit + API chung container có thể phức tạp quản trị → Có phương án tách khi cần (Option B).
- R3: Hiệu năng với nhiều task → Chỉ mục DB, batch updates, tránh N+1.

---

## 10. Phụ lục
- Thuật toán Greedy push-forward (pseudo):
```
1. Apply incident delta to affected task(s)
2. Sort tasks by StartTime within each resource (AssetID)
3. For each resource timeline:
   for i from 1..n:
     if tasks[i] overlaps tasks[i-1]:
        tasks[i].StartTime = tasks[i-1].EndTime
        tasks[i].EndTime   = tasks[i].StartTime + duration(tasks[i])
        record change in EventLog
4. Persist schedule version and return
```
