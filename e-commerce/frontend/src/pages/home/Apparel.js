import React, { useState, useEffect } from 'react';
import { searchProducts, getProductReviews } from '../../api/apiService';
import { Link } from 'react-router-dom';

// Import item images for fallback
import item14 from '../../assets/images/items/92d9c00b-eee5-4d83-99ec-667ec5b1ffe6.png';
import item1 from '../../assets/images/items/1.jpg';

const Apparel = () => {
  const [bestRatedProducts, setBestRatedProducts] = useState([]);
  const [mostReviewedProducts, setMostReviewedProducts] = useState([]);
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

        // Sắp xếp theo điểm đánh giá cao nhất
        const topRated = [...productsWithRatings]
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 4);

        // Sắp xếp theo số lượng đánh giá nhiều nhất
        const mostReviewed = [...productsWithRatings]
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 4);

        setBestRatedProducts(topRated);
        setMostReviewedProducts(mostReviewed);
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
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fa fa-star text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fa fa-star-half-o text-warning"></i>);
      } else {
        stars.push(<i key={i} className="fa fa-star-o text-muted"></i>);
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
    <section className="padding-bottom">
      <header className="section-heading heading-line">
        <h4 className="title-section text-uppercase">Apparel</h4>
      </header>
      <div className="card card-home-category">
        <div className="row no-gutters">
          <div className="col-md-3">
            <div className="home-category-banner bg-light-orange">
            
              <img src={item1} className="img-bg" alt="Summer clothes" />
            </div>
          </div>
          <div className="card-header mt-3">
              <h5>Top nhiều đánh giá nhất</h5>
            </div>
            <ul className="row no-gutters bordered-cols">
              {mostReviewedProducts.map((product) => (
                <li key={product.id} className="col-6 col-lg-3 col-md-4">
                  <Link to={`/Detail?productId=${product.id}`} className="item">
                    <div className="card-body">
                      <h6 className="title">{product.productName}</h6>
                      <img 
                        className="img-sm float-right" 
                        src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                        onError={(e) => { e.target.src = item1 }}
                        alt={product.productName}
                      />
                      <div className="rating-wrap mb-2">
                        <div className="stars">
                          {renderStars(product.averageRating)}
                        </div>
                        <small className="text-muted ml-2">
                          ({product.averageRating.toFixed(1)})
                        </small>
                      </div>
                      <p className="text-muted">
                        <i className="fa fa-comment"></i> {product.reviewCount} đánh giá
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
        
        </div>
      </div>
    </section>
  );
};

export default Apparel;