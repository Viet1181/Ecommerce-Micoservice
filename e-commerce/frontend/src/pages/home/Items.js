import React, { useState, useEffect } from 'react';
import { searchProducts, getProductReviews } from '../../api/apiService';
import { Link } from 'react-router-dom';

// Import item images for fallback
import item1 from '../../assets/images/items/1.jpg';

const Items = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sản phẩm
        const allProducts = await searchProducts({});
        
        // Lấy đánh giá và tính toán cho mỗi sản phẩm
        const productsWithRatings = await Promise.all(
          allProducts.map(async (product) => {
            const reviews = await getProductReviews(product.productName);
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            
            return {
              ...product,
              averageRating,
              reviewCount: reviews.length
            };
          })
        );

        // Sắp xếp theo điểm đánh giá cao nhất và số lượt đánh giá
        const topRated = [...productsWithRatings]
          .sort((a, b) => {
            // Nếu số sao khác nhau thì sắp xếp theo số sao
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            // Nếu số sao bằng nhau thì sắp xếp theo số lượt đánh giá
            return b.reviewCount - a.reviewCount;
          })
          .slice(0, 6);

        setProducts(topRated);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Làm tròn đến 0.5 gần nhất
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="padding-bottom-sm">
      <header className="section-heading heading-line">
        <h4 className="title-section text-uppercase">Sản phẩm được đánh giá cao</h4>
      </header>

      <div className="row row-sm">
        {products.map((product) => (
          <div key={product.id} className="col-xl-2 col-lg-3 col-md-4 col-6">
            <div className="card card-sm card-product-grid">
              <Link to={`/Detail?productId=${product.id}`} className="img-wrap">
                <img 
                  src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                  onError={(e) => { e.target.src = item1 }}
                  alt={product.productName} 
                />
              </Link>
              <figcaption className="info-wrap">
                <Link to={`/Detail?productId=${product.id}`} className="title">
                  {product.productName}
                </Link>
                <div className="rating-wrap mb-2">
                  <div className="stars">
                    {renderStars(product.averageRating || 0)}
                  </div>
                  <small className="text-muted ml-2">
                    ({(product.averageRating || 0).toFixed(1)})
                  </small>
                </div>
                <div className="price mt-1">
                  {(product.price || 0).toLocaleString('vi-VN')} VNĐ
                </div>
                <small className="text-muted">
                  <i className="fa fa-comment"></i> {product.reviewCount} đánh giá
                </small>
              </figcaption>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Items;
