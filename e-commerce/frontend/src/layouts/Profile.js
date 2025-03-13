import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserById, getOrdersByUserName } from '../api/apiService';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrder, setRecentOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decodedToken = jwtDecode(tokenWithoutBearer);
        const userId = decodedToken.id;

        const response = await getUserById(userId);
        if (response) {
          setUserInfo(response);
          // Lấy 2 đơn hàng gần nhất cho người dùng
          const ordersResponse = await getOrdersByUserName(decodedToken.sub);
          if (ordersResponse && Array.isArray(ordersResponse.data)) {
            const sortedOrders = ordersResponse.data.sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));
            setRecentOrder(sortedOrders.slice(0, 2));
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        if (error && (
          error.name === 'InvalidTokenError' || 
          (error.message && error.message.includes('token')) ||
          error.response?.status === 401 ||
          error.response?.status === 403
        )) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatAddress = (userDetails) => {
    if (!userDetails) return 'Chưa cập nhật địa chỉ';
    const { street, streetNumber, locality, country, zipCode } = userDetails;
    return `${street || ''} ${streetNumber || ''}, ${locality || ''}, ${country || ''} ${zipCode || ''}`.replace(/,\s+,/g, ',').replace(/^,\s+/, '').replace(/,\s+$/, '');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Tài khoản của tôi</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-3">
              <nav className="list-group">
                <Link className="list-group-item active" to="/profile">Tổng quan tài khoản</Link>
                <Link className="list-group-item" to="/profile/address">Địa chỉ của tôi</Link>
                <Link className="list-group-item" to="/profile/orders">Đơn hàng của tôi</Link>
                <Link className="list-group-item" to="/profile/wishlist">Danh sách yêu thích</Link>
                <Link className="list-group-item" to="/profile/selling">Sản phẩm đang bán</Link>
                <Link className="list-group-item" to="/profile/settings">Cài đặt</Link>
                <Link className="list-group-item" to="/logout" onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    handleLogout();
                  }
                }}>Đăng xuất</Link>
              </nav>
            </aside>

            <main className="col-md-9">
              <article className="card mb-3">
                <div className="card-body">
                  {userInfo && (
                    <figure className="icontext">
                      <div className="icon">
                        <img className="rounded-circle img-sm border" 
                          src={userInfo.image || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
                          alt="Ảnh đại diện" 
                        />
                      </div>
                      <div className="text">
                        <strong>{userInfo.userDetails?.firstName} {userInfo.userDetails?.lastName}</strong>
                        <p className="mb-2">{userInfo.userDetails?.email}</p>
                        <Link to="/profile/settings" className="btn btn-light btn-sm">Chỉnh sửa</Link>
                      </div>
                    </figure>
                  )}
                  <hr />
                  {userInfo && (
                    <p>
                      <i className="fa fa-map-marker text-muted"></i> &nbsp; {formatAddress(userInfo.userDetails)} <br />
                      <i className="fa fa-phone text-muted"></i> &nbsp; {userInfo.userDetails?.phoneNumber || 'Chưa cập nhật số điện thoại'} <br />
                      <i className="fa fa-envelope text-muted"></i> &nbsp; {userInfo.userDetails?.email}<br />
                      <i className="fa fa-user text-muted"></i> &nbsp; {userInfo.userName}
                    </p>
                  )}
                </div>
              </article>

              <article className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Đơn hàng gần đây</h5>
                  <div className="row">
                    {recentOrder ? (
                      recentOrder.map((order) => (
                        <div key={order.id} className="col-md-12">
                          <p>
                            <strong>Mã đơn hàng:</strong> {order.id}<br />
                            <strong>Ngày đặt:</strong> {new Date(order.orderedDate).toLocaleDateString('vi-VN')}<br />
                            <strong>Trạng thái:</strong>{' '}
                            <span className={`badge badge-${
                              order.status === 'PENDING' ? 'warning' :
                              order.status === 'PAID' ? 'success' :
                              'secondary'
                            }`}>
                              {order.status}
                            </span>
                          </p>
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
                                        {item.product.price.toLocaleString('vi-VN')}đ x {item.quantity}
                                      </var>
                                    </td>
                                    <td className="text-right">
                                      <strong>
                                        {(item.subTotal).toLocaleString('vi-VN')}đ
                                      </strong>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="text-right mt-3">
                            <strong>Tổng tiền: {order.items.reduce((total, item) => total + item.subTotal, 0).toLocaleString('vi-VN')}đ</strong>
                            <br />
                            <Link to="/profile/orders" className="btn btn-outline-primary btn-sm mt-2">
                              Xem tất cả đơn hàng
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center w-100">Chưa có đơn hàng nào</p>
                    )}
                  </div>
                </div>
              </article>

              <article className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Phương thức thanh toán</h5>
                  <p className="text-center w-100">Chưa có phương thức thanh toán nào</p>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
