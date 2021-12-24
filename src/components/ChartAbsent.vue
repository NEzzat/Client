<template>
  <!-- <div class="container-fluid"> -->
      <!-- <div class="col-md-4"> -->
        <v-chart v-bind:chartData="AbsentData"></v-chart>
      <!-- </div> -->
  <!-- </div> -->
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
      AbsentData: {
        chartType: "pieChart",
        selector: "Absent",
        // legends: {
        //     enabled: true,
        //     height: 25,
        //     width: 50,
        // },        
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
       
        this.fetchAbsentGrade(this.SY, val)
    },
    SY: function (val) {
        this.fetchAbsentGrade(val,this.SchoolNo)
    }
  },
  methods: {
    fetchAbsentGrade(sy, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/GradAbsent/" +
            sy +
            "/" +
            school
        )
        .then(
          data => {
                this.AbsentData.data = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchAbsentGrade(this.SY, this.SchoolNo);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
