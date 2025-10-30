# User Manual & Guide (VN/EN)
PortLink Orchestrator — v1.0 (Demo)

---

## 1. Giới thiệu (Introduction)
- Hệ thống hỗ trợ điều phối cảng với engine Greedy tự động sắp lịch khi có sự cố.
- Vai trò: P-1 (OPS), P-2 (Driver/Thuyền trưởng), P-3 (Admin).
- UI dựa trên **Vue 3** (SPA), biểu đồ **Plotly**, khối 3D minh hoạ bằng **Three.js**.

## 2. Đăng nhập (Login)
- Nhập tên đăng nhập và mật khẩu, chọn ngôn ngữ (VN/EN) nếu cần.
- Sau khi đăng nhập thành công, giao diện sẽ hiển thị theo vai trò.

## 3. Dành cho OPS (P-1)
### 3.1 Dashboard
- Cột trái: Form sự cố, Notification Center (10 log mới nhất), KPIs.
- Cột phải: Biểu đồ Gantt (Plotly) hiển thị lịch 24h.
- Nút Refresh: cập nhật dữ liệu mới nhất sau khi có sự cố / thay đổi.

### 3.2 Đọc biểu đồ Gantt
- Trục Y: tài sản (Bến 1, Cầu 1, Cầu 2…)
- Trục X: thời gian
- Thanh màu: tác vụ (gắn với tàu/visit). Di chuột để xem chi tiết.

### 3.3 KPIs
- % xung đột, thời gian chờ trung bình, % sử dụng bến (mô phỏng).

## 4. Dành cho Driver/Thuyền trưởng (P-2)
### 4.1 Gửi Báo cáo Sự cố
- Nhấn nút “BÁO CÁO SỰ CỐ”.
- Chọn loại sự cố (tàu trễ, thời tiết xấu, hỏng cầu…).
- Chọn đối tượng ảnh hưởng (tàu hoặc tài sản), nhập chi tiết (phút trễ, lý do) → Gửi.
- Hệ thống sẽ tự tính lại lịch; bạn có thể xem nhiệm vụ liên quan của mình.

## 5. Dành cho Admin (P-3)
### 5.1 Quản lý Users
- Tạo mới, vô hiệu hóa người dùng. Phân vai (OPS/Driver/Admin).

### 5.2 Quản lý Assets
- Tạo/sửa/xóa Bến, Cầu, Xe; thay đổi trạng thái (Active/Maintenance).

## 5.3 Cấu hình API (khi deploy)
- Trên UI (header), trường "API" cho phép nhập URL API backend nếu không chạy cùng domain (ví dụ Node App trên cPanel).

## 6. Đa ngôn ngữ (Language)
- Dùng switch VN/EN ở UI. Nội dung chính và label sẽ đổi tương ứng.

## 7. Xuất Log (Export)
- Mở Notification Center → nút Export CSV hoặc truy cập trang log export.
- File CSV có thể dùng làm evidence cho điều phối.

## 8. Câu hỏi thường gặp (FAQ)
- Q: Tại sao lịch chưa cập nhật ngay?  
  A: Thử dùng nút Refresh. Nếu vẫn chưa, kiểm tra kết nối hoặc liên hệ Admin.
- Q: Không đăng nhập được?  
  A: Kiểm tra username/password hoặc hỏi Admin để reset.

## 9. Sự cố phổ biến & Khắc phục
- Không thấy Gantt: kiểm tra token đăng nhập và quyền. Reload trang.
- Gửi sự cố báo lỗi: thiếu trường bắt buộc (loại, đối tượng, thời gian). Điền đủ và gửi lại.

## 10. Ghi chú Demo
- Dữ liệu là mô phỏng; engine Greedy xử lý ràng buộc tối thiểu theo kịch bản.
- Tính năng nâng cao (CP-SAT, drag-drop) sẽ bổ sung ở phiên bản sau.
- Backend chạy Node.js; dữ liệu lưu ở `backend/data/*.json` (phù hợp cPanel).
