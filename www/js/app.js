(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@capacitor/core/dist/index.js
  var createCapacitorPlatforms, initPlatforms, CapacitorPlatforms, addPlatform, setPlatform, ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, Plugins, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp;
  var init_dist = __esm({
    "node_modules/@capacitor/core/dist/index.js"() {
      createCapacitorPlatforms = (win) => {
        const defaultPlatformMap = /* @__PURE__ */ new Map();
        defaultPlatformMap.set("web", { name: "web" });
        const capPlatforms = win.CapacitorPlatforms || {
          currentPlatform: { name: "web" },
          platforms: defaultPlatformMap
        };
        const addPlatform2 = (name, platform) => {
          capPlatforms.platforms.set(name, platform);
        };
        const setPlatform2 = (name) => {
          if (capPlatforms.platforms.has(name)) {
            capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
          }
        };
        capPlatforms.addPlatform = addPlatform2;
        capPlatforms.setPlatform = setPlatform2;
        return capPlatforms;
      };
      initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
      CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      addPlatform = CapacitorPlatforms.addPlatform;
      setPlatform = CapacitorPlatforms.setPlatform;
      (function(ExceptionCode2) {
        ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
        ExceptionCode2["Unavailable"] = "UNAVAILABLE";
      })(ExceptionCode || (ExceptionCode = {}));
      CapacitorException = class extends Error {
        constructor(message, code, data) {
          super(message);
          this.message = message;
          this.code = code;
          this.data = data;
        }
      };
      getPlatformId = (win) => {
        var _a, _b;
        if (win === null || win === void 0 ? void 0 : win.androidBridge) {
          return "android";
        } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
          return "ios";
        } else {
          return "web";
        }
      };
      createCapacitor = (win) => {
        var _a, _b, _c, _d, _e;
        const capCustomPlatform = win.CapacitorCustomPlatform || null;
        const cap = win.Capacitor || {};
        const Plugins2 = cap.Plugins = cap.Plugins || {};
        const capPlatforms = win.CapacitorPlatforms;
        const defaultGetPlatform = () => {
          return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
        };
        const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
        const defaultIsNativePlatform = () => getPlatform() !== "web";
        const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
        const defaultIsPluginAvailable = (pluginName) => {
          const plugin = registeredPlugins.get(pluginName);
          if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            return true;
          }
          if (getPluginHeader(pluginName)) {
            return true;
          }
          return false;
        };
        const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
        const defaultGetPluginHeader = (pluginName) => {
          var _a2;
          return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h) => h.name === pluginName);
        };
        const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
        const handleError = (err) => win.console.error(err);
        const pluginMethodNoop = (_target, prop, pluginName) => {
          return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
        };
        const registeredPlugins = /* @__PURE__ */ new Map();
        const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
          const registeredPlugin = registeredPlugins.get(pluginName);
          if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
          }
          const platform = getPlatform();
          const pluginHeader = getPluginHeader(pluginName);
          let jsImplementation;
          const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
              jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
            } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
              jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
            }
            return jsImplementation;
          };
          const createPluginMethod = (impl, prop) => {
            var _a2, _b2;
            if (pluginHeader) {
              const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
              if (methodHeader) {
                if (methodHeader.rtype === "promise") {
                  return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                } else {
                  return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                }
              } else if (impl) {
                return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
              }
            } else if (impl) {
              return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
            } else {
              throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
          };
          const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
              const p = loadPluginImplementation().then((impl) => {
                const fn = createPluginMethod(impl, prop);
                if (fn) {
                  const p2 = fn(...args);
                  remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                  return p2;
                } else {
                  throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                }
              });
              if (prop === "addListener") {
                p.remove = async () => remove();
              }
              return p;
            };
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, "name", {
              value: prop,
              writable: false,
              configurable: false
            });
            return wrapper;
          };
          const addListener = createPluginMethodWrapper("addListener");
          const removeListener = createPluginMethodWrapper("removeListener");
          const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
              const callbackId = await call;
              removeListener({
                eventName,
                callbackId
              }, callback);
            };
            const p = new Promise((resolve) => call.then(() => resolve({ remove })));
            p.remove = async () => {
              console.warn(`Using addListener() without 'await' is deprecated.`);
              await remove();
            };
            return p;
          };
          const proxy = new Proxy({}, {
            get(_, prop) {
              switch (prop) {
                // https://github.com/facebook/react/issues/20030
                case "$$typeof":
                  return void 0;
                case "toJSON":
                  return () => ({});
                case "addListener":
                  return pluginHeader ? addListenerNative : addListener;
                case "removeListener":
                  return removeListener;
                default:
                  return createPluginMethodWrapper(prop);
              }
            }
          });
          Plugins2[pluginName] = proxy;
          registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: /* @__PURE__ */ new Set([
              ...Object.keys(jsImplementations),
              ...pluginHeader ? [platform] : []
            ])
          });
          return proxy;
        };
        const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
        if (!cap.convertFileSrc) {
          cap.convertFileSrc = (filePath) => filePath;
        }
        cap.getPlatform = getPlatform;
        cap.handleError = handleError;
        cap.isNativePlatform = isNativePlatform;
        cap.isPluginAvailable = isPluginAvailable;
        cap.pluginMethodNoop = pluginMethodNoop;
        cap.registerPlugin = registerPlugin2;
        cap.Exception = CapacitorException;
        cap.DEBUG = !!cap.DEBUG;
        cap.isLoggingEnabled = !!cap.isLoggingEnabled;
        cap.platform = cap.getPlatform();
        cap.isNative = cap.isNativePlatform();
        return cap;
      };
      initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
      Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      registerPlugin = Capacitor.registerPlugin;
      Plugins = Capacitor.Plugins;
      WebPlugin = class {
        constructor(config) {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
          if (config) {
            console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
            this.config = config;
          }
        }
        addListener(eventName, listenerFunc) {
          let firstListener = false;
          const listeners = this.listeners[eventName];
          if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
          }
          this.listeners[eventName].push(listenerFunc);
          const windowListener = this.windowListeners[eventName];
          if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
          }
          if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
          }
          const remove = async () => this.removeListener(eventName, listenerFunc);
          const p = Promise.resolve({ remove });
          return p;
        }
        async removeAllListeners() {
          this.listeners = {};
          for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
          }
          this.windowListeners = {};
        }
        notifyListeners(eventName, data, retainUntilConsumed) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            if (retainUntilConsumed) {
              let args = this.retainedEventArguments[eventName];
              if (!args) {
                args = [];
              }
              args.push(data);
              this.retainedEventArguments[eventName] = args;
            }
            return;
          }
          listeners.forEach((listener) => listener(data));
        }
        hasListeners(eventName) {
          return !!this.listeners[eventName].length;
        }
        registerWindowListener(windowEventName, pluginEventName) {
          this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: (event) => {
              this.notifyListeners(pluginEventName, event);
            }
          };
        }
        unimplemented(msg = "not implemented") {
          return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
        }
        unavailable(msg = "not available") {
          return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
        }
        async removeListener(eventName, listenerFunc) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            return;
          }
          const index = listeners.indexOf(listenerFunc);
          this.listeners[eventName].splice(index, 1);
          if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
          }
        }
        addWindowListener(handle) {
          window.addEventListener(handle.windowEventName, handle.handler);
          handle.registered = true;
        }
        removeWindowListener(handle) {
          if (!handle) {
            return;
          }
          window.removeEventListener(handle.windowEventName, handle.handler);
          handle.registered = false;
        }
        sendRetainedArgumentsForEvent(eventName) {
          const args = this.retainedEventArguments[eventName];
          if (!args) {
            return;
          }
          delete this.retainedEventArguments[eventName];
          args.forEach((arg) => {
            this.notifyListeners(eventName, arg);
          });
        }
      };
      encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      CapacitorCookiesPluginWeb = class extends WebPlugin {
        async getCookies() {
          const cookies = document.cookie;
          const cookieMap = {};
          cookies.split(";").forEach((cookie) => {
            if (cookie.length <= 0)
              return;
            let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
            key = decode(key).trim();
            value = decode(value).trim();
            cookieMap[key] = value;
          });
          return cookieMap;
        }
        async setCookie(options) {
          try {
            const encodedKey = encode(options.key);
            const encodedValue = encode(options.value);
            const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
            const path = (options.path || "/").replace("path=", "");
            const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
            document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async deleteCookie(options) {
          try {
            document.cookie = `${options.key}=; Max-Age=0`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearCookies() {
          try {
            const cookies = document.cookie.split(";") || [];
            for (const cookie of cookies) {
              document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearAllCookies() {
          try {
            await this.clearCookies();
          } catch (error) {
            return Promise.reject(error);
          }
        }
      };
      CapacitorCookies = registerPlugin("CapacitorCookies", {
        web: () => new CapacitorCookiesPluginWeb()
      });
      readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      normalizeHttpHeaders = (headers = {}) => {
        const originalKeys = Object.keys(headers);
        const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
        const normalized = loweredKeys.reduce((acc, key, index) => {
          acc[key] = headers[originalKeys[index]];
          return acc;
        }, {});
        return normalized;
      };
      buildUrlParams = (params, shouldEncode = true) => {
        if (!params)
          return null;
        const output = Object.entries(params).reduce((accumulator, entry) => {
          const [key, value] = entry;
          let encodedValue;
          let item;
          if (Array.isArray(value)) {
            item = "";
            value.forEach((str) => {
              encodedValue = shouldEncode ? encodeURIComponent(str) : str;
              item += `${key}=${encodedValue}&`;
            });
            item.slice(0, -1);
          } else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
          }
          return `${accumulator}&${item}`;
        }, "");
        return output.substr(1);
      };
      buildRequestInit = (options, extra = {}) => {
        const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
        const headers = normalizeHttpHeaders(options.headers);
        const type = headers["content-type"] || "";
        if (typeof options.data === "string") {
          output.body = options.data;
        } else if (type.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
          }
          output.body = params.toString();
        } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
          const form = new FormData();
          if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
              form.append(key, value);
            });
          } else {
            for (const key of Object.keys(options.data)) {
              form.append(key, options.data[key]);
            }
          }
          output.body = form;
          const headers2 = new Headers(output.headers);
          headers2.delete("content-type");
          output.headers = headers2;
        } else if (type.includes("application/json") || typeof options.data === "object") {
          output.body = JSON.stringify(options.data);
        }
        return output;
      };
      CapacitorHttpPluginWeb = class extends WebPlugin {
        /**
         * Perform an Http request given a set of options
         * @param options Options to build the HTTP request
         */
        async request(options) {
          const requestInit = buildRequestInit(options, options.webFetchExtra);
          const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
          const url = urlParams ? `${options.url}?${urlParams}` : options.url;
          const response = await fetch(url, requestInit);
          const contentType = response.headers.get("content-type") || "";
          let { responseType = "text" } = response.ok ? options : {};
          if (contentType.includes("application/json")) {
            responseType = "json";
          }
          let data;
          let blob;
          switch (responseType) {
            case "arraybuffer":
            case "blob":
              blob = await response.blob();
              data = await readBlobAsBase64(blob);
              break;
            case "json":
              data = await response.json();
              break;
            case "document":
            case "text":
            default:
              data = await response.text();
          }
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          return {
            data,
            headers,
            status: response.status,
            url: response.url
          };
        }
        /**
         * Perform an Http GET request given a set of options
         * @param options Options to build the HTTP request
         */
        async get(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
        }
        /**
         * Perform an Http POST request given a set of options
         * @param options Options to build the HTTP request
         */
        async post(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
        }
        /**
         * Perform an Http PUT request given a set of options
         * @param options Options to build the HTTP request
         */
        async put(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
        }
        /**
         * Perform an Http PATCH request given a set of options
         * @param options Options to build the HTTP request
         */
        async patch(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
        }
        /**
         * Perform an Http DELETE request given a set of options
         * @param options Options to build the HTTP request
         */
        async delete(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
        }
      };
      CapacitorHttp = registerPlugin("CapacitorHttp", {
        web: () => new CapacitorHttpPluginWeb()
      });
    }
  });

  // node_modules/@capacitor/haptics/dist/esm/definitions.js
  var ImpactStyle, NotificationType, HapticsNotificationType, HapticsImpactStyle;
  var init_definitions = __esm({
    "node_modules/@capacitor/haptics/dist/esm/definitions.js"() {
      (function(ImpactStyle2) {
        ImpactStyle2["Heavy"] = "HEAVY";
        ImpactStyle2["Medium"] = "MEDIUM";
        ImpactStyle2["Light"] = "LIGHT";
      })(ImpactStyle || (ImpactStyle = {}));
      (function(NotificationType2) {
        NotificationType2["Success"] = "SUCCESS";
        NotificationType2["Warning"] = "WARNING";
        NotificationType2["Error"] = "ERROR";
      })(NotificationType || (NotificationType = {}));
      HapticsNotificationType = NotificationType;
      HapticsImpactStyle = ImpactStyle;
    }
  });

  // node_modules/@capacitor/haptics/dist/esm/web.js
  var web_exports = {};
  __export(web_exports, {
    HapticsWeb: () => HapticsWeb
  });
  var HapticsWeb;
  var init_web = __esm({
    "node_modules/@capacitor/haptics/dist/esm/web.js"() {
      init_dist();
      init_definitions();
      HapticsWeb = class extends WebPlugin {
        constructor() {
          super(...arguments);
          this.selectionStarted = false;
        }
        async impact(options) {
          const pattern = this.patternForImpact(options === null || options === void 0 ? void 0 : options.style);
          this.vibrateWithPattern(pattern);
        }
        async notification(options) {
          const pattern = this.patternForNotification(options === null || options === void 0 ? void 0 : options.type);
          this.vibrateWithPattern(pattern);
        }
        async vibrate(options) {
          const duration = (options === null || options === void 0 ? void 0 : options.duration) || 300;
          this.vibrateWithPattern([duration]);
        }
        async selectionStart() {
          this.selectionStarted = true;
        }
        async selectionChanged() {
          if (this.selectionStarted) {
            this.vibrateWithPattern([70]);
          }
        }
        async selectionEnd() {
          this.selectionStarted = false;
        }
        patternForImpact(style = ImpactStyle.Heavy) {
          if (style === ImpactStyle.Medium) {
            return [43];
          } else if (style === ImpactStyle.Light) {
            return [20];
          }
          return [61];
        }
        patternForNotification(type = NotificationType.Success) {
          if (type === NotificationType.Warning) {
            return [30, 40, 30, 50, 60];
          } else if (type === NotificationType.Error) {
            return [27, 45, 50];
          }
          return [35, 65, 21];
        }
        vibrateWithPattern(pattern) {
          if (navigator.vibrate) {
            navigator.vibrate(pattern);
          } else {
            throw this.unavailable("Browser does not support the vibrate API");
          }
        }
      };
    }
  });

  // node_modules/@capacitor/haptics/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    Haptics: () => Haptics,
    HapticsImpactStyle: () => HapticsImpactStyle,
    HapticsNotificationType: () => HapticsNotificationType,
    ImpactStyle: () => ImpactStyle,
    NotificationType: () => NotificationType
  });
  var Haptics;
  var init_esm = __esm({
    "node_modules/@capacitor/haptics/dist/esm/index.js"() {
      init_dist();
      init_definitions();
      Haptics = registerPlugin("Haptics", {
        web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.HapticsWeb())
      });
    }
  });

  // src/standards.js
  var GRADES = {
    A: { label: "\u4F18\u7B49", minScore: 90, color: "#1a7f4b" },
    B: { label: "\u5408\u683C", minScore: 75, color: "#2d8f5e" },
    C: { label: "\u4E34\u754C", minScore: 60, color: "#c47a00" },
    F: { label: "\u4E0D\u5408\u683C", minScore: 0, color: "#c0392b" }
  };
  var CATEGORIES = [
    {
      id: "vegetable",
      name: "\u65B0\u9C9C\u852C\u83DC",
      icon: "\u{1F96C}",
      gbRefs: ["GB 2762-2022", "GB 2763-2021", "GB/T 13621-2006"],
      visual: {
        hueMin: 70,
        hueMax: 150,
        minSaturation: 0.22,
        maxDarkSpotRatio: 0.12,
        minBrightness: 0.28,
        maxGrayRatio: 0.18
      },
      checklist: [
        { id: "appearance", label: "\u8272\u6CFD\u6B63\u5E38\u3001\u65E0\u4E25\u91CD\u840E\u852B", required: true, autoKey: "colorFresh" },
        { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u6591\u3001\u866B\u86C0\u5B54\u6D1E", required: true, autoKey: "noSpots" },
        { id: "odor", label: "\u65E0\u5F02\u5473\u3001\u65E0\u53D1\u9175\u9178\u8D25\u6C14", required: true },
        { id: "foreign", label: "\u65E0\u6CE5\u6C99\u3001\u5F02\u7269\u3001\u519C\u836F\u6B8B\u7559\u53EF\u89C1\u75D5\u8FF9", required: true },
        { id: "packaging", label: "\u5305\u88C5\u5B8C\u6574\u3001\u6807\u7B7E\u4FE1\u606F\u9F50\u5168\uFF08\u5982\u6709\uFF09", required: false }
      ]
    },
    {
      id: "fruit",
      name: "\u9C9C\u6C34\u679C",
      icon: "\u{1F34E}",
      gbRefs: ["GB/T 8559-2008", "GB 2762-2022", "GB 2763-2021"],
      visual: {
        hueMin: 0,
        hueMax: 60,
        minSaturation: 0.25,
        maxDarkSpotRatio: 0.1,
        minBrightness: 0.25,
        maxGrayRatio: 0.15
      },
      checklist: [
        { id: "appearance", label: "\u679C\u5F62\u5B8C\u6574\u3001\u8868\u76AE\u65E0\u660E\u663E bruise", required: true, autoKey: "colorFresh" },
        { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u53D8\u3001\u866B\u773C", required: true, autoKey: "noSpots" },
        { id: "firmness", label: "\u786C\u5EA6\u9002\u4E2D\u3001\u65E0\u8FC7\u5EA6\u8F6F\u70C2", required: true },
        { id: "odor", label: "\u65E0\u9152\u5473\u3001\u65E0\u5F02\u5E38\u53D1\u9175\u5473", required: true },
        { id: "residue", label: "\u8868\u9762\u65E0\u53EF\u89C1\u8721\u5C42\u5F02\u5E38\u6216\u6B8B\u7559", required: false }
      ]
    },
    {
      id: "meat",
      name: "\u9C9C\uFF08\u51BB\uFF09\u755C\u79BD\u8089",
      icon: "\u{1F969}",
      gbRefs: ["GB 2707-2016", "GB 2762-2022", "GB 31616-2015"],
      visual: {
        hueMin: 340,
        hueMax: 30,
        minSaturation: 0.12,
        maxDarkSpotRatio: 0.08,
        minBrightness: 0.2,
        maxGrayRatio: 0.25
      },
      checklist: [
        { id: "color", label: "\u8089\u8272\u6B63\u5E38\uFF08\u9C9C\u7EA2/\u6DE1\u7EA2\uFF09\uFF0C\u65E0\u53D1\u7EFF\u53D1\u7070", required: true, autoKey: "colorFresh" },
        { id: "spot", label: "\u65E0\u6DE4\u8840\u5757\u3001\u8113\u5305\u3001\u5BC4\u751F\u866B", required: true, autoKey: "noSpots" },
        { id: "odor", label: "\u65E0\u8165\u81ED\u3001\u6C28\u5473\u3001\u9178\u8D25\u5473", required: true },
        { id: "elastic", label: "\u6307\u538B\u540E\u5F39\u6027\u6062\u590D\u826F\u597D", required: true },
        { id: "cert", label: "\u68C0\u75AB\u5408\u683C\u6807\u5FD7/\u8FFD\u6EAF\u7801\u53EF\u67E5", required: true }
      ]
    },
    {
      id: "seafood",
      name: "\u9C9C\u51BB\u6C34\u4EA7\u54C1",
      icon: "\u{1F41F}",
      gbRefs: ["GB 2733-2015", "GB 2762-2022", "GB 10136-2016"],
      visual: {
        hueMin: 170,
        hueMax: 220,
        minSaturation: 0.08,
        maxDarkSpotRatio: 0.1,
        minBrightness: 0.18,
        maxGrayRatio: 0.3
      },
      checklist: [
        { id: "appearance", label: "\u9C7C\u773C\u6E05\u4EAE\u3001\u9CDE\u7247/\u867E\u58F3\u5B8C\u6574", required: true, autoKey: "colorFresh" },
        { id: "spot", label: "\u65E0\u8F6F\u70C2\u3001\u8131\u9AA8\u3001\u9ED1\u9CC3", required: true, autoKey: "noSpots" },
        { id: "odor", label: "\u65E0\u6C28\u5473\u3001\u8150\u81ED\u5473", required: true },
        { id: "gill", label: "\u9CC3\u90E8\u9C9C\u7EA2\u6216\u6DE1\u7EA2\uFF08\u9C9C\u54C1\uFF09", required: true },
        { id: "temp", label: "\u51B7\u94FE\u6E29\u5EA6\u7B26\u5408\u8981\u6C42\uFF08\u22644\u2103 \u6216\u51BB\u7ED3\u6001\uFF09", required: true }
      ]
    },
    {
      id: "dairy",
      name: "\u4E73\u5236\u54C1",
      icon: "\u{1F95B}",
      gbRefs: ["GB 19301-2010", "GB 25190-2010", "GB 2762-2022"],
      visual: {
        hueMin: 30,
        hueMax: 55,
        minSaturation: 0.05,
        maxDarkSpotRatio: 0.05,
        minBrightness: 0.55,
        maxGrayRatio: 0.12
      },
      checklist: [
        { id: "packaging", label: "\u5305\u88C5\u5BC6\u5C01\u5B8C\u597D\u3001\u65E0\u80C0\u5305\u6F0F\u5305", required: true },
        { id: "label", label: "\u751F\u4EA7\u65E5\u671F\u3001\u4FDD\u8D28\u671F\u3001\u5382\u540D\u5382\u5740\u6E05\u6670", required: true },
        { id: "appearance", label: "\u8272\u6CFD\u5747\u5300\u3001\u65E0\u7D6E\u72B6\u7269\uFF08\u6DB2\u6001\u5976\uFF09", required: true, autoKey: "colorFresh" },
        { id: "odor", label: "\u65E0\u9178\u8D25\u3001\u998A\u5473", required: true },
        { id: "cold", label: "\u51B7\u85CF\u94FE\u672A\u4E2D\u65AD\uFF08\u9700\u51B7\u85CF\u54C1\u7C7B\uFF09", required: true }
      ]
    },
    {
      id: "grain",
      name: "\u7CAE\u6CB9\u53CA\u5236\u54C1",
      icon: "\u{1F33E}",
      gbRefs: ["GB 1354-2018", "GB 1355-2021", "GB 2716-2018"],
      visual: {
        hueMin: 35,
        hueMax: 50,
        minSaturation: 0.08,
        maxDarkSpotRatio: 0.06,
        minBrightness: 0.35,
        maxGrayRatio: 0.1
      },
      checklist: [
        { id: "appearance", label: "\u9897\u7C92\u9971\u6EE1\u3001\u65E0\u5927\u91CF\u788E\u7C73/\u6742\u8D28", required: true, autoKey: "colorFresh" },
        { id: "spot", label: "\u65E0\u866B\u86C0\u3001\u65E0\u9709\u7C92\u3001\u65E0\u7ED3\u5757", required: true, autoKey: "noSpots" },
        { id: "odor", label: "\u65E0\u54C8\u5587\u5473\u3001\u9709\u5473", required: true },
        { id: "label", label: "\u7B49\u7EA7\u6807\u8BC6\u3001\u6267\u884C\u6807\u51C6\u53F7\u6B63\u786E", required: true },
        { id: "packaging", label: "\u5305\u88C5\u5E72\u71E5\u3001\u65E0\u7834\u635F\u53D7\u6F6E", required: true }
      ]
    },
    {
      id: "packaged",
      name: "\u9884\u5305\u88C5\u98DF\u54C1",
      icon: "\u{1F4E6}",
      gbRefs: ["GB 7718-2011", "GB 28050-2011", "GB 14881-2013"],
      visual: {
        hueMin: 0,
        hueMax: 360,
        minSaturation: 0,
        maxDarkSpotRatio: 0.15,
        minBrightness: 0.15,
        maxGrayRatio: 0.35
      },
      checklist: [
        { id: "label_name", label: "\u98DF\u54C1\u540D\u79F0\u3001\u914D\u6599\u8868\u5B8C\u6574", required: true },
        { id: "label_date", label: "\u751F\u4EA7\u65E5\u671F\u4E0E\u4FDD\u8D28\u671F\u5728\u6709\u6548\u671F\u5185", required: true },
        { id: "label_std", label: "\u4EA7\u54C1\u6807\u51C6\u4EE3\u53F7\u3001\u751F\u4EA7\u8BB8\u53EF\u8BC1\u53F7", required: true },
        { id: "packaging", label: "\u5305\u88C5\u5B8C\u597D\u3001\u65E0\u80C0\u888B\u7834\u635F", required: true },
        { id: "appearance", label: "\u5185\u5BB9\u7269\u8272\u6CFD\u5F62\u6001\u6B63\u5E38", required: true, autoKey: "colorFresh" }
      ]
    }
  ];
  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id) || null;
  }
  function listCategories() {
    return CATEGORIES.slice();
  }
  function scoreToGrade(score) {
    const s = Number(score) || 0;
    if (s >= GRADES.A.minScore) return "A";
    if (s >= GRADES.B.minScore) return "B";
    if (s >= GRADES.C.minScore) return "C";
    return "F";
  }
  function gradeInfo(grade) {
    return GRADES[grade] || GRADES.F;
  }
  function isPassingGrade(grade) {
    return grade === "A" || grade === "B";
  }

  // src/capture-quality.js
  var SAMPLE = 96;
  function luminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function saturation(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    if (max === min) return 0;
    const l = (max + min) / 2;
    return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }
  function samplePixels(imageData) {
    const { data, width, height } = imageData;
    const stepX = Math.max(1, Math.floor(width / SAMPLE));
    const stepY = Math.max(1, Math.floor(height / SAMPLE));
    const pixels = [];
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const i = (y * width + x) * 4;
        pixels.push({
          x: x / width,
          y: y / height,
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
          l: luminance(data[i], data[i + 1], data[i + 2]),
          s: saturation(data[i], data[i + 1], data[i + 2])
        });
      }
    }
    return { pixels, width, height, stepX, stepY };
  }
  function laplacianVariance(imageData) {
    const { data, width, height } = imageData;
    const gray = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        gray[y * width + x] = luminance(data[i], data[i + 1], data[i + 2]);
      }
    }
    const vals = [];
    const step = Math.max(1, Math.floor(Math.min(width, height) / SAMPLE));
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const c = gray[y * width + x];
        const lap = 4 * c - gray[(y - step) * width + x] - gray[(y + step) * width + x] - gray[y * width + (x - step)] - gray[y * width + (x + step)];
        vals.push(lap);
      }
    }
    if (!vals.length) return 0;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  }
  function regionMean(pixels, inRegion) {
    const subset = pixels.filter(inRegion);
    if (!subset.length) return 0;
    return subset.reduce((s, p) => s + p.l, 0) / subset.length;
  }
  var CAPTURE_FLAGS = {
    blur: { label: "\u753B\u9762\u6A21\u7CCA", tip: "\u8BF7\u64E6\u51C0\u955C\u5934\u3001\u7A33\u4F4F\u624B\u673A\u540E\u91CD\u62CD" },
    low_light: { label: "\u5149\u7EBF\u4E0D\u8DB3", tip: "\u79FB\u81F3\u660E\u4EAE\u5904\u6216\u6253\u5F00\u8865\u5149" },
    overexposure: { label: "\u8FC7\u66DD/\u53CD\u5149", tip: "\u907F\u5F00\u76F4\u5C04\u5149\uFF0C\u8C03\u6574\u89D2\u5EA6\u540E\u91CD\u62CD" },
    low_contrast: { label: "\u5BF9\u6BD4\u5EA6\u504F\u4F4E", tip: "\u955C\u5934\u53EF\u80FD\u6709\u6C61\u6E0D\u6216\u96FE\u6C14\uFF0C\u8BF7\u64E6\u62ED\u540E\u91CD\u62CD" },
    vignette: { label: "\u8FB9\u7F18\u6697\u89D2", tip: "\u68C0\u67E5\u955C\u5934\u662F\u5426\u88AB\u906E\u6321\u6216\u5F04\u810F" },
    haze: { label: "\u753B\u9762\u53D1\u7070", tip: "\u955C\u5934\u53EF\u80FD\u810F\u6C61\u6216\u5BF9\u7126\u5931\u8D25\uFF0C\u8BF7\u6E05\u6D01\u540E\u91CD\u62CD" },
    dirty_lens: { label: "\u7591\u4F3C\u810F\u955C\u5934", tip: "\u7528\u8F6F\u5E03\u64E6\u62ED\u6444\u50CF\u5934\uFF0C\u786E\u4FDD\u753B\u9762\u6E05\u6670" }
  };
  function assessCaptureQuality(imageData) {
    if (!imageData?.data?.length) {
      return {
        reliable: false,
        score: 0,
        flags: ["unreadable"],
        warnings: ["\u65E0\u6CD5\u8BFB\u53D6\u56FE\u50CF"],
        tips: ["\u8BF7\u91CD\u65B0\u62CD\u7167"],
        metrics: {}
      };
    }
    const { pixels } = samplePixels(imageData);
    const ls = pixels.map((p) => p.l);
    const ss = pixels.map((p) => p.s);
    const avgL = ls.reduce((a, b) => a + b, 0) / ls.length;
    const avgS = ss.reduce((a, b) => a + b, 0) / ss.length;
    const lMin = Math.min(...ls);
    const lMax = Math.max(...ls);
    const lSpread = lMax - lMin;
    const lMean = avgL;
    const lVar = ls.reduce((s, v) => s + (v - lMean) ** 2, 0) / ls.length;
    const lStd = Math.sqrt(lVar);
    const brightClip = ls.filter((l) => l > 0.95).length / ls.length;
    const darkClip = ls.filter((l) => l < 0.06).length / ls.length;
    const hazeRatio = pixels.filter((p) => p.s < 0.1 && p.l > 0.2 && p.l < 0.8).length / pixels.length;
    const centerL = regionMean(pixels, (p) => p.x > 0.3 && p.x < 0.7 && p.y > 0.3 && p.y < 0.7);
    const cornerL = regionMean(pixels, (p) => (p.x < 0.2 || p.x > 0.8) && (p.y < 0.2 || p.y > 0.8));
    const vignetteRatio = centerL > 0.05 ? cornerL / centerL : 1;
    const lapVar = laplacianVariance(imageData);
    const likelyBlur = lapVar < 12e-4 && lStd > 0.035 && lSpread < 0.22;
    const severeBlur = lapVar < 25e-5 && lStd > 0.02;
    const flags = [];
    const warnings = [];
    const tips = [];
    if (likelyBlur || severeBlur) {
      flags.push("blur");
      warnings.push(CAPTURE_FLAGS.blur.label);
      tips.push(CAPTURE_FLAGS.blur.tip);
    }
    if (avgL < 0.14 && darkClip > 0.35) {
      flags.push("low_light");
      warnings.push(CAPTURE_FLAGS.low_light.label);
      tips.push(CAPTURE_FLAGS.low_light.tip);
    }
    if (brightClip > 0.12) {
      flags.push("overexposure");
      warnings.push(CAPTURE_FLAGS.overexposure.label);
      tips.push(CAPTURE_FLAGS.overexposure.tip);
    }
    if (lStd < 0.07 && lSpread < 0.35) {
      flags.push("low_contrast");
      warnings.push(CAPTURE_FLAGS.low_contrast.label);
      tips.push(CAPTURE_FLAGS.low_contrast.tip);
    }
    if (vignetteRatio < 0.62 && centerL > 0.18) {
      flags.push("vignette");
      warnings.push(CAPTURE_FLAGS.vignette.label);
      tips.push(CAPTURE_FLAGS.vignette.tip);
    }
    if (hazeRatio > 0.38 && avgS < 0.18) {
      flags.push("haze");
      warnings.push(CAPTURE_FLAGS.haze.label);
      tips.push(CAPTURE_FLAGS.haze.tip);
    }
    const dirtySignals = [
      flags.includes("low_contrast"),
      flags.includes("haze"),
      flags.includes("vignette"),
      flags.includes("blur") && flags.includes("low_contrast")
    ].filter(Boolean).length;
    if (dirtySignals >= 2 || flags.includes("haze") && flags.includes("vignette")) {
      flags.push("dirty_lens");
      if (!warnings.includes(CAPTURE_FLAGS.dirty_lens.label)) {
        warnings.push(CAPTURE_FLAGS.dirty_lens.label);
        tips.push(CAPTURE_FLAGS.dirty_lens.tip);
      }
    }
    let score = 100;
    score -= flags.includes("blur") ? 28 : 0;
    score -= flags.includes("low_light") ? 22 : 0;
    score -= flags.includes("overexposure") ? 18 : 0;
    score -= flags.includes("low_contrast") ? 20 : 0;
    score -= flags.includes("vignette") ? 15 : 0;
    score -= flags.includes("haze") ? 18 : 0;
    score -= flags.includes("dirty_lens") ? 12 : 0;
    score = Math.max(0, Math.min(100, score));
    const criticalFlags = ["dirty_lens", "blur", "low_light"];
    const reliable = score >= 55 && !criticalFlags.some((f) => flags.includes(f));
    return {
      reliable,
      score,
      flags: [...new Set(flags)],
      warnings: [...new Set(warnings)],
      tips: [...new Set(tips)],
      metrics: {
        avgLightness: Number(avgL.toFixed(3)),
        avgSaturation: Number(avgS.toFixed(3)),
        lightnessStd: Number(lStd.toFixed(3)),
        lightnessSpread: Number(lSpread.toFixed(3)),
        brightClipRatio: Number(brightClip.toFixed(3)),
        darkClipRatio: Number(darkClip.toFixed(3)),
        hazeRatio: Number(hazeRatio.toFixed(3)),
        vignetteRatio: Number(vignetteRatio.toFixed(3)),
        laplacianVariance: Number(lapVar.toFixed(6))
      }
    };
  }

  // src/inspect.js
  var SAMPLE2 = 64;
  var GRID = 8;
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: h * 360, s, l };
  }
  function hueInRange(h, min, max) {
    if (min <= max) return h >= min && h <= max;
    return h >= min || h <= max;
  }
  function luminance2(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function detectLocalizedSpots(imageData, captureMetrics) {
    const { data, width, height } = imageData;
    const cellW = Math.max(1, Math.floor(width / GRID));
    const cellH = Math.max(1, Math.floor(height / GRID));
    const cells = [];
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        let sumL = 0;
        let sumS = 0;
        let n = 0;
        const x0 = gx * cellW;
        const y0 = gy * cellH;
        const x1 = Math.min(width, x0 + cellW);
        const y1 = Math.min(height, y0 + cellH);
        for (let y = y0; y < y1; y += 2) {
          for (let x = x0; x < x1; x += 2) {
            const i = (y * width + x) * 4;
            const { s } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
            sumL += luminance2(data[i], data[i + 1], data[i + 2]);
            sumS += s;
            n++;
          }
        }
        if (n) cells.push({ gx, gy, l: sumL / n, s: sumS / n });
      }
    }
    const allL = cells.map((c) => c.l).sort((a, b) => a - b);
    const medianL = allL[Math.floor(allL.length / 2)] || 0.5;
    const darkCells = cells.filter((c) => c.l < medianL - 0.12);
    const uniformDark = darkCells.length / cells.length > 0.72;
    const lowContrastCapture = (captureMetrics?.lightnessStd ?? 1) < 0.08;
    if (uniformDark || lowContrastCapture) {
      return {
        spotRatio: 0,
        localizedSpots: 0,
        uniformDark,
        skippedDueToCapture: lowContrastCapture || uniformDark
      };
    }
    let localizedSpots = 0;
    for (const cell of darkCells) {
      const neighbors = cells.filter(
        (c) => Math.abs(c.gx - cell.gx) <= 1 && Math.abs(c.gy - cell.gy) <= 1 && c !== cell
      );
      if (!neighbors.length) continue;
      const neighL = neighbors.reduce((s, c) => s + c.l, 0) / neighbors.length;
      if (cell.l < neighL - 0.1) localizedSpots++;
    }
    return {
      spotRatio: localizedSpots / cells.length,
      localizedSpots,
      uniformDark: false,
      skippedDueToCapture: false
    };
  }
  function analyzeImageData(imageData, categoryId) {
    const cat = getCategory(categoryId);
    if (!cat || !imageData?.data?.length) {
      return {
        visualScore: null,
        visualReliability: "none",
        captureQuality: null,
        metrics: {},
        issues: [],
        captureWarnings: ["\u65E0\u6CD5\u8BFB\u53D6\u56FE\u50CF"],
        autoHints: {}
      };
    }
    const captureQuality = assessCaptureQuality(imageData);
    const reliable = captureQuality.reliable;
    const { data, width, height } = imageData;
    const stepX = Math.max(1, Math.floor(width / SAMPLE2));
    const stepY = Math.max(1, Math.floor(height / SAMPLE2));
    let count = 0;
    let sumH = 0;
    let sumS = 0;
    let sumL = 0;
    let hueOk = 0;
    const v = cat.visual;
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const { h, s, l } = rgbToHsl(r, g, b);
        count++;
        sumH += h;
        sumS += s;
        sumL += l;
        if (hueInRange(h, v.hueMin, v.hueMax)) hueOk++;
      }
    }
    const avgH = sumH / count;
    const avgS = sumS / count;
    const avgL = sumL / count;
    const hueRatio = hueOk / count;
    const spotInfo = detectLocalizedSpots(imageData, captureQuality.metrics);
    const grayRatio = captureQuality.metrics.hazeRatio ?? 0;
    const foodIssues = [];
    const captureWarnings = [...captureQuality.warnings];
    let visualScore = null;
    let visualReliability = "low";
    if (!reliable) {
      visualReliability = "low";
      return {
        visualScore: null,
        visualReliability,
        captureQuality,
        metrics: {
          avgHue: Math.round(avgH),
          avgSaturation: Number(avgS.toFixed(3)),
          avgLightness: Number(avgL.toFixed(3)),
          hueMatchRatio: Number(hueRatio.toFixed(3)),
          localizedSpotRatio: Number(spotInfo.spotRatio.toFixed(3)),
          localizedSpots: spotInfo.localizedSpots,
          captureScore: captureQuality.score,
          ...captureQuality.metrics
        },
        issues: [],
        captureWarnings,
        captureTips: captureQuality.tips,
        autoHints: {},
        spotSkipped: true
      };
    }
    visualReliability = captureQuality.score >= 75 ? "high" : "medium";
    visualScore = 100;
    const spotFail = spotInfo.localizedSpots >= 2 && spotInfo.spotRatio > 0.04;
    if (avgS < v.minSaturation) {
      visualScore -= 22;
      foodIssues.push("\u8272\u6CFD\u504F\u6DE1\u6216\u840E\u852B\uFF0C\u9971\u548C\u5EA6\u4F4E\u4E8E\u6807\u51C6");
    }
    if (spotFail && !spotInfo.skippedDueToCapture) {
      visualScore -= 28;
      foodIssues.push(`\u5C40\u90E8\u6697\u6591/\u8150\u574F\u7EA6 ${(spotInfo.spotRatio * 100).toFixed(1)}%\uFF0C\u8D85\u51FA\u9650\u503C`);
    }
    if (grayRatio > v.maxGrayRatio && avgS < v.minSaturation * 1.2) {
      visualScore -= 15;
      foodIssues.push("\u7070\u8D25\u533A\u57DF\u504F\u591A\uFF0C\u53EF\u80FD\u5B58\u5728\u9709\u53D8\u6216\u6C27\u5316");
    }
    if (avgL < v.minBrightness && captureQuality.metrics.darkClipRatio < 0.5) {
      visualScore -= 12;
      foodIssues.push("\u6574\u4F53\u4EAE\u5EA6\u504F\u4F4E\uFF0C\u65B0\u9C9C\u5EA6\u5B58\u7591");
    }
    if (hueRatio < 0.35 && cat.id !== "packaged") {
      visualScore -= 12;
      foodIssues.push("\u4E3B\u8272\u8C03\u4E0E\u54C1\u7C7B\u5178\u578B\u8272\u6CFD\u504F\u5DEE\u8F83\u5927");
    }
    visualScore = Math.max(0, Math.min(100, Math.round(visualScore)));
    const autoHints = {
      colorFresh: visualScore >= 70 && avgS >= v.minSaturation * 0.85,
      noSpots: !spotFail && !spotInfo.uniformDark
    };
    return {
      visualScore,
      visualReliability,
      captureQuality,
      metrics: {
        avgHue: Math.round(avgH),
        avgSaturation: Number(avgS.toFixed(3)),
        avgLightness: Number(avgL.toFixed(3)),
        localizedSpotRatio: Number(spotInfo.spotRatio.toFixed(3)),
        localizedSpots: spotInfo.localizedSpots,
        grayRatio: Number(grayRatio.toFixed(3)),
        hueMatchRatio: Number(hueRatio.toFixed(3)),
        captureScore: captureQuality.score,
        ...captureQuality.metrics
      },
      issues: foodIssues,
      captureWarnings,
      captureTips: captureQuality.tips,
      autoHints,
      spotSkipped: spotInfo.skippedDueToCapture
    };
  }
  function evaluateInspection(categoryId, imageAnalysis, checklistAnswers = {}) {
    const cat = getCategory(categoryId);
    if (!cat) {
      return { passed: false, score: 0, grade: "F", failures: ["\u672A\u77E5\u54C1\u7C7B"], summary: "" };
    }
    const reliability = imageAnalysis?.visualReliability ?? "none";
    const useAutoHints = reliability === "high" || reliability === "medium";
    const failures = [];
    const warnings = [];
    let checklistScore = 0;
    let requiredTotal = 0;
    let requiredPass = 0;
    for (const item of cat.checklist) {
      let ok = Boolean(checklistAnswers[item.id]);
      if (useAutoHints && item.autoKey && imageAnalysis?.autoHints?.[item.autoKey] !== void 0) {
        if (checklistAnswers[item.id] === void 0) {
          ok = imageAnalysis.autoHints[item.autoKey];
        }
      }
      if (item.required) {
        requiredTotal++;
        if (ok) requiredPass++;
        else failures.push(item.label);
      } else if (!ok) {
        warnings.push(item.label);
      }
      if (ok) checklistScore += item.required ? 10 : 4;
    }
    const maxChecklist = cat.checklist.reduce((s, i) => s + (i.required ? 10 : 4), 0);
    const checklistPct = maxChecklist ? checklistScore / maxChecklist * 100 : 0;
    const visual = imageAnalysis?.visualScore;
    let score;
    if (reliability === "high") {
      score = Math.round((visual ?? 0) * 0.45 + checklistPct * 0.55);
    } else if (reliability === "medium") {
      score = Math.round((visual ?? 0) * 0.3 + checklistPct * 0.7);
    } else {
      score = Math.round(checklistPct);
    }
    const grade = scoreToGrade(score);
    const passed = isPassingGrade(grade) && requiredPass === requiredTotal;
    let summary;
    if (reliability === "low" || reliability === "none") {
      summary = passed ? `\u62CD\u6444\u8D28\u91CF\u4E0D\u8DB3\uFF0C\u5DF2\u6309\u611F\u5B98\u6E05\u5355\u4E3A\u4E3B\u5224\u5B9A\u4E3A\u5408\u683C\uFF08${score} \u5206\uFF09` : `\u62CD\u6444\u8D28\u91CF\u4E0D\u8DB3\uFF0C\u89C6\u89C9\u7ED3\u679C\u672A\u91C7\u4FE1\uFF1B${failures.slice(0, 2).join("\uFF1B")}${failures.length > 2 ? "\u2026" : ""}`;
    } else if (passed) {
      summary = `\u7B26\u5408 ${cat.gbRefs[0]} \u7B49\u6807\u51C6\u7684\u5916\u89C2\u611F\u5B98\u5FEB\u68C0\u8981\u6C42\uFF0C\u7EFC\u5408 ${score} \u5206`;
    } else {
      summary = `\u672A\u8FBE\u8D28\u68C0\u6807\u51C6\uFF1A${failures.slice(0, 2).join("\uFF1B")}${failures.length > 2 ? "\u2026" : ""}`;
    }
    return {
      passed,
      score,
      grade,
      failures,
      warnings,
      requiredPass,
      requiredTotal,
      visualScore: visual,
      visualReliability: reliability,
      checklistPct: Math.round(checklistPct),
      captureWarnings: imageAnalysis?.captureWarnings ?? [],
      summary,
      gbRefs: cat.gbRefs
    };
  }
  function loadImageToCanvas(fileOrBlob, canvas) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileOrBlob);
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        const max = 512;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          const scale = max / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(ctx.getImageData(0, 0, w, h));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25"));
      };
      img.src = url;
    });
  }

  // src/store.js
  var STORAGE_KEY = "shihaohao.reports.v1";
  function uid() {
    return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
  function normalizeReport(raw) {
    if (!raw || typeof raw !== "object") return null;
    const categoryId = String(raw.categoryId || "").trim();
    if (!categoryId) return null;
    return {
      id: String(raw.id || uid()),
      categoryId,
      categoryName: String(raw.categoryName || ""),
      passed: Boolean(raw.passed),
      score: Number(raw.score) || 0,
      grade: String(raw.grade || "F"),
      summary: String(raw.summary || ""),
      failures: Array.isArray(raw.failures) ? raw.failures.map(String) : [],
      gbRefs: Array.isArray(raw.gbRefs) ? raw.gbRefs.map(String) : [],
      visualScore: Number(raw.visualScore) || 0,
      checklistPct: Number(raw.checklistPct) || 0,
      imageThumb: raw.imageThumb || null,
      createdAt: Number(raw.createdAt) || Date.now()
    };
  }
  function loadReports(storage = globalThis.localStorage) {
    try {
      const raw = storage?.getItem?.(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeReport).filter(Boolean);
    } catch {
      return [];
    }
  }
  function saveReports(reports, storage = globalThis.localStorage) {
    const cleaned = (reports || []).map(normalizeReport).filter(Boolean);
    storage?.setItem?.(STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  }
  function createReport(payload) {
    return normalizeReport({ ...payload, id: uid(), createdAt: Date.now() });
  }
  function addReport(reports, payload) {
    const report = createReport(payload);
    if (!report) return reports.slice();
    return [report, ...reports];
  }
  function sortReports(reports) {
    return reports.slice().sort((a, b) => b.createdAt - a.createdAt);
  }
  function makeThumbDataUrl(canvas, maxSize = 120) {
    if (!canvas?.width) return null;
    const c = document.createElement("canvas");
    const scale = maxSize / Math.max(canvas.width, canvas.height);
    c.width = Math.max(1, Math.round(canvas.width * scale));
    c.height = Math.max(1, Math.round(canvas.height * scale));
    c.getContext("2d").drawImage(canvas, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.72);
  }

  // src/wearable-input.js
  var WEARABLE_DEFAULTS = {
    RING_TILT: 5,
    RING_SHAKE: 20,
    CANE_TAP: 8,
    CANE_SWING: 3,
    RING_THROTTLE: 8,
    CANE_THROTTLE: 6
  };
  function createWearableInput(handlers = {}) {
    const {
      RING_TILT,
      RING_SHAKE,
      CANE_TAP,
      CANE_SWING,
      RING_THROTTLE,
      CANE_THROTTLE
    } = WEARABLE_DEFAULTS;
    const throttleMs = handlers.throttleMs ?? 600;
    let ringFrames = 0;
    let caneFrames = 0;
    let lastBeta = 0;
    let lastGamma = 0;
    let listening = false;
    let orientationHandler = null;
    let motionHandler = null;
    let lastAction = 0;
    function throttleAction(fn, ms = throttleMs) {
      const now = Date.now();
      if (now - lastAction < ms) return;
      lastAction = now;
      fn?.();
    }
    function onRing(e) {
      ringFrames++;
      if (ringFrames % RING_THROTTLE !== 0) return;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      const dBeta = Math.abs(beta - lastBeta);
      const dGamma = Math.abs(gamma - lastGamma);
      lastBeta = beta;
      lastGamma = gamma;
      if (dBeta > RING_SHAKE || dGamma > RING_SHAKE) {
        throttleAction(() => handlers.onRingShake?.());
        return;
      }
      if (beta > RING_TILT) handlers.onRingTiltDown?.();
      else if (beta < -RING_TILT) handlers.onRingTiltUp?.();
      if (gamma > RING_TILT) handlers.onRingTiltRight?.();
      else if (gamma < -RING_TILT) handlers.onRingTiltLeft?.();
    }
    function onCane(e) {
      caneFrames++;
      if (caneFrames % CANE_THROTTLE !== 0) return;
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a) return;
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
      const spike = Math.abs(mag - 9.8);
      if (spike > CANE_TAP) {
        throttleAction(() => handlers.onCaneTap?.());
        return;
      }
      if (Math.abs(a.x || 0) > CANE_SWING) {
        const dir = (a.x || 0) > 0 ? "right" : "left";
        throttleAction(() => {
          handlers.onCaneSwing?.(dir);
          if (dir === "right") handlers.onCaneSwingRight?.();
          else handlers.onCaneSwingLeft?.();
        }, 800);
      }
    }
    async function requestPermission() {
      let ok = true;
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
          ok = await DeviceOrientationEvent.requestPermission() === "granted";
        } catch {
          ok = false;
        }
      }
      if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
        try {
          ok = ok && await DeviceMotionEvent.requestPermission() === "granted";
        } catch {
          ok = false;
        }
      }
      return ok;
    }
    function start() {
      if (listening || typeof window === "undefined") return;
      listening = true;
      orientationHandler = onRing;
      motionHandler = onCane;
      window.addEventListener("deviceorientation", orientationHandler);
      window.addEventListener("devicemotion", motionHandler);
    }
    function stop() {
      if (!listening) return;
      listening = false;
      if (typeof window !== "undefined") {
        if (orientationHandler) window.removeEventListener("deviceorientation", orientationHandler);
        if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
      }
      orientationHandler = null;
      motionHandler = null;
    }
    return {
      start,
      stop,
      requestPermission,
      isListening: () => listening,
      get listening() {
        return listening;
      }
    };
  }
  var WearableInput = class {
    /**
     * @param {{
     *   onGesture?: (gesture: string, detail?: object) => void,
     *   onAction?: (action: string) => void,
     *   onBadge?: (kind: string, text: string, active: boolean) => void,
     *   profile?: 'generic'|'aim-draw'|'steer'|'relay',
     *   ringBadgeId?: string,
     *   caneBadgeId?: string,
     * }} opts
     */
    constructor(opts = {}) {
      this.onGesture = opts.onGesture ?? (() => {
      });
      this.onAction = opts.onAction;
      this.onBadge = opts.onBadge ?? (() => {
      });
      this.profile = opts.profile || "generic";
      this.ringBadgeId = opts.ringBadgeId || "ring-badge";
      this.caneBadgeId = opts.caneBadgeId || "cane-badge";
      this.ringActive = false;
      this.caneActive = false;
      this.ringFrame = 0;
      this.caneFrame = 0;
      this.ringPrevBeta = null;
      this.ringPrevGamma = null;
      this.caneLastAccel = { x: 0, y: 0, z: 0 };
      this.canePrevGamma = null;
      this.lastHitAt = 0;
      this.neutralBeta = null;
    }
    setupRing() {
      if (typeof DeviceOrientationEvent === "undefined") return;
      this.onBadge("ring", "\u6212\u6307 \xB7 \u70B9\u51FB\u542F\u7528", false);
      const enable = async () => {
        try {
          if (typeof DeviceOrientationEvent.requestPermission === "function") {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm !== "granted") return;
          }
          this.ringActive = true;
          this.neutralBeta = null;
          this.onBadge("ring", "\u6212\u6307 \xB7 \u5DF2\u8FDE\u63A5", true);
          window.addEventListener("deviceorientation", (e) => this.handleRing(e));
        } catch {
          this.onBadge("ring", "\u6212\u6307 \xB7 \u4E0D\u652F\u6301", false);
        }
      };
      document.getElementById(this.ringBadgeId)?.addEventListener("click", enable, { once: true });
      if (typeof DeviceOrientationEvent.requestPermission !== "function") enable();
    }
    setupCane() {
      if (typeof DeviceMotionEvent === "undefined") return;
      this.onBadge("cane", "\u624B\u6756 \xB7 \u70B9\u51FB\u542F\u7528", false);
      const enable = async () => {
        try {
          if (typeof DeviceMotionEvent.requestPermission === "function") {
            const perm = await DeviceMotionEvent.requestPermission();
            if (perm !== "granted") return;
          }
          this.caneActive = true;
          this.onBadge("cane", "\u624B\u6756 \xB7 \u5DF2\u8FDE\u63A5", true);
          window.addEventListener("devicemotion", (e) => this.handleCane(e));
        } catch {
          this.onBadge("cane", "\u624B\u6756 \xB7 \u4E0D\u652F\u6301", false);
        }
      };
      document.getElementById(this.caneBadgeId)?.addEventListener("click", enable, { once: true });
      if (typeof DeviceMotionEvent.requestPermission !== "function") enable();
    }
    handleRing(e) {
      if (!this.ringActive) return;
      this.ringFrame++;
      const beta = e.beta || 0;
      const gamma = e.gamma || 0;
      const { RING_TILT, RING_SHAKE, RING_THROTTLE } = WEARABLE_DEFAULTS;
      if (this.profile === "aim-draw") {
        if (this.ringFrame % 2 === 0) {
          const x = Math.max(-1, Math.min(1, gamma / 45));
          const y = Math.max(-1, Math.min(1, beta / 45));
          this.onGesture("aim", { x, y });
        }
        if (this.ringFrame % RING_THROTTLE !== 0) return;
        if (this.ringPrevBeta === null) {
          this.ringPrevBeta = beta;
          this.ringPrevGamma = gamma;
          return;
        }
        const dBeta2 = beta - this.ringPrevBeta;
        const dGamma2 = gamma - this.ringPrevGamma;
        this.ringPrevBeta = beta;
        this.ringPrevGamma = gamma;
        if (Math.abs(dBeta2) > RING_SHAKE || Math.abs(dGamma2) > RING_SHAKE) {
          this.onGesture("cancel_draw");
        }
        return;
      }
      if (this.profile === "steer") {
        if (this.ringFrame % 2 === 0) {
          const x = Math.max(-1, Math.min(1, gamma / 35));
          const y = Math.max(-1, Math.min(1, (beta - 45) / 35));
          this.onGesture("steer", { x, y });
        }
        return;
      }
      if (this.profile === "relay") {
        if (this.ringFrame % RING_THROTTLE !== 0) return;
        if (this.ringPrevBeta === null) {
          this.ringPrevBeta = beta;
          this.ringPrevGamma = gamma;
          return;
        }
        const dBeta2 = Math.abs(beta - this.ringPrevBeta);
        const dGamma2 = Math.abs(gamma - this.ringPrevGamma);
        this.ringPrevBeta = beta;
        this.ringPrevGamma = gamma;
        if (dBeta2 > RING_SHAKE || dGamma2 > RING_SHAKE) {
          this.onAction?.("relayToggle");
          return;
        }
        if (dBeta2 > RING_TILT || dGamma2 > RING_TILT) {
          if (beta > 0) this.onAction?.("relayOn");
          else this.onAction?.("relayOff");
        }
        return;
      }
      if (this.ringFrame % RING_THROTTLE !== 0) return;
      if (this.ringPrevBeta === null) {
        this.ringPrevBeta = beta;
        this.ringPrevGamma = gamma;
        return;
      }
      const dBeta = Math.abs(beta - this.ringPrevBeta);
      const dGamma = Math.abs(gamma - this.ringPrevGamma);
      this.ringPrevBeta = beta;
      this.ringPrevGamma = gamma;
      if (dBeta > RING_SHAKE || dGamma > RING_SHAKE) {
        this.onGesture("shake", { dBeta, dGamma });
        return;
      }
      if (gamma > RING_TILT) this.onGesture("tilt", { dir: "right", gamma });
      else if (gamma < -RING_TILT) this.onGesture("tilt", { dir: "left", gamma });
      else if (beta > RING_TILT) this.onGesture("tilt", { dir: "up", beta });
      else if (beta < -RING_TILT) this.onGesture("tilt", { dir: "down", beta });
    }
    handleCane(e) {
      if (!this.caneActive) return;
      this.caneFrame++;
      const { CANE_TAP, CANE_SWING, CANE_THROTTLE } = WEARABLE_DEFAULTS;
      if (this.caneFrame % CANE_THROTTLE !== 0) return;
      const a = e.accelerationIncludingGravity || e.acceleration || { x: 0, y: 0, z: 0 };
      const dax = Math.abs((a.x || 0) - this.caneLastAccel.x);
      const day = Math.abs((a.y || 0) - this.caneLastAccel.y);
      const daz = Math.abs((a.z || 0) - this.caneLastAccel.z);
      this.caneLastAccel = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
      if (this.profile === "aim-draw") {
        if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) {
          const now = Date.now();
          if (now - this.lastHitAt < 160) return;
          this.lastHitAt = now;
          const velocity = Math.min(1.25, Math.max(dax, day, daz) / 14);
          this.onGesture("release", { velocity });
          return;
        }
        const rot = e.rotationRate || { gamma: 0 };
        const rg = rot.gamma || 0;
        if (this.canePrevGamma !== null && Math.abs(rg - this.canePrevGamma) > CANE_SWING) {
          const now = Date.now();
          if (now - this.lastHitAt >= 100) {
            this.lastHitAt = now;
            const velocity = Math.min(1.2, Math.abs(rg - this.canePrevGamma) / 12);
            this.onGesture("draw", { velocity });
          }
        }
        this.canePrevGamma = rg;
        return;
      }
      if (this.profile === "relay") {
        if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) this.onAction?.("relayToggle");
        return;
      }
      if (dax > CANE_TAP || day > CANE_TAP || daz > CANE_TAP) {
        const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
        this.onGesture("tap", { spike: Math.max(dax, day, daz), mag });
        if (this.profile === "steer") this.onGesture("chirp", {});
        return;
      }
      if (Math.abs(a.x || 0) > CANE_SWING) {
        const dir = (a.x || 0) > 0 ? "right" : "left";
        this.onGesture("swing", { dir });
      }
    }
  };
  function attachWearableEnableButton(buttonId = "wearable-enable") {
    if (typeof document === "undefined") return;
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    const input = createWearableInput({
      onRingShake: () => window.onWearableGesture?.("shake", {}),
      onRingTiltUp: () => window.onWearableGesture?.("tilt", { dir: "up" }),
      onRingTiltDown: () => window.onWearableGesture?.("tilt", { dir: "down" }),
      onRingTiltLeft: () => window.onWearableGesture?.("tilt", { dir: "left" }),
      onRingTiltRight: () => window.onWearableGesture?.("tilt", { dir: "right" }),
      onCaneTap: () => window.onWearableGesture?.("tap", {}),
      onCaneSwing: (dir) => window.onWearableGesture?.("swing", { dir })
    });
    btn.addEventListener("click", async () => {
      const ok = await input.requestPermission().catch(() => false);
      if (!ok) return;
      input.start();
      btn.textContent = "\u6212\u6307/\u624B\u6756\u5DF2\u542F\u7528";
    });
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    window.WearableInput = WearableInput;
    window.createWearableInput = createWearableInput;
    window.WEARABLE_DEFAULTS = WEARABLE_DEFAULTS;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => attachWearableEnableButton());
    } else {
      attachWearableEnableButton();
    }
  }

  // src/app.js
  var $ = (sel, root = document) => root.querySelector(sel);
  var state = {
    screen: "home",
    categoryId: null,
    imageData: null,
    imageAnalysis: null,
    checklist: {},
    focusCheckIdx: 0,
    reports: [],
    lastResult: null
  };
  var els = {};
  async function haptic(style = "Light") {
    try {
      const { Haptics: Haptics2, ImpactStyle: ImpactStyle2 } = await Promise.resolve().then(() => (init_esm(), esm_exports));
      await Haptics2.impact({ style: ImpactStyle2[style] || ImpactStyle2.Light });
    } catch {
    }
  }
  function toast(msg) {
    const t = els.toast;
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => t.classList.remove("show"), 2e3);
  }
  function showScreen(name) {
    state.screen = name;
    ["Home", "Inspect", "Result"].forEach((s) => {
      const el = $(`#screen${s}`);
      el?.classList.toggle("active", s.toLowerCase() === name);
    });
  }
  function formatDate(ts) {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  function renderCategories() {
    const grid = els.catGrid;
    if (!grid) return;
    grid.innerHTML = listCategories().map((c) => `
    <button type="button" class="cat-card" data-id="${c.id}">
      <span class="icon">${c.icon}</span>
      <span class="name">${c.name}</span>
      <span class="gb">${c.gbRefs[0]}</span>
    </button>
  `).join("");
    grid.querySelectorAll(".cat-card").forEach((btn) => {
      btn.addEventListener("click", () => startInspect(btn.dataset.id));
    });
  }
  function renderReports() {
    const list = els.reportList;
    const empty = els.emptyReports;
    const sorted = sortReports(state.reports);
    empty.hidden = sorted.length > 0;
    list.innerHTML = sorted.slice(0, 8).map((r) => {
      const g = gradeInfo(r.grade);
      const thumb = r.imageThumb ? `<img src="${r.imageThumb}" alt="" />` : '<div class="thumb-ph"></div>';
      return `
      <div class="report-card" data-id="${r.id}">
        ${thumb}
        <div class="meta">
          <h4>${r.categoryName || r.categoryId}</h4>
          <p>${formatDate(r.createdAt)} \xB7 ${r.score} \u5206 \xB7 ${g.label}</p>
        </div>
        <span class="badge ${r.passed ? "pass" : "fail"}">${r.passed ? "\u5408\u683C" : "\u4E0D\u5408\u683C"}</span>
      </div>
    `;
    }).join("");
    list.querySelectorAll(".report-card").forEach((card) => {
      card.addEventListener("click", () => showReportDetail(card.dataset.id));
    });
  }
  function showReportDetail(id) {
    const r = state.reports.find((x) => x.id === id);
    if (!r) return;
    state.lastResult = r;
    renderResult({
      passed: r.passed,
      score: r.score,
      grade: r.grade,
      summary: r.summary,
      failures: r.failures,
      gbRefs: r.gbRefs,
      visualScore: r.visualScore,
      checklistPct: r.checklistPct,
      categoryName: r.categoryName
    });
    showScreen("result");
  }
  function startInspect(categoryId) {
    const cat = getCategory(categoryId);
    if (!cat) return;
    state.categoryId = categoryId;
    state.imageData = null;
    state.imageAnalysis = null;
    state.checklist = {};
    state.focusCheckIdx = 0;
    els.inspectCatName.textContent = `${cat.icon} ${cat.name}`;
    els.inspectGb.textContent = cat.gbRefs.join(" \xB7 ");
    els.previewCanvas.hidden = true;
    els.previewImg.hidden = true;
    els.cameraPlaceholder.hidden = false;
    els.analyzeBtn.disabled = true;
    els.submitInspectBtn.disabled = true;
    renderQualityBanner(null);
    renderChecklist(cat);
    showScreen("inspect");
    haptic("Light");
  }
  function renderQualityBanner(analysis) {
    const banner = els.qualityBanner;
    if (!banner) return;
    if (!analysis) {
      banner.className = "quality-banner";
      banner.innerHTML = "";
      return;
    }
    const warnings = analysis.captureWarnings || [];
    const tips = analysis.captureTips || [];
    const reliable = analysis.visualReliability === "high" || analysis.visualReliability === "medium";
    if (!warnings.length && reliable) {
      banner.className = "quality-banner show ok";
      banner.innerHTML = `<strong>\u62CD\u6444\u8D28\u91CF\u826F\u597D</strong>\u89C6\u89C9\u5206\u6790\u53EF\u4FE1\uFF0C\u5DF2\u542F\u7528\u81EA\u52A8\u9884\u68C0\u8F85\u52A9`;
      return;
    }
    if (warnings.length) {
      banner.className = "quality-banner show warn";
      const tipHtml = tips.length ? `<ul>${tips.slice(0, 2).map((t) => `<li>${t}</li>`).join("")}</ul>` : "";
      const suffix = reliable ? "\u90E8\u5206\u6307\u6807\u4ECD\u53EF\u7528\u4E8E\u8F85\u52A9\u5224\u5B9A" : "\u89C6\u89C9\u7ED3\u679C\u672A\u91C7\u4FE1\uFF0C\u8BF7\u4EBA\u5DE5\u6838\u5BF9\u6E05\u5355";
      banner.innerHTML = `<strong>\u62CD\u6444\u5F02\u5E38\uFF1A${warnings.slice(0, 2).join("\u3001")}</strong>${suffix}${tipHtml}`;
      return;
    }
    banner.className = "quality-banner";
    banner.innerHTML = "";
  }
  function renderChecklist(cat, analysis = null) {
    const box = els.checklist;
    const useAuto = analysis?.visualReliability === "high" || analysis?.visualReliability === "medium";
    box.innerHTML = cat.checklist.map((item, idx) => {
      const auto = useAuto && item.autoKey && analysis?.autoHints?.[item.autoKey] !== void 0;
      const checked = state.checklist[item.id] ?? (auto ? analysis.autoHints[item.autoKey] : false);
      if (state.checklist[item.id] === void 0) state.checklist[item.id] = checked;
      return `
      <div class="check-item ${auto ? "auto" : ""}" data-id="${item.id}" data-idx="${idx}">
        <input type="checkbox" id="chk_${item.id}" ${checked ? "checked" : ""} />
        <label for="chk_${item.id}">
          ${item.label}${item.required ? "" : "\uFF08\u5EFA\u8BAE\uFF09"}
          ${auto ? '<span class="auto-tag">\u89C6\u89C9\u9884\u68C0</span>' : ""}
        </label>
      </div>
    `;
    }).join("");
    box.querySelectorAll(".check-item").forEach((row) => {
      const id = row.dataset.id;
      const input = row.querySelector("input");
      const toggle = () => {
        state.checklist[id] = input.checked;
        haptic("Light");
      };
      input.addEventListener("change", toggle);
      row.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT") return;
        input.checked = !input.checked;
        toggle();
      });
    });
  }
  async function handlePhoto(file) {
    if (!file || !state.categoryId) return;
    try {
      const canvas = els.analysisCanvas;
      const imageData = await loadImageToCanvas(file, canvas);
      state.imageData = imageData;
      els.previewImg.src = canvas.toDataURL("image/jpeg", 0.85);
      els.previewImg.hidden = false;
      els.previewCanvas.hidden = true;
      els.cameraPlaceholder.hidden = true;
      state.imageAnalysis = null;
      els.analyzeBtn.disabled = false;
      renderQualityBanner(null);
      toast("\u7167\u7247\u5DF2\u8F7D\u5165\uFF0C\u53EF\u5F00\u59CB\u5206\u6790");
      haptic("Medium");
    } catch {
      toast("\u65E0\u6CD5\u8BFB\u53D6\u7167\u7247");
    }
  }
  function runAnalysis() {
    if (!state.imageData || !state.categoryId) return;
    const analysis = analyzeImageData(state.imageData, state.categoryId);
    state.imageAnalysis = analysis;
    const cat = getCategory(state.categoryId);
    renderQualityBanner(analysis);
    renderChecklist(cat, analysis);
    els.submitInspectBtn.disabled = false;
    if (analysis.visualReliability === "low") {
      toast(`\u62CD\u6444\u8D28\u91CF ${analysis.captureQuality?.score ?? 0} \u5206 \xB7 \u8BF7\u64E6\u62ED\u955C\u5934\u6216\u91CD\u62CD`);
    } else if (analysis.issues.length) {
      toast(`\u89C6\u89C9 ${analysis.visualScore} \u5206 \xB7 ${analysis.issues[0]}`);
    } else {
      toast(`\u89C6\u89C9\u68C0\u6D4B ${analysis.visualScore} \u5206\uFF0C\u8272\u6CFD\u6B63\u5E38`);
    }
    haptic("Medium");
  }
  function submitInspection() {
    if (!state.categoryId) return;
    const cat = getCategory(state.categoryId);
    const result = evaluateInspection(
      state.categoryId,
      state.imageAnalysis || { visualScore: 0, autoHints: {} },
      state.checklist
    );
    result.categoryName = cat.name;
    const thumb = makeThumbDataUrl(els.analysisCanvas);
    const report = {
      categoryId: state.categoryId,
      categoryName: cat.name,
      passed: result.passed,
      score: result.score,
      grade: result.grade,
      summary: result.summary,
      failures: result.failures,
      gbRefs: result.gbRefs,
      visualScore: result.visualScore,
      visualReliability: result.visualReliability,
      checklistPct: result.checklistPct,
      captureWarnings: result.captureWarnings,
      imageThumb: thumb
    };
    state.reports = addReport(state.reports, report);
    saveReports(state.reports);
    state.lastResult = { ...result, imageThumb: thumb };
    renderReports();
    renderResult(result);
    showScreen("result");
    haptic(result.passed ? "Medium" : "Heavy");
  }
  function renderResult(result) {
    const g = gradeInfo(result.grade);
    const card = els.resultCard;
    card.innerHTML = `
    <div style="font-size:0.9rem;color:var(--ink-soft)">${result.categoryName || ""}</div>
    <div class="result-score" style="color:${g.color}">${result.score}</div>
    <span class="result-grade" style="background:${g.color}">${result.passed ? "\u2713 \u5408\u683C" : "\u2717 \u4E0D\u5408\u683C"} \xB7 ${g.label}</span>
    <p class="result-summary">${result.summary}</p>
    <div class="metrics">
      <div class="metric">\u89C6\u89C9\u5FEB\u68C0<strong>${result.visualScore ?? "\u2014"}</strong></div>
      <div class="metric">\u611F\u5B98\u6E05\u5355<strong>${result.checklistPct ?? 0}%</strong></div>
    </div>
    ${result.visualReliability === "low" || result.visualReliability === "none" ? `
      <p class="result-summary" style="margin-top:10px;font-size:0.82rem">
        \u62CD\u6444\u8D28\u91CF\u4E0D\u8DB3\uFF0C\u672C\u6B21\u4EE5\u4EBA\u5DE5\u611F\u5B98\u6E05\u5355\u4E3A\u4E3B\u5224\u5B9A
      </p>
    ` : ""}
    ${result.captureWarnings?.length ? `
      <div class="fail-list" style="background:rgba(196,122,0,0.1);color:#8a5a00">
        <strong>\u62CD\u6444\u63D0\u9192</strong>
        <ul>${result.captureWarnings.map((w) => `<li>${w}</li>`).join("")}</ul>
      </div>
    ` : ""}
    ${result.failures?.length ? `
      <div class="fail-list">
        <strong>\u672A\u8FBE\u6807\u9879</strong>
        <ul>${result.failures.map((f) => `<li>${f}</li>`).join("")}</ul>
      </div>
    ` : ""}
    <div class="gb-tags">
      ${(result.gbRefs || []).map((ref) => `<span class="gb-tag">${ref}</span>`).join("")}
    </div>
  `;
  }
  function focusChecklist(delta) {
    const cat = getCategory(state.categoryId);
    if (!cat || state.screen !== "inspect") return;
    const items = cat.checklist;
    state.focusCheckIdx = Math.max(0, Math.min(items.length - 1, state.focusCheckIdx + delta));
    const rows = els.checklist.querySelectorAll(".check-item");
    rows.forEach((r, i) => {
      r.style.outline = i === state.focusCheckIdx ? "2px solid var(--leaf)" : "";
    });
    rows[state.focusCheckIdx]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function toggleFocusedCheck() {
    const cat = getCategory(state.categoryId);
    if (!cat || state.screen !== "inspect") return;
    const item = cat.checklist[state.focusCheckIdx];
    if (!item) return;
    const input = $(`#chk_${item.id}`);
    if (input) {
      input.checked = !input.checked;
      state.checklist[item.id] = input.checked;
      haptic("Light");
    }
  }
  function bindEvents() {
    els.pickPhotoBtn.addEventListener("click", () => els.fileInput.click());
    els.fileInput.addEventListener("change", () => {
      const f = els.fileInput.files?.[0];
      if (f) handlePhoto(f);
      els.fileInput.value = "";
    });
    els.analyzeBtn.addEventListener("click", runAnalysis);
    els.submitInspectBtn.addEventListener("click", submitInspection);
    els.backFromInspect.addEventListener("click", () => showScreen("home"));
    els.backFromResult.addEventListener("click", () => showScreen("home"));
    els.doneBtn.addEventListener("click", () => showScreen("home"));
  }
  function bindWearable() {
    const wear = createWearableInput({
      onRingShake: () => {
        if (state.screen === "inspect" && !state.imageData) {
          els.fileInput.click();
          toast("\u6212\u6307\u6447\u52A8 \xB7 \u6253\u5F00\u76F8\u673A");
        } else if (state.screen === "inspect" && state.imageData && !state.imageAnalysis) {
          runAnalysis();
          toast("\u6212\u6307\u6447\u52A8 \xB7 \u5F00\u59CB\u5206\u6790");
        }
      },
      onRingTiltUp: () => focusChecklist(-1),
      onRingTiltDown: () => focusChecklist(1),
      onCaneTap: () => {
        if (state.screen === "inspect") toggleFocusedCheck();
        else if (state.screen === "result") showScreen("home");
      },
      onCaneSwingRight: () => focusChecklist(1),
      onCaneSwingLeft: () => focusChecklist(-1)
    });
    els.wearBtn.addEventListener("click", async () => {
      if (wear.listening) {
        wear.stop();
        els.wearBtn.classList.remove("on");
        toast("\u7A7F\u6234\u4F20\u611F\u5DF2\u5173\u95ED");
        return;
      }
      const ok = await wear.requestPermission();
      if (!ok) {
        toast("\u672A\u83B7\u5F97\u4F20\u611F\u5668\u6743\u9650");
        return;
      }
      wear.start();
      els.wearBtn.classList.add("on");
      toast("\u7A7F\u6234\u5DF2\u542F\u7528\uFF1A\u6447\u6212\u62CD\u7167/\u5206\u6790\uFF0C\u624B\u6756\u70B9\u9009");
    });
  }
  function init() {
    els.toast = $("#toast");
    els.catGrid = $("#catGrid");
    els.reportList = $("#reportList");
    els.emptyReports = $("#emptyReports");
    els.inspectCatName = $("#inspectCatName");
    els.inspectGb = $("#inspectGb");
    els.cameraZone = $("#cameraZone");
    els.previewCanvas = $("#previewCanvas");
    els.previewImg = $("#previewImg");
    els.cameraPlaceholder = $("#cameraPlaceholder");
    els.fileInput = $("#fileInput");
    els.pickPhotoBtn = $("#pickPhotoBtn");
    els.analyzeBtn = $("#analyzeBtn");
    els.checklist = $("#checklist");
    els.submitInspectBtn = $("#submitInspectBtn");
    els.resultCard = $("#resultCard");
    els.backFromInspect = $("#backFromInspect");
    els.backFromResult = $("#backFromResult");
    els.doneBtn = $("#doneBtn");
    els.analysisCanvas = $("#analysisCanvas");
    els.qualityBanner = $("#qualityBanner");
    els.wearBtn = $("#wearBtn");
    state.reports = loadReports();
    renderCategories();
    renderReports();
    bindEvents();
    bindWearable();
    document.body.classList.add("ready");
  }
  init();
})();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
//# sourceMappingURL=app.js.map
