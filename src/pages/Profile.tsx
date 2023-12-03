
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';

import AccountPreferences from '../components/AccountFragments/AccountPreferences';
import AccountInfo from '../components/AccountFragments/AccountInfo';
import AccountDeletion from '../components/AccountFragments/AccountDeletion';
import AccountData from '../components/AccountFragments/AccountData';
import AccountAllergens from '../components/AccountFragments/AccountAllergens';

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

const AboutText = styled('p')`
  margin: 0;
  font-family: RobotoMono, monospace;
  font-size: 0.9rem;
  a { color: var(--primary); }
`;

export default function Profile () {

  return (
    
    <>
    <ProfileWrapper>
      <AccountInfo />
      <AccountAllergens />
      <AccountData />
      <AccountPreferences />
      <AccountDeletion />
      <Card style="grid-column: 1 / -1;">
        <SubHeading>Further Info</SubHeading>
        <AboutText>For privacy policy, ToS, docs and more - please see the <a href="/about">About Page</a>.</AboutText>
      </Card>      
    </ProfileWrapper>
    </>
  );
}
