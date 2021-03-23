
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const token = localStorage.getItem('token');

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjects: [],
            subjectClicked: '',
            details: [],
            sorted: false,
            photo: [],
        };

        this.subjectClicked = this.subjectClicked.bind(this)
        this.sort = this.sort.bind(this);
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    subjectClicked(e) {
        this.setState({subjectClicked: e.target.innerText})
        localStorage.setItem("subject", e.target.innerText)
    }

    deleteDetail(e, id, imgID) {
        e.preventDefault();

        axios.delete('http://localhost:5000/dashboard/details/' + id, {
            headers: {
              "auth-token": token 
            }
          })
            .then(res => console.log(res.data))

        axios.delete('http://localhost:5000/img_data/' + imgID)
            .then(res => console.log(res.data));

        this.setState({
            details: this.state.details.filter(each => each._id !== id),
            photo: this.state.photo.filter(each => each._id !== imgID)
        })
    }

    sort(e){
        const sorted = this.state.details.sort((first, second) => {
            if (this.state.sorted === true) {
                if (first.date > second.date) return 1
                    return -1
            } else {if (first.date > second.date) return -1
                    return 1
            }
        })
        this.setState({ details: sorted, sorted: !this.state.sorted });
    }

    componentDidMount() {
        axios.get('http://localhost:5000/dashboard/subjects', {
          headers: {
            "auth-token": token 
          }
        })
          .then(response => {
            const subjects = response.data.filter(each => 
                each.username === localStorage.getItem('username')
            )
            const subject = subjects.map(each => each.subject)
            this.setState({ subjects: subject})
          })
          .catch((error) => {
            console.log(error);
          })

        axios.get('http://localhost:5000/dashboard/details', {
            headers: {
                "auth-token":token
            }
        })
            .then(res => {
                this.setState({ details: res.data })
            })

        axios.get('http://localhost:5000/img_data')
            .then(res => {
                console.log(res.data);
                const photos = res.data;
                this.setState({ photos })
            })
    }

    render() {
        const subjects = this.state.subjects
        const listSubjects = subjects.map(subject => 
            <tr key={subject} onClick={this.subjectClicked}>
                <th>{subject}</th>
            </tr>
            )

        var details = this.state.details
        var sortedDetails = details.filter(each => 
            each.username === localStorage.getItem('username')
            && each.subject === this.state.subjectClicked
            );

        var number = 0;
        var listDetails = sortedDetails.map(detail => {
            try {
                const photos = this.state.photos
                var imageID = detail.image
                const image = photos.filter(each => each._id === imageID)
                const base64Flag = 'data:image/jpeg;base64,';
                const imageStr = this.arrayBufferToBase64(image[0].img.data.data)
                var actualImage = base64Flag + imageStr
            }
            catch{
                var actualImage = '';
            }
            number++;
            return(
                <tr key={detail.description}>
                    <td>{number}</td>
                    <td>{detail.date.substring(0,10)}</td>
                    <td>{detail.description}</td>
                    <td>
                    <a className="lightbox" href={`#${actualImage}`}>
                        <img src={actualImage}/>
                    </a> 
                    <div className="lightbox-target" id={actualImage}>
                        <img src={actualImage}/>
                        <a className="lightbox-close" href="#" />
                    </div>
                    </td>
                    <td>
                        <Link to={"/detail/edit/"+detail._id}>edit</Link> | <a href="/dashboard" onClick={(e) => this.deleteDetail(e, detail._id, imageID)}>delete</a>
                    </td>
                </tr>
            )
        })
        return (
            <div className='container-fluid'>
                <div>
                    <div className="row">
                        <div className="col-xs">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Subject</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listSubjects}
                                    <tr>
                                        <th><Link to="/subject/add" className="nav-link">+Subject</Link></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col">
                            <h1>{this.state.subjectClicked}</h1>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>No.</th>
                                        <th scope='col'>Date<button onClick={(e) => this.sort(e)}>↑↓</button></th>
                                        <th scope='col'>Description</th>
                                        <th scope='col'>Image</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listDetails}
                                    <tr>
                                        <th><Link to="/detail/add" className="nav-link">+Detail</Link></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}