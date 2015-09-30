import helpers from '../app/utils/helpers';

describe('Helpers methods', () => {
  it('Gives back a formatted ID string', () => {
    let stringInput = "xcvlxkjvl908d0sf9JLJKLJldkjfsjvojJHSDLKFHJLKDH";
    let stringOuput = "Xcvlxkjvl908d0sf9jljkljldkjfsjvojjhsdlkfhjlkdh";
    expect(helpers.formatIdString(stringInput)).toBe(stringOuput);
  });

  it('Tests the shuffle helper with no start', () => {
    let array = [5,4,5,6,8,34,6,7,9,3];
    let arrayAfter = helpers.shuffle([5,4,5,6,8,34,6,7,9,3]);
    expect(array === arrayAfter).toBe(false);
  });

  it('Tests the shuffle helper given a start', () => {
    let array = [1,2,3,4,4];
    let start = 2;
    let arrayAfter = helpers.shuffle([1,2,3,4,4], start);
    expect(array === arrayAfter).toBe(false);
  });
});
