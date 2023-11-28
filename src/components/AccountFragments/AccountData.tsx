import { createResource } from 'solid-js';
import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { fetchUserFromSession } from '../../services/authService';
import supabase from '../../services/supabaseClient';
import type { Snack, Vote } from '../../typings/Snack';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const Info = styled('p')`
  margin: 0.25rem 0;
`;

const DataSummary = styled('div')`
  background: var(--background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin: 0.25rem 0;
  font-family: RobotoMono, monospace;
  font-size: 0.8rem;
  opacity: 0.5;
  b {
    font-weight: bold;
  }
`;

const SmallText = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 0.5rem 0;
`;

const fetchSnackByUser = async () => {
  const userId = (await fetchUserFromSession())?.id;
  if (userId) {
    const { data, error } = await supabase
      .from('Snacks')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      toast.error(`Unable to fetch snacks.\n${error.message}`);
      return [];
    }
    return data;
  }
  return [];
};

const fetchVotesByUser = async () => {
  const userId = (await fetchUserFromSession())?.id;
  if (userId) {
    const { data, error } = await supabase
      .from('Votes')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      toast.error(`Unable to fetch votes.\n${error.message}`);
      return [];
    }
    return data;
  }
  return [];
}

const downloadSnacksAsCsv = async (snacks: Snack[]) => {
  const csv = snacks.map((snack) => {
    return `${snack.snack_id},${snack.snack_name},${snack.user_id},${snack.created_at},${snack.snack_category},${snack.snack_meta}\n`;
  }).join('');
  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = `${new Date().getTime()}_snacks.csv`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const downloadVotesAsCsv = async (votes: Vote[]) => {
  const csv = votes.map((vote) => {
    return `${vote.vote_id},${vote.snack_id},${vote.user_id},${vote.created_at}\n`;
  }).join('');
  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = `${new Date().getTime()}_votes.csv`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};



export default function AccountDataRequest() {

  const [snacks] = createResource(fetchSnackByUser);
  const [votes] = createResource(fetchVotesByUser);

  const startDownload = () => {
    try {
      downloadSnacksAsCsv(snacks() || []);
      downloadVotesAsCsv(votes() || []);
      toast.success('Your data export has started.');
    } catch (e) {
      toast.error(`Unable to start data export`);
    }
  };


  return (
    <Card>
      <SubHeading>Account Data</SubHeading>
      <Info>You can request a copy of your data at any time.</Info>
      <Info>
        Your export will be in CSV format, all data will be decrypted
        and will include all data held, relating to the following:
      </Info>

      <DataSummary>
        <Info>Your <b>{(snacks() || []).length} snack requests</b></Info>
        <Info>Your <b>{(votes() || []).length} snack votes</b></Info>
      </DataSummary>

      <SmallText>
        Note that account info is managed by your SSO provider,
        and is not included in this export.
        Site preferences are stored locally, and so are also not included.
      </SmallText>

      <Button size="small" onClick={startDownload}>Start Data Export</Button>
    </Card>
  );
}
