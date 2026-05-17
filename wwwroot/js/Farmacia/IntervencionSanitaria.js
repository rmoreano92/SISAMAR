var IntervencionSanitaria = {
    MovNumero: '',
    DocumentoNumero: '',

    IdEstadoMovimiento: 0,

    Guardando: 0,

    TipoAccion: 0,
    RecetaBusqueda: 0,

    esUnidosisLaFarmacia: 0,
    idMedicoPrescribe: 0,
    fechaPrescripcion: 0,
    horaPrescripcion: 0,
    idRecetaProcesada: 0,

    ConsumoHistorico: [],

    oDoCajaNroDocumento: {
        IdCaja: 0,
        IdTipoComprobante: 0
    },

    //oDoMovimiento: {
    //    FechaCreacion: '',
    //    MovNumero: 0,
    //    DocumentoNumero: '',
    //    DocumentoIdTipo: 0,
    //    IdAlmacenDestino: 0, // Almacen -- 0 -> Ninguno
    //    IdAlmacenOrigen: 0,
    //    IdEstadoMovimiento: 1,
    //    IdTipoConcepto: 0,
    //    MovTipo: 'S',
    //    Observaciones: '',
    //    Total: 0
    //},

    //oDoFarmMovimientoIntervencionSanitaria: {
    //    idCuentaAtencion: null,
    //    idDiagnostico: 0,
    //    IdPaciente: 0,
    //    idPrescriptor: 0,
    //    IdTipoFinanciamiento: 0,
    //    idTipoReceta: 0,
    //    IdUsuarioAuditoria: 0,
    //    MovTipo: 'S',
    //    tipoVenta: 'D',
    //    idFuenteFinanciamiento: '',
    //    FechaHoraPrescribe: '',
    //    IdPaquete: 0,
    //    idPreVenta: 0,
    //    movNumero: '',
    //    idServicioPaciente: 0,
    //    FechaCreacion: '',
    //},

    //oDoPreventa: {
    //    idAlmacen: 0,
    //    idPreventa: null,
    //    idVendedor: 0,
    //    idPaciente: null,
    //    idTipoFinanciamiento: 0,
    //    total: 0,
    //    idDiagnostico: 0,
    //    idTipoReceta: 0,
    //    idcuentaAtencion: null,
    //    idPrescriptor: 0,
    //    fechaCreacion: 0,
    //    horaCreacion: 0,
    //    idUsuario: 0,
    //    fechaModificacion: 0,
    //    idUsuarioModifica: 0,
    //    idEstadoPreventa: 1,
    //    fechaHoraPrescribe: 0,
    //    idUsuarioAuditoria: 0,
    //},

    farmMovimientoProgramas: {
        movNumero: 0,
        movTipo: '',
        idCoordinador: 0,
        idPrescriptor: 0,
        idDiagnostico: 0,
        idPaciente: 0,
        idComponente: 0,
        idSubComponente: 0,
        FechaHoraPrescribe: '',
        idCuentaAtencion: 0,
        observaciones: '',
        nroFormato: ''
    },


    //////////////////////////////CONFIGURACIONES INICIALES///////////////////////////////////////////
    async Iniciar() {
        IntervencionSanitaria.Plugins();
        IntervencionSanitaria.DataTableBusqueda();
        IntervencionSanitaria.DataTableDetalleVentas();
        IntervencionSanitaria.DataTableProductosBuscados();
        IntervencionSanitaria.DataTableBusquedaPacientes();
        IntervencionSanitaria.DataTableAtencionesPacientes();
        IntervencionSanitaria.DataTableConsumoHistorico();
        IntervencionSanitaria.DataTableDiagnosticos();
        IntervencionSanitaria.Eventos();
        IntervencionSanitaria.LLenarCombos();
        IntervencionSanitaria.ValidarLugarDondeTrabaja();

        BusqRecetasPacientes.idPuntoCarga = 5;
        BusqRecetasPacientes.esIntervencionSanitaria = 1;

    },

    async ValidarLugarDondeTrabaja() {
        let lugarTrabaja = await IntervencionSanitaria.EmpleadosLaboraLugarSeleccionar($('#hdIdUsuario').val())

        if (!isEmpty(lugarTrabaja)) {
            lugarTrabaja = lugarTrabaja.filter(obj => obj.idLaboraArea == 1 && obj.idLaboraSubArea != 2 && obj.idLaboraSubArea != 11)
            if (lugarTrabaja.length > 0) {
                $('#cboFarmaciasBusq').val(lugarTrabaja[0].idLaboraSubArea)
                $('#cboFarmaciasBusq').attr("disabled", true);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
        }
    },

    Plugins() {
        $('#txtFechaInicioBusq, #txtFechaFinalBusq, #txtFechaPrescripcion, #txtFechaRegistro').datepicker({
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
        $("#txtFechaInicioBusq, #txtFechaFinalBusq").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraPrescripcion").mask("Hn:Nn");
        $("#txtHoraInicioBusq").mask("Hn:Nn");
        $("#txtHoraFinalBusq").mask("Hn:Nn");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimiento").mask("Hn:Nn");
        //$("#txtHoraClampaje").mask("Hn:Nn");

        IntervencionSanitaria.IniciarFechasBusqueda();

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
        $("#txtFechaInicioBusq").datepicker("setDate", FechaHoy);
        $("#txtFechaFinalBusq").datepicker("setDate", FechaHoy);
    },

    //////////////////////////////CONFIGURACION DATATABLES///////////////////////////////////////////
    DataTableBusqueda() {
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
                    targets: 1,
                    data: "movNumero",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 1,
                    data: "documentoNumero",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "fechaCreacionFormat",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    data: "dAlmacen",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "estado",
                    width: "4%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoMovimiento == 0) {
                            $(td).parent().css('color', '#ff0808');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    targets: 5,
                    data: "productoPlan",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "idCuentaAtencion",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "nroHistoriaClinica",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "paciente",
                    width: "12%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "total",
                    width: "4%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "idPreventa",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: null,
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {

                        $(td).attr('align', 'left')

                        var btnImprimeSinF = "";

                        if (rowData.tipoVenta == "D") {
                            btnImprimeSinF = '<button class="btnImprimeInforme btn btn-sm btn-warning glow_button" title="Visualiza Informe" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                        }

                        $(td).html(btnImprimeSinF);
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_IntervencionSanitaria = $("#tblVentas").dataTable(parms);
    },

    DataTableDetalleVentas() {
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
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.tipoPsicotropico == "N") {
                            $(td).parent().css('color', '#ad2a00');
                            //$(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: '12%',
                    targets: 1,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_idItem_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCantidadItem">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "prVenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblDetalleVentas');
        oTable_DetalleIntervencionSanitaria = $("#tblDetalleVentas").dataTable(parms);
        $('#tblDetalleVentas_length').css('display', 'none');
    },

    DataTableProductosBuscados() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '28vh',
            autoWidth: false,
            "order": [[2, "asc"]],
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
                    width: '40%',
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
                {
                    width: '15%',
                    targets: 3,
                    data: "lote",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblProductosBuscados');
        oTable_ProductosBuscados = $("#tblProductosBuscados").dataTable(parms);
        $('#tblProductosBuscados_length').css('display', 'none');
    },

    DataTableBusquedaPacientes() {
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
                    width: '10%',
                    targets: 0,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblBusquedaPacientes');
        oTable_BusquedaPacientes = $("#tblBusquedaPacientes").dataTable(parms);
        $('#tblBusquedaPacientes_length').css('display', 'none');
    },

    DataTableAtencionesPacientes() {
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
                    width: '7%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "estadoCuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 3,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 4,
                    data: "horaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '13%',
                    targets: 5,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "dTipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 7,
                    data: "edad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 8,
                    data: "diagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 9,
                    data: "vecesAbierto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblAtencionesPacientes');
        oTable_AtencionesPacientes = $("#tblAtencionesPacientes").dataTable(parms);
        $('#tblAtencionesPacientes_length').css('display', 'none');
    },

    DataTableConsumoHistorico() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '35vh',
            autoWidth: false,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "fechaCreacionFormat",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "movNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "documentoNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 5,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "estado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "dalmacen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: "dfinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 12,
                    data: "usuario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblConsumoHistorico');
        oTable_ConsumoHistorico = $("#tblConsumoHistorico").dataTable(parms);
        $('#tblConsumoHistorico_length').css('display', 'none');
    },


    DataTableDiagnosticos() {
        visible = true;

        params = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '12vh',
            autoWidth: false,
            columns: [
                {
                    width: '0%', targets: 0, "data": "idDiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter' },
                { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": false }

            ]
        }

        //ObjtableDx = $(Diagnosticos.PanelDx + "#lstDiagnosticos").dataTable(params);

        ObjtableDiagnosticos = $("#lstDiagnosticos").dataTable(params);

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        $('#txtLabDiagnostico').val('')

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");

        //Cargando(0);
    },
    //////////////////////////////EVENTOS USUARIO - SISTEMA///////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////

    ExisteProducto(idItem) {
        lstData = oTable_DetalleIntervencionSanitaria.api(true).rows().data();

        for (var i = 0; i < lstData.length; i++) {
            if (lstData[i].idItem == idItem) {
                return true;
            }
        }

        return false;
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////

    Eventos() {

        $('#btnBuscar').on('click', async function () {
            await IntervencionSanitaria.ListarVentas();
        });

        $('#btnGenerarReporte').on('click', () => {
            if (IntervencionSanitaria.ValidarBusquedaNotasIngreso() == false) {
                return false;
            }


            let formData = new FormData()

            let tipoVenta = ''

            if ($('input[name="rdbTipoVentaBusqueda"]:checked').val() == 1) {
                tipoVenta = 'D'
            } else {
                tipoVenta = 'P'
            }

            formData.append('tipoVenta', tipoVenta);
            formData.append('IdAlmacen', $("#cboFarmaciasBusq").val());
            formData.append('FechaInicio', $("#txtFechaInicioBusq").val() + ' ' + $("#txtHoraInicioBusq").val());
            formData.append('FechaFin', $("#txtFechaFinalBusq").val() + ' ' + $("#txtHoraFinalBusq").val());

            Cargando(1)

            fetch('/Farmacias/rptVentasFarmaciaAlmacen?area=Farmacia', {
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

        $('#btnAbrirModalUnidosis').on('click', async function () {
            $('#modalUnidosis').modal('show')
        });

        $('#btnBuscarDatosPacienteNroHistoria').on('click', async function () {
            if ($('#txtNroHistoria').val() == '') {

                alerta(2, 'Debe ingresar el Nro de Historia')

                $('#txtNroHistoria').focus()
                return false;
            }

            let datosPaciente = await IntervencionSanitaria.PacientesSeleccionarPorNroHistoria($('#txtNroHistoria').val())

            if (!isEmpty(datosPaciente)) {
                console.log('datosPaciente', datosPaciente)

                $('#txtNroDocumentoPaciente').val(datosPaciente.nroDocumento)
                $('#txtNombrePaciente').val(`${!datosPaciente.apellidoPaterno ? '' : datosPaciente.apellidoPaterno} ${!datosPaciente.apellidoMaterno ? '' : datosPaciente.apellidoMaterno} ${!datosPaciente.primerNombre ? '' : datosPaciente.primerNombre} ${!datosPaciente.segundoNombre ? '' : datosPaciente.segundoNombre}`)
            }

        });

        $('#btnBuscarDatosPacienteNroDocumento').on('click', async function () {
            if ($('#txtNroDocumentoPaciente').val() == '') {

                alerta(2, 'Debe ingresar el Nro de Documento')

                $('#txtNroDocumentoPaciente').focus()
                return false;
            }

            let datosPaciente = await IntervencionSanitaria.PacientesXdni($('#txtNroDocumentoPaciente').val())

            if (!isEmpty(datosPaciente)) {
                console.log('datosPaciente', datosPaciente)

                $('#txtNombrePaciente').val(`${!datosPaciente.apellidoPaterno ? '' : datosPaciente.apellidoPaterno} ${!datosPaciente.apellidoMaterno ? '' : datosPaciente.apellidoMaterno} ${!datosPaciente.primerNombre ? '' : datosPaciente.primerNombre} ${!datosPaciente.segundoNombre ? '' : datosPaciente.segundoNombre}`)
            }

        });



        $('#chkConsumoHistorico').on('click', async function () {

            oTable_ConsumoHistorico.fnClearTable()

            if ($('#chkConsumoHistorico').is(':checked')) {
                $("#ContentConsumoHistorico").show();
                if ($('#txtNroCuenta').val() != '') {

                    let consumoHistorico = await IntervencionSanitaria.FarmMovimientoVentasDetalleSeleccionarPorCuenta($('#txtNroCuenta').val())

                    if (consumoHistorico.length > 0) {

                        oTable_ConsumoHistorico.fnAddData(consumoHistorico)

                        IntervencionSanitaria.ConsumoHistorico = oTable_ConsumoHistorico.api(true).data().toArray()
                    }
                    //console.log('consumoHistorico', consumoHistorico)
                }
            } else {
                oTable_ConsumoHistorico.fnClearTable()
                $("#ContentConsumoHistorico").hide();
            }



        });



        $('input[name="rdbTipoVenta"]').on('click', async function () {
            let tipoVenta = $(this).val() // 1 -> VENTA(tienen algún seguro), 2 -> PRE-VENTA(Pagantes)

            await IntervencionSanitaria.TipoVenta_Change(tipoVenta);
        })


        //

        //========================= BUSQUEDA PRODUCTOS =======================================================================//
        //$('#txtCodigoProductoBusqueda').on("keyup", async function (event) {
        //    if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
        //        event.preventDefault();
        //        if (LabMovimiento.idTipoFinanciamiento > 0 && (LabMovimiento.idPaciente > 0 || LabMovimiento.idComprobantePago > 0)) {
        //            $("#txtNombreProductoBusqueda").val("");
        //            let busqueda = $("#txtCodigoProductoBusqueda").val().trim();
        //            await Laboratorio.ListarProductosBuscados('C', busqueda, $("#cboMovPlan").val(), Laboratorio.idPuntoCarga, 1);
        //        } else {
        //            alerta2("info", "", "Por favor, primero seleccione un paciente.");
        //        }
        //    }
        //});
        $('#txtNombreProducto').on('input', async function () {
            let inputValue = $(this).val()
            let productos = null;

            var dataMedicamentos = new FormData();
            dataMedicamentos.append('lnIdAlmacen', $('#cboFarmaciaVenta').val());
            dataMedicamentos.append('lcFiltro', inputValue);

            if (inputValue.length >= 1 && $('#cboFarmaciaVenta').val() != 0) {
                $('#contProductosBusqueda').show()

                await $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente?area=Farmacia",
                    data: dataMedicamentos,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (datos) {

                        oTable_ProductosBuscados.fnClearTable()

                        if (datos.lstData.table.length > 0) {
                            productos = datos.lstData.table;
                            productos = productos.filter(function (obj) {
                                return obj.idTipoSalidaBienInsumoSaldo == 2;
                            });

                            if (productos.length > 0) {
                                const combinedTable = combineProducts(productos);

                                oTable_ProductosBuscados.fnAddData(combinedTable)
                            }

                        }

                    },
                    error: function (msg) {
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }
                })

                if (!isElementFullVisible(document.getElementById('frameResultadosBusquedaProdutos'))) {
                    //console.log("El div NOOOOO es completamente visible y necesita scroll.");
                    smoothScrollToContent($('#frameResultadosBusquedaProdutos'));
                }

            } else {
                oTable_ProductosBuscados.fnClearTable()
                $('#contProductosBusqueda').hide()
            }

        });

        $('#tblProductosBuscados tbody').on('click', 'tr', function () {
            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });
        $('#tblProductosBuscados tbody').on('dblclick', 'tr', function () {

            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let pos = oTable_ProductosBuscados.api(true).row($(this)).index();
            let row = oTable_ProductosBuscados.fnGetData(pos);

            //console.log('pos', pos)
            //console.log('row', row)

            let items = {
                idItem: row.idProducto,
                codigo: row.codigo,
                producto: row.nombre,
                //tipoSalida: row.tipo,
                saldo: row.saldo,
                cantidadPedida: 0,
                prVenta: row.precioUnitario,
                total: IntervencionSanitaria.customRoundToTwoDecimals(0 * row.precioUnitario),

                tipo: row.tipo,
                lote: row.lote,
                fechaVencimiento: row.fechaVencimiento,
                idTipoSalidaBienInsumoSaldo: row.idTipoSalidaBienInsumoSaldo,
                fechaVencimientoFormat: row.fechaVencimientoFormat,
                tipoPsicotropico: row.tipoPsicotropico,
            }

            if (IntervencionSanitaria.ExisteProducto(row.idProducto)) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_DetalleIntervencionSanitaria.fnAddData(items)

            oTable_ProductosBuscados.fnClearTable()
            $('#contProductosBusqueda').hide()
            //

            //$('#idPaciente').val(row.idPaciente);
            //$('#idAtencion').val(row.idAtencion);
            //$('#idDestinoAtencion').val(row.idDestinoAtencion);
            //$('#txtDatos').html('N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            //$('#txtDatoCuenta').val(row.idCuentaAtencion);
            //$('#txtDatoPaciente').val(row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres);
            //$('#txtDatoHistoria').val(row.nroHistoriaClinica);
            //$('#txtDatoEdad').val(row.edadPaciente);
        });

        $('#btnAgregaProducto').on('click', async function () {
            //let pos = oTable_ProductosBuscados.api(true).row($(this)).index();
            //let row = oTable_ProductosBuscados.fnGetData(pos);
            let row = oTable_ProductosBuscados.api(true).row('.selected').data();
            //console.log('pos', pos)
            //console.log('row', row)

            if (isEmpty(row)) {
                alerta2("info", "", "Por favor seleccione un producto para agregar.");
            }

            let items = {
                idItem: row.idProducto,
                codigo: row.codigo,
                producto: row.nombre,
                //tipoSalida: row.tipo,
                saldo: row.saldo,
                cantidadPedida: 0,
                prVenta: row.precioUnitario,
                total: IntervencionSanitaria.customRoundToTwoDecimals(0 * row.precioUnitario),

                tipo: row.tipo,
                lote: row.lote,
                fechaVencimiento: row.fechaVencimiento,
                idTipoSalidaBienInsumoSaldo: row.idTipoSalidaBienInsumoSaldo,
                fechaVencimientoFormat: row.fechaVencimientoFormat,
                tipoPsicotropico: row.tipoPsicotropico,
            }

            if (IntervencionSanitaria.ExisteProducto(row.idProducto)) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_DetalleIntervencionSanitaria.fnAddData(items)

            $("#txtCant_idItem_" + row.idProducto).val("");
            $("#txtCant_idItem_" + row.idProducto).focus();

            oTable_ProductosBuscados.fnClearTable()
            $('#contProductosBusqueda').hide()
        });

        $('#btnQuitarProducto').on('click', function () {
            var objrowTb = oTable_DetalleIntervencionSanitaria.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                IntervencionSanitaria.QuitarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para eliminar.");
            }
        });

        $(document).on('keydown', function (e) {
            if (e.keyCode === 121) { // 121 es el keyCode de F10
                e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
            }
        })

        $(document).on('keyup', function (e) {
            let indice = 0;
            let selectedRow = null;


            if (e.keyCode === 121) {
                e.preventDefault();
                $("#txtCodigoProducto").val("");
                $("#txtNombreProducto").val("");
                $("#txtNombreProducto").focus();
            }

            //if (e.keyCode === 38) {
            //    e.preventDefault();
            //    selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
            //    indice = selectedRow.index()
            //    if (isEmpty(indice) == false) {
            //        indice = indice - 1;
            //    } else {
            //        indice = 0;
            //    }

            //    if (indice >= 0) {
            //        oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //    }
            //}

            //if (e.keyCode === 40) {
            //    e.preventDefault();
            //    selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
            //    indice = selectedRow.index()
            //    if (isEmpty(indice) == false) {
            //        indice = indice + 1;
            //    } else {
            //        indice = 0;
            //    }

            //    if (indice >= 0) {
            //        oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //    }
            //}

            if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                let selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
                let indice = selectedRow.index();

                if (!isEmpty(indice)) {
                    indice = e.keyCode === 38 ? indice - 1 : indice + 1;
                } else {
                    indice = 0;
                }

                if (indice >= 0) {
                    oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
                    let newRow = $('#tblProductosBuscados tbody tr:eq(' + indice + ')');
                    newRow.addClass('selected');

                    // Desplazar el scroll para que la fila sea visible
                    newRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }

            if (e.which == 13) {
                //if ($("#frameResultadosBusquedaProdutos").is(":visible")) {
                if ($(e.target).is('#txtCodigoProducto') || $(e.target).is('#txtNombreProducto')) {
                    e.preventDefault();
                    //let objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();

                    //if (isEmpty(objrowTb) == false) {
                    //    Laboratorio.AgregarProducto(objrowTb);
                    //} else {
                    //    alerta2("info", "", "Por favor seleccione un producto para agregar.");
                    //}
                    $("#btnAgregaProducto").click();
                }

                if ($(e.target).is('.dCantidadItem') || $(e.target).is('.txtCantidadPedida')) {
                    e.preventDefault();
                    $("#txtNombreProducto").focus();
                }
            }

        });

        //=====================================================================================================================//

        //$('#txtNroReceta').on('focusout', async function () {
        //    await IntervencionSanitaria.BuscarNumeroReceta($('#txtNroReceta').val());
        //});

        $('#txtNroReceta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                await IntervencionSanitaria.BuscarNumeroReceta($('#txtNroReceta').val());
            }
        });

        $('#btnAceptarRecetaPaciente').on('click', async function () {
            let receta = oTable_BusquedaRecetasPacientes.api(true).row('.selected').data();
            if (isEmpty(receta)) {
                alerta2("info", "", "Seleccione un registro por favor.");
            } else {
                if (receta.idEstadoAtencion != 1) {
                    alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
                    return;
                }

                if (receta.esRecetaAntimicrobiano == 1) {
                    if (receta.idSolicitudAntimicrobiano > 0) {
                        //if (receta.autorizaAntimicrobiano != 9) {
                        //    if (receta.autorizaAntimicrobiano == 0) {
                        //        alerta2("info", "", "Es una receta de antimicrobianos.<br>La solicitud de la receta ha sido RECHAZADA.<br>No es posible despachar.");
                        //        return;
                        //    }
                        //} else {
                        //    alerta2("info", "", "Es una receta de antimicrobianos.<br>La solicitud de la receta aun se encuentra pendiente de aprobación o rechazo.<br>No es posible despachar.");
                        //    return;
                        //}
                        alerta2("info", "", "Es una receta de antimicrobianos.");
                        Cargando(0)
                    } else {
                        alerta2("info", "", "Es una receta de antimicrobianos.<br>La receta aun no cuenta con una solicittud para aprobacion de antimicrobianos.<br>No es posible despachar.");
                        return;
                    }
                }


                $(".searchRecetaPaciente").val("");
                BusqRecetasPacientes.CargarFechaHoy();
                oTable_BusquedaRecetasPacientes.fnClearTable();
                $("#modalBusquedaRecetas").modal("hide");
                $('#txtNroReceta').val(receta.idReceta);
                await IntervencionSanitaria.BuscarNumeroReceta($('#txtNroReceta').val());
            }

        });

        //$('#btnBuscarDatosPacienteNroReceta').on('click', async function () {
        //    await IntervencionSanitaria.BuscarNumeroReceta($('#txtNroReceta').val());
        //});

        //$('#txtNroCuenta').on('focusout', async function () {
        //    await IntervencionSanitaria.BuscarNumeroCuenta($('#txtNroCuenta').val());
        //});

        $('#txtNroCuenta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                await IntervencionSanitaria.BuscarNumeroCuenta($('#txtNroCuenta').val());
            }
        });


        //==========================BUSQUEDA PACIENTE==========================
        $('#btnModalBusquedaPacientes').on('click', async function () {
            $('#modalBusquedaPacientes').modal('show')
        });
        $('.searchPaciente').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchPaciente").blur();
                $("#btnBuscarPacientes").click();
            }
        });
        $('#btnBuscarPacientes').on('click', async function () {
            let busquedaPacientes = await IntervencionSanitaria.PacientesFiltrarTodos();
        });

        $('#btnLimpiarBusquedaPaciente').on('click', async function () {
            $(".searchPaciente").val("");
        });

        $('#tblBusquedaPacientes tbody').on('click', 'tr', async function () {
            oTable_BusquedaPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let busqueda = oTable_BusquedaPacientes.api(true).row('.selected').data();
            await IntervencionSanitaria.AtencionesPacienteFiltrarTodos(busqueda.idPaciente);
        });

        $('#tblAtencionesPacientes tbody').on('click', 'tr', async function () {
            oTable_AtencionesPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnAceptarCuentaPaciente').on('click', async function () {
            let cuenta = oTable_AtencionesPacientes.api(true).row('.selected').data();
            if (cuenta.idEstado != 1) {
                alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
                return;
            }
            $(".searchPaciente").val("");
            oTable_BusquedaPacientes.fnClearTable();
            oTable_AtencionesPacientes.fnClearTable();
            $("#modalBusquedaPacientes").modal("hide");
            await IntervencionSanitaria.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
        });

        $('#btnCerrarModalBusquedaPaciente').on('click', async function () {
            $(".searchPaciente").val("");
            oTable_BusquedaPacientes.fnClearTable();
            oTable_AtencionesPacientes.fnClearTable();
            $("#modalBusquedaPacientes").modal("hide");
        });
        //======================================================================

        // Tables

        $('#tblDetalleVentas tbody').on('click', 'tr', function () {
            //$(this).removeClass('selected');
            //oTable_DetalleIntervencionSanitaria.$('tr.selected').removeClass('selected');
            //$(this).addClass('selected');
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_DetalleIntervencionSanitaria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            let data = oTable_DetalleIntervencionSanitaria.api(true).row('.selected').data()

            oTable_ConsumoHistorico.fnClearTable()

            if (isEmpty(data)) {
                if (IntervencionSanitaria.ConsumoHistorico.length > 0) {
                    oTable_ConsumoHistorico.fnAddData(IntervencionSanitaria.ConsumoHistorico)
                }

                return
            }

            let ConsumoHistoricoFilter = IntervencionSanitaria.ConsumoHistorico.filter(obj => obj.codigo.trim() == data.codigo.trim())

            console.log(data, ConsumoHistoricoFilter)

            if (ConsumoHistoricoFilter.length > 0) {
                oTable_ConsumoHistorico.fnAddData(ConsumoHistoricoFilter)
            }

        });

        $('#tblVentas tbody').on('click', '.btnImprimeInforme', async function () {// KHOYOSI
            let objrow = oTable_IntervencionSanitaria.api(true).row($(this).parents("tr")[0]).index();
            let objTable = oTable_IntervencionSanitaria.fnGetData(objrow);

            $('#ifrmInforme').attr('src', "");
            let url = "/Farmacias/ImpreInformeIntervencionSanitaria?area=Farmacia&MovNumero=" + objTable.movNumero + "&MovTipo=" + 'S'
            $('#ifrmInforme').attr('src', url)
            //newIframe.src = url;

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalInforme").modal('show')
        })

        $('#btnCerrarTicket').on('click', async function () {
            $('#ifrmInforme').attr('src', "");
            $("#modalInforme").modal('hide')
        });


        $('#tblDetalleVentas tbody').on('input', 'input[id^="txtCant_idItem_"]', function () {
            const inputId = $(this).attr('id');

            let inputElement = $(this);
            let rowElement = inputElement.closest('tr');


            let row = oTable_DetalleIntervencionSanitaria.api().row(rowElement);

            let data = row.data()

            let cantidadPedida = $('#' + inputId).val()

            if (parseInt(cantidadPedida) > parseInt(data.saldo)) {
                $('#' + inputId).focus()
                alerta(2, 'La cantidad debe ser menor o igual a ' + data.saldo)
                return
            }

            let precioItem = parseFloat(parseFloat(data.prVenta).toFixed(3))
            let cantidadItem = inputElement.val()


            var inputCantidad = '';
            inputCantidad = '  <input id="txtCant_idItem_' + data.idItem + '" value="' + cantidadItem + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero txtCantidadPedida">'




            data.total = IntervencionSanitaria.customRoundToTwoDecimals((precioItem * cantidadItem)).toFixed(2)
            data.cantidadPedida = inputCantidad


            //var row = table.row(rowIndex);
            row.data(data).draw();


            // Devolver el foco al input y mover el cursor al final
            let newInputElement = $('#' + inputId)
            newInputElement.focus();
            let val = newInputElement.val();
            newInputElement.val(''); // Clear the input
            newInputElement.val(val); // Restore the value and move the cursor to the end

            let detalleVentas = oTable_DetalleIntervencionSanitaria.api().data().toArray()
            let totalDetalle = 0
            for (let obj of detalleVentas) {
                totalDetalle = totalDetalle + parseFloat(obj.total)
            }
            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));

            console.log('data', data)
        })

        $('#tblDetalleVentas tbody').on('focusout', 'input[id^="txtCant_idItem_"]', function () {
            const inputId = $(this).attr('id');

            let inputElement = $(this);
            let rowElement = inputElement.closest('tr');

            //let rowIndex = oTable_detalleNotaSalida.api().row(rowElement).index();

            let row = oTable_DetalleIntervencionSanitaria.api().row(rowElement);

            let data = row.data()

            if (parseInt($('#' + inputId).val()) > parseInt(data.saldo)) {
                $('#' + inputId).focus()
                alerta(2, 'La cantidad debe ser menor o igual a ' + data.saldo)
                return
            }

        })

        // End Tables











        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            IntervencionSanitaria.LimpiarCamposBusqueda();
        });


        $('#tblVentas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionSanitaria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarVentas').on('click', function () {

            IntervencionSanitaria.LimpiarFormularioVariables()

            IntervencionSanitaria.TipoAccion = 'A'

            var f = new Date();
            var dia = f.getDate();
            var mes = (f.getMonth() + 1);
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes
            FechaPrimerDiaDelMes = "01" + "/" + mes + "/" + f.getFullYear();
            FechaHoy = dia + "/" + mes + "/" + f.getFullYear();
            let time = (f.getHours() < 10 ? ("0" + f.getHours()) : f.getHours()) + ":" + (f.getMinutes() < 10 ? ("0" + f.getMinutes()) : f.getMinutes())

            $("#txtFechaRegistro").datepicker("setDate", FechaHoy);
            $("#txtFechaPrescripcion").datepicker("setDate", FechaHoy);

            $('#txtHoraRegistro').val(time);
            $('#txtHoraPrescripcion').val(time);

            $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1);
            if ($('#cboFarmaciaVenta').val() > 0) {
                $('input[name="rdbTipoVenta"][value="1"]').click();
            }

            //$('input[name="rdbTipoVenta"]').click()

            $('#contProductosBusqueda').hide()

            $('#btnGuardarVentas').removeClass('btn btn-primary');
            $('#btnGuardarVentas').removeClass('btn btn-danger');
            $("#btnGuardarVentas").show();
            if (IntervencionSanitaria.TipoAccion == 'A') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }

            $('#cboCoordinadorIntSanit').val("21674");      //POR DEFECTO A PETICION DEL ING VLADIMIR Y AREA USUARIA
            $('.chzn-select').chosen().trigger("chosen:updated");

            MostrarAreaRegistro();
        });

        $('#btnModificarVentas').on('click', async function () {

            await IntervencionSanitaria.LimpiarFormularioVariables()

            IntervencionSanitaria.TipoAccion = 'M'



            let objTblIntervencionSanitaria = oTable_IntervencionSanitaria.api(true).row('.selected').data()

            if (isEmpty(objTblIntervencionSanitaria)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }


            if (objTblIntervencionSanitaria.idEstadoMovimiento == 0) {
                alerta(2, 'La Venta/Preventa se encuentra Anulada, no se podra modificar')
                return false
            }

            $('#txtNombreProducto').prop('disabled', false)
            $('#btnAgregaProducto').prop('disabled', false)
            $('#btnQuitarProducto').prop('disabled', false)

            let movNumero = objTblIntervencionSanitaria.movNumero
            let idEstado = 1

            IntervencionSanitaria.MovNumero = objTblIntervencionSanitaria.movNumero
            IntervencionSanitaria.IdEstadoMovimiento = 1

            await IntervencionSanitaria.CargarDatosVentaDirecta(movNumero, idEstado)


            if (objTblIntervencionSanitaria.estado == "Con Documento Emitido") {
                $("#btnGuardarVentas").hide();
            }


            MostrarAreaRegistro();
        });

        $('#btnEliminarVentas').on('click', async function () {
            let objTblIntervencionSanitaria = oTable_IntervencionSanitaria.api(true).row('.selected').data()

            if (isEmpty(objTblIntervencionSanitaria)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            if (objTblIntervencionSanitaria.idEstadoMovimiento == 0) {
                alerta(2, 'La Venta/Preventa se encuentra Anulada, no se podra eliminar')
                return false
            }

            IntervencionSanitaria.TipoAccion = 'E'

            if (objTblIntervencionSanitaria.tipoVenta == 'D') {
                let movNumero = objTblIntervencionSanitaria.movNumero
                let idEstado = 0

                await IntervencionSanitaria.CargarDatosVentaDirecta(movNumero, idEstado)

            } else if (objTblIntervencionSanitaria.tipoVenta == 'P') {

                let idPreventa = objTblIntervencionSanitaria.idPreventa
                let idEstado = 0

                await IntervencionSanitaria.CargarDatosPreventa(idPreventa, idEstado)

            }

            if (objTblIntervencionSanitaria.estado == "Con Documento Emitido") {
                $("#btnGuardarVentas").hide();
            }

            MostrarAreaRegistro();
        });

        $('#btnConsultarVentas').on('click', async function () {
            let objTblIntervencionSanitaria = oTable_IntervencionSanitaria.api(true).row('.selected').data()

            if (isEmpty(objTblIntervencionSanitaria)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            IntervencionSanitaria.TipoAccion = 'C'

            if (objTblIntervencionSanitaria.tipoVenta == 'D') {
                let movNumero = objTblIntervencionSanitaria.movNumero
                let idEstado = 1

                await IntervencionSanitaria.CargarDatosVentaDirecta(movNumero, idEstado)
            } else if (objTblIntervencionSanitaria.tipoVenta == 'P') {

                let idPreventa = objTblIntervencionSanitaria.idPreventa
                let idEstado = 1

                await IntervencionSanitaria.CargarDatosPreventa(idPreventa, idEstado)

            }

            MostrarAreaRegistro();
        });



        $('#btnCancelarVentas').on('click', function () {
            //TriajeRn.LimpiarCamposRegistro();
        });

        $('#btnGuardarVentas').on('click', async function () {
            let errorMensaje = ''

            if (isEmpty($('#cboFarmaciaVenta').val())) {

                alerta2('warning', '', `Por favor elija el Almacén Origen`)

                return false
            }

            if ($('#rdbVenta').is(':checked')) { // Venta

                if ($('#txtDatosDeCuenta').val() == '') {
                    alerta2('warning', '', `Por favor ingrese el N° de Cuenta`)
                    return false
                }

                if (isEmpty($('#cboPrescriptor').val())) {
                    alerta2('warning', '', `Por favor elija el Prescriptor`)
                    return false
                }

            }

            //if (isEmpty($('#cboTipoReceta').val()) && $('#cboTipoReceta').val() != '0') {
            //    alerta2('warning', '', `Por favor elija el Tipo de Receta`)
            //    return false
            //}

            if (isEmpty($('#cboTipoFinanciamiento').val())) {
                alerta2('warning', '', `Por favor elija el PRODUCTO/PLAN`)
                return false
            }

            if ($('#txtFechaPrescripcion').val() == '') {
                alerta2('warning', '', `Por favor ingrese la Fecha Prescripcion`)
                $('#txtFechaPrescripcion').focus()
                return false
            }

            if ($('#txtHoraPrescripcion').val() == '') {
                alerta2('warning', '', `Por favor ingrese la Hora Prescripcion`)
                $('#txtHoraPrescripcion').focus()
                return false
            }

            if (isEmpty($('#cboCoordinadorIntSanit').val()) && $('#cboCoordinadorIntSanit').val() != '0') {
                alerta2('warning', '', `Por favor elija el Coordinador`)
                return false
            }

            if (isEmpty($('#cboComponenteIntSanit').val()) && $('#cboComponenteIntSanit').val() != '0') {
                alerta2('warning', '', `Por favor elija el Componente`)
                return false
            }

            if (isEmpty($('#cboSubComponenteIntSanit').val()) && $('#cboSubComponenteIntSanit').val() != '0') {
                alerta2('warning', '', `Por favor elija el Sub-Componente`)
                return false
            }

            if (isEmpty($('#cboDiagnosticoIntSanit').val()) && $('#cboDiagnosticoIntSanit').val() != '0') {
                alerta2('warning', '', `Por favor elija el Diagnóstico`)
                return false
            }

            if (isEmpty($('#cboPrescriptor').val()) && $('#cboPrescriptor').val() != '0') {
                alerta2('warning', '', `Por favor elija el presscriptor`)
                return false
            }



            let detalleProductos = oTable_DetalleIntervencionSanitaria.api(true).data().toArray()

            if (detalleProductos.length == 0) {

                alerta2('warning', 'Agregar Int. Sanitaria', `Por favor ingrese algun producto`)
                return false
            }

            let validaPsicotropico = detalleProductos.some(obj => Object.values(obj).includes('N'));
            if (validaPsicotropico) {
                if (isEmpty($('#txtNroFormatoIntSanit').val())) {
                    alerta2('warning', 'Agregar Int. Sanitaria', `Exisen psicotropicos en el despacho.<br> Por favor ingrese el Nº Formato.`)
                    $('#txtNroFormatoIntSanit').focus()
                    return false
                }
            }

            for (let obj of detalleProductos) {
                if (parseInt($(`#txtCant_idItem_${obj.idItem}`).val()) <= 0) {
                    errorMensaje += `
                        <tr>
                            <td style="text-align: left !important;">${obj.codigo} - ${obj.producto}</td>
                            <td>${parseInt($(`#txtCant_idItem_${obj.idItem}`).val())}</td>
                        </tr>`
                }
            }

            if (errorMensaje != '') {

                swal({
                    title: 'Info',
                    html: `
                        Debe ingresar una cantidad mayor a cero para los siguientes productos:
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                            <tbody>
                            <tr>
                                <th style="width: 45%; background: #f0f0f0; text-align: left; !important">Producto</th>
                                <th style="width: 10%; background: #f0f0f0; text-align: center !important;">Cantidad</th>
                            </tr>
                                ${errorMensaje}
                            </tbody>
                        </table>`,
                    type: 'info',
                    confirmButtonColor: '#4fb7fe',
                    confirmButtonText: 'Aceptar'
                }).then(() => { });
                return false
            }

            for (let obj of detalleProductos) {
                if (parseInt($(`#txtCant_idItem_${obj.idItem}`).val()) > obj.saldo) {
                    errorMensaje += `
                        <tr>
                            <td style="text-align: left !important;">${obj.codigo} - ${obj.producto}</td>
                            <td>${obj.saldo}</td>
                            <td>${parseInt($(`#txtCant_idItem_${obj.idItem}`).val())}</td>
                        </tr>`
                }
            }

            if (errorMensaje != '') {

                swal({
                    title: 'Info',
                    html: `
                        No hay saldos suficientes para los siguientes productos:
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                            <tbody>
                            <tr>
                                <th style="width: 35%; background: #f0f0f0;">Producto</th>
                                <th style="width: 10%; background: #f0f0f0; text-align: center !important;">Saldo</th>
                                <th style="width: 10%; background: #f0f0f0; text-align: center !important;">Cantidad</th>
                            </tr>
                                ${errorMensaje}
                            </tbody>
                        </table>`,
                    type: 'info',
                    confirmButtonColor: '#4fb7fe',
                    confirmButtonText: 'Aceptar'
                }).then(() => { });
                return false
            }



            for (let obj of detalleProductos) {
                if (parseFloat(obj.precio) <= 0) {
                    errorMensaje += `
                        <tr>
                            <td style="text-align: left !important;">${obj.codigo} - ${obj.producto}</td>
                            <td>${obj.precio}</td>
                        </tr>`
                }
            }

            if (errorMensaje != '') {
                swal({
                    title: 'Info',
                    html: `
                        No hay precio para los siguientes productos:
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                            <tbody>
                            <tr>
                                <th style="width: 35%; background: #f0f0f0;">Producto</th>
                                <th style="width: 10%; background: #f0f0f0; text-align: center !important;">Precio</th>
                            </tr>
                                ${errorMensaje}
                            </tbody>
                        </table>`,
                    type: 'info',
                    confirmButtonColor: '#4fb7fe',
                    confirmButtonText: 'Aceptar'
                }).then(() => { });
                return false
            }


            let ventaDirecta = IntervencionSanitaria.AgregarDatosDeVentaDirecta()
            //await TriajeRn.GuardarTriajeRecienNacido();
        });

        $('#btnCancelarVentas').on('click', async function () {
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


        $('#txtProductoBusqueda').on("keyup", async function (event) {
            await IntervencionSanitaria.ListarProductosBuscados();

        });


        $('#cboFarmaciaVenta').on('change', async function () {
            await IntervencionSanitaria.FarmaciaDestinoNI_Change();

        });
        $('#cboTipoReceta').on('change', async function () {
            IntervencionSanitaria.oDoPreventa.idTipoReceta = $('#cboTipoReceta').val()
            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idTipoReceta = $('#cboTipoReceta').val()

        });

        $('#cboConceptoNI').on('change', async function () {
            await IntervencionSanitaria.ConceptoNI_Change();
        });

        $('#cboOrigenNI').on('change', async function () {
            await IntervencionSanitaria.XXXXX();
        });

        $('#cboTipoDocumentoNI').on('change', async function () {
            await IntervencionSanitaria.XXXXXXXXX();
        });


        $("#cboComponenteIntSanit").on("change", async function () {
            let idComponente = $("#cboComponenteIntSanit").val();
            if (idComponente > 0) {
                await IntervencionSanitaria.ListaSubComponentes(idComponente);
            }
        });

        $("#cboSubComponenteIntSanit").on("change", async function () {
            let codigo = isNull($("#cboSubComponenteIntSanit option:selected").data('cie10'), '');
            await IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria(codigo);
            let idDiagnostico = $('#cboDiagnosticoIntSanit option[data-cie10="' + codigo + '"]').val();
            $('#cboDiagnosticoIntSanit').val(idDiagnostico);
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        //$("#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input").on("change", async function () {
        $('#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria(filtro);
        });


        $('#btnCerrarTicket').on('click', async function () {
            $("#modalInforme").modal('hide')
        });

    },

    //////////////////////////LLENAR COMBOS////////////////////////////////////////////////////
    LLenarCombos() {
        IntervencionSanitaria.CargarComboFarmaciasNI();

        IntervencionSanitaria.ListaCoordinadores();
        IntervencionSanitaria.ListaComponentes();
        //await Ordenes.ListaSubComponentes();
        IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria('');
    },

    CargarComboFarmaciasNI() {
        let filtroFarmacia = "idTipoLocales='" + $("#TipoFarmacia").html() + "' and idEstado=1";
        var dataFiltroFarmacia = new FormData();
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
                $('#cboFarmaciaVenta').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboFarmaciasBusq').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                    $('#cboFarmaciaVenta').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" esUnidosis="' + obj.esUnidosis + '">' + obj.descripcion + '</option>');
                });
                $('#cboFarmaciasBusq').val("");
                $('#cboFarmaciaVenta').val("");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });



        $.ajax({
            method: "GET",
            url: "/Farmacias/FarmTipoRecetaDevuelveTodos?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboTipoReceta').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoReceta').append('<option  value="' + obj.idTipoReceta + '">' + obj.tipoReceta + '</option>');
                });
                $('#cboTipoReceta').val("");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar tipos receta!", "2");
            }
        });

        dataFiltroFarmacia = new FormData();
        dataFiltroFarmacia.append('Filtro', '');
        $.ajax({
            method: "POST",
            url: "/Farmacias/TipoFinanciamientosDevuelveSoloFarmacia?area=Farmacia",
            data: dataFiltroFarmacia,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboTipoFinanciamiento').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoFinanciamiento').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoFinanciamiento').val("");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        //COMENTADO POR KHOYOSI
        //$.ajax({
        //    method: "GET",
        //    url: "/Farmacias/MedicosSeleccionarTodosOrdenadoAlfabeticamente?area=Farmacia",
        //    dataType: "json",
        //    async: false,
        //    cache: false,
        //    processData: false,
        //    contentType: false,
        //    success: function (datos) {
        //        $('#cboPrescriptor').empty();
        //        $(datos.lstData.table).each(function (i, obj) {
        //            $('#cboPrescriptor').append('<option  value="' + obj.idMedico + '">' + obj.dmedico + '</option>');
        //        });
        //        $('#cboPrescriptor').val("");
        //    },
        //    error: function (msg) {
        //        alerta("ERROR", "Error listar tipos receta!", "2");
        //    }
        //});

        //////////AGREGADO POR KHOYOSI (COEMNTADO)///////////////////////////////////
        //$.ajax({
        //    method: "POST",
        //    url: "/Utilitario/ListarProfesionalesDeLaSalud?area=Comun",
        //    dataType: "json",
        //    async: false,
        //    cache: false,
        //    processData: false,
        //    contentType: false,
        //    success: function (datos) {
        //        $('#cboPrescriptor').empty();
        //        $(datos.dataSet.table).each(function (i, obj) {
        //            if (obj.idColegioHIS == '01' || obj.idColegioHIS == '03' || obj.idColegioHIS == '05') {
        //                $('#cboPrescriptor').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
        //            }                    
        //        });
        //        $('#cboPrescriptor').val("");
        //    },
        //    error: function (msg) {
        //        alerta("ERROR", "Error listar tipos receta!", "2");
        //    }
        //});

        //////////AGREGADO POR KHOYOSI///////////////////////////////////
        $.ajax({
            method: "POST",
            url: "/Receta/ListarPrescriptores?area=Comun",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboPrescriptor').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboPrescriptor').append('<option  value="' + obj.idEmpleado + '">' + obj.medico + '</option>');
                });
                $('#cboPrescriptor').val("");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar tipos receta!", "2");
            }
        });


        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async FarmaciaDestinoNI_Change() {
        if ($('#cboFarmaciaVenta').val() > 0) {
            $(".camposRegistro").removeAttr("disabled");
        } else {
            $(".camposRegistro").attr("disabled", true);
            return;
        }

        //await IntervencionSanitaria.FarmTipoConceptosDevuelveParaRegistroDeNiNs();
        IntervencionSanitaria.esUnidosisLaFarmacia = parseInt($('#cboFarmaciaVenta option:selected').attr('esUnidosis'));
        let tipoVenta = $('input[name="rdbTipoVentaBusqueda"]:checked').val();
        IntervencionSanitaria.TipoVenta_Change(tipoVenta);
    },

    async TipoVenta_Change(tipoVenta) {
        if (tipoVenta == 1) {
            let oRsTipoFinanciamiento = await IntervencionSanitaria.TipoFinanciamientosDevuelveSoloFarmacia(" and dbo.TiposFinanciamiento.esFuenteFinanciamiento=1")

            $('#cboTipoFinanciamiento').empty();
            $(oRsTipoFinanciamiento).each(function (i, obj) {
                $('#cboTipoFinanciamiento').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoFinanciamiento').val("");

            $('#cboTipoFinanciamiento').prop('disabled', true)
            $('#txtNroCuenta').prop('disabled', false)

            // validar si se habilita la opcion agregar
            $('#cboTipoReceta').val(1);


            $('#txtNroHistoria').prop('disabled', true);
            $('#btnBuscarDatosPacienteNroHistoria ').prop('disabled', true);
            $('#txtNroDocumentoPaciente').prop('disabled', true);
            $('#btnBuscarDatosPacienteNroDocumento').prop('disabled', true);
            $('#txtNombrePaciente').prop('disabled', true);
            //$('#cboServicioRegistro').prop('disabled', true);
            $('#cboServicioRegistro').removeAttr('disabled');

            $('.chzn-select').chosen().trigger("chosen:updated");


            //grdProductos.TipoVentaSeleccionada = 0
            //ms_MensajeError = ms_MensajeError + mo_ReglasFarmacia.MensajeError
            //mo_Formulario.HabilitarDeshabilitar Me.cmbTipoFinanciamiento, False --
            //mo_Formulario.HabilitarDeshabilitar Me.txtNhistoria, False
            //mo_Formulario.HabilitarDeshabilitar Me.txtObservaciones, True
            //mo_Formulario.HabilitarDeshabilitar Me.txtNcuenta, True --
            //If mi_Opcion = sghAgregar Then
            //        mo_cmbTipoReceta.BoundText = "1" --
            //End If
            //FraRedondeo.Visible = False
            //chkPlanNoCubre.Enabled = True
            //lnIdTipoServicio = 0
            //btnBuscarPaciente.Enabled = False
            //cmdBuscaCuentaPorApellidos.Enabled = True
        } else if (tipoVenta == 2) {
            let oRsTipoFinanciamiento = await IntervencionSanitaria.TipoFinanciamientosDevuelveSoloFarmacia(" and dbo.TiposFinanciamiento.TipoVenta='P'")
            lcPosicionDefaultCombo = ""

            if (oRsTipoFinanciamiento.length == 1) {
                lcPosicionDefaultCombo = oRsTipoFinanciamiento[0].idTipoFinanciamiento
            }

            $('#cboTipoFinanciamiento').empty();
            $(oRsTipoFinanciamiento).each(function (i, obj) {
                $('#cboTipoFinanciamiento').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoFinanciamiento').val(1);

            $('#cboTipoFinanciamiento').prop('disabled', false)
            $('#txtNroCuenta').prop('disabled', false)

            $('#cboTipoReceta').val('');

            $('#txtNroHistoria').removeAttr('disabled');
            $('#btnBuscarDatosPacienteNroHistoria ').removeAttr('disabled');
            $('#txtNroDocumentoPaciente').removeAttr('disabled');
            $('#btnBuscarDatosPacienteNroDocumento').removeAttr('disabled');
            $('#txtNombrePaciente').removeAttr('disabled');
            $('#cboServicioRegistro').removeAttr('disabled');

            //If optPreventa.Value Then



            //    If mi_Opcion = sghAgregar Then
            //            cmbTipoReceta.Text = ""
            //            cmbTipoReceta.SetFocus
            //    End If
            //            FraRedondeo.Visible = True
            //            chkPlanNoCubre.Enabled = False
            //            lnIdTipoServicio = 0
            //            btnBuscarPaciente.Enabled = False
            //            cmdBuscaCuentaPorApellidos.Enabled = True
            //End If

            $('.chzn-select').chosen().trigger("chosen:updated");
        }
    },

    //async FarmTipoConceptosDevuelveParaRegistroDeNiNs() {
    //    let midata = new FormData();
    //    midata.append('TipoAlmacen', $("#TipoFarmacia").html());
    //    midata.append('TipoMov', 'E');
    //    midata.append('TipoSuministro', $('#cboFarmaciaVenta option:selected').attr('tipoSuministro'));

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Farmacias/FarmTipoConceptosDevuelveParaRegistroDeNiNs?area=Farmacia",
    //                data: midata,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        $('#cboConceptoNI').empty();
    //        if (datos.lstData.table.length > 0) {
    //            $(datos.lstData.table).each(function (i, obj) {
    //                $('#cboConceptoNI').append('<option value="' + obj.idTipoConcepto + '" documentoUltimoNumero="' + obj.documentoUltimoNumero + '">' + obj.concepto + '</option>');
    //            });
    //        }
    //        $('#cboConceptoNI').val("");
    //        $('.chzn-select').chosen().trigger("chosen:updated");
    //    } catch (error) {
    //        alerta2("danger", "", error.toString());
    //    }
    //},

    async ConceptoNI_Change() {
        let filtroFarmacia = '';

        const concepto = await IntervencionSanitaria.SeleccionarConceptoNI(parseInt($('#cboConceptoNI').val()));
        console.log(concepto);


        if (concepto.documentoId == 22) {                //NINGUNO            
            $('#txtNroDocumentoNI').attr('disabled', true);
            $('#txtFechaRecepcionNI').attr('disabled', true);
        } else {
            $('#txtNroDocumentoNI').removeAttr('disabled');
            $('#txtFechaRecepcionNI').removeAttr('disabled');
        }

        if (concepto.niDocumentoOrigenId == 22) {                //NINGUNO            
            $('#txtNroDocumentoOrigenNI').attr('disabled', true);
            $('#txtFechaDocumentoOrigenNI').attr('disabled', true);
        } else {
            $('#txtNroDocumentoOrigenNI').removeAttr('disabled');
            $('#txtFechaDocumentoOrigenNI').removeAttr('disabled');
        }

        if (concepto.niEsCompra == true) {
            if (concepto.conceptoCodigo == "01") {
                $('#cboTipoProcesoNI').removeAttr('disabled');
                $('#cboTipoCompraNI').removeAttr('disabled');
                $('#txtNroProcesoNI').removeAttr('disabled');
            } else {
                $('#cboTipoProcesoNI').attr('disabled', true);
                $('#cboTipoCompraNI').attr('disabled', true);
                $('#txtNroProcesoNI').attr('disabled', true);
            }
            $('#txtNroRucNI').removeAttr('disabled');
            $('#txtRazonSocialRucNI').removeAttr('disabled');

            await IntervencionSanitaria.ListarTiposCompraSegunFiltro("idTipoCompra<>1");
            await IntervencionSanitaria.ListarTiposProcesoSegunFiltro("idTipoProceso<>1");


        } else {
            $('#cboTipoProcesoNI').attr('disabled', true);
            $('#cboTipoCompraNI').attr('disabled', true);
            $('#txtNroProcesoNI').attr('disabled', true);
            $('#txtNroRucNI').attr('disabled', true);
            $('#txtRazonSocialRucNI').attr('disabled', true);

            await IntervencionSanitaria.ListarTiposCompraSegunFiltro("");
            $('#cboTipoCompraNI').val("1");
            await IntervencionSanitaria.ListarTiposProcesoSegunFiltro("");
            $('#cboTipoProcesoNI').val("1");
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
        //if ($('#cboConceptoRegistro').val() == 20) {
        //    filtroFarmacia = "idAlmacen=0 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(10)
        //} else if ($('#cboConceptoRegistro').val() == 22) {
        //    filtroFarmacia = "idTipoLocales='X' and idAlmacen<>0 and idAlmacen<>1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(23)
        //} else if ($('#cboConceptoRegistro').val() == 6) {
        //    filtroFarmacia = "idAlmacen=1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(4)
        //} else if ($('#cboConceptoRegistro').val() == 7) {
        //    filtroFarmacia = "idAlmacen=1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(4)
        //} else if ($('#cboConceptoRegistro').val() == 5) {
        //    filtroFarmacia = "idAlmacen=1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(4)
        //} else if ($('#cboConceptoRegistro').val() == 4) {
        //    filtroFarmacia = "idTipoLocales='F'  and idTipoSuministro='" + $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro") + "' and idEstado=1";
        //    $('#cboTipoDocRegistro').val(3)
        //} else if ($('#cboConceptoRegistro').val() == 9) {
        //    filtroFarmacia = "idTipoLocales='X' and idAlmacen<>0 and idAlmacen<>1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(24)
        //} else if ($('#cboConceptoRegistro').val() == 8) {
        //    filtroFarmacia = "idTipoLocales='X' and idAlmacen<>0 and idAlmacen<>1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(24)
        //} else if ($('#cboConceptoRegistro').val() == 12) {
        //    filtroFarmacia = "idTipoLocales='X' and idAlmacen<>0 and idAlmacen<>1 and idEstado=1";
        //    $('#cboTipoDocRegistro').val(8)
        //}

        //$('#txtNroDocNotaSalida').val($('#cboConceptoRegistro>option:selected').attr("documentoUltimoNumero"));

        //var midata = new FormData();
        //midata.append('filtro', filtroFarmacia);

        //try {
        //    Cargando(1);
        //    datos = await
        //        $.ajax({
        //            method: "POST",
        //            url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
        //            data: midata,
        //            dataType: "json",
        //            cache: false,
        //            processData: false,
        //            contentType: false,
        //        });
        //    Cargando(0);
        //    $('#cboConceptoNI').empty();
        //    if (datos.lstData.table.length > 0) {
        //        $(datos.lstData.table).each(function (i, obj) {
        //            $('#cboDestinoRegistro').append('<option value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
        //        });
        //    }
        //    $('#cboConceptoNI').val("");
        //    $('.chzn-select').chosen().trigger("chosen:updated");
        //} catch (error) {
        //    alerta2("danger", "", error.toString());
        //}
    },

    //////////////////////////METODOS BACKED///////////////////////////////////////////////////////////
    async ListarVentas() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (IntervencionSanitaria.ValidarBusquedaNotasIngreso() == false) {
            return false;
        }

        let tipoVenta = ''

        if ($('input[name="rdbTipoVentaBusqueda"]:checked').val() == 1) {
            tipoVenta = 'D'
        } else {
            tipoVenta = 'P'
        }

        data.append('tipoVenta', tipoVenta);
        data.append('IdAlmacen', $("#cboFarmaciasBusq").val());
        data.append('FechaInicio', $("#txtFechaInicioBusq").val() + ' ' + $("#txtHoraInicioBusq").val());
        data.append('FechaFin', $("#txtFechaFinalBusq").val() + ' ' + $("#txtHoraFinalBusq").val());
        data.append('IdCuentaAtencion', $("#txtNroCuentaBusq").val());
        data.append('DocumentoNumero', $("#txtNroGuiaBusq").val());

        try {
            Cargando(1);
            oTable_IntervencionSanitaria.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/DevuelveCabeceraDeVentasOpreventaIntervencionesSanitarias?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_IntervencionSanitaria.fnAddData(datos.lstData.table);
                oTable_IntervencionSanitaria.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', JSON.stringify(error));
        }

        return resp;
    },

    async SeleccionarConceptoNI(idTipoConcepto) {
        resp = null;
        var midata = new FormData();
        midata.append('IdTipoConcepto', idTipoConcepto);
        midata.append('TipoAlmacen', $("#TipoFarmacia").html());
        midata.append('TipoMov', 'E');
        midata.append('TipoSuministro', $('#cboFarmaciaVenta option:selected').attr('tipoSuministro'));

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
            alerta2("danger", "", error.toString());
        }
        return resp;
    },

    async ListarTiposCompraSegunFiltro(filtro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

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
                    $('#cboTipoCompraNI').append('<option value="' + obj.idTipoCompra + '" codigoMinsa="' + obj.codigoMINSA + '">' + obj.descripcion + '</option>');
                });
            }
            $('#cboTipoCompraNI').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            Cargando(0);
            alerta2('danger', JSON.stringify(error));
        }

    },

    async ListarTiposProcesoSegunFiltro(filtro) {
        var respuesta;
        var resp = false;
        let descripcion = "";
        let datos
        var data = new FormData();

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
                descripcion = obj.descripcion;
                descripcion = descripcion.replace('<', '-');
                descripcion = descripcion.replace('>', '-');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoProcesoNI').append('<option value="' + obj.idTipoProceso + '" codigoMinsa="' + obj.codigoMINSA + '">' + obj.descripcion + '</option>');
                });
            }
            $('#cboTipoProcesoNI').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            Cargando(0);
            alerta2('danger', JSON.stringify(error));
        }

    },

    async ListarProductosBuscados() {
        resp = null;
        let inputVal = $("#txtProductoBusqueda").val().trim();
        var midata = new FormData();
        midata.append('lnIdAlmacen', $('#cboFarmaciaVenta').val());
        midata.append('lcFiltro', inputVal);

        try {
            Cargando(1);
            oTable_ProductosBuscados.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente?area=Farmacia",
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
        } catch (error) {
            alerta2("danger", "", error.toString());
        }
        //return resp;
    },

    async TipoFinanciamientosDevuelveSoloFarmacia(Filtro) {
        let dataFiltroFarmacia = new FormData();
        dataFiltroFarmacia.append('Filtro', Filtro);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/TipoFinanciamientosDevuelveSoloFarmacia?area=Farmacia",
                    data: dataFiltroFarmacia,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData.table
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("danger", "", error.toString());
        }
    },

    async PacientesFiltrarTodos() {
        let resp = null;

        let midata = new FormData();
        midata.append('NroHistoriaClinica', $('#txtBusquedaPacienteNroHistoria').val());
        midata.append('apellidoPaterno', $('#txtBusquedaPacienteApPaterno').val());
        midata.append('apellidoMaterno', $('#txtBusquedaPacienteApMaterno').val());
        midata.append('primerNombre', $('#txtBusquedaPacientePrimerNombre').val());
        midata.append('segundoNombre', '');
        midata.append('idDocIdentidad', '1');
        midata.append('NroDocumento', $('#txtBusquedaPacienteDNI').val());
        midata.append('FichaFamiliar', '');

        try {
            Cargando(1);
            oTable_BusquedaPacientes.fnClearTable();
            oTable_AtencionesPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/PacientesFiltrarTodos?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData?.table?.length > 0) {
                oTable_BusquedaPacientes.fnAddData(datos.lstData.table);
                oTable_BusquedaPacientes.resize();
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
            Cargando(0);
        }
        //return resp;
    },

    async AtencionesPacienteFiltrarTodos(idPaciente) {
        let resp = null;

        let midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            oTable_AtencionesPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListarAtencionesPaciente?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_AtencionesPacientes.fnAddData(datos.respuesta.table);
                oTable_AtencionesPacientes.resize();
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
            Cargando(0);
        }
        //return resp;
    },

    async RecetaCabeceraDetalleSeleccionaPorNroReceta(IdReceta) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdReceta', IdReceta);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaCabeceraDetalleSeleccionaPorNroReceta?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table
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

    async FarmDevuelveSaldosSegunAlmacenProducto(idAlmacen, idProducto) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveSaldosSegunAlmacenProducto?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
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

    async FarmDevuelveSaldosSegunAlmacenProductoTipoSalida(idAlmacen, idProducto, idTipoSalidaBienInsumo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);
        data.append('idTipoSalidaBienInsumo', idTipoSalidaBienInsumo);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveSaldosSegunAlmacenProductoTipoSalida?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
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

    async AtencionesSelecionarPorCuenta(idCuentaAtencion) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCuentaAtencion', idCuentaAtencion);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/AtencionesSelecionarPorCuenta?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
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

    async DevuelveServiciosDelHospitalFiltro(filtro) {

        var dataFiltro = new FormData();
        dataFiltro.append('Filtro', filtro);
        $.ajax({
            method: "POST",
            url: "/Farmacias/DevuelveServiciosDelHospitalFiltro?area=Farmacia",
            data: dataFiltro,
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboServicioRegistro').empty();

                $('#cboServicioRegistro').append('<option value="' + 0 + '">Seleccione una opción</option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboServicioRegistro').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });
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
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmRecetaRelacionOrdenPagoBuscar(NroReceta) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroReceta', NroReceta);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmRecetaRelacionOrdenPagoBuscar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async CajaNroDocumentoSeleccionarPorId(IdTipoComprobante, IdCaja) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdTipoComprobante', IdTipoComprobante);
        data.append('IdCaja', IdCaja);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CajaNroDocumentoSeleccionarPorId?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async CajaNroDocumentoModificar(IdTipoComprobante, NroDocumento, NroSerie, NroDocumentoFinal, IdCaja, NroDocumentoInicial) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdTipoComprobante', IdTipoComprobante);
        data.append('NroDocumento', NroDocumento);
        data.append('NroSerie', NroSerie);
        data.append('NroDocumentoFinal', NroDocumentoFinal);
        data.append('IdCaja', IdCaja);
        data.append('NroDocumentoInicial', NroDocumentoInicial);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CajaNroDocumentoModificar?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            return datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FuentesFinanciamientoSeleccionarPorId(IdFuenteFinanciamiento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdFuenteFinanciamiento', IdFuenteFinanciamiento);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FuentesFinanciamientoSeleccionarPorId?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async RecetaCabeceraPoridReceta(lnidReceta) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('lnidReceta', lnidReceta);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaCabeceraPoridReceta?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmDevuelveSaldosConLotesSegunAlmacen(IdAlmacen, Orden, Filtro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdAlmacen', IdAlmacen);
        data.append('Orden', Orden);
        data.append('Filtro', Filtro);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveSaldosConLotesSegunAlmacen?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async SeleccionaParametros(idParametro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('idParametro', idParametro);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionaParametros?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.dataSet.table.length > 0) {

                return datos.dataSet.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async ChequeaQueSaldosConLotesSeaPositivo(lnIdAlmacen, lnIdProducto, lcLote, ldFechaVencimiento, lnIdTipoSalidaBienInsumo, cantidad) {

        let saldoAlmacen = await IntervencionSanitaria.FarmDevuelveSaldosSegunAlmacenProductoLote(lnIdAlmacen, lnIdProducto, lcLote, ldFechaVencimiento, lnIdTipoSalidaBienInsumo)

        if (isEmpty(saldoAlmacen)) {
            return false
        }

        if (saldoAlmacen.cantidad >= cantidad) {
            return true
        } else {
            return false
        }
    },

    async ObtenerSiguienteNumeroDocumentoYGrabarlo(IdTipoComprobante, IdCaja) {
        let cajaNroDocumento = await IntervencionSanitaria.CajaNroDocumentoSeleccionarPorId(IdTipoComprobante, IdCaja)

        try {
            if (!isEmpty(cajaNroDocumento)) {
                let datosCaja = {
                    idCaja: cajaNroDocumento.idCaja,
                    idTipoComprobante: cajaNroDocumento.idTipoComprobante,
                    nroDocumento: cajaNroDocumento.nroDocumento,
                    nroSerie: cajaNroDocumento.nroSerie,
                    nroDocumentoInicial: cajaNroDocumento.nroDocumentoInicial,
                    nroDocumentoFinal: cajaNroDocumento.nroDocumentoFinal
                }

                //let nroDocumento = datosCaja.nroDocumento
                datosCaja.nroDocumento = (parseInt(datosCaja.nroDocumento) + 1).toString().padStart(8, '0')

                let nroDocModificado = await IntervencionSanitaria.CajaNroDocumentoModificar(
                    IdTipoComprobante = datosCaja.idTipoComprobante, NroDocumento = datosCaja.nroDocumento, NroSerie = datosCaja.nroSerie,
                    NroDocumentoFinal = datosCaja.nroDocumentoFinal, IdCaja = datosCaja.idCaja, NroDocumentoInicial = datosCaja.nroDocumentoInicial)

                return datosCaja
            } else {
                return null
            }
        } catch (e) {
            alerta(2, 'Hubo un problema al generar el numero de documento')
            return null
        }



    },


    async SeleccionarConcepto(idTipoConcepto) {
        let resp = null;
        let midata = new FormData();
        midata.append('IdTipoConcepto', idTipoConcepto);
        midata.append('TipoAlmacen', $("#TipoFarmacia").html());
        midata.append('TipoMov', 'S');
        midata.append('TipoSuministro', $('#cboFarmaciaVenta option:selected').attr('tipoSuministro'));

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

    async FarmRelModDevuelveSegunFiltro(lcFiltro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('Filtro', lcFiltro);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmRelModDevuelveSegunFiltro?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmRelModActualizaSegunFiltro(filtro, lcDocumento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('filtro', filtro);
        data.append('lcDocumento', lcDocumento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmRelModActualizaSegunFiltro?area=Farmacia",
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



    async DevuelveDetalleProductosConLotes(lnIdAlmacen, productosParaDespachar, idTipoSalidaBienInsumo, parametro347) {

        let errorMensaje = ''
        let oRsDetalleProductosConLotes = []

        let objProductosConLotes = {
            IdProducto: null,
            Codigo: null,
            NombreProducto: null,
            Lote: null,
            FechaVencimiento: null,
            idTipoSalidaBienInsumo: null,
            Saldo: null,
            Cantidad: null,
            Precio: null,
            Total: null
        };

        let lbProductosConLoteOk = false

        for (let consolidado of productosParaDespachar) {

            let saldosEnEsteMomento = await IntervencionSanitaria.FarmDevuelveSaldosConLotesSegunAlmacen(lnIdAlmacen, 0, consolidado.codigo)

            if (isEmpty(saldosEnEsteMomento)) {
                errorMensaje += `${consolidado.codigo} - ${consolidado.nombreProducto} \n`
            } else {
                if (parametro347 != 'S') {
                    // saldosEnEsteMomento = saldosEnEsteMomento.filter(obj => obj.idTipoSalidaBienInsumoSaldo == idTipoSalidaBienInsumo)
                    saldosEnEsteMomento = saldosEnEsteMomento.filter(obj => obj.idTipoSalidaBienInsumoSaldo == consolidado.tipo)
                }

                lbProductosConLoteOk = false

                if (saldosEnEsteMomento.length > 0) {

                    let lnCantSaldo = consolidado.cantidad
                    let lnCantidadCargar = 0

                    for (let objSaldosEnEsteMomento of saldosEnEsteMomento) {
                        if (objSaldosEnEsteMomento.saldo > 0) { // añadir condicional para validar la fecha de vencimiento

                            lbProductosConLoteOk = true

                            let newObjProductosConLotes = { ...objProductosConLotes }

                            newObjProductosConLotes.IdProducto = consolidado.idProducto
                            newObjProductosConLotes.Codigo = consolidado.codigo
                            newObjProductosConLotes.NombreProducto = consolidado.nombreProducto
                            newObjProductosConLotes.Lote = objSaldosEnEsteMomento.lote
                            newObjProductosConLotes.FechaVencimiento = objSaldosEnEsteMomento.fechaVencimiento
                            newObjProductosConLotes.idTipoSalidaBienInsumo = objSaldosEnEsteMomento.idTipoSalidaBienInsumoSaldo
                            newObjProductosConLotes.Precio = consolidado.precio

                            if (lnCantSaldo >= objSaldosEnEsteMomento.saldo) {
                                lnCantidadCargar = objSaldosEnEsteMomento.saldo

                                newObjProductosConLotes.Cantidad = lnCantidadCargar
                                newObjProductosConLotes.Total = (lnCantidadCargar * consolidado.precio).toFixed(2)

                                lnCantSaldo = lnCantSaldo - objSaldosEnEsteMomento.saldo

                                oRsDetalleProductosConLotes.push(newObjProductosConLotes)

                                if (lnCantSaldo <= 0) {
                                    break;
                                }
                            } else {
                                lnCantidadCargar = lnCantSaldo

                                newObjProductosConLotes.Cantidad = lnCantidadCargar
                                newObjProductosConLotes.Total = (lnCantidadCargar * consolidado.precio).toFixed(2)

                                lnCantSaldo = 0

                                oRsDetalleProductosConLotes.push(newObjProductosConLotes)

                                break;

                            }


                        } else {
                            console.log('no hay saldo')
                            errorMensaje += `${consolidado.codigo} - ${consolidado.nombreProducto} \n`
                        }
                    }

                    if (lbProductosConLoteOk == false) {
                        console.log('acumular error de fecha de vencimiento')
                    }


                }
            }

        }

        if (errorMensaje != '') {
            swal({
                title: 'Info',
                html: `No hay Saldo para: \n ${errorMensaje}`,
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            })

            return null
        }

        return oRsDetalleProductosConLotes
    },

    async FarmDevuelveSaldosSegunAlmacenProductoLote(idAlmacen, idProducto, lote, fechaVencimiento, idTipoSalidaBienInsumo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);
        data.append('lote', lote);
        data.append('fechaVencimiento', fechaVencimiento);
        data.append('idTipoSalidaBienInsumo', idTipoSalidaBienInsumo);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveSaldosSegunAlmacenProductoLote?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async TiposFinanciamientoGeneraReciboPago(IdTipoFinanciamiento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdTipoFinanciamiento', IdTipoFinanciamiento);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/TiposFinanciamientoGeneraReciboPago?area=Caja",
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

    async ConsultaBloqueaTablaXidTipoFinanciamiento(idTipoFinanciamiento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('idTipoFinanciamiento', idTipoFinanciamiento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ConsultaBloqueaTablaXidTipoFinanciamiento?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {

                return datos.lstData.table[0]
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmMovimientoAgregarModificar(MovNumero, MovTipo, idAlmacenOrigen, idAlmacenDestino, idTipoConcepto, DocumentoIdtipo, DocumentoNumero,
        DocumentoFechaRecepcio, OrigenIdTipo, OrigenNumero, OrigenFecha, idProveedor,
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

        data.append('DocumentoFechaRecepcio', DocumentoFechaRecepcio);
        data.append('OrigenIdTipo', OrigenIdTipo);
        data.append('OrigenNumero', OrigenNumero);
        data.append('OrigenFecha', OrigenFecha);
        data.append('idProveedor', idProveedor);
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

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmMovimientoVentasAgregar(FarmMovimientoIntervencionSanitaria) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('movNumero', FarmMovimientoIntervencionSanitaria.movNumero);
        data.append('movTipo', FarmMovimientoIntervencionSanitaria.MovTipo);
        data.append('tipoVenta', FarmMovimientoIntervencionSanitaria.tipoVenta);
        data.append('idPreVenta', FarmMovimientoIntervencionSanitaria.idPreVenta);
        data.append('idTipoFinanciamiento', FarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento);
        data.append('idPrescriptor', FarmMovimientoIntervencionSanitaria.idPrescriptor);
        data.append('idTipoReceta', FarmMovimientoIntervencionSanitaria.idTipoReceta);
        data.append('idDiagnostico', FarmMovimientoIntervencionSanitaria.idDiagnostico);
        data.append('idCuentaAtencion', FarmMovimientoIntervencionSanitaria.idCuentaAtencion);
        data.append('IdServicioPaciente', FarmMovimientoIntervencionSanitaria.idServicioPaciente);
        data.append('idFuenteFinanciamiento', FarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento);
        data.append('idPaciente', FarmMovimientoIntervencionSanitaria.IdPaciente);
        data.append('FechaHoraPrescribe', FarmMovimientoIntervencionSanitaria.FechaHoraPrescribe);
        data.append('IdPaquete', FarmMovimientoIntervencionSanitaria.IdPaquete);
        //data.append('detalleNotaSalida', detalleNotaSalida);

        try {

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

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmMovimientoVentasDetalleAgregarV2(MovNumero, MovTipo, FarmMovimientoVentasDetalle) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        data.append('MovNumero', MovNumero);
        data.append('MovTipo', MovTipo);
        data.append('idProducto', FarmMovimientoVentasDetalle.idProducto);
        data.append('cantidad', FarmMovimientoVentasDetalle.cantidad);
        data.append('precio', FarmMovimientoVentasDetalle.precio);
        data.append('total', FarmMovimientoVentasDetalle.total);

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

    async AgregarDatosDeVentaDirecta() {

        if (IntervencionSanitaria.Guardando == 0) {
            Cargando(1)
            IntervencionSanitaria.Guardando = 1

            try {

                let detalleVenta = oTable_DetalleIntervencionSanitaria.api(true).data().toArray()
                let farmMovimientoDetalle = []
                let IdEstadoFacturacion = 1

                $(detalleVenta).each(function (i, obj) {
                    console.log('obj', obj)

                    let cantProducto = $('#txtCant_idItem_' + obj.idItem.toString()).val()

                    farmMovimientoDetalle.push({

                        idProducto: obj.idItem,
                        Lote: '', // validar
                        FechaVencimiento: '', // validar
                        idTipoSalidaBienInsumo: '2', // validar
                        Item: i + 1,
                        Cantidad: cantProducto,
                        Precio: obj.prVenta,
                        Total: obj.total,
                        RegistroSanitario: "",
                        DocumentoNumero: "",

                    })
                })

                if (IntervencionSanitaria.TipoAccion == 'E') {
                    IntervencionSanitaria.IdEstadoMovimiento = 0
                    IdEstadoFacturacion = 9
                } else {
                    IntervencionSanitaria.IdEstadoMovimiento = 1
                    IdEstadoFacturacion = 1
                }

                let res = await this.CrearModificarIntervencionSanitariaFarmacia(
                    MovNumero = IntervencionSanitaria.MovNumero, MovTipo = 'S', IdCuentaAtencion = $('#txtNroCuenta').val(), FechaHoraPrescribe = $('#txtFechaPrescripcion').val() + ' ' + $('#txtHoraPrescripcion').val(),
                    IdPaquete = '', NroFormato = $('#txtNroFormatoIntSanit').val(), IdReceta = $('#txtNroReceta').val(), DocumentoNumero = IntervencionSanitaria.DocumentoNumero,
                    Observaciones = $('#txtObservacionesIntSanit').val(), idEstadoMovimiento = IntervencionSanitaria.IdEstadoMovimiento, idAlmacenOrigen = $('#cboFarmaciaVenta').val(), idAlmacenDestino = 0,
                    IdFuenteFinanciamiento = $('#cboTipoFinanciamiento').val(),
                    IdPrescriptor = $('#cboPrescriptor').val(), IdCoordinador = $('#cboCoordinadorIntSanit').val(), IdComponente = $('#cboComponenteIntSanit').val(),
                    IdSubComponente = $('#cboSubComponenteIntSanit').val(), IdDiagnostico = $('#cboDiagnosticoIntSanit').val(), idEstadoFacturacion = IdEstadoFacturacion, movimientoDetalle = JSON.stringify(farmMovimientoDetalle))


                let data = res.data.table[0]
                let textoAlerta = ''
                let NuevoMovNumero = ''
                if (data.successNumber == 0) {
                    alerta2('error', '', data.errorMessage)
                    Cargando(0)
                    IntervencionSanitaria.Guardando = 0
                    return
                }

                NuevoMovNumero = data.movNumero

                if (IntervencionSanitaria.TipoAccion == 'E') {
                    textoAlerta = 'Se Anuló Nª ' + NuevoMovNumero + 'F'
                } else if (IntervencionSanitaria.TipoAccion == 'A') {
                    textoAlerta = "Se Agregó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeVentas?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                } else if (IntervencionSanitaria.TipoAccion == 'M') {
                    textoAlerta = "Se Modificó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeVentas?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                }

                alerta2('success', 'Venta', textoAlerta)

                if ($('#rdbPreventa').is(':checked')) {
                    $('input[name="rdbTipoVentaBusqueda"][value="2"]').prop('checked', 1) // Preventa
                } else if ($('#rdbVenta').is(':checked')) {
                    $('input[name="rdbTipoVentaBusqueda"][value="1"]').prop('checked', 1) // Preventa
                }

                $('#cboFarmaciasBusq').val($('#cboFarmaciaVenta').val())

                $('.chzn-select').chosen().trigger("chosen:updated");
                IntervencionSanitaria.Guardando = 0
                Cargando(0)
                MostrarAreaLista();

                $('#btnBuscar').trigger('click')


            } catch (error) {
                alerta(2, "Error al Guardar")
                console.error("Error al obtener saldos:", error);
                Cargando(0)
                IntervencionSanitaria.Guardando = 0
                return false
            }
        }
    },

    

   

    CrearModificarIntervencionSanitariaFarmacia: async function (MovNumero, MovTipo, IdCuentaAtencion, FechaHoraPrescribe, IdPaquete,
        NroFormato, IdReceta, DocumentoNumero, Observaciones, idEstadoMovimiento, idAlmacenOrigen, idAlmacenDestino, IdFuenteFinanciamiento,
        IdPrescriptor, IdCoordinador, IdComponente, IdSubComponente, IdDiagnostico, idEstadoFacturacion, movimientoDetalle) {

        let formData = new FormData();


        formData.append('MovNumero', MovNumero);
        formData.append('MovTipo', MovTipo);
        formData.append('IdCuentaAtencion', IdCuentaAtencion);

        formData.append('FechaHoraPrescribe', FechaHoraPrescribe);
        formData.append('IdPaquete', IdPaquete);

        formData.append('NroFormato', NroFormato);
        formData.append('IdReceta', IdReceta);
        formData.append('DocumentoNumero', DocumentoNumero);
        formData.append('Observaciones', Observaciones);
        formData.append('idEstadoMovimiento', idEstadoMovimiento);
        formData.append('idAlmacenOrigen', idAlmacenOrigen);
        formData.append('idAlmacenDestino', idAlmacenDestino);
        formData.append('IdFuenteFinanciamiento', IdFuenteFinanciamiento);

        formData.append('IdPrescriptor', IdPrescriptor);
        formData.append('IdCoordinador', IdCoordinador);
        formData.append('IdComponente', IdComponente);
        formData.append('IdSubComponente', IdSubComponente);
        formData.append('IdDiagnostico', IdDiagnostico);

        formData.append('idEstadoFacturacion', idEstadoFacturacion);

        formData.append('movimientoDetalle', movimientoDetalle); // debe estar como string XML

        formData.append('IdListBarItem', ObtenerItemListBar());

        let res = await HttpClient.Post('/IntervencionSanitaria/CrearModificarIntervencionSanitariaFarmacia?area=Farmacia', formData)


        return res
    },

   

    async FarmMovimientoProgramasSeleccionar(MovNumero) {
        //da
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('MovNumero', MovNumero);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoProgramasSeleccionar?area=Farmacia",
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
            alerta(2, JSON.stringify(error));
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

    async FarmMovimientoVentasSeleccionarPorId(movNumero, tipo) {
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
                    url: "/Farmacias/FarmMovimientoVentasSeleccionarPorId?area=Farmacia",
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
                return datos.lstData.table
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async FarmMovimientoVentasDetalleSeleccionarPorCuenta(idCuentaAtencion) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('idCuentaAtencion', idCuentaAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoVentasDetalleSeleccionarPorCuenta?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData.table
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async PacientesSeleccionarPorNroHistoria(NroDocumento) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('NroDocumento', NroDocumento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/PacientesSeleccionarPorNroHistoria?area=Farmacia",
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

    async PacientesXdni(NroDocumento) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('NroDocumento', NroDocumento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/PacientesXdni?area=Farmacia",
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

    async EmpleadosLaboraLugarSeleccionar(idEmpleado) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('idEmpleado', idEmpleado);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EmpleadosLaboraLugarSeleccionar?area=Seguridad",
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

        if ($("#txtHoraInicioBusq").val() == '') {
            alerta2('info', '', 'Por favor ingrese una Hora Incio válida.');
            return false;
        }

        if (esFormatoFecha($("#txtFechaFinalBusq").val()) == false) {
            alerta2('info', '', 'Por favor ingrese una Fecha Final válida.');
            return false;
        }

        if ($("#txtHoraFinalBusq").val() == '') {
            alerta2('info', '', 'Por favor ingrese una Hora Final válida.');
            return false;
        }
    },

    LimpiarCamposBusqueda() {
        $('.search').val('');
        $('.chzn-select').chosen().trigger("chosen:updated");
        IntervencionSanitaria.IniciarFechasBusqueda();
    },

    async LimpiarFormularioVariables() {
        IntervencionSanitaria.MovNumero = ''
        IntervencionSanitaria.DocumentoNumero = ''
        IntervencionSanitaria.IdEstadoMovimiento = 0
        //IntervencionSanitaria.Guardando = 0


        IntervencionSanitaria.esUnidosisLaFarmacia = 0
        IntervencionSanitaria.idMedicoPrescribe = 0
        IntervencionSanitaria.fechaPrescripcion = 0
        IntervencionSanitaria.horaPrescripcion = 0
        IntervencionSanitaria.idRecetaProcesada = 0
        

        IntervencionSanitaria.oDoCajaNroDocumento = {
            IdCaja: 0,
            IdTipoComprobante: 0
        }

        IntervencionSanitaria.oDoMovimiento = {
            FechaCreacion: '',
            MovNumero: 0,
            DocumentoNumero: '',
            DocumentoIdTipo: 0,
            IdAlmacenDestino: 0, // Almacen -- 0 -> Ninguno
            IdAlmacenOrigen: 0,
            IdEstadoMovimiento: 1,
            IdTipoConcepto: 0,
            MovTipo: 'S',
            Observaciones: '',
            Total: 0
        }

        IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria = {
            idCuentaAtencion: null,
            idDiagnostico: 0,
            IdPaciente: 0,
            idPrescriptor: 0,
            IdTipoFinanciamiento: 0,
            idTipoReceta: 0,
            IdUsuarioAuditoria: 0,
            MovTipo: 'S',
            tipoVenta: 'D',
            idFuenteFinanciamiento: '',
            FechaHoraPrescribe: '',
            IdPaquete: 0,
            idPreVenta: 0,
            movNumero: '',
            idServicioPaciente: 0,
            FechaCreacion: ''
        }

        IntervencionSanitaria.oDoPreventa = {
            idAlmacen: 0,
            idPreventa: null,
            idVendedor: 0,
            idPaciente: null,
            idTipoFinanciamiento: 0,
            total: 0,
            idDiagnostico: 0,
            idTipoReceta: 0,
            idcuentaAtencion: null,
            idPrescriptor: 0,
            fechaCreacion: 0,
            horaCreacion: 0,
            idUsuario: 0,
            fechaModificacion: 0,
            idUsuarioModifica: 0,
            idEstadoPreventa: 1,
            fechaHoraPrescribe: 0,
            idUsuarioAuditoria: 0,
        }

        $('#txtNroDocumentoVenta').val('')
        $('#txtNroPreventa').val('')
        $('#txtFechaRegistro').val('')
        $('#txtHoraRegistro').val('')
        $('#txtEstadoVenta').val('')
        $('#cboPrescriptor').val(0)
        $('#cboFarmaciaVenta').val(0);

        $('#cboTipoReceta').val(0)
        $('#txtNroCuenta').val('')
        $('#txtDatosDeCuenta').val(``)
        $('#txtFechaPrescripcion').val('')
        $('#txtHoraPrescripcion').val('')
        $('#txtNroHistoria').val('')
        $('#txtNombrePaciente').val('')
        $('#cboServicioRegistro').val(0)
        $('#cboTipoFinanciamiento').val(0)
        $('#txtDescripcionPlan').val('')
        $('#txtNroReceta').val('')
        $('#txtNroDocumentoPaciente').val('')

        $("#TotalDetalleVentas").html("");

        $('#chkConsumoHistorico').prop('checked', false)
        $("#ContentConsumoHistorico").hide();
        $('#chkIafaNoCubre').prop('checked', false)

        ObjtableDiagnosticos.fnClearTable();

        oTable_DetalleIntervencionSanitaria.fnClearTable()
        oTable_ConsumoHistorico.fnClearTable()

        let lugarTrabaja = await IntervencionSanitaria.EmpleadosLaboraLugarSeleccionar($('#hdIdUsuario').val())

        if (!isEmpty(lugarTrabaja)) {
            lugarTrabaja = lugarTrabaja.filter(obj => obj.idLaboraArea == 1 && obj.idLaboraSubArea != 2 && obj.idLaboraSubArea != 11)
            if (lugarTrabaja.length > 0) {
                $('#cboFarmaciaVenta').val(lugarTrabaja[0].idLaboraSubArea)
                $('#cboFarmaciaVenta').attr("disabled", true);
            }
        }

        if (lugarTrabaja.length > 0) {
            $('#cboFarmaciaVenta').val(lugarTrabaja[0].idLaboraSubArea)
            $('#cboFarmaciaVenta').attr("disabled", true);
        }
        await IntervencionSanitaria.FarmaciaDestinoNI_Change();


        IntervencionSanitaria.farmMovimientoProgramas = {
            movNumero: 0,
            movTipo: '',
            idCoordinador: 0,
            idPrescriptor: 0,
            idDiagnostico: 0,
            idPaciente: 0,
            idComponente: 0,
            idSubComponente: 0,
            FechaHoraPrescribe: '',
            idCuentaAtencion: 0,
            observaciones: '',
            nroFormato: ''
        }

        $('#cboCoordinadorIntSanit').val("21674");      //POR DEFECTO A PETICION DEL ING VLADIMIR Y AREA USUARIA
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#cboComponenteIntSanit').val("");
        $('#cboSubComponenteIntSanit').val("");
        $('#cboDiagnosticoIntSanit').val("");
        $('#txtObservacionesIntSanit').val("");
        $('.chzn-select').chosen().trigger("chosen:updated");
        IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria('');
        //for (objLugarTrabaja of lugarTrabaja) {

        //}


        console.log('lugarTrabaja', lugarTrabaja)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async BuscarNumeroReceta(idReceta) {
        if (isEmpty(idReceta)) {
            return false
        }

        if (IntervencionSanitaria.RecetaBusqueda == 1) {
            IntervencionSanitaria.RecetaBusqueda = 0

        }

        IntervencionSanitaria.RecetaBusqueda = 1

        Cargando(1)

        let cabceraDetalle = await IntervencionSanitaria.RecetaCabeceraDetalleSeleccionaPorNroReceta(idReceta)
        //console.log(cabceraDetalle);
        if (isEmpty(cabceraDetalle)) {
            swal({
                title: 'Agregar Ventas',
                html: `El número de receta no existe`,
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            })
            Cargando(0)
            return false
        }

        if (cabceraDetalle.length > 0) {

            //--------------------VALIDA ANTIMICRIBOANO----------------------------
            if (cabceraDetalle[0].esRecetaAntimicrobiano == 1) {
                if (cabceraDetalle[0].idSolicitudAntimicrobiano > 0) {
                    //if (cabceraDetalle[0].autorizaAntimicrobiano != 9) {
                    //    if (cabceraDetalle[0].autorizaAntimicrobiano == 0) {
                    //        alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La solicitud de la receta ha sido RECHAZADA.<br>No es posible despachar.");
                    //        Cargando(0)
                    //        return;
                    //    }
                    //} else {
                    //    alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La solicitud de la receta aun se encuentra PENDIENTE de aprobación o rechazo.<br>No es posible despachar.");
                    //    Cargando(0)
                    //    return;
                    //}
                    alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.");
                    Cargando(0)
                } else {
                    alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta aun no cuenta con una SOLICITUD para aprobacion de antimicrobianos.<br>No es posible despachar.");
                    Cargando(0)
                    return;
                }
            }
            //---------------------------------------------------------------------------

            await IntervencionSanitaria.CargarDatosVentas(cabceraDetalle[0].idCuentaAtencion)
        } else {
            swal({
                title: 'Agregar Ventas',
                html: `El Numero de Receta no existe`,
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            })
            Cargando(0)
            return false
        }
    },

    async BuscarNumeroCuenta(idCuentaAtencion) {

        try {

            ObjtableDiagnosticos.fnClearTable();

            $('#txtDatosDeCuenta').val("")
            $('#cboPrescriptor').val("")
            $('#txtNroHistoria').val("")
            $('#txtNroDocumentoPaciente').val("")
            $('#txtNombrePaciente').val("")
            $('#cboServicioRegistro').val("")
            $('#cboTipoFinanciamiento').val("")
            $('#txtDescripcionPlan').val("")
            $('.chzn-select').chosen().trigger("chosen:updated");
            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdPaciente = 0;
            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento = 0;
            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento = 0;
            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idServicioPaciente = 0;

            let datosGenerales = await IntervencionSanitaria.AtencionesSelecionarPorCuenta(idCuentaAtencion)

            let tipoServ = datosGenerales.idTipoServicio == 1 ? "CExt" : datosGenerales.idTipoServicio == 3 ? "Hosp" : "Emer"

            let filtro = ` (${datosGenerales.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            await IntervencionSanitaria.DevuelveServiciosDelHospitalFiltro(filtro)

            await IntervencionSanitaria.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(datosGenerales.idAtencion)

            let lbGeneraPago = await IntervencionSanitaria.TiposFinanciamientoGeneraReciboPago(datosGenerales.idFormaPago)

            if (lbGeneraPago == 1) {
                swal({
                    title: 'Atenciones',
                    text: `El N° de Cuenta es de ${datosGenerales.dTipoServicio} de un Paciente PAGANTE\n ¿Esta seguro de desapachar Medicamentos?`,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true
                })
                    .then(async (res) => {
                        if (res) {
                            let fuenteFinanciamiento = await IntervencionSanitaria.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                            //this.oDoMovimiento.IdTipoConcepto = fuenteFinanciamiento.idTipoConceptoFarmacia     //COMENTADO - ES PARA VENTAS
                            this.oDoMovimiento.IdTipoConcepto = 16          //PARA INTERVENCIONES SANITARIAS


                            $('#txtNroCuenta').val(idCuentaAtencion)
                            $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`)
                            $('#cboPrescriptor').val(IntervencionSanitaria.idMedicoPrescribe)

                            $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                            $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                            $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                            $('#cboServicioRegistro').val(datosGenerales.idServicioActual)
                            $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                            $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)
                            $("#txtFechaPrescripcion").datepicker("setDate", IntervencionSanitaria.fechaPrescripcion);
                            $('#txtHoraPrescripcion').val(IntervencionSanitaria.horaPrescripcion)

                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdPaciente = datosGenerales.idPaciente
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento = datosGenerales.idFormaPago
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idServicioPaciente = datosGenerales.idServicioActual

                            $('#cboTipoReceta').val(1)

                            IntervencionSanitaria.oDoPreventa = {
                                idAlmacen: $('#cboFarmaciaVenta').val(),
                                idVendedor: 0,
                                idPaciente: datosGenerales.idPaciente,
                                idTipoFinanciamiento: datosGenerales.idFormaPago,
                                idPreventa: null,
                                total: 0,
                                idDiagnostico: 0,
                                idTipoReceta: $('#cboTipoReceta').val(),
                                idcuentaAtencion: idCuentaAtencion,
                                idPrescriptor: $('#cboPrescriptor').val(),
                                fechaCreacion: 0,
                                horaCreacion: 0,
                                idUsuario: 0,
                                fechaModificacion: 0,
                                idUsuarioModifica: 0,
                                idEstadoPreventa: 1,
                                fechaHoraPrescribe: IntervencionSanitaria.fechaPrescripcion + ' ' + IntervencionSanitaria.horaPrescripcion,
                                idUsuarioAuditoria: 0,
                            }


                            $('.chzn-select').chosen().trigger("chosen:updated");
                        }
                    })
            } else {
                let fuenteFinanciamiento = await IntervencionSanitaria.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                //this.oDoMovimiento.IdTipoConcepto = fuenteFinanciamiento.idTipoConceptoFarmacia         //COMENTADO - ES PARA VENTAS
                this.oDoMovimiento.IdTipoConcepto = 16          //PARA INTERVENCIONES SANITARIAS

                $('#txtNroCuenta').val(idCuentaAtencion)
                $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`)
                $('#cboPrescriptor').val(IntervencionSanitaria.idMedicoPrescribe)

                $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                $('#cboServicioRegistro').val(datosGenerales.idServicioActual)
                $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)

                if (IntervencionSanitaria.fechaPrescripcion != 0) {
                    $("#txtFechaPrescripcion").datepicker("setDate", IntervencionSanitaria.fechaPrescripcion);
                }

                if (IntervencionSanitaria.horaPrescripcion != 0) {
                    $('#txtHoraPrescripcion').val(IntervencionSanitaria.horaPrescripcion)
                }


                $('#cboTipoReceta').val(1)

                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdPaciente = datosGenerales.idPaciente
                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento = datosGenerales.idFormaPago

                $('.chzn-select').chosen().trigger("chosen:updated");
            }

        } catch (e) {
            alerta(2, 'Algo salio mal')
            console.log(e)

            Cargando(0)
        }
    },

    async BuscarNumeroHistoria() {

    },

    async BuscarNumeroDocumento() {

    },

    async CargarDatosVentas(idCuentaAtencion) {

        try {
            ObjtableDiagnosticos.fnClearTable();

            // modificando
            let datosGenerales = await IntervencionSanitaria.AtencionesSelecionarPorCuenta(idCuentaAtencion)

            let tipoServ = datosGenerales.idTipoServicio == 1 ? "CExt" : datosGenerales.idTipoServicio == 3 ? "Hosp" : "Emer"

            let mensaje = ``

            let filtro = ` (${datosGenerales.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            await IntervencionSanitaria.DevuelveServiciosDelHospitalFiltro(filtro)

            await IntervencionSanitaria.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(datosGenerales.idAtencion)

            let lbGeneraPago = await IntervencionSanitaria.TiposFinanciamientoGeneraReciboPago(datosGenerales.idFormaPago)


            let cabceraDetalle = await IntervencionSanitaria.RecetaCabeceraDetalleSeleccionaPorNroReceta($('#txtNroReceta').val())

            if (cabceraDetalle.length <= 0) {
                swal({
                    title: 'Receta',
                    html: "El número de receta no existe",
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })

                Cargando(0)
                return false
            }

            // Valida el estado de la receta
            if (cabceraDetalle[0].idEstado == 0) { // Anulada
                swal({
                    title: 'Receta',
                    html: "La receta está ANULADA  <br> N° Cuenta: " + cabceraDetalle[0].idCuentaAtencion,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })
                Cargando(0)
                return false
            }


            if (cabceraDetalle[0].idEstado == 2) { // Despachada

                if ((isEmpty(cabceraDetalle[0].idComprobantePago) || cabceraDetalle[0].idComprobantePago == 0) && !isEmpty(cabceraDetalle[0].documentoDespacho)) {
                    mensaje = `La receta fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion}`
                } else {

                    let relacionOrdenPago = await IntervencionSanitaria.FarmRecetaRelacionOrdenPagoBuscar($('#txtNroReceta').val()) // verificar para pagantes

                    if (relacionOrdenPago.nroOrdenPago != 0) {
                        if (isEmpty(relacionOrdenPago.nroSerie) && isEmpty(relacionOrdenPago.nroDocumento)) {
                            mensaje = `Esta Receta tiene una PREVENTA pendiente por pagar <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion}. <br> Tiene que ir a CAJA a cancelar el N°: ${relacionOrdenPago.nroOrdenPago}F `
                        } else {
                            mensaje = `Esta Receta tiene BOLETA y fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion} <br> Boleta: ${relacionOrdenPago.nroSerie}-${relacionOrdenPago.nroDocumento}`
                        }
                    } else {
                        mensaje = `Esta Receta fue ATENDIDA y fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion} <br> N° Movimiento: ${relacionOrdenPago.documento}`
                    }

                }


                if (mensaje != '') {
                    swal({
                        title: 'Receta',
                        html: mensaje,
                        type: 'info',
                        allowOutsideClick: false,
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#6c6c6c',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                    })
                    Cargando(0)
                    return false
                }

            }

            if (lbGeneraPago == 1) {
                swal({
                    title: 'Atenciones',
                    text: `El N° de Cuenta es de ${datosGenerales.dTipoServicio} de un Paciente PAGANTE\n ¿Esta seguro de desapachar Medicamentos?`,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true
                })
                    .then(async (res) => {
                        if (res) {
                            let fuenteFinanciamiento = await IntervencionSanitaria.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                            //this.oDoMovimiento.IdTipoConcepto = fuenteFinanciamiento.idTipoConceptoFarmacia     //COMENTADO - ES PARA VENTAS
                            this.oDoMovimiento.IdTipoConcepto = 16;         //ES PARA INTERVENCIONES SANITRIAS

                            await this.CargarDatosReceta()

                            $('#txtNroCuenta').val(idCuentaAtencion)
                            $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioIngreso})`)
                            $('#cboPrescriptor').val(IntervencionSanitaria.idMedicoPrescribe)

                            $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                            $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                            $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                            $('#cboServicioRegistro').val(datosGenerales.idServicioIngreso)
                            $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                            $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)
                            $("#txtFechaPrescripcion").datepicker("setDate", IntervencionSanitaria.fechaPrescripcion);
                            $('#txtHoraPrescripcion').val(IntervencionSanitaria.horaPrescripcion)
                            $('#cboTipoReceta').val(1)

                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdPaciente = datosGenerales.idPaciente
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento = datosGenerales.idFormaPago
                            IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idServicioPaciente = datosGenerales.idServicioIngreso

                            IntervencionSanitaria.oDoPreventa = {
                                idAlmacen: $('#cboFarmaciaVenta').val(),
                                idVendedor: 0,
                                idPaciente: datosGenerales.idPaciente,
                                idTipoFinanciamiento: datosGenerales.idFormaPago,
                                idPreventa: null,
                                total: 0,
                                idDiagnostico: 0,
                                idTipoReceta: $('#cboTipoReceta').val(),
                                idcuentaAtencion: idCuentaAtencion,
                                idPrescriptor: $('#cboPrescriptor').val(),
                                fechaCreacion: 0,
                                horaCreacion: 0,
                                idUsuario: 0,
                                fechaModificacion: 0,
                                idUsuarioModifica: 0,
                                idEstadoPreventa: 1,
                                fechaHoraPrescribe: IntervencionSanitaria.fechaPrescripcion + ' ' + IntervencionSanitaria.horaPrescripcion,
                                idUsuarioAuditoria: 0,
                            },


                                $('.chzn-select').chosen().trigger("chosen:updated");
                        }
                    })
            } else {
                let fuenteFinanciamiento = await IntervencionSanitaria.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                //this.oDoMovimiento.IdTipoConcepto = fuenteFinanciamiento.idTipoConceptoFarmacia         //COMENTADO - ES PARA VENTAS
                this.oDoMovimiento.IdTipoConcepto = 16          //ES PARA INTERVENCIONES SANITARIAS

                await this.CargarDatosReceta()

                $('#txtNroCuenta').val(idCuentaAtencion)
                $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioIngreso})`)
                $('#cboPrescriptor').val(IntervencionSanitaria.idMedicoPrescribe)
                $('#cboPrescriptor').val(cabceraDetalle[0].idEmpleadoReceta)

                $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                $('#cboServicioRegistro').val(datosGenerales.idServicioIngreso)
                $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)
                $("#txtFechaPrescripcion").datepicker("setDate", IntervencionSanitaria.fechaPrescripcion);
                $('#txtHoraPrescripcion').val(IntervencionSanitaria.horaPrescripcion)

                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdPaciente = datosGenerales.idPaciente
                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                IntervencionSanitaria.oDoFarmMovimientoIntervencionSanitaria.IdTipoFinanciamiento = datosGenerales.idFormaPago

                $('.chzn-select').chosen().trigger("chosen:updated");
            }

            Cargando(0)

        } catch (e) {
            alerta(2, 'Algo salio mal')
            console.log('Error al extraer datos de la receta', e)
            Cargando(0)
        }





    },

    async CargarDatosReceta() {
        let cabceraDetalle = await IntervencionSanitaria.RecetaCabeceraDetalleSeleccionaPorNroReceta($('#txtNroReceta').val())

        if (cabceraDetalle.length > 0) {

            // Valida el estado de la receta
            if (cabceraDetalle[0].idEstado == 0) { // Anulada
                swal({
                    title: 'Receta',
                    html: "La receta está ANULADA  <br> N° Cuenta: " + cabceraDetalle[0].idCuentaAtencion,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })
                return false
            }

            if (cabceraDetalle[0].idEstado == 2) { // Despachada

                let mensaje = ``

                if ((isEmpty(cabceraDetalle[0].idComprobantePago) || cabceraDetalle[0].idComprobantePago == 0) && !isEmpty(cabceraDetalle[0].documentoDespacho)) {
                    mensaje = `La receta fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion}`
                } else {

                    let relacionOrdenPago = await IntervencionSanitaria.FarmRecetaRelacionOrdenPagoBuscar($('#txtNroReceta').val()) // verificar para pagantes

                    if (relacionOrdenPago.nroOrdenPago != 0) {
                        if (isEmpty(relacionOrdenPago.nroSerie) && isEmpty(relacionOrdenPago.nroDocumento)) {
                            mensaje = `Esta Receta tiene una PREVENTA pendiente por pagar <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion}. <br> Tiene que ir a CAJA a cancelar el N°: ${relacionOrdenPago.nroOrdenPago}F `
                        } else {
                            mensaje = `Esta Receta tiene BOLETA y fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion} <br> Boleta: ${relacionOrdenPago.nroSerie}-${relacionOrdenPago.nroDocumento}`
                        }
                    } else {
                        mensaje = `Esta Receta fue ATENDIDA y fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion} <br> N° Movimiento: ${relacionOrdenPago.documento}`
                    }

                }


                if (mensaje != '') {
                    swal({
                        title: 'Receta',
                        html: mensaje,
                        type: 'info',
                        allowOutsideClick: false,
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#6c6c6c',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                    })

                    return false
                }

            }

            // END Valida el estado de la receta

            IntervencionSanitaria.idMedicoPrescribe = cabceraDetalle[0].idMedicoReceta
            IntervencionSanitaria.fechaPrescripcion = cabceraDetalle[0].fechaPrescripcion
            IntervencionSanitaria.horaPrescripcion = cabceraDetalle[0].horaPrescripcion
            IntervencionSanitaria.idRecetaProcesada = $('#txtNroReceta').val()

            $('#cboCoordinadorIntSanit').val(cabceraDetalle[0].idCoordinadorIS);
            $('#cboComponenteIntSanit').val(cabceraDetalle[0].idComponenteIS);
            $('#cboComponenteIntSanit').change();
            $('#cboSubComponenteIntSanit').val(cabceraDetalle[0].idSubComponenteIS);
            await IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria(isNull(cabceraDetalle[0].codigoDx, ""));
            $('#cboDiagnosticoIntSanit').val(cabceraDetalle[0].idDiagnosticoIS);
            $('#txtObservacionesIntSanit').val(cabceraDetalle[0].observacionesIS);

            IntervencionSanitaria.oDoPreventa.fechaHoraPrescribe = IntervencionSanitaria.fechaPrescripcion + ' ' + IntervencionSanitaria.horaPrescripcion

            let lbGeneraPago = await IntervencionSanitaria.TiposFinanciamientoGeneraReciboPago(cabceraDetalle[0].idFormaPago)

            if (lbGeneraPago == 1) {
                $('input[name="rdbTipoVenta"][value="2"]').prop('checked', 1) // Preventa
                $('input[name="rdbTipoVenta"][value="2"]').click()
                $('#cboTipoReceta').val(1)
            } else {
                $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1) // Venta
                $('input[name="rdbTipoVenta"][value="1"]').click()
            }

            let totalDetalle = 0
            oTable_DetalleIntervencionSanitaria.fnClearTable()

            for (let objCabceraDetalle of cabceraDetalle) {
                // modificando
                let saldoAlmacen = await IntervencionSanitaria.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciaVenta').val(), objCabceraDetalle.idItem, 2)

                if (!isEmpty(saldoAlmacen)) {
                    let items = {
                        idItem: objCabceraDetalle.idItem,
                        codigo: objCabceraDetalle.codigo,
                        producto: objCabceraDetalle.nombre,
                        saldo: saldoAlmacen.cantidad,
                        cantidadPedida: objCabceraDetalle.cantidadPedida,
                        prVenta: objCabceraDetalle.precio,
                        total: IntervencionSanitaria.customRoundToTwoDecimals((parseFloat(objCabceraDetalle.cantidadPedida) * parseFloat(objCabceraDetalle.precio.toFixed(3))).toFixed(2)),

                        tipo: saldoAlmacen.idTipoSalidaBienInsumo == 1 ? 'Venta' : 'IntervensionSanitaria',
                        lote: 1,
                        fechaVencimiento: 1,
                        idTipoSalidaBienInsumoSaldo: saldoAlmacen.idTipoSalidaBienInsumo,
                        fechaVencimientoFormat: 1,
                        tipoPsicotropico: objCabceraDetalle.tipoPsicotropico,
                    }

                    if (IntervencionSanitaria.ExisteProducto(objCabceraDetalle.idProducto)) {
                        alerta(2, 'El producto ya fue agregado')
                        return false
                    }

                    totalDetalle = totalDetalle + parseFloat(items.total)

                    oTable_DetalleIntervencionSanitaria.fnAddData(items)
                }

            }

            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));


        }
    },

    customRoundToTwoDecimals: function (number) {

        return number
        // // Multiplicamos por 100 para trabajar con la parte decimal como un número entero
        // var multipliedNumber = number * 100;

        // // Obtenemos la parte decimal
        // var decimalPart = multipliedNumber % 10; // Nos interesa solo el segundo decimal

        // // Si la parte decimal del segundo decimal es <= 5, redondea hacia abajo
        // if (decimalPart <= 5) {
        // return Math.floor(multipliedNumber / 10) / 10;
        // } else {
        // // Si la parte decimal del segundo decimal es > 5, redondea hacia arriba
        // return Math.ceil(multipliedNumber / 10) / 10;
        // }
    },

    async CargarDatosVentaDirecta(movNumero, idEstado) {
        $('#contProductosBusqueda').hide()
        $('#btnGuardarVentas').show()

        if (IntervencionSanitaria.TipoAccion != 'A') {

            $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1) // Preventa
            //$('input[name="rdbTipoVenta"][value="1"]').click()

            await IntervencionSanitaria.TipoVenta_Change(1);


            let farmMovimiento = await IntervencionSanitaria.FarmMovimientoSeleccionar(movNumero, 'S')
            //let farmMovimientoIntervencionSanitaria = await IntervencionSanitaria.FarmMovimientoVentasSeleccionarPorId(movNumero, 'S')
            let farmMovimientoIntervencionSanitaria = await IntervencionSanitaria.FarmMovimientoProgramasSeleccionar(movNumero);

            let atencionCuenta = await IntervencionSanitaria.AtencionesSelecionarPorCuenta(farmMovimientoIntervencionSanitaria.idCuentaAtencion)

            let farmMovimientoDetalle = await IntervencionSanitaria.FarmMovimientoDetalleSeleccionar(movNumero, 'S')

            let tipoServ = atencionCuenta.idTipoServicio == 1 ? "CExt" : atencionCuenta.idTipoServicio == 3 ? "Hosp" : "Emer"

            let filtro = ` (${atencionCuenta.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            await IntervencionSanitaria.DevuelveServiciosDelHospitalFiltro(filtro)

            ObjtableDiagnosticos.fnClearTable();
            await IntervencionSanitaria.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(atencionCuenta.idAtencion)

            IntervencionSanitaria.MovNumero = farmMovimiento.movNumero
            IntervencionSanitaria.IdEstadoMovimiento = idEstado

            $('#txtNroDocumentoVenta').val(farmMovimiento.documentoNumero)
            $('#txtNroPreventa').val(farmMovimientoIntervencionSanitaria.idPreVenta)
            $('#txtFechaRegistro').val(farmMovimiento.fechaCreacionFormat)
            $('#txtHoraRegistro').val(farmMovimiento.horaCreacionFormat)
            $('#txtEstadoVenta').val(farmMovimiento.estadoMovimiento)
            $('#cboPrescriptor').val(parseInt(farmMovimientoIntervencionSanitaria.idPrescriptor))
            $('#cboFarmaciaVenta').val(farmMovimiento.idAlmacenOrigen)
            $('#cboTipoReceta').val(farmMovimientoIntervencionSanitaria.idTipoReceta)
            $('#txtNroReceta').val(farmMovimientoIntervencionSanitaria.idReceta)
            $('#txtNroCuenta').val(farmMovimientoIntervencionSanitaria.idCuentaAtencion)
            $('#txtDatosDeCuenta').val(`F.Ing: ${atencionCuenta.fechaIngresoFormat} (${tipoServ}) (Est: ${atencionCuenta.estadoCta}) (${atencionCuenta.dServicioIngreso})`)
            $('#txtFechaPrescripcion').val(farmMovimientoIntervencionSanitaria.fechaPrescribeFormat)
            $('#txtHoraPrescripcion').val(farmMovimientoIntervencionSanitaria.horaPrescribeFormat)
            $('#txtNroHistoria').val(atencionCuenta.nroHistoriaClinica)
            $('#txtNroDocumentoPaciente').val(atencionCuenta.nroDocumento)
            $('#txtNombrePaciente').val(atencionCuenta.nombresPaciente)
            $('#cboServicioRegistro').val(farmMovimientoIntervencionSanitaria.idServicioPaciente)
            $('#cboTipoFinanciamiento').val(atencionCuenta.idFormaPago)
            $('#txtDescripcionPlan').val('IAFA Act.: ' + atencionCuenta.dFuenteFinanciamiento)


            let intervSanit = await IntervencionSanitaria.FarmMovimientoProgramasSeleccionar(farmMovimientoIntervencionSanitaria.movNumero);
            if (!isEmpty(intervSanit)) {
                $('#cboCoordinadorIntSanit').val(intervSanit.idCoordinador);
                $('#cboComponenteIntSanit').val(intervSanit.idComponente);
                $('#cboComponenteIntSanit').change();
                $('#cboSubComponenteIntSanit').val(intervSanit.idSubComponente);
                await IntervencionSanitaria.ListaDiagnosticosIntervencionSanitaria(intervSanit.codigoDx);
                $('#cboDiagnosticoIntSanit').val(intervSanit.idDiagnostico);
                $('#txtObservacionesIntSanit').val(intervSanit.observaciones);
                $('#txtNroFormatoIntSanit').val(intervSanit.nroFormato);
            }

            $('#txtNroReceta').attr("disabled", true);
            $('#txtNroCuenta').attr("disabled", true);

            $('#btnBuscarDatosPacienteNroReceta').attr("disabled", true);
            $('#btnModalBusquedaPacientes').attr("disabled", true);

            $('.chzn-select').chosen().trigger("chosen:updated");




            oTable_DetalleIntervencionSanitaria.fnClearTable()


            let movimientoDetallado = []


            for (let objCabceraDetalle of farmMovimientoDetalle) {

                let saldoAlmacen = await IntervencionSanitaria.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciasBusq').val(), objCabceraDetalle.idProducto, 2)

                let items = {
                    idItem: objCabceraDetalle.idProducto,
                    codigo: objCabceraDetalle.codigo,
                    producto: objCabceraDetalle.nombre,
                    saldo: saldoAlmacen.cantidad,
                    cantidadPedida: objCabceraDetalle.cantidad,
                    prVenta: objCabceraDetalle.precioUnitario,
                    total: parseFloat(objCabceraDetalle.total.toFixed(1)),
                    tipo: saldoAlmacen.idTipoSalidaBienInsumo == 1 ? 'Venta' : 'IntervensionSanitaria',
                    lote: 1,
                    fechaVencimiento: 1,
                    idTipoSalidaBienInsumoSaldo: saldoAlmacen.idTipoSalidaBienInsumo,
                    fechaVencimientoFormat: 1,
                    tipoPsicotropico: objCabceraDetalle.tipoPsicotropico,
                }

                
                movimientoDetallado.push(items)
            }

            let movimientoDetalladoAcumulado = combineProductsDetalleVenta(movimientoDetallado)

            if (movimientoDetalladoAcumulado.length > 0) {
                oTable_DetalleIntervencionSanitaria.fnAddData(movimientoDetalladoAcumulado);

                oTable_DetalleIntervencionSanitaria.$('tr').each(function () {
                    let data = oTable_DetalleIntervencionSanitaria.fnGetData(this);

                    data.saldo += data.cantidadPedida

                    //data.total += objCabceraDetalle.total;
                    data.prVenta = (data.total / data.cantidadPedida).toFixed(3); // Recalcula el precio unitario promedio

                    inputCantidad = '  <input id="txtCant_idItem_' + data.idItem + '" value="' + data.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'

                    data.cantidadPedida = inputCantidad

                    // Actualizar la fila en la tabla
                    oTable_DetalleIntervencionSanitaria.fnUpdate(data, this);

                    existe = true;
                });
            }

            let detalleVentas = oTable_DetalleIntervencionSanitaria.api().data().toArray()
            let totalDetalle = 0
            for (let obj of detalleVentas) {
                totalDetalle = totalDetalle + parseFloat(obj.total)
            }
            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));


            $('#btnGuardarVentas').removeClass('btn btn-primary');
            $('#btnGuardarVentas').removeClass('btn btn-danger');

            if (IntervencionSanitaria.TipoAccion == 'E') {
                $('#btnGuardarVentas').text('Eliminar')
                $('#btnGuardarVentas').addClass('btn btn-danger')
            }

            if (IntervencionSanitaria.TipoAccion == 'M') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }

            if (IntervencionSanitaria.TipoAccion == 'C') {
                $('#btnGuardarVentas').hide()
            }
        } else {
            if (IntervencionSanitaria.TipoAccion == 'A') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }
        }
    },

    

    QuitarProducto() {
        oTable_DetalleIntervencionSanitaria.api(true).row('.selected').remove().draw(false);
        oTable_DetalleIntervencionSanitaria.resize();

        let detalleVentas = oTable_DetalleIntervencionSanitaria.api().data().toArray()
        let totalDetalle = 0
        for (let obj of detalleVentas) {
            totalDetalle = totalDetalle + parseFloat(obj.total)
        }
        $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));
    },

    ListarDiagnosticosPorAtencionPorNumeroEvaluacion: async (idAtencion) => {

        //Diagnosticos.LimpiarDiagnosticosAtencion();
        ObjtableDiagnosticos.fnClearTable();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('evaluacion', 0);

        await $.ajax({

            method: "POST",
            url: "/Diagnosticos/ListarDiagnosticosPorAtencionPorNumeroEvaluacion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


                Cargando(0)
                if (datos.table.length > 0) {
                    ObjtableDiagnosticos.fnAddData(datos.table);
                    ObjtableDiagnosticos.resize();
                }
                else {
                    Cargando(0)
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })

    },


    async ListaCoordinadores() {

        $.ajax({
            url: "/IntervencionSanitaria/ListaCoordinadores?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboCoordinadorIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCoordinadorIntSanit').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
                $('#cboCoordinadorIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaComponentes() {

        $.ajax({
            url: "/IntervencionSanitaria/ListaComponentes?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboComponenteIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboComponenteIntSanit').append('<option  value="' + obj.idComponente + '">' + obj.descripcion + '</option>');
                });
                $('#cboComponenteIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaSubComponentes(idComponente) {
        let midata = new FormData();
        midata.append('idComponente', idComponente);

        Cargando(1);
        $.ajax({
            url: "/IntervencionSanitaria/ListaSubComponentes?area=Farmacia",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                $('#cboSubComponenteIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboSubComponenteIntSanit').append('<option data-cie10="' + obj.diagnostico + '" value="' + obj.idSubComponente + '">' + obj.descripcion + '</option>');
                });
                $('#cboSubComponenteIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0);
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaDiagnosticosIntervencionSanitaria(filtro) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#cboDiagnosticoIntSanit').empty();
        $('#cboDiagnosticoIntSanit').append('<option  value="0">Busque y seleccione un diagnóstico</option>');
        $('#cboDiagnosticoIntSanit').val("0");
        $('.chzn-select').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/IntervencionSanitaria/ListaDiagnosticosIntervencionSanitaria?area=Farmacia",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticoIntSanit').append('<option data-cie10="' + obj.codigoCIE10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#cboDiagnosticoIntSanit').val("0");
                $('.chzn-select').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input').val(filtro);
    },

}

const combineProducts = (products) => {
    const combined = {};

    products.forEach((product) => {
        const key = product.codigo.toString() + product.idTipoSalidaBienInsumoSaldo.toString();

        if (!combined[key]) {
            combined[key] = { ...product };
        } else {
            combined[key].saldo += product.saldo; // Sumar saldo
            combined[key].precioUnitario = Math.min(combined[key].precioUnitario, product.precioUnitario); // Precio unitario más bajo
            combined[key].precio = Math.min(combined[key].precio, product.precio); // Recalcular precio total
        }
    });

    return Object.values(combined).sort((a, b) => a.nombre.localeCompare(b.nombre));
};

const combineProductsDetalleVenta = (products) => {
    const combined = {};

    products.forEach((product) => {
        const key = product.codigo.toString() + product.idTipoSalidaBienInsumoSaldo.toString();

        if (!combined[key]) {
            combined[key] = { ...product };
        } else {
            //combined[key].saldo += product.cantidad; // Sumar saldo
            //combined[key].prVenta = Math.min(combined[key].prVenta, product.prVenta); // Precio unitario más bajo
            combined[key].total += parseFloat(combined[key].total) + parseFloat(product.total); // Recalcular precio total
            combined[key].cantidadPedida += product.cantidadPedida; // Recalcular precio total
        }
    });

    return Object.values(combined);
};

$(document).ready(function () {
    IntervencionSanitaria.Iniciar()
    BusqRecetasPacientes.Iniciar();
});