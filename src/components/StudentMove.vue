<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Student Movement</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 "> 
    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="StudentInfo.SY" v-on:change="StudentInfo.NewSY = StudentInfo.SY" class="form-select col-2" id="SY" >
        <option v-for="sy in SY" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
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
      <div class="row mt-4">
        <div class="col">
          <h2 align="center"><span  class="badge card-header bg-success mt-0">Transfer To</span></h2>
        </div> 
      </div> 
      <div class="card" id="card" >
      <div class="card-body">            
      <div class="row">
        <div class="col-md-2">
          <label for="academicYear">School Year</label>
          <select
            id="academicYear"
            class="form-select col-2"
            v-model="StudentInfo.NewSY"
          >
            <option v-for="sy in SY" :value="sy.SY" :key="sy.SY">
              {{ sy.SY }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="Group">New Group</label>
          <select
            id="Group"
            class="form-select col-2"
            v-model="StudentInfo.NewGroup"
            v-on:change="fetchSchools(StudentInfo.NewGroup)"
          >
            <option
              v-for="Group in Groups"
              v-bind:value="Group.GroupNo"
              :key="Group.GroupNo"
            >
              {{ Group.GroupName }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="school">New School</label>
          <select
            id="school"
            v-on:change="fetchSection(StudentInfo.NewGroup, StudentInfo.NewSchool)"
            class="form-select col-2"
            v-model="StudentInfo.NewSchool"
          >
            <option
              v-for="school in Schools"
              v-bind:value="school.SchoolNo"
              v-bind:key="school.SchoolNo"
            >
              {{ school.SchoolName }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="section">New Section</label>
          <select
            id="section"
            v-on:change="fetchDept(StudentInfo.NewGroup,StudentInfo.NewSchool,StudentInfo.NewSection)"
            class="form-select col-2"
            v-model="StudentInfo.NewSection"
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
      </div>
      <div class="row">
        <div class="col-md-2">
          <label for="Department">New Department</label>
          <select
            id="Department"
            v-on:change="fetchGrades(StudentInfo.NewGroup,StudentInfo.NewSchool,StudentInfo.NewSection,StudentInfo.NewDepartment)" 
            class="form-select col-2"
            v-model="StudentInfo.NewDepartment"
          >
            <option v-for="dept in Depts" v-bind:value="dept.DepartmentNo" :key="dept.DepartmentNo">
              {{ dept.DepartmentName }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="NewGrade">New Grade</label>
          <select
            id="NewGrade"
            v-on:change="
              fetchClasses(
                StudentInfo.NewGroup,
                StudentInfo.NewSchool,
                StudentInfo.NewSection,
                StudentInfo.NewDepartment,
                StudentInfo.NewGrade)"
            class="form-select col-2"
            v-model="StudentInfo.NewGrade"
          >
            <option v-for="grade in Grades" v-bind:value="grade.GradeNo" v-bind:key="grade.GradeNo">
              {{ grade.Grade }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="NewClass">New Class</label>
          <select
            id="NewClass"
            class="form-select col-2"
            v-model="StudentInfo.NewClass"
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
      <div class="row mt-3">
        <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
          <strong>{{ AlertMSG }}</strong>
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="ShowAlert = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="col-md-12 d-flex justify-content-center">
          <button
            v-on:click.prevent="SavestudentMove()"
            class="btn btn-primary btn-lg"
          >
            {{ operation }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import server from "../server";
import SY from "../mixins/SYmixin";
import Group from "../mixins/Groupmixin";
import { mapState } from "vuex";
import ListByName from "@/components/ListByName";
export default {
  mixins: [SY,Group],  
  components: {
    ListByName,
  },
  data() {
    return {
      operation: "Save",
      Lang:"",
      AlertClass: "alert alert-success alert-dismissible",
      showModal: false,
      ShowAlert: false,
      AlertMSG: "",
      Nationalities: [],
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Installments: [],
      StudentInfo: {
        SY: "",
        NewSY: "",
        StudentNo: "",
        Staff:0,
        partner_id: 0,
        Student_name: "",
        Student_Arabic_name: "",
        GroupName: "",
        SchoolName: "",
        SectionName: "",
        DepartmentName: "",
        Grade: "",
        ClassName: "",
        CurrentGroup: 0,
        CurrentSchool: 0,
        CurrentSection: 0,
        CurrentDepartment: 0,
        CurrentGrade: 0,
        CurrentClass: 0,
        NewGroup: 0,
        NewSchool: 0,
        NewSection: 0,
        NewDepartment: 0,
        NewGrade: 0,
        NewClass: 0,

        IsSameSY: () =>
          this.StudentInfo.SY === this.StudentInfo.NewSY ? true : false,
        IsSameGroup: () =>
          this.StudentInfo.CurrentGroup === this.StudentInfo.NewGroup
            ? true
            : false,

        IsSameSchool: () =>
          this.StudentInfo.CurrentSchool === this.StudentInfo.NewSchool
            ? true
            : false,
        IsSameSection: () =>
          this.StudentInfo.CurrentSection === this.StudentInfo.NewSection
            ? true
            : false,
        IsSameDepartment: () =>
          this.StudentInfo.CurrentDepartment === this.StudentInfo.NewDepartment
            ? true
            : false,
        IsSameGrade: () =>
          this.StudentInfo.CurrentGrade === this.StudentInfo.NewGrade
            ? true
            : false,
        IsSameClass: () =>
          this.StudentInfo.CurrentClass === this.StudentInfo.NewClass
            ? true
            : false,
      },
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },   
  methods: {
    async SavestudentMove() {
      // Case change class in th same SY
      if (
        this.StudentInfo.IsSameSY() &&
        this.StudentInfo.IsSameGroup() &&
        this.StudentInfo.IsSameSchool() &&
        this.StudentInfo.IsSameSection() &&
        this.StudentInfo.IsSameDepartment() &&
        this.StudentInfo.IsSameGrade() &&
        !this.StudentInfo.IsSameClass()
      ) {
        // const StudentInvoices = await this.fetchStudent_Installments(
        //   this.StudentInfo.SY,
        //   this.StudentInfo.CurrentGroup,
        //   this.StudentInfo.CurrentSchool,
        //   this.StudentInfo.CurrentSection,
        //   this.StudentInfo.CurrentDepartment,
        //   this.StudentInfo.CurrentGrade,
        //   this.StudentInfo.CurrentClass,
        //   this.StudentInfo.StudentNo
        // );

        let Moved = await this.NewUpdateStudent_Class(this.StudentInfo);
        let MoveFinancials = await this.MoveStudent_Financials(this.StudentInfo);
        let MoveDiscount = await this.MoveStudent_Discount(this.StudentInfo);
        let MoveFees = await this.MoveStudent_Fees(this.StudentInfo);
        let MoveInstallment = await this.MoveStudent_Installment(this.StudentInfo);
        let MoveAbsent = await this.MoveStudent_Absent(this.StudentInfo);
        // // Update ERP invoice Will Update the classNo in the invoice line & the res_partner Master
        // StudentInvoices.data.forEach((Inovice) => {
        let InvoiceUpdated = this.UpdateERP_Invoice(this.StudentInfo);
          
        // });
        this.AlertMSG = "Student Moved to his new Class";
        this.ShowAlert = true;
      } else if (
        // Move to new campus in same SY
        this.StudentInfo.IsSameSY() &&
        !this.StudentInfo.IsSameGroup() &&
        !this.StudentInfo.IsSameSchool() &&
        !this.StudentInfo.IsSameSection() &&
        !this.StudentInfo.IsSameDepartment() &&
        !this.StudentInfo.IsSameGrade() &&
        !this.StudentInfo.IsSameClass()
      ) {
        // Check Student Invoice for the new year
        const StudentInvoices = await this.fetchStudent_Installments(
          this.StudentInfo.NewSY,
          this.StudentInfo.CurrentGroup,
          this.StudentInfo.CurrentSchool,
          this.StudentInfo.CurrentSection,
          this.StudentInfo.CurrentDepartment,
          this.StudentInfo.CurrentGrade,
          this.StudentInfo.CurrentClass,
          this.StudentInfo.StudentNo
        );
        let CanMove = true;
        // console.log(StudentInvoices.data);
        for (var Invoice of StudentInvoices.data) {
          const State = await this.GetERPInvoiceSatat(
            this.StudentInfo.CurrentGroup,
            Invoice.InvoiceNo
          );
          console.log("State : ", State.data[0].state);
          if (State.data[0].state != "draft") {
            CanMove = false;
          } else {
            let DeleteInvoice = await this.DeleteInvoiceHead(Invoice.InvoiceNo);
          }
        }
        if (!CanMove) {
          this.AlertClass = "alert alert-danger alert-dismissible";
          this.AlertMSG =
            "Can Not Move Student with paid Invoices in SY : " +
            this.StudentInfo.NewSY;
          this.ShowAlert = true;
        } else {
          //Add Student in the new Group DB Master and get his partner_id
          var Student = {
            GroupNo: this.StudentInfo.NewGroup,
            Student_name: this.StudentInfo.Student_name,
            display_name: this.StudentInfo.Student_name,
            class_no: this.StudentInfo.NewClass,
            section_no: this.StudentInfo.NewSection,
            department_no: this.StudentInfo.NewDepartment,
            grade_no: this.StudentInfo.NewGrade,
            company_id: this.StudentInfo.company_id,
            student_no: this.StudentInfo.StudentNo,
            staff:this.StudentInfo.Staff
          };
          let AddERPStudent = await this.AddERPStudent(Student);
          // // console.log(AddERPStudent);
          // // update Student with his New partner_id
          this.StudentInfo.partner_id = AddERPStudent.data;
          let UpdatePartnerID = await this.UpdateStudentPartnerID();
          // Delete Student From Old School Calss for Current SY
          let DeleteStudentfromSchool = await this.DeleteStudentfromSchool();
          // insert the student in his NewClass in the new Group
          let AddStudentToNewScool = await this.AddStudentToNewSchool();
          let DelFinancials = await this.DeleteStudent_Financials(
            this.StudentInfo.NewSY,
            this.StudentInfo.CurrentGroup,
            this.StudentInfo.CurrentSchool,
            this.StudentInfo.CurrentSection,
            this.StudentInfo.CurrentDepartment,
            this.StudentInfo.CurrentGrade,
            this.StudentInfo.CurrentClass,
            this.StudentInfo.StudentNo
          );
          let DelDiscount = await this.DeleteStudent_Discount(
            this.StudentInfo.NewSY,
            this.StudentInfo.CurrentGroup,
            this.StudentInfo.CurrentSchool,
            this.StudentInfo.CurrentSection,
            this.StudentInfo.CurrentDepartment,
            this.StudentInfo.CurrentGrade,
            this.StudentInfo.CurrentClass,
            this.StudentInfo.StudentNo
          );
          let DelFees = await this.DeleteStudent_Fees(
            this.StudentInfo.NewSY,
            this.StudentInfo.CurrentGroup,
            this.StudentInfo.CurrentSchool,
            this.StudentInfo.CurrentSection,
            this.StudentInfo.CurrentDepartment,
            this.StudentInfo.CurrentGrade,
            this.StudentInfo.CurrentClass,
            this.StudentInfo.StudentNo
          );
          let DelInstallment = await this.DeleteStudent_Installment(
            this.StudentInfo.NewSY,
            this.StudentInfo.CurrentGroup,
            this.StudentInfo.CurrentSchool,
            this.StudentInfo.CurrentSection,
            this.StudentInfo.CurrentDepartment,
            this.StudentInfo.CurrentGrade,
            this.StudentInfo.CurrentClass,
            this.StudentInfo.StudentNo
          );
          let DelAbsent = await this.DeleteStudent_Absent(
            this.StudentInfo.NewSY,
            this.StudentInfo.CurrentGroup,
            this.StudentInfo.CurrentSchool,
            this.StudentInfo.CurrentSection,
            this.StudentInfo.CurrentDepartment,
            this.StudentInfo.CurrentGrade,
            this.StudentInfo.CurrentClass,
            this.StudentInfo.StudentNo
          );
          this.AlertMSG = "Student Moved to his new Campus";
          this.ShowAlert = true;
        }
      } else if (
        //Move from section to new section same SY
        this.StudentInfo.IsSameSY() &&
        this.StudentInfo.IsSameGroup() &&
        this.StudentInfo.IsSameSchool() &&
        !this.StudentInfo.IsSameSection() &&
        !this.StudentInfo.IsSameDepartment() &&
        !this.StudentInfo.IsSameGrade() &&
        !this.StudentInfo.IsSameClass()
      ) {
        let Moved = await this.NewUpdateStudent_Class(this.StudentInfo);
        let MoveFinancials = await this.MoveStudent_Financials(this.StudentInfo);
        let MoveDiscount = await this.MoveStudent_Discount(this.StudentInfo);
        let MoveFees = await this.MoveStudent_Fees(this.StudentInfo);
        let MoveInstallment = await this.MoveStudent_Installment(this.StudentInfo);
        let MoveAbsent = await this.MoveStudent_Absent(this.StudentInfo);
        // Update ERP invoices , Payments & res_partner With new Section,Department,Grade & Class 
        let InvoiceUpdated = this.UpdateERP_Invoice(this.StudentInfo);
        this.AlertMSG = "Student Moved successfully  ";
        this.ShowAlert = true;        
      } else {
        console.log(
          this.StudentInfo.IsSameGroup(),
          this.StudentInfo.IsSameSchool(),
          this.StudentInfo.IsSameSection(),
          this.StudentInfo.IsSameDepartment(),
          this.StudentInfo.IsSameGrade(),
          this.StudentInfo.IsSameClass()
        );
        this.AlertClass = "alert alert-danger alert-dismissible";
        this.AlertMSG = "Can Not Move Student to your Class selection ";
        this.ShowAlert = true;
      }
    },
    ShowSearchModel(Lang) {
      this.Lang = Lang
      this.showModal = true;
    },
    async fetchStudent_Installments(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      console.log(
        SY,
        GroupNo,
        SchoolNo,
        SectionNo,
        DepartmentNo,
        GradeNo,
        ClassNo,
        StudentNo
      );
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentyearlyinstallments/" +
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
    // async UpdateStudent_Class(
    //   SY,
    //   GroupNo,
    //   SchoolNo,
    //   SectionNo,
    //   DepartmentNo,
    //   GradeNo,
    //   ClassNo,
    //   StudentNo,
    //   NewClass
    // ) {
    //   try {
    //     return await axios.put(
    //       "http://" +
    //         server.IP +
    //         ":" +
    //         server.port +
    //         "/movestudentclass/" +
    //         SY +
    //         "/" +
    //         GroupNo +
    //         "/" +
    //         SchoolNo +
    //         "/" +
    //         SectionNo +
    //         "/" +
    //         DepartmentNo +
    //         "/" +
    //         GradeNo +
    //         "/" +
    //         ClassNo +
    //         "/" +
    //         StudentNo +
    //         "/" +
    //         NewClass
    //     );
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async NewUpdateStudent_Class(Student) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/updatestudentclass/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
    },

    async UpdateStudentPartnerID() {
      let StudentInfo = {
        partner_id: this.StudentInfo.partner_id,
        StudentNo: this.StudentInfo.StudentNo,
      };
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/editstudentPartnerid/",
          StudentInfo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteInvoiceHead(INV_No) {
      let Invoice = {
        GroupNo: this.StudentInfo.CurrentGroup,
        InvoiceNo: INV_No,
      };
      try {
        return await axios.post(
          "http://" + server.IP + ":" + server.port + "/delete_inv_head/",
          Invoice
        );
      } catch (error) {
        console.error(error);
      }
    },
    async AddStudentToNewSchool() {
      let StudentInfo = {
        SY: this.StudentInfo.NewSY,
        GroupNo: this.StudentInfo.NewGroup,
        SchoolNo: this.StudentInfo.NewSchool,
        SectionNo: this.StudentInfo.NewSection,
        DepartmentNo: this.StudentInfo.NewDepartment,
        GradeNo: this.StudentInfo.NewGrade,
        ClassNo: this.StudentInfo.NewClass,
        StudentNo: this.StudentInfo.StudentNo,
        RegDate: this.StudentInfo.RegDate,
      };
      try {
        return await axios.post(
          "http://" + server.IP + ":" + server.port + "/addstudentclass/",
          StudentInfo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudentfromSchool() {
      try {
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/removestudent/" +
            this.StudentInfo.SY +
            "/" +
            this.StudentInfo.CurrentGroup +
            "/" +
            this.StudentInfo.CurrentSchool +
            "/" +
            this.StudentInfo.CurrentSection +
            "/" +
            this.StudentInfo.CurrentDepartment +
            "/" +
            this.StudentInfo.CurrentGrade +
            "/" +
            this.StudentInfo.CurrentClass +
            "/" +
            this.StudentInfo.StudentNo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async UpdateStudentInfo_ERP() {
      let StudentInfo = {
        partner_id: this.StudentInfo.partner_id,
        section_no: this.StudentInfo.NewSection,
        department_no: this.StudentInfo.NewDepartment,
        grade_no: this.StudentInfo.NewGrade,
        class_no: this.StudentInfo.NewClass,
        student_no: this.StudentInfo.StudentNo,
        name: this.StudentInfo.display_name,
        display_name: this.StudentInfo.display_name,
        company_id: this.StudentInfo.company_id,
      };
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/upd_ERPStudentInfo/",
          StudentInfo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async AddERPStudent(Student) {
      try {
        return await axios.post(
          "http://" + server.IP + ":" + server.port + "/addERPstudent/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
    },
    async GetERPInvoiceSatat(GroupNo, InvoiceNo) {
      console.log(GroupNo, InvoiceNo);
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getinvoiceState/" +
            GroupNo +
            "/" +
            InvoiceNo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async MoveStudent_Financials(Student) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/movefinancials/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudent_Financials(
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
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deletefinancials/" +
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
    async MoveStudent_Discount(Student) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/movediscount/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudent_Discount(
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
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deletediscount/" +
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
    async MoveStudent_Fees(Student) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/movestudentfees/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudent_Fees(
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
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deletestudentfees/" +
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
    async MoveStudent_Installment(Student) {
      try {
        return await axios.put("http://" + server.IP + ":" + server.port + "/movestudentinstallment/" ,Student);
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudent_Installment(
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
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deletestudentinstallment/" +
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
    async MoveStudent_Absent(Student) {
      try {
        return await axios.put("http://" + server.IP + ":" + server.port + "/moveabsent/" ,Student);
      } catch (error) {
        console.error(error);
      }
    },
    async DeleteStudent_Absent(
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
        return await axios.delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deleteabsent/" +
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
    async UpdateERP_Invoice(Student) {
      // const New_Head = {
      //   GroupNo: GroupNo,
      //   partner_id: partner_id,
      //   grade_no: grade_no,
      //   section_no: section_no,
      //   department_no: department_no,
      //   class_no: class_no,
      //   sy: sy,
      // };
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/updateinvoiceclass/",
          Student
        );
      } catch (error) {
        console.error(error);
      }
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
    fetchSection(group, school) {
      this.Schools.forEach((School) => {
        if (School.SchoolNo === school.SchoolNo) {
          this.StudentInfo.company_id = school.SchoolNo;
        }
      });
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

    findstudent(SY, StudentNo) {
      this.ShowAlert = false;
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentinfo/" +
            SY +
            "/" +
            StudentNo
        )
        .then(
          (data) => {
            if (data.data.length > 0) {
              if (data.data[0].SchoolName != this.SchoolName) {
                this.$fire({
                  title: "Student Information",
                  text: "Student is not Registered at your School",
                  type: "error",
                  timer: 4000
                }).then(r => {
                  console.log(r.value);
                });                         
                return
              }
              this.StudentInfo.partner_id = data.data[0].partner_id;
              this.StudentInfo.Student_Arabic_name =
                data.data[0].Student_Arabic_name;
              this.StudentInfo.Student_name = data.data[0].Student_name;
              this.StudentInfo.Student_Arabic_name =
                data.data[0].Student_Arabic_name;
              this.StudentInfo.GroupName = data.data[0].GroupName;
              this.StudentInfo.SchoolName = data.data[0].SchoolName;
              this.StudentInfo.SectionName = data.data[0].SectionName;
              this.StudentInfo.DepartmentName = data.data[0].DepartmentName;
              this.StudentInfo.Grade = data.data[0].Grade;
              this.StudentInfo.ClassName = data.data[0].ClasseName;
              this.StudentInfo.CurrentGroup = data.data[0].GroupNo;
              this.StudentInfo.CurrentSchool = data.data[0].SchoolNo;
              this.StudentInfo.CurrentSection = data.data[0].SectionNo;
              this.StudentInfo.CurrentDepartment = data.data[0].DepartmentNo;
              this.StudentInfo.CurrentGrade = data.data[0].GradeNo;
              this.StudentInfo.CurrentClass = data.data[0].ClassNo;
              this.StudentInfo.RegDate = data.data[0].RegDate;
              this.StudentInfo.Staff = data.data[0].Staff;
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
  },
  created: function () {
    this.FitchNationality();
  },
};
</script>

<style scoped>
#help {
  cursor: help;
}
h5 {
  color: #047c14;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
#card {
  background-color: aquamarine;
  
}
</style>
