<template>
  <div class="container">
    <div class="row gx-3">
      <div class="col">
        <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
      </div>
      <div class="col">
        <h2 align="center"><span  class="badge card-header bg-success mt-0">Student Information</span></h2>
      </div>
      <div class="col">
        <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
      </div>      
    </div>        
    <form class="row g-3 mt-3">
      <div class="col-md-2">
        <label for="SY">School Year</label>
        <select v-model="StudentInfo.SY" class="form-select col-2" id="SY">
          <option v-for="SY in syyears" v-bind:value="SY.SY" :key="SY.SY">{{SY.SY}}</option>
        </select>
      </div>
      
      <div class="col-md-2">
        <label for="Number">Student No.</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="StudentInfo.StudentNo"
            id="Number"
            aria-describedby="StudentNo"
          />
          <span
            class="input-group-text"
            id="StudentNo"
            v-on:click.prevent="findstudent(StudentInfo.SY,StudentInfo.StudentNo)"
            ><i class="bi bi-search"></i></span>            
        </div>
      </div>
      <div class="col-md-8">
        <label for="EName">Student Name</label>
        <div class="input-group">  
          <input
            type="text"
            class="form-control"
            v-model="StudentInfo.Student_name"
            id="EName"
          />
          <span class="input-group-text" v-on:click="ShowSearchModel('E')"><i class="bi bi-search"></i></span>
        </div>
      </div> 
      <div class="row g-1 justify-content-end">
        <div class="col-md-8">
          <label for="AName">الاسم العربى</label>
          <div class="input-group">  
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.Student_Arabic_name"
              id="AName"
            />
            <span class="input-group-text" v-on:click="ShowSearchModel('A')"><i class="bi bi-search"></i></span>
          </div>
        </div> 
      </div>
       <ListByName
        v-if="showModal"
        v-bind:Student_name="StudentInfo.Student_name"
        v-bind:Student_Arabic_name="StudentInfo.Student_Arabic_name"
        v-bind:Parent_Module="'StudentInfo'"
        v-bind:Lang="Lang"
        v-bind:Scoped= "0"
        v-bind:SchoolNo= "SchoolNo"        
        v-on:close-Student="showModal= false"
      ></ListByName>      
      <div class="row g-6 mt-2">
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.GroupName"
              placeholder="Group"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.SchoolName"
              placeholder="School"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.SectionName"
              placeholder="Section"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.DepartmentName"
              placeholder="Department"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.Grade"
              placeholder="Grade"
              disabled="true"
            />
          </div>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="StudentInfo.ClassName"
              placeholder="Class"
              disabled="true"
            />
          </div>
        </div>
      </div>
      <div class="row g-3 ">
        <div class="col-md-1 form-check form-check-inline d-flex align-items-baseline">
          <input class="form-check-input" v-model="StudentInfo.Gender"  type="radio" id="inlineCheckbox1" value="1">
          <label class="form-check-label align-middle" for="inlineCheckbox1">Male</label>
        </div>
        <div class="col-md-1 form-check form-check-inline d-flex align-items-baseline">
          <input class="form-check-input" v-model="StudentInfo.Gender" type="radio" id="inlineCheckbox2" value="2">
          <label class="form-check-label" for="inlineCheckbox2">Female</label>
        </div>
        <div class="col-auto">
          <label for="Group">Nationality</label>
        </div>
        <div class="col-md-2">
          <select id="Group" class="form-control input" v-model="StudentInfo.Nationality">
            <option
              v-for="Nationality in Nationalities"
              :key="Nationality.id"
              v-bind:value="Nationality.id"
            >{{Nationality.Name}}</option>
          </select>
        </div>
        <div class="col-auto">
          <label for="BD">Birth Date</label>
        </div>
        <div class="col-md-2">
          <input type="date" id="BD" class="form-control" v-model="StudentInfo.Birth_date" placeholder />
        </div>
        <div class="col-auto">
          <label for="password">Password</label>
        </div>
        <div class="col-md-3">
          <input
            type="text"
            id="password"
            class="form-control"
            v-model="StudentInfo.Password"
            placeholder="Web Password"
          />
        </div>
      </div>    

      <div class="row  mt-2">
        <div class="col-md-1">
          <label for="IDNumber">ID Number</label>
        </div>
      <div class="col-md-3">
        <input type="text" id="IDNumber" class="form-control" v-model="StudentInfo.Student_ID" placeholder />
      </div>
        <div class="col-md-1">
          <div class="checkbox" id="check">
            <label>
              <input type="checkbox" v-model="StudentInfo.SDiscount" /> S.Rate
            </label>
          </div>
        </div>
        <div class="col-md-1">
          <div class="checkbox" id="check">
            <label>
              <input type="checkbox" v-model="StudentInfo.Sibling" :value="StudentInfo.Sibling" /> Sibling
            </label>
          </div>
        </div>
        <div class="col-md-1">
          <div class="checkbox" id="check">
            <label>
              <input type="checkbox" v-model="StudentInfo.Staff" /> Staff
            </label>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-1">
          <label for="email">Email</label>
        </div>
        <div class="col-md-5">
          <input type="text" id="email" class="form-control" v-model="StudentInfo.Student_Email" placeholder />
        </div>
        <div class="col-1">
          <label for="mobile">Mobile</label>
         </div>
        <div class="col-md-5">
          <input type="text" id="mobile" class="form-control" v-model="StudentInfo.Mobile_No" placeholder />
        </div>
      </div>  
      <div class="row mt-2 ">
        <div class="col-md-12 d-flex justify-content-center">
          <button
            v-on:click.prevent="Savestudentinfo()"
            class="btn btn-primary btn-lg"
            :disabled = Enabled 
          >{{operation}}</button>
        </div>
      </div> 
    </form>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
import { mapState } from "vuex";
import ListByName from "@/components/ListByName";
export default {
  components: {
    ListByName,
  },
  data() {
    return {
      operation: "Save",
      showModal: false,
      Enabled : true,
      Lang:"",
      syyears: [],
      Nationalities: [],
      Classes: [],
      StudentInfo: {
        SY: "",
        GroupNo: 0,
        partner_id: 0,
        StudentNo: "",
        Student_name: "",
        Student_Arabic_name: "",
        GroupName: "",
        SchoolName: "",
        SectionNo: 0,
        SectionName: "",
        DepartmentNo: 0,
        DepartmentName: "",
        GradeNo: 0,
        Grade: "",
        ClassNo: "",
        ClassName: "",
        Gender: 1,
        Birth_date: "",
        Student_ID: "",
        Student_Email: "",
        Mobile_No: "",
        SDiscount: 0,
        Nationality: 54,
        Password: "",
        Sibling: 0,
        Staff:0,
        Active : 1
      },
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },   

  methods: {
    Savestudentinfo() {
      if (this.operation === "Save") {
        let new_Studentinfo = {
          GroupNo: this.StudentInfo.GroupNo,
          StudentNo: this.StudentInfo.StudentNo.trim(),
          Student_name: this.StudentInfo.Student_name,
          Student_Arabic_name: this.StudentInfo.Student_Arabic_name,
          Birth_date: this.StudentInfo.Birth_date,
          Gender: this.StudentInfo.Gender,
          Nationality: this.StudentInfo.Nationality,
          Student_ID: this.StudentInfo.Student_ID,
          Student_Email:
            this.StudentInfo.StudentNo.toLowerCase() + "@greenlandschool.org",
          Mobile_No: this.StudentInfo.Mobile_No,
          SDiscount: this.StudentInfo.SDiscount,
          Sibling: this.StudentInfo.Sibling,
          Staff: this.StudentInfo.Staff,
          Password: this.StudentInfo.Password,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentinfo",
            new_Studentinfo
          )
          .then(
            () => {
              this.$fire({
                title: "Student Information",
                text: "Data Saved",
                type: "success",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });              
              this.StudentInfo.RegDate = "";
              this.StudentInfo.StudentNo = "";
              this.StudentInfo.Student_name = "";
              this.StudentInfo.Student_Arabic_name = "";
              this.StudentInfo.GroupName = "";
              this.StudentInfo.SchoolName = "";
              this.StudentInfo.SectionName = "";
              this.StudentInfo.SectionNo = 0;
              this.StudentInfo.DepartmentName = "";
              this.StudentInfo.DepartmentNo = 0;
              this.StudentInfo.Grade = "";
              this.StudentInfo.GradeNo = 0;
              this.StudentInfo.ClassName = "";
              this.StudentInfo.ClassNo = "";
              this.StudentInfo.Birth_date = "";
              this.StudentInfo.Gender = 1;
              this.StudentInfo.Nationality = 54;
              this.StudentInfo.Student_ID = "";
              this.StudentInfo.Student_Email = "";
              this.StudentInfo.Mobile_No = "";
              this.StudentInfo.SDiscount = 0;
              this.StudentInfo.Sibling = 0;
              this.StudentInfo.Staff = 0,
              this.StudentInfo.Password = "";
            },
            (errorResponse) => {
              this.$fire({
                title: "Parent Information",
                text: errorResponse,
                type: "error",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });              
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Studentinfo = {
          StudentNo: this.StudentInfo.StudentNo.trim(),
          GroupNo: this.StudentInfo.GroupNo,
          partner_id: this.StudentInfo.partner_id,
          Student_name: this.StudentInfo.Student_name,
          Student_Arabic_name: this.StudentInfo.Student_Arabic_name,
          Birth_date: this.StudentInfo.Birth_date,
          Gender: this.StudentInfo.Gender,
          Nationality: this.StudentInfo.Nationality,
          Student_ID: this.StudentInfo.Student_ID,
          Student_Email:
            this.StudentInfo.StudentNo.toLowerCase() + "@greenlandschool.org",
          Mobile_No: this.StudentInfo.Mobile_No,
          SDiscount: this.StudentInfo.SDiscount,
          Sibling: this.StudentInfo.Sibling,
          Password: this.StudentInfo.Password,
          section_no: this.StudentInfo.SectionNo,
          department_no: this.StudentInfo.DepartmentNo,
          grade_no: this.StudentInfo.GradeNo,
          class_no: this.StudentInfo.ClassNo,
          Staff: this.StudentInfo.Staff,
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editstudentinfo",
            upd_Studentinfo
          )
          .then(
            () => {
              this.$fire({
                title: "Student Information",
                text: "Data Updated",
                type: "success",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });                        
              this.StudentInfo.StudentNo = "";
              this.StudentInfo.Student_name = "";
              this.StudentInfo.Student_Arabic_name = "";
              this.StudentInfo.GroupName = "";
              this.StudentInfo.SchoolName = "";
              this.StudentInfo.SectionName = "";
              this.StudentInfo.DepartmentName = "";
              this.StudentInfo.Grade = "";
              this.StudentInfo.ClassName = "";
              this.StudentInfo.Birth_date = "";
              this.StudentInfo.Gender = 1;
              this.StudentInfo.Nationality = 54;
              this.StudentInfo.Student_ID = "";
              this.StudentInfo.Student_Email = "";
              this.StudentInfo.Mobile_No = "";
              this.StudentInfo.SDiscount = 0;
              this.StudentInfo.Sibling = 0;
              this.StudentInfo.Password = "";
              this.StudentInfo.Staff = 0,
              this.operation = "Save";
            },
            (errorResponse) => {
              this.$fire({
                title: "Parent Information",
                text: errorResponse,
                type: "error",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });                         
              console.log(errorResponse);
            }
          );
      }
    },
    ShowSearchModel(Lang) {
      this.Lang = Lang
      this.showModal = true;
    },
    FitchNationality() {
      axios
        .get("http://" + server.IP + ":" + server.port + "/getnationality/")
        .then(
          (data) => {
            this.Nationalities = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    findstudent(MySY, StudentNo) {
      if (!MySY) {
        this.$fire({
        title: "SY Not Selected",
        text: "Please Select SY",
        type: "error",
        timer: 4000
        }).then(r => {
          console.log(r.value);
        });
        return                     
      }
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentinfo/" +
            MySY +
            "/" +
            StudentNo.trim()
        )
        .then(
          (data) => {
            if (data.data.length === 0) { 
               this.$fire({
                  title: "Student Not Found",
                  text: "Student Not Registered in this SY",
                  type: "error",
                  timer: 4000
                }).then(r => {
                  console.log(r.value);
                });
                return                                   
            }
              if (data.data[0].Active === 0) {
                this.$fire({
                  title: data.data[0].Student_name,
                  text: "Student is Not Active",
                  type: "error",
                  timer: 4000
                }).then(r => {
                  console.log(r.value);
                });
                return                                  
              }
            
              this.StudentInfo.Student_Arabic_name =
                data.data[0].Student_Arabic_name;
              this.StudentInfo.GroupNo = data.data[0].GroupNo;
              this.StudentInfo.partner_id = data.data[0].partner_id;
              this.StudentInfo.Student_name = data.data[0].Student_name;
              this.StudentInfo.GroupName = data.data[0].GroupName;
              this.StudentInfo.SchoolName = data.data[0].SchoolName;
              this.StudentInfo.SectionName = data.data[0].SectionName;
              this.StudentInfo.SectionNo = data.data[0].SectionNo;
              this.StudentInfo.DepartmentName = data.data[0].DepartmentName;
              this.StudentInfo.DepartmentNo = data.data[0].DepartmentNo;
              this.StudentInfo.Grade = data.data[0].Grade;
              this.StudentInfo.GradeNo = data.data[0].GradeNo;
              this.StudentInfo.ClassName = data.data[0].ClasseName;
              this.StudentInfo.ClassNo = data.data[0].ClassNo;
              this.StudentInfo.Birth_date = data.data[0].Birth_date;
              this.StudentInfo.Gender = data.data[0].Gender;
              this.StudentInfo.Nationality = data.data[0].Nationality;
              this.StudentInfo.Student_ID = data.data[0].Student_ID;
              this.StudentInfo.Student_Email =
                this.StudentInfo.StudentNo.toLowerCase() +
                "@greenlandschool.org";
              this.StudentInfo.Mobile_No = data.data[0].Mobile_No;
              this.StudentInfo.SDiscount = data.data[0].SDiscount;

              this.StudentInfo.Sibling = data.data[0].Sibling;
              this.StudentInfo.Password = data.data[0].Password;
              this.StudentInfo.Staff = data.data[0].Staff;
              this.StudentInfo.Active = data.data[0].Active
              if (this.GroupName ===this.StudentInfo.GroupName ) {
                this.Enabled = false
              } else {
                this.Enabled = true
              }
              this.operation = "Update";
            } 

        ,
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
    this.FitchNationality();
  },
};
</script>


<style scoped>
span {
  cursor: pointer;
}
h2 {

  color: #047c14;
}
h5 {
  color: #047c14;
}
/* label {
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
} */
</style>
