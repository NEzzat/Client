<template>
<div class="container">
  <h2 align="center"><span  class="badge card-header bg-success mt-0">Define Documents</span></h2>
  <form class="row mt-3">
    <!-- <div class="form-group row"> -->
      <div class="col-md-1">
        <label for="serial">Serial</label>
      </div>
      <div class="col-md-2">
        <input type="number" id="serial" v-model = "STUDocument.Serial" class="form-control">
      </div>
      <div class="col-md-1">
        <label for="doc">Document</label>
      </div>
      <div class="col-md-5">
        <input type="text" id="doc" class="form-control" v-model = "STUDocument.DocumentName" placeholder="Enter Document Name">
      </div>
      <div class="col-md-1">
        <label for="Weight">Weight</label>
      </div>
      <div class="col-md-2">
        <input type="number" id="Weight" class="form-control" v-model = "STUDocument.Wieght">
      </div>
    <div class="row mt-3">
      <div class="col-md-12 ">
        <button v-on:click.prevent="SaveDocument()" class="btn btn-primary btn-lg">{{operation}}</button>
      </div>
    </div>
    <div class="row mt-3">
      <table class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">#</th>
            <th class="col-6 text-center">Document</th>
            <th class="col-2 text-center">Weight</th>
            <th class="col-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody >
          <tr class="d-flex" v-for="STUDocument in Documents" v-bind:key="STUDocument.Serial">
            <td class="col-1 text-center">{{STUDocument.Serial}}</td>
            <td class="col-6 text-center">{{STUDocument.DocumentName}}</td>
            <td class="col-2 text-center">{{STUDocument.Wieght}}</td>
            <div class="btn-group col-3" role="group">
            <td class="btn btn-success" v-on:click.prevent="showEditDocument(STUDocument)">Update </td>
            <td class="btn btn-danger " v-on:click.prevent="DeleteDocument(STUDocument)">Delete </td>
            </div>
          </tr>
        </tbody>
      </table>
      <!-- </div> -->
    </div>
  </form>
  </div>    
</template>

<script>
import axios from "axios";
import server from "../server";
export default {
  data() {
    return {
      operation: "Save",
      STUDocument: {
        Serial: 0,
        DocumentName: "",
        Wieght: 0
      },
      Documents: []
    };
  },

  methods: {
    SaveDocument() {
      if (this.operation === "Save") {
        let new_Document = {
          Serial: this.STUDocument.Serial,
          DocumentName: this.STUDocument.DocumentName,
          Wieght:this.STUDocument.Wieght
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/adddocument",
            new_Document
          )
          .then(
            data => {
              this.STUDocument.Serial = 0;
              this.STUDocument.DocumentName = "";
              this.STUDocument.Wieght = 0
              this.fetchDocuments();
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      } else {
        let upd_Document = {
          Serial: this.STUDocument.Serial,
          DocumentName: this.STUDocument.DocumentName,
          Wieght:this.STUDocument.Wieght
        };
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editdocument/",
            upd_Document
          )
          .then(
            data => {
              this.STUDocument.Serial = 0;
              this.STUDocument.DocumentName = "";
              this.STUDocument.Wieght = 0
              this.operation = "Save";
              this.fetchDocuments();
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );
      }
    },
    DeleteDocument(DocumentInfo) {
      this.$confirm("Are you sure?","Delete "+DocumentInfo.DocumentName,"warning").then((e,reject) => {
        if (e) {
          axios.delete("http://" + server.IP + ":" + server.port + "/deletedocument/"+DocumentInfo.Serial).then(
            () => {
              this.fetchDocuments();
            },
            errorResponse => {
              this.$alert("Make Sure Document is Not assigned to any Student","Error Delete Document","error");
            }
          );
        }
      }).catch(() => {
        return
      })
    },
   
    showEditDocument(DocumentInfo) {
      this.STUDocument.DocumentName = DocumentInfo.DocumentName;
      this.STUDocument.Wieght = DocumentInfo.Wieght;
      this.STUDocument.Serial = DocumentInfo.Serial;
      this.operation = "Update";
    },
    fetchDocuments() {
      axios.get("http://" + server.IP + ":" + server.port + "/documents/").then(
        data => {
          this.Documents = data.data;
        },
        errorResponse => {
          console.log("err :" + errorResponse);
        }
      );
    }
  },
  created: function() {
    this.fetchDocuments();
  }
};
</script>

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
/* thead {
  color: #047c14;
} */

/* .table-striped > tbody > tr:nth-of-type(odd) {
  color: #047c14;
}
.table-striped > tbody > tr:nth-of-type(even) {
  color: #023b09;
} */
</style>