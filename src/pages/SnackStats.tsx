import { styled } from 'solid-styled-components';

import Card from '../components/atoms/Card';
import { Alert, AlertTitle } from '@suid/material';

const SnackStatsWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Subheading = styled('h2')`
  margin: 0.5rem 0;
  font-size: 2rem;  
`;

export default function SnackStats() {
  return (
    <SnackStatsWrapper>
      <Card>
        <Subheading>Snack Stats</Subheading>
        <Alert severity="info">
            <AlertTitle>Coming Soon</AlertTitle>
              There's not currently enough vote data to show stats.<br />
              Check back soon for fun graphs and charts!
        </Alert>
      </Card>
    </SnackStatsWrapper>
  )
}
