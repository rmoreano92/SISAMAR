var EcoMorfologica = {

    async Iniciar() {
        EcoMorfologica.Plugins();
        EcoMorfologica.Eventos();
        await EcoMorfologica.CargarCombos();

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
        $("#txtFechaFUR, #txtFechaFPP").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        /*$("#txtHoraInicio, #txtHoraFin").mask("Hn:Nn");*/

        $('#fetoDos-tab-link').hide();
        $('#fetoTres-tab-link').hide();
    },

    Eventos() {

        //$(document).on('change', 'input[type=radio][name=rdbMorfoFeto1]', function () {
        $('input[type=radio][name=rdbMorfoFeto1]').on("change", function (event) {
            //console.log('Nuevo valor seleccionado: ' + $(this).val());
            if ($(this).val() == 1) { $('#fetoUno-tab .cboMorfo').val("122"); }
            if ($(this).val() == 2) { $('#fetoUno-tab .cboMorfo').val("123"); }
            if ($(this).val() == 3) { $('#fetoUno-tab .cboMorfo').val("134"); }

            $('.chzn-select').chosen().trigger("chosen:updated")
        });

        //$(document).on('change', 'input[type=radio][name=rdbMorfoFeto2]', function () {
        $('input[type=radio][name=rdbMorfoFeto2]').on("change", function (event) {
            //console.log('Nuevo valor seleccionado: ' + $(this).val());
            if ($(this).val() == 1) { $('#fetoDos-tab .cboMorfo').val("122"); }
            if ($(this).val() == 2) { $('#fetoDos-tab .cboMorfo').val("123"); }
            if ($(this).val() == 3) { $('#fetoDos-tab .cboMorfo').val("134"); }

            $('.chzn-select').chosen().trigger("chosen:updated")
        });

        //$(document).on('change', 'input[type=radio][name=rdbMorfoFeto3]', function () {
        $('input[type=radio][name=rdbMorfoFeto3]').on("change", function (event) {
            //console.log('Nuevo valor seleccionado: ' + $(this).val());
            if ($(this).val() == 1) { $('#fetoTres-tab .cboMorfo').val("122"); }
            if ($(this).val() == 2) { $('#fetoTres-tab .cboMorfo').val("123"); }
            if ($(this).val() == 3) { $('#fetoTres-tab .cboMorfo').val("134"); }

            $('.chzn-select').chosen().trigger("chosen:updated")
        });

        //$(document).on('click', 'input[type=radio][name=rdbFeto]', function () {
        $('input[type=radio][name=rdbFeto]').on("click", function (event) {
            // Obtener el valor seleccionado
            let valor = $(this).val();

            if (valor == 1) {
                $('#fetoDos-tab-link').hide();
                $('#fetoTres-tab-link').hide();
                $('.nav-tabs a[href="#fetoUno-tab"]').tab('show');
            } else if (valor == 2) {
                $('#fetoDos-tab-link').show();
                $('#fetoTres-tab-link').hide();
                $('.nav-tabs a[href="#fetoDos-tab"]').tab('show');
            } else if (valor == 3) {
                $('#fetoDos-tab-link').show();
                $('#fetoTres-tab-link').show();
                $('.nav-tabs a[href="#fetoTres-tab"]').tab('show');
            }
            //console.log("Seleccionaste: " + valor);
        });

        $('#txtAUmbilicalIpFeto1, #txtAcmIpFeto1').on("keyup", function (event) {
            let valor = $(this).val();

            if ($.isNumeric(valor) == false) {
                $(this).val("");
            }

            EcoMorfologica.CalcularRcpIp(1);
        });

        $('#txtAUmbilicalIpFeto2, #txtAcmIpFeto2').on("keyup", function (event) {
            let valor = $(this).val();

            if ($.isNumeric(valor) == false) {
                $(this).val("");
            }

            EcoMorfologica.CalcularRcpIp(2);
        });

        $('#txtAUmbilicalIpFeto3, #txtAcmIpFeto3').on("keyup", function (event) {
            let valor = $(this).val();

            if ($.isNumeric(valor) == false) {
                $(this).val("");
            }

            EcoMorfologica.CalcularRcpIp(3);
        });

        $("#txtFechaFUR").on('change', async function () {
            let valor = $(this).val();

            await EcoMorfologica.CalcularEdadGestacional(valor);
        });

        $('#txtAuterinaDerecha, #txtAuterinaIzquierda').on("keyup", function (event) {
            let valor = $(this).val();

            if ($.isNumeric(valor) == false) {
                $(this).val("");
            }

            EcoMorfologica.CalcularIpMedio();
        });

        $('#txtPaMaternaSd, #txtPaMaternaDd, #txtPaMaternaSi, #txtPaMaternaDi').on("keyup", function (event) {
            let valor = $(this).val();

            if ($.isNumeric(valor) == false) {
                $(this).val("");
            }

            EcoMorfologica.CalcularPAM();
        });

    },

    async CalcularEdadGestacional(fecha) {
        $("#txtFechaFPP").val("");
        $("#txtEdadGestacional").val("");
        if (isEmpty(fecha) == false) {
            if (esFormatoFecha(fecha)) {
                let fechaHoraHoy = await Utilitario.FechaHoraServidor();
                let fechaRegistro = isNull($("#txtFechaResultado").val(), fechaHoraHoy);
                fechaRegistro = fechaRegistro.substring(0, 10);

                let edadGest = Utilitario.CalcularEdadGestacional(fechaRegistro, fecha, "", "", 1);
                $("#txtFechaFPP").datepicker("setDate", edadGest.fpp);
                $("#txtEdadGestacional").val(edadGest.cantSemanas + " Sem. " + edadGest.cantDias + " Dias.");

            }
        }
    },

    CalcularRcpIp(feto) {
        if (isEmpty($('#txtAUmbilicalIpFeto' + feto).val()) == false && isEmpty($('#txtAcmIpFeto' + feto).val()) == false) {
            let rcpIp = parseFloat(isNull($("#txtAcmIpFeto" + feto).val(), 0)) / parseFloat(isNull($("#txtAUmbilicalIpFeto" + feto).val(), 0))
            $("#txtRpcIpFeto" + feto).val(rcpIp.toFixed(2));
        } else {
            $("#txtRpcIpFeto" + feto).val("");
        }
    },

    CalcularIpMedio() {
        if (isEmpty($('#txtAuterinaDerecha').val()) == false && isEmpty($('#txtAuterinaIzquierda').val()) == false) {
            let ipMedio = (parseFloat(isNull($("#txtAuterinaDerecha").val(), 0)) + parseFloat(isNull($("#txtAuterinaIzquierda").val(), 0))) / 2;

            if (ipMedio % 1 === 0) {
                $('#txtAuterinaIpMedio').val(ipMedio.toFixed(0));
            } else {
                $('#txtAuterinaIpMedio').val(ipMedio.toFixed(2));
            }
        } else {
            $("#txtAuterinaIpMedio").val("");
        }
    },

    CalcularPAM() {
        if (isEmpty($('#txtPaMaternaSd').val()) == false && isEmpty($('#txtPaMaternaDd').val()) == false && isEmpty($('#txtPaMaternaSi').val()) == false && isEmpty($('#txtPaMaternaDi').val()) == false) {
            let dDerecho = (parseFloat(isNull($("#txtPaMaternaSd").val(), 0)) + (2 * parseFloat(isNull($("#txtPaMaternaDd").val(), 0)))) / 3;
            let dIzquierdo = (parseFloat(isNull($("#txtPaMaternaSi").val(), 0)) + (2 * parseFloat(isNull($("#txtPaMaternaDi").val(), 0)))) / 3;

            pam = (dDerecho + dIzquierdo) / 2;

            if (pam % 1 === 0) {
                $('#txtPaMaternaPam').val(pam.toFixed(0));
            } else {
                $('#txtPaMaternaPam').val(pam.toFixed(2));
            }
        } else {
            $("#txtPaMaternaPam").val("");
        }
    },

    async CargarCombos() {
        $('.cboPresentacionFeto').empty();
        $('.cboSexoFeto').empty();
        $('.cboCordonFeto').empty();
        $('.cboPlacentaFeto').empty();
        $('.cboGradoFeto').empty();
        $('.cboLiquidoFeto').empty();        
        $('.cboMorfo').empty();
        $('#cboAnatomia').empty();

        Cargando(1);
        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaTiposSexoEcoImagenes?area=Imagenes",
            data: null,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $(".cboSexoFeto").append('<option  value="' + obj.idTipoSexoEco + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos sexo eco!");
                }, 900)
            }
        });

        let midata = new FormData();
        midata.append('catalogo', '36,37,38,39,40,41,42,47,48,49');

        await $.ajax({
            method: "POST",
            url: "/ImagenologiaEcografias/ListaCatalogoEcoImagenesPorCatalogo?area=Imagenes",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos);
                $(datos.respuesta.table).each(function (i, obj) {
                    $(obj.classCombo).append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta2("danger", "", "Error listar tipos catalogo combos!");
                }, 900)
            }
        });

        Cargando(0);

        $('.cboPresentacionFeto').val("");
        $('.cboSexoFeto').val("");
        $('.cboCordonFeto').val("");
        $('.cboPlacentaFeto').val("");
        $('.cboGradoFeto').val("");
        $('.cboLiquidoFeto').val("");
        $('.cboMorfo').val("122");
        $('#cboAnatomia').val("");

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async CargarResultado(idOrden, idMovimiento, idProducto) {
        let resultados = await this.SeleccionarResultadoEcografia(idOrden, idMovimiento, idProducto);
        if (isEmpty(resultados) == false) {
            resultados.forEach(function (valor) {

                if (valor.numeroFeto == 2) { $("#rdbFeto2").prop("checked", true); $('#fetoDos-tab-link').show(); }
                if (valor.numeroFeto == 3) { $("#rdbFeto3").prop("checked", true); $('#fetoTres-tab-link').show(); }

                $("#txtFechaResultado").datepicker("setDate", valor.fechaResultado);
                $("#txtHoraResultado").val(valor.horaResultado);
                $("#cboRealizaPrueba").val(valor.idRealizaPrueba);

                $('#txtFechaFUR').datepicker("setDate", valor.fur);
                $('#txtFechaFPP').datepicker("setDate", valor.fpp);
                $('#txtEdadGestacional').val(valor.edadGestacional);

                $('#cboPresentacionFeto' + valor.numeroFeto).val(valor.presentacion);
                $('#txtDbpFeto' + valor.numeroFeto).val(valor.dbp);
                $('#txtCcFeto' + valor.numeroFeto).val(valor.cc);
                $('#txtCaFeto' + valor.numeroFeto).val(valor.ca);
                $('#txtLfFeto' + valor.numeroFeto).val(valor.lf);
                $('#txtLhFeto' + valor.numeroFeto).val(valor.lh);
                //$('#txtLcnFeto' + valor.numeroFeto).val(valor.lcn);
                $('#txtPesoFeto' + valor.numeroFeto).val(valor.peso);
                $('#txtPercFeto' + valor.numeroFeto).val(valor.perc);
                $('#txtFcfFeto' + valor.numeroFeto).val(valor.fc);
                $('#cboSexoFeto' + valor.numeroFeto).val(valor.sexo);
                $('#cboCordonFeto' + valor.numeroFeto).val(valor.cordon);
                $('#cboPlacentaFeto' + valor.numeroFeto).val(valor.placenta);
                $('#cboGradoFeto' + valor.numeroFeto).val(valor.grado);
                $('#txtIlaFeto' + valor.numeroFeto).val(valor.ila);
                $('#cboLiquidoFeto' + valor.numeroFeto).val(valor.liquido);
                $('#txtPozoFeto' + valor.numeroFeto).val(valor.pozo);
                $('#txtVisualizFeto' + valor.numeroFeto).val(valor.visualiz);
                //$('#txtCervixFeto' + valor.numeroFeto).val(valor.cervixUterino)

                $('#txtAUmbilicalIpFeto' + valor.numeroFeto).val(valor.ipArtUmb);
                $('#txtAUmbilicalPercFeto' + valor.numeroFeto).val(valor.aUmbilicalPerc);
                $('#txtAUmbilicalDiastoleFeto' + valor.numeroFeto).val(valor.aUmbilicalDiastole);
                $('#txtAcmIpFeto' + valor.numeroFeto).val(valor.ipArtCMedia);
                $('#txtAcmPercFeto' + valor.numeroFeto).val(valor.acmPerc);
                $('#txtAcmDiastoleFeto' + valor.numeroFeto).val(valor.acmDiastole);
                $('#txtRpcIpFeto' + valor.numeroFeto).val(valor.vps_Acm);
                $('#txtRpcPercFeto' + valor.numeroFeto).val(valor.rpcPerc);
                $('#txtRpcDiastoleFeto' + valor.numeroFeto).val(valor.rpcDiastole);
                $('#txtIsmoAorticoIpFeto' + valor.numeroFeto).val(valor.ipIsmoAortico);
                $('#txtIsmoAorticoPercFeto' + valor.numeroFeto).val(valor.ismoAorticoPerc);
                $('#txtIsmoAorticoDiastoleFeto' + valor.numeroFeto).val(valor.ismoAorticoDiastole);
                $('#txtDuctusVenosoIpFeto' + valor.numeroFeto).val(valor.ipDucVen);
                $('#txtDuctusVenosoPercFeto' + valor.numeroFeto).val(valor.ductoVenosoPerc);
                $('#txtDuctusVenosoDiastoleFeto' + valor.numeroFeto).val(valor.ductoVenosoDiastole);
                $('#txtVenaUmbilicalIpFeto' + valor.numeroFeto).val(valor.venaUmbIp);
                $('#txtVenaUmbilicalPercFeto' + valor.numeroFeto).val(valor.venaUmbPerc);
                $('#txtVenaUmbilicalDiastoleFeto' + valor.numeroFeto).val(valor.venaUmbDiastole);

                $('#txtCerebeloFeto' + valor.numeroFeto).val(valor.cerebelo)
                $('#txtCisternaMagnaFeto' + valor.numeroFeto).val(valor.cisternaMagna)
                $('#txtPliegueNucalFeto' + valor.numeroFeto).val(valor.pliegueNucal)
                $('#txtHuesoNasalFeto' + valor.numeroFeto).val(valor.huesoNasal)
                $('#txtAstaPosteriorFeto' + valor.numeroFeto).val(valor.astaPosterior)
                $('#txtAstaAnteriorFeto' + valor.numeroFeto).val(valor.astaAnterior)


                $('#cboCorazonFeto' + valor.numeroFeto).val(valor.corazon)
                $('#cboGastroIntestinalFeto' + valor.numeroFeto).val(valor.gastroIntestinal)
                $('#cboParedAbdominalFeto' + valor.numeroFeto).val(valor.paredAbdominal)
                $('#cboCaraFeto' + valor.numeroFeto).val(valor.cara)
                $('#cboColumnaFeto' + valor.numeroFeto).val(valor.columna)
                $('#cboSncFeto' + valor.numeroFeto).val(valor.snc)
                $('#cboPiesFeto' + valor.numeroFeto).val(valor.pies)
                $('#cboToraxFeto' + valor.numeroFeto).val(valor.torax)
                $('#cboMusculoEsqueleticoFeto' + valor.numeroFeto).val(valor.musculoEsqueletico)
                $('#cboCuelloFeto' + valor.numeroFeto).val(valor.cuello)
                $('#cboUrogenitalFeto' + valor.numeroFeto).val(valor.urogenital)
                $('#cboManosFeto' + valor.numeroFeto).val(valor.manos)


                $('#cboAnatomia').val(valor.anatomia);
                $('#txtAnatomia').val(valor.anatomiaTexto);


                $('#txtAuterinaDerecha').val(valor.ipUterinaDerecha);
                $('#txtAuterinaIzquierda').val(valor.ipUterinaIzquierda);
                $('#txtAuterinaIpMedio').val(valor.uterinasIpMedio);
                $('#txtAuterinaPerc').val(valor.uterinaPerc);
                $('#txtAuterinaMom').val(valor.uterinaMom);
                $('#txtPaMaternaSd').val(valor.sistolicaDerecha);
                $('#txtPaMaternaSi').val(valor.sistolicaIzquierda);
                $('#txtPaMaternaDd').val(valor.diastolicaDerecha);
                $('#txtPaMaternaDi').val(valor.diastolicaIzquierda);
                $('#txtPaMaternaPam').val(valor.presionArterialMedia);
                $('#txtCervixUterino').val(valor.cervixUterino);


                $('#txtResObservacion').val(valor.observaciones);
                $('#txtResConclusion').val(valor.conclusion);
                $('#txtResSugerencia').val(valor.sugerencia);

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
                    url: "/ImagenologiaEcografias/SeleccionarEcoMorfologica?area=Imagenologia",
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

        let fetos = $('input[name="rdbFeto"]:checked').val();
        for (let i = 1; i <= fetos; i++) {
            objRes = {
                NumeroFeto: i,
                Presentacion: $('#cboPresentacionFeto' + i).val(),
                Dbp: $('#txtDbpFeto' + i).val(),
                Cc: $('#txtCcFeto' + i).val(),
                Ca: $('#txtCaFeto' + i).val(),
                Lf: $('#txtLfFeto' + i).val(),
                Lh: $('#txtLhFeto' + i).val(),
                Peso: $('#txtPesoFeto' + i).val(),
                Sexo: $('#cboSexoFeto' + i).val(),
                EdadGestacional: $('#txtEdadGestacional').val(),
                Placenta: $('#cboPlacentaFeto' + i).val(),
                Grado: $('#cboGradoFeto' + i).val(),
                Cordon: $('#cboCordonFeto' + i).val(),
                ILA: $('#txtIlaFeto' + i).val(),
                IpUterinaDerecha: $('#txtAuterinaDerecha').val(),
                IpUterinaIzquierda: $('#txtAuterinaIzquierda').val(),
                UterinasIpMedio: $('#txtAuterinaIpMedio').val(),
                UterinaPerc: $('#txtAuterinaPerc').val(),
                UterinaMom: $('#txtAuterinaMom').val(),
                Observaciones: $('#txtResObservacion').val(),
                Conclusion: $('#txtResConclusion').val(),
                Sugerencia: $('#txtResSugerencia').val(),
                Fecha: null,
                IdProducto: Imagenologia.idProducto,
                IdOrden: Imagenologia.idOrden,
                IdRealizaPrueba: $('#cboRealizaPrueba').val(),
                IdMovimiento: Imagenologia.idMovimiento,
                Fc: $('#txtFcfFeto' + i).val(),
                SistolicaDerecha: $('#txtPaMaternaSd').val(),
                SistolicaIzquierda: $('#txtPaMaternaSi').val(),
                DiastolicaDerecha: $('#txtPaMaternaDd').val(),
                DiastolicaIzquierda: $('#txtPaMaternaDi').val(),
                PresionArterialMedia: $('#txtPaMaternaPam').val(),
                CervixUterino: $('#txtCervixUterino').val(),
                FUR: $('#txtFechaFUR').val(),
                FPP: $('#txtFechaFPP').val(),
                Pozo: $('#txtPozoFeto' + i).val(),
                Visualiz: $('#txtVisualizFeto' + i).val(),
                Perc: $('#txtPercFeto' + i).val(),
                Usuario: null,
                UsuarioUpdate: null,
                FechaUpdate: null,
                Liquido: $('#cboLiquidoFeto' + i).val(),

                IpArtUmb: $('#txtAUmbilicalIpFeto' + i).val(),
                AUmbilicalPerc: $('#txtAUmbilicalPercFeto' + i).val(),
                AUmbilicalDiastole: $('#txtAUmbilicalDiastoleFeto' + i).val(),
                IpArtCMedia: $('#txtAcmIpFeto' + i).val(),
                ACMPerc: $('#txtAcmPercFeto' + i).val(),
                ACMDiastole: $('#txtAcmDiastoleFeto' + i).val(),
                VpsAcm: $('#txtRpcIpFeto' + i).val(),
                RPCPerc: $('#txtRpcPercFeto' + i).val(),
                RPCDiastole: $('#txtRpcDiastoleFeto' + i).val(),
                IpIsmoAortico: $('#txtIsmoAorticoIpFeto' + i).val(),
                IsmoAorticoPerc: $('#txtIsmoAorticoPercFeto' + i).val(),
                IsmoAorticoDiastole: $('#txtIsmoAorticoDiastoleFeto' + i).val(),
                IpDucVen: $('#txtDuctusVenosoIpFeto' + i).val(),
                DuctoVenosoPerc: $('#txtDuctusVenosoPercFeto' + i).val(),
                DuctoVenosoDiastole: $('#txtDuctusVenosoDiastoleFeto' + i).val(),
                VenaUmbIp: $('#txtVenaUmbilicalIpFeto' + i).val(),
                VenaUmbPerc: $('#txtVenaUmbilicalPercFeto' + i).val(),
                VenaUmbDiastole: $('#txtVenaUmbilicalDiastoleFeto' + i).val(),

                Cerebelo: $("#txtCerebeloFeto" + i).val(),
                CisternaMagna: $("#txtCisternaMagnaFeto" + i).val(),
                PliegueNucal: $("#txtPliegueNucalFeto" + i).val(),
                HuesoNasal: $("#txtHuesoNasalFeto" + i).val(),
                AstaPosterior: $("#txtAstaPosteriorFeto" + i).val(),
                AstaAnterior: $("#txtAstaAnteriorFeto" + i).val(),
                Corazon: $("#cboCorazonFeto" + i).val(),
                GastroIntestinal: $("#cboGastroIntestinalFeto" + i).val(),
                ParedAbdominal: $("#cboParedAbdominalFeto" + i).val(),
                Cara: $("#cboCaraFeto" + i).val(),
                Columna: $("#cboColumnaFeto" + i).val(),
                Snc: $("#cboSncFeto" + i).val(),
                Pies: $("#cboPiesFeto" + i).val(),
                Torax: $("#cboToraxFeto" + i).val(),
                MusculoEsqueletico: $("#cboMusculoEsqueleticoFeto" + i).val(),
                Cuello: $("#cboCuelloFeto" + i).val(),
                Urogenital: $("#cboUrogenitalFeto" + i).val(),
                Manos: $("#cboManosFeto" + i).val(),
                Anatomia: $('#cboAnatomia').val(),
                AnatomiaTexto: $('#txtAnatomia').val()
            }

            detalleResultado.push(objRes);
        }

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
                    url: "/ImagenologiaEcografias/GuardarEcoMorfologica?area=Imagenologia",
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