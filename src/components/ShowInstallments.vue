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
              v-bind:disabled="Status"
              @click="fetchStudent_Installments(SY,GroupNo,SchoolNo,SectionNo,DepartmentNo,GradeNo,ClassNo,StudentNo)"
            >Calculate Installment</button>
          </div>
          <div class="modal-body">
            <span v-if="Installments.length > 0">
              <strong>Bus Pagckage :</strong>
              {{Installments[0].BusPackageName}}
            </span>
            <span v-if="Installments.length > 0">
              <strong>Value :</strong>
              {{Installments[0].BusPackageValue}}
            </span>
            <span v-if="Installments.length > 0">
              <strong>Installment Pagckage :</strong>
              {{Installments[0].InstallmentName}}
            </span>

            <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
              <strong>{{AlertMSG}}</strong>
            </div>
            <div id="MyTable" class="row mt-3">
            <table  class="table table-md table-bordered table-success table-striped">
              <thead>
                <tr class="d-flex">
                  <th class="col-1 text-center">#</th>
                  <th class="col-3 text-center">From</th>
                  <th class="col-3 text-center">To</th>
                  <th class="col-2 text-center">%</th>
                  <th class="col-3 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                  <tr class="d-flex" v-for="(installment) in Instalmment_values" :key="installment.Instalment_Serial">
                    <td class="col-1 text-center">{{installment.Instalment_Serial}}</td>
                    <td class="col-3 text-center">{{installment.Installment_FromDate}}</td>
                    <td class="col-3 text-center">{{installment.Installment_ToDate}}</td>
                    <td class="col-2 text-center">{{installment.Installment_Percent}} %</td>
                    <td class="col-3 text-center">{{installment.Instalmment_value.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  </tr>
                </tbody>
                <tfoot v-if="TotalDue > 0" >
                  <div class="container">
                  <div class="row">
                    <div id="Totals" class="col-9 text-center">Totals</div>
                    <div id="Totals" class="col-3 text-center">{{TotalDue.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                  </div>
                  </div>
                </tfoot>
              </table> 
            </div>


            <!-- <table class="table table-striped mt-3">
              <tbody>
                <tr
                  v-for="(installment) in Instalmment_values"
                  :key="installment.Instalment_Serial"
                >
                  <td>{{installment.Instalment_Serial}}</td>
                  <td>{{installment.Installment_FromDate}}</td>
                  <td>{{installment.Installment_ToDate}}</td>
                  <td>{{installment.Installment_Percent}} %</td>
                  <td>{{installment.Instalmment_value.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="TotalDue > 0">
              <strong>Totals :</strong>
              <span
                class="totaldue"
              >{{TotalDue.toLocaleString(undefined, {maximumFractionDigits:2})}}</span>
            </div>-->
          </div> 

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              :disabled="CanUpdate === false"
              @click="updatestudentinstallment"
            >Update</button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              v-bind:disabled="isDisable"
              @click="savestudentinstallment"
            >Save</button>
            <button
              type="button"
              class="btn btn-outline-info"
              @click="$emit('close-installment')"
            >Close</button>
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
    "Student_name",
  ],
  data() {
    return {
      AlertClass: "alert alert-success",
      YearFees: [],
      Installments: [],
      Instalmment_values: [],
      Invoice_Line: [],
      TotalDiscount: 0,
      Totalfees: 0,
      FullPayment: 0,
      PartPayment: 0,
      TotalDue: 0,
      isDisable: true,
      CanUpdate: false,
      Status: true,
      AlertMSG: "",
      ShowAlert: false,
    };
  },
  methods: {
    updatestudentinstallment() {
      this.Instalmment_values.forEach((installmentline) => {
        var Installmentline = {
          SY: this.SY,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SectionNo: this.SectionNo,
          DepartmentNo: this.DepartmentNo,
          GradeNo: this.GradeNo,
          ClassNo: this.ClassNo,
          StudentNo: this.StudentNo,
          Serial: installmentline.Instalment_Serial,
          DueDate: installmentline.Installment_FromDate,
          Amount: installmentline.Instalmment_value,
          BusValue: this.Installments[0].BusPackageValue,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/updatestudentinstfee",
            Installmentline
          )
          .then(
            (data) => {
              this.AlertMSG = "Data Saved";
              this.ShowAlert = true;
              this.CanUpdate = false;
            },
            (errorResponse) => {
              this.AlertClass = "alert alert-danger";
              this.AlertMSG = "ERROR : Data NOT Saved";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
    },
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
          (data) => {
            this.YearFees = data.data;
            if (data.data.length > 0) {
              this.Status = false;
            } else {
              this.Status = true;
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
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
      this.ShowAlert= false;
      this.Instalmment_values =[];
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
          (data) => {
            this.Installments = data.data;

            this.Installments.forEach((Instalment) => {
              var Inv_Line = {
                SourceNo: 0,
                SourceName: "",
                Amount: 0,
                DiscountValue: 0,
              };
              // Add bus package to first installment
              // console.log("Serial : " + Instalment.Serial);
              if (Instalment.Serial === 1) {
                this.FullPayment += Instalment.BusPackageValue;
                Inv_Line.SourceNo = 99;
                Inv_Line.SourceName = "Bus Package";
                Inv_Line.Amount = Instalment.BusPackageValue;
                Inv_Line.DiscountValue = 0;
                this.Invoice_Line.push(Inv_Line);
              }
              this.YearFees.forEach((fee) => {
                // console.log(fee.SourceName);
                Inv_Line.SourceNo = fee.SourceNo;
                Inv_Line.SourceName = fee.SourceName;

                var NetValue = fee.Amount - fee.DiscountValue;
                if (fee.FullPayment === 1 && Instalment.Serial === 1) {
                  // payment in full
                  this.FullPayment += NetValue;
                  Inv_Line.Amount = fee.Amount;
                  Inv_Line.DiscountValue = fee.DiscountValue;
                  console.log("Full " + this.FullPayment);
                  console.log(
                    "Line " + Inv_Line.SourceName,
                    Inv_Line.Amount,
                    Inv_Line.DiscountValue
                  );
                }
                if (fee.FullPayment === 0) {
                  // payment Percent
                  this.PartPayment += (NetValue * Instalment.Percent) / 100;
                  Inv_Line.Amount = (fee.Amount * Instalment.Percent) / 100;
                  Inv_Line.DiscountValue =
                    (fee.DiscountValue * Instalment.Percent) / 100;
                  // console.log("Part " + this.PartPayment);
                  //  console.log(
                  //   "Part " + Inv_Line.SourceName,
                  //   Inv_Line.Amount,
                  //   Inv_Line.DiscountValue
                  // );
                }
                NetValue = 0;
                this.Invoice_Line.push(Inv_Line);
              });

              var Installment_line = {
                Instalment_Serial: Instalment.Serial,
                Instalmment_value: this.FullPayment + this.PartPayment,
                Installment_FromDate: Instalment.FromDate,
                Installment_ToDate: Instalment.ToDate,
                Installment_Percent: Instalment.Percent,
              };
              this.TotalDue += Installment_line.Instalmment_value;
              this.Instalmment_values.push(Installment_line);
              this.FullPayment = 0;
              this.PartPayment = 0;
            });
          },
          (errorResponse) => {
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
          async (data) => {
            if (data.data.length > 0) {
              this.isDisable = true;
              this.CanUpdate = true;
              // for (const Inv of data.data) {
              //   if (Inv.InvoiceNo != 0) {
              //     //Invoice Posted
              //     var InvStat = await this.GetInvoiceStatus(
              //       this.GroupNo,
              //       Inv.InvoiceNo
              //     );
              //     if (InvStat.data[0].state === "paid") {
              //       // this.isDisable = true;
              //       this.CanUpdate = false;
              //     }
              //   }
              // }
            } else {
              this.isDisable = false;
              this.CanUpdate = false;
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    savestudentinstallment() {
      this.Instalmment_values.forEach((installmentline) => {
        var Installmentline = {
          SY: this.SY,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SectionNo: this.SectionNo,
          DepartmentNo: this.DepartmentNo,
          GradeNo: this.GradeNo,
          ClassNo: this.ClassNo,
          StudentNo: this.StudentNo,
          Serial: installmentline.Instalment_Serial,
          DueDate: installmentline.Installment_FromDate,
          Amount: installmentline.Instalmment_value,
          BusValue: this.Installments[0].BusPackageValue,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentinstfee",
            Installmentline
          )
          .then(
            (data) => {
              this.AlertMSG = "Data Saved";
              this.ShowAlert = true;
            },
            (errorResponse) => {
              this.AlertClass = "alert alert-danger";
              this.AlertMSG = "ERROR : Data NOT Saved";
              this.ShowAlert = true;
              console.log(errorResponse);
            }
          );
      });
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
.span {
  color: red;
}
</style>
