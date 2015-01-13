/*
 * 模拟滚动条.
 * Copyright (c) 2013, Sina. All rights reserved.
 * Licensed under XXXXX (http://url_of_the_license).
 * Version: 0.9.1
 * @author 钟远 Yuan Zhong  <a href="mailto:zhongyuan2@staff.sina.com.cn">zhongyuan2@staff.sina.com.cn</a>
 *
 * updated log: v0.9.1 14.02.24 修正不可见容器ie8以下报错问题
 * updated log: v1.0.0 14.03.17 增加触屏
 * updated log: v1.0.1 14.03.18 精简代码
 */

var ScrollBar = function(opts) {
	var init = function(opts) {
		this._initConf(opts);
		this._initDoms();
		this._initStates();
		this._initEvents();
		this._launch(opts);
	};
	init.prototype = {
		// utils
		_id: function(id) {
			return document.getElementById(id);
		},
		_class: function(searchClass, node, tag) {
			var classElements = [],
				els, elsLen, pattern;
			if (node == null) node = document.body;
			if (tag == null) tag = '*';
			if (node.getElementsByClassName) {
				return node.getElementsByClassName(searchClass);
			}
			if (node.querySelectorAll) {
				return node.querySelectorAll('.' + searchClass);
			}
			els = node.getElementsByTagName(tag);
			elsLen = els.length;
			pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
			for (i = 0, j = 0; i < elsLen; i++) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		},
		_extend: function(o, t) {
			o = o || {};
			for (var sName in t) {
				o[sName] = t[sName];
			}
			return o;
		},
		_getMousePos: function(e) {
			if (e.pageX || e.pageY) {
				return {
					x: e.pageX,
					y: e.pageY
				};
			}
			if (document.documentElement && document.documentElement.scrollTop) {
				return {
					x: e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
					y: e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
				};
			} else if (document.body) {
				return {
					x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
					y: e.clientY + document.body.scrollTop - document.body.clientTop
				};
			}
		},
		// init
		_initConf: function(opts) {
			this.conf = this._extend({
				wrapId: 'scroll_w',
				dir: 'auto',
				autoFix: false
			}, opts);
		},
		_initDoms: function() {
			var that = this,
				c = this.conf,
				wrap, scroller,
				v_scrollBar, v_sHandle, v_sHandleBd,
				h_scrollBar, h_sHandle, h_sHandleBd;

			wrap = typeof c.wrapId === 'string' ? this._id(c.wrapId) : c.wrapId;
			wrap.style.position = 'relative';
			scroller = wrap.getElementsByTagName('div')[0];
			scroller.style.overflow = 'hidden';

			if (c.dir === 'auto' || c.dir === 'v') {
				v_scrollBar = document.createElement('div');
				v_scrollBar.className = 'scrollbar scrollbar_v';
				v_scrollBar.innerHTML = '\
					<div class="scrollbar_path"></div>\
					<div class="scrollbar_handle">\
						<div class="scrollbar_handle_head"></div>\
						<div class="scrollbar_handle_body"></div>\
						<div class="scrollbar_handle_foot"></div>\
					</div>';
				v_sHandle = this._class('scrollbar_handle', v_scrollBar, 'div')[0];
				v_sHandleBd = this._class('scrollbar_handle_body', v_scrollBar, 'div')[0];
				v_scrollBar.style.display = 'none';
				wrap.appendChild(v_scrollBar);
			}
			if (c.dir === 'auto' || c.dir === 'h') {
				h_scrollBar = document.createElement('div');
				h_scrollBar.className = 'scrollbar scrollbar_h';
				h_scrollBar.innerHTML = '\
					<div class="scrollbar_path"></div>\
					<div class="scrollbar_handle">\
						<div class="scrollbar_handle_head"></div>\
						<div class="scrollbar_handle_foot"></div>\
						<div class="scrollbar_handle_body"></div>\
					</div>';
				h_sHandle = this._class('scrollbar_handle', h_scrollBar, 'div')[0];
				h_sHandleBd = this._class('scrollbar_handle_body', h_scrollBar, 'div')[0];
				h_scrollBar.style.display = 'none';
				wrap.appendChild(h_scrollBar);
			}
			this.doms = {
				wrap: wrap,
				scroller: scroller,
				v_scrollBar: v_scrollBar,
				v_sHandle: v_sHandle,
				v_sHandleBd: v_sHandleBd,
				h_scrollBar: h_scrollBar,
				h_sHandle: h_sHandle,
				h_sHandleBd: h_sHandleBd
			};
		},
		_initStates: function() {
			var that = this,
				c = this.conf,
				d = this.doms;

			this.states = {
				v_total: null,
				v_client: null,
				v_cur: null,
				v_barSize: null,
				v_bar_cur: null,
				h_total: null,
				h_client: null,
				h_cur: null,
				h_barSize: null,
				h_bar_cur: null,
				mouseX: null,
				mouseY: null
			};
			this._refreshStates();
		},
		_initEvents: function() {
			var that = this,
				c = this.conf,
				d = this.doms,
				s = this.states,
				mouseStartX, mouseStartY,
				mouseCurX, mouseCurY,
				barStartX, barStartY,
				dragging = false,
				isVBar = false,
				touchInitPosX, touchInitPosY;

			if (d.v_sHandle) {
				d.v_sHandle.onmouseover = function(e) {
					this.className += ' scrollbar_on';
				};
				d.v_sHandle.onmouseout = function(e) {
					this.className = 'scrollbar_handle';
				};
				d.v_sHandle.onmousedown = function(e) {
					isVBar = true;
					onDown.call(this, e);
				};
			}
			if (d.h_sHandle) {
				d.h_sHandle.onmouseover = function(e) {
					this.className += ' scrollbar_on';
				}
				d.h_sHandle.onmouseout = function(e) {
					this.className = 'scrollbar_handle';
				}
				d.h_sHandle.onmousedown = function(e) {
					isVBar = false;
					onDown.call(this, e);
				}
			}

			if('ontouchstart' in window){
				d.scroller.ontouchstart = onTouchStart;
				d.scroller.ontouchmove = onTouchMove;
				d.scroller.ontouchend = onTouchEnd;
			}

			if ('onmousewheel' in d.scroller) {
				d.scroller.onmousewheel = onMouseWheel;
			} else {
				d.scroller.addEventListener('DOMMouseScroll', onMouseWheel, false);
			}

			function _prevent(e) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
			}

			function onMouseWheel(e) {
				var e = e || window.event,
					delta = 0,
					deltaX = 0,
					deltaY = 0,
					toPosY, toPosX;

				if (dragging) return;

				// Old school scrollwheel delta
				if (e.wheelDelta) {
					delta = e.wheelDelta / 120;
				}
				if (e.detail) {
					delta = -e.detail / 3;
				}

				// New school multidimensional scroll (touchpads) deltas
				deltaY = delta;

				// Gecko
				if (e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS) {
					deltaY = 0;
					deltaX = -1 * delta;
				}

				// Webkit
				if (e.wheelDeltaY !== undefined) {
					deltaY = e.wheelDeltaY / 120;
				}
				if (e.wheelDeltaX !== undefined) {
					deltaX = -1 * e.wheelDeltaX / 120;
				}

				that.refresh();
				if (c.dir === 'auto' || c.dir === 'v') {
					if (delta < 0) {
						if (s.v_bar_cur == s.v_client - s.v_barSize) return;
					} else {
						if (s.v_bar_cur == 0) return;
					}
					_prevent(e);
					toPosY = s.v_bar_cur - delta * (s.v_client - s.v_barSize) / 10;
					d.v_sHandle.style.top = toPosY + 'px';
					s.v_bar_cur = toPosY;
					that.scrollTo(toPosY / (s.v_client - s.v_barSize), true);
				} else if (c.dir === 'h') {
					if (delta < 0) {
						if (s.h_bar_cur == s.h_client - s.h_barSize) return;
					} else {
						if (s.h_bar_cur == 0) return;
					}
					_prevent(e);
					toPosX = s.h_bar_cur - delta * (s.h_client - s.h_barSize) / 10;
					d.h_sHandle.style.left = toPosX + 'px';
					s.h_bar_cur = toPosX;
					that.scrollTo(toPosX / (s.h_client - s.h_barSize), false);
				}

			}

			function onDown(e) {
				var e = e || window.event,
					mousePos = that._getMousePos(e),
					dragEle;

				if (isVBar) {
					dragEle = d.v_sHandle;
					mouseStartY = mousePos.y;
					barStartY = s.v_bar_cur;
					d.v_sHandle.style.cursor = "move";
				} else {
					dragEle = d.h_sHandle;
					mouseStartX = mousePos.x;
					barStartX = s.h_bar_cur;
					d.h_sHandle.style.cursor = "move";
				}

				if (dragEle.setCapture) {
					dragEle.onlosecapture = onUp;
					dragEle.setCapture();
					e.cancelBubble = true;
				} else {
					if (window.captureEvents) {
						e.stopPropagation();
						window.onblur = onUp;
						e.preventDefault();
					}
				}
				dragging = true;
				document.onmousemove = onMove;
				document.onmouseup = onUp;
			}

			function onMove(e) {
				var e = e || window.event,
					mousePos = that._getMousePos(e),
					toPosX, toPosY;
				if (isVBar) {
					mouseCurY = mousePos.y;
					toPosY = barStartY + mouseCurY - mouseStartY;
					if (toPosY < 0) {
						toPosY = 0;
					} else if (toPosY > s.v_client - s.v_barSize) {
						toPosY = s.v_client - s.v_barSize;
					}
					d.v_sHandle.style.top = toPosY + 'px';
					s.v_bar_cur = toPosY;
					that.scrollTo(toPosY / (s.v_client - s.v_barSize), isVBar);
				} else {
					mouseCurX = mousePos.x;
					toPosX = barStartX + mouseCurX - mouseStartX;
					if (toPosX < 0) {
						toPosX = 0;
					} else if (toPosX > s.h_client - s.h_barSize) {
						toPosX = s.h_client - s.h_barSize;
					}
					d.h_sHandle.style.left = toPosX + 'px';
					s.h_bar_cur = toPosX;
					that.scrollTo(toPosX / (s.h_client - s.h_barSize), isVBar);
				}

			}

			function onUp(e) {
				dragging = false;
				if (isVBar) {
					dragEle = d.v_sHandle;
				} else {
					dragEle = d.h_sHandle;
				}
				if (dragEle.releaseCapture) {
					dragEle.onlosecapture = null;
					dragEle.releaseCapture()
				}
				if (window.releaseEvents) {
					window.onblur = null;
				}
				mouseStartX = mouseStartY = null;
				document.onmousemove = null;
				document.onmouseup = null;
			}

			function onTouchStart (e) {
				// document.querySelector('#cl').innerHTML += ' start';
				if(e.touches.length !== 1){return;}

				touchInitPosX = e.touches[0].pageX;
				touchInitPosY = e.touches[0].pageY;
			}
			function onTouchMove (e) {
				var barStartX, barStartY, toPosX, toPosY,
					cX, cY, dX, dY;
				if(e.touches.length !== 1){return;}

				cX = e.touches[0].pageX;
				cY = e.touches[0].pageY;
				dX = cX - touchInitPosX;
				dY = cY - touchInitPosY;
				_prevent(e);

				if (c.dir === 'auto' || c.dir === 'v') {
					barStartY = s.v_bar_cur;
					toPosY = barStartY - (dY / 10);
					if (toPosY < 0) {
						toPosY = 0;
					} else if (toPosY > s.v_client - s.v_barSize) {
						toPosY = s.v_client - s.v_barSize;
					}
					d.v_sHandle.style.top = toPosY + 'px';
					s.v_bar_cur = toPosY;
					that.scrollTo(toPosY / (s.v_client - s.v_barSize), true);
				}
				if (c.dir === 'auto' || c.dir === 'h') {
					barStartX = s.h_bar_cur;
					toPosX = barStartX - (dX / 10);
					if (toPosX < 0) {
						toPosX = 0;
					} else if (toPosX > s.h_client - s.h_barSize) {
						toPosX = s.h_client - s.h_barSize;
					}
					d.h_sHandle.style.left = toPosY + 'px';
					s.h_bar_cur = toPosX;
					that.scrollTo(toPosX / (s.h_client - s.h_barSize), false);
				}
			}
			function onTouchEnd (e) {
				touchInitPosX = touchInitPosY = null;
			}
		},
		_launch: function() {
			var that = this,
				c = this.conf,
				d = this.doms,
				s = this.states;

			this.refresh();
			if (c.autoFix) {
				setInterval(function() {
					that.refresh();
				}, 100);
			}
		},
		_refreshStates: function() {
			var that = this,
				c = this.conf, d = this.doms, s = this.states;

			s.v_total = d.scroller.scrollHeight;
			s.v_client = d.scroller.clientHeight;
			s.v_cur = d.scroller.scrollTop;
			s.h_total = d.scroller.scrollWidth;
			s.h_client = d.scroller.clientWidth;
			s.h_cur = d.scroller.scrollLeft;
		},
		scrollTo: function(posPercent, isVBar) {
			var that = this,
				c = this.conf, d = this.doms, s = this.states;
			if (isVBar) {
				d.scroller.scrollTop = posPercent * (s.v_total - s.v_client);
			} else {
				d.scroller.scrollLeft = posPercent * (s.h_total - s.h_client);
			}
			this.refresh();
		},
		refresh: function() {
			var that = this,
				c = this.conf,
				d = this.doms,
				s = this.states;

			this._refreshStates();

			// 总长或总宽为0, 通常原因为dom不可见, 不需要刷新
			if (s.v_total == 0 || s.v_total == 0){ return };

			if (c.dir === 'auto' || c.dir === 'v') {
				s.v_barSize = s.v_client * s.v_client / s.v_total;
				s.v_bar_cur = (s.v_client - s.v_barSize) * s.v_cur / (s.v_total - s.v_client);
				d.v_scrollBar.style.height = s.v_client + 'px';
				d.v_sHandle.style.height = s.v_client * s.v_client / s.v_total + 'px';
				d.v_sHandleBd.style.height = s.v_client * s.v_client / s.v_total - 4 + 'px';
				d.v_sHandle.style.top = s.v_bar_cur + 'px';
				if (s.v_client < s.v_total) {
					d.v_scrollBar.style.display = 'block';
				} else {
					d.v_scrollBar.style.display = 'none';
				}
			}
			if (c.dir === 'auto' || c.dir === 'h') {
				s.h_barSize = s.h_client * s.h_client / s.h_total;
				s.h_bar_cur = (s.h_client - s.h_barSize) * s.h_cur / (s.h_total - s.h_client);
				d.h_scrollBar.style.width = s.h_client + 'px';
				d.h_sHandle.style.width = s.h_client * s.h_client / s.h_total + 'px';
				d.h_sHandleBd.style.width = s.h_client * s.h_client / s.h_total - 4 + 'px';
				d.h_sHandle.style.left = s.h_bar_cur + 'px';
				if (s.h_client < s.h_total) {
					d.h_scrollBar.style.display = 'block';
				} else {
					d.h_scrollBar.style.display = 'none';
				}
			}
		}
	};
	return init;
}();