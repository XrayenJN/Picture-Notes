
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const token = localStorage.getItem('token');
const header = { headers: {'auth-token': token} }

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            subjects: [],
            details: [],
            photos: []
        };

        // this.subjectClicked = this.subjectClicked.bind(this)
        // this.sort = this.sort.bind(this);
    }

    // deleteDetail(e, id, imgID) {
    //     e.preventDefault();

    //     axios.delete('http://localhost:5000/dashboard/details/' + id, {
    //         headers: {
    //           "auth-token": token 
    //         }
    //       })
    //         .then(res => console.log(res.data))

    //     axios.delete('http://localhost:5000/img_data/' + imgID)
    //         .then(res => console.log(res.data));

    //     this.setState({
    //         details: this.state.details.filter(each => each._id !== id),
    //         photo: this.state.photo.filter(each => each._id !== imgID)
    //     })
    // }

    // sort(e){
    //     const sorted = this.state.details.sort((first, second) => {
    //         if (this.state.sorted === true) {
    //             if (first.date > second.date) return 1
    //                 return -1
    //         } else {if (first.date > second.date) return -1
    //                 return 1
    //         }
    //     })
    //     this.setState({ details: sorted, sorted: !this.state.sorted });
    // }

    componentDidMount() {
        axios.get('http://localhost:5000/users')
            .then(res => {
                this.setState({ users: res.data })
            })

        axios.get('http://localhost:5000/dashboard/subjects', header)
          .then(res => {
              this.setState({ subjects: res.data })
          })

        axios.get('http://localhost:5000/dashboard/details', header)
            .then(res => {
                this.setState({ details: res.data })
            })

        axios.get('http://localhost:5000/dashboard/img_data', header)
            .then(res => {
                this.setState({ photos: res.data })
            })
    }

    render() {
        const users = this.state.users;
        const subjects = this.state.subjects;
        const details = this.state.details;
        const photos = this.state.photos;

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = [].slice.call(new Uint8Array(buffer));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            return window.btoa(binary);
        };

        function Detail(props) {
            const detail =
            details
                .filter( detail => 
                    detail.username === props.user 
                    && detail.subject === props.subject
                )
                .map( detail => {
                    try{
                        var imageID = detail.image
                        const image = photos.filter(img => img._id === imageID)
                        const base64Flag = 'data:image/jpeg;base64,';
                        const imageStr = arrayBufferToBase64(image[0].img.data.data)
                        var actualImage = base64Flag + imageStr
                    }
                    catch{
                        actualImage = '';
                    }
                    return(
                        <tr key={detail._id}>
                            <td className="w-25 p-3">{detail.description}</td>
                            <td className="w-25 p-3">{detail.date.substring(0,10)}</td>
                            <td className="w-25 p-3">
                                <a className="lightbox" href={`#${actualImage}`}>
                                    <img src={actualImage}/>
                                </a> 
                                <div className="lightbox-target" id={actualImage}>
                                    <img src={actualImage}/>
                                    <a className="lightbox-close" href="#" />
                                </div>
                            </td>
                            <td className="w-25 p-3">
                                <Link to={"/#"+detail._id}>edit</Link> | <a href="/#" onClick={(e) => this.deleteDetail(e, detail._id, imageID)}>delete</a>
                            </td>
                        </tr>
                    )
                })
            return(detail)
        }

        function Subject(props) {
            const subject = 
            subjects
                .filter( subject => subject.username === props.user)
                .map( subject =>
                    <div key={subject._id}>
                        <h5 >{subject.subject}</h5>
                        <table className="table">
                            <tbody>
                                <Detail user={props.user} subject={subject.subject} />
                            </tbody>
                        </table>
                        <br />
                    </div>
                    )
            return(subject)
        }

        const user = users.map(user => 
            <div key={user.username}>
                <h1 >{user.username}</h1>
                <Subject user={user.username} />
                <br />
            </div>
            )

        return (
            <div>
                {user}
            </div>
        )
    }
}