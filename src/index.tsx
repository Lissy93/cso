import { render } from 'solid-js/web';
import AppRoutes from './Routes';

import './styles/globals.scss';
import './styles/typography.scss';
import './styles/colors.scss';

render(
  () => (<AppRoutes />),
  document.getElementById('snack-champion-root')!
);
