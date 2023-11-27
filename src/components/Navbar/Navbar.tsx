import { Component, Show, createResource, createSignal } from 'solid-js';
import { isAuthenticated, fetchUserFromSession, login, logout } from '../../services/authService';
import Donut from '../../assets/donut.svg';
import './Navbar.scss';

const Navbar: Component = () => {

  const [session] = createResource(fetchUserFromSession);

  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <nav class="navbar">
      <div class="navbar-brand">
        <a href="/">
          <img src={Donut} alt="Snack Champion" />
          Snack Champion
        </a>
      </div>
      <ul class="navbar-links">
        {isAuthenticated() ? (
          <>
          <li onClick={() => { setMenuOpen(!menuOpen()) }}>
            <span>{session()?.user_metadata?.full_name || 'User'}</span>
            <img src={session()?.user_metadata.picture} alt="Profile" width="38" />
          </li>
          </>
        ) : (
          <li><button onClick={login}>Login</button></li>
        )}
      </ul>
      <Show when={menuOpen()}>
        <div class="drop-down" onClick={() => { setMenuOpen(false) }}>
          <a href="/profile">👤 Profile</a>
          <a href="/profile">⚙️ Preferences</a>
          <a href="#">🐛 Report a Bug</a>
          <a href="https://github.com/lissy93/cso">💽 Source Code</a>
          <span onClick={logout}>🏃 Logout</span>
        </div>
      </Show>
    </nav>
  );
};

export default Navbar;
