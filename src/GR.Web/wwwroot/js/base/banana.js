/*!
 * banana javascript library v1.7
 * based on the jquery
 * https://github.com/cnzhangw/banana
 * date: 2015-05-04
 * author:zhangwei
 */
(function (factory) {
    var root = this;
    var count = 5;//检测5次
    var handler;
    var todo = function () {
        var $ = root.jQuery || root.top.jQuery || root.Zepto || root.top.Zepto;
        if (!$) {
            if (count > 0) {
                count--;
                handler = setTimeout(function () {
                    todo();
                }, count > 0 ? 1000 : 5000);//最后一次放宽检测时间间隔
            } else {
                if (handler && handler > 0) { clearTimeout(handler); }
                throw 'banana requires jquery or zepto';
            }
        } else {
            if (handler && handler > 0) { clearTimeout(handler); }
            factory.call(root, $);
        }
    };
    todo();
}).call(window, function ($) {
    //(function () {
    //        // 备份jquery的ajax方法
    //        var _ajax = $.ajax;
    //        // 重写ajax方法
    //        $.ajax = function (opt) {
    //            var _success = opt && opt.success || function (a, b) { };
    //            var _error = opt && opt.error || function (a, b) { };
    //            var _opt = $.extend(opt, {
    //                success: function (data, textStatus) {
    //                    if (data.indexOf('html') != -1) {
    //                        location.reload();
    //                        return;
    //                    }
    //                    _success(data, textStatus);
    //                },
    //                error: function (data, textStatus) {
    //                    if (data.responseText.indexOf('html') != -1) {
    //                        location.reload();
    //                        return;
    //                    }
    //                    _error(data, textStatus);
    //                }
    //            });
    //            return _ajax(_opt);
    //        }
    //    })();

    var root = this; // window
    var core = root.banana || {}; // namespace
    core.name = 'banana';
    core.version = 'v1.7 banana，朋友们都说好。';
    var DEBUG = false;

    //#region banana.constant

    core.constant = {
        COMMAND_KEY: 'banana-cmd' //事件绑定标记
        , COMMAND_ARGS: 'banana-args' //事件绑定参数标记
        , FUNCTION_COMMAND_TRIGGER: 'buttonClick' //事件触发函数
        , FUNCTION_STARTUP: 'startup' //页面启动函数
        , FUNCTION_RESIZE: 'resize' //页面resize函数
        , DEVICE: {
            PC: 'pc'
            , IPAD: 'ipad'
        },
        KEY_SYSVER: 'sysver'
        , SPACE_STATE_KEY: 'space-state'
    };

    //#endregion

    //#region banana.g

    var Global = function (win) {
        /// <summary>
        /// 全局对象，单例
        /// </summary>
        var inited = false;
        win = win || root;
        var _init = function () {
            if (inited) return;
            _library().initMustache();
            _library().initEnumerable();
            _library().initBase64();
            inited = true;
        };
        var _library = function () {
            /// <summary>
            /// 第三方库
            /// </summary>
            var _mustache = function () {
                if (win.Mustache) return;
                //#region mustache
                (function (k, p) { "object" === typeof exports && exports ? p(exports) : "function" === typeof define && define.amd ? define(["exports"], p) : (k.Mustache = {}, p(Mustache)) })(win, function (k) {
                    function p(a) { return "function" === typeof a } function y(a) { return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") } function A(a, c) { return null != a && "object" === typeof a && c in a } function C(a, c) {
                        function b(a) {
                            "string" === typeof a && (a = a.split(D, 2)); if (!x(a) || 2 !== a.length) throw Error("Invalid tags: " + a); m = new RegExp(y(a[0]) + "\\s*"); v = new RegExp("\\s*" +
                                y(a[1])); p = new RegExp("\\s*" + y("}" + a[1]))
                        } if (!a) return []; var d = [], e = [], g = [], h = !1, f = !1, m, v, p; b(c || k.tags); for (var n = new w(a), r, l, q, u; !n.eos();) {
                            r = n.pos; if (q = n.scanUntil(m)) { u = 0; for (var t = q.length; u < t; ++u) if (l = q.charAt(u), E.call(F, l) ? f = !0 : g.push(e.length), e.push(["text", l, r, r + 1]), r += 1, "\n" === l) { if (h && !f) for (; g.length;) delete e[g.pop()]; else g = []; f = h = !1 } } if (!n.scan(m)) break; h = !0; l = n.scan(G) || "name"; n.scan(H); "=" === l ? (q = n.scanUntil(B), n.scan(B), n.scanUntil(v)) : "{" === l ? (q = n.scanUntil(p), n.scan(I), n.scanUntil(v),
                                l = "&") : q = n.scanUntil(v); if (!n.scan(v)) throw Error("Unclosed tag at " + n.pos); u = [l, q, r, n.pos]; e.push(u); if ("#" === l || "^" === l) d.push(u); else if ("/" === l) { l = d.pop(); if (!l) throw Error('Unopened section "' + q + '" at ' + r); if (l[1] !== q) throw Error('Unclosed section "' + l[1] + '" at ' + r); } else "name" === l || "{" === l || "&" === l ? f = !0 : "=" === l && b(q)
                        } if (l = d.pop()) throw Error('Unclosed section "' + l[1] + '" at ' + n.pos); return J(K(e))
                    } function K(a) {
                        for (var c = [], b, d, e = 0, g = a.length; e < g; ++e) if (b = a[e]) "text" === b[0] && d && "text" === d[0] ?
                            (d[1] += b[1], d[3] = b[3]) : (c.push(b), d = b); return c
                    } function J(a) { for (var c = [], b = c, d = [], e, g = 0, h = a.length; g < h; ++g) switch (e = a[g], e[0]) { case "#": case "^": b.push(e); d.push(e); b = e[4] = []; break; case "/": b = d.pop(); b[5] = e[2]; b = 0 < d.length ? d[d.length - 1][4] : c; break; default: b.push(e) } return c } function w(a) { this.tail = this.string = a; this.pos = 0 } function t(a, c) { this.view = a; this.cache = { ".": this.view }; this.parent = c } function m() { this.cache = {} } var L = Object.prototype.toString, x = Array.isArray || function (a) {
                        return "[object Array]" ===
                            L.call(a)
                    }, E = RegExp.prototype.test, F = /\S/, M = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;" }, H = /\s*/, D = /\s+/, B = /\s*=/, I = /\s*\}/, G = /#|\^|\/|>|\{|&|=|!/; w.prototype.eos = function () { return "" === this.tail }; w.prototype.scan = function (a) { a = this.tail.match(a); if (!a || 0 !== a.index) return ""; a = a[0]; this.tail = this.tail.substring(a.length); this.pos += a.length; return a }; w.prototype.scanUntil = function (a) {
                        a = this.tail.search(a); var c; switch (a) {
                            case -1: c = this.tail; this.tail = ""; break; case 0: c = "";
                                break; default: c = this.tail.substring(0, a), this.tail = this.tail.substring(a)
                        } this.pos += c.length; return c
                    }; t.prototype.push = function (a) { return new t(a, this) }; t.prototype.lookup = function (a) { var c = this.cache, b; if (c.hasOwnProperty(a)) b = c[a]; else { for (var d = this, e, g, h = !1; d;) { if (0 < a.indexOf(".")) for (b = d.view, e = a.split("."), g = 0; null != b && g < e.length;) g === e.length - 1 && (h = A(b, e[g])), b = b[e[g++]]; else b = d.view[a], h = A(d.view, a); if (h) break; d = d.parent } c[a] = b } p(b) && (b = b.call(this.view)); return b }; m.prototype.clearCache =
                        function () { this.cache = {} }; m.prototype.parse = function (a, c) { var b = this.cache, d = b[a]; null == d && (d = b[a] = C(a, c)); return d }; m.prototype.render = function (a, c, b) { var d = this.parse(a); c = c instanceof t ? c : new t(c); return this.renderTokens(d, c, b, a) }; m.prototype.renderTokens = function (a, c, b, d) {
                            for (var e = "", g, h, f, k = 0, m = a.length; k < m; ++k) f = void 0, g = a[k], h = g[0], "#" === h ? f = this.renderSection(g, c, b, d) : "^" === h ? f = this.renderInverted(g, c, b, d) : ">" === h ? f = this.renderPartial(g, c, b, d) : "&" === h ? f = this.unescapedValue(g, c) : "name" ===
                                h ? f = this.escapedValue(g, c) : "text" === h && (f = this.rawValue(g)), void 0 !== f && (e += f); return e
                        }; m.prototype.renderSection = function (a, c, b, d) {
                            function e(a) { return g.render(a, c, b) } var g = this, h = "", f = c.lookup(a[1]); if (f) {
                                if (x(f)) for (var k = 0, m = f.length; k < m; ++k) h += this.renderTokens(a[4], c.push(f[k]), b, d); else if ("object" === typeof f || "string" === typeof f || "number" === typeof f) h += this.renderTokens(a[4], c.push(f), b, d); else if (p(f)) {
                                    if ("string" !== typeof d) throw Error("Cannot use higher-order sections without the original template");
                                    f = f.call(c.view, d.slice(a[3], a[5]), e); null != f && (h += f)
                                } else h += this.renderTokens(a[4], c, b, d); return h
                            }
                        }; m.prototype.renderInverted = function (a, c, b, d) { var e = c.lookup(a[1]); if (!e || x(e) && 0 === e.length) return this.renderTokens(a[4], c, b, d) }; m.prototype.renderPartial = function (a, c, b) { if (b && (a = p(b) ? b(a[1]) : b[a[1]], null != a)) return this.renderTokens(this.parse(a), c, b, a) }; m.prototype.unescapedValue = function (a, c) { var b = c.lookup(a[1]); if (null != b) return b }; m.prototype.escapedValue = function (a, c) {
                            var b = c.lookup(a[1]);
                            if (null != b) return k.escape(b)
                        }; m.prototype.rawValue = function (a) { return a[1] }; k.name = "mustache.js"; k.version = "2.1.2"; k.tags = ["{{", "}}"]; var z = new m; k.clearCache = function () { return z.clearCache() }; k.parse = function (a, c) { return z.parse(a, c) }; k.render = function (a, c, b) { if ("string" !== typeof a) throw c = TypeError, a = x(a) ? "array" : typeof a, new c('Invalid template! Template should be a "string" but "' + a + '" was given as the first argument for mustache#render(template, view, partials)'); return z.render(a, c, b) }; k.to_html =
                            function (a, c, b, d) { a = k.render(a, c, b); if (p(d)) d(a); else return a }; k.escape = function (a) { return String(a).replace(/[&<>"'\/]/g, function (a) { return M[a] }) }; k.Scanner = w; k.Context = t; k.Writer = m
                });
                //#endregion
            };
            var _enumerable = function () {
                //#region enumerable
                win.Enumerable = function () {
                    var e = function (a) { this.GetEnumerator = a }; e.Choice = function () { var a = arguments[0] instanceof Array ? arguments[0] : arguments; return new e(function () { return new h(k.Blank, function () { return this.Yield(a[Math.floor(Math.random() * a.length)]) }, k.Blank) }) }; e.Cycle = function () { var a = arguments[0] instanceof Array ? arguments[0] : arguments; return new e(function () { var b = 0; return new h(k.Blank, function () { b >= a.length && (b = 0); return this.Yield(a[b++]) }, k.Blank) }) }; e.Empty = function () {
                        return new e(function () {
                            return new h(k.Blank,
                                function () { return !1 }, k.Blank)
                        })
                    }; e.From = function (a) {
                        if (null == a) return e.Empty(); if (a instanceof e) return a; if (typeof a == q.Number || typeof a == q.Boolean) return e.Repeat(a, 1); if (typeof a == q.String) return new e(function () { var b = 0; return new h(k.Blank, function () { return b < a.length ? this.Yield(a.charAt(b++)) : !1 }, k.Blank) }); if (typeof a != q.Function) {
                            if (typeof a.length == q.Number) return new l(a); if (!(a instanceof Object) && f.IsIEnumerable(a)) return new e(function () {
                                var b = !0, c; return new h(function () { c = new Enumerator(a) },
                                    function () { b ? b = !1 : c.moveNext(); return c.atEnd() ? !1 : this.Yield(c.item()) }, k.Blank)
                            })
                        } return new e(function () { var b = [], c = 0; return new h(function () { for (var c in a) a[c] instanceof Function || b.push({ Key: c, Value: a[c] }) }, function () { return c < b.length ? this.Yield(b[c++]) : !1 }, k.Blank) })
                    }; e.Return = function (a) { return e.Repeat(a, 1) }; e.Matches = function (a, b, c) {
                        null == c && (c = ""); b instanceof RegExp && (c += b.ignoreCase ? "i" : "", c += b.multiline ? "m" : "", b = b.source); -1 === c.indexOf("g") && (c += "g"); return new e(function () {
                            var d;
                            return new h(function () { d = new RegExp(b, c) }, function () { var b = d.exec(a); return b ? this.Yield(b) : !1 }, k.Blank)
                        })
                    }; e.Range = function (a, b, c) { null == c && (c = 1); return e.ToInfinity(a, c).Take(b) }; e.RangeDown = function (a, b, c) { null == c && (c = 1); return e.ToNegativeInfinity(a, c).Take(b) }; e.RangeTo = function (a, b, c) { null == c && (c = 1); return a < b ? e.ToInfinity(a, c).TakeWhile(function (a) { return a <= b }) : e.ToNegativeInfinity(a, c).TakeWhile(function (a) { return a >= b }) }; e.Repeat = function (a, b) {
                        return null != b ? e.Repeat(a).Take(b) : new e(function () {
                            return new h(k.Blank,
                                function () { return this.Yield(a) }, k.Blank)
                        })
                    }; e.RepeatWithFinalize = function (a, b) { a = f.CreateLambda(a); b = f.CreateLambda(b); return new e(function () { var c; return new h(function () { c = a() }, function () { return this.Yield(c) }, function () { null != c && (b(c), c = null) }) }) }; e.Generate = function (a, b) { if (null != b) return e.Generate(a).Take(b); a = f.CreateLambda(a); return new e(function () { return new h(k.Blank, function () { return this.Yield(a()) }, k.Blank) }) }; e.ToInfinity = function (a, b) {
                        null == a && (a = 0); null == b && (b = 1); return new e(function () {
                            var c;
                            return new h(function () { c = a - b }, function () { return this.Yield(c += b) }, k.Blank)
                        })
                    }; e.ToNegativeInfinity = function (a, b) { null == a && (a = 0); null == b && (b = 1); return new e(function () { var c; return new h(function () { c = a + b }, function () { return this.Yield(c -= b) }, k.Blank) }) }; e.Unfold = function (a, b) { b = f.CreateLambda(b); return new e(function () { var c = !0, d; return new h(k.Blank, function () { if (c) return c = !1, d = a, this.Yield(d); d = b(d); return this.Yield(d) }, k.Blank) }) }; e.prototype = {
                        CascadeBreadthFirst: function (a, b) {
                            var c = this; a = f.CreateLambda(a);
                            b = f.CreateLambda(b); return new e(function () { var d, g = 0, m = []; return new h(function () { d = c.GetEnumerator() }, function () { for (; ;) { if (d.MoveNext()) return m.push(d.Current()), this.Yield(b(d.Current(), g)); var c = e.From(m).SelectMany(function (b) { return a(b) }); if (c.Any()) g++, m = [], f.Dispose(d), d = c.GetEnumerator(); else return !1 } }, function () { f.Dispose(d) }) })
                        }, CascadeDepthFirst: function (a, b) {
                            var c = this; a = f.CreateLambda(a); b = f.CreateLambda(b); return new e(function () {
                                var d = [], g; return new h(function () { g = c.GetEnumerator() },
                                    function () { for (; ;) { if (g.MoveNext()) { var c = b(g.Current(), d.length); d.push(g); g = e.From(a(g.Current())).GetEnumerator(); return this.Yield(c) } if (0 >= d.length) return !1; f.Dispose(g); g = d.pop() } }, function () { try { f.Dispose(g) } finally { e.From(d).ForEach(function (a) { a.Dispose() }) } })
                            })
                        }, Flatten: function () {
                            var a = this; return new e(function () {
                                var b, c = null; return new h(function () { b = a.GetEnumerator() }, function () {
                                    for (; ;) {
                                        if (null != c) { if (c.MoveNext()) return this.Yield(c.Current()); c = null } if (b.MoveNext()) if (b.Current() instanceof
                                            Array) { f.Dispose(c); c = e.From(b.Current()).SelectMany(k.Identity).Flatten().GetEnumerator(); continue } else return this.Yield(b.Current()); return !1
                                    }
                                }, function () { try { f.Dispose(b) } finally { f.Dispose(c) } })
                            })
                        }, Pairwise: function (a) { var b = this; a = f.CreateLambda(a); return new e(function () { var c; return new h(function () { c = b.GetEnumerator(); c.MoveNext() }, function () { var b = c.Current(); return c.MoveNext() ? this.Yield(a(b, c.Current())) : !1 }, function () { f.Dispose(c) }) }) }, Scan: function (a, b, c) {
                            if (null != c) return this.Scan(a,
                                b).Select(c); var d; null == b ? (b = f.CreateLambda(a), d = !1) : (b = f.CreateLambda(b), d = !0); var g = this; return new e(function () { var c, e, p = !0; return new h(function () { c = g.GetEnumerator() }, function () { if (p) { p = !1; if (d) return this.Yield(e = a); if (c.MoveNext()) return this.Yield(e = c.Current()) } return c.MoveNext() ? this.Yield(e = b(e, c.Current())) : !1 }, function () { f.Dispose(c) }) })
                        }, Select: function (a) {
                            var b = this; a = f.CreateLambda(a); return new e(function () {
                                var c, d = 0; return new h(function () { c = b.GetEnumerator() }, function () {
                                    return c.MoveNext() ?
                                        this.Yield(a(c.Current(), d++)) : !1
                                }, function () { f.Dispose(c) })
                            })
                        }, SelectMany: function (a, b) { var c = this; a = f.CreateLambda(a); null == b && (b = function (a, b) { return b }); b = f.CreateLambda(b); return new e(function () { var d, g = void 0, m = 0; return new h(function () { d = c.GetEnumerator() }, function () { if (void 0 === g && !d.MoveNext()) return !1; do { if (null == g) { var c = a(d.Current(), m++); g = e.From(c).GetEnumerator() } if (g.MoveNext()) return this.Yield(b(d.Current(), g.Current())); f.Dispose(g); g = null } while (d.MoveNext()); return !1 }, function () { try { f.Dispose(d) } finally { f.Dispose(g) } }) }) },
                        Where: function (a) { a = f.CreateLambda(a); var b = this; return new e(function () { var c, d = 0; return new h(function () { c = b.GetEnumerator() }, function () { for (; c.MoveNext();) if (a(c.Current(), d++)) return this.Yield(c.Current()); return !1 }, function () { f.Dispose(c) }) }) }, OfType: function (a) {
                            var b; switch (a) { case Number: b = q.Number; break; case String: b = q.String; break; case Boolean: b = q.Boolean; break; case Function: b = q.Function; break; default: b = null } return null === b ? this.Where(function (b) { return b instanceof a }) : this.Where(function (a) {
                                return typeof a ===
                                    b
                            })
                        }, Zip: function (a, b) { b = f.CreateLambda(b); var c = this; return new e(function () { var d, g, m = 0; return new h(function () { d = c.GetEnumerator(); g = e.From(a).GetEnumerator() }, function () { return d.MoveNext() && g.MoveNext() ? this.Yield(b(d.Current(), g.Current(), m++)) : !1 }, function () { try { f.Dispose(d) } finally { f.Dispose(g) } }) }) }, Join: function (a, b, c, d, g) {
                            b = f.CreateLambda(b); c = f.CreateLambda(c); d = f.CreateLambda(d); g = f.CreateLambda(g); var m = this; return new e(function () {
                                var n, p, v = null, l = 0; return new h(function () {
                                    n = m.GetEnumerator();
                                    p = e.From(a).ToLookup(c, k.Identity, g)
                                }, function () { for (; ;) { if (null != v) { var a = v[l++]; if (void 0 !== a) return this.Yield(d(n.Current(), a)); l = 0 } if (n.MoveNext()) a = b(n.Current()), v = p.Get(a).ToArray(); else return !1 } }, function () { f.Dispose(n) })
                            })
                        }, GroupJoin: function (a, b, c, d, g) {
                            b = f.CreateLambda(b); c = f.CreateLambda(c); d = f.CreateLambda(d); g = f.CreateLambda(g); var m = this; return new e(function () {
                                var n = m.GetEnumerator(), p = null; return new h(function () { n = m.GetEnumerator(); p = e.From(a).ToLookup(c, k.Identity, g) }, function () {
                                    if (n.MoveNext()) {
                                        var a =
                                            p.Get(b(n.Current())); return this.Yield(d(n.Current(), a))
                                    } return !1
                                }, function () { f.Dispose(n) })
                            })
                        }, All: function (a) { a = f.CreateLambda(a); var b = !0; this.ForEach(function (c) { if (!a(c)) return b = !1 }); return b }, Any: function (a) { a = f.CreateLambda(a); var b = this.GetEnumerator(); try { if (0 == arguments.length) return b.MoveNext(); for (; b.MoveNext();) if (a(b.Current())) return !0; return !1 } finally { f.Dispose(b) } }, Concat: function (a) {
                            var b = this; return new e(function () {
                                var c, d; return new h(function () { c = b.GetEnumerator() }, function () {
                                    if (null ==
                                        d) { if (c.MoveNext()) return this.Yield(c.Current()); d = e.From(a).GetEnumerator() } return d.MoveNext() ? this.Yield(d.Current()) : !1
                                }, function () { try { f.Dispose(c) } finally { f.Dispose(d) } })
                            })
                        }, Insert: function (a, b) { var c = this; return new e(function () { var d, g, m = 0, n = !1; return new h(function () { d = c.GetEnumerator(); g = e.From(b).GetEnumerator() }, function () { return m == a && g.MoveNext() ? (n = !0, this.Yield(g.Current())) : d.MoveNext() ? (m++, this.Yield(d.Current())) : !n && g.MoveNext() ? this.Yield(g.Current()) : !1 }, function () { try { f.Dispose(d) } finally { f.Dispose(g) } }) }) },
                        Alternate: function (a) { a = e.Return(a); return this.SelectMany(function (b) { return e.Return(b).Concat(a) }).TakeExceptLast() }, Contains: function (a, b) { b = f.CreateLambda(b); var c = this.GetEnumerator(); try { for (; c.MoveNext();) if (b(c.Current()) === a) return !0; return !1 } finally { f.Dispose(c) } }, DefaultIfEmpty: function (a) { var b = this; return new e(function () { var c, d = !0; return new h(function () { c = b.GetEnumerator() }, function () { return c.MoveNext() ? (d = !1, this.Yield(c.Current())) : d ? (d = !1, this.Yield(a)) : !1 }, function () { f.Dispose(c) }) }) },
                        Distinct: function (a) { return this.Except(e.Empty(), a) }, Except: function (a, b) { b = f.CreateLambda(b); var c = this; return new e(function () { var d, g; return new h(function () { d = c.GetEnumerator(); g = new t(b); e.From(a).ForEach(function (a) { g.Add(a) }) }, function () { for (; d.MoveNext();) { var a = d.Current(); if (!g.Contains(a)) return g.Add(a), this.Yield(a) } return !1 }, function () { f.Dispose(d) }) }) }, Intersect: function (a, b) {
                            b = f.CreateLambda(b); var c = this; return new e(function () {
                                var d, g, m; return new h(function () {
                                    d = c.GetEnumerator();
                                    g = new t(b); e.From(a).ForEach(function (a) { g.Add(a) }); m = new t(b)
                                }, function () { for (; d.MoveNext();) { var a = d.Current(); if (!m.Contains(a) && g.Contains(a)) return m.Add(a), this.Yield(a) } return !1 }, function () { f.Dispose(d) })
                            })
                        }, SequenceEqual: function (a, b) { b = f.CreateLambda(b); var c = this.GetEnumerator(); try { var d = e.From(a).GetEnumerator(); try { for (; c.MoveNext();) if (!d.MoveNext() || b(c.Current()) !== b(d.Current())) return !1; return d.MoveNext() ? !1 : !0 } finally { f.Dispose(d) } } finally { f.Dispose(c) } }, Union: function (a, b) {
                            b =
                                f.CreateLambda(b); var c = this; return new e(function () { var d, g, m; return new h(function () { d = c.GetEnumerator(); m = new t(b) }, function () { var b; if (void 0 === g) { for (; d.MoveNext();) if (b = d.Current(), !m.Contains(b)) return m.Add(b), this.Yield(b); g = e.From(a).GetEnumerator() } for (; g.MoveNext();) if (b = g.Current(), !m.Contains(b)) return m.Add(b), this.Yield(b); return !1 }, function () { try { f.Dispose(d) } finally { f.Dispose(g) } }) })
                        }, OrderBy: function (a) { return new r(this, a, !1) }, OrderByDescending: function (a) {
                            return new r(this, a,
                                !0)
                        }, Reverse: function () { var a = this; return new e(function () { var b, c; return new h(function () { b = a.ToArray(); c = b.length }, function () { return 0 < c ? this.Yield(b[--c]) : !1 }, k.Blank) }) }, Shuffle: function () { var a = this; return new e(function () { var b; return new h(function () { b = a.ToArray() }, function () { if (0 < b.length) { var a = Math.floor(Math.random() * b.length); return this.Yield(b.splice(a, 1)[0]) } return !1 }, k.Blank) }) }, GroupBy: function (a, b, c, d) {
                            var g = this; a = f.CreateLambda(a); b = f.CreateLambda(b); null != c && (c = f.CreateLambda(c));
                            d = f.CreateLambda(d); return new e(function () { var e; return new h(function () { e = g.ToLookup(a, b, d).ToEnumerable().GetEnumerator() }, function () { for (; e.MoveNext();) return null == c ? this.Yield(e.Current()) : this.Yield(c(e.Current().Key(), e.Current())); return !1 }, function () { f.Dispose(e) }) })
                        }, PartitionBy: function (a, b, c, d) {
                            var g = this; a = f.CreateLambda(a); b = f.CreateLambda(b); d = f.CreateLambda(d); var m; null == c ? (m = !1, c = function (a, b) { return new w(a, b) }) : (m = !0, c = f.CreateLambda(c)); return new e(function () {
                                var n, p, k, l = [];
                                return new h(function () { n = g.GetEnumerator(); n.MoveNext() && (p = a(n.Current()), k = d(p), l.push(b(n.Current()))) }, function () { for (var g; 1 == (g = n.MoveNext());) if (k === d(a(n.Current()))) l.push(b(n.Current())); else break; if (0 < l.length) { var f = m ? c(p, e.From(l)) : c(p, l); g ? (p = a(n.Current()), k = d(p), l = [b(n.Current())]) : l = []; return this.Yield(f) } return !1 }, function () { f.Dispose(n) })
                            })
                        }, BufferWithCount: function (a) {
                            var b = this; return new e(function () {
                                var c; return new h(function () { c = b.GetEnumerator() }, function () {
                                    for (var b =
                                        [], g = 0; c.MoveNext();) if (b.push(c.Current()), ++g >= a) return this.Yield(b); return 0 < b.length ? this.Yield(b) : !1
                                }, function () { f.Dispose(c) })
                            })
                        }, Aggregate: function (a, b, c) { return this.Scan(a, b, c).Last() }, Average: function (a) { a = f.CreateLambda(a); var b = 0, c = 0; this.ForEach(function (d) { b += a(d); ++c }); return b / c }, Count: function (a) { a = null == a ? k.True : f.CreateLambda(a); var b = 0; this.ForEach(function (c, d) { a(c, d) && ++b }); return b }, Max: function (a) {
                            null == a && (a = k.Identity); return this.Select(a).Aggregate(function (a, c) {
                                return a >
                                    c ? a : c
                            })
                        }, Min: function (a) { null == a && (a = k.Identity); return this.Select(a).Aggregate(function (a, c) { return a < c ? a : c }) }, MaxBy: function (a) { a = f.CreateLambda(a); return this.Aggregate(function (b, c) { return a(b) > a(c) ? b : c }) }, MinBy: function (a) { a = f.CreateLambda(a); return this.Aggregate(function (b, c) { return a(b) < a(c) ? b : c }) }, Sum: function (a) { null == a && (a = k.Identity); return this.Select(a).Aggregate(0, function (a, c) { return a + c }) }, ElementAt: function (a) {
                            var b, c = !1; this.ForEach(function (d, g) { if (g == a) return b = d, c = !0, !1 }); if (!c) throw Error("index is less than 0 or greater than or equal to the number of elements in source.");
                            return b
                        }, ElementAtOrDefault: function (a, b) { var c, d = !1; this.ForEach(function (b, e) { if (e == a) return c = b, d = !0, !1 }); return d ? c : b }, First: function (a) { if (null != a) return this.Where(a).First(); var b, c = !1; this.ForEach(function (a) { b = a; c = !0; return !1 }); if (!c) throw Error("First:No element satisfies the condition."); return b }, FirstOrDefault: function (a, b) { if (null != b) return this.Where(b).FirstOrDefault(a); var c, d = !1; this.ForEach(function (a) { c = a; d = !0; return !1 }); return d ? c : a }, Last: function (a) {
                            if (null != a) return this.Where(a).Last();
                            var b, c = !1; this.ForEach(function (a) { c = !0; b = a }); if (!c) throw Error("Last:No element satisfies the condition."); return b
                        }, LastOrDefault: function (a, b) { if (null != b) return this.Where(b).LastOrDefault(a); var c, d = !1; this.ForEach(function (a) { d = !0; c = a }); return d ? c : a }, Single: function (a) { if (null != a) return this.Where(a).Single(); var b, c = !1; this.ForEach(function (a) { if (c) throw Error("Single:sequence contains more than one element."); c = !0; b = a }); if (!c) throw Error("Single:No element satisfies the condition."); return b },
                        SingleOrDefault: function (a, b) { if (null != b) return this.Where(b).SingleOrDefault(a); var c, d = !1; this.ForEach(function (a) { if (d) throw Error("Single:sequence contains more than one element."); d = !0; c = a }); return d ? c : a }, Skip: function (a) { var b = this; return new e(function () { var c, d = 0; return new h(function () { for (c = b.GetEnumerator(); d++ < a && c.MoveNext();); }, function () { return c.MoveNext() ? this.Yield(c.Current()) : !1 }, function () { f.Dispose(c) }) }) }, SkipWhile: function (a) {
                            a = f.CreateLambda(a); var b = this; return new e(function () {
                                var c,
                                    d = 0, g = !1; return new h(function () { c = b.GetEnumerator() }, function () { for (; !g;) if (c.MoveNext()) { if (!a(c.Current(), d++)) return g = !0, this.Yield(c.Current()) } else return !1; return c.MoveNext() ? this.Yield(c.Current()) : !1 }, function () { f.Dispose(c) })
                            })
                        }, Take: function (a) { var b = this; return new e(function () { var c, d = 0; return new h(function () { c = b.GetEnumerator() }, function () { return d++ < a && c.MoveNext() ? this.Yield(c.Current()) : !1 }, function () { f.Dispose(c) }) }) }, TakeWhile: function (a) {
                            a = f.CreateLambda(a); var b = this; return new e(function () {
                                var c,
                                    d = 0; return new h(function () { c = b.GetEnumerator() }, function () { return c.MoveNext() && a(c.Current(), d++) ? this.Yield(c.Current()) : !1 }, function () { f.Dispose(c) })
                            })
                        }, TakeExceptLast: function (a) { null == a && (a = 1); var b = this; return new e(function () { if (0 >= a) return b.GetEnumerator(); var c, d = []; return new h(function () { c = b.GetEnumerator() }, function () { for (; c.MoveNext();) { if (d.length == a) return d.push(c.Current()), this.Yield(d.shift()); d.push(c.Current()) } return !1 }, function () { f.Dispose(c) }) }) }, TakeFromLast: function (a) {
                            if (0 >=
                                a || null == a) return e.Empty(); var b = this; return new e(function () { var c, d, g = []; return new h(function () { c = b.GetEnumerator() }, function () { for (; c.MoveNext();) g.length == a && g.shift(), g.push(c.Current()); null == d && (d = e.From(g).GetEnumerator()); return d.MoveNext() ? this.Yield(d.Current()) : !1 }, function () { f.Dispose(d) }) })
                        }, IndexOf: function (a) { var b = null; this.ForEach(function (c, d) { if (c === a) return b = d, !0 }); return null !== b ? b : -1 }, LastIndexOf: function (a) { var b = -1; this.ForEach(function (c, d) { c === a && (b = d) }); return b }, ToArray: function () {
                            var a =
                                []; this.ForEach(function (b) { a.push(b) }); return a
                        }, ToLookup: function (a, b, c) { a = f.CreateLambda(a); b = f.CreateLambda(b); c = f.CreateLambda(c); var d = new t(c); this.ForEach(function (c) { var e = a(c); c = b(c); var f = d.Get(e); void 0 !== f ? f.push(c) : d.Add(e, [c]) }); return new x(d) }, ToObject: function (a, b) { a = f.CreateLambda(a); b = f.CreateLambda(b); var c = {}; this.ForEach(function (d) { c[a(d)] = b(d) }); return c }, ToDictionary: function (a, b, c) {
                            a = f.CreateLambda(a); b = f.CreateLambda(b); c = f.CreateLambda(c); var d = new t(c); this.ForEach(function (c) {
                                d.Add(a(c),
                                    b(c))
                            }); return d
                        }, ToJSON: function (a, b) { return JSON.stringify(this.ToArray(), a, b) }, ToString: function (a, b) { null == a && (a = ""); null == b && (b = k.Identity); return this.Select(b).ToArray().join(a) }, Do: function (a) { var b = this; a = f.CreateLambda(a); return new e(function () { var c, d = 0; return new h(function () { c = b.GetEnumerator() }, function () { return c.MoveNext() ? (a(c.Current(), d++), this.Yield(c.Current())) : !1 }, function () { f.Dispose(c) }) }) }, ForEach: function (a) {
                            a = f.CreateLambda(a); var b = 0, c = this.GetEnumerator(); try {
                                for (; c.MoveNext() &&
                                    !1 !== a(c.Current(), b++););
                            } finally { f.Dispose(c) }
                        }, Write: function (a, b) { null == a && (a = ""); b = f.CreateLambda(b); var c = !0; this.ForEach(function (d) { c ? c = !1 : document.write(a); document.write(b(d)) }) }, WriteLine: function (a) { a = f.CreateLambda(a); this.ForEach(function (b) { document.write(a(b)); document.write("<br />") }) }, Force: function () { var a = this.GetEnumerator(); try { for (; a.MoveNext();); } finally { f.Dispose(a) } }, Let: function (a) {
                            a = f.CreateLambda(a); var b = this; return new e(function () {
                                var c; return new h(function () { c = e.From(a(b)).GetEnumerator() },
                                    function () { return c.MoveNext() ? this.Yield(c.Current()) : !1 }, function () { f.Dispose(c) })
                            })
                        }, Share: function () { var a = this, b; return new e(function () { return new h(function () { null == b && (b = a.GetEnumerator()) }, function () { return b.MoveNext() ? this.Yield(b.Current()) : !1 }, k.Blank) }) }, MemoizeAll: function () { var a = this, b, c; return new e(function () { var d = -1; return new h(function () { null == c && (c = a.GetEnumerator(), b = []) }, function () { d++; return b.length <= d ? c.MoveNext() ? this.Yield(b[d] = c.Current()) : !1 : this.Yield(b[d]) }, k.Blank) }) },
                        Catch: function (a) { a = f.CreateLambda(a); var b = this; return new e(function () { var c; return new h(function () { c = b.GetEnumerator() }, function () { try { return c.MoveNext() ? this.Yield(c.Current()) : !1 } catch (b) { return a(b), !1 } }, function () { f.Dispose(c) }) }) }, Finally: function (a) { a = f.CreateLambda(a); var b = this; return new e(function () { var c; return new h(function () { c = b.GetEnumerator() }, function () { return c.MoveNext() ? this.Yield(c.Current()) : !1 }, function () { try { f.Dispose(c) } finally { a() } }) }) }, Trace: function (a, b) {
                            null == a &&
                                (a = "Trace"); b = f.CreateLambda(b); return this.Do(function (c) { console.log(a, ":", b(c)) })
                        }
                    }; var k = { Identity: function (a) { return a }, True: function () { return !0 }, Blank: function () { } }, q = { Boolean: "boolean", Number: "number", String: "string", Object: "object", Undefined: "undefined", Function: "function" }, f = {
                        CreateLambda: function (a) {
                            if (null == a) return k.Identity; if (typeof a == q.String) {
                                if ("" == a) return k.Identity; if (-1 == a.indexOf("=>")) return new Function("$,$$,$$$,$$$$", "return " + a); a = a.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
                                return new Function(a[1], "return " + a[2])
                            } return a
                        }, IsIEnumerable: function (a) { if (typeof Enumerator != q.Undefined) try { return new Enumerator(a), !0 } catch (b) { } return !1 }, Compare: function (a, b) { return a === b ? 0 : a > b ? 1 : -1 }, Dispose: function (a) { null != a && a.Dispose() }
                    }, h = function (a, b, c) {
                        var d = new y, g = 0; this.Current = d.Current; this.MoveNext = function () { try { switch (g) { case 0: g = 1, a(); case 1: if (b.apply(d)) return !0; this.Dispose(); return !1; case 2: return !1 } } catch (c) { throw this.Dispose(), c; } }; this.Dispose = function () {
                            if (1 == g) try { c() } finally {
                                g =
                                    2
                            }
                        }
                    }, y = function () { var a = null; this.Current = function () { return a }; this.Yield = function (b) { a = b; return !0 } }, r = function (a, b, c, d) { this.source = a; this.keySelector = f.CreateLambda(b); this.descending = c; this.parent = d }; r.prototype = new e; r.prototype.CreateOrderedEnumerable = function (a, b) { return new r(this.source, a, b, this) }; r.prototype.ThenBy = function (a) { return this.CreateOrderedEnumerable(a, !1) }; r.prototype.ThenByDescending = function (a) { return this.CreateOrderedEnumerable(a, !0) }; r.prototype.GetEnumerator = function () {
                        var a =
                            this, b, c, d = 0; return new h(function () { b = []; c = []; a.source.ForEach(function (a, d) { b.push(a); c.push(d) }); var d = u.Create(a, null); d.GenerateKeys(b); c.sort(function (a, b) { return d.Compare(a, b) }) }, function () { return d < c.length ? this.Yield(b[c[d++]]) : !1 }, k.Blank)
                    }; var u = function (a, b, c) { this.keySelector = a; this.descending = b; this.child = c; this.keys = null }; u.Create = function (a, b) { var c = new u(a.keySelector, a.descending, b); return null != a.parent ? u.Create(a.parent, c) : c }; u.prototype.GenerateKeys = function (a) {
                        for (var b = a.length,
                            c = this.keySelector, d = Array(b), g = 0; g < b; g++) d[g] = c(a[g]); this.keys = d; null != this.child && this.child.GenerateKeys(a)
                    }; u.prototype.Compare = function (a, b) { var c = f.Compare(this.keys[a], this.keys[b]); if (0 == c) { if (null != this.child) return this.child.Compare(a, b); c = f.Compare(a, b) } return this.descending ? -c : c }; var l = function (a) { this.source = a }; l.prototype = new e; l.prototype.Any = function (a) { return null == a ? 0 < this.source.length : e.prototype.Any.apply(this, arguments) }; l.prototype.Count = function (a) {
                        return null == a ? this.source.length :
                            e.prototype.Count.apply(this, arguments)
                    }; l.prototype.ElementAt = function (a) { return 0 <= a && a < this.source.length ? this.source[a] : e.prototype.ElementAt.apply(this, arguments) }; l.prototype.ElementAtOrDefault = function (a, b) { return 0 <= a && a < this.source.length ? this.source[a] : b }; l.prototype.First = function (a) { return null == a && 0 < this.source.length ? this.source[0] : e.prototype.First.apply(this, arguments) }; l.prototype.FirstOrDefault = function (a, b) {
                        return null != b ? e.prototype.FirstOrDefault.apply(this, arguments) : 0 < this.source.length ?
                            this.source[0] : a
                    }; l.prototype.Last = function (a) { return null == a && 0 < this.source.length ? this.source[this.source.length - 1] : e.prototype.Last.apply(this, arguments) }; l.prototype.LastOrDefault = function (a, b) { return null != b ? e.prototype.LastOrDefault.apply(this, arguments) : 0 < this.source.length ? this.source[this.source.length - 1] : a }; l.prototype.Skip = function (a) { var b = this.source; return new e(function () { var c; return new h(function () { c = 0 > a ? 0 : a }, function () { return c < b.length ? this.Yield(b[c++]) : !1 }, k.Blank) }) }; l.prototype.TakeExceptLast =
                        function (a) { null == a && (a = 1); return this.Take(this.source.length - a) }; l.prototype.TakeFromLast = function (a) { return this.Skip(this.source.length - a) }; l.prototype.Reverse = function () { var a = this.source; return new e(function () { var b; return new h(function () { b = a.length }, function () { return 0 < b ? this.Yield(a[--b]) : !1 }, k.Blank) }) }; l.prototype.SequenceEqual = function (a, b) { return (a instanceof l || a instanceof Array) && null == b && e.From(a).Count() != this.Count() ? !1 : e.prototype.SequenceEqual.apply(this, arguments) }; l.prototype.ToString =
                            function (a, b) { if (null != b || !(this.source instanceof Array)) return e.prototype.ToString.apply(this, arguments); null == a && (a = ""); return this.source.join(a) }; l.prototype.GetEnumerator = function () { var a = this.source, b = 0; return new h(k.Blank, function () { return b < a.length ? this.Yield(a[b++]) : !1 }, k.Blank) }; var t = function () {
                                var a = function (a) { return null === a ? "null" : void 0 === a ? "undefined" : typeof a.toString === q.Function ? a.toString() : Object.prototype.toString.call(a) }, b = function (a, b) {
                                    this.Key = a; this.Value = b; this.Next =
                                        this.Prev = null
                                }, c = function () { this.Last = this.First = null }; c.prototype = { AddLast: function (a) { null != this.Last ? (this.Last.Next = a, a.Prev = this.Last, this.Last = a) : this.First = this.Last = a }, Replace: function (a, b) { null != a.Prev ? (a.Prev.Next = b, b.Prev = a.Prev) : this.First = b; null != a.Next ? (a.Next.Prev = b, b.Next = a.Next) : this.Last = b }, Remove: function (a) { null != a.Prev ? a.Prev.Next = a.Next : this.First = a.Next; null != a.Next ? a.Next.Prev = a.Prev : this.Last = a.Prev } }; var d = function (a) {
                                    this.count = 0; this.entryList = new c; this.buckets = {}; this.compareSelector =
                                        null == a ? k.Identity : a
                                }; d.prototype = {
                                    Add: function (c, d) { var e = this.compareSelector(c), f = a(e), h = new b(c, d); if (Object.prototype.hasOwnProperty.call(this.buckets, f)) { for (var f = this.buckets[f], k = 0; k < f.length; k++) if (this.compareSelector(f[k].Key) === e) { this.entryList.Replace(f[k], h); f[k] = h; return } f.push(h) } else this.buckets[f] = [h]; this.count++; this.entryList.AddLast(h) }, Get: function (b) {
                                        b = this.compareSelector(b); var c = a(b); if (Object.prototype.hasOwnProperty.call(this.buckets, c)) for (var c = this.buckets[c], d =
                                            0; d < c.length; d++) { var e = c[d]; if (this.compareSelector(e.Key) === b) return e.Value }
                                    }, Set: function (c, d) { var e = this.compareSelector(c), f = a(e); if (Object.prototype.hasOwnProperty.call(this.buckets, f)) for (var f = this.buckets[f], h = 0; h < f.length; h++) if (this.compareSelector(f[h].Key) === e) return e = new b(c, d), this.entryList.Replace(f[h], e), f[h] = e, !0; return !1 }, Contains: function (b) {
                                        b = this.compareSelector(b); var c = a(b); if (!Object.prototype.hasOwnProperty.call(this.buckets, c)) return !1; for (var c = this.buckets[c], d = 0; d <
                                            c.length; d++) if (this.compareSelector(c[d].Key) === b) return !0; return !1
                                    }, Clear: function () { this.count = 0; this.buckets = {}; this.entryList = new c }, Remove: function (b) { b = this.compareSelector(b); var c = a(b); if (Object.prototype.hasOwnProperty.call(this.buckets, c)) for (var d = this.buckets[c], e = 0; e < d.length; e++) if (this.compareSelector(d[e].Key) === b) { this.entryList.Remove(d[e]); d.splice(e, 1); 0 == d.length && delete this.buckets[c]; this.count--; break } }, Count: function () { return this.count }, ToEnumerable: function () {
                                        var a = this;
                                        return new e(function () { var b; return new h(function () { b = a.entryList.First }, function () { if (null != b) { var a = { Key: b.Key, Value: b.Value }; b = b.Next; return this.Yield(a) } return !1 }, k.Blank) })
                                    }
                                }; return d
                            }(), x = function (a) { this.Count = function () { return a.Count() }; this.Get = function (b) { return e.From(a.Get(b)) }; this.Contains = function (b) { return a.Contains(b) }; this.ToEnumerable = function () { return a.ToEnumerable().Select(function (a) { return new w(a.Key, a.Value) }) } }, w = function (a, b) {
                                this.Key = function () { return a }; this.source =
                                    b
                            }; w.prototype = new l; return e
                }();
                //#endregion
            };
            var _base64 = function () {
                var BASE64_MAPPING = [
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                    'w', 'x', 'y', 'z', '0', '1', '2', '3',
                    '4', '5', '6', '7', '8', '9', '+', '/'
                ];

                /**
                 *ascii convert to binary
                 */
                var _toBinary = function (ascii) {
                    var binary = new Array();
                    while (ascii > 0) {
                        var b = ascii % 2;
                        ascii = Math.floor(ascii / 2);
                        binary.push(b);
                    }
                    binary.reverse();
                    return binary;
                };

                /**
                 *binary convert to decimal
                 */
                var _toDecimal = function (binary) {
                    var dec = 0;
                    var p = 0;
                    for (var i = binary.length - 1; i >= 0; --i) {
                        var b = binary[i];
                        if (b == 1) {
                            dec += Math.pow(2, p);
                        }
                        ++p;
                    }
                    return dec;
                };

                /**
                 *unicode convert to utf-8
                 */
                var _toUTF8Binary = function (c, binaryArray) {
                    var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
                    var fatLen = binaryArray.length;
                    var diff = mustLen - fatLen;
                    while (--diff >= 0) {
                        binaryArray.unshift(0);
                    }
                    var binary = [];
                    var _c = c;
                    while (--_c >= 0) {
                        binary.push(1);
                    }
                    binary.push(0);
                    var i = 0, len = 8 - (c + 1);
                    for (; i < len; ++i) {
                        binary.push(binaryArray[i]);
                    }

                    for (var j = 0; j < c - 1; ++j) {
                        binary.push(1);
                        binary.push(0);
                        var sum = 6;
                        while (--sum >= 0) {
                            binary.push(binaryArray[i++]);
                        }
                    }
                    return binary;
                };

                var __BASE64 = {
                    /**
                     *BASE64 Encode
                     */
                    encoder: function (str) {
                        var base64_Index = [];
                        var binaryArray = [];
                        for (var i = 0, len = str.length; i < len; ++i) {
                            var unicode = str.charCodeAt(i);
                            var _tmpBinary = _toBinary(unicode);
                            if (unicode < 0x80) {
                                var _tmpdiff = 8 - _tmpBinary.length;
                                while (--_tmpdiff >= 0) {
                                    _tmpBinary.unshift(0);
                                }
                                binaryArray = binaryArray.concat(_tmpBinary);
                            } else if (unicode >= 0x80 && unicode <= 0x7FF) {
                                binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
                            } else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
                                binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
                            } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
                                binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
                            } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
                                binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
                            } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
                                binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
                            }
                        }

                        var extra_Zero_Count = 0;
                        for (var i = 0, len = binaryArray.length; i < len; i += 6) {
                            var diff = (i + 6) - len;
                            if (diff == 2) {
                                extra_Zero_Count = 2;
                            } else if (diff == 4) {
                                extra_Zero_Count = 4;
                            }
                            var _tmpExtra_Zero_Count = extra_Zero_Count;
                            while (--_tmpExtra_Zero_Count >= 0) {
                                binaryArray.push(0);
                            }
                            base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
                        }

                        var base64 = '';
                        for (var i = 0, len = base64_Index.length; i < len; ++i) {
                            base64 += BASE64_MAPPING[base64_Index[i]];
                        }

                        for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
                            base64 += '=';
                        }
                        return base64;
                    },
                    /**
                     *BASE64  Decode for UTF-8
                     */
                    decoder: function (_base64Str) {
                        var _len = _base64Str.length;
                        var extra_Zero_Count = 0;
                        /**
                         *计算在进行BASE64编码的时候，补了几个0
                         */
                        if (_base64Str.charAt(_len - 1) == '=') {
                            if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
                                extra_Zero_Count = 4;
                                _base64Str = _base64Str.substring(0, _len - 2);
                            } else {//一个等号说明补了2个0
                                extra_Zero_Count = 2;
                                _base64Str = _base64Str.substring(0, _len - 1);
                            }
                        }

                        var binaryArray = [];
                        for (var i = 0, len = _base64Str.length; i < len; ++i) {
                            var c = _base64Str.charAt(i);
                            for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
                                if (c == BASE64_MAPPING[j]) {
                                    var _tmp = _toBinary(j);
                                    /*不足6位的补0*/
                                    var _tmpLen = _tmp.length;
                                    if (6 - _tmpLen > 0) {
                                        for (var k = 6 - _tmpLen; k > 0; --k) {
                                            _tmp.unshift(0);
                                        }
                                    }
                                    binaryArray = binaryArray.concat(_tmp);
                                    break;
                                }
                            }
                        }

                        if (extra_Zero_Count > 0) {
                            binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
                        }

                        var unicode = [];
                        var unicodeBinary = [];
                        for (var i = 0, len = binaryArray.length; i < len;) {
                            if (binaryArray[i] == 0) {
                                unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
                                i += 8;
                            } else {
                                var sum = 0;
                                while (i < len) {
                                    if (binaryArray[i] == 1) {
                                        ++sum;
                                    } else {
                                        break;
                                    }
                                    ++i;
                                }
                                unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
                                i += 8 - sum;
                                while (sum > 1) {
                                    unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
                                    i += 8;
                                    --sum;
                                }
                                unicode = unicode.concat(_toDecimal(unicodeBinary));
                                unicodeBinary = [];
                            }
                        }

                        var str = '';
                        for (var i = 0, len = unicode.length; i < len; ++i) {
                            str += String.fromCharCode(unicode[i]);
                        }
                        return str;
                    }
                };

                win.BASE64 = __BASE64;
            };
            return {
                initMustache: _mustache
                , initEnumerable: _enumerable
                , initBase64: _base64
            }
        };
        return {
            init: _init
            , window: win
        }
    };
    core.g = (function () {
        if (root === root.top || root.location.href.toLowerCase() === root.top.location.href.toLowerCase()) {
            var g = new Global(root);
            g.init();
            return g;
        } else {
            if (root.top.banana) {
                return root.top.banana.g;
            } else {
                return null;
            }
        }
    }());

    //#endregion

    //#region banana.helper

    core.helper = (function () {
        var _log = function () {
            if (!DEBUG) return;
            if (root.console) {
                var args = Array.prototype.slice.apply(arguments);
                args.unshift((new Date()).format("yyyy-MM-dd hh:mm:ss") + ' >>>');
                root.console.log.apply(root, args);
            }
        };
        var _warn = function () {
            if (!DEBUG) return;
            if (window.console) {
                var args = Array.prototype.slice.apply(arguments);
                args.unshift((new Date()).format("yyyy-MM-dd hh:mm:ss") + ' >>>');
                root.console.warn.apply(root, args);
            }
        };
        var _error = function () {
            if (!DEBUG) return;
            if (window.console) {
                var args = Array.prototype.slice.apply(arguments);
                args.unshift((new Date()).format("yyyy-MM-dd hh:mm:ss") + ' >>>');
                root.console.error.apply(root, args);
            }
        };
        var _getRandom = function (length) {
            /// <summary>
            /// 获取随机数（默认6位）
            /// </summary>
            /// <param name="len">长度（选填）</param>
            /// <returns type="string"></returns>
            length = length || 6;
            var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var value = '';
            for (var i = 0; i < length; i++) {
                var id = Math.ceil(Math.random() * 60);
                value += chars[id];
            }
            return value;
        };
        var _createID = function () {
            /// <summary>
            /// 创建ID
            /// </summary>
            /// <returns type="string"></returns>
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        var _createGUID = function () {
            /// <summary>
            /// 创建GUID
            /// </summary>
            /// <returns type="string"></returns>
            return _createID() + _createID() + _createID() + _createID() + _createID() + _createID() + _createID() + _createID();
        };
        var _getFunction = function (fn, context) {
            /// <summary>
            /// 获取方法
            /// </summary>
            /// <param name="fn">方法名或方法体</param>
            /// <param name="context">方法所在的上下文（选填）</param>
            /// <returns type="function"></returns>
            if (typeof fn === 'function') {
                return fn;
            }

            var _context = window;
            if (context) {
                if (core.helper.isWindow(context) === true) {
                    _context = context;
                }
            }

            var fn = _context[fn];
            if ($.isFunction(fn)) { return fn; }
            else { return null; }
        };
        var _invokeFunction = function (fnName) {
            /// <summary>
            /// 调用方法（动态参数）
            /// </summary>
            /// <param name="fnName">方法名或方法体（可选填为object，格式为：{fnName:'',context:{}}）</param>
            /// <returns type="object"></returns>
            var fn = null;
            if (fnName != null) {
                switch (typeof fnName) {
                    case 'string':
                        fn = _getFunction(fnName, null);
                        break;
                    case 'object':
                        if (fnName.fnName && fnName.context) {
                            fn = _getFunction(fnName.fnName, fnName.context);
                        }
                        break;
                    default:
                        fn = _getFunction(fnName, null);
                        break;
                }
            }
            if (fn != null) {
                var args = [];
                if (arguments.length > 1) {
                    args = Array.prototype.slice.apply(arguments);
                    [].shift.call(args); //排除函数体/名，后面是参数
                }

                //return fn.apply(root, (function () {
                //    var params = [];
                //    for (var i in args) {
                //        params.push(args[i]);
                //    }
                //    return params;
                //}()));
                //if (args.length > 0) {
                //    var res = args[0];
                //    if (res && typeof res == 'string') {
                //        args[0] = JSON.parse(args[0]);
                //    }
                //}
                //console.log(args);
                return fn.apply(root, args);
            }
        };
        var _ajax = function (option) {
            /// <summary>
            /// http请求加载远程数据
            /// </summary>
            /// <param name="option">参数配置</param>
            if (!option) {
                return {
                    get: $.get
                    , getJSON: $.getJSON
                    , load: function (target, url, data, callback) {
                        if (!(target instanceof $)) { target = $(target); }
                        if (!url) return;
                        if (data) {
                            if (typeof data === 'function') {
                                target.load(url, data);
                            } else {
                                target.load(url, data, callback);
                            }
                        } else {
                            target.load(url);
                        }
                    }
                    , getScript: $.getScript
                    , post: $.post
                };
            }

            var cacheOpt = {
                'success': core.helper.clone(option.success)
                , 'error': core.helper.clone(option.error)
                , 'complete': core.helper.clone(option.complete)
                , 'beforeSend': core.helper.clone(option.beforeSend)
            };
            delete option.success;
            delete option.error;
            delete option.complete;
            delete option.beforeSend;

            var defaults = {
                url: ''
                , type: 'POST' // GET,POST,PUT,DELETE
                , target: null //源对象，一般在执行时将此对象设置为只读
                , async: true
                , cache: false
                , timeout: 60 * 1000//超时1分钟
                , loading: true
                , crossDomain: false //是否跨域
                //, contentType: 'application/json; charset=utf-8'
                , dataType: 'json' //text,xml,html,script,json,jsonp
                //, headers: {
                //    'apikey': 'b3761d6f3549c72705142e854edba0c2'
                //}
                //, username: ''
                //, password:''
                , data: null //form data
                , beforeSend: function (xhr) {
                    xhr.setRequestHeader("Banana.Core", "banana 1.7");
                    var index = core.controls.loading({ time: 60 * 1000 });
                    xhr.complete(function (a, status) {
                        var layer = root.top.layer;
                        if (layer != null) {
                            core.helper.invoke(layer.close, index);
                        }
                    });
                }
                , complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        //ajaxTimeoutTest.abort();
                        core.helper.error("ajax请求超时", this.url);
                    }

                    core.helper.invoke(cacheOpt.complete, status, XMLHttpRequest);
                }
                , success: function (data, textStatus, jqXHR) {
                    //this // 调用本次AJAX请求时传递的options参数
                    //if (Banana.tool.loading) { Banana.tool.loading(false); }
                    if (defaults.target != null) {
                        $(defaults.target).removeProp("disabled");
                    }

                    core.helper.invoke(cacheOpt.success, data, textStatus, jqXHR);
                }
                , error: function (jqXHR, textStatus, errorThrown) {
                    //if (Banana.tool.loading) { Banana.tool.loading(false); }
                    if (defaults.target != null) {
                        $(defaults.target).removeProp("disabled");
                    }

                    core.helper.invoke(cacheOpt.error, jqXHR, textStatus, errorThrown);
                }
                , statusCode: {
                    404: function () {
                        core.helper.error('404 没有找到请求的地址：' + settings.url);
                        alert('404 没有找到请求的地址：' + settings.url);
                    }
                    , 500: function () {
                        //alert('500:服务器内部错误');
                        core.helper.error('500 服务器内部错误：' + settings.url);
                    }
                }
            };
            var settings = $.extend(true, {}, defaults, option);

            if (settings.loading == false) {
                settings.beforeSend = function (xhr) {
                    xhr.setRequestHeader("Banana.Core", "banana 1.7");
                };
            }

            if (settings.crossDomain === true) {
                delete settings.dataType;//跨域一律采用jsonp
                //跨域请求
                settings = $.extend({
                    dataType: 'JSONP'
                    , jsonp: 'callback'
                    , jsonpCallback: 'ajax_callback'
                }, settings);
            }

            //X-HTTP-Method-Override
            if (settings.type.toUpperCase() != "GET" && settings.type.toUpperCase() != "POST") {
                settings.headers = { "X-HTTP-Method-Override": settings.type }
                settings.type = "POST";
            }
            //if (settings.loading) {
            //    if (Banana.tool.loading) { Banana.tool.loading(true); }
            //}
            if (settings.target != null) {
                $(settings.target).prop("disabled", "disabled");
            }

            core.helper.log('ajax option', settings);

            return $.ajax(settings);
        };
        var _storage = function (callback, type) {
            //storage usage
            //setItem,removeItem,getItem
            type = (type || 1) + ''; //1-localStorage 2-sessionStorage
            switch (type.toLowerCase()) {
                case '1':
                case 'local':
                case 'localstorage':
                    if (!window.localStorage) {
                        core.helper.warn('你的浏览器不支持localStorage');
                        core.helper.invokeFunction(callback, null);
                        return;
                    }
                    core.helper.invokeFunction(callback, window.localStorage);
                    break;
                case '2':
                case 'session':
                case 'sessionstorage':
                    if (!window.sessionStorage) {
                        core.helper.warn('你的浏览器不支持sessionStorage');
                        core.helper.invokeFunction(callback, null);
                        return;
                    }
                    core.helper.invokeFunction(callback, window.sessionStorage);
                    break;
                default:
                    core.helper.warn('无效的参数:type');
                    break;
            }
        };
        var _htmlDecode = function (str) {
            if (!str || str.length === 0) { return ''; }
            return str.replace(/&gt;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#39;/g, "\'").replace(/&quot;/g, "\"").replace(/<br>/g, "\n");
        };
        var _getCombination = function (str) {
            /// <summary>
            /// 获取字符串组合
            /// </summary>
            /// <param name="str">字符串</param>
            /// <returns type="object"></returns>
            var length = 0;
            if (!str) return length;
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (/^[\u0000-\u00ff]$/.test(c)) {
                    length += 1;
                }
                else {
                    length += 2;
                }
            }

            var _isChinese = function (c) {
                return c.match(/^([\u4E00-\u9FA5]+，?)+$/) != null;
            };
            var _isEnglish = function (c) {
                return !(/[^A-Za-z]/.test(c));
            };

            var chineseCount = 0, englishCount = 0, symboCount = 0;
            for (var i in str) {
                if (typeof str[i] == 'function') continue;
                if (_isChinese(str[i])) {
                    chineseCount++;
                } else if (_isEnglish(str[i])) {
                    englishCount++;
                } else {
                    symboCount++;
                }
            }

            return {
                byteLength: length //字节总长度
                , length: str.length //字符串总长度
                , cn: chineseCount//中文长度
                , en: englishCount//英文长度
                , symbol: symboCount//符号长度
            };
        };
        var _replaceEnter = function (str, oldWrap, newWrap) {
            /// <summary>
            /// 替换回车换行符
            /// </summary>
            /// <param name="str">要替换的字符串</param>
            /// <param name="oldWrap">老字符串</param>
            /// <param name="newWrap">新字符串</param>
            /// <returns type="string"></returns>
            var _ow = '\r\n', _nw = '<br />';
            if (arguments.length >= 3) {
                _ow = oldWrap;
                _nw = newWrap;
            }
            return str.replace(new RegExp(_ow, "g"), _nw);
        };
        var _getMustache = function (fn) {
            /// <summary>
            /// 获取模板引擎
            /// </summary>
            /// <param name="fn">执行函数（可选）</param>
            /// <returns type="">Mustache</returns>
            if (!core.g.window.Mustache) {
                core.helper.error('未找到对象:Mustache');
                return;
            }
            fn = core.helper.getFunction(fn);
            if (!fn) {
                return core.g.window.Mustache;
            } else {
                //fn.call(window, core.g.window.Mustache);
                core.helper.invokeFunction(fn, core.g.window.Mustache);
            }
        };
        var _mustacheRender = function (options, fn) {
            /// <summary>
            /// 快速解析模板
            /// </summary>
            /// <param name="options"></param>
            if (!options.container) {
                core.helper.error('container is undefined in option');
                return;
            }
            if (!options.template) {
                core.helper.error('template is undefined in option');
                return;
            }
            if (!options.view) {
                core.helper.error('view is undefined in option');
                return;
            }
            core.helper.getMustache(function (mustache) {
                var defaults = {
                    container: null//容器
                    , template: ''//模板，可以是选择器，可以是字符串内容
                    , view: null//array数据
                    , partials: null
                    , replace: true//是否替换容器内容
                    , prepend: false //是否往前追加
                    , callback: null //function () { } //渲染完成后的回调函数
                };
                options = $.extend(defaults, options);

                if (options.template instanceof $) {
                    options.template = options.template.html();
                } else {
                    if (options.template.indexOf('{{') < 0) {
                        options.template = $(options.template).html();
                    }
                }

                mustache.parse(options.template);
                var content = mustache.render(options.template, options.view, options.partials);
                if (!(options.container instanceof $)) {
                    options.container = $(options.container);
                }
                if (options.replace == true) {
                    options.container.html(content);
                } else {
                    if (options.prepend) {
                        options.container.prepend(content)
                    } else {
                        options.container.append(content);
                    }
                }

                if (core.helper.getType(options.callback) === 'function') {
                    options.callback({
                        content: content
                        , container: options.container
                        , mustache: mustache
                    });
                }
            });
        };
        var _getEnumerable = function (fn) {
            /// <summary>
            /// 获取linq集合引擎
            /// </summary>
            /// <param name="fn">执行函数（可选）</param>
            /// <returns type="">Enumerable</returns>
            if (!core.g.window.Enumerable) {
                core.helper.warn('未找到对象:Enumerable');
                return;
            }
            fn = core.helper.getFunction(fn);
            if (!fn) {
                return core.g.window.Enumerable;
            } else {
                //fn.call(window, core.g.window.Enumerable);
                core.helper.invokeFunction(fn, core.g.window.Enumerable);
            }
        };
        var _isWindow = function (win) {
            /// <summary>
            /// 判断一个对象是否是window对象
            /// </summary>
            /// <param name="win">需要判断的对象</param>
            /// <returns type="boolean"></returns>
            if (typeof win !== "object") return false;//必须是一个对象
            var expando = "_temp_object_" + (new Date - 0);
            var js = document.createElement("script");
            var head = document.getElementsByTagName("head")[0];
            head.insertBefore(js, head.firstChild);
            js.text = expando + " = {};"
            head.removeChild(js);
            return window[expando] === win[expando];
        };
        var _dateDiff = function (startTime, endTime, diffType) {
            /// <summary>
            /// 计算时间差
            /// </summary>
            /// <param name="startTime">开始时间</param>
            /// <param name="endTime">结束时间</param>
            /// <param name="diffType">差值类型 S/M/H/D</param>
            /// <returns type=""></returns>
            var divNum = 1;
            switch (diffType) {
                case "S":
                    divNum = 1000; break;
                case "M":
                    divNum = 1000 * 60; break;
                case "H":
                    divNum = 1000 * 3600; break;
                case "D":
                    divNum = 1000 * 3600 * 24; break;
                default: break;
            }
            return parseInt((startTime.getTime() - endTime.getTime()) / parseInt(divNum));
        };
        var _removeScript = function (html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
            var handledHtml = div.innerHTML;
            handledHtml = handledHtml.replace(/script>/gi, "").replace(/script&gt;/gi, "");
            return handledHtml;
        };
        var _isNull = function (target) {
            /// <summary>
            /// 指示对象是否是 null、undefined
            /// </summary>
            var t = typeof target;
            if ((target === null && t === 'object') || (target === undefined && t === 'undefined')) {
                return true;
            }
            return false;
        };
        var _encoder = function (str) {
            /// <summary>
            /// base64转码
            /// </summary>
            /// <param name="str" type="type"></param>
            /// <returns type=""></returns>
            return core.g.window.BASE64.encoder(str);
        };
        var _decoder = function (str) {
            /// <summary>
            /// base64解码
            /// </summary>
            /// <param name="str" type="type"></param>
            /// <returns type=""></returns>
            return core.g.window.BASE64.decoder(str);
        };
        var _dateFormat = function (date, opt) {
            /// <summary>
            /// 时间格式化
            /// </summary>
            /// <param name="date" type="type">date</param>
            /// <param name="opt" type="type">暂未扩展</param>
            /// <returns type=""></returns>
            var option = {
                customFormat: false
                , resultFormat: function (d) {
                    core.helper.log(d);
                    return '自定义时间格式';
                }
            };
            $.extend(option, opt);

            var timestamp;
            if (typeof date === 'object' && date.constructor === Date) {
                timestamp = (+date);
            } else {
                if (isNaN(parseInt(date))) {
                    timestamp = Date.parse(date.replace(/-/g, "/"));
                } else {
                    timestamp = parseInt(date);
                }
            }

            var diff;
            var now = new Date();
            var date = new Date(timestamp);

            var y_diff = date.dateDiff('y', now);
            var m_diff = date.dateDiff('m', now);
            var d_diff = date.dateDiff('d', now);
            var h_diff = date.dateDiff('h', now);
            var n_diff = date.dateDiff('n', now);
            var s_diff = date.dateDiff('s', now);

            if (option.customFormat == true) {
                return option.resultFormat({
                    year: y_diff
                    , month: m_diff
                    , day: d_diff
                    , hour: h_diff
                    , minute: n_diff
                    , second: s_diff
                });
            }
            if (y_diff > 0 || m_diff > 0 || d_diff > 0) {
                return date.format('yyyy-MM-dd');
            }
            if (h_diff > 0) {
                return h_diff + '小时前';
            }
            if (n_diff > 0) {
                return n_diff + '分钟前';
            }
            return '刚刚';
        };
        var _queryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) { return decodeURI(r[2]); }
            else { return null; }
        };
        var _getJSON = function (url, data) {
            //get json data sync
            var res = null;
            var opt = {
                url: url
                , async: false
                , success: function (d) {
                    res = d;
                }
            };
            if (data) {
                opt.data = data;
            }

            _ajax(opt);
            return res;
        };
        var _addCookie = function (key, value, expireTime, expireType) {
            /// <summary>
            /// 添加cookie
            /// </summary>
            /// <param name="key" type="type"></param>
            /// <param name="value" type="type"></param>
            /// <param name="expireTime" type="type"></param>
            /// <param name="expireType" type="type">y/M/d/h/m/s</param>
            try {
                expireType = !expireType ? 'm' : expireType;
                expireTime = !expireTime ? 30 : expireTime;

                var ts;
                switch (expireType) {
                    case 'y':
                        ts = expireTime * 365 * 24 * 60 * 60;
                        break;
                    case 'M':
                        ts = expireTime * 30 * 24 * 60 * 60;
                        break;
                    case 'd':
                        ts = expireTime * 24 * 60 * 60;
                        break;
                    case 'h':
                        ts = expireTime * 60 * 60;
                        break;
                    case 'm':
                        ts = expireTime * 60;
                        break;
                    case 's':
                        ts = expireTime;
                        break;
                    case 'ms':
                        ts = expireTime / 1000;
                        break;
                    default:
                        ts = 30 * 60;//default 30 minitues
                        break;
                }

                var exp = new Date();
                exp.setTime(exp.getTime() + ts * 1000);
                document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
                return true;
            } catch (e) {
                throw ('add cookie error:' + e);
                return false;
            }
        };
        var _getCookie = function (key) {
            var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        };
        var _removeCookie = function (key) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var value = _getCookie(key);
            if (value != null)
                document.cookie = key + "=" + value + ";expires=" + exp.toGMTString();
        };
        var _clone = function (obj) {
            /// <summary>
            /// clone obj
            /// </summary>
            /// <param name="obj" type="type"></param>
            /// <returns type=""></returns>
            var o;
            if (typeof obj === "object") {
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            o.push(core.helper.clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (var k in obj) {
                            o[k] = core.helper.clone(obj[k]);
                        }
                    }
                }
            } else {
                o = obj;
            }
            return o;
        };
        var _getType = function (o) {
            var s = Object.prototype.toString.call(o);
            s = s.split(' ')[1];
            return s.substring(0, s.length - 1).toLowerCase();
        };
        var _toDate = function (str, format) {
            /// <summary>
            /// 转换为时间类型
            /// </summary>
            /// <param name="str" type="type"></param>
            /// <param name="format" type="type">时间格式化字符串，如：yyyy-MM-dd HH:mm:ss</param>
            /// <returns type="">format为空时返回值为Date类型，否则返回string</returns>
            try {
                var date = new Date(parseInt(str.replace('/Date(', '').replace(')/', ''), 10));
                if (arguments.length == 1) {
                    return date;
                }

                //format = format || 'yyyy-MM-dd HH:mm:ss';
                //var d = new Date(parseInt(str.substr(6, 13)));
                return date.format(format);
            }
            catch (error) {
                core.helpre.error(error);
                return null;
            }
        };
        var _decToHex = function (str) {
            /// <summary>
            /// 字符转unicode
            /// </summary>
            /// <param name="str" type="type"></param>
            /// <returns type=""></returns>
            var res = [];
            for (var i = 0; i < str.length; i++)
                res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
            return "\\u" + res.join("\\u");
        };
        var _hexToDec = function (str) {
            /// <summary>
            /// unicode转字符
            /// </summary>
            /// <param name="str" type="type"></param>
            /// <returns type=""></returns>
            str = str.replace(/\\/g, "%");
            return unescape(str);
        };
        var _getHash = function (str) {
            /// <summary>
            /// 获取字符串hash
            /// </summary>

            var I64BIT_TABLE =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

            var hash = 5381;
            var i = str.length - 1;

            if (typeof str == 'string') {
                for (; i > -1; i--)
                    hash += (hash << 5) + str.charCodeAt(i);
            }
            else {
                for (; i > -1; i--)
                    hash += (hash << 5) + str[i];
            }
            var value = hash & 0x7FFFFFFF;

            var retValue = '';
            do {
                retValue += I64BIT_TABLE[value & 0x3F];
            }
            while (value >>= 6);

            return retValue;
        };
        var _getFile = function (url, data) {
            /// <summary>
            /// 下载文件
            /// </summary>
            /// <param name="url" type="type"></param>
            /// <param name="data" type="type"></param>

            var $iframe = $('<iframe src="/fileServer/getFile?fileName=' + url + '" style="display:none;"></iframe>');
            $('body').append($iframe);

            //var $form = $('<form>');
            //$form.attr({
            //    'style': 'display:none;'
            //    , 'target': ''
            //    , 'method': 'post'
            //    , 'action': url
            //});
            //$('body').append($form);
            //var o = {};
            //if (core.helper.getType(data) === 'function') {
            //    o = data();
            //}
            //else {
            //    o = data;
            //}
            //if (core.helper.getType(o) === 'object') {
            //    for (var k in o) {
            //        $form.append($('<input>').attr({
            //            type: 'hidden'
            //            , name: k
            //            , value: o[k]
            //        }));
            //    }
            //}
            //if (core.helper.getType($().ajaxSubmit) === 'function') {
            //    $($form).ajaxSubmit({
            //        success: function (res) {
            //            if (res.success) {
            //                $form.attr({
            //                    action: '/fileServer/getFile/'
            //                }).append($('<input>').attr({
            //                    type: 'hidden'
            //                    , name: 'key'
            //                    , value: res.key
            //                })).submit();
            //                setTimeout(function () {
            //                    $form.remove();
            //                }, 5000);
            //            } else {
            //                core.controls.alert(res.message);
            //            }
            //        }
            //    });
            //}
            //else {
            //    core.helper.error('getFile方法依赖jquery.form.js');
            //}
        };
        var _shortText = function (str, length) {
            length = length || 10;
            if (str.length > length) {
                return str.substring(0, length) + '...';
            } else {
                return str;
            }
        };
        var _go = function (url, win, preUrl) {
            win = win || root;
            try {
                preUrl = (preUrl || win.location.href).toLowerCase();
                win.history.pushState(null, null, preUrl);
            } catch (error) { } finally {
                win.location.replace(url);
            }
        };
        var _feeFormat = function (value, type) {
            ///金额千分位格式化
            type = type || 2;

            var result = value;
            if (value < 0)
                value = 0 - value;
            if (/[^0-9\.]/.test(value))
                return "&yen; 0.00";
            if (value == null || value == "null" || value == "")
                return "&yen; 0.00";
            if (type > 0)
                value = new Number(value).toFixed(type);
            value = value.toString().replace(/^(\d*)$/, "$1.");
            value = (value + "00").replace(/(\d*\.\d\d)\d*/, "$1");
            value = value.replace(".", ",");
            var re = /(\d)(\d{3},)/;
            while (re.test(value))
                value = value.replace(re, "$1,$2");
            value = value.replace(/,(\d\d)$/, ".$1");
            if (type == 0) {
                var a = value.split(".");
                if (a[1] == "00") {
                    value = a[0];
                }
            }
            if (result < 0)
                result = "(" + value + ")";
            else
                result = value;
            return '&yen; ' + result;
        };
        var _feeFormatRevert = function (value) {
            //千分位金额格式化还原
            value = value.toString().replace("(", "-").replace(")", "");
            return parseFloat(value.replace(/[^\d\.-]/g, ""));
        };
        return {
            log: _log
            , warn: _warn
            , error: _error
            , getRandom: _getRandom
            , createID: _createID
            , createGUID: _createGUID
            , getFunction: _getFunction
            , invokeFunction: _invokeFunction
            , invoke: _invokeFunction
            , ajax: _ajax
            , htmlDecode: _htmlDecode
            , getCombination: _getCombination
            , replaceEnter: _replaceEnter
            , getMustache: _getMustache
            , mustacheRender: _mustacheRender
            , getEnumerable: _getEnumerable
            , getLinq: _getEnumerable //alias of getEnumerable
            , isWindow: _isWindow
            , dateDiff: _dateDiff
            , removeScript: _removeScript
            , isNull: _isNull
            , encoder: _encoder
            , decoder: _decoder
            , dateFormat: _dateFormat
            , queryString: _queryString
            , getJSON: _getJSON
            , addCookie: _addCookie
            , getCookie: _getCookie
            , removeCookie: _removeCookie
            , clone: _clone
            , getType: _getType
            , typeof: _getType
            , toDate: _toDate
            , toHex: _decToHex
            , toDec: _hexToDec
            , getHash: _getHash
            , getFile: _getFile
            , shortText: _shortText
            , storage: _storage
            , go: _go
            , feeFormat: _feeFormat
            , feeFormatRevert: _feeFormatRevert
        };
    })();

    //#endregion

    var Space = function (win) {
        var root = this;
        var spaceId = core.helper.encoder(win.location.href); //core.helper.createGUID();
        var _init = function () {
            var deviceAgent = navigator.userAgent.toLowerCase();
            var agent = (deviceAgent.match(/(iphone|ipod|ipad)/) ||
                deviceAgent.match(/iphone/i) ||
                deviceAgent.match(/ipad/i) ||
                deviceAgent.match(/ipod/i));
            this.device = {
                ios: (agent != null && agent.length > 0)
            };

            //win.onerror = _onerror;
            _extention();
            core.helper.log('init space');
            (function () {
                //事件订阅
                var o = $(win);
                core.subscribe = function () {
                    o.on.apply(o, arguments);
                };
                core.unsubscribe = function () {
                    o.off.apply(o, arguments);
                };
                core.publish = function () {
                    o.trigger.apply(o, arguments);
                };
            })();
            $(win.document).on('click', '*[' + core.constant.COMMAND_KEY + ']', function (e) {
                var $target = $(this);
                var _args = $target.attr(core.constant.COMMAND_ARGS);
                if (_args != null && _args != '') {
                    try {
                        if (_args.substr(0, 1) === '{') {
                            _args = $.parseJSON(_args.replace(/'/g, '"'));
                        }
                    } catch (err) { }
                }

                var cmdtrigger = core.helper.getFunction(core.constant.FUNCTION_COMMAND_TRIGGER);
                if (cmdtrigger != null) {
                    cmdtrigger.call(win, {
                        target: $target
                        , cmd: $target.attr(core.constant.COMMAND_KEY)
                        , args: _args
                    });
                }

                $(event_handles).each(function (index, item) {
                    item.call(win, {
                        target: $target
                        , cmd: $target.attr(core.constant.COMMAND_KEY)
                        , args: _args
                    });
                });
            });
            var handler = function () {
                var startup = core.helper.getFunction(core.constant.FUNCTION_STARTUP, win);
                if (null != startup) {
                    startup.call(win, { window: win });
                    return true;
                }
            };
            if (!handler()) {
                var count = 3, interval, recursive;
                recursive = function () {
                    interval = setInterval(function () {
                        if (count > 0) {
                            count--;
                            if (!handler()) {
                                recursive();
                            } else {
                                clearInterval(interval);
                            }
                        } else {
                            clearInterval(interval);
                        }
                    }, 100);
                };
                recursive();
            }
            core.helper.log('end init space');
        };
        var _extention = function () {
            /// <summary>
            /// 类型扩展
            /// </summary>

            //#region object
            //object对象不可随便扩展方法，系统其他地方可能会遍历object对象属性（包含jquery的each），此时会造成错误：matchExpr[type].exec is not a function
            //#endregion

            //#region string

            String.prototype.toDate = function () {
                try {
                    var date = new Date(this.replace("/Date(", "").replace(")/", ""));
                    if (date.getFullYear() === 1970) {
                        return core.helper.toDate(this);
                    }
                    return date;
                } catch (err) { }
                return core.helper.toDate(this);
            };

            String.prototype.dateFormat = function () {
                var date = new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10));
                //月份为0-11，所以+1，月份小于10时补个0
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                return date.getFullYear() + "-" + month + "-" + currentDate;
            };

            String.prototype.format = function (params) {
                /// <summary>
                /// 将指定字符串中的格式项替换为指定数组中相应对象的字符串表示形式。
                /// </summary>
                /// <param name="params">可使用索引占位符或键值占位符</param>
                var result = this;
                if (arguments.length > 0) {
                    if (arguments.length == 1 && typeof (params) == "object") {
                        for (var key in params) {
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, params[key] ? params[key] : "");
                        }
                    } else {
                        for (var i = 0; i < arguments.length; i++) {
                            var reg = new RegExp("({[" + i + "]})", "g");
                            result = result.replace(reg, arguments[i] ? arguments[i] : "");
                        }
                    }
                }
                return result;
            };

            String.prototype.encodeXml = function () {
                /// <summary>
                /// 转XML
                /// </summary>
                return $("<div/>").html(this.toString()).text();
            };

            String.prototype.decodeXml = function () {
                /// <summary>
                /// 解析XML
                /// </summary>
                return $("<div/>").text(this.toString()).html();
            };

            String.prototype.getByteLength = function () {
                /// <summary>
                /// 获取字节长度
                /// </summary>
                return core.helper.getByteLength(this);
            };

            String.prototype.ltrim = function () {
                /// <summary>
                /// 去除字符串左侧空白字符
                /// </summary>
                if (!core.helper.isNullOrUndefined(this)) {
                    return this.replace(/(^\s*)/g, "");
                }
                return '';
            };

            String.prototype.rtrim = function () {
                /// <summary>
                /// 去除字符串右侧空白字符
                /// </summary>
                if (!core.helper.isNullOrUndefined(this)) {
                    return this.replace(/(\s*$)/g, "");
                }
                return '';
            };

            String.prototype.isNullOrEmpty = String.prototype.isNullOrWhiteSpace = function () {
                /// <summary>
                /// 指示指定的字符串是 null、空还是仅由空白字符组成。
                /// </summary>
                if (!core.helper.isNullOrUndefined(this)) {
                    if (this.constructor.name.toLowerCase() == 'string' && this.trim().length == 0) {
                        return true;
                    }
                }
                return false;
            };

            //#endregion

            //#region date

            Date.prototype.format = function (formatStr) {
                /// <summary>
                /// <para>函数：格式化日期</para>
                /// <para>d：将日显示为不带前导零的数字，如1</para>
                /// <para>dd：将日显示为带前导零的数字，如01</para>
                /// <para>ddd：将日显示为缩写形式，如Sun</para>
                /// <para>dddd：将日显示为全名，如Sunday</para>
                /// <para>M：将月份显示为不带前导零的数字，如一月显示为1</para>
                /// <para>MM：将月份显示为带前导零的数字，如01</para>
                /// <para>MMM：将月份显示为缩写形式，如Jan</para>
                /// <para>MMMM：将月份显示为完整月份名，如January</para>
                /// <para>yy：以两位数字格式显示年份</para>
                /// <para>yyyy：以四位数字格式显示年份</para>
                /// <para>h：使用12小时制将小时显示为不带前导零的数字，注意 || 的用法</para>
                /// <para>hh：使用12小时制将小时显示为带前导零的数字</para>
                /// <para>H：使用24小时制将小时显示为不带前导零的数字</para>
                /// <para>HH：使用24小时制将小时显示为带前导零的数字</para>
                /// <para>m：将分钟显示为不带前导零的数字</para>
                /// <para>mm：将分钟显示为带前导零的数字</para>
                /// <para>s：将秒显示为不带前导零的数字</para>
                /// <para>ss：将秒显示为带前导零的数字</para>
                /// <para>l：将毫秒显示为不带前导零的数字</para>
                /// <para>ll：将毫秒显示为带前导零的数字</para>
                /// <para>tt：显示am / pm</para>
                /// <para>TT：显示AM / PM</para>
                /// </summary>
                /// <param name="formatStr">格式化字符串</param>
                /// <returns type="string"></returns>
                var date = this;
                var zeroize = function (value, length) {
                    if (!length) {
                        length = 2;
                    }
                    value = new String(value);
                    for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                        zeros += '0';
                    }
                    return zeros + value;
                };
                return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {
                    switch ($0) {
                        case 'd': return date.getDate();
                        case 'dd': return zeroize(date.getDate());
                        case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
                        case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
                        case 'M': return date.getMonth() + 1;
                        case 'MM': return zeroize(date.getMonth() + 1);
                        case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
                        case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
                        case 'yy': return new String(date.getFullYear()).substr(2);
                        case 'yyyy': return date.getFullYear();
                        case 'h': return date.getHours() % 12 || 12;
                        case 'hh': return zeroize(date.getHours() % 12 || 12);
                        case 'H': return date.getHours();
                        case 'HH': return zeroize(date.getHours());
                        case 'm': return date.getMinutes();
                        case 'mm': return zeroize(date.getMinutes());
                        case 's': return date.getSeconds();
                        case 'ss': return zeroize(date.getSeconds());
                        case 'l': return date.getMilliseconds();
                        case 'll': return zeroize(date.getMilliseconds());
                        case 'tt': return date.getHours() < 12 ? 'am' : 'pm';
                        case 'TT': return date.getHours() < 12 ? 'AM' : 'PM';
                    }
                });
            }

            Date.prototype.dateDiff = function (interval, objDate2) {
                var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
                i['y'] = objDate2.getFullYear() - d.getFullYear();
                i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
                i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
                i['ms'] = objDate2.getTime() - d.getTime();
                i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
                i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
                i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
                i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
                i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
                return i[interval];
            }

            //#endregion

            //#region array

            Array.prototype.extend = function (funcArrs) {
                for (var i = 0; i < this.length; i++) {
                    var item = this[i];
                    for (var func in funcArrs) {
                        if (funcArrs.hasOwnProperty(func) && typeof funcArrs[func] == "function") {
                            item[func] = funcArrs[func];
                        }
                    }
                }
            }

            //#endregion

            //#region jquery

            var placeholderSupport = 'placeholder' in document.createElement('input');
            $.fn.serializeObject = function () {
                var o = {};
                var eleForm = this;
                var a = this.serializeArray();
                $.each(a, function () {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        if (!placeholderSupport) {
                            var placeh = eleForm.find("[name='" + this.name + "']").attr("placeholder");
                            if (this.value == placeh) {
                                o[this.name] = '';
                            }
                            else {
                                o[this.name] = this.value || '';
                            }
                        }
                        else {
                            o[this.name] = this.value || '';
                        }
                    }
                });
                return o;
            };

            //#endregion

            //$.fn.tula = function () {
            //    //图啦  by zhangw 2017-7-17
            //    //功能：用于检测图片是否已成功加载，否则，会进行3次自检
            //    $(this).each(function () {
            //        var that = this;
            //        if (that.tagName.toLowerCase() != 'img' || that.complete || that.attributes.tula) { return true; }
            //        var src = that.src;
            //        var img = new Image();
            //        img.onload = function (e) {
            //            if (that.attributes.tula) { return; }
            //            that.src = src;
            //            that.attributes.tula = true;
            //        };
            //        img.onerror = function (e) {
            //            loop(src);
            //        };
            //        var i = 3;
            //        var loop = function (src) {
            //            i--;
            //            if (i <= 0) {
            //                B.Helper.alert('图片[' + src + ']无法加载');
            //                return;
            //            }
            //            img.src = '';
            //            img.src = src;
            //        };
            //        img.src = src;
            //    });
            //};
        };
        var _onError = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
            if (!window.console || !window.console.error) { return; }
            console.error("错误信息：", errorMessage);
            console.error("出错文件：", scriptURI);
            console.error("出错行号：", lineNumber);
            console.error("出错列号：", columnNumber);
            console.error("错误详情：", errorObj);
        };
        _init();
        return {
            id: spaceId
            , window: win
        };
    };

    //#region banana.controls

    core.controls = (function () {
        var _confirm = function (content, options, yes, cancel) {
            var defaults = {
                closeBtn: 0
                , anim: 2
                //, skin: 'layui-layer-molv' //样式类名
            };

            var opt = {};
            if (arguments.length == 2) {
                yes = arguments[1];
                opt = $.extend({}, defaults)
            } else {
                opt = $.extend({}, defaults, options);
            }

            _layer().confirm(content, opt, function (index) {
                yes();
                _layer().close(index);
            }, cancel);
        };
        var _alert = function (content, options, yes) {
            var defaults = {
                closeBtn: 0
                , anim: 2
                //, skin: 'layui-layer-molv' //样式类名
            };
            _layer().alert(content, $.extend({}, defaults, options), yes);
        };
        var _tips = function (content, follow, options) {
            var defaults = {
                tips: 1
            };

            if (window.layer == null) {
                window.layer = _layer();
            }
            window.layer.tips(content, follow, $.extend({}, defaults, options));
        };
        var _msg = function (content, options, end) {
            var defaults = {
                anim: 6
            };
            _layer().msg(content, $.extend({}, defaults, options), end);
        };
        var _open = function (options) {
            var defaults = {
                type: 2
                //, skin:  'layui-layer-molv' //'layui-layer-lan'
                , title: '标题'
                , shadeClose: false
                //, closeBtn: 0
                , shade: 0.5
                , anim: 2
                , resize: false
                , area: ['500px', '400px']
                , content: ''
                , btn: ['确定']
                , yes: function (index, layero) {
                    _close(index);
                }
                , success: function (layero, index) { }
                , top: true //是否最外层弹窗
                , onClose: null //关闭弹窗时的回调
                , cancel: function (index, layero) {
                    core.helper.invokeFunction(opt.onClose);
                }
            };
            var opt = $.extend({}, defaults, options);
            var index = ((opt.top === true ? window.top : window).layer).open(opt);
            root['layer_iframe_onclose' + index] = opt.onClose;
            return index;
        };
        var _close = function (index) {
            if (index == null) {
                //var getIndex = function (win) {
                //    if (win.layer == null) {
                //        return null;
                //    }

                //    var i = win.layer.getFrameIndex(window.name);
                //    if (i == null) {
                //        var r;
                //        $(win.document.body).find('iframe').each(function (index, item) {
                //            r = getIndex(item.contentWindow);
                //            if (r !== null) {
                //                return false;
                //            }
                //        });
                //        return r;
                //    }
                //    return {
                //        i: i,
                //        w: win
                //    };
                //};
                //var result = getIndex(window.top);
                //if (result == null) {
                //    window.parent.layer.close(window.parent.layer.getFrameIndex(window.name));
                //} else {
                //    result.w.layer.close(result.i);
                //}
                var layer = window.parent.layer;
                var i = layer.getFrameIndex(window.name);
                layer.close(i);
                core.helper.invokeFunction(root.parent['layer_iframe_onclose' + i]);
            }
            else {
                _layer().close(index);
            }
        };
        var _prompt = function (options, callback) {
            var defaults = {
                title: '标题'
                , formType: 2
                , shadeClose: false
                //, closeBtn: 0
                , shade: 0.5
                , anim: 2
                //, value: remark
            };
            _layer().prompt($.extend({}, defaults, options), callback);
        };
        var _layer = function (callback) {
            var layer = window.top.layer;
            if ($.isFunction(callback)) {
                core.helper.invokeFunction(callback, layer);
            } else {
                return layer;
            }
        };
        var _loading = function (options) {
            var defaults = {
                shade: [0.2, '#666']
                , time: 30 * 1000
            };
            return window.top.layer.load(2, $.extend(true, {}, defaults, options));
        };
        return {
            confirm: _confirm
            , alert: _alert
            , msg: _msg
            , tips: _tips
            , open: _open
            , close: _close
            , prompt: _prompt
            , layer: _layer
            , loading: _loading
        }
    })();

    //#endregion

    //#region banana.thread

    core.thread = (function () {
        var _detection = function () {
            if (!window.Worker) {
                var paths = document.getElementsByTagName("script"),
                    srcPath = paths[paths.length - 1].src;

                window.getThreadPath = function (path) {
                    return srcPath.replace(/[^\/]*$/, path);
                }

                window.Worker = function (src) {
                    var iframe = document.createElement("iframe");
                    iframe.style.cssText = "visibility:hidden;";
                    document.body.appendChild(iframe);
                    var text = ['<html><head>',
                        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
                        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
                        '</head></html>'].join();
                    var doc = iframe.contentWindow.document, head, script;
                    doc.open();
                    doc.write(text);
                    doc.close();

                    var jsFile = getThreadPath(src);
                    head = doc.getElementsByTagName("head")[0];
                    script = doc.createElement("script");
                    script.type = "text/javascript";
                    script.src = jsFile;
                    head.appendChild(script);

                    this._win = iframe.contentWindow;
                    var self = this;
                    this._win.postMessage = function (msg) {
                        self.onmessage({ data: msg });
                    }
                }

                Worker.prototype.postMessage = function (msg) {
                    var _win = this._win, self = this;

                    var timer = setInterval(function () {
                        if (_win.onmessage) {
                            //IE兼容模式下不允许直接调用onmessage方法
                            _win.onmessage2 = _win.onmessage;
                            _win.onmessage2({ data: msg });
                            self.postMessage = function (msg) {
                                _win.onmessage2({ data: msg });
                            }
                            clearInterval(timer);
                        }
                    }, 100);
                }

                Worker.prototype.onmessage = function (evt) {
                    //console.log(evt);
                }

                window.Worker = Worker;
            }
        };

        var WorkerThread = function (data) {
            this._worker = new Worker("/assets/js/banana.thread.js");
            this._completes = {};
            this._task_id = 0;
            this.data = data || {};

            var self = this;
            this._worker.onmessage = function (evt) {
                var ret = evt.data;
                if (ret.__UI_TASK__) {
                    //run on ui task
                    var fn = (new Function("return " + ret.__UI_TASK__))();
                    fn(ret.data);
                } else {
                    self.data = ret.data;
                    self._completes[ret.taskId] && self._completes[ret.taskId](ret);
                }
            }
        };

        WorkerThread.prototype.run = function (task, complete) {
            var _task = {
                __THREAD_TASK__: task.toString(),
                data: this.data,
                taskId: this._task_id
            };
            this._completes[this._task_id++] = complete;
            this._worker.postMessage(_task);
        };

        var _startNew = function (sharedObj) {
            /// <summary>
            /// 创建一个线程内的任务
            /// </summary>
            /// <param name="sharedObj">共享对象[选填]</param>
            /// <returns type="WorkerThread"></returns>

            _detection();
            if (!window.Worker) {
                return {
                    run: function () {
                        alert('您的浏览器不支持websocket');
                    }
                }
            }
            else {
                return new WorkerThread(sharedObj);
            }
        };

        return {
            start: _startNew
        }
    })();

    //#endregion

    //#region banana.call

    core.call = (function () {
        var events = [];
        var inited = false;
        var win = window;
        var handler = function () {
            if (inited) { return; }
            for (var i = 0; i < events.length; i++) {
                events[i].call(win, { 'window': win, 'initialization': true });
            }
            inited = true;
            delete events;
        };
        $(function () {
            if (!win.banana.space) {
                var space = new Space(win);
                core.space = space;
            }
            core.helper.log('banana call');
            handler();
            core.helper.log('end banana call');
        });
        return function (callback) {
            /// <summary>
            /// Banana启动方法
            /// </summary>
            /// <param name="fn">方法</param>
            if (core.helper.getFunction(callback) === null) { return; }
            if (inited) {
                core.helper.log('banana call');
                callback.call(win, { 'window': win, 'initialization': false });
                core.helper.log('end banana call');
            }
            else { events.push(callback); }
        }
    })();

    //#endregion

    //#region banana.debug

    core.debug = (function () {
        /// <summary>
        /// debug mode
        /// </summary>
        return function (callback) {
            if (DEBUG === true) {
                core.helper.log('Debug模式下调用测试函数');
                core.helper.invokeFunction(callback);
            }
        }
    })();

    //#endregion

    var event_handles = [];
    core.on = (function () {
        return function (fn) {
            if ($.isFunction(fn)) {
                event_handles.push(fn);
            }
        }
    })();

    //set alias name
    root.banana = core;
    var noop = function () { core.helper.log('noop call'); };
    //the first call to initialize space
    core.call($ ? ($.noop ? $.noop : noop) : noop);

    //$.ajaxSettings.beforeSend = function (xhr, request) {
    //    //console.log( request.headers )
    //    // 在这里加上你的 token
    //    //xhr.setRequestHeader('token', '88888888');
    //    //loading层
    //    if (core.helper.getType(root['layer']) === 'object') {
    //        var index = root.layer.load(1, {
    //            shade: [0.5, '#000']
    //        });
    //        xhr.complete = (function (i) {
    //            return function () {
    //                root.layer.close(i);
    //            }
    //        })(index);
    //    }
    //};
});