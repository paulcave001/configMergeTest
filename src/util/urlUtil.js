/*global vmDtvLib*/
import { Log } from "@lightningjs/sdk";
import { originalVmConfig } from "./store";

export class Url {
  static absolute(url) {
    const vmAbsConfigUrl = originalVmConfig.data?.vmAbsConfigUrl;

    console.log(":::: vmAbsConfigUrl", vmAbsConfigUrl);

    if (vmAbsConfigUrl) {
      return vmDtvLib.urlUtil.makeAbsolute(url, vmAbsConfigUrl);
    }
  }

  static makeFullStaticPath(pathname = "/", path) {
    // ensure path has traling slash
    path = path.charAt(path.length - 1) !== "/" ? path + "/" : path;

    // if path is URL, we assume it's already the full static path, so we just return it
    if (/^(?:https?:)?(?:\/\/)/.test(path)) {
      return path;
    }

    if (path.charAt(0) === "/") {
      return path;
    } else {
      // cleanup the pathname (i.e. remove possible index.html)
      pathname = this.cleanUpPathName(pathname);

      // remove possible leading dot from path
      path = path.charAt(0) === "." ? path.substr(1) : path;
      // ensure path has leading slash
      path = path.charAt(0) !== "/" ? "/" + path : path;
      return pathname + path;
    }
  }

  static cleanUpPathName(pathname) {
    if (pathname.slice(-1) === "/") {
      return pathname.slice(0, -1);
    }

    const parts = pathname.split("/");
    if (parts[parts.length - 1].indexOf(".") > -1) {
      parts.pop();
    }
    return parts.join("/");
  }

  /**
   * moves query params from location.hash to location.search
   * #Home?param1=1&param2=2 -> ?param1=1&param2=2#Home
   *
   * @static
   * @memberof Url
   */
  static moveHashQueryToLocationSearch() {
    const hash = document.location.hash;

    if (hash.indexOf("?") !== -1) {
      let url = document.location.href;
      const search = document.location.search;
      const hashQuery = hash.substring(hash.indexOf("?"));
      const cleanHash = hash.replace(hashQuery, "");
      const newSearch = search ? search + hashQuery.replace("?", "&") : hashQuery;

      if (search) {
        url = url.replace(hashQuery, "");
        url = url.replace(search, newSearch);
      } else {
        url = url.replace(hash, newSearch + cleanHash);
      }

      if (history.replaceState) {
        Log.warn("history.replaceState is supported. No reload needed.");
        history.replaceState(null, null, url);
      }
      else {
        Log.warn("history.replaceState not supported. Reloading page.");
        location.href = url;
      }
    }
  }

  static removeQueryParams(paramsString) {
    let url = document.location.href;

    let newQuery = location.search.replace(paramsString, "");

    if (newQuery.slice(-1) === "&") {
      newQuery = newQuery.slice(0, -1);
    }

    if (newQuery.charAt(0) === "&") {
      newQuery = "?" + newQuery.substring(1);
    } else if (newQuery.charAt(0) !== "?" && newQuery.length > 0) {
      newQuery = "?" + newQuery;
    }

    if (newQuery === "?" || newQuery === "&") {
      newQuery = "";
    }

    const newUrl = url.replace(location.search, newQuery);

    if (history.replaceState) {
      Log.warn("history.replaceState is supported. No reload needed.");
      Log.info("replacing query params " + location.search + " with " + newQuery);
      history.replaceState(null, null, newUrl);
    }
  }
}