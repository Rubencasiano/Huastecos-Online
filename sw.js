const CACHE ='cache-3';
const CACHE_DINAMICO = 'dinamico-1';
const CACHE_INMUTABLE = 'inmutable-1';


self.addEventListener('install',evento=>{
    const promesa=caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                'about.html',
                'offline.html',
                'menu.html',
                'feature.html',
                'contact.html',
                'index.html',
                'images/offline.jpg',
                'img2/huastecos2.jpg',
                'img2/huastecos3.jpg',
                'img2/huastecos1.jpg',
                'css/style.css',
                'js/app.js'
                
            ]);
        });
    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache=>{
        cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
        });
        
        //Indicamos que la instalación espere hasta que las promesas se cumplan
        evento.waitUntil(Promise.all([promesa, cacheInmutable]));
       });

    self.addEventListener('activate', evento=>{
        const respuesta=caches.keys().then(keys=>{
            keys.forEach(key =>{
                if(key !== CACHE && key.includes('cache')){
                    return caches.delete(key);
            }
        });
    });
    evento.waitUntil(respuesta);
});
       
    self.addEventListener('fetch', evento =>{

        //Estrategia 2 CACHE WITH NETWORK FALLBACK
    const respuesta=caches.match(evento.request)
        .then(res=>{
        //si el archivo existe en cache retornalo
        if (res) return res;
        //si no existe deberá ir a la web
        //Imprimos en consola para saber que no se encontro en cache
        console.log('No existe', evento.request.url);
        
        //Procesamos la respuesta a la petición localizada en la web
        return fetch(evento.request)
        .then(resWeb=>{//el archivo recuperado se almacena en resWeb
        //se abre nuestro cache
        caches.open(CACHE_DINAMICO)
        .then(cache=>{
        //se sube el archivo descargado de la web
            cache.put(evento.request,resWeb);
        //Mandamos llamar la limpieza al cargar un nuevo archivo
       //estamos indicando que se limpiará el cache dinamico y que 
       //solo debe haber 5 archivos
        limpiarCache(CACHE_DINAMICO,13);
        })
        //se retorna el archivo recuperado para visualizar la página
            return resWeb.clone(); 
        });
    })
        .catch(err => {
        //si ocurre un error, en nuestro caso no hay conexión
            if(evento.request.headers.get('accept').includes('text/html')){
            //si lo que se pide es un archivo html muestra nuestra página offline que esta en cache
            return caches.match('offline.html');
            }
            else{
            return caches.match('/images/offline.jpg');
            }
    });
            evento.respondWith(respuesta); 
    });
            //recibimos el nombre del espacio de cache a limpiar y el número de archivos permitido
            function limpiarCache(nombreCache, numeroItems){
        //abrimos el cache
        caches.open(nombreCache)
        .then(cache=>{
    //recuperamos el arreglo de archivos existentes en el espacio de cache
        return cache.keys(1)
        .then(keys=>{
        //si el número de archivos supera el limite permitido
        if (keys.length>numeroItems){
    //eliminamos el más antiguo y repetimos el proceso
        cache.delete(keys[0])
        .then(limpiarCache(nombreCache, numeroItems));
        }
        });
    });
}
   