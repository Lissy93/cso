
import { styled } from "solid-styled-components";

import Card from '../components/atoms/Card';

const AboutWrapper = styled('div')`
  padding: 2rem 0;
  margin: 0 auto;
  width: 80vw;
  max-width: 1200px;
`;

const SubHeading = styled('h2')`
  font-size: 3rem;
  margin: 0;
`;

const SubSubHeading = styled('h3')`
  margin: 1rem 0 0.25rem 0;
  font-size: 1rem;
`;

const AboutSectionText = styled('p')`
  margin: 0;
  font-family: RobotoMono, monospace;
  font-size: 0.8rem;
  a { color: var(--primary); }
`;

const SnackBot = styled('img')`
  float: right;
  width: 160px;
`;

export default function Profile () {

  return (
    
    <>
    <AboutWrapper>
      <Card style="grid-column: 1 / -1;">
        <SubHeading>About</SubHeading>

        <SubSubHeading>Intro</SubSubHeading>
        <AboutSectionText>
          Snack Champion is an application for collecting and voting on snack requests for the office.<br />
          It's built by <a href="https://aliciasykes.com">Alicia Sykes</a>, and
          code (available on GitHub at <a href="https://github.com/lissy93/cso">Lissy93/CSO</a>), is free and open source,
          licensed under <a href="https://github.com/Lissy93/cso/blob/HEAD/LICENSE">MIT</a>.
        </AboutSectionText>
        
        <SubSubHeading>Privacy</SubSubHeading>
        <AboutSectionText>
          Your privacy is very important. You are in complete control of all your data. You can view/export or delete it at anytime.
          <br />
          We are transparent about what data we collect and why.
          We only collect the minimum amount of data required to provide the service.
          And this data is stored securely, encrypted at rest, and with scoped permissions.<br />
          For further information, please see the <a href="/privacy.txt">Privacy Policy</a>.
        </AboutSectionText>
        
        <SubSubHeading>Security</SubSubHeading>
        <AboutSectionText>
          The security of this service is taken very seriously.
          Precautions have been taken to ensure your data is as safe as possible.
          <br />          
          If you've got any questions or concerns, or want to report anything that doesn't look right,
          please see the <a href="/security.txt">Security Policy</a>.
        </AboutSectionText>

        <SubSubHeading>Terms of Service</SubSubHeading>
        <AboutSectionText>
          By using this service, you agree to the <a href="/terms.txt">Terms of Service</a>.<br />
          TL;DR: Be nice, don't do anything illegal, and don't try to hack the site.
        </AboutSectionText>

        <SubSubHeading>Documentation</SubSubHeading>
        <AboutSectionText>
          If you're interested in contributing or using Snack Champion, the full development and deployment
          docs are in the <a href="https://github.com/lissy93/cso#readme">README</a>.
        </AboutSectionText>

        <SubSubHeading>Support</SubSubHeading>
        <AboutSectionText>
          If you think you've found a bug, please open an issue <a href="https://github.com/lissy93/cso/issues/new">here</a> - thanks :)<br />
          Alternatively, you can get in contact with me directly via <a href="https://aliciasykes.com/contact">this form</a>.
        </AboutSectionText>

        <SubSubHeading>Thanks</SubSubHeading>
        <AboutSectionText>
          Thank you for using my app! I really hope you've enjoyed it 🥰
        </AboutSectionText>

        <SnackBot width="180" src="/snack-champ-bot.png" title="Hello World 👋" alt="Snack Champion - Alicia Sykes" />
      </Card>      
    </AboutWrapper>
    </>
  );
}
