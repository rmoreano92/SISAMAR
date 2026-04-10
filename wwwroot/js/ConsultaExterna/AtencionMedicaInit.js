let AtencionMedicaInit = {
    permisoFua: "",
    permisoFirma4Identity: "",
    permisoClasiPaciente: "",

    oTable_atenciones: null,

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            //            "scrollX": true,
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFechaAtencion').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        //$('#txtFechaAtencion').val();

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        //$("tagMedicoProgramado").hide();
    },

    CargaInicial: async () => {
        
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencion').val(fechaP);

        AtencionMedicaInit.permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
        AtencionMedicaInit.permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY")

        AtencionMedicaInit.ListaServicios()
    },

    ListaServicios: () => {

        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencion').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                $('#cboConsultorio').empty();
                var servicios = datos.table
                console.log('servicios', servicios)
                $(servicios).each(function (i, obj) {
                    $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
                // JDELGADO001
                $("#cboConsultorio option").each(function () {
                    if ($('#idEmpleadotxt').val() == $(this).context.attributes.idempleado.nodeValue) {
                        //console.log("Tiene programacion")
                        $(`#cboConsultorio option[value='${$(this).context.attributes[5].nodeValue}']`).attr("selected", true);
                        $('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
                        return
                    } else {
                        //console.log("No tiene programacion")
                    }
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },
    ListaAtencionesCE: () => {

        Cargando(1)
        AtencionMedicaInit.oTable_atenciones.fnClearTable();
        //alert($('#cboConsultorio>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencion').val());
        midata.append('idServicio', $('#cboConsultorio').val());
        midata.append('prog', $('#cboConsultorio>option:selected').attr("prog"));
        $.ajax({ // JDELGADO J1 CAMBIOS EN AJAX
            method: "POST",
            url: "/Atencion/ListarAtencionesCE?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                if (datos.session) {
                    Cargando(0)
                    if (datos.lstAtenciones.table.length > 0) {
                        AtencionMedicaInit.oTable_atenciones.fnAddData(datos.lstAtenciones.table);
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    //Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaRecetasCabeceras: async () => {
        var formData = new FormData();
        let datos;
        let resp;

        //var objrow = oTable_atenciones.api(true).row('.selected').data();

        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //COEMNTADO POR KHOYOSI
            //if (datos.table.length == 0) {                
            //    $("#btnImprimeRecetas").prop('disabled', true);
            //    //$("#btnImprimeRecetas").html('No hay recetas por imprimir');
            //} else {                
            //    $("#btnImprimeRecetas").prop('disabled', false);
            //    //$("#btnImprimeRecetas").html('Rec. Médicas');
            //}
            resp = datos.table;
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    GuardarAtencion: async () => {
        let objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        fechaDiaValor = AtencionMedicaInit.fechaDia();
        valorFecha = AtencionMedicaInit.fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)

        if (valorFecha) {
            alerta('3', 'No se puede relizar una atencion antes de la fecha de la cita');
            return false;
        }
        // datos triaje
        if ($("#txtPeso").val() == "") {
            $("#txtPeso").focus();
            alerta('2', 'Ingrese peso de triaje');
            return false
        }

        if ($("#txtTalla").val() == "") {
            $("#txtTalla").focus();
            alerta('2', 'Ingrese talla de triaje');
            return false
        }

        //NINIO SANO INICIO
        if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
            if (AtencionMedicaInit.ValidaEntrevista($("#cboClasisifcacion").val()) == false) {
                $('.nav-tabs a[href="#entrevista"]').tab('show');
                return false;
            }

            if (AtencionMedicaInit.permisoClasiPaciente == 1) {
                if (isEmpty($("#cboClasisifcacion").val())) {
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                    alerta('2', 'Seleccione Clasificacion de Paciente');
                    $("#cboClasisifcacion").focus()
                    return false
                }
            }

        } else {
            // ESTO SOLO ES PARA PERINATAL
            if (objrow.usaModuloMaterno) {
                if ($("#chkCalculaFechaEco").is(':checked')) {
                    if ($("#txtFEcog").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('2', 'Ingrese fecha ecografica');
                        return false;
                    }

                }

                if ($("#chkMuestraEco").is(':checked')) {
                    if ($("#txtFEcog").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('3', 'Ingrese fecha ecografica');
                        return false;
                    }
                    if (!($("#chkCalculaFechaEco").is(':checked'))) {
                        alerta('2', 'Seleccione calcule con ecografía para realizar los calculos de semas y dias de gestación');
                        $("#chkCalculaFechaEco").focus();
                        return false;
                    }
                } else {
                    if ($("#txtFUM").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('2', 'Ingrese fecha de ultima regla');
                        $("#txtFUM").focus();
                        return false;
                    }
                }

                if ($("#txtSemanas").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese semanas de gestacion');
                    return false;
                }

                if ($("#txtDias").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese dias de gestacion');
                    return false;
                }

                if ($("#txtFPP").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese fecha probable de parto');
                    return false;
                }

                if ($('#txtGestasP').val() != "") {
                    if ($('#txtGestasP').val() >= 1) {
                        if ($("#txtFinEmb").val() == "") {
                            $('.nav-tabs a[href="#Perinatal"]').tab('show');
                            $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                            $('.nav-tabs a[href="#anteceObst"]').tab('show');
                            $("#txtFinEmb").focus();
                            alerta('2', 'Ingrese fin de embarazo anterior');
                            return false;
                        }

                        fechaEm = fechaCorrecta($("#txtFinEmb").val(), objrow.fechaIngreso2)

                        if (fechaEm) {
                            $('.nav-tabs a[href="#Perinatal"]').tab('show');
                            $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                            $('.nav-tabs a[href="#anteceObst"]').tab('show');
                            $("#txtFinEmb").focus();
                            alerta('3', 'La Fecha de fin de embarazo anterior no puede ser mayor a la fecha del control');
                            return false;
                        }
                    }
                }

                if ($("#txtPesoPregesta").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                    $('.nav-tabs a[href="#anteceObst"]').tab('show');
                    $("#txtPesoPregesta").focus();
                    alerta('2', 'Ingrese peso Pregestacional - kg ');

                    return false;
                }

                if ($('#cboTipoEmbrazo').val() == 2) {
                    if ($("#txtNroFetos").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        $('.nav-tabs a[href="#controlPer"]').tab('show');
                        $('.nav-tabs a[href="#dtosBasales"]').tab('show');
                        $("#txtNroFetos").focus();
                        alerta('2', 'Ingrese peso N° de fetos');

                        return false;
                    }
                }

                if ($('#txtMotivoConsultaPeri').val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('.nav-tabs a[href="#controlPer"]').tab('show');
                    $("#txtMotivoConsultaPeri").focus();
                    alerta('2', 'Ingrese motivo de consulta');
                    return false;
                }
            }
        }

        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var cantidadtDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        if (cantidadtDiagnosticos.count() == 0) {
            alerta('2', 'Ingrese Diagnosticos');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        if ($('#chkNuevo').prop('checked') === false) {
            alerta('2', 'Seleccione un Episodio');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $('#chkNuevo').focus();
            return false;
        }

        if (isEmpty($("#cboDestino").val())) {
            alerta('2', 'Seleccione Destino');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $("#cboDestino").focus()
            return false
        }
        //RQ0002 RMOREANOC
        if ($("#cboDestino").val() == 60) {

            if (isEmpty($("#txtProximaConsulta").val())) {
                alerta('2', 'Ingrese la fecha de su próxima cita.');
                $("#txtProximaConsulta").focus();
                return false;
            }

            if ($("#cboTipoConsulta").val() == -1) {
                alerta('2', 'Elegir el tipo de consulta.');
                $("#cboTipoConsulta").focus();
                return false;
            }

        }

        if (isEmpty($('#txtFechaVigencia').val())) {
            alerta('2', 'Ingrese fecha de vigencia');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $('.nav-tabs a[href="#farmacia"]').tab('show');
            $("#txtFechaVigencia").focus();

            return false;
        }
        //RQ0002 RMOREANOC

        /////////////KHYOOSI (verficia si se ha guardado la hoja de refcon)///////////////////// 
        const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
        if (permisoRefcon == '1') {
            if (estadoGuardadoRefCon == false) {
                alerta('2', 'No ha guardado los datos de Referencia o Contrareferencia.');
                return false;
            }
        }
////////////////////////////////////////

        if (objrow.idEstadoAtencion == 1) {
            var epiNuevo = 0
            var epiCierre = 0
            if ($('#chkNuevo').prop('checked') === true) {
                epiNuevo = 1
            }

            if ($('#chkCierre').prop('checked') === true) {
                epiCierre = 1
            }

            var formData = new FormData();

            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
            var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
            var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
            var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
            var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
            var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
            var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
            var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12) // jdelgado011

            //-----------------------------DATOS EXTERNOS
            formData.append('fechaIngreso', objrow.fechaIngreso);
            formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
            formData.append('antecedPatologico', $('#txtPatologicos').val());
            formData.append('antecedObstetrico', $('#txtObstetricos').val());
            formData.append('antecedAlergico', $('#txtAlergias').val());
            formData.append('antecedFamiliar', $('#txtFamiliares').val());
            formData.append('antecedentes', $('#txtOtros').val());

            if ($('#chkEsEvaluacionPreAnestesica').is(':checked')) { // para atención pre-anestésica
                Anestesiologia.GuardarAtencionAnestesiologia()
            }

            //NINIO SANO cambia motivo de consulta
            if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
                formData.append('CitaMotivo', $('#txtMotivoCons').val());
                formData.append('CitaExamenClinico', $('#txtExamenC').val());
            } else {
                if (objrow.usaModuloNinoSano) {
                    formData.append('CitaMotivo', $('#txtMotivoConsNinio').val());
                    formData.append('CitaExamenClinico', $('#txtExamenCNinio').val());
                    formData.append('enfermedadActual', $('#txtEnfermedadActual').val());
                    formData.append('tiempoEnfermedad', $('#txtTiempoEmfermedad').val());
                }
                if (objrow.usaModuloMaterno) {
                    formData.append('CitaMotivo', $('#txtMotivoConsultaPeri').val());
                }
            }

            // Fin NINIO SANO

            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());
            formData.append('CitaAntecedente', $('#txtAtencedentes').val());
            //--------------------------------------------------------------------
            formData.append('idEnEstablecimiento', $('#idEnEstablecimiento').val());
            formData.append('idEnServicio', $('#idEnServicio').val());

            formData.append('tipoClasificacion', $('#cboClasisifcacion').val());
            formData.append('nroHistoria', objrow.nroHistoriaClinica);
            formData.append('nroControles', $('#txtControles').val());
            formData.append('edadGestacional2', $('#txtEdadGestacional').val());
            formData.append('nroGestas', $('#txtGestas').val());

            formData.append('idMedico', objrow.idMedico);
            formData.append('idServicioIngreso', objrow.idServicioIngreso);
            formData.append('idCuentaAtencion', objrow.idCuentaAtencion);
            formData.append('nroEpisodio', $('#cboEpisodio').val());
            formData.append('idPaciente', $('#idPaciente').val());
            formData.append('epiNuevo', epiNuevo);
            formData.append('epiCierre', epiCierre);
            formData.append('idAtencion', $('#idAtencion').val());

            //DATOS DE LA ATENCION CE

            formData.append('idDestino', $('#cboDestino').val());
            formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
            formData.append('lstRecetaRx', ListaRecetaDetalleRx);
            formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
            formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
            formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());

            //RQ0002 DATOS ADICIONALES DE LA ATENCION 

            formData.append('ProximaCita', $('#txtProximaConsulta').val());
            formData.append('idTipoConsultaProxCita', $("#cboTipoConsulta").val());

            // FIN RQ0002

            //DATOS DE PERINATAL
            //DATOS PROCABECERA

            if (objrow.usaModuloMaterno == true) {
                formData.append('CEperinatal', true);
            }
            else {
                formData.append('CEperinatal', false);
            }

            formData.append('IdPrograma', 1);
            formData.append('IdProcabecera', $("#idCabecera").val());

            if ($("#idControl").val() == 0) {
                formData.append('IdControl', 1);
            }
            else {
                formData.append('IdControl', $("#idControl").val());
            }

            formData.append('FechaControl', $('#txtFechaControl').val());
            //DATOS EVAL. EMERGENCIA

            formData.append("IdAtencion", objrow.idAtencion);
            formData.append("FechaUR", $("#txtFUM").val());
            formData.append("FechaPP", $("#txtFPP").val());
            formData.append("EdadGestacional", $("#txtSemanas").val());
            formData.append("NroFetos", $("#txtNroFetos").val());
            formData.append("DiasGestacionalEco", $("#txtDiasEco").val());
            formData.append("SemanaGestacionalEco", $("#txtSemasEco").val());

            if ($('#chkMuestraEco').prop('checked') === false) {
                formData.append("FechaEcoAct", 0);
                formData.append("FechaEco", "");
            } else {
                formData.append("FechaEcoAct", 1);
                formData.append("FechaEco", $("#txtFEcog").val());
            }

            formData.append("DiasGestacional", $("#txtDias").val());

            if ($('#chkCalculaFechaEco').prop('checked') === false) {
                formData.append("CalculaFE", 0);
            } else {
                formData.append("CalculaFE", 1);
            }

            /***********************ANTECEDENTES PERSONALES*****************************/
            formData.append("Tbc", $('#rdbTbcPSi').prop('checked'));
            formData.append("TbcDescripcion", $("#txtTbcP").val());
            formData.append("Diabetes", $('#rdbPDiabSi').prop('checked'));
            formData.append("DiabetesDescripcion", $("#txtPDiabe").val());
            formData.append("PreeclampsiaEclampsia", $('#rdbPreePSi').prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcion", $("#txtPreeP").val());
            formData.append("Vih", $('#rdbVIHSi').prop('checked'));
            formData.append("vihDescripcion", $("#txtVihP").val());
            formData.append("Alergia", $('#rdbAlergSi').prop('checked'));
            formData.append("AlergiaDescripcion", $("#txtAlergiaP").val());
            formData.append("Otros", $('#rdbOtrosAntePerSi').prop('checked'));
            formData.append("OtrosDescripcion", $("#txtOtrosP").val());
            formData.append("CirugiaMayor", $('#rdbCMSi').prop('checked'));
            formData.append("CirugiaMayorDescripcion", $("#txtCM").val());
            formData.append("Violencia", $('#rdbVioSi').prop('checked'));
            formData.append("ViolenciaDescripcion", $("#txtVio").val());
            formData.append("Hipertencion", $('#rdbHiperPSi').prop('checked'));
            formData.append("HipertencionDescripcion", $("#txtHiperP").val());

            formData.append("VacunaPrevia", $('#rdbVacunaPreSi').prop('checked'));
            formData.append("VacunaPreviaDescripcion", $("#txtVacunaPre").val());


            /***********************ANTECEDENTES FAMILIARES*****************************/
            formData.append("TbcFam", $("#rdbTbcSi").prop('checked'));
            formData.append("TbcDescripcionFam", $("#txtTbc").val());
            formData.append("DiabetesFam", $("#rdbDiabSi").prop('checked'));
            formData.append("DiabetesDescripcionFam", $("#txtDiabe").val());
            formData.append("PreeclampsiaEclampsiaFam", $("#rdbPreeSi").prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcionFam", $("#txtPree").val());
            formData.append("OtraCondMedGraveDescripcionFam", $("#txtOtrosFam").val());
            formData.append("OtraCondMedGraveFam", $("#rdbOtrosSi").prop('checked'));
            formData.append("HipertencionFam", $("#rdbHiperSi").prop('checked'));
            formData.append("HipertencionDescripcionFam", $("#txtHiper").val());
            /***********************ANTECEDENTES OBSTETRICOS**************************************/

            formData.append("Gestas", $("#txtGestasP").val());
            formData.append("abortos", $("#txtAbortos").val());
            formData.append("Vaginales", $("#txtVaginales").val());
            formData.append("NacidosVivos", $("#txtNacidosVivos").val());
            formData.append("Viven", $("#txtViven").val());
            formData.append("Partos", $("#txtPartos").val());
            formData.append("Cesareas", $("#txtCesareas").val());
            formData.append("NacidosMuertos", $("#txtNacMuertos").val());
            formData.append("Muerto1Seman", $("#txt1Sem").val());
            formData.append("Despues1Seman", $("#txtDesp1Sem").val());

            formData.append("ceromastres", $("#cho3").prop('checked'));//cho3
            formData.append("menor2500gr", $("#ch2500").prop('checked'));
            formData.append("Multiple", $("#chMult").prop('checked'));
            formData.append("memor37sm", $("#ch37Sem").prop('checked'));

            formData.append("PesoPregestacional", $("#txtPesoPregesta").val());
            formData.append("FechaFinEmbarazoAnt", $("#txtFinEmb").val());
            formData.append("idTerminacion", $("#cboTerminacion").val());

            //alert($("#cboAborto").val());

            formData.append("idAborto", $("#cboAborto").val());
            formData.append("FracasoMetodo", $("#cbofracaso").val());
            formData.append("EmbarazoPlaneado", $("#cboEmbplaneado").val());
            formData.append("EmbarazoEctopico", $("#chEtopico").prop('checked'));
            formData.append("mayor4000g", $("#ch4000g").prop('checked'));
            formData.append("P1", $("#txtPar1").val());
            formData.append("P2", $("#txtPar2").val());
            formData.append("P3", $("#txtPar3").val());
            formData.append("P4", $("#txtPar4").val());

            //GIENCOOBSTETRA
            //formData.append("IdAtencion", $("#").val());
            formData.append("LGeBus", ($('#rdbGBNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LVagina", ($('#rdVaginadNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LCervix", ($('#rdbCervixNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LUtero", ($('#rdbUteroNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DGeBus", $("#txtGB").val());
            formData.append("DVagina", $("#txtVagina").val());
            formData.append("DCervix", $("#txtCervix").val());
            formData.append("DUtero", $("#txtUtero").val());
            formData.append("LAnexos", ($('#rdbAnexosNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LDouglas", ($('#rdbFsDouglasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LParametros", ($('#rdbParamNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LMamas", ($('#rdbMamasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DAnexos", $("#txtAnexos").val());
            formData.append("DDouglas", $("#txtFsDouglas").val());
            formData.append("DParametros", $("#txtParam").val());
            formData.append("DMamas", $("#txtMamas").val());

            formData.append("LUA", $("#txtAlturaUterina").val());
            formData.append("LLCF", $("#txtLfc").val());
            formData.append("LDU", $("#txtDU").val());

            var situacion, posicion, presentacion, dips = 0;
            situacion = $('#rdbSitLongitudinal').prop('checked') == true ? 1 : $('#rdbSitTransversal').prop('checked') == true ? 0 : 5
            formData.append("LSituacion", situacion);

            posicion = $('#rdbPosDerecha').prop('checked') == true ? 1 : $('#rdbPosIzquierda').prop('checked') == true ? 0 : 5
            formData.append("LPosicion", posicion);

            presentacion = $('#rdbPreCefalica').prop('checked') == true ? 1 : $('#rdbPrePodalica').prop('checked') == true ? 0 : 5
            formData.append("LPresentacion", presentacion);

            dips = $('#rdbDipsI').prop('checked') == true ? 1 : $('#rdbDipsII').prop('checked') == true ? 2 : $('#rdbDipsIII').prop('checked') == true ? 3 : 4
            formData.append("LDips", dips);

            formData.append("DF1Spp", $("#txtF1SiPoPr").val());
            formData.append("DF2Spp", $("#txtF2SiPoPr").val());
            formData.append("DF3Spp", $("#txtF3SiPoPr").val());
            formData.append("LF1Lcf", $("#txtF1Lfc").val());
            formData.append("LF2Lcf", $("#txtF2Lfc").val());
            formData.append("LF3Lcf", $("#txtF3Lfc").val());

            formData.append("LSoplos", ($('#rdbSoplosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LHidraminios", ($('#rdbHidromiosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPonderado", $("#txtPonderado").val());


            //formData.append("LDilatacion", $("#txtPonderado").val());

            formData.append("DObservaciones", $("#txtObserControl").val());
            formData.append("LEstadoGeneral", ($('#rdbEstGSNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoCV", ($('#rdbCardNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAbdomen", ($('#rdbAbdomenNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoR", ($('#rdbAptRespNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoU", ($('#rdbAptUrinpNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LExtremidades", ($('#rdbExtremNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DEstadoGeneral", $("#txtEstdGeneSens").val());
            formData.append("DAparatoCV", $("#txtCardvas").val());
            formData.append("DAbdomen", $("#txtAbdomenNormal").val());
            formData.append("DAparatoR", $("#txtbAptResp").val());
            formData.append("DAparatoU", $("#txtbAptUrin").val());
            formData.append("DExtremidades", $("#txtExtrem").val());
            formData.append("LTipoEmbarazo", $("#cboTipoEmbrazo").val());

            formData.append("DEdemas", $("#txtEdemas").val());
            formData.append("DReflejos", $("#txtReflejos").val());

            formData.append("ObservacionGinecologica", $("#txtObserExamenes").val());

            formData.append("Proteinura", $("#txtProteinuria").val());
            formData.append("MovFetales", $("#txtMovFetales").val());
            formData.append("MFF01", $("#txtF1Mf").val());
            formData.append("MFF02", $("#txtF2Mf").val());
            formData.append("MFF03", $("#txtF3Mf").val());

            formData.append("SignosAlarma", $("#txtsignosAlarma").val());
            formData.append("Pap", $('#rdbPapSi').prop('checked'));

            //Traije
            formData.append("NroHistoriaClinica", objrow.nroHistoriaClinica);
            formData.append("CitaFecha", objrow.fechaIngreso2);
            formData.append("CitaIdServicio", objrow.idServicioIngreso);

            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()


            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePerimCefalico", $("#txtPC").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());
            formData.append("CitaObservaciones", $("#txtOtrasObservacionesGe").val()); //se 

            //pelvis
            formData.append("LPelvisGinecoide", $('#rdbPelvisGSI').prop('checked') == true ? 1 : 0);
            formData.append("LCompatibilidadF", $('#rdbCompativilidadSI').prop('checked') == true ? 1 : $('#rdbCompativilidadNo').prop('checked') == true ? 2 : 0);

            //nuevos 
            formData.append("Tratamiento", $("#txtTratamiento").val());
            formData.append("PlanTrabajo", $("#txtPlanTrabajo").val());

            //JDELGADO011 INTERCONSULTA
            formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
            formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
            formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
            formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
            //JDELGADO011 INTERCONSULTA

            // jdelgado anestesio
            formData.append("esPreAnestesica", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0)
            // jdelgado anestesio

            // jdelgado adolescencia
            formData.append("idTipoAtencionAdolescencia", $('#cboTipoAtencionAdolecencia').val())
            // jdelgado adolescencia

            //NINIO SANO 
            //ninio sano remplaza tencion

            if (objrow.usaModuloNinoSano == true) {
                formData.append("Apetito", $("#txtApetitoNinio").val());
                formData.append("Suenio", $("#txtSuenioNinio").val());
                formData.append("Sed", $("#txtSedNinio").val());
                formData.append("Orina", $("#txtOrinaNinio").val());
                formData.append("Deposiciones", $("#txtDiposicionesNinio").val());

                formData.append('CEninioSano', true);
                formData.append("tipoEmbarazo", $('#rdbEmbarazoNormal').prop('checked') == true ? 1 : 2);
                formData.append("patologias", $("#txtPatologia").val());
                formData.append("nroEmbarazo", $("#txtNroEmbarazo").val());
                formData.append("atencionPrenatal", $('#rdbAtenPrenatalSi').prop('checked') == true ? 1 : 2);
                formData.append("nroApn", $("#txtNroAPN").val());
                formData.append("lugarApn", $("#txtLugarAPN").val());
                formData.append("tipoParto", $('#rdbPartoEutocico').prop('checked') == true ? 1 : 2);
                formData.append("complicacionParto", $("#txtComplicaciones").val());
                formData.append("lugarParto", $('#rdbLugarPartoEeSs').prop('checked') == true ? 1 : $('#rdbLugarPartoDomicilio').prop('checked') == true ? 2 : 3);
                formData.append("atendidoPor", $('#rdbAtendidoPorPS').prop('checked') == true ? 1 : $('#rdbAtendidoPorTec').prop('checked') == true ? 2 : $('#rdbAtendidoPorACS').prop('checked') == true ? 3 : $('#rdbAtendidoPorFM').prop('checked') == true ? 4 : 5);
                formData.append("atendidoPorotro", $("#txtAtendidoPorOtro").val());
                //->nacimiento
                formData.append("estaGestacionalAlNacer", $("#txtEdadGestacionalNacer").val());
                formData.append("pesoAlNacer", $("#txtPesoNacer").val());
                formData.append("tallaAlNacer", $("#txtTallaNacer").val());
                formData.append("perimetroCefalico", $("#txtPerimetricoCefalico").val());
                formData.append("perimetroToracico", $("#txtPerimetricoToracico").val());

                formData.append("inmedito", $('#rdbInmediatoSi').prop('checked') == true ? 1 : 2);
                formData.append("apgar1min", $("#txtAPGAR1").val());
                formData.append("apgar5min", $("#txtAPGAR5").val());
                formData.append("reanimacion", $('#rdbReanimacionSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatal", $('#rdbPatologiaNeoSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatalDescripcion", $("#txtEspecifique").val());
                formData.append("hospitalizacion", $('#rdbHospitalizacionSi').prop('checked') == true ? 1 : 2);
                formData.append("tiempoHospitalizado", $("#txtTiempoHospitalizacion").val());

                //->alimentacion/patologicos
                formData.append("alimentPrimerosSeisMeses", $('#rdbPrimMesesLME').prop('checked') == true ? 1 : $('#rdbPrimMesesMIXTA').prop('checked') == true ? 2 : 3);
                formData.append("alimentInicioAlimentacionComplementaria", $("#txtIncioAlimComplementaria").val());
                formData.append("alimentSumplementoFe", $('#rdbSumplementoSi').prop('checked') == true ? 1 : 2);

                formData.append("patTbc", $('#rdbNinoTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("patSobaAsma", $('#rdbNinoSobaAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("patEpilepsia", $('#rdbNinoEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patInfecciones", $('#rdbNinoInfeccionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patHospitalizaciones", $('#rdbNinoHospitalizacionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patTransferenciaSangre", $('#rdbNinoTransfucionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patCirugia", $('#rdbNinoCirugiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patDisplacia", $('#rdbNinoDisplacíaSi').prop('checked') == true ? 1 : 2);
                formData.append("patHipotiroidismo", $('#rdbNinoHipotiroidismoSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergia", $('#rdbNinoAlergiaMedSi').prop('checked') == true ? 1 : 2);
                formData.append("patOtroAntecedentes", $('#rdbNinoOtrosAntecSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergiaDesc", $("#txtNinoSanoAlergiaMedicamentos").val());
                formData.append("patOtroAntecedentesDesc", $("#txtNinoSanoOtroAntec").val());

                //->Familaires/Viveinda 
                formData.append("famiTuberculosis", $('#rdbNinoFamiliaresTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiTuberculosisDesc", $("#txtNinoFamiliaresTbc").val());
                formData.append("famiAsma", $('#rdbNinoFamiliaresAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAsmaDesc", $("#txtNinoFamiliaresAsma").val());
                formData.append("famiVih", $('#rdbNinoFamiliaresSidaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiVihDesc", $("#txtNinoFamiliaresSida").val());
                formData.append("famiDiabetes", $('#rdbNinoFamiliaresDiabetesSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDiabetesDesc", $("#txtNinoFamiliaresDiabetesSi").val());
                formData.append("famiEpilepsia", $('#rdbNinoFamiliaresEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiEpilepsiaDesc", $("#txtNinoFamiliaresEpilepsia").val());
                formData.append("famiAlerMedica", $('#rdbNinoFamiliaresAlergiaMedcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlerMedicaDesc", $("#txtNinoFamiliaresAlergiaMedc").val());
                formData.append("famiViolenciaFami", $('#rdbNinoFamiliaresViolenciaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiViolenciaFamiDesc", $("#txtNinoFamiliaresViolencia").val());
                formData.append("famiAlcoholismo", $('#rdbNinoFamiliaresAlcoholismoSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlcoholismoDesc", $("#txtNinoFamiliaresAlcoholismo").val());
                formData.append("famiDrogadiccion", $('#rdbNinoFamiliaresDrogadiccionSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDrogadiccionDesc", $("#txtNinoFamiliaresDrogadiccion").val());
                formData.append("famiHepatitisB", $('#rdbNinoFamiliaresHepatitisSi').prop('checked') == true ? 1 : 2);
                formData.append("famiHepatitisBDesc", $("#txtNinoFamiliaresHepatitis").val());
                formData.append("viviendaAguaPotable", $('#rdbAguaPotableSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaAguaPotableDesc", $("#txtAguaPotable").val());
                formData.append("viviendaDesague", $('#rdbDesagueSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaDesagueDesc", $("#txtDesague").val());

                var listaItmsEValuar = NinioAltoRiesgo.DevolverItems();
                formData.append('listaItmsEValuar', listaItmsEValuar);
                formData.append("idPlanDesarrolloPaciente", $("#hdidPlanDesarrolloPaciente").val());
                formData.append("idPlanIntegralPaciente", $("#hdidPlanIntegralPaciente").val());
                formData.append("fechaProgramada", $("#txtFechaProgramada").val());
                formData.append("fechaEjecucion", $("#txtFechaEjecucion").val());
                formData.append("idEstablecimiento", $("#hdidEstablecimiento").val());
                formData.append("evaluacion", NinioAltoRiesgo.obtenerEvaluacion());

                if (!NinioAltoRiesgo.validaItems()) {
                    alerta('2', 'Seleccione todos los items a eveluar');
                    return false;
                }
            } else {
                formData.append('CEninioSano', false);

                formData.append("Apetito", $("#txtApetito").val());
                formData.append("Suenio", $("#txtSuenio").val());
                formData.append("Sed", $("#txtSed").val());
                formData.append("Orina", $("#txtOrina").val());
                formData.append("Deposiciones", $("#txtDiposiciones").val());
            }

            alerta(4, 'Guardando Atención, por favor espere.');
            let datos;
            try {
                Cargando(1);
                datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/RegitraModifcaEpisodio?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
                Cargando(0);
                console.log(datos);
                if (datos) {
                    if (datos.session) {
                        if (datos.respuesta == true) {
                            alerta('1', 'Se  registro correctamente la atención');
                            return true
                        } else {
                            alerta('2', datos.mesanje);
                            return false;
                        }
                    }
                    else {
                        swal({
                            title: 'Atenciones',
                            text: "Su session ya expiro, vuelva a ingresar en otra ventana",
                            type: 'info',
                        }).done();
                    }
                } else {
                    alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
                }
                return false;
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }

            $('#tblCSAtencion tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        } else {
            alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
            return false
        }
    },

    ImprimiInforme2: async (idCuentaAtencion, code, idDoc) => {
        Cargando(1);
        //var objrow = oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=A";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "CE-" + idCuentaAtencion + "-" + $.now()
                    //a.click();
                    Cargando(0);
                    AbrirVisorDocumento(url, 1);

                    ListaAtencionesCE();

                } else {
                    Cargando(0);
                    alerta(2, "El documento aún no está firmado digitalmente.")
                }

            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
            }
        }
        request.send();
    },
    ImprimirDocumentoConFirma: (idCuentaAtencion, code, idDoc, tipo) => {
        //var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();
        Cargando(1);
        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            if (this.response.size > 0) {
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = tipo + idCuentaAtencion + "-" + $.now()
                //a.click();

                AbrirVisorDocumento(url, 1);

                ListaAtencionesCE();
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
            Cargando(0);
        }
        request.send();
    },

    InitDatables: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 7,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                },
                {
                    width: '7%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //KHOYOSI
                        if (rowData.estadoCita == "Separada") {
                            $(td).html('<span class="chip orange">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Atendido") {
                            $(td).html('<span class="chip success">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Pagada") {
                            $(td).html('<span class="chip blue">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Vencida (No pagada)") {
                            $(td).html('<span class="chip secondary">' + rowData.estadoCita + '</span >');
                        }
                        //KHOYOSI
                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.usaModuloMaterno) {
                            $(td).html('<button class="btnCarnetPrenatal btn btn-sm btn-indigo glow_button" title="Visualiza Carnet Prenatal" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-address-card"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (AtencionMedicaInit.permisoFirma4Identity == '1') {
                                if (rowData.statusFirma == 0) {
                                    btnRuta = '<button class="Firma4Identity btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                                } else {
                                    btnImprime = ' <button class="btnFirma4IdentityImprime btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                                }
                            } else {
                                if (rowData.statusFirma == 0) {
                                    btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                }
                                if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                                    btnImprime = ' <button class="ImprimeInforme btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                }
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },
                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                {
                    width: '10%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                        if ((rowData.idReferencia > 0 || rowData.idContraReferencia > 0) && rowData.idFirmaRefCon != null && permisoRefcon == '1') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeHojaRefConSinF btn btn-sm btn-warning glow_button" title="Visualiza Ref/Con" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (rowData.statusFirmaRefCon == 0) {
                                btnRuta = '<a href="' + rowData.rutaRefCon + '" class="btn btn-sm btn-danger" title="Firmar Hoja Ref/Con" data-toggle="tooltip"> <i class="fa fa-pencil"></i></a>';
                            }
                            if (rowData.statusFirmaRefCon == 1 || rowData.statusFirmaRefCon == 0) {
                                btnImprime = ' <button class="ImprimeHojaRefConConF btn btn-sm btn-success glow_button" title="Imprime Hoja Ref/Con Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';

                                //btnRuta = "";
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                            //$(td).html(btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },
                ////////////////////////////////////////////////////////////////////

                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '10%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                        if (!isEmpty(rowData.fechaEgreso) && rowData.idFirmaFua != null && permisoFua == '1') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (AtencionMedicaInit.permisoFirma4Identity == '1') {
                                if (rowData.statusFirmaFua == 0) {
                                    btnRuta = '<button class="Firma4IdentityFUA btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                                } else {
                                    btnImprime = ' <button class="btnFirma4IdentityImprimeFUA btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                                }
                            } else {
                                if (rowData.statusFirmaFua == 0) {
                                    btnRuta = '<a href="' + rowData.rutaFua + '" class="btn btn-sm btn-danger" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                }
                                if (rowData.statusFirmaFua == 1 || rowData.statusFirmaFua == 0) {
                                    btnImprime = ' <button class="ImprimeFuaCF btn btn-sm btn-success glow_button" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';

                                    //btnRuta = "";
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                }
                ///////////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        AtencionMedicaInit.oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },

    Events: () => {
        $('#btnBuscarAtenciones').on('click', async function () {
            $('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencion').val() == "") {
                alerta('2', 'Ingrese fecha de atencion');
                return false;
            }
            else {
                //$('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
                $('#lblMedicoProgramado').html($('#cboConsultorio>option:selected').attr("med"))            //KHOYOSI
                AtencionMedicaInit.ListaAtencionesCE();
                await AtencionMedicaInit.CargarCatalogo();                   //KHOYOSI
                await AtencionMedicaInit.CargarModulo($('#cboConsultorio').val());
            }
            $('html, body').animate({
                scrollTop: $(".head").offset().top
            }, 1000)
        })
        $('#btnModificarAtenciones').on('click', async function () {
            AtencionMedicaInit.DesbloquearCampos();
            await AtencionMedica.Mostrar(1)
        })
        $('#btnEliminarAtenciones').on('click', function () {
            //Mostrar(3);
        })
        $('#btnConsultarAtenciones').on('click', async function () {
            await AtencionMedica.Mostrar(4);
            AtencionMedicaInit.BloquearCampos();
        })
        $('#btnguardar').on('click', async function () {

            Cargando(1);

            const data = await AtencionMedicaInit.GuardarAtencion()
            if (data == true) {
                const datarec = await Ordenes.GuardarOrdenesMedicas()
                console.log(datarec);
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                AtencionMedicaInit.ListaAtencionesCE()
            }

            Cargando(0)
        })
        $('#btnDescargaParteSF').on('click', async function () {
            var programacion = $('#cboConsultorio>option:selected').attr("prog")
            Cargando(1);
            const data = await AtencionMedica.GeneraParteDiario(programacion);
            Cargando(0);
            if (data == true) {
                alerta(1, 'El Parte Diario se genero correctamente.');
                const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI

                if (typeof firma === 'undefined') {
                    alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
                } else {
                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                    AbrirVisorDocumento(firma.rutaArchivo, 0)
                }
            } else {
                alerta(2, 'Hubo un error al generar el Parte Diario.')
            }
        })
        $('#btnDescargaParte').on('click', async function () {

            var programacion = $('#cboConsultorio>option:selected').attr("prog");
            const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
            } else {
                AtencionMedica.ImprimiParteDiarioConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo)
            }

        })
        $('#btnGeneraParte').on('click', async function () {
            swal({
                title: 'Generar Parte Diario',
                text: 'Estas seguro generar y firmar el parte diario?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(async function () {
                var programacion = $('#cboConsultorio>option:selected').attr("prog")
                const data = await AtencionMedica.GeneraParteDiario(programacion)
                if (data == true) {
                    alerta(1, 'El Parte Diario se genero correctamente.')
                    const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI
                    if (typeof firma === 'undefined') {
                        alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
                    } else {
                        $("#codeParte").val(firma.code)
                        $("#statusParte").val(firma.statusFirma)
                        window.open(firma.ruta, '_blank')
                    }
                } else {
                    alerta(2, 'Hubo un error al generar el Parte Diario.')
                }
                //COMENTADO POR KHOYOSI
            })
        })




        $('#btnImprimeRecetas').on('click', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}

            const recetas = await AtencionMedicaInit.ListaRecetasCabeceras();
            //console.log(recetas);
            VisorReceta.AbrirVisorRecetas(recetas);

        })
        $('#btnCboRefresca').on('click', function () {
            AtencionMedica.RefresacaCombox();
        });


        $("#txtFechaAtencion").focusout(function (e) { // JDELGADO001
            $('#lblMedicoProgramado').html("")
            var code = (e.keyCode ? e.keyCode : e.which)
            if (code == 13) {
                AtencionMedicaInit.oTable_atenciones.fnClearTable()
                if ($("#txtFechaAtencion").val() == "") {
                    alerta('2', 'Ingrese fecha de atencion')
                    return false;
                }
                else {
                    AtencionMedicaInit.ListaServicios()
                }
            }
        })
        $('#txtFechaAtencion').on('change', function () {
            $('#lblMedicoProgramado').html("")
            AtencionMedicaInit.oTable_atenciones.fnClearTable()
            if ($("#txtFechaAtencion").val() == "") {
                alerta('2', 'Ingrese fecha de atencion')
                return false;
            }
            else {
                AtencionMedicaInit.ListaServicios()
            }
        });

        $('#cboConsultorio').on('change', function () {
            $("#codeParte").val($('#cboConsultorio>option:selected').attr("code"))
            $("#statusParte").val($('#cboConsultorio>option:selected').attr("status"))

            //console.log($('#cboConsultorio>option:selected').attr("idEmpleado"));

            if ($('#cboConsultorio>option:selected').attr("code") != "" && $('#cboConsultorio>option:selected').attr("status") == 1) {
                $('#btnGeneraParte').css("visibility", 'hidden')
            }
            else {
                $('#btnGeneraParte').css("visibility", 'visible')
            }
            $('#btnBuscarAtenciones').click()
        })
        $('#cboTipoAtencionAdolecencia').on('change', async function () {
            await AtencionMedicaInit.CargarModuloAdolecencia($('#cboTipoAtencionAdolecencia').val())
            //AtencionMedica.Mostrar(1)
        })
        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow)

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'FUA')               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0)
        })
        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow)

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'FUA')               //KHOYOSI
            AtencionMedicaInit.ImprimirDocumentoConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo)
        })
        /////////////////////////////////EVENTOS IMPRIMIR REFCON/////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConSinF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0);
        });
        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConConF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            ImprimirRefConFirmado(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);
        });
        $('#tblAtencion tbody').on('click', '.ImprimeInforme', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI
            const informe = await AtencionMedicaInit.ImprimiInforme2(firma.idCuentaAtencion, firma.code, firma.idDoc)
        });
        $('#tblAtencion tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            tipoFormato = 0;
            Cargando(1);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI

            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {
                    if (row.usaModuloMaterno) {
                        tipoFormato = 1;
                    }
                    else if (row.usaModuloNinoSano) {
                        tipoFormato = 2;
                    }
                    else {
                        tipoFormato = 0;
                    }
                    //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
                }

                const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idProCabecera, tipoFormato);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        //////////////////////////////KHOYOSI///////////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.btnCarnetPrenatal', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(row.idPaciente);

            //AbrirVisorDocumento(carnet, 0);
            //Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        $('#tblAtencion tbody').on('click', '.Firma4Identity', function (event) {
            event.preventDefault();

            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivo}`);
            $('#bit4id-documentName').text(row.rutaArchivo.substr(row.rutaArchivo.indexOf("/") + 1,).substr(row.rutaArchivo.substr(row.rutaArchivo.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivo},${row.idCuentaAtencion},A,ConsultaExterna,AtencionMedica`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";

            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });
        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprime', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivo, 0);
        });
        $('#tblAtencion tbody').on('click', '.Firma4IdentityFUA', function (event) {
            event.preventDefault();

            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivoFua}`);
            $('#bit4id-documentName').text(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).substr(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivoFua},${row.idCuentaAtencion},FUA`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });
        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprimeFUA', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivoFua, 0);
        });
        $('#tblAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                AtencionMedicaInit.oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = AtencionMedicaInit.oTable_atenciones.api(true).row($(this)).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(pos);

            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);
            $('#txtDatos').html('N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            $('#txtDatoCuenta').val(row.idCuentaAtencion);
            $('#txtDatoPaciente').val(row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres);
            $('#txtDatoHistoria').val(row.nroHistoriaClinica);
            $('#txtDatoEdad').val(row.edadPaciente);
        });
    },

    fechaDia: () => {
        var fechaG = new Date();
        var diaG = fechaG.getDate();
        var mesG = parseInt(fechaG.getMonth()) + 1;
        var yyyG = fechaG.getFullYear();

        fechaA = diaG + "/" + mesG + "/" + yyyG
        return fechaA
    },
    fechaCorrecta: (fecha1, fecha2) => {

        var midata = new FormData();

        midata.append('fecha1', fecha1);
        midata.append('fecha2', fecha2);

        valor = false

        $.ajax({
            method: "POST",
            url: "/Atencion/validaFechaMayor?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                valor = datos.resultado
            },
            error: function (msg) {
                setTimeout(function () {
                    valor = false
                }, 900)
            }
        });

        return valor
    },
    CargarCatalogo: () => {
        Cargando(1);
        Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());
        Cargando(0);
    },
    CargarModulo: async (idServicio) => {
        var midata = new FormData();
        midata.append('idServicio', idServicio);
        $("#modulo").html("");

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/CargarModulo?area=ConsultaExterna",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $("#modulo").html(datos);
            //$("#modulo").load('/Atencion/CargarModulo');
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },
    CargarModuloAdolecencia: async (idTipo) => {
        Cargando(1)
        let formData = new FormData();
        formData.append('idTipo', idTipo);

        HttpClient.Post('/Atencion/CargarModuloAdolecencia?area=ConsultaExterna', formData)
            .then(res => {

                if (res.estado) {
                    $.ajax({
                        method: "GET",
                        url: res.data,
                        data: null,
                        dataType: "HTML",
                        cache: false,
                        processData: false,
                        contentType: false,
                    })
                        .done(function (htmlRes) {
                            console.log('Esto pasa primero')
                            $("#modulo").html(htmlRes);
                            Cargando(0)
                        })
                        .done(function () {
                            AtencionMedica.MostrarParaAdolecencia(1)
                        })
                        .fail(function () {
                            alerta(2, "Error al cargar modulo");
                            Cargando(0)
                        })
                } else {
                    alerta(2, res.msg);
                    Cargando(0)
                }

            })
            .catch((e) => {
                alerta(2, "Error al cargar modulo " + e);
                Cargando(0)
            })
        
    },

    ValidaEntrevista: (tipo) => {
        valor = true;

        switch (tipo) {
            case "1":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtEdadGestacional').val() == "" || $('#txtEdadGestacional').val() == 0) {
                    alerta('2', 'Ingrese edad gestacional');
                    $('#txtEdadGestacional').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "2":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "") {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "3":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }
                break;
            case "4":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }

                break;

            default:
                valor = true;
            // code block
        }

        return valor

    },
    ///////////////////////KHOYOSI////////////////////////////
    BloquearCampos: () => {
        $("#ceAtencion .campo input[type=text]").attr('disabled', 'disabled');
        $("#ceAtencion .campo textarea").attr('disabled', 'disabled');
        $("#ceAtencion .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#ceAtencion .campo input[type=radio]").attr('disabled', 'disabled');
        $("#ceAtencion .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesCPT").hide();
        $(".OpcionesOrdenes").hide();
        $(".OpcionesDiagnosticos").hide();
    },
    DesbloquearCampos: () => {
        $("#ceAtencion .campo input[type=text]").removeAttr("disabled");
        $("#ceAtencion .campo textarea").removeAttr("disabled");
        $("#ceAtencion .campo input[type=checkbox]").removeAttr("disabled");
        $("#ceAtencion .campo input[type=radio]").removeAttr("disabled");
        $("#ceAtencion .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesCPT").show();
        $(".OpcionesOrdenes").show();
        $(".OpcionesDiagnosticos").show();
    }
    ///////////////////////////////////////////////////////
}

$(document).ready(() => {
    //AtencionMedicaInit.permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
    //AtencionMedicaInit.permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY")

    AtencionMedicaInit.Plugins()
    AtencionMedicaInit.CargaInicial()

    AtencionMedicaInit.InitDatables()

    AtencionMedicaInit.Events()
})