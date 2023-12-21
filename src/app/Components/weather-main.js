'use client';
import axios from "axios";
import React, { useState, useEffect, useCallback, use } from "react";
import '../css/weather.css';

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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`);
            setWindOpWindow(res.data.user.wind);
            setWindGustOpWindow(res.data.user.windGust);
            setUserData(res.data.user);
            setLoading(false);
        };
        fetchUser();
    }, []);

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

    // update user wind unit
    const setUserWindUnit = (unit) => {
        axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`, { unit })
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
    const handleRefresh = () => {
        window.location.reload();
    };

    // updating current date/time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(intervalId); // This is the cleanup function
    }, []);

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
        // update wind operating window
        if (newWinOpWindow && newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`, { wind: newWinOpWindow, windGust: newWindGustOpWindow })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (newWinOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`, { wind: newWinOpWindow, windGust: windGustOpWindow })
                .then((res) => {
                    console.log('2', res.data.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (newWindGustOpWindow) {
            axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`, { windGust: newWindGustOpWindow, wind: windOpWindow })
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

    // display which limits are breaching in text format
    const checkLimitsText = () => {
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

    // return limits to default 
    const handleReturnToDefault = () => {
        axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/65847373bafeaa9f5baa3e3d`, {
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
                    <button onClick={handleRefresh}>Refresh</button>
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
                <div className="table_border">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="board_col"> Indicator </th>
                                <th className="board_col"> Current </th>
                                <th className="board_col"> Operating Window</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="board_col">Steady Wind ({windUnit})</td>
                                {wind > windOpWindow ? <td className="board_col" style={{ color: 'red' }}>{wind}</td> : <td className="board_col" style={{ color: 'green' }}>{wind}</td>}
                                <td className="board_col">&lt; {parseFloat(windOpWindow).toFixed(1)}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Wind gusts ({windUnit})</td>
                                {windGust > windGustOpWindow ? <td className="board_col" style={{ color: 'red' }}>{windGust}</td> : <td className="board_col" style={{ color: 'green' }}>{windGust}</td>}
                                <td className="board_col">&lt; {parseFloat(windGustOpWindow).toFixed(1)}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Air temperature (F)</td>
                                {weather.temp_f > userData.tempLow && weather.temp_f < userData.tempHigh ? <td className="board_col" style={{ color: 'green' }}>{weather.temp_f}</td> : <td className="board_col" style={{ color: 'red' }}>{weather.temp_f}</td>}
                                <td className="board_col">&gt; {userData.tempLow}, &lt; {userData.tempHigh}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Precipitation (mm/hr)</td>
                                {weather.precip_mm > userData.precipitation ? <td className="board_col" style={{ color: 'red' }}>{weather.precip_mm}</td> : <td className="board_col" style={{ color: 'green' }}>{weather.precip_mm}</td>}
                                <td className="board_col">{userData.precipitation}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Visibility (SM)</td>
                                {weather.vis_miles >= userData.visibility ? <td className="board_col" style={{ color: 'green' }}>{weather.vis_miles}</td> : <td className="board_col" style={{ color: 'red' }}>{weather.vis_miles}</td>}
                                <td className="board_col">&gt; {userData.visibility}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Cloud base height (ft)</td>
                                <td className="board_col">{weather.cloud}</td>
                                <td className="board_col">&gt; {userData.cloudBaseHeight}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Density altitude (ft)</td>
                                <td className="board_col">{weather.wind_mph}</td>
                                <td className="board_col">&gt; {userData.densityAltitudeLow}, &lt; {userData.densityAltitudeHigh}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Last lightning strike(min)</td>
                                <td className="board_col">{weather.wind_mph}</td>
                                <td className="board_col">&gt; {userData.lighteningStrike}</td>
                            </tr>
                            <tr>
                                <td className="board_col">Wind direction (deg)</td>
                                <td className="board_col">{weather.wind_degree}</td>
                                <td className="board_col">N/A</td>
                            </tr>
                        </tbody>
                    </table>
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
                        {checkLimitsText().map((limits, index) => {
                            return (<p key={index}>{limits}</p>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};