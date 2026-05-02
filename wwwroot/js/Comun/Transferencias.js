var Transferencias = {
    idMedicoSesion: 0,
    idEstanciaHospitalariaActual: 0,
    tipoServicio: '',
    idEspecialidad: 0,
    tieneCama: false,

    async cargaInicial() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaRecepcionTransferencia').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraRecepcionTransferencia").mask("Hn:Nn");

        $('#txtHoraRecepcionTransferencia').val(moment().toDate().format('HH:MM'));

        if ($("#hdIdTipoServicio").val() == '3') {
            Transferencias.tipoServicio = 'HOSP';
        } else if ($("#hdIdTipoServicio").val() == '2' || $("#hdIdTipoServicio").val() == '4') {
            Transferencias.tipoServicio = 'EMER';
        }

        Transferencias.Eventos();
        Transferencias.initDatables();
        //await Transferencias.ListarMedicos();
        await Transferencias.ListarServicios(Transferencias.tipoServicio);
        
    },

    Eventos() {
        $("#btnTransferencia").on('click', async function () {
            Transferencias.LimpiarModalTransferencias();
            await Transferencias.CargarTransferencia();            
        });

        $("#btnCerrarTransferencias").on('click', function () {
            Variables.Limpiar();
            Transferencias.CerrarModalTransferencias();
        });

        $("#btnTransferenciaRecepcion").on('click', async function () {
            //Transferencias.LimpiarModalTransferencias();
            await Transferencias.CargarTransferenciaRecepcion();
        });

        $("#cboServicioRecibeTransferencia").on('change', async function () {
            var idServDest = $("#cboServicioRecibeTransferencia").val();
            await Transferencias.ListarCamasDestinos(idServDest);
        });

        $("#btnGuardarTransferencias").on('click', async function () {
            await Transferencias.ModificarTransferencia();
        });


        ///////////////////////CAMBIAR CAMAS/////////////////////////////
        $("#btnGuardarCamaActualTransferencia").on('click', async function () {
            await Transferencias.ModificarCamaActual();
        });

        $("#btnCerrarCamaActualTransferencia").on('click', function () {
            Transferencias.CerrarModalTransferenciasConfirmacion();
        });

        ///////////////////////RECEPCION CONFIRMACION/////////////////////////////
        $("#btnGuardarTransferenciasConfirmacion").on('click', async function () {

            if (isEmpty($("#cboServicioEsperaTransferencia").val())) {
                alerta2('info', '', 'Por favor selecciones el servicio que se asiganara al paciente.');
                return false;
            }

            if ($('#cboCamaEsperaTransferencia option').length > 0) {
                if (isEmpty($("#cboCamaEsperaTransferencia").val())) {
                    alerta2('info', '', 'Por favor selecciones la cama que se asiganara al paciente.');
                    return false;
                }
            }             

            const llegada = await Transferencias.ConfirmarLlegadaAlServicio(Transferencias.idEstanciaHospitalariaActual, $("#cboCamaEsperaTransferencia").val());
            if (llegada) {
                if (Transferencias.tipoServicio == 'EMER') {
                    AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
                }
                if (Transferencias.tipoServicio == 'HOSP') {
                    AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
                }
                if (Transferencias.tipoServicio == 'UCI') {
                    EvaluacionesUCI.ListarAtenciones();
                }
                Transferencias.CerrarModalTransferenciasConfirmacion();
                ReposicionarVista();
            }
        });
        
        $("#btnCerrarTransferenciasConfirmacion").on('click', function () {
            Transferencias.CerrarModalTransferenciasConfirmacion();
        });

    },

    async CargarTransferencia() {
        if (Transferencias.tipoServicio == 'EMER') {
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        }

        if (Transferencias.tipoServicio == 'HOSP') {
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        }

        if (Transferencias.tipoServicio == 'UCI') {
            var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();
        }

        if (isEmpty(objrowTb)) {
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta2('info', '', 'La cuenta se encuentra cerrada.');
            if (Transferencias.tipoServicio == 'EMER') {                
                return false;
            }            
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            alerta2('info', '', 'El paciente tiene alta médica.');
            return false;
        }

        $("#btnGuardarTransferencias").show();
        if (Transferencias.tipoServicio == 'EMER') {
            if (objrowTb.esObservacionEmergencia) {
                //if (isEmpty(objrowTb.idCamaIngreso)) {
                //    alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
                //    return false;
                //}

                if (objrowTb.llegoAlServicio == 0) {
                    alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
                    $("#btnGuardarTransferencias").hide();
                    //return false;
                }
            }
        } else if (Transferencias.tipoServicio == 'HOSP' || Transferencias.tipoServicio == 'UCI') {
            $("#CamasActual").show();
            $("#BtnCamaActual").show();

            if (isEmpty(objrowTb.idCamaIngreso)) {
                alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
                return false;
            }

            if (objrowTb.llegoAlServicio == 0) {
                alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
                $("#btnGuardarTransferencias").hide();
                //return false;
            }            
        }

        $("#txtNroCuentaTransferencia").val(objrowTb.idCuentaAtencion);
        $("#txtHistoriaTransferencia").val(objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoTransferencia").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoTransferencia").val(objrowTb.nroDocumento);
        $("#txtPacienteNombreTransferencia").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);

        Variables.Cargar(objrowTb);
        $("#CamasDestino").hide();
        
        Transferencias.idEspecialidad = objrowTb.idEspecialidad;
        Transferencias.idMedicoSesion = await Utilitario.ObtenerIdMedicoSesion();
        await Transferencias.ListarMedicos();
        $('#cboMedicoOrdenaTransferencia').val(Transferencias.idMedicoSesion);        
        await Transferencias.ListarTransferencias();
        await Transferencias.ListarCamas(Variables.IdServicioActual);

        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#modalTransferencias").modal("show");                       
              
    },

    async CargarTransferenciaRecepcion() {
        if (Transferencias.tipoServicio == 'EMER') {
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        }

        if (Transferencias.tipoServicio == 'HOSP') {
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        }
        
        if (Transferencias.tipoServicio == 'UCI') {
            var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();
        }

        if (isEmpty(objrowTb)) {
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (Transferencias.tipoServicio == 'EMER') {
                return false;
            }
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            alerta2('warning', '', 'El paciente tiene alta médica.');
            return false;
        }

        $("#txtNroCuentaRecepcion").val(objrowTb.idCuentaAtencion);
        $("#txtHistoriaRecepcion").val(objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoRecepcion").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoRecepcion").val(objrowTb.nroDocumento);
        $("#txtPacienteNombreRecepcion").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);

        $("#EstanciaServicioActual").show();
        $("#EstanciaServicioPorRecepcionar").show();
        $("#CamasActual").show();
        $("#CamasEspera").show();
        $("#btnGuardarCamaActualTransferencia").show();
        Transferencias.idEstanciaHospitalariaActual = objrowTb.idEstanciaHospitalariaActual;
        Variables.Cargar(objrowTb);

        if (Transferencias.tipoServicio == 'EMER') {
            if (objrowTb.esObservacionEmergencia) {
                if (objrowTb.llegoAlServicio == 0) {
                    await Transferencias.ListarCamasEspera(objrowTb.idServicioActual, objrowTb.idPaciente, objrowTb.idCamaActual);
                    $('#cboServicioEsperaTransferencia').val(Variables.IdServicioActual);
                    $("#EstanciaServicioActual").hide();
                } else {
                    await Transferencias.ListarCamas(objrowTb.idServicioActual);
                    $('#cboServicioActualTransferencia').val(Variables.IdServicioActual);
                    $("#EstanciaServicioPorRecepcionar").hide();
                }
            } else {
                if (objrowTb.llegoAlServicio == 0) {
                    await Transferencias.ListarCamasEspera(objrowTb.idServicioActual, objrowTb.idPaciente, objrowTb.idCamaActual);
                    $('#cboServicioEsperaTransferencia').val(Variables.IdServicioActual);
                    $("#EstanciaServicioActual").hide();
                    if ($('#cboCamaEsperaTransferencia option').length > 0) {
                        $("#CamasEspera").show();
                    } else {
                        $("#CamasEspera").hide();
                    }
                } else {
                    await Transferencias.ListarCamas(objrowTb.idServicioActual);
                    $('#cboServicioActualTransferencia').val(Variables.IdServicioActual);
                    $("#EstanciaServicioPorRecepcionar").hide();
                    $("#CamasActual").hide();
                    $("#btnGuardarCamaActualTransferencia").hide();
                }
                
            }   
        } else if (Transferencias.tipoServicio == 'HOSP' || Transferencias.tipoServicio == 'UCI') {
            if (objrowTb.llegoAlServicio == 0) {
                await Transferencias.ListarCamasEspera(objrowTb.idServicioActual, objrowTb.idPaciente, objrowTb.idCamaActual);
                $('#cboServicioEsperaTransferencia').val(Variables.IdServicioActual);
                $("#EstanciaServicioActual").hide();
            } else {
                await Transferencias.ListarCamas(objrowTb.idServicioActual);
                $('#cboServicioActualTransferencia').val(Variables.IdServicioActual);
                $("#EstanciaServicioPorRecepcionar").hide();
            }                
        }

            
        
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#modalTransferenciasConfirmacion").modal("show");
    },

    async CargarTransferenciaConfirmacion(datos) {
        Transferencias.idEstanciaHospitalariaActual = datos.idEstanciaHospitalariaActual;
        Transferencias.ListarCamasEspera(datos.idServicioActual, datos.idPaciente, datos.idCamaActual);
        $("#modalTransferenciasConfirmacion").modal("show"); 
    },

    async ModificarTransferencia () {        
        //if ($("#cboServicioActualTransferencia").val() <= 0) {
        //    alerta2('info', '', 'Seleccione el Servicio actual');
        //    return false;
        //}
        if ($("#cboMedicoOrdenaTransferencia").val() <= 0) {
            alerta2('info', '', 'Seleccione el Médico ordena.');
            return false;
        }
        if ($("#cboServicioRecibeTransferencia").val()  <= 0) {
            alerta2('info', '', 'Seleccione el Servicio recibe.');
            return false;
        }
        if ($("#cboMedicoRecibeTransferencia").val()  <= 0) {
            alerta2('info', '', 'Seleccione el Médico recibe.');
            return false;
        }
        if (isEmpty($("#txtFechaRecepcionTransferencia").val())) {
            alerta2('info', '', 'Seleccione la Fecha de transferencia.');
            return false;
        }
        if (isEmpty($("#txtHoraRecepcionTransferencia").val())) {
            alerta2('info', '', 'Seleccione la Hora de transferencia.');
            return false;
        }
        if (Transferencias.tieneCama) {
            if ($("#cboCamaDestinoTransferencia").val() <= 0) {
                if (Transferencias.tipoServicio == 'EMER') {
                    alerta2('info', '', 'Seleccione una Cama destino DISPONIBLE.');
                    return false;
                }                
            }
        }

        Cargando(1);
        const transf = await Transferencias.GuardarTransferencias();
        if (transf) {
            Transferencias.CerrarModalTransferencias();
            if (Transferencias.tipoServicio == 'EMER') {                
                AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
                ReposicionarVista();
            }
            if (Transferencias.tipoServicio == 'HOSP') {
                AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
                ReposicionarVista();
            }
            if (Transferencias.tipoServicio == 'UCI') {
                EvaluacionesUCI.ListarAtenciones();
                ReposicionarVista();
            }
        }
        Cargando(0);
        
    },

    async ModificarCamaActual() {
        var idCama = $('#cboCamaActualTransferencia').val();
        if (idCama > 0) {
            const resp = await Transferencias.GuardarCamaActualPaciente(Variables.IdEstanciaHospitalariaActual, idCama);
            if (resp) {
                //AdmisionEmergencia.ListarAtenciones();
                //$("#modalTransferencias").modal("hide");
                if (Transferencias.tipoServicio == 'EMER') {
                    AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
                }
                if (Transferencias.tipoServicio == 'HOSP') {
                    AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
                }
                if (Transferencias.tipoServicio == 'UCI') {
                    EvaluacionesUCI.ListarAtenciones();
                }
                Transferencias.CerrarModalTransferenciasConfirmacion();
                ReposicionarVista();
            }
        } else {
            alerta2('warning', '', 'Seleccione una cama DISPONIBLE.');
        }        
    },
        
    CerrarModalTransferencias() {
        Transferencias.LimpiarModalTransferencias();
        $("#modalTransferencias").modal("hide");
    },

    CerrarModalTransferenciasConfirmacion() {
        Transferencias.idEstanciaHospitalariaActual = 0;
        $("#cboServicioActualTransferencia").val(0);
        $("#cboCamaActualTransferencia").val(0);

        $('#cboServicioEsperaTransferencia').val(0);
        $('#cboCamaEsperaTransferencia').val(0);
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#modalTransferenciasConfirmacion").modal("hide");
    },

    LimpiarModalTransferencias() {
        oTable_transferencias.fnClearTable();
        $('#cboMedicoOrdenaTransferencia').val(0);
        $('#cboMedicoRecibeTransferencia').val(0);
        $('#cboServicioRecibeTransferencia').val(0);
        $('.chzn-select').chosen().trigger("chosen:updated");
        Variables.Limpiar();
    },

    async GuardarCamaActualPaciente(idEstanciaHosp, idCama) {
        let resp = false;
        let datos;
        oTable_transferencias.fnClearTable();
        var midata = new FormData();

        midata.append('idEstanciaHosp', idEstanciaHosp);
        midata.append('idCama', idCama);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ModificarCamaEstanciaHospitalaria?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.estado) {  
                resp = true;
                alerta2('success', '', 'La cama del paciente se guardó correctamente.');
                
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

    async ConfirmarLlegadaAlServicio(idEstanciaHosp, idCama) {
        let resp = false;
        let datos;
        oTable_transferencias.fnClearTable();
        var midata = new FormData();

        midata.append('idEstanciaHosp', idEstanciaHosp);        
        midata.append('idCama', idCama);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ModificarEstanciaHospitalariaLlegada?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.estado) {
                resp = true;
                alerta2('success', '', 'Se confirmó la llegada del paciente al servicio.');
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

    async ListarTransferencias() {
        
        let datos;
        oTable_transferencias.fnClearTable();
        var midata = new FormData();
        
        midata.append('idAtencion', Variables.IdAtencion);        
        midata.append('secuenciaMayorA', 1);

        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/Utilitario/EstanciaHospitalariaSeleccionarPorAtencion?area=Comun",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            Cargando(0);
            if (datos.lsTransferencias.table.length > 0) {
                oTable_transferencias.fnAddData(datos.lsTransferencias.table);
            }
        } catch (error) {
            alerta(3, error);
        }
                
    },

    async ListarMedicos() {
        var midata = new FormData();
        let datos;
        midata.append('idEspecialidad', Transferencias.idEspecialidad);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarMedicosPorFiltro?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboMedicoOrdenaTransferencia').empty();
                $('#cboMedicoRecibeTransferencia').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboMedicoOrdenaTransferencia').append('<option value="' + obj.idMedico + '">' + obj.apellidoPaterno + ' ' + obj.apellidoMaterno + ' ' + obj.nombres + '</option>');
                    $('#cboMedicoRecibeTransferencia').append('<option value="' + obj.idMedico + '">' + obj.apellidoPaterno + ' ' + obj.apellidoMaterno + ' ' + obj.nombres + '</option>');
                });
                $('#cboMedicoOrdenaTransferencia').val(0);
                $('#cboMedicoRecibeTransferencia').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarServicios(tipoServicio) {
        var midata = new FormData();
        let datos;

        if (tipoServicio == "EMER") {
            filtro = ' (2,4) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre';
        } else if (tipoServicio = "HOSP") {
            filtro = ' (3) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre';
        }

        midata.append('filtro', filtro);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AdmisionEmergencia/DevuelveServiciosDelHospitalFiltro?area=Emergencia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboServicioRecibeTransferencia').empty();
                $('#cboServicioActualTransferencia').empty();
                $('#cboServicioEsperaTransferencia').empty();
                $(datos.lsServicios.table).each(function (i, obj) {
                    $('#cboServicioRecibeTransferencia').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                    $('#cboServicioActualTransferencia').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                    $('#cboServicioEsperaTransferencia').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });
                $('#cboServicioRecibeTransferencia').val(0);
                $('#cboServicioActualTransferencia').val(0);
                $('#cboServicioEsperaTransferencia').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarCamas(idServicio) {
        var midata = new FormData();
        let datos;
        var isDisabled;
                
        midata.append('idServicio', idServicio);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarCamasPorServicio?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboCamaActualTransferencia').empty();                
                $(datos.lsResultado.table).each(function (i, obj) {
                    if (obj.idPaciente != Variables.IdPaciente) {
                        if (obj.idCama == -1) {
                            isDisabled = 'disabled'
                        }
                        $('#cboCamaActualTransferencia').append('<option ' + isDisabled + ' value="' + obj.idCama + '">' + obj.paciente + '</option>');
                    } else {
                        $('#cboCamaActualTransferencia').append('<option ' + isDisabled + ' value="' + Variables.IdCamaActual + '">' + obj.paciente + '</option>');
                    }
                    
                    isDisabled = '';
                });
                $('#cboCamaActualTransferencia').val(Variables.IdCamaActual);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarCamasEspera(idServicio, idPaciente, idCama) {
        var midata = new FormData();
        let datos;
        var isDisabled;

        midata.append('idServicio', idServicio);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarCamasPorServicio?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {                
                $('#cboCamaEsperaTransferencia').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    if (obj.idPaciente != idPaciente) {
                        if (obj.idCama == -1) {
                            isDisabled = 'disabled'
                        }
                        $('#cboCamaEsperaTransferencia').append('<option ' + isDisabled + ' value="' + obj.idCama + '">' + obj.paciente + '</option>');
                    } else {
                        $('#cboCamaEsperaTransferencia').append('<option ' + isDisabled + ' value="' + idCama + '">' + obj.paciente + '</option>');                        
                    }                                       
                    isDisabled = '';
                });
                $('#cboCamaEsperaTransferencia').val(idCama);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarCamasDestinos(idServicio) {
        var midata = new FormData();
        let datos;
        var isDisabled;

        midata.append('idServicio', idServicio);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarCamasPorServicio?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboCamaDestinoTransferencia').empty();
                //console.log(datos);
                //console.log(datos.lsResultado.length);
                if (datos.lsResultado.table.length > 0) {
                    Transferencias.tieneCama = true;
                    $('#CamasDestino').show();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        if (obj.idCama == -1) {
                            isDisabled = 'disabled'
                        }
                        $('#cboCamaDestinoTransferencia').append('<option ' + isDisabled + ' value="' + obj.idCama + '">' + obj.paciente + '</option>');
                        isDisabled = '';
                    });
                    $('#cboCamaDestinoTransferencia').val(0);
                } else {
                    Transferencias.tieneCama = false;
                    $('#CamasDestino').hide();
                }
               
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async GuardarTransferencias() {
        //Cargando(1);
        var respuesta;
        var resp = false;
        let datos;
        var formData = new FormData();

        formData.append('idAtencion', Variables.IdAtencion);
        formData.append('idPaciente', Variables.IdPaciente);
        formData.append('idMedicoOrden', $('#cboMedicoOrdenaTransferencia').val());
        formData.append('idMedicoRecibe', $('#cboMedicoRecibeTransferencia').val());
        formData.append('fecha', $('#txtFechaRecepcionTransferencia').val());
        formData.append('hora', $('#txtHoraRecepcionTransferencia').val());
        formData.append('idCama', $('#cboCamaDestinoTransferencia').val());
        formData.append('idServicio', $('#cboServicioRecibeTransferencia').val());
        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/GuardarTransferencias?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    alerta2('success', '', 'La transferencia se guardó correctamente.');

                } else {
                    alerta(2, datos.msj)
                    Cargando(0)
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2('danger', '', error);
        }

        //return datos;
        return resp;
    },

    /// <summary>
    /// DATATABLES
    /// </summary>
    /// INICIALIZA DATA TABLE DE TRANSFERENCIAS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    initDatables() {
        var parms = {
            scrollY: "250px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaOcupacion));
                    }
                },              
                {
                    width: '10%',
                    targets: 1,
                    data: 'horaOcupacion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')                        
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "codigoCama",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: 'nombreServicio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')                        
                    }
                },
                {
                    width: '25%',
                    targets: 4,
                    data: "nombreMedicoOrigen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },       
                {
                    width: '25%',
                    targets: 5,
                    data: "nombreMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },  

            ]

        }

        var tableWrapper = $('#tblTransferencias'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_transferencias = $("#tblTransferencias").dataTable(parms);


    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}


$(document).ready(function () {
    Transferencias.cargaInicial();
});