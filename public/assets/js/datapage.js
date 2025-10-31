const regionCountData = window.regionCountData

const types = Array.from(new Set(regionCountData.flatMap(d => Object.keys(d.types))));

const dataset = regionCountData.map(d => {
  const obj = { region: d.region_code };
  types.forEach(type => {
    obj[type] = d.types[type] || 0;
  });
  return obj;
});

const stack = d3.stack()
  .keys(types);

const series = stack(dataset);

const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 50 };

const svg = d3.select('#region-count-chart')
  .attr('width', width)
  .attr('height', height);

const x = d3.scaleBand()
  .domain(dataset.map(d => d.region))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d3.sum(types.map(t => d[t])))])
  .nice()
  .range([height - margin.bottom, margin.top]);

const color = d3.scaleOrdinal()
  .domain(types)
  .range(d3.schemeTableau10);

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
    .attr('width', x.bandwidth());

svg.append('g')
  .attr('transform', `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(x));

svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));

svg.selectAll('.totalLabel')
  .data(dataset)
  .enter()
  .append('text')
  .attr('x', d => x(d.region) + x.bandwidth() / 2)
  .attr('y', d => y(d3.sum(types.map(t => d[t]))) - 5)
  .attr('text-anchor', 'middle')
  .text(d => d3.sum(types.map(t => d[t])))
  .attr('font-size', '12px')
  .attr('fill', '#000');

const legendX = width - margin.right - 150;
const legendY = margin.top;

const legend = svg.append('g')
  .attr('transform', `translate(${legendX}, ${legendY})`);

types.forEach((type, i) => {
  const g = legend.append('g')
    .attr('transform', `translate(0, ${i * 20})`);

  g.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', color(type));

  g.append('text')
    .attr('x', 20)
    .attr('y', 12) 
    .text(type)
    .attr('font-size', '12px')
    .attr('fill', '#000');
});


/* ######################### */


//