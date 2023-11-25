import { render } from 'solid-js/web';
import AppRoutes from './Routes';
import './index.css'
import './App.scss'


render(
  () => (
    <AppRoutes />
  ),
  document.getElementById('snack-champion-root')
);
