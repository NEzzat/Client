<template>
  <!-- <div class="container-fluid"> -->
      <!-- <div class="col-md-4"> -->
        <v-chart v-bind:chartData="DiscountData"></v-chart>
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
      DiscountData: {
        chartType: "pieChart",
        selector: "Discount",
        // legends: {
        //     enabled: true,
        //     height: 25,
        //     width: 50,
        // },        
        width: 400,
        height: 400,
        metric: "Sum_DiscountValue",
        dim: "DiscountGroupName",
        data: [{ DiscountGroupName: "", Sum_DiscountValue: 0 }]
      }
    };
  },
  watch: {
    SchoolNo: function (val) {
       
        this.fetchDiscountGroupValues(this.SY, val)
    },
    SY: function (val) {
        this.fetchDiscountGroupValues(val,this.SchoolNo)
    }
  },
  methods: {
    fetchDiscountGroupValues(sy, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/DiscountGroups/" +
            sy +
            "/" +
            school
        )
        .then(
          data => {
                this.DiscountData.data = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function() {
    this.fetchDiscountGroupValues(this.SY, this.SchoolNo);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
