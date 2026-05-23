var NotaSalida = {

    FarmUnidosis: [],
    TotalUnidosis: 0,

    TipoAccion: '',
    MovNumero: '',
    IdEstadoMovimiento: 0,
    Guardando: 0,


    oRsRecetasAdespachar: [],
    oRsDespacho: [],
    //////////////////////////////CONFIGURACIONES INICIALES///////////////////////////////////////////
    Iniciar() {
        NotaSalida.Plugins();
        NotaSalida.DataTableBusqueda();
        NotaSalida.DataTableDetalleNotaSalida();
        NotaSalida.DataTableProductosBuscados();

        NotaSalida.Eventos();
        NotaSalida.LLenarCombos();
    },

    Plugins() {
        $('#txtFechaInicioBusq, #txtFechaFinalBusq').datepicker({
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


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';


        $("#txtFechaInicioBusq, #txtFechaFinalBusq, #txtFechaRegistroNotaSalida").mask("Dd/Mm/abcd");
        $("#txtHoraRegistroNotaSalida").mask("Hn:Nn");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimiento").mask("Hn:Nn");
        //$("#txtHoraClampaje").mask("Hn:Nn");

        NotaSalida.IniciarFechasBusqueda();

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

    IniciarDatosRegistro() {
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        //FechaPrimerDiaDelMes = "01" + "/" + mes + "/" + f.getFullYear();
        FechaHoy = dia + "/" + mes + "/" + f.getFullYear();

        let time = f.getHours() + ":" + (f.getMinutes() < 10 ? ("0" + f.getMinutes()) : f.getMinutes())

        $("#txtFechaRegistroNotaSalida").datepicker("setDate", FechaHoy);
        $("#txtHoraRegistroNotaSalida").val(time);
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
                    data: "idReserva",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movNumero",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movTipo",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "abreviatura",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "documentoNumero",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacionMovimiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
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
                    data: "concepto",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "total",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idUsuario",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {

                        $(td).attr('align', 'left')

                        var btnImprimeSinF = "";

                        btnImprimeSinF = '<button class="btnImprimeInforme btn btn-sm btn-warning glow_button" title="Visualiza Informe" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                        if (rowData.movNumero != null) {
                            $(td).html(btnImprimeSinF);
                        } else { $(td).html(''); }


                      
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NotasSalida = $("#tblNotasSalida").dataTable(parms);
    },
    DataTableDetalleNotaSalida() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
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
                    width: '5%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 3,
                    visible: false,
                    data: "idTipoSalidaBienInsumo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "lote",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "fechaVencimientoFormat",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_idItem_' + rowData.idProducto + '_' + row + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero txtCantidadPedida">'
                        $(td).html(inputCantidad);

                    }
                },
                //RQ0003 RMOREANO
                {
                    width: '5%',
                    targets: 9,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    visible: true,
                    data: "registroSanitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputRegSanitario = '';
                        inputRegSanitario = '  <input id="txtRegistroSanitario_' + rowData.idProducto + '_' + row + '" value="' + rowData.registroSanitario + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        $(td).html(inputRegSanitario);

                    }
                }
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblDetalleNotaSalida'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_detalleNotaSalida = $("#tblDetalleNotaSalida").dataTable(parms);
        $('#tblDetalleNotaSalida_length').css('display', 'none');
    },

    DataTableProductosBuscados() {
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
                    width: '20%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
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
                    targets: 1,
                    data: "precio",
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

    ExisteProducto(idProducto, lote, tipo, fechaVencimientoFormat) {
        lstData = oTable_detalleNotaSalida.api(true).rows().data();

        for (var i = 0; i < lstData.length; i++) {
            if (lstData[i].idProducto == idProducto && lstData[i].lote == lote && lstData[i].tipo == tipo && lstData[i].fechaVencimientoFormat == fechaVencimientoFormat) {
                return true;
            }
        }

        return false;
    },


    async GuardarMovimientoFarmacia() {

        if (NotaSalida.Guardando == 0) {
            Cargando(1)
            NotaSalida.Guardando = 1

            try {

                let idTipoLocales = $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales");
                let tipoSuministro = $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro");

                let detalleProductos = oTable_detalleNotaSalida.api(true).data().toArray()
                let farmMovimientoDetalle = []
                $(detalleProductos).each(function (i, obj) {
                    console.log('obj', obj)

                    let cantProducto = $('#txtCant_idItem_' + obj.idProducto.toString() + '_' + i).val()
                    let registroSanitario = $('#txtRegistroSanitario_' + obj.idProducto.toString() + '_' + i).val()

                    farmMovimientoDetalle.push({

                        idProducto: obj.idProducto,
                        Lote: obj.lote, // validar
                        FechaVencimiento: obj.fechaVencimiento, // validar
                        idTipoSalidaBienInsumo: obj.idTipoSalidaBienInsumo, // validar
                        Item: i + 1,
                        Cantidad: cantProducto,
                        Precio: obj.precio,
                        Total: obj.total,
                        RegistroSanitario: registroSanitario,
                        DocumentoNumero: "",

                    })
                })

                if (NotaSalida.TipoAccion == 'E') {
                    NotaSalida.IdEstadoMovimiento = 0
                } else {
                    NotaSalida.IdEstadoMovimiento = 1
                }

                let res = await NotaSalida.CrearModificarNotaIngresoSalidaFarmacia(
                    MovNumero = NotaSalida.MovNumero, MovTipo = 'S', idEstadoMovimiento = NotaSalida.IdEstadoMovimiento, idTipoLocales = idTipoLocales,
                    idTipoSuministro = tipoSuministro, documentoIdTipo = $("#cboTipoDocRegistro").val(), idAlmacenOrigen = $('#cboFarmaciasRegistro').val(),
                    idAlmacenDestino = $('#cboDestinoRegistro').val(), IdTipoConceptoFarmacia = $('#cboConceptoRegistro').val(), Observaciones = $('#txtObservacionesRegistro').val(),
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

                if (NotaSalida.TipoAccion == 'E') {
                    textoAlerta = 'Se Anuló Nª ' + NuevoMovNumero + 'F'
                } else if (NotaSalida.TipoAccion == 'A') {
                    textoAlerta = "Se Agregó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                } else if (NotaSalida.TipoAccion == 'M') {
                    textoAlerta = "Se Modificó venta N° " + NuevoMovNumero
                    let url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=ConsultaExterna&MovNumero=" + NuevoMovNumero + "&MovTipo=" + 'S'
                    $('#ifrmInforme').attr('src', url);
                    $("#modalInforme").modal('show');
                }

                alerta2('success', 'Venta', textoAlerta)


                $('#cboFarmaciasBusq').val($('#cboFarmaciasRegistro').val())

                $('.chzn-select').chosen().trigger("chosen:updated");

                Cargando(0)
                MostrarAreaLista();

                $('#btnBuscar').trigger('click')

                NotaSalida.Guardando = 0

            } catch (error) {
                alerta(2, "Error al Guardar")
                console.error("Error al obtener saldos:", error);
                Cargando(0)
                NotaSalida.Guardando = 0
                return false
            }
        }
    },





    async ActualizarReserva(idEstadoReserva) {



            try {

                let idTipoLocales = $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales");
                let tipoSuministro = $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro");

                let detalleProductos = oTable_detalleNotaSalida.api(true).data().toArray()
                let farmMovimientoDetalle = []
                $(detalleProductos).each(function (i, obj) {
                    console.log('obj', obj)

                    let cantProducto = $('#txtCant_idItem_' + obj.idProducto.toString() + '_' + i).val()
                    let registroSanitario = $('#txtRegistroSanitario_' + obj.idProducto.toString() + '_' + i).val()

                    farmMovimientoDetalle.push({

                        idProducto: obj.idProducto,
                        Lote: obj.lote, // validar
                        FechaVencimiento: obj.fechaVencimiento, // validar
                        idTipoSalidaBienInsumo: obj.idTipoSalidaBienInsumo, // validar
                        Item: i + 1,
                        Cantidad: cantProducto,
                        Precio: obj.precio,
                        Total: obj.total,
                        RegistroSanitario: registroSanitario,
                        DocumentoNumero: "",

                    })
                })

               

                let res = await NotaSalida.ModificarReserva(idReserva = $('#hndReserva').val(),
                    movimientoDetalle = JSON.stringify(farmMovimientoDetalle), idEstadoReserva )


                let data = res.data.table[0]
                let textoAlerta = ''
                let NuevoMovNumero = ''
                if (data.successNumber == 0) {
                    alerta2('error', '', data.errorMessage)
                    Cargando(0)
                    Ventas.Guardando = 0
                    return
                } else {
                   
                    if (idEstadoReserva == 2) {
                        alerta(1, 'Se concluyó correctamente.')
                        Cargando(0)
                        $('#btnGuardarNotaSalida').hide();
                        
                        MostrarAreaLista();
                        $('#btnBuscar').trigger('click')
                    } else {
                        alerta(1, 'Se actualizó el detalle correctamente.')
                        Cargando(0)
                    }
                 
                }

                

            } catch (error) {
                alerta(2, "Error al Guardar")
                console.error("Error al obtener saldos:", error);
                Cargando(0)
                NotaSalida.Guardando = 0
                return false
            }
        
    },




    async GuardarReservaMovimientoFarmacia() {

        if (NotaSalida.Guardando == 0) {
            Cargando(1)
            NotaSalida.Guardando = 1

            try {

                let idTipoLocales = $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales");
                let tipoSuministro = $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro");

                let detalleProductos = oTable_detalleNotaSalida.api(true).data().toArray()
                let farmMovimientoDetalle = []
                $(detalleProductos).each(function (i, obj) {
                    console.log('obj', obj)
                    let cantProducto = $('#txtCant_idItem_' + obj.idProducto.toString() + '_' + i).val()
                    let registroSanitario = $('#txtRegistroSanitario_' + obj.idProducto.toString() + '_' + i).val()
                    farmMovimientoDetalle.push({
                        idProducto: obj.idProducto,
                        Lote: obj.lote, // validar
                        FechaVencimiento: obj.fechaVencimiento, // validar
                        idTipoSalidaBienInsumo: obj.idTipoSalidaBienInsumo, // validar
                        Item: i + 1,
                        Cantidad: cantProducto,
                        Precio: obj.precio,
                        Total: obj.total,
                        RegistroSanitario: registroSanitario,
                        DocumentoNumero: "",
                    })
                })
                if (NotaSalida.TipoAccion == 'E') {
                    NotaSalida.IdEstadoMovimiento = 0
                } else {
                    NotaSalida.IdEstadoMovimiento = 1
                }

                let res = await NotaSalida.CrearModificarReservaNotaIngresoSalidaFarmacia(
                    MovNumero = NotaSalida.MovNumero, MovTipo = 'S', idEstadoMovimiento = NotaSalida.IdEstadoMovimiento, idTipoLocales = idTipoLocales,
                    idTipoSuministro = tipoSuministro, documentoIdTipo = $("#cboTipoDocRegistro").val(), idAlmacenOrigen = $('#cboFarmaciasRegistro').val(),
                    idAlmacenDestino = $('#cboDestinoRegistro').val(), IdTipoConceptoFarmacia = $('#cboConceptoRegistro').val(),
                    Observaciones = $('#txtObservacionesRegistro').val(),
                    movimientoDetalle = JSON.stringify(farmMovimientoDetalle),
                    idAreaTerritotorial = $('#cboAreaTerritorioNacionalRegistro').val(),
                    idUnidadDependencia = $('#cboUnidadDependenciaRegistro').val(),
                    idTipoCompartimientoSalida = $('#cboTipoCompartimientoSalidaRegistro').val(),
                    idTipoCompartimientoOrigen = $('#cboTipoCompartimientoOrigenRegistro').val(),
                    idCompartimiento = $('#cboCompartimientoSalidaRegistro').val(),
                    docReferencia = $('#txtDocReferenciaRegistro').val(),
                    idEstadoReserva = 1

                )


                let data = res.data.table[0]
                let textoAlerta = ''
                let NuevoMovNumero = ''

                if (data.successNumber == 1 && data.idReserva > 0) {
                    $('#hndReserva').val(data.idReserva);
                    
                    this.BloquearCabecera(true);



                    $('#cboEstadoNotaSalida').val(data.idEstadoReserva);
                    $('.chzn-select').trigger('chosen:updated');
                    $('#btnConsumirRequerimiento')
                        .attr('data-estado', 'concluir')
                        .removeClass('btn-info')
                        .addClass('btn-success')
                        .html('<i class="fa fa-check"></i> CONCLUIR PARCIAL GUÍA');
                    $('#contFiltrosProductos').show();
                    $('#btnGuardarNotaSalida').show();



                } else if (data.successNumber == 0) {
                    alerta2('error', '', data.errorMessage)
                    Cargando(0)
                    Ventas.Guardando = 0
                    return
                } 


              
              



                



            } catch (error) {
                alerta(2, "Error al Guardar")
                console.error("Error al obtener saldos:", error);
                Cargando(0)
                NotaSalida.Guardando = 0
                return false
            }
        }
    },
    //////////////////////////////EVENTOS USUARIO - SISTEMA///////////////////////////////////////////

    Eventos() {
        $('#tblNotasSalida tbody').on('click', '.btnImprimeInforme', async function () {// KHOYOSI
            var objrow = oTable_NotasSalida.api(true).row($(this).parents("tr")[0]).index();
            var objTable = oTable_NotasSalida.fnGetData(objrow);

            var url = "/Farmacias/ImpreInformeNotaIngresoSalida?area=ConsultaExterna&MovNumero=" + objTable.movNumero + "&MovTipo=" + objTable.movTipo
            $('#ifrmInforme').attr('src', url)
            //newIframe.src = url;

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalInforme").modal('show')
        })
        $('#btnCerrarTicket').on('click', async function () {
            $("#modalInforme").modal('hide')
        });

        $('#btnBuscar').on('click', async function () {
            await NotaSalida.ListarNotasSalida();
        });

        $('#btnGenerarReporte').on('click', () => {
            if (NotaSalida.ValidarBusquedaNotasSalida() == false) {
                return false;
            }


            let formData = new FormData()

            formData.append('MovTipo', 'S');
            formData.append('IdAlmacen', $("#cboFarmaciasBusq").val());
            formData.append('FechaInicio', $("#txtFechaInicioBusq").val());
            formData.append('FechaFin', $("#txtFechaFinalBusq").val());

            Cargando(1)

            fetch('/Farmacias/rptNotaSalidaAlmacen?area=Farmacia', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "NotaSalida.xlsx"
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

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            NotaSalida.LimpiarCamposBusqueda();
        });

        $('#tblNotasSalida tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NotasSalida.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#txtNombreProducto').on('input', async function () {
            let inputValue = $(this).val()

            var dataMedicamentos = new FormData();
            dataMedicamentos.append('lnIdAlmacen', $('#cboFarmaciasRegistro').val());
            dataMedicamentos.append('lcFiltro', inputValue);

            if (inputValue.length > 3 && $('#cboFarmaciasRegistro').val() != 0) {
                $('#contProductosBusqueda').show()

                $.ajax({
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
                            oTable_ProductosBuscados.fnAddData(datos.lstData.table)
                        }

                    },
                    error: function (msg) {
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }
                })
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

            var pos = oTable_ProductosBuscados.api(true).row($(this)).index();
            var row = oTable_ProductosBuscados.fnGetData(pos);

            console.log('pos', pos)
            console.log('row', row)

            let items = {
                idProducto: row.idProducto,
                codigo: row.codigo,
                producto: row.nombre,
                saldo: row.saldo,
                cantidadPedida: 0,
                precio: row.precio,
                total: 0 * row.precio,

                tipo: row.tipo,
                lote: row.lote,
                fechaVencimiento: row.fechaVencimiento,
                idTipoSalidaBienInsumo: row.idTipoSalidaBienInsumoSaldo,
                fechaVencimientoFormat: row.fechaVencimientoFormat,
                registroSanitario: row.registroSanitario
            }

            if (NotaSalida.ExisteProducto(row.idProducto, row.lote, row.tipo, row.fechaVencimientoFormat)) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_detalleNotaSalida.fnAddData(items)

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

        $('#btnAgregarNotaSalida').on('click', function () {
            //TriajeRn.LimpiarDatosMadre();
            //TriajeRn.LimpiarCamposRegistro();
            //TriajeRn.DeshabilitarRegistro();

            $('#btnAnularNotaSalida').hide()

            NotaSalida.TipoAccion = 'A'

            

            NotaSalida.LimpiarCamposRegistro()

            NotaSalida.IniciarDatosRegistro()
            MostrarAreaRegistro();
           
        });

        $('#btnModificarNotaSalida').on('click', async function () {

            let notaSalida = oTable_NotasSalida.api(true).row('.selected').data()

            if (isEmpty(notaSalida)) {
                alerta(2, 'Seleccione un registro por favor.')
                return false
            }

            if (notaSalida.idEstadoMovimiento == 0) {
                alerta2('warning', 'El registro se encuentra anulado.')
                return false
            }
            if (notaSalida.idEstadoReserva == 2) {
                alerta2('warning', 'El registro se encuentra concluido parcialmente,no se puede moficar.')
                return false
            }
            if (notaSalida.idEstadoReserva == 3) {
                alerta2('warning', 'El registro se encuentra concluido,no se puede moficar.')
                return false
            }

            $('#btnAnularNotaSalida').hide()

            NotaSalida.TipoAccion = 'M'

            NotaSalida.LimpiarCamposRegistro()

            NotaSalida.CargarCamposRegistro(notaSalida)


            NotaSalida.IniciarDatosRegistro()

            MostrarAreaRegistro();

            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnConsultarNotaSalida').on('click', async function () {

            let notaSalida = oTable_NotasSalida.api(true).row('.selected').data()

            if (isEmpty(notaSalida)) {
                alerta(2, 'Seleccione un registro por favor.')
                return false
            }

            $('#btnAnularNotaSalida').hide()

            // NotaSalida.accion = 3
            NotaSalida.TipoAccion = 'C'

            NotaSalida.LimpiarCamposRegistro()

            NotaSalida.CargarCamposRegistro(notaSalida)

            NotaSalida.IniciarDatosRegistro()

            MostrarAreaRegistro();

            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnEliminarNotaSalida').on('click', async function () {

            let notaSalida = oTable_NotasSalida.api(true).row('.selected').data()

            if (isEmpty(notaSalida)) {
                alerta(2, 'Seleccione un registro por favor.')
                return false
            }

            if (notaSalida.idEstadoMovimiento == 0) {
                alerta2('warning', 'El registro se encuentra anulado.')
                return false
            }

            $('#btnAnularNotaSalida').show()


            // NotaSalida.accion = 3
            NotaSalida.TipoAccion = 'E'
            NotaSalida.LimpiarCamposRegistro()

            NotaSalida.CargarCamposRegistro(notaSalida)

            NotaSalida.IniciarDatosRegistro()

            MostrarAreaRegistro();

            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnGuardarNotaSalida').on('click', async function () {


            let idTipoLocales = $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales");
            let tipoSuministro = $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro");

            let detalleProductos = oTable_detalleNotaSalida.api(true).data().toArray()
            let farmMovimientoDetalle = []
            if (!NotaSalida.ValidarDatosObligatorios()) {
                return false
            }
            for (let [i, obj] of detalleProductos.entries()) {
                if (parseInt($(`#txtCant_idItem_${obj.idProducto}_${i}`).val()) <= 0) {
                    alerta2('error', 'Alerta', `El producto ${obj.producto} debe tener una cantidad mayor a cero.`)
                    return false
                }
            }
            for (let [i, obj] of detalleProductos.entries()) {
                if (parseFloat(obj.precio) <= 0.00) {
                    alerta2('error', 'Alerta', `El producto ${obj.producto} no tiene precio.`)
                    return false
                }
            }
            let movimientos = await NotaSalida.FarmMovimientoSeleccionarPorTipoYnumeroDocumento('S');
            if (NotaSalida.TipoAccion === 'A' && !isEmpty(movimientos)) {

                const fechaDMY = new Date(movimientos.fechaCreacion);
                const fechaFormateada = fechaDMY.toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                let confirmarNroDocumento = alertaAsync('info', 'Info',
                    `Ya existe una nota de salida con los siguientes datos:
                    <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                        <tbody>
                            <tr>
                                <th style="width: 25%; background: #f0f0f0;">N° Documento:</th>
                                <td>${movimientos.documentoNumero}</td>
                                <th style="width: 10%; background: #f0f0f0;">NS:</th>
                                <td>${movimientos.movNumero}</td>
                                <th style="width: 10%; background: #f0f0f0;">Fecha:</th>
                                <td>${fechaFormateada}</td>
                            </tr>
                        </tbody>
                    </table>
                    Intente probar con el siguiente número de documento`
                )

                if (confirmarNroDocumento.isConfirmed) {
                    let documentoEsAutomatico = $('#cboConceptoRegistro>option:selected').attr("documentoEsAutomatico") === 'S';
                    let numeroDocumento = $('#txtNroDocNotaSalida').val();
                    $('#txtNroDocNotaSalida').val(documentoEsAutomatico ? parseInt(numeroDocumento) + 1 : '');
                }

                return false;
            }
            await NotaSalida.ActualizarReserva(1);
        });



       
        

        $('#btnCancelarNotaSalida').on('click', async function () {

            let salir = await alertaAsync('question', 'Salir', '¿Esta seguro de salir?')

            if (salir.isConfirmed) {
                MostrarAreaLista();
            }

        });

        $('#btnConsumirRequerimiento').on('click',async  function () {
            let $btn = $(this);

            if (!NotaSalida.ValidarDatosObligatoriosReserva()) {
                return false
            }

            if ($btn.attr('data-estado') === 'concluir') {

                if (oTable_detalleNotaSalida.api(true).data().toArray().length == 0) {
                    alerta(2, 'Ingrese al menos un producto a la lista por favor.')
                    return false
                }

                await NotaSalida.ActualizarReserva(2);
            } else {
                await NotaSalida.RegistrarReserva();
            }

            

            
        });


        $('#btnBuscarRecetasUnidosis').on('click', async function () {

            let errorMessage = ''

            let recetasUnidosis = await NotaSalida.RecetaFiltrar();

            let tablaDetalleNota = []

            let codigoSnPunto = ''
            let productoFuenteFinan

            oTable_detalleNotaSalida.fnClearTable()

            NotaSalida.oRsRecetasAdespachar = []
            NotaSalida.oRsDespacho = []

            // VERIFICAMOS SI EXISTE RECETA DE UNIDOSIS POR CODIGO PREUNIDOSIS Y SERVICIO
            if (recetasUnidosis.length == 0) {

                alerta(2, 'No hay RECETAS por despachar con esos datos')

                return false
            }

            // ITERAMOS SOBRE TODAS LAS RECETAS PARA OBTENER EL DETALLE
            for (let [i, obj] of recetasUnidosis.entries()) {

                // Capturar la fecha actual
                var f = new Date();
                var dia = f.getDate();
                var mes = (f.getMonth() + 1);
                if (dia < 10)
                    dia = '0' + dia; // Agrega cero si el menor de 10
                if (mes < 10)
                    mes = '0' + mes
                FechaHoy = dia + "/" + mes + "/" + f.getFullYear();
                FormatoBD = f.getFullYear() + "/" + mes + "/" + dia


                let orsDespacho = []

                //let datosDetalleNotaUNIDOSIS = []


                // Obtenemos el detalle de la receta por el IdReceta
                let detalleReceta = await NotaSalida.RecetasDevuelveDatosDelDetalle(obj.idReceta, 5, 5)

                for (let objDetalle of detalleReceta) {
                    //let adicionarProducto = 0
                    let producto = objDetalle.producto
                    // obtenemos el codigo sin punto
                    //codigoSnPunto = producto.substring(0, producto.indexOf("/"))
                    codigoSnPunto = objDetalle.codigo

                    let FarmUnidosisFilter = NotaSalida.FarmUnidosis

                    // Realizaremos un filtro para seleccionar los items que pertenezcan a la relacion de UNIDOSIS
                    FarmUnidosisFilter = FarmUnidosisFilter.filter(item => item.codigo.trim() == codigoSnPunto.trim())

                    // Si existe un producto que cumpla el criterio procedemos a agregar dicho producto
                    if (FarmUnidosisFilter.length > 0) {

                        productoFuenteFinan = await NotaSalida.FactCatalogoBienesInsumosXcodigoYtipofinanciamiento(1, codigoSnPunto.trim())

                        let ItemOrsDespacho = {

                            idProducto: productoFuenteFinan.idProducto,
                            Codigo: codigoSnPunto,
                            nombre: productoFuenteFinan.nombreProducto,
                            Precio: productoFuenteFinan.precioUnitario,
                            UnidosisIdProducto: objDetalle.idItem,
                            UnidosisCodigo: codigoSnPunto + '.',
                            UnidosisNombre: FarmUnidosisFilter[0].descripcion,
                            cantidad: 0,
                            //cantidad: cantidad,

                            unidosisSobrante: 0,
                            UnidosisConvertir: FarmUnidosisFilter[0].convertir,
                            UnidosisCantidad: objDetalle.cantidadPedida

                            //unidosisSobrante: cantSobrante.lnSobranteGotas,

                        }

                        // Buscar el elemento existente con el mismo Codigo
                        const elementoExistente = NotaSalida.oRsDespacho.find(elemento => elemento.Codigo === ItemOrsDespacho.Codigo);

                        if (elementoExistente) {
                            // Si el elemento existe, actualizar sus propiedades
                            elementoExistente.UnidosisCantidad = elementoExistente.UnidosisCantidad + ItemOrsDespacho.UnidosisCantidad;
                            // Puedes actualizar más propiedades si es necesario
                        } else {
                            // Si no existe, agregar el nuevo elemento
                            NotaSalida.oRsDespacho.push(ItemOrsDespacho);
                        }
                    }

                }


                let itemOrsRecetasADespachar = {
                    idReceta: obj.idReceta,
                    paciente: obj.apellidoPaterno + " " + obj.apellidoMaterno + " " + obj.primerNombre,
                    nroHistoria: obj.nroHistoriaClinica
                }

                NotaSalida.oRsRecetasAdespachar.push(itemOrsRecetasADespachar)
            }

            //// SE CONFIGURAN LOS TOTALES PARA LOS ITEMS

            for (let objoRsDespacho of NotaSalida.oRsDespacho) {

                let cantSobrante = await NotaSalida.DevuelveCantidadYsobranteUnidosis(objoRsDespacho.UnidosisCantidad, objoRsDespacho.UnidosisConvertir)

                const elementoExistente = NotaSalida.oRsDespacho.find(elemento => elemento.Codigo === objoRsDespacho.Codigo);

                if (elementoExistente) {
                    // Si el elemento existe, actualizar sus propiedades
                    elementoExistente.cantidad = cantSobrante.lnCantidadPomo;
                    elementoExistente.unidosisSobrante = cantSobrante.lnSobranteGotas;
                    // Puedes actualizar más propiedades si es necesario
                }

                let cantidadQueda = cantSobrante.lnCantidadPomo
                let cantidad = 0

                // Se valida si el producto del almacen de origen tiene stock
                let saldoAlmacen = await NotaSalida.FarmDevuelveSaldosSegunAlmacenProducto($('#cboFarmaciasRegistro').val(), objoRsDespacho.idProducto)

                if (!isEmpty(saldoAlmacen)) {
                    if (saldoAlmacen.cantidad > cantSobrante.lnCantidadPomo) {


                        let fmSaldoLote = await NotaSalida.FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente($('#cboFarmaciasRegistro').val(), objoRsDespacho.Codigo)

                        if (!isEmpty(fmSaldoLote)) {

                            if (cantidadQueda <= fmSaldoLote.saldo) {
                                cantidad = cantidadQueda
                                cantidadQueda = 0
                            } else {
                                cantidadQueda = cantidadQueda - fmSaldoLote.saldo
                                cantidad = fmSaldoLote.saldo
                            }


                            //// Aparentemente no se utiliza
                            //NotaSalida.TotalUnidosis = NotaSalida.TotalUnidosis + FarmUnidosisFilter[0].precioUnitario * $('#txtCant_idItem_' + obj.idProducto).val() * FarmUnidosisFilter[0].convertir

                            // Se capturan datos para agregar a la tabla de productos en pantalla
                            let dataAttributes = {
                                idProducto: fmSaldoLote.idProducto,
                                codigo: fmSaldoLote.codigo,
                                producto: fmSaldoLote.nombre,
                                idTipoSalidaBienInsumo: fmSaldoLote.idTipoSalidaBienInsumoSaldo,
                                tipo: fmSaldoLote.tipo,
                                lote: fmSaldoLote.lote,
                                fechaVencimientoFormat: fmSaldoLote.fechaVencimientoFormat,
                                saldo: fmSaldoLote.saldo,
                                cantidadPedida: cantSobrante.lnCantidadPomo,
                                precio: objoRsDespacho.Precio,
                                total: (cantSobrante.lnCantidadPomo * objoRsDespacho.Precio).toFixed(2),
                                registroSanitario: ""
                            };
                            //datosDetalleNotaUNIDOSIS.push(objItemDetalleUNIDOSIS)
                            tablaDetalleNota.push(dataAttributes)
                        } else {
                            errorMessage += `No hay SALDO para ${codigoSnPunto} - ${productoFuenteFinan.nombreProducto} \n`
                        }
                    } else {
                        errorMessage += `No hay SALDO para ${codigoSnPunto} - ${productoFuenteFinan.nombreProducto} \n`
                    }
                }
            }


            ////

            if (isEmpty(errorMessage)) {
                if (tablaDetalleNota.length > 0) {
                    oTable_detalleNotaSalida.fnAddData(tablaDetalleNota)
                }
            } else {
                alerta2("error", "", errorMessage);
            }


            console.log('NotaSalida.oRsRecetasAdespachar', NotaSalida.oRsRecetasAdespachar)
            console.log('NotaSalida.oRsDespacho', NotaSalida.oRsDespacho)
            //console.log('recetasUnidosis', recetasUnidosis)
        });


        $('#cboTipoCompartimientoOrigenRegistro').on('change', function () {
            NotaSalida.CargarFarmaciasRegistro($(this).val());
            //$('#cboFarmaciasRegistro').val(0).trigger('change');
        });

        $('#cboTipoCompartimientoSalidaRegistro').on('change', function () {
            NotaSalida.CargarFarmaciasSalidaRegistro($(this).val());
            //$('#cboCompartimientoSalidaRegistro').val(0).trigger('change');
        });

        $('#cboAreaTerritorioNacionalRegistro').on('change', function () {
            NotaSalida.CargarUnidadDependenciaRegistro($(this).val());
        });


        $('#cboFarmaciasRegistro').on('change', async function () {
            var dataTipoConcepto = new FormData();
            dataTipoConcepto.append('TipoAlmacen', $("#TipoFarmacia").html());
            dataTipoConcepto.append('TipoMov', 'S');
            dataTipoConcepto.append('TipoSuministro', $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro"));
            $.ajax({
                method: "POST",
                url: "/Farmacias/FarmTipoConceptosDevuelveParaRegistroDeNiNs?area=Farmacia",
                data: dataTipoConcepto,
                dataType: "json",
                async: false,
                cache: false,
                processData: false,
                contentType: false,
                success: function (datos) {
                    $('#cboConceptoRegistro').empty();

                    $('#cboConceptoRegistro').append('<option value="0">Seleccione una opción</option>');
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboConceptoRegistro').append('<option value="' + obj.idTipoConcepto + '" documentoUltimoNumero="' + obj.documentoUltimoNumero + '" documentoId="' + obj.documentoId + '" nsFiltroAlmacenDestino="' + obj.nsFiltroAlmacenDestino + '" documentoEsAutomatico="' + obj.documentoEsAutomatico + '">' + obj.concepto + '</option>');
                    });
                },
                error: function (msg) {
                    alerta("ERROR", "Error listar farmacias!", "2");
                }
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
        });


        $('#cboConceptoRegistro').on('change', async function () {
            let filtroFarmacia = ''


            $('#cboTipoDocRegistro').val($('#cboConceptoRegistro>option:selected').attr("documentoId"));
            filtroFarmacia = $('#cboConceptoRegistro>option:selected').attr("nsFiltroAlmacenDestino");

            if ($('#cboConceptoRegistro>option:selected').attr("documentoEsAutomatico") == 'S') {
                $('#txtNroDocNotaSalida').val(parseInt($('#cboConceptoRegistro>option:selected').attr("documentoUltimoNumero")) + 1);
                $('#txtNroDocNotaSalida').attr('disabled', true)
            } else {
                $('#txtNroDocNotaSalida').val('');
                $('#txtNroDocNotaSalida').attr('disabled', false)
            }



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
                    $('#cboDestinoRegistro').empty();

                    //$('#cboFarmaciasRegistro').append('<option value="' + 0 + '">Seleccione una opción</option>');
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboDestinoRegistro').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" idTipoLocales="' + obj.idTipoLocales + '" esUnidosis="' + obj.esUnidosis + '">' + obj.descripcion + '</option>');
                    });
                },
                error: function (msg) {
                    alerta("ERROR", "Error listar farmacias!", "2");
                }
            });
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

            //



            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#cboItemRegistro').next('.chosen-container').find('.chosen-search input').on('input', function () {
            let inputVal = $(this).val().trim();
            let select = $('#cboItemRegistro');


            var dataMedicamentos = new FormData();
            dataMedicamentos.append('lnIdAlmacen', $('#cboFarmaciasRegistro').val());
            dataMedicamentos.append('lcFiltro', inputVal);

            if (inputVal.length > 0 && $('#cboFarmaciasRegistro').val() != 0) {
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente?area=Farmacia",
                    data: dataMedicamentos,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (datos) {

                        console.log('productos', datos)

                        let searchInput = select.next('.chosen-container').find('.chosen-search input');
                        let currentSearch = searchInput.val();


                        $('#cboItemRegistro').empty();

                        $('#cboItemRegistro').append('<option value="0">Seleccione una opción</option>');
                        $(datos.lstData.table).each(function (i, obj) {
                            let optionText = `
                                ${obj.codigo} - ${obj.nombre} | 
                                Lote: ${obj.lote} | 
                                Fecha Vencimiento: ${obj.fechaVencimiento} | 
                                Saldo: ${obj.saldo}`;

                            $('#cboItemRegistro').append(`<option value="${obj.idProducto}" codigo="${obj.codigo}" nombre="${obj.nombre}" tipo="${obj.tipo}" lote="${obj.lote}" fechaVencimientoFormat="${obj.fechaVencimientoFormat}"
                            saldo="${obj.saldo}" precio="${obj.precio}" idTipoSalidaBienInsumo="${obj.idTipoSalidaBienInsumoSaldo}">
                            ${optionText}</option>`);
                        });


                        // Actualizar Chosen para incluir la nueva opción
                        select.trigger('chosen:updated');

                        // Restablecer el valor del input de búsqueda
                        searchInput.val(currentSearch);
                    },
                    error: function (msg) {
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }
                });
            } else {
                let searchInput = select.next('.chosen-container').find('.chosen-search input');
                let currentSearch = searchInput.val();

                $('#cboItemRegistro').empty();
                select.trigger('chosen:updated');

                $('#cboItemRegistro').append('<option value="0">Seleccione una opción</option>');
                select.trigger('chosen:updated');

                searchInput.val(currentSearch);
            }


        });


        $('#cboItemRegistro').on('change', async function () {

            const dataAttributes = {
                idProducto: $('#cboItemRegistro').val(),
                codigo: $('#cboItemRegistro>option:selected').attr("codigo"),
                producto: $('#cboItemRegistro>option:selected').attr("nombre"),
                idTipoSalidaBienInsumo: $('#cboItemRegistro>option:selected').attr("idtiposalidabieninsumo"),
                tipo: $('#cboItemRegistro>option:selected').attr("tipo"),
                lote: $('#cboItemRegistro>option:selected').attr("lote"),
                fechaVencimientoFormat: $('#cboItemRegistro>option:selected').attr("fechaVencimientoFormat"),
                saldo: $('#cboItemRegistro>option:selected').attr("saldo"),
                cantidadPedida: 0,
                precio: $('#cboItemRegistro>option:selected').attr("precio"),
                total: 0,
                registroSanitario: ""
            };

            if (NotaSalida.ExisteProducto()) {
                alerta(2, 'El producto ya fue agregado')
                return false
            }

            oTable_detalleNotaSalida.fnAddData(dataAttributes)

            let precio = $('#cboItemRegistro>option:selected').attr("precio")


            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        //$('.txtCantidadPedida').on('input', async function () {

        //    const inputId = $(this).attr('id');
        //    console.log('Actualmente escribiendo en: ' + inputId);
        //});
        $('#tblDetalleNotaSalida tbody').on('input', 'input[id^="txtCant_idItem_"]', function () {
            const inputId = $(this).attr('id');

            let inputElement = $(this);
            let rowElement = inputElement.closest('tr');

            //let rowIndex = oTable_detalleNotaSalida.api().row(rowElement).index();

            let row = oTable_detalleNotaSalida.api().row(rowElement);

            let data = row.data()

            let cantidadPedida = $('#' + inputId).val()

            if (parseInt(cantidadPedida) > parseInt(data.saldo)) {
                $('#' + inputId).focus()
                alerta(2, 'La cantidad debe ser menor o igual a ' + data.saldo)
                return
            }

            let precioItem = data.precio
            let cantidadItem = inputElement.val()
            let registroSanitario = $('#txtRegistroSanitario_' + data.idProducto + '_' + row.index()).val()

            var inputRegSanitario = '';
            inputRegSanitario = '  <input id="txtRegistroSanitario_' + data.idProducto + '_' + row.index() + '" value="' + registroSanitario + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'

            var inputCantidad = '';
            inputCantidad = '  <input id="txtCant_idItem_' + data.idProducto + '_' + row.index() + '" value="' + cantidadItem + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero txtCantidadPedida">'




            data.total = (precioItem * cantidadItem).toFixed(2)
            data.registroSanitario = inputRegSanitario
            data.cantidadPedida = inputCantidad


            //var row = table.row(rowIndex);
            row.data(data).draw();




            // Devolver el foco al input y mover el cursor al final
            let newInputElement = $('#' + inputId)
            newInputElement.focus();
            let val = newInputElement.val();
            newInputElement.val(''); // Clear the input
            newInputElement.val(val); // Restore the value and move the cursor to the end

            console.log('data', data)
        })

        $('#tblDetalleNotaSalida tbody').on('focusout', 'input[id^="txtCant_idItem_"]', function () {
            const inputId = $(this).attr('id');

            let inputElement = $(this);
            let rowElement = inputElement.closest('tr');

            //let rowIndex = oTable_detalleNotaSalida.api().row(rowElement).index();

            let row = oTable_detalleNotaSalida.api().row(rowElement);

            let data = row.data()

            if (parseInt($('#' + inputId).val()) > parseInt(data.saldo)) {
                $('#' + inputId).focus()
                alerta(2, 'La cantidad debe ser menor o igual a ' + data.saldo)
                return
            }

        })

        $('#tblDetalleNotaSalida tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_detalleNotaSalida.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });


        $('#btnQuitarProducto').on('click', async function () {
            var objrowTb = oTable_detalleNotaSalida.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                NotaSalida.QuitarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para eliminar.");
            }
        });




    },

    QuitarProducto() {
        oTable_detalleNotaSalida.api(true).row('.selected').remove().draw(false);
        oTable_detalleNotaSalida.resize();
    },


    async RegistrarReserva() {
        let idTipoLocales = $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales");
        let tipoSuministro = $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro");

        let detalleProductos = oTable_detalleNotaSalida.api(true).data().toArray()
        let farmMovimientoDetalle = []
        let movimientos = await NotaSalida.FarmMovimientoSeleccionarPorTipoYnumeroDocumento('S');

        if (NotaSalida.TipoAccion === 'A' && !isEmpty(movimientos)) {

            const fechaDMY = new Date(movimientos.fechaCreacion);
            const fechaFormateada = fechaDMY.toLocaleDateString('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            let confirmarNroDocumento = alertaAsync('info', 'Info',
                `Ya existe una nota de salida con los siguientes datos:
                    <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                        <tbody>
                            <tr>
                                <th style="width: 25%; background: #f0f0f0;">N° Documento:</th>
                                <td>${movimientos.documentoNumero}</td>
                                <th style="width: 10%; background: #f0f0f0;">NS:</th>
                                <td>${movimientos.movNumero}</td>
                                <th style="width: 10%; background: #f0f0f0;">Fecha:</th>
                                <td>${fechaFormateada}</td>
                            </tr>
                        </tbody>
                    </table>
                    Intente probar con el siguiente número de documento`
            )

            if (confirmarNroDocumento.isConfirmed) {
                let documentoEsAutomatico = $('#cboConceptoRegistro>option:selected').attr("documentoEsAutomatico") === 'S';
                let numeroDocumento = $('#txtNroDocNotaSalida').val();
                $('#txtNroDocNotaSalida').val(documentoEsAutomatico ? parseInt(numeroDocumento) + 1 : '');
            }

            return false;
        }

        await NotaSalida.GuardarReservaMovimientoFarmacia()

    },

    //////////////////////////LLENAR COMBOS////////////////////////////////////////////////////
    LLenarCombos() {
        NotaSalida.CargarTipoCompartimientoOrigenRegistro();
        NotaSalida.CargarTipoCompartimientoSalidaRegistro();
        NotaSalida.CargarEstadosNotaSalida();
        NotaSalida.CargarFarmaciasRegistro($('#cboTipoCompartimientoOrigenRegistro').val());
        NotaSalida.CargarFarmaciasSalidaRegistro($('#cboTipoCompartimientoSalidaRegistro').val());
        NotaSalida.CargarAreaTerritorioNacionalRegistro();
        NotaSalida.CargarUnidadDependenciaRegistro($('#cboAreaTerritorioNacionalRegistro').val());

        $.ajax({
            method: "GET",
            url: "/Farmacias/FarmTipoDocumentosDevuelveTodos?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboTipoDocRegistro').empty();
                //$('#cboTipoDocRegistro').append('<option  value="' + obj.idTipoDocumento + '">' + obj.nombre + '</option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoDocRegistro').append('<option  value="' + obj.idTipoDocumento + '">' + obj.nombre + '</option>');
                });
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        $.ajax({
            method: "GET",
            url: "/Farmacias/FarmUnidosisSeleccionarTodos?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {

                if (datos.lstData.table.length > 0) {
                    NotaSalida.FarmUnidosis = datos.lstData.table
                }

            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        let filtro = " (3) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre";
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
                $('#cboServicioUnidosisRegistro').empty();

                $('#cboServicioUnidosisRegistro').append('<option value="' + 0 + '">Seleccione una opción</option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboServicioUnidosisRegistro').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CargarTipoCompartimientoOrigenRegistro() {
        $('#cboTipoCompartimientoOrigenRegistro').attr('disabled', true);
        $.ajax({
            method: "GET",
            url: "/Farmacias/ListarTipoCompartimiento?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                const tipoFarmaciaDefault = $.trim($("#TipoFarmacia").html());

                $('#cboTipoCompartimientoOrigenRegistro').empty();
                $('#cboTipoCompartimientoOrigenRegistro').append('<option value="0">Seleccione una opción</option>');

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoCompartimientoOrigenRegistro').append('<option value="' + obj.idTipoLocal + '">' + obj.descripcion + '</option>');
                });

                if (tipoFarmaciaDefault !== '') {
                    $('#cboTipoCompartimientoOrigenRegistro').val(tipoFarmaciaDefault);
                }

                $('#cboTipoCompartimientoOrigenRegistro').attr('disabled', true);
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar tipos de compartimiento!", "2");
            }
        });
    },


    CargarEstadosNotaSalida() {
        $.ajax({
            method: "GET",
            url: "/Farmacias/ListarEstadosReservaNotaSalida",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboEstadoNotaSalida').empty();
                $('#cboEstadoNotaSalida').append('<option value="0">Seleccione una opción</option>');

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboEstadoNotaSalida').append('<option value="' + obj.idEstadoReserva + '">' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar territorio nacional!", "2");
            }
        });
    },


    CargarTipoCompartimientoSalidaRegistro() {
        $.ajax({
            method: "GET",
            url: "/Farmacias/ListarTipoCompartimiento?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                const tipoFarmaciaDefault = $.trim($("#TipoFarmacia").html());

                $('#cboTipoCompartimientoSalidaRegistro').empty();
                $('#cboTipoCompartimientoSalidaRegistro').append('<option value="0">Seleccione una opción</option>');

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoCompartimientoSalidaRegistro').append('<option value="' + obj.idTipoLocal + '">' + obj.descripcion + '</option>');
                });

                if (tipoFarmaciaDefault !== '') {
                    $('#cboTipoCompartimientoSalidaRegistro').val(tipoFarmaciaDefault);
                }

             /*  */
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar tipos de compartimiento!", "2");
            }
        });
    },

    CargarFarmaciasRegistro(idTipoCompartimiento) {
        let filtroFarmacia = "idTipoLocales='" + idTipoCompartimiento + "' and idEstado=1";
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
                //$('#cboFarmaciasBusq').empty();
                 $('#cboFarmaciasRegistro').empty();

                $('#cboFarmaciasRegistro').append('<option value="0">Seleccione una opción</option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboFarmaciasBusq').append('<option value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                    $('#cboFarmaciasRegistro').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" idTipoLocales="' + obj.idTipoLocales + '" esUnidosis="' + obj.esUnidosis + '">' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });
    },



    CargarFarmaciasSalidaRegistro(idTipoCompartimiento) {
        let filtroFarmacia = "idTipoLocales='" + idTipoCompartimiento + "' and idEstado=1";
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
                //$('#cboFarmaciasBusq').empty();
                $('#cboCompartimientoSalidaRegistro').empty();

                $('#cboCompartimientoSalidaRegistro').append('<option value="0">Seleccione una opción</option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboCompartimientoSalidaRegistro').append('<option value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                    $('#cboCompartimientoSalidaRegistro').append('<option value="' + obj.idAlmacen + '" tipoSuministro="' + obj.idTipoSuministro + '" idTipoLocales="' + obj.idTipoLocales + '" esUnidosis="' + obj.esUnidosis + '">' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar farmacias!", "2");
            }
        });
    },


    CargarAreaTerritorioNacionalRegistro() {
        $.ajax({
            method: "GET",
            url: "/Farmacias/ListarTerritorioNacional?area=Farmacia",
            dataType: "json",
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboAreaTerritorioNacionalRegistro').empty();
                $('#cboAreaTerritorioNacionalRegistro').append('<option value="0">Seleccione una opción</option>');

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboAreaTerritorioNacionalRegistro').append('<option value="' + obj.idTerritorioNac + '">' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar territorio nacional!", "2");
            }
        });
    },

    CargarUnidadDependenciaRegistro(idTerritorioNac) {
        $.ajax({
            method: "GET",
            url: "/Farmacias/ListarUnidadDependenciabyTerritorioNacional?area=Farmacia",
            data: { idTerritorioNac: idTerritorioNac },
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                $('#cboUnidadDependenciaRegistro').empty();
                $('#cboUnidadDependenciaRegistro').append('<option value="0">Seleccione una opción</option>');

                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboUnidadDependenciaRegistro').append('<option value="' + obj.idIPress + '">' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta("ERROR", "Error listar unidades de dependencia!", "2");
            }
        });
    },

    //////////////////////////METODOS BACKED///////////////////////////////////////////////////////////
    async ListarNotasSalida() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        if (NotaSalida.ValidarBusquedaNotasSalida() == false) {
            return false;
        }

        data.append('IdAlmacen', $("#cboFarmaciasBusq").val());
        data.append('FechaInicio', $("#txtFechaInicioBusq").val());
        data.append('FechaFin', $("#txtFechaFinalBusq").val());

        try {
            Cargando(1);
            oTable_NotasSalida.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmDevuelveReservas?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) { //IdTipoConcepto<>10 and IdTipoConcepto<>13  and IdTipoConcepto<>14 and IdTipoConcepto<>15  and IdTipoConcepto<>16 and IdTipoConcepto<>17  and IdTipoConcepto<>25 and IdTipoConcepto<>23
                respuesta = datos.lstData.table;
                respuesta = respuesta.filter(obj => obj.idTipoConcepto != 10 && obj.idTipoConcepto != 13 && obj.idTipoConcepto != 14 && obj.idTipoConcepto != 15 && obj.idTipoConcepto != 16 && obj.idTipoConcepto != 17 && obj.idTipoConcepto != 25 && obj.idTipoConcepto != 23)
                console.log("MOISES - datos que irán a la tabla:", respuesta);
                console.table(respuesta);
                if (respuesta.length > 0) {
                    oTable_NotasSalida.fnAddData(respuesta);
                }
                oTable_NotasSalida.resize();
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

    async FarmMovimientoDetalleByMovNumero(MovNumero, MovTipo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('MovNumero', MovNumero);
        data.append('MovTipo', MovTipo);

        try {
            Cargando(1);
            oTable_detalleNotaSalida.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleByMovNumero?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_detalleNotaSalida.fnAddData(datos.lstData.table);
                oTable_detalleNotaSalida.resize();
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

    async FarmMovimientoDetalleByidReserva(idReserva) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('idReserva', idReserva);

        try {
            Cargando(1);
            oTable_detalleNotaSalida.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleByidReserva?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_detalleNotaSalida.fnAddData(datos.lstData.table);
                oTable_detalleNotaSalida.resize();
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

    async FarmMovimientoSeleccionarPorTipoYnumeroDocumento(MovTipo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('documentoNumero', $("#txtNroDocNotaSalida").val());
        data.append('idTipoLocales', $('#cboFarmaciasRegistro>option:selected').attr("idTipoLocales"));
        data.append('MovTipo', MovTipo);
        data.append('idTipoSuministro', $('#cboFarmaciasRegistro>option:selected').attr("tipoSuministro"));
        data.append('documentoIdTipo', $("#cboTipoDocRegistro").val());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoSeleccionarPorTipoYnumeroDocumento?area=Farmacia",
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

    async FarmMovimientoSeleccionarSoloPorTipoYnumeroDocumentoYmovTipo(MovTipo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('documentoNumero', $("#txtNroDocNotaSalida").val());
        data.append('documentoIdTipo', $("#cboTipoDocRegistro").val());
        data.append('MovTipo', MovTipo);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoSeleccionarSoloPorTipoYnumeroDocumentoYmovTipo?area=Farmacia",
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

    async FarmDevuelveSaldosSegunAlmacenProducto(idAlmacen, idProducto) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idAlmacen', idAlmacen);
        data.append('idProducto', idProducto);

        try {
            Cargando(1);

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



    ModificarReserva: async function (idReserva, movimientoDetalle, idEstadoReserva) {

        let formData = new FormData();

       
        formData.append('idReserva', idReserva);
        formData.append('movimientoDetalle', movimientoDetalle);
        formData.append('idEstadoReserva', idEstadoReserva);
        let res = await HttpClient.Post('/Farmacias/ModificarReservaNotaSalidaFarmacia?area=Farmacia', formData)


        return res
    },



    CrearModificarReservaNotaIngresoSalidaFarmacia: async function (
        MovNumero, MovTipo, idEstadoMovimiento, idTipoLocales, idTipoSuministro, documentoIdTipo, idAlmacenOrigen,
        idAlmacenDestino, IdTipoConceptoFarmacia, Observaciones, movimientoDetalle, idAreaTerritotorial, idUnidadDependencia, idTipoCompartimientoSalida, idTipoCompartimientoOrigen, idCompartimiento, docReferencia, idEstadoReserva) {

        let formData = new FormData();

        formData.append('MovNumero', MovNumero);
        formData.append('MovTipo', MovTipo);
        formData.append('idEstadoMovimiento', idEstadoMovimiento);
        formData.append('idTipoLocales', idTipoLocales);
        formData.append('idTipoSuministro', idTipoSuministro);
        formData.append('documentoIdTipo', documentoIdTipo);
        formData.append('idAlmacenOrigen', idAlmacenOrigen);
        formData.append('idAlmacenDestino', idAlmacenDestino);
        formData.append('IdTipoConceptoFarmacia', IdTipoConceptoFarmacia);
        formData.append('Observaciones', Observaciones);
        formData.append('movimientoDetalle', movimientoDetalle);
        formData.append('IdListBarItem', ObtenerItemListBar());

        formData.append('idAreaTerritotorial', idAreaTerritotorial);
        formData.append('idUnidadDependencia', idUnidadDependencia);
        formData.append('idTipoCompartimientoSalida', idTipoCompartimientoSalida);
        formData.append('idTipoCompartimientoOrigen', idTipoCompartimientoOrigen);
        formData.append('idCompartimiento', idCompartimiento);
        formData.append('docReferencia', docReferencia);
        formData.append('idEstadoReserva', idEstadoReserva);

        let res = await HttpClient.Post('/Farmacias/CrearModificarReservaNotaSalidaFarmacia?area=Farmacia', formData)


        return res
    },

    CrearModificarNotaIngresoReserva: async function (MovNumero, MovTipo, idEstadoMovimiento, idTipoLocales, idTipoSuministro, documentoIdTipo, idAlmacenOrigen,
        idAlmacenDestino, IdTipoConceptoFarmacia, Observaciones, movimientoDetalle) {

        let formData = new FormData();

        formData.append('MovNumero', MovNumero);
        formData.append('MovTipo', MovTipo);
        formData.append('idEstadoMovimiento', idEstadoMovimiento);
        formData.append('idTipoLocales', idTipoLocales);
        formData.append('idTipoSuministro', idTipoSuministro);
        formData.append('documentoIdTipo', documentoIdTipo);
        formData.append('idAlmacenOrigen', idAlmacenOrigen);
        formData.append('idAlmacenDestino', idAlmacenDestino);
        formData.append('IdTipoConceptoFarmacia', IdTipoConceptoFarmacia);
        formData.append('Observaciones', Observaciones);
        formData.append('movimientoDetalle', movimientoDetalle);
        formData.append('IdListBarItem', ObtenerItemListBar());

        let res = await HttpClient.Post('/Farmacias/CrearModificarNotaIngresoSalidaFarmacia?area=Farmacia', formData)


        return res
    },



    

    async RecetaFiltrar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        let Filtro = ` RecetaCabecera.PreUnidosis = '${$('#txtNroPreUnidosisRegistro').val()}' AND RecetaCabecera.idServicioReceta = ${$('#cboServicioUnidosisRegistro').val()}`

        data.append('Filtro', Filtro);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetaFiltrar?area=Farmacia",
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

    async RecetaCabeceraDetalleSeleccionaPorNroReceta(IdReceta) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdReceta', IdReceta);

        try {
            Cargando(1);

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

    async RecetasDevuelveDatosDelDetalle(IdReceta, IdPuntoCarga, PtoCargaFarmacia) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdReceta', IdReceta);
        data.append('IdPuntoCarga', IdPuntoCarga);
        data.append('PtoCargaFarmacia', PtoCargaFarmacia);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/RecetasDevuelveDatosDelDetalle?area=Farmacia",
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

    async FactCatalogoBienesInsumosXcodigoYtipofinanciamiento(IdTipoFinanciamiento, codigo) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
        data.append('codigo', codigo);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FactCatalogoBienesInsumosXcodigoYtipofinanciamiento?area=Farmacia",
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
    async FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente(lnIdAlmacen, lcFiltro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('lnIdAlmacen', lnIdAlmacen);
        data.append('lcFiltro', lcFiltro);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente?area=Farmacia",
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

    async SeleccionaParametros(idParametro) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();


        data.append('idParametro', idParametro);

        try {
            Cargando(1);

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

            Cargando(0);
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

    async DevuelveCantidadYsobranteUnidosis(lnCantidadEnGotas, lnConvertir) {

        let lnCantidadPomo = 0;
        let lnSobranteGotas = 0;

        let lcTipoMI_99 = ''

        if (lnCantidadEnGotas == 0) {
            lnCantidadPomo = 0
            lnSobranteGotas = 0
        } else {
            lcTipoMI_99 = parseFloat(parseFloat(lnCantidadEnGotas) / parseFloat(lnConvertir)).toString()

            let pos = lcTipoMI_99.indexOf('.');

            let numTipoMI_99 = parseFloat(lcTipoMI_99.substring(pos + 1, pos + 11))

            if (!lcTipoMI_99.includes('.')) {
                lnCantidadPomo = lcTipoMI_99;
            } else if (numTipoMI_99 > 0) {
                lnCantidadPomo = parseFloat(lcTipoMI_99.substring(0, pos)) + 1;
            } else {
                lnCantidadPomo = parseFloat(lcTipoMI_99.substring(0, pos));
            }

            lnSobranteGotas = (lnCantidadPomo * lnConvertir) - lnCantidadEnGotas;
        }




        return {
            lnCantidadPomo: lnCantidadPomo,
            lnSobranteGotas: lnSobranteGotas
        }
    },

    async GeneraTemporalConDespachosYSobrantes(lcPreUnidosis, lnIdServicio, orsItemsUnidosis, orsRecetasAdespachar, lbPorDespachar) {

        // verificar si es necesario el if, es basicamente para definir el obejto
        //if (orsRecetasAdespachar.State == 1) {

        //}
        //let lcFiltro1 = ''

        //if (lbPorDespachar) {
        //    lcFiltro1 = " dbo.RecetaCabecera.idEstado=1 and dbo.RecetaCabecera.PreUnidosis= '" + lcPreUnidosis + "'  and  dbo.RecetaCabecera.idServicioReceta= " + lnIdServicio
        //} else {
        //    lcFiltro1 = " dbo.RecetaCabecera.idEstado=2 and  dbo.RecetaCabecera.PreUnidosis= '" + lcPreUnidosis + "'  and  dbo.RecetaCabecera.idServicioReceta= " + lnIdServicio
        //}

        let recetasUnidosis = await NotaSalida.RecetaFiltrar();

        if (recetasUnidosis.length == 0) {

            alerta(2, 'No hay RECETAS por despachar con esos datos')

            return false
        }



        NotaSalida.orsRecetasAdespachar = orsRecetasAdespachar


    },



    //////////////////////////////METODOS ADICIONALES///////////////////////////////////////////////////////////
    ValidarBusquedaNotasSalida() {
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
        NotaSalida.IniciarFechasBusqueda();
    },

    LimpiarCamposRegistro() {

        NotaSalida.MovNumero = ''
        
        $('#txtNroNotaSalida').val('')
        $('#txtFechaRegistroNotaSalida').val('')
        $('#txtHoraRegistroNotaSalida').val('')
        $('#txtEstadoNotaSalida').val('')

        $('#cboFarmaciasRegistro').val(0)
        //$('#cboFarmaciasRegistro').trigger('change')
        $('#cboEstadoNotaSalida').val(0);
        $('#cboConceptoRegistro').empty();
        //$('#cboConceptoRegistro').trigger('change')

        $('#cboDestinoRegistro').empty();
        $('#cboTipoDocRegistro').val(0)
        $('#txtNroDocNotaSalida').val('')
        $('#txtObservacionesRegistro').val('')

        oTable_detalleNotaSalida.fnClearTable()

        $('#cboFarmaciasRegistro').attr('disabled', false)
        $('#cboConceptoRegistro').attr('disabled', false)
        $('#cboDestinoRegistro').attr('disabled', false)
        $('#cboEstadoNotaSalida').attr('disabled', true)
        $('#cboTipoCompartimientoOrigenRegistro').attr('disabled', true)
        $('#txtNroDocNotaSalida').attr('disabled', false)

        $('#btnGuardarNotaSalida').hide()

        $('#contProductosBusqueda').hide()

        


        $('#cboAreaTerritorioNacionalRegistro').val(0)
        $('#cboUnidadDependenciaRegistro').val(0)
        $('#cboTipoCompartimientoSalidaRegistro').val(0)
        $('#cboCompartimientoSalidaRegistro').val(0)
        $('#txtDocReferenciaRegistro').val('')

        $('#cboAreaTerritorioNacionalRegistro').attr('disabled', false)
        $('#cboUnidadDependenciaRegistro').attr('disabled', false)
        $('#cboTipoCompartimientoSalidaRegistro').attr('disabled', false)
        $('#cboCompartimientoSalidaRegistro').attr('disabled', false)
        $('#txtDocReferenciaRegistro').attr('disabled', false)
        $('#contFiltrosProductos').hide();
        $('#btnConsumirRequerimiento').attr('data-estado', 'consumir')
        $('#btnConsumirRequerimiento').removeClass('btn-success')
            .addClass('btn-info')
            .html('<i class="fa fa-list-alt"></i> CONSUMIR REQUERIMIENTO');


        $('.chzn-select').chosen().trigger("chosen:updated");

       
    },

    // accion -> 2. Modificar 3. Consultar
    async CargarCamposRegistro(notaSalida) {

        NotaSalida.MovNumero = notaSalida.movNumero

        $('#txtNroNotaSalida').val(notaSalida.movNumero)
        $('#txtFechaRegistroNotaSalida').val(notaSalida.fechaCreacionMovimiento)
        $('#txtHoraRegistroNotaSalida').val(notaSalida.fechaHoraMovimiento)
        $('#txtEstadoNotaSalida').val(notaSalida.estado)

        $('#cboFarmaciasRegistro').val(notaSalida.idAlmacenOrigen)
        $('#cboFarmaciasRegistro').trigger('change')

        $('#cboConceptoRegistro').val(notaSalida.idTipoConcepto)
        $('#cboConceptoRegistro').trigger('change')

        $('#cboDestinoRegistro').val(notaSalida.idAlmacenDestino)
        $('#cboTipoDocRegistro').val(notaSalida.idTipoDocumento)
        $('#txtNroDocNotaSalida').val(notaSalida.documentoNumero)
        $('#txtObservacionesRegistro').val(notaSalida.observaciones)

        $('#cboAreaTerritorioNacionalRegistro').val(notaSalida.idAreaTerritorial)
        $('#cboAreaTerritorioNacionalRegistro').trigger('change')
        $('#cboUnidadDependenciaRegistro').val(notaSalida.idUnidadDependencia)
       
        $('#cboTipoCompartimientoSalidaRegistro').val(notaSalida.idTipoCompartimientoSalida)
        $('#cboTipoCompartimientoSalidaRegistro').trigger('change')

        $('#cboCompartimientoSalidaRegistro').val(notaSalida.idAlmacenDestino)
        $('#cboEstadoNotaSalida').val(notaSalida.idEstadoReserva)
        $('#txtDocReferenciaRegistro').val(notaSalida.docReferencia)
        $('#hndReserva').val(notaSalida.idReserva)

        $('#cboAreaTerritorioNacionalRegistro').attr('disabled', false)
        $('#cboUnidadDependenciaRegistro').attr('disabled', false)
        $('#cboTipoCompartimientoSalidaRegistro').attr('disabled', false)
        $('#cboCompartimientoSalidaRegistro').attr('disabled', false)
        $('#cboEstadoNotaSalida').attr('disabled', false)
        $('#txtDocReferenciaRegistro').attr('disabled', false)


        await NotaSalida.FarmMovimientoDetalleByidReserva(notaSalida.idReserva)
        if (NotaSalida.TipoAccion == 'M') { // modificar
            $('#TabPanelRegistro').find('input, select').prop('disabled', false);
            $('#btnGuardarNotaSalida').show()
        } else if (NotaSalida.TipoAccion == 'C') { // consultar
            $('#TabPanelRegistro').find('input, select').prop('disabled', true);
            $('#btnGuardarNotaSalida').hide()
        }
        $('#contFiltrosProductos').show();

        $('#txtNroNotaSalida').attr('disabled', true)
        $('#txtFechaRegistroNotaSalida').attr('disabled', true)
        $('#txtHoraRegistroNotaSalida').attr('disabled', true)
        $('#txtEstadoNotaSalida').attr('disabled', true)

        $('#cboFarmaciasRegistro').attr('disabled', true)
        $('#cboConceptoRegistro').attr('disabled', true)
        $('#cboDestinoRegistro').attr('disabled', true)
        $('#cboTipoDocRegistro').attr('disabled', true)
        $('#txtNroDocNotaSalida').attr('disabled', true)
        NotaSalida.BloquearCabecera(true);
        if (NotaSalida.idEstadoReserva = 1 && NotaSalida.TipoAccion == 'M') {
            $('#btnConsumirRequerimiento').show()
            $('#btnConsumirRequerimiento')
                .attr('data-estado', 'concluir')
                .removeClass('btn-info')
                .addClass('btn-success')
                .html('<i class="fa fa-check"></i> CONCLUIR PARCIAL GUÍA');
        } else {
            $('#btnConsumirRequerimiento').hide()
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },



    BloquearCabecera(bBloqueo) {

        $('#cboFarmaciasRegistro').attr('disabled', bBloqueo)
        $('#cboConceptoRegistro').attr('disabled', bBloqueo)
        $('#txtDocReferenciaRegistro').attr('disabled', bBloqueo)
        $('#cboAreaTerritorioNacionalRegistro').attr('disabled', bBloqueo)
        $('#cboUnidadDependenciaRegistro').attr('disabled', bBloqueo)
        $('#cboTipoCompartimientoSalidaRegistro').attr('disabled', bBloqueo)
        $('#cboCompartimientoSalidaRegistro').attr('disabled', bBloqueo)
        $('#chkIndicadorBajaRegistro').attr('disabled', bBloqueo)
        $('#cboTipoCompartimientoOrigenRegistro').attr('disabled', bBloqueo)
        $('#cboEstadoNotaSalida').attr('disabled', bBloqueo)
        

    },




    ValidarDatosObligatorios() {
        if ($('#cboFarmaciasRegistro').val() == 0) {
            alerta(2, 'Por favor elija el Almacén de Origen.')
            return false
        }

        if ($('#cboConceptoRegistro').val() == 0) {
            alerta(2, 'Por favor elija el Concepto.')
            return false
        }

        if ($('#cboDestinoRegistro').val() < 0) {
            alerta(2, 'Por favor elija el Almacén de Destino.')
            return false
        }

        if ($('#txtNroDocNotaSalida').val() == 0) {
            alerta(2, 'Por favor ingrese el N° de Documento.')
            return false
        }

        if (oTable_detalleNotaSalida.api(true).data().toArray().length == 0) {
            alerta(2, 'Ingrese al menos un producto a la lista por favor.')
            return false
        }

        return true
    },


    ValidarDatosObligatoriosReserva() {
        if ($('#cboFarmaciasRegistro').val() == 0) {
            alerta(2, 'Por favor elija el Almacén de Origen.')
            return false
        }

        if ($('#cboConceptoRegistro').val() == 0) {
            alerta(2, 'Por favor elija el Concepto.')
            return false
        }

        if ($('#cboDestinoRegistro').val() < 0) {
            alerta(2, 'Por favor elija el Almacén de Destino.')
            return false
        }

        if ($('#txtNroDocNotaSalida').val() == 0) {
            alerta(2, 'Por favor ingrese el N° de Documento.')
            return false
        }

        if ($('#cboAreaTerritorioNacionalRegistro').val() == 0) {
            alerta(2, 'Por favor ingrese el Territorio Nacional.')
            return false
        }
        if ($('#cboUnidadDependenciaRegistro').val() == 0) {
            alerta(2, 'Por favor elija la unidad de dependencia.')
            return false
        }
        if ($('#cboTipoCompartimientoSalidaRegistro').val() == 0) {
            alerta(2, 'Por favor elija el tipo de compartimiento de salida.')
            return false
        }
        if ($('#cboCompartimientoSalidaRegistro').val() == 0) {
            alerta(2, 'Por favor elija el compartimiento de salida.')
            return false
        }

       

        return true
    },


}


$(document).ready(function () {
    NotaSalida.Iniciar()

});
