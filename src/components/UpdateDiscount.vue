<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-1">
        <label for="academicYear">A/Y</label>
      </div>
      <div class="col-md-2">
        <select id="academicYear" class="form-control input" v-model="SY">
          <option v-for="sy in SYs" v-bind:value="sy" v-bind:key="sy">{{sy}}</option>
        </select>
      </div>
      <div class="col-md-1">
        <label for="Group">Group</label>
      </div>
      <div class="col-md-3">
        <select
          id="Group"
          v-on:change="fetchSchools(GroupNo)"
          class="form-control input"
          v-model="GroupNo"
        >
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
          class="form-control input"
          v-model="SchoolNo"
          v-on:change="fetchSection(GroupNo,SchoolNo)"
        >
          <option
            v-for="school in Schools"
            v-bind:value="school.SchoolNo"
            v-bind:key="school.SchoolNo"
          >{{school.SchoolName}}</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <div class="col-md-1">
        <label for="section">Section</label>
      </div>
      <div class="col-md-2">
        <select
          id="section"
          v-on:change="fetchDept(GroupNo,SchoolNo,SectionNo)"
          class="form-control input"
          v-model="SectionNo"
        >
          <option
            v-for="Section in Sections"
            v-bind:value="Section.SectionNo"
            v-bind:key="Section.SectionNo"
          >{{Section.SectionName}}</option>
        </select>
      </div>

      <div class="col-md-1">
        <label for="Department">Dept.</label>
      </div>
      <div class="col-md-2">
        <select
          id="Department"
          v-on:change="fetchGrades(GroupNo,SchoolNo,SectionNo,DepartmentNo)"
          class="form-control input"
          v-model="DepartmentNo"
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
      <div class="col-md-2">
        <select
          id="Department"
          v-on:change="fetchClasses(GroupNo,SchoolNo,SectionNo,DepartmentNo,GradeNo)"
          class="form-control input"
          v-model="GradeNo"
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
      <div class="col-md-2">
        <select
          id="Class"
          v-on:change="fetchStudent_Class(SY,GroupNo,SchoolNo,SectionNo,DepartmentNo,GradeNo,ClassNo)"
          class="form-control input"
          v-model="ClassNo"
        >
          <option
            v-for="MyClass in Classes"
            v-bind:value="MyClass.ClassNo"
            v-bind:key="MyClass.ClassNo"
          >{{MyClass.ClasseName}}</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <button
        type="button"
        :disabled="Disabled"
        class="btn btn-outline-info btn-primary"
        @click="CalcFees()"
      >Batch Update Discounts for Class</button>
      <button
        type="button"
        :disabled="Disabled"
        class="btn btn-outline-info btn-primary"
        @click="Calcinvoicediscount()"
      >Batch Update invoices Discount for Class</button>
    </div>
    <div class="form-group row center">
      <h4>{{Nooftudents}} / {{CurrentStudent}}</h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  data() {
    return {
      Disabled: true,
      Nooftudents: 0,
      CurrentStudent: 0,
      SYs: ["2018/2019", "2019/2020", "2020/2021"],
      SY: "",
      GroupNo: 0,
      SchoolNo: 0,
      SectionNo: 0,
      DepartmentNo: 0,
      GradeNo: 0,
      ClassNo: 0,
      Groups: [],
      Schools: [],
      Sections: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      Fees: [],
      Discounts: [],
      Discount_lines: [],
      NetFees: [],
      TotalDiscount: 0,
      Totalfees: 0,
      Net: 0
    };
  },
  methods: {
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
            this.Nooftudents = data.data.length;
            this.CurrentStudent = 0;
            if (data.data.length > 0) {
              this.Students = data.data;
              this.Disabled = !this.Disabled;
            } else {
              this.Disabled = true;
            }
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },
    async fetchStudentYearlyInstallments(
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
    async fetchStudent_Discounts(
      //       this.Discounts = data.data;
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
        );
      } catch (error) {
        console.error(error);
      }
    },

    // async savestudentfee() {
    //   this.NetFees.forEach(feeline => {
    //     var feeline = {
    //       SY: this.SY,
    //       GroupNo: this.GroupNo,
    //       SchoolNo: this.SchoolNo,
    //       SectionNo: this.SectionNo,
    //       DepartmentNo: this.DepartmentNo,
    //       GradeNo: this.GradeNo,
    //       ClassNo: this.ClassNo,
    //       StudentNo: this.StudentNo,
    //       SourceNo: feeline.SourceNo,
    //       Amount: feeline.FeeValue,
    //       DiscountValue: feeline.Discount
    //     };
    //     axios
    //       .post(
    //         "http://" + server.IP + ":" + server.port + "/addstudentfee",
    //         feeline
    //       )
    //       .then(
    //         data => {
    //           this.AlertMSG = "Data Saved";
    //           this.ShowAlert = true;
    //         },
    //         errorResponse => {
    //           this.AlertClass = "alert alert-danger alert-dismissible";
    //           this.AlertMSG = "ERROR : Data NOT Saved";
    //           this.ShowAlert = true;
    //           console.log(errorResponse);
    //         }
    //       );
    //   });
    //   for (let i = 0; i < this.Discount_lines.length; i++) {
    //     await this.UpdateDiscountLine(this.Discount_lines[i]);
    //   }
    // },
    async UpdateDiscountLine(Discount) {
      try {
        return await axios.put(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/updatestudentdiscount/" +
            Discount.SY +
            "/" +
            Discount.GroupNo +
            "/" +
            Discount.SchoolNo +
            "/" +
            Discount.SectionNo +
            "/" +
            Discount.DepartmentNo +
            "/" +
            Discount.GradeNo +
            "/" +
            Discount.ClassNo +
            "/" +
            Discount.StudentNo +
            "/" +
            Discount.DiscountPackageNo +
            "/" +
            Discount.DiscountValue
        );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStudent_Fees(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      //     this.Fees = data.data;
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentyearlyfees/" +
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
    async Calcinvoicediscount() {
      this.CurrentStudent = 0;
      for (const Student of this.Students) {
        this.CurrentStudent++;
        var StudentInvoices = await this.fetchStudentYearlyInstallments(
          this.SY,
          this.GroupNo,
          this.SchoolNo,
          this.SectionNo,
          this.DepartmentNo,
          this.GradeNo,
          this.ClassNo,
          Student.StudentNo
        );

        for (const StudentInoice of StudentInvoices.data) {
          var InvoiceNo = StudentInoice.InvoiceNo;
          var InvSerial = StudentInoice.Serial;
          let Invoice = await this.fetchStudent_InvoiceLine(
            this.SY,
            this.GroupNo,
            this.SchoolNo,
            this.SectionNo,
            this.DepartmentNo,
            this.GradeNo,
            this.ClassNo,
            Student.StudentNo,
            StudentInoice.Serial
          );

          for (const InvoiceLine of Invoice.data) {
            var updateLine = {
              invoice_id: InvoiceNo,
              product_id: InvoiceLine.SourceNo,
              price_unit: InvoiceLine.ShareAmount,
              price_subtotal: InvoiceLine.net,
              discount_amount: InvoiceLine.ShareDiscount
            };
            // console.log(InvoiceNo, InvSerial);
            // console.log(InvoiceLine);
            // }
            var Updated = await this.UpdateInvoiceLine(updateLine);
          }
        }
      }
      this.Disabled = true;
      this.ClassNo = 0;
    },
    async UpdateInvoiceLine(InvoiceLine) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/upd_inv_line/",
          InvoiceLine
        );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStudent_InvoiceLine(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo,
      Serial
    ) {
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentinvoiceline/" +
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
            StudentNo +
            "/" +
            Serial
        );
      } catch (error) {
        console.error(error);
      }
    },
    async CalcFees() {
      this.NetFees = [];

      for (const Student of this.Students) {
        this.CurrentStudent++;
        var StudentFee = await this.fetchStudent_Fees(
          this.SY,
          this.GroupNo,
          this.SchoolNo,
          this.SectionNo,
          this.DepartmentNo,
          this.GradeNo,
          this.ClassNo,
          Student.StudentNo
        );
        var StudentDiscounts = await this.fetchStudent_Discounts(
          this.SY,
          this.GroupNo,
          this.SchoolNo,
          this.SectionNo,
          this.DepartmentNo,
          this.GradeNo,
          this.ClassNo,
          Student.StudentNo
        );
        this.StudentNo = Student.StudentNo;
        // console.log(StudentFee.data.length, StudentDiscounts.data.length);
        for (const fee of StudentFee.data) {
          if (StudentDiscounts.data.length > 0) {
            this.Discount_lines = [];
            for (const discount of StudentDiscounts.data) {
              var result = await this.CalcDiscount(fee, discount);
              if (result) {
                this.Discount_lines.push(result);
              }
            }
            if (this.Discount_lines.length > 0) {
              for (let i = 0; i < this.Discount_lines.length; i++) {
                let DiscountLineUpdated = await this.UpdateDiscountLine(
                  this.Discount_lines[i]
                );
                // if (DiscountLineUpdated) {
                //   let PostToERP = await this.AddDiscountLineERP(
                //     this.Discount_lines[i]
                //   );
                // }
              }
            }
          }
        }
      }
      this.Disabled = true;
      this.ClassNo = 0;
    },
    async UpdateDiscountLine(Discount) {
      console.log("Discount ", Discount);
      try {
        return await axios.put(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/updatestudentdiscount/" +
            Discount.SY +
            "/" +
            Discount.GroupNo +
            "/" +
            Discount.SchoolNo +
            "/" +
            Discount.SectionNo +
            "/" +
            Discount.DepartmentNo +
            "/" +
            Discount.GradeNo +
            "/" +
            Discount.ClassNo +
            "/" +
            Discount.StudentNo +
            "/" +
            Discount.DiscountPackageNo +
            "/" +
            Discount.DiscountValue
        );
      } catch (error) {
        console.error(error);
      }
    },
    async AddDiscountLineERP(Discount) {
      try {
        return await axios.post(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/post_Discount_line/" +
            Discount.StudentNo +
            "/" +
            Discount.DiscountPackageNo +
            "/" +
            Discount.DiscountPackageName +
            "/" +
            Discount.DiscountValue
        );
      } catch (error) {
        console.error(error);
      }
    },
    async CalcDiscount(fee, discount) {
      var DiscountValue = 0;

      var Discount_line = {};
      Discount_line.SY = this.SY;
      Discount_line.GroupNo = this.GroupNo;
      Discount_line.SchoolNo = this.SchoolNo;
      Discount_line.SectionNo = this.SectionNo;
      Discount_line.DepartmentNo = this.DepartmentNo;
      Discount_line.GradeNo = this.GradeNo;
      Discount_line.ClassNo = this.ClassNo;
      Discount_line.StudentNo = this.StudentNo;
      if (fee.SourceNo === discount.SourceNo) {
        // if Discount is Value
        if (discount.DiscountPackageValue != 0) {
          DiscountValue += discount.DiscountPackageValue;
          Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
          Discount_line.DiscountValue = discount.DiscountPackageValue;
          // this.Discount_lines.push(Discount_line);
        }
        //       // claculate discount if %
        if (discount.DiscountPackagePercent != 0) {
          if (fee.SourceNo === discount.SourceNo) {
            DiscountValue +=
              (fee.Amount * discount.DiscountPackagePercent) / 100;
            Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
            Discount_line.DiscountValue =
              (fee.Amount * discount.DiscountPackagePercent) / 100;
            // this.Discount_lines.push(Discount_line);
          }
        }
        return Discount_line;
      }
    }
  },
  created: function() {
    this.fetchGroups();
    // this.fetchStudent_Fees(
    //   this.SY,
    //   this.GroupNo,
    //   this.SchoolNo,
    //   this.SectionNo,
    //   this.DepartmentNo,
    //   this.GradeNo,
    //   this.RegDate
    // );
    // this.fetchStudent_Discounts(
    //   this.SY,
    //   this.GroupNo,
    //   this.SchoolNo,
    //   this.SectionNo,
    //   this.DepartmentNo,
    //   this.GradeNo,
    //   this.ClassNo,
    //   this.StudentNo
    // );
    // this.fetchStudent_YearFees(
    //   this.SY,
    //   this.GroupNo,
    //   this.SchoolNo,
    //   this.SectionNo,
    //   this.DepartmentNo,
    //   this.GradeNo,
    //   this.ClassNo,
    //   this.StudentNo
    // );
  }
};
</script>
<style>
.center {
  text-align: center;
}
</style>
