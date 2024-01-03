"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import setAuthToken from '@/app/utils/setAuthToken';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import '../../css/page.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // prevents page from refreshing

        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, { email, password })
            .then(response => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('jwtToken', response.data.token);
                    localStorage.setItem('userId', response.data.userData.id);
                    localStorage.setItem('email', response.data.userData.email);
                    localStorage.setItem('expiration', response.data.userData.exp);
                }
                setAuthToken(response.data.token);
                // let decoded = jwtDecode(response.data.token);
                router.push('/');
            })
            .catch(error => {
                alert('Either your email or password is incorrect');
            });
    };

    return (
        <div className="login_main">
            <br />
            <br />
            <br />
            <br />
            <div>
                <h1>Flight Test Weather Dashboard</h1>
            </div>
            <div className='middle-content'>
                <React.Fragment>
                    <CssBaseline />
                    <Container maxWidth="sm">
                        <form onSubmit={handleSubmit}>
                            <h1>Account Login</h1>
                            <div style={{ width: '400px' }}>
                                <TextField className='text_width' variant='standard' label='Email' type="text" name='email' value={email} onChange={handleEmail} autoComplete='on' required />
                            </div>
                            <div >
                                <TextField className='text_width' variant='standard' label='Password' type="password" name='password' alue={password} onChange={handlePassword} required />
                            </div>
                            <div className='login_button'>
                                <div >
                                    <Button variant='outlined' type="submit">Login</Button>
                                </div>
                                <div >
                                    <Button variant='outlined' type="button">Forgot password?</Button>
                                </div>
                            </div>
                        </form>
                        <div className='no_account'>
                            <p>Don&apos;t have an account?</p>
                            <Button variant='outlined' href="/users/signup" type="button" className="btn btn-secondary active mt-3">Signup</Button>
                        </div>
                    </Container>
                    <CssBaseline />
                </React.Fragment>

            </div>

            <br />
            <br />
            <br />
            <br />
        </div>
    );
}