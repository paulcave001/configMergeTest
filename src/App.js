window.$_ = undefined; // fix for specific/hz/util/device.js import

import { Router, Settings, Utils } from "@lightningjs/sdk";
import { Url } from "./util/urlUtil.js";

/**
 * Basic application class
 * Describes application setup, layout and routing
 *
 * @class App
 * @extends {Router.App}
 */
export class App extends Router.App {

  constructor(stage) {

    // get vmConfigUrl from settings
    let vmConfigUrl = Settings.get("app", "vmConfigUrl");
    const storeAppConfig = Settings.get("app", "storeAppConfig");

    if(!vmConfigUrl) vmConfigUrl = Utils.ensureUrlWithProtocol(Url.makeFullStaticPath(window.location.pathname,  Settings.get("platform", "path"))) + "publishConfig/config.json";
    
    vmDtvLib.lib.init((err, config) => {
      console.log(":::: codelib initialised:: config", config);
    }, {
      configUrl: vmConfigUrl || "./static/publishConfig/config.json", // overriding vmConfigUrl in default config
      lightning:settings
    });

    super(stage);
  }

  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      Logo: {
        mountX: 0.5,
        mountY: 1,
        x: 960,
        y: 600,
        src: Utils.asset('images/logo.png'),
      },
      Text: {
        mount: 0.5,
        x: 960,
        y: 720,
        text: {
          text: "Let's start Building!",
          fontFace: 'Regular',
          fontSize: 64,
          textColor: 0xbbffffff,
        },
      },
    }
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()
  }
}
