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
            description: '',
            file: null,
            date: new Date(),
            imageID: ''
        }
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmitImage = this.onSubmitImage.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

      axios.post('http://localhost:5000/dashboard/img_data', image, header)
        .then(res => this.setState({ imageID: res.data.new_img }))
    }

    onSubmit(e) {
        e.preventDefault();

        const detail = {
          username: localStorage.getItem('username'),
          subject: localStorage.getItem('subject'),
          description: this.state.description,
          image: this.state.imageID,
          date: this.state.date
        };

        axios.post('http://localhost:5000/dashboard/details/add/', detail, header)
            .then(res => console.log(res.data))

        localStorage.removeItem('subject');
        window.location = '/dashboard';
    }

    render() {
        const username = localStorage.getItem('username')
        const subject = localStorage.getItem('subject');
        return (
            <div className='container'>
            <h3>Create New Detail</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Username: </label>
                <h5>{username}</h5>
              </div>
              <div className="form-group"> 
                <label>Subject: </label>
                <h5>{subject}</h5>
              </div>
              <div className="form-group"> 
                <label>Image: </label>
                <br />
                <input type="file" name="myImage" onChange= {this.onChangeImage} />
                <button onClick={this.onSubmitImage}>Confirm Image</button>
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