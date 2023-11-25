
// Import dependencies
import { createEffect } from 'solid-js';
import { Router, Routes, Route, Outlet, useNavigate } from '@solidjs/router';

// Import pages
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import NotFoundPage from './pages/NotFound';

// Import core components
import Navbar from './components/Navbar/Navbar';

// Import services
import { isAuthenticated } from './services/authService';


// const navigate = useNavigate();
// createEffect(() => {
//   if (!isAuthenticated()) {
//     navigate('/login');
//   }
// });


const RouteGuard = () => {
  const navigate = useNavigate();

  createEffect(() => {
    if(!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  })

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

const AppRoutes = () => {
  // createEffect(() => {
  //   // checkAuthentication();
  // });

  return (
    // <Routes>
    //   {/* <Route path="/" element={isAuthenticated() ? <HomePage /> : <LoginPage />} /> */}
    //   <Route path="/" element={<HomePage />} />
    //   <Route path="/login" element={<LoginPage />} />
    //   {/* Add other routes as needed */}
    // </Routes>
    <Router>
      <Routes>
        <Route path="/login" component={LoginPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/" component={RouteGuard}>
          <Route path="/" component={HomePage} />
          {/* <Route path="/about" component={About} /> */}
        </Route>
        <Route path="*" component={NotFoundPage} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
