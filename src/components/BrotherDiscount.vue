
<template>
<div class="container">
    <h2 align="center"> Borthers Discount </h2>
    <form class="form-horizontal" role="form">
        <div class ="form-group">
            <div class="form-group row">
                <div class="col-md-1">          
                    <label for ="school">School</label>
                </div>      
                <div class="col-md-3">
                    <select id ="school" v-on:change="fetchBDiscount(BDiscount.SchoolNo)" class="form-control input" v-model = "BDiscount.SchoolNo">
                        <option v-for="school in Schools" v-bind:value="school.SchoolNo"> {{school.SchoolName}} </option>
                    </select>
                </div>

                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-addon">No. of Borthers</span>
                        <input type="number" class="form-control" min="2" max="3" v-model = "BDiscount.NoofBothers" required>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-addon">Percent</span>
                        <input type="number" class="form-control" v-model = "BDiscount.Percent" required>
                    </div>
                </div>
            </div>
            <div class="form-group row">
              <div class="col-md-1">          
                <label for ="revenueitem">Revenue</label>
              </div>
              <div class="col-md-3">
              <select id ="revenueitem" class="form-control input" v-model = "BDiscount.SourceNo">
                <option v-for="revenue in RevenueItems" v-bind:value="revenue.SourceNo"> {{revenue.SourceName}} </option> 
              </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-12">
                <button  v-on:click.prevent="SaveBDiscount()" class="btn btn-primary btn-lg">{{operation}}</button>
              </div>
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Borthers</th>
                        <th>Percent</th>
                        <th>Discount on</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="BDiscount in BDiscounts">
                        <td>{{BDiscount.NoofBothers}}</td>
                        <td>{{BDiscount.Percent}}</td>
                         <td>{{BDiscount.SourceName}}</td>
                        <td class="btn btn-warning " v-on:click.prevent="showEditBDiscount(BDiscount)">Update </td>
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
      BDiscount: {
        GroupNo: 1,
        SchoolNo: 0,
        NoofBothers: 2,
        Percent: 0,
        SourceNo: 0
      },
      BDiscounts: [],
      RevenueItems: [],
      Schools: []
    };
  },

  methods: {
    SaveBDiscount() {
      if (this.operation === "Save") {
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addbdiscount/",
            this.BDiscount
          )
          .then(
            data => {
              this.BDiscount.NoofBothers = 0;
              this.BDiscount.Percent = 0;
              this.BDiscount.SourceNo = 0;
              this.fetchBDiscount(this.BDiscount.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_BDiscount = {
          SchoolNo: this.BDiscount.SchoolNo,
          NoofBothers: this.BDiscount.NoofBothers,
          SourceNo: this.BDiscount.SourceNo,
          Percent: this.BDiscount.Percent
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editbdiscount/",
            upd_BDiscount
          )
          .then(
            data => {
              this.BDiscount.NoofBothers = 0;
              this.BDiscount.Percent = 0;
              this.operation = "Save";
              this.fetchBDiscount(this.BDiscount.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditBDiscount(BDiscount) {
      this.BDiscount.NoofBothers = BDiscount.NoofBothers;
      this.BDiscount.SourceNo = BDiscount.SourceNo;
      this.BDiscount.Percent = BDiscount.Percent;

      this.operation = "Update";
    },

    fetchBDiscount(SchoolNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getbdiscount/" +
            SchoolNo
        )
        .then(
          data => {
            this.BDiscounts = data.data;
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
