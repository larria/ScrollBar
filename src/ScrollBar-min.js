var ScrollBar=function(e){var l=function(e){this._initConf(e);this._initDoms();this._initStates();this._initEvents();this._launch(e)};l.prototype={_id:function(e){return document.getElementById(e)},_class:function(e,l,t){var s=[],n,r,o;if(l==null)l=document.body;if(t==null)t="*";if(l.getElementsByClassName){return l.getElementsByClassName(e)}if(l.querySelectorAll){return l.querySelectorAll("."+e)}n=l.getElementsByTagName(t);r=n.length;o=new RegExp("(^|\\s)"+e+"(\\s|$)");for(i=0,j=0;i<r;i++){if(o.test(n[i].className)){s[j]=n[i];j++}}return s},_extend:function(e,l){e=e||{};for(var t in l){e[t]=l[t]}return e},_getMousePos:function(e){if(e.pageX||e.pageY){return{x:e.pageX,y:e.pageY}}if(document.documentElement&&document.documentElement.scrollTop){return{x:e.clientX+document.documentElement.scrollLeft-document.documentElement.clientLeft,y:e.clientY+document.documentElement.scrollTop-document.documentElement.clientTop}}else if(document.body){return{x:e.clientX+document.body.scrollLeft-document.body.clientLeft,y:e.clientY+document.body.scrollTop-document.body.clientTop}}},_initConf:function(e){this.conf=this._extend({wrapId:"scroll_w",dir:"auto",autoFix:false},e)},_initDoms:function(){var e=this,l=this.conf,t,s,n,i,r,o,a,c;t=typeof l.wrapId==="string"?this._id(l.wrapId):l.wrapId;t.style.position="relative";s=t.getElementsByTagName("div")[0];s.style.overflow="hidden";if(l.dir==="auto"||l.dir==="v"){n=document.createElement("div");n.className="scrollbar scrollbar_v";n.innerHTML='					<div class="scrollbar_path"></div>					<div class="scrollbar_handle">						<div class="scrollbar_handle_head"></div>						<div class="scrollbar_handle_body"></div>						<div class="scrollbar_handle_foot"></div>					</div>';i=this._class("scrollbar_handle",n,"div")[0];r=this._class("scrollbar_handle_body",n,"div")[0];n.style.display="none";t.appendChild(n)}if(l.dir==="auto"||l.dir==="h"){o=document.createElement("div");o.className="scrollbar scrollbar_h";o.innerHTML='					<div class="scrollbar_path"></div>					<div class="scrollbar_handle">						<div class="scrollbar_handle_head"></div>						<div class="scrollbar_handle_foot"></div>						<div class="scrollbar_handle_body"></div>					</div>';a=this._class("scrollbar_handle",o,"div")[0];c=this._class("scrollbar_handle_body",o,"div")[0];o.style.display="none";t.appendChild(o)}this.doms={wrap:t,scroller:s,v_scrollBar:n,v_sHandle:i,v_sHandleBd:r,h_scrollBar:o,h_sHandle:a,h_sHandleBd:c}},_initStates:function(){var e=this,l=this.conf,t=this.doms;this.states={v_total:null,v_client:null,v_cur:null,v_barSize:null,v_bar_cur:null,h_total:null,h_client:null,h_cur:null,h_barSize:null,h_bar_cur:null,mouseX:null,mouseY:null};this._refreshStates()},_initEvents:function(){var e=this,l=this.conf,t=this.doms,s=this.states,n,i,r,o,a,c,_=false,h=false,u,d;if(t.v_sHandle){t.v_sHandle.onmouseover=function(e){this.className+=" scrollbar_on"};t.v_sHandle.onmouseout=function(e){this.className="scrollbar_handle"};t.v_sHandle.onmousedown=function(e){h=true;b.call(this,e)}}if(t.h_sHandle){t.h_sHandle.onmouseover=function(e){this.className+=" scrollbar_on"};t.h_sHandle.onmouseout=function(e){this.className="scrollbar_handle"};t.h_sHandle.onmousedown=function(e){h=false;b.call(this,e)}}if("ontouchstart"in window){t.scroller.ontouchstart=y;t.scroller.ontouchmove=w;t.scroller.ontouchend=H}if("onmousewheel"in t.scroller){t.scroller.onmousewheel=f}else{t.scroller.addEventListener("DOMMouseScroll",f,false)}function v(e){if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}}function f(n){var n=n||window.event,i=0,r=0,o=0,a,c;if(_)return;if(n.wheelDelta){i=n.wheelDelta/120}if(n.detail){i=-n.detail/3}o=i;if(n.axis!==undefined&&n.axis===n.HORIZONTAL_AXIS){o=0;r=-1*i}if(n.wheelDeltaY!==undefined){o=n.wheelDeltaY/120}if(n.wheelDeltaX!==undefined){r=-1*n.wheelDeltaX/120}e.refresh();if(l.dir==="auto"||l.dir==="v"){if(i<0){if(s.v_bar_cur==s.v_client-s.v_barSize)return}else{if(s.v_bar_cur==0)return}v(n);a=s.v_bar_cur-i*(s.v_client-s.v_barSize)/10;t.v_sHandle.style.top=a+"px";s.v_bar_cur=a;e.scrollTo(a/(s.v_client-s.v_barSize),true)}else if(l.dir==="h"){if(i<0){if(s.h_bar_cur==s.h_client-s.h_barSize)return}else{if(s.h_bar_cur==0)return}v(n);c=s.h_bar_cur-i*(s.h_client-s.h_barSize)/10;t.h_sHandle.style.left=c+"px";s.h_bar_cur=c;e.scrollTo(c/(s.h_client-s.h_barSize),false)}}function b(l){var l=l||window.event,r=e._getMousePos(l),o;if(h){o=t.v_sHandle;i=r.y;c=s.v_bar_cur;t.v_sHandle.style.cursor="move"}else{o=t.h_sHandle;n=r.x;a=s.h_bar_cur;t.h_sHandle.style.cursor="move"}if(o.setCapture){o.onlosecapture=p;o.setCapture();l.cancelBubble=true}else{if(window.captureEvents){l.stopPropagation();window.onblur=p;l.preventDefault()}}_=true;document.onmousemove=m;document.onmouseup=p}function m(l){var l=l||window.event,_=e._getMousePos(l),u,d;if(h){o=_.y;d=c+o-i;if(d<0){d=0}else if(d>s.v_client-s.v_barSize){d=s.v_client-s.v_barSize}t.v_sHandle.style.top=d+"px";s.v_bar_cur=d;e.scrollTo(d/(s.v_client-s.v_barSize),h)}else{r=_.x;u=a+r-n;if(u<0){u=0}else if(u>s.h_client-s.h_barSize){u=s.h_client-s.h_barSize}t.h_sHandle.style.left=u+"px";s.h_bar_cur=u;e.scrollTo(u/(s.h_client-s.h_barSize),h)}}function p(e){_=false;if(h){dragEle=t.v_sHandle}else{dragEle=t.h_sHandle}if(dragEle.releaseCapture){dragEle.onlosecapture=null;dragEle.releaseCapture()}if(window.releaseEvents){window.onblur=null}n=i=null;document.onmousemove=null;document.onmouseup=null}function y(e){if(e.touches.length!==1){return}u=e.touches[0].pageX;d=e.touches[0].pageY}function w(n){var i,r,o,a,c,_,h,f;if(n.touches.length!==1){return}c=n.touches[0].pageX;_=n.touches[0].pageY;h=c-u;f=_-d;v(n);if(l.dir==="auto"||l.dir==="v"){r=s.v_bar_cur;a=r-f/10;if(a<0){a=0}else if(a>s.v_client-s.v_barSize){a=s.v_client-s.v_barSize}t.v_sHandle.style.top=a+"px";s.v_bar_cur=a;e.scrollTo(a/(s.v_client-s.v_barSize),true)}if(l.dir==="auto"||l.dir==="h"){i=s.h_bar_cur;o=i-h/10;if(o<0){o=0}else if(o>s.h_client-s.h_barSize){o=s.h_client-s.h_barSize}t.h_sHandle.style.left=a+"px";s.h_bar_cur=o;e.scrollTo(o/(s.h_client-s.h_barSize),false)}}function H(e){u=d=null}},_launch:function(){var e=this,l=this.conf,t=this.doms,s=this.states;this.refresh();if(l.autoFix){setInterval(function(){e.refresh()},100)}},_refreshStates:function(){var e=this,l=this.conf,t=this.doms,s=this.states;s.v_total=t.scroller.scrollHeight;s.v_client=t.scroller.clientHeight;s.v_cur=t.scroller.scrollTop;s.h_total=t.scroller.scrollWidth;s.h_client=t.scroller.clientWidth;s.h_cur=t.scroller.scrollLeft},scrollTo:function(e,l){var t=this,s=this.conf,n=this.doms,i=this.states;if(l){n.scroller.scrollTop=e*(i.v_total-i.v_client)}else{n.scroller.scrollLeft=e*(i.h_total-i.h_client)}this.refresh()},refresh:function(){var e=this,l=this.conf,t=this.doms,s=this.states;this._refreshStates();if(s.v_total==0||s.v_total==0){return}if(l.dir==="auto"||l.dir==="v"){s.v_barSize=s.v_client*s.v_client/s.v_total;s.v_bar_cur=(s.v_client-s.v_barSize)*s.v_cur/(s.v_total-s.v_client);t.v_scrollBar.style.height=s.v_client+"px";t.v_sHandle.style.height=s.v_client*s.v_client/s.v_total+"px";t.v_sHandleBd.style.height=s.v_client*s.v_client/s.v_total-4+"px";t.v_sHandle.style.top=s.v_bar_cur+"px";if(s.v_client<s.v_total){t.v_scrollBar.style.display="block"}else{t.v_scrollBar.style.display="none"}}if(l.dir==="auto"||l.dir==="h"){s.h_barSize=s.h_client*s.h_client/s.h_total;s.h_bar_cur=(s.h_client-s.h_barSize)*s.h_cur/(s.h_total-s.h_client);t.h_scrollBar.style.width=s.h_client+"px";t.h_sHandle.style.width=s.h_client*s.h_client/s.h_total+"px";t.h_sHandleBd.style.width=s.h_client*s.h_client/s.h_total-4+"px";t.h_sHandle.style.left=s.h_bar_cur+"px";if(s.h_client<s.h_total){t.h_scrollBar.style.display="block"}else{t.h_scrollBar.style.display="none"}}}};return l}();