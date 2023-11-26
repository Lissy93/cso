import { Component, createSignal } from 'solid-js';
import { isAuthenticated, login, logout } from '../../services/authService';
import Donut from '../../assets/donut.svg';
import './Navbar.scss';

const Navbar: Component = () => {

  return (
    <nav class="navbar">
      <div class="navbar-brand">
        <a href="/">
          <img src={Donut} alt="Snack Champion" />
          Snack Champion
        </a>
      </div>
      <ul class="navbar-links">
        <li><a href="/about">About</a></li>
        <li><a href="https://github.com/lissy93/cso" target="_blank">Source Code</a></li>
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
