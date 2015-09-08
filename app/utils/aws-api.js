var aws = require('./config').aws;

var aws_api = {
  uploadToSW3(image) {

    // TO-DO: upload image to s3 and resolve with image url
    var id = image.uri.match(/id=([^&]*)/)[1] + 'jpg';
    var base64 = 'data:image/jpeg;base64,' + image.base64;

    // var form = new FormData();
    // form.append("key", id);
    // form.append("acl","public-read")
    // form.append("AWSAccessKeyId", aws.accessKeyId);
    // form.append("Content-Type", "image/jpeg")
    // form.append("file", base64);
    // form.append("policy", {
    //   "expiration": "2026-01-01T00:00:00Z",
    //   "conditions": [ 
    //     {"bucket": "mysterymealapp"}, 
    //     ["starts-with", "$key", ""],
    //     {"acl": "public-read"},
    //     ["starts-with", "$Content-Type", ""],
    //     ["content-length-range", 0, 1048576]
    //   ]
    // });

    // var headers = new Headers();
    // headers.append("Content-Type", "multipart/form-data");

    // var request = new Request(aws.url, {
    //   headers,
    //   body: form,
    //   method: "post"
    // });

    // return fetch(request)
    // .then((response) => {
    //   return aws.url + id;
    // })
    // .catch((error) => {
    //   console.warn("ERROR " + error)
    // });
  }
};
 
module.exports = aws_api;