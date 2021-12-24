import axios from "axios";
import sa_server from "../server";

const Schools = GroupNo => ({
  data() {
    return {
      Schools: []
    };
  },
  methods: {
    GetSchools() {
      axios
        .get(
          "http://" +
          sa_server.IP +
          ":" +
          sa_server.port +
          "/listschools/" +
          GroupNo
        )
        .then(
          data => {
            this.Schools = data.data;
          },
          errorResponse => {
            console.log("err :" + errorResponse);
          }
        );
    },
  },
})

export default Schools
