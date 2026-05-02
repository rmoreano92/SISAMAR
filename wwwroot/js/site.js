//////////////////////////VARIABLES GLOBALES///////////////////////////////////////////////////
var usuarioLogeado = '';
var userLogeado = '';
var permisoFirmaDigital = 0;
var finFirmaDigital = 0;
var PathServerApp = $("#UrlAppWeb").html();
var PathServerFiles = $("#UrlAppFiles").html();
var PathServerSocket = $("#UrlAppSocket").html();

const oldSwal = Swal.fire.bind(Swal);
window.swal = function (args) {
    const promise = oldSwal(args);
    promise.done = promise.then; // alias
    return promise;
};

////////////////////////////////////////////////////////////////////////////////////////////

function CargarDataTable() {
    var Tabla, Recurso
    var Columnas = ""
    Tabla = $("#mytable").data('tabla')
    Recurso = $("#mytable").data('source')


    Tabla = document.getElementById(Tabla)

    //obtener las columnas 
    $(Tabla).find('th').each(function () {
        //obtenemos el valor de la celda
        Columnas = Columnas + ' {"data": "' + $(this).data('columna') + '"},'
    });
    var dataObject = eval('[{"COLUMNS":[' + Columnas + ']}]');
    $(Tabla).DataTable({
        "ajax": {
            "url": Recurso,
            "type": "GET",
            "datatype": "json"
        },
        "columns": dataObject[0].COLUMNS
    });
}

function CargarDataTableConFiltroFormData(obj) {
    var Tabla, Recurso
    var Columnas = ""
    Tabla = $("#mytable").data('tabla')
    Recurso = $("#mytable").data('source')
    console.log(obj)

    Tabla = document.getElementById(Tabla)

    //obtener las columnas 
    $(Tabla).find('th').each(function () {
        //obtenemos el valor de la celda
        Columnas = Columnas + ' {"data": "' + $(this).data('columna') + '"},'
    });
    var dataObject = eval('[{"COLUMNS":[' + Columnas + ']}]');
    $(Tabla).DataTable({
        "ajax": {
            "url": Recurso,
            "type": "GET",
            "datatype": "json"

        },
        "columns": dataObject[0].COLUMNS



    });
}


$.extend(true, $.fn.dataTable.defaults, {
    "searching": true,
    "ordering": true,

    scrollCollapse: true,

    language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 to 0 of 0 registros",
        "infoFiltered": "(Filtrado de _MAX_ total registros)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "",//"Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        }
    }
});

//$(document).ajaxStart(function () {
//    $.LoadingOverlay('show', {
//        background: 'rgba(255, 255, 255, 0.85)',
//        image: '../images/loading.png',
//        imageAnimation: '1.7s fadein',
//        imageColor: '#e16870',
//        imageResizeFactor: 1.75,
//        /*text: 'Cargando, por favor espere...',
//        textResizeFactor: 0.2,
//        textColor: '#526974'*/
//    });
//    console.log("Inicio llamada Ajax");
//});

//$(document).ajaxStop(function () {
//    $.LoadingOverlay("hide");
//    console.log("Termino llamada Ajax");
//});

function Cargando(estado) {

    if (estado == '0') {
        //console.log("Se ejecuto el cargando", estado)
        $.LoadingOverlay('hide');
    }
    else {
        $.LoadingOverlay('show', {
            background: 'rgba(255, 255, 255, 0.85)',
            image: '../images/loading.png',
            imageAnimation: '1.7s fadein',
            imageColor: '#e16870',
            imageResizeFactor: 1.75,
            /*text: 'Cargando, por favor espere...',
            textResizeFactor: 0.2,
            textColor: '#526974'*/
        });
    }
};



//function BarraProgreso(fValue, lValue) {
//    let progress = $('.blockProgressbar .progressBar');
//    let counter_value = parseInt($('.counterProgressBar').text());
//    counter_value++;

//    if (counter_value >= fValue && counter_value <= lValue) {

//        $('.counterProgressBar').text(counter_value + '%');
//        progress.css({ 'width': counter_value + '%' });

//        /*setTimeout(function () {
//            BarraProgreso(fValue, lValue);
//        }, 50);*/


//    }

//}


var alerta = function (estado, mensaje) {
    if (estado == '1') {
        new PNotify({
            title: 'Correcto',
            text: mensaje,
            type: 'success',
            after_init: function (notice) {
                notice.attention('rubberBand');
            }
        });
        //  $('#btnEnviar').attr('disabled', false);
        return false;
    }
    if (estado == '2') {
        new PNotify({
            title: 'Cuidado',
            text: mensaje,
            type: 'warning',
            after_init: function (notice) {
                notice.attention('swing');
            }
        });

        // $('#btnEnviar').attr('disabled', false);
        return false;
    }

    if (estado == '3') {
        new PNotify({
            title: 'Error',
            text: mensaje,
            type: 'error',
            after_init: function (notice) {
                notice.attention('rubberBand');
            }
        });
        //$('#btnEnviar').attr('disabled', false);
        return false;
    }

    if (estado == '4') {
        new PNotify({
            title: 'Información',
            text: mensaje,
            type: 'info',
            after_init: function (notice) {
                notice.attention('rubberBand');
            }
        });
        //$('#btnEnviar').attr('disabled', false);
        return false;
    }

    //PNotify.prototype.options.styling = "fontawesome";
    //PNotify.prototype.options.styling = "jqueryui";
};

var alerta2 = function (tipo, titulo, mensaje) {
    swal({
        title: titulo,
        html: mensaje,
        icon: tipo,
        allowOutsideClick: false,
        allowEscapeKey: false, 
    }).done();
    //Swal.fire({
    //    title: titulo,
    //    html: mensaje,
    //    type: tipo,
    //    allowOutsideClick: false,
    //    allowEscapeKey: false, 
    //});
}
var alertaAsync = function (tipo, titulo, mensaje, cancelButtonText = 'Cancelar', preConfirm = null, confirmButtonText = 'Aceptar') {
    try {
        let config = {
            title: titulo,
            html: mensaje,
            icon: tipo,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#706f6f',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            didOpen: () => {
                $('#txtContraseniaConfirmacion').focus();
                $('#txtContraseniaConfirmacion').on('keypress', function (e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        $('.swal2-confirm').click();  // Forzar clic
                    }
                });
            }
        };

        if (preConfirm) {
            config.preConfirm = preConfirm;
        }

        return Swal.fire(config); // IMPORTANTE: usar Swal.fire
    } catch (e) {
        return false;
    }
}


function dyn_notice() {
    var percent = 0;
    var notice = new PNotify({
        text: "Please Wait",
        type: 'info',
        icon: 'fa fa-spinner fa-spin',
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        opacity: .75,
        shadow: false,
        width: "170px"
    });

    setTimeout(function () {
        notice.update({ title: false });
        var interval = setInterval(function () {
            percent += 2;
            var options = {
                text: percent + "% complete."
            };
            if (percent == 80)
                options.title = "Almost There";
            if (percent >= 100) {
                window.clearInterval(interval);
                options.title = "Done!";
                options.type = "success";
                options.hide = true;
                options.buttons = {
                    closer: true,
                    sticker: true
                };
                options.icon = 'fa fa-check';
                options.opacity = 1;
                options.shadow = true;
                options.width = PNotify.prototype.options.width;
            }
            notice.update(options);
        }, 120);
    }, 2000);
}

function fake_load() {
    var cur_value = 1,
        progress;

    // Make a loader.
    var loader = new PNotify({
        title: "Creating series of tubes",
        text: '<div class="progress progress-striped active" style="margin:0">\
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
        <span class="sr-only">0%</span>\
    </div>\
</div>',
        //icon: 'fa fa-moon-o fa-spin',
        icon: 'fa fa-cog fa-spin',
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        before_open: function (notice) {
            progress = notice.get().find("div.progress-bar");
            progress.width(cur_value + "%").attr("aria-valuenow", cur_value).find("span").html(cur_value + "%");
            // Pretend to do something.
            var timer = setInterval(function () {
                if (cur_value == 70) {
                    loader.update({ title: "Aligning discrete worms", icon: "fa fa-circle-o-notch fa-spin" });
                }
                if (cur_value == 80) {
                    loader.update({ title: "Connecting end points", icon: "fa fa-refresh fa-spin" });
                }
                if (cur_value == 90) {
                    loader.update({ title: "Dividing and conquering", icon: "fa fa-spinner fa-spin" });
                }
                if (cur_value >= 100) {
                    // Remove the interval.
                    window.clearInterval(timer);
                    loader.remove();
                    return;
                }
                cur_value += 1;
                progress.width(cur_value + "%").attr("aria-valuenow", cur_value).find("span").html(cur_value + "%");
            }, 65);
        }
    });
}

function isEmpty(obj) {

    var isEmpty = false;

    if (typeof obj == 'undefined' || obj === null || obj === '' || obj === '0' || obj === 'null') {

        isEmpty = true;
    }

    if (typeof obj == 'number' && isNaN(obj)) {
        isEmpty = true;
    }

    if (obj instanceof Date && isNaN(Number(obj))) {
        isEmpty = true;
    }

    return isEmpty;

};

function isEmptyValue(obj) {

    var isEmpty = false;

    if (typeof obj == 'undefined' || obj === null || obj === '' || obj === 'null') {

        isEmpty = true;
    }

    if (typeof obj == 'number' && isNaN(obj)) {
        isEmpty = true;
    }

    if (obj instanceof Date && isNaN(Number(obj))) {
        isEmpty = true;
    }

    return isEmpty;

};

function isDisabledElement(id) {

    if ($(id).is(":disabled")) {
        return true
    } else {
        return false
    }
}

function esNumero(valor) {
    valor = valor.toString();
    if (!isNaN(valor.trim()) && valor.trim() !== "") {
        //console.log("Es un número válido");
        return true;
    } else {
        //console.log("No es un número");
        return false;
    }
}

//$('.solo-numero').keyup(function () {
$(document).on('keyup', '.solo-numero', function () {
    this.value = (this.value + '').replace(/[^0-9]/g, '');
});

//$('.solo-numero').keydown(function () {
$(document).on('keydown', '.solo-numero', function () {
    this.value = (this.value + '').replace(/[^0-9]/g, '');
});

$(document).on('keydown', '.solo-texto', function () {
    this.value = (this.value + '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});


//$('.solo-decimal').on('input', function () {
//    this.value = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
//});

//$('.solo-decimal').on('input', function () {
//    /*this.value = ;*/

//    var sanitizedValue = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
//    var decimalIndex = sanitizedValue.indexOf('.');

//    if (decimalIndex !== -1) {
//        sanitizedValue = sanitizedValue.substring(0, decimalIndex + 1) + sanitizedValue.substring(decimalIndex + 1).replace(/\./g, '');
//    }

//    this.value = sanitizedValue;
//});

$(document).on('keyup', '.solo-decimal', function () {
    let valorOriginal = this.value;

    // Elimina caracteres que no sean dígitos o punto
    let valorFiltrado = valorOriginal.replace(/[^0-9.]/g, '');

    // Permitir solo un punto decimal
    let partes = valorFiltrado.split('.');
    if (partes.length > 2) {
        valorFiltrado = partes[0] + '.' + partes[1];
    }

    // Solo actualiza si cambia el valor
    if (valorOriginal !== valorFiltrado) {
        this.value = valorFiltrado;
    }
});

//$('.solo-numero').keydown(function () {
$(document).on('keydown', '.solo-decimal', function () {
    let valorOriginal = this.value;

    // Elimina caracteres que no sean dígitos o punto
    let valorFiltrado = valorOriginal.replace(/[^0-9.]/g, '');

    // Permitir solo un punto decimal
    let partes = valorFiltrado.split('.');
    if (partes.length > 2) {
        valorFiltrado = partes[0] + '.' + partes[1];
    }

    // Solo actualiza si cambia el valor
    if (valorOriginal !== valorFiltrado) {
        this.value = valorFiltrado;
    }
});


function checkMenuActive() {
    var aax = location.href.split(/\?|#/)[0];
    aax = aax.split("/");
    aax = aax[aax.length - 2] + "." + aax[aax.length - 1];

    $(".menubar").each(function (index, item) {
        var bbx = $(this).attr("href").split(/\?|#/)[0];
        bbx = bbx.split("/");
        bbx = bbx[bbx.length - 2] + "." + bbx[bbx.length - 1];
        if (aax == bbx) {
            $(this).parent().addClass("active");
            $(this).parent().parent().addClass("collapse in");
            $(this).parent().parent().parent().addClass("active");
            //$(this).parent().parent("ul.sub-menu").toggle();
            //$(this).parent().parent().parent().addClass("collapse in");
        }
    });

    var hMenu = ($(window).height() - $("#top").height() - $("#menuCabecera").height() - 15) + "px";
    $("#menu").height(hMenu)
}

checkMenuActive();


function AbrirModalCambiarClave() {
    $('#txtClaveActual').val("");
    $('#txtNuevaClave').val("");
    $('#txtNuevaClave2').val("");
    $('#modalCambiarClave').modal('show');
};


function CerrarModalCambiarClave() {
    $('#modalCambiarClave').modal('hide');
};


function CambiarClave() {
    AbrirModalCambiarClave();
};


function ActualizarClave() {
    if ($('#txtClaveActual').val() == "") { alerta(2, "Debe ingresar la clave actual"); return false };
    if ($('#txtNuevaClave').val() == "") { alerta(2, "Debe ingresar la Nueva clave"); return false };
    if ($('#txtNuevaClave2').val() == "") { alerta(2, "Debe ingresar la confirmación de clave"); return false };
    if ($('#txtNuevaClave').val() != $('#txtNuevaClave2').val()) { alerta(2, "La confirmación de clave no coincide."); return false };
    var midata = new FormData();
    midata.append('ClaveActual', $('#txtClaveActual').val());
    midata.append('NuevaClave', $('#txtNuevaClave').val());
    $.ajax({
        method: "POST",
        url: "/Home/CambiarClaveActual",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            console.log(datos);
            if (datos.rsp > 0) {
                //alerta2("success", "", datos.mensaje);
                CerrarModalCambiarClave();
                swal({
                    title: "Contraseña Actualizada",
                    html: datos.mensaje + "<br><br>Se procedera a cerrar la sesión.",
                    type: "success",
                    allowOutsideClick: false,
                    allowEscapeKey: false, 
                }).then(function () {
                    //CerrarSesion();
                    window.location.href = "/Home/CerrarSession";
                }, function (dimiss) {

                });

            } else {
                alerta2("error", "", datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
    return true;
}

//function CerrarSesion() {
//    $.ajax({
//        method: "GET",
//        url: "/Home/CerrarSession",
//        data: null,
//        dataType: "json",
//        processData: false,
//        contentType: false,
//        success: function (datos) {
//            console.log(datos);            
//        },
//        error: function (msg) {
//            //Cargando(0)
//        }
//    });

//    return true;
//}

function DeshabilitarCampos() {
    $(".campo").attr('disabled', true);
}

function HabilitarCampos() {
    $(".campo").removeAttr('disabled', 'disabled');
}

function FormatearFecha(FechaInicial) {

    if (isEmpty(FechaInicial)) {
        return null;
    }

    let fecha = new Date(FechaInicial);
    let dia = fecha.getDate();
    let mes = parseInt(fecha.getMonth()) + 1;
    let yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes;
    fechaP = dia + "/" + mes + "/" + yyy;
    return fechaP;
}

function FormatearHora(FechaInicial) {
    if (isEmpty(FechaInicial)) {
        return null;
    }

    let fecha = new Date(FechaInicial);
    let hora = (fecha.getHours() < 10 ? "0" + fecha.getHours() : fecha.getHours()) + ":" + (fecha.getMinutes() < 10 ? "0" + fecha.getMinutes() : fecha.getMinutes());
    return hora;
}

function FormatearFechaYYYYMMDD(FechaInicial) {
    let fecha = new Date(FechaInicial);
    let dia = fecha.getDate();
    let mes = parseInt(fecha.getMonth()) + 1;
    let yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes;
    fechaP = yyy + "-" + mes + "-" + dia;
    return fechaP;
}

function FormatearFechaYYYYDDMM(FechaInicial) {
    let fecha = new Date(FechaInicial);
    let dia = fecha.getDate();
    let mes = parseInt(fecha.getMonth()) + 1;
    let yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes;
    fechaP = yyy + "-" + dia + "-" + mes;
    return fechaP;
}

function ConvertirFormatoFecha(FechaInicial) {
    let fecha = FechaInicial.split('/')

    return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
}

function cDate(FechaInicial) {     // formato: dd/mm/yyyy => mm/dd/yyyy
    let fecha = FechaInicial.split('/')
    fecha = fecha[1] + '-' + fecha[0] + '-' + fecha[2];
    return new Date(fecha)
}

function cDateTime(FechaInicial) {     // formato: dd/mm/yyyy => mm/dd/yyyy
    let fecha = FechaInicial.split('/')
    fecha = fecha[1] + '-' + fecha[0] + '-' + fecha[2];
    return new Date(fecha)
}

function getCurrentDate() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = dia + "/" + mes + "/" + yyy

    return fechaP
}
function getCurrentHour() {
    var dt = new Date();
    var time = (dt.getHours() < 10 ? ("0" + dt.getHours()) : dt.getHours()) + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes());
    return time
}

function isNull(valorEvaluado, valorReemplazo) {
    if (typeof valorEvaluado == 'undefined' || valorEvaluado === null || valorEvaluado === '' || valorEvaluado === '0' || valorEvaluado === 'null') {

        return valorReemplazo;
    } else {
        return valorEvaluado
    }
}

function MostrarAreaLista() {
    $('#TabBusqueda').click();
}

function MostrarAreaRegistro() {
    $('#TabRegistro').click();
}

function CerrarModulo() {
    $("#modulo").html("");
}

$('#TabBusqueda').on('click', function () {
    $('#TabRegistro').hide();
    $('#TabBusqueda').show();
});
$('#TabRegistro').on('click', function () {
    $('#TabBusqueda').hide();
    $('#TabRegistro').show();
});

/////////////OBTENER LISTBAR////////////////////
function ObtenerItemListBar() {
    let params = new URLSearchParams(window.location.search);
    let idListBar = params.get("idListBar");
    idListBar = isNull(idListBar, 0);

    return idListBar;
}
///////////////////////////////////////////////

function CalcularEdad(fecha) {
    fecha = fecha.substring(6) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(0, 2);
    let hoy = new Date();
    let cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    let m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad;
}

function CalcularEdadSegunFecha(fechaNac, fechaAten) {
    fechaNac = fechaNac.substring(6) + '-' + fechaNac.substring(3, 5) + '-' + fechaNac.substring(0, 2);
    fechaAten = fechaAten.substring(6) + '-' + fechaAten.substring(3, 5) + '-' + fechaAten.substring(0, 2);
    let cumpleanos = new Date(fechaNac);
    let atencion = new Date(fechaAten);
    let edad = atencion.getFullYear() - cumpleanos.getFullYear();
    let m = atencion.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && atencion.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad;
}


/*
$('html, body').animate({
    scrollTop: $(".head").offset().top
}, 2000);
*/

/////////////VISOR DOCUMENTO//////////////////////////////
$("#visorDocumento").height($(window).height() - 240);

function AbrirVisorDocumento(ruta, tipo) {
    var RutaArchivoDocumento = PathServerFiles + ruta
    if (tipo == 0) {                    //PARA DOCUMENTOS SIN FIRMAR ALMACENADOS EN SERVIDOR
        $("#VisorDocumentoHeader").removeClass("bg-success");
        $("#VisorDocumentoHeader").removeClass("bg-indigo");
        $("#VisorDocumentoHeader").removeClass("bg-deep-orange");
        $("#VisorDocumentoHeader").addClass("bg-warning");
        $("#VisorDocumentoTitulo").html("Visor Documento");
        $("#VisorDocumentoIcon").hide();
        $("#visorDocumento").attr("src", RutaArchivoDocumento);
    } else {
        if (tipo == 1) {                //PARA DOCUMENTOS FIRMADOS
            RutaArchivoDocumento = RutaArchivoDocumento.replace('4IdentitySignedFiles/UNSIGNED', 'SIGNED');
            $("#VisorDocumentoHeader").removeClass("bg-warning");
            $("#VisorDocumentoHeader").removeClass("bg-indigo");
            $("#VisorDocumentoHeader").removeClass("bg-deep-orange");
            $("#VisorDocumentoHeader").addClass("bg-success");
            $("#VisorDocumentoTitulo").html("Visor Documento Firmado");
            $("#VisorDocumentoIcon").show();
            $("#visorDocumento").attr("src", RutaArchivoDocumento);
        }
    }
    $('#modalVisorDocumento').modal('show');
}

function AbrirVisorDocumentoPersonalizado(ruta, titulo) {

    $("#VisorDocumentoHeader").removeClass("bg-success");
    $("#VisorDocumentoHeader").removeClass("bg-warning");
    $("#VisorDocumentoHeader").removeClass("bg-deep-orange");
    $("#VisorDocumentoHeader").addClass("bg-indigo");
    $("#VisorDocumentoTitulo").html(titulo);
    $("#VisorDocumentoIcon").hide();
    $("#visorDocumento").attr("src", ruta);

    $('#modalVisorDocumento').modal('show');
}

function AbrirVisorImagen(ruta, titulo) {

    $("#VisorDocumentoHeader").removeClass("bg-success");
    $("#VisorDocumentoHeader").removeClass("bg-warning");
    $("#VisorDocumentoHeader").removeClass("bg-indigo");
    $("#VisorDocumentoHeader").addClass("bg-deep-orange");
    $("#VisorDocumentoTitulo").html(titulo);
    $("#VisorDocumentoIcon").hide();
    $("#visorDocumento").attr("src", ruta);

    $('#modalVisorDocumento').modal('show');
}

function CerrarVisorDocumento() {
    $("#visorDocumento").attr("src", "");
    $('#modalVisorDocumento').modal('hide');
}


function NormalizarParaUrl(cadena) {
    cadena = cadena.toString();
    cadena = cadena.replaceAll('%', '%25');
    cadena = cadena.replaceAll('+', '%2B');
    cadena = cadena.replaceAll(' ', '%20');
    cadena = cadena.replaceAll('/', '%2F');
    cadena = cadena.replaceAll('?', '%3F');
    cadena = cadena.replaceAll('#', '%23');
    cadena = cadena.replaceAll('&', '%26');
    cadena = cadena.replaceAll('=', '%3D');

    return cadena;
}


//////////////////////SOCKET FIRMA DIGITAL/////////////////////////////////
//async function VerificarFirma(idCuentaAtencion, tipo, idRegistro) {
//    console.log('idCuentaAtencion', idCuentaAtencion)
//    await CreateWebSocket(idCuentaAtencion, tipo, idRegistro)
//}

async function VerificarFirma(code) {
    // Flujo Firma Peru (invoker): no usar websocket de estado.
    Cargando(0);
    return true;
}

async function VerificarFirmaMultiple(nombrePaquete) {
    // Flujo Firma Peru (invoker): no usar websocket de estado.
    Cargando(0);
    return true;
}

//async function CreateWebSocket(idCuentaAtencion, tipo, idRegistro) {
async function CreateWebSocket(code) {
    var scheme = document.location.protocol == "https:" ? "wss" : "ws";
    //var url = `` + scheme + `://${location.host}/WebSocketApi/GetMessages`
    //var url = `ws://172.16.40.27:4200/home/GetStatusFirmaDigitalPorUsuario`
    var url = PathServerSocket + "/WebSocketApi/GetStatusFirmaDigitalPorUsuario";
    var ws = new WebSocket(url);
    var socket = null;

    //console.log('aqui si llega', ws)
    Cargando(1)

    ws.onmessage = async function (evt) {
        var received_msg = evt.data;
        //console.log('received_msg', received_msg)
        var jsonResult = JSON.parse(received_msg)
        console.log("Message is received..." + jsonResult.statusFirma)

        finFirmaDigital = $("#ifmFirmaDigital")[0].contentWindow.finFirmaDigital;           //OBTENEGO EL ESADO FINAL DEL SERVICIO DE FIRMA DIGITAL

        if (finFirmaDigital == -1) {
            ws.close()
            clearInterval(socket);

            $('#ifmFirmaDigital').attr('src', '');
            $('#ifmFirmaDigital').html('');
            $("#modalFirmaDigital").modal("hide");
            finFirmaDigital = 0;
            Utilitario.TipoArchivoFirmar = '';

            Cargando(0)
        }

        if (jsonResult.statusFirma == '1' && jsonResult.statusFirmaUsuario == '1' /*&& finFirmaDigital == 1*/) {
            //console.log('si entro al estado de la firma')
            ws.close()
            clearInterval(socket);

            if (Utilitario.TipoArchivoFirmar == 'CE') {
                AtencionMedica.ListaAtencionesCE();
            } //Preguntar a kevin por que en mi codigo no figura ese atributo

            if (Utilitario.TipoArchivoFirmar == 'CE-PD') {
                AtencionMedica.ListaAtencionesCE();
            }

            if (Utilitario.TipoArchivoFirmar == 'REC') {
                $(VisorReceta.idBtnSelect).click();
            }

            if (Utilitario.TipoArchivoFirmar == 'EMER') {
                AdmisionEmergencia.ListarAtenciones();
            }

            if (Utilitario.TipoArchivoFirmar == 'EMER-EVA') {
                await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, AdmisionEmergencia.IdServicioEgreso);
            }

            if (Utilitario.TipoArchivoFirmar == 'EMER-EVA-DET') {
                //AdmisionEmergencia.Listar
                $("#btnRecargarEvaNeo").click();
            }

            if (Utilitario.TipoArchivoFirmar == 'CN') {
                //SolicitudConstanciaRn.ListarSolicitudes();
                $("#btnBuscarCRN").click();
            }

            if (Utilitario.TipoArchivoFirmar == 'LAB-RES') {
                //SolicitudConstanciaRn.ListarSolicitudes();
                await Laboratorio.ListarDetalleOrden();
            }

            if (Utilitario.TipoArchivoFirmar == 'IMG-RES') {
                //SolicitudConstanciaRn.ListarSolicitudes();
                await Imagenologia.ListarDetalleOrden();
            }

            if (Utilitario.TipoArchivoFirmar == 'FUA') {
                //SolicitudConstanciaRn.ListarSolicitudes();
                $("#btnBuscarAtenciones").click();
            }

            if (Utilitario.TipoArchivoFirmar == 'GUARDIA') {
                Guardia.ListarOcurrenciaMedica();
            }

            if (Utilitario.TipoArchivoFirmar == 'MED-REPRO') {
                MedRepro.ListarMedicinaReproductiva();
            }

            if (Utilitario.TipoArchivoFirmar == 'TCK-CS') {
                await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
            }

            if (Utilitario.TipoArchivoFirmar == 'NE-NEO') {
                let evaluaciones = await NotaEnfermeria.SeleccionarNotaEnfermeriaNeoEvaluacion(NotaEnfermeria.IdNotaEnfermeria, 0)

                oTable_EvaInf.fnClearTable()

                if (!isEmpty(evaluaciones)) {
                    if (evaluaciones.length > 0) {

                        oTable_EvaInf.fnAddData(evaluaciones)

                    }
                }

                NotaEnfermeria.CargarDatosEvaluacion()
            }

            $('#ifmFirmaDigital').attr('src', '');
            $('#ifmFirmaDigital').html('');
            $("#modalFirmaDigital").modal("hide");
            finFirmaDigital = 0;
            Utilitario.TipoArchivoFirmar = '';

            swal({
                title: 'Firma Digital',
                text: 'El archivo fue firmado con éxito',
                type: 'success',
                allowOutsideClick: false,
            }).done();


            Cargando(0)
        }

        if (jsonResult.processFirma == '2') {
            clearInterval(socket);

            const proceso = await Utilitario.ProcesoFirmaModificar(jsonResult.id, jsonResult.codigo, 0);
            if (proceso) {
                ws.close();
                Cargando(0);
            }

        }
    }

    socket = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount === 0) {
            ws.send(code);
            console.log("Message send");
        }
    }, 1000);

    ws.onclose = function (event) {
        clearInterval(socket);
        if (event.wasClean) {
            //console.log(`[close] Connection closed cleanly, code = ${event.code} reason = ${event.reason}`)
            Cargando(0)
        } else {
            console.log('[close] Connection died')
            Cargando(0);
        }
    }

    ws.onerror = function (error) {
        console.log(`[error] ${error.target}`)
        clearInterval(socket);
        Cargando(0);
    }
}


async function CreateWebSocketFirmaMultiple(nombrePaquete) {
    var scheme = document.location.protocol == "https:" ? "wss" : "ws";
    //var url = `` + scheme + `://${location.host}/WebSocketApi/GetMessages`
    //var url = `ws://172.16.40.27:4200/home/GetMessagesMultiplePorUsuario`
    var url = PathServerSocket + "/WebSocketApi/GetMessagesMultiplePorUsuario";
    var ws = new WebSocket(url);
    var socket = null;

    //console.log('aqui si llega', ws)
    Cargando(1)

    ws.onmessage = async function (evt) {
        var received_msg = evt.data;
        //console.log('received_msg', received_msg)
        var jsonResult = JSON.parse(received_msg)
        console.log("Message is received..." + jsonResult.Estado)

        finFirmaDigital = $("#ifmFirmaDigital")[0].contentWindow.finFirmaDigital;           //OBTENEGO EL ESADO FINAL DEL SERVICIO DE FIRMA DIGITAL

        if (finFirmaDigital == -1) {
            ws.close()
            clearInterval(socket);

            $('#ifmFirmaDigital').attr('src', '');
            $('#ifmFirmaDigital').html('');
            $("#modalFirmaDigital").modal("hide");
            finFirmaDigital = 0;
            Utilitario.TipoArchivoFirmar = '';

            Cargando(0)
        }

        if (jsonResult.Estado == '0' /*&& finFirmaDigital == 1*/) {
            //console.log('si entro al estado de la firma')
            ws.close()
            clearInterval(socket);

            if (Utilitario.TipoArchivoFirmar == 'CE') {
                AtencionMedica.ListaAtencionesCE();
            }

            if (Utilitario.TipoArchivoFirmar == 'REC') {
                $(VisorReceta.idBtnSelect).click();
            }

            if (Utilitario.TipoArchivoFirmar == 'EMER-EVA-DET') {
                //AdmisionEmergencia.Listar
                $("#btnRecargarEvaNeo").click();
            }

            if (Utilitario.TipoArchivoFirmar == 'CN') {
                $("#btnBuscarCRN").click();
            }

            if (Utilitario.TipoArchivoFirmar == 'LAB-RES') {
                //SolicitudConstanciaRn.ListarSolicitudes();
                await Laboratorio.ListarDetalleOrden();
            }

            if (Utilitario.TipoArchivoFirmar == 'GUARDIA') {
                Guardia.ListarOcurrenciaMedica();
            }

            if (Utilitario.TipoArchivoFirmar == 'MED-REPRO') {
                MedRepro.ListarMedicinaReproductiva();
            }

            $('#ifmFirmaDigital').attr('src', '');
            $('#ifmFirmaDigital').html('');
            $("#modalFirmaDigital").modal("hide");
            finFirmaDigital = 0;

            swal({
                title: 'Firma Digital',
                text: 'El paquete fue firmado con éxito',
                type: 'success',
                allowOutsideClick: false,
            }).done();

            Cargando(0)

        }

    }

    socket = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount === 0) {
            ws.send(nombrePaquete);
            console.log("Message send");
        }
    }, 1000);

    ws.onclose = function (event) {
        clearInterval(socket);
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code = ${event.code} reason = ${event.reason}`)
            Cargando(0)
        } else {
            console.log('[close] Connection died')
            Cargando(0);
        }
    }

    ws.onerror = function (error) {
        console.log(`[error] ${error.target}`)
        clearInterval(socket);
        Cargando(0);
    }
}


///////////////////////////////////////////////////////////////////////////


function ReposicionarVista() {
    /*$('html, body').animate({
        scrollTop: $(".head").offset().top
    }, 1000);*/
}

const HttpClient = {
    async Post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: data,
            });
            return await handleResponse(response, url);
        } catch (error) {
            console.error('Error de red:', error);
            return null
        }
    },

    async Get(url) {
        try {
            const response = await fetch(url);
            return await handleResponse(response, url);
        } catch (error) {
            console.error('Error de red:', error);
            return null
        }
    },

    //async Post(url, data) {
    //    try {
    //        const response = await fetch(url, {
    //            method: 'POST',
    //            body: data,
    //        });

    //        if (!response.ok) {
    //            console.error(`Error (${response.status} - ${response.statusText}) al consultar la URL: ${response.url}`);
    //            return null;
    //        }
    //        const responseData = await response.json();

    //        if (!responseData.session) {
    //            alerta(2, 'La sesion expiro, por favor vuelva a iniciar sesion.')
    //            Cargando(0)
    //            return null
    //        }

    //        if (!responseData.estado) {
    //            alerta(2, 'Hubo un error en la solicitud.')
    //            console.error('URL: ' + url, responseData.msg)
    //            Cargando(0)
    //            return null
    //        }

    //        return responseData;
    //    } catch (error) {
    //        console.error('Ocurrió un error:', error);
    //        return null;
    //    }
    //},

    //async Get(url) {
    //    try {
    //        const response = await fetch(url, {
    //            method: 'GET',
    //        });

    //        if (!response.ok) {
    //            console.error(`Error (${response.status} - ${response.statusText}) al consultar la URL: ${response.url}`);
    //            return null;
    //        }

    //        const responseData = await response.json();

    //        if (!responseData.session) {
    //            alerta(2, 'La sesion expiro, por favor vuelva a iniciar sesion.')
    //            Cargando(0)
    //            return null
    //        }

    //        if (!responseData.estado) {
    //            alerta(2, 'Hubo un error en la solicitud.')
    //            console.error('URL: ' + url, responseData.msg)
    //            Cargando(0)
    //            return null
    //        }

    //        return responseData;
    //    } catch (error) {
    //        console.error('Ocurrió un error:', error);
    //        return null;
    //    }
    //},
};

async function handleResponse(response, url) {
    const statusCode = response.status;
    const statusText = response.statusText;

    if (!response.ok) {
        //alerta(3, 'Algo salio mal')
        console.error(`Error ${statusCode}: ${statusText} (${url})`);
        Cargando(0)
        return { success: false, statusCode, statusText, data: null };
    }

    const responseData = await response.json();

    if (!responseData.session) {
        alerta(2, 'La sesión expiró. Redirigiendo...');
        //setTimeout(() => window.location.href = '/login', 2000);
        Cargando(0)
        return null
    }

    if (!responseData.estado) {
        alerta(2, responseData.msg || 'Ocurrió un error en la solicitud.');
        Cargando(0)
        return null
    }
    responseData.success = true
    responseData.statusCode = statusCode

    return responseData
}


//JDELGADO PARA MENJO DE PETICIONES AJAX


/////////////////////VALIDAR FECHA/////////////////////////
function esFormatoFecha(campo) {
    var RegExPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if ((campo.match(RegExPattern)) && (campo != '')) {
        return true;
    } else {
        return false;
    }
}

function esFormatoHora(hora) {
    let regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regexHora.test(hora);
}
/////////////////////////////////////////////////////////

///////////////////////CALCULAR EDAD EN AÑO, MES, DIA//////////////////////

function getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()

    let anios = edad
    let meses = diferenciaMeses < 0 ? -diferenciaMeses : diferenciaMeses
    let dias

    if (anios != 0) {
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--
            anios = edad
        }
        return [anios, 1]
    } else if (meses != 0) {
        return [meses, 2]
    } else {
        dias = hoy.getDate() - fechaNacimiento.getDate()
        return [dias, 3]
    }
}


function CalcularEdadAnioMesDia(fechaNacimiento) {
    if (!isEmpty(fechaNacimiento)) {
        fechaNac = fechaNacimiento.substring(6) + '-' + fechaNacimiento.substring(3, 5) + '-' + fechaNacimiento.substring(0, 2)
        const hoy = new Date();
        const nacimiento = new Date(fechaNac);

        let edadAnios = hoy.getFullYear() - nacimiento.getFullYear();
        let edadMeses = hoy.getMonth() - nacimiento.getMonth();
        let edadDias = hoy.getDate() - nacimiento.getDate();

        // Ajustar meses y años si el mes actual es anterior al mes de nacimiento
        if (edadMeses < 0) {
            edadAnios--;
            edadMeses += 12;
        }

        // Ajustar días y meses si el día actual es anterior al día de nacimiento
        if (edadDias < 0) {
            edadMeses--;
            const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
            edadDias += mesAnterior.getDate();
        }

        return {
            años: edadAnios,
            meses: edadMeses,
            dias: edadDias
        };
        
    } else {
        return {
            años: 0,
            meses: 0,
            dias: 0
        };
    }
    
}

function CalcularEdadAnioMesDiaSegunFecha(fechaNacimiento, fechaAtencion) {
    fechaNac = fechaNacimiento.substring(6) + '-' + fechaNacimiento.substring(3, 5) + '-' + fechaNacimiento.substring(0, 2)
    fechaAtencion = fechaAtencion.substring(6) + '-' + fechaAtencion.substring(3, 5) + '-' + fechaAtencion.substring(0, 2);
    const atencion = new Date(fechaAtencion);
    const nacimiento = new Date(fechaNac);

    let edadAnios = atencion.getFullYear() - nacimiento.getFullYear();
    let edadMeses = atencion.getMonth() - nacimiento.getMonth();
    let edadDias = atencion.getDate() - nacimiento.getDate();

    // Ajustar meses y años si el mes actual es anterior al mes de nacimiento
    if (edadMeses < 0) {
        edadAnios--;
        edadMeses += 12;
    }

    // Ajustar días y meses si el día actual es anterior al día de nacimiento
    if (edadDias < 0) {
        edadMeses--;
        const mesAnterior = new Date(atencion.getFullYear(), atencion.getMonth(), 0);
        edadDias += mesAnterior.getDate();
    }

    return {
        años: edadAnios,
        meses: edadMeses,
        dias: edadDias
    };
}


function calcularEdad_v2(fechaNacimiento) {
    const partes = fechaNacimiento.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // JS usa meses de 0-11
    const anio = parseInt(partes[2], 10);

    const fechaNac = new Date(anio, mes, dia);
    const hoy = new Date();

    let años = hoy.getFullYear() - fechaNac.getFullYear();
    let meses = hoy.getMonth() - fechaNac.getMonth();
    let dias = hoy.getDate() - fechaNac.getDate();

    // Ajustar días
    if (dias < 0) {
        meses--;
        // Obtener días del mes anterior
        const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        dias += ultimoMes.getDate();
    }

    // Ajustar meses
    if (meses < 0) {
        años--;
        meses += 12;
    }

    return {
        años: años,
        meses: meses,
        dias: dias
    };
}

/////////////////////////////////////////////////////////


function formatoDecimal(valor) {
    if (Number.isInteger(valor)) {
        return valor.toFixed(1); // convierte 5 → "5.0"
    }
    return valor; // si ya tiene decimales, lo deja igual
}

///////////////////////////HABILITAR DESHABILITAR FORMULARIOS///////////////////////////////////////////////////
function HabilitarDeshabilitarForm(idElemento, estado, valorDefecto) {
    //$(idElemento).val(valorDefecto);

    if (estado == false) {
        $(idElemento).prop("disabled", true);
    } else {
        $(idElemento).removeAttr("disabled");
    }

    $('.chzn-select').chosen().trigger("chosen:updated");

    //let tipoInput = $(idElemento).attr('type');
    //let elemento = $(idElemento)[0]; // Accedemos al elemento DOM
    //let tipoTag = elemento.tagName.toLowerCase();

    //$(idElemento).val("");

    //if (tipoTag == "input" && tipoInput == "text") {
    //    if (estado == true) {

    //    } else {

    //    }
    //}

    //if (tipoTag == "select") {
    //    if (estado == true) {

    //    } else {

    //    }
    //    $('.chzn-select').chosen().trigger("chosen:updated");
    //}
}
///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////CALCUALR FECHA ACTUAL/////////////////////////////
function ObtenerFechaActual() {
    let f = new Date();
    let dia = f.getDate();
    let mes = (f.getMonth() + 1);
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes

    let FechaHoy = dia + "/" + mes + "/" + f.getFullYear();

    return FechaHoy;
}

/////////////////////////CALCUALR HORA ACTUAL/////////////////////////////
function ObtenerHoraActual() {
    let f = new Date();
    let hora = f.getHours();
    let minuto = f.getMinutes();
    if (hora < 10)
        hora = '0' + hora; //agrega cero si el menor de 10
    if (minuto < 10)
        minuto = '0' + minuto

    let HoraHoy = hora + ":" + minuto;

    return HoraHoy;
}

////////////////////////////FECHA HORA /////////////////////////////
async function FechaHoraServidor() {
    let formData = new FormData();
    let datos;
    let resp;

    try {
        Cargando(1);
        datos = await
        $.ajax({
            method: "POST",
            url: "/Parametros/RetornaFechaHoraServidor?area=Comun",
            data: null,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
        });
        Cargando(0);
        if (datos.session) {
            //permisoRefcon = datos.respuesta;
            resp = datos.resultado;
            //console.log(permisoRefcon);
        }
        else {
            //alert("La sesion ya expiro se volvera a recargar la pagina")
            //location.reload();
            alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
            $("#modalLogin").modal('show');
        }
    } catch (error) {
        //console.error(error)
        Cargando(0);
        alerta(3, error);
    }

    return resp;
}


/////////////////RESALTAR FECHA ESPECIFICA////////////////////////////////////////////////////////
function ResaltarFechaDatePicker(fecha, codigoColor) {
    let widget = $('body .datepicker');

    if (widget.length > 0) {
        //console.log(widget);
        //const widget = input.datepicker('widget');
        let diasCalendario = widget.find('.day');


        //console.log(diasCalendario);

        ///////////////OBTENEMOS EL MES Y AÑO DEL CALENDARIO//////////////////////
        let tituloCalendario = widget.find('.datepicker-days .datepicker-switch').text();
        //console.log("Texto del título: " + tituloCalendario);

        // Extraemos el mes y el año de la cadena
        let partesTituloCalendario = tituloCalendario.split(' ');
        let mesText = partesTituloCalendario[0];  // El primer elemento es el mes
        let anio = partesTituloCalendario[1];  // El segundo elemento es el año
        //console.log(anio);
        let meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        let mes = meses.indexOf(mesText) + 1;
        let dia = 0;

        let fechaComparar = "";

        let controlMes = false;
        diasCalendario.each(function () {
            //console.log($(this).text());
            if ($(this).hasClass('old') || $(this).hasClass('new')) {
                controlMes = false;
            } else {
                controlMes = true;
            }

            if (controlMes) {
                dia = $(this).text().padStart(2, '0');
                mes = mes.toString().padStart(2, '0');

                // Construye la fecha en el mismo formato YYYY-MM-DD
                //const fechaComparar = `${anio}-${mes}-${dia}`;
                fechaComparar = `${dia}/${mes}/${anio}`;
                //console.log(fechaComparar)

                // Compara si la fecha de la celda coincide con la fecha proporcionada
                if (fecha === fechaComparar) {
                    // Cambia el estilo de la fecha coincidente
                    $(this).css({
                        backgroundColor: codigoColor, // Color de fondo amarillo
                        color: '#fff', // Texto blanco
                        borderRadius: '50%' // Forma circular
                    });
                }
            }

        });
    }
}

function formatDate(date) {
    const dia = (date.getDate()).toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    return `${anio}-${mes}-${dia}`;
}
/////////////////////////////////////////////////////////////////////////////////////////////////

///////////VERIFICAR SI UN ELEMENTO ESTA VISIBLE COMPLEMTANETE EN EL NAVEGADOR////////////////////
function isElementFullVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}
//////////////////////////////////////////////////////////////////////////////////////////////////

///////////VERIFICAR SI UN ELEMENTO ESTA VISIBLE COMPLEMTANETE EN EL NAVEGADOR///////////////////
function smoothScrollToContent(el) {
    const elementTop = $(el).offset().top;
    $('#content').animate({ scrollTop: elementTop }, 1000, 'swing'); // 800ms animación
}
/////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////IFrame-Print/////////////////////////////////////////////////////////////////////////
//var newIframe = document.getElementById('iframePrintDoc');
//newIframe.addEventListener('load', function () {
//    // La lógica que quieras ejecutar después de que el iframe haya cargado completamente
//    //console.log('El iframe ha cargado completamente.');
//    // Ejemplo: Obtener el contenido del iframe
//    var contenidoIframe = newIframe.contentDocument || newIframe.contentWindow.document;
//    newIframe.contentWindow.focus();
//    newIframe.contentWindow.print();
//});

var newIframe = document.getElementById('iframePrintDoc');

// 1. Primero limpiar listeners anteriores clonando el elemento
var nuevoIframe = newIframe.cloneNode(false);
newIframe.parentNode.replaceChild(nuevoIframe, newIframe);
newIframe = nuevoIframe;

// 2. Registrar el listener ANTES de asignar el src
newIframe.addEventListener('load', function () {
    try {
        if (newIframe.src != '') {
            newIframe.contentWindow.focus();
            newIframe.contentWindow.print();
        }        
    } catch (e) {
        console.error('Error al imprimir:', e);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////VERIFICAR SI ALGUN MODAL SE CERRO Y AUN SE ENCUENTRA ALGUN MODAL ABIERTO////////////////////////
$('.modal').on('hidden.bs.modal', function () {
    //console.log('Se cerró algún modal');
    let algunModalAbierto = $('.modal.in').length > 0;

    $("body").removeClass("modal-open");
    if (algunModalAbierto) {
        //console.log('Todavía hay al menos un modal abierto');
        $("body").addClass("modal-open");
    } /*else {
        //console.log('Ya no hay modales abiertos');

    }*/
});


/////////////////FUNCION PARA DIBUJAR Y CONECTAR INPUTS GRAFICAMENTE////////////////////////
function ConectarInputs(idParent, idElement1, idElement2) {
    

    const input1 = document.getElementById(idElement1);
    const input2 = document.getElementById(idElement2);
    //const linea = document.getElementById("linea");
    const linea = document.createElement('div');
    linea.id = 'linea_' + idElement1 + '_' + idElement2;
    linea.className = 'lineaConectorInput';
    document.querySelector('#' + idParent).appendChild(linea);

    const rect1 = input1.getBoundingClientRect();
    const rect2 = input2.getBoundingClientRect();

    const containerRect = document.querySelector('#' + idParent).getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;

    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    linea.style.width = length + "px";
    linea.style.top = y1 + "px";
    linea.style.left = x1 + "px";
    linea.style.transform = `rotate(${angle}deg)`;

    
}

//window.addEventListener("load", ConectarInputs);
//window.addEventListener("resize", ConectarInputs);
