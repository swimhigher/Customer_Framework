$(function () {
    var height = $('#tab-1').height();
    var width = $('#tab-1').width();

    $('#JApplyTj').height(height);
    $('#JApplyTj').width(width);

    $('#JcustomerApply').height(height);
    $('#JcustomerApply').width(width);

    //$('#JEquipLook').height(height);
    //$('#JEquipLook').width(width);

    //报名信息统计
    var JcustomerAudit = echarts.init(document.getElementById('JcustomerAudit'));
    //背核数
    var JhomeIndustry = echarts.init(document.getElementById('JhomeIndustry'));
    //每天进场人数统计
    var JcustomerApply = echarts.init(document.getElementById('JcustomerApply'));

    //申领人数统计
    var JApplyTj = echarts.init(document.getElementById('JApplyTj'));

    //页面尺寸变化 刷新页面
    $(window).resize(function () {
        //window.location.reload();
    });
    //报名信息统计
    loadJcustomerAudit();
    ajaxJcustomerAudit();
    //背核数
    loadJhomeIndustry();
    ajaxJhomeIndustry();
    //进场人数统计
    loadJcustomerApply();
    ajaxJcustomerApply();

    //申领人数统计
    loadJApplyTj();
    ajaxJApplyTj();
    //加载会场会议下拉数据
    loadSlt();
    //ip存放
    var ipObj = []

    setInterval(function () {
        if ($('.JenterManage').hasClass('animated')) {
            $('.JenterManage').removeClass('animated bounce');//bounceIn
        } else {
            $('.JenterManage').addClass('animated bounce');
        }
    }, 1500);

    //$.ajax({
    //    url: '/index/getCustomerReviewCount',
    //    type: 'get',
    //    dataType: 'json',
    //    success: function (data) {
    //        if (data.code === 200) {
    //            customerReviewCount(data.data)
    //        }
    //    }
    //});

    var dataStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)'
        }
    };
    var placeHolderStyle = {
        normal: {
            color: 'rgba(44,59,70,1)', // 未完成的圆环的颜色
            label: {
                show: false
            },
            labelLine: {
                show: false
            }
        },
        emphasis: {
            color: 'rgba(44,59,70,1)' // 未完成的圆环的颜色
        }
    };

    function loadJcustomerAudit() {
        var JcustomerAuditOption = {
            // color : ['#3dd4de','#b697cd','#a6f08f'],
            // backgroundColor: 'rgba(0,0,0,0.8)',
            series: [{
                type: 'pie',
                clockWise: false,
                radius: [45, 55],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['45%', '20%'],

                data: [{
                    value: 50,
                    label: {
                        normal: {
                            formatter: '主证0批次',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal',
                                color: '#AAF200'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#AAF200',
                            shadowColor: '#AAF200',
                            shadowBlur: 10
                        }
                    }
                }, {
                    value: 50,
                    // name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                // name: 'Pie2',
                type: 'pie',
                clockWise: false,
                radius: [45, 55],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['45%', '50%'],
                data: [{
                    value: 50,
                    label: {
                        normal: {
                            formatter: '副证0批次',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal',
                                color: '#ED9200'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ED9200',
                            shadowColor: '#ED9200',
                            shadowBlur: 10
                        }
                    }
                }, {
                    value: 50,
                    //name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                // name: 'Pie3',
                type: 'pie',
                clockWise: false,
                radius: [45, 55],
                itemStyle: dataStyle,
                hoverAnimation: false,
                center: ['45%', '80%'],
                data: [{
                    value: 50,
                    label: {
                        normal: {
                            //formatter: '{d}%',
                            formatter: '专场0批次',
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal',
                                color: '#EA3A00'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#EA3A00',
                            shadowColor: '#EA3A00',
                            shadowBlur: 10
                        }
                    }
                }, {
                    value: 50,
                    //name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }]
        };
        if (JcustomerAuditOption && typeof JcustomerAuditOption === "object") {
            JcustomerAudit.setOption(JcustomerAuditOption, true);
        }
    }
    function ajaxJcustomerAudit() {
        $.ajax({
            type: "post",
            url: "/TbSignupPerson/GetEnrollCount",
            data: {},
            dataType: "json",
            success: function (result) {
                var main = "主证";
                var second = "副证";
                var other = "专场";
                mainPercentSuccess = 0;
                mainPercentFail = 0;
                secondPercentSuccess = 0;
                secondPercentFail = 0;
                otherPercentSuccess = 0;
                otherPercentFail = 0;
                $.each(result.data, function (key, values) {
                    if (key == 0) {
                        main += values.value + "批次";
                        $("#mainSuccessCount").text(values.Count);
                        $("#mainFailCount").text(values.TotalCount);
                        mainPercentSuccess = values.PercentCount;
                        mainPercentFail = 100 - mainPercentSuccess;
                    } else if (key == 1) {
                        second += values.value + "批次";
                        $("#secondSuccessCount").text(values.Count);
                        $("#secondFailCount").text(values.TotalCount);
                        secondPercentSuccess = values.PercentCount;
                        secondPercentFail = 100 - secondPercentSuccess
                    }
                    else if (key == 2) {
                        other += values.value + "批次";
                        $("#otherSuccessCount").text(values.Count);
                        $("#otherFailCount").text(values.TotalCount);
                        otherPercentSuccess = values.PercentCount;
                        otherPercentFail = 100 - otherPercentSuccess
                    }
                });

                //柱形图赋值
                JcustomerAudit.setOption({ //加载数据图表
                    series: [{
                        type: 'pie',
                        clockWise: false,
                        radius: [45, 55],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['45%', '20%'],
                        data: [{
                            value: mainPercentSuccess,
                            label: {
                                normal: {
                                    formatter: main,
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'normal',
                                        color: '#AAF200'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#AAF200',
                                    shadowColor: '#AAF200',
                                    shadowBlur: 10
                                }
                            }
                        }, {
                            value: mainPercentFail,
                            //name: 'invisible',
                            itemStyle: placeHolderStyle
                        }]
                    }, {
                        // name: 'Pie2',
                        type: 'pie',
                        clockWise: false,
                        radius: [45, 55],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['45%', '50%'],
                        data: [{
                            value: secondPercentSuccess,
                            label: {
                                normal: {
                                    formatter: second,
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'normal',
                                        color: '#ED9200'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ED9200',
                                    shadowColor: '#ED9200',
                                    shadowBlur: 10
                                }
                            }
                        }, {
                            value: secondPercentFail,
                            // name: 'invisible',
                            itemStyle: placeHolderStyle
                        }]
                    }, {
                        // name: 'Pie3',
                        type: 'pie',
                        clockWise: false,
                        radius: [45, 55],
                        itemStyle: dataStyle,
                        hoverAnimation: false,
                        center: ['45%', '80%'],
                        data: [{
                            value: otherPercentSuccess,
                            label: {
                                normal: {
                                    //formatter: '{d}%',
                                    formatter: other,
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'normal',
                                        color: '#EA3A00'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#EA3A00',
                                    shadowColor: '#EA3A00',
                                    shadowBlur: 10
                                }
                            }
                        }, {
                            value: otherPercentFail,
                            // name: 'invisible',
                            itemStyle: placeHolderStyle
                        }]
                    }]
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }
    var JhomeIndustryOption;
    function loadJhomeIndustry() {
        JhomeIndustryOption = {
            legend: {
                data: ['背核中', '背核通过', '担保通过', '背核不通过'],
                itemWidth: 14,
                itemHeight: 14,
                borderWidth: 1.8,
                borderColor: '#3160C2',
                show: true,
                padding: [6, 8],
                shadowColor: '#2C68DC',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                textStyle: {
                    color: '#ADC0EE'
                },
                borderRadius: 3,
                bottom: '5%',
                right: '1%',
                orient: 'vertical'
            },
            series: [
                {
                    name: '背核统计',
                    type: 'pie',
                    radius: ['35%', '55%'],
                    color: ['#0194E1', '#22BECB', '#77D877', '#FFC637', '#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', '#d74e67', '#0092ff', '#eba954', '#21b6b9', '#60a900', '#01949b', ' #f17677'],
                    center: ['40%', '50%'],
                    label: {
                        normal: {
                            formatter: '{d}%\n{b}'
                            // formatter: '{d}%'
                        }
                    },
                    data: []
                }
            ]
        };
        if (JhomeIndustryOption && typeof JhomeIndustryOption === "object") {
            JhomeIndustry.setOption(JhomeIndustryOption, true);
        }
    }

    function ajaxJhomeIndustry() {
        $.ajax({
            type: "post",
            url: "/TbSignupPerson/GetBackCount",
            data: {},
            dataType: "json",
            success: function (result) {
                //柱形图赋值
                JhomeIndustry.setOption({ //加载数据图表
                    series: [
                        {
                            name: '背核统计',
                            type: 'pie',
                            radius: ['35%', '55%'],
                            color: ['#0194E1', '#22BECB', '#77D877', '#FFC637', '#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', '#d74e67', '#0092ff', '#eba954', '#21b6b9', '#60a900', '#01949b', ' #f17677'],
                            center: ['40%', '50%'],
                            label: {
                                normal: {
                                    formatter: '{d}%\n{b}{c}'
                                }
                            },
                            data: result.data
                        }
                    ]
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }
    //var app = {};
    //app.currentIndex = -1;

    //setInterval(function () {
    //    var dataLen = JhomeIndustryOption.series[0].data.length;
    //    // 取消之前高亮的图形
    //    JhomeIndustry.dispatchAction({
    //        type: 'downplay',
    //        seriesIndex: 0,
    //        dataIndex: app.currentIndex
    //    });
    //    app.currentIndex = (app.currentIndex + 1) % dataLen;
    //    // 高亮当前图形
    //    JhomeIndustry.dispatchAction({
    //        type: 'highlight',
    //        seriesIndex: 0,
    //        dataIndex: app.currentIndex
    //    });
    //    // 显示 tooltip
    //    JhomeIndustry.dispatchAction({
    //        type: 'showTip',
    //        seriesIndex: 0,
    //        dataIndex: app.currentIndex
    //    });
    //}, 1000);

    function loadJcustomerApply() {
        var JcustomerApplyOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                //data: ['2018-11-01', '2018-11-02', '2018-11-03', '2018-11-04', '2018-11-05', '2018-11-06', '2018-11-07'],
                data: [],
                itemHeight: 10,
                borderWidth: 1.8,
                borderColor: '#3160C2',
                show: true,
                padding: [10, 25, 10, 10],
                shadowColor: '#2C68DC',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                textStyle: {
                    color: '#ADC0EE'
                },
                borderRadius: 3,
                top: '2%',
                right: '4%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                //data: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
                data: [],
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: ['#0F53A3'],
                        width: 2
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontWeight: 'bold',
                    color: '#057FCE'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: ['#0F53A3'],
                        width: 2
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#0F53A3'],
                        type: 'dashed'
                    }
                },
                axisTick: {
                    length: 25,
                    lineStyle: {
                        color: ['#0E50AC'],
                        width: 2
                    }
                },
                axisLabel: {
                    margin: 35,
                    fontWeight: 'bold',
                    color: '#057FCE'
                }
            },
            color: ["#b43ed3", "#e94663", "#ca95663", "#73e2f6", "#0616a9", "#62d793"],
            //9FCA56 D49809 0194E1 A401E0 E10170 E17501
            series: [
                //{
                //    name: '2018-11-01',
                //    type: 'line',

                //    symbolSize: 1,
                //    data: ['2', '4', '7', '5', '10', '2', '2', '2', '2', '2', '2', '2', '2'],
                //    lineStyle: {
                //        width: 4,

                //    },
                //    hoverAnimation: true
                //},
                //{
                //    name: '2018-11-02',
                //    type: 'line',

                //    data: ['5', '4', '8', '2', '10', '2', '2', '3', '2', '2', '2', '2', '2',],
                //    symbolSize: 1,
                //    lineStyle: {
                //        width: 4,

                //    },
                //    hoverAnimation: true
                //}
            ]
        };
        if (JcustomerApplyOption && typeof JcustomerApplyOption === "object") {
            JcustomerApply.setOption(JcustomerApplyOption, true);
        }
    }

    function ajaxJcustomerApply() {
        $.ajax({
            type: "post",
            url: "/TbAttendance/GetAdmissionDuringMeetCount",
            data: { "AuthId": $("#AuthId").val(), IsMeet: $("#IsMeet").val() },
            dataType: "json",
            success: function (result) {
                var linNames = [];
                var linTitle = [];
                var seriesJson = JSON.stringify(result.data);
                $.each(result.data, function (key, values) {
                    if (linNames.length == 0) {
                        linNames = values.hour;
                    }
                    linTitle.push(values.name);
                });
                //柱形图赋值
                JcustomerApply.setOption({ //加载数据图表
                    legend: {
                        data: linTitle,
                        itemHeight: 10,
                        borderWidth: 1.8,
                        borderColor: '#3160C2',
                        show: true,
                        padding: [10, 25, 10, 10],
                        shadowColor: '#2C68DC',
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        textStyle: {
                            color: '#ADC0EE'
                        },
                        borderRadius: 3,
                        top: '2%',
                        right: '4%'
                    },
                    grid: {
                        top: '12%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: linNames,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: ['#0F53A3'],
                                width: 2
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            fontWeight: 'bold',
                            color: '#057FCE'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: ['#0F53A3'],
                                width: 2
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: ['#0F53A3'],
                                type: 'dashed'
                            }
                        },
                        axisTick: {
                            length: 25,
                            lineStyle: {
                                color: ['#0E50AC'],
                                width: 2
                            }
                        },
                        axisLabel: {
                            margin: 35,
                            fontWeight: 'bold',
                            color: '#057FCE'
                        }
                    },
                    color: ["#b43ed3", "#e94663", "#ca95663", "#73e2f6", "#0616a9", "#62d793"],
                    //9FCA56 D49809 0194E1 A401E0 E10170 E17501
                    //series: [
                    //    //{
                    //    //    name: '2018-11-01',
                    //    //    type: 'line',

                    //    //    symbolSize: 1,
                    //    //    data: ['2', '4', '7', '5', '10', '2', '2', '2', '2', '2', '2', '2', '2'],
                    //    //    lineStyle: {
                    //    //        width: 4,

                    //    //    },
                    //    //    hoverAnimation: true
                    //    //},
                    //    //{
                    //    //    name: '2018-11-02',
                    //    //    type: 'line',

                    //    //    data: ['5', '4', '8', '2', '10', '2', '2', '3', '2', '2', '2', '2', '2',],
                    //    //    symbolSize: 1,
                    //    //    lineStyle: {
                    //    //        width: 4,

                    //    //    },
                    //    //    hoverAnimation: true
                    //    //}
                    //]
                    series: result.data
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }

    function loadJApplyTj() {
    }

    function ajaxJApplyTj() {
        $.ajax({
            type: "post",
            url: "/Statistic/GetJApplyTjData",
            data: {},
            dataType: "json",
            success: function (result) {
                var linNames = ['2017', '2018'];
                var linTitle = [];
                var labelOption = {
                    normal: {
                        show: true,
                        position: 'bottom',
                        distance: '13',
                        align: 'center',
                        verticalAlign: 'bottom',
                        rotate: 0,
                        formatter: '{name|{a}}',
                        fontSize: 16,
                        rich: {
                            name: {
                                textBorderColor: '#fff'
                            }
                        }
                    }
                };
                var seriesValues = [{
                    name: '2017',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    data: [200, 332, 301]
                },
                {
                    name: '2018',
                    type: 'bar',
                    label: labelOption,
                    data: [result.data.reysls, result.data.czsls, result.data.bssls]
                }];

                //柱形图赋值
                JApplyTj.setOption({
                    color: ['#9fca56', '#d49809'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2017', '2018']
                        , textStyle: {
                            color: '#057FCE'
                        },
                        itemHeight: 10,
                        borderWidth: 1.8,
                        borderColor: '#3160C2',
                        show: true,
                        padding: [10, 25, 10, 10],
                        shadowColor: '#2C68DC',
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        textStyle: {
                            color: '#ADC0EE'
                        },
                        borderRadius: 3,
                        top: '2%',
                        right: '4%'
                    },
                    grid: {
                        top: '12%',
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    //toolbox: {
                    //    show: true,
                    //    orient: 'vertical',
                    //    left: 'right',
                    //    top: 'center',
                    //    feature: {
                    //        mark: { show: true },
                    //        dataView: { show: true, readOnly: false },
                    //        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    //        restore: { show: true },
                    //        saveAsImage: { show: true }
                    //    }
                    //},
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: ['人员申领数', '车证申领数', '标识申领数']
                            , axisLabel: {
                                color: '#057FCE'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                            , axisLabel: {
                                color: '#057FCE'
                            }
                            , splitLine: {
                                lineStyle: {
                                    color: ['#0F53A3'],
                                    type: 'dashed'
                                }
                            },
                        }
                    ],
                    series: seriesValues
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }

    //1.视频监控
    var context = {
        wv: null //webvideo实例对象
        , ip: null
    };
    //默认通道视频第一条选中
    loadVerifer();
    //loadTest();
    //2.signlr消息通知逻辑
    var chat = $.connection.gakm;
    chat.client.webEquipmentAttendace = function (ip, json) {
        //alert(ip);
        //if (context.ip != ip) return;
        banana.helper.invoke(msgProcess, json);
        //chat.server.clientEquipmentAttendace("192.168.1.64", JSON.stringify(jsontest));
        //赋值
        var obj = eval("(" + json + ")");
        var msg = "正常";
        var mainPhoto = "";
        var secondPhoto = "";
        if (obj != null) {
            //权限
            var isnext = true;
            var sencondShow = false;
            if (obj.authmodel.HasRight) {
                mainPhoto = obj.main.Photo;
                //设置左上角信息方法预留
                if (obj.authmodel.HasTimeLimit || obj.authmodel.HasPlaceRuleLimit) {
                    sencondShow = true;
                    isnext = false;
                    secondPhoto = "/assets/images/main/timelimitlarge.png";
                    msg = "时间限制";
                }
                if (isnext && !obj.authmodel.HasViceRight) {
                    sencondShow = true;
                    secondPhoto = "/assets/images/main/noviceright.png";
                    msg = "无副证权限";
                }
            } else {
                msg = "无权限";
                if (obj.authmodel.IsInvalid) {
                    msg = "无效卡";
                    isnext = false;
                    mainPhoto = "/assets/images/main/invalidlarge.png";
                }
                if (isnext && obj.authmodel.Unidentified) {
                    msg = "未识别证件";
                    mainPhoto = "/assets/images/main/Unidentifiedlarge.png";
                    isnext = false;
                }
                if (isnext) {
                    mainPhoto = obj.main.Photo;
                    //设置左上角信息方法预留
                    sencondShow = true;
                    secondPhoto = "/assets/images/main/limitlarge.png";
                }
            }
            ////权限
            //var isnext = true;
            //if (obj.authmodel.HasRight) {
            //    //设置左上角信息方法预留
            //    if (obj.authmodel.HasTimeLimit || obj.authmodel.HasPlaceRuleLimit) {
            //        isnext = false;
            //        msg = "时间限制";
            //    }
            //    if (isnext && !obj.authmodel.HasViceRight) {
            //        msg = "无副证权限";
            //    }
            //} else {
            //    msg = "无权限";
            //}
            Date.prototype.Format = function (fmt) { // author: meizz
                var o = {
                    "M+": this.getMonth() + 1, // 月份
                    "d+": this.getDate(), // 日
                    "h+": this.getHours(), // 小时
                    "m+": this.getMinutes(), // 分
                    "s+": this.getSeconds(), // 秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                    "S": this.getMilliseconds() // 毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
            var nowTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var html = "<tr >";

            html += (msg == "正常" ? "<td><font color='#74F271'>" + msg + "</font></td>" : "<td><font color='red'>" + msg + "</font></td>") + "<td>" + $("#verifier").find("option:selected").text() + "</td><td>" + nowTime + "</td>";
            html += "</tr>";
            $("tbody").prepend(html);
            //超过20就把第一个删掉
            if ($('tbody').find('tr').length > 20) {
                $("tbody>tr:last").remove();
            }
            //通道验证信息赋值
            $("#CardNumber").text(obj.main == null ? "" : (obj.main.CardNumber == null ? "" : obj.main.CardNumber));
            $("#DisplayName").text(obj.main == null ? "" : (obj.main.DisplayName == null ? "" : obj.main.DisplayName));
            $("#CompanyCh").text(obj.main == null ? "" : (obj.main.CompanyCh == null ? "" : obj.main.CompanyCh));
            $("#CardTypeName").text(obj.main == null ? "" : (obj.main.CardTypeName == null ? "" : obj.main.CardTypeName));
            $("#mainPhoto").attr("src", mainPhoto);
            if (sencondShow) {
                $("#errorphoto").show();
            } else {
                $("#errorphoto").hide();
            }
            $("#vicePhoto").attr("src", secondPhoto);

            $("#secondCardTypeName").text(obj.vice == null ? "" : (obj.vice.CardTypeName == null ? "" : obj.vice.CardTypeName));
        }
    };
    $.connection.hub.start().done(function () {
        //alert("链接成功");
        //loadTest();
    });
    //测试数据加载
    $('#test').click(function () {
        //function loadTest() {
        // 调用服务器端集线器的send方法
        var jsontest = {
            "main": {
                "Id": "2",
                "IdNum": null,
                "CardType": null,
                "CardNumber": "370982199607037643",
                "CardTypeName": "身份证",
                "PersonType": null,
                "DisplayName": "张三",
                "CompanyCh": "浙江省广安科贸有限公司",
                "CompanyEn": null,
                "Photo": "/files/pimg/123.jpg",
                "CardSortType": 0,
                "PhysicalNum": null,
                "FlowStatus": 0,
                "PickStatus": 0,
                "BackStatus": 0,
                "MakeStatus": 0,
                "CardStatus": 0
            },
            "vice": {
                "Id": null,
                "IdNum": null,
                "CardType": null,
                "CardTypeName": "军官证",
                "PersonType": null,
                "DisplayName": null,
                "CompanyCh": null,
                "CompanyEn": null,
                "Photo": null,
                "CardSortType": 0,
                "PhysicalNum": null,
                "FlowStatus": 0,
                "PickStatus": 0,
                "BackStatus": 0,
                "MakeStatus": 0,
                "CardStatus": 0
            },
            "authmodel": {
                "HasRight": true,
                "HasViceRight": false,
                "HasPlaceRuleLimit": false,
                "HasTimeLimit": false,
                "IsInvalid": false,
                "Unidentified": false
            },
            "direction": "10"
        };
        chat.server.clientEquipmentAttendace("192.168.1.68", JSON.stringify(jsontest));
        //赋值
        //}
    });

    //离线设备监控
    var toggelClassCus = function (ip, op) {
        $.ajax({
            type: "post",
            url: "/TbEquipment/GetByIp",
            data: { ip: ip },
            dataType: "json",
            success: function (result) {
                var device_config = result.data;
                if (op) {
                    var ele = $("[id='" + ip + "']");
                    ele.remove();
                } else {
                    var appendHtml = '';
                    appendHtml += '<li id="' + device_config.Ip + '" class="li-equiptment">';
                    appendHtml += ' <div class="div-equiptmentinfo">';
                    appendHtml += ' <div class="div-equiptmentinfo-ip">';
                    appendHtml += ' <span class="span1">Ip:</span><span class="span2">' + device_config.Ip + '</span>';
                    appendHtml += ' </div>';
                    appendHtml += '  <div class="div-equiptmentinfo-name">';
                    appendHtml += '   <span class="span1">名称:</span><span class="span2">' + device_config.Name + '</span>';

                    appendHtml += '  </div>';
                    appendHtml += ' <div class="div-equiptmentinfo-address">';
                    appendHtml += '     <span class="span1">所在地址:</span><span class="span2">' + device_config.Position + '</span>';

                    appendHtml += '   </div>';
                    appendHtml += '  <div class="div-equiptmentinfo-responsor">';
                    appendHtml += '     <span class="span1">负责人:</span><span class="span2">' + device_config.Responsor + '</span>';

                    appendHtml += '   </div>';
                    appendHtml += '   <div class="div-equiptmentinfo-phone">';
                    appendHtml += '       <span class="span1">联系方式:</span><span class="span2">' + device_config.Phone + '</span>';

                    appendHtml += '     </div>';
                    appendHtml += '    <div class="div-equiptmentinfo-phone">';
                    appendHtml += '       <span class="span1">校验方式:</span><span class="span2">' + device_config.ModelTypeName + '</span>';

                    appendHtml += '  </div>';
                    appendHtml += '   </div>';
                    appendHtml += '  </li>';
                    $("#JEquipLookItems").append(appendHtml);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }
    chat.client.loginEquipment = function (ip) {
        toggelClassCus(ip, true);
        banana.controls.msg(ip + ' 验证机上线');
    };
    chat.client.equipmentLeave = function (ip) {
        toggelClassCus(ip, false);
        banana.controls.msg(ip + ' 验证机断开连接，请确认', { icon: 0 });
    };
    $('#testLogin').click(function () {
        chat.server.equipmentLogin("192.168.11.146");
    });
    $('#testLeave').click(function () {
        chat.server.equipmentLeaveInClient("192.168.11.146");
    });
    function msgProcess(data) {
    }
    //视频下拉框
    $("#verifier").change(function () {
        loadVerifer();
    });
    function loadVerifer() {
        $.ajax({
            type: "post",
            url: "/TbEquipment/Get",
            data: { id: $("#verifier").val() },
            dataType: "json",
            success: function (result) {
                var device_config = result.data;

                if (ipObj.length > 0) {
                    //先清除
                    var ip = ipObj.pop();
                    //var ip = ipObj.pop() + '_80';
                    loginOut(ip);
                }
                context.ip = device_config.CameraIp;
                ipObj.push(device_config.CameraIp);

                context.wv = new WebVedio({
                    wshowtype: 1
                    //, ip: "192.168.1.65"
                    //, port: "80"
                    //, uid: "admin"
                    //, pwd: "gakm123456"
                    , ip: device_config.CameraIp
                    , port: "80"
                    , uid: device_config.CameraAccount
                    , pwd: device_config.CameraPwd
                    , onChannelLoaded: function (res) {
                        var devices = res['channel'];
                        if (devices.length > 0) {
                        }
                    }
                });
                context.wv.init('screen_container', function (state, args) {
                    if (state === true) {
                        context.wv.login(function () {
                            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
                                szDeviceIdentify = device_config.CameraIp,
                                iRtspPort = 554,
                                iChannelID = 1,
                                bZeroChannel = false,
                                iStreamType = 1;

                            var startRealPlay = function () {
                                WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                                    iRtspPort: iRtspPort,
                                    iStreamType: iStreamType,
                                    iChannelID: iChannelID,
                                    bZeroChannel: bZeroChannel,
                                    success: function () {
                                    },
                                    error: function (status, xmlDoc) {
                                        banana.controls.alert('预览失败');
                                    }
                                });
                            };

                            if (oWndInfo != null) {// 已经在播放了，先停止
                                WebVideoCtrl.I_Stop({
                                    success: function () {
                                        startRealPlay();
                                    }
                                });
                            } else {
                                startRealPlay();
                            }
                            //WebVideoCtrl.I_StartRealPlay(device_config.CameraIp + '_80', {
                            //    error: function () {
                            //        banana.controls.alert('预览失败');
                            //    }
                            //});
                        });
                    } else {
                        switch (args.code) {
                            case -2:
                                $('#screen_container').html('<blockquote class="layui-elem-quote">控件未安装，请先<a href="/WebComponentsKit.exe" target="_blank">下载控件</a></blockquote>');
                                break;
                            case -4:
                                $('#screen_container').css({ 'background': 'url(/assets/images/bg2.png)' });
                                $('#screen_container').html('<blockquote class="layui-elem-quote">' + args.message + '</blockquote>');
                                break;
                        }
                        banana.controls.alert(args.message);
                    }
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                banana.controls.msg("查询失败");
            }
        });
    }
    //视频退出
    function loginOut(szDeviceIdentify) {
        if (null == szDeviceIdentify) {
            return false;
        }
        var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
        if (0 == iRet) {
            return true;

            szInfo = "退出成功！";
            $("#ip option[value='" + szDeviceIdentify + "']").remove();
            getChannelInfo();
            getDevicePort();
        } else {
            onClick
            return false;
        }
    }
    //通道验证信息
    function loadChannel() {
    }
    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree_menu");
        zTree.checkNode(treeNode, !treeNode.checked, null, true);
        return false;
    }
    function zTreeBeforeCheck(treeId, treeNode) {
        if ($("#Model").val() == "1")
            return !treeNode.isParent;//当是父节点 返回false 不让选取
        if ($("#Model").val() == "2")
            return treeNode.isParent;//当是父节点 返回true 让选取
        if ($("#Model").val() == "3")
            return false;//不让选取
    }
    function onCheck(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree_menu");
        var nodes = zTree.getCheckedNodes(true);
        //if (nodes.length > 0) {
        //     var flag = nodes[0].isParent;
        //     //说明他是父元素有子节点 flag=true
        // }
        if (nodes[0].children == undefined) {
            //会议
            $("#IsMeet").val('true');
        }
        $("#AuthIdtxt").val(treeNode.name);
        $("#AuthId").val(treeNode.id);
        hideMenu();
        //加载会议期间入场人数统计
        ajaxJcustomerApply();
    }
    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }

    $('#AuthIdtxt').click(function () {
        var authObj = $("#AuthIdtxt");
        var authOffset = $("#AuthIdtxt").offset();
        $("#menuContent").css({ left: authOffset.left + "px", top: authOffset.top + authObj.outerHeight() + "px" }).slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
    })
    function showMenu() {
        var authObj = $("#AuthIdtxt");
        var authOffset = $("#AuthIdtxt").offset();
        $("#menuContent").css({ left: authOffset.left + "px", top: authOffset.top + authObj.outerHeight() + "px" }).slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
    }
    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "AuthIdtxt" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
            hideMenu();
        }
    }
    function loadSlt() {
        var zTreeObj;
        function buildTree(callback) {
            banana.helper.ajax({
                url: '/TbPlace/GetPlaceAndMeetList'
                , success: function (res) {
                    banana.helper.invokeFunction(callback, res);
                }
            });
        }
        var setItemChecked = function (tree) {
            var node = tree.getNodeByParam("id", $("#AuthId").val());
            if (node != null) {
                tree.checkNode(node, true, false, true);
                $("#AuthIdtxt").val(node.name);
            }
        }

        buildTree(function (data) {
            var setting = {
                check: {
                    chkStyle: 'radio',
                    enable: true,
                    chkboxType: { "Y": "", "N": "" },
                    radioType: "all"//所有都单选
                },
                callback: {
                    onClick: onClick,
                    onCheck: onCheck,
                    beforeCheck: zTreeBeforeCheck
                }
            };
            var nodes = [];
            var buildNodes = function (data) {
                var nodes = [];
                if (banana.helper.getType(data) === 'array' && data.length > 0) {
                    $(data).each(function (a, b) {
                        var node = {
                            id: b['id']
                            , pId: b['ParentId']
                            , name: b['name']
                            , isParent: b['ChildType'] == 1 ? false : true
                            , children: []
                        };
                        var childrenNodes = buildNodes(b['children']);
                        if (childrenNodes.length > 0) {
                            node.children = childrenNodes;
                        } else {
                            if (node.children.length == 0) {
                                delete node.children;
                            }
                        }
                        nodes.push(node);
                    });
                }
                return nodes;
            };
            nodes = buildNodes(data);

            zTreeObj = $.fn.zTree.init($("#tree_menu"), setting, nodes);
            setItemChecked(zTreeObj);
        });
    }

    $('.layui-form').perfectScrollbar();

    //$('#JEquipLookItems').perfectScrollbar();
    //var userAgent = navigator.userAgent;
    //var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    //var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    //var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    //if (isIE) {
    //    setTimeout(function () {
    //        $('#JEquipLookItems').css({ 'overflow-y': 'hidden' });

    //    }, 500)

    //} else if (isIE11) {
    //    setTimeout(function () {
    //        $('#JEquipLookItems').css({ 'overflow-y': 'hidden' });

    //    }, 500)

    //} else {
    //    setTimeout(function () {
    //        $('#JEquipLookItems').css({ 'overflow-y': 'hidden' })

    //    }, 500)

    //    return -1;//不是ie浏览器
    //}
});