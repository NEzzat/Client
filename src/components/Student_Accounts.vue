<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Manage Student Invoices</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">        
    <ShowInvoice
      v-if="showModal"
      v-bind:SY="Student_Class.SY"
      v-bind:GroupNo="GroupNo"
      v-bind:SchoolNo="SchoolNo"
      v-bind:SectionNo="Student_Class.SectionNo"
      v-bind:DepartmentNo="Student_Class.DepartmentNo"
      v-bind:GradeNo="Student_Class.GradeNo"
      v-bind:ClassNo="Student_Class.ClassNo"
      v-bind:StudentNo="Student_Class.StudentNo"
      v-bind:Student_name="Student.Student_name"
      v-bind:partner_id="Student.partner_id"
      v-on:close-invoice="showModal= false"
    ></ShowInvoice>
      <!-- show fees Model -->
    <ShowFees
      v-if="showFees"
      v-bind:SY="Student_Class.SY"
      v-bind:GroupNo="GroupNo"
      v-bind:SchoolNo="SchoolNo"
      v-bind:SectionNo="Student_Class.SectionNo"
      v-bind:DepartmentNo="Student_Class.DepartmentNo"
      v-bind:GradeNo="Student_Class.GradeNo"
      v-bind:ClassNo="Student_Class.ClassNo"
      v-bind:StudentNo="Student_Class.StudentNo"
      v-bind:RegDate="Student_Class.RegDate"
      v-bind:Student_name="Student.Student_name"
      v-on:close-fee="showFees= false"
    ></ShowFees>

      <!-- show Installment Model -->
      <ShowInstallments
        v-if="showModalinstallment"
        v-bind:SY="Student_Class.SY"
        v-bind:GroupNo="GroupNo"
        v-bind:SchoolNo="SchoolNo"
        v-bind:SectionNo="Student_Class.SectionNo"
        v-bind:DepartmentNo="Student_Class.DepartmentNo"
        v-bind:GradeNo="Student_Class.GradeNo"
        v-bind:ClassNo="Student_Class.ClassNo"
        v-bind:StudentNo="Student_Class.StudentNo"
        v-bind:Student_name="Student.Student_name"
        v-on:close-installment="showModalinstallment= false"
      >
        <div slot="footer">
          <button
            type="button"
            class="btn btn-outline-info"
            @click="showModalinstallment= false"
          >Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
        </div>
      </ShowInstallments>

      <!-- show Discounts Model -->
      <ShowNewRate
        v-if="showNRate"
        v-bind:SY="Student_Class.SY"
        v-bind:GroupNo="GroupNo"
        v-bind:SchoolNo="SchoolNo"
        v-bind:SectionNo="Student_Class.SectionNo"
        v-bind:DepartmentNo="Student_Class.DepartmentNo"
        v-bind:GradeNo="Student_Class.GradeNo"
        v-bind:ClassNo="Student_Class.ClassNo"
        v-bind:StudentNo="Student_Class.StudentNo"
        v-bind:RegDate="Student_Class.RegDate"
        v-bind:Student_name="Student.Student_name"
        v-on:close-NewRate="showNRate= false"
      ></ShowNewRate>

    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="Student_Class.SY" class="form-select col-2" id="SY" >
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
    <!-- fetchStudent_Class(Student_Class.SY,Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo) -->
    <div class="col-md-2">
      <label for="Class">Class</label>
      <select v-model="Student_Class.ClassNo" @change="fetchStudent_Class(Student_Class.SY,GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo)" class="form-select col-2" id="Class">
        <option v-for="MyClass in Classes" v-bind:value="MyClass.ClassNo" :key="MyClass.ClassNo">{{MyClass.ClasseName}}</option>
      </select>
    </div>

  <div id="MyTable" class="row mt-3">
    <table  class="table table-md table-bordered table-success table-striped">
      <thead>
        <tr class="d-flex">
          <th class="col-1 text-center">#</th>
          <th class="col-1 text-center">ID</th>
          <th class="col-6 text-center">English Name</th>
          <th class="col-1 text-center">S. Rate</th>
          <th class="col-1 text-center">Reg. Date</th>
          <th class="col-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="d-flex" v-for="(student, index) in Students" :key="index">
          <td class="col-1 text-center">{{index + 1}}</td>
          <td class="col-1 text-center">{{student.StudentNo}}</td>
          <td class="col-6 text-center">{{student.Student_name}}</td>
          <td class="col-1 text-center" v-if="student.SDiscount === 0">No</td>
          <td class="col-1 text-center" v-else>Yes</td>
          <td class="col-1 text-center">{{student.RegDate}}</td>
          <div class="btn-group col-2" role="group">
            <td> 
              <button type="button"
                class="btn btn-primary btn-sm" 
                v-on:click.prevent="showstudentfees(student);showFees=true"
                :disabled = "student.SDiscount===1"
              >Fees
              </button>
            </td>
            <td>
              <button type="button" 
                class="btn btn-warning btn-sm"
                v-on:click.prevent="showNewRate(student);showNRate=true"
                :disabled = "student.SDiscount===0"
              >S.Fees
              </button>
            </td>
            <td 
              class="btn btn-info btn-sm"
              v-on:click.prevent="showstudentAccounts(student);showModalinstallment=true"
              >Inst. 
            </td>  
            <td 
              class="btn btn-danger btn-sm"
              v-on:click.prevent="showstudentAccounts(student);showModal=true"
              >Post 
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
import ShowInvoice from "@/components/ShowInvoice";
import ShowFees from "@/components/ShowFees";
import ShowInstallments from "@/components/ShowInstallments";
import ShowNewRate from "@/components/ShowNewRate";
import SY from "../mixins/SYmixin";
import { mapState } from "vuex";

export default {
  mixins: [SY],
  components: {
    ShowInvoice,
    ShowFees,
    ShowInstallments,
    ShowNewRate
  },
  data() {
    return {
      SY: "",
      operation: "Save",
      showModal: false,
      showFees: false,
      showNRate: false,
      showModalinstallment: false,
      Student_Class: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        StudentNo: "",
        RegDate: ""
      },
      ShowInvoicemodel: false,
      Student: {
        StudentNo: 0,
        Student_name: "",
        Student_Arabic_name: "",
        partner_id: 0
      },
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      Fees: [],
      Installments: [],
      Discounts: [],
      syyears: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
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
          RegDate: this.Student_Class.RegDate
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentclass",
            new_Student
          )
          .then(
            data => {
              this.Student_Class.RegDate = "";
              this.Student_Class.StudentNo = "";
              this.Student.Student_name = "";
              this.Student.Student_Arabic_name = "";
              this.fetchStudent_Class(
                this.Student_Class.SY,
                this.Student_Class.GroupNo,
                this.Student_Class.SchoolNo,
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
      }
    },
    showstudentfees(Studentinfo) {
      this.Student.StudentNo = Studentinfo.StudentNo;
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.Student_Class.RegDate = Studentinfo.RegDate;
    },
    showstudentAccounts(Studentinfo) {
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.Student.partner_id = Studentinfo.partner_id;
      this.Student_Class.RegDate = Studentinfo.RegDate;
    },

    showstudentInstallments(Studentinfo) {
      this.Student.StudentNo = Studentinfo.StudentNo;
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.fetchStudent_Installments(
        this.Student_Class.SY,
        this.Student_Class.GroupNo,
        this.Student_Class.SchoolNo,
        this.Student_Class.SectionNo,
        this.Student_Class.DepartmentNo,
        this.Student_Class.GradeNo,
        this.Student_Class.ClassNo,
        this.Student_Class.StudentNo
      );
    },
    showNewRate(Studentinfo) {
      this.Student.StudentNo = Studentinfo.StudentNo;
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.Student_Class.RegDate = Studentinfo.RegDate;
    },
    fetchStudent_Installments(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentinstallments/" +
            SY +
            "/" +
            GroupNo +
            "/" +
            SchoolNo +
            "/" +
            SectionNo +
            "/" +
            DepartmentNo +
            "/" +
            GradeNo +
            "/" +
            ClassNo +
            "/" +
            StudentNo
        )
        .then(
          data => {
            this.Installments = [];
            this.Installments = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    fetchStudent_Discounts(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentdiscounts/" +
            SY +
            "/" +
            GroupNo +
            "/" +
            SchoolNo +
            "/" +
            SectionNo +
            "/" +
            DepartmentNo +
            "/" +
            GradeNo +
            "/" +
            ClassNo +
            "/" +
            StudentNo
        )
        .then(
          data => {
            this.Discounts = [];
            this.Discounts = data.data;
          },
          errorResponse => {
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
          data => {
            this.Students = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    fetchStudent_Accounts(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      RegDate
    ) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentaccounts/" +
            SY +
            "/" +
            GroupNo +
            "/" +
            SchoolNo +
            "/" +
            SectionNo +
            "/" +
            DepartmentNo +
            "/" +
            GradeNo +
            "/" +
            RegDate
        )
        .then(
          data => {
            this.Fees = data.data;
          },
          errorResponse => {
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
    this.fetchSection(this.GroupNo,this.SchoolNo)

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
