<template>
  <div class="container">
    <div class="form-group row">
      <div class="col-md-1">
        <label for="academicYear">A/Y</label>
      </div>
      <div class="col-md-2">
        <select id="academicYear" class="form-control input" v-model="SY">
          <option v-for="sy in SYs" v-bind:value="sy" v-bind:key="sy">{{sy}}</option>
        </select>
      </div>
      <div class="col-md-1">
        <label for="Group">Group</label>
      </div>
      <div class="col-md-3">
        <select
          id="Group"
          v-on:change="fetchSchools(GroupNo)"
          class="form-control input"
          v-model="GroupNo"
        >
          <option
            v-for="Group in Groups"
            v-bind:value="Group.GroupNo"
            v-bind:key="Group.GroupNo"
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
          v-on:change="fetchStudents(SY,GroupNo,SchoolNo)"
        >
          <option
            v-for="school in Schools"
            v-bind:value="school.SchoolNo"
            v-bind:key="school.SchoolNo"
          >{{school.SchoolName}}</option>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <button
        type="button"
        :disabled="Disabled"
        @click="Updatestudentinfo()"
        class="btn btn-outline-info btn-primary"
      >Update Student Info.</button>
    </div>
    <div class="form-group row center">
      <h4>{{Nooftudents}} / {{CurrentStudent}}</h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  data() {
    return {
      Disabled: true,
      Nooftudents: 0,
      CurrentStudent: 0,
      SYs: ["2018/2019", "2019/2020", "2020/2021"],
      SY: "",
      GroupNo: 0,
      SchoolNo: 0,
      SectionNo: 0,
      DepartmentNo: 0,
      GradeNo: 0,
      ClassNo: 0,
      Groups: [],
      Schools: [],
      Students: [],
      BranchNo: 0
    };
  },
  methods: {
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
        data => {
          this.Groups = data.data;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    },
    fetchStudents(sy, group, school) {
     
      for (var School of this.Schools) {
        if (School.SchoolNo === school) {
          this.BranchNo = School.BranchNo;
        }
      }
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/liststudentsschool/" +
            sy +
            "/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Disabled = false;
            this.CurrentStudent = 0;
            this.Nooftudents = data.data.length;
            this.Students = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },

    async Updatestudentinfo() {
      this.CurrentStudent = 0;
      for (const Student of this.Students) {
        this.CurrentStudent++;
        var Studentinfo = {
          GroupNo: Student.GroupNo,
          partner_id: Student.partner_id,
          section_no: Student.SectionNo,
          department_no: Student.DepartmentNo,
          grade_no: Student.GradeNo,
          class_no: Student.ClassNo,
          student_no: Student.StudentNo,
          name: Student.Student_name,
          display_name: Student.Student_name,
          company_id: this.BranchNo
        };
        console.log(Studentinfo);
        var states = await this.UpdateERPStudentInfo(Studentinfo);
        console.log(states);
      }
      this.SchoolNo = 0;
      this.Disabled = true;
    },
    async UpdateERPStudentInfo(Studentinfo) {
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/upd_ERPStudentInfo/",
          Studentinfo
        );
      } catch (error) {
        console.error(error);
      }
    },
    async AddDiscountLineERP(Discount) {
      try {
        return await axios.post(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/post_Discount_line/" +
            Discount.StudentNo +
            "/" +
            Discount.DiscountPackageNo +
            "/" +
            Discount.DiscountPackageName +
            "/" +
            Discount.DiscountValue
        );
      } catch (error) {
        console.error(error);
      }
    }
  },
  created: function() {
    this.fetchGroups();
  }
};
</script>
<style>
.center {
  text-align: center;
}
</style>
