import React, { useState } from 'react';
import './RegisterPage.css';
import { urlConfig } from '../../config'; // Task 1
import { useAppContext } from '../../context/AuthContext'; // Task 2
import { useNavigate } from 'react-router-dom'; // Task 3

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // Task 4

    const navigate = useNavigate(); // Task 5
    const { setIsLoggedIn } = useAppContext(); // Task 5

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6
                headers: {
                    'content-type': 'application/json', // Task 7
                },
                body: JSON.stringify({ // Task 8
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const json = await response.json(); // Step 2 - Task 1
            console.log('json data', json);

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken); // Step 2 - Task 2
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                setIsLoggedIn(true); // Step 2 - Task 3
                navigate('/app'); // Step 2 - Task 4
            }

            if (json.error) {
                setShowerr(json.error); // Step 2 - Task 5
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        <div className="mb-4">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Step 2 - Task 6 */}
                            <div className="text-danger">{showerr}</div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>
                            Register
                        </button>

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
