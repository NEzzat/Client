<template>
  <transition name="modal">
    <div class="modal modal-mask" style="display: block">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <strong>List Students By Name</strong>
            <button type="button" class="btn btn-outline-info" @click="$emit('close-Student')">Close</button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">      
              <div id="dsTable" >              
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>الاسم</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="Student in Students" :key="Student.StudentNo" >
                      <td>{{Student.StudentNo}}</td>
                      <td>{{Student.Student_name}}</td>
                      <td>{{Student.Student_Arabic_name}}</td>
                      <td class="btn btn-warning" v-on:click.prevent="GetStudentID(Student)">Select</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-outline-info" @click="$emit('close-Student')"> Close </button> -->
            <!-- <button type="button" class="btn btn-primary" data-dismiss="modal" @click="savestudentfee" >
            Save
            </button>-->
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
  props: ["Student_name","Student_Arabic_name", "Parent_Module","Lang","Scoped","SchoolNo"],
  data() {
    return {
      Students: []
    };
  },
  methods: {
    fetchStudentsByName(Student_name) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/fetchStudentsByName/" +
            Student_name +
            "/" +
            this.Lang +
            "/" +
            this.Scoped + 
            "/" +
            this.SchoolNo
        )
        .then(
          data => {
            this.Students = data.data;
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    GetStudentID(Student) {
      if (this.Parent_Module === "StudentParent") {
        this.$parent.StudentParent.StudentNo = Student.StudentNo;
      } else {
        this.$parent.StudentInfo.StudentNo = Student.StudentNo;
      }
      this.$emit("close-Student");
    }
  },
  created: function() {
    if (this.Lang === "E") {
      this.fetchStudentsByName(this.Student_name);
    } else {
      this.fetchStudentsByName(this.Student_Arabic_name);
    }
  }
};
</script>

<style scoped>
.col-md-12 {
    height: 560px;
    overflow-y: scroll;
    padding: 0px 0px;
}

#dsTable {
    padding: 0px 0px;
    width: 100%;
}

</style>
