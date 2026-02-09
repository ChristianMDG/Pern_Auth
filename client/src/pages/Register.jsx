import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';



function Register({setUser}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
        const res = await axios.post("/api/auth/Register", form);
        setUser(res.data);
        navigate("/");
    } catch (err) {
        setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-amber-100'>
        <form className='bg-white p-6 rounded shadow-md' onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className='text-red-500'>{error}</p>}
      <input
          type="text"
          name="name"
          placeholder="Name"
          className='border p-2 w-full mb-3'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className='border p-2 w-full mb-3'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
           className='border p-2 w-full mb-3'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className='bg-blue-500 text-white p-2 rounded w-full'>Register</button>
      </form>
    </div>
  );
}
export default Register;