globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { promises, existsSync } from 'fs';
import { dirname as dirname$1, resolve as resolve$1, join } from 'path';
import { promises as promises$1 } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createIPX, createIPXMiddleware } from 'ipx';
import { unified } from 'unified';
import { toString } from 'mdast-util-to-string';
import { postprocess, preprocess } from 'micromark';
import { stringifyPosition } from 'unist-util-stringify-position';
import { markdownLineEnding, markdownSpace } from 'micromark-util-character';
import { push, splice } from 'micromark-util-chunked';
import { resolveAll } from 'micromark-util-resolve-all';
import { normalizeUri } from 'micromark-util-sanitize-uri';
import slugify from 'slugify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import remarkMDC, { parseFrontMatter } from 'remark-mdc';
import { toString as toString$1 } from 'hast-util-to-string';
import Slugger from 'github-slugger';
import { detab } from 'detab';
import remarkEmoji from 'remark-emoji';
import remarkGFM from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSortAttributeValues from 'rehype-sort-attribute-values';
import rehypeSortAttributes from 'rehype-sort-attributes';
import rehypeRaw from 'rehype-raw';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.at(-1) === '"' && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode$1(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode$1(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode$1(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

function isRelative(inputString) {
  return ["./", "../"].some((string_) => inputString.startsWith(string_));
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  const [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  const { pathname, search, hash } = parsePath(
    path.replace(/\/(?=[A-Za-z]:)/, "")
  );
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol ? parsed.protocol + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    // @ts-ignore
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode !== void 0) {
      node = nextNode;
    } else {
      node = node.placeholderChildNode;
      if (node !== null) {
        params[node.paramName] = section;
        paramsFound = true;
      } else {
        break;
      }
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildNode = childNode;
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      node = childNode;
    }
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections[sections.length - 1];
    node.data = null;
    if (Object.keys(node.children).length === 0) {
      const parentNode = node.parent;
      parentNode.children.delete(lastSection);
      parentNode.wildcardChildNode = null;
      parentNode.placeholderChildNode = null;
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildNode: null
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table);
}
function _createMatcher(table) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table) {
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path.startsWith(key)) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        table.static.set(path, node.data);
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!_isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (_isPlainObject(value) && _isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function _isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function rawHeaders(headers) {
  const rawHeaders2 = [];
  for (const key in headers) {
    if (Array.isArray(headers[key])) {
      for (const h of headers[key]) {
        rawHeaders2.push(key, h);
      }
    } else {
      rawHeaders2.push(key, headers[key]);
    }
  }
  return rawHeaders2;
}
function mergeFns(...functions) {
  return function(...args) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}
function createNotImplementedError(name) {
  throw new Error(`[unenv] ${name} is not implemented yet!`);
}

let defaultMaxListeners = 10;
let EventEmitter$1 = class EventEmitter {
  __unenv__ = true;
  _events = /* @__PURE__ */ Object.create(null);
  _maxListeners;
  static get defaultMaxListeners() {
    return defaultMaxListeners;
  }
  static set defaultMaxListeners(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + "."
      );
    }
    defaultMaxListeners = arg;
  }
  setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
      throw new RangeError(
        'The value of "n" is out of range. It must be a non-negative number. Received ' + n + "."
      );
    }
    this._maxListeners = n;
    return this;
  }
  getMaxListeners() {
    return _getMaxListeners(this);
  }
  emit(type, ...args) {
    if (!this._events[type] || this._events[type].length === 0) {
      return false;
    }
    if (type === "error") {
      let er;
      if (args.length > 0) {
        er = args[0];
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(
        "Unhandled error." + (er ? " (" + er.message + ")" : "")
      );
      err.context = er;
      throw err;
    }
    for (const _listener of this._events[type]) {
      (_listener.listener || _listener).apply(this, args);
    }
    return true;
  }
  addListener(type, listener) {
    return _addListener(this, type, listener, false);
  }
  on(type, listener) {
    return _addListener(this, type, listener, false);
  }
  prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  }
  once(type, listener) {
    return this.on(type, _wrapOnce(this, type, listener));
  }
  prependOnceListener(type, listener) {
    return this.prependListener(type, _wrapOnce(this, type, listener));
  }
  removeListener(type, listener) {
    return _removeListener(this, type, listener);
  }
  off(type, listener) {
    return this.removeListener(type, listener);
  }
  removeAllListeners(type) {
    return _removeAllListeners(this, type);
  }
  listeners(type) {
    return _listeners(this, type, true);
  }
  rawListeners(type) {
    return _listeners(this, type, false);
  }
  listenerCount(type) {
    return this.rawListeners(type).length;
  }
  eventNames() {
    return Object.keys(this._events);
  }
};
function _addListener(target, type, listener, prepend) {
  _checkListener(listener);
  if (target._events.newListener !== void 0) {
    target.emit("newListener", type, listener.listener || listener);
  }
  if (!target._events[type]) {
    target._events[type] = [];
  }
  if (prepend) {
    target._events[type].unshift(listener);
  } else {
    target._events[type].push(listener);
  }
  const maxListeners = _getMaxListeners(target);
  if (maxListeners > 0 && target._events[type].length > maxListeners && !target._events[type].warned) {
    target._events[type].warned = true;
    const warning = new Error(
      `[unenv] Possible EventEmitter memory leak detected. ${target._events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    warning.name = "MaxListenersExceededWarning";
    warning.emitter = target;
    warning.type = type;
    warning.count = target._events[type]?.length;
    console.warn(warning);
  }
  return target;
}
function _removeListener(target, type, listener) {
  _checkListener(listener);
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  const lenBeforeFilter = target._events[type].length;
  target._events[type] = target._events[type].filter((fn) => fn !== listener);
  if (lenBeforeFilter === target._events[type].length) {
    return target;
  }
  if (target._events.removeListener) {
    target.emit("removeListener", type, listener.listener || listener);
  }
  if (target._events[type].length === 0) {
    delete target._events[type];
  }
  return target;
}
function _removeAllListeners(target, type) {
  if (!target._events[type] || target._events[type].length === 0) {
    return target;
  }
  if (target._events.removeListener) {
    for (const _listener of target._events[type]) {
      target.emit("removeListener", type, _listener.listener || _listener);
    }
  }
  delete target._events[type];
  return target;
}
function _wrapOnce(target, type, listener) {
  let fired = false;
  const wrapper = (...args) => {
    if (fired) {
      return;
    }
    target.removeListener(type, wrapper);
    fired = true;
    return args.length === 0 ? listener.call(target) : listener.apply(target, args);
  };
  wrapper.listener = listener;
  return wrapper;
}
function _getMaxListeners(target) {
  return target._maxListeners ?? EventEmitter$1.defaultMaxListeners;
}
function _listeners(target, type, unwrap) {
  let listeners = target._events[type];
  if (typeof listeners === "function") {
    listeners = [listeners];
  }
  return unwrap ? listeners.map((l) => l.listener || l) : listeners;
}
function _checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      'The "listener" argument must be of type Function. Received type ' + typeof listener
    );
  }
}

const EventEmitter = globalThis.EventEmitter || EventEmitter$1;

class _Readable extends EventEmitter {
  __unenv__ = true;
  readableEncoding = null;
  readableEnded = true;
  readableFlowing = false;
  readableHighWaterMark = 0;
  readableLength = 0;
  readableObjectMode = false;
  readableAborted = false;
  readableDidRead = false;
  closed = false;
  errored = null;
  readable = false;
  destroyed = false;
  static from(_iterable, options) {
    return new _Readable(options);
  }
  constructor(_opts) {
    super();
  }
  _read(_size) {
  }
  read(_size) {
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  isPaused() {
    return true;
  }
  unpipe(_destination) {
    return this;
  }
  unshift(_chunk, _encoding) {
  }
  wrap(_oldStream) {
    return this;
  }
  push(_chunk, _encoding) {
    return false;
  }
  _destroy(_error, _callback) {
    this.removeAllListeners();
  }
  destroy(error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }
  pipe(_destenition, _options) {
    return {};
  }
  compose(stream, options) {
    throw new Error("[unenv] Method not implemented.");
  }
  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }
  async *[Symbol.asyncIterator]() {
    throw createNotImplementedError("Readable.asyncIterator");
  }
  iterator(options) {
    throw createNotImplementedError("Readable.iterator");
  }
  map(fn, options) {
    throw createNotImplementedError("Readable.map");
  }
  filter(fn, options) {
    throw createNotImplementedError("Readable.filter");
  }
  forEach(fn, options) {
    throw createNotImplementedError("Readable.forEach");
  }
  reduce(fn, initialValue, options) {
    throw createNotImplementedError("Readable.reduce");
  }
  find(fn, options) {
    throw createNotImplementedError("Readable.find");
  }
  findIndex(fn, options) {
    throw createNotImplementedError("Readable.findIndex");
  }
  some(fn, options) {
    throw createNotImplementedError("Readable.some");
  }
  toArray(options) {
    throw createNotImplementedError("Readable.toArray");
  }
  every(fn, options) {
    throw createNotImplementedError("Readable.every");
  }
  flatMap(fn, options) {
    throw createNotImplementedError("Readable.flatMap");
  }
  drop(limit, options) {
    throw createNotImplementedError("Readable.drop");
  }
  take(limit, options) {
    throw createNotImplementedError("Readable.take");
  }
  asIndexedPairs(options) {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}
const Readable = globalThis.Readable || _Readable;

class _Writable extends EventEmitter {
  __unenv__ = true;
  writable = true;
  writableEnded = false;
  writableFinished = false;
  writableHighWaterMark = 0;
  writableLength = 0;
  writableObjectMode = false;
  writableCorked = 0;
  closed = false;
  errored = null;
  writableNeedDrain = false;
  destroyed = false;
  _data;
  _encoding = "utf-8";
  constructor(_opts) {
    super();
  }
  pipe(_destenition, _options) {
    return {};
  }
  _write(chunk, encoding, callback) {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === void 0) {
      this._data = chunk;
    } else {
      const a = typeof this._data === "string" ? Buffer.from(this._data, this._encoding || encoding || "utf8") : this._data;
      const b = typeof chunk === "string" ? Buffer.from(chunk, encoding || this._encoding || "utf8") : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }
  _writev(_chunks, _callback) {
  }
  _destroy(_error, _callback) {
  }
  _final(_callback) {
  }
  write(chunk, arg2, arg3) {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf-8";
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    this._write(chunk, encoding, cb);
    return true;
  }
  setDefaultEncoding(_encoding) {
    return this;
  }
  end(arg1, arg2, arg3) {
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : void 0;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? void 0 : arg1;
    if (data) {
      const encoding = arg2 === callback ? void 0 : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }
  cork() {
  }
  uncork() {
  }
  destroy(_error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }
  compose(stream, options) {
    throw new Error("[h3] Method not implemented.");
  }
}
const Writable = globalThis.Writable || _Writable;

const __Duplex = class {
  allowHalfOpen = true;
  _destroy;
  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
};
function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}
const _Duplex = /* @__PURE__ */ getDuplex();
const Duplex = globalThis.Duplex || _Duplex;

class Socket extends Duplex {
  __unenv__ = true;
  bufferSize = 0;
  bytesRead = 0;
  bytesWritten = 0;
  connecting = false;
  destroyed = false;
  pending = false;
  localAddress = "";
  localPort = 0;
  remoteAddress = "";
  remoteFamily = "";
  remotePort = 0;
  autoSelectFamilyAttemptedAddresses = [];
  readyState = "readOnly";
  constructor(_options) {
    super();
  }
  write(_buffer, _arg1, _arg2) {
    return false;
  }
  connect(_arg1, _arg2, _arg3) {
    return this;
  }
  end(_arg1, _arg2, _arg3) {
    return this;
  }
  setEncoding(_encoding) {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
  setTimeout(_timeout, _callback) {
    return this;
  }
  setNoDelay(_noDelay) {
    return this;
  }
  setKeepAlive(_enable, _initialDelay) {
    return this;
  }
  address() {
    return {};
  }
  unref() {
    return this;
  }
  ref() {
    return this;
  }
  destroySoon() {
    this.destroy();
  }
  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    err.code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

class IncomingMessage extends Readable {
  __unenv__ = {};
  aborted = false;
  httpVersion = "1.1";
  httpVersionMajor = 1;
  httpVersionMinor = 1;
  complete = true;
  connection;
  socket;
  headers = {};
  trailers = {};
  method = "GET";
  url = "/";
  statusCode = 200;
  statusMessage = "";
  closed = false;
  errored = null;
  readable = false;
  constructor(socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }
  get rawHeaders() {
    return rawHeaders(this.headers);
  }
  get rawTrailers() {
    return [];
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  get headersDistinct() {
    return _distinct(this.headers);
  }
  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}
function _distinct(obj) {
  const d = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key] = (Array.isArray(value) ? value : [value]).filter(
        Boolean
      );
    }
  }
  return d;
}

class ServerResponse extends Writable {
  __unenv__ = true;
  statusCode = 200;
  statusMessage = "";
  upgrading = false;
  chunkedEncoding = false;
  shouldKeepAlive = false;
  useChunkedEncodingByDefault = false;
  sendDate = false;
  finished = false;
  headersSent = false;
  strictContentLength = false;
  connection = null;
  socket = null;
  req;
  _headers = {};
  constructor(req) {
    super();
    this.req = req;
  }
  assignSocket(socket) {
    socket._httpMessage = this;
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }
  _flush() {
    this.flushHeaders();
  }
  detachSocket(_socket) {
  }
  writeContinue(_callback) {
  }
  writeHead(statusCode, arg1, arg2) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = void 0;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) ; else {
        for (const key in headers) {
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }
  writeProcessing() {
  }
  setTimeout(_msecs, _callback) {
    return this;
  }
  appendHeader(name, value) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...Array.isArray(current) ? current : [current],
      ...Array.isArray(value) ? value : [value]
    ].filter(Boolean);
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }
  setHeader(name, value) {
    this._headers[name.toLowerCase()] = value;
    return this;
  }
  getHeader(name) {
    return this._headers[name.toLowerCase()];
  }
  getHeaders() {
    return this._headers;
  }
  getHeaderNames() {
    return Object.keys(this._headers);
  }
  hasHeader(name) {
    return name.toLowerCase() in this._headers;
  }
  removeHeader(name) {
    delete this._headers[name.toLowerCase()];
  }
  addTrailers(_headers) {
  }
  flushHeaders() {
  }
  writeEarlyHints(_headers, cb) {
    if (typeof cb === "function") {
      cb();
    }
  }
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$1(this, "statusCode", 500);
    __publicField$1(this, "fatal", false);
    __publicField$1(this, "unhandled", false);
    __publicField$1(this, "statusMessage");
    __publicField$1(this, "data");
    __publicField$1(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$1(H3Error, "__h3_error__", true);
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  return event.web?.request?.body || event._requestBody || new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions) {
  const cookieStr = serialize(name, value, {
    path: "/",
    ...serializeOptions
  });
  let setCookies = event.node.res.getHeader("set-cookie");
  if (!Array.isArray(setCookies)) {
    setCookies = [setCookies];
  }
  setCookies = setCookies.filter((cookieValue) => {
    return cookieValue && !cookieValue.startsWith(name + "=");
  });
  event.node.res.setHeader("set-cookie", [...setCookies, cookieStr]);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(name, value);
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders(
    getProxyRequestHeaders(event),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  const response = await _getFetch(opts.fetch)(target, {
    headers: opts.headers,
    ignoreResponseError: true,
    // make $ofetch.raw transparent
    ...opts.fetchOptions
  });
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    // Context
    __publicField(this, "node");
    // Node
    __publicField(this, "web");
    // Web
    __publicField(this, "context", {});
    // Shared
    // Request
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    // Response
    __publicField(this, "_handled", false);
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. **/
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. **/
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    return Object.assign(handler, { __is_handler__: true });
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  return Object.assign(_handler, { __is_handler__: true });
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler = r.default || r;
        if (typeof handler !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler
          );
        }
        _resolved = toEventHandler(r.default || r);
        return _resolved;
      });
    }
    return _promise;
  };
  return eventHandler((event) => {
    if (_resolved) {
      return _resolved(event);
    }
    return resolveHandler().then((handler) => handler(event));
  });
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const app = {
    // @ts-ignore
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    handler,
    stack,
    options
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(
      normalizeLayer({ ...arg2, route: "/", handler: arg1 })
    );
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      await options.onAfterResponse(event, void 0);
    }
  });
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  router.handler = eventHandler((event) => {
    let path = event.path || "/";
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      if (opts.preemptive || opts.preemtive) {
        throw createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${event.path || "/"}.`
        });
      } else {
        return;
      }
    }
    const method = (event.node.req.method || "get").toLowerCase();
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      if (opts.preemptive || opts.preemtive) {
        throw createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        });
      } else {
        return;
      }
    }
    event.context.matchedRoute = matched;
    const params = matched.params || {};
    event.context.params = params;
    return Promise.resolve(handler(event)).then((res) => {
      if (res === void 0 && (opts.preemptive || opts.preemtive)) {
        return null;
      }
      return res;
    });
  });
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      await sendError(event, error, !!app.options.debug);
    }
  };
  return toNodeHandle;
}

const s=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function mergeFetchOptions(input, defaults, Headers = globalThis.Headers) {
  const merged = {
    ...defaults,
    ...input
  };
  if (defaults?.params && input?.params) {
    merged.params = {
      ...defaults?.params,
      ...input?.params
    };
  }
  if (defaults?.query && input?.query) {
    merged.query = {
      ...defaults?.query,
      ...input?.query
    };
  }
  if (defaults?.headers && input?.headers) {
    merged.headers = new Headers(defaults?.headers || {});
    for (const [key, value] of new Headers(input?.headers || {})) {
      merged.headers.set(key, value);
    }
  }
  return merged;
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  //  Gateway Timeout
]);
const nullBodyResponses$1 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch$1(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1,
          timeout: context.options.timeout
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: mergeFetchOptions(_options, globalOptions.defaults, Headers),
      response: void 0,
      error: void 0
    };
    context.options.method = context.options.method?.toUpperCase();
    if (context.options.onRequest) {
      await context.options.onRequest(context);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query || context.options.params) {
        context.request = withQuery(context.request, {
          ...context.options.params,
          ...context.options.query
        });
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await context.options.onRequestError(context);
      }
      return await onError(context);
    }
    const hasBody = context.response.body && !nullBodyResponses$1.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await context.options.onResponse(context);
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await context.options.onResponseError(context);
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}) => createFetch$1({
    ...globalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch || createNodeFetch();
const Headers$1 = globalThis.Headers || s;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch$1({ fetch, Headers: Headers$1, AbortController });
const $fetch$1 = ofetch;

const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createCall(handle) {
  return function callHandle(context) {
    const req = new IncomingMessage();
    const res = new ServerResponse(req);
    req.url = context.url || "/";
    req.method = context.method || "GET";
    req.headers = {};
    if (context.headers) {
      const headerEntries = typeof context.headers.entries === "function" ? context.headers.entries() : Object.entries(context.headers);
      for (const [name, value] of headerEntries) {
        if (!value) {
          continue;
        }
        req.headers[name.toLowerCase()] = value;
      }
    }
    req.headers.host = req.headers.host || context.host || "localhost";
    req.connection.encrypted = // @ts-ignore
    req.connection.encrypted || context.protocol === "https";
    req.body = context.body || null;
    req.__unenv__ = context.context;
    return handle(req, res).then(() => {
      let body = res._data;
      if (nullBodyResponses.has(res.statusCode) || req.method.toUpperCase() === "HEAD") {
        body = null;
        delete res._headers["content-length"];
      }
      const r = {
        body,
        headers: res._headers,
        status: res.statusCode,
        statusText: res.statusMessage
      };
      req.destroy();
      res.destroy();
      return r;
    });
  };
}

function createFetch(call, _fetch = global.fetch) {
  return async function ufetch(input, init) {
    const url = input.toString();
    if (!url.startsWith("/")) {
      return _fetch(url, init);
    }
    try {
      const r = await call({ url, ...init });
      return new Response(r.body, {
        status: r.status,
        statusText: r.statusText,
        headers: Object.fromEntries(
          Object.entries(r.headers).map(([name, value]) => [
            name,
            Array.isArray(value) ? value.join(",") : String(value) || ""
          ])
        )
      });
    } catch (error) {
      return new Response(error.toString(), {
        status: Number.parseInt(error.statusCode || error.code) || 500,
        statusText: error.statusText
      });
    }
  };
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char.toUpperCase() === char;
}
function splitByCase(str, separators) {
  const splitters = separators ?? STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function pascalCase(str, opts) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => upperFirst(opts?.normalize ? p.toLowerCase() : p)).join("") : "";
}
function camelCase(str, opts) {
  return lowerFirst(pascalCase(str || "", opts));
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner ?? "-") : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {
    "buildId": "1877e29f-88ea-4f5c-adc0-ac980d72bd8f"
  }
};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "mdc": {
      "components": {
        "prose": true,
        "map": {
          "p": "prose-p",
          "a": "prose-a",
          "blockquote": "prose-blockquote",
          "code-inline": "prose-code-inline",
          "code": "ProseCodeInline",
          "em": "prose-em",
          "h1": "prose-h1",
          "h2": "prose-h2",
          "h3": "prose-h3",
          "h4": "prose-h4",
          "h5": "prose-h5",
          "h6": "prose-h6",
          "hr": "prose-hr",
          "img": "prose-img",
          "ul": "prose-ul",
          "ol": "prose-ol",
          "li": "prose-li",
          "strong": "prose-strong",
          "table": "prose-table",
          "thead": "prose-thead",
          "tbody": "prose-tbody",
          "td": "prose-td",
          "th": "prose-th",
          "tr": "prose-tr"
        }
      },
      "headings": {
        "anchorLinks": {
          "h1": false,
          "h2": false,
          "h3": false,
          "h4": false,
          "h5": false,
          "h6": false
        }
      }
    },
    "content": {
      "locales": [],
      "defaultLocale": "",
      "integrity": 1702066253322,
      "experimental": {
        "stripQueryParameters": false,
        "advanceQuery": false,
        "clientDB": false
      },
      "respectPathCase": false,
      "api": {
        "baseURL": "/api/_content"
      },
      "navigation": {
        "fields": [
          "layout"
        ]
      },
      "tags": {
        "p": "prose-p",
        "a": "prose-a",
        "blockquote": "prose-blockquote",
        "code-inline": "prose-code-inline",
        "code": "ProseCodeInline",
        "em": "prose-em",
        "h1": "prose-h1",
        "h2": "prose-h2",
        "h3": "prose-h3",
        "h4": "prose-h4",
        "h5": "prose-h5",
        "h6": "prose-h6",
        "hr": "prose-hr",
        "img": "prose-img",
        "ul": "prose-ul",
        "ol": "prose-ol",
        "li": "prose-li",
        "strong": "prose-strong",
        "table": "prose-table",
        "thead": "prose-thead",
        "tbody": "prose-tbody",
        "td": "prose-td",
        "th": "prose-th",
        "tr": "prose-tr"
      },
      "highlight": false,
      "wsUrl": "",
      "documentDriven": {
        "page": true,
        "navigation": true,
        "surround": true,
        "globals": {},
        "layoutFallbacks": [
          "theme"
        ],
        "injectPage": true
      },
      "host": "",
      "trailingSlash": false,
      "search": "",
      "contentHead": true,
      "anchorLinks": false
    }
  },
  "ipx": {
    "dir": "",
    "maxAge": "",
    "domains": [],
    "sharp": {},
    "alias": {}
  },
  "mdc": {
    "highlight": {}
  },
  "content": {
    "cacheVersion": 2,
    "cacheIntegrity": "ZlfMO9qFzU",
    "transformers": [],
    "base": "",
    "api": {
      "baseURL": "/api/_content"
    },
    "watch": {
      "ws": {
        "port": {
          "port": 4000,
          "portRange": [
            4000,
            4040
          ]
        },
        "hostname": "localhost",
        "showURL": false
      }
    },
    "sources": {},
    "ignores": [],
    "locales": [],
    "defaultLocale": "",
    "highlight": false,
    "markdown": {
      "tags": {
        "p": "prose-p",
        "a": "prose-a",
        "blockquote": "prose-blockquote",
        "code-inline": "prose-code-inline",
        "code": "ProseCodeInline",
        "em": "prose-em",
        "h1": "prose-h1",
        "h2": "prose-h2",
        "h3": "prose-h3",
        "h4": "prose-h4",
        "h5": "prose-h5",
        "h6": "prose-h6",
        "hr": "prose-hr",
        "img": "prose-img",
        "ul": "prose-ul",
        "ol": "prose-ol",
        "li": "prose-li",
        "strong": "prose-strong",
        "table": "prose-table",
        "thead": "prose-thead",
        "tbody": "prose-tbody",
        "td": "prose-td",
        "th": "prose-th",
        "tr": "prose-tr"
      },
      "anchorLinks": {
        "depth": 0,
        "exclude": []
      },
      "remarkPlugins": {},
      "rehypePlugins": {}
    },
    "yaml": {},
    "csv": {
      "delimeter": ",",
      "json": true
    },
    "navigation": {
      "fields": [
        "layout"
      ]
    },
    "contentHead": true,
    "documentDriven": true,
    "respectPathCase": false,
    "experimental": {
      "clientDB": false,
      "stripQueryParameters": false,
      "advanceQuery": false,
      "search": ""
    }
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const defaults$1 = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: void 0,
  excludeValues: void 0,
  replacer: void 0
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults$1, ...options };
  } else {
    options = defaults$1;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === void 0) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === void 0 ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

class WordArray {
  constructor(words, sigBytes) {
    words = this.words = words || [];
    this.sigBytes = sigBytes === void 0 ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Base64 = {
  stringify(wordArray) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      const byte2 = wordArray.words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
      const byte3 = wordArray.words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
      const triplet = byte1 << 16 | byte2 << 8 | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt(triplet >>> 6 * (3 - j) & 63));
      }
    }
    return base64Chars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    this._data = new WordArray();
    this._nDataBytes = 0;
    this._minBufferSize = 0;
    this.blockSize = 512 / 32;
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}

const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    this._hash = new WordArray([...H]);
  }
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a = H2[0];
    let b = H2[1];
    let c = H2[2];
    let d = H2[3];
    let e = H2[4];
    let f = H2[5];
    let g = H2[6];
    let h = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f ^ ~e & g;
      const maj = a & b ^ a & c ^ b & c;
      const sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a | 0;
    H2[1] = H2[1] + b | 0;
    H2[2] = H2[2] + c | 0;
    H2[3] = H2[3] + d | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f | 0;
    H2[6] = H2[6] + g | 0;
    H2[7] = H2[7] + h | 0;
  }
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256base64(message) {
  return new SHA256().finalize(message).toString(Base64);
}

function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return sha256base64(hashed).slice(0, 10);
}

function isEqual(object1, object2, hashOptions = {}) {
  if (object1 === object2) {
    return true;
  }
  if (objectHash(object1, hashOptions) === objectHash(object2, hashOptions)) {
    return true;
  }
  return false;
}

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (typeof Buffer === void 0) {
    throw new TypeError("[unstorage] Buffer is not supported!");
  }
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  checkBufferSupport();
  const base64 = Buffer.from(value).toString("base64");
  return BASE64_PREFIX + base64;
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  checkBufferSupport();
  return Buffer.from(value.slice(BASE64_PREFIX.length), "base64");
}

const storageKeyProperties = [
  "hasItem",
  "getItem",
  "getItemRaw",
  "setItem",
  "setItemRaw",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$2(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}
function joinKeys(...keys) {
  return normalizeKey$2(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$2(base);
  return base ? base + ":" : "";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$3 = "memory";
const memory$1 = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$3,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory$1() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$2(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$2(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          await asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$2(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        const keys = rawKeys.map((key) => mount.mountpoint + normalizeKey$2(key)).filter((key) => !maskedMounts.some((p) => key.startsWith(p)));
        allKeys.push(...keys);
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter((key) => key.startsWith(base) && !key.endsWith("$")) : allKeys.filter((key) => !key.endsWith("$"));
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$2(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$2(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    }
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {
  ["nitro:bundled:cache:content:content-index.json"]: {
    import: () => import('../raw/content-index.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"2fc-6jLI7rtXWZ0vqyTAQtneDGzOLmA\"","mtime":"2023-12-08T20:11:09.017Z"}
  },
  ["nitro:bundled:cache:content:content-navigation.json"]: {
    import: () => import('../raw/content-navigation.mjs').then(r => r.default || r),
    meta: {"type":"application/json","etag":"\"541-2QIAvzbr2mrTHvsn7Xuy1pam/tU\"","mtime":"2023-12-08T20:11:09.017Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:1.index.md"]: {
    import: () => import('../raw/1.index.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"f72-Feahxb3LZNomUZCKZDLBBsTDwfw\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:2.galleries.md"]: {
    import: () => import('../raw/2.galleries.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"6ea-gKtscw6zhCqIXOm4yLLBTTc6SDw\"","mtime":"2023-12-08T20:11:09.019Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:3.stories.md"]: {
    import: () => import('../raw/3.stories.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"6c5-ZHgRXMHaEuF1rccdSqA+hfnRkow\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:4.hire-me.md"]: {
    import: () => import('../raw/4.hire-me.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"14ef-ilx3xq77wD9BUmEdbAKsinOVSFs\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-1.md"]: {
    import: () => import('../raw/1.storie-1.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"d53-jsUK7sc8sNsxp9pvBSmWhHfzJqg\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-2.md"]: {
    import: () => import('../raw/1.storie-2.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"165e-vj+SIb1pwmV7dHpyPpqvbD9PiGY\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-3.md"]: {
    import: () => import('../raw/1.storie-3.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"1551-N6a0Ey8TDWP0AnyNNJWienh6wBg\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-4.md"]: {
    import: () => import('../raw/1.storie-4.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"1165-3TEgR5iMz8x/AIoQOuEWd4Ndpqw\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-5.md"]: {
    import: () => import('../raw/1.storie-5.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"e7e-ZCS19fBkeG954trp5TViBuklo9k\"","mtime":"2023-12-08T20:11:09.017Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:stories:1.storie-6.md"]: {
    import: () => import('../raw/1.storie-6.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"109b-zJM8MpAPXZIlxnP1KlmrHF2LA58\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:1.gal1.md"]: {
    import: () => import('../raw/1.gal1.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"8db-CDs327cA0Yh4COY4rJXarpKft/Y\"","mtime":"2023-12-08T20:11:09.017Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:2.gal2.md"]: {
    import: () => import('../raw/2.gal2.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"be5-2BnbGHoypwICNPTVO1fLdoq7y84\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:3.gal3.md"]: {
    import: () => import('../raw/3.gal3.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"12f4-g0jgY4UOQUudXfx5nYghY2Z9diI\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:4.gal4.md"]: {
    import: () => import('../raw/4.gal4.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"dd5-dotYIS4JL//tI2hsfceV7jaubos\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:5.gal5.md"]: {
    import: () => import('../raw/5.gal5.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"e59-/+yBpnHZtf4hZZvFHqEwJW1hgMk\"","mtime":"2023-12-08T20:11:09.020Z"}
  },
  ["nitro:bundled:cache:content:parsed:content:galleries:6.gal6.md"]: {
    import: () => import('../raw/6.gal6.mjs').then(r => r.default || r),
    meta: {"type":"text/markdown; charset=utf-8","etag":"\"1631-nxbhf2Ws+nldoFp/gGQEKf5XxJ8\"","mtime":"2023-12-08T20:11:09.020Z"}
  }
};

const normalizeKey$1 = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey$1(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/^:|:$/g, "");
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        const dirFiles = await readdirRecursive(entryPath, ignore);
        files.push(...dirFiles.map((f) => entry.name + "/" + f));
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.\:|\.\.$/;
const DRIVER_NAME$2 = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME$2, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME$2,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME$2,
    options: opts,
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys() {
      return readdirRecursive(r("."), opts.ignore);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const OVERLAY_REMOVED = "__OVERLAY_REMOVED__";
const DRIVER_NAME$1 = "overlay";
const overlay = defineDriver((options) => {
  return {
    name: DRIVER_NAME$1,
    options,
    async hasItem(key, opts) {
      for (const layer of options.layers) {
        if (await layer.hasItem(key, opts)) {
          if (layer === options.layers[0]) {
            if (await options.layers[0]?.getItem(key) === OVERLAY_REMOVED) {
              return false;
            }
          }
          return true;
        }
      }
      return false;
    },
    async getItem(key) {
      for (const layer of options.layers) {
        const value = await layer.getItem(key);
        if (value === OVERLAY_REMOVED) {
          return null;
        }
        if (value !== null) {
          return value;
        }
      }
      return null;
    },
    // TODO: Support native meta
    // async getMeta (key) {},
    async setItem(key, value, opts) {
      await options.layers[0]?.setItem?.(key, value, opts);
    },
    async removeItem(key, opts) {
      await options.layers[0]?.setItem?.(key, OVERLAY_REMOVED, opts);
    },
    async getKeys(base, opts) {
      const allKeys = await Promise.all(
        options.layers.map(async (layer) => {
          const keys = await layer.getKeys(base, opts);
          return keys.map((key) => normalizeKey(key));
        })
      );
      const uniqueKeys = Array.from(new Set(allKeys.flat()));
      const existingKeys = await Promise.all(
        uniqueKeys.map(async (key) => {
          if (await options.layers[0]?.getItem(key) === OVERLAY_REMOVED) {
            return false;
          }
          return key;
        })
      );
      return existingKeys.filter(Boolean);
    },
    async dispose() {
      await Promise.all(
        options.layers.map(async (layer) => {
          if (layer.dispose) {
            await layer.dispose();
          }
        })
      );
    }
  };
});

const DRIVER_NAME = "memory";
const memoryDriver = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"C:\\Users\\ciprian\\OneDrive\\Desktop\\ro-photo-site\\.data\\kv"}));

const bundledStorage = ["/cache/content"];
for (const base of bundledStorage) {
  storage.mount(base, overlay({
    layers: [
      memoryDriver(),
      // TODO
      // prefixStorage(storage, base),
      prefixStorage(storage, 'assets:nitro:bundled:' + base)
    ]
  }));
}

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          const promise = useStorage().setItem(cacheKey, entry).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event && event.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      const _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        variableHeaders[header] = incomingEvent.node.req.headers[header];
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        event.node.res.setHeader(name, value);
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "\"use strict\";(()=>{const a=window,e=document.documentElement,m=[\"dark\",\"light\"],c=window&&window.localStorage&&window.localStorage.getItem&&window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let n=c===\"system\"?d():c;const l=e.getAttribute(\"data-color-mode-forced\");l&&(n=l),i(n),a[\"__NUXT_COLOR_MODE__\"]={preference:c,value:n,getColorScheme:d,addColorScheme:i,removeColorScheme:f};function i(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.add(t):e.className+=\" \"+t,s&&e.setAttribute(\"data-\"+s,o)}function f(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp(t,\"g\"),\"\"),s&&e.removeAttribute(\"data-\"+s)}function r(o){return a.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function d(){if(a.matchMedia&&r(\"\").media!==\"not all\"){for(const o of m)if(r(\":\"+o).matches)return o}return\"light\"}})();\n";

const _s0SQRjhQtD = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _s0SQRjhQtD
];

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const isErrorPage = event.path.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  return send(event, html);
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-12-05T19:32:25.446Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/img/bg-glow.png": {
    "type": "image/png",
    "etag": "\"4b0e0-SZQ5oed5P7XeER0+VN0/tlyFMNQ\"",
    "mtime": "2023-12-04T10:27:38.669Z",
    "size": 307424,
    "path": "../public/img/bg-glow.png"
  },
  "/img/bg-glow2.png": {
    "type": "image/png",
    "etag": "\"5684b-WWwFPbvhDt1dwDGu5kJsAUGdNFI\"",
    "mtime": "2023-12-04T10:27:38.671Z",
    "size": 354379,
    "path": "../public/img/bg-glow2.png"
  },
  "/img/green.webp": {
    "type": "image/webp",
    "etag": "\"14bfd6-SpXRXk8HsmAKP5ldrT+txUu1s6k\"",
    "mtime": "2023-12-04T10:27:41.272Z",
    "size": 1359830,
    "path": "../public/img/green.webp"
  },
  "/img/logo.jpg": {
    "type": "image/jpeg",
    "etag": "\"8c6b8-I1UxaMmCrKJLOOs4vlJNgdCBkfQ\"",
    "mtime": "2023-12-04T10:27:41.368Z",
    "size": 575160,
    "path": "../public/img/logo.jpg"
  },
  "/img/placeholder.jpg": {
    "type": "image/jpeg",
    "etag": "\"45b3-c0zOUDFGNKrvrPrY9Ug6MUqVNoQ\"",
    "mtime": "2023-12-04T10:27:41.368Z",
    "size": 17843,
    "path": "../public/img/placeholder.jpg"
  },
  "/_nuxt/asyncData.e8aeef82.js": {
    "type": "application/javascript",
    "etag": "\"9ea-ZlUSLEVztuS0XQ90Hux68e4L0q8\"",
    "mtime": "2023-12-08T20:11:00.011Z",
    "size": 2538,
    "path": "../public/_nuxt/asyncData.e8aeef82.js"
  },
  "/_nuxt/AwardsItem.c04c6a66.js": {
    "type": "application/javascript",
    "etag": "\"63-9Cgo0YKV5UNoGNNsZkQ2bLpp2ac\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 99,
    "path": "../public/_nuxt/AwardsItem.c04c6a66.js"
  },
  "/_nuxt/AwardsItem.vue.6bc91b29.js": {
    "type": "application/javascript",
    "etag": "\"256-dyvh5uQiW0NIGU7oSA4tjJiIs84\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 598,
    "path": "../public/_nuxt/AwardsItem.vue.6bc91b29.js"
  },
  "/_nuxt/AwardsList.bc296137.js": {
    "type": "application/javascript",
    "etag": "\"2a2-z4EDKRoWlB+zqVemxzwH4/AcWRU\"",
    "mtime": "2023-12-08T20:11:00.005Z",
    "size": 674,
    "path": "../public/_nuxt/AwardsList.bc296137.js"
  },
  "/_nuxt/BlogImage.481c4e97.js": {
    "type": "application/javascript",
    "etag": "\"16f-7Qfs4zYEC+kjgA+uldFD6WZp1OI\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 367,
    "path": "../public/_nuxt/BlogImage.481c4e97.js"
  },
  "/_nuxt/client-db.448b9c61.js": {
    "type": "application/javascript",
    "etag": "\"53b5-vyBes0aCybrRtkk4pnQyz6B5Qjw\"",
    "mtime": "2023-12-08T20:11:00.018Z",
    "size": 21429,
    "path": "../public/_nuxt/client-db.448b9c61.js"
  },
  "/_nuxt/Container.0914fcb5.js": {
    "type": "application/javascript",
    "etag": "\"62-Mk9DMRYSn5Tfl08L+6b5c2YeU+k\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 98,
    "path": "../public/_nuxt/Container.0914fcb5.js"
  },
  "/_nuxt/Container.vue.2302b0fe.js": {
    "type": "application/javascript",
    "etag": "\"18e-H2kRPKxfm2+j1xKahhG/MCsOewA\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 398,
    "path": "../public/_nuxt/Container.vue.2302b0fe.js"
  },
  "/_nuxt/ContentDoc.d51c958f.js": {
    "type": "application/javascript",
    "etag": "\"5fa-p8Z3HOPUkQAp4JDoZRRMmKo1gg0\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 1530,
    "path": "../public/_nuxt/ContentDoc.d51c958f.js"
  },
  "/_nuxt/ContentList.69959a1b.js": {
    "type": "application/javascript",
    "etag": "\"366-MkYpoRAEFJS7wiStOxHnaXvXuJs\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 870,
    "path": "../public/_nuxt/ContentList.69959a1b.js"
  },
  "/_nuxt/ContentNavigation.a163d048.js": {
    "type": "application/javascript",
    "etag": "\"382-BM9V6Uv60rS1l9Mz4mTaeLC3QeI\"",
    "mtime": "2023-12-08T20:11:00.005Z",
    "size": 898,
    "path": "../public/_nuxt/ContentNavigation.a163d048.js"
  },
  "/_nuxt/ContentQuery.5d1f3a4d.js": {
    "type": "application/javascript",
    "etag": "\"999-1ypLJG52oh6v2r33eq941TceNdg\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 2457,
    "path": "../public/_nuxt/ContentQuery.5d1f3a4d.js"
  },
  "/_nuxt/ContentRenderer.a5e5f33c.js": {
    "type": "application/javascript",
    "etag": "\"4bd-VLBhs2TtAMNdSYDXLyHU4+U6Y6w\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 1213,
    "path": "../public/_nuxt/ContentRenderer.a5e5f33c.js"
  },
  "/_nuxt/ContentRendererMarkdown.daeb1ea6.js": {
    "type": "application/javascript",
    "etag": "\"70-lffVSso2LBgZ8/bnQWgqvlQjm6U\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 112,
    "path": "../public/_nuxt/ContentRendererMarkdown.daeb1ea6.js"
  },
  "/_nuxt/ContentRendererMarkdown.vue.b260c648.js": {
    "type": "application/javascript",
    "etag": "\"5bb9-bdt5qRUYcd8cIG0shyxyk9ANOoY\"",
    "mtime": "2023-12-08T20:11:00.018Z",
    "size": 23481,
    "path": "../public/_nuxt/ContentRendererMarkdown.vue.b260c648.js"
  },
  "/_nuxt/ContentSlot.61611f73.js": {
    "type": "application/javascript",
    "etag": "\"79a-GRJ9vcQ+Z816mcNFSCeR3/91+AI\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 1946,
    "path": "../public/_nuxt/ContentSlot.61611f73.js"
  },
  "/_nuxt/default.a8371cb6.js": {
    "type": "application/javascript",
    "etag": "\"42c-jMj13UZWuaFU5rvo8UrMOtJR3ps\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 1068,
    "path": "../public/_nuxt/default.a8371cb6.js"
  },
  "/_nuxt/document-driven.c21ce628.js": {
    "type": "application/javascript",
    "etag": "\"7f5-V9G48YSUUiXqZ7Tw/gKsHyztU2M\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 2037,
    "path": "../public/_nuxt/document-driven.c21ce628.js"
  },
  "/_nuxt/DocumentDrivenEmpty.cb49da9e.js": {
    "type": "application/javascript",
    "etag": "\"124-BVmGMKhhFVGW/Vawuo7/GMR2VBA\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 292,
    "path": "../public/_nuxt/DocumentDrivenEmpty.cb49da9e.js"
  },
  "/_nuxt/DocumentDrivenNotFound.83d1f186.js": {
    "type": "application/javascript",
    "etag": "\"9f-nYg7A+XhHbI4WeufK9BClRHYM3A\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 159,
    "path": "../public/_nuxt/DocumentDrivenNotFound.83d1f186.js"
  },
  "/_nuxt/entry.d4a90a33.js": {
    "type": "application/javascript",
    "etag": "\"307a5-tYwcSxl+XA1wfgTSJs8kK6kNAqY\"",
    "mtime": "2023-12-08T20:11:00.019Z",
    "size": 198565,
    "path": "../public/_nuxt/entry.d4a90a33.js"
  },
  "/_nuxt/error-404.95c28eb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-L8dF9pJCW0qi7de8Az4GyBoTHvI\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.95c28eb4.css"
  },
  "/_nuxt/error-404.a2fbba5c.js": {
    "type": "application/javascript",
    "etag": "\"907-75UkQf3evtwHpZdureC4nkIgYxs\"",
    "mtime": "2023-12-08T20:11:00.016Z",
    "size": 2311,
    "path": "../public/_nuxt/error-404.a2fbba5c.js"
  },
  "/_nuxt/error-500.5dd5b749.js": {
    "type": "application/javascript",
    "etag": "\"78b-C7zP+XkJeDKaxlp6Mes5c80//1s\"",
    "mtime": "2023-12-08T20:11:00.005Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.5dd5b749.js"
  },
  "/_nuxt/error-500.e798523c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-QP983DB9m1oiDr87r1V1AYEhrfo\"",
    "mtime": "2023-12-08T20:10:59.994Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.e798523c.css"
  },
  "/_nuxt/Footer.862548ea.js": {
    "type": "application/javascript",
    "etag": "\"55aa-tfPbh+1RWOdG4irdEpd3lx0dWVo\"",
    "mtime": "2023-12-08T20:11:00.018Z",
    "size": 21930,
    "path": "../public/_nuxt/Footer.862548ea.js"
  },
  "/_nuxt/GalleriesList.4fc01fcd.js": {
    "type": "application/javascript",
    "etag": "\"35e-CXn3suY+bj/8e6+zAE9moo0UlZA\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 862,
    "path": "../public/_nuxt/GalleriesList.4fc01fcd.js"
  },
  "/_nuxt/GalleryListItem.49d2390e.js": {
    "type": "application/javascript",
    "etag": "\"a7-PubjinwGSERASBy2NwRVIUDVREs\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 167,
    "path": "../public/_nuxt/GalleryListItem.49d2390e.js"
  },
  "/_nuxt/GalleryListItem.vue.63d00d91.js": {
    "type": "application/javascript",
    "etag": "\"66a-30y39wpv05wz3OAFhwu+QxVJSb0\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 1642,
    "path": "../public/_nuxt/GalleryListItem.vue.63d00d91.js"
  },
  "/_nuxt/head.9d32d98f.js": {
    "type": "application/javascript",
    "etag": "\"24c-bXOr6J9gDuWxZbqfmz8aeOLxClc\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 588,
    "path": "../public/_nuxt/head.9d32d98f.js"
  },
  "/_nuxt/HeroGrid.bac379c1.js": {
    "type": "application/javascript",
    "etag": "\"12cc-WtykYmngU4BlJjckGF5nLctKyv4\"",
    "mtime": "2023-12-08T20:11:00.016Z",
    "size": 4812,
    "path": "../public/_nuxt/HeroGrid.bac379c1.js"
  },
  "/_nuxt/HeroText.d3a292f8.js": {
    "type": "application/javascript",
    "etag": "\"38f-GrGz5gfumIj3D1fMaHR1+DzGcxE\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 911,
    "path": "../public/_nuxt/HeroText.d3a292f8.js"
  },
  "/_nuxt/Icon.1086b57f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"43-HNxf2Ryi8K+ShS4YFpHMdiuXqKs\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 67,
    "path": "../public/_nuxt/Icon.1086b57f.css"
  },
  "/_nuxt/Icon.6c69f521.js": {
    "type": "application/javascript",
    "etag": "\"52bc-OtZDJLAxF2mb03+M2KpkZKgxBKs\"",
    "mtime": "2023-12-08T20:11:00.019Z",
    "size": 21180,
    "path": "../public/_nuxt/Icon.6c69f521.js"
  },
  "/_nuxt/IconCSS.05fd33c5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"102-PPDHA9Vz07CRse/hknRw9WThNwU\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 258,
    "path": "../public/_nuxt/IconCSS.05fd33c5.css"
  },
  "/_nuxt/IconCSS.783f92c4.js": {
    "type": "application/javascript",
    "etag": "\"38a-mZkpVx2Nhv3oFGcKWNU+ukpEToA\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 906,
    "path": "../public/_nuxt/IconCSS.783f92c4.js"
  },
  "/_nuxt/Markdown.6487e165.js": {
    "type": "application/javascript",
    "etag": "\"14a-i4P3ErCaXZ4e/5ZlNu++sdAXT0k\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 330,
    "path": "../public/_nuxt/Markdown.6487e165.js"
  },
  "/_nuxt/MasonryGallery.6ef0d406.js": {
    "type": "application/javascript",
    "etag": "\"4745-5eFoER+MdSlNG3EqoWLrVOxEwBw\"",
    "mtime": "2023-12-08T20:11:00.018Z",
    "size": 18245,
    "path": "../public/_nuxt/MasonryGallery.6ef0d406.js"
  },
  "/_nuxt/MasonryGallery.ecce5438.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1122-L3LTaOrNOnpYPEj4R5Q2BubZPg0\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 4386,
    "path": "../public/_nuxt/MasonryGallery.ecce5438.css"
  },
  "/_nuxt/nuxt-img.6a17abe0.js": {
    "type": "application/javascript",
    "etag": "\"a78-d+Sk1wBTOiQsx8fF0/InfrgWHb4\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 2680,
    "path": "../public/_nuxt/nuxt-img.6a17abe0.js"
  },
  "/_nuxt/nuxt-link.0878cebc.js": {
    "type": "application/javascript",
    "etag": "\"e5b-LG/QhWQEWdj8BN4QjoKKDTAeAYc\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 3675,
    "path": "../public/_nuxt/nuxt-link.0878cebc.js"
  },
  "/_nuxt/PackagePrice.3834f79c.js": {
    "type": "application/javascript",
    "etag": "\"846-SNUVbwXAq9Ji8/fxkiOKfDSPBHY\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 2118,
    "path": "../public/_nuxt/PackagePrice.3834f79c.js"
  },
  "/_nuxt/PageHeader.30be60fc.js": {
    "type": "application/javascript",
    "etag": "\"5f7-KjFgbt/NGis7IpmQgxwN1eemL1o\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 1527,
    "path": "../public/_nuxt/PageHeader.30be60fc.js"
  },
  "/_nuxt/photoswipe.esm.060dc2da.js": {
    "type": "application/javascript",
    "etag": "\"ebcd-EpCX8kSqxGjRqIY8pUdEQWBjCs0\"",
    "mtime": "2023-12-08T20:11:00.019Z",
    "size": 60365,
    "path": "../public/_nuxt/photoswipe.esm.060dc2da.js"
  },
  "/_nuxt/ProseA.3380c661.js": {
    "type": "application/javascript",
    "etag": "\"18b-6jRq5CelaUqKXs/yKGEWtv1h3BM\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 395,
    "path": "../public/_nuxt/ProseA.3380c661.js"
  },
  "/_nuxt/ProseBlockquote.27ffb94c.js": {
    "type": "application/javascript",
    "etag": "\"f7-00b8W4QIEVIGLyanuF026M928jk\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 247,
    "path": "../public/_nuxt/ProseBlockquote.27ffb94c.js"
  },
  "/_nuxt/ProseCode.be56dd98.js": {
    "type": "application/javascript",
    "etag": "\"62-65sZMhOw8FdiLQDaH0ni15f4ELQ\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 98,
    "path": "../public/_nuxt/ProseCode.be56dd98.js"
  },
  "/_nuxt/ProseCode.e63e49c6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e-GbvrqT5j9gSWlpa8e36U/Kv6Zx0\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 46,
    "path": "../public/_nuxt/ProseCode.e63e49c6.css"
  },
  "/_nuxt/ProseCode.vue.07017e51.js": {
    "type": "application/javascript",
    "etag": "\"141-HFG9eGXyEVzjQEicOOkFZXZTEHM\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 321,
    "path": "../public/_nuxt/ProseCode.vue.07017e51.js"
  },
  "/_nuxt/ProseCodeInline.cd88ea93.js": {
    "type": "application/javascript",
    "etag": "\"f1-PjPnyCncrenG0iLPa8ua5CpsDqs\"",
    "mtime": "2023-12-08T20:11:00.003Z",
    "size": 241,
    "path": "../public/_nuxt/ProseCodeInline.cd88ea93.js"
  },
  "/_nuxt/ProseEm.bb035c32.js": {
    "type": "application/javascript",
    "etag": "\"ef-89j6faDEn6aXmR8aQreexxg2+jI\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 239,
    "path": "../public/_nuxt/ProseEm.bb035c32.js"
  },
  "/_nuxt/ProseH1.de8ff8e7.js": {
    "type": "application/javascript",
    "etag": "\"1ba-yYxelieRoSh5lCuKDJ+JD7JZl9c\"",
    "mtime": "2023-12-08T20:11:00.003Z",
    "size": 442,
    "path": "../public/_nuxt/ProseH1.de8ff8e7.js"
  },
  "/_nuxt/ProseH2.85108adc.js": {
    "type": "application/javascript",
    "etag": "\"1c0-NndK5L4Xbbc2e6X2O3URAl9drjk\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 448,
    "path": "../public/_nuxt/ProseH2.85108adc.js"
  },
  "/_nuxt/ProseH3.25841a74.js": {
    "type": "application/javascript",
    "etag": "\"1c0-b7MrM+vve84NtziAmDyeKalVQbU\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 448,
    "path": "../public/_nuxt/ProseH3.25841a74.js"
  },
  "/_nuxt/ProseH4.882d59f9.js": {
    "type": "application/javascript",
    "etag": "\"1c0-gToEC7X/P29/7zQQw60FuUpf1Nw\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 448,
    "path": "../public/_nuxt/ProseH4.882d59f9.js"
  },
  "/_nuxt/ProseH5.1124a402.js": {
    "type": "application/javascript",
    "etag": "\"1c0-knDx8CIWSQofpZVUMYRJkFHuqk4\"",
    "mtime": "2023-12-08T20:11:00.011Z",
    "size": 448,
    "path": "../public/_nuxt/ProseH5.1124a402.js"
  },
  "/_nuxt/ProseH6.aacc8aaa.js": {
    "type": "application/javascript",
    "etag": "\"1c0-9mA+ttV11yPcQvkfI1ce5mjaoow\"",
    "mtime": "2023-12-08T20:11:00.005Z",
    "size": 448,
    "path": "../public/_nuxt/ProseH6.aacc8aaa.js"
  },
  "/_nuxt/ProseHr.72d0dc9c.js": {
    "type": "application/javascript",
    "etag": "\"cb-rpb/kFHxySDgJZNqDeOkz+QL+1k\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 203,
    "path": "../public/_nuxt/ProseHr.72d0dc9c.js"
  },
  "/_nuxt/ProseImg.e4050d60.js": {
    "type": "application/javascript",
    "etag": "\"26e-MsUF9zVtb1dbi+KDhBHmcKkt+OQ\"",
    "mtime": "2023-12-08T20:11:00.009Z",
    "size": 622,
    "path": "../public/_nuxt/ProseImg.e4050d60.js"
  },
  "/_nuxt/ProseLi.8cc66ab8.js": {
    "type": "application/javascript",
    "etag": "\"ef-LRKS2tjgaLpHY42bn+SuMzr4Bv4\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 239,
    "path": "../public/_nuxt/ProseLi.8cc66ab8.js"
  },
  "/_nuxt/ProseOl.44d9c96a.js": {
    "type": "application/javascript",
    "etag": "\"ef-lt3z+LjfgFRkWAmLJCXLw/Tb4M4\"",
    "mtime": "2023-12-08T20:11:00.005Z",
    "size": 239,
    "path": "../public/_nuxt/ProseOl.44d9c96a.js"
  },
  "/_nuxt/ProseP.fd104f33.js": {
    "type": "application/javascript",
    "etag": "\"ee-cFw7/T2Z/znlJn8loAyJeT7oJy0\"",
    "mtime": "2023-12-08T20:11:00.003Z",
    "size": 238,
    "path": "../public/_nuxt/ProseP.fd104f33.js"
  },
  "/_nuxt/ProsePre.387b1cb2.js": {
    "type": "application/javascript",
    "etag": "\"2e5-ckdfOAzOXBUAZUmw6c1J1P5RbbE\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 741,
    "path": "../public/_nuxt/ProsePre.387b1cb2.js"
  },
  "/_nuxt/ProseScript.701bdd10.js": {
    "type": "application/javascript",
    "etag": "\"1eb-lJwD/1IvCzdcvmy/XJy7a7sj8qI\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 491,
    "path": "../public/_nuxt/ProseScript.701bdd10.js"
  },
  "/_nuxt/ProseStrong.85e3fc93.js": {
    "type": "application/javascript",
    "etag": "\"f3-EQ8adq/x0TpJPjHdZ1lPPLITtUA\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 243,
    "path": "../public/_nuxt/ProseStrong.85e3fc93.js"
  },
  "/_nuxt/ProseTable.e2becb8d.js": {
    "type": "application/javascript",
    "etag": "\"f2-xeRw/dwauJb4wJ27NxpGtU7saHQ\"",
    "mtime": "2023-12-08T20:11:00.011Z",
    "size": 242,
    "path": "../public/_nuxt/ProseTable.e2becb8d.js"
  },
  "/_nuxt/ProseTbody.05083659.js": {
    "type": "application/javascript",
    "etag": "\"f2-LvTREoqUl0IFBpb25Us4oCBfncs\"",
    "mtime": "2023-12-08T20:11:00.003Z",
    "size": 242,
    "path": "../public/_nuxt/ProseTbody.05083659.js"
  },
  "/_nuxt/ProseTd.4d287c03.js": {
    "type": "application/javascript",
    "etag": "\"ef-28mmYfFNqiyzqESfdxeHIPSBfG4\"",
    "mtime": "2023-12-08T20:11:00.000Z",
    "size": 239,
    "path": "../public/_nuxt/ProseTd.4d287c03.js"
  },
  "/_nuxt/ProseTh.13f90d93.js": {
    "type": "application/javascript",
    "etag": "\"ef-zelx/9B/Y4IJUSrnfZE/gpsS1Po\"",
    "mtime": "2023-12-08T20:11:00.016Z",
    "size": 239,
    "path": "../public/_nuxt/ProseTh.13f90d93.js"
  },
  "/_nuxt/ProseThead.cf826734.js": {
    "type": "application/javascript",
    "etag": "\"f2-RWArlemijZLAdodNuQCs0mYhJ2A\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 242,
    "path": "../public/_nuxt/ProseThead.cf826734.js"
  },
  "/_nuxt/ProseTr.e65b59dc.js": {
    "type": "application/javascript",
    "etag": "\"ea-R9kkdrw2coFQRNTh+7Z1iaDNqpI\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 234,
    "path": "../public/_nuxt/ProseTr.e65b59dc.js"
  },
  "/_nuxt/ProseUl.74c12fb3.js": {
    "type": "application/javascript",
    "etag": "\"ef-mdZJzvCKk21d8We+52814NpmR9Y\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 239,
    "path": "../public/_nuxt/ProseUl.74c12fb3.js"
  },
  "/_nuxt/QaItem.ef836fbb.js": {
    "type": "application/javascript",
    "etag": "\"10dc-mHWQTAjjxeifxTXR21sCTJvz8kc\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 4316,
    "path": "../public/_nuxt/QaItem.ef836fbb.js"
  },
  "/_nuxt/SectionAboutMe.3507c2c0.js": {
    "type": "application/javascript",
    "etag": "\"6de-mdMPfBT5db83WGXUAh9fmOsr2N8\"",
    "mtime": "2023-12-08T20:11:00.003Z",
    "size": 1758,
    "path": "../public/_nuxt/SectionAboutMe.3507c2c0.js"
  },
  "/_nuxt/SectionCtaHireMe.77fbe023.js": {
    "type": "application/javascript",
    "etag": "\"cab-C1f2l/NgT/vPKV3F6CSLR/U0b/k\"",
    "mtime": "2023-12-08T20:11:00.008Z",
    "size": 3243,
    "path": "../public/_nuxt/SectionCtaHireMe.77fbe023.js"
  },
  "/_nuxt/SectionFaq.1d21af55.js": {
    "type": "application/javascript",
    "etag": "\"261-6ybkvx3SkNEACXXaYOENB9AER3k\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 609,
    "path": "../public/_nuxt/SectionFaq.1d21af55.js"
  },
  "/_nuxt/SectionPackages.b289d5cb.js": {
    "type": "application/javascript",
    "etag": "\"137-ChDQQv6rCG1S9lXQxR5+2Ll9oYI\"",
    "mtime": "2023-12-08T20:11:00.014Z",
    "size": 311,
    "path": "../public/_nuxt/SectionPackages.b289d5cb.js"
  },
  "/_nuxt/SectionTestimonials.0e2b6e91.js": {
    "type": "application/javascript",
    "etag": "\"188-T7ZUGK+FO+crQj08Bw6DNleFl0M\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 392,
    "path": "../public/_nuxt/SectionTestimonials.0e2b6e91.js"
  },
  "/_nuxt/StoriesList.8164049f.js": {
    "type": "application/javascript",
    "etag": "\"360-BKNcwh0i3G5wAZls1BbxQsKZBt4\"",
    "mtime": "2023-12-08T20:10:59.998Z",
    "size": 864,
    "path": "../public/_nuxt/StoriesList.8164049f.js"
  },
  "/_nuxt/story.03dd0ef1.js": {
    "type": "application/javascript",
    "etag": "\"42b-S+VoWUWGfq3kDK3W+EJPzCjbR98\"",
    "mtime": "2023-12-08T20:11:00.015Z",
    "size": 1067,
    "path": "../public/_nuxt/story.03dd0ef1.js"
  },
  "/_nuxt/StoryListItem.8e94b752.js": {
    "type": "application/javascript",
    "etag": "\"a5-RrLHVE/VLLBCHwdQBF49o0TEZ0Y\"",
    "mtime": "2023-12-08T20:10:59.999Z",
    "size": 165,
    "path": "../public/_nuxt/StoryListItem.8e94b752.js"
  },
  "/_nuxt/StoryListItem.vue.337c37cd.js": {
    "type": "application/javascript",
    "etag": "\"56d-tpf1Lc6dVltnn2Qf3/tjzMcIBUA\"",
    "mtime": "2023-12-08T20:11:00.010Z",
    "size": 1389,
    "path": "../public/_nuxt/StoryListItem.vue.337c37cd.js"
  },
  "/_nuxt/Testimonial.c197c4d4.js": {
    "type": "application/javascript",
    "etag": "\"459-MAb7//fi26qVKffC9YnNRyhFhHs\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 1113,
    "path": "../public/_nuxt/Testimonial.c197c4d4.js"
  },
  "/_nuxt/ThreeImages.05a6352c.js": {
    "type": "application/javascript",
    "etag": "\"45d-jROflQNs7E0lIGf3UE8NSG1PcZY\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 1117,
    "path": "../public/_nuxt/ThreeImages.05a6352c.js"
  },
  "/_nuxt/use-resolve-button-type.e903ddd5.js": {
    "type": "application/javascript",
    "etag": "\"ef1-hjyOanQ+nENRFfYFzYhcAcPCnZA\"",
    "mtime": "2023-12-08T20:11:00.017Z",
    "size": 3825,
    "path": "../public/_nuxt/use-resolve-button-type.e903ddd5.js"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-12-08T20:11:00.004Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/img/home/b&w.webp": {
    "type": "image/webp",
    "etag": "\"37518-61uI0ePLdYbvsQfa/vr2uCgdHUU\"",
    "mtime": "2023-12-04T10:27:41.162Z",
    "size": 226584,
    "path": "../public/img/home/b&w.webp"
  },
  "/img/home/B&W_moon.webp": {
    "type": "image/webp",
    "etag": "\"efc8-CY+TS1dcPENZdFvBt/LjHX0YEiQ\"",
    "mtime": "2023-12-04T10:27:41.159Z",
    "size": 61384,
    "path": "../public/img/home/B&W_moon.webp"
  },
  "/img/home/cliffs.webp": {
    "type": "image/webp",
    "etag": "\"7291c6-s34HvyRZDqwMipTTa3d+4NPZCsU\"",
    "mtime": "2023-12-04T10:27:41.190Z",
    "size": 7508422,
    "path": "../public/img/home/cliffs.webp"
  },
  "/img/home/cliffs2.webp": {
    "type": "image/webp",
    "etag": "\"9239f6-ibTLVE/iqCrd8jUsHXOngfSpb9o\"",
    "mtime": "2023-12-04T10:27:41.226Z",
    "size": 9583094,
    "path": "../public/img/home/cliffs2.webp"
  },
  "/img/home/cliffs3.webp": {
    "type": "image/webp",
    "etag": "\"836de6-Yeq1mJsu3KRljSZe8sJGTiukIHA\"",
    "mtime": "2023-12-04T10:27:41.259Z",
    "size": 8613350,
    "path": "../public/img/home/cliffs3.webp"
  },
  "/img/home/eye.webp": {
    "type": "image/webp",
    "etag": "\"1bcee2-kVeEtOX7iXtRuIOy1r8+EDaGz4g\"",
    "mtime": "2023-12-04T10:27:41.267Z",
    "size": 1822434,
    "path": "../public/img/home/eye.webp"
  },
  "/img/home/green.webp": {
    "type": "image/webp",
    "etag": "\"14bfd6-SpXRXk8HsmAKP5ldrT+txUu1s6k\"",
    "mtime": "2023-12-04T10:27:41.272Z",
    "size": 1359830,
    "path": "../public/img/home/green.webp"
  },
  "/img/home/hero-grid-01.webp": {
    "type": "image/webp",
    "etag": "\"35644-U2VrMSM9NYJ1lrqRPtp+vHkbjhU\"",
    "mtime": "2023-12-04T10:27:41.273Z",
    "size": 218692,
    "path": "../public/img/home/hero-grid-01.webp"
  },
  "/img/home/hero-grid-02.webp": {
    "type": "image/webp",
    "etag": "\"52680-0IRpquA8+IK6ACW6tm+ojiiJ/qw\"",
    "mtime": "2023-12-04T10:27:41.276Z",
    "size": 337536,
    "path": "../public/img/home/hero-grid-02.webp"
  },
  "/img/home/hero-grid-03.webp": {
    "type": "image/webp",
    "etag": "\"28e5e-yYXoByKLDD/gWmz+XHI0XoC7QG4\"",
    "mtime": "2023-12-04T10:27:41.278Z",
    "size": 167518,
    "path": "../public/img/home/hero-grid-03.webp"
  },
  "/img/home/hero-grid-04.webp": {
    "type": "image/webp",
    "etag": "\"9eb0-dTPI4bDKeKnqInDhRHdb3iJhlmA\"",
    "mtime": "2023-12-04T10:27:41.278Z",
    "size": 40624,
    "path": "../public/img/home/hero-grid-04.webp"
  },
  "/img/home/hero-grid-05.webp": {
    "type": "image/webp",
    "etag": "\"b688-MTFj/+kiIrsjDf9VxZLht+LUAI4\"",
    "mtime": "2023-12-04T10:27:41.279Z",
    "size": 46728,
    "path": "../public/img/home/hero-grid-05.webp"
  },
  "/img/home/hero-grid-06.webp": {
    "type": "image/webp",
    "etag": "\"13cf2-dmuaGxxqIiM+BlevH0oxFDd5Wgc\"",
    "mtime": "2023-12-04T10:27:41.279Z",
    "size": 81138,
    "path": "../public/img/home/hero-grid-06.webp"
  },
  "/img/home/hero-grid-07.webp": {
    "type": "image/webp",
    "etag": "\"12d1a-4kI5xzSrE2j3PksnG5WKxmwaKSw\"",
    "mtime": "2023-12-04T10:27:41.279Z",
    "size": 77082,
    "path": "../public/img/home/hero-grid-07.webp"
  },
  "/img/home/me.webp": {
    "type": "image/webp",
    "etag": "\"14d8d8-kx5GucWzW6YF/UeiEmdzbmexxwQ\"",
    "mtime": "2023-12-04T10:27:41.287Z",
    "size": 1366232,
    "path": "../public/img/home/me.webp"
  },
  "/img/home/medusa.webp": {
    "type": "image/webp",
    "etag": "\"d203a-os9+8mZyVF1wvOEE+xLIFRoHK0I\"",
    "mtime": "2023-12-04T10:27:41.291Z",
    "size": 860218,
    "path": "../public/img/home/medusa.webp"
  },
  "/img/home/panning1.webp": {
    "type": "image/webp",
    "etag": "\"b4446-faqCjdQemj/zE08wz5t+EaIlrgw\"",
    "mtime": "2023-12-04T10:27:41.294Z",
    "size": 738374,
    "path": "../public/img/home/panning1.webp"
  },
  "/img/home/panning2.webp": {
    "type": "image/webp",
    "etag": "\"157b06-4GmITuIrTO5NaiyTbTFw8YN76OU\"",
    "mtime": "2023-12-04T10:27:41.301Z",
    "size": 1407750,
    "path": "../public/img/home/panning2.webp"
  },
  "/img/home/panning3.webp": {
    "type": "image/webp",
    "etag": "\"d2d04-w7gd3zgfmlC/NfKqMQZdUV/M9LM\"",
    "mtime": "2023-12-04T10:27:41.305Z",
    "size": 863492,
    "path": "../public/img/home/panning3.webp"
  },
  "/img/home/personal-photo.webp": {
    "type": "image/webp",
    "etag": "\"8b3c-R0i8yqoawvzEOUzhrn+ptj8/0eI\"",
    "mtime": "2023-12-04T10:27:41.306Z",
    "size": 35644,
    "path": "../public/img/home/personal-photo.webp"
  },
  "/img/home/pink.webp": {
    "type": "image/webp",
    "etag": "\"1d3c10-BF++ptb4GcUNGzdp0PePyQL9otY\"",
    "mtime": "2023-12-04T10:27:41.315Z",
    "size": 1915920,
    "path": "../public/img/home/pink.webp"
  },
  "/img/home/purple.webp": {
    "type": "image/webp",
    "etag": "\"18386c-P+OuikugPs6e9RlCK2th0C8hsTU\"",
    "mtime": "2023-12-04T10:27:41.323Z",
    "size": 1587308,
    "path": "../public/img/home/purple.webp"
  },
  "/img/home/pussy.webp": {
    "type": "image/webp",
    "etag": "\"21c040-1/Tm8YOQB17r4pQAphXYZO8HPHg\"",
    "mtime": "2023-12-04T10:27:41.332Z",
    "size": 2211904,
    "path": "../public/img/home/pussy.webp"
  },
  "/img/home/skull1.webp": {
    "type": "image/webp",
    "etag": "\"42b32-kqjLHtlArXnJNzvTnuvliD4eSkU\"",
    "mtime": "2023-12-04T10:27:41.334Z",
    "size": 273202,
    "path": "../public/img/home/skull1.webp"
  },
  "/img/home/skull2.webp": {
    "type": "image/webp",
    "etag": "\"2aa0c-mFp6JIK55jqvAvJbDHdRflc7mTE\"",
    "mtime": "2023-12-04T10:27:41.334Z",
    "size": 174604,
    "path": "../public/img/home/skull2.webp"
  },
  "/img/home/ttd.webp": {
    "type": "image/webp",
    "etag": "\"2a626a-jgW9anRy+KUfnQCDeWjjr0JNAP4\"",
    "mtime": "2023-12-04T10:27:41.346Z",
    "size": 2777706,
    "path": "../public/img/home/ttd.webp"
  },
  "/img/home/winter.webp": {
    "type": "image/webp",
    "etag": "\"d38a8-x8XRUUKteZE3NaPhf0LRxCDrSOQ\"",
    "mtime": "2023-12-04T10:27:41.349Z",
    "size": 866472,
    "path": "../public/img/home/winter.webp"
  },
  "/img/home/women1.webp": {
    "type": "image/webp",
    "etag": "\"76bd8-use22VkqzBVavZgkLAUHW8/VlAk\"",
    "mtime": "2023-12-04T10:27:41.351Z",
    "size": 486360,
    "path": "../public/img/home/women1.webp"
  },
  "/img/home/women2.webp": {
    "type": "image/webp",
    "etag": "\"97fde-IzdI+rnI9GV7Ad2ZhXdpCxu061U\"",
    "mtime": "2023-12-04T10:27:41.354Z",
    "size": 622558,
    "path": "../public/img/home/women2.webp"
  },
  "/img/home/women3.webp": {
    "type": "image/webp",
    "etag": "\"2809fe-mBj98YKat/o0yIs7cvMOnOfMaUI\"",
    "mtime": "2023-12-04T10:27:41.364Z",
    "size": 2623998,
    "path": "../public/img/home/women3.webp"
  },
  "/api/_content/cache.1702066253322.json": {
    "type": "application/json",
    "etag": "\"f94f-GFAmpuvQ33EOs/SOWjSkSkqIspM\"",
    "mtime": "2023-12-08T20:11:08.458Z",
    "size": 63823,
    "path": "../public/api/_content/cache.1702066253322.json"
  },
  "/img/stories/01.jpg": {
    "type": "image/jpeg",
    "etag": "\"23ab78-6Hc9eWa8sBwCf1wLuzPMZ0P7oqc\"",
    "mtime": "2023-12-04T10:27:41.379Z",
    "size": 2337656,
    "path": "../public/img/stories/01.jpg"
  },
  "/img/stories/02.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c8b66-hePkxZpIH7oHcQX+VgC77JuaBmM\"",
    "mtime": "2023-12-04T10:27:41.394Z",
    "size": 2919270,
    "path": "../public/img/stories/02.jpg"
  },
  "/img/stories/03.jpg": {
    "type": "image/jpeg",
    "etag": "\"15d7af-G4E+HvzB/+zhyGKDKrDZSUvoY9U\"",
    "mtime": "2023-12-04T10:27:41.403Z",
    "size": 1431471,
    "path": "../public/img/stories/03.jpg"
  },
  "/img/stories/146A0108.webp": {
    "type": "image/webp",
    "etag": "\"2809fe-mBj98YKat/o0yIs7cvMOnOfMaUI\"",
    "mtime": "2023-10-17T11:28:15.463Z",
    "size": 2623998,
    "path": "../public/img/stories/146A0108.webp"
  },
  "/img/stories/146A0457.webp": {
    "type": "image/webp",
    "etag": "\"21c040-1/Tm8YOQB17r4pQAphXYZO8HPHg\"",
    "mtime": "2023-10-17T11:28:17.486Z",
    "size": 2211904,
    "path": "../public/img/stories/146A0457.webp"
  },
  "/img/stories/146A0458.webp": {
    "type": "image/webp",
    "etag": "\"2846de-A0tsJ8YOAaAPVhB7MqIA1pfOzJk\"",
    "mtime": "2023-10-17T11:28:18.509Z",
    "size": 2639582,
    "path": "../public/img/stories/146A0458.webp"
  },
  "/img/stories/146A0472.webp": {
    "type": "image/webp",
    "etag": "\"1f4f12-yfVCPsmNGM5JwUlgWpSjKosdqGc\"",
    "mtime": "2023-10-17T11:28:20.030Z",
    "size": 2051858,
    "path": "../public/img/stories/146A0472.webp"
  },
  "/img/stories/IMG_0293.webp": {
    "type": "image/webp",
    "etag": "\"786ac-3CjZBGUjqOLo1mQO3pv57jBwp4k\"",
    "mtime": "2023-10-17T11:30:07.498Z",
    "size": 493228,
    "path": "../public/img/stories/IMG_0293.webp"
  },
  "/img/stories/IMG_0294-Edit.webp": {
    "type": "image/webp",
    "etag": "\"83f32-fZBf7EB6P2KlO1HQ0sLxvH1YuT8\"",
    "mtime": "2023-10-17T11:30:07.997Z",
    "size": 540466,
    "path": "../public/img/stories/IMG_0294-Edit.webp"
  },
  "/img/stories/IMG_0319-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"35bef7-tx0oa5PEisljU2x1UvhDqGtgILo\"",
    "mtime": "2018-10-03T04:09:15.618Z",
    "size": 3522295,
    "path": "../public/img/stories/IMG_0319-Edit.jpg"
  },
  "/img/stories/IMG_0327-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2156b6-QEK3TSfOBNXLiMBO44TgPrKzcuY\"",
    "mtime": "2018-10-03T04:09:13.405Z",
    "size": 2184886,
    "path": "../public/img/stories/IMG_0327-Edit.jpg"
  },
  "/img/stories/IMG_0360.jpg": {
    "type": "image/jpeg",
    "etag": "\"f43ca-5Eor0Hg2FRq9tShWJbFSSlJjv9o\"",
    "mtime": "2018-10-03T04:09:23.042Z",
    "size": 1000394,
    "path": "../public/img/stories/IMG_0360.jpg"
  },
  "/img/stories/IMG_0366.jpg": {
    "type": "image/jpeg",
    "etag": "\"372de6-/ErIw9MXS9KxjSNnkA8UMPsc4Ys\"",
    "mtime": "2018-10-03T04:09:29.545Z",
    "size": 3616230,
    "path": "../public/img/stories/IMG_0366.jpg"
  },
  "/img/stories/IMG_0379-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"42d86a-7UvTrC0yk/R4FxKP+WlxpoEOAh8\"",
    "mtime": "2018-10-03T04:09:30.395Z",
    "size": 4380778,
    "path": "../public/img/stories/IMG_0379-Edit.jpg"
  },
  "/img/stories/IMG_0571.webp": {
    "type": "image/webp",
    "etag": "\"1d2d80-+fO+C1Z3oVxTYIJT6I3VHaVcR34\"",
    "mtime": "2023-10-17T11:30:21.737Z",
    "size": 1912192,
    "path": "../public/img/stories/IMG_0571.webp"
  },
  "/img/stories/IMG_0778.webp": {
    "type": "image/webp",
    "etag": "\"d204a-7+hFqspe4+JtgNrBsT9nxW0zj2A\"",
    "mtime": "2023-10-17T11:30:22.177Z",
    "size": 860234,
    "path": "../public/img/stories/IMG_0778.webp"
  },
  "/img/stories/IMG_0810-2.webp": {
    "type": "image/webp",
    "etag": "\"14bfd6-SpXRXk8HsmAKP5ldrT+txUu1s6k\"",
    "mtime": "2023-10-17T11:30:22.564Z",
    "size": 1359830,
    "path": "../public/img/stories/IMG_0810-2.webp"
  },
  "/img/stories/IMG_2349.webp": {
    "type": "image/webp",
    "etag": "\"7291c6-s34HvyRZDqwMipTTa3d+4NPZCsU\"",
    "mtime": "2023-10-17T11:30:43.640Z",
    "size": 7508422,
    "path": "../public/img/stories/IMG_2349.webp"
  },
  "/img/stories/IMG_2426.webp": {
    "type": "image/webp",
    "etag": "\"31152c-WWUdtFLieOUCDlOkjaKeeLp+qNg\"",
    "mtime": "2023-10-17T11:30:45.079Z",
    "size": 3216684,
    "path": "../public/img/stories/IMG_2426.webp"
  },
  "/img/stories/IMG_2434.webp": {
    "type": "image/webp",
    "etag": "\"9239f6-ibTLVE/iqCrd8jUsHXOngfSpb9o\"",
    "mtime": "2023-10-17T11:30:47.310Z",
    "size": 9583094,
    "path": "../public/img/stories/IMG_2434.webp"
  },
  "/img/stories/IMG_2437.webp": {
    "type": "image/webp",
    "etag": "\"836de6-Yeq1mJsu3KRljSZe8sJGTiukIHA\"",
    "mtime": "2023-10-17T11:30:49.401Z",
    "size": 8613350,
    "path": "../public/img/stories/IMG_2437.webp"
  },
  "/img/stories/IMG_2539.webp": {
    "type": "image/webp",
    "etag": "\"2a626a-jgW9anRy+KUfnQCDeWjjr0JNAP4\"",
    "mtime": "2023-10-17T11:30:56.365Z",
    "size": 2777706,
    "path": "../public/img/stories/IMG_2539.webp"
  },
  "/img/stories/IMG_2563.webp": {
    "type": "image/webp",
    "etag": "\"232650-KMsVJaDIDTWiAn9/x+ITff8eQ7A\"",
    "mtime": "2023-10-17T11:30:57.551Z",
    "size": 2303568,
    "path": "../public/img/stories/IMG_2563.webp"
  },
  "/img/stories/untitled-1-2.webp": {
    "type": "image/webp",
    "etag": "\"37518-61uI0ePLdYbvsQfa/vr2uCgdHUU\"",
    "mtime": "2023-10-17T11:31:03.943Z",
    "size": 226584,
    "path": "../public/img/stories/untitled-1-2.webp"
  },
  "/img/stories/_46A0124.JPG": {
    "type": "image/jpeg",
    "etag": "\"7f328-PgrzJIhl4u1/RlfPUh0jB74Xj20\"",
    "mtime": "2021-05-31T22:15:21.749Z",
    "size": 521000,
    "path": "../public/img/stories/_46A0124.JPG"
  },
  "/img/stories/_46A0125.JPG": {
    "type": "image/jpeg",
    "etag": "\"87a1d-jYgoiCgwkJNlAFpeSHU9ANPxM7w\"",
    "mtime": "2021-05-31T22:15:21.962Z",
    "size": 555549,
    "path": "../public/img/stories/_46A0125.JPG"
  },
  "/img/stories/_46A0158-Edit.webp": {
    "type": "image/webp",
    "etag": "\"1bcee2-kVeEtOX7iXtRuIOy1r8+EDaGz4g\"",
    "mtime": "2023-10-17T11:28:49.101Z",
    "size": 1822434,
    "path": "../public/img/stories/_46A0158-Edit.webp"
  },
  "/img/stories/_46A0159-Edit.webp": {
    "type": "image/webp",
    "etag": "\"532c7a-IpjEQxhrAATyVppyN+ZlkceBsP0\"",
    "mtime": "2023-10-17T11:28:50.394Z",
    "size": 5450874,
    "path": "../public/img/stories/_46A0159-Edit.webp"
  },
  "/img/stories/_46A0250.webp": {
    "type": "image/webp",
    "etag": "\"8c939c-iUfpYXeLgf8PxjGL47kxPzLwi5g\"",
    "mtime": "2023-10-17T11:29:14.833Z",
    "size": 9212828,
    "path": "../public/img/stories/_46A0250.webp"
  },
  "/img/stories/_46A0269.webp": {
    "type": "image/webp",
    "etag": "\"2a4076-UOtPGvxBjtUH8YOqABwM9cw2cH4\"",
    "mtime": "2023-10-17T11:29:25.670Z",
    "size": 2769014,
    "path": "../public/img/stories/_46A0269.webp"
  },
  "/img/stories/_46A0413-Pano.webp": {
    "type": "image/webp",
    "etag": "\"324f82-Zf8amJgEJwMGvZxSR6iTlDnXLQY\"",
    "mtime": "2023-10-17T11:29:45.437Z",
    "size": 3297154,
    "path": "../public/img/stories/_46A0413-Pano.webp"
  },
  "/img/stories/_46A0546-Edit.webp": {
    "type": "image/webp",
    "etag": "\"18386c-P+OuikugPs6e9RlCK2th0C8hsTU\"",
    "mtime": "2023-10-17T11:29:54.213Z",
    "size": 1587308,
    "path": "../public/img/stories/_46A0546-Edit.webp"
  },
  "/img/stories/_46A0547.webp": {
    "type": "image/webp",
    "etag": "\"f7990-6KJaSv+y1+XjatKvcOroG2ikFSc\"",
    "mtime": "2023-10-17T11:29:54.993Z",
    "size": 1014160,
    "path": "../public/img/stories/_46A0547.webp"
  },
  "/img/stories/_46A0745.jpg": {
    "type": "image/jpeg",
    "etag": "\"13c616-/AwEHX2xgb+7xwWMpbgoYlEyQ3g\"",
    "mtime": "2019-10-23T02:55:36.661Z",
    "size": 1295894,
    "path": "../public/img/stories/_46A0745.jpg"
  },
  "/img/stories/_46A1024.jpg": {
    "type": "image/jpeg",
    "etag": "\"b8e5f-OWsKgn3l5pCH2p7D7/PzTpJfWWY\"",
    "mtime": "2018-10-02T01:46:40.326Z",
    "size": 757343,
    "path": "../public/img/stories/_46A1024.jpg"
  },
  "/img/stories/_46A1025.jpg": {
    "type": "image/jpeg",
    "etag": "\"9d64d-j99bLEXlisPzhd1S70g3SRjfCoY\"",
    "mtime": "2018-10-02T01:47:43.788Z",
    "size": 644685,
    "path": "../public/img/stories/_46A1025.jpg"
  },
  "/img/stories/_46A1112-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"e3fb8-Ut4sjjsBlruQpWph2oqNVil5I7A\"",
    "mtime": "2018-10-02T01:48:52.700Z",
    "size": 933816,
    "path": "../public/img/stories/_46A1112-Edit.jpg"
  },
  "/img/stories/_46A1243.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a0340-V0RN4xksfD5OjKnvAHiepboGRdM\"",
    "mtime": "2018-10-02T01:49:44.977Z",
    "size": 2753344,
    "path": "../public/img/stories/_46A1243.jpg"
  },
  "/img/stories/_46A1285.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e5d6f-dQn5055cEoUHSJudV4A0XzgLp58\"",
    "mtime": "2018-10-02T01:50:23.745Z",
    "size": 4087151,
    "path": "../public/img/stories/_46A1285.jpg"
  },
  "/img/stories/_46A1330.jpg": {
    "type": "image/jpeg",
    "etag": "\"258a29-KzcmtpJUbPQeZDsxz3RYgHQ1y0Y\"",
    "mtime": "2018-10-02T01:50:43.599Z",
    "size": 2460201,
    "path": "../public/img/stories/_46A1330.jpg"
  },
  "/img/stories/_46A1332.jpg": {
    "type": "image/jpeg",
    "etag": "\"3a660d-7VLvZULs1079Oq6N6ZEQFk5fk4M\"",
    "mtime": "2018-10-02T01:50:47.000Z",
    "size": 3827213,
    "path": "../public/img/stories/_46A1332.jpg"
  },
  "/img/stories/_46A1335-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"187823-bf0mZJbWnwcdyDP12LQG6xh8yWs\"",
    "mtime": "2018-10-02T01:50:47.156Z",
    "size": 1603619,
    "path": "../public/img/stories/_46A1335-Edit.jpg"
  },
  "/img/stories/_46A1363-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2aab32-JszlwoQToBAxHTZ2kYQnDkQFm2g\"",
    "mtime": "2018-10-02T01:51:00.799Z",
    "size": 2796338,
    "path": "../public/img/stories/_46A1363-Edit.jpg"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-Zx13oRZ/KMggVYPw9+9rZv438n4\"",
    "mtime": "2023-12-08T20:11:08.463Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/img/galleries/gal3/146A0313.jpg": {
    "type": "image/jpeg",
    "etag": "\"e00a7-dtFP4Wnk/E3ZwQd9XL9kuzcTmvc\"",
    "mtime": "2023-12-04T10:27:39.333Z",
    "size": 917671,
    "path": "../public/img/galleries/gal3/146A0313.jpg"
  },
  "/img/galleries/gal3/cas13.jpg": {
    "type": "image/jpeg",
    "etag": "\"13fd2-U0dp/ynm5CWt9URBb3gQ6CpTEvE\"",
    "mtime": "2023-12-04T10:27:39.472Z",
    "size": 81874,
    "path": "../public/img/galleries/gal3/cas13.jpg"
  },
  "/img/galleries/gal3/cas5.jpg": {
    "type": "image/jpeg",
    "etag": "\"acfe-UigI8YJnSo/sNJcYoTwPw7pSWsw\"",
    "mtime": "2023-12-04T10:27:39.473Z",
    "size": 44286,
    "path": "../public/img/galleries/gal3/cas5.jpg"
  },
  "/img/galleries/gal3/cas6.jpg": {
    "type": "image/jpeg",
    "etag": "\"ef38-DZzI+t2CfAxsTP//VaRKqoGB480\"",
    "mtime": "2023-12-04T10:27:39.474Z",
    "size": 61240,
    "path": "../public/img/galleries/gal3/cas6.jpg"
  },
  "/img/galleries/gal3/clq2tt0kgfcfgsc3cjbj.webp": {
    "type": "image/webp",
    "etag": "\"22374-9t/6+HvzUEeSYj+s3dF1kwsh40o\"",
    "mtime": "2023-12-04T10:27:39.475Z",
    "size": 140148,
    "path": "../public/img/galleries/gal3/clq2tt0kgfcfgsc3cjbj.webp"
  },
  "/img/galleries/gal3/DSC09963.jpg": {
    "type": "image/jpeg",
    "etag": "\"10b5d8-PMRx1bG3wjpRE0x2hKGJZH5atd4\"",
    "mtime": "2023-12-04T10:27:39.342Z",
    "size": 1095128,
    "path": "../public/img/galleries/gal3/DSC09963.jpg"
  },
  "/img/galleries/gal3/DSC09970.jpg": {
    "type": "image/jpeg",
    "etag": "\"150a78-hxG2Z4NXu3iGuOC2/PDxE9wupqU\"",
    "mtime": "2023-12-04T10:27:39.351Z",
    "size": 1378936,
    "path": "../public/img/galleries/gal3/DSC09970.jpg"
  },
  "/img/galleries/gal3/ehveik701np2hvrrqphy.webp": {
    "type": "image/webp",
    "etag": "\"4cd78-xZwb3V9IeP5awhuu2frOrpT9IJY\"",
    "mtime": "2023-12-04T10:27:39.477Z",
    "size": 314744,
    "path": "../public/img/galleries/gal3/ehveik701np2hvrrqphy.webp"
  },
  "/img/galleries/gal3/f4liwsc7yllxe2yvwov2.webp": {
    "type": "image/webp",
    "etag": "\"1e946-G9qJKlmDQhjOelM5MBSVVOLQzYA\"",
    "mtime": "2023-12-04T10:27:39.478Z",
    "size": 125254,
    "path": "../public/img/galleries/gal3/f4liwsc7yllxe2yvwov2.webp"
  },
  "/img/galleries/gal3/fbtofdmmjm5xhjj3mzxs.webp": {
    "type": "image/webp",
    "etag": "\"360b6-LXRJGeYF5dbDLYBHPMnRn7BKXC8\"",
    "mtime": "2023-12-04T10:27:39.480Z",
    "size": 221366,
    "path": "../public/img/galleries/gal3/fbtofdmmjm5xhjj3mzxs.webp"
  },
  "/img/galleries/gal3/ifagmaw1y47kw9ssv3rf.webp": {
    "type": "image/webp",
    "etag": "\"b610-r7qHZH/Ti2zesofxjJf46eSl4Qs\"",
    "mtime": "2023-12-04T10:27:39.481Z",
    "size": 46608,
    "path": "../public/img/galleries/gal3/ifagmaw1y47kw9ssv3rf.webp"
  },
  "/img/galleries/gal3/ihi17ktit1rx8aihsx2u.webp": {
    "type": "image/webp",
    "etag": "\"178a4-0orQ5AHlzA5OIbNggr4G26oU+hQ\"",
    "mtime": "2023-12-04T10:27:39.482Z",
    "size": 96420,
    "path": "../public/img/galleries/gal3/ihi17ktit1rx8aihsx2u.webp"
  },
  "/img/galleries/gal3/IMG_0293.jpg": {
    "type": "image/jpeg",
    "etag": "\"66155-KDAm+3n6amvl8Aun+poeGtn0bmc\"",
    "mtime": "2023-12-04T10:27:39.354Z",
    "size": 418133,
    "path": "../public/img/galleries/gal3/IMG_0293.jpg"
  },
  "/img/galleries/gal3/IMG_0294-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"9b37a-cZ0buz54v5qt8gRA9VVRYolgJwo\"",
    "mtime": "2023-12-04T10:27:39.358Z",
    "size": 635770,
    "path": "../public/img/galleries/gal3/IMG_0294-Edit.jpg"
  },
  "/img/galleries/gal3/IMG_0810-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"12e657-blUH0B5WN6zH64N9IkYB5yZePG4\"",
    "mtime": "2023-12-04T10:27:39.365Z",
    "size": 1238615,
    "path": "../public/img/galleries/gal3/IMG_0810-2.jpg"
  },
  "/img/galleries/gal3/IMG_0833.jpg": {
    "type": "image/jpeg",
    "etag": "\"15f997-3KifVN9rc/XvDWrbTjFrPwIqkYs\"",
    "mtime": "2023-12-04T10:27:39.374Z",
    "size": 1440151,
    "path": "../public/img/galleries/gal3/IMG_0833.jpg"
  },
  "/img/galleries/gal3/IMG_1786.jpg": {
    "type": "image/jpeg",
    "etag": "\"14c681-ojxhgID+qLQVdxnSg8EIsK520yE\"",
    "mtime": "2023-12-04T10:27:39.383Z",
    "size": 1361537,
    "path": "../public/img/galleries/gal3/IMG_1786.jpg"
  },
  "/img/galleries/gal3/j2g58vbwjc4jkiaiw6mk.webp": {
    "type": "image/webp",
    "etag": "\"66008-fqi1tm9O09s/Dk2TMpvLVdtAImk\"",
    "mtime": "2023-12-04T10:27:39.484Z",
    "size": 417800,
    "path": "../public/img/galleries/gal3/j2g58vbwjc4jkiaiw6mk.webp"
  },
  "/img/galleries/gal3/jaescixbibgou88eyfhq.webp": {
    "type": "image/webp",
    "etag": "\"33732-/HAP6pp4AGqNntY97IP6WyDA8n8\"",
    "mtime": "2023-12-04T10:27:39.485Z",
    "size": 210738,
    "path": "../public/img/galleries/gal3/jaescixbibgou88eyfhq.webp"
  },
  "/img/galleries/gal3/ktnwzs2g09ynstt4wzfo.webp": {
    "type": "image/webp",
    "etag": "\"25a2a-ZwAsk9eQwZi8WPAuLPu2wQXr13k\"",
    "mtime": "2023-12-04T10:27:39.486Z",
    "size": 154154,
    "path": "../public/img/galleries/gal3/ktnwzs2g09ynstt4wzfo.webp"
  },
  "/img/galleries/gal3/loi3sou6sf7xq82kh60s.webp": {
    "type": "image/webp",
    "etag": "\"1f94a-xPaiWO0EAKnz2iUSLFsFuU2xmWA\"",
    "mtime": "2023-12-04T10:27:39.487Z",
    "size": 129354,
    "path": "../public/img/galleries/gal3/loi3sou6sf7xq82kh60s.webp"
  },
  "/img/galleries/gal3/medusa.jpg": {
    "type": "image/jpeg",
    "etag": "\"b01ae-ni8VMbZ4e0m35Q73OzZzexPcWSw\"",
    "mtime": "2023-12-04T10:27:39.493Z",
    "size": 721326,
    "path": "../public/img/galleries/gal3/medusa.jpg"
  },
  "/img/galleries/gal3/mr0j8f3loc86gjoznhyp.webp": {
    "type": "image/webp",
    "etag": "\"2e8ea-LFSWwy3pKVEkSo+bYdBFGdXh6H8\"",
    "mtime": "2023-12-04T10:27:39.495Z",
    "size": 190698,
    "path": "../public/img/galleries/gal3/mr0j8f3loc86gjoznhyp.webp"
  },
  "/img/galleries/gal3/neekkmagizla3gly4r5d.webp": {
    "type": "image/webp",
    "etag": "\"29466-bmXsMYI3Z7371RQ4sEhrc2kDbNg\"",
    "mtime": "2023-12-04T10:27:39.496Z",
    "size": 169062,
    "path": "../public/img/galleries/gal3/neekkmagizla3gly4r5d.webp"
  },
  "/img/galleries/gal3/nmgblsvn6u5jlzuh3dib.webp": {
    "type": "image/webp",
    "etag": "\"19ffe-4gUDUQRUA+LDl41WrdLX0bVdsHM\"",
    "mtime": "2023-12-04T10:27:39.497Z",
    "size": 106494,
    "path": "../public/img/galleries/gal3/nmgblsvn6u5jlzuh3dib.webp"
  },
  "/img/galleries/gal3/o9pjgmisolwkqbudo4ze.webp": {
    "type": "image/webp",
    "etag": "\"24842-B/3a/qm8ve3R77Ooz+i8WGQozfQ\"",
    "mtime": "2023-12-04T10:27:39.498Z",
    "size": 149570,
    "path": "../public/img/galleries/gal3/o9pjgmisolwkqbudo4ze.webp"
  },
  "/img/galleries/gal3/s1itz7htabpt6rij7fg0.webp": {
    "type": "image/webp",
    "etag": "\"1aefa-aliCJA0TK1BcGOpHbo/XKlcQCD8\"",
    "mtime": "2023-12-04T10:27:39.498Z",
    "size": 110330,
    "path": "../public/img/galleries/gal3/s1itz7htabpt6rij7fg0.webp"
  },
  "/img/galleries/gal3/s5wfdm0ff4hilggnfbfd.webp": {
    "type": "image/webp",
    "etag": "\"17724-m7JRMjx87N2mseZSgu9xexx2HCg\"",
    "mtime": "2023-12-04T10:27:39.499Z",
    "size": 96036,
    "path": "../public/img/galleries/gal3/s5wfdm0ff4hilggnfbfd.webp"
  },
  "/img/galleries/gal3/sxjf6cs3qsuvmisj7kuy.webp": {
    "type": "image/webp",
    "etag": "\"14cba-U3UI8ZgR39XIG+cbBKJ2KwYnbeQ\"",
    "mtime": "2023-12-04T10:27:39.500Z",
    "size": 85178,
    "path": "../public/img/galleries/gal3/sxjf6cs3qsuvmisj7kuy.webp"
  },
  "/img/galleries/gal3/tfzvexhzu44holvqdfpn.webp": {
    "type": "image/webp",
    "etag": "\"179ce-NTizoOo3ZoOFVlO4HQN1P2HSjQU\"",
    "mtime": "2023-12-04T10:27:39.500Z",
    "size": 96718,
    "path": "../public/img/galleries/gal3/tfzvexhzu44holvqdfpn.webp"
  },
  "/img/galleries/gal3/tqbvcruobvaowdcv0gab.webp": {
    "type": "image/webp",
    "etag": "\"13ea6-Lw3OqpQazvG249tlLz66N5DZLdA\"",
    "mtime": "2023-12-04T10:27:39.502Z",
    "size": 81574,
    "path": "../public/img/galleries/gal3/tqbvcruobvaowdcv0gab.webp"
  },
  "/img/galleries/gal3/untitled-1-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4f4e9-fMQNywORB01uBLjzTP6j8eIYuA8\"",
    "mtime": "2023-12-04T10:27:39.503Z",
    "size": 324841,
    "path": "../public/img/galleries/gal3/untitled-1-2.jpg"
  },
  "/img/galleries/gal3/untitled-105.jpg": {
    "type": "image/jpeg",
    "etag": "\"9474a-RnAWcuvrDwcT4XO/8SPHMw1tYMw\"",
    "mtime": "2023-12-04T10:27:39.506Z",
    "size": 608074,
    "path": "../public/img/galleries/gal3/untitled-105.jpg"
  },
  "/img/galleries/gal3/untitled-106.jpg": {
    "type": "image/jpeg",
    "etag": "\"76f87-3K4+p/4FEuliGWwsYtSek8QSgeI\"",
    "mtime": "2023-12-04T10:27:39.508Z",
    "size": 487303,
    "path": "../public/img/galleries/gal3/untitled-106.jpg"
  },
  "/img/galleries/gal3/vvagpody8s2oalqxpvrp.webp": {
    "type": "image/webp",
    "etag": "\"33ca6-doWXP6gkM4eV/UX4cHYLssdUHZs\"",
    "mtime": "2023-12-04T10:27:39.509Z",
    "size": 212134,
    "path": "../public/img/galleries/gal3/vvagpody8s2oalqxpvrp.webp"
  },
  "/img/galleries/gal3/zleal1tiajnpadlju3kj.webp": {
    "type": "image/webp",
    "etag": "\"32030-V5J3jdSkvSW4W76Cr6aOndqBOYY\"",
    "mtime": "2023-12-04T10:27:39.511Z",
    "size": 204848,
    "path": "../public/img/galleries/gal3/zleal1tiajnpadlju3kj.webp"
  },
  "/img/galleries/gal3/Zuni-16.jpg": {
    "type": "image/jpeg",
    "etag": "\"34566-cT4Ph2gTe5cN1Ns1dxtDIhx9Wyc\"",
    "mtime": "2023-12-04T10:27:39.384Z",
    "size": 214374,
    "path": "../public/img/galleries/gal3/Zuni-16.jpg"
  },
  "/img/galleries/gal3/Zuni-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6577b-wB6IsMXe+eOm6jLNJYwIkbYB1HU\"",
    "mtime": "2023-12-04T10:27:39.386Z",
    "size": 415611,
    "path": "../public/img/galleries/gal3/Zuni-2.jpg"
  },
  "/img/galleries/gal3/Zuni-24.jpg": {
    "type": "image/jpeg",
    "etag": "\"62633-5NxFYoQy89+FB7ixySUkunhDR1k\"",
    "mtime": "2023-12-04T10:27:39.388Z",
    "size": 402995,
    "path": "../public/img/galleries/gal3/Zuni-24.jpg"
  },
  "/img/galleries/gal3/Zuni-42.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b8f7-LV5ZmvB1QVHPbx8XxKYsvi1LNm4\"",
    "mtime": "2023-12-04T10:27:39.390Z",
    "size": 243959,
    "path": "../public/img/galleries/gal3/Zuni-42.jpg"
  },
  "/img/galleries/gal3/Zuni-43.jpg": {
    "type": "image/jpeg",
    "etag": "\"5ea1d-0Xkb17mmpO8pzpS0gX99mSMQtlk\"",
    "mtime": "2023-12-04T10:27:39.392Z",
    "size": 387613,
    "path": "../public/img/galleries/gal3/Zuni-43.jpg"
  },
  "/img/galleries/gal3/Zuni-45.jpg": {
    "type": "image/jpeg",
    "etag": "\"4a6dd-iRQrULoNTB9OVhg6Kiaj3oSjrJg\"",
    "mtime": "2023-12-04T10:27:39.393Z",
    "size": 304861,
    "path": "../public/img/galleries/gal3/Zuni-45.jpg"
  },
  "/img/galleries/gal3/Zuni-46.jpg": {
    "type": "image/jpeg",
    "etag": "\"511eb-gv0fTLf5vcmI6wn5/WJTmomdicw\"",
    "mtime": "2023-12-04T10:27:39.396Z",
    "size": 332267,
    "path": "../public/img/galleries/gal3/Zuni-46.jpg"
  },
  "/img/galleries/gal3/Zuni-48.jpg": {
    "type": "image/jpeg",
    "etag": "\"576b1-KhLEkgmICBFVRTYTDa1irELtvRI\"",
    "mtime": "2023-12-04T10:27:39.397Z",
    "size": 358065,
    "path": "../public/img/galleries/gal3/Zuni-48.jpg"
  },
  "/img/galleries/gal3/Zuni-51.jpg": {
    "type": "image/jpeg",
    "etag": "\"68815-rS7trd7twUkD+vr2m7mS+Rp6vQ8\"",
    "mtime": "2023-12-04T10:27:39.400Z",
    "size": 428053,
    "path": "../public/img/galleries/gal3/Zuni-51.jpg"
  },
  "/img/galleries/gal3/Zuni-52.jpg": {
    "type": "image/jpeg",
    "etag": "\"5003b-vt+e8rDozQswdUVnBhC7Jr12u3M\"",
    "mtime": "2023-12-04T10:27:39.403Z",
    "size": 327739,
    "path": "../public/img/galleries/gal3/Zuni-52.jpg"
  },
  "/img/galleries/gal3/Zuni-6.jpg": {
    "type": "image/jpeg",
    "etag": "\"487ea-XLsfIjjE/Aa40UfRwUUf6aQAuFw\"",
    "mtime": "2023-12-04T10:27:39.404Z",
    "size": 296938,
    "path": "../public/img/galleries/gal3/Zuni-6.jpg"
  },
  "/img/galleries/gal3/Zuni-61.jpg": {
    "type": "image/jpeg",
    "etag": "\"5efdc-dPgM4kBgmYw5r/jxu/HA6/1HAls\"",
    "mtime": "2023-12-04T10:27:39.407Z",
    "size": 389084,
    "path": "../public/img/galleries/gal3/Zuni-61.jpg"
  },
  "/img/galleries/gal3/Zuni-66.jpg": {
    "type": "image/jpeg",
    "etag": "\"83c49-2FXRYT4OaM52M+zH9NLTYnemtZ8\"",
    "mtime": "2023-12-04T10:27:39.409Z",
    "size": 539721,
    "path": "../public/img/galleries/gal3/Zuni-66.jpg"
  },
  "/img/galleries/gal3/Zuni-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"437c1-vbMZST1SAcST0+9QXCnqdyM2fC4\"",
    "mtime": "2023-12-04T10:27:39.410Z",
    "size": 276417,
    "path": "../public/img/galleries/gal3/Zuni-7.jpg"
  },
  "/img/galleries/gal3/Zuni.jpg": {
    "type": "image/jpeg",
    "etag": "\"47deb-CzYdmpzfj/4c5EVItU1DvgEWQrc\"",
    "mtime": "2023-12-04T10:27:39.411Z",
    "size": 294379,
    "path": "../public/img/galleries/gal3/Zuni.jpg"
  },
  "/img/galleries/gal3/_46A0063.jpg": {
    "type": "image/jpeg",
    "etag": "\"148e17-jN2vXQ6IqLeQ19Uhe88WfOUrUCU\"",
    "mtime": "2023-12-04T10:27:39.415Z",
    "size": 1347095,
    "path": "../public/img/galleries/gal3/_46A0063.jpg"
  },
  "/img/galleries/gal3/_46A0158-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"165a8c-sDCZY0eJFWIludBDC+WIzniJVBc\"",
    "mtime": "2023-12-04T10:27:39.423Z",
    "size": 1464972,
    "path": "../public/img/galleries/gal3/_46A0158-Edit.jpg"
  },
  "/img/galleries/gal3/_46A0159-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"4645bf-YnLIW+ttwg0Y4j1it3BIoqPdg4Q\"",
    "mtime": "2023-12-04T10:27:39.452Z",
    "size": 4605375,
    "path": "../public/img/galleries/gal3/_46A0159-Edit.jpg"
  },
  "/img/galleries/gal3/_46A0539-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2e52b9-t6JFbWXdexMkp8cHNd+fMJZCxRA\"",
    "mtime": "2023-12-04T10:27:39.471Z",
    "size": 3035833,
    "path": "../public/img/galleries/gal3/_46A0539-Edit.jpg"
  },
  "/img/galleries/gal2/146A0639.jpg": {
    "type": "image/jpeg",
    "etag": "\"195417-Db8aDjhIhS+yfU9qAohEdzpCpjo\"",
    "mtime": "2023-12-04T10:27:38.860Z",
    "size": 1659927,
    "path": "../public/img/galleries/gal2/146A0639.jpg"
  },
  "/img/galleries/gal2/146A0964.jpg": {
    "type": "image/jpeg",
    "etag": "\"5fa16a-iVyC1ipQrepm+oKM0v5Kkic0tWE\"",
    "mtime": "2023-12-04T10:27:38.893Z",
    "size": 6267242,
    "path": "../public/img/galleries/gal2/146A0964.jpg"
  },
  "/img/galleries/gal2/146A0981.jpg": {
    "type": "image/jpeg",
    "etag": "\"282947-/UdtnQT8pdJiGr32yZz9Nxj9Hm8\"",
    "mtime": "2023-12-04T10:27:38.909Z",
    "size": 2632007,
    "path": "../public/img/galleries/gal2/146A0981.jpg"
  },
  "/img/galleries/gal2/146A1048.jpg": {
    "type": "image/jpeg",
    "etag": "\"23e4b3-Q2m/PdibjmkjjJ1q0RMdMWreZdI\"",
    "mtime": "2023-12-04T10:27:38.923Z",
    "size": 2352307,
    "path": "../public/img/galleries/gal2/146A1048.jpg"
  },
  "/img/galleries/gal2/ankfbvymv9cw3nlhxg6w.webp": {
    "type": "image/webp",
    "etag": "\"1cd22-DmwVzevwsk5Gs5EKujgqFEVGkKY\"",
    "mtime": "2023-12-04T10:27:39.298Z",
    "size": 118050,
    "path": "../public/img/galleries/gal2/ankfbvymv9cw3nlhxg6w.webp"
  },
  "/img/galleries/gal2/aqfgksdur4tidhjurjr1.webp": {
    "type": "image/webp",
    "etag": "\"5096a-5MYTkgEMfJ8i++ALtP4uxKcZDnk\"",
    "mtime": "2023-12-04T10:27:39.300Z",
    "size": 330090,
    "path": "../public/img/galleries/gal2/aqfgksdur4tidhjurjr1.webp"
  },
  "/img/galleries/gal2/bafqmzm7twoeukdkdpla.webp": {
    "type": "image/webp",
    "etag": "\"e20a-zC8Aj830RnHhihoa9jl6guRMJFs\"",
    "mtime": "2023-12-04T10:27:39.300Z",
    "size": 57866,
    "path": "../public/img/galleries/gal2/bafqmzm7twoeukdkdpla.webp"
  },
  "/img/galleries/gal2/ese8ocvfskkylryosrbq.webp": {
    "type": "image/webp",
    "etag": "\"29b0a-aESUHUOR/9XxDXDJfE2cXY802/c\"",
    "mtime": "2023-12-04T10:27:39.301Z",
    "size": 170762,
    "path": "../public/img/galleries/gal2/ese8ocvfskkylryosrbq.webp"
  },
  "/img/galleries/gal2/fbo4ueky31br9fofdueh.webp": {
    "type": "image/webp",
    "etag": "\"2fc96-K/n3Y7Ts4NRPsXZyxnRMSAx0kE8\"",
    "mtime": "2023-12-04T10:27:39.303Z",
    "size": 195734,
    "path": "../public/img/galleries/gal2/fbo4ueky31br9fofdueh.webp"
  },
  "/img/galleries/gal2/fsnf3vialcxfavbhalbg.webp": {
    "type": "image/webp",
    "etag": "\"11db2-42r82JcvEOwt+cwRuwM0a5+MVjY\"",
    "mtime": "2023-12-04T10:27:39.303Z",
    "size": 73138,
    "path": "../public/img/galleries/gal2/fsnf3vialcxfavbhalbg.webp"
  },
  "/img/galleries/gal2/IMG_0409.jpg": {
    "type": "image/jpeg",
    "etag": "\"3d19f8-Ul7bWR6fqQXKXjvrYmxxiA8+mQY\"",
    "mtime": "2023-12-04T10:27:38.937Z",
    "size": 4004344,
    "path": "../public/img/galleries/gal2/IMG_0409.jpg"
  },
  "/img/galleries/gal2/IMG_0421.jpg": {
    "type": "image/jpeg",
    "etag": "\"48df24-Ml9GNN3iZk3y5F6y8CuYEWIntaM\"",
    "mtime": "2023-12-04T10:27:38.956Z",
    "size": 4775716,
    "path": "../public/img/galleries/gal2/IMG_0421.jpg"
  },
  "/img/galleries/gal2/IMG_1417.jpg": {
    "type": "image/jpeg",
    "etag": "\"1780e2-MzD5r41ym/Jio3OOZ1bwTnakXps\"",
    "mtime": "2023-12-04T10:27:38.966Z",
    "size": 1540322,
    "path": "../public/img/galleries/gal2/IMG_1417.jpg"
  },
  "/img/galleries/gal2/IMG_2349.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b98f3-g7At8ZIJnd+UKz7cw7yuKrLDbJs\"",
    "mtime": "2023-12-04T10:27:38.993Z",
    "size": 4954355,
    "path": "../public/img/galleries/gal2/IMG_2349.jpg"
  },
  "/img/galleries/gal2/IMG_2384.jpg": {
    "type": "image/jpeg",
    "etag": "\"187046-ldziGpJZ3dioEh28tP1lfJIcwdE\"",
    "mtime": "2023-12-04T10:27:39.003Z",
    "size": 1601606,
    "path": "../public/img/galleries/gal2/IMG_2384.jpg"
  },
  "/img/galleries/gal2/IMG_2426.jpg": {
    "type": "image/jpeg",
    "etag": "\"205508-vGcrWiyBxXuvPcY8QE5QVvUf6uY\"",
    "mtime": "2023-12-04T10:27:39.016Z",
    "size": 2118920,
    "path": "../public/img/galleries/gal2/IMG_2426.jpg"
  },
  "/img/galleries/gal2/IMG_2434.jpg": {
    "type": "image/jpeg",
    "etag": "\"713ca4-EamgU8YrtYZgGShH3fmZslcdW6Y\"",
    "mtime": "2023-12-04T10:27:39.057Z",
    "size": 7421092,
    "path": "../public/img/galleries/gal2/IMG_2434.jpg"
  },
  "/img/galleries/gal2/IMG_2437.jpg": {
    "type": "image/jpeg",
    "etag": "\"63d260-E/Iictif4RvtjLPbyXcWY4uHGY8\"",
    "mtime": "2023-12-04T10:27:39.089Z",
    "size": 6541920,
    "path": "../public/img/galleries/gal2/IMG_2437.jpg"
  },
  "/img/galleries/gal2/IMG_2443.jpg": {
    "type": "image/jpeg",
    "etag": "\"206369-BYa0sdZSAuiUHTb/YpnZWVfjELI\"",
    "mtime": "2023-12-04T10:27:39.097Z",
    "size": 2122601,
    "path": "../public/img/galleries/gal2/IMG_2443.jpg"
  },
  "/img/galleries/gal2/IMG_2463.jpg": {
    "type": "image/jpeg",
    "etag": "\"51b420-WBwbnaR5rtCNoYYa9oNjqzhwsP8\"",
    "mtime": "2023-12-04T10:27:39.119Z",
    "size": 5354528,
    "path": "../public/img/galleries/gal2/IMG_2463.jpg"
  },
  "/img/galleries/gal2/IMG_2484.jpg": {
    "type": "image/jpeg",
    "etag": "\"2503dd-Sf+/4sQNrtkDuYdAPvm7bGEDkJE\"",
    "mtime": "2023-12-04T10:27:39.132Z",
    "size": 2425821,
    "path": "../public/img/galleries/gal2/IMG_2484.jpg"
  },
  "/img/galleries/gal2/jbymykrnmgbccbv0czxo.webp": {
    "type": "image/webp",
    "etag": "\"159d6-vYd5AMAu2yWjfVy9ZWsvivuG9u4\"",
    "mtime": "2023-12-04T10:27:39.304Z",
    "size": 88534,
    "path": "../public/img/galleries/gal2/jbymykrnmgbccbv0czxo.webp"
  },
  "/img/galleries/gal2/manqh1tqwskwrhootfrg.webp": {
    "type": "image/webp",
    "etag": "\"2ce2c-yUrAS9OqwTI4sTp73n33R0R1OPk\"",
    "mtime": "2023-12-04T10:27:39.305Z",
    "size": 183852,
    "path": "../public/img/galleries/gal2/manqh1tqwskwrhootfrg.webp"
  },
  "/img/galleries/gal2/mt7vbnb37mqmuob7vacf.webp": {
    "type": "image/webp",
    "etag": "\"1b1de-+9T5nDgHvBLqG32miVSgtD75/LY\"",
    "mtime": "2023-12-04T10:27:39.306Z",
    "size": 111070,
    "path": "../public/img/galleries/gal2/mt7vbnb37mqmuob7vacf.webp"
  },
  "/img/galleries/gal2/mubgzuvnsby0jonorusu.webp": {
    "type": "image/webp",
    "etag": "\"4a8ca-jysM7dAU22YtHl0dPWkSsMLBpTE\"",
    "mtime": "2023-12-04T10:27:39.308Z",
    "size": 305354,
    "path": "../public/img/galleries/gal2/mubgzuvnsby0jonorusu.webp"
  },
  "/img/galleries/gal2/nadgfaxn7uuz4otztz5m.webp": {
    "type": "image/webp",
    "etag": "\"50a46-XkbZvaZth88owqhDrEHr9DPYW3Y\"",
    "mtime": "2023-12-04T10:27:39.311Z",
    "size": 330310,
    "path": "../public/img/galleries/gal2/nadgfaxn7uuz4otztz5m.webp"
  },
  "/img/galleries/gal2/pqdezwm7um02e4nhffxb.webp": {
    "type": "image/webp",
    "etag": "\"1a632-mbIgpnUxpSdUgn9C7NDXWkC2Wt0\"",
    "mtime": "2023-12-04T10:27:39.312Z",
    "size": 108082,
    "path": "../public/img/galleries/gal2/pqdezwm7um02e4nhffxb.webp"
  },
  "/img/galleries/gal2/qoxt4ymzvurimmvxxn86.webp": {
    "type": "image/webp",
    "etag": "\"691c4-+hODMwA45d623tIpMYrAyHbdSj0\"",
    "mtime": "2023-12-04T10:27:39.315Z",
    "size": 430532,
    "path": "../public/img/galleries/gal2/qoxt4ymzvurimmvxxn86.webp"
  },
  "/img/galleries/gal2/qwm4daehqvaofhgsp3cx.webp": {
    "type": "image/webp",
    "etag": "\"2e596-7AAZNlyeIr3LeIx/XA0r85nURN8\"",
    "mtime": "2023-12-04T10:27:39.316Z",
    "size": 189846,
    "path": "../public/img/galleries/gal2/qwm4daehqvaofhgsp3cx.webp"
  },
  "/img/galleries/gal2/qwrpgha5paixwlrokliw.webp": {
    "type": "image/webp",
    "etag": "\"17b9a-AOSPiqCUM7voLynRROQUhNeMu8g\"",
    "mtime": "2023-12-04T10:27:39.317Z",
    "size": 97178,
    "path": "../public/img/galleries/gal2/qwrpgha5paixwlrokliw.webp"
  },
  "/img/galleries/gal2/rc86yleqy1je4acxpzdz.webp": {
    "type": "image/webp",
    "etag": "\"167e2-1R6rogClvymUEOW16DthbqirDY8\"",
    "mtime": "2023-12-04T10:27:39.318Z",
    "size": 92130,
    "path": "../public/img/galleries/gal2/rc86yleqy1je4acxpzdz.webp"
  },
  "/img/galleries/gal2/s7w7xultshxmymnfzden.webp": {
    "type": "image/webp",
    "etag": "\"16ef2-Wx0IqmZ3Wx14occiWwV90wal9SM\"",
    "mtime": "2023-12-04T10:27:39.319Z",
    "size": 93938,
    "path": "../public/img/galleries/gal2/s7w7xultshxmymnfzden.webp"
  },
  "/img/galleries/gal2/t1tb1gun1tuevsjto5n8.webp": {
    "type": "image/webp",
    "etag": "\"3705a-1eMQxdinJtY8fpqy1VnuNTmgjfs\"",
    "mtime": "2023-12-04T10:27:39.321Z",
    "size": 225370,
    "path": "../public/img/galleries/gal2/t1tb1gun1tuevsjto5n8.webp"
  },
  "/img/galleries/gal2/vkui6m6fdat4dc76l0os.webp": {
    "type": "image/webp",
    "etag": "\"3636-H8B/iFFmLuQIHTY2nfA2ejxJuAE\"",
    "mtime": "2023-12-04T10:27:39.321Z",
    "size": 13878,
    "path": "../public/img/galleries/gal2/vkui6m6fdat4dc76l0os.webp"
  },
  "/img/galleries/gal2/y4k05bqfltdydkhpsi9x.webp": {
    "type": "image/webp",
    "etag": "\"49a8-Oy9q2vjm1qeuQh8mfrrXO1l/akI\"",
    "mtime": "2023-12-04T10:27:39.321Z",
    "size": 18856,
    "path": "../public/img/galleries/gal2/y4k05bqfltdydkhpsi9x.webp"
  },
  "/img/galleries/gal2/yhqwepbuh0ocx1uzwbay.webp": {
    "type": "image/webp",
    "etag": "\"319a4-xh2PgvXf8dMKyMBYvF3b2cJ570c\"",
    "mtime": "2023-12-04T10:27:39.322Z",
    "size": 203172,
    "path": "../public/img/galleries/gal2/yhqwepbuh0ocx1uzwbay.webp"
  },
  "/img/galleries/gal2/z28qf5kigddbm7euei3j.webp": {
    "type": "image/webp",
    "etag": "\"3a60a-iHOAYbHyFQcNhGGAjNe5Bjva4b4\"",
    "mtime": "2023-12-04T10:27:39.323Z",
    "size": 239114,
    "path": "../public/img/galleries/gal2/z28qf5kigddbm7euei3j.webp"
  },
  "/img/galleries/gal2/z76ibuwoor9bfmajacol.webp": {
    "type": "image/webp",
    "etag": "\"29ab6-Ypkj+3kYJ1BgL0/zWvmk8qeCSzg\"",
    "mtime": "2023-12-04T10:27:39.325Z",
    "size": 170678,
    "path": "../public/img/galleries/gal2/z76ibuwoor9bfmajacol.webp"
  },
  "/img/galleries/gal2/zakauqibonlxhbctioho.webp": {
    "type": "image/webp",
    "etag": "\"58198-CzR5HeDUIZt2joxwPVlCR6m3oTg\"",
    "mtime": "2023-12-04T10:27:39.326Z",
    "size": 360856,
    "path": "../public/img/galleries/gal2/zakauqibonlxhbctioho.webp"
  },
  "/img/galleries/gal2/_46A0003.jpg": {
    "type": "image/jpeg",
    "etag": "\"b66cb-mQjwvdxx1kARxttb7CQ0ATz877w\"",
    "mtime": "2023-12-04T10:27:39.136Z",
    "size": 747211,
    "path": "../public/img/galleries/gal2/_46A0003.jpg"
  },
  "/img/galleries/gal2/_46A0038.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e4b35-vRM1lZrgf0j5KzMQ9l1WueAf0CU\"",
    "mtime": "2023-12-04T10:27:39.163Z",
    "size": 4082485,
    "path": "../public/img/galleries/gal2/_46A0038.jpg"
  },
  "/img/galleries/gal2/_46A0050.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e6671-yeC4hIihTSrtxgbHeADXJ9JVCDo\"",
    "mtime": "2023-12-04T10:27:39.179Z",
    "size": 1992305,
    "path": "../public/img/galleries/gal2/_46A0050.jpg"
  },
  "/img/galleries/gal2/_46A0108.jpg": {
    "type": "image/jpeg",
    "etag": "\"1491cf-42OvnPchwgLQlxm/4jOE1Yzgg1A\"",
    "mtime": "2023-12-04T10:27:39.189Z",
    "size": 1348047,
    "path": "../public/img/galleries/gal2/_46A0108.jpg"
  },
  "/img/galleries/gal2/_46A0119.jpg": {
    "type": "image/jpeg",
    "etag": "\"17cbbe-dAdvOTKROqw8VakjaRIcNLjRYWU\"",
    "mtime": "2023-12-04T10:27:39.202Z",
    "size": 1559486,
    "path": "../public/img/galleries/gal2/_46A0119.jpg"
  },
  "/img/galleries/gal2/_46A0133.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8467-Nr7iGIELZ50vgq7047E1hONMJA0\"",
    "mtime": "2023-12-04T10:27:39.228Z",
    "size": 4162663,
    "path": "../public/img/galleries/gal2/_46A0133.jpg"
  },
  "/img/galleries/gal2/_46A0149.jpg": {
    "type": "image/jpeg",
    "etag": "\"37e3c6-yFZ6CtsDsEMYle+brlGV0BMb0wA\"",
    "mtime": "2023-12-04T10:27:39.245Z",
    "size": 3662790,
    "path": "../public/img/galleries/gal2/_46A0149.jpg"
  },
  "/img/galleries/gal2/_46A0155-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"123836-0v7Gsjdhidf35wsbgD3AP1UDPV4\"",
    "mtime": "2023-12-04T10:27:39.253Z",
    "size": 1194038,
    "path": "../public/img/galleries/gal2/_46A0155-2.jpg"
  },
  "/img/galleries/gal2/_46A0155.jpg": {
    "type": "image/jpeg",
    "etag": "\"1040a3-TlHjGrTcOdz8duJg1jyxDxZN3yU\"",
    "mtime": "2023-12-04T10:27:39.259Z",
    "size": 1065123,
    "path": "../public/img/galleries/gal2/_46A0155.jpg"
  },
  "/img/galleries/gal2/_46A0156.jpg": {
    "type": "image/jpeg",
    "etag": "\"d88c0-7jrXkl4i5OeOW7mMz7mdu9OKo/4\"",
    "mtime": "2023-12-04T10:27:39.266Z",
    "size": 886976,
    "path": "../public/img/galleries/gal2/_46A0156.jpg"
  },
  "/img/galleries/gal2/_46A0936.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b546f-KqVeFOp+S0OzSSdr2wAOl0eloOw\"",
    "mtime": "2023-12-04T10:27:39.280Z",
    "size": 3888239,
    "path": "../public/img/galleries/gal2/_46A0936.jpg"
  },
  "/img/galleries/gal2/_46A1189.jpg": {
    "type": "image/jpeg",
    "etag": "\"4515ed-vJRvrG6BqNzh0IJMn/3ky+iV6fU\"",
    "mtime": "2023-12-04T10:27:39.297Z",
    "size": 4527597,
    "path": "../public/img/galleries/gal2/_46A1189.jpg"
  },
  "/img/galleries/gal1/146A0108.webp": {
    "type": "image/webp",
    "etag": "\"2809fe-mBj98YKat/o0yIs7cvMOnOfMaUI\"",
    "mtime": "2023-12-04T10:27:38.678Z",
    "size": 2623998,
    "path": "../public/img/galleries/gal1/146A0108.webp"
  },
  "/img/galleries/gal1/afwjp6wytar25uidu64e.webp": {
    "type": "image/webp",
    "etag": "\"34b84-IGz57xt0yYLlxr9rx/kqKinIZDk\"",
    "mtime": "2023-12-04T10:27:38.824Z",
    "size": 215940,
    "path": "../public/img/galleries/gal1/afwjp6wytar25uidu64e.webp"
  },
  "/img/galleries/gal1/ajlfdemaupqqsd4j8ccw.webp": {
    "type": "image/webp",
    "etag": "\"63480-AJ5HSdJ42XPqe4GozSeLneWyDIc\"",
    "mtime": "2023-12-04T10:27:38.825Z",
    "size": 406656,
    "path": "../public/img/galleries/gal1/ajlfdemaupqqsd4j8ccw.webp"
  },
  "/img/galleries/gal1/aqe1lvyk7lykqunhefbo.webp": {
    "type": "image/webp",
    "etag": "\"1b08c-mrffarPNHdB4AYd0jNabHdOyON8\"",
    "mtime": "2023-12-04T10:27:38.826Z",
    "size": 110732,
    "path": "../public/img/galleries/gal1/aqe1lvyk7lykqunhefbo.webp"
  },
  "/img/galleries/gal1/bgzdr1tp4sufw79ppdjn.webp": {
    "type": "image/webp",
    "etag": "\"efd2-Mk/yvKtoTk1jq217LQDZeOTe7Vc\"",
    "mtime": "2023-12-04T10:27:38.827Z",
    "size": 61394,
    "path": "../public/img/galleries/gal1/bgzdr1tp4sufw79ppdjn.webp"
  },
  "/img/galleries/gal1/cegxhw5so9j2ytegwwkj.webp": {
    "type": "image/webp",
    "etag": "\"11062-oaYb53TUN7bRciyKvnrPnKOWIQA\"",
    "mtime": "2023-12-04T10:27:38.827Z",
    "size": 69730,
    "path": "../public/img/galleries/gal1/cegxhw5so9j2ytegwwkj.webp"
  },
  "/img/galleries/gal1/dfgp7w7z2vj52ne4nl7r.webp": {
    "type": "image/webp",
    "etag": "\"120d8-WVGWCPENd3CP2KlXgZ9P+DdDZ7w\"",
    "mtime": "2023-12-04T10:27:38.828Z",
    "size": 73944,
    "path": "../public/img/galleries/gal1/dfgp7w7z2vj52ne4nl7r.webp"
  },
  "/img/galleries/gal1/ffpqd8xd14rafd4wknrw.webp": {
    "type": "image/webp",
    "etag": "\"2fc1c-71urfPlR/y9wfUZzBOfAdZA4Ujo\"",
    "mtime": "2023-12-04T10:27:38.829Z",
    "size": 195612,
    "path": "../public/img/galleries/gal1/ffpqd8xd14rafd4wknrw.webp"
  },
  "/img/galleries/gal1/fzzpzq1zfvvpdkpivemr.webp": {
    "type": "image/webp",
    "etag": "\"1c108-pzVLNq1/YSB4CJABaMmOk1pz2u4\"",
    "mtime": "2023-12-04T10:27:38.829Z",
    "size": 114952,
    "path": "../public/img/galleries/gal1/fzzpzq1zfvvpdkpivemr.webp"
  },
  "/img/galleries/gal1/g7zwbsf3sp5vqjborfzr.webp": {
    "type": "image/webp",
    "etag": "\"12b2a-RcxZQjDo4fWiZeXeB+w3NLk6z10\"",
    "mtime": "2023-12-04T10:27:38.830Z",
    "size": 76586,
    "path": "../public/img/galleries/gal1/g7zwbsf3sp5vqjborfzr.webp"
  },
  "/img/galleries/gal1/hzbmdxmo3zgmnhzagna5.webp": {
    "type": "image/webp",
    "etag": "\"22eda-9Jp1YX67g61VXi+93yAXea+0aVc\"",
    "mtime": "2023-12-04T10:27:38.832Z",
    "size": 143066,
    "path": "../public/img/galleries/gal1/hzbmdxmo3zgmnhzagna5.webp"
  },
  "/img/galleries/gal1/inha3cpx3b8nketuwleb.webp": {
    "type": "image/webp",
    "etag": "\"357cc-r1QKI2wklyn6v7K3vRe4qWh0cqo\"",
    "mtime": "2023-12-04T10:27:38.834Z",
    "size": 219084,
    "path": "../public/img/galleries/gal1/inha3cpx3b8nketuwleb.webp"
  },
  "/img/galleries/gal1/jdhf4fj2law6lrlfojwc.webp": {
    "type": "image/webp",
    "etag": "\"3997a-eMo0psTpVK9tT0dq3V51Ez9OMOI\"",
    "mtime": "2023-12-04T10:27:38.835Z",
    "size": 235898,
    "path": "../public/img/galleries/gal1/jdhf4fj2law6lrlfojwc.webp"
  },
  "/img/galleries/gal1/jglwqd81bpxinfuthirx.webp": {
    "type": "image/webp",
    "etag": "\"2f200-9Fud4VAB+fdkCehOjiFFOTPhPb4\"",
    "mtime": "2023-12-04T10:27:38.836Z",
    "size": 193024,
    "path": "../public/img/galleries/gal1/jglwqd81bpxinfuthirx.webp"
  },
  "/img/galleries/gal1/lquy5kadm1b9xgrwyxvh.webp": {
    "type": "image/webp",
    "etag": "\"e94c-H8g/MNqYfYuA0xyGTakz+pZPyjo\"",
    "mtime": "2023-12-04T10:27:38.837Z",
    "size": 59724,
    "path": "../public/img/galleries/gal1/lquy5kadm1b9xgrwyxvh.webp"
  },
  "/img/galleries/gal1/rruzp7fgm2ear7i1ts4w.webp": {
    "type": "image/webp",
    "etag": "\"366a2-jWkpwbeXz3AugO+lMoMD5rrNfXs\"",
    "mtime": "2023-12-04T10:27:38.838Z",
    "size": 222882,
    "path": "../public/img/galleries/gal1/rruzp7fgm2ear7i1ts4w.webp"
  },
  "/img/galleries/gal1/siia2epwcgkevsrbsqcl.webp": {
    "type": "image/webp",
    "etag": "\"c00a-Bc8GE4Y9A3QeO79ZMcvCD5QqJm8\"",
    "mtime": "2023-12-04T10:27:38.838Z",
    "size": 49162,
    "path": "../public/img/galleries/gal1/siia2epwcgkevsrbsqcl.webp"
  },
  "/img/galleries/gal1/untitled-166.webp": {
    "type": "image/webp",
    "etag": "\"60f4c-IG7ZNIW1CzAinJ5fP1CJjLjs2Qg\"",
    "mtime": "2023-12-04T10:27:38.841Z",
    "size": 397132,
    "path": "../public/img/galleries/gal1/untitled-166.webp"
  },
  "/img/galleries/gal1/vhiepieyevg2moptuds3.webp": {
    "type": "image/webp",
    "etag": "\"31ed0-ZTmKOP2TlHvVqsl6fwWF23l5Fo4\"",
    "mtime": "2023-12-04T10:27:38.843Z",
    "size": 204496,
    "path": "../public/img/galleries/gal1/vhiepieyevg2moptuds3.webp"
  },
  "/img/galleries/gal1/vrpfzu6oluqmgdpn0o31.webp": {
    "type": "image/webp",
    "etag": "\"faf8-jrPRLvg+2G38qtDVDdEAERpM1lE\"",
    "mtime": "2023-12-04T10:27:38.844Z",
    "size": 64248,
    "path": "../public/img/galleries/gal1/vrpfzu6oluqmgdpn0o31.webp"
  },
  "/img/galleries/gal1/walvvts0h6dvumeulgug.webp": {
    "type": "image/webp",
    "etag": "\"2cb9e-FbItdAr1J2txzW1G2JAPgaCo6S4\"",
    "mtime": "2023-12-04T10:27:38.845Z",
    "size": 183198,
    "path": "../public/img/galleries/gal1/walvvts0h6dvumeulgug.webp"
  },
  "/img/galleries/gal1/wdksnzvw0seicareme7r.webp": {
    "type": "image/webp",
    "etag": "\"14f14-9cTkx0hMZcDBi876nKVO4539QMM\"",
    "mtime": "2023-12-04T10:27:38.845Z",
    "size": 85780,
    "path": "../public/img/galleries/gal1/wdksnzvw0seicareme7r.webp"
  },
  "/img/galleries/gal1/wfceyqzygvhezdhikqbs.webp": {
    "type": "image/webp",
    "etag": "\"1c72c-E5YQ/LHwdvXKtUIAs3qhWR0XEBU\"",
    "mtime": "2023-12-04T10:27:38.846Z",
    "size": 116524,
    "path": "../public/img/galleries/gal1/wfceyqzygvhezdhikqbs.webp"
  },
  "/img/galleries/gal1/wml7eti38naufva0dave.webp": {
    "type": "image/webp",
    "etag": "\"18988-13NX3RC99asF2E0x4650u6sdjJg\"",
    "mtime": "2023-12-04T10:27:38.847Z",
    "size": 100744,
    "path": "../public/img/galleries/gal1/wml7eti38naufva0dave.webp"
  },
  "/img/galleries/gal1/x19keffub3tfiz86ch2b.webp": {
    "type": "image/webp",
    "etag": "\"13088-0z6Ck4eRmdWYkeSxkn3WXSFBq3w\"",
    "mtime": "2023-12-04T10:27:38.848Z",
    "size": 77960,
    "path": "../public/img/galleries/gal1/x19keffub3tfiz86ch2b.webp"
  },
  "/img/galleries/gal1/xb7lzggrgi9n3rjd55bd.webp": {
    "type": "image/webp",
    "etag": "\"15344-kOFzoSFYX2BBSPTrYfKsePUuMGM\"",
    "mtime": "2023-12-04T10:27:38.849Z",
    "size": 86852,
    "path": "../public/img/galleries/gal1/xb7lzggrgi9n3rjd55bd.webp"
  },
  "/img/galleries/gal1/z1mwk9k3vat5oh6g3r80.webp": {
    "type": "image/webp",
    "etag": "\"22eda-9Jp1YX67g61VXi+93yAXea+0aVc\"",
    "mtime": "2023-12-04T10:27:38.850Z",
    "size": 143066,
    "path": "../public/img/galleries/gal1/z1mwk9k3vat5oh6g3r80.webp"
  },
  "/img/galleries/gal1/_46A0089-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"167701-KN+GzepaGiNLcWuOr5A//2vxrUU\"",
    "mtime": "2023-12-04T10:27:38.683Z",
    "size": 1472257,
    "path": "../public/img/galleries/gal1/_46A0089-Edit.jpg"
  },
  "/img/galleries/gal1/_46A0127-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"1287d6-tJL6CjzQoGR5M1vvqshN+fdf91M\"",
    "mtime": "2023-12-04T10:27:38.687Z",
    "size": 1214422,
    "path": "../public/img/galleries/gal1/_46A0127-Edit.jpg"
  },
  "/img/galleries/gal1/_46A0198.jpg": {
    "type": "image/jpeg",
    "etag": "\"12f7a3-1p9fDYczMHGg7D2AJ+czYmqttOI\"",
    "mtime": "2023-12-04T10:27:38.691Z",
    "size": 1243043,
    "path": "../public/img/galleries/gal1/_46A0198.jpg"
  },
  "/img/galleries/gal1/_46A0214.jpg": {
    "type": "image/jpeg",
    "etag": "\"1277cc-GK/cK1j4oTy6H2XgahWSuzJ6D8Y\"",
    "mtime": "2023-12-04T10:27:38.697Z",
    "size": 1210316,
    "path": "../public/img/galleries/gal1/_46A0214.jpg"
  },
  "/img/galleries/gal1/_46A0251.webp": {
    "type": "image/webp",
    "etag": "\"a5070-URf8/Qa8tRBI63GgdYpkxJZmWjs\"",
    "mtime": "2023-12-04T10:27:38.700Z",
    "size": 675952,
    "path": "../public/img/galleries/gal1/_46A0251.webp"
  },
  "/img/galleries/gal1/_46A02521.webp": {
    "type": "image/webp",
    "etag": "\"76bd8-use22VkqzBVavZgkLAUHW8/VlAk\"",
    "mtime": "2023-12-04T10:27:38.702Z",
    "size": 486360,
    "path": "../public/img/galleries/gal1/_46A02521.webp"
  },
  "/img/galleries/gal1/_46A0253.webp": {
    "type": "image/webp",
    "etag": "\"eddaa-OvyiGhpJmF1TTK8/mNlGZQvarbk\"",
    "mtime": "2023-12-04T10:27:38.705Z",
    "size": 974250,
    "path": "../public/img/galleries/gal1/_46A0253.webp"
  },
  "/img/galleries/gal1/_46A0268.webp": {
    "type": "image/webp",
    "etag": "\"9649c-cKBDm+AMmsVPDrnOaK/YBoR9RT4\"",
    "mtime": "2023-12-04T10:27:38.708Z",
    "size": 615580,
    "path": "../public/img/galleries/gal1/_46A0268.webp"
  },
  "/img/galleries/gal1/_46A0269.webp": {
    "type": "image/webp",
    "etag": "\"2a4076-UOtPGvxBjtUH8YOqABwM9cw2cH4\"",
    "mtime": "2023-12-04T10:27:38.719Z",
    "size": 2769014,
    "path": "../public/img/galleries/gal1/_46A0269.webp"
  },
  "/img/galleries/gal1/_46A0270.webp": {
    "type": "image/webp",
    "etag": "\"a94fc-DT93oQoDU3EPx9bb1ZUTZaCuncg\"",
    "mtime": "2023-12-04T10:27:38.722Z",
    "size": 693500,
    "path": "../public/img/galleries/gal1/_46A0270.webp"
  },
  "/img/galleries/gal1/_46A0271.webp": {
    "type": "image/webp",
    "etag": "\"b89e0-vp8I/4CqpyKa7Nm+n354aPeb25g\"",
    "mtime": "2023-12-04T10:27:38.726Z",
    "size": 756192,
    "path": "../public/img/galleries/gal1/_46A0271.webp"
  },
  "/img/galleries/gal1/_46A0272.webp": {
    "type": "image/webp",
    "etag": "\"7bf7e-WwP0VuvYQpgOhQzrXXFm8yAW9U8\"",
    "mtime": "2023-12-04T10:27:38.729Z",
    "size": 507774,
    "path": "../public/img/galleries/gal1/_46A0272.webp"
  },
  "/img/galleries/gal1/_46A0273.webp": {
    "type": "image/webp",
    "etag": "\"c086a-m8c4a3mwrkUJxPLoNyllGzy87e0\"",
    "mtime": "2023-12-04T10:27:38.732Z",
    "size": 788586,
    "path": "../public/img/galleries/gal1/_46A0273.webp"
  },
  "/img/galleries/gal1/_46A0475.jpg": {
    "type": "image/jpeg",
    "etag": "\"111263-6L5c1A/29LfNCq1qMA/aByAB6mA\"",
    "mtime": "2023-12-04T10:27:38.739Z",
    "size": 1118819,
    "path": "../public/img/galleries/gal1/_46A0475.jpg"
  },
  "/img/galleries/gal1/_46A0490.jpg": {
    "type": "image/jpeg",
    "etag": "\"1bb71d-f6460rHbMNcnNNEx7CNRBXE/+Cg\"",
    "mtime": "2023-12-04T10:27:38.751Z",
    "size": 1816349,
    "path": "../public/img/galleries/gal1/_46A0490.jpg"
  },
  "/img/galleries/gal1/_46A1074.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cfcdc-At/MjmWFMBWqoRgV9titCXNjFcU\"",
    "mtime": "2023-12-04T10:27:38.765Z",
    "size": 1899740,
    "path": "../public/img/galleries/gal1/_46A1074.jpg"
  },
  "/img/galleries/gal1/_46A1075.jpg": {
    "type": "image/jpeg",
    "etag": "\"21bb85-rDmc4tPDnTGCECX1U1GVQzJL4Uk\"",
    "mtime": "2023-12-04T10:27:38.783Z",
    "size": 2210693,
    "path": "../public/img/galleries/gal1/_46A1075.jpg"
  },
  "/img/galleries/gal1/_46A1176.jpg": {
    "type": "image/jpeg",
    "etag": "\"162e41-4UJ1NhvzhWpTp26Qzrtin9XeM5c\"",
    "mtime": "2023-12-04T10:27:38.793Z",
    "size": 1453633,
    "path": "../public/img/galleries/gal1/_46A1176.jpg"
  },
  "/img/galleries/gal1/_46A1243.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a0340-V0RN4xksfD5OjKnvAHiepboGRdM\"",
    "mtime": "2023-12-04T10:27:38.809Z",
    "size": 2753344,
    "path": "../public/img/galleries/gal1/_46A1243.jpg"
  },
  "/img/galleries/gal1/_46A1335-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"187823-bf0mZJbWnwcdyDP12LQG6xh8yWs\"",
    "mtime": "2023-12-04T10:27:38.819Z",
    "size": 1603619,
    "path": "../public/img/galleries/gal1/_46A1335-Edit.jpg"
  },
  "/img/galleries/gal1/_46A1383.jpg": {
    "type": "image/jpeg",
    "etag": "\"d958e-vMEE7X+NZzrqSX2aM/+Anl6aats\"",
    "mtime": "2023-12-04T10:27:38.822Z",
    "size": 890254,
    "path": "../public/img/galleries/gal1/_46A1383.jpg"
  },
  "/img/galleries/gal4/ashxosqjkvnf9mhb63oq.webp": {
    "type": "image/webp",
    "etag": "\"c2c0-XLsF9a7KkAd4sHRYn19rQxecDqM\"",
    "mtime": "2023-12-04T10:27:40.204Z",
    "size": 49856,
    "path": "../public/img/galleries/gal4/ashxosqjkvnf9mhb63oq.webp"
  },
  "/img/galleries/gal4/botez oliver-13.jpg": {
    "type": "image/jpeg",
    "etag": "\"d16d8-Z1KwW2IC6FaVUDFYSwlYtkopQf0\"",
    "mtime": "2023-12-04T10:27:40.209Z",
    "size": 857816,
    "path": "../public/img/galleries/gal4/botez oliver-13.jpg"
  },
  "/img/galleries/gal4/ddyk7bypjnp1r1riuxyi.webp": {
    "type": "image/webp",
    "etag": "\"55f50-Rrll15G694TzWKBFyOHfFexmqP4\"",
    "mtime": "2023-12-04T10:27:40.211Z",
    "size": 352080,
    "path": "../public/img/galleries/gal4/ddyk7bypjnp1r1riuxyi.webp"
  },
  "/img/galleries/gal4/f1bzhp2skn7wbxzglkzy.webp": {
    "type": "image/webp",
    "etag": "\"f8d2-tF6dw5JnXSWuEwzKnpgRfWWX4Jw\"",
    "mtime": "2023-12-04T10:27:40.212Z",
    "size": 63698,
    "path": "../public/img/galleries/gal4/f1bzhp2skn7wbxzglkzy.webp"
  },
  "/img/galleries/gal4/fi9w2h9mfdh4wcqzy14w.webp": {
    "type": "image/webp",
    "etag": "\"34ab6-/Zm1JVk/p+88r8/4+qjpkGV6Ceg\"",
    "mtime": "2023-12-04T10:27:40.213Z",
    "size": 215734,
    "path": "../public/img/galleries/gal4/fi9w2h9mfdh4wcqzy14w.webp"
  },
  "/img/galleries/gal4/fuvrjkx3ygccc2h1tc8d.webp": {
    "type": "image/webp",
    "etag": "\"21250-E2UEOTPbjNqj2/nQ7D5jGjq5E1k\"",
    "mtime": "2023-12-04T10:27:40.215Z",
    "size": 135760,
    "path": "../public/img/galleries/gal4/fuvrjkx3ygccc2h1tc8d.webp"
  },
  "/img/galleries/gal4/hflk57wpcytp1bns1qeo.webp": {
    "type": "image/webp",
    "etag": "\"19a2a-PXQvTcjZ5g6BSHOcx7R69qeDb+g\"",
    "mtime": "2023-12-04T10:27:40.216Z",
    "size": 105002,
    "path": "../public/img/galleries/gal4/hflk57wpcytp1bns1qeo.webp"
  },
  "/img/galleries/gal4/lj63qajwllwz0bvzb22d.webp": {
    "type": "image/webp",
    "etag": "\"278bc-YuIRolmcwv0a2irdtT25VL4NxNk\"",
    "mtime": "2023-12-04T10:27:40.217Z",
    "size": 161980,
    "path": "../public/img/galleries/gal4/lj63qajwllwz0bvzb22d.webp"
  },
  "/img/galleries/gal4/n2srtt6ncatxmcyyjzm2.webp": {
    "type": "image/webp",
    "etag": "\"10272-bRM18AonndupXXcQChhbfBq1RPU\"",
    "mtime": "2023-12-04T10:27:40.217Z",
    "size": 66162,
    "path": "../public/img/galleries/gal4/n2srtt6ncatxmcyyjzm2.webp"
  },
  "/img/galleries/gal4/npptnzmcrf93j5myoeoe.webp": {
    "type": "image/webp",
    "etag": "\"22c4a-ZI2tR3sRxOYyineAF4ufiXxdii8\"",
    "mtime": "2023-12-04T10:27:40.218Z",
    "size": 142410,
    "path": "../public/img/galleries/gal4/npptnzmcrf93j5myoeoe.webp"
  },
  "/img/galleries/gal4/ntevnw6pwkrfhnx6puzf.webp": {
    "type": "image/webp",
    "etag": "\"1bad2-7EcD9OIP0yu0uGn95Y3iMyUOLO4\"",
    "mtime": "2023-12-04T10:27:40.219Z",
    "size": 113362,
    "path": "../public/img/galleries/gal4/ntevnw6pwkrfhnx6puzf.webp"
  },
  "/img/galleries/gal4/nyjpivakx6pyf7ix7wtx.webp": {
    "type": "image/webp",
    "etag": "\"23fc6-Sz28ILkw6UVcsP8nHr6UQWtWFNs\"",
    "mtime": "2023-12-04T10:27:40.220Z",
    "size": 147398,
    "path": "../public/img/galleries/gal4/nyjpivakx6pyf7ix7wtx.webp"
  },
  "/img/galleries/gal4/om8plclsoebaokukdf06.webp": {
    "type": "image/webp",
    "etag": "\"3df06-zMC4Sz1hHuDeF8/6EYMInPi+gPE\"",
    "mtime": "2023-12-04T10:27:40.222Z",
    "size": 253702,
    "path": "../public/img/galleries/gal4/om8plclsoebaokukdf06.webp"
  },
  "/img/galleries/gal4/ovc8aramnzatmc5mgh4p.webp": {
    "type": "image/webp",
    "etag": "\"14d48-TRcGUlb1sDShZXn2pZAorAJYFd4\"",
    "mtime": "2023-12-04T10:27:40.222Z",
    "size": 85320,
    "path": "../public/img/galleries/gal4/ovc8aramnzatmc5mgh4p.webp"
  },
  "/img/galleries/gal4/pxp8blwtve1bbdagmjhg.webp": {
    "type": "image/webp",
    "etag": "\"38a72-QRD1GwkimG1kEmVGySHpdmzkX9c\"",
    "mtime": "2023-12-04T10:27:40.224Z",
    "size": 232050,
    "path": "../public/img/galleries/gal4/pxp8blwtve1bbdagmjhg.webp"
  },
  "/img/galleries/gal4/qnudscm7az9tywywdpm8.webp": {
    "type": "image/webp",
    "etag": "\"3e642-JWVLb32BxYGtMRBQe84LpUBFKRM\"",
    "mtime": "2023-12-04T10:27:40.225Z",
    "size": 255554,
    "path": "../public/img/galleries/gal4/qnudscm7az9tywywdpm8.webp"
  },
  "/img/galleries/gal4/sbrn3k76mzdy6xue8i2b.webp": {
    "type": "image/webp",
    "etag": "\"14484-2+tEU1RN+SghiVLayyu+u2aEzXM\"",
    "mtime": "2023-12-04T10:27:40.225Z",
    "size": 83076,
    "path": "../public/img/galleries/gal4/sbrn3k76mzdy6xue8i2b.webp"
  },
  "/img/galleries/gal4/sqcz3khdfjiwbpvmkt2e.webp": {
    "type": "image/webp",
    "etag": "\"3e3a2-hpu4Hd1BABt+e/1x4DrrjdaiX14\"",
    "mtime": "2023-12-04T10:27:40.227Z",
    "size": 254882,
    "path": "../public/img/galleries/gal4/sqcz3khdfjiwbpvmkt2e.webp"
  },
  "/img/galleries/gal4/tdwlbbhe57dvqdmtnkay.webp": {
    "type": "image/webp",
    "etag": "\"c7ac-+FYOrWO8lek/fd6ly4jC/VOSKZw\"",
    "mtime": "2023-12-04T10:27:40.227Z",
    "size": 51116,
    "path": "../public/img/galleries/gal4/tdwlbbhe57dvqdmtnkay.webp"
  },
  "/img/galleries/gal4/v9nqwaxjrjqrdtiiy2vy.webp": {
    "type": "image/webp",
    "etag": "\"48bb8-3rQyroVRbvMhC4UevuLSHJpZbhs\"",
    "mtime": "2023-12-04T10:27:40.229Z",
    "size": 297912,
    "path": "../public/img/galleries/gal4/v9nqwaxjrjqrdtiiy2vy.webp"
  },
  "/img/galleries/gal4/vid1cqbvgsahx82xdjqq.webp": {
    "type": "image/webp",
    "etag": "\"3dca2-NchOdXpw9Qf+P2VASD8h2nQayNY\"",
    "mtime": "2023-12-04T10:27:40.229Z",
    "size": 253090,
    "path": "../public/img/galleries/gal4/vid1cqbvgsahx82xdjqq.webp"
  },
  "/img/galleries/gal4/xawaevnkgxt0prh1yw1w.webp": {
    "type": "image/webp",
    "etag": "\"36d54-58FccTvkDSu8F1+Y+omOyVGkIgc\"",
    "mtime": "2023-12-04T10:27:40.231Z",
    "size": 224596,
    "path": "../public/img/galleries/gal4/xawaevnkgxt0prh1yw1w.webp"
  },
  "/img/galleries/gal4/xljwozpfazxnjj1hxrix.webp": {
    "type": "image/webp",
    "etag": "\"527b6-UdvVICTPv6k3nIr5PTgVebU/3Xc\"",
    "mtime": "2023-12-04T10:27:40.233Z",
    "size": 337846,
    "path": "../public/img/galleries/gal4/xljwozpfazxnjj1hxrix.webp"
  },
  "/img/galleries/gal4/yji36bcwubiud5ukzfxb.webp": {
    "type": "image/webp",
    "etag": "\"100dc-65IeAjdV/5cmar912Kn2pXG9FUk\"",
    "mtime": "2023-12-04T10:27:40.233Z",
    "size": 65756,
    "path": "../public/img/galleries/gal4/yji36bcwubiud5ukzfxb.webp"
  },
  "/img/galleries/gal4/zoyuetaowbucxedmtdb0.webp": {
    "type": "image/webp",
    "etag": "\"54530-Hzt7NfRxPFJIyUdT4S6Yf5eDTjA\"",
    "mtime": "2023-12-04T10:27:40.235Z",
    "size": 345392,
    "path": "../public/img/galleries/gal4/zoyuetaowbucxedmtdb0.webp"
  },
  "/img/galleries/gal4/_46A0167.jpg": {
    "type": "image/jpeg",
    "etag": "\"103e2c-OtbBwnHsCtS6ThLUMsioDypc/DM\"",
    "mtime": "2023-12-04T10:27:39.516Z",
    "size": 1064492,
    "path": "../public/img/galleries/gal4/_46A0167.jpg"
  },
  "/img/galleries/gal4/_46A0197-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"9171d4-o6CTfP4woGvpPO/pXthjuy3KCg8\"",
    "mtime": "2023-12-04T10:27:39.555Z",
    "size": 9531860,
    "path": "../public/img/galleries/gal4/_46A0197-Edit.jpg"
  },
  "/img/galleries/gal4/_46A0198-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"40d827-ODJ5upAUGFpNA+5Aravv96ZfiHs\"",
    "mtime": "2023-12-04T10:27:39.572Z",
    "size": 4249639,
    "path": "../public/img/galleries/gal4/_46A0198-Edit.jpg"
  },
  "/img/galleries/gal4/_46A0231.jpg": {
    "type": "image/jpeg",
    "etag": "\"f8622-RxoT4lh//MIZptIk3nX62IXsLro\"",
    "mtime": "2023-12-04T10:27:39.577Z",
    "size": 1017378,
    "path": "../public/img/galleries/gal4/_46A0231.jpg"
  },
  "/img/galleries/gal4/_46A0237.jpg": {
    "type": "image/jpeg",
    "etag": "\"9d8cce-UPDk/9L+kEwzGvsHIJFlKMa8NN8\"",
    "mtime": "2023-12-04T10:27:39.621Z",
    "size": 10325198,
    "path": "../public/img/galleries/gal4/_46A0237.jpg"
  },
  "/img/galleries/gal4/_46A0249.jpg": {
    "type": "image/jpeg",
    "etag": "\"1289c5-qYZN7R7dGipjf5D0LBly3vJouxo\"",
    "mtime": "2023-12-04T10:27:39.628Z",
    "size": 1214917,
    "path": "../public/img/galleries/gal4/_46A0249.jpg"
  },
  "/img/galleries/gal4/_46A0343.jpg": {
    "type": "image/jpeg",
    "etag": "\"810c7-M+E3yd9MOwgcEJf2S2HJ8glmsZI\"",
    "mtime": "2023-12-04T10:27:39.632Z",
    "size": 528583,
    "path": "../public/img/galleries/gal4/_46A0343.jpg"
  },
  "/img/galleries/gal4/_46A0582.jpg": {
    "type": "image/jpeg",
    "etag": "\"b4a1cc-dEpmRg0+cmVW3A9JRrKgczGKPJo\"",
    "mtime": "2023-12-04T10:27:39.685Z",
    "size": 11837900,
    "path": "../public/img/galleries/gal4/_46A0582.jpg"
  },
  "/img/galleries/gal4/_46A0583-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"407cc2-iK1xCZ9p8QBPvLCQOZa5gVYS4VU\"",
    "mtime": "2023-12-04T10:27:39.702Z",
    "size": 4226242,
    "path": "../public/img/galleries/gal4/_46A0583-2.jpg"
  },
  "/img/galleries/gal4/_46A0583.jpg": {
    "type": "image/jpeg",
    "etag": "\"7df0fb-BmlZ+xM9SzZ+j80gcH53Q/CPUE0\"",
    "mtime": "2023-12-04T10:27:39.733Z",
    "size": 8253691,
    "path": "../public/img/galleries/gal4/_46A0583.jpg"
  },
  "/img/galleries/gal4/_46A0595.jpg": {
    "type": "image/jpeg",
    "etag": "\"750aa9-dluCwfVSMphdjrNY0XYJFQ8pA6U\"",
    "mtime": "2023-12-04T10:27:39.762Z",
    "size": 7670441,
    "path": "../public/img/galleries/gal4/_46A0595.jpg"
  },
  "/img/galleries/gal4/_46A0605.jpg": {
    "type": "image/jpeg",
    "etag": "\"ce4f9e-+6QJNEjJaAzTrb+Wk1rraMBDmHc\"",
    "mtime": "2023-12-04T10:27:39.814Z",
    "size": 13520798,
    "path": "../public/img/galleries/gal4/_46A0605.jpg"
  },
  "/img/galleries/gal4/_46A0636.jpg": {
    "type": "image/jpeg",
    "etag": "\"daeab3-3C1HGc92x6xj/98urxhDDTn0IsY\"",
    "mtime": "2023-12-04T10:27:39.866Z",
    "size": 14346931,
    "path": "../public/img/galleries/gal4/_46A0636.jpg"
  },
  "/img/galleries/gal4/_46A0642.jpg": {
    "type": "image/jpeg",
    "etag": "\"d24bf8-DqiASj+Uan1hvfNPELNTI83cPOE\"",
    "mtime": "2023-12-04T10:27:39.915Z",
    "size": 13782008,
    "path": "../public/img/galleries/gal4/_46A0642.jpg"
  },
  "/img/galleries/gal4/_46A0664.jpg": {
    "type": "image/jpeg",
    "etag": "\"1174932-tEouIfFyJlrm5VL0/q/4ScH4tFE\"",
    "mtime": "2023-12-04T10:27:39.986Z",
    "size": 18303282,
    "path": "../public/img/galleries/gal4/_46A0664.jpg"
  },
  "/img/galleries/gal4/_46A0675.jpg": {
    "type": "image/jpeg",
    "etag": "\"b090a1-1f+KlyHGV3DH87Lnm365MOBVct8\"",
    "mtime": "2023-12-04T10:27:40.028Z",
    "size": 11571361,
    "path": "../public/img/galleries/gal4/_46A0675.jpg"
  },
  "/img/galleries/gal4/_46A0721.jpg": {
    "type": "image/jpeg",
    "etag": "\"742ac7-6oHuuhUh5T4OSuawz4bjggKj11E\"",
    "mtime": "2023-12-04T10:27:40.059Z",
    "size": 7613127,
    "path": "../public/img/galleries/gal4/_46A0721.jpg"
  },
  "/img/galleries/gal4/_46A0729.jpg": {
    "type": "image/jpeg",
    "etag": "\"95f361-Ktx2McVGnz57Hkeg9WjiZGnZOqU\"",
    "mtime": "2023-12-04T10:27:40.106Z",
    "size": 9827169,
    "path": "../public/img/galleries/gal4/_46A0729.jpg"
  },
  "/img/galleries/gal4/_46A0759.jpg": {
    "type": "image/jpeg",
    "etag": "\"6f9664-+nxBYhW69qd0+Tj6aWMz/zu1ACg\"",
    "mtime": "2023-12-04T10:27:40.133Z",
    "size": 7312996,
    "path": "../public/img/galleries/gal4/_46A0759.jpg"
  },
  "/img/galleries/gal4/_46A0799.jpg": {
    "type": "image/jpeg",
    "etag": "\"8b36f2-/rbYTt9+lzA/rg+rZdUpObDaE4Y\"",
    "mtime": "2023-12-04T10:27:40.167Z",
    "size": 9123570,
    "path": "../public/img/galleries/gal4/_46A0799.jpg"
  },
  "/img/galleries/gal4/_46A0813.jpg": {
    "type": "image/jpeg",
    "etag": "\"864373-1meMafFX44KIC1xeqnEi56etzN0\"",
    "mtime": "2023-12-04T10:27:40.203Z",
    "size": 8799091,
    "path": "../public/img/galleries/gal4/_46A0813.jpg"
  },
  "/img/galleries/gal6/146A0457.jpg": {
    "type": "image/jpeg",
    "etag": "\"1469dc-lhpEmLOL5QO0n261lLOBPd/HslY\"",
    "mtime": "2023-12-04T10:27:40.614Z",
    "size": 1337820,
    "path": "../public/img/galleries/gal6/146A0457.jpg"
  },
  "/img/galleries/gal6/146A0981.jpg": {
    "type": "image/jpeg",
    "etag": "\"282947-/UdtnQT8pdJiGr32yZz9Nxj9Hm8\"",
    "mtime": "2023-12-04T10:27:40.624Z",
    "size": 2632007,
    "path": "../public/img/galleries/gal6/146A0981.jpg"
  },
  "/img/galleries/gal6/146A1048.jpg": {
    "type": "image/jpeg",
    "etag": "\"23e4b3-Q2m/PdibjmkjjJ1q0RMdMWreZdI\"",
    "mtime": "2023-12-04T10:27:40.635Z",
    "size": 2352307,
    "path": "../public/img/galleries/gal6/146A1048.jpg"
  },
  "/img/galleries/gal6/146A1076.jpg": {
    "type": "image/jpeg",
    "etag": "\"25ca44-yZZuUoN8eO18gCALC3bmyHKAWcQ\"",
    "mtime": "2023-12-04T10:27:40.646Z",
    "size": 2476612,
    "path": "../public/img/galleries/gal6/146A1076.jpg"
  },
  "/img/galleries/gal6/IMG_0293.jpg": {
    "type": "image/jpeg",
    "etag": "\"66155-KDAm+3n6amvl8Aun+poeGtn0bmc\"",
    "mtime": "2023-12-04T10:27:40.649Z",
    "size": 418133,
    "path": "../public/img/galleries/gal6/IMG_0293.jpg"
  },
  "/img/galleries/gal6/IMG_0294-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"9b37a-cZ0buz54v5qt8gRA9VVRYolgJwo\"",
    "mtime": "2023-12-04T10:27:40.652Z",
    "size": 635770,
    "path": "../public/img/galleries/gal6/IMG_0294-Edit.jpg"
  },
  "/img/galleries/gal6/IMG_0319-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"35bef7-tx0oa5PEisljU2x1UvhDqGtgILo\"",
    "mtime": "2023-12-04T10:27:40.667Z",
    "size": 3522295,
    "path": "../public/img/galleries/gal6/IMG_0319-Edit.jpg"
  },
  "/img/galleries/gal6/IMG_0327-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2156b6-QEK3TSfOBNXLiMBO44TgPrKzcuY\"",
    "mtime": "2023-12-04T10:27:40.678Z",
    "size": 2184886,
    "path": "../public/img/galleries/gal6/IMG_0327-Edit.jpg"
  },
  "/img/galleries/gal6/IMG_0360.jpg": {
    "type": "image/jpeg",
    "etag": "\"f43ca-5Eor0Hg2FRq9tShWJbFSSlJjv9o\"",
    "mtime": "2023-12-04T10:27:40.684Z",
    "size": 1000394,
    "path": "../public/img/galleries/gal6/IMG_0360.jpg"
  },
  "/img/galleries/gal6/IMG_0379-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"42d86a-7UvTrC0yk/R4FxKP+WlxpoEOAh8\"",
    "mtime": "2023-12-04T10:27:40.703Z",
    "size": 4380778,
    "path": "../public/img/galleries/gal6/IMG_0379-Edit.jpg"
  },
  "/img/galleries/gal6/IMG_0421.jpg": {
    "type": "image/jpeg",
    "etag": "\"48df24-Ml9GNN3iZk3y5F6y8CuYEWIntaM\"",
    "mtime": "2023-12-04T10:27:40.721Z",
    "size": 4775716,
    "path": "../public/img/galleries/gal6/IMG_0421.jpg"
  },
  "/img/galleries/gal6/IMG_0571.jpg": {
    "type": "image/jpeg",
    "etag": "\"11b4f3-rZbgZI3mtVvpDdwq5F+pUnESX1E\"",
    "mtime": "2023-12-04T10:27:40.727Z",
    "size": 1160435,
    "path": "../public/img/galleries/gal6/IMG_0571.jpg"
  },
  "/img/galleries/gal6/IMG_1500.jpg": {
    "type": "image/jpeg",
    "etag": "\"129ee6-LL+9DnRBf66nlO4fCtRiXL+mVfo\"",
    "mtime": "2023-12-04T10:27:40.735Z",
    "size": 1220326,
    "path": "../public/img/galleries/gal6/IMG_1500.jpg"
  },
  "/img/galleries/gal6/IMG_1537.jpg": {
    "type": "image/jpeg",
    "etag": "\"2e473d-qsrj73WA5bbtm5/zmbWtlgkMnqw\"",
    "mtime": "2023-12-04T10:27:40.755Z",
    "size": 3032893,
    "path": "../public/img/galleries/gal6/IMG_1537.jpg"
  },
  "/img/galleries/gal6/IMG_1627.jpg": {
    "type": "image/jpeg",
    "etag": "\"551b48-PKkLNbQ8963uHE3mDr2A8LqVo4g\"",
    "mtime": "2023-12-04T10:27:40.794Z",
    "size": 5577544,
    "path": "../public/img/galleries/gal6/IMG_1627.jpg"
  },
  "/img/galleries/gal6/IMG_1633.jpg": {
    "type": "image/jpeg",
    "etag": "\"5a6be1-LvHrDSjYfV/TfiHPHPWMFx4qtlI\"",
    "mtime": "2023-12-04T10:27:40.823Z",
    "size": 5925857,
    "path": "../public/img/galleries/gal6/IMG_1633.jpg"
  },
  "/img/galleries/gal6/IMG_1642.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a332a-tA3LtLUK0OXnleWvQlHpNZaJAqk\"",
    "mtime": "2023-12-04T10:27:40.833Z",
    "size": 1717034,
    "path": "../public/img/galleries/gal6/IMG_1642.jpg"
  },
  "/img/galleries/gal6/IMG_2195-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af335-cSJ0Lue7JpXv30ZBwkUdA0S97pE\"",
    "mtime": "2023-12-04T10:27:40.840Z",
    "size": 1766197,
    "path": "../public/img/galleries/gal6/IMG_2195-Edit.jpg"
  },
  "/img/galleries/gal6/_46A0003.jpg": {
    "type": "image/jpeg",
    "etag": "\"b66cb-mQjwvdxx1kARxttb7CQ0ATz877w\"",
    "mtime": "2023-12-04T10:27:40.882Z",
    "size": 747211,
    "path": "../public/img/galleries/gal6/_46A0003.jpg"
  },
  "/img/galleries/gal6/_46A0051.jpg": {
    "type": "image/jpeg",
    "etag": "\"139ed-qJH9eCtiq5E2hwM9aTc3lEgADWM\"",
    "mtime": "2023-12-04T10:27:40.882Z",
    "size": 80365,
    "path": "../public/img/galleries/gal6/_46A0051.jpg"
  },
  "/img/galleries/gal6/_46A0108.jpg": {
    "type": "image/jpeg",
    "etag": "\"1491cf-42OvnPchwgLQlxm/4jOE1Yzgg1A\"",
    "mtime": "2023-12-04T10:27:40.888Z",
    "size": 1348047,
    "path": "../public/img/galleries/gal6/_46A0108.jpg"
  },
  "/img/galleries/gal6/_46A0125.JPG": {
    "type": "image/jpeg",
    "etag": "\"87a1d-jYgoiCgwkJNlAFpeSHU9ANPxM7w\"",
    "mtime": "2023-12-04T10:27:40.892Z",
    "size": 555549,
    "path": "../public/img/galleries/gal6/_46A0125.JPG"
  },
  "/img/galleries/gal6/_46A0133.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8467-Nr7iGIELZ50vgq7047E1hONMJA0\"",
    "mtime": "2023-12-04T10:27:40.906Z",
    "size": 4162663,
    "path": "../public/img/galleries/gal6/_46A0133.jpg"
  },
  "/img/galleries/gal6/_46A0142.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d511d-mXlN9WF42mOo6pdu0PqZyuA7q5Q\"",
    "mtime": "2023-12-04T10:27:40.925Z",
    "size": 5067037,
    "path": "../public/img/galleries/gal6/_46A0142.jpg"
  },
  "/img/galleries/gal6/_46A0250.jpg": {
    "type": "image/jpeg",
    "etag": "\"5cbc4d-S3lFj3dOsqSoFt4dEgakSYKaxe0\"",
    "mtime": "2023-12-04T10:27:40.955Z",
    "size": 6077517,
    "path": "../public/img/galleries/gal6/_46A0250.jpg"
  },
  "/img/galleries/gal6/_46A0252.jpg": {
    "type": "image/jpeg",
    "etag": "\"572ed1-uF5/aaJvfx4yBmX3heyQ3uy9O0U\"",
    "mtime": "2023-12-04T10:27:40.980Z",
    "size": 5713617,
    "path": "../public/img/galleries/gal6/_46A0252.jpg"
  },
  "/img/galleries/gal6/_46A0282-Pano.jpg": {
    "type": "image/jpeg",
    "etag": "\"742dc9-IF8taRRswUAk7rS6cqw9ihyI/mI\"",
    "mtime": "2023-12-04T10:27:41.010Z",
    "size": 7613897,
    "path": "../public/img/galleries/gal6/_46A0282-Pano.jpg"
  },
  "/img/galleries/gal6/_46A0351.jpg": {
    "type": "image/jpeg",
    "etag": "\"1abce9-CwRstYwWIZTiU9lvkJfOrtgEbSo\"",
    "mtime": "2023-12-04T10:27:41.022Z",
    "size": 1752297,
    "path": "../public/img/galleries/gal6/_46A0351.jpg"
  },
  "/img/galleries/gal6/_46A0413-Pano.jpg": {
    "type": "image/jpeg",
    "etag": "\"24cb6d-MkWUfDxBp4aPS1Kh2Z7BeDe5StQ\"",
    "mtime": "2023-12-04T10:27:41.037Z",
    "size": 2411373,
    "path": "../public/img/galleries/gal6/_46A0413-Pano.jpg"
  },
  "/img/galleries/gal6/_46A0499-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"79b1c-YlNgE1TIlScRSppExJiTIs1YLW0\"",
    "mtime": "2023-12-04T10:27:41.041Z",
    "size": 498460,
    "path": "../public/img/galleries/gal6/_46A0499-Edit.jpg"
  },
  "/img/galleries/gal6/_46A0614.jpg": {
    "type": "image/jpeg",
    "etag": "\"a3e73-5P+3xsavlgaO7yFmjUcV9ia9oOE\"",
    "mtime": "2023-12-04T10:27:41.047Z",
    "size": 671347,
    "path": "../public/img/galleries/gal6/_46A0614.jpg"
  },
  "/img/galleries/gal6/_46A0646-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"e110b-/m0TLWPoOISXTBAvLb/Uznf1rC4\"",
    "mtime": "2023-12-04T10:27:41.055Z",
    "size": 921867,
    "path": "../public/img/galleries/gal6/_46A0646-Edit.jpg"
  },
  "/img/galleries/gal6/_46A0712-Ed.jpg": {
    "type": "image/jpeg",
    "etag": "\"b60ac-NqnrBVIfVBwGTb6Ry4/Jzl6+DwY\"",
    "mtime": "2023-12-04T10:27:41.061Z",
    "size": 745644,
    "path": "../public/img/galleries/gal6/_46A0712-Ed.jpg"
  },
  "/img/galleries/gal6/_46A0745.jpg": {
    "type": "image/jpeg",
    "etag": "\"13c616-/AwEHX2xgb+7xwWMpbgoYlEyQ3g\"",
    "mtime": "2023-12-04T10:27:41.069Z",
    "size": 1295894,
    "path": "../public/img/galleries/gal6/_46A0745.jpg"
  },
  "/img/galleries/gal6/_46A0842-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"f3517-fuNoEXdglwz6RtXfbmAfLzrVYwI\"",
    "mtime": "2023-12-04T10:27:41.076Z",
    "size": 996631,
    "path": "../public/img/galleries/gal6/_46A0842-Edit.jpg"
  },
  "/img/galleries/gal6/_46A0857-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fff4e-NTD0HeF41UYMZhGQfexzr9/2m6Q\"",
    "mtime": "2023-12-04T10:27:41.092Z",
    "size": 3145550,
    "path": "../public/img/galleries/gal6/_46A0857-Edit.jpg"
  },
  "/img/galleries/gal6/_46A0871.jpg": {
    "type": "image/jpeg",
    "etag": "\"384432-9u+fJpKKKNcHOJcZHC47xvNH8xM\"",
    "mtime": "2023-12-04T10:27:41.111Z",
    "size": 3687474,
    "path": "../public/img/galleries/gal6/_46A0871.jpg"
  },
  "/img/galleries/gal6/_46A0874.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b75b4-0nxEGMzQfXLiOCgEZ68CB8pfxw0\"",
    "mtime": "2023-12-04T10:27:41.132Z",
    "size": 2848180,
    "path": "../public/img/galleries/gal6/_46A0874.jpg"
  },
  "/img/galleries/gal6/_46A0886-HDR.jpg": {
    "type": "image/jpeg",
    "etag": "\"18d78d-r47kkUsDShi3KWKF5ziyTQnotSo\"",
    "mtime": "2023-12-04T10:27:41.143Z",
    "size": 1628045,
    "path": "../public/img/galleries/gal6/_46A0886-HDR.jpg"
  },
  "/img/galleries/gal6/_46A0970-HDR.jpg": {
    "type": "image/jpeg",
    "etag": "\"183ffb-XwOKY6V2RxcSdB8+tQN5EFnxzCI\"",
    "mtime": "2023-12-04T10:27:41.152Z",
    "size": 1589243,
    "path": "../public/img/galleries/gal6/_46A0970-HDR.jpg"
  },
  "/img/galleries/gal6/_46A0983.jpg": {
    "type": "image/jpeg",
    "etag": "\"81f72-/2ipd4vNCtVZTyeX3y83TOBxtGw\"",
    "mtime": "2023-12-04T10:27:41.157Z",
    "size": 532338,
    "path": "../public/img/galleries/gal6/_46A0983.jpg"
  },
  "/img/galleries/gal5/ao55ocjcw2i6rn2jrugn.webp": {
    "type": "image/webp",
    "etag": "\"19834-rOILWDxdgTukdijmcHYht78NO2M\"",
    "mtime": "2023-12-05T19:32:28.173Z",
    "size": 104500,
    "path": "../public/img/galleries/gal5/ao55ocjcw2i6rn2jrugn.webp"
  },
  "/img/galleries/gal5/b5wqa5dqntriktaj6mcu.webp": {
    "type": "image/webp",
    "etag": "\"205d6-fy6giTRg/L9Xuiy4ShZqw5tr7rg\"",
    "mtime": "2023-12-05T19:32:28.198Z",
    "size": 132566,
    "path": "../public/img/galleries/gal5/b5wqa5dqntriktaj6mcu.webp"
  },
  "/img/galleries/gal5/bguba7fsgdim7gmx1huw.webp": {
    "type": "image/webp",
    "etag": "\"86b0-M/zHgVNt3WooIOhB60x4uOoIjkY\"",
    "mtime": "2023-12-05T19:32:28.223Z",
    "size": 34480,
    "path": "../public/img/galleries/gal5/bguba7fsgdim7gmx1huw.webp"
  },
  "/img/galleries/gal5/bjv1bmtw38qjbzimqvlw.webp": {
    "type": "image/webp",
    "etag": "\"d68a-/uzuuufKNpf2LDTseq6r9ueVEGo\"",
    "mtime": "2023-12-05T19:32:28.247Z",
    "size": 54922,
    "path": "../public/img/galleries/gal5/bjv1bmtw38qjbzimqvlw.webp"
  },
  "/img/galleries/gal5/botez oliver-105.jpg": {
    "type": "image/jpeg",
    "etag": "\"920e0-9UCnldJpdvIqwhsRRyYLQRpW2Ug\"",
    "mtime": "2023-12-04T10:27:40.530Z",
    "size": 598240,
    "path": "../public/img/galleries/gal5/botez oliver-105.jpg"
  },
  "/img/galleries/gal5/botez oliver-106.jpg": {
    "type": "image/jpeg",
    "etag": "\"43338-Y2Qy92a711B7g/Y9N4w7iisOx6I\"",
    "mtime": "2023-12-04T10:27:40.534Z",
    "size": 275256,
    "path": "../public/img/galleries/gal5/botez oliver-106.jpg"
  },
  "/img/galleries/gal5/botez oliver-110.jpg": {
    "type": "image/jpeg",
    "etag": "\"6b27f-npbQtvYhW9o9PW6ls4wp9fWLcww\"",
    "mtime": "2023-12-04T10:27:40.535Z",
    "size": 438911,
    "path": "../public/img/galleries/gal5/botez oliver-110.jpg"
  },
  "/img/galleries/gal5/botez oliver-112.jpg": {
    "type": "image/jpeg",
    "etag": "\"7050a-6rJmXAbxK8vDcPCLRCy3pJUu7do\"",
    "mtime": "2023-12-04T10:27:40.539Z",
    "size": 460042,
    "path": "../public/img/galleries/gal5/botez oliver-112.jpg"
  },
  "/img/galleries/gal5/botez oliver-115.jpg": {
    "type": "image/jpeg",
    "etag": "\"6841f-f7zZpgwuMAUuym6hqbjkhawfRgQ\"",
    "mtime": "2023-12-04T10:27:40.542Z",
    "size": 427039,
    "path": "../public/img/galleries/gal5/botez oliver-115.jpg"
  },
  "/img/galleries/gal5/botez oliver-121.jpg": {
    "type": "image/jpeg",
    "etag": "\"62c38-/FmIwuYvXsL8VydT18trJLG/zTA\"",
    "mtime": "2023-12-04T10:27:40.545Z",
    "size": 404536,
    "path": "../public/img/galleries/gal5/botez oliver-121.jpg"
  },
  "/img/galleries/gal5/botez oliver-134.jpg": {
    "type": "image/jpeg",
    "etag": "\"896d9-TTXcyoCGi27/8UwCKldr74V7V2Y\"",
    "mtime": "2023-12-04T10:27:40.548Z",
    "size": 562905,
    "path": "../public/img/galleries/gal5/botez oliver-134.jpg"
  },
  "/img/galleries/gal5/botez oliver-138.jpg": {
    "type": "image/jpeg",
    "etag": "\"7493c-WuIjjyS1nvtQ/hNaRmE02leG7do\"",
    "mtime": "2023-12-04T10:27:40.551Z",
    "size": 477500,
    "path": "../public/img/galleries/gal5/botez oliver-138.jpg"
  },
  "/img/galleries/gal5/botez oliver-144.jpg": {
    "type": "image/jpeg",
    "etag": "\"334e5-DrNTSAPQfe47/hNYhNPox1rDTzU\"",
    "mtime": "2023-12-04T10:27:40.554Z",
    "size": 210149,
    "path": "../public/img/galleries/gal5/botez oliver-144.jpg"
  },
  "/img/galleries/gal5/botez oliver-151.jpg": {
    "type": "image/jpeg",
    "etag": "\"78814-I07CN1Mjmk8WyXmZQ1dlgBAMfIA\"",
    "mtime": "2023-12-04T10:27:40.556Z",
    "size": 493588,
    "path": "../public/img/galleries/gal5/botez oliver-151.jpg"
  },
  "/img/galleries/gal5/botez oliver-200.jpg": {
    "type": "image/jpeg",
    "etag": "\"6662b-btnqad7eNFlm0kTjFN8o+anbWkU\"",
    "mtime": "2023-12-04T10:27:40.559Z",
    "size": 419371,
    "path": "../public/img/galleries/gal5/botez oliver-200.jpg"
  },
  "/img/galleries/gal5/botez oliver-36.jpg": {
    "type": "image/jpeg",
    "etag": "\"cb537-7rxOXNWdasSmBKSXxMTyQl4BDSo\"",
    "mtime": "2023-12-04T10:27:40.564Z",
    "size": 832823,
    "path": "../public/img/galleries/gal5/botez oliver-36.jpg"
  },
  "/img/galleries/gal5/botez oliver-37.jpg": {
    "type": "image/jpeg",
    "etag": "\"7f7ed-OorB0a5+rAvtmPvcuhadaKwV+8I\"",
    "mtime": "2023-12-04T10:27:40.568Z",
    "size": 522221,
    "path": "../public/img/galleries/gal5/botez oliver-37.jpg"
  },
  "/img/galleries/gal5/botez oliver-44.jpg": {
    "type": "image/jpeg",
    "etag": "\"9cf59-volw/m5707xwCpNXmAIM4mbSsPY\"",
    "mtime": "2023-12-04T10:27:40.571Z",
    "size": 642905,
    "path": "../public/img/galleries/gal5/botez oliver-44.jpg"
  },
  "/img/galleries/gal5/botez oliver-47.jpg": {
    "type": "image/jpeg",
    "etag": "\"9543c-3GQsZgnEmmMu2bQdHevzHPBYVC8\"",
    "mtime": "2023-12-04T10:27:40.574Z",
    "size": 611388,
    "path": "../public/img/galleries/gal5/botez oliver-47.jpg"
  },
  "/img/galleries/gal5/botez oliver-52.jpg": {
    "type": "image/jpeg",
    "etag": "\"764be-pMPEoImMtdlRDtnFLKRCyY/Njzc\"",
    "mtime": "2023-12-04T10:27:40.577Z",
    "size": 484542,
    "path": "../public/img/galleries/gal5/botez oliver-52.jpg"
  },
  "/img/galleries/gal5/botez oliver-55.jpg": {
    "type": "image/jpeg",
    "etag": "\"53b6c-OxbNESnJfi8WhkI3GrTGSRiwW9o\"",
    "mtime": "2023-12-04T10:27:40.581Z",
    "size": 342892,
    "path": "../public/img/galleries/gal5/botez oliver-55.jpg"
  },
  "/img/galleries/gal5/botez oliver-60.jpg": {
    "type": "image/jpeg",
    "etag": "\"5775c-IY/rDIIxPHxk1K7O5ZTZdLmxjwY\"",
    "mtime": "2023-12-04T10:27:40.583Z",
    "size": 358236,
    "path": "../public/img/galleries/gal5/botez oliver-60.jpg"
  },
  "/img/galleries/gal5/botez oliver-63.jpg": {
    "type": "image/jpeg",
    "etag": "\"56b8d-4HohODSRTfgrZYhEgw7NSaH63K8\"",
    "mtime": "2023-12-04T10:27:40.585Z",
    "size": 355213,
    "path": "../public/img/galleries/gal5/botez oliver-63.jpg"
  },
  "/img/galleries/gal5/botez oliver-67.jpg": {
    "type": "image/jpeg",
    "etag": "\"6023d-PR1wrq6sPXc0rW2ArAJFvs6o53c\"",
    "mtime": "2023-12-04T10:27:40.588Z",
    "size": 393789,
    "path": "../public/img/galleries/gal5/botez oliver-67.jpg"
  },
  "/img/galleries/gal5/botez oliver-73.jpg": {
    "type": "image/jpeg",
    "etag": "\"b83ce-B/MB7CEjof+8WaCYTPJcSIvD0wI\"",
    "mtime": "2023-12-04T10:27:40.591Z",
    "size": 754638,
    "path": "../public/img/galleries/gal5/botez oliver-73.jpg"
  },
  "/img/galleries/gal5/botez oliver-76.jpg": {
    "type": "image/jpeg",
    "etag": "\"b9d3a-BdWtWTKJlSiLDgAuKU+sMaxVLxw\"",
    "mtime": "2023-12-04T10:27:40.594Z",
    "size": 761146,
    "path": "../public/img/galleries/gal5/botez oliver-76.jpg"
  },
  "/img/galleries/gal5/botez oliver-77.jpg": {
    "type": "image/jpeg",
    "etag": "\"6310b-5iGedXoFDINQOxsYI1g3LPiSG38\"",
    "mtime": "2023-12-04T10:27:40.596Z",
    "size": 405771,
    "path": "../public/img/galleries/gal5/botez oliver-77.jpg"
  },
  "/img/galleries/gal5/botez oliver-79.jpg": {
    "type": "image/jpeg",
    "etag": "\"78011-Bw82FNOudMVf3bYxgi5GApCQuEU\"",
    "mtime": "2023-12-04T10:27:40.598Z",
    "size": 491537,
    "path": "../public/img/galleries/gal5/botez oliver-79.jpg"
  },
  "/img/galleries/gal5/botez oliver-82.jpg": {
    "type": "image/jpeg",
    "etag": "\"c66b0-jgf1ZzGjGWvkU96pU+857VVjB58\"",
    "mtime": "2023-12-04T10:27:40.602Z",
    "size": 812720,
    "path": "../public/img/galleries/gal5/botez oliver-82.jpg"
  },
  "/img/galleries/gal5/botez oliver-86.jpg": {
    "type": "image/jpeg",
    "etag": "\"529eb-a6ltvlDGuIj9FiDPeK2clBCLoGo\"",
    "mtime": "2023-12-04T10:27:40.603Z",
    "size": 338411,
    "path": "../public/img/galleries/gal5/botez oliver-86.jpg"
  },
  "/img/galleries/gal5/botez oliver-97.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c3ad-vED6R/CIYjcU7vuVyghA1PLVd58\"",
    "mtime": "2023-12-04T10:27:40.604Z",
    "size": 246701,
    "path": "../public/img/galleries/gal5/botez oliver-97.jpg"
  },
  "/img/galleries/gal5/botez oliver-98.jpg": {
    "type": "image/jpeg",
    "etag": "\"726e0-EBxzC8F/X5V/36pYB9Atu+qEJOU\"",
    "mtime": "2023-12-04T10:27:40.606Z",
    "size": 468704,
    "path": "../public/img/galleries/gal5/botez oliver-98.jpg"
  },
  "/img/galleries/gal5/gvf9nmqskaztyh2adk4v.webp": {
    "type": "image/webp",
    "etag": "\"127e6-EFzwwfWx+IVmE3CXalWDjNE+8QU\"",
    "mtime": "2023-12-05T19:32:28.272Z",
    "size": 75750,
    "path": "../public/img/galleries/gal5/gvf9nmqskaztyh2adk4v.webp"
  },
  "/img/galleries/gal5/IMG_1133.jpg": {
    "type": "image/jpeg",
    "etag": "\"13e3fe-vOwW7xuVYAbv9518pHpOGq3rdSU\"",
    "mtime": "2023-12-04T10:27:40.243Z",
    "size": 1303550,
    "path": "../public/img/galleries/gal5/IMG_1133.jpg"
  },
  "/img/galleries/gal5/IMG_2539.jpg": {
    "type": "image/jpeg",
    "etag": "\"19f3cd-3jTkHi8GTkX9dibwZYfpc+7vvYA\"",
    "mtime": "2023-12-04T10:27:40.254Z",
    "size": 1700813,
    "path": "../public/img/galleries/gal5/IMG_2539.jpg"
  },
  "/img/galleries/gal5/kpsauz8l66nw8cbunuh8.webp": {
    "type": "image/webp",
    "etag": "\"238f6-GV/S2m8OmsHywCaFPG2+GhwAfnU\"",
    "mtime": "2023-12-05T19:32:28.298Z",
    "size": 145654,
    "path": "../public/img/galleries/gal5/kpsauz8l66nw8cbunuh8.webp"
  },
  "/img/galleries/gal5/lcc8p8y8ta0efihmcrmn.webp": {
    "type": "image/webp",
    "etag": "\"5ea78-w1GZpqbz0VLA8Ov32clqUVT1R7Q\"",
    "mtime": "2023-12-05T19:32:28.326Z",
    "size": 387704,
    "path": "../public/img/galleries/gal5/lcc8p8y8ta0efihmcrmn.webp"
  },
  "/img/galleries/gal5/lrqomvqbphqyoyjipx2r.webp": {
    "type": "image/webp",
    "etag": "\"142e6-gZoxAfvOVAsfcjWH13tAb+luer8\"",
    "mtime": "2023-12-05T19:32:28.352Z",
    "size": 82662,
    "path": "../public/img/galleries/gal5/lrqomvqbphqyoyjipx2r.webp"
  },
  "/img/galleries/gal5/lwwdvb9eeoyf4mqv5qca.webp": {
    "type": "image/webp",
    "etag": "\"fac6-ClQTf9+IY2wpa6HB+IMclwj+y1U\"",
    "mtime": "2023-12-05T19:32:28.378Z",
    "size": 64198,
    "path": "../public/img/galleries/gal5/lwwdvb9eeoyf4mqv5qca.webp"
  },
  "/img/galleries/gal5/mvtdkaqgs2a40quhaymo.webp": {
    "type": "image/webp",
    "etag": "\"1cdba-UapUXlXdLFmyNtO5fLDqMWcov+g\"",
    "mtime": "2023-12-05T19:32:28.406Z",
    "size": 118202,
    "path": "../public/img/galleries/gal5/mvtdkaqgs2a40quhaymo.webp"
  },
  "/img/galleries/gal5/mxx6ubkwcuv43ntghwvq.webp": {
    "type": "image/webp",
    "etag": "\"16ac6-MfSN1t18ljVRhuymMJ0sDtw4dLw\"",
    "mtime": "2023-12-05T19:32:28.432Z",
    "size": 92870,
    "path": "../public/img/galleries/gal5/mxx6ubkwcuv43ntghwvq.webp"
  },
  "/img/galleries/gal5/o7zimnfyljxwkklygftk.webp": {
    "type": "image/webp",
    "etag": "\"24f70-ytIop04eIG6IfNoRDP9mvY5pVp4\"",
    "mtime": "2023-12-05T19:32:28.458Z",
    "size": 151408,
    "path": "../public/img/galleries/gal5/o7zimnfyljxwkklygftk.webp"
  },
  "/img/galleries/gal5/ozq39nxokm7q7wbo5g5w.webp": {
    "type": "image/webp",
    "etag": "\"689e-PQTFrPkGBBs9gDyA0ers0Qt2TzM\"",
    "mtime": "2023-12-05T19:32:28.483Z",
    "size": 26782,
    "path": "../public/img/galleries/gal5/ozq39nxokm7q7wbo5g5w.webp"
  },
  "/img/galleries/gal5/q64ictumjlflhers39c8.webp": {
    "type": "image/webp",
    "etag": "\"b1da-I21ShTLAi8tz2LZjnPJ93FQWU3Q\"",
    "mtime": "2023-12-05T19:32:28.509Z",
    "size": 45530,
    "path": "../public/img/galleries/gal5/q64ictumjlflhers39c8.webp"
  },
  "/img/galleries/gal5/qsj7wbpikq4avhlhjug6.webp": {
    "type": "image/webp",
    "etag": "\"30f16-fghIq0ciWqqQmVP770clfIObJMM\"",
    "mtime": "2023-12-05T19:32:28.535Z",
    "size": 200470,
    "path": "../public/img/galleries/gal5/qsj7wbpikq4avhlhjug6.webp"
  },
  "/img/galleries/gal5/rvssx1knk9hfzlejysf3.webp": {
    "type": "image/webp",
    "etag": "\"3c60c-3R/jvE+BwNeKDFzxdUE8maN/yaA\"",
    "mtime": "2023-12-05T19:32:28.564Z",
    "size": 247308,
    "path": "../public/img/galleries/gal5/rvssx1knk9hfzlejysf3.webp"
  },
  "/img/galleries/gal5/t26vrrcwuijpo2bsd3sq.webp": {
    "type": "image/webp",
    "etag": "\"b5f8-xfygfxuaE3EMj01poSU2CfBFRVQ\"",
    "mtime": "2023-12-05T19:32:28.589Z",
    "size": 46584,
    "path": "../public/img/galleries/gal5/t26vrrcwuijpo2bsd3sq.webp"
  },
  "/img/galleries/gal5/upmxf3zmfdt5fhldbfg5.webp": {
    "type": "image/webp",
    "etag": "\"58520-3rW/br89bhUXRWhLNQsOZsSlrRc\"",
    "mtime": "2023-12-05T19:32:28.617Z",
    "size": 361760,
    "path": "../public/img/galleries/gal5/upmxf3zmfdt5fhldbfg5.webp"
  },
  "/img/galleries/gal5/vbv8rrrs2g5c5br7ybtq.webp": {
    "type": "image/webp",
    "etag": "\"2ac64-MJESIcl40P8r2yxHw0DWz4hdJ/c\"",
    "mtime": "2023-12-05T19:32:28.645Z",
    "size": 175204,
    "path": "../public/img/galleries/gal5/vbv8rrrs2g5c5br7ybtq.webp"
  },
  "/img/galleries/gal5/vhyzh2xffjtxvrl5uroz.webp": {
    "type": "image/webp",
    "etag": "\"78b5c-F065SF0E1AlKW20BysgyDvZ+iM4\"",
    "mtime": "2023-12-05T19:32:28.677Z",
    "size": 494428,
    "path": "../public/img/galleries/gal5/vhyzh2xffjtxvrl5uroz.webp"
  },
  "/img/galleries/gal5/wfbjtbtucune8tqporge.webp": {
    "type": "image/webp",
    "etag": "\"4f28-9ulrxx7iqHjq38rTKgkh3+BN4Zo\"",
    "mtime": "2023-12-05T19:32:28.703Z",
    "size": 20264,
    "path": "../public/img/galleries/gal5/wfbjtbtucune8tqporge.webp"
  },
  "/img/galleries/gal5/wosjtuwwmk4hc6kewd9z.webp": {
    "type": "image/webp",
    "etag": "\"5516c-sT3NKJfuiWzENgpJjH61178oY6k\"",
    "mtime": "2023-12-05T19:32:28.731Z",
    "size": 348524,
    "path": "../public/img/galleries/gal5/wosjtuwwmk4hc6kewd9z.webp"
  },
  "/img/galleries/gal5/xch3rajsixi05pijcklc.webp": {
    "type": "image/webp",
    "etag": "\"48b0c-G97ofGMzIGaPfGmFKpr+1bEnCD4\"",
    "mtime": "2023-12-05T19:32:28.757Z",
    "size": 297740,
    "path": "../public/img/galleries/gal5/xch3rajsixi05pijcklc.webp"
  },
  "/img/galleries/gal5/zjycwh468gaxzzjtdu49.webp": {
    "type": "image/webp",
    "etag": "\"8a24-yrnmQ9X5IR9IDFGggViF48wTLhE\"",
    "mtime": "2023-12-05T19:32:28.781Z",
    "size": 35364,
    "path": "../public/img/galleries/gal5/zjycwh468gaxzzjtdu49.webp"
  },
  "/img/galleries/gal5/zl9y8hz1spgcq5rayyio.webp": {
    "type": "image/webp",
    "etag": "\"89c8-vVjMTcVBQZDbfFGFYhzonaIQOSE\"",
    "mtime": "2023-12-05T19:32:28.806Z",
    "size": 35272,
    "path": "../public/img/galleries/gal5/zl9y8hz1spgcq5rayyio.webp"
  },
  "/img/galleries/gal5/ztug8i4mlxughheqraw0.webp": {
    "type": "image/webp",
    "etag": "\"294ec-kKWuxYTNb7u+i+w470Yf2O0PVK8\"",
    "mtime": "2023-12-05T19:32:28.831Z",
    "size": 169196,
    "path": "../public/img/galleries/gal5/ztug8i4mlxughheqraw0.webp"
  },
  "/img/galleries/gal5/_46A0127.jpg": {
    "type": "image/jpeg",
    "etag": "\"134e5e-rlKsZ84KYgtCVOu93D6mEvAMF9E\"",
    "mtime": "2023-12-04T10:27:40.290Z",
    "size": 1265246,
    "path": "../public/img/galleries/gal5/_46A0127.jpg"
  },
  "/img/galleries/gal5/_46A1112-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"e3fb8-Ut4sjjsBlruQpWph2oqNVil5I7A\"",
    "mtime": "2023-12-04T10:27:40.298Z",
    "size": 933816,
    "path": "../public/img/galleries/gal5/_46A1112-Edit.jpg"
  },
  "/img/galleries/gal5/_46A1127-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"4090df-M43RFbLg7W0hcb5vPjdDiqQQ74Y\"",
    "mtime": "2023-12-04T10:27:40.324Z",
    "size": 4231391,
    "path": "../public/img/galleries/gal5/_46A1127-Edit.jpg"
  },
  "/img/galleries/gal5/_46A1143.jpg": {
    "type": "image/jpeg",
    "etag": "\"24dfd7-wXsD4UNsEDDWOyibmC4t6yBUAG4\"",
    "mtime": "2023-12-04T10:27:40.341Z",
    "size": 2416599,
    "path": "../public/img/galleries/gal5/_46A1143.jpg"
  },
  "/img/galleries/gal5/_46A1163.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a8491-ZBLE5H1mCu0so/m0m1KRG/xuhAI\"",
    "mtime": "2023-12-04T10:27:40.352Z",
    "size": 1737873,
    "path": "../public/img/galleries/gal5/_46A1163.jpg"
  },
  "/img/galleries/gal5/_46A1228.jpg": {
    "type": "image/jpeg",
    "etag": "\"365fe2-Qg+gtrRkI0B74iUmLY1qCuNWWUk\"",
    "mtime": "2023-12-04T10:27:40.368Z",
    "size": 3563490,
    "path": "../public/img/galleries/gal5/_46A1228.jpg"
  },
  "/img/galleries/gal5/_46A1270.jpg": {
    "type": "image/jpeg",
    "etag": "\"4695c7-VGeRjElXp7SJIlpb4lfNyB0ODDI\"",
    "mtime": "2023-12-04T10:27:40.388Z",
    "size": 4625863,
    "path": "../public/img/galleries/gal5/_46A1270.jpg"
  },
  "/img/galleries/gal5/_46A1285.jpg": {
    "type": "image/jpeg",
    "etag": "\"3e5d6f-dQn5055cEoUHSJudV4A0XzgLp58\"",
    "mtime": "2023-12-04T10:27:40.406Z",
    "size": 4087151,
    "path": "../public/img/galleries/gal5/_46A1285.jpg"
  },
  "/img/galleries/gal5/_46A1286.jpg": {
    "type": "image/jpeg",
    "etag": "\"55d590-eo/2ZYjO8ueTZC1JaHogZQzvs3w\"",
    "mtime": "2023-12-04T10:27:40.432Z",
    "size": 5625232,
    "path": "../public/img/galleries/gal5/_46A1286.jpg"
  },
  "/img/galleries/gal5/_46A1288.jpg": {
    "type": "image/jpeg",
    "etag": "\"3fdb6d-na5OF8ecQcv+U51inHMNfvjKudQ\"",
    "mtime": "2023-12-04T10:27:40.450Z",
    "size": 4184941,
    "path": "../public/img/galleries/gal5/_46A1288.jpg"
  },
  "/img/galleries/gal5/_46A1330.jpg": {
    "type": "image/jpeg",
    "etag": "\"258a29-KzcmtpJUbPQeZDsxz3RYgHQ1y0Y\"",
    "mtime": "2023-12-04T10:27:40.459Z",
    "size": 2460201,
    "path": "../public/img/galleries/gal5/_46A1330.jpg"
  },
  "/img/galleries/gal5/_46A1332.jpg": {
    "type": "image/jpeg",
    "etag": "\"3a660d-7VLvZULs1079Oq6N6ZEQFk5fk4M\"",
    "mtime": "2023-12-04T10:27:40.475Z",
    "size": 3827213,
    "path": "../public/img/galleries/gal5/_46A1332.jpg"
  },
  "/img/galleries/gal5/_46A1333.jpg": {
    "type": "image/jpeg",
    "etag": "\"286dbd-lbquthi188WZ3Txxq3JWGCSwRUY\"",
    "mtime": "2023-12-04T10:27:40.485Z",
    "size": 2649533,
    "path": "../public/img/galleries/gal5/_46A1333.jpg"
  },
  "/img/galleries/gal5/_46A1335-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"187823-bf0mZJbWnwcdyDP12LQG6xh8yWs\"",
    "mtime": "2023-12-04T10:27:40.494Z",
    "size": 1603619,
    "path": "../public/img/galleries/gal5/_46A1335-Edit.jpg"
  },
  "/img/galleries/gal5/_46A1352.jpg": {
    "type": "image/jpeg",
    "etag": "\"25c2be-V21c7OF7I1OIMNXSkTmSTC6x0BI\"",
    "mtime": "2023-12-04T10:27:40.505Z",
    "size": 2474686,
    "path": "../public/img/galleries/gal5/_46A1352.jpg"
  },
  "/img/galleries/gal5/_46A1358.jpg": {
    "type": "image/jpeg",
    "etag": "\"1219af-gDQjdMI0hLygDMoZ5PFAQGKUY7c\"",
    "mtime": "2023-12-04T10:27:40.508Z",
    "size": 1186223,
    "path": "../public/img/galleries/gal5/_46A1358.jpg"
  },
  "/img/galleries/gal5/_46A1363-Edit.jpg": {
    "type": "image/jpeg",
    "etag": "\"2aab32-JszlwoQToBAxHTZ2kYQnDkQFm2g\"",
    "mtime": "2023-12-04T10:27:40.521Z",
    "size": 2796338,
    "path": "../public/img/galleries/gal5/_46A1363-Edit.jpg"
  },
  "/img/galleries/gal5/_46A1371.jpg": {
    "type": "image/jpeg",
    "etag": "\"ca359-qYgdVK4vXH8ccvCifw866jdcAdo\"",
    "mtime": "2023-12-04T10:27:40.527Z",
    "size": 828249,
    "path": "../public/img/galleries/gal5/_46A1371.jpg"
  },
  "/_nuxt/builds/meta/1877e29f-88ea-4f5c-adc0-ac980d72bd8f.json": {
    "type": "application/json",
    "etag": "\"8b-vCjAOUgOSODd0AbbILHMsSgzVYc\"",
    "mtime": "2023-12-08T20:11:08.463Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/1877e29f-88ea-4f5c-adc0-ac980d72bd8f.json"
  },
  "/img/galleries/gal6/New folder/annfzgbr0rpfmffgiva8.webp": {
    "type": "image/webp",
    "etag": "\"1844c-J+RYlAEEE41YcfacV5loW8e1yLc\"",
    "mtime": "2023-12-04T10:27:40.841Z",
    "size": 99404,
    "path": "../public/img/galleries/gal6/New folder/annfzgbr0rpfmffgiva8.webp"
  },
  "/img/galleries/gal6/New folder/ap6xecp2roa6eoy3q1sn.webp": {
    "type": "image/webp",
    "etag": "\"eeb2-D7XD2GBQSF557bQfSlydYhZrIj8\"",
    "mtime": "2023-12-04T10:27:40.842Z",
    "size": 61106,
    "path": "../public/img/galleries/gal6/New folder/ap6xecp2roa6eoy3q1sn.webp"
  },
  "/img/galleries/gal6/New folder/apljigw5ayxj9jixgljz.webp": {
    "type": "image/webp",
    "etag": "\"7f8e-qBg702JMXkrDeiSRs4iKPcnKKo8\"",
    "mtime": "2023-12-04T10:27:40.842Z",
    "size": 32654,
    "path": "../public/img/galleries/gal6/New folder/apljigw5ayxj9jixgljz.webp"
  },
  "/img/galleries/gal6/New folder/ayq3byg3hgdjjx1yofdp.webp": {
    "type": "image/webp",
    "etag": "\"72e6-t3pWY/2tdjMcJBocRj9u9YyAKJU\"",
    "mtime": "2023-12-04T10:27:40.843Z",
    "size": 29414,
    "path": "../public/img/galleries/gal6/New folder/ayq3byg3hgdjjx1yofdp.webp"
  },
  "/img/galleries/gal6/New folder/bdxtywtkb6zqjeondr1y.webp": {
    "type": "image/webp",
    "etag": "\"27a14-qCGm8Essofrc1VV2KZHLUtVc/AQ\"",
    "mtime": "2023-12-04T10:27:40.844Z",
    "size": 162324,
    "path": "../public/img/galleries/gal6/New folder/bdxtywtkb6zqjeondr1y.webp"
  },
  "/img/galleries/gal6/New folder/bo7frufvqvtnfquxfgsq.webp": {
    "type": "image/webp",
    "etag": "\"16be8-lTAf2ehzyq3WE7Rpx4kDwgOoGO8\"",
    "mtime": "2023-12-04T10:27:40.845Z",
    "size": 93160,
    "path": "../public/img/galleries/gal6/New folder/bo7frufvqvtnfquxfgsq.webp"
  },
  "/img/galleries/gal6/New folder/dtople1sch0yiedlrmtg.webp": {
    "type": "image/webp",
    "etag": "\"175f2-kn7a3TUcVX8KIb3At6ZhKuHYLa8\"",
    "mtime": "2023-12-04T10:27:40.845Z",
    "size": 95730,
    "path": "../public/img/galleries/gal6/New folder/dtople1sch0yiedlrmtg.webp"
  },
  "/img/galleries/gal6/New folder/dydqaczwqshclgcxq6an.webp": {
    "type": "image/webp",
    "etag": "\"a048-6mBxsP8HRd5AQgxXTISJqwFNbZo\"",
    "mtime": "2023-12-04T10:27:40.846Z",
    "size": 41032,
    "path": "../public/img/galleries/gal6/New folder/dydqaczwqshclgcxq6an.webp"
  },
  "/img/galleries/gal6/New folder/em9kxsyyby1rdpvv3n3g.webp": {
    "type": "image/webp",
    "etag": "\"3a8a-6+SCKhIfuBD7vZGBvUdMdvvcMMc\"",
    "mtime": "2023-12-04T10:27:40.846Z",
    "size": 14986,
    "path": "../public/img/galleries/gal6/New folder/em9kxsyyby1rdpvv3n3g.webp"
  },
  "/img/galleries/gal6/New folder/gnrwn3l4gwpgdq0kzk8n.webp": {
    "type": "image/webp",
    "etag": "\"25fe8-BqsDFgAyJlYKPIlEN0RKoXx5xok\"",
    "mtime": "2023-12-04T10:27:40.847Z",
    "size": 155624,
    "path": "../public/img/galleries/gal6/New folder/gnrwn3l4gwpgdq0kzk8n.webp"
  },
  "/img/galleries/gal6/New folder/grmxx1dna8pehqrgwaos.webp": {
    "type": "image/webp",
    "etag": "\"3bfc6-u7XvfSKJ+vyglzgAIkVdx19n+X4\"",
    "mtime": "2023-12-04T10:27:40.848Z",
    "size": 245702,
    "path": "../public/img/galleries/gal6/New folder/grmxx1dna8pehqrgwaos.webp"
  },
  "/img/galleries/gal6/New folder/h3rlza0air0nicx6i3py.webp": {
    "type": "image/webp",
    "etag": "\"d66e-2YoI6lbZnvvagdsBGxZ7Kr0SVDE\"",
    "mtime": "2023-12-04T10:27:40.848Z",
    "size": 54894,
    "path": "../public/img/galleries/gal6/New folder/h3rlza0air0nicx6i3py.webp"
  },
  "/img/galleries/gal6/New folder/hxvtgsfn41gfhwdfwxny.webp": {
    "type": "image/webp",
    "etag": "\"272c8-voxWa50QQoahLlz9yDoNKFeR3TE\"",
    "mtime": "2023-12-04T10:27:40.849Z",
    "size": 160456,
    "path": "../public/img/galleries/gal6/New folder/hxvtgsfn41gfhwdfwxny.webp"
  },
  "/img/galleries/gal6/New folder/ietrg9ja9o6i1fsyukd0.webp": {
    "type": "image/webp",
    "etag": "\"1d730-oZGEvYKEOOD2rfXiH36S1Xyctw0\"",
    "mtime": "2023-12-04T10:27:40.851Z",
    "size": 120624,
    "path": "../public/img/galleries/gal6/New folder/ietrg9ja9o6i1fsyukd0.webp"
  },
  "/img/galleries/gal6/New folder/j6eorvclnwtbzyiswc1t.webp": {
    "type": "image/webp",
    "etag": "\"363e6-7jF+miG5JpL8sgpO3ACc+PPMDtY\"",
    "mtime": "2023-12-04T10:27:40.852Z",
    "size": 222182,
    "path": "../public/img/galleries/gal6/New folder/j6eorvclnwtbzyiswc1t.webp"
  },
  "/img/galleries/gal6/New folder/j99li4c8q2xbd3c8k9ma.webp": {
    "type": "image/webp",
    "etag": "\"1d644-7aXC928N38yL2aAlhsqd11wUmDg\"",
    "mtime": "2023-12-04T10:27:40.852Z",
    "size": 120388,
    "path": "../public/img/galleries/gal6/New folder/j99li4c8q2xbd3c8k9ma.webp"
  },
  "/img/galleries/gal6/New folder/js7s3cughavndyxrxve4.webp": {
    "type": "image/webp",
    "etag": "\"e522-Weo05bclURzmxRwKS3Oq8djtMs8\"",
    "mtime": "2023-12-04T10:27:40.853Z",
    "size": 58658,
    "path": "../public/img/galleries/gal6/New folder/js7s3cughavndyxrxve4.webp"
  },
  "/img/galleries/gal6/New folder/kg5dfmgnd5kdqebx9dbf.webp": {
    "type": "image/webp",
    "etag": "\"4cb28-9A5gS4AyGLU4ZGXTpHAsHd7Ph1I\"",
    "mtime": "2023-12-04T10:27:40.854Z",
    "size": 314152,
    "path": "../public/img/galleries/gal6/New folder/kg5dfmgnd5kdqebx9dbf.webp"
  },
  "/img/galleries/gal6/New folder/l8oiqqkzohiwrjgk7cpd.webp": {
    "type": "image/webp",
    "etag": "\"1c402-Jjgn29SJHalEqOUFaJ06cKoe2/c\"",
    "mtime": "2023-12-04T10:27:40.855Z",
    "size": 115714,
    "path": "../public/img/galleries/gal6/New folder/l8oiqqkzohiwrjgk7cpd.webp"
  },
  "/img/galleries/gal6/New folder/m3zi4ea3fp22y8wlorna.webp": {
    "type": "image/webp",
    "etag": "\"20d50-xfuiqFhs1Lu4UWw/vH62utw+I80\"",
    "mtime": "2023-12-04T10:27:40.857Z",
    "size": 134480,
    "path": "../public/img/galleries/gal6/New folder/m3zi4ea3fp22y8wlorna.webp"
  },
  "/img/galleries/gal6/New folder/mmq4xhth8im4yzijyot2.webp": {
    "type": "image/webp",
    "etag": "\"46290-JxKcW9U9vF9svQs20A0bllWCGOY\"",
    "mtime": "2023-12-04T10:27:40.858Z",
    "size": 287376,
    "path": "../public/img/galleries/gal6/New folder/mmq4xhth8im4yzijyot2.webp"
  },
  "/img/galleries/gal6/New folder/n25mb8ph6p0c3lk9zqy0.webp": {
    "type": "image/webp",
    "etag": "\"11d02-ptbfpfRS+cR+G884drD3vpgvGN8\"",
    "mtime": "2023-12-04T10:27:40.859Z",
    "size": 72962,
    "path": "../public/img/galleries/gal6/New folder/n25mb8ph6p0c3lk9zqy0.webp"
  },
  "/img/galleries/gal6/New folder/ocjytpruqnbcjzn1coj8.webp": {
    "type": "image/webp",
    "etag": "\"1d890-ArKvGGwwV5yVcDr99hf6EcOd09Y\"",
    "mtime": "2023-12-04T10:27:40.859Z",
    "size": 120976,
    "path": "../public/img/galleries/gal6/New folder/ocjytpruqnbcjzn1coj8.webp"
  },
  "/img/galleries/gal6/New folder/oekqkepnowlixpcheemn.webp": {
    "type": "image/webp",
    "etag": "\"2035c-G4D/6NSASV0nT3PZKG1wOz/MmBs\"",
    "mtime": "2023-12-04T10:27:40.861Z",
    "size": 131932,
    "path": "../public/img/galleries/gal6/New folder/oekqkepnowlixpcheemn.webp"
  },
  "/img/galleries/gal6/New folder/oost1uz98syxxwos25yg.webp": {
    "type": "image/webp",
    "etag": "\"12f80-E0Z7FTsPJ5vzaWSVeUv3jCT/3to\"",
    "mtime": "2023-12-04T10:27:40.861Z",
    "size": 77696,
    "path": "../public/img/galleries/gal6/New folder/oost1uz98syxxwos25yg.webp"
  },
  "/img/galleries/gal6/New folder/pbs4oum4v1c0udlyjc6t.webp": {
    "type": "image/webp",
    "etag": "\"4a59c-FBKtRiWNfZksGxqQBtFd/c+XMwk\"",
    "mtime": "2023-12-04T10:27:40.863Z",
    "size": 304540,
    "path": "../public/img/galleries/gal6/New folder/pbs4oum4v1c0udlyjc6t.webp"
  },
  "/img/galleries/gal6/New folder/pu9voeq4ah3fjuilr2tj.webp": {
    "type": "image/webp",
    "etag": "\"3d140-J7UcQzGfRGMdOBjBnhB+ac99YO8\"",
    "mtime": "2023-12-04T10:27:40.864Z",
    "size": 250176,
    "path": "../public/img/galleries/gal6/New folder/pu9voeq4ah3fjuilr2tj.webp"
  },
  "/img/galleries/gal6/New folder/qctb0uxd86vhig7ld2ia.webp": {
    "type": "image/webp",
    "etag": "\"207a0-BzRq7Tj5T2u9PuMJmNFFOVEGnOg\"",
    "mtime": "2023-12-04T10:27:40.865Z",
    "size": 133024,
    "path": "../public/img/galleries/gal6/New folder/qctb0uxd86vhig7ld2ia.webp"
  },
  "/img/galleries/gal6/New folder/rievuujnvfjmkwbibko3.webp": {
    "type": "image/webp",
    "etag": "\"983c-PWpDEFBldB+E32GgVb/q3Wah0UU\"",
    "mtime": "2023-12-04T10:27:40.865Z",
    "size": 38972,
    "path": "../public/img/galleries/gal6/New folder/rievuujnvfjmkwbibko3.webp"
  },
  "/img/galleries/gal6/New folder/rqti3edz6vsztuh8yujz.webp": {
    "type": "image/webp",
    "etag": "\"bcda-FF3+Qi8OXBOhOt1OaE0XtGll/m0\"",
    "mtime": "2023-12-04T10:27:40.866Z",
    "size": 48346,
    "path": "../public/img/galleries/gal6/New folder/rqti3edz6vsztuh8yujz.webp"
  },
  "/img/galleries/gal6/New folder/s1tt7rujoxf7o3tdanx6.webp": {
    "type": "image/webp",
    "etag": "\"1562e-ufYs+HGAzm7G4McczLPA6duPpEE\"",
    "mtime": "2023-12-04T10:27:40.866Z",
    "size": 87598,
    "path": "../public/img/galleries/gal6/New folder/s1tt7rujoxf7o3tdanx6.webp"
  },
  "/img/galleries/gal6/New folder/srdmy7y6pokmbd1altum.webp": {
    "type": "image/webp",
    "etag": "\"3df68-JZbeUC0ItBNQqYqRO6YOOvYK7CY\"",
    "mtime": "2023-12-04T10:27:40.867Z",
    "size": 253800,
    "path": "../public/img/galleries/gal6/New folder/srdmy7y6pokmbd1altum.webp"
  },
  "/img/galleries/gal6/New folder/v6zngvzqkgbaxbsbq81o.webp": {
    "type": "image/webp",
    "etag": "\"6cc62-H3PAv1w7Cg12Ak4poUWq5foZuzg\"",
    "mtime": "2023-12-04T10:27:40.870Z",
    "size": 445538,
    "path": "../public/img/galleries/gal6/New folder/v6zngvzqkgbaxbsbq81o.webp"
  },
  "/img/galleries/gal6/New folder/vqqh84lc57ulfbvznids.webp": {
    "type": "image/webp",
    "etag": "\"47ffa-fsavQ5E83/kP611zZM0x1UZeac8\"",
    "mtime": "2023-12-04T10:27:40.872Z",
    "size": 294906,
    "path": "../public/img/galleries/gal6/New folder/vqqh84lc57ulfbvznids.webp"
  },
  "/img/galleries/gal6/New folder/vxrp6nspysfimkgunh0z.webp": {
    "type": "image/webp",
    "etag": "\"d298-kG7AuMpAid3AaarRLX5ivzBHwzI\"",
    "mtime": "2023-12-04T10:27:40.872Z",
    "size": 53912,
    "path": "../public/img/galleries/gal6/New folder/vxrp6nspysfimkgunh0z.webp"
  },
  "/img/galleries/gal6/New folder/ww9xszffiuyezncrjtwj.webp": {
    "type": "image/webp",
    "etag": "\"d0c4-hl86QmlXKr0Xx4Kjnik3SqbazO8\"",
    "mtime": "2023-12-04T10:27:40.873Z",
    "size": 53444,
    "path": "../public/img/galleries/gal6/New folder/ww9xszffiuyezncrjtwj.webp"
  },
  "/img/galleries/gal6/New folder/xy7jivsv7kqkrijfmgdf.webp": {
    "type": "image/webp",
    "etag": "\"1274c-kFbutdYuLzxWUicfg/cTAcqRcgI\"",
    "mtime": "2023-12-04T10:27:40.873Z",
    "size": 75596,
    "path": "../public/img/galleries/gal6/New folder/xy7jivsv7kqkrijfmgdf.webp"
  },
  "/img/galleries/gal6/New folder/y7vr2abpqpyxzgcuyxb3.webp": {
    "type": "image/webp",
    "etag": "\"2c4fa-LIJ4eqybKPP5LkKFLdzpNl4BP0U\"",
    "mtime": "2023-12-04T10:27:40.874Z",
    "size": 181498,
    "path": "../public/img/galleries/gal6/New folder/y7vr2abpqpyxzgcuyxb3.webp"
  },
  "/img/galleries/gal6/New folder/y8jwsxiqxqg9xlflx5i0.webp": {
    "type": "image/webp",
    "etag": "\"2f33c-Tyd01zNW5ci85ud8w0xTObKIUr0\"",
    "mtime": "2023-12-04T10:27:40.876Z",
    "size": 193340,
    "path": "../public/img/galleries/gal6/New folder/y8jwsxiqxqg9xlflx5i0.webp"
  },
  "/img/galleries/gal6/New folder/yqenwf0udzu0zzvmehvr.webp": {
    "type": "image/webp",
    "etag": "\"1b254-fgAAGIV17o5AAgERm8X4Ka5H+yU\"",
    "mtime": "2023-12-04T10:27:40.877Z",
    "size": 111188,
    "path": "../public/img/galleries/gal6/New folder/yqenwf0udzu0zzvmehvr.webp"
  },
  "/img/galleries/gal6/New folder/zkzzbcgn8gzvr1zw39qr.webp": {
    "type": "image/webp",
    "etag": "\"2f752-5RBATTZujsU1L09w1dOP6MlPZ+I\"",
    "mtime": "2023-12-04T10:27:40.878Z",
    "size": 194386,
    "path": "../public/img/galleries/gal6/New folder/zkzzbcgn8gzvr1zw39qr.webp"
  },
  "/img/galleries/gal5/New folder/ao55ocjcw2i6rn2jrugn.webp": {
    "type": "image/webp",
    "etag": "\"19834-rOILWDxdgTukdijmcHYht78NO2M\"",
    "mtime": "2023-12-04T10:27:40.256Z",
    "size": 104500,
    "path": "../public/img/galleries/gal5/New folder/ao55ocjcw2i6rn2jrugn.webp"
  },
  "/img/galleries/gal5/New folder/b5wqa5dqntriktaj6mcu.webp": {
    "type": "image/webp",
    "etag": "\"205d6-fy6giTRg/L9Xuiy4ShZqw5tr7rg\"",
    "mtime": "2023-12-04T10:27:40.257Z",
    "size": 132566,
    "path": "../public/img/galleries/gal5/New folder/b5wqa5dqntriktaj6mcu.webp"
  },
  "/img/galleries/gal5/New folder/bguba7fsgdim7gmx1huw.webp": {
    "type": "image/webp",
    "etag": "\"86b0-M/zHgVNt3WooIOhB60x4uOoIjkY\"",
    "mtime": "2023-12-04T10:27:40.257Z",
    "size": 34480,
    "path": "../public/img/galleries/gal5/New folder/bguba7fsgdim7gmx1huw.webp"
  },
  "/img/galleries/gal5/New folder/bjv1bmtw38qjbzimqvlw.webp": {
    "type": "image/webp",
    "etag": "\"d68a-/uzuuufKNpf2LDTseq6r9ueVEGo\"",
    "mtime": "2023-12-04T10:27:40.258Z",
    "size": 54922,
    "path": "../public/img/galleries/gal5/New folder/bjv1bmtw38qjbzimqvlw.webp"
  },
  "/img/galleries/gal5/New folder/gvf9nmqskaztyh2adk4v.webp": {
    "type": "image/webp",
    "etag": "\"127e6-EFzwwfWx+IVmE3CXalWDjNE+8QU\"",
    "mtime": "2023-12-04T10:27:40.259Z",
    "size": 75750,
    "path": "../public/img/galleries/gal5/New folder/gvf9nmqskaztyh2adk4v.webp"
  },
  "/img/galleries/gal5/New folder/kpsauz8l66nw8cbunuh8.webp": {
    "type": "image/webp",
    "etag": "\"238f6-GV/S2m8OmsHywCaFPG2+GhwAfnU\"",
    "mtime": "2023-12-04T10:27:40.260Z",
    "size": 145654,
    "path": "../public/img/galleries/gal5/New folder/kpsauz8l66nw8cbunuh8.webp"
  },
  "/img/galleries/gal5/New folder/lcc8p8y8ta0efihmcrmn.webp": {
    "type": "image/webp",
    "etag": "\"5ea78-w1GZpqbz0VLA8Ov32clqUVT1R7Q\"",
    "mtime": "2023-12-04T10:27:40.262Z",
    "size": 387704,
    "path": "../public/img/galleries/gal5/New folder/lcc8p8y8ta0efihmcrmn.webp"
  },
  "/img/galleries/gal5/New folder/lrqomvqbphqyoyjipx2r.webp": {
    "type": "image/webp",
    "etag": "\"142e6-gZoxAfvOVAsfcjWH13tAb+luer8\"",
    "mtime": "2023-12-04T10:27:40.263Z",
    "size": 82662,
    "path": "../public/img/galleries/gal5/New folder/lrqomvqbphqyoyjipx2r.webp"
  },
  "/img/galleries/gal5/New folder/lwwdvb9eeoyf4mqv5qca.webp": {
    "type": "image/webp",
    "etag": "\"fac6-ClQTf9+IY2wpa6HB+IMclwj+y1U\"",
    "mtime": "2023-12-04T10:27:40.263Z",
    "size": 64198,
    "path": "../public/img/galleries/gal5/New folder/lwwdvb9eeoyf4mqv5qca.webp"
  },
  "/img/galleries/gal5/New folder/mvtdkaqgs2a40quhaymo.webp": {
    "type": "image/webp",
    "etag": "\"1cdba-UapUXlXdLFmyNtO5fLDqMWcov+g\"",
    "mtime": "2023-12-04T10:27:40.264Z",
    "size": 118202,
    "path": "../public/img/galleries/gal5/New folder/mvtdkaqgs2a40quhaymo.webp"
  },
  "/img/galleries/gal5/New folder/mxx6ubkwcuv43ntghwvq.webp": {
    "type": "image/webp",
    "etag": "\"16ac6-MfSN1t18ljVRhuymMJ0sDtw4dLw\"",
    "mtime": "2023-12-04T10:27:40.265Z",
    "size": 92870,
    "path": "../public/img/galleries/gal5/New folder/mxx6ubkwcuv43ntghwvq.webp"
  },
  "/img/galleries/gal5/New folder/o7zimnfyljxwkklygftk.webp": {
    "type": "image/webp",
    "etag": "\"24f70-ytIop04eIG6IfNoRDP9mvY5pVp4\"",
    "mtime": "2023-12-04T10:27:40.266Z",
    "size": 151408,
    "path": "../public/img/galleries/gal5/New folder/o7zimnfyljxwkklygftk.webp"
  },
  "/img/galleries/gal5/New folder/ozq39nxokm7q7wbo5g5w.webp": {
    "type": "image/webp",
    "etag": "\"689e-PQTFrPkGBBs9gDyA0ers0Qt2TzM\"",
    "mtime": "2023-12-04T10:27:40.266Z",
    "size": 26782,
    "path": "../public/img/galleries/gal5/New folder/ozq39nxokm7q7wbo5g5w.webp"
  },
  "/img/galleries/gal5/New folder/q64ictumjlflhers39c8.webp": {
    "type": "image/webp",
    "etag": "\"b1da-I21ShTLAi8tz2LZjnPJ93FQWU3Q\"",
    "mtime": "2023-12-04T10:27:40.267Z",
    "size": 45530,
    "path": "../public/img/galleries/gal5/New folder/q64ictumjlflhers39c8.webp"
  },
  "/img/galleries/gal5/New folder/qsj7wbpikq4avhlhjug6.webp": {
    "type": "image/webp",
    "etag": "\"30f16-fghIq0ciWqqQmVP770clfIObJMM\"",
    "mtime": "2023-12-04T10:27:40.268Z",
    "size": 200470,
    "path": "../public/img/galleries/gal5/New folder/qsj7wbpikq4avhlhjug6.webp"
  },
  "/img/galleries/gal5/New folder/rvssx1knk9hfzlejysf3.webp": {
    "type": "image/webp",
    "etag": "\"3c60c-3R/jvE+BwNeKDFzxdUE8maN/yaA\"",
    "mtime": "2023-12-04T10:27:40.270Z",
    "size": 247308,
    "path": "../public/img/galleries/gal5/New folder/rvssx1knk9hfzlejysf3.webp"
  },
  "/img/galleries/gal5/New folder/t26vrrcwuijpo2bsd3sq.webp": {
    "type": "image/webp",
    "etag": "\"b5f8-xfygfxuaE3EMj01poSU2CfBFRVQ\"",
    "mtime": "2023-12-04T10:27:40.270Z",
    "size": 46584,
    "path": "../public/img/galleries/gal5/New folder/t26vrrcwuijpo2bsd3sq.webp"
  },
  "/img/galleries/gal5/New folder/upmxf3zmfdt5fhldbfg5.webp": {
    "type": "image/webp",
    "etag": "\"58520-3rW/br89bhUXRWhLNQsOZsSlrRc\"",
    "mtime": "2023-12-04T10:27:40.272Z",
    "size": 361760,
    "path": "../public/img/galleries/gal5/New folder/upmxf3zmfdt5fhldbfg5.webp"
  },
  "/img/galleries/gal5/New folder/vbv8rrrs2g5c5br7ybtq.webp": {
    "type": "image/webp",
    "etag": "\"2ac64-MJESIcl40P8r2yxHw0DWz4hdJ/c\"",
    "mtime": "2023-12-04T10:27:40.272Z",
    "size": 175204,
    "path": "../public/img/galleries/gal5/New folder/vbv8rrrs2g5c5br7ybtq.webp"
  },
  "/img/galleries/gal5/New folder/vhyzh2xffjtxvrl5uroz.webp": {
    "type": "image/webp",
    "etag": "\"78b5c-F065SF0E1AlKW20BysgyDvZ+iM4\"",
    "mtime": "2023-12-04T10:27:40.275Z",
    "size": 494428,
    "path": "../public/img/galleries/gal5/New folder/vhyzh2xffjtxvrl5uroz.webp"
  },
  "/img/galleries/gal5/New folder/wfbjtbtucune8tqporge.webp": {
    "type": "image/webp",
    "etag": "\"4f28-9ulrxx7iqHjq38rTKgkh3+BN4Zo\"",
    "mtime": "2023-12-04T10:27:40.275Z",
    "size": 20264,
    "path": "../public/img/galleries/gal5/New folder/wfbjtbtucune8tqporge.webp"
  },
  "/img/galleries/gal5/New folder/wosjtuwwmk4hc6kewd9z.webp": {
    "type": "image/webp",
    "etag": "\"5516c-sT3NKJfuiWzENgpJjH61178oY6k\"",
    "mtime": "2023-12-04T10:27:40.277Z",
    "size": 348524,
    "path": "../public/img/galleries/gal5/New folder/wosjtuwwmk4hc6kewd9z.webp"
  },
  "/img/galleries/gal5/New folder/xch3rajsixi05pijcklc.webp": {
    "type": "image/webp",
    "etag": "\"48b0c-G97ofGMzIGaPfGmFKpr+1bEnCD4\"",
    "mtime": "2023-12-04T10:27:40.278Z",
    "size": 297740,
    "path": "../public/img/galleries/gal5/New folder/xch3rajsixi05pijcklc.webp"
  },
  "/img/galleries/gal5/New folder/zjycwh468gaxzzjtdu49.webp": {
    "type": "image/webp",
    "etag": "\"8a24-yrnmQ9X5IR9IDFGggViF48wTLhE\"",
    "mtime": "2023-12-04T10:27:40.279Z",
    "size": 35364,
    "path": "../public/img/galleries/gal5/New folder/zjycwh468gaxzzjtdu49.webp"
  },
  "/img/galleries/gal5/New folder/zl9y8hz1spgcq5rayyio.webp": {
    "type": "image/webp",
    "etag": "\"89c8-vVjMTcVBQZDbfFGFYhzonaIQOSE\"",
    "mtime": "2023-12-04T10:27:40.279Z",
    "size": 35272,
    "path": "../public/img/galleries/gal5/New folder/zl9y8hz1spgcq5rayyio.webp"
  },
  "/img/galleries/gal5/New folder/ztug8i4mlxughheqraw0.webp": {
    "type": "image/webp",
    "etag": "\"294ec-kKWuxYTNb7u+i+w470Yf2O0PVK8\"",
    "mtime": "2023-12-04T10:27:40.281Z",
    "size": 169196,
    "path": "../public/img/galleries/gal5/New folder/ztug8i4mlxughheqraw0.webp"
  }
};

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const _EXTNAME_RE = /.(\.[^./]+)$/;
const extname = function(p) {
  const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises$1.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta":{"maxAge":31536000},"/_nuxt/builds":{"maxAge":1},"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    setResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _nG37I7 = lazyEventHandler(() => {
  const ipxOptions = {
    ...useRuntimeConfig().ipx || {},
    dir: fileURLToPath(new URL("../public", globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.req, event.res);
  });
});

const get = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);
const _pick = (obj, condition) => Object.keys(obj).filter(condition).reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
const omit = (keys) => (obj) => keys && keys.length ? _pick(obj, (key) => !keys.includes(key)) : obj;
const apply = (fn) => (data) => Array.isArray(data) ? data.map((item) => fn(item)) : fn(data);
const detectProperties = (keys) => {
  const prefixes = [];
  const properties = [];
  for (const key of keys) {
    if (["$", "_"].includes(key)) {
      prefixes.push(key);
    } else {
      properties.push(key);
    }
  }
  return { prefixes, properties };
};
const withoutKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => !properties.includes(key) && !prefixes.includes(key[0]));
};
const withKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => properties.includes(key) || prefixes.includes(key[0]));
};
const sortList = (data, params) => {
  const comperable = new Intl.Collator(params.$locale, {
    numeric: params.$numeric,
    caseFirst: params.$caseFirst,
    sensitivity: params.$sensitivity
  });
  const keys = Object.keys(params).filter((key) => !key.startsWith("$"));
  for (const key of keys) {
    data = data.sort((a, b) => {
      const values = [get(a, key), get(b, key)].map((value) => {
        if (value === null) {
          return void 0;
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      if (params[key] === -1) {
        values.reverse();
      }
      return comperable.compare(values[0], values[1]);
    });
  }
  return data;
};
const assertArray = (value, message = "Expected an array") => {
  if (!Array.isArray(value)) {
    throw new TypeError(message);
  }
};
const ensureArray = (value) => {
  return Array.isArray(value) ? value : [void 0, null].includes(value) ? [] : [value];
};

const arrayParams = ["sort", "where", "only", "without"];
function createQuery(fetcher, opts = {}) {
  const queryParams = {};
  for (const key of Object.keys(opts.initialParams || {})) {
    queryParams[key] = arrayParams.includes(key) ? ensureArray(opts.initialParams[key]) : opts.initialParams[key];
  }
  const $set = (key, fn = (v) => v) => {
    return (...values) => {
      queryParams[key] = fn(...values);
      return query;
    };
  };
  const resolveResult = (result) => {
    if (opts.legacy) {
      if (result?.surround) {
        return result.surround;
      }
      if (!result) {
        return result;
      }
      if (result?.dirConfig) {
        result.result = {
          _path: result.dirConfig?._path,
          ...result.result,
          _dir: result.dirConfig
        };
      }
      return result?._path || Array.isArray(result) || !Object.prototype.hasOwnProperty.call(result, "result") ? result : result?.result;
    }
    return result;
  };
  const query = {
    params: () => ({
      ...queryParams,
      ...queryParams.where ? { where: [...ensureArray(queryParams.where)] } : {},
      ...queryParams.sort ? { sort: [...ensureArray(queryParams.sort)] } : {}
    }),
    only: $set("only", ensureArray),
    without: $set("without", ensureArray),
    where: $set("where", (q) => [...ensureArray(queryParams.where), ...ensureArray(q)]),
    sort: $set("sort", (sort) => [...ensureArray(queryParams.sort), ...ensureArray(sort)]),
    limit: $set("limit", (v) => parseInt(String(v), 10)),
    skip: $set("skip", (v) => parseInt(String(v), 10)),
    // find
    find: () => fetcher(query).then(resolveResult),
    findOne: () => fetcher($set("first")(true)).then(resolveResult),
    count: () => fetcher($set("count")(true)).then(resolveResult),
    // locale
    locale: (_locale) => query.where({ _locale }),
    withSurround: $set("surround", (surroundQuery, options) => ({ query: surroundQuery, ...options })),
    withDirConfig: () => $set("dirConfig")(true)
  };
  if (opts.legacy) {
    query.findSurround = (surroundQuery, options) => {
      return query.withSurround(surroundQuery, options).find().then(resolveResult);
    };
    return query;
  }
  return query;
}

const defineTransformer = (transformer) => {
  return transformer;
};

function createTokenizer(parser, initialize, from) {
  let point = Object.assign(
    from ? Object.assign({}, from) : {
      line: 1,
      column: 1,
      offset: 0
    },
    {
      _index: 0,
      _bufferIndex: -1
    }
  );
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  const effects = {
    consume,
    enter,
    exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };
  const context = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    return Object.assign({}, point);
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  function main() {
    let chunkIndex;
    while (point._index < chunks.length) {
      const chunk = chunks[point._index];
      if (typeof chunk === "string") {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }
        while (point._index === chunkIndex && point._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code) {
    state = state(code);
  }
  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }
    context.previous = code;
  }
  function enter(type, fields) {
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs) ? (
        /* c8 ignore next 1 */
        handleListOfConstructs(constructs)
      ) : "tokenize" in constructs ? handleListOfConstructs([constructs]) : handleMapOfConstructs(constructs);
      function handleMapOfConstructs(map) {
        return start;
        function start(code) {
          const def = code !== null && map[code];
          const all = code !== null && map.null;
          const list = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(def) ? def : def ? [def] : [],
            ...Array.isArray(all) ? all : all ? [all] : []
          ];
          return handleListOfConstructs(list)(code);
        }
      }
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        if (list.length === 0) {
          return bogusState;
        }
        return handleConstruct(list[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok();
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code);
        }
      }
      function ok(code) {
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code) {
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(
        context.events,
        from2,
        context.events.length - from2,
        construct.resolve(context.events.slice(from2), context)
      );
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      restore,
      from: startEventsIndex
    };
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      view[0] = view[0].slice(startBufferIndex);
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index = -1;
  const result = [];
  let atTab;
  while (++index < chunks.length) {
    const chunk = chunks[index];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else
      switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = "\n";
          break;
        }
        case -3: {
          value = "\r\n";
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab)
            continue;
          value = " ";
          break;
        }
        default: {
          value = String.fromCharCode(chunk);
        }
      }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}

function initializeDocument(effects) {
  const self = this;
  const delimiter = (this.parser.delimiter || ",").charCodeAt(0);
  return enterRow;
  function enterRow(code) {
    return effects.attempt(
      { tokenize: attemptLastLine },
      (code2) => {
        effects.consume(code2);
        return enterRow;
      },
      (code2) => {
        effects.enter("row");
        return enterColumn(code2);
      }
    )(code);
  }
  function enterColumn(code) {
    effects.enter("column");
    return content(code);
  }
  function content(code) {
    if (code === null) {
      effects.exit("column");
      effects.exit("row");
      effects.consume(code);
      return content;
    }
    if (code === 34) {
      return quotedData(code);
    }
    if (code === delimiter) {
      if (self.previous === delimiter || markdownLineEnding(self.previous) || self.previous === null) {
        effects.enter("data");
        effects.exit("data");
      }
      effects.exit("column");
      effects.enter("columnSeparator");
      effects.consume(code);
      effects.exit("columnSeparator");
      effects.enter("column");
      return content;
    }
    if (markdownLineEnding(code)) {
      effects.exit("column");
      effects.enter("newline");
      effects.consume(code);
      effects.exit("newline");
      effects.exit("row");
      return enterRow;
    }
    return data(code);
  }
  function data(code) {
    effects.enter("data");
    return dataChunk(code);
  }
  function dataChunk(code) {
    if (code === null || markdownLineEnding(code) || code === delimiter) {
      effects.exit("data");
      return content(code);
    }
    if (code === 92) {
      return escapeCharacter(code);
    }
    effects.consume(code);
    return dataChunk;
  }
  function escapeCharacter(code) {
    effects.consume(code);
    return function(code2) {
      effects.consume(code2);
      return content;
    };
  }
  function quotedData(code) {
    effects.enter("quotedData");
    effects.enter("quotedDataChunk");
    effects.consume(code);
    return quotedDataChunk;
  }
  function quotedDataChunk(code) {
    if (code === 92) {
      return escapeCharacter(code);
    }
    if (code === 34) {
      return effects.attempt(
        { tokenize: attemptDoubleQuote },
        (code2) => {
          effects.exit("quotedDataChunk");
          effects.enter("quotedDataChunk");
          return quotedDataChunk(code2);
        },
        (code2) => {
          effects.consume(code2);
          effects.exit("quotedDataChunk");
          effects.exit("quotedData");
          return content;
        }
      )(code);
    }
    effects.consume(code);
    return quotedDataChunk;
  }
}
function attemptDoubleQuote(effects, ok, nok) {
  return startSequence;
  function startSequence(code) {
    if (code !== 34) {
      return nok(code);
    }
    effects.enter("quoteFence");
    effects.consume(code);
    return sequence;
  }
  function sequence(code) {
    if (code !== 34) {
      return nok(code);
    }
    effects.consume(code);
    effects.exit("quoteFence");
    return (code2) => ok(code2);
  }
}
function attemptLastLine(effects, ok, nok) {
  return enterLine;
  function enterLine(code) {
    if (!markdownSpace(code) && code !== null) {
      return nok(code);
    }
    effects.enter("emptyLine");
    return continueLine(code);
  }
  function continueLine(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return continueLine;
    }
    if (code === null) {
      effects.exit("emptyLine");
      return ok(code);
    }
    return nok(code);
  }
}
const parse = (options) => {
  return createTokenizer(
    { ...options },
    { tokenize: initializeDocument },
    void 0
  );
};

const own = {}.hasOwnProperty;
const initialPoint = {
  line: 1,
  column: 1,
  offset: 0
};
const fromCSV = function(value, encoding, options) {
  if (typeof encoding !== "string") {
    options = encoding;
    encoding = void 0;
  }
  return compiler()(
    postprocess(
      parse(options).write(preprocess()(value, encoding, true))
    )
  );
};
function compiler() {
  const config = {
    enter: {
      column: opener(openColumn),
      row: opener(openRow),
      data: onenterdata,
      quotedData: onenterdata
    },
    exit: {
      row: closer(),
      column: closer(),
      data: onexitdata,
      quotedData: onexitQuotedData
    }
  };
  return compile;
  function compile(events) {
    const tree = {
      type: "root",
      children: []
    };
    const stack = [tree];
    const tokenStack = [];
    const context = {
      stack,
      tokenStack,
      config,
      enter,
      exit,
      resume
    };
    let index = -1;
    while (++index < events.length) {
      const handler = config[events[index][0]];
      if (own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          Object.assign(
            {
              sliceSerialize: events[index][2].sliceSerialize
            },
            context
          ),
          events[index][1]
        );
      }
    }
    if (tokenStack.length > 0) {
      const tail = tokenStack[tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point(
        events.length > 0 ? events[0][1].start : initialPoint
      ),
      end: point(
        events.length > 0 ? events[events.length - 2][1].end : initialPoint
      )
    };
    return tree;
  }
  function point(d) {
    return {
      line: d.line,
      column: d.column,
      offset: d.offset
    };
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token);
      if (and) {
        and.call(this, token);
      }
    }
  }
  function enter(node, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(node);
    this.stack.push(node);
    this.tokenStack.push([token, errorHandler]);
    node.position = {
      start: point(token.start)
    };
    return node;
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and) {
        and.call(this, token);
      }
      exit.call(this, token);
    }
  }
  function exit(token, onExitError) {
    const node = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error(
        "Cannot close `" + token.type + "` (" + stringifyPosition({
          start: token.start,
          end: token.end
        }) + "): it\u2019s not open"
      );
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node.position.end = point(token.end);
    return node;
  }
  function resume() {
    return toString(this.stack.pop());
  }
  function onenterdata(token) {
    const parent = this.stack[this.stack.length - 1];
    let tail = parent.children[parent.children.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text();
      tail.position = {
        start: point(token.start)
      };
      parent.children.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token).trim().replace(/""/g, '"');
    tail.position.end = point(token.end);
  }
  function onexitQuotedData(token) {
    const tail = this.stack.pop();
    const value = this.sliceSerialize(token);
    tail.value += this.sliceSerialize(token).trim().substring(1, value.length - 1).replace(/""/g, '"');
    tail.position.end = point(token.end);
  }
  function text() {
    return {
      type: "text",
      value: ""
    };
  }
  function openColumn() {
    return {
      type: "column",
      children: []
    };
  }
  function openRow() {
    return {
      type: "row",
      children: []
    };
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      "Cannot close `" + left.type + "` (" + stringifyPosition({
        start: left.start,
        end: left.end
      }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is open"
    );
  } else {
    throw new Error(
      "Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is still open"
    );
  }
}

function csvParse(options) {
  const parser = (doc) => {
    return fromCSV(doc, options);
  };
  Object.assign(this, { Parser: parser });
  const toJsonObject = (tree) => {
    const [header, ...rows] = tree.children;
    const columns = header.children.map((col) => col.children[0].value);
    const data = rows.map((row) => {
      return row.children.reduce((acc, col, i) => {
        acc[String(columns[i])] = col.children[0]?.value;
        return acc;
      }, {});
    });
    return data;
  };
  const toJsonArray = (tree) => {
    const data = tree.children.map((row) => {
      return row.children.map((col) => col.children[0]?.value);
    });
    return data;
  };
  const compiler = (doc) => {
    if (options.json) {
      return toJsonObject(doc);
    }
    return toJsonArray(doc);
  };
  Object.assign(this, { Compiler: compiler });
}
const csv = defineTransformer({
  name: "csv",
  extensions: [".csv"],
  parse: async (_id, content, options = {}) => {
    const stream = unified().use(csvParse, {
      delimiter: ",",
      json: true,
      ...options
    });
    const { result } = await stream.process(content);
    return {
      _id,
      _type: "csv",
      body: result
    };
  }
});

const useProcessorPlugins = async (processor, plugins = {}) => {
  const toUse = Object.entries(plugins).filter((p) => p[1] !== false);
  for (const plugin of toUse) {
    const instance = plugin[1].instance || await import(
      /* @vite-ignore */
      plugin[0]
    ).then((m) => m.default || m);
    processor.use(instance, plugin[1].options);
  }
};

const unsafeLinkPrefix = [
  "javascript:",
  "data:text/html",
  "vbscript:",
  "data:text/javascript",
  "data:text/vbscript",
  "data:text/css",
  "data:text/plain",
  "data:text/xml"
];
const validateProp = (attribute, value) => {
  if (attribute.startsWith("on")) {
    return false;
  }
  if (attribute === "href" || attribute === "src") {
    return !unsafeLinkPrefix.some((prefix) => value.toLowerCase().startsWith(prefix));
  }
  return true;
};
const validateProps = (props) => {
  if (!props) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(props).filter(([name, value]) => {
      const isValid = validateProp(name, value);
      if (!isValid) {
        console.warn(`[@nuxtjs/mdc] removing unsafe attribute: ${name}="${value}"`);
      }
      return isValid;
    })
  );
};

function compileHast() {
  const slugs = new Slugger();
  function compileToJSON(node, parent) {
    if (node.type === "root") {
      return {
        type: "root",
        children: node.children.map((child) => compileToJSON(child, node)).filter(Boolean)
      };
    }
    if (node.type === "element") {
      if (node.tagName === "p" && node.children.every((child) => child.type === "text" && /^\s*$/.test(child.value))) {
        return null;
      }
      if (node.tagName === "li") {
        let hasPreviousParagraph = false;
        node.children = node.children?.flatMap((child) => {
          if (child.type === "element" && child.tagName === "p") {
            if (hasPreviousParagraph) {
              child.children.unshift({
                type: "element",
                tagName: "br",
                properties: {},
                children: []
              });
            }
            hasPreviousParagraph = true;
            return child.children;
          }
          return child;
        });
      }
      if (node.tagName?.match(/^h\d$/)) {
        node.properties = node.properties || {};
        node.properties.id = String(node.properties?.id || slugs.slug(toString$1(node))).replace(/-+/g, "-").replace(/^-|-$/g, "").replace(/^(\d)/, "_$1");
      }
      if (node.tagName === "component-slot") {
        node.tagName = "template";
      }
      return {
        type: "element",
        tag: node.tagName,
        props: validateProps(node.properties),
        children: node.children.map((child) => compileToJSON(child, node)).filter(Boolean)
      };
    }
    if (node.type === "text") {
      if (node.value !== "\n" || parent?.properties?.emptyLinePlaceholder) {
        return {
          type: "text",
          value: node.value
        };
      }
    }
    return null;
  }
  this.Compiler = (tree) => {
    const body = compileToJSON(tree);
    let excerpt = void 0;
    const excerptIndex = tree.children.findIndex((node) => node.type === "comment" && node.value?.trim() === "more");
    if (excerptIndex !== -1) {
      excerpt = compileToJSON({
        type: "root",
        children: tree.children.slice(0, excerptIndex)
      });
      if (excerpt.children.find((node) => node.type === "element" && node.tag === "pre")) {
        const lastChild = body.children[body.children.length - 1];
        if (lastChild.type === "element" && lastChild.tag === "style") {
          excerpt.children.push(lastChild);
        }
      }
    }
    return {
      body,
      excerpt
    };
  };
}

function emphasis(state, node) {
  const result = {
    type: "element",
    tagName: "em",
    properties: node.attributes || {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function parseThematicBlock(lang) {
  if (!lang?.trim()) {
    return {
      language: void 0,
      highlights: void 0,
      filename: void 0,
      meta: void 0
    };
  }
  const languageMatches = lang.replace(/[{|[](.+)/, "").match(/^[^ \t]+(?=[ \t]|$)/);
  const highlightTokensMatches = lang.match(/{([^}]*)}/);
  const filenameMatches = lang.match(/\[((\\]|[^\]])*)\]/);
  const meta = lang.replace(languageMatches?.[0] ?? "", "").replace(highlightTokensMatches?.[0] ?? "", "").replace(filenameMatches?.[0] ?? "", "").trim();
  return {
    language: languageMatches?.[0] || void 0,
    highlights: parseHighlightedLines(highlightTokensMatches?.[1] || void 0),
    // https://github.com/nuxt/content/pull/2169
    filename: filenameMatches?.[1].replace(/\\]/g, "]") || void 0,
    meta
  };
}
function parseHighlightedLines(lines) {
  const lineArray = String(lines || "").split(",").filter(Boolean).flatMap((line) => {
    const [start, end] = line.trim().split("-").map((a) => Number(a.trim()));
    return Array.from({ length: (end || start) - start + 1 }).map((_, i) => start + i);
  });
  return lineArray.length ? lineArray : void 0;
}
const TAG_NAME_REGEXP = /^<\/?([A-Za-z0-9-_]+) ?[^>]*>/;
function getTagName(value) {
  const result = String(value).match(TAG_NAME_REGEXP);
  return result && result[1];
}

const code = (state, node) => {
  const lang = (node.lang || "") + " " + (node.meta || "");
  const { language, highlights, filename, meta } = parseThematicBlock(lang);
  const value = node.value ? detab(node.value + "\n") : "";
  let result = {
    type: "element",
    tagName: "code",
    properties: { __ignoreMap: "" },
    children: [{ type: "text", value }]
  };
  if (meta) {
    result.data = {
      // @ts-ignore
      meta
    };
  }
  state.patch(node, result);
  result = state.applyData(node, result);
  const properties = {
    language,
    filename,
    highlights,
    meta,
    code: value
  };
  if (language) {
    properties.className = ["language-" + language];
  }
  result = { type: "element", tagName: "pre", properties, children: [result] };
  state.patch(node, result);
  return result;
};

function html(state, node) {
  const tagName = getTagName(node.value);
  if (tagName && /[A-Z]/.test(tagName)) {
    node.value = node.value.replace(tagName, kebabCase(tagName));
  }
  if (state.dangerous || state.options?.allowDangerousHtml) {
    const result = { type: "raw", value: node.value };
    state.patch(node, result);
    return state.applyData(node, result);
  }
  return void 0;
}

function link$1(state, node) {
  const properties = {
    ...node.attributes || {},
    href: normalizeUri(node.url)
  };
  if (node.title !== null && node.title !== void 0) {
    properties.title = node.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function list(state, node) {
  const properties = {};
  const results = state.all(node);
  let index = -1;
  if (typeof node.start === "number" && node.start !== 1) {
    properties.start = node.start;
  }
  while (++index < results.length) {
    const child = results[index];
    if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
      properties.className = ["contains-task-list"];
      break;
    }
  }
  if ((node.children || []).some((child) => typeof child.checked === "boolean")) {
    properties.className = ["contains-task-list"];
  }
  const result = {
    type: "element",
    tagName: node.ordered ? "ol" : "ul",
    properties,
    children: state.wrap(results, true)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

const htmlTags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];

function paragraph(state, node) {
  if (node.children && node.children[0] && node.children[0].type === "html") {
    const tagName = kebabCase(getTagName(node.children[0].value) || "div");
    if (!htmlTags.includes(tagName)) {
      return state.all(node);
    }
  }
  const result = {
    type: "element",
    tagName: "p",
    properties: {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function image(state, node) {
  const properties = { ...node.attributes, src: normalizeUri(node.url) };
  if (node.alt !== null && node.alt !== void 0) {
    properties.alt = node.alt;
  }
  if (node.title !== null && node.title !== void 0) {
    properties.title = node.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node, result);
  return state.applyData(node, result);
}

function strong(state, node) {
  const result = {
    type: "element",
    tagName: "strong",
    properties: node.attributes || {},
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}

function inlineCode(state, node) {
  const language = node.attributes?.language || node.attributes?.lang;
  const text = { type: "text", value: node.value.replace(/\r?\n|\r/g, " ") };
  state.patch(node, text);
  const result = {
    type: "element",
    tagName: "code",
    properties: node.attributes || {},
    children: [text]
  };
  const classes = (result.properties.class || "").split(" ");
  delete result.properties.class;
  if (language) {
    result.properties.language = language;
    delete result.properties.lang;
    classes.push("language-" + language);
  }
  result.properties.className = classes.join(" ");
  state.patch(node, result);
  return state.applyData(node, result);
}

function containerComponent(state, node) {
  const result = {
    type: "element",
    tagName: node.name,
    properties: {
      ...node.attributes,
      ...node.data?.hProperties
    },
    children: state.all(node)
  };
  state.patch(node, result);
  result.attributes = node.attributes;
  result.fmAttributes = node.fmAttributes;
  return result;
}

const handlers$1 = {
  emphasis,
  code,
  link: link$1,
  paragraph,
  html,
  list,
  image,
  strong,
  inlineCode,
  containerComponent
};

const defaults = {
  remark: {
    plugins: {
      "remark-mdc": {
        instance: remarkMDC
      },
      "remark-emoji": {
        instance: remarkEmoji
      },
      "remark-gfm": {
        instance: remarkGFM
      }
    }
  },
  rehype: {
    options: {
      // @ts-ignore
      handlers: handlers$1,
      allowDangerousHtml: true
    },
    plugins: {
      "rehype-external-links": {
        instance: rehypeExternalLinks
      },
      "rehype-sort-attribute-values": {
        instance: rehypeSortAttributeValues
      },
      "rehype-sort-attributes": {
        instance: rehypeSortAttributes
      },
      "rehype-raw": {
        instance: rehypeRaw,
        options: {
          passThrough: ["element"]
        }
      }
    }
  },
  highlight: false,
  toc: {
    searchDepth: 2,
    depth: 2
  }
};

function flattenNodeText(node) {
  if (node.type === "text") {
    return node.value || "";
  } else {
    return (node.children || []).reduce((text, child) => {
      return text.concat(flattenNodeText(child));
    }, "");
  }
}
function flattenNode(node, maxDepth = 2, _depth = 0) {
  if (!Array.isArray(node.children) || _depth === maxDepth) {
    return [node];
  }
  return [
    node,
    ...node.children.reduce((acc, child) => acc.concat(flattenNode(child, maxDepth, _depth + 1)), [])
  ];
}

const TOC_TAGS = ["h2", "h3", "h4", "h5", "h6"];
const TOC_TAGS_DEPTH = TOC_TAGS.reduce((tags, tag) => {
  tags[tag] = Number(tag.charAt(tag.length - 1));
  return tags;
}, {});
const getHeaderDepth = (node) => TOC_TAGS_DEPTH[node.tag];
const getTocTags = (depth) => {
  if (depth < 1 || depth > 5) {
    console.log(`\`toc.depth\` is set to ${depth}. It should be a number between 1 and 5. `);
    depth = 1;
  }
  return TOC_TAGS.slice(0, depth);
};
function nestHeaders(headers) {
  if (headers.length <= 1) {
    return headers;
  }
  const toc = [];
  let parent;
  headers.forEach((header) => {
    if (!parent || header.depth <= parent.depth) {
      header.children = [];
      parent = header;
      toc.push(header);
    } else {
      parent.children.push(header);
    }
  });
  toc.forEach((header) => {
    if (header.children?.length) {
      header.children = nestHeaders(header.children);
    } else {
      delete header.children;
    }
  });
  return toc;
}
function generateFlatToc(body, options) {
  const { searchDepth, depth, title = "" } = options;
  const tags = getTocTags(depth);
  const headers = flattenNode(body, searchDepth).filter((node) => tags.includes(node.tag || ""));
  const links = headers.map((node) => ({
    id: node.props?.id,
    depth: getHeaderDepth(node),
    text: flattenNodeText(node)
  }));
  return {
    title,
    searchDepth,
    depth,
    links
  };
}
function generateToc(body, options) {
  const toc = generateFlatToc(body, options);
  toc.links = nestHeaders(toc.links);
  return toc;
}

function isTag(vnode, tag) {
  if (vnode.type === tag) {
    return true;
  }
  if (typeof vnode.type === "object" && vnode.type.tag === tag) {
    return true;
  }
  if (vnode.tag === tag) {
    return true;
  }
  return false;
}
function isText(vnode) {
  return isTag(vnode, "text") || isTag(vnode, Symbol.for("v-txt"));
}
function nodeChildren(node) {
  if (Array.isArray(node.children) || typeof node.children === "string") {
    return node.children;
  }
  if (typeof node.children?.default === "function") {
    return node.children.default();
  }
  return [];
}
function nodeTextContent(node) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join("");
  }
  if (isText(node)) {
    return node.children || node.value || "";
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).filter(Boolean).join("");
  }
  return "";
}

let moduleOptions;
const parseMarkdown = async (md, opts = {}) => {
  if (!moduleOptions) {
    moduleOptions = await import(
      '../build/mdc-imports.mjs'
      /* @vite-ignore */
    ).catch(() => ({}));
  }
  const options = defu(opts, {
    remark: { plugins: moduleOptions?.remarkPlugins },
    rehype: { plugins: moduleOptions?.rehypePlugins },
    highlight: moduleOptions?.highlight
  }, defaults);
  if (options.rehype?.plugins?.highlight) {
    options.rehype.plugins.highlight.options = options.highlight || {};
  }
  const { content, data: frontmatter } = await parseFrontMatter(md);
  const processor = unified();
  processor.use(remarkParse);
  await useProcessorPlugins(processor, options.remark?.plugins);
  processor.use(remark2rehype, options.rehype?.options);
  await useProcessorPlugins(processor, options.rehype?.plugins);
  processor.use(compileHast);
  const processedFile = await processor.process({ value: content, data: frontmatter });
  const result = processedFile.result;
  const data = Object.assign(
    contentHeading(result.body),
    frontmatter,
    processedFile?.data || {}
  );
  let toc;
  if (data.toc !== false) {
    const tocOption = defu(data.toc || {}, options.toc);
    toc = generateToc(result.body, tocOption);
  }
  return {
    data,
    body: result.body,
    excerpt: result.excerpt,
    toc
  };
};
function contentHeading(body) {
  let title = "";
  let description = "";
  const children = body.children.filter((node) => node.type !== "text" && node.tag !== "hr");
  if (children.length && children[0].tag === "h1") {
    const node = children.shift();
    title = nodeTextContent(node);
  }
  if (children.length && children[0].tag === "p") {
    const node = children.shift();
    description = nodeTextContent(node);
  }
  return {
    title,
    description
  };
}

const SEMVER_REGEX = /^(\d+)(\.\d+)*(\.x)?$/;
const describeId = (id) => {
  const [_source, ...parts] = id.split(":");
  const [, filename, _extension] = parts[parts.length - 1]?.match(/(.*)\.([^.]+)$/) || [];
  if (filename) {
    parts[parts.length - 1] = filename;
  }
  const _path = (parts || []).join("/");
  return {
    _source,
    _path,
    _extension,
    _file: _extension ? `${_path}.${_extension}` : _path
  };
};
const pathMeta = defineTransformer({
  name: "path-meta",
  extensions: [".*"],
  transform(content, options = {}) {
    const { locales = [], defaultLocale = "en", respectPathCase = false } = options;
    const { _source, _file, _path, _extension } = describeId(content._id);
    const parts = _path.split("/");
    const _locale = locales.includes(parts[0]) ? parts.shift() : defaultLocale;
    const filePath = generatePath(parts.join("/"), { respectPathCase });
    return {
      _path: filePath,
      _dir: filePath.split("/").slice(-2)[0],
      _draft: content._draft ?? isDraft(_path),
      _partial: isPartial(_path),
      _locale,
      ...content,
      // TODO: move title to Markdown parser
      title: content.title || generateTitle(refineUrlPart(parts[parts.length - 1])),
      _source,
      _file,
      _extension
    };
  }
});
const isDraft = (path) => !!path.match(/\.draft(\/|\.|$)/);
const isPartial = (path) => path.split(/[:/]/).some((part) => part.match(/^_.*/));
const generatePath = (path, { forceLeadingSlash = true, respectPathCase = false } = {}) => {
  path = path.split("/").map((part) => slugify(refineUrlPart(part), { lower: !respectPathCase })).join("/");
  return forceLeadingSlash ? withLeadingSlash(withoutTrailingSlash(path)) : path;
};
const generateTitle = (path) => path.split(/[\s-]/g).map(pascalCase).join(" ");
function refineUrlPart(name) {
  name = name.split(/[/:]/).pop();
  if (SEMVER_REGEX.test(name)) {
    return name;
  }
  return name.replace(/(\d+\.)?(.*)/, "$2").replace(/^index(\.draft)?$/, "").replace(/\.draft$/, "");
}

const markdown = defineTransformer({
  name: "markdown",
  extensions: [".md"],
  parse: async (_id, content, options = {}) => {
    const config = { ...options };
    config.rehypePlugins = await importPlugins(config.rehypePlugins);
    config.remarkPlugins = await importPlugins(config.remarkPlugins);
    const parsed = await parseMarkdown(content, {
      highlight: options.highlight,
      remark: {
        plugins: config.remarkPlugins
      },
      rehype: {
        options: {
          handlers: {
            link
          }
        },
        plugins: config.rehypePlugins
      },
      toc: config.toc
    });
    return {
      ...parsed.data,
      excerpt: parsed.excerpt,
      body: {
        ...parsed.body,
        toc: parsed.toc
      },
      _type: "markdown",
      _id
    };
  }
});
async function importPlugins(plugins = {}) {
  const resolvedPlugins = {};
  for (const [name, plugin] of Object.entries(plugins)) {
    if (plugin) {
      resolvedPlugins[name] = {
        instance: plugin.instance || await import(
          /* @vite-ignore */
          name
        ).then((m) => m.default || m),
        options: plugin
      };
    } else {
      resolvedPlugins[name] = false;
    }
  }
  return resolvedPlugins;
}
function link(state, node) {
  const properties = {
    ...node.attributes || {},
    href: normalizeUri(normalizeLink(node.url))
  };
  if (node.title !== null && node.title !== void 0) {
    properties.title = node.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node)
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
function normalizeLink(link2) {
  const match = link2.match(/#.+$/);
  const hash = match ? match[0] : "";
  if (link2.replace(/#.+$/, "").endsWith(".md") && (isRelative(link2) || !/^https?/.test(link2) && !link2.startsWith("/"))) {
    return generatePath(link2.replace(".md" + hash, ""), { forceLeadingSlash: false }) + hash;
  } else {
    return link2;
  }
}

const yaml = defineTransformer({
  name: "Yaml",
  extensions: [".yml", ".yaml"],
  parse: (_id, content) => {
    const { data } = parseFrontMatter(`---
${content}
---`);
    let parsed = data;
    if (Array.isArray(data)) {
      console.warn(`YAML array is not supported in ${_id}, moving the array into the \`body\` key`);
      parsed = { body: data };
    }
    return {
      ...parsed,
      _id,
      _type: "yaml"
    };
  }
});

const json = defineTransformer({
  name: "Json",
  extensions: [".json", ".json5"],
  parse: async (_id, content) => {
    let parsed;
    if (typeof content === "string") {
      if (_id.endsWith("json5")) {
        parsed = (await import('json5').then((m) => m.default || m)).parse(content);
      } else if (_id.endsWith("json")) {
        parsed = destr(content);
      }
    } else {
      parsed = content;
    }
    if (Array.isArray(parsed)) {
      console.warn(`JSON array is not supported in ${_id}, moving the array into the \`body\` key`);
      parsed = {
        body: parsed
      };
    }
    return {
      ...parsed,
      _id,
      _type: "json"
    };
  }
});

const TRANSFORMERS = [
  csv,
  markdown,
  json,
  yaml,
  pathMeta
];
function getParser(ext, additionalTransformers = []) {
  let parser = additionalTransformers.find((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.parse);
  if (!parser) {
    parser = TRANSFORMERS.find((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.parse);
  }
  return parser;
}
function getTransformers(ext, additionalTransformers = []) {
  return [
    ...additionalTransformers.filter((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.transform),
    ...TRANSFORMERS.filter((p) => ext.match(new RegExp(p.extensions.join("|"), "i")) && p.transform)
  ];
}
async function transformContent(id, content, options = {}) {
  const { transformers = [] } = options;
  const file = { _id: id, body: content };
  const ext = extname(id);
  const parser = getParser(ext, transformers);
  if (!parser) {
    console.warn(`${ext} files are not supported, "${id}" falling back to raw content`);
    return file;
  }
  const parserOptions = options[camelCase(parser.name)] || {};
  const parsed = await parser.parse(file._id, file.body, parserOptions);
  const matchedTransformers = getTransformers(ext, transformers);
  const result = await matchedTransformers.reduce(async (prev, cur) => {
    const next = await prev || parsed;
    const transformOptions = options[camelCase(cur.name)];
    if (transformOptions === false) {
      return next;
    }
    return cur.transform(next, transformOptions || {});
  }, Promise.resolve(parsed));
  return result;
}

function makeIgnored(ignores) {
  const rxAll = ["/\\.", "/-", ...ignores.filter((p) => p)].map((p) => new RegExp(p));
  return function isIgnored(key) {
    const path = "/" + key.replace(/:/g, "/");
    return rxAll.some((rx) => rx.test(path));
  };
}

function createMatch(opts = {}) {
  const operators = createOperators(match, opts.operators);
  function match(item, conditions) {
    if (typeof conditions !== "object" || conditions instanceof RegExp) {
      return operators.$eq(item, conditions);
    }
    return Object.keys(conditions || {}).every((key) => {
      const condition = conditions[key];
      if (key.startsWith("$") && operators[key]) {
        const fn = operators[key];
        return typeof fn === "function" ? fn(item, condition) : false;
      }
      return match(get(item, key), condition);
    });
  }
  return match;
}
function createOperators(match, operators = {}) {
  return {
    $match: (item, condition) => match(item, condition),
    /**
     * Match if item equals condition
     **/
    $eq: (item, condition) => condition instanceof RegExp ? condition.test(item) : item === condition,
    /**
     * Match if item not equals condition
     **/
    $ne: (item, condition) => condition instanceof RegExp ? !condition.test(item) : item !== condition,
    /**
     * Match is condition is false
     **/
    $not: (item, condition) => !match(item, condition),
    /**
     * Match only if all of nested conditions are true
     **/
    $and: (item, condition) => {
      assertArray(condition, "$and requires an array as condition");
      return condition.every((cond) => match(item, cond));
    },
    /**
     * Match if any of nested conditions is true
     **/
    $or: (item, condition) => {
      assertArray(condition, "$or requires an array as condition");
      return condition.some((cond) => match(item, cond));
    },
    /**
     * Match if item is in condition array
     **/
    $in: (item, condition) => ensureArray(condition).some(
      (cond) => Array.isArray(item) ? match(item, { $contains: cond }) : match(item, cond)
    ),
    /**
     * Match if item contains every condition or math every rule in condition array
     **/
    $contains: (item, condition) => {
      item = Array.isArray(item) ? item : String(item);
      return ensureArray(condition).every((i) => item.includes(i));
    },
    /**
     * Ignore case contains
     **/
    $icontains: (item, condition) => {
      if (typeof condition !== "string") {
        throw new TypeError("$icontains requires a string, use $contains instead");
      }
      item = String(item).toLocaleLowerCase();
      return ensureArray(condition).every((i) => item.includes(i.toLocaleLowerCase()));
    },
    /**
     * Match if item contains at least one rule from condition array
     */
    $containsAny: (item, condition) => {
      assertArray(condition, "$containsAny requires an array as condition");
      item = Array.isArray(item) ? item : String(item);
      return condition.some((i) => item.includes(i));
    },
    /**
     * Check key existence
     */
    $exists: (item, condition) => condition ? typeof item !== "undefined" : typeof item === "undefined",
    /**
     * Match if type of item equals condition
     */
    $type: (item, condition) => typeof item === String(condition),
    /**
     * Provides regular expression capabilities for pattern matching strings.
     */
    $regex: (item, condition) => {
      if (!(condition instanceof RegExp)) {
        const matched = String(condition).match(/\/(.*)\/([dgimsuy]*)$/);
        condition = matched ? new RegExp(matched[1], matched[2] || "") : new RegExp(condition);
      }
      return condition.test(String(item || ""));
    },
    /**
     * Check if item is less than condition
     */
    $lt: (item, condition) => {
      return item < condition;
    },
    /**
     * Check if item is less than or equal to condition
     */
    $lte: (item, condition) => {
      return item <= condition;
    },
    /**
     * Check if item is greater than condition
     */
    $gt: (item, condition) => {
      return item > condition;
    },
    /**
     * Check if item is greater than or equal to condition
     */
    $gte: (item, condition) => {
      return item >= condition;
    },
    ...operators || {}
  };
}

function createPipelineFetcher(getContentsList) {
  const match = createMatch();
  const surround = (data, { query, before, after }) => {
    const matchQuery = typeof query === "string" ? { _path: query } : query;
    const index = data.findIndex((item) => match(item, matchQuery));
    before = before ?? 1;
    after = after ?? 1;
    const slice = new Array(before + after).fill(null, 0);
    return index === -1 ? slice : slice.map((_, i) => data[index - before + i + Number(i >= before)] || null);
  };
  const matchingPipelines = [
    // Conditions
    (state, params) => {
      const filtered = state.result.filter((item) => ensureArray(params.where).every((matchQuery) => match(item, matchQuery)));
      return {
        ...state,
        result: filtered,
        total: filtered.length
      };
    },
    // Sort data
    (state, params) => ensureArray(params.sort).forEach((options) => sortList(state.result, options)),
    function fetchSurround(state, params, db) {
      if (params.surround) {
        let _surround = surround(state.result?.length === 1 ? db : state.result, params.surround);
        _surround = apply(withoutKeys(params.without))(_surround);
        _surround = apply(withKeys(params.only))(_surround);
        state.surround = _surround;
      }
      return state;
    }
  ];
  const transformingPiples = [
    // Skip first items
    (state, params) => {
      if (params.skip) {
        return {
          ...state,
          result: state.result.slice(params.skip),
          skip: params.skip
        };
      }
    },
    // Pick first items
    (state, params) => {
      if (params.limit) {
        return {
          ...state,
          result: state.result.slice(0, params.limit),
          limit: params.limit
        };
      }
    },
    function fetchDirConfig(state, params, db) {
      if (params.dirConfig) {
        const path = state.result[0]?._path || params.where?.find((w) => w._path)?._path;
        if (typeof path === "string") {
          const dirConfig = db.find((item) => item._path === joinURL(path, "_dir"));
          if (dirConfig) {
            state.dirConfig = { _path: dirConfig._path, ...withoutKeys(["_"])(dirConfig) };
          }
        }
      }
      return state;
    },
    // Remove unwanted fields
    (state, params) => ({
      ...state,
      result: apply(withoutKeys(params.without))(state.result)
    }),
    // Select only wanted fields
    (state, params) => ({
      ...state,
      result: apply(withKeys(params.only))(state.result)
    })
  ];
  return async (query) => {
    const db = await getContentsList();
    const params = query.params();
    const result1 = {
      result: db,
      limit: 0,
      skip: 0,
      total: db.length
    };
    const matchedData = matchingPipelines.reduce(($data, pipe) => pipe($data, params, db) || $data, result1);
    if (params.count) {
      return {
        result: matchedData.result.length
      };
    }
    const result = transformingPiples.reduce(($data, pipe) => pipe($data, params, db) || $data, matchedData);
    if (params.first) {
      return {
        ...omit(["skip", "limit", "total"])(result),
        result: result.result[0]
      };
    }
    return result;
  };
}

const isPreview = (event) => {
  const previewToken = getQuery(event).previewToken || getCookie(event, "previewToken");
  return !!previewToken;
};
const getPreview = (event) => {
  const key = getQuery(event).previewToken || getCookie(event, "previewToken");
  return { key };
};

async function getContentIndex(event) {
  const defaultLocale = useRuntimeConfig().content.defaultLocale;
  let contentIndex = await cacheStorage.getItem("content-index.json");
  if (!contentIndex) {
    const data = await getContentsList(event);
    contentIndex = data.reduce((acc, item) => {
      acc[item._path] = acc[item._path] || [];
      if (item._locale === defaultLocale) {
        acc[item._path].unshift(item._id);
      } else {
        acc[item._path].push(item._id);
      }
      return acc;
    }, {});
    await cacheStorage.setItem("content-index.json", contentIndex);
  }
  return contentIndex;
}
async function getIndexedContentsList(event, query) {
  const params = query.params();
  const path = params?.where?.find((wh) => wh._path)?._path;
  if (!isPreview(event) && !params.surround && !params.dirConfig && (typeof path === "string" || path instanceof RegExp)) {
    const index = await getContentIndex(event);
    const keys = Object.keys(index).filter((key) => path.test ? path.test(key) : key === String(path)).flatMap((key) => index[key]);
    const contents = await Promise.all(keys.map((key) => getContent(event, key)));
    return contents;
  }
  return getContentsList(event);
}

const transformers = [];

const sourceStorage = prefixStorage(useStorage(), "content:source");
const cacheStorage = prefixStorage(useStorage(), "cache:content");
const cacheParsedStorage = prefixStorage(useStorage(), "cache:content:parsed");
const contentConfig = useRuntimeConfig().content;
const isIgnored = makeIgnored(contentConfig.ignores);
const invalidKeyCharacters = `'"?#/`.split("");
const contentIgnorePredicate = (key) => {
  if (key.startsWith("preview:") || isIgnored(key)) {
    return false;
  }
  if (invalidKeyCharacters.some((ik) => key.includes(ik))) {
    console.warn(`Ignoring [${key}]. File name should not contain any of the following characters: ${invalidKeyCharacters.join(", ")}`);
    return false;
  }
  return true;
};
const getContentsIds = async (event, prefix) => {
  let keys = [];
  {
    keys = await cacheParsedStorage.getKeys(prefix);
  }
  if (keys.length === 0) {
    keys = await sourceStorage.getKeys(prefix);
  }
  if (isPreview(event)) {
    const { key } = getPreview(event);
    const previewPrefix = `preview:${key}:${prefix || ""}`;
    const previewKeys = await sourceStorage.getKeys(previewPrefix);
    if (previewKeys.length) {
      const keysSet = new Set(keys);
      await Promise.all(
        previewKeys.map(async (key2) => {
          const meta = await sourceStorage.getMeta(key2);
          if (meta?.__deleted) {
            keysSet.delete(key2.substring(previewPrefix.length));
          } else {
            keysSet.add(key2.substring(previewPrefix.length));
          }
        })
      );
      keys = Array.from(keysSet);
    }
  }
  return keys.filter(contentIgnorePredicate);
};
function* chunksFromArray(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}
const getContentsList = async (event, prefix) => {
  const keys = await getContentsIds(event, prefix);
  const keyChunks = [...chunksFromArray(keys, 10)];
  const contents = [];
  for (const chunk of keyChunks) {
    const result = await Promise.all(chunk.map((key) => getContent(event, key)));
    contents.push(...result);
  }
  return contents;
};
const pendingPromises = {};
const getContent = async (event, id) => {
  const contentId = id;
  if (!contentIgnorePredicate(id)) {
    return { _id: contentId, body: null };
  }
  if (isPreview(event)) {
    const { key } = getPreview(event);
    const previewId = `preview:${key}:${id}`;
    const draft = await sourceStorage.getItem(previewId);
    if (draft) {
      id = previewId;
    }
  }
  const cached = await cacheParsedStorage.getItem(id);
  if (cached) {
    return cached.parsed;
  }
  const meta = await sourceStorage.getMeta(id);
  const mtime = meta.mtime;
  const size = meta.size || 0;
  const hash$1 = hash({
    // Last modified time
    mtime,
    // File size
    size,
    // Add Content version to the hash, to revalidate the cache on content update
    version: contentConfig.cacheVersion,
    integrity: contentConfig.cacheIntegrity
  });
  if (cached?.hash === hash$1) {
    return cached.parsed;
  }
  if (!pendingPromises[id + hash$1]) {
    pendingPromises[id + hash$1] = new Promise(async (resolve) => {
      const body = await sourceStorage.getItem(id);
      if (body === null) {
        return resolve({ _id: contentId, body: null });
      }
      const parsed = await parseContent(contentId, body);
      await cacheParsedStorage.setItem(id, { parsed, hash: hash$1 }).catch(() => {
      });
      resolve(parsed);
      delete pendingPromises[id + hash$1];
    });
  }
  return pendingPromises[id + hash$1];
};
const parseContent = async (id, content, opts = {}) => {
  const nitroApp = useNitroApp();
  const options = defu(
    opts,
    {
      markdown: {
        ...contentConfig.markdown,
        highlight: contentConfig.highlight
      },
      csv: contentConfig.csv,
      yaml: contentConfig.yaml,
      transformers: transformers,
      pathMeta: {
        defaultLocale: contentConfig.defaultLocale,
        locales: contentConfig.locales,
        respectPathCase: contentConfig.respectPathCase
      }
    }
  );
  const file = { _id: id, body: typeof content === "string" ? content.replace(/\r\n|\r/g, "\n") : content };
  await nitroApp.hooks.callHook("content:file:beforeParse", file);
  const result = await transformContent(id, file.body, options);
  await nitroApp.hooks.callHook("content:file:afterParse", result);
  return result;
};
const createServerQueryFetch = (event) => (query) => {
  return createPipelineFetcher(() => getIndexedContentsList(event, query))(query);
};
function serverQueryContent(event, query, ...pathParts) {
  const { advanceQuery } = useRuntimeConfig().public.content.experimental;
  const queryBuilder = advanceQuery ? createQuery(createServerQueryFetch(event), { initialParams: typeof query !== "string" ? query || {} : {}, legacy: false }) : createQuery(createServerQueryFetch(event), { initialParams: typeof query !== "string" ? query || {} : {}, legacy: true });
  let path;
  if (typeof query === "string") {
    path = withLeadingSlash(joinURL(query, ...pathParts));
  }
  const originalParamsFn = queryBuilder.params;
  queryBuilder.params = () => {
    const params = originalParamsFn();
    if (path) {
      params.where = params.where || [];
      if (params.first && (params.where || []).length === 0) {
        params.where.push({ _path: withoutTrailingSlash(path) });
      } else {
        params.where.push({ _path: new RegExp(`^${path.replace(/[-[\]{}()*+.,^$\s/]/g, "\\$&")}`) });
      }
    }
    if (!params.sort?.length) {
      params.sort = [{ _file: 1, $numeric: true }];
    }
    if (contentConfig.locales.length) {
      const queryLocale = params.where?.find((w) => w._locale)?._locale;
      if (!queryLocale) {
        params.where = params.where || [];
        params.where.push({ _locale: contentConfig.defaultLocale });
      }
    }
    return params;
  };
  return queryBuilder;
}

function jsonParse(value) {
  return JSON.parse(value, regExpReviver);
}
function regExpReviver(_key, value) {
  const withOperator = typeof value === "string" && value.match(/^--([A-Z]+) (.+)$/) || [];
  if (withOperator[1] === "REGEX") {
    const regex = withOperator[2].match(/\/(.*)\/([dgimsuy]*)$/);
    return regex ? new RegExp(regex[1], regex[2] || "") : value;
  }
  return value;
}

const parseJSONQueryParams = (body) => {
  try {
    return jsonParse(body);
  } catch (e) {
    throw createError$1({ statusCode: 400, message: "Invalid _params query" });
  }
};
const decodeQueryParams = (encoded) => {
  encoded = encoded.replace(/\//g, "");
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  encoded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, "=");
  return parseJSONQueryParams(typeof Buffer !== "undefined" ? Buffer.from(encoded, "base64").toString() : atob(encoded));
};
const memory = {};
const getContentQuery = (event) => {
  const { params } = event.context.params || {};
  if (params) {
    return decodeQueryParams(params.replace(/.json$/, ""));
  }
  const qid = event.context.params?.qid?.replace(/.json$/, "");
  const query = getQuery(event) || {};
  if (qid && query._params) {
    memory[qid] = parseJSONQueryParams(decodeURIComponent(query._params));
    if (memory[qid].where && !Array.isArray(memory[qid].where)) {
      memory[qid].where = [memory[qid].where];
    }
    return memory[qid];
  }
  if (qid && memory[qid]) {
    return memory[qid];
  }
  if (query._params) {
    return parseJSONQueryParams(decodeURIComponent(query._params));
  }
  if (typeof query.only === "string" && query.only.includes(",")) {
    query.only = query.only.split(",").map((s) => s.trim());
  }
  if (typeof query.without === "string" && query.without.includes(",")) {
    query.without = query.without.split(",").map((s) => s.trim());
  }
  const where = query.where || {};
  for (const key of ["draft", "partial", "empty"]) {
    if (query[key] && ["true", "false"].includes(query[key])) {
      where[key] = query[key] === "true";
      delete query[key];
    }
  }
  if (query.sort) {
    query.sort = String(query.sort).split(",").map((s) => {
      const [key, order] = s.split(":");
      return [key, +order];
    });
  }
  const reservedKeys = ["partial", "draft", "only", "without", "where", "sort", "limit", "skip"];
  for (const key of Object.keys(query)) {
    if (reservedKeys.includes(key)) {
      continue;
    }
    query.where = query.where || {};
    query.where[key] = query[key];
  }
  if (Object.keys(where).length > 0) {
    query.where = [where];
  } else {
    delete query.where;
  }
  return query;
};

const _pDFILU = defineEventHandler(async (event) => {
  const query = getContentQuery(event);
  const { advanceQuery } = useRuntimeConfig().public.content.experimental;
  if (query.first) {
    let contentQuery = serverQueryContent(event, query);
    if (!advanceQuery) {
      contentQuery = contentQuery.withDirConfig();
    }
    const content = await contentQuery.findOne();
    const _result = advanceQuery ? content?.result : content;
    const missing = !_result && !content?.dirConfig?.navigation?.redirect && !content?._dir?.navigation?.redirect;
    if (missing) {
      throw createError$1({
        statusMessage: "Document not found!",
        statusCode: 404,
        data: {
          description: "Could not find document for the given query.",
          query
        }
      });
    }
    return content;
  }
  if (query.count) {
    return serverQueryContent(event, query).count();
  }
  return serverQueryContent(event, query).find();
});

const _zAUuW3 = defineEventHandler(async (event) => {
  const { content } = useRuntimeConfig();
  const now = Date.now();
  const contents = await serverQueryContent(event).find();
  await getContentIndex(event);
  const navigation = await $fetch(`${content.api.baseURL}/navigation`);
  await cacheStorage.setItem("content-navigation.json", navigation);
  return {
    generatedAt: now,
    generateTime: Date.now() - now,
    contents,
    navigation
  };
});

function createNav(contents, configs) {
  const { navigation } = useRuntimeConfig().public.content;
  const pickNavigationFields = (content) => ({
    ...pick(["title", ...navigation.fields])(content),
    ...isObject(content?.navigation) ? content.navigation : {}
  });
  const nav = contents.sort((a, b) => a._path.localeCompare(b._path)).reduce((nav2, content) => {
    const parts = content._path.substring(1).split("/");
    const idParts = content._id.split(":").slice(1);
    const isIndex = !!idParts[idParts.length - 1].match(/([1-9][0-9]*\.)?index.md/g);
    const getNavItem = (content2) => ({
      title: content2.title,
      _path: content2._path,
      _file: content2._file,
      children: [],
      ...pickNavigationFields(content2),
      ...content2._draft ? { _draft: true } : {}
    });
    const navItem = getNavItem(content);
    if (isIndex) {
      const dirConfig = configs[navItem._path];
      if (typeof dirConfig?.navigation !== "undefined" && !dirConfig?.navigation) {
        return nav2;
      }
      if (content._path !== "/") {
        const indexItem = getNavItem(content);
        navItem.children.push(indexItem);
      }
      Object.assign(
        navItem,
        pickNavigationFields(dirConfig)
      );
    }
    if (parts.length === 1) {
      nav2.push(navItem);
      return nav2;
    }
    const siblings = parts.slice(0, -1).reduce((nodes, part, i) => {
      const currentPathPart = "/" + parts.slice(0, i + 1).join("/");
      const conf = configs[currentPathPart];
      if (typeof conf?.navigation !== "undefined" && !conf.navigation) {
        return [];
      }
      let parent = nodes.find((n) => n._path === currentPathPart);
      if (!parent) {
        parent = {
          title: generateTitle(part),
          _path: currentPathPart,
          _file: content._file,
          children: [],
          ...pickNavigationFields(conf)
        };
        nodes.push(parent);
      }
      return parent.children;
    }, nav2);
    siblings.push(navItem);
    return nav2;
  }, []);
  return sortAndClear(nav);
}
const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
function sortAndClear(nav) {
  const sorted = nav.sort((a, b) => collator.compare(a._file, b._file));
  for (const item of sorted) {
    if (item.children?.length) {
      sortAndClear(item.children);
    } else {
      delete item.children;
    }
    delete item._file;
  }
  return nav;
}
function pick(keys) {
  return (obj) => {
    obj = obj || {};
    if (keys && keys.length) {
      return keys.filter((key) => typeof obj[key] !== "undefined").reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
    }
    return obj;
  };
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

const _9HjcfR = defineEventHandler(async (event) => {
  const query = getContentQuery(event);
  if (!isPreview(event) && Object.keys(query).length === 0) {
    const cache = await cacheStorage.getItem("content-navigation.json");
    if (cache) {
      return cache;
    }
  }
  const contents = await serverQueryContent(event, query).where({
    /**
     * Partial contents are not included in the navigation
     * A partial content is a content that has `_` prefix in its path
     */
    _partial: false,
    /**
     * Exclude any pages which have opted out of navigation via frontmatter.
     */
    navigation: {
      $ne: false
    }
  }).find();
  const dirConfigs = await serverQueryContent(event).where({ _path: /\/_dir$/i, _partial: true }).find();
  const configs = (dirConfigs?.result || dirConfigs).reduce((configs2, conf) => {
    if (conf.title?.toLowerCase() === "dir") {
      conf.title = void 0;
    }
    const key = conf._path.split("/").slice(0, -1).join("/") || "/";
    configs2[key] = {
      ...conf,
      // Extract meta from body. (non MD files)
      ...conf.body
    };
    return configs2;
  }, {});
  return createNav(contents?.result || contents, configs);
});

const _lazy_BzWrGS = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_BzWrGS, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _nG37I7, lazy: false, middleware: false, method: undefined },
  { route: '/api/_content/query/:qid/**:params', handler: _pDFILU, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/query/:qid', handler: _pDFILU, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/query', handler: _pDFILU, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/cache.1702066253322.json', handler: _zAUuW3, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation/:qid/**:params', handler: _9HjcfR, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation/:qid', handler: _9HjcfR, lazy: false, middleware: false, method: "get" },
  { route: '/api/_content/navigation', handler: _9HjcfR, lazy: false, middleware: false, method: "get" },
  { route: '/**', handler: _lazy_BzWrGS, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((_err) => {
      console.error("Error while capturing another error", _err);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  for (const plugin of plugins) {
    try {
      plugin(app);
    } catch (err) {
      captureError(err, { tags: ["plugin"] });
      throw err;
    }
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((err) => {
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        destroy(socket);
      }
    }
  }
  server.on("request", function(req, res) {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", function() {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", function(socket) {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", function() {
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    if (options.development) {
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        return Promise.resolve(false);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((err) => {
      const errString = typeof err === "string" ? err : JSON.stringify(err);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $fetch$1 as $, getRequestHeader as A, destr as B, isEqual as C, setCookie as D, getCookie as E, deleteCookie as F, encodePath as G, withTrailingSlash as H, pascalCase as I, kebabCase as J, parseQuery as K, klona as L, defuFn as M, prefixStorage as N, createStorage as O, memoryDriver as P, nodeServer as Q, send as a, setResponseStatus as b, setResponseHeaders as c, useRuntimeConfig as d, eventHandler as e, getQuery as f, getResponseStatus as g, createError$1 as h, getRouteRules as i, joinURL as j, getResponseStatusText as k, hasProtocol as l, isScriptProtocol as m, withoutTrailingSlash as n, withLeadingSlash as o, parseURL as p, hash as q, defu as r, setResponseHeader as s, sanitizeStatusCode as t, useNitroApp as u, withBase as v, withQuery as w, encodeParam as x, createHooks as y, parse$1 as z };
//# sourceMappingURL=node-server.mjs.map
