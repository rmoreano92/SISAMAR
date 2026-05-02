Utilitario = {
    TipoArchivoFirmar: '',

    /////////////////////OBTENER USUARIO LOGEADO////////////////////////
    async ObtenerUsuarioLogeadoCripto() {
        var formData = new FormData();
        let datos;
        let resp = false;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Home/ObtenerUsuarioLogeadoCripto",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            usuarioLogeado = datos.usuario;
            userLogeado = datos.user;
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    ////////////////////////////INICIAR SESIÓN//////////////////////////
    async ReIniciarSesion() {
        var formData = new FormData();
        let datos;
        let resp = false;

        if (isEmpty($("#password").val())) {
            alerta2("info","","Por favor ingrese la constraseña.")
            return false;
        }

        formData.append('USERID', usuarioLogeado);
        formData.append('PASSWORD', $("#password").val());
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Home/ReIniciarSesion",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                //resp = datos.respuesta;                
                if (datos.estado == 1) {
                    $("#username").val("");
                    $("#password").val("");
                    $("#modalLogin").modal("hide");
                    alerta2("success", "", datos.respuesta);
                } else {
                    alerta2("error", "", datos.respuesta);
                }
                //alerta("ERRRE", datos.respuesta, datos.estado);

                //resp = datos.respuesta.table[0];
                //console.log("Permiso: " + permiso);
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },
    //////////////////////////////////////////////////////////////////////

    ////////////////////////////FECHA HORA /////////////////////////////
    async FechaHoraServidor() {
        var formData = new FormData();
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
    },

    async AsignarFechaHoy(idElement) {
        let FechaHora = await Utilitario.FechaHoraServidor();
        $(idElement).datepicker("setDate", FechaHora.substring(0, 10));
    },
    ////////////////////////////////////////////////////////////////////

    ////////////////////////VALIDAR SESIÓN//////////////////////////////
    async ValidarSesion() {
        let datos;
        let resp = false;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Home/ValidarSesion?area=Comun",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.estado == 1) {
                if (datos.session) {
                    resp = true;
                }
                else {
                    $("#username").val(userLogeado);
                    $("#modalLogin").modal('show');
                    alerta(2, "La sesion ha expirado, por favor inicie sesión nuevamente.");
                    resp = false;
                }
            } else {
                alerta(3, datos.respuesta);
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },
    ///////////////////////////////////////////////////////////////////

    ////////////////////////////CARGAR MODAL INICIO SESION/////////////////////
    CargarModalInicioSesion() {
        $("#username").val(userLogeado);
        $("#modalLogin").modal('show');
        alerta2("info", "", "La sesion ha expirado, por favor inicie sesión nuevamente.");
    },
    ///////////////////////////////////////////////////////////////////////////

    async SeleccionarParametro(id) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idParametro', id);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Parametros/SeleccionaFilaParametroV2?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.lsResultado.table[0];
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
    },

    async SisFuaAtencionSeleccionarPorId(id) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('IdCuentaAtencion', id);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Sis/SisFuaAtencionSeleccionarPorId?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.lsResultado.table[0];
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
    },

    async SeleccionarFirmaDigital(idCuenta, idRegistro, tipo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCuenta', idCuenta);
        formData.append('idRegistro', idRegistro);
        formData.append('tipo', tipo);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionarFirmaDigital?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
                //console.log(permisoRefcon);
                Cargando(0);
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
            console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarFirmaDigitalV2(code) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('code', code);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionarFirmaDigitalV2?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
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
            console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarFirmaDigitalPorGrupo(idRegistro, tipo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idRegistro', idRegistro);
        formData.append('tipo', tipo);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionarFirmaDigitalPorGrupo?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
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
            //console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async GenerarGrupoDocumentoPdf(idRegistro, tipo) {
        Cargando(1);

        var formData = new FormData();
        formData.append('idRegistro', idRegistro);
        formData.append('tipo', tipo);

        var url = "/Utilitario/GenerarGrupoDocumentosPdf";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "Documento_por_Grupo-" + idRegistro + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    AbrirVisorDocumentoPersonalizado(url, "Documento por Grupo");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);

    },

    async ValidarUsuarioFirmaDigital(code) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('code', code);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ValidarUsuarioFirmaDigital?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
                if (typeof resp === 'undefined') {
                    alerta(2, "Usted no esta autorizado a firmar este documento.");
                    return false;
                }

                //console.log(permisoRefcon);
                //Cargando(0);
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
            console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return true;
    },

    async SeleccionarFirmaDigitalParaSocket(idCuenta, idRegistro, tipo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCuenta', idCuenta);
        formData.append('idRegistro', idRegistro);
        formData.append('tipo', tipo);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionarFirmaDigital?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
                //console.log(permisoRefcon);
                //Cargando(0);
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
            console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },
    async GenerarRecetaPdf(idCuenta, idRegistro, tipo) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idReceta', idRegistro);
        midata.append('tipo', tipo);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/GenerarRecetaOrdenMedica?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarAtencionPdf(idCuenta, idAtencion, idProCabecera, tipoFormato, tipoHoja) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idAtencion', idAtencion);
        midata.append('idProCabecera', idProCabecera);
        midata.append('tipoFormato', tipoFormato);
        midata.append('tipoHoja', tipoHoja);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/GenerarHojaAtencion?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarRefConPdf(idCuenta, idRefCon, tipo) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idRefCon', idRefCon);
        midata.append('tipo', tipo);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/GenerarHojaRefCon?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarFuaPdf(idCuenta, idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idAtencion', idAtencion);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato FUA, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FormatoFua/GenerarHojaFua?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarFuaPdfTamizaje(idCuenta, idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idAtencion', idAtencion);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato FUA, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FormatoFua/GenerarHojaFuaTamizaje?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarHojaFuaTamizajeSnPdf(idCuenta, idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);
        midata.append('idAtencion', idAtencion);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato FUA, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FormatoFua/GenerarHojaFuaTamizajeSnPdf?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarFormatoConsumoServicio(idCuenta) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato Procedimientos en el servicio, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsumoServicio/GenerarFormatoConsumoServicio?area=Facturacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarInterconsultaPdf(idCuentaAtencion, idAtencionInterconsulta, idProducto, idReceta) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idAtencionInterconsulta', idAtencionInterconsulta);
        midata.append('idProducto', idProducto);
        midata.append('idReceta', idReceta);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/InterconsultasHO/GenerarInterconsultaPdf?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.estadoCreacion == 'Ok') {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarHojaEvaluacionNeonatal(idCuenta, idEvaluacionDetalle, idAtencion, idServicio, eval) {
        Cargando(1);
        var formData = new FormData
        var respuesta = false;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('idAtencion', idAtencion);
            formData.append('idEvaluacionDetalle', idEvaluacionDetalle);
            formData.append('idServicio', idServicio);
            formData.append('eval', eval);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GenerarHojaEvaluacion?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                respuesta = true;
            }
            //if (datos) {
            //    var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
            //    alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            //} else {
            //    alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            //}
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

    async GenerarHojaEvaluacionEmergencia(idCuenta, idEvaluacionDetalle, idAtencion, idServicio, eval) {
        Cargando(1);
        var formData = new FormData
        var respuesta = false;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('idAtencion', idAtencion);
            formData.append('idEvaluacionDetalle', idEvaluacionDetalle);
            formData.append('idServicio', idServicio);
            formData.append('eval', eval);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/GenerarHojaEvaluacion?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                respuesta = true;
            }
            //if (datos) {
            //    var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
            //    alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            //} else {
            //    alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            //}
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

    async GenerarHojaEvaluacionNeonatalHosp(idCuenta, idEvaluacionDetalle, idAtencion, idServicio, eval) {
        Cargando(1);
        var formData = new FormData
        var respuesta = false;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('idAtencion', idAtencion);
            formData.append('idEvaluacionDetalle', idEvaluacionDetalle);
            formData.append('idServicio', idServicio);
            formData.append('eval', eval);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GenerarHojaEvaluacion?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                respuesta = true;
            }
            //if (datos) {
            //    var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
            //    alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            //} else {
            //    alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            //}
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

    async GenerarConstanciaNacimiento(idConstancia) {
        Cargando(1);
        var formData = new FormData
        var respuesta = false;
        let datos
        try {
            formData.append('idConstancia', idConstancia);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SolicitudConstanciasRN/GenerarConstanciaRn?area=Estadistica",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                respuesta = true;
            }
            //if (datos) {
            //    var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
            //    alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            //} else {
            //    alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            //}
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

    async GenerarFormatoResultadosPorItem(idCuentaAtencion, idOrden, idMovimiento, idProducto, tipoFormato) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idOrden', idOrden);
        midata.append('idMovimiento', idMovimiento);
        midata.append('idProducto', idProducto);
        midata.append('tipoFormato', tipoFormato);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/LaboratorioResultados/GenerarFormatoResultadosPorItem?area=Laboratorio",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarFormatoResultadosPorGrupo(idCuentaAtencion, idOrden, idMovimiento, idProducto, tipoFormato) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idOrden', idOrden);
        midata.append('idMovimiento', idMovimiento);
        midata.append('idProducto', idProducto);
        midata.append('tipoFormato', tipoFormato);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/LaboratorioResultados/GenerarFormatoResultadosPorGrupos?area=Laboratorio",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarFormatoResultados(idOrden, idPuntoCarga, idMovimiento, tipoFormato) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        midata.append('idPuntoCarga', idPuntoCarga);
        midata.append('idMovimiento', idMovimiento);
        midata.append('tipoFormato', tipoFormato);

        var respuesta = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/PatologiaClinica/GenerarFormatoResultados?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async CargarModuloAlta() {
        var midata = new FormData();

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/CargarModuloAlta?area=Comun",
                    data: null,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $("#ModuloAlta").html(datos);
            $("#modalAltaMedica").modal("show");
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    async GenerarInterconsultaPdfV2(idCuentaAtencion, idAtencionInterconsulta, idProducto, idReceta) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idAtencionInterconsulta', idAtencionInterconsulta);
        midata.append('idProducto', idProducto);
        midata.append('idReceta', idReceta);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/InterconsultasHO/GenerarInterconsultaPdfV2?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarHojaInformeUCI(idCuenta, idAtencion, idEvaluacionDetalle, idServicio, eval) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        midata.append('idAtencion', idAtencion);
        midata.append('idEvaluacionDetalle', idEvaluacionDetalle);
        midata.append('idServicio', idServicio);
        midata.append('eval', eval);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato FUA, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionesUCI/GenerarHojaInformeUCI?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GenerarHojaNotaAdicionalUCI(idCuenta, IdAtencion, IdComentarioApreciacion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        midata.append('IdAtencion', IdAtencion);
        midata.append('IdComentarioApreciacion', IdComentarioApreciacion);

        var respuesta = false;
        let datos;

        alerta(4, 'Generando formato FUA, por favor espere.');
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionesUCI/GenerarHojaNotaAdicionalUCI?area=Sis",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            //if (datos.estadoCreacion == 'Ok') {
            //if (datos.respuesta) {
            if (datos) {
                respuesta = true;
            }
            else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async Configuracion(tipo) {
        var midata = new FormData();
        midata.append('tipo', tipo);
        var respuesta = '';
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/AppSetting?area=Comun",
                    data: midata,
                    dataType: "text",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    async ValidarPermiso(idPermiso) {
        var formData = new FormData();
        let datos;
        let resp = false;

        formData.append('idPermiso', idPermiso);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ValidarPermisoEmpleado?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                resp = datos.respuesta;
                //resp = datos.respuesta.table[0];
                //console.log("Permiso: " + permiso);
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
    },

    async ValidarPermisoUsuario(permiso) {
        var formData = new FormData();
        let datos;
        let resp = 0;

        formData.append('clave', permiso);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ValidarPermisoUsuario?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                resp = datos.respuesta;
                //resp = datos.respuesta.table[0];
                //console.log("Permiso: " + permiso);
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
    },

    /////////////////////FIRMA DIGITAL FIRMA PERU////////////////////////////
    async IniciarServicioFirmaPeru(code) {
        finFirmaDigital = 0;
        // Firma Peru nuevo flujo: no depende de websocket de estado.
        Cargando(0);
        code = NormalizarParaUrl(code);
        $("#modalFirmaDigital").modal("show");
        let rutaFirmaPeru = '/FirmaDigital/FirmaDigitalFirmaPeru?server=' + PathServerFiles + '&code=' + code;
        $('#ifmFirmaDigital').attr('src', rutaFirmaPeru);
    },

    async IniciarServicioFirmaMultipleFirmaPeru(nombrePaquete) {
        finFirmaDigital = 0;
        // Firma Peru nuevo flujo: no depende de websocket de estado.
        Cargando(0);
        $("#modalFirmaDigital").modal("show");
        let rutaFirmaPeru = '/FirmaDigital/FirmaDigitalMultipleFirmaPeru?server=' + PathServerFiles + '&nombrePaquete=' + nombrePaquete;
        $('#ifmFirmaDigital').attr('src', rutaFirmaPeru);
    },

    async IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos) {
        finFirmaDigital = 0;
        Cargando(0);
        const cuentasParam = Array.isArray(cuentasAtencion) ? cuentasAtencion.join(',') : cuentasAtencion;
        let ruta = '/FirmaDigital/FirmaDigitalLoteFirmaPeru?server=' + PathServerFiles
            + '&cuentasAtencion=' + encodeURIComponent(cuentasParam)
            + '&tipos=' + encodeURIComponent(tipos);
        $("#modalFirmaDigital").modal("show");
        $('#ifmFirmaDigital').attr('src', ruta);
    },

    //async AbrirServicioFirmaPeru(code) {
    //    await VerificarFirma(code);
    //    ws = window.screen.width;
    //    hs = window.screen.height;
    //    ww = 350;
    //    hw = 450;
    //    topPos = ((hs - hw) / 2) - 100;
    //    leftPos = (ws - ww) / 2;
    //    var strWindowFeatures = "location=yes,height=" + hw + ",width=" + ww + ",top=" + topPos + ",left=" + leftPos + ",scrollbars=yes,status=yes";
    //    //var strWindowFeatures = "location=yes,height=450,width=350,scrollbars=yes,status=yes";
    //    code = NormalizarParaUrl(code);
    //    console.log(code);
    //    var rutaBit4Id = '/Utilitario/FirmaDigitalFirmaPeru?server=' + PathServerFiles + '&code=' + code;
    //    var win = window.open(rutaBit4Id, "_blank", strWindowFeatures);
    //},

    //async AbrirServicioFirmaPeruMultiple(nombrePaquete) {
    //    await VerificarFirmaMultiple(nombrePaquete);
    //    ws = window.screen.width;
    //    hs = window.screen.height;
    //    ww = 350;
    //    hw = 450;
    //    topPos = ((hs - hw) / 2) - 100;
    //    leftPos = (ws - ww) / 2;
    //    var strWindowFeatures = "location=yes,height=" + hw + ",width=" + ww + ",top=" + topPos + ",left=" + leftPos + ",scrollbars=yes,status=yes";
    //    //var strWindowFeatures = "location=yes,height=450,width=350,scrollbars=yes,status=yes";
    //    var rutaBit4Id = '/Utilitario/FirmaDigitalFirmaPeruMultiple?server=' + PathServerFiles + '&nombrePaquete=' + nombrePaquete;
    //    var win = window.open(rutaBit4Id, "_blank", strWindowFeatures);
    //},

    /////////////////////FIRMA DIGITAL BIT 4 ID////////////////////////////

    //async AbrirServicioFirmaBit4Id(idRegistro, idCuenta, tipo) {
    //    await VerificarFirma(idCuenta, tipo, idRegistro);
    //    var strWindowFeatures = "location=yes,height=450,width=350,scrollbars=yes,status=yes";
    //    var rutaBit4Id = '/Utilitario/FirmaDigitalBitFourId?server=' + PathServerFiles + '&idCuenta=' + idCuenta + '&idRegistro=' + idRegistro + '&tipo=' + tipo;
    //    var win = window.open(rutaBit4Id, "_blank", strWindowFeatures);
    //},

    async IniciarServicioFirmaBit4Id(code) {
        finFirmaDigital = 0;
        await VerificarFirma(code);
        code = NormalizarParaUrl(code);
        $("#modalFirmaDigital").modal("show");
        var rutaBit4Id = '/FirmaDigital/FirmaDigitalBitFourId?server=' + PathServerFiles + '&code=' + code;
        $('#ifmFirmaDigital').attr('src', rutaBit4Id);
    },

    async IniciarServicioFirmaMultipleBit4Id(nombrePaquete) {
        finFirmaDigital = 0;
        await VerificarFirmaMultiple(nombrePaquete);
        $("#modalFirmaDigital").modal("show");
        var rutaBit4Id = '/FirmaDigital/FirmaDigitalBitFourIdMultiple?server=' + PathServerFiles + '&nombrePaquete=' + nombrePaquete;
        $('#ifmFirmaDigital').attr('src', rutaBit4Id);
    },

    //async AbrirServicioFirmaBit4Id(code) {
    //    await VerificarFirma(code);
    //    ws = window.screen.width;
    //    hs = window.screen.height;
    //    ww = 600;
    //    hw = 450;
    //    topPos = ((hs - hw) / 2) - 100;
    //    leftPos = (ws - ww) / 2;
    //    var strWindowFeatures = "location=yes,height=" + hw + ",width=" + ww + ",top=" + topPos + ",left=" + leftPos + ",scrollbars=yes,status=yes";
    //    //var strWindowFeatures = "location=yes,height=450,width=350,scrollbars=yes,status=yes";
    //    code = NormalizarParaUrl(code);
    //    console.log(code);
    //    var rutaBit4Id = '/Utilitario/FirmaDigitalBitFourId?server=' + PathServerFiles + '&code=' + code;
    //    var win = window.open(rutaBit4Id, "_blank", strWindowFeatures);
    //},

    //async AbrirServicioFirmaBit4IdMultiple(nombrePaquete) {
    //    await VerificarFirmaMultiple(nombrePaquete);
    //    ws = window.screen.width;
    //    hs = window.screen.height;
    //    ww = 600;
    //    hw = 450;
    //    topPos = ((hs - hw) / 2) - 100;
    //    leftPos = (ws - ww) / 2;
    //    var strWindowFeatures = "location=yes,height=" + hw + ",width=" + ww + ",top=" + topPos + ",left=" + leftPos + ",scrollbars=yes,status=yes";
    //    //var strWindowFeatures = "location=yes,height=450,width=350,scrollbars=yes,status=yes";
    //    var rutaBit4Id = '/Utilitario/FirmaDigitalBitFourIdMultiple?server=' + PathServerFiles + '&nombrePaquete=' + nombrePaquete;
    //    var win = window.open(rutaBit4Id, "_blank", strWindowFeatures);
    //},


    //async AbrirDocumentoFirmadoBit4Id(idRegistro, idCuenta, tipo) {
    //    Cargando(1);
    //    const firma = await Utilitario.SeleccionarFirmaDigital(idCuenta, idRegistro, tipo);
    //    console.log('firma', firma)
    //    AbrirVisorDocumento('/4IdentitySignedFiles' + firma.rutaArchivo, 1);
    //    Cargando(0);
    //},

    async AbrirDocumentoFirmadoBit4Id(code) {
        Cargando(1);
        const firma = await Utilitario.SeleccionarFirmaDigitalV2(code);
        console.log('firma', firma)
        AbrirVisorDocumento('/4IdentitySignedFiles' + firma.rutaArchivo, 1);
        Cargando(0);
    },

    async ProcesoFirmaModificar(idFirma, codeFirma, estado) {
        var formData = new FormData();
        let datos;
        let resp = false;

        formData.append('idFirma', idFirma);
        formData.append('codeFirma', codeFirma);
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
                //alert("La sesion ya expiro se volvera a recargar la pagina")
                //location.reload();
                alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
                $("#modalLogin").modal('show');
            }
        } catch (error) {
            console.error(error)
            //Cargando(0);
            //alerta(3, error);
        }

        return resp;
    },
    ///////////////////////////////////////////////////////////////////////




    //////////////////////////////////////////////////////////////////////
    async ListarPaises() {
        return HttpClient.Get('/Utilitario/ListaPaises?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },
    async ListaTiposEstadoCivilTodosV2() {
        return HttpClient.Get('/Utilitario/ListaTiposEstadoCivilTodosV2?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },
    async TiposGradoInstruccionTodosV2() {
        return HttpClient.Get('/Utilitario/TiposGradoInstruccionTodosV2?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },
    async TipoSoporteOxigenatorioVentilatorio() {
        return HttpClient.Get('/Utilitario/TipoSoporteOxigenatorioVentilatorio?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    /*
    async FirmaDocumentosByLote(idCuentaAtencion) {
        let formData = new FormData()
        formData.append('idCuentaAtencion', idCuentaAtencion)
        return HttpClient.Post('/Utilitario/FirmaDocumentosByLote?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    async FirmaDocumentosByLoteTotal(cuentasAtencion) {
        let formData = new FormData()
        formData.append('cuentasAtencion', cuentasAtencion)
        return HttpClient.Post('/Utilitario/FirmaDocumentosByLoteTotal?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },
    */

    async TiposDestinoAtencionHospitalizacion() {
        let formData = new FormData()

        return HttpClient.Get('/Utilitario/TiposDestinoAtencionHospitalizacion?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    async GenerarHojaEvaluacionNI(idCuenta, idAtencion, idServicio, eval) {
        Cargando(1);
        var formData = new FormData
        var respuesta;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('idAtencion', idAtencion);
            formData.append('idServicio', idServicio);
            formData.append('eval', eval);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaIngreso/GenerarHojaEvaluacionNI?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                /*var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);*/
                alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            } else {
                alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

    async ServicioSeleccionarPorTipoServicio(idTipoServicio) {
        let formData = new FormData()

        formData.append('idTipoServicio', idTipoServicio)
        return HttpClient.Post('/Servicios/ServicioSeleccionarPorTipoServicio?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    async EstablecimientosSeleccionarTodosV2() {

        return HttpClient.Get('/Utilitario/EstablecimientosSeleccionarTodosV2?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    /////////////////////////FIRMA DIGITAL POR LOTE////////////////////////
    //async FirmaDocumentosPorAtencion(idCuentaAtencion) {
    //    let formData = new FormData()
    //    formData.append('idCuentaAtencion', idCuentaAtencion)
    //    return HttpClient.Post('/Utilitario/FirmaDocumentosByLote?area=Comun', formData)
    //        .then(res => {
    //            if (!isEmpty(res)) {
    //                if (res.estado) {
    //                    return res
    //                } else {
    //                    alerta('3', 'Error: ' + res.msg)
    //                    return null
    //                }
    //            }

    //        })
    //        .catch((e) => {
    //            alerta(3, 'Algo salio mal ' + e)
    //            return null
    //        })
    //},

    //async CrearPaqueteArchivos(cuentasAtencion) {
    //    let formData = new FormData()
    //    formData.append('cuentasAtencion', cuentasAtencion)
    //    return HttpClient.Post('/Utilitario/CrearPaqueteArchivos?area=Comun', formData)
    //        .then(res => {
    //            if (!isEmpty(res)) {
    //                if (res.estado) {
    //                    return res
    //                } else {
    //                    alerta('3', 'Error: ' + res.msg)
    //                    return null
    //                }
    //            }

    //        })
    //        .catch((e) => {
    //            alerta(3, 'Algo salio mal ' + e)
    //            return null
    //        })
    //},

    //async CrearPaqueteArchivos7zip(cuentasAtencion, idEvaluacion, idServicio) {
    //    //var formData = new FormData();
    //    let datos;
    //    let resp = null;

    //    var formData = new FormData(); //create form
    //    formData.append('cuentasAtencion', cuentasAtencion)
    //    formData.append('idEvaluacion', idEvaluacion)
    //    formData.append('idServicio', idServicio)

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/FirmaDigital/CrearPaqueteArchivos7zip?area=Comun",
    //                data: formData,
    //                //dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        if (!datos.error) {
    //            if (datos.estado) {
    //                resp = datos;
    //            } else {
    //                alerta(2, datos.msg);
    //            }
    //        } else {
    //            alerta(3, datos.msg);
    //        }
    //        //console.log(datos);
    //    } catch (error) {
    //        //console.error(error)
    //        Cargando(0);
    //        alerta(3, error);
    //    }

    //    return resp;
    //},

    async CrearPaqueteArchivos7zip(cuentasAtencion, registros, tipos) {
        //var formData = new FormData();
        let datos;
        let resp = null;

        var formData = new FormData(); //create form
        formData.append('cuentasAtencion', cuentasAtencion)
        formData.append('registros', registros)
        formData.append('tipos', tipos)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FirmaDigital/CrearPaqueteArchivos7zip?area=Comun",
                    data: formData,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!datos.error) {
                if (datos.estado) {
                    resp = datos;
                } else {
                    alerta(2, datos.msg);
                }
            } else {
                alerta(3, datos.msg);
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    //async CrearPaqueteArchivos(cuentasAtencion, idEvaluacion, idServicio) {
    async CrearPaqueteArchivos(cuentasAtencion, registros, tipos) {
        //var formData = new FormData();
        let datos;
        let resp = null;

        var formData = new FormData(); //create form
        formData.append('cuentasAtencion', cuentasAtencion)
        formData.append('registros', registros)
        formData.append('tipos', tipos)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FirmaDigital/CrearPaqueteArchivos?area=Comun",
                    data: formData,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!datos.error) {
                if (datos.estado) {
                    resp = datos;
                } else {                    
                    alerta(2, datos.msg);
                }
            } else {                
                alerta(3, datos.msg);
            }            
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async CrearPaqueteArchivosConRegistros(registros, idEvaluacion, idServicio, tipo) {
        //var formData = new FormData();
        let datos;
        let resp = null;

        var formData = new FormData(); //create form
        formData.append('registros', registros)
        formData.append('idEvaluacion', idEvaluacion)
        formData.append('idServicio', idServicio)
        formData.append('tipo', tipo)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/CrearPaqueteArchivosConRegistros?area=Comun",
                    data: formData,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!datos.error) {
                if (datos.estado) {
                    resp = datos;
                } else {
                    alerta(2, datos.msg);
                }
            } else {
                alerta(3, datos.msg);
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async CrearPaqueteArchivosConRegistrosConItems(registros, idEvaluacion, idServicio, idItem, tipo) {
        //var formData = new FormData();
        let datos;
        let resp = null;

        var formData = new FormData(); //create form
        formData.append('registros', registros)
        formData.append('idEvaluacion', idEvaluacion)
        formData.append('idServicio', idServicio)
        formData.append('idItem', idItem)
        formData.append('tipo', tipo)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/CrearPaqueteArchivosConRegistrosConItems?area=Comun",
                    data: formData,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!datos.error) {
                if (datos.estado) {
                    resp = datos;
                } else {
                    alerta(2, datos.msg);
                }
            } else {
                alerta(3, datos.msg);
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },
    ///////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////
    async CrearPaqueteArchivosRecetas(idCuenta) {
        //var formData = new FormData();
        let datos;
        let resp = null;

        var formData = new FormData(); //create form
        formData.append('idCuenta', idCuenta)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/CrearPaqueteArchivosRecetas?area=Comun",
                    data: formData,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!datos.error) {
                if (datos.estado) {
                    resp = datos;
                } else {
                    alerta(2, datos.msg);
                }
            } else {
                alerta(3, datos.msg);
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },
    //////////////////////////////////////////////////////////

    DevuelveFechaPosibleParto(fecha) {
        fechaNueva = '';
        if (esFormatoFecha(fecha)) {
            fecha = ConvertirFormatoFecha(fecha);
            fechaPicker = moment(fecha);            
            fechaNueva = fechaPicker.add(280, 'days').toDate().format('dd/mm/yyyy');
        }
        
        return fechaNueva;
    },

    DevuelveEdadGestacional(fecha) {
        fechaNueva = '';
        if (esFormatoFecha(fecha)) {
            fecha = ConvertirFormatoFecha(fecha);
            fechaPicker = moment(fecha);
            fechaHoyPicker = moment();
            fechaNueva = Math.floor(fechaHoyPicker.diff(fechaPicker, 'days') / 7);
        }
        
        return fechaNueva;
    },

    DevuelveDiasEdadGestacional(fecha) {
        fechaNueva = '';
        if (esFormatoFecha(fecha)) {
            fecha = ConvertirFormatoFecha(fecha);
            fechaPicker = moment(fecha);
            fechaHoyPicker = moment();
            fechaNueva = fechaHoyPicker.diff(fechaPicker, 'days') - (Math.floor(fechaHoyPicker.diff(fechaPicker, 'days') / 7) * 7);
        }
        
        return fechaNueva;
    },

    async ObtenerIdMedicoSesion() {        
        let datos = null;
        let resp = false;
        let idMed = 0;

        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/Utilitario/ObtenerIdMedicoLogeado?area=Comun",
                //contentType: "application/json; charset=utf-8",
                //data: data,
                //dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            idMed = datos;
        } catch (error) {
            alerta2("error", "", error);
        }

        return idMed;
    },

    ObtenerIdUsuarioSesion() {
        var idUsu = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUsu = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error al obtener Id del Medico!", "2");
            }
        });

        return idUsu;
    },

    async ObtenerUsuarioSesion() {
        let datos = null;
        let resp = null;

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ObtenerUsuarioLogeado?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    //data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    resp = datos.respuesta.table[0]
                }
            }
            
        } catch (error) {
            alerta2("error", "", error);
        }

        return resp;
    },

    CalcularEdadGestacional(fechaCita, fechaEco, semEco, diasEco, tipo) {        
        var midata = new FormData();
        let resp = null;

        midata.append('FechaCita', fechaCita);
        midata.append('Fecha', fechaEco);
        midata.append('SemanasEco', semEco);
        midata.append('DiasEco', diasEco);
        midata.append('Tipo', tipo);

        $.ajax({
            method: "POST",
            url: "/Atencion/DevolverEdadGestacional?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (isEmpty(datos) == false) {
                    resp = datos;
                    //$("#txtSemanas").val(datos.cantSemanas);
                    //$("#txtDias").val(datos.cantDias);
                    //$("#txtFPP").val(datos.fpp);

                    //$("#txtFPPControl").val($("#txtFPP").val());
                    //$("#txtSemanaGestacional").val($("#txtSemanas").val());
                    //$("#txtDiasGestacional").val($("#txtDias").val());

                    //if (Tipo == 2) {
                    //    $("#txtFUM").val(datos.fum);
                    //}
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al calcular la edad gestacional!", "2");
                }, 900)
            }
        });

        return resp;
    },

    async ListarTiposDocumentos() {
        //var formData = new FormData();
        let datos;
        let resp = null;

        //var formData = new FormData(); //create form
        //formData.append('idCuenta', idTipoDocumento)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListaTiposDocumentos?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                resp = datos;
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListarTiposSexo() {
        //var formData = new FormData();
        let datos;
        let resp = null;

        //var formData = new FormData(); //create form
        //formData.append('idCuenta', idTipoDocumento)

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListaTiposSexo?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                resp = datos;
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async GenerarAccionFlujoAtencionCE(idAtencion, idFlujo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idAtencion', idAtencion);
        formData.append('idFlujo', idFlujo);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/GenerarAccionFlujoAtencionCE?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {                
                resp = datos.respuesta;                
            }
            else {
                $("#username").val(userLogeado);
                $("#modalLogin").modal('show');
                alerta(2, "La sesión ha expirado, por favor inicie sesión nuevamente.");
                resp = false;                
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            //console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async GenerarAccionFlujoAtencionTerapias(idCita, idFlujo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCita', idCita);
        formData.append('idFlujo', idFlujo);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/GenerarAccionFlujoAtencionTerapias?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                resp = datos.respuesta;
            }
            else {
                $("#username").val(userLogeado);
                $("#modalLogin").modal('show');
                alerta(2, "La sesión ha expirado, por favor inicie sesión nuevamente.");
                resp = false;
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            //console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async GenerarAccionFlujoAtencionProcedimientos(idCita, idFlujo) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCita', idCita);
        formData.append('idFlujo', idFlujo);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/GenerarAccionFlujoAtencionProcedimientos?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                resp = datos.respuesta;
            }
            else {
                $("#username").val(userLogeado);
                $("#modalLogin").modal('show');
                alerta(2, "La sesión ha expirado, por favor inicie sesión nuevamente.");
                resp = false;
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            //console.log('3 - cual se ejecuta primero')
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarCamaByIdServicio(IdServicio) {
        let formData = new FormData()

        formData.append('IdServicio', IdServicio)
        return HttpClient.Get('/Utilitario/SeleccionarCamaByIdServicio?area=Comun&IdServicio=' + IdServicio)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    async AtencionesSelecionarPorCuenta(idCuentaAtencion) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCuenta', idCuentaAtencion);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstAtenciones.table.length > 0) {

                return datos.lstAtenciones.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async RecetaCabeceraDetalleSeleccionaPorNroReceta(idReceta) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdReceta', idReceta);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/RecetaCabeceraDetalleSeleccionaPorNroReceta?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData;
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async RecetaCabeceraDetalleSeleccionaPorComprobantePago(nroSerie, nroDocumento, idPuntoCarga) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroSerie', nroSerie);
        data.append('NroDocumento', nroDocumento);
        data.append('IdPuntoCarga', idPuntoCarga);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/RecetaCabeceraDetalleSeleccionaPorComprobantePago?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData;
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarExamenesImagenologiaByPtoCarga(idCuentaAtencion, idPuntoCarga) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdCuentaAtencion', idCuentaAtencion);
        data.append('IdPuntoCarga', idPuntoCarga);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarExamenesImagenologiaByPtoCarga?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData;
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarProfesionalesDeLaSalud() {
        let respuesta;
        let resp = false;
        let datos
        
        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarProfesionalesDeLaSalud?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.dataSet.table.length > 0) {
                return datos.dataSet.table;
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async CargarModuloAtencion(tipoModulo) {
        let datos;
        let respuesta = false;
        var midata = new FormData();
        midata.append('tipoModulo', tipoModulo);
        $("#modulo").html("");

        
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/CargarTipoModuloAtencion?area=Comun",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            $("#modulo").html(datos);   
            respuesta = true;
        } catch (error) {
            Cargando(0)
            alerta(3, JSON.stringify(error));
        }

        return respuesta;
    },

    async GenerarFormatoArchivoClinico(idPaciente) {
        Cargando(1);

        var formData = new FormData();
        formData.append('idPaciente', idPaciente);

        var url = "/Paciente/GenerarHojaFiliacionArchivoClinico?area=ConsultaExterna";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    //AbrirVisorDocumentoPersonalizado(url, "Brazalete");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    async GenerarFormatoNotaDebito(idNota) {
        Cargando(1);

        var formData = new FormData();
        formData.append('idNota', idNota);

        var url = "/NotaDebito/GenerarFormatoNotaDebito?area=Caja";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    //AbrirVisorDocumentoPersonalizado(url, "Brazalete");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    async GenerarFormatoNotaCredito(idNota) {
        Cargando(1);

        var formData = new FormData();
        formData.append('idNota', idNota);

        var url = "/NotaCredito/GenerarFormatoNotaCredito?area=Caja";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    //AbrirVisorDocumentoPersonalizado(url, "Brazalete");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    async GenerarFormatoComprobantePago(idComprobantePago) {
        Cargando(1);

        const formData = new FormData();
        formData.append('idComprobantePago', idComprobantePago);
        //formData.append('tipoCopia', "TODOS");

        const url = "/GestionCaja/GenerarFormatoComprobantePago?area=Caja";

        const request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = function () {
            if (request.status === 200 && request.response.size > 0) {
                const blob = new Blob([request.response], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                // Mostramos el PDF combinado
                //newIframe.src = url;
                AbrirVisorDocumentoPersonalizado(url, "Comprobante de pago");
            } else {
                alerta(3, "Error al generar el documento.");
            }
            Cargando(0);
        };

        request.send(formData);
    },

    async ImprimirCopiaComprobantePago(idComprobantePago) {
        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();

        formData.append('idComprobantePago', idComprobantePago);

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ImprimirCopiaComprobantePago?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta) {
                    resp = true;
                } else {
                    alerta2("error", "", datos.mensaje);
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    //async GenerarFormatoComprobantePago(idComprobantePago) {
    //    let emisor = await Utilitario.FormatoComprobantePago(idComprobantePago, "EMISOR");
    //    let receptor = await Utilitario.FormatoComprobantePago(idComprobantePago, "RECEPTOR");
    //    let usuario = await Utilitario.FormatoComprobantePago(idComprobantePago, "USUARIO");
    //},

    //async FormatoComprobantePago(idComprobantePago, tipoCopia) {
    //    Cargando(1);

    //    var formData = new FormData();
    //    formData.append('idComprobantePago', idComprobantePago);
    //    formData.append('tipoCopia', tipoCopia);
        
    //    var url = "/GestionCaja/GenerarFormatoComprobantePago?area=Caja";
    //    //$('#ifrmReporte').attr('src', url);

    //    var request = new XMLHttpRequest();
    //    request.responseType = "blob";
    //    request.open("POST", url, true);

    //    request.onload = async function () {
    //        if (request.status === 200) {
    //            if (this.response.size > 0) {
    //                var url = window.URL.createObjectURL(this.response);
                    
    //                //newIframe.src = url;

    //                Cargando(0);      

    //                return this.response;
    //            }
    //        } else {
    //            Cargando(0);
    //            alerta(3, "Hubo un error al generar el documento.")
                
    //        }
    //    }
    //    request.send(formData);
        
    //},

    async GenerarFormatoNotaIngreso(movNumero) {
        Cargando(1);

        var formData = new FormData();
        //formData.append('idNota', movNumero);

        var url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=Farmacia&MovNumero=" + movNumero + "&MovTipo=E";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    //newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    AbrirVisorDocumentoPersonalizado(url, "Nota de Ingreso");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    ///////////////////EVALUACIÓN  DE RIESGO SOCIAL/////////////////////////////////
    async GenerarHojaEvaluacionRiesgoSocial(idCuenta, idEvaluacion) {
        Cargando(1);
        var formData = new FormData
        var respuesta;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('idEvaluacion', idEvaluacion);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/GenerarFormatoInforme?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                /*var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);*/
                //alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
            } else {
                alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },

}

$(document).ready(function () {
    $('.iniciar-sesion').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#btnLogin").click();
        }
    });
    Utilitario.ObtenerUsuarioLogeadoCripto();
});
