import React, { Component } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class CreateSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: '',
        }
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeSubject(e) {
        this.setState({ subject: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault();

        const newSubject = {
            username: localStorage.getItem('username'),
            subject: this.state.subject,
        };

        axios.post('http://localhost:5000/dashboard/subjects/add', newSubject, header)
            .then(res => console.log(res.data))

        window.location = '/dashboard';
    }

    render() {
        const username = localStorage.getItem('username')
        return (
            <div className='container'>
            <h3>Create New Subject</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Username: </label>
                <br/> 
                <h5>{username}</h5>
              </div>
              <div className="form-group"> 
                <label>Subject: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.description}
                    onChange={this.onChangeSubject}
                    />
              </div>
              <div className="form-group">
                <input type="submit" value="Create New Subject" className="btn btn-primary" />
              </div>
            </form>
          </div>
        )
    }
    
}