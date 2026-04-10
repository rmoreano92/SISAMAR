var EcoCardiotografia = {

    async Iniciar() {
        EcoCardiotografia.Plugins();
        EcoCardiotografia.Eventos();
        await EcoCardiotografia.CargarCombos();

        this.CalcularEdadGestacional($("#txtFechaFUR").val());
    },

    Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaFUR, #txtFechaFPP').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $('#txtFechaFUR, #txtFechaFPP').mask("Dd/Mm/abcd"); 

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtMonitoreoHoraInicio, #txtMonitoreoHoraTermino").mask("Hn:Nn");

    },

    Eventos() {

        //$(document).on('keyup', '.monitoreo', function () {
        $('.monitoreo').on("keyup", function (event) {
            EcoCardiotografia.CalcularMonitoreoTotal();
        });

        //$(document).on('keyup', '.valoracion', function () {
        $('.valoracion').on("keyup", function (event) {
            EcoCardiotografia.CalcularValoracionTotal();
        });

        $("#txtFechaFUR").on('change', async function () {
            let valor = $(this).val();

            await EcoCardiotografia.CalcularEdadGestacional(valor);
        });

    },

    async CalcularEdadGestacional(fecha) {
        $("#txtFechaFPP").val("");
        $("#cboTipoEdadGest").val("");
        $("#txtEdadGestSem").val("");
        $("#txtEdadGestDias").val("");
        if (isEmpty(fecha) == false) {
            if (esFormatoFecha(fecha)) {
                let fechaHoraHoy = await Utilitario.FechaHoraServidor();
                let fechaRegistro = isNull($("#txtFechaResultado").val(), fechaHoraHoy);
                fechaRegistro = fechaRegistro.substring(0, 10);

                let edadGest = Utilitario.CalcularEdadGestacional(fechaRegistro, fecha, "", "", 1);
                $("#cboTipoEdadGest").val("1");
                $("#txtFechaFPP").datepicker("setDate", edadGest.fpp);
                $("#txtEdadGestSem").val(edadGest.cantSemanas);
                $("#txtEdadGestDias").val(edadGest.cantDias);

            }
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CalcularMonitoreoTotal() {
        $("#txtMonitoreoTotal").val("");
        let horaInicio = $("#txtMonitoreoHoraInicio").val();
        let horaFin = $("#txtMonitoreoHoraTermino").val();
        if (esFormatoHora(horaInicio) && esFormatoHora(horaFin)) {
            let inicio = moment(horaInicio, "HH:mm");
            let fin = moment(horaFin, "HH:mm");

            let duracion = moment.duration(fin.diff(inicio));
            let horas = Math.floor(duracion.asHours());
            let minutos = duracion.minutes();

            $("#txtMonitoreoTotal").val(horas + "h" + " " + minutos + "min");
        }        
    },

    CalcularValoracionTotal() {
        $("#txtValoracionTotal").val("");
        let total = parseInt(isNull($("#txtValoracionLineaBase").val(), 0)) + parseInt(isNull($("#txtValoracionVariabilidad").val(), 0)) + parseInt(isNull($("#txtValoracionAceleraciones").val(), 0)) + parseInt(isNull($("#txtValoracionDesaceleraciones").val(), 0)) + parseInt(isNull($("#txtValoracionMovimientosCorporales").val(), 0));

        $("#txtValoracionTotal").val(total);
    },

    async CargarCombos() {
        $('#cboRealizaPrueba').empty();
        $('#cboMedicoRealizaInforme').empty();
        $('#cboTipoEdadGest').empty();
        $('#cboMedicacionPrevia').empty();
        $('#cboCordonNucal').empty();

        let midata1 = new FormData();
        midata1.append('tipoEmpleado', 'obstetriz');

        Cargando(1);
        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaEmpleadosPorTipoEmpleado?area=Imagenes",
            data: midata1,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $("#cboRealizaPrueba").append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos empelado gine eco!");
                }, 900)
            }
        });

        
        let midata2 = new FormData();
        midata2.append('tipoEmpleado', 'ginecologia');
        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaEmpleadosPorTipoEmpleado?area=Imagenes",
            data: midata2,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $("#cboMedicoRealizaInforme").append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos empleado obs combos!");
                }, 900)
            }
        });

        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaTiposEdadGestacional?area=Imagenes",
            data: null,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $("#cboTipoEdadGest").append('<option  value="' + obj.idTipoEdadGestacional + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos medicacion previa!");
                }, 900)
            }
        });

        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaMedicacionPrevia?area=Imagenes",
            data: null,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $("#cboMedicacionPrevia").append('<option  value="' + obj.idMedicacion + '">' + obj.medicacion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos medicacion previa!");
                }, 900)
            }
        });

        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaCordonNucal?area=Imagenes",
            data: null,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $("#cboCordonNucal").append('<option  value="' + obj.idCordonNucal + '">' + obj.cordon + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos cordon!");
                }, 900)
            }
        });


        Cargando(0);

        
        $('#cboRealizaPrueba').val("");
        $('#cboMedicoRealizaInforme').val("");
        $('#cboTipoEdadGest').val("");
        $('#cboMedicacionPrevia').val("");
        $('#cboCordonNucal').val("");

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async CargarResultado(idOrden, idMovimiento, idProducto) {
        let resultados = await this.SeleccionarResultadoEcografia(idOrden, idMovimiento, idProducto);
        if (isEmpty(resultados) == false) {
            resultados.forEach(function (valor) {
                                
                $("#txtFechaResultado").datepicker("setDate", valor.fechaResultado);
                $("#txtHoraResultado").val(valor.horaResultado);
                $("#cboRealizaPrueba").val(valor.idRealizaPrueba);

                $("#cboMedicoRealizaInforme").val(valor.idMedicoRevisa);
                $('#txtProcendencia').val(valor.procedencia);
                $('#txtFechaFUR').datepicker("setDate", (valor.fur == '__/__/____' ? null: valor.fur));
                $('#txtFechaFPP').datepicker("setDate", (valor.fpp == '__/__/____' ? null : valor.fpp));                    
                $('#txtAlturaUterina').val(valor.au);
                $('#txtTiempoAyuno').val(valor.ta);
                $('#txtPresionAterial').val(valor.pa);
                $('#txtFrecuenciaCardiaca').val(valor.fc);
                $('#txtTemperatura').val(valor.t);
                $('#txtGestaRes').val(valor.gesta);
                $('#txtParidadRes1').val(valor.parA1);
                $('#txtParidadRes2').val(valor.parA2);
                $('#txtParidadRes3').val(valor.parA3);
                $('#txtParidadRes4').val(valor.parA4);
                $('#cboTipoEdadGest').val(valor.idTipoEdadGestacional);
                $('#txtEdadGestSem').val(valor.eGsem);
                $('#txtEdadGestDias').val(valor.eGdias);
                $('#cboMedicacionPrevia').val(valor.idMedicacionPrevia);
                $('#txtMedicacionPrevia').val(valor.dMedicacionPrevia);

                $('#chkBienestarFetal').prop('checked', valor.bienestarFetal);
                $('#chkPreeclampsia').prop('checked', valor.preeclampsia);
                $('#chkInsuficienciaPlacentaria').prop('checked', valor.insuficienciaPlacentaria);
                $('#chkDiabetes').prop('checked', valor.diabetes);
                $('#chkCordonNucal').prop('checked', valor.cordonNucal);
                $('#cboCordonNucal').val(valor.idCordonNucal);
                $('#chkEmbarazoMultiple').prop('checked', valor.embarazoMultiple);
                $('#chkHtaCron').prop('checked', valor.htAcron);
                $('#chkPostermino').prop('checked', valor.postermino);
                $('#chkObesidad').prop('checked', valor.obesidad);
                $('#chkPlacentaPrevia').prop('checked', valor.placentaPrevia);
                $('#chkRpm').prop('checked', valor.rpm);
                $('#chkHipGest').prop('checked', valor.hipGest);
                $('#chkRciu').prop('checked', valor.rciu);
                $('#chkColestasis').prop('checked', valor.colestasis);
                $('#chkOligoamn').prop('checked', valor.oligoamn);
                $('#chkMovDismin').prop('checked', valor.movDism);
                $('#chkAnemiaFetal').prop('checked', valor.anemiaFetal);
                $('#chkAnemiaMat').prop('checked', valor.anemiaMat);
                $('#chkPolhidr').prop('checked', valor.poliamni);
                $('#chkContraccion').prop('checked', valor.contraccion);
                $('#chkMalformacion').prop('checked', valor.malformacion);
                $('#chkItu').prop('checked', valor.itu);
                $('#chkIla').prop('checked', valor.ila);
                $('#txtIla').val(valor.dila);
                $('#chkApp').prop('checked', valor.app);
                $('#chkOtroMotivo').prop('checked', valor.otro);
                $('#txtOtroMotivo').val(valor.dOtro);
                $('#chkHemorragia').prop('checked', valor.hemorragia);

                $('#txtAu').val(valor.aUdop);
                $('#txtAcm').val(valor.acMdop);
                $('#txtRcp').val(valor.rcPdop);
                $('#txtIao').val(valor.iAdop);
                $('#txtDv').val(valor.dVdop);

                $('#txtMonitoreoHoraInicio').val(valor.monitoreoHoraInicio);
                $('#txtMonitoreoHoraTermino').val(valor.monitoreoHoraTermino);
                $('#txtMonitoreoTotal').val(valor.monitoreoTotal);

                $('#chkPrimeraVez').prop('checked', valor.primeraVez);
                $('#chkControl').prop('checked', valor.control);
                $('#chkPosseiro').prop('checked', valor.posseiro);
                $('#chkSindromeVenaCavaInferior').prop('checked', valor.sindromeVenaCava);
                $('#chkOxitocina').prop('checked', valor.oxitocina);
                $('#txtOxitocina').val(valor.dOxitocina);
                $('#chkEstimuloMamario').prop('checked', valor.estimuloMamario);
                $('#txtEstimuloMamario').val(valor.dEstimuloMamario);
                $('#txtObservacionesNST').val(valor.observacionesNST);
                
                $('#txtValoracionLineaBase').val(valor.valoracionLineaBase);
                $('#txtValoracionVariabilidad').val(valor.valoracionVariabilidad);
                $('#txtValoracionAceleraciones').val(valor.valoracionAceleraciones);
                $('#txtValoracionDesaceleraciones').val(valor.valoracionDesaceleraciones);
                $('#txtValoracionMovimientosCorporales').val(valor.valoracionMovimientosCorporales);
                $('#txtValoracionTotal').val(valor.valoracionTotal);

                $('#chkNegativo').prop('checked', valor.negativo);
                $('#chkInsatisfactorio').prop('checked', valor.insatisfactorio);
                $('#chkConReactividad').prop('checked', valor.conReactividad);
                $('#chkPositivo').prop('checked', valor.positivo);
                $('#chkEquivoco').prop('checked', valor.equivoco);
                $('#chkSinReactividad').prop('checked', valor.sinReactividad);
                $('#chkSospechosos').prop('checked', valor.sospechosos);

                $('#rdbNormal').prop('checked', valor.normal);
                $('#rdbAtipico').prop('checked', valor.atipico);
                $('#rdbPatologico').prop('checked', valor.patologico);

                $('#txtRecomendacionRepetir').val(valor.recomendacionRepetir);
                $('#txtRecomendacionCST').val(valor.recomendacionCST);
                $('#txtRecomendacionInduccion').val(valor.recomendacionInduccion);
                $('#txtRecomendacionOtros').val(valor.recomendacionOtros);

                $('#txtObservaciones').val(valor.observaciones);
                                
                $('.chzn-select').chosen().trigger("chosen:updated");
            });
        }

    },

    async SeleccionarResultadoEcografia(idOrden, idMovimiento, idProducto) {
        let respuesta = null;
        let resp = false;
        let data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idMovimiento', idMovimiento);
        data.append('idProducto', idProducto);


        try {

            //$('#cboRealizaPrueba').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaEcografias/SeleccionarEcoCardiotografia?area=Imagenologia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                respuesta = datos.respuesta.table;
            } else {
                let FechaHora = await Utilitario.FechaHoraServidor();
                $("#txtFechaResultado").datepicker("setDate", FechaHora.substring(0, 10));
                $("#txtHoraResultado").val(FechaHora.substring(11, 16));
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }

        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return respuesta;
    },

    DevolverDetalleResultado() {
        let detalleResultado = [];
        let objRes = null;
                
        objRes = {
            IdProducto: Imagenologia.idProducto,
            IdOrden: Imagenologia.idOrden,
            IdMovimiento: Imagenologia.idMovimiento,
            FechaResultado: $("#txtFechaResultado").val(),
            HoraResultado: $("#txtHoraResultado").val(),
            IdRealizaPrueba: $("#cboRealizaPrueba").val(),

            IdMedicoRevisa: $("#cboMedicoRealizaInforme").val(),
            Procedencia: $('#txtProcendencia').val(),
            Fur: $('#txtFechaFUR').val(),
            Fpp: $('#txtFechaFPP').val(),
            Au: $('#txtAlturaUterina').val(),
            Ta: $('#txtTiempoAyuno').val(),
            Pa: $('#txtPresionAterial').val(),
            Fc: $('#txtFrecuenciaCardiaca').val(),
            T: $('#txtTemperatura').val(),
            Gesta: $('#txtGestaRes').val(),
            ParA1: $('#txtParidadRes1').val(),
            ParA2: $('#txtParidadRes2').val(),
            ParA3: $('#txtParidadRes3').val(),
            ParA4: $('#txtParidadRes4').val(),
            IdTipoEdadGestacional: $('#cboTipoEdadGest').val(),
            EGsem: $('#txtEdadGestSem').val(),
            EGdias: $('#txtEdadGestDias').val(),
            IdMedicacionPrevia: $('#cboMedicacionPrevia').val(),
            DMedicacionPrevia: $('#txtMedicacionPrevia').val(),

            BienestarFetal: $('#chkBienestarFetal').is(':checked') ? 1 : 0,
            Preeclampsia: $('#chkPreeclampsia').is(':checked') ? 1 : 0,
            InsuficienciaPlacentaria: $('#chkInsuficienciaPlacentaria').is(':checked') ? 1 : 0,
            Diabetes: $('#chkDiabetes').is(':checked') ? 1 : 0,
            CordonNucal: $('#chkCordonNucal').is(':checked') ? 1 : 0,
            IdCordonNucal: $('#cboCordonNucal').val(),
            EmbarazoMultiple: $('#chkEmbarazoMultiple').is(':checked') ? 1 : 0,
            HtAcron: $('#chkHtaCron').is(':checked') ? 1 : 0,
            Postermino: $('#chkPostermino').is(':checked') ? 1 : 0,
            Obesidad: $('#chkObesidad').is(':checked') ? 1 : 0,
            PlacentaPrevia: $('#chkPlacentaPrevia').is(':checked') ? 1 : 0,
            Rpm: $('#chkRpm').is(':checked') ? 1 : 0,
            HipGest: $('#chkHipGest').is(':checked') ? 1 : 0,
            Rciu: $('#chkRciu').is(':checked') ? 1 : 0,
            Colestasis: $('#chkColestasis').is(':checked') ? 1 : 0,
            Oligoamn: $('#chkOligoamn').is(':checked') ? 1 : 0,
            MovDism: $('#chkMovDismin').is(':checked') ? 1 : 0,
            AnemiaFetal: $('#chkAnemiaFetal').is(':checked') ? 1 : 0,
            AnemiaMat: $('#chkAnemiaMat').is(':checked') ? 1 : 0,
            Poliamni: $('#chkPolhidr').is(':checked') ? 1 : 0,
            Contraccion: $('#chkContraccion').is(':checked') ? 1 : 0,
            Malformacion: $('#chkMalformacion').is(':checked') ? 1 : 0,
            Itu: $('#chkItu').is(':checked') ? 1 : 0,
            Ila: $('#chkIla').is(':checked') ? 1 : 0,
            Dila: $('#txtIla').val(),
            App: $('#chkApp').is(':checked') ? 1 : 0,
            Otro: $('#chkOtroMotivo').is(':checked') ? 1 : 0,
            DOtro: $('#txtOtroMotivo').val(),
            Hemorragia: $('#chkHemorragia').is(':checked') ? 1 : 0,

            AUdop: $('#txtAu').val(),
            AcMdop: $('#txtAcm').val(),
            RcPdop: $('#txtRcp').val(),
            IAdop: $('#txtIao').val(),
            DVdop: $('#txtDv').val(),

            MonitoreoHoraInicio: $('#txtMonitoreoHoraInicio').val(),
            MonitoreoHoraTermino: $('#txtMonitoreoHoraTermino').val(),
            MonitoreoTotal: $('#txtMonitoreoTotal').val(),

            PrimeraVez: $('#chkPrimeraVez').is(':checked') ? 1 : 0,
            Control: $('#chkControl').is(':checked') ? 1 : 0,
            Posseiro: $('#chkPosseiro').is(':checked') ? 1 : 0,
            SindromeVenaCava: $('#chkSindromeVenaCavaInferior').is(':checked') ? 1 : 0,
            Oxitocina: $('#chkOxitocina').is(':checked') ? 1 : 0,
            DOxitocina: $('#txtOxitocina').val(),
            EstimuloMamario: $('#chkEstimuloMamario').is(':checked') ? 1 : 0,
            DEstimuloMamario: $('#txtEstimuloMamario').val(),
            ObservacionesNST: $('#txtObservacionesNST').val(),

            ValoracionLineaBase: $('#txtValoracionLineaBase').val(),
            ValoracionVariabilidad: $('#txtValoracionVariabilidad').val(),
            ValoracionAceleraciones: $('#txtValoracionAceleraciones').val(),
            ValoracionDesaceleraciones: $('#txtValoracionDesaceleraciones').val(),
            ValoracionMovimientosCorporales: $('#txtValoracionMovimientosCorporales').val(),
            ValoracionTotal: $('#txtValoracionTotal').val(),

            Negativo: $('#chkNegativo').is(':checked') ? 1 : 0,
            Insatisfactorio: $('#chkInsatisfactorio').is(':checked') ? 1 : 0,
            ConReactividad: $('#chkConReactividad').is(':checked') ? 1 : 0,
            Positivo: $('#chkPositivo').is(':checked') ? 1 : 0,
            Equivoco: $('#chkEquivoco').is(':checked') ? 1 : 0,
            SinReactividad: $('#chkSinReactividad').is(':checked') ? 1 : 0,
            Sospechosos: $('#chkSospechosos').is(':checked') ? 1 : 0,

            Normal: $('#rdbNormal').is(':checked') ? 1 : 0,
            Atipico: $('#rdbAtipico').is(':checked') ? 1 : 0,
            Patologico: $('#rdbPatologico').is(':checked') ? 1 : 0,

            RecomendacionRepetir: $('#txtRecomendacionRepetir').val(),
            RecomendacionCST: $('#txtRecomendacionCST').val(),
            RecomendacionInduccion: $('#txtRecomendacionInduccion').val(),
            RecomendacionOtros: $('#txtRecomendacionOtros').val(),

            Observaciones: $('#txtObservaciones').val(),
        }

        detalleResultado.push(objRes);

        return detalleResultado;
    },

    async GuardarResultado() {
        let respuesta = null;
        let resp = false;
        let data = new FormData();

        let detalleResultado = this.DevolverDetalleResultado();

        var midata = new FormData();
        midata.append('IdCuentaAtencion', Imagenologia.idCuentaAtencion);
        midata.append('IdOrden', Imagenologia.idOrden);
        midata.append('IdMovimiento', Imagenologia.idMovimiento);
        midata.append('IdProducto', Imagenologia.idProducto);
        midata.append('IdRealizaAnalisis', $("#cboRealizaPrueba").val());
        midata.append('IdRealizaInforme', $("#cboMedicoRealizaInforme").val());
        midata.append('IdServicioRealiza', $("#cboServicioRealizaPrueba").val());
        midata.append('FechaResultado', $("#txtFechaResultado").val() + ' ' + $("#txtHoraResultado").val());
        midata.append('detalleResultado', JSON.stringify(detalleResultado));
        midata.append('IdListBar', ObtenerItemListBar());

        try {

            //$('#cboRealizaPrueba').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaEcografias/GuardarEcoCardiotografia?area=Imagenologia",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        return false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        return false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        return true;
                    }
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

}