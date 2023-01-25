import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import userList from "./Models/ContactSchema.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) =>
    res.status(500).send(err)
  );
});
// Routes
app.post("/contactus", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name && !phone && !email) {
      return res.status(400).send("Enter all Required Fields");
    }

    const result = await userList.create({
      phone,
      name,
      email,
    });
    console.log(result);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thefoodiebeecontact@gmail.com",
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "thefoodiebeecontact@gmail.com",
      to: "shreeramshanmugasundaram1@gmail.com, manul@thefoodiebee.com",
      subject: name,
      text: `Name : ${name} Phone : ${phone} Email : ${email}`,
      headers: {
        "X-Laziness-level": 1000,
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Server error");
      } else {
        console.log(`Email sent: ${info.response}`);
        return res.status(200).send("mail successfully sent");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
