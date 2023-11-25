import { Component, createSignal } from 'solid-js';
import { isAuthenticated, login, logout } from '../../services/authService';
import './Navbar.scss';

const Navbar: Component = () => {

  return (
    <nav class="navbar">
      <div class="navbar-brand">Snack Champion</div>
      <ul class="navbar-links">
        <li><a href="/about">About</a></li>
        <li><a href="https://github.com/yourusername/yourrepo" target="_blank">Source Code</a></li>
        {isAuthenticated() ? (
          <li><button onClick={logout}>Logout</button></li>
        ) : (
          <li><button onClick={login}>Login</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
