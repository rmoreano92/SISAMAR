var NotaDebito = {
    accion: '',
    idNotaDebito: 0,

    async Iniciar() {
        NotaDebito.DataTableBusqueda();
        //NotaDebito.DataTableServiciosAutorizados();
        await NotaDebito.Plugins();
        NotaDebito.Eventos();
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
        oTable_NotasDebito = $("#tblNotasDebito").dataTable(parms);
    },

    
    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await NotaDebito.NotasDebitoListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', async function () {
            await NotaDebito.LimpiarCamposBusqueda();
        });

        $('#tblNotasDebito tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NotasDebito.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            NotaDebito.accion = 'A';
            $("#frmFechaEmisionNotaDebito").hide();
            await NotaDebito.LimpiarCamposRegistro();
            await NotaDebito.ObtenerSiguienteDocumento();
            NotaDebito.DesbloquearRegistro();
            $("#modalRegistroNotaDebito").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            NotaDebito.accion = 'M';
            $("#frmFechaEmisionNotaDebito").show();
            let objrowTb = oTable_NotasDebito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            await NotaDebito.LimpiarCamposRegistro();
            NotaDebito.DesbloquearRegistro();
            const resp = await NotaDebito.CargarDatos(objrowTb.idNota);
            if (resp) {
                //$(".reading").attr("disabled", true);
                //$('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroNotaDebito").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            NotaDebito.accion = 'C';
            $("#frmFechaEmisionNotaDebito").show();
            let objrowTb = oTable_NotasDebito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            await NotaDebito.LimpiarCamposRegistro();
            const resp = await NotaDebito.CargarDatos(objrowTb.idNota);
            if (resp) {
                //$(".reading").attr("disabled", true);
                //$('.chzn-select-deselect').chosen().trigger("chosen:updated");
                NotaDebito.BloquearRegistro();
                $("#modalRegistroNotaDebito").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            NotaDebito.accion = 'E';
            $("#frmFechaEmisionNotaDebito").show();
            let objrowTb = oTable_NotasDebito.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            resp = NotaDebito.ValidarEstadoNota(objrowTb.idEstadoNota);

            if (resp) {
                swal({
                    title: 'ELIMINAR',
                    html: "¿Esta seguro de eliminar la nota de debito?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + objrowTb.nroSerie + '</td><td align="left">' + objrowTb.nroDocumento + '</td></tr></table>',
                    icon: 'error',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#ea423e',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'ELIMINAR',
                    cancelButtonText: 'CANCELAR',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        NotaDebito.idNotaDebito = objrowTb.idNota;
                        const resp = await NotaDebito.NotaDebitoEliminar();
                        if (resp) {
                            await NotaDebito.LimpiarCamposRegistro();
                            NotaDebito.NotasDebitoListar();
                        }
                    }                    
                }, function (dimiss) {

                });              
            }            

        });

        $('#btnGuardarRegistroNotaDebito').on('click', async function () {

            if (NotaDebito.ValidarDatosObligatoriosRegistro() == true) {
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
                        const resp = await NotaDebito.NotaDebitoGuardar();
                        if (resp) {
                            await NotaDebito.LimpiarCamposRegistro();
                            NotaDebito.NotasDebitoListar();
                            $("#modalRegistroNotaDebito").modal("hide");
                        }
                    }
                    
                }, function (dimiss) {

                });
            }            
        });

        $('#btnCancelarRegistroNotaDebito').on('click', async function () {
            await NotaDebito.LimpiarCamposRegistro();
            $("#modalRegistroNotaDebito").modal("hide");
        });

        
        $('#tblNotasDebito tbody').on('click', '.btnImprimirComprobante', async function () {
            let objrow = oTable_NotasDebito.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_NotasDebito.fnGetData(objrow);

            await Utilitario.GenerarFormatoNotaDebito(row.idNota);

        });
        

        ///////////////////////EVENTOS ADICIONALES//////////////////////////////////////////////
        $('#cboTipoDocumentoND').on('change', async function () {
            NotaDebito.TipoDocumento_Change();
        });

        $('#btnLimpiarComprobanteAfectado').on('click', async function () {            
            $("#cboTipoDocumentoComprobanteAfectadoND").val("");
            $("#txtNroSerieComprobanteAfectadoND").val("");
            $("#txtNroDocumentoComprobanteAfectadoND").val("");
            $("#txtFechaComprobanteAfectadoND").val("");

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        });

    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async NotasDebitoListar() {
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
            oTable_NotasDebito.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaDebito/NotasDebitoListar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_NotasDebito.fnAddData(datos.respuesta.table);
                oTable_NotasDebito.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async NotaDebitoSeleccionar(idNota) {
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
                    url: "/NotaDebito/NotaDebitoSeleccionar?area=Caja",
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

    
    async NotaDebitoGuardar() {
        if (NotaDebito.ValidarDatosObligatoriosRegistro() == false) {
            return false;
        }

        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();              

        formData.append('IdNota', NotaDebito.idNotaDebito);
        //formData.append('IdComprobantePago', $("#XXXXX").val());
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
        
        
        //formData.append('TipoAnulacion', $("#XXXXX").val());
        //.append('FechaCreacion', $("#XXXXX").val());
        formData.append('IdTipoComprobantePagoAfecto', $("#cboTipoDocumentoComprobanteAfectadoND").val());
        formData.append('SerieComprobanteAfecto', $("#txtNroSerieComprobanteAfectadoND").val());
        formData.append('NumeroComprobanteAfecto', $("#txtNroDocumentoComprobanteAfectadoND").val());
        formData.append('FechaComprobanteAfecto', $("#txtFechaComprobanteAfectadoND").val());

        formData.append('IdTipoDocIdentidadAfecto', $("#cboTipoDocumentoND").val());
        formData.append('RUC', $("#txtNroDocumentoND").val());
        formData.append('RazonSocial', $("#txtRazonSocialND").val());                
        formData.append('Direccion', $("#txtDireccionND").val());
        formData.append('IdMotivo', $("#cboMotivoND").val());
        formData.append('Observaciones', $("#txtConceptoND").val());
        
        formData.append('Gravadas', $("#txtTotalGravadoND").val());
        formData.append('IGV', $("#txtTotalIgvND").val());
        formData.append('Exoneradas', $("#txtTotalExoneradoND").val());
        formData.append('Inafecta', $("#txtTotalInafectoND").val());        
        formData.append('Total', $("#txtTotalND").val());
        //formData.append('EstadoEnvioSunat', $("#XXXXX").val());

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaDebito/NotaDebitoGuardar?area=Caja",
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

    async NotaDebitoEliminar() {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idNota', NotaDebito.idNotaDebito);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaDebito/NotaDebitoEliminar?area=Caja",
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
    async ObtenerSiguienteDocumento() {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idTipoNota', 1);       //1: Nota Debito

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaDebito/ObtenerSiguienteDocumento?area=Caja",
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
                $("#txtNroSerieComprobanteND").val(resp.nroSerie);
                $("#txtNroDocumentoComprobanteND").val(resp.nroDocumento);
                $("#txtEstadoComprobanteComprobanteND").val("Por Aprobar");
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idNota) {
        let resp = false;
        let datos = await NotaDebito.NotaDebitoSeleccionar(idNota);
        if (!isEmpty(datos)) {
            let nota = datos.table[0];

            resp = NotaDebito.ValidarEstadoNota(nota.idEstadoNota);

            if (resp) {
                NotaDebito.idNotaDebito = nota.idNota;

                $("#txtNroSerieComprobanteND").val(nota.nroSerie);
                $("#txtNroDocumentoComprobanteND").val(nota.nroDocumento);
                $("#txtEstadoComprobanteComprobanteND").val(nota.estadoNota);
                $("#txtFechaEmisionComprobanteND").datepicker("setDate", nota.fechaEmision);
                $("#txtHoraEmisionComprobanteND").val(nota.horaEmision);

                $("#cboTipoDocumentoComprobanteAfectadoND").val(nota.idTipoComprobantePagoAfecto);
                $("#txtNroSerieComprobanteAfectadoND").val(nota.serieComprobanteAfecto);
                $("#txtNroDocumentoComprobanteAfectadoND").val(nota.numeroComprobanteAfecto);
                $("#txtFechaComprobanteAfectadoND").datepicker("setDate", nota.fechaEmisionComprobanteAfecto);

                $("#cboTipoDocumentoND").val(nota.idTipoDocIdentidadAfecto);
                NotaDebito.TipoDocumento_Change();
                $("#txtNroDocumentoND").val(nota.ruc);
                $("#txtRazonSocialND").val(nota.razonSocial);

                $("#txtDireccionND").val(nota.direccion);
                $("#cboMotivoND").val(nota.idMotivo);
                $("#txtConceptoND").val(nota.observaciones);

                $("#txtTotalGravadoND").val(nota.gravadas);
                $("#txtTotalIgvND").val(nota.igv);
                $("#txtTotalExoneradoND").val(nota.exoneradas);
                $("#txtTotalInafectoND").val(nota.inafecta);
                $("#txtTotalND").val(nota.total);

                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

                resp = true;
            }            
        }

        return resp;
    },

    TipoDocumento_Change() {
        let idTipoDoc = $('#cboTipoDocumentoND').val();
        
        if (idTipoDoc == 11) {
            $("#lblNroDocumentoND").html("RUC");
            $("#lblRazonSocialND").html("Razón Social");
        } else {
            $("#lblNroDocumentoND").html("Nº Documento");
            $("#lblRazonSocialND").html("Apellidos y Nombres");
        } 
    },

    ValidarEstadoNota(estadoNota) {
        let resp = false;

        if (NotaDebito.accion == 'M' || NotaDebito.accion == 'E') {
            if (estadoNota == 3) {
                alerta2("info", "", "La nota de debito ya se encuentra canjeada. No sera posible modificar o anular.");
                NotaDebito.BloquearRegistro();
                $("#btnGuardarRegistroNotaDebito").hide();
                resp = false;
            } else if (estadoNota == 2) {
                alerta2("info", "", "La nota de debito ya se encuentra anulada.");
                NotaDebito.BloquearRegistro();
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
        
    ValidarDatosObligatoriosRegistro() {
        
        if (isEmpty($("#cboTipoDocumentoComprobanteAfectadoND").val())) {
            $("#cboTipoDocumentoComprobanteAfectadoND").focus(); $("#cboTipoDocumentoComprobanteAfectadoND_chosen").addClass("chosen-container-active");
            alerta2("info", "", "Por favor seleccione el Tipo Comprobante.");            
            return false;
        }

        if (isEmpty($("#txtNroSerieComprobanteAfectadoND").val())) {
            $("#txtNroSerieComprobanteAfectadoND").focus();
            alerta2("info", "", "Por favor ingrese el Nº Serie.");            
            return false;
        }

        if (isEmpty($("#txtNroDocumentoComprobanteAfectadoND").val())) {
            $("#txtNroDocumentoComprobanteAfectadoND").focus();
            alerta2("info", "", "Por favor ingrese el Nº Documento.");            
            return false;
        }

        if (isEmpty($("#txtFechaComprobanteAfectadoND").val())) {
            $("#txtFechaComprobanteAfectadoND").focus();
            alerta2("info", "", "Por favor ingrese la Fecha Comprobante.");            
            return false;
        }
        //------------------------------------------------------------------------
        if (isEmpty($("#cboTipoDocumentoND").val())) {
            $("#cboTipoDocumentoND").focus(); $("#cboTipoDocumentoND_chosen").addClass("chosen-container-active");
            alerta2("info", "", "Por favor seleccione el Tipo Documento.");            
            return false;
        } 

        if (isEmpty($("#txtNroDocumentoND").val())) {
            let idTipoDoc = $("#cboTipoDocumentoND").val();
            if (idTipoDoc == 11) {
                $("#txtNroDocumentoND").focus();
                alerta2("info", "", "Por favor ingrese el RUC.");
            } else {
                $("#txtNroDocumentoND").focus();
                alerta2("info", "", "Por favor ingrese el Nº Documento.");
            }            
            return false;
        } else {
            let idTipoDoc = $("#cboTipoDocumentoND").val();
            if (idTipoDoc == 1 && $("#txtNroDocumentoND").val().length != 8) {
                $("#txtNroDocumentoND").focus();
                alerta2("info", "", "Por favor ingrese el Nº Documento correctamente.");                
                return false;
            } else if (idTipoDoc == 11 && $("#txtNroDocumentoND").val().length != 11) {
                $("#txtNroDocumentoND").focus();
                alerta2("info", "", "Por favor ingrese el RUC correctamente.");                
                return false;
            } 
        }

        if (isEmpty($("#txtRazonSocialND").val())) {
            let idTipoDoc = $("#cboTipoDocumentoND").val();
            if (idTipoDoc == 11) {
                $("#txtRazonSocialND").focus();
                alerta2("info", "", "Por favor ingrese la Razon Social.");
            } else {
                $("#txtRazonSocialND").focus();
                alerta2("info", "", "Por favor ingrese los Apellidos y Nombres.");
            }              
            return false;
        } else {
            let idTipoDoc = $("#cboTipoDocumentoND").val();
            if (idTipoDoc == 11 && $("#txtRazonSocialND").val().length < 3) {
                $("#txtRazonSocialND").focus();
                alerta2("info", "", "Por favor ingrese la Razón Social correctamente.");                
                return false;
            } else if ($("#txtRazonSocialND").val().length < 3) {
                $("#txtRazonSocialND").focus();
                alerta2("info", "", "Por favor ingrese los Apellidos y Nombres correctamente.");                
                return false;
            }
        }

        if (isEmpty($("#txtDireccionND").val())) {
            $("#txtDireccionND").focus();
            alerta2("info", "", "Por favor ingrese la Dirección.");            
            return false;
        }

        if (isEmpty($("#cboMotivoND").val())) {
            $("#cboMotivoND").focus(); $("#cboMotivoND_chosen").addClass("chosen-container-active");
            alerta2("info", "", "Por favor seleccione el Motivo.");            
            return false;
        }

        if (isEmpty($("#txtConceptoND").val())) {
            $("#txtConceptoND").focus();
            alerta2("info", "", "Por favor ingrese el Concepto.");            
            return false;
        }
        //----------------------------------------------------------------------------
        if (isEmptyValue($("#txtTotalGravadoND").val())) {
            $("#txtTotalGravadoND").focus();
            alerta2("info", "", "Por favor ingrese el Monto Gravado.");            
            return false;
        }

        if (isEmptyValue($("#txtTotalIgvND").val())) {
            $("#txtTotalIgvND").focus();
            alerta2("info", "", "Por favor ingrese el Monto IGV.");            
            return false;
        }

        if (isEmptyValue($("#txtTotalExoneradoND").val())) {
            $("#txtTotalExoneradoND").focus();
            alerta2("info", "", "Por favor ingrese el Monto Exonerado.");            
            return false;
        }

        if (isEmptyValue($("#txtTotalInafectoND").val())) {
            $("#txtTotalInafectoND").focus();
            alerta2("info", "", "Por favor ingrese el Monto Inafecto.");            
            return false;
        }

        if (isEmptyValue($("#txtTotalND").val())) {
            $("#txtTotalND").focus();
            alerta2("info", "", "Por favor ingrese el Monto Total.");            
            return false;
        }

        return true;
    },

    async LimpiarCamposRegistro() {
        //NotaDebito.accion = '';
        NotaDebito.idNotaDebito = 0;

        $('.writing').val('');
        $('.reading').val('');

        NotaDebito.TipoDocumento_Change();

        //await NotaDebito.EmpleadosListar('', 0);
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

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");        
        $("#btnLimpiarComprobanteAfectado").hide();
        $("#btnGuardarRegistroNotaDebito").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");    
        $("#btnLimpiarComprobanteAfectado").show();
        $("#btnGuardarRegistroNotaDebito").show();
    },

}

$(document).ready(function () {
    NotaDebito.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});