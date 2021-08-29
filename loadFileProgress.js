function loadFileProgress(){
    
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

    // d3.queue()
    // // .defer(d3.csv, "./data/tpm_full.csv")
    // // .defer(d3.csv, "./data/TPM0612.csv")
    // // .defer(d3.csv, "./data/TPM_159.csv") // records RNA info
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
    //         .get(function (error, data) {
    //             //   meter.transition().delay(50).attr("transform", "scale(0)");
    //             //   text.text("done!");
    
    //             console.log(data.length);
    //             state = "completed";
    //             progressBar
    //                 .attr('fill', function () {
    //                     return colorScale(state);
    //                 });
    
    //         });
    // }) // records RNA info
    // .defer(d3.csv, "./data/subjectinfo_0718.csv") // records subject information
    // // .defer(d3.csv, "./data/subjectInfo_new.csv")
    // .defer(d3.csv, "./data/tpm0612_meanVal.csv")
    // .defer(d3.csv, "./data/region_group.csv")// records the location information
    // .await(function(error, data1, data2, data3, data4){
    //     if(error) throw error;

    //     // Handle the full tpm
    //     var valueKey = data1.columns;
    //     data1.forEach(function(d) {
    //         for(var i = 0; i < valueKey.length; i++)
    //         {
    //             if(valueKey[i] === "Symbol" )
    //                  d[valueKey[i]] = d[valueKey[i]];
    //             else
    //                 d[valueKey[i]] = +d[valueKey[i]];
    //         }
    //     });
    //     g_tpmFullData = data1;
    //     // Handle the subject information
    //     g_tpmSubInfo = data2;
        
    //     for(var i = 0; i < data3.length; i++)
    //     {
    //         data3[i].symbol = data3[i].symbol;
    //         data3[i].HeadNeck = +data3[i].HeadNeck;
    //         data3[i].Body = +data3[i].Body;
    //         data3[i].PalmSole = +data3[i].PalmSole;
    //         data3[i].Perineum = +data3[i].Perineum;
    //     }
    //     g_tpmMeanVal = data3;
        
    //     // connect subject Id with its sample location
    //     for(var i = 0; i < data4.length; i++){
    //         for(var j = 0; j < g_tpmSubInfo.length; j++){
    //             if(g_tpmSubInfo[j].id === data4[i].id){
    //                 g_tpmSubInfo[j].location = data4[i].regiongroup;
    //                 if(g_posNames.indexOf(data4[i].regiongroup) == -1)
    //                     g_posNames.push(data4[i].regiongroup);
    //                 break;
    //             }
    //         }
    //     }
    //     console.log(g_posNames);
    //     console.log("all files loaded!");
    //     rnaWelcomePage();
    // });
    // Progress bar for one file
    d3.csv("./data/TPM_159.csv")
    .on("progress", function(d) {
        var i = d3.interpolate(loadProgress, d.loaded / d.total);
        d3.transition().tween("progress", function () {
            state = "inProgress";
            return function (t) {
                loadProgress = i(t);
                progressBar.transition()
                    .attr('fill', function () {
                        return colorScale(state);
                    })
                    .attr('width', function () {
                        // var index = states.indexOf(state);
                        return (loadProgress) * 3 * segmentWidth; // the multiplier 3 makes the complete width of the progress bar
                    });
            };
        });
    })
        .get(function (error, data) {
            //   meter.transition().delay(50).attr("transform", "scale(0)");
            //   text.text("done!");

            console.log(data.length);
            var valueKey = data.columns;
            data.forEach(function(d) {
                for(var i = 0; i < valueKey.length; i++)
                {
                    if(valueKey[i] === "Symbol" )
                         d[valueKey[i]] = d[valueKey[i]];
                    else
                        d[valueKey[i]] = +d[valueKey[i]];
                }
            });
            g_tpmFullData = data;
            
            state = "completed";
            progressBar
                .attr('fill', function () {
                    return colorScale(state);
                });
            console.log("data base file loaded!");
            rnaWelcomePage();
        });
}