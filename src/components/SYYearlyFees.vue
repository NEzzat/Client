<template>
<div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Year Fees</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>

  <form class="row g-3 ">
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="yearlyfees.SY" class="form-select col-2" id="SY">
        <option v-for="SY in syyears" v-bind:value="SY.SY" :key="SY.SY">{{SY.SY}}</option>
      </select>
    </div>    
    <div class="col-md-2">
      <label for="Section">Sections</label>
      <select v-model="yearlyfees.SectionNo" @click="fetchDept(yearlyfees.GroupNo,yearlyfees.SchoolNo,yearlyfees.SectionNo)" class="form-select col-2" id="Section">
       <option v-for="Section in Sections" v-bind:value="Section.SectionNo" :key="Section.SectionNo">{{Section.SectionName}}</option>
      </select>
    </div>    
    <div class="col-md-2">
      <label for="Dept">Departments</label>
      <select v-model="yearlyfees.DepartmentNo" @change="fetchGrades(yearlyfees.GroupNo,yearlyfees.SchoolNo,yearlyfees.SectionNo,yearlyfees.DepartmentNo)" class="form-select col-2" id="Dept">
        <option v-for="Dept in Depts" v-bind:value="Dept.DepartmentNo" :key="Dept.DepartmentNo">{{Dept.DepartmentName}}</option>
      </select>
    </div>
  <div class="row">
    <div class="col-md-3">
      <label for="from">Join From</label>
      <input type="date" class="form-control" v-model = "yearlyfees.joinFrom" id="from" >
    </div>
    <div class="col-md-3">
      <label for="to">Join to</label>
      <input type="date" class="form-control" v-model = "yearlyfees.joinTo" id="to" >
    </div>  
    <div class="col-md-3">
      <label for="rev">Revenue</label>
      <select v-model="yearlyfees.SourceNo" @click="fetchfees(yearlyfees.SY,yearlyfees.joinFrom,yearlyfees.joinTo, yearlyfees.SourceNo,yearlyfees.GroupNo,yearlyfees.SchoolNo,yearlyfees.SectionNo, yearlyfees.DepartmentNo)" class="form-select col-2" id="rev">
       <option v-for="revenue in yearlyfeess" v-bind:value="revenue.SourceNo" :key="revenue.SourceNo">{{revenue.SourceName}}</option>
      </select>
    </div> 
    <div class="col-md-3">
      <label for="val">Value</label>
      <input type="number" class="form-control" v-model = "yearlyfees.Amount">
    </div>             
  </div>
  <div class="row">
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="list-group">
            <span class="badge rounded-pill bg-success">Avaliable Grades</span>
            <li v-for="grade in Grades" :key="grade.GradeNo" v-on:dblclick="selectGrade(grade)" class="list-group-item">{{grade.Grade}}</li>
        </div>
      </div>
      <div class="col-md-6">
        <div class="list-group">
          <span class="badge rounded-pill bg-danger">Selected Grades</span>
          <li v-for="grade in SelectedGrades" :key="grade.GradeNo" v-on:dblclick="deselectGrade(grade)" class="list-group-item">{{grade.Grade}}</li>
        </div>
      </div>      
    </div>
  </div>
    <div class="row mt-2">
      <div class="col-md-12 d-flex justify-content-center">
        <button v-on:click.prevent="SaveSYfee()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>
    </div>
    <div class="row mt-2">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">SY</th>
            <th class="col-2 text-center">From</th>
            <th class="col-2 text-center">To</th>
            <th class="col-2 text-center">Source</th>
            <th class="col-2 text-center">Grade</th>
            <th class="col-2 text-center">Value</th>
            <th class="col-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="fee in Fees" v-bind:key="fee.GradeNo">
            <td class="col-1 text-center">{{fee.SY}}</td>
            <td class="col-2 text-center">{{fee.joinFrom}}</td>
            <td class="col-2 text-center">{{fee.joinTo}}</td>
            <td class="col-2 text-center">{{fee.SourceName}}</td>
            <td class="col-2 text-center">{{fee.Grade}}</td>
            <td class="col-2 text-center">{{fee.Amount}}</td>
            <div class="btn-group col-1" role="group">
             <td class="btn btn-danger " v-on:click.prevent="removefee(fee)">Delete </td>
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
  name: "Route",
  data() {
    return {
      move: "<<",
      operation: "Save",
      yearlyfees: {
        SY: "",
        joinFrom: "",
        joinTo: "",
        SourceNo: 0,
        GroupNo: 0,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        Amount: 0
      },
      Sections: [],
      Depts: [],
      Grades: [],
      SelectedGrades: [],
      yearlyfeess: [],
      Fees: [],
      SourceNo: 0,
      AcademicYear: "",
      IntegrationName: "",
      syyears: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    SaveSYfee() {
      if (this.operation === "Save") {
        var vm = this;
        this.SelectedGrades.forEach(function(SYfee) {
          let new_Fee = {
            SY: vm.yearlyfees.SY,
            joinFrom: vm.yearlyfees.joinFrom,
            joinTo: vm.yearlyfees.joinTo,
            GroupNo: SYfee.GroupNo,
            SchoolNo: SYfee.SchoolNo,
            SectionNo: SYfee.SectionNo,
            DepartmentNo: SYfee.DepartmentNo,
            GradeNo: SYfee.GradeNo,
            SourceNo: vm.yearlyfees.SourceNo,
            Amount: vm.yearlyfees.Amount
          };
          axios
            .post(
              "http://" + server.IP + ":" + server.port + "/addfees",
              new_Fee
            )
            .then(
              data => {
                vm.fetchfees(
                  new_Fee.SY,
                  new_Fee.joinFrom,
                  new_Fee.joinTo,
                  new_Fee.SourceNo,
                  new_Fee.GroupNo,
                  new_Fee.SchoolNo,
                  new_Fee.SectionNo,
                  new_Fee.DepartmentNo
                );
 
              },
              errorResponse => {
                console.log(errorResponse);
              }
            );
        });
        this.yearlyfees.Amount = 0;
        this.SelectedGrades = [];        
      }
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

    fetchfees(SY, join_From, join_To, source, group, school, section, dept) {
      this.fetchGrades(group, school, section, dept)
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getfees/" +
            SY +
            "/" +
            join_From +
            "/" +
            join_To +
            "/" +
            source +
            "/" +
            group +
            "/" +
            school +
            "/" +
            section +
            "/" +
            dept
        )
        .then(
          data => {
            this.Fees = data.data;
            
            var A = this;
            var c = A.Grades.filter(function(Grade) {
               return !A.Fees.find(function(FeeGrade) {
                return Grade.GradeNo === FeeGrade.GradeNo
              })
            });
            this.Grades = c            

          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    removefee(myfee) {
      axios
        .delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/removefee/" +
            myfee.SY +
            "/" +
            myfee.joinFrom +
            "/" +
            myfee.joinTo +
            "/" +
            myfee.SourceNo +
            "/" +
            myfee.GroupNo +
            "/" +
            myfee.SchoolNo +
            "/" +
            myfee.SectionNo +
            "/" +
            myfee.DepartmentNo +
            "/" +
            myfee.GradeNo
        )
        .then(
          data => {
            this.fetchfees(
              myfee.SY,
              myfee.joinFrom,
              myfee.joinTo,
              myfee.SourceNo,
              myfee.GroupNo,
              myfee.SchoolNo,
              myfee.SectionNo,
              myfee.DepartmentNo
            );
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
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

    fetchGrades(group, school, section, dept) {
      this.Fees =[];
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/grades/" +
            group +
            "/" +
            school +
            "/" +
            section +
            "/" +
            dept
        )
        .then(
          data => {
            this.Grades = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    fetchDept(group, school, section) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/depts/" +
            group +
            "/" +
            school +
            "/" +
            section
        )
        .then(
          data => {
            this.Depts = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    selectGrade(grade) {
      if (this.yearlyfees.Amount === 0) {
        alert("No fees defined");
        return;
      }
      this.SelectedGrades.push(grade);
      var index = this.Grades.indexOf(grade);
      if (index > -1) {
        this.Grades.splice(index, 1);
      }
    },

    deselectGrade(grade) {
      this.Grades.push(grade);
      var index = this.SelectedGrades.indexOf(grade);
      if (index > -1) {
        this.SelectedGrades.splice(index, 1);
      }
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
            this.yearlyfeess = data.data;
            this.serial = this.yearlyfeess.length + 1;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    fetchSection(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/listsections/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Sections = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    PostToACC(fee) {
      if (fee.Posted != "0") {
        alert("Service Alerady Posted");
        return;
      }
      axios
        .post("http://" + server.IP + ":" + server.port + "/itemdata/", fee)
        .then(
          data => {
            this.fetchfees(
              fee.SY,
              fee.SourceNo,
              fee.GroupNo,
              fee.SchoolNo,
              fee.SectionNo,
              fee.DepartmentNo,
              fee.GradeNo
            );
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },

  created: function() {
    this.fetchSY();
    this.yearlyfees.GroupNo =this.GroupNo;
    this.yearlyfees.SchoolNo =this.SchoolNo;
    this.fetchSection(this.GroupNo,this.SchoolNo);
    this.fetchRevenues(this.GroupNo,this.SchoolNo)
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
