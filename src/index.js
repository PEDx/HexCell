import './css/main.css';
import { rule_36, rule_30 } from './rule';
import config from './config';

const CANVAS_BOX_COL = +config.canvasBoxCol;
const CANVAS_BOX_WIDTH = +config.canvasWidth;

let randomRender = document.getElementById('randomRender'),
    value = document.getElementById('count'),
    imgArr = document.getElementById('imgArr');

function configInit(width, height, num) {
    var _str = '',
        count = num * num;
    width = Math.floor(width / num);
    height = Math.floor(height / num);
    items.row = num;
    for (var i = 0; i < count; i++) {
        _str +=
            "<div class='it'  data-value= '0' style= " +
            'width:' +
            width +
            'px;height:' +
            height +
            'px;' +
            '></div>';
    }
    configBox.innerHTML = _str;
    configBox.onclick = function(event) {
        var item = event.target;
        if (item.dataset.value === '0') {
            item.className = 'it alive';
            item.dataset.value = '1';
        } else {
            item.className = 'it';
            item.dataset.value = '0';
        }
    };
    console.log(count);
}
//初始化配置机
// configInit(boxWidth, boxHeight, CONFIG_BOX_ROW);

function getConfig() {
    var data = [];
    for (var i = 0, len = items.length; i < len; i++) {
        data.push(+items[i].dataset.value);
    }
    return data;
}

function configRender() {
    var data = getConfig(),
        // 得到空白六角canvas场
        bigData = getRandomArr(CANVAS_BOX_COL, 0),
        j = 0,
        offx = (CANVAS_BOX_COL - CONFIG_BOX_ROW) / 2,
        confData,
        offAll = offx + (offx - 1) * CANVAS_BOX_COL;
    if (offAll < 0) offAll = 0;
    for (var i = 0, len = data.length; i < len; i++) {
        if (i % CONFIG_BOX_ROW === 0 && i !== 0) j++;
        confData = i + offAll + j * (CANVAS_BOX_COL - CONFIG_BOX_ROW);
        bigData[confData][0] = +data[i];
    }
    stepCal(bigData);
}

//随机生成图案事件
randomRender.onclick = function() {
    stepCal(getRandomArr(CANVAS_BOX_COL, value.value / 100));
};

//autocell 1.0
var tab = document.getElementById('canvas');
var tax = canvas.getContext('2d');
tab.width = CANVAS_BOX_WIDTH;
tab.height = CANVAS_BOX_WIDTH;
var width = tab.width,
    height = tab.height;

function polygon(canvacPoly) {
    var canvasObj = canvacPoly.canvasObj,
        x = canvacPoly.x,
        y = canvacPoly.y,
        n = canvacPoly.n,
        r = canvacPoly.r, //多边形外接圆半径
        fillColor = canvacPoly.fColor,
        strokeColor = canvacPoly.sColor,
        angle = Math.PI * 2 / n;
    canvasObj.save();
    canvasObj.fillStyle = fillColor;
    canvasObj.strokeStyle = strokeColor;
    canvasObj.translate(x, y);
    canvasObj.moveTo(0, -r);
    canvasObj.beginPath();
    for (var i = 0; i < n; i++) {
        canvasObj.rotate(angle);
        canvasObj.lineTo(0, -r);
    }
    canvasObj.closePath();
    canvasObj.stroke();
    canvasObj.fill();
    canvasObj.restore();
}

function getRandomArr(rol, percent) {
    var arr = [];
    for (var i = 0, len = rol * (rol + 10); i < len; i++) {
        arr.push([Math.random() < percent ? 1 : 0, 0]);
    }
    return arr;
}

var COLOR = [
    '#edf2f7',
    '#7aa0c7',
    '#4682b4',
    '#003c84',
    '#000e60',
    '#00004b',
    '#00003c',
];
function render(data) {
    var itemWidth = CANVAS_BOX_WIDTH / CANVAS_BOX_COL,
        itemValue,
        color,
        flag = true;
    tax.clearRect(0, 0, width, height);
    for (var i = 0, len = data.length, j = 0; i < len; i++) {
        if (i % CANVAS_BOX_COL === 0 && i !== 0) {
            j++;
            flag = !flag;
        }
        itemValue = data[i][0];
        color = COLOR[itemValue];

        var tx =
                (i % CANVAS_BOX_COL) * itemWidth +
                (flag ? itemWidth / 2 : itemWidth),
            ty = j * itemWidth * 7 / 8;
        // ty = j * itemWidth * 7 / 8 + itemWidth / 2;
        polygon({
            canvasObj: tax,
            x: tx,
            y: ty,
            n: 4,
            r: itemWidth / 2,
            fColor: color,
            sColor: color,
        });
    }
}

//每个时间间隔需要进行一次对矩阵的计算
var timer;

function stepCal(data, time) {
    // console.log(data);
    clearInterval(timer);
    timer = setInterval(function() {
        for (var i = 0, len = data.length; i < len; i++) {
            rule_30(data, i);
        }
        // 转录更新cell状态
        for (i = 0; i < len; i++) {
            data[i][0] = data[i][1];
        }
        // console.log(data);
        render(data);
    }, 500);
}
