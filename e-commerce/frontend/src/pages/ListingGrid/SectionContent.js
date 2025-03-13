import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getAllProducts, getProductsByCategory, searchProducts, getProductReviews, calculateAverageRating, addToCart } from "../../api/apiService";

const SectionContent = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "", applied: { min: null, max: null } });
  const [productRatings, setProductRatings] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const category = queryParams.get("category");
  const searchTerm = queryParams.get("search");
  const itemsPerPage = 4;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (searchTerm) {
          // Nếu có từ khóa tìm kiếm, gọi API search
          const searchParams = {
            name: searchTerm,
            category: category || null,
            sortBy: sortBy,
            sortDirection: sortDirection
          };
          data = await searchProducts(searchParams);
        } else {
          // Nếu không có từ khóa tìm kiếm, lấy tất cả sản phẩm
          data = await getAllProducts();
        }
        
        setAllProducts(data || []);
        
        // Lọc ra các danh mục duy nhất từ sản phẩm
        const uniqueCategories = [...new Set(data.map(product => product.category))].filter(Boolean);
        setCategories(uniqueCategories);
        
        // Nếu có category trong URL, tự động chọn danh mục đó
        if (category) {
          setSelectedCategories([decodeURIComponent(category).replace(/\+/g, ' ')]);
        } else {
          // Reset selectedCategories nếu không có category trong URL
          setSelectedCategories([]);
        }
        
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [category, searchTerm, sortBy, sortDirection]);

  useEffect(() => {
    const filterProducts = async () => {
      try {
        setLoading(true);
        let filteredProducts = [...allProducts];

        // Lọc theo danh mục đã chọn
        if (selectedCategories.length > 0) {
          filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
          );
        }

        // Lọc theo khoảng giá
        if (priceRange.applied.min !== null) {
          filteredProducts = filteredProducts.filter(product => 
            product.price >= priceRange.applied.min
          );
        }
        if (priceRange.applied.max !== null) {
          filteredProducts = filteredProducts.filter(product => 
            product.price <= priceRange.applied.max
          );
        }

        // Sắp xếp sản phẩm
        filteredProducts.sort((a, b) => {
          if (sortBy === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
          } else if (sortBy === 'productName') {
            return sortDirection === 'asc' 
              ? a.productName.localeCompare(b.productName)
              : b.productName.localeCompare(a.productName);
          }
          return 0;
        });

        // Lấy đánh giá cho các sản phẩm đã lọc
        const ratings = {};
        for (const product of filteredProducts) {
          const reviews = await getProductReviews(product.productName);
          const averageRating = calculateAverageRating(reviews);
          ratings[product.id] = averageRating;
        }
        setProductRatings(ratings);
        
        setProducts(filteredProducts);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lọc sản phẩm:", error);
        setError("Không thể lọc sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [allProducts, selectedCategories, sortBy, sortDirection, priceRange.applied]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({
      min: "",
      max: "",
      applied: { min: null, max: null }
    });
    setSortBy("id");
    setSortDirection("asc");
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortDirection] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const handlePriceRangeChange = (type, value) => {
    // Chỉ cập nhật giá trị nhập, chưa áp dụng filter
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleApplyPriceRange = () => {
    // Kiểm tra và xử lý giá trị hợp lệ
    const min = priceRange.min ? parseInt(priceRange.min) : null;
    const max = priceRange.max ? parseInt(priceRange.max) : null;

    // Kiểm tra giá trị hợp lệ
    if (min && max && min > max) {
      setError("Giá tối thiểu không thể lớn hơn giá tối đa");
      return;
    }

    // Cập nhật giá trị đã áp dụng
    setPriceRange(prev => ({
      ...prev,
      applied: { min, max }
    }));
    setError(null);
  };

  const handleResetPriceRange = () => {
    setPriceRange({
      min: "",
      max: "",
      applied: { min: null, max: null }
    });
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      await addToCart(productId, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
      }
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

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

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="row">
          {/* Sidebar filters */}
          <div className="col-md-3">
            <div className="card">
              <article className="filter-group">
                <header className="card-header">
                  <h6 className="title">Danh mục sản phẩm</h6>
                </header>
                <div className="filter-content">
                  <div className="card-body">
                    {categories.map((category) => (
                      <div className="custom-control custom-checkbox" key={category}>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <label className="custom-control-label" htmlFor={`category-${category}`}>
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="filter-group">
                <header className="card-header">
                  <h6 className="title">Khoảng giá</h6>
                </header>
                <div className="filter-content">
                  <div className="card-body">
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Giá từ"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      min="0"
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      min="0"
                    />
                    <button 
                      className="btn btn-primary btn-sm btn-block mb-2" 
                      onClick={handleApplyPriceRange}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </article>

              <button 
                className="btn btn-outline-danger btn-block mb-3"
                onClick={handleResetFilters}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <header className="mb-3">
              <div className="form-inline">
                <strong className="mr-md-auto">{products.length} sản phẩm</strong>
                <select className="form-control" onChange={handleSortChange}>
                  <option value="id-asc">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="productName-asc">Tên A-Z</option>
                  <option value="productName-desc">Tên Z-A</option>
                </select>
              </div>
            </header>

            {loading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Đang tải...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row">
              {!loading && currentProducts.map((product) => (
                <div className="col-md-3" key={product.id}>
                  <figure className="card card-product-grid">
                    <div className="img-wrap">
                      <img
                        src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                        alt={product.productName}
                      />
                    </div>
                    <figcaption className="info-wrap">
                      <Link to={`/Detail?productId=${product.id}`} className="title mb-2">
                        {product.productName}
                      </Link>
                      <div className="rating-wrap mb-2">
                        <div className="stars">
                          {renderStars(productRatings[product.id] || 0)}
                        </div>
                        <small className="text-muted ml-2">
                          ({productRatings[product.id] || '0.0'})
                        </small>
                      </div>
                      <div className="price-wrap">
                        <span className="price">{formatPrice(product.price)}</span>
                      </div>
                      <p className="text-muted">{product.category}</p>
                      <hr />
                      <div className="row">
                        <div className="col-6">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                          </button>
                        </div>
                        <div className="col-6">
                          <Link to={`/Detail?productId=${product.id}`} className="btn btn-outline-secondary btn-sm">
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>

            {!loading && products.length === 0 && (
              <div className="text-center my-4">
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
                      Trang trước
                    </button>
                  </li>
                  {renderPageNumbers()}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
                      Trang sau
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionContent;
