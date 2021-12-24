<template>
  <div class="container">
    <div class="row gx-3">
      <div class="col">
        <h5 align="left" class="animate__animated animate__backInLeft mt-3"><span>{{GroupName}}</span></h5>
      </div>
      <div class="col">
        <h2 align="center"><span  class="badge card-header bg-success mt-0">Parents Information</span></h2>
      </div>
      <div class="col">
        <h5 align="right" class="animate__animated animate__backInRight mt-3"><span>{{SchoolName}}</span></h5>
      </div>      
    </div>        

       <ListByName
        v-if="showModal"
        v-bind:Student_name="StudentParent.StudentNameE"
        v-bind:Student_Arabic_name="StudentParent.StudentNameA"
        v-bind:Parent_Module="'StudentParent'"
        v-bind:Lang="Lang"
        v-bind:Scoped= "1"
        v-bind:SchoolNo= "SchoolNo"
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
                  v-model="StudentParent.StudentNo"
                  id="Number"
                  aria-describedby="StudentNo"
                />
                <span
                  class="input-group-text"
                  id="StudentNo"
                  v-on:click.prevent="findstudent(StudentParent.StudentNo)"
                  ><i class="bi bi-search"></i></span>            
              </div>
            </div>
            <div class="col-md-5">
              <div class="input-group">  
                <input
                  type="text"
                  class="form-control"
                  v-model="StudentParent.StudentNameE"
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
                  v-model="StudentParent.StudentNameA"
                  placeholder="Arabic Name"
                />
                <span class="input-group-text" v-on:click="ShowSearchModel('A')"><i class="bi bi-search"></i></span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FName">F.Name</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FName"
              v-model="StudentParent.Father_Name"
              placeholder="Father Name"
            />
        </div>
        <div class="col-md-1">
          <label for="MName">M.Name</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MName"
              v-model="StudentParent.Mother_Name"
              placeholder="Mother Name"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FHAdd">F.Address</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FHAdd"
              v-model="StudentParent.Father_Home_Address"
              placeholder="Father Home Address"
            />
        </div>
        <div class="col-md-1">
          <label for="MHAdd">M.Address</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MHAdd"
              v-model="StudentParent.Mother_Home_Address"
              placeholder="Mother Home Address"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FCert">F.Certificate</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FCert"
              v-model="StudentParent.Father_Certificate"
              placeholder="Father Certificate"
            />
        </div>
        <div class="col-md-1">
          <label for="MCert">M.Certificate</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MCert"
              v-model="StudentParent.Mother_Certificate"
              placeholder="Mother Certificate"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FProf">F.Profession</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FProf"
              v-model="StudentParent.Father_Profession"
              placeholder="Father Profession"
            />
        </div>
        <div class="col-md-1">
          <label for="MMProf">M.Profession</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MProf"
              v-model="StudentParent.Mother_Profession"
              placeholder="Mother Profession"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FPos">F.Position</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FPos"
              v-model="StudentParent.Father_Postion"
              placeholder="Father Employer/Postion"
            />
        </div>
        <div class="col-md-1">
          <label for="MPos">M.Position</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MPos"
              v-model="StudentParent.Mother_Postion"
              placeholder="Mother Employer/Postion"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FLang">Language</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FLang"
              v-model="StudentParent.Father_Spoken_Language"
              placeholder="Father Spoken Language"
            />
        </div>
        <div class="col-md-1">
          <label for="MLang">Language</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MLang"
              v-model="StudentParent.Mother_Spoken_Language"
              placeholder="Mother Spoken Language"
            />
        </div>        
      </div>
      <div class="row mt-2 d-flex justify-content-center">
        <div class="col-md-2">
          <label for="FMarital">Marital States</label>
        </div>        
        <div class="col-md-3">
          <select
            id="FMarital"
            class="form-control input"
            v-model="StudentParent.Father_Marital_Statues"
          >
            <option
              v-for="Marital in Maritals"
              v-bind:value="Marital.ID"
              :key="Marital.ID"
            >{{Marital.Name}}</option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="MMarital">Marital States</label>
        </div>        
        <div class="col-md-3">
          <select
            id="MMarital"
            class="form-control input"
            v-model="StudentParent.Mother_Marital_Statues"
          >
            <option
              v-for="Marital in Maritals"
              v-bind:value="Marital.ID"
              :key="Marital.ID"
            >{{Marital.Name}}</option>
          </select>
        </div>        
      </div>
      <div class="row mt-2 d-flex justify-content-center">
        <div class="col-md-2">
          <label for="FNationality">Nationality</label>
        </div>        
        <div class="col-md-3">
          <select
            id="FNationality"
            class="form-control input"
            v-model="StudentParent.Father_Nationility"
          >
            <option
              v-for="Nationality in Nationalities"
              v-bind:value="Nationality.id"
              :key="Nationality.id"
            >{{Nationality.Name}}</option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="MNationality">Nationality</label>
        </div>        
        <div class="col-md-3">
          <select
            id="MNationality"
            class="form-control input"
            v-model="StudentParent.Mother_Nationility"
          >
            <option
              v-for="Nationality in Nationalities"
              v-bind:value="Nationality.id"
              :key="Nationality.id"
            >{{Nationality.Name}}</option>
          </select>
        </div>        
      </div>
      <div class="row mt-2 d-flex justify-content-start">
        <div class="col-md-6 d-flex justify-content-center">
          <div class="col-md-3 form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="Father_Religion"
                value="1"
                id="FatherMuslim"
                v-model="StudentParent.Father_Religion"
              />
              <label class="form-check-label" for="FatherMuslim">Muslim</label>
          </div>
  
          <div class="col-md-3">
            <div class="form-check text-left form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="Father_Religion"
                value="0"
                id="FatherCristian"
                v-model="StudentParent.Father_Religion"
              />
              <label class="form-check-label" for="FatherCristian">Christian</label>
            </div>
          </div>
        </div>
        <div class="col-md-6 d-flex justify-content-center">
          <div class="col-md-3 form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="Mother_Religion"
              value="1"
              id="MotherMuslim"
              v-model="StudentParent.Mother_Religion"
            />
            <label class="form-check-label" for="MotherMuslim">Muslim</label>
          </div>
          <div class="col-md-3 form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="Mother_Religion"
              value="0"
              id="MotherCristian"
              v-model="StudentParent.Mother_Religion"
            />
            <label class="form-check-label" for="MotherCristian">Christian</label>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FID">F. ID</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FID"
              v-model="StudentParent.Father_ID"
              placeholder="Father ID Number"
            />
        </div>
        <div class="col-md-1">
          <label for="MID">M. ID</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MID"
              v-model="StudentParent.Mother_ID"
              placeholder="Mother ID Number"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FHT">H.Phone</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FHT"
              v-model="StudentParent.Father_Home_Tel"
              placeholder="Father Home Telephone"
            />
        </div>
        <div class="col-md-1">
          <label for="MHT">H.Phone</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MHT"
              v-model="StudentParent.Mother_Home_Tel"
              placeholder="Mother Home Telephone"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FMT">M.Phone</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FMT"
              v-model="StudentParent.Father_Mob"
              placeholder="Father Mobile Number"
            />
        </div>
        <div class="col-md-1">
          <label for="MMT">M.Phone</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MMT"
              v-model="StudentParent.Mother_Mob"
              placeholder="Mother Mobile Number"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FEmail">Email</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FEmail"
              v-model="StudentParent.Father_Email"
              placeholder="Father Email"
            />
        </div>
        <div class="col-md-1">
          <label for="MEmail">Email</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MEmail"
              v-model="StudentParent.Mother_Email"
              placeholder="Mother Email"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-1">
          <label for="FSMS">SMS Mobile</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="FSMS"
              v-model="StudentParent.Father_SMS_To_Mobile"
              placeholder="Father SMS To Mobile"
            />
        </div>
        <div class="col-md-1">
          <label for="MSMS">SMS Mobile</label>
        </div>        
        <div class="col-md-5">
            <input
              type="text"
              class="form-control"
              id="MSMS"
              v-model="StudentParent.Mother_SMS_To_Mobile"
              placeholder="Mother SMS To Mobile"
            />
        </div>        
      </div>
      <div class="row mt-2">
        <div class="col-md-12 d-flex justify-content-center">
          <button
            v-on:click.prevent="SaveStudentParent()"
            class="btn btn-primary btn-lg"
          >{{operation}}</button>
        </div>
      </div>      
  </div>
</template>

<script>
import axios from "axios";
import server from "../server";
import { mapState } from "vuex";
import ListByName from "@/components/ListByName";
export default {
  name: "StudentParent",
  components: {
    ListByName
  },
  data() {
    return {
      ShowAlert: false,
      operation: "Save",
      Nationalities: [],
      Lang: "", 
      showModal: false,
      ParentModule: "Parentinfo",
      Classes: [],
      Maritals: [
        { ID: 1, Name: "Married" },
        { ID: 2, Name: "Separated" },
        { ID: 3, Name: "Divorced" },
        { ID: 4, Name: "Deceased" },
      ],
      StudentParent: {
        StudentNo: "",
        StudentNameE: "",
        StudentNameA: "",
        Father_Name: "",
        Mother_Name: "",
        Father_Home_Address: "",
        Mother_Home_Address: "",
        Father_Certificate: "",
        Mother_Certificate: "",
        Father_Profession: "",
        Mother_Profession: "",
        Father_Postion: "",
        Mother_Postion: "",
        Father_Spoken_Language: "",
        Mother_Spoken_Language: "",
        Father_Marital_Statues: 1,
        Mother_Marital_Statues: 1,
        Father_Nationility: 54,
        Mother_Nationility: 54,
        Father_ID: "",
        Mother_ID: "",
        Religion: true,
        Father_Religion: 1,
        Mother_Religion: 1,
        Father_Home_Tel: "",
        Mother_Home_Tel: "",
        Father_Mob: "",
        Mother_Mob: "",
        Father_Email: "",
        Mother_Email: "",
        Father_SMS_To_Mobile: "",
        Mother_SMS_To_Mobile: "",
      },
    };
  },
  computed: {
    ...mapState(["user", "userID", "userName", "GroupNo", "GroupName", "SchoolNo", "SchoolName"]),
  },   

  methods: {
    SaveStudentParent() {
      if (this.operation === "Save") {
        let new_StudentParent = {
          StudentNo: this.StudentParent.StudentNo.trim(),
          Father_Name: this.StudentParent.Father_Name,
          Mother_Name: this.StudentParent.Mother_Name,
          Father_Nationility: this.StudentParent.Father_Nationility,
          Mother_Nationility: this.StudentParent.Mother_Nationility,
          Father_Religion: this.StudentParent.Father_Religion,
          Mother_Religion: this.StudentParent.Mother_Religion,
          Father_Certificate: this.StudentParent.Father_Certificate,
          Mother_Certificate: this.StudentParent.Mother_Certificate,
          Father_Profession: this.StudentParent.Father_Profession,
          Mother_Profession: this.StudentParent.Mother_Profession,
          Father_Postion: this.StudentParent.Father_Postion,
          Mother_Postion: this.StudentParent.Mother_Postion,
          Father_Spoken_Language: this.StudentParent.Father_Spoken_Language,
          Mother_Spoken_Language: this.StudentParent.Mother_Spoken_Language,
          Father_Marital_Statues: this.StudentParent.Father_Marital_Statues,
          Mother_Marital_Statues: this.StudentParent.Mother_Marital_Statues,
          Father_Home_Address: this.StudentParent.Father_Home_Address,
          Mother_Home_Address: this.StudentParent.Mother_Home_Address,
          Father_Home_Tel: this.StudentParent.Father_Home_Tel,
          Mother_Home_Tel: this.StudentParent.Mother_Home_Tel,
          Father_Mob: this.StudentParent.Father_Mob,
          Mother_Mob: this.StudentParent.Mother_Mob,
          Father_Email: this.StudentParent.Father_Email,
          Mother_Email: this.StudentParent.Mother_Email,
          Father_ID: this.StudentParent.Father_ID,
          Mother_ID: this.StudentParent.Mother_ID,
          Father_SMS_To_Mobile: this.StudentParent.Father_SMS_To_Mobile,
          Mother_SMS_To_Mobile: this.StudentParent.Mother_SMS_To_Mobile,
        };
        axios
          .post(
            "http://" + server.IP + ":" + server.port + "/addstudentparent",
            new_StudentParent
          )
          .then(
            (data) => {
              this.$fire({
                title: "Parent Information",
                text: "Data Saved",
                type: "success",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });              
              this.StudentParent.StudentNo = "";
              this.Clear_form();
            },
            (errorResponse) => {
              this.$fire({
                title: "Parent Information",
                text: "Error Saving Data",
                type: "error",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });                            
              console.log(errorResponse);
            }
          );
      } else {
        let upd_StudentParent = {
          StudentNo: this.StudentParent.StudentNo.trim(),
          Father_Name: this.StudentParent.Father_Name,
          Mother_Name: this.StudentParent.Mother_Name,
          Father_Nationility: this.StudentParent.Father_Nationility,
          Mother_Nationility: this.StudentParent.Mother_Nationility,
          Father_Religion: this.StudentParent.Father_Religion,
          Mother_Religion: this.StudentParent.Mother_Religion,
          Father_Certificate: this.StudentParent.Father_Certificate,
          Mother_Certificate: this.StudentParent.Mother_Certificate,
          Father_Profession: this.StudentParent.Father_Profession,
          Mother_Profession: this.StudentParent.Mother_Profession,
          Mother_Postion: this.StudentParent.Mother_Postion,
          Father_Postion: this.StudentParent.Father_Postion,
          Father_Spoken_Language: this.StudentParent.Father_Spoken_Language,
          Mother_Spoken_Language: this.StudentParent.Mother_Spoken_Language,
          Father_Marital_Statues: this.StudentParent.Father_Marital_Statues,
          Mother_Marital_Statues: this.StudentParent.Mother_Marital_Statues,
          Father_Home_Address: this.StudentParent.Father_Home_Address,
          Mother_Home_Address: this.StudentParent.Mother_Home_Address,
          Father_Home_Tel: this.StudentParent.Father_Home_Tel,
          Mother_Home_Tel: this.StudentParent.Mother_Home_Tel,
          Father_Mob: this.StudentParent.Father_Mob,
          Mother_Mob: this.StudentParent.Mother_Mob,
          Father_Email: this.StudentParent.Father_Email,
          Mother_Email: this.StudentParent.Mother_Email,
          Father_ID: this.StudentParent.Father_ID,
          Mother_ID: this.StudentParent.Mother_ID,
          Father_SMS_To_Mobile: this.StudentParent.Father_SMS_To_Mobile,
          Mother_SMS_To_Mobile: this.StudentParent.Mother_SMS_To_Mobile,
        };
        // console.log(upd_StudentParent);
        axios
          .put(
            "http://" + server.IP + ":" + server.port + "/editstudentparent/",
            upd_StudentParent
          )
          .then(
            (data) => {
              this.$fire({
                title: "Parent Information",
                text: "Data Saved",
                type: "success",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });
              this.StudentParent.StudentNo = "";
              this.Clear_form();
              this.operation = "Save";
            },
            (errorResponse) => {
              this.$fire({
                title: "Parent Information",
                text: "Error Saving Data",
                type: "error",
                timer: 3000
              }).then(r => {
                console.log(r.value);
              });              
              console.log(errorResponse);
            }
          );
      }
    },
    ShowSearchModel(Lang) {
      this.Lang = Lang
      this.showModal = true;
    },    
    getMeritalStates(Marital, Who) {
      this.Maritals.forEach((element) => {
        if (element.Name === Marital) {
          if (Who === "Father") {
            this.StudentParent.Father_Marital_Statues = element.ID;
          } else {
            this.StudentParent.Mother_Marital_Statues = element.ID;
          }
        }
      });
    },
    getNationalityID(Nationality, Who) {
      this.Nationalities.forEach((element) => {
        if (element.Name === Nationality) {
          if (Who === "Father") {
            this.StudentParent.FatherNationality = element.id;
          } else {
            this.StudentParent.MotherNationality = element.id;
          }
        }
      });
    },
    Clear_form() {
      // this.StudentParent.StudentNo = "";
      this.StudentParent.StudentNameE = "";
      this.StudentParent.StudentNameA = "";
      this.StudentParent.Father_Name = "";
      this.StudentParent.Mother_Name = "";
      this.StudentParent.Father_Nationility = 54;
      this.StudentParent.Mother_Nationility = 54;
      this.StudentParent.Father_Religion = 1;
      this.StudentParent.Mother_Religion = 1;
      this.StudentParent.Father_Certificate = "";
      this.StudentParent.Mother_Certificate = "";
      this.StudentParent.Father_Profession = "";
      this.StudentParent.Mother_Profession = "";
      this.StudentParent.Father_Postion = "";
      this.StudentParent.Mother_Postion = "";
      this.StudentParent.Father_Spoken_Language = "";
      this.StudentParent.Mother_Spoken_Language = "";
      this.StudentParent.Father_Marital_Statues = 1;
      this.StudentParent.Mother_Marital_Statues = 1;
      this.StudentParent.Father_Home_Address = "";
      this.StudentParent.Mother_Home_Address = "";
      this.StudentParent.Father_Home_Tel = "";
      this.StudentParent.Mother_Home_Tel = "";
      this.StudentParent.Father_Mob = "";
      this.StudentParent.Mother_Mob = "";
      this.StudentParent.Father_Email = "";
      this.StudentParent.Mother_Email = "";
      this.StudentParent.Father_ID = "";
      this.StudentParent.Mother_ID = "";
      this.StudentParent.Father_SMS_To_Mobile = "";
      this.StudentParent.Mother_SMS_To_Mobile = "";
    },

    findstudent(StudentNo) {
      this.Clear_form();
      axios
        .get(
          "http://" + server.IP + ":" + server.port + "/student/" + StudentNo.trim()
        )
        .then(
          (data) => {
            if (data.data.length > 0) {
              this.StudentParent.StudentNameA =
                data.data[0].Student_Arabic_name;
              this.StudentParent.StudentNameE = data.data[0].Student_name;
              this.findstudentparent(StudentNo.trim());
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    findstudentparent(StudentNo) {
      axios
        .get(
          "http://" +
            server.IP +
            ":" +
            server.port +
            "/getstudentparen/" +
            StudentNo
        )
        .then(
          (data) => {
            if (data.data.length > 0) {
              this.StudentParent.Father_Name = data.data[0].Father_Name;
              this.StudentParent.Mother_Name = data.data[0].Mother_Name;
              this.StudentParent.Father_Home_Address =
                data.data[0].Father_Home_Address;
              this.StudentParent.Mother_Home_Address =
                data.data[0].Mother_Home_Address;
              this.StudentParent.Father_Certificate =
                data.data[0].Father_Certificate;
              this.StudentParent.Mother_Certificate =
                data.data[0].Mother_Certificate;
              this.StudentParent.Father_Profession =
                data.data[0].Father_Profession;
              this.StudentParent.Mother_Profession =
                data.data[0].Mother_Profession;
              this.StudentParent.Father_Marital_Statues =
                data.data[0].Father_Marital_Statues;
              this.StudentParent.Mother_Marital_Statues =
                data.data[0].Mother_Marital_Statues;
              this.StudentParent.Father_Nationility =
                data.data[0].Father_Nationility;
              this.StudentParent.Mother_Nationility =
                data.data[0].Mother_Nationility;
              this.StudentParent.Father_Postion = data.data[0].Father_Postion;
              this.StudentParent.Mother_Postion = data.data[0].Mother_Postion;
              this.StudentParent.Father_Spoken_Language =
                data.data[0].Father_Spoken_Language;
              this.StudentParent.Mother_Spoken_Language =
                data.data[0].Mother_Spoken_Language;
              this.StudentParent.Father_ID = data.data[0].Father_ID;
              this.StudentParent.Mother_ID = data.data[0].Mother_ID;
              this.StudentParent.Father_Religion = data.data[0].Father_Religion;
              this.StudentParent.Mother_Religion = data.data[0].Mother_Religion;
              this.StudentParent.Father_Home_Tel = data.data[0].Father_Home_Tel;
              this.StudentParent.Mother_Home_Tel = data.data[0].Mother_Home_Tel;
              this.StudentParent.Father_Mob = data.data[0].Father_Mob;
              this.StudentParent.Mother_Mob = data.data[0].Mother_Mob;
              this.StudentParent.Father_Email = data.data[0].Father_Email;
              this.StudentParent.Mother_Email = data.data[0].Mother_Email;
              this.StudentParent.Father_SMS_To_Mobile =
                data.data[0].Father_SMS_To_Mobile;
              this.StudentParent.Mother_SMS_To_Mobile =
                data.data[0].Mother_SMS_To_Mobile;
              this.operation = "Update";
            } else {
              //get parentinfo from Admission Form
              axios
                .get(
                  "http://" +
                    server.IP +
                    ":" +
                    server.port +
                    "/getformparent/" +
                    StudentNo
                )
                .then((data) => {
                  if (data.data.length > 0) {
                    this.StudentParent.Father_Name = data.data[0].FatherName;
                    this.StudentParent.Mother_Name = data.data[0].MotherName;
                    this.StudentParent.Father_Home_Address =
                      data.data[0].FatherHomeAddress;
                    this.StudentParent.Mother_Home_Address =
                      data.data[0].MotherHomeAddress;
                    this.StudentParent.Father_Certificate =
                      data.data[0].FatherEducation;
                    this.StudentParent.Mother_Certificate =
                      data.data[0].MotherEducation;
                    this.StudentParent.Father_Profession =
                      data.data[0].FatherProfession;
                    this.StudentParent.Mother_Profession =
                      data.data[0].MotherProfession;
                    this.getMeritalStates(
                      data.data[0].FatherMaritalStates,
                      "Father"
                    );
                    this.getMeritalStates(
                      data.data[0].MotherMaritalStates,
                      "Mother"
                    );
                    this.getNationalityID(
                      data.data[0].FatherNationility,
                      "Father"
                    );
                    this.getNationalityID(
                      data.data[0].MotherNationility,
                      "Mother"
                    );
                    this.StudentParent.Father_Postion =
                      data.data[0].FatherProfession;
                    this.StudentParent.Mother_Postion =
                      data.data[0].MotherProfession;
                    this.StudentParent.Father_Spoken_Language =
                      data.data[0].Mother_Lang +
                      "-" +
                      data.data[0].Foreign_Lang;
                    this.StudentParent.Mother_Spoken_Language =
                      data.data[0].Mother_Lang +
                      "-" +
                      data.data[0].Foreign_Lang;
                    this.StudentParent.Father_ID = data.data[0].FatherID;
                    this.StudentParent.Mother_ID = data.data[0].MotherID;
                    this.StudentParent.Father_Religion =
                      data.data[0].FatherReligion === "Muslim" ? 1 : 0;
                    this.StudentParent.Mother_Religion =
                      data.data[0].MotherReligion === "Muslim" ? 1 : 0;
                    this.StudentParent.Father_Home_Tel =
                      data.data[0].FatherHomeTel;
                    this.StudentParent.Mother_Home_Tel =
                      data.data[0].MotherHomeTel;
                    this.StudentParent.Father_Mob = data.data[0].FatherMobile;
                    this.StudentParent.Mother_Mob = data.data[0].MotherMobile;
                    this.StudentParent.Father_Email = data.data[0].FatherEmail;
                    this.StudentParent.Mother_Email = data.data[0].MotherEmail;
                    this.StudentParent.Father_SMS_To_Mobile =
                      data.data[0].FatherMobile;
                    this.StudentParent.Mother_SMS_To_Mobile =
                      data.data[0].MotherMobile;
                  }
                  this.operation = "Save";
                });
            }
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },

    FitchNationality() {
      axios
        .get("http://" + server.IP + ":" + server.port + "/getnationality/")
        .then(
          (data) => {
            this.Nationalities = data.data;
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
    },
  },
  created: function () {
    // this.fetchSchools(1);
    console.log("School",this.SchoolNo)
    this.FitchNationality();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span {
  cursor: pointer;
}
#jumbo {
  padding-top: 15px;
  background-color: #034d1f;
  margin-bottom: 5px;
}

h5 {
  color: #047c14;
}
</style>
