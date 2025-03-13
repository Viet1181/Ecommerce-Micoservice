import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProductById, getProductReviews, addProductReview, getOrdersByUserName } from '../api/apiService';
import { jwtDecode } from "jwt-decode";
import AddToCart from '../components/AddToCart';

const DetailProduct = () => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
        
        try {
          const reviewsData = await getProductReviews(productData.productName);
          setReviews(reviewsData);
        } catch (error) {
          console.log('Không tìm thấy đánh giá cho sản phẩm này');
          setReviews([]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const userName = decodedToken.sub;
        const orders = await getOrdersByUserName(userName);
        
        // Kiểm tra xem người dùng đã mua và thanh toán sản phẩm này chưa
        const hasPaidProduct = orders.data?.some(order => 
          order.status === "PAID" && 
          order.items.some(item => item.product.id === parseInt(productId))
        );
        
        setHasPurchased(hasPaidProduct);
        setUserOrders(orders.data || []);
      } catch (error) {
        console.error('Lỗi khi kiểm tra lịch sử mua hàng:', error);
      }
    };

    if (productId) {
      fetchProductData();
      fetchUserOrders();
    }
  }, [productId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleRatingClick = async (rating) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Vui lòng đăng nhập để đánh giá sản phẩm');
        return;
      }

      if (!hasPurchased) {
        alert('Bạn cần mua và thanh toán sản phẩm này trước khi đánh giá');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await addProductReview(userId, productId, rating, userComment);
      // Cập nhật lại danh sách đánh giá
      const reviewsData = await getProductReviews(product.productName);
      setReviews(reviewsData);
      setUserRating(rating);
      setUserComment('');
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    } catch (error) {
      console.error('Lỗi khi đánh giá:', error);
      alert('Không thể đánh giá sản phẩm. Vui lòng thử lại sau.');
    }
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

  if (error || !product) {
    return (
      <div className="container text-center py-5">
        <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <>
      <section className="py-3 bg-light">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/Home">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/ListingGrid">Sản phẩm</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.productName}</li>
          </ol>
        </div>
      </section>

      <section className="section-content bg-white padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-6">
              <div className="card">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <div>
                      <a href="#">
                        <img src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`} alt={product.productName} />
                      </a>
                    </div>
                  </div>
                  <div className="thumbs-wrap">
                    <a href="#" className="item-thumb">
                      <img src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`} alt={product.productName} />
                    </a>
                    <a href="#" className="item-thumb">
                      <img src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`} alt={product.productName} />
                    </a>
                    <a href="#" className="item-thumb">
                      <img src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`} alt={product.productName} />
                    </a>
                    <a href="#" className="item-thumb">
                      <img src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`} alt={product.productName} />
                    </a>
                  </div>
                </article>
              </div>
            </aside>
            <main className="col-md-6">
              <article className="product-info-aside">
                <h2 className="title mt-3">{product.productName}</h2>

                <div className="rating-wrap my-3">
                  <ul className="rating-stars">
                    <li style={{ width: reviews.length > 0 ? `${averageRating * 20}%` : '0%' }} className="stars-active">
                      <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </li>
                    <li>
                      <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </li>
                  </ul>
                  <small className="label-rating text-muted">{reviews.length} đánh giá</small>
                  {/* {hasPurchased && (
                    <div className="review-form mt-3">
                      <h6>Đánh giá sản phẩm</h6>
                      <div className="stars mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i 
                            key={star}
                            className={`fa fa-star ${star <= userRating ? 'text-warning' : 'text-muted'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Nhập nhận xét của bạn (không bắt buộc)"
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                        ></textarea>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRatingClick(userRating)}
                        disabled={userRating === 0}
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  )}
                  {!hasPurchased && (
                    <small className="text-muted d-block mt-2">
                      (Bạn cần mua và thanh toán sản phẩm để đánh giá)
                    </small>
                  )} */}
                </div>

                <div className="mb-3">
                  <var className="price h4">{formatPrice(product.price)}</var>
                </div>

                <p>{product.description}</p>

                <dl className="row">
                  <dt className="col-sm-3">Mã sản phẩm</dt>
                  <dd className="col-sm-9">#{product.id}</dd>

                  <dt className="col-sm-3">Danh mục</dt>
                  <dd className="col-sm-9">{product.category}</dd>

                  <dt className="col-sm-3">Số lượng có sẵn</dt>
                  <dd className="col-sm-9">{product.availability || 'Liên hệ'}</dd>
                </dl>

                <AddToCart productId={product.id} />

                <a href="#" className="btn btn-light ml-3">
                  <i className="fas fa-envelope"></i> <span className="text">Liên hệ với nhà cung cấp</span>
                </a>
              </article>
            </main>
          </div>

          <div className="row">
            <div className="col-md-8">
              <h5 className="title-description">Thông số kỹ thuật</h5>
              <p>
                {product.description}
              </p>
              <ul className="list-check">
                <li>Material: Stainless steel</li>
                <li>Weight: 82kg</li>
                <li>built-in drip tray</li>
                <li>Open base for pots and pans</li>
                <li>On request available in propane execution</li>
              </ul>

              <h5 className="title-description">Thông tin chi tiết</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr><th colSpan="2">Thông tin cơ bản</th></tr>
                  <tr><td>Thương hiệu</td><td>{product.brand || 'Chưa có thông tin'}</td></tr>
                  <tr><td>Xuất xứ</td><td>{product.origin || 'Chưa có thông tin'}</td></tr>
                  <tr><td>Bảo hành</td><td>{product.warranty || '12 tháng'}</td></tr>

                  <tr><th colSpan="2">Kích thước</th></tr>
                  <tr><td>Chiều rộng</td><td>500mm</td></tr>
                  <tr><td>Chiều sâu</td><td>400mm</td></tr>
                  <tr><td>Chiều cao</td><td>700mm</td></tr>

                  <tr><th colSpan="2">Vật liệu</th></tr>
                  <tr><td>Phần ngoài</td><td>Stainless steel</td></tr>
                  <tr><td>Phần trong</td><td>Iron</td></tr>

                  <tr><th colSpan="2">Kết nối</th></tr>
                  <tr><td>Loại năng lượng</td><td>Gas</td></tr>
                  <tr><td>Công suất kết nối</td><td>15 Kw</td></tr>
                </tbody>
              </table>
            </div>

            <aside className="col-md-4">
              <div className="box">
                <h5 className="title-description">Đánh giá sản phẩm</h5>
                {reviews.length > 0 ? (
                  <div className="review-list">
                    <div className="mb-3 text-muted">
                      <small>Hiển thị {Math.min(5, reviews.length)} trong tổng số {reviews.length} đánh giá</small>
                    </div>
                    {reviews
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((review, index) => (
                      <div key={index} className="review-item border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="stars-outer mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i 
                                  key={star}
                                  className={`fa fa-star ${star <= review.rating ? 'text-warning' : 'text-muted'}`}
                                />
                              ))}
                              <span className="ml-2 font-weight-bold">
                                {review.rating}/5
                              </span>
                            </div>
                            <div className="review-content">
                              {review.comment ? (
                                <p className="mb-2">{review.comment}</p>
                              ) : (
                                <p className="text-muted mb-2"><em>Không có nhận xét</em></p>
                              )}
                            </div>
                          </div>
                          {review.updatedAt && review.updatedAt !== review.createdAt && (
                            <small className="text-muted">
                              (Đã chỉnh sửa)
                            </small>
                          )}
                        </div>
                        <div className="review-meta">
                          <small className="text-muted">
                            Đánh giá bởi: <span className="font-weight-bold">{review.user?.userName || review.userId}</span>
                          </small>
                          <small className="text-muted ml-3">
                            Thời gian: {new Date(review.createdAt).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>
                    ))}
                    {reviews.length > 5 && (
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          <em>* Chỉ hiển thị 5 đánh giá gần đây nhất</em>
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa fa-star-o fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="padding-y-lg bg-light border-top">
        <div className="container">
          <p className="pb-2 text-center">Cập nhật thông tin sản phẩm mới nhất và tin tức ngành hàng trực tiếp đến hộp thư của bạn</p>
          <div className="row justify-content-md-center">
            <div className="col-lg-4 col-sm-6">
              <form className="form-row">
                <div className="col-8">
                  <input className="form-control" placeholder="Địa chỉ email của bạn" type="email" />
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-block btn-warning">
                    <i className="fa fa-envelope"></i> Đăng ký
                  </button>
                </div>
              </form>
              <small className="form-text">Chúng tôi sẽ không chia sẻ địa chỉ email của bạn với bên thứ ba.</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;