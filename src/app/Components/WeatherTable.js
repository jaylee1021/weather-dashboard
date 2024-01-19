import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../css/weather.css';

export default function WeatherTable({ userData, weather, wind, windGust, windUnit,
    temp, tempUnit, windOpWindow, windGustOpWindow, tempLow, tempHigh, goNoGo }) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className='Chart_body' style={goNoGo ? { border: '5px solid green' } : { border: '5px solid red' }} >
                <TableHead>
                    <TableRow >
                        <TableCell className='Dark_mode' style={{ fontWeight: 'bold' }}>Indicator</TableCell>
                        <TableCell className='Dark_mode' align="right" style={{ fontWeight: 'bold' }}>Current</TableCell>
                        <TableCell className='Dark_mode' align="right" style={{ fontWeight: 'bold' }}>Test Card Op Window</TableCell>
                        <TableCell className='Dark_mode' align="right" style={{ fontWeight: 'bold' }}>Standard Op Window</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userData.showWind ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                Steady Wind ({windUnit})
                            </TableCell>
                            {wind > windOpWindow ? <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{wind}</TableCell> : <TableCell className='Dark_mode_green' align="right" >{wind}</TableCell>}
                            <TableCell className='Dark_mode' align="right">&lt;= {parseFloat(windOpWindow).toFixed(1)}</TableCell>
                            {windUnit === 'knots' ? <TableCell className='Dark_mode' align="right">&lt;= 14.0</TableCell> : <TableCell className='Dark_mode' align="right">&lt;= 7.2</TableCell>}
                        </TableRow>
                        : null}
                    {userData.showWindGust ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                Wind gusts ({windUnit})
                            </TableCell>
                            {windGust > windGustOpWindow ? <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{windGust}</TableCell> : <TableCell className='Dark_mode_green' align='right'>{windGust}</TableCell>}
                            <TableCell className='Dark_mode' align="right">&lt;= {parseFloat(windGustOpWindow).toFixed(1)}</TableCell>
                            {windUnit === 'knots' ? <TableCell className='Dark_mode' align="right">&lt;= 25.0</TableCell> : <TableCell className='Dark_mode' align="right">&lt;= 12.9</TableCell>}
                        </TableRow>
                        : null}
                    {userData.showWindDirection ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Wind direction (deg)</TableCell>
                            {weather.wind_degree >= userData.windDirectionLow && weather.wind_degree <= userData.windDirectionHigh ? <TableCell className='Dark_mode_green' align='right'>{weather.wind_degree}</TableCell> :
                                <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.wind_degree}</TableCell>}
                            {userData.windDirectionLow != -1 && userData.windDirectionHigh != 361 ?
                                <TableCell className='Dark_mode' align="right">&gt; {userData.windDirectionLow}, &lt; {userData.windDirectionHigh}</TableCell>
                                : <TableCell className='Dark_mode' align="right">N/A</TableCell>
                            }
                            <TableCell className='Dark_mode' align="right">N/A</TableCell>
                        </TableRow>
                        : null}
                    {userData.showTemp ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Air temperature ({tempUnit})</TableCell>
                            {temp > tempLow && temp < tempHigh ? <TableCell className='Dark_mode_green' align='right'>{temp}</TableCell> : <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{temp}</TableCell>}
                            <TableCell className='Dark_mode' align="right">&gt;= {tempLow}, &lt;= {tempHigh}</TableCell>
                            {localStorage.getItem('tempUnit') === 'f' ? <TableCell className='Dark_mode' align="right">&gt;= 32, &lt;= 91</TableCell> : <TableCell className='Dark_mode' align="right">&gt;= 0, &lt;= 32.8</TableCell>}
                        </TableRow>
                        : null}
                    {userData.showPrecipitation ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Precipitation (mm/hr)</TableCell>
                            {weather.precip_mm > userData.precipitation ? <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.precip_mm}</TableCell> : <TableCell className='Dark_mode_green' align='right'>{weather.precip_mm}</TableCell>}
                            <TableCell className='Dark_mode' align="right">{userData.precipitation}</TableCell>
                            <TableCell className='Dark_mode' align="right">0</TableCell>
                        </TableRow>
                        : null}
                    {userData.showVisibility ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Visibility (SM)</TableCell>
                            {weather.vis_miles >= userData.visibility ? <TableCell className='Dark_mode_green' align='right'>{weather.vis_miles}</TableCell> : <TableCell className='Dark_mode' align="right" style={{ color: 'red', fontWeight: 'bold' }}>{weather.vis_miles}</TableCell>}
                            <TableCell className='Dark_mode' align="right">&gt;= {userData.visibility}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt;= 3</TableCell>
                        </TableRow>
                        : null}
                    {userData.showCloudBaseHeight ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Cloud base height (ft)</TableCell>
                            <TableCell className='Dark_mode' align="right">{weather.cloud}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; {userData.cloudBaseHeight}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; 1000</TableCell>
                        </TableRow>
                        : null}
                    {userData.showDensityAltitude ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Density altitude (ft)</TableCell>
                            <TableCell className='Dark_mode' align="right">{weather.wind_mph}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; {userData.densityAltitudeLow}, &lt; {userData.densityAltitudeHigh}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; -2000, &lt; 4600</TableCell>
                        </TableRow>
                        : null}
                    {userData.showLighteningStrike ?
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className='Dark_mode' component="th" scope="row" style={{ fontWeight: 'bold' }}>Last lightning strike(min)</TableCell>
                            <TableCell className='Dark_mode' align="right">{weather.wind_mph}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; {userData.lighteningStrike}</TableCell>
                            <TableCell className='Dark_mode' align="right">&gt; 30</TableCell>
                        </TableRow>
                        : null}

                </TableBody>
            </Table>
        </TableContainer>
    );
}