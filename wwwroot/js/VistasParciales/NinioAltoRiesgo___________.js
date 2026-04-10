

var NinioAltoRiesgo = {

    plugins() {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFinEmb, #txtFUM, #txtFPP, #txtFEcog, #txtFechaControl, #txtFPPControl, #txtFechaFinCiclo, #txtFechaEjecucion').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
    },
    fechaDia() {
        var fechaG = new Date();
        var diaG = fechaG.getDate();
        var mesG = parseInt(fechaG.getMonth()) + 1;
        var yyyG = fechaG.getFullYear();

        fechaA = diaG + "/" + mesG + "/" + yyyG
        return fechaA
    },
    validaItems() {

        databaItems = oTable_itemsEvaluar.api(true).rows().data();
        hasError = true;
        databaItems.each(function (value, index) {
            var rdbS = "rdb_" + databaItems[index]["idItemDesarrollo"];

            if (!document.querySelector('input[name="' + rdbS + '"]:checked')) {

                hasError = false;

            }
           
            
            
        });
        return hasError;
    },
    validaItemsEvaluarPlan() {

        databaItems = oTable_itemsEvaluarPlan.api(true).rows().data();
        hasError = true;
        databaItems.each(function (value, index) {
            var rdbS = "rdbP_" + databaItems[index]["idItemDesarrollo"];

            if (!document.querySelector('input[name="' + rdbS + '"]:checked')) {

                hasError = false;

            }



        });
        return hasError;
    },
    DevolverItems() {
        var lstRecetadetalle = []
        var html = "";
        html += '['; 

        databaItems = oTable_itemsEvaluar.api(true).rows().data();
        databaItems.each(function (value, index) {
            var rdb = "#rdbS_" + databaItems[index]["idItemDesarrollo"];
            var valor = ($(rdb).prop('checked') == true ? 1 : 0);
            html += '{"idItemDesarrollo":"' + databaItems[index]["idItemDesarrollo"] + '","idPlanDesarrolloPaciente":"' + databaItems[index]["idPlanDesarrolloPaciente"] + '","idPlanIntegralPaciente":"' + databaItems[index]["idPlanIntegralPaciente"] + '","ordenItem":"' + databaItems[index]["ordenItem"] + '","ejecutaAccion":' + valor + '},';
        }); 

        html += ']';
        var htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },
    DevolverItemsEvaluarPlan() {
        var lstRecetadetalle = []
        var html = "";
        html += '[';

        databaItems = oTable_itemsEvaluarPlan.api(true).rows().data();
        databaItems.each(function (value, index) {
            var rdb = "#rdbPS_" + databaItems[index]["idItemDesarrollo"];
            var valor = ($(rdb).prop('checked') == true ? 1 : 0);
            html += '{"idItemDesarrollo":"' + databaItems[index]["idItemDesarrollo"] + '","idPlanDesarrolloPaciente":"' + databaItems[index]["idPlanDesarrolloPaciente"] + '","idPlanIntegralPaciente":"' + databaItems[index]["idPlanIntegralPaciente"] + '","ordenItem":"' + databaItems[index]["ordenItem"] + '","ejecutaAccion":' + valor + '},';
        });

        html += ']';
        var htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },
    obtenerEvaluacion() {

        var ejecutadosSi = 0;
        var ejecutadosNo = 0;

        databaItems = oTable_itemsEvaluar.api(true).rows().data();
        databaItems.each(function (value, index) {
            var rdb = "#rdbS_" + databaItems[index]["idItemDesarrollo"];
            var valor = ($(rdb).prop('checked') == true ? true : false);
            if (valor) {
                ejecutadosSi = ejecutadosSi + 1;
            }
            else {
                ejecutadosNo = ejecutadosNo + 1;
            }
             
        });
        var resultado = 0;
        if (ejecutadosNo == 0) {
            resultado = 1;
        }
        else {
            resultado = 2;
        }
        return resultado;

    },
    obtenerEvaluacionEvaluarPlan() {

        var ejecutadosSi = 0;
        var ejecutadosNo = 0;

        databaItems = oTable_itemsEvaluarPlan.api(true).rows().data();
        databaItems.each(function (value, index) {
            var rdb = "#rdbPS_" + databaItems[index]["idItemDesarrollo"];
            var valor = ($(rdb).prop('checked') == true ? true : false);
            if (valor) {
                ejecutadosSi = ejecutadosSi + 1;
            }
            else {
                ejecutadosNo = ejecutadosNo + 1;
            }

        });
        var resultado = 0;
        if (ejecutadosNo == 0) {
            resultado = 1;
        }
        else {
            resultado = 2;
        }
        return resultado;

    },
    obtenerEvaluacionDescripcion( valor) {

        var resultado = "";
        if (valor == 1) {
            resultado = "NORMAL";
        }
        else if (valor == 2) {
            resultado = "DEFICIT";
        }
        else {
            resultado = "DEFICIT";
        }
        
        return resultado;

    },
    limpiarDatos() {
        $('#rdbPrimMesesLME').prop('checked', true);
        $("#txtIncioAlimComplementaria").val("");
        $('#rdbSumplementoSi').prop('checked', true);
        $('#rdbNinoTbcSi').prop('checked', true);
        $('#rdbNinoSobaAsmaSi').prop('checked', true);
        $('#rdbNinoEpilepsiaSi').prop('checked', true); 
        $('#rdbNinoInfeccionesSi').prop('checked', true);
        $('#rdbNinoHospitalizacionesSi').prop('checked', true);
        $('#rdbNinoTransfucionesSi').prop('checked', true);
        $('#rdbNinoCirugiaSi').prop('checked', true);
        $('#rdbNinoHipotiroidismoSi').prop('checked', true);
        $('#rdbNinoDisplacíaSi').prop('checked', true);
        $('#rdbNinoAlergiaMedSi').prop('checked', true);
        $('#rdbNinoOtrosAntecSi').prop('checked', true);
        $("#txtNinoSanoAlergiaMedicamentos").val("");
        $("#txtNinoSanoOtroAntec").val("");
        $('#rdbEmbarazoNormal').prop('checked', true);
        $("#txtPatologia").val("");
        $("#txtNroEmbarazo").val("");
        $('#rdbAtenPrenatalSi').prop('checked', true);
        $("#txtNroAPN").val("");
        $("#txtLugarAPN").val("");
        $('#rdbPartoEutocico').prop('checked', true);
        $("#txtComplicaciones").val("");
        $('#rdbLugarPartoEeSs').prop('checked', true);
        $('#rdbAtendidoPorPS').prop('checked', true);
        $("#txtAtendidoPorOtro").val("");
        $("#txtEdadGestacionalNacer").val("");
        $("#txtPesoNacer").val("");
        $("#txtTallaNacer").val("");
        $("#txtPerimetricoCefalico").val("");
        $("#txtPerimetricoToracico").val("");
        $('#rdbInmediatoSi').prop('checked', true);
        $("#txtAPGAR1").val("");
        $("#txtAPGAR5").val("");
        $('#rdbReanimacionSi').prop('checked', true);
        $('#rdbPatologiaNeoSi').prop('checked', true);
        $("#txtEspecifique").val("");
        $('#rdbHospitalizacionSi').prop('checked', true);
        $("#txtTiempoHospitalizacion").val("");
        $('#rdbNinoFamiliaresTbcSi').prop('checked', true);
        $("#txtNinoFamiliaresTbc").val("");
        $('#rdbNinoFamiliaresAsmaSi').prop('checked', true);
        $("#txtNinoFamiliaresAsma").val("");
        $('#rdbNinoFamiliaresSidaSi').prop('checked', true);
        $("#txtNinoFamiliaresSida").val("");
        $('#rdbNinoFamiliaresDiabetesSi').prop('checked', true);
        $("#txtNinoFamiliaresDiabetesSi").val("");
        $('#rdbNinoFamiliaresEpilepsiaSi').prop('checked', true);
        $("#txtNinoFamiliaresEpilepsia").val("");
        $('#rdbNinoFamiliaresAlergiaMedcSi').prop('checked', true);
        $("#txtNinoFamiliaresAlergiaMedc").val("");
        $('#rdbNinoFamiliaresViolenciaSi').prop('checked', true);
        $("#txtNinoFamiliaresViolencia").val("");
        $('#rdbNinoFamiliaresAlcoholismoSi').prop('checked', true);
        $("#txtNinoFamiliaresAlcoholismo").val("");
        $('#rdbNinoFamiliaresDrogadiccionSi').prop('checked', true);
        $("#txtNinoFamiliaresDrogadiccion").val("");
        $('#rdbNinoFamiliaresHepatitisSi').prop('checked', true);
        $("#txtNinoFamiliaresHepatitis").val("");
        $('#rdbAguaPotableSi').prop('checked', true);
        $("#txtAguaPotable").val("");
        $('#rdbDesagueSi').prop('checked', true);
        $("#txtDesague").val("");
        $("#txtApetitoNinio").val("");
        $("#txtSuenioNinio").val("");
        $("#txtSedNinio").val("");
        $("#txtOrinaNinio").val("");
        $("#txtDiposicionesNinio").val("");
        $("#txtMotivoConsNinio").val("");
        $("#txtEnfermedadActual").val("");
        $("#txtTiempoEmfermedad").val("");
        $("#txtExamenCNinio").val("");


    },
    listaNinioAltoRiesgoAlimentPatologicos(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        $.ajax({
            url: "/Atencion/ListaNinioAltoRiesgoAlimentPatologicos?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post", 
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lsNinioAlimenPto.table.length > 0) {

                        datos.lsNinioAlimenPto.table[0].alimentPrimerosSeisMeses == 1 ? $('#rdbPrimMesesLME').prop('checked', true) : datos.lsNinioAlimenPto.table[0].alimentPrimerosSeisMeses == 2 ? $('#rdbPrimMesesMIXTA').prop('checked', true) : $('#rdbPrimMesesArtificial').prop('checked', true);
                        $("#txtIncioAlimComplementaria").val(datos.lsNinioAlimenPto.table[0].fechalimentaComple);
                        datos.lsNinioAlimenPto.table[0].alimentSumplementoFe == 1 ? $('#rdbSumplementoSi').prop('checked', true) : $('#rdbSumplementoNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patTbc == 1 ? $('#rdbNinoTbcSi').prop('checked', true) : $('#rdbNinoTbcNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patSobaAsma == 1 ? $('#rdbNinoSobaAsmaSi').prop('checked', true) : $('#rdbNinoSobaAsmaNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patEpilepsia == 1 ? $('#rdbNinoEpilepsiaSi').prop('checked', true) : $('#rdbNinoEpilepsiaNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patInfecciones == 1 ? $('#rdbNinoInfeccionesSi').prop('checked', true) : $('#rdbNinoInfeccionesNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patHospitalizaciones == 1 ? $('#rdbNinoHospitalizacionesSi').prop('checked', true) : $('#rdbNinoHospitalizacionesNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patTransferenciaSangre == 1 ? $('#rdbNinoTransfucionesSi').prop('checked', true) : $('#rdbNinoTransfucionesNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patCirugia == 1 ? $('#rdbNinoCirugiaSi').prop('checked', true) : $('#rdbNinoCirugiaNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patDisplacia == 1 ? $('#rdbNinoDisplacíaSi').prop('checked', true) : $('#rdbNinoDisplacíaNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patHipotiroidismo == 1 ? $('#rdbNinoHipotiroidismoSi').prop('checked', true) : $('#rdbNinoHipotiroidismoNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patAlergia == 1 ? $('#rdbNinoAlergiaMedSi').prop('checked', true) : $('#rdbNinoAlergiaMedNo').prop('checked', true);
                        datos.lsNinioAlimenPto.table[0].patOtroAntecedentes == 1 ? $('#rdbNinoOtrosAntecSi').prop('checked', true) : $('#rdbNinoOtrosAntecNo').prop('checked', true);
                        $("#txtNinoSanoAlergiaMedicamentos").val(datos.lsNinioAlimenPto.table[0].patAlergiaDesc);
                        $("#txtNinoSanoOtroAntec").val(datos.lsNinioAlimenPto.table[0].patOtroAntecedentesDesc);

                        

                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
                

            },
            error: function (msg) {
                alerta("ERROR", "Error listar listaNinioAltoRiesgoAlimentPatologicos!", "2");
            }
        });
    },
    listaNinioAltoRiesgoAntecPerinatales(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        $.ajax({
            url: "/Atencion/ListaNinioAltoRiesgoAntecPerinatales?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lsNinioAntecePer.table.length > 0) {
                      
                        datos.lsNinioAntecePer.table[0].tipoEmbarazo == 1 ? $('#rdbEmbarazoNormal').prop('checked', true) : $('#rdbEmbarazoComplicado').prop('checked', true);
                        $("#txtPatologia").val(datos.lsNinioAntecePer.table[0].patologias);
                        $("#txtNroEmbarazo").val(datos.lsNinioAntecePer.table[0].nroEmbarazo);
                        datos.lsNinioAntecePer.table[0].atencionPrenatal == 1 ? $('#rdbAtenPrenatalSi').prop('checked', true) : $('#rdbAtenPrenatalNo').prop('checked', true);
                        $("#txtNroAPN").val(datos.lsNinioAntecePer.table[0].nroApn);
                        $("#txtLugarAPN").val(datos.lsNinioAntecePer.table[0].lugarApn);
                        datos.lsNinioAntecePer.table[0].tipoParto == 1 ? $('#rdbPartoEutocico').prop('checked', true) : $('#rdbPartoCoplicado').prop('checked', true);
                        $("#txtComplicaciones").val(datos.lsNinioAntecePer.table[0].complicacionParto);
                        datos.lsNinioAntecePer.table[0].lugarParto == 1 ? $('#rdbLugarPartoEeSs').prop('checked', true) : datos.lsNinioAntecePer.table[0].lugarParto == 2 ? $('#rdbLugarPartoDomicilio').prop('checked', true) : $('#rdbLugarPartoCP').prop('checked', true);
                        datos.lsNinioAntecePer.table[0].atendidoPor == 1 ? $('#rdbAtendidoPorPS').prop('checked', true) : datos.lsNinioAntecePer.table[0].atendidoPor == 2 ? $('#rdbAtendidoPorTec').prop('checked', true) : datos.lsNinioAntecePer.table[0].atendidoPor == 3 ? $('#rdbAtendidoPorACS').prop('checked', true) : datos.lsNinioAntecePer.table[0].atendidoPor == 4 ? $('#rdbAtendidoPorFM').prop('checked', true) : $('#rdbAtendidoPorOTRO').prop('checked', true);
                        $("#txtAtendidoPorOtro").val(datos.lsNinioAntecePer.table[0].atendidoPorotro );

                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            },
            error: function (msg) {
                alerta("ERROR", "Error listar listaNinioAltoRiesgoAntecPerinatales!", "2");
            }
        });
    },
    listaNinioAltoRiesgoNacimiento(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        $.ajax({
            url: "/Atencion/ListaNinioAltoRiesgoNacimiento?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lsNinioNacimiento.table.length > 0) {

                        $("#txtEdadGestacionalNacer").val(datos.lsNinioNacimiento.table[0].estaGestacionalAlNacer);
                        $("#txtPesoNacer").val(datos.lsNinioNacimiento.table[0].pesoAlNacer);
                        $("#txtTallaNacer").val(datos.lsNinioNacimiento.table[0].tallaAlNacer);
                        $("#txtPerimetricoCefalico").val(datos.lsNinioNacimiento.table[0].perimetroCefalico);
                        $("#txtPerimetricoToracico").val(datos.lsNinioNacimiento.table[0].perimetroToracico);

                        datos.lsNinioNacimiento.table[0].inmedito == 1 ? $('#rdbInmediatoSi').prop('checked', true) : $('#rdbInmediatoNo').prop('checked', true);
                        $("#txtAPGAR1").val(datos.lsNinioNacimiento.table[0].apgar1min);
                        $("#txtAPGAR5").val(datos.lsNinioNacimiento.table[0].apgar5min);
                        datos.lsNinioNacimiento.table[0].reanimacion == 1 ? $('#rdbReanimacionSi').prop('checked', true) : $('#rdbReanimacionNo').prop('checked', true);
                        datos.lsNinioNacimiento.table[0].patologiaNeonatal == 1 ? $('#rdbPatologiaNeoSi').prop('checked', true) : $('#rdbPatologiaNeoNo').prop('checked', true);
                        $("#txtEspecifique").val(datos.lsNinioNacimiento.table[0].patologiaNeonatalDescripcion);
                        datos.lsNinioNacimiento.table[0].hospitalizacion == 1 ? $('#rdbHospitalizacionSi').prop('checked', true) : $('#rdbHospitalizacionNo').prop('checked', true);
                        $("#txtTiempoHospitalizacion").val(datos.lsNinioNacimiento.table[0].tiempoHospitalizado);

                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            },
            error: function (msg) {
                alerta("ERROR", "Error listar listaNinioAltoRiesgoNacimiento!", "2");
            }
        });
    },
    listaNinioAltoRiesgoVivienda(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        $.ajax({
            url: "/Atencion/ListaNinioAltoRiesgoVivienda?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lsNinioRiesgoVivienda.table.length > 0) {
                        datos.lsNinioRiesgoVivienda.table[0].famiTuberculosis == 1 ? $('#rdbNinoFamiliaresTbcSi').prop('checked', true) : $('#rdbNinoFamiliaresTbcNo').prop('checked', true);
                        $("#txtNinoFamiliaresTbc").val(datos.lsNinioRiesgoVivienda.table[0].famiTuberculosisDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiAsma == 1 ? $('#rdbNinoFamiliaresAsmaSi').prop('checked', true) : $('#rdbNinoFamiliaresAsmaNo').prop('checked', true);
                        $("#txtNinoFamiliaresAsma").val(datos.lsNinioRiesgoVivienda.table[0].famiAsmaDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiVih == 1 ? $('#rdbNinoFamiliaresSidaSi').prop('checked', true) : $('#rdbNinoFamiliaresSidaNo').prop('checked', true);
                        $("#txtNinoFamiliaresSida").val(datos.lsNinioRiesgoVivienda.table[0].famiVihDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiDiabetes == 1 ? $('#rdbNinoFamiliaresDiabetesSi').prop('checked', true) : $('#rdbNinoFamiliaresDiabetesNo').prop('checked', true);
                        $("#txtNinoFamiliaresDiabetesSi").val(datos.lsNinioRiesgoVivienda.table[0].famiDiabetesDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiEpilepsia == 1 ? $('#rdbNinoFamiliaresEpilepsiaSi').prop('checked', true) : $('#rdbNinoFamiliaresEpilepsiaNo').prop('checked', true);
                        $("#txtNinoFamiliaresEpilepsia").val(datos.lsNinioRiesgoVivienda.table[0].famiEpilepsiaDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiAlerMedica == 1 ? $('#rdbNinoFamiliaresAlergiaMedcSi').prop('checked', true) : $('#rdbNinoFamiliaresAlergiaMedcNo').prop('checked', true);
                        $("#txtNinoFamiliaresAlergiaMedc").val(datos.lsNinioRiesgoVivienda.table[0].famiAlerMedicaDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiViolenciaFami == 1 ? $('#rdbNinoFamiliaresViolenciaSi').prop('checked', true) : $('#rdbNinoFamiliaresViolenciaNo').prop('checked', true);
                        $("#txtNinoFamiliaresViolencia").val(datos.lsNinioRiesgoVivienda.table[0].famiViolenciaFamiDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiAlcoholismo == 1 ? $('#rdbNinoFamiliaresAlcoholismoSi').prop('checked', true) : $('#rdbNinoFamiliaresAlcoholismoNo').prop('checked', true);
                        $("#txtNinoFamiliaresAlcoholismo").val(datos.lsNinioRiesgoVivienda.table[0].famiAlcoholismoDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiDrogadiccion == 1 ? $('#rdbNinoFamiliaresDrogadiccionSi').prop('checked', true) : $('#rdbNinoFamiliaresDrogadiccionNo').prop('checked', true);
                        $("#txtNinoFamiliaresDrogadiccion").val(datos.lsNinioRiesgoVivienda.table[0].famiDrogadiccionDesc);
                        datos.lsNinioRiesgoVivienda.table[0].famiHepatitisB == 1 ? $('#rdbNinoFamiliaresHepatitisSi').prop('checked', true) : $('#rdbNinoFamiliaresHepatitisNo').prop('checked', true);
                        $("#txtNinoFamiliaresHepatitis").val(datos.lsNinioRiesgoVivienda.table[0].famiHepatitisBDesc);
                        datos.lsNinioRiesgoVivienda.table[0].viviendaAguaPotable == 1 ? $('#rdbAguaPotableSi').prop('checked', true) : $('#rdbAguaPotableNo').prop('checked', true);
                        $("#txtAguaPotable").val(datos.lsNinioRiesgoVivienda.table[0].viviendaAguaPotableDesc);
                        datos.lsNinioRiesgoVivienda.table[0].viviendaDesague == 1 ? $('#rdbDesagueSi').prop('checked', true) : $('#rdbDesagueNo').prop('checked', true);
                        $("#txtDesague").val(datos.lsNinioRiesgoVivienda.table[0].viviendaDesagueDesc); 
                         
                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            },
            error: function (msg) {
                alerta("ERROR", "Error listar listaNinioAltoRiesgoVivienda!", "2");
            }
        });
    },
    AtenInteItemDesarrolloPacientePendiente(idAtencion,idPaciente) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idPaciente', idPaciente);
        $.ajax({
            url: "/Atencion/AtenInteItemDesarrolloPacientePendiente?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lst.table.length > 0) {
                        $("#hsession").html("Session: " + datos.lst.table[0].numeroSesion)
                        $("#txtFechaProgramada").val(datos.lst.table[0].fechaProgramada2)
                        $("#txtFechaEjecucion").val(isEmpty(datos.lst.table[0].fechaEjecucion2) == true ? datos.lst.table[0].fechaProgramada2 : datos.lst.table[0].fechaEjecucion2)
                        $("#hdidPlanDesarrolloPaciente").val(datos.lst.table[0].idPlanDesarrolloPaciente)
                        $("#hdidPlanIntegralPaciente").val(datos.lst.table[0].idPlanIntegralPaciente)
                        $("#hdidEstablecimiento").val(datos.lst.table[0].idEstablecimiento)
                        $("#txtEvaluacion").val(NinioAltoRiesgo.obtenerEvaluacionDescripcion(datos.lst.table[0].evaluacion))
                        

                    }
                    else {
                        $("#hsession").html("");
                        $("#txtFechaProgramada").val(fechaDia)
                        
                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            },
            error: function (msg) {
                alerta("ERROR", "Error listar AtenInteItemDesarrolloPacientePendiente!", "2");
            }
        });
    },
    initDatablesItemsEvaluar() {


        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItemDesarrollo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '80%',
                    targets: 1,
                    data: "itemDesarrollo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
      
                        if (isEmpty(rowData.ejecutaAccion)){
                 
                            $(td).parent().css('color', '#ff0000');
                        
                            caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbS_' + rowData.idItemDesarrollo + '" class="verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                        }
                        else {
                   
                            if (rowData.ejecutaAccion) {
                                caja = ' <label class="custom-control custom-radio" > <input checked type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbS_' + rowData.idItemDesarrollo + '" class=" verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            else {
                                caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbS_' + rowData.idItemDesarrollo + '" class="verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            
                        } 
                        
                        
                        $(td).html(caja)

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        var caja = "";
                       
                        if (isEmpty(rowData.ejecutaAccion)) {
                            caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbN_' + rowData.idItemDesarrollo + '" class="verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                        }
                        else {
                            if (rowData.ejecutaAccion == false) {
                                caja = ' <label class="custom-control custom-radio" > <input checked type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbN_' + rowData.idItemDesarrollo + '" class="verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            else {
                                caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdb_' + rowData.idItemDesarrollo + '" id="rdbN_' + rowData.idItemDesarrollo + '" class="verificaEval custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            
                        }


                        $(td).html(caja)

                    }
                }

            ]

        }

        var tableWrapper = $('#tblItemsEvaluar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_itemsEvaluar = $("#tblItemsEvaluar").dataTable(parms);
        $('#tblItemsEvaluar_length').css('display', 'none')

    },
    initDatablesItemsPlan() {


        var parms = {
            "scrollY": "180px",
            "scrollCollapse": true,
            "autoWidth": false,
            "order": [[0, "asc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idPlanDesarrolloPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {


                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                       

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 2,
                    data: "fechaProgramada2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 3,
                    data: "fechaEjecucion2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets:4,
                    data: "numeroSesion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 5,
                    data: "evaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (!isEmpty(rowData.evaluacion)) {
                            $(td).parent().css('color', 'blue');
                        }
                        else if ((isEmpty(rowData.evaluacion)) && rowData.estdoFechaProgramada == 1) {
                            $(td).parent().css('color', 'black');
                        }
                        else if ((isEmpty(rowData.evaluacion)) && rowData.estdoFechaProgramada == 0) {
                            $(td).parent().css('color', 'red');
                        }


                        //if (rowData.estdoFechaProgramada == 1 && (!isEmpty(rowData.evaluacion))) {
                        //    $(td).parent().css('color', 'black');
                        //}
                        //else if (rowData.estdoFechaProgramada == 0 && (!isEmpty(rowData.evaluacion))) {
                        //    $(td).parent().css('color', 'red');
                        //}
                        //else {
                        //    $(td).parent().css('color', 'blue');
                        //}
                        
                        

                    }
                }
               

            ]

        }

        var tableWrapper = $('#tblPlanPsicomotor'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_itemsPlan = $("#tblPlanPsicomotor").dataTable(parms);
        $('#tblPlanPsicomotor_length').css('display', 'none')

    },
    initDatablesItemsEvaluarPlan() {


        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItemDesarrollo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '80%',
                    targets: 1,
                    data: "itemDesarrollo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        if (isEmpty(rowData.ejecutaAccion)) {

                            $(td).parent().css('color', '#ff0000');

                            caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPS_' + rowData.idItemDesarrollo + '" class="verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                        }
                        else {

                            if (rowData.ejecutaAccion) {
                                caja = ' <label class="custom-control custom-radio" > <input checked type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPS_' + rowData.idItemDesarrollo + '" class=" verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            else {
                                caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPS_' + rowData.idItemDesarrollo + '" class="verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_default"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }

                        }


                        $(td).html(caja)

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        var caja = "";

                        if (isEmpty(rowData.ejecutaAccion)) {
                            caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPN_' + rowData.idItemDesarrollo + '" class="verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                        }
                        else {
                            if (rowData.ejecutaAccion == false) {
                                caja = ' <label class="custom-control custom-radio" > <input checked type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPN_' + rowData.idItemDesarrollo + '" class="verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }
                            else {
                                caja = ' <label class="custom-control custom-radio" > <input  type="radio" name="rdbP_' + rowData.idItemDesarrollo + '" id="rdbPN_' + rowData.idItemDesarrollo + '" class="verificaEvalPlan custom-control-input"><span class="custom-control-indicator custom_checkbox_danger"></span><span class="custom-control-description text-default">&nbsp;&nbsp;</span></label>'
                            }

                        }


                        $(td).html(caja)

                    }
                }







            ]

        }

        var tableWrapper = $('#tblItemsEvaluarPlan'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_itemsEvaluarPlan = $("#tblItemsEvaluarPlan").dataTable(parms);
        $('#tblItemsEvaluarPlan_length').css('display', 'none')

    },
    AtenInteListarPlanDesarrolloPacienteDet(idAtencion, idPaciente) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idPaciente', idPaciente);
        Cargando(1)
        oTable_itemsEvaluar.fnClearTable();

        $.ajax({
            method: "POST",
            url: "/Atencion/AtenInteListarDesarrolloPacientePendientesDet?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                console.log('items a evaluar', datos)
                if (datos.session) {

                    if (datos.lst.table.length > 0) {
                        oTable_itemsEvaluar.fnAddData(datos.lst.table);
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


    },
    AtenInteListarPlanIntegralDesarrolloPaciente(idPaciente) {
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);
        Cargando(1)
        oTable_itemsPlan.fnClearTable();
        console.log('idPaciente', idPaciente)
        $.ajax({
            method: "POST",
            url: "/Atencion/AtenInteListarPlanIntegralDesarrolloPaciente?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lst.table.length > 0) {
                        oTable_itemsPlan.fnAddData(datos.lst.table);
                    }
                    else {

                        var objrowTb = oTable_atenciones.api(true).row('.selected').data();
                        var formData = new FormData();
                        formData.append('idPaciente', objrowTb.idPaciente);

                        $.ajax({
                            method: "POST",
                            url: "/Atencion/AtenInteGenerarPlanTotal?area=ConsultaExterna",
                            //contentType: "application/json; charset=utf-8",
                            data: formData,
                            dataType: "json",
                            processData: false,
                            contentType: false,
                            async: false,
                            success: function (datos) {
                                Cargando(0)
                                if (datos.session) {
                                    if (datos.resp) {
                                        
                                      
                                        swal({
                                            title: "Niño Alto Riesgo",
                                            text: datos.mensaje + ",se creo el plan de desarrollo, vuelve abrir la atencion para continuar con el registro",
                                            icon: "success",
                                            buttons: true,
                                            dangerMode: true,
                                        }).then((willDelete) => {
                                                if (willDelete) {
                                                    $('a[href="#lsAtenciones"]').tab('show');
                                                    $("#btnBuscarAtenciones").click();
                                                } else {
                                                    $('a[href="#lsAtenciones"]').tab('show');
                                                    $("#btnBuscarAtenciones").click();
                                                }
                                            });
                                       
              
                                    }
                                    else {
                                        swal({
                                            title: 'Niño Alto Riesgo',
                                            text: datos.mensaje,
                                            type: 'danger',
                                        }).done();
                                    }

                                }



                            },
                            error: function (msg) {
                                alerta("3","Error al crear plan de niño de alto riesgo")
                                Cargando(0)
                            }
                        })

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


    },
    AtenInteListarDesarrolloPacienteDetPorId(idPlanIntegralPaciente, idPlanDesarrolloPaciente) {
        var midata = new FormData();
        midata.append('idPlanIntegralPaciente', idPlanIntegralPaciente);
        midata.append('idPlanDesarrolloPaciente', idPlanDesarrolloPaciente);
        Cargando(1)
        oTable_itemsEvaluarPlan.fnClearTable();

        $.ajax({
            method: "POST",
            url: "/Atencion/AtenInteListarDesarrolloPacienteDetPorId?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                console.log('datos prenatal', datos)
                if (datos.session) {

                    if (datos.lst.table.length > 0) {
                        oTable_itemsEvaluarPlan.fnAddData(datos.lst.table);
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


    },
    eventos() {
        
        $("#btnGurdarEvaluarPlan").on("click", function () {
            var objrowTb = oTable_itemsPlan.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }

            if (!isEmpty(objrowTb.idAtencion)) {
                alerta('3', 'No se puede modificar porque pertenece a una atencion');
                return false;
            }

            if ((isEmpty(objrowTb.evaluacion)) && objrowTb.estdoFechaProgramada == 1) {
                alerta('3', 'No se puede evaluar items superiores a la fecha actual ');
                return false;
            }

            if (!NinioAltoRiesgo.validaItemsEvaluarPlan()) {
                alerta('2', 'Seleccione todos los items a eveluar');
                return false;
            }

            var listaItmsEValuar = NinioAltoRiesgo.DevolverItemsEvaluarPlan();
            var formData = new FormData();
            formData.append('listaItmsEValuar', listaItmsEValuar);
            formData.append("idPlanDesarrolloPaciente", objrowTb.idPlanDesarrolloPaciente);
            formData.append("idPlanIntegralPaciente", objrowTb.idPlanIntegralPaciente);
            formData.append("fechaProgramada", objrowTb.fechaProgramada2);
            formData.append("fechaEjecucion", $("#txtFechaEjecucionEvaluarPlan").val());
            formData.append("idEstablecimiento",0);
            formData.append("evaluacion", NinioAltoRiesgo.obtenerEvaluacionEvaluarPlan());

            

            Cargando(1)
            oTable_itemsEvaluarPlan.fnClearTable();

            $.ajax({
                method: "POST",
                url: "/Atencion/Insert_AtenItenEvalPlnPendiente?area=ConsultaExterna",
                //contentType: "application/json; charset=utf-8",
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0)
                    if (datos.session) {
                        if (datos.resp) {
                            NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrowTb.idPaciente)
                            swal({
                                title: 'Niño Alto Riesgo',
                                text: datos.mensaje,
                                type: 'success',
                            }).done();
                            $("#modalEvaluarPlan").modal("hide");
                            
                        }
                        else {
                            swal({
                                title: 'Niño Alto Riesgo',
                                text: datos.mensaje,
                                type: 'danger',
                            }).done();
                        }
                      
                    }

                    

                },
                error: function (msg) {
                    Cargando(0)
                }
            })
        });
        $('#tblPlanPsicomotor tbody').on('click', 'tr', function () {
            
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_itemsPlan.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_itemsPlan.api(true).row($(this)).index();
            var row = oTable_itemsPlan.fnGetData(pos);

            //$('#idPaciente').val(row.idPaciente);
            //$('#idAtencion').val(row.idAtencion);
            //$('#idDestinoAtencion').val(row.idDestinoAtencion);
            //$('#txtDatos').html('N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)

        });

        $("#btnAbrirPlan").on("click", function () {
            var objrowTb = oTable_itemsPlan.api(true).row('.selected').data();
            $("#hsessionEvaluarPlan").html("");
            $("#txtFechaProgramadaEvaluarPlan").val("");
            $("#txtFechaEjecucionEvaluarPlan").val("");
            $("#txtEvaluacionEvaluarPlan").val("");
            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }
            else {
                
                $("#hsessionEvaluarPlan").html("Session: " + objrowTb.numeroSesion)
                $("#txtFechaProgramadaEvaluarPlan").val(objrowTb.fechaProgramada2)
                $("#txtFechaEjecucionEvaluarPlan").val(isEmpty(objrowTb.fechaEjecucion2) == true ? objrowTb.fechaProgramada2 : objrowTb.fechaEjecucion2)
                $("#txtEvaluacionEvaluarPlan").val(isEmpty(objrowTb.evaluacion) == true ? "" : objrowTb.evaluacion)
                NinioAltoRiesgo.AtenInteListarDesarrolloPacienteDetPorId(objrowTb.idPlanIntegralPaciente, objrowTb.idPlanDesarrolloPaciente)
                $("#modalEvaluarPlan").modal("show");
            } 
            
        })
        $("#btnCerrarEvaluarPlan").on("click", function () {
            $("#modalEvaluarPlan").modal("hide");
        })
 
        $(document).on('click', '.verificaEval', function () {
           
            $("#txtEvaluacion").val(NinioAltoRiesgo.obtenerEvaluacionDescripcion(NinioAltoRiesgo.obtenerEvaluacion()));
        });
        $(document).on('click', '.verificaEvalPlan', function () {

            $("#txtEvaluacionEvaluarPlan").val(NinioAltoRiesgo.obtenerEvaluacionDescripcion(NinioAltoRiesgo.obtenerEvaluacionEvaluarPlan()));
        });
        
    },
    
};

$(document).ready(function () {
    NinioAltoRiesgo.plugins();
    NinioAltoRiesgo.initDatablesItemsEvaluar();
    NinioAltoRiesgo.initDatablesItemsPlan();
    NinioAltoRiesgo.initDatablesItemsEvaluarPlan();
    NinioAltoRiesgo.eventos();


});



