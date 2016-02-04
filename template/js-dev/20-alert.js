'use strict';

$(function() {

    DND.alert = (function() {
        var common = {},
            person = {},
            body = $('body'),
            w = $(window),
            timer = null;

        common.init = function() {

        };

        // показ и скрытие по таймауту
        common.show = function(data) {
            var alert;

            $('#alert-notify').remove();

            // генерирование алерта 
            body.append(DND.tmpl.other['tmpl__alert']({ text: data.text }));

            // показываем алерт
            alert = $('#alert-notify');
            alert.stop().removeAttr('style').show();

            // ставим таймер на скрытие блока
            clearTimeout(timer);
            timer = setTimeout(function() {
                alert.stop().fadeOut(1000, function() {
                    alert.remove();
                });
            }, data['time'] || 2000);

            return alert;
        };

        return common;
    })();

    DND.alert.init();
});