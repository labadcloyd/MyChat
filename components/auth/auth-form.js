import { useState, useRef, useEffect } from 'react';
import css from './auth-form.module.css';
import axios from 'axios';
import {signIn} from 'next-auth/client';
import {useRouter} from 'next/router';
import Head from 'next/head';

function AuthForm() {
	const router = useRouter();
	/* for switching to login or to signup */
	const [isLogin, setIsLogin] = useState(true);
	const [credentials, setCredentials] = useState({})
	/* for showing any errors when submitting data */
	const [isUsernameError, setUsernameError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isRegisterError, setRegisterError] = useState(false)
	/* for handling input change for login and register*/
	async function handleChange(event){
		const {name, value} = event.target
		if(name ==='fullname'){
			setCredentials((prevInput)=>{
				return({
					...prevInput,
					[name]:value
				})
			})
		}
		if(name !=='fullname'){
			setCredentials((prevInput)=>{
				return({
					...prevInput,
					/* making sure they dont add spaces*/
					[name]:value.trim()
				})
			})
		}
	}
	/* for validating or clearing errors for username */
	useEffect(()=>{
		const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
		/* Clearing errors on login */
		if(isLogin){
			setUsernameError(false)
			setErrorMessage(null)
		}
		/* Validating only when on registration */
		if(!isLogin){
			if(credentials.username.length > 1){
				if (regexUserName.test(credentials.username)) {
					setRegisterError(false)
					return setUsernameError(false)
				} else {
					setUsernameError(true)
					setErrorMessage('Invalid Username: Special characters are not allowed')
					setRegisterError(true)
				}
			}
		}
	},[credentials.username])
	/* function for submiting user credentials */
	async function createUser(username, fullname, password){
		try{
			const response = await axios.post('/api/auth/signup', {username,fullname,password})
			return response
		}catch(error){
			/* You can only retrieve the json of the res error through adding .response at the end */
			return error.response
		}
  	}
	/* Sending the user credentials to the database */
	async function submitHandler(event){
		event.preventDefault()
		/* submitting Login */
		if(isLogin){
			const result = await signIn('credentials', {
				redirect: false,
				username: credentials.username,
				password: credentials.password
			})
			if(!result.error){
				router.push('/')
			}
			if(result.error){
				setUsernameError(true)
				setErrorMessage(result.error)
			}
		}
		/* submitting Signup */
		else if (!isLogin){
			/* not allowing users to sign up if there are errors*/
			if(errorMessage===true){
				return
			}
			const response = await createUser(credentials)
			if(response.status===422 || response.status===500){
				setUsernameError(true)
				return setErrorMessage(response.data.message)
			}
			/* Loggin the user in once finished signing up successfuly*/
			if(response.status===201){
				const result = await signIn('credentials', {
					redirect: false,
					username: credentials.username,
					password: credentials.password
				})
				if(!result.error){
					router.push('/')
				}
				if(result.error){
					setUsernameError(true)
					setErrorMessage(result.error)
				}
			}
		}
  	}
	/* for clearing data when switching from login to signup vice verse */
	useEffect(()=>{
		setCredentials({username:'', password:''})
		setRegisterError(false)
		setUsernameError(false)
	},[isLogin])
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}
  	return (
		<div className={css.loginWrapper}>
		<Head>
			<title>{isLogin ? 'Login | MyChat' : 'Sign Up | MyChat'}</title>
		</Head>
			<div className={css.loginContainer}>
				<section className={css.auth}>
					<h1>{isLogin ? 'Login to MyChat' : 'Sign Up to MyChat'}</h1>
					<form onSubmit={submitHandler}>
						<div className={css.control}>
							<div style={{color:'red'}}> {isUsernameError ? [errorMessage] : ''}</div>
							<label htmlFor='username'>Username</label>
							<input type='text' name='username' required value={credentials.username} onChange={handleChange} maxLength='50' />
						</div>
						<div className={css.control} style={ {display:isLogin ? 'none': 'block'}}>
							<label htmlFor='fullname'>Full Name</label>
							<input type='text' name='fullname' required={isLogin? false:true} value={credentials.fullname} onChange={handleChange} maxLength='50' />
						</div>
						<div className={css.control}>
							<label htmlFor='password'>Password</label>
							<input type='password' name='password' required value={credentials.password} onChange={handleChange} />
						</div>
						<div className={css.actions}>
							<button 
								disabled={isRegisterError} 
								style={{backgroundColor:isRegisterError? '#4a4a4a': '', color:isRegisterError? 'black': '', cursor:isRegisterError? 'not-allowed': 'pointer'}}>
									{isLogin ? 'Login' : 'Sign up'}
							</button>
							<button
								type='button'
								className={css.toggle}
								onClick={switchAuthModeHandler}
							>
							{isLogin ? 'Create new account' : 'Login with existing account'}
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	);
}

export default AuthForm;
