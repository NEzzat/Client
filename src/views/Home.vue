<template>
  <div class="home">
    <Login v-if="ShowLogin" v-on:close-login="ShowLogin= false"></Login>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login";

export default {
  name: 'Home',
  components: {
    Login,
  },
  data() {
    return {
      ShowLogin: true,
    };
  },  
}
</script>
