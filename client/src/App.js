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
import AdminLogin from "./components/admin-login.component";
import AdminDashboard from "./components/admin-dashboard.component";
import AdminEditDetail from "./components/admin-edit-detail.component";
import AdminCreateUser from "./components/admin-create-user.component";
import AdminCreateSubject from "./components/admin-create-subject.component";
import AdminCreateDetail from "./components/admin-create-detail.component";

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
        <Route path="/admin" exact component={AdminLogin} />
        <Route path="/admin/dashboard" exact component={AdminDashboard} />
        <Route path="/admin/dashboard/detail/edit/:id" component={AdminEditDetail} />
        <Route path="/admin/user/add" component={AdminCreateUser} />
        <Route path="/admin/subject/add" component={AdminCreateSubject} />
        <Route path="/admin/detail/add" component={AdminCreateDetail} />
      </div>
    </Router>
  );
}

export default App;
