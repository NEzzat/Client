<template> 
<transition name="modal">
 <div class="modal modal-mask" style="display: block">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
          <strong>SY :</strong>{{SY}} <strong>Grade :</strong>{{GradeName}}
      </div>
      <div class="modal-body">
        <div v-if="ShowAlert" v-bind:class="AlertClass" role="alert">
          <strong>{{AlertMSG}}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="col-md-6">
          <label id="working">Working Days</label>
          <input type="number" class="form-control" v-model = "workingdays" placeholder="Working Days" id="working">
        </div>        
      </div>
      
      <div class="modal-footer">
          <button type="button" class="btn btn-outline-info" @click="$emit('close-working')"> Close </button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateworking" >
            Save
          </button>
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
    "GradeName",
    "working"
  ],
  data() {
    return {
      AlertClass: "alert alert-success alert-dismissible",
      AlertMSG: "",
      ShowAlert: false,
      workingdays: 0,
      WorkingDay: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        working: 0
      }
    };
  },
  methods: {
    updateworking() {
      var upd_working = {
        SY: this.SY,
        GroupNo: this.GroupNo,
        SchoolNo: this.SchoolNo,
        SectionNo: this.SectionNo,
        DepartmentNo: this.DepartmentNo,
        GradeNo: this.GradeNo,
        working: this.workingdays
      };
      axios
        .put(
          "http://" + server.IP + ":" + server.port + "/editworkingday",
          upd_working
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
    }
  },

  created: function() {
    this.workingdays = this.working;
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
.totalfee {
  margin-left: 188px;
  color: red;
  font-weight: bold;
}
.totaldiscount {
  margin-left: 55px;
  color: red;
  font-weight: bold;
}
.totalnet {
  margin-left: 95px;
  color: red;
  font-weight: bold;
}
</style>
