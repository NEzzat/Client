import axios from "axios";
import server from "../server";
export default {

  data() {
    return {
      SY: []
    };
  },
  methods: {
    fetchSY() {
      
      axios.get("http://" + server.IP + ":" + server.port + "/listsy").then(
        data => {
          this.SY = data.data;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    }
  },

  created: function () {
    this.fetchSY();
    
  }
};
