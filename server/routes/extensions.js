// This code is written by Samuel Ratford in its entirety

const router = require("express").Router();
let Extension = require("../models/extensionsModel");
const mongoose = require("mongoose");
const formidable = require('formidable');
const path = require("path");
const fs = require('fs');

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

router.route("/getExtensions").get((req, res) => {
    Extension.find(
        {},
        (err, docs) => {
            if (err) {
                res.send(err);
            } else {
                res.send(docs);
            }
        }
    );
});

// router.route("/getExtension").get((req, res) => {

//     Extension.findById(
//         (req.query.extensionId),
//         (err, docs) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 console.log("Sending extension");
//                 // res.sendFile(__dirname + docs.link);
//                 // res.sendFile(__dirname + docs.link);
// 		let file = (path.join(__dirname, "extensions/GraphDesmos.mjs"))
//                 res.type('application/javascript');
// 		res.sendFile(file);
// 		//res.sendFile(path.join(__dirname, "extensions/Test.json"));
//                 // res.send("Found")
//             }
//         }
//     );
// });

router.route("/addExtensions").post((req, res) => {
    new formidable.IncomingForm().parse(req, (err, fields, files) => {

        const name = fields.title;
        const description = fields.description;
        const link = `/extensions/${files.file.name}`;
        const accessToken = generateAccessToken();

        const newExtension = new Extension({ name, description, link, accessToken });

        Extension.find({ $or: [{ 'name': name }, { 'link': link }] },
            function (err, docs) {
                if (err) {
                    console.log(err)
                } else {
                    if (docs.length === 0) {
                        newExtension.save((err, extension) => {
                            if (err) return console.error(err);
                            console.log(extension.name + " saved to users collection.");
                        });

                        var oldPath = files.file.path;
                        var newPath = path.join(__dirname, "../../client/src/extensions", `${files.file.name}`);

                        // var newPath = __dirname + `/extensions/${files.file.name}`;

                        fs.rename(oldPath, newPath, function (err) {
                            if (err) throw err;
                            console.log("Completed")
                        });

                        console.log(oldPath);
                        console.log(newPath);

                        res.send("Success");
                    } else {
                        res.send("Failed");
                    }
                }
            });


    })
})

function generateAccessToken() {
    return Math.random().toString().slice(2, 11);
}

module.exports = router;
