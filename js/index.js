window.onload = function() {
    var config = {
        "name": "autocell",
        "version": "1.5.0",
        "author": "ped <pedclubsite@gmail.com>",
        "license": "WTFPL",
        "canvasWidth": "512",
        "canvasBoxCol": "64",
        "configBoxRow": "32",
        "configImg": {},
    };
    CANVAS_BOX_COL = +config.canvasBoxCol;
    CANVAS_BOX_WIDTH = +config.canvasWidth;
    CONFIG_BOX_ROW = +config.configBoxRow;
    IMG_ARRAY = config.configImg;
    var configBox = document.getElementById('config'),
        items = configBox.children,
        boxWidth = configBox.offsetWidth,
        boxHeight = configBox.offsetHeight,
        randomRender = document.getElementById('randomRender'),
        configRender = document.getElementById('configRender'),
        value = document.getElementById('count'),
        imgArr = document.getElementById('imgArr');

    function configInit(width, height, num) {
        var _str = '',
            count = num * num;
        width = Math.floor(width / num);
        height = Math.floor(height / num);
        items.row = num;
        for (var i = 0; i < count; i++) {
            _str += "<div class='it'  data-value= '0' style= " + "width:" + width + "px;height:" + height + "px;" + "></div>";
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
    configInit(boxWidth, boxHeight, CONFIG_BOX_ROW);


    function getConfig() {
        var data = [];
        for (var i = 0, len = items.length; i < len; i++) {
            data.push(+items[i].dataset.value);
        }
        return data;
    }

    //配置图案事件
    configRender.onclick = function() {
        var data = getConfig(),
            // 得到空白六角canvas场
            bigData = getRandomArr(CANVAS_BOX_COL, 0),
            j = 0,
            offx = (CANVAS_BOX_COL - CONFIG_BOX_ROW) / 2,
            confData,
            offAll = offx + (offx - 1) * CANVAS_BOX_COL;
        if (offAll < 0) offAll = 0;
        console.log(data.length);
        for (var i = 0, len = data.length; i < len; i++) {
            if (i % CONFIG_BOX_ROW === 0 && i !== 0) j++;
            confData = i + offAll + j * (CANVAS_BOX_COL - CONFIG_BOX_ROW);
            bigData[confData][0] = +data[i];

        }
        stepCal(bigData);
    };

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
        // canvasObj.stroke();
        canvasObj.fill();
        canvasObj.restore();
    }

    function getRandomArr(rol, percent) {
        var arr = [];
        for (var i = 0, len = rol * (rol + 10); i < len; i++) {
            arr.push([(Math.random() < percent ? 1 : 0), 0]);
        }
        return arr;
    }

    var COLOR = ['#edf2f7','#7aa0c7','#4682b4','#003c84','#000e60','#00004b','#00003c']
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
            
            var tx = i % CANVAS_BOX_COL * itemWidth + (flag ? itemWidth / 2 : itemWidth),
                ty = j * itemWidth * 7 / 8 + itemWidth / 2;
            polygon({
                canvasObj: tax,
                x: tx,
                y: ty,
                n: 6,
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
                rule_36(data, i);
            }
            // 转录更新cell状态
            for (i = 0; i < len; i++) {
                data[i][0] = data[i][1];
            }
            // console.log(data);
            render(data);
        }, 500);
    }


    // 规则函数
    function rule_30(data, i) {
        var count = aroundAlive(data, i),
            itemValue = data[i][0];
        if ((count === 3 || count === 2) && (itemValue !== 0)) {
            data[i][1] = count === 3 ? 3 : 2;
        } else if (count === 3 && itemValue === 0) {
            data[i][1] = 4;
        } else if (count > 3 && count < 2) {
            data[i][1] = 0;
        } else {
            data[i][1] = 0;
        }
    }

    // cell本身共有6种状态 ，用颜色表示
    // 当本身为 alive (1) 时， 周围有cell 2 3 6个时保持 1，否则变为 2
    // 当本身为 alive (2) 时，2->3  3->4 4->5 5->6 6->0
    // 本身为 dead (0) 时 ,周围有 3 4 5个cell时就变为 1，
    function rule_36(data, i) {
        // 判断奇偶行
        var odd = Math.ceil(i / CANVAS_BOX_COL) % 2 === 0 ? true : false,
            count = aroundSixAlive(data, i, odd),
            itemValue = data[i][0];
        // console.log(odd);
        if (itemValue === 0) { // 此时若在空旷位置，且周围cell数量和状态达标那么就增殖出一个cell(1)
            if (count === 3) {
                data[i][1] = 1;
            }
        } else if (itemValue === 1) {
            if (count === 4) { // 此时激发cell进入成长期
                data[i][1] = 2;
            } else if (count <= 1 || count > 5) {
                data[i][1] = 0;
            } else { // 此时进入孢子休眠期
                data[i][1] = 1;
            }
        } else if (itemValue === 6) { // 此时成长到死亡期 cell死亡
            data[i][1] = 0;
        } else {
            data[i][1] = itemValue + 1; //成长状态更新
        }

    }

    // snake control
    // (方向， 初始长度， 初始位置， )
    function snake(data, face, long, x, y) {

    }


    // 给整个文档添加事件
    // 当前行进方向上只有左右能操作，后退以及前进无响应
    document.body.onkeyup = function(event) {
        var keyValue = event.keyCode;
        if (keyValue === 37) { // 左
            snake();
        } else if (keyValue === 38) { // 上
            snake();
        } else if (keyValue === 39) { // 右
            snake();
        } else if (keyValue === 40) { // 下
            snake();
        }
    };









    // 周围生死计数
    function aroundSixAlive(data, i, odd) {
        var _arr = [],
            count = 0;
        if ((i + 1) % CANVAS_BOX_COL !== 0 && odd) {
            if (i % CANVAS_BOX_COL !== 0) _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //如果是奇数只用判定正左
            _arr.push(data[i + 1 - CANVAS_BOX_COL] ? data[i + 1 - CANVAS_BOX_COL][0] : 0); //右上
            _arr.push(data[i + 1] ? data[i + 1][0] : 0); //右
            _arr.push(data[i + 1 + CANVAS_BOX_COL] ? data[i + 1 + CANVAS_BOX_COL][0] : 0); //右下
        }
        _arr.push(data[i - CANVAS_BOX_COL] ? data[i - CANVAS_BOX_COL][0] : 0); //上
        _arr.push(data[i + CANVAS_BOX_COL] ? data[i + CANVAS_BOX_COL][0] : 0); //下
        if (i % CANVAS_BOX_COL !== 0 && !odd) {
            if ((i + 1) % CANVAS_BOX_COL !== 0) _arr.push(data[i + 1] ? data[i + 1][0] : 0); //如果偶数排只用判定正右
            _arr.push(data[i - 1 - CANVAS_BOX_COL] ? data[i - 1 - CANVAS_BOX_COL][0] : 0); //左上
            _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //左
            _arr.push(data[i - 1 + CANVAS_BOX_COL] ? data[i - 1 + CANVAS_BOX_COL][0] : 0); //左下
        }
        for (var j = 0, len = _arr.length; j < len; j++) {
            if (_arr[j] !== 0) {
                count++;
            }
        }
        return count;
    }

    function aroundAlive(data, i) {
        var _arr = [],
            count = 0;
        if ((i + 1) % CANVAS_BOX_COL !== 0) {
            _arr.push(data[i + 1 - CANVAS_BOX_COL] ? data[i + 1 - CANVAS_BOX_COL][0] : 0); //右上
            _arr.push(data[i + 1] ? data[i + 1][0] : 0); //右
            _arr.push(data[i + 1 + CANVAS_BOX_COL] ? data[i + 1 + CANVAS_BOX_COL][0] : 0); //右下
        }
        _arr.push(data[i - CANVAS_BOX_COL] ? data[i - CANVAS_BOX_COL][0] : 0); //上
        _arr.push(data[i + CANVAS_BOX_COL] ? data[i + CANVAS_BOX_COL][0] : 0); //下
        if (i % CANVAS_BOX_COL !== 0) {
            _arr.push(data[i - 1 - CANVAS_BOX_COL] ? data[i - 1 - CANVAS_BOX_COL][0] : 0); //左上
            _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //左
            _arr.push(data[i - 1 + CANVAS_BOX_COL] ? data[i - 1 + CANVAS_BOX_COL][0] : 0); //左下
        }
        for (var j = 0, len = _arr.length; j < len; j++) {
            if (_arr[j] !== 0) {
                count++;
            }
        }
        return count;
    }
};
