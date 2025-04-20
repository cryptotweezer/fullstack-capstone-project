import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config'; // Task 1
import { useAppContext } from '../../context/AuthContext'; // Task 2
import { useNavigate } from 'react-router-dom'; // Task 3

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(''); // Task 4

    const navigate = useNavigate(); // Task 5
    const bearerToken = sessionStorage.getItem('bearer-token'); // Task 5
    const { setIsLoggedIn } = useAppContext(); // Task 5

    // Task 6 - Redirect if already logged in
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST', // Task 7
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '' // Task 8
                },
                body: JSON.stringify({ email, password }) // Task 9
            });

            const json = await res.json(); // Step 2 - Task 1
            console.log("Login response:", json);

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken); // Task 2
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                setIsLoggedIn(true); // Task 3
                navigate('/app'); // Task 4
            } else {
                // Task 5
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setIncorrect("Wrong password. Try again.");
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }

        } catch (e) {
            console.log("Error fetching login: " + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setIncorrect(""); }}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setIncorrect(""); }}
                            />
                            {/* Task 6 - Error message */}
                            <span style={{
                                color: 'red',
                                height: '.5cm',
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '12px'
                            }}>{incorrect}</span>
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
