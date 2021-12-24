<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog  modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <strong>ID :</strong>
            {{StudentNo}}
            <strong>Name :</strong>
            {{Student_name}}
            <button
              type="button"
              class="btn btn-warning btn-block"
              @click="CalcFees(Student_name)"
            >Show Fees</button>
          </div>
          <div class="modal-body">
            <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
              <strong>{{AlertMSG}}</strong>
            </div>
            <div id="MyTable" class="row">
              <table  class="table table-md table-bordered table-success table-striped">
                <thead>
                  <tr class="d-flex">
                    <th class="col-6 text-center">Fee</th>
                    <th class="col-2 text-center">Value</th>
                    <th class="col-2 text-center">Discount</th>
                    <th class="col-2 text-center">Net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="d-flex" v-for="(fee, index) in NetFees" :key="index">
                    <td class="col-6 text-center">{{fee.FeeName}}</td>
                    <td class="col-2 text-center">{{fee.FeeValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                    <td class="col-2 text-center">{{fee.Discount.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                    <td class="col-2 text-center">{{fee.NetValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  </tr>
                </tbody>
                <tfoot v-if="Net > 0" >
                  <div class="container">
                  <div class="row">
                    <div id="Totals" class="col-6 text-center">Totals</div>
                    <div id="Totals" class="col-2 text-center">{{Totalfees.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                    <div id="Totals" class="col-2 text-center">{{TotalDiscount.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                    <div id="Totals" class="col-2 text-center">{{Net.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>                  
                  </div>
                  </div>
                </tfoot>
              </table> 
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-info" @click="$emit('close-fee')">Close</button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-dismiss="modal"
                    @click="updatestudentfee"
                    :disabled="CanUpdate === false"
                  >Update</button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-dismiss="modal"
                    @click="savestudentfee"
                    :disabled="isDisable === true"
                  >Save</button>
                </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  props: [
    "SY",
    "GroupNo",
    "SchoolNo",
    "SectionNo",
    "DepartmentNo",
    "GradeNo",
    "ClassNo",
    "StudentNo",
    "RegDate",
    "Student_name"
  ],
  data() {
    return {
      AlertClass: "alert alert-success",
      AlertMSG: "",
      ShowAlert: false,
      isDisable: true,
      CanUpdate: false,
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

    async savestudentfee() {
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
              this.AlertClass = "alert alert-danger";
              this.AlertMSG = "ERROR : Data NOT Saved";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
      for (let i = 0; i < this.Discount_lines.length; i++) {
        console.log("In Loop :", this.Discount_lines[i]);
        await this.UpdateDiscountLine(this.Discount_lines[i]);
      }
    },
    async updatestudentfee() {
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
            "http://" + server.IP + ":" + server.port + "/updatestudentfee",
            feeline
          )
          .then(
            data => {
              this.AlertMSG = "Data Updated";
              this.ShowAlert = true;
              this.CanUpdate = false;
              this.isDisable = true;
            },
            errorResponse => {
              this.AlertClass = "alert alert-danger";
              this.AlertMSG = "ERROR : Error Updateding Data";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
      // for (let i = 0; i < this.Discount_lines.length; i++) {
      //   console.log("In Loop :", this.Discount_lines[i]);
      //   await this.UpdateDiscountLine(this.Discount_lines[i]);
      // }
    },
    // async UpdateDiscountLine(Discount) {
    //   console.log("in Update : ", Discount);
    //   try {
    //     return await axios.put(
    //       "http://" +
    //         server.IP +
    //         ":" +
    //         server.port +
    //         "/updatestudentdiscount/" +
    //         Discount.SY +
    //         "/" +
    //         Discount.GroupNo +
    //         "/" +
    //         Discount.SchoolNo +
    //         "/" +
    //         Discount.SectionNo +
    //         "/" +
    //         Discount.DepartmentNo +
    //         "/" +
    //         Discount.GradeNo +
    //         "/" +
    //         Discount.ClassNo +
    //         "/" +
    //         Discount.StudentNo +
    //         "/" +
    //         Discount.DiscountPackageNo +
    //         "/" +
    //         Discount.DiscountValue
    //     );
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    fetchStudent_YearFees(
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
        )
        .then(
          data => {
            if (data.data.length > 0) {
              this.isDisable = true;
            } else {
              this.isDisable = false;
            }
          },
          errorResponse => {
            console.log(errorResponse);
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
      axios
        .get(
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
        )
        .then(
          async data => {
            if (data.data.length > 0) {
              for (const Inv of data.data) {
                if (Inv.InvoiceNo != 0) {
                  //Invoice Posted
                  var InvStat = await this.GetInvoiceStatus(
                    this.GroupNo,
                    Inv.InvoiceNo
                  );
                  if (InvStat.data[0].state === "paid") {
                    // this.isDisable = true;
                    this.CanUpdate = false;
                  }
                } else {
                  //Invoice Not Posted Yet
                  this.CanUpdate = true;
                  // this.isDisable = true;
                }
              }
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    async GetInvoiceStatus(Group, InvoiceNo) {
      try {
        return await axios.get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getinvoiceState/" +
            Group +
            "/" +
            InvoiceNo
        );
      } catch (error) {
        console.error(error);
      }
    },

    async CalcFees(Student_name) {
      this.ShowAlert = false;
      if (this.isDisable) {
        this.CanUpdate = true;
      } else {
        this.CanUpdate = false;
      }
      this.NetFees = [];
      for (const fee of this.Fees) {
        var DiscountValue = 0;
        for (const discount of this.Discounts) {
          var result = await this.CalcDiscount(fee, discount);
          if (result) {
            DiscountValue += result;
          }
        }
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
          this.Discount_lines.push(Discount_line);
        }
        //       // claculate discount if %
        if (discount.DiscountPackagePercent != 0) {
          if (fee.SourceNo === discount.SourceNo) {
            DiscountValue +=
              (fee.Amount * discount.DiscountPackagePercent) / 100;
            Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
            Discount_line.DiscountValue =
              (fee.Amount * discount.DiscountPackagePercent) / 100;
            this.Discount_lines.push(Discount_line);
          }
        }
        return DiscountValue;
      }
    }
  },
  created: function() {
    this.fetchStudent_Accounts(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.RegDate
    );
    this.fetchStudent_Discounts(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.ClassNo,
      this.StudentNo
    );
    this.fetchStudent_YearFees(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.ClassNo,
      this.StudentNo
    );
    this.fetchStudentYearlyInstallments(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.ClassNo,
      this.StudentNo
    );
  }
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
#Totals {
  background-color: rgb(194, 194, 197);
  color: rgb(243, 13, 13);
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
