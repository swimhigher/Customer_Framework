//***********芯片读卡器相关操作//***********
var RFIDHelper = function () {
    var start = false;
    var fn = $.noop;
    var writecard;
    var _start = function (callback) {
        if (!start) {
            try {
                isopen = 0;// x.GAautoOpenComPort();
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
        start = false;
        writecard = window.clearInterval(writecard);
        return true;
    }
    var _write = function () {
        window.clearInterval(writecard);
        $.ajax({
            type: 'get',
            url: 'http://127.0.0.1:8733/CardShipService/CardShipNumber?jsoncallback=?',
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data.Code == "1") {
                    fn(data.Content);
                }
                if (start) {
                    writecard = window.setInterval(_write, 1000);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.alert('读取芯片服务失败');
                if (start) {
                    writecard = window.setInterval(_write, 1000);
                }
            }
        });
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