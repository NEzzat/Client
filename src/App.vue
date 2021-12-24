<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark  bg-success">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">GPIS Student Affairs</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Dashboard</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Student Data
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><router-link to="/StudentInfo" class="dropdown-item">Student Info</router-link></li>
                <li><router-link to="/StudentParents" class="dropdown-item">Parent Info</router-link></li>
                <li><router-link to="/Documents" class="dropdown-item">Documents</router-link></li>
                <li><router-link to="/StudentDocuments" class="dropdown-item">Student Documents</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Master Data
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><router-link to="/SchoolGroup" class="dropdown-item">School Group</router-link></li>
                <li><router-link to="/School" class="dropdown-item">School</router-link></li>
                <li><router-link to="/Sections" class="dropdown-item">Sections</router-link></li>
                <li><router-link to="/Department" class="dropdown-item">Department</router-link></li>
                <li><router-link to="/Grades" class="dropdown-item">Grades</router-link></li>
                <li><router-link to="/Classes" class="dropdown-item">Classes</router-link></li>
                <li><router-link to="/Student_Class" class="dropdown-item">Student Class</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/StudentMove" class="dropdown-item">Student Move</router-link></li>
                <li><router-link to="/StudentTransfer" class="dropdown-item">Student Transition</router-link></li>
                
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Financial Data
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><router-link to="/RevenueItem" class="dropdown-item">Revenue Item</router-link></li>
                <li><router-link to="/SYYearlyFees" class="dropdown-item">Yearly Fees</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/Installments" class="dropdown-item">Installment Packages</router-link></li>
                <li><router-link to="/installmentline" class="dropdown-item">Package Installments</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/BusPackages" class="dropdown-item">Bus Packages</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/DiscountPackages" class="dropdown-item">Discount Packages</router-link></li>
                <li><router-link to="/StudentDiscounts" class="dropdown-item">Student Discounts</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/StudentFinancial" class="dropdown-item">Student Financial</router-link></li>
                <li><router-link to="/StudentAccounts" class="dropdown-item">Student Invoices</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Attandence
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><router-link to="/Reasons" class="dropdown-item">Absence Reasons</router-link></li>
                <li><router-link to="/WorkingDays" class="dropdown-item">Working Days</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/Absence" class="dropdown-item">Daily Absence</router-link></li>
              </ul>
            </li>            
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
  
</template>

<script>

export default {

  data() {
    return {

    };
  },
  methods: {
    // Logout() {
    //   sessionStorage.removeItem("UserName");
    //   sessionStorage.removeItem("UserNo");
    //   this.$router.push("/Home");
    // },
  },
  created: function () {
    // if (!sessionStorage.getItem("UserNo")) {
    //   this.ShowLogin = true;
    // } else {
      this.ShowLogin = false;
      // this.UserName = sessionStorage.getItem("UserName");
    // }
  },
};
</script>

<style>
</style>
