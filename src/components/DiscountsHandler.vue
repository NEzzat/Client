<template>
  <transition name="modal">
    <div class="container">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog  modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 align="center" class="modal-title">{{ Student_name }}</h4>
            </div>
            <!-- <div class="row"> -->
            <div class="modal-body">
              <div class="row">
                <div class="col-md-5">
                  <label for="Discount">Discount</label>
                  <select v-model="Discount" v-on:change="selectDiscount(Discount)" class="form-select col-2" id="Discount">
                    <option v-for="Discount in DiscountPackages" v-bind:value="Discount.DiscountPackageNo" :key="Discount.DiscountPackageNo">
                        {{ Discount.Packagename }} - <span class="badge">{{Discount.SourceName}}</span>
                    </option>
                  </select>
                </div>

                <div class="col-md-7 mt-0">
                  <a href="" class="list-group-item active"
                      >Student Discounts</a
                    >
                  <div class="list-group" id="MyList">
                    <button v-for="Discount in Selected"
                      type="button" 
                      :key="Discount.DiscountPackageNo"
                      v-on:dblclick="deselectDiscount(Discount)"
                      class="list-group-item-danger">
                      {{ Discount.Packagename }} - {{Discount.SourceName}}
                    </button>
                  </div> 
                </div>                      

                  <!-- <div class="col-md-6">
                  <div class="list-group">
                    <a href="" class="list-group-item active"
                      >Student Discounts</a
                    >
                    <li 
                      v-for="Discount in Selected"
                      :key="Discount.DiscountPackageNo"
                      v-on:dblclick="deselectDiscount(Discount)"
                      class="list-group-item list-group-item-danger"
                    > <a href="#" >
                      {{ Discount.Packagename }} - 
                      <span class="label label-success">{{Discount.SourceName}}</span>
                      </a>
                    </li>
                  </div>
                </div>-->
                 
              </div>
            </div> 
            <div class="modal-footer">
              <div class="row">
                <div class="col-md-12">
                  <button v-on:click.prevent="SavestudentDiscounts()" class="btn btn-primary" >{{ operation }}</button>  
                  <button type="button" class="btn btn-outline-info" @click="$emit('close-discount')">Close</button>
                </div>
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
    "Student_name",
  ],
  data() {
    return {
      operation: "Save",
      DiscountPackages: [],
      Selected: [],
      Fees: [],
      Discount:0
    };
  },
  methods: {
    async SavestudentDiscounts() {
      let DeleteDiscount = await this.DeletestudentDiscounts(
        this.SY,
        this.GroupNo,
        this.SchoolNo,
        this.SectionNo,
        this.DepartmentNo,
        this.GradeNo,
        this.ClassNo,
        this.StudentNo
      );
      if (this.Selected.length > 0) {
        this.Selected.forEach((line) => {
          let new_Student = {
            SY: this.SY,
            GroupNo: this.GroupNo,
            SchoolNo: this.SchoolNo,
            SectionNo: this.SectionNo,
            DepartmentNo: this.DepartmentNo,
            GradeNo: this.GradeNo,
            ClassNo: this.ClassNo,
            StudentNo: this.StudentNo,
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
        // this.$emit('close-discount')
        // this.Student.StudentNo = "";
        // this.Student_Class.StudentNo = "";
        // this.Selected = [];
        // this.Student.Student_name = "";
        // this.Student.Student_Arabic_name = "";
        // this.fetchDiscountPackages(
        //   this.Student_Class.GroupNo,
        //   this.Student_Class.SchoolNo
        // );
        // this.operation = "Save";
      }
      this.$emit('close-discount')
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
    deselectDiscount(Discount) {
      // this.DiscountPackages.push(Discount);
      var i = this.Selected.indexOf(Discount);
      if (i > -1) {
        this.Selected.splice(i, 1);
      }
    },
    selectDiscount(Discount) {
      var Found = false;
      this.Selected.forEach(SelectedDiscount => {
        if (SelectedDiscount.DiscountPackageNo === Discount) {
          Found = true
        }
      })

      if (!Found) {
        var selectedDiscount = {};
        this.DiscountPackages.forEach(element => {
          if (element.DiscountPackageNo === Discount) {
            selectedDiscount.DiscountPackageNo = element.DiscountPackageNo;
            selectedDiscount.Packagename = element.Packagename;
            selectedDiscount.DiscountPackageValue = element.DiscountPackageValue;
            selectedDiscount.DiscountPackagePercent = element.DiscountPackagePercent;
            selectedDiscount.SourceNo = element.SourceNo;
            selectedDiscount.SourceName = element.SourceName
            this.Selected.push(selectedDiscount);
          }
          
        });
       } //else {
      //   console.log("Exist")
      // }
      
      // var index = this.DiscountPackages.indexOf(Discount);
      // if (index > -1) {
      //   this.DiscountPackages.splice(index, 1);
      // }
    },


  } ,
  created: function () {
    this.fetchDiscountPackages(this.GroupNo,this.SchoolNo);
    this.fetchStudent_Discounts(
      this.SY,
      this.GroupNo,
      this.SchoolNo,
      this.SectionNo,
      this.DepartmentNo,
      this.GradeNo,
      this.ClassNo,
      this.StudentNo);
      this.fetchStudent_Accounts(this.SY,this.GroupNo,this.SchoolNo,this.SectionNo,this.DepartmentNo,this.GradeNo,this.RegDate)
  },
};
</script>
<style scoped>
.modal-mask {
  /* position: fixed; */
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-title {
  color: rgba(58, 86, 214, 0.678);
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>