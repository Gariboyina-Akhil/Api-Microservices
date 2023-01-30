require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");

//express connection
const book_application = express();
book_application.use(express.json());

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/author");
const Publications = require("./API/publication")

//mongoose connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("connection established"));

//initializing microservices
book_application.use("/book",Books);
book_application.use("/author",Authors);
book_application.use("/publication",Publications);

book_application.listen(3000, () => console.log("book_application server is running"));