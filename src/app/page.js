import Image from 'next/image';
import './css/page.css';
import WeatherMain from './Components/weather-main';
import Weather from './Components/weather';

export default function Home() {
  return (
    <main className='main'>
      {/* <Weather /> */}
      <WeatherMain />
    </main>
  );
}
