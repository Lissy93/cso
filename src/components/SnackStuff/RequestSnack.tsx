import { Component, createSignal, createEffect, onCleanup, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Motion, Presence } from '@motionone/solid'
import toast from 'solid-toast';

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
      toast.error(`Unable to fetch snacks.\n${error.message}`);
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
      toast.error('Your session has been invalidated. Please log in again.');
    }
  });
  

  // Set up a channel for real-time snackdates
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
  
  // Unsubscribe from live snack updates, when component unmounts
  onCleanup(() => {
    supabase.removeChannel(snackChannel);
  });

  const handleInputChange = (event: KeyboardEvent | Event) => {
    // Update the input signal
    const target = event.target as HTMLInputElement;
    setInputValue(target.value);
    // If user presses Enter key, submit the snack
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Get snack name, and exit early if empty
    const snackName = inputValue();
    if (!snackName) {
      toast.error('Please enter a snack name');
      return;
    }

    // If snack already added, show error and exit early
    if (userSnacks().some((snack) => snack.snack_name.toLowerCase() === snackName.toLowerCase())) {
      toast.error('You have already added this snack');
      return;
    }

    // Get the currently logged-in user's ID
    const session = await (await supabase.auth.getSession()).data.session
    const userId = session?.user?.id;
    
    // Exit early if not valid user session
    if (!userId) {
      toast.error('Unable to add snack, your session has expired. Please log in again.');
      return;
    }

    // Add the snack into the database
    const { error } = await supabase
      .from('Snacks')
      .insert([{ snack_name: snackName, user_id: userId }]);

    // Show a success / error toast
    if (error) {
      toast.error('Unable to add snack 😢');
    } else {
      toast.success('Snack added! 🎉');
      setInputValue('');
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
          onKeyDown={handleInputChange}
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
