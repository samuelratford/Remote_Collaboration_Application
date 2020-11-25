// This code is written by Samuel Ratford in its entirety

import { React, socketSendState, socketGetState } from "./ExtensionLibrary";

export default class ScreenShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {

    var video = document.getElementById("screen-video");
    var receiver = document.getElementById("screen-receiver");
    // var sentVideo = document.createElement("video"); 
    var canvas = document.createElement("canvas");
    canvas.width = "640";
    canvas.height = "480";

    var last;

    var context = canvas.getContext('2d');

    if (this.props.creator) {
      video.style.display = "block";

      console.log("creator")

      let screenSrc = await this.startCapture();
      video.srcObject = await screenSrc;

      setInterval(async () => {
        context.drawImage(video, 0, 0, 640, 480);
        socketSendState(this.props, canvas.toDataURL('image/jpeg'));
      }, 200);

    } else {
      receiver.style.display = "block";
      console.log("not creator");
      socketGetState(this.props, async (data) => {
        // console.log(data);
        receiver.removeAttribute("src");
        receiver.setAttribute("src", data);
      });
    }

  }

  startCapture = async () => {
    let captureStream = null;

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 5,
          height: 640,
          resizeMode: "crop-and-scale",
          width: 480,
          cursor: "always"
        },
        audio: false,
      });
    } catch (err) {
      console.error("Error: " + err);
    }
    return captureStream;
  };

  render() {
    return (
      <div
        className="screenShare"
        style={{ color: "none", width: "100%", height: "100%" }}
      >
        <video
          style={{ display: "none", width: "100%", height: "100%" }}
          width="100%"
          height="100%"
          className="screen-video"
          key="screen-video"
          id="screen-video"
          autoPlay="autoplay"
        ></video>
        <img
          style={{ display: "none", maxWidth: "100%", maxHeight: "100%", width: "100%", height: "100%" }}
          width="100%"
          height="100%"
          className="screen-receiver"
          key="screen-receiver"
          id="screen-receiver"
        ></img>
      </div>
    );
  }
}

