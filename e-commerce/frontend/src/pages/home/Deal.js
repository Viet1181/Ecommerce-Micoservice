import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../api/apiService";

// Import item images for fallback
import item1 from "../../assets/images/items/1.jpg";
import item3 from "../../assets/images/items/3.jpg";
import item4 from "../../assets/images/items/4.jpg";
import item5 from "../../assets/images/items/5.jpg";
import item6 from "../../assets/images/items/6.jpg";
import item7 from "../../assets/images/items/7.jpg";
import { Link } from "react-router-dom";

const Deal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultProducts = [
    { productId: 1, productName: "Summer clothes", image: item3, discount: 20 },
    { productId: 2, productName: "Some category", image: item4, discount: 5 },
    {
      productId: 3,
      productName: "Another category",
      image: item5,
      discount: 20,
    },
    { productId: 4, productName: "Home apparel", image: item6, discount: 15 },
    { productId: 5, productName: "Smart watches", image: item7, discount: 10 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response && Array.isArray(response)) {
          setProducts(response);
        } else {
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm giảm giá:", error);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0";
    return typeof price === "number" ? price.toFixed(2) : String(price);
  };

  const displayProducts = (products || []).map((product) => ({
    id: product.productId,
    img: product.imageUrl
      ? `http://localhost:8900/api/catalog/images/${product.imageUrl}`
      : item1,
    title: product.productName || "Sản phẩm không tên",
    price: formatPrice(product.price),
    description: product.description || "",
    category: product.category || "Chưa phân loại",
    discount: "20%",
  }));

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <section className="padding-bottom">
      <div className="card card-deal">
        <div className="row">
          <div className="col-md-3">
            <div className="content-body">
              <header className="section-heading">
                <h3 className="section-title">Ưu đãi</h3>
                <p>Các sản phẩm đang giảm giá</p>
              </header>
              <div className="timer">
                <div>
                  {" "}
                  <span className="num">04</span> <small>Ngày</small>
                </div>
                <div>
                  {" "}
                  <span className="num">12</span> <small>Giờ</small>
                </div>
                <div>
                  {" "}
                  <span className="num">58</span> <small>Phút</small>
                </div>
                <div>
                  {" "}
                  <span className="num">02</span> <small>Giây</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row no-gutters items-wrap">
              {displayProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="col">
                  <figure className="card-product-grid card-sm">
                    <Link
                      to={`/DetailProduct/${product.id}`}
                      className="img-wrap"
                    >
                      {" "}
                      {/* Cập nhật để sử dụng Link */}
                      <img src={product.img} alt={product.title} />
                    </Link>
                    <div className="text-wrap p-3">
                      <Link
                        to={`/DetailProduct/${product.id}`}
                        className="title text-truncate"
                      >
                        {product.title}
                      </Link>{" "}
                      {/* Cập nhật để sử dụng Link */}
                      <div className="price-wrap mt-2">
                        <span className="price">{product.price} VNĐ</span>
                        <span className="badge badge-danger ml-2">
                          {product.discount}
                        </span>
                      </div>
                      <small className="text-muted">{product.category}</small>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deal;
