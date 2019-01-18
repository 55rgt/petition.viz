<template lang="pug">
  .display-content-container(v-if="visibility" :style="{border: `0.5px solid rgba(${parseInt(content_color.substring(1,3),16)},${parseInt(content_color.substring(3,5),16)},${parseInt(content_color.substring(5,7),16)}, 0.2)`}")
    .display-content-category.disable-select(@click="getDetail" :style="{background: `rgba(${parseInt(content_color.substring(1,3),16)},${parseInt(content_color.substring(3,5),16)},${parseInt(content_color.substring(5,7),16)}, 0.2)`}") {{ content_category }}
    .display-content-count-wrapper(:style="{borderRight: `1px solid rgba(${parseInt(content_color.substring(1,3),16)},${parseInt(content_color.substring(3,5),16)},${parseInt(content_color.substring(5,7),16)}, 0.2)`}")
      .display-content-count-container.disable-select
        .display-content-count {{ count_over }}
        .display-content-threshold 1K
          i.display-content-count-sign-over.material-icons arrow_upward
          i.display-content-count-sign-under.material-icons arrow_downward
        .display-content-count {{ count_under }}
    .display-content-graph-container
      svg(width="100%" height="100%").svg-test
        rect(x="0" y="calc(50% - 2px)" width="100%" height="4" :fill="content_color" fill-opacity="0.2")
        template(v-for="node in node_over" v-if="scatter_state")
          circle(:cx="node.x" :cy="node.y" :r="node.r"
          :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color"
          :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.6"
          @mouseover="overCircle(node)" @mouseleave="leaveCircle()").node-circle
        template(v-for="node in node_under" v-if="scatter_state")
          circle(:cx="node.x" :cy="node.y" :r="node.r"
          :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color"
          :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.25"
          @mouseover="overCircle(node)" @mouseleave="leaveCircle()").node-circle
        template(v-for="node in node_over" v-if="!scatter_state")
          rect(:x="node.x - 0.5 * (898 - 6)/364" y="calc(50% - 89px - 2px)" :width="(898 - 6)/364" height="89"
          :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" fill-opacity="0.02"
          @mouseover="overRect(node)" @mouseleave="leaveRect()")
        template(v-for="node in node_under" v-if="!scatter_state")
          rect(:x="node.x - 0.5 * (898 - 6)/364" y="calc(50% + 2px)" :width="(898 - 6)/364" height="89"
          :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" fill-opacity="0.02"
          @mouseover="overRect(node)" @mouseleave="leaveRect()")
      transition(name="fade")
        .tooltip-box(v-if="scatter_state && tooltipState && (hoveredCircle.selected || content_disable)"
        :style="{borderRadius: '5px 5px 0 5px', pointerEvents: 'none', width: `${tooltipWidth}px`, height:`${tooltipHeight}px`, background: content_color, position: 'absolute', top: `${hoveredCircle.y - tooltipHeight - tooltipMargin}px`, left: `${hoveredCircle.x - tooltipWidth - tooltipMargin}px` }")
          .tooltip-wrapper
            .tooltip-title Title: {{ hoveredCircle.title }}
            .tooltip-agree Agree: {{ hoveredCircle.count }}
            .tooltip-period Period: {{ hoveredCircle.dayIndex }}
        .rect-box(v-if="!scatter_state && rectState"
        :style="{borderRadius: '5px 5px 0 5px', pointerEvents: 'none', width: `${rectWidth}px`, height:`${rectHeight}px`, background: content_color, position: 'absolute', top: `${rectBoxPosY - rectHeight}px`, left: `${hoveredRect.x - rectWidth - tooltipMargin}px` }")

</template>

<script>

import _ from 'lodash';

export default {
  name: 'display_component',
  data() {
    return {
      tooltipWidth: 240,
      tooltipHeight: 90,
      tooltipMargin: 5,
      rectWidth: 180,
      rectHeight: 100,
      rectBoxPosY: null,
      hoveredCircle: null,
      hoveredRect: null,
      tooltipState: false,
      rectState: false,
      selectedRectList: [],
      rectStartDay: null,
      sumOfAgree: null,
      numOfPosts: null,
    };
  },
  props: {
    content_disable: {
      type: Boolean,
      required: false
    },
    content_idx: {
      type: Number,
      required: false
    },
    content_category: {
      type: String,
      required: false
    },
    content_color: {
      type: String,
      required: false
    },
    count_over: {
      type: Number,
      required: false
    },
    count_under: {
      type: Number,
      required: false
    },
    content_threshold: {
      type: Number,
      required: false
    },
    node_over: {
      type: Array,
      required: false
    },
    node_under: {
      type: Array,
      required: false
    },
    visibility: {
      type: Boolean,
      required: false
    },
    scatter_state: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    overRect: function (node) {
      let that = this;
      let filtered;
      that.rectState = true;
      that.hoveredRect = node;
      that.rectBoxPosY = event.clientY - 225;
      if(node.count < that.content_threshold) {
        that.content_disable ?
          filtered = that.node_under :
          filtered = _.filter(that.node_under, (ele) => { return ele.selected === true; });
      }
      else {
        that.content_disable ?
          filtered = that.node_over :
          filtered = _.filter(that.node_over, (ele) => { return ele.selected === true; });
      }
      that.sumOfAgree = _.sumBy(filtered, 'count');
      that.rectStartDay = node.dayIndex;
      that.numOfPosts = filtered.length;

    },
    leaveRect: function () {
      let that = this;
      that.rectState = false;
      that.hoveredRect = null;
      that.selectedRectList = [];

    },
    overCircle: function (node) {
      let that = this;
      that.hoveredCircle = node;
      that.tooltipState = true;
      console.log(that.hoveredCircle);
    },
    leaveCircle: function () {
      let that = this;
      that.hoveredCircle = null;
      that.tooltipState = false;
      console.log('leave');
    },
    getDetail() {
      let that = this;
      let overDict = {};
      let underDict = {};
      let overArr = [];
      let underArr = [];

      _.forEach(_.filter(that.node_over, (ele) => {
        return ele.selected;
      }), (single) => {
        _.forEach(single.keywords, (keyword) => {
          _.isNil(overDict[keyword]) ? overDict[keyword] = 1 : overDict[keyword] += 1;
        });
      });
      _.forEach(overDict, (value, key) => {
        overArr.push({ key, value });
      });

      overArr = _.slice(_.orderBy(overArr, ['value'], ['desc']), 0, 10);

      _.forEach(_.filter(that.node_under, (ele) => {
        return ele.selected;
      }), (single) => {
        _.forEach(single.keywords, (keyword) => {
          _.isNil(underDict[keyword]) ? underDict[keyword] = 1 : underDict[keyword] += 1;
        });
      });

      _.forEach(underDict, (value, key) => {
        underArr.push({ key, value });
      });

      underArr = _.slice(_.orderBy(underArr, ['value'], ['desc']), 0, 10);
      let sortedWhole = _.orderBy(_.union(that.node_over, that.node_under), ['count'], ['desc']);
      if(!that.content_disable) sortedWhole = _.filter(sortedWhole, (ele) => {
        return ele.selected;
      });
      that.$emit('getDetail', that.content_idx, overArr, underArr, sortedWhole);
    }
  }
};
</script>

<style scoped lang="sass">
.display-content-container
  width: 100%
  height: 180px
  margin: 12px 0
  display: flex
  background: #FFFFFF
  transition: 0.2s
  cursor: pointer
  &:hover
    background: rgba(190, 190, 190, 0.22)
    transition: 0.2s
  .display-content-category
    width: 120px
    height: 100%
    line-height: 180px
    overflow-y: hidden
    font-size: 10px
  .display-content-count-wrapper
    width: 90px
    height: 100%
    padding: 50px 0
    .display-content-count-container
      width: 100%
      height: 100%
      .display-content-count
        width: 100%
        height: 18px
        line-height: 18px
      .display-content-threshold
        width: 100%
        height: 42px
        line-height: 42px
        position: relative
        .display-content-count-sign-over
          position: absolute
          right: 0
          top: 0
          font-size: 12px
        .display-content-count-sign-under
          position: absolute
          right: 0
          bottom: 0
          font-size: 12px
  .display-content-graph-container
    flex: 1
    height: 100%
    position: relative
    .tooltip-box
      padding: 6px
      .tooltip-wrapper
        width: 100%
        height: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      .tooltip-title
        width: 100%
        height: 28px
        line-height: 28px
        font-size: 10px
        text-align: left
      .tooltip-agree
        width: 100%
        height: 25px
        line-height: 25px
        font-size: 10px
        text-align: left
      .tooltip-period
        width: 100%
        height: 25px
        line-height: 25px
        font-size: 10px
        text-align: left

.node-circle
  &:hover
    border: 1px solid black

.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0

.b
  border: 1px solid black

.disable-select
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none


</style>

