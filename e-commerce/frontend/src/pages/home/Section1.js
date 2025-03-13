import React, { useEffect, useState } from "react";
import { getProductsByCategory, getProductReviews, calculateAverageRating } from "../../api/apiService";
import { Link } from "react-router-dom";

const Section1 = ({ categoryName }) => {
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(categoryName);
        
        // Lấy đánh giá cho mỗi sản phẩm
        const ratings = {};
        for (const product of data || []) {
          const reviews = await getProductReviews(product.productName);
          const averageRating = calculateAverageRating(reviews);
          ratings[product.id] = averageRating;
        }
        setProductRatings(ratings);
        
        setProducts(data || []);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  const renderStars = (rating) => {
    rating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fa fa-star text-warning"></i>);
      } else if (i - 0.5 <= rating) {
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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const displayProducts = products.slice(0, 4);

  return (
    <section className="padding-bottom">
      <header className="section-heading mb-4">
        <h3 className="title-section">{categoryName}</h3>
      </header>
      <div className="row">
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={product.id}>
              <div className="card card-product-grid">
                <Link to={`/Detail?productId=${product.id}`} className="img-wrap">
                  <img
                    src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                    alt={product.productName}
                  />
                </Link>
                <figcaption className="info-wrap">
                  <div className="rating-wrap mb-2">
                    <div className="stars">
                      {renderStars(productRatings[product.id] || 0)}
                    </div>
                    <small className="text-muted ml-2">
                      ({productRatings[product.id] || '0.0'})
                    </small>
                  </div>
                  <div>
                    <Link to={`/Detail?productId=${product.id}`} className="title">
                      {product.productName}
                    </Link>
                  </div>
                  <div className="price h5 mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</div>
                </figcaption>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">Không có sản phẩm nào trong danh mục này</p>
          </div>
        )}
      </div>
      {products.length > 4 && (
        <div className="text-center mt-4">
          <Link to={`/ListingGrid?category=${categoryName}`} className="btn btn-outline-primary">
            Xem thêm {products.length - 4} sản phẩm
          </Link>
        </div>
      )}
    </section>
  );
};

export default Section1;
