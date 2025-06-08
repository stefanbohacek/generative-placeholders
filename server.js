import app from "./app.js";

const listener = app.listen(3000, () => {
  console.log(`app is running on port 3000...`);
});
