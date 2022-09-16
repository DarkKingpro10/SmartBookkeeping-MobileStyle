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
/*const expand = () => {
    //Función para expandir las empresas
    document.querySelectorAll('.exploder').forEach(exploder => {
        //Añadimos al el evento click a todos los exploder
        exploder.addEventListener('click', function (exp) {
            //Declaramos el botón
            const btn = this;
            //Dependiendo del estado colocamos un color
            if (this.classList.contains('btn-success')) {
                this.classList.replace('btn-success', 'btn-danger');
            } else {
                this.classList.replace('btn-danger', 'btn-success');
            }
            //Obtenemos el elemento hermano del padre del padre del botón (El tr oculto)
            const explodh = this.parentNode.parentNode.nextElementSibling;
            //Le quitamos o colocamos el hide
            explodh.classList.toggle("open");

        }, false);
    });
}*/

//Evento para que regrese a la página anterior
document.getElementById('regresarbtn-perfil').addEventListener('click', function () {
    history.go(-1)
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
    expand();
});

const expand = () => {
    $(".exploder").click(function () {

        $(this).toggleClass("btn-success btn-danger");

        if ($(this).children("i").html() == 'add') {
            $(this).children("i").html('remove')
        } else {
            $(this).children("i").html('add')
        }
        $(this).closest("tr").next("tr").toggleClass("hide");
        if ($(this).closest("tr").next("tr").hasClass("hide")) {
            $(this).closest("tr").next("tr").children("td").slideUp();
        }
        else {
            $(this).closest("tr").next("tr").children("td").slideDown(350);
        }
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
            <tr class="sub-container">
                <td><button type="button" class="btn btn-success exploder">
                        <span class="glyphicon glyphicon-search"></span>
                    </button></td>
                <td>${row.tipo_empleado}</td>
                <td>${row.nombre_empleado + ' ' + row.apellido_empleado}</td>
                <td>${row.nombre_estado}</td>
                <td>${row.dui_empleado}</td>
            </tr>
            <tr class="explode hide empr_tr" id="${row.id_empleado}">
                <td colspan="4" style="background: #CCC; display: none;">
                    <table class="table table-condensed">
                        <thead>
                            <tr>
                                <th>Nombre de la empresa</th>
                                <th>Nombre del cliente</th>
                                <th>DUI o NIT</th>
                            </tr>
                        </thead>
                        <tbody id="tbempr${row.id_empleado}">
                            
                        </tbody>
                    </table>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tablaC').innerHTML = content;
    // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    expand();
    llenarEmpresas();
}

//Función para llenar las empresas
const llenarEmpresas = () => {
    document.querySelectorAll('.empr_tr').forEach(tr => {
        let id = tr.getAttribute('id');
        let form = new FormData();
        form.append('idemp', id);
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
                        document.getElementById('tbempr' + id).innerHTML = content;
                        // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
                        M.Materialbox.init(document.querySelectorAll('.materialboxed'));
                    } else {
                        sweetAlert('2', response.exception, null);
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        });
    });
}