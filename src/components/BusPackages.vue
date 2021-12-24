<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Year Bus Packages</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>        
  <form class="row g-3 ">
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="BusPackage.SY" @change="fetchBusPackages(BusPackage.SY,GroupNo,SchoolNo)" class="form-select col-2" id="SY">
        <option v-for="SY in syyears" v-bind:value="SY.SY" :key="SY.SY">{{SY.SY}}</option>
      </select>
    </div>
    <div class="col-md-6">
      <label for="Bus">Bus Package Name</label>
      <input type="text" class="form-control" v-model="BusPackage.BusPackageName" id="Bus"/>
    </div>
    <div class="col-md-2">
      <label for="Value">Value</label>
      <input type="number" class="form-control" v-model="BusPackage.BusPackageValue" id="Value" />
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <button v-on:click.prevent="SaveBusPackage()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-7 text-center">Package Name</th>
            <th class="col-2 text-center">Package Value</th>
            <th class="col-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="BusPackage in BusPackages" v-bind:key="BusPackage.BusPackageNo">
            <td class="col-1 text-center">{{BusPackage.BusPackageNo}}</td>
            <td class="col-7 text-center">{{BusPackage.BusPackageName}}</td>
            <td class="col-2 text-center">{{BusPackage.BusPackageValue}}</td>
            <div class="btn-group col-2" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditPackage(BusPackage)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="DeletePackage(BusPackage)">Delete </td>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </form>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
import { mapState } from "vuex";
export default {
  data() {
    return {
      operation: "Save",
      BusPackage: {
        SY: "",
        GroupNo: 0,
        SchoolNo: 0,
        BusPackageNo: 0,
        BusPackageName: "",
        BusPackageValue: 0
      },
      syyears: [],
      Groups: [],
      Schools: [],
      BusPackages: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    SaveBusPackage() {
      if (this.operation === "Save") {
        let new_BusPackage = {
          SY: this.BusPackage.SY,
          GroupNo: this.BusPackage.GroupNo,
          SchoolNo: this.BusPackage.SchoolNo,
          BusPackageName: this.BusPackage.BusPackageName,
          BusPackageValue: this.BusPackage.BusPackageValue
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addBusPackage",
            new_BusPackage
          )
          .then(
            data => {
              this.BusPackage.BusPackageName = "";
              this.BusPackage.BusPackageValue = 0;
              this.fetchBusPackages(
                new_BusPackage.SY,
                new_BusPackage.GroupNo,
                new_BusPackage.SchoolNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_BusPackage = {
          SY: this.BusPackage.SY,
          GroupNo: this.BusPackage.GroupNo,
          SchoolNo: this.BusPackage.SchoolNo,
          BusPackageNo: this.BusPackage.BusPackageNo,
          BusPackageName: this.BusPackage.BusPackageName,
          BusPackageValue: this.BusPackage.BusPackageValue
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editBusPackage/",
            upd_BusPackage
          )
          .then(
            data => {
              this.BusPackage.BusPackageNo = 0;
              this.BusPackage.BusPackageName = "";
              this.BusPackage.BusPackageValue = 0;
              this.fetchBusPackages(
                this.BusPackage.SY,
                this.BusPackage.GroupNo,
                this.BusPackage.SchoolNo
              );
              this.operation = "Save";
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditPackage(Packageinfo) {
      this.BusPackage.SY = Packageinfo.SY;
      this.BusPackage.GroupNo = Packageinfo.GroupNo;
      this.BusPackage.SchoolNo = Packageinfo.SchoolNo;
      this.BusPackage.BusPackageNo = Packageinfo.BusPackageNo;
      this.BusPackage.BusPackageName = Packageinfo.BusPackageName;
      this.BusPackage.BusPackageValue = Packageinfo.BusPackageValue;
      this.operation = "Update";
    },
    fetchGroups() {
      axios.get("http://" + server.IP + ":" + server.port + "/groups").then(
        data => {
          this.Groups = data.data;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    },

    fetchSchools(group) {
      axios
        .get(
          "http://" + server.IP + ":" + server.port + "/listschools/" + group
        )
        .then(
          data => {
            this.Schools = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },
    fetchBusPackages(sy, group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getBusPackage/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.BusPackages = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },
    fetchSY() {
      axios.get("http://" + server.IP + ":" + server.port + "/listsy/").then(
        (data) => {
          this.syyears = data.data;
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
    }

  },
  created: function() {
    this.fetchSY();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {

  color: #047c14;
}
h5 {
  color: #047c14;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
</style>
