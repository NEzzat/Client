<template>
  <div class="container">
    <h2 align="center">
      <span class="badge card-header bg-success mt-0"
        >Define School Departments</span
      >
    </h2>
    <form class="row g-3 ">
      <div class="col-md-3">
        <label for="Group">Groups</label>
        <select
          v-model="Dept.GroupNo"
          @change="fetchSchools(Dept.GroupNo)"
          class="form-select col-2"
          id="Group"
        >
          <option
            v-for="Group in Groups"
            v-bind:value="Group.GroupNo"
            :key="Group.GroupNo"
            >{{ Group.GroupName }}</option
          >
        </select>
      </div>
      <div class="col-md-3">
        <label for="School">Schools</label>
        <select
          v-model="Dept.SchoolNo"
          @change="fetchSection(Dept.GroupNo, Dept.SchoolNo)"
          class="form-select col-2"
          id="School"
        >
          <option
            v-for="School in Schools"
            v-bind:value="School.SchoolNo"
            :key="School.SchoolNo"
            >{{ School.SchoolName }}</option
          >
        </select>
      </div>
      <div class="col-md-2">
        <label for="Section">Sctions</label>
        <select
          v-model="Dept.SectionNo"
          @change="fetchDept(Dept.GroupNo, Dept.SchoolNo, Dept.SectionNo)"
          class="form-select col-2"
          id="Section"
        >
          <option
            v-for="Section in Sections"
            v-bind:value="Section.SectionNo"
            :key="Section.SectionNo"
            >{{ Section.SectionName }}</option
          >
        </select>
      </div>
      <div class="col-md-4">
        <label for="Department">Department Name</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="Dept.DepartmentName"
            id="Department"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <button
            v-on:click.prevent="SaveDept()"
            class="btn btn-primary btn-lg"
          >
            {{ operation }}
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <table
          class="table table-md table-bordered table-success table-striped"
        >
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-8 text-center">Departments</th>
              <th class="col-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="d-flex"
              v-for="Dept in Departments"
              v-bind:key="Dept.DepartmentNo"
            >
              <td class="col-1 text-center">{{ Dept.DepartmentNo }}</td>
              <td class="col-8 text-center">{{ Dept.DepartmentName }}</td>
              <div class="btn-group col-3" role="group">
                <td
                  class="btn btn-success"
                  v-on:click.prevent="showEditDept(Dept)"
                >
                  Update
                </td>
                <td
                  class="btn btn-danger "
                  v-on:click.prevent="DeleteDept(Dept)"
                >
                  Delete
                </td>
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
  name: "Dept",
  data() {
    return {
      operation: "Save",
      Dept: {
        GrpupNo: 0,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        DepartmentName: "",
      },
      Groups: [],
      Schools: [],
      Sections: [],
      Departments: [],
    };
  },

  methods: {
    SaveDept() {
      if (this.operation === "Save") {
        let new_Dept = {
          GroupNo: this.Dept.GroupNo,
          SchoolNo: this.Dept.SchoolNo,
          SectionNo: this.Dept.SectionNo,
          DepartmentName: this.Dept.DepartmentName,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/adddept",
            new_Dept
          )
          .then(
            (data) => {
              this.Dept.DepartmentNo = 0;
              this.Dept.DepartmentName = "";
              this.fetchDept(
                this.Dept.GroupNo,
                this.Dept.SchoolNo,
                this.Dept.SectionNo
              );
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Dept = {
          GroupNo: this.Dept.GroupNo,
          SchoolNo: this.Dept.SchoolNo,
          SectionNo: this.Dept.SchoolNo,
          DepartmentNo: this.Dept.DepartmentNo,
          DepartmentName: this.Dept.DepartmentName,
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editdept/",
            upd_Dept
          )
          .then(
            (data) => {
              this.Dept.DepartmentNo = 0;
              this.Dept.DepartmentName = "";
              this.operation = "Save";
              this.fetchDept(
                this.Dept.GroupNo,
                this.Dept.SchoolNo,
                this.Dept.SectionNo
              );
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteDept(DeptInfo) {
      this.$confirm(
        "Are you sure?",
        "Delete " + DeptInfo.DepartmentName,
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
                  "/deletedepartment/" +
                  this.Dept.GroupNo +
                  "/" +
                  this.Dept.SchoolNo +
                  "/" +
                  this.Dept.SectionNo +
                  "/" +
                  DeptInfo.DepartmentNo
              )
              .then(
                () => {
                  this.fetchDept(
                    this.Dept.GroupNo,
                    this.Dept.SchoolNo,
                    this.Dept.SectionNo
                  );
                },
                (errorResponse) => {
                  this.$alert(
                    "Make Sure No Grades Is Defined Under this Department",
                    "Error Delete Department",
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
    showEditDept(dept) {
      this.Dept.DepartmentNo = dept.DepartmentNo;
      this.Dept.DepartmentName = dept.DepartmentName;
      this.operation = "Update";
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
          (data) => {
            this.Departments = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
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
          (data) => {
            this.Sections = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    fetchGroups() {
      axios.get("http://" + server.IP + ":" + server.port + "/groups").then(
        (data) => {
          this.Groups = data.data;
        },
        (errorResponse) => {
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
          (data) => {
            this.Schools = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
  },
  created: function() {
    this.fetchGroups();
  },
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
