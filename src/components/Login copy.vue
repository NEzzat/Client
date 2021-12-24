<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form>
                <v-select
                  prepend-icon="mdi-calendar"
                  :items="SY"
                  item-text="SY"
                  item-value="SY"
                  v-model="Formuser.SY"
                  required
                  label="SY"
                >
                </v-select>
                <v-text-field
                  prepend-icon="mdi-account"
                  name="user"
                  id="user"
                  type="text"
                  v-model="Formuser.Email"
                  required
                  label="User"
                >
                </v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  name="password"
                  label="Password"
                  v-model="Formuser.Password"
                  id="password"
                  type="password"
                >
                </v-text-field>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="Login(user)" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import server from "../server";
import SY from "../mixins/SYmixin";
export default {
  name: "Login",
  mixins: [SY],
  data: () => ({
    SchoolYears: [],
    Formuser: { SY: "", Email: "", Password: "" },
  }),
  methods: {
    async Getpassword(user) {
      try {
        return await axios.get(
          "http://" + server.IP + ":" + server.port + "/admissionLogin/" + user
        );
      } catch (err) {
        console.log(err);
      }
    },
    async Login() {
      // await this.$store.dispatch("Login", this.Formuser.Email);
      let UserPassword = await this.Getpassword(this.Formuser.Email);
      if (UserPassword.data[0].Password === this.Formuser.Password) {
        this.$store.dispatch("LoadUser", UserPassword.data[0]);
        this.$store.dispatch("LoadSY", this.Formuser.SY);
        this.$store.dispatch("LoadAccess", UserPassword.data[0].UserID);
        // this.$emit("UserLoged");
      } else {
        console.log("user Not Loged in");
      }
    },
  },
  computed: {
    ...mapState(["user", "userID", "userName", "Password", "Group", "Access"]),
  },
  created: function () {},
};
</script>
