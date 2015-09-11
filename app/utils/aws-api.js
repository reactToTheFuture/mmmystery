var aws = require('./config').aws;

var aws_api = {
  uploadToS3(image, key) {
    console.log('image: ', image);
    console.log('key: ', key);
    var base64 = 'data:image/jpeg;base64,' + image.base64;
    var header = new Headers();
    header.append('Content-Type', 'application/json')
    return fetch('https://shrouded-temple-1043.herokuapp.com/', {
      method: 'POST',
      header: header,
      body: JSON.stringify({
        'image': encodeURIComponent(base64),
        'key': key
      })
    });
  }
};
 
module.exports = aws_api;