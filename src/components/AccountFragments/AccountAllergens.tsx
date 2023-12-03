import { createSignal, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { fetchUserFromSession } from '../../services/authService';
import supabase from '../../services/supabaseClient';
import { FormControl, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@suid/material';
import { SelectChangeEvent } from '@suid/material/Select';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const Info = styled('p')`
  margin: 0.25rem 0;
`;

const SnackPreferenceForm = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
  .label {
    margin: 0;
  }
`;

const SmallText = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 0.25rem 0;
`;

const allergens = [
  'Vegetarian',
  'Vegan',
  'Gluten Free',
  'No Eggs',
  'No Nuts',
  'No Soy',
  'No Milk',
];

async function fetchFoodPreferences() {
  const userId = (await fetchUserFromSession())?.id;
  if (!userId) return [];
  const { data } = await supabase
    .from('Preferences')
    .select('dietary_requirements, snack_preferences, office_frequency')
    .eq('user_id', userId)
    .single();
  return data || {};
}

const saveUsersSnackPreferences = async (dietaryRequirements: string[], snackPreferences: string, officeFrequency: string) => {
  const userId = (await fetchUserFromSession())?.id;
  if (!userId) return;

  const { error } = await supabase
  .from('Preferences')
  .upsert([{
    user_id: userId,
    dietary_requirements: dietaryRequirements,
    snack_preferences: snackPreferences,
    office_frequency: officeFrequency,
  }]);

  if (error) {
    toast.error(`Unable to save dietary requirements.\n${error.message}`);
    console.error('Error saving dietary requirements:', error);
  } else {
    toast.success('Snack preferences updated!');
  }
};

interface Props {
  optionalSubmitCallback?: () => void;
};

export default function UserAllergensForm(props: Props) {
  
  const [selectedAllergens, setSelectedAllergens] = createSignal<string[]>([]);
  const [specifiedSnackPreferences, setSpecifiedSnackPreferences] = createSignal<string>('');
  const [daysInOffice, setDaysInOffice] = createSignal<string>('');

  onMount(async () => {
    const foodPreferences = await fetchFoodPreferences() as { dietary_requirements: string[], snack_preferences: string, office_frequency: string }
    setSelectedAllergens(foodPreferences.dietary_requirements || []);
    setSpecifiedSnackPreferences(foodPreferences.snack_preferences || '');
    setDaysInOffice(foodPreferences.office_frequency || '');
  });

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const { target: { value } } = event;
    setSelectedAllergens(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = () => {
    saveUsersSnackPreferences(selectedAllergens() || [], specifiedSnackPreferences() || '', daysInOffice() || '');
    if (props.optionalSubmitCallback) props.optionalSubmitCallback();
  };

  return (
    <Card>
      <SnackPreferenceForm>
        <SubHeading>Snack Preferences</SubHeading>
        <Info>
          Record your dietary requirements, likes & dislikes and your average
          office attendance, to help us best cater for you.
        </Info>

        <FormControl fullWidth>
          <InputLabel id="allergen-select-label">Select Requirements</InputLabel>
          <Select
            labelId="allergen-select-label"
            id="allergen-select"
            multiple
            value={selectedAllergens()}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Select Allergens" />}
            renderValue={(selected) => (
              <Box>
                {selected.map((value) => (
                <Chip label={value} />
                ))}
              </Box>
            )}
          >
            {allergens.map((name) => (
              <MenuItem value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          id="more-prefs"
          fullWidth
          multiline
          label="Additional Snack Preferences"
          placeholder="E.g. Healthy, high protein, 90s nostalgia, fair-trade"
          onChange={(_event, newVal) => { setSpecifiedSnackPreferences(newVal) }}
          value={specifiedSnackPreferences()}
        />

        <p class="label">How often do you attend the office in a typical week?</p>
        <ToggleButtonGroup
          color="primary"
          value={daysInOffice()}
          exclusive
          onChange={(event, newAlignment) => {
            setDaysInOffice(newAlignment);
          }}
        >
          <ToggleButton value="occasional">Occasionally</ToggleButton>
          <ToggleButton value="once">Once a week</ToggleButton>
          <ToggleButton value="two-or-three">2 - 3 days</ToggleButton>
          <ToggleButton value="four-plus">4+ days</ToggleButton>
        </ToggleButtonGroup>

        <SmallText>
          Allergy data is anonymized. The totals are used to influence the ordering system,
          to ensure everyone is suitably catered for where possible.<br />
          Your text preferences will be used to influence the AI snack suggestions.
        </SmallText>

        <Button size="small" onClick={handleSubmit}>Save Preferences</Button>
      </SnackPreferenceForm>
    </Card>
  );
}
