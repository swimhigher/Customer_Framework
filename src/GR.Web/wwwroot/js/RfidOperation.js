//***********芯片读卡器相关操作//***********
var RFIDHelper = function () {
    var start = false;
    var fn = $.noop;
    var writecard;
    var _start = function (callback) {
        if (!start) {
            try {
                isopen = x.GAautoOpenComPort();
            } catch (e) {
                banana.controls.alert('请使用IE浏览器');
                return false;
            }
            if (isopen == 0) {
                start = true;
                fn = callback;
                writecard = window.setInterval(_write, 1000);
                return true;
            }
            else {
                window.clearInterval(writecard);
                banana.controls.alert("读卡器验证失败，确认读卡器状态！");
                return false;
            }
        }
        else {
            start = false;
            writecard = window.clearInterval(writecard);
            return true;
        }
    }
    var _close = function () {
        if (start) {
            start = false;
            writecard = window.clearInterval(writecard);
            return true;
        }
        return true;
    }
    var _write = function () {
        // var isopen = x.GAautoOpenComPort();
        var id = x.GAInventory();
        if (id.indexOf("Success") >= 0) {
            id = getPhysicalNum(id);
            //document.getElementById('txtp').value = id;
            //$('#historyPanel').append('<li>' + id + '</li>');
            //if (needExcel == true) {
            //    pool.push(id);
            //    save();
            //}
            fn(id);
        }
    }
    var getPhysicalNum = function (id) {
        id = id.substring(9);
        /*读取DSFIDAndUID，读出来的低位在前，如读到00B26ABD47500104E0，其dsfid为00，uid为E004015047BD6AB2*/
        var re = /[A-Za-z0-9]{2}/g;
        var arr = [];
        var list = [];
        while ((arr = re.exec(id)) != null) {
            list.push(arr[0]);
        }
        var result = "";
        for (var i = list.length - 1; i >= 0; i--) {
            result += list[i];
        }
        return result;
    }

    return {
        start: _start,
        close: _close
    }
};