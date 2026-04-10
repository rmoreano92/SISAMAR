var FarmacoVigilancia = {
    accion: '',
    idNotificacion: 0,
    idAtencion: 0,
    idCuentaAtencion: 0,
    nroNotificacion: 0,
    //idSolicitud: 0,
    //idReceta: 0,
    //estaAutorizando: 0,
    
    async IniciarScript() {
        FarmacoVigilancia.plugins();
        await FarmacoVigilancia.CargaInicial();        
        FarmacoVigilancia.InitDatablesFarmacoVigilancia();
        FarmacoVigilancia.IniciarDataTablesNotificaciones();
        FarmacoVigilancia.InitDatablesProductosSopechosos();
        FarmacoVigilancia.InitDatablesProductosConcomitantes();
        //FarmacoVigilancia.InitDataTableRecetaFarmacia();
        FarmacoVigilancia.Eventos();

        await FarmacoVigilancia.ListarTiposConsecuenciasGravedadFarmacoVigilancia();
        await FarmacoVigilancia.ListarTiposDescenlaceFarmacoVigilancia();
        await FarmacoVigilancia.ListarTiposGravedadRamFarmacoVigilancia();
        await FarmacoVigilancia.ListarTiposReaccionAdversaFarmacoVigilancia();
        await FarmacoVigilancia.ListarTiposEmpleados();

        BusqCuentasPacientes.Iniciar();
    },

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('.campoFecha, #txtFechaFalleceFV, #txtProblemaFechaVencimientoProdSosFV').datepicker({
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
        $(".campoFecha").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");
    },

    async CargaInicial() {
        let FechaHora = await Utilitario.FechaHoraServidor();
        $(".campoFecha").datepicker("setDate", FechaHora.substring(0, 10));        
        //$("#txtHoraSolAntimic").val(FechaHora.substring(11, 16));
    },

    
    Eventos() {
        $('#modalSolicitudAntimicrobiano').on('shown.bs.modal', function (e) {
            //oTable_CondicionPacienteSolAntimic.resize();
            //oTable_DiagnosticosRecetaSolAntimic.resize();
            //oTable_DetalleRecetaSolAntimic.resize();

            //if (FarmacoVigilancia.accion == "C" || FarmacoVigilancia.accion == "AP") {
            //    oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, false)
            //} else {
            //    oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, true)
            //}
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let shownTab = $(e.target).attr('href');
            //console.log('El tabpanel ahora visible es:', shownTab);
            if (shownTab === '#PanelBusqueda-tab') {
                oTable_FarmacoVigilancia.resize();
            }
            if (shownTab === '#ProdSospechosos-tab' || shownTab === '#ProdConcomitantes-tab') {
                oTable_ProductosConcomitantesFV.resize();
                oTable_ProductosConcomitantesFV.resize();        
            }
        });

        $('#tblFarmacoVigilancia tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_FarmacoVigilancia.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('.searchFarmacoVigilancia').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarFarmacoVigilancia").click();
            }
        });

        $('#btnBuscarFarmacoVigilancia').on('click', function () {
            //ListaRecetas();
            FarmacoVigilancia.ListarFarmacoVigilancia();
        });

        $('#btnLimpiarFarmacoVigilancia').on('click', function () {
            //ListaRecetas();
            FarmacoVigilancia.LimpiarCamposBusqueda();
        });

        $('#cboTipoReaccionAdversasFV').on('change', function () {
            FarmacoVigilancia.TipoReaccionAdversas_Change();
        });

        $('#cboFallecioFV').on('change', function () {
            FarmacoVigilancia.FallecioFV_Change();
        });

        $('#cboRecibioTratamientoProdSosFV').on('change', function () {
            FarmacoVigilancia.RecibioTratamientoProdSos_Change();
        });

        $('#cboProblemaCalidadProdSosFV').on('change', function () {
            FarmacoVigilancia.ProblemaCalidadProdSos_Change();
        });



        /*============================PRODUCTOS SOSPECHOSOS===================================*/
        $('#tblProductosSospechososFV tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ProductosSospechososFV.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }            
        });
                       
        $('#cboDiagnosticoProdSosFV_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await FarmacoVigilancia.ListaDiagnosticosPorFiltro('cboDiagnosticoProdSosFV', filtro);
        });

        $('#btnAgregarProdSosFV').on('click', async function () {
            //ListaRecetas();
            await FarmacoVigilancia.AgregarProductoSospechoso();
        });

        $('#btnQuitarProdSosFV').on('click', function () {
            //ListaRecetas();
            FarmacoVigilancia.QuitarProductoSospechoso();
        });

        /*================================================================================================*/

        /*============================PRODUCTOS CONCOMITANTES===================================*/
        $('#tblProductosConcomitantesFV tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ProductosConcomitantesFV.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarProdConFV').on('click', async function () {
            await FarmacoVigilancia.AgregarProductoConcomitante();
        });

        $('#btnQuitarProdConFV').on('click', function () {
            FarmacoVigilancia.QuitarProductoConcomitante();
        });
        
        /*================================================================================================*/

        /*------------BUSQUEDA DE CUENTAS----------------------------------*/
        $('#txtNroCuentaFarmacoVigilancia').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroCuentaFarmacoVigilancia").blur();
                let nroCuenta = $('#txtNroCuentaFarmacoVigilancia').val();
                FarmacoVigilancia.LimpiarCamposRegistro();
                await FarmacoVigilancia.BuscarNumeroCuenta(nroCuenta);
            }
        });

        $('#btnAceptarCAPaciente').on('click', async function () {
            let cuenta = oTable_CuentasAtencionesPacientes.api(true).row('.selected').data();
            if (isEmpty(cuenta)) {
                alerta2("info", "", "Seleccione un registro por favor.");
            } else {
                if (cuenta.idEstado != 1) {
                    alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
                    return;
                }
                $(".searchCAPaciente").val("");
                oTable_BusquedaCAPacientes.fnClearTable();
                oTable_CuentasAtencionesPacientes.fnClearTable();
                $("#modalBusquedaCuentasAtenciones").modal("hide");
                FarmacoVigilancia.LimpiarCamposRegistro();
                await FarmacoVigilancia.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
            }

        });

        ////////////////////////////EVENTOS CRUD////////////////////////////////////////        
        $('#btnAgregar').on('click', async function () {
            await FarmacoVigilancia.LimpiarCamposRegistro();
            FarmacoVigilancia.accion = 'A';
            FarmacoVigilancia.BloquearRegistro();
            FarmacoVigilancia.DesbloquearCabecera();
            
            MostrarAreaRegistro();
        });

        $('#btnConsultar').on('click', async function () {
            let objrow = oTable_FarmacoVigilancia.api(true).row('.selected').data();
            FarmacoVigilancia.LimpiarCamposRegistro();
            FarmacoVigilancia.accion = 'C';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.idEstado != 1) {
                alerta2("info", "", "La cuenta no se encuentra abierta.");                
            }

            await FarmacoVigilancia.FarmacoVigilanciaNotificacionSeleccionar(objrow.idAtencion);
            FarmacoVigilancia.BloquearRegistro();
            FarmacoVigilancia.BloquearCabecera();
            MostrarAreaRegistro();
        });

        $('#btnModificar').on('click', async function () {
            let objrow = oTable_FarmacoVigilancia.api(true).row('.selected').data();
            FarmacoVigilancia.LimpiarCamposRegistro();
            FarmacoVigilancia.accion = 'M';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.idEstado != 1) {
                alerta2("info", "", "La cuenta no se encuentra abierta.");
                return;
            }

            await FarmacoVigilancia.FarmacoVigilanciaNotificacionSeleccionar(objrow.idAtencion);
            FarmacoVigilancia.BloquearRegistro();
            FarmacoVigilancia.BloquearCabecera();
            MostrarAreaRegistro();
        });

        $('#btnEliminar').on('click', function () {
            let objrow = oTable_FarmacoVigilancia.api(true).row('.selected').data();

            FarmacoVigilancia.LimpiarCamposRegistro();
            FarmacoVigilancia.accion = 'E';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.idEstado != 1) {
                alerta2("info", "", "La cuenta no se encuentra abierta.");
                return;
            }


            if (objrow.estado == 1) {
                swal({
                    title: 'Eliminar',
                    text: '¿Estas seguro de eliminar todas la notificaciones?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(async function () {

                    await FarmacoVigilancia.EliminarNotificacion(objrow.idAtencion);
                    await FarmacoVigilancia.ListarFarmacoVigilancia();
                    //ListaRecetas();
                    //await FarmacoVigilancia.ListaSolicitudes();   //KHOYOSI
                }, function (dimiss) { });
            }
        });

        $('#btnEliminarNotificacion').on('click', function () {
            let objrow = oTable_Notificaciones.api(true).row('.selected').data();
                       
            FarmacoVigilancia.accion = 'E';

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrow.idEstado != 1) {
                alerta2("info", "", "La cuenta no se encuentra abierta.");
                return;
            }


            if (objrow.estado == 1) {
                swal({
                    title: 'Eliminar',
                    text: '¿Estas seguro de eliminar la notificación?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(async function () {

                    await FarmacoVigilancia.EliminarDetalleNotificacion(objrow.idAtencion, objrow.nroNotificacion);
                    await FarmacoVigilancia.LimpiarCamposNotificacion();
                    //ListaRecetas();
                    //await FarmacoVigilancia.ListaSolicitudes();   //KHOYOSI
                }, function (dimiss) { });
            }
        });

                
        /*===================NOTIFICAIONES==============================*/
        $('#tblNotificacionesFarmacoVigilancia tbody').on('click', 'tr', async function () {

            oTable_Notificaciones.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_Notificaciones.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {
                await FarmacoVigilancia.LimpiarCamposNotificacion();
                await FarmacoVigilancia.FarmacoVigilanciaNotificacionDetalleSeleccionar(objrowTb.idAtencion, objrowTb.nroNotificacion);
                let idUsuario = await Utilitario.ObtenerIdUsuarioSesion();
                if (idUsuario == objrowTb.idUsuarioRegistra) {
                    FarmacoVigilancia.DesbloquearRegistro();
                    if (FarmacoVigilancia.accion == "A" || FarmacoVigilancia.accion == "M") {
                        $("#btnGuardarNotificacion").show();
                    } else {
                        $("#btnGuardarNotificacion").hide();
                    }
                } else {
                    $("#btnGuardarNotificacion").hide();
                }
                $("#TituloNotificacionFV").removeClass("bg-deep-teal");
                $("#TituloNotificacionFV").addClass("bg-info");
                $("#TituloNotificacionFV").html("NOTIFICACIÓN Nº " + objrowTb.nroNotificacion);
                
            } else {
                swal({
                    title: 'Notificaciones',
                    text: "No se ha seleccionado ninguna notificación.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });

        $('#btnNuevaNotificacionFV').on('click', async function () {
            if (FarmacoVigilancia.idAtencion > 0) {
                let noti = oTable_Notificaciones.DataTable().data().count() + 1;
                FarmacoVigilancia.nroNotificacion = noti;
                await FarmacoVigilancia.LimpiarCamposNotificacion();
                FarmacoVigilancia.DesbloquearRegistro();
                //await FarmacoVigilancia.CargaInicial();
                $("#TituloNotificacionFV").removeClass("bg-info");
                $("#TituloNotificacionFV").addClass("bg-deep-teal");
                $("#TituloNotificacionFV").html("NUEVA NOTIFICACIÓN Nº " + noti);

                $("#ReacAdverSospechosas-tab-link").click();
                $("#btnGuardarNotificacion").show();
            } else {
                alerta2("info", "", "Por favor primero ingrese un número de cuenta.");
            }          
            
        });


        /*===============================================================*/
                
        $('#btnGuardarNotificacion').on('click', async function () {
            let valido = false;

            //if (FarmacoVigilancia.accion == "A" || FarmacoVigilancia.accion == "M") {
            //    valido = FarmacoVigilancia.ValidarCamposSolicitud();
            //} else if (FarmacoVigilancia.accion == "AP") {
            //    valido = FarmacoVigilancia.ValidarCamposAprobacion();
            //}

            //if (valido == false) {
            //    return;
            //}
            
            let cabecera = await FarmacoVigilancia.GuardarNotificacionCabecera();
            if (cabecera) {
                await FarmacoVigilancia.GuardarNotificacionDetalle();
                await FarmacoVigilancia.FarmacoVigilanciaNotificacionSeleccionar(FarmacoVigilancia.idAtencion);
                $("#ReacAdverSospechosas-tab-link").click();
            }
            

        });

        $('#btnCerrarFarmacoVigilancia').on('click', async function () {
            swal({
                title: 'CERRAR',
                text: "¿Esta seguro de cerrar el registro de notificaciones?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function () {
                FarmacoVigilancia.LimpiarCamposRegistro();                
                FarmacoVigilancia.ListarFarmacoVigilancia();
                ReposicionarVista();
                MostrarAreaLista();                
            }, function (dimiss) {

            });
                        
        });

    },

    InitDatablesFarmacoVigilancia() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [                
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
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    data: "estadoCuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        //if (rowData.autorizaAntimicrobiano == 1) {
                        //    $(td).html('<span class="chip success">' + rowData.estadoSolicitud + '</span >');
                        //} else if (rowData.autorizaAntimicrobiano == 0) {
                        //    $(td).html('<span class="chip danger">' + rowData.estadoSolicitud + '</span >');
                        //} else {
                        //    $(td).html('<span class="chip orange">' + rowData.estadoSolicitud + '</span >');
                        //}                                               

                    }
                },
                //{
                //    data: "notificaciones",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},

            ]

        }

        var tableWrapper = $('#tblFarmacoVigilancia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_FarmacoVigilancia = $("#tblFarmacoVigilancia").dataTable(parms);
    },

    IniciarDataTablesNotificaciones() {
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
                    width: "25%",
                    targets: 0,
                    data: "fechaRegistra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "15%",
                    targets: 0,
                    data: "nroNotificacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "60%",
                    targets: 1,
                    data: "usuario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblNotificacionesFarmacoVigilancia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_Notificaciones = $("#tblNotificacionesFarmacoVigilancia").dataTable(parms);
    },


    InitDatablesProductosSopechosos() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            columns: [
                {
                    data: "nombreComercial",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "laboratorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "lote",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dosisFrecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },                
                {
                    data: "viaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaFinal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idReceta",
                    visible: false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "motivoPrescripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigoCie10",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }, 
                {
                    data: "idDiagnostico",
                    visible: false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                } 
                
            ]

        }

        var tableWrapper = $('#tblProductosSospechososFV'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProductosSospechososFV = $("#tblProductosSospechososFV").dataTable(parms);
    },

    InitDatablesProductosConcomitantes() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            columns: [
                {
                    data: "nombreComercial",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },                
                {
                    data: "dosisFrecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "viaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaFinal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    data: "motivoPrescripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                

            ]

        }

        var tableWrapper = $('#tblProductosConcomitantesFV'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProductosConcomitantesFV = $("#tblProductosConcomitantesFV").dataTable(parms);
    },



    /*=======================PRODUCTOS SOSPECHOSOS====================================================================*/
    async AgregarProductoSospechoso() {
        if (isEmpty($("#txtNombreComercialProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre Comercial.");
            return;
        }

        if (isEmpty($("#txtLaboratorioProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese el Laboratorio.");
            return;
        }

        if (isEmpty($("#txtLoteProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese el Lote.");
            return;
        }

        if (isEmpty($("#txtDosisFrecuenciaProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese la Dosis/Frecuencia.");
            return;
        }

        if (isEmpty($("#txtViaAdministracionProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese la Via de Administración.");
            return;
        }

        if (isEmpty($("#txtFechaInicioProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese la Fecha Inicio.");
            return;
        }

        if (isEmpty($("#txtFechaFinalProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese la Fecha Final");
            return;
        }

        if (isEmpty($("#txtNroRecetaAsociadoProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese el Nº Receta Asociado");
            return;
        }

        if (isEmpty($("#txtMotivoPrescripcionProdSosFV").val())) {
            alerta2("info", "", "Por favor ingrese el Mótivo Prescripción");
            return;
        }

        if (isEmpty($("#cboDiagnosticoProdSosFV").val())) {
            alerta2("info", "", "Por favor seleccione el Diagnóstico.");
            return;
        }

        let obj = {
            nombreComercial: $("#txtNombreComercialProdSosFV").val(),
            laboratorio: $("#txtLaboratorioProdSosFV").val(),
            lote: $("#txtLoteProdSosFV").val(),
            dosisFrecuencia: $("#txtDosisFrecuenciaProdSosFV").val(),
            viaAdministracion: $("#txtViaAdministracionProdSosFV").val(),
            fechaInicio: $("#txtFechaInicioProdSosFV").val(),
            fechaFinal: $("#txtFechaFinalProdSosFV").val(),
            idReceta: $("#txtNroRecetaAsociadoProdSosFV").val(),
            motivoPrescripcion: $("#txtMotivoPrescripcionProdSosFV").val(),
            codigoCie10: $("#cboDiagnosticoProdSosFV").find('option:selected').attr('data-cie10'),
            idDiagnostico: $("#cboDiagnosticoProdSosFV").val(),
        }

        oTable_ProductosSospechososFV.fnAddData(obj);

        $("#txtNombreComercialProdSosFV").val("");
        $("#txtLaboratorioProdSosFV").val("");
        $("#txtLoteProdSosFV").val("");
        $("#txtDosisFrecuenciaProdSosFV").val("");
        $("#txtViaAdministracionProdSosFV").val("");
        $("#txtFechaInicioProdSosFV").val("");
        $("#txtFechaFinalProdSosFV").val("");
        $("#txtNroRecetaAsociadoProdSosFV").val("");
        $("#txtMotivoPrescripcionProdSosFV").val("");
        $("#cboDiagnosticoProdSosFV").val("");

        await FarmacoVigilancia.ListaDiagnosticosPorFiltro('cboDiagnosticoProdSosFV', '');
        let FechaHora = await Utilitario.FechaHoraServidor();
        $("#txtFechaInicioProdSosFV, #txtFechaFinalProdSosFV").datepicker("setDate", FechaHora.substring(0, 10));
    },

    QuitarProductoSospechoso() {
        var objRow = oTable_ProductosSospechososFV.api(true).row('.selected').data();
        if (!isEmpty(objRow)) {
            oTable_ProductosSospechososFV.api(true).row('.selected').remove().draw(false);

        } else {
            alerta2("info", "", "Debe Seleccionar el registro a eliminar.");
        }
    },
    /*================================================================================================================*/


    /*=======================PRODUCTOS CONCOMITANTES==================================================================*/
    async AgregarProductoConcomitante() {
        if (isEmpty($("#txtNombreComercialProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese el Nombre Comercial.");
            return;
        }

        if (isEmpty($("#txtDosisFrecuenciaProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese el Laboratorio.");
            return;
        }

        if (isEmpty($("#txtViaAdministracionProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese el Lote.");
            return;
        }               

        if (isEmpty($("#txtFechaInicioProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese la Fecha Inicio.");
            return;
        }

        if (isEmpty($("#txtFechaFinalProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese la Fecha Final");
            return;
        }
               
        if (isEmpty($("#txtMotivoPrescripcionProdConFV").val())) {
            alerta2("info", "", "Por favor ingrese el Mótivo Prescripción");
            return;
        }
        
        let obj = {
            nombreComercial: $("#txtNombreComercialProdConFV").val(),            
            dosisFrecuencia: $("#txtDosisFrecuenciaProdConFV").val(),
            viaAdministracion: $("#txtViaAdministracionProdConFV").val(),
            fechaInicio: $("#txtFechaInicioProdConFV").val(),
            fechaFinal: $("#txtFechaFinalProdConFV").val(),            
            motivoPrescripcion: $("#txtMotivoPrescripcionProdConFV").val(),            
        }

        oTable_ProductosConcomitantesFV.fnAddData(obj);

        $("#txtNombreComercialProdConFV").val("");
        $("#txtDosisFrecuenciaProdConFV").val("");
        $("#txtViaAdministracionProdConFV").val("");
        $("#txtFechaInicioProdConFV").val("");
        $("#txtFechaFinalProdConFV").val("");
        $("#txtMotivoPrescripcionProdConFV").val("");
                
        let FechaHora = await Utilitario.FechaHoraServidor();
        $("#txtFechaInicioProdConFV, #txtFechaFinalProdConFV").datepicker("setDate", FechaHora.substring(0, 10));
    },

    QuitarProductoConcomitante() {
        var objRow = oTable_ProductosConcomitantesFV.api(true).row('.selected').data();
        if (!isEmpty(objRow)) {
            oTable_ProductosConcomitantesFV.api(true).row('.selected').remove().draw(false);

        } else {
            alerta2("info", "", "Debe Seleccionar el registro a eliminar.");
        }
    },
    /*================================================================================================================*/


    /*===========================CARGAR COMBOS================================================*/
    async ListarTiposReaccionAdversaFarmacoVigilancia() {

        await $.ajax({
            url: "/FarmacoVigilancia/ListarTiposReaccionAdversaFarmacoVigilancia?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboTipoReaccionAdversasFV').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoReaccionAdversasFV').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoReaccionAdversasFV').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tipos reaciones adversas!", "2");
                }, 900)
            }
        });
    },

    async ListarTiposGravedadRamFarmacoVigilancia() {

        await $.ajax({
            url: "/FarmacoVigilancia/ListarTiposGravedadRamFarmacoVigilancia?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboGravedadRamFV').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboGravedadRamFV').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboGravedadRamFV').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tipos gravedad ram!", "2");
                }, 900)
            }
        });
    },

    async ListarTiposConsecuenciasGravedadFarmacoVigilancia() {

        await $.ajax({
            url: "/FarmacoVigilancia/ListarTiposConsecuenciasGravedadFarmacoVigilancia?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboConcecuenciaGravedadFV').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConcecuenciaGravedadFV').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboConcecuenciaGravedadFV').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar concecuencias gravedad!", "2");
                }, 900)
            }
        });
    },

    async ListarTiposDescenlaceFarmacoVigilancia() {

        await $.ajax({
            url: "/FarmacoVigilancia/ListarTiposDescenlaceFarmacoVigilancia?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboDescenlaceFV').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDescenlaceFV').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboDescenlaceFV').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tipos descelnace!", "2");
                }, 900)
            }
        });
    },

    async ListaDiagnosticosPorFiltro(idSelect, filtro) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#' + idSelect).empty();
        $('#' + idSelect).append('<option  value="0">Busque y seleccione un diagnóstico</option>');
        $('#' + idSelect).val("0");
        $('.chzn-select').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Diagnostico",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.table).each(function (i, obj) {
                    $('#' + idSelect).append('<option data-cie10="' + obj.codigoCie10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#' + idSelect).val("0");
                $('.chzn-select').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#' + idSelect + '_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async ListarTiposEmpleados() {

        await $.ajax({
            url: "/Empleados/ListaTiposEmpleados?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboProfesionNotificadorProdConFV').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboProfesionNotificadorProdConFV').append('<option  value="' + obj.idTipoEmpleado + '">' + obj.descripcion + '</option>');
                });
                $('#cboProfesionNotificadorProdConFV').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tipos profesion!", "2");
                }, 900)
            }
        });
    },

    
    /*========================================================================================*/


    /*=====================BUSQUEDA POR CUENTA=====================================================*/
    async BuscarNumeroCuenta(idCuentaAtencion) {

        let datos = await Utilitario.AtencionesSelecionarPorCuenta(idCuentaAtencion);

        if (isEmpty(datos)) {
            alerta2("info", "", "El numero de cuenta ingresado no existe.");
            return;
        }

        if (datos.idEstadoAtencion != 1) {
            alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
            return;
        }

        if (datos.idTipoServicio == 1) {
            if (datos.idTipoFinanciamiento == 1) {
                alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
                return;
            }
        }

        //FarmacoVigilancia.idNotificacion = 0;
        FarmacoVigilancia.idCuentaAtencion = datos.idCuentaAtencion;
        FarmacoVigilancia.idAtencion = datos.idAtencion;        
        $("#txtNroCuentaFarmacoVigilancia").val(datos.idCuentaAtencion);
        $("#txtNroHistoriaFarmacoVigilancia").val(datos.nroHistoriaClinica);
        $("#txtPacienteFarmacoVigilancia").val(datos.paciente);
        let edad = CalcularEdadAnioMesDia(datos.fechaNacimiento)
        $('#txtEdadFarmacoVigilancia').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
        $("#txtSexoFarmacoVigilancia").val(datos.sexo);
        $("#txtDesPlanFarmacoVigilancia").val(datos.planA);
        $("#txtTipoServicioFarmacoVigilancia").val(datos.tipoServicio);
        $("#txtServicioFarmacoVigilancia").val(datos.servicio);
        $("#txtCamaFarmacoVigilancia").val(datos.XXXXXXXX);

        $("#btnNuevaNotificacionFV").show();
        $("#ReacAdverSospechosas-tab-link").click();
        //FarmacoVigilancia.DesbloquearRegistro();

        $('.chzn-select').chosen().trigger("chosen:updated");

        console.log(datos);

    },
    /*=============================================================================================*/


    /*====================================METODOS CRUD=========================================================*/
    async ListarFarmacoVigilancia() {

        //console.log("ListaSolicitudes");
        oTable_FarmacoVigilancia.fnClearTable();
        var midata = new FormData();        
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
                    url: "/FarmacoVigilancia/ListarNotificaciones?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.session) {

                if (datos.listaResultado.table.length > 0) {
                    oTable_FarmacoVigilancia.fnAddData(datos.listaResultado.table);
                    oTable_FarmacoVigilancia.resize();
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


    async FarmacoVigilanciaNotificacionSeleccionar(idAtencion) {
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idNotificacion', idNotificacion);
        data.append('idAtencion', idAtencion);

        try {

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionSeleccionar?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                cabecera = datos.respuesta.table[0];
                FarmacoVigilancia.idCuentaAtencion = cabecera.idCuentaAtencion;
                FarmacoVigilancia.idAtencion = cabecera.idAtencion;
                $("#txtNroCuentaFarmacoVigilancia").val(cabecera.idCuentaAtencion);
                $("#txtNroHistoriaFarmacoVigilancia").val(cabecera.nroHistoriaClinica);
                $("#txtPacienteFarmacoVigilancia").val(cabecera.paciente);
                let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento)
                $('#txtEdadFarmacoVigilancia').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
                $("#txtSexoFarmacoVigilancia").val(cabecera.sexo);
                $("#txtDesPlanFarmacoVigilancia").val(cabecera.plan);
                $("#txtTipoServicioFarmacoVigilancia").val(cabecera.tipoServicio);
                $("#txtServicioFarmacoVigilancia").val(cabecera.servicioActual);
                $("#txtCamaFarmacoVigilancia").val(cabecera.XXXXXXXX);

                oTable_Notificaciones.fnClearTable();
                if (datos.respuesta.table1.length > 0) {
                    oTable_Notificaciones.fnAddData(datos.respuesta.table1);
                }

                $("#btnGuardarNotificacion").hide();

                $('.chzn-select').chosen().trigger("chosen:updated");

                resp = true;
                                
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

    async FarmacoVigilanciaNotificacionDetalleSeleccionar(idAtencion, nroNotificacion) {
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idNotificacion', idNotificacion);
        data.append('idAtencion', idAtencion);
        data.append('nroNotificacion', nroNotificacion);

        try {

            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionDetalleSeleccionar?area=Farmacia",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                let detalle = datos.respuesta.table[0];

                FarmacoVigilancia.nroNotificacion = detalle.nroNotificacion;
                $('#cboTipoReaccionAdversasFV').val(detalle.idTipoReaccionAdversa);
                FarmacoVigilancia.TipoReaccionAdversas_Change();
                $('#txtEspecificarReaccionAdversaFV').val(detalle.especificarReaccionAdversa);
                $('#txtDescripcionReaccionAdversaFV').val(detalle.descripcionReaccionAdversa);
                $("#txtFechaInicioRamFV").datepicker("setDate", detalle.fechaInicioRam);
                $("#txtFechaFinRamFV").datepicker("setDate", detalle.fechaFinalRam);
                $('#cboGravedadRamFV').val(detalle.idTipoGravedadRam);
                $('#cboConcecuenciaGravedadFV').val(detalle.idTipoConsecuenciaGravedad);
                $('#cboFallecioFV').val(detalle.idFallecio);
                FarmacoVigilancia.FallecioFV_Change();
                $('#cboDescenlaceFV').val(detalle.idTipoDescenlace);                
                $("#txtFechaFalleceFV").datepicker("setDate", detalle.fechaFallece);
                $('#txtResRelExLabFV').val(detalle.resultadosRelevantesExlab);
                $('#txtOtrosDatosHcFV').val(detalle.otrosDatosHC);

                $('input[name="rdbAlSuspenderProductoFV"][value="' + detalle.alSuspenderProducto + '"]').prop('checked', true);
                $('input[name="rdbAlDisminuirDosisFV"][value="' + detalle.alDisminuirProducto + '"]').prop('checked', true);
                $('input[name="rdbAlAdministrarProductoFV"][value="' + detalle.alAdministrarProducto + '"]').prop('checked', true);
                $('input[name="rdbAnteriormenteReacionoFV"][value="' + detalle.anteriormenteReaciono + '"]').prop('checked', true);
                
                $('#cboRecibioTratamientoProdSosFV').val(detalle.idRecibioTratamientoReaccionAdversa);
                FarmacoVigilancia.RecibioTratamientoProdSos_Change();
                $('#txtEspecificarTratamientoProdSosFV').val(detalle.especificarTratamientoReaccionAdversa);
                $('#cboProblemaCalidadProdSosFV').val(detalle.idProblemaCalidad);
                FarmacoVigilancia.ProblemaCalidadProdSos_Change();
                $('#txtProblemaRegistroSanitarioProdSosFV').val(detalle.problemaRegistroSanitario);
                $("#txtProblemaFechaVencimientoProdSosFV").datepicker("setDate", detalle.problemaFechaVencimiento);
                                                
                $('#txtNombreNotificadorProdConFV').val(detalle.nombreNotificador);
                $('#txtCelularNotificadorProdConFV').val(detalle.celularNotificador);
                $('#txtCorreoNotificadorProdConFV').val(detalle.correoNotificador);
                $('#cboProfesionNotificadorProdConFV').val(detalle.idProfesionNotificador);                
                $("#txtFechaNotificacionProdConFV").datepicker("setDate", detalle.fechaNotificacion);
                $('#txtNumeroNotificacionProdConFV').val(detalle.numeroNotificacion);
                
                oTable_ProductosSospechososFV.fnClearTable();
                oTable_ProductosConcomitantesFV.fnClearTable();                
                if (datos.respuesta.table1.length > 0) {
                    oTable_ProductosSospechososFV.fnAddData(datos.respuesta.table1);                    
                }

                if (datos.respuesta.table2.length > 0) {
                    oTable_ProductosConcomitantesFV.fnAddData(datos.respuesta.table2);
                }

                $('.chzn-select').chosen().trigger("chosen:updated");

                resp = true;

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



    async GuardarNotificacionCabecera() {
        let formData = new FormData();
        let datos;
        let resp = false;
        let result = null;
        
        formData.append('IdAtencion', FarmacoVigilancia.idAtencion);
        formData.append('Peso', null);
        
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionCabeceraModificar?area=Farmacia",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta >= 1) {                                
                resp = true;
            }
            else {
                alerta2('error', '', 'Hubo un error al guardar la notificacion cabecera');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async GuardarNotificacionDetalle() {
        let formData = new FormData();
        let datos;
        let resp = false;
        let result = null;

        let ProductosSospechosos = oTable_ProductosSospechososFV.api(true).rows().data();
        let ProductosConcomitantes = oTable_ProductosConcomitantesFV.api(true).rows().data();

        formData.append('IdAtencion', FarmacoVigilancia.idAtencion);
        formData.append('NroNotificacion', FarmacoVigilancia.nroNotificacion);
        formData.append('IdTipoReaccionAdversa', $('#cboTipoReaccionAdversasFV').val());        
        formData.append('EspecificarReaccionAdversa', $('#txtEspecificarReaccionAdversaFV').val());
        formData.append('DescripcionReaccionAdversa', $('#txtDescripcionReaccionAdversaFV').val());
        formData.append('FechaInicioRam', $('#txtFechaInicioRamFV').val());
        formData.append('FechaFinalRam', $('#txtFechaFinRamFV').val());
        formData.append('IdTipoGravedadRam', $('#cboGravedadRamFV').val());
        formData.append('IdTipoConsecuenciaGravedad', $('#cboConcecuenciaGravedadFV').val());
        formData.append('IdFallecio', $('#cboFallecioFV').val());
        formData.append('IdTipoDescenlace', $('#cboDescenlaceFV').val());
        formData.append('FechaFallece', $('#txtFechaFalleceFV').val());
        formData.append('ResultadosRelevantesExlab', $('#txtResRelExLabFV').val());
        formData.append('OtrosDatosHC', $('#txtOtrosDatosHcFV').val());

        formData.append('JsonProductosSospechosos', JSON.stringify(ProductosSospechosos.toArray()));        
        formData.append('AlSuspenderProducto', $('input[name="rdbAlSuspenderProductoFV"]:checked').val());
        formData.append('AlDisminuirProducto', $('input[name="rdbAlDisminuirDosisFV"]:checked').val());
        formData.append('AlAdministrarProducto', $('input[name="rdbAlAdministrarProductoFV"]:checked').val());
        formData.append('AnteriormenteReaciono', $('input[name="rdbAnteriormenteReacionoFV"]:checked').val());
        formData.append('IdRecibioTratamientoReaccionAdversa', $('#cboRecibioTratamientoProdSosFV').val());
        formData.append('EspecificarTratamientoReaccionAdversa', $('#txtEspecificarTratamientoProdSosFV').val());
        formData.append('IdProblemaCalidad', $('#cboProblemaCalidadProdSosFV').val());
        formData.append('ProblemaRegistroSanitario', $('#txtProblemaRegistroSanitarioProdSosFV').val());
        formData.append('ProblemaFechaVencimiento', $('#txtProblemaFechaVencimientoProdSosFV').val());
        
        formData.append('JsonProductosConcomitantes', JSON.stringify(ProductosConcomitantes.toArray()));
        formData.append('NombreNotificador', $('#txtNombreNotificadorProdConFV').val());
        formData.append('CelularNotificador', $('#txtCelularNotificadorProdConFV').val());
        formData.append('CorreoNotificador', $('#txtCorreoNotificadorProdConFV').val());
        formData.append('IdProfesionNotificador', $('#cboProfesionNotificadorProdConFV').val());
        formData.append('FechaNotificacion', $('#txtFechaNotificacionProdConFV').val());
        formData.append('NumeroNotificacion', $('#txtNumeroNotificacionProdConFV').val());
                
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionDetalleModificar?area=Farmacia",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta >= 1) {                
                
                await FarmacoVigilancia.LimpiarCamposNotificacion();

                //FarmacoVigilancia.ListaSolicitudes();
                alerta2('success', '', 'La notificación se guardo correctamente.');
            }
            else {
                alerta2('error', '', 'Hubo un error al guardar la notificacion detalle');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async EliminarNotificacion(idAtencion) {
        let resp = false;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionEliminar?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta >= 1) {                                
                alerta2('success', '', 'La notificación se elimino correctamente.');
            } else if (result.respuesta == 0) {
                alerta2('error', '', 'Hubo un error al eliminar la notificacion');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async EliminarDetalleNotificacion(idAtencion, nroNotificacion) {
        let resp = false;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('nroNotificacion', nroNotificacion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FarmacoVigilancia/FarmacoVigilanciaNotificacionDetalleEliminar?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta >= 1) {
                FarmacoVigilancia.LimpiarCamposNotificacion();                   
                alerta2('success', '', 'La notificación se elimino correctamente.');
            } else if (result.respuesta == 0) {
                alerta2('error', '', 'Hubo un error al eliminar la notificacion');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    
    ValidarCamposRegistroNotificacion() {

        //if (isEmpty($("#txtFechaSolAntimic").val())) {
        //    $("#txtFechaSolAntimic").focus();
        //    alerta2("info", "", "Por favor ingrese la Fecha de la solicitud.");
        //    return false;
        //}

        //if (isEmpty($("#txtHoraSolAntimic").val())) {
        //    $("#txtHoraSolAntimic").focus();
        //    alerta2("info", "", "Por favor ingrese la Hora de la solicitud.");
        //    return false;
        //}

        //if (isEmpty($("#cboMotivoSolAntimic").val())) {
        //    $('#cboMotivoSolAntimic').trigger('chosen:activate');
        //    alerta2("info", "", "Por favor seleccione el Motivo de la solicitud.");
        //    return false;
        //}

        //let lstCondicion = oTable_CondicionPacienteSolAntimic.api(true).rows().data();
        //if (lstCondicion.length == 0) {
        //    alerta2("info", "", "Por favor agregue almenos una Condición del Paciente.");
        //    return false;
        //}

        //if (isEmpty($("#txtTratamientoActualSolAntimic").val())) {
        //    $("#txtTratamientoActualSolAntimic").focus();
        //    alerta2("info", "", "Por favor ingrese el Tratamiento Actual de la solicitud.");
        //    return false;
        //}

        return true;
    },

    ////////////////////EVENTOS CHANGE/////////////////////////////////////////////////////////
    TipoReaccionAdversas_Change() {
        let idOpcion = $("#cboTipoReaccionAdversasFV").val();        
        if (idOpcion == 4) {
            $("#txtEspecificarReaccionAdversaFV").removeAttr("disabled");
        } else {
            $("#txtEspecificarReaccionAdversaFV").val("");
            $("#txtEspecificarReaccionAdversaFV").attr("disabled", true);
        }
    },

    FallecioFV_Change() {
        let idOpcion = $("#cboFallecioFV").val();
        //$("#cboDescenlaceFV").val("");
        
        if (idOpcion == 1) {
            //$("#cboDescenlaceFV").removeAttr("disabled");                
            $("#txtFechaFalleceFV").removeAttr("disabled");
        } else {
            $("#txtFechaFalleceFV").val("");
            $("#txtFechaFalleceFV").attr("disabled", true);
        }
    },

    RecibioTratamientoProdSos_Change() {
        let idOpcion = $("#cboRecibioTratamientoProdSosFV").val();
        
        if (idOpcion == 1) {
            $("#txtEspecificarTratamientoProdSosFV").removeAttr("disabled");
        } else {
            $("#txtEspecificarTratamientoProdSosFV").val("");
            $("#txtEspecificarTratamientoProdSosFV").attr("disabled", true);
        }
    },

    ProblemaCalidadProdSos_Change() {
        let idOpcion = $("#cboProblemaCalidadProdSosFV").val();
        
        if (idOpcion == 1) {
            $("#txtProblemaRegistroSanitarioProdSosFV").removeAttr("disabled");
            $("#txtProblemaFechaVencimientoProdSosFV").removeAttr("disabled");
        } else {
            $("#txtProblemaRegistroSanitarioProdSosFV").val("");
            $("#txtProblemaFechaVencimientoProdSosFV").val("");
            $("#txtProblemaRegistroSanitarioProdSosFV").attr("disabled", true);
            $("#txtProblemaFechaVencimientoProdSosFV").attr("disabled", true);
        }
    },
    //////////////////////////////////////////////////////////////////////////////////////
            
    LimpiarCamposBusqueda() {
        $(".searchFarmacoVigilancia").val("");
    },

    async LimpiarCamposRegistro() {
        FarmacoVigilancia.idNotificacion = 0;
        FarmacoVigilancia.idCuentaAtencion = 0;
        FarmacoVigilancia.idAtencion = 0;
        FarmacoVigilancia.nroNotificacion = 0;                

        $("#txtNroCuentaFarmacoVigilancia").val("");
        $("#txtNroHistoriaFarmacoVigilancia").val("");
        $("#txtPacienteFarmacoVigilancia").val("");
        $('#txtEdadFarmacoVigilancia').val("");
        $("#txtSexoFarmacoVigilancia").val("");
        $("#txtDesPlanFarmacoVigilancia").val("");
        $("#txtTipoServicioFarmacoVigilancia").val("");
        $("#txtServicioFarmacoVigilancia").val("");
        $("#txtCamaFarmacoVigilancia").val("");

        oTable_Notificaciones.fnClearTable();
        await FarmacoVigilancia.LimpiarCamposNotificacion();
    },

    async LimpiarCamposNotificacion() {
        $(".campoFV").val("");
        $(".rdbCampoFV").removeAttr("checked");
                
        await FarmacoVigilancia.ListaDiagnosticosPorFiltro('cboDiagnosticoProdSosFV', '');
        await FarmacoVigilancia.CargaInicial();

        oTable_ProductosSospechososFV.fnClearTable();
        oTable_ProductosConcomitantesFV.fnClearTable();

        $("#TituloNotificacionFV").removeClass("bg-info");
        $("#TituloNotificacionFV").removeClass("bg-deep-teal");
        $("#TituloNotificacionFV").html("NOTIFICACIÓN");

        FarmacoVigilancia.BloquearRegistro();

        FarmacoVigilancia.TipoReaccionAdversas_Change();
        FarmacoVigilancia.FallecioFV_Change();
        FarmacoVigilancia.RecibioTratamientoProdSos_Change();
        FarmacoVigilancia.ProblemaCalidadProdSos_Change();

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearCabecera() {
        $("#txtNroCuentaFarmacoVigilancia").attr("disabled", true);
        $("#btnNroCuentaFarmacoVigilancia").hide();
    },

    DesbloquearCabecera() {
        $("#txtNroCuentaFarmacoVigilancia").removeAttr("disabled");
        $("#btnNroCuentaFarmacoVigilancia").show();
    },

    BloquearRegistro() {
  
        $(".campoFV").attr("disabled", true);
        $(".rdbCampoFV").attr("disabled", true);
        $('.chzn-select').chosen().trigger("chosen:updated");
        
        $('#btnGuardarNotificacion').hide();
        if (FarmacoVigilancia.accion == "C") {
            $('#btnNuevaNotificacionFV').hide();
        }        
    },

    DesbloquearRegistro() {
        if (FarmacoVigilancia.accion == "A" || FarmacoVigilancia.accion == "M") {           

            $(".campoFV").removeAttr("disabled");
            //$(".campoFV").removeAttr("checked");
            $(".rdbCampoFV").removeAttr("checked");
            $(".rdbCampoFV").removeAttr("disabled");
            $('.chzn-select').chosen().trigger("chosen:updated");

            FarmacoVigilancia.TipoReaccionAdversas_Change();
            FarmacoVigilancia.FallecioFV_Change();
            FarmacoVigilancia.RecibioTratamientoProdSos_Change();
            FarmacoVigilancia.ProblemaCalidadProdSos_Change();
            
            $('#btnGuardarNotificacion').show();
            $('#btnNuevaNotificacionFV').show();
        }          
    },
    

}

$(document).ready(function () {    
    FarmacoVigilancia.IniciarScript();
    
});