<template>
  <div class="container">
  <div class="row gx-3">
    <div class="col">
      <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
    </div>
    <div class="col">
      <h2 align="center"><span  class="badge card-header bg-success mt-0">Define working Days</span></h2>
    </div>
    <div class="col">
      <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
    </div>      
  </div>    
  <form class="row g-3 ">    
    <EditWorkingDay
          v-if="showModal"
          v-bind:SY="WorkingDay.SY"
          v-bind:GroupNo="WorkingDay.GroupNo"
          v-bind:SchoolNo="WorkingDay.SchoolNo"
          v-bind:SectionNo="WorkingDay.SectionNo"
          v-bind:DepartmentNo="WorkingDay.DepartmentNo"
          v-bind:GradeNo="WorkingDay.GradeNo"
          v-bind:GradeName="GradeName"
          v-bind:working="WorkingDay.working"
          v-on:close-working="showModal= false;fetchWorkingDays(WorkingDay.SY,GroupNo,SchoolNo)"
        ></EditWorkingDay>

    <div class="col-md-2">
      <label for="SY">School Year</label>
      <select v-model="WorkingDay.SY" @change="fetchWorkingDays(WorkingDay.SY,GroupNo,SchoolNo)" class="form-select col-2" id="SY" >
        <option v-for="sy in SY" v-bind:value="sy.SY" :key="sy.SY">{{sy.SY}}</option>
      </select>
    </div>
    <div class="col-md-3">
      <label for="days">Working Days</label>
      <input
        type="number"
        class="form-control"
        v-model="WorkingDay.working"
        placeholder="Working Days"
        id="days"
      />
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <button
            v-on:click.prevent="SaveWorkingDays()"
            class="btn btn-primary btn-lg"
          >{{operation}}</button>
        </div>
      </div>

      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-2 text-center">Section</th>
            <th class="col-3 text-center">Dept.</th>
            <th class="col-2 text-center">Grade.</th>
            <th class="col-3 text-center">Days</th>
            <th class="col-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="WorkingDay in WorkingDays" :key="WorkingDay.Grade">
            <td class="col-2 text-center">{{WorkingDay.SectionName}}</td>
            <td class="col-3 text-center">{{WorkingDay.DepartmentName}}</td>
            <td class="col-2 text-center">{{WorkingDay.Grade}}</td>
            <td class="col-3 text-center">{{WorkingDay.working}}</td>
            <div class="btn-group col-2" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEdit(WorkingDay)">Update </td>
            </div>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
import EditWorkingDay from "@/components/EditWorkingDay";
import SY from "../mixins/SYmixin";
import { mapState } from "vuex";
export default {
  mixins: [SY],
  components: {
    EditWorkingDay,
  },
  data() {
    return {
      operation: "Save",
      showModal: false,
      WorkingDay: {
        SY: "",
        GroupNo: 1,
        SchoolNo: 0,
        SectionNo: 0,
        DepartmentNo: 0,
        GradeNo: 0,
        working: 0,
      },
      GradeName: "",
      Groups: [],
      Schools: [],
      Grades: [],
      WorkingDays: [],
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  }, 
  methods: {
    SaveWorkingDays() {
      if (this.operation === "Save") {
        this.Grades.forEach((grade) => {
          let new_working = {
            SY: this.WorkingDay.SY,
            GroupNo: this.WorkingDay.GroupNo,
            SchoolNo: this.WorkingDay.SchoolNo,
            SectionNo: grade.SectionNo,
            DepartmentNo: grade.DepartmentNo,
            GradeNo: grade.GradeNo,
            working: this.WorkingDay.working,
          };
          //   const test = async () => {
          this.SaveWorkingDay(new_working).then(
            this.fetchWorkingDays(
              this.WorkingDay.SY,
              this.GroupNo,
              this.SchoolNo
            )
          );
        });
      } else {
        this.Grades.forEach((grade) => {
          let upd_working = {
            SY: this.WorkingDay.SY,
            GroupNo: this.GroupNo,
            SchoolNo: this.SchoolNo,
            SectionNo: grade.SectionNo,
            DepartmentNo: grade.DepartmentNo,
            GradeNo: grade.GradeNo,
            working: this.WorkingDay.working,
          };
          this.UpdateWorkingDay(upd_working).then(
            this.fetchWorkingDays(
              this.WorkingDay.SY,
              this.GroupNo,
              this.SchoolNo
            )
          );
        });
      }
      this.WorkingDay.working = 0;
    },

    async SaveWorkingDay(Myday) {
      try {
        return await axios.post(
          "http://" + server.IP + ":" + server.port + "/addworkingday",
          Myday
        );
      } catch (error) {
        console.error(error);
      }
    },
    async UpdateWorkingDay(Myday) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/editworkingday",
          Myday
        );
      } catch (error) {
        console.error(error);
      }
    },
    showEdit(WorkingDayinfo) {
      // showstudentAccounts(Studentinfo) {
      this.WorkingDay.SY = WorkingDayinfo.SY;
      this.WorkingDay.GroupNo = WorkingDayinfo.GroupNo;
      this.WorkingDay.SchoolNo = WorkingDayinfo.SchoolNo;
      this.WorkingDay.SectionNo = WorkingDayinfo.SectionNo;
      this.WorkingDay.DepartmentNo = WorkingDayinfo.DepartmentNo;
      this.WorkingDay.GradeNo = WorkingDayinfo.GradeNo;
      this.GradeName = WorkingDayinfo.Grade;
      this.WorkingDay.working = WorkingDayinfo.working;
      this.showModal = true;
    },


    fetchGrades(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/schoolgrades/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.Grades = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
    fetchWorkingDays(sy, group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getworkingdays/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.WorkingDays = data.data;
            if (this.WorkingDays.length > 0) {
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
  },
  created: function () {
    this.fetchGrades(this.GroupNo,this.SchoolNo);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5 {
  color: #047c14;
}
label {
  /* margin-left: 5px; */
  /* margin-top: 5px; */
  color: #047c14;
}
</style>
