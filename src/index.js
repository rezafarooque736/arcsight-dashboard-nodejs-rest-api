import "dotenv/config";
import app from "./app.js";
import { config } from "./config/config.js";
import connectToMongoDB from "./config/db.js";

const PORT = config.PORT;

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to mongodb database", error);
  });
