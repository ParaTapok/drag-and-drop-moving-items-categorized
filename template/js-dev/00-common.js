'use strict';

/* touch event */
DND.isTouchDevice = Modernizr.touch;
// DND.clickEvent = DND.isTouchDevice ? 'touchend' : 'click';
DND.clickEvent = 'click';
DND.enterEvent = DND.isTouchDevice ? 'touchmove' : 'mouseenter';
DND.leaveEvent = DND.isTouchDevice ? 'touchend' : 'mouseleave';
DND.inputEvent = ('oninput' in document.createElement('INPUT')) ? 'input' : 'keyup';

_.templateSettings.variable = "rc";

$(function() {

    DND.CONST = {
        RESP: {
            XXS: 480,
            XS: 768,
            SM: 992,
            MD: 1200
        },
        RESP_NAMES: ['xxs', 'xs', 'sm', 'md', 'lg'],
        MESSAGES: {
            ERROR_DEFAULT: 'Приносим свои извинения. На сайте проводятся технические работы. Пожалуйста, повторите попытку позже.',
            FOLDERS: {
                AFTER_CREATE: 'Чтобы перенести презентацию в другую папку, перетащите её мышью на название папки.',
                AFTER_MOVE: 'Объект успешно перемещен в папку',
                INFOLDER: 'Перемещаемый объект уже находится в выбранной папке.'
            }
        },
        KEY: {
            ESCAPE: 27,
            ENTER: 13
        }
    };

    // кеширование js-шаблонов
    DND.tmpl = (function() {
        var person = {},
            common = {},
            other = $('.template-other');

        person.getTmpl = function(list) {
            var out = {};
            list.each(function(index, el) {
                var self = $(this);
                out[self.attr('id')] = _.template(self.html());
            });
            return out;
        };

        common.init = function() {

        };

        common.other = person.getTmpl(other);

        return common;
    })();

    DND.tmpl.init();
});