// global variables
var g_margin = { left: 20, right: 20, top: 30, bottom: 30 };

// bar charts
var g_bcwidth = 1200;
var g_bcheight = 600;

// dot plots
var g_dpwidth = 1200;
var g_dpheight = 600;

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
    var nodeParts = svg.selectAll(".bodyParts")
    .data(parts)
    .enter()
    .append("circle")
    .attr("class", "bodyParts")
    .attr("id",function(d,i){return i;})
    .attr("r",10)
    .attr("cx", function(d,i){return 20 + 25*i;})
    .attr("cy", function(d,i){return 20 + 25*i;})
    .style("fill", function(d,i){return g_exprValColorMap(i/parts.length)})
    ;

    // Get image outline
    // var getImageOutline = require(['image-outline']);
    // getImageOutline(logoUrl, function (err, polygon) {
    //     if (err) {
    //         // err is an Error; handle it
    //         return;
    //     }

    //     // polygon is now an array of {x,y} objects. Have fun!
    //     console.log(polygon);
    // });

    // Draw parts
    var parts = [1];//[1,2,3,4,5];
    var nodePartSilhouette = svg.append("g").attr("class", "bodyShape");
    // nodePartSilhouette.select(".bodyOutline")
    // .data(g_pathFiles)
    // .enter()
    // .append('path')
    // .attr("class","bodyOutline")
    // .attr("id", function(d,i){return "bodyPart"+i;});

    // .select(".bodyOutline");
    // .data(parts)
    // .enter();
    var allPathData = [];
    var xscale = 0.65*width/g_orgBodyImgWidth;
    var yscale = height/g_orgBodyImgHeight;
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
        .attr("id","bodyPart1")
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
        .style("fill", function(){return g_exprValColorMap(0.2);})
        .style("opacity","0.5")
         .attr("transform","translate("+ 70 +","+0+")");

        var bodyPart1_2 = nodePartSilhouette
            .append('path')
            .attr("id", "bodyPart1")
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
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart1_3 = nodePartSilhouette
            .append('path')
            .attr("id", "bodyPart1")
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
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            var bodyPart1_4 = nodePartSilhouette
            .append('path')
            .attr("id", "bodyPart1")
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
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");


            var bodyPart2_1 = nodePartSilhouette
            .append('path')
            .attr("id", "bodyPart2")
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
            .style("fill", function () { return g_exprValColorMap(0.4); })
            .style("opacity", "0.5")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");

            
            var bodyPart2_2 = nodePartSilhouette
            .append('path')
            .attr("id", "bodyPart2")
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
            .attr("id", "bodyPart2")
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
            .attr("id", "bodyPart3")
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
            .attr("id", "bodyPart4")
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
            .attr("id", "bodyPart5")
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
    });



    // for(var s = 0; s < g_pathFiles.length; s++){
    //     console.log(s);
    //     d3.csv(g_pathFiles[s], function(data){
    //         data.forEach(d => {
    //             d.x = +d.x;
    //             d.y = +d.y;
    //         });
    //         allPathData.push(data);
    //         var xscale = 0.65*width/g_orgBodyImgWidth; // unclear why xscale is not correct???
    //         var yscale = height/g_orgBodyImgHeight;
    //         // set path

    //         nodePartSilhouette.append('path')
    //         .attr("class","bodyOutline")
    //         .attr("d", function(){
    //             var pathStr = "M ";

    //             for(var i = 0; i < data.length; i++)
    //             {
    //                 if(i > 0)
    //                     pathStr += "L " + data[i].x * xscale + " " + data[i].y * yscale+" ";
    //                 else
    //                     pathStr += data[i].x * xscale + " " + data[i].y * yscale +" ";
    //                 if(i == data.length-1)
    //                     pathStr += "z";
    //             }
    //             return pathStr;
    //         })
    //         .style("fill", function(d,i){return g_exprValColorMap(0.2 * s)})
    //         .style("opacity","0.5")
    //          .attr("transform","translate("+ 70 +","+0+")")
    //         // .attr("transform","translate("+width/2+","+height/2+")");
    //     })
    // }

    svg_img.attr('height', height)
        .attr('width', width)
        .attr('xlink:href', logoUrl)
        .attr("fill", "black")
        .style('stroke', '#AAA')
        .style("opacity",0.1)
        ;
    return svg_img;
}

function setupSearchView(g_tmpMeanVal, className, divName, width, height, margin)
{
    
    var svg = d3.select(divName)
    .append("svg")
    .attr('class', className)
    .attr('id', className)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;

}

function drawDotplots()
{


}

function rnaViewerMain()
{
    // g_exprValColorMap = d3.scaleOrdinal(d3.schemeYlOrRd[5]);
    g_exprValColorMap = d3.scaleSequential(d3.interpolateYlOrRd);
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

        setupSearchView(g_tmpMeanVal, "searchArea", "#rnaSearchBox", g_bvwidth, g_bvheight, g_margin);
    });
}