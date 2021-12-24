<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Student Financials</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">    
    <div class="row">
      <div class="col-md-2">
        <label for="SY">School Year</label>
        <select v-model="Student_Class.SY" class="form-select col-2" @change="fetchBusPackages(Student_Class.SY,GroupNo,SchoolNo)" id="SY" >
          <option v-for="sy in SY" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
        </select>
      </div>
    <div class="col-md-2">
      <label for="Sections">Sections</label>
      <select v-model="Student_Class.SectionNo" @change="fetchDept(GroupNo,SchoolNo,Student_Class.SectionNo)" class="form-select col-2" id="Sections">
        <option v-for="Section in Sections" v-bind:value="Section.SectionNo" :key="Section.SectionNo">{{Section.SectionName}}</option>
      </select>
    </div>
    <div class="col-md-2">
      <label for="Dept">Departments</label>
      <select v-model="Student_Class.DepartmentNo" @change="fetchGrades(GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo)" class="form-select col-2" id="Dept">
        <option v-for="dept in Depts" v-bind:value="dept.DepartmentNo" :key="dept.DepartmentNo">{{dept.DepartmentName}}</option>
      </select>
    </div>
    <div class="col-md-2">
      <label for="Grade">Grades</label>
      <select v-model="Student_Class.GradeNo" @change="fetchClasses(GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo)" class="form-select col-2" id="Grade">
        <option v-for="grade in Grades" v-bind:value="grade.GradeNo" :key="grade.GradeNo">{{grade.Grade}}</option>
      </select>
    </div>
    <div class="col-md-2">
      <label for="Class">Class</label>
      <select v-model="Student_Class.ClassNo" @change="fetchfinancials(Student_Class.SY,GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo)" class="form-select col-2" id="Class">
        <option v-for="MyClass in Classes" v-bind:value="MyClass.ClassNo" :key="MyClass.ClassNo">{{MyClass.ClasseName}}</option>
      </select>
    </div>
  </div>
      <!-- v-on:click.capture="fetchfinancials(Student_Class.SY,Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo)" -->
  <div class="row">
    <div class="col-md-2">
      <label for="id">ID</label>
      <input
        type="text"
        class="form-control"
        id="id"
        v-model="Student.StudentNo"
        disabled
      />
    </div>
    <div class="col-md-5">
      <label for="EName">English Name</label>
      <input
        type="text"
        id="EName"
        class="form-control"
        v-model="Student.Student_name"
        disabled
      />
    </div>
    <div class="col-md-5">
      <label for="AName">Arabic Name</label>
      <input
        type="text"
        class="form-control"
        id="AName"
        v-model="Student.Student_Arabic_name"
        disabled
      />
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
     <label for="package">Installment</label>
      <select v-model="Student_Class.installmentNo" @change="Status = true" class="form-select col-2" id="Sections">
        <option v-for="Installment in Installments" v-bind:value="Installment.InstallmentNo" :key="Installment.InstallmentNo">{{Installment.InstallmentName}}</option>
      </select>
    </div>
    <div class="col-md-6">
      <label for="bus">Bus Package</label>
      <select
        id="bus"
        class="form-select col-2"
        v-on:change="Status = true"
        v-model="Student_Class.BusPackageNo"
      >
        <option
          v-for="BusPackage in BusPackages"
          v-bind:value="BusPackage.BusPackageNo"
          :key="BusPackage.BusPackageNo"
        >{{BusPackage.BusPackageName}}</option>
      </select>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-md-12">
      <button
        v-on:click.prevent="Savestudentclass()"
        class="btn btn-primary btn-lg"
        :disabled="Status === false"
      >{{operation}}</button>
    </div>
  </div>
  <div id="MyTable" class="row mt-3">
    <table  class="table table-md table-bordered table-success table-striped">
      <thead>
        <tr class="d-flex">
          <th class="col-1 text-center">#</th>
          <th class="col-1 text-center">ID</th>
          <th class="col-2 text-center">English Name</th>
          <th class="col-3 text-center">Arabic Name</th>
          <th class="col-2 text-center">Installment</th>
          <th class="col-2 text-center">Bus</th>
          <th class="col-1 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="d-flex" v-for="(student, index) in Students" :key="index">
          <td class="col-1 text-center">{{index + 1}}</td>
          <td class="col-1 text-center">{{student.StudentNo}}</td>
          <td class="col-2 text-center">{{student.Student_name}}</td>
          <td class="col-3 text-center">{{student.Student_Arabic_name}}</td>
          <td class="col-2 text-center">{{student.InstallmentName}}</td>
          <td class="col-2 text-center">{{student.BusPackageName}}</td>
          <div class="btn-group col-1" role="group">
            <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Discount"><span @click="showstudent(student)"><i class="bi bi-pencil"></i></span></td> 
          </div>
        </tr>
      </tbody>
    </table> 
  </div>
      <!-- <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>English Name</th>
            <th>Arabic Name</th>
            <th>Installment</th>
            <th>Bus</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in Students" :key="index">
            <td>{{index+1}}</td>
            <td>{{student.StudentNo}}</td>
            <td>{{student.Student_name}}</td>
            <td>{{student.Student_Arabic_name}}</td>
            <td>{{student.InstallmentName}}</td>
            <td>{{student.BusPackageName}}</td>
            <td class="btn btn-warning" v-on:click.prevent="showstudent(student)">Assign</td>
          </tr>
        </tbody>
      </table> -->
    </form>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
import SY from "../mixins/SYmixin";
import { mapState } from "vuex";
export default {
  mixins: [SY],
  data() {
    return {
      operation: "Save",
      Status: false,
      watchClassNo: 0,
      Student_Class: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        StudentNo: "",
        RegDate: "",
        installmentNo: 0,
        BusPackageNo: 0
      },
      Student: { StudentNo: 0, Student_name: "", Student_Arabic_name: "" },
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      BusPackages: [],
      Installments: [],
      syyears: [],
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },  
  watch: {
    watchClassNo: function(newVal) {
      this.Student_Class.ClassNo = this.watchClassNo;
      this.fetchfinancials(
        this.Student_Class.SY,
        this.Student_Class.GroupNo,
        this.Student_Class.SchoolNo,
        this.Student_Class.SectionNo,
        this.Student_Class.DepartmentNo,
        this.Student_Class.GradeNo,
        this.Student_Class.ClassNo
      );
    }
  },
  methods: {
    Savestudentclass() {
      if (this.operation === "Save") {
        let new_Student = {
          SY: this.Student_Class.SY,
          GroupNo: this.Student_Class.GroupNo,
          SchoolNo: this.Student_Class.SchoolNo,
          SectionNo: this.Student_Class.SectionNo,
          DepartmentNo: this.Student_Class.DepartmentNo,
          GradeNo: this.Student_Class.GradeNo,
          ClassNo: this.Student_Class.ClassNo,
          StudentNo: this.Student_Class.StudentNo,
          InstallmentNo: this.Student_Class.installmentNo,
          BusPackageNo: this.Student_Class.BusPackageNo
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addfinancials",
            new_Student
          )
          .then(() => {
              this.Student_Class.StudentNo = "";
              this.Student_Class.StudentNo = "";
              this.Student_Class.installmentNo = 0;
              this.Student_Class.BusPackageNo = 0;
              this.Student.Student_name = "";
              this.Student.Student_Arabic_name = "";
              this.fetchfinancials(
                this.Student_Class.SY,
                this.GroupNo,
                this.SchoolNo,
                this.Student_Class.SectionNo,
                this.Student_Class.DepartmentNo,
                this.Student_Class.GradeNo,
                this.Student_Class.ClassNo
              );
              this.Status = false;
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Student = {
          SY: this.Student_Class.SY,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SectionNo: this.Student_Class.SectionNo,
          DepartmentNo: this.Student_Class.DepartmentNo,
          GradeNo: this.Student_Class.GradeNo,
          ClassNo: this.Student_Class.ClassNo,
          StudentNo: this.Student_Class.StudentNo,
          InstallmentNo: this.Student_Class.installmentNo,
          BusPackageNo: this.Student_Class.BusPackageNo
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editfinancials/",
            upd_Student
          )
          .then(
            data => {
              this.Student_Class.StudentNo = "";
              this.Student_Class.StudentNo = "";
              this.Student_Class.installmentNo = 0;
              this.Student_Class.BusPackageNo = 0;
              this.Student.Student_name = "";
              this.Student.Student_Arabic_name = "";
              this.fetchfinancials(
                this.Student_Class.SY,
                this.GroupNo,
                this.SchoolNo,
                this.Student_Class.SectionNo,
                this.Student_Class.DepartmentNo,
                this.Student_Class.GradeNo,
                this.Student_Class.ClassNo
              );
              this.operation = "Save";
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    showstudent(Studentinfo) {
      this.Student.StudentNo = Studentinfo.StudentNo;
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.Student_Class.installmentNo = Studentinfo.InstallmentNo;
      this.Student_Class.BusPackageNo = Studentinfo.BusPackageNo;
      if (this.Student_Class.installmentNo) {
        this.operation = "Update";
      } else {
        this.operation = "Save";
      }
      this.Status = true;
    },

    fetchBusPackages(sy, group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getBusPackage/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.BusPackages = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    fetchfinancials(SY, group, school, section, Dpt, Grade, classNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getfinancials/" +
            SY +
            "/" +
            group +
            "/" +
            school +
            "/" +
            section +
            "/" +
            Dpt +
            "/" +
            Grade +
            "/" +
            classNo
        )
        .then(
          data => {
            this.Students = data.data;
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
  },

  created: function() {
    // this.fetchSY();
   this.fetchSection(this.GroupNo,this.SchoolNo)
   this.fetchinstallmets(this.GroupNo,this.SchoolNo)
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
#MyTable {
  overflow-y:scroll;
  height:450px
}
</style>

