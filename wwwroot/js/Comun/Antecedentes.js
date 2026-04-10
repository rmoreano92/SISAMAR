var Antecedentes = {
    Iniciar() {
        Antecedentes.Eventos();
    },

    Eventos() {
        $("#txtFPP").on('change', function () {
            $("#txtFPPControl").val($("#txtFPP").val());
        });

        $("#txtSemanas").on('change', function () {
            $("#txtSemanaGestacional").val($("#txtSemanas").val());
        });

        $("#txtDias").on('change', function () {
            $("#txtDiasGestacional").val($("#txtDias").val());
        });
        
        $("#chkMuestraEco").on('change', function () {
            if ($("#chkMuestraEco").is(':checked')) {
                $("#txtFEcog").removeAttr('disabled');
                $("#txtDiasEco").attr('disabled', false);
                $("#txtSemasEco").attr('disabled', false);

                $("#txtFUM").attr('disabled', true);

            } else {
                $("#txtFEcog").prop("disabled", true);
                $("#txtDiasEco").attr('disabled', true);
                $("#txtSemasEco").attr('disabled', true);

                $("#txtFUM").attr('disabled', false);
            }
            $("#txtFEcog").val("");
            $("#txtDiasEco").val("");
            $("#txtSemasEco").val("");
            $("#txtSemanas").val("");
            $("#txtDias").val("");
            $("#txtFUM").val("");
            $("#txtFPP").val("");
            $('#chkCalculaFechaEco').prop('checked', false)
        });

        $("#chkCalculaFechaEco").on('change', async function () {
            if ($("#chkCalculaFechaEco").is(':checked')) {

                if ($("#txtSemasEco").val() == "") {
                    alerta(3, "Debe ingresar semanas de ecografía ");
                    $('#chkCalculaFechaEco').prop('checked', false)
                    $("#txtSemasEco").focus();
                    return false;
                }

                if ($("#txtDiasEco").val() == "") {
                    alerta(3, "Debe ingresar días de ecografía ");
                    $('#chkCalculaFechaEco').prop('checked', false)
                    $("#txtDiasEco").focus();
                    return false;
                }

                if ($("#txtFEcog").val() == "") {
                    alerta(3, "Debe ingresar la fecha de la ecografía.");
                    //$('#chkCalculaFechaEco').prop('checked', false)
                    $('#chkCalculaFechaEco').prop('checked', false)
                }

                await Antecedentes.CalcularEdadGestacional($("#txtFEcog").val(), 2, Variables.FechaIngreso);

            }
            else {
                //$('#chkMuestraEco').prop('checked', false)
                //$('#chkMuestraEco').change();

                $("#txtDiasEco").val("");
                $("#txtSemasEco").val("");
                $("#txtSemanas").val("");
                $("#txtDias").val("");
            }
        });

        $("#txtFUM").on('change', async function () {

            if (!isEmpty($("#txtFUM").val())) {
                await Antecedentes.CalcularEdadGestacional($("#txtFUM").val(), 1, Variables.FechaIngreso);
            }
            else {
                alerta(3, "Debe ingresar la fecha de ultima regla");
                $("#txtFUM").focus();
            }

        });


        $("#txtAbortos").on('change', function () {
            $("#txtGestasP").val(parseInt(($('#txtAbortos').val() == "") ? 0 : $('#txtAbortos').val()) + parseInt(($('#txtPartos').val() == "") ? 0 : $('#txtPartos').val()))

        })

        $("#txtAbortos").on('keyup', function () {
            if (isNull($("#txtAbortos").val(), 0) > 0) {
                $("#txtPar3").val($("#txtAbortos").val());
            } else {
                $("#txtPar3").val("");
            }
        })

        $("#txtPartos").on('change', function () {
            $("#txtGestasP").val(parseInt(($('#txtAbortos').val() == "") ? 0 : $('#txtAbortos').val()) + parseInt(($('#txtPartos').val() == "") ? 0 : $('#txtPartos').val()))
        })

        $("#txtPartos").on('keyup', function () {
            if (isNull($("#txtPartos").val(), 0) > 0 && isNull($("#txtPreterminos").val(), 0) > 0) {
                let paridad1 = isNull($("#txtPartos").val(), 0) - isNull($("#txtPreterminos").val(), 0);
                $("#txtPar1").val(paridad1);
            } else {
                $("#txtPar1").val("");
            }
        })

        $("#txtViven").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

        $("#txtViven").on('keyup', function () {
            if (isNull($("#txtViven").val(), 0) > 0) {
                $("#txtPar4").val($("#txtViven").val());
            } else {
                $("#txtPar4").val("");
            }
        });

        $("#txt1Sem").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

        $("#txtDesp1Sem").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

        $("#txtPreterminos").on('keyup', function () {
            if (isNull($("#txtPreterminos").val(), 0) > 0) {
                $("#txtEdadGestMasPrematuro").removeAttr("disabled");
                $("#txtPar2").val($("#txtPreterminos").val());

                if (isNull($("#txtPartos").val(), 0) > 0) {
                    let paridad1 = isNull($("#txtPartos").val(), 0) - isNull($("#txtPreterminos").val(), 0);
                    $("#txtPar1").val(paridad1);
                } else {
                    $("#txtPar1").val("");
                }

            } else {
                $("#txtEdadGestMasPrematuro").val("");
                $("#txtEdadGestMasPrematuro").prop("disabled", true);
                $("#txtPar2").val("");
            }
        });

        
        $("#txtGestasP").on('change', function () {

            if ($('#txtGestasP').val() == 0) {
                $("#txtAbortos").val(0);
                $("#txtVaginales").val(0);
                $("#txtNacidosVivos").val(0);
                $("#txtViven").val(0);
                $("#txtPartos").val(0);
                $("#txtCesareas").val(0);
                $("#txtNacMuertos").val(0);
                $("#txt1Sem").val(0);
                $("#txtDesp1Sem").val(0);
                $("#cboTerminacion").val(142);
                $("#cboTerminacion").change();
                $("#txtFinEmb").val("");
                $("#txtFinEmb").attr("disabled", true)
            }
            else {
                $("#txtAbortos").val("");
                $("#txtVaginales").val("");
                $("#txtNacidosVivos").val("");
                $("#txtViven").val("");
                $("#txtPartos").val("");
                $("#txtCesareas").val("");
                $("#txtNacMuertos").val("");
                $("#txt1Sem").val("");
                $("#txtDesp1Sem").val("");
                $("#txtFinEmb").attr("disabled", false)
            }

        });

        $("#cboTerminacion").on('change', function () {

            if ($("#cboTerminacion").val() == 141) {
                $("#cboAborto").attr('disabled', false);
                $('.chzn-select').chosen().trigger("chosen:updated");

            }
            else {
                if ($("#cboTerminacion").val() == 142) {
                    $("#txtFinEmb").attr("disabled", true)
                }
                else {
                    $("#txtFinEmb").attr("disabled", false)
                }
                $("#cboAborto").val(150);
                $("#cboAborto").attr('disabled', true);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
        });

    },

    async CalcularEdadGestacional(fecha, tipo, fechaIngreso) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        //let objrow = oTable_atenciones.api(true).row('.selected').data();
        formData.append('FechaCita', fechaIngreso);
        formData.append('Fecha', fecha);
        formData.append('SemanasEco', $('#txtSemasEco').val());
        formData.append('DiasEco', $('#txtDiasEco').val());
        formData.append('Tipo', tipo);

        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/Atencion/DevolverEdadGestacional?area=ConsultaExterna",
                //contentType: "application/json; charset=utf-8",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (isEmpty(datos) == false) {
                $("#txtSemanas").val(datos.cantSemanas);
                $("#txtDias").val(datos.cantDias);
                $("#txtFPP").val(datos.fpp);

                $("#txtFPPControl").val($("#txtFPP").val());
                $("#txtSemanaGestacional").val($("#txtSemanas").val());
                $("#txtDiasGestacional").val($("#txtDias").val());

                if (tipo == 2) {
                    $("#txtFUM").val(datos.fum);
                }
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;                
    },

    async ProCabeceraPorPacienteSeleccionar(idPaciente) {
        let respuesta;
        let resp = null;
        let datos
        let formData = new FormData();

        formData.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ProCabeceraPorPacienteSeleccionar?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            //if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    resp = datos.respuesta.table[0];                   
                }                
            //} else {
            //    Utilitario.CargarModalInicioSesion();
            //}
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async EvaluacionObstetricaSeleccionar(idAtencion) {
        let respuesta;
        let resp = null;
        let datos
        let formData = new FormData();

        formData.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/Atencion/EvaluacionObstetricaSeleccionar?area=ConsultaExterna",
                //contentType: "application/json; charset=utf-8",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            //if (datos.sesion) {
            if (datos.respuesta.table.length > 0) {
                let evaObst = datos.respuesta.table[0];
                await Antecedentes.CargarEvaluacionObstetrica(evaObst);
            }
            //} else {
            //    Utilitario.CargarModalInicioSesion();
            //}
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    async AntecedentesPacienteListar(idPaciente, idProCabecera) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idPaciente', idPaciente);
        formData.append('idProCabecera', idProCabecera); 

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAntecedentesPaciente?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            //if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    let antFam = datos.respuesta.table[0];
                    Antecedentes.CargarAntecedentesFamiliares(antFam);
                }
                    
                if (datos.respuesta.table1.length > 0) {
                    let antPer = datos.respuesta.table1[0];
                    Antecedentes.CargarAntecedentesPersonales(antPer);
                }

                if (datos.respuesta.table2.length > 0) {
                    let antObst = datos.respuesta.table2[0];
                    Antecedentes.CargarAntecedentesObstetricos(antObst);
                }

                if (datos.respuesta.table3.length > 0) {
                    let antInfMat = datos.respuesta.table3[0];
                    Antecedentes.CargarAntecedentesInfeccionesMaternas(antInfMat);
                }

                if (datos.respuesta.table4.length > 0) {
                    let antEnfMat = datos.respuesta.table4[0];
                    Antecedentes.CargarAntecedentesEnfermedadesMaternas(antEnfMat);
                }
                    
            //} else {
            //    Utilitario.CargarModalInicioSesion();
            //}
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async AntecedentesPacienteGuardar(idPaciente, idAtencion, idProCabecera) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idPaciente', idPaciente);
        formData.append('idProCabecera', idProCabecera);

        formData.append("IdAtencion", idAtencion);
        formData.append("FechaUR", $("#txtFUM").val());
        formData.append("FechaPP", $("#txtFPP").val());
        formData.append("Cnp", $("#txtCPNveces").val());         //KHOYOSI 150725
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

        /////////////////////////////ANTECEDENTES PERSONALES/////////////////////////////
        formData.append("Tbc", $('#rdbTbcPAntePerSi').prop('checked') ? 1 : 0);
        formData.append("TbcDescripcion", $("#txtTbcPAntePer").val());
        formData.append("Diabetes", $('#rdbPDiabAntePerSi').prop('checked') ? 1 : 0);
        formData.append("DiabetesDescripcion", $("#txtPDiabeAntePer").val());
        formData.append("PreeclampsiaEclampsia", $('#rdbPreePAntePerSi').prop('checked') ? 1 : 0);
        formData.append("PreeclampsiaEclampsiaDescripcion", $("#txtPreePAntePer").val());
        formData.append("Vih", $('#rdbVIHAntePerSi').prop('checked') ? 1 : 0);
        formData.append("vihDescripcion", $("#txtVihPAntePer").val());
        formData.append("Alergia", $('#rdbAlergAntePerSi').prop('checked') ? 1 : 0);
        formData.append("AlergiaDescripcion", $("#txtAlergiaPAntePer").val());
        formData.append("CirugiaMayor", $('#rdbCMAntePerSi').prop('checked') ? 1 : 0);
        formData.append("CirugiaMayorDescripcion", $("#txtCMAntePer").val());
        formData.append("Violencia", $('#rdbVioAntePerSi').prop('checked') ? 1 : 0);
        formData.append("ViolenciaDescripcion", $("#txtVioAntePer").val());
        formData.append("Hipertencion", $('#rdbHiperPAntePerSi').prop('checked') ? 1 : 0);
        formData.append("HipertencionDescripcion", $("#txtHiperPAntePer").val());
        formData.append("VacunaPrevia", $('#rdbVacunaPreAntePerSi').prop('checked') ? 1 : 0);
        formData.append("VacunaPreviaDescripcion", $("#txtVacunaPreAntePer").val());
        formData.append("Otros", $('#rdbOtrosAntePerSi').prop('checked') ? 1 : 0);
        formData.append("OtrosDescripcion", $("#txtOtrosPAntePer").val());


        /////////////////////////////ANTECEDENTES FAMILIARES/////////////////////////////
        formData.append("TbcFam", $("#rdbTbcSi").is(':checked') ? 1 : 0);
        formData.append("TbcDescripcionFam", $("#txtTbc").val());
        formData.append("DiabetesFam", $("#rdbDiabSi").is(':checked') ? 1 : 0);
        formData.append("DiabetesDescripcionFam", $("#txtDiabe").val());
        formData.append("HipertencionFam", $("#rdbHiperSi").is(':checked') ? 1 : 0);
        formData.append("HipertencionDescripcionFam", $("#txtHiper").val());
        formData.append("PreeclampsiaEclampsiaFam", $("#rdbPreeSi").is(':checked') ? 1 : 0);
        formData.append("PreeclampsiaEclampsiaDescripcionFam", $("#txtPree").val());
        formData.append("GemelaresFam", $("#rdbGemelaresSi").is(':checked') ? 1 : 0);
        formData.append("GemelaresDescripcionFam", $("#txtGemelares").val());
        formData.append("MalformacionesFam", $("#rdbMalformacionesSi").is(':checked') ? 1 : 0);
        formData.append("MalformacionesDescripcionFam", $("#txtMalformaciones").val());
        formData.append("OtraCondMedGraveFam", $("#rdbOtrosSi").is(':checked') ? 1 : 0);
        formData.append("OtraCondMedGraveDescripcionFam", $("#txtOtrosFam").val());


        /////////////////////////////ANTECEDENTES OBSTETRICOS/////////////////////////////
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
        formData.append("Preterminos", $("#txtPreterminos").val());
        formData.append("EdadGestMasPrematuro", $("#txtEdadGestMasPrematuro").val());

        formData.append("ceromastres", $("#cho3").is(':checked') ? 1 : 0);
        formData.append("menor2500gr", $("#ch2500").is(':checked') ? 1 : 0);
        formData.append("Multiple", $("#chMult").is(':checked') ? 1 : 0);
        formData.append("memor37sm", $("#ch37Sem").is(':checked') ? 1 : 0);
        formData.append("mayor4000g", $("#ch4000g").is(':checked') ? 1 : 0);

        formData.append("PesoPregestacional", $("#txtPesoPregesta").val());
        formData.append("FechaFinEmbarazoAnt", $("#txtFinEmb").val());
        formData.append("idTerminacion", $("#cboTerminacion").val());

        //alert($("#cboAborto").val());

        formData.append("idAborto", $("#cboAborto").val());
        formData.append("FracasoMetodo", $("#cbofracaso").val());
        formData.append("EmbarazoPlaneado", $("#cboEmbplaneado").val());
        formData.append("EmbarazoEctopico", $("#chEtopico").is(':checked') ? 1 : 0);

        formData.append("P1", $("#txtPar1").val());
        formData.append("P2", $("#txtPar2").val());
        formData.append("P3", $("#txtPar3").val());
        formData.append("P4", $("#txtPar4").val());

        /////////////////////////INFECCIONES MATERNAS//////////////////////////////        
        //formData.append("IdAtencion", Variables.IdAtencion);
        //formData.append("TbcActiva", $('#chkTBCactiva').is(":checked") == true ? 1 : 0);
        formData.append("Lues", $('#rdbLuesAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Torch", $('#rdbTorchAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("ItuIIITrim", $('#rdbITUtrimAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Urocultivo", $('#rdbUrocultivoAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Germen", $('#rdbGermenAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Covid", $('#rdbCovidAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Dengue", $('#rdbDengueAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("OtrosInfecciones", $('#rdbOtrosInfeccionesAntePerSi').is(":checked") == true ? 1 : 0);

        //formData.append("TbcActivaDescripcion", $("#txtTBCactiva").val());                          //KHOYOSI 230625
        formData.append("LuesDescripcion", $("#txtLuesAntePer").val());                             //KHOYOSI 230625
        formData.append("TorchDescripcion", $("#txtTorchAntePer").val());                          //KHOYOSI 230625
        formData.append("ItuIIITrimDescripcion", $("#txtITUtrimAntePer").val());                             //KHOYOSI 230625
        formData.append("UrocultivoDescripcion", $("#txtUrocultivoAntePer").val());                           //KHOYOSI 230625
        formData.append("GermenDescripcion", $("#txtGermenAntePer").val());                           //KHOYOSI 230625
        formData.append("CovidDescripcion", $("#txtCovidAntePer").val());                          //KHOYOSI 230625
        formData.append("DengueDescripcion", $("#txtDengueAntePer").val());                           //KHOYOSI 230625
        formData.append("OtrosInfeccionesDescripcion", $("#txtOtrosInfeccionesAntePer").val());

        /////////////////////////ENFERMEDADES MATERNAS//////////////////////////////        
        //formData.append("IdAtencion", Variables.IdAtencion);
        formData.append("PreEclampsia", $('#rdbPreClampsiaAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Eclampsia", $('#rdbEclampsiaAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Htt", $('#rdbHttAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("Desnutricion", $('#rdbDesnutricionAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("DiabetesMellitus", $('#rdbDiabetesMellitusAntePerSi').is(":checked") == true ? 1 : 0);
        //formData.append("HepatitisB", $('#chkHepatitisB').is(":checked") == true ? 1 : 0);
        formData.append("Anemia", $('#rdbAnemiaAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("HipoHipertiroides", $('#rdbHipoHipertiroidesAntePerSi').is(":checked") == true ? 1 : 0);
        formData.append("OtrosEnfermedades", $('#rdbOtrosEnfermedadesAntePerSi').is(":checked") == true ? 1 : 0);

        formData.append("PreEclampsiaDescripcion", $("#txtPreClampsiaAntePer").val());                                           //KHOYOSI 230625
        formData.append("EclampsiaDescripcion", $("#txtEclampsiaAntePer").val());                                          //KHOYOSI 230625
        formData.append("HttDescripcion", $("#txtHttAntePer").val());                                            //KHOYOSI 230625
        formData.append("DesnutricionDescripcion", $("#txtDesnutricionAntePer").val());                                             //KHOYOSI 230625
        formData.append("DiabetesMellitusDescripcion", $("#txtDiabetesMellitusAntePer").val());                                             //KHOYOSI 230625
        //formData.append("HepatitisBDescripcion", $("#txtHepatitisB").val());                                           //KHOYOSI 230625
        formData.append("AnemiaDescripcion", $("#txtAnemiaAntePer").val());                                           //KHOYOSI 230625
        formData.append("HipoHipertiroidesDescripcion", $("#txtHipoHipertiroidesAntePer").val());                                          //KHOYOSI 230625
        formData.append("OtrosEnfermedadesDescripcion", $("#txtOtrosEnfermedadesAntePer").val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/AntecedentesPacienteGuardar?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);            
            if (datos.respuesta == true) {
                resp = true;
            }

        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    CargarAntecedentesFamiliares(antFam) {
        antFam.tbc == 1 ? $("#rdbTbcSi").prop('checked', true) : $('#rdbTbcNo').prop('checked', true);
        antFam.diabetes == 1 ? $("#rdbDiabSi").prop('checked', true) : $('#rdbDiabNo').prop('checked', true);
        antFam.preeclampsiaEclampsia == 1 ? $("#rdbPreeSi").prop('checked', true) : $('#rdbPreeNo').prop('checked', true);
        //antFam.hipertencion == true ? $("#rdbHiperSi").prop('checked', true) : $('#rdbHiperNo').prop('checked', true);
        antFam.hta == 1 ? $("#rdbHiperSi").prop('checked', true) : $('#rdbHiperNo').prop('checked', true);                   //KHOYOSI170525
        antFam.gemelares == 1 ? $("#rdbGemelaresSi").prop('checked', true) : $('#rdbGemelaresNo').prop('checked', true);                //KHOYOSI170525
        antFam.malformaciones == 1 ? $("#rdbMalformacionesSi").prop('checked', true) : $('#rdbMalformacionesNo').prop('checked', true);                //KHOYOSI170525
        //antFam.otraCondMedGrave == true ? $("#rdbOtrosSi").prop('checked', true) : $('#rdbOtrosNo').prop('checked', true);
        antFam.otros == 1 ? $("#rdbOtrosSi").prop('checked', true) : $('#rdbOtrosNo').prop('checked', true);                //KHOYOSI170525
        $("#txtTbc").val(antFam.tbcDescripcion);
        $("#txtDiabe").val(antFam.diabetesDescripcion);
        $("#txtPree").val(antFam.preeclampsiaEclampsiaDescripcion);
        //$("#txtHiper").val(antFam.hipertencionDescripcion);
        $("#txtHiper").val(antFam.htaDescripcion);
        $("#txtGemelares").val(antFam.gemelaresDescripcion);
        $("#txtMalformaciones").val(antFam.malformacionesDescripcion);
        //$("#txtOtrosFam").val(antFam.otraCondMedGraveDescripcion);
        $("#txtOtrosFam").val(antFam.otrosDescripcion);
    },

    CargarAntecedentesPersonales(antPer) {
        antPer.tbc == 1 ? $("#rdbTbcPAntePerSi").prop('checked', true) : $("#rdbTbcPAntePerNo").prop('checked', true)
        $("#txtTbcPAntePer").val(antPer.tbcDescripcion);

        antPer.diabetes == 1 ? $('#rdbPDiabAntePerSi').prop('checked', true) : $('#rdbPDiabAntePerNo').prop('checked', true);
        $("#txtPDiabeAntePer").val(antPer.diabetesDescripcion);

        antPer.hipertencion == 1 ? $('#rdbHiperPAntePerSi').prop('checked', true) : $('#rdbHiperPAntePerNo').prop('checked', true);
        $("#txtHiperPAntePer").val(antPer.hipertencionDescripcion)

        antPer.preeclampsiaEclampsia == 1 ? $('#rdbPreePAntePerSi').prop('checked', true) : $('#rdbPreePAntePerNo').prop('checked', true);;
        $("#txtPreePAntePer").val(antPer.preeclampsiaEclampsiaDescripcion);

        antPer.vih == 1 ? $('#rdbVIHAntePerSi').prop('checked', true) : $('#rdbVIHAntePerNo').prop('checked', true)
        $("#txtVihPAntePer").val(antPer.vihDescripcion);

        antPer.alergia == 1 ? $('#rdbAlergAntePerSi').prop('checked', true) : $('#rdbAlergAntePerNo').prop('checked', true);
        $("#txtAlergiaPAntePer").val(antPer.alergiaDescripcion);

        antPer.cirugiaMayor == 1 ? $('#rdbCMAntePerSi').prop('checked', true) : $('#rdbCMAntePerNo').prop('checked', true);
        $("#txtCMAntePer").val(antPer.cirugiaMayorDescripcion);

        antPer.violencia == 1 ? $('#rdbVioAntePerSi').prop('checked', true) : $('#rdbVioAntePerNo').prop('checked', true);
        $("#txtVioAntePer").val(antPer.violenciaDescripcion);

        antPer.vacunaPrevia == 1 ? $('#rdbVacunaPreAntePerSi').prop('checked', true) : $('#rdbVacunaPreAntePerNo').prop('checked', true);
        $("#txtVacunaPreAntePer").val(antPer.vacunaPreviaDescripcion);

        antPer.otros == 1 ? $('#rdbOtrosAntePerSi').prop('checked', true) : $('#rdbOtrosAntePerNo').prop('checked', true);
        $("#txtOtrosPAntePer").val(antPer.otrosDescripcion);  
    },

    CargarAntecedentesObstetricos(antObst) {
        $("#txtGestasP").val(antObst.gestas);
        $("#txtAbortos").val(antObst.abortos);
        $("#txtVaginales").val(antObst.vaginales);
        $("#txtNacidosVivos").val(antObst.nacidosVivos);
        $("#txtViven").val(antObst.viven);
        $("#txtPartos").val(antObst.partos);
        $("#txtCesareas").val(antObst.cesareas);
        $("#txtNacMuertos").val(antObst.nacidosMuertos);
        $("#txt1Sem").val(antObst.muerto1Seman);
        $("#txtDesp1Sem").val(antObst.despues1Seman);
        $("#txtPesoPregesta").val(antObst.pesoPregestacional);
        $("#txtPreterminos").val(antObst.preterminos);
        $("#txtPreterminos").change();
        $("#txtEdadGestMasPrematuro").val(antObst.edadGestMasPrematuro);

        $("#txtPar1").val(antObst.p1);
        $("#txtPar2").val(antObst.p2);
        $("#txtPar3").val(antObst.p3);
        $("#txtPar4").val(antObst.p4);

        $('#cho3').prop('checked', antObst.ceromastres == 1 ? true : false);
        $('#ch2500').prop('checked', antObst.menor2500gr == 1 ? true : false);
        $('#chMult').prop('checked', antObst.multiple == 1 ? true : false);
        $('#ch37Sem').prop('checked', antObst.memor37sm == 1 ? true : false);
        $('#ch4000g').prop('checked', antObst.mayor4000g == 1 ? true : false);
        $('#chEtopico').prop('checked', antObst.embarazoEctopico == 1 ? true : false);

        if (antObst.fechaFinEmbAnt2 == '01/01/1900') {
            $("#txtFinEmb").val("");
        }
        else {
            $("#txtFinEmb").datepicker("setDate", antObst.fechaFinEmbarazoAntFormato);
        }

        $("#cboTerminacion").val(antObst.idTerminacion);
        $("#cboAborto").val(antObst.idAborto);
        $("#cbofracaso").val(antObst.fracasoMetodo);
        $("#cboEmbplaneado").val(antObst.embarazoPlaneado);
        $("#cboTerminacion").change();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CargarAntecedentesInfeccionesMaternas(antInfMat) {
        antInfMat.lues == 1 ? $('#rdbLuesAntePerSi').prop('checked', true) : $('#rdbLuesAntePerNo').prop('checked', true);
        $("#txtLuesAntePer").val(antInfMat.luesDescripcion);

        antInfMat.torch == 1 ? $('#rdbTorchAntePerSi').prop('checked', true) : $('#rdbTorchAntePerNo').prop('checked', true);
        $("#txtTorchAntePer").val(antInfMat.torchDescripcion);

        antInfMat.ituIIITrim == 1 ? $('#rdbITUtrimAntePerSi').prop('checked', true) : $('#rdbITUtrimAntePerNo').prop('checked', true);
        $("#txtITUtrimAntePer").val(antInfMat.ituIIITrimDescripcion);

        antInfMat.urocultivo == 1 ? $('#rdbUrocultivoAntePerSi').prop('checked', true) : $('#rdbUrocultivoAntePerNo').prop('checked', true);
        $("#txtUrocultivoAntePer").val(antInfMat.urocultivoDescripcion);

        antInfMat.germen == 1 ? $('#rdbGermenAntePerSi').prop('checked', true) : $('#rdbGermenAntePerNo').prop('checked', true);
        $("#txtGermenAntePer").val(antInfMat.germenDescripcion);

        antInfMat.covid == 1 ? $('#rdbCovidAntePerSi').prop('checked', true) : $('#rdbCovidAntePerNo').prop('checked', true);
        $("#txtCovidAntePer").val(antInfMat.covidDescripcion);

        antInfMat.dengue == 1 ? $('#rdbDengueAntePerSi').prop('checked', true) : $('#rdbDengueAntePerNo').prop('checked', true);
        $("#txtDengueAntePer").val(antInfMat.dengueDescripcion);

        antInfMat.otros == 1 ? $('#rdbOtrosInfeccionesAntePerSi').prop('checked', true) : $('#rdbOtrosInfeccionesAntePerNo').prop('checked', true);
        $("#txtOtrosInfeccionesAntePer").val(antInfMat.otrosDescripcion);
    },

    CargarAntecedentesEnfermedadesMaternas(antEnfMat) {
        antEnfMat.preEclampsia == 1 ? $('#rdbPreClampsiaAntePerSi').prop('checked', true) : $('#rdbPreClampsiaAntePerNo').prop('checked', true);
        $("#txtPreClampsiaAntePer").val(antEnfMat.preEclampsiaDescripcion);

        antEnfMat.eclampsia == 1 ? $('#rdbEclampsiaAntePerSi').prop('checked', true) : $('#rdbEclampsiaAntePerNo').prop('checked', true);
        $("#txtEclampsiaAntePer").val(antEnfMat.eclampsiaDescripcion);

        antEnfMat.htt == 1 ? $('#rdbHttAntePerSi').prop('checked', true) : $('#rdbHttAntePerNo').prop('checked', true);
        $("#txtHttAntePer").val(antEnfMat.httDescripcion);

        antEnfMat.desnutricion == 1 ? $('#rdbDesnutricionAntePerSi').prop('checked', true) : $('#rdbDesnutricionAntePerNo').prop('checked', true);
        $("#txtDesnutricionAntePer").val(antEnfMat.desnutricionDescripcion);

        antEnfMat.diabetesMellitus == 1 ? $('#rdbDiabetesMellitusAntePerSi').prop('checked', true) : $('#rdbDiabetesMellitusAntePerNo').prop('checked', true);
        $("#txtDiabetesMellitusAntePer").val(antEnfMat.diabetesMellitusDescripcion);

        antEnfMat.anemia == 1 ? $('#rdbAnemiaAntePerSi').prop('checked', true) : $('#rdbAnemiaAntePerNo').prop('checked', true);
        $("#txtAnemiaAntePer").val(antEnfMat.anemiaDescripcion);

        //antEnfMat.hepatitisB == true ? $('#rdbHepatitisBAntePerSi').prop('checked', true) : $('#rdbHepatitisBAntePerNo').prop('checked', true);
        //$("#txtHepatitisBAntePer").val(antEnfMat.hepatitisB);

        antEnfMat.hipoHipertiroides == 1 ? $('#rdbHipoHipertiroidesAntePerSi').prop('checked', true) : $('#rdbHipoHipertiroidesAntePerNo').prop('checked', true);
        $("#txtHipoHipertiroidesAntePer").val(antEnfMat.hipoHipertiroidesDescripcion);

        antEnfMat.otros == 1 ? $('#rdbOtrosEnfermedadesAntePerSi').prop('checked', true) : $('#rdbOtrosEnfermedadesAntePerNo').prop('checked', true);
        $("#txtOtrosEnfermedadesAntePer").val(antEnfMat.otrosDescripcion);
    },

    async CargarEvaluacionObstetrica(evaObst) {
        $("#txtFUM").val(evaObst.fechaURFormato);                   //ESTO PARA CONTROLAR EL EVENTO ANTES QUE SE DISPARE
        $("#txtFUM").datepicker("setDate", evaObst.fechaURFormato);
        //$("#txtFPP").val(obj.fechaPP);
        $("#txtFPP").datepicker("setDate", evaObst.fechaPPFormato);
        //$("#txtFEcog").val(obj.fechaEco);
        $("#txtFEcog").datepicker("setDate", evaObst.fechaEcoFormato);
        $("#txtSemanas").val(evaObst.edadGestacional);
        $("#txtDias").val(evaObst.diasGestacional);

        $("#txtCPNveces").val(evaObst.cnp);

        //Traigo la misma info porque ambas tiene q ser iguales
        //$("#txtFPPControl").val($("#txtFPP").val());
        $("#txtFPPControl").datepicker("setDate", $("#txtFPP").val());
        $("#txtSemanaGestacional").val($("#txtSemanas").val());
        $("#txtDiasGestacional").val($("#txtDias").val());

        if (evaObst.calculaFE == 1) {
            $('#chkCalculaFechaEco').prop('checked', true)
        }
        else {
            $('#chkCalculaFechaEco').prop('checked', false)
        }

        if (isEmpty(evaObst.fechaURFormato)) {
            if ($("#chkCalculaFechaEco").is(':checked')) {
                if (!isEmpty($("#txtFEcog").val())) {
                    await Antecedentes.CalcularEdadGestacional($("#txtFEcog").val(), 2, Variables.FechaIngreso);
                }
            }
            else {
                await Antecedentes.CalcularEdadGestacional($("#txtFUM").val(), 1, Variables.FechaIngreso);
            }
        }

        if (evaObst.fechaEcoAct == 1) {
            $('#chkMuestraEco').prop('checked', true)
            $("#txtFEcog").attr("disabled", false);
            $("#txtDiasEco").attr('disabled', false);
            $("#txtSemasEco").attr('disabled', false);

            $("#txtFUM").attr("disabled", true);
        }
        else {
            $('#chkMuestraEco').prop('checked', false)
            $("#txtFEcog").attr("disabled", true);
            $("#txtDiasEco").attr('disabled', true);
            $("#txtSemasEco").attr('disabled', true);

            $("#txtFUM").prop("disabled", false);
            $("#txtFEcog").val("");
        }

        if (evaObst.diasGestacionalEco == 0) {
            $("#txtDiasEco").val("");
        }
        else {
            $("#txtDiasEco").val(evaObst.diasGestacionalEco);
        }

        if (evaObst.semanaGestacionalEco == 0) {
            $("#txtSemasEco").val("");
        }
        else {
            $("#txtSemasEco").val(evaObst.semanaGestacionalEco);
        }
                
    },

    
    LimpiarRegistro() {

    },




}