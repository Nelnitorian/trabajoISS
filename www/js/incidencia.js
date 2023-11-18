const url_base = 'http://localhost:5000/'
const url_incidencias = url_base+'incidencias/'
const datos_ids = ["identificador", "nombre", "num_patin", "causa", "fecha_apertura", "fecha_cierre"]
var datos_incidencia = []

function mostrar(identificador, nombre, numero_patin, causa, fecha_apertura, fecha_cierre) {
	// Función para mostrar la información del contacto en la página
	document.getElementById("identificador").value = identificador;
	document.getElementById("nombre").value = nombre;
	document.getElementById("num_patin").value = numero_patin;
	document.getElementById("causa").value = causa;
	document.getElementById("fecha_apertura").value = fecha_apertura;
	document.getElementById("fecha_cierre").value = fecha_cierre;
}

function eliminar() {
    if (!window.confirm("¿Estás seguro de que quieres borrar la incidencia?")){
        return
    }
    var id = new URLSearchParams(location.search).get("id");
	const http = new XMLHttpRequest()
	http.open("DELETE", url_incidencias+id)
	http.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
            window.alert("Se ha borrado con éxito")
            back()
		} else {
            window.alert("Se ha producido un error")
        }
	}
	http.send()
}

function editar() {
    cargaEditar()
}

function actualizar() {
    var id = new URLSearchParams(location.search).get("id");

    const http = new XMLHttpRequest()
    var params = obten_parametros()
    http.open("PUT", url_incidencias +id)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Se ha modificado la incidencia correctamente")
            back()
        } else if (this.readyState == 4){
            alert("Se ha producido un error")
        }
    }
    http.send(params)
}

function cancelar() {
    cargaMostrar()
    mostrar(...datos_incidencia)
}

function crear(){
    const http = new XMLHttpRequest()
    var params = obten_parametros()
    http.open("POST", url_incidencias)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Se ha creado el contacto correctamente")
            // Después de mandar la petición volvemos a la página inicial
            window.location.href="index.html";
        } else if(this.readyState == 4){
            alert("Se ha producido un error")
        }
    }

    http.send(params)
}

function obten_parametros(){
    // Esta función se encarga de recoger los datos del formulario y crear los parámetros HTTP

    var nombre = document.getElementById("nombre").value;
    var apellidos = document.getElementById("apellidos").value;
    var numero = document.getElementById("numero").value;
    var email = document.getElementById("email").value;

    return "nombre="+nombre+"&apellidos="+apellidos+"&email="+email+"&tlf="+numero;

}

function back(){
    window.history.back()
}

function cargaCreacion(){
    cambiaVisiblidad(["boton_editar", "boton_cancelar", "boton_actualizar"], []);
    cambiaEnable(datos_ids, false)
}

function cargaEditar(){
    cambiaVisiblidad(["boton_editar"], ["boton_cancelar", "boton_actualizar"]);
    cambiaEnable(datos_ids, false)
}

function cargaMostrar(){
    cambiaVisiblidad(["boton_cancelar", "boton_actualizar"], ["boton_editar"]);
    cambiaEnable(datos_ids, true)
}

function cambiaVisiblidad(desaparecen=[], aparecen=[]){
    for (var i = 0; i < desaparecen.length; i++){
        var elemento = document.getElementById(desaparecen[i]);
        elemento.style.display = 'none';
    }
    for (var i = 0; i < aparecen.length; i++){
        var elemento = document.getElementById(aparecen[i]);
        elemento.style.display = 'block';
    }
}
function cambiaEnable(elementos=[], estado){
    for (var i = 0; i < elementos.length; i++){
        var elemento = document.getElementById(elementos[i]);
        elemento.disabled = estado;
    }
}

window.addEventListener('load', function () {

	var id = new URLSearchParams(location.search).get("id");

    if (!id) {
        // If id is empty or null, end the function
        cargaCreacion();
        return;
    }
    cargaMostrar();
	
	const http = new XMLHttpRequest()
	http.open("GET", url_incidencias+id)
	http.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var data = JSON.parse(this.responseText)
            datos_incidencia = [data.id, data.nombre, data.numero_patin, data.causa, data.fecha_apertura, data.fecha_cierre]
			mostrar(...datos_incidencia);
		}
	}
	http.send()
})
