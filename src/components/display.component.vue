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
          circle(:cx="node.x" :cy="node.y" :r="node.r" :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.6").node-circle
        template(v-for="node in node_under" v-if="scatter_state")
          circle(:cx="node.x" :cy="node.y" :r="node.r" :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.25").node-circle
        template(v-for="node in node_over" v-if="!scatter_state")
          rect(:x="node.x - 0.5 * (898 - 6)/364" y="calc(50% - 89px - 2px)" :width="(898 - 6)/364" height="89" :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" fill-opacity="0.02")
        template(v-for="node in node_under" v-if="!scatter_state")
          rect(:x="node.x - 0.5 * (898 - 6)/364" y="calc(50% + 2px)" :width="(898 - 6)/364" height="89" :fill="(!content_disable && !node.selected) ? '#f7f7f7' : content_color" fill-opacity="0.02")
</template>

<script>

export default {
  name: 'display_component',
  data() {
    return {
      underNodeList: [],
      overNodeList: []
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
    getDetail() {
      let that = this;
      console.log("getDetail");
      that.$emit('getDetail', that.content_idx);
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
    .display-content-date-bar
      width: 100%
      height: 12px
      position: absolute
      top: calc(50% - 6px)
      border: 0.3px solid #cdcdcd

.b
  border: 1px solid black

.disable-select
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

</style>

