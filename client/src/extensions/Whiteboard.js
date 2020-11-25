// This code is written by Samuel Ratford in its entirety

import { React, socketSendState, socketGetState } from "./ExtensionLibrary";

export default class Whiteboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      mousePos: {},
      currentPath: []
    };
  }

  async componentDidMount() {
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    socketGetState(this.props, data => {
      context.beginPath();
      context.moveTo(data[0].x, data[0].y)
      for (var i = 1; i < data.length; i++) {
        context.lineTo(data[i].x, data[i].y);
        context.strokeStyle = "#f00";
        context.stroke();
      }
      context.closePath()
    })
  }

  draw = (e) => {
    e.preventDefault();
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    if (this.state.mouseDown) {
      var newCurrentPath = this.state.currentPath;
      newCurrentPath.push({ x: e.clientX - canvas.getBoundingClientRect().x, y: e.clientY - canvas.getBoundingClientRect().y })
      this.setState({ currentPath: newCurrentPath })
      context.lineTo(e.clientX - canvas.getBoundingClientRect().x, e.clientY - canvas.getBoundingClientRect().y);
      context.strokeStyle = "#000";
      context.stroke();
    }
  }

  mouseDown = (e) => {
    e.preventDefault();
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    console.log(e.clientX - canvas.getBoundingClientRect().x, e.clientY - canvas.getBoundingClientRect().y)
    this.setState({ mouseDown: true })
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.clientX - canvas.getBoundingClientRect().x, e.clientY - canvas.getBoundingClientRect().y);


    // if (!this.state.mouseDown) {
    //   this.setState({mouseDown: true})
    // } else {
    //   this.state.mousePos.x = e.clientX||e.touches[0].clientX;
    //   this.state.mousePos.y = e.clientY||e.touches[0].clientY;
    // }
  }

  mouseUp = (e) => {
    var canvas = document.getElementById('whiteboard');
    var context = canvas.getContext('2d');
    if (this.state.mouseDown) {
      this.setState({ mouseDown: false });
      context.closePath();
      socketSendState(this.props, this.state.currentPath);
    }
  }

  render() {
    return (
      <canvas
        onMouseDown={this.mouseDown}
        onMouseMove={this.draw}
        onMouseUp={this.mouseUp}
        style={{ width: '100%', height: "100%", display: "inline-block" }}
        width="100%"
        height="100%"
        id="whiteboard" ></canvas>
    );
  }
}

