import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';


const CustomerForm = () => {
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: '', address: '', contact: '' });
  const [customers, setCustomers] = useState([]);
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers')


      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      await await axios.put(`/customers/${editingId}`, form);

      toast.success('Customer updated!');
    } else {
      await await axios.post('/customers', form);

      toast.success('Customer added!');
    }

    setForm({ name: '', address: '', contact: '' });
    setEditingId(null);
    fetchCustomers();
  } catch (err) {
    console.error('Error saving customer:', err);
    toast.error('Something went wrong.');
  }
};

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 4000);
    return () => clearInterval(interval);
  }, []);
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this customer?')) {
    try {
      await axios.delete(`/customers/${id}`);

      toast.success('Customer deleted!');
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer.');
    }
  }
};

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="text"
            className="form-control"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </div>
<button type="submit" className="btn btn-primary">
  {editingId ? 'Update Customer' : 'Add Customer'}
</button>
      </form>
{editingId && (
  <button
    type="button"
    className="btn btn-secondary ms-2"
    onClick={() => {
      setForm({ name: '', address: '', contact: '' });
      setEditingId(null);
    }}
  >
    Cancel
  </button>
)}

      <h3>Customer List</h3>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {customers.map((c) => (
    <tr key={c._id}>
      <td>{c.name}</td>
      <td>{c.address}</td>
      <td>{c.contact}</td>
      <td>
  <div className="d-flex gap-2">
    <button
      className="btn btn-sm btn-warning"
      onClick={() => {
        setForm({ name: c.name, address: c.address, contact: c.contact });
        setEditingId(c._id);
      }}
    >
      Edit
    </button>

    <button
      className="btn btn-sm btn-danger"
      onClick={() => handleDelete(c._id)}
    >
      Delete
    </button>
  </div>
</td>

    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default CustomerForm;
