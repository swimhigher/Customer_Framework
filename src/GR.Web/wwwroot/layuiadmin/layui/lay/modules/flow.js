/** layui-v2.3.0 MIT License By https://www.layui.com */
; layui.define("jquery", function (e) { "use strict"; var l = layui.$, o = function (e) { }, t = '<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon ">&#xe63e;</i>'; o.prototype.load = function (e) { var o, i, n, r, a = this, c = 0; e = e || {}; var f = l(e.elem); if (f[0]) { var m = l(e.scrollElem || document), u = e.mb || 50, s = !("isAuto" in e) || e.isAuto, v = e.end || "没有更多了", y = e.scrollElem && e.scrollElem !== document, d = "<cite>加载更多</cite>", h = l('<div class="layui-flow-more"><a href="javascript:;">' + d + "</a></div>"); f.find(".layui-flow-more")[0] || f.append(h); var p = function (e, t) { e = l(e), h.before(e), t = 0 == t || null, t ? h.html(v) : h.find("a").html(d), i = t, o = null, n && n() }, g = function () { o = !0, h.find("a").html(t), "function" == typeof e.done && e.done(++c, p) }; if (g(), h.find("a").on("click", function () { l(this); i || o || g() }), e.isLazyimg) var n = a.lazyimg({ elem: e.elem + " img", scrollElem: e.scrollElem }); return s ? (m.on("scroll", function () { var e = l(this), t = e.scrollTop(); r && clearTimeout(r), i || (r = setTimeout(function () { var i = y ? e.height() : l(window).height(), n = y ? e.prop("scrollHeight") : document.documentElement.scrollHeight; n - t - i <= u && (o || g()) }, 100)) }), a) : a } }, o.prototype.lazyimg = function (e) { var o, t = this, i = 0; e = e || {}; var n = l(e.scrollElem || document), r = e.elem || "img", a = e.scrollElem && e.scrollElem !== document, c = function (e, l) { var o = n.scrollTop(), r = o + l, c = a ? function () { return e.offset().top - n.offset().top + o }() : e.offset().top; if (c >= o && c <= r && !e.attr("src")) { var m = e.attr("lay-src"); layui.img(m, function () { var l = t.lazyimg.elem.eq(i); e.attr("src", m).removeAttr("lay-src"), l[0] && f(l), i++ }) } }, f = function (e, o) { var f = a ? (o || n).height() : l(window).height(), m = n.scrollTop(), u = m + f; if (t.lazyimg.elem = l(r), e) c(e, f); else for (var s = 0; s < t.lazyimg.elem.length; s++) { var v = t.lazyimg.elem.eq(s), y = a ? function () { return v.offset().top - n.offset().top + m }() : v.offset().top; if (c(v, f), i = s, y > u) break } }; if (f(), !o) { var m; n.on("scroll", function () { var e = l(this); m && clearTimeout(m), m = setTimeout(function () { f(null, e) }, 50) }), o = !0 } return f }, e("flow", new o) });