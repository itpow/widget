var ameChatSiteObject = {},
    url = location.href,
    steps_url = [],
    ame_url = '',
    quickTip;

let mobileBool = false;

ameChatSiteObject.init = function (key,id_demo=0,time_demo=0) {

    ame_url = 'ame-admin.qzo.su';

    (window['ameChatSiteGroups'] = window['ameChatSiteGroups'] || []).push({
        key: key,
        id_demo: id_demo,
        time_demo : time_demo 
    });

    if(window.innerWidth < 600) mobileBool = true;

    this.checkJquery();
};

// сохранить прежде значение переменных $ & jQuery и потом вернуть? Чтобы не перебивать версию и все такое
ameChatSiteObject.checkJquery = function () {

    var needJQueryVersion = '3.3.1';

    if (window.ameChatSiteJQuery === undefined) {

        if (!this.testJQueryVersion(needJQueryVersion)) {
            this.loadlib('https://ajax.googleapis.com/ajax/libs/jquery/' + needJQueryVersion + '/jquery.min.js', this.noConflictDefineJQuery.bind(this));
        }
        else {
            ameChatSiteJQuery = window.jQuery;
            this.startWithJQuery();
        }
    }
};

ameChatSiteObject.noConflictDefineJQuery = function () {

    ameChatSiteJQuery = window.jQuery.noConflict(true);

    this.startWithJQuery();
};

// При запуске
ameChatSiteObject.startWithJQuery = function () {

    var defaultData = {
        group: 'default',
        user: '16',
        key: 'default',
        AmeQ: 'true',
        apiUrl: ame_url,
        version: '0_3',
        head: 'Ame-chat',
        msgHi: 'Чем могу Вам помочь?',
        id_demo: 0,
        time_demo: 0,
        apiHost: 'https://' + ame_url + '/app/api_0_2.php?callback=?',
        apiHost2: 'https://' + ame_url + '/app/api_tip.php?callback=?',
        apiHost3: 'https://' + ame_url + '/bot/getAnswer?callback=?',
        apiHost4: 'https://' + ame_url + '/bot/getTip?callback=?',
        apiHost5: 'https://' + ame_url + '/bot/addCookie?callback=?',
        apiHost6: 'https://' + ame_url + '/bot/exitTip',
        apiHost7: 'https://' + ame_url + '/bot/checkTip?callback=?'
    }, thisData = {};

    for (var ameObject in ameChatSiteGroups) {

        if (!ameChatSiteGroups.hasOwnProperty(ameObject)) continue;

        ameChatSiteJQuery.each(defaultData, function (key2, value2) {

            thisData[key2] = (ameChatSiteGroups[ameObject][key2] === undefined) ? value2 : ameChatSiteGroups[ameObject][key2];
        });

        this.data = thisData;

        if (!ameChatSiteJQuery('div').is('#amechatsite' + this.data.group)) this.createHtmlForm();

        else this.createHtmlFormOnPage('#amechatsite' + this.data.group);

        // else перерисовать на странице
        // проверка на ame.css
        this.createCssListMain();
        this.createController(); // добавить проверку на отображение на странице
        this.templateMessage(this.data.msgHi, false);
        this.checkTip(); // запуск несколько раз/несколько виджетов
        if ( this.data.time_demo > 0 ){
            setTimeout( this.hello, this.data.time_demo );
        }
    }
};

ameChatSiteObject.testJQueryVersion = function (needVersion, strictly = false) {

    if (window.jQuery === undefined || (strictly === true && window.jQuery.fn.jquery != needVersion)) return false;

    var currentVersionArray = (window.jQuery.fn.jquery).split('.'),
        needVersionArray = needVersion.split('.');

    for (var i = 0; i < currentVersionArray.length; i++) {

        if (needVersionArray[i] !== undefined && parseInt(needVersionArray[i]) > parseInt(currentVersionArray[i])) return false;

        else if (needVersionArray[i] === undefined || parseInt(needVersionArray[i]) < parseInt(currentVersionArray[i])) return true;
    }

    return true;
};

// Подгружает библиотеку (любую)
ameChatSiteObject.loadlib = function (lib, functionOnReady, async = false) {

    var scriptTag = document.createElement('script');
    scriptTag.src = lib;
    scriptTag.async = async;
    scriptTag.onload = functionOnReady;
    scriptTag.onreadystatechange = function () {

        if (this.readyState == 'complete' || this.readyState == 'loaded') functionOnReady();
    };

    (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(scriptTag); // WHY 2?
};

// GET Ajax запрос
ameChatSiteObject.sendAjax = function (parametrs, host, functionBeforeSend, functionSuccess, functionError) {

    ameChatSiteJQuery.ajax({
        url: host,
        type: 'GET',
        dataType: 'jsonp',
        data: 'type=widget&key=' + ameChatSiteObject.data.key + parametrs,
        beforeSend: function () { functionBeforeSend(); },
        success: function (data) { functionSuccess(data); },
        error: function (data) { functionError(data); }
    });
};

// Template Сообщения Бота и Юзера
ameChatSiteObject.templateMessage = function (msg, out = false, tip = null) {

    // Сообщение
    ameChatSiteJQuery('<div class="' + (out ? 'amechatsiteMsgsXSet' : 'amechatsiteMsgsXGet') + '"><div class="' + (out ? 'amechatsiteMsgsSet' : 'amechatsiteMsgsGet') + '">' + msg + '</div></div>').appendTo('#amechatsite' + this.data.group + ' .amechatsiteMsgs');

    // анимированное пролистывание вниз
    ameChatSiteJQuery('.amechatsiteMsgs').animate({ scrollTop: ameChatSiteJQuery('.amechatsiteMsgs').prop("scrollHeight") }, 500);
};

// Template кнопки отправки
ameChatSiteObject.templateButton = function (msg, btnClass, tip = null) {

    var ameChatSiteObjectThis = this;
    tipBtn = (tip == null ? '<button type="button" class="btn btn-outline-primary btn-chat btn-' + ameChatSiteObjectThis.data.group + '-' + btnClass + '">' + msg + '</button>' : '<button type="button" class="btn btn-outline-primary btn-' + ameChatSiteObjectThis.data.group + '-' + btnClass + '" data-id="' + tip + '">' + msg + '</button>');
    ameChatSiteJQuery(tipBtn).appendTo('#amechatsite' + this.data.group + ' .amechatsiteMsgs');
};

ameChatSiteObject.createCssListMain = function () {

    var hrefSrc, href;

    hrefSrc = 'https://' + ameChatSiteObject.data.apiUrl + '/users_widget/' + this.data.key + '/ame.css';

    if (!ameChatSiteJQuery('link').is('[href=\'' + hrefSrc + '\']')) {

        ameChatSiteJQuery('<link>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: hrefSrc
        }).appendTo('head');
    }

    return true;
};

ameChatSiteObject.hello = function (total = false) {

    var ameChatSiteObjectThis = ameChatSiteObject;
    var input = ameChatSiteJQuery(".amechatsiteFieldInput");
    var button = ameChatSiteJQuery(".amechatsiteFieldSend");

    if ( getcookie('ame_dialog_key') == false || total ) {
        ameChatSiteObjectThis.getAnswer(ameChatSiteObjectThis.data.id_demo);
    }

};

// Открыть чат бот
ameChatSiteObject.ameChatOpen = function () {

    ameChatSiteJQuery('#amechatsite' + this.data.group).removeClass('amechatsiteClosed');
    ameChatSiteJQuery('.amechatsiteButton').addClass('amechatsite_Close');

    var input = ameChatSiteJQuery(".amechatsiteFieldInput");
    input.focus();

    if(mobileBool) {

        document.querySelector("body").style.overflow = "hidden";
    }
};

// Закрыть чат бот
ameChatSiteObject.ameChatClose = function () {

    ameChatSiteJQuery('#amechatsite' + this.data.group).addClass('amechatsiteClosed');
    ameChatSiteJQuery('.amechatsiteButton').removeClass('amechatsite_Close');

    if(mobileBool) {

        document.querySelector("body").style.overflow = "auto";
    }
};

// Отправить сообщение
ameChatSiteObject.Send = function (msg, url_msg, FunAfter = null) {

    var ameChatSiteObjectThis = this;
        // msg = ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldInput').val();

    var input = ameChatSiteJQuery(".amechatsiteFieldInput");
    var button = ameChatSiteJQuery(".amechatsiteFieldSend");
    // var url_msg = ($('.ame_site_edit').is(':visible')) ? $('.ame_site_edit').val() : location.href ;

    if (msg !== '') {
        ameChatSiteObjectThis.sendAjax('&msg=' + msg + '&url=' + url_msg + '&AmeQ=' + ameChatSiteObjectThis.data.AmeQ, ameChatSiteObjectThis.data.apiHost3,

            // beforSend
            function () {

                input.attr("placeholder", "Идет отправка...");
                input.prop("disabled", true);
                input.val('');
                button.css("background", "url(https://" + ame_url + "/users_widget/base/img/loader.svg) no-repeat center center");
                button.css("background-size", "70%");
            },

            // success
            function (data) {

                input.attr("placeholder", "Введите сообщение");
                input.prop("disabled", false);
                input.val('');
                input.focus();
                button.css("background", "url(https://" + ame_url + "/users_widget/base/img/send.png) no-repeat center center");
                button.css("background-size", "45%");

                if(typeof (FunAfter) === "function"){
                    FunAfter(data);  
                } else {
                    ameChatSiteObjectThis.ameChatOpen();
                    ameChatSiteObjectThis.templateMessage(msg, true);
                    ameChatSiteObjectThis.templateMessage(data.msg, false, data.tip);

                    if (data.tip != null) {

                        if (data.tip != '5') ameChatSiteObjectThis.templateButton('Могу показать как', 'tip', data.tip);

                        else if (data.user.id > 0) {
                            ameChatSiteObjectThis.templateButton('Доступно в расширении', 'extentsion-ame');

                        } else ameChatSiteObjectThis.templateButton('Авторизация', 'login');
                    }    
                }
            },

            // error
            function (data) { alert('Error!'); }
        );
    }
};

// Ответ без сообщения 
ameChatSiteObject.getAnswer = function (id_msg) {

    var ameChatSiteObjectThis = this,
        msg = ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldInput').val();

    var input = ameChatSiteJQuery(".amechatsiteFieldInput");
    var button = ameChatSiteJQuery(".amechatsiteFieldSend");

    if (id_msg > 0) {

        ameChatSiteObjectThis.sendAjax('&id_msg=' + id_msg , ameChatSiteObjectThis.data.apiHost3,
            // beforSend
            function () { },

            // success
            function (data) {
                ameChatSiteObjectThis.ameChatOpen();
                input.attr("placeholder", "Введите сообщение");
                input.prop("disabled", false);
                input.val('');
                button.css("background", "url(https://" + ame_url + "/users_widget/base/img/send.png) no-repeat center center");
                button.css("background-size", "45%");

                ameChatSiteObjectThis.templateMessage(data.msg, false, data.tip);

                if (data.tip != null) {

                    if (data.tip != '5') ameChatSiteObjectThis.templateButton('Могу показать как', 'tip', data.tip);

                    else if (data.user.id > 0) ameChatSiteObjectThis.templateButton('Доступно в расширении', 'extentsion-ame');

                    else ameChatSiteObjectThis.templateButton('Авторизация', 'login');
                }
            },

            // error
            function (data) { alert('Error!'); }
        );
    } else {
        console.error('нехватает id_msg');
    }
};

ameChatSiteObject.checkTip = function () {

    var ameChatSiteObjectThis = this;

    ameChatSiteObjectThis.sendAjax(null, ameChatSiteObjectThis.data.apiHost7,

        // beforSend
        function () { },

        // success
        function (data) {

            if (data.tip != null) {

                if (data.step != null) ameChatSiteObject.showTip(data.tip, data.step);

                else ameChatSiteObject.showTip(data.tip, 0);
            }
        },

        // error
        function (data) { alert('Error!'); }
    );
};

ameChatSiteObject.showTip = function (id, step = 0) {

    var ameChatSiteObjectThis = this;

    ameChatSiteObjectThis.sendAjax('&id=' + id, ameChatSiteObjectThis.data.apiHost4,

        // beforSend
        function () { },

        // success
        function (data) {

            ameChatSiteObjectThis.ameChatClose();

            ameChatSiteJQuery.each(data.guide.tip.steps, function (i, v) {
                steps_url.push(v.url);
            });

            array_enjoy = funParse(data.guide.tip.steps);
            if( step < array_enjoy.length ){
                ameChatSiteJQuery('<link>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: 'https://' + ame_url + '/users_widget/base/QuickTip.css'
                }).appendTo('head');

                ameChatSiteJQuery.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", function () {
                    ameChatSiteJQuery.getScript("https://" + ame_url + "/users_widget/base/QuickTip.js", function () {
                        window.ame_timer_counter = 0;

                        let preloader = `
                    <div class="quick-preloader">
                        <div class="quick-preloader-container">
                        <div class="quick-preloader-box1"></div>
                        <div class="quick-preloader-box2"></div>
                        <div class="quick-preloader-box3"></div>
                        </div>
                    </div> 
                `;

                        let template = `
                            <div class="quick_tip_block">

                                <!-- Хвостик темплейта -->
                                <div id="quickTip_tail" class="quick_tip_tail"></div>

                                <div class="quick_tip_head">
                                    <div id="quickTip_title" class="quick_tip_title">Меню</div>
                                    <div class="quick_tip_indicator">
                                    <i id="quickTip_previous" class="fa fa-chevron-left" aria-hidden="true"></i>
                                    <span id="quickTip_indicator">1 из 3</span>
                                    </div>
                                </div>
                                <div id="quickTip_text" class="quick_tip_text">Кнопка фхода, нужна для того чтобы войти</div>
                                <div class="quick_tip_footer">
                                    <a href="#" id="quickTip_stop">Пропустить</a>
                                    <button id="quickTip_next">Далее</button>
                                </div>
                            </div>
                        `;

                        // С одним параметром
                        quickTip = new QuickTip(template, {

                            "errorTimeout": 6,
                            
                            onEnd: function(){ AddCookie(array_enjoy.length) },

                            onSkip: function(){ AddCookie(array_enjoy.length) },

                            onStart: function() { 

                                if(isUrl(array_enjoy[quickTip.getStep()]['url'], array_enjoy[quickTip.getStep()]['isUrl'])){
                                    console.log("onStart yes");
                                } else{
                                    quickTip.stop();
                                } 
                            },

                            onStep: function (){
                                
                                if( isUrl(array_enjoy[quickTip.getStep()]['url']), array_enjoy[quickTip.getStep()]['isUrl'] ) AddCookie(quickTip.getStep());
                                
                                else quickTip.stop();
                            },

                            onStepError: function() {
                                console.log("Шаг не найден, программа завершается");
                                quickTip.stop();
                            }
                        });

                        quickTip.setPreloader(preloader);
                        quickTip.set(array_enjoy);

                        quickTip.run((typeof(step) == 'undefined' || step === null)? 0 : step);

                        function isUrl(url_guide, flag = 1){
                                
                                //только по домену
                                if(flag == 1){

                                    var url = new URL(location.href);
                                    
                                    var url_guide = new URL(url_guide);

                                    if(url.host == url_guide.host) return true;

                                    else return false;
                                    
                                }
                                //по домену и любому доп. url к нему без гет переменных
                                if (flag == 2){
                                 
                                    var url = new URL(location.href);
                                    
                                    var url_guide = new URL(url_guide);
                                    
                                    if(url_guide.host == url.host && url_guide.pathname == url.pathname) 
                                        return true;
                                    else 
                                        return false;
                                }
                        }
                   
                    });
                });
            } else {
                AddCookie(array_enjoy.length);
            }

        },

        // error
        function (data) { console.log('Error! function showTip()'); }
    );
};

// КОНТРОЛЛЕР
ameChatSiteObject.createController = function () {

    var ameChatSiteObjectThis = this;

    ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group).on('click', '.btn-' + ameChatSiteObjectThis.data.group + '-tip', function () {

        ameChatSiteObject.showTip(ameChatSiteJQuery(this).attr('data-id'), 0);
        AddCookie(0, ameChatSiteJQuery(this).attr('data-id'));
    });

    ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group).on('click', '.btn-' + ameChatSiteObjectThis.data.group + '-extentsion-ame', function () {
        window.open('https://chrome.google.com/webstore/detail/ame-chat-%2B-bot/afhifkklpgedmejpgcjbpknlloemekfg', '_blank');
    });

    // Закрыть чат бот
    ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteHeadClose').on('click', function () { ameChatSiteObjectThis.ameChatClose(); });

    // Открыть чат бот
    ameChatSiteJQuery('.amechatsiteButton').on('click', function () { ameChatSiteObjectThis.ameChatOpen(); });

    // Отправить сообщение нажав на кнопку
    ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldSend').on('click', function () {
        ameChatSiteObjectThis.Send(ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldInput').val(), url);

    });

    // Отправить сообщение нажав на enter
    ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldInput').keypress(function (e) { if (e.which == 13) { ameChatSiteObjectThis.Send(ameChatSiteJQuery('#amechatsite' + ameChatSiteObjectThis.data.group + ' .amechatsiteFieldInput').val(), url); return false; } });
};

// Создать чат бот
ameChatSiteObject.createHtmlForm = function () {

    ameChatSiteJQuery(
        '<div class="amechatsite amechatsiteClosed" id="amechatsite' + this.data.group + '">\
            <div class="amechatsiteHead">\
                <div class="amechatsiteHeadClose"></div>\
            </div>\
            <div class="amechatsiteMsgs">\
            </div>\
            <div class="amechatsiteField">\
                <input class="amechatsiteFieldInput" placeholder="Введите сообщение">\
                <div class="amechatsiteFieldSend"></div>\
            </div>\
            <div class="amechatsiteFooter">\
                <a href="https://law.ame.im/user_ame_rus.pdf">Условия обработки данных</a>\
                <a href="https://ame.im" style="display: flex; text-decoration: none; color: #0081ee;">Онбординг<span style="margin-left: 5px!important;"></span></a>\
            </div>\
        </div>\
        <div class="amechatsiteButton"></div>'
    ).appendTo('body');
};

// Создать чат бот (мини)
ameChatSiteObject.createHtmlFormOnPage = function (page) {

    ameChatSiteJQuery(page).html('');

    ameChatSiteJQuery(
        '<div class="amechatsiteHead">\
                <div class="amechatsiteHeadClose"></div>\
            </div>\
            <div class="amechatsiteMsgs">\
            </div>\
            <div class="amechatsiteField">\
                <input class="amechatsiteFieldInput" placeholder="Введите сообщение">\
                <div class="amechatsiteFieldSend"></div>\
            </div>\
            <div class="amechatsiteFooter">\
                <a href="https://law.ame.im/user_ame_rus.pdf">Условия обработки данных</a>\
                <a href="https://ame.im" style="display: flex; text-decoration: none; color: #0081ee;">Онбординг<span style="margin-left: 5px!important;"></span></a>\
            </div>\
            <div class="amechatsiteButton"></div>'
    ).appendTo(page);

    // ameChatSiteJQuery(
    //     '<div class="amechatsiteMsgs">\
    //     </div>\
    //     <div class="amechatsiteField">\
    //         <input class="amechatsiteFieldInput" placeholder="Введите сообщение">\
    //         <div class="amechatsiteFieldSend">\
    //         </div>\
    //     </div>\
    //     <div class="amechatsiteButton"></div>'
    // ).appendTo(page);
};

function funParse(arr) {
    $.each(arr, function(k, v){
        if( typeof arr[k]['onClick'] !== 'undefined'){
            arr[k]['onClick'] = new Function(arr[k]['onClick'].replace(/&quot;/g, '"'));
        }
    });
    return arr;
}

function getcookie(a) {
    var b = new RegExp(a + '=([^;]){1,}');
    var c = b.exec(document.cookie);
    if (c) c = c[0].split('='); else return false; return c[1] ? c[1] : false;
}

function AddCookie(step, tip = '') {

    if (tip != null) tip = '&tip=' + tip;

    ameChatSiteObject.sendAjax('&step=' + step + tip, ameChatSiteObject.data.apiHost5,

        // beforeSend
        function () { },

        // Success 
        function (data) { console.log(data); },

        // Error
        function (data) { console.log(data); }
    );
}

function exitTip() {

    ameChatSiteObject.sendAjax(null, ameChatSiteObject.data.apiHost6,

        // beforeSend
        function () { },

        // Success  location.reload() 
        function (data) {console.log('success') },

        // Error
        function (data) { alert('Error!'); }
    );
}