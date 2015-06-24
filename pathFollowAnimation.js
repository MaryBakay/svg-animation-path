queue()
.defer(d3.xml, "path_one_line.svg", "image/svg+xml")
.await(ready);

function ready(error, xml) {

  //Adding our svg file to HTML document
  var importedNode = document.importNode(xml.documentElement, true);
  d3.select("#pathAnimation").node().appendChild(importedNode);

  var svg = d3.select("svg");

  var path = svg.select("path#wiggle"); //.call(transition)
  var startPoint = pathStartPoint(path);

  var marker = svg.append("image")
    .attr("xlink:href", "plane-2.png")
    .attr("transform", "translate(" + startPoint[0] + "," + startPoint[1] + ")")
    .attr("width", 48)
    .attr("height", 24);

  transition();
  //Get path start point for placing marker
  function pathStartPoint(path) {
    var d = path.attr("d"),
    dsplitted = d.split(" ");
    return dsplitted[1].split(",");//.split(",");
  }

  function transition() { //(path)
    marker.transition() //path.transition()
        .duration(7500)
        .attrTween("transform", translateAlong(path.node())); //.attrTween("stroke-dasharray", tweenDash)
        /*.each("end", transition);*/// infinite loop .each("end", function() { d3.select(this).call(transition); });
    path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash);
        /*.each("end", function() { d3.select(this).call(transition); });*/// infinite loop
  }

  /*function tweenDash() {
    var l = path.node().getTotalLength();
    var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
    return function(t) {
      var marker = d3.select("#marker");
      var p = path.node().getPointAtLength(t * l);
      marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker
      return i(t);
    }
  }*/
  function translateAlong(path) {
    var l = path.getTotalLength();
    var t0 = 0;
    return function(i) {
      return function(t) {
        var p0 = path.getPointAtLength(t0 * l);//previous point
        var p = path.getPointAtLength(t * l);////current point
        var angle = Math.atan2(p.y - p0.y, p.x - p0.x) * 180 / Math.PI;//angle for tangent
        t0 = t;
        //Shifting center to center of rocket
        var centerX = p.x - 24,
        centerY = p.y - 12;
        return "translate(" + centerX + "," + centerY + ")rotate(" + angle + " 24" + " 12" +")";
      }
    }
  }
  function tweenDash() {
    var l = path.node().getTotalLength();
    var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
    return function(t) {
      var marker = d3.select("#marker");
      var p = path.node().getPointAtLength(t * l);
      marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker
      return i(t);
    }
  }
}