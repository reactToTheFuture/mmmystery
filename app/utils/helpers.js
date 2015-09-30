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
  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  formatNameString(string) {
    return string.replace(/\s+/g,'-').toLowerCase();
  },
  formatIdString(string) {
    return string.replace(/-/g,' ').toLowerCase().replace(/\b\w/g, function (m) {
      return m.toUpperCase();
    });
  },
  getRadians(deg) {
    return deg * Math.PI / 180;
  },
  getDegrees(rad) {
    return rad * 180 / Math.PI;
  },
  metersToMiles(m) {
    return m * 0.00062137;
  },
  kilometersToMiles(km) {
    return km * 0.621371;
  },
  milesToKilometers(m) {
    return m * 1.60934;
  },
  milesToMins(m) {
    // 1 mile ~ 10 mins
    var mins = Math.round(m * 10);

    if( mins === 0 ) {
      return '<1';
    }

    return mins;
  }
};

export default helpers;
