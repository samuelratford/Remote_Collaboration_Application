// This code is written by Samuel Ratford in its entirety

import React from "react";
import axios from "axios";
import "./App.css";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  submitLogin = (e) => {
    e.preventDefault();
    let loginUsername = e.target.elements[0].value;
    let loginPassword = e.target.elements[1].value;
    if (loginUsername === "" || loginPassword === "") {
      alert("please enter both username and password");
    } else {
      try {
        axios
          .post("http://192.168.1.193:4000/users/login", {
            // .post("http://192.168.1.152:4000/users/login", {
            username: loginUsername,
            password: loginPassword,
          })
          .then((response) => {
            response.data
              ? this.props.getUserData({
                username: loginUsername,
                password: loginPassword,
              })
              : alert("Username and/or Password incorrect");
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (err) {
        console.log("server not running");
      }
    }
  };

  submitRegister = (e) => {
    e.preventDefault();
    if (
      e.target.elements[0].value === "" ||
      e.target.elements[1].value === ""
    ) {
      alert("please enter both username and password");
    } else {
      try {
        axios
          .post("http://192.168.1.193:4000/users/register", {
            // .post("http://192.168.1.152:4000/users/register", {
            username: e.target.elements[0].value,
            password: e.target.elements[1].value,
          })
          .then((response) => {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (err) {
        console.log("server not running");
      }
    }
  };

  changeToRegister = (e) => {
    e.preventDefault();
    let welcomeModal = document.getElementById("welcomeModal");
    welcomeModal.style.left = "0";
    welcomeModal.style.boxShadow = "15px 0 20px 5px rgb(70, 70, 70)";

  }

  changeToLogin = (e) => {
    e.preventDefault();
    let welcomeModal = document.getElementById("welcomeModal");
    welcomeModal.style.left = "37.5%";
    welcomeModal.style.boxShadow = "-15px 0 20px 5px rgb(70, 70, 70)";

  }

  render() {
    return (
      <div className="LoginPage">
        <form
          id="loginContainer"
          className="loginContainer"
          onSubmit={this.submitLogin}
        >
          <input
            type="text"
            id="usernameLogin"
            name="username"
            placeholder="username"
          />
          <br />
          <input
            type="password"
            id="passwordLogin"
            name="password"
            placeholder="password"
          />
          <br />
          <input className="submitLogin" type="submit" value="Login" />
          <h3>Don't have an account? <span onClick={this.changeToRegister} >Create One Here</span></h3>
        </form>
        <form
          id="registerContainer"
          className="registerContainer"
          onSubmit={this.submitRegister}
        >
          <input
            type="text"
            id="usernameRegister"
            name="username"
            placeholder="username"
          />
          <br />
          <input
            type="password"
            id="passwordRegister"
            name="password"
            placeholder="password"
          />
          <br />
          <input className="submitRegister" type="submit" value="Register" />
          <h3>Already have an account? <span onClick={this.changeToLogin} >Log In Here</span></h3>
        </form>
        <div className="disclamerLeft">
          <h1>Disclamer</h1>
          <h2>This site does not handle passwords and other user information securely. Huddle was created as a Masters Project where there was no focus on security and/or data integrity. Please do not use a password you use for any other service. </h2>
        </div>
        <div className="disclamerRight">
          <h1>Disclamer</h1>
          <h2>This site does not handle passwords and other user information securely. Huddle was created as a Masters Project where there was no focus on security and/or data integrity. Please do not use a password you use for any other service. </h2>
        </div>
        <div id="welcomeModal" className="welcomeModal">
          <h1>Welcome to Huddle</h1>
          <h2>The remote collaboration application that allows you to integrate tools for you and your business</h2>
        </div>
      </div>
    );
  }
}
