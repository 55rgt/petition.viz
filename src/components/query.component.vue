<template lang="pug">
.nav-query-container
  .nav-query-keyword-container
    .nav-query-keyword.disable-select {{ keyword_title }}
  .nav-query-radio-list-container
    .nav-query-radio-container(v-for="n in 3")
      .nav-query-radio(@click="selectQueryRadio(n)")
        .nav-query-radio-inner(v-if="n === radio_selected")
  .nav-query-delete-container
    i.material-icons.nav-query-delete.disable-select(@click="removeKeyword") delete
</template>

<script>
export default {
  name: 'query_component',
  props: {
    keyword_title: {
      type: String,
      required: true
    },
    radio_selected: {
      type: Number,
      required: true
    }
  },
  methods: {
    selectQueryRadio(n) {
      if(n !== this.radio_selected) this.$emit('selectQueryRadio', this.keyword_title, n);
    },
    removeKeyword() {
      this.$emit('removeKeyword', this.keyword_title);
    }
  }
};
</script>

<style scoped lang="sass">
.nav-query-container
  width: 100%
  height: 30px
  margin: 3px 0
  display: flex
  .nav-query-keyword-container
    width: 60px
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    .nav-query-keyword
      width: 100%
      height: auto
      max-height: 100%
      font-size: 12px
      line-height: 30px
      text-align: left
      overflow-y: scroll
      font-weight: bold
  .nav-query-radio-list-container
    width: 162px
    height: 100%
    display: flex
    .nav-query-radio-container
      flex: 1
      display: flex
      align-items: center
      justify-content: center
      .nav-query-radio
        width: 16px
        height: 16px
        border-radius: 50%
        border: 2px solid #757575
        display: flex
        align-items: center
        justify-content: center
        cursor: pointer
        .nav-query-radio-inner
          width: 8px
          height: 8px
          border-radius: 50%
          background: #757575
  .nav-query-delete-container
    width: 24px
    height: 100%
    padding-left: 15px
    display: flex
    align-items: center
    justify-content: center
    .nav-query-delete
      width: 24px
      height: 24px
      line-height: 24px
      cursor: pointer
      color: #555555
      font-size: 20px
      &:hover
        color: #646464

.disable-select
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
</style>
