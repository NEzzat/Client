<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Daily Absence</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">        
    <ShowAbsent
        v-if="showModal"
        v-bind:SY="Student_Absence.SY"
        v-bind:GroupNo="GroupNo"
        v-bind:SchoolNo="SchoolNo"
        v-bind:SectionNo="Student_Absence.SectionNo"
        v-bind:DepartmentNo="Student_Absence.DepartmentNo"
        v-bind:GradeNo="Student_Absence.GradeNo"
        v-bind:ClassNo="Student_Absence.ClassNo"
        v-bind:StudentNo="Student_Absence.StudentNo"
        v-bind:Student_name="Student_Absence.Student_name"
        v-on:close-abcent="showModal= false"
      ></ShowAbsent>
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="Student_Absence.SY" class="form-select col-2" id="SY" >
        <option v-for="sy in SY" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
      </select>
    </div>
    <div class="col-md-2">
      <label for="section">Section</label>
      <select
        id="section"
        v-on:change="fetchDept(GroupNo,SchoolNo,Student_Absence.SectionNo)"
        class="form-select col-2"
        v-model="Student_Absence.SectionNo"
      >
        <option
          v-for="Section in Sections"
          v-bind:value="Section.SectionNo"
          :key="Section.SectionNo"
          >{{Section.SectionName}}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="Department">Dept.</label>
        <select
          id="Department"
          v-on:change="fetchGrades(GroupNo,SchoolNo,Student_Absence.SectionNo,Student_Absence.DepartmentNo)"
          class="form-select col-2"
          v-model="Student_Absence.DepartmentNo"
        >
          <option
            v-for="dept in Depts"
            v-bind:value="dept.DepartmentNo"
            :key="dept.DepartmentNo"
          >{{dept.DepartmentName}}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="Department">Grade</label>
        <select
          id="Department"
          v-on:change="fetchClasses(GroupNo,SchoolNo,Student_Absence.SectionNo,Student_Absence.DepartmentNo,Student_Absence.GradeNo)"
          class="form-select col-2"
          v-model="Student_Absence.GradeNo"
        >
          <option
            v-for="grade in Grades"
            v-bind:value="grade.GradeNo"
            :key="grade.GradeNo"
          >{{grade.Grade}}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="Department">Class</label>
        <select
          id="Class"
          v-on:change="fetchStudent_Class(Student_Absence.SY,GroupNo,SchoolNo,Student_Absence.SectionNo,Student_Absence.DepartmentNo,Student_Absence.GradeNo,Student_Absence.ClassNo)"
          class="form-select col-2"
          v-model="Student_Absence.ClassNo"
        >
          <option
            v-for="MyClass in Classes"
            v-bind:value="MyClass.ClassNo"
            :key="MyClass.ClassNo"
          >{{MyClass.ClasseName}}</option>
        </select>
      </div>
      <div id="MyTable" class="row mt-3">
        <table  class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-2 text-center">ID</th>
              <th class="col-4 text-center">English Name</th>
              <th class="col-4 text-center">Arabic Name</th>
              <th class="col-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="d-flex" v-for="(student, index) in Students" :key="index">
              <td class="col-1 text-center">{{index + 1}}</td>
              <td class="col-2 text-center">{{student.StudentNo}}</td>
              <td class="col-4 text-center">{{student.Student_name}}</td>
              <td class="col-4 text-center">{{student.Student_Arabic_name}}</td>
              <div class="btn-group col-1" role="group">
                <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Abcent"><span @click="showstudentabcense(student)"><i class="bi bi-pencil"></i></span></td> 
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
import ShowAbsent from "@/components/ShowAbsent";
import { mapState } from "vuex";
import SY from "../mixins/SYmixin";
export default {
  mixins: [SY],  
  components: {
    ShowAbsent,
  },
  data() {
    return {
      SY: "",
      operation: "Save",
      showModal: false,
      Student_Absence: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        StudentNo: "",
        Student_name: "",
      },
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      syyears: [],
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },  
  methods: {
    showstudentabcense(Studentinfo) {
      this.Student_Absence.StudentNo = Studentinfo.StudentNo;
      this.Student_Absence.Student_name = Studentinfo.Student_name;
      this.showModal = true;
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
            this.Depts = data.data;
          },
          (errorResponse) => {
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
          (data) => {
            this.Grades = data.data;
          },
          (errorResponse) => {
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
          (data) => {
            this.Classes = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    fetchStudent_Class(SY, group, school, section, Dpt, Grade, classNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/liststudents/" +
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
          (data) => {
            this.Students = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },

  },
  created: function () {
    this.fetchSection(this.GroupNo,this.SchoolNo);
  },
};
</script>

<style scoped>
h5 {
  color: #047c14;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
</style>