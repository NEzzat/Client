<template>
<div class="container">
  <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Grades</span></h2>
  <form class="row g-3 ">
    <div class="col-md-3">
      <label for="Group">Groups</label>
      <select v-model="Grade.GroupNo" @change="fetchSchools(Grade.GroupNo)" class="form-select col-2" id="Group">
        <option v-for="Group in Groups" v-bind:value="Group.GroupNo" :key="Group.GroupNo">{{Group.GroupName}}</option>
      </select>
    </div>    
    <div class="col-md-3">
      <label for="School">Schools</label>
      <select v-model="Grade.SchoolNo" @change="fetchSection(Grade.GroupNo,Grade.SchoolNo)" class="form-select col-2" id="School">
        <option v-for="School in Schools" v-bind:value="School.SchoolNo" :key="School.SchoolNo">{{School.SchoolName}}</option>
      </select>
    </div>  
    <div class="col-md-2">
      <label for="Section">Sctions</label>
      <select v-model="Grade.SectionNo" @change="fetchDept(Grade.GroupNo,Grade.SchoolNo,Grade.SectionNo)" class="form-select col-2" id="Section">
        <option v-for="Section in Sections" v-bind:value="Section.SectionNo" :key="Section.SectionNo">{{Section.SectionName}}</option>
      </select>
    </div>   
    <div class="col-md-2">
      <label for="Dept">Departments</label>
      <select v-model="Grade.DepartmentNo" @change="fetchGrades(Grade.GroupNo,Grade.SchoolNo,Grade.SectionNo,Grade.DepartmentNo)" class="form-select col-2" id="Dept">
        <option v-for="Dept in Depts" v-bind:value="Dept.DepartmentNo" :key="Dept.DepartmentNo">{{Dept.DepartmentName}}</option>
      </select>
    </div>   
    <div class="col-md-2">
      <label for="Grade">Grade Name</label>
      <div class="input-group">  
        <input
          type="text"
          class="form-control"
          v-model="Grade.Grade"
          id="Grade"
        />
      </div>
    </div>   
    <div class="row mt-2">
      <div class="col-md-12">
        <button  v-on:click.prevent="SaveGrade()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>      
    </div>  
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-8 text-center">Grades</th>
            <th class="col-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="Grade in Grades" v-bind:key="Grade.GradeNo">
            <td class="col-1 text-center">{{Grade.GradeNo}}</td>
            <td class="col-8 text-center">{{Grade.Grade}}</td>
            <div class="btn-group col-3" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditGrade(Grade)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="DeleteGrade(Grade)">Delete </td>
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

export default {
  name: "Route",
  data() {
    return {
      operation: "Save",
      Grade: {
        GrpupNo: 0,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        Grade: ""
      },
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: []
    };
  },

  methods: {
    SaveGrade() {
      if (this.operation === "Save") {
        let new_Grade = {
          GroupNo: this.Grade.GroupNo,
          SchoolNo: this.Grade.SchoolNo,
          SectionNo: this.Grade.SectionNo,
          DepartmentNo: this.Grade.DepartmentNo,
          Grade: this.Grade.Grade
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addgrade",
            new_Grade
          )
          .then(
            data => {
              this.Grade.GradeNo = 0;
              this.Grade.Grade = "";
              this.fetchGrades(
                this.Grade.GroupNo,
                this.Grade.SchoolNo,
                this.Grade.SectionNo,
                this.Grade.DepartmentNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Grade = {
          GroupNo: this.Grade.GroupNo,
          SchoolNo: this.Grade.SchoolNo,
          SectionNo: this.Grade.SectionNo,
          DepartmentNo: this.Grade.DepartmentNo,
          GradeNo: this.Grade.GradeNo,
          Grade: this.Grade.Grade
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editgrade/",
            upd_Grade
          )
          .then(
            data => {
              this.Grade.GradeNo = 0;
              this.Grade.Grade = "";
              this.operation = "Save";
              this.fetchGrades(
                this.Grade.GroupNo,
                this.Grade.SchoolNo,
                this.Grade.SectionNo,
                this.Grade.DepartmentNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },

    showEditGrade(grade) {
      this.Grade.GradeNo = grade.GradeNo;
      this.Grade.Grade = grade.Grade;
      this.operation = "Update";
    },
    DeleteGrade(GradeInfo) {
      this.$confirm(
        "Are you sure?",
        "Delete " + GradeInfo.Grade,
        "warning"
      )
        .then((e, reject) => {
          if (e) {
            axios
              .delete(
                "http://" +
                  server.IP +
                  ":" +
                  server.port +
                  "/deletegrade/" +
                  GradeInfo.GroupNo +
                  "/" +
                  GradeInfo.SchoolNo +
                  "/" +
                  GradeInfo.SectionNo +
                  "/" +
                  GradeInfo.DepartmentNo +
                  "/" +
                  GradeInfo.GradeNo
              )
              .then(
                () => {
                  this.fetchGrades(
                    this.Grade.GroupNo,
                    this.Grade.SchoolNo,
                    this.Grade.SectionNo,
                    this.Grade.DepartmentNo
                  );;
                },
                (errorResponse) => {
                  this.$alert(
                    "Make Sure No Class Is Defined Under this Grade",
                    "Error Delete Grade",
                    "error"
                  );
                }
              );
          }
        })
        .catch(() => {
          return;
        });
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

    fetchGrades(group, school, section, dept) {
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
    }
  },
  created: function() {
    this.fetchGroups();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  /* align : center; */
  margin-top: 5px;
  margin-bottom: 20px;
  color: #047c14;
}
label {
  margin-left: 5px;
  margin-top: 5px;
  color: #047c14;
}
thead {
  color: #047c14;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  color: #047c14;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #023b09;
}
</style>
