import React, { Component } from 'react';
import axios from 'axios';
import "../App.css"

export default class LoginUser extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            users: [],
            pass: false,
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        axios.get("/api/users")
            .then(res => {
                const users = res.data
                this.setState({ users })
            })
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })

        const emails = this.state.users.map(user => user.email)
        if (emails.includes(e.target.value))
            this.setState({ pass: true })
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()

        if(this.state.pass){
            const User = {
                email: this.state.email,
                password: this.state.password
            }
    
            axios.get('/api/users')
            .then(res => {
                const user = res.data.filter(user => user.email === this.state.email)
                localStorage.setItem('username', user[0].username)
            })
    
            axios.post('/api/users/login', User)
                .then(res => {
                    localStorage.setItem("token", res.data.token)
                    window.location = '/dashboard'
                })
                .catch(err => {
                    document.getElementById("submit").innerHTML = "Password is wrong."
                })
        }
        else {
            document.getElementById('submit').innerHTML = "Email is wrong";
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <h3>Login</h3>
                <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                    <label>Email: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        />
                </div>
                <div className="form-group"> 
                    <label>Password: </label>
                    <input  type="password"
                        required
                        className="form-control"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        />
                </div>
                <div className="form-group">
                    <input type="submit" value="Login" className="btn btn-primary" />
                    <p id="submit" style={{color: "red"}}></p>
                </div>
                </form>
            </div>
        )
    }
}