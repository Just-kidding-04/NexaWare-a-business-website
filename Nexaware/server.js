const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const USERS = "data/users.json";
const ORDERS = "data/orders.json";

function read(file) {
  return JSON.parse(fs.readFileSync(file));
}

function write(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------- REGISTER ---------- */
app.post("/api/register", (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ status: "error", message: "All fields required" });
  }

  const users = read(USERS);

  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.json({ status: "error", message: "Email already registered" });
  }

  users.push({ name, email, password });

  write(USERS, users);

  res.json({ status: "ok", message: "Registration successful" });
});

/* ---------- LOGIN ---------- */
app.post("/api/login", (req, res) => {

  const { email, password } = req.body;

  const users = read(USERS);

  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.json({
      status: "error",
      message: "Invalid credentials"
    });
  }

  res.json({
    status: "ok",
    user: { name: user.name, email: user.email }
  });
});

/* ---------- PURCHASE ORDER ---------- */
app.post("/api/purchase", (req, res) => {

  let orders = read(ORDERS);

  const newOrder = {
    id: Date.now(),
    email: req.body.email,
    service: req.body.service,
    duration: req.body.duration,
    people: req.body.people,
    price: req.body.price
  };

  orders.push(newOrder);

  write(ORDERS, orders);

  res.json({ success: true });
});

/* ---------- DASHBOARD (USER SPECIFIC) ---------- */
app.post("/api/dashboard", (req, res) => {

  const { email } = req.body;

  const orders = read(ORDERS);

  const userOrders = orders.filter(o => o.email === email);

  res.json({
    orders: userOrders
  });
});

/* ---------- DELETE ORDER ---------- */
app.post("/api/deleteOrder", (req, res) => {

  const { id } = req.body;

  let orders = read(ORDERS);

  orders = orders.filter(o => o.id != id);

  write(ORDERS, orders);

  res.json({ success: true });
});

/* ---------- UPDATE ORDER ---------- */
app.post("/api/updateOrder", (req, res) => {

  const { id, service, duration, people, price } = req.body;

  let orders = read(ORDERS);

  orders = orders.map(o => {
    if (o.id == id) {
      return {
        id: o.id,
        email: o.email,      
        service,
        duration,
        people,
        price
      };
    }
    return o;
  });

  write(ORDERS, orders);

  res.json({ success: true });
});

app.listen(3000, () =>
  console.log("NexaWare System Running")
);
