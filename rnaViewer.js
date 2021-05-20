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

// global data
var g_tmpMeanVal = [];

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
    svg_img .attr('height', height)
    .attr('width',width)
    .attr('xlink:href', logoUrl);

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