let foodImages= [require('image!icon-american'), require('image!icon-mexican'), require('image!icon-deli'),
                 require('image!icon-breakfast'), require('image!icon-italian'), require('image!icon-asian'),
                 require('image!icon-seafood'), require('image!icon-healthy'), require('image!icon-other')];

let categoryNames= [['American', 'newamerican', 'tradamerican', 'hotdogs', 'hotdog', 'burgers'],
                  ['Mexican & Latin', 'mexican', 'tex-mex', 'latin'],
                  ['Delis & Sandwiches', 'delis', 'sandwiches'],
                  ['Breakfast', 'Brunch & Bakeries', 'breakfast_brunch', 'bakeries', 'cafes'],
                  ['Italian & Pizza', 'italian', 'pizza'],
                  ['Asian', 'japanese', 'sushi', 'asianfusion', 'thai', 'ramen', 'vietnamese', 'indpak', 'chinese', 'korean'],
                  ['Seafood or Raw', 'seafood', 'raw_food'],
                  ['Healthy','salad','juicebars','vegan','gluten_free'],
                  ['Other']];

let dollarImages = [['', false],
                    ['', false],
                    ['', false]];

let assetsMapIconNames = ['icon-map-american', 'icon-map-mexican', 'icon-map-deli', 'icon-map-breakfast', 'icon-map-italian', 'icon-map-asian', 'icon-map-seafood', 'icon-map-healthy', 'icon-map-other'];
let subTitles = ['American', 'Mexican', 'Deli','Breakfast','Italian','Asian','Seafood','Healthy','Other'];

let setsOfSelected= [false,false,false,false,false,false,false,false,false];

var filtersData = {
  gatCategoryNames() {
    return categoryNames;
  },
  getFoodImages() {
    return foodImages;
  },
  getSubTitles() {
    return subTitles;
  },
  getSetsOfSelected() {
    return setsOfSelected;
  },
  getDollarImages() {
    return dollarImages;
  },
  // plateCategory === {'category1': true, 'category2': true, ...};
  findIconForCategory(plateCategory) {
    var result;
    for (var i=0; i<categoryNames.length; i++) {
      for (var j=0; j<categoryNames[i].length; j++) {
        if (categoryNames[i][j] in plateCategory) {
          result= 'image!' + assetsMapIconNames[i];
          return result;
        }
      }
    }
    return result='image!' + assetsMapIconNames[assetsMapIconNames.length-1];
  },
};

export default filtersData;
