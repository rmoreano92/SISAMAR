var EvaluacionNeonatal = {

    async cargaInicial() {
        nuevaEvalNeo = false;
        modificaEvalNeo = false;
        opcionModificar = false;

        await this.ListarTiposGravedadAtencion();
        await this.ListarTiposServiciosMGP();
        await this.ListarOrigenAtencionEmergencia();
        await this.ListarTiposSexo();

        $("#txtOtroSintomas").hide();
    },

    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {

        $('#tblEvaluacionesEmergencia tbody').on('click', 'tr', async function () {
            nuevaEvalNeo = false
            modificaEvalNeo = true;

            $(".OpcionesCPT").hide();
            $(".OpcionesOrdenes").hide();
            $(".OpcionesDiagnosticos").hide();
            $("#FirmarEvalNeo").hide();
            $("#evaluaciones .entrada").attr('disabled', 'disabled');

            $("#CardEvaNeo").removeClass("bg-blue");
            $("#btnGuardarEvaNeo").hide();

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_EvaEmer.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_EvaEmer.api(true).row($(this)).index();
            var row = oTable_EvaEmer.fnGetData(pos);

            //console.log("Entro Lista Evaluaciones " + pos + " --- " + row);
            pos = row.idNumero - 1;
            //$("#FirmarEvalNeo").attr("href", row.ruta); (COEMNTADO POR KHOYOSI - ANTERIOR FIRMA)

            Cargando(1);
            await EvaluacionNeonatal.CargarDatosEvaluacionDetalle(row.idAtencion, row.idNumero, pos);
            Cargando(0);
            /*
            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);

            if (row.tipoRef == 1) {
                $('.txtDatos').html('Referencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            } else if (row.tipoRef == 2) {
                $('.txtDatos').html('Contrareferencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            }
            */

        });

        $('.OpcionEvalNeo').on('click', function () {
            nuevaEvalNeo = false;
            modificaEvalNeo = false;

            $("#txtFecNac").attr('disabled', true);
            $("#txtHoraNac").attr('disabled', true);
            $("#cboSexo").attr('disabled', true);
            $("#txtNroHijo").attr('disabled', true);

            $("#CardEvaNeo").removeClass("bg-blue");
            $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalNeo").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)
            $("#btnGuardarEvaNeo").show();
            //console.log("Entro Card Opciones");

            $('.chzn-select').chosen().trigger("chosen:updated");
        });


        $('#chkOtros').on('click', function () {
            if ($('#chkOtros').is(":checked")) {
                $("#txtOtroSintomas").show();
            } else {
                $("#txtOtroSintomas").val("");
                $("#txtOtroSintomas").hide();
            }

            //console.log("Entro Card Opciones");
        });



        /////////////////////EVENTOS IMPRIMIR RECETAS////////////////////////////////COMENTADO POR KHOYOSI
        //$("#farmaciaRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaFarm;
        //    $('#ifrmRecetaFarm').attr('src', url);
        //});
        //$("#rayosRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaRX;
        //    $('#ifrmRecetaRx').attr('src', url);
        //});
        //$("#ecoObstRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaEcoObs;
        //    $('#ifrmRecetaEcoObs').attr('src', url);
        //});
        //$("#ecoGeneRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaEcoGene;
        //    $('#ifrmRecetaEcoGene').attr('src', url);
        //});
        //$("#anatoPatoRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaAnatPat;
        //    $('#ifrmRecetaAnaPatolg').attr('src', url);
        //});
        //$("#patoClinicaRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaPatCli;
        //    $('#ifrmRecetaPatoClini').attr('src', url);
        //});
        //$("#bancoSangreRece-tab").on("click", function () {
        //    var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtt + "&idReceta=" + idRecetaBs;
        //    $('#ifrmRecetaBs').attr('src', url);
        //});
        /////////////////////////////////////////////////////////////////////////////

        /////////////////////EVENTOS IMPRIMIR INFORME Y EVALUACION/////////////////////////////
        //$('#tblAtencionEmer tbody').on('click', '.ImprimirEvalNeoEmerSinF', async function () {
        //    var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atencionesEmer.fnGetData(objrow);

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'NEOE-1');

        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idAtencion, row.idServicioEgreso, 1);
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#btnBuscarAtenciones").click();
        //        } else {
        //            alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
        //        }
        //    } else {
        //        AbrirVisorDocumento(firma.rutaArchivo, 0);
        //    }

        //    //console.log("RUTA: " + ruta);
        //    //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivoEmer);
        //    //$('#modalVisorDocumento').modal('show');
        //    //ImprimirRefCon(row.rutaArchivoRefCon)
        //});

        //$('#tblAtencionEmer tbody').on('click', '.ImprimirEvalNeoEmerConF', async function () {
        //    var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atencionesEmer.fnGetData(objrow);

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'NEOE-1')               //KHOYOSI
        //    imprimirDocumentoConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo);
        //    //imprimirDocumentoConFirma(row.idCuentaAtencion, row.code, row.idDoc, row.tipo);            
        //});

        $('#ImprimirEvalNeoEmerSinF').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            var objrowTb2 = oTable_atencionesEmer.api(true).row('.selected').data();
            //var row = oTable_EvaEmer.fnGetData(objrowTb);
            var rutaInfoEme = '';

            //if (isEmpty(objrowTb)) {
            //    alerta(2, 'Seleccione una evaluación por favor.');
            //    return false;
            //}

            //rutaInfoEme = objrowTb.rutaArchivoEmer;
            //$("#visorDocumento").attr("src", rutaInfoEme);
            //$('#modalVisorDocumento').modal('show');

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
                return false;
            } else {
                var tipo = 'NEOE-' + objrowTb.idNumero;
                const firma = await Utilitario.SeleccionarFirmaDigital(objrowTb.idCuentaAtencion, objrowTb.idCuentaAtencion, tipo);

                if (objrowTb2.conAlta != objrowTb.conAlta && objrowTb.idNumero == 1) {
                    console.log("TIENE ALTA");
                    swal({
                        title: 'Mensaje',
                        text: 'El paciente cuenta con alta médica. Se actualizará la hoja de evaluación.',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#6c6c6c',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                    }).then(async function () {
                        //rutaInfoEme = EvaluacionNeonatal.GenerarHojaAtencion(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                        //EvaluacionNeonatal.GenerarHojaEvaluacion(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                        const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                        if (pdf) {
                            alerta('1', 'Se generó el documento correctamente.')
                            $("#btnBuscarAtenciones").click();
                        } else {
                            alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                        }
                    }, function (dimiss) {

                    });
                } else {
                    if (typeof firma === 'undefined') {
                        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                        const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                        if (pdf) {
                            alerta('1', 'Se generó el documento correctamente.')
                            $("#btnBuscarAtenciones").click();
                        } else {
                            alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                        }
                    } else {
                        AbrirVisorDocumento(firma.rutaArchivo, 0);
                    }
                    //rutaInfoEme = objrowTb.rutaArchivoEmer;
                    //$("#visorDocumento").attr("src", PathServerFiles + rutaInfoEme);
                    //$('#modalVisorDocumento').modal('show');
                }


            }
            //console.log(row);            
            //ImprimirRefCon(row.rutaArchivoRefCon)
        });

        ///////////////FIRMAS DE EVALUACIONES ANTERIOR///////////////////////
        //$('#FirmarEvalNeo').on('click', function () {
        //    var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
        //    var row = oTable_EvaEmer.fnGetData(objrowTb);
        //    var rutaInfoEme = '';

        //    if (isEmpty(objrowTb)) {
        //        alerta(2, 'Seleccione una evaluación por favor.');
        //        return false;
        //    }
        //});
        //////////////////////////////////////////////////////////////////
                
        $('#ImprimirEvalNeoEmerConF').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            var row = oTable_EvaEmer.fnGetData(objrowTb);

            var tipo = 'NEOE-' + objrowTb.idNumero;
            const firma = await Utilitario.SeleccionarFirmaDigital(objrowTb.idCuentaAtencion, objrowTb.idCuentaAtencion, tipo);
            imprimirDocumentoConFirma2(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo);
            //imprimirDocumentoConFirma2(objrowTb.idCuentaAtencion, objrowTb.code, objrowTb.idDoc, objrowTb.tipo);            
        });
        ///////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////FIRMAR CON Bit4ID/////////////////////////////////////
        $('#FirmarEvalNeo').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            var row = oTable_EvaEmer.fnGetData(objrowTb);
            var rutaInfoEme = '';

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
                return false;
            }

            await Utilitario.AbrirServicioFirmaBit4Id(row.idRegistro, row.idCuentaAtencion, row.tipo);
        });
        ///////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasEmer').on('click', async function () {
            var row = oTable_EvaEmer.api(true).row('.selected').data();
            console.log(row);
            if (typeof row === 'undefined') {
                alerta(2, "Seleccione una evaluación por favor.");
            } else {
                const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionNeonatal.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
                VisorReceta.AbrirVisorRecetas(recetas);
                //if (isEmpty(OrdenesRecetasMedicas)) {
                //    alerta(2, "No existen recetas para esta evaluación.");
                //} else {
                //    VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicas);
                //}
            }
            //console.log(OrdenesRecetas);            
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////


        $("#btnCancelarEvaNeo").on('click', function () {
            swal({
                title: 'CANCELAR',
                text: "¿Esta seguro de cancelar la evaluación?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function () {
                AdmisionEmergencia.limpiarRecetas()
                EvaluacionNeonatal.LimpiarModuloNeonatal();
                AdmisionEmergencia.CerrarModulo();
                ReposicionarVista();
                MostrarAreaLista();
            }, function (dimiss) {

            });
            
        });

        /////////////////////////AGREGAR NUEVO EVALUACION////////////////////////////////////
        $("#btnNuevoRegistro").on('click', async function () {
            Cargando(1);
            var eval = oTable_EvaEmer.DataTable().data().count();
            Diagnosticos.LimpiarDiagnosticosAtencion();

            Ordenes.ubicaFarmacia(8);    //farmacia por defecto: Farmacia de Emergencias
            Ordenes.limpiarCatalogoV2();
            //console.log("MEDICOOO: " + Ordenes.ObtenerIdMedicoSesion());
            //Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());
            asigna_FechaHoraAtencion(null);

            $("#lblNumeroEvaluacion").html("");
            $("#lblTipoEvaluacion").html("");
            $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");

            $("#CardEvaNeo").removeClass("bg-blue");
            $("#BadgeEvaluacion .msc-hotline").removeClass("bg-blue");
            $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-info");

            $("#CardEvaNeo").addClass("bg-blue");
            //$("#BadgeEvaluacion .msc-hotline").addClass("bg-green");
            $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
            $("#CardEvaNeo").addClass("bg-blue");

            $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
            $("#lblTipoEvaluacion").html("Nueva Evaluación");

            $('#txtImpresionDiagnosticaNeo').val("");
            $('#txtTratamientoNeo').val("");
            $('#txtPlanTrabajoNeo').val("");

            $("#evaluaciones-tab").click();
            $("#diagnosticos-tab-link").click();

            $("#evaluaciones .entrada").removeAttr("disabled");
            $(".OpcionesCPT").show();
            $(".OpcionesOrdenes").show();
            $(".OpcionesDiagnosticos").show();
            $("#FirmarEvalNeo").show();
            $("#btnGuardarEvaNeo").show();

            swal({
                title: 'Evaluaciones',
                text: "Paciente iniciará la evaluación N° " + (eval + 1),
                type: 'info',
            }).done();

            nuevaEvalNeo = true;
            modificaEvalNeo = false;
            //console.log("Entro Habilitar Evaluaciones");
            //console.log("Evaluacion Nueva N° " + (eval+1));
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// DATATABLES
    /// </summary>
    /// INICIALIZA DATA TABLE DE EVALAUACIONES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    IniciarDataTablesEvaluacion() {
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
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblEvaluacionesEmergencia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaEmer = $("#tblEvaluacionesEmergencia").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*==================================INICIALIZAR TABLAS=======================================*/
    //initDatables() {
    //    var parms = {
    //        scrollY: "145px",
    //        scrollCollapse: true,
    //        autoWidth: false,
    //        ordering: false,
    //        //deferRender: true,
    //        //scroller: true,
    //        data: null,
    //        destroy: true,
    //        info: false,
    //        bFilter: false,
    //        paging: false,
    //        responsive: true,
    //        columns: [
    //            {
    //                width: "15%",
    //                targets: 0,
    //                data: "idNumero",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'center')
    //                }
    //            },
    //            {
    //                width: "85%",
    //                targets: 1,
    //                data: "medico",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            }
    //        ]

    //    }

    //    var tableWrapperEmer = $('#tblEvaluacionesEmergencia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        
    //    oTable_EvaEmer = $("#tblEvaluacionesEmergencia").dataTable(parms);
    //},
    /*===================================================================================*/

    /// <summary>
    /// LLENAR COMBOS
    /// </summary>
    /// Lista de metodos que se encargan de llenar y cargar los combobox con los valroes correspondientes
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async ListarTiposGravedadAtencion() {
        let datos;
        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/Utilitario/ListarTiposGravedadAtencion?area=Comun",
                //data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            $('#cboPrioridad').empty();
            if (datos.session) {
                $(datos.lsTiposGravedad.table).each(function (i, obj) {
                    $('#cboPrioridad').append('<option  value="' + obj.idTipoGravedad + '">' + obj.descripcion + '</option>');
                });
                $('#cboPrioridad').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposServiciosMGP() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposServiciosMGP?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoPaciente').empty();
            if (datos.session) {
                $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                    $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoPaciente').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarOrigenAtencionEmergencia() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarOrigenAtencionEmergencia?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboOrigenPaciente').empty();
            if (datos.session) {
                $(datos.lsOrigenAtencionEmer.table).each(function (i, obj) {
                    $('#cboOrigenPaciente').append('<option  value="' + obj.idOrigenAtencion + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboOrigenPaciente').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposSexo() {
        let datos;
        try {
            datos = await
            $.ajax({
                method: "GET",
                url: "/Utilitario/ListaTiposSexo?area=Comun",
                //data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            $('#cboSexo').empty();
            if (datos.session) {                
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
                $('#cboSexo').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    


    //////////////////////OPCIONES DE EDICION Y CONSULTA//////////////////////////////
    Consultar() {
        opcionModificar = false;
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta(2, 'La cuenta esta cerrada.');            
        }

        if (objrowTb.tipoPaciente == "Neonatologia") {
            this.ConsultarEvaluacion();
        } else {
            alerta(2, 'El paciente no es Neonato.');
        }
        //this.ModificarEvaluacion(); //comentar luego (solo para pruebas)
        //console.log(objrowTb);
    },

    ConsultarEvaluacion() {
        opcionModificar = false;
        var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionNeonatal.LimpiarModuloNeonatal();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        EvaluacionNeonatal.CargarDatosEvaluacion();
        //console.log("aqui estoys")
        EvaluacionNeonatal.AbrirModalNeonatal();

        AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)


        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        $("#btnGuardarEvaNeo").hide();
        $("#btnNuevoRegistro").hide();
        EvaluacionNeonatal.BloquearCampos();

        MostrarAreaRegistro();
        //console.log("ENTROO");
    },

    Modificar() {
        opcionModificar = true;
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta(2, 'La cuenta esta cerada.');
            return false;
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            alerta(2, 'El paciente tiene alta médica.');
            return false;
        }

        if (objrowTb.tipoPaciente == "Neonatologia") {            
            this.ModificarEvaluacion();
        } else {
            alerta(2, 'El paciente no es Neonato.');
        }
        //this.ModificarEvaluacion(); //comentar luego (solo para pruebas)
        //console.log(objrowTb);
    },

    ModificarEvaluacion() {
        opcionModificar = true;
        var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
                
        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionNeonatal.LimpiarModuloNeonatal();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        EvaluacionNeonatal.CargarDatosEvaluacion();
        EvaluacionNeonatal.AbrirModalNeonatal();

        AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)

        idPacienteGlobal = objrow.idPaciente;     //idPaciente para el Alta

        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        $("#btnGuardarEvaNeo").show();
        $("#btnNuevoRegistro").show();
        EvaluacionNeonatal.DesbloquearCampos();

        MostrarAreaRegistro();
        //console.log("ENTROO");
    },
    /////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////CARGA DE DATA///////////////////////////////////////
    CargarDatosEvaluacion() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        $("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento);
        $("#txtEdadAnio").val(objrowTb.edadEnAnio);
        $("#txtEdadMes").val(objrowTb.edadEnMes);
        $("#txtEdadDia").val(objrowTb.edadEnDia);
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion);
        $("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrowTb.idCuentaAtencion);
        $("#txtNroAtencion").val(objrowTb.idAtencion);
        $("#cboTipoPaciente").val(objrowTb.idTipoPaciente);
        $("#cboOrigenPaciente").val(objrowTb.idOrigenAtencion);
        $("#cboPrioridad").val(objrowTb.idTipoGravedad);
        $("#hdIdTipoFuenteFian").val(objrowTb.idFuenteFinanciamiento);
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso)
        IdCuentaAtencionTemp = objrowTb.idCuentaAtencion;       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        Triaje.listaTriajeEmgHosp(objrowTb.idAtencion, objrowTb.idServicioEgreso, 0);

        var EvaNeo = EvaluacionNeonatal.SeleccionarEvaluacionNeonatal(objrowTb.idAtencion);
        var EvaDetneo = EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatal(objrowTb.idAtencion);
        var ExaFisNeo = EvaluacionNeonatal.SeleccionarExamenFisicoNeonatal(objrowTb.idAtencion);
        var EvaAnte = EvaluacionNeonatal.SeleccionarAntecedentes(objrowTb.idAtencion);

        //----------------------EVALUACION NEONATAL-----------------------//
        $('#txtGlasgow').val(EvaNeo.glasgow);

        $('#txtTiempoEnfermedad').val(EvaNeo.tiempoEnfermedad);
        $('#txtInicioEnfermedad').val(EvaNeo.inicio);
        $('#txtCursoEnfermedad').val(EvaNeo.curso);

        $('#chkDificultadRespiratoria').prop('checked', EvaNeo.dificultadRespiratoria);
        $('#chkDiarrea').prop('checked', EvaNeo.diarrea);
        $('#chkDistensionAbdominal').prop('checked', EvaNeo.distensionAbdominal);
        $('#chkCianosis').prop('checked', EvaNeo.cianosis);
        $('#chkMalOlorOmbligo').prop('checked', EvaNeo.malOlorOmbligo);
        $('#chkIctericia').prop('checked', EvaNeo.ictericia);
        $('#chkDolor').prop('checked', EvaNeo.dolor);
        $('#chkConvulsiones').prop('checked', EvaNeo.convulsiones);
        $('#chkFiebre').prop('checked', EvaNeo.fiebre);
        $('#chkVomitos').prop('checked', EvaNeo.vomitos);
        $('#chkHemorragia').prop('checked', EvaNeo.hemorragia);
        $('#chkOtros').prop('checked', EvaNeo.otros);
        if (EvaNeo.otros) {
            $('#txtOtroSintomas').val(EvaNeo.otrosSintomas);
            $("#txtOtroSintomas").show();
        } else {
            $("#txtOtroSintomas").val("");
            $("#txtOtroSintomas").hide();
        }

        $('#txtRelato').val(EvaNeo.relato);
        $('#txtAntecedentesGenerales').val(EvaNeo.antecedentes);

        //--------------------EXAMEN FISICO----------------------------//
        $(".rdbGeneral").eq(ExaFisNeo.estadoGeneralSensorio - 1).prop('checked', true);
        $('#txtEstadoGeneralSensorio').val(ExaFisNeo.dEstadoGeneralSensorio);
        $('#txtEstadoGeneralSensorioEdemas').val(ExaFisNeo.eEstadoGeneralSensorio);
        $(".rdbPiel").eq(ExaFisNeo.piel - 1).prop('checked', true);
        $('#txtPiel').val(ExaFisNeo.dPiel);
        $(".rdbCraneo").eq(ExaFisNeo.craneo - 1).prop('checked', true);
        $('#txtCraneo').val(ExaFisNeo.dCraneo);
        $(".rdbPabAuri").eq(ExaFisNeo.pabellonAuricular - 1).prop('checked', true);
        $('#txtPabellonAuricular').val(ExaFisNeo.dPabellonAuricular)
        $(".rdbCara").eq(ExaFisNeo.cara - 1).prop('checked', true);
        $('#txtCara').val(ExaFisNeo.dCara);
        $(".rdbBocaRL").eq(ExaFisNeo.bocaORL - 1).prop('checked', true);
        $('#txtBocaORL').val(ExaFisNeo.dBocaORL);
        $(".rdbCuello").eq(ExaFisNeo.cuello - 1).prop('checked', true);
        $('#txtCuello').val(ExaFisNeo.dCuello);
        $(".rdbClavicula").eq(ExaFisNeo.clavicula - 1).prop('checked', true);
        $('#txtClavicula').val(ExaFisNeo.dClavicula);
        $(".rdbToraxSilv").eq(ExaFisNeo.toraxSilv - 1).prop('checked', true);
        $('#txtToraxSilv').val(ExaFisNeo.dToraxSilv);
        $(".rdbCardio").eq(ExaFisNeo.aparatoCardioVascular - 1).prop('checked', true);
        $('#txtAparatoCardioVascular').val(ExaFisNeo.dAparatoCardioVascular);
        $('#txtAparatoCardioVascularReflejos').val(ExaFisNeo.rAparatoCardioVascular);
        $(".rdbAbdomen").eq(ExaFisNeo.abdomen - 1).prop('checked', true);
        $('#txtAbdomen').val(ExaFisNeo.dAbdomen);
        $(".rdbOmbligo").eq(ExaFisNeo.ombligo - 1).prop('checked', true);
        $('#txtOmbligo').val(ExaFisNeo.dOmbligo);
        $(".rdbAno").eq(ExaFisNeo.ano - 1).prop('checked', true);
        $('#txtAno').val(ExaFisNeo.dAno);
        $(".rdbGenitales").eq(ExaFisNeo.genitales - 1).prop('checked', true);
        $('#txtGenitales').val(ExaFisNeo.dGenitales);
        $(".rdbExtSup").eq(ExaFisNeo.extSuperiores - 1).prop('checked', true);
        $('#txtExtSuperiores').val(ExaFisNeo.dExtSuperiores);
        $(".rdbExtInf").eq(ExaFisNeo.extInferiores - 1).prop('checked', true);
        $('#txtExtInferiores').val(ExaFisNeo.dExtInferiores);
        $(".rdbColumna").eq(ExaFisNeo.columna - 1).prop('checked', true);
        $('#txtColumna').val(ExaFisNeo.dColumna);
        $(".rdbSistemaNervioso").eq(ExaFisNeo.sistemaNervioso - 1).prop('checked', true);
        $('#txtSistemaNervioso').val(ExaFisNeo.dSistemaNervioso);

        /*----------------------------ANTECEDENTES----------------------------------------*/
        if (EvaAnte.lsAntecedentesPerinatales.table.length > 0) {
            $(".rdbEmbarazo").eq(EvaAnte.lsAntecedentesPerinatales.table[0].tipoEmbarazo - 1).prop('checked', true);
            $("#txtPatGest").val(EvaAnte.lsAntecedentesPerinatales.table[0].patologias);
            $("#txtNroEmbarazo").val(EvaAnte.lsAntecedentesPerinatales.table[0].nroEmbarazo);
            $(".rdbAtPreNatal").eq(EvaAnte.lsAntecedentesPerinatales.table[0].atencionPrenatal - 1).prop('checked', true);
            $("#txtNroAPN").val(EvaAnte.lsAntecedentesPerinatales.table[0].nroApn);
            $("#txtLugarAPN").val(EvaAnte.lsAntecedentesPerinatales.table[0].lugarApn);
            $(".rdbParto").eq(EvaAnte.lsAntecedentesPerinatales.table[0].tipoParto - 1).prop('checked', true);
            $("#txtComplicaciones").val(EvaAnte.lsAntecedentesPerinatales.table[0].complicacionParto);
            $("#cboLugarParto").val(EvaAnte.lsAntecedentesPerinatales.table[0].lugarParto);
            $("#cboAtendidoPor").val(EvaAnte.lsAntecedentesPerinatales.table[0].atendidoPor);
            $("#txtNombreAtendio").val(EvaAnte.lsAntecedentesPerinatales.table[0].atendidoPorotro);
        }

        $("#txtFecNac").val(objrowTb.fechaNacimiento);
        $("#txtHoraNac").val(objrowTb.horaNacimiento);
        $("#cboSexo").val(objrowTb.idTipoSexo);
        $("#txtNroHijo").val(objrowTb.nroOrdenHijo);

        if (EvaAnte.lsAntecedentesNacimiento.table.length > 0) {
            $("#txtEdadGestacional").val(EvaAnte.lsAntecedentesNacimiento.table[0].estaGestacionalAlNacer);
            $("#txtPesoRn").val(EvaAnte.lsAntecedentesNacimiento.table[0].pesoAlNacer);
            $("#txtTallaRn").val(EvaAnte.lsAntecedentesNacimiento.table[0].tallaAlNacer);
            $("#txtPerCefalico").val(EvaAnte.lsAntecedentesNacimiento.table[0].perimetroCefalico);
            $("#txtPerToracico").val(EvaAnte.lsAntecedentesNacimiento.table[0].perimetroToracico);
            $(".rdbInmediato").eq(EvaAnte.lsAntecedentesNacimiento.table[0].inmedito - 1).prop('checked', true);
            $("#txtMinuto").val(EvaAnte.lsAntecedentesNacimiento.table[0].apgar1min);
            $("#txt5Minuto").val(EvaAnte.lsAntecedentesNacimiento.table[0].apgar5min);
            $(".rdbReanimacion").eq(EvaAnte.lsAntecedentesNacimiento.table[0].reanimacion - 1).prop('checked', true);
            $(".rdbPatNeo").eq(EvaAnte.lsAntecedentesNacimiento.table[0].patologiaNeonatal - 1).prop('checked', true);
            $("#txtEspecificar").val(EvaAnte.lsAntecedentesNacimiento.table[0].patologiaNeonatalDescripcion);
            $(".rdbHosp").eq(EvaAnte.lsAntecedentesNacimiento.table[0].hospitalizacion - 1).prop('checked', true);
            $("#txtTiempoHosp").val(EvaAnte.lsAntecedentesNacimiento.table[0].tiempoHospitalizado);
        }


        $('.chzn-select').chosen().trigger("chosen:updated");
        //console.log(EvaNeo);
        //console.log(EvaDetneo);
        //console.log(ExaFisNeo);
    },

    CargarDatosEvaluacionDetalle(idAtencion, nroEvaluacion, pos) {
        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");
        $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");

        $("#BadgeEvaluacion .msc-hotline").removeClass("bg-green");
        $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-success");
        if (nroEvaluacion > 0) {
            $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
            $("#lblTipoEvaluacion").html("Evaluación Registrada");
            var EvaDetneo = EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
            //console.log(EvaDetneo);
            var evaluacion = EvaDetneo.find(evaluacion => evaluacion.idNumero === nroEvaluacion);
            //console.log(evaluacion);
            if (evaluacion.idUsuario == AdmisionEmergencia.ObtenerIdUsuarioSesion() && opcionModificar == true) {
                $(".OpcionesCPT").show();
                $(".OpcionesOrdenes").show();
                $(".OpcionesDiagnosticos").show();
                $("#FirmarEvalNeo").show();
                $("#evaluaciones .entrada").removeAttr("disabled");
                $("#btnGuardarEvaNeo").show();

                //////////VALIDAR SI DOCUMENTO ESTA FIRMADO////////////////
                if (evaluacion.statusFirma == 1) {
                    $("#FirmarEvalNeo").hide();
                } else {
                    $("#FirmarEvalNeo").show();
                }
                ///////////////////////////////////////////
            }
            
            asigna_FechaHoraAtencion(evaluacion.fecha);
            //$('#FechaInicioAtencion').val(FormatearFecha(evaluacion.fecha));
            $('#HoraInicioAtencion').val(evaluacion.horaInicioAtencion);
            $('#txtImpresionDiagnosticaNeo').val(evaluacion.indicaciones);
            $('#txtTratamientoNeo').val(evaluacion.tratamiento);
            $('#txtPlanTrabajoNeo').val(evaluacion.plandeTrabajo);

            EvaluacionNeonatal.SeleccionarDiagnosticosEvaluacion(evaluacion.idAtencion, evaluacion.idServicio, evaluacion.idNumero);
            AdmisionEmergencia.limpiarRecetas();
            Ordenes.ubicaFarmacia(8);
            Ordenes.limpiarCatalogoV2();
            //Ordenes.listaRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
            //Ordenes.listaCabeceraRecetasByIdCuentaPorNroEvaluacion($("#txtNroCuenta").val(), $("#hdIdTipoFuenteFian").val(), nroEvaluacion, evaluacion.idServicio, evaluacion.idMedico)
            Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion($("#txtNroCuenta").val(), $("#hdIdTipoFuenteFian").val(), nroEvaluacion, evaluacion.idServicio, evaluacion.idMedico)

            $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
            $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

            $('#tblEvaluacionesEmergencia tbody').find('tr').eq(pos).addClass("selected");

            $('#hdNroEvaluacion').val(nroEvaluacion);

            $("#evaluaciones-tab").click();
        } else {
            $("#btnGuardarEvaNeo").show();
            $("#lblTipoEvaluacion").html("Ninguna Evaluación Registrada");
        }
    },
    //////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////AGREGAR NUEVA EVALUACIÓN/////////////////////////////
    //HabilitarNuevaEvaluacion() {
    //    Cargando(1);
    //    var eval = oTable_EvaEmer.DataTable().data().count();
    //    Diagnosticos.LimpiarDiagnosticosAtencion();

    //    Ordenes.ubicaFarmacia(8);    //farmacia por defecto: Farmacia de Emergencias
    //    Ordenes.limpiarCatalogoV2();
    //    //console.log("MEDICOOO: " + Ordenes.ObtenerIdMedicoSesion());
    //    //Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());
    //    asigna_FechaHoraAtencion(null);

    //    $("#lblNumeroEvaluacion").html("");
    //    $("#lblTipoEvaluacion").html("");
    //    $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");

    //    $("#CardEvaNeo").removeClass("bg-blue");
    //    $("#BadgeEvaluacion .msc-hotline").removeClass("bg-blue");
    //    $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-info");

    //    $("#CardEvaNeo").addClass("bg-blue");
    //    //$("#BadgeEvaluacion .msc-hotline").addClass("bg-green");
    //    $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
    //    $("#CardEvaNeo").addClass("bg-blue");

    //    $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
    //    $("#lblTipoEvaluacion").html("Nueva Evaluación");

    //    $('#txtImpresionDiagnosticaNeo').val("");
    //    $('#txtTratamientoNeo').val("");
    //    $('#txtPlanTrabajoNeo').val("");

    //    $("#evaluaciones-tab").click();
    //    $("#diagnosticos-tab-link").click();

    //    $("#evaluaciones .entrada").removeAttr("disabled");
    //    $(".OpcionesCPT").show();
    //    $(".OpcionesOrdenes").show();
    //    $(".OpcionesDiagnosticos").show();
    //    $("#FirmarEvalNeo").show();
    //    $("#btnGuardarEvaNeo").show();

    //    swal({
    //        title: 'Evaluaciones',
    //        text: "Paciente iniciará la evaluación N° " + (eval + 1),
    //        type: 'info',
    //    }).done();

    //    nuevaEvalNeo = true;
    //    modificaEvalNeo = false;
    //    //console.log("Entro Habilitar Evaluaciones");
    //    //console.log("Evaluacion Nueva N° " + (eval+1));
    //    Cargando(0);
    //},
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////VALIDAR VARIABLES/////////////////////////////
    ValidarVariablesEvaluacionNeonatal() {
        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese la Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (ListDiagnosticos.toArray().length == 0 && nuevaEvalNeo == true) {
            alerta('2', 'Ingresa un diagnóstico');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        return true;
    },

    ValidarInformeFirmado() {
        var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();

        if (objrowTb.statusFirma == 1) {
            $("#FirmarEvalNeo").hide();
        } else {
            $("#FirmarEvalNeo").show();
        }
    },
    //////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////CARGA VARIABLES////////////////////////////////////
    CargarVariablesEvaluacionNeonatal() {
        var formData = new FormData();

        formData.append('IdAtencion', $('#txtNroAtencion').val());

        formData.append('Prioridad', $('#cboPrioridad').val());
        formData.append('Glasgow', $('#txtGlasgow').val());

        ///////////////////////ENFERMEDAD ACTUAL//////////////////////////
        formData.append('TiempoEnfermedad', $('#txtTiempoEnfermedad').val());
        formData.append('InicioEnfermedad', $('#txtInicioEnfermedad').val());
        formData.append('CursoEnfermedad', $('#txtCursoEnfermedad').val());

        //////////////////////SIGNOS Y SINTOMAS////////////////////////////////
        formData.append('DificultadRespiratoria', $('#chkDificultadRespiratoria').is(":checked"));
        formData.append('Diarrea', $('#chkDiarrea').is(":checked"));
        formData.append('DistensionAbdominal', $('#chkDistensionAbdominal').is(":checked"));
        formData.append('Cianosis', $('#chkCianosis').is(":checked"));
        formData.append('MalOlorOmbligo', $('#chkMalOlorOmbligo').is(":checked"));
        formData.append('Ictericia', $('#chkIctericia').is(":checked"));
        formData.append('Dolor', $('#chkDolor').is(":checked"));
        formData.append('Convulsiones', $('#chkConvulsiones').is(":checked"));
        formData.append('Fiebre', $('#chkFiebre').is(":checked"));
        formData.append('Vomitos', $('#chkVomitos').is(":checked"));
        formData.append('Hemorragia', $('#chkHemorragia').is(":checked"));
        formData.append('Otros', $('#chkOtros').is(":checked"));
        formData.append('OtrosSintomas', $('#txtOtroSintomas').val());

        //////////////////////////////RELATO/////////////////////////////////////////
        formData.append('Relato', $('#txtRelato').val());

        ////////////////////////////ANTECEDENTES GENERALES//////////////////////////
        formData.append('AtecedentesGenerales', $('#txtAntecedentesGenerales').val());

        return formData;
    },

    CargarVariablesExamenFisicoNeonatal() {
        var formData = new FormData();

        /////////////////////////EXAMEN FISICO//////////////////////////////
        formData.append('IdAtencion', $('#txtNroAtencion').val());
        formData.append('NroEvaluacion', 1);

        formData.append('EstadoGeneralSensorio', $(".rdbGeneral").index($(".rdbGeneral:checked")) + 1);
        formData.append('DEstadoGeneralSensorio', $('#txtEstadoGeneralSensorio').val());
        formData.append('EEstadoGeneralSensorio', $('#txtEstadoGeneralSensorioEdemas').val());

        formData.append('Piel', $(".rdbPiel").index($(".rdbPiel:checked")) + 1);
        formData.append('DPiel', $('#txtPiel').val());

        formData.append('Craneo', $(".rdbCraneo").index($(".rdbCraneo:checked")) + 1);
        formData.append('DCraneo', $('#txtCraneo').val());

        formData.append('PabellonAuricular', $(".rdbPabAuri").index($(".rdbPabAuri:checked")) + 1);
        formData.append('DPabellonAuricular', $('#txtPabellonAuricular').val());

        formData.append('Cara', $(".rdbCara").index($(".rdbCara:checked")) + 1);
        formData.append('DCara', $('#txtCara').val());

        formData.append('BocaORL', $(".rdbBocaRL").index($(".rdbBocaRL:checked")) + 1);
        formData.append('DBocaORL', $('#txtBocaORL').val());

        formData.append('Cuello', $(".rdbCuello").index($(".rdbCuello:checked")) + 1);
        formData.append('DCuello', $('#txtCuello').val());

        formData.append('Clavicula', $(".rdbClavicula").index($(".rdbClavicula:checked")) + 1);
        formData.append('DClavicula', $('#txtClavicula').val());

        formData.append('ToraxSilv', $(".rdbToraxSilv").index($(".rdbToraxSilv:checked")) + 1);
        formData.append('DToraxSilv', $('#txtToraxSilv').val());

        formData.append('AparatoCardioVascular', $(".rdbCardio").index($(".rdbCardio:checked")) + 1);
        formData.append('DAparatoCardioVascular', $('#txtAparatoCardioVascular').val());
        formData.append('RAparatoCardioVascular', $('#txtAparatoCardioVascularReflejos').val());

        formData.append('Abdomen', $(".rdbAbdomen").index($(".rdbAbdomen:checked")) + 1);
        formData.append('DAbdomen', $('#txtAbdomen').val());

        formData.append('Ombligo', $(".rdbOmbligo").index($(".rdbOmbligo:checked")) + 1);
        formData.append('DOmbligo', $('#txtOmbligo').val());

        formData.append('Ano', $(".rdbAno").index($(".rdbAno:checked")) + 1);
        formData.append('DAno', $('#txtAno').val());

        formData.append('Genitales', $(".rdbGenitales").index($(".rdbGenitales:checked")) + 1);
        formData.append('DGenitales', $('#txtGenitales').val());

        formData.append('ExtSuperiores', $(".rdbExtSup").index($(".rdbExtSup:checked")) + 1);
        formData.append('DExtSuperiores', $('#txtExtSuperiores').val());

        formData.append('ExtInferiores', $(".rdbExtInf").index($(".rdbExtInf:checked")) + 1);
        formData.append('DExtInferiores', $('#txtExtInferiores').val());

        formData.append('Columna', $(".rdbColumna").index($(".rdbColumna:checked")) + 1);
        formData.append('DColumna', $('#txtColumna').val());

        formData.append('SistemaNervioso', $(".rdbSistemaNervioso").index($(".rdbSistemaNervioso:checked")) + 1);
        formData.append('DSistemaNervioso', $('#txtSistemaNervioso').val());

        return formData;
    },

    CargarVariablesAntecedentes() {
        var formData = new FormData
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        /////////////////////////ANTECEDENTES PERINATALES//////////////////////////////
        formData.append("tipoEmbarazo", $(".rdbEmbarazo").index($(".rdbEmbarazo:checked")) + 1);
        formData.append("patologias", $("#txtPatGest").val());
        formData.append("nroEmbarazo", $("#txtNroEmbarazo").val());
        formData.append("atencionPrenatal", $(".rdbAtPreNatal").index($(".rdbAtPreNatal:checked")) + 1);
        formData.append("nroApn", $("#txtNroAPN").val());
        formData.append("lugarApn", $("#txtLugarAPN").val());
        formData.append("tipoParto", $(".rdbParto").index($(".rdbParto:checked")) + 1);
        formData.append("complicacionParto", $("#txtComplicaciones").val());
        formData.append("lugarParto", $("#cboLugarParto").val());
        formData.append("atendidoPor", $("#cboAtendidoPor").val());
        formData.append("atendidoPorotro", $("#txtNombreAtendio").val());

        /////////////////////////ANTECEDENTES NACIMIENTO//////////////////////////////
        formData.append("estaGestacionalAlNacer", $("#txtEdadGestacional").val());
        formData.append("pesoAlNacer", $("#txtPesoRn").val());
        formData.append("tallaAlNacer", $("#txtTallaRn").val());
        formData.append("perimetroCefalico", $("#txtPerCefalico").val());
        formData.append("perimetroToracico", $("#txtPerToracico").val());

        formData.append("inmedito", $(".rdbInmediato").index($(".rdbInmediato:checked")) + 1);
        formData.append("apgar1min", $("#txtMinuto").val());
        formData.append("apgar5min", $("#txt5Minuto").val());
        formData.append("reanimacion", $(".rdbReanimacion").index($(".rdbReanimacion:checked")) + 1);
        formData.append("patologiaNeonatal", $(".rdbPatNeo").index($(".rdbPatNeo:checked")) + 1);
        formData.append("patologiaNeonatalDescripcion", $("#txtEspecificar").val());
        formData.append("hospitalizacion", $(".rdbHosp").index($(".rdbHosp:checked")) + 1);
        formData.append("tiempoHospitalizado", $("#txtTiempoHosp").val());

        formData.append("idPaciente", objrowTb.idPaciente);
        formData.append("idAtencion", $('#txtNroAtencion').val());

        return formData;
    },

    CargarVariablesEvaluacionNeonatalDetalle() {
        var formData = new FormData();
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaEmer.api(true).row('.selected').data();

        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        //var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
        //var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
        //var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
        //var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
        //var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
        //var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
        //var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
        var nroEval = isEmpty(objrowTb2) ? (oTable_EvaEmer.DataTable().data().count() + 1) : objrowTb2.idNumero;

        formData.append('IdAtencion', $('#txtNroAtencion').val());
        formData.append('NroEvaluacion', nroEval);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('FechaInicioAtencion', $('#FechaInicioAtencion').val());
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        formData.append('ImpresionDiagnostica', $('#txtImpresionDiagnosticaNeo').val());
        formData.append('Tratamiento', $('#txtTratamientoNeo').val());
        formData.append('PlanTrabajo', $('#txtPlanTrabajoNeo').val());

        formData.append('idCuentaAtencion', $("#txtNroCuenta").val());
        formData.append("idServicio", objrowTb.idServicioEgreso);
        formData.append("idMedico", $("#cboMedicoReceta").val());

        $('#hdNroEvaluacion').val(nroEval);

        //Diagnosticos
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));

        ////PatogClinica
        //formData.append('lstRecetaPatalogiaClinica', ListaRecetaDetallePatalogiaClinica);
        //formData.append('idRecetaPatoClinica', $('#hdIdRecetaPatoClinica').val());
        ////AnatoPatologica
        //formData.append('lstRecetaAnatoPatologica', ListaRecetaDetalleAnatoPatologica);
        //formData.append('idRecetaAnaPatologica', $('#hdIdRecetaAnaPatologica').val());
        ////BancoSangre
        //formData.append('lstRecetaBancoSangre', ListaRecetaDetalleBancoSangre);
        //formData.append('idRecetaBancoSangre', $('#hdIdRecetabancoSangre').val());
        ////EcoObstetrica
        //formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
        //formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());
        ////EcoGeneral
        //formData.append('lstRecetaEcoGeneral', ListaRecetaDetalleEcoGeneral);
        //formData.append('idRecetaEcoGene', $('#hdIdRecetaEcoGene').val());
        ////Rayos X
        //formData.append('lstRecetaRx', ListaRecetaDetalleRx);
        //formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
        ////Farmacia
        //formData.append('lstRecetaFarmacia', ListaRecetaDetalleFarmacia);
        //formData.append('idRecetaFarmacia', $('#hdIdRecetaFarmacia').val());
        //formData.append('fechaVigencia', $('#txtFechaVigencia').val());



        return formData;
    },

    CargarFormEvaluacionNeonatal() {

    },

    CargarFormEvaluacionNeonatalDetalle() {

    },

    SeleccionarEvaluacionNeonatal(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataEvaluacion = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarEvaluacionNeonatal?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataEvaluacion = datos.respuesta.table[0];
                    }
                    else {
                        dataEvaluacion = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataEvaluacion);
        return dataEvaluacion;
    },

    SeleccionarEvaluacionDetalleNeonatal(idAtencion) {
        Cargando(1);
        oTable_EvaEmer.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataEvaluacionDetalle = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarEvaluacionDetalleNeonatal?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataEvaluacionDetalle = datos.respuesta.table;
                        oTable_EvaEmer.fnAddData(dataEvaluacionDetalle);
                    }
                    else {
                        dataEvaluacionDetalle = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataEvaluacionDetalle;
    },

    SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, nroEvaluacion) {
        Cargando(1);
        oTable_EvaEmer.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idAtencion', idAtencion);
        var dataEvaluacionDetalle = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarEvaluacionDetalleNeonatal?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataEvaluacionDetalle = datos.respuesta.table;
                        oTable_EvaEmer.fnAddData(dataEvaluacionDetalle);
                    }
                    else {
                        dataEvaluacionDetalle = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataEvaluacionDetalle;
    },

    SeleccionarExamenFisicoNeonatal(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataExamenFisico = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarExamenFisicoNeonatal?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataExamenFisico = datos.respuesta.table[0];
                    }
                    else {
                        dataExamenFisico = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataExamenFisico;
    },

    SeleccionarAntecedentes(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataAntecedentes = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarRnAntecedentes?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    /*if (datos.respuesta.lsAntecedentesPerinatales.length > 0 || datos.respuesta.lsAntecedentesNacimiento.length > 0) {
                        dataAntecedentes = datos.respuesta;
                    }
                    else {
                        dataAntecedentes = [];
                    }*/
                    dataAntecedentes = datos;
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataAntecedentes);
        return dataAntecedentes;
    },

    SeleccionarDiagnosticosEvaluacion(idAtencion, idServicio, nroEvaluacion) {

        Diagnosticos.LimpiarDiagnosticosAtencion();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        midata.append('nroEvaluacion', nroEvaluacion);

        $.ajax({

            method: "POST",
            url: "/AdmisionEmergencia/AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {
                        Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                    }
                }
                else {
                    Cargando(0)
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ///////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    async GenerarHojaAtencion(idCuenta, idAtencion, idServicio, eval) {
        const data1 = await EvaluacionNeonatal.GenerarHojaEvaluacion(idCuenta, idAtencion, idServicio, eval);
        /*var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        if (EvaluacionNeonatal.ValidarVariablesEvaluacionNeonatal()) {
            Cargando(1);
            //Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
            const data1 = await EvaluacionNeonatal.GuardarEvaluacionNeonatal();
            const data2 = await EvaluacionNeonatal.GuardarAntecedentes();
            const data3 = await EvaluacionNeonatal.GuardarExamenNeonatal();
            if (nuevaEvalNeo == true || modificaEvalNeo == true) {
                const data4 = await EvaluacionNeonatal.GuardarEvaluacionDetalleNeonatal();
            }

            AdmisionEmergencia.ListarAtenciones();
            EvaluacionNeonatal.CerrarModuloNeonatal();
            Cargando(0);
        }*/
    },
    //////////////////////////////GUARDA DATA//////////////////////////////////////////
    async GuardarEvaluacion() {
        var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        var eval = oTable_EvaEmer.DataTable().data().count();

        if (eval == 0 && nuevaEvalNeo == false) {
            alerta(2, "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
        } else {
            if (EvaluacionNeonatal.ValidarVariablesEvaluacionNeonatal()) {
                Cargando(1);
                Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
                const data1 = await EvaluacionNeonatal.GuardarEvaluacionNeonatal();
                const data2 = await EvaluacionNeonatal.GuardarAntecedentes();
                const data3 = await EvaluacionNeonatal.GuardarExamenNeonatal();
                if (nuevaEvalNeo == true || modificaEvalNeo == true) {
                    if (data1 == true && data2 == true && data3 == true) {
                        const data4 = await EvaluacionNeonatal.GuardarEvaluacionDetalleNeonatal();
                        //console.log(data4);
                        if (data4 == true) {
                            //console.log("GENERAR RECETAS");
                            const datarec = await Ordenes.GuardarOrdenesMedicas();
                            console.log(datarec);
                        }
                    }                    
                }

                //AdmisionEmergencia.limpiarRecetas()
                EvaluacionNeonatal.LimpiarModuloNeonatal();
                AdmisionEmergencia.CerrarModulo();
                ReposicionarVista();
                MostrarAreaLista();
                AdmisionEmergencia.ListarAtenciones();

                //AdmisionEmergencia.ListarAtenciones();
                //EvaluacionNeonatal.CerrarModuloNeonatal();
                Cargando(0);
            }
        }        
    },

    async GuardarEvaluacionNeonatal() {
        //Cargando(1);
        //console.log("GuardarEvaluacionNeonatal");
        var data = EvaluacionNeonatal.CargarVariablesEvaluacionNeonatal();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarEvaluacion?area=Emergencia",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    alerta(1, 'La evaluación se guardó correctamente.');
                    //if (datos.respuesta.table.length > 0) {
                    //    respuesta = datos.respuesta.table[0];
                    //    if (respuesta.mensaje == "Exito") {
                            
                    //    } else {
                    //        Cargando(0);
                    //        alerta(2, respuesta.mensaje);
                    //    }
                    //}
                    //else {
                    //    Cargando(0);
                    //    respuesta = {};
                    //}
                } else {
                    alerta(2, datos.msj)
                    Cargando(0)
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarAntecedentes() {
        //Cargando(1);
        //console.log("GuardarAntecedentes");
        var data = EvaluacionNeonatal.CargarVariablesAntecedentes();
        var respuesta;
        var resp = false;
        let datos
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarRnAntecedentes?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                respuesta = datos.respuesta;
                if (datos.estado) {
                    resp = true;
                    alerta(1, 'Los antecedentes perinatales y nacimiento se guardó correctamente.');
                } else {
                    alerta(2, datos.msj);
                    Cargando(0);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }

        } catch (error) {
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarExamenNeonatal() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatal.CargarVariablesExamenFisicoNeonatal();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarExamenNeonatal?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    alerta(1, 'El examen físico se guardó correctamente.')
                    //if (datos.respuesta.table.length > 0) {
                    //    respuesta = datos.respuesta.table[0];

                    //    //if (respuesta.mensaje == "Exito") {
                    //    //    alerta(1, 'El examen físico se guardó correctamente.');
                    //    //    //console.log("VARIABLEEEE: " + nuevaEvalNeo);                        
                    //    //    //EvaluacionNeonatal.CerrarModuloNeonatal();
                    //    //} else {
                    //    //    Cargando(0);
                    //    //    alerta(2, datos.msj);
                    //    //}
                    //    //console.log(respuesta);
                    //}
                    //else {
                    //    Cargando(0);
                    //    respuesta = {};
                    //}
                } else {
                    Cargando(0);
                    alerta(2, datos.msj);
                }
                
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarEvaluacionDetalleNeonatal() {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = EvaluacionNeonatal.CargarVariablesEvaluacionNeonatalDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarEvaluacionDetalle?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    idCuentaAtt = $('#txtNroCuenta').val();

                    resp = true;
                    alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                    //if (datos.respuesta.table.length > 0) {
                    //    respuesta = datos.respuesta.table[0];

                    //    //$('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion)
                    //    //$("#modalNotaIngreso").modal("hide");                            
                    //    idCuentaAtt = $('#txtNroCuenta').val();
                        
                    //    resp = true;
                    //    alerta(1, 'Los detalles de la evaluación se guardó correctamente.');

                    //    //if (respuesta.mensaje == "Exito") {

                            

                    //    //    //alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                    //    //    //AdmisionEmergencia.ListarAtenciones();
                    //    //    //EvaluacionNeonatal.CerrarModuloNeonatal();
                    //    //} else {
                    //    //    alerta(2, respuesta.msj);
                    //    //}
                    //    //console.log(respuesta);
                    //}
                    //else {
                    //    alerta('2', datos.msj);
                    //}
                    Cargando(0)
                } else {
                    alerta(2, datos.msj);
                    EvaluacionNeonatal.CerrarModuloNeonatal();
                    Cargando(0)
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

        ////////////////////////////////////////////////////////////
        //console.log(data);

    },

    //COMENTADO POR KHOYOSI
    //async GenerarHojaEvaluacion(idCuenta, idAtencion, idServicio, eval) {
    //    Cargando(1);
    //    var formData = new FormData
    //    var respuesta;
    //    let datos
    //    try {
    //        formData.append('idCuenta', idCuenta);
    //        formData.append('idAtencion', idAtencion);
    //        formData.append('idServicio', idServicio);
    //        formData.append('eval', eval);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/EvaluacionNeonatal/GenerarHojaEvaluacion?area=Emergencia",
    //                //contentType: "application/json; charset=utf-8",
    //                data: formData,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        if (datos) {
    //            var EvaDetneo = EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
    //            alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
    //        } else {
    //            alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
    //        }
    //    } catch (error) {
    //        //console.error(error)
    //        alerta(3, error);
    //    }

    //    return datos;
    //},

    ///////////////////////////////////////////////////////////////////////////////////


    ////////////////////OPCIONES MODAL///////////////////////////////
    AbrirModalNeonatal() {
        $('#modalEvaluacionNeonatal').modal('show');
    },

    CerrarModuloNeonatal() {
        EvaluacionNeonatal.LimpiarModuloNeonatal();
        $('#modalEvaluacionNeonatal').modal('hide');
    },

    LimpiarModuloNeonatal() {
        $("#TabPanelRegistro input[type=text]").val("");
        $("#TabPanelRegistro textarea").val("");
        $("#TabPanelRegistro input[type=checkbox]").prop('checked', false);
        $("#TabPanelRegistro #examenFisico input[type=radio].default").prop('checked', true);
        $("#TabPanelRegistro #antecedentesGenerales input[type=radio]").prop('checked', false);
        $("#modalEvaluacionNeonatal #antecedentesGenerales .chzn-select").val("");

        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");

        $("#PacienteHeaderModal").html("");
        $("#HistoriaHeaderModal").html("");
        $("#CuentaHeaderModal").html("");

        //$('#hdIdCuentaAtencion').val('');
        //$('#hdIdServicioPaciente').val('');

        $("#txtOtroSintomas").hide();

        $('.chzn-select').chosen().trigger("chosen:updated");
        nuevaEvalNeo = false;
        modificaEvalNeo = false;

        idPacienteGlobal = 0;

        asigna_FechaHoraAtencion(null);
    },

    BloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").removeAttr("disabled");
        $("#TabPanelRegistro .campo textarea").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=checkbox]").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=radio]").removeAttr("disabled");
        $("#TabPanelRegistro .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    /////////////////////////////////////////////////////////////////////////////////////////



    
    /// <summary>
    /// INICIAR SCRIPT Y MODULO
    /// </summary>
    /// Lista de metodos que incian la carga del módulo 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async IniciarModulo() {
        await EvaluacionNeonatal.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionNeonatal.cargaInicial();
        //EvaluacionNeonatal.initDatables();
        EvaluacionNeonatal.IniciarDataTablesEvaluacion();
        EvaluacionNeonatal.Eventos();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}


//$(document).ready(function () {
//    EvaluacionNeonatal.cargaInicial();
//    EvaluacionNeonatal.initDatables();
//    EvaluacionNeonatal.Eventos();

//});

