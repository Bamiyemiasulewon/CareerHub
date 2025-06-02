import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * Main App component that handles routing and authentication state
 * @returns The main application layout with navigation and routes
 */
function App() {
  // State to track user authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation bar with conditional rendering based on auth status */}
        <nav className="nav">
          <div className="container flex justify-between items-center">
            <Link to="/" className="nav-link font-bold">CareerHub</Link>
            <div className="flex gap-4">
              <Link to="/jobs" className="nav-link">Jobs</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="btn btn-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main content area with routes */}
        <main className="container m-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/**
 * Home page component displaying welcome message
 * @returns The home page content
 */
function Home() {
  return (
    <div className="text-center">
      <h1 className="text-lg font-bold m-4">Welcome to CareerHub</h1>
      <p className="m-4">Find your dream job today!</p>
    </div>
  );
}

/**
 * Jobs listing page component
 * @returns The jobs page with a grid layout for job listings
 */
function Jobs() {
  return (
    <div>
      <h1 className="text-lg font-bold m-4">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Job cards will go here */}
      </div>
    </div>
  );
}

/**
 * Login form component
 * @returns A form for user authentication
 */
function Login() {
  return (
    <div className="card">
      <h1 className="text-lg font-bold m-4">Login</h1>
      <form className="flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

/**
 * Registration form component
 * @returns A form for new user registration
 */
function Register() {
  return (
    <div className="card">
      <h1 className="text-lg font-bold m-4">Register</h1>
      <form className="flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

/**
 * User profile component
 * @returns A form for viewing and editing user profile information
 */
function Profile() {
  return (
    <div className="card">
      <h1 className="text-lg font-bold m-4">Profile</h1>
      <div className="flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" />
        </div>
        <button className="btn btn-primary">Update Profile</button>
      </div>
    </div>
  );
}

export default App;
