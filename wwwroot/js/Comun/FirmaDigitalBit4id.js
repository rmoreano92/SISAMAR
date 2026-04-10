var FirmaDigital = {
    evento: null,
    servicio: null,

    async Iniciar() {
        //const proceso = false;
            //Eventos();
        const proceso = await FirmaDigital.ProcesoFirmaModificar(1);
        if (proceso) {
            FirmaDigital.evento = setInterval(FirmaDigital.Eventos, 1000);
            FirmaDigital.servicio = setInterval(FirmaDigital.IniciarSevicioFirma, 1000);
        } else {
            $('#EstadoServicio').text("Error al iniciar el proceso de firma ...");
            //window.close();
        }
                
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
        console.log("ENTROOOOOOOOOO: " + $(".bit4-link").text())
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

    async FinalizarServicioFirma() {
        //const proceso = false;        
        const proceso = await FirmaDigital.ProcesoFirmaModificar(2);
        if (proceso) {            
            window.close();
        } else {
            $('#EstadoServicio').text("Error al finalizar el proceso de firma ...");
            window.close();
        }
    },

    async ProcesoFirmaModificar(estado) {
        var formData = new FormData();
        let datos;
        let resp = false;

        let nrofirma = $("#nroFirma").text()
        let codigoFirma = $("#codigoFirma").text()

        //formData.append('idFirma', $("#nroFirma").text());
        //formData.append('codeFirma', $("#codigoFirma").text());
        formData.append('idFirma', nrofirma);
        formData.append('codeFirma', codigoFirma);
        formData.append('estado', estado);
        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ProcesoFirmaModificar?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            //Cargando(0);
            if (datos.session) {
                resp = datos.lsProceso;
                //resp = datos.respuesta.table[0];
                //console.log("Permiso: " + permiso);
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            console.error(error)
            //Cargando(0);
            //alerta(3, error);
        }

        return resp;
    }
}