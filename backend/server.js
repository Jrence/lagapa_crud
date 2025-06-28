const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());  

const db = mysql2.createPool(
{
    host: "localhost",
    user: "root",
    password: "",
    database: "lagapa_db",
    waitForConnections: true,
    connectionLimit: 10,
}
);

db.getConnection((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database.");
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserSql = "SELECT * FROM users WHERE username = ?";

    db.query(checkUserSql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Database Error" });
        if (results.length > 0) {
          return res.status(400).json({ message: "Username already exist" });
        }
        const insertUserSql = "INSERT INTO users (username, password) VALUES (?,?)";
        db.query(insertUserSql, [username, hashedPassword], (err, result) => {
          if (err) return res.status(500).json({ message: "Registration Failed" });
    
          res.status(201).json({ message: "User registered successfully" });
        });
      });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: "Invalid Username" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Password" });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "Login Succesfuly", token, username: user.username });
    });
});

//===================================================================


const items = [
  {id: 1, name: 'item 1'},
  {id: 2, name: 'item 2'},
  {id: 3, name: 'item 3'},
  {id: 4, name: 'item 4'},
]

// GET: retrieve all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

//POST: add new items to the items
app.post("/api/items", (req, res) => {
  const newItem = {id: items.length + 1, name: req.body.name};
  items.push(newItem);
  res.status(201).json(newItem);
});

//PUT: update the items
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({massage: 'Item not founs'});
  item.name = req.body.name;
  res.json(item);
});

// DELETE: delete an item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({massage: 'Item not found'});
  items.splice(index, 1);
  res.json({massage: ' Item deleted'});
});








app.listen(5000, () =>{
    console.log("Server is running on port 5000");
});