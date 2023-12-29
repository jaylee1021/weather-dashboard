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


export default function CustomCharts({ weatherData }) {

    // const [weatherData, setWeatherData] = useState([]);
    const [dataLabel, setDataLabel] = useState('');
    const [currentHour, setCurrentHour] = useState('');
    const [data, setData] = useState([
        ['', ''],
        [0, 0]
    ]);
    const options = {
        title: 'Weather Data',
        hAxis: { title: 'Time', titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 },
        height: 300,
        legend: { position: "top", maxLines: 3 },
        chartArea: { width: "90%", height: "70%" }
    };
    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;

    function handleDataUpdate(e) {
        setDataLabel(e.target.value);
        const weatherDataLength = weatherData.length - currentHour < 7 ? weatherData.length : 7;
        if (e.target.value === 'winds_knots') {
            const newData = [['Time', 'Steady Winds (knots)', 'Wind Gust (knots)']];
            for (let i = (currentHour - 3); i < currentHour + weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].wind_mph * mphToKnots, weatherData[i].gust_mph * mphToKnots]);
            }
            setData(newData);
        } else if (e.target.value === 'winds_m/s') {
            const newData = [['Time', 'Steady Winds (m/s)', 'Wind Gust (m/s)']];
            for (let i = (currentHour - 3); i < currentHour + weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].wind_mph * mphToMetersPerSec, weatherData[i].gust_mph * mphToMetersPerSec]);
            }
            setData(newData);
        } else if (e.target.value === 'temp_f') {
            const newData = [['Time', 'Air Temp (f)']];
            for (let i = (currentHour - 3); i < currentHour + weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].temp_f]);
            }
            setData(newData);
        } else if (e.target.value === 'precip_mm') {
            const newData = [['Time', 'Precipitation (mm/hr)']];
            for (let i = (currentHour - 3); i < currentHour + weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].precip_mm]);
            }
            setData(newData);
        } else if (e.target.value === 'vis_miles') {
            const newData = [['Time', 'Visibility (SM)']];
            for (let i = (currentHour - 3); i < currentHour + weatherDataLength; i++) {
                newData.push([weatherData[i].time.split(' ')[1], weatherData[i].vis_miles]);
            }
            setData(newData);
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
                        <MenuItem value={'winds_knots'}>Winds (knots)</MenuItem>
                        <MenuItem value={'winds_m/s'}>Winds (m/s)</MenuItem>
                        <MenuItem value={'temp_f'}>Air Temp (f)</MenuItem>
                        <MenuItem value={'precip_mm'}>Precipitation (mm/hr)</MenuItem>
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