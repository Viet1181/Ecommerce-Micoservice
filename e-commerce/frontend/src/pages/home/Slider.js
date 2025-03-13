import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import slider images
import slide1 from '../../assets/images/banners/banner9.jpg';
import slide2 from '../../assets/images/banners/slide2.jpg';
import slide3 from '../../assets/images/banners/slide3.jpg';

// Import item images
import item1 from '../../assets/images/items/92d9c00b-eee5-4d83-99ec-667ec5b1ffe6.png';
import item2 from '../../assets/images/items/05ab0e3b-82a3-4198-84f5-a663cf413a79.png';
import item6 from '../../assets/images/items/a9f254a3-2c0c-4fae-a078-4421f1e8ac50.jpg';
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../api/apiService'; // Nhập hàm mới
import { Link } from 'react-router-dom';

const Slider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await getAllProducts();
        if (productsResponse && Array.isArray(productsResponse)) {
          // Tạo danh sách categories từ sản phẩm
          const uniqueCategories = [...new Set(productsResponse
            .filter(product => product && product.category)
            .map(product => product.category))]
            .map((category, index) => ({
              categoryId: index + 1,
              categoryName: category
            }));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="section-main padding-y">
      <main className="card">
        <div className="card-body">
          <div className="row">
            <aside className="col-lg col-md-3 flex-lg-grow-0">
              <nav className="nav-home-aside">
                <h6 className="title-category">
                  MY MARKETS <i className="d-md-none icon fa fa-chevron-down"></i>
                </h6>
                <ul className="menu-category">
                  {categories.map((category) => (
                    <li key={category.categoryId}>
                      <Link to={`/ListingGrid?category=${category.categoryName.replace(/ /g, '+')}`}>{category.categoryName}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside> {/* col.// */}
            <div className="col-md-9 col-xl-7 col-lg-7">
              {/* ================== COMPONENT SLIDER  BOOTSTRAP  ================== */}
              <div id="carousel1_indicator" className="slider-home-banner carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carousel1_indicator" data-slide-to="0" className="active"></li>
                  <li data-target="#carousel1_indicator" data-slide-to="1"></li>
                  <li data-target="#carousel1_indicator" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={slide1} alt="First slide" />
                  </div>
                  <div className="carousel-item">
                    <img src={slide2} alt="Second slide" />
                  </div>
                  <div className="carousel-item">
                    <img src={slide3} alt="Third slide" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carousel1_indicator" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carousel1_indicator" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
              {/* ==================  COMPONENT SLIDER BOOTSTRAP end.// ==================  .// */}
            </div> {/* col.// */}
            <div className="col-md d-none d-lg-block flex-grow-1">
              <aside className="special-home-right">
                <h6 className="bg-blue text-center text-white mb-0 p-2">Danh mục phổ biến</h6>
                <div className="card-banner border-bottom">
                  <div className="py-3" style={{ width: '80%' }}>
                    <h6 className="card-title">Điện thoại</h6>
                    <Link to="/ListingGrid?category=%C4%90i%E1%BB%87n+Tho%E1%BA%A1i" className="btn btn-secondary btn-sm">Xem thêm </Link>
                  </div>
                  <img src={item1} height="80" className="img-bg" alt="Men clothing" />
                </div>
                <div className="card-banner border-bottom">
                  <div className="py-3" style={{ width: '80%' }}>
                    <h6 className="card-title">Laptop</h6>
                    <Link to="/ListingGrid?category=Laptop" className="btn btn-secondary btn-sm">Xem thêm</Link>
                  </div>
                  <img src={item2} height="80" className="img-bg" alt="Winter clothing" />
                </div>
                <div className="card-banner border-bottom">
                  <div className="py-3" style={{ width: '80%' }}>
                    <h6 className="card-title">Bàn Phím</h6>
                    <Link to="/ListingGrid?category=Bàn+phím" className="btn btn-secondary btn-sm">Xem thêm</Link>
                  </div>
                  <img src={item6} height="80" className="img-bg" alt="Home inventory" />
                </div>
              </aside>
            </div> {/* col.// */}
          </div> {/* row.// */}
        </div> {/* card-body.// */}
      </main> {/* card.// */}
    </section>
  );
};

export default Slider;