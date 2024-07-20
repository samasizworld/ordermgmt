import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../index.css';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queryParams, setQueryParams] = useState({ pageSize: 10, page: 1, orderDir: '', orderBy: '', search: '' });
  const [total, setTotalCount] = useState(0);
  const [checkedState, setCheckedState] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);


  useEffect(() => {
    axios.get(`http://localhost:7000/products?search=${queryParams.search}&page=${queryParams.page}&pageSize=${queryParams.pageSize}&orderBy=${queryParams.orderBy}&orderDir=${queryParams.orderDir}`, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        const result = res.data;
        setProducts(result);
        setTotalCount(res.headers['x-count']);
        setCheckedState(prevCheckedState => {
          const newCheckedState = { ...prevCheckedState };
          result.forEach(product => {
            if (!(product.ProductId in newCheckedState)) {
              newCheckedState[product.ProductId] = false;
            }
          });
          return newCheckedState;
        });
      })
      .catch(err => {
        console.log(err)
        toast.error('Internal server error')
      });
  }, [queryParams]);

  const handleSubmit = () => {
    console.log('Submitted');
    if (orders.length === 0) {
      toast.error('Please select any products.')
      return;
    }
    console.log(orders);
    const payload = JSON.stringify(orders);
    axios.post(`http://localhost:7000/orders`, payload, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        console.log(res.data);
        toast.success('Order has been placed.')
      })
      .catch(err => {
        console.log(err);
        toast.error('Internal server error')

      });
  };

  const handleCheckBox = (productId) => {
    setCheckedState(prevCheckedState => {
      const newCheckedState = { ...prevCheckedState, [productId]: !prevCheckedState[productId] };
      setOrders(Object.keys(newCheckedState).filter(id => newCheckedState[id]));
      return newCheckedState;
    });
  };

  const changePage = (page) => {
    setQueryParams({ ...queryParams, page });
  };

  const handleSearchFieldChange = (e) => {
    setQueryParams({ ...queryParams, search: e.target.value });
  };

  const handleViewOrders = () => {
    setShowModal(true);
    axios.get(`http://localhost:7000/orders`, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        setPackages(res.data)
      })
      .catch(err => {
        console.log(err)
        toast.error('Internal server error')
      });
  };


  const totalPageToShow = Math.ceil(total / queryParams.pageSize);
  const arr = [];
  for (let i = queryParams.page; i <= totalPageToShow; i++) {
    arr.push(i);
  }

  const formatOrderDetails = (order) => {
    return order.packages.map(pkg => {
      const itemsList = pkg.products.map(p => p.name).join(', ');
      const totalWeight = pkg.totalWeight.toLocaleString('en-US', { style: 'unit', unit: 'gram' });
      const totalPrice = pkg.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const courierPrice = pkg.courierPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

      return `
            Package: ${pkg.packageName}
            Items - ${itemsList}
            Total weight - ${totalWeight}
            Total price - ${totalPrice}
            Courier price - ${courierPrice}
            `;
    }).join('\n');
  };

  return (
    <div className="product-container">
      <div className="header">
        <button className="btn-submit" type="button" onClick={handleSubmit}>
          Place an Order
        </button>
        <button className="btn-view-orders" type="button" onClick={handleViewOrders}>
          View Orders
        </button>

        <input
          className="search-input"
          type="search"
          placeholder="Search..."
          onChange={handleSearchFieldChange}
        />
      </div>
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.ProductId}>
                <td>{p.Name}</td>
                <td>{p.Price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td>{p.Weight?.toLocaleString('en-US', { style: 'unit', unit: 'gram' })}</td>
                <td>
                  <input
                    type="checkbox"
                    name="checkbox"
                    checked={checkedState[p.ProductId] || false}
                    onChange={() => handleCheckBox(p.ProductId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {queryParams.page - 1 >= 1 && (
          <span className="pagination-arrow" onClick={() => changePage(queryParams.page - 1)}>
            {'<<'}
          </span>
        )}
        <ul className="pagination-list">
          {arr.map(num => (
            <li
              key={num}
              className={`pagination-item ${num === queryParams.page ? 'active' : ''}`}
              onClick={() => changePage(num)}
            >
              {num}
            </li>
          ))}
        </ul>
        {queryParams.page + 1 <= totalPageToShow && (
          <span className="pagination-arrow" onClick={() => changePage(queryParams.page + 1)}>
            {'>>'}
          </span>
        )}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        {packages.length > 0 ?
          packages.map(order => (
            <div key={order._id} className="order">
              <h3>Customer: {order.customerName}</h3>
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
              <pre>{formatOrderDetails(order)}</pre>
            </div>
          ))
          : <div>No order available</div>}
      </Modal>
    </div>

  );
};

export default Product;
