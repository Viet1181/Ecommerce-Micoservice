import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getProductById, addProductReview, getProductReviews, getUserByName } from '../api/apiService';

const ReviewProduct = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Lấy thông tin sản phẩm
        const productData = await getProductById(productId);
        setProduct(productData);
        console.log('Thông tin sản phẩm:', productData);

        // Lấy thông tin người dùng từ token
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.sub;
        console.log('userName từ token:', userName);

        // Lấy đánh giá sản phẩm
        const reviews = await getProductReviews(productData.productName);
        console.log('Danh sách đánh giá:', reviews);

        // Tìm đánh giá của người dùng
        const userReview = reviews.find(review => {
          console.log('Đang kiểm tra review:', review);
          const reviewUserName = review.user?.userName;
          console.log('userName của review:', reviewUserName);
          return reviewUserName === userName;
        });
        
        console.log('Đánh giá của người dùng:', userReview);
        
        if (userReview) {
          alert('Bạn đã đánh giá sản phẩm này rồi!');
          navigate('/profile/orders');
          return;
        }

      } catch (error) {
        console.error('Chi tiết lỗi:', error);
        setError('Không thể lấy thông tin. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    } else {
      setError('Không tìm thấy mã sản phẩm');
      setLoading(false);
    }
  }, [productId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userName = decodedToken.sub;
      const userId = decodedToken.id;
      console.log('Thông tin người dùng khi gửi đánh giá:', { userName, userId });

      // Kiểm tra lại một lần nữa trước khi gửi đánh giá
      const reviews = await getProductReviews(product.productName);
      console.log('Danh sách đánh giá trước khi gửi:', reviews);

      const userReview = reviews.find(review => {
        console.log('Kiểm tra review:', review);
        const reviewUserName = review.user?.userName;
        console.log('userName của review:', reviewUserName);
        return reviewUserName === userName;
      });
      
      console.log('Tìm thấy đánh giá của người dùng:', userReview);

      if (userReview) {
        alert('Bạn đã đánh giá sản phẩm này rồi!');
        navigate('/profile/orders');
        return;
      }

      await addProductReview(userId, productId, rating, comment);
      alert('Đánh giá sản phẩm thành công!');
      navigate('/profile/orders');
    } catch (error) {
      console.error('Chi tiết lỗi khi gửi đánh giá:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Đánh giá sản phẩm</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card">
                <div className="card-body">
                  {product && (
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <img
                          src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                          className="img-fluid"
                          alt={product.productName}
                        />
                      </div>
                      <div className="col-md-9">
                        <h5 className="card-title">{product.productName}</h5>
                        <p className="text-muted">
                          Giá: {product.price?.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Đánh giá của bạn</label>
                      <div className="rating-stars mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fa fa-star fa-2x ${
                              star <= (hoveredRating || rating) ? 'text-warning' : 'text-muted'
                            }`}
                            style={{ cursor: 'pointer', marginRight: '5px' }}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Nhận xét của bạn (không bắt buộc)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                      />
                    </div>

                    <div className="text-center">
                      <button type="submit" className="btn btn-primary">
                        Gửi đánh giá
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary ml-2"
                        onClick={() => navigate('/profile/orders')}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewProduct;
