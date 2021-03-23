import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout(e){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('subject');

    window.location = '/';
  }

  render() {
    const username = localStorage.getItem('username');
    var login_logout;
    var createUser;
    if (localStorage.getItem('token')) {
      login_logout = "Logout"
      createUser = ''
    }
    else {
      login_logout = "Login"
      createUser = 'Sign up'
    }
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand" onClick={this.logout}>{login_logout}</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {
          (createUser === '')
            ? <li className="navbar-item">
                <h6>Welcome back, {username}</h6>
              </li>
            : <li className="navbar-item">
                <Link to="/user/create" className="nav-link">{createUser}</Link>
              </li>
          }
          <li className="navbar-item">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}