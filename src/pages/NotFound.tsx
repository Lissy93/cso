import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import Button from '../components/atoms/Button';

const NotFoundWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 20vw;
    text-align: center;
    text-shadow: 20px 20px 20px #000000b2, -4px -4px 4px black;
    opacity: 0.15;
    margin: 1rem auto;
  }
  .why-no-find-page {
    color: var(--primary);
    font-size: 3rem;
    text-align: center;
    margin: 0.5rem auto 2rem auto;
  }
`

export default function NotFoundPage() {

  const goHome = () => {
    toast('Sorry about that! We\'re taking you back home now...');
    window.location.href = '/';
  };

  return (
    <NotFoundWrapper>
      <h1>404</h1>
      <p class="why-no-find-page">Page not Found 😢</p>
      <Button size="medium" onClick={goHome}>Take me Home</Button>
    </NotFoundWrapper>
  );
}
