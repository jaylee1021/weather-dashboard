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
import AqiCheck from "./AqiCheck"; // Air quality component
import WeatherSummary from "./WeatherSummary"; // Weather summary component
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
    const [temp, setTemp] = useState('');
    const [tempUnit, setTempUnit] = useState('');
    const [tempLow, setTempLow] = useState('');
    const [tempHigh, setTempHigh] = useState('');
    const [aqiData, setAqiData] = useState();
    const router = useRouter();

    // conversion constants
    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;
    const knotsToMeterPerSec = 0.514444;
    const meterPerSecToKnots = 1.94384;

    // convert fahrenheit to celsius
    const toC = (f) => {
        return (f - 32) * (5 / 9);
    };

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
        localStorage.getItem('tempUnit') === 'f' ? (setTempLow(fetchedUserData.tempLow), setTempHigh(fetchedUserData.tempHigh)) :
            (setTempLow((toC(fetchedUserData.tempLow)).toFixed(1)), setTempHigh((toC(fetchedUserData.tempHigh)).toFixed(1)));
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
    const toKnots = useCallback((weatherData) => {
        // set wind speed and wind gust to knots
        setWind((weatherData.wind_mph * mphToKnots).toFixed(2));
        userData.userWindUnit === 'knots' ? setWindOpWindow(userData.wind) : setWindOpWindow(userData.wind * meterPerSecToKnots);

        setWindGust((weatherData.gust_mph * mphToKnots).toFixed(2));
        userData.userWindGustUnit === 'knots' ? setWindGustOpWindow(userData.windGust) : setWindGustOpWindow(userData.windGust * meterPerSecToKnots);

    }, [mphToKnots, userData.wind, userData.windGust, userData.userWindUnit, userData.userWindGustUnit]);

    // convert wind speed to m/s
    const toMetersPerSec = useCallback((weatherData) => {
        // set wind speed and wind gust to m/s
        setWind((weatherData.wind_mph * mphToMetersPerSec).toFixed(2));
        userData.userWindUnit === 'm/s' ? setWindOpWindow(userData.wind) : setWindOpWindow(userData.wind * knotsToMeterPerSec);

        setWindGust((weatherData.gust_mph * mphToMetersPerSec).toFixed(2));
        userData.userWindGustUnit === 'm/s' ? setWindGustOpWindow(userData.windGust) : setWindGustOpWindow(userData.windGust * knotsToMeterPerSec);

    }, [mphToMetersPerSec, userData.wind, userData.windGust, userData.userWindUnit, userData.userWindGustUnit]);

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
        let latitude;
        let longitude;
        if (selectSite === 'hsiland' || localStorage.getItem('selectSite') === 'hsiland') {
            latitude = process.env.NEXT_PUBLIC_HSILAND_LATITUDE;
            longitude = process.env.NEXT_PUBLIC_HSILAND_LONGITUDE;
        } else if (selectSite === 'pdt10_hangar' || localStorage.getItem('selectSite') === 'pdt10_hangar') {
            latitude = process.env.NEXT_PUBLIC_PDT10_HANGAR_LATITUDE;
            longitude = process.env.NEXT_PUBLIC_PDT10_HANGAR_LONGITUDE;
        } else if (selectSite === 'pdt10_northpad' || localStorage.getItem('selectSite') === 'pdt10_northpad') {
            latitude = process.env.NEXT_PUBLIC_PDT10_NORTH_PAD_LATITUDE;
            longitude = process.env.NEXT_PUBLIC_PDT10_NORTH_PAD_LONGITUDE;
        }

        try {
            const [weatherResponse, aqiResponse] = await Promise.all([
                axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}`),
                axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi&hourly=us_aqi&timezone=America%2FLos_Angeles&forecast_days=1`)
            ]);
            const weatherData = weatherResponse.data;
            setForecast(weatherData.forecast.forecastday[0].hour);
            setWeather(weatherData.current);
            localStorage.getItem('tempUnit') === 'f' ? (setTemp(weatherData.current.temp_f), setTempUnit('F')) : (setTemp(weatherData.current.temp_c), setTempUnit('C'));

            const aqiData = aqiResponse.data;
            setAqiData(aqiData);

            if (windUnit === 'knots') {
                toKnots(weatherData.current);
            } else if (windUnit === 'm/s') {
                toMetersPerSec(weatherData.current);
            }

            setMinCountdown(60);
        } catch (error) {
            console.log(error);
        }
    }, [toKnots, toMetersPerSec, windUnit]);

    // return operating window to default values
    const handleReturnToDefault = useCallback(async () => {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`, {
            wind: 14, windGust: 25, tempLow: 32, tempHigh: 91, precipitation: 0.0, visibility: 3,
            cloudBaseHeight: 1000, densityAltitudeLow: -2000, densityAltitudeHigh: 4600, lighteningStrike: 30,
            unit: 'knots', userWindUnit: 'knots', userWindGustUnit: 'knots', windDirectionLow: -1, windDirectionHigh: 361
        })
            .then((res) => {
                localStorage.setItem('windUnit', 'knots');
                localStorage.setItem('selectSite', 'hsiland');
                localStorage.setItem('tempUnit', 'f');
                setTemp(weather.temp_f);
                setTempUnit('F');
                setWindUnit('knots');
                fetchData();
                fetchUser();
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // check if it's midnight PST and if it's midnight, run handleReturnToDefault()
    const checkMidnightPST = useCallback(() => {
        const currentTime = new Date();
        const pacificTimeOffset = -8;

        const currentPSTHour = currentTime.getUTCHours() + pacificTimeOffset;
        if (currentPSTHour === 0) {
            handleReturnToDefault();
        }
    }, [handleReturnToDefault]);

    // Function to update time
    const updateTime = () => {
        const currentTime = new Date();
        const formattedDate = currentTime.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        setCurrentDateTime(`${formattedDate}, ${formattedTime}`);
    };

    useEffect(() => {
        // Update time immediately on mount
        updateTime();
        // Fetch data immediately on mount
        fetchData();
        // Check if it's midnight PST immediately on mount
        checkMidnightPST();
    }, []);

    useEffect(() => {
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
    }, []);

    // update user wind unit
    const storeUserWindUnit = (unit) => {
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
        storeUserWindUnit(newUnit);
    };

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

    // refresh page on button click
    const handleManualRefresh = () => {
        fetchData();
    };

    const logout = () => {
        handleLogout();
        router.push('/users/login');
    };

    // loading screen
    if (loading) return (<LoadingSpinningBubble />);

    return (
        <div className="top_wrapper">

            <div className="top">
                <div className="buttons_wrapper">
                    <div >
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
                    </div>
                    <div>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ margin: '10px' }}>
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
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} style={{ margin: '10px' }}>
                            <InputLabel id="temp_unit_select">Temperature Unit</InputLabel>
                            <Select
                                labelId="temp_unit_select"
                                id="temp_unit_select_menu"
                                value={localStorage.getItem('tempUnit') ? localStorage.getItem('tempUnit') : 'f'}
                                onChange={handleTempConversion}
                                label="Temp_Unit"
                                name='tempUnit'
                            >
                                <MenuItem value={'f'}>Fahrenheit</MenuItem>
                                <MenuItem value={'c'}>Celsius</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="button_padding">
                        <Button variant='outlined' onClick={handleManualRefresh}>Manual Refresh</Button>
                    </div>
                    <div className="button_padding">
                        <UpdateParams windUnit={windUnit} userId={userId} fetchUser={fetchUser} />
                    </div>
                    <div className="button_padding">
                        <ShowHide userData={userData} userId={userId} fetchUser={fetchUser} />
                    </div>
                    <div className="button_padding">
                        <Button variant='outlined' onClick={() => handleReturnToDefault()}>Return to default</Button>
                    </div>
                </div>
                <div className="time_style_top" >
                    <div className="time_style">
                        <p>Current date/time: {currentDateTime}</p>
                    </div>
                    <div className="time_style">
                        <p className="time_style">Last updated: {weather.last_updated}</p>
                        <p>Refreshing in: {minCountdown}s</p>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', flex: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Indicator</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Current</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Test Card Op Window</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Standard Op Window</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.showWind ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                            Steady Wind ({windUnit})
                                        </TableCell>
                                        {wind > windOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{wind}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{wind}</TableCell>}
                                        <TableCell align="right">&lt;= {parseFloat(windOpWindow).toFixed(1)}</TableCell>
                                        {windUnit === 'knots' ? <TableCell align="right">&lt;= 14.0</TableCell> : <TableCell align="right">&lt;= 7.2</TableCell>}
                                    </TableRow>
                                    : null}
                                {userData.showWindGust ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                            Wind gusts ({windUnit})
                                        </TableCell>
                                        {windGust > windGustOpWindow ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{windGust}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{windGust}</TableCell>}
                                        <TableCell align="right">&lt;= {parseFloat(windGustOpWindow).toFixed(1)}</TableCell>
                                        {windUnit === 'knots' ? <TableCell align="right">&lt;= 25.0</TableCell> : <TableCell align="right">&lt;= 12.9</TableCell>}
                                    </TableRow>
                                    : null}
                                {userData.showTemp ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Air temperature ({tempUnit})</TableCell>
                                        {temp > tempLow && temp < tempHigh ? <TableCell align="right" style={{ color: 'green' }}>{temp}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{temp}</TableCell>}
                                        <TableCell align="right">&gt;= {tempLow}, &lt;= {tempHigh}</TableCell>
                                        {localStorage.getItem('tempUnit') === 'f' ? <TableCell align="right">&gt;= 32, &lt;= 91</TableCell> : <TableCell align="right">&gt;= 0, &lt;= 32.8</TableCell>}
                                    </TableRow>
                                    : null}
                                {userData.showPrecipitation ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Precipitation (mm/hr)</TableCell>
                                        {weather.precip_mm > userData.precipitation ? <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.precip_mm}</TableCell> : <TableCell align="right" style={{ color: 'green' }}>{weather.precip_mm}</TableCell>}
                                        <TableCell align="right">{userData.precipitation}</TableCell>
                                        <TableCell align="right">0</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showVisibility ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Visibility (SM)</TableCell>
                                        {weather.vis_miles >= userData.visibility ? <TableCell align="right" style={{ color: 'green' }}>{weather.vis_miles}</TableCell> : <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.vis_miles}</TableCell>}
                                        <TableCell align="right">&gt;= {userData.visibility}</TableCell>
                                        <TableCell align="right">&gt;= 3</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showCloudBaseHeight ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Cloud base height (ft)</TableCell>
                                        <TableCell align="right">{weather.cloud}</TableCell>
                                        <TableCell align="right">&gt; {userData.cloudBaseHeight}</TableCell>
                                        <TableCell align="right">&gt; 1000</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showDensityAltitude ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Density altitude (ft)</TableCell>
                                        <TableCell align="right">{weather.wind_mph}</TableCell>
                                        <TableCell align="right">&gt; {userData.densityAltitudeLow}, &lt; {userData.densityAltitudeHigh}</TableCell>
                                        <TableCell align="right">&gt; -2000, &lt; 4600</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showLighteningStrike ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Last lightning strike(min)</TableCell>
                                        <TableCell align="right">{weather.wind_mph}</TableCell>
                                        <TableCell align="right">&gt; {userData.lighteningStrike}</TableCell>
                                        <TableCell align="right">&gt; 30</TableCell>
                                    </TableRow>
                                    : null}
                                {userData.showWindDirection ?
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>Wind direction (deg)</TableCell>
                                        {weather.wind_degree >= userData.windDirectionLow && weather.wind_degree <= userData.windDirectionHigh ? <TableCell align="right" style={{ color: 'green' }}>{weather.wind_degree}</TableCell> :
                                            <TableCell align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.wind_degree}</TableCell>}
                                        {userData.windDirectionLow != -1 && userData.windDirectionHigh != 361 ?
                                            <TableCell align="right">&gt; {userData.windDirectionLow}, &lt; {userData.windDirectionHigh}</TableCell>
                                            : <TableCell align="right">N/A</TableCell>
                                        }
                                        <TableCell align="right">N/A</TableCell>
                                    </TableRow>
                                    : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="side_bar">
                    <WeatherSummary props={{ wind, windOpWindow, userData, windGust, windGustOpWindow, temp, tempLow, tempHigh, weather }} />
                    <div className="table_border" style={{ margin: '10px' }}>
                        <AqiCheck aqiData={aqiData} />
                    </div>
                    <Button style={{ margin: '0 10px' }} variant="outlined" onClick={logout}>Log Out</Button>
                </div>
            </div>
            <CustomCharts weatherData={forecast} fetchData={fetchData} aqiData={aqiData} />
        </div >
    );
};