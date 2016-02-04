'use strict';

$(function() {

    DND.lkFolders = (function() {
        var person = {},
            common = {},
            doc = $(document),
            body = $('body'),
            w = $(window),
            baseClass = 'b-folders',
            parent = $('.' + baseClass),
            objs = $('.b-photos__item'),
            dropFolders;

        // проверка на попадание в папку
        // возращает ссылку на дроп-зону или false
        person.testDropZone = function(element) {
            var result,
                parent;

            parent = element.closest('.' + baseClass + '__item');
            if (parent.length) {
                result = parent;
            } else {
                result = false;
            }

            return result;
        };

        // обработчики перетаскивания
        person.moveEvents = function() {

            // обработчик на элемент на кейдаун
            body.on('mousedown touchstart', '.b-photos__item .b-photos__link', function(e) {
                var self = $(this),
                    offerId = self.data('id'),
                    pos = {},
                    drop,
                    touchElem,
                    currentTarget,
                    timeMouseDown = new Date().getTime(),
                    moveInitFlag = false,
                    moveInit = function() {

                        // курсор
                        body.addClass('drag');

                        // создаем фейк элемент
                        body.append('<div id="drag-drop" class="b-photos__touch">' + self.find('.b-photos__media').html() + '</div>');
                        touchElem = $('#drag-drop');
                        touchElem.css({
                            left: pos.x + 2,
                            top: pos.y + w.scrollTop() + 2
                        });

                        // отменяем клик
                        self.one('mouseup touchend click tap', function(e) {
                            e.preventDefault();
                        });

                        // помечаем, что пользователь тащит
                        moveInitFlag = true;
                    };

                // выбираем все дроп-зоны
                dropFolders = parent.find('.' + baseClass + '__item');

                // отмена перетаскивания элемента
                e.preventDefault();

                // сохранение позиции курсора
                pos.x = e.clientX;
                pos.y = e.clientY;

                // вешаем на элемент обработчик мув
                body.on('mousemove touchmove', function(e) {
                    var isDropZone,
                        currentPos = {},
                        touches = e.originalEvent.touches;

                    currentTarget = $(e.target);

                    // bugfix Chrome https://code.google.com/p/chromium/issues/detail?id=161464
                    // на событие mousedown хром генерирует событие touchmove
                    if (new Date().getTime() < timeMouseDown + 10) {
                        return;
                    }

                    // сохраняем позицию курсора
                    currentPos.x = e.clientX;
                    currentPos.y = e.clientY;

                    // инициализация перетаскивания
                    if (!moveInitFlag) moveInit();

                    // обновляем позицию курсора и target, если тач устройство
                    if (touches !== undefined) {
                        currentPos.x = touches[0].clientX;
                        currentPos.y = touches[0].clientY;
                        currentTarget = $(document.elementFromPoint(currentPos.x, currentPos.y));
                    }

                    // обновление позиции превьюшки
                    touchElem.css({
                        left: currentPos.x + 2,
                        top: currentPos.y + w.scrollTop() + 2
                    });

                    // находится ли курсор над drop-зоной ?
                    isDropZone = person.testDropZone(currentTarget);

                    // если target является папкой
                    if (isDropZone) {
                        dropFolders.removeClass(baseClass + '__item--drop');
                        isDropZone.addClass(baseClass + '__item--drop');
                    } else {
                        dropFolders.removeClass(baseClass + '__item--drop');
                    }
                });

                // отжимаем кнопку мыши
                body.one('mouseup touchend', function(e) {
                    var elem = $(e.target),
                        isDropZone,
                        folderId = 0,
                        folderName = '',
                        folderCurrent = null,
                        touches = e.originalEvent.changedTouches;

                    // отвязываем события перемещения
                    body.off('mousemove touchmove');

                    // проверям какое событие произошло
                    if (!moveInitFlag) return;

                    // отменяем действие по умолчанию
                    e.preventDefault();
                    e.stopPropagation();

                    // сбрасываем курсор
                    body.removeClass('drag');

                    // удаляем превьюшку 
                    if (touchElem) touchElem.remove();

                    // обновляем target, если тач устройство
                    if (touches !== undefined) {
                        // не работает в Safari
                        // elem = $(document.elementFromPoint(touches[0].clientX, touches[0].clientY));

                        // поэтому берем последнее значение из события touchmove
                        elem = currentTarget;
                    }

                    // находится ли курсор над drop-зоной ?
                    isDropZone = person.testDropZone(elem);

                    // если target является папкой
                    if (isDropZone) {

                        folderId = isDropZone.data('id');
                        folderName = isDropZone.find('.b-category-list__val').text();

                        if (folderId === 0) folderId = '';

                        // id текущей папки
                        folderCurrent = parent.data('folderCurrent');

                        if (folderCurrent === folderId) {
                            // показываем сообщение
                            DND.alert.show({
                                text: DND.CONST.MESSAGES.FOLDERS.INFOLDER,
                                time: 2000
                            });

                        } else {

                            // запрос на перемещение папки
                            $.ajax({
                                type: 'POST',
                                url: parent.data('folderMove'),
                                data: {
                                    folder_id: folderId,
                                    offer_id: offerId
                                },
                                dataType: 'json',
                                beforeSend: function() {
                                    // блокируем блок 
                                    self.parent().append('<div class="b-photos__load"></div>');
                                }
                            }).done(function(data) {
                                var currentElem,
                                    allCount,
                                    alert;

                                // получен список папок

                                // прогоняем данные по шаблону и обновляем код блока
                                parent.find('.' + baseClass + '__list').html(DND.tmpl.other['tmpl__folders-list']({
                                    folders: data,
                                    current: folderCurrent
                                }));

                                // меняем счетчик количества объектов в папке Мое портфолио
                                (data[0].cnt_offers > 0) 
                                    ? allCount = '(' + data[0].cnt_offers + ')'
                                    : allCount = '';
                                parent.find('.' + baseClass + '__parent .b-category-list__count').text(allCount);

                                // удаляем итем со страницы
                                currentElem = self.closest('.b-photos__item');
                                currentElem.hide(500, function() {
                                    currentElem.remove();

                                    // выраниванием список
                                    // DND.visual.valignListPortfolio();

                                    // инициируем событие перемещения презентации в другу папку
                                    body.trigger('folder.move');
                                });

                                // показываем сообщение
                                alert = DND.alert.show({
                                    text: DND.CONST.MESSAGES.FOLDERS.AFTER_MOVE + ' &laquo;' + folderName + '&raquo;.',
                                    time: 2000
                                });

                            }).fail(function() {
                                self.parent().find('.b-photos__load').fadeOut(300);

                                DND.alert.show({
                                    text: DND.CONST.MESSAGES.ERROR_DEFAULT,
                                    time: 2000
                                });
                            });
                        }
                    }

                    // убираем стили перетаскивания с папок
                    dropFolders.removeClass(baseClass + '__item--drop');

                    return false;
                });
            });
        };

        common.init = function() {

            if (!parent.length) return;

            if (objs.length > 0) {
                // навешиваем обработчики перетаскивания
                person.moveEvents();
            }

        };

        return common;
    })();

    DND.lkFolders.init();

});