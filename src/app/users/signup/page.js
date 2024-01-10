"use client";
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import '../../css/page.css';

const Signup = () => {
	const router = useRouter();

	const [redirect, setRedirect] = useState(false);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState("");
	const [error, setError] = useState(false);

	const handleFirstName = (e) => {
		setFirstName(e.target.value);
	};

	const handleLastName = (e) => {
		setLastName(e.target.value);
	};

	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

	const handlePassword = (e) => {
		let new_pass = event.target.value;
		setPassword(new_pass);

		// regular expressions to validate password
		const lowerCase = /[a-z]/g;
		const upperCase = /[A-Z]/g;
		const numbers = /[0-9]/g;
		const characters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

		if (!new_pass.match(lowerCase)) {
			setErrorMessage("Password should contains lowercase letters!");
		} else if (!new_pass.match(upperCase)) {
			setErrorMessage("Password should contain uppercase letters!");
		} else if (!new_pass.match(numbers)) {
			setErrorMessage("Password should contains numbers also!");
		} else if (!new_pass.match(characters)) {
			setErrorMessage("Password should contain special characters!");
		} else if (new_pass.length < 10) {
			setErrorMessage("Password length should be more than 10.");
		} else {
			setErrorMessage(<p style={{ color: 'green' }}>Password is strong!</p>);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const newUser = {
			firstName,
			lastName,
			email,
			password
		};
		axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/signup`, newUser)
			.then(response => {
				setRedirect(true);
			})
			.catch(error => {
				if (error.response.data.message === 'Email already exists') {
					console.log('===> Error in Signup', error.response.data.message);
					setError(true);
				}
			});
	};

	useEffect(() => {
		if (redirect) {
			router.push('/users/login');
		}
	}, [redirect, router]);

	if (error) {
		return (
			<div className='login_main' >
				<div className='middle-content'>
					<p>User with Email already exists!</p>
					<br />
					<p style={{ margin: '10px' }}>Log In to your account</p>
					<Button variant='outlined' href="/users/login" type="button" className="btn btn-primary active mt-3">Login</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="login_main">
			<br />
			<br />
			<br />
			<br />
			<div className='middle-content signup_middle'>
				<form onSubmit={handleSubmit}>
					<h1 className='login_subtitle'>Sign Up</h1>
					<p className="text-muted">Create an account below to get started</p>
					<div>
						<TextField variant='standard' type="text" className="text_width" label="First Name" value={firstName} onChange={handleFirstName} required />
					</div>
					<div>
						<TextField variant='standard' type="text" className="text_width" label="Last Name" value={lastName} onChange={handleLastName} required />
					</div>
					<div>
						<TextField variant='standard' type="email" className="text_width" label="Email" value={email} onChange={handleEmail} required />
					</div>
					<div>
						<TextField variant='standard' type="password" className="text_width" label="Password" value={password} onChange={handlePassword} required />
					</div>
					<div style={{ color: "red" }}> {errorMessage} </div>
					<div className='login_button'>
						<div>
							<Button variant='outlined' type="submit" className="btn btn-primary px-4">Sign Up</Button>
						</div>
						<div>
							<Button variant='outlined' type="button" className="btn btn-link px-0">Forgot password?</Button>
						</div>
					</div>
					<p style={{ padding: '10px 0' }}>If you already have an account, please log in</p>
					<Button variant='outlined' href="/users/login" type="button" className="btn btn-primary active mt-3">Login</Button>
				</form>
			</div>

		</div>

	);
};

export default Signup;