let NotaIngreso = {
    esNeo: false,


    ListaPacientesHosp: function () {

        Cargando(1)
        oTable_atencionesEmer.fnClearTable();

        var midata = new FormData();
        midata.append('historiaClinica', $('#txtNroHistoriaBuscar').val());
        midata.append('idCuentaAtencion', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('apellidoPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fechaIngreso', $('#txtFechaAtencionBuscar').val());
        midata.append('idServicio', $('#cboServicio').val());
        midata.append('fechaTransferencia', $('#txtFechaTransferencia').val());

        $.ajax({ //jdelgado010
            method: "POST",
            url: "/NotaIngreso/ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFecha?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    console.log("consulta este")
                    if (datos.lstPacientesHops.table.length > 0) {
                        oTable_atencionesEmer.fnAddData(datos.lstPacientesHops.table);
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



    HabilitarPestanias: async function (row, tipo) {

        let antecedentes = await PermisoGeneral.SeleccionaParametros(1009)
        let examenFisico = await PermisoGeneral.SeleccionaParametros(1010)
        let examenObstetrico = await PermisoGeneral.SeleccionaParametros(1011)
        let trabajoParto = await PermisoGeneral.SeleccionaParametros(1012)

        if (antecedentes[0].valorTexto.split(',').includes(row.idServicioEgreso.toString())) {
            $('#motivo-tab').show()
            $('#antecedentesGenerales-tab').show()
            $('#examenFisico-tab').show()

            $('#motivoNeo-tab').hide()
            $('#antecedentesGeneralesNeo-tab').hide()
            $('#examenFisicoNeo-tab').hide()

            $("#motivo-tab").click(); // JDELGADO005

            NotaIngreso.esNeo = false

            NotaIngresoRegistrar.IniciaFormulario(tipo);
        } else {
            $('#motivo-tab').hide()
            $('#antecedentesGenerales-tab').hide()
            $('#examenFisico-tab').hide()

            $('#motivoNeo-tab').show()
            $('#antecedentesGeneralesNeo-tab').show()
            $('#examenFisicoNeo-tab').show()

            $("#motivoNeo-tab").click(); // JDELGADO005

            NotaIngreso.esNeo = true

            NotaIngresoRegistrar.IniciaFormulario(tipo);
        }

        if (examenFisico[0].valorTexto.split(',').includes(row.idServicioEgreso.toString())) {
            $('#examenFisico-tab').html('<i class="fa-solid fa-stethoscope mr-1"></i>Examen Físico')

        } else {
            $('#examenFisico-tab').html('<i class="fa-solid fa-stethoscope mr-1"></i>Examen Físico Neonatal')
        }

        if (examenObstetrico[0].valorTexto.split(',').includes(row.idServicioEgreso.toString())) {
            $('#examenObsetrico-tab-link').show()
        } else {
            $('#examenObsetrico-tab-link').hide()
        }


        console.log(row)




        console.log("antecedentes", antecedentes[0].valorTexto.split(','), antecedentes[0].valorTexto.split(',').includes(row.idServicioEgreso.toString()))
        console.log("examenFisico", examenFisico[0].valorTexto.split(','), examenFisico[0].valorTexto.split(',').includes(row.idServicioEgreso.toString()))
        console.log("examenObstetrico", examenObstetrico[0].valorTexto.split(','), examenObstetrico[0].valorTexto.split(',').includes(row.idServicioEgreso.toString()))
        console.log("trabajoParto", trabajoParto[0].valorTexto.split(','), trabajoParto[0].valorTexto.split(',').includes(row.idServicioEgreso.toString()))
    }

    
}


// JDELGADO010
var NOTAINGRESO = function () {

    let estadoGrabarAtencion = false

    var permisoFirma4Identity = ''
    var permisoClasiPaciente = ''
    

    var plugins = function () {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaAtencionBuscar, #txtFUR, #txtFUE, #txtFPP, #txtFechaTransferencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
    }

    var limpiarValores = function () {

    }
    var fehaDiaActual = function () {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy
        return fechaP
    }
    var CargaInicial = function () {


        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionBuscar').val(fechaP);

        //esto lo realizo para reutilizar todo el js
        //if ($("#hditembar").val() == 1412) {
        //    initDatablesPacintesHosp();
        //}
        //else {
        //    initDatablesPacintesEvalEmgHosp();
        //}
        $('.div_bloquea').hide()
    }
    var limpiarCampos = function () {
        $("#txtFUR").val("");
        $("#txtFUE").val("");
        $("#txtEdadGestacionalSemanas").val("");
        $("#txtEdadGestacionalDias").val("");
        $("#txtDias").val("");
        $("#txtGestas").val("");
        $("#txtPara").val("");
        $("#txtImpresion").val("");
        $("#txtPlan").val("");

        // cargo por defecto la hora
        var dt = new Date();
        var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())
        $('#HoraInicioAtencion').val(time);
    }
    

    var ListaAtencionByCuenta = function (idCuenta) {
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        var dataAtencin = {};
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.lstAtenciones.table.length > 0) {
                        $('#txtPlan').val(datos.lstAtenciones.table[0].planTrabajo);
                        $('#txtImpresion').val(datos.lstAtenciones.table[0].tratamiento);
                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        return dataAtencin;
    }
    
    var bloqueaFetos = function () {
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
    }
    
    var activarbdDiferidos = function (valor) {
        if (valor == 1) {

        }
        else {

            $('#rdbMenranasNo').prop('checked', true)
            $('#rdbProcubitoNo').prop('checked', true)
            $('#rdbProlapsoNo').prop('checked', true)
            $('#rdbSangradoVNo').prop('checked', true)

            $('#rdbProcubitoSi').prop('checked', true)
            $('#rdbMenranasSi').prop('checked', true)
            $('#rdbProlapsoSi').prop('checked', true)
            $('#rdbSangradoVSi').prop('checked', true)

        }

    }

    var bloquearCampos = function () { // JDELGADO001.2
        $('#txtMotivoAtencion').attr('disabled', true);
        $('#txtSignosSintomas').attr('disabled', true);
        $('#txtCU').attr('disabled', true);
        $('#txtPLA').attr('disabled', true);
        $('#txtMF').attr('disabled', true);
        $('#txtSV').attr('disabled', true);
        $('#txtFiebre').attr('disabled', true);
        $('#txtSg').attr('disabled', true);
        $('input[name=rdbCu]').attr("disabled", true);
        $('input[name=rdbPLA]').attr("disabled", true);
        $('input[name=rdbMF]').attr("disabled", true);
        $('input[name=rdbSV]').attr("disabled", true);
        $('input[name=rdbFiebre]').attr("disabled", true);
        $('input[name=rdbSG]').attr("disabled", true);
        $('#txtFUR').attr('disabled', true);
        $('#txtFUE').attr('disabled', true);
        $('#txtFPP').attr('disabled', true);
        $('#chkFUR').attr('disabled', true);
        $('#chkFUE').attr('disabled', true);
        $('#txtEdadGestacionalSemanas').attr('disabled', true);
        $('#txtEdadGestacionalDias').attr('disabled', true);
        $('#txtCpn').attr('disabled', true);
        $('#txtGestas').attr('disabled', true);
        $('#txtPara').attr('disabled', true);
        $('#txtPin').attr('disabled', true);
        $('#txtDeltaPeso').attr('disabled', true);
        $('#txtMadPulmonar').attr('disabled', true);
        $('#txtMadCervical').attr('disabled', true);
        $('#txtAntecedentesMedicos').attr('disabled', true);
        $('#txtRam').attr('disabled', true);
        $('#txtAntecedentesQuirurgico').attr('disabled', true);
        $('input[name=rdbPulmonar]').attr("disabled", true);
        $('input[name=rdbCervical]').attr("disabled", true);
        $('input[name=rdbTransfucion]').attr("disabled", true);

        $('input[name=rdbEstGS]').attr("disabled", true);
        $('input[name=rdbCard]').attr("disabled", true);
        $('input[name=rdbAbdomen]').attr("disabled", true);
        $('input[name=rdbAptResp]').attr("disabled", true);
        $('input[name=rdbAptUrin]').attr("disabled", true);
        $('input[name=rdbExtrem]').attr("disabled", true);
        $('input[name=rdbNeuro]').attr("disabled", true);
        $('input[name=rdbGB]').attr("disabled", true);
        $('input[name=rdVagina]').attr("disabled", true);
        $('input[name=rdbCervix]').attr("disabled", true);
        $('input[name=rdbUtero]').attr("disabled", true);
        $('input[name=rdbAnexos]').attr("disabled", true);
        $('input[name=rdbFsDouglas]').attr("disabled", true);
        $('input[name=rdbParam]').attr("disabled", true);
        $('input[name=rdbMamas]').attr("disabled", true);

        $('#txtEstdGeneSens').attr('disabled', true);
        $('#txtEdemas').attr('disabled', true);
        $('#txtCardvas').attr('disabled', true);
        $('#txtReflejos').attr('disabled', true);
        $('#txtAbdomenNormal').attr('disabled', true);
        $('#txtbAptResp').attr('disabled', true);
        $('#txtbAptUrin').attr('disabled', true);
        $('#txtExtrem').attr('disabled', true);
        $('#txtNeuro').attr('disabled', true);
        $('#txtGB').attr('disabled', true);
        $('#txtVagina').attr('disabled', true);
        $('#txtCervix').attr('disabled', true);
        $('#txtUtero').attr('disabled', true);
        $('#txtAnexos').attr('disabled', true);
        $('#txtFsDouglas').attr('disabled', true);
        $('#txtParam').attr('disabled', true);
        $('#txtMamas').attr('disabled', true);

        $('#txtApetitoIngreso').attr('disabled', true);
        $('#txtSedIngreso').attr('disabled', true);
        $('#txtOrinaIngreso').attr('disabled', true);
        $('#txtDeposicionesIngreso').attr('disabled', true);
        $('#txtSeunioIngreso').attr('disabled', true);

        $('#txtDescripcionExamenFisico').attr('disabled', false);
    }
    var desbloquearCampos = function () { // JDELGADO001.2
        $('#txtMotivoAtencion').attr('disabled', false);
        $('#txtSignosSintomas').attr('disabled', false);
        $('#txtCU').attr('disabled', false);
        $('#txtPLA').attr('disabled', false);
        $('#txtMF').attr('disabled', false);
        $('#txtSV').attr('disabled', false);
        $('#txtFiebre').attr('disabled', false);
        $('#txtSg').attr('disabled', false);
        $('input[name=rdbCu]').attr("disabled", false);
        $('input[name=rdbPLA]').attr("disabled", false);
        $('input[name=rdbMF]').attr("disabled", false);
        $('input[name=rdbSV]').attr("disabled", false);
        $('input[name=rdbFiebre]').attr("disabled", false);
        $('input[name=rdbSG]').attr("disabled", false);
        $('#txtFUR').attr('disabled', false);
        $('#txtFUE').attr('disabled', false);
        $('#txtFPP').attr('disabled', false);
        $('#chkFUR').attr('disabled', false);
        $('#chkFUE').attr('disabled', false);
        $('#txtEdadGestacionalSemanas').attr('disabled', false);
        $('#txtEdadGestacionalDias').attr('disabled', false);
        $('#txtCpn').attr('disabled', false);
        $('#txtGestas').attr('disabled', false);
        $('#txtPara').attr('disabled', false);
        $('#txtPin').attr('disabled', false);
        $('#txtDeltaPeso').attr('disabled', false);
        $('#txtMadPulmonar').attr('disabled', false);
        $('#txtMadCervical').attr('disabled', false);
        $('#txtAntecedentesMedicos').attr('disabled', false);
        $('#txtRam').attr('disabled', false);
        $('#txtAntecedentesQuirurgico').attr('disabled', false);
        $('input[name=rdbPulmonar]').attr("disabled", false);
        $('input[name=rdbCervical]').attr("disabled", false);
        $('input[name=rdbTransfucion]').attr("disabled", false);

        $('input[name=rdbEstGS]').attr("disabled", false);
        $('input[name=rdbCard]').attr("disabled", false);
        $('input[name=rdbAbdomen]').attr("disabled", false);
        $('input[name=rdbAptResp]').attr("disabled", false);
        $('input[name=rdbAptUrin]').attr("disabled", false);
        $('input[name=rdbExtrem]').attr("disabled", false);
        $('input[name=rdbNeuro]').attr("disabled", false);
        $('input[name=rdbGB]').attr("disabled", false);
        $('input[name=rdVagina]').attr("disabled", false);
        $('input[name=rdbCervix]').attr("disabled", false);
        $('input[name=rdbUtero]').attr("disabled", false);
        $('input[name=rdbAnexos]').attr("disabled", false);
        $('input[name=rdbFsDouglas]').attr("disabled", false);
        $('input[name=rdbParam]').attr("disabled", false);
        $('input[name=rdbMamas]').attr("disabled", false);

        $('#txtEstdGeneSens').attr('disabled', false);
        $('#txtEdemas').attr('disabled', false);
        $('#txtCardvas').attr('disabled', false);
        $('#txtReflejos').attr('disabled', false);
        $('#txtAbdomenNormal').attr('disabled', false);
        $('#txtbAptResp').attr('disabled', false);
        $('#txtbAptUrin').attr('disabled', false);
        $('#txtExtrem').attr('disabled', false);
        $('#txtNeuro').attr('disabled', false);
        $('#txtGB').attr('disabled', false);
        $('#txtVagina').attr('disabled', false);
        $('#txtCervix').attr('disabled', false);
        $('#txtUtero').attr('disabled', false);
        $('#txtAnexos').attr('disabled', false);
        $('#txtFsDouglas').attr('disabled', false);
        $('#txtParam').attr('disabled', false);
        $('#txtMamas').attr('disabled', false);

        $('#txtApetitoIngreso').attr('disabled', false);
        $('#txtSedIngreso').attr('disabled', false);
        $('#txtOrinaIngreso').attr('disabled', false);
        $('#txtDeposicionesIngreso').attr('disabled', false);
        $('#txtSeunioIngreso').attr('disabled', false);

        $('#txtDescripcionExamenFisico').attr('disabled', true);
    }
    
    var GeneraLlamadaAPDfHosGinecoObs = function (idCuentaAtencion, idItem, idServicio) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idItem', idItem);
        midata.append('idServicio', idServicio);
        //Cargando(1);
        $.ajax({
            method: "POST",
            //url: "/Atencion/GeneraParteDiario?area=ConsultaExterna", 
            url: "/Atencion/GeneraLlamadaAPDfHosGinecoObs?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.resultadoGeneraPdf.resulfirma) {
                    alerta('1', 'Se genero correctamente el envio de los datos para firmar');
                    window.open(datos.resultadoGeneraPdf.lstFirma.table[0]["ruta"], '_blank');
                    NotaIngresoRegistrar.ListaEvaluaciones();
                }



            },
            error: function (msg) {
                Cargando(0);
                alerta("ERROR", "Error al generar firma!", "2");
            }
        });
    }
    var imprimiInformeSF = function (idCuentaAtencion, idItem, idServicio) {

        var url = "/Atencion/HospGineObstetrsPdfSinFirma?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idItem=" + idItem + "&idServicio=" + idServicio;

        $('#ifrmReportes').attr('src', url);
    }
    var imprimeReevaluacion = function (idCuentaAtencion, idItem, idServicio) { // JDELGADO001.1
        console.log("imprimeReevaluacion")
        var url = "/Atencion/HospReevaluacionSF?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idItem=" + idItem + "&idServicio=" + idServicio;

        $('#ifrmReportes').attr('src', url);

    }
    var imprimeGinecoObstetra2 = function (idCuenta, idRegistro, code, idDoc) {
        Cargando(1);

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuenta + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=N";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            var idServicio = $("#cboConsultorio").val()
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = "CE-" + idRegistro + "-" + $.now()
            a.click();
            NotaIngresoRegistrar.ListaEvaluaciones();

            Cargando(0);
        }
        Cargando(0);

        request.send();
    }

    var eventos = function () {
        ///////////////////BUSQUEDA - KHOYOSI/////////////////////////////////////////////////
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarPacientes").click();
            }
        });

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

        $("#txtFUR").on('change', function () {

            if ($("#txtFUR").val() != "") {
                var midata = new FormData();

                midata.append('FechaCita', fehaDiaActual());
                midata.append('Fecha', $("#txtFUR").val());
                midata.append('SemanasEco', 0);
                midata.append('DiasEco', 0);
                midata.append('Tipo', 1);

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
                            $("#txtEdadGestacionalSemanas").val(datos.cantSemanas);
                            $("#txtEdadGestacionalDias").val(datos.cantDias);
                            $("#txtFPP").val(datos.fpp);
                        }
                    },
                    error: function (msg) {
                        setTimeout(function () {
                            //                    Cargando(0);
                            alerta("ERROR", "Error al calcular la edad gestacional!", "2");
                        }, 900)
                    }
                });

            }
            else {
                alerta(3, "Debe ingresar la fecha de ultima regla");
                $("#txtFUM").focus();
            }

        });
        $('#btnDescargaGineObstetra').on('click', function () {
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();

            var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();


            if (isEmpty(objrowPc)) {
                alerta(2, 'Seleccione un registro de la lista principal');
                return false;
            }

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro de las evaluaciones');
                return false;
            }
            else {

                if (!isEmpty(objrow.code)) {
                    idRegistro = objrowPc.idCuentaAtencion + "" + objrow.idNumero + "" + objrow.idServicio;
                    imprimeGinecoObstetra2(objrowPc.idCuentaAtencion, idRegistro, objrow.code, 0);
                }
                else {
                    alerta(2, 'Error al generar impresion de formato firmado');
                    return false;
                }
            }
        })
        $('#btnGeneraGineObstetra').on('click', function () {
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();

            var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowPc)) {
                alerta(2, 'Seleccione un registro de la lista principal');
                return false;
            }

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro de las evaluaciones');
                return false;
            }
            else {
                swal({
                    title: 'Generar Firma',
                    text: 'Estas seguro de firmar digitalmente?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(function () {

                    GeneraLlamadaAPDfHosGinecoObs(objrowPc.idCuentaAtencion, objrow.idNumero, objrow.idServicio)
                });
            }
        });

        //COMENTADO POR KHOYOSI
        //$('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
        //    let objFra = document.getElementById('ifrmReporte');
        //    objFra.contentWindow.focus();
        //    objFra.contentWindow.print();
        //});

        $('#txtFechaAtencionBuscar').on('change', function () { //JDELGADO010
            $('#txtFechaTransferencia').val('')
        });
        $('#txtFechaTransferencia').on('change', function () { //JDELGADO010
            $('#txtFechaItxtFechaAtencionBuscarngreso').val('')
        });
        $('#btnImprimeInformeSF').on('click', function () {
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();

            var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();


            if (isEmpty(objrowPc)) {
                alerta(2, 'Seleccione un registro de la lista principal');
                return false;
            }

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro de las evaluaciones');
                return false;
            }
            else {

                imprimiInformeSF(objrowPc.idCuentaAtencion, objrow.idNumero, objrow.idServicio)
            }
            return false;
        });

        $('#btnImprimeReevaluacion').on('click', function () { // JDELGADO001.1
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();

            var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();


            if (isEmpty(objrowPc)) {
                alerta(2, 'Seleccione un registro de la lista principal');
                return false;
            }

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro de las evaluaciones');
                return false;
            }
            else {

                imprimeReevaluacion(objrowPc.idCuentaAtencion, objrow.idNumero, objrow.idServicio)
            }
            return false;
        });

        $("#rdbTactoVaginalSi").on("click", function () {

            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(2);
        });
        $("#rdbTactoVaginalDiferido").on("click", function () {
            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(1);
        });
        $("#chkFUR").on('click', function () { // JDELGADO001.2
            if ($("#chkFUR").is(':checked')) {
                $("#txtFUR").attr('disabled', true);
                $("#txtFUR").val('');
            } else {
                $("#txtFUR").attr('disabled', false);
            }
            // $("#txtFUR").val('');
        });

        $("#chkFUE").on('click', function () { // JDELGADO001.2
            if ($("#chkFUE").is(':checked')) {
                $("#txtFUE").attr('disabled', true);
                $("#txtFUE").val('');
            } else {
                $("#txtFUE").attr('disabled', false);
            }
            // $("#txtFUE").val('');
        });

        $("#cboTipoEmbrazo").on('change', function () {
            bloqueaFetos();
        });

        $('#tblCSAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $("#modalConsumoServicio").on('hidden.bs.modal', function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });
        $('#btnEliminarCSAtencion').on('click', function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
            var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();
            if (objrow.idEstadoAtencion == 2) {
                alerta('2', 'Verifique el estado de la atencion');
                return false;
            }
            else {
                if (objrowConsumoServ.idEstadoFacturacion == 1) {
                    swal({
                        title: 'Eliminar',
                        text: 'Estas seguro de eliminar orden?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    }).then(function () {

                        ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
                        AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                    });
                }
                else {
                    alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                    return false;
                }
            }

        });

        $('#btnActualizaCSAtencion').on('click', function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });

        $('#btnAgregarCSAtencion').on('click', function () {
            ConsumoServicio.bloqueoProcedencia();
            ConsumoServicio.limpiar();
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
            ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1); // bloquear aqui
            $('#modalConsumoServicio').modal('show');
        });
        $("#btnCerrarSeguimiento").on('click', function () {
            $("#modalSeguimiento").modal('hide');
        })
        $("#btnCerrarHistorial").on('click', function () {
            $("#modalHistorial").modal('hide');
        })
        $('#btncerrar').on('click', function () {
            console.log("aqui mismito ejecuta")
            estadoGrabarAtencion = false;
        })

        $("#btnSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            SeguimientoPaciente.llendaDatos(objrow.nroHistoriaClinica, 0)
            $("#modalSeguimiento").modal('show');
        })

        $("#btnHistorial").on('click', function () {

            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            HistorialEvaluacionesHosp.llendaDatos(objrow.nroHistoriaClinica, 0)

            $("#modalHistorial").modal('show');
        }) //-C

        $('#cboServicio').on('change', function () {
            NotaIngreso.ListaPacientesHosp();
        });
        $('#cboServicioAtenciones').on('change', function () {
            ListaPacientesEvalEmgHosp();
        });


        $('#btnBuscarPacientesEvaluados').on('click', function () {
            ListaPacientesEvalEmgHosp();
        });
        $('#btnBuscarPacientes').on('click', function () {
            NotaIngreso.ListaPacientesHosp();
        });
        $('#btnConsultarNI2').on('click', function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }
            else {
                NotaIngresoRegistrar.IniciaFormulario(2);
                $('#modalNotaIngreso').modal('show');
            }

        });
        $('#btnConsultarNI').on('click', function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

            console.log('objrow', objrow)

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }
            else {
                NotaIngreso.HabilitarPestanias(objrow, 2)
                $('#modalNotaIngreso').modal('show');
            }
        });

        // JDELGADO J0 NOTA INGRESO
        $('#btnAgregarNI').on('click', async function () {
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }
            else {
                desbloquearCampos()
                let estado = await ConsumoServicio.verificarEstadosCuenta(objrow.idCuentaAtencion, 1);

                if (estado.estado != 1) {
                    swal({
                        title: 'Atenciones',
                        text: `Verificar cuenta \n
                               Estado: ${estado.estado} - ${estado.descripcionEstado}  \n
                               Servicio actual: ${objrow.servicioActual}`,
                        type: 'warning',
                    }).done();
                    return false;
                } else {
                    NotaIngreso.HabilitarPestanias(objrow, 1)
                    $('#modalNotaIngreso').modal('show');
                }
            }
        });
        // JDELGADO J0 NOTA INGRESO

        $('#btnLimpiarFiltro').on('click', function () {
            $('#txtNroHistoriaBuscar').val('')
            $('#txtNroCuentaBuscar').val('')
            $('#txtNroDniBuscar').val('')
            $('#txtApPaternoBuscar').val('')
            $('#txtFechaAtencionBuscar').val('')
            $('#txtFechaTransferencia').val('')
            $(`#cboServicio option[value='${0}']`).attr("selected", true);
            $('.chzn-select').chosen().trigger("chosen:updated")
        })

        //$('#tblAtencionEmer tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_atencionesEmer.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //});

        //$('#tblAtencionEmer tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_atencionesEmer.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //});

    }
    function TiposServicio() {
        $.ajax({
            async: false,
            cache: false,
            url: "/DashBoardHosp/ListarServicio?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboServicioAtenciones').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');

                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos de servicio!", "2");
                }, 900)
            }
        });
    }

    var ListaPacientesEvalEmgHosp = function () {

        Cargando(1)
        oTable_atencionesEmer.fnClearTable();

        var midata = new FormData();
        midata.append('historiaClinica', $('#txtNroHistoriaBuscar').val());
        midata.append('idCuentaAtencion', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('apellidoPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fechaIngreso', $('#txtFechaAtencionBuscar').val());
        midata.append('idServicio', $('#cboServicio').val());

        $.ajax({
            method: "POST",
            url: "/NotaIngreso/ListaEvaluacionesEmgHospByServico?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lstPacientesEvalEmgHops.table.length > 0) {
                        oTable_atencionesEmer.fnAddData(datos.lstPacientesEvalEmgHops.table);
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


    };
    
    var initDatablesEvaluaciones = function () {


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


    }

    var listaTiposEmb = function () {

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
    }

    //var initDatablesPacintesEvalEmgHosp = function () {

    //    var parms = {
    //        "order": [[0, "desc"]],
    //        destroy: true,
    //        responsive: true,
    //        bFilter: false,
    //        //dom: 'Bflr<"table-responsive"t>ip',
    //        buttons: ['copy', 'csv', 'print'],
    //        columns: [

    //            {
    //                data: "idCuentaAtencion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },

    //            {
    //                data: "nroHistoriaClinica",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            }
    //            ,
    //            {
    //                data: "apellidoPaterno",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            }
    //            ,
    //            {
    //                data: "apellidoMaterno",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            },
    //            {
    //                data: "primerNombre",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            }
    //            ,
    //            {
    //                data: "fecNacim",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }

    //            }
    //            ,
    //            {
    //                data: "fechaIngreso",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }

    //            }
    //            ,
    //            {
    //                data: "servicio",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            }
    //            ,
    //            {
    //                data: "numero",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            }
    //            ,
    //            {
    //                data: "fechaEval",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            }

    //        ]

    //    }

    //    var tableWrapper = $('#tblPacientesEvalEmgHosp'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    //    oTable_atencionesEmer = $("#tblPacientesEvalEmgHosp").dataTable(parms);


    //};

    //var initDatablesPacintesHosp = function () {

    //    var parms = {
    //        destroy: true,
    //        responsive: true,
    //        bFilter: false,
    //        buttons: ['copy', 'csv', 'print'],
    //        columns: [
    //            {
    //                data: "idCuentaAtencion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "nroHistoriaClinica",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "apellidoPaterno",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "apellidoMaterno",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "primerNombre",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "fecNacim",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }

    //            },
    //            {
    //                data: "fechaIngreso",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }

    //            },
    //            {
    //                data: "horaIngreso",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "fechaEgresoAdministrativo",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "horaEgresoAdministrativo",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "servicioActual",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                data: "plan",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                    if (rowData.evalEmer > 0) {
    //                        $(td).parent().css('color', '#347dff');
    //                        $(td).parent().css('font-weight', 'bold');
    //                    }
    //                }
    //            }
    //        ]

    //    }

    //    var tableWrapper = $('#tblAtencionEmer'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    //    oTable_atencionesEmer = $("#tblAtencionEmer").dataTable(parms);

    //};


    var ListaDiagnosticosAtenciones = function (idAtencion) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono

        Diagnosticos.LimpiarDiagnosticosAtencion();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        $.ajax({

            method: "POST",
            url: "/Hospitalizacion/AtencionesDiagnosticosSeleccionarPorAtencion?area=Hospitalizacion",
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
    };

    return {
        init: function () {
            CargaInicial();
            plugins();

            //initDatablesConsumoAtencion();
            initDatablesEvaluaciones();


            eventos();
            TiposServicio();
            listaTiposEmb();

            //VisorReceta.Eventos();          //KHOYOSI

        }
    };
}();
function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function