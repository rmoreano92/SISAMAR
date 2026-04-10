var ESTABLECIMIENTOSSALUD = function () {
    var opcionEst = ''; 
    var initDatables = function () {

        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
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

                        btnSeleccionar = '<button class="btn btn-success" title="Seleccionar" onclick="SeleccionarEstablecimiento(' + rowData.idEstablecimiento + ',\'' + rowData.codigo + '\',\'' + rowData.nombre + '\')" data-toggle="tooltip" ><i class="fa fa-hand-o-up"></i> </button>';

                        $(td).html(btnSeleccionar);


                    }
                }


            ]

        }

        var tableWrapper = $('#tblEstSalud'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EstSalud = $("#tblEstSalud").dataTable(parms);


    };


    return {
        init: function () {
            //CargaInicial();
            //plugins();
            initDatables();
            //eventos();
            //listaDestinosCE();
            //listaServicios();
            //listaTiposConsulta();
            //TiposClasificacionPaciente();
            //initDatablesConsumoAtencion();
            ListaDepartamentos();
        }
    };
}();

function EstablecimientosSaludTodos() {
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
}

async function ListaDepartamentos() {

    $.ajax({
        url: "/Utilitario/ListaDepartamentos?area=Comun",
        datatype: "json",
        type: "get",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {

            $('#cmbdepEstbuscar').empty();
            if (datos.session) {
                $(datos.lsDeparta.table).each(function (i, obj) {
                    $('#cmbdepEstbuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#cmbdepEstbuscar').val(15);
                ListaProvincias();
            }
            else {
                location.reload();
            }
        },
        error: function (msg) {
            setTimeout(function () {
                //                    Cargando(0);
                alerta("ERROR", "Error al listar departamentos!", "2");
            }, 900)
        }
    });
}

async function ListaProvincias() {
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
}

async function ListaDistrito() {
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
}


//////////////BUSQUEDA ESTABLECIMIENTO//////////////////////////////
function BuscarEstablecimiento() {
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
}

function LimpiarBusquedaEstablecimiento() {
    $('#codigoEstBuscar').val("");
    $('#nombreEstBuscar').val("");
    $('#cmbdepEstbuscar').val(15);
    $('#cmbprovEstBuscar').val("");
    $('#cmbdistEstBuscar').val("");
    $('#cmbprovEstBuscar').empty();
    $('#cmbdistEstBuscar').empty();
    ListaProvincias();
}

$('#btnEstablecimientoDestino').on('click', function () {
    LimpiarBusquedaEstablecimiento();
    ESTABLECIMIENTOSSALUD.opcionEst = 'DR';
    $('#modalEstablecimientosBuscar').modal('show')
});

$('#btnEstablecimientoDestinoCR').on('click', function () {
    LimpiarBusquedaEstablecimiento();    
    ESTABLECIMIENTOSSALUD.opcionEst = 'DCR';
    $('#modalEstablecimientosBuscar').modal('show')
});

$('#btnCerraEstablecimientoBuscar').on('click', function () {
    LimpiarBusquedaEstablecimiento();
    $('#modalEstablecimientosBuscar').modal('hide')
});

$('#cmbdepEstbuscar').on('change', function () {
    $('#cmbprovEstBuscar').empty();
    $('#cmbdistEstBuscar').empty();
    ListaProvincias();
});
$('#cmbprovEstBuscar').on('change', function () {
    $('#cmbdistEstBuscar').empty();
    ListaDistrito();
});
$('#btnCerraEstablecimientoBuscar').on('click', function () {
    oTable_EstSalud.fnClearTable();
    $('#modalEstablecimientosBuscar').modal('hide')
});

$('#btnBuscarEstablecimiento').on('click', function () {
    BuscarEstablecimiento();
});
$('#btnLimpiarBusquedaEstablecimiento').on('click', function () {
    LimpiarBusquedaEstablecimiento();
    //$('.chzn-select').chosen().trigger("chosen:updated");
});

///////////////////////////////////////////////////////////////////////



function SeleccionarEstablecimiento(id, codigo, nombre) {
    //console.log(id);
    //console.log(opcionEst);
    
    if (ESTABLECIMIENTOSSALUD.opcionEst == 'OR') {
        $('#ipressorigen').val(codigo);
        $('#origen').val(nombre);
        Referencias.ListarUPServiciosOrigen(codigo);
    }
    if (ESTABLECIMIENTOSSALUD.opcionEst == 'DR') {
        $('#ipressdestino').val(codigo);
        $('#destino').val(nombre);
        Referencias.ListarUPServiciosDestino(codigo);
    }
    if (ESTABLECIMIENTOSSALUD.opcionEst == 'OCR') {
        $('#ipressorigenCR').val(codigo);
        $('#origenCR').val(nombre);
        Referencias.ListarUPServiciosOrigen(codigo);
    }
    if (ESTABLECIMIENTOSSALUD.opcionEst == 'DCR') {
        $('#ipressdestinoCR').val(codigo);
        $('#destinoCR').val(nombre);
        Referencias.ListarUPServiciosDestino(codigo);
    }
    ESTABLECIMIENTOSSALUD.opcionEst = '';

    
    //opcionEst = 0;
    oTable_EstSalud.fnClearTable();
    LimpiarBusquedaEstablecimiento();
    $('#modalEstablecimientosBuscar').modal('hide');
}