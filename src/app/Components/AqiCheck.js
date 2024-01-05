import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Image from 'next/image';
import '../css/weather.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AqiCheck({ weatherData }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const pm2_5ToAqi = {
        0: 0, 1: 4, 2: 8, 3: 13, 4: 17, 5: 21, 6: 25, 7: 29, 8: 33, 9: 38, 10: 42,
        11: 46, 12: 50, 13: 52
    };
    const aqiCheck = () => {
        if (weatherData.air_quality.pm2_5 >= 0 && weatherData.air_quality.pm2_5 <= 12) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'green', color: 'white', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Good!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: 0~50</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>);
        } else if (weatherData.air_quality.pm2_5 > 12 && weatherData.air_quality.pm2_5 <= 35.4) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'yellow', color: 'black', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Moderate!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: 51~100</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>
            );
        } else if (weatherData.air_quality.pm2_5 > 35.4 && weatherData.air_quality.pm2_5 <= 55.4) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'orange', color: 'black', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Unhealthy for Sensitive Groups!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: 101~150</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>
            );
        } else if (weatherData.air_quality.pm2_5 > 55.4 && weatherData.air_quality.pm2_5 <= 150.4) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Unhealthy!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: 151-200</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>
            );
        } else if (weatherData.air_quality.pm2_5 > 150.4 && weatherData.air_quality.pm2_5 <= 250.4) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'purple', color: 'white', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Very Unhealthy!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: 201-300</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>
            );
        } else if (weatherData.air_quality.pm2_5 > 250.4) {
            return (
                <div style={{ padding: '10px', backgroundColor: 'maroon', color: 'white', borderRadius: '9px' }}>
                    <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Hazardous!</h3>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: &gt;300</p>
                    <p style={{ fontWeight: 'bold', padding: '10px' }}>PM2.5: {weatherData.air_quality.pm2_5} μg/m3</p>
                </div>
            );
        }
    };

    return (
        <div>
            <div style={{ cursor: 'pointer' }} onClick={handleOpen}>
                {aqiCheck()}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" style={{ overflow: 'auto' }}>
                            {/* <Image src={'/public/aqi_chart.png'} width={100} height={100} onClick={handleClose} className='image_size' alt="..." /> */}
                            <Image width={1000} height={500} src={'/aqi_chart.png'} onClick={handleClose} alt="..." />
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}