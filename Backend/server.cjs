const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.get("/schedule", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read schedule" });
    res.json(JSON.parse(data));
  });
});


app.post("/schedule", (req, res) => {
  const { date, start, end, status } = req.body;
  
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let schedule = JSON.parse(data);
    
    if (!schedule[date]) schedule[date] = [];
    schedule[date].push({ start, end, status });

    fs.writeFile(FILE_PATH, JSON.stringify(schedule, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to write file" });
      res.json({ message: "Slot added successfully", schedule });
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));


