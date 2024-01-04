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
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from "../utils/setAuthToken"; // Set token for authorization
import handleLogout from "../utils/handleLogout"; // Logout function
import CustomCharts from "./CustomCharts"; // Weather charts component
import ShowHide from "./ShowHide"; // ShowHide component
import UpdateParams from "./UpdateParams"; // Updating operating window component
import { LoadingSpinningBubble } from "./Loading";

export default function WeatherMain() {

    const [userData, setUserData] = useState([]);
    const [weather, setWeather] = useState([]);
    const [forecast, setForecast] = useState([]);
    const [wind, setWind] = useState('');
    const [windOpWindow, setWindOpWindow] = useState('');
    const [windUnit, setWindUnit] = useState('');
    const [windGust, setWindGust] = useState('');
    const [windGustOpWindow, setWindGustOpWindow] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
    const [minCountdown, setMinCountdown] = useState(60);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('userId') : null);
    const router = useRouter();

    // conversion constants
    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;
    const knotsToMeterPerSec = 0.514444;
    const meterPerSecToKnots = 1.94384;

    // set wind unit on page load
    useEffect(() => {
        setWindUnit(localStorage.getItem('windUnit') ? localStorage.getItem('windUnit') : 'knots');
        if (typeof window !== undefined) {
            const expirationTime = new Date(parseInt(localStorage.getItem('expiration')) * 1000);
            let currentTime = Date.now();

            setAuthToken(localStorage.getItem('jwtToken'));
            if (currentTime >= expirationTime) {
                handleLogout();
                router.push('/users/login');
            }
        }
    }, [router]);

    const fetchUser = useCallback(async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`);
        const fetchedUserData = res.data.user;
        setUserData(fetchedUserData);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        setAuthToken(localStorage.getItem('jwtToken'));
        if (localStorage.getItem('jwtToken')) {
            axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`)
                .then((res) => {
                    let userData = jwtDecode(localStorage.getItem('jwtToken'));
                    if (userData.email === localStorage.getItem('email')) {
                        fetchUser();
                    } else {
                        router.push('/users/login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    router.push('/users/login');
                });
        } else {
            router.push('/users/login');
        }
    }, [userId, fetchUser, router]);


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

    const handleSiteSelection = async (e) => {
        localStorage.setItem('selectSite', e.target.value);
        try {
            await fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    // fetch weather data on page load and every minute
    const fetchData = useCallback(async () => {
        const selectSite = localStorage.getItem('selectSite') ? localStorage.getItem('selectSite') : 'hsiland';
        let selectedSite;
        if (selectSite === 'hsiland' || localStorage.getItem('selectSite') === 'hsiland') {
            selectedSite = process.env.NEXT_PUBLIC_HSILAND_COORDINATES;
        } else if (selectSite === 'pdt10_hangar' || localStorage.getItem('selectSite') === 'pdt10_hangar') {
            selectedSite = process.env.NEXT_PUBLIC_PDT10_HANGAR_COORDINATES;
        } else if (selectSite === 'pdt10_northpad' || localStorage.getItem('selectSite') === 'pdt10_northpad') {
            selectedSite = process.env.NEXT_PUBLIC_PDT10_NORTH_PAD_COORDINATES;
        }
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${selectedSite}`)
            .then((res) => {
                setForecast(res.data.forecast.forecastday[0].hour);
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
    }, [toKnots, toMetersPerSec, windUnit]);

    // return operating window to default values
    const handleReturnToDefault = useCallback(async () => {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
            wind: 14, windGust: 25, tempLow: 32, tempHigh: 91, precipitation: 0.0, visibility: 3,
            cloudBaseHeight: 1000, densityAltitudeLow: -2000, densityAltitudeHigh: 4600, lighteningStrike: 30,
            unit: 'knots', userWindUnit: 'knots', userWindGustUnit: 'knots'
        })
            .then((res) => {
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        localStorage.setItem('windUnit', 'knots');
        localStorage.setItem('selectSite', 'hsiland');
        setWindUnit('knots');
        fetchUser();
    }, [userId, fetchUser]);

    // check if it's midnight PST and if it's midnight, run handleReturnToDefault()
    const checkMidnightPST = useCallback(() => {
        const currentTime = new Date();
        const pacificTimeOffset = -8;

        const currentPSTHour = currentTime.getUTCHours() + pacificTimeOffset;

        if (currentPSTHour === 0) {
            handleReturnToDefault();
        }
    }, [handleReturnToDefault]);

    useEffect(() => {
        // Function to update time
        const updateTime = () => {
            const currentTime = new Date();
            const formattedDate = currentTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            setCurrentDateTime(`${formattedDate}, ${formattedTime}`);
        };

        // Update time immediately on mount
        updateTime();
        // Fetch data immediately on mount
        fetchData();

        // run fetchData() every minute
        const fetchDataIntervalId = setInterval(fetchData, 60000);
        // run checkMidnightPST() every minute to check if it's midnight PST
        const midnightIntervalId = setInterval(checkMidnightPST, 60000);
        // run countdown every second
        const countdownInterval = setInterval(() => {
            setMinCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 0);
        }, 1000);
        // Set interval to update time every sec
        const updateTimeIntervalId = setInterval(updateTime, 1000);

        return () => {
            clearInterval(fetchDataIntervalId);
            clearInterval(countdownInterval);
            clearInterval(midnightIntervalId);
            clearInterval(updateTimeIntervalId);
        };
    }, [fetchData, checkMidnightPST]);

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
        fetchData();
    };

    // display go/no-go status
    const checkGoNoGo = () => {
        if ((wind > windOpWindow && userData.showWind) || (windGust > windGustOpWindow && userData.showWindGust) || (weather.temp_f < userData.tempLow && userData.showTemp) ||
            (weather.temp_f > userData.tempHigh && userData.showTemp) || (weather.precip_mm > userData.precipitation && userData.showPrecipitation) ||
            (weather.vis_miles < userData.visibility && userData.showVisibility) || weather.cloud < userData.cloudBaseHeight && userData.showCloudBaseHeight ||
            (weather.wind_mph < userData.densityAltitudeLow && userData.showDensityAltitude) || (weather.wind_mph > userData.densityAltitudeHigh && userData.showDensityAltitude) ||
            (weather.wind_mph > userData.lighteningStrike && userData.showLighteningStrike)) {
            return (<p style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>Out of Limits!</p>);
        } else {
            return (<p style={{ color: 'green', fontWeight: 'bold', padding: '10px' }}>Go!</p>);
        }
    };

    // display which limits are breaching
    const checkBreachingLimit = () => {
        let limits = [];
        if (wind > windOpWindow && userData.showWind) {
            limits.push('Steady Wind');
        }
        if (windGust > windGustOpWindow && userData.showWindGust) {
            limits.push('Wind Gust');
        }
        if (weather.temp_f < userData.tempLow && userData.showTemp) {
            limits.push('Temperature Low');
        }
        if (weather.temp_f > userData.tempHigh && userData.showTemp) {
            limits.push('Temperature High');
        }
        if (weather.precip_mm > userData.precipitation && userData.showPrecipitation) {
            limits.push('Precipitation');
        }
        if (weather.vis_miles < userData.visibility && userData.showVisibility) {
            limits.push('Visibility');
        }
        if (weather.cloud < userData.cloudBaseHeight && userData.showCloudBaseHeight) {
            limits.push('Cloud Base Height');
        }
        if (weather.wind_mph < userData.densityAltitudeLow && userData.showDensityAltitude) {
            limits.push('Density Altitude Low');
        }
        if (weather.wind_mph > userData.densityAltitudeHigh && userData.showDensityAltitude) {
            limits.push('Density Altitude High');
        }
        if (weather.wind_mph > userData.lighteningStrike && userData.showLighteningStrike) {
            limits.push('Lightening Strike');
        }
        if (limits.length === 0) {
            limits.push(<p style={{ color: 'green' }}>None</p>);
        }
        return limits;
    };

    const logout = () => {
        handleLogout();
        router.push('/users/login');
    };


    // loading screen
    if (loading) return (<LoadingSpinningBubble />);

    return (
        <div>
            <div style={{ padding: '10px' }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
            </div>
            <div className="top">
                <div className="buttons_wrapper">
                    <div>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
                    </div>
                    <div>
                        <Button variant='outlined' onClick={handleManualRefresh}>Manual Refresh</Button>
                    </div>
                    <div>
                        <UpdateParams windOpWindow={windOpWindow} windGustOpWindow={windGustOpWindow} windUnit={windUnit}
                            userId={userId} fetchUser={fetchUser} />
                    </div>
                    <div>
                        <Button variant='outlined' onClick={() => handleReturnToDefault()}>Return to default</Button>
                    </div>
                </div>
                <div className="time_style_top">
                    <div className="time_style">
                        <p className="board_col">Current date/time: {currentDateTime}</p>
                    </div>
                    <div className="time_style">
                        <p className="board_col">Last updated: {weather.last_updated}</p>
                        <p className="board_col">Refreshing in: {minCountdown}s</p>
                    </div>
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
                                {userData.showWind ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                            Steady Wind ({windUnit})
                                        </TableCell>
                                        {wind > windOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{wind}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{wind}</TableCell>}
                                        <TableCell align="right">&lt; {parseFloat(windOpWindow).toFixed(1)}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showWindGust ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                            Wind gusts ({windUnit})
                                        </TableCell>
                                        {windGust > windGustOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{windGust}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{windGust}</TableCell>}
                                        <TableCell align="right">&lt; {parseFloat(windGustOpWindow).toFixed(1)}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showTemp ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Air temperature (F)</TableCell>
                                        {weather.temp_f > userData.tempLow && weather.temp_f < userData.tempHigh ? <TableCell align="right" style={{ color: 'green' }}>{weather.temp_f}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.temp_f}</TableCell>}
                                        <TableCell align="right">&gt; {userData.tempLow}, &lt; {userData.tempHigh}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showPrecipitation ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Precipitation (mm/hr)</TableCell>
                                        {weather.precip_mm > userData.precipitation ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.precip_mm}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{weather.precip_mm}</TableCell>}
                                        <TableCell align="right">{userData.precipitation}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showVisibility ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Visibility (SM)</TableCell>
                                        {weather.vis_miles >= userData.visibility ? <TableCell align="right" style={{ color: 'green' }}>{weather.vis_miles}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.vis_miles}</TableCell>}
                                        <TableCell align="right">&gt; {userData.visibility}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showCloudBaseHeight ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Cloud base height (ft)</TableCell>
                                        <TableCell align="right">{weather.cloud}</TableCell>
                                        <TableCell align="right">&gt; {userData.cloudBaseHeight}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showDensityAltitude ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Density altitude (ft)</TableCell>
                                        <TableCell align="right">{weather.wind_mph}</TableCell>
                                        <TableCell align="right">&gt; {userData.densityAltitudeLow}, &lt; {userData.densityAltitudeHigh}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showLighteningStrike ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Last lightning strike(min)</TableCell>
                                        <TableCell align="right">{weather.wind_mph}</TableCell>
                                        <TableCell align="right">&gt; {userData.lighteningStrike}</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showWindDirection ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Wind direction (deg)</TableCell>
                                        <TableCell align="right">{weather.wind_degree}</TableCell>
                                        <TableCell align="right">N/A</TableCell>
                                    </TableRow>
                                    : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="side_bar">
                    <div className="table_border">
                        <div style={{ padding: '10px' }}>
                            <h3>Summary</h3>
                            <h4>Status</h4>
                            {checkGoNoGo()}
                            <h4>Breaching Limit(s)</h4>
                            <div style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>
                                {checkBreachingLimit().map((limits, index) => {
                                    return (<div key={index} >{limits}</div>);
                                })}
                            </div>
                        </div>
                    </div>
                    <ShowHide userData={userData} userId={userId} fetchUser={fetchUser} />
                    <Button style={{ margin: '0 10px', width: '90%' }} variant="outlined" onClick={logout}>Log Out</Button>
                </div>
            </div>
            <CustomCharts weatherData={forecast} fetchData={fetchData} />
        </div >
    );
};