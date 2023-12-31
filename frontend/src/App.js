import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // <-- Import useNavigate
import TaskList from './components/TaskList';
import Login from './components/Login';
import SignUp from './components/Signup';
import Layout from './components/Layout';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/login'; // Redirect to login page after logout
    };
    

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/tasks" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/tasks" element={isLoggedIn ? <TaskList /> : <Navigate to="/login" />} />
                    {/* Default redirection to login or tasks based on authentication status */}
                    <Route path="/" element={isLoggedIn ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
                </Routes>
                {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
            </Layout>
        </Router>
    );
}

export default App;
