// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
var hastatop = document.getElementById("hasta_arriba");

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    comprobarAmin();
    fetch(API_EMPLEADOS + 'empleadosSAE', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTable(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
};



// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.tipo_empleado}</td>
                <td>${row.nombre_empleado}</td>
                <td>${row.nombre_estado}</td>
                <td>${row.dui_empleado}</td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tableI').innerHTML = content;
    // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    $('#tableC').DataTable({
        ordering:  false,
        language: {
            ordering: false,
            url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
        }
    });
}

//Metodo para ocultar el boton en caso no sea admin el que inicio session;
function comprobarAmin() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'verificarAdmin', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if(response.cambioCtr){
                    location.href = 'index.html';
                } else if (!response.status) {
                } else {
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}