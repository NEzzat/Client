
<template>
<div class="container">
    <h2 align="center"> Parent Discount </h2>
    <form class="form-horizontal" role="form">
        <div class ="form-group">
            <div class="form-group row">
                <div class="col-md-1">          
                    <label for ="school">School</label>
                </div>      
                <div class="col-md-3">
                    <select id ="school" v-on:change="fetchPDiscount(PDiscount.SchoolNo)" class="form-control input" v-model = "PDiscount.SchoolNo">
                        <option v-for="school in Schools" v-bind:value="school.SchoolNo"> {{school.SchoolName}} </option>
                    </select>
                </div>

                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-addon">Parent Reg. Year</span>
                        <input type="number" class="form-control" min="2" max="3" v-model = "PDiscount.ParentReg" required>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-addon">Student Reg. Year</span>
                        <input type="number" class="form-control" v-model = "PDiscount.StudentReg">
                    </div>
                </div>                

                <div class="col-md-2">
                    <div class="input-group">
                        <span class="input-group-addon">Percent%</span>
                        <input type="number" class="form-control" v-model = "PDiscount.Percent" required>
                    </div>
                </div>
            </div>
            
            <div class="form-group row">
              <div class="col-md-1">          
                <label for ="revenueitem">Revenue</label>
              </div>
              <div class="col-md-3">
              <select id ="revenueitem" class="form-control input" v-model = "PDiscount.SourceNo">
                <option v-for="revenue in RevenueItems" v-bind:value="revenue.SourceNo"> {{revenue.SourceName}} </option> 
              </select>
              </div>
            </div>

            <div class="form-group row">
                <div class="col-md-12">
                    <button  v-on:click.prevent="SavePDiscount()" class="btn btn-primary btn-lg">{{operation}}</button>
                </div>
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Parent Year</th>
                        <th>Student Year</th>
                        <th>Percent %</th>
                        <th>Discount On</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="PDiscount in PDiscounts">
                        <td>{{PDiscount.ParentReg}}</td>
                        <td>{{PDiscount.StudentReg}}</td>
                        <td>{{PDiscount.Percent}}</td>
                        <td>{{PDiscount.SourceName}}</td>
                        <td class="btn btn-warning " v-on:click.prevent="showEditPDiscount(PDiscount)">Update </td>
                        <td class="btn btn-danger">Delete </td>
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
export default {
  data() {
    return {
      operation: "Save",
      PDiscount: {
        GroupNo: 1,
        SchoolNo: 0,
        ParentReg: 0,
        StudentReg: 0,
        Percent: 0,
        SourceNo: 0
      },
      PDiscounts: [],
      RevenueItems: [],
      Schools: []
    };
  },

  methods: {
    SavePDiscount() {
      if (this.operation === "Save") {
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addpdiscount/",
            this.PDiscount
          )
          .then(
            data => {
              this.PDiscount.ParentReg = 0;
              this.PDiscount.StudentReg = 0;
              this.PDiscount.Percent = 0;
              this.fetchPDiscount(this.PDiscount.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_PDiscount = {
          SchoolNo: this.PDiscount.SchoolNo,
          ParentReg: this.PDiscount.ParentReg,
          StudentReg: this.PDiscount.StudentReg,
          Percent: this.PDiscount.Percent,
          SourceNo: this.PDiscount.SourceNo
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editpdiscount/",
            upd_PDiscount
          )
          .then(
            data => {
              this.PDiscount.ParentReg = 0;
              this.PDiscount.StudentReg = 0;
              this.PDiscount.Percent = 0;
              this.PDiscount.SourceNo = 0;
              this.operation = "Save";
              this.fetchPDiscount(this.PDiscount.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditPDiscount(PDiscount) {
      this.PDiscount.ParentReg = PDiscount.ParentReg;
      this.PDiscount.StudentReg = PDiscount.StudentReg;
      this.PDiscount.Percent = PDiscount.Percent;
      this.PDiscount.SourceNo = PDiscount.SourceNo;
      this.operation = "Update";
    },

    fetchPDiscount(SchoolNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getpdiscount/" +
            SchoolNo
        )
        .then(
          data => {
            this.PDiscounts = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },
    fetchRevenues() {
      axios
        .get("http://" + server.IP + ":" + server.port + "/revenuesource")
        .then(
          data => {
            this.RevenueItems = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
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
    }
  },

  created: function() {
    this.fetchSchools(1);
    this.fetchRevenues();
  }
};
</script>

<style>
h2 {
  /* align : center; */
  margin-top: 5px;
  margin-bottom: 20px;
  color: #3eb3d5;
}
label {
  margin-left: 5px;
  margin-top: 5px;
  color: #3eb3d5;
}
thead {
  color: #2273bf;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  color: #0c36be;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #0056f5;
}
</style>
