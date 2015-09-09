var imgs = [
  require('image!GodMother'),
  require('image!InNOut'),
  require('image!padThai')
];

img_api = {
  getRandomImg() {
    var i = Math.floor(Math.random() * imgs.length);
    return imgs[i];
  }
}

module.exports = img_api;