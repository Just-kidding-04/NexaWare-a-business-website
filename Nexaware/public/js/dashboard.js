async function loadDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("nxBigWelcome").innerText =
    "Welcome, " + user.email;

  const res = await fetch("/api/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email })
  });

  const data = await res.json();

  loadOrders(data.orders);
}

function loadOrders(orders) {

  const list = document.getElementById("ordersList");

  if (!orders || orders.length === 0) {
    list.innerHTML = "<p>No orders found</p>";
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="nx-order-card">
        <h4>${o.service}</h4>
        <p>Duration: ${o.duration} days</p>
        <p>People: ${o.people}</p>
        <p>Total: ₹${o.price}</p>

        <button class="update" onclick="openUpdate('${o.id}')">
          Update
        </button>

        <button class="delete" onclick="deleteOrder('${o.id}')">
          Delete
        </button>
    </div>
  `).join("");
}

function showSection(id) {

  document.querySelectorAll(".nx-section")
    .forEach(s => s.style.display = "none");

  document.getElementById(id).style.display = "block";
}

async function purchase() {

  const user = JSON.parse(localStorage.getItem("user"));

  const service = document.getElementById("service").value;
  const duration = document.getElementById("duration").value;
  const people = document.getElementById("people").value;

  const toast = document.getElementById("toast");

  const price = Number(duration) * Number(people) * 500;

  const data = {
    email: user.email,
    service,
    duration,
    people,
    price
  };

  await fetch("/api/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  toast.innerHTML = "Order Placed Successfully for ₹" + price + "!";
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);

  loadDashboard();
  showSection("orders");
}

async function deleteOrder(id) {

  if (!confirm("Delete this order?")) return;

  await fetch("/api/deleteOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  toast.innerHTML = "Order Deleted Successfully!";
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);

  loadDashboard();
  showSection("orders");
}

function openUpdate(id) {

  window.updateId = id;

  document.getElementById("formTitle").innerText =
    "Update Order";

  document.getElementById("actionBtn").innerText =
    "Update Order";

  document.getElementById("actionBtn")
    .setAttribute("onclick", "updateOrder()");

  loadDashboard();
  showSection("purchase");
}

async function updateOrder() {

  const service = document.getElementById("service").value;
  const duration = document.getElementById("duration").value;
  const people = document.getElementById("people").value;

  const price = Number(duration) * Number(people) * 500;

  await fetch("/api/updateOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: window.updateId,
      service,
      duration,
      people,
      price
    })
  });

  alert("Order Updated Successfully");
  document.getElementById("actionBtn").innerText =
    "Confirm Purchase";

  document.getElementById("actionBtn")
    .setAttribute("onclick", "purchase()");
  loadDashboard();
  showSection("orders");
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

loadDashboard();
