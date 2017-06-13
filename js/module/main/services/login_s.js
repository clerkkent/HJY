;
HJY.factory("login_logic", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.deal = function() { //注册页输入框下线变色
        var str = "";
        $(".main_content").on("focus", ".login input", (function(event) {
            $(this).parent(".second").addClass("line_change");
        }));
        $(".main_content").on("input propertychange", ".login #phone", (function(event) { //电话号码格式化，暂时不使用
            if ($(this).val().length <= 6) {
                $(".main_content .login .test").text($(this).val().replace(/(\d{3})/, "$1 "))
            } else {
                $(".main_content .login .test").text($(this).val().replace(/(\d{3})(\d{4})/, "$1 $2 "))
            }

        }));
        $(".main_content").on("blur", ".login input", (function(event) {
            $(this).parent(".second").removeClass("line_change");
        }));
        $(".main_content").on("click", ".login footer span", (function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass("selected")
            } else {
                $(this).addClass("selected")
            }
        }));
        $(".main_content").on("focus", ".get_award input", (function(event) {
            $(".friend_game").addClass("keyshow");
        }));
        $(".main_content").on("blur", ".get_award input", (function(event) {
            $(".friend_game").removeClass("keyshow");
        }));
    }
    factory.weixin_getcode = function() { //微信绑定页获得code
        var url = location.search
        var theRequest = new Object(); //创建一个对象
        var weixinid = null;
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); //提取url中的参数
            }
            console.log(theRequest.code)
        }
        $http.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx04750f6d860219dd&secret=53dfdc750f25acbe7ddf79ed45ce681a&code=" + theRequest.code + "&grant_type=authorization_code").success(function(data) { //向后端发送code，会获取随后的登录后的数据。
            console.log(data)
        }).error(function() {
            console.log("error")
        })
        weixinid = theRequest.code

        return weixinid;
    }
    factory.weixin_bind = function() { //微信绑定页跳转
        var redirect = encodeURIComponent("https://clerkkent.duapp.com/HJY/index.html#/help"); //微信必须对跳转地址进行编码
        var message = "123456";
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx04750f6d860219dd&redirect_uri=" + redirect + "&response_type=code&scope=snsapi_userinfo&state=" + message + "#wechat_redirect";
    }
    factory.submit = function(data_send, authToken) { //注册页信息提交接口（公用）
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
            method: 'post',
            url: $rootScope.url_global + '/passport/service.php?c=account',
            data: data_send,
            headers: head
        }).success(function(data, header, config, status) {
            
            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败

        });
        return defer.promise
    }
    factory.deal_help = function() { //帮助页的详细信息隐藏出现
        $(".main_content").on("click", ".main_content_help li .question", (function(event) {
            $(this).parent("li").find(".answer").fadeToggle();
            if ($(this).find("span").hasClass("selected")) {
                $(this).find("span").removeClass("selected")
            } else {
                $(this).find("span").addClass("selected")
            }
        }));

    }
    factory.deal_mycenter = function() {
        $(".main_content .my_center .popum_wrap").fadeIn(1000, "linear").delay(800).fadeOut("slow")
    }
    factory.parse_url = function() { //解析url参数
        var url = location.hash.split("?")[1]; //参数
        var theRequest = new Object();
        if (url != undefined) { //URL入口
            var strs = url.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]); //提取url中的参数
            }
        }
        return theRequest;
    }
    factory.md = function(params) {
        function objKeySort(arys) {
            //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
            var newkey = Object.keys(arys).sort();　　
            //console.log('newkey='+newkey);
            var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
            for (var i = 0; i < newkey.length; i++) {
                //遍历newkey数组
                newObj[newkey[i]] = arys[newkey[i]];
                //向新创建的对象中按照排好的顺序依次增加键值对

            }
            return newObj; //返回排好序的新对象
        }
        var st = ""
        for (var i in objKeySort(params)) {
            st = st + objKeySort(params)[i] + "&"
        }
        return $.md5(st + "HUIJIAYOU_TOKEN")
    }
    return factory;
}]);
HJY.factory("buy", ["$http", "$q", function($http, $q) {
    var factory = {};
    factory.animate = function() {
        $.fn.extend({
            addam: function(sec, am, dur, del) {
                sec.addClass("ani");
                sec.attr({ "swiper-animate-effect": am, "swiper-animate-duration": dur + "s" });
                sec.attr({ "swiper-animate-delay": del + "s" });
            }
        });
    }
    return factory;
}]);
HJY.factory("game_play", [function($state) { //此处所有的节点应该也归于游戏元素中，但由于每个游戏进程内this，that不易辨别，就在每个进程之内取用所需节点。
    var factory = {
        r: 0, //旋转半径
        level: 0.1, //油桶内含量高
        count: 0, //共计点击多少下
        state: 0, //游戏状态，0表示未开始，可开始，触发开始函数；1表示已开始，正在进行倒数或者游戏；2表示游戏已经结束；PS：游戏结束后需要重新刷新网页，或者玩家点击重新游戏来激活state为0来开始游戏
        time_leave: 10
    };
    factory.carryon = function() {
        var point = $(".main_content .friend_game .point"); //油针节点
        var bt = $(".main_content .friend_game .button_play"); //按钮节点
        var oil = $(".main_content .friend_game .oil"); //油滴节点
        var bucket = $(".main_content .friend_game .level"); //油桶水平节点
        var addone = $(".main_content .friend_game .addone"); //加1节点
        var contain = $(".main_content .friend_game .left"); //容器节点
        var that = this;
        bt.on("touchend", function() {
            if (that.count < 200) {
                that.count++;
            } else {
                that.count = 200;
            }

            if (that.r < 160) {
                that.r += 10;
                animation.addone();
                point.css({
                    transform: "rotate(" + (that.r - 80) + "deg)"
                })
            }
            if (that.count % 5 == 0 && that.count != 0) {
                oil.css({ top: "0.6rem", transform: "scale(1)", opacity: "1" })
                oil.fadeIn(300, "linear").animate({ top: "0.9rem", transform: "scale(0)", opacity: "0" }, 300)
            }
            if (that.count % 25 == 0 && that.count != 0) {
                if (that.level < 0.6) {
                    that.level += 0.1;
                    bucket.css({ height: that.level + "rem" })
                }
            }
        })
        this.time = setInterval(function() {
            if (that.r > 0) {
                that.r -= 7;
                point.css({
                    transform: "rotate(" + (that.r - 80) + "deg)"
                })
            }
        }, 200)
        var animation = {}
        animation.addone = function() {
            var add = $("<span>+1</span>");
            var x = Math.random() * 1.2 - 0.6;
            var y = Math.random() * 1 + 0.3;
            add.css({
                width: ".5rem", // 25px;
                height: ".5rem", // 25px;
                color: "#f95b4e",
                position: "absolute",
                right: "-.6rem", // 25px;
                bottom: "1.7rem", // 25px;
                fontSize: ".4rem", // 20px;
            })
            contain.append(add);
            add.animate({
                right: -1.2 + x + "rem",
                bottom: 1.3 + y + "rem",
                opacity: 0
            }, 1000, function() {
                $(this).remove()
            })
        }
    }
    factory.end = function() {
        clearInterval(this.time)
        return this.count;
    }
    factory.init = function() {
        this.r = 0;
        this.level = 0.1;
        this.count = 0;
        this.time_leave = 10;
        this.state = 0;
        $(".main_content .friend_game .button_play").removeAttr("disabled");
        $(".main_content .friend_game .button_play").css({ fontSize: "0.32rem" });
        $(".main_content .friend_game .fourth").css({ opacity: "1" });
        $(".main_content .result_select .result span").css({ transform: "scale(1)" })
        $(".main_content .friend_game .point").css({
            transform: "rotate(" + (this.r - 80) + "deg)"
        })
        $(".main_content .friend_game .level").css({ height: this.level + "rem" })
        $(".main_content .friend_game .time_leave").text("00:" + this.time_leave);
    }
    factory.ready_pre = function() {
        var a = 0;
        var that = this;
        $(".main_content .friend_game .button_play p").fadeOut("fast", function() {
                $(this).css({ fontSize: "0.42rem" })
                $(this).text("Are you ready?")
            })
            .fadeIn("fast")
            .fadeOut("500", function() {
                $(this).text("3")
            })
            .fadeIn("500")
            .fadeOut("500", function() {
                $(this).text("2")
            })
            .fadeIn("500")
            .fadeOut("500", function() {
                $(this).text("1")
            })
            .fadeIn("500")
            .fadeOut("500", function() {
                $(this).text("猛戳!")
            })
            .fadeIn("500", function() {
                that.state = 1;
                $(".main_content .friend_game .button_play").removeAttr("disabled");
                that.carryon();
                var carryon = setInterval(function() {
                    if (that.time_leave > 0) {
                        that.time_leave--;
                        that.time_leave >= 10 ? $(".main_content .friend_game .time_leave").text("00:" + that.time_leave) : $(".main_content .friend_game .time_leave").text("00:0" + that.time_leave)

                    } else {
                        $(".main_content .friend_game .button_play").attr('disabled', "true");
                        clearInterval(carryon);
                        sessionStorage.setItem("score", that.count);
                        if (that.count >= 100) {
                            $(".main_content .result_select .result span").css({ transform: "scale(0.8)" })
                        }
                        location.hash = "/game/select";
                        that.end();
                        that.state = 2;
                    }
                }, 1000)
            })
    }
    factory.start = function() {
        var that = this;
        $(".main_content .friend_game .button_play").on("touchend", function() { //游戏页初始化函数
            if (that.state == 0) {
                $(".main_content .friend_game .fourth").css({ opacity: "0" });
                $(this).attr('disabled', "true");
                that.ready_pre();
            }
        })

    }
    factory.replay = function() {
        var that = this;
        $(".main_content .result_select .choose .left").on("touchend", function() {
            that.init();
            location.hash = "/game/main";
        })
    }
    factory.deal_icon = function() {
        var icon = $("<span class='result_icon'><b>" + sessionStorage.getItem("score") + "</b></span>")
        $(".main_content .friend_game header .banner").append(icon);

    }
    return factory;
}])
HJY.factory("friend", [function() {
    var factory = {}
    factory.popum = function() {
        $(".main_content").on("click", ".friend_request_details .remind", (function(event) {
            $(".main_content .friend_request_details .popum_wrap").css({ display: "block" });
        }));
        $(".main_content").on("click", ".friend_request_details .rule_close", (function(event) {
            $(".main_content .friend_request_details .popum_wrap").css({ display: "none" });
        }));
        $(".main_content").on("click", ".friend_request section .friend_wrap .first", (function(event) {
            $(".main_content .friend_request .popum_wrap").css({ display: "block" });
        }));
        $(".main_content").on("click", ".friend_request .rule_close", (function(event) {
            $(".main_content .friend_request .popum_wrap").css({ display: "none" });
        }));
    }
    factory.friend_none = function() {
        $(".main_content .friend_request .friend_wrap ul").addClass("friend_none")
    }
    return factory
}])
HJY.factory("webappSDK", ["$http", "$q", function($http, $q) {
    var factory = {
        information: null
    }
    factory.webview = function(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                return callback(WebViewJavascriptBridge);
            }, false)
        }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'; //通过发送地址吊起方法，双重保证
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    factory.share = function(content) {
        this.webview(function(bridge) {
            bridge.callHandler('invitation', content, function(responseData) { //请求OC

            })
        })
    }

    factory.getUserInfos = function(callback) {
        this.webview(function(bridge) {
            bridge.callHandler('getUserInfos', function(responseData) { //请求OC
                callback(responseData)
            })
        })
    }
    factory.call = function(phone) {
        console.log(phone)
        this.webview(function(bridge) {
            console.log(phone)
            bridge.callHandler('call', phone, function(responseData) { //请求OC
            })
        })
    }
    factory.GetActiveId = function(id) {
        this.webview(function(bridge) {
            bridge.callHandler('GetActiveId', id, function(responseData) { //请求OC
            })
        })
    }
    return factory
}])
HJY.factory("land", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.format = function() {
        $('.main_content').on('keyup mouseout input', '.land #card', function() {
            var $this = $(this);
            var v = $this.val();
            /\S{5}/.test(v) && $this.val(v.replace(/\s/g, '').replace(/(.{4})/g, "$1 "));
        });
        $('.main_content').on('keyup mouseout input', '.land #phone', function() {
            var $this = $(this);
            var v = $this.val();
            /\S{5}/.test(v) && $this.val(v.replace(/\s/g, '').replace(/(.{3})(.{4})/g, "$1 $2 "));
        });
        // $('.main_content').on('focus', 'input', function() {
        //     $(".download").css({ height: "0", opacity: "0" })
        // });
        // $('.main_content').on('blur', 'input', function() {
        //     $(".download").css({ height: "1.27999891rem", opacity: "1" })
        // });
        $(".main_content").on("click", ".land .express", function(event) {
            $(".main_content .land .details_express").show();
            event.stopPropagation()
        })
        $(".main_content").on("click", ".land", function() {
            $(".main_content .land .details_express").hide();
        })
        var share = $('<meta name="sharecontent" data-msg-img="images/login/ic_login_logo.png" data-msg-title="会加油充值" data-msg-content="新用户注册立减10元，加油卡充值套餐低至85折" data-msg-callBack="" data-line-img="images/login/ic_login_logo.png" data-line-title="会加油充值" data-line-callBack=""/>')
        $("head").append(share);
        console.log($rootScope.url_global + "/pro/index.php?c=webpay")
    }
    factory.submit = function(data_send, authToken) {
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
        // var endata = encodeURIComponent(data_send)
        // var basecode = BASE64.encoder(endata)
        // console.log(basecode)
        $http({
            method: 'POST',
            url: $rootScope.url_global + '/pro/index.php?c=oilcard',
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {

            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
    factory.get_good_list = function(data_send, authToken) {
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
            url: $rootScope.url_global + '/pro/index.php?c=pay',
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {

            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {

            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
    factory.get_type = function(data_send, authToken) {
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
            url: $rootScope.url_global + '/pro/index.php?c=oilcard',
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {
            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
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

        $.StandardPost($rootScope.url_global + "/pro/index.php?c=webpay", data);
    }
    return factory
}])
HJY.factory("wxsdk", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.wx = function(x) {
        var imgUrl = "images/share.jpg";
        var lineLink = "http://www.ihaomu.com//wechat/#/game/main";
        var descContent = '会加油';
        var shareTitle = '会加油';
        var appid = x.appId;
        console.log("返回", x)
        wx.config({
            debug: false,
            appId: x.appId,
            timestamp: x.timestamp,
            nonceStr: x.nonceStr,
            signature: x.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ]
        });
    }
    factory.shareo = function() {
        wx.ready(function() {
            console.log($rootScope.share)
            wx.onMenuShareTimeline({
                title: "必须看！老司机教你8.5折充油卡！", // 分享标题
                link: $rootScope.share, // 分享链接
                imgUrl: "http://www.ihaomu.com/wechat/images/share.jpg"
                    // 分享图标
            });
            wx.onMenuShareAppMessage({
                title: "必须看！老司机教你8.5折充油卡！",
                desc: "注册就送200元加油券，车主必备，老司机快来~",
                link: $rootScope.share,
                imgUrl: "http://www.ihaomu.com/wechat/images/share.jpg"
            });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    factory.shares = function() {
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: "必须看！老司机教你8.5折充油卡！", // 分享标题
                link: $rootScope.share, // 分享链接
                imgUrl: "http://www.ihaomu.com/wechat/images/share.jpg"
                    // 分享图标
            });
            wx.onMenuShareAppMessage({
                title: "必须看！老司机教你8.5折充油卡！",
                desc: "注册就送200元加油券，车主必备，老司机快来~",
                link: $rootScope.share,
                imgUrl: "http://www.ihaomu.com/wechat/images/share.jpg"
            });

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }
    factory.post = function(url, data_send, authToken) {
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
            url: $rootScope.url_global + url,
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