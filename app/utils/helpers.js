var helpers = {
  shuffle(array, start) {
    var m = array.length, t, i;
    start = start || 0;
    while (m > start) {
      i = Math.floor(Math.random()*(--m - start+1)+start);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  },
  formatIdString(string) {
    return string.replace(/-/g,' ').toLowerCase().replace( /\b\w/g, function (m) {
      return m.toUpperCase();
    });
  },
  metersToMiles(meters) {
    return (meters * 0.00062137).toFixed(2);
  }
};
 
module.exports = helpers;