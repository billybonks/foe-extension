function promisedLoadCode(src, element) {
	return new Promise(async (resolve, reject) => {
    if(!element){
      element = createElement(src)
    }

		element.addEventListener('load', function() {
			this.remove();
			resolve();
		});
		element.addEventListener('error', function() {
			console.error('error loading script '+src);
			this.remove();
			reject();
		});

		while (!document.head && !document.documentElement) await new Promise((resolve) => {
			// @ts-ignore
			requestIdleCallback(resolve);
		});

		(document.head || document.documentElement).appendChild(element);
	});
}


function createElement(src){

  let sc = document.createElement('script');
  sc.src = getFileUrl(src);
  return sc
}

function getFileUrl(src){
  const absPath = chrome.runtime.getURL(src)
  const v = chrome.runtime.getManifest().version;
  return `${absPath}?v=${v}`;
}

let requireElement = createElement('vendor/require.js');
requireElement.setAttribute('data-main', getFileUrl('src/app.js'))

promisedLoadCode('vendor/require.js', requireElement).then(function(){
  return promisedLoadCode('dist/build.js')
})
