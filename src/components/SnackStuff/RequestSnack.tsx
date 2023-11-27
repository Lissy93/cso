import { Component, createSignal, createEffect, onCleanup, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Motion, Presence } from '@motionone/solid'

import supabase from '../../services/supabaseClient'
import { fetchUserFromSession } from '../../services/authService'
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import SnackList from './SnackList';

const SnackForm = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  transition: all 0.2s ease-in-out;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: inherit;
  }
`;

const SnackInputField = styled('input')`
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  outline: none;
  border: 1px solid var(--background);
  background: var(--background);
  transition: all 0.2s ease-in-out;
  font-family: Poppins, sans-serif;
  flex-grow: 1;
  &:focus {
    border: 1px solid var(--primary-darker);
  }
`;

const SubHeading = styled('h2')`
  margin: 0 0 1rem;
`;

const fetchUserSnacks = async () => {
  
  const userId = (await fetchUserFromSession())?.id;
  if (userId) {
    const { data, error } = await supabase
      .from('Snacks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching snacks:', error);
      return [];
    }
    return data;
  }
  return [];
};

interface SnackType {
  snack_name: string;
  user_id: string;
}

const RequestSnack: Component = () => {
  const [inputValue, setInputValue] = createSignal('');
  const [userSnacks, setUserSnacks] = createSignal<SnackType[]>([]);
  const [userId, setUserId] = createSignal<string | null>(null);


  createEffect(async () => {
    const session = await supabase.auth.getSession();
    if (session.data && session.data.session && session.data.session.user) {
      setUserId(session.data.session.user.id);
      setUserSnacks(await fetchUserSnacks());
    } else {
      console.error('No active session found');
    }
  });
  

  // Set up a channel for real-time updates
  const snackChannel = supabase
    .channel('snack_updates')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Snacks' },
      (payload) => {
        if (payload.new.user_id === userId()) {
          setUserSnacks([...userSnacks(), payload.new as SnackType]);
        }
      }
    )
    .subscribe();

  onCleanup(() => {
    supabase.removeChannel(snackChannel);
  });

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setInputValue(target.value);
  };

  const handleSubmit = async () => {
    const snackName = inputValue();
    if (snackName) {
      // Get the currently logged-in user's ID
      const session = await (await supabase.auth.getSession()).data.session
      const userId = session?.user?.id;
  
      // Ensure the user is logged in
      if (userId) {
        // Add the snack to the Supabase table with the user ID
        const { data, error } = await supabase
          .from('Snacks')
          .insert([{ snack_name: snackName, user_id: userId }]);
  
        if (error) {
          console.error('Error inserting snack:', error.message);
        } else {
          console.log('Snack added:', data);
          setInputValue(''); // Clear the input field after submission
        }
      } else {
        console.error('User not logged in');
      }
    }
  };

  return (
    <Card>
      <SubHeading>Request Snack</SubHeading>
      <SnackForm>
        <SnackInputField 
          type="text" 
          placeholder="Start typing..." 
          value={inputValue()} 
          onInput={handleInputChange} 
        />
        <Presence>
        <Show when={inputValue().length > 0}>
          <Motion.div
            animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
            transition={{ duration: 0.2,  ease: 'ease-in-out' }}
            initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
            exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
            >
            <Button size="medium" onClick={handleSubmit}>Request</Button>
          </Motion.div>
        </Show>
        </Presence>
      </SnackForm>

      <SubHeading>Your Requests</SubHeading>
      <SnackList snacks={userSnacks} />      
    </Card>
  );
};

export default RequestSnack;
