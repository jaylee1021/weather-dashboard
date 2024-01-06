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

    function pm25ToAqi(pm25) {
        const c = Math.floor(10 * pm25) / 10;
        const a = c < 0 ? 0 // values below 0 are considered beyond AQI
            : c < 12.1 ? pm25ToAqiCalc(0, 50, 0.0, 12.0, c)
                : c < 35.5 ? pm25ToAqiCalc(51, 100, 12.1, 35.4, c)
                    : c < 55.5 ? pm25ToAqiCalc(101, 150, 35.5, 55.4, c)
                        : c < 150.5 ? pm25ToAqiCalc(151, 200, 55.5, 150.4, c)
                            : c < 250.5 ? pm25ToAqiCalc(201, 300, 150.5, 250.4, c)
                                : c < 350.5 ? pm25ToAqiCalc(301, 400, 250.5, 350.4, c)
                                    : c < 500.5 ? pm25ToAqiCalc(401, 500, 350.5, 500.4, c)
                                        : 500; // values above 500 are considered beyond AQI
        return Math.round(a);
    }

    function pm25ToAqiCalc(ylo, yhi, xlo, xhi, x) {
        return ((x - xlo) / (xhi - xlo)) * (yhi - ylo) + ylo;
    }

    const aqiCheck = () => {
        switch (true) {
            case weatherData.air_quality.pm2_5 >= 0 && weatherData.air_quality.pm2_5 <= 12:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'green', color: 'white', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Good!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
                    </div>);
            case weatherData.air_quality.pm2_5 > 12 && weatherData.air_quality.pm2_5 <= 35.4:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'yellow', color: 'black', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Moderate!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
                    </div>
                );
            case weatherData.air_quality.pm2_5 > 35.4 && weatherData.air_quality.pm2_5 <= 55.4:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'orange', color: 'black', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Unhealthy for Sensitive Groups!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
                    </div>
                );
            case weatherData.air_quality.pm2_5 > 55.4 && weatherData.air_quality.pm2_5 <= 150.4:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Unhealthy!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
                    </div>
                );
            case weatherData.air_quality.pm2_5 > 150.4 && weatherData.air_quality.pm2_5 <= 250.4:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'purple', color: 'white', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Very Unhealthy!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
                    </div>
                );
            case weatherData.air_quality.pm2_5 > 250.4:
                return (
                    <div style={{ padding: '10px', backgroundColor: 'maroon', color: 'white', borderRadius: '9px' }}>
                        <h3 style={{ fontWeight: 'bold', padding: '10px' }}>Air Quality Hazardous!</h3>
                        <p style={{ fontWeight: 'bold', padding: '10px' }}>AQI: {pm25ToAqi(weatherData.air_quality.pm2_5)}</p>
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