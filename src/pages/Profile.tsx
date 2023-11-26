
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';

import AccountPreferences from '../components/fragments/AccountPreferences';
import AccountInfo from '../components/fragments/AccountInfo';

const ProfileWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
  margin: 0 auto;
  width: 80vw;
  max-width: 1200px;
`;

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

export default function Profile () {

  return (
    <ProfileWrapper>
      <AccountInfo />

      <AccountPreferences />

      <Card>
        <SubHeading>Account Deletion</SubHeading>
        <p>Delete your account, and all associated data, from Snack Champion.</p>
        <p>Warning: this action is irreversible!</p>
        <Button size="small" onClick={() => {}}>Delete Account</Button>
      </Card>
      <Card>
        <SubHeading>About & Privacy</SubHeading>
      </Card>      
    </ProfileWrapper>
  );
}
