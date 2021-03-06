import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class CreateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            subjects: [],
            username: '',
            multipleSubject: [],
            subject: '',
            description: '',
            file: null,
            date: new Date(),
            imageID: ''
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmitImage = this.onSubmitImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('/api/users')
            .then(res => this.setState({ users: res.data, username: res.data[0].username }))

        axios.get('/api/dashboard/subjects', header)
            .then(res => this.setState({ subjects: res.data }))
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value })
    }

    onChangeSubject(e) {
      this.setState({ subject: e.target.value })
    }

    onChangeDescription(e) {
      this.setState({ description: e.target.value})
    }

    onChangeDate(date) {
        this.setState({ date })
    }

    onChangeImage(e){
      this.setState({ file: e.target.files[0] })
    }

    onSubmitImage(e){
      e.preventDefault();

      const image = new FormData();
      image.append('file', this.state.file);

      axios.post('/api/dashboard/img_data', image, header)
        .then(res => this.setState({ imageID: res.data.new_img }))

      document.getElementById('imageSubmitted').innerHTML = "Photo has been submitted"
    }

    onSubmit(e) {
        e.preventDefault();

        const detail = {
          username: this.state.username,
          subject: this.state.subject,
          description: this.state.description,
          image: this.state.imageID,
          date: this.state.date
        };

        axios.post('/api/dashboard/details/add/', detail, header)
            .then(res => console.log(res.data))

        window.location = '/admin/dashboard';
    }

    render() {
        const filteredSubject = this.state.subjects.filter((user) => 
          user.username === this.state.username)

        return (
            <div className='container'>
            <h3>Create New Detail</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Username: </label>
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
                <select
                    required
                    className="form-control"
                    value={this.state.subject}
                    onChange={this.onChangeSubject}>
                    <option></option>
                    {filteredSubject
                    .map((user) => {
                        return (
                          <option
                            key={user.subject}
                            value={user.subject}>{user.subject}
                          </option>
                        )
                    })}
                </select>
              </div>
              <div className="form-group"> 
                <label>Image: </label>
                <br />
                <input type="file" name="myImage" onChange= {this.onChangeImage} />
                <button onClick={this.onSubmitImage}>Confirm Image</button>
                <div>
                  <label id="imageSubmitted" style={{color: "green"}}></label>
                </div>
              </div>
              <div className="form-group">
                <label>Date: </label>
                <div>
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.onChangeDate}
                  />
                </div>
              </div>
              <div className="form-group"> 
                <label>Description: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    />
              </div>
              <div className="form-group">
                <input type="submit" value="Add Detail" className="btn btn-primary" />
              </div>
            </form>
          </div>
        )
    }
    
}