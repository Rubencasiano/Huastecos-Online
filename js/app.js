//obtenemos la url del servidor
var url=window.location.href;
//definimos que nuestro sw.js se encuentra en el repositorio
var ubicacionSw='Huastecos-Online/sw.js';
if ( navigator.serviceWorker ) {
/*Para que nuestro proyecto siga funcionando en localhost
como en el servidor realizaremos una validación si la url
contiene localhost la ruta es la local del proyecto, de lo contrario
es la ruta de nuestro repositorio*/
if(url.includes('Huastecos-Online')){
ubicacionSw='/sw.js';
}
navigator.serviceWorker.register(ubicacionSw);
}