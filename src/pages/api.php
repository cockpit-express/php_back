<h1>📘 API Documentation</h1>
<p>Format : UTF-8 JSON</p>
<p>Demo : <a href="http://localhost/saews303d/public/api/places?lat=48.2973&lon=4.0744&radiusKm=5" target="_blank">les sites culturels à priximité de la gare SNCF de Troyes, dans un rayon de 5km.</a></p>
<p>Ressources : <a href="https://github.com/cockpit-express" target="_blank">Github du projet</a></p>

<h2>Stations (gares SNCF)</h2>

<b>GET /api/stations</b>
<p>Paramètres queries (optionnels) :</p>
<li>limit (int, default = 2762, max = 2762)</li>
<li>lat (float)</li>
<li>lon (float)</li>
<p>Example: /api/stations?lat=48.85&lon=2.35&limit=5</p>

<b>GET /api/stations/{id}</b>
<p>Example: /api/stations/30</p>

<h2>Places (sites culturels)</h2>

<b>GET /api/places</b>
<p>Paramètres queries (optionnels) :</p>
<li>limit (int, default = 150, max = 600)</li>
<li>lat (float)</li>
<li>lon (float)</li>
<li>radiusKm (float)</li>
<p>Example: /api/places?lat=48.85&lon=2.35&radiusKm=1</p>

<b>GET /api/places/{id}</b>
<p>Example: /api/places/30</p>