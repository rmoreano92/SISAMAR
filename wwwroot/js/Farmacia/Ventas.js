var Ventas = {
    MovNumero: '',
    DocumentoNumero: '',
    TipoAccion: 0,
    RecetaBusqueda: 0,
    IdPreventa: 0,

    IdEstadoMovimiento: 0,

    esUnidosisLaFarmacia: 0,
    idMedicoPrescribe: 0,
    fechaPrescripcion: 0,
    horaPrescripcion: 0,
    idRecetaProcesada: 0,

    ConsumoHistorico: [],

    Guardando: 0,

    oDoPreventa: {
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
        PresExternoCmp: '',
        PresExternoMedico: '',
        PresExternoFecha: '',
        NroFormato: ''
    },


    //////////////////////////////CONFIGURACIONES INICIALES///////////////////////////////////////////
    async Iniciar() {
        Ventas.Plugins();
        Ventas.DataTableBusqueda();
        Ventas.DataTableDetalleVentas();
        Ventas.DataTableProductosBuscados();
        Ventas.DataTableBusquedaPacientes();
        Ventas.DataTableAtencionesPacientes();
        Ventas.DataTableConsumoHistorico();
        Ventas.DataTableDiagnosticos();
        Ventas.initDatablesPaquetes();
        Ventas.Eventos();
        Ventas.LLenarCombos();
        Ventas.ValidarLugarDondeTrabaja();

        BusqRecetasPacientes.idPuntoCarga = 5;
        BusqRecetasPacientes.esIntervencionSanitaria = 0;
    },

    async ValidarLugarDondeTrabaja() {
        let lugarTrabaja = await Ventas.EmpleadosLaboraLugarSeleccionar($('#hdIdUsuario').val())

        if (!isEmpty(lugarTrabaja)) {
            lugarTrabaja = lugarTrabaja.filter(obj => obj.idLaboraArea == 1 && obj.idLaboraSubArea != 2 && obj.idLaboraSubArea != 11)
            if (lugarTrabaja.length > 0) {
                $('#cboFarmaciasBusq option').prop('disabled', true);
                for (const obj of lugarTrabaja) {
                    $('#cboFarmaciasBusq option[value="' + obj.idLaboraSubArea + '"]').removeAttr('disabled');
                    //console.log("ID Área:", obj.idLaboraArea);
                    //console.log("ID SubÁrea:", obj.idLaboraSubArea);
                }
                $('#cboFarmaciasBusq').val(lugarTrabaja[0].idLaboraSubArea)
                //$('#cboFarmaciasBusq').attr("disabled", true);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
        }
    },

    Plugins() {
        $('#txtFechaInicioBusq, #txtFechaFinalBusq, #txtFechaPrescripcion, #txtFechaRegistro, #txtFechaPrescripcionExterno').datepicker({
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
        $("#txtFechaInicioBusq, #txtFechaFinalBusq, #txtFechaPrescripcion, #txtFechaPrescripcionExterno").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraPrescripcion").mask("Hn:Nn");
        $("#txtHoraPrescripcionExt").mask("Hn:Nn");
        $("#txtHoraInicioBusq").mask("Hn:Nn");
        $("#txtHoraFinalBusq").mask("Hn:Nn");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimiento").mask("Hn:Nn");
        //$("#txtHoraClampaje").mask("Hn:Nn");

        Ventas.IniciarFechasBusqueda();

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
        //$("#txtFechaInicioBusq").datepicker("setDate", FechaPrimerDiaDelMes);
        $("#txtFechaInicioBusq").datepicker("setDate", FechaHoy);
        $("#txtFechaFinalBusq").datepicker("setDate", FechaHoy);
    },

    //////////////////////////////CONFIGURACION DATATABLES///////////////////////////////////////////
    initDatablesPaquetes() {
        let parms = {
            "scrollY": "300px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '10%',
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '50%',
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "importe",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //cambio vias 
                {
                    width: '0%',
                    visible: false,
                    data: "idViaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    visible: false,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblPaqueteDetalle'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.tblPaqueteDetalle select').select2(); // initialize select2 dropdown
        oTable_paquete = $("#tblPaqueteDetalle").dataTable(parms);
        $('#tblPaqueteDetalle_length').css('display', 'none')
    },
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": true,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            "order": [[2, "desc"]],
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
                    width: "5%",
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
                    width: "5%",
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
                    width: "10%",
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
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "total",
                    width: "5%",
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
        oTable_Ventas = $("#tblVentas").dataTable(parms);
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
                    width: '4%', // Ancho de la columna del índice
                    targets: 0,
                    //visible: false,
                    data: null, // El índice no proviene del conjunto de datos
                    render: function (data, type, row, meta) {
                        return parseInt(meta.row) + 1; // El índice comienza desde 1
                    },
                    //createdCell: function (td, cellData, rowData, row, col) {
                    //    $(td).attr('align', 'center');
                    //}
                },
                {
                    width: '0%',
                    targets: 1,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 3,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.tipoPsicotropico == "N" || rowData.tipoPsicotropico == "I") {
                            $(td).parent().css('color', '#ad2a00');
                            //$(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: '11%',
                    targets: 4,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 5,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
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
                    targets: 7,
                    data: "prVenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblDetalleVentas');
        oTable_DetalleVentas = $("#tblDetalleVentas").dataTable(parms);
        $('#tblDetalleVentas_length').css('display', 'none');
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
            //"order": [[2, "asc"]],
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
                    targets: 2,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 3,
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
                    targets: 5,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        //var tableWrapper = $('#tblProductosBuscados');
        oTable_ProductosBuscados = $("#tblProductosBuscados").dataTable(parms);
        //$('#tblProductosBuscados_length').css('display', 'none');
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
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }

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
        lstData = oTable_DetalleVentas.api(true).rows().data();

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
            await Ventas.ListarVentas();
        });

        $('#btnGenerarReporte').on('click', () => {
            if (Ventas.ValidarBusquedaNotasIngreso() == false) {
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

            let datosPaciente = await Ventas.PacientesSeleccionarPorNroHistoria($('#txtNroHistoria').val())

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

            let datosPaciente = await Ventas.PacientesXdni($('#txtNroDocumentoPaciente').val())

            if (!isEmpty(datosPaciente)) {
                console.log('datosPaciente', datosPaciente)

                $('#txtNombrePaciente').val(`${!datosPaciente.apellidoPaterno ? '' : datosPaciente.apellidoPaterno} ${!datosPaciente.apellidoMaterno ? '' : datosPaciente.apellidoMaterno} ${!datosPaciente.primerNombre ? '' : datosPaciente.primerNombre} ${!datosPaciente.segundoNombre ? '' : datosPaciente.segundoNombre}`)
            }

        });

        $('#btnMuestraPaquete').on('click', async function () {
            const resp = await Ventas.listaCabPaquetes();
            if (resp) {
                $('#modalPaquete').modal('show');
            }
        })        

        $('#chkConsumoHistorico').on('click', async function () {

            oTable_ConsumoHistorico.fnClearTable()

            if ($('#chkConsumoHistorico').is(':checked')) {
                $("#ContentConsumoHistorico").show();
                if ($('#txtNroCuenta').val() != '') {

                    let consumoHistorico = await Ventas.FarmMovimientoVentasDetalleSeleccionarPorCuenta($('#txtNroCuenta').val())

                    if (consumoHistorico.length > 0) {

                        oTable_ConsumoHistorico.fnAddData(consumoHistorico)

                        Ventas.ConsumoHistorico = oTable_ConsumoHistorico.api(true).data().toArray()
                    }
                    //console.log('consumoHistorico', consumoHistorico)
                }
            } else {
                oTable_ConsumoHistorico.fnClearTable()
                $("#ContentConsumoHistorico").hide();
            }



        });

        $('#chkIafaNoCubre').on('click', async function () { // VALIDAR PARA LOS CASOS DE IAFA NO CUBRE

            // $('#cboTipoFinanciamiento').val(1)
            // Ventas.oDoFarmMovimientoVentas.IdTipoFinanciamiento = 1
            //  $('.chzn-select').chosen().trigger("chosen:updated");

            oTable_ConsumoHistorico.fnClearTable()

            if ($('#chkConsumoHistorico').is(':checked')) {
                $("#ContentConsumoHistorico").show();
                if ($('#txtNroCuenta').val() != '') {

                    let consumoHistorico = await Ventas.FarmMovimientoVentasDetalleSeleccionarPorCuenta($('#txtNroCuenta').val())

                    if (consumoHistorico.length > 0) {

                        oTable_ConsumoHistorico.fnAddData(consumoHistorico)

                        Ventas.ConsumoHistorico = oTable_ConsumoHistorico.api(true).data().toArray()
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

            await Ventas.TipoVenta_Change(tipoVenta);
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
                                return obj.idTipoSalidaBienInsumoSaldo == 1;
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

            /*else {
               console.log("El div SIIIII es completamente visible y necesita scroll.");
           }*/


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
                saldo: row.saldo,
                cantidadPedida: 0,
                prVenta: row.precioUnitario,
                total: row.precioUnitario,
                //total: Ventas.customRoundToTwoDecimals(0 * row.precioUnitario),

                tipo: row.tipo,
                lote: row.lote,
                fechaVencimiento: row.fechaVencimiento,
                idTipoSalidaBienInsumoSaldo: row.idTipoSalidaBienInsumoSaldo,
                fechaVencimientoFormat: row.fechaVencimientoFormat,
                tipoPsicotropico: row.tipoPsicotropico,
            }

            if (Ventas.ExisteProducto(row.idProducto)) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_DetalleVentas.fnAddData(items)

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
                saldo: row.saldo,
                cantidadPedida: 0,
                prVenta: row.precioUnitario,
                //total: Ventas.customRoundToTwoDecimals(0 * row.precioUnitario),
                total: row.precioUnitario,

                tipo: row.tipo,
                lote: row.lote,
                fechaVencimiento: row.fechaVencimiento,
                idTipoSalidaBienInsumoSaldo: row.idTipoSalidaBienInsumoSaldo,
                fechaVencimientoFormat: row.fechaVencimientoFormat,
                tipoPsicotropico: row.tipoPsicotropico,
            }

            if (Ventas.ExisteProducto(row.idProducto)) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_DetalleVentas.fnAddData(items);

            //// Mover la última fila agregada al inicio
            //let $ultFila = $('#tblDetalleVentas tbody tr:last');
            //$('#tblDetalleVentas tbody').prepend($ultFila);

            //// Recalcular los números de fila
            //Ventas.ActualizarCorrelativoDetalleVentas();

            // Mover la fila recién agregada al principio
            //let lastIndex = oTable_DetalleVentas.fnGetData().length - 1; // Índice de la última fila
            //let lastRow = oTable_DetalleVentas.fnGetNodes(lastIndex);    // Nodo DOM de la última fila
            //$(lastRow).prependTo(oTable_DetalleVentas.fnGetNodes());     // Mover al principio

            $("#txtCant_idItem_" + row.idProducto).val("");
            $("#txtCant_idItem_" + row.idProducto).focus();

            oTable_ProductosBuscados.fnClearTable();
            $("#txtCodigoProducto").val("");
            $("#txtNombreProducto").val("");
            $('#contProductosBusqueda').hide()
        });

        $('#btnQuitarProducto').on('click', function () {
            var objrowTb = oTable_DetalleVentas.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Ventas.QuitarProducto(objrowTb);
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
                    if (isEmpty(newRow[0]) == false) {
                        newRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

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
        //    await Ventas.BuscarNumeroReceta($('#txtNroReceta').val());
        //});

        $('#txtNroReceta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                await Ventas.BuscarNumeroReceta($('#txtNroReceta').val());
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
                        //Cargando(0)
                    } else {
                        alerta2("info", "", "Es una receta de antimicrobianos.<br>La receta aun no cuenta con una solicittud para aprobacion de antimicrobianos.<br>No es posible despachar.");
                        //return;
                    }
                }


                $(".searchRecetaPaciente").val("");
                BusqRecetasPacientes.CargarFechaHoy();
                oTable_BusquedaRecetasPacientes.fnClearTable();
                $("#modalBusquedaRecetas").modal("hide");
                $('#txtNroReceta').val(receta.idReceta);
                await Ventas.BuscarNumeroReceta($('#txtNroReceta').val());
            }

        });

        //$('#btnBuscarDatosPacienteNroReceta').on('click', async function () {
        //    await Ventas.BuscarNumeroReceta($('#txtNroReceta').val());
        //});

        //$('#txtNroCuenta').on('focusout', async function () {
        //    await Ventas.BuscarNumeroCuenta($('#txtNroCuenta').val());
        //});

        $('#txtNroCuenta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                await Ventas.BuscarNumeroCuenta($('#txtNroCuenta').val());
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
            let busquedaPacientes = await Ventas.PacientesFiltrarTodos();
        });

        $('#btnLimpiarBusquedaPaciente').on('click', async function () {
            $(".searchPaciente").val("");
        });

        $('#tblBusquedaPacientes tbody').on('click', 'tr', async function () {
            oTable_BusquedaPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let busqueda = oTable_BusquedaPacientes.api(true).row('.selected').data();
            await Ventas.AtencionesPacienteFiltrarTodos(busqueda.idPaciente);
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
            await Ventas.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
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
            //oTable_DetalleVentas.$('tr.selected').removeClass('selected');
            //$(this).addClass('selected');
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_DetalleVentas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            let data = oTable_DetalleVentas.api(true).row('.selected').data()

            oTable_ConsumoHistorico.fnClearTable()

            if (isEmpty(data)) {
                if (Ventas.ConsumoHistorico.length > 0) {
                    oTable_ConsumoHistorico.fnAddData(Ventas.ConsumoHistorico)
                }

                return
            }

            let ConsumoHistoricoFilter = Ventas.ConsumoHistorico.filter(obj => obj.codigo.trim() == data.codigo.trim())

            console.log(data, ConsumoHistoricoFilter)

            if (ConsumoHistoricoFilter.length > 0) {
                oTable_ConsumoHistorico.fnAddData(ConsumoHistoricoFilter)
            }

        });


        $('#tblVentas tbody').on('click', '.btnImprimeInforme', async function () {// KHOYOSI
            var objrow = oTable_Ventas.api(true).row($(this).parents("tr")[0]).index();
            var objTable = oTable_Ventas.fnGetData(objrow);

            $('#ifrmInforme').attr('src', "");
            var url = "/Farmacias/ImpreInformeVentas?area=ConsultaExterna&MovNumero=" + objTable.movNumero + "&MovTipo=" + 'S'
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


            let row = oTable_DetalleVentas.api().row(rowElement);

            let data = row.data()

            let cantidadPedida = $('#' + inputId).val()

            if (parseInt(cantidadPedida) > parseInt(data.saldo)) {
                $('#' + inputId).focus()
                alerta(2, 'La cantidad debe ser menor o igual a ' + data.saldo)
                return
            }

            let precioItem = parseFloat(parseFloat(data.prVenta))
            let cantidadItem = inputElement.val()


            var inputCantidad = '';
            inputCantidad = '  <input id="txtCant_idItem_' + data.idItem + '" value="' + cantidadItem + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero txtCantidadPedida">'




            data.total = Ventas.customRoundToTwoDecimals((precioItem * cantidadItem)).toFixed(2)
            data.cantidadPedida = inputCantidad


            //var row = table.row(rowIndex);
            row.data(data).draw();


            // Devolver el foco al input y mover el cursor al final
            let newInputElement = $('#' + inputId)
            newInputElement.focus();
            let val = newInputElement.val();
            newInputElement.val(''); // Clear the input
            newInputElement.val(val); // Restore the value and move the cursor to the end

            let detalleVentas = oTable_DetalleVentas.api().data().toArray()
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

            let row = oTable_DetalleVentas.api().row(rowElement);

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
            Ventas.LimpiarCamposBusqueda();
        });


        $('#tblVentas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Ventas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarVentas').on('click', async function () {

            Ventas.LimpiarFormularioVariables()

            Ventas.TipoAccion = 'A'

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
            $("#txtFechaPrescripcionExterno").datepicker("setDate", FechaHoy);



            $('#txtHoraRegistro').val(time);
            $('#txtHoraPrescripcion').val(time);
            $('#txtHoraPrescripcionExt').val(time);

            $('input[name="rdbTipoVenta"][value="1"]').prop('checked', true);
            if ($('#cboFarmaciaVenta').val() > 0) {
                $('input[name="rdbTipoVenta"][value="1"]').click();
            }

            //$('input[name="rdbTipoVenta"]').click()

            $('#contProductosBusqueda').hide()

            $('#btnGuardarVentas').removeClass('btn btn-primary');
            $('#btnGuardarVentas').removeClass('btn btn-danger');
            $("#btnGuardarVentas").show();
            if (Ventas.TipoAccion == 'A') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }

            //$("#cboTipoReceta").change();
            await Ventas.TipoReceta_Change();

            MostrarAreaRegistro();
        });

        $('#btnModificarVentas').on('click', async function () {

            await Ventas.LimpiarFormularioVariables()

            Ventas.TipoAccion = 'M'

            let objTblVentas = oTable_Ventas.api(true).row('.selected').data()

            if (isEmpty(objTblVentas)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            if (objTblVentas.idEstadoMovimiento == 0) {
                alerta(2, 'La Venta/Preventa se encuentra Anulada, no se podra modificar')
                return false
            }

            $('#txtNombreProducto').prop('disabled', false)
            $('#btnAgregaProducto').prop('disabled', false)
            $('#btnQuitarProducto').prop('disabled', false)

            if (objTblVentas.tipoVenta == 'D') {

                let movNumero = objTblVentas.movNumero
                let idEstado = 1

                await Ventas.CargarDatosVentaDirecta(movNumero, idEstado)

            } else if (objTblVentas.tipoVenta == 'P') {

                let idPreventa = objTblVentas.idPreventa
                let idEstado = 1


                await Ventas.CargarDatosPreventa(idPreventa, idEstado)

            }


            if (objTblVentas.estado == "Con Documento Emitido") {
                $("#btnGuardarVentas").hide();
            }


            MostrarAreaRegistro();
        });

        $('#btnEliminarVentas').on('click', async function () {
            let objTblVentas = oTable_Ventas.api(true).row('.selected').data()

            if (isEmpty(objTblVentas)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            if (objTblVentas.idEstadoMovimiento == 0) {
                alerta(2, 'La Venta/Preventa se encuentra Anulada, no se podra eliminar')
                return false
            }

            Ventas.TipoAccion = 'E'

            if (objTblVentas.tipoVenta == 'D') {
                let movNumero = objTblVentas.movNumero
                let idEstado = 0

                await Ventas.CargarDatosVentaDirecta(movNumero, idEstado)

            } else if (objTblVentas.tipoVenta == 'P') {

                let idPreventa = objTblVentas.idPreventa
                let idEstado = 0

                await Ventas.CargarDatosPreventa(idPreventa, idEstado)

            }

            if (objTblVentas.estado == "Con Documento Emitido") {
                $("#btnGuardarVentas").hide();
            }

            MostrarAreaRegistro();
        });

        $('#btnConsultarVentas').on('click', async function () {
            let objTblVentas = oTable_Ventas.api(true).row('.selected').data()

            if (isEmpty(objTblVentas)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            Ventas.TipoAccion = 'C'

            if (objTblVentas.tipoVenta == 'D') {
                let movNumero = objTblVentas.movNumero
                let idEstado = 1

                await Ventas.CargarDatosVentaDirecta(movNumero, idEstado)
            } else if (objTblVentas.tipoVenta == 'P') {

                let idPreventa = objTblVentas.idPreventa
                let idEstado = 1

                await Ventas.CargarDatosPreventa(idPreventa, idEstado)

            }

            MostrarAreaRegistro();
        });



        $('#btnCancelarVentas').on('click', function () {
            //TriajeRn.LimpiarCamposRegistro();
        });

        $('#btnGuardarVentas').on('click', async function () {
            let errorMensaje = ''

            if (isEmpty($('#cboFarmaciaVenta').val())) {
                alerta2('warning', 'Agregar Ventas', `Por favor elija el Almacén Origen.`)
                return false
            }

            if ($('#rdbVenta').is(':checked')) { // Venta

                if ($('#txtDatosDeCuenta').val() == '') {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese el N° de Cuenta.`)
                    return false
                }

                //if (isEmpty($('#cboPrescriptor').val())) {
                //    alerta2('warning', 'Agregar Ventas', `Por favor elija el Prescriptor.`)
                //    return false
                //}

            }

            if (isEmpty($('#cboTipoReceta').val()) && $('#cboTipoReceta').val() != '0') {
                alerta2('warning', 'Agregar Ventas', `Por favor elija el Tipo de Receta.`)
                return false
            }

            if (isEmpty($('#cboTipoFinanciamiento').val())) {
                alerta2('warning', 'Agregar Ventas', `Por favor elija el PRODUCTO/PLAN.`)
                return false
            }

            if ($('#cboTipoReceta').val() == 2) {
                if (isEmpty($('#txtCmpPrescriptorExterno').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese el Nº CMP del Prescriptor Externo.`)
                    return false
                }

                if (isEmpty($('#txtDatosMedicoExterno').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese el Prescriptor Externo.`)
                    return false
                }

                if (isEmpty($('#txtFechaPrescripcionExterno').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Fecha Prescripción.`)
                    return false
                }

                if (isEmpty($('#txtHoraPrescripcionExt').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Hora Prescripción.`)
                    return false
                }
            } else if ($('#cboTipoReceta').val() == 1) {
                if (isEmpty($('#cboPrescriptor').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor elija el Prescriptor.`)
                    return false
                }

                if (isEmpty($('#txtFechaPrescripcion').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Fecha Prescripcion.`)
                    $('#txtFechaPrescripcion').focus()
                    return false
                }

                if (isEmpty($('#txtHoraPrescripcion').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Hora Prescripcion.`)
                    $('#txtHoraPrescripcion').focus()
                    return false
                }
            } else {
                if (isEmpty($('#txtFechaPrescripcion').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Fecha Prescripcion.`)
                    $('#txtFechaPrescripcion').focus()
                    return false
                }

                if (isEmpty($('#txtHoraPrescripcion').val())) {
                    alerta2('warning', 'Agregar Ventas', `Por favor ingrese la Hora Prescripcion.`)
                    $('#txtHoraPrescripcion').focus()
                    return false
                }
            }

            let detalleProductos = oTable_DetalleVentas.api(true).data().toArray()

            if (detalleProductos.length == 0) {
                alerta2('warning', 'Agregar Ventas', `Por favor ingrese producto.`)
                return false
            }

            let validaPsicotropicoN = detalleProductos.some(obj => Object.values(obj).includes('N'));
            let validaPsicotropicoI = detalleProductos.some(obj => Object.values(obj).includes('I'));
            if (validaPsicotropicoN || validaPsicotropicoI) {
                if (isEmpty($('#txtNroFormato').val())) {
                    alerta2('warning', 'Agregar Ventas', `Exisen psicotropicos en la venta.<br> Por favor ingrese el Nº Formato.`)
                    $('#txtNroFormato').focus()
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

            if ($('#rdbPreventa').is(':checked')) {
                let ventaDirecta = Ventas.AgregarDatosDePreVenta()
            } else if ($('#rdbVenta').is(':checked')) {
                let ventaDirecta = Ventas.AgregarDatosDeVentaDirecta()
            } else {
                alerta2('warning', 'Por favor seleccione el tipo de venta.')
            }
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
            await Ventas.ListarProductosBuscados();

        });


        $('#cboServicioRegistro').on('change', function () {
            Ventas.oDoFarmMovimientoVentas.idServicioPaciente = $('#cboServicioRegistro').val()
        })

        $('#cboFarmaciaVenta').on('change', async function () {
            await Ventas.FarmaciaDestinoNI_Change();

        });
        $('#cboTipoReceta').on('change', async function () {
            await Ventas.TipoReceta_Change();
        });

        $('#cboConceptoNI').on('change', async function () {
            await Ventas.ConceptoNI_Change();
        });

        $('#cboOrigenNI').on('change', async function () {
            await Ventas.XXXXX();
        });

        $('#cboTipoDocumentoNI').on('change', async function () {
            await Ventas.XXXXXXXXX();
        });

        $("#cboPaquetes").on("change", async function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idPaquete', $("#cboPaquetes").val());
            midata.append('tipo', 0);

            try {
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Catalogo/FactDetallePaquete?area=Comun",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                oTable_paquete.fnClearTable();
                if (datos.table.length > 0) {
                    oTable_paquete.fnAddData(datos.table)
                }

                oTable_paquete.resize();
                resp = true;
            } catch (error) {
                resp = false;
                alerta("ERROR", "Error listar detalle de paquete!", "2");
            }


        })

        $('#btnCerrarPaquete').on('click', function () {
            $('#modalPaquete').modal('hide');
        })
        $('#btnCargarPaqueteDetalle').on('click', async function () {

            if (isEmpty($('#cboFarmaciaVenta').val())) {
                alerta2('warning', 'Atención', 'Selecciona la farmacia')
                return
            }
            Cargando(1);

            let error = ''
            let grabaProducto = true

            dataPq = oTable_paquete.api(true).rows().data();
            //for (const [index, value] of dataPq.toArray().entries()) {
            //    idPuntoCarga = dataPq[index]["idPuntoCarga"]
            //    idProducto = dataPq[index]["idProducto"]
            //    idFuente = $('#hdIdTipoFuenteFian').val()
            //    precioUnitario = await Ventas.asignaPrecio(idProducto, idPuntoCarga, idFuente)


            //    //RQ0002 RMOREANO
            //    var objRow
            //    if (idPuntoCarga == 5) {
            //        objRow = {
            //            idItem: idProducto,
            //            producto: dataPq[index]["descripcion"],
            //            cantidadPedida: dataPq[index]["cantidad"],
            //            precio: precioUnitario,
            //            total: precioUnitario * dataPq[index]["cantidad"],
            //            idDosisRecetada: 1,
            //            dosis: "1",
            //            idViaAdministracion: dataPq[index]["idViaAdministracion"],
            //            vias: dataPq[index]["vias"],
            //            observaciones: "", //$('#txtFrecuencia').val()
            //            dx: ""

            //        }
            //    } else {
            //        objRow = {
            //            idItem: idProducto,
            //            producto: dataPq[index]["descripcion"],
            //            cantidadPedida: dataPq[index]["cantidad"],
            //            precio: precioUnitario,
            //            total: precioUnitario * dataPq[index]["cantidad"],
            //            dx: "",
            //            idFrecuencia: "",
            //            frecuencia: ""
            //        }
            //    }
            //    // FIN RQ0002
            //    let dataTable
            //    let existe = false

            //    console.log()

            //    $('#modalPaquete').modal('hide');
            //    Cargando(0)




            //}

            let totalDetalle = 0
            oTable_DetalleVentas.fnClearTable()

            for (let objCabceraDetalle of dataPq.toArray()) {
                // modificando
                let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciaVenta').val(), objCabceraDetalle.idProducto, 1)

                if (!isEmpty(saldoAlmacen)) {
                    let items = {
                        idItem: objCabceraDetalle.idProducto,
                        codigo: objCabceraDetalle.codigo,
                        producto: objCabceraDetalle.descripcion,
                        saldo: saldoAlmacen.cantidad,
                        cantidadPedida: objCabceraDetalle.cantidad,
                        prVenta: objCabceraDetalle.precio,
                        total: Ventas.customRoundToTwoDecimals((parseFloat(objCabceraDetalle.cantidad) * parseFloat(objCabceraDetalle.precio.toFixed(3))).toFixed(2)),

                        tipo: saldoAlmacen.idTipoSalidaBienInsumo == 1 ? 'Venta' : 'IntervensionSanitaria',
                        lote: 1,
                        fechaVencimiento: 1,
                        idTipoSalidaBienInsumoSaldo: saldoAlmacen.idTipoSalidaBienInsumo,
                        fechaVencimientoFormat: 1,
                        tipoPsicotropico: 0,

                    }

                    if (Ventas.ExisteProducto(objCabceraDetalle.idProducto)) {
                        alerta(2, 'El producto ya fue agregado')
                        return false
                    }

                    totalDetalle = totalDetalle + parseFloat(items.total)

                    oTable_DetalleVentas.fnAddData(items)
                }

            }

            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));

            $('#modalPaquete').modal('hide');
            Cargando(0);


        });
    },

    //////////////////////////LLENAR COMBOS////////////////////////////////////////////////////
    LLenarCombos() {
        Ventas.CargarComboFarmaciasNI();

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

        //////////AGREGADO POR KHOYOSI///////////////////////////////////
        $.ajax({
            method: "POST",
            url: "/Utilitario/ListarProfesionalesDeLaSalud?area=Comun",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboPrescriptor').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    if (obj.idColegioHIS == '01' || obj.idColegioHIS == '03' || obj.idColegioHIS == '05') {
                        $('#cboPrescriptor').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
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

            $('#txtCmpPrescriptorExterno').prop('disabled', true);
            $('#txtDatosMedicoExterno').prop('disabled', true);
            $('#txtFechaPrescripcionExterno').prop('disabled', true);
            $('#txtHoraPrescripcionExt').prop('disabled', true);
        } else {
            $(".camposRegistro").attr("disabled", true);

            $('#txtCmpPrescriptorExterno').prop('disabled', true);
            $('#txtDatosMedicoExterno').prop('disabled', true);
            $('#txtFechaPrescripcionExterno').prop('disabled', true);
            $('#txtHoraPrescripcionExt').prop('disabled', true);
            return;
        }

        //await Ventas.FarmTipoConceptosDevuelveParaRegistroDeNiNs();
        Ventas.esUnidosisLaFarmacia = parseInt($('#cboFarmaciaVenta option:selected').attr('esUnidosis'));
        let tipoVenta = $('input[name="rdbTipoVentaBusqueda"]:checked').val();
        Ventas.TipoVenta_Change(tipoVenta);
    },

    async TipoVenta_Change(tipoVenta) {
        if (tipoVenta == 1) {
            let oRsTipoFinanciamiento = await Ventas.TipoFinanciamientosDevuelveSoloFarmacia(" and dbo.TiposFinanciamiento.esFuenteFinanciamiento=1")

            $('#cboTipoFinanciamiento').empty();
            $(oRsTipoFinanciamiento).each(function (i, obj) {
                $('#cboTipoFinanciamiento').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoFinanciamiento').val("");

            $('#cboTipoFinanciamiento').prop('disabled', true)
            $('#txtNroCuenta').prop('disabled', false)

            // validar si se habilita la opcion agregar
            $('#cboTipoReceta').val(1);
            await Ventas.TipoReceta_Change();


            $('#txtNroHistoria').prop('disabled', true);
            $('#btnBuscarDatosPacienteNroHistoria ').prop('disabled', true);
            $('#txtNroDocumentoPaciente').prop('disabled', true);
            $('#btnBuscarDatosPacienteNroDocumento').prop('disabled', true);
            $('#txtNombrePaciente').prop('disabled', true);
            //$('#cboServicioRegistro').prop('disabled', true);
            $('#cboServicioRegistro').removeAttr('disabled');

            //$('#txtCmpPrescriptorExterno').prop('disabled', true);
            //$('#txtDatosMedicoExterno').prop('disabled', true);
            //$('#txtFechaPrescripcionExterno').prop('disabled', true);
            //$('#txtHoraPrescripcionExt').prop('disabled', true);

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
            let oRsTipoFinanciamiento = await Ventas.TipoFinanciamientosDevuelveSoloFarmacia(" and dbo.TiposFinanciamiento.TipoVenta='P'")
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
            await Ventas.TipoReceta_Change();

            $('#txtNroHistoria').removeAttr('disabled');
            $('#btnBuscarDatosPacienteNroHistoria ').removeAttr('disabled');
            $('#txtNroDocumentoPaciente').removeAttr('disabled');
            $('#btnBuscarDatosPacienteNroDocumento').removeAttr('disabled');
            $('#txtNombrePaciente').removeAttr('disabled');
            $('#cboServicioRegistro').removeAttr('disabled');
            //$('#txtCmpPrescriptorExterno').removeAttr('disabled');
            //$('#txtDatosMedicoExterno').removeAttr('disabled');
            //$('#txtFechaPrescripcionExterno').removeAttr('disabled');
            //$('#txtHoraPrescripcionExt').removeAttr('disabled');

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

        const concepto = await Ventas.SeleccionarConceptoNI(parseInt($('#cboConceptoNI').val()));
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

            await Ventas.ListarTiposCompraSegunFiltro("idTipoCompra<>1");
            await Ventas.ListarTiposProcesoSegunFiltro("idTipoProceso<>1");


        } else {
            $('#cboTipoProcesoNI').attr('disabled', true);
            $('#cboTipoCompraNI').attr('disabled', true);
            $('#txtNroProcesoNI').attr('disabled', true);
            $('#txtNroRucNI').attr('disabled', true);
            $('#txtRazonSocialRucNI').attr('disabled', true);

            await Ventas.ListarTiposCompraSegunFiltro("");
            $('#cboTipoCompraNI').val("1");
            await Ventas.ListarTiposProcesoSegunFiltro("");
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

    async TipoReceta_Change() {
        Ventas.oDoPreventa.idTipoReceta = $('#cboTipoReceta').val();
        //Ventas.oDoFarmMovimientoVentas.idTipoReceta = $('#cboTipoReceta').val();

        let FechaHoraHoy = await Utilitario.FechaHoraServidor();
        let FechaHoy = FechaHoraHoy.substring(0, 10);
        let HoraHoy = FechaHoraHoy.substring(11, 16);

        $("#cboPrescriptor").val("");
        $("#txtFechaPrescripcion").val("");
        $("#txtHoraPrescripcion").val("");

        $("#txtCmpPrescriptorExterno").val("");
        $("#txtDatosMedicoExterno").val("");
        $("#txtFechaPrescripcionExterno").val("");
        $("#txtHoraPrescripcionExt").val("");

        if ($('#cboTipoReceta').val() == 2) {
            $('#frmPrescriptorInterno').hide();
            $('#frmPrescriptorExterno').show();

            $('#txtCmpPrescriptorExterno').removeAttr('disabled');
            $('#txtDatosMedicoExterno').removeAttr('disabled');
            $('#txtFechaPrescripcionExterno').removeAttr('disabled');
            $('#txtHoraPrescripcionExt').removeAttr('disabled');

            $('#cboPrescriptor').prop('disabled', true);
            $('#txtFechaPrescripcion').prop('disabled', true);
            $('#txtHoraPrescripcion').prop('disabled', true);

            $("#txtFechaPrescripcionExterno").datepicker("setDate", FechaHoy);
            $('#txtHoraPrescripcionExt').val(HoraHoy);
        } else {
            $('#frmPrescriptorInterno').show();
            $('#frmPrescriptorExterno').hide();

            $('#cboPrescriptor').removeAttr('disabled');
            $('#txtFechaPrescripcion').removeAttr('disabled');
            $('#txtHoraPrescripcion').removeAttr('disabled');

            $('#txtCmpPrescriptorExterno').prop('disabled', true);
            $('#txtDatosMedicoExterno').prop('disabled', true);
            $('#txtFechaPrescripcionExterno').prop('disabled', true);
            $('#txtHoraPrescripcionExt').prop('disabled', true);

            $("#txtFechaPrescripcion").datepicker("setDate", FechaHoy);
            $('#txtHoraPrescripcion').val(HoraHoy);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    //////////////////////////METODOS BACKED///////////////////////////////////////////////////////////
    async ListarVentas() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (Ventas.ValidarBusquedaNotasIngreso() == false) {
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
        data.append('DocumentoNumero', $("#txtDocumentoNumeroBusq").val());

        try {
            Cargando(1);
            oTable_Ventas.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/DevuelveCabeceraDeVentasOpreventa?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_Ventas.fnAddData(datos.lstData.table);
                oTable_Ventas.resize();
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
            if (datos.lstData.table.length > 0) {
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

            //Cargando(0);
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

        $('#cboServicioRegistro').empty();
        if (isEmpty(filtro)) {
            $('.chzn-select').chosen().trigger("chosen:updated");
            return;
        }

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
            //Cargando(1);

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

            //Cargando(0);

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
            //Cargando(1);

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

            //Cargando(0);
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
            //Cargando(1);

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

            //Cargando(0);
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

        let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoLote(lnIdAlmacen, lnIdProducto, lcLote, ldFechaVencimiento, lnIdTipoSalidaBienInsumo)

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
        let cajaNroDocumento = await Ventas.CajaNroDocumentoSeleccionarPorId(IdTipoComprobante, IdCaja)

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

                let nroDocModificado = await Ventas.CajaNroDocumentoModificar(
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

            let saldosEnEsteMomento = await Ventas.FarmDevuelveSaldosConLotesSegunAlmacen(lnIdAlmacen, 0, consolidado.codigo)

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

            //Cargando(0);

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
            //Cargando(1);

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

            //Cargando(0);
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

    CrearModificarVentaFarmacia: async function (MovNumero, MovTipo, IdCuentaAtencion, IdServicioPaciente, FechaHoraPrescribe, IdPaquete, PresExternoCmp, PresExternoMedico,
        PresExternoFecha, NroFormato, IdReceta, DocumentoNumero, Observaciones, idEstadoMovimiento, idAlmacenOrigen, idAlmacenDestino, IdFuenteFinanciamiento,
        IdPreVenta, IdPrescriptor, IdTipoReceta, idPuntoCarga, idComprobantePago, idEstadoFacturacion, DNI, NombPaciente, movimientoDetalle, idUsuario) {

        let formData = new FormData();

        formData.append('MovNumero', MovNumero);
        formData.append('MovTipo', MovTipo);
        formData.append('IdCuentaAtencion', IdCuentaAtencion);
        formData.append('IdServicioPaciente', IdServicioPaciente);
        formData.append('FechaHoraPrescribe', FechaHoraPrescribe);
        formData.append('IdPaquete', IdPaquete);
        formData.append('PresExternoCmp', PresExternoCmp);
        formData.append('PresExternoMedico', PresExternoMedico);
        formData.append('PresExternoFecha', PresExternoFecha);
        formData.append('NroFormato', NroFormato);
        formData.append('IdReceta', IdReceta);
        formData.append('DocumentoNumero', DocumentoNumero);
        formData.append('Observaciones', Observaciones);
        formData.append('idEstadoMovimiento', idEstadoMovimiento);
        formData.append('idAlmacenOrigen', idAlmacenOrigen);
        formData.append('idAlmacenDestino', idAlmacenDestino);
        formData.append('IdFuenteFinanciamiento', IdFuenteFinanciamiento);
        formData.append('IdPreVenta', IdPreVenta);
        formData.append('IdPrescriptor', IdPrescriptor);
        formData.append('IdTipoReceta', IdTipoReceta);
        formData.append('idPuntoCarga', idPuntoCarga);
        formData.append('idComprobantePago', idComprobantePago);
        formData.append('idEstadoFacturacion', idEstadoFacturacion);
        formData.append('DNI', DNI);
        formData.append('NombPaciente', NombPaciente);
        formData.append('movimientoDetalle', movimientoDetalle); // debe estar como string XML
        formData.append('idUsuario', idUsuario);
        formData.append('IdListBarItem', ObtenerItemListBar());

        let res = await HttpClient.Post('/Farmacias/CrearModificarVentaFarmacia?area=Farmacia', formData)


        return res
    },



    async AgregarDatosDeVentaDirecta() {

        if (Ventas.Guardando == 0) {
            Cargando(1)
            Ventas.Guardando = 1

            try {

                let detalleVenta = oTable_DetalleVentas.api(true).data().toArray()
                let farmMovimientoDetalle = []
                let IdEstadoFacturacion = 1

                $(detalleVenta).each(function (i, obj) {
                    console.log('obj', obj)

                    let cantProducto = $('#txtCant_idItem_' + obj.idItem.toString()).val()

                    farmMovimientoDetalle.push({

                        idProducto: obj.idItem,
                        Lote: '', // validar
                        FechaVencimiento: '', // validar
                        idTipoSalidaBienInsumo: '1', // validar
                        Item: i + 1,
                        Cantidad: cantProducto,
                        Precio: obj.prVenta,
                        Total: obj.total,
                        RegistroSanitario: "",
                        DocumentoNumero: "",

                    })
                })

                if (Ventas.TipoAccion == 'E') {
                    Ventas.IdEstadoMovimiento = 0
                    IdEstadoFacturacion = 9
                } else {
                    Ventas.IdEstadoMovimiento = 1
                    IdEstadoFacturacion = 1
                }

                let res = await this.CrearModificarVentaFarmacia(MovNumero = Ventas.MovNumero, MovTipo = 'S', IdCuentaAtencion = $('#txtNroCuenta').val(),
                    IdServicioPaciente = $('#cboServicioRegistro').val(), FechaHoraPrescribe = $('#txtFechaPrescripcion').val() + ' ' + $('#txtHoraPrescripcion').val(), IdPaquete = '',
                    PresExternoCmp = $('#txtCmpPrescriptorExterno').val(), PresExternoMedico = $('#txtDatosMedicoExterno').val(),
                    PresExternoFecha = $('#txtFechaPrescripcionExterno').val() + ' ' + $('#txtHoraPrescripcionExt').val(), NroFormato = $('#txtNroFormato').val(), IdReceta = $('#txtNroReceta').val(),
                    DocumentoNumero = Ventas.DocumentoNumero, Observaciones = $("#txtObservacionesRegistro").val(), idEstadoMovimiento = Ventas.IdEstadoMovimiento, idAlmacenOrigen = $('#cboFarmaciaVenta').val(), idAlmacenDestino = 0,
                    IdFuenteFinanciamiento = $('#cboTipoFinanciamiento').val(), IdPreVenta = Ventas.IdPreventa, IdPrescriptor = $('#cboPrescriptor').val(), IdTipoReceta = $('#cboTipoReceta').val(), idPuntoCarga = 5,
                    idComprobantePago = '', idEstadoFacturacion = IdEstadoFacturacion, DNI = $('#txtNroDocumentoPaciente').val(), NombPaciente = $('#txtNombrePaciente').val(),
                    movimientoDetalle = JSON.stringify(farmMovimientoDetalle))


                let data = res.data.table[0]
                let textoAlerta = ''
                let NuevoMovNumero = ''
                if (data.successNumber == 0) {
                    alerta2('error', '', data.errorMessage)
                    Cargando(0)
                    Ventas.Guardando = 0
                    return
                }

                NuevoMovNumero = data.movNumero

                if (Ventas.TipoAccion == 'E') {
                    textoAlerta = 'Se Anuló Nª ' + NuevoMovNumero + 'F'
                } else if (Ventas.TipoAccion == 'A') {
                    textoAlerta = "Se Agregó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeVentas?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                } else if (Ventas.TipoAccion == 'M') {
                    textoAlerta = "Se Modificó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeVentas?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                }

                alerta2('success', 'Venta', textoAlerta)

                //swal({
                //    title: 'Venta',
                //    html: textoAlerta,
                //    type: 'success',
                //    allowOutsideClick: false,
                //    showCancelButton: true,
                //    confirmButtonColor: '#4fb7fe',
                //    cancelButtonColor: '#6c6c6c',
                //    confirmButtonText: 'Aceptar',
                //    cancelButtonText: 'Cancelar',
                //})


                if ($('#rdbPreventa').is(':checked')) {
                    $('input[name="rdbTipoVentaBusqueda"][value="2"]').prop('checked', 1) // Preventa
                } else if ($('#rdbVenta').is(':checked')) {
                    $('input[name="rdbTipoVentaBusqueda"][value="1"]').prop('checked', 1) // Preventa
                }

                $('#cboFarmaciasBusq').val($('#cboFarmaciaVenta').val())

                $('.chzn-select').chosen().trigger("chosen:updated");
                Ventas.Guardando = 0
                Cargando(0)
                MostrarAreaLista();

                $('#btnBuscar').trigger('click')


            } catch (error) {
                alerta(2, "Error al Guardar")
                console.error("Error al obtener saldos:", error);
                Cargando(0)
                Ventas.Guardando = 0
                return false
            }
        }
    },

    async AgregarDatosDePreVenta() {

        let productosParaDespachar = []
        let farmMovimientoDetalle = []

        let total = 0
        let errorMensaje = "";

        let fechaActual = new Date();

        // Formatear la fecha en un formato ISO 8601, que es compatible con DateTime de ASP.NET
        let fechaFormateada = fechaActual.toISOString(); // Formato: yyyy-MM-ddTHH:mm:ss.sssZ

        let detalleVenta = oTable_DetalleVentas.api(true).data().toArray()

        for (let objDetalle of detalleVenta) {

            if (objDetalle.prVenta == 0) {
                errorMensaje += `Receta: ${bj.idReceta} No hay PRECIO para ${objDetalle.codigo} - ${objDetalle.producto} \n`
            } else {

                // Validamos si la farmaia Desino tiene stock para realizar el desapcho UNIDOSIS
                let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciaVenta').val(), objDetalle.idItem, 1)

                let cantProducto = $('#txtCant_idItem_' + objDetalle.idItem.toString()).val()

                if (!isEmpty(saldoAlmacen)) {
                    let productoDespacho = {
                        idProducto: objDetalle.idItem,
                        codigo: objDetalle.codigo,
                        nombreProducto: objDetalle.producto,
                        cantidad: cantProducto,
                        precio: objDetalle.prVenta,
                        total: objDetalle.total,
                        saldo: saldoAlmacen.cantidad,
                        precioDelSeguro: objDetalle.prVenta,
                        tipo: 'Tipo',
                    }

                    total = (parseFloat(total) + Ventas.customRoundToTwoDecimals(parseFloat(cantProducto) * parseFloat(objDetalle.prVenta))).toFixed(2)

                    productosParaDespachar.push(productoDespacho) // mRs_Productos1
                } else {
                    errorMensaje += `Receta: ${bj.idReceta} No hay SALDO para ${objDetalle.codigo} - ${objDetalle.producto} \n`
                }

            }
        }

        Ventas.oDoPreventa.idAlmacen = $('#cboFarmaciaVenta').val()
        Ventas.oDoPreventa.total = total

        Ventas.oDoPreventa.idPrescriptor = $('#cboPrescriptor').val()
        Ventas.oDoPreventa.fechaHoraPrescribe = $('#txtFechaPrescripcion').val() + ' ' + $('#txtHoraPrescripcion').val()
        Ventas.oDoPreventa.idTipoFinanciamiento = 1

        Ventas.oDoPreventa.PresExternoCmp = $('#txtCmpPrescriptorExterno').val()
        Ventas.oDoPreventa.PresExternoMedico = $('#txtDatosMedicoExterno').val()
        Ventas.oDoPreventa.PresExternoFecha = $('#txtFechaPrescripcionExterno').val() + ' ' + $('#txtHoraPrescripcionExt').val()

        Ventas.oDoPreventa.NroFormato = $('#txtNroFormato').val()

        let productosConLotes = await Ventas.DevuelveDetalleProductosConLotes(Ventas.oDoPreventa.idAlmacen, productosParaDespachar, 1, '')

        if (isEmpty(productosConLotes)) { // se comenta por el momento, descomentar despues por que se utilizara para controlar productos in stock
            return null
        }

        for (let [i, objProductosConLotes] of productosConLotes.entries()) {

            let cantProducto = $('#txtCant_idItem_' + objProductosConLotes.IdProducto.toString()).val()

            //let chequeSaldoOk = await Ventas.ChequeaQueSaldosConLotesSeaPositivo(Ventas.oDoPreventa.idAlmacen, objProductosConLotes.IdProducto, objProductosConLotes.Lote, objProductosConLotes.FechaVencimiento, objProductosConLotes.idTipoSalidaBienInsumo, cantProducto)
            let chequeSaldoOk = await Ventas.ChequeaQueSaldosConLotesSeaPositivo(Ventas.oDoPreventa.idAlmacen, objProductosConLotes.IdProducto, objProductosConLotes.Lote, objProductosConLotes.FechaVencimiento, objProductosConLotes.idTipoSalidaBienInsumo, objProductosConLotes.Cantidad)

            if (!chequeSaldoOk) {
                errorMensaje += `Ya no hay Saldos para el Producto ${objProductosConLotes.Codigo} - ${objProductosConLotes.NombreProducto} \n`
            } else {
                farmMovimientoDetalle.push({
                    idProducto: objProductosConLotes.IdProducto,
                    Lote: objProductosConLotes.Lote,
                    FechaVencimiento: objProductosConLotes.FechaVencimiento,
                    idTipoSalidaBienInsumo: objProductosConLotes.idTipoSalidaBienInsumo,
                    Item: i + 1,
                    //Cantidad: cantProducto,
                    Cantidad: objProductosConLotes.Cantidad,
                    Precio: objProductosConLotes.Precio,
                    Total: objProductosConLotes.Total,
                    RegistroSanitario: "",
                    DocumentoNumero: "",
                })
            }

        }

        if (isEmpty(errorMensaje) == false) {
            alerta2("warning", "", errorMensaje);
            return;
        }

        let idPreVenta = await Ventas.FarmPreVentaAgregar()


        let oDoFactOrdenesBienes = {
            FechaCreacion: fechaFormateada,
            IdCuentaAtencion: Ventas.oDoPreventa.idcuentaAtencion,
            IdEstadoFacturacion: Ventas.oDoPreventa.idEstadoPreventa,
            IdPaciente: Ventas.oDoPreventa.idPaciente,
            idPreVenta: idPreVenta,
            IdPuntoCarga: 5,
            MovNumero: null,
            MovTipo: null
        }

        // funcion para guardar ordenes bienes
        oDoFactOrdenesBienes.IdOrden = await Ventas.FactOrdenesBienesAgregar(oDoFactOrdenesBienes)

        let oDoFacturacionBienesPagos = {}
        let oDoPreventaDetalle = {}

        for (let [i, oRsDetalleProductos] of productosParaDespachar.entries()) { // se debe validar los productos que no tienen stock

            oDoFacturacionBienesPagos.IdOrden = oDoFactOrdenesBienes.IdOrden
            oDoFacturacionBienesPagos.idUsuarioAuditoria = oDoFactOrdenesBienes.IdUsuario
            oDoFacturacionBienesPagos.CantidadPagar = oRsDetalleProductos.cantidad
            oDoFacturacionBienesPagos.idProducto = oRsDetalleProductos.idProducto
            oDoFacturacionBienesPagos.PrecioVenta = oRsDetalleProductos.precio
            oDoFacturacionBienesPagos.TotalPagar = oRsDetalleProductos.total

            oDoPreventaDetalle.idPreVenta = idPreVenta
            oDoPreventaDetalle.idProducto = oRsDetalleProductos.idProducto
            oDoPreventaDetalle.item = i + 1
            oDoPreventaDetalle.cantidad = oRsDetalleProductos.cantidad
            oDoPreventaDetalle.precio = oRsDetalleProductos.precio
            oDoPreventaDetalle.importe = oRsDetalleProductos.total

            //oFacturacionBienesPagos.Insertar(oDoFacturacionBienesPagos)
            let factBienesFinanciamiento = await Ventas.FacturacionBienesPagosAgregar(oDoFacturacionBienesPagos.IdOrden, oDoFacturacionBienesPagos.idProducto, oDoFacturacionBienesPagos.CantidadPagar, oDoFacturacionBienesPagos.PrecioVenta, oDoFacturacionBienesPagos.TotalPagar)

            //FarmPreVentaDetalleAgregar(idPreventa, idProducto, item, Cantidad, Precio, Importe)
            let farmtPreVenta = await Ventas.FarmPreVentaDetalleAgregar(oDoPreventaDetalle.idPreVenta, oDoPreventaDetalle.idProducto, oDoPreventaDetalle.item, oDoPreventaDetalle.cantidad, oDoPreventaDetalle.precio, oDoPreventaDetalle.importe)


        }

        if (Ventas.TipoAccion == 'A') {
            if ($('#txtNroReceta').val() != '') {
                let relacionOrdenPago = Ventas.FarmRecetaRelacionOrdenPagoAgregar($('#txtNroReceta').val(), idPreVenta, 0, 1)
            }

            if (Ventas.idRecetaProcesada > 0) {
                let oDoRecetaCabecera = {
                    apellidoPaterno: "",
                    apellidoMaterno: "",
                    primerNombre: "",
                    nroHistoriaClinica: null,
                    puntoCarga: "",
                    idCuentaAtencion: null,
                    idReceta: Ventas.idRecetaProcesada,
                    fechaReceta: "",
                    servicio: "",
                    idPuntoCarga: null,
                    idFormaPago: null,
                    idComprobantePago: null,
                    idservicioIngreso: null,
                    idMedicoIngreso: null,
                    descripcion: "",
                    nombreMedico: "",
                    nombrePaciente: "",
                    fechaAtencion: "",
                    horaAtencion: "",
                    nombreEspecialidad: "",
                    validoHasta: "",
                    idAtencion: null,
                    tipoServicio: "",
                    edadPaciente: "",
                    nombreEESS: "",
                    direccionEESS: "",
                    telefonoEESS: "",
                    rucEESS: "",
                    fechaVigencia: "",
                    idPaciente: null,
                    idMedicoReceta: null,
                    idfuentefinanciamiento: null,
                    idTipoConcepto: null,
                    idEstado: 0
                };

                let recetaCabecera = await Ventas.RecetaCabeceraPoridReceta(oDoRecetaCabecera.idReceta)

                if (recetaCabecera.length > 0) {

                    oDoRecetaCabecera = recetaCabecera[0]
                    oDoRecetaCabecera.idEstado = 2

                    let cabeceraModificar = await Ventas.RecetaCabeceraModificar(oDoRecetaCabecera)

                    //let cabceraDetalle = await Ventas.RecetaCabeceraDetalleSeleccionaPorNroReceta(oDoRecetaCabecera.idReceta)

                    //for (let objCabceraDetalle of cabceraDetalle) {


                    //    let recetaDespacho = await Ventas.RecetaDetalleActualizaCantDespachada(idReceta = oDoRecetaCabecera.idReceta, idItem = objCabceraDetalle.idItem, CantidadDespachada = objCabceraDetalle.cantidadPedida, IdEstadoDetalle = 2)
                    //    let recetaDetalleItem = await Ventas.RecetaDetalleItemAgregar(idReceta = oDoRecetaCabecera.idReceta, idItem = objCabceraDetalle.idItem, DocumentoDespacho = lcTicket, CantidadDespachada = objCabceraDetalle.cantidadPedida)

                    //}

                    //if (Ventas.TipoAccion == 'A') {
                    //    let relacionOrdenPago = Ventas.FarmRecetaRelacionOrdenPagoAgregar(oDoRecetaCabecera.idReceta, 0, lcTicket, 2)
                    //}


                    //console.log('recetaCabecera', recetaCabecera)

                }


            }
        }




        let textoAlerta = ''

        if (Ventas.TipoAccion == 'E') {
            textoAlerta = 'Se Anuló correctamente la Preventa Nª ' + idPreVenta + 'F'
        } else if (Ventas.TipoAccion == 'A') {
            textoAlerta = "Se Agregó correctamente la Preventa <br> Tiene que ir a CAJA a cancelar con el Nª " + idPreVenta + 'F <br> Monto a Pagar: ' + Math.round(Ventas.oDoPreventa.total * 10) / 10;
        } else if (Ventas.TipoAccion == 'M') {
            textoAlerta = "Se Modificó correctamente la Preventa <br> Tiene que ir a CAJA a cancelar con el Nª " + idPreVenta + 'F <br> Monto a Pagar: ' + Math.round(Ventas.oDoPreventa.total * 10) / 10;
        }

        alerta2('success', 'Venta', textoAlerta)

        //swal({
        //    title: 'Venta',
        //    html: textoAlerta,
        //    type: 'success',
        //    allowOutsideClick: false,
        //    showCancelButton: true,
        //    confirmButtonColor: '#4fb7fe',
        //    cancelButtonColor: '#6c6c6c',
        //    confirmButtonText: 'Aceptar',
        //    cancelButtonText: 'Cancelar',
        //})

        if ($('#rdbPreventa').is(':checked')) {
            $('input[name="rdbTipoVentaBusqueda"][value="2"]').prop('checked', 1) // Preventa
        } else if ($('#rdbVenta').is(':checked')) {

            $('input[name="rdbTipoVentaBusqueda"][value="1"]').prop('checked', 1) // Preventa

        }

        $('#cboFarmaciasBusq').val($('#cboFarmaciaVenta').val())

        $('.chzn-select').chosen().trigger("chosen:updated");

        MostrarAreaLista();

        $('#btnBuscar').trigger('click')
        //console.log('preVentaAgregar', preVentaAgregar)
    },

    async FactOrdenesBienesAgregar(odoFactOrdenesBienes) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdPuntoCarga', odoFactOrdenesBienes.IdPuntoCarga);
        data.append('IdPaciente', odoFactOrdenesBienes.IdPaciente);
        data.append('IdCuentaAtencion', odoFactOrdenesBienes.IdCuentaAtencion);
        data.append('idComprobantePago', null);
        data.append('MovNumero', odoFactOrdenesBienes.MovNumero);
        data.append('MovTipo', odoFactOrdenesBienes.MovTipo);
        data.append('idPreVenta', odoFactOrdenesBienes.idPreVenta);
        data.append('IdEstadoFacturacion', odoFactOrdenesBienes.IdEstadoFacturacion);
        data.append('DNI', $('#txtNroDocumentoPaciente').val().length <= 8 ? $('#txtNroDocumentoPaciente').val() : $('#txtNroDocumentoPaciente').val().substr(2, $('#txtNroDocumentoPaciente').val().length));
        data.append('NombPaciente', $('#txtNombrePaciente').val());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FactOrdenesBienesAgregar?area=Farmacia",
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

    async FactOrdenesBienesAgregarVentas(odoFactOrdenesBienes) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdPuntoCarga', odoFactOrdenesBienes.IdPuntoCarga);
        data.append('IdPaciente', odoFactOrdenesBienes.IdPaciente);
        data.append('IdCuentaAtencion', odoFactOrdenesBienes.IdCuentaAtencion);
        data.append('idComprobantePago', null);
        data.append('MovNumero', odoFactOrdenesBienes.MovNumero);
        data.append('MovTipo', odoFactOrdenesBienes.MovTipo);
        data.append('idPreVenta', odoFactOrdenesBienes.idPreVenta);
        data.append('IdEstadoFacturacion', odoFactOrdenesBienes.IdEstadoFacturacion);
        data.append('DNI', $('#txtNroDocumentoPaciente').val().length <= 8 ? $('#txtNroDocumentoPaciente').val() : $('#txtNroDocumentoPaciente').val().substr(2, $('#txtNroDocumentoPaciente').val().length));
        data.append('NombPaciente', $('#txtNombrePaciente').val());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FactOrdenesBienesAgregarVentas?area=Farmacia",
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

    async FacturacionBienesFinanciamientosAgregar(MovNumero, MovTipo, IdProducto, IdTipoFinanciamiento, IdFuenteFinanciamiento, CantidadFinanciada, PrecioFinanciado, TotalFinanciado) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('MovNumero', MovNumero);
        data.append('MovTipo', MovTipo);
        data.append('IdProducto', IdProducto);
        data.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
        data.append('IdFuenteFinanciamiento', IdFuenteFinanciamiento);
        data.append('CantidadFinanciada', CantidadFinanciada);
        data.append('PrecioFinanciado', PrecioFinanciado);
        data.append('TotalFinanciado', TotalFinanciado);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FacturacionBienesFinanciamientosAgregar?area=Farmacia",
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

    async FacturacionBienesPagosAgregar(IdOrden, IdProducto, CantidadPagar, PrecioVenta, TotalPagar) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdOrden', IdOrden);
        data.append('IdProducto', IdProducto);
        data.append('CantidadPagar', CantidadPagar);
        data.append('PrecioVenta', PrecioVenta);
        data.append('TotalPagar', TotalPagar);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FacturacionBienesPagosAgregar?area=Farmacia",
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

    async FarmPreVentaAgregar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdPreventa', Ventas.oDoPreventa.idPreventa);
        data.append('idAlmacen', Ventas.oDoPreventa.idAlmacen);
        data.append('idPaciente', Ventas.oDoPreventa.idPaciente);
        data.append('idTipoFinanciamiento', Ventas.oDoPreventa.idTipoFinanciamiento);
        data.append('total', Ventas.oDoPreventa.total);
        data.append('idDiagnostico', Ventas.oDoPreventa.idDiagnostico);
        data.append('idTipoReceta', Ventas.oDoPreventa.idTipoReceta);
        data.append('idcuentaAtencion', Ventas.oDoPreventa.idcuentaAtencion);
        data.append('idPrescriptor', Ventas.oDoPreventa.idPrescriptor);
        data.append('idEstadoPreventa', Ventas.oDoPreventa.idEstadoPreventa);
        data.append('fechaHoraPrescribe', Ventas.oDoPreventa.fechaHoraPrescribe);
        data.append('dni', $('#txtNroDocumentoPaciente').val().length <= 8 ? $('#txtNroDocumentoPaciente').val() : $('#txtNroDocumentoPaciente').val().substr(2, $('#txtNroDocumentoPaciente').val().length));
        data.append('Paciente', $('#txtNombrePaciente').val());
        data.append('PresExternoCmp', Ventas.oDoPreventa.PresExternoCmp);
        data.append('PresExternoMedico', Ventas.oDoPreventa.PresExternoMedico);
        data.append('PresExternoFecha', Ventas.oDoPreventa.PresExternoFecha);
        data.append('NroFormato', Ventas.oDoPreventa.NroFormato);
        data.append('Observaciones', $('#txtObservacionesRegistro').val());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmPreVentaAgregar?area=Farmacia",
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

    async FarmPreVentaDetalleAgregar(idPreventa, idProducto, item, Cantidad, Precio, Importe) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idPreventa', idPreventa);
        data.append('idProducto', idProducto);
        data.append('item', item);
        data.append('Cantidad', Cantidad);
        data.append('Precio', Precio);
        data.append('Importe', Importe);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmPreVentaDetalleAgregar?area=Farmacia",
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

    async RecetaCabeceraModificar(objRecetaCabecera) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idMedico', objRecetaCabecera.idMedicoReceta);
        data.append('idMedicoIngreso', objRecetaCabecera.idMedicoReceta);
        data.append('idReceta', objRecetaCabecera.idReceta);
        data.append('idPuntoCarga', objRecetaCabecera.idPuntoCarga);
        data.append('idCuentaAtencion', objRecetaCabecera.idCuentaAtencion);
        data.append('idServicioReceta', objRecetaCabecera.idservicioIngreso);
        data.append('nroEvaluacion', 0);
        data.append('idEstado', objRecetaCabecera.idEstado);
        data.append('idComprobantePago', objRecetaCabecera.idComprobantePago);
        data.append('fechaReceta', objRecetaCabecera.fechaReceta);
        data.append('fechaVigencia', objRecetaCabecera.fechaVigencia);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaCabeceraModificar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async RecetaDetalleActualizaCantDespachada(idReceta, idItem, CantidadDespachada, IdEstadoDetalle) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idReceta', idReceta);
        data.append('idItem', idItem);
        data.append('CantidadDespachada', CantidadDespachada);
        data.append('IdEstadoDetalle', IdEstadoDetalle);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaDetalleActualizaCantDespachada?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async RecetaDetalleItemAgregar(idReceta, idItem, DocumentoDespacho, CantidadDespachada) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idReceta', idReceta);
        data.append('idItem', idItem);
        data.append('DocumentoDespacho', DocumentoDespacho);
        data.append('CantidadDespachada', CantidadDespachada);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaDetalleItemAgregar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmRecetaRelacionOrdenPagoAgregar(NroReceta, NroOrdenPago, NroDocumento, TipoPlan) {
        //da
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroReceta', NroReceta);
        data.append('NroOrdenPago', NroOrdenPago);
        data.append('NroDocumento', NroDocumento);
        data.append('TipoPlan', TipoPlan);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmRecetaRelacionOrdenPagoAgregar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },

    async FarmPreVentaSeleccionarPorId(idPreventa) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('idPreventa', idPreventa);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmPreVentaSeleccionarPorId?area=Farmacia",
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

    async FarmPreVentaDetalleDevuelveTodosItems(idPreventa) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('idPreventa', idPreventa);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmPreVentaDetalleDevuelveTodosItems?area=Farmacia",
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

    async ConsultarStockProductoPorFarmacia(idAlmacen, idProducto) { // JDELGADOPM
        let formData = new FormData()

        formData.append('idAlmacen', idAlmacen)
        formData.append('idProducto', idProducto)


        let res = await HttpClient.Post(`/Utilitario/ConsultarStockProductoPorFarmacia`, formData)
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            Cargando(0)
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            Cargando(0)
            return false
        }

        console.log('res', res)

        data = res.data

        return data

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
        Ventas.IniciarFechasBusqueda();
    },

    async LimpiarFormularioVariables() {
        Ventas.esUnidosisLaFarmacia = 0
        Ventas.idMedicoPrescribe = 0
        Ventas.fechaPrescripcion = 0
        Ventas.horaPrescripcion = 0
        Ventas.idRecetaProcesada = 0

        Ventas.MovNumero = ''
        Ventas.DocumentoNumero = ''
        Ventas.TipoAccion = 0
        Ventas.RecetaBusqueda = 0
        Ventas.IdPreventa = 0

        Ventas.IdEstadoMovimiento = 0

        Ventas.oDoFarmMovimientoVentas = {
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
            FechaCreacion: '',
            PresExternoCmp: '',
            PresExternoMedico: '',
            PresExternoFecha: '',
            NroFormato: ''
        }

        Ventas.oDoPreventa = {
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
            PresExternoCmp: '',
            PresExternoMedico: '',
            PresExternoFecha: '',
            NroFormato: ''
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
        $('#txtObservacionesRegistro').val('')
        $('#cboServicioRegistro').val(0)
        $('#cboTipoFinanciamiento').val(0)
        $('#txtDescripcionPlan').val('')
        $('#txtNroReceta').val('')
        $('#txtNroDocumentoPaciente').val('')

        $('#chkConsumoHistorico').prop('checked', false)
        $("#ContentConsumoHistorico").hide();
        $('#chkIafaNoCubre').prop('checked', false)

        $("#txtNroFormato").val("");

        ObjtableDiagnosticos.fnClearTable();

        oTable_DetalleVentas.fnClearTable()
        oTable_ConsumoHistorico.fnClearTable()

        let lugarTrabaja = await Ventas.EmpleadosLaboraLugarSeleccionar($('#hdIdUsuario').val())

        if (!isEmpty(lugarTrabaja)) {
            lugarTrabaja = lugarTrabaja.filter(obj => obj.idLaboraArea == 1 && obj.idLaboraSubArea != 2 && obj.idLaboraSubArea != 11)
            if (lugarTrabaja.length > 0) {
                $('#cboFarmaciaVenta option').prop('disabled', true);
                for (const obj of lugarTrabaja) {
                    $('#cboFarmaciaVenta option[value="' + obj.idLaboraSubArea + '"]').removeAttr('disabled');
                    //console.log("ID Área:", obj.idLaboraArea);
                    //console.log("ID SubÁrea:", obj.idLaboraSubArea);
                }
                $('#cboFarmaciaVenta').val(lugarTrabaja[0].idLaboraSubArea)
                //$('#cboFarmaciaVenta').attr("disabled", true);
            }
        }


        await Ventas.FarmaciaDestinoNI_Change();


        //for (objLugarTrabaja of lugarTrabaja) {

        //}


        console.log('lugarTrabaja', lugarTrabaja)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async BuscarNumeroReceta(idReceta) {
        if (isEmpty(idReceta)) {
            return false
        }

        if (Ventas.RecetaBusqueda == 1) {
            Ventas.RecetaBusqueda = 0

        }

        Ventas.RecetaBusqueda = 1

        Cargando(1)

        let cabceraDetalle = await Ventas.RecetaCabeceraDetalleSeleccionaPorNroReceta(idReceta)
        //console.log(cabceraDetalle);
        if (isEmpty(cabceraDetalle)) {
            //swal({
            //    title: 'Agregar Ventas',
            //    html: `El Numero de Receta no existe`,
            //    type: 'warning',
            //    showCancelButton: false,
            //    confirmButtonColor: '#4fb7fe',
            //    cancelButtonColor: '#EF6F6C',
            //    confirmButtonText: 'Aceptar'
            //})

            alerta2('warning', 'Agregar Ventas', 'El Numero de Receta no existe')
            Cargando(0)
            return false
        }



        if (cabceraDetalle.length > 0) {
            if (cabceraDetalle[0].idEstadoAtencion != 1) {
                alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
                Cargando(0)
                return;
            }

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
                    //return;
                }
            }

            if (cabceraDetalle[0].esRecetaIntervencionSanitaria == 1) {
                alerta2("info", "", "Es una RECETA de INTERVENCIÓN SANITARIA.<br>No es posible despachar.");
                Cargando(0)
                //return;
            }
            //---------------------------------------------------------------------------

            await Ventas.CargarDatosVentas(cabceraDetalle[0].idCuentaAtencion)
        } else {
            //swal({
            //    title: 'Agregar Ventas',
            //    html: `El Numero de Receta no existe`,
            //    type: 'warning',
            //    showCancelButton: false,
            //    confirmButtonColor: '#4fb7fe',
            //    cancelButtonColor: '#EF6F6C',
            //    confirmButtonText: 'Aceptar'
            //})

            alerta2('warning', 'Agregar Ventas', `El Numero de Receta no existe`)
            Cargando(0)
            return false
        }
    },

    BuscarNumeroCuenta: async function (idCuentaAtencion) {

        try {

            ObjtableDiagnosticos.fnClearTable();


            $('#txtDatosDeCuenta').val("")
            $('#cboPrescriptor').val("")
            $('#txtNroHistoria').val("")
            $('#txtNroDocumentoPaciente').val("")
            $('#txtNombrePaciente').val("")
            $('#txtObservacionesRegistro').val("")
            $('#cboServicioRegistro').val("")
            $('#cboTipoFinanciamiento').val("")
            $('#txtDescripcionPlan').val("")
            $('.chzn-select').chosen().trigger("chosen:updated");

            let datosGenerales = await Ventas.AtencionesSelecionarPorCuenta(idCuentaAtencion)

            if (isEmpty(datosGenerales)) {
                return;
            }

            if (datosGenerales.idEstadoAtencion != 1) {
                alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
                return;
            }

            let lbGeneraPago = await Ventas.TiposFinanciamientoGeneraReciboPago(datosGenerales.idFormaPago)
            let FechaHora = await Utilitario.FechaHoraServidor();

            let tipoServ = lbGeneraPago == 1 && datosGenerales.idTipoServicio != 3 ? "CExt" : datosGenerales.idTipoServicio == 3 ? "Hosp" : "Emer"

            let filtro = ` (${datosGenerales.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            await Ventas.DevuelveServiciosDelHospitalFiltro(filtro)

            await Ventas.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(datosGenerales.idAtencion)


            if (lbGeneraPago == 1 && lbGeneraPago == 1 && datosGenerales.idTipoServicio != 3) {

                let cuentaPagante = await alertaAsync('question', 'Atención', `El N° de Cuenta es de ${datosGenerales.dTipoServicio} de un Paciente PAGANTE\n ¿Esta seguro de desapachar Medicamentos?`)

                if (cuentaPagante) {
                    $("#rdbPreventa").click();


                    $('#txtNroCuenta').val(idCuentaAtencion)
                    $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`)

                    if (Ventas.idMedicoPrescribe != 0) {
                        $('#cboPrescriptor').val(Ventas.idMedicoPrescribe)
                    } else {
                        $('#cboPrescriptor').val(datosGenerales.idMedicoIngreso)
                        $('#cboPrescriptor').val(0)
                    }

                    $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                    $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                    $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                    //$('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                    if (datosGenerales.idServicioEgreso > 0) {
                        $('#cboServicioRegistro').val(datosGenerales.idServicioEgreso)
                    } else {
                        $('#cboServicioRegistro').val(datosGenerales.idServicioIngreso)
                    }
                    $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                    $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)

                    if (Ventas.fechaPrescripcion != 0) {
                        $("#txtFechaPrescripcion").datepicker("setDate", Ventas.fechaPrescripcion);
                    } else {
                        $("#txtFechaPrescripcion").datepicker("setDate", FechaHora.substring(0, 10));
                    }

                    if (Ventas.horaPrescripcion != 0) {
                        $('#txtHoraPrescripcion').val(Ventas.horaPrescripcion)
                    } else {
                        $("#txtHoraPrescripcion").val(FechaHora.substring(11, 16));
                    }

                    if (Ventas.fechaPrescripcionExterno != 0) {
                        $("#txtFechaPrescripcionExterno").datepicker("setDate", Ventas.fechaPrescripcionExterno);
                    } else {
                        $("#txtFechaPrescripcionExterno").datepicker("setDate", FechaHora.substring(0, 10));
                    }

                    if (Ventas.horaPrescripcionExterno != 0) {
                        $('#txtHoraPrescripcionExt').val(Ventas.horaPrescripcionExterno)
                    } else {
                        $("#txtHoraPrescripcionExt").val(FechaHora.substring(11, 16));
                    }

                    $('#cboTipoReceta').val(1)
                    await Ventas.TipoReceta_Change();

                    Ventas.oDoPreventa = {
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
                        fechaHoraPrescribe: Ventas.fechaPrescripcion + ' ' + Ventas.horaPrescripcion,
                        idUsuarioAuditoria: 0,
                        PresExternoCmp: $('#txtCmpPrescriptorExterno').val(),
                        PresExternoMedico: $('#txtDatosMedicoExterno').val(),
                        PresExternoFecha: $('#txtFechaPrescripcionExterno').val() + ' ' + $('#txtHoraPrescripcionExt').val(),
                        NroFormato: $('#txtNroFormato').val(),
                    }


                    $('.chzn-select').chosen().trigger("chosen:updated");
                }

            } else {
                // Cuenta
                $('#txtNroCuenta').val(idCuentaAtencion);
                $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`);

                // Tipo de receta
                $('#cboTipoReceta').val(1);
                await Ventas.TipoReceta_Change();

                // Prescriptor
                const idPrescriptor = Ventas.idMedicoPrescribe || datosGenerales.idMedicoIngreso || 0;
                $('#cboPrescriptor').val(idPrescriptor);

                if (datosGenerales.idTipoServicio == 3) {
                    $('#cboPrescriptor').val(0);
                }

                // Datos del paciente
                $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica);
                $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento);
                $('#txtNombrePaciente').val(datosGenerales.nombresPaciente);

                // Servicio de registro
                const idServicio = datosGenerales.idServicioEgreso > 0
                    ? datosGenerales.idServicioEgreso
                    : datosGenerales.idServicioIngreso;
                $('#cboServicioRegistro').val(idServicio);

                // Financiamiento
                $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago);
                $('#txtDescripcionPlan').val(`IAFA Act.: ${datosGenerales.dFuenteFinanciamiento}`);

                // Fecha y hora de prescripción
                const fechaActual = FechaHora.substring(0, 10);
                const horaActual = FechaHora.substring(11, 16);

                $("#txtFechaPrescripcion").datepicker("setDate", Ventas.fechaPrescripcion || fechaActual);
                $("#txtHoraPrescripcion").val(Ventas.horaPrescripcion || horaActual);

                $("#txtFechaPrescripcionExterno").datepicker("setDate", Ventas.fechaPrescripcionExterno || fechaActual);
                $("#txtHoraPrescripcionExt").val(Ventas.horaPrescripcionExterno || horaActual);

                // Actualizar selects con Chosen
                $('.chzn-select').trigger("chosen:updated");

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
            let datosGenerales = await Ventas.AtencionesSelecionarPorCuenta(idCuentaAtencion)

            let lbGeneraPago = await Ventas.TiposFinanciamientoGeneraReciboPago(datosGenerales.idFormaPago)
            let tipoServ = lbGeneraPago == 1 && datosGenerales.idTipoServicio != 3 ? "CExt" : datosGenerales.idTipoServicio == 3 ? "Hosp" : "Emer"

            let mensaje = ``

            let filtro = ` (${datosGenerales.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            await Ventas.DevuelveServiciosDelHospitalFiltro(filtro)

            await Ventas.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(datosGenerales.idAtencion)




            let cabceraDetalle = await Ventas.RecetaCabeceraDetalleSeleccionaPorNroReceta($('#txtNroReceta').val())

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
                    mensaje = `La receta fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion} <br>Nº Movimiento: ${cabceraDetalle[0].documentoDespacho}`
                } else {

                    let relacionOrdenPago = await Ventas.FarmRecetaRelacionOrdenPagoBuscar($('#txtNroReceta').val()) // verificar para pagantes

                    if (lbGeneraPago == 1) {
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

            if (lbGeneraPago == 1 && lbGeneraPago == 1 && datosGenerales.idTipoServicio != 3) {
                swal({
                    title: 'Atenciones',
                    text: `El N° de Cuenta es de ${datosGenerales.dTipoServicio} de un Paciente PAGANTE\n ¿Esta seguro de desapachar Medicamentos?`,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: true
                })
                    .then(async (res) => {
                        $("#rdbPreventa").click();

                        if (res) {
                            let fuenteFinanciamiento = await Ventas.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                            await this.CargarDatosReceta()

                            $('#txtNroCuenta').val(idCuentaAtencion)
                            $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`)

                            $('#cboTipoReceta').val(1)
                            await Ventas.TipoReceta_Change();

                            $('#cboPrescriptor').val(Ventas.idMedicoPrescribe)

                            $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                            $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                            $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                            if (datosGenerales.idServicioEgreso > 0) {
                                $('#cboServicioRegistro').val(datosGenerales.idServicioEgreso)
                            } else {
                                $('#cboServicioRegistro').val(datosGenerales.idServicioIngreso)
                            }
                            $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                            $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)
                            $("#txtFechaPrescripcion").datepicker("setDate", Ventas.fechaPrescripcion);
                            $('#txtHoraPrescripcion').val(Ventas.horaPrescripcion)


                            Ventas.oDoFarmMovimientoVentas.IdPaciente = datosGenerales.idPaciente
                            Ventas.oDoFarmMovimientoVentas.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                            Ventas.oDoFarmMovimientoVentas.IdTipoFinanciamiento = datosGenerales.idFormaPago
                            Ventas.oDoFarmMovimientoVentas.idServicioPaciente = $('#cboServicioRegistro').val()

                            Ventas.oDoPreventa = {
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
                                fechaHoraPrescribe: Ventas.fechaPrescripcion + ' ' + Ventas.horaPrescripcion,
                                idUsuarioAuditoria: 0,
                                PresExternoCmp: $('#txtCmpPrescriptorExterno').val(),
                                PresExternoMedico: $('#txtDatosMedicoExterno').val(),
                                PresExternoFecha: $('#txtFechaPrescripcionExterno').val() + ' ' + $('#txtHoraPrescripcionExt').val(),
                                NroFormato: $('#txtNroFormato').val(),
                            }

                            $('.chzn-select').chosen().trigger("chosen:updated");
                        }
                    })
            } else {

                console.log('entra')

                let fuenteFinanciamiento = await Ventas.FuentesFinanciamientoSeleccionarPorId(datosGenerales.idFuenteFinanciamiento)

                await this.CargarDatosReceta()

                $('#txtNroCuenta').val(idCuentaAtencion)
                $('#txtDatosDeCuenta').val(`F.Ing: ${datosGenerales.fechaIngresoFormat} (${tipoServ}) (Est: ${datosGenerales.estadoCta}) (${datosGenerales.dServicioActual})`)
                $('#cboPrescriptor').val(Ventas.idMedicoPrescribe)

                $('#txtNroHistoria').val(datosGenerales.nroHistoriaClinica)
                $('#txtNroDocumentoPaciente').val(datosGenerales.nroDocumento)
                $('#txtNombrePaciente').val(datosGenerales.nombresPaciente)

                if (datosGenerales.idServicioEgreso > 0) {
                    $('#cboServicioRegistro').val(datosGenerales.idServicioEgreso)
                } else {
                    $('#cboServicioRegistro').val(datosGenerales.idServicioIngreso)
                }
                $('#cboTipoFinanciamiento').val(datosGenerales.idFormaPago)
                $('#txtDescripcionPlan').val('IAFA Act.: ' + datosGenerales.dFuenteFinanciamiento)
                $("#txtFechaPrescripcion").datepicker("setDate", Ventas.fechaPrescripcion);
                $('#txtHoraPrescripcion').val(Ventas.horaPrescripcion)

                Ventas.oDoFarmMovimientoVentas.IdPaciente = datosGenerales.idPaciente
                Ventas.oDoFarmMovimientoVentas.idFuenteFinanciamiento = datosGenerales.idFuenteFinanciamiento
                Ventas.oDoFarmMovimientoVentas.IdTipoFinanciamiento = datosGenerales.idFormaPago

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
        let cabceraDetalle = await Ventas.RecetaCabeceraDetalleSeleccionaPorNroReceta($('#txtNroReceta').val())


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

            let lbGeneraPago = await Ventas.TiposFinanciamientoGeneraReciboPago(cabceraDetalle[0].idFormaPago)


            if (cabceraDetalle[0].idEstado == 2) { // Despachada

                let mensaje = ``

                if ((isEmpty(cabceraDetalle[0].idComprobantePago) || cabceraDetalle[0].idComprobantePago == 0) && !isEmpty(cabceraDetalle[0].documentoDespacho)) {
                    mensaje = `La receta fue ATENDIDA <br> N° Cuenta: ${cabceraDetalle[0].idCuentaAtencion}`
                } else {

                    let relacionOrdenPago = await Ventas.FarmRecetaRelacionOrdenPagoBuscar($('#txtNroReceta').val()) // verificar para pagantes

                    if (lbGeneraPago == 1) {

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

            Ventas.idMedicoPrescribe = cabceraDetalle[0].idMedicoReceta
            Ventas.fechaPrescripcion = cabceraDetalle[0].fechaPrescripcion
            Ventas.horaPrescripcion = cabceraDetalle[0].horaPrescripcion
            Ventas.idRecetaProcesada = $('#txtNroReceta').val()

            Ventas.oDoPreventa.fechaHoraPrescribe = Ventas.fechaPrescripcion + ' ' + Ventas.horaPrescripcion

            let datosGenerales = await Ventas.AtencionesSelecionarPorCuenta(cabceraDetalle[0].idCuentaAtencion)

            if (isEmpty(datosGenerales)) {
                if (lbGeneraPago == 1) {
                    $('input[name="rdbTipoVenta"][value="2"]').prop('checked', 1) // Preventa
                    //$('input[name="rdbTipoVenta"][value="2"]').click()
                    await Ventas.TipoVenta_Change(2);
                    $('#cboTipoReceta').val(1)
                    await Ventas.TipoReceta_Change();
                } else {
                    $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1) // Venta
                    //$('input[name="rdbTipoVenta"][value="1"]').click()
                    await Ventas.TipoVenta_Change(1);
                }
            } else {
                if (lbGeneraPago == 1 && lbGeneraPago == 1 && datosGenerales.idTipoServicio != 3) {
                    $('input[name="rdbTipoVenta"][value="2"]').prop('checked', 1) // Preventa
                    //$('input[name="rdbTipoVenta"][value="2"]').click()
                    await Ventas.TipoVenta_Change(2);
                    $('#cboTipoReceta').val(1)
                    await Ventas.TipoReceta_Change();
                } else {
                    $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1) // Venta
                    //$('input[name="rdbTipoVenta"][value="1"]').click()
                    await Ventas.TipoVenta_Change(1);
                }
            }



            let totalDetalle = 0
            oTable_DetalleVentas.fnClearTable()

            for (let objCabceraDetalle of cabceraDetalle) {
                // modificando
                let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciaVenta').val(), objCabceraDetalle.idItem, 1)

                if (!isEmpty(saldoAlmacen)) {
                    let items = {
                        idItem: objCabceraDetalle.idItem,
                        codigo: objCabceraDetalle.codigo,
                        producto: objCabceraDetalle.nombre,
                        saldo: saldoAlmacen.cantidad,
                        cantidadPedida: objCabceraDetalle.cantidadPedida,
                        prVenta: objCabceraDetalle.precio,
                        total: Ventas.customRoundToTwoDecimals((parseFloat(objCabceraDetalle.cantidadPedida) * parseFloat(objCabceraDetalle.precio.toFixed(3))).toFixed(2)),

                        tipo: saldoAlmacen.idTipoSalidaBienInsumo == 1 ? 'Venta' : 'IntervensionSanitaria',
                        lote: 1,
                        fechaVencimiento: 1,
                        idTipoSalidaBienInsumoSaldo: saldoAlmacen.idTipoSalidaBienInsumo,
                        fechaVencimientoFormat: 1,
                        tipoPsicotropico: objCabceraDetalle.tipoPsicotropico,

                    }

                    if (Ventas.ExisteProducto(objCabceraDetalle.idProducto)) {
                        alerta(2, 'El producto ya fue agregado')
                        return false
                    }

                    totalDetalle = totalDetalle + parseFloat(items.total)

                    oTable_DetalleVentas.fnAddData(items)
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

        if (Ventas.TipoAccion != 'A') {



            $('input[name="rdbTipoVenta"][value="1"]').prop('checked', 1) // Preventa
            //$('input[name="rdbTipoVenta"][value="1"]').click()

            await Ventas.TipoVenta_Change(1);


            let farmMovimiento = await Ventas.FarmMovimientoSeleccionar(movNumero, 'S')
            let farmMovimientoVentas = await Ventas.FarmMovimientoVentasSeleccionarPorId(movNumero, 'S')

            let atencionCuenta = await Ventas.AtencionesSelecionarPorCuenta(farmMovimientoVentas.idCuentaAtencion)

            let farmMovimientoDetalle = await Ventas.FarmMovimientoDetalleSeleccionar(movNumero, 'S')

            let tipoServ = '';
            let filtro = '';

            if (isEmpty(atencionCuenta) == false) {
                tipoServ = atencionCuenta.idTipoServicio == 1 ? "CExt" : atencionCuenta.idTipoServicio == 3 ? "Hosp" : "Emer"
                filtro = ` (${atencionCuenta.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
            }

            await Ventas.DevuelveServiciosDelHospitalFiltro(filtro)

            ObjtableDiagnosticos.fnClearTable();

            if (isEmpty(atencionCuenta) == false) {
                await Ventas.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(atencionCuenta.idAtencion)
            }

            Ventas.MovNumero = farmMovimiento.movNumero
            Ventas.DocumentoNumero = farmMovimiento.documentoNumero
            Ventas.IdPreventa = farmMovimientoVentas.idPreVenta


            $('#txtNroDocumentoVenta').val(farmMovimiento.documentoNumero)
            $('#txtNroPreventa').val(farmMovimientoVentas.idPreVenta)
            $('#txtFechaRegistro').val(farmMovimiento.fechaCreacionFormat)
            $('#txtHoraRegistro').val(farmMovimiento.horaCreacionFormat)
            $('#txtEstadoVenta').val(farmMovimiento.estadoMovimiento)
            $('#cboTipoReceta').val(farmMovimientoVentas.idTipoReceta)
            await Ventas.TipoReceta_Change();
            $('#cboPrescriptor').val(farmMovimientoVentas.idPrescriptor)
            $('#cboFarmaciaVenta').val(farmMovimiento.idAlmacenOrigen)

            $('#txtNroCuenta').val(farmMovimientoVentas.idCuentaAtencion)
            if (isEmpty(atencionCuenta) == false) {
                $('#txtDatosDeCuenta').val(`F.Ing: ${atencionCuenta.fechaIngresoFormat} (${tipoServ}) (Est: ${atencionCuenta.estadoCta}) (${atencionCuenta.dServicioActual})`)
            } else {
                $('#txtDatosDeCuenta').val('')
            }

            $('#txtFechaPrescripcion').val(farmMovimientoVentas.fechaPrescribeFormat)
            $('#txtHoraPrescripcion').val(farmMovimientoVentas.horaPrescribeFormat)


            $('#txtObservacionesRegistro').val(farmMovimientoVentas.observaciones)

            if (isEmpty(atencionCuenta) == false) {
                $('#txtNroHistoria').val(atencionCuenta.nroHistoriaClinica)
                $('#txtNombrePaciente').val(atencionCuenta.nombresPaciente)
                $('#cboTipoFinanciamiento').val(atencionCuenta.idFormaPago)
                $('#txtDescripcionPlan').val('IAFA Act.: ' + atencionCuenta.dFuenteFinanciamiento)
            } else {
                $('#txtNroHistoria').val('')
                $('#txtNroDocumentoPaciente').val(farmMovimientoVentas.dni)
                $('#txtNombrePaciente').val(farmMovimientoVentas.paciente)
                $('#cboTipoFinanciamiento').val(farmMovimientoVentas.idTipoFinanciamiento)
                $('#txtDescripcionPlan').val('')
            }

            $('#cboServicioRegistro').val(farmMovimientoVentas.idServicioPaciente)


            $('#txtCmpPrescriptorExterno').val(farmMovimientoVentas.presExternoCmp)
            $('#txtDatosMedicoExterno').val(farmMovimientoVentas.presExternoMedico)
            $('#txtFechaPrescripcionExterno').val(farmMovimientoVentas.presExternoFechaFormat)
            $('#txtHoraPrescripcionExt').val(farmMovimientoVentas.presExternoHoraFormat)

            $('#txtNroFormato').val(farmMovimientoVentas.nroFormato)

            $('.chzn-select').chosen().trigger("chosen:updated");




            oTable_DetalleVentas.fnClearTable()

            let movimientoDetallado = []

            if (!isEmpty(farmMovimientoDetalle)) {
                for (let objCabceraDetalle of farmMovimientoDetalle) {

                    let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciasBusq').val(), objCabceraDetalle.idProducto, 1)

                    if (!isEmpty(saldoAlmacen)) {
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

                }
            }

            let movimientoDetalladoAcumulado = combineProductsDetalleVenta(movimientoDetallado)

            if (movimientoDetalladoAcumulado.length > 0) {
                oTable_DetalleVentas.fnAddData(movimientoDetalladoAcumulado);

                oTable_DetalleVentas.$('tr').each(function () {
                    let data = oTable_DetalleVentas.fnGetData(this);

                    data.saldo += data.cantidadPedida

                    //data.total += objCabceraDetalle.total;
                    data.prVenta = (data.total / data.cantidadPedida).toFixed(4); // Recalcula el precio unitario promedio
                    //data.prVenta = (data.total / data.cantidadPedida).toFixed(3); // Recalcula el precio unitario promedio

                    inputCantidad = '  <input id="txtCant_idItem_' + data.idItem + '" value="' + data.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'

                    data.cantidadPedida = inputCantidad

                    // Actualizar la fila en la tabla
                    oTable_DetalleVentas.fnUpdate(data, this);

                    existe = true;
                });

            }

            let detalleVentas = oTable_DetalleVentas.api().data().toArray()
            let totalDetalle = 0
            for (let obj of detalleVentas) {
                totalDetalle = totalDetalle + parseFloat(obj.total)
            }
            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));


            $('#btnGuardarVentas').removeClass('btn btn-primary');
            $('#btnGuardarVentas').removeClass('btn btn-danger');

            if (Ventas.TipoAccion == 'E') {
                $('#btnGuardarVentas').text('Eliminar')
                $('#btnGuardarVentas').addClass('btn btn-danger')
            }

            if (Ventas.TipoAccion == 'M') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }

            if (Ventas.TipoAccion == 'C') {
                $('#btnGuardarVentas').hide()
            }

            if (farmMovimientoVentas.idPreVenta > 0) {
                $('#btnGuardarVentas').hide()
            }
        } else {
            if (Ventas.TipoAccion == 'A') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }
        }
    },

    async CargarDatosPreventa(idPreventa, idEstado) {
        $('#contProductosBusqueda').hide()
        $('#btnGuardarVentas').show()

        if (Ventas.TipoAccion != 'A') {

            let preVenta = await Ventas.FarmPreVentaSeleccionarPorId(idPreventa)

            let farmMovimientoDetalle = await Ventas.FarmPreVentaDetalleDevuelveTodosItems(idPreventa)

            let atencionCuenta = await Ventas.AtencionesSelecionarPorCuenta(preVenta.idCuentaAtencion)

            ObjtableDiagnosticos.fnClearTable();

            //await Ventas.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(atencionCuenta.idAtencion)          

            $('input[name="rdbTipoVenta"][value="2"]').prop('checked', 1) // Preventa
            ////$('input[name="rdbTipoVenta"][value="2"]').click()

            await Ventas.TipoVenta_Change(2);


            let tipoServ = ''

            if (!isEmpty(atencionCuenta)) {
                await Ventas.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(atencionCuenta.idAtencion)

                tipoServ = atencionCuenta.idTipoServicio == 1 ? "CExt" : atencionCuenta.idTipoServicio == 3 ? "Hosp" : "Emer"

                let filtro = ` (${atencionCuenta.idTipoServicio}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
                await Ventas.DevuelveServiciosDelHospitalFiltro(filtro)

                $('#txtDatosDeCuenta').val(`F.Ing: ${atencionCuenta.fechaIngresoFormat} (${tipoServ}) (Est: ${atencionCuenta.estadoCta}) (${atencionCuenta.dServicioActual})`)
                $('#txtNroHistoria').val(atencionCuenta.nroHistoriaClinica)
                $('#txtNombrePaciente').val(atencionCuenta.nombresPaciente)
                $('#cboServicioRegistro').val(atencionCuenta.idServicioIngreso)
                $('#cboTipoFinanciamiento').val(atencionCuenta.idFormaPago)
                $('#txtDescripcionPlan').val('IAFA Act.: ' + atencionCuenta.dFuenteFinanciamiento)
            } else {
                $('#txtNroDocumentoPaciente').val(preVenta.dni)
                $('#txtNombrePaciente').val(preVenta.paciente)
            }


            Ventas.oDoPreventa = {
                idAlmacen: preVenta.idAlmacen,
                idPreventa: preVenta.idPreventa,
                idVendedor: preVenta.idVendedor,
                idPaciente: preVenta.idPaciente,
                idTipoFinanciamiento: preVenta.idTipoFinanciamiento,
                total: preVenta.total,
                idDiagnostico: preVenta.idDiagnostico,
                idTipoReceta: preVenta.idTipoReceta,
                idcuentaAtencion: preVenta.idCuentaAtencion,
                idPrescriptor: preVenta.idPrescriptor,
                fechaCreacion: preVenta.fechaCreacion,
                horaCreacion: preVenta.horaCreacion,
                idUsuario: preVenta.idUsuario,
                fechaModificacion: preVenta.fechaModificacion,
                idUsuarioModifica: preVenta.idUsuarioModifica,
                idEstadoPreventa: idEstado,
                fechaHoraPrescribe: preVenta.fechaHoraPrescribe,
                idUsuarioAuditoria: preVenta.idUsuarioAuditoria,
                PresExternoCmp: preVenta.presExternoCmp,
                PresExternoMedico: preVenta.presExternoMedico,
                PresExternoFecha: preVenta.presExternoFecha,
                NroFormato: preVenta.nroFormato
            }

            $('#txtNroDocumentoVenta').val('')
            $('#txtNroPreventa').val(preVenta.idPreventa)
            $('#txtFechaRegistro').val(preVenta.fechaCreacionFormat)
            $('#txtHoraRegistro').val(preVenta.horaCreacionFormat)
            $('#txtEstadoVenta').val(preVenta.estadoPreventa)
            $('#cboTipoReceta').val(preVenta.idTipoReceta)
            await Ventas.TipoReceta_Change();
            $('#cboPrescriptor').val(preVenta.idPrescriptor)
            $('#cboFarmaciaVenta').val(preVenta.idAlmacen)

            $('#txtObservacionesRegistro').val(preVenta.observaciones)

            $('#txtNroCuenta').val(preVenta.idCuentaAtencion)

            $('#txtFechaPrescripcion').val(preVenta.fechaPrescribeFormat)
            $('#txtHoraPrescripcion').val(preVenta.horaPrescribeFormat)

            $('#txtCmpPrescriptorExterno').val(preVenta.presExternoCmp)
            $('#txtDatosMedicoExterno').val(preVenta.presExternoMedico)
            $('#txtFechaPrescripcionExterno').val(preVenta.presExternoFechaFormat)
            $('#txtHoraPrescripcionExt').val(preVenta.presExternoHoraFormat)

            $('#txtNroFormato').val(preVenta.nroFormato)

            $('.chzn-select').chosen().trigger("chosen:updated")

            oTable_DetalleVentas.fnClearTable()

            for (let objCabceraDetalle of farmMovimientoDetalle) {

                let saldoAlmacen = await Ventas.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida($('#cboFarmaciasBusq').val(), objCabceraDetalle.idProducto, 1)

                let items = {
                    idItem: objCabceraDetalle.idProducto,
                    codigo: objCabceraDetalle.codigo,
                    producto: objCabceraDetalle.nombre,
                    saldo: saldoAlmacen.cantidad,
                    cantidadPedida: objCabceraDetalle.cantidad,
                    prVenta: objCabceraDetalle.precio,
                    //total: objCabceraDetalle.importe,
                    total: parseFloat(objCabceraDetalle.importe.toFixed(1)),

                    tipo: saldoAlmacen.idTipoSalidaBienInsumo == 1 ? 'Venta' : 'IntervensionSanitaria',
                    lote: 1,
                    fechaVencimiento: 1,
                    idTipoSalidaBienInsumoSaldo: saldoAlmacen.idTipoSalidaBienInsumo,
                    fechaVencimientoFormat: 1,
                    tipoPsicotropico: objCabceraDetalle.tipoPsicotropico,
                }

                if (Ventas.ExisteProducto(objCabceraDetalle.idProducto)) {
                    alerta(2, 'El producto ya fue agregado')
                    return false
                }

                oTable_DetalleVentas.fnAddData(items)
            }

            let detalleVentas = oTable_DetalleVentas.api().data().toArray();
            let totalDetalle = 0;
            for (let obj of detalleVentas) {
                totalDetalle = totalDetalle + parseFloat(obj.total);
            }
            $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));

            $('#btnGuardarVentas').removeClass('btn btn-primary');
            $('#btnGuardarVentas').removeClass('btn btn-danger');

            if (Ventas.TipoAccion == 'E') {
                $('#btnGuardarVentas').text('Eliminar')
                $('#btnGuardarVentas').addClass('btn btn-danger')
            }

            if (Ventas.TipoAccion == 'M') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }

            if (Ventas.TipoAccion == 'C') {
                $('#btnGuardarVentas').hide()
            }

            $('.chzn-select').chosen().trigger("chosen:updated");
        } else {
            if (Ventas.TipoAccion == 'A') {
                $('#btnGuardarVentas').text('Guardar')
                $('#btnGuardarVentas').addClass('btn btn-primary')
            }
        }


    },
    async listaCabPaquetes() {
        let midata = new FormData();
        let resp = false;

        midata.append('tipo', 0);
        midata.append('descripcion', "");

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Catalogo/FactCatalogoPaqueteXtipoPaquete?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            $('#cboPaquetes').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboPaquetes').append('<option  value="' + obj.idFactPaquete + '">' + obj.descripcion + '</option>');
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
            $("#cboPaquetes").change();
            resp = true;
        } catch (error) {
            resp = false;
            alerta("ERROR", "Error listar paquetes!", "2");
        }

        return resp;
    },

    QuitarProducto() {
        oTable_DetalleVentas.api(true).row('.selected').remove().draw(false);
        oTable_DetalleVentas.resize();
        Ventas.ActualizarCorrelativoDetalleVentas();

        let detalleVentas = oTable_DetalleVentas.api().data().toArray()
        let totalDetalle = 0
        for (let obj of detalleVentas) {
            totalDetalle = totalDetalle + parseFloat(obj.total)
        }

        $('#TotalDetalleVentas').text(parseFloat(totalDetalle).toFixed(1));
    },

    ActualizarCorrelativoDetalleVentas() {
        $('#tblDetalleVentas tbody tr').each(function (index) {
            $(this).find("td:first").text(index + 1);
        });
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

    async asignaPrecio(idproducto, idpuntoCarga, idTipoFinanciamiento) {
        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idproducto);
        midata.append('idpuntoCarga', idpuntoCarga);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);

        await $.ajax({
            method: "POST",
            url: "/Catalogo/ProductoByIdByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,

            success: function (datos) {
                if (datos.session) {
                    if (datos.listaCatalogo.table.length > 0) {
                        precio = datos.listaCatalogo.table[0]["precioUnitario"]
                    }
                    else {
                        precio = 0
                    }
                }
                else {
                    Alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error asigna precio!", "2");
                    return 0
                }, 900)
            }
        });

        return precio;
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
            combined[key].precio = Math.min(combined[key].precio, product.precio); // Recalcular precio totalbtnImprimeInforme 
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

const Historial = {
    async Iniciar() {
        //Historial.Plugins();
        //Historial.DataTableBusqueda();
        //Historial.DataTableDetalleVentas();
        //Historial.DataTableProductosBuscados();
        //Historial.DataTableBusquedaPacientes();
        //Historial.DataTableAtencionesPacientes();
        //Historial.DataTableConsumoHistorico();
        //Historial.DataTableDiagnosticos();
        //Historial.initDatablesPaquetes();
        Historial.Eventos();
        Historial.DataTableBusquedaRecetas();
        //Historial.LLenarCombos();
        //Historial.ValidarLugarDondeTrabaja();

        //BusqRecetasPacientes.idPuntoCarga = 5;
        //BusqRecetasPacientes.esIntervencionSanitaria = 0;
    },

    Eventos() {
        $('#btnHistorial').on('click', async function () {
            const resp = await Historial.listaRecetas();
            if (resp) {
                $('#modalHistorial').modal('show');
            }
        })
        $('#btnCerrarHistorial').on('click', function () {
            $('#modalHistorial').modal('hide');
        })
        $('#tblHistorialRecetasPacientes tbody').on('click', '.ImprimirBusquedaRecetaSF', async function () {
            var objrow = oTable_HistorialRecetasPacientes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_HistorialRecetasPacientes.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
                //$('#tblOrdenesMedicas tbody tr').removeClass('selected');
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });        
    },

    async listaRecetas() {
        let resp = false;
        let recetas = null;
        let midata = new FormData();
        midata.append('NroHistoriaClinica', $('#txtNroHistoria').val());        

        try {
            Cargando(1);
            oTable_HistorialRecetasPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/RecetasFiltrarPorRangoFechas?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
                if (datos.lstData.table.length > 0) {
                    recetas = datos.lstData.table;
                    if (BusqRecetasPacientes.esIntervencionSanitaria == 1) {
                        recetas = recetas.filter(function (obj) {
                            return obj.esRecetaIntervencionSanitaria == 1;
                        });
                    } else {
                        recetas = recetas.filter(function (obj) {
                            return obj.esRecetaIntervencionSanitaria == 0;
                        });
                    }

                    if (recetas.length > 0) {
                        oTable_HistorialRecetasPacientes.fnAddData(recetas);
                        oTable_HistorialRecetasPacientes.resize();
                    }
                    
                    //resp = datos.lstData.table[0];
                }
            resp = true;
        } catch (error) {
            resp = false;
            alerta("ERROR", "Error listar paquetes!", "2");
        }

        return resp;
    },

    DataTableBusquedaRecetas() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    width: '6%',
                    targets: 0,
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    width: '8%',
                    targets: 7,
                    data: "fechaReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '4%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            let btnRuta = "";
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirBusquedaRecetaCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirBusquedaRecetaSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                },
            ]
        }
        var tableWrapper = $('#tblHistorialRecetasPacientes');
        oTable_HistorialRecetasPacientes = $("#tblHistorialRecetasPacientes").dataTable(parms);
        $('#tblHistorialRecetasPacientes_length').css('display', 'none');
    },    

}

$(document).ready(function () {
    Historial.Iniciar()
    Ventas.Iniciar()
    BusqRecetasPacientes.Iniciar();
});