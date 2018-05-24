/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _poisson_disc_generator = __webpack_require__(1);

var _poisson_disc_generator2 = _interopRequireDefault(_poisson_disc_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
  // const img = document.getElementById('original-image');
  // var imageCanv = document.getElementById('image-canvas');
  // imageCanv.width = img.width;
  // imageCanv.height = img.height;
  // const imgContext = imageCanv.getContext('2d');
  var img = new Image();
  img.src = 'starry_night.jpg';
  // img.crossOrigin = 'anonymous';
  var imageCanv = document.getElementById('image-canvas');
  var imgContext = imageCanv.getContext('2d');
  img.onload = function () {
    imgContext.drawImage(img, 0, 0, 400, 400);
  };
  // document.append(canvas);
  // context.getImageData(x, y, 1, 1).data;
  var poissonCanvas = document.getElementById("poisson-canvas");
  var poissonCanvasMap = document.getElementById("poisson-path-canvas");

  (0, _poisson_disc_generator2.default)(imageCanv, poissonCanvas, poissonCanvasMap, 2, 30);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = generatePoissonSample;
function generatePoissonSample(imageCanvas, canvas, canvas2, radius, maxCandidates) {
  var canvasHeight = canvas.height;
  var canvasWidth = canvas.width;
  var context = canvas.getContext("2d");
  var context2 = canvas2.getContext("2d");
  var imageCanvasContext = imageCanvas.getContext("2d");
  var cellSize = Math.floor(radius / Math.sqrt(2));
  var gridHeight = Math.ceil(canvasHeight / cellSize) + 1;
  var gridWidth = Math.ceil(canvasWidth / cellSize) + 1;

  var grid = [];
  var points = [];
  var firstPointsArr = [];

  var rowIdx = void 0;
  var colIdx = void 0;
  for (rowIdx = 0; rowIdx < gridHeight; rowIdx++) {
    grid[rowIdx] = new Array(gridWidth);
  }

  function pointToGridCoords(point) {
    rowIdx = Math.floor(point[0] / cellSize);
    colIdx = Math.floor(point[1] / cellSize);
    return [rowIdx, colIdx];
  }

  function calculateDotRadius(point) {
    var pixelData = imageCanvasContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
    var grayScaleVal = pixelData.reduce(function (memo, val) {
      return memo + val;
    }, 0) / 3;
    var dotRadius = (300 - grayScaleVal) / 300 * (radius / 2);
    // debugger
    return dotRadius;
  }

  function insert(point) {
    points.push(point);
    var dotRadius = calculateDotRadius(point);
    // debugger
    context.beginPath();
    context.arc(point[0], point[1], dotRadius, 0, 2 * Math.PI);
    context.fill();

    var _pointToGridCoords = pointToGridCoords(point);

    var _pointToGridCoords2 = _slicedToArray(_pointToGridCoords, 2);

    rowIdx = _pointToGridCoords2[0];
    colIdx = _pointToGridCoords2[1];

    grid[rowIdx][colIdx] = point;
  }

  function drawLine(newPoint, prevPoint) {
    context2.beginPath();
    context2.moveTo(prevPoint[0], prevPoint[1]);
    context2.lineTo(newPoint[0], newPoint[1]);
    context2.stroke();
  }

  function distance(pointA, pointB) {
    var squaredDist = Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2);
    return Math.sqrt(squaredDist);
  }

  function isInRange(point) {
    return point[0] > 0 && point[0] < canvasHeight && point[1] > 0 && point[1] < canvasWidth;
  }

  function isValidPoint(point) {
    if (!isInRange(point)) {
      return false;
    }

    var _pointToGridCoords3 = pointToGridCoords(point);

    var _pointToGridCoords4 = _slicedToArray(_pointToGridCoords3, 2);

    rowIdx = _pointToGridCoords4[0];
    colIdx = _pointToGridCoords4[1];

    var rowIdxMin = Math.max(0, rowIdx - 1);
    var colIdxMin = Math.max(0, colIdx - 1);
    var rowIdxMax = Math.min(gridWidth - 1, rowIdx + 1);
    var colIdxMax = Math.min(gridHeight - 1, colIdx + 1);

    for (rowIdx = rowIdxMin; rowIdx <= rowIdxMax; rowIdx++) {
      for (colIdx = colIdxMin; colIdx <= colIdxMax; colIdx++) {
        if (grid[rowIdx][colIdx] && distance(grid[rowIdx][colIdx], point) < radius) {
          return false;
        }
      }
    }
    return true;
  }

  var p0 = [Math.round(Math.random() * canvasWidth), Math.round(Math.random() * canvasHeight)];
  firstPointsArr.push(p0);
  insert(p0);

  var refIdx = void 0;
  var refPoint = void 0;
  var numCandidates = void 0;
  var candidateMaxReached = void 0;
  var candidatePoint = void 0;
  var theta = void 0;
  var dist = void 0;

  function drawNextPoint(activePoints) {
    if (activePoints.length === 0) {
      return;
    }
    refIdx = Math.floor(Math.random() * activePoints.length);
    refPoint = activePoints[refIdx];
    candidateMaxReached = true;
    for (numCandidates = 0; numCandidates <= maxCandidates; numCandidates++) {
      theta = Math.random() * 360;
      dist = Math.random() * radius + radius;
      candidatePoint = [dist * Math.cos(theta) + refPoint[0], dist * Math.sin(theta) + refPoint[1]];
      if (isValidPoint(candidatePoint)) {
        insert(candidatePoint);
        drawLine(candidatePoint, refPoint);
        activePoints.push(candidatePoint);
        candidateMaxReached = false;
        break;
      }
    }
    var newPoints = void 0;
    setTimeout(function () {
      if (candidateMaxReached) {
        newPoints = activePoints.slice(0, refIdx).concat(activePoints.slice(refIdx + 1));
      } else {
        newPoints = activePoints.slice(0);
      }
      drawNextPoint(newPoints);
    }, 0);
  }
  //
  drawNextPoint(firstPointsArr);
  // while (activePoints.length > 0) {
  //   refIdx = Math.floor(Math.random() * activePoints.length);
  //   refPoint = activePoints[refIdx];
  //   candidateMaxReached = true;
  //   for (numCandidates = 0; numCandidates <= maxCandidates; numCandidates++) {
  //     theta = Math.random() * 360;
  //     dist = (Math.random()*radius + radius);
  //     candidatePoint = [dist * Math.cos(theta) + refPoint[0],
  //                       dist * Math.sin(theta) + refPoint[1]];
  //     if (isValidPoint(candidatePoint)) {
  //       insert(candidatePoint);
  //       drawLine(candidatePoint, refPoint);
  //       activePoints.push(candidatePoint);
  //       candidateMaxReached = false;
  //       break;
  //     }
  //   }
  //   if (candidateMaxReached) {
  //     activePoints.splice(refIdx, 1);
  //   }
  // }

  // return grid;
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map