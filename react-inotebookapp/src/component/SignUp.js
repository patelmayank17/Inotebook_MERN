import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = (props) => {
    const host = "http://localhost:5000";
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        console.log(data)

        if (data.success) {
            localStorage.setItem('token', data.authtoken);
            history("/home");
            props.showAlert("Account created successfully :)", "success");
        } else {
            props.showAlert("Invalid credentials :(", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='mx-auto'>
            <div className="col-12">
                <h1>SignUp to create an Account with iNotebook :)</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 col-sm-6">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="email" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
                </div>
                <div className="mb-3 col-sm-6">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3 col-sm-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3 col-sm-6">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default SignUp;
