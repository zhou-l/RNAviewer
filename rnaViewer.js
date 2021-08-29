
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
        .attr('x',function(){return horAdj;} )
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
    .attr("cx", function(d,i){return (width+svgHorAdj) - 35;})
    .attr("cy", function(d,i){return 20 + 25*i;})
    .style("fill", function(d,i){return g_exprValColorMap(d)})
    ;

    svg.append("g").selectAll(".legendLabels")
      .data(g_colormapThres)
      .enter()
      .append("text")
      .attr("class","legendLabels")
      .style("font-size", "12px")
      .attr("x", function() {return (width+svgHorAdj)-25;})
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
    .defer(d3.csv, "./data/imagePaths/female/pathPerineum.txt")
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
            .attr("id", "pathPerineum")
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
            .attr("id", "pathTrunk")
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
    .defer(d3.csv, "./data/imagePaths/male/pathPerineum.txt")
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
            .attr("id", "pathPerineum")
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
            .attr("id", "pathTrunk")
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

function drawDotplots(data, subjectInfoData, className, divName, width, height, margin, zsubgroups=['F','M'], zisLog = true, zIsPalmSoleOnly = false)
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

    var subgroups = zsubgroups;
    var isLog = zisLog;
    var isSex = false;
    var isPalmSoleOnly = zIsPalmSoleOnly;
    if (subgroups[0] === 'F' && subgroups[1] === 'M')
        isSex = true;
    else
        isSex = false;
        
    var namegroups = [];
    if(g_posNames == [])
        g_posNames = d3.set(g_tpmSubInfo.location).values();
    namegroups = g_posNames;
    
    var xtxtGroups = [];
    if(g_isEnglish)
    {
        xtxtGroups = namegroups;
    }
    else
    {
        for(var i = 0; i < g_posTranslate.length; i++){
            if(namegroups[i] === g_posTranslate[i].en)
                xtxtGroups.push(g_posTranslate[i].cn);
        } 
    }
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .rangeRound([margin.left, width - margin.right])
        // .domain(function (d) { 
        // })
        .padding(0.2);

  
    if (isPalmSoleOnly)
        x.domain(['PalmSole']);
    else
        x.domain(namegroups);

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
    
    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .paddingInner(0) // edit the inner padding value in [0,1]
        .paddingOuter(0.5) // edit the outer padding value in [0,1]
        .align(0.5) // edit the align: 0 is aligned left, 0.5 centered, 1 aligned right.
        .padding([0.05]);

    if(isPalmSoleOnly)
        xSubgroup.range([50,width]);

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

        if(isPalmSoleOnly)
        {
            if(info[0].location === "PalmSole"){
                groups.push(datum.group);
                groupedData.push(datum);
            }
        }
        else{
            
            groups.push(datum.group);
            groupedData.push(datum);
        }
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
    var idPalmSole = uniqueGroups.indexOf("PalmSole");
    var subgroupLen = uniqueGroups.length;
    if(isPalmSoleOnly)
    {
        subgroupLen = 1;
    }

    var subgroupedData = Array(subgroupLen);
    var groupedSumStat = Array(subgroupLen);
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
        if(isPalmSoleOnly){
            if(id == idPalmSole)
                subgroupedData[0].push({key: kky, value: d.val });
        }
        else
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
        // groupedSumStat.push(sumstat);
    }

    // draw the boxplot
    // Show the main vertical line
    
    svg
        .selectAll("bpVertLines")
        .data(groupedSumStat)
        .enter()
        .append("g")
        .attr("class", "bpVertLines")
        .attr("transform", function (d,i) {
            if(isPalmSoleOnly)
                return "translate(0,0)";
            else
                return "translate(" + x(uniqueGroups[i]) + ",0)"; 
            })
        .selectAll("line")
        .data(function(d){
            console.log(d);
            console.log(d.key);
            return d;
        })
        .enter().append("line")
        .attr("y1", function (d) {
            // console.log(d);
            return (y(d.value.min+ydelta));
        })
        // .attr("y2", function (d) { return (y(d.value.max)) })
        .attr("y2", function (d) { return (y(d.value.max+ydelta)) })
        .attr("x1", function (d,i) { return (xSubgroup(d.key) + xSubgroup.bandwidth()
             / 2) })
        .attr("x2", function (d,i) { return (xSubgroup(d.key ) + xSubgroup.bandwidth() / 2) })
        .attr("stroke", "black")
        .style("width", 40);


    // rectangle for the main box
    svg
        .selectAll("bpBoxes")
        .data(groupedSumStat)
        .enter()
        .append("g")
        .attr("class", "bpBoxes")
        .attr("transform", function (d,i) {            
        if(isPalmSoleOnly)
            return "translate(0,0)";
        else
            return "translate(" + x(uniqueGroups[i]) + ",0)";  })
        .selectAll("rect")
        .data(function(d){
            // console.log(d);
            console.log(d.key);
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
        .attr("transform", function (d,i) {            
            if(isPalmSoleOnly)
                return "translate(0,0)";
            else
                return "translate(" + x(uniqueGroups[i]) + ",0)";  
            })
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
        .attr("transform", function (d) { 
            return "translate(" + x(d.group) + ",0)"; 
        })
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
        .attr("cx", function (d) { 
            if(isPalmSoleOnly)
                return  xSubgroup(d.key) - (xSubgroup.bandwidth()/2 )+ Math.random() * jitterWidth;
            else
                return (xSubgroup(d.key) + (xSubgroup.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth);
         })
        // .attr("cy", function (d) { return y(d.value); })
        .attr("cy", function (d) { return y(d.value + ydelta); })
        .attr("r", 4)
        .style("fill", function (d) {    
            if (subgroups.length == 2) {
            if (d.key == 'F')
                return "steelblue";
            else
                return "coral";
        }
        else
            return (g_colormapGroups(d.key));})
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
    var subgroups = zsubgroups;
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
    var ageGroupedData = [];
    var ageGroups = [0,18,40];
    for(var i = 0; i < ageGroups.length; i++)
    {
        ageGroupedData.push([]);
    }

    for(var i  = 0; i < subgroupedData.length; i++){
        subgroupedData[i].sort(function(x,y){return d3.ascending(x.age, y.age);});
        for(var j = 0; j < subgroupedData[i].length; j++)
        {
            for(var ag = 0; ag < ageGroups.length-1; ag ++){
                if(subgroupedData[i][j].age >= ageGroups[ageGroups.length-1]){
                    ageGroupedData[ageGroups.length-1].push({key: ageGroups.length-1, value: subgroupedData[i][j]});
                    break;
                }
                if(subgroupedData[i][j].age >= ageGroups[ag] && subgroupedData[i][j].age < ageGroups[ag+1]){
                    ageGroupedData[ag].push({key: ag, value: subgroupedData[i][j]});
                    break;
                }
            }
        }
    }
  // compute grouped stats
  var groupedSumStat = Array(ageGroups.length);
  for(var i = 0; i < ageGroupedData.length;i++){
    var sumstat = d3.nest()
    .key(function(d) {return d.key;})
    .rollup(function(d){
        q1 = d3.quantile(d.map(function(g) { return g.value.val;}).sort(d3.ascending),.25);
        median = d3.quantile(d.map(function(g) { return g.value.val;}).sort(d3.ascending),.5);
        q3 = d3.quantile(d.map(function(g) { return g.value.val;}).sort(d3.ascending),.75);
        interQuantileRange = q3 - q1;
        min = d3.min(d.map(function(g) { return g.value.val;}));//q1 - 1.5 * interQuantileRange;
        max = d3.max(d.map(function(g) { return g.value.val;}));//q3 + 1.5 * interQuantileRange;
        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max});
    })
    .entries(ageGroupedData[i]);
    // console.log(sumstat);
    groupedSumStat[i] = sumstat;
}

    // draw a line for each location

    for (var i = 0; i < subgroupedData.length; i++) {
        // var valueline = d3.line()
        //     .x(function (d) { return x(d.age); })
        //     .y(function (d) { return y(d.val+ydelta); });
        // do regression
        if(uniqueGroups[i] != "PalmSole")
            continue;
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
        // .data(uniqueGroups)
        .data(["PalmSole"])
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
    // .data(uniqueGroups)
    .data(["PalmSole"])
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
    var uniqueGroups = [];
    if(g_posNames == []){
        g_posNames = d3.set(groups).values();;
    }
    uniqueGroups = g_posNames;
    console.log(uniqueGroups);

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
            ;

        var partHeadNeckM = bodyViewM.selectAll(partSvgName)
            .style("fill", function () {
                var val = (selectedData[id][0].key == "M") ? selectedData[id][0].value.mu : selectedData[id][1].value.mu;
                return g_exprValColorMap(val);
            })
            .style("opacity", "0.5")
            ;
    }
    // update trunk
    var partTrName = "Extremities";
    var idTr = uniqueGroups.indexOf(partTrName);
    var partTrSvgName = "#pathTrunk";
    var partTrunk = bodyView.selectAll(partTrSvgName)
        .style("fill", function () {
            var val = (selectedData[idTr][0].key == "F") ? selectedData[idTr][0].value.mu : selectedData[idTr][1].value.mu;
            return g_exprValColorMap(val);
        })
        .style("opacity", "0.5")
        ;

    var partTrunkM = bodyViewM.selectAll(partTrSvgName)
        .style("fill", function () {
            var val = (selectedData[idTr][0].key == "M") ? selectedData[idTr][0].value.mu : selectedData[idTr][1].value.mu;
            return g_exprValColorMap(val);
        })
        .style("opacity", "0.5");
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
    // Perineum
    id  = uniqueGroups.indexOf("Perineum");
    var partPerineum = bodyView.selectAll("#pathPerineum")
       // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Perineum");
        if(g_isEnglish)
            tooltip.text(`Perineum: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
            tooltip.text(`外阴: ${selectedData[tid][0].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });

    var partPerineumM = bodyViewM.selectAll("#pathPerineum")
       // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Perineum");
        if(g_isEnglish)
            tooltip.text(`Perineum:${selectedData[tid][1].value.mu.toFixed(3)}`);
        else
            tooltip.text(`外阴:${selectedData[tid][1].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    // -------------------------------------------
    // Body
    // id  = uniqueGroups.indexOf("Trunk");// we have extremities and trunk as one group
    id = uniqueGroups.indexOf("Extremities")
    var partBody = bodyView.selectAll("#pathTrunk")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Extremities");
        if(g_isEnglish)
            tooltip.text(`Trunk: ${selectedData[tid][0].value.mu.toFixed(3)}`);
        else
            tooltip.text(`躯干: ${selectedData[tid][0].value.mu.toFixed(3)}`);

        tooltip.style("visibility", "visible");
    })
    .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
    });
    var partBodyM = bodyViewM.selectAll("#pathTrunk")
    // 把这一部分复制粘贴到其他部位即可
    .on("mousemove", function(d) {
        tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseover", function(d) {
        var tid = uniqueGroups.indexOf("Extremities");
        if(g_isEnglish)
            tooltip.text(`Trunk: ${selectedData[tid][1].value.mu.toFixed(3)}`);
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
    if(g_selectedRow < 0 || g_selectedRow >= g_tpmFullData.length)
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
    drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#dotplotView",
        g_dpwidth, g_dpheight, g_margin);

    d3.selectAll(".dotplotageGroup").remove();
    // var ageGroupSubgroups = ['0_10', '11_20', '21_30', '31_40', '41_50', '51_60', '61_70', 'over70'];
    var ageGroupSubgroups = ['0-17', '18-39', 'over 40'];
    drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#barchartView",
        g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups, true, true);

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

      var svg = d3.select('.progress')
		.append('svg')
		.attr('height', 100)
		.attr('width', 500);

	var states = ['started', 'inProgress', 'completed'],
	    segmentWidth = 100,
		currentState = 'started';

	var colorScale = d3.scaleOrdinal()
		.domain(states)
		.range(['yellow', 'orange', 'green']);

	svg.append('rect')
		.attr('class', 'bg-rect')
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', 'gray')
		.attr('height', 15)
		.attr('width', function(){
			return segmentWidth * states.length;
		})
		.attr('x', 0);

	var progressBar = svg.append('rect')
					.attr('class', 'progress-rect')
					.attr('fill', function(){
						return colorScale(currentState);
					})
					.attr('height', 15)
					.attr('width', 0)
					.attr('rx', 10)
					.attr('ry', 10)
					.attr('x', 0);

    progressBar.transition()
        .duration(1000)
        .attr('width', function () {
            var index = states.indexOf(currentState);
            return (index + 1) * segmentWidth;
        });

    // load all necessary files and set global variables!
    var loadProgress = 0;

    d3.queue()
    // .defer(d3.csv, "./data/tpm_full.csv")
    // .defer(d3.csv, "./data/TPM0612.csv")
    .defer(d3.csv, "./data/TPM_159.csv") // records RNA info
    // .defer(function(){
    //     d3.csv("./data/TPM_159.csv")
    //     .on("progress", function(d) {
    //         var i = d3.interpolate(loadProgress, d.loaded / d.total);
    //         d3.transition().tween("progress", function () {
    //             state = "inProgress";
    //             return function (t) {
    //                 loadProgress = i(t);
    //                 progressBar.transition()
    //                     .attr('fill', function () {
    //                         return colorScale(state);
    //                     })
    //                     .attr('width', function () {
    //                         // var index = states.indexOf(state);
    //                         return (loadProgress) * 3 * segmentWidth; // the multiplier 3 makes the complete width of the progress bar
    //                     });
    //             };
    //         });
    //     })
    // }) // records RNA info
    .defer(d3.csv, "./data/subjectinfo_0718.csv") // records subject information
    // .defer(d3.csv, "./data/subjectInfo_new.csv")
    .defer(d3.csv, "./data/tpm0612_meanVal.csv")
    .defer(d3.csv, "./data/region_group.csv")// records the location information
    .await(function(error, data1, data2, data3, data4){
        if(error) throw error;

        // Handle the full tpm
        var valueKey = data1.columns;
        console.log(data1.length);
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
        
        for(var i = 0; i < data3.length; i++)
        {
            data3[i].symbol = data3[i].symbol;
            data3[i].HeadNeck = +data3[i].HeadNeck;
            data3[i].Body = +data3[i].Body;
            data3[i].PalmSole = +data3[i].PalmSole;
            data3[i].Perineum = +data3[i].Perineum;
        }
        g_tpmMeanVal = data3;
        
        // connect subject Id with its sample location
        for(var i = 0; i < data4.length; i++){
            for(var j = 0; j < g_tpmSubInfo.length; j++){
                if(g_tpmSubInfo[j].id === data4[i].id){
                    g_tpmSubInfo[j].location = data4[i].regiongroup;
                    if(g_posNames.indexOf(data4[i].regiongroup) == -1)
                        g_posNames.push(data4[i].regiongroup);
                    break;
                }
            }
        }
        console.log(g_posNames);
        console.log("all files loaded!");

        // 2. setup search box
        setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
        // 1.setup views
        // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
        // the second body view
        drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);


        // draw the dotplot
        // var ageGroupSubgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];
        var ageGroupSubgroups = ['0-17', '18-39', 'over 40'];
        drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#barchartView",
            g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups, true, true);

        drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#dotplotView",
            g_dpwidth, g_dpheight, g_margin);

        drawLinechart(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "linechartViewAge", "#linechartView",
            g_dpwidth, g_dpheight, g_margin);

    });

    // loadFileProgress();
    // // assume that the full tpm file is loaded!
    // if(g_tpmFullData.length != 0)
    // {
    //     d3.queue()
    //     // .defer(d3.csv, "./data/tpm_full.csv")
    //     // .defer(d3.csv, "./data/TPM0612.csv")
    //     // .defer(d3.csv, "./data/TPM_159.csv") // records RNA info
    //     // .defer(d3.csv, "./data/tpm_159_test.csv") // records RNA info
    //     .defer(d3.csv, "./data/subjectinfo_0718.csv") // records subject information
    //     // .defer(d3.csv, "./data/subjectInfo_new.csv")
    //     .defer(d3.csv, "./data/tpm0612_meanVal.csv")
    //     .defer(d3.csv, "./data/region_group.csv")// records the location information
    //     .await(function(error, data1, data2, data3){
    //         if(error) throw error;
    
    //         // Handle the subject information
    //         g_tpmSubInfo = data1;
            
    //         for(var i = 0; i < data2.length; i++)
    //         {
    //             data2[i].symbol = data2[i].symbol;
    //             data2[i].HeadNeck = +data2[i].HeadNeck;
    //             data2[i].Body = +data2[i].Body;
    //             data2[i].PalmSole = +data2[i].PalmSole;
    //             data2[i].Perineum = +data2[i].Perineum;
    //         }
    //         g_tpmMeanVal = data2;
            
    //         // connect subject Id with its sample location
    //         for(var i = 0; i < data3.length; i++){
    //             for(var j = 0; j < g_tpmSubInfo.length; j++){
    //                 if(g_tpmSubInfo[j].id === data3[i].id){
    //                     g_tpmSubInfo[j].location = data3[i].regiongroup;
    //                     if(g_posNames.indexOf(data3[i].regiongroup) == -1)
    //                         g_posNames.push(data3[i].regiongroup);
    //                     break;
    //                 }
    //             }
    //         }
    //         console.log(g_posNames);
    //         // console.log(g_tpmSubInfo);
    
    //         // 0. Prepare the search bar with a default term
    //         if (searchedRNA != "A1BG" && searchedRNA != null)
    //             doSearchFromProg(searchedRNA);
    
            
    
    //         // // 1.setup views
    //         // // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         // // the second body view
    //         // drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);
    
    //         // 2. setup search box
    //         setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
    //        // 1.setup views
    //         // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         // the second body view
    //         drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);
    
    
    //         // draw the dotplot
    //         // var ageGroupSubgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];
    //         var ageGroupSubgroups = ['0-17', '18-39','over 40'];
    //         drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#barchartView", 
    //         g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups, true, true);
    
    //         drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#dotplotView", 
    //         g_dpwidth, g_dpheight, g_margin);
    
    //         drawLinechart(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "linechartViewAge", "#linechartView", 
    //         g_dpwidth, g_dpheight, g_margin);
    
    //     })
    // }
    // else{
    //     d3.queue()
    //     // .defer(d3.csv, "./data/tpm_full.csv")
    //     // .defer(d3.csv, "./data/TPM0612.csv")
    //     // .defer(d3.csv, "./data/TPM_159.csv") // records RNA info
    //     .defer(d3.csv, "./data/tpm_159_test.csv") // records RNA info
    //     .defer(d3.csv, "./data/subjectinfo_0718.csv") // records subject information
    //     // .defer(d3.csv, "./data/subjectInfo_new.csv")
    //     .defer(d3.csv, "./data/tpm0612_meanVal.csv")
    //     .defer(d3.csv, "./data/region_group.csv")// records the location information
    //     .await(function(error, data1, data2, data3, data4){
    //         if(error) throw error;

    //         var valueKey = data1.columns;
    //         data.forEach(function(d) {
    //             for(var i = 0; i < valueKey.length; i++)
    //             {
    //                 if(valueKey[i] === "Symbol" )
    //                      d[valueKey[i]] = d[valueKey[i]];
    //                 else
    //                     d[valueKey[i]] = +d[valueKey[i]];
    //             }
    //         });
    //         g_tpmFullData = data1;
    
    //         // Handle the subject information
    //         g_tpmSubInfo = data2;
            
    //         for(var i = 0; i < data3.length; i++)
    //         {
    //             data3[i].symbol = data3[i].symbol;
    //             data3[i].HeadNeck = +data3[i].HeadNeck;
    //             data3[i].Body = +data3[i].Body;
    //             data3[i].PalmSole = +data3[i].PalmSole;
    //             data3[i].Perineum = +data3[i].Perineum;
    //         }
    //         g_tpmMeanVal = data3;
            
    //         // connect subject Id with its sample location
    //         for(var i = 0; i < data4.length; i++){
    //             for(var j = 0; j < g_tpmSubInfo.length; j++){
    //                 if(g_tpmSubInfo[j].id === data4[i].id){
    //                     g_tpmSubInfo[j].location = data4[i].regiongroup;
    //                     if(g_posNames.indexOf(data4[i].regiongroup) == -1)
    //                         g_posNames.push(data4[i].regiongroup);
    //                     break;
    //                 }
    //             }
    //         }
    //         console.log(g_posNames);
    //         // console.log(g_tpmSubInfo);
    
    //         // 0. Prepare the search bar with a default term
    //         if (searchedRNA != "A1BG" && searchedRNA != null)
    //             doSearchFromProg(searchedRNA);
    
    //         // 2. setup search box
    //         setupSearchView(g_tpmMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
    //        // 1.setup views
    //         // drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         drawFemaleBodyView(g_tpmMeanVal, "bodyMap", "#bodyView", g_bvwidth, g_bvheight, g_margin);
    //         // the second body view
    //         drawMaleBodyView(g_tpmMeanVal, "bodyMapM", "#bodyViewM", g_bvwidth, g_bvheight, g_margin);
    
    
    //         // draw the dotplot
    //         // var ageGroupSubgroups = ['0_10','11_20','21_30','31_40','41_50','51_60','61_70','over70'];
    //         var ageGroupSubgroups = ['0-17', '18-39','over 40'];
    //         drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotageGroup", "#barchartView", 
    //         g_dpwidth, g_dpheight, g_margin, ageGroupSubgroups, true, true);
    
    //         drawDotplots(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "dotplotSex", "#dotplotView", 
    //         g_dpwidth, g_dpheight, g_margin);
    
    //         drawLinechart(g_tpmFullData[g_selectedRow], g_tpmSubInfo, "linechartViewAge", "#linechartView", 
    //         g_dpwidth, g_dpheight, g_margin);
    
    //     })
    // }

}