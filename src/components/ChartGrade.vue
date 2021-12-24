<template>
  <!-- <div class="mt-5" > -->
   <v-chart v-bind:chartData="chartData"></v-chart>     
</template>


<script>
import axios from "axios";
import server from "../server";
// import UpdateDiscount from "./UpdateDiscount";

export default {
  name: "Home",
  // components: {
  //   UpdateDiscount
  // },
  props: [
    "SY",
    "GroupNo",
    "SchoolNo",
  ],  
  data() {
    return {
      canvas: null,
      chartData: {
        chartType: "barChart",
        selector: "Grde",
        overrides: {
           margins: {top: 10}
        },        
        width: 400,
        height: 400,
        metric: "Count_StudentNo",
        dim: "Grade",
        data: [{ Grade: "", Count_StudentNo: 0 }]
      }
    };
  },
  watch: {
    SchoolNo: function (val) {
        this.fetchStudentsGrade(this.SY,this.GroupNo, val)
    },
    SY: function (val) {
        this.fetchStudentsGrade(val,this.GroupNo, this.SchoolNo)
    }
  },
  methods: {
    // GetMonthlyAbsent(SY, MonthNo, SchoolNo) {
    //   axios
    //     .get(
    //       "http://" +
    //         server.IP +
    //         ":" +
    //         server.port +
    //         "/getmonthlyabsent/" +
    //         SY +
    //         "/" +
    //         MonthNo +
    //         "/" +
    //         SchoolNo
    //     )
    //     .then(
    //       data => {
    //         this.AbsentDays = data.data;
    //         this.barinfo.data = this.AbsentDays.map(
    //           Myday => Myday.Count_Student
    //         );
    //         this.barinfo.labels = this.AbsentDays.map(Myday => Myday.AbsentDay);
    //         console.log(this.barinfo.data);
    //         console.log(this.barinfo.labels);
    //         this.loaded = true;
    //       },
    //       errorResponse => {
    //         console.log(errorResponse);
    //       }
    //     );
    // },
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
          data => {
                this.chartData.data = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchStudentsGrade(this.SY, this.GroupNo, this.SchoolNo);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-barChart {
     margin-top: 10px; 
  }
</style>
