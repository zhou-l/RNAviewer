var welcome = {};

// --------------  things that vary from task to task --------------

welcome.task = {};
welcome.task.blurb = '<b>"Angle Estimation"</b> is a short user study investigating the effectiveness of two versions of parallel coordinates visualization (a multidimensional data visualization method).';
welcome.task.time = '15 minutes';
welcome.task.pay = 'US$1.5';

// --------------  things that vary between ethics approvals --------------

welcome.ethics = {};
welcome.ethics.approval = '';
welcome.ethics.name = 'Angle Estimation';
welcome.ethics.selection = 'You are invited to participate in a memory study of various visualizations. We hope to learn which type of visualizations is more effective for angle estimation for linear regressions. You were selected as a possible participant in this study because you accepted our HIT on Amazon Mechanical Turk.';
welcome.ethics.description = 'If you decide to participate, we will present you with detailed instructions. The on-screen display will inform you of how much further you have to go. The task should take approximately ' + welcome.task.time + ' to complete including reading time.';

//----------------------- introduction ------------------------
welcome.intro = {};
// welcome.intro.blurb = function(){
//     if (PCTech == "traditional")
//         return 'The horizontal locations of crossings are associated with the angles in the scatterplot. Note that with this technique, crossings that are outside of vertical axes cannot be seen, and the horizontal range of the plot is unbounded. But you can judge from the trends of the polylines. If all polylines are parallel, the angle is 45 degree.';
//     else
//         return 'With this technique, the horizontal locations of crossings are linearly associated with the angle in the scatterplot. The horizontal range of the visualization is bounded: from half the distance between axes to the left to half the axes distance to the right';
// }



// ----------------------- function to start the task ------------------
welcome.run = function() { 
    // var tech = getRandomInt(2);
    // if(tech == 0)
    // {
    //     PCTech = "traditional";
    //     welcome.intro = 'The horizontal locations of crossings are associated with the angles in the scatterplot. Note that with this technique, crossings that are outside of vertical axes cannot be seen, and the horizontal range of the plot is unbounded. But you can judge from the trends of the polylines. If all polylines are parallel, the angle is 45 degree.';
    // }
    // else
    // {
    //     PCTech = "angleUniform";
    //     welcome.intro = 'With this technique, the horizontal locations of crossings are linearly associated with the angle in the scatterplot. The horizontal range of the visualization is bounded: from half the distance between axes to the left to half the axes distance to the right';
    // }
    document.getElementById("welcome").innerHTML =
        welcome.section.header + 
        welcome.section.start + 
        welcome.section.consent +
        welcome.section.demographics +
        welcome.section.introduction + 
        welcome.section.introEnd+
        welcome.section.tutorial +
        welcome.section.tutEnd+ 
        welcome.section.study;
}

// ------------- actions to take at the end of each click ----------------
welcome.click = {};
welcome.click.start = function() {
    welcome.helpers.setDisplay('start', 'none');
    welcome.helpers.setDisplay('consent', '');
    welcome.helpers.setHeader(' ');   
}
welcome.click.consent = function() {
    welcome.helpers.setDisplay('consent', 'none');
    welcome.helpers.setDisplay('demographics', '');
    welcome.helpers.setHeader(' ');
}

welcome.click.tutorial = function(){
    welcome.helpers.setDisplay('introdEnd', 'none');
    welcome.helpers.setDisplay('tutorial', '');
    tutorial();
}

welcome.click.study = function(){
    welcome.helpers.setDisplay('tutorial', 'none');
    welcome.helpers.setDisplay('study', '');
    actualStudy();
}

welcome.click.demographics = function() {

    dataRecord.gender = welcome.helpers.getRadioButton("gender");
    dataRecord.age = document.getElementById("age").value;

    welcome.helpers.setDisplay('demographics', 'none');
    welcome.helpers.setDisplay('introduction', '');
    welcome.helpers.setHeader('');
    introduction();
}

welcome.click.introNext = function(){
    welcome.helpers.setDisplay('introduction', 'none');
    welcome.helpers.setDisplay('introEnd', '');
    welcome.helpers.setHeader(' ');

}

welcome.click.introEnd = function(){
    welcome.helpers.setDisplay('introEnd', 'none');
    welcome.helpers.setDisplay('tutorial', '');
    tutorial();

}

welcome.click.tutorialNext = function(){
    welcome.helpers.setDisplay('tutorial', 'none');
    welcome.helpers.setDisplay('tutEnd', '');
    welcome.helpers.setHeader(' ');
}

welcome.click.tutEnd = function()
{
    welcome.helpers.setDisplay('tutEnd', 'none');
    welcome.helpers.setDisplay('study', '');
    actualStudy();
}





// ------------- html for the various sections ----------------
welcome.section = {};
welcome.section.header =
    '<!-- ####################### Heading ####################### -->' +
    '<a name="top"></a>' +
    '<h1 style="text-align:center; width:1200px" id="header" class="header">' +
    '   &nbsp; VISUS, University of Stuttgart</h1>';

welcome.section.start =
    '<!-- ####################### Start page ####################### -->' +
    '<div class="start" style="width: 1000px">' +
    '<div class="start" style="text-align:left; border:0px solid; padding:10px;' +
    '                          width:800px; float:right; font-size:100%; font-family: Arial"; >' +
    '<p>Thanks for accepting the HIT. ' + welcome.task.blurb + ' It involves the following steps:</p>' +
    '<ol>' +
    '<li> We ask for demographic information (not connected to your Amazon ID)<br></li>' +
    '<li> An introduction to how to estimate angles with parallel coordinates plots.<br></li>' +
    '<li> A brief tutorial to test your understanding of angle estimation.<br></li>' +
    '<li> Next comes the experiment itself.<br></li>' +
    '<li> At the end, we will give you the completion code you need to get paid for the HIT.</li>' +
    '</ol>' +
    '<p>The total time taken should be about ' + welcome.task.time + '. Please <u>do not</u> use the "back" or "refresh"' +
    '   button on your browser or close the window until you reach the end and receive your completion ' +
    '   code. This is very likely to break the experiment and may make it difficult for you to get paid.' +
    '   However, if something does go wrong, please contact us! When you are ready to begin, click on' +
    '   the "start" button below.</p>' +
    '<!-- Next button for the splash page -->' +
    '<p align="center"> <input type="button" id="splashButton" class="start jspsych-btn" ' +
    'value="Start!" onclick="welcome.click.start()"> </p>' +
    '</div>' +
    '</div>';
//Page 2 第二页 PARTICIPANT INFORMATION STATEMENT的文字信息以及一个按键
welcome.section.consent =
    '	<!-- ####################### Consent ####################### -->' +
    '	<div class="consent" style="display:none; width:1000px">' +
    '		<!-- Text box for the splash page -->' +
    '		<div class="consent" style="text-align:left; border:0px solid; padding:10px;  width:800px; font-size:100%; float:right; font-family: Arial">' +
    '			<p align="center">'+//<b>UNIVERSITY OF UTAH<br>' +
    '			PARTICIPANT INFORMATION STATEMENT</b><br><br>' + welcome.ethics.name + '</p>' +
    '			<p><b>Participant Selection and Purpose of Study</b></p>' +
    '			<p>' + welcome.ethics.selection + '</p>' +
    '			<p><b>Description of Study and Risks</b></p>' +
    '			<p>' + welcome.ethics.description + '</p>' +
    '			<p>No discomforts or inconveniences besides some boredom are reasonably expected. We cannot and do not guarantee or promise that you will receive any benefits from this study.</p>' +
    '			<p><b>Confidentiality and Disclosure of Information</b></p>' +
    '			<p>Any information that is obtained in connection with this study and that can be identified with you will remain confidential and will be disclosed only with your permission or except as required by law.  If you give us your permission by clicking on the "I agree" button below, we plan to publish the results in academic journals and discuss the results at scientific conferences. In any publication, information will be provided in such a way that you cannot be identified.</p>' +
    '			<p><b>Recompense to participants</b></p>' +
    '			<p>As stated on the Amazon Mechanical Turk page, the pay for completing this HIT is <b>' + welcome.task.pay + '</b></p>' +
    '			<p><b>Your consent</b></p>' +
    '			<p>If you decide to participate, you are free to withdraw your consent and to discontinue participation at any time without prejudice.</p>' +
    '			<br>' +
    '			<p align="center"><b>PARTICIPANT CONSENT</b></p>' +
    '			By continuing, you are making a decision whether or not to participate.  Clicking the button below indicates that, having read the information provided on the participant information sheet, you have decided to participate.' +
    '			<br>' +
    '			<p align="center">' +
// i agree 的按键
    '           <input type="button" id="consentButton" class="consent jspsych-btn" value="I agree" onclick="welcome.click.consent()" >' +
    '			</p>' +
    '			<p>To withdraw your consent, simply close the browser tab and return the HIT. Your data will be deleted from our records.</p>' +
    '		</div><br><br></div>';
//Page 3 第三页 Demographic information
welcome.section.demographics = 
 '	<!-- ####################### Demographics ####################### -->' +
    '	<div class="demographics" style="display:none; align:center; width: 1000px" onload = "setDemographicsPage();">' +
    '		<div class="demographics" style="text-align:left; border:0px solid; padding:10px;  width:800px; font-size:9=100%; float:right; font-family: Arial">' +
    '			<!-- Explanatory text -->' +
    '            <p font-size:110%><b>Demographic information:</b></p>' +
    '			<p>We need this information for our records, but it is kept completely separate from'  +
    '                information about your Amazon ID. As long as you finish the experiment you will get ' +
    '                paid no matter what you put here, so please be honest.</p><br>' +
    '<form method="post" id="myForm" name="myForm">'+
    '			<!-- Gender -->' +//性别信息，一个选择按钮
    '           <label for="gender"><b>Gender: &nbsp;</b></label>' +
    '           <input type="radio" name="gender" value="male"/> Male &nbsp; ' +
    '           <input type="radio" name="gender" value="female" /> Female &nbsp;' +
    '			<!-- Age -->' +//空白输入框，输入年龄
    '           <label for="age"><b>Age: &nbsp;</b></label><input id="age" name="age" required />' +
    '		<!-- Demographics  button -->' +
    '        <p align="center">' +
    '                <input type="button" class="demographics jspsych-btn" id = "demoSubmit"' +
    '                       value="Next >"  title="please fill in all required fields" ' +
    '                       onclick="welcome.click.demographics()">' +
    '       </p></form>' + 
    '</div></div>';

    welcome.section.colorblindTest = 
 '	<!-- ####################### Colorblind Test ####################### -->' +
    '	<div class="colorblindTest" style="display:none; align:center; width: 1000px">' +
    '		<div class="colorblindTest" style="text-align:left; border:0px solid; padding:10px;  width:800px; font-size:9=100%; float:right; font-family: Arial">' +
    '			<!-- Explanatory text -->' +
    '            <p font-size:110%><b>Color Vision Test:</b></p>' +
    '			<p>We need to make sure that you have normal color vision to make the experiment result eligible.'+
                '</p>' +
                '<div style = "align:center"><img src = "./stimuli/colorblindtest1.jpg"></jpg></div>'+
    '			<!-- number -->' +
    '           <label for="colorNumber"><b>Number: &nbsp;</b></label><input id="colorNumber" name="colorNumber" required />' +
    '		<!-- colorblindtest  button -->' +
    '        <p align="center">' +
    '                <input type="button" class="colorblindtest jspsych-btn"' +
    '                        id="colorblindtestButton" value="Start! >" disabled title="please fill in the number you see" ' +
    '                       onclick="welcome.click.colorblindTest()">' +
    '       </p></div></div>';
//Page 4 第四页 Introduction 介绍如何参加测试
    welcome.section.introduction = 
    '<div class="introduction" style="display:none;width: 1000px" >'+
    '<div id = "top" class = "w3-top">'+
    '<div class="w3-white w3-xlarge" syle="max-width:1200px; margin:auto">'+
    '        <div id="quitBut" class="w3-left w3-padding-16">To quit:'+
    '           <a href="./byebye.html">Quit</a>'+
    '        </div>'+
    '        <div id="nextBut" class="w3-right w3-padding-16">To continue:'+
    '                <button id="NextIntro" class="button" type="button">Next</button>'+
    '            </div>'+p
    '        <div id="headText" class="w3-center w3-padding-16">'+
    '                <h2><b>Introduction</b></h2>'+
    '         </div>'+
    '</div>        '+
    '</div>'+
    '<hr id="intro">'+
    '<div class="w3-container w3-padding-16" style="margin-top:50px">'+
    '       <div id="introText" class="text">'+
    '            <p>Here shows the parallel coordinates and its associated scatterplot.</p>'+
    '            <p><b>Pay careful attention to the crossing patterns in parallel coordiantes! '+
    ' If the crossings are within the vertical axes, the associated angle is negative; while the crossings are outside of the vertical axes, the angle is positive.'+
    '            </b></p>'+
    '            </div>'+
    '       <div id="infoTextIntro" class="text" text-align="center">'+
    // '            <p>'+welcome.intro.blurb+'</p>'+
    '   </div>'+
    '</div>'+// Introduction第二页
    '<div id = "content" class="w3-main w3-content w3-center"style="max-width:1200px;">'+
    '        <h3>The scatterplot:</h3>'+
    '        <div id="exampleSC" class="w3-row-padding w3-center" style="width:1200px;height:300px;">'+
    '        </div>'+ 
    '        <h3>Associated parallel coordinates:</h3>'+
    '        <div id="examplePC" class=" w3-row-padding w3-center parcoords" style="width:1200px;height:410px;"></div>'+       
    '</div></div>';

    ///finish the intro
    welcome.section.introEnd = 
    '	<!-- ####################### introEnd ####################### -->' +
    '<div class="introEnd" style="display:none;align:center; width: 1000px">' +
    '		<div class="introEnd" style="text-align:left; border:0px solid; padding:10px;  width:800px; font-size:24=100%; float:right; font-family: Arial">' +
    '			<!-- Explanatory text -->' +
    '            <p font-size:110%><h2>You have finished the introduction! Now proceed to the tutorial.</h2></p>' +
    '			<p><h3>In the tutorial, you will be asked to estimate the angles of the major direction of datasets.</h3></p>'+
    '           <p><h3><b> You can look at the "cheat sheet" for perfectly correlated examples by clicking the "reference" button at any time.</b></h3></p>'+
    '<p align="center">' +
    '           <input type="button" id="introEndBut" value="Continue" onclick="welcome.click.introEnd()" >' +
    '			</p>' +
    '</div>'+
    '</div>';
//finished the tutorial
    welcome.section.tutEnd = 
    '	<!-- ####################### tutEnd ####################### -->' +
    '<div class="tutEnd" style="display:none;align:center; width: 1000px">' +
    '		<div class="tutEnd" style="text-align:left; border:0px solid; padding:10px;  width:800px; font-size:24=100%; float:right; font-family: Arial">' +
    '			<!-- Explanatory text -->' +
    '            <p font-size:110%><h2>You have finished the tutorial! Continue to the actual study!</h2></p>' +
    '			<p><h3>In the actual study, you will be asked to estimate the angles of the major direction of datasets. '+
    ' The datasets may not be perfectly correlated, but in parallel coordinates, they would show similar patterns as in perfectly correlated datasets.</h3></p>'+
    '  <p><h3><b> You can look at the "cheat sheet" by clicking the "reference" button at any time.</b>'  +
    '</h3></p>'+
    '<p align="center">' +
    '           <input type="button" id="tutEnd" value="Continue" onclick="welcome.click.tutEnd()" >' +
    '			</p>' +
    '</div>'+
    '</div>';

//Tutorial Progress
    welcome.section.tutorial = 
    '<div class="tutorial" style="display:none;width: 1000px">'+
    '<div id = "top" class = "w3-top">'+
    '<div class="w3-white w3-xlarge" syle="max-width:1200px; margin:auto">'+
    '        <div id="quitBut" class="w3-left w3-padding-16">To quit:'+
    '           <a href="./byebye.html">Quit</a>'+
    '        </div>'+
    '        <div id="nextBut" class="w3-right w3-padding-16" style="display:hidden;">'+
    '<button onclick="document.getElementById(' + "'id01'" + ').style.display='+"'flex'" +'" class="w3-button w3-black">Reference</button>'+
       '            </div>'+
    '        <div id="headTextTut" class="w3-center w3-padding-16">'+
      '                <h2><b>Tutorial</b></h2>'+
    '         </div>'+
    '</div>        '+
    '</div>'+
    // The popup window
  '  <div id="id01" class="w3-modal" onclick="this.style.display=' + "'none'" + '">'+
   '   <div class="w3-modal-content">'+
     '   <div class="w3-container w3-row-padding">'+
    // '     <span onclick="document.getElementById(' + "'id01'" + ').style.display=' + "'none'" +'" class="w3-button w3-display-topright">&times;</span>'+
    '     <img src="/refAUPC.png" id = "refImg" style="width:100%">'+
  '    </div>'+
    '  </div>'+
    '</div>'+
    '<hr id="intro">'+
    '<div class="w3-container w3-padding-16 w3-center" style="margin-top:50px">'+
    '       <div id="introText" class="text">'+
     '        <p>Please estimate the angle of the major direction of these samples.</p>'+
     '           <p>Choose the correct answer from the four scatterplots below to continue!</p>'+
     '      </div>'+
    '       <div id="infoTextTut" class="text" text-align="center">   </div>'+
    '</div>'+
    '<div id = "content" class="w3-main w3-content w3-center"style="max-width:1200px;">'+
    // '        <h3>Parallel coordinates:</h3>'+
    '        <div id="examplePC" class=" w3-row-padding parcoords" style="width:610px;height:410px;"></div>'+
    '        <h3>Associated scatterplot:</h3>'+
    '        <div id="exampleSC" class="w3-row-padding w3-center" style="width:1200px;height:300px;">'+
    '        </div>'+        
    '</div></div>';
    
//actual study 
    welcome.section.study = 
    '<div class="study" style="display:none;width: 1000px">'+
    '<div id = "topStu" class = "w3-top">'+
    '<div class="w3-white w3-xlarge" syle="max-width:1200px; margin:auto">'+
    '        <div id="quitBut" class="w3-left w3-padding-16">To quit:'+
    '           <a href="./byebye.html">Quit</a>'+
    '        </div>'+
    '        <div id="nextButStu" class="w3-right w3-padding-16" style="display:hidden;">'+
    '         <button onclick="document.getElementById(' + "'id11'" + ').style.display='+"'block'" +'" class="w3-button w3-black">Reference</button>'+
    '            </div>'+
    '        <div id="headTextStu" class="w3-center w3-padding-16">'+
    '                <h2><b>Study Progress</b></h2>'+
    '         </div>'+
    '</div>        '+
    '</div>'+
     // The popup window
  '  <div id="id11" class="w3-modal" onclick="this.style.display=' + "'none'" + '">'+
  '   <div class="w3-modal-content">'+
    '   <div class="w3-container w3-row-padding">'+
//    '     <span onclick="document.getElementById(' + "'id11'" + ').style.display=' + "'none'" +'" class="w3-button w3-display-topright">&times;</span>'+
   '     <img src="/refAUPC.png" id = "refImgStudy" style="width:100%">'+
 '    </div>'+
   '  </div>'+
   '</div>'+
    '<hr id="intro">'+
    '<div class="w3-container w3-padding-16 w3-center" style="margin-top:50px">'+
    '       <div id="introText">'+
     '       <h3><p>Please estimate the angle of the major direction of these samples.</p></h3>'+
     '      </div>'+
    '       <div id="infoTextStu" class="text" text-align="center">   </div>'+
    '</div>'+
    '<div id = "contentStu" class="w3-main w3-content w3-center"style="max-width:1200px;">'+
    '        <h3>Parallel coordinates:</h3>'+
    '        <div id="examplePC" class=" w3-row-padding parcoords" style="width:610px;height:410px;"></div>'+
    '        <h3>Choices: click on one of the four figures below that you think is correct! Your accuracy and response time will be recorded</h3>'+
    '        <div id="exampleSC" class="w3-row-padding w3-center" style="width:1200px;height:300px;">'+
    '        </div>'+        
    '</div></div>';
    // Check demographics is filled
    // $(function () {
    //     $("#age").bind("change keyup",
    //         function () {
    //             if ($("#age").val() != "") {
    //                 $('#demoSubmit').removeAttr("disabled");
    //                 //   welcome.click.demographics();
    //             }

    //             else
    //                 $('#demoSubmit').attr("disabled", "disabled");
    //         });
    // });

// ----------------------- helper functions ------------------

welcome.helpers = {};
welcome.helpers.getRadioButton = function(name) { // get the value of a radio button
    var i, radios = document.getElementsByName(name);
    for (i = 0; i < radios.length; i = i + 1) {
        if (radios[i].checked) {
            return (radios[i].value);
        }
    }
    return ("NA");
}
welcome.helpers.setDisplay = function(theClass, theValue) { // toggle display status
    var i, classElements = document.getElementsByClassName(theClass);
    for (i = 0; i < classElements.length; i = i + 1) {
        classElements[i].style.display = theValue;
    }
}
welcome.helpers.setVisibility = function(theClass, theValue) { // toggle visibility
    var i, classElements = document.getElementsByClassName(theClass);
    for (i = 0; i < classElements.length; i = i + 1) {
        classElements[i].style.visibility = theValue;
    }
}
welcome.helpers.setHeader = function(theValue) { // alter the header
    document.getElementById("header").innerText = theValue;
}









