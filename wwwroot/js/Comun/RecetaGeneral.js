var RecetaGeneral = {
    accion: '',
    idRecetaSelect: '',
    idTipoServicio: 0,
    idServicioSelect: 0,
    idMedicoSelect: 0,
    idClasificacion: 0,

    async IniciarScript() {
        RecetaGeneral.CargaInicial();
        RecetaGeneral.plugins();
        RecetaGeneral.initDatablesRecetaGeneral();
        RecetaGeneral.eventos();
        //listaServicios();
        //listaMedicos();
        await RecetaGeneral.IniciarData();

        Ordenes.IniciarScript();
        await Ordenes.IniciarData();
        /////////////DIAGNOSTICO////////////////////
        BusquedaDiagnosticos.IniciarScript();
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        $('#lstDiagnosticos').on('draw.dt', function () {
            Ordenes.CargarDiagnosticosOrdenesMedicas(0);
        });
        /////////////////////////////////////////////
        VisorReceta.Eventos();      //KHOYOSI

        if ($('#hdIdTipoServicio').val() == 1 || $('#hdIdTipoServicio').val() == 2) {
            RecetaGeneral.idClasificacion = 1;
        } else if ($('#hdIdTipoServicio').val() == 3) {
            RecetaGeneral.idClasificacion = 2;
        }

        BusqCuentasPacientes.Iniciar();

    },

    async IniciarData() {
        await RecetaGeneral.listaServicios();
        await PermisoGeneral.ValidarServicioFirmaDigital();
        //const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        ////console.log(permisosGenerales);
        //if (!isEmpty(permisosGenerales)) {
        //    permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
        //}
    },

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect,#select2_sample").chosen();
    },

    CargaInicial() {
        $('#txtFechaVigencia').val(RecetaGeneral.fechaDiaActualMasdias());
    },


    async SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        oTable_DiagnosticosInterconsulta.fnClearTable()

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasiDiagnostico);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    oTable_DiagnosticosInterconsulta.fnAddData(datos.table); // VERIFICANDO JDELGADOM
                }
            }
            //else {
            //    Cargando(0)
            //}
            resp = true;
        } catch (error) {
            //console.error(error)
            resp = false;
            alerta(3, error);
        }

        //return datos;
        return resp;
    }, // SE AÑADE PARA INTERCONSULTAS JDELGADOM

    eventos() {
        

        $('.searchReceta').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscar").click();
            }
        });

        $('.searchCuentaReceta').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                //listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
                $("#txtNroCuentaRegistro").blur();
                //$("#cboProductoServicio").focus();
            }
        });

        /*------------BUSQUEDA DE CUENTAS----------------------------------*/
        $('#txtNroCuentaRegistro').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroCuentaRegistro").blur();
                let nroCuenta = $('#txtNroCuentaRegistro').val();
                RecetaGeneral.LimpiarCabeceraRecetaGeneral();

                await RecetaGeneral.BuscarNumeroCuenta(nroCuenta);

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
                RecetaGeneral.LimpiarCabeceraRecetaGeneral();

                await RecetaGeneral.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
            }

        });


        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });

        $('#cboProcedencia').change(async function () {
            $('#hdIdServicioPaciente').val($('#cboProcedencia').val());
            RecetaGeneral.idServicioSelect = $('#cboProcedencia').val();
            await Ordenes.ListarCatalogoTotal();
        });

        $('#cboMedicoReceta').change(async function () {            
            RecetaGeneral.idMedicoSelect = $('#cboMedicoReceta').val();            
        });

        $('#btnImprimeRecetas').on('click', async function () {
            var objrow = oTable_RecetaGeneral.api(true).row('.selected').data();
            //console.log(objrow)
            const recetas = await Ordenes.SeleccionarRecetasCabeceraPorIdReceta(objrow.idReceta, $('#hdIdTipoFuenteFian').val(), objrow.idServicioReceta, objrow.idMedicoReceta);
            VisorReceta.AbrirVisorRecetas(recetas);
        });

        $('#btnEliminar').on('click', function () {
            Ordenes.accion = 'E';

            var objrow = oTable_RecetaGeneral.api(true).row('.selected').data();

            if (isEmpty(objrow)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            //--------------------VALIDA ANTIMICRIBOANO----------------------------
            if (objrow.esRecetaAntimicrobiano == 1) {
                if (objrow.idSolicitudAntimicrobiano > 0) {
                    alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta ya cuenta con una SOLICITUD para aprobacion de antimicrobianos.<br>NO es posible ELIMINAR la receta.");
                    return;
                }
            }
            //---------------------------------------------------------------------------

            if (objrow.idEstado == 1) {
                swal({
                    title: 'Eliminar',
                    text: 'Estas seguro de eliminar la receta?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(function () {

                    RecetaGeneral.eliminar(objrow.idReceta)
                    //ListaRecetas();
                    RecetaGeneral.ListaRecetasV2();   //KHOYOSI
                }, function (dimiss) {});
            }
            else {
                if (objrow.idEstado == 2 && objrow.movimiento != "") {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, ya se encuentra despachada. <br><span class="font-weight-bold">Movim: ' + objrow.movimiento + '</span>');
                } else if (objrow.idEstado == 3 && objrow.boleta != "") {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, ya se encuentra con boleta. <br><span class="font-weight-bold">Boleta: ' + objrow.boleta + '</span>');
                } else {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, verifique el estado');
                }                
                return false;
            }
        });

        $('#btnLimpiarCS').on('click', function () {
            Cargando(1);
            $('#txtNroReceta').val("");
            $("#txtNroCuenta").val("");
            $("#txtNroDni").val("");
            $("#txtNroHistoria").val("");
            $("#txtApPaterno").val("");
            $("#txtApMaterno").val("");
            Cargando(0);
        });

        $('#btnBuscar').on('click', function () {
            //ListaRecetas();
            RecetaGeneral.ListaRecetasV2();   //KHOYOSI
        });

        $('#btnAgregar').on('click', async function () {            
            RecetaGeneral.accion = 'A';
            Ordenes.accion = 'A';

            RecetaGeneral.LimpiarCabeceraRecetaGeneral();
            Ordenes.LimpiarOrdenesMedicas();
            await Ordenes.listaFecha(); 
            let idMedico = await Ordenes.ObtenerIdMedicoSesion();
            Ordenes.ubicaMedico(idMedico);
            $('#btnMuestraPaquete').css("visibility", 'visible');
            $(".OpcionesOrdenes").hide();          //KHOYOSI
            Ordenes.ModoVistaMultiple();
            $('#modalReceta').modal('show');



            //oTable_RecetaGeneral.$('tr.selected').removeClass('selected');
            //$('#txtNroCuentaRegistro').attr('disabled', false);            
            //RecetaGeneral.limpiar();
            //Ordenes.activaTabs();
            ////Ordenes.limpiarCatalogo();
            //Ordenes.LimpiarOrdenesMedicas();
            //Ordenes.listaFecha();           //KHOYOSI
            ////cargaDatosReceta2(1) // JDELGADO J0 CAMBIAR RECETAS
            ////cargaDatosReceta(1)
            //Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());
            //$('#btnMuestraPaquete').css("visibility", 'visible');            
            //$(".OpcionesOrdenes").hide();          //KHOYOSI
            //Ordenes.ModoVistaMultiple();
            //$('#modalReceta').modal('show');
            
        });

        $('#btnModificar').on('click', async function () {
            RecetaGeneral.accion = 'M';
            Ordenes.accion = 'M';

            let objrowTb = oTable_RecetaGeneral.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
                return;
            }
            Ordenes.CargarDiagnosticosOrdenesMedicas(objrowTb.idAtencion); //RMOREANO 09032026

            if (objrowTb.idEstado == 1) {
                //--------------------VALIDA ANTIMICRIBOANO----------------------------
                if (objrowTb.esRecetaAntimicrobiano == 1) {
                    if (objrowTb.autorizaAntimicrobiano == 0) {
                        alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta ya cuenta con una SOLICITUD RECHAZADA para antimicrobianos.<br>NO es posible MODIFICAR la receta.");
                        return;
                    }
                    if (objrowTb.autorizaAntimicrobiano == 1) {
                        alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta ya cuenta con una SOLICITUD APROBADA para aantimicrobianos.<br>NO es posible MODIFICAR la receta.");
                        return;
                    }
                }
                //---------------------------------------------------------------------------
                Variables.Cargar(objrowTb);
                
                RecetaGeneral.CargarCabeceraRecetaGeneral(objrowTb);                
                await RecetaGeneral.CargarDetalleRecetaGeneral(objrowTb);
                

                let idMedico = await Ordenes.ObtenerIdMedicoSesion();
                if (idMedico > 0) {
                    if (objrowTb.idMedicoReceta == idMedico) {
                        $(".OpcionesOrdenes").show();
                        $("#btnguardar").show();
                    } else {
                        $(".OpcionesOrdenes").hide();
                        $("#btnguardar").hide();
                    }
                } else {
                    $(".OpcionesOrdenes").show();
                    $("#btnguardar").show();
                }

                Ordenes.ModoVistaIndividual();
                $("#modalReceta").modal("show");
            }
            else {
                if (objrowTb.idEstado == 2 && objrowTb.movimiento != "") {
                    alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra despachada. <br><span class="font-weight-bold">Movim: ' + objrowTb.movimiento + '</span>');
                } else if (objrowTb.idEstado == 3 && objrowTb.boleta != "") {
                    alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra con boleta. <br><span class="font-weight-bold">Boleta: ' + objrowTb.boleta + '</span>');
                } else {
                    alerta2('warning', '', 'Esta receta no se puede modificar, verifique el estado');
                }
                return false;
            }


            /////////////COMENTADO POR KHOYOSI///////////////////////
            //if (objrow.idEstado == 1) {
            //    RecetaGeneral.limpiar();
            //    //Ordenes.limpiarCatalogo();
            //    Ordenes.LimpiarOrdenesMedicas();
            //    await RecetaGeneral.cargaDatosReceta(2)
            //    $(".OpcionesOrdenes").show();          //KHOYOSI
            //    Ordenes.ModoVistaIndividual();
            //    RecetaGeneral.accion = 'M';
            //} else {
            //    if (objrow.idEstado == 2 && objrow.movimiento != "") {
            //        alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra despachada. <br><span class="font-weight-bold">Movim: ' + objrow.movimiento + '</span>');
            //    } else if (objrow.idEstado == 3 && objrow.boleta != "") {
            //        alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra con boleta. <br><span class="font-weight-bold">Boleta: ' + objrow.boleta + '</span>');
            //    } else {
            //        alerta2('warning', '', 'Esta receta no se puede modificar, verifique el estado');
            //    }
            //    return false;
            //}
            /////////////COMENTADO POR KHOYOSI///////////////////////
        });

        $('#btnConsultar').on('click', async function () {
            RecetaGeneral.accion = 'C';
            Ordenes.accion = 'C';

            let objrowTb = oTable_RecetaGeneral.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
                return;
            } 
            Ordenes.CargarDiagnosticosOrdenesMedicas(objrowTb.idReceta); //RMOREANO 09032026
            Variables.Cargar(objrowTb);   
            
            RecetaGeneral.CargarCabeceraRecetaGeneral(objrowTb);            
            await RecetaGeneral.CargarDetalleRecetaGeneral(objrowTb);
                        
            Ordenes.BloquearCamposAntimicrobianos();   
            Ordenes.BloquearCamposIntervencionSanitaria();
            $(".OpcionesOrdenes").hide();
            $("#btnguardar").hide();
            Ordenes.ModoVistaIndividual();
            $("#modalReceta").modal("show");

            /////////////COMENTADO POR KHOYOSI///////////////////////
            //$('#txtNroCuentaRegistro').attr('disabled', false)
            //RecetaGeneral.limpiar();
            ////Ordenes.limpiarCatalogo();
            //Ordenes.LimpiarOrdenesMedicas();
            //$(".OpcionesOrdenes").hide();          //KHOYOSI
            //await RecetaGeneral.cargaDatosReceta(3)
            //Ordenes.ModoVistaIndividual();
            /////////////COMENTADO POR KHOYOSI///////////////////////
        });
       
        //$("#txtNroCuentaRegistro").on('blur', async function () { 
        //    await RecetaGeneral.listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);

        //    //await RecetaGeneral.SeleccionarDiagnosticos(Variables.IdAtencion, 1); // AGREGAR PARA INTERCONSULTA JDELGADOM         //COMENTADO PORQUE SE MOVIO A LA PARTE SUPERIOR LOS DAIGNOSTICOS - KHOYOSI 

        //    await Ordenes.ListarDiagnosticosRecetasPorAtencion(Variables.IdAtencion, 0); 

        //    $("#cboProductoServicio").focus();            
        //});

        $('#tblRecetaGeneral tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_RecetaGeneral.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblRecetaGeneral tbody').on('click', '.ImprimirRecetaGeneralSF', async function () {
            var objrow = oTable_RecetaGeneral.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RecetaGeneral.fnGetData(objrow);

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

        $('#tblRecetaGeneral tbody').on('click', '.ImprimirRecetaGeneralCF', async function () {
            var objrow = oTable_RecetaGeneral.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RecetaGeneral.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        // rmoreanoo

        $('#tblRecetaGeneral tbody').on('click', '.ImprimirPetitorioSF', async function () {
            var objrow = oTable_RecetaGeneral.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RecetaGeneral.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeCro)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
                //$('#tblOrdenesMedicas tbody tr').removeClass('selected');
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblRecetaGeneral tbody').on('click', '.ImprimirPetitorioCF', async function () {
            var objrow = oTable_RecetaGeneral.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RecetaGeneral.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeCro);
        });
        //fin rmoreano 

        $('#btnguardar').on('click', async function () {
            if ($('#hdIdCuentaAtencion').val() == "") {
                alerta('2', 'Ingrese un Nro. de cuenta');
                return false
            }

            if ($('#txtFechaVigencia').val() == "") {
                alerta('2', 'Ingrese fecha de vigencia');
                return false
            }

            const datarec = await Ordenes.GuardarOrdenesMedicasV2();
            console.log(datarec);
            if (datarec.length > 0) {

                if (RecetaGeneral.accion == 'A') {
                    //const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, $('#hdIdTipoFuenteFian').val(), RecetaGeneral.idServicioSelect, RecetaGeneral.idMedicoSelect);
                    VisorReceta.AbrirVisorRecetas(datarec);
                } else if (RecetaGeneral.accion == 'M') {
                    //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorIdReceta(RecetaGeneral.idRecetaSelect, $('#hdIdTipoFuenteFian').val(), RecetaGeneral.idServicioSelect, RecetaGeneral.idMedicoSelect);
                    VisorReceta.AbrirVisorRecetas(datarec);
                } else {
                    const recetas = null;
                    VisorReceta.AbrirVisorRecetas(recetas);
                }

                Ordenes.LimpiarOrdenesMedicas();
                Variables.Limpiar();
                RecetaGeneral.limpiar();

                $('#modalReceta').modal('hide');

                RecetaGeneral.ListaRecetasV2();   //KHOYOSI

            }           
        });

        $('#btnCerrarRecetasGeneral').on('click', async function () {
            RecetaGeneral.limpiar();
            Ordenes.activaTabs();            
            Ordenes.LimpiarOrdenesMedicas();
            $('#modalReceta').modal('hide');
        });



    },

    initDatablesRecetaGeneral() {
        var parms = {
            //"order": [[7, "desc"]],
            //destroy: true,
            //responsive: true,
            //bFilter: false,
            //buttons: ['copy', 'csv', 'print'],
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    data: "fechaReceta",
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
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }

                }
                ,
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }

                }
                ,                
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "desptCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "descEstado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstado == 0) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstado == 3) {
                            $(td).parent().css('color', '#ff9933');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                }
                ,
                {
                    /*width: '5%',                    */
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            let btnRuta = "";
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirRecetaGeneralCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirRecetaGeneralSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                },
                {
                    /*width: '5%',                    */
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '' && rowData.pacienteCronico == true) {
                            let btnRuta = "";
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                            if (rowData.statusFirmaCro == 1 ) {
                                btnImprime = ' <button class="ImprimirPetitorioCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-eye"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirPetitorioSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                },
            ]

        }

        var tableWrapper = $('#tblRecetaGeneral'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RecetaGeneral = $("#tblRecetaGeneral").dataTable(parms);
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

    /*------------BUSQUEDA DE CUENTAS----------------------------------*/
    async BuscarNumeroCuenta(idCuentaAtencion) {
        RecetaGeneral.LimpiarCabeceraRecetaGeneral();
        Ordenes.LimpiarOrdenesMedicas();

        let datos = await Utilitario.AtencionesSelecionarPorCuenta(idCuentaAtencion);

        if (isEmpty(datos)) {
            return;
        }

        if (datos.idEstadoAtencion != 1) {
            alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
            return;
        }

        if (datos.idEstado != 1) {
            //alerta(3, "El estado de Cuenta no se encuentra ABIERTO");
            let msj = ''
            if (datos.idEstado == 5 || datos.idEstado == 11 || datos.idEstado == 13) {
                msj = 'La cuenta se encuentra CERRADA.';
            }
            if (datos.idEstado == 4) {
                msj = 'La cuenta se encuentra en estado PAGADA.';
            }
            if (datos.idEstado == 9) {
                msj = 'La cuenta se encuentra ANULADA.';
            }
            if (datos.idEstado == 10) {
                msj = 'La cuenta se encuentra en ALTA MÉDICA.';
            }
            if (datos.idEstado == 12) {
                msj = 'El paciente esta pendiente de recepcionar en el servicio.';
            }

            alerta2("warning", "Alerta", msj);

            return;
        }
                                
        if (datos.idTipoServicio != $('#hdIdTipoServicio').val()) {
            alerta2("warning", "Alerta", "La cuenta no pertenece a este servicio");
            return;
        }

        if ($('#hdIdTipoServicio').val() == 1) {
            $('#cboFarmacia').val(116);
        }
        if ($('#hdIdTipoServicio').val() == 2) {
            $('#cboFarmacia').val(8);
        }
        if ($('#hdIdTipoServicio').val() == 3) {
            $('#cboFarmacia').val(4);
        }
        $('#cboFarmacia').change();

        //Ordenes.idCuentaAtencion = datos.idCuentaAtencion
        //Ordenes.idServicio = (datos.idServicioEgreso > 0 ? datos.idServicioIngreso : datos.idServicioEgreso);

        Variables.Cargar(datos);

        $('#hdIdCuentaAtencion').val(datos.idCuentaAtencion);
        $('#hdIdServicioPaciente').val((datos.idServicioEgreso > 0 ? datos.idServicioEgreso : datos.idServicioIngreso))
        $('#hdIdTipoFuenteFian').val(datos.idTipoFinanciamiento)
        $('#hdIdPaciente').val(datos.idPaciente);
        $('#hdNroEvaluacion').val(0);

        $("#txtNroCuentaRegistro").val(datos.idCuentaAtencion);
        $("#txtPacienteRegistro").val(datos.paciente);
        $("#txtDesPlan").val("IAFA Act: " + datos.planA);
        $("#cboProcedencia").val((datos.idServicioEgreso > 0 ? datos.idServicioEgreso : datos.idServicioIngreso));
                
        $('#cboMedicoReceta').val(datos.idMedicoEgreso > 0 ? datos.idMedicoIngreso : datos.idMedicoEgreso);
        let idMedico = await Ordenes.ObtenerIdMedicoSesion();
        Ordenes.ubicaMedico(idMedico);
               
        ///////////////PARA SOLICITUD CQX JDELGADO (MODIFICADO POR KHOYOSI)///////////////////////////////////////////////
        $("#txtNroHistoriaSolicitud").val(datos.nroHistoriaClinica);
        $("#txtEdadAnioSolicitud").val(datos.edadEnAnio);
        $("#txtEdadMesSolicitud").val(datos.edadEnMes);
        $("#txtEdadDiaSolicitud").val(datos.edadEnDia);
        $("#txtSexoSolicitud").val(datos.sexo);
        $("#txtServicioSolicitud").val(datos.servicio);
        $("#txtCamaSolicitud").val(datos.cama);
        $("#cboUbicacionPlaciente").val(datos.idTipoServicio);

        let fechaHoy = await Utilitario.FechaHoraServidor();
        $("#txtFechaSolicitudCQx").datepicker("setDate", fechaHoy.substring(0, 10));
        $('#txtHoraSolicitudCQx').val(fechaHoy.substring(11, 15));
        //////////////////////////////////////////////////////////////////////////////////

        await Ordenes.ListarDiagnosticosRecetasPorAtencion(Variables.IdAtencion, 0);


        //////////////////VALIDA ANTIMICROBIANOS////////////////////////////////////////
        $('#rdbGeneraSolAntimicSI').click();
        if (datos.idSolicitudAntimicrobiano == 0) {            
            $('input[name="rdbGeneraSolAntimic"]').attr("disabled", true);
        } else {
            $('input[name="rdbGeneraSolAntimic"]').removeAttr("disabled");
        }
        //////////////////////////////////////////////////////////////////////////////

        
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesOrdenes").show();
        $('#btnguardar').show();

        //console.log(datos);

    },

    //async listaPorCuenta(nroCuenta, permiso) {
    //    //Cargando(1);
    //    let datos;
    //    let resp = false;
    //    flagEstadoCuenta = false
    //    let midata = new FormData();
    //    midata.append('idCuenta', nroCuenta);
    //    let sigue = true;

    //    $(".OpcionesOrdenes").hide();          //KHOYOSI
                
    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
    //                data: midata,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        if (datos.table.length !== 0) {
    //            if (datos.table[0].idTipoServicio != $('#hdIdTipoServicio').val()) {
    //                //alerta('2', "Esta receta no pertenece a este servicio");
    //                swal({
    //                    title: 'Alerta',
    //                    html: "<h4><b>La cuenta no pertenece a este servicio<b></h4>",
    //                    type: 'warning',
    //                }).done();
    //                RecetaGeneral.limpiar()
    //                //limpiarValores();         //COMNETADO POR KHOYOSI
    //                //Ordenes.limpiarCatalogo();
    //                Ordenes.LimpiarOrdenesMedicas();

    //                return false;
    //            }
    //            else {
    //                Variables.Cargar(datos.table[0]);

    //                $('#btnguardar').css("visibility", 'visible');
    //                $("#txtDesPlan").val("IAFA Act: " + datos.table[0].dFuenteFinanciamiento);
    //                $("#txtPacienteRegistro").val(datos.table[0].apellidoPaterno + " " + datos.table[0].apellidoMaterno + " " + datos.table[0].primerNombre);

    //                idServicio = (datos.table[0].idServicioEgreso === null ? 0 : datos.table[0].idServicioEgreso);
    //                //alert(idServicio);
    //                $("#cboProcedencia").val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio);
    //                $('#hdIdServicioPaciente').val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio)
    //                $('#hdIdTipoFuenteFian').val(datos.table[0].idFormaPago)
    //                $('#hdIdPaciente').val(datos.table[0].idPaciente);
    //                $('#hdIdCuentaAtencion').val(datos.table[0].idCuentaAtencion);
    //                $('#hdNroEvaluacion').val(0);

    //                // PARA SOLICITUD CQX JDELGADO
    //                $("#txtNroHistoriaSolicitud").val(datos.table[0].nroHistoriaClinica)
    //                $("#txtEdadAnioSolicitud").val(datos.table[0].edadEnAnio)
    //                $("#txtEdadMesSolicitud").val(datos.table[0].edadEnMes)
    //                $("#txtEdadDiaSolicitud").val(datos.table[0].edadEnDia)
    //                $("#txtSexoSolicitud").val(datos.table[0].sexo)
    //                $("#txtServicioSolicitud").val(datos.table[0].servicioActual)
    //                $("#txtCamaSolicitud").val(datos.table[0].cama)
    //                $("#cboUbicacionPlaciente").val(Variables.IdTipoServicio)

    //                let fecha = new Date()
    //                let dia = fecha.getDate()
    //                let mes = parseInt(fecha.getMonth()) + 1
    //                let yyy = fecha.getFullYear()
    //                if (dia < 10)
    //                    dia = '0' + dia //agrega cero si el menor de 10
    //                if (mes < 10)
    //                    mes = '0' + mes
    //                fechaP = dia + "/" + mes + "/" + yyy

    //                let time1 = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? ("0" + fecha.getMinutes()) : fecha.getMinutes())
    //                //$('#txtFechaAtencion').val(fechaP)
    //                $("#txtFechaSolicitudCQx").datepicker("setDate", fechaP);
    //                $('#txtHoraSolicitudCQx').val(time1)

    //                ////////////////////////////////////////////////////////////////////////////////

    //                if (permiso == 1) {
    //                    //$('#cboMedico').val(datos.table[0].idMedicoIngreso);
    //                    $('#cboMedicoReceta').val(datos.table[0].idMedicoIngreso);
    //                    let idMedico = await Ordenes.ObtenerIdMedicoSesion();
    //                    Ordenes.ubicaMedico(idMedico);
    //                }

    //                if ($('#hdIdTipoServicio').val() == 1) {
    //                    $('#cboFarmacia').val(116)
    //                }
    //                if ($('#hdIdTipoServicio').val() == 2) {
    //                    $('#cboFarmacia').val(8)
    //                }
    //                if ($('#hdIdTipoServicio').val() == 3) {
    //                    $('#cboFarmacia').val(4)
    //                }
    //                //Respeta el orden
    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //                $('#cboFarmacia').change();

    //                $(".OpcionesOrdenes").show();          //KHOYOSI
    //            }
                
    //            if (datos.table[0].idEstado != 1) {
    //                //alerta(3, "El estado de Cuenta no se encuentra ABIERTO");
    //                let msj = ''
    //                if (datos.table[0].idEstado == 5 || datos.table[0].idEstado == 11 || datos.table[0].idEstado == 13) {
    //                    msj = 'La cuenta se encuentra CERRADA.';
    //                }
    //                if (datos.table[0].idEstado == 4) {
    //                    msj = 'La cuenta se encuentra en estado PAGADA.';
    //                }
    //                if (datos.table[0].idEstado == 9) {
    //                    msj = 'La cuenta se encuentra ANULADA.';
    //                }
    //                if (datos.table[0].idEstado == 10) {
    //                    msj = 'La cuenta se encuentra en ALTA MÉDICA.';
    //                }
    //                if (datos.table[0].idEstado == 12) {
    //                    msj = 'El paciente esta pendiente de recepcionar en el servicio.';
    //                }

    //                swal({
    //                    title: 'Alerta',
    //                    html: "<h4><b>" + msj + "<b></h4>",
    //                    type: 'warning',
    //                }).done();

    //                $('#btnguardar').css("visibility", 'hidden');
    //                flagEstadoCuenta = true
    //                $(".OpcionesOrdenes").hide();           //KHOYOSI

    //                return false;
    //            }
                
    //            if (permiso == 3) {
    //                $('#btnguardar').css("visibility", 'hidden');
    //                $(".OpcionesOrdenes").hide();          //KHOYOSI
    //                flagEstadoCuenta = true
    //            }
                
    //            resp = true;
    //        }

    //    } catch (error) {
    //        //console.error(error)
    //        Cargando(0);            
    //        alerta(3, error);
    //    }

    //    return resp;

    //},

    fechaDiaActualMasdias() {
        var fecha = new Date();
        // Número de días a agregar
        fecha.setDate(fecha.getDate() + 7);
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();

        fechaP = dia + "/" + mes + "/" + yyy

        return fechaP;
    },

    async ListaRecetas() {
        Cargando(1)
        oTable_RecetaGeneral.fnClearTable();
        var midata = new FormData();
        midata.append('nroReceta', $("#txtNroReceta").val());
        midata.append('nroCuenta', $("#txtNroCuenta").val());
        midata.append('nroDni', $("#txtNroDni").val());
        midata.append('nroHistoria', $("#txtNroHistoria").val());
        midata.append('apellidoPaterno', $("#txtApPaterno").val());
        midata.append('apellidoMaterno', $("#txtApMaterno").val());
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Receta/ListarRecetas?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.listaRecetas.table.length > 0) {
                        oTable_RecetaGeneral.fnAddData(datos.listaRecetas.table);
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

    async ListaRecetasV2() {
        const data1 = await RecetaGeneral.BuscarRecetas();
    },

    async BuscarRecetas() {
        Cargando(1);
        //console.log("ListaRecetasV2");
        oTable_RecetaGeneral.fnClearTable();
        var midata = new FormData();
        midata.append('nroReceta', $("#txtNroReceta").val());
        midata.append('nroCuenta', $("#txtNroCuenta").val());
        midata.append('nroDni', $("#txtNroDni").val());
        midata.append('nroHistoria', $("#txtNroHistoria").val());
        midata.append('apellidoPaterno', $("#txtApPaterno").val());
        midata.append('apellidoMaterno', $("#txtApMaterno").val());
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        var sigue = true;
        var respuesta;
        let datos;
        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/Receta/ListarRecetas?area=Comun",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            if (datos.session) {
                Cargando(0)
                if (datos.listaRecetas.table.length > 0) {
                    oTable_RecetaGeneral.fnAddData(datos.listaRecetas.table);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    async listaServicios() {

        var midata = new FormData();
        midata.append('idTipoServicio', $('#hdIdTipoServicio').val());

        $.ajax({
            //async: false,
            //cache: false,
            //url: "/Servicios/ListaServiciobyTipoServicio?area=Comun",
            //datatype: "json",
            //data: midata,
            //type: "post",
            url: "/Servicios/ListaServiciobyTipoServicio?area=Comun",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboProcedencia').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedencia').append('<option  value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
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

    async listaMedicos() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Receta/ListaMedicos?area=Comun",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMedico').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMedico').append('<option  value="' + obj.idMedico + '">' + obj.dmedico + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("3", "Error listar medicos!");
                }, 900)
            }
        });
    },

    async Guardar() {
        var formData = new FormData();
        let datos;
        let resp = false;
                
        var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
        var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
        var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
        var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
        var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
        var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
        var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
        var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12) // jdelgado011
        var ListaRecetaDetalleTomografia = Ordenes.DevolverRecetaDetalle(22) // jdelgado011

        //rayos
        formData.append('lstRecetaRx', ListaRecetaDetalleRx);
        formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
        //ecoobst
        formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
        formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());
        //EcoGeneral
        formData.append('lstRecetaEcoGeneral', ListaRecetaDetalleEcoGeneral);
        formData.append('idRecetaEcoGene', $('#hdIdRecetaEcoGene').val());
        //anatoPatolg
        formData.append('lstRecetaAnatoPatologica', ListaRecetaDetalleAnatoPatologica);
        formData.append('idRecetaAnaPatologica', $('#hdIdRecetaAnaPatologica').val());
        //patogClinica
        formData.append('lstRecetaPatalogiaClinica', ListaRecetaDetallePatalogiaClinica);
        formData.append('idRecetaPatoClinica', $('#hdIdRecetaPatoClinica').val());
        //patogClinica
        formData.append('lstRecetaBancoSangre', ListaRecetaDetalleBancoSangre);
        formData.append('idRecetaBancoSangre', $('#hdIdRecetabancoSangre').val());

        //JDELGADO011 TOMOGRAFIA
        formData.append('lstRecetaTomografia', ListaRecetaDetalleTomografia); //jdelgado011
        formData.append('idRecetaTomografia', $('#hdIdRecetatomografia').val()); //jdelgado011
        //farmacia
        formData.append('lstRecetaFarmacia', ListaRecetaDetalleFarmacia);
        formData.append('idRecetaFarmacia', $('#hdIdRecetaFarmacia').val());
        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());

        //JDELGADO011 INTERCONSULTA
        formData.append('lstRecetaInterconsulta', ListaRecetaDetalleInterconsulta); //jdelgado011
        formData.append('idRecetaInterconsulta', $('#hdIdRecetaInterconsulta').val()); //jdelgado011

        formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
        formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
        formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
        formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
        //JDELGADO011 INTERCONSULTA


        //formData.append('idMedico', $('#cboMedico').val());
        formData.append('idMedico', $('#cboMedicoReceta').val());
        formData.append('fechaVigencia', $('#txtFechaVigencia').val());
        //formData.append('idServicioReceta', $('#cboProcedencia').val());
        formData.append('idServicioReceta', $('#hdIdServicioPaciente').val());
        formData.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        formData.append('nroEvaluacion', $('#hdNroEvaluacion').val());

        alerta(4, 'Generando recetas, por favor espere.');
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/RegistraRecetas?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.rpt) {
                    if (datos.msjReceta != "") {
                        var recetas = [
                            { "idPuntoCarga": 21, "idReceta": datos.lrcRx },
                            { "idPuntoCarga": 2, "idReceta": datos.lrcPatoClin },
                            { "idPuntoCarga": 3, "idReceta": datos.lrcAnaPato },
                            { "idPuntoCarga": 11, "idReceta": datos.lrcBancoS },
                            { "idPuntoCarga": 20, "idReceta": datos.lrcEcoGene },
                            { "idPuntoCarga": 23, "idReceta": datos.lrcEcoObst },
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmacia },
                            { "idPuntoCarga": 22, "idReceta": datos.lrcTomografia },
                            { "idPuntoCarga": 12, "idReceta": datos.lrcInterconsulta }
                        ]
                        VisorReceta.AbrirVisorRecetas(recetas);
                        //idRecetaRX = datos.lrcRx;
                        //idRecetaPatCli = datos.lrcPatoClin;
                        //idRecetaAnatPat = datos.lrcAnaPato;
                        //idRecetaBs = datos.lrcBancoS;
                        //idRecetaEcoGene = datos.lrcEcoGene;
                        //idRecetaEcoObs = datos.lrcEcoObst;
                        //idRecetaFarm = datos.lrcFarmacia;

                        //console.log(idRecetaRx);
                        //console.log(idRecetaPatoClinica);
                        //console.log(idRecetaAnaPatologica);
                        //console.log(idRecetaBancoSangre);
                        //console.log(idRecetaEcoGene);
                        //console.log(idRecetaEcoObs);
                        //console.log(idRecetaFarmacia);

                        swal({
                            title: 'Recetas',
                            text: datos.msjReceta,
                            type: 'info',
                        }).done();

                        resp = true;
                    }

                    alerta('1', 'Se  registro correctamente las recetas');
                    //return false
                }
                else {
                    alerta('2', datos.msjReceta);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, JSON.stringify(error));
        }

        return resp;
    },

    async eliminar(idReceta) {
        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Receta/EliminaReceta?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {

                    if (datos.rpt) {
                        alerta2("success", "", "Se elimino correctamente la receta");
                    }
                    else {
                        alerta2("warning", "", datos.msj);
                        return false;
                    }
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0);
                alerta2("danger", "", "Error al eliminar receta");                
            }
        });

    },

    limpiar() {
        $('#txtNroCuentaRegistro').val("");
        $("#txtDesPlan").val("");
        $("#txtPacienteRegistro").val("");
        $("#cboProcedencia").val("");
        $('#hdIdServicioPaciente').val("");
        $('#hdIdTipoFuenteFian').val("");
        $('#hdIdPaciente').val("");
        $('#hdIdCuentaAtencion').val("");
        $('#hdNroEvaluacion').val("");

        $(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
        $(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
        $('#txtResumenHistoriaClinica').val('')
        $('#txtMotivoInterconsulta').val('')

        RecetaGeneral.hdIdServicio = 0;
        RecetaGeneral.hdNroEvaluacion = 0;

        RecetaGeneral.idRecetaSelect = 0;
        RecetaGeneral.idServicioSelect = 0;
        RecetaGeneral.idMedicoSelect = 0;

        $('#btnguardar').css("visibility", 'visible');
    },

    

    async cargaDatosReceta(permiso) {
        let datos;
        let resp = false;
        var objrow = oTable_RecetaGeneral.api(true).row('.selected').data();
        var midata = new FormData();
       

        if (isEmpty(objrow)) {
            alerta(2, 'Seleccione un registro');
            return false;
        }

        //--------------------VALIDA ANTIMICRIBOANO----------------------------
        if (objrow.esRecetaAntimicrobiano == 1 && permiso == 2) {
            if (objrow.idSolicitudAntimicrobiano > 0) {
                alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta ya cuenta con una SOLICITUD para aprobacion de antimicrobianos.<br>NO es posible MODIFICAR la receta.");
                return;
            }
        }
        //---------------------------------------------------------------------------

        midata.append('idReceta', objrow.idReceta);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetaCabeceraById?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            RecetaGeneral.limpiar();
            if (datos.session) {                
                await RecetaGeneral.listaPorCuenta(objrow.idCuentaAtencion, permiso);               

                $('#txtNroCuentaRegistro').attr('disabled', true)
                $('#btnMuestraPaquete').css("visibility", 'hidden');
                //$('#cboMedico').val(datos.lstReceta.table[0].idMedicoReceta);
                //$('#cboMedicoReceta').val(datos.lstReceta.table[0].idMedicoReceta);

               

                //Ordenes.limpiarCatalogo();
                //Ordenes.LimpiarOrdenesMedicas();

               // Ordenes.bloqueByPuntoCarga(objrow.idReceta, objrow.idPuntoCarga);
                $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);

                console.log('datos.lstReceta', datos.lstReceta)

                $("#cbointerconsultasCE").val(datos.lstReceta.table[0].codigoInterconsulta);

                $(`#cboEspecialidades option[value='${datos.lstReceta.table[0].idEspecialidad}']`).attr("selected", true);
                $(`#cboTipoAtencion option[value='${datos.lstReceta.table[0].idTipoConsulta}']`).attr("selected", true);

                

                $('.chzn-select').chosen().trigger("chosen:updated");

                //Ordenes.limpiarCatalogo();
                Ordenes.LimpiarOrdenesMedicas();
               // Ordenes.bloqueByPuntoCarga(objrow.idReceta, objrow.idPuntoCarga);
                Ordenes.CargarCabeceraPorPuntoCarga(datos.lstReceta.table[0]);
                $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
                
                //Ordenes.listaRecetasByIdRecetaByPuntoCarga(objrow.idReceta, objrow.idPuntoCarga);

                $('#txtResumenHistoriaClinica').val(datos.lstReceta.table[0].resumenHistoriaClinica)
                $('#txtMotivoInterconsulta').val(datos.lstReceta.table[0].motivoInterconsulta)

                if (datos.lstReceta.table[0].idMedicoReceta > 0) {
                    if ($('#cboMedicoReceta').val() == datos.lstReceta.table[0].idMedicoReceta) {
                        $('#cboMedicoReceta').attr("disabled", true);
                    }
                    $('#cboMedicoReceta').val(datos.lstReceta.table[0].idMedicoReceta);
                }

                $('#chkAntimicrobianos').prop('disabled', true);
                $('#chkAntimicrobianos').prop('checked', (datos.lstReceta.table[0].esRecetaAntimicrobiano == 1 ? true : false));
                $('#chkAntimicrobianos').change();
                datos.lstReceta.table[0].esRecetaAntimicrobiano == 1 ? $('#contentAntimicrobianos').show() : $('#contentAntimicrobianos').hide();
                
                $("#cboProcedencia").val(datos.lstReceta.table[0].idServicioReceta);                
                $('#hdIdServicioPaciente').val(datos.lstReceta.table[0].idServicioReceta);
                $('#hdNroEvaluacion').val(datos.lstReceta.table[0].nroEvaluacion);
                $('.chzn-select').chosen().trigger("chosen:updated");
                
                //Ordenes.SeleccionarRecetaDetalle(objrow.idReceta, objrow.idPuntoCarga);
                Ordenes.SeleccionarRecetaDetalle(objrow);
                RecetaGeneral.idRecetaSelect = objrow.idReceta;
                RecetaGeneral.idServicioSelect = objrow.idServicioReceta;
                RecetaGeneral.idMedicoSelect = objrow.idMedicoReceta;
                     
                if (flagEstadoCuenta == false) {
                    //Respeta el orden
                    if (datos.lstReceta.table[0].idEstado != 1) {
                        alerta2('warning', '', 'Verifique el estado de la receta');
                        $('#btnguardar').css("visibility", 'hidden');
                        $(".OpcionesOrdenes").hide();          //KHOYOSI
                        //ListaRecetas();
                    }
                    else {
                        $('#btnguardar').css("visibility", 'visible');
                        $(".OpcionesOrdenes").show();          //KHOYOSI
                    }
                }
                else {
                    $('#btnguardar').css("visibility", 'hidden');
                    $(".OpcionesOrdenes").hide();          //KHOYOSI
                }
                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#modalReceta').modal('show');

                resp = true;

            } else {
                Cargando(0);
                location.reload();
            }
            
        } catch (error) {
            //console.error(error)            
            Cargando(0);
            alerta(3, error);            
        }

        return resp;
        
    },




    // <summary>
    // METODOS 
    // </summary>
    // INICIALIZA METODOS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarCabeceraRecetaGeneral(datos) {
        RecetaGeneral.LimpiarCabeceraRecetaGeneral();
        if (isEmpty(datos) == false) {
            //Ordenes.idCuentaAtencion = datos.idCuentaAtencion;
            //Ordenes.idServicio = datos.idServicioReceta;

            $('#hdIdCuentaAtencion').val(datos.idCuentaAtencion);
            $('#hdIdServicioPaciente').val(datos.idServicioReceta)
            $('#hdIdTipoFuenteFian').val(datos.idTipoFinanciamiento)
            $('#hdIdPaciente').val(datos.idPaciente);
            $('#hdNroEvaluacion').val(datos.nroEvaluacion);

            $('#txtNroCuentaRegistro').attr('disabled', true);
            $('#cboProcedencia').attr('disabled', true);
            $("#btnmodalBusquedaCuentasAtenciones").hide();

            $("#txtNroCuentaRegistro").val(datos.idCuentaAtencion);
            $("#txtPacienteRegistro").val(datos.paciente);
            $("#txtDesPlan").val("IAFA Act: " + datos.planFinanciamiento);
            $("#cboProcedencia").val(datos.idServicioReceta);

            $('.chzn-select').chosen().trigger("chosen:updated");
        }
        /*$('#btnMuestraPaquete').css("visibility", 'hidden');*/        
    },
    
    async CargarDetalleRecetaGeneral(datos) {
        const receta = [];
        receta.push(datos);
        console.log(receta);
        //Ordenes.bloqueByPuntoCarga(data.idReceta, data.idPuntoCarga);
        //Ordenes.CargarCabeceraPorPuntoCarga(data);
        //Ordenes.CargarDatosRecetaCabecera(receta);
        await Ordenes.CargarDatosOrdenMedica(receta);
    },

    LimpiarCabeceraRecetaGeneral() {
        $('#hdIdServicioPaciente').val("");
        $('#hdIdTipoFuenteFian').val("");
        $('#hdIdPaciente').val("");
        $('#hdIdCuentaAtencion').val("");
        $('#hdNroEvaluacion').val("");

        $('#txtNroCuentaRegistro').removeAttr('disabled');
        $('#cboProcedencia').removeAttr('disabled');
        $('#btnMuestraPaquete').hide();
        $("#btnmodalBusquedaCuentasAtenciones").show();

        $("#txtNroCuentaRegistro").val("");
        $("#txtPacienteRegistro").val("");
        $("#txtDesPlan").val("");
        $("#cboProcedencia").val("");     

        //$(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
        //$(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
        //$('#txtResumenHistoriaClinica').val('')
        //$('#txtMotivoInterconsulta').val('')

        RecetaGeneral.hdIdServicio = 0;
        RecetaGeneral.hdNroEvaluacion = 0;
        RecetaGeneral.idRecetaSelect = 0;
        RecetaGeneral.idServicioSelect = 0;
        RecetaGeneral.idMedicoSelect = 0;

        $(".OpcionesOrdenes").hide();
        $('#btnguardar').hide();

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

}

//var RecetaGeneral = function () {    
//    //var idRecetaRX = 0;
//    //var idRecetaPatCli = 0;
//    //var idRecetaAnatPat = 0;
//    //var idRecetaBs = 0;
//    //var idRecetaEcoGene = 0;
//    //var idRecetaEcoObs = 0;
//    //var idRecetaFarm = 0;
//    //var flagEstadoCuenta = false;
//    var accion = '';
//    var idRecetaSelect = '';
    
    

//    //var limpiarValores= function() {
//    //     idRecetaRX = 0;
//    //     idRecetaPatCli = 0;
//    //     idRecetaAnatPat = 0;
//    //     idRecetaBs = 0;
//    //     idRecetaEcoGene = 0;
//    //     idRecetaEcoObs = 0;
//    //     idRecetaFarm = 0;
//    //}

    

//    // JDELGADO J0 CAMBIAR RECETAS
//    /*var tabSelect = '';*/
//    //function showHideTabs(idReceta, tab) {
//    //    if (idReceta == 0) {
//    //        $(`a[href="${tab}"]`).closest('li').hide()
//    //    } else {
//    //        $(`a[href="${tab}"]`).closest('li').show()
//    //        tabSelect = tab
//    //        //$(`a[href="${tab}"]`).click();
//    //        //$(`.nav-tabs a[href="${tab}"]`).tab('show');
//    //    }
//    //}
//    // JDELGADO J0 CAMBIAR RECETAS

    
    
    

    

//    ///////////////////KHOYOSI////////////////////////////
    

    
        
//    ///////////////////KHOYOSI////////////////////////////

    
    
    

//    ///////////////////////////////////GUARDAR RECETAS///////////////////////////////////////
    

//    ////////////////////////////////////////////////////////////////////////////////////////

   
    

    

//    //var cargaDatosReceta2 = function (permiso) { // JDELGADO J0 CAMBIAR RECETAS
//    //    var objrow = oTable_RecetaGeneral.api(true).row('.selected').data();
//    //    if (isEmpty(objrow)) {
//    //        alerta(2, 'Seleccione un registro');
//    //        return false;
//    //    }
//    //    else {

//    //        var midata = new FormData();
//    //        midata.append('idReceta', objrow.idReceta);

//    //        $.ajax({
//    //            type: 'POST',
//    //            url: "/Receta/ListaRecetaCabeceraById?area=Comun",
//    //            data: midata,
//    //            dataType: "json",
//    //            cache: false,
//    //            contentType: false,
//    //            processData: false,
//    //            success: function (datos) {
//    //                limpiar();
//    //                if (datos.session) {

//    //                    $('#txtNroCuentaRegistro').attr('disabled', true)
//    //                    $('#btnMuestraPaquete').css("visibility", 'hidden');
//    //                    //$('#cboMedico').val(datos.lstReceta.table[0].idMedicoReceta);
//    //                    $('#cboMedicoReceta').val(datos.lstReceta.table[0].idMedicoReceta);

//    //                    Ordenes.limpiarCatalogo();
//    //                    $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);

//    //                    listaPorCuenta(objrow.idCuentaAtencion, permiso);

//    //                    Ordenes.listaRecetasByIdRecetaByPuntoCarga(objrow.idReceta, objrow.idPuntoCarga);
//    //                    switch (objrow.idPuntoCarga) {
//    //                        case 21: idRecetaRX = objrow.idReceta; break;
//    //                        case 2: idRecetaPatCli = objrow.idReceta; break;
//    //                        case 3: idRecetaAnatPat = objrow.idReceta; break;
//    //                        case 11: idRecetaBs = objrow.idReceta; break;
//    //                        case 20: idRecetaEcoGene = objrow.idReceta; break;
//    //                        case 23: idRecetaEcoObs = objrow.idReceta; break;
//    //                        case 5: idRecetaFarm = objrow.idReceta; break;
//    //                        default: break;
//    //                    }
//    //                    //alert(datos.lstReceta.table[0].idServicioReceta);
//    //                    $("#cboProcedencia").val(datos.lstReceta.table[0].idServicioReceta);
//    //                    if (flagEstadoCuenta == false) {
//    //                        //Respeta el orden
//    //                        if (datos.lstReceta.table[0].idEstado != 1) {
//    //                            alerta(2, 'Verifique el estado de la receta');
//    //                            $('#btnguardar').css("visibility", 'hidden');
//    //                            //ListaRecetas();
//    //                        }
//    //                        else {
//    //                            $('#btnguardar').css("visibility", 'visible');
//    //                        }
//    //                    }
//    //                    else {
//    //                        $('#btnguardar').css("visibility", 'hidden');
//    //                    }
//    //                    $('.chzn-select').chosen().trigger("chosen:updated");
//    //                    $('#modalReceta').modal('show');
                        

//    //                } else {
//    //                    Cargando(0);
//    //                    location.reload();
//    //                }
//    //                return false;
//    //            },
//    //            error: function (result) {
//    //                Cargando(0);
//    //                alerta('3', 'Ocurrio un error al listar receta,Error!');
//    //                return false;
//    //            }
//    //        });
//    //    }
//    //}


//    //COMENTADO  POR KHOYOSI
//    //var imprimiInforme3 = function (idCuentaAtencion, code, idDoc, idReceta) { //JDELGADO J0 CAMBIAR RECETAS
//    //    //var midata = new FormData();

//    //    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idReceta + "&code=" + code + "&documentId=" + idDoc + "&tipo=O";
//    //    //$('#ifrmReporte').attr('src', url);

//    //    var request = new XMLHttpRequest();
//    //    request.responseType = "blob";
//    //    request.open("GET", url);
//    //    request.onload = function () {

//    //        var url = window.URL.createObjectURL(this.response);
//    //        var a = document.createElement("a");
//    //        document.body.appendChild(a);
//    //        a.href = url;
//    //        //a.download = this.response.name || "CE-" + $.now()
//    //        a.download = "CE-" + idCuentaAtencion + "-" + $.now()
//    //        a.click();

//    //    }
//    //    request.send();
//    //}

//    /////////////////////////////////////KHOYOSI///////////////////////////////////////////////
//    //var imprimirRecetaConFirma = function (idCuentaAtencion, idRegistro, code, idDoc, tipo) {
//    //    //var objrow = oTable_atenciones.api(true).row('.selected').data();
//    //    //var midata = new FormData();
//    //    Cargando(1);
//    //    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
//    //    //$('#ifrmReporte').attr('src', url);

//    //    var request = new XMLHttpRequest();
//    //    request.responseType = "blob";
//    //    request.open("GET", url);
//    //    request.onload = function () {
//    //        if (this.response.size > 0) {
//    //            var url = window.URL.createObjectURL(this.response);
//    //            var a = document.createElement("a");
//    //            document.body.appendChild(a);
//    //            a.href = url;
//    //            //a.download = this.response.name || "CE-" + $.now()
//    //            a.download = tipo + idCuentaAtencion + "-" + $.now()
//    //            //a.click();


//    //            AbrirVisorDocumento(url, 1);
//    //            if (tipo == 'REC-F') { $("#farmaciaRece-tab").click(); }
//    //            if (tipo == 'REC-RX') { $("#rayosRece-tab").click(); }
//    //            if (tipo == 'REC-EO') { $("#ecoObstRece-tab").click(); }
//    //            if (tipo == 'REC-EG') { $("#ecoGeneRece-tab").click(); }
//    //            if (tipo == 'REC-PC') { $("#patoClinicaRece-tab").click(); }
//    //            if (tipo == 'REC-AP') { $("#anatoPatoRece-tab").click(); }
//    //            if (tipo == 'REC-BS') { $("#bancoSangreRece-tab").click(); }
//    //            if (tipo == 'REC-I') { $("#interconsulta-tab").click(); }
//    //            //ListaAtencionesCE();
//    //        } else {
//    //            alerta(2, "El documento aún no está firmado digitalmente.")
//    //        }
//    //        Cargando(0);
//    //    }
//    //    request.send();
//    //}
//    /////////////////////////////////////////////////////////////////////////////////////////////

    

//}();



//;