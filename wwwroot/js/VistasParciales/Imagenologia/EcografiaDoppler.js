let EcografiaDoppler = {

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

    TiposSexoSeleccionarTodosEcografias: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/TiposSexoSeleccionarTodosEcografias`, formData)

        $('#cboSexoFeto1').empty()
        $('#cboSexoFeto2').empty()
        $('#cboSexoFeto3').empty()

        $('#cboSexoFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboSexoFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboSexoFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboSexoFeto1').append('<option  value="' + obj.idTipoSexoEco + '">' + obj.descripcion + '</option>')
            $('#cboSexoFeto2').append('<option  value="' + obj.idTipoSexoEco + '">' + obj.descripcion + '</option>')
            $('#cboSexoFeto3').append('<option  value="' + obj.idTipoSexoEco + '">' + obj.descripcion + '</option>')
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


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

    ListaComboMorfFetal: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboMorfFetalFeto1').empty()
        $('#cboMorfFetalFeto2').empty()
        $('#cboMorfFetalFeto3').empty()

        $('#cboMorfFetalFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboMorfFetalFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboMorfFetalFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboMorfFetalFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboMorfFetalFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboMorfFetalFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
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

    ListaComboPresentacion: async function (IdCatalogoCombo) {

        let formData = new FormData()

        formData.append("IdCatalogoCombo", IdCatalogoCombo);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaComboDetalle`, formData)

        $('#cboPresentacionFeto1').empty()
        $('#cboPresentacionFeto2').empty()
        $('#cboPresentacionFeto3').empty()

        $('#cboPresentacionFeto1').append('<option  value="0">--Seleccionar--</option>')
        $('#cboPresentacionFeto2').append('<option  value="0">--Seleccionar--</option>')
        $('#cboPresentacionFeto3').append('<option  value="0">--Seleccionar--</option>')


        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            $('#cboPresentacionFeto1').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboPresentacionFeto2').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
            $('#cboPresentacionFeto3').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>')
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

    ListaEcoDopplerCrecimiento: async function (IdMovimiento, IdProducto, Numero) {

        let formData = new FormData()

        formData.append("IdMovimiento", IdMovimiento);
        formData.append("IdProducto", IdProducto);
        formData.append("Numero", Numero);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaEcoDopplerCrecimiento`, formData)

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


        let res = await EcografiaDoppler.ListaEcoDopplerCrecimiento(Imagenologia.idMovimiento, Imagenologia.idProducto, 1)

        if (res) {
            EcografiaDoppler.CargarResultadoEcoDopplerCrecimiento(res)
        }

        res = await EcografiaDoppler.ListaEcoDopplerCrecimiento(Imagenologia.idMovimiento, Imagenologia.idProducto, 2)

        if (res) {
            EcografiaDoppler.CargarResultadoEcoDopplerCrecimiento(res)
        }

        res = await EcografiaDoppler.ListaEcoDopplerCrecimiento(Imagenologia.idMovimiento, Imagenologia.idProducto, 3)

        if (res) {
            EcografiaDoppler.CargarResultadoEcoDopplerCrecimiento(res)
        }
    },
    CargarResultadoEcoDopplerCrecimiento: function (data) {

        $('#txtFechaFUR').datepicker("setDate", data.fur);
        $('#txtFechaFPP').datepicker("setDate", data.fpp);
        $('#txtEdadGestacional').val(data.edadGestacional)

        //$('#embrionUno-tab-link').hide()
        $('#fetoDos-tab-link').hide()
        $('#fetoTres-tab-link').hide()

        if (data.numeroFeto == 1) {
            $('#cboPresentacionFeto1').val(data.presentacion);
            $('#txtDbpFeto1').val(data.dbp);
            $('#txtCcFeto1').val(data.cc);
            $('#txtCaFeto1').val(data.ca);
            $('#txtLfFeto1').val(data.lf);
            $('#txtLhFeto1').val(data.lh);
            $('#txtPesoFeto1').val(data.peso);
            $('#txtPercFeto1').val(data.perc);
            $('#cboSexoFeto1').val(data.sexo);
            $('#txtFcfFeto1').val(data.fc);
            $('#cboCordonFeto1').val(data.cordon);
            $('#cboPlacentaFeto1').val(data.placenta);
            $('#cboGradoFeto1').val(data.grado);
            $('#txtIlaFeto1').val(data.ila);
            $('#cboLiquidoFeto1').val(data.liquido);
            $('#txtPozoFeto1').val(data.pozo);
            $('#txtVisualizFeto1').val(data.visualiz);
            $('#txtLiquidoAmnioticoFeto1').val(data.liquidoAmn);
            $('#txtMovRespiratoriosFeto1').val(data.movRespiratorios);
            $('#txtMovCorporalesFeto1').val(data.movCorporales);
            $('#txtTonoFeto1').val(data.tono);
            $('#txtReactividadFeto1').val(data.reactividad);
            $('#txtTotalFeto1').val(data.totaL);
            $('#txtAUmbilicalIpFeto1').val(data.ipArtUmb);
            $('#txtAUmbilicalPercFeto1').val(data.aUmbilicalPerc);
            $('#txtAUmbilicalDiastoleFeto1').val(data.aUmbilicalDiastole);
            $('#txtAcmIpFeto1').val(data.ipArtCMedia);
            $('#txtAcmPercFeto1').val(data.acmPerc);
            $('#txtAcmDiastoleFeto1').val(data.acmDiastole);
            $('#txtRpcIpFeto1').val(data.ipRpc);
            $('#txtRpcPercFeto1').val(data.rpcPerc);
            $('#txtRpcDiastoleFeto1').val(data.rpcDiastole);
            $('#txtVpsAcmIpFeto1').val(data.ipVpsAcm);
            $('#txtVpsAcmPercFeto1').val(data.vpsACMPerc);
            $('#txtVpsAcmDiastoleFeto1').val(data.vpsACMDiastole);
            $('#txtIsmoAorticoIpFeto1').val(data.ipIsmoAortico);
            $('#txtIsmoAorticoPercFeto1').val(data.ismoAorticoPerc);
            $('#txtIsmoAorticoDiastoleFeto1').val(data.ismoAorticoDiastole);
            $('#txtDuctusVenosoIpFeto1').val(data.ipDucVen);
            $('#txtDuctusVenosoPercFeto1').val(data.ductoVenosoPerc);
            $('#txtDuctusVenosoDiastoleFeto1').val(data.ductoVenosoDiastole);
            $('#txtVenaUmbilicalIpFeto1').val(data.venaUmbIp);
            $('#txtVenaUmbilicalPercFeto1').val(data.venaUmbPerc);
            $('#txtVenaUmbilicalDiastoleFeto1').val(data.venaUmbDiastole);

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



        } else if (data.numeroFeto == 2) {
            $('#cboPresentacionFeto2').val(data.presentacion);
            $('#txtDbpFeto2').val(data.dbp);
            $('#txtCcFeto2').val(data.cc);
            $('#txtCaFeto2').val(data.ca);
            $('#txtLfFeto2').val(data.lf);
            $('#txtLhFeto2').val(data.lh);
            $('#txtPesoFeto2').val(data.peso);
            $('#txtPercFeto2').val(data.perc);
            $('#cboSexoFeto2').val(data.sexo);
            $('#txtFcfFeto2').val(data.fc);
            $('#cboCordonFeto2').val(data.cordon);
            $('#cboPlacentaFeto2').val(data.placenta);
            $('#cboGradoFeto2').val(data.grado);
            $('#txtIlaFeto2').val(data.ila);
            $('#cboLiquidoFeto2').val(data.liquido);
            $('#txtPozoFeto2').val(data.pozo);
            $('#txtVisualizFeto2').val(data.visualiz);
            $('#txtLiquidoAmnioticoFeto2').val(data.liquidoAmn);
            $('#txtMovRespiratoriosFeto2').val(data.movRespiratorios);
            $('#txtMovCorporalesFeto2').val(data.movCorporales);
            $('#txtTonoFeto2').val(data.tono);
            $('#txtReactividadFeto2').val(data.reactividad);
            $('#txtTotalFeto2').val(data.totaL);
            $('#txtAUmbilicalIpFeto2').val(data.ipArtUmb);
            $('#txtAUmbilicalPercFeto2').val(data.aUmbilicalPerc);
            $('#txtAUmbilicalDiastoleFeto2').val(data.aUmbilicalDiastole);
            $('#txtAcmIpFeto2').val(data.ipArtCMedia);
            $('#txtAcmPercFeto2').val(data.acmPerc);
            $('#txtAcmDiastoleFeto2').val(data.acmDiastole);
            $('#txtRpcIpFeto2').val(data.ipRpc);
            $('#txtRpcPercFeto2').val(data.rpcPerc);
            $('#txtRpcDiastoleFeto2').val(data.rpcDiastole);
            $('#txtVpsAcmIpFeto2').val(data.ipVpsAcm);
            $('#txtVpsAcmPercFeto2').val(data.vpsACMPerc);
            $('#txtVpsAcmDiastoleFeto2').val(data.vpsACMDiastole);
            $('#txtIsmoAorticoIpFeto2').val(data.ipIsmoAortico);
            $('#txtIsmoAorticoPercFeto2').val(data.ismoAorticoPerc);
            $('#txtIsmoAorticoDiastoleFeto2').val(data.ismoAorticoDiastole);
            $('#txtDuctusVenosoIpFeto2').val(data.ipDucVen);
            $('#txtDuctusVenosoPercFeto2').val(data.ductoVenosoPerc);
            $('#txtDuctusVenosoDiastoleFeto2').val(data.ductoVenosoDiastole);
            $('#txtVenaUmbilicalIpFeto2').val(data.venaUmbIp);
            $('#txtVenaUmbilicalPercFeto2').val(data.venaUmbPerc);
            $('#txtVenaUmbilicalDiastoleFeto2').val(data.venaUmbDiastole);

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

            $('#fetoDos-tab-link').show()
            $('#fetoDos-tab-link').click()
            $('input[name="rdbFeto"][value="2"]').prop('checked', true);
        } else if (data.numeroFeto == 3) {
            $('#cboPresentacionFeto3').val(data.presentacion);
            $('#txtDbpFeto3').val(data.dbp);
            $('#txtCcFeto3').val(data.cc);
            $('#txtCaFeto3').val(data.ca);
            $('#txtLfFeto3').val(data.lf);
            $('#txtLhFeto3').val(data.lh);
            $('#txtPesoFeto3').val(data.peso);
            $('#txtPercFeto3').val(data.perc);
            $('#cboSexoFeto3').val(data.sexo);
            $('#txtFcfFeto3').val(data.fc);
            $('#cboCordonFeto3').val(data.cordon);
            $('#cboPlacentaFeto3').val(data.placenta);
            $('#cboGradoFeto3').val(data.grado);
            $('#txtIlaFeto3').val(data.ila);
            $('#cboLiquidoFeto3').val(data.liquido);
            $('#txtPozoFeto3').val(data.pozo);
            $('#txtVisualizFeto3').val(data.visualiz);
            $('#txtLiquidoAmnioticoFeto3').val(data.liquidoAmn);
            $('#txtMovRespiratoriosFeto3').val(data.movRespiratorios);
            $('#txtMovCorporalesFeto3').val(data.movCorporales);
            $('#txtTonoFeto3').val(data.tono);
            $('#txtReactividadFeto3').val(data.reactividad);
            $('#txtTotalFeto3').val(data.totaL);
            $('#txtAUmbilicalIpFeto3').val(data.ipArtUmb);
            $('#txtAUmbilicalPercFeto3').val(data.aUmbilicalPerc);
            $('#txtAUmbilicalDiastoleFeto3').val(data.aUmbilicalDiastole);
            $('#txtAcmIpFeto3').val(data.ipArtCMedia);
            $('#txtAcmPercFeto3').val(data.acmPerc);
            $('#txtAcmDiastoleFeto3').val(data.acmDiastole);
            $('#txtRpcIpFeto3').val(data.ipRpc);
            $('#txtRpcPercFeto3').val(data.rpcPerc);
            $('#txtRpcDiastoleFeto3').val(data.rpcDiastole);
            $('#txtVpsAcmIpFeto3').val(data.ipVpsAcm);
            $('#txtVpsAcmPercFeto3').val(data.vpsACMPerc);
            $('#txtVpsAcmDiastoleFeto3').val(data.vpsACMDiastole);
            $('#txtIsmoAorticoIpFeto3').val(data.ipIsmoAortico);
            $('#txtIsmoAorticoPercFeto3').val(data.ismoAorticoPerc);
            $('#txtIsmoAorticoDiastoleFeto3').val(data.ismoAorticoDiastole);
            $('#txtDuctusVenosoIpFeto3').val(data.ipDucVen);
            $('#txtDuctusVenosoPercFeto3').val(data.ductoVenosoPerc);
            $('#txtDuctusVenosoDiastoleFeto3').val(data.ductoVenosoDiastole);
            $('#txtVenaUmbilicalIpFeto3').val(data.venaUmbIp);
            $('#txtVenaUmbilicalPercFeto3').val(data.venaUmbPerc);
            $('#txtVenaUmbilicalDiastoleFeto3').val(data.venaUmbDiastole);

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

            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());

            formData.append('Presentacion', $('#cboPresentacionFeto1').val());
            formData.append('Dbp', $('#txtDbpFeto1').val());
            formData.append('Cc', $('#txtCcFeto1').val());
            formData.append('Ca', $('#txtCaFeto1').val());
            formData.append('Lf', $('#txtLfFeto1').val());
            formData.append('Lh', $('#txtLhFeto1').val());
            formData.append('Peso', $('#txtPesoFeto1').val());
            formData.append('Perc', $('#txtPercFeto1').val());
            formData.append('Sexo', $('#cboSexoFeto1').val());
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
            formData.append('LiquidoAmn', $('#txtLiquidoAmnioticoFeto1').val());
            formData.append('MovRespiratorios', $('#txtMovRespiratoriosFeto1').val());
            formData.append('MovCorporales', $('#txtMovCorporalesFeto1').val());
            formData.append('Tono', $('#txtTonoFeto1').val());
            formData.append('Reactividad', $('#txtReactividadFeto1').val());
            formData.append('TotaL', $('#txtTotalFeto1').val());
            formData.append('IpArtUmb', $('#txtAUmbilicalIpFeto1').val());
            formData.append('AUmbilicalPerc', $('#txtAUmbilicalPercFeto1').val());
            formData.append('AUmbilicalDiastole', $('#txtAUmbilicalDiastoleFeto1').val());
            formData.append('IpArtCMedia', $('#txtAcmIpFeto1').val());
            formData.append('ACMPerc', $('#txtAcmPercFeto1').val());
            formData.append('ACMDiastole', $('#txtAcmDiastoleFeto1').val());
            formData.append('IpRpc', $('#txtRpcIpFeto1').val());
            formData.append('RPCPerc', $('#txtRpcPercFeto1').val());
            formData.append('RPCDiastole', $('#txtRpcDiastoleFeto1').val());
            formData.append('VpsAcmIp', $('#txtVpsAcmIpFeto1').val());
            formData.append('VpsAcmPerc', $('#txtVpsAcmPercFeto1').val());
            formData.append('VpsAcmDiastole', $('#txtVpsAcmDiastoleFeto1').val());
            formData.append('IpIsmoAortico', $('#txtIsmoAorticoIpFeto1').val());
            formData.append('IsmoAorticoPerc', $('#txtIsmoAorticoPercFeto1').val());
            formData.append('IsmoAorticoDiastole', $('#txtIsmoAorticoDiastoleFeto1').val());
            formData.append('IpDucVen', $('#txtDuctusVenosoIpFeto1').val());
            formData.append('DuctoVenosoPerc', $('#txtDuctusVenosoPercFeto1').val());
            formData.append('DuctoVenosoDiastole', $('#txtDuctusVenosoDiastoleFeto1').val());
            formData.append('VenaUmbIp', $('#txtVenaUmbilicalIpFeto1').val());
            formData.append('VenaUmbPerc', $('#txtVenaUmbilicalPercFeto1').val());
            formData.append('VenaUmbDiastole', $('#txtVenaUmbilicalDiastoleFeto1').val());

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

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoDopplerCrecimiento`, formData)
        }

        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbFeto"]:checked').val() >= 2) {
            formData.append('NumeroFeto', 2);

            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());

            formData.append('Presentacion', $('#cboPresentacionFeto2').val());
            formData.append('Dbp', $('#txtDbpFeto2').val());
            formData.append('Cc', $('#txtCcFeto2').val());
            formData.append('Ca', $('#txtCaFeto2').val());
            formData.append('Lf', $('#txtLfFeto2').val());
            formData.append('Lh', $('#txtLhFeto2').val());
            formData.append('Peso', $('#txtPesoFeto2').val());
            formData.append('Perc', $('#txtPercFeto2').val());
            formData.append('Sexo', $('#cboSexoFeto2').val());
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
            formData.append('LiquidoAmn', $('#txtLiquidoAmnioticoFeto2').val());
            formData.append('MovRespiratorios', $('#txtMovRespiratoriosFeto2').val());
            formData.append('MovCorporales', $('#txtMovCorporalesFeto2').val());
            formData.append('Tono', $('#txtTonoFeto2').val());
            formData.append('Reactividad', $('#txtReactividadFeto2').val());
            formData.append('TotaL', $('#txtTotalFeto2').val());
            formData.append('IpArtUmb', $('#txtAUmbilicalIpFeto2').val());
            formData.append('AUmbilicalPerc', $('#txtAUmbilicalPercFeto2').val());
            formData.append('AUmbilicalDiastole', $('#txtAUmbilicalDiastoleFeto2').val());
            formData.append('IpArtCMedia', $('#txtAcmIpFeto2').val());
            formData.append('ACMPerc', $('#txtAcmPercFeto2').val());
            formData.append('ACMDiastole', $('#txtAcmDiastoleFeto2').val());
            formData.append('IpRpc', $('#txtRpcIpFeto2').val());
            formData.append('RPCPerc', $('#txtRpcPercFeto2').val());
            formData.append('RPCDiastole', $('#txtRpcDiastoleFeto2').val());
            formData.append('VpsAcmIp', $('#txtVpsAcmIpFeto2').val());
            formData.append('VpsAcmPerc', $('#txtVpsAcmPercFeto2').val());
            formData.append('VpsAcmDiastole', $('#txtVpsAcmDiastoleFeto2').val());
            formData.append('IpIsmoAortico', $('#txtIsmoAorticoIpFeto2').val());
            formData.append('IsmoAorticoPerc', $('#txtIsmoAorticoPercFeto2').val());
            formData.append('IsmoAorticoDiastole', $('#txtIsmoAorticoDiastoleFeto2').val());
            formData.append('IpDucVen', $('#txtDuctusVenosoIpFeto2').val());
            formData.append('DuctoVenosoPerc', $('#txtDuctusVenosoPercFeto2').val());
            formData.append('DuctoVenosoDiastole', $('#txtDuctusVenosoDiastoleFeto2').val());
            formData.append('VenaUmbIp', $('#txtVenaUmbilicalIpFeto2').val());
            formData.append('VenaUmbPerc', $('#txtVenaUmbilicalPercFeto2').val());
            formData.append('VenaUmbDiastole', $('#txtVenaUmbilicalDiastoleFeto2').val());

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

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoDopplerCrecimiento`, formData)
        }




        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbFeto"]:checked').val() >= 3) {
            formData.append('NumeroFeto', 3);

            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());

            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());

            formData.append('Presentacion', $('#cboPresentacionFeto3').val());
            formData.append('Dbp', $('#txtDbpFeto3').val());
            formData.append('Cc', $('#txtCcFeto3').val());
            formData.append('Ca', $('#txtCaFeto3').val());
            formData.append('Lf', $('#txtLfFeto3').val());
            formData.append('Lh', $('#txtLhFeto3').val());
            formData.append('Peso', $('#txtPesoFeto3').val());
            formData.append('Perc', $('#txtPercFeto3').val());
            formData.append('Sexo', $('#cboSexoFeto3').val());
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
            formData.append('LiquidoAmn', $('#txtLiquidoAmnioticoFeto3').val());
            formData.append('MovRespiratorios', $('#txtMovRespiratoriosFeto3').val());
            formData.append('MovCorporales', $('#txtMovCorporalesFeto3').val());
            formData.append('Tono', $('#txtTonoFeto3').val());
            formData.append('Reactividad', $('#txtReactividadFeto3').val());
            formData.append('TotaL', $('#txtTotalFeto3').val());
            formData.append('IpArtUmb', $('#txtAUmbilicalIpFeto3').val());
            formData.append('AUmbilicalPerc', $('#txtAUmbilicalPercFeto3').val());
            formData.append('AUmbilicalDiastole', $('#txtAUmbilicalDiastoleFeto3').val());
            formData.append('IpArtCMedia', $('#txtAcmIpFeto3').val());
            formData.append('ACMPerc', $('#txtAcmPercFeto3').val());
            formData.append('ACMDiastole', $('#txtAcmDiastoleFeto3').val());
            formData.append('IpRpc', $('#txtRpcIpFeto3').val());
            formData.append('RPCPerc', $('#txtRpcPercFeto3').val());
            formData.append('RPCDiastole', $('#txtRpcDiastoleFeto3').val());
            formData.append('VpsAcmIp', $('#txtVpsAcmIpFeto3').val());
            formData.append('VpsAcmPerc', $('#txtVpsAcmPercFeto3').val());
            formData.append('VpsAcmDiastole', $('#txtVpsAcmDiastoleFeto3').val());
            formData.append('IpIsmoAortico', $('#txtIsmoAorticoIpFeto3').val());
            formData.append('IsmoAorticoPerc', $('#txtIsmoAorticoPercFeto3').val());
            formData.append('IsmoAorticoDiastole', $('#txtIsmoAorticoDiastoleFeto3').val());
            formData.append('IpDucVen', $('#txtDuctusVenosoIpFeto3').val());
            formData.append('DuctoVenosoPerc', $('#txtDuctusVenosoPercFeto3').val());
            formData.append('DuctoVenosoDiastole', $('#txtDuctusVenosoDiastoleFeto3').val());
            formData.append('VenaUmbIp', $('#txtVenaUmbilicalIpFeto3').val());
            formData.append('VenaUmbPerc', $('#txtVenaUmbilicalPercFeto3').val());
            formData.append('VenaUmbDiastole', $('#txtVenaUmbilicalDiastoleFeto3').val());

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

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoDopplerCrecimiento`, formData)
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

        await EcografiaDoppler.Plugins()

        await EcografiaDoppler.Events()

        await EcografiaDoppler.TiposSexoSeleccionarTodosEcografias();
        await EcografiaDoppler.ListaComboMorfFetal(40);
        await EcografiaDoppler.ListaComboDetalle(41);
        await EcografiaDoppler.ListaComboLiquido(42);
        await EcografiaDoppler.ListaComboPresentacion(36);
        await EcografiaDoppler.ListaComboPlacenta(37);
        await EcografiaDoppler.ListaComboGrado(38);
        await EcografiaDoppler.ListaComboCordon(39);
    }
}