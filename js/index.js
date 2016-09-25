window.onload = function() {
    var CANVAS_BOX_COL = 256,
        CANVAS_BOX_WIDTH = 512,
        CONFIG_BOX_ROW = 32,
        CANVAS_WIDTH = 256,
        CANVAS_HEIGHT = 256;

    var configBox = document.getElementById('config'),
        items = configBox.children,
        boxWidth = configBox.offsetWidth,
        boxHeight = configBox.offsetHeight,
        randomRender = document.getElementById('randomRender'),
        configRender = document.getElementById('configRender'),
        value = document.getElementById('count');

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

        for (var j = 0, len = items.length; j < len; j++) {
            items[j].onclick = function() {
                if (this.dataset.value === '0') {
                    this.className = 'it alive';
                    this.dataset.value = '1';
                } else {
                    this.className = 'it';
                    this.dataset.value = '0';
                }
            };
        }
        console.log(count);
    }
    //初始化配置机
    configInit(boxWidth, boxHeight, CONFIG_BOX_ROW);


    function getConfig() {
        var data = [];
        for (var i = 0, len = items.length; i < len; i++) {
            data.push(items[i].dataset.value);
        }
        return data;
    }

    //配置图案事件
    configRender.onclick = function() {
        var data = getConfig(),
            bigData = getRandomArr(CANVAS_BOX_COL, 0),
            j = 0,
            offx = (CANVAS_BOX_COL - CONFIG_BOX_ROW) / 2,
            confData ;
        console.log(offx);
        console.log(data.length);
        for (var i = 0, len = data.length; i < len; i++) {
            if (i % CONFIG_BOX_ROW === 0 && i !== 0) {
                confData =confData+ i % CONFIG_BOX_ROW + offx+(offx-1)*CANVAS_BOX_COL + CANVAS_BOX_COL-CONFIG_BOX_ROW;
            }else{
                confData =confData+ i % CONFIG_BOX_ROW + offx+(offx-1)*CANVAS_BOX_COL
            }
            // bigData[i % CONFIG_BOX_ROW + offx][j + offx][0] = +data[i];
            // bigData[i % CONFIG_BOX_ROW + offx + j * CANVAS_BOX_COL] = +data[i];
            // if(i % CONFIG_BOX_ROW === 0 && i !== 0){
            //     bigData[ i % CONFIG_BOX_ROW ] = +data[i];
            // }
            bigData[confData];
        }
        console.log(j);
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


    function getRandomArr(rol, percent) {
        var arr = [];
        for (var i = 0, len = rol * rol; i < len; i++) {
            arr.push([(Math.random() < percent ? 1 : 0), 0]);
        }
        return arr;
    }


    function render(data) {
        var itemWidth = CANVAS_BOX_WIDTH / CANVAS_BOX_COL,
            itemValue;
        tax.clearRect(0, 0, width, height);
        for (var i = 0, len = data.length, j = 0; i < len; i++) {
            if (i % CANVAS_BOX_COL === 0 && i !== 0) j++;
            itemValue = data[i][0];
            if (itemValue === 0) {
                tax.fillStyle = '#fefdfe';
            } else if (itemValue === 1) {
                tax.fillStyle = '#edf';
            } else if (itemValue === 2) {
                tax.fillStyle = '#ff0505';
            } else if (itemValue === 3) {
                tax.fillStyle = '#750714';
            } else if (itemValue === 4) {
                tax.fillStyle = '#3c46ff';
            }
            tax.fillRect(i % CANVAS_BOX_COL * itemWidth, j * itemWidth, itemWidth, itemWidth);
        }
    }


    //每个时间间隔需要进行一次对矩阵的计算
    var timer;

    function stepCal(data, time) {
        // console.log(data);
        clearInterval(timer);
        timer = setInterval(function() {
            for (var i = 0, len = data.length; i < len; i++) {
                rule(data, i);
            }
            for (i = 0; i < len; i++) {
                data[i][0] = data[i][1];
            }
            // console.log(data);
            render(data);
        }, 500);
    }


    //规则函数
    function rule(data, i) {
        var count = aroundAlive(data, i),
            itemValue = data[i][0];
        if ((count === 3 || count === 2) && (itemValue !== 0)) {
            data[i][1] = count === 3 ? 3 : 2;
        } else if (count === 3 && itemValue === 0) {
            data[i][1] = 4;
        } else if ((count > 3 && count < 2) && itemValue !== 0) {
            data[i][1] = 0;
        } else {
            data[i][1] = 0;
        }
    }
    //周围生死计数
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
