import e from "axios";
import "@vue/composition-api";
import { ref, onMounted, useFetch } from "@nuxtjs/composition-api";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a2, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b) => __defProps(a2, __getOwnPropDescs(b));
let loaded = false;
const callbacks = [];
const loadBridge = (src) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined")
      return;
    window.storyblokRegisterEvent = (cb) => {
      if (window.location === window.parent.location) {
        console.warn("You are not in Draft Mode or in the Visual Editor.");
        return;
      }
      if (!loaded)
        callbacks.push(cb);
      else
        cb();
    };
    if (document.getElementById("storyblok-javascript-bridge"))
      return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.id = "storyblok-javascript-bridge";
    script.onerror = (error) => reject(error);
    script.onload = (ev) => {
      callbacks.forEach((cb) => cb());
      loaded = true;
      resolve(ev);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  });
};
const pick = function(attrs, allowed) {
  if (!attrs) {
    return null;
  }
  let h2 = {};
  for (let key in attrs) {
    let value = attrs[key];
    if (allowed.indexOf(key) > -1 && value !== null) {
      h2[key] = value;
    }
  }
  return h2;
};
const isEmailLinkType = (type) => type === "email";
var defaultHtmlSerializer = {
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
    code_block(node) {
      return {
        tag: [
          "pre",
          {
            tag: "code",
            attrs: node.attrs
          }
        ]
      };
    },
    hard_break() {
      return {
        singleTag: "br"
      };
    },
    heading(node) {
      return {
        tag: `h${node.attrs.level}`
      };
    },
    image(node) {
      return {
        singleTag: [
          {
            tag: "img",
            attrs: pick(node.attrs, ["src", "alt", "title"])
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
    link(node) {
      const attrs = __spreadValues({}, node.attrs);
      const { linktype = "url" } = node.attrs;
      if (isEmailLinkType(linktype)) {
        attrs.href = `mailto:${attrs.href}`;
      }
      if (attrs.anchor) {
        attrs.href = `${attrs.href}#${attrs.anchor}`;
        delete attrs.anchor;
      }
      return {
        tag: [
          {
            tag: "a",
            attrs
          }
        ]
      };
    },
    styled(node) {
      return {
        tag: [
          {
            tag: "span",
            attrs: node.attrs
          }
        ]
      };
    }
  }
};
const escapeHTML = function(string) {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const reUnescapedHtml = /[&<>"']/g;
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr]) : string;
};
class RichTextResolver {
  constructor(schema) {
    if (!schema) {
      schema = defaultHtmlSerializer;
    }
    this.marks = schema.marks || [];
    this.nodes = schema.nodes || [];
  }
  addNode(key, schema) {
    this.nodes[key] = schema;
  }
  addMark(key, schema) {
    this.marks[key] = schema;
  }
  render(data = {}) {
    if (data.content && Array.isArray(data.content)) {
      let html = "";
      data.content.forEach((node) => {
        html += this.renderNode(node);
      });
      return html;
    }
    console.warn("The render method must receive an object with a content field, which is an array");
    return "";
  }
  renderNode(item) {
    let html = [];
    if (item.marks) {
      item.marks.forEach((m) => {
        const mark = this.getMatchingMark(m);
        if (mark) {
          html.push(this.renderOpeningTag(mark.tag));
        }
      });
    }
    const node = this.getMatchingNode(item);
    if (node && node.tag) {
      html.push(this.renderOpeningTag(node.tag));
    }
    if (item.content) {
      item.content.forEach((content) => {
        html.push(this.renderNode(content));
      });
    } else if (item.text) {
      html.push(escapeHTML(item.text));
    } else if (node && node.singleTag) {
      html.push(this.renderTag(node.singleTag, " /"));
    } else if (node && node.html) {
      html.push(node.html);
    }
    if (node && node.tag) {
      html.push(this.renderClosingTag(node.tag));
    }
    if (item.marks) {
      item.marks.slice(0).reverse().forEach((m) => {
        const mark = this.getMatchingMark(m);
        if (mark) {
          html.push(this.renderClosingTag(mark.tag));
        }
      });
    }
    return html.join("");
  }
  renderTag(tags, ending) {
    if (tags.constructor === String) {
      return `<${tags}${ending}>`;
    }
    const all = tags.map((tag) => {
      if (tag.constructor === String) {
        return `<${tag}${ending}>`;
      } else {
        let h2 = `<${tag.tag}`;
        if (tag.attrs) {
          for (let key in tag.attrs) {
            let value = tag.attrs[key];
            if (value !== null) {
              h2 += ` ${key}="${value}"`;
            }
          }
        }
        return `${h2}${ending}>`;
      }
    });
    return all.join("");
  }
  renderOpeningTag(tags) {
    return this.renderTag(tags, "");
  }
  renderClosingTag(tags) {
    if (tags.constructor === String) {
      return `</${tags}>`;
    }
    const all = tags.slice(0).reverse().map((tag) => {
      if (tag.constructor === String) {
        return `</${tag}>`;
      } else {
        return `</${tag.tag}>`;
      }
    });
    return all.join("");
  }
  getMatchingNode(item) {
    if (typeof this.nodes[item.type] !== "function") {
      return;
    }
    return this.nodes[item.type](item);
  }
  getMatchingMark(item) {
    if (typeof this.marks[item.type] !== "function") {
      return;
    }
    return this.marks[item.type](item);
  }
}
/*!
 * storyblok-js-client v4.5.2
 * Universal JavaScript SDK for Storyblok's API
 * (c) 2020-2022 Stobylok Team
 */
function t(e2) {
  return typeof e2 == "number" && (e2 == e2 && e2 !== 1 / 0 && e2 !== -1 / 0);
}
function s(e2, s2, r2) {
  if (!t(s2))
    throw new TypeError("Expected `limit` to be a finite number");
  if (!t(r2))
    throw new TypeError("Expected `interval` to be a finite number");
  var i2 = [], n2 = [], o2 = 0, a2 = function() {
    o2++;
    var t2 = setTimeout(function() {
      o2--, i2.length > 0 && a2(), n2 = n2.filter(function(e3) {
        return e3 !== t2;
      });
    }, r2);
    n2.indexOf(t2) < 0 && n2.push(t2);
    var s3 = i2.shift();
    s3.resolve(e2.apply(s3.self, s3.args));
  }, l2 = function() {
    var e3 = arguments, t2 = this;
    return new Promise(function(r3, n3) {
      i2.push({ resolve: r3, reject: n3, args: e3, self: t2 }), o2 < s2 && a2();
    });
  };
  return l2.abort = function() {
    n2.forEach(clearTimeout), n2 = [], i2.forEach(function(e3) {
      e3.reject(new throttle.AbortError());
    }), i2.length = 0;
  }, l2;
}
s.AbortError = function() {
  Error.call(this, "Throttled function aborted"), this.name = "AbortError";
};
const r = function(e2, t2) {
  if (!e2)
    return null;
  let s2 = {};
  for (let r2 in e2) {
    let i2 = e2[r2];
    t2.indexOf(r2) > -1 && i2 !== null && (s2[r2] = i2);
  }
  return s2;
};
var i = { nodes: { horizontal_rule: () => ({ singleTag: "hr" }), blockquote: () => ({ tag: "blockquote" }), bullet_list: () => ({ tag: "ul" }), code_block: (e2) => ({ tag: ["pre", { tag: "code", attrs: e2.attrs }] }), hard_break: () => ({ singleTag: "br" }), heading: (e2) => ({ tag: `h${e2.attrs.level}` }), image: (e2) => ({ singleTag: [{ tag: "img", attrs: r(e2.attrs, ["src", "alt", "title"]) }] }), list_item: () => ({ tag: "li" }), ordered_list: () => ({ tag: "ol" }), paragraph: () => ({ tag: "p" }) }, marks: { bold: () => ({ tag: "b" }), strike: () => ({ tag: "strike" }), underline: () => ({ tag: "u" }), strong: () => ({ tag: "strong" }), code: () => ({ tag: "code" }), italic: () => ({ tag: "i" }), link(e2) {
  const t2 = __spreadValues({}, e2.attrs), { linktype: s2 = "url" } = e2.attrs;
  return s2 === "email" && (t2.href = `mailto:${t2.href}`), t2.anchor && (t2.href = `${t2.href}#${t2.anchor}`, delete t2.anchor), { tag: [{ tag: "a", attrs: t2 }] };
}, styled: (e2) => ({ tag: [{ tag: "span", attrs: e2.attrs }] }) } };
class n {
  constructor(e2) {
    e2 || (e2 = i), this.marks = e2.marks || [], this.nodes = e2.nodes || [];
  }
  addNode(e2, t2) {
    this.nodes[e2] = t2;
  }
  addMark(e2, t2) {
    this.marks[e2] = t2;
  }
  render(e2 = {}) {
    if (e2.content && Array.isArray(e2.content)) {
      let t2 = "";
      return e2.content.forEach((e3) => {
        t2 += this.renderNode(e3);
      }), t2;
    }
    return console.warn("The render method must receive an object with a content field, which is an array"), "";
  }
  renderNode(e2) {
    let t2 = [];
    e2.marks && e2.marks.forEach((e3) => {
      const s3 = this.getMatchingMark(e3);
      s3 && t2.push(this.renderOpeningTag(s3.tag));
    });
    const s2 = this.getMatchingNode(e2);
    return s2 && s2.tag && t2.push(this.renderOpeningTag(s2.tag)), e2.content ? e2.content.forEach((e3) => {
      t2.push(this.renderNode(e3));
    }) : e2.text ? t2.push(function(e3) {
      const t3 = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, s3 = /[&<>"']/g, r2 = RegExp(s3.source);
      return e3 && r2.test(e3) ? e3.replace(s3, (e4) => t3[e4]) : e3;
    }(e2.text)) : s2 && s2.singleTag ? t2.push(this.renderTag(s2.singleTag, " /")) : s2 && s2.html && t2.push(s2.html), s2 && s2.tag && t2.push(this.renderClosingTag(s2.tag)), e2.marks && e2.marks.slice(0).reverse().forEach((e3) => {
      const s3 = this.getMatchingMark(e3);
      s3 && t2.push(this.renderClosingTag(s3.tag));
    }), t2.join("");
  }
  renderTag(e2, t2) {
    if (e2.constructor === String)
      return `<${e2}${t2}>`;
    return e2.map((e3) => {
      if (e3.constructor === String)
        return `<${e3}${t2}>`;
      {
        let s2 = `<${e3.tag}`;
        if (e3.attrs)
          for (let t3 in e3.attrs) {
            let r2 = e3.attrs[t3];
            r2 !== null && (s2 += ` ${t3}="${r2}"`);
          }
        return `${s2}${t2}>`;
      }
    }).join("");
  }
  renderOpeningTag(e2) {
    return this.renderTag(e2, "");
  }
  renderClosingTag(e2) {
    if (e2.constructor === String)
      return `</${e2}>`;
    return e2.slice(0).reverse().map((e3) => e3.constructor === String ? `</${e3}>` : `</${e3.tag}>`).join("");
  }
  getMatchingNode(e2) {
    if (typeof this.nodes[e2.type] == "function")
      return this.nodes[e2.type](e2);
  }
  getMatchingMark(e2) {
    if (typeof this.marks[e2.type] == "function")
      return this.marks[e2.type](e2);
  }
}
const o = (e2 = 0, t2 = e2) => {
  const s2 = Math.abs(t2 - e2) || 0, r2 = e2 < t2 ? 1 : -1;
  return ((e3 = 0, t3) => [...Array(e3)].map(t3))(s2, (t3, s3) => s3 * r2 + e2);
}, a = (e2, t2, s2) => {
  const r2 = [];
  for (const i2 in e2) {
    if (!Object.prototype.hasOwnProperty.call(e2, i2))
      continue;
    const n2 = e2[i2], o2 = s2 ? "" : encodeURIComponent(i2);
    let l2;
    l2 = typeof n2 == "object" ? a(n2, t2 ? t2 + encodeURIComponent("[" + o2 + "]") : o2, Array.isArray(n2)) : (t2 ? t2 + encodeURIComponent("[" + o2 + "]") : o2) + "=" + encodeURIComponent(n2), r2.push(l2);
  }
  return r2.join("&");
};
let l = {}, c = {};
class h {
  constructor(t2, r2) {
    if (!r2) {
      let e2 = t2.region ? `-${t2.region}` : "", s2 = t2.https === false ? "http" : "https";
      r2 = t2.oauthToken === void 0 ? `${s2}://api${e2}.storyblok.com/v2` : `${s2}://api${e2}.storyblok.com/v1`;
    }
    let i2 = Object.assign({}, t2.headers), o2 = 5;
    t2.oauthToken !== void 0 && (i2.Authorization = t2.oauthToken, o2 = 3), t2.rateLimit !== void 0 && (o2 = t2.rateLimit), this.richTextResolver = new n(t2.richTextSchema), typeof t2.componentResolver == "function" && this.setComponentResolver(t2.componentResolver), this.maxRetries = t2.maxRetries || 5, this.throttle = s(this.throttledRequest, o2, 1e3), this.accessToken = t2.accessToken, this.relations = {}, this.links = {}, this.cache = t2.cache || { clear: "manual" }, this.client = e.create({ baseURL: r2, timeout: t2.timeout || 0, headers: i2, proxy: t2.proxy || false }), t2.responseInterceptor && this.client.interceptors.response.use((e2) => t2.responseInterceptor(e2)), this.resolveNestedRelations = t2.resolveNestedRelations || true;
  }
  setComponentResolver(e2) {
    this.richTextResolver.addNode("blok", (t2) => {
      let s2 = "";
      return t2.attrs.body.forEach((t3) => {
        s2 += e2(t3.component, t3);
      }), { html: s2 };
    });
  }
  parseParams(e2 = {}) {
    return e2.version || (e2.version = "published"), e2.token || (e2.token = this.getToken()), e2.cv || (e2.cv = c[e2.token]), Array.isArray(e2.resolve_relations) && (e2.resolve_relations = e2.resolve_relations.join(",")), e2;
  }
  factoryParamOptions(e2, t2 = {}) {
    return ((e3 = "") => e3.indexOf("/cdn/") > -1)(e2) ? this.parseParams(t2) : t2;
  }
  makeRequest(e2, t2, s2, r2) {
    const i2 = this.factoryParamOptions(e2, ((e3 = {}, t3 = 25, s3 = 1) => __spreadProps(__spreadValues({}, e3), { per_page: t3, page: s3 }))(t2, s2, r2));
    return this.cacheResponse(e2, i2);
  }
  get(e2, t2) {
    let s2 = `/${e2}`;
    const r2 = this.factoryParamOptions(s2, t2);
    return this.cacheResponse(s2, r2);
  }
  async getAll(e2, t2 = {}, s2) {
    const r2 = t2.per_page || 25, i2 = `/${e2}`, n2 = i2.split("/");
    s2 = s2 || n2[n2.length - 1];
    const a2 = await this.makeRequest(i2, t2, r2, 1), l2 = Math.ceil(a2.total / r2);
    return ((e3 = [], t3) => e3.map(t3).reduce((e4, t4) => [...e4, ...t4], []))([a2, ...await (async (e3 = [], t3) => Promise.all(e3.map(t3)))(o(1, l2), async (e3) => this.makeRequest(i2, t2, r2, e3 + 1))], (e3) => Object.values(e3.data[s2]));
  }
  post(e2, t2) {
    let s2 = `/${e2}`;
    return this.throttle("post", s2, t2);
  }
  put(e2, t2) {
    let s2 = `/${e2}`;
    return this.throttle("put", s2, t2);
  }
  delete(e2, t2) {
    let s2 = `/${e2}`;
    return this.throttle("delete", s2, t2);
  }
  getStories(e2) {
    return this.get("cdn/stories", e2);
  }
  getStory(e2, t2) {
    return this.get(`cdn/stories/${e2}`, t2);
  }
  setToken(e2) {
    this.accessToken = e2;
  }
  getToken() {
    return this.accessToken;
  }
  _cleanCopy(e2) {
    return JSON.parse(JSON.stringify(e2));
  }
  _insertLinks(e2, t2) {
    const s2 = e2[t2];
    s2 && s2.fieldtype == "multilink" && s2.linktype == "story" && typeof s2.id == "string" && this.links[s2.id] ? s2.story = this._cleanCopy(this.links[s2.id]) : s2 && s2.linktype === "story" && typeof s2.uuid == "string" && this.links[s2.uuid] && (s2.story = this._cleanCopy(this.links[s2.uuid]));
  }
  _insertRelations(e2, t2, s2) {
    if (s2.indexOf(e2.component + "." + t2) > -1) {
      if (typeof e2[t2] == "string")
        this.relations[e2[t2]] && (e2[t2] = this._cleanCopy(this.relations[e2[t2]]));
      else if (e2[t2].constructor === Array) {
        let s3 = [];
        e2[t2].forEach((e3) => {
          this.relations[e3] && s3.push(this._cleanCopy(this.relations[e3]));
        }), e2[t2] = s3;
      }
    }
  }
  _insertAssetsRelations(e2, t2) {
    t2.forEach((t3) => {
      e2.id === t3.id && (e2.original = t3, e2.original.filename = e2.filename, e2.original.filename = e2.original.filename.includes("https://s3.amazonaws.com/") ? e2.original.filename : e2.original.filename.replace("https://", "https://s3.amazonaws.com/"), delete e2.original.s3_filename);
    });
  }
  iterateTree(e2, t2) {
    let s2 = (e3) => {
      if (e3 != null) {
        if (e3.constructor === Array)
          for (let t3 = 0; t3 < e3.length; t3++)
            s2(e3[t3]);
        else if (e3.constructor === Object) {
          if (e3._stopResolving)
            return;
          for (let r2 in e3)
            e3.component && e3._uid || e3.type === "link" ? (this._insertRelations(e3, r2, t2), this._insertLinks(e3, r2)) : "id" in e3 && e3.fieldtype === "asset" && this._insertAssetsRelations(e3, t2), s2(e3[r2]);
        }
      }
    };
    s2(e2.content);
  }
  async resolveLinks(e2, t2) {
    let s2 = [];
    if (e2.link_uuids) {
      const r2 = e2.link_uuids.length;
      let i2 = [];
      const n2 = 50;
      for (let t3 = 0; t3 < r2; t3 += n2) {
        const s3 = Math.min(r2, t3 + n2);
        i2.push(e2.link_uuids.slice(t3, s3));
      }
      for (let e3 = 0; e3 < i2.length; e3++) {
        (await this.getStories({ per_page: n2, language: t2.language, version: t2.version, by_uuids: i2[e3].join(",") })).data.stories.forEach((e4) => {
          s2.push(e4);
        });
      }
    } else
      s2 = e2.links;
    s2.forEach((e3) => {
      this.links[e3.uuid] = __spreadProps(__spreadValues({}, e3), { _stopResolving: true });
    });
  }
  async resolveRelations(e2, t2) {
    let s2 = [];
    if (e2.rel_uuids) {
      const r2 = e2.rel_uuids.length;
      let i2 = [];
      const n2 = 50;
      for (let t3 = 0; t3 < r2; t3 += n2) {
        const s3 = Math.min(r2, t3 + n2);
        i2.push(e2.rel_uuids.slice(t3, s3));
      }
      for (let e3 = 0; e3 < i2.length; e3++) {
        (await this.getStories({ per_page: n2, language: t2.language, version: t2.version, by_uuids: i2[e3].join(",") })).data.stories.forEach((e4) => {
          s2.push(e4);
        });
      }
    } else
      s2 = e2.rels;
    s2.forEach((e3) => {
      this.relations[e3.uuid] = __spreadProps(__spreadValues({}, e3), { _stopResolving: true });
    });
  }
  async resolveStories(e2, t2) {
    let s2 = [];
    if (t2.resolve_relations !== void 0 && t2.resolve_relations.length > 0 && (e2.rels || e2.rel_uuids) && (s2 = t2.resolve_relations.split(","), await this.resolveRelations(e2, t2)), ["1", "story", "url"].indexOf(t2.resolve_links) > -1 && (e2.links || e2.link_uuids) && await this.resolveLinks(e2, t2), this.resolveNestedRelations)
      for (const e3 in this.relations)
        this.iterateTree(this.relations[e3], s2);
    e2.story ? this.iterateTree(e2.story, s2) : e2.stories.forEach((e3) => {
      this.iterateTree(e3, s2);
    });
  }
  resolveAssetsRelations(e2) {
    const { assets: t2, stories: s2, story: r2 } = e2;
    if (s2)
      for (const e3 of s2)
        this.iterateTree(e3, t2);
    else {
      if (!r2)
        return e2;
      this.iterateTree(r2, t2);
    }
  }
  cacheResponse(e2, t2, s2) {
    return s2 === void 0 && (s2 = 0), new Promise(async (r2, i2) => {
      let n2 = a({ url: e2, params: t2 }), o2 = this.cacheProvider();
      if (this.cache.clear === "auto" && t2.version === "draft" && await this.flushCache(), t2.version === "published" && e2 != "/cdn/spaces/me") {
        const e3 = await o2.get(n2);
        if (e3)
          return r2(e3);
      }
      try {
        let s3 = await this.throttle("get", e2, { params: t2, paramsSerializer: (e3) => a(e3) }), l3 = { data: s3.data, headers: s3.headers };
        if (l3.data.assets && l3.data.assets.length && this.resolveAssetsRelations(l3.data), s3.headers["per-page"] && (l3 = Object.assign({}, l3, { perPage: parseInt(s3.headers["per-page"]), total: parseInt(s3.headers.total) })), s3.status != 200)
          return i2(s3);
        (l3.data.story || l3.data.stories) && await this.resolveStories(l3.data, t2), t2.version === "published" && e2 != "/cdn/spaces/me" && o2.set(n2, l3), l3.data.cv && (t2.version == "draft" && c[t2.token] != l3.data.cv && this.flushCache(), c[t2.token] = l3.data.cv), r2(l3);
      } catch (n3) {
        if (n3.response && n3.response.status === 429 && (s2 += 1) < this.maxRetries)
          return console.log(`Hit rate limit. Retrying in ${s2} seconds.`), await (l2 = 1e3 * s2, new Promise((e3) => setTimeout(e3, l2))), this.cacheResponse(e2, t2, s2).then(r2).catch(i2);
        i2(n3);
      }
      var l2;
    });
  }
  throttledRequest(e2, t2, s2) {
    return this.client[e2](t2, s2);
  }
  cacheVersions() {
    return c;
  }
  cacheVersion() {
    return c[this.accessToken];
  }
  setCacheVersion(e2) {
    this.accessToken && (c[this.accessToken] = e2);
  }
  cacheProvider() {
    return this.cache.type === "memory" ? { get: (e2) => l[e2], getAll: () => l, set(e2, t2) {
      l[e2] = t2;
    }, flush() {
      l = {};
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
const apiFactory = (options = {}) => {
  const { apiOptions } = options;
  if (!apiOptions.accessToken) {
    console.error("You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication");
    return;
  }
  const storyblokApi = new h(apiOptions);
  return { storyblokApi };
};
var editable = (blok) => {
  if (typeof blok !== "object" || typeof blok._editable === "undefined") {
    return {};
  }
  const options = JSON.parse(blok._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, ""));
  return {
    "data-blok-c": JSON.stringify(options),
    "data-blok-uid": options.id + "-" + options.uid
  };
};
let richTextResolver;
const bridgeLatest = "https://app.storyblok.com/f/storyblok-v2-latest.js";
const useStoryblokBridge = (id, cb, options = {}) => {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof window.storyblokRegisterEvent === "undefined") {
    console.error("Storyblok Bridge is disabled. Please enable it to use it. Read https://github.com/storyblok/storyblok-js");
    return;
  }
  if (!id) {
    console.warn("Story ID is not defined. Please provide a valid ID.");
    return;
  }
  window.storyblokRegisterEvent(() => {
    const sbBridge = new window.StoryblokBridge(options);
    sbBridge.on(["input", "published", "change"], (event) => {
      if (event.story.id === id) {
        if (event.action === "input")
          cb(event.story);
        else
          window.location.reload();
      }
    });
  });
};
const storyblokInit = (pluginOptions = {}) => {
  const {
    bridge,
    accessToken,
    use = [],
    apiOptions = {},
    richText = {}
  } = pluginOptions;
  apiOptions.accessToken = apiOptions.accessToken || accessToken;
  const options = { bridge, apiOptions };
  let result = {};
  use.forEach((pluginFactory) => {
    result = __spreadValues(__spreadValues({}, result), pluginFactory(options));
  });
  if (bridge !== false) {
    loadBridge(bridgeLatest);
  }
  richTextResolver = new RichTextResolver(richText.schema);
  if (richText.resolver) {
    setComponentResolver(richTextResolver, richText.resolver);
  }
  return result;
};
const setComponentResolver = (resolver, resolveFn) => {
  resolver.addNode("blok", (node) => {
    let html = "";
    node.attrs.body.forEach((blok) => {
      html += resolveFn(blok.component, blok);
    });
    return {
      html
    };
  });
};
const renderRichText = (data, options) => {
  if (!richTextResolver) {
    console.error("Please initialize the Storyblok SDK before calling the renderRichText function");
    return;
  }
  if (data === "") {
    return "";
  } else if (!data) {
    console.warn(`${data} is not a valid Richtext object. This might be because the value of the richtext field is empty.
    
  For more info about the richtext object check https://github.com/storyblok/storyblok-js#rendering-rich-text`);
    return "";
  }
  let localResolver = richTextResolver;
  if (options) {
    localResolver = new RichTextResolver(options.schema);
    if (options.resolver) {
      setComponentResolver(localResolver, options.resolver);
    }
  }
  return localResolver.render(data);
};
var render = function __render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(_vm.blok.component, _vm._g(_vm._b({
    tag: "component"
  }, "component", Object.assign({}, _vm.$props, _vm.$attrs), false), _vm.$listeners));
};
var staticRenderFns = [];
function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render2) {
    options.render = render2;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  if (functionalTemplate) {
    options.functional = true;
  }
  if (scopeId) {
    options._scopeId = "data-v-" + scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
        context = __VUE_SSR_CONTEXT__;
      }
      if (injectStyles) {
        injectStyles.call(this, context);
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (injectStyles) {
    hook = shadowMode ? function() {
      injectStyles.call(
        this,
        (options.functional ? this.parent : this).$root.$options.shadowRoot
      );
    } : injectStyles;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h2, context) {
        hook.call(context);
        return originalRender(h2, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const __vue2_script = {
  props: {
    blok: {
      type: Object
    }
  }
};
const __cssModules = {};
var __component__ = /* @__PURE__ */ normalizeComponent(
  __vue2_script,
  render,
  staticRenderFns,
  false,
  __vue2_injectStyles,
  null,
  null,
  null
);
function __vue2_injectStyles(context) {
  for (let o2 in __cssModules) {
    this[o2] = __cssModules[o2];
  }
}
var StoryblokComponent = /* @__PURE__ */ function() {
  return __component__.exports;
}();
const printError = (fnName) => {
  console.error(`You can't use ${fnName} if you're not loading apiPlugin. Please provide it on StoryblokVue initialization.
    `);
};
const bindFn = (el, binding) => {
  if (binding.value) {
    const options = editable(binding.value);
    el.setAttribute("data-blok-c", options["data-blok-c"]);
    el.setAttribute("data-blok-uid", options["data-blok-uid"]);
    el.classList.add("storyblok__outline");
  }
};
const vEditableDirective = { bind: bindFn };
let storyblokApiInstance = null;
const useStoryblokApi = () => {
  if (!storyblokApiInstance)
    printError("useStoryblokApi");
  return storyblokApiInstance;
};
const StoryblokVue = {
  install(app, pluginOptions = {}) {
    app.directive("editable", vEditableDirective);
    app.component("StoryblokComponent", StoryblokComponent);
    const { storyblokApi } = storyblokInit(pluginOptions);
    storyblokApiInstance = storyblokApi;
    app.prototype.$storyblokApi = storyblokApi;
  }
};
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(StoryblokVue);
}
const useStoryblok = (slug, apiOptions = {}, bridgeOptions = {}) => {
  const storyblokApi = useStoryblokApi();
  if (!storyblokApi)
    return console.error(
      "useStoryblok cannot be used if you disabled useApiClient when adding @storyblok/nuxt-2 to your nuxt.config.js"
    );
  const story = ref(null);
  onMounted(() => {
    if (story.value && story.value.id) {
      useStoryblokBridge(
        story.value.id,
        (evStory) => story.value = evStory,
        bridgeOptions
      );
    }
  });
  const { fetch, fetchState } = useFetch(async () => {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, apiOptions);
    story.value = data.story;
  }, slug);
  fetch();
  return { story, fetchState };
};
export { StoryblokVue, apiFactory as apiPlugin, renderRichText, useStoryblok, useStoryblokApi, useStoryblokBridge };
