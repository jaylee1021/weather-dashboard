
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

export default function WindUnitConvert({ userId, setWindUnit, windUnit, toKnots, toMetersPerSec }) {

    // update user wind unit
    const storeUserWindUnit = (unit) => {
        axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, { unit })
            .then((res) => {
                // console.log(res.data.user.unit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // convert wind speed to knots or m/s
    const handleConversion = (e) => {
        const newUnit = e.target.value;
        localStorage.setItem('windUnit', newUnit);
        if (newUnit === 'knots') {
            toKnots();
        } else if (newUnit === 'm/s') {
            toMetersPerSec();
        }
        setWindUnit(newUnit);
        storeUserWindUnit(newUnit);
    };

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ margin: '10px' }}>
            <InputLabel id="wind_unit_select">Wind Unit</InputLabel>
            <Select
                labelId="wind_unit_select"
                id="wind_unit_select_menu"
                value={windUnit}
                onChange={handleConversion}
                label="Wind_Unit"
                name='windUnit'
            >
                <MenuItem value={'knots'}>knots</MenuItem>
                <MenuItem value={'m/s'}>m/s</MenuItem>
            </Select>
        </FormControl>
    );
}