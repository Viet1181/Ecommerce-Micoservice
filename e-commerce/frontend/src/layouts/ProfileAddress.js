import React from 'react';
import { Link } from 'react-router-dom';

const ProfileAddress = () => {
  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">My account</h2>
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
                    window.location.href = '/logout';
                  }
                }}>Đăng xuất</Link>
              </nav>
            </aside>

            <main className="col-md-9">
              <Link to="/profile/address/add" className="btn btn-light mb-3">
                <i className="fa fa-plus"></i> Add new address
              </Link>

              <div className="row">
                {/* Default Address */}
                <div className="col-md-6">
                  <article className="box mb-4">
                    <h6>London, United Kingdom</h6>
                    <p>Building: Nestone <br /> Floor: 22, Aprt: 12</p>
                    <Link to="#" className="btn btn-light disabled">
                      <i className="fa fa-check"></i> Default
                    </Link>
                    <Link to="#" className="btn btn-light">
                      <i className="fa fa-pen"></i>
                    </Link>
                    <Link to="#" className="btn btn-light">
                      <i className="text-danger fa fa-trash"></i>
                    </Link>
                  </article>
                </div>

                {/* Additional Addresses */}
                <div className="col-md-6">
                  <article className="box mb-4">
                    <h6>Tashkent, Uzbekistan</h6>
                    <p>Building one <br /> Floor: 2, Aprt: 32</p>
                    <Link to="#" className="btn btn-light">Make default</Link>
                    <Link to="#" className="btn btn-light">
                      <i className="fa fa-pen"></i>
                    </Link>
                    <Link to="#" className="btn btn-light">
                      <i className="text-danger fa fa-trash"></i>
                    </Link>
                  </article>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileAddress;
