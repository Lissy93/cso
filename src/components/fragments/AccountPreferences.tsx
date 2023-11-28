import { styled } from 'solid-styled-components';
import { createSignal } from 'solid-js';
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Switch,
  Select,
  MenuItem,
} from '@suid/material';

import Card from '../atoms/Card';
import Button from '../atoms/Button';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const PreferenceSection = styled('div')`
  margin: 1rem 0;
  h3 {
    margin 0.5rem 0;
  }
`;

const SmallText = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 0;
`;

export default function AccountPreferences() {

  const [theme, setTheme] = createSignal('light');
  const [notifications, setNotifications] = createSignal(false);
  const [language, setLanguage] = createSignal('en-GB');
  const [errorTracking, setErrorTracking] = createSignal(false);
  const [analytics, setAnalytics] = createSignal(false);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Preferences saved:',{ theme: theme(), notifications: notifications(), language: language(), errorTracking: errorTracking(), analytics: analytics() });
  };

  return (
    <Card style="grid-row-start: span 2;">
    <SubHeading>Preferences</SubHeading>
    <FormControl>
      <PreferenceSection>
        <h3>Theme</h3>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={theme()}
            onChange={(_event, newValue) => { setTheme(newValue) }}
          >
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="light" control={<Radio />} label="Light" />
          </RadioGroup>
      </PreferenceSection>

      <PreferenceSection>
        <h3>Notifications</h3>
        <FormControlLabel
        control={
          <Switch
          checked={notifications()}
          onChange={(_event, value) => {setNotifications(value); }}
          inputProps={{ "aria-label": "controlled" }}
        />
        }
        label="Enable Notifications"
        />
      </PreferenceSection>

      <PreferenceSection>
        <h3>Language</h3>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={language()}
            label="Language"
            onChange={(event) => { setLanguage(event.target.value) }}
          >
            <MenuItem value="en-GB">English</MenuItem>
            <MenuItem value="en-US">American</MenuItem>
          </Select>
      </PreferenceSection>

      <PreferenceSection>
        <h3>Reporting</h3>
        <SmallText>Enabling these options help me improve the application.</SmallText>
        <FormGroup>
          <FormControlLabel control={
            <Checkbox value={errorTracking()} onChange={(_event, newVal) => { setErrorTracking(newVal) }}/>
          } label="Allow error reporting" />
          <FormControlLabel control={
            <Checkbox value={analytics()} onChange={(_event, newVal) => { setAnalytics(newVal) }}/>
          } label="Allow anonymized usage analytics" />
        </FormGroup>
        <SmallText>
          Error tracking is handled using a self-hosted instance of <a href="https://glitchtip.com/">GlitchTip</a>.<br />
          Anonymized analytics are logged with a self-hosted instance of <a href="https://plausible.io/">Plausible</a>.<br />
          No personally identifiable information is collected. You can opt-out at any time.
        </SmallText>
      </PreferenceSection>

      <PreferenceSection>
      <Button size="medium" onClick={handleSave}>Save Changes</Button>
      </PreferenceSection>

    </FormControl>
  </Card>
  );
}
