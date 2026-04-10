var GestionAntimicrobianos = {
    accion: '',
    idSolicitud: 0,
    idReceta: 0,
    estaAutorizando: 0,


    //idRecetaSelect: '',
    //idTipoServicio: 0,
    //idServicio: 0,
    //idServicioSelect: 0,
    //idMedicoSelect: 0,
    //idFarmacia: 0,
    //idCuentaAtencion: 0,

    async IniciarScript() {
        GestionAntimicrobianos.CargaInicial();
        GestionAntimicrobianos.plugins();
        GestionAntimicrobianos.initDatablesRecetaGeneral();
        GestionAntimicrobianos.InitDataTableCondicionPaciente();
        GestionAntimicrobianos.InitDataTableDiagnosticosReceta();
        GestionAntimicrobianos.InitDataTableRecetaFarmacia();
        GestionAntimicrobianos.Eventos();

        const permisoAntimicrobiano = await Utilitario.ValidarPermiso(305);
        if (permisoAntimicrobiano) {
            $("#btnAprobarSolicitud").show();
            $("#contentAutorizaAntimicrobiano").show();
            GestionAntimicrobianos.estaAutorizando = 1;
        } else {
            $("#btnAprobarSolicitud").hide();
            $("#contentAutorizaAntimicrobiano").hide();
            GestionAntimicrobianos.estaAutorizando = 0;
        }
        
        await GestionAntimicrobianos.ListaMotivoSolicitud();
        await GestionAntimicrobianos.ListaCondicionSolicitud();
        await GestionAntimicrobianos.ListaMotivosRechazo();

        VisorReceta.Eventos();      //KHOYOSI

        BusqRecetasPacientes.idPuntoCarga = 5;
        BusqRecetasPacientes.esAntimicrobiano = 1;
        BusqRecetasPacientes.Iniciar();


    },

    //async IniciarData() {
    //    await GestionAntimicrobianos.listaServicios();

    //    const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();

    //    if (!isEmpty(permisosGenerales)) {
    //        permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
    //    }
    //},

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaSolAntimic').datepicker({
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
        $("#txtFechaSolAntimic, #txtFechaRespuestaSolAntimic").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");
    },

    async CargaInicial() {
        let FechaHora = await Utilitario.FechaHoraServidor();
        $("#txtFechaSolAntimic, #txtFechaRespuestaSolAntimic").datepicker("setDate", FechaHora.substring(0,10));
        $("#txtHoraSolAntimic").val(FechaHora.substring(11,16));
    },


    //async SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {
    //    var respuesta;
    //    var resp = false;
    //    let datos;
    //    var data = new FormData();

    //    oTable_DiagnosticosInterconsulta.fnClearTable()

    //    data.append('idAtencion', idAtencion);
    //    data.append('clasificacionDiagnostico', clasiDiagnostico);

    //    try {
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        if (datos.table.length !== 0) {
    //            if (!isEmpty(datos.table)) {
    //                oTable_DiagnosticosInterconsulta.fnAddData(datos.table); // VERIFICANDO JDELGADOM
    //            }
    //        }
    //        //else {
    //        //    Cargando(0)
    //        //}
    //        resp = true;
    //    } catch (error) {
    //        //console.error(error)
    //        resp = false;
    //        alerta(3, error);
    //    }

    //    //return datos;
    //    return resp;
    //}, // SE AÑADE PARA INTERCONSULTAS JDELGADOM

    Eventos() {
        $('#modalSolicitudAntimicrobiano').on('shown.bs.modal', function (e) {
            oTable_CondicionPacienteSolAntimic.resize();
            oTable_DiagnosticosRecetaSolAntimic.resize();
            oTable_DetalleRecetaSolAntimic.resize();

            if (GestionAntimicrobianos.accion == "C" || GestionAntimicrobianos.accion == "AP") {
                oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, false)
            } else {
                oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, true)
            }
        });

        $('#tblSolicitudAntimicrobianos tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_GestionAntimicrobianos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('.searchSolicitud').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscar").click();
            }
        });

        $('#btnBuscar').on('click', function () {
            //ListaRecetas();
            GestionAntimicrobianos.ListaSolicitudes();   
        });

        $('#btnLimpiar').on('click', function () {
            //ListaRecetas();
            GestionAntimicrobianos.LimpiarCamposBusqueda();   
        });


        /*------------BUSQUEDA DE RECETAS----------------------------------*/
        $('#txtNroRecetaAntimicrobiano').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroRecetaAntimicrobiano").blur();
                let nroReceta = $('#txtNroRecetaAntimicrobiano').val();
                if (isEmpty(nroReceta) == false) {
                    //Laboratorio.LimpiarCamposMovimiento();
                    await GestionAntimicrobianos.BuscarNumeroRecetaAntimicrobiano(nroReceta);
                }

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
                $(".searchRecetaPaciente").val("");
                //BusqRecetasPacientes.CargarFechaHoy();
                oTable_BusquedaRecetasPacientes.fnClearTable();
                $("#modalBusquedaRecetas").modal("hide");
                //Laboratorio.LimpiarCamposMovimiento();
                await GestionAntimicrobianos.BuscarNumeroRecetaAntimicrobiano(receta.idReceta);
            }

        });
        /*-----------------------------------------------------------------*/



        /*---------------------CONDICION PACIENTE-----------------------*/
        $('#btnAgregarCondicionPacienteSolAntimic').on('click', function () {
            if (GestionAntimicrobianos.ExisteCondicionPaciente() == false) {
                                
                let objRow = {
                    idSolicitudAntimicrobiano: GestionAntimicrobianos.idSolicitud,
                    idTipoCondicionAntimicrobiano: $("#cboCondicionPacienteSolAntimic").val(),
                    condicion: $("#cboCondicionPacienteSolAntimic option:selected").text()
                }
                oTable_CondicionPacienteSolAntimic.api(true).row.add(objRow).draw(false);
                oTable_CondicionPacienteSolAntimic.resize();
            } 
        });


        $('#tblCondicionPacienteSolAntimic tbody').on('click', '.btnEliminarCondicionPacienteSolAntimic', function () {
            
            oTable_CondicionPacienteSolAntimic.api(true).row($(this).parents("tr")).remove().draw(false);

        });
        /*--------------------------------------------------------------*/




        
        //$('.searchCuentaReceta').keypress(function (e) {
        //    if (e.which == 13) {
        //        e.preventDefault();
        //        //listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
        //        $("#txtNroCuentaRegistro").blur();
        //        //$("#cboProductoServicio").focus();
        //    }
        //});

        //$("#txtNroCuentaRegistro").on('blur', async function () {
        //    await GestionAntimicrobianos.listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);

        //    //await GestionAntimicrobianos.SeleccionarDiagnosticos(Variables.IdAtencion, 1); // AGREGAR PARA INTERCONSULTA JDELGADOM

        //    $("#cboProductoServicio").focus();
        //});

        //$('.nav-link').on('click', function () {
        //    //alert("prueba");
        //    $($.fn.dataTable.tables(true)).css('width', '100%');
        //    $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        //});

        //$('#cboProcedencia').change(async function () {
        //    $('#hdIdServicioPaciente').val($('#cboProcedencia').val());
        //    GestionAntimicrobianos.idServicioSelect = $('#cboProcedencia').val();
        //    //await GestionAntimicrobianos.ListarCatalogoTotal();
        //});

        //$('#cboMedicoReceta').change(async function () {
        //    GestionAntimicrobianos.idMedicoSelect = $('#cboMedicoReceta').val();
        //});

        //$("#cboFarmacia").on("change", function () {
        //    Cargando(1);
        //    var midata = new FormData();
        //    midata.append('idFarmacia', $("#cboFarmacia").val());
        //    $.ajax({
        //        method: "POST",
        //        url: "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun",
        //        data: midata,
        //        dataType: "json",
        //        processData: false,
        //        contentType: false,
        //        async: false,
        //        success: function (datos) {
        //            Cargando(0);
        //            $('#cboMedicamento').empty();
        //            $(datos.table).each(function (i, obj) {
        //                $('#cboMedicamento').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');


        //            });

        //            $('.chzn-select').chosen().trigger("chosen:updated");

        //        },
        //        error: function (msg) {
        //            Cargando(0);
        //            setTimeout(function () {
        //                //                    Cargando(0);
        //                alerta("ERROR", "Error listar farmacias!", "2");
        //            }, 900)
        //        }
        //    });

        //})

        //$('#btnImprimeRecetas').on('click', async function () {
        //    var objrow = oTable_GestionAntimicrobianos.api(true).row('.selected').data();
        //    //console.log(objrow)
        //    const recetas = await GestionAntimicrobianos.SeleccionarRecetasCabeceraPorIdReceta(objrow.idReceta, $('#hdIdTipoFuenteFian').val(), objrow.idServicioReceta, objrow.idMedicoReceta);
        //    VisorReceta.AbrirVisorRecetas(recetas);
        //});

        

        //$('#btnLimpiarCS').on('click', function () {
        //    Cargando(1);
        //    $('#txtNroReceta').val("");
        //    $("#txtNroCuenta").val("");
        //    $("#txtNroDni").val("");
        //    $("#txtNroHistoria").val("");
        //    $("#txtApPaterno").val("");
        //    $("#txtApMaterno").val("");
        //    Cargando(0);
        //});

        

        $('#btnAgregar').on('click', async function () {
            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.accion = 'A';
            GestionAntimicrobianos.BloquearRegistro();
            $('#modalSolicitudAntimicrobiano').modal('show');
        });

        $('#btnConsultar').on('click', async function () {
            let objrow = oTable_GestionAntimicrobianos.api(true).row('.selected').data();
            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.accion = 'C';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            GestionAntimicrobianos.SeleccionarSolicitudAntimicrobiano(objrow.idSolicitudAntimicrobiano);
            GestionAntimicrobianos.BloquearRegistro();
            $('#modalSolicitudAntimicrobiano').modal('show');
        });
        
        $('#btnModificar').on('click', async function () {
            let objrow = oTable_GestionAntimicrobianos.api(true).row('.selected').data();
            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.accion = 'M';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.autorizaAntimicrobiano == 1) {
                alerta2("info", "", "La solicitud ya fue <span class='text-success'>APROBADA</span>.<br>No es posible modificar la solicitud");
                return;
            }

            if (objrow.autorizaAntimicrobiano == 0) {
                alerta2("info", "", "La solicitud ya fue <span class='text-danger'>RECHAZADA</span>.<br>No es posible modificar la solicitud");
                return;
            }

            GestionAntimicrobianos.SeleccionarSolicitudAntimicrobiano(objrow.idSolicitudAntimicrobiano);
            GestionAntimicrobianos.DesbloquearRegistro();
            $('#modalSolicitudAntimicrobiano').modal('show');
        });

        $('#btnEliminar').on('click', function () {
            let objrow = oTable_GestionAntimicrobianos.api(true).row('.selected').data();

            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.accion = 'E';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.autorizaAntimicrobiano == 1) {
                alerta2("info", "", "La solicitud ya fue <span class='text-success'>APROBADA</span>.<br>No es posible eliminar la solicitud");
                return;
            }

            if (objrow.autorizaAntimicrobiano == 0) {
                alerta2("info", "", "La solicitud ya fue <span class='text-danger'>RECHAZADA</span>.<br>No es posible eliminar la solicitud");
                return;
            }


            if (objrow.estado == 1) {
                swal({
                    title: 'Eliminar',
                    text: '¿Estas seguro de eliminar la solicitud?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(async function () {

                    await GestionAntimicrobianos.EliminarSolicitud(objrow.idSolicitudAntimicrobiano)
                    //ListaRecetas();
                    //await GestionAntimicrobianos.ListaSolicitudes();   //KHOYOSI
                }, function (dimiss) { });
            }            
        });

        $('#btnAprobarSolicitud').on('click', async function () {
            let objrow = oTable_GestionAntimicrobianos.api(true).row('.selected').data();
            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.accion = 'AP';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            GestionAntimicrobianos.SeleccionarSolicitudAntimicrobiano(objrow.idSolicitudAntimicrobiano);
            GestionAntimicrobianos.DesbloquearAprobacion();
            GestionAntimicrobianos.Autoriza_Change();
            $('#modalSolicitudAntimicrobiano').modal('show');
        });


        $('.rdbAutorizaSolAntimic').on('change', function () {
            GestionAntimicrobianos.Autoriza_Change();
        });

        $('#btnGuardarSolicitud').on('click', async function () {
            let valido = false;

            if (GestionAntimicrobianos.accion == "A" || GestionAntimicrobianos.accion == "M") {
                valido = GestionAntimicrobianos.ValidarCamposSolicitud();
            } else if (GestionAntimicrobianos.accion == "AP") {
                valido = GestionAntimicrobianos.ValidarCamposAprobacion();
            }
                        
            if (valido == false) {
                return;
            }


            const dataSol = await GestionAntimicrobianos.GuardarSolicitud();
            //console.log(datarec);
            //if (datarec.length > 0) {

            //    if (GestionAntimicrobianos.accion == 'A') {
            //        //const recetas = await GestionAntimicrobianos.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, $('#hdIdTipoFuenteFian').val(), GestionAntimicrobianos.idServicioSelect, GestionAntimicrobianos.idMedicoSelect);
            //        VisorReceta.AbrirVisorRecetas(datarec);
            //    } else if (GestionAntimicrobianos.accion == 'M') {
            //        //const recetas = await GestionAntimicrobianos.SeleccionarRecetasCabeceraPorIdReceta(GestionAntimicrobianos.idRecetaSelect, $('#hdIdTipoFuenteFian').val(), GestionAntimicrobianos.idServicioSelect, GestionAntimicrobianos.idMedicoSelect);
            //        VisorReceta.AbrirVisorRecetas(datarec);
            //    } else {
            //        const recetas = null;
            //        VisorReceta.AbrirVisorRecetas(recetas);
            //    }

            //    //GestionAntimicrobianos.LimpiarOrdenesMedicas();
            //    Variables.Limpiar();
            //    GestionAntimicrobianos.LimpiarCamposRegistro();


            //    GestionAntimicrobianos.BuscarRecetas();   //KHOYOSI
            //    $('#modalSolicitudAntimicrobiano').modal('hide');


            //}

        });

        $('#btnCerrarSolicitud').on('click', async function () {
            GestionAntimicrobianos.LimpiarCamposRegistro();
            //GestionAntimicrobianos.activaTabs();
            //GestionAntimicrobianos.limpiarCatalogo();
            //GestionAntimicrobianos.LimpiarOrdenesMedicas();
            $('#modalSolicitudAntimicrobiano').modal('hide');
        });

    },

    initDatablesRecetaGeneral() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idSolicitudAntimicrobiano",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    data: "nroDocumento",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaSolicitudAntimicrobiano",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaApruebaSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                //{
                //    data: "fechaReceta",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //}
                //,
                
                //{
                //    data: "apellidoPaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "apellidoMaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //}
                //,
                //{
                //    data: "primerNombre",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }

                //}
                //,
                //{
                //    data: "nroDocumento",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }

                //}
                
                //,
                //{
                //    data: "servicio",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //}
                //,
                //{
                //    data: "desptCarga",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //}
                //,
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.autorizaAntimicrobiano == 1) {
                            $(td).html('<span class="chip success">' + rowData.estadoSolicitud + '</span >');
                        } else if (rowData.autorizaAntimicrobiano == 0) {
                            $(td).html('<span class="chip danger">' + rowData.estadoSolicitud + '</span >');
                        } else { 
                            $(td).html('<span class="chip orange">' + rowData.estadoSolicitud + '</span >');
                        }

                        //if (rowData.estadoCita == "Pagada") {
                        //    $(td).html('<span class="chip blue">' + rowData.estadoCita + '</span >');
                        //}
                        //if (rowData.estadoCita == "Vencida (No pagada)") {
                        //    $(td).html('<span class="chip secondary">' + rowData.estadoCita + '</span >');
                        //}
                                               
                    }
                }
            ]

        }

        var tableWrapper = $('#tblSolicitudAntimicrobianos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_GestionAntimicrobianos = $("#tblSolicitudAntimicrobianos").dataTable(parms);
    },

    InitDataTableCondicionPaciente() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            //scrollY: '20vh',
            columns: [       
                {
                    targets: 0,
                    width: '0%',
                    visible: false,
                    data: "idTipoCondicionAntimicrobiano",

                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 1,
                    width: '80%',
                    data: "condicion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).html('<button class="btn btn-sm btn-danger layout_btn_prevent btnEliminarCondicionPacienteSolAntimic"><i class="fa-solid fa-trash-can"></i></button>');
                    }
                },

            ]
        }

        var tableWrapper = $('#tblCondicionPacienteSolAntimic'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CondicionPacienteSolAntimic = $("#tblCondicionPacienteSolAntimic").dataTable(parms);
        
    },

    InitDataTableDiagnosticosReceta() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            //scrollY: '20vh',
            columns: [
                {
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '15%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '65%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '20%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": true },
                { width: '0%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 9, "data": "lab", className: 'ContCenter', "visible": false }

            ]
        }

        var tableWrapper = $('#tblDiagnosticosRecetaAntimicrobianos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DiagnosticosRecetaSolAntimic = $("#tblDiagnosticosRecetaAntimicrobianos").dataTable(parms);
        
    },

    InitDataTableRecetaFarmacia() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
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
                    width: '30%',
                    targets: 1,
                    data: "producto",
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
                        //var inputCantidad = '';
                        //inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        //$(td).html(inputCantidad);
                    }
                },
                //RQ0003 RMOREANO
                {
                    width: '0%',
                    targets: 3,
                    visible: false,
                    data: "idDosisRecetada",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 5,
                    visible: false,
                    data: "idViaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 6,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 7,
                    data: "observaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //var caja = "";
                        //if (rowData.observaciones == "") {
                        //    caja = '  <input id="txtFrec_' + rowData.idItem + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        //} else {
                        //    caja = '  <input id="txtFrec_' + rowData.idItem + '" value="' + rowData.observaciones + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        //}
                        //$(td).html(caja)
                    }
                },
                {
                    width: '15%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${cellData}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS



                        if ((typeof ObjtableDiagnosticos) != 'undefined') {
                            let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                            if (lstDx.length > 0) {
                                $(lstDx).each(function (i, obj) {
                                    caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                                });

                                caja += `</select>`

                                $(td).html(caja)
                            }
                        } else {
                            let formData = new FormData()

                            formData.append('IdAtencion', Variables.IdAtencion)
                            HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                                .then(res => {
                                    if (!isEmpty(res)) {
                                        if (res.estado) {
                                            let data = res.data
                                            if (data.table.length > 0) {
                                                $(data.table).each(function (i, obj) {
                                                    caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                                                });

                                                caja += `</select>`

                                                $(td).html(caja)

                                                setTimeout(() => {
                                                    $(cboDx).val(cellData)

                                                    $('.chzn-select').chosen().trigger("chosen:updated")
                                                }, 500)
                                            }
                                        } else {
                                            alerta('3', 'Error: ' + res.msg)
                                            return null
                                        }
                                    }

                                })
                                .catch((e) => {
                                    alerta(3, 'Algo salio mal ' + e)
                                    return null
                                })
                        }





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblDetalleRecetaAntimicrobianos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DetalleRecetaSolAntimic = $("#tblDetalleRecetaAntimicrobianos").dataTable(parms);
        
    },

    /**============================CARGAR COMBOS================================= */
    async ListaMotivoSolicitud() {

        $.ajax({
            url: "/Antimicrobianos/ListaMotivoSolicitud?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMotivoSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMotivoSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboMotivoSolAntimic').val("");
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

    async ListaCondicionSolicitud() {

        $.ajax({
            url: "/Antimicrobianos/ListaCondicionSolicitud?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboCondicionPacienteSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicionPacienteSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboCondicionPacienteSolAntimic').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar condicion paciente!", "2");
                }, 900)
            }
        });
    },

    async ListaMotivosRechazo() {

        $.ajax({
            url: "/Antimicrobianos/ListaMotivosRechazo?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMotivoRechazoSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMotivoRechazoSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboMotivoRechazoSolAntimic').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivo rechazo!", "2");
                }, 900)
            }
        });
    },
    /**================================================================================ */


    async BuscarNumeroRecetaAntimicrobiano(idReceta) {

        const datos = await GestionAntimicrobianos.SeleccionaRecetaAntimicrobiano(idReceta);

        if (datos.table.length > 0) {
            cabecera = datos.table[0];

            if (cabecera.esRecetaAntimicrobiano == 0) {
                alerta2("info", "", "La receta no es de antimicrobianos.");
                return;
            }

            if (isEmpty(cabecera.idSolicitudAntimicrobiano) == false) {
                alerta2("info", "", "La receta ya cuenta con una solicitud pendiente.");
                return;
            }

            if (cabecera.idEstadoReceta == 0) {
                alerta2("info", "", "La receta se encuentra anulada");
                return;
            }

            if (cabecera.idEstadoReceta == 2 || (cabecera.idEstadoReceta == 3 && cabecera.idComprobantePago > 0 && isEmpty(cabecera.documentoDespachado) == false)) {
                alerta2("info", "", "La receta se encuentra despachada con <br>Nº Documento: " + cabecera.documentoDespachado);
                return;
            }

            if (cabecera.idEstadoAtencion != 1) {
                alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
                return;
            }


            GestionAntimicrobianos.idSolicitud = 0;
            GestionAntimicrobianos.idReceta = cabecera.idReceta;
            $("#txtNroRecetaAntimicrobiano").val(cabecera.idReceta);
            $("#txtNroCuentaAntimicrobiano").val(cabecera.idCuentaAtencion);
            $("#txtNroHistoriaAntimicrobiano").val(cabecera.nroHistoriaClinica);
            $("#txtPacienteAntimicrobiano").val(cabecera.paciente);
            let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento)
            $('#txtEdadAntimicrobiano').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
            $("#txtSexoAntimicrobiano").val(cabecera.tipoSexo);
            $("#txtDesPlanAntimicrobiano").val(cabecera.planA);
            $("#txtTipoServicioAntimicrobiano").val(cabecera.tipoServicio);
            $("#txtServicioAntimicrobiano").val(cabecera.servicio);
            $("#txtCamaAntimicrobiano").val(cabecera.XXXXXXXX);
            $("#txtMedicoSolAntimic").val(cabecera.medicoSolicita);

            if (datos.table1.length > 0) {
                oTable_DetalleRecetaSolAntimic.fnAddData(datos.table1);
                oTable_DiagnosticosRecetaSolAntimic.fnAddData(datos.table2);
                resp = true;

                GestionAntimicrobianos.DesbloquearRegistro();
                await GestionAntimicrobianos.CargaInicial();
            }
            else {
                GestionAntimicrobianos.LimpiarCamposRegistro();
                GestionAntimicrobianos.BloquearRegistro();
                alerta2("warning", "", "La receta no contiene antimicrobianos.");
                resp = false;
            }
        }
        else {
            GestionAntimicrobianos.LimpiarCamposRegistro();
            GestionAntimicrobianos.BloquearRegistro();
            alerta2("warning", "", "La receta no pertenece a Farmacia.");
            
        }  

    },

    async SeleccionaRecetaAntimicrobiano(idReceta) {
        var resp = null;
        let datos
        var data = new FormData();

        data.append('idReceta', idReceta);

        try {
            oTable_DetalleRecetaSolAntimic.fnClearTable();
            oTable_DiagnosticosRecetaSolAntimic.fnClearTable();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/SeleccionaRecetaAntimicrobiano?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            resp = datos;

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },



















    
       
    async ListaSolicitudes() {
        
        //console.log("ListaSolicitudes");
        oTable_GestionAntimicrobianos.fnClearTable();
        var midata = new FormData();
        midata.append('nroReceta', $("#txtNroReceta").val());
        midata.append('nroCuenta', $("#txtNroCuenta").val());
        midata.append('nroDni', $("#txtNroDni").val());
        midata.append('nroHistoria', $("#txtNroHistoria").val());
        midata.append('apellidoPaterno', $("#txtApPaterno").val());
        midata.append('apellidoMaterno', $("#txtApMaterno").val());
        //midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        var sigue = true;
        var respuesta;
        let datos;
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/ListarRecetas?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.session) {
                
                if (datos.listaRecetas.table.length > 0) {
                    oTable_GestionAntimicrobianos.fnAddData(datos.listaRecetas.table);
                    oTable_GestionAntimicrobianos.resize();
                }
            }
            else {               
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0)
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    
    async SeleccionarSolicitudAntimicrobiano(idSolicitud) {
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idSolicitud', idSolicitud);

        try {
            
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/SeleccionaSolicitudAntimicrobiano?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.table.length > 0) {
                cabecera = datos.table[0];
                GestionAntimicrobianos.idSolicitud = cabecera.idSolicitudAntimicrobiano;
                GestionAntimicrobianos.idReceta = cabecera.idReceta;
                $("#txtNroSolicitudAntimicrobiano").val(cabecera.idSolicitudAntimicrobiano);
                $("#txtEstadoSolicitudAntimicrobiano").val(cabecera.estadoSolicitud);
                $("#txtNroRecetaAntimicrobiano").val(cabecera.idReceta);
                $("#txtNroCuentaAntimicrobiano").val(cabecera.idCuentaAtencion);
                $("#txtNroHistoriaAntimicrobiano").val(cabecera.nroHistoriaClinica);
                $("#txtPacienteAntimicrobiano").val(cabecera.paciente);
                let edad = CalcularEdadAnioMesDiaSegunFecha(cabecera.fechaNacimiento, cabecera.fechaSolicitudAntimicrobiano)
                $('#txtEdadAntimicrobiano').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
                $("#txtSexoAntimicrobiano").val(cabecera.tipoSexo);
                $("#txtDesPlanAntimicrobiano").val(cabecera.planA);
                $("#txtTipoServicioAntimicrobiano").val(cabecera.tipoServicio);
                $("#txtServicioAntimicrobiano").val(cabecera.servicio);
                $("#txtCamaAntimicrobiano").val(cabecera.XXXXXXXX);
                $("#txtMedicoSolAntimic").val(cabecera.medicoSolicita);

                $("#txtFechaSolAntimic").datepicker("setDate", cabecera.fechaSolicitudAntimicrobiano);
                $("#txtHoraSolAntimic").val(cabecera.horaSolicitudAntimicrobiano);                
                $("#cboMotivoSolAntimic").val(cabecera.idMotivo);
                $("#txtTratamientoActualSolAntimic").val(cabecera.tratamientoPrevio);

                //$("#contentAutorizaAntimicrobiano").show();
                if (GestionAntimicrobianos.accion == "M") {                   
                    $("#contentAutorizaAntimicrobiano").hide();
                } else if (GestionAntimicrobianos.accion == "C" || GestionAntimicrobianos.accion == "AP") {
                    if (isEmpty(cabecera.fechaAutoriza)) {
                        $("#contentAutorizaAntimicrobiano").hide();
                        let fechaHoy = await Utilitario.FechaHoraServidor();
                        $("#txtFechaRespuestaSolAntimic").datepicker("setDate", fechaHoy.substring(0, 10));
                    } else {
                        $("#contentAutorizaAntimicrobiano").show();
                        if (cabecera.autorizaAntimicrobiano == 1) {
                            $('#rdbAutorizaSolAntimicSI').prop('checked', true);
                        } else if (cabecera.autorizaAntimicrobiano == 0) {
                            $('#rdbAutorizaSolAntimicNO').prop('checked', true);
                            $("#cboMotivoRechazoSolAntimic").val(cabecera.idMotivoRechazo);
                        }
                        GestionAntimicrobianos.Autoriza_Change();
                        $("#txtFechaRespuestaSolAntimic").datepicker("setDate", cabecera.fechaApruebaSolicitud);
                        $("#txtSugerenciaTratamientoSolAntimic").val(cabecera.sugerenciasTratamiento);
                    }  
                    
                    if (GestionAntimicrobianos.accion == "AP") {
                        $("#contentAutorizaAntimicrobiano").show();
                    }
                }
                                       
                oTable_CondicionPacienteSolAntimic.fnAddData(datos.table1);
                oTable_DetalleRecetaSolAntimic.fnAddData(datos.table2);
                oTable_DiagnosticosRecetaSolAntimic.fnAddData(datos.table3);

                $('.chzn-select').chosen().trigger("chosen:updated");

                resp = true;

                //if (datos.table2.length > 0) {
                //    oTable_DetalleRecetaSolAntimic.fnAddData(datos.table2);
                //    oTable_DiagnosticosRecetaSolAntimic.fnAddData(datos.table3);
                //    resp = true;

                //    GestionAntimicrobianos.DesbloquearRegistro();
                //    await GestionAntimicrobianos.CargaInicial();
                //}
                //else {
                //    GestionAntimicrobianos.LimpiarCamposRegistro();
                //    GestionAntimicrobianos.BloquearRegistro();
                //    alerta2("warning", "", "La receta no contiene antimicrobianos.");
                //    resp = false;
                //}
            }
            else {                
                alerta2("error", "", "Hubo un problema al cargar la solicitud.");
                resp = false;
            }



        } catch (error) {
            Cargando(0);
            resp = false;
            alerta2("error", "", error);
        }

        return resp;
    },



    async GuardarSolicitud() {
        let formData = new FormData();
        let datos;
        let resp = false;
        let result = null;

        let lstCondiciones = oTable_CondicionPacienteSolAntimic.api(true).rows().data();
        
        formData.append('IdSolicitudAntimicrobiano', GestionAntimicrobianos.idSolicitud);
        formData.append('IdReceta', GestionAntimicrobianos.idReceta);        
        formData.append('FechaSolicitud', $('#txtFechaSolAntimic').val() + ' ' + $('#txtHoraSolAntimic').val());
        formData.append('IdMotivo', $('#cboMotivoSolAntimic').val());
        formData.append('CondicionPaciente', JSON.stringify(lstCondiciones.toArray()));
        formData.append('TratamientoPrevio', $('#txtTratamientoActualSolAntimic').val());

        formData.append('AutorizaAntimicrobiano', GestionAntimicrobianos.accion == "AP" ? ($("#rdbAutorizaSolAntimicSI").is(':checked') ? 1 : 0) : null);        
        formData.append('IdMotivoRechazo', GestionAntimicrobianos.accion == "AP" ? $('#cboMotivoRechazoSolAntimic').val() : null);
        formData.append('FechaRespuesta', GestionAntimicrobianos.accion == "AP" ? $('#txtFechaRespuestaSolAntimic').val() : null);
        formData.append('SugerenciasTratamiento', GestionAntimicrobianos.accion == "AP" ? $('#txtSugerenciaTratamientoSolAntimic').val() : null);

        formData.append('EstaAutorizando', GestionAntimicrobianos.accion == "AP" ? 1 : 0);
        
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/GuardarSolicitudAntimicrobiano?area=Farmacia",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                result = datos.respuesta.table[0];
                if (result.respuesta == 1) {
                    alerta2('success', '', result.mensaje);
                    GestionAntimicrobianos.LimpiarCamposRegistro();                    
                    GestionAntimicrobianos.ListaSolicitudes();
                    $("#modalSolicitudAntimicrobiano").modal("hide");
                } else if (result.respuesta == 0) {
                    alerta2('error', '', result.mensaje);
                }

                resp = true;
            }
            else {
                alerta2('error', '', 'Hubo un error al guardar la solicitud');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async EliminarSolicitud(idSolicitud) {
        let resp = false;
        var midata = new FormData();
        midata.append('idSolicitud', idSolicitud);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/EliminarSolicitudAntimicrobiano?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                result = datos.respuesta.table[0];
                if (result.respuesta == 1) {
                    alerta2('success', '', result.mensaje);
                    GestionAntimicrobianos.LimpiarCamposRegistro();
                    GestionAntimicrobianos.ListaSolicitudes();
                    $("#modalSolicitudAntimicrobiano").modal("hide");
                } else if (result.respuesta == 0) {
                    alerta2('error', '', result.mensaje);
                }

                resp = true;
            }
            else {
                alerta2('error', '', 'Hubo un error al guardar la solicitud');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
        
    },

    //ValidarDatosObligatorios() {

    //    if ($('#txtNroCuentaRegistro').val() == "" || GestionAntimicrobianos.idCuentaAtencion == 0) {
    //        alerta2('info', '', 'Ingrese un Nro. de cuenta.');
    //        return false
    //    }

    //    if (isEmpty($('#cboProcedencia').val())) {
    //        alerta2('info', '', 'Seleccione el servicio.');
    //        return false
    //    }

    //    if (isEmpty($('#cboMedicoReceta').val())) {
    //        alerta2('info', '', 'Seleccione el médico.');
    //        return false
    //    }

    //    if (isEmpty($('#cboFarmacia').val())) {
    //        alerta2('info', '', 'Seleccione la farmacia.');
    //        return false
    //    }

    //    if (isEmpty($('#txtFechaVigencia').val()) || esFormatoFecha($('#txtFechaVigencia').val()) == false) {
    //        alerta2('info', '', 'Ingrese una fecha de vigencia válida.');
    //        return false
    //    }

    //    let ListaRecetaDetalleFarmacia = GestionAntimicrobianos.DevolverRecetaDetalle();
    //    if (ListaRecetaDetalleFarmacia == "[]") {
    //        alerta2('warning', '', 'No existe ningún item para registrar en la receta.');
    //        return false;
    //    }

    //    return true;
    //},

    //DevolverRecetaDetalle() {
    //    let lstRecetadetalle = []
    //    let html = "";
    //    html += '[';

    //    let index = 0;
    //    lstFarmacia = oTable_farmacia.api(true).rows().data().toArray();
    //    lstFarmacia.forEach(async function (obj) {
    //        let cant = parseInt($("#txtCant_" + obj.idProductoConPunto).val());            //KHOYOSI
    //        if (cant > 0) {
    //            index = index + 1;
    //            html += '{"idItem":"' + parseInt(obj.idProductoConPunto) + '","cantidadPedida":"' + cant + '","precio":"' + parseFloat(obj.precioUnitario).toFixed(2) + '","total":"' + parseFloat(obj.precioUnitario * cant).toFixed(2) + '","idDosisRecetada":"0","idViaAdministracion":null,"observaciones":null,"dx":null},';       //KHOYOSI
    //        }

    //        //console.log(obj)
    //    });

    //    html += ']';
    //    let htmlCompleto = html.replace(",]", "]")
    //    return htmlCompleto;
    //},

    


    ValidarCamposSolicitud() {        

        if (isEmpty($("#txtFechaSolAntimic").val())) {
            $("#txtFechaSolAntimic").focus();
            alerta2("info", "", "Por favor ingrese la Fecha de la solicitud.");
            return false;
        }

        if (isEmpty($("#txtHoraSolAntimic").val())) {
            $("#txtHoraSolAntimic").focus();
            alerta2("info", "", "Por favor ingrese la Hora de la solicitud.");
            return false;
        }

        if (isEmpty($("#cboMotivoSolAntimic").val())) {
            $('#cboMotivoSolAntimic').trigger('chosen:activate');
            alerta2("info", "", "Por favor seleccione el Motivo de la solicitud.");
            return false;
        }

        let lstCondicion = oTable_CondicionPacienteSolAntimic.api(true).rows().data();
        if (lstCondicion.length == 0) {
            alerta2("info","","Por favor agregue almenos una Condición del Paciente.");
            return false;
        }

        if (isEmpty($("#txtTratamientoActualSolAntimic").val())) {
            $("#txtTratamientoActualSolAntimic").focus();
            alerta2("info", "", "Por favor ingrese el Tratamiento Actual de la solicitud.");
            return false;
        }
        
        return true;
    },

    ValidarCamposAprobacion() {

        if ($("#rdbAutorizaSolAntimicSI").is(':checked') == false && $("#rdbAutorizaSolAntimicNO").is(':checked') == false) {            
            alerta2("info", "", "Por favor seleccione Autoriza Antimicrobiano.");
            return false;
        }

        if ($("#rdbAutorizaSolAntimicNO").is(':checked')) {
            if (isEmpty($("#cboMotivoRechazoSolAntimic").val())) {
                $("#cboMotivoRechazoSolAntimic").focus();
                alerta2("info", "", "Por favor seleccione el Motivo de Rechazo.");
                return false;
            }
        }
                
        if (isEmpty($("#txtSugerenciaTratamientoSolAntimic").val())) {
            $("#cboMotivoSolAntimic").focus();
            alerta2("info", "", "Por favor ingrese la Sugerencia de Tratamiento y Dosis.");
            return false;
        }        

        return true;
    },

    ExisteCondicionPaciente() {
        let lstCondicion = oTable_CondicionPacienteSolAntimic.api(true).rows().data();

        if (isEmpty($("#cboCondicionPacienteSolAntimic").val()) || $("#cboCondicionPacienteSolAntimic").val() == 0) {
            alerta2("info", "", "Por favor seleccione una condición de la lista.");
            return true;
        }
        
        for (let i = 0; i < lstCondicion.length; i++) {
            if (lstCondicion[i].idTipoCondicionAntimicrobiano == $("#cboCondicionPacienteSolAntimic").val()) {
                alerta2("info", "", "Ya existe la condición del paciente.");
                return true;
            }
        }

        return false;
    },

    LimpiarCamposBusqueda() {
        $(".searchSolicitud").val("");
    },

    LimpiarCamposRegistro() {
        GestionAntimicrobianos.idSolicitud = 0;
        GestionAntimicrobianos.idReceta = 0;

        $("#txtNroRecetaAntimicrobiano").val("");
        $("#txtNroCuentaAntimicrobiano").val("");
        $("#txtNroHistoriaAntimicrobiano").val("");
        $("#txtPacienteAntimicrobiano").val("");
        $('#txtEdadAntimicrobiano').val("");
        $("#txtSexoAntimicrobiano").val("");
        $("#txtDesPlanAntimicrobiano").val("");
        $("#txtTipoServicioAntimicrobiano").val("");
        $("#txtServicioAntimicrobiano").val("");
        $("#txtCamaAntimicrobiano").val("");
        $("#txtMedicoSolAntimic").val("");

        $(".campo").val("");
        $(".campo").removeAttr("checked");
        GestionAntimicrobianos.Autoriza_Change();

        oTable_CondicionPacienteSolAntimic.fnClearTable();
        oTable_DiagnosticosRecetaSolAntimic.fnClearTable();
        oTable_DetalleRecetaSolAntimic.fnClearTable();

        //GestionAntimicrobianos.hdIdServicio = 0;
        //GestionAntimicrobianos.hdNroEvaluacion = 0;

        

        //$('#btnGuardarSolicitud').css("visibility", 'visible');
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {  
        $("#contentSolicitudAntimicrobiano").show();
        $("#txtNroRecetaAntimicrobiano").attr("disabled", true);
        $("#btnRecetaAntimicrobianoBusq").hide();
        $("#contentCondicionAntimicrobiano").hide();
        $("#contentAutorizaAntimicrobiano").show();

        $(".campo").attr("disabled", true);
        $('.chzn-select').chosen().trigger("chosen:updated");

        if (GestionAntimicrobianos.accion == "A") {
            $("#contentSolicitudAntimicrobiano").hide();
            $("#txtNroRecetaAntimicrobiano").removeAttr("disabled");
            $("#btnRecetaAntimicrobianoBusq").show();
            $("#contentAutorizaAntimicrobiano").hide();
        }

        $('#btnGuardarSolicitud').hide();
        

        //$("#contentSolicitudAntimicrobiano").hide();
        //$("#btnRecetaAntimicrobianoBusq").hide();
        //$("#btnAgregarCondicionPacienteSolAntimic").hide();
        //$(".btnEliminarCondicionPacienteSolAntimic").hide();
        //$("#contentAutorizaAntimicrobiano").hide();
                
        //$(".campo").attr("disabled", true);
        //$('.chzn-select').chosen().trigger("chosen:updated");
        //$('#btnGuardarSolicitud').hide();
        //$('#btnEliminarSolicitud').hide();

        //if (GestionAntimicrobianos.accion == "A") {
        //    $("#txtNroRecetaAntimicrobiano").removeAttr("disabled");
        //    $("#btnRecetaAntimicrobianoBusq").show();
        //} 

        //if (GestionAntimicrobianos.accion == "C" || GestionAntimicrobianos.accion == "E") {
        //    $("#contentAutorizaAntimicrobiano").show();
        //} 
    },

    DesbloquearRegistro() {
        $("#contentSolicitudAntimicrobiano").show();
        $("#txtNroRecetaAntimicrobiano").attr("disabled", true);
        $("#btnRecetaAntimicrobianoBusq").hide();
        $("#contentCondicionAntimicrobiano").show();

        $(".campo").removeAttr("disabled");
        $(".campo").removeAttr("checked");
        $('.chzn-select').chosen().trigger("chosen:updated");

        if (GestionAntimicrobianos.accion == "A") {
            $("#contentSolicitudAntimicrobiano").hide();
            $("#txtNroRecetaAntimicrobiano").removeAttr("disabled");
            $("#btnRecetaAntimicrobianoBusq").show();
            $("#contentAutorizaAntimicrobiano").hide();
        }

        $('#btnGuardarSolicitud').show();

        //$("#contentAutorizaAntimicrobiano").show();

        //$("#contentSolicitudAntimicrobiano").show();
        //$("#btnRecetaAntimicrobianoBusq").hide();

        //$("#contentAutorizaAntimicrobiano").show();

        //$("#btnAgregarCondicionPacienteSolAntimic").show();
        //$(".btnEliminarCondicionPacienteSolAntimic").show();
        
        //$(".campo").removeAttr("disabled");
        //$('.chzn-select').chosen().trigger("chosen:updated");
        //$('#btnGuardarSolicitud').hide();
        //$('#btnEliminarSolicitud').hide();

        //if (GestionAntimicrobianos.accion == "A") {
        //    $("#txtNroRecetaAntimicrobiano").removeAttr("disabled");
        //    $("#contentSolicitudAntimicrobiano").hide();
        //    $("#btnRecetaAntimicrobianoBusq").show();
        //    $('#btnGuardarSolicitud').show();

        //    $("#contentAutorizaAntimicrobiano").hide();
        //} else if (GestionAntimicrobianos.accion == "M") {   
        //    $("#txtNroRecetaAntimicrobiano").attr("disabled", true);
        //    $("#contentAutorizaAntimicrobiano").hide();
        //    $('#btnGuardarSolicitud').show();
        //} else if (GestionAntimicrobianos.accion == "E") {
        //    $('#btnEliminarSolicitud').show();
        //}

        

    },

    DesbloquearAprobacion() {
       
        if (GestionAntimicrobianos.estaAutorizando == 1 && GestionAntimicrobianos.accion == "AP") {
            $("#contentSolicitudAntimicrobiano").show();
            $("#contentAutorizaAntimicrobiano").show();

            $("#txtNroRecetaAntimicrobiano").attr("disabled", true);
            $("#btnRecetaAntimicrobianoBusq").hide();

            $(".campo").attr("disabled", true);
            $(".campoAprob").removeAttr("disabled");
            //$("#cboCondicionPacienteSolAntimic_chosen").hide();
            //$("#btnAgregarCondicionPacienteSolAntimic").hide();
            //$(".btnEliminarCondicionPacienteSolAntimic").hide();
            

            $('.chzn-select').chosen().trigger("chosen:updated");
            $('#btnGuardarSolicitud').show();
            $('#btnEliminarSolicitud').hide();

            
        }
    },

    Autoriza_Change() {
        $("#contentRechazaAntimicrobiano").hide();
        if ($("#rdbAutorizaSolAntimicSI").is(':checked')) {
            //$("#cboMotivoRechazoSolAntimic").val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
            $("#contentRechazaAntimicrobiano").hide();
        } else if ($("#rdbAutorizaSolAntimicNO").is(':checked')) {
            $("#contentRechazaAntimicrobiano").show();
        }
                
    }

}
