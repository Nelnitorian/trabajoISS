const url_base = 'http://localhost:5000/'
const url_incidencias = url_base+'incidencias/'
const datos_ids = ["identificador", "nombre", "num_patin", "causa", "fecha_apertura", "fecha_cierre", "cerrado"]
var datos_incidencia = []

function mostrar(identificador, nombre, numero_patin, causa, fecha_apertura, fecha_cierre, cerrado) {
	document.getElementById("identificador").innerText = identificador;
	document.getElementById("nombre").innerText = nombre;
	document.getElementById("num_patin").innerText = numero_patin;
	document.getElementById("causa").innerText = causa;
	document.getElementById("fecha_apertura").innerText = fecha_apertura;
	document.getElementById("fecha_cierre").innerText = fecha_cierre;
	document.getElementById("cerrado").checked = +cerrado;
}

function eliminar() {
    if (!window.confirm("¿Estás seguro de que quieres borrar la incidencia?")){
        return
    }
    var id = new URLSearchParams(location.search).get("id");
	const http = new XMLHttpRequest()
	http.open("DELETE", url_incidencias+id)
	http.onreadystatechange = function(){
		if(this.readyState == 2 && this.status == 200){
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
    // var params = obten_parametros_actualizar()
    http.open("PUT", url_incidencias +id)
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            alert("Se ha modificado la incidencia correctamente")
            back()
        } else if (this.readyState == 4){
            alert("Se ha producido un error")
        }
    }
    http.send()
}

function cancelar() {
    cargaMostrar()
    mostrar(...datos_incidencia)
}

function crear(){
    const http = new XMLHttpRequest()
    var params = obten_parametros_crear()
    http.open("POST", url_incidencias)
    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 201){
            alert("Se ha creado la incidencia correctamente")
            back()
        } else if(this.readyState == 4){
            alert("Se ha producido un error")
        }
    }

    http.send(params)
}

function obten_parametros_crear(){

    var nombre = document.getElementById("nombre").value;
    var num_patin = document.getElementById("num_patin").value;
    var causa = document.getElementById("causa").value;

    var jsonData = {
        nombre: nombre,
        numero_patin: num_patin,
        causa: causa
    };

    return JSON.stringify(jsonData);

}

function obten_parametros_actualizar(){

    // var identificador = document.getElementById("identificador").innerText;
    // var nombre = document.getElementById("nombre").value;
    // var num_patin = document.getElementById("num_patin").value;
    // var causa = document.getElementById("causa").value;
	// var fecha_apertura = document.getElementById("fecha_apertura").value;
	var fecha_cierre = document.getElementById("fecha_cierre").value;

    var jsonData = {
        fecha_cierre: fecha_cierre
    };

    return JSON.stringify(jsonData);

}

function back(){
    window.location.href = "/app"
}

function cargaCreacion(){
    cambiaDisplay(["identificador_p", "identificador", "fecha_apertura_p", "fecha_apertura", "fecha_cierre_p", "fecha_cierre"], 'none')
    cambiaVisiblidad(["boton_editar", "boton_cancelar", "boton_actualizar", "boton_eliminar"], []);
    cambiaEnable(datos_ids, false)
}

function cargaEditar(){
    cambiaVisiblidad(["boton_editar", "boton_crear"], ["boton_cancelar", "boton_actualizar"]);
    if (datos_incidencia[5]==="None"){
        cambiaEnable(["cerrado"], false)
    }

}

function cargaMostrar(){
    cambiaVisiblidad(["boton_cancelar", "boton_actualizar", "boton_crear"], ["boton_editar"]);
    cambiaEnable(datos_ids, true)
}

function cambiaVisiblidad(desaparecen=[], aparecen=[]){
    cambiaDisplay(desaparecen, 'none')
    cambiaDisplay(aparecen, 'block')
}

function cambiaDisplay(lst=[], value){
    for (var i = 0; i < lst.length; i++){
        var elemento = document.getElementById(lst[i]);
        elemento.style.display = value;
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
            datos_incidencia = [data.id, data.nombre, data.numero_patin, data.causa, data.fecha_apertura, data.fecha_cierre, data.cerrado]
			mostrar(...datos_incidencia);
		}
	}
	http.send()
})
