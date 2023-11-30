import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import { createResource, createSignal, createEffect } from 'solid-js';
import { Alert, AlertTitle, TextField } from '@suid/material';

import { fetchUserFromSession } from '../../services/authService';
import supabase from '../../services/supabaseClient';
import type { Snack } from '../../typings/Snack';
import Card from '../../components/atoms/Card';
import SnackList from '../../components/SnackStuff/SnackList';

import { prompt } from '../../services/super-complex-ai-from-scratch';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const doAiStuff = async (prompt: string) => {
  const response = await fetch('https://super-smart-snack-ai.as93.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { 'messages': [ { 'role': 'user', 'content': prompt } ]  }      
    )
  });

  const data = await response.json();
  return data;
};


interface SnackVotes  { upvoted: string[], downvoted: string[] }

const fetchUserSnackPreferences = async (): Promise<SnackVotes | null> => {
  const userId = (await fetchUserFromSession())?.id;

  const response = await supabase
    .from('Votes')
    .select('vote, Snacks(snack_name)')
    .eq('user_id', userId);

  if (response.error) {
    toast.error('Unable to fetch your voting data, which is required for the AI');
    return null;
  }

  const results: { upvoted: string[], downvoted: string[] } = {
    upvoted: [],
    downvoted: [],
  };

  response.data.forEach(snack => {
    if (snack.vote === "up") {
      results.upvoted.push((snack.Snacks as unknown as Snack).snack_name);
    } else if (snack.vote === "down") {
      results.downvoted.push((snack.Snacks as unknown as Snack).snack_name);
    }
  });
  return results;
}

const formatAiResponse = (response: string, onAiPage?: boolean): Snack[] => {
  if (response.length < 2 || response.includes('Nothing')) {
    if (onAiPage) {
      toast.error('The AI was unable to make any suggestions based on your preferences');
    }
    return [];
  }
  return response.split(', ').map((suggestion) => {
    return {
      snack_name: suggestion,
      snack_id: suggestion,
      snack_meta: 'AI Suggestion',
      user_id: 'AI',
      created_at: new Date().toISOString(),
    };
  });
};

interface SnackSuggestionProps {
  onAiPage?: boolean;
  style?: string;
}

export default function SnackAi(props: SnackSuggestionProps) {

  const [userSnackPreferences] = createResource(fetchUserSnackPreferences);
  const [extraPreferences, setExtraPreferences] = createSignal<string>('');
  const [enoughVotes, setEnoughVotes] = createSignal(false);
  const [aiResponse, setAiResponse] = createSignal<Snack[]>([]);
  const [inputValue, setInputField] = createSignal<string>('');

  createEffect(() => {
    const snackVotes = userSnackPreferences();
    if(snackVotes && (snackVotes?.downvoted.length + snackVotes?.upvoted.length <= 5)) {
      setEnoughVotes(false);
      if (props.onAiPage) {
        toast.error('You need to vote on at least 8 snacks before the AI can accurately make any suggestions');
      }
      return;
    }
    setEnoughVotes(true);
    let initialPrompt = prompt;
    if (props.onAiPage) { initialPrompt = initialPrompt.split('twelve').join('twenty seven') }
    const extras = extraPreferences() ? `The user has added this additional info for their snack preferences: ${extraPreferences().toString()}\n\n` : '';
    const firstPrompt = `${initialPrompt}\n\n Your first dataset is: ${(snackVotes || {}).toString()}.\n\n${extras}Please respond with suggestions.`;

    doAiStuff(firstPrompt).then((response) => {
      const aiAnswers = formatAiResponse(response.choices[0].message.content || '', props.onAiPage);
      if (aiAnswers.length > 0) {
        setAiResponse(aiAnswers);
      }
    });
  });

  const addSnack = async (snack: Snack) => {
    const snackName = snack.snack_name;

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
      if (error.code === '23505') {
        toast.error('You have already added this snack');
        return;
      } else {
        toast.error('Unable to add snack 😢');  
      }
    } else {
      toast.success('Snack added! 🎉');
      // Remove the snack from the snack list
      setAiResponse(aiResponse().filter((s) => s.snack_name !== snackName));

    }
  };

  const userWantsToApplyExtraPreferences = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      setExtraPreferences(inputValue());
      setInputField('');
    }
  }

  return (
    <Card style={props.style}>
      <SubHeading>Snack AI</SubHeading>

      { !enoughVotes() && (
        <Alert severity="error">
          <AlertTitle>Not enough Votes</AlertTitle>
          You need to vote on at least 8 snacks before the AI can start to
          accurately make any suggestions.
        </Alert>
      )}
      { enoughVotes() && aiResponse().length > 0 && (
        <>
          <p>Based on your voting preferences, we think you might like:</p>
          <SnackList snacks={aiResponse} allowAddition={true} handleAddition={addSnack} />
        </>
      )}
      
      { enoughVotes() && (aiResponse().length > 0) && props.onAiPage && (
        <>
        <p>Not quite right? Tell us what you're feeling, and we'll update our suggestions.</p>
        <TextField
          fullWidth sx={{ m: 1 }}
          value={inputValue()}
          onChange={(_event, newVal) => { setInputField(newVal) }}
          onKeyPress={userWantsToApplyExtraPreferences}
          id="standard-basic"
          label="Help train me"
          variant="standard"
          placeholder="E.g. Healthier, high protein, no caffeine, vegan only. Then press enter"
        />
        </>
      )}

      { enoughVotes() && aiResponse().length === 0 && (
        <>
          <p>Nothing yet, check back soon.</p>
        </>
      )}
    </Card>
  )
}
