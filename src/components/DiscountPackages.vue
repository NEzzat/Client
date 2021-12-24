<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Discount Packages</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">
    <div class="col-md-2">
      <label for="Revenue">Revenue</label>
      <select v-model="DiscountPackage.SourceNo" class="form-select col-2" id="Revenue">
       <option v-for="revenue in RevenueItems" v-bind:value="revenue.SourceNo" :key="revenue.SourceNo">{{revenue.SourceName}}</option>
      </select>
    </div>            
    <div class="col-md-7">
      <label for="PKG">Discount Package Name</label>
      <input type="text" class="form-control" v-model="DiscountPackage.DiscountPackageName" id="PKG" />
    </div>
    <div class="row">
      <div class="col-md-2">
        <label for="val">Value</label>
        <input type="text" class="form-control" v-model="DiscountPackage.DiscountPackageValue" id="val" />
      </div>
      <div class="col-md-2">
        <label for="per">Percent %</label>
        <input
          type="text"
          class="form-control"
          v-model="DiscountPackage.DiscountPackagePercent"
          id="per"
        />
      </div>
      <div class="col-md-3">
        <label for="discountgroup">Discount Group</label>
        <select v-model="DiscountPackage.DiscountGroupID"  class="form-select col-2" id="discountgroup">
          <option v-for="discountgroup in DiscountGroups" v-bind:value="discountgroup.DiscountGroupID" :key="discountgroup.DiscountGroupID">{{discountgroup.DiscountGroupName}}</option>
         </select>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <button
            v-on:click.prevent="SaveDiscountPackage()"
            class="btn btn-primary btn-lg"
          >{{ operation }}</button>
        </div>
      </div>
      <div id="MyTable" class="row mt-3">
        <table  class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-4 text-center">Package Name</th>
              <th class="col-2 text-center">Package Group</th>
              <th class="col-2 text-center">Revenue Item</th>
              <th class="col-1 text-center">Value</th>
              <th class="col-1 text-center">%</th>
              <th class="col-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="d-flex" v-for="DiscountPackage in DiscountPackages" :key="DiscountPackage.DiscountPackageNo">
              <td class="col-1 text-center">{{DiscountPackage.DiscountPackageNo}}</td>
              <td class="col-4 text-center">{{DiscountPackage.DiscountPackageName}}</td>
              <td class="col-2 text-center">{{DiscountPackage.DiscountGroupName}}</td>
              <td class="col-2 text-center">{{DiscountPackage.SourceName}}</td>
              <td class="col-1 text-center">{{DiscountPackage.DiscountPackageValue}}</td>
              <td class="col-1 text-center">{{DiscountPackage.DiscountPackagePercent}}</td>
              <div class="btn-group col-1" role="group">
                <td class="col-1 btn text-center" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><span @click="showEditPackage(DiscountPackage)"><i class="bi bi-pencil"></i></span></td> 
                <td class="col-1 btn text-center" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><span><i class="bi bi-trash"></i></span></td> 
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
      DiscountPackage: {
        DiscountGroupID: 0,
        GroupNo: 0,
        SchoolNo: 0,
        SourceNo: 0,
        DiscountPackageNo: 0,
        DiscountPackageName: "",
        DiscountPackageValue: 0,
        DiscountPackagePercent: 0,
      },
      DiscountGroups: [],
      DiscountPackages: [],
      RevenueItems: [],
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    SaveDiscountPackage() {
      if (this.operation === "Save") {
        let new_DiscountPackage = {
          DiscountGroupID: this.DiscountPackage.DiscountGroupID,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SourceNo: this.DiscountPackage.SourceNo,
          DiscountPackageName: this.DiscountPackage.DiscountPackageName,
          DiscountPackageValue: this.DiscountPackage.DiscountPackageValue,
          DiscountPackagePercent: this.DiscountPackage.DiscountPackagePercent,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addDiscountPackage",
            new_DiscountPackage
          )
          .then(
            (data) => {
              this.DiscountPackage.DiscountPackageName = "";
              this.DiscountPackage.DiscountPackageValue = 0;
              this.DiscountPackage.DiscountPackagePercent = 0;
              this.fetchDiscountPackages(
                this.GroupNo,
                this.SchoolNo
              );
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_DiscountPackage = {
          DiscountGroupID: this.DiscountPackage.DiscountGroupID,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SourceNo: this.DiscountPackage.SourceNo,
          DiscountPackageNo: this.DiscountPackage.DiscountPackageNo,
          DiscountPackageName: this.DiscountPackage.DiscountPackageName,
          DiscountPackageValue: this.DiscountPackage.DiscountPackageValue,
          DiscountPackagePercent: this.DiscountPackage.DiscountPackagePercent,
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editDiscountPackage/",
            upd_DiscountPackage
          )
          .then(
            (data) => {
              this.DiscountPackage.DiscountPackageNo = 0;
              this.DiscountPackage.DiscountPackageName = "";
              this.DiscountPackage.DiscountPackageValue = 0;
              this.DiscountPackage.DiscountPackagePercent = 0;
              this.fetchDiscountPackages(
                this.DiscountPackage.GroupNo,
                this.DiscountPackage.SchoolNo
              );
              this.operation = "Save";
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditPackage(Packageinfo) {
      this.DiscountPackage.DiscountGroupID = Packageinfo.DiscountGroupID;
      this.DiscountPackage.GroupNo = Packageinfo.GroupNo;
      this.DiscountPackage.SchoolNo = Packageinfo.SchoolNo;
      this.DiscountPackage.SourceNo = Packageinfo.SourceNo;
      this.DiscountPackage.DiscountPackageNo = Packageinfo.DiscountPackageNo;
      this.DiscountPackage.DiscountPackageName =
        Packageinfo.DiscountPackageName;
      this.DiscountPackage.DiscountPackageValue =
        Packageinfo.DiscountPackageValue;
      this.DiscountPackage.DiscountPackagePercent =
        Packageinfo.DiscountPackagePercent;
      this.operation = "Update";
    },
    fetchDiscountGroups() {
      axios
        .get("http://" + server.IP + ":" + server.port + "/getDiscountGroups")
        .then(
          (data) => {
            this.DiscountGroups = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
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
          (data) => {
            this.RevenueItems = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
    fetchDiscountPackages(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getDiscountPackage/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.DiscountPackages = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
  },
  created: function () {
    this.fetchRevenues(this.GroupNo, this.SchoolNo);
    this.fetchDiscountPackages(this.GroupNo, this.SchoolNo)
    this.fetchDiscountGroups();
  },
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
#MyTable {
  overflow-y:scroll;
  height:450px
}
</style>
