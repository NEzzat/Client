<template>
<div class="container">
  <h2 align="center"><span  class="badge card-header bg-success mt-0">Define School Sections</span></h2>
  <form class="row g-3 ">
    <div class="col-md-3">
      <label for="Group">Group</label>
      <select v-model="Section.GroupNo" @change="fetchSchools(Section.GroupNo)" class="form-select col-2" id="Group">
        <option v-for="Group in Groups" v-bind:value="Group.GroupNo" :key="Group.GroupNo">{{Group.GroupName}}</option>
      </select>
    </div>    
    <div class="col-md-4">
      <label for="School">School</label>
      <select v-model="Section.SchoolNo" @change="fetchSection(Section.GroupNo,Section.SchoolNo)" class="form-select col-2" id="School">
        <option v-for="School in Schools" v-bind:value="School.SchoolNo" :key="School.SchoolNo">{{School.SchoolName}}</option>
      </select>
    </div>  
    <div class="col-md-4">
      <label for="Section">Section Name</label>
      <div class="input-group">  
        <input
          type="text"
          class="form-control"
          v-model="Section.SectionName"
          id="Section"
        />
      </div>
    </div>   
      <div class="row mt-2">
        <div class="col-md-12">
          <button  v-on:click.prevent="SaveSection()" class="btn btn-primary btn-lg">{{operation}}</button>
        </div>      
      </div> 
      <div class="row mt-3">
        <table class="table table-md table-bordered table-success table-striped">
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-8 text-center">Sections</th>
              <th class="col-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody >
            <tr class="d-flex" v-for="Section in Sections" v-bind:key="Section.SectionNo">
              <td class="col-1 text-center">{{Section.SectionNo}}</td>
              <td class="col-8 text-center">{{Section.SectionName}}</td>
              <div class="btn-group col-3" role="group">
              <td class="btn btn-success" v-on:click.prevent="showEditSection(Section)">Update </td>
              <td class="btn btn-danger " v-on:click.prevent="DeleteSection(Section)">Delete </td>
              </div>
            </tr>
          </tbody>
        </table>
      </div>        
  </form>
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";

export default {
  name: "Dept",
  data() {
    return {
      operation: "Save",
      Section: { GroupNo: 0, SchoolNo: 0, SectionNo: 0, SectionName: "" },
      Groups: [],
      Schools: [],
      Sections: []
    };
  },

  methods: {
    SaveSection() {
      if (this.operation === "Save") {
        let new_Section = {
          GroupNo: this.Section.GroupNo,
          SchoolNo: this.Section.SchoolNo,
          SectionName: this.Section.SectionName
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addsections",
            new_Section
          )
          .then(() => {
              this.Section.SectionName = "";
              this.fetchSection(this.Section.GroupNo, this.Section.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          )
      } else {
        let upd_section = {
          GroupNo: this.Section.GroupNo,
          SchoolNo: this.Section.SchoolNo,
          SectionNo: this.Section.SectionNo,
          SectionName: this.Section.SectionName
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editsections/",
            upd_section
          )
          .then(
            data => {
              this.Section.SectionName = "";
              this.operation = "Save";
              this.fetchSection(this.Section.GroupNo, this.Section.SchoolNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteSection(SectionInfo) {
      this.$confirm("Are you sure?","Delete "+SectionInfo.SectionName,"warning").then((e,reject) => {
        if (e) {
          axios.delete("http://" + server.IP + ":" + server.port + "/deletesection/" + 
          this.Section.GroupNo +
          "/" +
          this.Section.SchoolNo +
          "/" +
          SectionInfo.SectionNo)
          .then(
            () => {
              this.fetchSection(this.Section.GroupNo, this.Section.SchoolNo);
            },
            errorResponse => {
              this.$alert("Make Sure No Departments Is Defined Under this Section","Error Delete Section","error");
            }
          );
        }
      }).catch(() => {
        return
      })
    },
    showEditSection(Section) {
      this.Section.SectionNo = Section.SectionNo;
      this.Section.SectionName = Section.SectionName;
      this.operation = "Update";
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
    fetchSection(group, school) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/listsections/" +
            group +
            "/" +
            school
        )
        .then(
          data => {
            this.Sections = data.data;
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
    }
  },
  created: function() {
    this.fetchGroups();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  /* align : center; */
  margin-top: 5px;
  margin-bottom: 20px;
  color: #047c14;
}
label {
  margin-left: 5px;
  margin-top: 5px;
  color: #047c14;
}
thead {
  color: #047c14;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  color: #047c14;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #023b09;
}
</style>
