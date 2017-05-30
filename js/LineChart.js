var LineChart = function() {
    'use strict';

    var margin = {
        top: 10,
        right: 200,
        bottom: 40,
        left: 50
    };
    
    //var selectedStates = ["Delhi"];
    //var selectedData = [];

    // SVG width and height
    var width = 400;
    var height = 200;

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Global scale and axis variables
    var xFormat = d3.format("d");
    var yFormat = d3.format('.2s')
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();
    var xAxis = d3.axisBottom().tickFormat(xFormat);;
    var yAxis = d3.axisLeft().tickFormat(yFormat);

    

    var chart = function(selection) {

        var allValues = [];
        console.log(selection);
        selection.each(function(data) {
            console.log(data);
            data.forEach(function(d) {
                console.log(d.values);
                d.values.forEach(function(d2){
                    allValues.push(+d2.baseline);
                    allValues.push(+d2.MN1);
                    allValues.push(+d2.combined1);
                })
               
            });
            

        function setScales() {
            // Get set of all values
            
            //console.log(selection);
            

            // Reset xScale
            console.log(allValues);
/*            var xExtent = d3.extent(data, function(d) {
                console.log(d.values);
                d.values.forEach(function(d2) {
                    console.log(d2);
                    return +d2.year;
                });
                //return +d.values.year;
            });*/
            var xExtent = [];
            data.forEach(function(d) {
                d.values.forEach(function(d2) {
                    xExtent.push(d2.year);
                })
            })
            console.log(data.length);
            xScale.domain([d3.min(xExtent), 14]).rangeRound([0, drawWidth]); //TODO: d3.max(xExtent) not returning 14???

            // Reset yScale
            var yExtent = d3.extent(allValues);
            yScale.domain([0 , yExtent[1] ]).rangeRound([drawHeight, 0]);

            // Reset color scale to current set of countries
            //console.log(selectedStates)
            //colorScale.domain(selectedStates);
        }

        function setAxes() {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel.transition().duration(1000).call(xAxis);
            yAxisLabel.transition().duration(1000).call(yAxis);
        }
        // Graph width and height - accounting for margins
        var drawWidth = width - margin.left - margin.right;
        var drawHeight = height - margin.top - margin.bottom;

        var ele = d3.select(this);
        var svg = ele.selectAll('svg').data(data)




        
        console.log('here');
        var svgEnter = svg.enter()
            .append('svg')
            .attr('width', width)
            .attr('height', height);


    
        var ordinal = d3.scaleOrdinal()
            .domain(["No policy", "Mandatory Notification", "MN, First Person Consent"])
            .range([ "#BF6059", "#499996", "#E2A855"]);

        //var svg2 = d3.selectAll("svg");

        svgEnter.append("g")
            //.attr("class", "legendQuant")
            .attr("transform", "translate(" + (drawWidth - margin.right * 1.5)+ "," + (drawHeight + margin.bottom / 3) + ")")
            .append('g')
            .attr('class','legendOrdinal');

        var legend = d3.legendColor()
            //.labelFormat(d3.format(".2f"))
            //.labels(d3.legendHelpers.thresholdLabels)
            //.labels(["No policy", "Mandatory Notification", "MN and First Person Consent"])
            .labelWrap(30)
            .shapeWidth(80)
            //.labelAlign("start")
            .orient('horizontal')
            .scale(ordinal);

        svgEnter.select(".legendOrdinal")
            .call(legend);


        // Append g for holding chart markers
        svgEnter.append("g")
            .attr('id', 'graph')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // xAxis labels
        var xAxisLabel = svgEnter.append("g")
            .attr('transform', 'translate('+ margin.left + ','+ (drawHeight) + ')')
            .attr('class', 'axis')

        // xAxis Text
        svgEnter.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'translate(' + (drawWidth / 2 + margin.left)  + ',' + (drawHeight + margin.top + 40) + ')')
            .style('text-anchor', 'middle')
            .text("Year")

        // yAxis labels
        var yAxisLabel = svgEnter.append("g")
            .attr('transform', 'translate(' + margin.left + ')')
            .attr('class', 'axis')

        svgEnter.append('text')
            .attr('class', 'axis-label')
            //.attr('transform', 'rotate(-90)')
            .attr('transform', 'translate(' + (margin.left - 60) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            //.attr('y', 0 )
            //.attr('x', 0 - (drawHeight / 2) - margin.left)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text("Corneal Transplants")

        // Apend an overlay rectangle to catch hover events
        var overlay = svgEnter.append('rect')
            .attr("class", "overlay")
            .attr('width', drawWidth)
            .attr('height', drawHeight);

        var line = d3.line()
            .x(function(d) {
                console.log(d) 
                return xScale(d.year); 
            })
            .y(function(d) { 
                return yScale(d.baseline); 
            });

        var line2 = d3.line()
            .x(function(d) {
                //console.log(d) 
                return xScale(d.year); 
            })
            .y(function(d) { 
                return yScale(d.MN1); 
            });

        var line3 = d3.line()
            .x(function(d) {
                //console.log(d) 
                return xScale(d.year); 
            })
            .y(function(d) { 
                return yScale(d.combined1); 
            });

        setScales();
        setAxes();

        // Do a datajoin between your path elements and the data passed to the draw function
        // Make sure to set the identifying key
        var countries = ele.select('#graph').selectAll('.countries')
            .data(data, function(d){
                console.log(d);
                return d.key
            })

        // Handle entering elements (see README.md)
        var path = countries.enter()
            .append('path')
            .attr("class", "countries")
            .attr("d", function(d){
                return line(d.values)
            })
            .attr("fill", "none")
            .attr("stroke-width", 2.5)
            .attr("stroke", '#BF6059')
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return LENGTH;
            })
            .transition()
            .duration(2000)
            .attr("stroke-dasharray", function(d) { 
                var LENGTH = d3.select(this).node().getTotalLength();
                return LENGTH + " " + LENGTH; 
            })
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return 0;
            })

        // Handle updating elements (see README.md)
        countries.merge(countries)
            .attr("stroke-dasharray", "none")
            .transition()
            .duration(2000)
            .attr("d", function(d){
                return line(d.values)
            })
            

        // Handle exiting elements (see README.md)
        countries.exit().remove()

        var countries2 = ele.select('#graph')
            .selectAll('.countries2')
            .data(data, function(d){
                //console.log(d);
                return d.key
            })

        // Handle entering elements (see README.md)
        var path2 = countries2.enter()
            .append('path')
            .attr("class", "countries2")
            .attr("d", function(d){
                console.log("here")
                return line2(d.values)
            })
            .attr("fill", "none")
            .attr("stroke-width", 2.5)
            .attr("stroke", '#499996')
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return LENGTH;
            })
            .transition()
            .duration(2000)
            .attr("stroke-dasharray", function(d) { 
                var LENGTH = d3.select(this).node().getTotalLength();
                return LENGTH + " " + LENGTH; 
            })
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return 0;
            })

        // Handle updating elements (see README.md)
        countries2.merge(countries2)
            .attr("stroke-dasharray", "none")
            .transition()
            .duration(2000)
            .attr("d", function(d){
                return line2(d.values)
            })
            

        // Handle exiting elements (see README.md)
        countries2.exit().remove()

        var countries3 = ele.select('#graph')
            .selectAll('.countries3')
            .data(data, function(d){
                //console.log(d);
                return d.key
            })

        // Handle entering elements (see README.md)
        var path3 = countries3.enter()
            .append('path')
            .attr("class", "countries3")
            .attr("d", function(d){
                return line3(d.values)
            })
            .attr("fill", "none")
            .attr("stroke-width", 2.5)
            .attr("stroke", '#E2A855')
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return LENGTH;
            })
            .transition()
            .duration(2000)
            .attr("stroke-dasharray", function(d) { 
                var LENGTH = d3.select(this).node().getTotalLength();
                return LENGTH + " " + LENGTH; 
            })
            .attr("stroke-dashoffset", function(d){
                var LENGTH = d3.select(this).node().getTotalLength()
                return 0;
            })

        // Handle updating elements (see README.md)
        countries3.merge(countries3)
            .attr("stroke-dasharray", "none")
            .transition()
            .duration(2000)
            .attr("d", function(d){
                return line3(d.values)
            })
            

        // Handle exiting elements (see README.md)
        countries3.exit().remove()


        this.drawHovers = function(year) {
            // Bisector function to get closest data point: note, this returns an *index* in your array
            var bisector = d3.bisector(function(d, x) {
                return +d.year - x;
            }).left;

            // Get hover data by using the bisector function to find the y value
            var years = data.map(function(d){
                d.values.sort(function(a,b){
                    return +a.year - +b.year;
                });
                return (d.values[bisector(d.values, year)]);
            })

            // Do a data-join (enter, update, exit) to draw circles
            var circles1 = g.selectAll('.circle1').data(years, function(d){
                return d.baseline;
            })

            circles1.enter().append('circle').attr('class','circle1').attr('fill', 'none').attr("stroke-width", 2.5).attr('stroke', '#BF6059');

            circles1.transition().duration(0).attr('cx', function(d){
                return xScale(d.year);
            }).attr('cy', function(d){
                return yScale(d.baseline);
            }).attr('r', 15);

            circles1.exit().remove();

            // Do a data-join (enter, update, exit) draw text
            var labels1 = g.selectAll('.label1').data(years, function(d){
                return d.baseline;
            })

            labels1.enter().append('text').attr('class', 'label1');
            
            labels1.transition().duration(0).attr('x', function(d){
                return xScale(d.year);
            }).attr('y', function(d){
                return yScale(d.baseline);
            }).text(function(d){
                return "No Policy: " + d.baseline;
            })

            labels1.exit().remove();

            // Do a data-join (enter, update, exit) to draw circles
            var circles2 = g.selectAll('.circle2').data(years, function(d){
                return d.MN1;
            })

            circles2.enter().append('circle').attr('class','circle2').attr('fill', 'none').attr("stroke-width", 2.5).attr('stroke', '#499996')

            circles2.transition().duration(0).attr('cx', function(d){
                return xScale(d.year);
            }).attr('cy', function(d){
                return yScale(d.MN1);
            }).attr('r', 15);

            circles2.exit().remove();

            // Do a data-join (enter, update, exit) draw text
            var labels2 = g.selectAll('.label2').data(years, function(d){
                return d.MN1;
            })

            labels2.enter().append('text').attr('class', 'label2');
            
            labels2.transition().duration(0).attr('x', function(d){
                return xScale(d.year);
            }).attr('y', function(d){
                return yScale(d.MN1);
            }).text(function(d){
                return "Mandatory Notification (MN): " + d.MN1;
            })

            labels2.exit().remove();

            // Do a data-join (enter, update, exit) to draw circles
            var circles3 = g.selectAll('.circle3').data(years, function(d){
                return d.combined1;
            })

            circles3.enter().append('circle').attr('class','circle3').attr('fill', 'none').attr("stroke-width", 2.5).attr('stroke', '#E2A855')

            circles3.transition().duration(0).attr('cx', function(d){
                return xScale(d.year);
            }).attr('cy', function(d){
                return yScale(d.combined1);
            }).attr('r', 15);



            circles3.exit().remove();

            // Do a data-join (enter, update, exit) draw text
            var labels3 = g.selectAll('.label3').data(years, function(d){
                return d.combined1;
            })

            labels3.enter().append('text').attr('class', 'label3');
            
            labels3.transition().duration(0).attr('x', function(d){
                return xScale(d.year);
            }).attr('y', function(d){
                return yScale(d.combined1);
            }).text(function(d){
                return "First Person Consent and MN: " + d.combined1;
            })


            
            labels3.exit().remove();
            
        }
    });
    


}

        
    chart.width = function(value) {
        if(!arguments.length) return width;
        width = value;
        return chart;
    }
    chart.height = function(value) {
        if(!arguments.length) return height;
        height = value;
        return chart;
    }
    chart.margin = function(values) {
        if(!arguments.length) return margin;
        margin.top = values[0];
        margin.right = values[1];
        margin.bottom = values[2];
        margin.left = values[3];
        return chart;
    }

    return chart;


}


