import { JSX, createEffect, createSignal, Show } from 'solid-js';
import { ThemeProvider, createTheme } from '@suid/material/styles';
import { Toaster } from 'solid-toast';

import { Router, Routes, Route, Navigate } from '@solidjs/router';
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ProfilePage from './pages/Profile';
import RequestPage from './pages/Request';
import VotesPage from './pages/Votes';
import NotFoundPage from './pages/NotFound';

import Navbar from './components/Navbar/Navbar';
import { isAuthenticated } from './services/authService';
import supabase from './services/supabaseClient';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#d82036',
    },
    secondary: {
      main: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#b71c2b',
      disabled: '#969798',
    },
    background: {
      paper: '#161719',
    },
    mode: 'dark',
  },
});

const ProtectedRoute = (props: { component: JSX.Element; }) => {

  const [authCheckComplete, setAuthCheckComplete] = createSignal(false);

  createEffect(async () => {
    await supabase.auth.getSession();
    setAuthCheckComplete(true);
  });

  return (
    <Show when={authCheckComplete()} fallback={<div>Loading authentication...</div>}>
      {isAuthenticated() ? props.component : <Navigate href="/login" />}
    </Show>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/" element={<ProtectedRoute component={<HomePage />} />} />
          <Route path="/profile" element={<ProtectedRoute component={<ProfilePage />} />} />
          <Route path="/request" element={<ProtectedRoute component={<RequestPage />} />} />
          <Route path="/vote" element={<ProtectedRoute component={<VotesPage />} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: 'var(--background-lighter)', color: 'var(--foreground)',}, }}
        />
      </ThemeProvider>
    </Router>
  );
};

export default AppRoutes;
