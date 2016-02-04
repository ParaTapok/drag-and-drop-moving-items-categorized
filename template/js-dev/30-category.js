'use strict';

$(function() {

    DND.category = (function() {
        var person = {},
            common = {},
            doc = $(document),
            w = $(window),
            body = $('body'),
            resp = '',
            block = $('.b-category-list'),
            blockList = block.find('.b-category-list__ul'),
            content,
            parent,
            footer = $('.b-footer'),
            scrollFlag = false;

        // toggle list categories on list page portfolio
        person.toggle = function(param) {
            var all;

            all = block.find('.b-category-list__all');

            all.on(DND.clickEvent, function(e) {
                var self = $(this);
                e.preventDefault();

                block.toggleClass('b-category-list__open'); 
                blockList.slideToggle(400, function() { });
            });
        };

        // применяем скролл
        person.applyScroll = function(max) {
            if (scrollFlag) return;

            // применяем nanoscroller
            block
                .addClass('nano')
                .nanoScroller({
                    preventPageScrolling: true,
                    // iOSNativeScrolling: true
                });

            // выставляем флаг 
            scrollFlag = true;
        };

        // отменяем скролл
        person.destroyScroll = function() {
            if (!scrollFlag) return;

            // отменяем плагин
            block.nanoScroller({ destroy: true });
            block.removeClass('nano');

            // сбрасываем флаг
            scrollFlag = false;
        };

        // задаем высоту меню 
        person.setMenuHeight = function() {
            var max,
                maxWindow;

            // высота левой колонки
            max = footer.offset().top - parent.offset().top;

            // высота окна
            maxWindow = w.height();

            if (max > maxWindow) max = maxWindow;
            max = max - 20;

            // если высота контента больше высоты контейнера
            if (blockList.height() >= max) {

                block.height(max);
                person.applyScroll(max);

            } else {

                block.css({
                    'height': 'auto'
                });
                person.destroyScroll();

            }
        };

        // задаем высоту родителю 
        person.setParentHeight = function() {
            var tmpCss,
                tmpClass,
                parentHeight,
                wW = w.height();

            parentHeight = blockList.height();

            // максимальная высота - высота окна
            if (parentHeight > wW) parentHeight = wW;

            // выставляем высоту родителя
            parent.height(parentHeight);
        };

        // позиционируем меню
        person.setMenuPosition = function(pos) {
            var scroll = w.scrollTop(),
                parentWidth,
                parentHeight,
                footerTop = footer.offset().top,
                delta;

            if (scroll > pos - 10) {
                // размеры родителя
                parentWidth = parent.width();

                // делаем менюшку плавающей
                block.addClass('b-category-list--fixed').css({
                    width: parentWidth
                });

                delta = scroll + parent.height();

                if (delta + 20 > footerTop) {
                    block.css({
                        'marginTop': footerTop - delta - 20
                    });
                } else {
                    block.css({
                        'marginTop': 0
                    });
                }
            } else {
                block.removeClass('b-category-list--fixed').css({
                    'width': 'auto',
                    'marginTop': 0
                });
            }
        };

        // плавающее меню
        person.stick = function() {
            var blockOffsetTop;

            // ищем родителя менюшки
            parent = block.parent();

            // определеяем позицию top меню
            blockOffsetTop = block.offset().top;

            w.on('resize', function() {
                var resp = DND.visual.currentResp();

                if ((resp === 'xs') || (resp === 'xxs')) {

                    // отменяем скролл
                    person.destroyScroll();

                    // сброс
                    block.removeClass('b-category-list--fixed').removeAttr('style');
                    parent.removeAttr('style');

                } else {
                    blockOffsetTop = parent.offset().top;

                    // выставляем размеры родителя
                    person.setParentHeight();

                    // выставляем высоту меню
                    person.setMenuHeight();
                }
            });

            w.on('load folder.create', function() {
                var resp = DND.visual.currentResp();

                if ((resp === 'xs') || (resp === 'xxs')) {

                } else {
                    // выставляем размеры родителя
                    person.setParentHeight();

                    // выставляем высоту меню
                    person.setMenuHeight();

                    // позиционируем меню
                    person.setMenuPosition(blockOffsetTop);
                }
            });

            w.on('scroll', function(e) {
                var resp = DND.visual.currentResp();

                if ((resp === 'xs') || (resp === 'xxs')) {

                } else {

                    // выставляем размеры родителя
                    person.setParentHeight();

                    // позиционируем меню
                    person.setMenuPosition(blockOffsetTop);
                }
            });
        };

        // инциализация модуля
        common.init = function() {

            if (!block.length) return;

            // функционал сворачивания
            person.toggle();

            // фиксирование в видимой части экрана
            if (!block.hasClass('b-category-list--stick')) return;
            person.stick();
        };

        // возвращаем активный пункт меню
        common.getActive = function() {
            var cur = block.find('.b-category-list__active a'),
                result;

            (cur.length)
                ? result = {
                        href: cur.eq(0).attr('href'),
                        text: cur.eq(0).text()
                    }
                : result = false;

            return result;
        };

        return common;
    })();

    DND.category.init();

});