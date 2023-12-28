'use client';
import { Chart } from "react-google-charts";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import '../css/weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import UpdateParams from "./UpdateParams";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function CustomCharts() {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState([]);
    const [dataLabel, setDataLabel] = useState('');
    const [currentHour, setCurrentHour] = useState('');
    const [data, setData] = useState([
        ['Time', 'Wind Speed'],
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]
    ]);
    const mphToKnots = 0.868976;

    function handleDataUpdate(e) {
        setDataLabel(e.target.value);
        if (e.target.value === 'steadyWinds') {
            const newData = [['Time', 'Wind Speed (knots)']];
            for (let i = (currentHour - 3); i < (currentHour + 7); i++) {
                newData.push([weatherData[i].time, weatherData[i].wind_mph * mphToKnots]);
                setData(newData);
            }
        } else if (e.target.value === 'windGust') {
            const newData = [['Time', 'Wind Gust (knots)']];
            for (let i = (currentHour - 3); i < (currentHour + 7); i++) {
                newData.push([weatherData[i].time, weatherData[i].gust_mph * mphToKnots]);
                setData(newData);
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = new Date();
            const hours = currentTime.getHours(); // Retrieves the hour as an integer
            setCurrentHour(hours);
        }, 1000);

        return () => clearInterval(intervalId); // This is the cleanup function
    }, []);


    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=47.53294,-121.80539&days=2`)
                .then((res) => {
                    setWeatherData(res.data.forecast.forecastday[0].hour);
                    setLoading(false);

                })
                .catch((err) => {
                    console.log(err);
                });
            // setMinCountdown(60);
        };
        fetchData();

        // const intervalId = setInterval(fetchData, 60000);
        // const countdownInterval = setInterval(() => {
        //     setMinCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 0);
        // }, 1000);

        // return () => {
        //     clearInterval(intervalId); // This is the cleanup function
        //     clearInterval(countdownInterval);
        // };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='py-10 flex flex-col items-center justify-center'>
            <button
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus: ring-blue-300 font-medium'
                onClick={handleDataUpdate}>
                Update Data
            </button>
            <div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Weather Data</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={dataLabel}
                        onChange={handleDataUpdate}
                        label="Weather Data"
                    >
                        <MenuItem value={'steadyWinds'}>Steady Winds</MenuItem>
                        <MenuItem value={'windGust'}>Wind Gust</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Chart
                width={'100vw'}
                chartType='AreaChart'
                data={data}
            />
        </div>
    );
}