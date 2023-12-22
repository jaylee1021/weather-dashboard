'use client';
import axios from "axios";
import { useState, useEffect, useCallback, use } from "react";
import '../css/weather.css';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function WeatherMain() {

    const [userData, setUserData] = useState([]);
    const [weather, setWeather] = useState([]);
    const [wind, setWind] = useState('');
    const [windOpWindow, setWindOpWindow] = useState('');
    const [windUnit, setWindUnit] = useState('');
    const [windGust, setWindGust] = useState('');
    const [windGustOpWindow, setWindGustOpWindow] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
    const [minCountdown, setMinCountdown] = useState(60);
    const [loading, setLoading] = useState(true);
    const [newWinOpWindow, setNewWinOpWindow] = useState('');
    const [newWindGustOpWindow, setNewWindGustOpWindow] = useState('');
    const [userId, setUserId] = useState(typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('userId') : null);

    // conversion constants
    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;
    const knotsToMeterPerSec = 0.514444;
    const meterPerSecToKnots = 1.94384;

    // set wind unit on page load
    useEffect(() => {
        setWindUnit(localStorage.getItem('windUnit') ? localStorage.getItem('windUnit') : 'knots');
    }, []);

    // fetch user data on page load
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`);
            setWindOpWindow(res.data.user.wind);
            setWindGustOpWindow(res.data.user.windGust);
            setUserData(res.data.user);
            setLoading(false);
        };
        fetchUser();
    }, [userId]);

    // convert wind speed to knots
    const setKnots = useCallback(() => {
        setWind((weather.wind_mph * mphToKnots).toFixed(2));
        setWindOpWindow(userData.unit === 'knots' ? userData.wind : userData.wind * meterPerSecToKnots);
        setWindGust((weather.gust_mph * mphToKnots).toFixed(2));
        setWindGustOpWindow(userData.unit === 'knots' ? userData.windGust : userData.windGust * meterPerSecToKnots);
    }, [weather.wind_mph, weather.gust_mph, mphToKnots, userData.wind, userData.windGust, userData.unit]);

    // convert wind speed to m/s
    const setMetersPerSec = useCallback(() => {
        setWind((weather.wind_mph * mphToMetersPerSec).toFixed(2));
        setWindOpWindow(userData.unit === 'm/s' ? userData.wind : userData.wind * knotsToMeterPerSec);
        setWindGust((weather.gust_mph * mphToMetersPerSec).toFixed(2));
        setWindGustOpWindow(userData.unit === 'm/s' ? userData.windGust : userData.windGust * knotsToMeterPerSec);
    }, [weather.wind_mph, weather.gust_mph, mphToMetersPerSec, userData.wind, userData.windGust, userData.unit]);

    // fetch weather data on page load and every minute
    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=47.53294,-121.80539`)
                .then((res) => {
                    setWeather(res.data.current);
                    if (windUnit === 'knots') {
                        setKnots();
                    } else if (windUnit === 'm/s') {
                        setMetersPerSec();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            setMinCountdown(60);
        };
        fetchData();

        const intervalId = setInterval(fetchData, 60000);
        const countdownInterval = setInterval(() => {
            setMinCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 0);
        }, 1000);

        return () => {
            clearInterval(intervalId); // This is the cleanup function
            clearInterval(countdownInterval);
        };
    }, [setKnots, setMetersPerSec, windUnit]);

    // updating current date/time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(intervalId); // This is the cleanup function
    }, []);

    // update user wind unit
    const setUserWindUnit = (unit) => {
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
        localStorage.setItem('windUnit', e.target.value);
        if (e.target.value === 'knots') {
            setKnots();
            setUserWindUnit(e.target.value);
            setWindUnit('knots');
        } else if (e.target.value === 'm/s') {
            setMetersPerSec();
            setUserWindUnit(e.target.value);
            setWindUnit('m/s');
        }
    };

    // refresh page on button click
    const handleManualRefresh = () => {
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

    // submit new wind operating window
    const handleSubmit = (e) => {
        e.preventDefault();
        // update wind and wind gust op operating window if both are entered
        if (newWinOpWindow && newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, { wind: newWinOpWindow, windGust: newWindGustOpWindow })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // update wind op operating window if only wind is entered
        if (newWinOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, { wind: newWinOpWindow, windGust: windGustOpWindow })
                .then((res) => {
                    console.log('2', res.data.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // update wind gust op operating window if only wind gust is entered
        if (newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, { windGust: newWindGustOpWindow, wind: windOpWindow })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        window.location.reload();
    };

    // display go/no-go status
    const checkGoNoGo = () => {
        if (wind > windOpWindow || windGust > windGustOpWindow || weather.temp_f < userData.tempLow ||
            weather.temp_f > userData.tempHigh || weather.precip_mm > userData.precipitation ||
            weather.vis_miles < userData.visibility || weather.cloud < userData.cloudBaseHeight ||
            weather.wind_mph < userData.densityAltitudeLow || weather.wind_mph > userData.densityAltitudeHigh ||
            weather.wind_mph > userData.lighteningStrike) {
            return (<p style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>Out of Limits!</p>);
        } else {
            return (<p style={{ color: 'green', fontWeight: 'bold', padding: '10px' }}>Go!</p>);
        }
    };

    // display which limits are breaching
    const checkBreachingLimit = () => {
        let limits = [];
        if (wind > windOpWindow) {
            limits.push('Steady Wind');
        }
        if (windGust > windGustOpWindow) {
            limits.push('Wind Gust');
        }
        if (weather.temp_f < userData.tempLow) {
            limits.push('Temperature Low');
        }
        if (weather.temp_f > userData.tempHigh) {
            limits.push('Temperature High');
        }
        if (weather.precip_mm > userData.precipitation) {
            limits.push('Precipitation');
        }
        if (weather.vis_miles < userData.visibility) {
            limits.push('Visibility');
        }
        if (weather.cloud < userData.cloudBaseHeight) {
            limits.push('Cloud Base Height');
        }
        if (weather.wind_mph < userData.densityAltitudeLow) {
            limits.push('Density Altitude Low');
        }
        if (weather.wind_mph > userData.densityAltitudeHigh) {
            limits.push('Density Altitude High');
        }
        if (weather.wind_mph > userData.lighteningStrike) {
            limits.push('Lightening Strike');
        }
        return limits;
    };

    // return operating window to default values
    const handleReturnToDefault = () => {
        axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
            wind: 14, windGust: 25, tempLow: 32, tempHigh: 91, precipitation: 0.0, visibility: 3,
            cloudBaseHeight: 1000, densityAltitudeLow: -2000, densityAltitudeHigh: 4600, lighteningStrike: 30, unit: 'knots'
        })
            .then((res) => {
                // setWindUnit('knots');
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        window.location.reload();
    };
    // loading screen
    if (loading) return (<div> Loading... </div>);

    return (
        <div>
            <div className="top">
                <div className="board_col3">
                    <select name='convert' value={windUnit} onChange={handleConversion}>
                        <option value="knots">knots</option>
                        <option value="m/s">m/s</option>
                    </select>
                </div>
                <div className="board_col3">
                    <button onClick={handleManualRefresh}>Refresh</button>
                </div>
                <div className="board_col3">
                    <p>Current date/time: {currentDateTime}</p>
                </div>
                <div className="board_col3">
                    <p>Last updated: {weather.last_updated}</p>
                    <p>refresh in: {minCountdown}</p>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Indicator</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Current</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Operating Window</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                        Steady Wind ({windUnit})
                                    </TableCell>
                                    {wind > windOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{wind}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{wind}</TableCell>}
                                    <TableCell align="right">&lt; {parseFloat(windOpWindow).toFixed(1)}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                        Wind gusts ({windUnit})
                                    </TableCell>
                                    {windGust > windGustOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{windGust}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{windGust}</TableCell>}
                                    <TableCell align="right">&lt; {parseFloat(windGustOpWindow).toFixed(1)}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Air temperature (F)</TableCell>
                                    {weather.temp_f > userData.tempLow && weather.temp_f < userData.tempHigh ? <TableCell align="right" style={{ color: 'green' }}>{weather.temp_f}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.temp_f}</TableCell>}
                                    <TableCell align="right">&gt; {userData.tempLow}, &lt; {userData.tempHigh}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Precipitation (mm/hr)</TableCell>
                                    {weather.precip_mm > userData.precipitation ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.precip_mm}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{weather.precip_mm}</TableCell>}
                                    <TableCell align="right">{userData.precipitation}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Visibility (SM)</TableCell>
                                    {weather.vis_miles >= userData.visibility ? <TableCell align="right" style={{ color: 'green' }}>{weather.vis_miles}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.vis_miles}</TableCell>}
                                    <TableCell align="right">&gt; {userData.visibility}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Cloud base height (ft)</TableCell>
                                    <TableCell align="right">{weather.cloud}</TableCell>
                                    <TableCell align="right">&gt; {userData.cloudBaseHeight}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Density altitude (ft)</TableCell>
                                    <TableCell align="right">{weather.wind_mph}</TableCell>
                                    <TableCell align="right">&gt; {userData.densityAltitudeLow}, &lt; {userData.densityAltitudeHigh}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Last lightning strike(min)</TableCell>
                                    <TableCell align="right">{weather.wind_mph}</TableCell>
                                    <TableCell align="right">&gt; {userData.lighteningStrike}</TableCell>
                                </TableRow>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Wind direction (deg)</TableCell>
                                    <TableCell align="right">{weather.wind_degree}</TableCell>
                                    <TableCell align="right">N/A</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="table_border" >
                    <div style={{ padding: '10px' }}>
                        <h3 >Update Operating Window</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input name="wind" value={newWinOpWindow} onChange={handleNewWindOp} />Steady Wind
                            <input name="windGust" value={newWindGustOpWindow} onChange={handleNewWindGustOp} /> Wind Gust
                            <button type="submit">submit</button>
                            <button onClick={() => handleReturnToDefault()}>Return to default</button>
                        </form>

                    </div>
                </div>
                <div className="table_border" >
                    <div style={{ padding: '10px' }}>
                        <h3>Summary</h3>
                        <h4>Status</h4>
                        {checkGoNoGo()}
                        <h4>Breaching Limit(s)</h4>
                        {checkBreachingLimit().map((limits, index) => {
                            return (<p key={index}>{limits}</p>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};