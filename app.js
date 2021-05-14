const aws = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("./awsConfig");
const app = express();

const port = 3000;

aws.config.update(config);

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "test-bucket-he",
    // acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_META_DATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

app.post("/upload", upload.single("image"), function (req, res, next) {
  // res.send("Successfully uploaded " + req.files.length + " files!");

  try {
    return res.status(201).json({
      message: "File uploaded successfully",
      imageUrl: req.file.location,
    });
  } catch (error) {
    console.error(error);
  }
});

app.delete("/del", function (req, res, next) {
  // res.send("Successfully uploaded " + req.files.length + " files!");
  const params = {
    Bucket: "test-bucket-he",
    Key: "1601272231554",
  };
  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data); // deleted
    return res.status(201).json({
      message: "File deleted successfully",
    });
  });
});

app.get("/reads3", function (req, res, next) {
  // res.send("Successfully uploaded " + req.files.length + " files!");
  const params = {
    Bucket: "test-bucket-he",
    Key: "1601034246801",
  };
  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data); // deleted
    return res.status(201).json({
      message: "File received successfully",
    });
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
