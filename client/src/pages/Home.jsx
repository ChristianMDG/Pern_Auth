import React from 'react'

const Home = ({user,error}) => {
  console.log(user);
  
  return (
    <div>
      <h1>Home</h1>
       {error && <p className='text-red-500'>{error}</p>}
      {user ? (
        <div className='w-full h-screen text-4xl flex flex-col justify-center items-center' >
          <h2 className="text-green-500">Welcome,{user.user.name}!</h2>
          <p className="text-gray-500">Your email: {user.user.email}</p>
         </div>)
        : <h2 className="text-gray-500">Please log in or register.</h2>
       }
       

    </div>
  )
}

export default Home