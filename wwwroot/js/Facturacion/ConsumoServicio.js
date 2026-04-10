

var ConsumoServicio = {

    idAtencion: 0,
    Intervenciones: [],

    async verificarEstadosCuenta(nroCuenta, permiso) {
        var midata = new FormData();
        let estado, descripcionEstado;

        midata.append('idCuenta', nroCuenta);
        await $.ajax({
            method: "POST",
            url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {

                    estado = datos.table[0].idEstado;
                    descripcionEstado = datos.table[0].estadoCta;
                    servicioAnterior = datos.table[0].servicioAnterior;
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return { estado, descripcionEstado, servicioAnterior };
    },
    plugins() {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaIniLista,#txtFechaFinLista,#txtFechaRealiza').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });
        $('.chosen-container').css({ "width": "100%" });
        $('.chosen-drop').css({ minWidth: '80%', width: 'auto' });

    },
    cargaInicial() {
        $("#txtFechaIniLista").val(ConsumoServicio.fechaDiaActual());
        $("#txtFechaFinLista").val(ConsumoServicio.fechaDiaActual());
    },
    calculaTotal() {
        total = 0.00
        otableConsumo = oTable_DetalleConsumo.api(true).rows().data();
        otableConsumo.each(function (value, index) {
            total = parseInt(total) + parseInt(otableConsumo[index]["total"])
        });
        return total
    },
    listaPuntosCarga() {

        $.ajax({
            async: false,
            cache: false,
            url: "/ConsumoServicio/ListaPuntoCargas?area=Facturacion",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboPuntoCarga').empty();
                $('#cboPuntoCargaRegistro').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboPuntoCarga').append('<option  value="' + obj.idPuntoCarga + '">' + obj.descripcion + '</option>');
                    $('#cboPuntoCargaRegistro').append('<option  value="' + obj.idPuntoCarga + '">' + obj.descripcion + '</option>');

                });
                $('#cboPuntoCarga').val(1);
                $('.chzn-select').chosen().trigger("chosen:updated");
                //$('.chzn-select').chosen();
                //$('.chzn-drop').css({ "width": "300px" });

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar puntos de carga!", "2");
                }, 900)
            }
        });
    },
    listaServicios() {

        $.ajax({
            async: false,
            cache: false,
            url: "/ConsumoServicio/ListaServiciosQueSonPuntosCarga?area=Facturacion",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboConsultorio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedencia').append('<option  ptcarga=' + obj.idPuntoCarga + ' value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');


                });

                $('.chzn-select').chosen().trigger("chosen:updated");
                //$('.chzn-select').chosen();
                //$('.chzn-drop').css({ "width": "300px" });

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },
    listaPlan() {
        var midata = new FormData();
        midata.append('filtro', ' ');

        $.ajax({
            type: "post",
            url: "/ConsumoServicio/TipoFinanciamientosDevuelveSoloFarmacia?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboPlan').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboPlan').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');

                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },

    InitDataTablesIntervencionesEnfemeria() {
        var parms = {
            scrollY: "145px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "15%",
                    targets: 0,
                    data: "idIntervencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblIntervencionesEnfemeria'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_IntervencionesEnfemeria = $("#tblIntervencionesEnfemeria").dataTable(parms);
    },

    initDatablesConsumoServicio() {


        var parms = {
            destroy: true,
            responsive: true,
            bFilter: false,
            "order": [[0, "desc"]],
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "estadoOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "ordeN_PAGO",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')



                        if (rowData.idEstadoFacturacion == 9) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstadoFacturacion == 4) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }


            ]

        }

        var tableWrapper = $('#tblConsumoServicio'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ConsumoServicio = $("#tblConsumoServicio").dataTable(parms);


    },

    
    initDatables() {


        var parms = {
            "scrollY": "200px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {

                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    data: "nombre",
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
                    width: '15%',
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    data: "condicionIngresoDescripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    data: "labConfHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }




            ]

        }

        var tableWrapper = $('#tblDetalleConsumo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DetalleConsumo = $("#tblDetalleConsumo").dataTable(parms);


    },

    initDatablesInterconsulta() {


        var parms = {
            "scrollY": "200px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {

                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    data: "nombre",
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
                    width: '15%',
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    data: "labConfHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }




            ]

        }

        var tableWrapper = $('#tblDetalleConsumo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DetalleConsumo = $("#tblDetalleConsumo").dataTable(parms);

    },

    

    initDatablesHistorialDetalleConsumo() {


        var parms = {
            "scrollY": "200px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '10%',
                    data: "idCuentaAtencion",
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
                    data: "nombre",
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
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },




            ]

        }

        var tableWrapper = $('#tblHistorialDetalleConsumo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_HistorialDetalleConsumo = $("#tblHistorialDetalleConsumo").dataTable(parms);


    },
    existeProd(idproducto) {

        lstProductosConsumo = oTable_DetalleConsumo.api(true).rows().data();
        if (lstProductosConsumo.length == 0) {
            return false;
        }

        for (var i = 0; i < lstProductosConsumo.length; i++) {
            if (lstProductosConsumo[i].idProducto == idproducto) {

                return true;
            }
        }

    }
    ,
    agregarProdConsumo() {
        var objselec = $("#cboProductoServicio").val();

        if (ConsumoServicio.existeProd(objselec)) {

            alerta(2, $('#cboProductoServicio option:selected').text() + " ya fue agregado.");
            return false;
        }
        else {
            precioUnitario = ConsumoServicio.asignaPrecio(objselec, $('#hdIdTipoFuenteFianConsumo').val())

            if ($('#txtCantidadCpt').val() > 0) {
                var objRow = {
                    idProducto: objselec,
                    nombre: $('#cboProductoServicio option:selected').text(),
                    cantidad: $('#txtCantidadCpt').val(),
                    precio: precioUnitario,
                    total: precioUnitario * $('#txtCantidadCpt').val(),
                    labConfHIS: $('#hdUsaLabs').val() == '1' ? $('#txtLabCpt').val() : $('#cbolabCpt').val(),
                    dx: $('#cboDxCpt').val(),
                    condicionIngreso: $('#cboCondicionIngreso').val(),
                    condicionIngresoDescripcion: $('#cboCondicionIngreso').val() != 0 ? $('#cboCondicionIngreso option:selected').text() : '',
                    codigo: $("#cboProductoServicio option:selected").attr('codigo')
                }
                oTable_DetalleConsumo.api(true).row.add(objRow).draw(false);
                oTable_DetalleConsumo.resize();

                $('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
            }
            else {
                alerta(2, "Ingrese una cantidad correcta");
                $("#txtCantidadCpt").focus();
                return false;
            }


        }


    }
    ,
    asignaPrecio(idproducto, idTipoFinanciamiento) {
        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idproducto);
        midata.append('idpuntoCarga', 0);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);


        $.ajax({
            method: "POST",
            url: "/Catalogo/ProductoByIdByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

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
                    alerta("ERROR", "Error asignar precio!", "2");
                    return 0
                }, 900)
            }
        });

        return precio;
    },
    AtencionesEstanciaHospitalariaPorIdCuenta(idCuenta) {
        //Cargando(1)
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);

        var idServicio = 0

        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Atencion/AtencionesEstanciaHospitalariaPorIdCuenta?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length > 0) {
                    idServicio = datos.table[0].idServicio
                }
                else {
                    idServicio = 0
                }

            },
            error: function (msg) {
                idServicio = 0
            }
        });

        return idServicio
    },
    ListaCptByPuntoCargaByFuente(idPuntoCarga, idTipoFinanciamiento) {
        Cargando(1)
        var midata = new FormData();
        midata.append('idPuntoCarga', idPuntoCarga);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);
        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Catalogo/ListaCptByPuntoCargaByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                $('#cboProductoServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProductoServicio').append('<option  value="' + obj.idProducto + '"' + 'codigo="' + obj.codigo + '"' + '>' + obj.codigo + ' - ' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    ListaConsumoServicioByfechas() { // JDELGADO001.2
        Cargando(1)
        oTable_ConsumoServicio.fnClearTable();

        var midata = new FormData();

        if ($("#txtFechaIniLista").val() == undefined) {
            midata.append('FechaInicio', ConsumoServicio.fechaDiaActual());
            midata.append('FechaFin', ConsumoServicio.fechaDiaActual());
            midata.append('idPuntoCarga', $("#cboPuntoCarga").val());
            midata.append('idCuenta', $("#txtNroCuentaLista").val());
            midata.append('historia', $("#txtNroHistoriaLista").val());
            midata.append('idOrden', $("#txtNroOdenLista").val());
            console.log("no hay fechas ConsumoServicio.js")
        } else {
            midata.append('FechaInicio', $("#txtFechaIniLista").val());
            midata.append('FechaFin', $("#txtFechaFinLista").val());
            midata.append('idPuntoCarga', $("#cboPuntoCarga").val());
            midata.append('idCuenta', $("#txtNroCuentaLista").val());
            midata.append('historia', $("#txtNroHistoriaLista").val());
            midata.append('idOrden', $("#txtNroOdenLista").val());
            console.log("si hay fechas ConsumoServicio.js")
        }

        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/ListaConsumoServicioByfechas?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.lsconsumo.table.length > 0) {
                        oTable_ConsumoServicio.fnAddData(datos.lsconsumo.table);
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    listaPorIdorden(idOrden, permiso) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        midata.append('permiso', permiso);

        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FactOrdenServicioSeleccionarPorId?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {

                    $("#txtNroOrden").val(datos.table[0].idOrden);
                    $("#hdIdOrden").val(datos.table[0].idOrden);
                    $("#txtNroCuentaRegistro").val(datos.table[0].idCuentaAtencion);
                    //alert(datos.table[0].estadoFacturacion);
                    $("#txtEstado").val(datos.table[0].estadoFacturacion);
                    //$("#txtNroOrden").val(datos.table[0].idOrden);

                    //1. respetar el orden
                    $("#txtNroCuentaRegistro").change();
                    // 1. Fin /////////////////////

                    $("#txtFechaRegistro").val(datos.table[0].fechaCreacion2);
                    $("#txtFechaRealiza").val(datos.table[0].fechaCreacion2);
                    $("#txtFechaDespacho").val(datos.table[0].fechaDespacho2);

                    ConsumoServicio.listaDetalleDespacho(datos.table[0].idOrden)


                    $("#txtNroOrdenPago").val((datos.table[0].idTipoFinanciamiento == 2) ? 0 : ConsumoServicio.listaFactOrdenServicioPagosSeleccionarPorIdOrden(datos.table[0].idOrden))
                    $("#hdIdOrdenPago").val($("#txtNroOrdenPago").val())
                    $('#modalConsumoServicio').modal('show');
                    $('#hIdPermiso').val(permiso);

                    $("#chkPlanCubre").css("visibility", 'hidden');


                    //este if usa los datos llenados en el evento change de  txtNroCuentaRegistro  1. /
                    if (datos.table[0].idTipoFinanciamiento != $("#cboPlan").val()) {

                        planOrden = datos.table[0].idTipoFinanciamiento
                        planCuenta = $("#cboPlan").val()
                        desPlanCuenta = $("#txtDesPlan").val();
                        $("#cboPlan").val(planOrden) //cambio el valor de la cuenta por el de la orden
                        $('.chzn-select').chosen().trigger("chosen:updated");
                        $("#txtDesPlan").val(""); // limpio para asignar nuevo plan
                        $("#txtDesPlan").val($('#cboPlan option:selected').html() + ' /' + desPlanCuenta);
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                        alerta(3, "No se podrá modificar datos, porque el despacho tubo otra PRODUCTO/PLAN, hubo RECALCULO");
                        //$('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
                    }

                    if (datos.table[0].idEstadoFacturacion == 4) {
                        alerta(2, 'La orden ya fue pagada, ya no se puede modificar');
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                        //$('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
                        return false;
                    }
                    else {

                        if (datos.table[0].idEstadoFacturacion == 9) {
                            alerta(2, 'La orden ya fue eliminada, ya no se puede modificar');
                            $('#btnguardarConsumo').css("visibility", 'hidden');
                            //$('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
                            return false;
                        }

                    }




                    if ($("#hdIdEstadoCuenta").val() != 1) {
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                    }
                    else {
                        $('#btnguardarConsumo').css("visibility", 'visible');
                    }

                    if (permiso == 3) {
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    limpiar() {
        $("#txtDesPlan").val("");
        $("#txtNroOrdenPago").val("");
        $("#txtNroOrden").val("");
        $("#hdIdOrden").val(0);
        $("#txtNroCuentaRegistro").val("");
        $("#txtFechaRegistro").val("");
        $("#txtFechaRealiza").val("");
        $("#txtFechaDespacho").val("");
        $("#txtPacienteRegistro").val("");
        $("#txtDesPlan").val("");
        $("#txtDesFuenteFinan").val("");
        $("#txtEstado").val("Registro");
        oTable_DetalleConsumo.fnClearTable();
        $('#btnguardarConsumo').css("visibility", 'visible');
        $("#chkPlanCubre").css("visibility", 'visible');
        $('#lblTotal').html('S/. 0.00')
        $('#chkPlanCubre').prop('checked', false);

        ConsumoServicio.Intervenciones = []
    },
    listaDetalleDespacho(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        oTable_DetalleConsumo.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FacturacionServicioDespachoDetalleFiltraPorIdOrden?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.data.table.length !== 0) {
                    oTable_DetalleConsumo.fnAddData(datos.data.table);
                    oTable_DetalleConsumo.resize();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });

        $('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
    },
    listaFactOrdenServicioPagosSeleccionarPorIdOrden(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);

        idOrdenPago = 0

        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FactOrdenServicioPagosSeleccionarPorIdOrden?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {
                    idOrdenPago = datos.table[0].idOrdenPago
                }
            },
            error: function (msg) {
                idOrdenPago = 0
            }
        });

        return idOrdenPago;
    },
    ListarProcedimientosRealizadosPorHistoriaTamizaje(IdPaciente) {
        var midata = new FormData();

        midata.append('IdPaciente', IdPaciente);

        oTable_HistorialDetalleConsumo.fnClearTable()

        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/ListarProcedimientosRealizadosPorHistoriaTamizaje?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {
                    oTable_HistorialDetalleConsumo.fnAddData(datos.table)
                }
            },
            error: function (msg) {
                console.log(msg)
            }
        });

        //return idOrdenPago;
    },
    eliminar(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/EliminaConsumoServicio?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    Cargando(0);
                    if (datos.respuesta) {
                        alerta('1', "Se elimino correctamente la orden");
                    }
                    else {
                        alerta('3', datos.mensaje);
                        return false;
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0);
                alerta('3', "Error al eliminar orden");
            }
        });

    },
    listaPorCuenta(nroCuenta, permiso) {
        var midata = new FormData();
        midata.append('idCuenta', nroCuenta);
        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {


                    //falta codigo
                    ////Fin-------

                    if (sigue) {
                        ConsumoServicio.idAtencion = datos.table[0].idAtencion
                        $("#txtDesFuenteFinan").val("F.Ing: " + datos.table[0].fechaIngreso2 + " - " + (datos.table[0].idTipoServicio == 1 ? "Consultorios Externos" : datos.table[0].idTipoServicio == 3 ? "Hospitalización" : "Emergencia") + "- Est: " + datos.table[0].estadoCta)
                        $("#txtDesPlan").val("IAFA Act: " + datos.table[0].dFuenteFinanciamiento);
                        $("#txtPacienteRegistro").val(datos.table[0].apellidoPaterno + " " + datos.table[0].apellidoMaterno + " " + datos.table[0].primerNombre);
                        $("#cboPlan").val(datos.table[0].idFormaPago);
                        $("#txtFechaRegistro").val(ConsumoServicio.fechaDiaActual());
                        $("#txtFechaRealiza").val(ConsumoServicio.fechaDiaActual());
                        //$("#txtEstado").val(datos.table[0].estadoCta);
                        $("#hdIdTipoFuenteFianConsumo").val(datos.table[0].idFormaPago);
                        $("#txtFechaDespacho").val(ConsumoServicio.fechaDiaActual());

                        $("#cboPuntoCargaRegistro").val(1);

                        if (datos.table[0].idPaciente == 0) {
                            $('#rbdTipoVentaPreVenta').prop('checked', true)
                        }
                        else {
                            $('#rbdTipoVentaDirecta').prop('checked', true)
                        }

                        idServicio = ConsumoServicio.AtencionesEstanciaHospitalariaPorIdCuenta(nroCuenta)

                        $('#hdIdPuntoCarga').val($("#cboPuntoCargaRegistro").val());
                        $('#hdIdPaciente').val(datos.table[0].idPaciente);
                        $('#hdIdCuentaAtencion').val(datos.table[0].idCuentaAtencion);
                        $("#hdIdEstadoCuenta").val(datos.table[0].idEstado)
                        $('#hIdTipoFinanciamiento').val(datos.table[0].idFormaPago);
                        $('#hIdFuenteFinanciamiento').val(datos.table[0].idFuenteFinanciamiento);
                        console.log(datos.table[0].idServicioIngreso);

                        $("#cboProcedencia").val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio);
                        $('#hdIdServicioPaciente').val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio)

                        ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), datos.table[0].idFormaPago)
                        $('#hIdPermiso').val(permiso)
                        $('.chzn-select').chosen().trigger("chosen:updated");

                        console.log(datos);

                        ConsumoServicio.ListarProcedimientosRealizadosPorHistoriaTamizaje(datos.table[0].idPaciente)

                        if (datos.table[0].idEstado != 1) {
                            alerta(3, "Ese estado de Cuenta no se encuentra ABIERTA");
                            $('#btnguardarConsumo').css("visibility", 'hidden');
                            return false;
                        }
                    }

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    SeleccionarIntervencionesEnfermeriaByCpt: async function (cpt) {

        let formData = new FormData()

        formData.append("cpt", cpt);

        $('#cboIntervencionesEnfermeria').empty()

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarIntervencionesEnfermeriaByCpt`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        if (data.length > 0) {

            $('#cboIntervencionesEnfermeria').append('<option  value="0">--Seleccionar--</option>')
            $(data).each(function (i, obj) {
                $('#cboIntervencionesEnfermeria').append('<option  value="' + obj.idIntervencion + '">' + obj.descripcion + '</option>')
            });

            $('.chzn-select').chosen().trigger("chosen:updated")
        }
    },

    SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt: async function (IdAtencion, cpt) {
        const formData = new FormData();

        oTable_IntervencionesEnfemeria.fnClearTable()

        formData.append("IdAtencion", IdAtencion);
        formData.append('cpt', cpt);

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            // alerta(2, 'No existen datos para mostrar.')
            return false
        }

        ConsumoServicio.Intervenciones = data

        // oTable_IntervencionesEnfemeria.fnAddData(NotaEnfermeria.Intervenciones.filter(obj => (obj.cpt == cpt)))
    },

    GuardarIntervencionesNotaEnfermeriaNeo: async function (IdAtencion) {
        const formData = new FormData();

        formData.append("IdAtencion", IdAtencion);
        formData.append('lstIntervenciones', JSON.stringify(ConsumoServicio.Intervenciones));
        // formData.append('lstIntervenciones', JSON.stringify(oTable_IntervencionesEnfemeria.api(true).data().toArray()));

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/GuardarIntervencionesNotaEnfermeriaNeo`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        console.log('data', data)
    },

    fechaDiaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaDia = dia + "/" + mes + "/" + yyy
        return fechaDia;
    },
    bloqueoProcedencia() {
        $("#cboProcedencia").attr('disabled', true);
    }
    ,
    eventos() {

        ////////////////////////////////////// EVENTOS NOTA ENFERMERIA //////////////////////////////////////
        $('#btnAgregarIntervenciones').on('click', async function () {

            var objrowConsumoServ = oTable_DetalleConsumo.api(true).row('.selected').data();

            if (objrowConsumoServ.codigo == '99436' || objrowConsumoServ.codigo == '99460' || objrowConsumoServ.codigo == '99468' || objrowConsumoServ.codigo == '99477.01') {
                $('#txtCodigoCptIntervencion').val(objrowConsumoServ.codigo)
                $('#txtDescripcionIntervencion').val(objrowConsumoServ.nombre)

                let intervencion = await ConsumoServicio.SeleccionarIntervencionesEnfermeriaByCpt(objrowConsumoServ.codigo)

                let filterIntervenciones = ConsumoServicio.Intervenciones.filter(obj => (obj.cpt == objrowConsumoServ.codigo))

                oTable_IntervencionesEnfemeria.fnClearTable()
                if (filterIntervenciones.length > 0) {
                    oTable_IntervencionesEnfemeria.fnAddData(filterIntervenciones)
                }

                // await NotaEnfermeria.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(Variables.IdAtencion, objrowConsumoServ.codigo)

                $('#modalIntervencionEnfermeria').modal('show')
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No existen Actividades para el Código: " + (objrowConsumoServ.codigo),
                    type: 'info',
                }).done()
            }


        })
        $('#btnCerrarModalIntervencion').on('click', async function () {
            $('#modalIntervencionEnfermeria').modal('hide')
        })
        $('#btnAgregarIntervencion').on('click', async function () {

            let objrowConsumoServ = oTable_DetalleConsumo.api(true).row('.selected').data();

            lstIntegracion = oTable_IntervencionesEnfemeria.api(true).rows().data();

            for (let i = 0; i < lstIntegracion.length; i++) {
                if (lstIntegracion[i].idIntervencion == $('#cboIntervencionesEnfermeria').val()) {
                    alerta(2, 'La intervención ya fue agregado')
                    return true;
                }
            }

            let intervencion = {
                cpt: objrowConsumoServ.codigo,
                idIntervencion: $('#cboIntervencionesEnfermeria').val(),
                descripcion: $('#cboIntervencionesEnfermeria option:selected').text()
            }

            ConsumoServicio.Intervenciones.push(intervencion)

            oTable_IntervencionesEnfemeria.fnAddData(intervencion)


            $('#modalIntervencionEnfermeria').modal('show')
        })
        $('#btnEliminarIntervencion').on('click', function () {
            let objIntervenciones = oTable_IntervencionesEnfemeria.api(true).row('.selected').data();

            if (!isEmpty(objIntervenciones)) {
                ConsumoServicio.Intervenciones = ConsumoServicio.Intervenciones.filter(obj => !(obj.cpt == objIntervenciones.cpt && obj.idIntervencion == objIntervenciones.idIntervencion));

                oTable_IntervencionesEnfemeria.api(true).row('.selected').remove().draw(false);
            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        })
        $('#btnGuardarIntervenciones').on('click', async function () {
            Cargando(1)
            await ConsumoServicio.GuardarIntervencionesNotaEnfermeriaNeo()
            Cargando(0)
        })

        $('#tblIntervencionesEnfemeria tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionesEnfemeria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

        });

        ////////////////////////////////////// EVENTOS NOTA ENFERMERIA //////////////////////////////////////



        $('#btnLimpiarCS').on('click', function () {
            Cargando(1)
            $('#txtNroCuentaLista').val("");
            $('#txtNroHistoriaLista').val("");
            $('#txtNroOdenLista').val("");
            $("#txtFechaIniLista").val(ConsumoServicio.fechaDiaActual());
            $("#txtFechaFinLista").val(ConsumoServicio.fechaDiaActual());
            Cargando(0)
        });

        $("#chkPlanCubre").on('change', function () {
            if ($("#chkPlanCubre").is(':checked')) {
                $("#cboPlan").val(1);
                $('#hIdTipoFinanciamiento').val(1);
                $('#hIdFuenteFinanciamiento').val(1);
                $('#hdIdTipoFuenteFianConsumo').val(1)
                ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), 1)
            } else {
                $("#txtNroCuentaRegistro").change();
                ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), $("#cboPlan").val())
            }
            $('#lblTotal').html('S/. 0.00');
            $("#cboProcedencia").change();
            oTable_DetalleConsumo.fnClearTable();
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnModificar').on('click', async function () {
            ConsumoServicio.limpiar()
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro');
                return false;
            } else {
                ConsumoServicio.listaPorIdorden(objrow.idOrden, 2);

                await ConsumoServicio.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(objrow.idAtencion, '')
                oTable_DetalleConsumo.resize();
            }

        });

        $('#btnConsultar').on('click', function () {
            ConsumoServicio.limpiar()
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            ConsumoServicio.listaPorIdorden(objrow.idOrden, 3);
            oTable_DetalleConsumo.resize();
            $('#btnguardarConsumo').css("visibility", 'hidden');

        });

        $('#btnBuscar').on('click', function () {
            ConsumoServicio.ListaConsumoServicioByfechas()
        });
        $('#btnguardarConsumo').on('click', async function () {

            var objrowConsumoServ = oTable_ConsumoServicio.api(true).row('.selected').data();

            if (isEmpty($('#hdIdPuntoCarga').val())) {
                alerta(3, "Error en el punto de carga");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            if (isEmpty($('#hdIdCuentaAtencion').val())) {
                alerta(3, "Error en el numero de cuenta de atención");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            var formData = new FormData();
            var LstDetalleConsumo = oTable_DetalleConsumo.api(true).rows().data();
            formData.append('IdOrden', $('#hdIdOrden').val());
            formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
            formData.append('IdPuntoCarga', $('#hdIdPuntoCarga').val());
            formData.append('IdPaciente', $('#hdIdPaciente').val());
            formData.append('IdCuentaAtencion', $('#hdIdCuentaAtencion').val());
            formData.append('IdServicioPaciente', $('#hdIdServicioPaciente').val());
            formData.append('idTipoFinanciamiento', $('#hIdTipoFinanciamiento').val());
            formData.append('idFuenteFinanciamiento', $('#hIdFuenteFinanciamiento').val());

            formData.append('IdEstadoFacturacion', $('#hIdEstadoFac').val());
            formData.append('FechaHoraRealizaCpt', $('#txtFechaRealiza').val());
            formData.append('LstDetalleConsumo', JSON.stringify(LstDetalleConsumo.toArray()));
            formData.append('permiso', $('#hIdPermiso').val());

            try {
                Cargando(1)
                let registroConsumoServicio = await HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)

                if (registroConsumoServicio.estado) {
                    await ConsumoServicio.ListaConsumoServicioByfechas();

                    await ConsumoServicio.GuardarIntervencionesNotaEnfermeriaNeo(ConsumoServicio.idAtencion)

                    $('#modalConsumoServicio').modal('hide');
                    alerta2('info', 'Consumo en el servicio', "N° de orden de pago: " + registroConsumoServicio.ordenPago + '\n N° de orden: ' + registroConsumoServicio.orden)
                    //swal({
                    //    title: 'Consumo en el servicio',
                    //    text: "N° de orden de pago: " + registroConsumoServicio.ordenPago + '\n N° de orden: ' + registroConsumoServicio.orden,
                    //    type: 'info',
                    //}).done();

                }
            } catch (e) {
                alerta(2, 'Error: ' + e)
                console.log(e)
                Cargando(0)
            } finally {
                Cargando(0)
            }


            //console.log('consumoServicio', consumoServicio)

            //Cargando(1)
            //$.ajax({
            //    type: 'POST',
            //    url: "/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion",
            //    data: formData,
            //    dataType: "json",
            //    cache: false,
            //    contentType: false,
            //    processData: false,
            //    success: async function (datos) {

            //        if (datos.session) {
            //            if (datos.msjReceta == "") {
            //                alerta('1', "Se  registro correctamente la consumo");
            //                Cargando(0)
            //                $('#modalConsumoServicio').modal('hide');
            //                swal({
            //                    title: 'Consumo en el servicio',
            //                    text: "N° de orden de pago: " + datos.ordenPago + '\n N° de orden: ' + datos.orden,
            //                    type: 'info',
            //                }).done();
            //                await ConsumoServicio.ListaConsumoServicioByfechas();

            //                Cargando(1)

            //                await ConsumoServicio.GuardarIntervencionesNotaEnfermeriaNeo(objrowConsumoServ.idAtencion)

            //                Cargando(0)

            //                return false;
            //            }
            //            else {
            //                alerta('2', datos.msjReceta);
            //                return false;
            //            }
            //        }
            //        else {
            //            Cargando(0);
            //            location.reload();
            //        }
            //    },
            //    error: function (result) {
            //        Cargando(0);
            //        alerta('3', 'Ocurrio un error al registrar');
            //        return false;
            //    }
            //});

        })

        $('#btnguardarConsumoInterconsulta').on('click', function () {

            if (isEmpty($('#hdIdPuntoCarga').val())) {
                alerta(3, "Error en el punto de carga");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            if (isEmpty($('#hdIdCuentaAtencion').val())) {
                alerta(3, "Error en el numero de cuenta de atención");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            var formData = new FormData();
            var LstDetalleConsumo = oTable_DetalleConsumo.api(true).rows().data();
            formData.append('IdOrden', $('#hdIdOrden').val());
            formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
            formData.append('IdPuntoCarga', $('#hdIdPuntoCarga').val());
            formData.append('IdPaciente', $('#hdIdPaciente').val());
            formData.append('IdCuentaAtencion', $('#hdIdCuentaAtencion').val());
            formData.append('IdServicioPaciente', $('#hdIdServicioPaciente').val());
            formData.append('idTipoFinanciamiento', $('#hIdTipoFinanciamiento').val());
            formData.append('idFuenteFinanciamiento', $('#hIdFuenteFinanciamiento').val());

            formData.append('IdEstadoFacturacion', $('#hIdEstadoFac').val());
            formData.append('FechaHoraRealizaCpt', $('#txtFechaRealiza').val());
            formData.append('LstDetalleConsumo', JSON.stringify(LstDetalleConsumo.toArray()));
            formData.append('permiso', $('#hIdPermiso').val());
            formData.append('SeCargaEnInterconsulta', 1);

            $.ajax({
                type: 'POST',
                url: "/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion",
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                success: function (datos) {

                    if (datos.session) {
                        if (datos.msjReceta == "") {
                            alerta('1', "Se  registro correctamente la consumo");
                            $('#modalConsumoServicio').modal('hide');
                            swal({
                                title: 'Consumo en el servicio',
                                text: "N° de orden de pago: " + datos.ordenPago,
                                type: 'info',
                            }).done();
                            ConsumoServicio.ListaConsumoServicioByfechas();
                            return false;
                        }
                        else {
                            alerta('2', datos.msjReceta);
                            return false;
                        }
                    }
                    else {
                        Cargando(0);
                        location.reload();
                    }
                },
                error: function (result) {
                    Cargando(0);
                    alerta('3', 'Ocurrio un error al registrar');
                    return false;
                }
            });

        })

        $('#btnEliminarPS').on('click', function () {
            var objselec = oTable_DetalleConsumo.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_DetalleConsumo.api(true).row('.selected').remove().draw(false);
                $('#lblTotal').html('S/. ' + ConsumoServicio.calculaTotal())
            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        })
        $('#btnEliminar').on('click', function () {
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            if (objrow.idEstadoFacturacion == 1) {
                swal({
                    title: 'Eliminar',
                    text: 'Estas seguro de eliminar orden?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(function () {

                    ConsumoServicio.eliminar(objrow.idOrden)
                    ConsumoServicio.ListaConsumoServicioByfechas();
                });
            }
            else {
                alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                return false;
            }
        });
        $('#tblConsumoServicio tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ConsumoServicio.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblDetalleConsumo tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_DetalleConsumo.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#btnAgregarPS').on('click', async function () {

            let fechaActual = ObtenerFechaActual()

            let consHistorico = oTable_HistorialDetalleConsumo.api(true).data().toArray()

            let existeCanguro = consHistorico.filter(obj => obj.fechaCreacion == fechaActual && obj.codigo == '99477.01')

            if (existeCanguro.length > 0) {
                let confirmaAgregar = await alertaAsync('question', '', `El precedimiento 99477.01 - RECIEN NACIDO CON CUIDADO CANGURO ya fue agregado para el dia ${fechaActual} <br>
                ¿Desesa volver a ingresarlo?`)

                if (confirmaAgregar.isConfirmed) {
                    ConsumoServicio.agregarProdConsumo();
                    $("#cboProductoServicio").focus();
                }
            } else { 
                ConsumoServicio.agregarProdConsumo();
                $("#cboProductoServicio").focus();
            }

           
        })

        $("#cboProcedencia").on('change', function () {
            ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), $('#cboPlan').val())
        })

        $("#txtNroCuentaRegistro").on('change', function () {
            ConsumoServicio.listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
            $("#cboProductoServicio").focus();
        })

        $("#btnAgregar").on('click', function () {
            ConsumoServicio.limpiar()

            $('#cbolabCpt').val(-1)

            $('#contLabCpt').hide()

            if ($('#hdUsaLabs').val() == 1) {
                $('#contUsaLabCpt').show()
                $('#contRelDx').show()
            } else {
                $('#contUsaLabCpt').hide()
                $('#contRelDx').hide()
            }


            $('#cbolabCpt').trigger("chosen:updated");
            $('#modalConsumoServicio').modal('show');
            oTable_DetalleConsumo.resize();
        })



        $('#btnImprimeRecetas').on('click', function () {
            $('#farmaciaRece-tab').click();
            $('#modalReceta').modal('show');
        })

        $('#btnCerrarRecetas').on('click', function () {
            $('#modalReceta').modal('hide');
        })


    },
};

$(document).ready(function () {
    ConsumoServicio.plugins();
    ConsumoServicio.cargaInicial();

    // if(window.location.href.includes('InterconsultasHO')) {
    //     ConsumoServicio.initDatablesInterconsulta();
    // } else {
    //     ConsumoServicio.initDatables(); 
    // }
    ConsumoServicio.initDatables(); 

    ConsumoServicio.initDatablesConsumoServicio();
    ConsumoServicio.initDatablesHistorialDetalleConsumo();
    ConsumoServicio.InitDataTablesIntervencionesEnfemeria();
    ConsumoServicio.eventos();
    ConsumoServicio.listaPuntosCarga();
    ConsumoServicio.listaServicios();
    ConsumoServicio.listaPlan();
    //ConsumoServicio.ListaConsumoServicioByfechas();

});



