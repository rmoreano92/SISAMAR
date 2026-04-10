var Turnos = {
    idTurno: 0,
    
    Iniciar() {
        Turnos.plugins();
        Turnos.DataTableTurnos();        
        Turnos.Eventos();
        Turnos.ListarTiposServiciosAsistenciales();
        Turnos.ListarRefConTurnosUPS();
        //Camas.TiposCamaSeleccionarTodos();
        //Camas.EstadosCamaSeleccionarTodos();
        //Camas.TiposCondicionOcupacionSeleccionarTodos();

    },

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect,#select2_sample").chosen();

        //$('#txtFechaIngreso,#txtFechaSalida').datepicker({ 
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom"
        //});

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");
    },

    //////////////////////////////////INICIALIZA DATATABLE///////////////////////////////////
    DataTableTurnos() {
        var parms = {
            "paging": false,            
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            order: [[0, 'asc']],
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '45%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "tipoTurno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "horaFin",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                
            ]

        }

        var tableWrapper = $('#tblTurnos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Turnos = $("#tblTurnos").dataTable(parms);
    },
        

    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO//////////////////////////
    Eventos() {
        $('#btnBuscarTurnos').on('click', async function () {
            await Turnos.ListarTurnos();
        });

        $('#btnLimpiarTurnos').on('click', async function () {
            $("#txtFiltroNombre").val("");
        });
        
        $('#tblTurnos tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Turnos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarTurno').on('click', function () {
            
            Turnos.idTurno = 0;            
            Turnos.DesbloquearCampos();
            Turnos.LimpiarRegistroTurno();

            $("#modalRegistroTurno").modal("show");
        });

        $('#btnModificarTurno').on('click', async function () {
            let objrowTb = oTable_Turnos.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await Turnos.CargarDatosTurno(objrowTb);
            Turnos.DesbloquearCampos();
                        
            $('.chzn-select').chosen().trigger("chosen:updated");

            $("#modalRegistroTurno").modal("show");
        });

        $('#btnConsultarTurno').on('click', async function () {
            var objrowTb = oTable_Turnos.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await Turnos.CargarDatosTurno(objrowTb);
            Turnos.BloquearCampos();

            $("#modalRegistroTurno").modal("show");
        });

        $('#btnEliminarTurno').on('click', function () {
            var objrowTb = oTable_Turnos.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }
                        
            swal({
                title: 'Eliminar',
                text: 'Esta seguro que desea eliminar el turno <span style="font-weight: 600;">' + objrowTb.descripcion + '</span>',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#EF6F6C',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then(async function () {
                
                Turnos.EliminarTurno(objrowTb.idTurno);

                //console.log(res.estancias);
            }).catch(swal.noop);
            //$("#modalRegistroCama").modal("show");
        });
                
        $('#btnGuardarTurno').on('click', async function () {
            if (Turnos.ValidarDatosObligatorios()) {
                await Turnos.GuardarTurno();
            }
        });

        $('#btnCerrarTurno').on('click', async function () {
            Turnos.LimpiarRegistroTurno();
            await Turnos.ListarTurnos();
            $("#modalRegistroTurno").modal("hide");
        });

    },


    ///////////////////////////METODOS Y FUNCIONES////////////////////////////////////////
    async CargarDatosTurno(obj) {
        const objTurno = await Turnos.TurnoSeleccionarPorId(obj.idTurno);

        Turnos.idTurno = objTurno.idTurno;
        
        $("#txtCodigo").val(objTurno.codigo);
        $("#txtDescripcion").val(objTurno.descripcion);
        $("#txtHoraInico").val(objTurno.horaInicio);
        $("#txtHoraFin").val(objTurno.horaFin);
        $("#cboTipoServicio").val(objTurno.idTipoServicio);
        $("#cboTipoTurno").val(objTurno.idTipoTurnoRef);
                
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    ValidarDatosObligatorios() {
        if (isEmpty($("#txtCodigo").val())) {
            alerta2('info', '', 'Ingrese el código.');
            return false;
        }

        if (isEmpty($("#txtDescripcion").val())) {
            alerta2('info', '', 'Ingrese la descripción.');
            return false;
        }

        if (isEmpty($("#txtHoraInico").val())) {
            alerta2('info', '', 'Ingrese la hora inicio.');
            return false;
        }

        if (isEmpty($("#txtHoraFin").val())) {
            alerta2('info', '', 'Ingrese la hora final.');
            return false;
        }

        if (isEmpty($("#cboTipoServicio").val())) {
            alerta2('info', '', 'Seleccione el tipo de servicio.');
            return false;
        }

        if (isEmpty($("#cboTipoTurno").val())) {
            alerta2('info', '', 'Seleccione el tipo de turno refer.');
            return false;
        }
                
        return true;
    },

    LimpiarRegistroTurno() {
        Turnos.idTurno = 0;
        $(".campo").val('');
        //oTable_Turnos.fnClearTable();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearCampos() {
        $(".campo").attr('disabled', 'disabled');
        $("#btnGuardarTurno").hide();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCampos() {
        $(".campo").removeAttr("disabled");        
        $("#btnGuardarTurno").show();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },


    ///////////////////////////METODOS QUE CONSULTA BD///////////////////////////////////
    async ListarTiposServiciosAsistenciales() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
               
        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/ListarTiposServiciosAsistenciales?area=Comun",
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
                    $('#cboTipoServicio').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoServicio').append('<option value="' + obj.idTipoServicio + '">' + obj.descripcion + '</option>');                        
                    });
                    $('#cboTipoServicio').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', '', error.toString());
            return false;
        }

        return true;
    },

    async ListarRefConTurnosUPS() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/ListarRefConTurnosUPS?area=Comun",
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
                    $('#cboTipoTurno').empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboTipoTurno').append('<option value="' + obj.idTurno + '">' + obj.turno + '</option>');
                    });
                    $('#cboTipoTurno').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', '', error.toString());
            return false;
        }

        return true;
    },

    async ListarTurnos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('nombre', $("#txtFiltroNombre").val());

        Cargando(1)
        oTable_Turnos.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/ListarTurnos?area=ProgramacionGeneral",
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
                    oTable_Turnos.fnAddData(datos.lsResultado.table);
                }
            }
            else {
                location.reload();
            }
            oTable_Turnos.resize();
        } catch (error) {
            Cargando(0);
            alerta2('danger', '', error.toString());
            return false;
        }

        return true;
    },
            
    async TurnoSeleccionarPorId(idTurno) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTurno', idTurno);

        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/TurnosSeleccionarPorId?area=ProgramacionGeneral",
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
            alerta2('danger', '', error.toString());
            return false;
        }

        return respuesta;
    },

          
    async GuardarTurno() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();
               
        data.append('IdTurno', Turnos.idTurno);
        data.append('Codigo', $("#txtCodigo").val());
        data.append('Descripcion', $("#txtDescripcion").val());
        data.append('HoraInicio', $("#txtHoraInico").val());
        data.append('HoraFin', $("#txtHoraFin").val());
        data.append('IdTipoServicio', $("#cboTipoServicio").val());
        data.append('IdTipoTurno', $("#cboTipoTurno").val());
               

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/TurnosModificar?area=ProgramacionGeneral",
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
                        Turnos.LimpiarRegistroTurno();
                        Turnos.ListarTurnos();
                        $("#modalRegistroTurno").modal("hide");
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

    async EliminarTurno(idTurno) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTurno', idTurno);

        Cargando(1)

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/TurnosEliminar?area=ProgramacionGeneral",
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
                        Turnos.LimpiarRegistroTurno();
                        Turnos.ListarTurnos();
                        $("#modalRegistroTurno").modal("hide");
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

}


$(document).ready(function () {
    Turnos.Iniciar();
});