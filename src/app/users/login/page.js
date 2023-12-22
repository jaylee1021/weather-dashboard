"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import setAuthToken from '@/app/utils/setAuthToken';
import jwtDecode from 'jwt-decode';

export default function Login() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleUserName = (e) => {
        setUserName(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // prevents page from refreshing

        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, { userName, password })
            .then(response => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('jwtToken', response.data.token);
                    localStorage.setItem('email', response.data.userData.email);
                    localStorage.setItem('userName', response.data.userData.userName);
                    localStorage.setItem('expiration', response.data.userData.exp);
                }
                setAuthToken(response.data.token);
                // let decoded = jwtDecode(response.data.token);
                router.push('/admin');
            })
            .catch(error => {
                alert('Either your username or password is incorrect');
            });
    };

    return (
        <div className="container">
            <br />
            <br />
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card-group mb-0">
                        <div className="card p-4">
                            <form className="card-body" id='form' onSubmit={handleSubmit}>
                                <h1>Admin Login</h1>
                                <p className="text-muted">Sign In to admin account</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input type="text" name='username' className="form-control" placeholder="Username" value={userName} onChange={handleUserName} autoComplete='on' required />
                                </div>
                                <div className="input-group mb-4">
                                    <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                                    <input type="password" name='password' className="form-control" placeholder="Password" alue={password} onChange={handlePassword} required />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <button type="submit" className="btn btn-primary px-4">Login</button>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button type="button" className="btn btn-link px-0">Forgot password?</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}