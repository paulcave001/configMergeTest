import { store } from "../util/store";

export class AbortHandler {
  constructor() {
    if (window.AbortController) {
      this.controller = new AbortController();
    }
  }

  get signal() {
    return this.controller?.signal;
  }

  static cancelRequest(storeObj) {
    this.controller?.abort();

    if (!store.cancelledRequests.includes(storeObj)) {
      store.cancelledRequests.push(storeObj);
    }
  }

  static clearCancelledRequest(storeObj) {
    if (store.cancelledRequests.includes(storeObj)) {
      store.cancelledRequests = store.cancelledRequests.filter(item => item._func.name !== storeObj._func.name);
    }
  }
}
