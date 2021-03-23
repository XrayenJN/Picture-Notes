import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

var token = localStorage.getItem('token');

export default class CreateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            description: '',
            file: null,
            date: new Date(),
            imageID: '',
            newImage: false,
            newImageID: '',
        }
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmitImage = this.onSubmitImage.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
      axios.get('http://localhost:5000/dashboard/details/' + this.props.match.params.id, {
        headers: {
          "auth-token": token 
        }
      })
        .then(res => {
          console.log(res.data)
          this.setState({
            id: res.data._id,
            description: res.data.description,
            date: new Date(res.data.date),
            imageID: res.data.image,
            newImageID: res.data.image
          })
        })
    }

    changeImage(e){
      e.preventDefault();
      alert('Once you click \'Confirm Image\', you can\'t get back the previous image!');
      this.setState({ newImage: true })
      console.log(this.state.imageID);
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

      if(this.state.imageID)
        axios.delete('http://localhost:5000/img_data/' + this.state.imageID)
          .then(res => console.log(res))

      const image = new FormData();
      image.append('file', this.state.file);

      axios.post('http://localhost:5000/img_data', image)
        .then(res => {
          console.log(res.data.new_img)
          this.setState({ newImageID: res.data.new_img })
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const detail = {
          username: localStorage.getItem('username'),
          subject: localStorage.getItem('subject'),
          description: this.state.description,
          image: this.state.newImageID,
          date: this.state.date
        };

        axios.post('http://localhost:5000/dashboard/details/update/' + this.state.id, detail, {
          headers: {
            "auth-token": token 
          }
        })
            .then(res => console.log(res.data))

        localStorage.removeItem('subject');
        window.location = '/dashboard';
    }

    render() {
        const username = localStorage.getItem('username')
        const subject = localStorage.getItem('subject');
        const changeImage = (this.state.newImage)
          ? <div className="form-group"> 
              <label>Image: </label>
              <br />
              <input type="file" name="myImage" onChange= {this.onChangeImage} />
              <button onClick={this.onSubmitImage}>Confirm Image</button>
            </div>
          : <div className="form-group"> 
              <label>Image</label>
              <div>Do you want to change the Image?</div>
              <button onClick={this.changeImage}>Yes</button>
            </div>
        return (
            <div className='container'>
            <h3>Create New Detail</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <label>Username: </label>
                <h5>{username}</h5>
              </div>
              <br />
              <div className="form-group"> 
                <label>Subject: </label>
                <h5>{subject}</h5>
              </div>
              <br />
              {changeImage}
              <br />
              <div className="form-group">
                <label>Date: </label>
                <div>
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.onChangeDate}
                  />
                </div>
              </div>
              <br />
              <div className="form-group"> 
                <label>Description: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    />
              </div>
              <br />
              <div className="form-group">
                <input type="submit" value="Add Detail" className="btn btn-primary" />
              </div>
            </form>
          </div>
        )
    }
    
}