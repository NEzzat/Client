
<template>
  <div class="container">
    <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Campus</span></h2>
    <form class="row g-3 ">
      <div class="col-md-3">
        <label for="Group">Group</label>
        <select v-model="School.GroupNo" @click="fetchSchools(School.GroupNo)" class="form-select col-2" id="Group">
          <option v-for="Group in Groups" v-bind:value="Group.GroupNo" :key="Group.GroupNo">{{Group.GroupName}}</option>
        </select>
      </div>    
      <div class="col-md-9">
        <label for="School">School Name</label>
        <div class="input-group">  
          <input
            type="text"
            class="form-control"
            v-model="School.SchoolName"
            id="School"
          />
        </div>
      </div>  
      <div class="row mt-2">
        <div class="col-md-12">
          <button  v-on:click.prevent="SaveSchool()" class="btn btn-primary btn-lg">{{operation}}</button>
        </div>      
      </div> 
      <div class="row mt-3">
        <table class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-8 text-center">Schools</th>
              <th class="col-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody >
            <tr class="d-flex" v-for="School in Schools" v-bind:key="School.SchoolNo">
              <td class="col-1 text-center">{{School.SchoolNo}}</td>
              <td class="col-8 text-center">{{School.SchoolName}}</td>
              <div class="btn-group col-3" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditSchool(School)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="DeleteSchool(School)">Delete </td>
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
  data() {
    return {
      operation: "Save",
      Groups: [],
      School: {
        GroupNo: 0,
        SchoolNo: 0,
        SchoolName: "",
        BranchNo: 0
      },
      Schools: [],
      Branchs: [{ id: 0, name: "Looding ...." }]
    };
  },

  methods: {
    SaveSchool() {
      if (this.operation === "Save") {
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addschool/",
            this.School
          )
          .then(
            () => {
              this.School.SchoolNo = "";
              this.School.SchoolName = "";
              this.fetchSchools(this.School.GroupNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_School = {
          GroupNo: this.School.GroupNo,
          SchoolNo: this.School.SchoolNo,
          SchoolName: this.School.SchoolName,
          BranchNo: this.School.BranchNo
        };
        axios
          .put("http://" + server.IP + ":" + server.port + "/editschool/", {
            School: upd_School
          })
          .then(
            data => {
              this.School.SchoolNo = "";
              this.School.SchoolName = "";
              this.operation = "Save";
              this.fetchSchools(this.School.GroupNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteSchool(SchoolInfo) {
      this.$confirm("Are you sure?","Delete "+SchoolInfo.SchoolName,"warning").then((e,reject) => {
        if (e) {
          axios.delete("http://" + server.IP + ":" + server.port + "/deleteschool/" + 
          this.School.GroupNo +
          "/" +
          SchoolInfo.SchoolNo)
          .then(
            () => {
              this.fetchSchools(this.School.GroupNo);
            },
            errorResponse => {
              this.$alert("Make Sure No Sections Is Defined Under this School","Error Delete School","error");
            }
          );
        }
      }).catch(() => {
        return
      })
    },
    showEditSchool(School) {
      this.School.GroupNo = School.GroupNo;
      this.School.SchoolNo = School.SchoolNo;
      this.School.SchoolName = School.SchoolName;
      this.School.BranchNo = School.BranchNo;
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
    fetchBranchs(group) {
      axios
        .get("http://" + server.IP + ":" + server.port + "/getbranchs/" + group)
        .then(
          data => {
            this.Branchs = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },

  created: function() {
    this.fetchGroups();
  }
};
</script>

<style>
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
