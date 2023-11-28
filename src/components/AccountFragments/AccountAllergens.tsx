import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import toast from 'solid-toast';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
// import { fetchUserFromSession } from '../../services/authService';
// import supabase from '../../services/supabaseClient';
// import type { Snack, Vote } from '../../typings/Snack';
import { FormControl, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem } from '@suid/material';
import { SelectChangeEvent } from '@suid/material/Select';

const SubHeading = styled('h2')`
  margin: 0.25rem 0;
`;

const Info = styled('p')`
  margin: 0.25rem 0;
`;


const SmallText = styled('p')`
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 0.5rem 0;
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

export default function UserAllergensForm() {
  
  const [selectedAllergens, setSelectedAllergens] = createSignal<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedAllergens(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = () => {
    console.log('Selected Allergens:', selectedAllergens());
    toast.success('Allergens saved!');
    // Handle the submission logic here
  };

  return (
    <Card>
      <SubHeading>Dietary Requirements</SubHeading>
      <Info>
        Record items you do not eat, to help us cater for you.
      </Info>

      <FormControl sx={{ m: 1, width: 300 }}>
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

      <SmallText>
        Allergy data is anonymized. The totals are used to influence the ordering system,
        to ensure everyone is suitably catered for where possible.
      </SmallText>

      <Button size="small" onClick={handleSubmit}>Save Preferences</Button>
    </Card>
  );
}
