import { JSX, createEffect, createSignal, Show, onMount } from 'solid-js';
import { ThemeProvider, createTheme } from '@suid/material/styles';
import { Toaster } from 'solid-toast';
// import { createAutoAnimateDirective } from '@formkit/auto-animate/solid'
import autoAnimate from '@formkit/auto-animate'

import { Router, Routes, Route, Navigate } from '@solidjs/router';
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ProfilePage from './pages/Profile';
import RequestPage from './pages/Request';
import VotesPage from './pages/Votes';
import SnackAiPage from './pages/SnackAi';
import SnackStatsPage from './pages/SnackStats';
import NotFoundPage from './pages/NotFound';

import Navbar from './components/Furniture/Navbar/Navbar';
import Footer from './components/Furniture/Footer';
import Loading from './components/Furniture/Loading';
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
    <Show when={authCheckComplete()} fallback={<Loading />}>
      {isAuthenticated() ? props.component : <Navigate href="/login" />}
    </Show>
  );
};

const AppRoutes = () => {

  let listRef: any;
  onMount(() => {
    if (listRef) {
      autoAnimate(listRef, { duration: 500 });
    }
  });

  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <Navbar />
        <main ref={listRef}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/" element={<ProtectedRoute component={<HomePage />} />} />
            <Route path="/profile" element={<ProtectedRoute component={<ProfilePage />} />} />
            <Route path="/request" element={<ProtectedRoute component={<RequestPage />} />} />
            <Route path="/vote" element={<ProtectedRoute component={<VotesPage />} />} />
            <Route path="/snack-ai" element={<ProtectedRoute component={<SnackAiPage />} />} />
            <Route path="/stats" element={<ProtectedRoute component={<SnackStatsPage />} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: 'var(--background-lighter)', color: 'var(--foreground)',}, }}
        />
      </ThemeProvider>
    </Router>
  );
};

export default AppRoutes;
