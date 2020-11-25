// This code is written by Samuel Ratford in its entirety

import React from "react";
import FlexLayout from "flexlayout-react";
import axios from "axios";
import "./App.css";
import "../node_modules/flexlayout-react/style/light.css";

// import io from "socket.io-client";
// var socket = io.connect("http://192.168.1.193:4000");


var json = {
  global: { tabEnableClose: true },

  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 50,
        selected: 0,
        children: [
          {
            type: "tab",
            enableClose: false,
            name: "Voice and Video Chat",
            component: "webRTC",
          },
        ],
      },
    ],
  },
};

export default class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: FlexLayout.Model.fromJson(json),
      extensionsLoaded: [],
      counter: 0,
    };
    this.layoutRef = React.createRef();
  }

  componentDidMount() {
    // socket.emit("createRoom", this.props.roomID);
  }

  factory(node) {
    var component = node.getComponent();
    var name = node.getName();

    if (component === "webRTC") {

      const WebRTC = require("./extensions/WebRTC").default;

      return (
        <WebRTC
          username={this.props.username}
          roomID={this.props.roomID}
          creator={this.props.creator}
          key={node.getName() + node._attributes.id}
          webSocket={this.props.webSocket}
        />
      );
    } else {
      let Extension = require("." + component).default;
      console.log(node);
      return <Extension extensionProps={node.getConfig().data}
        liveUsers={this.props.liveUsers}
        name={name}
        username={this.props.username}
        roomID={this.props.roomID}
        creator={this.props.creator}
        key={node.getName() + node._attributes.id}
        parent={node._attributes.config.num}
        webSocket={this.props.webSocket}
      />;
    }
  }
  render() {
    return (
      <FlexLayout.Layout
        key="flexLayout"
        ref={this.layoutRef}
        model={this.state.model}
        factory={this.factory.bind(this)}
        onModelChange={this.modelChanged}
      />
    );
  }
}
