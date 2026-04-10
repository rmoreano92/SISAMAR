var ReprogramacionMedica = {

    IdCuentaAtencion: 0,
    IdTipoServicio: 0,
    IdEspecialidad: 0,
    IdProgramacionMedica: 0,
    Fecha: '',
    HoraInicio: '',
    HoraFin: '',

    Iniciar() {
        ReprogramacionMedica.Plugins();
        ReprogramacionMedica.Eventos();
    },

    async Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaActualReprogMed, #txtFechaNuevaReprogMed').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });


        let fechaActual = await Utilitario.FechaHoraServidor();
        $("#txtFechaActualReprogMed, #txtFechaNuevaReprogMed, #txtFechaNuevaReemplazaReprogMed").datepicker('setStartDate', fechaActual.substring(0, 10));

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtFechaActualReprogMed, #txtFechaNuevaReprogMed, #txtFechaNuevaReemplazaReprogMed").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicioActualReprogMed").mask("Hn:Nn");
        $("#txtHoraFinActualReprogMed").mask("Hn:Nn");
    },

    Eventos() {
        
        $('#btnHerrReprogramacionMedica').on('click', function () {
            ReprogramacionMedica.LimpiarCampos();
            $('#btnHerrReprogramacionMedica').focus();
            $("#modalReprogramacionMedica").modal("show");
        });

        $('#btnCerrarHerrReprogramacionMedica').on('click', function () {
            ReprogramacionMedica.LimpiarCampos();
            $("#modalReprogramacionMedica").modal("hide");
        });
        

        $('#txtFechaActualReprogMed').on('change', async function () {
            $('#cboServicioActualReprogMed').val("");
            $('#txtMedicoActualReprogMed').val("");
            $('#txtFechaNuevaReemplazaReprogMed').val("");
            $('#cboMedicoNuevoReemplazaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

            let fecha = $("#txtFechaActualReprogMed").val();
            if (esFormatoFecha(fecha) == true) {
                await ReprogramacionMedica.ListarProgramacionMedicaPorFecha(fecha);
            }
        });


        $('#cboServicioActualReprogMed').on('change', async function () {
            $('#txtMedicoActualReprogMed').val("");
            $('#txtFechaNuevaReemplazaReprogMed').val("");
            $('#cboMedicoNuevoReemplazaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
                        
            let idProgramacion = $("#cboServicioActualReprogMed").val();
            if (isEmpty(idProgramacion) || idProgramacion == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo sericio al cual se reprogramara..");
                return;
            }

            let medico = $('#cboServicioActualReprogMed option:selected').data('medico');
            let horaInicio = $('#cboServicioActualReprogMed option:selected').data('horainicio');
            let horaFin = $('#cboServicioActualReprogMed option:selected').data('horafin');
            $("#txtMedicoActualReprogMed").val(medico);
            $("#txtHoraInicioActualReprogMed").val(horaInicio);
            $("#txtHoraFinActualReprogMed").val(horaFin);

            let idEspecialidad = $('#cboServicioActualReprogMed option:selected').data('idespecialidad');
            if (isEmpty(idEspecialidad)) {
                alerta2("info", "", "Por favor seleccione el sericio que reprogramara.");
                return;
            }

            await ReprogramacionMedica.ListarMedicoPorEspecialidad(idEspecialidad);

            //await ReprogramacionMedica.ListarProgramacionMedicaCuposDisponibles(idProgramacion);

        });

        $('#rdbTipoReprogMedFecha').on('click', function () {
            $("#txtFechaNuevaReemplazaReprogMed").removeAttr("disabled");
            $("#cboMedicoNuevoReemplazaReprogMed").attr("disabled", true);
            $("#txtFechaNuevaReemplazaReprogMed").val("");
            $("#cboMedicoNuevoReemplazaReprogMed").val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#rdbTipoReprogMedMedico').on('click', async function () {
            $("#cboMedicoNuevoReemplazaReprogMed").removeAttr("disabled");
            $("#txtFechaNuevaReemplazaReprogMed").attr("disabled", true);  
            $("#txtFechaNuevaReemplazaReprogMed").val("");
            $("#cboMedicoNuevoReemplazaReprogMed").val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

            let idEspecialidad = $('#cboServicioActualReprogMed option:selected').data('idespecialidad');
            if (isEmpty(idEspecialidad)) {
                alerta2("info", "", "Por favor seleccione el sericio que reprogramara.");
                return;
            }

            await ReprogramacionMedica.ListarMedicoPorEspecialidad(idEspecialidad);

        });

        $('#btnReprogramarPorServicio').on('click', async function () {
            if (isEmpty($("#txtFechaActualReprogMed").val()) == true) {
                alerta2("info", "", "Por favor ingrese la fecha del servicio que se reprogramara.")
                return;
            }

            if (isEmpty($("#cboServicioActualReprogMed").val()) == true) {
                alerta2("info", "", "Por favor seleccione el servicio que se reprogramara.")
                return;
            }

            if (isEmpty($("#txtHoraInicioActualReprogMed").val()) == true) {
                alerta2("info", "", "Por favor ingrese la hora desde que se reprogramara.")
                return;
            }

            if (isEmpty($("#txtHoraFinActualReprogMed").val()) == true) {
                alerta2("info", "", "Por favor ingrese la hora hasta que se reprogramara.")
                return;
            }

            if ($("#rdbTipoReprogMedFecha").is(':checked') == false && $("#rdbTipoReprogMedMedico").is(':checked') == false) {
                alerta2("info", "", "Por favor seleccione como reprogramara el paciente, si por fecha o médico.")
                return;
            }

            if ($("#rdbTipoReprogMedFecha").is(':checked') == true) {
                if (isEmpty($("#txtFechaNuevaReemplazaReprogMed").val()) == true) {
                    alerta2("info", "", "Por favor ingrese la fecha nueva a la que se reprogramara.")
                    return;
                }
            }

            if ($("#rdbTipoReprogMedMedico").is(':checked') == true) {
                if (isEmpty($("#cboMedicoNuevoReemplazaReprogMed").val()) == true) {
                    alerta2("info", "", "Por favor seleccione el médico que reemplaza.")
                    return;
                }
            }

            await ReprogramacionMedica.GuardarReprogramacionMedicaPorServicio();
        });





        $('#txtNroCuentaReprogMed').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroCuentaReprogMed").blur();
                let nroCuenta = $('#txtNroCuentaReprogMed').val();
                ReprogramacionMedica.LimpiarCampos();
                await ReprogramacionMedica.BuscarNumeroCuenta(nroCuenta);
            }
        });

        $('#txtFechaNuevaReprogMed').on('change', async function () {
            $('#cboServicioNuevoReprogMed').val("");
            $('#txtMedicoNuevoReprogMed').val("");
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
            
            let fecha = $("#txtFechaNuevaReprogMed").val();
            if (esFormatoFecha(fecha) == true) {
                await ReprogramacionMedica.ListarServiciosPorFechaEspecialidad(fecha);
            }
        });

        $('#cboServicioNuevoReprogMed').on('change', async function () {
            $('#txtMedicoNuevoReprogMed').val("");
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

            if (ReprogramacionMedica.IdCuentaAtencion == 0) {
                alerta2("info", "", "Por favor ingrese el número de cuenta de la cita que desea reprogramar.");
                return;
            }

            let idProgramacion = $("#cboServicioNuevoReprogMed").val();
            if (isEmpty(idProgramacion) || idProgramacion == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo sericio al cual se reprogramara.");
                return;
            }
                    
            let medico = $('#cboServicioNuevoReprogMed option:selected').data('medico');
            $("#txtMedicoNuevoReprogMed").val(medico);
            
            await ReprogramacionMedica.ListarProgramacionMedicaCuposDisponibles(idProgramacion);

        });

        $('#btnReprogramarPorPaciente').on('click', async function () {

            if (ReprogramacionMedica.IdCuentaAtencion == 0) {
                $('#txtFechaNuevaReprogMed').val("");
                alerta2("info", "", "Por favor ingrese el número de cuenta de la cita que desea reprogramar.");
                return;
            }

            let idProgramacion = $("#cboServicioNuevoReprogMed").val();
            if (isEmpty(idProgramacion) || idProgramacion == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo sericio al cual se reprogramara.");
                return;
            }

            await ReprogramacionMedica.GuardarReprogramacionMedicaPorPaciente();
        });

    },

    /*------------BUSQUEDA DE CUENTAS----------------------------------*/
    async BuscarNumeroCuenta(idCuentaAtencion) {

        let datos = await Utilitario.AtencionesSelecionarPorCuenta(idCuentaAtencion);

        if (isEmpty(datos)) {
            alerta2("info", "", "La cuenta ingresada no existe.");
            return;
        }

        if (datos.idEstadoAtencion != 1) {
            alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA.");
            return;
        }

        if (datos.idTipoServicio != 1) {
            alerta2("info", "", "La cuenta no pertenece a Consultorios Externos.");
            return;
        }

        //if (datos.idTipoServicio != 1) {
        //    if (datos.idTipoFinanciamiento == 1) {
        //        alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
        //        return;
        //    }
        //}

        ReprogramacionMedica.IdCuentaAtencion = datos.idCuentaAtencion;
        ReprogramacionMedica.IdTipoServicio = datos.idTipoServicio;
        ReprogramacionMedica.IdEspecialidad = datos.idEspecialidad;
        $('#txtNroCuentaReprogMed').val(datos.idCuentaAtencion);
        $('#txtNroHistoriaReprogMed').val(datos.nroHistoriaClinica);
        $('#txtPacienteReprogMed').val(isNull(datos.apellidoPaterno, '') + ' ' + isNull(datos.apellidoMaterno, '') + ' ' + isNull(datos.nombres, ''));
        $('#txtFechaAtencionReprogMed').val(datos.fechaIngreso);
        $('#txtServicioReprogMed').val(datos.servicio);
        $('#txtMedicoReprogMed').val(datos.medico);
        $('#txtPlanReprogMed').val(datos.planA);
        //$('#cboMovSexo').val(datos.idTipoSexo);

        

        $('.chzn-select').chosen().trigger("chosen:updated");

        console.log(datos);

    },


    async ListarServiciosPorFechaEspecialidad(fecha) {
        let resp = null;
        let datos
        let data = new FormData();
                
        data.append('idTipoServicio', ReprogramacionMedica.IdTipoServicio);
        data.append('idEspecialidad', ReprogramacionMedica.IdEspecialidad);
        data.append('activaProcedimiento', 0);
        data.append('fecha', fecha);

        try {           
            $('#cboServicioNuevoReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarServiciosPorFechaEspecialidad?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;                        
            $(resp.table).each(function (i, obj) {
                $('#cboServicioNuevoReprogMed').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + '</option>');
            });
            $('#cboServicioNuevoReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async ListarProgramacionMedicaCuposDisponibles(idProgramacion) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idProgramacion', idProgramacion);

        try {
            $('#cboHoraNuevaReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarProgramacionMedicaCuposDisponibles?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboHoraNuevaReprogMed').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
            });
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async GuardarReprogramacionMedicaPorPaciente() {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idCuenta', ReprogramacionMedica.IdCuentaAtencion);
        data.append('idProgramacion', $("#cboServicioNuevoReprogMed").val());
        data.append('horaInicio', $('#cboHoraNuevaReprogMed option:selected').data('horainicio'));
        data.append('horaFin', $('#cboHoraNuevaReprogMed option:selected').data('horafin'));

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/GuardarReprogramacionMedicaPorPaciente?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);            

            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];

                if (resp.exito == 1) {
                    alerta2("success", "", resp.mensaje);
                    ReprogramacionMedica.LimpiarCampos();
                } else {
                    alerta2("warning", "", resp.mensaje);
                }
            }


        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },





    async ListarProgramacionMedicaPorFecha(fecha) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('fecha', fecha);

        try {
            $('#cboServicioActualReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarProgramacionMedicaPorFecha?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboServicioActualReprogMed').append('<option data-idEspecialidad="' + obj.idEspecialidad + '" data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.servicio + ' (' + obj.codigoTurno + ')' + '</option>');
            });
            $('#cboServicioActualReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async ListarMedicoPorEspecialidad(idEspecialidad) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idEspecialidad', idEspecialidad);

        try {
            $('#cboMedicoNuevoReemplazaReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarMedicosPorEspecialidad?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboMedicoNuevoReemplazaReprogMed').append('<option value="' + obj.idMedico + '">' + obj.medico + '</option>');
            });
            $('#cboMedicoNuevoReemplazaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async GuardarReprogramacionMedicaPorServicio() {
        let resp = null;
        let datos
        let data = new FormData();
                
        data.append('idProgramacion', $("#cboServicioActualReprogMed").val());
        data.append('horaInicio', $("#txtHoraInicioActualReprogMed").val());
        data.append('horaFin', $("#txtHoraFinActualReprogMed").val());

        data.append('tipoReprogramacion', ($("#rdbTipoReprogMedFecha").is(':checked')) ? 1 : (($("#rdbTipoReprogMedMedico").is(':checked') ? 2 : 0)));
        data.append('fechaNueva', $("#txtFechaNuevaReemplazaReprogMed").val());
        data.append('idMedicoNuevo', $("#cboMedicoNuevoReemplazaReprogMed").val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/GuardarReprogramacionMedicaPorServicio?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];

                if (resp.exito == 1) {
                    alerta2("success", "", resp.mensaje);
                    ReprogramacionMedica.LimpiarCampos();
                } else {
                    alerta2("warning", "", resp.mensaje);
                }
            }


        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },
       

    LimpiarCampos() {
        ReprogramacionMedica.IdCuentaAtencion = 0;
        ReprogramacionMedica.IdTipoServicio = 0;
        ReprogramacionMedica.IdEspecialidad = 0;
        ReprogramacionMedica.IdProgramacionMedica = 0;
        ReprogramacionMedica.Fecha = '';
        ReprogramacionMedica.HoraInicio = '';
        ReprogramacionMedica.HoraFin = '';
        $(".campoReprogMed").val("");
        $("select.campoReprogMed").empty();
        $('input:radio[name=rdbTipoReprogMed]').prop("checked", false);
        $("#txtFechaNuevaReemplazaReprogMed").attr("disabled", true);
        $("#cboMedicoNuevoReemplazaReprogMed").attr("disabled", true);
        //$('#cboServicioNuevoReprogMed').empty();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

}


$(document).ready(function () {
    ReprogramacionMedica.Iniciar();
});