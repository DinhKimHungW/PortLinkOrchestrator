# Test Plan
PortLink Orchestrator — v1.0 (Demo)

---

## 1. Mục tiêu
- Đảm bảo các yêu cầu chức năng RQF-001..015 và phi chức năng RQN được đáp ứng cho phạm vi demo.
- Xác minh kịch bản demo vận hành trơn tru trong điều kiện thực tế giả lập.

## 2. Phạm vi
- In-scope: Auth/RBAC, Dashboard Gantt, Incident Form, Greedy Engine, Logs, KPIs, Admin cơ bản, i18n.
- Out-of-scope: Tích hợp API ngoài, drag-drop nâng cao, CP-SAT engine.

## 3. Cách tiếp cận (Strategy)
- Unit Test (tuỳ chọn): Greedy Engine, API endpoints chính (Node script hoặc Jest nếu bổ sung).
- Integration Test: Incident → Engine → Schedule update → Logs (dùng Postman/curl hoặc script fetch).
- UI/Manual Test: Vue UI views, responsive, i18n switch.
- Performance Test: Thời gian tái sắp lịch < 5s; tải dashboard < 3s (mô phỏng nhỏ).

## 4. Môi trường kiểm thử
- Node.js 18+ local; JSON files (backend/data/) seed tự động.
- Browsers: Chrome/Edge mới nhất; mobile viewport iPhone/Android.

## 5. Tiêu chí vào/ra
- Entry: API & UI build pass; seed data có sẵn; engine hoạt động cơ bản.
- Exit: Tất cả test critical pass; demo kịch bản đạt thời gian yêu cầu; không có bug blocker.

## 6. Lịch & Nguồn lực
- Thực hiện song song tuần 4–6: unit test (w3-w4), integration + UI test (w5), rehearsal (w6).

## 7. Rủi ro kiểm thử
- Biểu đồ Gantt phụ thuộc dữ liệu thời gian → tạo fixture ổn định.
- Dao động hiệu năng do máy trạm → đo lặp 3 lần, lấy trung vị.

## 8. Ma trận bao phủ (Mapping)
- Chức năng: RQF-001..015 → Test cases tương ứng (xem Test Cases.md)
- Phi chức năng: RQN-001..012 → Perf/i18n/usability checks.

## 9. Công cụ
- Postman/curl; tuỳ chọn Jest + supertest nếu thêm dev deps; tuỳ chọn Playwright/Selenium cho E2E.

## 10. Báo cáo & Theo dõi lỗi
- Ghi log kết quả test, chụp màn hình UI khi lỗi.
- Theo dõi bug trong issue tracker; ưu tiên P0 (blocker) → fix trước demo.
