


function rnaWelcomePage() {
    var width = 400;
    var height = 400;
    var butWidth = 100;
    var butHeight = 50;
    var word = "Next";
    // determine if using traditional or angle-uniform PC?

    var holder = d3.select("#VAcanvas")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // draw a rectangle

    var butX = 50;
    var butY = 50;
    holder.append("a")
        .attr("xlink:href", function (d) {
            var rnaName = d3.select("#welcomePage_rnaSearchBox").text();
            return "./RNAviewer_main.html?rna="+rnaName;
        })
        .append("rect")
        .attr("x", butX)
        .attr("y", butY)
        .attr("height", butHeight)
        .attr("width", butWidth)
        .style("fill", "lightGray")
        .attr("rx", 10)
        .attr("ry", 10);

    // draw text on the screen
    holder.append("text")
        .attr("x", butX + butWidth / 2)
        .attr("y", butY + butHeight / 2)
        .style("fill", "black")
        .style("font-size", "20px")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(word);

    butX += 50 + butWidth;
    // draw another rectangle
    holder.append("a")
        .attr("xlink:href", "./byebye.html")
        .append("rect")
        .attr("x", butX)
        .attr("y", butY)
        .attr("height", butHeight)
        .attr("width", butWidth)
        .style("fill", "lightGray")
        .attr("rx", 10)
        .attr("ry", 10);

    // draw text on the screen
    holder.append("text")
        .attr("x", butX + butWidth / 2)
        .attr("y", butY + butHeight / 2)
        .style("fill", "black")
        .style("font-size", "20px")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text("Quit");

    d3.select("#welcomePage_rnaSearchButton")
      .on("click", function () {
        var rnaSearchBox = d3.select("#welcomePage_rnaSearchBox");
        var rnaName = rnaSearchBox.property("value");
        var urlName = "./RNAviewer_main.html?rna="+rnaName;
        // console.log(urlName);
        window.location.replace(urlName);
        // window.location.reload();
        // window.location.reload(true);
    });
}
