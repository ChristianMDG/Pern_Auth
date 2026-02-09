import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'


const Navbar = ({user, setUser}) => {
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {
        withCredentials: true
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
     <Link to="/" className="text-xl font-bold">PERN AUTH</Link>
     <div>
      {user ?(
        <div className='flex items-center gap-4'>
          <button onClick={handleLogout} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
      )}
     </div>
    </nav>
   
  )
}

export default Navbar