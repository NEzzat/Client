import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import SchoolGroup from "@/components/SchoolGroup.vue";
import Sections from "@/components/Sections.vue";
import School from "@/components/School.vue";
import Department from "@/components/Department.vue";
import Grades from "@/components/Grades.vue";
import Classes from "@/components/Classes.vue";
import Student_Class from "@/components/Student_Class.vue";
import RevenueItems from "@/components/RevenueItems.vue";
import SYYearlyFees from "@/components/SYYearlyFees.vue";
import Installments from "@/components/Installments.vue";
import installmentline from "@/components/installmentline.vue";
import BusPackages from "@/components/BusPackages.vue";
import DiscountPackages from "@/components/DiscountPackages.vue";
import StudentFinancial from "@/components/StudentFinancial.vue";
import StudentDiscounts from "@/components/StudentDiscounts.vue";
import Student_Accounts from "@/components/Student_Accounts.vue";
import Reasons from "@/components/Reasons.vue";
import WorkingDays from "@/components/WorkingDays.vue";
import Absence from "@/components/Absence.vue";
import StudentParents from "@/components/StudentParents.vue";
import StudentInfo from "@/components/StudentInfo.vue";
import Documents from "@/components/Documents.vue";
import StudentDocuments from "@/components/StudentDocuments.vue";
import StudentTransfer from "@/components/StudentTransfer.vue";
import StudentMove from "@/components/StudentMove.vue";
import Reports from "@/components/Reports.vue";
import Dashboard from "@/components/Dashboard.vue";
import store from '@/store/index.js'
// import Login from "@/components/Login.vue";

Vue.use(Router);

const Routs = new Router({
  routes: [{
      path: "/",
      component: Home,
    },
    {
      path: "/SchoolGroup",
      component: SchoolGroup,
    },
    {
      path: "/School",
      component: School,
    },
    {
      path: "/Sections",
      component: Sections,
    },
    {
      path: "/Department",
      component: Department,
    },
    {
      path: "/Grades",
      component: Grades,
    },
    {
      path: "/Classes",
      component: Classes,
    },
    {
      path: "/Student_Class",
      component: Student_Class,
    },
    {
      path: "/RevenueItem",
      component: RevenueItems,
    },
    {
      path: "/SYYearlyFees",
      component: SYYearlyFees,
    },
    {
      path: "/Installments",
      component: Installments,
    },
    {
      path: "/installmentline",
      component: installmentline,
    },
    {
      path: "/BusPackages",
      component: BusPackages,
    },
    {
      path: "/DiscountPackages",
      component: DiscountPackages,
    },
    {
      path: "/StudentFinancial",
      component: StudentFinancial,
    },
    {
      path: "/StudentDiscounts",
      component: StudentDiscounts,
    },
    {
      path: "/StudentAccounts",
      component: Student_Accounts,
    },
    {
      path: "/Reasons",
      component: Reasons,
    },
    {
      path: "/WorkingDays",
      component: WorkingDays,
    },
    {
      path: "/Absence",
      component: Absence,
    },
    {
      path: "/StudentParents",
      component: StudentParents,
    },
    {
      path: "/StudentInfo",
      component: StudentInfo,
    },
    {
      path: "/Documents",
      component: Documents,
    },
    {
      path: "/StudentDocuments",
      component: StudentDocuments,
    },
    {
      path: "/StudentTransfer",
      component: StudentTransfer,
    },
    {
      path: "/StudentMove",
      component: StudentMove,
    },

    {
      path: "/Reports",
      component: Reports,
    },
    {
      path: "/Dashboard",
      component: Dashboard,
    },
  ],
  mode: "history",
});

 Routs.beforeEach((to, from, next) => {
//   console.log(to.path, from)
  if (to.path === "/") {
    next()
  } else {
    if (store.state.GroupNo === 0) {
      next(false)
    } else
      next() 
  }
//   // if (!app.$store.state.userID == 0) next(false)
//   //  else next()
 })
export default Routs
