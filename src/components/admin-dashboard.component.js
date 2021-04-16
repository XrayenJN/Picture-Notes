
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

        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        axios.get('/api/users')
            .then(res => {
                this.setState({ users: res.data })
            })

        axios.get('/api/dashboard/subjects', header)
          .then(res => {
              this.setState({ subjects: res.data })
          })

        axios.get('/api/dashboard/details', header)
            .then(res => {
                this.setState({ details: res.data })
            })

        axios.get('/api/dashboard/img_data', header)
            .then(res => {
                console.log(res.data)
                this.setState({ photos: res.data })
            })
    }

    deleteDetail(e, id, imgID) {
        e.preventDefault();

        // axios.delete('/dashboard/details/' + id, header)
        //     .then(res => console.log(res.data))

        // axios.delete('/dashboard/img_data/' + imgID, header)
        //     .then(res => console.log(res.data));

        console.log(id, imgID)

        // this.setState({ 
        //     details: this.state.details.filter(each => each._id !== id),
        //     photos: this.state.photos.filter(each => each._id !== imgID)
        // })
    }

    updateState(detailID, imgID) {
        this.setState({ 
            details: this.state.details.filter(each => each._id !== detailID),
            photos: this.state.photos.filter(each => each._id !== imgID)
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

        function deleteDetail(e, id, imgID) {
            e.preventDefault();

            axios.delete('/dashboard/details/' + id, header)
                .then(res => console.log(res.data))

            axios.delete('/dashboard/img_data/' + imgID, header)
                .then(res => console.log(res.data));

            alert("Detail has been deleted. Please refresh to update the dashboard.")
            document.getElementById('info').innerHTML = "x";
        }

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
                                <Link to={"/admin/dashboard/detail/edit/"+detail._id}>edit</Link> 
                                |
                                <a href="/admin/dashboard" onClick={(e) => deleteDetail(e, detail._id, imageID )}>delete</a>  <a id="info"></a>
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
                <div style={{textAlign:"center"}}>
                    <Link to={"/admin/user/add"}>+User</Link>
                    <Link to={"/admin/subject/add"}>+Subject</Link>
                    <Link to={"/admin/detail/add"}>+Detail</Link>
                </div>
                {user}
            </div>
        )
    }
}