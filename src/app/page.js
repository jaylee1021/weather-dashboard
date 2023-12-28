import Image from 'next/image';
import './css/page.css';
import WeatherMain from './Components/weather-main';

export default function Home() {
  return (
    <main className='main'>
      <WeatherMain />
    </main>
  );
}
