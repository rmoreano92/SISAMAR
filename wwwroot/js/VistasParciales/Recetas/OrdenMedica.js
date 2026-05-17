var OrdenMedica = {
    nroEvaluaciones: 0,
    accion: '',
    tipoServicio: '',

    //recetita: [],
    IniciarScript() {
        OrdenMedica.IniciarDataTables();
        OrdenMedica.Eventos();
    },

    IniciarData() {

    },

    Limpiar() {
        //$("#btnConsultarOrdenMedica").hide();
        //$("#btnModificarOrdenMedica").hide();
        //$("#btnEliminarOrdenMedica").hide();
        //$("#btnEliminarOrdenMedica").hide();
        $(".OpcionesRecetas").hide();
        if (OrdenMedica.accion == 'M') {
            $("#btnAgregarOrdenMedica").show();
        }
    },

    IniciarDataTables() {
        OrdenMedica.IniciarDataTablesOrdenesMedicas();
    },

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA EVENTOS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#tblOrdenesMedicas tbody').on('click', 'tr', async function () {
            //$("#btnConsultarOrdenMedica").hide();
            //$("#btnModificarOrdenMedica").hide();
            //$("#btnEliminarOrdenMedica").hide();
            $(".OpcionesRecetas").hide();
            $(".OpcionesOrdenes").hide();

            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');
            //}
            //else {
            //    oTable_OrdenesMedicas.$('tr.selected').removeClass('selected');
            //    $(this).addClass('selected');
            //}

            oTable_OrdenesMedicas.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            if (OrdenMedica.accion == 'M') {
                $("#btnAgregarOrdenMedica").show();
                var objrowTb = oTable_OrdenesMedicas.api(true).row('.selected').data();
                if (!isEmpty(objrowTb)) {
                    //$("#btnConsultarOrdenMedica").show();
                    let idMedico = await Ordenes.ObtenerIdMedicoSesion();
                    if (objrowTb.idMedico == idMedico) {
                        $(".OpcionesRecetas").show();
                        $("#btnModificarOrdenMedica").show();
                        $("#btnEliminarOrdenMedica").show();
                    }
                }
            }


        });

        $('#btnAgregarOrdenMedica').on('click', async function () {
            Ordenes.accion = "A";
            let evaluacion = $('#hdNroEvaluacion').val();
            if (evaluacion == 0) {
                alerta2("info", "", "Por favor antes de generar una orden medica, seleccione un evaluación.");
                return;
            } else if (evaluacion > OrdenMedica.nroEvaluaciones) {
                alerta2("info", "", "Por favor antes de generar una orden medica, guarde la evaluación actual.");
                return;
            }

            Ordenes.LimpiarOrdenesMedicas();
            Ordenes.activaTabs();
            await Ordenes.listaFecha();
            let idMedico = await Ordenes.ObtenerIdMedicoSesion();
            Ordenes.ubicaMedico(idMedico);
            Ordenes.CargarDiagnosticosOrdenesMedicas(0);
            Ordenes.ModoVistaMultiple();
            Ordenes.ubicaFarmacia(await Utilitario.ConfiguracionIpress(1073)); //rmoreano 09042023
   

            $('#btnMuestraPaquete').css("visibility", 'visible');
            $(".OpcionesOrdenes").show();
            $("#btnGuardarRecetas").show();
            $('#modalReceta').modal('show');
        });

        $('#btnModificarOrdenMedica').on('click', async function () {
            Ordenes.accion = "M";
            var objrowTb = oTable_OrdenesMedicas.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
                return;
            }

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

                //Ordenes.CargarDiagnosticosOrdenesMedicas(objrowTb.idReceta);
                OrdenMedica.CargarRecetaDetalle(objrowTb);
                let idMedico = await Ordenes.ObtenerIdMedicoSesion();
                if (objrowTb.idMedico == idMedico) {
                    //Ordenes.ubicaMedico(objrowTb.idMedico);
                    $(".OpcionesOrdenes").show();

                    $("#btnGuardarRecetas").show();
                    $("#modalReceta").modal("show");
                }
                Ordenes.ModoVistaIndividual();
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
        });

        $('#btnConsultarOrdenMedica').on('click', async function () {
            Ordenes.accion = "C";
            var objrowTb = oTable_OrdenesMedicas.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                //Ordenes.CargarDiagnosticosOrdenesMedicas(objrowTb.idReceta);
                await OrdenMedica.CargarRecetaDetalle(objrowTb);

                //Ordenes.BloquearCamposAntimicropbianos();
                Ordenes.ModoVistaIndividual();
                //Ordenes.ubicaMedico(objrowTb.idMedico);
                $(".OpcionesOrdenes").hide();
                $("#btnGuardarRecetas").hide();
                $("#modalReceta").modal("show");
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#btnEliminarOrdenMedica').on('click', function () {
            Ordenes.accion = "E";
            var objrow = oTable_OrdenesMedicas.api(true).row('.selected').data();
            if (objrow.idEstado == 1) {
                //--------------------VALIDA ANTIMICRIBOANO----------------------------
                if (objrow.esRecetaAntimicrobiano == 1) {
                    if (objrow.idSolicitudAntimicrobiano > 0) {
                        alerta2("info", "", "Es una RECETA de ANTIMICROBIANOS.<br>La receta ya cuenta con una SOLICITUD para aprobacion de antimicrobianos.<br>NO es posible ELIMINAR la receta.");
                        return;
                    }
                }
                //---------------------------------------------------------------------------

                swal({
                    title: 'Eliminar',
                    text: 'Estas seguro de eliminar la receta?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        Ordenes.EliminarOrdenesMedicas(objrow.idReceta)
                        await OrdenMedica.CargarOrdenesMedicasPorIdCuentaAtencion(Variables.IdCuentaAtencion);
                    } 
                    
                }, function (dimiss) { });
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

        $('#btnGuardarRecetas').on('click', async function () {
            const datarec = await Ordenes.GuardarOrdenesMedicasV2();
            if (datarec.length > 0) {

                ///////////////SOLO PARA ACTUALZIAR EL INFORME DE EVALAUCION DE UCI//////////////////////
                if (OrdenMedica.tipoServicio == "UCI") {
                    //console.log(RegistroEvaluacionesUCI);
                    const pdf = await Utilitario.GenerarHojaInformeUCI(RegistroEvaluacionesUCI.idCuentaAtencion, RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.IdServicio, RegistroEvaluacionesUCI.nroEvaluacion);
                }
                /////////////////////////////////////////////////////////////////////////////////////////

                $("#modalReceta").modal("hide");
                console.log(datarec);
                //recetita.find(({ idReceta }) => idReceta > 0).idReceta
                await OrdenMedica.CargarOrdenesMedicasPorIdCuentaAtencion(Variables.IdCuentaAtencion);
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                VisorReceta.AbrirVisorRecetas(datarec);
            }
        });

        $('#btnCerrarRecetas').on('click', function () {
            Ordenes.LimpiarOrdenesMedicas();
            $("#modalReceta").modal("hide");
        });


        $('#tblOrdenesMedicas tbody').on('click', '.ImprimirRecetaSF', async function () {
            var objrow = oTable_OrdenesMedicas.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicas.fnGetData(objrow);

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

        $('#tblOrdenesMedicas tbody').on('click', '.ImprimirRecetaCF', async function () {
            var objrow = oTable_OrdenesMedicas.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicas.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA DATA TABLE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    IniciarDataTablesOrdenesMedicas() {
        var parms = {
            scrollY: "250px",
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
                    width: "8%",
                    targets: 0,
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.esRecetaAntimicrobiano > 0) {
                            $(td).parent().css('color', '#fdb307');
                            $(td).parent().css('font-weight', 'bold');

                            if (rowData.autorizaAntimicrobiano == 1) {
                                $(td).parent().css('color', '#0054f3');
                                $(td).parent().css('font-weight', 'bold');
                            }
                            if (rowData.autorizaAntimicrobiano == 0) {
                                $(td).parent().css('color', '#dd003b');
                                $(td).parent().css('font-weight', 'bold');
                            }
                        }
                    }
                },
                {
                    width: "15%",
                    targets: 1,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "15%",
                    targets: 2,
                    data: "tipoOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "30%",
                    targets: 3,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "12%",
                    targets: 4,
                    data: "fechaRecetaMedica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "12%",
                    targets: 5,
                    data: "estadoReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "8%",
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirRecetaCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirRecetaSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblOrdenesMedicas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_OrdenesMedicas = $("#tblOrdenesMedicas").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA CONSUMO BD
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async CargarOrdenesMedicasPorIdCuentaAtencion(idCuenta) { // KHOYOSI
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idCuentaAtencion', idCuenta);

        try {
            oTable_OrdenesMedicas.fnClearTable();
            OrdenMedica.Limpiar();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListarOrdenesMedicasPorIdCuentaAtencion?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_OrdenesMedicas.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }

        //return resp;
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA METODOS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarRecetaDetalle(data) {
        const receta = [];
        receta.push(data);
        console.log(receta);
        //Ordenes.bloqueByPuntoCarga(data.idReceta, data.idPuntoCarga);
        //Ordenes.CargarCabeceraPorPuntoCarga(data);
        //Ordenes.CargarDatosRecetaCabecera(receta);  
        Ordenes.CargarDatosOrdenMedica(receta);
    },



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




}