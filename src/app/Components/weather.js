'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherMain from './weather-main';

export default function Weather() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`);
            setUser(res.data.user);
        };

        fetchUser();
    }, []);

    if (!user) {
        return null; // or return a loading spinner
    }

    return <WeatherMain user={user} />;
}