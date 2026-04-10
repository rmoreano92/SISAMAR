var KardexProducto = '';
var KardexAlmacen
var TotalIngresos = 0;
var TotalSalidas = 0;
var Kardex = {

    IdProducto: 0,
    IdAlmacen: 0,
    IdTipoSalida: 0,
    Lote: '',
    FechaActual: '',
    //FechaNueva: '',


    async cargaInicial() {
        this.plugins();
        this.Eventos();
        await this.LLenarComboAlmacenes();
    },

    plugins() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFechaInicio,#txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $('#txtFechaInicio').val(fechaP);
        $('#txtFechaFin').val(fechaP);

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicio,#txtHoraFin").mask("Hn:Nn");
    },

    Eventos() {
        $('#cboAlmacen').on('change', async function () {
            await Kardex.LLenarComboTiposSalida();
        });

        $("#txtCodigo").blur(async function () {
            await Kardex.BuscarProducto();
        });

        $('#btnBuscarProducto').on('click', async function () {
            await Kardex.BuscarProducto();
        });

        $('.buscaProducto').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarProducto").click();
            }
        });

        $("#txtFechaInicio").blur(function () {
            if ($('#txtFechaInicio').val() == '') {
                $('#txtFechaInicio').val(fechaP);
            }
        });

        $("#txtFechaFin").blur(function () {
            if ($('#txtFechaFin').val() == '') {
                $('#txtFechaFin').val(fechaP);
            }
        });

        $("#btnRegenerarSaldo").on('click', function () {
            swal({
                title: 'Regenerar Saldo',
                text: 'Estas seguro de regenerar el saldo de este producto ?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(function () {

                ListaAtencionesCE();
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }).catch(swal.noop);

        });

        $("#btnCargarLotes").on('click', async function () {
            const slotes = await Kardex.ListarSaldosConLotes();
            $("#modalSaldosLote").modal("show");
        });

        $('#tblSaldoLotes tbody').on('click', '.btnActualizarLote', async function () {
            var objrow = oTable_SaldoLotes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_SaldoLotes.fnGetData(objrow);

            $("#DescModalActualizarLote").html("Se actualizara el LOTE <b>" + row.lote + "</b> para el producto <b>" + row.producto + "</b>.");
            $("#NuevoLote").val(row.lote);

            Kardex.Lote = row.lote;
            Kardex.FechaActual = row.fechaVencimiento;

            $("#modalActualizarLote").modal("show");
        });

        $('#tblSaldoLotes tbody').on('click', '.btnActualizarFechaVencimiento', async function () {
            var objrow = oTable_SaldoLotes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_SaldoLotes.fnGetData(objrow);

            $("#DescModalActualizarFechaVenc").html("Se actualizara la fecha de vencimiento <b>" + FormatearFecha(row.fechaVencimiento) + "</b> del lote <b>" + row.lote + "</b> para el producto <b>" + row.producto + "</b>.");
            $("#NuevaFechaVencimiento").val(row.fechaVencimiento);

            Kardex.Lote = row.lote;
            Kardex.FechaActual = row.fechaVencimiento;

            $("#modalActualizarFechaVencimiento").modal("show");
        });

        $("#btnActualizarFechaVencimiento").on('click', function () {
            if ($("#NuevaFechaVencimiento").val() == "" || $("#NuevaFechaVencimiento").val() == null) {
                alerta(2, "Por favor ingrese la nueva fecha de vencimiento.");
                return false;
            }

            if (esFormatoFecha($("#NuevaFechaVencimiento").val())) {
                alerta(2, "Por favor ingrese una fecha válida.");
                return false;
            }

            swal({
                title: 'Actualizar Fecha de Vencimiento',
                text: 'Esta acción afectara a todos los lotes de todas las farmacias y almacenes, además de todos los movimientos realizados con este lote.<br>¿Estas seguro de actualizar la fecha de vencimiento del lote para este producto?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(async function () {
                const fvenc = await Kardex.ModificarFechaVencimiento();
                if (fvenc) {
                    const slotes = await Kardex.ListarSaldosConLotes();
                    $("#modalActualizarFechaVencimiento").modal("hide");
                }
            }).catch(swal.noop);
        });

        $("#btnActualizarLote").on('click', function () {
            if ($("#NuevoLote").val() == "" || $("#NuevoLote").val() == null) {
                alerta(2, "Por favor ingrese el nuevo Lote.");
                return false;
            }


            swal({
                title: 'Actualizar Lote',
                text: 'Esta acción afectara a todos los lotes de todas las farmacias y almacenes, además de todos los movimientos realizados con este lote.<br>¿Estas seguro de actualizar el lote para este producto?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(async function () {
                const fvenc = await Kardex.ModificarLote();
                if (fvenc) {
                    const slotes = await Kardex.ListarSaldosConLotes();
                    $("#modalActualizarLote").modal("hide");
                }
            }).catch(swal.noop);
        });

        //$('#NuevaFechaVencimiento').on('keydown', function () {
        //    console.log($('#NuevaFechaVencimiento').val().length);
        //    if ($('#NuevaFechaVencimiento').val().length > 10) {                
        //        $("#NuevaFechaVencimiento").val(FormatearFechaYYYYMMDD($('#NuevaFechaVencimiento').val().slice(0, 9)));
        //        console.log(FormatearFechaYYYYMMDD($('#NuevaFechaVencimiento').val().slice(0, 9)));
        //    }
        //});
    },

    /*==================================INICIALIZAR TABLAS=======================================*/
    initDatables() {
        //var parms = {
        //    "paging": true,
        //    "ordering": false,
        //    "info": false,
        //    "searching": false,
        //    "scrollX": true,
        //    "ordering": true,
        //    columns: [
        //        {
        //            width: '6%',
        //            targets: 0,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')
        //                $(td).html(FormatearFecha(rowData.fechaCreacion));

        //                $("#txtSaldoInicial").val(rowData.saldoAnterior);
        //                $("#txtSaldoFinal").val(rowData.saldoFinal);
        //                $("#txtSaldoAlmacen").val(rowData.saldoAlmacen);
        //            }
        //        },
        //        {
        //            width: '10%',
        //            targets: 1,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')
        //                $(td).html("<b style='margin-left: 5px; margin-right: 15px'>" + rowData.movTipo + "</b>" + ' ' + rowData.movNumero);
        //            }
        //        },
        //        {
        //            width: '6%',
        //            targets: 2,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'center')
        //                if (rowData.movTipo == 'E') {
        //                    $(td).html(rowData.cantidad);
        //                    TotalIngresos = TotalIngresos + rowData.cantidad;
        //                    $("#txtTotalIngresos").val(TotalIngresos);
        //                } else {
        //                    $(td).html('');
        //                }
        //            }
        //        },
        //        {
        //            width: '6%',
        //            targets: 3,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'center')
        //                if (rowData.movTipo == 'S') {
        //                    $(td).html(rowData.cantidad);
        //                    TotalSalidas = TotalSalidas + rowData.cantidad;
        //                    $("#txtTotalSalidas").val(TotalSalidas);
        //                } else {
        //                    $(td).html('');
        //                }
        //            }
        //        },
        //        {
        //            width: '5%',
        //            targets: 4,
        //            data: "saldo",
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'center')
        //            }
        //        },
        //        {
        //            width: '5%',
        //            targets: 5,
        //            data: 'abreviatura',
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'center')
        //            }
        //        },
        //        {
        //            width: '8%',
        //            targets: 6,
        //            data: "documentoNumero",
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'center')
        //            }
        //        },
        //        {
        //            width: '14%',
        //            targets: 7,
        //            data: "concepto",
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')

        //            }
        //        },
        //        {
        //            width: '25%',
        //            targets: 8,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')
        //                if (rowData.movTipo == 'E') {
        //                    $(td).html(rowData.fDestino);
        //                } else {
        //                    if (rowData.movTipo == 'S') {
        //                        $(td).html(rowData.fOrigen);
        //                    } else {
        //                        $(td).html('');
        //                    }
        //                }
        //            }
        //        },
        //        {
        //            width: '7%',
        //            targets: 9,
        //            data: "lote",
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')

        //            }
        //        },
        //        {
        //            width: '8%',
        //            targets: 10,
        //            data: null,
        //            createdCell: function (td, cellData, rowData, row, col) {
        //                $(td).attr('align', 'left')
        //                $(td).html(FormatearFecha(rowData.fechaVencimiento));
        //            }
        //        },

        //    ]
        //}

        var parms2 = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
            columns: [
                {
                    width: '25%',
                    targets: 0,
                    data: "almacen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "lote",
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        botonLote = "";
                        if (await Utilitario.ValidarPermiso(302)) {
                            botonLote = "<button class='btn btn-sm btn-outline-info ml-2 btnActualizarLote' type='button'><i class='fa-solid fa-pencil'></i></button>"
                        }
                        $(td).html(rowData.lote + botonLote);
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "tipoSalidaBienInsumo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        botonActualizarFechaVenc = "";
                        if (await Utilitario.ValidarPermiso(302)) {
                            botonActualizarFechaVenc = "<button class='btn btn-sm btn-outline-info ml-2 btnActualizarFechaVencimiento' type='button'><i class='fa-solid fa-pencil'></i></button>"
                        }
                        $(td).html(FormatearFecha(rowData.fechaVencimiento) + botonActualizarFechaVenc);
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //var tableWrapper = $('#tblKardex'); 

        oTable_SaldoLotes = $("#tblSaldoLotes").dataTable(parms2);
    },
    /*===================================================================================*/

    async LLenarComboAlmacenes() {
        Cargando(1);

        var respuesta;
        let datos;

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/ListarTodosAlmacenMenosExternos?area=Farmacia",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                $('#cboAlmacen').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboAlmacen').append('<option value="' + obj.idAlmacen + '" alt="' + obj.idTipoSuministro + '">' + obj.descripcion + '</option>');
                });
                $('#cboAlmacen').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");
                Cargando(0);
            }
            else {
                Cargando(0);
                respuesta = {};
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    async LLenarComboTiposSalida() {
        Cargando(1);

        var respuesta;
        let datos;
        var midata = new FormData();

        midata.append('idAlmacen', $("#cboAlmacen").val());

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/LlenaDataComboTipoSalidaBienSegunAlmacen?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                $(datos.table).each(function (i, obj) {
                    if (obj.idTipoSuministro == "01") {
                        $('#cboTipoSalida').empty();
                        $('#cboTipoSalida').append('<option value="0">Todas</option>' +
                            '<option value="1">Ventas</option>' +
                            '<option value="2">Interven. Sanitaria</option>'
                        );
                        $('#cboTipoSalida').val("0");
                        $('.chzn-select').chosen().trigger("chosen:updated");
                    } else if (obj.idTipoSuministro == "02") {
                        $('#cboTipoSalida').empty();
                        $('#cboTipoSalida').append('<option value="4">Donaciones</option>');
                        $('#cboTipoSalida').val("4");
                        $('.chzn-select').chosen().trigger("chosen:updated");
                    }
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
                Cargando(0);
            }
            else {
                Cargando(0);
                respuesta = {};
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    async BuscarProducto() {
        Cargando(1);

        var respuesta;
        let datos;
        var midata = new FormData();

        midata.append('codigo', $("#txtCodigo").val());
        //midata.append('descripcion', $("#txtDescripcion").val());
        midata.append('descripcion', '');

        this.LimpiarFiltroBusqueda();
        Variables.IdProductoBienInsumo = 0;

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/BuscarBienInsumoPorCodigoDescripcion?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                Cargando(0);
                $("#txtDescripcion").val("(" + $("#txtCodigo").val() + ") " + datos.table[0].nombreProducto);
                $("#hdIdProducto").val(datos.table[0].idProducto);
                Variables.IdProductoBienInsumo = datos.table[0].idProducto;
            }
            else {
                Cargando(0);
                respuesta = {};
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

    },

    async ListarKardex() {
        //Cargando(1);

        //var respuesta;
        let datos;
        var midata = new FormData();

        if ($("#cboAlmacen").val() == null) {
            alerta(2, "Por favor seleccione el Almacen o Farmacia.");
            $("#cboAlmacen").focus();
            return false;
        }

        if (Variables.IdProductoBienInsumo == 0) {
            alerta(2, "Por favor seleccione el producto a buscar.");
            $("#txtCodigo").focus();
            return false;
        }

        midata.append('IdAlmacen', $("#cboAlmacen").val());
        midata.append('IdProducto', Variables.IdProductoBienInsumo);
        midata.append('IdTipoBienInsumo', $("#cboTipoSalida").val());
        midata.append('FechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val());
        midata.append('FechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val());

        this.LimpiarFiltroBusqueda();
        //oTable_Kardex.fnClearTable();

        var descripcion1 = "<div class='mr-2'><b>Almacen:</b> " + $("#cboAlmacen option:selected").text() + "</div> <div><b>Tipo Salida:</b> " + $("#cboTipoSalida option:selected").text() + "</div>";
        var descripcion2 = "<div><b>Producto:</b> " + $("#txtDescripcion").val() + "</div>";
        $("#KardexDescripcion1").html(descripcion1);
        $("#KardexDescripcion2").html(descripcion2);
        this.IdAlmacen = $("#cboAlmacen").val();
        this.IdProducto = $("#hdIdProducto").val();
        this.IdTipoSalida = $("#cboTipoSalida").val();

        const slotes = await Kardex.ListarSaldosConLotes();
        //$("#modalSaldosLote").modal("show");

        //try {
        //    datos = await
        //        $.ajax({
        //            method: "POST",
        //            url: "/Kardex/ListarKardexFarmacia?area=Farmacia",
        //            data: midata,
        //            dataType: "json",
        //            cache: false,
        //            processData: false,
        //            contentType: false,
        //        });

        //    if (datos.table.length > 0) {
        //        Cargando(0);
        //        dataKardex = datos.table;
        //        oTable_Kardex.fnAddData(dataKardex);
        //        //console.log(dataKardex[0]);                  
        //    }
        //    else {
        //        Cargando(0);
        //        respuesta = {};
        //    }
        //} catch (error) {
        //    Cargando(0);
        //    //console.error(error)
        //    alerta(3, error);
        //}
    },

    async ListarSaldosConLotes() {
        Cargando(1);

        var respuesta;
        let datos;
        var midata = new FormData();

        midata.append('IdAlmacen', this.IdAlmacen);
        midata.append('IdProducto', this.IdProducto);
        midata.append('IdTipoBienInsumo', this.IdTipoSalida);

        oTable_SaldoLotes.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/ListarSaldosConLotes?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                Cargando(0);
                dataSaldos = datos.table;
                oTable_SaldoLotes.fnAddData(dataSaldos);
                console.log(dataSaldos);
            }
            else {
                Cargando(0);
                respuesta = {};
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    async ModificarFechaVencimiento() {
        Cargando(1);

        var respuesta = false;
        let datos;
        var midata = new FormData();

        midata.append('IdAlmacen', this.IdAlmacen);
        midata.append('IdProducto', this.IdProducto);
        midata.append('IdTipoBienInsumo', this.IdTipoSalida);
        midata.append('Lote', this.Lote);
        midata.append('FechaActual', this.FechaActual);
        midata.append('FechaNueva', $('#NuevaFechaVencimiento').val());

        oTable_SaldoLotes.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/ActualizarFechaVencimientoDeLote?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            respuesta = true;
            Cargando(0);
        } catch (error) {
            respuesta = false;
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
        return respuesta;
    },

    async ModificarLote() {
        Cargando(1);

        var respuesta = false;
        let datos;
        var midata = new FormData();

        midata.append('IdAlmacen', this.IdAlmacen);
        midata.append('IdProducto', this.IdProducto);
        midata.append('IdTipoBienInsumo', this.IdTipoSalida);
        midata.append('Lote', this.Lote);
        midata.append('FechaActual', this.FechaActual);
        midata.append('LoteNuevo', $('#NuevoLote').val());

        oTable_SaldoLotes.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Kardex/FarmaciaActualizaLote?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            respuesta = true;
            Cargando(0);
        } catch (error) {
            respuesta = false;
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
        return respuesta;
    },

    LimpiarFiltroBusqueda() {
        TotalIngresos = 0;
        TotalSalidas = 0;
        $("#txtSaldoInicial").val("");
        $("#txtSaldoFinal").val("");
        $("#txtTotalIngresos").val("");
        $("#txtTotalSalidas").val("");
        $("#txtSaldoAlmacen").val("");

        $("#KardexDescripcion1").html("");
        $("#KardexDescripcion2").html("");

        //oTable_Kardex.fnClearTable();
    },

    CerrarModalSaldosLote() {
        $("#modalSaldosLote").modal("hide");
    },

    CerrarModalActualizarFechaVencimiento() {
        $("#modalActualizarFechaVencimiento").modal("hide");
    },
}


$(document).ready(function () {
    Kardex.cargaInicial();
    Kardex.initDatables();
});
