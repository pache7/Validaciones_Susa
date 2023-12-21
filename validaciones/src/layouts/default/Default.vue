<template>
  <v-app>
    <default-bar @drawerChange="onDrawerChange" />

    <default-view  :drawer="drawer"/>
  </v-app>
</template>

<script>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  export default {
     components:{
      DefaultBar,
      DefaultView 
     },
     data () {
    return {
      drawer: null
    }
 },
 methods: {
    onDrawerChange (value) {
      this.drawer = value
    }
 }
  }
</script>
