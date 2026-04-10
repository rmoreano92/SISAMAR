let NotaIngreso = {
    eval: false,

    CargaInicial: () => {
        NotaIngreso.ListaTiposEmb()
    },

    ListaTiposEmb: () => {

        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListaTipoDeEmbarazo?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboTipoEmbrazo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoEmbrazo').append('<option  value="' + obj.id + '">' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tiposEmbarazo!", "2");
                }, 900)
            }
        });

    },
    ListaAtencionesDatosAdicionalesSeleccionarPorIdCuenta: function (idCuenta) {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuenta);

        fetch('/Atencion/AtencionesDatosAdicionalesSeleccionarPorIdCuenta?area=ConsultaExterna', {
            method: "POST",
            body: midata
        })
            .then(response => response.json())
            .then(response => {
                datosAdicionales = response.dataSet.table

                $('#txtApetitoIngreso').val(datosAdicionales[0].apetito)
                $('#txtSedIngreso').val(datosAdicionales[0].sed)
                $('#txtOrinaIngreso').val(datosAdicionales[0].orina)
                $('#txtDeposicionesIngreso').val(datosAdicionales[0].deposiciones)
                $('#txtSeunioIngreso').val(datosAdicionales[0].suenio)
            })
    },
    ListaEvaluacionesNeo: function (idAtencion) {
        Cargando(1);
        oTable_EvaHosp.fnClearTable();
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
                        oTable_EvaHosp.fnAddData(dataEvaluacionDetalle);
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
    ListaEvaluaciones: function () { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono

        Cargando(1)

        var objrow = oTable_atencionesHosp.api(true).row('.selected').data()
        var formData = new FormData()
        formData.append("idAtencion", objrow.idAtencion)
        formData.append("idNumero", $("#hdIdNumero").val())
        formData.append("idServicio", objrow.idServicioEgreso)
        $.ajax({
            method: "POST",
            url: "/NotaIngreso/ListaEvalEmergenciaEmeHospiTotalesByServicio?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                oTable_EvaHosp.fnClearTable()
                if (datos.session) {

                    if (datos.lstAtencionEvalEmergTotal.table.length > 0) {
                        //$('#divFirma .btn').css("display", 'block')
                        //$('#divFirma .btn').attr("disabled", false)
                        oTable_EvaHosp.fnAddData(datos.lstAtencionEvalEmergTotal.table)
                    }
                    else {
                        //alert(2);
                        NotaIngreso.LlenarRadioDefecto()
                        NotaIngreso.ListaEvalEmergencia(objrow.idAtencionEmeg_CE)
                        NotaIngreso.ListaGinecoObst(objrow.idAtencionEmeg_CE)
                        NotaIngreso.ListaNumeroAtencion()
                        Triaje.listaTriaje(objrow.idAtencionEmeg_CE)

                        //$('#divFirma .btn').css("display", 'none')
                        //$('#divFirma .btn').attr("disabled", true)
                    }
                }
                else {
                    Cargando(0)
                    location.reload()
                }


            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaEvalEmergenciaDetalleByServicioByNumero: function (IdAtencion, Servicio, Numero) {
        Cargando(1);

        var midata = new FormData();
        midata.append('IdAtencion', IdAtencion);
        midata.append('IdNumero', Numero);
        midata.append('idservicio', Servicio);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaEvaluacionEmergenciaDetalle?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.lst.table.length !== 0) {
                    $("#txtImpresion").val(datos.lst.table[0].indicaciones)
                    $("#txtPlan").val(datos.lst.table[0].plandeTrabajo)
                    $("#HoraInicioAtencion").val(datos.lst.table[0].horaInicioAtencion)
                }
                else {
                    $("#txtImpresion").val("");
                    $("#txtPlan").val("");
                    $('#HoraInicioAtencion').val("");
                    var dt = new Date();
                    var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())
                    $('#HoraInicioAtencion').val((datos.lst.table[0].horaInicioAtencion == "     " ? time : datos.lst.table[0].horaInicioAtencion)); // JDELGADO001.2

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaEvalEmergenciaByServicioByNumero: function (IdAtencion, Servicio, Numero) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', IdAtencion);
        midata.append('idNumero', Numero);
        midata.append('idServicio', Servicio);
        $.ajax({
            method: "POST",
            url: "/NotaIngreso/ListaEvalEmergenciaEmeHospi?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.lstAtencionEvalEmerg.table.length !== 0) {
                    $(datos.lstAtencionEvalEmerg.table).each(function (i, obj) {
                        $("#txtFUR").val(obj.fechaUR)
                        $("#txtFUE").val(obj.fechaEco)
                        $("#txtFPP").val(obj.fechaPP)
                        $("#txtEdadGestacional").val(obj.edadGestacional)
                        $("#txtSemasGestacional").val(obj.edadGestacional)
                        $("#txtDias").val(obj.diasGestacional)

                        //Traigo la misma info porque ambas tiene q ser iguales
                        $("#txtGestas").val(obj.gMotiA)
                        $("#txtPara").val(obj.pMotiA)
                        $("#txtAntecedentesMedicos").val(obj.antecedentes) // viene de antecedentes de eval emeregencia
                        $("#txtMotivoAtencion").val(obj.enfermedadA) // viene de antecedentes de eval emeregencia
                        $("#txtEdadGestacionalSemanas").val(obj.edadGestacional)
                        $("#txtEdadGestacionalDias").val(obj.diasGestacional)
                        $("#txtCpn").val(obj.cnp)
                        $("#txtPin").val(obj.pin)
                        $("#txtDeltaPeso").val(obj.deltaPeso)

                        obj.maduracionPulmonar == 1 ? $('#rdbPulmonarSI').prop('checked', true) : $('#rdbPulmonarNo').prop('checked', true)
                        obj.maduracionCervical == 1 ? $('#rdbCervicalSI').prop('checked', true) : $('#rdbCervicalNo').prop('checked', true)

                        $("#txtMadPulmonar").val(obj.maduracionPulmonarDesc)
                        $("#txtMadCervical").val(obj.maduracionCervicalDesc)

                        $("#txtAntecedentesMedicos").val(obj.antecedentes)
                        $("#txtRam").val(obj.ram)

                        obj.transfucionSangre == 1 ? $('#rdbTransfucionSI').prop('checked', true) : $('#rdbTransfucionNo').prop('checked', true)

                        $("#txtAntecedentesQuirurgico").val(obj.antecedentesQuirurgicos)

                        //--------------------------------------------------------------

                        $("#txtSignosSintomas").val(obj.sintomas)
                        $("#txtCU").val(obj.contraccionesUterinasDesc)
                        $("#txtPLA").val(obj.perdidaLiquidoAmnioticoDesc)
                        $("#txtMF").val(obj.movimientoFetalesDesc)
                        $("#txtSV").val(obj.sangradoVaginalDesc)
                        $("#txtFiebre").val(obj.fiebreDesc)
                        $("#txtSg").val(obj.sgIrritacionCorticalDesc)

                        $("#txtDescripcionExamenFisico").val(obj.descripcionExamenFisico) // JDELGADO001.2
                        $("#txtTratamiento").val(obj.tratamiento) // JDELGADO001.2

                        $("#txtApetitoReev").val(obj.apetito) // -C
                        $("#txtSedReev").val(obj.sed) // -C
                        $("#txtOrinaReev").val(obj.orina) // -C
                        $("#txtDeposicionesReev").val(obj.deposiciones) // -C
                        $("#txtSuenioReev").val(obj.suenio) // -C

                        obj.contraccionesU == 1 ? $('#rdbCuSI').prop('checked', true) : $('#rdbCuNo').prop('checked', true);
                        obj.perdidaLA == 1 ? $('#rdbPLASI').prop('checked', true) : $('#rdbPLANo').prop('checked', true);
                        obj.ausenciaMF == 1 ? $('#rdbMFSI').prop('checked', true) : $('#rdbMFNo').prop('checked', true);
                        obj.sangradoV == 1 ? $('#rdbSVSI').prop('checked', true) : $('#rdbSVNo').prop('checked', true);
                        obj.fiebre == 1 ? $('#rdbFiebreSI').prop('checked', true) : $('#rdbFiebreNo').prop('checked', true);
                        obj.transfucionSangre == 1 ? $('#rdbTransfucionSI').prop('checked', true) : $('#rdbTransfucionNo').prop('checked', true);
                        obj.sgIrritacionCortical == 1 ? $('#rdbSGSI').prop('checked', true) : $('#rdbSGNo').prop('checked', true);

                        if (obj.fechaEcoAct == 1) {
                            $('#chkFUE').prop('checked', true)
                        }
                        else {
                            $('#chkFUE').prop('checked', false)
                        }

                        if (obj.ultRegla == 1) {
                            $('#chkFUR').prop('checked', true)
                        }
                        else {
                            $('#chkFUR').prop('checked', false)
                        }

                        $('#chkFUE').change()
                        $('#chkFUR').change()
                    });
                }
                else {
                    $("#txtFUM").val("");
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaGinecoObstByServicioByNumero: function (IdAtencion, Servicio, Numero) {
        var midata = new FormData();
        midata.append('idAtencion', IdAtencion);
        midata.append('idNumero', Numero);
        midata.append('idServicio', Servicio);
        $.ajax({
            method: "POST",
            url: "/NotaIngreso/ListaGinecoObstetraEmeHospi?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                //datos.table[0].tbc

                if (datos.lstAtencionGinecoEmerg.table.length !== 0) {
                    //Respeta el orden al inicio de tipoEmb porque desencadenn bloqueos y cargas, simpre al inicio
                    $('#cboTipoEmbrazo').val(datos.lstAtencionGinecoEmerg.table[0].lTipoEmbarazo)
                    $('#cboTipoEmbrazo').change();
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //Fin

                    datos.lstAtencionGinecoEmerg.table[0].lGeBus == 1 ? $('#rdbGBNormal').prop('checked', true) : $('#rdbGBANormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lVagina == 1 ? $('#rdVaginadNormal').prop('checked', true) : $('#rdVaginaANormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lCervix == 1 ? $('#rdbCervixNormal').prop('checked', true) : $('#rdbCervixANormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lUtero == 1 ? $('#rdbUteroNormal').prop('checked', true) : $('#rdbUteroANormal').prop('checked', true)

                    $("#txtGB").val(datos.lstAtencionGinecoEmerg.table[0].dGeBus);
                    $("#txtVagina").val(datos.lstAtencionGinecoEmerg.table[0].dVagina);
                    $("#txtCervix").val(datos.lstAtencionGinecoEmerg.table[0].dCervix);
                    $("#txtUtero").val(datos.lstAtencionGinecoEmerg.table[0].dUtero);

                    datos.lstAtencionGinecoEmerg.table[0].lAnexos == 1 ? $('#rdbAnexosNormal').prop('checked', true) : $('#rdbAnexosANormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lDouglas == 1 ? $('#rdbFsDouglasNormal').prop('checked', true) : $('#rdbFsDouglasAnorNormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lParametros == 1 ? $('#rdbParamNormal').prop('checked', true) : $('#rdbParamAnorNormal').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lMamas == 1 ? $('#rdbMamasNormal').prop('checked', true) : $('#rdbMamasAnorNormal').prop('checked', true)

                    $("#txtAnexos").val(datos.lstAtencionGinecoEmerg.table[0].dAnexos);
                    $("#txtFsDouglas").val(datos.lstAtencionGinecoEmerg.table[0].dDouglas);
                    $("#txtParam").val(datos.lstAtencionGinecoEmerg.table[0].dParametros);
                    $("#txtMamas").val(datos.lstAtencionGinecoEmerg.table[0].dMamas);

                    $("#txtAlturaUterina").val(datos.lstAtencionGinecoEmerg.table[0].lua);
                    $("#txtLfc").val(datos.lstAtencionGinecoEmerg.table[0].llcf);
                    $("#txtDU").val(datos.lstAtencionGinecoEmerg.table[0].ldu);

                    //alert(datos.lstAtencionGinecoEmerg.table[0].lSituacion);
                    datos.lstAtencionGinecoEmerg.table[0].lSituacion == 1 ? $('#rdbSitLongitudinal').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lSituacion == 0 ? $('#rdbSitTransversal').prop('checked', true) : $('#rdbSitNinguno').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lPosicion == 1 ? $('#rdbPosDerecha').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lPosicion == 0 ? $('#rdbPosIzquierda').prop('checked', true) : $('#rdbPosNinguno').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lPresentacion == 1 ? $('#rdbPreCefalica').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lPresentacion == 0 ? $('#rdbPrePodalica').prop('checked', true) : $('#rdbPreNinguno').prop('checked', true);

                    datos.lstAtencionGinecoEmerg.table[0].lDips == 1 ? $('#rdbDipsI').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lDips == 2 ? $('#rdbDipsII').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lDips == 3 ? $('#rdbDipsIII').prop('checked', true) : $('#rdbDipsNA').prop('checked', true)

                    $("#txtMovFetales").val(datos.lstAtencionGinecoEmerg.table[0].movFetales);

                    $("#txtF1SiPoPr").val(datos.lstAtencionGinecoEmerg.table[0].dF1Spp);
                    $("#txtF2SiPoPr").val(datos.lstAtencionGinecoEmerg.table[0].dF2Spp);
                    $("#txtF3SiPoPr").val(datos.lstAtencionGinecoEmerg.table[0].dF3Spp);

                    if (datos.lstAtencionGinecoEmerg.table[0].lF1Lcf == 0) {
                        $("#txtF1Lfc").val("");
                    }
                    else {
                        $("#txtF1Lfc").val(datos.lstAtencionGinecoEmerg.table[0].lF1Lcf);
                    }

                    if (datos.lstAtencionGinecoEmerg.table[0].lF2Lcf == 0) {
                        $("#txtF2Lfc").val("");
                    }
                    else {
                        $("#txtF2Lfc").val(datos.lstAtencionGinecoEmerg.table[0].lF2Lcf);
                    }

                    if (datos.lstAtencionGinecoEmerg.table[0].lF3Lcf == 0) {
                        $("#txtF3Lfc").val("");
                    }
                    else {
                        $("#txtF3Lfc").val(datos.lstAtencionGinecoEmerg.table[0].lF3Lcf);
                    }

                    $("#txtF1Mf").val(datos.lstAtencionGinecoEmerg.table[0].mfF01);
                    $("#txtF2Mf").val(datos.lstAtencionGinecoEmerg.table[0].mfF02);
                    $("#txtF3Mf").val(datos.lstAtencionGinecoEmerg.table[0].mfF03);
                    $("#txtScoreFlam").val(datos.lstAtencionGinecoEmerg.table[0].scoreFlamm);
                    $("#txtBishop").val(datos.lstAtencionGinecoEmerg.table[0].bishop);
                    $("#txtObsObstetricas").val(datos.lstAtencionGinecoEmerg.table[0].dObservacionesObstetricas);

                    //....
                    $("#txtProteinuria").val(datos.lstAtencionGinecoEmerg.table[0].proteinura);
                    datos.lstAtencionGinecoEmerg.table[0].lSoplos == 1 ? $('#rdbSoplosSi').prop('checked', true) : $('#rdbSoplosNO').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lHidraminios == 1 ? $('#rdbHidromiosSi').prop('checked', true) : $('#rdbHidromiossNO').prop('checked', true);
                    $("#txtPonderado").val(datos.lstAtencionGinecoEmerg.table[0].lPonderado);

                    datos.lstAtencionGinecoEmerg.table[0].pap == true ? $('#rdbPapSi').prop('checked', true) : $('#rdbPapNo').prop('checked', true);

                    datos.lstAtencionGinecoEmerg.table[0].lEstadoGeneral == 1 ? $('#rdbEstGSNormal').prop('checked', true) : $('#rdbEstGSANormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lAparatoCV == 1 ? $('#rdbCardNormal').prop('checked', true) : $('#rdbCardANormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lAbdomen == 1 ? $('#rdbAbdomenNormal').prop('checked', true) : $('#rdbAbdomenANormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lAparatoR == 1 ? $('#rdbAptRespNormal').prop('checked', true) : $('#rdbAptRespnANormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lAparatoU == 1 ? $('#rdbAptUrinpNormal').prop('checked', true) : $('#rdbAptUrinpAnorNormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lExtremidades == 1 ? $('#rdbExtremNormal').prop('checked', true) : $('#rdbExtremAnorNormal').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lNeurologico == 1 ? $('#rdbNeuroNormal').prop('checked', true) : $('#rdbNeuroAnorNormal').prop('checked', true); // JDELGADO001.2

                    $("#txtNeuro").val(datos.lstAtencionGinecoEmerg.table[0].DNeurologico);
                    $("#txtEstdGeneSens").val(datos.lstAtencionGinecoEmerg.table[0].dEstadoGeneral);
                    $("#txtCardvas").val(datos.lstAtencionGinecoEmerg.table[0].dAparatoCV);
                    $("#txtAbdomenNormal").val(datos.lstAtencionGinecoEmerg.table[0].dAbdomen);
                    $("#txtbAptResp").val(datos.lstAtencionGinecoEmerg.table[0].dAparatoR);
                    $("#txtbAptUrin").val(datos.lstAtencionGinecoEmerg.table[0].dAparatoU);
                    $("#txtExtrem").val(datos.lstAtencionGinecoEmerg.table[0].dExtremidades);

                    $("#txtEdemas").val(datos.lstAtencionGinecoEmerg.table[0].dEdemas);
                    $("#txtReflejos").val(datos.lstAtencionGinecoEmerg.table[0].dReflejos);

                    $("#txtObserExamenes").val(datos.lstAtencionGinecoEmerg.table[0].observacionGinecologica);
                    $("#txtObserControl").val(datos.lstAtencionGinecoEmerg.table[0].dObservaciones);

                    $("#txtNroFetos").val(datos.lstAtencionGinecoEmerg.table[0].nroFetos);

                    $("#txtsignosAlarma").val(datos.lstAtencionGinecoEmerg.table[0].signosAlarma);

                    //PELVIS
                    datos.lstAtencionGinecoEmerg.table[0].lCompatibilidadF == 1 ? $('#rdbCompativilidadSI').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lCompatibilidadF == 2 ? $('#rdbCompativilidadNo').prop('checked', true) : $('#rdbCompativilidadDudosa').prop('checked', true)
                    datos.lstAtencionGinecoEmerg.table[0].lPelvisGinecoide == 1 ? $('#rdbPelvisGSI').prop('checked', true) : $('#rdbPelvisGNo').prop('checked', true);

                    $('#txtObsObstetricas').val(datos.lstAtencionGinecoEmerg.table[0].dObservacionesObstetricas);

                    if (datos.lstAtencionGinecoEmerg.table[0].lTipoTactoVaginal == 1) {
                        NotaIngreso.TactoVaginalBloqueaLimpia(2);
                        NotaIngreso.LiquidoAmniotico(2);
                        $('#rdbTactoVaginalSi').prop('checked', true);
                    }
                    else {
                        NotaIngreso.TactoVaginalBloqueaLimpia(1);
                        NotaIngreso.LiquidoAmniotico(1);
                        $('#rdbTactoVaginalDiferido').prop('checked', true);
                    }
                    $('#txtDilatacion').val(datos.lstAtencionGinecoEmerg.table[0].lDilatacion);
                    $('#txtIncorporacion').val(datos.lstAtencionGinecoEmerg.table[0].lIncorporacion);
                    $('#txtAlPresent').val(datos.lstAtencionGinecoEmerg.table[0].lAlPresent);
                    $('#txtVariedPresent').val(datos.lstAtencionGinecoEmerg.table[0].dVarPresent);

                    datos.lstAtencionGinecoEmerg.table[0].membranasRotas == 1 ? $('#rdbMenranasSi').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].membranasRotas == 0 ? $('#rdbMenranasNo').prop('checked', true) : "";
                    datos.lstAtencionGinecoEmerg.table[0].lProcubito == 1 ? $('#rdbProcubitoSi').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lProcubito == 0 ? $('#rdbProcubitoNo').prop('checked', true) : "";
                    datos.lstAtencionGinecoEmerg.table[0].lProlapso == 1 ? $('#rdbProlapsoSi').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lProlapso == 0 ? $('#rdbProlapsoNo').prop('checked', true) : "";
                    datos.lstAtencionGinecoEmerg.table[0].dSangradoV == "SI" ? $('#rdbSangradoVSi').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].dSangradoV == "NO" ? $('#rdbSangradoVNo').prop('checked', true) : "";

                    datos.lstAtencionGinecoEmerg.table[0].lLiquidoA == 1 ? $('#rdbLiqAmnClaro').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lLiquidoA == 2 ? $('#rdbMenranasMeconial').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lLiquidoA == 3 ? $('#rdbLiqAmnSanguinolento').prop('checked', true) : 0

                    datos.lstAtencionGinecoEmerg.table[0].malOlor == 1 ? $('#rdbMalOlorSi').prop('checked', true) : $('#rdbMalOlorNo').prop('checked', true);

                    datos.lstAtencionGinecoEmerg.table[0].lCompatibilidadF == 1 ? $('#rdbCompitivilidadSi').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lCompatibilidadF == 2 ? $('#rdbCompitivilidadNo').prop('checked', true) : datos.lstAtencionGinecoEmerg.table[0].lCompatibilidadF == 3 ? $('#rdbCompitivilidadDusosa').prop('checked', true) : 0

                    datos.lstAtencionGinecoEmerg.table[0].lPelvimetriaInf == 1 ? $('#rdbInferiorSi').prop('checked', true) : $('#rdbInferiorNo').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lPelvimetriaMed == 1 ? $('#rdbMedioSi').prop('checked', true) : $('#rdbMedioNo').prop('checked', true);
                    datos.lstAtencionGinecoEmerg.table[0].lPelvimetriaSup == 1 ? $('#rdbSuperiorSi').prop('checked', true) : $('#rdbSuperiorNo').prop('checked', true);

                    datos.lstAtencionGinecoEmerg.table[0].lPelvisGinecoide == 1 ? $('#rdbPelvisGinecoideSi').prop('checked', true) : $('#rdbPelvisGinecoideNo').prop('checked', true);

                    $('#txtObservacionesPelvisGinecoide').val(datos.lstAtencionGinecoEmerg.table[0].pelvisGineDesc);
                    $('#txtObservacionesTactoVaginal').val(datos.lstAtencionGinecoEmerg.table[0].dObservaciones);

                }


            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListaRecetas: function (idCuentaAtencion, idTipoFuenteFinan, nroEvaluacion, idServicio, idMedico) {

        console.log("idTipoFuenteFinan", idTipoFuenteFinan)

        Ordenes.limpiarCatalogo();
        //Ordenes.listaRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
        Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(idCuentaAtencion, idTipoFuenteFinan, nroEvaluacion, idServicio, idMedico)

    },


    AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso: function (idAtencion, idNumero, idServicio) { // JDELGADO003-C

        Diagnosticos.LimpiarDiagnosticosAtencion();

        var midata = new FormData();
        midata.append('idNumero', idNumero);
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);

        $.ajax({

            method: "POST",
            url: "/Hospitalizacion/web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                if (datos.lsAtencionsCE.table.length !== 0) {
                    if (!isEmpty(datos.lsAtencionsCE.table)) {
                        Diagnosticos.ListaDiagnosticosAtencion(datos.lsAtencionsCE.table);
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

    ListaNumeroAtencion: function () {
        var objrow = oTable_atencionesHosp.api(true).row('.selected').data();
        var formData = new FormData();
        formData.append("idAtencion", objrow.idAtencion);
        formData.append("idNumero", $("#hdIdNumero").val());
        formData.append("idServicio", objrow.idServicioEgreso);

        $.ajax({
            method: "POST",
            url: "/NotaIngreso/listaCantidadAtencionNotaIngresoEmgHos?area=Hospitalizacion",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.lstNroAtencion.table.length > 0) {

                    $("#hdIdNumero").val(datos.lstNroAtencion.table[0].idNumero);
                    $("#hdIdNumeroSiguiente").val(datos.lstNroAtencion.table[0].idNumeroSig);

                    if (datos.lstNroAtencion.table[0].idNumero == 0) {
                        swal({
                            title: 'Atenciones',
                            text: "Paciente iniciara su primera atencion en el servicio, se cargaran datos de la cuenta de emergencia",
                            type: 'info',
                        }).done();
                        $('#lblNroAtencion').html("Atencion Nro: 1")
                        $('#lblNumeroEvaluacion').html("Evaluación N° 1")
                    }
                    else {
                        $('#lblNroAtencion').html("Atencion Nro: " + datos.lstNroAtencion.table[0].idNumeroSig)
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaEvalEmergencia: function (IdAtencion) {
        var midata = new FormData();
        midata.append('IdAtencion', IdAtencion);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaEvaluacionEmergencia?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                if (datos.table.length !== 0) {
                    $(datos.table).each(function (i, obj) {
                        $("#txtFUR").val(obj.fechaUR);
                        $("#txtFUE").val(obj.fechaEco);
                        $("#txtFPP").val(obj.fechaPP);
                        $("#txtEdadGestacional").val(obj.edadGestacional);
                        $("#txtSemasGestacional").val(obj.edadGestacional);
                        $("#txtDias").val(obj.diasGestacional);

                        //Traigo la misma info porque ambas tiene q ser iguales
                        $("#txtGestas").val(obj.gMotiA);
                        $("#txtPara").val(obj.pMotiA);
                        $("#txtAntecedentesMedicos").val(obj.antecedentes); // viene de antecedentes de eval emeregencia
                        $("#txtMotivoAtencion").val(obj.enfermedadA); // viene de antecedentes de eval emeregencia

                        if (obj.fechaEcoAct == 1) {
                            $('#chkMuestraEco').prop('checked', true)
                        }
                        else {
                            $('#chkMuestraEco').prop('checked', false)
                        }

                        if (obj.ultmRegla == 1) {
                            $('#chkFUR').prop('checked', true)

                        }
                        else {
                            $('#chkFUR').prop('checked', false)

                        }

                        $('#chkFUE').change();
                        $('#chkFUR').change();

                    });
                }
                else {
                    $("#txtFUM").val("");
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaGinecoObst: function (IdAtencion) {
        var midata = new FormData();
        midata.append('IdAtencion', IdAtencion);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaGinecoObstetra?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                //datos.table[0].tbc

                if (datos.table.length !== 0) {
                    //Respeta el orden al inicio de tipoEmb porque desencadenn bloqueos y cargas, simpre al inicio
                    $('#cboTipoEmbrazo').val(datos.table[0].lTipoEmbarazo)
                    $('#cboTipoEmbrazo').change();
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //Fin

                    datos.table[0].lGeBus == 1 ? $('#rdbGBNormal').prop('checked', true) : $('#rdbGBANormal').prop('checked', true)
                    datos.table[0].lVagina == 1 ? $('#rdVaginadNormal').prop('checked', true) : $('#rdVaginaANormal').prop('checked', true)
                    datos.table[0].lCervix == 1 ? $('#rdbCervixNormal').prop('checked', true) : $('#rdbCervixANormal').prop('checked', true)
                    datos.table[0].lUtero == 1 ? $('#rdbUteroNormal').prop('checked', true) : $('#rdbUteroANormal').prop('checked', true)

                    $("#txtGB").val(datos.table[0].dGeBus);
                    $("#txtVagina").val(datos.table[0].dVagina);
                    $("#txtCervix").val(datos.table[0].dCervix);
                    $("#txtUtero").val(datos.table[0].dUtero);

                    datos.table[0].lAnexos == 1 ? $('#rdbAnexosNormal').prop('checked', true) : $('#rdbAnexosANormal').prop('checked', true)
                    datos.table[0].lDouglas == 1 ? $('#rdbFsDouglasNormal').prop('checked', true) : $('#rdbFsDouglasAnorNormal').prop('checked', true)
                    datos.table[0].lParametros == 1 ? $('#rdbParamNormal').prop('checked', true) : $('#rdbParamAnorNormal').prop('checked', true)
                    datos.table[0].lMamas == 1 ? $('#rdbMamasNormal').prop('checked', true) : $('#rdbMamasAnorNormal').prop('checked', true)

                    $("#txtAnexos").val(datos.table[0].dAnexos);
                    $("#txtFsDouglas").val(datos.table[0].dDouglas);
                    $("#txtParam").val(datos.table[0].dParametros);
                    $("#txtMamas").val(datos.table[0].dMamas);

                    $("#txtAlturaUterina").val(datos.table[0].lua);
                    $("#txtLfc").val(datos.table[0].llcf);
                    $("#txtDU").val(datos.table[0].ldu);

                    //alert(datos.table[0].lSituacion);
                    datos.table[0].lSituacion == 1 ? $('#rdbSitLongitudinal').prop('checked', true) : datos.table[0].lSituacion == 0 ? $('#rdbSitTransversal').prop('checked', true) : $('#rdbSitNinguno').prop('checked', true)
                    datos.table[0].lPosicion == 1 ? $('#rdbPosDerecha').prop('checked', true) : datos.table[0].lPosicion == 0 ? $('#rdbPosIzquierda').prop('checked', true) : $('#rdbPosNinguno').prop('checked', true)
                    datos.table[0].lPresentacion == 1 ? $('#rdbPreCefalica').prop('checked', true) : datos.table[0].lPresentacion == 0 ? $('#rdbPrePodalica').prop('checked', true) : $('#rdbPreNinguno').prop('checked', true);

                    datos.table[0].lDips == 1 ? $('#rdbDipsI').prop('checked', true) : datos.table[0].lDips == 2 ? $('#rdbDipsII').prop('checked', true) : datos.table[0].lDips == 3 ? $('#rdbDipsIII').prop('checked', true) : $('#rdbDipsNA').prop('checked', true)

                    $("#txtMovFetales").val(datos.table[0].movFetales);

                    $("#txtF1SiPoPr").val(datos.table[0].dF1Spp);
                    $("#txtF2SiPoPr").val(datos.table[0].dF2Spp);
                    $("#txtF3SiPoPr").val(datos.table[0].dF3Spp);

                    if (datos.table[0].lF1Lcf == 0) {
                        $("#txtF1Lfc").val("");
                    }
                    else {
                        $("#txtF1Lfc").val(datos.table[0].lF1Lcf);
                    }

                    if (datos.table[0].lF2Lcf == 0) {
                        $("#txtF2Lfc").val("");
                    }
                    else {
                        $("#txtF2Lfc").val(datos.table[0].lF2Lcf);
                    }

                    if (datos.table[0].lF3Lcf == 0) {
                        $("#txtF3Lfc").val("");
                    }
                    else {
                        $("#txtF3Lfc").val(datos.table[0].lF3Lcf);
                    }



                    $("#txtF1Mf").val(datos.table[0].mfF01);
                    $("#txtF2Mf").val(datos.table[0].mfF02);
                    $("#txtF3Mf").val(datos.table[0].mfF03);
                    //....
                    $("#txtProteinuria").val(datos.table[0].proteinura);
                    datos.table[0].lSoplos == 1 ? $('#rdbSoplosSi').prop('checked', true) : $('#rdbSoplosNO').prop('checked', true);
                    datos.table[0].lHidraminios == 1 ? $('#rdbHidromiosSi').prop('checked', true) : $('#rdbHidromiossNO').prop('checked', true);
                    $("#txtPonderado").val(datos.table[0].lPonderado);

                    datos.table[0].pap == true ? $('#rdbPapSi').prop('checked', true) : $('#rdbPapNo').prop('checked', true);

                    datos.table[0].lEstadoGeneral == 1 ? $('#rdbEstGSNormal').prop('checked', true) : $('#rdbEstGSANormal').prop('checked', true);
                    datos.table[0].lAparatoCV == 1 ? $('#rdbCardNormal').prop('checked', true) : $('#rdbCardANormal').prop('checked', true);
                    datos.table[0].lAbdomen == 1 ? $('#rdbAbdomenNormal').prop('checked', true) : $('#rdbAbdomenANormal').prop('checked', true);
                    datos.table[0].lAparatoR == 1 ? $('#rdbAptRespNormal').prop('checked', true) : $('#rdbAptRespnANormal').prop('checked', true);
                    datos.table[0].lAparatoU == 1 ? $('#rdbAptUrinpNormal').prop('checked', true) : $('#rdbAptUrinpAnorNormal').prop('checked', true);
                    datos.table[0].lExtremidades == 1 ? $('#rdbExtremNormal').prop('checked', true) : $('#rdbExtremAnorNormal').prop('checked', true);

                    $("#txtEstdGeneSens").val(datos.table[0].dEstadoGeneral);
                    $("#txtCardvas").val(datos.table[0].dAparatoCV);
                    $("#txtAbdomenNormal").val(datos.table[0].dAbdomen);
                    $("#txtbAptResp").val(datos.table[0].dAparatoR);
                    $("#txtbAptUrin").val(datos.table[0].dAparatoU);
                    $("#txtExtrem").val(datos.table[0].dExtremidades);

                    $("#txtEdemas").val(datos.table[0].dEdemas);
                    $("#txtReflejos").val(datos.table[0].dReflejos);

                    $("#txtObserExamenes").val(datos.table[0].observacionGinecologica);
                    $("#txtObserControl").val(datos.table[0].dObservaciones);

                    $("#txtNroFetos").val(datos.table[0].nroFetos);

                    $("#txtsignosAlarma").val(datos.table[0].signosAlarma);

                    //PELVIS
                    datos.table[0].lCompatibilidadF == 1 ? $('#rdbCompativilidadSI').prop('checked', true) : datos.table[0].lCompatibilidadF == 2 ? $('#rdbCompativilidadNo').prop('checked', true) : $('#rdbCompativilidadDudosa').prop('checked', true)
                    datos.table[0].lPelvisGinecoide == 1 ? $('#rdbPelvisGSI').prop('checked', true) : $('#rdbPelvisGNo').prop('checked', true);

                    $('#txtObsObstetricas').val(datos.table[0].dObservacionesObstetricas);
                    if (datos.table[0].lTipoTactoVaginal == 1) {
                        NotaIngreso.TactoVaginalBloqueaLimpia(2);
                        $('#rdbTactoVaginalSi').prop('checked', true);
                    }
                    else {
                        NotaIngreso.TactoVaginalBloqueaLimpia(1);
                        $('#rdbTactoVaginalDiferido').prop('checked', true);
                    }
                    $('#txtDilatacion').val(datos.table[0].lDilatacion);
                    $('#txtIncorporacion').val(datos.table[0].lIncorporacion);
                    $('#txtAlPresent').val(datos.table[0].lAlPresent);
                    $('#txtVariedPresent').val(datos.table[0].dVarPresent);

                    datos.table[0].membranasRotas == 1 ? $('#rdbMenranasSi').prop('checked', true) : datos.table[0].membranasRotas == 0 ? $('#rdbMenranasNo').prop('checked', true) : "";
                    datos.table[0].lProcubito == 1 ? $('#rdbProcubitoSi').prop('checked', true) : datos.table[0].lProcubito == 0 ? $('#rdbProcubitoNo').prop('checked', true) : "";
                    datos.table[0].lProlapso == 1 ? $('#rdbProlapsoSi').prop('checked', true) : datos.table[0].lProlapso == 0 ? $('#rdbProlapsoNo').prop('checked', true) : "";
                    datos.table[0].dSangradoV == "SI" ? $('#rdbSangradoVSi').prop('checked', true) : datos.table[0].dSangradoV == "NO" ? $('#rdbSangradoVNo').prop('checked', true) : "";

                    datos.table[0].lLiquidoA == 1 ? $('#rdbLiqAmnClaro').prop('checked', true) : datos.table[0].lSituacion == 2 ? $('#rdbMenranasMeconial').prop('checked', true) : datos.table[0].lSituacion == 3 ? $('#rdbLiqAmnSanguinolento').prop('checked', true) : 0

                    datos.table[0].malOlor == 1 ? $('#rdbMalOlorSi').prop('checked', true) : $('#rdbMalOlorNo').prop('checked', true);

                    datos.table[0].lCompatibilidadF == 1 ? $('#rdbCompitivilidadSi').prop('checked', true) : datos.table[0].lCompatibilidadF == 2 ? $('#rdbCompitivilidadNo').prop('checked', true) : datos.table[0].lCompatibilidadF == 3 ? $('#rdbCompitivilidadDusosa').prop('checked', true) : 0

                    datos.table[0].lPelvimetriaInf == 1 ? $('#rdbInferiorSi').prop('checked', true) : $('#rdbInferiorNo').prop('checked', true);
                    datos.table[0].lPelvimetriaMed == 1 ? $('#rdbMedioSi').prop('checked', true) : $('#rdbMedioNo').prop('checked', true);
                    datos.table[0].lPelvimetriaSup == 1 ? $('#rdbSuperiorSi').prop('checked', true) : $('#rdbSuperiorNo').prop('checked', true);

                    datos.table[0].LPelvisGinecoide == 1 ? $('#rdbPelvisGinecoideSi').prop('checked', true) : $('#rdbPelvisGinecoideNo').prop('checked', true);

                    $('#txtObservacionesPelvisGinecoide').val(datos.table[0].pelvisGineDesc);
                    $('#txtObservacionesTactoVaginal').val(datos.table[0].dObservaciones);

                    if (datos.table[0].lTipoTactoVaginal == 1) {
                        $('#rdbTactoVaginalSi').prop('checked', true);
                    }
                    else {
                        $('#rdbTactoVaginalDiferido').prop('checked', true);
                    }

                }


            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },


    CargarDatosEvaluacionNeo: function () {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data()

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno)
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno)
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica)
        $("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica)
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento)
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento)
        $("#txtEdadAnio").val(objrowTb.edadEnAnio)
        $("#txtEdadMes").val(objrowTb.edadEnMes)
        $("#txtEdadDia").val(objrowTb.edadEnDia)
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion)
        $("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrowTb.idCuentaAtencion)
        $("#txtNroAtencion").val(objrowTb.idAtencion)
        $("#cboTipoPaciente").val(objrowTb.idTipoPaciente)
        $("#cboOrigenPaciente").val(objrowTb.idOrigenAtencion)
        $("#cboPrioridad").val(objrowTb.idTipoGravedad)
        $("#hdIdTipoFuenteFian").val(objrowTb.idFuenteFinanciamiento)
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion)
        $('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso)
        IdCuentaAtencionTemp = objrowTb.idCuentaAtencion       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        Triaje.listaTriajeEmgHosp(objrowTb.idAtencion, objrowTb.idServicioEgreso, 0)

        var EvaNeo = EvaluacionEmergencia.SeleccionarEvaluacionNeonatal(objrowTb.idAtencion)
        //var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(objrowTb.idAtencion)
        var ExaFisNeo = EvaluacionEmergencia.SeleccionarExamenFisicoNeonatal(objrowTb.idAtencion)
        var EvaAnte = EvaluacionEmergencia.SeleccionarAntecedentes(objrowTb.idAtencion)

        //----------------------EVALUACION NEONATAL-----------------------//
        $('#txtGlasgow').val(EvaNeo.glasgow)

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
    CargarDatosEvaluacionHospi: function (idAtencion, idServicioEgreso, idNumero) {
        NotaIngreso.ListaEvalEmergenciaByServicioByNumero(idAtencion, idServicioEgreso, idNumero)
        NotaIngreso.ListaGinecoObstByServicioByNumero(idAtencion, idServicioEgreso, idNumero)
    },

    HabilitarNuevaEvaluacion: function () {
        Cargando(1);

        var objrow = oTable_atencionesEmer.api(true).row('.selected').data() // JDELGADO005
        var eval = oTable_EvaHosp.DataTable().data().count();

        if (eval == 0) {
            this.eval = true
        } else {
            this.eval = false
        }

        Diagnosticos.LimpiarDiagnosticosAtencion()
        //if ((eval + 1) == 1) {
        //    desbloquearCampos()
        //} else {
        //    bloquearCampos()
        //}

        asigna_FechaHoraAtencion(null)

        $('.div_bloquea').hide()

        Ordenes.limpiarCatalogoV2();

        $("#lblNumeroEvaluacion").html("")
        $("#lblTipoEvaluacion").html("")
        $('#tblEvaluaciones tbody').find('tr').removeClass("selected")

        $("#CardEvaNeo").removeClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline").removeClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-info");
        $("#CardEvaNeo").addClass("bg-blue");
        //$("#BadgeEvaluacion .msc-hotline").addClass("bg-green");
        $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
        $("#CardEvaNeo").addClass("bg-blue");

        $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
        $("#lblTipoEvaluacion").html("Nueva Evaluación");

        $("#evaluaciones-tab").click();
        $("#diagnosticos-tab-link").click();

        $('#txtImpresion').val("");
        $('#txtTratamiento').val("");
        $('#txtPlan').val("");
        $('#txtApetitoReev').val("");
        $('#txtSedReev').val("");
        $('#txtOrinaReev').val("");
        $('#txtDeposicionesReev').val("");
        $('#txtSuenioReev').val("");


        $('#hdNroEvaluacion').val(eval + 1)

        nuevaEvalNeo = true

        swal({
            title: 'Evaluaciones',
            text: "Paciente iniciara la Evaluación N° " + (eval + 1),
            type: 'info',
        }).done()

        //if (!esNeo) {

        //    ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento, (eval + 1), 0, 0) // JDELGADO005

        //    $('#HoraInicioAtencion').val("");

        //} else {

        //    //console.log("MEDICOOO: " + Ordenes.ObtenerIdMedicoSesion());
        //    //Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());

        //    $("#evaluaciones .entrada").removeAttr("disabled");
        //    $(".OpcionesCPT").show();
        //    $(".OpcionesOrdenes").show();
        //    $(".OpcionesDiagnosticos").show();
        //    $("#FirmarEvalNeo").show();
        //    $("#btnGuardarEvaNeo").show();

        //    modificaEvalNeo = false;
        //    //console.log("Entro Habilitar Evaluaciones");
        //    //console.log("Evaluacion Nueva N° " + (eval+1));
        //}

        //console.log("Entro Habilitar Evaluaciones");
        //console.log("Evaluacion Nueva N° " + (eval+1));
        Cargando(0);
    },

    LlenarRadioDefecto: function () {
        $("#txtMotivoAtencion").val("");
        $("#txtSignosSintomas").val("");
        $("#txtCU").val("");
        $("#txtPLA").val("");
        $("#txtMF").val("");
        $("#txtSV").val("");
        $("#txtFiebre").val("");
        $("#txtSg").val("");

        $('#rdbCuNo').prop('checked', true);
        $('#rdbPLA').prop('checked', true);
        $('#rdbMF').prop('checked', true);
        $('#rdbSVNo').prop('checked', true);
        $('#rdbFiebreNo').prop('checked', true);
        $('#rdbSGNo').prop('checked', true);

        $("#txtCpn").val("");
        $("#txtGestas").val("");
        $("#txtPara").val("");


        $("#txtMadPulmonar").val();
        $("#txtMadCervical").val();

        $("#txtPin").val("");
        $("#txtDeltaPeso").val("");

        $('#rdbPulmonarNo').prop('checked', true);
        $('#rdbCervical').prop('checked', true);
        $('#rdbTransfucionNo').prop('checked', true);

        $("#txtAntecedentesMedicos").val("");
        $("#txtRam").val("");
        $("#txtAntecedentesQuirurgico").val("");

        $("#txtScoreFlam").val("");
        $("#txtBishop").val("");
        $("#txtObsObstetricas").val("");

        $("#txtImpresion").val("");
        $("#txtPlan").val("");

        $('#rdbTbcNo').prop('checked', true);
        $('#rdbDiabNo').prop('checked', true)
        $('#rdbHiperNo').prop('checked', true)
        $('#rdbPreeNo').prop('checked', true)
        $('#rdbOtrosNo').prop('checked', true)

        $('#rdbTbcPNo').prop('checked', true)
        $('#rdbPDiabNo').prop('checked', true)
        $('#rdbHiperPNo').prop('checked', true)
        $('#rdbPreePNo').prop('checked', true)
        $('#rdbVIHNo').prop('checked', true)
        $('#rdbAlergNo').prop('checked', true)
        $('#rdbCMNo').prop('checked', true)
        $('#rdbVioNo').prop('checked', true)
        $('#rdbOtrosAntePerNO').prop('checked', true)


        //----------------------------------------

        $('#rdbEstGSNormal').prop('checked', true)
        $('#rdbCardNormal').prop('checked', true)
        $('#rdbAbdomenNormal').prop('checked', true)
        $('#rdbAptRespNormal').prop('checked', true)
        $('#rdbAptUrinpNormal').prop('checked', true)

        $('#rdbGBNormal').prop('checked', true)
        $('#rdVaginadNormal').prop('checked', true)
        $('#rdbCervixNormal').prop('checked', true)
        $('#rdbUteroNormal').prop('checked', true)

        $('#rdbAnexosNormal').prop('checked', true)
        $('#rdbFsDouglasNormal').prop('checked', true)
        $('#rdbParamNormal').prop('checked', true)
        $('#rdbMamasNormal').prop('checked', true)
        $('#rdbExtremNormal').prop('checked', true)
        $('#rdbPapNo').prop('checked', true)

        /*******CONTROL DATOS BASALES*******/

        $('#rdbSitNinguno').prop('checked', true)
        $('#rdbPosNinguno').prop('checked', true)
        $('#rdbPreNinguno').prop('checked', true)
        $('#rdbDipsNA').prop('checked', true)

        $('#rdbSoplosNO').prop('checked', true)
        $('#rdbHidromiossNO').prop('checked', true)

        $("#txtEstdGeneSens").val("");
        $("#txtCardvas").val("");
        $("#txtAbdomenNormal").val("");
        $("#txtbAptResp").val("");
        $("#txtbAptUrin").val("");
        $("#txtExtrem").val("");
        $("#txtNeuro").val("");
        $("#txtEdemas").val("");
        $("#txtReflejos").val("");

        $("#txtGB").val("");
        $("#txtVagina").val("");
        $("#txtCervix").val("");
        $("#txtUtero").val("");

        $("#txtAnexos").val("");
        $("#txtFsDouglas").val("");
        $("#txtParam").val("");
        $("#txtMamas").val("");

        $("#txtObserExamenes").val("");
        $("#txtObserControl").val("");

        $("#txtsignosAlarma").val("");

        $("#txtAlturaUterina").val("");
        $("#txtLfc").val("");
        $("#txtDU").val("");

        $("#txtMovFetales").val("");
        $("#txtF1SiPoPr").val("");
        $("#txtF2SiPoPr").val("");
        $("#txtF3SiPoPr").val("");
        $("#txtF1Lfc").val("");
        $("#txtF2Lfc").val("");
        $("#txtF3Lfc").val("");
        $("#txtF1Mf").val("");
        $("#txtF2Mf").val("");
        $("#txtF3Mf").val("");

        $("#txtProteinuria").val("");
        $("#txtPonderado").val("");

        $("#txtFUM").val("");
        $("#txtFUM").attr('disabled', false);

        $("#txtFPP").val("");
        $("#txtFEcog").val("");
        $("#txtSemanas").val("");
        $("#txtDias").val("");

        //Traigo la misma info porque ambas tiene q ser iguales
        $("#txtFPPControl").val("");
        $("#txtSemanaGestacional").val("");
        $("#txtDiasGestacional").val("");

        $("#txtTbc").val("");
        $("#txtDiabe").val("");
        $("#txtPree").val("");
        $("#txtHiper").val("");
        $("#txtOtrosFam").val("");

        $("#txtTbcP").val("");


        $("#txtPDiabe").val("");
        $("#txtPreeP").val("");
        $("#txtVihP").val("");
        $("#txtAlergiaP").val("");
        $("#txtOtrosP").val("");
        $("#txtCM").val("");
        $("#txtVio").val("");
        $("#txtHiperP").val("");

        $("#txtGestasP").val("");
        $("#txtAbortos").val("");
        $("#txtVaginales").val("");
        $("#txtNacidosVivos").val("");
        $("#txtViven").val("");
        $("#txtPartos").val("");
        $("#txtCesareas").val("");
        $("#txtNacMuertos").val("");
        $("#txt1Sem").val("");
        $("#txtDesp1Sem").val("");

        $("#txtFinEmb").val("");
        $("#txtPesoPregesta").val("");

        $('#chkCalculaFechaEco').prop('checked', false)

        $('#chEtopico').prop('checked', false)

        $('#rdbVacunaPreNo').prop('checked', true);
        $("#txtVacunaPre").val("");

        //inicio valores de tipo de embarazo
        $("#cboTipoEmbrazo").change();
        $("#txtNroFetos").val("");

        //inicio valores de terminacion
        $("#cboTerminacion").val(139);
        $("#cboTerminacion").change();

        //Inicio valores de eco
        $("#chkMuestraEco").prop('checked', false);
        $("#chkMuestraEco").attr('disabled', false);
        $("#txtFEcog").prop("disabled", true);
        $("#txtDiasEco").attr('disabled', true);
        $("#txtSemasEco").attr('disabled', true);
        $("#txtDiasEco").val("");
        $("#txtSemasEco").val("");

        $("#txtFPP").attr('disabled', true);

        //$("#txtNroFetos").css("visibility", 'hidden');

        //imc
        $("#txtImc").val("");
        $("#txtImcDes").val("");
        //---------------------------
        $("#chkCalculaFechaEco").attr('disabled', false);

    },
    CargaDatosPorDefecto: function () {

        $("#hdestadoBtn").val(0);
        $('#rdbCuNo').prop('checked', true)
        $('#rdbPLANo').prop('checked', true)
        $('#rdbMFNo').prop('checked', true)
        $('#rdbSVNo').prop('checked', true)
        $('#rdbFiebreNo').prop('checked', true)
        $('#rdbSGNo').prop('checked', true)

        $('#rdbTransfucionNo').prop('checked', true)

        $('#rdbEstGSNormal').prop('checked', true)
        $('#rdbCardNormal').prop('checked', true)
        $('#rdbAbdomenNormal').prop('checked', true)
        $('#rdbAptRespNormal').prop('checked', true)
        $('#rdbAptUrinpNormal').prop('checked', true)

        $('#rdbGBNormal').prop('checked', true)
        $('#rdVaginadNormal').prop('checked', true)
        $('#rdbCervixNormal').prop('checked', true)
        $('#rdbUteroNormal').prop('checked', true)

        $('#rdbAnexosNormal').prop('checked', true)
        $('#rdbFsDouglasNormal').prop('checked', true)
        $('#rdbParamNormal').prop('checked', true)
        $('#rdbMamasNormal').prop('checked', true)
        $('#rdbExtremNormal').prop('checked', true)
        $('#rdbPapNo').prop('checked', true)
        $('#rdbNeuroNormal').prop('checked', true)


        $('#rdbSitNinguno').prop('checked', true)
        $('#rdbPosNinguno').prop('checked', true)
        $('#rdbPreNinguno').prop('checked', true)

        $('#rdbDipsNA').prop('checked', true);

        $("#cboTipoEmbrazo").change();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#rdbMenranasNo').prop('checked', true);
        $('#rdbProcubitoNo').prop('checked', true);
        $('#rdbProlapsoNo').prop('checked', true);
        $('#rdbSangradoVNo').prop('checked', true);

        $('#rdbMalOlorNo').prop('checked', true);
        $('#rdbCompitivilidadNo').prop('checked', true);

        $('#rdbSuperiorSi').prop('checked', true);
        $('#rdbMedioSi').prop('checked', true);
        $('#rdbInferiorSi').prop('checked', true);

        $('#rdbPelvisGinecoideSi').prop('checked', true);

        $('#rdbSoplosNO').prop('checked', true);
        $('#rdbSoplosNO').prop('checked', true);

        $('#rdbPulmonarNo').prop('checked', true);
        $('#rdbCervicalNo').prop('checked', true);
    },
    CargaDatosEvaluacion: function (idAtencion, nroEvaluacion, pos) {

        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data()

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
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

        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso)


        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");
        $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");

        $("#BadgeEvaluacion .msc-hotline").removeClass("bg-green");
        $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-success");
        if (nroEvaluacion > 0) {
            $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
            $("#lblTipoEvaluacion").html("Evaluación Registrada");


            $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
            $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

            $('#tblEvaluacionesEmergencia tbody').find('tr').eq(pos).addClass("selected");

            $("#evaluaciones-tab").click();
        } else {
            $("#lblTipoEvaluacion").html("Ninguna Evaluación Registrada");
        }
    },
    CargaVariablesEvaluacionNeoDetalle() {
        var formData = new FormData();
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        //var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
        //var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
        //var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
        //var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
        //var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
        //var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
        //var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
        var nroEval = isEmpty(objrowTb2) ? (oTable_EvaHosp.DataTable().data().count() + 1) : objrowTb2.idNumero;

        console.log('nroEval', nroEval)

        formData.append('IdAtencion', $('#txtNroAtencion').val());
        formData.append('NroEvaluacion', nroEval);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('FechaInicioAtencion', $('#FechaInicioAtencion').val());
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        formData.append('ImpresionDiagnostica', $('#txtImpresion').val());
        formData.append('Tratamiento', $('#txtTratamiento').val());
        formData.append('PlanTrabajo', $('#txtPlan').val());

        formData.append('idCuentaAtencion', $("#txtNroCuenta").val());
        formData.append("idServicio", objrowTb.idServicioEgreso);
        formData.append("idMedico", $("#cboMedicoReceta").val());

        $('#hdNroEvaluacion').val(nroEval);

        //Diagnosticos
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));

        // JDELGADO PARA NOTA DE INGRESO
        formData.append('apetito', $('#txtApetitoIngreso').val())
        formData.append('sed', $('#txtSedIngreso').val())
        formData.append('orina', $('#txtOrinaIngreso').val())
        formData.append('deposiciones', $('#txtDeposicionesIngreso').val())
        formData.append('suenio', $('#txtSeunioIngreso').val())

        formData.append('apetitoEval', $('#txtApetitoReev').val())
        formData.append('sedEval', $('#txtSedReev').val())
        formData.append('orinaEval', $('#txtOrinaReev').val())
        formData.append('deposicionesEval', $('#txtDeposicionesReev').val())
        formData.append('suenioEval', $('#txtSuenioReev').val())
        formData.append('idNumero', nroEval);
        // JDELGADO

        return formData;
    },

    GuardarEvaluacionHosp: async function () {
        var resp = false;
        let datos;
        let objRow = oTable_EvaHosp.api(true).rows()
        if ($("#txtPeso").val() == "") {
            alerta('2', 'Ingrese peso')
            $("#txtPeso").focus()
            return false
        }
        if ($("#txtTalla").val() == "") {
            alerta('2', 'Ingrese talla')
            $("#txtTalla").focus()
            return false
        }
        if (objRow[0].length == 0) {
            $("#evaluaciones-tab").click();
        }
        if ($('#rdbTactoVaginalSi').prop('checked') == true) {
            if ($("#txtDilatacion").val() == "") {
                $('.nav-tabs a[href="#examenObsetrico-tab"]').tab('show'); // JDELGADO005
                $("#txtDilatacion").get(0).focus();

                alerta('2', 'Ingrese Dilatación');
                return false;
            }
            if ($("#txtIncorporacion").val() == "") {
                $('.nav-tabs a[href="#examenObsetrico-tab"]').tab('show'); // JDELGADO005
                $("#txtIncorporacion").focus();
                alerta('2', 'Ingrese Incorporacón');
                return false;
            }
        }

        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese Hora de Inicio de Atención');
            $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show'); // JDELGADO005
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        if (objrow.idEstadoCuenta == 1) {
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

            if (ListDiagnosticos.toArray().length == 0) {
                alerta('2', 'Ingresa un diagnóstico');
                $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show'); // JDELGADO005
                return false;
            }

            $('#hdIdPaciente').val(OrdenesRecetasMedicas);

            formData.append("enfermedadA", $("#txtMotivoAtencion").val());
            formData.append("IdAtencion", objrow.idAtencion);
            formData.append("FechaUR", $("#txtFUR").val());
            formData.append("FechaEco", $("#txtFUE").val());
            formData.append("FechaPP", $("#txtFPP").val());
            formData.append("EdadGestacional", $("#txtEdadGestacionalSemanas").val());
            formData.append("DiasGestacional", $("#txtEdadGestacionalDias").val());
            formData.append("Cnp", $("#txtCpn").val());
            formData.append("GMotiA", $("#txtGestas").val());
            formData.append("PMotiA", $("#txtPara").val());
            formData.append("Pin", $("#txtPin").val());

            formData.append("DeltaPeso", $("#txtDeltaPeso").val());
            formData.append("MaduracionPulmonar", $('#rdbPulmonarSI').prop('checked') == true ? 1 : 0);
            formData.append("MaduracionCervical", $('#rdbCervicalSI').prop('checked') == true ? 1 : 0);
            formData.append("Antecedentes", $("#txtAntecedentesMedicos").val());
            formData.append("Ram", $("#txtRam").val());
            formData.append("TransfucionSangre", $('#rdbTransfucionSI').prop('checked') == true ? 1 : 0);
            formData.append("AntecedentesQuirurgicos", $("#txtAntecedentesQuirurgico").val());
            formData.append("Sintomas", $("#txtSignosSintomas").val());

            formData.append("MaduracionPulmonarDesc", $("#txtMadPulmonar").val());
            formData.append("MaduracionCervicalDesc", $("#txtMadCervical").val());



            if ($('#chkFUR').prop('checked') === false) {
                formData.append("UltRegla", 0);
            } else {
                formData.append("UltRegla", 1);
            }
            if ($('#chkFUE').prop('checked') === false) {
                formData.append("FechaEcoAct", 0);
            } else {
                formData.append("FechaEcoAct", 1);
            }


            formData.append("ContraccionesU", $('#rdbCuSI').prop('checked') == true ? 1 : 0);
            formData.append("PerdidaLA", $('#rdbPLASI').prop('checked') == true ? 1 : 0);
            formData.append("AusenciaMF", $('#rdbMFSI').prop('checked') == true ? 1 : 0);
            formData.append("SangradoV", $('#rdbSVSI').prop('checked') == true ? 1 : 0);
            formData.append("Fiebre", $('#rdbFiebreSI').prop('checked') == true ? 1 : 0);
            formData.append("TransfucionSangre", $('#rdbTransfucionSI').prop('checked') == true ? 1 : 0);
            formData.append("SgIrritacionCortical", $('#rdbSGSI').prop('checked') == true ? 1 : 0);

            formData.append("ContraccionesUterinasDesc", $("#txtCU").val());
            formData.append("PerdidaLiquidoAmnioticoDesc", $("#txtPLA").val());
            formData.append("MovimientoFetalesDesc", $("#txtMF").val());
            formData.append("SangradoVaginalDesc", $("#txtSV").val());
            formData.append("FiebreDesc", $("#txtFiebre").val());
            formData.append("SgIrritacionCorticalDesc", $("#txtSg").val());

            //GIENCOOBSTETRA
            //formData.append("IdAtencion", $("#").val());
            formData.append("NroFetos", $("#txtNroFetos").val());
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
            formData.append("LEstadoGeneral", ($('#rdbEstGSNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoCV", ($('#rdbCardNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAbdomen", ($('#rdbAbdomenNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoR", ($('#rdbAptRespNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoU", ($('#rdbAptUrinpNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LExtremidades", ($('#rdbExtremNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DEstadoGeneral", $("#txtEstdGeneSens").val());

            formData.append("LNeurologico", ($('#rdbNeuroNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DNeurologico", $("#txtNeuro").val());

            formData.append("DAparatoCV", $("#txtCardvas").val());
            formData.append("DAbdomen", $("#txtAbdomenNormal").val());
            formData.append("DAparatoR", $("#txtbAptResp").val());
            formData.append("DAparatoU", $("#txtbAptUrin").val());
            formData.append("DExtremidades", $("#txtExtrem").val());
            formData.append("DEdemas", $("#txtEdemas").val());
            formData.append("DReflejos", $("#txtReflejos").val());

            formData.append("LTipoEmbarazo", $("#cboTipoEmbrazo").val());
            formData.append("LUA", $("#txtAlturaUterina").val());
            formData.append("LLCF", $("#txtLfc").val());
            formData.append("LDU", $("#txtDU").val());
            formData.append("Proteinura", $("#txtProteinuria").val());

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

            formData.append("MovFetales", $("#txtMovFetales").val());
            formData.append("MFF01", $("#txtF1Mf").val());
            formData.append("MFF02", $("#txtF2Mf").val());
            formData.append("MFF03", $("#txtF3Mf").val());

            formData.append("ScoreFlamm", $("#txtScoreFlam").val());
            formData.append("Bishop", $("#txtBishop").val());
            formData.append("DObservacionesObstetricas", $("#txtObsObstetricas").val());

            formData.append("LTipoTactoVaginal", ($('#rdbTactoVaginalSi').prop('checked') == true) ? 1 : 0); //verifica que dato envia en escrtiorio
            formData.append("LDilatacion", $("#txtDilatacion").val());
            formData.append("LIncorporacion", $("#txtIncorporacion").val());
            formData.append("LAlPresent", $("#txtAlPresent").val());
            formData.append("DVarPresent", $("#txtVariedPresent").val());

            formData.append("MembranasRotas", ($('#rdbMenranasSi').prop('checked') == true) ? 1 : ($('#rdbMenranasNo').prop('checked') == true) ? 0 : 5);
            formData.append("LProcubito", ($('#rdbProcubitoSi').prop('checked') == true) ? 1 : ($('#rdbProcubitoNo').prop('checked') == true) ? 0 : 5);
            formData.append("LProlapso", ($('#rdbProlapsoSi').prop('checked') == true) ? 1 : ($('#rdbProlapsoNo').prop('checked') == true) ? 0 : 5);
            formData.append("DSangradoV", ($('#rdbSangradoVSi').prop('checked') == true) ? "SI" : ($('#rdbSangradoVNo').prop('checked') == true) ? "NO" : "");
            formData.append("DObservaciones", $('#txtObservacionesTactoVaginal').val());

            var lLiquidoA = 0;
            lLiquidoA = $('#rdbLiqAmnClaro').prop('checked') == true ? 1 : $('#rdbMenranasMeconial').prop('checked') == true ? 2 : $('#rdbLiqAmnSanguinolento').prop('checked') == true ? 3 : 0
            formData.append("LLiquidoA", lLiquidoA);
            formData.append("MalOlor", ($('#rdbMalOlorSi').prop('checked') == true) ? 1 : 0);
            var LCompatibilidadFetoPelvica = 0;
            LCompatibilidadFetoPelvica = $('#rdbCompitivilidadSi').prop('checked') == true ? 1 : $('#rdbCompitivilidadNo').prop('checked') == true ? 2 : 3
            formData.append("LCompatibilidadF", LCompatibilidadFetoPelvica);
            formData.append("LPelvimetriaSup", ($('#rdbSuperiorSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPelvimetriaMed", ($('#rdbMedioSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPelvimetriaInf", ($('#rdbInferiorSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPelvisGinecoide", ($('#rdbPelvisGinecoideSi').prop('checked') == true) ? 1 : 0);
            formData.append("PelvisGineDesc", $('#txtObservacionesPelvisGinecoide').val());

            //Triaje
            formData.append("NroHistoriaClinica", objrow.nroHistoriaClinica);
            formData.append("CitaFecha", objrow.fechaIngreso2);
            formData.append("CitaIdServicio", objrow.idServicioEgreso);

            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()
            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());
            formData.append("CitaObservaciones", $("#txtOtrasObservacionesGe").val());

            formData.append("idServicio", objrow.idServicioEgreso);
            formData.append("idNumero", $("#hdIdNumero").val());
            formData.append("idNumeroSiguiente", $("#hdIdNumeroSiguiente").val());
            formData.append("estadoBtn", $("#hdestadoBtn").val());

            //nuevos 
            formData.append("Tratamiento", $("#txtImpresion").val());
            formData.append("PlanTrabajo", $("#txtPlan").val());

            //diagnosticos
            formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));

            formData.append('idCuentaAtencion', objrow.idCuentaAtencion);

            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

            formData.append('DescripcionExamenFisico', $('#txtDescripcionExamenFisico').val()); // JDELGADO001.2
            formData.append('TratamientoNuevo', $('#txtTratamiento').val()); // JDELGADO001.2

            formData.append('apetito', $('#txtApetitoIngreso').val())
            formData.append('sed', $('#txtSedIngreso').val())
            formData.append('orina', $('#txtOrinaIngreso').val())
            formData.append('deposiciones', $('#txtDeposicionesIngreso').val())
            formData.append('suenio', $('#txtSeunioIngreso').val())

            formData.append('apetitoEval', $('#txtApetitoReev').val())
            formData.append('sedEval', $('#txtSedReev').val())
            formData.append('orinaEval', $('#txtOrinaReev').val())
            formData.append('deposicionesEval', $('#txtDeposicionesReev').val())
            formData.append('suenioEval', $('#txtSuenioReev').val())

            formData.append('idMedico', $('#cboMedicoReceta').val()) // jdelgado010

            try {
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/NotaIngreso/RegitraModificaNotaIngreso?area=Hospitalizacion",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                if (datos.session) {
                    if (datos.mensaje == "") {
                        $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);
                        //$('#hdNroEvaluacion').val($("#hdIdNumeroSiguiente").val());
                        $('#hdIdServicioPaciente').val(objrow.idServicioEgreso)
                        estadoGrabarAtencion = false;
                        alerta(1, 'Se registro correctamente la atencion');
                        resp = true;
                    }
                    else {
                        Cargando(0);
                        respuesta = {};
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

        }
        else {
            swal({
                title: 'Atenciones',
                text: "La cuenta ya se encuentra cerrada",
                type: 'warning',
            }).done(); s
            return false
        }

        return resp;
    },
    GuardarEvaluacionNeo: async function () {
        var objrow = oTable_atencionesEmer.api(true).row('.selected').data()
        var eval = oTable_EvaHosp.DataTable().data().count()

        // this.eval: atributo del objeto que indica falso si es que no se habilito una nueva evaluacion
        if (eval == 0 && !this.eval) {
            alerta(2, "No se ha registrado ninguna evaluación. Por favor registre una evaluación.")
        } else {
            if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
                alerta('2', 'Ingrese la Hora de Inicio de Atención');
                $("#HoraInicioAtencion").focus();
                return false;
            }

            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            if (ListDiagnosticos.toArray().length == 0) {
                alerta('2', 'Ingresa un diagnóstico');
                $('.nav-tabs a[href="#diagnosticos"]').tab('show');
                return false;
            }

            Cargando(1)

            Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 1)
            const data1 = await EvaluacionEmergencia.GuardarEvaluacionNeonatal()
            const data2 = await EvaluacionEmergencia.GuardarAntecedentes()
            const data3 = await EvaluacionEmergencia.GuardarExamenNeonatal()

            const data4 = await NotaIngreso.GuardarEvaluacionNeoDetalle()

            if (data4 == true) {
                //console.log("GENERAR RECETAS");
                const datarec = await Ordenes.GuardarOrdenesMedicas();
                console.log(datarec);
            }

            NotaIngreso.ListaPacientesHosp()
            $("#modalNotaIngreso").modal("hide")

            Cargando(0)
        }
        //    if () {
        //        
        //        if (nuevaEvalNeo == true || modificaEvalNeo == true) {
        //            ;
        //            //console.log(data4);
        //            
        //        }
        //    }
        //}
    },
    GuardarEvaluacionNeoDetalle: async function () {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = this.CargaVariablesEvaluacionNeoDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/NotaIngreso/GuardarEvaluacionDetalleNeo?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    if (datos.respuesta.table.length > 0) {
                        respuesta = datos.respuesta.table[0];
                        if (respuesta.mensaje == "Exito") {

                            //$('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion)
                            //$("#modalNotaIngreso").modal("hide");                            
                            idCuentaAtt = $('#txtNroCuenta').val();
                            if (datos.mensaje == "") {
                                resp = true;
                                alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                                //AdmisionEmergencia.ListarAtenciones();
                                //EvaluacionEmergencia.CerrarModalNeonatal();
                                //return false;
                            }
                            else {
                                alerta('2', datos.mensaje);
                                //return false;
                            }


                            //alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                            //AdmisionEmergencia.ListarAtenciones();
                            //EvaluacionEmergencia.CerrarModalNeonatal();
                        } else {
                            alerta(2, respuesta.mensaje);
                        }
                        //console.log(respuesta);
                    }
                    else {
                        respuesta = {};
                    }
                } else {
                    alerta(2, datos.mensaje);
                    EvaluacionEmergencia.CerrarModalNeonatal();
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                location.reload();
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

    LimpiarModal: function () {
        $("#modalNotaIngreso input[type=text]").val("");
        $("#modalNotaIngreso textarea").val("");
        $("#modalNotaIngreso input[type=checkbox]").prop('checked', false);
        $("#modalNotaIngreso #examenFisico input[type=radio].default").prop('checked', true);
        $("#modalNotaIngreso #antecedentesGenerales input[type=radio]").prop('checked', false);
        $("#modalNotaIngreso #antecedentesGenerales .chzn-select").val("");

        $("#modalNotaIngreso #examenFisicoNeo input[type=radio].default").prop('checked', true);
        $("#modalNotaIngreso #antecedentesGeneralesNeo input[type=radio]").prop('checked', false);
        $("#modalNotaIngreso #antecedentesGeneralesNeo .chzn-select").val("");

    },
    LimpiarRecetas: function () {
        idRecetaRX = 0
        idRecetaPatCli = 0
        idRecetaAnatPat = 0
        idRecetaBs = 0
        idRecetaEcoGene = 0
        idRecetaEcoObs = 0
        idRecetaFarm = 0

        $("#ifrmRecetaFarm").contents().find("body").html('')
        $("#ifrmRecetaRx").contents().find("body").html('')
        $("#ifrmRecetaEcoObs").contents().find("body").html('')
        $("#ifrmRecetaEcoGene").contents().find("body").html('')
        $("#ifrmRecetaAnaPatolg").contents().find("body").html('')
        $("#ifrmRecetaPatoClini").contents().find("body").html('')
        $("#ifrmRecetaBs").contents().find("body").html('')
    },
    TactoVaginalBloqueaLimpia: function (dato) {

        $('#txtDilatacion').val("");
        $('#txtIncorporacion').val("");
        $('#txtAlPresent').val("");
        $('#txtVariedPresent').val("");
        if (dato == 1) {
            $('#txtDilatacion').attr("disabled", true);
            $('#txtIncorporacion').attr("disabled", true);
            $('#txtAlPresent').attr("disabled", true);
            $('#txtVariedPresent').attr("disabled", true);

            $('#rdbMenranasSi').attr("disabled", true);
            $('#rdbProcubitoSi').attr("disabled", true);
            $('#rdbProlapsoSi').attr("disabled", true);
            $('#rdbSangradoVSi').attr("disabled", true);

            $('#rdbMenranasNo').attr("disabled", true);
            $('#rdbProcubitoNo').attr("disabled", true);
            $('#rdbProlapsoNo').attr("disabled", true);
            $('#rdbSangradoVNo').attr("disabled", true);

            $('#rdbMenranasNo').prop('checked', false)
            $('#rdbProcubitoNo').prop('checked', false)
            $('#rdbProlapsoNo').prop('checked', false)
            $('#rdbSangradoVNo').prop('checked', false)

            $('#rdbProcubitoSi').prop('checked', false)
            $('#rdbMenranasSi').prop('checked', false)
            $('#rdbProlapsoSi').prop('checked', false)
            $('#rdbSangradoVSi').prop('checked', false)

            NotaIngreso.LiquidoAmniotico(1);
        }
        else {
            $('#txtDilatacion').attr("disabled", false);
            $('#txtIncorporacion').attr("disabled", false);
            $('#txtAlPresent').attr("disabled", false);
            $('#txtVariedPresent').attr("disabled", false);

            $('#rdbMenranasSi').attr("disabled", false);
            $('#rdbProcubitoSi').attr("disabled", false);
            $('#rdbProlapsoSi').attr("disabled", false);
            $('#rdbSangradoVSi').attr("disabled", false);

            $('#rdbMenranasNo').attr("disabled", false);
            $('#rdbProcubitoNo').attr("disabled", false);
            $('#rdbProlapsoNo').attr("disabled", false);
            $('#rdbSangradoVNo').attr("disabled", false);

            $('#rdbProcubitoSi').prop('checked', true)
            $('#rdbMenranasSi').prop('checked', true)
            $('#rdbProlapsoSi').prop('checked', true)
            $('#rdbSangradoVSi').prop('checked', true)

            NotaIngreso.LiquidoAmniotico(2);
        }

    },
    LiquidoAmniotico: function (valor) {
        if (valor == 1) {
            $('#rdbLiqAmnClaro').attr("disabled", true);
            $('#rdbMenranasMeconial').attr("disabled", true);
            $('#rdbLiqAmnSanguinolento').attr("disabled", true);

            $('#rdbLiqAmnClaro').prop('checked', false);
            $('#rdbMenranasMeconial').prop('checked', false);
            $('#rdbLiqAmnSanguinolento').prop('checked', false);
        }
        else {
            $('#rdbLiqAmnClaro').attr("disabled", false);
            $('#rdbMenranasMeconial').attr("disabled", false);
            $('#rdbLiqAmnSanguinolento').attr("disabled", false);

            $('#rdbLiqAmnClaro').prop('checked', true);
        }
    },

    IniciaFormulario: async function (accion) {
        var objrow = oTable_atencionesHosp.api(true).row('.selected').data();
        if (isEmpty(objrow)) {
            alerta(2, 'Seleccione un registro');
            return false;
        }
        var datosPaciente = "Paciente=> N°. HC: " + objrow.nroHistoriaClinica + " / N°. Cuenta: " + objrow.idCuentaAtencion + " / Nombres: " + objrow.apellidoPaterno + " " + objrow.apellidoMaterno + " " + objrow.primerNombre + " / Edad: " + objrow.edad
        var datosAtencion = "Atención=> Servicio Ingreso:" + objrow.servicioIngresov + " / Fecha Ingreso: " + objrow.fechaIngreso + " / Hora Ing.: " + objrow.horaIngreso + " / Servicio Actual: " + objrow.servicioActual

        $('#hdNroEvaluacion').val(1)
        //idPacienteGlobal = objrow.idPaciente;

        NotaIngreso.LimpiarRecetas()
        NotaIngreso.LimpiarModal()

        NotaIngreso.CargaDatosPorDefecto()

        await Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        await NotaIngreso.ListaAtencionesDatosAdicionalesSeleccionarPorIdCuenta(objrow.idCuentaAtencion)
        await NotaIngreso.ListaEvaluaciones()

        await NotaIngreso.CargarDatosEvaluacionHospi(objrow.idAtencion, objrow.idServicioEgreso, 1)
        // Cargar Detalle evaluacion


        // Cargar Detalle evaluacion

        /////await NotaIngreso.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento, 1, 0, 0) // JDELGADO010

        //

        ////if (NotaIngreso.esNeo) {
        ////    await this.ListaEvaluacionesNeo(objrow.idAtencion) // JDELGADO PARA LISTAR EVALUACIONES NEO

        ////    //this.CargarDatosEvaluacionNeo()
        ////    ////$("#motivo-tab").click();
        ////    ////$("#btnGuardarEvaNeo").show();
        ////    ////$("#btnNuevoRegistro").show();
        ////    //EvaluacionEmergencia.DesbloquearCampos();
        ////} else {
        ////     // JDELGADO PARA LISTAR EVALUACIONES HOSPI

        ////    //
        ////}

        ////

        ////$('#modalNotaIngreso').modal('show');

        //////ModificarEvaluacionNeonatal: function() {
        //////    var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //////    //this.LimpiarModal();
        //////    //this.HabilitarModal();


        //////    //

        //////    EvaluacionEmergencia.AbrirModalNeonatal();

        //////    //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        //////    //console.log("ENTROO");
        //////},


        ////$("#modalLabelsuccess").html(datosPaciente + "<br>" + datosAtencion) // ver si funciona


        //////await ListaDiagnosticosAtenciones(objrow.idAtencion) // JDELGADO J0 SE MODIFICO



        //////switch (accion) {
        //////    case 1:
        //////        $('#btnguardar').attr("disabled", false);
        //////        $('#btnguardar').css("visibility", 'visible');
        //////        $('#btnNuevoRegistro').css("visibility", 'visible');
        //////        var objrowEval = oTable_EvaHosp.api(true).row('.selected').data();
        //////        $('#btnguardar').show()
        //////        break;
        //////    case 2:
        //////        $('#btnguardar').attr("disabled", true);
        //////        $('#btnNuevoRegistro').css("visibility", 'hidden');
        //////        $('#btnguardar').css("visibility", 'hidden');
        //////        $('#divFirma .btn').css("display", 'none');
        //////        $('#divFirma .btn').attr("disabled", true);
        //////        break;

        //////    default: break;
        //////}
        ////IdCuentaAtencionTemp = objrow.idCuentaAtencion;
        ////$('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);
    },

    InitDatablesEvaluaciones: () => {

        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '90%',
                    targets: 1,
                    data: 'medico',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EvaHosp = $("#tblEvaluaciones").dataTable(parms);

    },

    BloqueaFetos: () => {
        if ($("#cboTipoEmbrazo").val() == 2) {
            $("#txtF1SiPoPr").attr("readonly", false);
            $("#txtF2SiPoPr").attr("readonly", false);
            $("#txtF3SiPoPr").attr("readonly", false);
            $("#txtF1Lfc").attr("readonly", false);
            $("#txtF2Lfc").attr("readonly", false);
            $("#txtF3Lfc").attr("readonly", false);
            $("#txtF1Mf").attr("readonly", false);
            $("#txtF2Mf").attr("readonly", false);
            $("#txtF3Mf").attr("readonly", false);

            $('#rdbSitNinguno').attr("disabled", true);
            $('#rdbSitLongitudinal').attr("disabled", true);
            $('#rdbSitTransversal').attr("disabled", true);

            $('#rdbPosNinguno').attr("disabled", true);
            $('#rdbPosDerecha').attr("disabled", true);
            $('#rdbPosIzquierda').attr("disabled", true);

            $('#rdbPreNinguno').attr("disabled", true);
            $('#rdbPreCefalica').attr("disabled", true);
            $('#rdbPrePodalica').attr("disabled", true);

            $("#txtMovFetales").attr("disabled", true)
            $("#txtNroFetos").css("visibility", 'visible');
        }
        else {
            $("#txtF1SiPoPr").attr("readonly", true);
            $("#txtF2SiPoPr").attr("readonly", true);
            $("#txtF3SiPoPr").attr("readonly", true);
            $("#txtF1Lfc").attr("readonly", true);
            $("#txtF2Lfc").attr("readonly", true);
            $("#txtF3Lfc").attr("readonly", true);
            $("#txtF1Mf").attr("readonly", true);
            $("#txtF2Mf").attr("readonly", true);
            $("#txtF3Mf").attr("readonly", true);

            $('#rdbSitNinguno').attr("disabled", false);
            $('#rdbSitLongitudinal').attr("disabled", false);
            $('#rdbSitTransversal').attr("disabled", false);

            $('#rdbPosNinguno').attr("disabled", false);
            $('#rdbPosDerecha').attr("disabled", false);
            $('#rdbPosIzquierda').attr("disabled", false);

            $('#rdbPreNinguno').attr("disabled", false);
            $('#rdbPreCefalica').attr("disabled", false);
            $('#rdbPrePodalica').attr("disabled", false);

            $("#txtMovFetales").attr("disabled", false);
            $("#txtNroFetos").css("visibility", 'hidden');
        }

        $("#txtNroFetos").val("");
        $("#txtMovFetales").val("");
        //--------------------------
        $("#txtF1SiPoPr").val("");
        $("#txtF2SiPoPr").val("");
        $("#txtF3SiPoPr").val("");
        $("#txtF1Lfc").val("");
        $("#txtF2Lfc").val("");
        $("#txtF3Lfc").val("");
        $("#txtF1Mf").val("");
        $("#txtF2Mf").val("");
        $("#txtF3Mf").val("");
        //------------------------
        $('#rdbSitNinguno').prop('checked', true)
        $('#rdbPosNinguno').prop('checked', true)
        $('#rdbPreNinguno').prop('checked', true)
    },

    Events() {
        $('#btnNuevoRegistro').on('click', function () {
            NotaIngreso.ListaNumeroAtencion()

            $("#hdestadoBtn").val(1)
            $("#lblNroAtencion").css("color", "#00cc99")
            swal({
                title: 'Atenciones',
                text: "Paciente iniciara la atencion " + $("#hdIdNumeroSiguiente").val(),
                type: 'info',
            }).done()
        })
        $('#btnguardar').on('click', async function () {
            if (!NotaIngreso.esNeo) {
                const data = await NotaIngreso.GuardarEvaluacionHosp()
                console.log(data)
                if (data == true) {
                    console.log("GENERAR RECETAS")
                    const datarec = await Ordenes.GuardarOrdenesMedicas()
                    console.log(datarec)

                    NotaIngreso.ListaPacientesHosp()
                    $('#TabBusqueda').click()
                    //$("#modalNotaIngreso").modal("hide")
                }
            } else {
                NotaIngreso.GuardarEvaluacionNeo()
            }
        })
        $("#btncerrar").on('click', function () {
            swal({
                title: 'CERRAR',
                text: "¿Esta seguro de cerrar el módulo de evaluación?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function () {
                //AdmisionEmergencia.limpiarRecetas()
                //EvaluacionNeonatal.LimpiarModuloNeonatal();
                //AdmisionEmergencia.CerrarModulo();
                //ReposicionarVista();
                //MostrarAreaLista();
                $('#TabBusqueda').click();
            }, function (dimiss) {

            });
        })
        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasHosp').on('click', async function () {
            var row = oTable_atencionesEmer.api(true).row('.selected').data();
            console.log(row);
            if (typeof row === 'undefined') {
                alerta(2, "Seleccione una evaluación por favor.");
            } else {
                if (isEmpty(OrdenesRecetasMedicas)) {
                    alerta(2, "No existen recetas para esta evaluación.");
                } else {
                    VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicas);
                }
            }
            //console.log(OrdenesRecetas);            
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#btnHistorial").on('click', function () {

            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            HistorialEvaluacionesHosp.llendaDatos(objrow.nroHistoriaClinica, 0)

            $("#modalHistorial").modal('show');
        })
        $("#btnCerrarHistorial").on('click', function () {
            $("#modalHistorial").modal('hide');
        })
        $('#btnImprimeInformeSF').on('click', async function () {

            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();
            var objrowTb2 = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
                return false;
            } else {
                Cargando(1)
                var tipo = 'HOSPNI';
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrowTb.code)

                if (typeof firma === 'undefined') {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNI(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        NotaIngreso.ListaEvaluaciones()
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
                Cargando(0)
            }
        });

        $('#btnFirmaNotaIngreso').on('click', async function () {
            let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
            let objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

            console.log(objrowTb2, 'objrowTb')
            console.log(objrowTb2, 'objrowTb2')

            await Utilitario.AbrirServicioFirmaBit4Id(objrowTb2.code);

            //Utilitario.AbrirServicioFirmaBit4Id(objrowTb2.idCuentaAtencion, objrowTb2.idCuentaAtencion, 'HOSPNI-' + objrowTb2.idNumero)
        });
        $('#btnDocumentoFirmadoNotaIngreso').on('click', async function () {
            let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
            let objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

            console.log(objrowTb2, 'objrowTb')
            console.log(objrowTb2, 'objrowTb2')

            await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb2.code)
        });

        $("#cboTipoEmbrazo").on('change', function () {
            NotaIngreso.BloqueaFetos();
        });

        $('#tblEvaluaciones tbody').on('click', 'tr', async function () { // -M

            oTable_EvaHosp.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var pos = oTable_EvaHosp.api(true).row($(this)).index();
            var row = oTable_EvaHosp.fnGetData(pos);

            Cargando(1)

            if (row.length != 0) {

                if (row.idUsuario != $('#hdIdUsuarioActual').val()) {
                    swal({
                        title: 'Nota de ingreso',
                        text: "Esta evaluacion solo puede ser modificada por: " + row.usuario,
                        type: 'warning',
                    }).done();
                    $('.div_bloquea').show()
                    $('#btnguardar').hide()
                } else {
                    $('.div_bloquea').hide()
                    $('#btnguardar').show()
                }

                await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(row.idCuentaAtencion)

                await Diagnosticos.SeleccionarDiagnosticosPorEvaluacion(row.idAtencion, row.idServicio, row.idNumero, 2);
                await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(row.idCuentaAtencion, row.idTipoFinanciamiento, row.idNumero, row.idServicio, row.idMedico)

                await Triaje.listaTriajeEmgHosp(row.idAtencion, row.idServicio, row.idNumero)
                await asigna_FechaHoraAtencion(row.fechaRegistro)

                $('#hdIdNumero').val(row.idNumero);
                $('#hdestadoBtn').val(0);
                $('#hdNroEvaluacion').val(row.idNumero) // jdelgado para agregar recetas






                NotaIngreso.CargaDatosEvaluacion(row.idAtencion, row.idNumero, pos);
                NotaIngreso.CargarDatosEvaluacionHospi(row.idAtencion, row.idServicio, row.idNumero)


                //////await NotaIngreso.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(row.idAtencion, , ) // -C
                //////await NotaIngreso.ListaRecetas(row.idCuentaAtencion, , row.idNumero, , )






                //if (isEmpty(row.code)) {
                //    $('#btnDescargaGineObstetra').css("visibility", 'hidden')
                //    $('#btnGeneraGineObstetra').css("visibility", 'visible')
                //} else if (row.statusFirma == 0) {
                //    $('#btnGeneraGineObstetra').css("visibility", 'visible')
                //    $('#btnDescargaGineObstetra').css("visibility", 'visible')
                //} else if (row.statusFirma == 1) {
                //    $('#btnGeneraGineObstetra').css("visibility", 'hidden')
                //    $('#btnDescargaGineObstetra').css("visibility", 'visible')
                //}

                ////if (row.idNumero > 1) { // JDELGADO001.2
                ////    bloquearCampos()
                ////} else {
                ////    desbloquearCampos()
                ////}

                //var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();

                //NotaIngreso.ListaEvalEmergenciaDetalleByServicioByNumero(row.idAtencion, row.idServicio, row.idNumero) // JDELGADO001.2


                //if (NotaIngreso.esNeo) {
                //    //this.CargarDatosEvaluacionNeo()
                //    ////$("#motivo-tab").click();
                //    ////$("#btnGuardarEvaNeo").show();
                //    ////$("#btnNuevoRegistro").show();
                //    //EvaluacionEmergencia.DesbloquearCampos();
                //} else {
                //    
                //}

                //
            }

            Cargando(0)
        });
    },

    async IniciarModulo() {
        await NotaIngreso.IniciarScript();
    },

    async IniciarScript() {
        //EvaluacionNeonatal.initDatables();
        NotaIngreso.CargaInicial()
        NotaIngreso.InitDatablesEvaluaciones()
        NotaIngreso.Events()
    }


}


//$(document).ready(() => {

//    NotaIngreso.Plugins()

//    NotaIngreso.TiposServicio()

//    NotaIngreso.InitDatables()

//    NotaIngreso.Events()

//    //ConsumoServicio.IniciarScript()
//})