'use client';
import { Chart } from "react-google-charts";
import * as React from 'react';
import '../css/weather.css';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default function CustomCharts({ weatherData, fetchData }) {

    // const [weatherData, setWeatherData] = useState([]);
    const [dataLabel, setDataLabel] = useState('');
    const [currentHour, setCurrentHour] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [data, setData] = useState([
        ['', ''],
        [0, 0]
    ]);
    const options = {
        title: 'Weather Forecast',
        hAxis: { title: `Time (${currentDate})`, titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 },
        height: 400,
        pointSize: 5,
        legend: { position: "top", maxLines: 3 },
        chartArea: { right: 0, width: "96%", height: "70%" },
        annotations: {
            stem: {
                color: 'red',
            },
            style: 'line'
        }
    };
    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;

    const dataUpdate = (e) => {
        const weatherValue = e.target.value;
        handleDataUpdate(weatherValue);
    };

    const handleDataUpdate = useCallback((weatherValue) => {
        setDataLabel(weatherValue);
        const weatherDataLength = weatherData.length - currentHour < 7 ? weatherData.length - currentHour : 7;
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
        let loopStart;
        if (currentHour < 3) {
            loopStart = 0;
        } else {
            loopStart = currentHour - 3;
        }
        if (weatherValue === 'winds_knots') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Steady Winds (knots)', 'Wind Gust (knots)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].wind_mph * mphToKnots, weatherData[i].gust_mph * mphToKnots]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].wind_mph * mphToKnots, weatherData[i].gust_mph * mphToKnots]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'winds_m/s') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Steady Winds (m/s)', 'Wind Gust (m/s)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].wind_mph * mphToMetersPerSec, weatherData[i].gust_mph * mphToMetersPerSec]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].wind_mph * mphToMetersPerSec, weatherData[i].gust_mph * mphToMetersPerSec]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'temp_f') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Air Temp (F)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].temp_f]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].temp_f]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'temp_c') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Air Temp (C)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].temp_c]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].temp_c]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'precip_mm') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Precipitation (mm/hr)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].precip_mm]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].precip_mm]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'vis_miles') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Visibility (SM)']];
            for (let i = loopStart; i < currentHour + weatherDataLength; i++) {
                if (currentHour === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].vis_miles]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].vis_miles]);
                }
            }
            setData(newData);
        }
    }, [weatherData, currentHour]);

    const updateCurrentHour = useCallback(() => {
        const currentTime = new Date();
        const hours = currentTime.getHours(); // Retrieves the hour as an integer
        const date = currentTime.getDate();
        const month = currentTime.getMonth();
        const year = currentTime.getFullYear();
        setCurrentDate(`${month + 1}/${date}/${year}`);
        setCurrentHour(hours);
        handleDataUpdate(dataLabel);
        fetchData();

    }, [fetchData, handleDataUpdate, dataLabel]);

    useEffect(() => {
        updateCurrentHour();

        return () => {
            axios.CancelToken.source().cancel();
        };
    }, []);

    return (
        <div className='py-10 flex flex-col items-center justify-center'>
            <div style={{ display: 'flex' }}>
                <FormControl name='chartForm' variant="standard" sx={{ m: 1, minWidth: 130 }} style={{ margin: '10px 10px 10px 0' }}>
                    <InputLabel id="select-standard-label" >Choose Option</InputLabel>
                    <Select
                        labelId="select-standard-label"
                        id="select-standard"
                        value={dataLabel}
                        onChange={dataUpdate}
                        label="Weather Data"
                        name="weatherDataSelect"
                    >
                        <MenuItem value={'winds_knots'}>Winds (knots)</MenuItem>
                        <MenuItem value={'winds_m/s'}>Winds (m/s)</MenuItem>
                        <MenuItem value={'temp_f'}>Air Temp (F)</MenuItem>
                        <MenuItem value={'temp_c'}>Air Temp (C)</MenuItem>
                        <MenuItem value={'precip_mm'}>Precipitation (mm/hr)</MenuItem>
                        <MenuItem value={'vis_miles'}>Visibility (SM)</MenuItem>
                    </Select>
                </FormControl>
                {dataLabel ? <div className="chart_refresh_button">
                    <Button variant='outlined' onClick={updateCurrentHour}>Refresh Chart</Button>
                </div>
                    : null}

            </div>
            <Chart
                width={'100%'}
                chartType='LineChart'
                data={data}
                options={options}
            />
        </div>
    );
};