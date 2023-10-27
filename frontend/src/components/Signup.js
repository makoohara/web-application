import React, { useState } from 'react';
import axios from '../AxiosConfig.js';

function SignUp({ onSignUpSuccess, switchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = () => {
        console.log("handleSignUp function executed");
        axios.post('/register', { username, password })
            .then(response => {
                onSignUpSuccess(); // If you have some logic to execute on successful signup, this function will execute it.
                alert('Signup successful! Please login with your new account.');
                switchToLogin(); // Switch the user to the login page.
            })
            .catch(error => {
                setErrorMessage('Error signing up. Please try again.');
            });
            console.log("Username:", username);
            console.log("Password:", password);
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={handleSignUp}>Sign Up</button>
            <p>Already have an account? <button onClick={switchToLogin}>Log In</button></p>
        </div>
    );
}

export default SignUp;
