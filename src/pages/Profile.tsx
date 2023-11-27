
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';

import AccountPreferences from '../components/fragments/AccountPreferences';
import AccountInfo from '../components/fragments/AccountInfo';
import AccountDeletion from '../components/fragments/AccountDeletion';

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
      <AccountDeletion />
      <Card>
        <SubHeading>About & Privacy</SubHeading>
      </Card>      
    </ProfileWrapper>
  );
}
