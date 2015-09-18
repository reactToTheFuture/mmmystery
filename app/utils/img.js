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

export default img_api;
