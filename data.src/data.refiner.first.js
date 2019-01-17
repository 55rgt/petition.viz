const fs = require('fs');
const _ = require('lodash');
let data = fs.readFileSync('../data/petition/original.json');
let json = JSON.parse(data);
let keys = Object.keys(json);

const categoryIndex = {
  '안전/환경': 1,
  '미래': 2,
  '일자리': 3,
  '보건복지': 4,
  '정치개혁': 5,
  '경제민주화': 6,
  '인권/성평등': 7,
  '외교/통일/국방': 8,
  '육아/교육': 9,
  '문화/예술/체육/언론': 10,
  '반려동물': 11,
  '교통/건축/국토': 12,
  '행정': 13,
  '농산어촌': 14,
  '저출산/고령화대책': 15,
  '성장동력': 16,
  '기타': 17
};
// original 파일을 refiner 파일로 바꾼다.
// first:

let minCount = 20;
let refinedArr = [];


const refiner = function (minCount) {

  let datum;
  let refinedObj;
  let key;
  let dateArr;
  let startDate = { year: 2017, month: 9, day: 1 };
  let endDate;
  let dayIndex;

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    datum = json[key];
    endDate = {};
    dateArr = datum['start'].split('-');
    endDate['year'] = dateArr[0];
    endDate['month'] = dateArr[1];
    endDate['day'] = dateArr[2];
    dayIndex = dateDuration(startDate, endDate);
    if(datum['count'] < minCount || dayIndex < 0 || dayIndex >= 365) continue;
    refinedObj = {};
    refinedObj['no'] = parseInt(key);
    refinedObj['title'] = datum['title'];
    refinedObj['count'] = datum['count'];
    refinedObj['category'] = categoryIndex[datum['category']];
    refinedObj['content'] = datum['content'];
    refinedObj['dayIndex'] = dayIndex;
    refinedArr.push(refinedObj);
  }

  fs.writeFileSync(`../data/petition/refined.first.minCount(${minCount}).json`,
    JSON.stringify(refinedArr, null, 4), (error) => {
  });
};

const dateDuration = (startDate, endDate) => {

  let leap;
  let dayPassed = 0;
  let monthState = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };

  for (let yr = startDate.year; yr < endDate.year; yr++) {
    leap = (yr % 400 === 0 ? 1 : yr % 100 === 0 ? 0 : yr % 4 === 0 ? 1 : 0);
    monthState[2] = 28 + leap;
    dayPassed += 365 + leap;
  }
  for (let mt = 1; mt < startDate.month; mt++)
    dayPassed -= (mt !== 2 ? monthState[mt] : 28 + (startDate.year % 400 === 0 ? 1 : startDate.year % 100 === 0 ? 0 : startDate.year % 4 === 0 ? 1 : 0));
  for (let d = 1; d <= startDate.day; d++) dayPassed--;
  for (let mt = 1; mt < endDate.month; mt++)
    dayPassed += (mt !== 2 ? monthState[mt] : 28 + (endDate.year % 400 === 0 ? 1 : endDate.year % 100 === 0 ? 0 : endDate.year % 4 === 0 ? 1 : 0));
  for (let d = 1; d <= endDate.day; d++) dayPassed++;
  return dayPassed;

};

refiner(minCount);
