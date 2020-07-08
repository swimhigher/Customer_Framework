//$('#form_search').find('input').keydown(function (e) {
//    if (e.keyCode == 13) {
//        $('*[banana-cmd="search"]').trigger('click');
//        e.preventDefault();
//    }
//});

var common = window.common || {};

common.scaning = function (options) {
    var defaults = {
        success: function (value, focus) {
            alert(value);
            focus();
        }
    };
    var opt = $.extend({}, defaults, options);
    layer.open({
        type: 1
        , id: 'banana_dialog_scaning'
        , title: false
        , closeBtn: false
        , skin: 'layui-layer-molv'
        , anim: 2
        , area: ['300px']
        , offset: 'rb' //具体配置参考：offset参数项
        , content: '<div style="padding: 30px;color:#fff; background-color: #393D49; text-align:center;"><img src="/assets/images/loading.gif" style="width:80px;" /><p>请扫码...</p></div><input type="hidden" />'
        , btn: '取消'
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        //, shadeClose: true
        , yes: function () {
            $('body').off('keydown');
            layer.closeAll();
        }
        , success: function (layero, index) {
            //layer.msg('点击任意处可取消扫码');

            var onFocus = function () {
                $('body>input:hidden:last').focus();
            };
            onFocus();

            var chars = [], timer = 0;
            $('body').on('keydown', function (e) {
                if (chars.length == 0) {
                    timer = setTimeout(function () {
                        chars.length = 0;
                        timer = 0;
                    }, 150);
                }
                var code = e.keyCode;
                if (code == 13 && chars.length > 4) {
                    banana.helper.invokeFunction(opt.success, chars.join(''), onFocus);
                    chars.length = 0;
                    if (timer > 0) {
                        clearTimeout(timer);
                        timer = 0;
                    }
                }
                else {
                    if ((code > 47 && code < 58) || (code > 95 && code < 106) || ([109, 189].indexOf(code) > -1)) {
                        chars.push(e.key);
                    }
                }
            });
        }
    });
};

common.upload = function (options) {
    var opt = $.extend({}, {
        success: function (file, data) { }
        , complete: function (file) { }
        , error: function (file) { }
        , progress: function (file, percentage) { }
        , queued: function (file) { }

        // swf文件路径
        , swf: '/assets/lib/webuploader/Uploader.swf'
        // 选完文件后，是否自动上传。
        , auto: true
        // 文件接收服务端。
        , server: '/fileServer/imageUpload'
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        , pick: '#picker'
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        , resize: false
        // 只允许选择图片文件。
        , accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    }, options);

    var uploader = WebUploader.create(opt);
    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function (file) {
        //$list.append('<div id="' + file.id + '" class="item">' +
        //    '<h4 class="info">' + file.name + '</h4>' +
        //    '<p class="state">等待上传...</p>' +
        //    '</div>');
        banana.helper.invokeFunction(opt.queued, file);
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        //var $li = $('#' + file.id),
        //    $percent = $li.find('.progress .progress-bar');

        //// 避免重复创建
        //if (!$percent.length) {
        //    $percent = $('<div class="progress progress-striped active">' +
        //        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
        //        '</div>' +
        //        '</div>').appendTo($li).find('.progress-bar');
        //}

        //$li.find('p.state').text('上传中');

        //$percent.css('width', percentage * 100 + '%');
        banana.helper.invokeFunction(opt.progress, file, percentage);
    });
    uploader.on('uploadSuccess', function (file, data) {
        //$('#' + file.id).find('p.state').text('已上传');
        banana.helper.invokeFunction(opt.success, file, data);
    });
    uploader.on('uploadError', function (file) {
        //$('#' + file.id).find('p.state').text('上传出错');
        banana.helper.invokeFunction(opt.error, file);
    });
    uploader.on('uploadComplete', function (file) {
        //$('#' + file.id).find('.progress').fadeOut();
        banana.helper.invokeFunction(opt.complete, file);
    });
};