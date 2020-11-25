// This code is written by Samuel Ratford in its entirety

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import DashBoard from "./DashBoard";
import LandingDashboard from "./LandingDashboard";
import ExtensionsDashboard from "./ExtensionsDashboard";
import "./App.css";
import io from "socket.io-client";
var socket = io.connect("http://192.168.1.193:4000");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: "",
      password: "",
      roomID: "",
      creator: 'null',
      canJoinRoom: false
    };
  }

  // Code that receives the users data
  getUserData = (e) => {
    this.setState({
      loggedIn: true,
      username: e.username,
      password: e.password,
    });
  };

  // Code that gets the room ID
  getRoomId = (e) => {
    if (e.creator !== null) {
      this.setState({
        roomID: e.roomID,
        creator: e.creator,
        canJoinRoom: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            {/* The following code will determine which page is shown */}
            <Switch>
              <Route exact path="/">
                {this.state.loggedIn ? <Redirect to="/landingDashboard" /> : <LoginPage getUserData={this.getUserData} />}
              </Route>
              <Route path="/dashboard">
                {(this.state.loggedIn && this.state.canJoinRoom) ? (
                  <DashBoard
                    username={this.state.username}
                    password={this.state.password}
                    roomID={this.state.roomID}
                    creator={this.state.creator}
                    webSocket={socket}
                  />
                ) : (
                    this.state.loggedIn ?
                      <h1>spacer</h1> :
                      <Redirect to="/" />
                  )}
              </Route>
              <Route path="/landingDashboard">
                {this.state.loggedIn ? (
                  <LandingDashboard webSocket={socket} getRoomId={this.getRoomId} />
                ) : (
                    <Redirect to="/" />
                  )}
              </Route>
              <Route path="/extensionsDashboard">
                {this.state.loggedIn ? (
                  <ExtensionsDashboard />
                ) : (
                    <Redirect to="/" />
                  )}
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
