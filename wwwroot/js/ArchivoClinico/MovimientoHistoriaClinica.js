var MovimientoHc = {
    idMovimiento: 0,
    idPaciente: 0,

    async Iniciar() {
        MovimientoHc.DataTableBusqueda();
        //MovimientoHc.DataTableServiciosAutorizados();
        await MovimientoHc.Plugins();
        MovimientoHc.Eventos();

        await MovimientoHc.FiltroServicios(' order by Servicios.Nombre ', '#cboServicioOrigenMovHc');
        
    },

    async Plugins() {
        let FechaHora = await Utilitario.FechaHoraServidor();        
        let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $("#txtFechaMovHcBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    ///////////////////////DATATABLE//////////////////////////////////////////////////////////////////////////////
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            //"bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idMovimiento",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombres",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoHistoria",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "historiaClinica",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "corte",
                    width: "4%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    data: "fichaFamiliar",
                //    width: "35%",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    data: "fechaMovimiento",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "origen",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "destino",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dMotivo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    data: "nroFolios",
                //    width: "35%",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "observacion",
                //    width: "35%",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},                
                {
                    data: "usuarioMov",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MovimientoHistorias = $("#tblMovimientoHistorias").dataTable(parms);
    },

   
    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await MovimientoHc.MovimientoHistoriasListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            MovimientoHc.LimpiarCamposBusqueda();
        });

        $('.searchHistoria').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchHistoria").blur();
                $("#btnBuscarDatosPacienteNroHistoria").click();
            }
        });

        $('.searchDocumento').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchDocumento").blur();
                $("#btnBuscarDatosPacienteNroDocumento").click();
            }
        });

        $('#btnBuscarDatosPacienteNroHistoria').on('click', async function () {
            let historia = $("#txtNroHistoriaPaciente").val();
            let resp = await MovimientoHc.BuscarPaciente(historia, "");
            if (!isEmpty(resp)) {
                MovimientoHc.idPaciente = resp.idPaciente;
                $("#txtNroHistoriaPaciente").val(resp.nroHistoriaClinica);
                $("#txtNroDocumentoPaciente").val(resp.nroDocumento);
                $("#txtNombrePaciente").val(resp.nroDocumento.apellidoPaterno + ' ' + resp.nroDocumento.apellidoMaterno + ' ' + isNull(resp.nroDocumento.primerNombre, '') + ' ' + isNull(resp.nroDocumento.segundoNombre, ''));
                $("#cboServicioOrigenMovHc").val(resp.idServicioActualMovimientoHistoriaClinica);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            }
        });

        $('#btnBuscarDatosPacienteNroDocumento').on('click', async function () {
            let documento = $("#txtNroDocumentoPaciente").val();
            let resp = await MovimientoHc.BuscarPaciente("", documento);
            if (!isEmpty(resp)) {
                MovimientoHc.idPaciente = resp.idPaciente;
                $("#txtNroHistoriaPaciente").val(resp.nroHistoriaClinica);
                $("#txtNroDocumentoPaciente").val(resp.nroDocumento);
                $("#txtNombrePaciente").val(resp.apellidoPaterno + ' ' + resp.apellidoMaterno + ' ' + isNull(resp.primerNombre, '') + ' ' + isNull(resp.segundoNombre, ''));
                $("#cboServicioOrigenMovHc").val(resp.idServicioActualMovimientoHistoriaClinica);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            }
        });

        $('#cboResponsableSalidaMovHc_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await MovimientoHc.EmpleadosListar(filtro, '#cboResponsableSalidaMovHc', 1);
        });

        $('#cboResponsableTransporteMovHc_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await MovimientoHc.EmpleadosListar(filtro, '#cboResponsableTransporteMovHc', 1);
        });

        $('#cboResponsableRecepcionMovHc_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await MovimientoHc.EmpleadosListar(filtro, '#cboResponsableRecepcionMovHc', 1);
        });

        $('#tblMovimientoHistorias tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_MovimientoHistorias.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await MovimientoHc.LimpiarCamposRegistro();
            MovimientoHc.DesbloquearRegistro();
            let FechaHora = await Utilitario.FechaHoraServidor();
            let FechaDia = FechaHora.substring(0, 10);
            let HoraDia = FechaHora.substring(11, 16);

            $("#txtFechaMovHc").datepicker("setDate", FechaDia);
            $("#txtHoraMovHc").val(HoraDia);
            $("#modalRegistroMovimientoHistoria").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_MovimientoHistorias.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await MovimientoHc.LimpiarCamposRegistro();
            MovimientoHc.DesbloquearRegistro();
            const resp = await MovimientoHc.CargarDatos(objrowTb.idMovimiento);
            if (resp) {
                $(".reading").attr("disabled", true);
                $("#btnBuscarDatosPacienteNroHistoria").hide();
                $("#btnBuscarDatosPacienteNroDocumento").hide();
                $("#btnGuardarRegistroMovimientoHistoria").hide();
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroMovimientoHistoria").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_MovimientoHistorias.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await MovimientoHc.LimpiarCamposRegistro();
            const resp = await MovimientoHc.CargarDatos(objrowTb.idMovimiento);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                MovimientoHc.BloquearRegistro();
                $("#modalRegistroMovimientoHistoria").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_MovimientoHistorias.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar el movimiento de historia clínica?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 180px;background: lightsteelblue;"><th>Historia</th><th>Paciente</th></tr><tr><td>' + objrowTb.historiaClinica + '</td><td align="left">' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno + ' ' + objrowTb.nombres + '</td></tr></table>',
                type: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function () {
                MovimientoHc.idMovimiento = objrowTb.idMovimiento;
                const resp = await MovimientoHc.MovimientoHistoriaEliminar();
                if (resp) {
                    await MovimientoHc.LimpiarCamposRegistro();
                    await MovimientoHc.MovimientoHistoriasListar();
                }
            }, function (dimiss) {

            });

        });

        $('#btnGuardarRegistroMovimientoHistoria').on('click', async function () {

            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                const resp = await MovimientoHc.MovimientoHistoriaGuardar();
                if (resp) {
                    await MovimientoHc.LimpiarCamposRegistro();
                    MovimientoHc.MovimientoHistoriasListar();
                    $("#modalRegistroMovimientoHistoria").modal("hide");
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarRegistroMovimientoHistoria').on('click', async function () {
            swal({
                title: 'Cerrar',
                text: "¿Esta seguro de cerrar el registro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                await MovimientoHc.LimpiarCamposRegistro();
                $("#modalRegistroMovimientoHistoria").modal("hide");
            }, function (dimiss) {

            });            
        });

        
        //////////////////////////////////////////
        $('#cboMotivoMovHc').on('change', async function () {
            await MovimientoHc.MotivoMovimientoHistoria_Change();
        });

    },

    async MotivoMovimientoHistoria_Change() {
        let idMotivo = $('#cboMotivoMovHc').val();
        let filtro = '';

        $("#frmServicioOrigen").show();
        $("#frmServicioDestino").show();

        if (idMotivo == 1) {
            filtro = ' Where Servicios.idTipoServicio in (1) order by Servicios.Nombre ';
        } else if (idMotivo == 2) {
            filtro = ' Where Servicios.idTipoServicio in (3) order by Servicios.Nombre ';
        } else if (idMotivo == 3) {
            filtro = ' Where Servicios.idTipoServicio in (2) order by Servicios.Nombre ';
        } else if (idMotivo == 9) {
            $("#frmServicioOrigen").hide();
            $("#frmServicioDestino").hide();
            filtro = ' order by Servicios.Nombre ';
        } else {
            filtro = ' order by Servicios.Nombre ';
        }

        await MovimientoHc.FiltroServicios(filtro, '#cboServicioDestinoMovHc');
    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async MovimientoHistoriasListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (isEmpty($("#txtNroHistoriaMovHcBusq").val()) && isEmpty($("#txtApPaternoMovHcBusq").val()) && isEmpty($("#txtApMaternoMovHcBusq").val()) && isEmpty($("#txtNombresMovHcBusq").val()) && isEmpty($("#txtFechaMovHcBusq").val())) {
            alerta2("info", "", "Por favor ingrese algun parametro de busqueda.");
        }

        data.append('historia', $("#txtNroHistoriaMovHcBusq").val());
        data.append('apPaterno', $("#txtApPaternoMovHcBusq").val());
        data.append('apMaterno', $("#txtApMaternoMovHcBusq").val());
        data.append('nombres', $("#txtNombresMovHcBusq").val());
        data.append('fechamov', $("#txtFechaMovHcBusq").val());

        try {
            Cargando(1);
            oTable_MovimientoHistorias.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MovimientoHistorias/MovimientoHistoriasListar?area=ArchivoClinico",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_MovimientoHistorias.fnAddData(datos.respuesta.table);
                oTable_MovimientoHistorias.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async MovimientoHistoriaSeleccionar(idMovimiento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idMovimiento', idMovimiento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MovimientoHistorias/MovimientoHistoriaSeleccionar?area=ArchivoClinico",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async BuscarPaciente(historia, documento) {
        var respuesta;
        var resp = null;
        let datos
        var data = new FormData();

        data.append('nroHistoria', historia);
        data.append('nroDocumento', documento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/PacienteBuscarPorFiltro?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lsPacientes.table.length > 0) {
                resp = datos.lsPacientes.table[0];
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async FiltroServicios(filtro, idHtmlCombo) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $(idHtmlCombo).empty();
        /*$('#cboEmpleadoArchivero').append('<option  value="0">Busque y seleccione un empleado</option>');*/
        $(idHtmlCombo).val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        try {

            midata.append('filtro', filtro);

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MovimientoHistorias/FiltrarServicios?area=Seguridad",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)

            $(datos.respuesta.table).each(function (i, obj) {
                $(idHtmlCombo).append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
            });

            $(idHtmlCombo).val("");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //$('#cboEmpleadoArchivero_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async EmpleadosListar(filtro, idHtmlCombo, activo) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $(idHtmlCombo).empty();
        $(idHtmlCombo).append('<option  value="0">Busque y seleccione un empleado</option>');
        $(idHtmlCombo).val("0");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);
                midata.append('activo', activo);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Empleados/EmpleadosFiltrar?area=Seguridad",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.lstData.table).each(function (i, obj) {
                    $(idHtmlCombo).append('<option value="' + obj.idEmpleado + '">' + obj.empleado + '</option>');
                });

                $(idHtmlCombo).val("0");
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $(idHtmlCombo + '_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async MovimientoHistoriaGuardar() {
        if (MovimientoHc.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('IdMovimiento', MovimientoHc.idMovimiento);
        formData.append('IdPaciente', MovimientoHc.idPaciente);
        formData.append('IdMotivo', $("#cboMotivoMovHc").val());
        formData.append('IdServicioOrigen', $("#cboServicioOrigenMovHc").val());
        formData.append('IdServicioDestino', $("#cboServicioDestinoMovHc").val());
        formData.append('IdEmpleadoArchivo', $("#cboResponsableSalidaMovHc").val());
        formData.append('IdEmpleadoTransporte', $("#cboResponsableTransporteMovHc").val());
        formData.append('IdEmpleadoRecepcion', $("#cboResponsableRecepcionMovHc").val());
        formData.append('Observacion', $("#txtObservacionMovHc").val());
        
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MovimientoHistorias/MovimientoHistoriaGuardar?area=ArchivoClinico",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async MovimientoHistoriaEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idMovimiento', MovimientoHc.idMovimiento);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MovimientoHistorias/MovimientoHistoriaEliminar?area=ArchivoClinico",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idMovimiento) {
        let resp = false;
        let datos = await MovimientoHc.MovimientoHistoriaSeleccionar(idMovimiento);
        if (!isEmpty(datos)) {
            let movimiento = datos.table[0];
            MovimientoHc.idMovimiento = movimiento.idMovimiento;
            MovimientoHc.idPaciente = movimiento.idPaciente;

            $("#txtNroHistoriaPaciente").val(movimiento.nroHistoriaClinica);
            $("#txtNroDocumentoPaciente").val(movimiento.nroDocumento);
            $("#txtNombrePaciente").val(movimiento.paciente);

            $("#cboMotivoMovHc").val(movimiento.idMotivo);
            await MovimientoHc.MotivoMovimientoHistoria_Change();
            $("#cboServicioOrigenMovHc").val(movimiento.idServicioOrigen);
            $("#cboServicioDestinoMovHc").val(movimiento.idServicioDestino);

            await MovimientoHc.EmpleadosListar(movimiento.dniEmpleadoArchivo, '#cboResponsableSalidaMovHc', 0);
            $("#cboResponsableSalidaMovHc").val(movimiento.idEmpleadoArchivo);

            await MovimientoHc.EmpleadosListar(movimiento.dniEmpleadoTransporte, '#cboResponsableTransporteMovHc', 0);
            $("#cboResponsableTransporteMovHc").val(movimiento.idEmpleadoTransporte);

            await MovimientoHc.EmpleadosListar(movimiento.dniEmpleadoRecepcion, '#cboResponsableRecepcionMovHc', 0);
            $("#cboResponsableRecepcionMovHc").val(movimiento.idEmpleadoRecepcion);

            $("#txtFechaMovHc").datepicker("setDate", movimiento.fechaMovimiento);
            $("#txtHoraMovHc").val(movimiento.horaMovimiento);

            $("#txtObservacionMovHc").val(movimiento.observacion);
                        
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            resp = true;
        }

        return resp;
    },

    ValidarDatosObligatoriosRegistro() {

        if (isEmpty(MovimientoHc.idPaciente)) {
            alerta2("info", "", "Por favor seleccione el Paciente.");
            return false;
        }
        
        if (isEmpty($("#cboMotivoMovHc").val())) {
            alerta2("info", "", "Por favor seleccione el MovimientoHc.");
            return false;
        } else {
            if ($("#cboMotivoMovHc").val() != 9) {
                if (isEmpty($("#cboServicioDestinoMovHc").val())) {
                    alerta2("info", "", "Por favor seleccione el Servicio Destino.");
                    return false;
                }
            }
        }

        if (isEmpty($("#cboResponsableSalidaMovHc").val())) {
            alerta2("info", "", "Por favor seleccione el Responsable Salida.");
            return false;
        } 

        if (isEmpty($("#cboResponsableTransporteMovHc").val())) {
            alerta2("info", "", "Por favor seleccione el Responsable Transporte.");
            return false;
        } 

        if (isEmpty($("#cboResponsableRecepcionMovHc").val())) {
            alerta2("info", "", "Por favor seleccione el Responsable Recepción.");
            return false;
        } 
        
        return true;
    },

    async LimpiarCamposRegistro() {
        MovimientoHc.idPaciente = 0;
        MovimientoHc.idMovimiento = 0;

        $('.writing').val('');
        $('.reading').val('');

        let resp = await Utilitario.ObtenerUsuarioSesion();
        await MovimientoHc.EmpleadosListar(resp.dni, '#cboResponsableSalidaMovHc', 0);
        await MovimientoHc.EmpleadosListar(resp.dni, '#cboResponsableTransporteMovHc', 0);
        await MovimientoHc.EmpleadosListar(resp.dni, '#cboResponsableRecepcionMovHc', 0);

        $("#cboResponsableSalidaMovHc").val(resp.idEmpleado);
        $("#cboResponsableTransporteMovHc").val(resp.idEmpleado);
        $("#cboResponsableRecepcionMovHc").val(resp.idEmpleado);
        //oTable_ServiciosAutorizados.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnBuscarDatosPacienteNroHistoria").hide();
        $("#btnBuscarDatosPacienteNroDocumento").hide();
        $("#btnGuardarRegistroMovimientoHistoria").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnBuscarDatosPacienteNroHistoria").show();
        $("#btnBuscarDatosPacienteNroDocumento").show();
        $("#btnGuardarRegistroMovimientoHistoria").show();
    },

}

$(document).ready(function () {
    MovimientoHc.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});