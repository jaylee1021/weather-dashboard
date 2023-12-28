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

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`);
            const fetchedUserData = res.data.user;
            setUserData(fetchedUserData);
            setLoading(false);
        };
        fetchUser();
    }, [userId]);

    // convert wind speed to knots
    const toKnots = useCallback(() => {
        // set wind speed and wind gust to knots
        setWind((weather.wind_mph * mphToKnots).toFixed(2));
        userData.userWindUnit === 'knots' ? setWindOpWindow(userData.wind) : setWindOpWindow(userData.wind * meterPerSecToKnots);

        setWindGust((weather.gust_mph * mphToKnots).toFixed(2));
        userData.userWindGustUnit === 'knots' ? setWindGustOpWindow(userData.windGust) : setWindGustOpWindow(userData.windGust * meterPerSecToKnots);

    }, [weather.wind_mph, weather.gust_mph, mphToKnots, userData.wind, userData.windGust, userData.userWindUnit, userData.userWindGustUnit]);

    // convert wind speed to m/s
    const toMetersPerSec = useCallback(() => {
        // set wind speed and wind gust to m/s
        setWind((weather.wind_mph * mphToMetersPerSec).toFixed(2));
        userData.userWindUnit === 'm/s' ? setWindOpWindow(userData.wind) : setWindOpWindow(userData.wind * knotsToMeterPerSec);

        setWindGust((weather.gust_mph * mphToMetersPerSec).toFixed(2));
        userData.userWindGustUnit === 'm/s' ? setWindGustOpWindow(userData.windGust) : setWindGustOpWindow(userData.windGust * knotsToMeterPerSec);

    }, [weather.wind_mph, weather.gust_mph, mphToMetersPerSec, userData.wind, userData.windGust, userData.userWindUnit, userData.userWindGustUnit]);

    // fetch weather data on page load and every minute
    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=47.53294,-121.80539`)
                .then((res) => {
                    setWeather(res.data.current);
                    if (windUnit === 'knots') {
                        toKnots();
                    } else if (windUnit === 'm/s') {
                        toMetersPerSec();
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
    }, [toKnots, toMetersPerSec, windUnit]);

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
        const newUnit = e.target.value;
        localStorage.setItem('windUnit', newUnit);
        if (newUnit === 'knots') {
            toKnots();
        } else if (newUnit === 'm/s') {
            toMetersPerSec();
        }

        setWindUnit(newUnit);
        setUserWindUnit(newUnit);
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
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                wind: newWinOpWindow, windGust: newWindGustOpWindow,
                userWindUnit: windUnit, userWindGustUnit: windUnit
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (newWinOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
                wind: newWinOpWindow, windGust: windGustOpWindow, userWindUnit: windUnit
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
    const handleReturnToDefault = async () => {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
            wind: 14, windGust: 25, tempLow: 32, tempHigh: 91, precipitation: 0.0, visibility: 3,
            cloudBaseHeight: 1000, densityAltitudeLow: -2000, densityAltitudeHigh: 4600, lighteningStrike: 30,
            unit: 'knots', userWindUnit: 'knots', userWindGustUnit: 'knots'
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        localStorage.setItem('windUnit', 'knots');
        window.location.reload();
    };

    // loading screen
    if (loading) return (<div> Loading... </div>);

    return (
        <div>
            <div className="top">
                <div style={{ display: 'flex' }}>
                    <h4 style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center' }}>Wind Speed Unit: </h4>
                    <select className="top_button_style wind_unit_margin" name='convert' value={windUnit} onChange={handleConversion}>
                        <option value="knots">knots</option>
                        <option value="m/s">m/s</option>
                    </select>
                </div>
                <div>
                    <button className="top_button_style" onClick={handleManualRefresh}>Manual Refresh</button>
                </div>
                <div>
                    <p>Current date/time: {currentDateTime}</p>
                </div>
                <div>
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
                <div className="table_border">
                    <div style={{ padding: '10px' }}>
                        <h3>Update Operating Window</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="input_box_style">
                                <input name="wind" value={newWinOpWindow} onChange={handleNewWindOp} required />Steady Wind
                            </div>
                            <div className="input_box_style">
                                <input name="windGust" value={newWindGustOpWindow} onChange={handleNewWindGustOp} required /> Wind Gust
                            </div>
                            <button type="submit" className="button_style">submit</button>
                            <button className="button_style" onClick={() => handleReturnToDefault()}>Return to default</button>
                        </form>

                    </div>
                </div>
                <div className="table_border" >
                    <div style={{ padding: '10px' }}>
                        <h3>Summary</h3>
                        <h4>Status</h4>
                        {checkGoNoGo()}
                        <h4>Breaching Limit(s)</h4>
                        <div style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>
                            {checkBreachingLimit().map((limits, index) => {
                                return (<p key={index} >{limits}</p>);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};