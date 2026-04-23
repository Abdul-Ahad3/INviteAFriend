import React, { useState } from 'react';
import Footer from '../components/Footer';
import '../App.css';
import { Link } from 'react-router-dom';
import './LogSign.css';

const LogSign: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <>
      <div className="logsign-container">
        <div className="logsign-card">
          {/* Tab Navigation */}
          <div className="logsign-tabs">
            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="form-section login-section">
              <h2>Welcome Back</h2>
              <p className="form-subtitle">Sign in to your account</p>
              
              <form className="auth-form">
                <div className="form-group">
                  <label htmlFor="login-username">Username or Email</label>
                  <input
                    type="text"
                    id="login-username"
                    placeholder="Enter your username or email"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Enter your password"
                    className="form-input"
                  />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-pwd">Forgot password?</a>
                </div>

                <Link to="/dashboard" className="btn btn-login">
                  Sign In
                </Link>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <div className="form-section signup-section">
              <h2>Join Us Today</h2>
              <p className="form-subtitle">Create your account to get started</p>
              
              <form className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <input
                      type="text"
                      id="signup-name"
                      placeholder="Your full name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                      type="email"
                      id="signup-email"
                      placeholder="youremail@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="signup-phone"
                      placeholder="+92 300 XXXXXXX"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-cnic">CNIC</label>
                    <input
                      type="text"
                      id="signup-cnic"
                      placeholder="XXXXX-XXXXXXX-X"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-username">Username</label>
                    <input
                      type="text"
                      id="signup-username"
                      placeholder="Choose a username"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input
                      type="password"
                      id="signup-password"
                      placeholder="Create a strong password"
                      className="form-input"
                    />
                  </div>
                </div>

                <label className="terms-checkbox">
                  <input type="checkbox" />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <Link to="/dashboard" className="btn btn-signup">
                  Create Account
                </Link>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LogSign;
