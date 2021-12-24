<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Student Discounts</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="Student_Class.SY" class="form-select col-2" id="SY">
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
      <select v-model="Student_Class.ClassNo" @change="fetchStudent_Class(Student_Class.SY,GroupNo,SchoolNo,Student_Class.SectionNo,Student_Class.DepartmentNo,Student_Class.GradeNo,Student_Class.ClassNo)" class="form-select col-2" id="Class">
        <option v-for="MyClass in Classes" v-bind:value="MyClass.ClassNo" :key="MyClass.ClassNo">{{MyClass.ClasseName}}</option>
      </select>
    </div>

      <!-- <div class="row mt-3">
        <div class="col-md-12">
          <button
            v-on:click.prevent="SavestudentDiscounts()"
            class="btn btn-primary btn-lg"
          >
            {{ operation }}
          </button>
        </div>
      </div> -->
      <DiscountHandler
        v-if="Status"
        v-bind:SY="Student_Class.SY"
        v-bind:GroupNo="GroupNo"
        v-bind:SchoolNo="SchoolNo"
        v-bind:SectionNo="Student_Class.SectionNo"
        v-bind:DepartmentNo="Student_Class.DepartmentNo"
        v-bind:GradeNo="Student_Class.GradeNo"
        v-bind:ClassNo="Student_Class.ClassNo"
        v-bind:StudentNo="Student_Class.StudentNo"
        v-bind:RegDate="Student.RegDate"
        v-bind:Student_name="Student.Student_name"
        v-on:close-discount="Status = false"
      ></DiscountHandler>
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
                <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Discount"><span @click="showstudent(student)"><i class="bi bi-pencil"></i></span></td> 
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
import DiscountHandler from "@/components/DiscountsHandler";
import SY from "../mixins/SYmixin";
import { mapState } from "vuex";
export default {
  mixins: [SY],
  components: { DiscountHandler },
  data() {
    return {
      operation: "Save",
      Status: false,
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
        BusPackageNo: 0,
      },
      Student: {
        StudentNo: 0,
        Student_name: "",
        Student_Arabic_name: "",
        RegDate: "",
      },

      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      Selected: [],
      DiscountPackages: [],
      Fees: [],
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },
  methods: {
    async SavestudentDiscounts() {
      let DeleteDiscount = await this.DeletestudentDiscounts(
        this.Student_Class.SY,
        this.Student_Class.GroupNo,
        this.Student_Class.SchoolNo,
        this.Student_Class.SectionNo,
        this.Student_Class.DepartmentNo,
        this.Student_Class.GradeNo,
        this.Student_Class.ClassNo,
        this.Student_Class.StudentNo
      );
      if (this.Selected.length > 0) {
        this.Selected.forEach((line) => {
          let new_Student = {
            SY: this.Student_Class.SY,
            GroupNo: this.Student_Class.GroupNo,
            SchoolNo: this.Student_Class.SchoolNo,
            SectionNo: this.Student_Class.SectionNo,
            DepartmentNo: this.Student_Class.DepartmentNo,
            GradeNo: this.Student_Class.GradeNo,
            ClassNo: this.Student_Class.ClassNo,
            StudentNo: this.Student_Class.StudentNo,
            DiscountPackageNo: line.DiscountPackageNo,
            DiscountValue: line.DiscountValue,
          };
          if (line.DiscountPackageValue > 0) {
            new_Student.DiscountValue = line.DiscountPackageValue;
          } else {
            // claculate Discount if % CalcDiscount(fee, discount)
            this.Fees.forEach((Fee) => {
              if (Fee.SourceNo === line.SourceNo) {
                new_Student.DiscountValue =
                  (Fee.Amount * line.DiscountPackagePercent) / 100;
              }
            });
          }
          let InsertedDescount = this.InsertstudentDiscounts(new_Student);
        });
        this.Student.StudentNo = "";
        this.Student_Class.StudentNo = "";
        this.Selected = [];
        this.Student.Student_name = "";
        this.Student.Student_Arabic_name = "";
        this.fetchDiscountPackages(
          this.Student_Class.GroupNo,
          this.Student_Class.SchoolNo
        );
        this.operation = "Save";
      }
    },

    async InsertstudentDiscounts(new_Student) {
      try {
        return await axios.post(
          "http://" + server.IP + ":" + server.port + "/adddiscount",
          new_Student
        );
      } catch (err) {
        console.log(err);
      }
    },
    async DeletestudentDiscounts(
      SY,
      Group,
      School,
      Section,
      Department,
      Grade,
      Class,
      Student
    ) {
      try {
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deletediscount/" +
            SY +
            "/" +
            Group +
            "/" +
            School +
            "/" +
            Section +
            "/" +
            Department +
            "/" +
            Grade +
            "/" +
            Class +
            "/" +
            Student
        );
      } catch (err) {
        console.log(err);
      }
    },
    showstudent(Studentinfo) {
      this.Student.StudentNo = Studentinfo.StudentNo;
      this.Student_Class.StudentNo = Studentinfo.StudentNo;
      this.Student.Student_name = Studentinfo.Student_name;
      this.Student.Student_Arabic_name = Studentinfo.Student_Arabic_name;
      this.Student.RegDate = Studentinfo.RegDate;
      this.Status = true;
      console.log(this.Status)
      // this.fetchStudent_Discounts(
      //   this.Student_Class.SY,
      //   this.Student_Class.GroupNo,
      //   this.Student_Class.SchoolNo,
      //   this.Student_Class.SectionNo,
      //   this.Student_Class.DepartmentNo,
      //   this.Student_Class.GradeNo,
      //   this.Student_Class.ClassNo,
      //   this.Student_Class.StudentNo
      // );
      // this.fetchStudent_Accounts(
      //   this.Student_Class.SY,
      //   this.Student_Class.GroupNo,
      //   this.Student_Class.SchoolNo,
      //   this.Student_Class.SectionNo,
      //   this.Student_Class.DepartmentNo,
      //   this.Student_Class.GradeNo,
      //   this.Student.RegDate
      // );
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
          (data) => {
            this.Fees = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    //   async CalcDiscount(fee, discount) {
    //     var DiscountValue = 0;

    //     var Discount_line = {};
    //     Discount_line.SY = this.SY;
    //     Discount_line.GroupNo = this.GroupNo;
    //     Discount_line.SchoolNo = this.SchoolNo;
    //     Discount_line.SectionNo = this.SectionNo;
    //     Discount_line.DepartmentNo = this.DepartmentNo;
    //     Discount_line.GradeNo = this.GradeNo;
    //     Discount_line.ClassNo = this.ClassNo;
    //     Discount_line.StudentNo = this.StudentNo;
    //     if (fee.SourceNo === discount.SourceNo) {
    //       // if Discount is Value
    //       if (discount.DiscountPackageValue != 0) {
    //         DiscountValue += discount.DiscountPackageValue;
    //         Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
    //         Discount_line.DiscountValue = discount.DiscountPackageValue;
    //         this.Discount_lines.push(Discount_line);
    //       }
    //       //       // claculate discount if %
    //       if (discount.DiscountPackagePercent != 0) {
    //         if (fee.SourceNo === discount.SourceNo) {
    //           DiscountValue +=
    //             (fee.Amount * discount.DiscountPackagePercent) / 100;
    //           Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
    //           Discount_line.DiscountValue =
    //             (fee.Amount * discount.DiscountPackagePercent) / 100;
    //           this.Discount_lines.push(Discount_line);
    //         }
    //       }
    //       return DiscountValue;
    //     }
    //   }
    // },
    selectDiscount(Discount) {
      if (this.Student.StudentNo === 0) {
        alert("No Student Selected");
        return;
      }
      this.Selected.push(Discount);
      var index = this.DiscountPackages.indexOf(Discount);
      if (index > -1) {
        this.DiscountPackages.splice(index, 1);
      }
    },

    deselectDiscount(Discount) {
      this.DiscountPackages.push(Discount);
      var index = this.Selected.indexOf(Discount);
      if (index > -1) {
        this.Selected.splice(index, 1);
      }
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
        )
        .then(
          (data) => {
            this.Selected = data.data;
            if (this.Selected.length > 0) {
              this.operation = "Update";
            } else {
              this.operation = "Save";
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    fetchDiscountPackages(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getDiscountPackage/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.DiscountPackages = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },

    // fetchstudentdiscounts(SY, group, school, section, Dpt, Grade, classNo) {
    //   axios
    //     .get(
    //       "http://" +
    //         server.IP +
    //         ":" +
    //         server.port +
    //         "/getdiscounts/" +
    //         SY +
    //         "/" +
    //         group +
    //         "/" +
    //         school +
    //         "/" +
    //         section +
    //         "/" +
    //         Dpt +
    //         "/" +
    //         Grade +
    //         "/" +
    //         classNo
    //     )
    //     .then(
    //       data => {
    //         this.Students = data.data;
    //       },
    //       errorResponse => {
    //         console.log("err :" + errorResponse);
    //       }
    //     );
    // },

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
  },
 mounted() {
    
  },
  created: function () {
    // this.modal = new Modal(this.$refs.exampleModal)
    this.fetchSection(this.GroupNo,this.SchoolNo)
  },
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
