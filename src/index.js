import { Launch, Utils } from "@lightningjs/sdk";
import { App } from "./App.js";
import { Url } from "./util/urlUtil.js";
import require from "./util/require.js";
import "./util/polyfills.js";


export default function(config, platformSettings) {
  Url.moveHashQueryToLocationSearch();
  const staticUrl = Utils.ensureUrlWithProtocol(Url.makeFullStaticPath(window.location.pathname, platformSettings.path));

  if (process.env.NODE_ENV === "development") document.body.style.backgroundColor = "black";

  require(staticUrl + "libs/codelib/src/specific/hz/util/string.js");
  require(staticUrl + "libs/codelib/src/specific/hz/util/util.js");
  require(staticUrl + "libs/codelib/src/util/util.js");
  require(staticUrl + "libs/codelib/src/util/dateTime.js");
  require(staticUrl + "libs/codelib/src/specific/hz/util/init.js");
  require(staticUrl + "libs/codelib/src/util/log.js");
  require(staticUrl + "libs/codelib/src/util/lib.js");
  require(staticUrl + "libs/codelib/src/specific/hz/util/device.js");
  require(staticUrl + "libs/codelib/src/util/vmError.js");
  require(staticUrl + "libs/codelib/src/util/errorUtil.js");
  require(staticUrl + "libs/codelib/src/util/netUtil.js");
  require(staticUrl + "libs/codelib/src/util/url.js");
  require(staticUrl + "libs/codelib/src/util/urlUtil.js");
  require(staticUrl + "libs/codelib/src/tracking/adobeMeasurement.js");
  require(staticUrl + "libs/codelib/src/specific/hz/tracking/tracking.js");
  require(staticUrl + "libs/codelib/src/util/fileLoader.js");
  require(staticUrl + "libs/codelib/src/util/jsonLoader.js");

  const _config = {
    ...config,
    keys: {
      227: "Rewind",    // RCU MediaRewind
      228: "FastForward",    // RCU MediaFastForward
      27: "Return",     // Key B
      66: "Return",     // RCU Back
      13: "Enter",      // Key Enter
      16: "PlayPause",      // Key Shift
      179: "PlayPause",      // RCU Play
      93: "ContextMenu", // Key OPTIONS
      79: "ContextMenu", // Key O as OPTIONS
    },
  };

  return Launch(App, _config, platformSettings);
}
