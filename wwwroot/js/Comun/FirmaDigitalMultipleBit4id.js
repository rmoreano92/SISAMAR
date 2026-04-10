var FirmaDigital = {
    evento: null,
    servicio: null,

    //async Iniciar() {
    //    //const proceso = false;
    //    //Eventos();
    //    const proceso = await FirmaDigital.ModificarEstadoFirmaPaquete(1);
    //    console.log('proceso', proceso)
    //    if (proceso.estado) {
    //        FirmaDigital.evento = setInterval(FirmaDigital.Eventos, 1000);
    //        FirmaDigital.servicio = setInterval(FirmaDigital.IniciarSevicioFirma, 1000);
    //    } else {
    //        $('#EstadoServicio').text("Error al iniciar el proceso de firma ...");
    //        //window.close();
    //    }

    //},

    async Iniciar() {
        FirmaDigital.evento = setInterval(FirmaDigital.Eventos, 1000);
        FirmaDigital.servicio = setInterval(FirmaDigital.IniciarSevicioFirma, 1000);
    },


    Eventos() {
        console.log('asdsad', $('#bit4id-status').text())

        if ($('#bit4id-status').text() == "wait") {
            $('#EstadoServicio').text("Iniciando servicio ...");

            //if (control == false) {
            //    control = true;
            //    //proceso = await ProcesoFirmaModificar(1);
            //}
            //console.log("Iniciando servicio ...");
        }

        if ($('#bit4id-status').text().substring(0, 12) == "Disconnected") {

            console.log('nunca entra aquii')

            $('#EstadoServicio').text("Cerrando servicio ...");
            clearInterval(FirmaDigital.evento);
            FirmaDigital.FinalizarServicioFirma();
            //window.close();
            //proceso = await ProcesoFirmaModificar(0);
            //if (proceso) {
            //    window.close();
            //}                    
            //console.log("Cerrando servicio ...");
        }

        if ($('#bit4id-status').text() == "connected") {
            $('#EstadoServicio').text("Esperando su firma ...");
            //console.log("Esperando su firma ...");
        }
        //console.log("====================Cambio texto===============")
    },

    IniciarSevicioFirma() {
        if ($(".bit4-link").text() != '' || $(".bit4-link").text() != 'undefined') {
            if ($(".bit4-link").attr('href') !== undefined) {
                console.log("Entroooo");
                $(".bit4-link").addClass("btn btn-primary");
                //$(".bit4-link").hide();
                $(".bit4id-sign").addClass("text-center");
                clearInterval(FirmaDigital.servicio);
                window.location.href = document.getElementsByClassName('bit4-link')[0].href;
            }
        }

    },

    //async FinalizarServicioFirma() {
    //    //const proceso = false;        
    //    const proceso = await FirmaDigital.ModificarEstadoFirmaPaquete(2);
    //    if (proceso.estado) {
    //        //window.close();
    //    } else {
    //        $('#EstadoServicio').text("Error al finalizar el proceso de firma ...");
    //        //window.close();
    //    }
    //},

    //async ModificarEstadoFirmaPaquete(estado) {
    //    var formData = new FormData();
    //    let datos;
    //    let resp = false;

    //    let idCuenta = $("#idCuenta").val()

    //    //formData.append('idFirma', $("#nroFirma").text());
    //    //formData.append('codeFirma', $("#codigoFirma").text());
    //    formData.append('idCuenta', idCuenta);
    //    formData.append('estado', estado);

    //    return await HttpClient.Post('/Utilitario/ModificarEstadoFirmaPaquete?area=Comun', formData)
    //        .then(res => {
    //            if (!isEmpty(res)) {
    //                if (res.estado) {
    //                    return res
    //                } else {
    //                    console.log('3', 'Error: ' + res.msg)
    //                    return null
    //                }
    //            }

    //        })
    //        .catch((e) => {
    //            console.log(3, 'Algo salio mal ' + e)
    //            return null
    //        })


    //}
}

//let HttpClient = {
//    Post: async function (url, data) {
//        return await fetch(url, {
//            method: 'POST',
//            body: data
//        })
//            .then(res => res.json())
//            .then(res => {
//                if (!res.session) {
//                    console.log('sesion expirada')
//                    return false
//                } else {
//                    return res
//                }
//            })
//            .catch(e => {
//                alerta('3', e)
//                return false
//            })
//    },
//    Get: function (url) {
//        return fetch(url, {
//            method: 'GET'
//        })
//            .then(res => {
//                if (!res.ok) {
//                    console.log(3, 'Error (' + res.status + ' - ' + res.statusText + ') Existe un problema al consultar la URL: ' + res.url)

//                    return null
//                } else {
//                    return res.json()
//                }
//            })
//            .then(res => {
//                if (!isEmpty(res)) {
//                    if (!res.session) {
//                        console.log('sesion expirada')
//                        return null
//                    } else {
//                        return res
//                    }
//                } else {
//                    console.log('sesion expirada')
//                    return null
//                }
//            })
//            .catch(e => {
//                console.error('que pasho', e)
//                console.log('3', 'Error al convertir json: ' + e)
//                return null
//            })
//    },
//}

//function isEmpty(obj) {

//    var isEmpty = false;

//    if (typeof obj == 'undefined' || obj === null || obj === '' || obj === '0') {

//        isEmpty = true;
//    }

//    if (typeof obj == 'number' && isNaN(obj)) {
//        isEmpty = true;
//    }

//    if (obj instanceof Date && isNaN(Number(obj))) {
//        isEmpty = true;
//    }

//    return isEmpty;

//};