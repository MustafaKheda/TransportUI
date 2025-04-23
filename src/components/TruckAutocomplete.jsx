import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ListItemText } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function TruckMultiSelect({ selectedTrucks, setSelectedTrucks, options }) {
    console.log(options, selectedTrucks)
    return (
        <Autocomplete

            size='small'
            multiple
            limitTags={1}
            options={options}
            disableCloseOnSelect
            getOptionLabel={(option) => {
                console.log(option)
                return option.number
            }}
            value={selectedTrucks}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, newValue) => setSelectedTrucks(newValue)}
            renderOption={(props, option, { selected }) => {
                console.log(props)
                return < li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    <ListItemText primary={option.number} />
                </li>
            }
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Select Trucks"
                />
            )}
            sx={{ width: 250 }}
        />
    );
}
