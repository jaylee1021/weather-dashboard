import Image from 'next/image';
import './css/page.css';
import WeatherMain from './Components/weather-main';

export default function Home() {
  return (
    <main className='main'>
      <h1 className='page_title'> Flight Test Weather Dashboard</h1>
      <WeatherMain />
    </main>
  );
}
