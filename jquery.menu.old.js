var MainMenu = function () {

    var activated = false;

    var settings = {
        disabledClass: 'disabled',
        submenuClass: 'submenu'
    }

    var mask = '<div id="menu-top-mask" style="height: 2px; background-color: #fff; z-index:1001;"/>';

    this.init = function (p) {

        $.extend(settings, p);

        $mask = $('#menu-top-mask');

        $('ul.main-menu > li').click(function (event) {

            var target = $(event.target);
            if (target.hasClass(settings.disabledClass) || target.parents().hasClass(settings.disabledClass) || target.hasClass(settings.submenuClass)) {
                return;
            }

            toggleMenuItem($(this));
        });

        $('ul.main-menu > li').mouseenter(function () {
            if (activated && $(this).hasClass('active-menu') == false) {
                toggleMenuItem($(this));
            }
        });

        $('ul.main-menu > li > ul li').mouseenter(function () {
            if ($(this).children().size() > 0) {
                toggleSubMenu($(this));
            }
        });

        $('ul.main-menu > li > ul li').each(function () {
            if ($(this).children('ul').size() > 0) {
                $(this).addClass(settings.submenuClass);
            }
        });

        $('ul.main-menu li.' + settings.disabledClass).bind('click', function (e) {
            e.preventDefault();
        });

        toggleMenuItem = function (el) {

            $('#menu-top-mask').remove();

            var submenu = el.find("ul:first");
            var top = parseInt(el.css('padding-bottom').replace("px", ""), 10) + parseInt(el.css('padding-top').replace("px", ""), 10) +
                        el.position().top +
                        el.height();

            submenu.prepend($(mask));
            var $mask = $('#menu-top-mask');
            var maskWidth = el.width() +
                            parseInt(el.css('padding-left').replace("px", ""), 10) +
                            parseInt(el.css('padding-right').replace("px", ""), 10);

            $mask.css({ position: 'absolute',
                top: '-1px',
                width: (maskWidth) + 'px'
            });

            submenu.css({
                position: 'absolute',
                top: top + 'px',
                left: el.offset().left + 'px',
                zIndex: 100
            });

            submenu.stop().toggle();
            activated = submenu.is(":hidden") == false;

            !activated ? el.removeClass('active-menu') : el.addClass('active-menu');

            if (activated) {
                $('.active-menu').each(function () {
                    if ($(this).offset().left != el.offset().left) {
                        $(this).removeClass('active-menu');
                        $(this).find("ul:first").hide();
                    }
                });
            }
        }

        toggleSubMenu = function (el) {
            var submenu = el.find("ul:first");
            var paddingLeft = parseInt(el.css('padding-right').replace('px', ''), 10);
            var borderTop = parseInt(el.css('border-top-width').replace("px", ""), 10);
            borderTop = !isNaN(borderTop) ? borderTop : 1;
            var top = el.position().top - borderTop;

            submenu.css({
                position: 'absolute',
                top: top + 'px',
                left: el.width() + paddingLeft + 'px',
                zIndex: 1000
            });

            submenu.addClass('active-sub-menu');

            submenu.toggle();

            el.mouseleave(function () {
                submenu.hide();
            });
        }

        closeMainMenu = function () {
            activated = false;
            $('.active-menu').find("ul:first").hide();
            $('.active-menu').removeClass('active-menu');
            $('.active-sub-menu').hide();
        };

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                closeMainMenu();
            }
        });

        $(document).bind('click', function (event) {
            var target = $(event.target);
            if (!target.hasClass('active-menu') && !target.parents().hasClass('active-menu')) {
                closeMainMenu();
            }
        });
    }
}

$(document).ready(function () {
    new MainMenu().init();
});