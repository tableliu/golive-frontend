 const f = function MP(ak) {
  return new Promise(function (resolve, reject) {
    let sc = (function() {
      return document.querySelector('#loadMapApi')
    })()
    const rs = function() {
      setTimeout(function() {
        if (BMap) {
          resolve(BMap)
        }else {
          rs()
        }
      }, 2000)
    }
    if (!sc) {
      var script = document.createElement("script");
      script.id = "loadMapApi";
      script.type = "text/javascript";
      script.src = ak
      script.onerror = reject;
      document.head.appendChild(script);
      sc = script
    }
    rs()
  })
}
export default f
