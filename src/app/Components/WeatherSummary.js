import React from 'react';
import '../css/weather.css';

export default function WeatherSummary({ props }) {

    const checkGoNoGo = () => {
        if ((props.wind > props.windOpWindow && props.userData.showWind) || (props.windGust > props.windGustOpWindow && props.userData.showWindGust) || (props.temp < props.tempLow && props.userData.showTemp) ||
            (props.temp > props.tempHigh && props.userData.showTemp) || (props.weather.precip_mm > props.userData.precipitation && props.userData.showPrecipitation) ||
            (props.weather.vis_miles < props.userData.visibility && props.userData.showVisibility) || props.weather.cloud < props.userData.cloudBaseHeight && props.userData.showCloudBaseHeight ||
            (props.weather.wind_mph < props.userData.densityAltitudeLow && props.userData.showDensityAltitude) || (props.weather.wind_mph > props.userData.densityAltitudeHigh && props.userData.showDensityAltitude) ||
            (props.weather.wind_mph > props.userData.lighteningStrike && props.userData.showLighteningStrike) || (props.weather.wind_degree < props.userData.windDirectionLow && props.userData.showWindDirection) ||
            (props.weather.wind_degree > props.userData.windDirectionHigh && props.userData.showWindDirection)) {
            return (<p style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>Out of Limits!</p>);
        } else {
            return (<p style={{ color: 'green', fontWeight: 'bold', padding: '10px' }}>Go!</p>);
        }
    };

    const checkBreachingLimit = () => {
        let limits = [];
        if (props.wind > props.windOpWindow && props.userData.showWind) {
            limits.push('Steady Wind');
        }
        if (props.windGust > props.windGustOpWindow && props.userData.showWindGust) {
            limits.push('Wind Gust');
        }
        if (props.temp < props.tempLow && props.userData.showTemp) {
            limits.push('Temperature Low');
        }
        if (props.temp > props.tempHigh && props.userData.showTemp) {
            limits.push('Temperature High');
        }
        if (props.weather.precip_mm > props.userData.precipitation && props.userData.showPrecipitation) {
            limits.push('Precipitation');
        }
        if (props.weather.vis_miles < props.userData.visibility && props.userData.showVisibility) {
            limits.push('Visibility');
        }
        if (props.weather.cloud < props.userData.cloudBaseHeight && props.userData.showCloudBaseHeight) {
            limits.push('Cloud Base Height');
        }
        if (props.weather.wind_mph < props.userData.densityAltitudeLow && props.userData.showDensityAltitude) {
            limits.push('Density Altitude Low');
        }
        if (props.weather.wind_mph > props.userData.densityAltitudeHigh && props.userData.showDensityAltitude) {
            limits.push('Density Altitude High');
        }
        if (props.weather.wind_mph > props.userData.lighteningStrike && props.userData.showLighteningStrike) {
            limits.push('Lightening Strike');
        }
        if (props.weather.wind_degree < props.userData.windDirectionLow && props.userData.showWindDirection) {
            limits.push('Wind Direction Lower Limit');
        }
        if (props.weather.wind_degree > props.userData.windDirectionHigh && props.userData.showWindDirection) {
            limits.push('Wind Direction Upper Limit');
        }
        if (limits.length === 0) {
            limits.push(<p style={{ color: 'green' }}>None</p>);
        }
        return limits;
    };

    return (
        <div className="table_border">
            <div style={{ padding: '10px' }}>
                <h3>Summary</h3>
                <h4>Status</h4>
                {checkGoNoGo()}
                <h4>Breaching Limit(s)</h4>
                <div style={{ color: 'red', fontWeight: 'bold', padding: '10px' }}>
                    {checkBreachingLimit().map((limits, index) => {
                        return (<div key={index} >{limits}</div>);
                    })}
                </div>
            </div>
        </div>
    );
}