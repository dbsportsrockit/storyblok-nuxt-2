import { ref as L, customRef as H, onServerPrefetch as V, onBeforeMount as M, getCurrentInstance as q, reactive as J, isReactive as B, set as Y, isRef as X, onMounted as G } from "vue";
let O = !1;
const I = [], W = (s) => new Promise((t, e) => {
  if (typeof window > "u" || (window.storyblokRegisterEvent = (o) => {
    if (window.location === window.parent.location) {
      console.warn("You are not in Draft Mode or in the Visual Editor.");
      return;
    }
    O ? o() : I.push(o);
  }, document.getElementById("storyblok-javascript-bridge")))
    return;
  const r = document.createElement("script");
  r.async = !0, r.src = s, r.id = "storyblok-javascript-bridge", r.onerror = (o) => e(o), r.onload = (o) => {
    I.forEach((n) => n()), O = !0, t(o);
  }, document.getElementsByTagName("head")[0].appendChild(r);
});
var Q = Object.defineProperty, Z = (s, t, e) => t in s ? Q(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, u = (s, t, e) => (Z(s, typeof t != "symbol" ? t + "" : t, e), e);
function N(s) {
  return !(s !== s || s === 1 / 0 || s === -1 / 0);
}
function tt(s, t, e) {
  if (!N(t))
    throw new TypeError("Expected `limit` to be a finite number");
  if (!N(e))
    throw new TypeError("Expected `interval` to be a finite number");
  const r = [];
  let o = [], n = 0;
  const i = function() {
    n++;
    const a = setTimeout(function() {
      n--, r.length > 0 && i(), o = o.filter(function(h) {
        return h !== a;
      });
    }, e);
    o.indexOf(a) < 0 && o.push(a);
    const c = r.shift();
    c.resolve(s.apply(c.self, c.args));
  }, l = function(...a) {
    const c = this;
    return new Promise(function(h, p) {
      r.push({
        resolve: h,
        reject: p,
        args: a,
        self: c
      }), n < t && i();
    });
  };
  return l.abort = function() {
    o.forEach(clearTimeout), o = [], r.forEach(function(a) {
      a.reject(function() {
        Error.call(this, "Throttled function aborted"), this.name = "AbortError";
      });
    }), r.length = 0;
  }, l;
}
const et = function(s, t) {
  const e = {};
  for (const r in s) {
    const o = s[r];
    t.indexOf(r) > -1 && o !== null && (e[r] = o);
  }
  return e;
}, st = (s) => s === "email", rt = () => ({
  singleTag: "hr"
}), ot = () => ({
  tag: "blockquote"
}), nt = () => ({
  tag: "ul"
}), it = (s) => ({
  tag: [
    "pre",
    {
      tag: "code",
      attrs: s.attrs
    }
  ]
}), at = () => ({
  singleTag: "br"
}), ct = (s) => ({
  tag: `h${s.attrs.level}`
}), lt = (s) => ({
  singleTag: [
    {
      tag: "img",
      attrs: et(s.attrs, ["src", "alt", "title"])
    }
  ]
}), ht = () => ({
  tag: "li"
}), ut = () => ({
  tag: "ol"
}), ft = () => ({
  tag: "p"
}), pt = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        ["data-type"]: "emoji",
        ["data-name"]: s.attrs.name,
        emoji: s.attrs.emoji
      }
    }
  ]
}), dt = () => ({
  tag: "b"
}), gt = () => ({
  tag: "strike"
}), yt = () => ({
  tag: "u"
}), mt = () => ({
  tag: "strong"
}), bt = () => ({
  tag: "code"
}), vt = () => ({
  tag: "i"
}), _t = (s) => {
  const t = { ...s.attrs }, { linktype: e = "url" } = s.attrs;
  if (st(e) && (t.href = `mailto:${t.href}`), t.anchor && (t.href = `${t.href}#${t.anchor}`, delete t.anchor), t.custom) {
    for (const r in t.custom)
      t[r] = t.custom[r];
    delete t.custom;
  }
  return {
    tag: [
      {
        tag: "a",
        attrs: t
      }
    ]
  };
}, $t = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: s.attrs
    }
  ]
}), kt = () => ({
  tag: "sub"
}), wt = () => ({
  tag: "sup"
}), xt = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: s.attrs
    }
  ]
}), St = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        style: `background-color:${s.attrs.color};`
      }
    }
  ]
}), Rt = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        style: `background-color:${s.attrs.color}`
      }
    }
  ]
}), Tt = {
  nodes: {
    horizontal_rule: rt,
    blockquote: ot,
    bullet_list: nt,
    code_block: it,
    hard_break: at,
    heading: ct,
    image: lt,
    list_item: ht,
    ordered_list: ut,
    paragraph: ft,
    emoji: pt
  },
  marks: {
    bold: dt,
    strike: gt,
    underline: yt,
    strong: mt,
    code: bt,
    italic: vt,
    link: _t,
    styled: $t,
    subscript: kt,
    superscript: wt,
    anchor: xt,
    highlight: St,
    textStyle: Rt
  }
}, Ct = function(s) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, e = /[&<>"']/g, r = RegExp(e.source);
  return s && r.test(s) ? s.replace(e, (o) => t[o]) : s;
};
class $ {
  constructor(t) {
    u(this, "marks"), u(this, "nodes"), t || (t = Tt), this.marks = t.marks || [], this.nodes = t.nodes || [];
  }
  addNode(t, e) {
    this.nodes[t] = e;
  }
  addMark(t, e) {
    this.marks[t] = e;
  }
  render(t, e = { optimizeImages: !1 }) {
    if (t && t.content && Array.isArray(t.content)) {
      let r = "";
      return t.content.forEach((o) => {
        r += this.renderNode(o);
      }), e.optimizeImages ? this.optimizeImages(r, e.optimizeImages) : r;
    }
    return console.warn(
      "The render method must receive an object with a content field, which is an array"
    ), "";
  }
  optimizeImages(t, e) {
    let r = 0, o = 0, n = "", i = "";
    typeof e != "boolean" && (typeof e.width == "number" && e.width > 0 && (n += `width="${e.width}" `, r = e.width), typeof e.height == "number" && e.height > 0 && (n += `height="${e.height}" `, o = e.height), (e.loading === "lazy" || e.loading === "eager") && (n += `loading="${e.loading}" `), typeof e.class == "string" && e.class.length > 0 && (n += `class="${e.class}" `), e.filters && (typeof e.filters.blur == "number" && e.filters.blur >= 0 && e.filters.blur <= 100 && (i += `:blur(${e.filters.blur})`), typeof e.filters.brightness == "number" && e.filters.brightness >= -100 && e.filters.brightness <= 100 && (i += `:brightness(${e.filters.brightness})`), e.filters.fill && (e.filters.fill.match(/[0-9A-Fa-f]{6}/g) || e.filters.fill === "transparent") && (i += `:fill(${e.filters.fill})`), e.filters.format && ["webp", "png", "jpeg"].includes(e.filters.format) && (i += `:format(${e.filters.format})`), typeof e.filters.grayscale == "boolean" && e.filters.grayscale && (i += ":grayscale()"), typeof e.filters.quality == "number" && e.filters.quality >= 0 && e.filters.quality <= 100 && (i += `:quality(${e.filters.quality})`), e.filters.rotate && [90, 180, 270].includes(e.filters.rotate) && (i += `:rotate(${e.filters.rotate})`), i.length > 0 && (i = "/filters" + i))), n.length > 0 && (t = t.replace(/<img/g, `<img ${n.trim()}`));
    const l = r > 0 || o > 0 || i.length > 0 ? `${r}x${o}${i}` : "";
    return t = t.replace(
      /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g,
      `a.storyblok.com/f/$1/$2.$3/m/${l}`
    ), typeof e != "boolean" && (e.sizes || e.srcset) && (t = t.replace(/<img.*?src=["|'](.*?)["|']/g, (a) => {
      var c, h;
      const p = a.match(
        /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g
      );
      if (p && p.length > 0) {
        const f = {
          srcset: (c = e.srcset) == null ? void 0 : c.map((d) => {
            if (typeof d == "number")
              return `//${p}/m/${d}x0${i} ${d}w`;
            if (typeof d == "object" && d.length === 2) {
              let k = 0, E = 0;
              return typeof d[0] == "number" && (k = d[0]), typeof d[1] == "number" && (E = d[1]), `//${p}/m/${k}x${E}${i} ${k}w`;
            }
          }).join(", "),
          sizes: (h = e.sizes) == null ? void 0 : h.map((d) => d).join(", ")
        };
        let g = "";
        return f.srcset && (g += `srcset="${f.srcset}" `), f.sizes && (g += `sizes="${f.sizes}" `), a.replace(/<img/g, `<img ${g.trim()}`);
      }
      return a;
    })), t;
  }
  renderNode(t) {
    const e = [];
    t.marks && t.marks.forEach((o) => {
      const n = this.getMatchingMark(o);
      n && e.push(this.renderOpeningTag(n.tag));
    });
    const r = this.getMatchingNode(t);
    return r && r.tag && e.push(this.renderOpeningTag(r.tag)), t.content ? t.content.forEach((o) => {
      e.push(this.renderNode(o));
    }) : t.text ? e.push(Ct(t.text)) : r && r.singleTag ? e.push(this.renderTag(r.singleTag, " /")) : r && r.html ? e.push(r.html) : t.type === "emoji" && e.push(this.renderEmoji(t)), r && r.tag && e.push(this.renderClosingTag(r.tag)), t.marks && t.marks.slice(0).reverse().forEach((o) => {
      const n = this.getMatchingMark(o);
      n && e.push(this.renderClosingTag(n.tag));
    }), e.join("");
  }
  renderTag(t, e) {
    return t.constructor === String ? `<${t}${e}>` : t.map((r) => {
      if (r.constructor === String)
        return `<${r}${e}>`;
      {
        let o = `<${r.tag}`;
        if (r.attrs)
          for (const n in r.attrs) {
            const i = r.attrs[n];
            i !== null && (o += ` ${n}="${i}"`);
          }
        return `${o}${e}>`;
      }
    }).join("");
  }
  renderOpeningTag(t) {
    return this.renderTag(t, "");
  }
  renderClosingTag(t) {
    return t.constructor === String ? `</${t}>` : t.slice(0).reverse().map((e) => e.constructor === String ? `</${e}>` : `</${e.tag}>`).join("");
  }
  getMatchingNode(t) {
    const e = this.nodes[t.type];
    if (typeof e == "function")
      return e(t);
  }
  getMatchingMark(t) {
    const e = this.marks[t.type];
    if (typeof e == "function")
      return e(t);
  }
  renderEmoji(t) {
    if (t.attrs.emoji)
      return t.attrs.emoji;
    const e = [
      {
        tag: "img",
        attrs: {
          src: t.attrs.fallbackImage,
          draggable: "false",
          loading: "lazy",
          align: "absmiddle"
        }
      }
    ];
    return this.renderTag(e, " /");
  }
}
class x {
  constructor() {
    u(this, "isCDNUrl", (t = "") => t.indexOf("/cdn/") > -1), u(this, "getOptionsPage", (t, e = 25, r = 1) => ({
      ...t,
      per_page: e,
      page: r
    })), u(this, "delay", (t) => new Promise((e) => setTimeout(e, t))), u(this, "arrayFrom", (t = 0, e) => [...Array(t)].map(e)), u(this, "range", (t = 0, e = t) => {
      const r = Math.abs(e - t) || 0, o = t < e ? 1 : -1;
      return this.arrayFrom(r, (n, i) => i * o + t);
    }), u(this, "asyncMap", async (t, e) => Promise.all(t.map(e))), u(this, "flatMap", (t = [], e) => t.map(e).reduce((r, o) => [...r, ...o], []));
  }
  stringify(t, e, r) {
    const o = [];
    for (const n in t) {
      if (!Object.prototype.hasOwnProperty.call(t, n))
        continue;
      const i = t[n], l = r ? "" : encodeURIComponent(n);
      let a;
      typeof i == "object" ? a = this.stringify(
        i,
        e ? e + encodeURIComponent("[" + l + "]") : l,
        Array.isArray(i)
      ) : a = (e ? e + encodeURIComponent("[" + l + "]") : l) + "=" + encodeURIComponent(i), o.push(a);
    }
    return o.join("&");
  }
  getRegionURL(t) {
    const e = "api.storyblok.com", r = "api-us.storyblok.com", o = "app.storyblokchina.cn";
    switch (t) {
      case "us":
        return r;
      case "cn":
        return o;
      default:
        return e;
    }
  }
}
class jt {
  constructor(t) {
    u(this, "baseURL"), u(this, "timeout"), u(this, "headers"), u(this, "responseInterceptor"), u(this, "fetch"), u(this, "ejectInterceptor"), u(this, "url"), u(this, "parameters"), this.baseURL = t.baseURL, this.headers = t.headers || new Headers(), this.timeout = t != null && t.timeout ? t.timeout * 1e3 : 0, this.responseInterceptor = t.responseInterceptor, this.fetch = (...e) => t.fetch ? t.fetch(...e) : fetch(...e), this.ejectInterceptor = !1, this.url = "", this.parameters = {};
  }
  get(t, e) {
    return this.url = t, this.parameters = e, this._methodHandler("get");
  }
  post(t, e) {
    return this.url = t, this.parameters = e, this._methodHandler("post");
  }
  put(t, e) {
    return this.url = t, this.parameters = e, this._methodHandler("put");
  }
  delete(t, e) {
    return this.url = t, this.parameters = e, this._methodHandler("delete");
  }
  async _responseHandler(t) {
    const e = [], r = {
      data: {},
      headers: {},
      status: 0,
      statusText: ""
    };
    t.status !== 204 && await t.json().then((o) => {
      r.data = o;
    });
    for (const o of t.headers.entries())
      e[o[0]] = o[1];
    return r.headers = { ...e }, r.status = t.status, r.statusText = t.statusText, r;
  }
  async _methodHandler(t) {
    let e = `${this.baseURL}${this.url}`, r = null;
    if (t === "get") {
      const a = new x();
      e = `${this.baseURL}${this.url}?${a.stringify(
        this.parameters
      )}`;
    } else
      r = JSON.stringify(this.parameters);
    const o = new URL(e), n = new AbortController(), { signal: i } = n;
    let l;
    this.timeout && (l = setTimeout(() => n.abort(), this.timeout));
    try {
      const a = await this.fetch(`${o}`, {
        method: t,
        headers: this.headers,
        body: r,
        signal: i
      });
      this.timeout && clearTimeout(l);
      const c = await this._responseHandler(a);
      return this.responseInterceptor && !this.ejectInterceptor ? this._statusHandler(this.responseInterceptor(c)) : this._statusHandler(c);
    } catch (a) {
      return {
        message: a
      };
    }
  }
  eject() {
    this.ejectInterceptor = !0;
  }
  _statusHandler(t) {
    const e = /20[0-6]/g;
    return new Promise((r, o) => {
      if (e.test(`${t.status}`))
        return r(t);
      const n = {
        message: new Error(t.statusText),
        status: t.status,
        response: Array.isArray(t.data) ? t.data[0] : t.data.error || t.data.slug
      };
      o(n);
    });
  }
}
let v = {};
const m = {};
class Pt {
  constructor(t, e) {
    if (u(this, "client"), u(this, "maxRetries"), u(this, "throttle"), u(this, "accessToken"), u(this, "cache"), u(this, "helpers"), u(this, "resolveCounter"), u(this, "relations"), u(this, "links"), u(this, "richTextResolver"), u(this, "resolveNestedRelations"), !e) {
      const n = new x().getRegionURL, i = t.https === !1 ? "http" : "https";
      t.oauthToken ? e = `${i}://${n(t.region)}/v1` : e = `${i}://${n(t.region)}/v2`;
    }
    const r = new Headers();
    r.set("Content-Type", "application/json"), r.set("Accept", "application/json"), r.forEach((n, i) => {
      t.headers && t.headers[i] && r.set(i, t.headers[i]);
    });
    let o = 5;
    t.oauthToken && (r.set("Authorization", t.oauthToken), o = 3), t.rateLimit && (o = t.rateLimit), t.richTextSchema ? this.richTextResolver = new $(t.richTextSchema) : this.richTextResolver = new $(), t.componentResolver && this.setComponentResolver(t.componentResolver), this.maxRetries = t.maxRetries, this.throttle = tt(this.throttledRequest, o, 1e3), this.accessToken = t.accessToken || "", this.relations = {}, this.links = {}, this.cache = t.cache || { clear: "manual" }, this.helpers = new x(), this.resolveCounter = 0, this.resolveNestedRelations = t.resolveNestedRelations || !0, this.client = new jt({
      baseURL: e,
      timeout: t.timeout || 0,
      headers: r,
      responseInterceptor: t.responseInterceptor,
      fetch: t.fetch
    });
  }
  setComponentResolver(t) {
    this.richTextResolver.addNode("blok", (e) => {
      let r = "";
      return e.attrs.body.forEach((o) => {
        r += t(o.component, o);
      }), {
        html: r
      };
    });
  }
  parseParams(t) {
    return t.version || (t.version = "published"), t.token || (t.token = this.getToken()), t.cv || (t.cv = m[t.token]), Array.isArray(t.resolve_relations) && (t.resolve_relations = t.resolve_relations.join(",")), t;
  }
  factoryParamOptions(t, e) {
    return this.helpers.isCDNUrl(t) ? this.parseParams(e) : e;
  }
  makeRequest(t, e, r, o) {
    const n = this.factoryParamOptions(
      t,
      this.helpers.getOptionsPage(e, r, o)
    );
    return this.cacheResponse(t, n);
  }
  get(t, e) {
    e || (e = {});
    const r = `/${t}`, o = this.factoryParamOptions(r, e);
    return this.cacheResponse(r, o);
  }
  async getAll(t, e, r) {
    const o = (e == null ? void 0 : e.per_page) || 25, n = `/${t}`, i = n.split("/"), l = r || i[i.length - 1], a = 1, c = await this.makeRequest(n, e, o, a), h = c.total ? Math.ceil(c.total / o) : 1, p = await this.helpers.asyncMap(
      this.helpers.range(a, h),
      (f) => this.makeRequest(n, e, o, f + 1)
    );
    return this.helpers.flatMap(
      [c, ...p],
      (f) => Object.values(f.data[l])
    );
  }
  post(t, e) {
    const r = `/${t}`;
    return Promise.resolve(this.throttle("post", r, e));
  }
  put(t, e) {
    const r = `/${t}`;
    return Promise.resolve(this.throttle("put", r, e));
  }
  delete(t, e) {
    const r = `/${t}`;
    return Promise.resolve(this.throttle("delete", r, e));
  }
  getStories(t) {
    return this.get("cdn/stories", t);
  }
  getStory(t, e) {
    return this.get(`cdn/stories/${t}`, e);
  }
  getToken() {
    return this.accessToken;
  }
  ejectInterceptor() {
    this.client.eject();
  }
  _cleanCopy(t) {
    return JSON.parse(JSON.stringify(t));
  }
  _insertLinks(t, e, r) {
    const o = t[e];
    o && o.fieldtype == "multilink" && o.linktype == "story" && typeof o.id == "string" && this.links[r][o.id] ? o.story = this._cleanCopy(this.links[r][o.id]) : o && o.linktype === "story" && typeof o.uuid == "string" && this.links[r][o.uuid] && (o.story = this._cleanCopy(this.links[r][o.uuid]));
  }
  _insertRelations(t, e, r, o) {
    if (r.indexOf(`${t.component}.${e}`) > -1) {
      if (typeof t[e] == "string")
        this.relations[o][t[e]] && (t[e] = this._cleanCopy(
          this.relations[o][t[e]]
        ));
      else if (t[e] && t[e].constructor === Array) {
        const n = [];
        t[e].forEach((i) => {
          this.relations[o][i] && n.push(this._cleanCopy(this.relations[o][i]));
        }), t[e] = n;
      }
    }
  }
  iterateTree(t, e, r) {
    const o = (n) => {
      if (n != null) {
        if (n.constructor === Array)
          for (let i = 0; i < n.length; i++)
            o(n[i]);
        else if (n.constructor === Object) {
          if (n._stopResolving)
            return;
          for (const i in n)
            (n.component && n._uid || n.type === "link") && (this._insertRelations(
              n,
              i,
              e,
              r
            ), this._insertLinks(
              n,
              i,
              r
            )), o(n[i]);
        }
      }
    };
    o(t.content);
  }
  async resolveLinks(t, e, r) {
    let o = [];
    if (t.link_uuids) {
      const n = t.link_uuids.length, i = [], l = 50;
      for (let a = 0; a < n; a += l) {
        const c = Math.min(n, a + l);
        i.push(t.link_uuids.slice(a, c));
      }
      for (let a = 0; a < i.length; a++)
        (await this.getStories({
          per_page: l,
          language: e.language,
          version: e.version,
          by_uuids: i[a].join(",")
        })).data.stories.forEach(
          (c) => {
            o.push(c);
          }
        );
    } else
      o = t.links;
    o.forEach((n) => {
      this.links[r][n.uuid] = {
        ...n,
        _stopResolving: !0
      };
    });
  }
  async resolveRelations(t, e, r) {
    let o = [];
    if (t.rel_uuids) {
      const n = t.rel_uuids.length, i = [], l = 50;
      for (let a = 0; a < n; a += l) {
        const c = Math.min(n, a + l);
        i.push(t.rel_uuids.slice(a, c));
      }
      for (let a = 0; a < i.length; a++)
        (await this.getStories({
          per_page: l,
          language: e.language,
          version: e.version,
          by_uuids: i[a].join(",")
        })).data.stories.forEach((c) => {
          o.push(c);
        });
    } else
      o = t.rels;
    o && o.length > 0 && o.forEach((n) => {
      this.relations[r][n.uuid] = {
        ...n,
        _stopResolving: !0
      };
    });
  }
  async resolveStories(t, e, r) {
    var o, n;
    let i = [];
    if (this.links[r] = {}, this.relations[r] = {}, typeof e.resolve_relations < "u" && e.resolve_relations.length > 0 && (typeof e.resolve_relations == "string" && (i = e.resolve_relations.split(",")), await this.resolveRelations(t, e, r)), e.resolve_links && ["1", "story", "url"].indexOf(e.resolve_links) > -1 && ((o = t.links) != null && o.length || (n = t.link_uuids) != null && n.length) && await this.resolveLinks(t, e, r), this.resolveNestedRelations)
      for (const l in this.relations[r])
        this.iterateTree(
          this.relations[r][l],
          i,
          r
        );
    t.story ? this.iterateTree(t.story, i, r) : t.stories.forEach((l) => {
      this.iterateTree(l, i, r);
    }), delete this.links[r], delete this.relations[r];
  }
  async cacheResponse(t, e, r) {
    const o = this.helpers.stringify({ url: t, params: e }), n = this.cacheProvider();
    if (this.cache.clear === "auto" && e.version === "draft" && await this.flushCache(), e.version === "published" && t != "/cdn/spaces/me") {
      const i = await n.get(o);
      if (i)
        return Promise.resolve(i);
    }
    return new Promise((i, l) => {
      try {
        (async () => {
          var a;
          try {
            const c = await this.throttle("get", t, e);
            let h = { data: c.data, headers: c.headers };
            if ((a = c.headers) != null && a["per-page"] && (h = Object.assign({}, h, {
              perPage: c.headers["per-page"] ? parseInt(c.headers["per-page"]) : 0,
              total: c.headers["per-page"] ? parseInt(c.headers.total) : 0
            })), c.status != 200)
              return l(c);
            if (h.data.story || h.data.stories) {
              const p = this.resolveCounter = ++this.resolveCounter % 1e3;
              await this.resolveStories(h.data, e, `${p}`);
            }
            return e.version === "published" && t != "/cdn/spaces/me" && await n.set(o, h), h.data.cv && e.token && (e.version == "draft" && m[e.token] != h.data.cv && await this.flushCache(), m[e.token] = h.data.cv), i(h);
          } catch (c) {
            return l(c);
          }
        })();
      } catch {
      }
    });
  }
  throttledRequest(t, e, r) {
    return this.client[t](e, r);
  }
  cacheVersions() {
    return m;
  }
  cacheVersion() {
    return m[this.accessToken];
  }
  setCacheVersion(t) {
    this.accessToken && (m[this.accessToken] = t);
  }
  cacheProvider() {
    switch (this.cache.type) {
      case "memory":
        return {
          get(t) {
            return Promise.resolve(v[t]);
          },
          getAll() {
            return Promise.resolve(v);
          },
          set(t, e) {
            return v[t] = e, Promise.resolve(void 0);
          },
          flush() {
            return v = {}, Promise.resolve(void 0);
          }
        };
      case "custom":
        if (this.cache.custom)
          return this.cache.custom;
      default:
        return {
          get() {
            return Promise.resolve(void 0);
          },
          getAll() {
            return Promise.resolve(void 0);
          },
          set() {
            return Promise.resolve(void 0);
          },
          flush() {
            return Promise.resolve(void 0);
          }
        };
    }
  }
  async flushCache() {
    return await this.cacheProvider().flush(), this;
  }
}
const fe = (s = {}) => {
  const { apiOptions: t } = s;
  if (!t.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }
  return { storyblokApi: new Pt(t) };
}, Et = (s) => {
  if (typeof s != "object" || typeof s._editable > "u")
    return {};
  const t = JSON.parse(
    s._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
  );
  return {
    "data-blok-c": JSON.stringify(t),
    "data-blok-uid": t.id + "-" + t.uid
  };
};
let S;
const Ot = "https://app.storyblok.com/f/storyblok-v2-latest.js", It = (s, t, e = {}) => {
  var r;
  const o = !(typeof window > "u") && typeof window.storyblokRegisterEvent < "u", n = +new URL((r = window.location) == null ? void 0 : r.href).searchParams.get(
    "_storyblok"
  ) === s;
  if (!(!o || !n)) {
    if (!s) {
      console.warn("Story ID is not defined. Please provide a valid ID.");
      return;
    }
    window.storyblokRegisterEvent(() => {
      new window.StoryblokBridge(e).on(["input", "published", "change"], (i) => {
        i.action === "input" && i.story.id === s ? t(i.story) : (i.action === "change" || i.action === "published") && i.storyId === s && window.location.reload();
      });
    });
  }
}, Nt = (s = {}) => {
  var t, e;
  const {
    bridge: r,
    accessToken: o,
    use: n = [],
    apiOptions: i = {},
    richText: l = {}
  } = s;
  i.accessToken = i.accessToken || o;
  const a = { bridge: r, apiOptions: i };
  let c = {};
  n.forEach((p) => {
    c = { ...c, ...p(a) };
  });
  const h = !(typeof window > "u") && ((e = (t = window.location) == null ? void 0 : t.search) == null ? void 0 : e.includes("_storyblok_tk"));
  return r !== !1 && h && W(Ot), S = new $(l.schema), l.resolver && D(S, l.resolver), c;
}, D = (s, t) => {
  s.addNode("blok", (e) => {
    let r = "";
    return e.attrs.body.forEach((o) => {
      r += t(o.component, o);
    }), {
      html: r
    };
  });
}, pe = (s, t, e) => {
  let r = e || S;
  if (!r) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return s === "" ? "" : s ? (t && (r = new $(t.schema), t.resolver && D(r, t.resolver)), r.render(s)) : (console.warn(`${s} is not a valid Richtext object. This might be because the value of the richtext field is empty.
    
  For more info about the richtext object check https://github.com/storyblok/storyblok-js#rendering-rich-text`), "");
};
function At(s, t, e, r, o, n, i, l) {
  var a = typeof s == "function" ? s.options : s;
  t && (a.render = t, a.staticRenderFns = e, a._compiled = !0), r && (a.functional = !0), n && (a._scopeId = "data-v-" + n);
  var c;
  if (i ? (c = function(f) {
    f = f || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !f && typeof __VUE_SSR_CONTEXT__ < "u" && (f = __VUE_SSR_CONTEXT__), o && o.call(this, f), f && f._registeredComponents && f._registeredComponents.add(i);
  }, a._ssrRegister = c) : o && (c = l ? function() {
    o.call(
      this,
      (a.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : o), c)
    if (a.functional) {
      a._injectStyles = c;
      var h = a.render;
      a.render = function(f, g) {
        return c.call(g), h(f, g);
      };
    } else {
      var p = a.beforeCreate;
      a.beforeCreate = p ? [].concat(p, c) : [c];
    }
  return {
    exports: s,
    options: a
  };
}
const Mt = {
  props: {
    blok: {
      type: Object
    }
  }
};
var Dt = function() {
  var s = this, t = s._self._c;
  return t(s.blok.component, s._g(s._b({ tag: "component" }, "component", { ...s.$props, ...s.$attrs }, !1), s.$listeners));
}, Ft = [], Kt = /* @__PURE__ */ At(
  Mt,
  Dt,
  Ft,
  !1,
  null,
  null,
  null,
  null
);
const Ut = Kt.exports, zt = (s) => {
  console.error(`You can't use ${s} if you're not loading apiPlugin. Please provide it on StoryblokVue initialization.
    `);
}, Lt = (s, t) => {
  if (t.value) {
    const e = Et(t.value);
    s.setAttribute("data-blok-c", e["data-blok-c"]), s.setAttribute("data-blok-uid", e["data-blok-uid"]), s.classList.add("storyblok__outline");
  }
}, Ht = { bind: Lt };
let R = null;
const Vt = () => (R || zt("useStoryblokApi"), R), qt = {
  install(s, t = {}) {
    s.directive("editable", Ht), s.component("StoryblokComponent", Ut);
    const { storyblokApi: e } = Nt(t);
    R = e, s.prototype.$storyblokApi = e;
  }
};
typeof window < "u" && window.Vue && window.Vue.use(qt);
var b = {};
Object.defineProperty(b, "__esModule", { value: !0 });
const Jt = "$nuxt", Bt = "__NUXT__", Yt = !1, Xt = "/static-path", Gt = "/_nuxt/";
var F = b.globalContext = Bt, y = b.globalNuxt = Jt, Wt = b.isFullStatic = Yt;
b.publicPath = Gt;
b.staticPath = Xt;
function Qt(s) {
  if (!s)
    throw new Error("You must provide a key. You can have it generated automatically by adding '@nuxtjs/composition-api/dist/babel-plugin' to your Babel plugins.");
}
const P = () => {
  const s = q();
  if (!!s)
    return s.proxy;
};
function w(s) {
  return s instanceof Function ? s() : s;
}
let Zt = {};
const te = () => {
  const s = P(), t = s ? "ssrRefs" : "globalRefs";
  let e;
  if (s && process.server) {
    const o = (s[y] || s.$options).context.ssrContext;
    e = o.nuxt.ssrRefs = o.nuxt.ssrRefs || {};
  }
  return { type: t, setData: (o, n) => {
    const i = e || Zt;
    i[o] = ee(n);
  } };
}, A = (s) => !!s && typeof s == "object", ee = (s) => s && JSON.parse(JSON.stringify(s)) || s, se = (s, t, e = "globalRefs") => {
  var r, o, n, i;
  return process.client ? process.env.NODE_ENV === "development" && ((r = window[y]) == null ? void 0 : r.context.isHMR) ? w(s) : (i = (n = (o = window[F]) == null ? void 0 : o[e]) == null ? void 0 : n[t]) != null ? i : w(s) : w(s);
}, re = (s, t) => {
  Qt(t);
  const { type: e, setData: r } = te();
  let o = se(s, t, e);
  if (process.client)
    return L(o);
  s instanceof Function && r(t, o);
  const n = (l, a, c) => new Proxy(c, {
    get(h, p) {
      if (l(), A(h[p]))
        return n(l, a, h[p]);
      const f = Reflect.get(h, p);
      return typeof f == "function" ? f.bind(h) : f;
    },
    set(h, p, f) {
      const g = Reflect.set(h, p, f);
      return r(t, o), a(), g;
    }
  });
  return H((l, a) => ({
    get: () => (l(), A(o) ? n(l, a, o) : o),
    set: (c) => {
      r(t, c), o = c, a();
    }
  }));
}, oe = process.client && window[F];
function K(s) {
  let t;
  if (s.message || typeof s == "string")
    t = s.message || s;
  else
    try {
      t = JSON.stringify(s, null, 2);
    } catch {
      t = `[${s.constructor.name}]`;
    }
  return {
    ...s,
    message: t,
    statusCode: s.statusCode || s.status || s.response && s.response.status || 500
  };
}
function ne(s, t = "") {
  return function(r = t) {
    return s[r] === void 0 && (s[r] = 0), s[r]++;
  };
}
const T = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new Map(), ie = (s) => {
  var t, e, r;
  return (r = (e = (t = s.$vnode) == null ? void 0 : t.elm) == null ? void 0 : e.dataset) == null ? void 0 : r.fetchKey;
};
function ae(s, t) {
  const e = T.get(s) || [];
  T.set(s, [...e, t]);
}
async function C() {
  const s = T.get(this);
  if (!s)
    return;
  this[y].nbFetching++, this.$fetchState.pending = !0, this.$fetchState.error = null, this._hydrated = !1;
  let t = null;
  const e = Date.now();
  try {
    await Promise.all(s.map((o) => {
      if (_.has(o))
        return _.get(o);
      const n = Promise.resolve(o(this)).finally(() => _.delete(o));
      return _.set(o, n), n;
    }));
  } catch (o) {
    process.dev && console.error("Error in fetch():", o), t = K(o);
  }
  const r = (this._fetchDelay || 0) - (Date.now() - e);
  r > 0 && await new Promise((o) => setTimeout(o, r)), this.$fetchState.error = t, this.$fetchState.pending = !1, this.$fetchState.timestamp = Date.now(), this.$nextTick(() => this[y].nbFetching--);
}
const U = (s) => {
  s.$fetchState = s.$fetchState || J({
    error: null,
    pending: !1,
    timestamp: 0
  });
}, z = (s) => {
  const t = P();
  if (!t)
    throw new Error("This must be called within a setup function.");
  M(() => {
    const e = t._setupProxy || t;
    for (const r in s)
      try {
        if (r in e) {
          const o = r;
          if (e[o] === s[r] || typeof e[o] == "function")
            continue;
          if (B(e[o])) {
            for (const n in e[o])
              n in s[r] || delete e[o][n];
            Object.assign(e[o], s[r]);
            continue;
          }
        }
        Y(e, r, s[r]);
      } catch {
        process.env.NODE_ENV === "development" && console.warn(`Could not hydrate ${r}.`);
      }
  });
}, ce = (s) => {
  s._fetchKey = j(s);
  const { fetchOnServer: t } = s.$options, e = typeof t == "function" ? t.call(s) !== !1 : t !== !1, r = s[y];
  if (!e || (r == null ? void 0 : r.isPreview) || !(r != null && r._pagePayload))
    return;
  s._hydrated = !0;
  const o = r._pagePayload.fetch[s._fetchKey];
  if (o && o._error) {
    s.$fetchState.error = o._error;
    return;
  }
  z(o);
};
async function le(s) {
  if (!s._fetchOnServer)
    return;
  U(s);
  try {
    await C.call(s);
  } catch (o) {
    process.dev && console.error("Error in fetch():", o), s.$fetchState.error = K(o);
  }
  s.$fetchState.pending = !1, s._fetchKey = "push" in s.$ssrContext.nuxt.fetch ? s.$ssrContext.nuxt.fetch.length : s._fetchKey || s.$ssrContext.fetchCounters[""]++, s.$vnode.data || (s.$vnode.data = {});
  const t = s.$vnode.data.attrs = s.$vnode.data.attrs || {};
  t["data-fetch-key"] = s._fetchKey;
  const e = Object.fromEntries(Object.entries((s == null ? void 0 : s._setupProxy) || (s == null ? void 0 : s._setupState)).filter(([o, n]) => !(n && typeof n == "object" && "_compiled" in n || n instanceof Function || n instanceof Promise)).map(([o, n]) => [o, X(n) ? n.value : n])), r = s.$fetchState.error ? { _error: s.$fetchState.error } : JSON.parse(JSON.stringify(e));
  "push" in s.$ssrContext.nuxt.fetch ? s.$ssrContext.nuxt.fetch.push(r) : s.$ssrContext.nuxt.fetch[s._fetchKey] = r;
}
function j(s) {
  const t = s[y];
  if (process.server && "push" in s.$ssrContext.nuxt.fetch)
    return;
  if (process.client && "_payloadFetchIndex" in t)
    return t._payloadFetchIndex = t._payloadFetchIndex || 0, t._payloadFetchIndex++;
  const e = s.$options._scopeId || s.$options.name || "", r = ne(process.server ? s.$ssrContext.fetchCounters : s[y]._fetchCounters, e), o = s.$options;
  if (typeof o.fetchKey == "function")
    return o.fetchKey.call(s, r);
  {
    const n = typeof o.fetchKey == "string" ? o.fetchKey : e;
    return n ? n + ":" + r(n) : String(r(n));
  }
}
const he = (s) => {
  var t;
  const e = P();
  if (!e)
    throw new Error("This must be called within a setup function.");
  ae(e, s), typeof e.$options.fetchOnServer == "function" ? e._fetchOnServer = e.$options.fetchOnServer.call(e) !== !1 : e._fetchOnServer = e.$options.fetchOnServer !== !1, process.server && (e._fetchKey = j(e)), U(e), V(() => le(e));
  function r() {
    return {
      fetch: e.$fetch,
      fetchState: e.$fetchState,
      $fetch: e.$fetch,
      $fetchState: e.$fetchState
    };
  }
  if (e._fetchDelay = typeof e.$options.fetchDelay == "number" ? e.$options.fetchDelay : 0, e.$fetch = C.bind(e), M(() => !e._hydrated && C.call(e)), process.server || !ie(e))
    return process.client && Wt && ce(e), r();
  e._hydrated = !0, e._fetchKey = ((t = e.$vnode.elm) == null ? void 0 : t.dataset.fetchKey) || j(e);
  const o = oe.fetch[e._fetchKey];
  return o && o._error ? (e.$fetchState.error = o._error, r()) : (z(o), r());
}, de = (s, t = {}, e = {}) => {
  const r = Vt();
  if (!r)
    return console.error(
      "useStoryblok cannot be used if you disabled useApiClient when adding @storyblok/nuxt-2 to your nuxt.config.js"
    );
  const o = re(null, s);
  G(() => {
    o.value && o.value.id && It(
      o.value.id,
      (l) => o.value = l,
      e
    );
  });
  const { fetch: n, fetchState: i } = he(async () => {
    const { data: l } = await r.get(`cdn/stories/${s}`, t);
    o.value = l.story;
  });
  return n(), { story: o, fetchState: i };
};
export {
  qt as StoryblokVue,
  fe as apiPlugin,
  pe as renderRichText,
  de as useStoryblok,
  Vt as useStoryblokApi,
  It as useStoryblokBridge
};
