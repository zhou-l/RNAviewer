// global variables
var g_margin = { left: 20, right: 20, top: 30, bottom: 30 };

// bar charts
var g_bcwidth = 1200;
var g_bcheight = 600;

// dot plots
var g_dpwidth = 1000;
var g_dpheight = 400;

// body view
var g_bvwidth = 400;
var g_bvheight= 600;
var g_orgBodyImgWidth = 493;
var g_orgBodyImgHeight = 1125;

// global data
var g_tmpMeanVal = [];
var g_exprValColorMap = [];
var g_pathFiles = ['./data/pathHeadNeck.txt','./data/pathLegs.txt','./data/pathTorso.txt',
'./data/pathPerinaeum.txt','./data/pathArmsHands.txt'];

var g_sgwidth = 1400;
var g_sgLegendWidth = 100;
var g_sgheight = 300;
// selected row of the data
var g_selectedRow = 0;
var g_selectedData = null;
// // colormap steps for colors
// [0-3）
// [3-6）
// [6-11）
// [11-26）
// [26-51）
// [51-101）
// [101-501）
// [501，+∞）
var g_colormapThres = [0, 3, 6, 11, 26, 51, 101, 501];

function drawBodyView(data, className, divName, width, height, margin)
{

    var svg = d3.select(divName)
    .append("svg")
    .attr('class', className)
    .attr('id', className)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var svg_img=  svg.append('svg:image')
                    .attr('x','0')
                    .attr('y','0');
    var logoUrl = "./data/body.png";


    var parts = [1, 2, 3, 4];

    var testVal = [0.11, 5, 8, 20, 30, 80, 200, 599];
    var nodeParts = svg.selectAll(".legend")
    .data(testVal)
    .enter()
    .append("circle")
    .attr("class", "bodyParts")
    .attr("id",function(d,i){return i;})
    .attr("r",10)
    .attr("cx", function(d,i){return width - 35;})
    .attr("cy", function(d,i){return 20 + 25*i;})
    .style("fill", function(d,i){return g_exprValColorMap(d)})
    ;

    svg.append("g").selectAll(".legendLabels")
      .data(g_colormapThres)
      .enter()
      .append("text")
      .style("font-size", "12px")
      .attr("x", width-25)
      .attr("y", function (d, i) { 
          return 20 + i * 25; }) // 100 is where the first dot appears. 25 is the distance between dots
      // .style("fill", function (d,i) { return gDefaultColRange(i); })
      .text(function (d, i) { 
        //   var newStr = d.replace(/ *\（[^)]*\） */g, "");
        //    return newStr; 
        var thres = null;
        if(i < g_colormapThres.length-1)
            thres = "["+d+","+g_colormapThres[i+1]+")"; 
        else
            thres = "["+d+",+inf)";

        return thres;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")


    // Draw parts
    // Warning: All body parts are transformed to correct positions with hard coded transformation information
    // TODO: figure out what went wrong!
    var parts = [1];//[1,2,3,4,5];
    var nodePartSilhouette = svg.append("g").attr("class", "bodyShape");
    var allPathData = [];
    var xscale = 0.65*width/g_orgBodyImgWidth;
    var yscale = height/g_orgBodyImgHeight;

    console.log(g_tmpMeanVal[g_selectedRow]);

    d3.queue()
    .defer(d3.csv, "./data/pathPalmSole1.txt")
    .defer(d3.csv, "./data/pathPalmSole2.txt")
    .defer(d3.csv, "./data/pathPalmSole3.txt")
    .defer(d3.csv, "./data/pathPalmSole4.txt")
    .defer(d3.csv, "./data/pathExtremities1.txt")
    .defer(d3.csv, "./data/pathExtremities2.txt")
    .defer(d3.csv, "./data/pathExtremities3.txt")
    .defer(d3.csv, "./data/pathHeadNeck.txt")
    .defer(d3.csv, "./data/pathPerinaeum.txt")
    .defer(d3.csv, "./data/pathTorso.txt")
    .await(function(error, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10) {
    if (error) throw error;
        var bodyPart1_1 = nodePartSilhouette
        .append('path')
        .attr("id","pathPalmSole")
        .attr("class","bodyOutline")
        .attr("d", function(){
            var pathStr = "M ";

            for(var i = 0; i < data1.length; i++)
            {
                if(i > 0)
                    pathStr += "L " + data1[i].x * xscale + " " + data1[i].y * yscale+" ";
                else
                    pathStr += data1[i].x * xscale + " " + data1[i].y * yscale +" ";
                if(i == data1.length-1)
                    pathStr += "z";
            }
            return pathStr;
        })
        .style("fill", function () {
            if(g_selectedRow >= 0 && g_selectedRow < g_tmpMeanVal.length) 
                return g_exprValColorMap(+g_tmpMeanVal[g_selectedRow].PalmSole);
            else
                return g_exprValColorMap(0); })
        .style("opacity","0.5")
         .attr("transform","translate("+ 70 +","+0+")");

        var bodyPart1_2 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPalmSole")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";

                for (var i = 0; i < data2.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data2[i].x * xscale + " " + data2[i].y * yscale + " ";
                    else
                        pathStr += data2[i].x * xscale + " " + data2[i].y * yscale + " ";
                    if (i == data2.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () {
                if(g_selectedRow >= 0 && g_selectedRow < g_tmpMeanVal.length) 
                    return g_exprValColorMap(+g_tmpMeanVal[g_selectedRow].PalmSole);
                else
                    return g_exprValColorMap(0); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart1_3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPalmSole")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data3.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data3[i].x * xscale + " " + data3[i].y * yscale + " ";
                    else
                        pathStr += data3[i].x * xscale + " " + data3[i].y * yscale + " ";
                    if (i == data3.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () {
                if(g_selectedRow >= 0 && g_selectedRow < g_tmpMeanVal.length) 
                {
                    var val = +g_tmpMeanVal[g_selectedRow].PalmSole;
                    console.log(val);
                    return g_exprValColorMap(val);
                }

                else
                    return g_exprValColorMap(0); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart1_4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPalmSole")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data4.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data4[i].x * xscale + " " + data4[i].y * yscale + " ";
                    else
                        pathStr += data4[i].x * xscale + " " + data4[i].y * yscale + " ";
                    if (i == data4.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () {
                if(g_selectedRow >= 0 && g_selectedRow < g_tmpMeanVal.length) 
                    return g_exprValColorMap(+g_tmpMeanVal[g_selectedRow].PalmSole);
                else
                    return g_exprValColorMap(0); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");


            var bodyPart2_1 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data5.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data5[i].x * xscale + " " + data5[i].y * yscale + " ";
                    else
                        pathStr += data5[i].x * xscale + " " + data5[i].y * yscale + " ";
                    if (i == data5.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () {
                if(g_selectedRow >= 0 && g_selectedRow < g_tmpMeanVal.length) 
                    return g_exprValColorMap(+g_tmpMeanVal[g_selectedRow].Extremities);
                else
                    return g_exprValColorMap(0); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            
            var bodyPart2_2 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data6.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data6[i].x * xscale + " " + data6[i].y * yscale + " ";
                    else
                        pathStr += data6[i].x * xscale + " " + data6[i].y * yscale + " ";
                    if (i == data6.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            
            var bodyPart2_3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data7.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data7[i].x * xscale + " " + data7[i].y * yscale + " ";
                    else
                        pathStr += data7[i].x * xscale + " " + data7[i].y * yscale + " ";
                    if (i == data7.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathHeadNeck")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data8.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data8[i].x * xscale + " " + data8[i].y * yscale + " ";
                    else
                        pathStr += data8[i].x * xscale + " " + data8[i].y * yscale + " ";
                    if (i == data8.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPerinaeum")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data9.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data9[i].x * xscale + " " + data9[i].y * yscale + " ";
                    else
                        pathStr += data9[i].x * xscale + " " + data9[i].y * yscale + " ";
                    if (i == data9.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart5 = nodePartSilhouette
            .append('path')
            .attr("id", "pathBody")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data10.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data10[i].x * xscale + " " + data10[i].y * yscale + " ";
                    else
                        pathStr += data10[i].x * xscale + " " + data10[i].y * yscale + " ";
                    if (i == data10.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            // Update fill colors
            redrawAll();
    });

    svg_img.attr('height', height)
        .attr('width', width)
        .attr('xlink:href', logoUrl)
        .attr("fill", "black")
        .style('stroke', '#AAA')
        .style("opacity",0.8)
        ;

 
    return svg_img;
}

function setupSearchView(g_tmpMeanVal, className, divName, width, height, margin)
{
    
    var svg = d3.select("#rnaInfo")
    .append("svg")

    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("width", 500)
    .attr("height", 300)
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 200) + ")")
    ;

    var textSvg = svg.append("g");
    textSvg
    .append('text')
    .attr('class', "rnaInfoText")
    .attr('id', "rnaInfoText1")
    .attr("x", 0)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Link1!")
    .on("click", function(d) {window.open("http://news.qq.com");})
    // .on("mouseover", function(d, i){ 
    //     d3.select(this) 
    //         .attr({"xlink:href": "http://example.com/" + d});
    // })
    ;

    textSvg
    .append('text')
    .attr('class', "rnaInfoText")
    .attr('id', "rnaInfoText2")
    .attr("x", 50)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Link2!")
    .on("click", function(d) {window.open("http://google.com");});

    // return svg;
    d3.select("#rnaSearchButton")
    .on("click", function(){doSearch();})


}


function doSearch() {
    var txtName = document.getElementById("rnaSearchBox");
    console.log(txtName.value);
    // do a simple traversal, for now
    for(var i = 0; i < g_tmpMeanVal.length; i++)
    {
        if(g_tmpMeanVal[i].Symbol.toLowerCase() === txtName.value.toLowerCase())
        {
            if(i != g_selectedRow){
                g_selectedRow = i;
                g_selectedData = g_tmpMeanVal[g_selectedRow];
                console.log("found!");
                redrawAll();
            }
            return;
        }
    }
  }

function drawDotplots()
{


}

function drawBarcharts(data, selectedRow, className, divName, width, height, margin)
{
    // append the svg object to the body of the page
    var svg = d3.select(divName)
        .append("svg")
        .attr('class', className)
        .attr('id', className)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var keys = data.columns.slice(1);
    console.log(keys);
    var selectedData = data[selectedRow];
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .rangeRound([margin.left, width - margin.right])
        // .domain(function (d) { 
        // })
        .domain(keys)
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        //  .attr("transform", "translate(10,0)")
        .style("text-anchor", "center");
    // convert data row to keys
    var convertedData = [];
    for (var i = 0; i < keys.length; i++) {
        var item = { key: keys[i], val: +selectedData[keys[i]] };
        // item.key = keys[i];
        // item.val = +selectedData[keys[i]];
        convertedData.push(item);
    }
    // Add Y axis
    var y = d3.scaleLinear()
        // .domain([0, d3.max(selectedData, function(d){return d3.max(d.val);})]).nice()
        .range([height, 0])
        .rangeRound([height - margin.bottom, margin.top]);
    y.domain([0, d3.max(convertedData, function (d) { return d.val; })]).nice();
    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // Bars

    svg.selectAll("mybar")
        .data(convertedData)
        .enter()
        .append("rect")
        .attr("class", "mybar")
        .attr("x", function (d) {
            return x(d.key);
        })
        .attr("y", function (d) {
            console.log(y(d.val));
            return y(d.val);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return y(0) - y(d.val); })
        .attr("fill", "steelblue")

}

// Update views with different search terms
function redrawAll()
{
    if(g_selectedRow < 0 || g_selectedRow >= g_tmpMeanVal.length)
    return;

    // update the body view
   const bodyView = d3.select("#bodyView");
   var partHeadNeck = bodyView.selectAll("#pathHeadNeck")
   .style("fill", function(){
       var val = g_tmpMeanVal[g_selectedRow].HeadNeck;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partExtremities = bodyView.selectAll("#pathExtremities")
   .style("fill", function(){
       var val = g_tmpMeanVal[g_selectedRow].Extremities;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partPerinaeum = bodyView.selectAll("#pathPerinaeum")
   .style("fill", function(){
       var val = g_tmpMeanVal[g_selectedRow].Perinaeum;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partBody = bodyView.selectAll("#pathBody")
   .style("fill", function(){
       var val = g_tmpMeanVal[g_selectedRow].Body;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partPalmSole = bodyView.selectAll("#pathPalmSole")
   .style("fill", function(){
       var val = g_tmpMeanVal[g_selectedRow].PalmSole;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   // update the bar charts
   d3.select("#barchart").remove();
   drawBarcharts(g_tmpMeanVal, g_selectedRow, "barchart", "#dotplotView", g_dpwidth, g_dpheight, g_margin);

   // update the text 
   d3.select("#rnaInfoText")
   .text(function() {return g_tmpMeanVal[g_selectedRow].Symbol; });
}

function exprValColormap(){
    var colormap = d3.scaleThreshold()
    .domain([0,3,6,11,26,51,101,501,1000000])
    .range( d3.schemeYlOrRd[9]);
    return colormap;
}



function rnaViewerMain()
{
    // g_exprValColorMap = d3.scaleOrdinal(d3.schemeYlOrRd[5]);
    // g_exprValColorMap = d3.scaleSequential(d3.interpolateYlOrRd);

    g_exprValColorMap = exprValColormap();
    g_selectedRow = 0;
    // 0. set up views  
    // drawBodyView(g_tmpMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    // 0.load data
    d3.csv("./data/tpm_meanVal.csv", function(data){
        for(var i = 0; i < data.length; i++)
        {
            data[i].symbol = data[i].symbol;
            data[i].HeadNeck = +data[i].HeadNeck;
            data[i].Body = +data[i].Extremities;
            data[i].PalmSole = +data[i].PalmSole;
            data[i].Perinaeum = +data[i].Perinaeum;
        }
        g_tmpMeanVal = data;

        // 1.setup views
        drawBodyView(g_tmpMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);

        // 2. setup search box
        setupSearchView(g_tmpMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
        // 2.1 setup drop box
        // d3.select("#rnaDropbox")
        // .selectAll('rnaOptions')
        // .data(g_tmpMeanVal)
        // .enter()
        // .text(function (d) { return d.Symbol; }) // text showed in the menu
        // .attr("value", function (d,i) { return i; }) // corresponding value returned by the button
        // .property("selected", function(d){ return d.Symbol === g_tmpMeanVal[g_selectedRow]; });
        
        // 3. setup barchart
        drawBarcharts(g_tmpMeanVal, g_selectedRow, "barchart", "#dotplotView", g_dpwidth, g_dpheight, g_margin);


    });
}