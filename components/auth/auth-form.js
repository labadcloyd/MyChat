import { useState, useRef, useEffect } from 'react';
import css from './auth-form.module.css';
import axios from 'axios';
import {signIn} from 'next-auth/client';
import {useRouter} from 'next/router';

function AuthForm() {
	const router = useRouter();
	/* for switching to login or to signup */
	const [isLogin, setIsLogin] = useState(true);
	const [credentials, setCredentials] = useState({})
	/* for showing any errors when submitting data */
	const [confirmPassword, setConfirmedPassword] = useState()
	const [isConfirmationError, setPasswordError] = useState(false)
	const [isUsernameError, setUsernameError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isRegisterError, setRegisterError] = useState(false)
	/* for handling input change for login and register*/
	async function handleChange(event){
		const {name, value} = event.target
		setCredentials((prevInput)=>{
			return({
				...prevInput,
				/* making sure they dont add spaces*/
				[name]:value.trim()
			})
		})
	}
	/* for handling confirm password state*/
	async function handleConfirmation(event){
		const {value} = event.target
		setConfirmedPassword(value)
		setPasswordError(false)
	}
	/* for confirming password or clearing errors for password*/
	useEffect(()=>{
		if(isLogin){
			setPasswordError(false)
			setErrorMessage(null)
		}
		if(!isLogin){
			if(confirmPassword !== credentials.password){
				if(!confirmPassword ){
					return
				}
				setRegisterError(true)
				return setPasswordError(true)
			} else{
				setRegisterError(false)
				return setPasswordError(false)
			}
		}
	},[confirmPassword, credentials.password])
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
	async function createUser(username, password){
		try{
			const response = await axios.post('/api/auth/signup', {username,password})
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
			if(errorMessage===true || isConfirmationError===true){
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
		setConfirmedPassword('')
		setRegisterError(false)
		setUsernameError(false)
		setPasswordError(false)
	},[isLogin])
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}
  	return (
		<div className={css.loginWrapper}>
			<div className={css.loginContainer}>
				<section className={css.auth}>
					<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
					<form onSubmit={submitHandler}>
						<div className={css.control}>
							<div style={{color:'red'}}> {isUsernameError ? [errorMessage] : ''}</div>
							<label htmlFor='username'>Username</label>
							<input type='text' name='username' required value={credentials.username} onChange={handleChange} maxLength='50' />
						</div>
						<div className={css.control}>
							<label htmlFor='password'>Password</label>
							<input type='password' name='password' required value={credentials.password} onChange={handleChange} />
						</div>
						<div className={css.control} style={ {display:isLogin ? 'none': 'block'}}>
							<div style={{color:'red'}}> {isConfirmationError ? 'Password does not match' : ''}</div>
							<label htmlFor='password'>Confirm Password</label>
							<input type='password' name='confirmPassword' value={confirmPassword} onChange={handleConfirmation}/>
						</div>
						<div className={css.control} style={ {display:isLogin ? 'none': 'block', textDecoration:'none', textAlign:'left', fontSize:'.9rem'}}>
							By clicking Sign up, you agree to our Terms and Privacy Policy. 
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
