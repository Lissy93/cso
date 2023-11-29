import { createSignal, createEffect, onCleanup, Component, Show } from 'solid-js';
import toast from 'solid-toast';
import { ToggleButton, ToggleButtonGroup, CircularProgress } from '@suid/material';

import supabase from '../../services/supabaseClient';
import SnackList from './SnackList';
import type { Snack, SnackVote, SnackWithVotes } from '../../typings/Snack';
import Card from '../atoms/Card';
import { styled } from 'solid-styled-components';
import { fetchUserFromSession } from '../../services/authService';

const SubHeading = styled('h2')`
  margin: 0;
`;

const SubSubHeading = styled('p')`
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const TopPartOfTheSnackVoteWidget = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ShowMoreButton = styled('a')`
  background: var(--primary);
  padding: 0.1rem 0.5rem;
  color: var(--foreground);
  text-decoration: none;
  border-radius: 4px;
  margin: 1rem auto;
  font-size: 1.1rem;
  float: right;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: var(--primary-darker);
    transform: scale(1.05);
  }
`;

const LoadingSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  h3 { font-size: 2.5rem; }
`;

type SortMethod = 'default' | 'newest' | 'loved' | 'hated' | 'controversial' | 'alphabetical';

const SortMenu = styled('div')``;

/**
 * Queries the database for all snacks, and combines with all linked votes
 * @returns 
 */
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

interface Props {
  style?: string;
  title?: string;
  description?: string;
  sortOrder?: SortMethod;
  channelName?: string;
  snackLimit?: number;
  showSortMenu?: boolean;
  showShowMoreButton?: boolean;
}

const SnackVoting: Component<Props> = (props) => {
  const [allSnacks, setAllSnacks] = createSignal<SnackWithVotes[]>([]);
  const [sortedSnacks, setSortedSnacks] = createSignal<SnackWithVotes[]>([]);
  const [userId, setUserId] = createSignal<string | null>(null);

  const [sortMethod, setSortMethod] = createSignal<SortMethod>(props.sortOrder || 'default');

  /**
   * Sorts and limits the snack list, based on where the component's used
   * @param snacks 
   * @returns 
   */
  const sortSnacks = (snacks: SnackWithVotes[]) => {
    let sorted = snacks;
    if (sortMethod() === 'newest') {
      sorted = snacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (props.sortOrder === 'loved') {
      sorted = snacks.sort((a, b) => {
        const netVotesA = a.Votes.filter(vote => vote.vote === 'up').length;
        const netVotesB = b.Votes.filter(vote => vote.vote === 'up').length;
        return netVotesA - netVotesB;
      });
    } else if (sortMethod() === 'hated') {
      sorted = snacks.sort((a, b) => {
        const netVotesA = a.Votes.filter(vote => vote.vote === 'down').length;
        const netVotesB = b.Votes.filter(vote => vote.vote === 'down').length;
        return netVotesB - netVotesA;
      });
    } else if (sortMethod() === 'alphabetical') {
      sorted = snacks.sort((a, b) => {
        const nameA = a.snack_name.toUpperCase();
        const nameB = b.snack_name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }      
        return 0;
      });
    } else if (sortMethod() === 'controversial') {
      sorted = snacks.sort((a, b) => {
        const upVotesA = a.Votes.filter(vote => vote.vote === 'up').length;
        const downVotesA = a.Votes.filter(vote => vote.vote === 'down').length;
        const gapA = Math.abs(upVotesA - downVotesA);
        const upVotesB = b.Votes.filter(vote => vote.vote === 'up').length;
        const downVotesB = b.Votes.filter(vote => vote.vote === 'down').length;
        const gapB = Math.abs(upVotesB - downVotesB);
        return gapB - gapA;
      });
    } else {
      sorted = snacks.sort((a, b) => {
        const netVotesA = a.Votes.filter(vote => vote.vote === 'up').length - a.Votes.filter(vote => vote.vote === 'down').length;
        const netVotesB = b.Votes.filter(vote => vote.vote === 'up').length - b.Votes.filter(vote => vote.vote === 'down').length;
        return netVotesB - netVotesA; // Sort in descending order of net votes
      });      
    }
    if (props.snackLimit) {
      return sorted.slice(0, props.snackLimit);
    }
    return sorted;
  };

  /**
   * On first render, pre-fetch the snacks + votes, and set user ID for later
   */
  createEffect(async () => {
    setAllSnacks(await fetchSnacksWithVotes());

    const session = await supabase.auth.getSession();
    if (session.data && session.data.session && session.data.session.user) {
      setUserId(session.data.session.user.id);
    } else {
      toast.error('Your session has been invalidated. Please log in again.');
    }
  });

  /**
   * Whenever the snack list changes, sort and limit the list
   */
  createEffect(() => {
    setSortedSnacks([...sortSnacks(allSnacks())]);
  });

  /**
   * Setup a channel for the websocket to listen for DB changes
   * Subscribe to the Votes table, triggers a snack update when change is detected
   */
  createEffect(() => {
    const snackChannel = supabase.channel(props.channelName || 'snack_vote_updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Votes' },
        async (payload) => {
          if (payload.new) {
            const updatedSnacks = await fetchSnacksWithVotes();
            setAllSnacks(updatedSnacks);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Snacks' },
        async (payload) => {
          if (payload.new) {
            const updatedSnacks = await fetchSnacksWithVotes();
            setAllSnacks(updatedSnacks);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Votes' },
        async (payload) => {
          if (payload.new) {
            const updatedSnacks = await fetchSnacksWithVotes();
            setAllSnacks(updatedSnacks);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'Votes' },
        async () => {
          const updatedSnacks = await fetchSnacksWithVotes();
          setAllSnacks(updatedSnacks);
        }
      )
      .subscribe();
  
    onCleanup(() => {
      supabase.removeChannel(snackChannel);
    });
  });


  /**
   * Called whenever a user votes on a snack. Takes snack_id and vote (up/down)
   * If no vote placed yet, the users vote will be recorded
   * If user already placed same vote (up/up or down/down), the vote will be removed
   * If user already placed opposite vote (up/down or down/up), the vote will be updated
   * @param snack 
   * @param voteType 
   * @returns 
   */
  const handleVote = async (snack: Snack, voteType: SnackVote) => {
    const userId = (await fetchUserFromSession())?.id;
    const snackId = snack.snack_id;
  
    if (!userId) {
      toast.error('Unable to verify your session, please login again.');
      return;
    }
  
    // Check for existing vote
    const { data: existingVotes } = await supabase
      .from('Votes')
      .select('*')
      .eq('user_id', userId)
      .eq('snack_id', snackId);
    
    if (existingVotes && existingVotes.length > 0) {
      const existingVote = existingVotes[0];
      if (existingVote.vote === voteType) {
        // Remove vote
        const { error } = await supabase.from('Votes')
          .delete().match({ vote_id: existingVote.vote_id });
        if (error) {
          toast.error('Error removing vote.');
        } else {
          toast.success('Vote removed.');
        }
      } else {
        // Change vote
        const { error } = await supabase.from('Votes')
          .update({ vote: voteType }).match({ vote_id: existingVote.vote_id });
        if (error) {
          toast.error('Error updating vote.');
        } else {
          toast.success('Vote updated.');
        }
      }
    } else { // Create a new vote
      const { error } = await supabase.from('Votes')
        .insert([{ snack_id: snackId, user_id: userId, vote: voteType }]);
      if (error) {
        toast.error('Unable to submit vote.');
      } else {
        toast.success('Vote saved successfully!');
      }
    }
  };
  

  /**
   * For a given snack, check if user has submitted a vote
   * Returns 'up' or 'down' if they have, or null if they haven't
   * @param snack 
   * @returns 
   */
  const getUserVoteForSnack = (snack: SnackWithVotes): SnackVote | null => {
    const snackId = snack.snack_id;
    if (!userId) {
      return null;
    }
    const userVote = snack.Votes.find((vote) => vote.user_id === userId() && vote.snack_id === snackId);
    return userVote?.vote || null;
  };
  

  return (
    <Card style={props.style}>
      <TopPartOfTheSnackVoteWidget>
        <SubHeading>{props.title || 'Get Voting!'}</SubHeading>
        {props.showSortMenu && (
        <SortMenu>
          <ToggleButtonGroup size="small" color="primary" value={[sortMethod()]}
            onChange={(_clickEvent, something)=>{
              setSortMethod(something[1] || 'default')
            }}>
            <ToggleButton value="default">Auto</ToggleButton>
            <ToggleButton value="newest">Newest</ToggleButton>
            <ToggleButton value="loved">Most Loved</ToggleButton>
            <ToggleButton value="hated">Least Loved</ToggleButton>
            <ToggleButton value="controversial">Most Controversial</ToggleButton>
            <ToggleButton value="alphabetical">Alphabetical</ToggleButton>
          </ToggleButtonGroup>
        </SortMenu>
        )}
      </TopPartOfTheSnackVoteWidget>
      {props.description && <SubSubHeading>{props.description}</SubSubHeading>}
      <Show when={sortedSnacks().length < 1}>
        <LoadingSection>
          <h3>Loading</h3>
          <CircularProgress color="secondary" size="93px" />
        </LoadingSection>
      </Show>
      <SnackList snacks={sortedSnacks} handleVote={handleVote} snackVoteChecker={getUserVoteForSnack} />
      {(props.showShowMoreButton && sortedSnacks().length > (props.snackLimit || 20) - 1) && (
        <ShowMoreButton href="vote">Show More</ShowMoreButton>
      )}
    </Card>
  );
};

export default SnackVoting;
