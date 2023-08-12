const botonGuardar = document.getElementById('boton1');   //Se llama a todos los elementos del html para usarlos en el main
const tipoGastoInput = document.getElementById('tipoGasto');
const montoGastoInput = document.getElementById('montoGasto');
const resultadoDiv = document.getElementById('resultado');
const botonFecha = document.getElementById('fecha');
const botonBorrar = document.getElementById('borrar');
const botonCargarJSON = document.getElementById('cargarJSON');


function guardarDatos() { //Esta funcion se encarga de tomar datos y guardar en localStorage
  const tipoGasto = tipoGastoInput.value;
  const montoGasto = montoGastoInput.value;
  const fecha = botonFecha.value; //Guardo en variables lo tomado de los elementos de html

  if (!tipoGasto || !montoGasto || !fecha) { //Aca se valida se completan todos los campos del formulario 
    return;
  }

  let datosGuardados = localStorage.getItem('datos'); //Defino la key de localStorage

  datosGuardados = (!datosGuardados)  //Si no hay datos, inicializo el array, y si los hay, empieza el parseo de JSON
    ? []
    : JSON.parse(datosGuardados);

  datosGuardados.push({ fecha, tipoGasto, montoGasto });
  localStorage.setItem('datos', JSON.stringify(datosGuardados));
}



function cargarDatos() {    //Este metodo obtiene los datos ya guardados y los muestra
  let datosGuardados = localStorage.getItem('datos');

  // Si hay datos almacenados, los mostramos en el div
  if (datosGuardados) {
    datosGuardados = JSON.parse(datosGuardados);
    resultadoDiv.innerHTML = '';
    datosGuardados.forEach((dato) => {
      const contenedor = document.createElement('p'); //Se crea el espacio, en este caso una etiqueta parrafo, para ir agregando los datos
      contenedor.textContent = dato.fecha + ' ' + dato.tipoGasto + ': ' + dato.montoGasto;
      resultadoDiv.appendChild(contenedor);
    });
  }
}

function borrarDatos() {  //Este metodo sirve para borrar los datos cargados, incluso del html
  localStorage.removeItem('datos');
  resultadoDiv.innerHTML = '';
}

cargarDatos();  //Llamo este metodo para mostrar los datos cargados al cargar la pagina

botonGuardar.addEventListener('click', function() { //Al clickear el boton, se ejecuta el metodo guardar y se vuelve a ejecutar el metodo de carga para mostrar los nuevos datos
  guardarDatos();
  cargarDatos(); 
  tipoGastoInput.value = '';    //Se vacian los formularios para ingresar mas datos
  montoGastoInput.value = '';
  botonFecha.value = '';
});

  botonBorrar.addEventListener('click', async function() { //Este es el evento donde aparece un Sweet alert para asegurarse de que el usuario quiere borrar datos
 
    const borrarDatosBoton = await swal({
      text: "¿Está seguro que desea continuar?",
      icon: "warning",
      buttons: ["Cancelar", "Borrar datos"],
      dangerMode: true,
    });
  
    (borrarDatosBoton)
      ? (borrarDatos(), swal("Datos borrados correctamente", { icon: "success" }))
      : swal("Datos no borrados", { icon: "info" });
  });
  

  botonCargarJSON.addEventListener('click', function() {  //Aca se usa fetch para traer lo que contiene el JSON (yo puse pocos datos en JSON para no eprder tiempo en eso)
    let spinner = document.getElementById('spinner')
    spinner.style.display = 'block'   //Se muestra el spinner al hacer clic y debajo se vuelve a ocultar al finalizar la promesa
    fetch('./datos.json')
      .then(response => response.json())
      .then(data => {       
        setTimeout(() => {
          spinner.style.display = 'none'  
          notificacion('Gastos año 2022:', data);
        }, 2000); 
      })
      .catch(error => {   //Este catch se usa en caso de que la promesa no se cumpla
        console.error('Error al cargar los datos:', error);
        setTimeout(() => {
          notificacion('Error al cargar los datos', '');
        }, 2000);
      });
  });
  
  function notificacion(mensaje, datos) { //Este metodo es donde se ponen las caracteristicas del popup de Toastify (en el metodo de arriba se usa)
    const popup = Toastify({
      text: `${mensaje}\n${JSON.stringify(datos, null, 2)}`,
      duration: 10000,
      gravity: 'bottom', 
      position: 'left',
    });  
    popup.showToast();
  }
  
  