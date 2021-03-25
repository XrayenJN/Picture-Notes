import React, { Component } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            username: '',
            email: "",
            password: "",
            pass: false,
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users')
            .then(res => {
                const users = res.data
                this.setState({ users })
            })
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value})
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value })
        const emails = this.state.users.map(user => user.email);
        if(emails.includes(e.target.value)){
            this.setState({ pass: false })
            document.getElementById('email').innerHTML = " × "
        }
        else {
            this.setState({ pass: true })
            document.getElementById('email').innerHTML = "";
        }
    }

    onChangePassword(e) {
      this.setState({ password: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.state.pass) {
            const newSubject = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            };

            axios.post('http://localhost:5000/users/add', newSubject, header)
                .then(res => console.log(res.data))

            window.location = '/';

        } else {
            document.getElementById('submit').innerHTML = "Email has been taken."
        }
    }

    render() {
        return (
            <div className='container'>
            <h3>Create New User</h3>
            <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
                <label>Username: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    />
              </div>
              <div className="form-group"> 
                <label>Email: </label><a id="email" style={{color: "red"}}></a>
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
                <input type="submit" value="Create New User" className="btn btn-primary" />
                <p id="submit" style={{color: "red"}}></p>
              </div>
            </form>
          </div>
        )
    }
    
}