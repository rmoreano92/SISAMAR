var oTable_DetalleServiciosProductos = null;
var detalleListaServicios = null;
var detalleListaProductos = null;
var BusquedaServiciosProductos = {
    tipoBusqueda: '',
    idTipoFinanciamiento: 0,
    idPuntoCarga: 0,
    tipoServicioOfrecido: 0,
    estaVisualizando: '',
    cantidadEditable: 0,
    precioEditable: 0,
    productoEditable: 0,
    //tblHeightDetalleProductosServicios: 250,
   
    Iniciar() {
        BusquedaServiciosProductos.Eventos();
        BusquedaServiciosProductos.DataTableServiciosProductosBuscados();
        BusquedaServiciosProductos.DatablesDetalleServiciosProductos();
        BusquedaServiciosProductos.LimpiarFrameBusqueda();
        BusquedaServiciosProductos.Limpiar();
        
    },

    IniciarVariables(tipoBusqueda, idTipoFinanciamiento, idPuntoCarga, tipoServicioOfrecido) {
        BusquedaServiciosProductos.tipoBusqueda = tipoBusqueda;
        BusquedaServiciosProductos.idTipoFinanciamiento = idTipoFinanciamiento;
        BusquedaServiciosProductos.idPuntoCarga = idPuntoCarga;
        BusquedaServiciosProductos.tipoServicioOfrecido = tipoServicioOfrecido;
    },

    DataTableServiciosProductosBuscados() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '20vh',
            autoWidth: false,
            columns: [
                //{
                //    width: '0%',
                //    targets: 0,
                //    visible: false,
                //    data: "idProducto",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '0%',
                //    targets: 0,
                //    visible: false,
                //    data: "idPuntoCarga",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
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
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }
        var tableWrapper = $('#tblServiciosProductosBuscados');
        oTable_ServiciosProductosBuscados = $("#tblServiciosProductosBuscados").dataTable(parms);
        $('#tblServiciosProductosBuscados_length').css('display', 'none');

        //let offSetElement = $('#frameBusquedaProductos').offset();
        //$('#frameResultadosBusquedaProductos').css({
        //    top: offSetElement.top,
        //    left: offSetElement.left
        //});

    },

    DatablesDetalleServiciosProductos() {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
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
                    width: '6%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        //if (rowData.idLabEstado == 0) {
                        //    $(td).parent().css('color', '#f44336');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }
                },
                {
                    width: '49%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 0,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')                        
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = '';
                        if (BusquedaServiciosProductos.cantidadEditable == 1) {
                            inputCantidad = '  <input type="text" id="txtCantidadServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.cantidad, 1) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCampoDetalle dCantidadServicioProducto">'
                        } else if (BusquedaServiciosProductos.cantidadEditable == 0) {
                            inputCantidad = '<div id="htmlCantidadServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '">' + isNull(rowData.cantidad, 1) + '</div>';
                        }
                        
                        $(td).html(inputCantidad);

                    }
                },                
                {
                    width: '7%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'right');
                        let inputPrecio = '';
                        if (BusquedaServiciosProductos.precioEditable == 1) {
                            inputPrecio = '  <input type="text" id="txtPrecioUnitarioServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.precioUnitario, 1) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-decimal dCampoDetalle dPrecioUnitarioServicioProducto">'
                        } else if (BusquedaServiciosProductos.precioEditable == 0) {
                            //inputCantidad = '<div id="htmlCantidadServicioProducto_' + rowData.idProducto + '">' + isNull(rowData.cantidad, 1) + '</div>';
                            inputPrecio = '<div id="htmlPrecioUnitarioServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '">' + formatoDecimal(parseFloat(isNull(rowData.precioUnitario, 0.00))) + '</div>'
                        }                        
                        $(td).html(inputPrecio);

                    }
                },                
                {
                    width: '7%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'right');
                        let inputTotal = '<div id="htmlSubTotalServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '" data-fila="' + rowData.index + '" class="dSubTotalServicioProducto">' + formatoDecimal(parseFloat(isNull(rowData.subTotal, isNull(rowData.precioUnitario, 0.00)))) + '</div>'
                        $(td).html(inputTotal);

                    }
                },
                {
                    width: '7%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'right');
                        let inputDescuento = '<div id="htmlDescuentoServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '" data-fila="' + rowData.index + '" class="dDescuentoServicioProducto">' + formatoDecimal(parseFloat(isNull(rowData.descuento, 0.00))) + '</div>'
                        $(td).html(inputDescuento);

                    }
                },
                {
                    width: '7%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'right');
                        let inputTotal = '<div id="htmlSubTotalNetoServicioProducto_' + rowData.idProducto + '_' + rowData.idOrden + '" data-fila="' + rowData.index + '" class="dSubTotalNetoServicioProducto">' + formatoDecimal(parseFloat(isNull(rowData.subTotalNeto, isNull(rowData.precioUnitario, 0.00)))) + '</div>'
                        $(td).html(inputTotal);

                    }
                },
                
            ]

        }

        var tableWrapper = $('#tblDetalleServiciosProductos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DetalleServiciosProductos = $("#tblDetalleServiciosProductos").dataTable(parms);

    },

    Eventos() {
        /*-----------------------------DETALLE DE PRODUCTOS---------------------------------------------------------*/
        $('#tblDetalleServiciosProductos tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_DetalleServiciosProductos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });

        $(document).on("keyup", ".dCantidadServicioProducto", function () {
            let idElement = $(this).prop("id");
            let split = idElement.split("_")
            let idProducto = split[1];
            let idOrden = split[2];
            let cantidad = parseInt($("#" + idElement).val());
            let precio = formatoDecimal(parseFloat($("#htmlPrecioUnitarioServicioProducto_" + idProducto + "_" + idOrden).html()));
            let subtotal = formatoDecimal(parseFloat(cantidad * precio));
            let descuento = formatoDecimal(parseFloat($("#htmlDescuentoServicioProducto_" + idProducto + "_" + idOrden).html()));
            let total = formatoDecimal(parseFloat(subtotal - descuento));
            $("#htmlSubTotalServicioProducto_" + idProducto + "_" + idOrden).html(subtotal);
            $("#htmlSubTotalNetoServicioProducto_" + idProducto + "_" + idOrden).html(total);

            let idProductoBS = parseInt(idProducto);
            let idOrdenBS = parseInt(idOrden);
            if (BusquedaServiciosProductos.estaVisualizando == 'S') {                
                let indexS = detalleListaServicios.findIndex(p => p.idProducto === idProductoBS && p.idOrden === idOrdenBS);

                if (indexS !== -1) {
                    detalleListaServicios[indexS].cantidad = cantidad;
                    detalleListaServicios[indexS].precioUnitario = precio;
                    detalleListaServicios[indexS].subTotal = subtotal;
                    detalleListaServicios[indexS].descuento = descuento;
                    detalleListaServicios[indexS].subTotalNeto = total;
                }
            } else if (BusquedaServiciosProductos.estaVisualizando == 'B') {
                let indexP = detalleListaProductos.findIndex(p => p.idProducto === idProductoBS && p.idOrden === idOrdenBS);

                if (indexP !== -1) {
                    detalleListaProductos[indexP].cantidad = cantidad;
                    detalleListaProductos[indexP].precioUnitario = precio;
                    detalleListaProductos[indexP].subTotal = total;
                    detalleListaServicios[indexP].descuento = descuento;
                    detalleListaServicios[indexP].subTotalNeto = total;
                }
            }

            BusquedaServiciosProductos.Totalizar();
            BusquedaServiciosProductos.TotalizarServiciosProductos();
        });

        $(document).on("keyup", ".dPrecioUnitarioServicioProducto", function () {
            let idElement = $(this).prop("id");
            let split = idElement.split("_")
            let idProducto = split[1];
            let idOrden = split[2];
            let precio = new Decimal($("#" + idElement).val());
            //let cantidad = formatoDecimal(parseFloat($("#htmlPrecioUnitarioServicioProducto_" + idProducto[1]).html()));
            let cantidad = 1;
            let subtotal = precio.times(cantidad);
            let descuento = new Decimal($("#htmlDescuentoServicioProducto_" + idProducto + "_" + idOrden).html());
            let total = subtotal.minus(descuento);
            $("#htmlSubTotalServicioProducto_" + idProducto + "_" + idOrden).html(subtotal.toString());
            $("#htmlSubTotalNetoServicioProducto_" + idProducto + "_" + idOrden).html(total.toString());

            let idProductoBS = parseInt(idProducto);
            let idOrdenBS = parseInt(idOrden);
            if (BusquedaServiciosProductos.estaVisualizando == 'S') {
                let indexS = detalleListaServicios.findIndex(p => p.idProducto === idProductoBS && p.idOrden === idOrdenBS);

                if (indexS !== -1) {
                    detalleListaServicios[indexS].cantidad = cantidad;
                    detalleListaServicios[indexS].precioUnitario = precio;
                    detalleListaServicios[indexS].subTotal = total;
                    detalleListaServicios[indexS].descuento = descuento;
                    detalleListaServicios[indexS].subTotalNeto = total;
                }
            } else if (BusquedaServiciosProductos.estaVisualizando == 'B') {
                let indexP = detalleListaProductos.findIndex(p => p.idProducto === idProductoBS && p.idOrden === idOrdenBS);

                if (indexP !== -1) {
                    detalleListaProductos[indexP].cantidad = cantidad;
                    detalleListaProductos[indexP].precioUnitario = precio;
                    detalleListaProductos[indexP].subTotal = total;
                    detalleListaServicios[indexP].descuento = descuento;
                    detalleListaServicios[indexP].subTotalNeto = total;
                }
            }

            BusquedaServiciosProductos.Totalizar();
            BusquedaServiciosProductos.TotalizarServiciosProductos();
        });

        //========================= BUSQUEDA PRODUCTOS =======================================================================//
        $('#txtCodigoServicioProductoBusqueda').on("keyup", async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                //if (LabMovimiento.idTipoFinanciamiento > 0 && (LabMovimiento.idPaciente > 0 || LabMovimiento.idComprobantePago > 0)) {
                    $("#txtNombreServicioProductoBusqueda").val("");
                    let busqueda = $("#txtCodigoServicioProductoBusqueda").val().trim();
                    await BusquedaServiciosProductos.ListarServiciosProductos('C', busqueda);
                //} else {
                //    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                //}
            }
        });

        $('#txtNombreServicioProductoBusqueda').on('input', async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                //if (ImgMovimiento.idTipoFinanciamiento > 0 && (ImgMovimiento.idPaciente > 0 || ImgMovimiento.idComprobantePago > 0)) {
                $("#txtCodigoServicioProductoBusqueda").val("");
                let busqueda = $("#txtNombreServicioProductoBusqueda").val().trim();
                await BusquedaServiciosProductos.ListarServiciosProductos('N', busqueda);
                //} else {
                //    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                //}
            }
        });

        $('#tblServiciosProductosBuscados tbody').on('click', 'tr', function () {
            oTable_ServiciosProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });
        $('#tblServiciosProductosBuscados tbody').on('dblclick', 'tr', function () {

            oTable_ServiciosProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let pos = oTable_ServiciosProductosBuscados.api(true).row($(this)).index();
            let row = oTable_ServiciosProductosBuscados.fnGetData(pos);

            BusquedaServiciosProductos.AgregarServicioProducto(row); 
        });

        $('#btnAgregaServicioProducto').on('click', async function () {
            if (BusquedaServiciosProductos.productoEditable == 0) {
                return;
            }
            //let pos = oTable_ServiciosProductosBuscados.api(true).row($(this)).index();
            //let row = oTable_ServiciosProductosBuscados.fnGetData(pos);
            let row = oTable_ServiciosProductosBuscados.api(true).row('.selected').data();
            //console.log('pos', pos)
            //console.log('row', row)

            BusquedaServiciosProductos.AgregarServicioProducto(row);
        });

        $('#btnQuitarServicioProducto').on('click', function () {
            if (BusquedaServiciosProductos.productoEditable == 0) {
                return;
            }

            var objrowTb = oTable_DetalleServiciosProductos.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                BusquedaServiciosProductos.QuitarServicioProducto();
            } else {
                alerta2("info", "", "Por favor seleccione un item para eliminar.");
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
                $("#txtCodigoServicioProducto").val("");
                $("#txtNombreServicioProducto").val("");
                $("#txtNombreServicioProducto").focus();
            }

            //if (e.keyCode === 38) {
            //    e.preventDefault();
            //    selectedRow = oTable_ServiciosProductosBuscados.api(true).row('.selected');
            //    indice = selectedRow.index()
            //    if (isEmpty(indice) == false) {
            //        indice = indice - 1;
            //    } else {
            //        indice = 0;
            //    }

            //    if (indice >= 0) {
            //        oTable_ServiciosProductosBuscados.$('tr.selected').removeClass('selected');
            //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //    }
            //}

            //if (e.keyCode === 40) {
            //    e.preventDefault();
            //    selectedRow = oTable_ServiciosProductosBuscados.api(true).row('.selected');
            //    indice = selectedRow.index()
            //    if (isEmpty(indice) == false) {
            //        indice = indice + 1;
            //    } else {
            //        indice = 0;
            //    }

            //    if (indice >= 0) {
            //        oTable_ServiciosProductosBuscados.$('tr.selected').removeClass('selected');
            //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //    }
            //}

            if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                let selectedRow = oTable_ServiciosProductosBuscados.api(true).row('.selected');
                let indice = selectedRow.index();

                if (!isEmpty(indice)) {
                    indice = e.keyCode === 38 ? indice - 1 : indice + 1;
                } else {
                    indice = 0;
                }

                if (indice >= 0) {
                    oTable_ServiciosProductosBuscados.$('tr.selected').removeClass('selected');
                    let newRow = $('#tblServiciosProductosBuscados tbody tr:eq(' + indice + ')');
                    newRow.addClass('selected');

                    // Desplazar el scroll para que la fila sea visible
                    if (isEmpty(newRow[0]) == false) {
                        newRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

                }
            }

            if (e.which == 13) {
                //if ($("#frameResultadosBusquedaServiciosProdutos").is(":visible")) {
                if ($(e.target).is('#txtCodigoServicioProductoBusqueda') || $(e.target).is('#txtNombreServicioProductoBusqueda')) {
                    e.preventDefault();
                    //let objrowTb = oTable_ServiciosProductosBuscados.api(true).row('.selected').data();

                    //if (isEmpty(objrowTb) == false) {
                    //    Laboratorio.AgregarProducto(objrowTb);
                    //} else {
                    //    alerta2("info", "", "Por favor seleccione un producto para agregar.");
                    //}
                    $("#btnAgregaServicioProducto").click();
                }

                if ($(e.target).is('.dCantidadServicioProducto') /*|| $(e.target).is('.txtCantidadPedida')*/) {
                    e.preventDefault();
                    $("#txtNombreServicioProductoBusqueda").focus();
                }
            }

        });

        $(document).on('keydown', async function (e) {
            if (e.key === 'Delete' || e.keyCode === 46) {
                e.preventDefault();
                $("#btnQuitarServicioProducto").click();
            }

            if (e.key === 'F10' || e.keyCode === 121) {
                e.preventDefault();
                $("#txtNombreServicioProductoBusqueda").val("");
                await BusquedaServiciosProductos.ListarServiciosProductos('N', '');
                $("#txtNombreServicioProductoBusqueda").focus();
            }
        });

        $('#TabDetalleServicios').on('click', function () {
            oTable_DetalleServiciosProductos.fnClearTable();
            if (!isEmpty(detalleListaServicios)) {
                oTable_DetalleServiciosProductos.fnAddData(detalleListaServicios);
                oTable_DetalleServiciosProductos.resize();                
            }   

            BusquedaServiciosProductos.estaVisualizando = 'S';

            BusquedaServiciosProductos.Totalizar();
            BusquedaServiciosProductos.TotalizarServiciosProductos();
        });

        $('#TabDetalleProductos').on('click', function () {
            oTable_DetalleServiciosProductos.fnClearTable();
            if (!isEmpty(detalleListaProductos)) {
                oTable_DetalleServiciosProductos.fnAddData(detalleListaProductos);
                oTable_DetalleServiciosProductos.resize();                
            }    

            BusquedaServiciosProductos.estaVisualizando = 'B';

            BusquedaServiciosProductos.Totalizar();
            BusquedaServiciosProductos.TotalizarServiciosProductos();
        });

        
        //=====================================================================================================================//
    },

    //////////////////CONSULTAS////////////////////////////////////////
    async ListarServiciosProductos(busquedaPor, busqueda) {
        let resp = null;
        let datos = null;
        let filtroBusqueda = "";
        let midata = new FormData();

        try {
            oTable_ServiciosProductosBuscados.fnClearTable();
            if (busqueda.length >= 2 && BusquedaServiciosProductos.idTipoFinanciamiento > 0) {
                if (BusquedaServiciosProductos.tipoBusqueda == 'S') {
                    //if (BusquedaServiciosProductos.idPuntoCarga != 1 && BusquedaServiciosProductos.idPuntoCarga != 99) {
                    if (!isEmpty(BusquedaServiciosProductos.idPuntoCarga)) {
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosPtos.idPuntoCarga = " + BusquedaServiciosProductos.idPuntoCarga
                    }

                    //if (BusquedaServiciosProductos.idTipoFinanciamiento != 0) {
                    if (!isEmpty(BusquedaServiciosProductos.idTipoFinanciamiento)) {
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosHosp.idTipoFinanciamiento = " + BusquedaServiciosProductos.idTipoFinanciamiento
                    }

                    //if (BusquedaServiciosProductos.tipoServicioOfrecido != 0) {
                    if (!isEmpty(BusquedaServiciosProductos.tipoServicioOfrecido)) {
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.EsCPT = " + BusquedaServiciosProductos.tipoServicioOfrecido
                    }

                    if (busqueda != "") {
                        if (busquedaPor == "C") {      //C: busqeuda por codigo
                            filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Codigo like '" + busqueda + "%' "
                        } else if (busquedaPor == "N") {       //N: busqeuda por nombre
                            filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Nombre like '%" + busqueda + "%' "
                        }
                    }
                } else if (BusquedaServiciosProductos.tipoBusqueda == 'B') {

                }

                midata.append('tipoBusqueda', BusquedaServiciosProductos.tipoBusqueda);
                midata.append('filtro', filtroBusqueda);

                Cargando(1);
                $("#frameResultadosBusquedaServiciosProdutos").show();
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Comun/FactCatalogoServiciosBienesBusqueda?area=Comun",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                //console.log(datos.respuesta);
                //if (Object.keys(datos.respuesta).length === 0) {
                //    console.log("El objeto está vacío");
                //} else {
                //    console.log("El objeto tiene datos");
                //}
                if (datos.respuesta.table.length > 0) {
                    oTable_ServiciosProductosBuscados.fnAddData(datos.respuesta.table);
                    oTable_ServiciosProductosBuscados.resize();

                    //resp = datos.lstData.table[0];

                    if (!isElementFullVisible(document.getElementById('frameResultadosBusquedaServiciosProdutos'))) {
                        //console.log("El div NOOOOO es completamente visible y necesita scroll.");
                        smoothScrollToContent($('#frameResultadosBusquedaServiciosProdutos'));
                    }

                }
            } else {
                $("#frameResultadosBusquedaServiciosProdutos").hide();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", error.toString());
        }
        //return resp;
    },

    


    
    ///////////////////////////////////////////////////////////////////

    //////////////////////METODOS//////////////////////////////////////////////////////
    QuitarServicioProducto() {
        if (BusquedaServiciosProductos.productoEditable == 0) {
            return;
        }

        swal({
            title: 'Eliminar',
            text: "¿Esta seguro que desea eliminar el item seleccionado?",
            type: 'question',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function () {
            let objDetalle = oTable_DetalleServiciosProductos.api(true).row('.selected').data();
            oTable_DetalleServiciosProductos.api(true).row('.selected').remove().draw(false);
            oTable_DetalleServiciosProductos.resize();
            //console.log(objDetalle);
            detalleListaServicios = detalleListaServicios.filter(item => item.idProducto !== objDetalle.idProducto);

            BusquedaServiciosProductos.Totalizar();
            BusquedaServiciosProductos.TotalizarServiciosProductos();
        }, function (dimiss) {

        });
        
    },
       
    AgregarServicioProducto(obj) {
        if (BusquedaServiciosProductos.productoEditable == 0) {
            return;
        }

        if (isEmpty(obj)) {
            alerta2("info", "", "Por favor seleccione un item para agregar.");
            return false;
        }

        let item = {
            idProducto: obj.idProducto,
            codigo: obj.codigo,
            nombre: obj.nombre,
            //saldo: row.saldo,
            cantidad: 1,
            precioUnitario: obj.precioUnitario,
            subTotal: obj.precioUnitario,
            descuento: 0,
            idOrden: obj.idOrden
            //tipo: row.tipo,
            //lote: row.lote,
            //fechaVencimiento: row.fechaVencimiento,
            //idTipoSalidaBienInsumoSaldo: row.idTipoSalidaBienInsumoSaldo,
            //fechaVencimientoFormat: row.fechaVencimientoFormat,
            //tipoPsicotropico: row.tipoPsicotropico,
        }

        if (BusquedaServiciosProductos.ItemYaExiste(obj.idProducto)) {
            //alerta2(2, 'El producto ya fue agregado')
            return false
        }

        oTable_DetalleServiciosProductos.fnAddData(item);

        if (isEmpty(detalleListaServicios)) {
            detalleListaServicios = [];
        }
        detalleListaServicios.push(item);

        oTable_ServiciosProductosBuscados.fnClearTable();
        $("#txtCodigoServicioProductoBusqueda").val("")
        $("#txtNombreServicioProductoBusqueda").val("")
        $("#frameResultadosBusquedaServiciosProdutos").hide();

        //$("#txtCantidadServicioProducto" + row.idProducto).val("");
        $("#txtCantidadServicioProducto_" + obj.idProducto + '_' + obj.idOrden).focus();

        BusquedaServiciosProductos.Totalizar();
        BusquedaServiciosProductos.TotalizarServiciosProductos();
        //$('#contServiciosProductosBusqueda').hide()
    },

    ItemYaExiste(idProducto) {
        resp = false;
        let lstDetalle = BusquedaServiciosProductos.DevolverDetalleServicioProducto();
        lstDetalle.forEach(function (detalle) {
            if (detalle.idProducto == idProducto) {
                resp = true;
                alerta2("info", "", "Este item ya se encuentra registrado."); 
            }
        });

        return resp;
    },

    Totalizar() {
        let lstDetalle = BusquedaServiciosProductos.DevolverDetalleServicioProducto();
        let total = new Decimal(0.00);
        let totalDescuento = new Decimal(0.00);
        let subTotal = new Decimal(0.00);
        let descuento = new Decimal(0.00);
       // let i = 0
        lstDetalle.forEach(function (detalle) {
            //i++;
            subTotal = new Decimal(detalle.subTotal);
            //total = parseFloat(total) + parseFloat((detalle.subTotal));
            //subTotal = new Decimal(detalle.subtotal);
            total = total.plus(subTotal);
            //console.log("Item:" + i)
            //console.log(subTotal.toString())
            //console.log(total.toString())
            //console.log("------------")
            //totalDescuento = parseFloat(totalDescuento) + parseFloat((detalle.descuento));
            descuento = new Decimal(detalle.descuento);
            totalDescuento = totalDescuento.plus(descuento);
        });
        
        $("#ExoneradoDetalleServiciosProductos").val(totalDescuento).trigger('change');
        $("#TotalDetalleServiciosProductos").val(total).trigger('change');

        //return parseFloat(total).toFixed(1);
    },

    TotalizarServiciosProductos() {
        let lstDetalleServicios = detalleListaServicios;
        let lstDetalleProductos = detalleListaProductos;
        let total = new Decimal(0.00);
        let totalDescuento = new Decimal(0.00);
        let subTotal = new Decimal(0.00);
        let descuento = new Decimal(0.00);

        if (!isEmpty(lstDetalleServicios)) {
            lstDetalleServicios.forEach(function (detalleS) {
                subTotal = new Decimal(detalleS.subTotal);
                total = total.plus(subTotal);
                //total = parseFloat(total) + parseFloat((detalleS.subTotal));
                descuento = new Decimal(detalleS.descuento);
                totalDescuento = totalDescuento.plus(descuento);
                //totalDescuento = parseFloat(totalDescuento) + parseFloat((detalleS.descuento));
            });
        }
        
        if (!isEmpty(lstDetalleProductos)) {
            lstDetalleProductos.forEach(function (detalleP) {
                subTotal = new Decimal(detalleP.subTotal);
                total = total.plus(subTotal);
                //total = parseFloat(total) + parseFloat((detalleP.subTotal));
                descuento = new Decimal(detalleP.descuento);
                totalDescuento = totalDescuento.plus(descuento);
                //totalDescuento = parseFloat(totalDescuento) + parseFloat((detalleP.descuento));
            });
        }        

        $("#ExoneradoServiciosProductos").val(totalDescuento).trigger('change');
        $("#TotalServiciosProductos").val(total).trigger('change');

        //return parseFloat(total).toFixed(1);
    },

    DevolverDetalleServicioProducto() {
        let detalle= [];
        let objItemDetalle = null;
        let lstDetalle = oTable_DetalleServiciosProductos.api(true).data().toArray();
        //let lstDetalle = detalleListaProductos;
        let cantidadPedida = 0;
        let precioUnitario = 0;
        let subTotalPedido = 0.0;
        let subTotalDescuentoPedido = 0.0;
        let subTotalNetoPedido = 0.0;

        for (let [i, obj] of lstDetalle.entries()) {
            cantidadPedida = BusquedaServiciosProductos.cantidadEditable == 1 ? parseInt(isNull($('#txtCantidadServicioProducto_' + obj.idProducto + '_' + obj.idOrden).val(), 0)) : parseInt(isNull($('#htmlCantidadServicioProducto_' + obj.idProducto + '_' + obj.idOrden).html(), 0));
            //subTotalPedido = parseFloat(obj.precioUnitario * cantidadPedida).toFixed(1);
            precioUnitario = BusquedaServiciosProductos.precioEditable == 1 ? parseFloat(isNull($('#txtPrecioUnitarioServicioProducto_' + obj.idProducto + '_' + obj.idOrden).val(), 0)) : parseFloat(isNull($('#htmlPrecioUnitarioServicioProducto_' + obj.idProducto + '_' + obj.idOrden).html(), 0));
            subTotalPedido = parseFloat(isNull($('#htmlSubTotalServicioProducto_' + obj.idProducto + '_' + obj.idOrden).html(), 0.0));
            subTotalDescuentoPedido = parseFloat(isNull($('#htmlDescuentoServicioProducto_' + obj.idProducto + '_' + obj.idOrden).html(), 0.0));
            subTotalNetoPedido = parseFloat(isNull($('#htmlSubTotalNetoServicioProducto_' + obj.idProducto + '_' + obj.idOrden).html(), 0.0));

            objItemDetalle = {
                index: obj.index,               //para controlar cada fila como unica
                idProducto: obj.idProducto,                
                cantidad: cantidadPedida,
                precioUnitario: precioUnitario,                
                subTotal: subTotalPedido,
                descuento: subTotalDescuentoPedido,
                subTotalNeto: subTotalNetoPedido
            }

            detalle.push(objItemDetalle);

        }

        return detalle;
    },

    
    BloquearServicios() {
        $("#TabDetalleServicios").hide();
    },

    BloquearProductos() {
        $("#TabDetalleProductos").hide();
    },

    DesbloquearServicios() {
        $("#TabDetalleServicios").show();
    },

    DesbloquearProductos() {
        $("#TabDetalleProductos").show();
    },

    BloquearBusquedaServiciosProductos() {
        $("#frameBusquedaProductos").hide();
        $("#framBusquedaServiciosProductos").hide();
        
        BusquedaServiciosProductos.BloquearServicios()
        BusquedaServiciosProductos.BloquearProductos();
        $(".dCantidadServicioProducto").attr("disabled", true);
    },

    DesbloquearBusquedaServiciosProductos() {
        $("#frameBusquedaProductos").show();
        $("#framBusquedaServiciosProductos").show();
        BusquedaServiciosProductos.DesbloquearServicios()
        BusquedaServiciosProductos.DesbloquearProductos();
        $(".dCantidadServicioProducto").removeAttr("disabled");
    },

    LimpiarFrameBusqueda() {
        $("#frameResultadosBusquedaServiciosProdutos").hide();
    },

    Limpiar() {
        //$("#frameResultadosBusquedaServiciosProdutos").hide();
        BusquedaServiciosProductos.estaVisualizando = "S";
        $("#TabDetalleServicios").click();

        detalleListaServicios = null;
        detalleListaProductos = null;

        oTable_DetalleServiciosProductos.fnClearTable();
        //BusquedaServiciosProductos.cantidadEditable = 0;
        //BusquedaServiciosProductos.precioEditable = 0;


        $("#TotalDetalleServiciosProductos").val("");
        $("#ExoneradoDetalleServiciosProductos").val("");
        $("#TotalServiciosProductos").val("");
        $("#ExoneradoServiciosProductos").val("");
    },
    //////////////////////////////////////////////////////////////////////////////////
    
}