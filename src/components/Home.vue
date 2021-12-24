<template>
  <div class="container">
    <h1>Home</h1>
    <!-- <div class="form-group row">
      <form>
        <div class="col-md-1">
          <label for="academicYear">A/Y</label>
        </div>
        <div class="col-md-2">
          <select id="academicYear" class="form-control input" v-model="SY">
            <option v-for="sy in syyears" :key="sy" v-bind:value="sy">{{sy}}</option>
          </select>
        </div>
        <div class="col-md-1">
          <label for="school">School</label>
        </div>
        <div class="col-md-3">
          <select
            id="school"
            v-on:change="fetchStudentsGrade(SY,2,SchoolNo)"
            class="form-control input"
            v-model="SchoolNo"
          >
            <option
              v-for="school in Schools"
              v-bind:value="school.SchoolNo"
              :key="school.SchoolNo"
            >{{school.SchoolName}}</option>
          </select>
        </div>
      </form>
    </div>
    <div class="form-group row">
      <div class="col-md-4">
        <v-chart v-bind:chartData="chartData"></v-chart>
      </div>
    </div>
    <UpdateDiscount />-->
  </div>
</template>


<script>
import axios from "axios";
import server from "../server";

// import UpdateDiscount from "./UpdateDiscount";

export default {
  name: "Home",
  // components: {
  //   Login,
  // },
  data() {
    return {
      loaded: false,

      Schools: [],
      // Grades: [{ Grade: "PYP4", Count_StudentNo: 19 }],
      SY: "2018/2019",
      GroupNo: 2,
      SchoolNo: 1,
      syyears: ["2018/2019", "2019/2020", "2020/2021"],
      chartData: {
        chartType: "barChart",
        selector: "chart",
        title: "Number of Student / Grades",
        width: 400,
        height: 300,
        metric: "Count_StudentNo",
        dim: "Grade",
        data: [{ Grade: "", Count_StudentNo: 0 }],
      },
    };
  },
  methods: {
    GetMonthlyAbsent(SY, MonthNo, SchoolNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getmonthlyabsent/" +
            SY +
            "/" +
            MonthNo +
            "/" +
            SchoolNo
        )
        .then(
          (data) => {
            this.AbsentDays = data.data;
            this.barinfo.data = this.AbsentDays.map(
              (Myday) => Myday.Count_Student
            );
            this.barinfo.labels = this.AbsentDays.map(
              (Myday) => Myday.AbsentDay
            );
            console.log(this.barinfo.data);
            console.log(this.barinfo.labels);
            this.loaded = true;
          },
          (errorResponse) => {
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
          (data) => {
            this.Schools = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
    fetchStudentsGrade(sy, group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentsbygrade/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          (data) => {
            this.chartData.data = data.data;
          },
          (errorResponse) => {
            console.log("err :" + errorResponse);
          }
        );
    },
  },
  created: function () {
    // this.fetchSchools(2);
    // this.fetchStudentsGrade(this.SY, this.GroupNo, this.SchoolNo);
    if (!sessionStorage.getItem("UserNo")) {
      this.ShowLogin = true;
    } else {
      this.ShowLogin = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
