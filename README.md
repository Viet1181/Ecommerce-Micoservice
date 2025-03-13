# Ecommerce-Microservice

## Tổng quan

Đây là một dự án E-Commerce hoàn chỉnh được xây dựng trên framework Springboot, cung cấp tất cả các tính năng cần thiết cho một trang web thương mại điện tử và hệ thống quản lý.

## Kiến trúc và Công nghệ

- **Kiến trúc Microservice**: Ứng dụng được chia thành các dịch vụ riêng biệt (user-service, product-catalog-service, order-service, v.v.)
- **Spring Boot**: Backend được phát triển sử dụng Spring Boot và các công nghệ liên quan như Spring Data và Spring Security
- **RESTful APIs**: Tất cả các microservices đều cung cấp RESTful APIs
- **Eureka**: Sử dụng cho đăng ký và khám phá dịch vụ
- **Spring Cloud Gateway**: Quản lý lưu lượng truy cập, cân bằng tải và bảo mật
- **MySQL**: Thiết kế và quản lý cơ sở dữ liệu
- **Hibernate**: Tương tác cơ sở dữ liệu hiệu quả
- **Redis**: Giải pháp bộ nhớ đệm để cải thiện hiệu suất ứng dụng
- **JWT**: Xác thực và ủy quyền người dùng

## Cấu trúc dự án

- **api-gateway**: Điểm vào chính cho tất cả các requests từ client
- **eureka-server**: Service discovery cho hệ thống microservices
- **user-service**: Quản lý người dùng và xác thực
- **product-catalog-service**: Quản lý danh mục sản phẩm
- **order-service**: Xử lý và quản lý đơn hàng
- **product-recommendation-service**: Cung cấp đề xuất sản phẩm
- **frontend**: Giao diện người dùng

## Cài đặt và chạy dự án

### Yêu cầu
- Java 11 hoặc cao hơn
- Maven
- MySQL
- Redis (tùy chọn)
- Node.js và npm (cho frontend)

### Cách chạy
1. Clone repository
   ```
   git clone https://github.com/Viet1181/Ecommerce-Micoservice.git
   ```
2. Cấu hình cơ sở dữ liệu MySQL trong các file application.properties của mỗi service
3. Khởi động eureka-server trước
4. Khởi động các services khác
5. Khởi động api-gateway
6. Cài đặt và chạy frontend

## Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng mở issue hoặc pull request để đóng góp.

## Giấy phép

[MIT License](LICENSE)
