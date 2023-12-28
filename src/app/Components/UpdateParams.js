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

export default function UpdateParams({ userId, windOpWindow, windGustOpWindow, windUnit }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newWindOpWindow, setNewWinOpWindow] = useState('');
    const [newWindGustOpWindow, setNewWindGustOpWindow] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newWindOpWindow === '' || newWindGustOpWindow === '') {
            alert('Please enter a value for both wind and wind gust');
            return;
        }
        // update wind and wind gust op operating window if both are entered
        if (newWindOpWindow && newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                wind: newWindOpWindow, windGust: newWindGustOpWindow,
                userWindUnit: windUnit, userWindGustUnit: windUnit
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (newWindOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                wind: newWindOpWindow, windGust: windGustOpWindow, userWindUnit: windUnit
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                windGust: newWindGustOpWindow, wind: windOpWindow,
                userWindGustUnit: windUnit
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        window.location.reload();
    };

    // update wind operating window
    const handleNewWindOp = (e) => {
        setNewWinOpWindow(e.target.value);
    };

    // update wind gust operating window
    const handleNewWindGustOp = (e) => {
        setNewWindGustOpWindow(e.target.value);
    };

    return (
        <div>
            <Button variant='outlined' onClick={handleOpen}>Update Operating Window</Button>
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
                                    <Box
                                        component="form"
                                        sx={{
                                            '& > :not(style)': { m: 1, width: '25ch' },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField id="standard-basic" label="Steady Wind" variant="standard" value={newWindOpWindow} onChange={handleNewWindOp} required />
                                        <TextField id="standard-basic" label="Wind Gust" variant="standard" value={newWindGustOpWindow} onChange={handleNewWindGustOp} required />
                                    </Box>
                                    <Button variant='outlined' type="submit" className="button_style">submit</Button>
                                    {/* <button className="button_style" onClick={() => handleReturnToDefault()}>Return to default</button> */}
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