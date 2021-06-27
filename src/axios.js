import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL: "http://localhost:5001/pell-mell/us-central1/api",
  //   baseURL: "https://us-central1-react-quiz-game.cloudfunctions.net/api",
});
export default instance;
