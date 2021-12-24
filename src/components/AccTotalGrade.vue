<template>
<div class="container">
    <h2 align="center"> Integrate S/Y Grade Fee </h2>
    <form classe ="form-inline">
        <div class="form-group row">
            <div class="col-md-2">          
                <label for ="academicYear">Academic Year</label>
            </div>
            <div class="col-md-2">
                <select id ="academicYear"  class="form-control input" v-model = "SY">
                    <option v-for="sy in syyears" v-bind:value="sy"> {{sy}} </option> 
                </select>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-md-2">          
                <label for ="school">School</label>
            </div>
            <div class="col-md-3">
                <select id ="school" v-on:change="fetchDept(SchoolNo);fetchinstallmets(SY,GroupNo,SchoolNo)" class="form-control input" v-model = "SchoolNo">
                <option v-for="school in Schools" v-bind:value="school.SchoolNo"> {{school.SchoolName}} </option>
                </select>
            </div>
            <div class="col-md-1">          
                <label for ="Department">Dpt.</label>
            </div>
            <div class="col-md-2">
                <select id ="Department" v-on:change="fetchGrades(SchoolNo,DepartmentNo)" class="form-control input" v-model = "DepartmentNo">
                <option v-for="dept in Depts" v-bind:value="dept.DepartmentNo"> {{dept.DepartmentName}} </option>
                </select>
            </div>
            <div class="col-md-1">          
                <label for ="grade">Grade</label>
            </div>
            <div class="col-md-2">
                <select id ="grade" v-on:change="fetchtotalfee(SY,GroupNo,SchoolNo,DepartmentNo,GradeNo)" class="form-control input" v-model = "GradeNo">
                <option v-for="grade in Grades" v-bind:value="grade.GradeNo"> {{grade.Grade}} </option>
                </select>
            </div>
        </div>
        <!-- <div class="form-group row">
            <div class="col-md-12">
                <button   v-on:click.prevent="sendToAcc()" class="btn btn-primary btn-lg">{{operation}}</button>
            </div>
        </div> -->
        <div class="form-group row">
            <div class="progress">
                <div ref="progbar" class= "progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" v-bind:style="{width: Current + '%'}">
                    {{Current}}%
                </div>
            </div>
        </div>

       <!-- <detailesinstline v-if="DisplayModel"></detailesinstline> -->


<!-- The modal -->
        <div class="modal fade" id="flipFlop" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h5 class="modal-title" id="modalLabel">Installment No. {{LineSerial}} Details</h5>
                    </div>
                <div class="modal-body">
                    
                    <table class="table table-striped">
                    <tbody>
                        <tr v-for="(Mypayline) in payline" >
                        <td>{{Mypayline.SourceName}}</td>
                        <td>{{Mypayline.Amount}}</td>
                        </tr>
                    </tbody>
                    </table>                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>




 
    <table class="table table-striped">
      <thead>
        <tr>
            <th>Serial</th>
            <th>From</th>
            <th>To</th> 
            <th>Amount</th>         
            <th>Posted</th>         
            <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(Myline) in Payments" :key="Myline.Serial">
          <td>{{Myline.Serial}}</td>
          <td>{{Myline.FromDate}}</td>
          <td>{{Myline.ToDate}}</td>
          <td>{{Myline.Amount}}</td>
          <td v-if="Myline.Posted === 0">No</td>
          <td v-else>Yes</td>          
          <td class="btn btn-warning " v-on:click.prevent="PostToACC(Myline)">Post </td>
          <td class="btn btn-info" data-toggle="modal" data-target="#flipFlop" v-on:click.prevent="fetchpayline(Myline)"> Details </td>
          <td class="btn btn-danger">Delete</td>
        </tr>
      </tbody>
    </table>

    </form>
</div>
</template>

<script>
import axios from "axios";
import server from "../server";
import detailesinstline from "@/components/detailesinstline";
export default {
  components: {
    detailesinstline: detailesinstline
  },
  data() {
    return {
      DisplayModel: false,
      Current: 0,
      StudentCount: 0,
      CurrentStudent: 1,
      SY: "",
      operation: "Save",
      payline: [],
      Invline: [],
      LineSerial: 0,
      GroupNo: 1,
      SchoolNo: 0,
      BranchNo: 0,
      DepartmentNo: 0,
      GradeNo: 0,
      TotalFullPayment: 0,
      TotalInstallment: 0,
      LineFullPayment: 0,
      LineInstallment: 0,
      invoiceNo: 0,
      StudentBDiscount: 0,
      StudentPDiscount: 0,
      StudentADiscount: 0,
      Total_Discount: 0,
      Schools: [],
      Depts: [],
      Grades: [],
      Classes: [],
      Students: [],
      Installment: [],
      Payments: [],
      syyears: ["2017/2018", "2018/2019", "2019/2020"]
    };
  },

  methods: {
    // Savestudentclass() {
    //   if (this.operation === "Save") {
    //     let new_Student = {
    //       SY: this.SY,
    //       GroupNo: this.GroupNo,
    //       SchoolNo: this.SchoolNo,
    //       DepartmentNo: this.DepartmentNo,
    //       GradeNo: this.GradeNo,
    //       ClassNo: this.ClassNo,
    //       StudentNo: this.Student.StudentNo,
    //       StudentNameA: this.Student.StudentNameA,
    //       StudentNameE: this.Student.StudentNameE
    //     };
    //     axios
    //       .post(
    //         "http://" + server.IP + ":" + server.port + "/addstudentclass",
    //         new_Student
    //       )
    //       .then(
    //         data => {
    //           this.StudentNo = "";
    //           this.Student.StudentNameA = "";
    //           this.Student.StudentNameE = "";
    //           this.fetchStudent_Class(
    //             this.SY,
    //             this.GroupNo,
    //             this.SchoolNo,
    //             this.DepartmentNo,
    //             this.GradeNo,
    //             this.ClassNo
    //           );
    //         },
    //         errorResponse => {
    //           console.log(errorResponse);
    //         }
    //       );
    //   }
    // },

    fetchpayline(myline) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getsygradefeesline/" +
            myline.SY +
            "/" +
            myline.GroupNo +
            "/" +
            myline.SchoolNo +
            "/" +
            myline.DepartmentNo +
            "/" +
            myline.GradeNo +
            "/" +
            myline.Serial
        )
        .then(
          data => {
            this.payline = data.data;
            this.LineSerial = myline.Serial;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    fetchinstallmets(sy, group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getinstallment/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Installment = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },

    fetchtotalfee(sy, group, school, depart, grade) {
      //check if Payments alrady exist
      this.fetchGradePayment(sy, group, school, depart, grade);

      //      console.log(this.Payments.length);
      // if (this.Payments.length === 0) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/gradefees/" +
            sy +
            "/" +
            group +
            "/" +
            school +
            "/" +
            grade
        )
        .then(
          data => {
            var LineAmount = 0;
            data.data.forEach(fee => {
              if (fee.FullPayment === 1) {
                //full payment
                this.TotalFullPayment = this.TotalFullPayment + fee.Amount;
                this.LineFullPayment = fee.Amount;
              } else {
                // installment
                //this.LineFullPayment = 0
                this.TotalInstallment = this.TotalInstallment + fee.Amount;
                this.LineInstallment = fee.Amount;
              }
              //loop in installment to get  Amount line for each revenue Source

              this.Installment.forEach(line => {
                if (line.Serial === 1 && fee.FullPayment === 1) {
                  // first installment ??
                  LineAmount = this.LineFullPayment;
                } else {
                  // installment % payment in other installments
                  LineAmount = this.LineInstallment * (line.Percent / 100);
                }
                let new_line_installment = {
                  SY: this.SY,
                  GroupNo: this.GroupNo,
                  SchoolNo: this.SchoolNo,
                  DepartmentNo: this.DepartmentNo,
                  GradeNo: this.GradeNo,
                  SourceNo: fee.SourceNo,
                  Serial: line.Serial,
                  FromDate: line.FromDate,
                  ToDate: line.ToDate,
                  Amount: LineAmount
                };
                axios
                  .post(
                    "http://" +
                      server.IP +
                      ":" +
                      server.port +
                      "/addgradefeeline",
                    new_line_installment
                  )
                  .then(
                    data => {
                      console.log("line Saved");
                    },
                    errorResponse => {
                      console.log(errorResponse);
                    }
                  );
              });
              this.LineFullPayment = 0;
              this.LineInstallment = 0;
            });

            //loop in installment and calculate payline
            var NetAmount = 0;
            this.Installment.forEach(element => {
              if (element.Serial === 1) {
                NetAmount =
                  this.TotalFullPayment +
                  this.TotalInstallment * (element.Percent / 100);
              } else {
                NetAmount = this.TotalInstallment * (element.Percent / 100);
              }
              let new_installment = {
                SY: this.SY,
                GroupNo: this.GroupNo,
                SchoolNo: this.SchoolNo,
                DepartmentNo: this.DepartmentNo,
                GradeNo: this.GradeNo,
                Serial: element.Serial,
                FromDate: element.FromDate,
                ToDate: element.ToDate,
                Amount: NetAmount
              };
              axios
                .post(
                  "http://" + server.IP + ":" + server.port + "/addgradefee",
                  new_installment
                )
                .then(
                  data => {
                    console.log("head Saved");
                  },
                  errorResponse => {
                    console.log(errorResponse);
                  }
                );
              this.fetchGradePayment(
                this.SY,
                this.GroupNo,
                this.SchoolNo,
                this.DepartmentNo,
                this.GradeNo
              );
            });

            // console.log(this.SY,this.GroupNo,this.SchoolNo,this.DepartmentNo,this.GradeNo)
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
      // }
    },

    PostToACC(master) {
      // console.log(master);
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getsygradefeesline/" +
            master.SY +
            "/" +
            master.GroupNo +
            "/" +
            master.SchoolNo +
            "/" +
            master.DepartmentNo +
            "/" +
            master.GradeNo +
            "/" +
            master.Serial
        )
        .then(
          data => {
            this.Invline = data.data;
            // this.LineSerial = payline.Serial;
            // console.log("inv_line_length :" + this.Invline.length);
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );

      // // Get Classes for this Grade
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/calasses/" +
            master.SchoolNo +
            "/" +
            master.DepartmentNo +
            "/" +
            master.GradeNo
        )
        .then(
          data => {
            this.Classes = data.data;
            this.Classes.forEach(myclass => {
              axios
                .get(
                  "http://" +
                    server.IP +
                    ":" +
                    server.port +
                    "/liststudents/" +
                    this.SY +
                    "/" +
                    master.GroupNo +
                    "/" +
                    master.SchoolNo +
                    "/" +
                    master.DepartmentNo +
                    "/" +
                    master.GradeNo +
                    "/" +
                    myclass.ClassNo
                )
                .then(
                  mystudents => {
                    this.Students = mystudents.data;
                    this.StudentCount = this.Students.length;
                  },
                  errorResponse => {
                    console.log(errorResponse);
                  }
                );
            }); // end loop for each class
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/transno/" +
            master.school
        )
        .then(Serial => {
          this.invoiceNo = Serial.data;
          console.log("No. of Students : " + this.Students.length);
          this.Total_Discount = 0;
          let vm = this;
          this.Students.forEach(
            Student => {
              this.StudentBDiscount = Student.BrotherDiscount;
              if (this.StudentBDiscount != 0) {
                vm.Total_Discount =
                  vm.Total_Discount +
                  this.Calc_BDiscount(this.StudentBDiscount);
              }
              this.StudentPDiscount = Student.ParentDiscount;
              if (this.StudentPDiscount != 0) {
                vm.Total_Discount =
                  vm.Total_Discount +
                  this.Calc_PDiscount(this.StudentPDiscount);
                console.log(this.Total_Discount);
              }
              this.StudentADiscount = Student.StudentADiscount;
              let invoice_head = {
                BRANCH: this.BranchNo,
                TRNS_CODE: 33,
                TRNS_NO: this.invoiceNo,
                TRNS_DATE: master.FromDate,
                TRNS_DEDUC: 0,
                TO_CODE: Student.StudentNo,
                TRNS_NET: master.Amount - vm.Total_Discount,
                ITEM_FORM: "005",
                SALES_REP_CODE: master.SY,
                TRNS_STAMP: master.FromDate,
                TRNS_VAL: master.Amount,
                ANALYZE_CODE: master.LinkCode,
                ANALYZE_NAME: master.LinkName, //Send Link Name to insert it in ORA Table AnalyzeCode
                REM: "Generated from Student Affairs Module"
              };
              // console.log(invoice_head);
              axios
                .post(
                  "http://" + server.IP + ":" + server.port + "/post_inv_head",
                  invoice_head
                )
                .then(
                  data => {
                    // loop here to calculate discount and insert invoice line
                    // console.log(this.Invline.length);
                    let MySerial = 1;
                    this.Invline.forEach(line => {
                      var Invoice_line = {
                        TRNS_CODE: "33",
                        TRNS_NO: this.invoiceNo,
                        ITEM_FORM: "005",
                        BRANCH: this.BranchNo,
                        TRNS_DATE: master.FromDate,
                        ITEM_CODE: line.IntgrationCode,
                        UNIT_PRICE: line.Amount,
                        TOTAL_PRICE: line.Amount,
                        SERIAL_NO: MySerial
                      };
                      // console.log(Invoice_line);
                      axios
                        .post(
                          "http://" +
                            server.IP +
                            ":" +
                            server.port +
                            "/post_inv_line",
                          Invoice_line
                        )
                        .then(
                          data => {
                            console.log("Inv_line Save");
                          },
                          errorResponse => {
                            console.log(errorResponse);
                          }
                        );
                      MySerial++;
                    }); //end loop in Invoice Line
                  },
                  errorResponse => {
                    console.log(errorResponse);
                  }
                );
            },
            errorResponse => {
              console.log(errorResponse);
            },
            this.invoiceNo++
          );
        });
      // },
      // errorResponse => {
      //   console.log(errorResponse);
      // });
    },

    Calc_BDiscount(percent) {
      this.Invline.forEach(revenue => {
        if (revenue.SourceNo === 1) {
          return revenue.Amount * percent / 100;
        }
      });
    },

    Calc_PDiscount(percent) {
      this.Invline.forEach(revenue => {
        if (revenue.SourceNo === 1) {
          console.log(revenue.Amount * percent / 100);
          return revenue.Amount * percent / 100;
        }
      });
    },
    fetchGradePayment(sy, group, school, dept, grade) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getsygradefees/" +
            sy +
            "/" +
            group +
            "/" +
            school +
            "/" +
            dept +
            "/" +
            grade
        )
        .then(
          data => {
            this.Payments = data.data;
            return;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    fetchGrades(school, dept) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/grades/" +
            school +
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
    fetchDept(school) {
      axios
        .get("http://" + server.IP + ":" + server.port + "/depts/" + school)
        .then(
          data => {
            this.Depts = data.data;
            for (var i = 0, len = this.Schools.length; i < len; i++) {
              if (this.Schools[i].SchoolNo === this.SchoolNo) {
                this.BranchNo = this.Schools[i].BranchNo;
                break;
              }
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchSchools(this.GroupNo);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  /* align : center; */
  margin-top: 5px;
  margin-bottom: 20px;
  color: #3eb3d5;
}
label {
  margin-left: 0px;
  margin-top: 5px;
  color: #3eb3d5;
}
thead {
  color: #2273bf;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  color: #0c36be;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #0056f5;
}
</style>
