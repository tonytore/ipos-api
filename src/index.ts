import express from "express";
import { getCustomers } from "./controllers/customers";
import customerRoute from "./routes/customer";
import userRoute from "./routes/user";
import shopRoute from "./routes/shop";
import supplierRoute from "./routes/supplier";
import loginRoute from "./routes/login";
import unitRoute from "./routes/unit";
import brandRoute from "./routes/brand";
import categoryRoute from "./routes/category";
import productRoute from "./routes/product";
import saleRoute from "./routes/sale";
import expenseCategoryRoute from "./routes/expenseCategory";
import payeeRoute from "./routes/payee";
import expenseRoute from "./routes/expense";

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
app.use("/api/v1", supplierRoute)
app.use("/api/v1", loginRoute)
app.use("/api/v1", unitRoute)
app.use("/api/v1", brandRoute)
app.use("/api/v1", categoryRoute)
app.use("/api/v1", productRoute)
app.use("/api/v1", saleRoute)
app.use("/api/v1", expenseCategoryRoute)
app.use("/api/v1", payeeRoute)
app.use("/api/v1", expenseRoute)

