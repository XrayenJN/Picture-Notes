import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class EditDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            description: '',
            file: null,
            date: new Date(),
            oldImageID: '',
            newImage: false,
            newImageID: '',
            photos: []
        }
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmitImage = this.onSubmitImage.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
      axios.get('/api/dashboard/details/' + this.props.match.params.id, header)
        .then(res => {
          this.setState({
            id: res.data._id,
            description: res.data.description,
            date: new Date(res.data.date),
            oldImageID: res.data.image,
            newImageID: res.data.image
          })
        })

      axios.get('/api/dashboard/img_data', header)
        .then(res => this.setState({ photos: res.data }))
    }

    changeImage(e){
      e.preventDefault();
      alert('Once you click \'Confirm Image\', you can\'t get back the previous image!');
      this.setState({ newImage: true })
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

      if(this.state.oldImageID)
        axios.delete('/api/dashboard/img_data/' + this.state.oldImageID, header)
          .then(res => console.log(res))

      const image = new FormData();
      image.append('file', this.state.file);

      axios.post('/api/dashboard/img_data', image, header)
        .then(res => {
          console.log(res.data.new_img)
          this.setState({ newImageID: res.data.new_img })
        })

      document.getElementById('imageSubmitted').innerHTML = "Photo has been submitted"
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

        axios.post('/api/dashboard/details/update/' + this.state.id, detail, header)
            .then(res => console.log(res.data))

        localStorage.removeItem('subject');
        window.location = '/dashboard';
    }

    render() {
        const username = localStorage.getItem('username')
        const subject = localStorage.getItem('subject');

        function arrayBufferToBase64(buffer) {
          var binary = '';
          var bytes = [].slice.call(new Uint8Array(buffer));
          bytes.forEach((b) => binary += String.fromCharCode(b));
          return window.btoa(binary);
        };

        try{
          const image = this.state.photos.filter(img => img._id === this.state.oldImageID)
          const base64Flag = 'data:image/jpeg;base64,';
          const imageStr = arrayBufferToBase64(image[0].img.data.data)
          var actualImage = base64Flag + imageStr
        }
        catch{
            actualImage = '';
        }

        const changeImage = (this.state.newImage)
          ? <div className="form-group"> 
              <label>Image: </label>
              <br />
              <input type="file" name="myImage" onChange= {this.onChangeImage} />
              <button onClick={this.onSubmitImage}>Confirm Image</button>
              <div>
                <label id="imageSubmitted" style={{color: "green"}}></label>
              </div>
            </div>
          : <div className="form-group"> 
              <label>Image</label>
              <a className="lightbox" href={`#${actualImage}`}>
                <img src={actualImage}/>
              </a> 
              <div className="lightbox-target" id={actualImage}>
                <img src={actualImage}/>
                <a className="lightbox-close" href="#" />
              </div>
              <div>Do you want to change the Image?</div>
              <button onClick={this.changeImage}>Yes</button>
            </div>
        return (
          <div className='container'>
            <h3>Update Detail</h3>
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
                <input type="submit" value="Update Detail" className="btn btn-primary" />
              </div>
            </form>
          </div>
        )
    }
    
}