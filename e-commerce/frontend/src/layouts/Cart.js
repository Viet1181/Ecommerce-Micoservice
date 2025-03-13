import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getCart, updateCartItem, removeFromCart } from '../api/apiService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Lấy cartId từ cookie nếu có
      let cartId = document.cookie.split('; ').find(row => row.startsWith('cartId='))?.split('=')[1];
      if (!cartId) {
        cartId = Date.now().toString();
        document.cookie = `cartId=${cartId}; path=/`;
      }

      const response = await getCart(cartId);
      if (response && response.products) {
        setCartItems(response.products);
        setTotalPrice(response.totalPrice || 0);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
      alert('Có lỗi xảy ra khi tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1 || newQuantity > 100) {
        return;
      }
      await updateCartItem(productId, newQuantity);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      alert('Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
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

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Giỏ hàng của tôi</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <main className="col-md-9">
              <div className="card">
                <table className="table table-borderless table-shopping-cart">
                  <thead className="text-muted">
                    <tr className="small text-uppercase">
                      <th scope="col">Sản phẩm</th>
                      <th scope="col" width="120">Số lượng</th>
                      <th scope="col" width="120">Giá</th>
                      <th scope="col" className="text-right" width="200"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <tr key={item.product.id}>
                          <td>
                            <figure className="itemside">
                              <div className="aside">
                                <img src={`http://localhost:8900/api/catalog/images/${item.product.imageUrl}`} className="img-sm" alt={item.product.productName} />
                              </div>
                              <figcaption className="info">
                                <Link to={`/product/${item.product.id}`} className="title text-dark">
                                  {item.product.productName}
                                </Link>
                                <p className="text-muted small">
                                  {item.product.description}
                                </p>
                              </figcaption>
                            </figure>
                          </td>
                          <td>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <button 
                                  className="btn btn-light" 
                                  type="button"
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  −
                                </button>
                              </div>
                              <input 
                                type="text" 
                                className="form-control text-center" 
                                value={item.quantity}
                                readOnly
                              />
                              <div className="input-group-append">
                                <button 
                                  className="btn btn-light" 
                                  type="button"
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                  disabled={item.quantity >= 100}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="price-wrap">
                              <var className="price">{item.product.price.toLocaleString('vi-VN')}đ</var>
                              <small className="text-muted">{item.subTotal.toLocaleString('vi-VN')}đ</small>
                            </div>
                          </td>
                          <td className="text-right">
                            <button 
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="btn btn-light"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <p>Giỏ hàng trống</p>
                          <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {cartItems.length > 0 && (
                  <div className="card-body border-top">
                    <Link to="/checkout" className="btn btn-primary float-md-right">
                      Thanh toán <i className="fa fa-chevron-right"></i>
                    </Link>
                    <Link to="/" className="btn btn-light">
                      <i className="fa fa-chevron-left"></i> Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>

              <div className="alert alert-success mt-3">
                <p className="icontext">
                  <i className="icon text-success fa fa-truck"></i> Giao hàng miễn phí trong vòng 1-2 tuần
                </p>
              </div>
            </main>

            {cartItems.length > 0 && (
              <aside className="col-md-3">
                <div className="card mb-3">
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <label>Mã giảm giá</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập mã giảm giá"
                          />
                          <span className="input-group-append">
                            <button className="btn btn-primary">Áp dụng</button>
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <dl className="dlist-align">
                      <dt>Tổng tiền:</dt>
                      <dd className="text-right">{totalPrice.toLocaleString('vi-VN')}đ</dd>
                    </dl>
                    <dl className="dlist-align">
                      <dt>Giảm giá:</dt>
                      <dd className="text-right">0đ</dd>
                    </dl>
                    <dl className="dlist-align">
                      <dt>Tổng cộng:</dt>
                      <dd className="text-right h5">
                        <strong>{totalPrice.toLocaleString('vi-VN')}đ</strong>
                      </dd>
                    </dl>
                    <hr />
                    <p className="text-center mb-3">
                      <img src="/images/misc/payments.png" height="26" alt="Phương thức thanh toán" />
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
