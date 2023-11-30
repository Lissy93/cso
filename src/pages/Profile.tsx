
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';

import AccountPreferences from '../components/AccountFragments/AccountPreferences';
import AccountInfo from '../components/AccountFragments/AccountInfo';
import AccountDeletion from '../components/AccountFragments/AccountDeletion';
import AccountData from '../components/AccountFragments/AccountData';
import AccountAllergens from '../components/AccountFragments/AccountAllergens';
import { Alert, AlertTitle } from "@suid/material";

const ProfileWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
    
    <>
    <Alert severity="info">
      <AlertTitle>Profile Page Info</AlertTitle>
        This page is still a work in progress....
    </Alert>
    <ProfileWrapper>
      <AccountInfo />
      <AccountAllergens />
      <AccountPreferences />
      <AccountData />
      <AccountDeletion />
      <Card style="grid-column: 1 / -1;">
        <SubHeading>About & Privacy</SubHeading>
      </Card>      
    </ProfileWrapper>
    </>
  );
}
