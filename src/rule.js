import config from './config';
const canvasBoxCol = +config.canvasBoxCol;
function aroundSixAlive(data, i, odd) {
    var _arr = [],
        count = 0;
    if ((i + 1) % CANVAS_BOX_COL !== 0 && odd) {
        if (i % CANVAS_BOX_COL !== 0)
            _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //如果是奇数只用判定正左
        _arr.push(
            data[i + 1 - CANVAS_BOX_COL] ? data[i + 1 - CANVAS_BOX_COL][0] : 0
        ); //右上
        _arr.push(data[i + 1] ? data[i + 1][0] : 0); //右
        _arr.push(
            data[i + 1 + CANVAS_BOX_COL] ? data[i + 1 + CANVAS_BOX_COL][0] : 0
        ); //右下
    }
    _arr.push(data[i - CANVAS_BOX_COL] ? data[i - CANVAS_BOX_COL][0] : 0); //上
    _arr.push(data[i + CANVAS_BOX_COL] ? data[i + CANVAS_BOX_COL][0] : 0); //下
    if (i % CANVAS_BOX_COL !== 0 && !odd) {
        if ((i + 1) % CANVAS_BOX_COL !== 0)
            _arr.push(data[i + 1] ? data[i + 1][0] : 0); //如果偶数排只用判定正右
        _arr.push(
            data[i - 1 - CANVAS_BOX_COL] ? data[i - 1 - CANVAS_BOX_COL][0] : 0
        ); //左上
        _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //左
        _arr.push(
            data[i - 1 + CANVAS_BOX_COL] ? data[i - 1 + CANVAS_BOX_COL][0] : 0
        ); //左下
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
    if ((i + 1) % canvasBoxCol !== 0) {
        _arr.push(
            data[i + 1 - canvasBoxCol] ? data[i + 1 - canvasBoxCol][0] : 0
        ); //右上
        _arr.push(data[i + 1] ? data[i + 1][0] : 0); //右
        _arr.push(
            data[i + 1 + canvasBoxCol] ? data[i + 1 + canvasBoxCol][0] : 0
        ); //右下
    }
    _arr.push(data[i - canvasBoxCol] ? data[i - canvasBoxCol][0] : 0); //上
    _arr.push(data[i + canvasBoxCol] ? data[i + canvasBoxCol][0] : 0); //下
    if (i % canvasBoxCol !== 0) {
        _arr.push(
            data[i - 1 - canvasBoxCol] ? data[i - 1 - canvasBoxCol][0] : 0
        ); //左上
        _arr.push(data[i - 1][0] ? data[i - 1][0] : 0); //左
        _arr.push(
            data[i - 1 + canvasBoxCol] ? data[i - 1 + canvasBoxCol][0] : 0
        ); //左下
    }
    for (var j = 0, len = _arr.length; j < len; j++) {
        if (_arr[j] !== 0) {
            count++;
        }
    }
    return count;
}

export function rule_30(data, i) {
    var count = aroundAlive(data, i),
        itemValue = data[i][0];
    if ((count === 3 || count === 2) && itemValue !== 0) {
        data[i][1] = count === 3 ? 3 : 2;
    } else if (count === 3 && itemValue === 0) {
        data[i][1] = 4;
    } else if (count > 3 && count < 2) {
        data[i][1] = 0;
    } else {
        data[i][1] = 0;
    }
}
export function rule_36(data, i) {
    // 判断奇偶行
    var odd = Math.ceil(i / canvasBoxCol) % 2 === 0 ? true : false,
        count = aroundSixAlive(data, i, odd),
        itemValue = data[i][0];
    // console.log(odd);
    if (itemValue === 0) {
        // 此时若在空旷位置，且周围cell数量和状态达标那么就增殖出一个cell(1)
        if (count === 3) {
            data[i][1] = 1;
        }
    } else if (itemValue === 1) {
        if (count === 4) {
            // 此时激发cell进入成长期
            data[i][1] = 2;
        } else if (count <= 1 || count > 5) {
            data[i][1] = 0;
        } else {
            // 此时进入孢子休眠期
            data[i][1] = 1;
        }
    } else if (itemValue === 6) {
        // 此时成长到死亡期 cell死亡
        data[i][1] = 0;
    } else {
        data[i][1] = itemValue + 1; //成长状态更新
    }
}
