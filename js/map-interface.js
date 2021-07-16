
// Getting geographic data:
// 1) Pick a shapefile from a public dataset like https://www.naturalearthdata.com/
// 2) Translate the shapefile into geoJSON via a converter like https://mapshaper.org/
// 3) Download the geoJSON file locally to your project 
// 4) Load the local geoJSON data into the webpage
// note: a convienent substitute for steps 1-3: https://geojson-maps.ash.ms/
d3.json("./data/earth.json").then( function(json){ update(json) } );

// Select a projection 
// 1) Translate the geoJSON data from 3D space to a specific 2D space
// 2) Configure the projection according to your viewport (scale, translate, etc)
/*
  some projections to explore
  d3.geoAlbers()
  d3.geoAzimuthalEqualArea()
  d3.geoAzimuthalEquidistant()
  d3.geoConicConformal()
  d3.geoConicEqualArea()
  d3.geoConicEquidistant()
  d3.geoEquirectangular()
  d3.geoGnomonic()
  d3.geoMercator()
  d3.geoOrthographic()
  d3.geoStereographic()
  d3.geoTransverseMercator()
*/
let projection = d3.geoMercator()
  .scale(100)
  .translate([500, 380])
  .center([0, 5]);

// Generate paths for your configured projection
let geoGenerator = d3.geoPath().projection(projection);


// ------
// update the graph with paths when the geoJSON finishes loading
function update(geojson) {
  let feats = d3.select('#content g.map')
    .selectAll('path')
    .data(geojson.features);

  feats.enter()
    .append('path')
    .attr('d', geoGenerator)
    .on('mouseover', showDetails);
}


// ------
// Show feature details on mouseHover
function showDetails(e, d) {

  // determine this feature's:      
  // 1) path length
  // 2) area in pixels
  // 3) boundary box as two pixel coordinates
  // 4) center point as a pixel coordinate
  let pathLength = geoGenerator.measure(d);
  let area = geoGenerator.area(d);
  let bounds = geoGenerator.bounds(d);
  let centerPoint = geoGenerator.centroid(d);

  // show current country name
  d3.select('#content .info .name').text( d.properties.name );

  // show current country details
  // you can add custom data directly to your geoJSON
  // or in an additional file
  d3.select('#content .info .details')
    .html( 
      "<span>Area: " + area.toFixed(1) + "</span>"
      + "<span>Path Length: " + pathLength.toFixed(1) + "</span>"
      + "<span>Center Point: " + centerPoint[0].toFixed(1) + ", " + centerPoint[1].toFixed(1) + "</span>"
    );

  // draw center point of the current country
  d3.select('#content .centroid')
    .style('display', 'inline')
    .attr('transform', 'translate(' + centerPoint + ')');

  // draw bounding box of the  current country
  d3.select('#content .bounding-box rect')
    .attr('x', bounds[0][0])
    .attr('y', bounds[0][1])
    .attr('width', bounds[1][0] - bounds[0][0])
    .attr('height', bounds[1][1] - bounds[0][1]);

}