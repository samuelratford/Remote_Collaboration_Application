// This code is written by Samuel Ratford in its entirety

import React from "react";
import axios from "axios";
import MainContainer from "./MainContainer";
import extensionIcon from "./images/extensionIcon.png";
// import greenTickIcon from "./images/grenTickIcon.png";
import usersIcon from "./images/usersIcon.png";
import userPicture from "./images/usersIcon.png";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extensions: [],
      currentKey: 0,
      liveUsers: [{ id: this.props.webSocket.id, username: this.props.username }],
      extensionsAvailable: [

      ],
      loadedExtensions: [],
      sessionName: this.props.roomID,
      liveBoolean: true,
      userName: this.props.username,
      passWord: this.props.password,
      // This link to logo is non licenced
      userIcon: userPicture
    };
    this.toggleLive = this.toggleLive.bind(this);
    this.mainContainerRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.creator)

    if (!this.props.creator) {
      // console.log({username: this.props.username, roomID: this.props.roomID});
      // console.log(this.props.creator);
      this.props.webSocket.emit("newJoin", { username: this.props.username, roomID: this.props.roomID });
    }

    this.props.webSocket.on("userJoined", data => {
      // console.log(data)
      let currentUsers = this.state.liveUsers;
      currentUsers.push(data);
      this.setState({ liveUsers: currentUsers });
      console.log(this.state.liveUsers)
      this.props.webSocket.emit("addUser", {
        id: this.props.webSocket.id,
        username: this.props.username,
        dest: data.id
      })
    })

    this.props.webSocket.on("addUser", data => {
      let currentUsers = this.state.liveUsers;
      currentUsers.push(data);
      this.setState({ liveUsers: currentUsers });
    })

    this.props.webSocket.on("leaving", (id) => {
      var curerntUsers = this.state.liveUsers;
      for (var i = 0; i < curerntUsers.length; i++) {
        if (curerntUsers[i].id === id) {
          curerntUsers.splice(i, 1);
        }
      }
      this.setState({ liveUsers: curerntUsers })
    })

    axios
      .get("http://192.168.1.193:4000/extensions/getExtensions")
      .then((response) => {

        this.setState({
          extensions: response.data
        })

        this.setState({
          extensionsAvailable: response.data.map(extension => {
            return (
              <h1 id={extension["link"]} onClick={this.handleClick} key={"extension" + extension.name}>
                {extension.name}
              </h1>
            )
          })
        })

      })
      .catch(function (error) {
        console.log(error);
      });

    var script = document.createElement('script');
    // This references the api provided by desmos. It includes the demonstration api key as it is not being used in production
    script.src = "https://www.desmos.com/api/v1.5/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
    document.head.appendChild(script);
  }

  handleClick = async (e) => {
    e.preventDefault();
    e.persist();

    try {
      await this.mainContainerRef.current.layoutRef.current.addTabWithDragAndDropIndirect(
        "Add a " + e.target.innerHTML + "<br>(Drag to location)",
        {
          component: e.target.id,
          name: e.target.innerHTML,
          config: {
            num: Math.floor(Math.random() * 10000) // CHANGE THIS TO BE MORE SECURE
          }
        },
        null
      );
    } catch (err) {
      console.log(err)
    }
  };

  toggleLive = (live) => {
    this.setState({ liveBoolean: live });
  };

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1 className="sessionTitle">{this.state.sessionName}</h1>
          <h1 className="workspaceSelect">
            {this.state.sessionName} - General <span>&#9776;</span>
          </h1>
          {this.state.liveBoolean ? (
            <h1 className="liveBool" onClick={() => this.toggleLive(false)}>
              You Are Live<span className="liveBooleanTrue">&#9673;</span>
            </h1>
          ) : (
              <h1 className="liveBool" onClick={() => this.toggleLive(true)}>
                You Are Not Live<span className="liveBooleanFalse">&#9673;</span>
              </h1>
            )}
        </div>
        <div className="wrapper">
          <div className="leftMenu">
            <div className="leftMenuContainer">
              <div className="leftMenuTitles">
                <img alt="usersIcon" src={usersIcon} />
                <h1>Live Users</h1>
              </div>
              <ul>
                {this.state.liveUsers.map((x) => (
                  <li key={"liLiveUser" + x.username}>{x.username}</li>
                ))}
              </ul>

              {/*  Extensions */}

              <div className="leftMenuTitles">
                <img alt="extensionIcon" src={extensionIcon} />
                <h1>Extensions</h1>
              </div>
              <ul>
                {this.state.extensionsAvailable.map((x) =>
                  this.state.loadedExtensions.includes(x.props.id) ? (
                    <li
                      key={x.props.id + "_li_with_tick"}
                      id="extensionLi"
                      className="extensionLi"
                    >
                      {/* <img alt="greenTickIcon" src={greenTickIcon} /> */}
                      {x}
                    </li>
                  ) : (
                      <li
                        key={x.props.id + "_li_without_tick"}
                        id="extensionLi"
                        className="extensionLi"
                      >
                        <span className="spacerForTick"></span>
                        {x}
                      </li>
                    )
                )}
              </ul>

              {/*  End Extensions */}

              <div className="bottomUserSettings">
                <img
                  alt="userIcon"
                  className="userIcon"
                  src={this.state.userIcon}
                />
                <div className="userDataBox">
                  <h1>{this.state.userName}</h1>
                  <h2>User Settings</h2>
                </div>
                <div className="settingsIcon">&#9881;</div>
              </div>
            </div>
          </div>
          <div className="mainContainer" id="mainContainer">
            <MainContainer liveUsers={this.state.liveUsers} webSocket={this.props.webSocket} extensions={this.state.extensions} username={this.state.userName} roomID={this.props.roomID} creator={this.props.creator} key="mainContainer1" ref={this.mainContainerRef} />
          </div>
        </div>
      </div>
    );
  }
}