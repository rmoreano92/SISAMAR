var EstablecimientosSaludVar = function () {
    var opcionEst = '';
}

var EstablecimientosSalud = {
    idTipo: '',
    idEstablecimiento: '',
    codigo: '',
    nombre: '',
    nroReferencia: '',

    eventos() {
        $('.searchEstab').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.searchEstab').blur();
                $("#btnBuscarEstablecimiento").click();
            }
        });
        $('#btnEstablecimientoDestino').on('click', function () {
            EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
            EstablecimientosSaludVar.opcionEst = 'DR';
            $('#modalEstablecimientosBuscar').modal('show')
        });

        $('#btnEstablecimientoDestinoRef').on('click', function () {
            EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
            EstablecimientosSaludVar.opcionEst = 'DR';
            $('#modalEstablecimientosBuscar').modal('show')
        });

        $('#btnEstablecimientoDestinoCR').on('click', function () {
            EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
            EstablecimientosSaludVar.opcionEst = 'DCR';
            $('#modalEstablecimientosBuscar').modal('show')
        });

        $('#btnCerraEstablecimientoBuscar').on('click', function () {
            EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
            $('#modalEstablecimientosBuscar').modal('hide')
        });

        $('#cmbdepEstbuscar').on('change', function () {
            $('#cmbprovEstBuscar').empty();
            $('#cmbdistEstBuscar').empty();
            EstablecimientosSalud.ListaProvincias();
        });

        $('#cmbdepEstUcibuscar').on('change', function () {
            $('#cmbprovEstBuscar').empty();
            $('#cmbdistEstBuscar').empty();
            EstablecimientosSalud.ListaProvincias();
        });

        $('#cmbprovEstBuscar').on('change', function () {
            $('#cmbdistEstBuscar').empty();
            EstablecimientosSalud.ListaDistrito();
        });

        $('#cmbprovEstUciBuscar').on('change', function () {
            $('#cmbdistEstUciBuscar').empty();
            EstablecimientosSalud.ListaDistrito();
        });

        $('#btnCerraEstablecimientoBuscar').on('click', function () {
            oTable_EstSalud.fnClearTable();
            $('#modalEstablecimientosBuscar').modal('hide')
        });

        $('#btnBuscarEstablecimiento').on('click', function () {
            EstablecimientosSalud.BuscarEstablecimiento();
        });
        $('#btnLimpiarBusquedaEstablecimiento').on('click', function () {
            EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
            //$('.chzn-select').chosen().trigger("chosen:updated");
        });
    },

    initDatables () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 0,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "distrito",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "provincia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '15%',
                    targets: 3,
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        btnSeleccionar = '<button class="btn btn-success" title="Seleccionar" onclick="EstablecimientosSalud.SeleccionarEstablecimiento(' + rowData.idEstablecimiento + ',\'' + rowData.codigo + '\',\'' + rowData.nombre + '\')" data-toggle="tooltip" ><i class="fa fa-hand-o-up"></i> </button>';

                        $(td).html(btnSeleccionar);


                    }
                }
            ]

        }

        var tableWrapper = $('#tblEstSalud'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EstSalud = $("#tblEstSalud").dataTable(parms);

    },

    EstablecimientosSaludTodos() {
        $.ajax({
            url: "/Utilitario/EstablecimientosSeleccionarTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboOrigen').empty();
                if (datos.session) {
                    console.log(datos.lsEstab.table);
                    $(datos.lsEstab.table).each(function (i, obj) {
                        $('#cboOrigen').append('<option  value="' + obj.idEstablecimiento + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar grados de instruccion!", "2");
                }, 900)
            }
        });
    },

    ListaDepartamentos() {

        $.ajax({
            url: "/Utilitario/ListaDepartamentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdepEstbuscar').empty();
                $('#cmbdepEstUcibuscar').empty();
                if (datos.session) {
                    $(datos.lsDeparta.table).each(function (i, obj) {
                        $('#cmbdepEstbuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                        $('#cmbdepEstUcibuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    $('#cmbdepEstbuscar').val(15);
                    $('#cmbdepEstUcibuscar').val(15);
                    EstablecimientosSalud.ListaProvincias();
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                alerta(3, "Error al listar departamentos! " + JSON.stringify(msg));
            }
        });
    },

    ListaProvincias() {
        var midata = new FormData();
        midata.append('idDepartamento', $('#cmbdepEstbuscar').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbprovEstBuscar').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cmbprovEstBuscar').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbprovEstBuscar').val("");
                    $('#cmbdistEstBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //$('#cmbprovEstBuscar').val("");
                    //$('#cmbdistEstBuscar').val("");                
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });

        midata = new FormData();
        midata.append('idDepartamento', $('#cmbdepEstUcibuscar').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbprovEstUciBuscar').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cmbprovEstUciBuscar').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbprovEstUciBuscar').val("");
                    $('#cmbdistEstUciBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //$('#cmbprovEstBuscar').val("");
                    //$('#cmbdistEstBuscar').val("");                
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });
    },

    ListaDistrito() {
        var midata = new FormData();
        midata.append('idDProvincia', $('#cmbprovEstBuscar').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdistEstBuscar').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cmbdistEstBuscar').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbdistEstBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });

        midata = new FormData();
        midata.append('idDProvincia', $('#cmbprovEstUciBuscar').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdistEstUciBuscar').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cmbdistEstUciBuscar').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbdistEstUciBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },

    BuscarEstablecimiento() {
        var codigo = $('#codigoEstBuscar').val();
        var nombre = $('#nombreEstBuscar').val();
        var departamento = $('#cmbdepEstbuscar').val();
        var provincia = $('#cmbprovEstBuscar').val();
        var distrito = $('#cmbdistEstBuscar').val();

        var filtro = "WHERE Departamentos.IdDepartamento = " + departamento;

        if (provincia != null)
            filtro = filtro + " AND Provincias.IdProvincia = " + provincia
        if (distrito != null)
            filtro = filtro + " AND Establecimientos.IdDistrito = " + distrito
        if (codigo != "")
            filtro = filtro + " AND Establecimientos.Codigo = '" + codigo + "'"
        if (nombre != "")
            filtro = filtro + " AND Establecimientos.Nombre LIKE '%" + nombre + "%'"

        Cargando(1)
        oTable_EstSalud.fnClearTable();
        //alert($('#cboConsultorio>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('filtro', filtro);
        //midata.append('prog', $('#cboConsultorio>option:selected').attr("prog"));
        $.ajax({
            method: "POST",
            url: "/Utilitario/EstablecimientosFiltrar?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lsEstablecimientos.table.length > 0) {
                        oTable_EstSalud.fnAddData(datos.lsEstablecimientos.table);
                    }
                    else {
                        Cargando(0)
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
        })

        console.log(filtro);
        /*
        console.log('codigo' + codigo);
        console.log('nombre' + nombre);
        console.log('depar' + departamento);
        console.log('prov' + provincia);
        console.log('dist' + distrito);
        */
    },

    LimpiarBusquedaEstablecimiento() {
        $('#codigoEstBuscar').val("");
        $('#nombreEstBuscar').val("");
        $('#cmbdepEstbuscar').val(15);
        $('#cmbprovEstBuscar').val("");
        $('#cmbdistEstBuscar').val("");
        $('#cmbprovEstBuscar').empty();
        $('#cmbdistEstBuscar').empty();
        EstablecimientosSalud.ListaProvincias();
    },

    async SeleccionarEstablecimiento(id, codigo, nombre) {
        //console.log(id);
        //console.log(opcionEst);
        EstablecimientosSalud.idTipo = 1;
        EstablecimientosSalud.idEstablecimiento = id;
        EstablecimientosSalud.codigo = codigo;
        EstablecimientosSalud.nombre = nombre;
        

        if (EstablecimientosSaludVar.opcionEst == 'OR') {
            $('#ipressorigen').val(codigo);
            $('#origen').val(nombre);
            //Referencias.ListarUPServiciosOrigen(codigo);
        }
        if (EstablecimientosSaludVar.opcionEst == 'DR') {
            $('#ipressdestino').val(codigo);
            $('#destino').val(nombre);

            $('#ipressdestinoAlta').val(codigo);
            $('#destinoAlta').val(nombre);
            //Referencias.ListarUPServiciosDestino(codigo);

            await Referencias.ListarUPServiciosDestino(codigo)
        }
        if (EstablecimientosSaludVar.opcionEst == 'OCR') {
            $('#ipressorigenCR').val(codigo);
            $('#origenCR').val(nombre);
            //Referencias.ListarUPServiciosOrigen(codigo);
        }
        if (EstablecimientosSaludVar.opcionEst == 'DCR') {
            $('#ipressdestinoCR').val(codigo);
            $('#destinoCR').val(nombre);
            $('#txtOrigenRefCR').val(nombre);
            //Referencias.ListarUPServiciosDestino(codigo);

            await Referencias.ListarUPServiciosDestino(codigo)
        }
        if (EstablecimientoSalud.opcionEst == 'ADM') {
            $('#hdIdEstablecimientoReferenciaOrigen').val(id);
            $('#txtCodigoReferenciaAdmision').val(codigo);
            $('#txtDescripcionReferenciaAdmision').val(nombre);
        }
        EstablecimientosSaludVar.opcionEst = '';


        
        //opcionEst = 0;
        oTable_EstSalud.fnClearTable();
        EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
        $('#modalEstablecimientosBuscar').modal('hide');
    },

    LimpiarVariables() {
        EstablecimientosSalud.idTipo = '';
        EstablecimientosSalud.idEstablecimiento = '';
        EstablecimientosSalud.codigo = '';
        EstablecimientosSalud.nombre = '';
        EstablecimientosSalud.nroReferencia = '';
    },

    IniciarScript() {
        EstablecimientosSalud.eventos();
        EstablecimientosSalud.initDatables();
        EstablecimientosSalud.ListaDepartamentos();
    }
}
