import React from 'react';
import Footer from '../components/Footer';
import '../App.css';

const LogSign: React.FC = () => {
  return (
    <div className="page logsign">
      <div className='section login'>
        <h1>Login</h1>
        <label htmlFor="username">Username:</label>
        <input type="text" placeholder="Username" />

        <label htmlFor="password">Password:</label>
        <input type="password" placeholder="Password" />

        <button>Login</button>
      </div>
      <div className='section signup'>
        <h1>Signup</h1>
        <label htmlFor="name">Full Name:</label>
        <input type="text" placeholder="Name" />

        <label htmlFor="username">Username:</label>
        <input type="text" placeholder="Username" />

        <label htmlFor="phone">Phone Number:</label>
        <input type="text" placeholder="Phone Number" />

        <label htmlFor='cnic'>CNIC:</label>
        <input type="text" placeholder="CNIC" />

        <label htmlFor="email">Email:</label>
        <input type="email" placeholder="Email" />

        <label htmlFor="password">Password:</label>
        <input type="password" placeholder="Password" />

        <button>Signup</button>
      </div>
    </div>
  );
};

export default LogSign;
