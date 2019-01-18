const fs = require('fs');
const _ = require('lodash');
let data = fs.readFileSync('../data/petition/refined.second.minCount(50)_short.json');
let json = JSON.parse(data);

let a = {
  "a" : 36,
  "b" : 74,
  "c" : 133,
  "d" : 45
};

let newArr = [];

_.forEach(a, (value,key) => {
  newArr.push({
    key, value
  })
});

newArr = _.slice(_.orderBy(newArr, ['value'], ['desc']), 0, 3);


console.log(newArr);
