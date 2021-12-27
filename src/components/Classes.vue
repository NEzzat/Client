<template>
<div class="container">
  <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Class</span></h2>
 <form class="row g-3 ">
    <div class="col-md-3">
      <label for="Group">Groups</label>
      <select v-model="Class.GroupNo" @change="fetchSchools(Class.GroupNo)" class="form-select col-2" id="Group">
        <option v-for="Group in Groups" v-bind:value="Group.GroupNo" :key="Group.GroupNo">{{Group.GroupName}}</option>
      </select>
    </div>
    <div class="col-md-3">
      <label for="School">Schools</label>
      <select v-model="Class.SchoolNo" @change="fetchSection(Class.GroupNo,Class.SchoolNo)" class="form-select col-2" id="School">
        <option v-for="School in Schools" v-bind:value="School.SchoolNo" :key="School.SchoolNo">{{School.SchoolName}}</option>
      </select>
    </div>  
    <div class="col-md-2">
      <label for="Section">Sctions</label>
      <select v-model="Class.SectionNo" @change="fetchDept(Class.GroupNo,Class.SchoolNo,Class.SectionNo)" class="form-select col-2" id="Section">
        <option v-for="Section in Sections" v-bind:value="Section.SectionNo" :key="Section.SectionNo">{{Section.SectionName}}</option>
      </select>
    </div>   
    <div class="col-md-2">
      <label for="Dept">Departments</label>
      <select v-model="Class.DepartmentNo" @change="fetchGrades(Class.GroupNo,Class.SchoolNo,Class.SectionNo,Class.DepartmentNo)" class="form-select col-2" id="Dept">
        <option v-for="Dept in Depts" v-bind:value="Dept.DepartmentNo" :key="Dept.DepartmentNo">{{Dept.DepartmentName}}</option>
      </select>
    </div>    
    <div class="col-md-2">
      <label for="Grade">Grades</label>
      <select v-model="Class.GradeNo" @change="fetchClasses(Class.GroupNo,Class.SchoolNo,Class.SectionNo,Class.DepartmentNo,Class.GradeNo)" class="form-select col-2" id="Grade">
        <option v-for="Grade in Grades" v-bind:value="Grade.GradeNo" :key="Grade.GradeNo">{{Grade.Grade}}</option>
      </select>
      </div>
      <div class="row mt-2">
        <div class="col-md-2">
          <label for="Class">Class Name</label>
          <div class="input-group">  
            <input
              type="text"
              class="form-control"
              v-model="Class.ClasseName"
              id="Class"
            />
          </div>
        </div>
        <div class="col-md-3">
            <label for="Build">Building Name</label>
            <div class="input-group">  
              <input
                type="text"
                class="form-control"
                v-model="Class.BuildingName"
                id="Build"
              />
            </div>
          </div>        
        <div class="col-md-2">
            <label for="Max">Max. Students</label>
            <div class="input-group">  
              <input
                type="text"
                class="form-control"
                v-model="Class.MaxStudents"
                id="MAX"
              />
            </div>
          </div>
        <div class="col-md-2">
            <label for="Min">Min. Students</label>
            <div class="input-group">  
              <input
                type="text"
                class="form-control"
                v-model="Class.MinStudents"
                id="Min"
              />
            </div>
          </div>                          
      </div>   
    <div class="row mt-2">
      <div class="col-md-12">
        <button  v-on:click.prevent="Saveclass()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>      
    </div>  
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-4 text-center">Class</th>
            <th class="col-2 text-center">Building</th>
            <th class="col-1 text-center">Min.</th>
            <th class="col-1 text-center">Max.</th>
            <th class="col-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="Class in Classes" v-bind:key="Class.ClassNo">
            <td class="col-1 text-center">{{Class.ClassNo}}</td>
            <td class="col-4 text-center">{{Class.ClasseName}}</td>
            <td class="col-2 text-center">{{Class.BuildingName}}</td>
            <td class="col-1 text-center">{{Class.MinStudents}}</td>
            <td class="col-1 text-center">{{Class.MaxStudents}}</td>
            <div class="btn-group col-3" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditClass(Class)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="DeleteClass(Class)">Delete </td>
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
      Class: {
        GrpupNo: 0,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        ClasseName: "",
        BuildingName: "",
        MaxStudents: 0,
        MinStudents: 0
      },
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: []
    };
  },

  methods: {
    Saveclass() {
      if (this.operation === "Save") {
        let new_Class = {
          GroupNo: this.Class.GroupNo,
          SchoolNo: this.Class.SchoolNo,
          SectionNo: this.Class.SectionNo,
          DepartmentNo: this.Class.DepartmentNo,
          GradeNo: this.Class.GradeNo,
          ClasseName: this.Class.ClasseName,
          BuildingName: this.Class.BuildingName,
          MaxStudents: this.Class.MaxStudents,
          MinStudents: this.Class.MinStudents
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addclass",
            new_Class
          )
          .then(
            data => {
              this.Class.ClasseName = "";
              this.Class.BuildingName = "";
              this.Class.MaxStudents = 0;
              this.Class.MinStudents = 0;
              this.fetchClasses(
                this.Class.GroupNo,
                this.Class.SchoolNo,
                this.Class.SectionNo,
                this.Class.DepartmentNo,
                this.Class.GradeNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Class = {
          GroupNo: this.Class.GroupNo,
          SchoolNo: this.Class.SchoolNo,
          SectionNo: this.Class.SectionNo,
          DepartmentNo: this.Class.DepartmentNo,
          GradeNo: this.Class.GradeNo,
          ClassNo: this.Class.ClassNo,
          ClasseName: this.Class.ClasseName,
          BuildingName: this.Class.BuildingName,
          MaxStudents: this.Class.MaxStudents,
          MinStudents: this.Class.MinStudents
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editclass/",
            upd_Class
          )
          .then(
            data => {
              this.Class.ClasseName = "";
              this.Class.BuildingName = "";
              this.Class.MaxStudents = 0;
              this.Class.MinStudents = 0;
              this.operation = "Save";
              this.fetchClasses(
                this.Class.GroupNo,
                this.Class.SchoolNo,
                this.Class.SectionNo,
                this.Class.DepartmentNo,
                this.Class.GradeNo
              );
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteClass(ClassInfo) {
      this.$confirm(
        "Are you sure?",
        "Delete " + ClassInfo.ClasseName,
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
                  "/deleteclass/" +
                  ClassInfo.GroupNo +
                  "/" +
                  ClassInfo.SchoolNo +
                  "/" +
                  ClassInfo.SectionNo +
                  "/" +
                  ClassInfo.DepartmentNo +
                  "/" +
                  ClassInfo.GradeNo +
                  "/" +
                  ClassInfo.ClassNo
              )
              .then(
                () => {
                  this.fetchClasses(
                    this.Class.GroupNo,
                    this.Class.SchoolNo,
                    this.Class.SectionNo,
                    this.Class.DepartmentNo,
                    this.Class.GradeNo
                  );
                },
                (errorResponse) => {
                  this.$alert(
                    "Make Sure No Students Is in this Class",
                    "Error Delete Class",
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

    showEditClass(classinfo) {
      this.Class.ClassNo = classinfo.ClassNo;
      this.Class.GroupNo = classinfo.GroupNo;
      this.Class.SchoolNo = classinfo.SchoolNo;
      this.Class.SectionNo = classinfo.SectionNo;
      this.Class.DepartmentNo = classinfo.DepartmentNo;
      this.Class.GradeNo = classinfo.GradeNo;
      this.Class.ClasseName = classinfo.ClasseName;
      this.Class.BuildingName = classinfo.BuildingName;
      this.Class.MaxStudents = classinfo.MaxStudents;
      this.Class.MinStudents = classinfo.MinStudents;
      this.operation = "Update";
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
    fetchClasses(group, school, section, dept, grade) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/calasses/" +
            group +
            "/" +
            school +
            "/" +
            section +
            "/" +
            dept +
            "/" +
            grade
        )
        .then(
          data => {
            this.Classes = data.data;
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
