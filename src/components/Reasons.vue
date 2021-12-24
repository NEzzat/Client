<template>
<div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Absence Reasons</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">        
    <div class="col-md-5">
      <label for="Reason">Reason</label>
      <input type="text" id="Reason" class="form-control" v-model = "Reason.ReasonName" placeholder="Reason Name">
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <button v-on:click.prevent="SaveReason()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-9 text-center">Reasons</th>
            <th class="col-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="Reason in Reasons" v-bind:key="Reason.ReasonNo">
            <td class="col-1 text-center">{{Reason.ReasonNo}}</td>
            <td class="col-9 text-center">{{Reason.ReasonName}}</td>
            <div class="btn-group col-2" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditReason(Reason)">Update </td>
             <td class="btn btn-danger " v-on:click.prevent="DeleteReason(Reason)">Delete </td>
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
  name: "Dept",
  data() {
    return {
      operation: "Save",
      Reason: { GroupNo: 0, SchoolNo: 0, ReasonNo: 0, ReasonName: "" },
      Groups: [],
      Schools: [],
      Reasons: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  }, 
  methods: {
    SaveReason() {
      if (this.operation === "Save") {
        let new_Reason = {
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          ReasonName: this.Reason.ReasonName
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addreason",
            new_Reason
          )
          .then(
            () => {
              this.Reason.ReasonName = "";
              this.fetchReasons(this.GroupNo, this.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Reason = {
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          ReasonNo: this.Reason.ReasonNo,
          ReasonName: this.Reason.ReasonName
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editreason/",
            upd_Reason
          )
          .then(
            data => {
              this.Reason.ReasonName = "";
              this.operation = "Save";
              this.fetchReasons(this.GroupNo, this.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditReason(Reason) {
      this.Reason.ReasonNo = Reason.ReasonNo;
      this.Reason.ReasonName = Reason.ReasonName;
      this.operation = "Update";
    },
    fetchReasons(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/listreasons/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Reasons = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
  },
  created: function() {
    this.fetchReasons(this.GroupNo,this.SchoolNo);
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
