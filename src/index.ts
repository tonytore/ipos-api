import express from "express";
import { getCustomers } from "./controllers/customers";
import customerRoute from "./routes/customer";
import userRoute from "./routes/user";
import shopRoute from "./routes/shop";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});


app.use("/api/v1", customerRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1", shopRoute)


