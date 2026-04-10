var GestionCaja = {
    tblHeightComprobantes: 0,

    async Iniciar() {
        GestionCaja.Plugins();
        GestionCaja.InitDataTableComprobantes();
        //GestionCaja.ListarCajaTodos();
        //GestionCaja.ListarCajaTurnosTodos();
        //GestionCaja.ListarCajerosTodos();
        GestionCaja.Eventos();
        //GestionCaja.IniciarValoresPorDefecto();

        await EmisionComprobante.Iniciar();
        await CanjeNotaCD.Iniciar();
        await ReporteCaja.Iniciar();

        GestionCaja.MostrarAperturadoPor();

        //$("#tblDetalleServiciosProductos_wrapper .dataTables_scrollBody").height("19vh");
    },

    Plugins() {
        $('#txtFiltroFechaInicio, #txtFiltroFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $('#txtFiltroFechaInicio').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFiltroFechaFin').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFiltroFechaInicio').datepicker('setEndDate', moment().toDate());
        $('#txtFiltroFechaFin').datepicker('setEndDate', moment().toDate());

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimientoRn").mask("Hn:Nn");



        let alturaDiferencia = $("#top").height() + $("header").height() + $("#tabGestionCaja").height() + 50;
        let alturaContenedorCaja = $(document).height() - alturaDiferencia;
        $("#myTabContentGestionCaja").height(alturaContenedorCaja);

        let alturaComprobanteContent = $("#Comprobantes-TabContent").height();
        GestionCaja.tblHeightComprobantes = alturaComprobanteContent - 80;    
                      
        
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });



        //console.log(alturaContenedorCaja);
        //$('.chosen-select-deselect').chosen({ allow_single_deselect: true });
    },

    //IniciarValoresPorDefecto() {
        
    //},

    InitDataTableComprobantes() {
        var parms = {
            //"paging": true,
            //"ordering": true,
            //"info": true,
            //"searching": false,
            //"scrollX": true,
            //"pageLength": 15,
            //"order": [[2, 'desc']],
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: GestionCaja.tblHeightComprobantes + "px",
            columns: [
                {
                    width: '8%',
                    targets: 0,
                    data: "dCaja",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 1,
                    data: "dTurno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: "fechaCobranza",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "dTipoComprobante",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '4%',
                    targets: 3,
                    data: "nroSerie",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 4,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: 'idCuentaAtencion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: 'nroHistoriaClinica',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '17%',
                    targets: 7,
                    data: 'razonSocial',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 8,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '14%',
                    targets: 9,
                    data: "dCajero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "dEstado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        if (rowData.idEstadoComprobante == 9) {
                            $(td).parent().css('color', '#eb0000');
                            $(td).parent().css('font-weight', 'bold');
                        } else if (rowData.idEstadoComprobante == 6) {
                            $(td).parent().css('color', '#00cd19');
                            $(td).parent().css('font-weight', 'bold');
                        } else if (rowData.conProblemas == 0) {
                            $(td).parent().css('color', '#FF9800');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.estadoEnvioSunat == 0) {
                            $(td).html('<span class="chip warning btnEstadoSunat" style="color: #5e5e5e;">SIN MIGRAR</span>');
                        } else if (rowData.estadoEnvioSunat == 1) {
                            $(td).html('<span class="chip success btnEstadoSunat" style="padding-left: 16px; padding-right: 16px;">MIGRADO</span>');
                        } else {
                            $(td).html('<span class="chip danger btnEstadoSunat" style="padding-left: 22px; padding-right: 22px;">ERROR</span>');
                        }
                    }
                },
                {
                    data: null,
                    width: "4%",
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

        var tableWrapper = $('#tblComprobantes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Comprobantes = $("#tblComprobantes").dataTable(parms);
        oTable_NotasCredito = $("#tblNotasCredito").dataTable(parms);
        oTable_NotasDebito = $("#tblNotasDebito").dataTable(parms);
    },

    Eventos() {
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnFiltroBuscar").click();
            }
        });
        
        $('#btnFiltroBuscar').on('click', function () {
            GestionCaja.ListarCajaComprobantesPago();
        });

        $('#btnFiltroLimpiar').on('click', function () {
            GestionCaja.LimpiarFiltros();
        });



        $('a[href="#comprobantes-tab"]').on('shown.bs.tab', function (event) {
            //$('.table').DataTable().columns.adjust().draw();
            oTable_Comprobantes.resize();
        });

        $('a[href="#notasCredito-tab"]').on('shown.bs.tab', function (event) {
            //$('.table').DataTable().columns.adjust().draw();
            oTable_NotasCredito.resize();
        });

        $('a[href="#notasDebito-tab"]').on('shown.bs.tab', function (event) {
            //$('.table').DataTable().columns.adjust().draw();
            oTable_NotasDebito.resize();
        });

        $('#TabBusqueda').on('shown.bs.tab', function (e) {           
            oTable_Comprobantes.resize();
            oTable_NotasCredito.resize();
            oTable_NotasDebito.resize();
        });

        $('#TabEmisionComprobante').on('shown.bs.tab', function (e) {
            let altura = $("#frameDetalleServiciosProdutos").height() - 70;
            $("#tblDetalleServiciosProductos_wrapper .dataTables_scrollBody").css("max-height", altura + "px");
            oTable_DetalleServiciosProductos.resize();
        });

        $('#tblComprobantes tbody').on('click', 'tr', function () {
            oTable_NotasCredito.$('tr.selected').removeClass('selected');
            oTable_NotasDebito.$('tr.selected').removeClass('selected');
            oTable_Comprobantes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblNotasCredito tbody').on('click', 'tr', function () {
            oTable_Comprobantes.$('tr.selected').removeClass('selected');
            oTable_NotasDebito.$('tr.selected').removeClass('selected');
            oTable_NotasCredito.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblNotasDebito tbody').on('click', 'tr', function () {
            oTable_Comprobantes.$('tr.selected').removeClass('selected');
            oTable_NotasCredito.$('tr.selected').removeClass('selected');
            oTable_NotasDebito.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblComprobantes tbody').on('click', '.btnEstadoSunat', async function () {
            var objrow = oTable_Comprobantes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_Comprobantes.fnGetData(objrow);

            const sunat = await GestionCaja.SeleccionarEstadoSunatComprobantePago(row.idTipoComprobante, row.nroSerie, row.nroDocumento);
            
            if (isEmpty(sunat)) {
                alerta2("warning", "", "<span class='font-weight-bold'>" + row.dTipoComprobante + ' ' + row.nroSerie + '-' + row.nroDocumento + "</span><br><div>El Comprobante aún no ha sido migrado.</div>");
            } else {
                let mensaje = '';
                let respuesta = sunat.respuesta;
                if (sunat.estado == 1) {
                    mensaje = "El comprobante ha sido migrado exitosamente."
                    alerta2("success", "", "<span class='font-weight-bold'>" + sunat.dTipoComprobante + ' ' + sunat.serieComprobante + '-' + sunat.correlativoComprobante + "</span><br><div class='mb-1'>" + mensaje + "</div><textarea disabled class='w-100' rows=8 id='alertaMsj'></textarea>");
                } else {
                    mensaje = "Hubo un error al migrar el comprobante."
                    alerta2("error", "", "<span class='font-weight-bold'>" + sunat.dTipoComprobante + ' ' + sunat.serieComprobante + '-' + sunat.correlativoComprobante + "</span><br><div class='mb-1'>" + mensaje + "</div><textarea disabled class='w-100' rows=8 id='alertaMsj'></textarea>");                    
                }               
                
                $("#alertaMsj").val(respuesta);
            }
        });

        $('#tblNotasCredito tbody').on('click', '.btnEstadoSunat', async function () {
            var objrow = oTable_NotasCredito.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_NotasCredito.fnGetData(objrow);

            const sunat = await GestionCaja.SeleccionarEstadoSunatNotasCreditoDebito(row.idTipoNota, row.nroSerie, row.nroDocumento);
            
            if (isEmpty(sunat)) {
                alerta2("warning", "", "<span class='font-weight-bold'>" + row.dTipoComprobante + ' ' + row.nroSerie + '-' + row.nroDocumento + "</span><br><div>El Comprobante aún no ha sido migrado.</div>");
            } else {
                let mensaje = '';
                let respuesta = sunat.respuesta;
                if (sunat.estado == 1) {
                    mensaje = "El comprobante ha sido migrado exitosamente."
                    alerta2("success", "", "<span class='font-weight-bold'>" + sunat.dTipoComprobante + ' ' + sunat.serieComprobante + '-' + sunat.correlativoComprobante + "</span><br><div class='mb-1'>" + mensaje + "</div><textarea disabled class='w-100' rows=8 id='alertaMsj'></textarea>");
                } else {
                    mensaje = "Hubo un error al migrar el comprobante."
                    alerta2("error", "", "<span class='font-weight-bold'>" + sunat.dTipoComprobante + ' ' + sunat.serieComprobante + '-' + sunat.correlativoComprobante + "</span><br><div class='mb-1'>" + mensaje + "</div><textarea disabled class='w-100' rows=8 id='alertaMsj'></textarea>");
                }

                $("#alertaMsj").val(respuesta);
            }
        });


        $('#btnCorregirComprobante').on('click', async function () {
            let objrowTb = oTable_Comprobantes.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.conProblemas == 0) {       //ConProblemas => 0 : Quiere decir que no tiene detalle
                swal({
                    title: 'Corregir',
                    text: "¿Esta seguro de corregir el comprobante seleccionado?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await GestionCaja.CorregirComprobantePago(objrowTb.idComprobantePago);
                        if (resp) {
                            await GestionCaja.ListarCajaComprobantesPago();
                        }
                    }
                    
                }, function (dimiss) {

                });
                
            } else {
                alerta2("info", "", "El comprobante no tiene problemas.")
            }


        });

        $('#btnHabilitarEnvioSunatComprobante').on('click', async function () {
            let objrowTb = oTable_Comprobantes.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.estadoEnvioSunat != 1) { 
                swal({
                    title: 'ENVÍO',
                    text: "¿Esta seguro de habilitar el envío del comprobante seleccionado?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await GestionCaja.ComprobantePagoHabilitarEnvioSunat(objrowTb.idComprobantePago, 0, 0);
                        if (resp) {
                            await GestionCaja.ListarCajaComprobantesPago();
                        }
                    }
                    
                }, function (dimiss) {

                });

            } else {
                alerta2("info", "", "El comprobante ya se encuentra migrado exitosamente.")
            }
        });

        $('#tblComprobantes tbody').on('click', '.btnImprimirComprobante', async function () {
            let objrow = oTable_Comprobantes.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_Comprobantes.fnGetData(objrow);

            if (row.idEstadoComprobante == 4 || row.idEstadoComprobante == 6) {
                $('#btnImprimirDocumentoPersonalizado').show();
                await Utilitario.GenerarFormatoComprobantePago(row.idComprobantePago);
            } else {
                if (row.idEstadoComprobante == 9) {
                    alerta2("info", "", "El comprobante ya se encuentra ANULADO.");
                }
            }
            

        });

        $('#tblNotasCredito tbody').on('click', '.btnImprimirComprobante', async function () {
            let objrow = oTable_NotasCredito.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_NotasCredito.fnGetData(objrow);

            $('#btnImprimirDocumentoPersonalizado').hide();
            await Utilitario.GenerarFormatoNotaCredito(row.idNota);

        });

        $('#btnHabilitarEnvioSunatNotaCredito').on('click', async function () {
            let objrowTb = oTable_NotasCredito.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.estadoEnvioSunat != 1) {
                swal({
                    title: 'ENVÍO',
                    text: "¿Esta seguro de habilitar el envío de la nota de crédito seleccionada?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await GestionCaja.ComprobantePagoHabilitarEnvioSunat(0, objrowTb.idNota, 0);
                        if (resp) {
                            await GestionCaja.ListarCajaComprobantesPago();
                        }
                    }

                }, function (dimiss) {

                });

            } else {
                alerta2("info", "", "La nota de crédito ya se encuentra migrado exitosamente.")
            }
        });

        $('#tblNotasDebito tbody').on('click', '.btnImprimirComprobante', async function () {
            let objrow = oTable_NotasDebito.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_NotasDebito.fnGetData(objrow);

            $('#btnImprimirDocumentoPersonalizado').hide();
            await Utilitario.GenerarFormatoNotaDebito(row.idNota);

        });

        $('#btnHabilitarEnvioSunatNotaDebito').on('click', async function () {
            let objrowTb = oTable_NotasDebito.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.estadoEnvioSunat != 1) {
                swal({
                    title: 'ENVÍO',
                    text: "¿Esta seguro de habilitar el envío de la nota de débito seleccionada?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await GestionCaja.ComprobantePagoHabilitarEnvioSunat(0, 0, objrowTb.idNota);
                        if (resp) {
                            await GestionCaja.ListarCajaComprobantesPago();
                        }
                    }
                   
                }, function (dimiss) {

                });

            } else {
                alerta2("info", "", "La nota de débito ya se encuentra migrado exitosamente.")
            }
        });

        /*============EVENTO IMPRESION COMPROBANTE============*/
        $('#btnImprimirDocumentoPersonalizado').on('click', async function () {
            let objrowTb = oTable_Comprobantes.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.idEstadoComprobante == 4) {
                await Utilitario.ImprimirCopiaComprobantePago(objrowTb.idComprobantePago);
            } else {
                if (objrowTb.idEstadoComprobante == 9) {
                    alerta2("info", "", "El comprobante ya se encuentra ANULADO.");
                }
            }

        });

    },


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    async ListarCajaComprobantesPago() {
        var respuesta;
        var resp = false;
        let datos;
        var formData = new FormData;

        try {            
            formData.append("NroSerie", $("#txtFiltroNroSerie").val());
            formData.append("NroDocumento", $("#txtFiltroNroDocumento").val());
            formData.append("NroHistoria", $("#txtFiltroNroHistoria").val());
            formData.append("IdCuentaAtencion", $("#txtFiltroNroCuenta").val());
            formData.append("IdCaja", $("#cboFiltroCaja").val());
            formData.append("IdTurno", $("#cboFiltroTurno").val());
            formData.append("IdCajero", $("#cboFiltroCajero").val());
            formData.append("RazonSocial", $("#txtFiltroRazonSocial").val());
            formData.append("FechaInicio", $("#txtFiltroFechaInicio").val());
            formData.append("FechaFin", $("#txtFiltroFechaFin").val());

            Cargando(1)
            oTable_Comprobantes.fnClearTable();
            oTable_NotasCredito.fnClearTable();
            oTable_NotasDebito.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ListarCajaComprobantesPago?area=Caja",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            if (datos.session) {
                if (datos.comprobantes.table.length > 0) {
                    //console.log(datos.respuesta.table);
                    oTable_Comprobantes.fnAddData(datos.comprobantes.table);
                }
                if (datos.comprobantes.table1.length > 0) {
                    //console.log(datos.respuesta.table);
                    oTable_NotasCredito.fnAddData(datos.comprobantes.table1);
                }  
                if (datos.comprobantes.table2.length > 0) {
                    //console.log(datos.respuesta.table);
                    oTable_NotasDebito.fnAddData(datos.comprobantes.table2);
                } 

                //oTable_Comprobantes.fnAddData(datos.comprobantes.table);
                //oTable_NotasCredito.fnAddData(datos.comprobantes.table1);
                //oTable_NotasDebito.fnAddData(datos.comprobantes.table2);

                GestionCaja.CargarResumenCaja(datos.comprobantes.table, datos.comprobantes.table1, datos.comprobantes.table2);

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta");                
                location.reload()
            }
        } catch (error) {
            alerta2("error", "", error);
        }

        return resp;
    },

    async SeleccionarEstadoSunatComprobantePago(idTipo, nroSerie, nroCorrelativo) {
        var respuesta;
        var resp = null;
        let datos;
        var formData = new FormData;

        try {
            formData.append("IdTipoComprobante", idTipo);
            formData.append("NroSerie", nroSerie);
            formData.append("NroDocumento", nroCorrelativo);
            
            Cargando(1)            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/SeleccionarEstadoSunatComprobantePago?area=Caja",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    //console.log(datos.respuesta.table);
                    resp = datos.respuesta.table[0];
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta");
                location.reload()
            }
        } catch (error) {
            alerta2("error", "", error);
        }

        return resp;
    },

    async SeleccionarEstadoSunatNotasCreditoDebito(idTipo, nroSerie, nroCorrelativo) {
        var respuesta;
        var resp = null;
        let datos;
        var formData = new FormData;

        try {
            formData.append("IdTipoComprobante", idTipo);
            formData.append("NroSerie", nroSerie);
            formData.append("NroDocumento", nroCorrelativo);

            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/SeleccionarEstadoSunatNotasCreditoDebito?area=Caja",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    //console.log(datos.respuesta.table);
                    resp = datos.respuesta.table[0];
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta");
                location.reload()
            }
        } catch (error) {
            alerta2("error", "", error);
        }

        return resp;
    },

    async ComprobantePagoHabilitarEnvioSunat(idComprobantePago, idNotaCredito, idNotaDebito) {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idComprobantePago', idComprobantePago);
        formData.append('idNotaCredito', idNotaCredito);
        formData.append('idNotaDebito', idNotaDebito);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ComprobantePagoHabilitarEnvioSunat?area=Caja",
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
                    if (datos.errorNumber > 0 && datos.warningNumber == 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                        return resp;
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

    async CorregirComprobantePago(idComprobantePago) {       
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('idComprobantePago', idComprobantePago);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CorregirComprobantePago?area=Caja",
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
                    if (datos.errorNumber > 0 && datos.warningNumber == 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                        return resp;
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

    
    //////////////////////////////////////////////////////////////////////////////////////////////
    CargarResumenCaja(comprobantes, notasCredito, notasDebito) {
        //console.log(comprobantes)
        //console.log(notasCredito)
        //console.log(notasDebito)

        
        let montoBoletas = comprobantes
            .filter(x => x.idEstadoComprobante === 4 && x.idTipoComprobante === 3)
            .reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));
       
        let montoFacturas = comprobantes
            .filter(x => x.idEstadoComprobante === 4 && x.idTipoComprobante === 2)
            .reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));
       
        let montoAnulados = comprobantes
            .filter(x => x.idEstadoComprobante === 9)
            .reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));
        
        let montoNotasCredito = notasCredito
            .filter(x => x.idEstadoNota === 3)
            .reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));

        let montoNotasDebito = notasDebito
            .filter(x => x.idEstadoNota === 3)
            .reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));

        let montoRecaudado = montoBoletas.plus(montoFacturas).minus(montoNotasCredito);

        $("#dMontoBoletas").html(montoBoletas.toString());
        $("#dMontoFacturas").html(montoFacturas.toString());
        $("#dMontoAnulados").html(montoAnulados.toString());
        $("#dMontoNotasCredito").html(montoNotasCredito.toString());
        $("#dMontoNotasDebito").html(montoNotasDebito.toString());
        $("#dMontoRecaudado").html(montoRecaudado.toString());



        let cantidadBoletas = comprobantes.filter(x => x.idEstadoComprobante === 4 && x.idTipoComprobante === 3).length;
        let cantidadFacturas = comprobantes.filter(x => x.idEstadoComprobante === 4 && x.idTipoComprobante === 2).length;
        let cantidadAnulados = comprobantes.filter(x => x.idEstadoComprobante === 9).length;
        let cantidadNotasCredito = notasCredito.filter(x => x.idEstadoNota === 3).length;
        let cantidadNotasDebito = notasDebito.filter(x => x.idEstadoNota === 3).length;
                
        let cantidadRecaudado = cantidadBoletas + cantidadFacturas + cantidadAnulados + cantidadNotasCredito + cantidadNotasDebito;

        $("#dCantidadBoletas").html(cantidadBoletas);
        $("#dCantidadFacturas").html(cantidadFacturas);
        $("#dCantidadAnulados").html(cantidadAnulados);
        $("#dCantidadNotasCredito").html(cantidadNotasCredito);
        $("#dCantidadNotasDebito").html(cantidadNotasDebito);
        $("#dCantidadRecaudado").html(cantidadRecaudado);

        //if (datos) {
        //    if (tipo == 'M') {       //MONTOS
        //        
        //    }

        //    if (tipo == 'C') {       //CANTIDAD
        //        $("#dCantidadBoletas").html(datos.cantidadBoletas);
        //        $("#dCantidadFacturas").html(datos.cantidadFacturas);
        //        $("#dCantidadAnulados").html(datos.cantidadAnulados);
        //        $("#dCantidadNotasCredito").html(datos.cantidadNotasCredito);
        //        $("#dCantidadNotasDebito").html(datos.cantidadNotasDebito);
        //        $("#dCantidadRecaudado").html(datos.cantidadRecaudado);
        //    }
        //}
    },

    MostrarAperturadoPor() {
        if (isEmpty($("#txtCajaAperturado").html()) == false && isEmpty($("#txtAperturadoPor").html()) == false) {
            let mensaje = "La caja se encuentra APERTURADA<br><b>CAJA: </b>" + $("#txtCajaAperturado").html() + "<br><b>APERTURADO POR: </b>" + $("#txtAperturadoPor").html();
            alerta2("info", "", mensaje);
        }
        
    },

    CerrarForm() {
        //$('#modalRegistroRN').modal('hide');
        Guardia.LimpiarForm();
        MostrarAreaLista();
        ReposicionarVista();
    },

    EjecutarAccion(accion) {
        $("#btnGuardarOcurrencia").hide();
        if (accion == "A" || accion == "M") {
            $(".campo").prop("disabled", false);
            $("#btnGuardarOcurrencia").show();
        }

        if (accion == "C" || accion == "E") {
            $(".campo").prop("disabled", true);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    LimpiarFiltros() {
        $(".search").val("");
        $('#txtFiltroFechaInicio').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFiltroFechaFin').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen({ allow_single_deselect: true }).trigger("chosen:updated");
    },

    LimpiarForm() {
        //Guardia.id = 0;
        //$(".campo").val("");
        //$('#txtFiltroFechaInicio').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        //$('#txtFiltroFechaFin').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        //$('.chzn-select').chosen().trigger("chosen:updated");
    },
    
}

$(document).ready(function () {
    GestionCaja.Iniciar();

    

    


    //const $card = $('.card-selector');

    //// Mostrar opciones al pasar el mouse si no está colapsado
    //$card.on('mouseenter', function () {
    //    if (!$card.hasClass('collapsed')) {
    //        $card.addClass('expanded');
    //    }
    //});

    //$card.on('mouseleave', function () {
    //    if (!$card.hasClass('collapsed')) {
    //        $card.removeClass('expanded');
    //    } else if ($card.hasClass('collapsed')) {
    //        $card.removeClass('collapsed').addClass('expanded');
    //        $card.find('.card-selected').addClass('d-none');
    //    }
    //});

    //// Al seleccionar una opción
    //$('.radioButtonStyleInput').on('change', function () {
    //    const textoSeleccionado = $(this).siblings('span').text();
    //    $card.addClass('collapsed').removeClass('expanded');
    //    $card.find('.card-selected').removeClass('d-none').text("opcion" + textoSeleccionado);
    //});

    //// Volver a expandir al hacer clic si está colapsado
    //$card.on('click', function () {
    //    if ($card.hasClass('collapsed')) {
    //        $card.removeClass('collapsed').addClass('expanded');
    //        $card.find('.card-selected').addClass('d-none');
    //    }
    //});
});