const fs = require('fs');
const _ = require('lodash');
let minimum = 30;
let data = fs.readFileSync(`../data/petition/refined.second.minCount(${minimum})_short.json`);
let json = JSON.parse(data);
let keys = Object.keys(json);
// let minimum = 50;
// let delimiter = 150;

let delimiter = 1000;

let under = 0;
let over = 0;

let underDist = {};
let overDist = {};

let word = '정치';
_.forEach(keys, (key) => {
  let ele = json[key];
  let count = ele['count'];
  let category = ele['category'];
  if (count < minimum);
  else if (count < delimiter) {
    if(ele.keywords.includes(word)){
      under += 1;
      _.isNil(underDist[category]) ? underDist[category] = 1 : underDist[category] += 1;
    }
  }
  else {
    if(ele.keywords.includes(word)) {
      over += 1;
      _.isNil(overDist[category]) ? overDist[category] = 1 : overDist[category] += 1;
    }
  }
});

console.log(under, over);
console.log(underDist);
console.log(overDist);
