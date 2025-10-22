// app.js — Carte Leaflet avec popup simplifiée + 2 graphiques D3 en bas

document.addEventListener("DOMContentLoaded", () => {
  const radiusKm = 30;
  const map = L.map("map").setView([46.227, 2.214], 6);

  // --- Fond de carte ---
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  // --- Clustering ---
  const markers = L.markerClusterGroup();

  // --- Zone du bas (2 graphiques côte à côte) ---
  const chartZone = d3.select("body")
    .append("div")
    .attr("id", "chartZone")
    .style("width", "100%")
    .style("background", "#f8f9fc")
    .style("border-top", "1px solid #ccc")
    .style("display", "flex")
    .style("justify-content", "space-evenly")
    .style("align-items", "flex-start")
    .style("padding", "10px 0");

  const chart1 = chartZone.append("div").attr("id", "chartCount");
  const chart2 = chartZone.append("div").attr("id", "chartPercent");

  // --- Charger les fichiers ---
  Promise.all([
    fetch("http://ws303d.mmi24c16.mmi-troyes.fr/api/stations").then(r => r.json()),
  ])
    .then(([gares]) => {
      gares.forEach(g => {
        const lat = parseFloat(g.latitude);
        const lon = parseFloat(g.longitude);
        if (isNaN(lat) || isNaN(lon)) return;

        const marker = L.marker([lat, lon]);
        marker.bindPopup(`
          <strong>${g.name}</strong><br>
          <small>Code postal : ${g.postal_code || "N/A"}</small><br>
          <small><em>Cliquez pour voir le graphique en bas</em></small>
        `);

        marker.on("click", async () => {
          const proches = await fetch(`http://ws303d.mmi24c16.mmi-troyes.fr/api/places?lat=${g.latitude}&lon=${g.longitude}&radiusKm=${10}`).then(r => r.json());
          console.log(proches);
          const stats = {};
          proches.forEach(l => {
            stats[l.type] = (stats[l.type] || 0) + 1;
          });

          const data = Object.entries(stats).map(([type, count]) => ({ type, count }));
          const total = data.reduce((sum, d) => sum + d.count, 0);
          const dataPct = data.map(d => ({ type: d.type, count: +(d.count / total * 100).toFixed(1) }));

          drawPieWithLegend(chart1, data, g.name, radiusKm, "Nombre de lieux");
          drawPieWithLegend(chart2, dataPct, g.name, radiusKm, "Répartition en %", true);
        });

        markers.addLayer(marker);
      });

      map.addLayer(markers);
      map.fitBounds(markers.getBounds());
    })
    .catch(err => console.error("Erreur chargement données :", err));

  // --- Fonction Haversine ---
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = a => (a * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // --- Fonction pour afficher un graphique + légende à droite ---
  function drawPieWithLegend(container, data, gareName, radiusKm, title, showPct = false) {
    container.html(""); // vider avant
    if (data.length === 0) {
      container.append("p")
        .text(`Aucun lieu à ${radiusKm} km autour de ${gareName}.`)
        .style("font-size", "14px")
        .style("color", "#555");
      return;
    }

    const width = 380, height = 250;
    const r = Math.min(width, height) / 2 - 40;
    const svg = container.append("svg")
      .attr("width", width + 150)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${r + 20},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(r);
    const arcs = pie(data);

    // --- Segments ---
    svg.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.3);

    // --- Légende à droite ---
    const legend = svg.append("g")
      .attr("transform", `translate(${r + 40},${-r})`);

    legend.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 18)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => color(d.type));

    legend.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 18)
      .attr("y", (d, i) => i * 18 + 10)
      .attr("font-size", "11px")
      .text(d => showPct ? `${d.type} — ${d.count}%` : `${d.type} (${d.count})`);

    // --- Titre ---
    svg.append("text")
      .attr("x", -10)
      .attr("y", -height / 2 + 20)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-size", "13px")
      .text(`${title} — ${gareName} (${radiusKm} km)`);
  }
});