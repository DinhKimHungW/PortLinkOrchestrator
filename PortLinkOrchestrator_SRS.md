# Đặc tả Yêu cầu Phần mềm (SRS)
**Dự án:** PortLink Orchestrator
**Ngày tạo:** 29/10/2025
**Phiên bản:** 1.0

---

## 1. Giới thiệu & Mục tiêu

### 1.1. Giới thiệu
Dự án PortLink Orchestrator nhằm xây dựng một hệ thống "nhạc trưởng số của cảng". Hệ thống giải quyết vấn đề điều phối thủ công, rời rạc hiện nay tại các cảng (qua điện thoại, email, Excel). Tình trạng này dẫn đến xung đột lịch, phản ứng chậm với sự cố, và gây tổn thất lớn về chi phí, thời gian.

Giải pháp là một nền tảng web sử dụng các "Tác nhân AI" (Agents) đại diện cho Tàu, Bến, Cầu, và Xe để tự động đàm phán và sắp xếp lịch trình tối ưu theo thời gian thực.

### 1.2. Mục tiêu Phiên bản 1.0
Mục tiêu chính của phiên bản 1.0 là: **"Demo ý tưởng một cách thực tế và thuyết phục"**.

Hệ thống phải chứng minh được khả năng cốt lõi: tiếp nhận sự cố (ví dụ: tàu trễ) và tự động tính toán, cập nhật lại toàn bộ lịch trình bị ảnh hưởng trong vài giây, đồng thời hiển thị trực quan sự thay đổi đó cho người điều phối.

---

## 2. Phạm vi (Scope)

### 2.1. Trong phạm vi (In-Scope)
* **Nền tảng:** Ứng dụng web, có hỗ trợ **giao diện Responsive** (tối ưu cho di động).
* **Người dùng (Personas):**
    1.  **P-1 (Ưu tiên #1):** Điều phối viên nội cảng (OPS/Control Room).
    2.  **P-2 (Ưu tiên #2):** Thuyền trưởng / Tài xế (dùng mobile để báo cáo).
* **Tính năng chính:**
    * **Bảng điều khiển (Dashboard):** Hiển thị lịch trình (Tàu, Bến, Cầu) dưới dạng biểu đồ Gantt (dùng Plotly).
    * **Xử lý sự cố:** Người dùng nhập sự cố (tàu trễ, mưa, bảo trì) qua **Biểu mẫu (Form)** đơn giản.
    * **Engine tối ưu:** Sử dụng thuật toán **Greedy push-forward** để tự động sắp xếp lại lịch khi có sự cố.
    * **Trung tâm thông báo (Notification Center):** Hiển thị **Log hệ thống** (mô phỏng) về các thay đổi và sự kiện.
* **Công nghệ:**
    * Backend: **Node.js** (REST API, JWT, JSON-file storage).
    * Frontend: **Vue 3** (static SPA) + **Plotly** (Gantt) + **Three.js** (3D cơ bản).
* **Ngôn ngữ:** Hỗ trợ song ngữ **Tiếng Việt / Tiếng Anh**.

### 2.2. Ngoài phạm vi (Out-of-Scope)
* Tính năng "Chat UI tự nhiên (NLU)".
* Engine tối ưu nâng cao CP-SAT (OR-Tools) (sẽ là tùy chọn cho tương lai).
* Các nhóm người dùng: Quản lý Bến/Cầu và Giám sát Kho/Bãi.
* Tích hợp tự động với API bên thứ 3 (thời tiết, AIS tàu). Dữ liệu sẽ được nhập thủ công.
* Gửi thông báo thực (SMS, Email).
* Tương tác kéo-thả (drag-and-drop) phức tạp trên biểu đồ Gantt.

---

## 3. Thuật ngữ & Từ viết tắt
* **OPS:** Operations / Điều phối viên nội cảng.
* **Agent:** Tác nhân AI (đại diện cho Tàu, Bến, Cầu...).
* **Constraint Scheduling:** Lập lịch theo ràng buộc.
* **Greedy:** Thuật toán "tham lam", giải pháp mặc định để tối ưu lịch.
* **Gantt:** Biểu đồ Gantt, trực quan hóa lịch trình theo thời gian.
* **KPI:** Key Performance Indicator (Chỉ số hiệu suất).
* **NLU:** Natural Language Understanding (Hiểu ngôn ngữ tự nhiên).

---

## 4. Các bên liên quan & Người dùng (Personas)

| ID | Vai trò | Mô tả | Nhu cầu chính | Nền tảng sử dụng |
| :--- | :--- | :--- | :--- | :--- |
| **P-1** | **Điều phối viên (OPS)** | (Ưu tiên #1) Người giám sát toàn bộ hoạt động của cảng. | Xem bức tranh tổng thể, phát hiện xung đột, ra quyết định điều phối. | Desktop (Web) |
| **P-2** | **Thuyền trưởng / Tài xế** | (Ưu tiên #2) Người trực tiếp vận hành (tàu, xe). | Báo cáo sự cố (trễ giờ, hỏng hóc) nhanh chóng, đơn giản. | Di động (Web Responsive) |
| **P-3** | **Quản trị viên (Admin)** | Người cấu hình hệ thống (tài khoản, tài sản cảng). | Thêm/sửa/xóa tài khoản, cấu hình bến, cầu. | Desktop (Web) |

---

## 5. Yêu cầu Chức năng (Functional Requirements)

Sử dụng định dạng User Story (Là một [Vai trò], tôi muốn [Hành động], để [Mục đích]).

### Module 1: Quản lý Tài khoản & Xác thực
* **RQF-001:** Là một (P-1, P-3), tôi muốn đăng nhập vào hệ thống bằng Tên đăng nhập và Mật khẩu để truy cập các chức năng theo vai trò của mình.
* **RQF-002:** Là một (P-2), tôi muốn đăng nhập vào hệ thống (có thể bằng giao diện đơn giản hơn) trên di động để gửi báo cáo.
* **RQF-003:** Là một (P-3), tôi muốn tạo/vô hiệu hóa tài khoản cho P-1 và P-2 để quản lý người dùng.
* **RQF-004:** (Hệ thống) Phải phân quyền: P-1 xem được toàn bộ dashboard, P-2 chỉ xem được form báo cáo và nhiệm vụ của mình.

### Module 2: Bảng điều khiển Trực quan (OPS Dashboard)
* **RQF-005:** Là một (P-1), tôi muốn xem một biểu đồ Gantt (dùng Plotly) hiển thị lịch trình của tất cả Tàu, Bến, và Cầu theo trục thời gian thực, để tôi biết tài sản nào đang rảnh, tài sản nào đang bận.
* **RQF-006:** Là một (P-1), tôi muốn biểu đồ Gantt tự động làm mới hoặc có nút "Làm mới" để cập nhật lịch trình mới nhất sau khi có sự cố.
* **RQF-007:** Là một (P-1), tôi muốn xem các KPI mô phỏng chính (ví dụ: % xung đột, thời gian chờ trung bình) trên dashboard, để đánh giá hiệu suất vận hành.

### Module 3: Xử lý Sự cố & Tối ưu (Core Engine)
* **RQF-008:** Là một (P-1 hoặc P-2), tôi muốn truy cập một **Biểu mẫu (Form)** đơn giản để nhập thông tin sự cố.
* **RQF-009:** (Form) Phải cho phép tôi chọn loại sự cố (ví dụ: Tàu trễ, Thời tiết xấu, Hỏng Cầu, Bảo trì Bến), chọn tài sản bị ảnh hưởng (ví dụ: Tàu X, Cầu Y), và nhập chi tiết (ví dụ: trễ 45 phút).
* **RQF-010:** (Hệ thống) Ngay khi Form được gửi, hệ thống phải kích hoạt **Engine Tối ưu (Greedy)** để tính toán lại lịch trình mới.
* **RQF-011:** (Hệ thống) Engine phải tự động giải quyết các xung đột (ví dụ: nếu Tàu A trễ, Tàu B (dự kiến cập bến sau Tàu A) phải tự động bị lùi lịch lại).
* **RQF-012:** (Hệ thống) Lịch trình mới (đã tối ưu) phải được cập nhật lên Biểu đồ Gantt (RQF-005) để P-1 thấy ngay lập tức.

### Module 4: Trung tâm Thông báo & Log
* **RQF-013:** Là một (P-1), tôi muốn xem một "Trung tâm Thông báo" (dạng Log) ghi lại tất cả các sự kiện theo thời gian thực (ví dụ: "10:30: Tàu A báo trễ 45p", "10:31: Hệ thống tự động cập nhật lịch Tàu A & B").
* **RQF-014:** Là một (P-1), tôi muốn có thể xuất file log (CSV) này để làm bằng chứng (evidence) cho các hoạt động điều phối.

### Module 5: Quản trị (Admin)
* **RQF-015:** Là một (P-3), tôi muốn có một giao diện để định nghĩa các tài sản của cảng (ví dụ: Tên bến, Số lượng cầu, Số lượng xe nội cảng) để engine có dữ liệu tính toán.

---

## 6. Yêu cầu Phi chức năng (Non-Functional Requirements)

| ID | Hạng mục | Yêu cầu chi tiết | Ghi chú |
| :--- | :--- | :--- | :--- |
| **RQN-001** | **Hiệu năng** | Thời gian hệ thống "tự sắp lại toàn bộ lịch" khi có sự cố phải **dưới 5 giây**. | |
| **RQN-002** | | Tải trang (dashboard chính) phải dưới 3 giây. | (Yêu cầu chuẩn) |
| **RQN-003** | **Tính tiện dụng** | Giao diện phải **Responsive** (tương thích tốt với di động). | |
| **RQN-004** | | Giao diện ưu tiên **tốc độ và tính thực dụng** hơn là độ phức tạp/đẹp mắt. | |
| **RQN-005** | **Khả năng mở rộng** | Hệ thống phải xử lý được **10-50 sự kiện/giờ** trong giờ cao điểm. | |
| **RQN-006** | | Kiến trúc phải **Modular** và theo hướng **Microservices** để dễ nâng cấp (ví dụ: thêm module Kho bãi hoặc thay engine Greedy bằng CP-SAT). | |
| **RQN-007** | **Bảo trì** | Backend sử dụng **Node.js**. | |
| **RQN-008** | | Frontend (UI) sử dụng **Vue 3** + **Plotly** + **Three.js**. | |
| **RQN-009** | **Triển khai** | Hệ thống phải dễ dàng up lên **cPanel/shared hosting** (Node App + static files). | |
| **RQN-010** | **Lưu trữ Dữ liệu** | Dữ liệu Log (RQF-013) phải được lưu trữ tối thiểu **3 tháng**. | |
| **RQN-011** | **Bảo mật** | Dữ liệu log (cho V1) không yêu cầu tính toàn vẹn pháp lý (non-repudiation). | |
| **RQN-012** | **Bản địa hóa** | Hệ thống hỗ trợ 2 ngôn ngữ: **Tiếng Việt và Tiếng Anh**. | |

---

## 7. Mô hình Dữ liệu (Sơ bộ)
Các thực thể dữ liệu chính bao gồm:
* **User:** (UserID, Username, PasswordHash, Role: {OPS, Driver, Admin})
* **Asset:** (AssetID, Name, Type: {Berth, Crane, Truck}, Status: {Active, Inactive, Maintenance})
* **ShipVisit:** (VisitID, ShipName, ETA_original, ETA_actual, Status: {Scheduled, Arrived, Departed})
* **Task:** (TaskID, VisitID, AssetID, StartTime, EndTime, Type: {Loading, Unloading, Berthing})
* **Schedule:** (ScheduleID, Version, CreatedAt, IsActive)
* **Schedule\_Task\_Link:** (FK\_ScheduleID, FK\_TaskID)
* **EventLog:** (LogID, Timestamp, UserID, EventType, Description, Affected\_AssetID, Affected\_VisitID)

---

## 8. Mô tả Giao diện (Wireframes)

Mô tả này dùng để Dev hình dung, không phải thiết kế cuối cùng.

### 8.1. Màn hình Đăng nhập (Desktop & Mobile)
* Logo PortLink.
* Trường: Tên đăng nhập.
* Trường: Mật khẩu.
* Nút: "Đăng nhập".
* Lựa chọn ngôn ngữ (VN/EN).

### 8.2. Màn hình Điều phối (P-1, Desktop)
* **Layout 2 cột:**
    * **Cột Trái (30%):**
        * **Form "Báo cáo Sự cố":** (Dropdown: Loại, Tàu, Bến, Cầu; Input: Thời gian trễ, Lý do).
        * **Bảng "Notification Center":** (Hiển thị 10 log mới nhất, tự refresh).
        * **Box "KPIs":** (Số liệu: Tàu đang chờ, % Bến sử dụng).
    * **Cột Phải (70%):**
        * **Biểu đồ Gantt (Plotly):**
            * Trục Y: Tên tài sản (Bến 1, Bến 2, Cầu 1, Cầu 2...).
            * Trục X: Mốc thời gian (hiển thị 24h tới).
            * Các thanh (bars): Tên tàu (Tàu A, Tàu B) được gán vào tài sản.

### 8.3. Màn hình Báo cáo (P-2, Mobile)
* **Layout 1 cột:**
    * Tiêu đề: "PortLink Báo cáo".
    * Thông tin người dùng (Tài xế X).
    * **Nút lớn:** "BÁO CÁO SỰ CỐ".
    * (Khi bấm vào): Hiển thị Form (RQF-009) được tối ưu cho mobile (dùng các component native của điện thoại như chọn giờ, dropdown).

---

## 9. Giả định & Ràng buộc

* **Giả định:**
    * Người dùng P-1 (Điều phối) đã có kiến thức nghiệp vụ cảng.
    * Các quy tắc nghiệp vụ (constraints) cho thuật toán Greedy (ví dụ: "Tàu A không thể vào Bến 2", "Cầu 1 chỉ phục vụ tàu dưới 5000T") sẽ được cung cấp ban đầu.
    * Dữ liệu demo (tàu, lịch ban đầu, tài sản cảng) sẽ được nhập thủ công vào CSDL.
* **Ràng buộc:**
    * **Công nghệ:** Sử dụng Node.js (Backend) và Vue 3 (Frontend) cho V1 demo.
    * **Phạm vi:** Tập trung vào kịch bản Demo, không xây dựng các tính năng ngoài phạm vi (Mục 2.2).
    * **Triển khai:** Phải chạy được trên Shared Hosting.

---

## 10. Phụ lục: Kịch bản Demo (Demo Use Case)

Kịch bản này dùng để kiểm thử và thuyết trình sản phẩm, chứng minh mục tiêu (1.2).

* **Bối cảnh:** 1 Bến, 2 Cầu.
* **Setup (09:00):**
    * Admin đã tạo tài sản.
    * Hệ thống đã xếp lịch:
        * Tàu A: 10:00 - 12:00 (sử dụng Bến 1, Cầu 1).
        * Tàu B: 12:00 - 14:00 (sử dụng Bến 1, Cầu 2).
* **Bước 1 (Xem):** (P-1) Đăng nhập, thấy Gantt chart hiển thị Tàu A và Tàu B đã được xếp lịch.
* **Bước 2 (Sự cố):** (10:05) (P-2) Dùng di động, gửi Form: "Tàu A", "Sự cố kỹ thuật", "Trễ 1 giờ".
* **Bước 3 (Tối ưu):**
    * (Hệ thống) Nhận sự cố. Kích hoạt Engine Greedy.
    * (Hệ thống) Tính toán (dưới 5 giây):
        * Tàu A trễ 1h -> Lịch mới: 11:00 - 13:00 (vẫn dùng Bến 1, Cầu 1).
        * *Xung đột:* Tàu A (kết thúc 13:00) và Tàu B (bắt đầu 12:00) bị xung đột Bến 1.
        * *Giải quyết:* Engine lùi lịch Tàu B -> Lịch mới: 13:00 - 15:00 (dùng Bến 1, Cầu 2).
* **Bước 4 (Hiển thị):**
    * (P-1) Gantt chart tự động cập nhật. P-1 thấy Tàu A và Tàu B đều đã bị lùi lịch.
* **Bước 5 (Log):**
    * (P-1) Notification Center hiển thị 2 log mới:
        1.  "10:05: Tàu A báo trễ 1h (Sự cố kỹ thuật)".
        2.  "10:05: Hệ thống tự động cập nhật lịch Tàu A và Tàu B do xung đột."

* **Kết quả:** Demo thành công, chứng minh khả năng tự động điều phối lại toàn chuỗi.
