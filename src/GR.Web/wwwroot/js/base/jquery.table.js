(function ($) {
    $.fn.extend({
        table: function (option) {
            var $this = this;
            if ($this.length == 0) {
                $this = $('#table_container');
            }
            if ($this.length == 0) {
                alert('选择器未获取到jQuery对象，无法渲染DataTable');
                return;
            }
            if ($this.length > 1) {
                alert('选择器得到了多个jQuery对象，无法渲染DataTable');
                return;
            }

            var selector = $this.selector;

            var returnValue;
            $this.each(function (index, item) {
                var $item = $(item);
                var elem = selector; //'#' + $item.attr('id');

                var _id = banana.helper.createID();
                var defaults = {
                    elem: elem
                    , id: 'table_' + _id
                    , lay_filter: 'table_filter_' + _id
                    , extraHeight: function () {
                        return ($('.layui-elem-quote').height() + 60);
                    }
                    , cellMinWidth: 100 //全局定义常规单元格的最小宽度
                    , url: '' //数据接口
                    , method: 'post'
                    , response: {
                        statusName: 'code'
                        , statusCode: 0
                        , msgName: 'message'
                        , dataName: 'data'
                        , countName: 'count'
                    }
                    , cols: []
                    , page: {
                        //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                        layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'] //自定义分页布局
                        //,curr: 5 //设定初始在第 5 页
                        , groups: 10 //只显示 1 个连续页码
                        , first: '首页' //不显示首页
                        , last: '末页' //不显示尾页
                        , limit: 20
                    }
                    //, initSort: {
                    //    //field: 'name' //排序字段，对应 cols 设定的各字段名
                    //    //, type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    //}
                    //, where: { //配合initSort使用
                    //    //sort: 'name'
                    //    //, order: 'desc'
                    //}
                    , done: function (res, curr, count) {
                        //如果是异步请求数据方式，res即为你接口返回的信息。
                        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                        //console.log(res);

                        //得到当前页码
                        //console.log(curr);

                        //得到数据总量
                        //console.log(count);
                    }
                    , on: function (e) {
                        banana.helper.log('事件触发', e);
                        var obj = e.args;
                        switch (e.cmd) {
                            case 'checkbox':
                                //console.log(obj);
                                //e.target.reload({
                                //    height: 'full-' + getExtraHeight()
                                //});
                                break;
                            case 'tool':
                                //var data = obj.data;
                                //if (obj.event === 'detail') {
                                //    layer.msg('ID：' + data.id + ' 的查看操作');
                                //} else if (obj.event === 'del') {
                                //    layer.confirm('真的删除行么', function (index) {
                                //        obj.del();
                                //        layer.close(index);
                                //    });
                                //} else if (obj.event === 'edit') {
                                //    layer.alert('编辑行：<br>' + JSON.stringify(data))
                                //}
                                break;
                            case 'sort':
                                //console.log(obj.field); //当前排序的字段名
                                //console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
                                //console.log(this); //当前排序的 th 对象

                                //尽管我们的 table 自带排序功能，但并没有请求服务端。
                                //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
                                //table.reload(e.id, {
                                //    initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
                                //    , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                                //        sort: obj.field //排序字段
                                //        , order: obj.type //排序方式
                                //    }
                                //});
                                break;
                            case 'edit':
                                //var value = obj.value //得到修改后的值
                                //    , data = obj.data //得到所在行所有键值
                                //    , field = obj.field; //得到字段
                                //layer.msg('[ID: ' + data.id + '] ' + field + ' 字段更改为：' + value);
                                break;
                            default:
                                banana.helper.log('未实现的监听事件', e);
                                break;
                        }
                    }
                    , complete: function (e) {
                        //表格渲染完成时回调，可在此处绑定自定义的jquery事件，如：搜索、批量删除等
                        banana.helper.log('表格渲染完成时回调', e);
                    }
                };
                var opt = $.extend({}, defaults, option);
                $(opt.elem).attr('lay-filter', opt.lay_filter);
                layui.use(['table'], function () {
                    var table = layui.table;
                    var form = layui.form;
                    var tableIns = table.render({
                        elem: opt.elem
                        , id: opt.id
                        , height: 'full-' + opt.extraHeight()
                        , cellMinWidth: opt.cellMinWidth
                        , url: opt.url
                        , method: opt.method
                        , response: opt.response
                        , page: opt.page
                        , cols: opt.cols
                        , initSort: opt.initSort
                        , where: opt.where
                        , done: opt.done
                    });

                    //刷新列表，可提供自定义刷新函数
                    var table_refresh = function (fn) {
                        if ($.isFunction(fn)) {
                            banana.helper.invokeFunction(fn);
                        } else if (banana.helper.getType(fn) === 'object') {
                            var opt = $.extend(true, {}, {
                                where: $('form:first').serializeObject()
                            }, fn);
                            var initSort = fn['initSort']; //根据指定当前的排序规则，提取出来赋值到where

                            if (initSort == null) {
                                initSort = tableIns.config.initSort;
                            }

                            if (initSort && initSort['field'] && initSort['type']) {
                                opt.where['sort'] = initSort['field'];
                                opt.where['order'] = initSort['type'];
                            }

                            tableIns.reload(opt);
                        } else {
                            var opt = $.extend(true, {}, {
                                where: $('form:first').serializeObject()
                            });
                            var initSort = tableIns.config.initSort;

                            if (initSort && initSort['field'] && initSort['type']) {
                                opt.where['sort'] = initSort['field'];
                                opt.where['order'] = initSort['type'];
                            }

                            tableIns.reload(opt);
                        }
                    };

                    //监听表格复选框选择
                    table.on('checkbox(' + opt.lay_filter + ')', function (obj) {
                        //console.log(obj);
                        //tableIns.reload({
                        //    height: 'full-' + getExtraHeight()
                        //});
                        opt.on({
                            cmd: 'checkbox'
                            , args: obj
                            , table: table
                            , target: tableIns
                            , refresh: table_refresh
                        });
                    });
                    //监听工具条
                    table.on('tool(' + opt.lay_filter + ')', function (obj) {
                        //var data = obj.data;
                        //if (obj.event === 'detail') {
                        //    layer.msg('ID：' + data.id + ' 的查看操作');
                        //} else if (obj.event === 'del') {
                        //    layer.confirm('真的删除行么', function (index) {
                        //        obj.del();
                        //        layer.close(index);
                        //    });
                        //} else if (obj.event === 'edit') {
                        //    layer.alert('编辑行：<br>' + JSON.stringify(data))
                        //}
                        opt.on({
                            cmd: 'tool'
                            , args: obj
                            , table: table
                            , target: tableIns
                            , refresh: table_refresh
                        });
                    });
                    //排序
                    table.on('sort(' + opt.lay_filter + ')', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                        //console.log(obj.field); //当前排序的字段名
                        //console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
                        //console.log(this); //当前排序的 th 对象

                        //尽管我们的 table 自带排序功能，但并没有请求服务端。
                        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
                        //table.reload(opt.id, {
                        //    initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
                        //    , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                        //        sort: obj.field //排序字段
                        //        , order: obj.type //排序方式
                        //    }
                        //});

                        delete tableIns.config.initSort; // 移除默认排序，防止表格reload后排序图标错误

                        opt.on({
                            cmd: 'sort'
                            , args: obj
                            , table: table
                            , target: tableIns
                            , refresh: table_refresh
                        });
                    });
                    //监听单元格编辑
                    table.on('edit(' + opt.lay_filter + ')', function (obj) {
                        var value = obj.value //得到修改后的值
                            , data = obj.data //得到所在行所有键值
                            , field = obj.field; //得到字段
                        //layer.msg('[ID: ' + data.id + '] ' + field + ' 字段更改为：' + value);
                        opt.on({
                            cmd: 'edit'
                            , args: obj
                            , table: table
                            , target: tableIns
                            , refresh: table_refresh
                        });
                    });

                    //获取选中的数目
                    var _getCheckLength = function () {
                        return table.checkStatus(opt.id).data.length;
                    };
                    //获取选中的数据
                    var _getCheckData = function () {
                        return table.checkStatus(opt.id).data;
                    };
                    //获取选中的id集合，默认属性为：Id
                    var _getIds = function (pk) {
                        pk = pk || 'Id';
                        return banana.helper.getLinq().From(_getCheckData()).Select('x=>x.' + pk).ToArray();
                    };

                    opt.complete({
                        id: opt.id
                        , filter: opt.lay_filter
                        , table: table
                        , target: tableIns
                        , form: form
                        , refresh: table_refresh
                        , getCheckLength: _getCheckLength
                        , getCheckData: _getCheckData
                        , getIds: _getIds
                    });
                });
                returnValue = {
                    id: opt.id
                    , filter: opt.lay_filter
                    //, elem: opt.elem
                };
            });
            return returnValue;
        }
    });
})(jQuery);