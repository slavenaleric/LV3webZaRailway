let kosarica = [];
let sviDani = [];
fetch('temperature.csv')
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, { header: true, skipEmptyLines: true });
    sviDani = rezultat.data.map(dan => ({
      id: dan.ID,
      temp: Number(dan['Temperature']),
      humidity: Number(dan['Humidity']),
      wind: Number(dan['Wind Speed']),
      precipitation: Number(dan['Precipitation (%)']),
      cloud: dan['Cloud Cover'],
      pressure: Number(dan['Atmospheric Pressure']),
      uv: Number(dan['UV Index']),
      season: dan['Season']
    }));
    prikaziTablicu(sviDani.slice(0, 20));
  });

function prikaziTablicu(dani) {
  const tbody = document.querySelector('#vrijeme-tablica tbody');
  tbody.innerHTML = '';
  for (const dan of dani) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dan.id}</td>
      <td>${dan.temp}</td>
      <td>${dan.humidity}</td>
      <td>${dan.wind}</td>
      <td>${dan.precipitation}</td>
      <td>${dan.cloud}</td>
      <td>${dan.pressure}</td>
      <td>${dan.uv}</td>
      <td>${dan.season}</td>
      <td><button onclick='dodajUKosaricu(${JSON.stringify(dan).replace(/'/g, "\'")})'>Dodaj</button></td>

    `;
    tbody.appendChild(row);
  }
}

document.getElementById('filter-temp').addEventListener('input', e => {
    document.getElementById('temp-value').textContent = e.target.value + '°C';
  });
  
  document.getElementById('primijeni-filtere').addEventListener('click', () => {
    const sezona = document.getElementById('filter-season').value;
    const minTemp = Number(document.getElementById('filter-temp').value);
    const vrijeme = document.getElementById('filter-weather').value;
    const filtrirani = sviDani.filter(dan =>
      (!sezona || dan.season === sezona) &&
      (dan.temp >= minTemp) &&
      (!vrijeme || dan.cloud === vrijeme)
    );
    prikaziTablicu(filtrirani);
  });


  function dodajUKosaricu(dan) {
    if (!kosarica.some(d => d.id === dan.id)) {
      kosarica.push(dan);
      osvjeziKosaricu();
    }
  }


  function osvjeziKosaricu() {
    const lista = document.getElementById('dropdown-lista');
    lista.innerHTML = ''; 
    kosarica.forEach((dan, index) => {
      const li = document.createElement('li');
      li.textContent = `${dan.id} (${dan.temp}°C, ${dan.season})`;
      const btn = document.createElement('button');
      btn.textContent = 'Ukloni';
      btn.onclick = () => {
        kosarica.splice(index, 1);
        osvjeziKosaricu();
      };
      li.appendChild(btn);
      lista.appendChild(li);
    });
  }

const cartBtn = document.getElementById('cart-icon');
const dropdown = document.getElementById('dropdown-kosarica');

cartBtn.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Zatvori dropdown ako klikneš izvan njega
window.addEventListener('click', function(e) {
  if (!cartBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});


  




