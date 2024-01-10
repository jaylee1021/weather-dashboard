import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function WeatherTable({ userData, weather, wind, windGust, windUnit,
    temp, tempUnit, windOpWindow, windGustOpWindow, tempLow, tempHigh }) {

    return (
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

                </TableBody>
            </Table>
        </TableContainer>
    );
}