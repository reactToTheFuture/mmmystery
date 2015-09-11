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
  formatNameString(string) {
    return string.replace(/\s+/g,'-').toLowerCase();
  },
  formatIdString(string) {
    return string.replace(/-/g,' ').toLowerCase().replace( /\b\w/g, function (m) {
      return m.toUpperCase();
    });
  },
  metersToMiles(meters) {
    return (meters * 0.00062137).toFixed(2);
  },

  // filters plates based on category
  getFilteredPlates(plates, categoryfilter) {
    let res = [];
    plates.forEach((plate) => {
      categoryfilter.forEach((filter)=>{
        if (filter in plate.category) {
          res.push(plate)
          return;
        };
      })
    });
    return res;
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
      for (var j=0; j<setsOfSelected[i].length; j++) {
        if (setsOfSelected[i][j]) res.push(setsOfNineNames[i][j]);
      }
    }
    return res;
  },
};

module.exports = helpers;