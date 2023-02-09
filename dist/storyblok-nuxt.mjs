import J from "axios";
import { ref as L, customRef as U, onServerPrefetch as B, onBeforeMount as M, getCurrentInstance as Y, reactive as H, isReactive as X, set as G, isRef as W, onMounted as Q } from "vue";
var Z = Object.defineProperty, ee = Object.defineProperties, te = Object.getOwnPropertyDescriptors, O = Object.getOwnPropertySymbols, re = Object.prototype.hasOwnProperty, ne = Object.prototype.propertyIsEnumerable, E = (r, e, t) => e in r ? Z(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, d = (r, e) => {
  for (var t in e || (e = {}))
    re.call(e, t) && E(r, t, e[t]);
  if (O)
    for (var t of O(e))
      ne.call(e, t) && E(r, t, e[t]);
  return r;
}, _ = (r, e) => ee(r, te(e));
let P = !1;
const j = [], oe = (r) => new Promise((e, t) => {
  if (typeof window > "u" || (window.storyblokRegisterEvent = (o) => {
    if (window.location === window.parent.location) {
      console.warn("You are not in Draft Mode or in the Visual Editor.");
      return;
    }
    P ? o() : j.push(o);
  }, document.getElementById("storyblok-javascript-bridge")))
    return;
  const n = document.createElement("script");
  n.async = !0, n.src = r, n.id = "storyblok-javascript-bridge", n.onerror = (o) => t(o), n.onload = (o) => {
    j.forEach((s) => s()), P = !0, e(o);
  }, document.getElementsByTagName("head")[0].appendChild(n);
}), se = function(r, e) {
  if (!r)
    return null;
  let t = {};
  for (let n in r) {
    let o = r[n];
    e.indexOf(n) > -1 && o !== null && (t[n] = o);
  }
  return t;
}, ie = (r) => r === "email";
var ae = {
  nodes: {
    horizontal_rule() {
      return {
        singleTag: "hr"
      };
    },
    blockquote() {
      return {
        tag: "blockquote"
      };
    },
    bullet_list() {
      return {
        tag: "ul"
      };
    },
    code_block(r) {
      return {
        tag: [
          "pre",
          {
            tag: "code",
            attrs: r.attrs
          }
        ]
      };
    },
    hard_break() {
      return {
        singleTag: "br"
      };
    },
    heading(r) {
      return {
        tag: `h${r.attrs.level}`
      };
    },
    image(r) {
      return {
        singleTag: [
          {
            tag: "img",
            attrs: se(r.attrs, ["src", "alt", "title"])
          }
        ]
      };
    },
    list_item() {
      return {
        tag: "li"
      };
    },
    ordered_list() {
      return {
        tag: "ol"
      };
    },
    paragraph() {
      return {
        tag: "p"
      };
    }
  },
  marks: {
    bold() {
      return {
        tag: "b"
      };
    },
    strike() {
      return {
        tag: "strike"
      };
    },
    underline() {
      return {
        tag: "u"
      };
    },
    strong() {
      return {
        tag: "strong"
      };
    },
    code() {
      return {
        tag: "code"
      };
    },
    italic() {
      return {
        tag: "i"
      };
    },
    link(r) {
      const e = d({}, r.attrs), { linktype: t = "url" } = r.attrs;
      return ie(t) && (e.href = `mailto:${e.href}`), e.anchor && (e.href = `${e.href}#${e.anchor}`, delete e.anchor), {
        tag: [
          {
            tag: "a",
            attrs: e
          }
        ]
      };
    },
    styled(r) {
      return {
        tag: [
          {
            tag: "span",
            attrs: r.attrs
          }
        ]
      };
    }
  }
};
const ce = function(r) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, t = /[&<>"']/g, n = RegExp(t.source);
  return r && n.test(r) ? r.replace(t, (o) => e[o]) : r;
};
class I {
  constructor(e) {
    e || (e = ae), this.marks = e.marks || [], this.nodes = e.nodes || [];
  }
  addNode(e, t) {
    this.nodes[e] = t;
  }
  addMark(e, t) {
    this.marks[e] = t;
  }
  render(e = {}) {
    if (e.content && Array.isArray(e.content)) {
      let t = "";
      return e.content.forEach((n) => {
        t += this.renderNode(n);
      }), t;
    }
    return console.warn("The render method must receive an object with a content field, which is an array"), "";
  }
  renderNode(e) {
    let t = [];
    e.marks && e.marks.forEach((o) => {
      const s = this.getMatchingMark(o);
      s && t.push(this.renderOpeningTag(s.tag));
    });
    const n = this.getMatchingNode(e);
    return n && n.tag && t.push(this.renderOpeningTag(n.tag)), e.content ? e.content.forEach((o) => {
      t.push(this.renderNode(o));
    }) : e.text ? t.push(ce(e.text)) : n && n.singleTag ? t.push(this.renderTag(n.singleTag, " /")) : n && n.html && t.push(n.html), n && n.tag && t.push(this.renderClosingTag(n.tag)), e.marks && e.marks.slice(0).reverse().forEach((o) => {
      const s = this.getMatchingMark(o);
      s && t.push(this.renderClosingTag(s.tag));
    }), t.join("");
  }
  renderTag(e, t) {
    return e.constructor === String ? `<${e}${t}>` : e.map((n) => {
      if (n.constructor === String)
        return `<${n}${t}>`;
      {
        let o = `<${n.tag}`;
        if (n.attrs)
          for (let s in n.attrs) {
            let a = n.attrs[s];
            a !== null && (o += ` ${s}="${a}"`);
          }
        return `${o}${t}>`;
      }
    }).join("");
  }
  renderOpeningTag(e) {
    return this.renderTag(e, "");
  }
  renderClosingTag(e) {
    return e.constructor === String ? `</${e}>` : e.slice(0).reverse().map((t) => t.constructor === String ? `</${t}>` : `</${t.tag}>`).join("");
  }
  getMatchingNode(e) {
    if (typeof this.nodes[e.type] == "function")
      return this.nodes[e.type](e);
  }
  getMatchingMark(e) {
    if (typeof this.marks[e.type] == "function")
      return this.marks[e.type](e);
  }
}
/*!
 * storyblok-js-client v4.5.2
 * Universal JavaScript SDK for Storyblok's API
 * (c) 2020-2022 Stobylok Team
 */
function N(r) {
  return typeof r == "number" && r == r && r !== 1 / 0 && r !== -1 / 0;
}
function D(r, e, t) {
  if (!N(e))
    throw new TypeError("Expected `limit` to be a finite number");
  if (!N(t))
    throw new TypeError("Expected `interval` to be a finite number");
  var n = [], o = [], s = 0, a = function() {
    s++;
    var c = setTimeout(function() {
      s--, n.length > 0 && a(), o = o.filter(function(u) {
        return u !== c;
      });
    }, t);
    o.indexOf(c) < 0 && o.push(c);
    var l = n.shift();
    l.resolve(r.apply(l.self, l.args));
  }, i = function() {
    var c = arguments, l = this;
    return new Promise(function(u, f) {
      n.push({ resolve: u, reject: f, args: c, self: l }), s < e && a();
    });
  };
  return i.abort = function() {
    o.forEach(clearTimeout), o = [], n.forEach(function(c) {
      c.reject(new throttle.AbortError());
    }), n.length = 0;
  }, i;
}
D.AbortError = function() {
  Error.call(this, "Throttled function aborted"), this.name = "AbortError";
};
const le = function(r, e) {
  if (!r)
    return null;
  let t = {};
  for (let n in r) {
    let o = r[n];
    e.indexOf(n) > -1 && o !== null && (t[n] = o);
  }
  return t;
};
var ue = { nodes: { horizontal_rule: () => ({ singleTag: "hr" }), blockquote: () => ({ tag: "blockquote" }), bullet_list: () => ({ tag: "ul" }), code_block: (r) => ({ tag: ["pre", { tag: "code", attrs: r.attrs }] }), hard_break: () => ({ singleTag: "br" }), heading: (r) => ({ tag: `h${r.attrs.level}` }), image: (r) => ({ singleTag: [{ tag: "img", attrs: le(r.attrs, ["src", "alt", "title"]) }] }), list_item: () => ({ tag: "li" }), ordered_list: () => ({ tag: "ol" }), paragraph: () => ({ tag: "p" }) }, marks: { bold: () => ({ tag: "b" }), strike: () => ({ tag: "strike" }), underline: () => ({ tag: "u" }), strong: () => ({ tag: "strong" }), code: () => ({ tag: "code" }), italic: () => ({ tag: "i" }), link(r) {
  const e = d({}, r.attrs), { linktype: t = "url" } = r.attrs;
  return t === "email" && (e.href = `mailto:${e.href}`), e.anchor && (e.href = `${e.href}#${e.anchor}`, delete e.anchor), { tag: [{ tag: "a", attrs: e }] };
}, styled: (r) => ({ tag: [{ tag: "span", attrs: r.attrs }] }) } };
class he {
  constructor(e) {
    e || (e = ue), this.marks = e.marks || [], this.nodes = e.nodes || [];
  }
  addNode(e, t) {
    this.nodes[e] = t;
  }
  addMark(e, t) {
    this.marks[e] = t;
  }
  render(e = {}) {
    if (e.content && Array.isArray(e.content)) {
      let t = "";
      return e.content.forEach((n) => {
        t += this.renderNode(n);
      }), t;
    }
    return console.warn("The render method must receive an object with a content field, which is an array"), "";
  }
  renderNode(e) {
    let t = [];
    e.marks && e.marks.forEach((o) => {
      const s = this.getMatchingMark(o);
      s && t.push(this.renderOpeningTag(s.tag));
    });
    const n = this.getMatchingNode(e);
    return n && n.tag && t.push(this.renderOpeningTag(n.tag)), e.content ? e.content.forEach((o) => {
      t.push(this.renderNode(o));
    }) : e.text ? t.push(function(o) {
      const s = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, a = /[&<>"']/g, i = RegExp(a.source);
      return o && i.test(o) ? o.replace(a, (c) => s[c]) : o;
    }(e.text)) : n && n.singleTag ? t.push(this.renderTag(n.singleTag, " /")) : n && n.html && t.push(n.html), n && n.tag && t.push(this.renderClosingTag(n.tag)), e.marks && e.marks.slice(0).reverse().forEach((o) => {
      const s = this.getMatchingMark(o);
      s && t.push(this.renderClosingTag(s.tag));
    }), t.join("");
  }
  renderTag(e, t) {
    return e.constructor === String ? `<${e}${t}>` : e.map((n) => {
      if (n.constructor === String)
        return `<${n}${t}>`;
      {
        let o = `<${n.tag}`;
        if (n.attrs)
          for (let s in n.attrs) {
            let a = n.attrs[s];
            a !== null && (o += ` ${s}="${a}"`);
          }
        return `${o}${t}>`;
      }
    }).join("");
  }
  renderOpeningTag(e) {
    return this.renderTag(e, "");
  }
  renderClosingTag(e) {
    return e.constructor === String ? `</${e}>` : e.slice(0).reverse().map((t) => t.constructor === String ? `</${t}>` : `</${t.tag}>`).join("");
  }
  getMatchingNode(e) {
    if (typeof this.nodes[e.type] == "function")
      return this.nodes[e.type](e);
  }
  getMatchingMark(e) {
    if (typeof this.marks[e.type] == "function")
      return this.marks[e.type](e);
  }
}
const fe = (r = 0, e = r) => {
  const t = Math.abs(e - r) || 0, n = r < e ? 1 : -1;
  return ((o = 0, s) => [...Array(o)].map(s))(t, (o, s) => s * n + r);
}, $ = (r, e, t) => {
  const n = [];
  for (const o in r) {
    if (!Object.prototype.hasOwnProperty.call(r, o))
      continue;
    const s = r[o], a = t ? "" : encodeURIComponent(o);
    let i;
    i = typeof s == "object" ? $(s, e ? e + encodeURIComponent("[" + a + "]") : a, Array.isArray(s)) : (e ? e + encodeURIComponent("[" + a + "]") : a) + "=" + encodeURIComponent(s), n.push(i);
  }
  return n.join("&");
};
let m = {}, g = {};
class de {
  constructor(e, t) {
    if (!t) {
      let s = e.region ? `-${e.region}` : "", a = e.https === !1 ? "http" : "https";
      t = e.oauthToken === void 0 ? `${a}://api${s}.storyblok.com/v2` : `${a}://api${s}.storyblok.com/v1`;
    }
    let n = Object.assign({}, e.headers), o = 5;
    e.oauthToken !== void 0 && (n.Authorization = e.oauthToken, o = 3), e.rateLimit !== void 0 && (o = e.rateLimit), this.richTextResolver = new he(e.richTextSchema), typeof e.componentResolver == "function" && this.setComponentResolver(e.componentResolver), this.maxRetries = e.maxRetries || 5, this.throttle = D(this.throttledRequest, o, 1e3), this.accessToken = e.accessToken, this.relations = {}, this.links = {}, this.cache = e.cache || { clear: "manual" }, this.client = J.create({ baseURL: t, timeout: e.timeout || 0, headers: n, proxy: e.proxy || !1 }), e.responseInterceptor && this.client.interceptors.response.use((s) => e.responseInterceptor(s)), this.resolveNestedRelations = e.resolveNestedRelations || !0;
  }
  setComponentResolver(e) {
    this.richTextResolver.addNode("blok", (t) => {
      let n = "";
      return t.attrs.body.forEach((o) => {
        n += e(o.component, o);
      }), { html: n };
    });
  }
  parseParams(e = {}) {
    return e.version || (e.version = "published"), e.token || (e.token = this.getToken()), e.cv || (e.cv = g[e.token]), Array.isArray(e.resolve_relations) && (e.resolve_relations = e.resolve_relations.join(",")), e;
  }
  factoryParamOptions(e, t = {}) {
    return ((n = "") => n.indexOf("/cdn/") > -1)(e) ? this.parseParams(t) : t;
  }
  makeRequest(e, t, n, o) {
    const s = this.factoryParamOptions(e, ((a = {}, i = 25, c = 1) => _(d({}, a), { per_page: i, page: c }))(t, n, o));
    return this.cacheResponse(e, s);
  }
  get(e, t) {
    let n = `/${e}`;
    const o = this.factoryParamOptions(n, t);
    return this.cacheResponse(n, o);
  }
  async getAll(e, t = {}, n) {
    const o = t.per_page || 25, s = `/${e}`, a = s.split("/");
    n = n || a[a.length - 1];
    const i = await this.makeRequest(s, t, o, 1), c = Math.ceil(i.total / o);
    return ((l = [], u) => l.map(u).reduce((f, h) => [...f, ...h], []))([i, ...await (async (l = [], u) => Promise.all(l.map(u)))(fe(1, c), async (l) => this.makeRequest(s, t, o, l + 1))], (l) => Object.values(l.data[n]));
  }
  post(e, t) {
    let n = `/${e}`;
    return this.throttle("post", n, t);
  }
  put(e, t) {
    let n = `/${e}`;
    return this.throttle("put", n, t);
  }
  delete(e, t) {
    let n = `/${e}`;
    return this.throttle("delete", n, t);
  }
  getStories(e) {
    return this.get("cdn/stories", e);
  }
  getStory(e, t) {
    return this.get(`cdn/stories/${e}`, t);
  }
  setToken(e) {
    this.accessToken = e;
  }
  getToken() {
    return this.accessToken;
  }
  _cleanCopy(e) {
    return JSON.parse(JSON.stringify(e));
  }
  _insertLinks(e, t) {
    const n = e[t];
    n && n.fieldtype == "multilink" && n.linktype == "story" && typeof n.id == "string" && this.links[n.id] ? n.story = this._cleanCopy(this.links[n.id]) : n && n.linktype === "story" && typeof n.uuid == "string" && this.links[n.uuid] && (n.story = this._cleanCopy(this.links[n.uuid]));
  }
  _insertRelations(e, t, n) {
    if (n.indexOf(e.component + "." + t) > -1) {
      if (typeof e[t] == "string")
        this.relations[e[t]] && (e[t] = this._cleanCopy(this.relations[e[t]]));
      else if (e[t].constructor === Array) {
        let o = [];
        e[t].forEach((s) => {
          this.relations[s] && o.push(this._cleanCopy(this.relations[s]));
        }), e[t] = o;
      }
    }
  }
  _insertAssetsRelations(e, t) {
    t.forEach((n) => {
      e.id === n.id && (e.original = n, e.original.filename = e.filename, e.original.filename = e.original.filename.includes("https://s3.amazonaws.com/") ? e.original.filename : e.original.filename.replace("https://", "https://s3.amazonaws.com/"), delete e.original.s3_filename);
    });
  }
  iterateTree(e, t) {
    let n = (o) => {
      if (o != null) {
        if (o.constructor === Array)
          for (let s = 0; s < o.length; s++)
            n(o[s]);
        else if (o.constructor === Object) {
          if (o._stopResolving)
            return;
          for (let s in o)
            o.component && o._uid || o.type === "link" ? (this._insertRelations(o, s, t), this._insertLinks(o, s)) : "id" in o && o.fieldtype === "asset" && this._insertAssetsRelations(o, t), n(o[s]);
        }
      }
    };
    n(e.content);
  }
  async resolveLinks(e, t) {
    let n = [];
    if (e.link_uuids) {
      const o = e.link_uuids.length;
      let s = [];
      const a = 50;
      for (let i = 0; i < o; i += a) {
        const c = Math.min(o, i + a);
        s.push(e.link_uuids.slice(i, c));
      }
      for (let i = 0; i < s.length; i++)
        (await this.getStories({ per_page: a, language: t.language, version: t.version, by_uuids: s[i].join(",") })).data.stories.forEach((c) => {
          n.push(c);
        });
    } else
      n = e.links;
    n.forEach((o) => {
      this.links[o.uuid] = _(d({}, o), { _stopResolving: !0 });
    });
  }
  async resolveRelations(e, t) {
    let n = [];
    if (e.rel_uuids) {
      const o = e.rel_uuids.length;
      let s = [];
      const a = 50;
      for (let i = 0; i < o; i += a) {
        const c = Math.min(o, i + a);
        s.push(e.rel_uuids.slice(i, c));
      }
      for (let i = 0; i < s.length; i++)
        (await this.getStories({ per_page: a, language: t.language, version: t.version, by_uuids: s[i].join(",") })).data.stories.forEach((c) => {
          n.push(c);
        });
    } else
      n = e.rels;
    n.forEach((o) => {
      this.relations[o.uuid] = _(d({}, o), { _stopResolving: !0 });
    });
  }
  async resolveStories(e, t) {
    let n = [];
    if (t.resolve_relations !== void 0 && t.resolve_relations.length > 0 && (e.rels || e.rel_uuids) && (n = t.resolve_relations.split(","), await this.resolveRelations(e, t)), ["1", "story", "url"].indexOf(t.resolve_links) > -1 && (e.links || e.link_uuids) && await this.resolveLinks(e, t), this.resolveNestedRelations)
      for (const o in this.relations)
        this.iterateTree(this.relations[o], n);
    e.story ? this.iterateTree(e.story, n) : e.stories.forEach((o) => {
      this.iterateTree(o, n);
    });
  }
  resolveAssetsRelations(e) {
    const { assets: t, stories: n, story: o } = e;
    if (n)
      for (const s of n)
        this.iterateTree(s, t);
    else {
      if (!o)
        return e;
      this.iterateTree(o, t);
    }
  }
  cacheResponse(e, t, n) {
    return n === void 0 && (n = 0), new Promise(async (o, s) => {
      let a = $({ url: e, params: t }), i = this.cacheProvider();
      if (this.cache.clear === "auto" && t.version === "draft" && await this.flushCache(), t.version === "published" && e != "/cdn/spaces/me") {
        const l = await i.get(a);
        if (l)
          return o(l);
      }
      try {
        let l = await this.throttle("get", e, { params: t, paramsSerializer: (f) => $(f) }), u = { data: l.data, headers: l.headers };
        if (u.data.assets && u.data.assets.length && this.resolveAssetsRelations(u.data), l.headers["per-page"] && (u = Object.assign({}, u, { perPage: parseInt(l.headers["per-page"]), total: parseInt(l.headers.total) })), l.status != 200)
          return s(l);
        (u.data.story || u.data.stories) && await this.resolveStories(u.data, t), t.version === "published" && e != "/cdn/spaces/me" && i.set(a, u), u.data.cv && (t.version == "draft" && g[t.token] != u.data.cv && this.flushCache(), g[t.token] = u.data.cv), o(u);
      } catch (l) {
        if (l.response && l.response.status === 429 && (n += 1) < this.maxRetries)
          return console.log(`Hit rate limit. Retrying in ${n} seconds.`), await (c = 1e3 * n, new Promise((u) => setTimeout(u, c))), this.cacheResponse(e, t, n).then(o).catch(s);
        s(l);
      }
      var c;
    });
  }
  throttledRequest(e, t, n) {
    return this.client[e](t, n);
  }
  cacheVersions() {
    return g;
  }
  cacheVersion() {
    return g[this.accessToken];
  }
  setCacheVersion(e) {
    this.accessToken && (g[this.accessToken] = e);
  }
  cacheProvider() {
    return this.cache.type === "memory" ? { get: (e) => m[e], getAll: () => m, set(e, t) {
      m[e] = t;
    }, flush() {
      m = {};
    } } : { get() {
    }, getAll() {
    }, set() {
    }, flush() {
    } };
  }
  async flushCache() {
    return await this.cacheProvider().flush(), this;
  }
}
const Ge = (r = {}) => {
  const { apiOptions: e } = r;
  if (!e.accessToken) {
    console.error("You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication");
    return;
  }
  return { storyblokApi: new de(e) };
};
var pe = (r) => {
  if (typeof r != "object" || typeof r._editable > "u")
    return {};
  const e = JSON.parse(r._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, ""));
  return {
    "data-blok-c": JSON.stringify(e),
    "data-blok-uid": e.id + "-" + e.uid
  };
};
let w;
const ge = "https://app.storyblok.com/f/storyblok-v2-latest.js", ye = (r, e, t = {}) => {
  if (!(typeof window > "u")) {
    if (typeof window.storyblokRegisterEvent > "u") {
      console.error("Storyblok Bridge is disabled. Please enable it to use it. Read https://github.com/storyblok/storyblok-js");
      return;
    }
    if (!r) {
      console.warn("Story ID is not defined. Please provide a valid ID.");
      return;
    }
    window.storyblokRegisterEvent(() => {
      new window.StoryblokBridge(t).on(["input", "published", "change"], (n) => {
        n.action === "input" && n.story.id === r ? e(n.story) : (n.action === "change" || n.action === "published") && n.storyId === r && window.location.reload();
      });
    });
  }
}, be = (r = {}) => {
  const {
    bridge: e,
    accessToken: t,
    use: n = [],
    apiOptions: o = {},
    richText: s = {}
  } = r;
  o.accessToken = o.accessToken || t;
  const a = { bridge: e, apiOptions: o };
  let i = {};
  return n.forEach((c) => {
    i = d(d({}, i), c(a));
  }), e !== !1 && oe(ge), w = new I(s.schema), s.resolver && K(w, s.resolver), i;
}, K = (r, e) => {
  r.addNode("blok", (t) => {
    let n = "";
    return t.attrs.body.forEach((o) => {
      n += e(o.component, o);
    }), {
      html: n
    };
  });
}, We = (r, e, t) => {
  let n = t || w;
  if (!n) {
    console.error("Please initialize the Storyblok SDK before calling the renderRichText function");
    return;
  }
  return r === "" ? "" : r ? (e && (n = new I(e.schema), e.resolver && K(n, e.resolver)), n.render(r)) : (console.warn(`${r} is not a valid Richtext object. This might be because the value of the richtext field is empty.
    
  For more info about the richtext object check https://github.com/storyblok/storyblok-js#rendering-rich-text`), "");
};
function me(r, e, t, n, o, s, a, i) {
  var c = typeof r == "function" ? r.options : r;
  e && (c.render = e, c.staticRenderFns = t, c._compiled = !0), n && (c.functional = !0), s && (c._scopeId = "data-v-" + s);
  var l;
  if (a ? (l = function(h) {
    h = h || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !h && typeof __VUE_SSR_CONTEXT__ < "u" && (h = __VUE_SSR_CONTEXT__), o && o.call(this, h), h && h._registeredComponents && h._registeredComponents.add(a);
  }, c._ssrRegister = l) : o && (l = i ? function() {
    o.call(
      this,
      (c.functional ? this.parent : this).$root.$options.shadowRoot
    );
  } : o), l)
    if (c.functional) {
      c._injectStyles = l;
      var u = c.render;
      c.render = function(h, b) {
        return l.call(b), u(h, b);
      };
    } else {
      var f = c.beforeCreate;
      c.beforeCreate = f ? [].concat(f, l) : [l];
    }
  return {
    exports: r,
    options: c
  };
}
const ke = {
  props: {
    blok: {
      type: Object
    }
  }
};
var _e = function() {
  var r = this, e = r._self._c;
  return e(r.blok.component, r._g(r._b({ tag: "component" }, "component", { ...r.$props, ...r.$attrs }, !1), r.$listeners));
}, ve = [], $e = /* @__PURE__ */ me(
  ke,
  _e,
  ve,
  !1,
  null,
  null,
  null,
  null
);
const we = $e.exports, Se = (r) => {
  console.error(`You can't use ${r} if you're not loading apiPlugin. Please provide it on StoryblokVue initialization.
    `);
}, xe = (r, e) => {
  if (e.value) {
    const t = pe(e.value);
    r.setAttribute("data-blok-c", t["data-blok-c"]), r.setAttribute("data-blok-uid", t["data-blok-uid"]), r.classList.add("storyblok__outline");
  }
}, Te = { bind: xe };
let S = null;
const Re = () => (S || Se("useStoryblokApi"), S), Ce = {
  install(r, e = {}) {
    r.directive("editable", Te), r.component("StoryblokComponent", we);
    const { storyblokApi: t } = be(e);
    S = t, r.prototype.$storyblokApi = t;
  }
};
typeof window < "u" && window.Vue && window.Vue.use(Ce);
var y = {};
Object.defineProperty(y, "__esModule", { value: !0 });
const Oe = "$nuxt", Ee = "__NUXT__", Pe = !1, je = "/static-path", Ne = "/_nuxt/";
var F = y.globalContext = Ee, p = y.globalNuxt = Oe, Ae = y.isFullStatic = Pe;
y.publicPath = Ne;
y.staticPath = je;
function Me(r) {
  if (!r)
    throw new Error("You must provide a key. You can have it generated automatically by adding '@nuxtjs/composition-api/dist/babel-plugin' to your Babel plugins.");
}
const C = () => {
  const r = Y();
  if (!!r)
    return r.proxy;
};
function v(r) {
  return r instanceof Function ? r() : r;
}
let Ie = {};
const De = () => {
  const r = C(), e = r ? "ssrRefs" : "globalRefs";
  let t;
  if (r && process.server) {
    const o = (r[p] || r.$options).context.ssrContext;
    t = o.nuxt.ssrRefs = o.nuxt.ssrRefs || {};
  }
  return { type: e, setData: (o, s) => {
    const a = t || Ie;
    a[o] = Ke(s);
  } };
}, A = (r) => !!r && typeof r == "object", Ke = (r) => r && JSON.parse(JSON.stringify(r)) || r, Fe = (r, e, t = "globalRefs") => {
  var n, o, s, a;
  return process.client ? process.env.NODE_ENV === "development" && ((n = window[p]) == null ? void 0 : n.context.isHMR) ? v(r) : (a = (s = (o = window[F]) == null ? void 0 : o[t]) == null ? void 0 : s[e]) != null ? a : v(r) : v(r);
}, Ve = (r, e) => {
  Me(e);
  const { type: t, setData: n } = De();
  let o = Fe(r, e, t);
  if (process.client)
    return L(o);
  r instanceof Function && n(e, o);
  const s = (i, c, l) => new Proxy(l, {
    get(u, f) {
      if (i(), A(u[f]))
        return s(i, c, u[f]);
      const h = Reflect.get(u, f);
      return typeof h == "function" ? h.bind(u) : h;
    },
    set(u, f, h) {
      const b = Reflect.set(u, f, h);
      return n(e, o), c(), b;
    }
  });
  return U((i, c) => ({
    get: () => (i(), A(o) ? s(i, c, o) : o),
    set: (l) => {
      n(e, l), o = l, c();
    }
  }));
}, qe = process.client && window[F];
function V(r) {
  let e;
  if (r.message || typeof r == "string")
    e = r.message || r;
  else
    try {
      e = JSON.stringify(r, null, 2);
    } catch {
      e = `[${r.constructor.name}]`;
    }
  return {
    ...r,
    message: e,
    statusCode: r.statusCode || r.status || r.response && r.response.status || 500
  };
}
function ze(r, e = "") {
  return function(n = e) {
    return r[n] === void 0 && (r[n] = 0), r[n]++;
  };
}
const x = /* @__PURE__ */ new WeakMap(), k = /* @__PURE__ */ new Map(), Je = (r) => {
  var e, t, n;
  return (n = (t = (e = r.$vnode) == null ? void 0 : e.elm) == null ? void 0 : t.dataset) == null ? void 0 : n.fetchKey;
};
function Le(r, e) {
  const t = x.get(r) || [];
  x.set(r, [...t, e]);
}
async function T() {
  const r = x.get(this);
  if (!r)
    return;
  this[p].nbFetching++, this.$fetchState.pending = !0, this.$fetchState.error = null, this._hydrated = !1;
  let e = null;
  const t = Date.now();
  try {
    await Promise.all(r.map((o) => {
      if (k.has(o))
        return k.get(o);
      const s = Promise.resolve(o(this)).finally(() => k.delete(o));
      return k.set(o, s), s;
    }));
  } catch (o) {
    process.dev && console.error("Error in fetch():", o), e = V(o);
  }
  const n = (this._fetchDelay || 0) - (Date.now() - t);
  n > 0 && await new Promise((o) => setTimeout(o, n)), this.$fetchState.error = e, this.$fetchState.pending = !1, this.$fetchState.timestamp = Date.now(), this.$nextTick(() => this[p].nbFetching--);
}
const q = (r) => {
  r.$fetchState = r.$fetchState || H({
    error: null,
    pending: !1,
    timestamp: 0
  });
}, z = (r) => {
  const e = C();
  if (!e)
    throw new Error("This must be called within a setup function.");
  M(() => {
    const t = e._setupProxy || e;
    for (const n in r)
      try {
        if (n in t) {
          const o = n;
          if (t[o] === r[n] || typeof t[o] == "function")
            continue;
          if (X(t[o])) {
            for (const s in t[o])
              s in r[n] || delete t[o][s];
            Object.assign(t[o], r[n]);
            continue;
          }
        }
        G(t, n, r[n]);
      } catch {
        process.env.NODE_ENV === "development" && console.warn(`Could not hydrate ${n}.`);
      }
  });
}, Ue = (r) => {
  r._fetchKey = R(r);
  const { fetchOnServer: e } = r.$options, t = typeof e == "function" ? e.call(r) !== !1 : e !== !1, n = r[p];
  if (!t || (n == null ? void 0 : n.isPreview) || !(n != null && n._pagePayload))
    return;
  r._hydrated = !0;
  const o = n._pagePayload.fetch[r._fetchKey];
  if (o && o._error) {
    r.$fetchState.error = o._error;
    return;
  }
  z(o);
};
async function Be(r) {
  if (!r._fetchOnServer)
    return;
  q(r);
  try {
    await T.call(r);
  } catch (o) {
    process.dev && console.error("Error in fetch():", o), r.$fetchState.error = V(o);
  }
  r.$fetchState.pending = !1, r._fetchKey = "push" in r.$ssrContext.nuxt.fetch ? r.$ssrContext.nuxt.fetch.length : r._fetchKey || r.$ssrContext.fetchCounters[""]++, r.$vnode.data || (r.$vnode.data = {});
  const e = r.$vnode.data.attrs = r.$vnode.data.attrs || {};
  e["data-fetch-key"] = r._fetchKey;
  const t = Object.fromEntries(Object.entries((r == null ? void 0 : r._setupProxy) || (r == null ? void 0 : r._setupState)).filter(([o, s]) => !(s && typeof s == "object" && "_compiled" in s || s instanceof Function || s instanceof Promise)).map(([o, s]) => [o, W(s) ? s.value : s])), n = r.$fetchState.error ? { _error: r.$fetchState.error } : JSON.parse(JSON.stringify(t));
  "push" in r.$ssrContext.nuxt.fetch ? r.$ssrContext.nuxt.fetch.push(n) : r.$ssrContext.nuxt.fetch[r._fetchKey] = n;
}
function R(r) {
  const e = r[p];
  if (process.server && "push" in r.$ssrContext.nuxt.fetch)
    return;
  if (process.client && "_payloadFetchIndex" in e)
    return e._payloadFetchIndex = e._payloadFetchIndex || 0, e._payloadFetchIndex++;
  const t = r.$options._scopeId || r.$options.name || "", n = ze(process.server ? r.$ssrContext.fetchCounters : r[p]._fetchCounters, t), o = r.$options;
  if (typeof o.fetchKey == "function")
    return o.fetchKey.call(r, n);
  {
    const s = typeof o.fetchKey == "string" ? o.fetchKey : t;
    return s ? s + ":" + n(s) : String(n(s));
  }
}
const Ye = (r) => {
  var e;
  const t = C();
  if (!t)
    throw new Error("This must be called within a setup function.");
  Le(t, r), typeof t.$options.fetchOnServer == "function" ? t._fetchOnServer = t.$options.fetchOnServer.call(t) !== !1 : t._fetchOnServer = t.$options.fetchOnServer !== !1, process.server && (t._fetchKey = R(t)), q(t), B(() => Be(t));
  function n() {
    return {
      fetch: t.$fetch,
      fetchState: t.$fetchState,
      $fetch: t.$fetch,
      $fetchState: t.$fetchState
    };
  }
  if (t._fetchDelay = typeof t.$options.fetchDelay == "number" ? t.$options.fetchDelay : 0, t.$fetch = T.bind(t), M(() => !t._hydrated && T.call(t)), process.server || !Je(t))
    return process.client && Ae && Ue(t), n();
  t._hydrated = !0, t._fetchKey = ((e = t.$vnode.elm) == null ? void 0 : e.dataset.fetchKey) || R(t);
  const o = qe.fetch[t._fetchKey];
  return o && o._error ? (t.$fetchState.error = o._error, n()) : (z(o), n());
}, Qe = (r, e = {}, t = {}) => {
  const n = Re();
  if (!n)
    return console.error(
      "useStoryblok cannot be used if you disabled useApiClient when adding @storyblok/nuxt-2 to your nuxt.config.js"
    );
  const o = Ve(null, r);
  Q(() => {
    o.value && o.value.id && ye(
      o.value.id,
      (i) => o.value = i,
      t
    );
  });
  const { fetch: s, fetchState: a } = Ye(async () => {
    const { data: i } = await n.get(`cdn/stories/${r}`, e);
    o.value = i.story;
  });
  return s(), { story: o, fetchState: a };
};
export {
  Ce as StoryblokVue,
  Ge as apiPlugin,
  We as renderRichText,
  Qe as useStoryblok,
  Re as useStoryblokApi,
  ye as useStoryblokBridge
};
