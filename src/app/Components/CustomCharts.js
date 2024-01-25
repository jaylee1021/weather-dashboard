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
import { useTheme } from "next-themes";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CustomCharts({ weatherData, fetchData, aqiData }) {

    const [dataLabel, setDataLabel] = useState('winds_knots');
    const [currentDate, setCurrentDate] = useState('');
    const [options, setOptions] = useState({});
    const { theme } = useTheme();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        if (theme === 'dark' || prefersDarkMode) {
            setOptions({


                hAxis: { title: `Time (${currentDate})`, titleTextStyle: { color: 'white' }, textStyle: { color: 'white' } },
                vAxis: { minValue: 0, textStyle: { color: 'white' }, gridlines: { color: 'gray' } },
                height: 400,
                pointSize: 5,
                legend: { position: "top", maxLines: 3, textStyle: { color: 'white' } },
                chartArea: { right: 0, width: "96%", height: "70%" },
                curveType: 'function',
                backgroundColor: {
                    stroke: '#ccc',
                    strokeWidth: 5,
                    fill: '#121212'
                },
                annotations: {
                    textStyle: {
                        color: 'white'
                    },
                    stem: {
                        length: 10
                    },
                }
            });
        } else {
            setOptions({


                vAxis: { minValue: 0 },
                height: 400,
                pointSize: 5,
                legend: { position: "top", maxLines: 3 },
                chartArea: { right: 0, width: "96%", height: "70%" },
                curveType: 'function',
                backgroundColor: {
                    stroke: '#ccc',
                    strokeWidth: 5,
                },
                annotations: {
                    textStyle: {
                        color: 'black'
                    },
                    stem: {
                        length: 10
                    },
                }
            });
        }
    }, [theme, currentDate, prefersDarkMode]);

    const [data, setData] = useState([
        ['', ''],
        [0, 0]
    ]);

    const mphToKnots = 0.868976;
    const mphToMetersPerSec = 0.44704;

    const dataUpdate = (e) => {
        const weatherValue = e.target.value;
        handleDataUpdate(weatherValue);
    };

    const handleDataUpdate = useCallback((weatherValue) => {
        setDataLabel(weatherValue);
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
        const weatherDataLength = weatherData.length - hours < 10 ? weatherData.length - hours : 10;
        const aqiForecast = aqiData.hourly.us_aqi;
        const aqiForecastTime = aqiData.hourly.time;
        let loopStart;
        if (hours < 3) {
            loopStart = 0;
        } else {
            loopStart = hours - 3;
        }
        // This code adds the current time to the chart
        if (weatherValue === 'winds_knots') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Steady Winds (knots)', { role: 'annotation', type: 'string' }, 'Wind Gust (knots)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                let wind = Math.round(weatherData[i].wind_mph * mphToKnots * 10) / 10;
                let windGust = Math.round(weatherData[i].gust_mph * mphToKnots * 10) / 10;
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', wind, wind, windGust, windGust]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, wind, wind, windGust, windGust]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'winds_m/s') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Steady Winds (m/s)', { role: 'annotation', type: 'string' }, 'Wind Gust (m/s)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                let wind = Math.round(weatherData[i].wind_mph * mphToMetersPerSec * 10) / 10;
                let windGust = Math.round(weatherData[i].gust_mph * mphToMetersPerSec * 10) / 10;
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', wind, wind, windGust, windGust]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, wind, wind, windGust, windGust]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'temp_f') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Air Temp (F)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].temp_f, weatherData[i].temp_f]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].temp_f, weatherData[i].temp_f]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'temp_c') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Air Temp (C)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].temp_c, weatherData[i].temp_c]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].temp_c, weatherData[i].temp_c]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'precip_mm') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Precipitation (mm/hr)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].precip_mm, weatherData[i].precip_mm]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].precip_mm, weatherData[i].precip_mm]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'vis_miles') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Visibility (SM)', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', weatherData[i].vis_miles, weatherData[i].vis_miles]);
                } else {
                    newData.push([weatherData[i].time.split(' ')[1], null, weatherData[i].vis_miles, weatherData[i].vis_miles]);
                }
            }
            setData(newData);
        } else if (weatherValue === 'aqi') {
            const newData = [['Time', { role: 'annotation', type: 'string' }, 'Air Quality Index', { role: 'annotation', type: 'string' }]];
            for (let i = loopStart; i < hours + weatherDataLength; i++) {
                if (hours === i) {
                    newData.push([formattedTime, 'Current Time', aqiForecast[i], aqiForecast[i]]);
                } else {
                    newData.push([aqiForecastTime[i].split('T')[1], null, aqiForecast[i], aqiForecast[i]]);
                }
            }
            setData(newData);
        }
    }, [weatherData, aqiData]);

    const updateChart = useCallback(() => {
        const currentTime = new Date();
        const hours = currentTime.getHours(); // Retrieves the hour as an integer
        const date = currentTime.getDate();
        const month = currentTime.getMonth();
        const year = currentTime.getFullYear();
        setCurrentDate(`${month + 1}/${date}/${year}`);
        fetchData();
        handleDataUpdate(dataLabel);
    }, [fetchData, handleDataUpdate, dataLabel]);

    useEffect(() => {
        updateChart();

        return () => {
            axios.CancelToken.source().cancel();
        };
    }, []);

    if (!aqiData) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div className='py-10 flex flex-col items-center justify-center'>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <h1 style={{ display: 'flex', alignContent: 'center', flexWrap: 'wrap', marginRight: '10px' }}>Weather Forecast</h1>
                <FormControl name='chartForm' variant="standard" sx={{ m: 1, minWidth: 140 }} style={{ margin: '10px 10px 10px 0' }}>
                    <InputLabel className="Dark_mode" id="select-standard-label" >Choose Option</InputLabel>
                    <Select
                        className='Select_input'
                        labelId="select-standard-label"
                        id="select-standard"
                        value={dataLabel}
                        onChange={dataUpdate}
                        label="Weather Data"
                        name="weatherDataSelect"
                        style={{ textIndent: '5px' }}
                    >
                        <MenuItem value={'winds_knots'}>Winds (knots)</MenuItem>
                        <MenuItem value={'winds_m/s'}>Winds (m/s)</MenuItem>
                        <MenuItem value={'temp_f'}>Air Temp (F)</MenuItem>
                        <MenuItem value={'temp_c'}>Air Temp (C)</MenuItem>
                        <MenuItem value={'precip_mm'}>Precipitation (mm/hr)</MenuItem>
                        <MenuItem value={'vis_miles'}>Visibility (SM)</MenuItem>
                        <MenuItem value={'aqi'}>Air Quality</MenuItem>
                    </Select>
                </FormControl>
                {dataLabel && dataLabel != 'Choose Option' ? <div className="chart_refresh_button">
                    <Button variant='outlined' className="Dark_Mode_Button" onClick={updateChart}>Refresh Chart</Button>
                </div>
                    : null}
            </div>
            <Chart
                width={'100%'}
                chartType='LineChart'
                data={data}
                options={options}
                legendToggle
            />
        </div>
    );
};