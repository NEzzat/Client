<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Installment Dates</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="installmentline.SY" class="form-select col-2" id="SY">
        <option v-for="SY in syyears" v-bind:value="SY.SY" :key="SY.SY">{{SY.SY}}</option>
      </select>
    </div>
    <div class="col-md-5">
      <label for="PK">Package</label>
      <select v-model="installmentline.installmentNo" @change="fetchinstallmetline(installmentline.SY,installmentline.installmentNo)" class="form-select col-2" id="PK">
        <option v-for="Installment in Installments" v-bind:value="Installment.InstallmentNo" :key="Installment.InstallmentNo">{{Installment.InstallmentName}}</option>
      </select>
    </div> 
    <div class="row">
      <div class="col-md-1">
        <label for="Serial">Serial</label>
        <input type="number" class="form-control" v-model="installmentline.Serial" id="Serial" />
      </div>
      <div class="col-md-2">
        <label for="Percent">Percent %</label>
        <input type="number" class="form-control" v-model="installmentline.Percent" id="Percent" />
      </div>
      <div class="col-md-3">
        <label for="From">From Date</label>
        <input type="date" class="form-control" v-model="installmentline.FromDate" id="From"/>
      </div>
      <div class="col-md-3">
          <label for="To">To Date</label>
          <input type="date" class="form-control" v-model="installmentline.ToDate" id="To"/>
        </div>
      </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <button
          v-on:click.prevent="Saveinstallment()"
          class="btn btn-primary btn-lg"
        >{{operation}}</button>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-2 text-center">Percent %</th>
            <th class="col-2 text-center">From</th>
            <th class="col-2 text-center">To</th>
            <th class="col-5 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="installmentline in installmentlines" v-bind:key="installmentline.Serial">
            <td class="col-1 text-center">{{installmentline.Serial}}</td>
            <td class="col-2 text-center">{{installmentline.Percent}}</td>
            <td class="col-2 text-center">{{installmentline.FromDate}}</td>
            <td class="col-2 text-center">{{installmentline.ToDate}}</td>            
            <div class="btn-group col-5" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditinst(installmentline)">Update </td>
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
      installmentline: {
        SY: "",
        installmentNo: 0,
        Serial: 1,
        Percent: 0,
        FromDate: "",
        ToDate: ""
      },
      syyears: [],
      Installments: [],
      installmentlines: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    Saveinstallment() {
      if (this.operation === "Save") {
        let new_Installmentline = {
          SY: this.installmentline.SY,
          installmentNo: this.installmentline.installmentNo,
          Serial: this.installmentline.Serial,
          Percent: this.installmentline.Percent,
          FromDate: this.installmentline.FromDate,
          ToDate: this.installmentline.ToDate
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addInstallmentLine",
            new_Installmentline
          )
          .then(
            data => {
              this.installmentline.Percent = 0;
              this.installmentline.FromDate = "";
              this.installmentline.ToDate = "";
              this.fetchinstallmetline(this.installmentline.SY,this.installmentline.installmentNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Installment = {
          SY: this.installmentline.SY,
          installmentNo: this.installmentline.installmentNo,
          Serial: this.installmentline.Serial,
          Percent: this.installmentline.Percent,
          FromDate: this.installmentline.FromDate,
          ToDate: this.installmentline.ToDate
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editInstallmentLine/",
            upd_Installment
          )
          .then(
            data => {
              this.installmentline.Percent = 0;
              this.installmentline.FromDate = "";
              this.installmentline.ToDate = "";
              this.fetchinstallmetline(this.installmentline.SY,this.installmentline.installmentNo);
              this.operation = "Save";
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    showEditinst(instinfo) {
      this.installmentline.Serial = instinfo.Serial;
      this.installmentline.Percent = instinfo.Percent;
      this.installmentline.FromDate = instinfo.FromDate;
      this.installmentline.ToDate = instinfo.ToDate;
      this.operation = "Update";
    },
    fetchinstallmetline(SY,installmentNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/InstallmentLine/" +
            SY +
            "/" +
            installmentNo
        )
        .then(
          data => {
            this.installmentlines = data.data;
            if (this.installmentlines.length > 0) {
              this.installmentline.Serial = this.installmentlines.length + 1;
            }
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
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
    },

  },
  created: function() {
    this.fetchSY();
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
