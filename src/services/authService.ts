import supabase from './supabaseClient';
import { createSignal, createEffect } from 'solid-js';

// Signals for authentication state and user details
export const [isAuthenticated, setIsAuthenticated] = createSignal(false);
const [userEmail, setUserEmail] = createSignal('');

// Check and update authentication state
createEffect(async () => {
  const {data: { session },} = await supabase.auth.getSession()
  setIsAuthenticated(!!session);
  setUserEmail(session?.user?.email || '');
  localStorage.setItem('supabase.auth.token', session?.access_token || '');
});

export const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  // TODO: handle error
  console.log(error);
}

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('supabase.auth.token');
  setIsAuthenticated(false);
  setUserEmail('');
}

export const rehydrateAuth = () => {
  supabase.auth.getSession()
};

export const useUserEmail = () => userEmail;

