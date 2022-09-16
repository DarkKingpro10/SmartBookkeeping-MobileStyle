// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
};
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

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    comprobarAmin();
    //cargarTabla();
});

/* Aplicamos la función de click a todos los elementos tdbtn

LUEGO

    Se obtiene el id del elemento clickeado y se cambia su icono
LUEGO
    Se coloca a todos los trexpand la clase hide excepto al trexpand con el mismo id
*/
document.querySelectorAll('.tdbtn').forEach(element => {
    element.addEventListener('click',e =>{
        const id = e.target.getAttribute("id");
        //Obtenemos el componente en dividual
        const componente = document.getElementById(id);
        //Obtenemos el texto dentro de cada uno
        const texto = componente.childNodes[0].textContent;
        //Cambiamos el icono dependiendo del texto
        if (texto == 'expand_more') {
            componente.innerHTML = 'expand_less';
        }else{
            componente.innerHTML = 'expand_more';
        }
        //Recorremos los trexpand
        document.querySelectorAll('.trexpand').forEach(tre =>{
            const idtre = e.target.getAttribute("id");
            console.log(idtre)
            //Se oculta o se muestra dependiendo del texto del td
            if (texto == 'expand_more' && idtre == id) {
                console.log(id+' '+idtre);
                //Se muestra                
                document.getElementById(idtre).classList.remove('hide');
            } else if(texto == 'expand_less' && idtre == id){
                //Se oculta                
                document.getElementById(idtre).classList.add('hide');
            }
        });
        //Colocamos al 
    });
});

function cargarTabla() {
    fetch(API_EMPLEADOS + 'empleadosCAE', {
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
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>Temporal</td>
                <td>Brandon Weber</td>
                <td>Activo</td>
                <td>29281165-8</td>
                <td><i class="material-icons tdbtn" id="tr1">expand_more</i></td>
                <table id="tr1" class="hide trexpand striped higligth centered blue-grey lighten-2">
                    <thead>
                        <th>Tipo Empleado</th>
                        <th>Nombre Competo Empleado</th>
                        <th>Estado</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Amet Lorem Ltd</td>
                            <td>GloriaMoran</td>
                            <td>30100987-9</td>
                        </tr>

                    </tbody>
                </table>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tableI').innerHTML = content;
    // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
}