import path from "path";
import express from "express";
import compression from "compression";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import sassMiddleware from "sass-middleware";
import babelify from "express-babelify-middleware";

import indexRoutes from "./routes/index.js";
import imageRoutes from "./routes/image.js";
import statsRoutes from "./routes/stats.js";

// import helpers from __dirname + '/helpers/general.js';
const app = express();
const __dirname = import.meta.dirname;

app.use(compression());

app.use(
  sassMiddleware({
    // debug: true,
    src: __dirname + "/src",
    dest: path.join(__dirname, "public"),
    outputStyle: "compressed",
  })
);

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(
  "/js/",
  babelify("src/scripts/", {
    minify: true,
  })
);

app.engine(
  "handlebars",
  exphbs.engine({ extname: ".handlebars", defaultLayout: "main" })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"]?.indexOf("https") === -1) {
//     return res.redirect("https://" + req.headers.host + req.url);
//   } else {
//     return next();
//   }
// });

app.use("/", indexRoutes);
app.use("/image", imageRoutes);
app.use("/stats", statsRoutes);

app.get("/js/helpers.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/helpers/general.js"));
});

export default app;
