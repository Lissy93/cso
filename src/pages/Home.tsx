import { useUserEmail } from '../services/authService';
import { styled } from 'solid-styled-components';

import RequestSnack from '../components/SnackStuff/RequestSnack';

const HomeWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const WelcomeMsg = styled('h2')`
  font-size: 3rem;
  margin: 0.5rem 0 1rem;
  text-transform: capitalize;
`;

export default function HomePage() {

  const userEmail = useUserEmail();

  const getNameFromEmail = (email: string) => {
    return email.split('.')[0] || email;
  };

  return (
    <HomeWrapper>
      <WelcomeMsg>Hey {getNameFromEmail(userEmail())} 👋</WelcomeMsg>
      <RequestSnack />
    </HomeWrapper>
  );
}
