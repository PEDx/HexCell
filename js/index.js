window.onload = function() {
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
    configInit(boxWidth, boxHeight, 32);


    function getConfig() {
        var data = [];
        for (var i = 0, len = items.length; i < len; i++) {
            data.push(items[i].dataset.value);
        }
        return data;
    }

    //配置图案事件
    var DATA1 = [];
    configRender.onclick = function() {
        var data = getConfig(),
            bigData = init(256, 256, 0.02),
            j = 0,
            offx = 112;
        console.log(data.length);
        for (var i = 0, len = data.length; i < len; i++) {
            if (i % 32 === 0 && i !== 0) j++;
            bigData[i % 32 + offx][j + offx][0] = +data[i];
        }
        DATA1 = data;
        stepCal(bigData);
    };

    //随机生成图案事件
    randomRender.onclick = function() {
        stepCal(init(256, 256, value.value / 100));
    };

    //autocell 1.0
    var tab = document.getElementById('canvas');
    var tax = canvas.getContext('2d');
    tab.width = 512;
    tab.height = 512;
    var width = tab.width,
        height = tab.height;

    function getRandomArr(number, percent) {
        var arr = [];
        for (var i = 0; i < number; i++) {
            arr.push([(Math.random() < percent ? 1 : 0), 0]);
        }
        return arr;
    }

    //初始化矩阵
    function init(col, row, percent) {
        var _col = [];
        for (var i = 0; i < col; i++) {
            _col[i] = getRandomArr(row, percent);
        }
        render(_col);
        return _col;
    }

    //根据数据矩阵渲染canvas
    function render(data) {
        var c = 0,
            itemValue;
        tax.clearRect(0, 0, width, height);
        for (var i = 0, len1 = data.length; i < len1; i++) {
            for (var j = 0, len2 = data[i].length; j < len2; j++) {
                itemValue = data[i][j][0];
                if (itemValue === 0) {
                    tax.fillStyle = '#fefdfe';
                } else if (itemValue === 1) {
                    tax.fillStyle = '#ebff6b';
                } else if (itemValue === 2) {
                    tax.fillStyle = '#ff0505';
                } else if (itemValue === 3) {
                    tax.fillStyle = '#750714';
                } else if (itemValue === 4) {
                    tax.fillStyle = '#3c46ff';
                }
                tax.fillRect(i * width / len1, j * height / len2, width / len1, height / len2);
            }
        }
        // tax.putImageData(imgdata, 0, 0);
    }


    //每个时间间隔需要进行一次对矩阵的计算
    var timer;

    function stepCal(data, time) {
        clearInterval(timer);
        timer = setInterval(function() {
            var i, j;
            for (i = 0, len1 = data.length; i < len1; i++) {
                for (j = 0, len2 = data[i].length; j < len2; j++) {
                    rule(data, i, j);
                }
            }
            for (i = 0, len1 = data.length; i < len1; i++) {
                for (j = 0, len2 = data[i].length; j < len2; j++) {
                    data[i][j][0] = data[i][j][1];
                }
            }
            // console.log("csz");
            render(data);
        }, 400);
    }

    //规则函数
    function rule(data, x, y) {
        var count = aroundAlive(data, x, y),
            itemValue = data[x][y][0];
        if ((count === 3 || count === 2) && (itemValue !== 0)) {
            data[x][y][1] = count === 3 ? 3 : 2;
        } else if (count === 3 && itemValue === 0) {
            data[x][y][1] = 4;
        } else if ((count > 3 && count < 2) && itemValue !== 0) {
            data[x][y][1] = 0;
        } else {
            data[x][y][1] = 0;
        }
    }
    //周围生死计数
    function aroundAlive(data, x, y) {
        var _arr = [],
            count = 0;
        if (data[x - 1] !== undefined) {
            _arr.push(data[x - 1][y - 1] !== undefined ? data[x - 1][y - 1][0] : 0);
            _arr.push(data[x - 1][y] !== undefined ? data[x - 1][y][0] : 0);
            _arr.push(data[x - 1][y + 1] !== undefined ? data[x - 1][y + 1][0] : 0);
        }
        _arr.push(data[x][y - 1] !== undefined ? data[x][y - 1][0] : 0);
        _arr.push(data[x][y + 1] !== undefined ? data[x][y + 1][0] : 0);
        if (data[x + 1] !== undefined) {
            _arr.push(data[x + 1][y - 1] !== undefined ? data[x + 1][y - 1][0] : 0);
            _arr.push(data[x + 1][y] !== undefined ? data[x + 1][y][0] : 0);
            _arr.push(data[x + 1][y + 1] !== undefined ? data[x + 1][y + 1][0] : 0);
        }
        for (var i = 0; i < _arr.length; i++) {
            if (_arr[i] !== 0) {
                count++;
            }
        }
        return count;
    }
};
