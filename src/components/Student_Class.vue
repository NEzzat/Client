<template>
  <div class="container">
    <div class="row gx-3">
      <div class="col">
        <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
      </div>
      <div class="col">
        <h2 align="center"><span  class="badge card-header bg-success mt-0">Assign Student To Class</span></h2>
      </div>
      <div class="col">
        <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
      </div>      
    </div>
    <form class="row g-3 ">
      <div class="col-md-2">
        <label for="SY">SY</label>
        <select v-model="Student_Class.SY" class="form-select col-2" id="SY">
          <option v-for="sy in syyears" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="Section">Sections</label>
        <select v-model="Student_Class.SectionNo" @click="fetchDept(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo)" class="form-select col-2" id="Section">
          <option v-for="Section in Sections" v-bind:value="Section.SectionNo" :key="Section.SectionNo">{{Section.SectionName}}</option>
        </select>
      </div>    
      <div class="col-md-2">
        <label for="Dept">Departments</label>
        <select v-model="Student_Class.DepartmentNo" @click="fetchGrades(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo)" class="form-select col-2" id="Dept">
          <option v-for="Dept in Depts" v-bind:value="Dept.DepartmentNo" :key="Dept.DepartmentNo">{{Dept.DepartmentName}}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="Grade">Grades</label>
        <select v-model="Student_Class.GradeNo" @click="fetchClasses(Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo);fetchAccepted_Student(Student_Class.SY,Student_Class.GroupNo,Student_Class.SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo)" class="form-select col-2" id="Dept">
          <option v-for="Grade in Grades" v-bind:value="Grade.GradeNo" :key="Grade.GradeNo">{{Grade.Grade}}</option>
        </select>
      </div> 
      <div class="row">
        <div class="col-md-8">
          <label for="Student">Student Name</label>
            <input
              disabled="true"
              type="text"
              class="form-control"
              v-model="Student.Student_name"
              placeholder ="Student Name"
            />
        </div>
        <div class="col-md-2">
          <label for="Student">Registration Date</label>
            <input
              disabled="true"
              type="text"
              class="form-control"
              v-model="Student_Class.RegDate"
              placeholder ="Registration Date"
            />
        </div>
      </div> 
      <div class="row">
        <div class="col-md-2" >
          <label for="Number">Generate New ID</label>
          <div class="input-group">
            <input
              type="text"
              readonly
              class="form-control bg-danger bg-gradient text-white"
              v-model="Student_Class.StudentNo"
              id="Number"
             />
            <span
              class="input-group-text"
              id="Number"
              v-on:click.prevent="GenerateID()"
              ><i class="bi bi-list-ol"></i>
            </span>            
          </div>
        </div>        
        <div class="col-md-2">
          <label for="Class">Classes</label>
          <select v-model="Student_Class.ClassNo" @change="CheckID()" class="form-select col-2" id="Class">
            <option v-for="MyClass in Classes" v-bind:value="MyClass.ClassNo" :key="MyClass.ClassNo">{{MyClass.ClasseName}}</option>
          </select>
        </div>  

      </div> 
      <div class="row mt-3">
        <div class="col-md-12">
          <button
            v-on:click.prevent="Savestudentclass()"
            class="btn btn-primary btn-lg"
            :disabled="Status"
          >Save</button>
        </div>
      </div>
      <div class="row mt-3">
        <table class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-8 text-center">New student</th>
              <th class="col-1 text-center">B.Date</th>
              <th class="col-1 text-center">Form Date</th>
              <th class="col-1 text-center">Action</th>
            </tr>
          </thead>
          <tbody >
            <tr class="d-flex" v-for="(student,index) in Students" :key="index">
              <td class="col-1 text-center">{{index+1}}</td>
              <td class="col-8 text-center">{{student.Name}}</td>
              <td class="col-1 text-center">{{student.Birth_Date}}</td>
              <td class="col-1 text-center">{{student.ApllicationDate}}</td>
              <div class="btn-group col-1" role="group">
                <td class="btn btn-danger" v-on:click.prevent="Show_Student(student)">Assign</td>
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
// import SY from "../mixins/SYmixin";
export default {
  // mixins: [SY],
  data() {
    return {
      SY: "",
      operation: "Save",
      Status: false,
      Form_ID: 0,
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
      },
      Student: {
        StudentNo: 0,
        Student_name: "",
        Birth_date: "",
        Student_Email: "",
        Nationality: "",
        Gender: "",
        Address: "",
        ContactPerson:"",
        ContactPersonMob: ""
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
    Savestudentclass() {
      this.Status = true;
      if (this.Student_Class.StudentNo === "" || this.Student_Class.ClassNo === 0) {
          return;
      }
      var BranchNo = 0;
      this.Schools.forEach((School) => {
        if (School.SchoolNo === this.Student_Class.SchoolNo) {
          BranchNo = School.BranchNo;
        }
      });
      let Student_info = {
        GroupNo: this.Student_Class.GroupNo,
        StudentNo: this.Student_Class.StudentNo,
        Student_name: this.Student.Student_name,
        Birth_date: this.Student.Birth_date,
        Student_Email:
        this.Student_Class.StudentNo.toLowerCase() + "@greenlandschool.org",
        Gender: this.Student.Gender === "Male" ? 1 : 2,
        Nationality:
          this.Student.Nationality === "Egyptian" ||
          this.Student.Nationality === 54 ? 54 : 0,
        SectionNo: this.Student_Class.SectionNo,
        DepartmentNo: this.Student_Class.DepartmentNo,
        GradeNo: this.Student_Class.GradeNo,
        ClassNo: this.Student_Class.ClassNo,
        Address: this.Student.Address,
        ContactPerson: this.Student.ContactPerson,
        ContactPersonMob:this.Student.ContactPersonMob
      };
      console.log(Student_info)
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentinfo",
            Student_info
          )
          .then((data) => {
            if (parseInt(data.data.MSG) > 0 ) {
            let new_Student = {
              SY: this.Student_Class.SY,
              GroupNo: this.Student_Class.GroupNo,
              SchoolNo: this.Student_Class.SchoolNo,
              SectionNo: this.Student_Class.SectionNo,
              DepartmentNo: this.Student_Class.DepartmentNo,
              GradeNo: this.Student_Class.GradeNo,
              ClassNo: this.Student_Class.ClassNo,
              StudentNo: this.Student_Class.StudentNo,
              RegDate: this.Student_Class.RegDate,
            };
            axios
              .post(
                "http://" + server.IP + ":" + server.port + "/addstudentclass",
                new_Student
              )
              .then(() => {
                let AdmissionForm = {
                  ID: this.Form_ID,
                  StudentNo: this.Student_Class.StudentNo,
                };
                axios
                  .put(
                    "http://" +
                      server.IP +
                      ":" +
                      server.port +
                      "/UPDAcceptedForm",
                    AdmissionForm
                  )
                  .then(() => {
                    this.Student_Class.RegDate = "";
                    this.Student_Class.ClassNo = "";
                    this.Student_Class.StudentNo = "";
                    this.Student.Student_name = "";
                    this.fetchAccepted_Student(
                      this.Student_Class.SY,
                      this.Student_Class.GroupNo,
                      this.Student_Class.SchoolNo,
                      this.Student_Class.SectionNo,
                      this.Student_Class.DepartmentNo,
                      this.Student_Class.GradeNo
                    );
                    this.$fire({
                      title: "Student Class",
                      text: "Student Saved",
                      type: "success",
                      timer: 3000
                    }).then(r => {
                      console.log(r.value);
                    });              
                  });
              });
            }
          });
      
    },
    CheckID() {
      if (
        this.Student_Class.StudentNo.length === 9 &&
        this.Student.Student_name
      ) {
        this.Status = false;
      }
    },
    fetchAccepted_Student(SY, group, school, section, dept, grade) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/lisacceptedsyforms/" +
            SY +
            "/" +
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
            this.Students = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },

    Show_Student(NewStudent) {
      this.Student.Student_name = NewStudent.Name;
      this.Student_Class.RegDate = this.Student_Class.SY.substring(0, 4) + "/09/01";
      this.Student.Birth_date = NewStudent.Birth_Date;
      this.Student.Student_Email = NewStudent.Email;
      this.Student.Gender = NewStudent.Gender;
      this.Student.Nationality = NewStudent.FatherNationality;
      this.Student.ContactPerson = NewStudent.MotherName;
      this.Student.ContactPersonMob = NewStudent.MotherMobile;
      this.Student.Address = NewStudent.Address
      this.Form_ID = NewStudent.ID;
      console.log("Student:",this.Student);
    },

    GenerateID() {
      this.Student_Class.StudentNo = this.GroupName.substring(0, 1);
      this.Grades.forEach((Grade) => {
        if (Grade.GradeNo === this.Student_Class.GradeNo) {
          if (Grade.Grade.substring(0, 3) === "PEI") {
            this.Student_Class.StudentNo += "M";
          } else {
            this.Student_Class.StudentNo += Grade.Grade.substring(0, 1);
          }
          this.Student_Class.StudentNo += Grade.Grade.substring(
            Grade.Grade.length - 1,
            Grade.Grade.length
          );
        }
      });
      this.Sections.forEach((Section) => {
        if (Section.SectionNo === this.Student_Class.SectionNo) {
          this.Student_Class.StudentNo += Section.SectionName.substring(0, 1);
        }
      });
      console.log(this.Student_Class.StudentNo);
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/newserial/" +
            this.Student_Class.SY.substring(2, 4) +
            "/" +
            this.Student_Class.StudentNo
        )
        .then(
          (data) => {
            console.log(data.data);
            if (data.data[0].NewSerial === null) {
              this.Student_Class.StudentNo +=
                "01" + "-" + this.Student_Class.SY.substring(2, 4);
            } else {
              var NewSerial = Number(data.data[0].NewSerial);
              NewSerial++;
              if (NewSerial <= 9) {
                this.Student_Class.StudentNo +=
                  "0" + NewSerial + "-" + this.Student_Class.SY.substring(2, 4);
              }
              if (NewSerial >= 10) {
                this.Student_Class.StudentNo +=
                  Number(data.data[0].NewSerial) +
                  1 +
                  "-" +
                  this.Student_Class.SY.substring(2, 4);
              }
            }
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
  },
  created: function () {
    this.fetchSY();
    this.Student_Class.GroupNo =this.GroupNo;
    this.Student_Class.SchoolNo =this.SchoolNo;
    this.fetchSection(this.GroupNo,this.SchoolNo);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
