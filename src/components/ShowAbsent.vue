<template>
<div class="container">
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-dialog  modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <div class="col-md-12">
                <label>Name :</label> {{Student_name}}
            </div>
          </div>
          <div class="modal-body">
            <!-- <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
              <strong>{{AlertMSG}}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>  -->
            <div class="row">
              <div class="col-md-3">
                <label for="Abcent">Abcent Day</label>
                <input type="date"  v-model = "AbsentStudent.AbsentDate" id="Abcent">
              </div>                   
              <div class="col-md-3">          
                <label for ="resone">Reason</label>
                <select id ="resone" class="form-select col-4"  v-model = "AbsentStudent.ReasonNo">
                  <option v-for="(Reason,index) in Reasons" v-bind:value="Reason.ReasonNo" :key="index"> {{Reason.ReasonName}} </option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="Remarks">Remarks</label>
                <input type="text" id="Remarks" class="form-control" v-model = "AbsentStudent.Remarks" placeholder="Remarks">
              </div>
            </div>
            <div id="MyTable" class="row mt-3">
            <table id="MyTable" class="table table-md table-bordered table-success table-striped mt-3">
              <thead>
                <tr class="d-flex">
                  <th class="col-1 text-center">#</th>
                  <th class="col-2 text-center">Date</th>
                  <th class="col-3 text-center">Reason</th>
                  <th class="col-4 text-center">Remark</th>
                  <th class="col-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr class="d-flex" v-for="(AbsentDay, index) in AbsentDays" :key="index">
                  <td class="col-1 text-center">{{index+1}}</td>
                  <td class="col-2 text-center">{{AbsentDay.AbsentDay}}</td>
                  <td class="col-3 text-center">{{AbsentDay.ReasonName}}</td>
                  <td class="col-4 text-center">{{AbsentDay.Remarks}}</td>
                  <div class="btn-group col-2" role="group">
                    <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><span @click="showabcentday(AbsentDay)"><i class="bi bi-pencil"></i></span></td> 
                    <td class="col-1 btn text-center"  data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><span @click="delteabcentday(AbsentDay)"><i class="bi bi-trash"></i></span></td> 
                  </div>                    
                </tr>
              </tbody>
            </table>
            </div> 
          </div>
          <div class="modal-footer">
            <div class="container">
              <div class="row">
                <div id="Totals" class="col-5 text-center pt-1">Number of Days :</div>
                <div id="Totals" class="col-2 text-center pt-1">{{NumberofDays}}</div>
                <div class="col-5 d-flex justify-content-end">
                <button type="button" class="btn btn-outline-info" @click="$emit('close-abcent')"> Close </button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="saveabsent" >
                  {{operation}}
                </button> 
                </div>
              </div>                 
            </div>
          </div>                
        </div>
      </div>
    </div>
    </div>
</transition>
</div>
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
    "partner_id"
  ],
  data() {
    return {
      operation: "Save",
      AlertClass: "alert alert-success alert-dismissible",
      AlertMSG: "",
      ShowAlert: false,
      Reasons: [],
      AbsentDays: [],
      AbsentStudent: {
        AbsentDate: new Date().toISOString().slice(0, 10),
        ReasonNo: 0,
        Remarks: ""
      },
      NumberofDays: 0
    };
  },
  methods: {
    saveabsent() {
      if (
        this.AbsentStudent.AbsentDate != "" &&
        this.AbsentStudent.ReasonNo != 0
      ) {
        var StudentAbsent = {
          AbsentDay: this.AbsentStudent.AbsentDate,
          SY: this.SY,
          GroupNo: this.GroupNo,
          SchoolNo: this.SchoolNo,
          SectionNo: this.SectionNo,
          DepartmentNo: this.DepartmentNo,
          GradeNo: this.GradeNo,
          ClassNo: this.ClassNo,
          StudentNo: this.StudentNo,
          ReasonNo: this.AbsentStudent.ReasonNo,
          Remarks: this.AbsentStudent.Remarks
        };

        if (this.operation === "Save") {
          axios
            .post(
              "http://" + server.IP + ":" + server.port + "/addabsentday",
              StudentAbsent
            )
            .then(
              data => {
                this.AbsentStudent.AbsentDate = "";
                this.AbsentStudent.ReasonNo = 0;
                this.AbsentStudent.Remarks = "";
                this.fetchAbsentDays(this.SY, this.StudentNo);
                this.AlertMSG = "Data Saved";
                this.ShowAlert = true;
              },
              errorResponse => {
                this.AbsentStudent.AbsentDate = "";
                this.AbsentStudent.ReasonNo = 0;
                this.AbsentStudent.Remarks = "";
                this.AlertClass = "alert alert-danger alert-dismissible";
                this.AlertMSG = "ERROR : Data NOT Saved";
                this.ShowAlert = true;
                console.log(errorResponse);
              }
            );
        } else {
          axios
            .put(
              "http://" + server.IP + ":" + server.port + "/editabsentday",
              StudentAbsent
            )
            .then(
              data => {
                this.AbsentStudent.AbsentDate = "";
                this.AbsentStudent.ReasonNo = 0;
                this.AbsentStudent.Remarks = "";
                this.fetchAbsentDays(this.SY, this.StudentNo);
                // this.AlertMSG = "Data Saved";
                // this.ShowAlert = true;
                this.operation = "Save";
              },
              errorResponse => {
                this.AlertClass = "alert alert-danger alert-dismissible";
                this.AlertMSG = "ERROR : Data NOT Saved";
                this.ShowAlert = true;
                console.log(errorResponse);
              }
            );
        }
      }
    },
    showabcentday(AbsentDay) {
      this.AbsentStudent.AbsentDate = AbsentDay.AbsentDay;
      this.AbsentStudent.ReasonNo = AbsentDay.ReasonNo;
      this.AbsentStudent.Remarks = AbsentDay.Remarks;
      this.operation = "Update";
    },
    delteabcentday(AbsentDay) {
      // var del_StudentAbsent = {
      //   AbsentDay: AbsentDay.AbsentDay,
      //   SY: AbsentDay.SY,
      //   GroupNo: AbsentDay.GroupNo,
      //   SchoolNo: AbsentDay.SchoolNo,
      //   SectionNo: AbsentDay.SectionNo,
      //   DepartmentNo: AbsentDay.DepartmentNo,
      //   GradeNo: AbsentDay.GradeNo,
      //   ClassNo: AbsentDay.ClassNo,
      //   StudentNo: AbsentDay.StudentNo
      // };

      axios
        .delete(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/deleteabsentday/" +
            AbsentDay.SY +
            "/" +
            this.GroupNo +
            "/" +
            this.SchoolNo +
            "/" +
            AbsentDay.SectionNo +
            "/" +
            AbsentDay.DepartmentNo +
            "/" +
            AbsentDay.GradeNo +
            "/" +
            AbsentDay.ClassNo +
            "/" +
            AbsentDay.StudentNo +
            "/" +
            AbsentDay.AbsentDay
        )
        .then(
          () => {
            this.fetchAbsentDays(this.SY, this.StudentNo);
          },
          errorResponse => {
            this.AlertClass = "alert alert-danger alert-dismissible";
            this.AlertMSG = "ERROR : Error Deleting Data";
            this.ShowAlert = true;
            console.log(errorResponse);
          }
        );
    },
    fetchReasons(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/listreasons/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Reasons = data.data;
            this.Reasons.forEach( Reason => {
              if (Reason.ReasonName.includes("Without")) {
                this.AbsentStudent.ReasonNo = Reason.ReasonNo;
              }
            })
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    fetchAbsentDays(SY, StudentNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentabsent/" +
            SY +
            "/" +
            StudentNo
        )
        .then(
          data => {
            this.AbsentDays = data.data;
            this.NumberofDays = data.data.length;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchReasons(this.GroupNo, this.SchoolNo);
    this.fetchAbsentDays(this.SY, this.StudentNo);
    // this.AbsentStudent.AbsentDate = String(new Date().getFullYear()) +"-"+ String(new Date().getMonth()) +"-" + String(new Date().getDay())
  }
};
</script>

<style scoped>
h2 {
  /* align : center; */
  /* /* margin-top: 5px; */
  margin-bottom: 20px;
  color: #047c14;
}
.modal-header {
  padding: 5px;
  margin-bottom: 0px;
}
#MyTable {
  overflow-y:scroll;
  height:300px
}

label {
  color: #047c14;
}


</style>