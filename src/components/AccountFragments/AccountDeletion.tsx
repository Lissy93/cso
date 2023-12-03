import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { fetchUserFromSession, logout } from '../../services/authService';
import supabase from '../../services/supabaseClient';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert, AlertTitle,
} from '@suid/material';
import toast from 'solid-toast';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const Info = styled('p')`
  margin: 0.25rem 0;
`;

const Warning = styled('p')`
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: var(--danger);
  b { font-family: 'PoppinsBold', sans-serif; }
`;

const DialogInner = styled('p')`
  margin: 0.25rem 0;
  color: var(--foreground);
  opacity: 0.9;
`;

export default function AccountInfo() {

  const [open, setOpen] = createSignal(false);
  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  const deleteAccount = async () => {
    const userId = (await fetchUserFromSession())?.id;
    if (!userId) return;
    const { error } = await supabase.from('Users').delete().eq('id', userId);
    if (error) {
      toast.error(`Unable to delete account.\n${error.message}`);
      return;
    }
    toast.success('Account deleted successfully.\nGood bye.');
    logout();
    window.location.reload();
  };

  return (
    <Card>
      <SubHeading>Account Deletion</SubHeading>
      <Info>Delete your account, and all associated data, from Snack Champion 🪦</Info>
      <Warning><b>Warning:</b> This action is irreversible!</Warning>
      <Button size="small" onClick={handleClickOpen}>Delete Account</Button>

      <Dialog open={open()} onClose={handleClose} >
        <DialogTitle>Are you sure you'd like to delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <DialogInner>
              <Alert severity="error">
                <AlertTitle>Important!</AlertTitle>
                This action is permanent and cannot be undone.<br />
                All of your data will be deleted from our servers.
              </Alert>
              <Info>y u no like snak?</Info>
            </DialogInner>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose}>Noooo! I made a mistake, take me back!</Button>
          <Button size="small" onClick={deleteAccount}>Yup, I hate snacks</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
