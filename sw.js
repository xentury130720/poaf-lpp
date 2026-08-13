var CACHE='poaf-lpp-v3';
var FILES=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).catch(function(){}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){return k===CACHE?null:caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(r){
    return r || fetch(e.request).then(function(resp){
      var cp=resp.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,cp);}).catch(function(){});
      return resp;
    }).catch(function(){return caches.match('./index.html');});
  }));
});
