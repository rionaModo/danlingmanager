<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {

  },
  mounted: function () {

  },
  methods: {
 
  }
};
</script>

<style lang="scss">
  html{
    height: 100%;
    overflow: hidden;
    body{
      height: 100%;
    }
  }
  img{
    border: none;
  }
  img[src=""] {
    opacity: 0;
  }
#app {
  height: 100%;
  position: relative;
  overflow: hidden;
  .page{
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
  html{
    /*position: fixed;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*width: 100%;*/
  }
</style>
