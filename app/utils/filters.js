import helpers from './helpers';

var filters = {

  filterByDistance(plates, radius) {
    var res = [];
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

  filterByCategory(plates, categoryfilter) {
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

module.exports = filters;
