async function loadDashboard() {
  const res = await fetch(`${BASE_URL}/items`);
  const data = await res.json();

  const container = document.getElementById("cards");
  container.innerHTML = "";
  data.forEach(item => {
    const color = item.stock <= item.lowLimit ? 'red' : 'green';
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Stock: <b style="color:${color}">${item.stock}</b></p>
      <p>Status: ${item.stock <= item.lowLimit ? "Low" : "OK"}</p>
    `;
    container.appendChild(card);
  });
}

window.onload = loadDashboard;
