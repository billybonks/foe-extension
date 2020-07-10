export default class FoeProxy {
  proxyMap: {};
  proxyMetaMap: {};
  proxyRaw: any;
  wsHandlerMap: {}
  wsRawHandler = [];
  wsQueue: [];
  xhrQueue: [];
  proxyEnabled: Boolean;

  constructor(){
    /** @type {Record<string, undefined|Record<string, undefined|((data: FoE_NETWORK_TYPE, postData: any) => void)[]>>} */
    this.proxyMap = {};
    /** @type {Record<string, undefined|((data: any, requestData: any) => void)[]>} */
    this.proxyMetaMap = {};

    /** @type {((data: any, requestData: any) => void)[]} */
    this.proxyRaw = [];

    // Websocket-Handler
    this.wsHandlerMap = {};
    this.wsRawHandler = [];

    // startup Queues
    this.xhrQueue = [];
    this.wsQueue = [];
    this.proxyEnabled = true;
  }
  addHandler(service: string, method: string, callback: any) {
    // default service and method to 'all'
    if (method === undefined) {
      // @ts-ignore
      callback = service;
      service = method = 'all';
    } else if (callback === undefined) {
      // @ts-ignore
      callback = method;
      method = 'all';
    }

    let map = this.proxyMap[service];
    if (!map) {
      this.proxyMap[service] = map = {};
    }
    let list = map[method];
    if (!list) {
      map[method] = list = [];
    }
    if (list.indexOf(callback) !== -1) {
      // already registered
      return;
    }
    list.push(callback);
  }

  removeHandler(service: string, method: string, callback: any) {
    // default service and method to 'all'
    if (method === undefined) {
      callback = service;
      service = method = 'all';
    } else if (callback === undefined) {
      callback = method;
      method = 'all';
    }

    let map = this.proxyMap[service];
    if (!map) {
      return;
    }
    let list = map[method];
    if (!list) {
      return;
    }
    map[method] = list.filter(c => c !== callback);
  }

  // for metadata requests: metadata?id=<meta>-<hash>
  addMetaHandler(meta: string, callback: any) {
    let list = this.proxyMetaMap[meta];
    if (!list) {
      this.proxyMetaMap[meta] = list = [];
    }
    if (list.indexOf(callback) !== -1) {
      // already registered
      return;
    }

    list.push(callback);
  }

  removeMetaHandler(meta: string, callback: any) {
    let list = this.proxyMetaMap[meta];
    if (!list) {
      return;
    }
    this.proxyMetaMap[meta] = list.filter(c => c !== callback);
  }

  // for raw requests access
  addRawHandler(callback: any) {
    if (this.proxyRaw.indexOf(callback) !== -1) {
      // already registered
      return;
    }

    this.proxyRaw.push(callback);
  }

  removeRawHandler(callback: any) {
    this.proxyRaw = this.proxyRaw.filter(c => c !== callback);
  }

  /**
   * Fügt einen Datenhandler für Nachrichten des WebSockets hinzu.
   * @param {string} service Der Servicewert, der in der Nachricht gesetzt sein soll oder 'all'
   * @param {string} method Der Methodenwert, der in der Nachricht gesetzt sein soll oder 'all'
   * TODO: Genaueren Typ für den Callback definieren
   * @param {(data: FoE_NETWORK_TYPE) => void} callback Der Handler, welcher mit der Nachricht aufgerufen werden soll.
   */
  addWsHandler(service: string, method: string, callback: any) {
    // default service and method to 'all'
    if (method === undefined) {
      // @ts-ignore
      callback = service;
      service = method = 'all';
    } else if (callback === undefined) {
      // @ts-ignore
      callback = method;
      method = 'all';
    }

    let map = this.wsHandlerMap[service];
    if (!map) {
      this.wsHandlerMap[service] = map = {};
    }
    let list = map[method];
    if (!list) {
      map[method] = list = [];
    }
    if (list.indexOf(callback) !== -1) {
      // already registered
      return;
    }
    list.push(callback);
  }

  removeWsHandler(service: string, method: string, callback: any) {
    // default service and method to 'all'
    if (method === undefined) {
      callback = service;
      service = method = 'all';
    } else if (callback === undefined) {
      callback = method;
      method = 'all';
    }

    let map = this.wsHandlerMap[service];
    if (!map) {
      return;
    }
    let list = map[method];
    if (!list) {
      return;
    }
    map[method] = list.filter(c => c !== callback);
  }

  // for raw requests access
  addRawWsHandler(callback) {
    if (this.wsRawHandler.indexOf(callback) !== -1) {
      // already registered
      return;
    }

    this.wsRawHandler.push(callback);
  }

  removeRawWsHandler(callback) {
    this.wsRawHandler = this.wsRawHandler.filter(c => c !== callback);
  }

  /**
  * This function gets the callbacks from proxyMap[service][method] and executes them.
  */
  _proxyAction(service, method, data, postData) {
    const map = this.proxyMap[service];
    if (!map) {
      return;
    }
    const list = map[method];
    if (!list) {
      return;
    }
    for (let callback of list) {
      try {
        callback(data, postData);
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * This function gets the callbacks from proxyMap[service][method],proxyMap[service]['all'] and proxyMap['all']['all'] and executes them.
   */
  proxyAction(service, method, data, postData) {
    let global:any = window;
    if(global.DEBUG_FOE){
      console.log(`${service} ${method}`);
      console.log(data)
    }

    this._proxyAction(service, method, data, postData);
    this._proxyAction('all', method, data, postData);
    this._proxyAction(service, 'all', data, postData);
    this._proxyAction('all', 'all', data, postData);
  }
}
