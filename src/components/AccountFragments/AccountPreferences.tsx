import { styled } from 'solid-styled-components';
import { createSignal, onMount } from 'solid-js';
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
import supabase from '../../services/supabaseClient';
import { fetchUserFromSession } from '../../services/authService';
import toast from 'solid-toast';

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

interface Preferences {
  theme: string;
  enable_notifications: boolean;
  language: string;
  enable_error_reporting: boolean;
  enable_analytics: boolean;
};

export default function AccountPreferences() {

  const [theme, setTheme] = createSignal('light');
  const [notifications, setNotifications] = createSignal(false);
  const [language, setLanguage] = createSignal('en-GB');
  const [errorTracking, setErrorTracking] = createSignal(true);
  const [analytics, setAnalytics] = createSignal(false);

  onMount(async () => {
    fetchUserPreferences().then((prefs: Preferences) => {
      setTheme(prefs.theme);
      setNotifications(prefs.enable_notifications);
      setLanguage(prefs.language);
      setErrorTracking(prefs.enable_error_reporting);
      setAnalytics(prefs.enable_analytics);
    });
  });

  const handleSave = async () => {
    const userId = (await fetchUserFromSession())?.id;
    const updatedPrefs = {
      theme: theme(),
      enable_notifications: notifications(),
      language: language(),
      enable_error_reporting: errorTracking(),
      enable_analytics: analytics(),
    };

    const { error } = await supabase
      .from('Preferences')
      .upsert([{ user_id: userId, ...updatedPrefs }]);

    if (error) {
      toast.error('Unable to save preferences.');
    } else {
      toast.success('Preferences saved.');
    }
  };

  async function fetchUserPreferences() {
    const userId = (await fetchUserFromSession())?.id;
    if (!userId) return null;
  
    const { data, error } = await supabase
      .from('Preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }  
    return data || {};
  }

  return (
    <Card style="grid-row-start: span 2;">
    <SubHeading>Site Preferences</SubHeading>
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
            sx={{ m: 1, width: 300 }}
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
            <Checkbox 
              checked={errorTracking()} 
              onChange={(_event, newVal) => setErrorTracking(newVal)}
            />
          } label="Allow error reporting" />
          <FormControlLabel control={
            <Checkbox 
              checked={analytics()} 
              onChange={(_event, newVal) => setAnalytics(newVal)}
            />
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
