import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser } from "./actions/authActions";
import { logoutUser } from "./actions/authActions";

import PrivateRoute from "./components/common/PrivateRoute";

import SignUp from "./components/Landing/SignUp";
import Login from "./components/Landing/Login";
import Masterframe from "./components/Pages/Masterframe";
import Forum from "./components/Pages/posts/Forum";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";

import Topnav from "./components/Navigation/Topnav";
import Sidenav from "./components/Navigation/Sidenav";
import News from "./components/News/News";
import File from "./components/common/FileUpload";

import "./App.css";
import "./SUstyle.css";
import { clearCurrentProfile } from "./actions/profileActions";
import Post from "./components/Pages/post/Post";

//check for token
if (localStorage.jwtToken) {
  //set auth  token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    //clear current Profile
    store.dispatch(clearCurrentProfile());
    //Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Landing} />
            <Route exact path="/files" component={File} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/masterframe" component={Masterframe} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/forum" component={Forum} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/newsfeed" component={News} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
