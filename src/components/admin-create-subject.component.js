import React, { Component } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class AdminCreateSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            username: '',
            subject: '',
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        axios.get('/api/users')
            .then(res => this.setState({ users: res.data, username: res.data[0].username }))
    }

    onChangeUsername(e){
        this.setState({ username: e.target.value })
    }

    onChangeSubject(e) {
        this.setState({ subject: e.target.value})
    }

    onSubmit(e) {
        e.preventDefault();

        const newSubject = {
            username: this.state.username,
            subject: this.state.subject,
        };

        axios.post('/api/dashboard/subjects/add', newSubject, header)
            .then(res => console.log(res.data))

        window.location = '/admin/dashboard';
    }

    render() {
        return (
            <div className='container'>
            <h3>Create New Subject</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Username: </label>
                <br/> 
                <select
                    required
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername}>
                    {this.state.users.map((user) => {
                        return <option
                            key={user.username}
                            value={user.username}>{user.username}
                            </option>
                    })
                    }
                </select>
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