<template lang="pug">
  .main-container
    .header
      .topic-title.disable-select Korean Petition Insights
      .topic-detail.disable-select - Did the government listen to the citizens' voices well?
    .body
      .nav-container
        .accordion-bar.disable-select(@click='expand("expandQuery")') Query
        transition(name="fade")
          .margin-top.nav-query-wrapper(v-if="expandQuery")
            .nav-keyword-search-container
              .nav-keyword-input-container
                input.nav-keyword-input(v-model="input.inputKeyword" placeholder="Add Keyword" v-on:keyup.enter="triggerAddKeyword")
                i.nav-keyword-search.material-icons.disable-select search
              .nav-keyword-disable-container
                .nav-keyword-disable-title.disable-select Disable
                .nav-keyword-disable-button-container
                  .nav-keyword-disable-button.disable-select(:class="{ button_selected: filterObj.disableState }" @click='toggleButton("query", true)') On
                  .vertical-line
                  .nav-keyword-disable-button.disable-select(:class="{ button_selected: !filterObj.disableState }" @click='toggleButton("query", false)') Off
            .nav-query-exp-wrapper
              .nav-query-exp-container
                .nav-query-exp-keyword.disable-select Keyword
                .nav-query-exp-radio.disable-select Must
                .nav-query-exp-radio.disable-select Not
                .nav-query-exp-radio.disable-select Maybe
            .nav-query-list-container
              query_component(v-for="queryComponent in component.queryComponentList" v-bind="queryComponent"
              v-on:removeKeyword="removeKeyword" v-on:selectQueryRadio="selectQueryRadio")
        .accordion-bar.disable-select(@click='expand("expandOption")') Option
        transition(name="fade")
          .margin-top.nav-option-wrapper(v-if="expandOption")
            .nav-option-container.disable-select
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
          .display-header-category.disable-select category
          .display-header-threshold-group.disable-select group
          .display-header-count.disable-select count
          .display-header-graph-bar
            svg(width="100%" height="100%").svg-display-header
              line(x1="24px" y1="50%" x2="798px" y2="50%" stroke-width="1" stroke="#727272")
              line(x1="24px" y1="25%" x2="24px" y2="75%" stroke-width="1" stroke="#727272")
              line(x1="798px" y1="25%" x2="798px" y2="75%" stroke-width="1" stroke="#727272")
        .display-content-list-container
          display_component(v-for="displayComponent in component.displayComponentList" v-bind="displayComponent")
      .vertical-line
      .detail-container
        .display-filter-state-container
        .display-category-info-container.b
        .display-keyword-info-list-container.b
        .display-related-post-list-container.b


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

const MINIMUM = 30;
const KEYWORD_MUST = 1;
const KEYWORD_NOT = 2;
const THRESHOLD = 1000;

export default {
  name: 'MainPage',
  data() {
    return {
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
        equalizeState: false,
        scatterState: true
      },
      nodeOverList: [],
      nodeUnderList: []
    };
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
        ele['x'] = 15 + ele['dayIndex'] * 2.5;
        ele['y'] = Math.floor(75 * Math.random()) + 100;
        ele['r'] = Math.floor(2 * Math.random()) + 1;
        ele['selected'] = true;
      });
      that.nodeUnderList.push(under);
      let over = _.filter(PetitionData, (ele) => {
        return (ele.category === i && ele.count >= THRESHOLD);
      });
      _.forEach(over, (ele) => {
        ele['x'] = 15 + ele['dayIndex'] * 2.5;
        ele['y'] = Math.floor(73 * Math.random()) + 5;
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
        scatter_state: true
      });
    }
    console.log(that.component.categoryComponentList);
  },
  methods: {
    async expand(obj) {
      if (obj === 'expandCategory') {
        this.expandCategory = !this.expandCategory;
      } else if (obj === 'expandOption') {
        this.expandOption = !this.expandOption;
      } else if (obj === 'expandQuery') this.expandQuery = !this.expandQuery;
    },
    toggleCategory(categoryIdx) {
      let that = this;
      let selected = that.component.categoryComponentList.find((ele) => {
        return ele.category_category === categoryIdx;
      });
      selected.category_state = !selected.category_state;
      selected.category_state ?
        that.component.displayComponentList[categoryIdx - 1].visibility = true :
        that.component.displayComponentList[categoryIdx - 1].visibility = false;
      // 누른 순서대로 나와야 하는데 그게 안됨
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
      } else if (obj === 'equalize') {
        if (state !== that.filterObj.equalizeState) that.filterObj.equalizeState = !that.filterObj.equalizeState;
      } else if (obj === 'scatter') {
        if (state !== that.filterObj.scatterState) {
          that.filterObj.scatterState = !that.filterObj.scatterState;
          console.log(that.filterObj.scatterState);
          _.forEach(that.component.displayComponentList, (ele) => {
            ele.scatter_state = that.filterObj.scatterState;
          });
        }
      }
      console.log(that.filterObj);
    },
    selectQueryRadio(title, radioIndex) {
      const that = this;
      let selected = that.component.queryComponentList.find((ele) => {
        return ele.keyword_title === title;
      });
      selected.radio_selected = radioIndex;
      that.filterObj.inputKeywords[title] = radioIndex;
      console.log(that.filterObj.inputKeywords);
      that.updateNodeByQuery();
    },
    removeKeyword(title) {
      const that = this;
      that.component.queryComponentList
        = _.filter(that.component.queryComponentList, (ele) => {
        return ele.keyword_title !== title;
      });
      delete that.filterObj.inputKeywords[title];
      console.log(that.filterObj.inputKeywords);
      that.updateNodeByQuery();
    },
    triggerAddKeyword: _.debounce(function () {
      this.addKeyword();
    }, 100),
    async addKeyword() {
      const that = this;
      let trimmed = that.input.inputKeyword.trim();
      that.input.inputKeyword = '';
      if (trimmed.length !== 0) {
        that.component.queryComponentList.push({
          keyword_title: trimmed,
          radio_selected: KEYWORD_MUST
        });
        that.filterObj.inputKeywords[trimmed] = KEYWORD_MUST;
      }
      console.log(that.filterObj.inputKeywords);
      that.updateNodeByQuery();
    },
    updateNodeByQuery() {
      let that = this;
      console.log(that.filterObj.inputKeywords);
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
    }
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
    padding: 12px 12px 12px 24px
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
      height: 24px
      padding-left: 12px
      line-height: 52px
      font-size: 16px
      font-weight: 400
      font-family: 'Source Sans Pro', sans-serif
      color: #ffffff
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
              border: 0.5px solid rgba(117, 117, 117, 0.8)
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
      overflow-y: scroll
      .display-header
        width: 100%
        height: 60px
        display: flex
        border-bottom: 1px solid #dedede
        .display-header-category
          width: 120px
          height: 100%
          line-height: 60px
          cursor: pointer
        .display-header-threshold-group
          width: 90px
          height: 100%
          line-height: 60px
          cursor: pointer
        .display-header-count
          width: 90px
          height: 100%
          line-height: 60px
          cursor: pointer
        .display-header-graph-bar
          flex: 1
          height: 100%
      .display-content-list-container
        width: 100%
        height: auto
    .detail-container
      width: 450px
      height: 100%
      .display-filter-state-container
        width: 100%
        height: 60px
      .display-category-info-container
        width: 100%
        height: 288px
      .display-keyword-info-list-container
        width: 100%
        height: 360px
      .display-related-post-list-container
        width: 100%
        height: 300px

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
