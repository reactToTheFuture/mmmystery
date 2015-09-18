var yelp_keys = require('./config').yelp;
var OAuth = require('oauth-1.0a');

var yelp_api = {
  getRestaurantsByTerms(term,location) {

    term = term.replace(/\s/g,'%20');

    var lat = location.latitude;
    var lng = location.longitude;
    var oauth = OAuth({
      consumer: {
        public: yelp_keys.consumer_key,
        secret: yelp_keys.consumer_secret
      },
      signature_method: 'HMAC-SHA1'
    });
    var token = {
      public: yelp_keys.token_key,
      secret: yelp_keys.token_secret
    };
    var request_data = {
      url: `http://api.yelp.com/v2/search?category_filter=restaurants&term=${term}&ll=${lat},${lng}`,
      method: 'GET'
    };

    var headers = new Headers();
    headers.append('Authorization', oauth.toHeader(oauth.authorize(request_data, token)).Authorization);

    var request = new Request(request_data.url, {
      headers,
      method: request_data.method
    });

    return fetch(request)
    .then((res) => res.json());

  }
};
 
export default yelp_api;
