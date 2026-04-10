var EcoVaginalBasica = {

    async Iniciar() {
        EcoVaginalBasica.Plugins();
        EcoVaginalBasica.Eventos();
        await EcoVaginalBasica.CargarCombos();

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

        $("#txtFechaFUR").on('change', async function () {
            let valor = $(this).val();

            await EcoVaginalBasica.CalcularEdadGestacional(valor);
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

    async CargarCombos() {
        $('#cboAnatomia').empty();

        Cargando(1);

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
                $("#cboRealizaPrueba").val(valor.idMedico);

                $('#txtFechaFUR').datepicker("setDate", valor.fur);
                $('#txtFechaFPP').datepicker("setDate", valor.fpp);
                $('#txtEdadGestacional').val(valor.edadGestacional);

                $('#txtLcnFeto' + valor.numeroFeto).val(valor.lcn);
                $('#txtSacoGFeto' + valor.numeroFeto).val(valor.sacoG);
                $('#txtSvitelinoFeto' + valor.numeroFeto).val(valor.svitelino);
                $('#txtFcfFeto' + valor.numeroFeto).val(valor.fcf);
                $('#txtUteroFeto' + valor.numeroFeto).val(valor.utero);
                $('#txtCuerpoLuteoFeto' + valor.numeroFeto).val(valor.cuerpoLuteo);
                $('#cboHematomasFeto' + valor.numeroFeto).val(valor.hematomas);
                $('#cboFsdFeto' + valor.numeroFeto).val(valor.fsd);

                $('#cboAnatomia').val(valor.anatomia);
                $('#txtAnatomia').val(valor.anatomiaTexto);

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
                    url: "/ImagenologiaEcografias/SeleccionarEcoVaginalBasica?area=Imagenologia",
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
                IdProducto: Imagenologia.idProducto,
                IdOrden: Imagenologia.idOrden,
                IdRealizaPrueba: $('#cboRealizaPrueba').val(),
                IdMovimiento: Imagenologia.idMovimiento,
                NumeroFeto: i,

                lcn: $('#txtLcnFeto' + i).val(),
                sacoG: $('#txtSacoGFeto' + i).val(),
                svitelino: $('#txtSvitelinoFeto' + i).val(),
                fcf: $('#txtFcfFeto' + i).val(),
                utero: $('#txtUteroFeto' + i).val(),
                cuerpoLuteo: $('#txtCuerpoLuteoFeto' + i).val(),
                hematomas: $('#cboHematomasFeto' + i).val(),
                fsd: $('#cboFsdFeto' + i).val(),

                Anatomia: $('#cboAnatomia').val(),
                AnatomiaTexto: $('#txtAnatomia').val(),

                Observaciones: $('#txtResObservacion').val(),
                Conclusion: $('#txtResConclusion').val(),
                Sugerencia: $('#txtResSugerencia').val(),

                //Fecha: null,                
                FUR: $('#txtFechaFUR').val(),
                FPP: $('#txtFechaFPP').val(),
                EdadGestacional: $('#txtEdadGestacional').val(),
                //Usuario: null,
                //UsuarioUpdate: null,
                //FechaUpdate: null,               
                IdMedico: $('#cboRealizaPrueba').val(),
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
                    url: "/ImagenologiaEcografias/GuardarEcoVaginalBasica?area=Imagenologia",
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