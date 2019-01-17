const fs = require('fs');
const _ = require('lodash');

let minCount = 20;
let data = fs.readFileSync(`../data/petition/refined.first.minCount(${minCount}).json`);
let dataArr = JSON.parse(data);
let categories = {

  1: fs.readFileSync(`../data/dictionary/1.json`),
  2: fs.readFileSync(`../data/dictionary/2.json`),
  3: fs.readFileSync(`../data/dictionary/3.json`),
  4: fs.readFileSync(`../data/dictionary/4.json`),
  5: fs.readFileSync(`../data/dictionary/5.json`),
  6: fs.readFileSync(`../data/dictionary/6.json`),
  7: fs.readFileSync(`../data/dictionary/7.json`),
  8: fs.readFileSync(`../data/dictionary/8.json`),
  9: fs.readFileSync(`../data/dictionary/9.json`),
  10: fs.readFileSync(`../data/dictionary/10.json`),
  11: fs.readFileSync(`../data/dictionary/11.json`),
  12: fs.readFileSync(`../data/dictionary/12.json`),
  13: fs.readFileSync(`../data/dictionary/13.json`),
  14: fs.readFileSync(`../data/dictionary/14.json`),
  15: fs.readFileSync(`../data/dictionary/15.json`),
  16: fs.readFileSync(`../data/dictionary/16.json`),
  17: fs.readFileSync(`../data/dictionary/17.json`),
};

let categoriesJSON = [];

_.forEach(Object.keys(categories), (ele) => {
  categoriesJSON.push(JSON.parse((categories[ele])));
});

const refiner = function () {

  let refinedArr = [];
  let refinedObj;
  let wordList;

  _.forEach(dataArr, (dataObj) => {
    refinedObj = {};
    wordList = [];
    let category = dataObj['category'];
    let title = dataObj['title'];
    refinedObj['no'] = dataObj['no'];
    refinedObj['title'] = title;
    refinedObj['count'] = dataObj['count'];
    refinedObj['category'] = category;
    refinedObj['dayIndex'] = dataObj['dayIndex'];
    let words = categoriesJSON[category - 1];
    _.forEach(Object.keys(words), (word) => {
      if (title.indexOf(word) !== -1) wordList.push(word);
      else if (dataObj['content'].indexOf(word) !== -1) wordList.push(word);
    });
    refinedObj['keywords'] = wordList;
    refinedArr.push(refinedObj);
  });

  fs.writeFileSync(`../data/petition/refined.second.minCount(${minCount})_long.json`,
    JSON.stringify(refinedArr, null, 4), (error) => {
  });
  fs.writeFileSync(`../data/petition/refined.second.minCount(${minCount})_short.json`,
    JSON.stringify(refinedArr), (error) => {
    });
};

refiner();



