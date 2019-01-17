<template lang="pug">
  .display-content-container(v-if="visibility")
    .display-content-category.disable-select {{ content_category }}
    .display-content-count-wrapper
      .display-content-count-container
        .display-content-count {{ count_over }}
        .display-content-threshold.disable-select 1K
          i.display-content-count-sign-over.material-icons.disable-select arrow_upward
          i.display-content-count-sign-under.material-icons.disable-select arrow_downward
        .display-content-count {{ count_under }}
    .display-content-graph-container
      svg(width="100%" height="100%").svg-test
        template(v-for="node in node_over" v-if="scatter_state")
          circle(:cx="node.x" :cy="node.y" :r="node.r" :fill="(!content_disable && !node.selected) ? '#f4f4f4' : content_color" :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.7").node-circle
        template(v-for="node in node_under" v-if="scatter_state")
          circle(:cx="node.x" :cy="node.y" :r="node.r" :fill="(!content_disable && !node.selected) ? '#f4f4f4' : content_color" :fill-opacity="(!content_disable && !node.selected) ? 1 : 0.4").node-circle
        template(v-for="node in node_over" v-if="!scatter_state")
          rect(:x="node.x" y="calc(50% - 53px)" width="2.5px" height="50px" :fill="(!content_disable && !node.selected) ? '#f4f4f4' : content_color" fill-opacity="0.01")
        template(v-for="node in node_under" v-if="!scatter_state")
          rect(:x="node.x" y="calc(50% + 3px)" width="2.5px" height="50px" :fill="(!content_disable && !node.selected) ? '#f4f4f4' : content_color" fill-opacity="0.01")
        rect(x="15px" y="calc(50% - 3px)" width="calc(100% - 30px)" height="6px" :fill="content_color" fill-opacity="0.2")

</template>

<script>

export default {
  name: 'display_component',
  data() {
    return {
      underNodeList: [],
      overNodeList: [],
    }
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
  }
};
</script>

<style scoped lang="sass">
.display-content-container
  width: 100%
  height: 180px
  display: flex
  border-bottom: 1px solid #dedede
  line-height: 180px
  background: #FFFFFF
  transition: 0.2s
  &:hover
    background: rgba(190, 190, 190, 0.22)
    transition: 0.2s
  .display-content-category
    width: 120px
    height: 100%
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

