// This code is written by Samuel Ratford in its entirety

import React from "react";
import Placeholder from "./images/placeholder.jpg"
import Stars from "./images/5-stars.png"
import "./App.css";

export default class ExtensionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="extensionModal">
        <img alt="extensionImage" className="extensionImage" src={Placeholder} />
        <img alt="starSaring" className="extensionRating" src={Stars} />
        <p className="extensionDownloads">{Math.floor(Math.random() * 90 + 10)},{Math.floor(Math.random() * 900 + 100)}</p>
        <h1>{this.props.name}</h1>
        <h2>{this.props.description}</h2>
      </div>
    );
  }
}
