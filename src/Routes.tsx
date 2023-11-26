import { JSX, createEffect, onCleanup } from 'solid-js';
import { Subscription } from '@supabase/gotrue-js';

import { Router, Routes, Route, useNavigate } from '@solidjs/router';
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import NotFoundPage from './pages/NotFound';
import Navbar from './components/Navbar/Navbar';
import { isAuthenticated } from './services/authService';

// I don't know why this is required. But if I delete it, everything breaks.
import supabase from './services/supabaseClient';
await supabase.auth.getSession()

const ProtectedRoute = (props: { component: JSX.Element; }) => {
  const navigate = useNavigate();
  let effectCleanup: { data: { subscription: Subscription; }; } | (() => void);

  createEffect(() => {
    console.log(isAuthenticated());
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      effectCleanup = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          navigate('/login');
        }
      });
    }
  }, isAuthenticated());

  onCleanup(() => {
    if (effectCleanup && typeof effectCleanup === 'function') effectCleanup();
  });

  return isAuthenticated() ? props.component : <div>Loading...</div>;
};

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<ProtectedRoute component={<HomePage />} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
