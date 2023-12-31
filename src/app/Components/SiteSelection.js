
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SiteSelection({ fetchData, }) {

    const handleSiteSelection = async (e) => {
        localStorage.setItem('selectSite', e.target.value);
        try {
            await fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ margin: '10px 10px 10px 0' }}>
            <InputLabel id="site_select_label">Site</InputLabel>
            <Select
                labelId="site_select"
                id="site_select_menu"
                value={localStorage.getItem('selectSite') ? localStorage.getItem('selectSite') : 'hsiland'}
                onChange={handleSiteSelection}
                label="Select_site"
                name='selectSite'
            >
                <MenuItem value={'hsiland'}>Hsiland</MenuItem>
                <MenuItem value={'pdt10_hangar'}>PDT10 Hangar</MenuItem>
                <MenuItem value={'pdt10_northpad'}>PDT10 North Pad</MenuItem>
            </Select>
        </FormControl>
    );
}