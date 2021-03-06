# Remote Collaboration Application made by Samuel Ratford for University of Birmingham Computer Science Masters Project.

Many plugins are used within this project. They include:
- React.js [https://reactjs.org/](https://reactjs.org/)
- Create-React-App [https://create-react-app.dev](https://create-react-app.dev/) - (This includes many packages such as http, cors, fs and path)
- Express.js [https://expressjs.com/](https://expressjs.com/)
- Node.js [https://nodejs.org/en/](https://nodejs.org/en/) - (Not under MIT license, [find the license here](https://github.com/nodejs/node/blob/master/LICENSE))
- Mongoose [http://mongoosejs.com/](http://mongoosejs.com/)
- WebRTC [https://webrtc.org/](https://webrtc.org/) - (Not under MIT license, [find the license here](https://webrtc.org/support/license))
- Socket.io [https://socket.io/](https://socket.io/)
- socket.io-client [https://github.com/socketio/socket.io-client](https://github.com/socketio/socket.io-client)
- Axios [https://github.com/axios/axios](https://github.com/axios/axios)
- flexlayout-react [https://github.com/caplin/FlexLayout](https://github.com/caplin/FlexLayout)
- react-router [https://github.com/ReactTraining/react-router#readme](https://github.com/ReactTraining/react-router#readme)
- formidable [https://github.com/node-formidable/formidable](https://github.com/node-formidable/formidable)


## All of the above packages are used under an MIT license which can be found on their website, with the exception of Node.js and WebRTC, which have their licenses shown above. The MIT license is as follows:

'MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.'

## Running the Project
Step 1) Connect your computer to your WIFI hub using port 193, this means your internal IP address should now be 192.168.1.193

Step 2) Create an empty directory and navigate into it

Step 3) Open a terminal (or command prompt) in this directory and run the command “git clone https://git-teaching.cs.bham.ac.uk/mod-msc-proj-2019/sar912.git” 

Step 4) In a chrome browser type “chrome://flags/#unsafely-treat-insecure-origin-as-secure” in the address bar. They in the “Insecure origins treated as secure” text box type “http://192.168.1.193:3000” end enable the field. This is to allow webRTC to work on a local network without HTTPS.

Step 5) Enter the “sar912” directory

Step 6) In two separate terminals navigate to the “server” directory and run the command “node server.js”. In the other terminal navigate to the “client” directory and run the command “npm start”

Step 7) In the chrome browser enter “http://192.168.1.193:3000/”. You can now use the application.


## Generated code

####  All files in the folders named "node_modules" are either generated from the plugins given above under their license or are auto-generated by create-react-app (https://create-react-app.dev/) which itself is provided under an MIT license

#### This includes all files in client/public. It also includes all package.json, package-lock.json files and .gitignore files.

#### Generated code further described bellow

./client/node_modules <- This folder is entirely auto-generated

./client/public <- This folder is generated by create-react-app

./client/src/ <- Theses files were  created by Samuel Ratford

./client/src/extensions <- Written by Samuel Ratford with the exception of some parts of WebRTC.js and GraphDesmos.js as stated in the documents

./client/src/images <- These images were created by Samuel Ratford

./node_modules <- This folder is entirely auto-generated

./server <- Files created by Samuel Ratford (with the exception of package files which are generated as previously stated)

./server/models <- Written by Samuel Ratford

./server/routes <- Written by Samuel Ratford

./server/node_modules <- Generated as previously stated

###### For example, const mongoose = require("mongoose"), references the library mongoose, and import React from "react" references the library react.
