import React, { useState } from 'react';
import Footer from '../components/Footer';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import './LogSign.css';

const LogSign: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data: { message?: string; token?: string; user?: unknown } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('Login server returned an invalid response.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in.');
      }

      if (!data.token || !data.user) {
        throw new Error('Login server returned an incomplete response.');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

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
              
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Enter your email"
                    className="form-input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Enter your password"
                    className="form-input"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-pwd">Forgot password?</a>
                </div>

                {loginError && <p className="form-error">{loginError}</p>}

                <button
                  type="submit"
                  className="btn btn-login"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>
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
