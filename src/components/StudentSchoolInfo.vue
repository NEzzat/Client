<template>
  <div class="container">
    <h2 align="center">Student New Rates</h2>
    <form classe="form-inline">
      <div class="form-group row">
        <div class="col-md-1">
          <label for="academicYear">A/Y</label>
        </div>
        <div class="col-md-2">
          <select id="academicYear" class="form-control input" v-model="Student.SY">
            <option v-for="sy in syyears" v-bind:value="sy">{{sy}}</option>
          </select>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="Student.StudentNo"
              placeholder="Number"
            >
            <span class="input-group-btn">
              <button
                class="btn btn-info"
                type="button"
                v-on:click.prevent="findstudent(Student.SY,Student.StudentNo)"
              >Find</button>
            </span>
          </div>
        </div>
      </div>
    </form>
  </div>

  <!-- <table class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Discount</th>
        <th>Net</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fee) in NetFees">
        <td>{{fee.FeeName}}</td>
        <td>{{fee.FeeValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
        <td>{{fee.Discount.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
        <td>{{fee.NetValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
      </tr>
    </tbody>
  </table>-->
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  data() {
    return {
      Student: {
        SY: "",
        StudentNo: "",
        Student_name: "",
        Student_Arabic_name: "",
        Birth_date: "",
        Student_ID: "",
        Student_Email: "",
        Mobile_No: ""
      },
      AlertClass: "alert alert-success alert-dismissible",
      AlertMSG: "",
      ShowAlert: false,
      syyears: ["2017/2018", "2018/2019", "2019/2020"],
      Fees: [],
      Discounts: [],
      NetFees: [],
      TotalDiscount: 0,
      Totalfees: 0,
      Net: 0
    };
  },
  methods: {
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
            data.data.forEach(element => {
              this.Totalfees += element.Amount;
            });
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
            this.Discounts = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    findstudent(SY, StudentNo) {
      axios
        .get(
          "http://" + server.IP + ":" + server.port + "/student/" + StudentNo
        )
        .then(
          data => {
            if (data.data.length > 0) {
              this.StudentInfo.Student_Arabic_name =
                data.data[0].Student_Arabic_name;
              this.StudentInfo.Student_name = data.data[0].Student_name;
              this.StudentInfo.Birth_date = data.data[0].Birth_date;
              this.StudentInfo.Student_ID = data.data[0].Student_ID;
              this.StudentInfo.Student_Email = data.data[0].Student_Email;
              this.StudentInfo.Mobile_No = data.data[0].Mobile_No;
              this.operation = "Update";
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    savestudentfee() {
      this.NetFees.forEach(feeline => {
        var feeline = {
          SY: this.SY,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SectionNo: this.SectionNo,
          DepartmentNo: this.DepartmentNo,
          GradeNo: this.GradeNo,
          ClassNo: this.ClassNo,
          StudentNo: this.StudentNo,
          SourceNo: feeline.SourceNo,
          Amount: feeline.FeeValue,
          DiscountValue: feeline.Discount
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentfee",
            feeline
          )
          .then(
            data => {
              this.AlertMSG = "Data Saved";
              this.ShowAlert = true;
            },
            errorResponse => {
              this.AlertClass = "alert alert-danger alert-dismissible";
              this.AlertMSG = "ERROR : Data NOT Saved";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
    },

    CalcFees(Student_name) {
      this.NetFees = [];
      this.Fees.forEach(fee => {
        var DiscountValue = 0;
        this.Discounts.forEach(discount => {
          if (fee.SourceNo === discount.SourceNo) {
            // if Discount is Value
            if (discount.DiscountPackageValue != 0) {
              DiscountValue += discount.DiscountPackageValue;
            }
            // claculate discount if %
            if (discount.DiscountPackagePercent != 0) {
              if (fee.SourceNo === discount.SourceNo) {
                DiscountValue +=
                  (fee.Amount * discount.DiscountPackagePercent) / 100;
              }
            }
          }
        });
        var Fee_line = {
          FeeSerial: fee.Serial,
          SourceNo: fee.SourceNo,
          FeeName: fee.SourceName,
          FeeValue: fee.Amount,
          Discount: DiscountValue,
          NetValue: fee.Amount - DiscountValue
        };
        this.TotalDiscount += DiscountValue;
        this.Net += Fee_line.NetValue;
        this.NetFees.push(Fee_line);
      });
    }
  },

  created: function() {}
};
</script>
<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.totalfee {
  margin-left: 180px;
  color: red;
  font-weight: bold;
}
.totaldiscount {
  margin-left: 55px;
  color: red;
  font-weight: bold;
}
.totalnet {
  margin-left: 50px;
  color: red;
  font-weight: bold;
}
</style>
