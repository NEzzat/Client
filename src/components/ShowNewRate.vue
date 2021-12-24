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
              @click="fetchStudent_Fees(SY,GroupNo,SchoolNo,SectionNo,DepartmentNo,GradeNo,ClassNo,StudentNo)"
            >Show Fees</button>
          </div>
          <!-- //CalcFees(Student_name) -->
          <div class="modal-body row">
            <div class="col-md-10 d-flex">
              <input
                type="text"
                class="form-control"
                v-model="SourceName"
                placeholder="Source Name"
                disabled="true"
              />
            </div>
            <div class="col-md-2">
              <input type="number" class="form-control" v-model="NewRate.Amount" placeholder="Value" />
            </div>
            <!-- <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                v-model="NewRate.DiscountValue"
                placeholder="Discount"
              >
            </div>-->
            <div class="d-flex justify-content-center mt-2">
              <button
                type="button"
                class="btn btn-primary btn-block  mb-0"
                data-dismiss="modal"
                @click="UDPstudentfee"
              >Update Table</button>
            </div>
            <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
              <strong>{{AlertMSG}}</strong>
            </div>
          </div>
          <div id="MyTable" >
            <table  class="table table-md table-bordered table-success table-striped">
              <thead>
                <tr class="d-flex">
                  <th class="col-5 text-center">Revenue</th>
                  <th class="col-2 text-center">Value</th>
                  <th class="col-2 text-center">Discount</th>
                  <th class="col-2 text-center">Net</th>
                  <th class="col-1 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr class="d-flex" v-for="(fee, index) in NetFees" :key="index">
                  <td class="col-5 text-center">{{fee.FeeName}}</td>
                  <td class="col-2 text-center">{{fee.Amount.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <td class="col-2 text-center">{{fee.DiscountValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <td class="col-2 text-center">{{fee.NetValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <div class="btn-group col-1" role="group">
                    <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Fee"><span @click="showFeeLine(fee)"><i class="bi bi-pencil"></i></span></td> 
                  </div>                      
                </tr>
                </tbody>
                <tfoot v-if="Net > 0" >
                  <div class="container">
                    <div class="row">
                      <div id="Totals" class="col-5 text-center">Totals</div>
                      <div id="Totals" class="col-2 text-center">{{Totalfees.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                      <div id="Totals" class="col-2 text-center">{{TotalDiscount.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                      <div id="Totals" class="col-2 text-center">{{Net.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>                  
                    </div>
                  </div>
                </tfoot>
              </table> 
            </div>



          <div class="modal-footer">
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
                <tr v-for="(fee) in NetFees" :key="fee.SourceNo">
                  <td class="pull-left">{{fee.FeeName}}</td>
                  <td>{{fee.Amount.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <td>{{fee.DiscountValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <td>{{fee.NetValue.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  <td class="btn btn-warning pull-left" v-on:click.prevent="showFeeLine(fee)">Change</td>
                </tr>
              </tbody>
            </table> -->
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              :disabled="CanUpdate === false"
              @click="updatestudentfee"
            >Update</button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="SaveStatus === false"
              @click="savestudentfee"
            >Save</button>

            <button type="button" class="btn btn-outline-info" @click="$emit('close-NewRate')">Close</button>
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
    "Student_name",
  ],
  data() {
    return {
      AlertClass: "alert alert-success d-flex align-items-center",
      AlertMSG: "",
      ShowAlert: false,
      SaveStatus: false,
      CanUpdate: false,
      SourceName: "",
      NewRate: {
        SY: "",
        GroupNo: 0,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        ClassNo: 0,
        StudentNo: "",
        SourceNo: 0,
        Amount: 0,
        DiscountValue: 0,
        LineDiscount: 0,
        Percent: 0,
      },
      Fees: [],
      Discounts: [],
      Discount_lines: [],
      NetFees: [],
      TotalDiscount: 0,
      Totalfees: 0,
      Net: 0,
    };
  },
  methods: {
    showFeeLine(feeline) {
      this.SourceName = feeline.FeeName;
      this.NewRate.SourceNo = feeline.SourceNo;
      this.NewRate.Amount = feeline.Amount;
      this.NewRate.DiscountValue = feeline.DiscountValue;
      this.NewRate.LineDiscount = feeline.LineDiscount;
      // console.log("feeline discount :", feeline.LineDiscount);
      this.NewRate.NetValue = feeline.Amount - feeline.Discount;
      this.NewRate.Percent = feeline.Percent;
    },
    async UDPstudentfee() {
      // console.log(this.NetFees);

      this.TotalDiscount = 0;
      this.Totalfees = 0;
      this.Net = 0;
      // this.Discount_lines = [];

      // for (const Fee_line of this.NetFees) {

      for (const Fee_line of this.NetFees) {
        if (Fee_line.SourceNo === this.NewRate.SourceNo) {
          Fee_line.Amount = Number(this.NewRate.Amount);
          Fee_line.DiscountValue = 0;
          //Loop In this.Discount the array dicounts for this Student to recaculate the discount value
          for (const discount of this.Discounts) {
            var result = await this.CalcDiscount(Fee_line, discount);
            if (result) {
              Fee_line.DiscountValue += result;
            }
          }
          Fee_line.NetValue = Fee_line.Amount - Fee_line.DiscountValue;
          this.Totalfees += Fee_line.Amount
          this.TotalDiscount += Fee_line.DiscountValue;

          // this.Net += Fee_line.NetValue;
        }
        this.Net += Fee_line.NetValue;
      }
      // console.log(this.Discount_lines);
    },
    // async CalcDiscount(fee) {
    //   var DiscountValue = 0;
    //   for (const discount of this.Discounts) {
    //     if (fee.SourceNo === discount.SourceNo) {
    //       console.log("In Calc Discount:", discount);
    //       var Discount_line = {};
    //       Discount_line.SY = this.SY;
    //       Discount_line.GroupNo = this.GroupNo;
    //       Discount_line.SchoolNo = this.SchoolNo;
    //       Discount_line.SectionNo = this.SectionNo;
    //       Discount_line.DepartmentNo = this.DepartmentNo;
    //       Discount_line.GradeNo = this.GradeNo;
    //       Discount_line.ClassNo = this.ClassNo;
    //       Discount_line.StudentNo = this.StudentNo;
    //     }
    //   }
    //   console.log("in calc discount", DiscountValue);
    //   return DiscountValue;
    //   // if (fee.SourceNo === discount.SourceNo) {
    //   //   // if Discount is Value
    //   //   if (discount.DiscountPackageValue != 0) {
    //   //     console.log("in calc value");
    //   //     DiscountValue += discount.DiscountPackageValue;
    //   //     Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
    //   //     Discount_line.DiscountValue = discount.DiscountPackageValue;

    //   //     this.Discount_lines.push(Discount_line);
    //   //   }
    //   //   //       // claculate discount if %
    //   //   if (discount.DiscountPackagePercent != 0) {
    //   //     if (fee.SourceNo === discount.SourceNo) {
    //   //       console.log(
    //   //         "in calc %",
    //   //         "fee amount:",
    //   //         fee.FeeValue,
    //   //         "%:",
    //   //         discount.DiscountPackagePercent
    //   //       );
    //   //       DiscountValue +=
    //   //         (fee.FeeValue * discount.DiscountPackagePercent) / 100;
    //   //       Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
    //   //       // console.log(fee.Amount, discount.DiscountPackagePercent);
    //   //       Discount_line.DiscountValue =
    //   //         (fee.FeeValue * discount.DiscountPackagePercent) / 100;
    //   //       console.log("% value :", Discount_line.DiscountValue);
    //   //       this.Discount_lines.push(Discount_line);
    //   //     }
    //   //   }
    // },
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
            this.Fees.forEach((element) => {
              this.Totalfees += element.Amount;
            });
          },
          (errorResponse) => {
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
          (data) => {
            this.Discounts = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    fetchStudent_Fees(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo
    ) {
      this.ShowAlert= false;
      this.NetFees = [];
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentfees/" +
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
            if (data.data.length > 0) {
              this.Totalfees = 0
              data.data.forEach(async (FeeLine) => {
                var Fee_line = {
                  FeeSerial: FeeLine.Serial,
                  SourceNo: FeeLine.SourceNo,
                  FeeName: FeeLine.SourceName,
                  Amount: FeeLine.Amount,
                  DiscountValue: 0,
                  NetValue: FeeLine.Amount,
                };
                for (const discount of this.Discounts) {
                  var result = await this.CalcDiscount(FeeLine, discount);
                  if (result) {
                    Fee_line.DiscountValue += result;
                    Fee_line.NetValue -= result;
                  }
                }
                this.Totalfees += FeeLine.Amount;
                this.TotalDiscount += FeeLine.DiscountValue;
                this.Net += Fee_line.NetValue;
                this.NetFees.push(Fee_line);
              });
              this.SaveStatus = false;
              this.CanUpdate = true;
            } else {
              this.SaveStatus = true;
              this.CanUpdate = false;
              this.CalcFees();
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    async savestudentfee() {
      this.NetFees.forEach((feeline) => {
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
          Amount: feeline.Amount,
          DiscountValue: feeline.DiscountValue,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentfee",
            feeline
          )
          .then(
            (data) => {
              this.AlertClass = "alert alert-success d-flex align-items-center";
              this.AlertMSG = "Data Saved";
              this.ShowAlert = true;
            },
            (errorResponse) => {
              this.AlertClass = "alert alert-danger d-flex align-items-center";
              this.AlertMSG = "ERROR : Data NOT Saved";
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

    async updatestudentfee() {
      this.NetFees.forEach((feeline) => {
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
          Amount: feeline.Amount,
          DiscountValue: feeline.DiscountValue,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/updatestudentfee",
            feeline
          )
          .then(
            (data) => {
              this.AlertClass = "alert alert-success d-flex align-items-center";
              this.AlertMSG = "Data Saved";
              this.ShowAlert = true;
            },
            (errorResponse) => {
              this.AlertClass = "alert alert-danger d-flex align-items-center";
              this.AlertMSG = "ERROR : Data NOT Saved";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
      for (let i = 0; i < this.Discount_lines.length; i++) {
        await this.UpdateDiscountLine(this.Discount_lines[i]);
      }
    },
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

    async CalcFees() {
      this.NetFees = [];
      this.Discount_lines = [];
      this.Fees.forEach(async (fee) => {
        var DiscountValue = 0;
        var DiscountPercent = 0;
        var LineDiscount = 0;
        // var Discount_line = {};
        // Discount_line.SY = this.SY;
        // Discount_line.GroupNo = this.GroupNo;
        // Discount_line.SchoolNo = this.SchoolNo;
        // Discount_line.SectionNo = this.SectionNo;
        // Discount_line.DepartmentNo = this.DepartmentNo;
        // Discount_line.GradeNo = this.GradeNo;
        // Discount_line.ClassNo = this.ClassNo;
        // Discount_line.StudentNo = this.StudentNo;

        // this.Discounts.forEach(discount => {
        //   if (fee.SourceNo === discount.SourceNo) {
        //     // if Discount is Value
        //     if (discount.DiscountPackageValue != 0) {
        //       DiscountValue += discount.DiscountPackageValue;
        //       LineDiscount = discount.DiscountPackageValue;

        //       Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
        //       Discount_line.DiscountValue = discount.DiscountPackageValue;
        //       this.Discount_lines.push(Discount_line);
        //     }
        //     // claculate discount if %
        //     if (discount.DiscountPackagePercent != 0) {
        //       if (fee.SourceNo === discount.SourceNo) {
        //         DiscountValue +=
        //           (fee.Amount * discount.DiscountPackagePercent) / 100;
        //         Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
        //         Discount_line.DiscountValue =
        //           (fee.Amount * discount.DiscountPackagePercent) / 100;
        //         this.Discount_lines.push(Discount_line);
        //       }
        //     }
        //   }
        // });
        for (const discount of this.Discounts) {
          var result = await this.CalcDiscount(fee, discount);
          if (result) {
            DiscountValue += result;
          }
        }
        // var Fee_line = {
        //   FeeSerial: fee.Serial,
        //   SourceNo: fee.SourceNo,
        //   FeeName: fee.SourceName,
        //   FeeValue: fee.Amount,
        //   Discount: DiscountValue,
        //   LineDiscount: LineDiscount,
        //   Percent: DiscountPercent,
        //   NetValue: fee.Amount - DiscountValue
        // };
        // this.TotalDiscount += DiscountValue;
        // this.Net += Fee_line.NetValue;
        // this.NetFees.push(Fee_line);
        var Fee_line = {
          FeeSerial: fee.Serial,
          SourceNo: fee.SourceNo,
          FeeName: fee.SourceName,
          Amount: fee.Amount,
          DiscountValue: DiscountValue,
          NetValue: fee.Amount - DiscountValue,
        };
        this.TotalDiscount += DiscountValue;
        this.Net += Fee_line.NetValue;
        this.NetFees.push(Fee_line);
      });
      // console.log(this.NetFees);
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
          // if (fee.SourceNo === discount.SourceNo) {
          DiscountValue +=
            (Number(fee.Amount) * Number(discount.DiscountPackagePercent)) /
            100;
          Discount_line.DiscountPackageNo = discount.DiscountPackageNo;
          Discount_line.DiscountValue =
            (Number(fee.Amount) * Number(discount.DiscountPackagePercent)) /
            100;
          this.Discount_lines.push(Discount_line);
          // }
        }

        return DiscountValue;
      } else {
        return 0;
      }
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
          async (data) => {
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
                  } else {
                    this.CanUpdate = true;
                    // this.isDisable = true;
                  }
                } else {
                  //Invoice Not Posted Yet
                  this.CanUpdate = true;
                  // this.isDisable = true;
                }
              }
            }
          },
          (errorResponse) => {
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
  },

  created: function () {
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
  },
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
.total {
  margin-right: 260px;
  color: red;
  font-weight: bold;
}
</style>
