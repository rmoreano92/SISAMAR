var Odonto = {
    idAtencion: 0,
    disposicion: 0,             //1=Caries  2=Restauracion     3=Corona Temporal    4=Corona Definitiva
    hallazgos: [],
    valores: [],
    capture: '',
    //ActivoFondo: false,

    Iniciar() {
        Odonto.SeleccionarBtnDisposicion(1);
        Odonto.Eventos();
    },

    Eventos() {
        $("area").on("mouseover", function (e) {
            if (!isEmpty(e.target.parentElement.name)) {
                //console.log("HOVER SOBRE: " + e.target.parentElement.name);
                if (Odonto.disposicion == 1 || Odonto.disposicion == 2) {
                    Odonto.ActivarFondo();
                    $("#" + e.target.parentElement.name).addClass('diente-zoom');
                    $("#" + e.target.parentElement.name).parent().addClass('diente-zoom-box');
                }
            }
        });

        $("area").on("mouseleave", function (e) {
            if (!isEmpty(e.target.parentElement.name)) {
                //console.log("LEAVE SOBRE: " + e.target.parentElement.name) 
                if (Odonto.disposicion == 1 || Odonto.disposicion == 2) {
                    Odonto.DesactivarFondo();
                    $("#" + e.target.parentElement.name).removeClass('diente-zoom');
                    $("#" + e.target.parentElement.name).parent().removeClass('diente-zoom-box');
                }
            }
        });

        $("#btnAusencia").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(0);
        });


        $("#btnCaries").on('click', function () {
            $(".diente-area").attr("coords", "0,0,0,0");
            Odonto.SeleccionarBtnDisposicion(1);
        });

        $("#btnRestauracion").on('click', function () {
            $(".diente-area").attr("coords", "0,0,0,0");
            Odonto.SeleccionarBtnDisposicion(2);
        });


        $("#btnCoronaTemporal").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(10);
        });

        $("#btnCoronaDefinitiva").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(11);
        });

        $("#btnRemanenteRadicular").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(12);
        });


        $("#btnClavija").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(20);
        });

        $("#btnGeminacion").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(21);
        });


        $("#btnFusion").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(30);
        });


        $("#btnExtruido").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(40);
        });

        $("#btnIntruido").on('click', function () {
            $(".diente-area").attr("coords", "0,0,41,70");
            Odonto.SeleccionarBtnDisposicion(41);
        });

    },


    //async CargarDatosAlFormulario(idAtencion) {
    //    Odonto.idAtencion = idAtencion
    //    const eval = await Odonto.SeleccionarEvaluacion(Odonto.idAtencion);
    //    const halla = await Odonto.SeleccionarHallazgos(Odonto.idAtencion);
    //    const valores = await Odonto.SeleccionarHallazgosValores(Odonto.idAtencion);

    //    //console.log(eval);
    //    if (!isEmpty(eval)) {
    //        $('#chkDentalPreOcupacional').prop('checked', eval.optPreOcupacional);
    //        $('#chkDentalAnual').prop('checked', eval.optAnual);
    //        $('#chkDentalRetiro').prop('checked', eval.optRetiro);
    //        $('#chkCambioPuestolaboral').prop('checked', eval.optPuestoLaboral);

    //        $('input:radio[name=rdbDentalAlergia][value=' + eval.optAlergia + ']').attr('checked', true);
    //        $('#txtDentalAlergia').val(eval.dAlergia);

    //        $('input:radio[name=rdbDentalEnfermedad][value=' + eval.optEnfermedad + ']').attr('checked', true);
    //        $('#txtDentalEnfermedad').val(eval.dEnfermedad);

    //        $('input:radio[name=rdbDentalSarro][value=' + eval.optSarro + ']').attr('checked', true);
    //        $('input:radio[name=rdbDentalPlacaBacteriana][value=' + eval.optPlacaBacteriana + ']').attr('checked', true);

    //        $('#txtDentalOtrasObservaciones').val(eval.dObservaciones);

    //        $('#txtDentalCaries').val(eval.dCaries);
    //        $('#txtDentalPiezasAusentes').val(eval.dPiezasAusentes);
    //        $('#txtDentalRemanenteRadicular').val(eval.dRemanenteRadicular);
    //        $('#txtDentalNecrosisPulpar').val(eval.dNecrosisPulpar);
    //        $('#txtDentalAbcesos').val(eval.dAbcesos);

    //        $('#txtDentalRecomendaciones').val(eval.dRecomendaciones);

    //    }



    //},

    async CargarDatosAlFormulario(idAtencion) {
        Odonto.idAtencion = idAtencion
        Odonto.LimpiarModulo();

        const _eval = await Odonto.SeleccionarAtencion(Odonto.idAtencion);
        const halla = await Odonto.SeleccionarHallazgos(Odonto.idAtencion);
        const valores = await Odonto.SeleccionarHallazgosValores(Odonto.idAtencion);

        //console.log(_eval);
        if (!isEmpty(_eval)) {
            $('#chkDentalPreOcupacional').prop('checked', _eval.optPreOcupacional);
            $('#chkDentalAnual').prop('checked', _eval.optAnual);
            $('#chkDentalRetiro').prop('checked', _eval.optRetiro);
            $('#chkCambioPuestolaboral').prop('checked', _eval.optPuestoLaboral);

            $('input:radio[name=rdbDentalAlergia][value=' + _eval.optAlergia + ']').prop('checked', true);
            $('#txtDentalAlergia').val(_eval.dAlergia);

            $('input:radio[name=rdbDentalEnfermedad][value=' + _eval.optEnfermedad + ']').prop('checked', true);
            $('#txtDentalEnfermedad').val(_eval.dEnfermedad);

            $('input:radio[name=rdbDentalSarro][value=' + _eval.optSarro + ']').prop('checked', true);
            $('input:radio[name=rdbDentalPlacaBacteriana][value=' + _eval.optPlacaBacteriana + ']').prop('checked', true);

            $('#txtDentalOtrasObservaciones').val(_eval.dObservaciones);

            $('#txtDentalCaries').val(_eval.dCaries);
            $('#txtDentalPiezasAusentes').val(_eval.dPiezasAusentes);
            $('#txtDentalRemanenteRadicular').val(_eval.dRemanenteRadicular);
            $('#txtDentalNecrosisPulpar').val(_eval.dNecrosisPulpar);
            $('#txtDentalAbcesos').val(_eval.dAbcesos);

            $('#txtDentalRecomendaciones').val(_eval.dRecomendaciones);

        }



    },

    CargarDatosAlControlador() {
        var formData = new FormData()

        formData.append('idAtencion', Odonto.idAtencion);
        formData.append('optPreOcupacional', $('#chkDentalPreOcupacional').is(":checked") ? 1 : 0);
        formData.append('optAnual', $('#chkDentalAnual').is(":checked") ? 1 : 0);
        formData.append('optRetiro', $('#chkDentalRetiro').is(":checked") ? 1 : 0);
        formData.append('optPuestoLaboral', $('#chkCambioPuestolaboral').is(":checked") ? 1 : 0);

        formData.append('optAlergia', $('input[name="rdbDentalAlergia"]:checked').val());
        formData.append('dAlergia', $("#txtDentalAlergia").val());

        formData.append('optEnfermedad', $('input[name="rdbDentalEnfermedad"]:checked').val());
        formData.append('dEnfermedad', $("#txtDentalEnfermedad").val());

        formData.append('optSarro', $('input[name="rdbDentalSarro"]:checked').val());
        formData.append('optPlacaBacteriana', $('input[name="rdbDentalPlacaBacteriana"]:checked').val());

        formData.append('dObservaciones', $("#txtDentalOtrasObservaciones").val());

        formData.append('dCaries', $("#txtDentalCaries").val());
        formData.append('dPiezasAusentes', $("#txtDentalPiezasAusentes").val());
        formData.append('dRemanenteRadicular', $("#txtDentalRemanenteRadicular").val());
        formData.append('dNecrosisPulpar', $("#txtDentalNecrosisPulpar").val());
        formData.append('dAbcesos', $("#txtDentalAbcesos").val());

        formData.append('dRecomendaciones', $("#txtDentalRecomendaciones").val());

        formData.append('lstHallazgos', JSON.stringify(Odonto.hallazgos));

        var i = 0;
        var idValor = "";
        for (i = 1; i <= 56; i++) {
            idValor = "#txt_" + i + "_" + "1";
            if (!isEmpty($(idValor).val())) {
                var objRow = {
                    IdDiente: i,
                    Orden: 1,
                    Valor: $(idValor).val()
                }
                Odonto.valores.push(objRow);
            }

            idValor = "#txt_" + i + "_" + "2";
            if (!isEmpty($(idValor).val())) {
                var objRow = {
                    IdDiente: i,
                    Orden: 2,
                    Valor: $(idValor).val()
                }
                Odonto.valores.push(objRow);
            }
        }

        formData.append('lstHallazgosValores', JSON.stringify(Odonto.valores));

        formData.append('rutaImagen', Odonto.capture);

        return formData;
    },

    /// <summary>
    /// CARGA DATOS DESDE LA BD
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion desde la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async SeleccionarAtencion(idAtencion) {
        var data = new FormData();
        var respuesta = null;

        try {
            data.append('idAtencion', idAtencion);

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionOdontologica/SeleccionarAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table[0];
                    //console.log(respuesta);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async SeleccionarEvaluacion(idAtencion) {
        var data = new FormData();
        var respuesta = null;

        try {
            data.append('idAtencion', idAtencion);

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionOdontologica/SeleccionarEvaluacion?area=SaludOcupacional",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table[0];
                    //console.log(respuesta);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async SeleccionarHallazgos(idAtencion) {
        var data = new FormData();
        var respuesta = null;
        console.log("peticion hallazgos...");   

        try {
            Odonto.hallazgos = [];
            data.append('idAtencion', idAtencion);

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionOdontologica/SeleccionarHallazgos?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                console.log("respuesta hallazgos...");
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table;
                    //console.log(respuesta);
                    console.log("=========HALLAZGOS===========");
                    if (!isEmpty(respuesta)) {
                        respuesta.forEach(function (obj) {
                            console.log(obj);
                            Odonto.disposicion = obj.hallazgo;
                            Odonto.GenerarAccionDental(obj.dienteInicial, obj.zona);
                        });
                    }
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async SeleccionarHallazgosValores(idAtencion) {
        var data = new FormData();
        var respuesta = null;
        var idValor = "";

        try {
            Odonto.valores = [];
            data.append('idAtencion', idAtencion);

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionOdontologica/SeleccionarHallazgosValores?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table;
                    //console.log(respuesta);
                    console.log("=========VALORES===========");
                    if (!isEmpty(respuesta)) {
                        respuesta.forEach(function (obj) {
                            console.log(obj);
                            idValor = "#txt_" + obj.idDiente + "_" + obj.orden;
                            $(idValor).val(obj.valor);
                        });
                    }
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return respuesta;
    },

    async GuardarAtencion() {
        //$('#idtbAtencion a[href="#ExamenFisico"]').tab('show');

        if ($('#ExamenFisico').hasClass('active')) {
            //console.log('El tab "ExamenFisico" está visible.');
            let div = document.getElementById('odontograma');
            await html2canvas(div).then(async function (canvas) {
                Cargando(1);
                console.log("ENTROOOOOOOO!!!!");
                document.getElementById('output').appendChild(canvas);
                $('#output canvas').attr('id', 'screenshot');

                let canvasimg = document.getElementById('screenshot');
                let url = canvasimg.toDataURL('image/png');
                let b64 = url.slice(url.indexOf(',') + 1);
                Odonto.capture = b64;

                await Odonto.GuardarAtencionDetalle();
                Cargando(0);
            });
        } else {
            console.log('El tab "ExamenFisico" no está visible.');
            Cargando(1);
            await Odonto.GuardarAtencionDetalle();
            Cargando(0);
        }



        console.log("FINALIZOOOOO!!!!");
    },

    async GuardarAtencionDetalle() {
        var respuesta = false;
        let datos
        //await Odonto.TakeShotOdontograma();
        var data = Odonto.CargarDatosAlControlador();

        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionOdontologica/GuardarAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            //Cargando(0);
            if (datos.session) {
                if (datos.estado) {
                    Odonto.LimpiarModulo();
                    respuesta = true;
                    alerta2("success", "", "La evaluación se guardó correctamente.");
                } else {
                    alerta2("danger", "", datos.msj);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina");
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return respuesta;
    },

    async GuardarEvaluacion() {

        let div = document.getElementById('odontograma');
        await html2canvas(div).then(async function (canvas) {
            Cargando(1);
            console.log("ENTROOOOOOOO!!!!");
            document.getElementById('output').appendChild(canvas);
            $('#output canvas').attr('id', 'screenshot');

            let canvasimg = document.getElementById('screenshot');
            let url = canvasimg.toDataURL('image/png');
            let b64 = url.slice(url.indexOf(',') + 1);
            Odonto.capture = b64;

            await Odonto.GuardarEvaluacionDetalle();
            Cargando(0);
        });

        console.log("FINALIZOOOOO!!!!");
    },

    async GuardarEvaluacionDetalle() {
        var respuesta = false;
        let datos
        //await Odonto.TakeShotOdontograma();
        var data = Odonto.CargarDatosAlControlador();

        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionOdontologica/GuardarEvaluacion?area=SaludOcupacional",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            //Cargando(0);
            if (datos.session) {
                if (datos.estado) {
                    respuesta = true;
                    alerta2("success", "", "La evaluación se guardó correctamente.");
                } else {
                    alerta2("danger", "", datos.msj);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina");
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return respuesta;
    },


    LimpiarModulo() {
        Odonto.hallazgos = [];
        Odonto.valores = [];
        Odonto.disposicion = [];
        Odonto.capture = [];

        $('#chkDentalPreOcupacional').prop('checked', false);
        $('#chkDentalAnual').prop('checked', false);
        $('#chkDentalRetiro').prop('checked', false);
        $('#chkCambioPuestolaboral').prop('checked', false);

        $('input:radio[name=rdbDentalAlergia]').prop('checked', false);
        $('#txtDentalAlergia').val(eval.dAlergia);

        $('input:radio[name=rdbDentalEnfermedad]').prop('checked', false);
        $('#txtDentalEnfermedad').val("");

        $('input:radio[name=rdbDentalSarro]').prop('checked', false);
        $('input:radio[name=rdbDentalPlacaBacteriana]').prop('checked', false);

        $('#txtDentalOtrasObservaciones').val("");

        $('#txtDentalCaries').val("");
        $('#txtDentalPiezasAusentes').val("");
        $('#txtDentalRemanenteRadicular').val("");
        $('#txtDentalNecrosisPulpar').val("");
        $('#txtDentalAbcesos').val("");

        $('#txtDentalRecomendaciones').val("");

        $(".disposicion.hallazgo").remove();
        $(".hallazgo").remove();
        $(".FacetInput").val("");

        $('#output').empty();
    },



    SeleccionarBtnDisposicion(disp) {
        $(".btnDisposicion").removeClass("selectedDisposicion");
        $(".btnDisposicion").removeAttr("style");

        if (disp == 0) {    //DIENTE AUSENTE
            Odonto.disposicion = 0;
            $("#btnAusencia").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }


        if (disp == 1) {    //CARIES
            Odonto.disposicion = 1;
            $("#btnCaries").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }

        if (disp == 2) {    //RESTAURACIÓN
            Odonto.disposicion = 2;
            $("#btnRestauracion").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }



        if (disp == 10) {    //CORONA TEMPORAL
            Odonto.disposicion = 10;
            $("#btnCoronaTemporal").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }

        if (disp == 11) {    //CORONA DEFINITIVA
            Odonto.disposicion = 11;
            $("#btnCoronaDefinitiva").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }

        if (disp == 12) {    //REMANENTE RADICULAR
            Odonto.disposicion = 12;
            $("#btnRemanenteRadicular").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }


        if (disp == 20) {    //DIENTE CLAVIJA
            Odonto.disposicion = 20;
            $("#btnClavija").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }

        if (disp == 21) {    //GEMINACION
            Odonto.disposicion = 21;
            $("#btnGeminacion").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }


        if (disp == 30) {    //FUSION
            Odonto.disposicion = 30;
            $("#btnFusion").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }


        if (disp == 40) {    //DIENTE EXTRUIDO
            Odonto.disposicion = 40;
            $("#btnExtruido").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }

        if (disp == 41) {    //DIENTE INTRUIDO
            Odonto.disposicion = 41;
            $("#btnIntruido").addClass("selectedDisposicion");
            $(".selectedDisposicion").css({ 'background-color': '#00cc99' });
        }


        //$("#btnCaries").removeClass("btn-danger");
        //$("#btnRestauracion").removeClass("btn-info");
    },

    ActivarFondo() {
        $("#fondoDiente").show();
        $("#fondoDiente").css({ 'opacity': '1' });
    },

    DesactivarFondo() {
        $("#fondoDiente").css({ 'opacity': '0' });
        $("#fondoDiente").hide();
    },

    GenerarAccionDental(d, z) {                 //d = diente     z = zona
        console.log("Diente: " + d);
        console.log("Zona  : " + z);
        var idDiente = "#diente" + d;
        var idCapa = "";
        var imgCapa = "";
        var imgCapa2 = "";
        var ubi = "";
        //var tipoHallazgo = 0;
        di = parseInt(d);
        df = parseInt(d) + 1;
        h = parseInt(Odonto.disposicion);
        z = parseInt(z);

        if (d >= 1 && d <= 28) {
            u = "s";
        }

        if (d >= 29 && d <= 56) {
            u = "i";
        }


        if (Odonto.disposicion == 0) {
            var objHallazgo = Odonto.CrearHallazgo(h, di, 0, z, u);
            if (Odonto.hallazgos.filter(obj => obj.hallazgo == h && obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == 0).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                Odonto.AgregarHallazgo(objHallazgo);
            }
            return;
        }

        if (Odonto.disposicion == 1 || Odonto.disposicion == 2) {
            var objHallazgo = Odonto.CrearHallazgo(h, di, 0, z, u);
            if (Odonto.hallazgos.filter(obj => obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == 0).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                Odonto.AgregarHallazgo(objHallazgo);
            }
            return;
        }

        if (Odonto.disposicion == 10 || Odonto.disposicion == 11 || Odonto.disposicion == 12) {
            var objHallazgo = Odonto.CrearHallazgo(h, di, 0, z, u);
            if (Odonto.hallazgos.filter(obj => obj.hallazgo == h && obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == 0).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                Odonto.AgregarHallazgo(objHallazgo);
            }
            return;
        }

        if (Odonto.disposicion == 20 || Odonto.disposicion == 21) {
            var objHallazgo = Odonto.CrearHallazgo(h, di, 0, z, u);
            if (Odonto.hallazgos.filter(obj => obj.hallazgo == h && obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == 0).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                Odonto.AgregarHallazgo(objHallazgo);
            }
            return;
        }

        if (Odonto.disposicion == 40 || Odonto.disposicion == 41) {
            var objHallazgo = Odonto.CrearHallazgo(h, di, 0, z, u);
            if (Odonto.hallazgos.filter(obj => obj.hallazgo == h && obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == 0).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                Odonto.AgregarHallazgo(objHallazgo);
            }
            return;
        }


        if (Odonto.disposicion == 9) {

            Odonto.AgregarQuitar_Fusion(Odonto.disposicion, di, df, z, ubi);
            return;
        }



        if (d >= 1 && d <= 28) {
            if (Odonto.disposicion == 1) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    return;
                }
                idCapa = d + "_" + z;
                imgCapa = "szona_" + z + "r.gif";
            }

            if (Odonto.disposicion == 2) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    return;
                }
                idCapa = d + "_" + z;
                imgCapa = "szona_" + z + "a.gif";
            }

            if (Odonto.disposicion == 3) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CT";
                    imgCapa = "scoronar.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 4) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CD";
                    imgCapa = "scoronaa.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 5) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_X";
                    imgCapa = "sausentea.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 6) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_RR";
                    imgCapa = "remanente.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 7) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CV";
                    imgCapa = "sclavija.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 8) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_GM";
                    imgCapa = "sgeminacion.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 9) {
                di = parseInt(d);
                df = parseInt(d) + 1;
                Odonto.AgregarQuitar_Fusion(Odonto.disposicion, di, df, z, "s");
                return;
            }


            if (Odonto.disposicion == 21) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)   
                    idDiente = "#inferior" + d;
                    idCapa = d + "_EX";
                    imgCapa = "sextruido.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 22) {
                if (z == 30) {                  //si la zona es 30(zona de titulo) 
                    idDiente = "#inferior" + d;
                    idCapa = d + "_IN";
                    imgCapa = "sintruido.gif";
                } else {
                    return;
                }
            }

            if ($('#' + idCapa).length == 1) {
                $('#' + idCapa).remove();
                return;
            } else {
                if (Odonto.disposicion >= 3 && Odonto.disposicion <= 9) {
                    if ($(idDiente + ' .hallazgo').length >= 1) {
                        $(idDiente + ' .hallazgo').remove();
                    }
                } else {
                    $(idDiente + " .hallazgo[data-hallazgo='3']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='4']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='5']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='6']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='7']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='8']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='9']").remove();

                    $(idDiente + " .hallazgo[data-hallazgo='21']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='22']").remove();
                }
            }

            console.log('idDiente: ' + idDiente);
            if (Odonto.disposicion >= 1 && Odonto.disposicion <= 8) {
                $(idDiente).append("<div id='" + idCapa + "' class='disposicion hallazgo' data-hallazgo=" + Odonto.disposicion + "><img src='../../images/odonto/" + imgCapa + "' width='38' height='65' border='0'></div>");
            }

            if (Odonto.disposicion == 21 || Odonto.disposicion == 22) {
                $(idDiente).append("<div id='" + idCapa + "' class='hallazgo' data-hallazgo=" + Odonto.disposicion + " style='position:relative;'><img src='../../images/odonto/" + imgCapa + "' width='38' height='10' style='position:absolute;'></div>");
            }

        }

        if (d >= 29 && d <= 56) {
            if (Odonto.disposicion == 1) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    return;
                }
                idCapa = d + "_" + z;
                imgCapa = "izona_" + z + "r.gif";
            }

            if (Odonto.disposicion == 2) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    return;
                }
                idCapa = d + "_" + z;
                imgCapa = "izona_" + z + "a.gif";
            }

            if (Odonto.disposicion == 3) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CT";
                    imgCapa = "icoronar.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 4) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CD";
                    imgCapa = "icoronaa.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 5) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_X";
                    imgCapa = "iausentea.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 6) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_RR";
                    imgCapa = "remanente.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 7) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_CV";
                    imgCapa = "iclavija.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 8) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)
                    idCapa = d + "_GM";
                    imgCapa = "igeminacion.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 9) {
                di = parseInt(d);
                df = parseInt(d) + 1;
                Odonto.AgregarQuitar_Fusion(Odonto.disposicion, di, df, z, "i");
                return;
            }

            if (Odonto.disposicion == 21) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)   
                    idDiente = "#superior" + d;
                    idCapa = d + "_EX";
                    imgCapa = "iextruido.gif";
                } else {
                    return;
                }
            }

            if (Odonto.disposicion == 22) {
                if (z == 30) {                  //si la zona es 30(zona de titulo)    
                    idDiente = "#superior" + d;
                    idCapa = d + "_IN";
                    imgCapa = "iintruido.gif";
                } else {
                    return;
                }
            }

            console.log('idDiente: ' + idDiente);
            if ($('#' + idCapa).length == 1) {
                $('#' + idCapa).remove();
                return;
            } else {
                if (Odonto.disposicion >= 3 && Odonto.disposicion <= 9) {
                    if ($(idDiente + ' .hallazgo').length >= 1) {
                        $(idDiente + ' .hallazgo').remove();
                    }
                } else {
                    $(idDiente + " .hallazgo[data-hallazgo='3']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='4']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='5']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='6']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='7']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='8']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='9']").remove();

                    $(idDiente + " .hallazgo[data-hallazgo='21']").remove();
                    $(idDiente + " .hallazgo[data-hallazgo='22']").remove();
                }
            }

            if (Odonto.disposicion >= 1 && Odonto.disposicion <= 8) {
                $(idDiente).append("<div id='" + idCapa + "' class='disposicion hallazgo' data-hallazgo=" + Odonto.disposicion + "><img src='../../images/odonto/" + imgCapa + "' width='38' height='65' border='0'></div>");
            }

            if (Odonto.disposicion == 21 || Odonto.disposicion == 22) {
                $(idDiente).append("<div id='" + idCapa + "' class='hallazgo' data-hallazgo=" + Odonto.disposicion + " style='position:relative;'><img src='../../images/odonto/" + imgCapa + "' width='38' height='11' style='position:absolute;'></div>");
            }

        }
    },

    DeseleccionarAccionDental(idCapa) {
        if ($('#' + idCapa).length == 1) {
            $('#' + idCapa).remove();
            return true;
        }
    },

    CrearHallazgo(h, di, df, z, u) {
        var objRow = {
            //diente: d,
            hallazgo: parseInt(h),
            zona: parseInt(z),
            dienteInicial: parseInt(di),
            dienteFinal: parseInt(df),
            ubicacion: u
        }

        return objRow;
    },

    CrearImagenHallazgo(idDiente, idCapa, idHallazgo, imgCapa) {
        if (idHallazgo == 40 || idHallazgo == 41) {
            $(idDiente).append("<div id='" + idCapa + "' class='hallazgo' data-hallazgo=" + idHallazgo + " style='position:relative;'><img src='../../images/odonto/" + imgCapa + "' width='38' height='10' style='position:absolute;'></div>");
            return;
        }

        $(idDiente).append("<div id='" + idCapa + "' class='disposicion hallazgo' data-hallazgo=" + idHallazgo + "><img src='../../images/odonto/" + imgCapa + "' width='38' height='65' border='0'></div>");


    },

    AgregarQuitar_Fusion(h, di, df, z, u) {
        idDientei = "#diente" + di;
        idDientef = "#diente" + df;

        var objHallazgo = Odonto.CrearHallazgo(h, di, df, z, u);

        if (z == 30) {                  //si la zona es 30(zona de titulo)
            if (Odonto.hallazgos.filter(obj => obj.hallazgo == h && obj.zona == z && obj.dienteInicial == di && obj.dienteFinal == df).length > 0) {
                Odonto.EliminarHallazgo(objHallazgo);
            } else {
                idCapai = di + "_FS-i";
                idCapaf = df + "_FS-f";
                imgCapai = u + "fusioni.gif";
                imgCapaf = u + "fusionf.gif";

                Odonto.CrearImagenHallazgo(idDientei, idCapai, h, imgCapai);
                Odonto.CrearImagenHallazgo(idDientef, idCapaf, h, imgCapaf);

                Odonto.AgregarHallazgo(objHallazgo);


            }
        } else {
            return;
        }
    },


    AgregarHallazgo(data) {
        idDientei = "#diente" + data.dienteInicial;
        idDientef = "#diente" + data.dienteFinal;

        if (data.hallazgo == 0) {           //AUSENCIA            
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [1, 2, 10, 11, 12, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_X";
            imgCapai = data.ubicacion + "ausentea.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 1) {           //CARIES            
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 10, 11, 12, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_" + data.zona;
            imgCapai = data.ubicacion + "zona_" + data.zona + "r.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 2) {           //RESTAURACIÓN            
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 10, 11, 12, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_" + data.zona;
            imgCapai = data.ubicacion + "zona_" + data.zona + "a.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 10) {           //CORONA TEMPORAL
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 11, 12, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_CT";
            imgCapai = data.ubicacion + "coronar.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 11) {           //CORONA DEFINITIVA
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 12, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_CD";
            imgCapai = data.ubicacion + "coronaa.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 12) {           //CORONA DEFINITIVA
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 11, 20, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_RR";
            imgCapai = "remanente.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 20) {           //CLAVIJA
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 11, 12, 21, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_CV";
            imgCapai = data.ubicacion + "clavija.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 21) {           //GEMINACION
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 11, 12, 20, 30, 40, 41]);        //params: idDiente del div, array de idHallasgos
            idCapai = data.dienteInicial + "_GM";
            imgCapai = data.ubicacion + "geminacion.gif";
            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 40) {           //EXTRUIDO
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 11, 12, 20, 21, 30, 41]);        //params: idDiente del div, array de idHallasgos
            if (data.ubicacion == "s") {
                idDientei = "#inferior" + data.dienteInicial;
                idCapai = data.dienteInicial + "_EX";
                imgCapai = data.ubicacion + "extruido.gif";
            } else if (data.ubicacion == "i") {
                idDientei = "#superior" + data.dienteInicial;
                idCapai = data.dienteInicial + "_EX";
                imgCapai = data.ubicacion + "extruido.gif";
            }

            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        if (data.hallazgo == 41) {           //INTRUIDO
            Odonto.EliminarTiposHallazgos(data.dienteInicial, [0, 1, 2, 10, 11, 12, 20, 21, 30, 40]);        //params: idDiente del div, array de idHallasgos
            if (data.ubicacion == "s") {
                idDientei = "#inferior" + data.dienteInicial;
                idCapai = data.dienteInicial + "_IN";
                imgCapai = data.ubicacion + "intruido.gif";
            } else if (data.ubicacion == "i") {
                idDientei = "#superior" + data.dienteInicial;
                idCapai = data.dienteInicial + "_IN";
                imgCapai = data.ubicacion + "intruido.gif";
            }

            Odonto.CrearImagenHallazgo(idDientei, idCapai, data.hallazgo, imgCapai);
            Odonto.hallazgos.push(data);
        }

        console.log(Odonto.hallazgos);
    },

    EliminarHallazgo(data) {
        var tempHallazgos = Odonto.hallazgos;
        Odonto.hallazgos = [];
        tempHallazgos.forEach(function (obj) {

            if (data.hallazgo == 0) {
                if (obj.hallazgo == data.hallazgo && obj.zona == data.zona && obj.dienteInicial == data.dienteInicial && obj.dienteFinal == data.dienteFinal) {
                    $('#' + data.dienteInicial + "_X").remove();
                    console.log("Se eliminino");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            }

            if (data.hallazgo == 1 || data.hallazgo == 2) {
                if (obj.zona == data.zona && obj.dienteInicial == data.dienteInicial && obj.dienteFinal == data.dienteFinal) {
                    $('#' + data.dienteInicial + "_" + data.zona).remove();
                    console.log("Se eliminino");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            }

            if (data.hallazgo == 10 || data.hallazgo == 11 || data.hallazgo == 12) {
                if (obj.hallazgo == data.hallazgo && obj.zona == data.zona && obj.dienteInicial == data.dienteInicial && obj.dienteFinal == data.dienteFinal) {
                    if (data.hallazgo == 10) {
                        $('#' + data.dienteInicial + "_CT").remove();
                    }

                    if (data.hallazgo == 11) {
                        $('#' + data.dienteInicial + "_CD").remove();
                    }

                    if (data.hallazgo == 12) {
                        $('#' + data.dienteInicial + "_RR").remove();
                    }
                    console.log("Se eliminino");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            }

            if (data.hallazgo == 20 || data.hallazgo == 21) {
                if (obj.hallazgo == data.hallazgo && obj.zona == data.zona && obj.dienteInicial == data.dienteInicial && obj.dienteFinal == data.dienteFinal) {
                    if (data.hallazgo == 20) {
                        $('#' + data.dienteInicial + "_CV").remove();
                    }

                    if (data.hallazgo == 21) {
                        $('#' + data.dienteInicial + "_GM").remove();
                    }
                    console.log("Se eliminino");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            }

            if (data.hallazgo == 40 || data.hallazgo == 41) {
                if (obj.hallazgo == data.hallazgo && obj.zona == data.zona && obj.dienteInicial == data.dienteInicial && obj.dienteFinal == data.dienteFinal) {
                    if (data.hallazgo == 40) {
                        $('#' + data.dienteInicial + "_EX").remove();
                    }

                    if (data.hallazgo == 41) {
                        $('#' + data.dienteInicial + "_IN").remove();
                    }
                    console.log("Se eliminino");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            }

        });

        return;


        ///_-----------------------------
        //console.log(Odonto.hallazgos);
        if (data.hallazgo == 0) {           //AUSENCIA
            var tempHallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo == data.hallazgo);
            tempHallazgos = tempHallazgos.filter(obj => obj.dienteInicial != data.dienteInicial);

            Odonto.hallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo != data.hallazgo);
            $('#' + data.dienteInicial + "_X").remove();
        }

        if (data.hallazgo == 1) {           //CARIES  
            var tempHallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo == data.hallazgo && obj.dienteInicial == data.dienteInicial);
            tempHallazgos = tempHallazgos.filter(obj => obj.zona != data.zona);

            Odonto.hallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo != data.hallazgo && obj.dienteInicial != data.dienteInicial);
            $('#' + data.dienteInicial + "_" + data.zona).remove();
        }

        if (data.hallazgo == 2) {           //RESTAURACION     
            var tempHallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo == data.hallazgo && obj.dienteInicial == data.dienteInicial);
            tempHallazgos = tempHallazgos.filter(obj => obj.zona != data.zona);

            Odonto.hallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo != data.hallazgo && obj.dienteInicial != data.dienteInicial);
            $('#' + data.dienteInicial + "_" + data.zona).remove();
        }


        tempHallazgos.forEach(function (obj) {
            objRow = {
                //diente: d,
                hallazgo: obj.hallazgo,
                zona: obj.zona,
                dienteInicial: obj.dienteInicial,
                dienteFinal: obj.dienteFinal,
                ubicacion: obj.ubicacion
            }
            //console.log(objRow);
            Odonto.hallazgos.push(objRow);
        });

        return;

        if (data.hallazgo == 8 || data.hallazgo == 9) {
            $(idDiente + " .hallazgo[data-hallazgo='5']").remove();
            //$(idDiente + " .hallazgo[data-hallazgo='6']").remove();
            $(idDiente + " .hallazgo[data-hallazgo='7']").remove();
            $(idDiente + " .hallazgo[data-hallazgo='8']").remove();
            $(idDiente + " .hallazgo[data-hallazgo='9']").remove();

            if (data.hallazgo == 8) {
                tempHallazgos = tempHallazgos.filter(obj => obj.dienteInicial != data.dienteInicial);
                $("#" + parseInt(data.dienteInicial - 1) + "_FS-i").remove();
                $("#" + data.dienteInicial + "_FS-f").remove();

                $("#" + data.dienteInicial + "_FS-i").remove();
                $("#" + parseInt(data.dienteInicial + 1) + "_FS-f").remove();
            }

            if (data.hallazgo == 9) {
                tempHallazgos = tempHallazgos.filter(obj => obj.dienteInicial != data.dienteInicial && obj.dienteFinal != data.dienteFinal);
                $("#" + data.dienteInicial + "_FS-i").remove();
                $("#" + data.dienteFinal + "_FS-f").remove();
                //$("#diente" + data.dienteInicial + " .hallazgo[data-hallazgo='9']").remove();
                //$("#diente" + data.dienteFinal + " .hallazgo[data-hallazgo='9']").remove();
                //console.log(tempHallazgos);
            }


        }
    },

    EliminarTiposHallazgos(idDiente, hs) {

        hs.forEach(function (h) {
            var tempHallazgos = Odonto.hallazgos;
            Odonto.hallazgos = [];

            $("#diente" + idDiente + " .hallazgo[data-hallazgo='" + h + "']").remove();
            $("#superior" + idDiente + " .hallazgo[data-hallazgo='" + h + "']").remove();
            $("#inferior" + idDiente + " .hallazgo[data-hallazgo='" + h + "']").remove();
            //Odonto.hallazgos = Odonto.hallazgos.filter(obj => obj.hallazgo != h && obj.dienteInicial != idDiente);
            tempHallazgos.forEach(function (obj) {
                if (obj.hallazgo == h && obj.dienteInicial == idDiente) {
                    console.log("eliminacion");
                } else {
                    Odonto.hallazgos.push(obj);
                }
            });
        });
        //$(idDientei + ' .hallazgo').remove();
    },

    async TakeShotOdontograma() {
        let div = document.getElementById('odontograma');
        html2canvas(div).then(function (canvas) {
            document.getElementById('output').appendChild(canvas);
            $('#output canvas').attr('id', 'screenshot');

            let canvasimg = document.getElementById('screenshot');
            let url = canvasimg.toDataURL('image/png');
            let b64 = url.slice(url.indexOf(',') + 1);
            Odonto.capture = '{"data":"' + b64 + '"}';


        });
    }
}

