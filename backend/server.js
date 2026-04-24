
const app = require("./src/app");
// app.listen(3000, () => console.log("Server running on port 3000"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});