var NotaIngreso = {
    indexDetalle: 0,
    accion: "",
    elEstablecimientoEsCS: false,
    esUnaDonacionOestrategico: null,
    esUnidosisLaFarmacia: 0,
    lbDocumentoEsAutomatico: false,
    prefijoNroDocumentoNI: "",
    suffijoNroDocumentoNI: "",
    nroDocumentoNI: "",
    oRsItemsUnidosis: null,
    idPacienteDevolucion: null,
    idCuentaDevolucion: null,
    idTipoServicioDevolucion: null,
    idComprobantePagoDevolucion: null,
    idFuenteFinanciamientoDevolucion: null,
    idTipoFinanciamientoDevolucion: null,
    idProveedor: null,
    tipoPrecioParaNiNs: null,
    esNotaIngresoAutomatica: 0,
    tieneDespacho: 0,

    //////////////////////////////CONFIGURACIONES INICIALES///////////////////////////////////////////
    async Iniciar() {
        NotaIngreso.Plugins();
        NotaIngreso.DataTableBusqueda();
        NotaIngreso.DataTableDetalleNotaIngreso();
        NotaIngreso.DataTableProductosBuscados();
        NotaIngreso.DataTableDetalleConsumoFarmacia();
        NotaIngreso.DataTableDetalleDevolucion();
        NotaIngreso.Eventos();
        NotaIngreso.LLenarCombos();

        let valorParametro = await Utilitario.SeleccionarParametro(282);
        NotaIngreso.elEstablecimientoEsCS = (valorParametro.valorTexto == "S" ? true : false);
        NotaIngreso.oRsItemsUnidosis = await NotaIngreso.ListarProductosUnidosis();
    },

    Plugins() {
        $('#txtFechaInicioBusq, #txtFechaFinalBusq').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('.PickerFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtFechaInicioBusq, #txtFechaFinalBusq, .PickerFecha").mask("Dd/Mm/abcd");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimiento").mask("Hn:Nn");
        //$("#txtHoraClampaje").mask("Hn:Nn");

        NotaIngreso.IniciarFechasBusqueda();

        $(".chzn-select").chosen({ allow_single_deselect: true });

    },

    IniciarFechasBusqueda() {
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaPrimerDiaDelMes = "01" + "/" + mes + "/" + f.getFullYear();
        FechaHoy = dia + "/" + mes + "/" + f.getFullYear();
        $("#txtFechaInicioBusq").datepicker("setDate", FechaPrimerDiaDelMes);
        $("#txtFechaFinalBusq").datepicker("setDate", FechaHoy);
    },

    //////////////////////////////CONFIGURACION DATATABLES///////////////////////////////////////////
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": true,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    data: "movNumero",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "movTipo",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    data: "abreviatura",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "documentoNumero",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 5,
                    data: "fechaCreacionMovimiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "estado",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.idEstadoMovimiento == 0) {
                            $(td).parent().css('color', '#ff0808');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    targets: 7,
                    data: "concepto",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "total",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: "nroCuenta",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 10,
                    data: "tipoNota",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 11,
                    data: "ruc",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 12,
                    data: "razonSocial",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 12,
                    data: "razonSocial",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        
                        $(td).attr('align', 'left')

                        var btnImprimeSinF = "";

                        btnImprimeSinF = '<button class="btnImprimeInforme btn btn-sm btn-warning glow_button" title="Visualiza Informe" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                        $(td).html(btnImprimeSinF);
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NotasIngreso = $("#tblNotasIngresos").dataTable(parms);
    },

    DataTableDetalleNotaIngreso() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '31%',
                    targets: 2,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputLote = `<input type="text" id="txtLoteNI_${rowData.idProducto}_${rowData.item}" data-fila="${rowData.item}" value="${isNull(rowData.lote, '')}" style="width:80%;" autocomplete="off" placeholder="" class="form-control form-control-sm dLoteNI">`;
                        $(td).html(inputLote);
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputFechaVencimiento = `
                        <div class="input-group input-group-sm" style="width:80%;">
                            <input type="text" autocomplete="off"
                                class="form-control form_val_popup_dp3 PickerFecha dFechaVencNI"
                                placeholder="dd/mm/yyyy"
                                data-date-format="dd/mm/yyyy"
                                id="txtFechaVencNI_${rowData.idProducto}_${rowData.item}"
                                data-fila="${rowData.item}"
                                value="${isNull(rowData.fechaVencimiento, rowData.fechaHoy)}">
                            <span class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                            </span>
                        </div>`;
                        $(td).html(inputFechaVencimiento);
                    }
                },
                {
                    width: '8%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = `<input type="text" id="txtCantNI_${rowData.idProducto}_${rowData.item}" data-fila="${rowData.item}" value="${isNull(rowData.cantidad, 0)}" style="width:80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCantNI">`;
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '8%',
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputPrecio = `<input type="text" id="txtPrecioNI_${rowData.idProducto}_${rowData.item}" data-fila="${rowData.item}" value="${isNull(rowData.precioUnitario, 0)}" style="width:80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-decimal dPrecioNI">`;
                        $(td).html(inputPrecio);
                    }
                },
                {
                    width: '8%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputTotal = `<div id="htmlTotalNI_${rowData.idProducto}_${rowData.item}" data-fila="${rowData.item}" class="dTotalNI">${isNull(rowData.total, 0.00)}</div>`;
                        $(td).html(inputTotal);
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputRegistroSanitario = `<input type="text" id="txtRegSanNI_${rowData.idProducto}_${rowData.item}" data-fila="${rowData.item}" value="${isNull(rowData.registroSanitario, '')}" style="width:80%;" autocomplete="off" placeholder="" class="form-control form-control-sm dRegSanNI">`;
                        $(td).html(inputRegistroSanitario);
                    }
                }
            ]
        }
        var tableWrapper = $('#tblDetalleNotaIngreso');
        oTable_DetalleNI = $("#tblDetalleNotaIngreso").dataTable(parms);
        $('#tblDetalleNotaIngreso_length').css('display', 'none');
    },

    DataTableProductosBuscados() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '28vh',
            autoWidth: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '75%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }
        var tableWrapper = $('#tblProductosBuscados');
        oTable_ProductosBuscados = $("#tblProductosBuscados").dataTable(parms);
        $('#tblProductosBuscados_length').css('display', 'none');

        //let offSetElement = $('#frameBusquedaProductos').offset();
        //$('#frameResultadosBusquedaProdutos').css({
        //    top: offSetElement.top,
        //    left: offSetElement.left
        //});

    },

    DataTableDetalleConsumoFarmacia() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '20vh',
            autoWidth: false,
            columns: [
                {
                    width: '8%',
                    targets: 0,
                    data: "documentoNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '8%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        $(td).html(FormatearFecha(rowData.fechaCreacion) + " " + FormatearHora(rowData.fechaCreacion));
                    }
                },
                {
                    width: '6%',
                    targets: 2,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '30%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, ''));
                    }
                },
                {
                    width: '6%',
                    targets: 4,
                    //data: "cantidad",
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidadCF = '  <input type="text" id="txtCantCF_' + rowData.idProducto + '" value="' + isNull(rowData.cantidadConsumoQueda, 0) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCantCF">'
                        $(td).html(inputCantidadCF);
                    }
                },
                {
                    width: '15%',
                    targets: 5,
                    data: "dalmacen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '7%',
                    targets: 6,
                    data: "movNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '6%',
                    targets: 7,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "dfinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '4%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).html("<button class='btn btn-sm btn-success agregarProductoConsumoFarmacia'><i class='fa fa-plus'></i></button>");
                    }
                }

            ]
        }
        let tableWrapper = $('#tblDetalleConsumoFarmacia');
        oTable_DetalleConsumoFarmacia = $("#tblDetalleConsumoFarmacia").dataTable(parms);
        $('#tblDetalleConsumoFarmaciao_length').css('display', 'none');
    },

    DataTableDetalleDevolucion() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '20vh',
            autoWidth: false,
            columns: [
                {
                    width: '8%',
                    targets: 0,
                    data: "documentoNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '31%',
                    targets: 2,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "lote",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        $(td).html(FormatearFecha(rowData.fechaVencimiento));
                    }
                },
                {
                    width: '8%',
                    targets: 6,
                    data: "cantidadDevolver",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '8%',
                    targets: 7,
                    data: "registroSanitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '3%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).html("<button class='btn btn-sm btn-danger eliminarProductoDevolucion'><i class='fa fa-trash'></i></button>");
                    }
                }
            ]
        }
        let tableWrapper = $('#tblDetalleDevolucion');
        oTable_DetalleDevolucion = $("#tblDetalleDevolucion").dataTable(parms);
        $('#tblDetalleDevolucion_length').css('display', 'none');
    },

    //////////////////////////////EVENTOS USUARIO - SISTEMA///////////////////////////////////////////

    Eventos() {

        $('#tblNotasIngresos tbody').on('click', '.btnImprimeInforme', async function () {// KHOYOSI
            var objrow = oTable_NotasIngreso.api(true).row($(this).parents("tr")[0]).index();
            var objTable = oTable_NotasIngreso.fnGetData(objrow);

            var url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=ConsultaExterna&MovNumero=" + objTable.movNumero + "&MovTipo=" + objTable.movTipo
            $('#ifrmInforme').attr('src', url)
            //newIframe.src = url;

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalInforme").modal('show')
        })
        $('#btnCerrarTicket').on('click', async function () {
            $("#modalInforme").modal('hide')
        });

        //$('#btnImprimirTicket').on('click', function () {
        //    let objTable = oTable_NotasIngreso.api(true).row('.selected').data()

        //    var url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=ConsultaExterna&MovNumero=" + objTable.movNumero + "&MovTipo=" + objTable.movTipo
        //        / ('#ifrmInforme').attr('src', url)
        //    //newIframe.src = url;

        //    //$('#btnCerrarModalCita').trigger("click")
        //    $("#modalInforme").modal('show')
        //})
        $('#btnBuscar').on('click', async function () {
            await NotaIngreso.ListarNotasIngresos();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            NotaIngreso.LimpiarCamposBusqueda();
        });


        $('#tblNotasIngresos tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NotasIngreso.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarNotaIngreso').on('click', async function () {
            //TriajeRn.LimpiarDatosMadre();
            //TriajeRn.LimpiarCamposRegistro();
            //TriajeRn.DeshabilitarRegistro();
            NotaIngreso.accion = "A";
            NotaIngreso.LimpiarCamposRegistro();
            await NotaIngreso.CargarDatosRegistro();
            NotaIngreso.DesbloquearRegistro();
            /*MostrarAreaRegistro();*/
        });

        $('#btnModificarNotaIngreso').on('click', async function () {


            let notaIngreso = oTable_NotasIngreso.api(true).row('.selected').data()

            if (isEmpty(notaIngreso)) {
                alerta(2, 'Seleccione un registro por favor.')
                return false
            }


            if (notaIngreso.idEstadoMovimiento == 0) {
                alerta2('warning', 'El registro se encuentra anulado.')
                return false
            }

            NotaIngreso.accion = "M";
            NotaIngreso.LimpiarCamposRegistro();
            NotaIngreso.DesbloquearRegistro();
            await NotaIngreso.CargarDatosRegistro();
            NotaIngreso.ValidarModificacion();
        });

        $('#btnConsultarNotaIngreso').on('click', async function () {
            //TriajeRn.LimpiarDatosMadre();
            //TriajeRn.LimpiarCamposRegistro();
            NotaIngreso.accion = "C";
            NotaIngreso.LimpiarCamposRegistro();
            await NotaIngreso.CargarDatosRegistro();
            NotaIngreso.BloquearRegistro();
            //const resp = await TriajeRn.SeleccionarTriajeRecienNacido();
            //if (resp) {
            //    //TriajeRn.BloquearRegistro();
            //    MostrarAreaRegistro();
            //}
        });

        $('#btnEliminarNotaIngreso').on('click', async function () {

            let notaIngreso = oTable_NotasIngreso.api(true).row('.selected').data()

            if (isEmpty(notaIngreso)) {
                alerta(2, 'Seleccione un registro por favor.')
                return false
            }


            if (notaIngreso.idEstadoMovimiento == 0) {
                alerta2('warning', 'El registro se encuentra anulado.')
                return false
            }

            NotaIngreso.accion = "E";
            NotaIngreso.LimpiarCamposRegistro();
            await NotaIngreso.CargarDatosRegistro();
            NotaIngreso.BloquearRegistro();
        });

        $('#btnGuardarNotaIngreso').on('click', async function () {
            await NotaIngreso.GuardarNotaIngreso();
        });

        $('#btnAnularNotaIngreso').on('click', async function () {
            await NotaIngreso.AnularNotaIngreso();
        });

        $('#btnCancelarNotaIngreso').on('click', async function () {
            swal({
                title: 'Salir',
                text: "¿Esta seguro de salir?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {
                MostrarAreaLista();
                //TriajeRn.LimpiarDatosMadre();
                //TriajeRn.LimpiarCamposRegistro();
                //TriajeRn.ListarTriajeRecienNacido();
            }, function (dimiss) {

            });

        });

        $('#btnAbrirModalReporteNotaIngreso').on('click', async function () {
            $('#modalReporteNotaIngreso').modal('show')
        });

        $('#btnGenerarReporte').on('click', () => {
            if (NotaIngreso.ValidarBusquedaNotasIngreso() == false) {
                return false;
            }


            let formData = new FormData()

            formData.append('IdAlmacen', $("#cboFarmaciasBusq").val());
            formData.append('NroCuenta', $("#txtNroCuentaBusq").val());
            formData.append('FechaInicio', $("#txtFechaInicioBusq").val());
            formData.append('FechaFin', $("#txtFechaFinalBusq").val());

            Cargando(1)

            fetch('/NotaIngreso/rptNotaIngresoFarmaciaAlmacen?area=Farmacia', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "NotasIngreso.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta(1, 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta(2, 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        })




        $('#cboFarmaciaDestinoNI').on('change', async function () {
            await NotaIngreso.FarmaciaDestinoNI_Change();
            NotaIngreso.esUnidosisLaFarmacia = parseInt($('#cboFarmaciaDestinoNI option:selected').attr('esUnidosis'));
        });

        $('#cboConceptoNI').on('change', async function () {
            await NotaIngreso.ConceptoNI_Change();
        });

        $('#txtNroRucNI').on('keyup', async function (event) {
            if (event.which === 13) { // Código de la tecla Enter es 13
                await NotaIngreso.SeleccionarProveedoresPorRuc($('#txtNroRucNI').val());
            } else if ($('#txtNroRucNI').val().length == 11) {
                await NotaIngreso.SeleccionarProveedoresPorRuc($('#txtNroRucNI').val());
            }
        });

        //$('#cboFarmaciaOrigenNI').on('change', async function () {
        //    await NotaIngreso.XXXXX();
        //});

        //$('#cboTipoDocumentoNI').on('change', async function () {
        //    await NotaIngreso.XXXXXXXXX();
        //});


        /*=============================DEVOLUCION=============================*/
        $('#chkPacienteForaneo').on('change', async function () {
            if ($('#chkPacienteForaneo').is(':checked')) {
                $("#framPacienteConHistoria").hide();
                $("#framPacienteForaneo").show();
            } else {
                $("#framPacienteConHistoria").show();
                $("#framPacienteForaneo").hide();
            }
        });

        $('#txtNroCuentaPacienteNI').on('keypress', async function (event) {
            if (event.which === 13) { // Código de la tecla Enter es 13
                await NotaIngreso.SeleccionarAtencionPorCuenta($('#txtNroCuentaPacienteNI').val());
            }
        });

        $('#btnBuscarCuentaPacienteNI').on('click', async function () {
            await NotaIngreso.SeleccionarAtencionPorCuenta($('#txtNroCuentaPacienteNI').val());
        });

        $('#tblDetalleConsumoFarmacia tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_DetalleConsumoFarmacia.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });

        //$('#tblDetalleConsumoFarmacia tbody').on('dblclick', 'tr', function () {
        //    $(this).removeClass('selected');
        //    oTable_DetalleConsumoFarmacia.$('tr.selected').removeClass('selected');
        //    $(this).addClass('selected');

        //    var objrowTb = oTable_DetalleConsumoFarmacia.api(true).row('.selected').data();
        //    NotaIngreso.AgregarProductoDevolucion(objrowTb);
        //});

        $('#tblDetalleConsumoFarmacia tbody').on('click', '.agregarProductoConsumoFarmacia', function () {
            $($(this).parents("tr")[0]).removeClass('selected');
            oTable_DetalleConsumoFarmacia.$('tr.selected').removeClass('selected');
            $($(this).parents("tr")[0]).addClass('selected');

            let objrowTb = oTable_DetalleConsumoFarmacia.api(true).row('.selected').data();
            NotaIngreso.AgregarProductoDevolucion(objrowTb);
        });

        $('#tblDetalleDevolucion tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_DetalleDevolucion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblDetalleDevolucion tbody').on('click', '.eliminarProductoDevolucion', function () {
            $($(this).parents("tr")[0]).removeClass('selected');
            oTable_DetalleDevolucion.$('tr.selected').removeClass('selected');
            $($(this).parents("tr")[0]).addClass('selected');

            NotaIngreso.QuitarProductoDevolucion();
        });

        $('#btnGuardarDevolucion').on('click', function (event) {
            NotaIngreso.AgregarProductosParaDevolver();
            $("#modalConsumoFarmacia").modal("hide");
        });

        $('#btnCancelarDevolucion').on('click', function (event) {
            $("#modalConsumoFarmacia").modal("hide");
        });


        /*=========================DETALLE PRODUCTOS==============================*/
        $('#tblDetalleNotaIngreso tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_DetalleNI.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });

        $(document).on("keyup", ".dLoteNI", function () {
            let posFila = parseInt($(this).closest('tr').index());
            let indexFila = $(this).attr("data-fila");
            let idElement = $(this).prop("id");
            let idProducto = idElement.split("_")
            let lote = $(this).val();
            let fechaVencimiento = $("#txtFechaVencNI_" + idProducto[1] + "_" + indexFila + "[data-fila='" + indexFila + "']").val();

            let objrowTb = oTable_DetalleNI.fnGetData(posFila);
            //console.log($(this).closest('tr'));
            if (NotaIngreso.ItemYaExiste(objrowTb.idProducto, lote, fechaVencimiento, objrowTb.idTipoSalidaBienInsumo, indexFila)) {
                $(this).val("");
            }
        });

        $(document).on("keyup", ".dFechaVencNI", function () {
            const posFila = parseInt($(this).closest('tr').index());
            const indexFila = $(this).attr("data-fila");
            const idProducto = $(this).prop("id").split("_")[1];
            const fechaVencimiento = $(this).val();
            const lote = $(`#txtLoteNI_${idProducto}_${indexFila}[data-fila='${indexFila}']`).val();
            const objrowTb = oTable_DetalleNI.fnGetData(posFila);

            if (NotaIngreso.ItemYaExiste(objrowTb.idProducto, lote, fechaVencimiento, objrowTb.idTipoSalidaBienInsumo, indexFila)) {
                $(this).datepicker("setDate", objrowTb.fechaHoy);
            }
        });

        //$(document).on("change", ".dFechaVencNI", function () {
        //    let posFila = parseInt($(this).closest('tr').index());
        //    let idElement = $(this).prop("id");
        //    let idProducto = idElement.split("_")
        //    let fechaVencimiento = $(this).val();
        //    let lote = $("#txtLoteNI_" + idProducto[1] + "[data-fila='" + posFila + "']").val();

        //    let objrowTb = oTable_DetalleNI.fnGetData(posFila);

        //    if (NotaIngreso.ItemYaExiste(objrowTb.idProducto, lote, fechaVencimiento, objrowTb.idTipoSalidaBienInsumo, posFila + 1)) {
        //        $(this).datepicker("setDate", objrowTb.fechaHoy);
        //    }

        //    //console.log("Número de fila: " + posFila);
        //    //console.log(objrowTb);                        
        //});

        $(document).on("keyup", ".dCantNI, .dPrecioNI", function () {
            const partes = $(this).prop("id").split("_");
            NotaIngreso.calcularTotalFila(partes[1], partes[2]);
        });


        /*===================BUSQUEDA PRODUCTOS================================*/
        $('#tblProductosBuscados tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblProductosBuscados tbody').on('dblclick', 'tr', async function () {
            $(this).removeClass('selected');
            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();

            if (objrowTb.idTipoSalidaBienInsumo == 3) {

                let tipoSalida = await alertaAsync("question", "Atención", "El tipo de Salida es: \"IntervSanitarias/Ventas\" \n ¿Lo registrara como VENTAS?",
                    cancelButtonText = 'IntervSanitarias', preConfirm = null, confirmButtonText = 'Ventas')


                if (tipoSalida.isConfirmed) {
                    objrowTb.idTipoSalidaBienInsumo = 1
                    objrowTb.tipo = 'Venta'
                    NotaIngreso.AgregarProducto(objrowTb);
                } else {
                    objrowTb.idTipoSalidaBienInsumo = 2
                    objrowTb.tipo = 'IntervSanitarias'
                    NotaIngreso.AgregarProducto(objrowTb);
                }

            } else {
                NotaIngreso.AgregarProducto(objrowTb);
            }

            

            //console.log(objrowTb);
        });

        $('#btnAgregaProducto').on('click', async function () {
            var objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                NotaIngreso.AgregarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para agregar.");
            }
        });

        $('#btnQuitarProducto').on('click', async function () {
            var objrowTb = oTable_DetalleNI.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                NotaIngreso.QuitarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para eliminar.");
            }
        });

        $('#txtCodigoProductoBusqueda').on("keyup", async function (event) {
            $("#txtNombreProductoBusqueda").val("");
            let busqueda = $("#txtCodigoProductoBusqueda").val().trim();
            await NotaIngreso.ListarProductosBuscados('C', busqueda, 1, 5);
        });

        $('#txtNombreProductoBusqueda').on("keyup", async function (event) {
            $("#txtCodigoProductoBusqueda").val("");
            let busqueda = $("#txtNombreProductoBusqueda").val().trim();
            await NotaIngreso.ListarProductosBuscados('N', busqueda, 1, 5);
        });


    },

     calcularTotalFila(idProducto, item) {
        const cantidad = parseFloat($(`#txtCantNI_${idProducto}_${item}`).val()) || 0;
        const precio = parseFloat($(`#txtPrecioNI_${idProducto}_${item}`).val()) || 0;
        const total = parseFloat((cantidad * precio).toFixed(5));
        $(`#htmlTotalNI_${idProducto}_${item}`).html(total);
        NotaIngreso.Totalizar();
    },

    //////////////////////////LLENAR COMBOS////////////////////////////////////////////////////
    async LLenarCombos() {
        NotaIngreso.oRsItemsUnidosis = NotaIngreso.CargarComboFarmaciasUnidosisTodos();
        let idLaboraSubArea = NotaIngreso.DevuelveSubAreaDondeLaboraElUsuarioDelSistema(sghAreasLaboraEmpleado.sghAlmacenFarmacia);
        NotaIngreso.CargarComboFarmaciasNI();

        if (idLaboraSubArea > 0) {
            $("#cboFarmaciaDestinoNI").val(idLaboraSubArea);
        }

        if ($("#TipoFarmacia").html() == "A") {
            $("#lblAlmacenBusq").html("Almacen");
            $("#lblAlmacenDestino").html("Almacen Destino");
        } else {
            $("#lblAlmacenBusq").html("Farmacia");
            $("#lblAlmacenDestino").html("Farmacia Destino");
        }

        NotaIngreso.CargarComboTipoDocumentosNI();
    },

    CargarComboFarmaciasUnidosisTodos() {
        //let dataFiltroFarmacia = new FormData();
        //dataFiltroFarmacia.append('filtro', filtroFarmacia);
        let resp = null;
        $.ajax({
            method: "POST",
            url: "/Unidosis/ListarFarmaciasUnidosisTodos?area=Farmacia",
            data: null,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.respuesta.table.length > 0) {
                    resp = datos.respuesta.table;
                }
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        return resp;
    },

    DevuelveSubAreaDondeLaboraElUsuarioDelSistema(idLaboraArea) {
        let dataForm = new FormData();
        dataForm.append('idLaboraArea', idLaboraArea);
        resp = 0;

        $.ajax({
            method: "POST",
            url: "/Empleados/DevuelveSubAreaDondeLaboraElUsuarioDelSistema?area=Seguridad",
            data: null,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $(datos.lstData.table).each(function (i, obj) {
                    resp = obj.idLaboraSubArea;
                });
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        return resp;
    },

    CargarComboFarmaciasNI() {
        let filtroFarmacia = "idTipoLocales='" + $("#TipoFarmacia").html() + "' and idEstado=1";
        let dataFiltroFarmacia = new FormData();
        dataFiltroFarmacia.append('filtro', filtroFarmacia);
        $.ajax({
            method: "POST",
            url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
            data: dataFiltroFarmacia,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboFarmaciasBusq').empty();
                $('#cboFarmaciaDestinoNI').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboFarmaciasBusq').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                    $('#cboFarmaciaDestinoNI').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" esUnidosis="' + obj.esUnidosis + '">' + obj.descripcion + '</option>');
                });
                $('#cboFarmaciasBusq').val("");
                $('#cboFarmaciaDestinoNI').val("");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CargarComboFarmaciasOrigenNI(filtroFarmacia) {
        //let filtroFarmacia = "idAlmacen='" + $("#TipoFarmacia").html() + "' and idEstado=1";
        let dataFiltroFarmacia = new FormData();
        dataFiltroFarmacia.append('filtro', filtroFarmacia);
        let descripcion = "";
        let value = 0;
        $.ajax({
            method: "POST",
            url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
            data: dataFiltroFarmacia,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboFarmaciaOrigenNI').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    descripcion = obj.descripcion;
                    descripcion = descripcion.replace(/</g, '-');
                    descripcion = descripcion.replace(/>/g, '-');
                    value = obj.idAlmacen;
                    $('#cboFarmaciaOrigenNI').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" esUnidosis="' + obj.esUnidosis + '">' + descripcion + '</option>');
                });

                if (datos.lstData.table.length == 1) {
                    $('#cboFarmaciaOrigenNI').val(value);
                } else {
                    $('#cboFarmaciaOrigenNI').val("");
                }

            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CargarComboTipoDocumentosNI(filtroFarmacia) {
        //let filtroFarmacia = "idAlmacen='" + $("#TipoFarmacia").html() + "' and idEstado=1";
        //let dataFiltroFarmacia = new FormData();
        //dataFiltroFarmacia.append('filtro', filtroFarmacia);
        let descripcion = "";
        let value = 0;
        $.ajax({
            method: "GET",
            url: "/Farmacias/FarmTipoDocumentosDevuelveTodos?area=Farmacia",
            data: null,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboTipoDocumentoNI').empty();
                $('#cboTipoDocumentoOrigenNI').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    descripcion = obj.nombre;
                    descripcion = descripcion.replace(/</g, '-');
                    descripcion = descripcion.replace(/>/g, '-');
                    value = obj.idTipoDocumento;
                    $('#cboTipoDocumentoNI').append('<option value="' + obj.idTipoDocumento + '">' + descripcion + '</option>');
                    $('#cboTipoDocumentoOrigenNI').append('<option value="' + obj.idTipoDocumento + '">' + descripcion + '</option>');
                });

                if (datos.lstData.table.length == 1) {
                    $('#cboTipoDocumentoNI').val(value);
                } else {
                    $('#cboTipoDocumentoNI').val("");
                }

                if (datos.lstData.table.length == 1) {
                    $('#cboTipoDocumentoOrigenNI').val(value);
                } else {
                    $('#cboTipoDocumentoOrigenNI').val("");
                }

            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    //////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////METODOS INTERACCIÓN///////////////////////////////////////////////
    async FarmaciaDestinoNI_Change() {
        let midata = new FormData();
        midata.append('TipoAlmacen', $("#TipoFarmacia").html());
        midata.append('TipoMov', 'E');
        midata.append('TipoSuministro', $('#cboFarmaciaDestinoNI option:selected').attr('tipoSuministro'));

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmTipoConceptosDevuelveParaRegistroDeNiNs?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            $('#cboConceptoNI').empty();
            if (datos.lstData.table.length > 0) {
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboConceptoNI').append('<option value="' + obj.idTipoConcepto + '" data-documentoUltimoNumero="' + obj.documentoUltimoNumero + '" data-niEsDevolucionPaciente="' + obj.niEsDevolucionPaciente + '">' + obj.concepto + '</option>');
                });
            }
            $('#cboConceptoNI').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta2("error", "", error.toString());
        }
    },

    async ConceptoNI_Change() {
        let filtroFarmacia = '';

        const concepto = await NotaIngreso.SeleccionarConceptoNI(parseInt($('#cboConceptoNI').val()));
        //console.log(concepto);

        $("#cboTipoDocumentoNI").val(concepto.documentoId);

        if (concepto.documentoId == 22) {                //NINGUNO      
            HabilitarDeshabilitarForm("#txtNroDocumentoNI", false, "");
            HabilitarDeshabilitarForm("#txtFechaRecepcionNI", false, "");
            //$('#txtNroDocumentoNI').attr('disabled', true);
            //$('#txtFechaRecepcionNI').attr('disabled', true);
        } else {
            HabilitarDeshabilitarForm("#txtNroDocumentoNI", true, "");
            HabilitarDeshabilitarForm("#txtFechaRecepcionNI", true, "");
            //$('#txtNroDocumentoNI').removeAttr('disabled');
            //$('#txtFechaRecepcionNI').removeAttr('disabled');
        }

        $("#cboTipoDocumentoOrigenNI").val(concepto.niDocumentoOrigenId);

        if (concepto.niDocumentoOrigenId == 22) {                //NINGUNO   
            HabilitarDeshabilitarForm("#txtNroDocumentoOrigenNI", false, "");
            HabilitarDeshabilitarForm("#txtFechaDocumentoOrigenNI", false, "");
            //$('#txtNroDocumentoOrigenNI').attr('disabled', true);
            //$('#txtFechaDocumentoOrigenNI').attr('disabled', true);
        } else {
            HabilitarDeshabilitarForm("#txtNroDocumentoOrigenNI", true, "");
            HabilitarDeshabilitarForm("#txtFechaDocumentoOrigenNI", true, "");
            //$('#txtNroDocumentoOrigenNI').removeAttr('disabled');
            //$('#txtFechaDocumentoOrigenNI').removeAttr('disabled');
        }

        if (concepto.niEsCompra == true) {
            if (concepto.conceptoCodigo == "01") {
                HabilitarDeshabilitarForm("#cboTipoProcesoNI", true, "");
                HabilitarDeshabilitarForm("#cboTipoCompraNI", true, "");
                HabilitarDeshabilitarForm("#txtNroProcesoNI", true, "");
                //$('#cboTipoProcesoNI').removeAttr('disabled');
                //$('#cboTipoCompraNI').removeAttr('disabled');
                //$('#txtNroProcesoNI').removeAttr('disabled');                
            } else {
                HabilitarDeshabilitarForm("#cboTipoProcesoNI", false, "");
                HabilitarDeshabilitarForm("#cboTipoCompraNI", false, "");
                HabilitarDeshabilitarForm("#txtNroProcesoNI", false, "");
                //$('#cboTipoProcesoNI').attr('disabled', true);
                //$('#cboTipoCompraNI').attr('disabled', true);
                //$('#txtNroProcesoNI').attr('disabled', true);
            }
            HabilitarDeshabilitarForm("#txtNroRucNI", true, "");
            HabilitarDeshabilitarForm("#txtRazonSocialRucNI", true, "");

            await NotaIngreso.ListarTiposCompraSegunFiltro("idTipoCompra<>1");
            await NotaIngreso.ListarTiposProcesoSegunFiltro("idTipoProceso<>1");


        } else {
            HabilitarDeshabilitarForm("#cboTipoProcesoNI", false, "");
            HabilitarDeshabilitarForm("#cboTipoCompraNI", false, "");
            HabilitarDeshabilitarForm("#txtNroProcesoNI", false, "");
            HabilitarDeshabilitarForm("#txtNroRucNI", false, "");
            HabilitarDeshabilitarForm("#txtRazonSocialRucNI", false, "");

            //$('#cboTipoProcesoNI').attr('disabled', true);
            //$('#cboTipoCompraNI').attr('disabled', true);
            //$('#txtNroProcesoNI').attr('disabled', true);
            //$('#txtNroRucNI').attr('disabled', true);
            //$('#txtRazonSocialRucNI').attr('disabled', true);

            await NotaIngreso.ListarTiposCompraSegunFiltro("");
            $('#cboTipoCompraNI').val("1");
            await NotaIngreso.ListarTiposProcesoSegunFiltro("");
            $('#cboTipoProcesoNI').val("1");
        }

        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#chkPacienteForaneo').prop('checked', false);
        $('#chkPacienteForaneo').change();
        $("#framPacienteConHistoria").show();
        $("#framPacienteForaneo").hide();
        //$("#grdConsumoPaciente").hide();
        $("#txtNumeroSerieNI").val("");
        $("#txtNumeroCorrelativoNI").val("");

        NotaIngreso.LimpiarCamposPacienteDevolucion();
        if (concepto.niEsDevolucionPaciente == true) {
            HabilitarDeshabilitarForm("#chkPacienteForaneo", true, "");
            HabilitarDeshabilitarForm("#txtNroHistoriaPacienteNI", true, "");
            HabilitarDeshabilitarForm("#txtNroCuentaPacienteNI", true, "");
            HabilitarDeshabilitarForm("#txtNroDocumentoOrigenNI", false, "");
            HabilitarDeshabilitarForm("#txtFechaDocumentoOrigenNI", false, "");
            HabilitarDeshabilitarForm("#txtFechaRecepcionNI", true, "");
            HabilitarDeshabilitarForm("#btnBuscarCuentaPacienteNI", true, "");

            $("#txtFechaRecepcionNI").datepicker("setDate", ObtenerFechaActual());
        } else {
            HabilitarDeshabilitarForm("#chkPacienteForaneo", false, "");
            HabilitarDeshabilitarForm("#txtNroHistoriaPacienteNI", false, "");
            HabilitarDeshabilitarForm("#txtNroCuentaPacienteNI", false, "");
            HabilitarDeshabilitarForm("#btnBuscarCuentaPacienteNI", false, "");
        }

        if (NotaIngreso.elEstablecimientoEsCS) {
            await NotaIngreso.CargarComboFarmaciasOrigenNI(concepto.niFiltroAlmacenOrigenCS + " and idEstado = 1");
        } else {
            await NotaIngreso.CargarComboFarmaciasOrigenNI(concepto.niFiltroAlmacenOrigen + " and idEstado = 1");
        }

        NotaIngreso.tipoPrecioParaNiNs = concepto.tipoPrecioParaNiNs;
        GridProductos.TipoConcepto = concepto.idTipoConcepto;
        if ($("#cboConceptoNI").val() == 3) {
            //Donaciones
            NotaIngreso.esUnaDonacionOestrategico = sghTipoSalidaItemFarmacia.sghDonaciones
            HabilitarDeshabilitarForm("#txtNroRucNI", true, "");
        } else if ($("#cboConceptoNI").val() == 8) {
            //Estrategicos
            NotaIngreso.esUnaDonacionOestrategico = sghTipoSalidaItemFarmacia.sghSoloEstrategico
        } else {
            NotaIngreso.esUnaDonacionOestrategico = 0
        }

        NotaIngreso.lbDocumentoEsAutomatico = (concepto.documentoEsAutomatico == "S" ? true : false)
        if (NotaIngreso.lbDocumentoEsAutomatico) {
            NotaIngreso.prefijoNroDocumentoNI = concepto.prefijoDocumento;
            NotaIngreso.suffijoNroDocumentoNI = concepto.sufijoDocumento;
            NotaIngreso.nroDocumentoNI = parseInt(concepto.documentoUltimoNumero) + 1;
            HabilitarDeshabilitarForm("#txtNroDocumentoNI", false, "");
            $("#txtNroDocumentoNI").val(NotaIngreso.prefijoNroDocumentoNI + '0'.repeat(6 - NotaIngreso.nroDocumentoNI.length) + NotaIngreso.nroDocumentoNI + NotaIngreso.suffijoNroDocumentoNI);
        } else {
            NotaIngreso.prefijoNroDocumentoNI = "";
            NotaIngreso.suffijoNroDocumentoNI = "";
            NotaIngreso.nroDocumentoNI = "";
            HabilitarDeshabilitarForm("#txtNroDocumentoNI", true, "");
        }

    },

    async AgregarProducto(producto) {
        oTable_ProductosBuscados.fnClearTable();
        $("#txtCodigoProductoBusqueda").val("")
        $("#txtNombreProductoBusqueda").val("")
        $("#frameResultadosBusquedaProdutos").hide();

        if (NotaIngreso.ItemYaExiste(producto.idProducto, "", producto.fechaHoy, producto.idTipoSalidaBienInsumo, 0) == false) {
            producto.nombre = producto.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');
            producto.precioUnitario = await NotaIngreso.DevuelvePrecioSegunTipoConcepto(producto.idProducto, NotaIngreso.tipoPrecioParaNiNs);

            NotaIngreso.indexDetalle = NotaIngreso.indexDetalle + 1;
            producto.index = NotaIngreso.indexDetalle;
            producto.item = NotaIngreso.indexDetalle;

            oTable_DetalleNI.fnAddData(producto);
            oTable_DetalleNI.resize();

            $('.PickerFecha').datepicker({
                todayHighlight: true,
                autoclose: true,
                orientation: "bottom"
            });

            $.mask.definitions['D'] = '[0123]';
            $.mask.definitions['d'] = '[123456789]';
            $.mask.definitions['M'] = '[01]';
            $.mask.definitions['m'] = '[0123456789]';
            $.mask.definitions['a'] = '[12]';
            $.mask.definitions['b'] = '[0123456789]';
            $.mask.definitions['c'] = '[0123456789]';
            $.mask.definitions['d'] = '[0123456789]';
            $(".PickerFecha").mask("Dd/Mm/abcd");

            NotaIngreso.Totalizar();
        }

    },

    ItemYaExiste(idProducto, lote, fechaVencimiento, idTipoSalidaBienInsumo, index) {
        resp = false;
        let lstDetalleNI = NotaIngreso.DevolverDetalleNotaIngreso();
        lstDetalleNI.forEach(function (detalle) {
            if (detalle.idProducto == idProducto && detalle.Lote.trim() == lote.trim() && detalle.fVencimiento == fechaVencimiento && detalle.idTipoSalidaBienInsumo == idTipoSalidaBienInsumo && detalle.index != index) {
                resp = true;
                alerta2("info", "", "Este Producto/Tipo/Lote/FechaVencimiento ya está registrado");
            }
        });

        return resp;
    },

    Totalizar() {
        let lstDetalleNI = NotaIngreso.DevolverDetalleNotaIngreso();
        let total = 0.00;
        lstDetalleNI.forEach(function (detalle) {
            total = total + parseFloat((detalle.Total).toFixed(5));
        });

        $("#TotalDetalleNI").html("S/. " + parseFloat(total));
    },

    AgregarProductoDevolucion(producto) {
        console.log(producto);
        producto.nombre = producto.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');
        let cantidadADevolver = parseInt($('#txtCantCF_' + producto.idProducto).val());

        if (producto.idAlmacenOrigen != $("#cboFarmaciaDestinoNI").val()) {
            alerta2("warning", "", "El producto " + producto.codigo.trim() + " - " + producto.nombre.trim() + "  (NO TIENE NINGUN DESPACHO en el ALMACEN: " + $('#cboFarmaciaDestinoNI option:selected').text() + ")");
            return false;
        }

        if (cantidadADevolver <= 0) {
            alerta2("warning", "", "El producto " + producto.codigo.trim() + " - " + producto.nombre.trim() + "  (No debe devolver una cantidad menor o igual a: 0)");
            return false;
        }

        if (cantidadADevolver > producto.cantidadConsumoQueda) {
            alerta2("warning", "", "El producto " + producto.codigo.trim() + " - " + producto.nombre.trim() + "  (No debe devolver una cantidad mayor a: " + parseInt(producto.cantidadConsumoQueda) + ")");
            return false;
        }

        producto.cantidadDevolver = cantidadADevolver;
        producto.precioTotalDevolver = parseFloat((cantidadADevolver * producto.precio).toFixed(4));

        if (NotaIngreso.ExisteProductoDevolucion(producto) == false) {
            //var objRow = {
            //    idProducto = producto.idProducto,
            //    idAlmacenOrigen = producto.idAlmacenOrigen,
            //    numeroDocumento = producto.documentoNumero,
            //    fechaDocumento = producto.fechaCreacion,
            //    codigo = producto.codigo,
            //    nombreProducto = producto.nombre,
            //    cantidad = producto.cantidadConsumoQueda,
            //    farmaciaDespacho = producto.dAlmacen,
            //    precio = producto.precio,
            //    total = producto.totalPrecio,
            //    movNumero = producto.movNumero,
            //    idTipoFinanciamiento = producto.idTipoFinanciamiento,
            //    idOrden = producto.idOrden
            //}

            //if()

            oTable_DetalleDevolucion.fnAddData(producto);
            oTable_DetalleDevolucion.resize();

            NotaIngreso.QuitarProductoConsumoFarmacia();
        }
    },

    AgregarProductosParaDevolver() {
        oTable_DetalleNI.fnClearTable();
        let productoDevolucion = oTable_DetalleDevolucion.api(true).data().toArray();
        let objItemDetalle = null;
        for (let [i, obj] of productoDevolucion.entries()) {
            objItemDetalle = {
                idProducto: obj.idProducto,
                codigo: obj.codigo,
                nombre: obj.nombre,
                tipo: obj.tipo,
                lote: obj.lote,
                fechaVencimiento: FormatearFecha(obj.fechaVencimiento),
                //cantidad: obj.cantidadConsumoQueda,
                cantidad: obj.cantidadDevolver,
                precioUnitario: obj.precio,
                //total: obj.totalPrecio,
                total: obj.precioTotalDevolver,
                registroSanitario: obj.registroSanitario,
                idTipoSalidaBienInsumo: obj.idTipoSalidaBienInsumo,
                idOrden: obj.idOrden,
                idEstadoFacturacion: obj.idEstadoFacturacion,
                cantidadS: obj.cantidadS,
                precioS: obj.precioS,
                idFuenteFinanciamientoS: obj.idFuenteFinanciamientoS,
                fechaS: obj.fechaS,
                idUsuarioAutorizaS: obj.idUsuarioAutorizaS
            }
            oTable_DetalleNI.fnAddData(objItemDetalle);
        }
        oTable_DetalleNI.resize();
    },


    ExisteProductoDevolucion(producto) {

        let objrow = oTable_DetalleDevolucion.api(true).rows().data();
        //console.log(producto)
        //console.log(objrow)
        if (objrow.length == 0) {
            return false;
        }

        for (let i = 0; i < objrow.length; i++) {
            if (objrow[i].idProducto == producto.idProducto && objrow[i].movNumero == producto.movNumero) {
                alerta2("info", "", "El Producto/NumeroDocumento ya se eligió.");
                return true;
            }

            if (objrow[i].idProducto == producto.idProducto && objrow[i].lote == producto.lote && FormatearFecha(objrow[i].fehaVencimiento) == FormatearFecha(producto.fechaVencimiento)) {
                alerta2("info", "", "El producto " + producto.nombre + "  (tiene LOTE y FECHA VENCIMIENTO repetidas)");
                return true;
            }
        }

        return false;
    },

    QuitarProducto() {
        oTable_DetalleNI.api(true).row('.selected').remove().draw(false);
        oTable_DetalleNI.resize();
    },

    QuitarProductoConsumoFarmacia() {
        let objrow = oTable_DetalleConsumoFarmacia.api(true).row('.selected').data();
        if (!isEmpty(objrow)) {
            oTable_DetalleConsumoFarmacia.api(true).row('.selected').remove().draw(false);
            oTable_DetalleConsumoFarmacia.resize();
        } else {
            alerta2("info", "", "Debe seleccionar el Producto/NumeroDocumento a eliminar.");
        }
    },

    QuitarProductoDevolucion() {
        let objrow = oTable_DetalleDevolucion.api(true).row('.selected').data();
        if (!isEmpty(objrow)) {
            oTable_DetalleDevolucion.api(true).row('.selected').remove().draw(false);
            oTable_DetalleDevolucion.resize();

            oTable_DetalleConsumoFarmacia.fnAddData(objrow);
            oTable_DetalleConsumoFarmacia.resize();
        } else {
            alerta2("info", "", "Debe seleccionar el Producto/NumeroDocumento a eliminar.");
        }
    },


    ////////////////////////////////////VALIDACIONES////////////////////////////////////////////////////////////
    async ValidarDatosObligatorios() {
        let almacen = $("#TipoFarmacia").html() == "A" ? "Almacén" : "Farmacia";
        let fechaRegistro = "";

        const regenerando = await NotaIngreso.SeleccionarFarmaciaNI($("#cboFarmaciaDestinoNI").val());
        if (isEmpty(regenerando) == false && regenerando.regenerarEstado == "P") {
            alerta2("warning", "", "En este momento se está REGENERANDO SALDOS.");
            return false;
        }

        if (isEmpty($("#cboFarmaciaDestinoNI").val())) {
            if ($("#TipoFarmacia").html() == "A") {
                alerta2("info", "", "Por favor elija el Almacén Destino.");
            } else if ($("#TipoFarmacia").html() == "F") {
                alerta2("info", "", "Por favor elija la Farmacia Destino.");
            }
            return false;
        }

        if ($("#cboFarmaciaDestinoNI").val() == $("#cboFarmaciaOrigenNI").val()) {
            if ($("#TipoFarmacia").html() == "A") {
                alerta2("info", "", "El Almacén Origen y Destino deben ser DIFERENTES.");
            } else if ($("#TipoFarmacia").html() == "F") {
                alerta2("info", "", "La Farmacia Origen y Destino deben ser DIFERENTES.");
            }
            return false;
        }

        if (isEmptyValue($("#cboConceptoNI").val())) {
            alerta2("info", "", "Por favor elija el Concepto.");
            return false;
        }

        if (isEmptyValue($("#cboFarmaciaOrigenNI").val())) {
            if ($("#TipoFarmacia").html() == "A") {
                alerta2("info", "", "Por favor elija el Almacén Origen.");
            } else if ($("#TipoFarmacia").html() == "F") {
                alerta2("info", "", "Por favor elija la Farmacia Origen.");
            }
            return false;
        }

        if (!isDisabledElement("#txtNroDocumentoNI") && isEmptyValue($("#txtNroDocumentoNI").val())) {
            $("#txtNroDocumentoNI").focus();
            alerta2("info", "", "Por favor ingrese el N° Documento.");
            return false;
        }

        if (!isDisabledElement("#txtFechaRecepcionNI") && isEmptyValue($("#txtFechaRecepcionNI").val())) {
            $("#txtFechaRecepcionNI").focus();
            alerta2("info", "", "Por favor ingrese la Fecha de Recepción.");
            return false;
        }

        if (!isDisabledElement("#txtNroDocumentoOrigenNI") && isEmptyValue($("#txtNroDocumentoOrigenNI").val())) {
            $("#txtNroDocumentoOrigenNI").focus();
            alerta2("info", "", "Por favor ingrese el N° Documento Origen.");
            return false;
        }

        if (!isDisabledElement("#txtFechaDocumentoOrigenNI") && isEmptyValue($("#txtFechaDocumentoOrigenNI").val())) {
            $("#txtFechaDocumentoOrigenNI").focus();
            alerta2("info", "", "Por favor ingrese la Fecha del Documento Origen");
            return false;
        }

        if (!isDisabledElement("#cboTipoProcesoNI") && isEmptyValue($("#cboTipoProcesoNI").val())) {
            $("#cboTipoProcesoNI").focus();
            alerta2("info", "", "Por favor elija el Tipo de Proceso");
            return false;
        }

        if (!isDisabledElement("#txtNroProcesoNI") && isEmptyValue($("#txtNroProcesoNI").val())) {
            $("#txtNroProcesoNI").focus();
            alerta2("info", "", "Por favor ingrese el N° de Proceso");
            return false;
        }

        if (!isDisabledElement("#cboTipoCompraNI") && isEmptyValue($("#cboTipoCompraNI").val())) {
            $("#cboTipoCompraNI").focus();
            alerta2("info", "", "Por favor elija el Tipo de Compra");
            return false;
        }

        if (!isDisabledElement("#txtNroRucNI") && isEmptyValue($("#txtNroRucNI").val())) {
            $("#txtNroRucNI").focus();
            alerta2("info", "", "Por favor ingrese el N° de RUC");
            return false;
        }

        if (!isDisabledElement("#txtRazonSocialRucNI") && isEmptyValue($("#txtRazonSocialRucNI").val())) {
            $("#txtRazonSocialRucNI").focus();
            alerta2("info", "", "Por favor ingrese la Razón Social");
            return false;
        }

        if ($("#cboConceptoNI").val() == 21) {
            if ($("#chkPacienteForaneo").is(":checked") == false) {
                if (isEmptyValue($("#txtNroCuentaPacienteNI").val()) && NotaIngreso.idCuentaDevolucion == 0) {
                    $("#txtNroCuentaPacienteNI").focus();
                    alerta2("info", "", "Por favor ingrese el N° de Cuenta del Paciente que devuelve");
                    return false;
                }
            } else {
                if (isEmptyValue($("#txtNumeroSerieNI").val()) && NotaIngreso.idComprobantePagoDevolucion == 0) {
                    $("#txtNumeroSerieNI").focus();
                    alerta2("info", "", "Por favor ingrese el N° de Cuenta del Paciente que devuelve");
                    return false;
                }

                if (isEmptyValue($("#txtNumeroCorrelativoNI").val()) && NotaIngreso.idComprobantePagoDevolucion == 0) {
                    $("#txtNumeroCorrelativoNI").focus();
                    alerta2("info", "", "Por favor ingrese el N° de Cuenta del Paciente que devuelve");
                    return false;
                }
            }
        }

        //const fechaRegistro = await Utilitario.FechaHoraServidor();
        fechaRegistro = $("#txtFechaRegistroNotaIngreso").val();
        if (esFormatoFecha($("#txtFechaRecepcionNI").val())) {
            if (cDate($("#txtFechaRecepcionNI").val()) > cDate(fechaRegistro)) {
                $("#txtFechaRecepcionNI").focus();
                alerta2("info", "", "La Fecha de Recepción no puede ser mayor a la Fecha de Registro");
                return false;
            }
        }

        if (esFormatoFecha($("#txtFechaDocumentoOrigenNI").val())) {
            if (cDate($("#txtFechaDocumentoOrigenNI").val()) > cDate(fechaRegistro)) {
                $("#txtFechaDocumentoOrigenNI").focus();
                alerta2("info", "", "La Fecha de Doc.Origen no puede ser mayor a la Fecha de Registro");
                return false;
            }
        }

        if (NotaIngreso.accion == "A") {
            const documentoRegistro = await NotaIngreso.FarmMovimientoSeleccionarPorTipoYnumeroDocumento($("#txtNroDocumentoNI").val(), $("#cboTipoDocumentoNI").val());
            if (!isEmptyValue(documentoRegistro)) {
                if (documentoRegistro.idEstadoMovimiento == 1) {
                    $("#txtNroDocumentoNI").focus();
                    alerta2("info", "Ya Existe", "El Número de Documento: " + $("#txtNroDocumentoNI").val() + "<br>" + "NI: " + documentoRegistro.movNumero.trim() + "<br>" + "Fecha: " + FormatearFecha(documentoRegistro.fechaCreacion) + " " + FormatearHora(documentoRegistro.fechaCreacion) + "<br>" + "Intente probar con el siguiente número de documento.");
                    return false;
                }
            }
        }

        if ($("#cboConceptoNI").val() == 21) {      //DEVOLUCION DE PACIENTE
            if (isEmpty(NotaIngreso.idFuenteFinanciamientoDevolucion)) {
                NotaIngreso.idFuenteFinanciamientoDevolucion = 1        //CONTADO = es un Paciente sin Nro Cuenta
                NotaIngreso.idTipoFinanciamientoDevolucion = 1
            }
        }

        if ($("#cboConceptoNI").val() == 21 && isEmpty($("#txtNroCuentaPacienteNI").val()) == false && isEmpty(NotaIngreso.idCuentaDevolucion) == false) {      //DEVOLUCION DE PACIENTE
            if ($("#txtNroCuentaPacienteNI").val() == NotaIngreso.idCuentaDevolucion) {
                NotaIngreso.AgregarProductosParaDevolver();
            }
        }

        //console.log(documentoRegistro);

        if (oTable_DetalleNI.api(true).data().toArray().length == 0) {
            alerta2("info", "", 'Ingrese al menos un producto a la lista por favor.')
            return false;
        }

        let fechaMinimaDespacho = null;
        if ($("#cboConceptoNI").val() == 5) {      //DEVOLUCION POR VENCIMIENTO
            const fechaHoy = await Utilitario.FechaHoraServidor();
            fechaMinimaDespacho = cDate(fechaHoy);
            fechaMinimaDespacho.setDate(fechaMinimaDespacho.getDate() - 300);
            fechaMinimaDespacho = new Date(fechaMinimaDespacho);
        } else {
            let valorParametro = await Utilitario.SeleccionarParametro(224);
            let diasVencimiento = parseInt(valorParametro.valorTexto);
            fechaMinimaDespacho = cDate(fechaRegistro);
            fechaMinimaDespacho.setDate(fechaMinimaDespacho.getDate() + diasVencimiento);
            fechaMinimaDespacho = new Date(fechaMinimaDespacho);
        }


        let lstDetalleNI = NotaIngreso.DevolverDetalleNotaIngreso();
        let mensajeError = "";

        //Es un despacho hacia la FARMACIA UNIDOSIS
        let esUnidosis = parseInt($('#cboFarmaciaDestinoNI option:selected').attr('esUnidosis'));
        let esProductoUnidosis = null;
        if (esUnidosis == 1) {
            lstDetalleNI.forEach(function (detalle) {
                //let idProductoBuscado = parseInt(detalle.idProducto);
                esProductoUnidosis = null;
                esProductoUnidosis = NotaIngreso.oRsItemsUnidosis.find(function (unidosis) { return parseInt(unidosis.idProductoConPunto) == parseInt(detalle.idProducto); });
                console.log(esProductoUnidosis);
                if (isEmpty(esProductoUnidosis) == true) {
                    mensajeError = mensajeError + "El ITEM " + detalle.codigo + " - " + detalle.nombre + " no pertenece a FARMACIA UNIDOSIS\n";
                }

            });

        } else {
            lstDetalleNI.forEach(function (detalle) {
                esProductoUnidosis = null;
                if (NotaIngreso.oRsItemsUnidosis) {
                    esProductoUnidosis = NotaIngreso.oRsItemsUnidosis.find(function (unidosis) { return parseInt(unidosis.idProductoConPunto) == parseInt(detalle.idProducto); });
                    console.log(esProductoUnidosis);
                    if (isEmpty(esProductoUnidosis) == false) {
                        mensajeError = mensajeError + "El ITEM " + detalle.codigo + " - " + detalle.nombre + " solo es usado en FARMACIA UNIDOSIS\n";
                    }
                }

            });
        }

        if (isEmpty(mensajeError) == false) {
            alerta2("warning", "", "<div class='text-sm-left small'>" + mensajeError + "</div>");
            return false;
        }

        ///////////VERIFICA INFORMACION/////////////////////    
        mensajeError = "";
        for (let [i, obj] of lstDetalleNI.entries()) {
            if (obj.Lote.trim() == "") {
                mensajeError = mensajeError + "Tiene problemas en el LOTE.\n";
            }

            if (cDate(obj.fVencimiento) <= fechaMinimaDespacho) {
                mensajeError = mensajeError + "Tiene problemas con la FECHA DE VENCIMIENTO, debe ser mayor a " + FormatearFecha(fechaMinimaDespacho) + ".\n";
            }

            if (obj.Cantidad <= 0) {
                mensajeError = mensajeError + "Tiene problemas con la CANTIDAD.\n";
            }

            if (obj.Precio <= 0) {
                mensajeError = mensajeError + "Tiene problemas con el Precio.\n";
            }

            if (isEmpty(obj.RegistroSanitario) && $('#cboConceptoNI').val() != 21) {
                mensajeError = mensajeError + "Debe ingresar el REGISTRO SANITARIO.\n";
            }


            const validaLote = await NotaIngreso.ValidarLote(obj.idAlmacenDestino, obj.idProducto, isNull(obj.Lote, "_"), obj.fVencimiento);
            if (isEmpty(validaLote) == false) {
                if (validaLote.respuesta == 1) {
                    mensajeError = mensajeError + "Ya existe el lote, su fecha de vencimiento es " + FormatearFecha(validaLote.fechaVencimiento) + ", se actualizara en el listado.";
                    $('#txtFechaVencNI_' + obj.idProducto).datepicker("setDate", FormatearFecha(validaLote.fechaVencimiento));
                }
            }

            if (isEmpty(mensajeError) == false) {
                alerta2("warning", "", "<div class='text-sm-left small'>" + "<span class='font-weight-bold'>El producto " + obj.codigo.trim() + " - " + obj.nombre.trim() + ":</span>\n" + mensajeError + "</div>");
                return false;
            }

        }


        return true; ///LEUGO CAMBIAR
    },

    DevolverDetalleNotaIngreso() {
        const detalleNotaIngreso = [];
        const lstDetalleNotaIngreso = oTable_DetalleNI.api(true).data().toArray();

        for (const [i, obj] of lstDetalleNotaIngreso.entries()) {
            const $lote = $(`#txtLoteNI_${obj.idProducto}_${obj.item}[data-fila='${obj.item}']`);
            const $fechaVenc = $(`#txtFechaVencNI_${obj.idProducto}_${obj.item}[data-fila='${obj.item}']`);
            const $cant = $(`#txtCantNI_${obj.idProducto}_${obj.item}`);
            const $precio = $(`#txtPrecioNI_${obj.idProducto}_${obj.item}`);
            const $regSan = $(`#txtRegSanNI_${obj.idProducto}_${obj.item}[data-fila='${obj.item}']`);

            const cantidad = parseInt($cant.val()) || 0;
            const precio = parseFloat($precio.val()) || 0;
            const fechaRaw = $fechaVenc.val();

            detalleNotaIngreso.push({
                index: obj.item,
                idProducto: obj.idProducto,
                codigo: obj.codigo,
                nombre: obj.nombre,
                Lote: $lote.val() ?? '',
                FechaVencimiento: fechaRaw ? ConvertirFormatoFecha(fechaRaw) : '',  // yyyy-mm-dd
                fVencimiento: fechaRaw ?? '',                                   // dd/mm/yyyy
                idTipoSalidaBienInsumo: obj.idTipoSalidaBienInsumo,
                Item: i + 1,
                Cantidad: cantidad,
                Precio: parseFloat(precio.toFixed(4)),
                Total: parseFloat((cantidad * precio).toFixed(4)),
                RegistroSanitario: $regSan.val() ?? '',
                DocumentoNumero: $('#txtNroNotaIngreso').val(),
                idAlmacenOrigen: $('#cboFarmaciaOrigenNI').val(),
                idAlmacenDestino: $('#cboFarmaciaDestinoNI').val(),
                stock: 0,
                stockTotal: 0,
            });
        }

        return detalleNotaIngreso;
    },


    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////DATOS DE LA VISTA////////////////////////////////////////////////////
    async CargarDatosRegistro() {

        let fechaRegistro = "";
        if (NotaIngreso.accion == "A") {
            fechaRegistro = await Utilitario.FechaHoraServidor();
            $("#txtFechaRegistroNotaIngreso").val(fechaRegistro);
        } else {
            let objrowNi = oTable_NotasIngreso.api(true).row('.selected').data();

            if (isEmpty(objrowNi)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return false
            }

            let cabeceraNI = await NotaIngreso.FarmMovimientoSeleccionar(objrowNi.movNumero, 'E');
            if (isEmpty(cabeceraNI) == false) {
                $("#txtNroNotaIngreso").val(cabeceraNI.movNumero);
                $("#txtFechaRegistroNotaIngreso").val(FormatearFecha(cabeceraNI.fechaCreacion) + ' ' + FormatearHora(cabeceraNI.fechaCreacion));
                $("#txtEstadoNotaIngreso").val(cabeceraNI.estadoMovimiento);

                $("#cboFarmaciaDestinoNI").val(cabeceraNI.idAlmacenDestino);
                await NotaIngreso.FarmaciaDestinoNI_Change();
                $("#cboConceptoNI").val(cabeceraNI.idTipoConcepto);
                await NotaIngreso.ConceptoNI_Change();
                $("#cboFarmaciaOrigenNI").val(cabeceraNI.idAlmacenOrigen);

                $("#cboTipoDocumentoNI").val(cabeceraNI.documentoIdtipo);
                $("#txtNroDocumentoNI").val(cabeceraNI.documentoNumero);
                $("#txtFechaRecepcionNI").datepicker("setDate", FormatearFecha(cabeceraNI.documentoFechaRecepcion))

                $("#cboTipoDocumentoOrigenNI").val(cabeceraNI.origenIdTipo);
                $("#txtNroDocumentoOrigenNI").val(cabeceraNI.origenNumero);
                $("#txtFechaDocumentoOrigenNI").datepicker("setDate", FormatearFecha(cabeceraNI.origenFecha))

                $("#cboTipoProcesoNI").val(cabeceraNI.idTipoProceso);
                $("#txtNroProcesoNI").val(cabeceraNI.numeroProceso);

                $("#cboTipoCompraNI").val(cabeceraNI.idTipoCompra);
                $("#txtNroRucNI").val(cabeceraNI.ruc);
                $("#txtRazonSocialRucNI").val(cabeceraNI.razonSocial);
                NotaIngreso.idProveedor = cabeceraNI.idProveedor;

                $("#txtObservacionesNI").val(cabeceraNI.observaciones);

                NotaIngreso.esNotaIngresoAutomatica = objrowNi.esNotaIngresoAutomatica;

            }

            $('.chzn-select').chosen().trigger("chosen:updated");

            await NotaIngreso.FarmMovimientoDetalleSeleccionar(objrowNi.movNumero, 'E');

            if (NotaIngreso.accion == "M" || NotaIngreso.accion == "E") {
                if (NotaIngreso.esNotaIngresoAutomatica == 1) {
                    alerta2("info", "", "No podrá Modificar/Anular esta Nota de Ingreso porque se generó a partir de una NS: " + objrowNi.movNumeroSalida);
                } else {
                    let lstDetalleNI = NotaIngreso.DevolverDetalleNotaIngreso();
                    let lstSalidas = null;
                    NotaIngreso.tieneDespacho = 0;
                    lstDetalleNI.forEach(async function (detalle) {
                        if (NotaIngreso.tieneDespacho == 0) {
                            lstSalidas = await NotaIngreso.FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote(detalle.idAlmacenDestino, detalle.idProducto, detalle.Lote, detalle.fVencimiento);
                            if (isEmpty(lstSalidas) == false) {
                                if (cDateTime(FormatearFecha(lstSalidas[0].fechaCreacion) + ' ' + FormatearHora(lstSalidas[0].fechaCreacion)) >= cDateTime(FormatearFecha(cabeceraNI.fechaCreacion) + ' ' + FormatearHora(cabeceraNI.fechaCreacion))) {
                                    NotaIngreso.tieneDespacho = 1;
                                    alerta2("info", "", "No podrá Modificar/Anular una NI porque ya se despachó el producto: \n" + detalle.codigo.trim() + " - " + detalle.nombre.trim() + "   NS: " + lstSalidas[0].movNumero);
                                    NotaIngreso.ValidarModificacion();
                                }
                            }
                        }
                    });
                }
            }



        }

        MostrarAreaRegistro();
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////GUARDAR NOTA INGRESO////////////////////////////////////////////////////////////
    async GuardarNotaIngreso() {
        const valida = await NotaIngreso.ValidarDatosObligatorios()
        if (valida == false) {
            return false;
        }

        let cabeceraNotaIngreso = [];
        let detalleNotaIngreso = NotaIngreso.DevolverDetalleNotaIngreso();

        console.log(detalleNotaIngreso)

        let MovNumero

        if (NotaIngreso.accion == "A") {
            MovNumero = await NotaIngreso.FarmDevuelveYactualizaCorrelativosDeDocumentosES(1) // 2 - Nota de Ingreso
        } else {
            MovNumero = $('#txtNroNotaIngreso').val()
        }



        let MovNumeroNotaIngreso = MovNumero
        const NotaIngresoAgregar = await NotaIngreso.FarmMovimientoAgregarModificar(MovNumero, 'E', $('#cboFarmaciaOrigenNI').val(), $('#cboFarmaciaDestinoNI').val(), $('#cboConceptoNI').val(), $('#cboTipoDocumentoNI').val(), $('#txtNroDocumentoNI').val(),
            $('#txtFechaRecepcionNI').val(), $('#cboTipoDocumentoOrigenNI').val(), $('#txtNroDocumentoOrigenNI').val(), $('#txtFechaDocumentoOrigenNI').val(),
            NotaIngreso.idProveedor, $("#txtNroRucNI").val(), $("#txtRazonSocialRucNI").val(),
            $('#cboTipoCompraNI').val(), $('#cboTipoProcesoNI').val(), $('#txtNroProcesoNI').val(),
            NotaIngreso.idPacienteDevolucion, NotaIngreso.idCuentaDevolucion, NotaIngreso.idComprobantePagoDevolucion, NotaIngreso.idFuenteFinanciamientoDevolucion,
            $('#txtObservacionesNI').val(), 0, 1, 0, JSON.stringify(detalleNotaIngreso))

        if (NotaIngresoAgregar > 0) {
            swal({
                title: 'Salir',
                html: "Se agregó Nota de Ingreso N° " + MovNumeroNotaIngreso,
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            })

            MostrarAreaLista();
        }


        return true;
    },

    async AnularNotaIngreso() {
        const valida = await NotaIngreso.ValidarDatosObligatorios()
        if (valida == false) {
            return false;
        }

        let cabeceraNotaIngreso = [];
        let detalleNotaIngreso = NotaIngreso.DevolverDetalleNotaIngreso();

        console.log(detalleNotaIngreso)

        let MovNumero

        if (NotaIngreso.accion == "A") {
            MovNumero = await NotaIngreso.FarmDevuelveYactualizaCorrelativosDeDocumentosES(1) // 2 - Nota de Ingreso
        } else {
            MovNumero = $('#txtNroNotaIngreso').val()
        }



        let MovNumeroNotaIngreso = MovNumero
        const NotaIngresoAgregar = await NotaIngreso.FarmMovimientoAgregarModificar(MovNumero, 'E', $('#cboFarmaciaOrigenNI').val(), $('#cboFarmaciaDestinoNI').val(), $('#cboConceptoNI').val(), $('#cboTipoDocumentoNI').val(), $('#txtNroDocumentoNI').val(),
            $('#txtFechaRecepcionNI').val(), $('#cboTipoDocumentoOrigenNI').val(), $('#txtNroDocumentoOrigenNI').val(), $('#txtFechaDocumentoOrigenNI').val(),
            NotaIngreso.idProveedor, $("#txtNroRucNI").val(), $("#txtRazonSocialRucNI").val(),
            $('#cboTipoCompraNI').val(), $('#cboTipoProcesoNI').val(), $('#txtNroProcesoNI').val(),
            NotaIngreso.idPacienteDevolucion, NotaIngreso.idCuentaDevolucion, NotaIngreso.idComprobantePagoDevolucion, NotaIngreso.idFuenteFinanciamientoDevolucion,
            $('#txtObservacionesNI').val(), 0, 0, 0, JSON.stringify(detalleNotaIngreso))

        if (NotaIngresoAgregar > 0) {
            swal({
                title: 'Salir',
                html: "Se anulo Nota de Ingreso N° " + MovNumeroNotaIngreso,
                icon: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            })

            MostrarAreaLista();
        }


        return true;
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////METODOS BACKED///////////////////////////////////////////////////////////
    async ListarNotasIngresos() {
        let respuesta;
        let resp = false;
        let datos
        let data = new FormData();

        if (NotaIngreso.ValidarBusquedaNotasIngreso() == false) {
            return false;
        }

        data.append('IdAlmacen', $("#cboFarmaciasBusq").val());
        data.append('NroCuenta', $("#txtNroCuentaBusq").val());
        data.append('FechaInicio', $("#txtFechaInicioBusq").val());
        data.append('FechaFin', $("#txtFechaFinalBusq").val());

        try {
            Cargando(1);
            oTable_NotasIngreso.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaIngreso/ListarNotasIngresos?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_NotasIngreso.fnAddData(datos.respuesta.table);
                oTable_NotasIngreso.resize();
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

    async SeleccionarFarmaciaNI(idFarmacia) {
        let datos = null;
        resp = null;
        let filtroFarmacia = " idAlmacen=" + idFarmacia;
        let form = new FormData();
        form.append('filtro', filtroFarmacia);
        try {
            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
                    data: form,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData.table.length > 0) {
                resp = datos.lstData.table[0];
                console.log(resp);
            }

        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta2("error", "", error);
        }

        return resp;
    },

    async SeleccionarConceptoNI(idTipoConcepto) {
        let resp = null;
        let midata = new FormData();
        midata.append('IdTipoConcepto', idTipoConcepto);
        midata.append('TipoAlmacen', $("#TipoFarmacia").html());
        midata.append('TipoMov', 'E');
        midata.append('TipoSuministro', $('#cboFarmaciaDestinoNI option:selected').attr('tipoSuministro'));

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmTipoConceptoDevuelveParaRegistroDeNiNsSeleccionar?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData.table.length > 0) {
                resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
        }
        return resp;
    },

    async ListarTiposCompraSegunFiltro(filtro) {
        let respuesta;
        let resp = false;
        let datos
        let data = new FormData();
        let descripcion = "";

        data.append('filtro', filtro);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/ListarTiposCompraSegunFiltro?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            $('#cboTipoCompraNI').empty();
            if (datos.lstData.table.length > 0) {
                $(datos.lstData.table).each(function (i, obj) {
                    descripcion = obj.descripcion;
                    descripcion = descripcion.replace(/</g, '-');
                    descripcion = descripcion.replace(/>/g, '-');
                    $('#cboTipoCompraNI').append('<option value="' + obj.idTipoCompra + '" codigoMinsa="' + obj.codigoMINSA + '">' + descripcion + '</option>');
                });
            }
            $('#cboTipoCompraNI').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

    },

    async ListarTiposProcesoSegunFiltro(filtro) {
        let respuesta;
        let resp = false;
        let descripcion = "";
        let datos
        let data = new FormData();

        data.append('filtro', filtro);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/ListarTiposProcesoSegunFiltro?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            $('#cboTipoProcesoNI').empty();
            if (datos.lstData.table.length > 0) {
                $(datos.lstData.table).each(function (i, obj) {
                    descripcion = obj.descripcion;
                    descripcion = descripcion.replace(/</g, '-');
                    descripcion = descripcion.replace(/>/g, '-');
                    $('#cboTipoProcesoNI').append('<option value="' + obj.idTipoProceso + '" codigoMinsa="' + obj.codigoMINSA + '">' + descripcion + '</option>');
                });
            }
            $('#cboTipoProcesoNI').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

    },

    async SeleccionarProveedoresPorRuc(ruc) {
        let respuesta;
        let resp = false;
        let descripcion = "";
        let datos
        let data = new FormData();

        data.append('ruc', ruc);

        NotaIngreso.idProveedor = null;
        HabilitarDeshabilitarForm("#txtRazonSocialRucNI", false, "");
        if (ruc.length != 11) {
            HabilitarDeshabilitarForm("#txtRazonSocialRucNI", true, "");

            alerta2("", "", "El Número de RUC debe tener 11 dígitos");
            return false;
        }

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/ProveedorSeleccionarporRuc?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.resultado.table.length > 0) {
                $(datos.resultado.table).each(function (i, obj) {
                    NotaIngreso.idProveedor = obj.idProveedor;
                    $("#txtRazonSocialRucNI").val(obj.razonSocial);
                });
            } else {
                HabilitarDeshabilitarForm("#txtRazonSocialRucNI", true, "");
                NotaIngreso.idProveedor = 0;
            }
        } catch (error) {
            Cargando(0);
            HabilitarDeshabilitarForm("#txtRazonSocialRucNI", true, "");
            alerta2('danger', "", JSON.stringify(error));
        }

    },

    async SeleccionarAtencionPorCuenta(idCuenta) {
        let respuesta;
        let resp = false;
        let descripcion = "";
        let datos
        let data = new FormData();

        data.append('idCuenta', idCuenta);

        try {
            NotaIngreso.LimpiarCamposPacienteDevolucion();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionPorCuentaAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            let estadoCuenta = false;
            if (datos.resultado.table.length > 0) {
                $(datos.resultado.table).each(function (i, obj) {
                    if (obj.idEstado != 1) {
                        estadoCuenta = false;
                        alerta2("info", "", "El estado de la cuenta no se encuentra abierta.");
                    } else {
                        estadoCuenta = true;
                        $("#txtNroCuentaPacienteNI").val(obj.idCuentaAtencion);
                        $("#txtNroHistoriaPacienteNI").val(obj.nroHistoriaClinica);
                        $("#txtNombrePacienteNI").val(obj.apellidoPaterno.trim() + " " + obj.apellidoMaterno.trim() + " " + obj.primerNombre.trim());
                        $("#txtServicioPacienteNI").val("IAFA Act: " + obj.dFuenteFinanciamiento.trim() + "  F.Ing: " + FormatearFecha(obj.fechaIngreso) + "- " + (obj.idTipoServicio == 1 ? "Consultorios Externos" : (obj.idTipoServicio == 3 ? "Hospitalización" : "Emergencia")) + "- (Est: " + obj.estadoCta.trim() + ")");
                        NotaIngreso.idCuentaDevolucion = obj.idCuentaAtencion;
                        NotaIngreso.idPacienteDevolucion = obj.idPaciente;
                        NotaIngreso.idTipoServicioDevolucion = obj.idTipoServicio;
                        NotaIngreso.idFuenteFinanciamientoDevolucion = obj.idFuenteFinanciamiento;
                        NotaIngreso.idTipoFinanciamientoDevolucion = obj.idFormaPago;
                        NotaIngreso.idComprobantePagoDevolucion = null;

                        $("#txtNroCuentaPacienteCF").val(obj.idCuentaAtencion);
                        $("#txtNroHistoriaPacienteCF").val(obj.nroHistoriaClinica);
                        $("#txtNombrePacienteCF").val(obj.apellidoPaterno.trim() + " " + obj.apellidoMaterno.trim() + " " + obj.primerNombre.trim());
                        $("#txtServicioPacienteCF").val("IAFA Act: " + obj.dFuenteFinanciamiento.trim() + "  F.Ing: " + FormatearFecha(obj.fechaIngreso) + "- " + (obj.idTipoServicio == 1 ? "Consultorios Externos" : (obj.idTipoServicio == 3 ? "Hospitalización" : "Emergencia")) + "- (Est: " + obj.estadoCta.trim() + ")");

                    }
                });

                if (estadoCuenta) {
                    await NotaIngreso.ListarConsumoFarmacia(NotaIngreso.idCuentaDevolucion);
                    $("#modalConsumoFarmacia").modal("show");
                }

            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', "", JSON.stringify(error));
        }

    },

    async ListarProductosUnidosis() {
        let respuesta;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Farmacias/FarmUnidosisSeleccionarTodos?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                resp = datos.lstData.table;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarConsumoFarmacia(idCuenta) {
        let respuesta;
        let resp = false;
        let descripcion = "";
        let datos
        let data = new FormData();

        data.append('idCuenta', idCuenta);

        try {
            oTable_DetalleConsumoFarmacia.fnClearTable();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/ListarConsumoFarmacia?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.resultado.table.length > 0) {
                oTable_DetalleConsumoFarmacia.fnAddData(datos.resultado.table);
                oTable_DetalleConsumoFarmacia.resize();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

    },

    async ListarProductosBuscados(tipoBusqueda, busqueda, idTipoFinanciamiento, idPuntoCarga) {
        resp = null;
        let filtroBusqueda = "";
        let midata = new FormData();

        try {
            oTable_ProductosBuscados.fnClearTable();
            if (busqueda.length >= 3 && $('#cboFarmaciaDestinoNI').val() > 0 && $('#cboConceptoNI').val() > 0) {
                if (idPuntoCarga != 1 && idPuntoCarga != 99) {
                    filtroBusqueda = filtroBusqueda + " and FactPuntosCargaBienesInsumos.IdPuntoCarga = " + idPuntoCarga
                }

                if (idTipoFinanciamiento != 0) {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoBienesInsumosHosp.IdTipoFinanciamiento = " + idTipoFinanciamiento
                }

                if (busqueda != "") {
                    if (tipoBusqueda == "C") {      //C: busqeuda por codigo
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoBienesInsumos.Codigo like '" + busqueda + "%' "
                    } else if (tipoBusqueda == "N") {       //N: busqeuda por nombre
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoBienesInsumos.Nombre like '" + busqueda + "%' "
                    }
                }

                //midata.append('lnIdAlmacen', $('#cboFarmaciaDestinoNI').val());
                midata.append('lcFiltro', filtroBusqueda);

                Cargando(1);
                $("#frameResultadosBusquedaProdutos").show();
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Farmacias/FactCatalogoBienesInsumosSeleccionarBienesLike?area=Farmacia",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (datos.lstData.table.length > 0) {
                    oTable_ProductosBuscados.fnAddData(datos.lstData.table);
                    oTable_ProductosBuscados.resize();
                    //resp = datos.lstData.table[0];
                }
            } else {
                $("#frameResultadosBusquedaProdutos").hide();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", error.toString());
        }
        //return resp;
    },

    async FarmMovimientoSeleccionarPorTipoYnumeroDocumento(nroDocumento, idTipoDocumento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('documentoNumero', nroDocumento);
        data.append('documentoIdTipo', idTipoDocumento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmaciaMovimientoSeleccionarPorTipoYnumeroDocumento?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0];
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

    async FarmDevuelveYactualizaCorrelativosDeDocumentosES(IdTipoDocumento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdTipoDocumento', IdTipoDocumento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveYactualizaCorrelativosDeDocumentosES?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ValidarLote(idAlmacen, idProducto, lote, fechaVencimiento) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);
        data.append('lote', lote);
        data.append('fechaVencimiento', fechaVencimiento);

        try {
            oTable_DetalleConsumoFarmacia.fnClearTable();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/ValidarLote?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.resultado.table.length > 0) {
                resp = datos.resultado.table[0];
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async DevuelvePrecioSegunTipoConcepto(idProducto, idTipoPrecioParaNiNs) {
        let resp = 0.00;
        let datos
        let data = new FormData();

        if (idTipoPrecioParaNiNs == 5) {
            return resp;
        }

        data.append('idProducto', idProducto);
        data.append('idTipoPrecioParaNiNs', idTipoPrecioParaNiNs);
        data.append('sghPrecioCompra', sghTipoPrecioFarmacia.sghPrecioCompra);
        data.append('sghPrecioDistribucion', sghTipoPrecioFarmacia.sghPrecioDistribucion);
        data.append('sghPrecioVentaContado', sghTipoPrecioFarmacia.sghPrecioVentaContado);
        data.append('sghPrecioDonacion', sghTipoPrecioFarmacia.sghPrecioDonacion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/DevuelvePrecioSegunTipoConcepto?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                if (datos.lstData.table.length > 1) {
                    alerta2("warning", "", "El producto Tiene dos precios activos, Antes de Proceder a registrar ir al catalogo de Bienes e Insumos y depurar los precios");
                    resp = parseFloat((isNull(datos.lstData.table[0].lnPrecio, 0.00)).toFixed(4));
                } else {
                    resp = parseFloat((isNull(datos.lstData.table[0].lnPrecio, 0.00)).toFixed(4));
                }
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote(idAlmacen, idProducto, lote, fechaVencimiento) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);
        data.append('lote', lote);
        data.append('fechaVencimiento', fechaVencimiento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                resp = datos.lstData.table;
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async FarmMovimientoSeleccionar(movNumero, tipo) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('movNumero', movNumero);
        data.append('movTipo', tipo);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoSeleccionarPorId?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                resp = datos.lstData.table[0];
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async FarmMovimientoDetalleSeleccionar(movNumero, tipo) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('movNumero', movNumero);
        data.append('movTipo', tipo);

        try {
            Cargando(1);
            oTable_DetalleNI.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientosDetalleDevuelveTodosItems?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_DetalleNI.fnAddData(datos.lstData.table);
                oTable_DetalleNI.resize();
                NotaIngreso.Totalizar();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async FarmMovimientoAgregarModificar(MovNumero, MovTipo, idAlmacenOrigen, idAlmacenDestino, idTipoConcepto, DocumentoIdtipo, DocumentoNumero,
        DocumentoFechaRecepcion, OrigenIdTipo, OrigenNumero, OrigenFecha, idProveedor, ruc, razonSocial,
        idTipoCompra, idTipoProceso, NumeroProceso, idPaciente, idCuentaAtencion, idComprobantePago, idFuenteFinanciamiento,
        Observaciones, Total, idEstadoMovimiento, esNotaIngresoAutomatica, detalleNotaSalida) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('MovNumero', MovNumero);
        data.append('MovTipo', MovTipo);
        data.append('idAlmacenOrigen', idAlmacenOrigen);
        data.append('idAlmacenDestino', idAlmacenDestino);
        data.append('idTipoConcepto', idTipoConcepto);
        data.append('DocumentoIdtipo', DocumentoIdtipo);
        data.append('DocumentoNumero', DocumentoNumero);

        data.append('DocumentoFechaRecepcion', DocumentoFechaRecepcion);
        data.append('OrigenIdTipo', OrigenIdTipo);
        data.append('OrigenNumero', OrigenNumero);
        data.append('OrigenFecha', OrigenFecha);
        data.append('idProveedor', idProveedor);
        data.append('ruc', ruc);
        data.append('razonSocial', razonSocial);
        data.append('idTipoCompra', idTipoCompra);
        data.append('idTipoProceso', idTipoProceso);
        data.append('NumeroProceso', NumeroProceso);
        data.append('idPaciente', idPaciente);
        data.append('idCuentaAtencion', idCuentaAtencion);
        data.append('idComprobantePago', idComprobantePago);
        data.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        data.append('Observaciones', Observaciones);
        data.append('Total', Total);
        data.append('idEstadoMovimiento', idEstadoMovimiento);
        data.append('esNotaIngresoAutomatica', esNotaIngresoAutomatica);
        data.append('detalleNotaSalida', detalleNotaSalida);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoAgregarModificar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            resp = datos.data

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmMovimientoVentasAgregar(FarmMovimientoVentas) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('movNumero', FarmMovimientoVentas.movNumero);
        data.append('movTipo', FarmMovimientoVentas.MovTipo);
        data.append('tipoVenta', FarmMovimientoVentas.tipoVenta);
        data.append('idPreVenta', FarmMovimientoVentas.idPreVenta);
        data.append('idTipoFinanciamiento', FarmMovimientoVentas.IdTipoFinanciamiento);
        data.append('idPrescriptor', FarmMovimientoVentas.idPrescriptor);
        data.append('idTipoReceta', FarmMovimientoVentas.idTipoReceta);
        data.append('idDiagnostico', FarmMovimientoVentas.idDiagnostico);
        data.append('idCuentaAtencion', FarmMovimientoVentas.idCuentaAtencion);
        data.append('IdServicioPaciente', FarmMovimientoVentas.idServicioPaciente);
        data.append('idFuenteFinanciamiento', FarmMovimientoVentas.idFuenteFinanciamiento);
        data.append('idPaciente', FarmMovimientoVentas.IdPaciente);
        data.append('FechaHoraPrescribe', FarmMovimientoVentas.FechaHoraPrescribe);
        data.append('IdPaquete', FarmMovimientoVentas.IdPaquete);


        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoVentasAgregar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmMovimientoVentasDetalleAgregar(MovNumero, MovTipo, FarmMovimientoVentasDetalle) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        data.append('MovNumero', MovNumero);
        data.append('MovTipo', MovTipo);
        data.append('idProducto', FarmMovimientoVentasDetalle.IdProducto);
        data.append('cantidad', FarmMovimientoVentasDetalle.Cantidad);
        data.append('precio', FarmMovimientoVentasDetalle.Precio);
        data.append('total', FarmMovimientoVentasDetalle.Total);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoVentasDetalleAgregar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    //////////////////////////////METODOS ADICIONALES///////////////////////////////////////////////////////////
    ValidarBusquedaNotasIngreso() {
        if (isEmpty($("#cboFarmaciasBusq").val()) == true) {
            alerta2('info', '', 'Por favor seleccione un Almacen o Farmacia.');
            return false;
        }

        if (esFormatoFecha($("#txtFechaInicioBusq").val()) == false) {
            alerta2('info', '', 'Por favor ingrese una Fecha Incio válida.');
            return false;
        }

        if (esFormatoFecha($("#txtFechaFinalBusq").val()) == false) {
            alerta2('info', '', 'Por favor ingrese una Fecha Final válida.');
            return false;
        }
    },

    LimpiarCamposBusqueda() {
        $('.search').val('');
        $('.chzn-select').chosen().trigger("chosen:updated");
        NotaIngreso.IniciarFechasBusqueda();
    },

    LimpiarCamposRegistro() {
        $(".campo").val("");
        $(".campo2").val("");
        $("#TotalDetalleNI").html("");

        $("#cboConceptoNI, #cboFarmaciaOrigenNI, #cboTipoProcesoNI, #cboTipoCompraNI").empty();

        HabilitarDeshabilitarForm("#chkPacienteForaneo", false, "");
        HabilitarDeshabilitarForm("#txtNroHistoriaPacienteNI", false, "");
        HabilitarDeshabilitarForm("#txtNroCuentaPacienteNI", false, "");
        HabilitarDeshabilitarForm("#btnBuscarCuentaPacienteNI", false, "");

        $("#framPacienteConHistoria").show();
        $("#framPacienteForaneo").hide();

        oTable_ProductosBuscados.fnClearTable();
        oTable_DetalleNI.fnClearTable();
        oTable_DetalleConsumoFarmacia.fnClearTable();
        oTable_DetalleDevolucion.fnClearTable();
        $("#frameResultadosBusquedaProdutos").hide();

        NotaIngreso.indexDetalle = 0;
        NotaIngreso.esUnidosisLaFarmacia = 0;
        NotaIngreso.esUnaDonacionOestrategico = null;
        NotaIngreso.lbDocumentoEsAutomatico = false;
        NotaIngreso.prefijoNroDocumentoNI = "";
        NotaIngreso.suffijoNroDocumentoNI = "";
        NotaIngreso.nroDocumentoNI = "";
        //NotaIngreso.oRsItemsUnidosis = null;
        NotaIngreso.idPacienteDevolucion = null;
        NotaIngreso.idCuentaDevolucion = null;
        NotaIngreso.idTipoServicioDevolucion = null;
        NotaIngreso.idComprobantePagoDevolucio = null;
        NotaIngreso.idFuenteFinanciamientoDevolucion = null;
        NotaIngreso.idTipoFinanciamientoDevolucion = null;
        NotaIngreso.idProveedor = null;
        NotaIngreso.tipoPrecioParaNiNs = null;
        NotaIngreso.esNotaIngresoAutomatica = 0;
        NotaIngreso.tieneDespacho = 0;

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    LimpiarCamposPacienteDevolucion() {
        $("#txtNroCuentaPacienteNI").val("");
        $("#txtNroHistoriaPacienteNI").val("");
        $("#txtNombrePacienteNI").val("");
        $("#txtServicioPacienteNI").val("");

        $("#txtNroCuentaPacienteCF").val("");
        $("#txtNroHistoriaPacienteCF").val("");
        $("#txtNombrePacienteCF").val("");
        $("#txtServicioPacienteCF").val("");

        NotaIngreso.idCuentaDevolucion = null;
        NotaIngreso.idPacienteDevolucion = null;
        NotaIngreso.idTipoServicioDevolucion = null;
        NotaIngreso.idFuenteFinanciamientoDevolucion = null;
        NotaIngreso.idTipoFinanciamientoDevolucion = null;
        NotaIngreso.idComprobantePagoDevolucion = null;
        NotaIngreso.indexDetalle = 0;

        oTable_DetalleNI.fnClearTable();
        oTable_DetalleConsumoFarmacia.fnClearTable();
        oTable_DetalleDevolucion.fnClearTable();

    },

    DesbloquearRegistro() {
        $(".campo").removeAttr("disabled");
        $(".dLoteNI").removeAttr("disabled");
        $(".dFechaVencNI").removeAttr("disabled");
        $(".dCantNI").removeAttr("disabled");
        $(".dPrecioNI").removeAttr("disabled");
        $(".dRegSanNI").removeAttr("disabled");

        if (NotaIngreso.accion == "A") {
            HabilitarDeshabilitarForm("#cboFarmaciaDestinoNI", true);
            HabilitarDeshabilitarForm("#cboConceptoNI", true);
            HabilitarDeshabilitarForm("#cboFarmaciaOrigenNI", true);
        } else if (NotaIngreso.accion == "M") {
            HabilitarDeshabilitarForm("#cboFarmaciaDestinoNI", false);
            HabilitarDeshabilitarForm("#cboConceptoNI", false);
            HabilitarDeshabilitarForm("#cboFarmaciaOrigenNI", false);
        }


        $("#btnAnularNotaIngreso").hide();
    },

    BloquearRegistro() {
        $(".campo").attr("disabled", true);
        $(".dLoteNI").attr("disabled", true);
        $(".dFechaVencNI").attr("disabled", true);
        $(".dCantNI").attr("disabled", true);
        $(".dPrecioNI").attr("disabled", true);
        $(".dRegSanNI").attr("disabled", true);

        HabilitarDeshabilitarForm("#cboFarmaciaDestinoNI", false);
        HabilitarDeshabilitarForm("#cboConceptoNI", false);
        HabilitarDeshabilitarForm("#cboFarmaciaOrigenNI", false);

        $("#frameBusquedaProductos").hide();
        if (NotaIngreso.accion == "C") {
            $("#btnGuardarNotaIngreso").hide();
            $("#btnAnularNotaIngreso").hide();
        } else if (NotaIngreso.accion == "E" && NotaIngreso.esNotaIngresoAutomatica == 0) {
            $("#btnGuardarNotaIngreso").hide();
            $("#btnAnularNotaIngreso").show();
        }
    },

    ValidarModificacion() {
        if (NotaIngreso.esNotaIngresoAutomatica == 1 || NotaIngreso.tieneDespacho == 1) {
            NotaIngreso.BloquearRegistro();
            $("#btnGuardarNotaIngreso").hide();
        } else {
            $("#btnGuardarNotaIngreso").show();

        }
    }

}


$(document).ready(function () {
    NotaIngreso.Iniciar()

});