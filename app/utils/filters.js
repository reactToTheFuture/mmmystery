import helpers from './helpers';
var allFilters = ['American','newamerican','tradamerican','hotdogs','hotdog','burgers','Mexican & Latin','mexican','tex-mex','latin','Delis & Sandwiches','delis','sandwiches','Breakfast','Brunch & Bakeries','breakfast_brunch','bakeries','cafes','Italian & Pizza','italian','pizza','Asian','japanese','sushi','asianfusion','thai','ramen','vietnamese','indpak','chinese','korean','Seafood or Raw','seafood','raw_food','Healthy','salad','juicebars','vegan','gluten_free'];

var filters = {

  filterByDistance(plates, radius) {
    var res = [];
    plates.forEach((plate)=> {
      if (plate.distance <= radius) res.push(plate);
    });
    return res = helpers.shuffle(res);;
  },

  // filters plates based on category
  // priceFilter = [false,true,false]
  filterByPrice(plates, priceFilter) {
    var compareAgainst = [];
    compareAgainst[0] = priceFilter[0] ? '$' : null;
    compareAgainst[1] = priceFilter[1] ? '$$' : null;
    compareAgainst[2] = priceFilter[2] ? '$$$' : null;

    let res = [];
    plates.forEach((plate) => {
      if (compareAgainst.indexOf(plate.priceFactor) !==-1 ){
        res.push(plate)
      }
    });
    return res = helpers.shuffle(res);;
  },

  // two arrayss: [plates], [filters to apply on plates]
  filterByCategory(plates, categoryfilter) {
    let res = [];
    if (categoryfilter.indexOf('Other') !==-1) {
      plates.forEach((plate) => {
        var founded =false;
        for (var key in plate.category) {
          if (allFilters.indexOf(key) !==1 && !founded) {
            founded = true;
          }
        }
        if (!founded){
          res.push(plate);
        };
      })
    }
    // no more filters except 'Other' filter
    if (categoryfilter.length ===1 &&
        categoryfilter[0] === 'Other') return res;

    // Add on top of 'Other' filter if it exists
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
        if (setsOfSelected[i]) res = res.concat(setsOfNineNames[i]);
    }
    return res;
  },
  resetFilter(arrayFilter, dollar){
    for (var i=0; i<arrayFilter.length; i++) {
      if (dollar) {
        arrayFilter[i][1] = false;
      } else {
        arrayFilter[i] = false;
      }
    }
    return arrayFilter;
  }
};

export default filters;
