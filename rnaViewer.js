// NOTE:
// We need to convert body images paths before we can use them!!!
// We currently use the "image-outline" package as an NPM package to convert them!!!

// global variables
var g_margin = { left: 20, right: 20, top: 10, bottom: 10 };

// bar charts
var g_bcwidth = 1200;
var g_bcheight = 600;

// dot plots
var g_dpwidth = 1000;
var g_dpheight = 400;

// body view
var g_bvwidth = 400;
var g_bvheight= 600;
var g_orgBodyImgWidth = 3508;
var g_orgBodyImgHeight = 4961;

// global data
var g_tpmMeanVal = [];
var g_tpmFullData = [];
var g_tpmSubInfo = [];
var g_exprValColorMap = [];
// var g_pathFiles = ['./data/pathHeadNeck.txt','./data/pathLegs.txt','./data/pathTorso.txt',
// './data/pathPerinaeum.txt','./data/pathArmsHands.txt'];
var g_pathFiles = ['./data/imagePaths/female/pathHeadNeck.txt','./data/imagePaths/female/pathLegs.txt',
'./data/imagePaths/female/pathTorso.txt',
'./data/imagePaths/female/pathPerinaeum.txt','./data/imagePaths/female/pathArmsHands.txt'];

var g_sgwidth = 1400;
var g_sgLegendWidth = 100;
var g_sgheight = 300;
// selected row of the data
var g_selectedRow = 0;
var g_selectedData = null;

// Language setting
var g_isEnglish = false;
var g_posTranslate = [
    {"cn":"头颈",
     "en":"HeadNeck"},
     {"cn":"四肢",
     "en":"Extremities"},
     {"cn":"掌跖",
     "en":"PalmSole"},
     {"cn":"躯干",
     "en":"Body"},
     {"cn":"外阴",
     "en":"Perinaeum"}
];

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
// var g_colormapGroups = d3.scaleOrdinal(d3.schemePuOr[11]);
var g_colormapGroups = d3.scaleOrdinal(d3.schemeTableau10);
// function drawTable() {
//     var tableFname = "Result-MedicalTable.csv";
//     d3.csv(tableFname, function (error, data) {
//         if (error) throw error;

//         var sortAscending = true;
//         var table = d3.select('#pageGroup-wrap').append('table');


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

var tooltip = d3.select("#bodyView")
.append("div")
.attr("id", "tooltip");
// .text("This is a tooltip");

function drawFemaleBodyView(data, className, divName, width, height, margin)
{
    var horAdj = -80; // The image has large white margins, and we need to adjust to compensate
    var svgHorAdj = -100;
    var svg = d3.select(divName)
    .append("svg")
    .attr('class', className)
    .attr('id', className)
    .attr("width", width + svgHorAdj + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");;

    var svg_img=  svg.append('svg:image')
                    .attr('x','0')
                    .attr('y','0');
    var logoUrl = "./data/female_body.png";
    svg_img.attr('height', height+"px")
        .attr('width', width+"px")
        .attr('x',horAdj )
        .attr('preserveAspectRatio',"none")
        .attr('xlink:href', logoUrl)
        .attr("fill", "black")
        .style('stroke', '#AAA')
        .style("opacity",1)
        ;

    var parts = [1, 2, 3, 4];

    var testVal = [0.11, 5, 8, 20, 30, 80, 200, 599];
    var nodeParts = svg.selectAll(".legend")
    .data(testVal)
    .enter()
    .append("circle")
    .attr("class", "bodyParts")
    .attr("id",function(d,i){return i;})
    .attr("r",10)
    .attr("cx", function(d,i){return width+svgHorAdj - 35;})
    .attr("cy", function(d,i){return 20 + 25*i;})
    .style("fill", function(d,i){return g_exprValColorMap(d)})
    ;

    svg.append("g").selectAll(".legendLabels")
      .data(g_colormapThres)
      .enter()
      .append("text")
      .attr("class","legendLabels")
      .style("font-size", "12px")
      .attr("x", width+svgHorAdj-25)
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
        {
            if(g_isEnglish)
                thres = "["+d+",+inf)";
            else
                thres = "["+d+",无穷)";
        }
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
    var xscale = width/g_orgBodyImgWidth;
    var yscale = height/g_orgBodyImgHeight;

    // console.log(g_tpmMeanVal[g_selectedRow]);

    d3.queue()
    .defer(d3.csv, "./data/imagePaths/female/pathPalmSole1.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathPalmSole2.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathPalmSole3.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathPalmSole4.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathExtremities1.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathExtremities2.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathExtremities3.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathHeadNeck.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathPerinaeum.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathTorso.txt")
    .defer(d3.csv, "./data/imagePaths/female/pathExtremities4.txt")
    .await(function(error, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11) {
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
        .style("opacity","0.1")
         .attr("transform","translate("+ horAdj +","+0+")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");


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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

            
            var bodyPart2_2 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data6.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data6[i].x*xscale  + " " + data6[i].y*yscale  + " ";
                    else
                        pathStr += data6[i].x*xscale  + " " + data6[i].y*yscale  + " ";
                    if (i == data6.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 100 + ")");
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

            
            var bodyPart2_3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data7.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data7[i].x*xscale + " " + data7[i].y*yscale  + " ";
                    else
                        pathStr += data7[i].x*xscale  + " " + data7[i].y*yscale  + " ";
                    if (i == data7.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 0 + ")");
            .attr("transform", "translate("+horAdj+",0)");

            var bodyPart3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathHeadNeck")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data8.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data8[i].x*xscale+ " " + data8[i].y*yscale + " ";
                    else
                        pathStr += data8[i].x*xscale+ " " + data8[i].y*yscale + " ";
                    if (i == data8.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "scale("+xscale+","+yscale+") translate(" + width/2 + "," + height/2 + ")");
            .attr("transform", "translate("+horAdj+",0)");


            var bodyPart4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPerinaeum")
            .attr("class", "bodyOutline")
            .attr("d", function () {

                var pathStr = "M ";
        
                for (var i = 0; i < data9.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data9[i].x*xscale  + " " + data9[i].y*yscale  + " ";
                    else
                        pathStr += data9[i].x*xscale  + " " + data9[i].y*yscale + " ";
                    if (i == data9.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 0 + ")");
            .attr("transform", "translate("+horAdj+",0)");

            var bodyPart5 = nodePartSilhouette
            .append('path')
            .attr("id", "pathBody")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data10.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data10[i].x*xscale  + " " + data10[i].y*yscale  + " ";
                    else
                        pathStr += data10[i].x*xscale  + " " + data10[i].y*yscale + " ";
                    if (i == data10.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate("+horAdj+",0)");
            ;
            var bodyPart2_4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data11.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data11[i].x*xscale + " " + data11[i].y*yscale + " ";
                    else
                        pathStr += data11[i].x*xscale + " " + data11[i].y*yscale + " ";
                    if (i == data11.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate("+horAdj+",0)");
            ;

            // Update fill colors
            redrawAll();
    });



 
    return svg_img;
}

function drawMaleBodyView(data, className, divName, width, height, margin)
{
    var horAdj = -72;
    var svg = d3.select(divName)
    .append("svg")
    .attr('class', className)
    .attr('id', className)
    .attr("width", width+horAdj + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");;
    // var svg = d3.select(className);
    var svg_img=  svg.append('svg:image')
                    .attr('x','0')
                    .attr('y','0');
    var logoUrl = "./data/male_body.png";
    svg_img.attr('height', height+"px")
        .attr('width', width+"px")
        .attr('x',horAdj )
        .attr('preserveAspectRatio',"none")
        .attr('xlink:href', logoUrl)
        .attr("fill", "black")
        .style('stroke', '#AAA')
        .style("opacity",1)
        ;

    var parts = [1, 2, 3, 4];

    var testVal = [0.11, 5, 8, 20, 30, 80, 200, 599];

        // TODO: uncomment if we need legends
    // var nodeParts = svg.selectAll(".legend")
    // .data(testVal)
    // .enter()
    // .append("circle")
    // .attr("class", "bodyParts")
    // .attr("id",function(d,i){return i;})
    // .attr("r",10)
    // .attr("cx", function(d,i){return width - 35;})
    // .attr("cy", function(d,i){return 20 + 25*i;})
    // .style("fill", function(d,i){return g_exprValColorMap(d)})
    // ;


    // svg.append("g").selectAll(".legendLabels")
    //   .data(g_colormapThres)
    //   .enter()
    //   .append("text")
    //   .attr("class","legendLabels")
    //   .style("font-size", "12px")
    //   .attr("x", width-25)
    //   .attr("y", function (d, i) { 
    //       return 20 + i * 25; }) // 100 is where the first dot appears. 25 is the distance between dots
    //   // .style("fill", function (d,i) { return gDefaultColRange(i); })
    //   .text(function (d, i) { 
    //     //   var newStr = d.replace(/ *\（[^)]*\） */g, "");
    //     //    return newStr; 
    //     var thres = null;
    //     if(i < g_colormapThres.length-1)
    //         thres = "["+d+","+g_colormapThres[i+1]+")"; 
    //     else
    //     {
    //         if(g_isEnglish)
    //             thres = "["+d+",+inf)";
    //         else
    //             thres = "["+d+",无穷)";
    //     }
    //     return thres;
    //   })
    //   .attr("text-anchor", "left")
    //   .style("alignment-baseline", "middle")


    // Draw parts
    // Warning: All body parts are transformed to correct positions with hard coded transformation information
    // TODO: figure out what went wrong!
    var parts = [1];//[1,2,3,4,5];
    var nodePartSilhouette = svg.append("g").attr("class", "bodyShape");
    var allPathData = [];
    var xscale = width/g_orgBodyImgWidth;
    var yscale = height/g_orgBodyImgHeight;

    // console.log(g_tpmMeanVal[g_selectedRow]);

    d3.queue()
    .defer(d3.csv, "./data/imagePaths/male/pathPalmSole1.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathPalmSole2.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathPalmSole3.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathPalmSole4.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathExtremities1.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathExtremities2.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathExtremities3.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathHeadNeck.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathPerinaeum.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathTorso.txt")
    .defer(d3.csv, "./data/imagePaths/male/pathExtremities4.txt")
    .await(function(error, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11) {
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
        .style("opacity","0.1")
         .attr("transform","translate("+ horAdj +","+0+")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");


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
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

            
            var bodyPart2_2 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data6.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data6[i].x*xscale  + " " + data6[i].y*yscale  + " ";
                    else
                        pathStr += data6[i].x*xscale  + " " + data6[i].y*yscale  + " ";
                    if (i == data6.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 100 + ")");
            .attr("transform", "translate(" + horAdj + "," + 0 + ")");

            
            var bodyPart2_3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data7.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data7[i].x*xscale + " " + data7[i].y*yscale  + " ";
                    else
                        pathStr += data7[i].x*xscale  + " " + data7[i].y*yscale  + " ";
                    if (i == data7.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 0 + ")");
            .attr("transform", "translate("+horAdj+",0)");

            var bodyPart3 = nodePartSilhouette
            .append('path')
            .attr("id", "pathHeadNeck")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data8.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data8[i].x*xscale+ " " + data8[i].y*yscale + " ";
                    else
                        pathStr += data8[i].x*xscale+ " " + data8[i].y*yscale + " ";
                    if (i == data8.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "scale("+xscale+","+yscale+") translate(" + width/2 + "," + height/2 + ")");
            .attr("transform", "translate("+horAdj+",0)");


            var bodyPart4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathPerinaeum")
            .attr("class", "bodyOutline")
            .attr("d", function () {

                var pathStr = "M ";
        
                for (var i = 0; i < data9.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data9[i].x*xscale  + " " + data9[i].y*yscale  + " ";
                    else
                        pathStr += data9[i].x*xscale  + " " + data9[i].y*yscale + " ";
                    if (i == data9.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            // .attr("transform", "translate(" + 0 + "," + 0 + ")");
            .attr("transform", "translate("+horAdj+",0)");

            var bodyPart5 = nodePartSilhouette
            .append('path')
            .attr("id", "pathBody")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data10.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data10[i].x*xscale  + " " + data10[i].y*yscale  + " ";
                    else
                        pathStr += data10[i].x*xscale  + " " + data10[i].y*yscale + " ";
                    if (i == data10.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate("+horAdj+",0)");
            ;
            var bodyPart2_4 = nodePartSilhouette
            .append('path')
            .attr("id", "pathExtremities")
            .attr("class", "bodyOutline")
            .attr("d", function () {
                var pathStr = "M ";
        
                for (var i = 0; i < data11.length; i++) {
                    if (i > 0)
                        pathStr += "L " + data11[i].x*xscale + " " + data11[i].y*yscale + " ";
                    else
                        pathStr += data11[i].x*xscale + " " + data11[i].y*yscale + " ";
                    if (i == data11.length - 1)
                        pathStr += "z";
                }
                return pathStr;
            })
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate("+horAdj+",0)");
            ;

            // Update fill colors
            redrawAll();
    });



 
    return svg_img;
}


function setupSearchView(g_tpmMeanVal, className, divName, width, height, margin)
{
    d3.selectAll(".rnaInfoSvg").remove();
    var svg = d3.select("#rnaInfo")
    .append("svg")
    .attr("class","rnaInfoSvg")
    .attr("width", 400)
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
        var info = null;
        if (g_isEnglish)
            info = g_tpmMeanVal[g_selectedRow].Symbol + " is found. Read more by clicking tags below.";
        else
            info = g_tpmMeanVal[g_selectedRow].Symbol + " 已被找到. 点击标签获取更多关于此RNA的信息.";
        return info;
    })
    ;
    var infoOffset = 50;

    var node = svg.selectAll(".linkTag")
    .data(externalLinks)
    .enter()
    .append("g")
    .attr("class","linkTag");
     var buttsPerRow = 3;
    node.append("rect")
    .attr("width", ww - tagMargin.left - tagMargin.right)
    .attr("height", hh)
    .attr("x", function (d,i) { return  ww* (i % buttsPerRow); })
    .attr("y", function (d,i) { return Math.floor(i/buttsPerRow) * hh + (Math.floor(i/buttsPerRow) + 1) * infoOffset; })
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
    .attr("x", function(d,i) { return ww* (i % buttsPerRow) + 10;})
    .attr("y", function(d,i){return Math.floor(i/buttsPerRow) * hh + (Math.floor(i/buttsPerRow) + 1) * infoOffset + hh/2;})
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

  function doSearchFromProg(searchTerm) {
    var txtName = searchTerm;
    console.log(txtName);
    // do a simple traversal, for now
    for(var i = 0; i < g_tpmMeanVal.length; i++)
    {
        if(g_tpmMeanVal[i].Symbol.toLowerCase() === txtName.toLowerCase())
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

function drawDotplots(data, subjectInfoData, className, divName, width, height, margin, zsubgroups=['F','M'], zisLog = true)
{
    if (data == [] || data == null)
        return;
  // append the svg object to the body of the pageGroup
  var svg = d3.select(divName)
  .append("svg")
  .attr('class', className)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

    var groups = g_tpmMeanVal.columns.slice(1);
    var xtxtGroups = [];
    if(g_isEnglish)
    {
        xtxtGroups = groups;
    }
    else
    {
        for(var i = 0; i < g_posTranslate.length; i++){
            if(groups[i] === g_posTranslate[i].en)
                xtxtGroups.push(g_posTranslate[i].cn);
        } 
    }
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
        .call(d3.axisBottom(x).tickFormat(function(d,i){
            if(g_isEnglish)
            {
               return d;
            }
            else
            {
                for(var i = 0; i < g_posTranslate.length; i++){
                    if(d === g_posTranslate[i].en)
                    {
                          return g_posTranslate[i].cn;
                    }
                } 
            }
        }
        ))
        .selectAll("text")
        //  .attr("transform", "translate(10,0)")
        .style("text-anchor", "center");



    // Another scale for subgroup position?
    // var subgroups = ['F', 'M'];
    // var subgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];
    var subgroups = zsubgroups;
    var isLog = zisLog;
    var isSex = false;
    if (subgroups[0] === 'F' && subgroups[1] === 'M')
        isSex = true;
    else
        isSex = false;

    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // Group the data into subgroups
    var groupedData = [];
    var groups = [];
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
        var datum = {val: data[dkeys[i]], group: info[0].location, ageGroup: info[0].ageGroup, sex: info[0].sex};
        groups.push(datum.group);
        groupedData.push(datum);
    }
    var uniqueGroups = d3.set(groups).values();
    // Add Y axis
    // Linear or Log scale?
    var y = null;
    if (isLog)
        y = d3.scaleLog()//d3.scaleLinear();
    else
        y = d3.scaleLinear();
    // .domain([0, d3.max(selectedData, function(d){return d3.max(d.val);})]).nice()
    y.range([height, 0])
        .rangeRound([height - margin.bottom, margin.top]);
  // If log 
   
   var ydelta = isLog? 0.0001 : 0;
//    y.domain([0, d3.max(groupedData, function (d) { return d.val; })]).nice();
    var ymax =  d3.max(groupedData, function (d) { return d.val; });
    var ymin =  d3.min(groupedData, function (d) { return d.val; });
    console.log(ymax);
    // If log 
    y.domain([ymin+ydelta, ymax+ydelta ]).nice();

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        //  .call(d3.axisLeft(y).ticks().tickFormat(d3.format('.3')));
        .call(d3.axisLeft(y).ticks().tickArguments([8,".3"]));
        //.call(d3.axisLeft(y));

    // TODO: compute statistics!!!
    // Record subgrouped data
    var subgroupedData = Array(uniqueGroups.length);
    var groupedSumStat = Array(uniqueGroups.length);
    for(var i = 0; i < subgroupedData.length; i++){
        subgroupedData[i]  = [];
        groupedSumStat[i] = [];
    }

    // Grouped bars (just for reference!)
    // svg.append("g")
    //     .selectAll("g")
    //     // Enter in data = loop group per group
    //     .data(groupedData)
    //     .enter()
    //     .append("g")
    //     .attr("class", "subgroupedBars")
    //     .attr("transform", function (d) { return "translate(" + x(d.group) + ",0)"; })
    //     .selectAll("rect")
    //     .data(function (d) { 
    //         // console.log(d);
    //         // var newD = subgroups.map(function () {
    //         //     // console.log(kky);
    //         //     var kky = (d.sex === "female")? "F" : "M";
    //         //     return { key: kky, value: d.val }; }); 

    //         // var kky = (d.sex === "female")? "F" : "M";
    //         var kky = (isSex)? ((d.sex === "female")? "F" : "M") : d.ageGroup;
    //         var newD = [{key: kky, value: d.val }];
    //         subgroupedData.push({key: kky, value: d.val });
    //         // console.log(newD);
    //             return newD;
    //     })
    //     .enter().append("rect")
    //     .attr("x", function (d) {
    //         // console.log(d); 
    //         return xSubgroup(d.key); })
    //     .attr("y", function (d) { return y(d.value); })
    //     .attr("width", xSubgroup.bandwidth())
    //     .attr("height", function (d) { return y(0) - y(d.value); })
    //     .attr("fill", function (d) { return g_colormapGroups(d.key); });

    for(var i = 0; i < groupedData.length; i++)
    {
        var d = groupedData[i];
        
        var kky = (isSex)? ((d.sex === "female")? "F" : "M") : d.ageGroup;
        var id  = uniqueGroups.indexOf(d.group);
        subgroupedData[id].push({key: kky, value: d.val });
    }
    // compute grouped stats

    for(var i = 0; i < subgroupedData.length;i++){
        var sumstat = d3.nest()
        .key(function(d) {return d.key;})
        .rollup(function(d){
            q1 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.25);
            median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5);
            q3 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.75);
            interQuantileRange = q3 - q1;
            min = d3.min(d.map(function(g) { return g.value;}));//q1 - 1.5 * interQuantileRange;
            max = d3.max(d.map(function(g) { return g.value;}));//q3 + 1.5 * interQuantileRange;
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max});
        })
        .entries(subgroupedData[i]);
        // console.log(sumstat);
        groupedSumStat[i] = sumstat;
    }

    // draw the boxplot
    // Show the main vertical line
    svg
        .selectAll("bpVertLines")
        .data(groupedSumStat)
        .enter()
        .append("g")
        .attr("class", "bpVertLines")
        .attr("transform", function (d,i) { return "translate(" + x(uniqueGroups[i]) + ",0)"; })
        .selectAll("line")
        .data(function(d){
            // console.log(d);
            return d;
        })
        .enter().append("line")
        .attr("y1", function (d) {
            // console.log(d);
            return (y(d.value.min+ydelta));
        })
        // .attr("y2", function (d) { return (y(d.value.max)) })
        .attr("y2", function (d) { return (y(d.value.max+ydelta)) })
        .attr("x1", function (d) { return (xSubgroup(d.key) + xSubgroup.bandwidth()
             / 2) })
        .attr("x2", function (d) { return (xSubgroup(d.key) + xSubgroup.bandwidth() / 2) })
        .attr("stroke", "black")
        .style("width", 40);


    // rectangle for the main box
    svg
        .selectAll("bpBoxes")
        .data(groupedSumStat)
        .enter()
        .append("g")
        .attr("class", "bpBoxes")
        .attr("transform", function (d,i) { return "translate(" + x(uniqueGroups[i]) + ",0)"; })
        .selectAll("rect")
        .data(function(d){
            // console.log(d);
            return d;
        })
        .enter().append("rect")
        // .attr("y", function (d) { return (y(d.value.q3)) }) // console.log(x(d.value.q1)) ;
        .attr("y", function (d) { return (y(d.value.q3+ydelta)) }) // console.log(x(d.value.q1)) ;
        // .attr("height", function (d) { ; return Math.abs(y(d.value.q3) - y(d.value.q1)) }) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("height", function (d) { ; return Math.abs(y(d.value.q3+ydelta) - y(d.value.q1+ydelta)) }) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("x", function (d) { return xSubgroup(d.key); })
        .attr("width", xSubgroup.bandwidth() * 0.8)
        .attr("stroke", "black")
        .style("fill", function (d) { 
            if (subgroups.length == 2) {
                if (d.key == 'F')
                    return "steelblue";
                else
                    return "coral";
            }
            else
                return (g_colormapGroups(d.key));
         })
        .style("opacity", 0.3)

    // Show the median
    svg
        .selectAll("bpMedianLines")
        .data(groupedSumStat)
        .enter()
        .append("g")
        .attr("class", "bpMedianLines")
        .attr("transform", function (d,i) { return "translate(" + x(uniqueGroups[i]) + ",0)"; })
        .selectAll("line")
        .data(function(d){return d;})
        .enter().append("line")
        .attr("x1", function (d) { return (xSubgroup(d.key) ) })
        .attr("x2", function (d) { return (xSubgroup(d.key) + 0.8*xSubgroup.bandwidth()) })
        // .attr("y1", function (d) { return (y(d.value.median)) })
        // .attr("y2", function (d) { return (y(d.value.median)) })
        .attr("y1", function (d) { return (y(d.value.median+ydelta)) })
        .attr("y2", function (d) { return (y(d.value.median+ydelta)) })
        .attr("stroke", "black")
        .style("width", 80);
        
    // // Add individual points with jitter
    var jitterWidth = xSubgroup.bandwidth() * 0.7;//50;
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
            // var kky = (d.sex === "female")? "F" : "M";
            var kky = (isSex) ? ((d.sex === "female") ? "F" : "M") : d.ageGroup;
            var newD = [{ key: kky, value: d.val }];
            // console.log(newD);
            return newD;
        })
        .enter().append("circle")
        .attr("cx", function (d) { return (xSubgroup(d.key) + (xSubgroup.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth) })
        // .attr("cy", function (d) { return y(d.value); })
        .attr("cy", function (d) { return y(d.value + ydelta); })
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
        .attr("x", width - 50)
        .attr("y", function (d, i) { return 20 + i * 25 - ww / 2; })
        .style("fill", function (d, i) {

            if (subgroups.length == 2) {
                if (d == 'F')
                    return "steelblue";
                else
                    return "coral";
            }
            else
                return (g_colormapGroups(d));
        })

    svg.append("g").selectAll("labels")
        .data(subgroups)
        .enter()
        .append("text")
        .style("font-size", "12px")
        .attr("x", width - 30)
        .attr("y", function (d, i) { return 20 + i * 25; }) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function (d,i) { return gDefaultColRange(i); })
        .text(function (d) {
            return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}

function drawLinechart(data, subjectInfoData, className, divName, width, height, margin, zsubgroups=['F','M'],zisLog = true)
{
    if (data == [] || data == null)
        return;
  // append the svg object to the body of the page
  var svg = d3.select(divName)
  .append("svg")
  .attr('class', className)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

    var groups = g_tpmMeanVal.columns.slice(1);
    // X axis
    var x = d3.scaleLinear()
        .range([0, width]);
    x.domain([0, 90]).nice();
      
    var xAxis = d3.axisBottom(x).ticks(20);

    svg.append("g")            // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .style("fill", "none")
      .call(xAxis);

    // Another scale for subgroup position?
    // var subgroups = ['F', 'M'];
    // var subgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];

    // Group the data into subgroups
    var groupedData = [];
    var groups = [];
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
        var datum = {val: +data[dkeys[i]], group: info[0].location, age: +info[0].age, sex: info[0].sex};
        groups.push(datum.group);
        groupedData.push(datum);
    }

    var uniqueGroups = d3.set(groups).values();
    // Add Y axis
    var isLog = zisLog;
    var y = null;
    var ydelta = isLog? 1e-4:0;
    if(isLog)
        y = d3.scaleLog();
    else
        y = d3.scaleLinear();
        // .domain([0, d3.max(selectedData, function(d){return d3.max(d.val);})]).nice()
    y.range([height, 0])
        .rangeRound([height - margin.bottom, margin.top]);
    y.domain([d3.min(groupedData, function (d) { return d.val; })+ydelta, 
        d3.max(groupedData, function (d) { return d.val; })+ydelta]).nice();


    var yAxis = d3.axisLeft(y).ticks(5);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .style("stroke", "steelblue")
        .style("fill", "none")
        .call(yAxis);
    // generate subgrouped data for each location
    var subgroupedData = Array(uniqueGroups.length);
    for (var i = 0; i < subgroupedData.length; i++) {
        subgroupedData[i] = [];

    }
    for (var i = 0; i < groupedData.length; i++) {
        var d = groupedData[i];
        var id = uniqueGroups.indexOf(d.group);
        subgroupedData[id].push({ age: d.age, val: d.val });
    }

    // Sort by age
    for(var i  = 0; i < subgroupedData.length; i++){
        subgroupedData[i].sort(function(x,y){return d3.ascending(x.age, y.age);});
    }
    // draw a line for each location

    for (var i = 0; i < subgroupedData.length; i++) {
        // var valueline = d3.line()
        //     .x(function (d) { return x(d.age); })
        //     .y(function (d) { return y(d.val+ydelta); });
        // do regression
        
     
        var valueline = [];
        valueline = d3.line().defined(d => !isNaN(d.val))
            .x(d => x(d.age))
            .y(d => y(d.val + ydelta));

        // RegressionF
        var lineData = subgroupedData[i];
        var formatedData = subgroupedData[i].map(function(d){return [d.age, d.val]});
        var polyReg = regression('polynomial', formatedData, 2);
        var polyRegEq = "Poly: y = " + polyReg.equation[2].toFixed(4) + "x^2 + " + polyReg.equation[1].toFixed(4) + "x + " + polyReg.equation[0].toFixed(2) + ", r2 = " + polyReg.r2.toFixed(3);
        var regressedLine = regEquationToCurve("polynomial",formatedData, polyReg);
        var regline = d3.line()
        // .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveNatural);

        // Draw regression line?
        // svg.append("path")
        // .datum(lineData.filter(valueline.defined()))
        // .attr("stroke", "#ccc")
        // .attr("d", valueline)
        // .style("fill", "none");

        // svg.append("path")
        //     .datum(lineData)
        //     .attr("class", "line")
        //     .attr("d", valueline)
        //     .attr("stroke", function(){return g_colormapGroups(i);})
        //     .style("fill", "none");

        svg.append("path")
        .datum(lineData.filter(valueline.defined()))
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5)
        .attr("d", valueline)
        .style("fill", "none");

        svg.append("path")
            .datum(regressedLine.values)
            .attr("class", "line")
            .attr("d", regline)
            .attr("stroke-width", 2)
            // .attr("d", function(d){return regline(d);})
            .attr("stroke", function(){return g_colormapGroups(i);})
            .style("fill", "none");


        var circleNode = svg.selectAll("line-circle")
            .data(lineData)
            .enter();
        circleNode.append("circle")
            .attr("class", "data-circle")
            .attr("r", 5)
            .attr("cx", function (d) { return x(d.age); })
            .attr("cy", function (d) {
                return y(d.val+ydelta);
            })
            .style("fill", function () {
                if (d.val > 0.0)
                return g_colormapGroups(i);
            else
                return "none";
            });
    }

        // Draw legends
        
    var ww = 14;
    svg.append("g").selectAll("labelsRect")
        .data(uniqueGroups)
        .enter()
        .append("rect")
        .attr("width", ww)
        .attr("height", ww)
        .attr("x", width-70)
        .attr("y", function (d, i) { return 20 + i * 25 - ww / 2; })
        .style("fill", function (d, i) {
            return g_colormapGroups(i);
        })

        
    svg.append("g").selectAll("labels")
    .data(uniqueGroups)
    .enter()
    .append("text")
    .style("font-size", "12px")
    .attr("x", width-50)
    .attr("y", function (d, i) { return 20 + i * 25; }) // 100 is where the first dot appears. 25 is the distance between dots
    // .style("fill", function (d,i) { return gDefaultColRange(i); })
    .text(function (d) {
        
        for(var i = 0; i < g_posTranslate.length; i++){
            if(d===g_posTranslate[i].en){
                if(g_isEnglish)
                    return d;
                else
                    return g_posTranslate[i].cn;
            }
        }
        return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}

function regEquationToCurve(name, data, regEq)
{
    var regressedLine = {
        name: name,
        values: function() {
        var extrapolatedPts = [];
        for(var i = 0; i < data.length; i++){
            var val = data[i][0];
            switch(name){
            case "polynomial":
                // regEq.equation[3] * val*val*val + 
                extrapolatedPts.push({x: val, y: regEq.equation[2] * val*val + regEq.equation[1] * val + regEq.equation[0]});
                break;
            case "exponential":
                extrapolatedPts.push({x: val, y: regEq.equation[0] * Math.exp(val * regEq.equation[1])}); //or use numbers.js per https://gist.github.com/zikes/4279121, var regression = numbers.statistic.exponentialRegression(pts);
                break;
            case "power":
                extrapolatedPts.push({x: val, y: regEq.equation[0] * Math.pow(val,regEq.equation[1])});
                break;
            case "logarithmic":
                extrapolatedPts.push({x: val, y: regEq.equation[0] + regEq.equation[1] * Math.log(val)});
                break;
            case "linear":
            default:
                extrapolatedPts.push({x: val, y: regEq.equation[0] * val + regEq.equation[1]});
            }
        }
        return extrapolatedPts;
    }()};
    return regressedLine;  
}

function drawBarcharts(data, selectedRow, className, divName, width, height, margin)
{
    // append the svg object to the body of the pageGroup
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
    // console.log(keys);
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

function computeGroupStatistics()
{
    if(g_selectedRow < 0 || g_selectedRow >= g_tpmMeanVal.length)
    return;
    if(g_tpmFullData == [])
        return;
    data = g_tpmFullData[g_selectedRow];
    subjectInfoData= g_tpmSubInfo;
  // Another scale for subgroup position?
     var subgroups = ['F', 'M'];
    // var subgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];

  
    var isSex = true;

    // Group the data into subgroups
    var groupedData = [];
    var groups = [];
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
        var datum = {val: data[dkeys[i]], group: info[0].location, ageGroup: info[0].ageGroup, sex: info[0].sex};
        groups.push(datum.group);
        groupedData.push(datum);
    }
    var uniqueGroups = d3.set(groups).values();


    // TODO: compute statistics!!!
    // Record subgrouped data
    var subgroupedData = Array(uniqueGroups.length);
    var groupedSumStat = Array(uniqueGroups.length);
    for(var i = 0; i < subgroupedData.length; i++){
        subgroupedData[i]  = [];
        groupedSumStat[i] = [];
    }

    for(var i = 0; i < groupedData.length; i++)
    {
        var d = groupedData[i];
        
        var kky = (isSex)? ((d.sex === "female")? "F" : "M") : d.ageGroup;
        var id  = uniqueGroups.indexOf(d.group);
        subgroupedData[id].push({key: kky, value: d.val });
    }
    // compute grouped stats

    for(var i = 0; i < subgroupedData.length;i++){
        var sumstat = d3.nest()
        .key(function(d) {return d.key;})
        .rollup(function(d){
            mu = d3.mean(d.map(function(g) { return g.value;}));
            q1 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.25);
            median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5);
            q3 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.75);
            interQuantileRange = q3 - q1;
            min = d3.min(d.map(function(g) { return g.value;}));//q1 - 1.5 * interQuantileRange;
            max = d3.max(d.map(function(g) { return g.value;}));//q3 + 1.5 * interQuantileRange;
            return({mu: mu, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max});
        })
        .entries(subgroupedData[i]);
        // console.log(sumstat);
        groupedSumStat[i] = sumstat;
    }

    return groupedSumStat;
}

function redrawBodyViews()
{
    if(g_selectedRow < 0 || g_selectedRow >= g_tpmMeanVal.length)
    return;
    if(g_tpmFullData == [])
        return;
    data = g_tpmFullData[g_selectedRow];
    subjectInfoData= g_tpmSubInfo;
  // Another scale for subgroup position?
     var subgroups = ['F', 'M'];
    // var subgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];

  
    var isSex = true;

    // Group the data into subgroups
    var groupedData = [];
    var groups = [];
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
        var datum = {val: data[dkeys[i]], group: info[0].location, ageGroup: info[0].ageGroup, sex: info[0].sex};
        groups.push(datum.group);
        groupedData.push(datum);
    }
    var uniqueGroups = d3.set(groups).values();


    // TODO: compute statistics!!!
    // Record subgrouped data
    var subgroupedData = Array(uniqueGroups.length);
    var groupedSumStat = Array(uniqueGroups.length);
    for(var i = 0; i < subgroupedData.length; i++){
        subgroupedData[i]  = [];
        groupedSumStat[i] = [];
    }

    for(var i = 0; i < groupedData.length; i++)
    {
        var d = groupedData[i];
        
        var kky = (isSex)? ((d.sex === "female")? "F" : "M") : d.ageGroup;
        var id  = uniqueGroups.indexOf(d.group);
        subgroupedData[id].push({key: kky, value: d.val });
    }
    // compute grouped stats

    for(var i = 0; i < subgroupedData.length;i++){
        var sumstat = d3.nest()
        .key(function(d) {return d.key;})
        .rollup(function(d){
            mu = d3.mean(d.map(function(g) { return g.value;}));
            q1 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.25);
            median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5);
            q3 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.75);
            interQuantileRange = q3 - q1;
            min = d3.min(d.map(function(g) { return g.value;}));//q1 - 1.5 * interQuantileRange;
            max = d3.max(d.map(function(g) { return g.value;}));//q3 + 1.5 * interQuantileRange;
            return({mu: mu, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max});
        })
        .entries(subgroupedData[i]);
        // console.log(sumstat);
        if(sumstat[0].key === "M"){
            var temp = sumstat[0];
            sumstat[0] = sumstat[1];
            sumstat[1] = temp;
        }
        groupedSumStat[i] = sumstat;
    }


    // Group 0 is Female, group 1 is Male
    // update the body view
    var selectedData = groupedSumStat;
    const bodyView = d3.select("#bodyView");
    const bodyViewM = d3.select("#bodyViewM");

    for (var i = 0; i < uniqueGroups.length; i++) {
        // HeadNeck
        var id = i;
        var partName = uniqueGroups[i];
        var partSvgName = "#path"+partName;
        var partHeadNeck = bodyView.selectAll(partSvgName)
            .style("fill", function () {
                var val = (selectedData[id][0].key == "F") ? selectedData[id][0].value.mu : selectedData[id][1].value.mu;
                return g_exprValColorMap(val);
            })
            .style("opacity", "0.5")
            // .on("mousemove", function (d) {
            //     tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            // })
            // .on("mouseover", function (d) {
            //     var tid = uniqueGroups.indexOf("HeadNeck");
            //     if (g_isEnglish)
            //         tooltip.text(partName + `: ${selectedData[tid][0].key}`);
            //     else
            //         tooltip.text(partName + `: ${(selectedData[id][0].key == "F") ? selectedData[id][0].value.mu : selectedData[id][1].value.mu}`);
            //     tooltip.style("visibility", "visible");
            // })
            // .on("mouseout", function (d) {
            //     tooltip.style("visibility", "hidden");
            // });
            ;

        var partHeadNeckM = bodyViewM.selectAll(partSvgName)
            .style("fill", function () {
                var val = (selectedData[id][0].key == "M") ? selectedData[id][0].value.mu : selectedData[id][1].value.mu;
                return g_exprValColorMap(val);
            })
            .style("opacity", "0.5")
            // .on("mousemove", function (d) {
            //     tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            // })
            // .on("mouseover", function (d) {
            //     var tid = uniqueGroups.indexOf("HeadNeck");
            //     if (g_isEnglish)
            //         tooltip.text(partName + `: ${selectedData[tid][1].key}`);
            //     else
            //         tooltip.text(partName + `: ${selectedData[tid][0].key}`);
            //     tooltip.style("visibility", "visible");
            // })
            // .on("mouseout", function (d) {
            //     tooltip.style("visibility", "hidden");
            // });
            ;
    }
   // HeadNeck
   id  = uniqueGroups.indexOf("HeadNeck");
   var partHeadNeck = bodyView.selectAll("#pathHeadNeck")
   .on("mousemove", function(d) {
       tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
   })
   .on("mouseover", function(d) {
       var tid = uniqueGroups.indexOf("HeadNeck");
       if(g_isEnglish)
           tooltip.text(`HeadNeck: ${selectedData[tid][0].value.mu.toFixed(3)}`);
       else
           tooltip.text(`头颈: ${selectedData[tid][0].value.mu.toFixed(3)}`);
       tooltip.style("visibility", "visible");
   })
   .on("mouseout", function(d) {
       tooltip.style("visibility", "hidden");
   });

   var partHeadNeckM = bodyViewM.selectAll("#pathHeadNeck")
   .on("mousemove", function(d) {
       tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
   })
   .on("mouseover", function(d) {
       var tid = uniqueGroups.indexOf("HeadNeck");
       if(g_isEnglish)
           tooltip.text(`HeadNeck:${selectedData[tid][1].value.mu.toFixed(3)}`);
       else
           tooltip.text(`头颈:${selectedData[tid][1].value.mu.toFixed(3)}`);
       tooltip.style("visibility", "visible");
   })
   .on("mouseout", function(d) {
       tooltip.style("visibility", "hidden");
   });

// // Extermities
    id  = uniqueGroups.indexOf("Extremities");
    var partExtremities = bodyView.selectAll("#pathExtremities")
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Extremities");
        if(g_isEnglish)
            tooltip.text(`Extremities: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
            tooltip.text(`四肢: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });

    var partExtremitiesM = bodyViewM.selectAll("#pathExtremities")
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Extremities");
        if(g_isEnglish)
            tooltip.text(`Extremities::${selectedData[tid][1].value.mu.toFixed(3)}`);
        else
            tooltip.text(`四肢::${selectedData[tid][1].value.mu.toFixed(3)}`);
        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    // -------------------------------------------
    // Perinaeum
    id  = uniqueGroups.indexOf("Perinaeum");
    var partPerinaeum = bodyView.selectAll("#pathPerinaeum")
       // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Perinaeum");
        if(g_isEnglish)
            tooltip.text(`Perinaeum: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
            tooltip.text(`外阴: ${selectedData[tid][0].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });

    var partPerinaeumM = bodyViewM.selectAll("#pathPerinaeum")
       // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Perinaeum");
        if(g_isEnglish)
            tooltip.text(`Perinaeum:${selectedData[tid][1].value.mu.toFixed(3)}`);
        else
            tooltip.text(`外阴:${selectedData[tid][1].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    // -------------------------------------------
    // Body
    id  = uniqueGroups.indexOf("Body");

    var partBody = bodyView.selectAll("#pathBody")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Body");
        if(g_isEnglish)
            tooltip.text(`Body: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
            tooltip.text(`躯干: ${selectedData[tid][0].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    var partBodyM = bodyViewM.selectAll("#pathBody")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Body");
        if(g_isEnglish)
            tooltip.text(`Body: ${selectedData[tid][1].value.mu.toFixed(3)}`);
        else
            tooltip.text(`躯干: ${selectedData[tid][1].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    // -------------------------------------------
    // Palm Sole
    id  = uniqueGroups.indexOf("PalmSole");
    var partPalmSole = bodyView.selectAll("#pathPalmSole")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("PalmSole");
        if(g_isEnglish)
            tooltip.text(`PalmSole: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
             tooltip.text(`掌跖: ${selectedData[tid][0].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    var partPalmSoleM = bodyViewM.selectAll("#pathPalmSole")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("PalmSole");
        if(g_isEnglish)
            tooltip.text(`PalmSole: ${selectedData[tid][1].value.mu.toFixed(3)}`);
        else
             tooltip.text(`掌跖: ${selectedData[tid][1].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
     // Update legends

     bodyView.selectAll(".legendLabels")
   .data(g_colormapThres)
   // .style("fill", function (d,i) { return gDefaultColRange(i); })
   .text(function (d, i) {
       //   var newStr = d.replace(/ *\（[^)]*\） */g, "");
       //    return newStr; 
       var thres = null;
       if (i < g_colormapThres.length - 1)
           thres = "[" + d + "," + g_colormapThres[i + 1] + ")";
       else {
           if (g_isEnglish)
               thres = "[" + d + ",+inf)";
           else
               thres = "[" + d + ",无穷)";
       }
       return thres;
   })
   .attr("text-anchor", "left")
   .style("alignment-baseline", "middle");

}

// Update views with different search terms
function redrawAll()
{
    if(g_selectedRow < 0 || g_selectedRow >= g_tpmMeanVal.length)
    return;
    // Update UI
    if(g_isEnglish){
        d3.select("#rnaSearchButton").text("Search");
        d3.select("#rnaSearchBox").attr("placeholder","search an RNA, for example, A1BG");

    }
    else
    {
        d3.select("#rnaSearchButton").text("搜索");
        d3.select("#rnaSearchBox")
        .attr("placeholder","输入RNA进行搜素，例如, A1BG");
    }
    redrawBodyViews();
    
   

//     // update the body view
//     var selectedData = g_tpmMeanVal[g_selectedRow];
//     const bodyView = d3.select("#bodyView");
//     var partHeadNeck = bodyView.selectAll("#pathHeadNeck")
//     .style("fill", function(){
//        var val = g_tpmMeanVal[g_selectedRow].HeadNeck;
//        return g_exprValColorMap(val);
//     })
//     .style("opacity", "0.5")
//     .on("mousemove", function(d) {
//         tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
//     })
//     .on("mouseover", function(d) {
//         if(g_isEnglish)
//             tooltip.text(`HeadNeck: ${selectedData.HeadNeck}`);
//         else
//             tooltip.text(`头颈: ${selectedData.HeadNeck}`);
//         tooltip.style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         tooltip.style("visibility", "hidden");
//     });

//     var partExtremities = bodyView.selectAll("#pathExtremities")
//     .style("fill", function(){
//        var val = g_tpmMeanVal[g_selectedRow].Extremities;
//        return g_exprValColorMap(val);
//     })
//     .style("opacity", "0.5")
//     .on("mousemove", function(d) {
//         tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
//     })
//     .on("mouseover", function(d) {
//         if(g_isEnglish)
//             tooltip.text(`Extremities: ${selectedData.Extremities}`);
//         else
//             tooltip.text(`四肢: ${selectedData.Extremities}`);
//         tooltip.style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         tooltip.style("visibility", "hidden");
//     });
//     // -------------------------------------------

//     var partPerinaeum = bodyView.selectAll("#pathPerinaeum")
//     .style("fill", function(){
//        var val = g_tpmMeanVal[g_selectedRow].Perinaeum;
//        return g_exprValColorMap(val);
//     })
//     .style("opacity", "0.5")
//        // 把这一部分复制粘贴到其他部位即可
//     .on("mousemove", function(d) {
//         tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
//     })
//     .on("mouseover", function(d) {
//         if(g_isEnglish)
//             tooltip.text(`Perinaeum: ${selectedData.Perinaeum}`);
//         else
//             tooltip.text(`外阴: ${selectedData.Perinaeum}`);

//         tooltip.style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         tooltip.style("visibility", "hidden");
//     });
//     // -------------------------------------------


//     var partBody = bodyView.selectAll("#pathBody")
//     .style("fill", function(){
//        var val = g_tpmMeanVal[g_selectedRow].Body;
//        return g_exprValColorMap(val);
//     })
//     .style("opacity", "0.5")
//     // 把这一部分复制粘贴到其他部位即可
//     .on("mousemove", function(d) {
//         tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
//     })
//     .on("mouseover", function(d) {
//         if(g_isEnglish)
//             tooltip.text(`Body: ${selectedData.Body}`);
//         else
//             tooltip.text(`躯干: ${selectedData.Body}`);

//         tooltip.style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         tooltip.style("visibility", "hidden");
//     });
//     // -------------------------------------------

//     var partPalmSole = bodyView.selectAll("#pathPalmSole")
//     .style("fill", function(){
//        var val = g_tpmMeanVal[g_selectedRow].PalmSole;
//        return g_exprValColorMap(val);
//     })
//     .style("opacity", "0.5")
//     // 把这一部分复制粘贴到其他部位即可
//     .on("mousemove", function(d) {
//         tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
//     })
//     .on("mouseover", function(d) {
//         if(g_isEnglish)
//             tooltip.text(`PalmSole: ${selectedData.PalmSole}`);
//         else
//              tooltip.text(`掌跖: ${selectedData.PalmSole}`);

//         tooltip.style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         tooltip.style("visibility", "hidden");
//     });

//      // Update legends

//      bodyView.selectAll(".legendLabels")
//    .data(g_colormapThres)
//    // .style("fill", function (d,i) { return gDefaultColRange(i); })
//    .text(function (d, i) {
//        //   var newStr = d.replace(/ *\（[^)]*\） */g, "");
//        //    return newStr; 
//        var thres = null;
//        if (i < g_colormapThres.length - 1)
//            thres = "[" + d + "," + g_colormapThres[i + 1] + ")";
//        else {
//            if (g_isEnglish)
//                thres = "[" + d + ",+inf)";
//            else
//                thres = "[" + d + ",无穷)";
//        }
//        return thres;
//    })
//    .attr("text-anchor", "left")
//    .style("alignment-baseline", "middle");
    // update the text 
    //    d3.select("#rnaInfoText")
    //    .text(function() {return g_tpmMeanVal[g_selectedRow].Symbol; });
    d3.selectAll(".rnaInfoSvg").remove();
    setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);

    //    // update the bar charts
    //    d3.select("#barchart").remove();
    //    drawBarcharts(g_tpmMeanVal, g_selectedRow, "barchart", "#barchartView", g_dpwidth, g_dpheight, g_margin);

    // Return if tpmFullData is not ready
    if (g_tpmFullData == [])
        return;
    d3.select(".dotplotSex").remove();
    drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#barchartView",
        g_dpwidth, g_dpheight, g_margin);

    d3.selectAll(".dotplotageGroup").remove();
    var ageGroupSubgroups = ['0_10', '11_20', '21_30', '31_40', '41_50', '51_60', '61_70', 'over70'];
    drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#dotplotView",
        g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups);

    d3.selectAll(".linechartViewAge").remove();
    drawLinechart(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "linechartViewAge", "#linechartView",
        g_dpwidth, g_dpheight, g_margin);

}

function exprValColormap(){
    var colormap = d3.scaleThreshold()
    .domain([0,3,6,11,26,51,101,501,1000000])
    // .range( d3.schemeYlOrRd[9]);
    // .range(d3.schemeTableau10)
    .range(d3.schemeSet3)
    return colormap;
}

function toNextStage(msg, state)
{
     
    d3.select("#content").remove();   
    d3.select("#headText")
    .style("font-size", "20px")
    .text("");

    d3.select("body").select("#infoTextTut")
    .style("font-size", "20px")
    .text(msg);
    d3.select("body").select("#infoTextIntro")
    .style("font-size", "20px")
    .text(msg);
    switch(state)
    {
        case 0:
        d3.select("#NextIntro")
        .on("click", welcome.click.introNext());
        break;
        case 1:
        d3.select("#NextTut")
        .on("click", welcome.click.tutorialNext());
        break;
    }
}


function rnaViewerMain()
{
    g_exprValColorMap = exprValColormap();
    g_selectedRow = 0;
    // Get search term if jumped from elsewhere
    var currentSearchString = new URLSearchParams(window.location.search);
    var searchedRNA = currentSearchString.get("rna");
    console.log(searchedRNA);
    // g_exprValColorMap = d3.scaleOrdinal(d3.schemeYlOrRd[5]);
    // g_exprValColorMap = d3.scaleSequential(d3.interpolateYlOrRd);

    // Language swtich button
    d3.select("#langSwitchButt").on("click", function (d) {
        g_isEnglish = !g_isEnglish;
        redrawAll();
      });


    // 0. set up views  
    // drawBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    // 0.load data
    // d3.csv("./data/tpm_meanVal.csv", function(data)
    d3.csv("./data/tpm0612_meanVal.csv", function(data)
    {
        for(var i = 0; i < data.length; i++)
        {
            data[i].symbol = data[i].symbol;
            data[i].HeadNeck = +data[i].HeadNeck;
            data[i].Body = +data[i].Extremities;
            data[i].PalmSole = +data[i].PalmSole;
            data[i].Perinaeum = +data[i].Perinaeum;
        }
        g_tpmMeanVal = data;



        if (searchedRNA != "A1BG" && searchedRNA != null)
            doSearchFromProg(searchedRNA);

        // // 1.setup views
        // // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        // // the second body view
        // drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);

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
        // drawBarcharts(g_tpmMeanVal, g_selectedRow, "barchart", "#barchartView", g_dpwidth, g_dpheight, g_margin);
       
        // draw dotplots?
        // drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplot", "#barchartView", 
        // g_dpwidth, g_dpheight, g_margin);
    });

    // 4. load the full data
 d3.queue()
    // .defer(d3.csv, "./data/tpm_full.csv")
    .defer(d3.csv, "./data/TPM0612.csv")
    .defer(d3.csv, "./data/subjectInfo_new.csv")
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
        
       // 1.setup views
        // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        // the second body view
        drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);


        // draw the dotplot
        var ageGroupSubgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];
        drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#dotplotView", 
        g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups);

        drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#barchartView", 
        g_dpwidth, g_dpheight, g_margin);

        drawLinechart(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "linechartViewAge", "#linechartView", 
        g_dpwidth, g_dpheight, g_margin);

    })
}