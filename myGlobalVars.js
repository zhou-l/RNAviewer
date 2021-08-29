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
var g_posNames = [];
// global data
var g_tpmMeanVal = [];
var g_tpmFullData = [];
var g_tpmSubInfo = [];
var g_exprValColorMap = [];
// var g_pathFiles = ['./data/pathHeadNeck.txt','./data/pathLegs.txt','./data/pathTorso.txt',
// './data/pathPerineum.txt','./data/pathArmsHands.txt'];
var g_pathFiles = ['./data/imagePaths/female/pathHeadNeck.txt','./data/imagePaths/female/pathLegs.txt',
'./data/imagePaths/female/pathTorso.txt',
'./data/imagePaths/female/pathPerineum.txt','./data/imagePaths/female/pathArmsHands.txt'];

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
     {"cn":"躯干+四肢",
     "en":"Extremities"},
     {"cn":"掌跖",
     "en":"PalmSole"},
     {"cn":"躯干",
     "en":"Trunk"},
     {"cn":"外阴",
     "en":"Perineum"}
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