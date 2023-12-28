'use client';
import { Chart } from "react-google-charts";
import * as React from 'react';
import '../css/weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
        [0, 0]
    ]);
    const options = {
        title: 'Weather Data',
        hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 },
        height: 300,
        legend: 'none',
        chartArea: { width: "90%", height: "70%" }
    };
    const mphToKnots = 0.868976;

    function handleDataUpdate(e) {
        setDataLabel(e.target.value);
        const weatherDataLength = weatherData.length - currentHour < 7 ? weatherData.length : 7;
        if (e.target.value === 'steadyWinds') {
            const newData = [['Time', 'Wind Speed (knots)']];
            for (let i = (currentHour - 3); i < weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].wind_mph * mphToKnots]);
                setData(newData);
            }
        } else if (e.target.value === 'windGust') {
            const newData = [['Time', 'Wind Gust (knots)']];
            for (let i = (currentHour - 3); i < weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].gust_mph * mphToKnots]);
                setData(newData);
            }
        } else if (e.target.value === 'temp_f') {
            const newData = [['Time', 'Air Temp (f)']];
            for (let i = (currentHour - 3); i < weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].temp_f]);
                setData(newData);
            }
        } else if (e.target.value === 'precip_mm') {
            const newData = [['Time', 'Precipitation (mm/hr)']];
            for (let i = (currentHour - 3); i < weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].precip_mm]);
                setData(newData);
            }
        } else if (e.target.value === 'vis_miles') {
            const newData = [['Time', 'Visibility (SM)']];
            for (let i = (currentHour - 3); i < weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].vis_miles]);
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
                    console.log('weather data', res.data.forecast.forecastday[0].hour);
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
            <div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 130 }}>
                    <InputLabel id="select-standard-label">Choose Option</InputLabel>
                    <Select
                        labelId="select-standard-label"
                        id="select-standard"
                        value={dataLabel}
                        onChange={handleDataUpdate}
                        label="Weather Data"
                    >
                        <MenuItem value={'steadyWinds'}>Steady Winds (knots)</MenuItem>
                        <MenuItem value={'windGust'}>Wind Gust (knots)</MenuItem>
                        <MenuItem value={'temp_f'}>Air Temp (f)</MenuItem>
                        <MenuItem value={'precip_mm'}>Previpitation (mm/hr)</MenuItem>
                        <MenuItem value={'vis_miles'}>Visibility (SM)</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Chart
                width={'100%'}
                chartType='AreaChart'
                data={data}
                options={options}
            />
        </div>
    );
}