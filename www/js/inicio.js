function agregarIncidencia(){
	window.location.href="/app/incidencia.html";
}

window.addEventListener('load', function () {
  const url = 'http://localhost:5000/incidencias'
  const http = new XMLHttpRequest()
  http.open("GET", url)
  http.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText)
        var listaNombres = document.getElementById("lista-incidencias");
        for (var i = 0; i < data.length; i++) {
          var nombre = data[i].nombre;
          var id = data[i].id;
  
          var li = document.createElement("li");
          var enlace = document.createElement("a");
  
          li.setAttribute("id", nombre);
          li.addEventListener("click", function() {
            window.location.href="/app/incidencia.html?id="+id;
          });
          enlace.textContent = id;
  
          li.appendChild(enlace);
          listaNombres.appendChild(li);
        }
      }
  }
  http.send()
})