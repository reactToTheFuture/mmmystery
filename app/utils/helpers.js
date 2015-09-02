var helpers = {
  shuffle: function(array, start) {
    var m = array.length, t, i;
    start = start || 0;
    while (m > start) {
      i = Math.floor(Math.random()*(--m - start+1)+start);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
};
 
module.exports = helpers;