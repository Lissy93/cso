import supabase from './supabaseClient';
import { createSignal, createEffect } from 'solid-js';
import toast from 'solid-toast';

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
  if (error) {
    toast.error(`We were unable to authenticate you\n${error.message}`);
  }
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

export const fetchUserFromSession = async () => {
  const session = await (await supabase.auth.getSession()).data.session
  return session?.user
};
