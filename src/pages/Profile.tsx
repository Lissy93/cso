
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';

import AccountPreferences from '../components/fragments/AccountPreferences';
import AccountInfo from '../components/fragments/AccountInfo';
import AccountDeletion from '../components/fragments/AccountDeletion';

const ProfileWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
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
      <AccountDeletion />
      <Card style="grid-column: 1 / -1;">
        <SubHeading>About & Privacy</SubHeading>
      </Card>      
    </ProfileWrapper>
  );
}
