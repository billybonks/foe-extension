import FoeProxy from './index'

const requestInfoHolder = new WeakMap();
function getRequestData(xhr) {
  let data = requestInfoHolder.get(xhr);
  if (data != null) return data;

  data = {url: null, method: null, postData: null};
  requestInfoHolder.set(xhr, data);
  return data;
}

function xhrOnLoadHandler(foeProxy) {
  if (this.xhrQueue) {
    this.xhrQueue.push(this);
    return;
  }
  const requestData = getRequestData(this);
  const url = requestData.url;
  const postData = requestData.postData;

  // handle raw request handlers
  for (let callback of foeProxy.proxyRaw) {
    try {
      callback(this, requestData);
    } catch (e) {
      console.error(e);
    }
  }

  // handle metadata request handlers
  const metadataIndex = url.indexOf("metadata?id=");
  if (metadataIndex > -1) {
    const metaURLend = metadataIndex + "metadata?id=".length,
      metaArray = url.substring(metaURLend).split('-', 2),
      meta = metaArray[0];

    // if(meta === 'city_entities'){
    //   MainParser.CityMetaId = metaArray[1];
    // }

    const metaHandler = foeProxy.proxyMetaMap[meta];

    if (metaHandler) {
      for (let callback of metaHandler) {
        try {
          callback(this, postData);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  // nur die jSON mit den Daten abfangen
  if (url.indexOf("game/json?h=") > -1) {

    let d = /** @type {FoE_NETWORK_TYPE[]} */(JSON.parse(this.responseText));

    let requestData = postData;
    try {
      requestData = JSON.parse(new TextDecoder().decode(postData));
    } catch (e) {
      console.log('Can\'t parse postData: ', postData);
    }

    for (let entry of d) {
      foeProxy.proxyAction(entry.requestClass, entry.requestMethod, entry, requestData);
    }
  }
}

export default function(foeProxy: FoeProxy) {
  const XHR = XMLHttpRequest.prototype;
  const open = XHR.open;
  const send = XHR.send;
  XHR.open = function(method: string, url: string){
    if (foeProxy.proxyEnabled) {
      const data = getRequestData(this);
      data.method = method;
      data.url = url;
    }

    return open.apply(this, arguments);
  };
  XHR.send = function(postData) {
    if (foeProxy.proxyEnabled) {
      const data = getRequestData(this);
      data.postData = postData;
      let handler = function(foeProxy, xhrOnLoadHandler) {

        return function(){
          xhrOnLoadHandler.call(this, foeProxy)
        }

      }
      this.addEventListener('load', handler(foeProxy,xhrOnLoadHandler), {capture: false, passive: true});
    }

    return send.apply(this, arguments);
  };
}
