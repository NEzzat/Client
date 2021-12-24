<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Installment Packages</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">
    <div class="col-md-4">
      <label for="InstPack">Package Name</label>
      <input type="text" class="form-control" v-model = "installment.InstallmentName" id="InstPack">
    </div>      
    <div class="row mt-2">
      <div class="col-md-12 d-flex justify-content-center">
        <button v-on:click.prevent="Saveinstallment()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-8 text-center">Package Name</th>
            <th class="col-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="installment in Installments" v-bind:key="installment.InstallmentNo">
            <td class="col-1 text-center">{{installment.InstallmentNo}}</td>
            <td class="col-8 text-center">{{installment.InstallmentName}}</td>
            <div class="btn-group col-3" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditinst(installment)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="Deleteinst(installment)">Delete </td>
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
      // installment   : {"SY" : "" ,"GroupNo" : 1,"SchoolNo" : 0,"Serial" : 1, "Percent" : 0 , "FromDate" : "","ToDate" : ""},
      installment: { GroupNo: 0, SchoolNo: 0, InstallmentName: "" },
      Installments: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    Saveinstallment() {
      if (this.operation === "Save") {
        let new_Installment = {
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          InstallmentName: this.installment.InstallmentName
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addinstallment",
            new_Installment
          )
          .then(
            data => {
              this.installment.InstallmentName = "";
              this.fetchinstallmets(
                new_Installment.GroupNo,
                new_Installment.SchoolNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Installment = {
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          InstallmentNo: this.installment.InstallmentNo,
          InstallmentName: this.installment.InstallmentName
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editinstallment/",
            upd_Installment
          )
          .then(
            data => {
              this.installment.InstallmentName = "";
              this.fetchinstallmets(
                this.GroupNo,
                this.SchoolNo
              );
              this.operation = "Save";
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditinst(instinfo) {
      this.installment.InstallmentNo = instinfo.InstallmentNo;
      this.installment.InstallmentName = instinfo.InstallmentName;
      this.operation = "Update";
    },
    fetchinstallmets(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getinstallment/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Installments = data.data;
            if (this.Installments.length > 0) {
              this.installment.Serial = this.Installments.length + 1;
            }
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchinstallmets(this.GroupNo,this.SchoolNo);
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
