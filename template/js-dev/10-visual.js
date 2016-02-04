'use strict';

$(function() {

    DND.visual = (function() {
        var person = {},
            common = {},
            doc = $(document),
            w = $(window),
            body = $('body'),
            resp = '',
            flagValignListPortfolio = false;

        person.resize = function() {

            // Set resolution class
            w.on('load resize', function() {
                person.setResp();
            });

        };

        person.setResp = function() {
            var wW = w.width();

            body.removeClass('b-page__lg b-page__md b-page__sm b-page__xs b-page__xxs');
            if (wW >= DND.CONST.RESP.MD) {
                body.addClass('b-page__lg');
                resp = 'lg';
            } else {
                if (wW >= DND.CONST.RESP.SM) {
                    body.addClass('b-page__md');
                    resp = 'md';
                } else {
                    if (wW >= DND.CONST.RESP.XS) {
                        body.addClass('b-page__sm');
                        resp = 'sm';
                    } else {
                        if (wW > DND.CONST.RESP.XXS) {
                            body.addClass('b-page__xs');
                            resp = 'xs';
                        } else {
                            body.addClass('b-page__xxs');
                            resp = 'xxs';
                        }
                    }
                }
            }
        };

        // вставка svg картинок инлайном
        person.svgIco = function() {
            if (!Modernizr.svg) return;

            svg4everybody({
                polyfill: true
            });
        };

        // инциализация модуля
        common.init = function() {
            person.resize();
            person.svgIco();
        };

        common.currentResp = function() {
            person.setResp();
            return resp;
        };

        return common;
    })();

    DND.visual.init();

});