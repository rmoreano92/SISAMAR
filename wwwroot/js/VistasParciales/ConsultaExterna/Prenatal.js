var fechaDia;
var chart4;
var chart5;
var Perinatal = {
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

    eventos() {

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

        $("#percentiles-tab").on('click', function () {

            chart4.resize();
            chart5.resize();

        });

        $("#btnCerrarListaControl").on('click', function () {
            $("#modalLstControl").modal('hide');
        });

        $("#btnotroControles").on('click', function () {
            Perinatal.ListaControlesByidCabecera($("#idCabecera").val())
            $("#modalLstControl").modal('show');
        });

        $("#btnAbrirModalCierreCiclo").on('click', function () {
            $('#txtFechaFinCiclo').val(fechaDia);
            $("#modalCierreCiclo").modal('show');
        });
        $("#btnCerrarModalCierreCiclo").on('click', function () {
            $("#modalCierreCiclo").modal('hide');
        });

        $("#btnAceptarCierreCiclo").on('click', function () {

            let formData = new FormData();
            formData.append("idProCabecera", $('#idCabecera').val())
            formData.append("estado", 2)
            formData.append("fechaFin", $('#txtFechaFinCiclo').val())
            formData.append("motivoCierreCiclo", $('#txtMotivoCierreCiclo').val())

            return HttpClient.Post('/Atencion/UpdateProCabecera?area=ConsultaExterna', formData).then(res => {
                Cargando(1)
                if (res.resp == 1) {

                    
                    $("#modalCierreCiclo").modal('hide');

                    swal({
                        title: 'Alerta',
                        html: 'Se iniciara un nuevo ciclo de embarazo',
                        icon: 'info',
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    })

                    $('#idCabecera').val(0)
                    $('#btnModificarAtenciones').trigger('click')

                     setTimeout(() => {
                        $(".modal-backdrop").hide();
                    }, 100);
                }
                Cargando(0)
            })
        });

        $("#cboTipoEmbrazo").on('change', function () {

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

        });
        /*-- Se coloca estos eventos en caso de que el medico manipule directo las casillas
         -- y esto permita reflejarse en el tb de control*/
        $("#txtFPP").on('change', function () {
            $("#txtFPPControl").val($("#txtFPP").val());
        });
        $("#txtSemanas").on('change', function () {
            $("#txtSemanaGestacional").val($("#txtSemanas").val());
        });
        $("#txtDias").on('change', function () {
            $("#txtDiasGestacional").val($("#txtDias").val());
        });
        /*fin de comentario*/

        /****rmoreano***/

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

        $("#chkCalculaFechaEco").on('change', function () {
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

                Perinatal.CalcularEdadGestacional($("#txtFEcog").val(), 2);

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

        $("#txtFUM").on('change', function () {

            if ($("#txtFUM").val() != "") {
                Perinatal.CalcularEdadGestacional($("#txtFUM").val(), 1);
            }
            else {
                alerta(3, "Debe ingresar la fecha de ultima regla");
                $("#txtFUM").focus();
            }

        });

        $('#btnCarnetPrenatal').on('click', async function () {
            var objrow = oTable_atenciones.api(true).row('.selected').data();
            console.log("btnCarnetPrenatal");
            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(objrow.idPaciente);
        });


        /****rmoreano***/

        ////KHOYOSI/////////////////
        $('#anteceObst-tab[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('#CardFormulaObstetrica .lineaConectorInput').remove();
            Perinatal.DibujarLineasFormulaObstetrica();
            //console.log(tabId);

        });
        ////KHOYOSI/////////////////
        
    },
    llenarRadioDefecto() {
        $('#rdbTbcNo').prop('checked', true)
        $('#rdbDiabNo').prop('checked', true)
        $('#rdbHiperNo').prop('checked', true)
        $('#rdbPreeNo').prop('checked', true)
        $('#rdbGemelaresNo').prop('checked', true)              //KHOYOSI 160725
        $('#rdbMalformacionesNo').prop('checked', true)              //KHOYOSI 160725
        $('#rdbOtrosNo').prop('checked', true)

        /*==========ANTECEDENTES PERINATALES/MATERNOS - PERSONALES=================*/
        $('#rdbTbcPAntePerNo').prop('checked', true)
        $('#rdbPDiabAntePerNo').prop('checked', true)
        $('#rdbHiperPAntePerNo').prop('checked', true)
        $('#rdbPreePAntePerNo').prop('checked', true)
        $('#rdbVIHAntePerNo').prop('checked', true)
        $('#rdbAlergAntePerNo').prop('checked', true)
        $('#rdbCMAntePerNo').prop('checked', true)
        $('#rdbVioAntePerNo').prop('checked', true)
        $('#rdbVacunaPreAntePerNo').prop('checked', true);        
        $('#rdbOtrosAntePerNo').prop('checked', true)

        $('#rdbLuesAntePerNo').prop('checked', true)
        $('#rdbTorchAntePerNo').prop('checked', true)
        $('#rdbITUtrimAntePerNo').prop('checked', true)
        $('#rdbUrocultivoAntePerNo').prop('checked', true)
        $('#rdbGermenAntePerNo').prop('checked', true)
        $('#rdbCovidAntePerNo').prop('checked', true)
        $('#rdbCovidAntePerNo').prop('checked', true)
        $('#rdbDengueAntePerNo').prop('checked', true)
        $('#rdbOtrosInfeccionesAntePerNo').prop('checked', true)

        $('#rdbPreClampsiaAntePerNo').prop('checked', true)
        $('#rdbEclampsiaAntePerNo').prop('checked', true)
        $('#rdbHttAntePerNo').prop('checked', true)
        $('#rdbDesnutricionAntePerNo').prop('checked', true)
        $('#rdbDiabetesMellitusAntePerNo').prop('checked', true)
        $('#rdbAnemiaAntePerNo').prop('checked', true)
        $('#rdbHipoHipertiroidesAntePerNo').prop('checked', true)
        $('#rdbOtrosEnfermedadesAntePerNo').prop('checked', true)

        $("#txtTbcPAntePer").val("");
        $("#txtPDiabeAntePer").val("");
        $("#txtHiperPAntePer").val("");
        $("#txtPreePAntePer").val("");
        $("#txtVihPAntePer").val("");
        $("#txtAlergiaPAntePer").val("");        
        $("#txtCMAntePer").val("");
        $("#txtVioAntePer").val("");
        $("#txtVacunaPreAntePer").val("");
        $("#txtOtrosPAntePer").val("");

        $("#txtLuesAntePer").val("");
        $("#txtTorchAntePer").val("");
        $("#txtITUtrimAntePer").val("");
        $("#txtUrocultivoAntePer").val("");
        $("#txtGermenAntePer").val("");
        $("#txtCovidAntePer").val("");
        $("#txtDengueAntePer").val("");
        $("#txtOtrosInfeccionesAntePer").val("");

        $("#txtPreClampsiaAntePer").val("");
        $("#txtEclampsiaAntePer").val("");
        $("#txtHttAntePer").val("");
        $("#txtDesnutricionAntePer").val("");
        $("#txtDiabetesMellitusAntePer").val("");
        $("#txtAnemiaAntePer").val("");
        $("#txtHipoHipertiroidesAntePer").val("");
        $("#txtOtrosEnfermedadesAntePer").val("");


        

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

        $("#txtCPNveces").val("");

        //Traigo la misma info porque ambas tiene q ser iguales
        $("#txtFPPControl").val("");
        $("#txtSemanaGestacional").val("");
        $("#txtDiasGestacional").val("");

        $("#txtTbc").val("");
        $("#txtDiabe").val("");
        $("#txtPree").val("");
        $("#txtHiper").val("");
        $("#txtOtrosFam").val("");

        

        

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
        $("#txtPreterminos").val("");
        $("#txtEdadGestMasPrematuro").val("");


        
        $("#txtPesoPregesta").val("");

        $('#chkCalculaFechaEco').prop('checked', false)


        $("#txtFinEmb").val("");
        $("#cboTerminacion").val("");
        $("#cbofracaso").val("");
        $("#cboEmbplaneado").val("");
        $('#chEtopico').prop('checked', false)

       

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

        //$("#txtCPNveces").attr('disabled', true);
        
        //$("#txtNroFetos").css("visibility", 'hidden');

        //imc
        $("#txtImc").val("");
        $("#txtImcDes").val("");
        //---------------------------
        $("#chkCalculaFechaEco").attr('disabled', false);

    },
    CalcularEdadGestacional(Fecha, Tipo) {
        var objrow = oTable_atenciones.api(true).row('.selected').data();
        var midata = new FormData();

        midata.append('FechaCita', objrow.fechaIngreso2);
        midata.append('Fecha', Fecha);
        midata.append('SemanasEco', $('#txtSemasEco').val());
        midata.append('DiasEco', $('#txtDiasEco').val());
        midata.append('Tipo', Tipo);

        $.ajax({
            method: "POST",
            url: "/Atencion/DevolverEdadGestacional?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (isEmpty(datos) == false) {
                    $("#txtSemanas").val(datos.cantSemanas);
                    $("#txtDias").val(datos.cantDias);
                    $("#txtFPP").val(datos.fpp);

                    $("#txtFPPControl").val($("#txtFPP").val());
                    $("#txtSemanaGestacional").val($("#txtSemanas").val());
                    $("#txtDiasGestacional").val($("#txtDias").val());

                    if (Tipo == 2) {
                        $("#txtFUM").val(datos.fum);
                    }
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al calcular la edad gestacional!", "2");
                }, 900)
            }
        });
    },
    
    ListaProCabByIdAten(IdAtencion, IdPaciente) {
        Perinatal.llenarRadioDefecto();//Esto llena por defecto valores normales y como antecedentes no a todos los checks,esto perimite que solo se triaga el valor si 
        var midata = new FormData();
        midata.append('IdAtencion', IdAtencion);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProCabeceraYControlByIdAtn?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                if (datos.table.length !== 0) {
                    $('#btnAbrirModalCierreCiclo').hide()
                    $(datos.table).each(function (i, obj) {
                        $("#idCabecera").val(obj.idProcabecera);
                        $("#idControl").val(obj.idControl);
                        //$('#txtFechaControl').val(obj.fechaControl);
                        $('#txtFechaControl').datepicker("setDate", obj.fechaControl);
                        $("#EstadoCabecera").val(obj.estado);
                        $('#btnInicializa').css('display', 'none');
                        $("#lblControl").html("Control Nro.: " + obj.idControl);
                        //Perinatal.ListaEvalEmergencia(IdAtencion);
                        Perinatal.EvaluacionObstetricaSeleccionar(IdAtencion);           //KOYOSI 16072025
                        //Perinatal.ListaAntecedentes(obj.idProcabecera);
                        Perinatal.ListaAntecedentes(IdPaciente, obj.idProcabecera);        //KHOYOSI 150725                        
                        Perinatal.ListaGinecoObst(IdAtencion)
                        Triaje.listaTriaje(IdAtencion)
                        if (obj.idControl > 3) { // se cambiara a 3 por solicitud de los medicos jdelgado
                            Perinatal.bloqueoDesbloqueo(true)
                        }
                        else {
                            Perinatal.bloqueoDesbloqueo(false)
                        }

                        $('.nav-tabs a[href="#controlPer"]').tab('show');
                        $('.nav-tabs a[href="#dtosBasales"]').tab('show');

                        Perinatal.CargarCuadros(obj.idProcabecera);

                    });
                }
                else {
                    Perinatal.bloqueoDesbloqueo(false);
                    Perinatal.ListaProCabByIdPaciente(IdPaciente)
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListaEvalEmergencia(IdAtencion) {
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
                        $("#txtFUM").val(obj.fechaUR);
                        $("#txtFPP").val(obj.fechaPP);
                        $("#txtFEcog").val(obj.fechaEco);
                        $("#txtSemanas").val(obj.edadGestacional);
                        $("#txtDias").val(obj.diasGestacional);

                        $("#txtCPNveces").val(obj.cnp);

                        //Traigo la misma info porque ambas tiene q ser iguales
                        $("#txtFPPControl").val($("#txtFPP").val());
                        $("#txtSemanaGestacional").val($("#txtSemanas").val());
                        $("#txtDiasGestacional").val($("#txtDias").val());

                        if (obj.calculaFE == 1) {
                            $('#chkCalculaFechaEco').prop('checked', true)
                        }
                        else {
                            $('#chkCalculaFechaEco').prop('checked', false)
                        }
                        if (obj.fechaEcoAct == 1) {
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

                        if (obj.diasGestacionalEco == 0) {
                            $("#txtDiasEco").val("");
                        }
                        else {
                            $("#txtDiasEco").val(obj.diasGestacionalEco);
                        }

                        if (obj.semanaGestacionalEco == 0) {
                            $("#txtSemasEco").val("");
                        }
                        else {
                            $("#txtSemasEco").val(obj.semanaGestacionalEco);
                        }
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

    /////////////////////KHOYOSI/////////////////////////////////////////
    EvaluacionObstetricaSeleccionar(IdAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', IdAtencion);
        $.ajax({
            method: "POST",
            url: "/Atencion/EvaluacionObstetricaSeleccionar?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                if (datos.respuesta.table.length !== 0) {
                    $(datos.respuesta.table).each(function (i, obj) {
                        //$("#txtFUM").val(obj.fechaUR);
                        $("#txtFUM").datepicker("setDate", obj.fechaURFormato);
                        //$("#txtFPP").val(obj.fechaPP);
                        $("#txtFPP").datepicker("setDate", obj.fechaPPFormato);
                        //$("#txtFEcog").val(obj.fechaEco);
                        $("#txtFEcog").datepicker("setDate", obj.fechaEcoFormato);
                        $("#txtSemanas").val(obj.edadGestacional);
                        $("#txtDias").val(obj.diasGestacional);

                        $("#txtCPNveces").val(obj.cnp);

                        //Traigo la misma info porque ambas tiene q ser iguales
                        //$("#txtFPPControl").val($("#txtFPP").val());
                        $("#txtFPPControl").datepicker("setDate", $("#txtFPP").val());
                        $("#txtSemanaGestacional").val($("#txtSemanas").val());
                        $("#txtDiasGestacional").val($("#txtDias").val());

                        if (obj.calculaFE == 1) {
                            $('#chkCalculaFechaEco').prop('checked', true)
                        }
                        else {
                            $('#chkCalculaFechaEco').prop('checked', false)
                        }
                        if (obj.fechaEcoAct == 1) {
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

                        if (obj.diasGestacionalEco == 0) {
                            $("#txtDiasEco").val("");
                        }
                        else {
                            $("#txtDiasEco").val(obj.diasGestacionalEco);
                        }

                        if (obj.semanaGestacionalEco == 0) {
                            $("#txtSemasEco").val("");
                        }
                        else {
                            $("#txtSemasEco").val(obj.semanaGestacionalEco);
                        }
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
    /////////////////////KHOYOSI/////////////////////////////////////////

    ListaGinecoObst(IdAtencion) {
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

                    $('#txtDilatacion').val(datos.table[0].lDilatacion);
                    $('#txtIncorporacion').val(datos.table[0].lIncorporacion);
                    $('#txtAlPresent').val(datos.table[0].lAlPresent);
                    $('#txtVariedPresent').val(datos.table[0].dVarPresent);

                    datos.table[0].membranasRotas == 1 ? $('#rdbMenranasSi').prop('checked', true) : $('#rdbMenranasNo').prop('checked', true);
                    datos.table[0].lProcubito == 1 ? $('#rdbProcubitoSi').prop('checked', true) : $('#rdbProcubitoNo').prop('checked', true);
                    datos.table[0].lProlapso == 1 ? $('#rdbProlapsoSi').prop('checked', true) : $('#rdbProlapsoNo').prop('checked', true);
                    datos.table[0].DSangradoV == "SI" ? $('#rdbSangradoVSi').prop('checked', true) : $('#rdbSangradoVNo').prop('checked', true);

                    datos.table[0].lLiquidoA == 1 ? $('#rdbLiqAmnClaro').prop('checked', true) : datos.table[0].lSituacion == 2 ? $('#rdbMenranasMeconial').prop('checked', true) : datos.table[0].lSituacion == 3 ? $('#rdbLiqAmnSanguinolento').prop('checked', true) : 0

                    datos.table[0].DSangradoV == "SI" ? $('#rdbSangradoVSi').prop('checked', true) : $('#rdbSangradoVNo').prop('checked', true);

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListaProCabByIdPaciente(idPaciente) {
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProCabecera?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                console.log("datos", datos)
                if (datos.table.length !== 0) {

                    if (datos.table.length > 1) {
                        alerta(3, 'error tiene activo otro ciclo de embarazo')
                        return false;
                    }
                    else {
                        $('#btnAbrirModalCierreCiclo').show()
                        if (datos.table.length == 1) {
                            $(datos.table).each(function (i, obj) {
                                var nroControl = obj.utlmControl + 1
                                $("#idCabecera").val(obj.idProcabecera);
                                $("#idControl").val(nroControl);
                                $("#EstadoCabecera").val(obj.estado);
                                $('#btnInicializa').css('display', 'none');
                                $("#lblControl").html("Control Nro.: " + nroControl);

                                //se asume solo la fecha de la cita no la fecha del dia 
                                var objrow = oTable_atenciones.api(true).row('.selected').data();
                                //$('#txtFechaControl').val(objrow.fechaIngreso2);
                                $('#txtFechaControl').datepicker("setDate", objrow.fechaIngreso2);
                                //se asume solo la fecha de la cita no la fecha del dia - FIN

                                //$('#txtFechaControl').val(fechaDia);

                                //Perinatal.ListaEvalEmergencia(obj.utlmIdAtn);
                                Perinatal.EvaluacionObstetricaSeleccionar(obj.utlmIdAtn);           //KOYOSI 16072025
                                //Perinatal.ListaAntecedentes(obj.idProcabecera);
                                Perinatal.ListaAntecedentes(obj.idPaciente, obj.idProcabecera);        //KHOYOSI 150725
                                Perinatal.ListaGinecoObst(obj.utlmIdAtn)
                                Perinatal.listaTriajePerintal(obj.utlmIdAtn)
                                // tiene que estar en esta posicion para respetar el orden de carga
                                if ($("#chkCalculaFechaEco").is(':checked')) {
                                    if ($("#txtFEcog").val() == "") {
                                    } else {
                                        Perinatal.CalcularEdadGestacional($("#txtFEcog").val(), 2);
                                    }

                                }
                                else {

                                    Perinatal.CalcularEdadGestacional($("#txtFUM").val(), 1);
                                }
                                //Fin------------------------------------------------------------------
                                if (nroControl > 2) {
                                    Perinatal.bloqueoDesbloqueo(true)
                                }
                                else {
                                    //Perinatal.bloqueoDesbloqueo(false)
                                }

                                Perinatal.CargarCuadros(obj.idProcabecera);

                                $('.nav-tabs a[href="#controlPer"]').tab('show');
                                $('.nav-tabs a[href="#dtosBasales"]').tab('show');

                                swal({
                                    title: 'Controles',
                                    html: "Se iniciara el control <b>Nro.: " + nroControl + "</b>, los datos que se muestran son del control anterior. ",
                                    icon: 'info',
                                }).done();

                            });

                        }
                        else {
                            Perinatal.bloqueoDesbloqueo(false)
                            Perinatal.llenarRadioDefecto();
                            
                            $("#idCabecera").val(0);
                            $("#idControl").val(0);
                            $("#EstadoCabecera").val(0);
                            $('#btnInicializa').css('display', 'block');
                            $("#lblControl").html("Control Nro.: " + 1);

                            $('.nav-tabs a[href="#entrevistaPer"]').tab('show');

                            swal({
                                title: 'Controles',
                                html: "Inicio del control prenatal, este sera su control Nro.: 1",
                                icon: 'info',
                            }).done();
                        }

                    }


                }
                else {
                    $("#idCabecera").val(0);
                    $("#idControl").val(0);
                    $("#EstadoCabecera").val(0);
                    $("#lblControl").html("Mi primer control");


                    //se asume solo la fecha de la cita no la fecha del dia 
                    var objrow = oTable_atenciones.api(true).row('.selected').data();
                    //$('#txtFechaControl').val(objrow.fechaIngreso2);
                    $('#txtFechaControl').datepicker("setDate", objrow.fechaIngreso2);
                    //se asume solo la fecha de la cita no la fecha del dia - FIN
                    //$('#txtFechaControl').val(fechaDia);

                    $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                    $('.nav-tabs a[href="#anteceFamili"]').tab('show');
                    $('.nav-tabs a[href="#evalExamenes"]').tab('show');
                    //Respetar el orden porque cada uno desencadena varias cosas
                    Perinatal.llenarRadioDefecto();
                    Perinatal.CargarCuadros(0);

                    Perinatal.ListaAntecedentes(Variables.IdPaciente, 0);        //KHOYOSI 150725

                    $('#btnAbrirModalCierreCiclo').hide()
                    swal({
                        title: 'Controles',
                        html: "Inicio del control prenatal, este sera su primer control",
                        icon: 'info',
                    }).done();
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })


    },

    listaCatalogo(idCatalogo) {
        var midata = new FormData();
        midata.append('idCatalogo', idCatalogo);
        $.ajax({
            url: "/Atencion/ListaCatalogoCombo?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {

                if (idCatalogo == 43) {
                    $('#cboTerminacion').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboTerminacion').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 44) {
                    $('#cboAborto').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboAborto').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 45) {
                    $('#cbofracaso').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cbofracaso').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 46) {
                    $('#cboEmbplaneado').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboEmbplaneado').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar combosCatalogo!", "2");
                }, 900)
            }
        });
    },

    listaTiposEmb() {

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
    cargarInicial() {

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaDia = dia + "/" + mes + "/" + yyy

        /*$('#txtFechaAtencion').val(fechaDia);*/
        //fechaDia
        //$('#txtFechaControl').val(fechaDia);
        $("#txtFEcog").prop("disabled", true);
    },
    bloqueoDesbloqueo(tipo) {

        if (tipo == true) {
            $("#txtFUM").attr('disabled', true);
            $("#txtFPP").attr('disabled', true);            
            $("#txtCPNveces").attr('disabled', true);
            $("#chkMuestraEco").attr('disabled', true);
            $("#chkCalculaFechaEco").attr('disabled', true);
            $("#txtFEcog").attr('disabled', true);
            $("#txtSemanas").attr('disabled', true);
            $("#txtDias").attr('disabled', true);
            $("#txtSemasEco").attr('disabled', true);
            $("#txtDiasEco").attr('disabled', true);


        }
    },
    initDatablesControles() {


        var parms = {
            "scrollY": "300px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            "autoWidth": false,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '20%',
                    targets: 0,
                    data: "idControl",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "consultorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 3,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 4,
                    data: "cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }



            ]

        }

        var tableWrapper = $('#tblListaControl'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_controles = $("#tblListaControl").dataTable(parms);
        $('#tblListaControl_length').css('display', 'none')

    },

    //ListaAntecedentes(idProCabecera) {
    ListaAntecedentes(idPaciente, idProCabecera) {         //KHOYOSI 150725
        //alert(idProCabecera)
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);          //KHOYOSI 150725
        //midata.append('idAtencion', idAtencion);          //KHOYOSI 150725
        midata.append('idProCabecera', idProCabecera);                

        $.ajax({
            method: "POST",
            //url: "/Atencion/AntecedentesXidCabecera?area=ConsultaExterna",
            url: "/Atencion/ListaAntecedentesPaciente?area=ConsultaExterna",            //KHOYOSI 150725
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                //if (datos.table.length > 0) {
                if (datos.respuesta.table.length > 0) {
                    let antFam = datos.respuesta.table[0];                    

                    /************************** ANTECEDENTES  FAMILIARES*****************************/
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

                }

                if (datos.respuesta.table1.length > 0) {
                    let antPer = datos.respuesta.table1[0];

                    /************************** ANTECEDENTES  PERSONALES*****************************/

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
                }
                               

                if (datos.respuesta.table2.length > 0) {
                    let antObst = datos.respuesta.table2[0];

                    /************************** ANTECEDENTES  OBSTETRICOS *****************************/

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
                }

                if (datos.respuesta.table3.length > 0) {
                    let antInfMat = datos.respuesta.table3[0];

                    /************************** INFECCIONES MATERNAS *****************************/

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
                }

                if (datos.respuesta.table4.length > 0) {
                    let antEnfMat = datos.respuesta.table4[0];

                    /************************** ENFERMEDADES MATERNAS *****************************/

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
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ListaControlesByidCabecera(idCabecera) {

        Cargando(1)
        oTable_controles.fnClearTable();

        var midata = new FormData();
        midata.append('idCabecera', idCabecera);

        $.ajax({
            method: "POST",
            url: "/Atencion/ListaControlesByidCabecera?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                Cargando(0)
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {
                        oTable_controles.fnAddData(datos.table);
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
    listaTriajePerintal(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        $.ajax({
            url: "/Atencion/ListaTriaje?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                
                if (datos.data.table.length > 0) {

                    $("#txtTalla").val(datos.data.table[0].triajeTalla);


                }
                else {
                    $("#txtPA").val("");
                    $("#txtT").val("");
                    $("#txtFr").val("");
                    $("#txtFc").val("");
                    $("#txtPeso").val("");
                    $("#txtTalla").val("");
                    $("#txtImc").val("")
                }
            },
            error: function (msg) {
                alerta("ERROR", "Error listar triaje!", "2");
            }
        });
    },

    /*RMOREANO CUADROS*/
    CargarCuadros(idProCabecera) {

        /*****************************PESO Y ALTURA UTERINA***********************************/
        var midata1 = new FormData();
        var dataPeso
        var dataAU


        midata1.append('idProCabecera', idProCabecera);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListadoPesoMaternoPercentil?area=ConsultaExterna",
            data: midata1,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (data) {
                dataPeso = data.table;

            },
            error: function (msg) {
                //  Cargando(0)
            }
        });

        $.ajax({
            method: "POST",
            url: "/Atencion/ListadoAUMaternoPercentil?area=ConsultaExterna",
            data: midata1,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (data) {
                dataAU = data.table;

            },
            error: function (msg) {
                //  Cargando(0)
            }
        });
        /**********************************************************************************/


        chart4 = c3.generate({
            //size: {
            //    width: 461.5
            //},
            title: {
                text: 'INCREMENTO DE PESO MATERNO'
            },
            bindto: '#chart4',
            data: {
                json: dataPeso,
                keys: {
                    x: 'semana',
                    value: ['percentil25', 'percentil90', 'difPeso'],
                },
                labels: true
            },
            axis: {
                x: {
                    x: ['semana'],
                    type: "category",
                    tick: {
                        rotate: -45,
                        multiline: false
                    }

                }

            }

        });

        chart5 = c3.generate({
            //size: {
            //    width: 461.5
            //},
            title: {
                text: 'INCREMENTO DE ALTURA UTERINA'
            },
            bindto: '#chart5',
            data: {
                json: dataAU,
                keys: {
                    x: 'semana',
                    value: ['percentil10', 'percentil90', 'alturaUterina'],
                },
                labels: true
            },
            axis: {
                x: {
                    x: ['semana'],
                    type: "category",
                    tick: {
                        rotate: -45,
                        multiline: false
                    }

                }

            }

        });

        chart4.data.names({ percentil25: 'Percentil 25', percentil90: 'Percentil 90', difPeso: 'Peso' });
        chart5.data.names({ percentil10: 'Percentil 10', percentil90: 'Percentil 90', alturaUterina: 'Altura Uterina' });



    },
    /**************/

    async CargarFormData(formData) {
        
        ///////////////EXTERNO///////////
        //formData.append('fechaIngreso', objrow.fechaIngreso);
        //formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
        //formData.append('antecedPatologico', $('#txtPatologicos').val());
        //formData.append('antecedObstetrico', $('#txtObstetricos').val());
        //formData.append('antecedAlergico', $('#txtAlergias').val());
        //formData.append('antecedFamiliar', $('#txtFamiliares').val());
        //formData.append('antecedentes', $('#txtOtros').val());
        /////////////////////////////////

         /////////////////ATENCION DATOS ADICIONALES////////////////////////////////
        formData.append("Apetito", $("#txtApetito").val());
        formData.append("Suenio", $("#txtSuenio").val());
        formData.append("Sed", $("#txtSed").val());
        formData.append("Orina", $("#txtOrina").val());
        formData.append("Deposiciones", $("#txtDiposiciones").val());

        /////////////////////////////ATENCION TRIAJE/////////////////////////////
        formData.append('CitaMotivo', $('#txtMotivoConsultaPeri').val());


        /////////////////////////////CONTROLES Y CABECERA/////////////////////////////
        formData.append('IdPrograma', 1);
        formData.append('IdProcabecera', $("#idCabecera").val());

        if ($("#idControl").val() == 0) {
            formData.append('IdControl', 1);
        }
        else {
            formData.append('IdControl', $("#idControl").val());
        }

        formData.append('FechaControl', $('#txtFechaControl').val());

        /////////////////////////////DATOS EVAL. OBSTETRICA/////////////////////////////
        formData.append("IdAtencion", Variables.IdAtencion);
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

        /////////////////////////////EXAMEN GIENCOOBSTETRA//////////////////////////////////////////
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



        //pelvis
        formData.append("LPelvisGinecoide", $('#rdbPelvisGSI').prop('checked') == true ? 1 : 0);
        formData.append("LCompatibilidadF", $('#rdbCompativilidadSI').prop('checked') == true ? 1 : $('#rdbCompativilidadNo').prop('checked') == true ? 2 : 0);
        //nuevos

        return formData;

    },

    DibujarLineasFormulaObstetrica() {
        ConectarInputs("CardFormulaObstetrica", "txtGestasP", "txtAbortos");
        ConectarInputs("CardFormulaObstetrica", "txtGestasP", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "txtPartos", "txtVaginales");
        ConectarInputs("CardFormulaObstetrica", "txtPartos", "txtCesareas");
        ConectarInputs("CardFormulaObstetrica", "txtVaginales", "txtNacMuertos");
        ConectarInputs("CardFormulaObstetrica", "txtCesareas", "txtNacidosVivos");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txtViven");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txt1Sem");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txtDesp1Sem");

        ConectarInputs("CardFormulaObstetrica", "form_ch2500", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_chMult", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_ch37Sem", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_ch4000g", "txtPartos");
    },

    Iniciar() {
        Perinatal.plugins();
        Perinatal.cargarInicial();
        Perinatal.eventos();
        Perinatal.initDatablesControles();
        Perinatal.listaTiposEmb();
        Perinatal.listaCatalogo(43);
        Perinatal.listaCatalogo(44);
        Perinatal.listaCatalogo(45);
        Perinatal.listaCatalogo(46);
    }

};

