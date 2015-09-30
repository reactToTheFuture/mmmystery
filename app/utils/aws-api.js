import { aws } from './config';

var aws_api = {
  uploadToS3(base64, key) {
    var base64 = 'data:image/jpeg;base64,' + base64;
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
 
export default aws_api;