const regionsByInseeCode = {
  11: { name: "Île-de-France", abbr: "Île-de-Fr." },
  24: { name: "Centre-Val de Loire", abbr: "Centre-Val L." },
  27: { name: "Bourgogne-Franche-Comté", abbr: "Bourg.-Fr-Comt." },
  28: { name: "Normandie", abbr: "Norm." },
  32: { name: "Hauts-de-France", abbr: "Hauts-de-Fr." },
  44: { name: "Grand Est", abbr: "Grd Est" },
  52: { name: "Pays de la Loire", abbr: "Pays-Loire" },
  53: { name: "Bretagne", abbr: "Bret." },
  75: { name: "Nouvelle-Aquitaine", abbr: "Nouv.-Aqu." },
  76: { name: "Occitanie", abbr: "Occit." },
  84: { name: "Auvergne-Rhône-Alpes", abbr: "Auv.-Rh-Alp." },
  93: { name: "Provence-Alpes-Côte d'Azur", abbr: "Prov.-Alp-Côte" }
}

const regionCodeByDepartement = {
  "75": "11",
  "77": "11",
  "78": "11",
  "91": "11",
  "92": "11",
  "93": "11",
  "94": "11",
  "95": "11",
  "18": "24",
  "28": "24",
  "36": "24",
  "37": "24",
  "41": "24",
  "45": "24",
  "21": "27",
  "25": "27",
  "39": "27",
  "58": "27",
  "70": "27",
  "71": "27",
  "89": "27",
  "90": "27",
  "14": "28",
  "27": "28",
  "50": "28",
  "61": "28",
  "76": "28",
  "02": "32",
  "59": "32",
  "60": "32",
  "62": "32",
  "80": "32",
  "08": "44",
  "10": "44",
  "51": "44",
  "52": "44",
  "54": "44",
  "55": "44",
  "57": "44",
  "67": "44",
  "68": "44",
  "88": "44",
  "44": "52",
  "49": "52",
  "53": "52",
  "72": "52",
  "85": "52",
  "22": "53",
  "29": "53",
  "35": "53",
  "56": "53",
  "16": "75",
  "17": "75",
  "19": "75",
  "23": "75",
  "24": "75",
  "33": "75",
  "40": "75",
  "47": "75",
  "64": "75",
  "79": "75",
  "86": "75",
  "87": "75",
  "09": "76",
  "11": "76",
  "12": "76",
  "30": "76",
  "31": "76",
  "32": "76",
  "34": "76",
  "46": "76",
  "48": "76",
  "65": "76",
  "66": "76",
  "81": "76",
  "82": "76",
  "01": "84",
  "03": "84",
  "07": "84",
  "15": "84",
  "26": "84",
  "38": "84",
  "42": "84",
  "43": "84",
  "63": "84",
  "69": "84",
  "73": "84",
  "74": "84",
  "04": "93",
  "05": "93",
  "06": "93",
  "13": "93",
  "83": "93",
  "84": "93"
}

/* Config */

const PAD = 0.15
const MARGIN_L = 40
const MARGIN_R = 40

const orderedRegions = Object.values(regionsByInseeCode).map(r => r.abbr)

/* ################### */
/* Comptes par région  */
/* ################### */

const regionCountData = window.regionCountData

const types = Array.from(new Set(regionCountData.flatMap(d => Object.keys(d.types))))

const dataset = regionCountData.map(d => {
  const obj = { region: regionsByInseeCode[d.region_code].abbr || d.region_code }
  types.forEach(type => {
    obj[type] = d.types[type] || 0
  })
  return obj
})

const datasetOrdered = orderedRegions
  .map(reg => dataset.find(d => d.region === reg))
  .filter(Boolean)

const stack = d3.stack().keys(types)
const series = stack(datasetOrdered)

const BASE_W = 1000
const BASE_H = 500
const margin = { top: 30, right: MARGIN_R, bottom: 120, left: MARGIN_L }

const svg = d3.select('#region-count-chart')
  .attr('class', 'chart')
  .attr('viewBox', `0 0 ${BASE_W} ${BASE_H}`)
  .attr('preserveAspectRatio', 'xMidYMid meet')

const x = d3.scaleBand()
  .domain(datasetOrdered.map(d => d.region))
  .range([margin.left, BASE_W - margin.right])
  .padding(PAD)

const y = d3.scaleLinear()
  .domain([0, d3.max(datasetOrdered, d => d3.sum(types.map(t => d[t])))])
  .nice()
  .range([BASE_H - margin.bottom, margin.top])

const color = d3.scaleOrdinal()
  .domain(types)
  .range(d3.schemeTableau10)

// barres empilées
svg.append('g')
  .selectAll('g')
  .data(series)
  .join('g')
    .attr('fill', d => color(d.key))
  .selectAll('rect')
  .data(d => d)
  .join('rect')
    .attr('x', d => x(d.data.region))
    .attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())

// axes
svg.append('g')
  .attr('transform', `translate(0, ${BASE_H - margin.bottom})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-35)")
    .attr("dx", "-0.6em")
    .attr("dy", "0.2em")

svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))

// labels totaux
svg.selectAll('.totalLabel')
  .data(datasetOrdered)
  .enter()
  .append('text')
  .attr('x', d => x(d.region) + x.bandwidth() / 2)
  .attr('y', d => y(d3.sum(types.map(t => d[t]))) - 5)
  .attr('text-anchor', 'middle')
  .text(d => d3.sum(types.map(t => d[t])))
  .attr('font-size', '12px')
  .attr('fill', '#000')

// légende
const legendY = BASE_H - 50
const legendWidth = BASE_W - margin.left - margin.right
const itemWidth = 140
const itemsPerRow = Math.floor(legendWidth / itemWidth)
const rowHeight = 22

const legend = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${legendY})`)

types.forEach((type, i) => {
  const row = Math.floor(i / itemsPerRow)
  const col = i % itemsPerRow
  
  const g = legend.append('g')
    .attr('transform', `translate(${col * itemWidth}, ${row * rowHeight})`)

  g.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', color(type))

  g.append('text')
    .attr('x', 20)
    .attr('y', 12)
    .text(type)
    .attr('font-size', '11px')
    .attr('fill', '#000')
})


/* ##################### */
/* Répartition des types */
/* ##################### */

const typeCountData = window.typeCountData
const entries = Object.entries(typeCountData).map(([type, count]) => ({ type, count }))
const totalTypes = d3.sum(entries, d => d.count)

// const BASE_WT = 3500
// const BASE_HT = 1600
const BASE_WT = 1300
const BASE_HT = 700
const marginT = { top: 10, right: MARGIN_R, bottom: 20, left: MARGIN_L }

const svgT = d3.select('#type-count-chart')
  .attr('class', 'chart')
  .attr('viewBox', `0 0 ${BASE_WT} ${BASE_HT}`)
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .html('')

const colorT = d3.scaleOrdinal()
  .domain(entries.map(d => d.type))
  .range(d3.schemeTableau10)

const root = d3.hierarchy({
  name: 'types',
  children: entries.map(d => ({ name: d.type, value: d.count }))
})
.sum(d => d.value)
.sort((a, b) => (b.value || 0) - (a.value || 0))

d3.treemap()
  .size([BASE_WT, BASE_HT - marginT.top - marginT.bottom])
  .paddingInner(2)
  .round(true)(root)

const gT = svgT.append('g')
  .attr('transform', `translate(${marginT.left}, ${marginT.top})`)

const cells = gT.selectAll('g.cell')
  .data(root.leaves())
  .enter()
  .append('g')
  .attr('class', 'cell')
  .attr('transform', d => `translate(${d.x0}, ${d.y0})`)

cells.append('rect')
  .attr('width', d => Math.max(0, d.x1 - d.x0))
  .attr('height', d => Math.max(0, d.y1 - d.y0))
  .attr('fill', d => colorT(d.data.name))
  .attr('stroke-width', 2)

cells.append('text')
  .attr('x', 6)
  .attr('y', 18)
  .attr('font-size', '11px')
  .attr('font-weight', 'normal')
  .attr('fill', '#ffffffff')
  .each(function(d) {
    const sel = d3.select(this)
    const w = d.x1 - d.x0
    const h = d.y1 - d.y0
    const pct = d3.format('.1%')(d.value / totalTypes)

    sel.text(null).selectAll('tspan').remove()

    const addLine = (text, dy) => {
      sel.append('tspan')
        .attr('x', 6)
        .attr('dy', dy)
        .text(text)
    }

    if (w >= 80 && h >= 50) {
      addLine(`${d.data.name}s`, 0)
      addLine(`${d.value} lieux`, 14)
      addLine(`${pct}`, 14)
    } else if (w >= 20 && h >= 20) {
      addLine(`${d.value}`)
    } else {
      sel.remove()
    }
  })

const tip = d3.select('body')
  .append('div')
  .style('position', 'fixed')
  .style('pointer-events', 'none')
  .style('background', 'rgba(255,255,255,0.98)')
  .style('border', '1px solid #ccc')
  .style('border-radius', '4px')
  .style('padding', '8px 10px')
  .style('font', '13px system-ui, -apple-system, sans-serif')
  .style('color', '#222')
  .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
  .style('display', 'none')
  .style('z-index', '1000')

cells
  .style('cursor', 'pointer')
  .on('mousemove', function (event, d) {
    const pct = d3.format('.1%')(d.value / totalTypes)
    tip
      .style('display', 'block')
      .style('left', (event.clientX + 12) + 'px')
      .style('top', (event.clientY + 12) + 'px')
      .html(`<strong>${d.data.name}</strong><br/>${d.value} lieux<br/>${pct} du total`)
  })
  .on('mouseleave', () => tip.style('display', 'none'))

/* ########################## */
/* Nombre de gares par région */
/* ########################## */

const stationsData = window.stationsData

const stationsByRegion = { }
stationsData.forEach(station => {
  const deptCode = station.postal_code.substring(0, 2)
  const regionCode = regionCodeByDepartement[deptCode]
  if (regionCode && regionsByInseeCode[regionCode]) {
    const regionName = regionsByInseeCode[regionCode].abbr
    stationsByRegion[regionName] = (stationsByRegion[regionName] || 0) + 1
  }
})

const dataset3 = orderedRegions.map(region => ({
  region,
  count: stationsByRegion[region] || 0
}))

const BASE_W3 = BASE_W
const BASE_H3 = 400
const margin3 = { top: 0, right: MARGIN_R, bottom: 60, left: MARGIN_L }

const svg3 = d3.select('#stations-by-regions-count')
  .attr('class', 'chart')
  .attr('viewBox', `0 0 ${BASE_W3} ${BASE_H3}`)
  .attr('preserveAspectRatio', 'xMidYMid meet')

const x3 = d3.scaleBand()
  .domain(dataset3.map(d => d.region))
  .range([margin3.left, BASE_W3 - margin3.right])
  .padding(PAD)

const y3 = d3.scaleLinear()
  .domain([0, d3.max(dataset3, d => d.count)])
  .nice()
  .range([BASE_H3 - margin3.bottom, margin3.top])

// barres
svg3.selectAll('rect')
  .data(dataset3)
  .enter()
  .append('rect')
  .attr('x', d => x3(d.region))
  .attr('y', d => y3(d.count))
  .attr('width', x3.bandwidth())
  .attr('height', d => y3(0) - y3(d.count))
  .attr('fill', '#8ab3ffff')

// Courbe du nombre de lieux

const placesByRegion = datasetOrdered.map(d => ({
  region: d.region,
  places: d3.sum(types.map(t => d[t] || 0))
}))

// Échelle Y 
const yPlaces = d3.scaleLinear()
  .domain([0, d3.max(placesByRegion, d => d.places)])
  .nice()
  .range([BASE_H3 - margin3.bottom, margin3.top])

// Axe droit
svg3.append('g')
  .attr('transform', `translate(${BASE_W3 - margin3.right}, 0)`)
  .call(d3.axisRight(yPlaces).ticks(5))
  .call(g => g.selectAll('text').attr('fill', '#357cff'))
  .call(g => g.selectAll('path,line').attr('stroke', '#357cff'))

// Génération ligne
const linePlaces = d3.line()
  .x(d => x3(d.region) + x3.bandwidth() / 2)
  .y(d => yPlaces(d.places))

svg3.append('path')
  .datum(placesByRegion)
  .attr('fill', 'none')
  .attr('stroke', '#357cff')
  .attr('stroke-width', 2)
  .attr('d', linePlaces)

svg3.selectAll('.place-dot')
  .data(placesByRegion)
  .enter()
  .append('circle')
  .attr('class', 'place-dot')
  .attr('cx', d => x3(d.region) + x3.bandwidth() / 2)
  .attr('cy', d => yPlaces(d.places))
  .attr('r', 4)
  .attr('fill', '#357cff')
  .attr('stroke-width', 1)

// Légende 
const legend3 = svg3.append('g')
  .attr('transform', `translate(${margin3.left}, 420)`)

legend3.append('rect')
  .attr('x', 0).attr('y', -10)
  .attr('width', 12).attr('height', 12)
  .attr('fill', '#8ab3ffff')

legend3.append('text')
  .attr('x', 18).attr('y', 0)
  .attr('dominant-baseline', 'middle')
  .attr('font-size', 12)
  .text('Gares')

legend3.append('line')
  .attr('x1', 120).attr('x2', 150)
  .attr('y1', -4).attr('y2', -4)
  .attr('stroke', '#357cff')
  .attr('stroke-width', 2)

legend3.append('text')
  .attr('x', 158).attr('y', 0)
  .attr('dominant-baseline', 'middle')
  .attr('font-size', 12)
  .text('Lieux')

// Labels
svg3.selectAll('.label')
  .data(dataset3)
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', d => x3(d.region) + x3.bandwidth() / 2)
  .attr('y', d => y3(d.count) - 5)
  .attr('text-anchor', 'middle')
  .attr('font-size', '12px')
  .attr('fill', '#000')
  .text(d => d.count)

// Axes
svg3.append('g')
  .attr('transform', `translate(0, ${BASE_H3 - margin3.bottom})`)
  .call(d3.axisBottom(x3))
  .selectAll('text')
  .attr('text-anchor', 'end')
  .attr('transform', 'rotate(-35)')
  .attr('dx', '-0.6em')
  .attr('dy', '0.2em')

svg3.append('g')
  .attr('transform', `translate(${margin3.left}, 0)`)
  .call(d3.axisLeft(y3))