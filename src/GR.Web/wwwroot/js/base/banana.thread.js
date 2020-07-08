onmessage = function (e) {
    var threadArgs = e.data;
    if (threadArgs && threadArgs.__THREAD_TASK__) {
        var threadTask = threadArgs.__THREAD_TASK__;
        try {
            var f = (new Function("return " + threadTask))(),
                b = {
                    threadSignal: !0,
                    sleep: function (threadArgs) {
                        b.threadSignal = !1;
                        setTimeout(c, threadArgs)
                    },
                    runOnUIThread: function (b) {
                        postMessage({
                            __UI_TASK__: b.toString(),
                            data: threadArgs.data
                        });
                    }
                },
                c = function () {
                    b.threadSignal = !0;
                    var c = f.call(b, threadArgs.data);
                    postMessage({
                        error: null,
                        returnValue: c,
                        __THREAD_TASK__: threadTask,
                        data: threadArgs.data,
                        taskId: threadArgs.taskId
                    });
                };
            c();
        } catch (error) {
            postMessage({
                error: error.toString(),
                returnValue: null,
                data: threadArgs.data
            });
        }
    }
};