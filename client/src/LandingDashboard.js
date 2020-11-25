// This code is written by Samuel Ratford in its entirety

import React from "react";
import "./App.css";
import ExtensionsDashboard from "./ExtensionsDashboard";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
// var socket = io.connect("http://192.168.1.193:4000");
// socket.emit("createRoom", this.props.roomID);


export default class LandingDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomID: "",
    };
  }

  createRoom = (e) => {
    e.preventDefault();

    if (document.getElementById("createRoomInput").value === "") {
      alert("Field cannot be blank");
    } else {
      // console.log(document.getElementById("createRoomInput").value)
      this.props.webSocket.emit("createRoom", document.getElementById("createRoomInput").value);
    }
  };



  joinRoom = (e) => {
    e.preventDefault();
    if (document.getElementById("joinRoomInput").value === "") {
      alert("Field cannot be blank");
    } else {
      this.props.webSocket.emit("joinRoom", document.getElementById("joinRoomInput").value);


    }
  };

  componentDidMount() {
    let overviewSelectorH2 = document.getElementById("overviewSelectorH2");
    overviewSelectorH2.style.backgroundColor = "#3a5fe7";
    overviewSelectorH2.style.color = "#f6f6f6";

    this.props.webSocket.on("createdRoom", (resp) => {
      if (resp) {
        this.setRoomID(true);
      } else {
        alert("Room already exists");
      }
    })

    this.props.webSocket.on("joinedRoom", (resp) => {
      if (resp) {
        this.setRoomID(false);
      } else {
        alert("Room does not exist");
      }
    })
  }


  setRoomID = (creatorBool) => {
    if (creatorBool) {
      var room_id = document.getElementById("createRoomInput").value;
      this.setState({
        roomID: room_id,
      });
      this.props.getRoomId({
        roomID: room_id,
        creator: creatorBool,
      });
    } else {
      var room_id = document.getElementById("joinRoomInput").value;
      this.setState({ roomID: room_id });
      this.props.getRoomId({
        roomID: room_id,
        creator: false,
      });
    }

  }

  displayExtensions = (e) => {
    e.preventDefault();
    let extensionPage = document.getElementById("extensionPage");
    let overviewPage = document.getElementById("overviewPage");
    let overviewSelectorH2 = document.getElementById("overviewSelectorH2");
    let extensionsSelectorH2 = document.getElementById("extensionsSelectorH2");
    extensionsSelectorH2.style.backgroundColor = "#3a5fe7";
    extensionsSelectorH2.style.color = "#f6f6f6";
    overviewSelectorH2.style.backgroundColor = "transparent";
    overviewSelectorH2.style.color = "#000";
    overviewPage.style.display = "none";
    extensionPage.style.display = "block";
  }

  displayOverview = (e) => {
    e.preventDefault();
    let extensionPage = document.getElementById("extensionPage");
    let overviewPage = document.getElementById("overviewPage");
    let overviewSelectorH2 = document.getElementById("overviewSelectorH2");
    let extensionsSelectorH2 = document.getElementById("extensionsSelectorH2");
    overviewSelectorH2.style.backgroundColor = "#3a5fe7";
    overviewSelectorH2.style.color = "#f6f6f6";
    extensionsSelectorH2.style.backgroundColor = "transparent";
    extensionsSelectorH2.style.color = "#000";
    extensionPage.style.display = "none";
    overviewPage.style.display = "block";
  }

  render() {
    return this.state.roomID === "" ? (
      <div className="landingDashboard">
        <div className="leftMenu">
          <h2 className="huddleIcon">Huddle</h2>
          <h3 className="huddleIconDesc">Remote Collaboration</h3>
          <ul className="menuItems">

            <li id="overviewSelector" onClick={this.displayOverview} className="menuItem">
              <h2 id="overviewSelectorH2">Overview</h2>
            </li>

            <li id="extensionsSelector" onClick={this.displayExtensions} className="menuItem">
              <h2 id="extensionsSelectorH2">Extensions</h2>
            </li>

            <div className="bottomMenuSelection"></div>
          </ul>
        </div>
        <div className="landingDashboardContent">
          <div id="overviewPage" className="overviewPage">
            <div className="createRoom">
              <input type="text" id="createRoomInput" name="createRoomInput" />
              <br />
              <button id="createRoomButton" onClick={this.createRoom}>Create Room</button>
            </div>
            <div className="joinRoom">
              <input type="text" id="joinRoomInput" name="joinRoomInput" />
              <br />
              <button id="joinRoomButton" onClick={this.joinRoom}>Join Room</button>
            </div>
          </div>
          <div id="extensionPage" className="extensionPage">
            <ExtensionsDashboard />
          </div>
        </div>
      </div>
    ) : (
        <Redirect to="/dashboard" />
      );
  }
}
