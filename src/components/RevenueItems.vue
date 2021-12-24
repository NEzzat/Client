<template>
  <div class="container">
   <div class="row gx-3">
      <div class="col">
        <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
      </div>
      <div class="col">
        <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Revenue Items</span></h2>
      </div>
      <div class="col">
        <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
      </div>      
    </div>
  <form class="row g-3 ">
    <div class="col-md-1">
      <label for="Serial">Serial</label>
      <input
        id="Serial"
        type="number"
        class="form-control"
        v-model="serial"
      />
    </div>
    <div class="col-md-5">
      <label for="revenue">Revenue Item</label>
      <input
        id="revenue"
        type="text"
        class="form-control"
        v-model="RevenueItem.SourceName"
        placeholder="Enter Revenue Item"
      />
    </div>
    <div class="col-md-3 ">
      <div class="checkbox mt-4" id="check">
        <label>
          <input type="checkbox" v-model="RevenueItem.FullPayment" /> Full payment ?
        </label>
      </div>
    </div>
    <div class="row mt-2 ">
      <div class="col-md-12 d-flex justify-content-center">
        <button
          v-on:click.prevent="Saverevenue()"
          class="btn btn-primary btn-lg"
        >{{operation}}</button>
      </div>
    </div> 
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">Serial</th>
            <th class="col-8 text-center">Revenue Source</th>
            <th class="col-1 text-center">Full?</th>
            <th class="col-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="Revenue in RevenueItems" v-bind:key="Revenue.RevenueNo">
            <td class="col-1 text-center">{{Revenue.Serial}}</td>
            <td class="col-8 text-center">{{Revenue.SourceName}}</td>
            <td v-if="Revenue.FullPayment === 0" class="col-1 text-center">No</td>
            <td v-else class="col-1 text-center">Yes</td>
            <div class="btn-group col-2" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditRevenue(Revenue)">Update </td>
             <td class="btn btn-danger " v-on:click.prevent="DeleteRevenue(Revenue)">Delete </td>
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
  name: "SchoolGroup",
  data() {
    return {
      operation: "Save",
      RevenueItem: {
        GroupNo: 0,
        SchoolNo: 0,
        SourceNo: 0,
        SourceName: "",
        Serial: 0,
        FullPayment: false,
        TypeNo: 0
      },
      // TypeNo: 0,
      // Types: [
      //   { TypeNo: 1, TypeName: "رسوم تعليم" },
      //   { TypeNo: 2, TypeName: "نشاط" },
      //   // { TypeNo: 3, TypeName: "سيارت" },
      //   // { TypeNo: 4, TypeName: "اسهم" },
      //   // { TypeNo: 5, TypeName: "دمج" },
      //   { TypeNo: 6, TypeName: "اخرى" }
      // ],
      Groups: [],
      Schools: [],
      RevenueItems: [],
      serial: 1
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    Saverevenue() {
      if (this.operation === "Save") {
        let new_Revenue = {
          GroupNo: this.RevenueItem.GroupNo,
          SchoolNo: this.RevenueItem.SchoolNo,
          SourceName: this.RevenueItem.SourceName,
          Serial: this.serial,
          FullPayment: this.RevenueItem.FullPayment,
          TypeNo: this.TypeNo
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addrevenue",
            new_Revenue
          )
          .then(
            data => {
              this.RevenueItem.SourceNo = 0;
              this.RevenueItem.SourceName = "";
              this.RevenueItem.FullPayment = false;
              this.TypeNo = 0;
              this.fetchRevenues(
                this.RevenueItem.GroupNo,
                this.RevenueItem.SchoolNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Revenue = {
          GroupNo: this.RevenueItem.GroupNo,
          SchoolNo: this.RevenueItem.SchoolNo,
          SourceNo: this.RevenueItem.SourceNo,
          SourceName: this.RevenueItem.SourceName,
          Serial: this.serial,
          FullPayment: this.RevenueItem.FullPayment,
          TypeNo: this.TypeNo
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editrevenue/",
            upd_Revenue
          )
          .then(
            data => {
              this.RevenueItem.SourceName = "";
              this.RevenueItem.FullPayment = false;
              this.TypeNo = 0;
              this.operation = "Save";
              this.fetchRevenues(
                this.RevenueItem.GroupNo,
                this.RevenueItem.SchoolNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    showEditRevenue(revenueinfo) {
      this.RevenueItem.SourceNo = revenueinfo.SourceNo;
      this.RevenueItem.SourceName = revenueinfo.SourceName;
      this.RevenueItem.FullPayment = revenueinfo.FullPayment;
      this.serial = revenueinfo.Serial;
      this.TypeNo = revenueinfo.TypeNo;
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
    fetchRevenues(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/revenuesource/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.RevenueItems = data.data;
            this.serial = this.RevenueItems.length + 1;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function() {
    this.RevenueItem.GroupNo =this.GroupNo;
    this.RevenueItem.SchoolNo =this.SchoolNo;
    this.fetchRevenues(this.GroupNo,this.SchoolNo)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5 {
  color: #047c14;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
</style>
