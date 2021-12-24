<template>
  <div class="container">
    <!-- <h2 align="center">Student Transfer</h2> -->
    <div class="row mb-1">
      <div class="col">
        <h5 align="left" class="animate__animated animate__backInLeft mt-1"><span>{{GroupName}}</span></h5>
      </div>
      <div class="col">
        <h3 align="center"><span  class="badge card-header bg-success mt-1">Student Transition</span></h3>
      </div>
      <div class="col">
        <h5 align="right" class="animate__animated animate__backInRight mt-1"><span>{{SchoolName}}</span></h5>
      </div>      
    </div>        
    <form classe="row mt-1 g-5">
      <div class="card mt-1" id="cardfrom" >
        <div class="card-header">
          <h4 align="center"><span  class="badge card-header bg-success mt-0 mb-0">Transition From</span></h4>  
        </div> 
        <div class="card-body mt-0">            
          <div class="row">
            <div class="col-md-2">
              <label for="academicYear">School Year</label>
              <select
                id="academicYear" 
                class="form-select col-2"
                v-model="Student_Class.SY"
                v-on:change="changeSY(Student_Class.SY)"
              >
                <option v-for="sy in SY" :value="sy.SY" :key="sy.SY">
                  {{ sy.SY }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="section">Section</label>
              <select
                id="section"
                v-on:change="fetchDept(GroupNo,SchoolNo,Student_Class.SectionNo,'current');New_Class.SectionNo=Student_Class.SectionNo"
                class="form-select col-2"
                v-model="Student_Class.SectionNo"
              >
                <option
                  v-for="Section in Sections"
                  v-bind:value="Section.SectionNo"
                  v-bind:key="Section.SectionNo"
                >
                  {{ Section.SectionName }}
                </option>
              </select>
            </div>        
            <div class="col-md-2">
              <label for="Department">Department</label>
              <select
                id="Department"
                v-on:change="fetchGrades(GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,'current');New_Class.DepartmentNo=Student_Class.DepartmentNo" 
                class="form-select col-2"
                v-model="Student_Class.DepartmentNo"
              >
                <option v-for="dept in Depts" v-bind:value="dept.DepartmentNo" :key="dept.DepartmentNo">
                  {{ dept.DepartmentName }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="Grade">Grade</label>
              <select
                id="Grade"
                v-on:change="
                  fetchClasses(
                    GroupNo,
                    SchoolNo,
                    Student_Class.SectionNo,
                    Student_Class.DepartmentNo,
                    Student_Class.GradeNo,'current');New_Class.GradeNo=Student_Class.GradeNo + 1;NewGradeNo=Student_Class.GradeNo + 1"
                class="form-select col-2"
                v-model="Student_Class.GradeNo"
              >
                <option v-for="grade in Grades" v-bind:value="grade.GradeNo" v-bind:key="grade.GradeNo">
                  {{ grade.Grade }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="Class">Class</label>
              <select
                id="Class"
                class="form-select col-2"
                v-on:change="fetchStudent_Class(Student_Class.SY,GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo);TransferPercent=0"
                v-model="Student_Class.ClassNo"
              >
                <option
                  v-for="MyClass in Classes"
                  v-bind:value="MyClass.ClassNo"
                  v-bind:key="MyClass.ClassNo"
                >
                  {{ MyClass.ClasseName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="progress">
        <div
            ref="progbar"
            class="progress-bar progress-bar-warning progress-bar-striped"
            role="progressbar"
            aria-valuenow="0"
            aria-valuemin="0"
            v-bind:aria-valuemax="NumOfStudents"
            v-bind:style="{width: TransferPercent + '%'}"
        >{{TransferPercent}}%</div>
      </div>

      <!-- StudentsTo -->
      <div class="card mt-1" id="cardto" >
        <div class="card-header">
          <h4 align="center"><span  class="badge card-header bg-success mt-0 mb-0">Transition To</span></h4>  
        </div> 
        <div class="card-body">
          <div class="row mt-0">
            <div class="col-md-2">
              <label for="toacademicYear">School Year</label>
              <select
                disabled
                id="toacademicYear"
                class="form-select col-2"
                v-model="New_Class.SY"
              >
                <option v-for="sy in SY" :value="sy.SY" :key="sy.SY">
                  {{ sy.SY }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="school">School</label>
              <select
                id="school"
                v-on:change="fetchSection(New_Class.GroupNo,New_Class.SchoolNo,'new')"
                class="form-select col-2"
                v-model="New_Class.SchoolNo"
              >
                <option
                  v-for="school in Schools"
                  v-bind:value="school.SchoolNo"
                  v-bind:key="school.SchoolNo"
                >{{school.SchoolName}}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="Newsection">Section</label>
              <select
                id="Newsection"
                v-on:change="fetchDept(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,'new')"
                class="form-select col-2"
                v-model="New_Class.SectionNo"
              >
                <option
                  v-for="Section in NewSections"
                  v-bind:value="Section.SectionNo"
                  v-bind:key="Section.SectionNo"
                >{{Section.SectionName}}</option>
              </select>
            </div>


            <div class="col-md-2">
              <label for="Department">Department</label>
              <select
                id="NewDepartment"
                v-on:change="fetchGrades(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,New_Class.DepartmentNo,'new')"
                class="form-select col-2"
                v-model="New_Class.DepartmentNo"
              >
                <option
                  v-for="dept in NewDepts"
                  v-bind:value="dept.DepartmentNo"
                  v-bind:key="dept.DepartmentNo"
                >{{dept.DepartmentName}}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="NewGrade">Grade</label>
              <select
                id="NewGrade"
                v-on:change="fetchClasses(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,New_Class.DepartmentNo,New_Class.GradeNo,'new')"
                class="form-select col-2"
                v-model="New_Class.GradeNo"
              >
                <option
                  v-for="grade in NewGrades"
                  v-bind:value="grade.GradeNo"
                  v-bind:key="grade.GradeNo"
                >{{grade.Grade}}</option>
              </select>
            </div>                    
            <div class="col-md-2">
              <label for="NewClass">Class</label>
              <select id="NewClass"
              class="form-select col-2" 
              v-model="New_Class.ClassNo"
              v-on:change="Status = Students.length > 0 ? false : true"
              >
                <option
                  v-for="MyClass in NewClasses"
                  v-bind:value="MyClass.ClassNo"
                  v-bind:key="MyClass.ClassNo"
                >{{MyClass.ClasseName}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
        <!-- <class class="card" id="card" >
          <div class="card-body">   
            <h4>Students Passe From</h4>
          </div>
          <div class="col-md-2">
            <label for="SY">School Year</label>
            <select v-model="Student_Class.SY" v-on:change="changeSY(Student_Class.SY)" class="form-select col-2" id="SY" >
              <option v-for="sy in SY" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
            </select>
          </div>        
          <div class="col-md-3">
            <label for="section">Section</label>
            <select
              id="section"
              v-on:change="fetchDept(GroupNo,SchoolNo,Student_Class.Student_Class.SectionNo)"
              class="form-select col-2"
              v-model="Student_Class.SectionNo"
            >
              <option
                v-for="Section in Sections"
                v-bind:value="Section.SectionNo"
                v-bind:key="Section.SectionNo"
              >
                {{ Section.SectionName }}
              </option>
            </select>
          </div>
        </class>
      </form>         -->
            <!-- <div class="col-md-1">
              <label for="section">Section</label>
            </div>
            <div class="col-md-3">
              <select
                id="section"
                v-on:change="fetchDept(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,'current');New_Class.SectionNo=Student_Class.SectionNo"
                class="form-control input"
                v-model="Student_Class.SectionNo"
              >
                <option
                  v-for="Section in Sections"
                  v-bind:value="Section.SectionNo"
                  v-bind:key="Section.SectionNo"
                >{{Section.SectionName}}</option>
              </select>
            </div> -->
          <!-- </div>
          <div class="form-group row">
            <div class="col-md-1">
              <label for="Department">Dept.</label>
            </div>
            <div class="col-md-3">
              <select
                id="Department"
                v-on:change="fetchGrades(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,'current');New_Class.DepartmentNo=Student_Class.DepartmentNo"
                class="form-control input"
                v-model="Student_Class.DepartmentNo"
              >
                <option
                  v-for="dept in Depts"
                  v-bind:value="dept.DepartmentNo"
                  v-bind:key="dept.DepartmentNo"
                >{{dept.DepartmentName}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="Department">Grade</label>
            </div>
            <div class="col-md-3">
              <select
                id="Department"
                v-on:change="fetchClasses(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,'current');New_Class.GradeNo=Student_Class.GradeNo + 1;NewGradeNo=Student_Class.GradeNo + 1"
                class="form-control input"
                v-model="Student_Class.GradeNo"
              >
                <option
                  v-for="grade in Grades"
                  v-bind:value="grade.GradeNo"
                  v-bind:key="grade.GradeNo"
                >{{grade.Grade}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="Department">Class</label>
            </div>
            <div class="col-md-3">
              <select
                id="Class"
                class="form-control input"
                v-on:change="fetchStudent_Class(Student_Class.SY,Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo);TransferPercent=0"
                v-model="Student_Class.ClassNo"
              >
                <option
                  v-for="MyClass in Classes"
                  v-bind:value="MyClass.ClassNo"
                  v-bind:key="MyClass.ClassNo"
                >{{MyClass.ClasseName}}</option>
              </select>
            </div>
          </div> -->
        
        <!-- <div class="progress">
          <div
            ref="progbar"
            class="progress-bar progress-bar-warning progress-bar-striped"
            role="progressbar"
            aria-valuenow="0"
            aria-valuemin="0"
            v-bind:aria-valuemax="NumOfStudents"
            v-bind:style="{width: TransferPercent + '%'}"
          >{{TransferPercent}}%</div>
        </div>

        <div class="jumbotron">
          <h4>Students Passe To</h4>
          <div class="form-group row">
            <div class="col-md-1">
              <label for="academicYear">A/Y</label>
            </div>
            <div class="col-md-2">
              <select id="academicYear" disabled class="form-control input" v-model="New_Class.SY">
                <option v-for="sy in syyears" v-bind:value="sy.SY" v-bind:key="sy.SY">{{sy.SY}}</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-1">
              <label for="Group">Group</label>
            </div>
            <div class="col-md-3">
              <select id="Group" class="form-control input" v-model="New_Class.GroupNo">
                <option
                  v-for="Group in Groups"
                  v-bind:value="Group.GroupNo"
                  v-bind:key="Group.GroupNo"
                >{{Group.GroupName}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="school">School</label>
            </div>
            <div class="col-md-3">
              <select
                id="school"
                v-on:change="fetchSection(New_Class.GroupNo,New_Class.SchoolNo,'new')"
                class="form-control input"
                v-model="New_Class.SchoolNo"
              >
                <option
                  v-for="school in Schools"
                  v-bind:value="school.SchoolNo"
                  v-bind:key="school.SchoolNo"
                >{{school.SchoolName}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="section">Section</label>
            </div>
            <div class="col-md-3">
              <select
                id="section"
                v-on:change="fetchDept(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,'new')"
                class="form-control input"
                v-model="New_Class.SectionNo"
              >
                <option
                  v-for="Section in NewSections"
                  v-bind:value="Section.SectionNo"
                  v-bind:key="Section.SectionNo"
                >{{Section.SectionName}}</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-1">
              <label for="Department">Dept.</label>
            </div>
            <div class="col-md-3">
              <select
                id="Department"
                v-on:change="fetchGrades(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,New_Class.DepartmentNo,'new')"
                class="form-control input"
                v-model="New_Class.DepartmentNo"
              >
                <option
                  v-for="dept in NewDepts"
                  v-bind:value="dept.DepartmentNo"
                  v-bind:key="dept.DepartmentNo"
                >{{dept.DepartmentName}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="Department">Grade</label>
            </div>
            <div class="col-md-3">
              <select
                id="Department"
                v-on:change="fetchClasses(New_Class.GroupNo,New_Class.SchoolNo,New_Class.SectionNo,New_Class.DepartmentNo,New_Class.GradeNo,'new')"
                class="form-control input"
                v-model="New_Class.GradeNo"
              >
                <option
                  v-for="grade in NewGrades"
                  v-bind:value="grade.GradeNo"
                  v-bind:key="grade.GradeNo"
                >{{grade.Grade}}</option>
              </select>
            </div>
            <div class="col-md-1">
              <label for="Department">Class</label>
            </div>
            <div class="col-md-3">
              <select id="Class"
              class="form-control input" 
              v-model="New_Class.ClassNo"
              v-on:change="Status = Students.length > 0 ? false : true"
              >
                <option
                  v-for="MyClass in NewClasses"
                  v-bind:value="MyClass.ClassNo"
                  v-bind:key="MyClass.ClassNo"
                >{{MyClass.ClasseName}}</option>
              </select>
            </div>
          </div>
        </div>


        </div>-->


        <div id="MyTable" class="row mt-1">
        <table  class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">Serial</th>
              <th class="col-1 text-center">Passed</th>
              <th class="col-4 text-center">English Name</th>
              <th class="col-4 text-center">Arabic Name</th>
              <th class="col-2 text-center">Reg.Date</th>
            </tr>
          </thead>
          <tbody>
            <tr class="d-flex" v-for="(student, index) in Students" :key="index">
              <td class="col-1 text-center">{{index+1}}</td>
              <td class="col-1 text-center"><input v-on:change="studentfailed(student)" type="checkbox" checked></td>
              <td class="col-4 text-center ">{{student.Student_name}}</td>
              <td class="col-4 text-center">{{student.Student_Arabic_name}}</td>
              <td class="col-2 text-center">{{student.RegDate}}</td> 
            </tr>
          </tbody>
        </table> 
        </div>
        <div class="row mt-2 ">
          <div class="col-md-12 d-flex justify-content-center">
              <button
                v-on:click.prevent="Savestudentclass()"
                class="btn btn-primary btn-lg"
                :disabled="Status"
              >Transition</button>
          </div>
        </div>      
        <!-- <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Passed</th>
              <th>ID</th>
              <th>English Name</th>
              <th>Arabic Name</th>
              <th>Reg. Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in Students" :key="index">
              <td>{{index+1}}</td>
              <td>
                <input type="checkbox" checked v-on:change="studentfailed(student)" />
              </td>
              <td>{{student.StudentNo}}</td>
              <td>{{student.Student_name}}</td>
              <td>{{student.Student_Arabic_name}}</td>
              <td>{{student.RegDate}}</td>
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
import Group from "../mixins/Groupmixin";
import { mapState } from "vuex";
export default {
  mixins: [SY,Group], 
  data() {
    return {
      SY: "",
      Status: true,
      NewGradeNo: 0,
      NumOfStudents: 0,
      CurrentStudent: 0,
      TransferPercent: 0,
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
        Passed: 0
      },
      New_Class: {
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
      student_financial: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        StudentNo: "",
        InstallmentNo: 0,
        BusPackageNo: 0
      },
      student_discount: [
        {
          SY: "",
          GroupNo: 1,
          SchoolNo: 0,
          SectionNo: 0,
          DepartmentNo: 0,
          GradeNo: 0,
          ClassNo: 0,
          StudentNo: "",
          DiscountPackageNo: 0
        }
      ],

      Groups: [],
      Schools: [],
      Sections: [],
      NewSections: [],
      Depts: [],
      NewDepts: [],
      Grades: [],
      NewGrades: [],
      Classes: [],
      NewClasses: [],
      Students: [],
      fallen_students: [],
      syyears: []
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },    
  watch: {
    NewGradeNo: function(newVal) {
      this.fetchClasses(
        this.New_Class.GroupNo,
        this.New_Class.SchoolNo,
        this.New_Class.SectionNo,
        this.New_Class.DepartmentNo,
        this.NewGradeNo,
        "new"
      );
    }
  },
  methods: {
    Savestudentclass() {
      if (!this.New_Class.SY) {
        return
      };
      this.NumOfStudents = this.Students.length;
      this.CurrentStudent = 0;
      this.TransferPercent = 0;
      this.Students.forEach(Student => {
        this.CurrentStudent++;
        this.TransferPercent = (this.CurrentStudent / this.NumOfStudents) * 100;
        var FaildStudent = this.fallen_students.includes(Student.StudentNo);
        if (FaildStudent) {
          var Student_States = {
            SY: this.New_Class.SY,
            GroupNo: this.Student_Class.GroupNo,
            SchoolNo: this.Student_Class.SchoolNo,
            SectionNo: this.Student_Class.SectionNo,
            DepartmentNo: this.Student_Class.DepartmentNo,
            GradeNo: this.Student_Class.GradeNo,
            ClassNo: this.Student_Class.ClassNo,
            StudentNo: Student.StudentNo,
            RegDate: Student.RegDate
          };
        } else {
          var Student_States = {
            SY: this.New_Class.SY,
            GroupNo: this.New_Class.GroupNo,
            SchoolNo: this.New_Class.SchoolNo,
            SectionNo: this.New_Class.SectionNo,
            DepartmentNo: this.New_Class.DepartmentNo,
            GradeNo: this.New_Class.GradeNo,
            ClassNo: this.New_Class.ClassNo,
            StudentNo: Student.StudentNo,
            RegDate: Student.RegDate
          };
        }
        // console.log("Student :", Student_States);

        axios.post(
          "http://" + server.IP + ":" + server.port + "/addstudentclass",
          Student_States
        );
        //   insert new record in student_financials with the new Department ,grade & class
        //   and the new SY and the same data for the old financials
        const financial_promiss = this.fetchStudentfinancial(
          this.Student_Class.SY,
          this.Student_Class.GroupNo,
          this.Student_Class.SchoolNo,
          this.Student_Class.SectionNo,
          this.Student_Class.DepartmentNo,
          this.Student_Class.GradeNo,
          this.Student_Class.ClassNo,
          Student.StudentNo
        );
        financial_promiss.then(Mystudent => {
          this.student_financial = Mystudent.data[0];
          this.student_financial.SY = this.New_Class.SY;
          if (!FaildStudent) {
            this.student_financial.SchoolNo = this.New_Class.SchoolNo;
            this.student_financial.SectionNo = this.New_Class.SectionNo;
            this.student_financial.DepartmentNo = this.New_Class.DepartmentNo;
            this.student_financial.GradeNo = this.New_Class.GradeNo;
            this.student_financial.ClassNo = this.New_Class.ClassNo;
          }
          // console.log("financial :", this.student_financial);
          axios.post(
            "http://" + server.IP + ":" + server.port + "/addfinancials",
            this.student_financial
          );
        });
        const discount_promiss = this.fetchStudent_Discounts(
          this.Student_Class.SY,
          this.Student_Class.GroupNo,
          this.Student_Class.SchoolNo,
          this.Student_Class.SectionNo,
          this.Student_Class.DepartmentNo,
          this.Student_Class.GradeNo,
          this.Student_Class.ClassNo,
          Student.StudentNo
        ).then(cuurentdiscount => {
          if (cuurentdiscount.data.length > 0) {
            cuurentdiscount.data.forEach(Discount => {
              this.saveStudentDiscount(Discount, FaildStudent);
            });
          }
        });
      });
      this.Status = true;
    },
    async saveStudentDiscount(discount, StudentStatus) {
      if (StudentStatus) {
        var new_Student = {
          SY: this.New_Class.SY,
          GroupNo: this.New_Class.GroupNo,
          SchoolNo: this.New_Class.SchoolNo,
          SectionNo: this.New_Class.SectionNo,
          DepartmentNo: this.Student_Class.DepartmentNo,
          GradeNo: this.Student_Class.GradeNo,
          ClassNo: this.Student_Class.ClassNo,
          StudentNo: discount.StudentNo,
          DiscountPackageNo: discount.DiscountPackageNo
        };
      } else {
        var new_Student = {
          SY: this.New_Class.SY,
          GroupNo: this.New_Class.GroupNo,
          SchoolNo: this.New_Class.SchoolNo,
          SectionNo: this.New_Class.SectionNo,
          DepartmentNo: this.New_Class.DepartmentNo,
          GradeNo: this.New_Class.GradeNo,
          ClassNo: this.New_Class.ClassNo,
          StudentNo: discount.StudentNo,
          DiscountPackageNo: discount.DiscountPackageNo
        };
      }
      await axios.post(
        "http://" + server.IP + ":" + server.port + "/adddiscount",
        new_Student
      );
    },
    changeSY(currentSY) {
      if (this.SY.map(function(e) { return e.SY; }).indexOf(currentSY)+1 >= this.SY.length) {
        this.New_Class.SY ="";
      } else {
        this.New_Class.SY = this.SY[this.SY.map(function(e) { return e.SY; }).indexOf(currentSY) + 1].SY;
      }
    },
    fetchSection(group, school, flag) {
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
            if (flag === "current") {
              this.Sections = data.data;
              this.NewSections = data.data;
            } else {
              this.New_Class.SectionNo = 0;
              this.NewSections = data.data;
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    studentfailed(student) {
      // search in the array if found remove the student, if not add it
      if (this.fallen_students.includes(student.StudentNo)) {
        var i = 0;
        this.fallen_students.forEach(FStudent => {
          if (FStudent === student.StudentNo) {
            this.fallen_students.splice(i, 1);
          }
          i++;
        });
      } else {
        this.fallen_students.push(student.StudentNo);
      }
    },
    async fetchStudentfinancial(
      SY,
      group,
      school,
      section,
      Dpt,
      Grade,
      classNo,
      studentno
    ) {
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentfinancials/" +
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
            classNo +
            "/" +
            studentno
        );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStudent_Discounts(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getdiscounts/" +
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
        );
      } catch (error) {
        console.error(error);
      }
    },

    fetchGrades(group, school, section, dept, flag) {
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
            if (flag === "current") {
              this.Grades = data.data;
              this.NewGrades = data.data;
            } else {
              this.New_Class.GradeNo = 0;
              this.NewGrades = data.data;
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    fetchClasses(group, school, section, dept, grade, flag) {
      if (flag === "current") {
        var index = this.Grades.map(function(e) { return e.GradeNo; }).indexOf(grade);
        if ( this.Grades.length - index == 1) { //New School
          this.New_Class.SchoolNo = 0;
          this.New_Class.SectionNo = 0;
          this.New_Class.DepartmentNo = 0;
        }
      } 
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
            if (flag === "current") {
              this.Classes = data.data;
              // this.NewClasses = data.data;
            } else {
              this.New_Class.ClassNo = 0;
              this.NewClasses = data.data;
            }
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
            if (this.Students.length === 0) {
              this.Status = true;
            } 
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
    },
    fetchDept(group, school, section, flag) {
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
            if (flag === "current") {
              this.Depts = data.data;
              this.NewDepts = data.data;
            } else {
              this.NewDepts = data.data;
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    }
  },
  created: function() {
    this.Student_Class.GroupNo = this.GroupNo;
    this.Student_Class.SchoolNo = this.SchoolNo;
    this.fetchSchools(this.GroupNo);
    this.New_Class.GroupNo = this.GroupNo;
    this.New_Class.SchoolNo = this.SchoolNo;
    this.fetchSection(this.GroupNo,this.SchoolNo,"current");
  }
};
</script>

<style>
h5 {
  color: #047c14;
  margin-bottom: 0px;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
#cardfrom {
  background-color: rgb(212, 199, 6);
}
#cardto {
  background-color: rgb(179, 167, 2);
}
thead {
  color: #047c14;
}
#MyTable {
  overflow-y:scroll;
  height:350px
}
.table-striped > tbody > tr:nth-of-type(odd) {
  color: #047c14;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #023b09;
}
</style>
