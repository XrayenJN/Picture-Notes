import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import Navbar from "./components/navbar.component";
import HomePage from "./components/homepage.component";
import CreateUser from "./components/create-user.component";
import Dashboard from "./components/dashboard.component";
import CreateSubject from "./components/create-subject.component";
import CreateDetail from "./components/create-detail.component";
import EditDetail from "./components/update-detail.component";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <Navbar />
        <br/>
        <Route path="/" exact component={HomePage} />
        <Route path="/user/create" component={CreateUser} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/subject/add" component={CreateSubject} />
        <Route path="/detail/add" component={CreateDetail} />
        <Route path="/detail/edit/:id" component={EditDetail} />
      </div>
    </Router>
  );
}

export default App;
