import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import '../css/weather.css';
import { useState } from 'react';
import axios from 'axios';

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

export default function UpdateParams({ userId, windUnit, fetchUser }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [state, setState] = useState({
        steadyWind: '',
        windGust: '',
        tempLow: '',
        tempHigh: '',
        visibility: '',
        cloudBaseHeight: '',
        densityAltitudeLow: '',
        densityAltitudeHigh: '',
        windDirectionLow: '',
        windDirectionHigh: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
            wind: state.steadyWind, windGust: state.windGust,
            userWindUnit: windUnit, userWindGustUnit: windUnit,
            tempLow: state.tempLow, tempHigh: state.tempHigh, visibility: state.visibility,
            cloudBaseHeight: state.cloudBaseHeight, densityAltitudeLow: state.densityAltitudeLow,
            densityAltitudeHigh: state.densityAltitudeHigh, windDirectionLow: state.windDirectionLow,
            windDirectionHigh: state.windDirectionHigh
        })
            .then((res) => {
                fetchUser();
                handleClose();
                setState({
                    ...state, steadyWind: '', windGust: '', tempLow: '', tempHigh: '', visibility: '',
                    cloudBaseHeight: '', densityAltitudeLow: '', densityAltitudeHigh: '', windDirectionLow: '', windDirectionHigh: ''
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Button variant='outlined' onClick={handleOpen}>Update Test Card Op Window</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className="table_border">
                            <div style={{ padding: '10px' }}>
                                <h3 style={{ color: 'black' }}>Update Operating Window</h3>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField id="steadyWind" label="Steady Wind" variant="standard" value={state.steadyWind} onChange={handleChange} name='steadyWind' required />
                                    <TextField id="windGust" label="Wind Gust" variant="standard" value={state.windGust} onChange={handleChange} name='windGust' required />
                                    <TextField id="tempLow" label="Temp Low" variant="standard" value={state.tempLow} onChange={handleChange} name='tempLow' />
                                    <TextField id="tempHigh" label="Temp High" variant="standard" value={state.tempHigh} onChange={handleChange} name='tempHigh' />
                                    <TextField id="visibility" label="Visibility" variant="standard" value={state.visibility} onChange={handleChange} name='visibility' />
                                    <TextField id="cloudBaseHeight" label="Cloud Base Height" variant="standard" value={state.cloudBaseHeight} onChange={handleChange} name='cloudBaseHeight' />
                                    <TextField id="densityAltitudeLow" label="Density Alt Low" variant="standard" value={state.densityAltitudeLow} onChange={handleChange} name='densityAltitudeLow' />
                                    <TextField id="densityAltitudeHigh" label="Density Alt High" variant="standard" value={state.densityAltitudeHigh} onChange={handleChange} name='densityAltitudeHigh' />
                                    <TextField id="windDirectionLow" label="Wind Direction Lower Limit" variant="standard" value={state.windDirectionLow} onChange={handleChange} name='windDirectionLow' />
                                    <TextField id="windDirectionHigh" label="Wind Direction Upper Limit" variant="standard" value={state.windDirectionHigh} onChange={handleChange} name='windDirectionHigh' />
                                    <Button variant='outlined' type="submit" style={{ margin: '10px 0' }} className="button_style">submit</Button>
                                </form>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}