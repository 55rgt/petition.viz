<template lang="pug">
  .nav-category-container.disable-select(@click="toggleCategory")
    .nav-category-check-container(:class="{ activeCategory: category_state }"
    :style="{ background: (category_state ? category_color : '#FFFFFF'), border: (category_state ?  'none' : '2px solid #BEBEBE')}")
      i.material-icons.nav-category-check(v-if="category_state") check
    .nav-category-text {{ category_title }}
</template>

<script>
export default {
  name: 'category_component',
  props: {
    category_title: {
      type: String,
      required: true
    },
    category_color: {
      type: String,
      required: true
    },
    category_category: {
      type: Number,
      required: true
    },
    category_state: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleCategory() {
      this.$emit('toggleCategory', this.category_category);
    }
  }
};
</script>

<style scoped lang="sass">
.nav-category-container
  width: 100%
  height: 48px
  padding: 12px 24px 12px 48px
  display: flex
  &:hover
    background: #f5f5f5
  .nav-category-check-container
    width: 24px
    height: 100%
    margin-right: 18px
    border-radius: 4px
    .nav-category-check
      width: 24px
      height: 100%
      line-height: 24px
      font-size: 18px
      font-weight: bold
      text-align: center
      color: #FFFFFF
  .nav-category-text
    flex: 1
    text-align: left
    font-size: 18px
    line-height: 24px
</style>
