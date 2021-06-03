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
var g_tpmMeanVal = [];
var g_tpmFullData = [];
var g_tpmSubInfo = [];
var g_exprValColorMap = [];
var g_pathFiles = ['./data/pathHeadNeck.txt','./data/pathLegs.txt','./data/pathTorso.txt',
'./data/pathPerinaeum.txt','./data/pathArmsHands.txt'];

var g_sgwidth = 1400;
var g_sgLegendWidth = 100;
var g_sgheight = 300;
// selected row of the data
var g_selectedRow = 0;
var g_selectedData = null;

// // colormap range of the body viewer
// [0-3）
// [3-6）
// [6-11）
// [11-26）
// [26-51）
// [51-101）
// [101-501）
// [501，+∞）
var g_colormapThres = [0, 3, 6, 11, 26, 51, 101, 501];
var g_colormapGroups = d3.scaleOrdinal(d3.schemePuOr[11]);

// function drawTable() {
//     var tableFname = "Result-MedicalTable.csv";
//     d3.csv(tableFname, function (error, data) {
//         if (error) throw error;

//         var sortAscending = true;
//         var table = d3.select('#page-wrap').append('table');


//         var dimensions = {};
//         dimensions.width = 500;
//         dimensions.height = 1200;
//         var width = dimensions.width + "px";
//         var height = dimensions.height + "px";
//         var twidth = (dimensions.width - 25) + "px";
//         var divHeight = (dimensions.height - 60) + "px";
//         var inner = table.append("tr").append("td")
//             .append("div").attr("class", "scroll").attr("width", width).attr("style", "height:" + divHeight + ";")
//             .append("table").attr("class", "bodyTable").attr("border", 1).attr("width", twidth).attr("height", height).attr("style", "table-layout:fixed");

//         var titles = d3.keys(data[0]);
//         gMedProperties = data;

//         var dataByCategory = d3.nest()
//             .key(function (d) { return d.class })
//             .entries(data);

//         var dataByExpCategory = d3.nest()
//             .key(function (d) { return d.classExp; })
//             .entries(data);

//         if (gDefaultMedClass == []) {
//             for (var k = 0; k < dataByCategory.length; k++) {
//                 gDefaultMedClass.push(dataByCategory[k].key);
//             }
//             var textbookOrder = [1, 3, 9, 0, 2, 7, 6, 10, 5, 4, 8];
//             var tmpNameList1 = [];
//             for (var i = 0; i < textbookOrder.length; i++)
//                 tmpNameList1.push(gDefaultMedClass[textbookOrder[i]]);
//             gDefaultMedClass = tmpNameList1;
//             // sort by name
//             // gDefaultMedClass.sort(function (a, b) { return d3.ascending(a, b); });
//             //sort med property by class order

//         }

//         for (var k = 0; k < dataByExpCategory.length; k++) {
//             gExpertMedClass.push(dataByExpCategory[k].key);
//         }
//         // // sort by name
//         // gExpertMedClass.sort(function (a, b) { return d3.ascending(a, b); });
//         var expOrder = [1, 3, 7, 0, 2, 5, 6, 4];
//         var tmpNameList = [];
//         for (var i = 0; i < expOrder.length; i++)
//             tmpNameList.push(gExpertMedClass[expOrder[i]]);
//         gExpertMedClass = tmpNameList;

//         if (gDefaultMedClass.length < 15)
//             gDefaultMedMajorClass = gDefaultMedClass;

//         //sort med property by class order
//         gMedProperties.sort(function (a, b) { return d3.ascending(a.expClass, b.expClass); });
//         console.log(gMedProperties);

//         var headers = inner.append('thead').append('tr')
//             .selectAll('th')
//             .data(titles).enter()
//             .append('th')
//             .text(function (d) {
//                 return d;
//             });


//         // var rows = table.append('tbody').selectAll('tr')
//         var rows = inner.append('tbody').selectAll('tr')
//             .data(data).enter()
//             .append('tr');
//         rows.selectAll('td')
//             .data(function (d) {
//                 return titles.map(function (k) {
//                     return { 'value': d[k], 'name': k };
//                 });
//             }).enter()
//             .append('td')
//             .attr('data-th', function (d) {
//                 return d.name;
//             })
//             .text(function (d) {
//                 return d.value;
//             });
//     });
// }

  
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

    // console.log(g_tpmMeanVal[g_selectedRow]);

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
            if(g_selectedRow >= 0 && g_selectedRow < g_tpmMeanVal.length) 
                return g_exprValColorMap(+g_tpmMeanVal[g_selectedRow].PalmSole);
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
                if(g_selectedRow >= 0 && g_selectedRow < g_tpmMeanVal.length) 
                    return g_exprValColorMap(+g_tpmMeanVal[g_selectedRow].PalmSole);
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
                if(g_selectedRow >= 0 && g_selectedRow < g_tpmMeanVal.length) 
                {
                    var val = +g_tpmMeanVal[g_selectedRow].PalmSole;
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
                if(g_selectedRow >= 0 && g_selectedRow < g_tpmMeanVal.length) 
                    return g_exprValColorMap(+g_tpmMeanVal[g_selectedRow].PalmSole);
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
                if(g_selectedRow >= 0 && g_selectedRow < g_tpmMeanVal.length) 
                    return g_exprValColorMap(+g_tpmMeanVal[g_selectedRow].Extremities);
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

function setupSearchView(g_tpmMeanVal, className, divName, width, height, margin)
{
    
    var svg = d3.select("#rnaInfo")
    .append("svg")
    .attr("class","rnaInfoSvg")
    .attr("width", 500)
    .attr("height", 300)
    .attr("transform", "translate(0," + (margin.top + 200) + ")");
    
    var ww = 120;
    var hh = 30;
    var tagMargin = {left:10, right:10, top:20, bottom:20};


    var externalLinks = ["GeneCards","NCBI","ensembl","proteinatlas"];

    var generalTextInfoNode = svg.append("text")
    .attr("class","generalInfoText")
    .attr("x", 10)
    .attr("y", 20)
    .text(function(){
        var info = g_tpmMeanVal[g_selectedRow].Symbol + " is found. Read more by clicking the sources below.";
        return info;
    })
    ;
    var infoOffset = 50;

    var node = svg.selectAll(".linkTag")
    .data(externalLinks)
    .enter()
    .append("g")
    .attr("class","linkTag");
     
    node.append("rect")
    .attr("width", ww - tagMargin.left - tagMargin.right)
    .attr("height", hh)
    .attr("x", function (d,i) { return ww*i; })
    .attr("y", function () { return infoOffset; })
    .style("fill", "#eeeeee")
    .on("click", function(d) {
        var link = null;
        if (d === "GeneCards")
            link = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=";
        else if (d === "NCBI")
            link = "https://www.ncbi.nlm.nih.gov/gene/?term=";
        else if (d === "ensembl")
            link = "http://asia.ensembl.org/Multi/Search/Results?q=";
        else if (d === "proteinatlas")
            link = "https://www.proteinatlas.org/search";
        else
            return;
        link += g_tpmMeanVal[g_selectedRow].Symbol;
        window.open(link);   
    });
    // .append()


    // var linkTag1 =  textSvg
     node.append('text')
    .attr('class', "rnaInfoText")
    .attr('id', "rnaInfoText1")
    .attr("x", function(d,i) { return ww*i + 10;})
    .attr("y", function(){return infoOffset + hh/2;})
    .attr("dy", ".35em")
    .text(function(d){return d;})
    .on("click", function(d) {
        var link = null;
        if (d === "GeneCards")
            link = "https://www.genecards.org/cgi-bin/carddisp.pl?gene=";
        else if (d === "NCBI")
            link = "https://www.ncbi.nlm.nih.gov/gene/?term=";
        else if (d === "ensembl")
            link = "http://asia.ensembl.org/Multi/Search/Results?q=";
        else if (d === "proteinatlas")
            link = "https://www.proteinatlas.org/search/";
        else
            return;
        link += g_tpmMeanVal[g_selectedRow].Symbol;
        window.open(link);   
    });
    
    
//     // textSvg
//     // .append('li');
//     var linkTag2 = textSvg.append("text")
//     .attr('class', "rnaInfoText")
//     .attr('id', "rnaInfoText2")
//     .attr("x", 50)
//     .attr("y", 10)
//     .attr("dy", ".35em")
//     .text("NCBI")
//     .on("click", function(d) {
//         var link = "https://www.ncbi.nlm.nih.gov/gene/?term=";
//         link += g_tpmMeanVal[g_selectedRow].Symbol;
//         window.open(link);
//     });

//     var linkTag3 = textSvg.append("text")
//     .attr('class', "rnaInfoText")
//     .attr('id', "rnaInfoText2")
//     .attr("x", 50)
//     .attr("y", 10)
//     .attr("dy", ".35em")
//     .text("ensembl")
//     .on("click", function(d) {
//         var link = "http://asia.ensembl.org/Multi/Search/Results?q=";
//         link += g_tpmMeanVal[g_selectedRow].Symbol;
//         window.open(link);
//     });

//    var linkTag4 = textSvg.append("text")
//     .attr('class', "rnaInfoText")
//     .attr('id', "rnaInfoText2")
//     .attr("x", 50)
//     .attr("y", 10)
//     .attr("dy", ".35em")
//     .text("proteinatlas")
//     .on("click", function(d) {
//         var link = "https://www.proteinatlas.org/search/";
//         link += g_tpmMeanVal[g_selectedRow].Symbol;
//         window.open(link);
//     });

    // return svg;
    d3.select("#rnaSearchButton")
    .on("click", function(){doSearch();})

}


function doSearch() {
    var txtName = document.getElementById("rnaSearchBox");
    console.log(txtName.value);
    // do a simple traversal, for now
    for(var i = 0; i < g_tpmMeanVal.length; i++)
    {
        if(g_tpmMeanVal[i].Symbol.toLowerCase() === txtName.value.toLowerCase())
        {
            if(i != g_selectedRow){
                g_selectedRow = i;
                g_selectedData = g_tpmMeanVal[g_selectedRow];
                console.log("found!");
                redrawAll();
            }
            return;
        }
    }
  }

function drawDotplots(data, subjectInfoData, className, divName, width, height, margin)
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

    var groups = g_tpmMeanVal.columns.slice(1);
    var selectedData = data;
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .rangeRound([margin.left, width - margin.right])
        // .domain(function (d) { 
        // })
        .domain(groups)
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        //  .attr("transform", "translate(10,0)")
        .style("text-anchor", "center");



    // Another scale for subgroup position?
    var subgroups = ['F', 'M'];
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // Group the data into subgroups
    var groupedData = [];
    var dkeys = d3.keys(data).slice(1);
    for(var i = 0; i < dkeys.length; i++)
    {
        // console.log(dkeys[i]);
        // Find the key in the subjectInfo data
        var info = subjectInfoData.filter(function(d) { 
            return d.id === dkeys[i];});
        if(info.length != 1)
            continue;
        // console.log(info);
        var datum = {val: data[dkeys[i]], group: info[0].location, age: info[0].age, sex: info[0].sex};
        groupedData.push(datum);

    }
    // Add Y axis
    var y = d3.scaleLinear()
        // .domain([0, d3.max(selectedData, function(d){return d3.max(d.val);})]).nice()
        .range([height, 0])
        .rangeRound([height - margin.bottom, margin.top]);
    y.domain([0, d3.max(groupedData, function (d) { return d.val; })]).nice();
    svg.append("g")
        .attr("transform", "t ranslate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(groupedData)
        .enter()
        .append("g")
        .attr("class", "subgroupedBars")
        .attr("transform", function (d) { return "translate(" + x(d.group) + ",0)"; })
        .selectAll("rect")
        .data(function (d) { 
            // console.log(d);
            // var newD = subgroups.map(function () {
            //     // console.log(kky);
            //     var kky = (d.sex === "female")? "F" : "M";
            //     return { key: kky, value: d.val }; }); 

            var kky = (d.sex === "female")? "F" : "M";
            var newD = [{key: kky, value: d.val }];
            console.log(newD);
                return newD;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            console.log(d); 
            return xSubgroup(d.key); })
        .attr("y", function (d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function (d) { return y(0) - y(d.value); })
        .attr("fill", function (d) { return g_colormapGroups(d.key); });

    // // Add individual points with jitter
    var jitterWidth = 50;
    svg.append("g")
        .selectAll("g")
        .data(groupedData)
        .enter()
        .append("g")
        .attr("class", "subgroupedDots")
        .attr("transform", function (d) { return "translate(" + x(d.group) + ",0)"; })
        .selectAll("circle")
        .data(function (d) { 
            // console.log(d);
            // return subgroups.map(function () {
            //     // console.log(kky);
            //     var kky = (d.sex === "female")? "F" : "M";
            //     return { key: kky, value: d.val }; }); 
                var kky = (d.sex === "female")? "F" : "M";
                var newD = [{key: kky, value: d.val }];
                // console.log(newD);
                    return newD;
        })
        .enter().append("circle")
        .attr("cx", function (d) { return ( xSubgroup(d.key)+ (xSubgroup.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth) })
        .attr("cy", function (d) { return y(d.value); })
        .attr("r", 4)
        .style("fill", function (d) { return (g_colormapGroups(d.key)) })
        .attr("stroke", "white")


        // Draw legends
        
    var ww = 14;
    svg.append("g").selectAll("labelsRect")
        .data(subgroups)
        .enter()
        .append("rect")
        .attr("width", ww)
        .attr("height", ww)
        .attr("x", width-50)
        .attr("y", function (d, i) { return 20 + i * 25 - ww / 2; })
        .style("fill", function (d, i) {
            return g_colormapGroups(d);
        })

    svg.append("g").selectAll("labels")
        .data(subgroups)
        .enter()
        .append("text")
        .style("font-size", "12px")
        .attr("x", width-30)
        .attr("y", function (d, i) { return 20 + i * 25; }) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function (d,i) { return gDefaultColRange(i); })
        .text(function (d) {
            return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
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
            // console.log(y(d.val));
            return y(d.val);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return y(0) - y(d.val); })
        .attr("fill", "steelblue")

}

// Update views with different search terms
function redrawAll()
{
    if(g_selectedRow < 0 || g_selectedRow >= g_tpmMeanVal.length)
    return;

    // update the body view
   const bodyView = d3.select("#bodyView");
   var partHeadNeck = bodyView.selectAll("#pathHeadNeck")
   .style("fill", function(){
       var val = g_tpmMeanVal[g_selectedRow].HeadNeck;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partExtremities = bodyView.selectAll("#pathExtremities")
   .style("fill", function(){
       var val = g_tpmMeanVal[g_selectedRow].Extremities;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partPerinaeum = bodyView.selectAll("#pathPerinaeum")
   .style("fill", function(){
       var val = g_tpmMeanVal[g_selectedRow].Perinaeum;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partBody = bodyView.selectAll("#pathBody")
   .style("fill", function(){
       var val = g_tpmMeanVal[g_selectedRow].Body;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   var partPalmSole = bodyView.selectAll("#pathPalmSole")
   .style("fill", function(){
       var val = g_tpmMeanVal[g_selectedRow].PalmSole;
       return g_exprValColorMap(val);
   })
   .style("opacity", "1");

   // update the bar charts
   d3.select("#barchart").remove();
   drawBarcharts(g_tpmMeanVal, g_selectedRow, "barchart", "#barchartView", g_dpwidth, g_dpheight, g_margin);

   // update the text 
//    d3.select("#rnaInfoText")
//    .text(function() {return g_tpmMeanVal[g_selectedRow].Symbol; });
   d3.select(".rnaInfoSvg").remove();
   setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
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
    // drawBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
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
        g_tpmMeanVal = data;

        // 1.setup views
        drawBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);

        // 2. setup search box
        setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
        // 2.1 setup drop box
        // d3.select("#rnaDropbox")
        // .selectAll('rnaOptions')
        // .data(g_tpmMeanVal)
        // .enter()
        // .text(function (d) { return d.Symbol; }) // text showed in the menu
        // .attr("value", function (d,i) { return i; }) // corresponding value returned by the button
        // .property("selected", function(d){ return d.Symbol === g_tpmMeanVal[g_selectedRow]; });
        
        // 3. setup barchart
        drawBarcharts(g_tpmMeanVal, g_selectedRow, "barchart", "#barchartView", g_dpwidth, g_dpheight, g_margin);
    });

    // 4. load the full data
 d3.queue()
    .defer(d3.csv, "./data/tpm_full.csv")
    .defer(d3.csv, "./data/subjectInfo.csv")
    .await(function(error, data1, data2){
        if(error) throw error;

        // Handle the full tpm
        var valueKey = data1.columns;
        data1.forEach(function(d) {
            for(var i = 0; i < valueKey.length; i++)
            {
                if(valueKey[i] === "Symbol" )
                     d[valueKey[i]] = d[valueKey[i]];
                else
                    d[valueKey[i]] = +d[valueKey[i]];
            }
        });
        g_tpmFullData = data1;
        // Handle the subject information
        g_tpmSubInfo = data2;
        
        // draw the dotplot

        drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplot", "#dotplotView", g_dpwidth, g_dpheight, g_margin);
    })
}