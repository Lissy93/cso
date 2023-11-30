import { styled } from 'solid-styled-components';
import SnackSuggestions from '../components/SnackStuff/SnackSuggestions';

const SnackAIWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

export default function SnackAi() {
  return (
    <SnackAIWrapper>
      <SnackSuggestions onAiPage={true} />
    </SnackAIWrapper>
  )
}
