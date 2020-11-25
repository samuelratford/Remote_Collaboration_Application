// This code is written by Samuel Ratford with adaptation of code taken from https://github.com/webrtc/samples/tree/gh-pages/src/content/peerconnection/pc1

// The ice servers in this app are taken from https://webrtc.org/getting-started/peer-connections
// The ice servers are in the following format
//iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//     { urls: "stun:stun2.l.google.com:19302" },
//     { urls: "stun:stun3.l.google.com:19302" },
//     { urls: "stun:stun4.l.google.com:19302" },
//   ]

// All code in this file is adapted from https://github.com/webrtc/samples/tree/gh-pages/src/content/peerconnection/pc1 - this is an example peer connection provided under a BSD 3-Clause license, shown below

// Copyright(c) 2014, The WebRTC project authors.All rights reserved.
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
// Neither the name of Google nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// The code taken from https://github.com/webrtc/samples/tree/gh-pages/src/content/peerconnection/pc1 is heavily adapted for its use here

import React from "react";
import "../App.css";

export default class WebRTC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      connectedUsers: [],
      roomID: "",
      mediaConstraints: {
        audio: false,
        video: { width: 1280, height: 720 },
      },
      localMedia: "",
      videos: [
        <video
          className="local-video"
          key="local-video"
          id="local-video"
          autoPlay="autoplay"
        ></video>,
        <video
          className="remote-video"
          key="remote-video"
          id="remote-video"
          autoPlay="autoplay"
        ></video>,
      ],
      // These stun servers are 
      // iceServers: {
      //   iceServers: [
      //     { urls: "stun:stun.l.google.com:19302" },
      //     { urls: "stun:stun1.l.google.com:19302" },
      //     { urls: "stun:stun2.l.google.com:19302" },
      //     { urls: "stun:stun3.l.google.com:19302" },
      //     { urls: "stun:stun4.l.google.com:19302" },
      //   ],
      // },
      videoinput: undefined,
      audioinput: undefined
    };
  }

  componentDidMount() {
    this.getUserSetting()
  }

  getUserSetting = () => {
    let videoInput = document.getElementById("videoInput");
    let audioInput = document.getElementById("audioInput");

    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.forEach(device => {
        if (device.kind === "videoinput") {
          // console.log(device.label, ": " ,device.getCapabilities())
          var opt = document.createElement('option');
          opt.appendChild(document.createTextNode(device.label || "Default"));
          opt.value = device.deviceId;
          videoInput.appendChild(opt);
        } else if (device.kind === "audioinput") {
          var opt = document.createElement('option');
          opt.appendChild(document.createTextNode(device.label || "Default"));
          opt.value = device.deviceId;
          audioInput.appendChild(opt);
        }
      })

      var opt = document.createElement('option');
      opt.appendChild(document.createTextNode("None"));
      opt.value = "none"
      videoInput.appendChild(opt);

      var opt2 = document.createElement('option');
      opt2.appendChild(document.createTextNode("None"));
      opt2.value = "none"
      audioInput.appendChild(opt2);

    });
  }

  startVideoConnection = async () => {
    if (document.getElementById("videoInput").value === "none" & document.getElementById("audioInput").value === "none") {
      alert("You need audio or video to begin the call")
    } else {
      const webrtcGetUserSettings = document.getElementById("webrtcGetUserSettings");
      webrtcGetUserSettings.style = "display: none";


      const videoChatContainer = document.getElementById("video-chat-container");

      console.log(navigator.mediaDevices);


      let localMedia = await navigator.mediaDevices.getUserMedia(
        {
          video: document.getElementById("videoInput").value === "none" ? false : { aspectRatio: 1.7777777778, deviceId: { exact: document.getElementById("videoInput").value } },
          audio: document.getElementById("audioInput").value === "none" ? false : { deviceId: { exact: document.getElementById("audioInput").value } }
        }
      );
      videoChatContainer.style = "display: block";
      this.props.creator
        ? this.createRoom({ username: this.props.username, roomID: this.props.roomID })
        : this.joinRoom(localMedia, { username: this.props.username, roomID: this.props.roomID });

      this.props.webSocket.on("offerVideo", async (res) => {

        let localVideo = document.getElementById("local-video");
        localVideo.style.width = "25%";
        localVideo.style.height = "25%";

        let peerConnection = await new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" },
          ],
        }); // Make RTCPeerConnection


        peerConnection.setRemoteDescription(new RTCSessionDescription(res.sdp));

        localMedia.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localMedia);
        });

        peerConnection.ontrack = (event) => {
          document.getElementById("remote-video").srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.props.webSocket.emit("send_ice_candidate_video", {
              roomID: this.props.roomID,
              label: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            });
          }
        };

        let sessionDescription;
        try {
          sessionDescription = await peerConnection.createAnswer();
          peerConnection.setLocalDescription(sessionDescription);
        } catch (error) {
          console.error(error);
        }

        await this.props.webSocket.emit("answerVideo", {
          roomID: this.props.roomID,
          sdp: sessionDescription
        });

        this.props.webSocket.on("send_ice_candidate_video", (event) => {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          });
          peerConnection.addIceCandidate(candidate);
        });


      });
    }
  }

  createRoom = async (roomObj) => {

    if (roomObj["roomID"] === "") {
      alert("Please type a room ID");
    } else {
      document.getElementById("local-video").srcObject = await navigator.mediaDevices.getUserMedia(
        {
          video: document.getElementById("videoInput").value === "none" ? false : { aspectRatio: 1.7777777778, deviceId: { exact: document.getElementById("videoInput").value } },
          audio: document.getElementById("audioInput").value === "none" ? false : { deviceId: { exact: document.getElementById("audioInput").value } }
        }
      );
      document.getElementById("video-chat-container").style = "display: block";
    }
  }

  joinRoom = async (localMedia, roomObj) => {
    if (roomObj["roomID"] === "") {
      alert("Please type a room ID");
    } else {
      let peerConnection = await new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
        ],
      }); // Make RTCPeerConnection

      localMedia.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localMedia);
      });

      peerConnection.ontrack = (event) => {
        document.getElementById("remote-video").srcObject = event.streams[0];
      };

      let sessionDescription;
      try {
        sessionDescription = await peerConnection.createOffer();
        peerConnection.setLocalDescription(sessionDescription);
      } catch (error) {
        console.error(error);
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.props.webSocket.emit("send_ice_candidate_video", {
            roomID: this.props.roomID,
            label: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          });
        }
      };

      await this.props.webSocket.emit("offerVideo", {
        roomID: this.props.roomID,
        sdp: sessionDescription
      });

      this.props.webSocket.on("answerVideo", (res) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(res.sdp));
      });

      this.props.webSocket.on("send_ice_candidate_video", (event) => {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });
        peerConnection.addIceCandidate(candidate);
      });

      let localVideo = document.getElementById("local-video");
      localVideo.style.width = "25%";
      localVideo.style.height = "25%";


      localVideo.srcObject = await navigator.mediaDevices.getUserMedia(
        {
          video: document.getElementById("videoInput").value === "none" ? false : { aspectRatio: 1.7777777778, deviceId: { exact: document.getElementById("videoInput").value } },
          audio: document.getElementById("audioInput").value === "none" ? false : { deviceId: { exact: document.getElementById("audioInput").value } }
        }
      );;
      document.getElementById("video-chat-container").style = "display: block";
    }
  }

  render() {
    return (
      <div className="App">

        <div id="webrtcGetUserSettings" className="centered">
          <label htmlFor="videoInput">Video Input</label>
          <select name="videoInput" id="videoInput">
          </select>
          <br />
          <label htmlFor="audioInput">Audio Input</label>
          <select name="audioInput" id="audioInput">
          </select>
          <br />
          <button onClick={this.startVideoConnection}>Begin Call</button>
        </div>

        <div id="video-chat-container" className="video-position">
          {this.state.videos.map((video) => video)}
        </div>
      </div>
    );
  }
}
