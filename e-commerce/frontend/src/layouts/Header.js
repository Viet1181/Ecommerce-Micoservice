import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, searchProducts } from '../api/apiService';
import logo from '../assets/images/logo.png';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    };

    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setCartCount(0);
          return;
        }

        const response = await axios.get('http://localhost:8900/api/shop/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && Array.isArray(response.data.products)) {
          setCartCount(response.data.products.length);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
        setCartCount(0);
      }
    };

    const fetchData = async () => {
      try {
        const productsResponse = await getAllProducts();
        if (productsResponse && Array.isArray(productsResponse)) {
          setProducts(productsResponse);

          const uniqueCategories = [...new Set(productsResponse
            .filter(product => product && product.category)
            .map(product => product.category))]
            .map((category, index) => ({
              categoryId: index + 1,
              categoryName: category
            }));
          setCategories(uniqueCategories);
        } else {
          console.error('Dữ liệu sản phẩm không hợp lệ:', productsResponse);
          setProducts([]);
          setCategories([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setProducts([]);
        setCategories([]);
      }
    };

    fetchUserData();
    fetchCartCount();
    fetchData();

    window.addEventListener('cartUpdated', fetchCartCount);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm || searchTerm.trim() === '') {
        setFilteredProducts([]);
        setShowDropdown(false);
        return;
      }

      try {
        const searchParams = {
          name: searchTerm,
          category: selectedCategory || null,
          sortBy: 'productName',
          sortDirection: 'asc'
        };

        const results = await searchProducts(searchParams);
        setFilteredProducts(results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        setFilteredProducts([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.append('search', searchTerm.trim());
      if (selectedCategory) {
        searchParams.append('category', selectedCategory);
      }
      navigate(`/ListingGrid?${searchParams.toString()}`);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/Login');
    } else {
      navigate('/Profile');
    }
  };

  return (
    <header className="section-header">
      <section className="header-main border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-3 col-md-12">
              <Link to="/Home" className="brand-wrap">
                <img className="logo" src={logo} alt="Brand Logo" />
              </Link>
            </div>
            <div className="col-xl-6 col-lg-5 col-md-6">
              <Form className="search-header" onSubmit={handleSearchSubmit}>
                <div className="input-group w-100">
                  <Form.Select 
                    className="custom-select border-right" 
                    name="category_name"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                  >
                    <option value="">Tất cả loại</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <FormControl 
                    type="text" 
                    placeholder="Tìm kiếm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Button variant="primary" type="submit">
                    <i className="fa fa-search"></i> Tìm kiếm
                  </Button>
                </div>
              </Form>
              {/* {showDropdown && filteredProducts.length > 0 && (
                <div className="search-results">
                  {filteredProducts.slice(0, 5).map(product => (
                    <Link
                      key={product.id}
                      to={`/DetailProduct/${product.id}`}
                      className="search-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="d-flex align-items-center">
                        <img 
                          src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                          alt={product.productName}
                          className="search-item-image"
                          style={{ width: '40px', height: '40px', marginRight: '10px' }}
                        />
                        <div>
                          <div>{product.productName}</div>
                          <small className="text-muted">
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(product.price)}
                          </small>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {filteredProducts.length > 5 && (
                    <div className="search-item-more">
                      <Link 
                        to={`/ListingGrid?search=${encodeURIComponent(searchTerm)}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        Xem thêm {filteredProducts.length - 5} sản phẩm...
                      </Link>
                    </div>
                  )}
                </div>
              )} */}
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="widgets-wrap float-md-right">
                <div className="widget-header mr-3">
                  <Link to="/Profile" className="widget-view" onClick={handleProfileClick}>
                    <div className="icon-area">
                      <i className="fa fa-user"></i>
                    </div>
                    <small className="text"> Tài khoản </small>
                  </Link>
                 
                </div>
                <div className="widget-header mr-3">
                  <Link to="/Messages" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-comment-dots"></i>
                    </div>
                    <small className="text"> Tin nhắn </small>
                  </Link>
                </div>
                <div className="widget-header mr-3">
                  <Link to="/profile/orders" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-store"></i>
                    </div>
                    <small className="text"> Đơn hàng </small>
                  </Link>
                </div>
                <div className="widget-header">
                  <Link to="/Cart" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-shopping-cart"></i>
                      {cartCount > 0 && <span className="notify">{cartCount}</span>}
                    </div>
                    <small className="text"> Giỏ hàng </small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Navbar expand="lg" className="navbar-main border-bottom">
        <div className="container">
          <Navbar.Toggle aria-controls="main_nav" />
          <Navbar.Collapse id="main_nav">
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    <i className="fa fa-bars text-muted mr-2"></i> Danh mục sản phẩm
                  </span>
                }
                id="basic-nav-dropdown"
              >
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category.categoryName}
                    as={Link}
                    to={`/ListingGrid?category=${category.categoryName.replace(/ /g, '+')}`}
                  >
                    {category.categoryName}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/ListingGrid">
                  Tất cả sản phẩm
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/ReadyToShip">Sẵn sàng giao</Nav.Link>
              <Nav.Link as={Link} to="/TradeShows">Hội chợ</Nav.Link>
              <Nav.Link as={Link} to="/Services">Dịch vụ</Nav.Link>
              <Nav.Link as={Link} to="/SellWithUs">Bán hàng cùng chúng tôi</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link href="#">Tải ứng dụng</Nav.Link>
              <NavDropdown title="Tiếng Việt" align="end">
                <NavDropdown.Item href="#">English</NavDropdown.Item>
                <NavDropdown.Item href="#">Chinese</NavDropdown.Item>
                <NavDropdown.Item href="#">Spanish</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
