<template lang="pug">
  .main-container.b
    .header.disable-select
      .topic-title Korean Petition Insights
      .topic-detail - Did the government listen to the citizens' voices well?
      .topic-resolution ( This Visualization Is Designed For Resolution 1920px × 1080px. )
    .body
      .nav-container
        .accordion-bar.disable-select(@click='expand("expandQuery")') Query
        transition(name="fade")
          .margin-top.nav-query-wrapper(v-if="expandQuery")
            .nav-keyword-search-container
              .nav-keyword-input-container
                input.nav-keyword-input(v-model="input.inputKeyword" placeholder="Add Keyword" v-on:keyup.enter="triggerAddKeyword")
                i.nav-keyword-search.material-icons search
              .nav-keyword-disable-container.disable-select
                .nav-keyword-disable-title Disable
                .nav-keyword-disable-button-container
                  .nav-keyword-disable-button(:class="{ button_selected: filterObj.disableState }" @click='toggleButton("query", true)') On
                  .vertical-line
                  .nav-keyword-disable-button(:class="{ button_selected: !filterObj.disableState }" @click='toggleButton("query", false)') Off
            .nav-query-exp-wrapper
              .nav-query-exp-container.disable-select
                .nav-query-exp-keyword Keyword
                .nav-query-exp-radio Must
                .nav-query-exp-radio Not
                .nav-query-exp-radio Maybe
            .nav-query-list-container
              query_component(v-for="queryComponent in component.queryComponentList" v-bind="queryComponent"
              v-on:removeKeyword="removeKeyword" v-on:selectQueryRadio="selectQueryRadio")
        .accordion-bar.disable-select(@click='expand("expandOption")') Option
        transition(name="fade")
          .margin-top.nav-option-wrapper(v-if="expandOption")
            .nav-option-container.disable-select
              .nav-option-title Scatter
              .nav-option-button-wrapper
                .nav-option-button-container
                  .nav-option-button(:class="{ button_selected: filterObj.scatterState }" @click='toggleButton("scatter", true)') On
                  .vertical-line
                  .nav-option-button(:class="{ button_selected: !filterObj.scatterState }" @click='toggleButton("scatter", false)') Off
        .accordion-bar.disable-select(@click='expand("expandCategory")') Category
        transition(name="fade")
          .margin-top.nav-category-wrapper.flex-wrap(v-if="expandCategory")
            category_component(v-for="categoryComponent in component.categoryComponentList" v-bind="categoryComponent" v-on:toggleCategory="toggleCategory")
      .vertical-line
      .display-container
        .display-header
          .display-header-category-container.disable-select
            .display-header-category category
            .display-header-category-info
              .display-header-posts Number of Posts
              .display-header-threshold Threshold Count
              .display-header-posts Number of Posts
          .display-header-graph-bar.disable-select
            .display-header-graph-header Timeline
            .display-header-graph-body
              svg(width="100%" height="100%").svg-header
                line(x1="0" y1="50%" x2="100%" y2="50%" stroke-width="4" stroke="#0078d7")
                rect(:x="controller.minCx - controller.width / 2" y="calc(50% - 15px)"
                rx="5" ry="5" :width="controller.width" :height="controller.height"
                fill="#0078d7" stroke="#0036a4" stroke-width="2" @mousedown="startDrag" @mousemove="doDrag")
                line(:x1="controller.minCx - 4" y1="50%" :x2="controller.minCx + 4" y2="50%"
                stroke-width="2.5" stroke="#0036a4")
                line(:x1="controller.minCx - 4" y1="calc(50% + 4.5px)" :x2="controller.minCx + 4"
                y2="calc(50% + 4.5px)" stroke-width="2.5" stroke="#0036a4")
                line(:x1="controller.minCx - 4" y1="calc(50% - 4.5px)" :x2="controller.minCx + 4"
                y2="calc(50% - 4.5px)" stroke-width="2.5" stroke="#0036a4")
                rect(:x="controller.maxCx - controller.width / 2" y="calc(50% - 15px)"
                rx="5" ry="5" :width="controller.width" :height="controller.height"
                fill="#0078d7" stroke="#0036a4" stroke-width="2")
                line(:x1="controller.maxCx - 4" y1="50%" :x2="controller.maxCx + 4" y2="50%"
                stroke-width="2.5" stroke="#0036a4")
                line(:x1="controller.maxCx - 4" y1="calc(50% + 4.5px)" :x2="controller.maxCx + 4"
                y2="calc(50% + 4.5px)" stroke-width="2.5" stroke="#0036a4")
                line(:x1="controller.maxCx - 4" y1="calc(50% - 4.5px)" :x2="controller.maxCx + 4"
                y2="calc(50% - 4.5px)" stroke-width="2.5" stroke="#0036a4")
        .display-content-list-container
          display_component(v-for="displayComponent in component.displayComponentList" v-bind="displayComponent" v-on:getDetail="getDetail")
      .vertical-line
      .detail-container.disable-select
        .display-detail-header
        .display-top-keyword-wrapper
          .display-top-keyword-title Top 10 Keywords
          .display-top-keyword-list-wrapper
            .display-top-keyword-list-container
            .display-top-keyword-list-container
        .display-post-wrapper
          .display-post-title Posts
          .display-post-header
            .display-post-name Title
            .display-post-agreeCount Agree
            .display-post-period Period
          .display-post-list-container
            .display-post-list(v-for="(sortedNode, idx) in selectedPost" v-bind="sortedNode"
            :style="{background: idx % 2 === 0 ? `rgba(${parseInt(selectedColor.substring(1,3),16)},${parseInt(selectedColor.substring(3,5),16)},${parseInt(selectedColor.substring(5,7),16)}, 0.2)` : '#ffffff'}")
              .display-post-name {{ sortedNode.title }}
              .display-post-agreeCount {{ sortedNode.count }}
              .display-post-period Period

</template>

<script>

import Vue from 'vue';
import _ from 'lodash';
import category from '../../data/front/category';
import PetitionData from '../../data/petition/refined.second.minCount(30)_short.json';
import CategoryComponent from '../components/category.component';
import QueryComponent from '../components/query.component';
import DisplayComponent from '../components/display.component';

Vue.component(CategoryComponent.name, CategoryComponent);
Vue.component(QueryComponent.name, QueryComponent);
Vue.component(DisplayComponent.name, DisplayComponent);

const KEYWORD_MUST = 1;
const KEYWORD_NOT = 2;
const THRESHOLD = 1000;
const NONE = 0;
const LEFT = -1;
const RIGHT = 1;

export default {
  name: 'MainPage',
  data() {
    return {
      // 1에서 시작 ~ 898에서 끝
      controller: {
        width: 12,
        height: 30,
        minCx: 7,
        maxCx: 890
      },
      dragging: false,
      expandCategory: false,
      expandOption: false,
      expandQuery: false,
      threshold: THRESHOLD,
      component: {
        categoryComponentList: [],
        queryComponentList: [],
        displayComponentList: []
      },
      input: {
        inputKeyword: ''
      },
      filterObj: {
        inputKeywords: {},
        disableState: false,
        scatterState: true
      },
      nodeOverList: [],
      nodeUnderList: [],
      topOver: [],
      topUnder: [],
      selectedPost: [],
      selectedColor: null,
    };
  },
  mounted() {
    let that = this;
    window.addEventListener('mouseup', that.stopDrag);
  },
  created() {
    let that = this;
    that.expandCategory = false;
    that.expandOption = false;
    that.expandQuery = false;
    for (let i = 1; i <= 17; i++) {
      that.component.categoryComponentList.push({
        category_title: category[i].title,
        category_color: category[i].color,
        category_category: i,
        category_state: false
      });
    }
    for (let i = 1; i <= 17; i++) {
      let under = _.filter(PetitionData, (ele) => {
        return (ele.category === i && ele.count < THRESHOLD);
      });
      _.forEach(under, (ele) => {
        ele['x'] = 6 + ele['dayIndex'] * (898 - 6) / 364;
        ele['y'] = Math.floor(75 * Math.random()) + 95;
        ele['r'] = Math.floor(2 * Math.random()) + 1;
        ele['selected'] = true;
      });
      that.nodeUnderList.push(under);
      let over = _.filter(PetitionData, (ele) => {
        return (ele.category === i && ele.count >= THRESHOLD);
      });
      _.forEach(over, (ele) => {
        ele['x'] = 6 + ele['dayIndex'] * (898 - 6) / 364;
        ele['y'] = Math.floor(70 * Math.random()) + 10;
        ele['r'] = Math.floor(4 * Math.random()) + 3;
        ele['selected'] = true;
      });
      that.nodeOverList.push(over);
    }
    for (let i = 1; i <= 17; i++) {
      that.component.displayComponentList.push({
        content_idx: i,
        content_category: category[i].title,
        content_color: category[i].color,
        content_threshold: THRESHOLD,
        node_over: that.nodeOverList[i - 1],
        node_under: that.nodeUnderList[i - 1],
        count_over: that.nodeOverList[i - 1].length,
        count_under: that.nodeUnderList[i - 1].length,
        visibility: false,
        content_disable: that.filterObj.disableState,
        scatter_state: that.filterObj.scatterState
      });
    }
  },
  methods: {
    startDrag(event) {
      console.log("startDrag");
      let that = this;
      that.dragging = true;


    },
    stopDrag() {
      console.log("EndDrag");
      let that = this;
      that.dragging = false;
    },
    doDrag(event) {
      let that = this;
      if (that.dragging) {
        that.controller.minCx = event.clientX - 551;
        console.log(that.controller.minCx, event.clientX);
      }
    },
    async expand(obj) {
      if (obj === 'expandCategory') {
        this.expandCategory = !this.expandCategory;
      } else if (obj === 'expandOption') {
        this.expandOption = !this.expandOption;
      } else if (obj === 'expandQuery') this.expandQuery = !this.expandQuery;
    },
    toggleCategory(categoryIdx) {
      console.log('toggle');
      let that = this;
      let selected = that.component.categoryComponentList.find((ele) => {
        return ele.category_category === categoryIdx;
      });
      selected.category_state = !selected.category_state;
      selected.category_state ?
        that.component.displayComponentList[categoryIdx - 1].visibility = true :
        that.component.displayComponentList[categoryIdx - 1].visibility = false;
    },
    toggleButton(obj, state) {
      let that = this;
      if (obj === 'query') {
        if (state !== that.filterObj.disableState) {
          that.filterObj.disableState = !that.filterObj.disableState;
          _.forEach(that.component.displayComponentList, (ele) => {
            ele.content_disable = that.filterObj.disableState;
          });
        }
      }
      else if (obj === 'scatter') {
        if (state !== that.filterObj.scatterState) {
          that.filterObj.scatterState = !that.filterObj.scatterState;
          _.forEach(that.component.displayComponentList, (ele) => {
            ele.scatter_state = that.filterObj.scatterState;
          });
        }
      }
    },
    selectQueryRadio(title, radioIndex) {
      const that = this;
      let selected = that.component.queryComponentList.find((ele) => {
        return ele.keyword_title === title;
      });
      selected.radio_selected = radioIndex;
      that.filterObj.inputKeywords[title] = radioIndex;
      that.updateNodeByQuery();
    },
    removeKeyword(title) {
      const that = this;
      that.component.queryComponentList
        = _.filter(that.component.queryComponentList, (ele) => {
        return ele.keyword_title !== title;
      });
      delete that.filterObj.inputKeywords[title];
      that.updateNodeByQuery();
    },
    triggerAddKeyword: _.debounce(function () {
      this.addKeyword();
    }, 100),
    async addKeyword() {
      const that = this;
      let trimmed = that.input.inputKeyword.trim();
      that.input.inputKeyword = '';
      if (trimmed.length !== 0 && !Object.keys(that.filterObj.inputKeywords)
        .includes(trimmed)) {
        that.component.queryComponentList.push({
          keyword_title: trimmed,
          radio_selected: KEYWORD_MUST
        });
        that.filterObj.inputKeywords[trimmed] = KEYWORD_MUST;
      }
      that.updateNodeByQuery();
    },
    updateNodeByQuery() {
      let that = this;
      for (let i = 1; i <= 17; i++) {
        let nodeList = that.nodeOverList[i - 1];
        let filtered = that.nodeOverList[i - 1];
        _.forEach(nodeList, (node) => {
          node.selected = false;
        });
        _.forEach(Object.keys(that.filterObj.inputKeywords), (keyword) => {
          let state = that.filterObj.inputKeywords[keyword];
          if (state === KEYWORD_MUST) {
            filtered = _.filter(filtered, (ele) => {
              return ele.keywords.includes(keyword);
            });
          }
          else if (state === KEYWORD_NOT) {
            filtered = _.filter(filtered, (ele) => {
              return !ele.keywords.includes(keyword);
            });
          }
        });
        _.forEach(filtered, (ele) => {
          ele.selected = true;
        });
        let newOne = _.orderBy(_.unionBy(filtered, nodeList, 'no'), ['selected', 'count'], ['asc', 'desc']);
        that.component.displayComponentList[i - 1].node_over = newOne;
        that.component.displayComponentList[i - 1].count_over = filtered.length;
      }
      for (let i = 1; i <= 17; i++) {
        let nodeList = that.nodeUnderList[i - 1];
        let filtered = that.nodeUnderList[i - 1];
        _.forEach(nodeList, (node) => {
          node.selected = false;
        });
        _.forEach(Object.keys(that.filterObj.inputKeywords), (keyword) => {
          let state = that.filterObj.inputKeywords[keyword];
          if (state === KEYWORD_MUST) {
            filtered = _.filter(filtered, (ele) => {
              return ele.keywords.includes(keyword);
            });
          }
          else if (state === KEYWORD_NOT) {
            filtered = _.filter(filtered, (ele) => {
              return !ele.keywords.includes(keyword);
            });
          }
        });
        _.forEach(filtered, (ele) => {
          ele.selected = true;
        });
        let newOne = _.orderBy(_.unionBy(filtered, nodeList, 'no'), ['selected', 'count'], ['asc', 'desc']);
        that.component.displayComponentList[i - 1].node_under = newOne;
        that.component.displayComponentList[i - 1].count_under = filtered.length;
      }
    },
    getDetail(categoryNumber, overArr, underArr, sortedWhole) {

      let that = this;
      /*
       topOver: [],
       topUnder: [],
       selectedPost: [],
       selectedCategoryNumber: null
       */
      that.selectedPost = sortedWhole;
      that.selectedColor = category[categoryNumber].color;
    },
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import url('https://fonts.googleapis.com/css?family=Playfair+Display:400,700')
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300')
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro')
.main-container
  width: 1920px
  height: 1080px
  .header
    width: 100%
    height: 72px
    padding: 12px 24px
    display: flex
    box-shadow: 0 1px 10px 0 rgba(102, 102, 102, 1)
    background: #202123
    .topic-title
      width: auto
      height: 100%
      line-height: 48px
      font-size: 30px
      font-weight: bold
      color: #ffffff
      font-family: 'Playfair Display', serif
    .topic-detail
      width: auto
      height: 100%
      padding-left: 12px
      line-height: 52px
      font-size: 16px
      font-weight: 400
      font-family: 'Source Sans Pro', sans-serif
      color: #ffffff
    .topic-resolution
      flex: 1
      line-height: 52px
      font-size: 12px
      font-weight: 400
      font-style: italic
      font-family: 'Source Sans Pro', sans-serif
      color: #ffffff
      text-align: right
  .body
    width: 100%
    height: calc(100% - 72px)
    display: flex
    .nav-container
      width: 312px
      height: 100%
      overflow-y: scroll
      .nav-category-wrapper
        width: 100%
        height: auto
      .nav-option-wrapper
        width: 100%
        height: auto
        .nav-option-container
          width: 100%
          padding: 9px 24px 9px 48px
          height: 54px
          display: flex
          &:hover
            background: #f5f5f5
          .nav-option-title
            width: 108px
            height: 100%
            line-height: 36px
            text-align: left
          .nav-option-button-wrapper
            flex: 1
            height: 100%
            padding: 6px 0
            display: flex
            align-items: center
            justify-content: center
            .nav-option-button-container
              flex: 1
              height: 100%
              display: flex
              border-radius: 2px
              border: 0.5px solid rgba(117, 117, 117, 0.8)
              .nav-option-button
                flex: 1
                height: 100%
                line-height: 22px
                font-size: 12px
                cursor: pointer
              .vertical-line
                border: 0.5px solid rgba(117, 117, 117, 0.8)
      .nav-query-wrapper
        width: 100%
        height: auto
        .nav-keyword-search-container
          width: 100%
          height: 42px
          padding: 0 24px
          display: flex
          .nav-keyword-input-container
            width: 180px
            height: 100%
            border-radius: 2px
            border: 2px solid #dedede
            display: flex
            padding: 0 0 0 12px
            align-items: center
            justify-content: center
            margin-right: 24px
            .nav-keyword-input
              width: calc(100% - 42px)
              height: calc(100% - 2px)
              color: #828282
              font-size: 14px
              border: none
              outline: none
            .nav-keyword-search
              flex: 1
              height: 100%
              color: #828282
              line-height: 40px
              cursor: pointer
          .nav-keyword-disable-container
            flex: 1
            height: 100%
            .nav-keyword-disable-title
              width: 100%
              height: 18px
              font-size: 6px
              line-height: 18px
            .nav-keyword-disable-button-container
              width: 100%
              height: 24px
              display: flex
              border-radius: 2px
              border: 1px solid rgba(117, 117, 117, 0.8)
              .nav-keyword-disable-button
                flex: 1
                height: 100%
                font-size: 12px
                cursor: pointer
                line-height: 24px
              .vertical-line
                border: 0.5px solid rgba(117, 117, 117, 0.8)
        .nav-query-exp-wrapper
          width: 100%
          height: 42px
          padding: 6px 24px
          .nav-query-exp-container
            width: 100%
            height: 100%
            display: flex
            border-bottom: 1px solid #dedede
            .nav-query-exp-keyword
              width: 60px
              height: 100%
              text-align: left
              font-size: 12px
              line-height: 28px
            .nav-query-exp-radio
              width: 54px
              height: 100%
              text-align: center
              font-size: 12px
              line-height: 28px
        .nav-query-list-container
          width: 100%
          height: auto
          padding: 6px 24px
    .vertical-line
      border: 0.5px solid #E0E0E0
    .display-container
      width: calc(100% - 312px - 450px)
      height: 100%
      padding: 0 24px
      overflow-y: scroll
      .display-header
        width: 100%
        height: 144px
        padding: 30px 0
        display: flex
        border-bottom: 1px solid #dedede
        .display-header-category-container
          width: 210px
          height: 100%
          display: flex
          .display-header-category
            width: 66px
            height: 100%
            line-height: 81px
            font-size: 10px
            border: 0.3px solid #b8b8b8
          .display-header-category-info
            flex: 1
            padding-left: 12px
            .display-header-posts
              width: 100%
              height: 24px
              text-align: left
              line-height: 24px
              font-size: 10px
            .display-header-threshold
              width: 100%
              height: 36px
              text-align: left
              line-height: 36px
              font-size: 14px
        .display-header-graph-bar
          flex: 1
          height: 100%
          .display-header-graph-header
            width: 100%
            height: 30px
            line-height: 15px
            font-size: 21px
            text-align: left
          .display-header-graph-body
            width: 100%
            height: calc(100% - 30px)
      .display-content-list-container
        width: 100%
        height: auto
    .detail-container
      width: 450px
      height: 100%
      .display-detail-header
        width: 100%
        height: 36px
        padding: 0 24px
        text-align: left
        line-height: 60px
        font-size: 24px
        color: #606368
      .display-top-keyword-wrapper
        width: 100%
        height: 510px
        padding: 12px 24px
        .display-top-keyword-title
          width: 100%
          height: 36px
          text-align: left
          line-height: 27px
          border-bottom: 1px solid #dedede
          color: #606368
          font-size: 20px
        .display-top-keyword-list-wrapper
          width: 100%
          height: calc(100% - 36px)
          display: flex
          .display-top-keyword-list-container
            flex: 1
      .display-post-wrapper
        width: 100%
        height: 462px
        padding: 24px
        .display-post-title
          width: 100%
          height: 36px
          text-align: left
          line-height: 27px
          margin-bottom: 12px
          border-bottom: 1px solid #dedede
          color: #606368
          font-size: 20px
        .display-post-header
          width: 100%
          height: 36px
          display: flex
          .display-post-name
            width: 216px
            height: 100%
            line-height: 36px
            font-size: 14px
          .display-post-agreeCount
            width: 78px
            height: 100%
            line-height: 36px
            font-size: 14px
          .display-post-period
            flex: 1
            height: 100%
            line-height: 36px
            font-size: 14px
        .display-post-list-container
          width: 100%
          height: calc(100% - 36px - 48px)
          overflow-y: scroll
          .display-post-list
            width: 100%
            height: 27px
            display: flex
            .display-post-name
              width: 216px
              height: 100%
              line-height: 27px
              font-size: 12px
              text-align: left
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
              padding-left: 12px
            .display-post-agreeCount
              width: 78px
              height: 100%
              font-size: 12px
              line-height: 27px
              padding: 0 6px
              text-align: center
            .display-post-period
              flex: 1
              font-size: 12px
              line-height: 27px
              padding: 0 6px
              text-align: center
.b
  border: 1px solid black

.flex-wrap
  display: flex
  flex-wrap: wrap

.nav-section-container
  margin: 12px 0
  border-radius: 12px
  box-shadow: 3px 3px 3px 2px rgb(213, 222, 229)
  padding: 12px

.disable-select
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

.margin-top
  margin-top: 12px

.button_selected
  background: #666666
  color: #eaeaea

.fade-enter-active
  transition: opacity .5s

.fade-leave-active
  transition: opacity .2s

.fade-enter, .fade-leave-to
  opacity: 0

.accordion-bar
  width: 100%
  height: 60px
  margin-top: 24px
  padding-left: 24px
  line-height: 60px
  text-align: left
  cursor: pointer
  color: #606368
  background: #ffffff
  &:hover
    color: #222325
    background: #f5f5f5
</style>
