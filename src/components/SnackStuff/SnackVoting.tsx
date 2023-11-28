import { createResource, createSignal, createEffect, For, Component } from 'solid-js';
import toast from 'solid-toast';
import supabase from '../../services/supabaseClient';
import SnackList from './SnackList';
import type { Snack, SnackVote, SnackWithVotes } from '../../typings/Snack';
import Card from '../atoms/Card';
import { styled } from 'solid-styled-components';
import { fetchUserFromSession } from '../../services/authService';

const SubHeading = styled('h2')`
  margin: 0 0 1rem;
`;

const fetchSnacksWithVotes = async () => {
  const { data, error } = await supabase
    .from('Snacks')
    .select(`
      *,
      Votes(*)
    `);

  if (error) {
    toast('Error fetching snacks and votes');
    return [];
  }
  return data;
};

const SnackVoting: Component = () => {
  const [allSnacks, setAllSnacks] = createSignal<SnackWithVotes[]>([]);
  const [userId, setUserId] = createSignal<string | null>(null);

  createEffect(async () => {
    setAllSnacks(await fetchSnacksWithVotes());

    const session = await supabase.auth.getSession();
    if (session.data && session.data.session && session.data.session.user) {
      setUserId(session.data.session.user.id);
    } else {
      toast.error('Your session has been invalidated. Please log in again.');
    }
  });


  createEffect(async () => {
    
  });

  // const handleVote = async (snack: Snack, voteType: SnackVote) => {
  //   const userId = (await fetchUserFromSession())?.id;
  //   console.log(`Going to vote "${voteType}" on "${snack.snack_id}" by user "${userId}"`);
  //   // Check if user already voted
  //   // Add or update vote in 'Votes' table
  //   // Update UI accordingly
  // };

  const handleVote = async (snack: Snack, voteType: SnackVote) => {
    const userId = (await fetchUserFromSession())?.id;
    const snackId = snack.snack_id;
  
    if (!userId) {
      toast.error('Unable to verify your session, please login again.');
      return;
    }
  
    // Check for existing vote
    const { data: existingVotes, error: existingVoteError } = await supabase
      .from('Votes')
      .select('*')
      .eq('user_id', userId)
      .eq('snack_id', snackId);
  
    if (existingVoteError) {
      toast.error('Unable to check for existing votes.');
      return;
    }
  
    if (existingVotes && existingVotes.length > 0) {
      toast.error(`Looks like you've already voted on ${snack.snack_name}`);
      return;
    }
  
    // Save new vote
    const { error: voteError } = await supabase
      .from('Votes')
      .insert([{ snack_id: snackId, user_id: userId, vote: voteType }]);
  
    if (voteError) {
      toast.error(`Unable to submit vote.\n${voteError.message}`);
    } else {
      toast.success('Vote saved successfully!');
    }
  };

  const getUserVoteForSnack = (snack: SnackWithVotes): SnackVote | null => {
    const snackId = snack.snack_id;
    if (!userId) {
      return null;
    }
    const userVote = snack.Votes.find((vote) => vote.user_id === userId() && vote.snack_id === snackId);
    return userVote?.vote || null;
  };
  

  return (
    <Card>
      <SubHeading>Get Voting!</SubHeading>
      <SnackList snacks={allSnacks} handleVote={handleVote} snackVoteChecker={getUserVoteForSnack} />
    </Card>
  );
};

export default SnackVoting;
