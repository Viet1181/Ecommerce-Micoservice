import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getOrdersByUserName, getProductReviews, deleteProductReview } from "../api/apiService";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productReviews, setProductReviews] = useState({});
  const navigate = useNavigate();

  const fetchProductReviews = async (productName) => {
    try {
      const reviews = await getProductReviews(productName);
      return reviews || [];
    } catch (error) {
      console.error(`Lỗi khi lấy đánh giá cho sản phẩm ${productName}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          const userName = decodedToken.sub;
          if (!userName) {
            console.error('Không tìm thấy userName trong token');
            navigate('/login');
            return;
          }
          const response = await getOrdersByUserName(userName);
          const ordersData = response.data || [];
          setOrders(ordersData);

          // Lấy đánh giá cho tất cả sản phẩm đã mua
          const reviewsPromises = ordersData
            .filter(order => order.status === "PAID")
            .flatMap(order => order.items)
            .map(async (item) => {
              const reviews = await fetchProductReviews(item.product.productName);
              return { [item.product.productName]: reviews };
            });

          const reviewsResults = await Promise.all(reviewsPromises);
          const reviewsMap = reviewsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setProductReviews(reviewsMap);
        } catch (error) {
          console.error("Lỗi khi decode token hoặc lấy danh sách đơn hàng:", error);
        }
      } catch (error) {
        console.error("Lỗi khi lấy token hoặc navigate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleDeleteReview = async (reviewId, productName) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteProductReview(reviewId);
        // Cập nhật lại danh sách đánh giá
        const updatedReviews = await fetchProductReviews(productName);
        setProductReviews(prev => ({
          ...prev,
          [productName]: updatedReviews
        }));
        alert('Đã xóa đánh giá thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa đánh giá:', error);
        alert('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      }
    }
  };

  const getUserReviewForProduct = (productName, userName) => {
    const reviews = productReviews[productName] || [];
    return reviews.find(review => {
      const reviewUserName = review.userName || review.userId;
      return reviewUserName === userName;
    });
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Đơn hàng của tôi</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-3">
              <nav className="list-group">
                <Link className="list-group-item" to="/profile">
                  Tổng quan tài khoản
                </Link>
                <Link className="list-group-item" to="/profile/address">
                  Địa chỉ của tôi
                </Link>
                <Link className="list-group-item active" to="/profile/orders">
                  Đơn hàng của tôi
                </Link>
                <Link className="list-group-item" to="/profile/wishlist">
                  Danh sách yêu thích
                </Link>
                <Link className="list-group-item" to="/profile/selling">
                  Sản phẩm đang bán
                </Link>
                <Link className="list-group-item" to="/profile/settings">
                  Cài đặt
                </Link>
                <Link
                  className="list-group-item"
                  to="/logout"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                      window.location.href = "/logout";
                    }
                  }}
                >
                  Đăng xuất
                </Link>
              </nav>
            </aside>

            <main className="col-md-9">
            {Array.isArray(orders) && orders.length === 0 ? (
              <div className="card">
                <div className="card-body text-center">
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <Link to="/" className="btn btn-primary">Mua sắm ngay</Link>
                </div>
              </div>
            ) : (
              Array.isArray(orders) ? (
                orders.map((order) => (
                  <article key={order.id} className="card mb-4">
                    <header className="card-header">
                      <strong className="d-inline-block mr-3">
                        Mã đơn hàng: {order.id}
                      </strong>
                      <span>
                        Ngày đặt: {new Date(order.orderedDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="badge badge-pill badge-info float-right">
                        {order.status === "PENDING"
                          ? "Đang xử lý"
                          : order.status === "PAID"
                          ? "Đã thanh toán"
                          : order.status}
                      </span>
                    </header>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="text-muted">Thông tin thanh toán</h6>
                          <p>
                            Tổng tiền: {order.items.reduce((total, item) => total + item.subTotal, 0).toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>

                      <hr />

                      <div className="table-responsive">
                        <table className="table table-hover">
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.product.id}>
                                <td width="65">
                                  <img
                                    src={`http://localhost:8900/api/catalog/images/${item.product.imageUrl}`}
                                    className="img-xs border"
                                    alt={item.product.productName}
                                  />
                                </td>
                                <td>
                                  <p className="title mb-0">
                                    {item.product.productName}
                                  </p>
                                  <var className="price text-muted">
                                    {item.product.price.toLocaleString("vi-VN")}
                                    đ x {item.quantity}
                                  </var>
                                  {order.status === "PAID" && (
                                    <div className="mt-2">
                                      {(() => {
                                        const token = localStorage.getItem("authToken");
                                        const decodedToken = token ? jwtDecode(token) : null;
                                        const userName = decodedToken?.sub;
                                        const review = getUserReviewForProduct(item.product.productName, userName);
                                        
                                        if (review) {
                                          return (
                                            <div>
                                              <div className="d-flex align-items-center">
                                                <div className="mr-2">
                                                  Đánh giá của bạn: {' '}
                                                  {[1, 2, 3, 4, 5].map((star) => (
                                                    <i 
                                                      key={star}
                                                      className={`fa fa-star ${star <= review.rating ? 'text-warning' : 'text-muted'}`}
                                                    />
                                                  ))}
                                                  {review.comment && (
                                                    <small className="text-muted ml-2">
                                                      <em>"{review.comment}"</em>
                                                    </small>
                                                  )}
                                                </div>
                                                <button 
                                                  className="btn btn-sm btn-outline-danger"
                                                  onClick={() => handleDeleteReview(review.id, item.product.productName)}
                                                >
                                                  <i className="fa fa-trash"></i>
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <Link 
                                              to={`/products/review?productId=${item.product.id}`}
                                              className="btn btn-sm btn-outline-primary"
                                            >
                                              Đánh giá sản phẩm
                                            </Link>
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                </td>
                                <td className="text-right">
                                  <strong>
                                    {(item.subTotal)?.toLocaleString("vi-VN")}
                                    đ
                                  </strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="card">
                  <div className="card-body text-center">
                    <p>Đã xảy ra lỗi khi lấy danh sách đơn hàng.</p>
                  </div>
                </div>
              )
            )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileOrders;
