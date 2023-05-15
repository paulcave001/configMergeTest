export default function require(url) {
  // allows loading without js suffix;
  if (url.toLowerCase().substr(-3) !== ".js") {
    url += ".js";
  }

  //init cache
  if (!require.cache) {
    require.cache = [];
  }

  //get from cache if the script was loaded before
  let exports = require.cache[url];
  if (!exports) {
    try {
      exports = {};
      const X = new XMLHttpRequest();
      X.open("GET", url, 0); // synchronous request
      X.send();

      // throw error if the file was not loaded correctly
      if (X.status && X.status !== 200) {
        throw new Error(X.statusText);
      }

      let source = X.responseText;

      // add link to source for the Dev Tools
      source = "//@ sourceURL=" + window.location.origin + url + "\n" + source;

      // mimic node.js modules structure
      const module = { id: url, uri: url, exports: exports };

      //create a Fn with module code, and 3 params: require, exports & module
      const anonFn = new Function("require", "exports", "module", source);
      anonFn(require, exports, module); // call the Fn, Execute the module

      //cache obj exported by module
      require.cache[url] = exports = module.exports;
    } catch (err) {
      throw new Error("Error loading module " + url + ": " + err);
    }
  }
  return exports; //returns object exported by module
}
