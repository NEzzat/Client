<template>
  <div class="container">
    <h2 align="center"><span  class="badge card-header bg-success ">Student Documents</span></h2>
    <form class="row ">
       <ListByName
        v-if="showModal"
        v-bind:Student_name="StudentInfo.Student_name"
        v-bind:Student_Arabic_name="StudentInfo.Student_Arabic_name"
        v-bind:Parent_Module="'StudenDoc'"
        v-bind:Lang="Lang"
        v-on:close-Student="showModal= false"
      ></ListByName>
      <div class="card" id="jumbo">
        <div class="card-body pt-0">
          <form class="row g-3">
            <div class="col-md-2">
              <div class="input-group mx-2">
                <input
                  type="text"
                  class="form-control "
                  placeholder="Student No."
                  v-model="StudentInfo.StudentNo"
                  id="Number"
                  aria-describedby="StudentNo"
                />
                <span
                  class="input-group-text"
                  id="StudentNo"
                  v-on:click.prevent="findstudent(StudentInfo.StudentNo);fetchStudentDocuments(StudentInfo.StudentNo)"
                  ><i class="bi bi-search"></i></span>            
              </div>
            </div>
            <div class="col-md-5">
              <div class="input-group">  
                <input
                  type="text"
                  class="form-control"
                  v-model="StudentInfo.Student_name"
                  placeholder="Student English Name"
                  id="Name"
                />
                <span class="input-group-text" v-on:click="ShowSearchModel('E')"><i class="bi bi-search"></i></span>
              </div>
            </div> 

            <div class="col-md-5">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="StudentInfo.Student_Arabic_name"
                  placeholder="Arabic Name"
                />
                <span class="input-group-text" v-on:click="ShowSearchModel('A')"><i class="bi bi-search"></i></span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-md-4">
          <h4>Available Documents</h4>
        </div>
        <div class="col-md-4">
          <h4 class="btn btn-warning" @click="SaveStudentDocument"
          >Documents To Assign <i class="bi bi-folder-plus"></i></h4>
        </div>
      </div>  
      <div class="row justify-content-between">
        <div class="col-md-4 ">
          <div class="list-group" id="MyList">
            <button v-for="Document in Documents" :key="Document.Serial"
             type="button" 
             @dblclick="AddDoc(Document)"
             class="list-group-item list-group-item-action list-group-item-success">
             {{Document.DocumentName}}
            </button>
          </div>        
        </div>
        <div class="col-md-4 position-relative">
          <div class="position-absolute top-0 start-50 translate-middle mt-4">
          <button type="button" @click="AddAll" class="btn btn-primary ">
            <i class="bi bi-chevron-double-right"></i>
          </button>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle">
          <button type="button" @click="RemoveAll" class="btn btn-primary">
            <i class="bi bi-chevron-double-left"></i>
          </button>
          </div>          
        </div>
        <div class="col-md-4">
          <div class="list-group" id="MyList">
            <button v-for="Document in NewDocuments" :key="Document.Serial"
              type="button" 
              @dblclick="RemoveDoc(Document)"
              class="list-group-item list-group-item-action list-group-item-success">
              {{Document.DocumentName}}
            </button>
          </div> 
        </div>               
      </div>
      <div class="row">
        <div class="col-md-12 text-center">
          <button
            v-on:click.prevent="UpdateDocuments()"
            class="btn btn-primary btn-lg"
            :disabled="Disabled"
          >Save</button>
        </div>        
      </div>
      <div id="MyTable" class="row mt-1">
      <table  class="table table-md table-bordered table-success table-striped">
        <thead>
          <tr class="d-flex">
            <th class="col-1 text-center">Serial</th>
            <th class="col-8 text-center">Document</th>
            <!-- <th class="col-1 text-center">Not Applicable</th> -->
            <th class="col-1 text-center">Original</th>
            <th class="col-1 text-center">Exist</th>
            <th class="col-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="d-flex" v-for="STUDocument in STUDocuments" :key="STUDocument.Serial">
            <td class="col-1 text-center">{{STUDocument.Serial}}</td>
            <td class="col-8 text-center">{{STUDocument.DocumentName}}</td>
            <!-- <td class="col-1 text-center"><input @click="Disabled = false" type="checkbox" v-model="STUDocument.NotApplicable"></td> -->
            <td class="col-1 text-center "><input @click="Disabled = false;STUDocument.Exist= 1" type="checkbox" v-model="STUDocument.Orginal"></td>
            <td class="col-1 text-center"><input @click="Disabled = false" type="checkbox" v-model="STUDocument.Exist"></td>
            <td class="col-1 text-center"><span @click="DeleteStudentDocument(STUDocument)"><i class="bi bi-trash"></i></span></td> 
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
import ListByName from "@/components/ListByName";
export default {
  components: {
    ListByName
  },
  data() {
    return {
      Disabled : true,
      showModal: false,
      Lang: "",
      Documents: [],
      STUDocuments: [],
      NewDocuments:[],
      StudentInfo: {
        StudentNo: "",
        Student_name: "",
        Student_Arabic_name: ""
      },
      StudentDocument: {
        StudentNo: "",
        Serial: 0,
        Orginal: 0,
        Exist: 0,
        // NotApplicable: 0,
        Remarks: ""
      }
    };
  },
  methods: {
    UpdateDocuments() {
      this.STUDocuments.forEach(Doc =>{
        let NewDoc = {
          StudentNo : this.StudentInfo.StudentNo,
          Serial : Doc.Serial,
          // NotApplicable: Doc.NotApplicable,
          Orginal : Doc.Orginal,
          Exist : Doc.Exist
         }
        this.UpdateStudentDocuments(NewDoc)
      })
      this.Disabled = true;
    },
    ShowSearchModel(Lang) {
      this.Lang = Lang
      this.showModal = true;
    },      
    SaveStudentDocument() {
      if (!this.StudentInfo.StudentNo) {
        return
      }
      this.NewDocuments.forEach(Document =>{
        let new_StudentDocument = {
          StudentNo: this.StudentInfo.StudentNo,
          Serial: Document.Serial,
          // NotApplicable : 1,
          Orginal: 1,
          Exist: 1,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentdocument",
            new_StudentDocument
          )
          .then(
            () => {
              this.NewDocuments =[];
              this.fetchStudentDocuments(this.StudentInfo.StudentNo);
            },
            errorResponse => {
              console.log(errorResponse);
            }
          );

      }) 
      },
    async UpdateStudentDocuments(Doc) {
      
      try {
        return await axios.put(
          "http://" + server.IP + ":" + server.port + "/editstudentdocument/",
          Doc
        );
      } catch (error) {
        console.error(error);
      }
    },      
    AddDoc(Document) {
      this.NewDocuments.push(Document)
      let i = 0
      this.Documents.forEach ( Doc => {
        if (Doc.Serial === Document.Serial) {
          this.Documents.splice(i,1)
        }
        i++
      })
    },
    AddAll() {
      this.Documents.forEach ( Doc => {
        this.NewDocuments.push(Doc)
      })
      this.Documents =[];
    },    
    RemoveDoc(Document){
      this.Documents.push(Document)
      let i = 0
      this.NewDocuments.forEach ( Doc => {
        if (Doc.Serial === Document.Serial) {
          this.NewDocuments.splice(i,1)
        }
        i++
      })      
    },
    RemoveAll() {
      this.NewDocuments.forEach ( Doc => {
        this.Documents.push(Doc)
      })
      this.NewDocuments =[];
    },        
    findstudent(StudentNo) {
      this.fetchDocuments();
      axios
        .get(
          "http://" + server.IP + ":" + server.port + "/student/" + StudentNo
        )
        .then(
          data => {
            if (data.data.length > 0) {
              this.StudentInfo.Student_Arabic_name =
                data.data[0].Student_Arabic_name;
              this.StudentInfo.Student_name = data.data[0].Student_name;
            }
          },
          errorResponse => {
            console.log(errorResponse);
          }
        );
    },
    DeleteStudentDocument(DocumentInfo) {
      this.$confirm("Are you sure?","Delete "+DocumentInfo.DocumentName,"warning").then((e,reject) => {
        if (e) {
          axios.delete("http://" + server.IP + ":" + server.port + "/deletestudentdocument/"
            + this.StudentInfo.StudentNo + 
            "/" +
            DocumentInfo.Serial)
            .then(
            () => {
              this.Documents.push(DocumentInfo)
              this.fetchStudentDocuments(this.StudentInfo.StudentNo);
            },
            errorResponse => {
              this.$alert("Error while deleting" ,"Error Delete Student Document","error");
            }
          );
        }
      }).catch(() => {
        return
      })
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
    },
    showEditDocument(STUDocument) {
      this.StudentDocument.Serial = STUDocument.Serial;
      this.StudentDocument.Orginal = STUDocument.Orginal;
      this.StudentDocument.Exist = STUDocument.Exist;
      // this.StudentDocument.NotApplicable = STUDocument.NotApplicable;
      this.StudentDocument.Remarks = STUDocument.Remarks;
    },
    fetchStudentDocuments(StudentNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/studentdocuments/" +
            StudentNo
        )
        .then(
          data => {
            this.STUDocuments = data.data;
            var A = this;
            var c = A.Documents.filter(function(Doc) {
               return !A.STUDocuments.find(function(STUDOC) {
                return Doc.Serial === STUDOC.Serial
              })
            });
            this.Documents = c          
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    }
  },

};
</script>


<style scoped>
span {
  cursor: pointer;
}
h2 {
  margin-top: 5px;
  margin-bottom: 20px;
  color: #047c14;
}
#MyList {
  overflow-y:scroll;
  height:150px
}
#MyTable {
  overflow-y:scroll;
  height:250px
}
#jumbo {
  padding-top: 15px;
  background-color: #034d1f;
  margin-bottom: 5px;
}
#tableFixHead          { overflow: auto; height: 100px; }
#tableFixHead thead th { position: sticky; top: 0; z-index: 1; }
</style>
