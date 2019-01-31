/* *******************************
* ********************************/
;(function ($) {
	var jqTreeView = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, this.defaults, options);
		let $this = this;
		$(this.$element).empty();
		$(this.$element).addClass("jqTreeView");
		// 初始化
		var $treeView = '<ul class="rootView-ul ' + $this.options.contextStyle + '"></ul>';
		this.$element.append($treeView);
		// 注册事件
		// 点击子菜单
		$(this.$element).find(".rootView-ul").on("click", ".subView-ul > li.viewItem-li", function () {
			$(this).siblings().removeClass($this.options.activeItemStyle);
			$(this).addClass($this.options.activeItemStyle);
			var name = $(this).find('.itemLabel-a').text();
			var url = $(this).data('url');
			$this.options.click(name, url);
			return false;
		});
		// 打开父菜单
		$(this.$element).find(".rootView-ul").on("click", "li.viewItem-li", function () {
			if ($(this).hasClass('active')) {
				$(this).removeClass("active");
				return false;
			}
			$(this).siblings('.active').children('ul').children('li.viewItem-li.' + $this.options.activeItemStyle).removeClass($this.options.activeItemStyle);
			$(this).siblings('.active').removeClass("active");
			$(this).addClass('active');
			return false;
		});
		// 鼠标经过
		$(this.$element).find('.rootView-ul').on('mouseenter', '.subView-ul > li.viewItem-li', function () {
			$(this).addClass($this.options.hoverStyle);
		});
		$(this.$element).find('.rootView-ul').on('mouseleave', '.subView-ul > li.viewItem-li', function () {
			$(this).removeClass($this.options.hoverStyle);
		});
		$('.jqTreeView').tooltip({ show: { effect: "blind", duration: 100,delay:1000 } });
	};
	jqTreeView.prototype = {
		defaults: {
			click: $.noop,
			rightIcon: "ui-icon ui-icon-caret-1-w",
			parItemStyle: "ui-widget-header", // ui-widget-header
			activeItemStyle: "ui-state-active",
			contextStyle: "ui-widget-content",
			hoverStyle: "ui-state-hover"
		},
		addTree: function (name, url, id, pId, icon, active) {
			var node = '';
			if (!pId || pId == 0) { // 添加父节点
				// 去重复
				if (this.$element.find('.rootView-ul > li.viewItem-li[data-id="' + id + '"]') > 0) {
					return;
				}
				node += '<li class="viewItem-li '  + (active ? " active" : "") + '" data-id="' + id + '">\
							<a class="itemLabel-a '  + this.options.parItemStyle + '" href="javascript:void(0);" title="' + name + '">\
								<i class="itemIcon-i ' + icon + '"></i>\
								<span>' + name + '</span>\
								<i class="itemIcon-i itemIconRight-i ' + this.options.rightIcon + '"></i>\
							</a>\
							<ul class="subView-ul  ' + this.options.contextStyle + '"></ul>\
						</li>';
				this.$element.find('.rootView-ul').append(node);
			} else {
				var $parent = this.$element.find('.rootView-ul > li.viewItem-li[data-id="' + pId + '"]');
				if ($parent.children('ul.subView-ul').children('li.viewItem-li [data-id="' + id + '"]') > 0) { // 去重复
					return;
				}
				node += '<li class="viewItem-li" data-id="' + id + '" data-url="' + url + '">\
							<a class="itemLabel-a" href="javascript:void(0);" title="'+ name + '">\
							<i class="itemIcon-i ' + icon + '"></i><span>' + name + '</span></a></li>';
				$parent.find('ul.subView-ul').append(node);
			}
		},
		collapseTreeView:function () {
			let el = this.$element.find('.rootView-ul');
			if(el.hasClass('treeView-collapse')){
				el.removeClass('treeView-collapse');
			}else{
				el.addClass('treeView-collapse');
			}
		}
	};
	var private_methods = {};
	$.fn.jqTreeView = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('cc.jqTreeView');
			var options = typeof option == 'object' && option;
			// 如果没有初始化过, 就初始化它
			// 如果该元素没有初始化过(可能是新添加的元素), 就初始化它.
			if (!data) $this.data('cc.jqTreeView', (data = new jqTreeView(this, options)));
			// 调用方法
			if (typeof option === "string" && typeof data[option] == "function") {
				// 执行插件的方法
				data[option].apply(data, args);
			}
		});
	};
	$.fn.jqTreeView.Constructor = jqTreeView;
})(jQuery);