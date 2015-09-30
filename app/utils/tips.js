var tips = [
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia'
];

tips_api = {
  getTips() {
    return tips;
  },
  getRandomTip() {
    var i = Math.floor(Math.random()*tips.length);
    return `Tip #${i+1}: ${tips[i]}`;
  }
}

export default tips_api;
