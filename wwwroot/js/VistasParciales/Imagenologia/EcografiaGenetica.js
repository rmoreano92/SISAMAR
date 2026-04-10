let EcografiaGenetica = {

    Plugins: function () {
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

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicio, #txtHoraFin").mask("Hn:Nn");
    },
    ListaComboDetalle: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboAnatomia').empty()
        $('#cboOndaDvFeto1').empty()
        $('#cboTricuspideFeto1').empty()
        $('#cboHuesoNasalFeto1').empty()

        $('#cboOndaDvFeto2').empty()
        $('#cboTricuspideFeto2').empty()
        $('#cboHuesoNasalFeto2').empty()

        $('#cboOndaDvFeto3').empty()
        $('#cboTricuspideFeto3').empty()
        $('#cboHuesoNasalFeto3').empty()

        $('#cboAnatomia').append('<option  value="0">--Seleccionar--</option>')
        $('#cboOndaDvFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboTricuspideFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboHuesoNasalFeto1').append('<option  value="0">--Seleccionar--</option>')

        $('#cboOndaDvFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboTricuspideFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboHuesoNasalFeto2').append('<option  value="0">--Seleccionar--</option>')

        $('#cboOndaDvFeto3').append('<option  value="0">--Seleccionar--</option>')
        $('#cboTricuspideFeto3').append('<option  value="0">--Seleccionar--</option>')
        $('#cboHuesoNasalFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            //console.log('obj', obj)
            //if (obj.idEspecialidad == 13 || obj.idEspecialidad == 14) {
            $('#cboAnatomia').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboOndaDvFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboTricuspideFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboHuesoNasalFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')

            $('#cboOndaDvFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboTricuspideFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboHuesoNasalFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')

            $('#cboOndaDvFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboTricuspideFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboHuesoNasalFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            //}
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    ListaComboLiquido: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboLiquidoFeto1').empty()
        $('#cboLiquidoFeto2').empty()
        $('#cboLiquidoFeto3').empty()

        $('#cboLiquidoFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboLiquidoFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboLiquidoFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboLiquidoFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboLiquidoFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboLiquidoFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    ListaComboPlacenta: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboPlacentaFeto1').empty()
        $('#cboPlacentaFeto2').empty()
        $('#cboPlacentaFeto3').empty()

        $('#cboPlacentaFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboPlacentaFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboPlacentaFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboPlacentaFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboPlacentaFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboPlacentaFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    ListaComboGrado: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboGradoFeto1').empty()
        $('#cboGradoFeto2').empty()
        $('#cboGradoFeto3').empty()

        $('#cboGradoFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboGradoFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboGradoFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboGradoFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboGradoFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboGradoFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    ListaComboCordon: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboCordonFeto1').empty()
        $('#cboCordonFeto2').empty()
        $('#cboCordonFeto3').empty()

        $('#cboCordonFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboCordonFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboCordonFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboCordonFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboCordonFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboCordonFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    ListaEcoGenetica: async function (IdMovimiento, IdProducto, Numero) {

        let formData = new FormData()

        formData.append("IdMovimiento", IdMovimiento);
        formData.append("IdProducto", IdProducto);
        formData.append("Numero", Numero);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaEcoGenetica`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]

    },

    CargarDatos: async function () {


        let res = await EcografiaGenetica.ListaEcoGenetica(Imagenologia.idMovimiento, Imagenologia.idProducto, 1)

        if (res) {
            EcografiaGenetica.CargarResultadoEcoVaginalBasica(res)
        }

        res = await EcografiaGenetica.ListaEcoGenetica(Imagenologia.idMovimiento, Imagenologia.idProducto, 2)

        if (res) {
            EcografiaGenetica.CargarResultadoEcoVaginalBasica(res)
        }

        res = await EcografiaGenetica.ListaEcoGenetica(Imagenologia.idMovimiento, Imagenologia.idProducto, 3)

        if (res) {
            EcografiaGenetica.CargarResultadoEcoVaginalBasica(res)
        }
    },
    CargarResultadoEcoVaginalBasica: function (data) {

        $('#txtFechaFUR').datepicker("setDate", data.fur);
        $('#txtFechaFPP').datepicker("setDate", data.fpp);
        $('#txtEdadGestacional').val(data.edadGestacional)

        //$('#embrionUno-tab-link').hide()
        $('#fetoDos-tab-link').hide()
        $('#fetoTres-tab-link').hide()

        if (data.numeroFeto == 1) {
            $('#txtDbpFeto1').val(data.dbp);
            $('#txtCcFeto1').val(data.cc);
            $('#txtCaFeto1').val(data.ca);
            $('#txtLfFeto1').val(data.lf);
            $('#txtLcnFeto1').val(data.lcn);
            $('#txtPesoFeto1').val(data.peso);
            $('#txtPercFeto1').val(data.perc);
            $('#txtFcfFeto1').val(data.fc);
            $('#cboCordonFeto1').val(data.cordon);
            $('#cboPlacentaFeto1').val(data.placenta);
            $('#cboGradoFeto1').val(data.grado);
            $('#txtIlaFeto1').val(data.ila);
            $('#cboLiquidoFeto1').val(data.liquido);
            $('#txtPozoFeto1').val(data.pozo);
            $('#txtVisualizFeto1').val(data.visualiz);
            ;
            $('#txtTnFeto1').val(data.tn);
            $('#txtIpDvFeto1').val(data.ipDv);
            $('#cboOndaDvFeto1').val(data.ondaDv);
            $('#cboTricuspideFeto1').val(data.tricuspide);
            $('#cboHuesoNasalFeto1').val(data.huesoNasal);
            
            $('#txtOtroFeto1').val(data.otro);
            

        } else if (data.numeroFeto == 2) {
            $('#txtDbpFeto2').val(data.dbp);
            $('#txtCcFeto2').val(data.cc);
            $('#txtCaFeto2').val(data.ca);
            $('#txtLfFeto2').val(data.lf);
            $('#txtLcnFeto2').val(data.lcn);
            $('#txtPesoFeto2').val(data.peso);
            $('#txtPercFeto2').val(data.perc);
            $('#txtFcfFeto2').val(data.fc);
            $('#cboCordonFeto2').val(data.cordon);
            $('#cboPlacentaFeto2').val(data.placenta);
            $('#cboGradoFeto2').val(data.grado);
            $('#txtIlaFeto2').val(data.ila);
            $('#cboLiquidoFeto2').val(data.liquido);
            $('#txtPozoFeto2').val(data.pozo);
            $('#txtVisualizFeto2').val(data.visualiz);
            ;
            $('#txtTnFeto2').val(data.tn);
            $('#txtIpDvFeto2').val(data.ipDv);
            $('#cboOndaDvFeto2').val(data.ondaDv);
            $('#cboTricuspideFeto2').val(data.tricuspide);
            $('#cboHuesoNasalFeto2').val(data.huesoNasal);

            $('#txtOtroFeto2').val(data.otro);

            $('#fetoDos-tab-link').show()
            $('#fetoDos-tab-link').click()
            $('input[name="rdbFeto"][value="2"]').prop('checked', true);
        } else if (data.numeroFeto == 3) {
            $('#txtDbpFeto3').val(data.dbp);
            $('#txtCcFeto3').val(data.cc);
            $('#txtCaFeto3').val(data.ca);
            $('#txtLfFeto3').val(data.lf);
            $('#txtLcnFeto3').val(data.lcn);
            $('#txtPesoFeto3').val(data.peso);
            $('#txtPercFeto3').val(data.perc);
            $('#txtFcfFeto3').val(data.fc);
            $('#cboCordonFeto3').val(data.cordon);
            $('#cboPlacentaFeto3').val(data.placenta);
            $('#cboGradoFeto3').val(data.grado);
            $('#txtIlaFeto3').val(data.ila);
            $('#cboLiquidoFeto3').val(data.liquido);
            $('#txtPozoFeto3').val(data.pozo);
            $('#txtVisualizFeto3').val(data.visualiz);
            ;
            $('#txtTnFeto3').val(data.tn);
            $('#txtIpDvFeto3').val(data.ipDv);
            $('#cboOndaDvFeto3').val(data.ondaDv);
            $('#cboTricuspideFeto3').val(data.tricuspide);
            $('#cboHuesoNasalFeto3').val(data.huesoNasal);

            $('#txtOtroFeto3').val(data.otro);

            $('#fetoDos-tab-link').show()
            $('#fetoTres-tab-link').show()
            $('#fetoTres-tab-link').click()
            $('input[name="rdbFeto"][value="3"]').prop('checked', true);
        }

        //$('#txtIdExamen').val(data.idExamen);
        //$('#txtIdOrden').val(data.idOrden);
        ////$('#txtIdMedico').val(data.idMedico);
        //$('#txtIdMovimiento').val(data.idMovimiento)

        $('#txtResObservaciones').val(data.observaciones);
        $('#txtResConclusion').val(data.conclusion);
        $('#txtResSugerencia').val(data.sugerencia);

        $('#txtAuterinaDerecha').val(data.ipUterinaDerecha);
        $('#txtAuterinaIzquierda').val(data.ipUterinaIzquierda);
        $('#txtAuterinaIpMedio').val(data.uterinasIpMedio);
        $('#txtAuterinaPerc').val(data.uterinaPerc);
        $('#txtAuterinaMom').val(data.uterinaMom);
        $('#txtPaMaternaSd').val(data.sistolicaDerecha);
        $('#txtPaMaternaSi').val(data.sistolicaIzquierda);
        $('#txtPaMaternaDd').val(data.diastolicaDerecha);
        $('#txtPaMaternaDi').val(data.diastolicaIzquierda);
        $('#txtPaMaternaPam').val(data.presionArterialMedia);
        $('#txtCervixUterino').val(data.cervixUterino);

        //$('#txtUsuario').val(data.usuario);
        $('#cboAnatomia').val(data.anatomia);
        $('#txtAnatomia').val(data.anatomiaTexto);

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    LimpiarResultadoEcoVaginalBasica: function () {

        $('input[name="rdbEmbrion"][value="1"]').prop('checked', true);

        $('#embrionDos-tab-link').hide()
        $('#embrionTres-tab-link').hide()

        $('#embrionUno-tab-link').click()

        Imagenologia.idProducto = 0
        Imagenologia.idOrden = 0


        $('#txtFechaFUR').val("");
        $('#txtFechaFPP').val("");
        $('#txtEdadGestacional').val("");

        $('#txtLcnEmbrion1').val("")
        $('#txtSacoGEmbrion1').val("")
        $('#txtSvitelinoEmbrion1').val("")
        $('#txtFcfEmbrion1').val("")

        $('#txtLcnEmbrion2').val("")
        $('#txtSacoGEmbrion2').val("")
        $('#txtSvitelinoEmbrion2').val("")
        $('#txtFcfEmbrion2').val("")

        $('#txtLcnEmbrion3').val("")
        $('#txtSacoGEmbrion3').val("")
        $('#txtSvitelinoEmbrion3').val("")
        $('#txtFcfEmbrion3').val("")

        $('#txtUterno').val("")
        $('#txtCuerpoLuteo').val("")
        $('#txtHematomas').val("")
        $('#txtFsd').val("")
        $('#cboAnatomia').val("")
        $('#txtAnatomia').val("")
        $('#txtResObservaciones').val("")
        $('#txtResConclusion').val("")
        $('#txtResSugerencia').val("")

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    async GuardarResultado() {
        let formData = new FormData()
        let response

        Cargando(1)
        if ($('input[name="rdbFeto"]:checked').val() >= 1) {

            formData.append('NumeroFeto', 1);
            formData.append('Dbp', $('#txtDbpFeto1').val());
            formData.append('Cc', $('#txtCcFeto1').val());
            formData.append('Ca', $('#txtCaFeto1').val());
            formData.append('Lf', $('#txtLfFeto1').val());
            formData.append('Lcn', $('#txtLcnFeto1').val());
            formData.append('Peso', $('#txtPesoFeto1').val());
            formData.append('Perc', $('#txtPercFeto1').val());
            formData.append('Fc', $('#txtFcfFeto1').val());
            formData.append('Cordon', $('#cboCordonFeto1').val());
            formData.append('Placenta', $('#cboPlacentaFeto1').val());
            formData.append('Grado', $('#cboGradoFeto1').val());
            formData.append('ILA', $('#txtIlaFeto1').val());
            formData.append('Liquido', $('#cboLiquidoFeto1').val());
            formData.append('Pozo', $('#txtPozoFeto1').val());
            formData.append('Visualiz', $('#txtVisualizFeto1').val());
            formData.append('IdExamen', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbFeto"]:checked').val()); // se enviara el numero de fetos
            formData.append('Tn', $('#txtTnFeto1').val());
            formData.append('IpDv', $('#txtIpDvFeto1').val());
            formData.append('OndaDv', $('#cboOndaDvFeto1').val());
            formData.append('Tricuspide', $('#cboTricuspideFeto1').val());
            formData.append('HuesoNasal', $('#cboHuesoNasalFeto1').val());
            formData.append('Otro', $('#txtOtroFeto1').val());

            formData.append('IpUterinaDerecha', $('#txtAuterinaDerecha').val());
            formData.append('IpUterinaIzquierda', $('#txtAuterinaIzquierda').val());
            formData.append('UterinasIpMedio', $('#txtAuterinaIpMedio').val());
            formData.append('UterinaPerc', $('#txtAuterinaPerc').val());
            formData.append('UterinaMom', $('#txtAuterinaMom').val());
            formData.append('SistolicaDerecha', $('#txtPaMaternaSd').val());
            formData.append('SistolicaIzquierda', $('#txtPaMaternaSi').val());
            formData.append('DiastolicaDerecha', $('#txtPaMaternaDd').val());
            formData.append('DiastolicaIzquierda', $('#txtPaMaternaDi').val());
            formData.append('PresionArterialMedia', $('#txtPaMaternaPam').val());
            formData.append('CervixUterino', $('#txtCervixUterino').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());


            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoGenetica`, formData)
        }

        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbFeto"]:checked').val() >= 2) {
            formData.append('NumeroFeto', 2);
            formData.append('Dbp', $('#txtDbpFeto2').val());
            formData.append('Cc', $('#txtCcFeto2').val());
            formData.append('Ca', $('#txtCaFeto2').val());
            formData.append('Lf', $('#txtLfFeto2').val());
            formData.append('Lcn', $('#txtLcnFeto2').val());
            formData.append('Peso', $('#txtPesoFeto2').val());
            formData.append('Perc', $('#txtPercFeto2').val());
            formData.append('Fc', $('#txtFcfFeto2').val());
            formData.append('Cordon', $('#cboCordonFeto2').val());
            formData.append('Placenta', $('#cboPlacentaFeto2').val());
            formData.append('Grado', $('#cboGradoFeto2').val());
            formData.append('ILA', $('#txtIlaFeto2').val());
            formData.append('Liquido', $('#cboLiquidoFeto2').val());
            formData.append('Pozo', $('#txtPozoFeto2').val());
            formData.append('Visualiz', $('#txtVisualizFeto2').val());
            formData.append('IdExamen', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbFeto"]:checked').val()); // se enviara el numero de fetos
            formData.append('Tn', $('#txtTnFeto2').val());
            formData.append('IpDv', $('#txtIpDvFeto2').val());
            formData.append('OndaDv', $('#cboOndaDvFeto2').val());
            formData.append('Tricuspide', $('#cboTricuspideFeto2').val());
            formData.append('HuesoNasal', $('#cboHuesoNasalFeto2').val());
            formData.append('Otro', $('#txtOtroFeto2').val());

            formData.append('IpUterinaDerecha', $('#txtAuterinaDerecha').val());
            formData.append('IpUterinaIzquierda', $('#txtAuterinaIzquierda').val());
            formData.append('UterinasIpMedio', $('#txtAuterinaIpMedio').val());
            formData.append('UterinaPerc', $('#txtAuterinaPerc').val());
            formData.append('UterinaMom', $('#txtAuterinaMom').val());
            formData.append('SistolicaDerecha', $('#txtPaMaternaSd').val());
            formData.append('SistolicaIzquierda', $('#txtPaMaternaSi').val());
            formData.append('DiastolicaDerecha', $('#txtPaMaternaDd').val());
            formData.append('DiastolicaIzquierda', $('#txtPaMaternaDi').val());
            formData.append('PresionArterialMedia', $('#txtPaMaternaPam').val());
            formData.append('CervixUterino', $('#txtCervixUterino').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());


            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoGenetica`, formData)
        }




        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbFeto"]:checked').val() >= 3) {
            formData.append('NumeroFeto', 3);
            formData.append('Dbp', $('#txtDbpFeto3').val());
            formData.append('Cc', $('#txtCcFeto3').val());
            formData.append('Ca', $('#txtCaFeto3').val());
            formData.append('Lf', $('#txtLfFeto3').val());
            formData.append('Lcn', $('#txtLcnFeto3').val());
            formData.append('Peso', $('#txtPesoFeto3').val());
            formData.append('Perc', $('#txtPercFeto3').val());
            formData.append('Fc', $('#txtFcfFeto3').val());
            formData.append('Cordon', $('#cboCordonFeto3').val());
            formData.append('Placenta', $('#cboPlacentaFeto3').val());
            formData.append('Grado', $('#cboGradoFeto3').val());
            formData.append('ILA', $('#txtIlaFeto3').val());
            formData.append('Liquido', $('#cboLiquidoFeto3').val());
            formData.append('Pozo', $('#txtPozoFeto3').val());
            formData.append('Visualiz', $('#txtVisualizFeto3').val());
            formData.append('IdExamen', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbFeto"]:checked').val()); // se enviara el numero de fetos
            formData.append('Tn', $('#txtTnFeto3').val());
            formData.append('IpDv', $('#txtIpDvFeto3').val());
            formData.append('OndaDv', $('#cboOndaDvFeto3').val());
            formData.append('Tricuspide', $('#cboTricuspideFeto3').val());
            formData.append('HuesoNasal', $('#cboHuesoNasalFeto3').val());
            formData.append('Otro', $('#txtOtroFeto3').val());

            formData.append('IpUterinaDerecha', $('#txtAuterinaDerecha').val());
            formData.append('IpUterinaIzquierda', $('#txtAuterinaIzquierda').val());
            formData.append('UterinasIpMedio', $('#txtAuterinaIpMedio').val());
            formData.append('UterinaPerc', $('#txtAuterinaPerc').val());
            formData.append('UterinaMom', $('#txtAuterinaMom').val());
            formData.append('SistolicaDerecha', $('#txtPaMaternaSd').val());
            formData.append('SistolicaIzquierda', $('#txtPaMaternaSi').val());
            formData.append('DiastolicaDerecha', $('#txtPaMaternaDd').val());
            formData.append('DiastolicaIzquierda', $('#txtPaMaternaDi').val());
            formData.append('PresionArterialMedia', $('#txtPaMaternaPam').val());
            formData.append('CervixUterino', $('#txtCervixUterino').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());


            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoGenetica`, formData)
        }


        swal({
            title: 'Correcto',
            text: "El registro se ha guardado exitosamente.",
            type: 'success',
            allowOutsideClick: false,
            showCancelButton: false,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
        }).done()

        Cargando(0)

        if (isEmpty(response)) {
            return false
        }

        console.log('response', response)
    },

    Events: function () {
        //$('#btnGuardarResultado').off('click').on('click', async () => {
            

        //})

        $('input[name="rdbFeto"]').off('click').on('click', function () {
            // Obtener el valor seleccionado
            var valor = $(this).val();

            if (valor == 1) {
                $('#fetoDos-tab-link').hide()
                $('#fetoTres-tab-link').hide()
            } else if (valor == 2) {
                $('#fetoDos-tab-link').show()
                $('#fetoTres-tab-link').hide()
            } else if (valor == 3) {
                $('#fetoTres-tab-link').show()
            }
            console.log("Seleccionaste: " + valor);
        });
    },

    Init: async function () {

        await EcografiaGenetica.Plugins()

        await EcografiaGenetica.Events()

        await EcografiaGenetica.ListaComboDetalle(41);
        await EcografiaGenetica.ListaComboLiquido(42);
        await EcografiaGenetica.ListaComboPlacenta(37);
        await EcografiaGenetica.ListaComboGrado(38);
        await EcografiaGenetica.ListaComboCordon(39);
    }
}