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
            {{Student_name}} {{partner_id}}
          </div>
          <div class="modal-body">
            <div class="row"> 
            <div class="col-md-2">
              <label for="serial">Serial</label>
              <select id="serial" class="form-select col-2" v-model="StudentInstallments.Serial">
                  <option v-for="line in StudentInstallments" :key="line.Serial">{{line.Serial}}</option>
              </select>
            </div>
            <div class="col-md-3 mt-4">
              <button
                type="button"
                class="btn btn-warning "
                v-bind:disabled="isDisable"
                @click="Show_Invoice(StudentInstallments.Serial)"
              >Show Invoice</button>
            </div>
            <div v-if="InvoiceHead.DueDate" class="col-md-7 mt-4">
              <strong>Date :</strong>
              {{InvoiceHead.DueDate}}
              <strong>Invoice #</strong>
              {{InvoiceHead.InvoiceNo}}
            </div> 
            <!-- Alert Symbols 
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </symbol>
              <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </symbol>
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
            </svg>-->
            <!-- <div class="alert alert-success d-flex align-items-center" role="alert"></div> -->
            <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
              <!-- <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg> -->

              <strong>{{AlertMSG}}</strong>
              <!-- <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> -->
            </div>

            <div id="MyTable" class="row mt-2">
              <table  class="table table-md table-bordered table-success table-striped">
                <thead>
                  <tr class="d-flex">
                    <th class="col-10 text-center">Revenue</th>
                    <th class="col-2 text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="d-flex" v-for="line in InvoiceLine" :key="line.SourceNo">
                    <td class="col-10 text-center">{{line.SourceName}}</td>
                    <td class="col-2 text-center">{{line.net.toLocaleString(undefined, {maximumFractionDigits:2})}}</td>
                  </tr>
                </tbody>
                <tfoot v-if="InvoiceHead.DueDate" >
                  <div class="container">
                  <div class="row">
                    <div id="Totals" class="col-10 text-center">Totals</div>
                    <div id="Totals" class="col-2 text-center">{{InvoiceHead.Total.toLocaleString(undefined, {maximumFractionDigits:2})}}</div>
                  </div>
                  </div>
                </tfoot>
              </table> 
            </div>
            </div>
          </div>
          <div class="modal-footer">
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
              data-dismiss="modal"
              @click="saveinvoice"
              :disabled="Status === false"
            >Save</button>
            <button type="button" class="btn btn-outline-info" @click="$emit('close-invoice')">Close</button>
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
    "partner_id",
  ],
  data() {
    return {
      AlertClass: "alert alert-success d-flex align-items-center",
      AlertMSG: "",
      ShowAlert: false,
      Status: false,
      CanUpdate: false,
      UpdateRest:0,
      StudentInstallments: [],
      Installments: [],
      Discounts: [],
      InvoiceLine: [],
      BranchNo: 0,
      BusLine: {
        Amount: 0,
        net: 0,
        DiscountValue: 0,
        SourceName: "Bus Package",
        product_id: 999,
      },
      InvoiceHead: {
        Serial: 0,
        DueDate: "",
        Total: 0,
        BusValue: 0,
        InvoiceNo: 0,
      },
      isDisable: true,
      AlertMSG: "",
      ShowAlert: false,
    };
  },
  methods: {
    Show_Invoice(Serial) {
      this.ShowAlert = false;
      this.fetchStudent_Installment_Serial(
        this.SY,
        this.GroupNo,
        this.SchoolNo,
        this.SectionNo,
        this.DepartmentNo,
        this.GradeNo,
        this.ClassNo,
        this.StudentNo,
        Serial
      );

      this.fetchStudent_InvoiceLine(
        this.SY,
        this.GroupNo,
        this.SchoolNo,
        this.SectionNo,
        this.DepartmentNo,
        this.GradeNo,
        this.ClassNo,
        this.StudentNo,
        Serial
      );
    },
    updatestudentfee() {
      // console.log("Head", this.InvoiceHead, "Line", this.InvoiceLine);
      var new_head = {
        GroupNo: this.GroupNo,
        InvoiceNo: this.InvoiceHead.InvoiceNo,
        amount_untaxed: this.InvoiceHead.Total,
        amount_total: this.InvoiceHead.Total,
        residual:this.UpdateRest
      };
      // console.log("invoice head :", new_head);
      axios
        .put(
          "http://" + server.IP + ":" + server.port + "/update_inv_head",
          new_head
        )
        .then(
          () => {
            this.InvoiceLine.forEach((line) => {
              var Inv_Line = {
                GroupNo: this.GroupNo,
                invoice_id: this.InvoiceHead.InvoiceNo,
                price_unit: line.ShareAmount,
                price_subtotal: line.net,
                discount_amount: line.ShareDiscount,
                product_id: line.SourceNo,
              };

              axios
                .put(
                  "http://" + server.IP + ":" + server.port + "/upd_inv_line",
                  Inv_Line
                )
                .then(
                  () => {
                    this.CanUpdate = false;
                  },
                  (errorResponse) => {
                    this.AlertClass = "alert alert-danger d-flex align-items-center";
                    this.AlertMSG = "ERROR : Invoice Line NOT Saved";
                    this.ShowAlert = true;
                    console.log(errorResponse);
                  }
                );
            });
            // for (const Discount of this.Discounts) {
            //   var Discount_Line = {
            //     inv_no: this.InvoiceHead.InvoiceNo,
            //     discountPackageno: Discount.DiscountPackageNo,
            //     discountpackagename: Discount.DiscountPackageName,
            //     discountvalue: Discount.DiscountValue
            //   };
            //   // console.log("Before Percent", Discount_Line.discountvalue);
            //   for (const line of this.Installments) {
            //     if (line.Serial === this.InvoiceHead.Serial) {
            //       // console.log(Discount_Line.discountvalue, line.Percent);
            //       Discount_Line.discountvalue =
            //         (Discount_Line.discountvalue * line.Percent) / 100;
            //     }
            //     // console.log("After Percent", Discount_Line);
            //   }
            // }
            //   console.log("After Percent", Discount_Line);
            // axios
            //   .post(
            //     "http://" +
            //       server.IP +
            //       ":" +
            //       server.port +
            //       "/post_Discount_line",
            //     Discount_Line
            //   )
            //   .then(
            //     data => {},
            //     errorResponse => {
            //       this.AlertClass = "alert alert-danger alert-dismissible";
            //       this.AlertMSG = "ERROR : Discount Line NOT Saved";
            //       this.ShowAlert = true;
            //       console.log(errorResponse);
            //     }
            //   );
            // }
            // this.updatestudentinvoice(
            //   this.SY,
            //   this.GroupNo,
            //   this.SchoolNo,
            //   this.SectionNo,
            //   this.DepartmentNo,
            //   this.GradeNo,
            //   this.ClassNo,
            //   this.StudentNo,
            //   this.InvoiceHead.Serial,
            //   this.InvoiceHead.InvoiceNo
            // );
            this.AlertMSG = "Data Saved";
            this.ShowAlert = true;
          },
          (errorResponse) => {
            this.AlertClass = "alert alert-danger d-flex align-items-center";
            this.AlertMSG = "ERROR : Invoicec Head NOT Saved";
            this.ShowAlert = true;
            console.log(errorResponse);
          }
        );

      this.Status = false;
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
      axios
        .get(
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
        )
        .then(
          async (data) => {
            this.InvoiceLine = data.data;
            if (Serial === "1") {
              //Check if Student has Bus Package ?????????

              this.BusLine.Amount = this.InvoiceHead.BusValue;
              this.BusLine.net = this.InvoiceHead.BusValue;
              this.BusLine.ShareAmount = this.InvoiceHead.BusValue;
              this.BusLine.ShareDiscount = 0;
              this.BusLine.SourceName = "Bus Package";
              this.BusLine.SourceNo = 999;

              this.InvoiceLine.push(this.BusLine);
            }

            var i = 0;
            this.InvoiceLine.forEach((invline) => {
              if (Serial > 1 && invline.FullPayment === 1) {
                this.InvoiceLine.splice(i, 1);
              }
              i++;
            });
            if (this.InvoiceHead.InvoiceNo != 0) {
              //Invoice Posted
              var InvStat = await this.GetInvoiceStatus(
                this.GroupNo,
                this.InvoiceHead.InvoiceNo
              );
              if (InvStat.data[0].state === "draft") {
                this.UpdateRest = this.InvoiceHead.Total;
              } else {
                this.UpdateRest = 0;;
              }
              this.CanUpdate = true;
            } else {
              //Invoice Not Posted Yet
              this.CanUpdate = false;
              // this.isDisable = true;
            }

            // console.log("invoice line after bus:", this.InvoiceLine);
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    fetchStudent_Installment_Serial(
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
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentinstallmentserial/" +
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
        )
        .then(
          (data) => {
            this.InvoiceHead.DueDate = data.data[0].DueDate;
            this.InvoiceHead.Total = data.data[0].Amount;
            // this.BusLine.Amount = data.data[0].BusValue;
            // this.BusLine.net = data.data[0].BusValue;
            this.InvoiceHead.BusValue = data.data[0].BusValue;
            this.InvoiceHead.Serial = data.data[0].Serial;
            this.InvoiceHead.InvoiceNo = data.data[0].InvoiceNo;
            if (this.InvoiceHead.InvoiceNo != 0) {
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

    fetchStudentYearlyInstallments(
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
          (data) => {
            this.StudentInstallments = data.data;
            // console.log(this.StudentInstallments);
            if (data.data.length > 0) {
              this.isDisable = false;
            } else {
              this.isDisable = true;
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
            // console.log("Installments:", this.Installments);
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    updatestudentinvoice(
      SY,
      GroupNo,
      SchoolNo,
      SectionNo,
      DepartmentNo,
      GradeNo,
      ClassNo,
      StudentNo,
      Serial,
      InvoiceNo
    ) {
      axios
        .put(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/updatestudentinvoice/" +
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
            Serial +
            "/" +
            InvoiceNo
        )
        .then(
          (data) => {},
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    fetchSchoolsbranch(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getbranch/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.BranchNo = data.data[0].BranchNo;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
    saveinvoice() {
      var new_head = {
        sy: this.SY,
        GroupNo: this.GroupNo,
        student_no: this.StudentNo,
        grade_no: this.GradeNo,
        section_no: this.SectionNo,
        department_no: this.DepartmentNo,
        class_no: this.ClassNo,
        date_due: this.InvoiceHead.DueDate,
        company_id: this.BranchNo,
        amount_untaxed: this.InvoiceHead.Total,
        partner_id: this.partner_id,
        date_invoice: this.SY.substring(0, 4) + "/09/01",
        amount_total: this.InvoiceHead.Total,
      };
      // console.log("invoice head :", new_head);
      axios
        .post(
          "http://" + server.IP + ":" + server.port + "/post_inv_head",
          new_head
        )
        .then(
          (data) => {
            var invoiceNo = data.data;
            this.InvoiceHead.InvoiceNo = invoiceNo;

            this.InvoiceLine.forEach((line) => {
              // console.log("line", line);
              var Inv_Line = {
                GroupNo: this.GroupNo,
                invoice_id: invoiceNo,
                price_unit: line.ShareAmount,
                price_subtotal: line.net,
                discount_amount: line.ShareDiscount,
                product_id: line.SourceNo,
                partner_id: this.partner_id,
                name: line.SourceName,
              };
              // console.log("invoice line:", Inv_Line);
              axios
                .post(
                  "http://" + server.IP + ":" + server.port + "/post_inv_line",
                  Inv_Line
                )
                .then(
                  (data) => {},
                  (errorResponse) => {
                    this.AlertClass = "alert alert-danger d-flex align-items-center";
                    this.AlertMSG = "ERROR : Invoice Line NOT Saved";
                    this.ShowAlert = true;
                    console.log(errorResponse);
                  }
                );
            });
            for (const Discount of this.Discounts) {
              var Discount_Line = {
                inv_no: this.InvoiceHead.InvoiceNo,
                discountPackageno: Discount.DiscountPackageNo,
                discountpackagename: Discount.DiscountPackageName,
                discountvalue: Discount.DiscountValue,
              };
              // console.log("Before Percent", Discount_Line.discountvalue);
              for (const line of this.Installments) {
                if (line.Serial === this.InvoiceHead.Serial) {
                  // console.log(Discount_Line.discountvalue, line.Percent);
                  Discount_Line.discountvalue =
                    (Discount_Line.discountvalue * line.Percent) / 100;
                }
                // console.log("After Percent", Discount_Line);
              }
            }
            //   console.log("After Percent", Discount_Line);
            // axios
            //   .post(
            //     "http://" +
            //       server.IP +
            //       ":" +
            //       server.port +
            //       "/post_Discount_line",
            //     Discount_Line
            //   )
            //   .then(
            //     data => {},
            //     errorResponse => {
            //       this.AlertClass = "alert alert-danger alert-dismissible";
            //       this.AlertMSG = "ERROR : Discount Line NOT Saved";
            //       this.ShowAlert = true;
            //       console.log(errorResponse);
            //     }
            //   );
            // }
            this.updatestudentinvoice(
              this.SY,
              this.GroupNo,
              this.SchoolNo,
              this.SectionNo,
              this.DepartmentNo,
              this.GradeNo,
              this.ClassNo,
              this.StudentNo,
              this.InvoiceHead.Serial,
              this.InvoiceHead.InvoiceNo
            );
            this.AlertMSG = "Data Saved";
            this.ShowAlert = true;
          },
          (errorResponse) => {
            this.AlertClass = "alert alert-danger d-flex align-items-center";
            this.AlertMSG = "ERROR : Invoicec Head NOT Saved";
            this.ShowAlert = true;
            console.log(errorResponse);
          }
        );

      this.Status = false;
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
            this.Discounts = data.data;
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
    this.fetchStudent_Installments(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.ClassNo,
      this.StudentNo
    );
    this.fetchSchoolsbranch(this.GroupNo, this.SchoolNo);
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
</style>
