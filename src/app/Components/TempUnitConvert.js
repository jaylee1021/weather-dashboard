
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function TempUnitConvert({ setTemp, setTempUnit, setTempLow, setTempHigh, weather, userData, toC }) {

    const tempUnit = typeof window !== 'undefined' && localStorage.getItem('tempUnit') ? localStorage.getItem('tempUnit') : 'f';

    const handleTempConversion = (e) => {
        const newTempUnit = e.target.value;
        localStorage.setItem('tempUnit', newTempUnit);
        if (newTempUnit === 'f') {
            setTemp(weather.temp_f);
            setTempUnit('F');
            setTempLow(userData.tempLow);
            setTempHigh(userData.tempHigh);
        } else if (newTempUnit === 'c') {
            setTemp(weather.temp_c);
            setTempUnit('C');
            setTempLow((toC(userData.tempLow)).toFixed(1));
            setTempHigh((toC(userData.tempHigh)).toFixed(1));
        }
    };

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ margin: '10px' }}>
            <InputLabel id="temp_unit_select">Temperature Unit</InputLabel>
            <Select
                labelId="temp_unit_select"
                id="temp_unit_select_menu"
                value={tempUnit}
                onChange={handleTempConversion}
                label="Temp_Unit"
                name='tempUnit'
            >
                <MenuItem value={'f'}>Fahrenheit</MenuItem>
                <MenuItem value={'c'}>Celsius</MenuItem>
            </Select>
        </FormControl>
    );
}