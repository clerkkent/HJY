angular.module('HJY').factory("land_main", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.pay = function(data, authToken) {
        $.extend({
            StandardPost: function(url, args) {
                var body = $(document.body),
                    form = $("<form method='post'></form>"),
                    input;
                form.attr({ "action": url });
                $.each(args, function(key, value) {
                    input = $("<input type='hidden'>");
                    input.attr({ "name": key });
                    input.val(value);
                    form.append(input);
                });
                form.appendTo(document.body);
                form.submit() //阻止表单默认提交 
                document.body.removeChild(form[0]);
            }
        });
        $.StandardPost($rootScope.url_global + "/pro/index.php?c=yimao", data);
    }
    factory.get_order_list = function(data_send, authToken) {
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
            url: $rootScope.url_global + '/pro/index.php?c=order',
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {
            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
    factory.repay = function(data, authToken) {
        $.extend({
            StandardPost: function(url, args) {
                var body = $(document.body),
                    form = $("<form method='post'></form>"),
                    input;
                form.attr({ "action": url });
                $.each(args, function(key, value) {
                    input = $("<input type='hidden'>");
                    input.attr({ "name": key });
                    input.val(value);
                    form.append(input);
                });
                form.appendTo(document.body);
                form.submit() //阻止表单默认提交 
                document.body.removeChild(form[0]);
            }
        });

        $.StandardPost($rootScope.url_global + "/pro/index.php?c=yimao&a=goPay", data);
    }
    return factory
}])