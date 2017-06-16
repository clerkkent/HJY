angular.module('HJY').factory("v11", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.date = function(yc, mc, dc) {
        var date = new Date(yc, mc, dc);
        //当前是哪一年
        var year = date.getFullYear();

        //当前是哪个月，注意这里的月是从0开始计数的
        var month = date.getMonth();
        var title = year + "年" + (month + 1) + "月"
            //当前月的第一天的日期
        var firstDay = new Date(year, month, 1);

        //第一天是星期几
        var weekday = firstDay.getDay();

        //求当前月一共有多少天
        //new Date(year,month+1,0) ： month+1是下一个月，day为0代表的是上一个月的最后一天，即我们所需的当前月的最后一天。
        //getDate（）则返回这个日期对象是一个月中的第几天，我们由最后一天得知这个月一共有多少天
        var days = new Date(year, month + 1, 0).getDate();
        var w = ["天", "一", "二", "三", "四", "五", "六"]
        var res = [];
        //输出第一天之前的空格
        for (var i = 0; i < weekday; i++) {
            res.push(" ");
        }

        for (var j = 1; j <= days; j++) {
            res.push(j);
            weekday++;

            //如果是周日则换行
        }
        var data = {
            w: w,
            t: title,
            d: res
        }
        return data
    }
    factory.get = function(url, data_send, authToken) {
        var defer = $q.defer();
        var head = null
        if (authToken != undefined) { //此处的登录状态cookie设置还需要更改
            head = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            window.document.cookie = "OIL_TOKEN=" + authToken + ";path=/;";
        } else {
            head = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http({
            method: 'POST',
            url: url,
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {
            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
    return factory
}])