import axios from "axios";
import server from "../server";
export default {

  data() {
    return {
      Groups: []
    };
  },
  methods: {
    fetchGroups() {
      axios.get("http://" + server.IP + ":" + server.port + "/groups").then(
        data => {
          this.Groups = data.data;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    }
  },

  created: function () {
    this.fetchGroups();
  }
};
