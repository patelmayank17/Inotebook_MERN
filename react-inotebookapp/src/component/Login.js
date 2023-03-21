import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const host = "http://localhost:5000";
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let history = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const data = await response.json();
        console.log(data)

        if (data.success) {
            localStorage.setItem('token', data.authtoken);
            history("/home");
            props.showAlert("Logged in successfully :)", "success");
        }
        else {
            props.showAlert("Invalid credentials :(", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='mx-auto'>
            <div className='col-12'>
                <h1>Login to continue to iNotebook</h1>
            </div>
            <form onSubmit={handleSubmit} className='col-12 my-3' >
                <div className="mb-2 col-sm-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-2 col-sm-6">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} />
                </div>
                <div className='col-sm-6'>
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Login;