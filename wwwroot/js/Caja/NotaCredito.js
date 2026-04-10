var NotaCredito = {
    accion: '',
    idNotaCredito: 0,
    idComprobantePagoAfectado: 0,
    idTipoOrdenAfectado: 0,
    esOrdenCitaCE: false,
    movNumeroFarmacia: 0,

    async Iniciar() {
        NotaCredito.DataTableBusqueda();
        //NotaCredito.DataTableServiciosAutorizados();
        await NotaCredito.Plugins();
        NotaCredito.Eventos();
    },

    async Plugins() {
        let FechaHora = await Utilitario.FechaHoraServidor();
        let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $("#txtFechaInicioBusq, #txtFechaFinBusq").datepicker("setDate", FechaDia);

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
                    data: "documento",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "comprobanteAfectado",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "razonSocial",
                    width: "19%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "motivo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "total",
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoNota == 1) {
                            $(td).html('<span class="chip blue">' + rowData.estadoNota + '</span >');
                        } else if (rowData.idEstadoNota == 2) {
                            $(td).html('<span class="chip danger">' + rowData.estadoNota + '</span >');
                            $(td).parent().css('color', '#e91e1e');
                            $(td).parent().css('font-weight', 'bold');
                        } else if (rowData.idEstadoNota == 3) {
                            $(td).html('<span class="chip success">' + rowData.estadoNota + '</span >');
                        } else if (rowData.idEstadoNota == 0) {
                            $(td).html('<span class="chip secondary">' + rowData.estadoNota + '</span >');
                        }


                    }
                },
                {
                    data: "usuario",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaAprueba",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaPagado",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        if (rowData.idEstadoNota != 2) {
                            $(td).attr('align', 'center')
                            btnRuta = ' <button class="btnImprimirComprobante btn btn-sm btn-teal glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);
                        } else {
                            $(td).html("");
                        }

                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NotasCredito = $("#tblNotasCredito").dataTable(parms);
    },


    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await NotaCredito.NotasCreditoListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', async function () {
            await NotaCredito.LimpiarCamposBusqueda();
        });

        $('#tblNotasCredito tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NotasCredito.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            NotaCredito.accion = 'A';
            $("#frmFechaEmisionNotaCredito").hide();
            await NotaCredito.LimpiarCamposRegistro();
            await NotaCredito.ObtenerSiguienteDocumento();
            NotaCredito.DesbloquearRegistro();
            $("#modalRegistroNotaCredito").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            NotaCredito.accion = 'M';
            $("#frmFechaEmisionNotaCredito").show();
            let objrowTb = oTable_NotasCredito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            await NotaCredito.LimpiarCamposRegistro();
            NotaCredito.DesbloquearRegistro();
            const resp = await NotaCredito.CargarDatos(objrowTb.idNota);
            if (resp) {
                //$(".reading").attr("disabled", true);
                //$('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroNotaCredito").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            NotaCredito.accion = 'C';
            $("#frmFechaEmisionNotaCredito").show();
            let objrowTb = oTable_NotasCredito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            await NotaCredito.LimpiarCamposRegistro();
            const resp = await NotaCredito.CargarDatos(objrowTb.idNota);
            if (resp) {
                //$(".reading").attr("disabled", true);
                //$('.chzn-select-deselect').chosen().trigger("chosen:updated");
                NotaCredito.BloquearRegistro();
                $("#modalRegistroNotaCredito").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            NotaCredito.accion = 'E';
            $("#frmFechaEmisionNotaCredito").show();
            let objrowTb = oTable_NotasCredito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            resp = NotaCredito.ValidarEstadoNota(objrowTb.idEstadoNota);

            if (resp) {
                swal({
                    title: 'ELIMINAR',
                    html: "¿Esta seguro de eliminar la nota de crédito?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + objrowTb.nroSerie + '</td><td align="left">' + objrowTb.nroDocumento + '</td></tr></table>',
                    icon: 'error',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#ea423e',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'ELIMINAR',
                    cancelButtonText: 'CANCELAR',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        NotaCredito.idNotaCredito = objrowTb.idNota;
                        const resp = await NotaCredito.NotaCreditoEliminar();
                        if (resp) {
                            await NotaCredito.LimpiarCamposRegistro();
                            NotaCredito.NotasCreditoListar();
                        }
                    }
                    
                }, function (dimiss) {

                });
            }

        });

        $('#btnGuardarRegistroNotaCredito').on('click', async function () {

            if (NotaCredito.ValidarDatosObligatoriosRegistro() == true) {
                swal({
                    title: 'Guardar',
                    html: "¿Esta seguro de guardar el registro?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        const resp = await NotaCredito.NotaCreditoGuardar();
                        if (resp) {
                            await NotaCredito.LimpiarCamposRegistro();
                            NotaCredito.NotasCreditoListar();
                            $("#modalRegistroNotaCredito").modal("hide");
                        }
                    }
                    
                }, function (dimiss) {

                });
            }
        });

        $('#btnCancelarRegistroNotaCredito').on('click', async function () {
            await NotaCredito.LimpiarCamposRegistro();
            $("#modalRegistroNotaCredito").modal("hide");
        });


        $('#tblNotasCredito tbody').on('click', '.btnImprimirComprobante', async function () {
            let objrow = oTable_NotasCredito.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_NotasCredito.fnGetData(objrow);

            await Utilitario.GenerarFormatoNotaCredito(row.idNota);

        });


        ///////////////////////EVENTOS ADICIONALES//////////////////////////////////////////////
        $('.searchComprobanteAfectado').keypress(async function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchComprobanteAfectado").blur();
                await NotaCredito.BuscarComprobatePagoAfectado();
            }
        });

        $('#cboTipoDocumentoNC').on('change', async function () {
            NotaCredito.TipoDocumento_Change();
        });

        $('#btnBuscarComprobanteAfectado').on('click', async function () {
            await NotaCredito.BuscarComprobatePagoAfectado();                       
        });

        $('#btnLimpiarComprobanteAfectado').on('click', async function () {
            await NotaCredito.LimpiarCamposComprobanteAfectado();
        });

        $('#cboMotivoNC').on('change', async function () {
            NotaCredito.Motivo_Change();
        });

        $('input[name="rdbTipoMotivoAnulacion"]').on('change', async function () {
            let concepto = NotaCredito.ConceptoPorDefecto();
            $("#txtConceptoNC").val(concepto);

            NotaCredito.TipoMotivoAnulacion_Change();
        });

        $('#btnImprimirComprobanteAfectado').on('click', async function () {
            if (NotaCredito.idComprobantePagoAfectado > 0) {
                await Utilitario.GenerarFormatoComprobantePago(NotaCredito.idComprobantePagoAfectado);
            } else {
                alerta2("info", "", "No existe ningun comprobante. Por favor primero ingrese el comprobante que sera afectado.")
            }
        });

        $('#btnImprimirNotaIngreso').on('click', async function () {
            if (NotaCredito.movNumeroFarmacia > 0) {
                await Utilitario.GenerarFormatoNotaIngreso(NotaCredito.movNumeroFarmacia);
            } else {
                alerta2("info", "", "No existe la nota de ingreso. Por favor, previamente debe acercarse y hacer la devolución de medicamentos a la farmacia.")
            }
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async NotasCreditoListar() {
        let respuesta;
        let resp = false;
        let datos
        let data = new FormData();

        data.append('nroSerie', $("#txtNroSerieBusq").val());
        data.append('nroDocumento', $("#txtNroDocumentoBusq").val());
        data.append('razonSocial', $("#txtRazonSocialBusq").val());
        data.append('idTipoEstado', $("#cboTipoEstadoBusq").val());
        data.append('fechaInicio', $("#txtFechaInicioBusq").val());
        data.append('fechaFin', $("#txtFechaFinBusq").val());

        try {
            Cargando(1);
            oTable_NotasCredito.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/NotasCreditoListar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_NotasCredito.fnAddData(datos.respuesta.table);
                oTable_NotasCredito.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async NotaCreditoSeleccionar(idNota) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idNota', idNota);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/NotaCreditoSeleccionar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
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


    async NotaCreditoGuardar() {
        if (NotaCredito.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('IdNota', NotaCredito.idNotaCredito);
        formData.append('IdComprobantePago', NotaCredito.idComprobantePagoAfectado);
        //formData.append('IdTipoNota', $("#XXXXX").val());
        //formData.append('NroSerie', $("#XXXXX").val());
        //formData.append('NroDocumento', $("#XXXXX").val());

        //formData.append('SubTotal', $("#XXXXX").val());

        //formData.append('IdUsuarioAutoriza', $("#XXXXX").val());
        //formData.append('FechaAprueba', $("#XXXXX").val());
        //formData.append('TipoCambio', $("#XXXXX").val());

        //formData.append('IdEstadoNota', $("#XXXXX").val());
        //formData.append('FechaPagado', $("#XXXXX").val());
        //formData.append('IdUsuarioModifica', $("#XXXXX").val());
        //formData.append('FechaModificacion', $("#XXXXX").val());
        //formData.append('IdUsuarioElimina', $("#XXXXX").val());
        //formData.append('FechamEliminacion', $("#XXXXX").val());
        //formData.append('IdGestionCaja', $("#XXXXX").val());
        //formData.append('IdPaciente', $("#XXXXX").val());
        //formData.append('IdCajero', $("#XXXXX").val());
        //formData.append('IdTurno', $("#XXXXX").val());
        //formData.append('IdCaja', $("#XXXXX").val());
        //formData.append('IdFarmacia', $("#XXXXX").val());


        formData.append('TipoAnulacion', ($("#rdbTipoMotivoAnulacionTotal").is(':checked')) == true ? true : (($("#rdbTipoMotivoAnulacionTotal").is(':checked')) == true ? false : null));
        //.append('FechaCreacion', $("#XXXXX").val());
        //formData.append('IdTipoComprobantePagoAfecto', $("#cboTipoDocumentoComprobanteAfectadoNC").val());
        //formData.append('SerieComprobanteAfecto', $("#txtNroSerieComprobanteAfectadoNC").val());
        //formData.append('NumeroComprobanteAfecto', $("#txtNroDocumentoComprobanteAfectadoNC").val());
        //formData.append('FechaComprobanteAfecto', $("#txtFechaComprobanteAfectadoNC").val());

        formData.append('IdTipoDocIdentidadAfecto', $("#cboTipoDocumentoNC").val());
        formData.append('RUC', $("#txtNroDocumentoNC").val());
        formData.append('RazonSocial', $("#txtRazonSocialNC").val());
        formData.append('Direccion', $("#txtDireccionNC").val());
        formData.append('IdMotivo', $("#cboMotivoNC").val());
        formData.append('Observaciones', $("#txtConceptoNC").val());

        //formData.append('Gravadas', $("#txtTotalGravadoNC").val());
        //formData.append('IGV', $("#txtTotalIgvNC").val());
        //formData.append('Exoneradas', $("#txtTotalExoneradoNC").val());
        //formData.append('Inafecta', $("#txtTotalInafectoNC").val());
        formData.append('Total', $("#txtImporteNC").val());
        //formData.append('EstadoEnvioSunat', $("#XXXXX").val());

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/NotaCreditoGuardar?area=Caja",
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
                        let mensaje = datos.successMessage + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + datos.nroSerie + '</td><td align="left">' + datos.nroDocumento + '</td></tr></table>';
                        alerta2("success", "", mensaje);
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

    async NotaCreditoEliminar() {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idNota', NotaCredito.idNotaCredito);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/NotaCreditoEliminar?area=Caja",
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

    //-------------------------------------------------------------------------------------------------
    async ComprobantePagoSeleccionarPorNroDocumento(idTipoComprobante, nroSerie, nroDocumento) {
        let respuesta;
        let resp = null;
        let datos
        let formData = new FormData();

        formData.append('idTipoComprobante', idTipoComprobante);
        formData.append('nroSerie', nroSerie);
        formData.append('nroDocumento', nroDocumento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/CajaComprobantePagoSeleccionarPorNroDocumento?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
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

    //async ConsultarCitaPorNCuenta(idCuentaAtencion) {
    //    let respuesta;
    //    let resp = null;
    //    let datos
    //    let formData = new FormData();

    //    formData.append('idCuentaAtencion', idCuentaAtencion);

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/NotaCredito/NotaCreditoConsultarCitaPorNCuenta?area=Caja",
    //                contentType: "application/json; charset=utf-8",
    //                data: formData,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        Cargando(0);
    //        if (datos.respuesta.table.length > 0) {
    //            resp = datos.respuesta;
    //        }
    //        else {
    //            resp = null;
    //        }
    //    } catch (error) {
    //        alerta(3, error);
    //    }

    //    return resp;
    //},

    async NotaCreditoFarmNotaIngreso(documentoNumero) {
        let respuesta;
        let resp = null;
        let datos
        let formData = new FormData();

        formData.append('documentoNumero', documentoNumero);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/NotaCreditoFarmNotaIngreso?area=Caja",
                    contentType: "application/json; charset=utf-8",
                    data: formData,
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

    async ObtenerSiguienteDocumento() {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idTipoNota', 2);       //1: Nota Credito

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaCredito/ObtenerSiguienteDocumento?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
                $("#txtNroSerieComprobanteNC").val(resp.nroSerie);
                $("#txtNroDocumentoComprobanteNC").val(resp.nroDocumento);
                $("#txtEstadoComprobanteComprobanteNC").val("Por Aprobar");
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ///////////////////FORMATOS////////////////////////////////////////////////////////////////////////
    


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idNota) {
        let resp = false;
        let datos = await NotaCredito.NotaCreditoSeleccionar(idNota);
        if (!isEmpty(datos)) {
            let nota = datos.table[0];

            resp = NotaCredito.ValidarEstadoNota(nota.idEstadoNota);

            if (resp) {

                $("#cboTipoDocumentoComprobanteAfectadoNC").val(nota.idTipoComprobantePagoAfectado);
                $("#txtNroSerieComprobanteAfectadoNC").val(nota.nroSerieComprobantePagoAfectado);
                $("#txtNroDocumentoComprobanteAfectadoNC").val(nota.nroDocumentoComprobantePagoAfectado);
                await NotaCredito.BuscarComprobatePagoAfectado();
                
                $("#txtNroSerieComprobanteNC").val(nota.nroSerie);
                $("#txtNroDocumentoComprobanteNC").val(nota.nroDocumento);
                $("#txtEstadoComprobanteComprobanteNC").val(nota.estado);
                $("#txtFechaEmisionComprobanteNC").datepicker("setDate", nota.fechaEmision);
                $("#txtHoraEmisionComprobanteNC").val(nota.horaEmision);

                
                //$("#txtFechaComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtHoraComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtNroCuentaComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtNroHistoriaComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtRucComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtRazonSocialComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtTipoOrdenComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                //$("#txtTotalComprobanteAfectadoNC").val(nota.XXXXXXXXXXXXXX);
                
                $("#btnBuscarComprobanteAfectado").hide();
                $("#btnLimpiarComprobanteAfectado").hide();

                NotaCredito.idNotaCredito = nota.idNota;
                NotaCredito.idComprobantePagoAfectado = nota.idComprobantePago;
                //$("#txtFechaComprobanteAfectadoNC").datepicker("setDate", nota.fechaEmisionComprobanteAfecto);

                $("#cboTipoDocumentoNC").val(nota.idTipoDocIdentidadAfecto);
                NotaCredito.TipoDocumento_Change();
                $("#txtNroDocumentoNC").val(nota.ruc);
                $("#txtRazonSocialNC").val(nota.razonSocial);

                $("#txtDireccionNC").val(nota.direccion);
                $("#cboMotivoNC").val(nota.idMotivo);
                NotaCredito.Motivo_Change();
                if (nota.tipoAnulacion) {
                    $("#rdbTipoMotivoAnulacionTotal").prop("checked", true);
                } else if (!nota.tipoAnulacion) {
                    $("#rdbTipoMotivoAnulacionParcial").prop("checked", true);
                }

                $("#txtConceptoNC").val(nota.observaciones);

                $("#txtImporteNC").val(nota.total);

                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

                resp = true;
            }
        }

        return resp;
    },

    async BuscarComprobatePagoAfectado() {        
        let idTipoComprobante = $("#cboTipoDocumentoComprobanteAfectadoNC").val();
        let nroSerie = $("#txtNroSerieComprobanteAfectadoNC").val();
        let nroDocumento = $("#txtNroDocumentoComprobanteAfectadoNC").val();

        await NotaCredito.LimpiarCamposComprobanteAfectado();
        //if (NotaCredito.accion == "A") {
            if (!isEmpty(idTipoComprobante) && !isEmpty(nroSerie) && !isEmpty(nroDocumento)) {
                let resp = await NotaCredito.ComprobantePagoSeleccionarPorNroDocumento(idTipoComprobante, nroSerie, nroDocumento);
                if (!isEmpty(resp)) {                    
                    //$('#btnLimpiarComprobanteAfectado').click();
                    let comprobante = resp.table[0];
                    let idTipoOrden = comprobante.idTipoOrden;
                    NotaCredito.idTipoOrdenAfectado = idTipoOrden;

                    if (NotaCredito.accion == "A") {
                        if (comprobante.tieneNotaCredito == 1) {
                            alerta2("info", "", "El comprobante ya fue afectado por la nota de crédito " + comprobante.notaCredito + ".");
                            return false;
                        }

                        if (comprobante.idEstadoComprobante == 9) {
                            alerta2("info", "", "El comprobante " + nroSerie + '-' + nroDocumento + " se encuentra ANULADO.");
                            return false;
                        }

                        if (comprobante.idEstadoComprobante == 6) {
                            alerta2("info", "", "El comprobante " + nroSerie + '-' + nroDocumento + " ya ha sido DEVUELTO.");
                            return false;
                        }

                        if (comprobante.idEstadoComprobante == 1) {
                            alerta2("info", "", "La orden aun no ha sido PAGADA, solo se puede generar notas de crédito de ordenes PAGADAS..");
                            return false;
                        }
                    }

                    if (comprobante.idOrdenServicio > 0) {
                        if (comprobante.idPuntoCargaServicio == 6 && comprobante.tieneCita == 1) {        //CONSULTA EXTERNA
                            NotaCredito.esOrdenCitaCE = true;
                            if (NotaCredito.accion == 'A') {
                                if (comprobante.tieneCitaAtendida == 1) {
                                    alerta2("info", "", "No se puede modificar el comprobante " + nroSerie + '-' + nroDocumento + ". La cita ya fue atendida el " + comprobante.fechaCita + " en el servicio de " + comprobante.servicioCita);
                                    return false;
                                }

                                if (comprobante.tieneCitaVencida == 1) {
                                    alerta2("info", "", "La fecha " + comprobante.fechaCita + " y hora (" + comprobante.horaInicioCita + "-" + comprobante.horaFinCita + ") de la cita esta vencida.");
                                    //return false;
                                }
                            }
                            $("#frmCitaConsultaExterna").show();
                            $("#txtServicioCitaComprobanteAfectadoNC").val(comprobante.servicioCita);
                            $("#txtMedicoCitaComprobanteAfectadoNC").val(comprobante.medicoCita);
                            $("#txtFechaCitaComprobanteAfectadoNC").val(comprobante.fechaCita);
                            $("#txtTurnoCitaComprobanteAfectadoNC").val(comprobante.horaInicioCita + ' - ' + comprobante.horaFinCita);
                        } else {
                            if (NotaCredito.accion == 'A') {
                                if (comprobante.tieneMovimientosImagenes == 1) {
                                    alerta2("info", "", "El comprobante " + nroSerie + '-' + nroDocumento + " tiene registrado Movimiento en Imágenes.");
                                    return false;
                                }

                                if (comprobante.tieneMovimientosLaboratorio == 1) {
                                    alerta2("info", "", "El comprobante " + nroSerie + '-' + nroDocumento + " tiene registrado Movimiento en Laboratorio.");
                                    return false;
                                }
                            }
                        }
                                                
                        $("#txtTipoOrdenComprobanteAfectadoNC").val(comprobante.dBienServicio);                                               
                    }

                    if (comprobante.idOrdenFarmacia > 0) {
                        $("#frmFarmacia").show();
                        let resp2 = await NotaCredito.NotaCreditoFarmNotaIngreso(nroSerie + '-' + nroDocumento);
                        if (!isEmpty(resp2)) {
                            let notaIngreso = resp2.table[0];
                            NotaCredito.movNumeroFarmacia = notaIngreso.movNumero;
                            $("#txtNroMovimientoFarmaciaComprobanteAfectadoNC").val(notaIngreso.movNumero);
                            $("#txtDestinoMovimientoFarmaciaComprobanteAfectadoNC").val(notaIngreso.descripcion);
                            $("#txtFechaMovimientoFarmaciaComprobanteAfectadoNC").val(notaIngreso.fechaHoraMovimiento);
                            $("#txtTotalMovimientoFarmaciaComprobanteAfectadoNC").val(notaIngreso.totalMovimiento);
                                                        
                            $("#btnImprimirNotaIngreso").show();
                        } else {
                            if (NotaCredito.accion == "A") {
                                alerta2("info", "", "No se ha podido encontrar la nota de ingreso a la farmacia.\n Previamente debe acercarse y hacer la devolución de medicamentos a la farmacia")
                            }
                        }  

                        $("#txtTipoOrdenComprobanteAfectadoNC").val(comprobante.dBienServicio);
                    }                     

                    NotaCredito.idComprobantePagoAfectado = comprobante.idComprobantePago;
                    $("#cboTipoDocumentoComprobanteAfectadoNC").val(comprobante.idTipoComprobante);
                    $("#txtNroSerieComprobanteAfectadoNC").val(comprobante.nroSerie);
                    $("#txtNroDocumentoComprobanteAfectadoNC").val(comprobante.nroDocumento);
                    $("#txtFechaComprobanteAfectadoNC").datepicker("setDate", comprobante.fechaEmision);
                    $("#txtHoraComprobanteAfectadoNC").val(comprobante.horaEmision);
                    $("#txtNroCuentaComprobanteAfectadoNC").val(comprobante.idCuentaAtencion);
                    $("#txtNroHistoriaComprobanteAfectadoNC").val(comprobante.nroHistoriaClinica);
                    $("#txtRucComprobanteAfectadoNC").val(comprobante.ruc);
                    $("#txtRazonSocialComprobanteAfectadoNC").val(comprobante.razonSocial);
                    $("#txtTotalComprobanteAfectadoNC").val(comprobante.total);

                    $("#cboTipoDocumentoComprobanteAfectadoNC").attr("disabled", true);
                    $("#txtNroSerieComprobanteAfectadoNC").attr("disabled", true);
                    $("#txtNroDocumentoComprobanteAfectadoNC").attr("disabled", true);
                    $("#btnBuscarComprobanteAfectado").hide();

                    $("#btnImprimirComprobanteAfectado").show();

                    /////////////////////DETALLE COMPROBANTE/////////////////////////////                    
                    if (!isEmpty(comprobante.ruc)) {
                        $("#cboTipoDocumentoNC").val(11);
                        NotaCredito.TipoDocumento_Change();
                        $("#txtNroDocumentoNC").val(comprobante.ruc);
                        $("#txtRazonSocialNC").val(comprobante.razonSocial);
                        $("#txtDireccionNC").val(comprobante.direccion);                        
                    } else {
                        $("#cboTipoDocumentoNC").val(comprobante.idDocIdentidad);
                        NotaCredito.TipoDocumento_Change();
                        $("#txtNroDocumentoNC").val(comprobante.nroDocumentoIdentidad);
                        $("#txtRazonSocialNC").val(comprobante.razonSocial);
                        $("#txtDireccionNC").val(comprobante.direccionDomicilio);
                    }

                    //NotaCredito.Motivo_Change();
                    
                    if (comprobante.idOrdenServicio > 0) {
                        $("#cboMotivoNC").val(1);
                        NotaCredito.Motivo_Change();
                        $("#rdbTipoMotivoAnulacionTotal").prop("checked", true);

                        $("#txtImporteNC").val($("#txtTotalComprobanteAfectadoNC").val());
                    }

                    if (comprobante.idOrdenFarmacia > 0) {
                        $("#cboMotivoNC").val(1);
                        NotaCredito.Motivo_Change();
                        $("#txtImporteNC").val($("#txtTotalComprobanteAfectadoNC").val());

                        if (!isEmpty($("#txtTotalMovimientoFarmaciaComprobanteAfectadoNC").val())) {
                            $("#txtImporteNC").val($("#txtTotalMovimientoFarmaciaComprobanteAfectadoNC").val());
                        } else {
                            $("#txtImporteNC").val($("#txtTotalComprobanteAfectadoNC").val());
                        }                        
                    }

                    let concepto = NotaCredito.ConceptoPorDefecto();
                    $("#txtConceptoNC").val(concepto);

                    NotaCredito.TipoMotivoAnulacion_Change();
                    
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");

                } else {
                    alerta2("info", "", "El comprobante " + nroSerie + '-' + nroDocumento + " no existe.");
                }
            } else {
                alerta2("info", "", "Por favor complete los campos para iniciar la busqueda.");
            }
        //}
    },

    TipoDocumento_Change() {
        let idTipoDoc = $('#cboTipoDocumentoNC').val();

        if (idTipoDoc == 11) {
            $("#lblNroDocumentoNC").html("RUC");
            $("#lblRazonSocialNC").html("Razón Social");
        } else {
            $("#lblNroDocumentoNC").html("Nº Documento");
            $("#lblRazonSocialNC").html("Apellidos y Nombres");
        }
    },

    Motivo_Change() {
        let idMotivo = $('#cboMotivoNC').val();

        //$("#rdbTipoMotivoAnulacionTotal").removeAttr("checked");
        //$("#rdbTipoMotivoAnulacionParcial").removeAttr("checked");
        if (idMotivo == 2 || NotaCredito.idTipoOrdenAfectado == 1) {
            $("#optMotivoAnulacionTotal").show();
            $("#optMotivoAnulacionParcial").show();
        } else {
            $("#optMotivoAnulacionTotal").hide();
            $("#optMotivoAnulacionParcial").hide();
        }
    },

    TipoMotivoAnulacion_Change() {
        if ($("#rdbTipoMotivoAnulacionTotal").is(':checked')) {
            $("#txtImporteNC").attr("disabled", true);
        } else if ($("#rdbTipoMotivoAnulacionParcial").is(':checked')) {
            $("#txtImporteNC").removeAttr("disabled");
        } else {
            $("#txtImporteNC").attr("disabled", true);
        }        
    },

    ValidarEstadoNota(estadoNota) {
        let resp = false;

        if (NotaCredito.accion == 'M' || NotaCredito.accion == 'E') {
            if (estadoNota == 3) {
                alerta2("info", "", "La nota de debito ya se encuentra canjeada. No sera posible modificar o anular.");
                NotaCredito.BloquearRegistro();
                $("#btnGuardarRegistroNotaDebito").hide();
                resp = false;
            } else if (estadoNota == 2) {
                alerta2("info", "", "La nota de debito ya se encuentra anulada.");
                NotaCredito.BloquearRegistro();
                $("#btnGuardarRegistroNotaDebito").hide();
                resp = false;
            } else {
                $("#btnGuardarRegistroNotaDebito").show();
                resp = true;
            }
        } else {
            resp = true;
        }

        return resp;
    },

    ConceptoPorDefecto() {
        let concepto = '';
        if (NotaCredito.idTipoOrdenAfectado == 1) {
            if (NotaCredito.esOrdenCitaCE == 1) {
                concepto = "Por devolución " + ($('input[name="rdbTipoMotivoAnulacion"]:checked').siblings('span').text()) + " del comprobante, afectando a la " + ($('#cboTipoDocumentoComprobanteAfectadoNC option:selected').text().trim()) + " " + ($('#txtNroSerieComprobanteAfectadoNC').val()) + "-" + ($('#txtNroDocumentoComprobanteAfectadoNC').val()) + ".";
                concepto = concepto + "\n" + "La cita ligada al comprobante de pago se anuló.";
                concepto = concepto + "\n" + "(Servicio:" + ($('#txtServicioCitaComprobanteAfectadoNC').val()) + " | Turno:" + ($('#txtTurnoCitaComprobanteAfectadoNC').val()) + " | Médico:" + ($('#txtMedicoCitaComprobanteAfectadoNC').val()) + ")"
            } else {
                concepto = "Por devolución " + ($('input[name="rdbTipoMotivoAnulacion"]:checked').siblings('span').text()) + " del comprobante.\nAfectando a la " + ($('#cboTipoDocumentoComprobanteAfectadoNC option:selected').text().trim()) + " " + ($('#txtNroSerieComprobanteAfectadoNC').val()) + "-" + ($('#txtNroDocumentoComprobanteAfectadoNC').val()) + ".";
            }
        }

        if (NotaCredito.idTipoOrdenAfectado == 2) {            
            concepto = "Por devolución de medicamentos y/o insumos a la farmacia " + ($('#txtDestinoMovimientoFarmaciaComprobanteAfectadoNC').val()) + ".\nAfectando a la " + ($('#cboTipoDocumentoComprobanteAfectadoNC option:selected').text().trim()) + " " + ($('#txtNroSerieComprobanteAfectadoNC').val()) + "-" + ($('#txtNroDocumentoComprobanteAfectadoNC').val()) + ".";
        }

        return concepto;
    },

    ValidarDatosObligatoriosRegistro() {

        if (isEmpty(NotaCredito.idComprobantePagoAfectado)) {            
            alerta2("info", "", "Por favor ingrese el comprobante afectado.");
            return false;
        }
        //------------------------------------------------------------------------
        if (isEmpty($("#cboTipoDocumentoNC").val())) {
            $("#cboTipoDocumentoNC").focus(); $("#cboTipoDocumentoND_chosen").addClass("chosen-container-active");
            alerta2("info", "", "Por favor seleccione el Tipo Documento.");
            return false;
        }

        if (isEmpty($("#txtNroDocumentoNC").val())) {
            let idTipoDoc = $("#cboTipoDocumentoNC").val();
            if (idTipoDoc == 11) {
                $("#txtNroDocumentoNC").focus();
                alerta2("info", "", "Por favor ingrese el RUC.");
            } else {
                $("#txtNroDocumentoNC").focus();
                alerta2("info", "", "Por favor ingrese el Nº Documento.");
            }
            return false;
        } else {
            let idTipoDoc = $("#cboTipoDocumentoNC").val();
            if (idTipoDoc == 1 && $("#txtNroDocumentoNC").val().length != 8) {
                $("#txtNroDocumentoNC").focus();
                alerta2("info", "", "Por favor ingrese el Nº Documento correctamente.");
                return false;
            } else if (idTipoDoc == 11 && $("#txtNroDocumentoNC").val().length != 11) {
                $("#txtNroDocumentoNC").focus();
                alerta2("info", "", "Por favor ingrese el RUC correctamente.");
                return false;
            }
        }

        if (isEmpty($("#txtRazonSocialNC").val())) {
            let idTipoDoc = $("#cboTipoDocumentoNC").val();
            if (idTipoDoc == 11) {
                $("#txtRazonSocialNC").focus();
                alerta2("info", "", "Por favor ingrese la Razon Social.");
            } else {
                $("#txtRazonSocialNC").focus();
                alerta2("info", "", "Por favor ingrese los Apellidos y Nombres.");
            }
            return false;
        } else {
            let idTipoDoc = $("#cboTipoDocumentoNC").val();
            if (idTipoDoc == 11 && $("#txtRazonSocialNC").val().length < 3) {
                $("#txtRazonSocialNC").focus();
                alerta2("info", "", "Por favor ingrese la Razón Social correctamente.");
                return false;
            } else if ($("#txtRazonSocialNC").val().length < 3) {
                $("#txtRazonSocialNC").focus();
                alerta2("info", "", "Por favor ingrese los Apellidos y Nombres correctamente.");
                return false;
            }
        }

        if (isEmpty($("#txtDireccionNC").val())) {
            $("#txtDireccionNC").focus();
            alerta2("info", "", "Por favor ingrese la Dirección.");
            return false;
        }

        if (isEmpty($("#cboMotivoNC").val())) {
            $("#cboMotivoNC").focus(); $("#cboMotivoND_chosen").addClass("chosen-container-active");
            alerta2("info", "", "Por favor seleccione el Motivo.");
            return false;
        }

        if (isEmpty($("#txtConceptoNC").val())) {
            $("#txtConceptoNC").focus();
            alerta2("info", "", "Por favor ingrese el Concepto.");
            return false;
        }
        //----------------------------------------------------------------------------        
        if (isEmptyValue($("#txtImporteNC").val())) {
            $("#txtImporteNC").focus();
            alerta2("info", "", "Por favor ingrese el Importe Total.");
            return false;
        }

        return true;
    },

    async LimpiarCamposRegistro() {
        //NotaCredito.accion = '';
        NotaCredito.idNotaCredito = 0;
        NotaCredito.idComprobantePagoAfectado = 0;
        NotaCredito.idTipoOrdenAfectado = 0;
        NotaCredito.esOrdenCitaCE = false;
        NotaCredito.movNumeroFarmacia = 0;

        $('.writing').val('');
        $('.reading').val('');

        $('.writing').removeAttr('checked');

        NotaCredito.TipoDocumento_Change();
        NotaCredito.Motivo_Change();

        $("#frmCitaConsultaExterna").hide();
        $("#frmFarmacia").hide();

        $("#btnImprimirComprobanteAfectado").hide();
        $("#btnImprimirNotaIngreso").hide();

        $("#cboTipoDocumentoComprobanteAfectadoNC").removeAttr("disabled");
        $("#txtNroSerieComprobanteAfectadoNC").removeAttr("disabled");
        $("#txtNroDocumentoComprobanteAfectadoNC").removeAttr("disabled");

        $("#rdbTipoMotivoAnulacionTotal").prop("checked", true);

        $("#btnBuscarComprobanteAfectado").show();

        //await NotaCredito.EmpleadosListar('', 0);
        //oTable_ServiciosAutorizados.fnClearTable();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    async LimpiarCamposBusqueda() {
        $(".search").val("");

        let FechaHora = await Utilitario.FechaHoraServidor();
        let FechaDia = FechaHora.substring(0, 10);

        $("#txtFechaInicioBusq, #txtFechaFinBusq").datepicker("setDate", FechaDia);

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    async LimpiarCamposComprobanteAfectado() {        
        NotaCredito.LimpiarCamposRegistro();
        NotaCredito.ObtenerSiguienteDocumento();
    },

    LimpiarCamposCitaConsultaExterna() {
        $("#frmCitaConsultaExterna input").val("");
    },

    LimpiarCamposNotaIngresoFarmacia() {
        $("#frmFarmacia input").val("");
        $("#btnBuscarMovimientoFarmaciaNC").show();
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnLimpiarComprobanteAfectado").hide();
        $("#btnGuardarRegistroNotaDebito").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnBuscarComprobanteAfectado").show();
        $("#btnLimpiarComprobanteAfectado").show();
        $("#btnGuardarRegistroNotaDebito").show();
    },

}

$(document).ready(function () {
    NotaCredito.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});