/**
 * Observable entity.
 * Allows subscription to the function updates.
 * Passes value to the callback function when original value has changed.
 * Imitates Observable class from RxJS.
 *
 * @class Observable
 */
export class Observable {
  _callbacks = new Set();
  _onceCallbacks = new Set();
  _data = null;
  _func = null;
  _isUpdating = false;

  /**
   * Creates an instance of Observable
   *
   * @param {Function<Promise>} func
   * @memberof Observable
   */
  constructor(func) {
    if (typeof func === "function") {
      this._func = func;
    }
  }

  /**
   * Getter for CURRENT data
   * !Should be ONLY used to receive current data on the fly, without subscription!
   *
   * @readonly
   * @memberof Observable
   */
  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
  }

  /**
   * Method to await data in async function
   * `const data = await observable.await();`
   *
   * Automatically subscribes to itself if data is not available.
   * Automatically unsubscribes from itself when data is received.
   *
   * @return {Promise}
   * @memberof Observable
   */
  await() {
    return new Promise((resolve) => {
      if (this.data) {
        resolve(this.data);
      } else {
        this.subscribeOnce((result) => resolve(result));
      }
    });
  }

  /**
   * Method to update Observable value and notify subscribers
   *
   * @param {any} value - any value to manually update the observable entity
   * @memberof Observable
   */
  update(value) {
    if (value !== undefined) {
      this.data = value;
      this.notifySubscribers();
    } else {
      this._func().then((result) => {
        this._isUpdating = false;
        this.data = result;
        this.notifySubscribers();
      });
    }
  }

  notifySubscribers() {
    this._callbacks.forEach((cb) => cb(JSON.parse(JSON.stringify(this.data || null))));
    this._onceCallbacks.forEach((cb) => {
      cb(JSON.parse(JSON.stringify(this.data || null)));
      this.unsubscribe(cb);
    });
  }

  /**
   *  Method to subscribe to data updates.
   *
   * @param {Function} callback - function that will be executed when the fresh data is received
   * @memberof Observable
   */
  subscribe(callback) {
    this._callbacks.add(callback);

    if (this.data) {
      callback(JSON.parse(JSON.stringify(this.data)));
      return;
    }

    if (!this._isUpdating && !this.data && this._func) {
      this._isUpdating = true;
      this.update();
    }
  }

  /**
   *  Method to subscribe to data updates only ONCE.
   *
   * @param {Function} callback - function that will be executed when the fresh data is received
   * @memberof Observable
   */
  subscribeOnce(callback) {
    this._onceCallbacks.add(callback);

    if (this.data) {
      callback(JSON.parse(JSON.stringify(this.data)));
      this._onceCallbacks.delete(callback);
      return;
    }

    if (!this._isUpdating && !this.data && this._func) {
      this._isUpdating = true;
      this.update();
    }
  }

  /**
   *  Method to unsubscribe from data updates.
   *
   * @param {Function} callback - function that should be deleted from subscribers list
   * @memberof Observable
   */
  unsubscribe(callback) {
    this._callbacks.delete(callback);
    this._onceCallbacks.delete(callback);
  }
}