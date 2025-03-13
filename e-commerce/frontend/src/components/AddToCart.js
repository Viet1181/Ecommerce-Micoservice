import React, { useState } from 'react';
import { addToCart } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const AddToCart = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      await addToCart(productId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-row align-items-center">
      <div className="col-auto">
        <select 
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          disabled={loading}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="col-auto">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}Đang thêm...
            </span>
          ) : (
            <span>
              <i className="fa fa-cart-plus"></i> Thêm vào giỏ
            </span>
          )}
        </button>
      </div>
      {error && (
        <div className="col-12 mt-2">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
