
<template>
  <div class="container ">
    <div class="d-flex justify-content-center">
    
      <div class="card text-center mt-5" style="width: 40rem;">
        <!-- <img src="require('./assets/Greenland.png')" class="card-img-top" alt="..."> -->
        <h5 class="card-header text-white bg-success">Login Form</h5>
        <div class="card-body">
          <div class="row justify-content-center">
          <div class="col-md-1">
            <label for="usr">User</label>
          </div>        
          <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                id="usr"
                v-model="User"
                placeholder="Login Name"
              />
          </div>
          <div class="col-md-2">
            <label for="pas">Password</label>
          </div>        
          <div class="col-md-3">
              <input
                type="password"
                class="form-control"
                id="pas"
                v-model="Password"
                placeholder="Password"
              />
          </div>        
        </div>
        </div>
        <div class="card-footer">  
          <button type="button" @click="Login()" class="btn btn-primary">Login</button>      
        </div>
        {{Massage}}
      </div>  
   
    </div>

    
    <!-- <div class="panel panel-success">
      <div class="panel-heading">
        <h4>Login Form</h4>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <span class="input-group-addon">User</span>
              <input type="text" class="form-control" v-model="User" placeholder="Login Name" />
            </div>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <span class="input-group-addon">Password</span>
              <input
                type="password"
                class="form-control"
                v-model="Password"
                placeholder="Your Password"
              />
            </div>
          </div>
        </div>
        <br />
        <button type="button" class="btn btn-danger" v-on:click.prevent="Login()">Login</button>
        <br />
        <input type="text" v-model="Massage" disabled />
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  data() {
    return {
      UserNo: 0,
      User: "",
      Massage: "",
      Password: "",
    };
  },
  methods: {
    Login() {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/UserLogin" +
            "/" +
            this.User
        )
        .then(
          (data) => {
            console.log(data.data)
            if (data.data.length > 0) {
              console.log(data.data)
              if (this.Password === data.data[0].Password) {
                this.$store.dispatch("LoadUser", data.data[0]);
                this.$emit("close-login");
              } else {
                this.Massage = "Wrong User or Password";
              }
            } else {
              this.Massage = "Wrong User or Password";
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
  },
  created: function () {},
};
</script>
<style scoped>
</style>
