var infoFecha = null;
var ProgramacionMedicaSop = {
    idProgramacionMedicaSop: 0,
    fechaInicioSeleccionada: '',
    fechaFinSeleccionada: '',

    async Iniciar() {
        //$(".chzn-select").addClass("chzn-select-deselect");
        //$(".chzn-select").removeClass("chzn-select");
        //$(".chzn-select-deselect").append("<option value=''></option>")

        ProgramacionMedicaSop.plugins();
        ProgramacionMedicaSop.DataTableMedicos();
        ProgramacionMedicaSop.Eventos();

        await ProgramacionMedicaSop.ListarM_SalaCQx();

        
        
        await ProgramacionMedicaSop.ListarTiposServicios();
        await ProgramacionMedicaSop.ListarTiposProgramacion();

        //Turnos.ListarRefConTurnosUPS();
        //Camas.TiposCamaSeleccionarTodos();
        //Camas.EstadosCamaSeleccionarTodos();
        //Camas.TiposCondicionOcupacionSeleccionarTodos();

    },

    


    

    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO///////////////////////////////////////////////////////////
    Eventos() {
        ///////////////////////// SELECT /////////////////////////
        $('#cboSala').on('change', async () => {
            Cargando(1)
            await ProgramacionMedicaSop.ListarM_QuirofanoCQx($('#cboSala').val())
            Cargando(0)
        })

        ///////////////////////// BUTTONS /////////////////////////
        
















        

        

        

        $('#cboTipoServicioProgramacion').on('change', async function () {
            let idTipoServ = $('#cboTipoServicioProgramacion').val();
            let idMed = $('#txtIdMedicoProgramacion').val();
            if (idMed > 0) {
                await ProgramacionMedicaSop.ListarEspecialidadPorMedico(idMed);
                await ProgramacionMedicaSop.ListarTurnosPorTipoServicio(idTipoServ);
            }
        });

        $('#cboEspecialidadProgramacion').on('change', async function () {
            let idTipoServ = $('#cboTipoServicioProgramacion').val();
            let idEsp = $('#cboEspecialidadProgramacion').val();
            if (idTipoServ > 0 && idEsp > 0) {
                await ProgramacionMedicaSop.ListarServiciosPorEspecialidad(idTipoServ, 0, idEsp, 0);
            }
        });

        $('#cboTurnoProgramacion').on('change', async function () {
            let horaInicio = $('#cboTurnoProgramacion option:selected').attr('data-horaInicio');
            let horaFin = $('#cboTurnoProgramacion option:selected').attr('data-horaFin');
            if (isEmpty(horaInicio) == false && isEmpty(horaFin) == false) {
                $('#txtHoraInicoProgramacion').val(horaInicio);
                $('#txtHoraFinProgramacion').val(horaFin);
            }
        });


        

        

        $('#btnGuardarProgramacion').on('click', async function () {
            if (ProgramacionMedicaSop.ValidarDatosObligatorios()) {
                await ProgramacionMedicaSop.GuardarProgramacionMedica();
            }
        });

        $('#btnCerrarProgramacion').on('click', async function () {
            ProgramacionMedicaSop.LimpiarRegistroProgramacion();
            //await ProgramacionMedica.ListarProgramacionMedica();
            $("#modalRegistroProgramacion").modal("hide");
        });

    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////METODOS QUE CONSULTA BD////////////////////////////////////////////////////////////////////////
    



    

   

    

    

    

    async ListarTiposServicios() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idTipoServicio', idTipoServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboTipoServicioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposServiciosHosp?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoServicioProgramacion').append('<option value="' + obj.idTipoServicio + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTipoServicioProgramacion').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    

    async ListarServiciosPorEspecialidad(idTipoServicio, idDepartamento, idEspecialidad, idServicio) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoServicio', idTipoServicio);
        data.append('idDepartamento', idDepartamento);
        data.append('idEspecialidad', idEspecialidad);
        data.append('idServicio', idServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboConsultorioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Servicios/ListarServicios?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboConsultorioProgramacion').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                    });
                    $('#cboConsultorioProgramacion').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },

    async ListarTiposProgramacion() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idTipoServicio', idTipoServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboTipoProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ProgramacionMedica/ListarTiposProgramacion?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoProgramacion').append('<option value="' + obj.idTipoProgramacion + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTipoProgramacion').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },


    async ProgramacionMedicaSeleccionar(idProgramacion) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idProgramacion', idProgramacion);

        Cargando(1)
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ProgramacionMedicaSopSeleccionar?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    respuesta = datos.lsResultado.table[0];
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },

    async GuardarProgramacionMedica() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdProgramacion', ProgramacionMedicaSop.idProgramacionMedicaSop);
        data.append('IdTipoServicio', $("#cboTipoServicioProgramacion").val());
        data.append('IdEspecialidad', $("#cboEspecialidadProgramacion").val());
        data.append('IdServicio', $("#cboConsultorioProgramacion").val());
        data.append('IdMedico', $("#txtIdMedicoProgramacion").val());
        data.append('FechaInicio', $("#txtFechaInicioProgramacion").val());
        data.append('FechaFinal', $("#txtFechaFinProgramacion").val());
        data.append('IdTipoProgramacion', $("#cboTipoProgramacion").val());
        data.append('IdTurno', $("#cboTurnoProgramacion").val());
        data.append('HoraInicio', $("#txtHoraInicoProgramacion").val());
        data.append('HoraFinal', $("#txtHoraFinProgramacion").val());
        data.append('Descripcion', $("#txtDescripcion").val());
        //data.append('Color', $("#txtColorProgramacion").val());
        data.append('Color', null);

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ProgramacionMedicaSopModificar?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    datos = datos.lsResultado.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        return false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        return false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        ProgramacionMedicaSop.LimpiarRegistroProgramacion();
                        let idMed = $('#cboMedicoProgramacionFiltro').val();
                        let anio = $('#cboAnioCalendario').val();
                        let mes = $('#cboMesCalendario').val();
                        if (idMed > 0 && anio > 0 && mes > 0) {
                            await ProgramacionMedicaSop.ListarProgramacionMedicaMensual(0, 0, 0, 0, idMed, 9, anio, mes);
                        }
                        $("#modalRegistroProgramacion").modal("hide");
                        return true;
                    }
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },


    async EliminarProgramacionMedica(idProgramacion) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdProgramacion', idProgramacion);

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ProgramacionMedicaSopEliminar?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    datos = datos.lsResultado.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        return false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        return false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        ProgramacionMedicaSop.LimpiarRegistroProgramacion();
                        let idMed = $('#cboMedicoProgramacionFiltro').val();
                        let anio = $('#cboAnioCalendario').val();
                        let mes = $('#cboMesCalendario').val();
                        if (idMed > 0 && anio > 0 && mes > 0) {
                            await ProgramacionMedicaSop.ListarProgramacionMedicaMensual(0, 0, 0, 0, idMed, 9, anio, mes);
                        }
                        //$("#modalRegistroProgramacion").modal("hide");
                        return true;
                    }
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return respuesta;
    },


    ///////////////////////////METODOS Y FUNCIONES////////////////////////////////////////
    async CargarDatosProgramacionMedica(obj) {
        const objProg = await ProgramacionMedicaSop.ProgramacionMedicaSeleccionar(obj.idProgramacion);

        ProgramacionMedicaSop.idProgramacionMedicaSop = objProg.idProgramacion;

        $("#cboTipoServicioProgramacion").val(objProg.idTipoServicio);
        await ProgramacionMedicaSop.ListarTurnosPorTipoServicio(objProg.idTipoServicio);
        $("#txtIdMedicoProgramacion").val(objProg.idMedico);
        $("#txtMedicoProgramacion").val(objProg.medico);
        await ProgramacionMedicaSop.ListarEspecialidadPorMedico(objProg.idMedico);
        $("#cboEspecialidadProgramacion").val(objProg.idEspecialidad);
        await ProgramacionMedicaSop.ListarServiciosPorEspecialidad(objProg.idTipoServicio, 0, objProg.idEspecialidad, 0);
        $("#cboConsultorioProgramacion").val(objProg.idServicio);
        $("#txtFechaInicioProgramacion").datepicker("setDate", objProg.fechaP);
        $("#txtFechaFinProgramacion").datepicker("setDate", objProg.fechaP);
        $("#divFechaFinProgramacion").hide();
        $("#cboTipoProgramacion").val(objProg.idTipoProgramacion);
        $("#cboTurnoProgramacion").val(objProg.idTurno);
        $("#txtHoraInicoProgramacion").val(objProg.horaInicio);
        $("#txtHoraFinProgramacion").val(objProg.horaFin);
        $("#txtDescripcionProgramacion").val(objProg.descripcion);
        $("#txtColorProgramacion").val(objProg.color);





        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    ValidarDatosObligatorios() {
        if (isEmpty($("#cboTipoServicioProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Tipo Servicio.');
            return false;
        }

        if (isEmpty($("#txtIdMedicoProgramacion").val()) && isEmpty($("#txtMedicoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Médico.');
            return false;
        }

        if (isEmpty($("#cboEspecialidadProgramacion").val())) {
            alerta2('info', '', 'Seleccione la Especialidad.');
            return false;
        }

        if (isEmpty($("#cboConsultorioProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Consultorio.');
            return false;
        }

        if (isEmpty($("#txtFechaInicioProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Fecha.');
            return false;
        }

        if (isEmpty($("#cboTipoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Tipo de Programación.');
            return false;
        }

        if (isEmpty($("#cboTurnoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Turno.');
            return false;
        }

        if (isEmpty($("#txtHoraInicoProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Hora Inicio.');
            return false;
        }

        if (isEmpty($("#txtHoraFinProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Hora Final.');
            return false;
        }

        let hi = $('#txtHoraInicoProgramacion').val();
        let hf = $('#txtHoraFinProgramacion').val();
        if (hi >= hf) {
            alerta2("info", "", "La hora de final no puede ser igual o menor que la hora de inicio.");
            return;
        }


        return true;
    },

    LimpiarRegistroProgramacion() {
        ProgramacionMedicaSop.idProgramacionMedicaSop = 0;
        ProgramacionMedicaSop.fechaInicioSeleccionada = '';
        ProgramacionMedicaSop.fechaFinSeleccionada = '';
        $(".campo").val('');
        $(".fc-day").removeClass('fc-selected-day');
        oTable_ProgramacionMedica.fnClearTable();
        //oTable_Turnos.fnClearTable();
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}


$(document).ready(function () {
    ProgramacionMedicaSop.Iniciar();
});