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
    return string.replace(/-/g,' ').toLowerCase().replace( /\b\w/g, function (m) {
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
    return (m * 0.00062137);
  },
  milesToMins(m) {
    // 1 mile ~ 15 mins
    return Math.round(m * 15);
  },
  filterByDistance(plates, radius) {
    var res = [];
    console.log(typeof plates, plates.length);
    plates.forEach((plate)=> {
      if (plate.distance <= radius) res.push(plate);
    });
    return res = helpers.shuffle(res);;
  },
  // filters plates based on category
  filterByPrice(plates, priceFilter) {
    let res = [];
    var priceFactor = {0: '$', 1: '$$', 2: '$$$'};
    plates.forEach((plate) => {
      if (priceFactor[priceFilter] === plate.priceFactor){
            res.push(plate)
          }
    });
    return res = helpers.shuffle(res);;
  },

  filterBycategory(plates, categoryfilter) {
    let res = [];
    plates.forEach((plate) => {
      categoryfilter.forEach((filter)=>{
        if (filter in plate.category) {
          res.push(plate)
          return;
        };
      })
    });
    return res = helpers.shuffle(res);;
  },
  // input: array of array of categories
  // output: {'category1': true, 'category2': true, ...}
  formatCategory(categories) {
    return !!categories.length ? categories.reduce((prev,next) => {
      return prev.concat(next)
    }).reduce((obj, category) => {
        obj[category] = true;
        return obj;
      }, {})  : null;
  },
  // Helpers functions used in Settings
  // Matrix 3x3 for pics, category names and selected pics.
  makeArrayOfNineArray(data, bool) {
    var res = [],
        temp = [];
    for (var i=0; i<data.length; i++) {
      bool ? temp.push(false) : temp.push(data[i])
      if ((i + 1)%9 === 0 || i+1 === data.length) {
        res.push(temp);
        temp=[];
      }
     }
     return res;
  },
  // Returns and array with filtered categories
  createSettingsFilter(setsOfSelected, setsOfNineNames) {
    var res = [];
    for (var i=0; i<setsOfSelected.length; i++) {
        if (setsOfSelected[i]) res.push(setsOfNineNames[i]);
    }
    return res;
  },
};

module.exports = helpers;