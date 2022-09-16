// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
};

hastatop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
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
                if (response.cambioCtr) {
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
    cargarTabla();
});

/* Aplicamos la función de click a todos los elementos tdbtn

LUEGO

    Se obtiene el id del elemento clickeado y se cambia su icono
LUEGO
    Se coloca a todos los trexpand la clase hide excepto al trexpand con el mismo id
*/
const expand = () => {
    document.querySelectorAll('.tdbtn').forEach(element => {
        element.addEventListener('click', e => {
            const id = e.target.getAttribute("id");
            //Obtenemos el componente en dividual
            const componente = document.getElementById(id);
            //Obtenemos el texto dentro de cada uno
            const texto = componente.childNodes[0].textContent;
            //Cambiamos el icono dependiendo del texto
            if (texto == 'expand_more') {
                componente.innerHTML = 'expand_less';
            } else {
                componente.innerHTML = 'expand_more';
            }
            //Recorremos los trexpand
            document.querySelectorAll('.trexpand').forEach(tre => {
                const idtre = e.target.getAttribute("id");
                //Se oculta o se muestra dependiendo del texto del td
                if (texto == 'expand_more' && idtre == id) {
                    //Se muestra                
                    let tb = document.getElementsByClassName(id)[0];
                    let tb2 = tb.lastElementChild.getAttribute("id");
                    let form = new FormData();
                    form.append('idemp', tb2);
                    //Cargamos las empresas de ese empleado
                    fetch(API_EMPRESAS + 'readEmprAsg', {
                        method: 'post',
                        body: form
                    }).then(function (request) {
                        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                        if (request.ok) {
                            // Se obtiene la respuesta en formato JSON.
                            request.json().then(function (response) {
                                let content = '';
                                if (response.status) {
                                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                                    response.dataset.map(function (row) {
                                        content += `
                                            <tr>
                                                <td>${row.nombre_empresa}</td>
                                                <td>${row.nombre_cliente}</td>
                                                <td>${row.nit_empresa}</td>
                                            </tr>
                                        `;   
                                    });
                                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                                    document.getElementsByClassName('tb2empr'+tb2)[0].innerHTML = content;
                                    //Se muestra               
                                    document.getElementsByClassName(id)[0].classList.remove('hide');
                                    // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
                                    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
                                }else{
                                    sweetAlert('2',response.exception,null);
                                }
                            });
                        } else {
                            console.log(request.status + ' ' + request.statusText);
                        }
                    });
                } else if (texto == 'expand_less' && idtre == id) {
                    //Se oculta                
                    document.getElementsByClassName(id)[0].classList.add('hide');
                }
            });
            //Colocamos al 
        });
    });
}

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
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(async function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <table class="striped highlight centered  blue-grey lighten-1" id="tableC" data-page-length='10'>
                <thead>
                    <th>Tipo Empleado</th>
                    <th>Nombre Competo Empleado</th>
                    <th>Estado</th>
                    <th>DUI</th>
                </thead>
                <tbody id="tableI">
                    <tr>
                        <td>${row.tipo_empleado}</td>
                        <td>${row.nombre_empleado + ' ' + row.apellido_empleado}</td>
                        <td>${row.nombre_estado}</td>
                        <td>${row.dui_empleado}</td>
                        <td><i class="material-icons tdbtn" id="${'tr' + row.id_empleado}">expand_more</i>
                        </td>
                    <tr>
                        <table id="${'tr' + row.id_empleado}" class="${'tr' + row.id_empleado} trexpand hide striped higligth centered blue-grey lighten-2">
                            <thead>
                                <th>Nombre de la empresa</th>
                                <th>Nombre del cliente</th>
                                <th>DUI o NIT</th>
                            </thead>
                            <tbody id="${row.id_empleado}" class="tb2empr${row.id_empleado} "></tbody>`;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tabalCO').innerHTML = content;
    // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    expand();
}

//Evento para que regrese a la página anterior
document.getElementById('regresarbtn-perfil').addEventListener('click', function () {
    history.go(-1)
});