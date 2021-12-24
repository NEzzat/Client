<template>
  <div class="container">
    <h2 align="center">
      <span class="badge card-header bg-success mt-0">School Group</span>
    </h2>
    <form class="row g-3 mt-3">
      <div class="col-md-8">
        <label for="EName">Group Name</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="Group.GroupName"
            id="EName"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-12">
          <button
            v-on:click.prevent="SaveGroup()"
            class="btn btn-primary btn-lg"
          >
            {{ operation }}
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <table
          class="table table-md table-bordered table-success table-striped tableFixHead"
          id="MyTable"
        >
          <thead>
            <tr class="d-flex">
              <th class="col-1 text-center">#</th>
              <th class="col-8 text-center">Groups</th>
              <th class="col-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="d-flex"
              v-for="Group in Groups"
              v-bind:key="Group.GroupNo"
            >
              <td class="col-1 text-center">{{ Group.GroupNo }}</td>
              <td class="col-8 text-center">{{ Group.GroupName }}</td>
              <div class="btn-group col-3" role="group">
                <td
                  class="btn btn-success"
                  v-on:click.prevent="showEditGroup(Group)"
                >
                  Update
                </td>
                <td
                  class="btn btn-danger "
                  v-on:click.prevent="DeleteGroup(Group)"
                >
                  Delete
                </td>
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
  name: "SchoolGroup",
  data() {
    return {
      Group: { GroupNo: "", GroupName: "" },
      operation: "Save",
      Groups: [],
    };
  },
  methods: {
    SaveGroup() {
      if (this.operation === "Save") {
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addgroup/",
            this.Group
          )
          .then(
            () => {
              this.Group.GroupNo = "";
              this.Group.GroupName = "";
              this.fetchGroups();
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Group = {
          GroupNo: this.Group.GroupNo,
          GroupName: this.Group.GroupName,
        };
        axios
          .put("http://" + server.IP + ":" + server.port + "/editgroup/", {
            Group: upd_Group,
          })
          .then(
            (data) => {
              this.Group.GroupNo = "";
              this.Group.GroupName = "";
              this.operation = "Save";
              this.fetchGroups();
            },
            (errorResponse) => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteGroup(GroupInfo) {
      this.$confirm("Are you sure?", "Delete " + GroupInfo.GroupName, "warning")
        .then((e, reject) => {
          if (e) {
            axios
              .delete(
                "http://" +
                  server.IP +
                  ":" +
                  server.port +
                  "/deleteGroup/" +
                  GroupInfo.GroupNo
              )
              .then(
                () => {
                  this.fetchGroups();
                },
                (errorResponse) => {
                  this.$alert(
                    "Make Sure No Schools Is Defined Under this Group",
                    "Error Delete Group",
                    "error"
                  );
                }
              );
          }
        })
        .catch(() => {
          return;
        });
    },

    showEditGroup(Group) {
      this.Group.GroupNo = Group.GroupNo;
      this.Group.GroupName = Group.GroupName;
      this.operation = "Update";
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
  },

  created: function() {
    this.fetchGroups();
  },
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
#MyTable {
  overflow-y: scroll;
  height: 250px;
}
.tableFixHead          { overflow: auto; height: 250px; }
</style>
