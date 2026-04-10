let EcografiaVaginalBasica = {
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
        $('#cboAnatomia').append('<option  value="0">--Seleccionar--</option>')

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
            //}
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },
    ListaEcoVaginalBasica: async function (IdMovimiento, IdProducto, Numero) {

        let formData = new FormData()

        formData.append("IdMovimiento", IdMovimiento);
        formData.append("IdProducto", IdProducto);
        formData.append("Numero", Numero);

        let response = await HttpClient.Post(`/ImagenesResultados/ListaEcoVaginalBasica`, formData)

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
        

        let res = await EcografiaVaginalBasica.ListaEcoVaginalBasica(Imagenologia.idMovimiento, Imagenologia.idProducto, 1)

        if (res) {
            EcografiaVaginalBasica.CargarResultadoEcoVaginalBasica(res)
        }

        res = await EcografiaVaginalBasica.ListaEcoVaginalBasica(Imagenologia.idMovimiento, Imagenologia.idProducto, 2)

        if (res) {
            EcografiaVaginalBasica.CargarResultadoEcoVaginalBasica(res)
        }

        res = await EcografiaVaginalBasica.ListaEcoVaginalBasica(Imagenologia.idMovimiento, Imagenologia.idProducto, 3)

        if (res) {
            EcografiaVaginalBasica.CargarResultadoEcoVaginalBasica(res)
        }
    },
    CargarResultadoEcoVaginalBasica: function (data) {

        $('#txtFechaFUR').datepicker("setDate", data.fur);
        $('#txtFechaFPP').datepicker("setDate", data.fpp);
        $('#txtEdadGestacional').val(data.edadGestacional)

        //$('#embrionUno-tab-link').hide()
        $('#embrionDos-tab-link').hide()
        $('#embrionTres-tab-link').hide()

        if (data.numeroFeto == 1) {
            $('#txtLcnEmbrion1').val(data.lcn)
            $('#txtSacoGEmbrion1').val(data.sacoG)
            $('#txtSvitelinoEmbrion1').val(data.svitelino)
            $('#txtFcfEmbrion1').val(data.fcf)
        } else if (data.numeroFeto == 2) {
            $('#txtLcnEmbrion2').val(data.lcn)
            $('#txtSacoGEmbrion2').val(data.sacoG)
            $('#txtSvitelinoEmbrion2').val(data.svitelino)
            $('#txtFcfEmbrion2').val(data.fcf)

            $('#embrionDos-tab-link').show()
            $('#embrionDos-tab-link').click()
            $('input[name="rdbEmbrion"][value="2"]').prop('checked', true);
        } else if (data.numeroFeto == 3) {
            $('#txtLcnEmbrion3').val(data.lcn)
            $('#txtSacoGEmbrion3').val(data.sacoG)
            $('#txtSvitelinoEmbrion3').val(data.svitelino)
            $('#txtFcfEmbrion3').val(data.fcf)

            $('#embrionDos-tab-link').show()
            $('#embrionTres-tab-link').show()
            $('#embrionTres-tab-link').click()
            $('input[name="rdbEmbrion"][value="3"]').prop('checked', true);
        }

        $('#txtUterno').val(data.utero)
        $('#txtCuerpoLuteo').val(data.cuerpoLuteo)
        $('#txtHematomas').val(data.hematomas)
        $('#txtFsd').val(data.fsd)
        $('#cboAnatomia').val(data.anatomia)
        $('#txtAnatomia').val(data.anatomiaTexto)
        $('#txtResObservaciones').val(data.observaciones)
        $('#txtResConclusion').val(data.conclusion)
        $('#txtResSugerencia').val(data.sugerencia)

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
        if ($('input[name="rdbEmbrion"]:checked').val() >= 1) {
            formData.append('NumeroFeto', 1);
            formData.append('IdProducto', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbEmbrion"]:checked').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());
            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());
            formData.append('Lcn', $('#txtLcnEmbrion1').val());
            formData.append('SacoG', $('#txtSacoGEmbrion1').val());
            formData.append('Svitelino', $('#txtSvitelinoEmbrion1').val());
            formData.append('Fcf', $('#txtFcfEmbrion1').val());
            formData.append('CuerpoLuteo', $('#txtCuerpoLuteo').val());
            formData.append('Hematomas', $('#txtHematomas').val());
            formData.append('Fsd', $('#txtFsd').val());
            formData.append('Utero', $('#txtUterno').val());

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoVaginalBasica`, formData)
        }

        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbEmbrion"]:checked').val() >= 2) {
            formData.append('NumeroFeto', 2);
            formData.append('IdProducto', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbEmbrion"]:checked').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());
            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());
            formData.append('Lcn', $('#txtLcnEmbrion2').val());
            formData.append('SacoG', $('#txtSacoGEmbrion2').val());
            formData.append('Svitelino', $('#txtSvitelinoEmbrion2').val());
            formData.append('Fcf', $('#txtFcfEmbrion2').val());
            formData.append('CuerpoLuteo', $('#txtCuerpoLuteo').val());
            formData.append('Hematomas', $('#txtHematomas').val());
            formData.append('Fsd', $('#txtFsd').val());
            formData.append('Utero', $('#txtUterno').val());

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoVaginalBasica`, formData)
        }




        /////////////////////
        formData = new FormData()

        if ($('input[name="rdbEmbrion"]:checked').val() >= 3) {
            formData.append('NumeroFeto', 3);
            formData.append('IdProducto', Imagenologia.idProducto);
            formData.append('IdOrden', Imagenologia.idOrden);
            formData.append('IdMedico', $('#cboRealizaPrueba').val());
            formData.append('IdMovimiento', Imagenologia.idMovimiento);
            formData.append('Accion', $('input[name="rdbEmbrion"]:checked').val());
            formData.append('FUR', $('#txtFechaFUR').val());
            formData.append('FPP', $('#txtFechaFPP').val());
            formData.append('EdadGestacional', $('#txtEdadGestacional').val());
            formData.append('Observaciones', $('#txtResObservaciones').val());
            formData.append('Conclusion', $('#txtResConclusion').val());
            formData.append('Sugerencia', $('#txtResSugerencia').val());
            formData.append('Usuario', '');
            formData.append('Anatomia', $('#cboAnatomia').val());
            formData.append('AnatomiaTexto', $('#txtAnatomia').val());
            formData.append('Lcn', $('#txtLcnEmbrion3').val());
            formData.append('SacoG', $('#txtSacoGEmbrion3').val());
            formData.append('Svitelino', $('#txtSvitelinoEmbrion3').val());
            formData.append('Fcf', $('#txtFcfEmbrion3').val());
            formData.append('CuerpoLuteo', $('#txtCuerpoLuteo').val());
            formData.append('Hematomas', $('#txtHematomas').val());
            formData.append('Fsd', $('#txtFsd').val());
            formData.append('Utero', $('#txtUterno').val());

            response = await HttpClient.Post(`/ImagenesResultados/InsertaEcoVaginalBasica`, formData)
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

        $('input[name="rdbEmbrion"]').off('click').on('click', function () {
            // Obtener el valor seleccionado
            var valor = $(this).val();

            if (valor == 1) {
                $('#embrionDos-tab-link').hide()
                $('#embrionTres-tab-link').hide()
            } else if (valor == 2) {
                $('#embrionDos-tab-link').show()
                $('#embrionTres-tab-link').hide()
            } else if (valor == 3) {
                $('#embrionTres-tab-link').show()
            }
            console.log("Seleccionaste: " + valor);
        });
    },

    Init: function () {

        EcografiaVaginalBasica.Plugins()

        EcografiaVaginalBasica.Events()

        EcografiaVaginalBasica.ListaComboDetalle(41);
    }
}