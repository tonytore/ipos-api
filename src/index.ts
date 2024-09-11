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
import rateLimit from "express-rate-limit";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders:true,
  legacyHeaders:false,
  handler: (req,res)=>{
    res.status(429).json({
      error:"Too many requests, please try again later."
    })
  }
})

app.use(generalLimiter)


const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  standardHeaders:true,
  legacyHeaders:false,
  handler: (req,res)=>{
    res.status(429).json({
      error:"Too many requests, please try again later."
    })
  }
});

app.use("/api/v1/sales", strictLimiter)
app.use("/api/v1/users", strictLimiter)
app.use("/api/v1/expense", strictLimiter)


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

