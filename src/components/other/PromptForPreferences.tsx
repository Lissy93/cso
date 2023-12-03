import {
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@suid/material";

import { styled } from "solid-styled-components";
import Button from "../atoms/Button";
import { createSignal, onMount } from "solid-js";

import toast from "solid-toast";

import AccountAllergens from '../AccountFragments/AccountAllergens';
import supabase from "../../services/supabaseClient";
import { fetchUserFromSession } from '../../services/authService';

const InnerWrapper = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  .right {
    display: flex;
    gap: 1rem;
    .dismiss {
      cursor: pointer;
    }
  }
`;

const PromptForPreferences = () => {

  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setIsVisible(false);
  };

  const checkIfUserHasAddedAnythingYet = async () => {
    const userId = (await fetchUserFromSession())?.id;
    if (!userId) return;
    const { data, error } = await supabase
      .from('Preferences')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    setIsVisible((error && error?.code === 'PGRST116') || !data ? true : false);
  }

  const dismissPrompt = async () => {
    const userId = (await fetchUserFromSession())?.id;
    await supabase.from('Preferences').insert([{ user_id: userId }]);
    toast.success(
      'Okay, we won\'t show this message again.\n'+
      'You can update your preferences at anytime in your profile.',
      { duration: 5000},
    );
    setIsVisible(false);
  };

  onMount(async () => {
    checkIfUserHasAddedAnythingYet();
  });

  return (
    <>
      {isVisible() && (
      <Alert severity="error">
        <InnerWrapper>
          Looks like you've not yet set your dietary requirements or global snack preferences.
          <div class="right">
            <span class="dismiss" onClick={dismissPrompt}>Dismiss</span>
            <Button onClick={handleClickOpen} size="small">Finish Account Setup</Button>
          </div>
        </InnerWrapper>
      </Alert>)
      }

      <Dialog
        open={dialogOpen()}
        onClose={handleClose}
        aria-describedby="complete-dietary-preferences"
      >
        <DialogContent style="padding: 0">
          <DialogContentText id="complete-dietary-preferences">
            <AccountAllergens optionalSubmitCallback={handleClose} />
            
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptForPreferences;
