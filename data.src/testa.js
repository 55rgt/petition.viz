const fs = require('fs');
const _ = require('lodash');
let data = fs.readFileSync('../data/petition/refined.second.minCount(50)_short.json');
let json = JSON.parse(data);

let a = [{
  age: 35,
  married: false
}, {
  age: 21,
  married: true
}, {
  age: 19,
  married: false
}];

a = _.orderBy(a, ['married', 'age'], ['asc', 'desc']);

console.log(a);
