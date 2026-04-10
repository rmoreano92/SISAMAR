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

        $("#txtPartos").on('change', function () {
            $("#txtGestasP").val(parseInt(($('#txtAbortos').val() == "") ? 0 : $('#txtAbortos').val()) + parseInt(($('#txtPartos').val() == "") ? 0 : $('#txtPartos').val()))
        })

        $("#txtViven").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

        $("#txt1Sem").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

        $("#txtDesp1Sem").on('change', function () {
            $("#txtNacidosVivos").val(parseInt(($('#txtViven').val() == "") ? 0 : $('#txtViven').val()) + parseInt(($('#txt1Sem').val() == "") ? 0 : $('#txt1Sem').val()) + parseInt(($('#txtDesp1Sem').val() == "") ? 0 : $('#txtDesp1Sem').val()))
        })

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
                    swal({
                        title: 'Alerta',
                        text: 'Se iniciara un nuevo ciclo de embarazo',
                        type: 'info',
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    })

                    $('#idCabecera').val(0)
                    $('#btnModificarAtenciones').trigger('click')
                    $("#modalCierreCiclo").modal('hide');
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

        /****rmoreano***/
    },
    llenarRadioDefecto() {
        $('#rdbTbcNo').prop('checked', true)
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
                        $('#txtFechaControl').val(obj.fechaControl);
                        $("#EstadoCabecera").val(obj.estado);
                        $('#btnInicializa').css('display', 'none');
                        $("#lblControl").html("Control Nro.: " + obj.idControl);
                        Perinatal.ListaEvalEmergencia(IdAtencion);
                        Perinatal.ListaAntecedentes(obj.idProcabecera);
                        Perinatal.ListaGinecoObst(IdAtencion)
                        Triaje.listaTriaje(IdAtencion)
                        if (obj.idControl > 2) {
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
                                $('#txtFechaControl').val(objrow.fechaIngreso2);
                                //se asume solo la fecha de la cita no la fecha del dia - FIN

                                //$('#txtFechaControl').val(fechaDia);

                                Perinatal.ListaEvalEmergencia(obj.utlmIdAtn);
                                Perinatal.ListaAntecedentes(obj.idProcabecera);
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
                                    text: "Se iniciara el control <b>Nro.: " + nroControl + "</b>, los datos que se muestran son del control anterior. ",
                                    type: 'info',
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
                                text: "Inicio del control prenatal, este sera su control Nro.: 1",
                                type: 'info',
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
                    $('#txtFechaControl').val(objrow.fechaIngreso2);
                    //se asume solo la fecha de la cita no la fecha del dia - FIN
                    //$('#txtFechaControl').val(fechaDia);

                    $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                    $('.nav-tabs a[href="#anteceFamili"]').tab('show');
                    $('.nav-tabs a[href="#evalExamenes"]').tab('show');
                    //Respetar el orden porque cada uno desencadena varias cosas
                    Perinatal.llenarRadioDefecto();
                    Perinatal.CargarCuadros(0);
                    $('#btnAbrirModalCierreCiclo').hide()
                    swal({
                        title: 'Controles',
                        text: "Inicio del control prenatal, este sera su primer control",
                        type: 'info',
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
    ListaAntecedentes(idProCabecera) {
        //alert(idProCabecera)
        var midata = new FormData();
        midata.append('idProCabecera', idProCabecera);
        $.ajax({
            method: "POST",
            url: "/Atencion/AntecedentesXidCabecera?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                if (datos.table.length > 0) {


                    /************************** ANTECEDENTES  FAMILIARES*****************************/
                    datos.table[0].tbc == true ? $("#rdbTbcSi").prop('checked', true) : $('#rdbTbcNo').prop('checked', true);
                    datos.table[0].diabetes == true ? $("#rdbDiabSi").prop('checked', true) : $('#rdbDiabNo').prop('checked', true);
                    datos.table[0].preeclampsiaEclampsia == true ? $("#rdbPreeSi").prop('checked', true) : $('#rdbPreeNo').prop('checked', true);
                    datos.table[0].hipertencion == true ? $("#rdbHiperSi").prop('checked', true) : $('#rdbHiperNo').prop('checked', true);
                    datos.table[0].otraCondMedGrave == true ? $("#rdbOtrosSi").prop('checked', true) : $('#rdbOtrosNo').prop('checked', true);
                    $("#txtTbc").val(datos.table[0].tbcDescripcion);
                    $("#txtDiabe").val(datos.table[0].diabetesDescripcion);
                    $("#txtPree").val(datos.table[0].preeclampsiaEclampsiaDescripcion);
                    $("#txtHiper").val(datos.table[0].hipertencionDescripcion);
                    $("#txtOtrosFam").val(datos.table[0].otraCondMedGraveDescripcion);

                    /************************** ANTECEDENTES  PERSONALE*****************************/

                    datos.table1[0].tbc == true ? $("#rdbTbcPSi").prop('checked', true) : $("#rdbTbcPNo").prop('checked', true)
                    $("#txtTbcP").val(datos.table1[0].tbcDescripcion);

                    datos.table1[0].diabetes == true ? $('#rdbPDiabSi').prop('checked', true) : $('#rdbPDiabNo').prop('checked', true);
                    $("#txtPDiabe").val(datos.table1[0].diabetesDescripcion);

                    datos.table1[0].preeclampsiaEclampsia == true ? $('#rdbPreePSi').prop('checked', true) : $('#rdbPreePNo').prop('checked', true);;
                    $("#txtPreeP").val(datos.table1[0].preeclampsiaEclampsiaDescripcion);

                    datos.table1[0].vih == true ? $('#rdbVIHSi').prop('checked', true) : $('#rdbVIHNo').prop('checked', true)
                    $("#txtVihP").val(datos.table1[0].vihDescripcion);

                    datos.table1[0].alergia == true ? $('#rdbAlergSi').prop('checked', true) : $('#rdbAlergNo').prop('checked', true);
                    $("#txtAlergiaP").val(datos.table1[0].alergiaDescripcion);

                    datos.table1[0].otros == true ? $('#rdbOtrosAntePerSi').prop('checked', true) : $('#rdbOtrosAntePerNo').prop('checked', true);
                    $("#txtOtrosP").val(datos.table1[0].otrosDescripcion);

                    datos.table1[0].cirugiaMayor == true ? $('#rdbCMSi').prop('checked', true) : $('#rdbCMNo').prop('checked', true);
                    $("#txtCM").val(datos.table1[0].cirugiaMayorDescripcion);

                    datos.table1[0].violencia == true ? $('#rdbVioSi').prop('checked', true) : $('#rdbVioNo').prop('checked', true);
                    $("#txtVio").val(datos.table1[0].violenciaDescripcion);

                    datos.table1[0].hipertencion == true ? $('#rdbHiperPSi').prop('checked', true) : $('#rdbHiperPNo').prop('checked', true);
                    $("#txtHiperP").val(datos.table1[0].hipertencionDescripcion)

                    //alert(datos.table1[0].vacunaPrevia);
                    datos.table1[0].vacunaPrevia == true ? $('#rdbVacunaPreSi').prop('checked', true) : $('#rdbVacunaPreNo').prop('checked', true);
                    $("#txtVacunaPre").val(datos.table1[0].vacunaPreviaDescripcion);



                    /************************** ANTECEDENTES  OBSTE*****************************/

                    $("#txtGestasP").val(datos.table2[0].gestas);
                    $("#txtAbortos").val(datos.table2[0].abortos);
                    $("#txtVaginales").val(datos.table2[0].vaginales);
                    $("#txtNacidosVivos").val(datos.table2[0].nacidosVivos);
                    $("#txtViven").val(datos.table2[0].viven);
                    $("#txtPartos").val(datos.table2[0].partos);
                    $("#txtCesareas").val(datos.table2[0].cesareas);
                    $("#txtNacMuertos").val(datos.table2[0].nacidosMuertos);
                    $("#txt1Sem").val(datos.table2[0].muerto1Seman);
                    $("#txtDesp1Sem").val(datos.table2[0].despues1Seman);
                    $("#txtPesoPregesta").val(datos.table2[0].pesoPregestacional);

                    $("#txtPar1").val(datos.table2[0].p1);
                    $("#txtPar2").val(datos.table2[0].p2);
                    $("#txtPar3").val(datos.table2[0].p3);
                    $("#txtPar4").val(datos.table2[0].p4);

                    $("#cho3").prop('checked', datos.table2[0].ceromastres);//cho3
                    $("#ch2500").prop('checked', datos.table2[0].menor2500gr);
                    $("#chMult").prop('checked', datos.table2[0].multiple);
                    $("#ch37Sem").prop('checked', datos.table2[0].memor37sm);
                    $("#ch4000g").prop('checked', datos.table2[0].mayor4000g);
                    $("#chEtopico").prop('checked', datos.table2[0].embarazoEctopico);



                    if (datos.table2[0].fechaFinEmbAnt2 == '01/01/1900') {
                        $("#txtFinEmb").val("");
                    }
                    else {
                        $("#txtFinEmb").val(datos.table2[0].fechaFinEmbAnt2);
                    }

                    $("#cboTerminacion").val(datos.table2[0].idTerminacion);
                    $("#cboAborto").val(datos.table2[0].idAborto);
                    $("#cbofracaso").val(datos.table2[0].fracasoMetodo);
                    $("#cboEmbplaneado").val(datos.table2[0].embarazoPlaneado);
                    $("#cboTerminacion").change();
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

                if (datos.table.length > 0) {

                    $("#txtTalla").val(datos.table[0].triajeTalla);


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



    }
    /**************/
};

$(document).ready(function () {

    Perinatal.plugins();
    Perinatal.cargarInicial();
    Perinatal.eventos();
    Perinatal.initDatablesControles();
    Perinatal.listaTiposEmb();
    Perinatal.listaCatalogo(43);
    Perinatal.listaCatalogo(44);
    Perinatal.listaCatalogo(45);
    Perinatal.listaCatalogo(46);



});


