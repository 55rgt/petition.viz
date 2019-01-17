const fs = require('fs');
const _ = require('lodash');
let data = fs.readFileSync('../data/petition/original.json');
let json = JSON.parse(data);
let keys = Object.keys(json);
// let minimum = 50;
// let delimiter = 150;
let minimum = 50;
let delimiter = 1000;

let under = 0;
let over = 0;

let underDist = {};
let overDist = {};

_.forEach(keys, (key) => {
  let ele = json[key];
  let count = ele['count'];
  let category = ele['category'];
  if (count < minimum);
  else if (count < delimiter) {
    under += 1;
    _.isNil(underDist[category]) ? underDist[category] = 1 : underDist[category] += 1;
  }
  else {
    over += 1;
    _.isNil(overDist[category]) ? overDist[category] = 1 : overDist[category] += 1;
  }
});

console.log(under, over);
console.log(underDist);
console.log(overDist);
