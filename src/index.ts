import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { AppDataSource } from "./config/database";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api", routes());

app.use("/api/public", express.static("public"));

const port = process.env.PORT ?? 3000;

app.get("/api", (req, res) => {
  res.status(200).send({ status: true, message: "Service is running" });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });
