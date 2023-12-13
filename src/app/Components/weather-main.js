'use client';
import axios from "axios";
import React, { useState, useEffect } from "react";
import '../css/weather.css';

export default function WeatherMain() {

    const [weather, setWeather] = useState([]);
    const [wind, setWind] = useState('');
    const [windOpWindow, setWindOpWindow] = useState('');
    const [windUnit, setWindUnit] = useState(localStorage.getItem('windUnit') ? localStorage.getItem('windUnit') : 'knots');
    const [windGust, setWindGust] = useState('');
    const [windGustOpWindow, setWindGustOpWindow] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [minCountdown, setMinCountdown] = useState(60);
    const [loading, setLoading] = useState(true);

    // fetch weather data on page load and every minute
    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=47.53294,-121.80539`)
                .then((res) => {
                    console.log(res.data.current);
                    if (windUnit === 'knots') {
                        setWind((res.data.current.wind_mph * 0.868976).toFixed(2));
                        setWindOpWindow(14);
                        setWindGustOpWindow(25);
                        setWindGust((res.data.current.gust_mph * 0.868976).toFixed(2));
                    } else if (windUnit === 'm/s') {
                        setWind((res.data.current.wind_mph * 0.44704).toFixed(2));
                        setWindOpWindow((14 * 0.514444).toFixed(2));
                        setWindGustOpWindow((25 * 0.514444));
                        setWindGust((res.data.current.gust_mph * 0.44704).toFixed(2));
                    }
                    setWeather(res.data.current);
                    setLoading(false);
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
    }, [windUnit]);

    // convert wind speed to knots or m/s
    const handleConversion = (e) => {
        localStorage.setItem('windUnit', e.target.value);
        if (e.target.value === 'knots') {
            setWind((weather.wind_mph * 0.868976).toFixed(2));
            setWindOpWindow(14);
            setWindGust((weather.gust_mph * 0.868976).toFixed(2));
            setWindGustOpWindow(25);
            setWindUnit('knots');
        } else if (e.target.value === 'm/s') {
            setWind((weather.wind_mph * 0.44704).toFixed(2));
            setWindOpWindow((14 * 0.514444).toFixed(2));
            setWindGust((weather.gust_mph * 0.44704).toFixed(2));
            setWindGustOpWindow((25 * 0.514444));
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

    // updating wind operating window
    const handleNewWindOp = (e) => {

        setWindOpWindow(e.target.value);
    };

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
            <div className="table_border">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="board_col"> Indicator </th>
                            <th className="board_col"> Current </th>
                            <th className="board_col"> Operating Window</th>
                            <th className="board_col">  New Operating Window</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="board_col">Steady Wind ({windUnit})</td>
                            {wind > windOpWindow ? <td className="board_col" style={{ color: 'red' }}>{wind}</td> : <td className="board_col" style={{ color: 'green' }}>{wind}</td>}
                            <td className="board_col">&lt; {parseFloat(windOpWindow).toFixed(1)}</td>
                            <td className="board_col"><input name="newWindOp" value={windOpWindow} onChange={handleNewWindOp} /></td>
                        </tr>
                        <tr>
                            <td className="board_col">Wind gusts ({windUnit})</td>
                            {windGust > windGustOpWindow ? <td className="board_col" style={{ color: 'red' }}>{windGust}</td> : <td className="board_col" style={{ color: 'green' }}>{windGust}</td>}
                            <td className="board_col">&lt; {windGustOpWindow.toFixed(1)}</td>

                        </tr>
                        <tr>
                            <td className="board_col">Air temperature (F)</td>
                            {weather.temp_f > 32.0 && weather.temp_f < 91.0 ? <td className="board_col" style={{ color: 'green' }}>{weather.temp_f}</td> : <td className="board_col" style={{ color: 'red' }}>{weather.temp_f}</td>}
                            <td className="board_col">&gt; 32.0, &lt; 91.0</td>
                        </tr>
                        <tr>
                            <td className="board_col">Precipation (mm/hr)</td>
                            {weather.precip_mm > 0.0 ? <td className="board_col" style={{ color: 'red' }}>0.0</td> : <td className="board_col" style={{ color: 'green' }}>0.0</td>}
                            <td className="board_col">0.0</td>
                        </tr>
                        <tr>
                            <td className="board_col">Visibility (SM)</td>
                            {weather.vis_miles > 3.0 ? <td className="board_col" style={{ color: 'green' }}>{weather.vis_miles}</td> : <td className="board_col" style={{ color: 'red' }}>{weather.vis_miles}</td>}
                            <td className="board_col">&gt; 3.0</td>
                        </tr>
                        <tr>
                            <td className="board_col">Cloud base height (ft)</td>
                            <td className="board_col">{weather.cloud}</td>
                            <td className="board_col">&gt; 1000</td>
                        </tr>
                        <tr>
                            <td className="board_col">Density altitude (ft)</td>
                            <td className="board_col">{weather.wind_mph}</td>
                            <td className="board_col">&gt; -2000, &lt; 4600</td>
                        </tr>
                        <tr>
                            <td className="board_col">Last lightning strike(min)</td>
                            <td className="board_col">{weather.wind_mph}</td>
                            <td className="board_col">&gt; 30.0</td>
                        </tr>
                        <tr>
                            <td className="board_col">Wind direction (deg)</td>
                            <td className="board_col">{weather.wind_degree}</td>
                            <td className="board_col">N/A</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}