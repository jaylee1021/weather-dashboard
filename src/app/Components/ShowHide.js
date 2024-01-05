import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import '../css/weather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox, FormControlLabel, Switch } from '@mui/material';
import { Form, FormControl } from 'react-bootstrap';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ShowHide({ userData, userId, fetchUser }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectAll, setSelectAll] = useState(false);

    const [state, setState] = useState({
        showWind: userData.showWind,
        showWindGust: userData.showWindGust,
        showTemp: userData.showTemp,
        showPrecipitation: userData.showPrecipitation,
        showVisibility: userData.showVisibility,
        showCloudBaseHeight: userData.showCloudBaseHeight,
        showDensityAltitude: userData.showDensityAltitude,
        showLighteningStrike: userData.showLighteningStrike,
        showWindDirection: userData.showWindDirection
    });

    const { showWind, showWindGust, showTemp, showPrecipitation, showVisibility,
        showCloudBaseHeight, showDensityAltitude, showLighteningStrike, showWindDirection } = state;


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                showWind: state.showWind,
                showWindGust: state.showWindGust,
                showTemp: state.showTemp,
                showPrecipitation: state.showPrecipitation,
                showVisibility: state.showVisibility,
                showCloudBaseHeight: state.showCloudBaseHeight,
                showDensityAltitude: state.showDensityAltitude,
                showLighteningStrike: state.showLighteningStrike,
                showWindDirection: state.showWindDirection
            });

            fetchUser();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectAllOrNone = (e) => {

        setSelectAll(e.target.checked);

        setState({
            ...state, showWind: e.target.checked, showWindGust: e.target.checked, showTemp: e.target.checked,
            showPrecipitation: e.target.checked, showVisibility: e.target.checked, showCloudBaseHeight: e.target.checked,
            showDensityAltitude: e.target.checked, showLighteningStrike: e.target.checked, showWindDirection: e.target.checked
        });
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.checked });
    };

    return (
        <div>
            <Button variant='outlined' onClick={handleOpen}>Show/Hide Ops Window</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className="table_border">
                            <div style={{ padding: '10px', color: 'black' }}>
                                <h3 style={{ color: 'black' }}>Show/Hide Indicators</h3>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

                                    <FormControlLabel
                                        control={<Switch checked={selectAll} onChange={handleSelectAllOrNone} name='selectAllOrNone' />}
                                        label="Select All"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showWind} onChange={handleChange} name='showWind' />}
                                        label="Steady Wind"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showWindGust} onChange={handleChange} name='showWindGust' />}
                                        label="Wind Gust"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showTemp} onChange={handleChange} name='showTemp' />}
                                        label="Air Temperature"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showPrecipitation} onChange={handleChange} name='showPrecipitation' />}
                                        label="Precipitation"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showVisibility} onChange={handleChange} name='showVisibility' />}
                                        label="Visibility"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showCloudBaseHeight} onChange={handleChange} name='showCloudBaseHeight' />}
                                        label="Cloud Base Height"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showDensityAltitude} onChange={handleChange} name='showDensityAltitude' />}
                                        label="Density Altitude"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showLighteningStrike} onChange={handleChange} name='showLighteningStrike' />}
                                        label="Lightening Strike"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={showWindDirection} onChange={handleChange} name='showWindDirection' />}
                                        label="Wind Direction"
                                    />

                                    <Button variant='outlined' type="submit" className="button_style">submit</Button>
                                </form>
                            </div>
                        </div>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {/* Duis mollis, est non commodo luctus, nisi erat porttitor ligula. */}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}