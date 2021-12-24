<template>
  <div class="container-fluid">
    <div class="form-group row">
      <form>
        <div class="col-md-1">
          <label for="academicYear">A/Y</label>
        </div>
        <div class="col-md-2">
          <select id="academicYear" class="form-control input" v-model="SY">
            <option v-for="SY in syyears" v-bind:value="SY.SY" v-bind:key="SY.SY">{{SY.SY}}</option>
           </select>
        </div>
        <div class="col-md-1">
          <label for="Group">Group</label>
        </div>
        <div class="col-md-2">
          <select
            id="Group"
            v-on:click="fetchSchools(GroupNo)"
            class="form-control input"
            v-model="GroupNo"
          >
            <option
              v-for="Group in Groups"
              v-bind:value="Group.GroupNo"
              :key="Group.GroupNo"
            >{{Group.GroupName}}</option>
          </select>
        </div>        
        <div class="col-md-1">
          <label for="school">School</label>
        </div>
        <div class="col-md-3">
          <select
            id="school"
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
    
    <div class="row">
      <div class="col-md-4">
        <h4 >Counts / Grade</h4>
        <ChartGrade
          v-bind:SY="SY"
          v-bind:GroupNo="GroupNo"
          v-bind:SchoolNo="SchoolNo">
        </ChartGrade>
      </div>
      <div class="col-md-4">
        <h4>Absent / Grade</h4>
          <ChartAbsent
              v-bind:SY="SY"
              v-bind:SchoolNo="SchoolNo">
            </ChartAbsent>
      </div>
       <div class="col-md-4">
         <h4>Discount Groups</h4>
            <ChartGroupDiscount
             v-bind:SY="SY"
              v-bind:SchoolNo="SchoolNo">
            </ChartGroupDiscount>         
       </div>
      </div>
    <!-- <UpdateDiscount /> -->
  </div>
</template>


<script>
import axios from "axios";
import server from "../server";
// import SYs from "../mixins/SYmixin";
// import Groups from "../mixins/Groupmixin";
import ChartGrade from "./ChartGrade";
import ChartAbsent from "./ChartAbsent";
import ChartGroupDiscount from "./ChartGroupDiscount";
export default {
  name: "Home",
  // mixins: [SYs, Groups],  
  components: {
    ChartGrade,
    ChartAbsent,
    ChartGroupDiscount
  },
  data() {
    return {
      loaded: false,
      syyears: [],
      SY :"2020/2021",
      Groups:[],
      Schools: [],
      // Grades: [{ Grade: "PYP4", Count_StudentNo: 19 }],
      GroupNo: 2,
      SchoolNo: 1,
    };
  },
  methods: {
    fetchSY() {
      axios.get("http://" + server.IP + ":" + server.port + "/listsy/").then(
        (data) => {
          this.syyears = data.data;
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
    },

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
          data => {
            this.AbsentDays = data.data;
            this.barinfo.data = this.AbsentDays.map(
              Myday => Myday.Count_Student
            );
            this.barinfo.labels = this.AbsentDays.map(Myday => Myday.AbsentDay);
            console.log(this.barinfo.data);
            console.log(this.barinfo.labels);
            this.loaded = true;
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
    fetchGroups() {
      axios.get("http://" + server.IP + ":" + server.port + "/groups").then(
        (data) => {
          this.Groups = data.data;
        },
        (errorResponse) => {
          console.log(errorResponse);
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
          data => {
            this.chartData.data = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },
  created: function () {
    this.fetchSY();
    this.fetchGroups();
    this.fetchSchools(this.GroupNo);
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h4 {
  /* margin-top: 5px;*/
  margin-bottom: 0px; 
  color: #b4060f;
}
</style>
