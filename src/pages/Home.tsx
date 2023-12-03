import { styled } from 'solid-styled-components';

import RequestSnack from '../components/SnackStuff/RequestSnack';
import SnackVoting from '../components/SnackStuff/SnackVoting';
import SnackSuggestions from '../components/SnackStuff/SnackSuggestions';
import SnackCountdown from '../components/SnackStuff/SnackCountdown';
import PromptForPreferences from '../components/other/PromptForPreferences';

const HomeWrapper = styled('div')`
  padding-bottom: 2rem;
  flex: 1;
`;

const Content = styled('div')`
  max-width: 1200px;
  width: 80vw;
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  margin: auto;

`;

export default function HomePage() {

  return (
    <HomeWrapper>
      <PromptForPreferences />
      <SnackCountdown />
      <Content>
        <RequestSnack style="grid-column-start: span 2;" />
        <SnackVoting
          snackLimit={5}
          channelName="newest_snack_updates"
          title="Latest Requests"
          sortOrder="newest"
          description="Show these newly requested snacks some love if you want to see them in the office!"
        />
        <SnackVoting style="grid-column: 1 / -1;" showSortMenu={true} snackLimit={20} showShowMoreButton={true} />
        <SnackSuggestions style="grid-column: 1 / -1;"  />
      </Content>
    </HomeWrapper>
  );
}
