import { styled } from 'solid-styled-components';

import RequestSnack from '../components/SnackStuff/RequestSnack';

const HomeWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Content = styled('div')`
  max-width: 1000px;
  width: 80vw;
  margin: 0 auto;
`;

export default function HomePage() {
  return (
    <HomeWrapper>
      <Content>
        <RequestSnack />
      </Content>
    </HomeWrapper>
  );
}
