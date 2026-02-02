const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");

// Load Countries
fetch("https://countriesnow.space/api/v0.1/countries/positions")
  .then(res => res.json())
  .then(data => {
    data.data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      countrySelect.appendChild(option);
    });
  });


// When Country Selected
countrySelect.addEventListener("change", () => {

  stateSelect.innerHTML = `<option>Select State</option>`;
  citySelect.innerHTML = `<option>Select City</option>`;

  stateSelect.disabled = true;
  citySelect.disabled = true;

  if (!countrySelect.value) return;

  fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: countrySelect.value
    })
  })
  .then(res => res.json())
  .then(data => {

    data.data.states.forEach(state => {
      const option = document.createElement("option");
      option.value = state.name;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });

    stateSelect.disabled = false;
  });

});


// When State Selected
stateSelect.addEventListener("change", () => {

  citySelect.innerHTML = `<option>Select City</option>`;
  citySelect.disabled = true;

  if (!stateSelect.value) return;

  fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: countrySelect.value,
      state: stateSelect.value
    })
  })
  .then(res => res.json())
  .then(data => {

    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });

    citySelect.disabled = false;
  });

});
