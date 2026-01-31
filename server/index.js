require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// CONNECT TO MONGODB
// ==========================
// This looks for the "MONGO_URI" variable you set in Render.
// If running locally, it falls back to your local database.
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mern_crud";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// ==========================
// SCHEMA & MODEL
// ==========================
const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number
});
const Person = mongoose.model("Person", PersonSchema);

// ==========================
// API ROUTES
// ==========================
app.get("/", async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const newPerson = await Person.create(req.body);
    res.json(newPerson);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});