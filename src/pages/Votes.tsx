import { styled } from 'solid-styled-components';
import SnackVoting from '../components/SnackStuff/SnackVoting';

const HomeWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  flex: 1;
`;

const Content = styled('div')`
  max-width: 1000px;
  width: 80vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default function HomePage() {
  return (
    <HomeWrapper>
      <Content>
        <SnackVoting
          showSortMenu={true}
          title="Get Voting!"
          description="Your opinion matters! Vote for the snacks you want to see in the office."
        />
      </Content>
    </HomeWrapper>
  );
}
