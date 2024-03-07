export default {
  getParmars(variable) {
     var query = unescape(decodeURI(window.location.search.substring(1)));
     if (!query || query === "") {
       return null
     }
     var vars = query.split("&");
     if (!variable) {
       let obj = {}
       for (var i=0; i<vars.length; i++) {
         var pair = vars[i].split("=")
         obj[pair[0]] = pair[1]
       }
       return obj
     }
     if(typeof variable === 'string') {
       for (var i=0; i<vars.length; i++) {
         var pair = vars[i].split("=");
         if(pair[0] == variable){return pair[1];}
       }
     } else if (variable instanceof Array) {
       let arr = []
       for (var i=0; i<vars.length; i++) {
         var pair = vars[i].split("=");
         var count = variable.indexOf(pair[0])
         if(count > -1) {arr[count] = pair[1]}
       }
       return arr
     }
     return null
  }
}
