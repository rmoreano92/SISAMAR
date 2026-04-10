let NotaObstetricia = {

    IdNotaObstetricia: 0,
    IdAtencion: 0,
    NroNotaObstetricia: 0,
    IdServicio: 0,

    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: false })
        $(".chzn-select-deselect,#select2_sample").chosen()
        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaAtencion, #txtFechaReg, #txtFechaIng').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

    },

    FechaActual() {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        return fechaP
    },

    Events: async () => {
        $('#btnBuscarAtenciones').on('click', async function () {
            if ($('#txtNroCuentaBusqueda').val() == '' && $('#txtNroHistoriaBusqueda').val() == '' && $('#txtAPaternoBusqueda').val() == '' && $('#txtAMaternoBusqueda').val() == '' && $('#txtNombresBusqueda').val() == '' && $('#txtFechaAtencion').val() == '' && $('#cboConsultorio').val() == 0) {
                alerta(2, 'Ingresa al menos un dato para la busqueda')
                return false
            }

            Cargando(1)
            let atenciones = await NotaObstetricia.ListaAtencionesNotaObstetricia(
                IdCuentaAtencion = $('#txtNroCuentaBusqueda').val(), NroHistoria = $('#txtNroHistoriaBusqueda').val(), ApellidoPaterno = $('#txtAPaternoBusqueda').val(),
                ApellidoMaterno = $('#txtAMaternoBusqueda').val(), Nombres = $('#txtNombresBusqueda').val(), FechaIngreso = $('#txtFechaAtencion').val(), IdServicio = $('#cboConsultorio').val())

            oTable_Atenciones.fnClearTable()

            if (!isEmpty(atenciones.table)) {
                if (atenciones.table.length > 0) {
                    oTable_Atenciones.fnAddData(atenciones.table)
                } else {
                    alerta(2, 'No hay atenciones para los datos ingresados')
                }
            }
            Cargando(0)
        })

        $("#btnModificarAtencion").on("click", async function () {

            let objRowAtencion = oTable_Atenciones.api(true).row('.selected').data()

            if (isEmpty(objRowAtencion)) {
                alerta(2, 'Selecciona un registro de la tabla')
            }

            NotaObstetricia.LimpiarCampos()

            Cargando(1)

            await NotaObstetricia.BuscaAtencionesCptCEparaFormatoHIS(objRowAtencion.idCuentaAtencion);


            $("#txtNroCuentaLista").val(objRowAtencion.idCuentaAtencion)
            $("#cboPuntoCarga").val(objRowAtencion.idCuentaAtencion)


            $("#txtHc").val(objRowAtencion.nroHistoriaClinica)
            $("#txtNroCuenta").val(objRowAtencion.idCuentaAtencion)
            $("#txtDatosPaciente").val(objRowAtencion.paciente)
            $("#txtFechaIng").datepicker("setDate", objRowAtencion.fechaIngreso2);
            //$("#txtFechaIng").val(objRowAtencion.fechaIngreso2)
            $("#txtServicioActual").val(objRowAtencion.servicio)
            $("#txtNroCama").val(objRowAtencion.cama)
            $("#txtCantidadN").val(objRowAtencion.cantidadNotas)
            //$("#modalNotaIngreso").val(objRowAtencion.)

            $("#txtFechaReg").datepicker("setDate", NotaObstetricia.FechaActual());

            NotaObstetricia.IdAtencion = objRowAtencion.idAtencion
            NotaObstetricia.IdServicio = objRowAtencion.idServicio
            /*NotaObstetricia.NroNotaObstetricia = objRowAtencion.cantidadNotas + 1*/

            let notasObstetricia = await NotaObstetricia.ListarNotasObstetricia(objRowAtencion.idAtencion)

            oTable_HistorialNotasObsetricia.fnClearTable()

            if (!isEmpty(notasObstetricia.table)) {
                if (notasObstetricia.table.length > 0) {
                    oTable_HistorialNotasObsetricia.fnAddData(notasObstetricia.table)
                } else {
                    alerta(4, 'Aun no tiene Notas de Obstetricia registradas.')
                }
            }


            $('.chzn-select').chosen().trigger("chosen:updated")

            $("#modalNotaIngreso").modal("show");

            Cargando(0)

        });

        $("#btnNuevoRegistro").on("click", function () {

            let notasIngreso = oTable_HistorialNotasObsetricia.api(true).data()

            NotaObstetricia.NroNotaObstetricia = notasIngreso.length + 1
            NotaObstetricia.IdNotaObstetricia = 0

            swal({
                title: 'Correcto',
                text: "Se iniciara con la Nota de Obstetricia N° " + NotaObstetricia.NroNotaObstetricia,
                type: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Ok',
                //cancelButtonText: 'No',
            }).done()

            NotaObstetricia.LimpiarCampos()

            $("#txtFechaReg").datepicker("setDate", NotaObstetricia.FechaActual());

            oTable_HistorialNotasObsetricia.$('tr.selected').removeClass('selected');
        });

        $("#btnguardar").on("click", async function () {

            if (NotaObstetricia.NroNotaObstetricia == 0) {
                alerta(2, 'Selecciona o crea una nueva Nota de Obstetricia')
                return false;
            }

            Cargando(1)
            let notaObstetricua = await NotaObstetricia.CrearModificarNotaObstetricia(NotaObstetricia.IdNotaObstetricia, NotaObstetricia.IdAtencion, NotaObstetricia.NroNotaObstetricia, NotaObstetricia.IdServicio)

            console.log('notaObstetricua', notaObstetricua)

            if (notaObstetricua == 1) {
                swal({
                    title: 'Correcto',
                    text: "El registro se creó con exito",
                    type: 'success',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#ea423e',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Ok',
                    //cancelButtonText: 'No',
                }).done()

                $('#btnBuscarAtenciones').click()

                $("#modalNotaIngreso").modal("hide");
            } else {
                alerta(2, 'Error al crear registro')
            }
            Cargando(0)
        });



        $('#tblAtenciones tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_Atenciones.api(true).row($(this)).index();
            var row = oTable_Atenciones.fnGetData(pos);

            console.log('row', row)

        })
        $('#tblHistorialNotasObsetricia tbody').on('click', 'tr', async function () {
            //EvaluacionEmergencia.LimpiarVistaModuloEvaluacionDetalle();
            //EvaluacionEmergencia.BloquearOpcionesModificacion();

            oTable_HistorialNotasObsetricia.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_HistorialNotasObsetricia.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {
                Cargando(1)
                console.log('objrowTb', objrowTb)

                NotaObstetricia.IdAtencion = objrowTb.idAtencion
                NotaObstetricia.NroNotaObstetricia = objrowTb.nroNotaObstetricia
                NotaObstetricia.IdNotaObstetricia = objrowTb.idNotaObstetricia

                NotaObstetricia.SeleccionarNotaObstetricia(objrowTb)
                Cargando(0)
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No se ha seleccionado ninguna evaluación.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });
    },

    ListaAtencionesNotaObstetricia: async (IdCuentaAtencion, NroHistoria, ApellidoPaterno, ApellidoMaterno, Nombres, FechaIngreso, IdServicio) => {
        let formData = new FormData()

        formData.append('IdCuentaAtencion', IdCuentaAtencion)
        formData.append('NroHistoria', NroHistoria)
        formData.append('ApellidoPaterno', ApellidoPaterno)
        formData.append('ApellidoMaterno', ApellidoMaterno)
        formData.append('Nombres', Nombres)
        formData.append('FechaIngreso', FechaIngreso)
        formData.append('IdServicio', IdServicio)
        return HttpClient.Post('/NotaObstetricia/ListaAtencionesNotaObstetricia?area=Hospitalizacion', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },
    ListarNotasObstetricia: async (IdAtencion) => {
        let formData = new FormData()

        formData.append('IdAtencion', IdAtencion)
        return HttpClient.Post('/NotaObstetricia/ListarNotasObstetricia?area=Hospitalizacion', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },


    BuscaAtencionesCptCEparaFormatoHIS: (idCuentaAtencion) => {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.listaCpt.table.length !== 0) {
                        oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
                    }
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                alerta(3, "Error al listar Cpt");
                Cargando(0)
            }
        });

        oTable_consumoServAtencion.resize();
    },

    ServicioSeleccionarPorTipoServicioYEspecialidad: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboConsultorio').empty()
                $('#cboConsultorio').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    $('#cboConsultorio').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    ListarMedicos: async () => { // JDELGADO010
        //console.log("ENTRANDO A LISTAR MEDICOS")
        $.ajax({
            method: "POST",
            url: "/Utilitario/ListarMedicos?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboProfesionalSalud').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboProfesionalSalud').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                });
                $('#cboProfesionalSalud').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar medicos!", "2");
                }, 900)
            }
        });
    },
    ListaTriaje: async (idAtencion, idServicio, idNumero) => {

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        midata.append('idNumero', idNumero);
        await $.ajax({
            url: "/Atencion/ListaTriajeNotaObstetricia?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtPAD").val("");
                $("#txtSO").val("");
                $('#txtTriajeIMC').val("")
                if (datos.table.length > 0) {
                    presionAr = datos.table[0].triajePresion

                    if (!(presionAr == null)) {
                        presionSep = presionAr.split("/");

                        $("#txtPA").val(presionSep[0]);
                        $("#txtPAD").val(presionSep[1]);

                        //$('#txtEFisicoPAM').val((((2 * parseFloat($('#txtEFisicoPAD').val())) + parseInt($('#txtEFisicoPA').val())) / 3).toFixed(2))
                    }
                    if (datos.table[0].triajeFrecuenciaCardiaca != 0) {
                        $("#txtFc").val(datos.table[0].triajeFrecuenciaCardiaca);
                    }
                    if (datos.table[0].triajeFrecuenciaRespiratoria != 0) {
                        $("#txtFr").val(datos.table[0].triajeFrecuenciaRespiratoria);
                    }
                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);
                    $("#txtT").val(datos.table[0].triajeTemperatura);
                    $("#txtPeso").val(datos.table[0].triajePeso);
                    $("#txtTalla").val(datos.table[0].triajeTalla);

                    if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
                        $('#txtTriajeIMC').val((parseFloat($('#txtPeso').val()) / ((parseFloat($('#txtTalla').val()) / 100) * (parseFloat($('#txtTalla').val()) / 100))).toFixed(2))
                    }



                    //$("#txtImcDes").val(Triaje.imc($("#txtImc").val()))

                    //Triaje.validarRango();
                }

            },
            error: function (msg) {
                alerta("ERROR", "Error listar triaje!", "2");
            }
        });
    },

    CrearModificarNotaObstetricia: (IdNotaObstetricia, IdAtencion, NroNotaObstetricia, IdServicio) => {
        var formData = new FormData();

        formData.append('IdNotaObstetricia', IdNotaObstetricia)
        formData.append('IdAtencion', IdAtencion)
        formData.append('NroNotaObstetricia', NroNotaObstetricia)
        formData.append('IdMedico', $('#cboProfesionalSalud').val())
        formData.append('CondicionIngreso', $('#txtCondicionIngreso').val())
        formData.append('EdadGestacionalSemanas', $('#txtEdadGestacionalSemanas').val())
        formData.append('EdadGestacionalDias', $('#txtEdadGestacionalDias').val())
        formData.append('AU', $('#chkAU').is(':checked') ? 1 : 0)
        formData.append('FUR', $('#chkFUR').is(':checked') ? 1 : 0)
        formData.append('ECO', $('#chkECO').is(':checked') ? 1 : 0)
        formData.append('CausasHemorragia', $('#cboHemorragiaIP').val())
        formData.append('TipoPreEclampsia', $('#cboTipoPreEclampsia').val())
        formData.append('InfeccionesPresentadas', $('#cboInfeccionPresentada').val())
        formData.append('EvaluacionDiagnostica', $('#txtImpresionDiagnostica').val())
        formData.append('Apetito', $('#txtApetito').val())
        formData.append('Orina', $('#txtOrina').val())
        formData.append('Suenio', $('#txtSuenio').val())
        formData.append('Sed', $('#txtSed').val())
        formData.append('Deposiciones', $('#txtDiposiciones').val())
        formData.append('TactoVaginal', $('#rdbTactovaginalSi').is(':checked') ? 1 : $('#rdbTactovaginalNO').is(':checked') ? 2 : 0)
        formData.append('Dilatacion', $('#txtDilatacion').val())
        formData.append('Incorporacion', $('#txtIncorporacion').val())
        formData.append('AltPresent', $('#txtAltPresen').val())
        formData.append('VariedPresent', $('#txtVarPresen').val())
        formData.append('MembRotas', $('#rdbMembranaRotaSi').is(':checked') ? 1 : 0)
        formData.append('Procubito', $('#rdbProcubitoSi').is(':checked') ? 1 : 0)
        formData.append('Prolapso', $('#rdbProlapsoSi').is(':checked') ? 1 : 0)
        formData.append('SangradoV', $('#rdbSangradoVaginalSi').is(':checked') ? 1 : 0)
        formData.append('LiqAClaro', $('#rdbLiqAmnClaro').is(':checked') ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        formData.append('LiqAMeconial', $('#rdbLiqAmnClaro').is(':checked') ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        formData.append('LiqALSanguinolento', $('#rdbLiqAmnClaro').is(':checked') ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        formData.append('LiqAMalOlor', $('#rdbMalOlorSI').is(':checked') ? 1 : 0)
        formData.append('Partograma', $('#rdbPatoGramaSI').is(':checked') ? 1 : 0)
        formData.append('PartogramaDescripcion', $('#txtPartograma').val())
        formData.append('SemanaInicioSem', $('#txtTrabajoPartoSemanas').val())
        formData.append('SemanaInicioDia', $('#txtTrabajoPartoDias').val())
        formData.append('Corticoides', $('#cboCorticoidesAntenales').val())
        formData.append('FaseTrabajoParto', $('#cboFaseTrabajoParto').val())
        formData.append('PosicionParto', $('#cboPosicionParto').val())
        formData.append('TipoParto', $('#cboTipoParto').val())
        formData.append('HorasMinutos', $('#txtHoraMinuto').val())
        formData.append('PerdidaLiquido', $('#rdbPerdidaLiquidoSI').is(':checked') ? 1 : 0)
        formData.append('SangradoVaginalActivo', $('#rdbSangradoVagActivoSI').is(':checked') ? 1 : 0)
        formData.append('Tratamiento', $('#txtTratamiento').val())
        formData.append('PlanTrabajo', $('#txtPlanTrabajo').val())

        /* Triaje */
        presion = $("#txtPA").val() + "/" + $("#txtPAD").val()
        formData.append("TriajePresion", presion);
        formData.append("TriajeTemperatura", $("#txtT").val());
        formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
        formData.append("TriajeFrecCardiaca", $("#txtFc").val());
        formData.append("TriajePeso", $("#txtPeso").val());
        formData.append("TriajeTalla", $("#txtTalla").val());
        formData.append("TriajeSaturacionOxigeno", $("#txtSO").val());

        formData.append("idServicio", IdServicio);
        formData.append("idNumero", NroNotaObstetricia);
        /* Triaje */


        return HttpClient.Post('/NotaObstetricia/CrearModificarNotaObstetricia?area=Hospitalizacion', formData).then(res => {
            if (res.session) {
                console.log('no es posible registrar datos', res)
                if (res.data > 0) {
                    return res.data
                } else {
                    console.log("Error al crear registro.");
                    return false
                }
            } else {
                alerta(2, "La sesión ha expirado.");
                return false
            }
        })
    },

    SeleccionarNotaObstetricia: async function (objRow) {

        if (objRow.fechaRegistro == '') {
            $("#txtFechaReg").datepicker("setDate", NotaObstetricia.FechaActual());
        } else {
            $("#txtFechaReg").datepicker("setDate", objRow.fechaRegistro);
        }

        let triaje = await NotaObstetricia.ListaTriaje(NotaObstetricia.IdAtencion, NotaObstetricia.IdServicio, NotaObstetricia.NroNotaObstetricia)

        Variables.Cargar(objRow)

        $('#cboProfesionalSalud').val(objRow.idMedico)
        $('#txtCondicionIngreso').val(objRow.condicionIngreso)
        $('#txtEdadGestacionalSemanas').val(objRow.edadGestacionalSemanas)
        $('#txtEdadGestacionalDias').val(objRow.edadGestacionalDias)
        objRow.au == 1 ? $('#chkAU').prop("checked", true) : $('#chkAU').prop("checked", false)
        objRow.fur == 1 ? $('#chkFUR').prop("checked", true) : $('#chkFUR').prop("checked", false)
        objRow.eco == 1 ? $('#chkECO').prop("checked", true) : $('#chkECO').prop("checked", false)
        $('#cboHemorragiaIP').val(objRow.causasHemorragia)
        $('#cboTipoPreEclampsia').val(objRow.tipoPreEclampsia)
        $('#cboInfeccionPresentada').val(objRow.infeccionesPresentadas)
        $('#txtImpresionDiagnostica').val(objRow.evaluacionDiagnostica)
        $('#txtApetito').val(objRow.apetito)
        $('#txtOrina').val(objRow.orina)
        $('#txtSuenio').val(objRow.suenio)
        $('#txtSed').val(objRow.sed)
        $('#txtDiposiciones').val(objRow.deposiciones)
        objRow.tactoVaginal == 1 ? $('#rdbTactovaginalSi').prop("checked", true) : objRow.tactoVaginal == 1 ? $('#rdbTactovaginalNO').prop("checked", true) : ''
        $('#txtDilatacion').val(objRow.dilatacion)
        $('#txtIncorporacion').val(objRow.incorporacion)
        $('#txtAltPresen').val(objRow.altPresent)
        $('#txtVarPresen').val(objRow.variedPresent)
        objRow.membRotas == 1 ? $('#rdbMembranaRotaSi').prop("checked", true) : $('#rdbMembranaRotaNO').prop("checked", true)
        objRow.procubito == 1 ? $('#rdbProcubitoSi').prop("checked", true) : $('#rdbProcubitoNO').prop("checked", true)
        objRow.prolapso == 1 ? $('#rdbProlapsoSi').prop("checked", true) : $('#rdbProlapsoNO').prop("checked", true)
        objRow.sangradoV == 1 ? $('#rdbSangradoVaginalSi').prop("checked", true) : $('#rdbSangradoVaginalNO').prop("checked", true)
        objRow.liqAClaro == 1 ? $('#rdbLiqAmnClaro').prop("checked", true) : objRow.liqAClaro == 2 ? $('#rdbLiqAmnMeconial').prop("checked", true) : objRow.liqAClaro == 3 ? $('#rdbLiqAmnSangui').prop("checked", true) : ''
        // objRow.LiqAMeconial == 1 ? $('#rdbLiqAmnClaro').attr("checked", true) ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        // objRow.LiqALSanguinolento == 1 ? $('#rdbLiqAmnClaro').attr("checked", true) ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        objRow.liqAMalOlor == 1 ? $('#rdbMalOlorSI').prop("checked", true) : objRow.liqAMalOlor == 0 ? $('#rdbMalOlorNO').prop("checked", true) : ''
        objRow.partograma == 1 ? $('#rdbPatoGramaSI').prop("checked", true) : objRow.partograma == 0 ? $('#rdbPatoGramaNo').prop("checked", true) : ''
        $('#txtPartograma').val(objRow.partogramaDescripcion)
        $('#txtTrabajoPartoSemanas').val(objRow.semanaInicioSem)
        $('#txtTrabajoPartoDias').val(objRow.semanaInicioDia)
        $('#cboCorticoidesAntenales').val(objRow.corticoides)
        $('#cboFaseTrabajoParto').val(objRow.faseTrabajoParto)
        $('#cboPosicionParto').val(objRow.posicionParto)
        $('#cboTipoParto').val(objRow.tipoParto)
        $('#txtHoraMinuto').val(objRow.horasMinutos)
        objRow.perdidaLiquido == 1 ? $('#rdbPerdidaLiquidoSI').prop("checked", true) : $('#rdbPerdidaLiquidoNo').prop("checked", true)
        objRow.sangradoVaginalActivo == 1 ? $('#rdbSangradoVagActivoSI').prop("checked", true) : $('#rdbSangradoVagActivoNo').prop("checked", true)
        $('#txtTratamiento').val(objRow.tratamiento)
        $('#txtPlanTrabajo').val(objRow.planTrabajo)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    InitDatablesAtenciones() {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '60vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '6%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 1,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 3,
                    data: "fechaIngreso2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaEgresoAdministrativo + ' ' + rowData.horaEgresoAdministrativo);

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 7,
                    data: "cantidadNotas",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        $(td).html(estado.descripcionEstado);

                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        if (rowData.cantidadEvaluaciones > 0) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (estado.estado != 1) {
                            $(td).parent().css('color', '#c76d14');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (!isEmpty(rowData.fechaEgresoAdministrativo)) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

                        if (rowData.cantidadEvaluaciones > 0) {
                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }


                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html("");
                        }

                    }
                }
            ]
        }

        var tableWrapper = $('#tblAtenciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Atenciones = $("#tblAtenciones").dataTable(parms);
    },
    InitDatablesHistorialNotasObsetricia() {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '60vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '30%',
                    targets: 0,
                    data: "nroNotaObstetricia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "fechaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblHistorialNotasObsetricia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_HistorialNotasObsetricia = $("#tblHistorialNotasObsetricia").dataTable(parms);
    },

    LimpiarCampos: function () {
        //NotaObstetricia.IdNotaObstetricia = 0
        //NotaObstetricia.IdAtencion = 0
        //NotaObstetricia.NroNotaObstetricia = 0


        $("#txtPA").val("");
        $("#txtT").val("");
        $("#txtFr").val("");
        $("#txtFc").val("");
        $("#txtPeso").val("");
        $("#txtTalla").val("");
        $("#txtImc").val("");
        $("#txtPAD").val("");
        $("#txtSO").val("");
        $('#txtTriajeIMC').val("")

        $('#cboProfesionalSalud').val('')
        $('#txtCondicionIngreso').val('')
        $('#txtEdadGestacionalSemanas').val('')
        $('#txtEdadGestacionalDias').val('')
        $('#chkAU').prop("checked", false)
        $('#chkFUR').prop("checked", false)
        $('#chkECO').prop("checked", false)
        $('#cboHemorragiaIP').val('')
        $('#cboTipoPreEclampsia').val('')
        $('#cboInfeccionPresentada').val('')
        $('#txtImpresionDiagnostica').val('')
        $('#txtApetito').val('')
        $('#txtOrina').val('')
        $('#txtSuenio').val('')
        $('#txtSed').val('')
        $('#txtDiposiciones').val('')
        $('#rdbTactovaginalSi').prop("checked", false)
        $('#rdbTactovaginalNO').prop("checked", false)
        $('#txtDilatacion').val('')
        $('#txtIncorporacion').val('')
        $('#txtAltPresen').val('')
        $('#txtVarPresen').val('')
        $('#rdbMembranaRotaNO').prop("checked", true)
        $('#rdbProcubitoNO').prop("checked", true)
        $('#rdbProlapsoNO').prop("checked", true)
        $('#rdbSangradoVaginalNO').prop("checked", true)
        $('#rdbLiqAmnClaro').prop("checked", false)
        $('#rdbLiqAmnMeconial').prop("checked", false)
        $('#rdbLiqAmnSangui').prop("checked", false)
        // objRow.LiqAMeconial == 1 ? $('#rdbLiqAmnClaro').attr("checked", true) ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        // objRow.LiqALSanguinolento == 1 ? $('#rdbLiqAmnClaro').attr("checked", true) ? 1 : $('#rdbLiqAmnMeconial').is(':checked') ? 2 : $('#rdbLiqAmnSangui').is(':checked') ? 3 : 0)
        $('#rdbMalOlorNO').prop("checked", true)
        $('#rdbPatoGramaNo').prop("checked", true)
        $('#txtPartograma').val('')
        $('#txtTrabajoPartoSemanas').val('')
        $('#txtTrabajoPartoDias').val('')
        $('#cboCorticoidesAntenales').val('')
        $('#cboFaseTrabajoParto').val('')
        $('#cboPosicionParto').val('')
        $('#cboTipoParto').val('')
        $('#txtHoraMinuto').val('')
        $('#rdbPerdidaLiquidoNo').prop("checked", true)
        $('#rdbSangradoVagActivoNo').prop("checked", true)
        $('#txtTratamiento').val('')
        $('#txtPlanTrabajo').val('')

        $('.chzn-select').chosen().trigger("chosen:updated")
    }
}

$(document).ready(function () {
    NotaObstetricia.Events();

    ConsumoServicio.IniciarScript()
    ConsumoServicio.IniciarData()

    NotaObstetricia.InitDatablesAtenciones();
    NotaObstetricia.InitDatablesHistorialNotasObsetricia();

    NotaObstetricia.ServicioSeleccionarPorTipoServicioYEspecialidad(3)
    NotaObstetricia.ListarMedicos()

});

var NOTAOBSTETRICA = function () {

    var plugins = function () {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaIngreso,#txtFUR,#txtFUE,#txtFPP').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'

        });


    }

    var CargaInicial = function () {


    }
    var eventos = function () {


    }
    var initDatablesConsumoAtencion = function () {


        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoFacturacion == 9) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstadoFacturacion == 4) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {

                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblCSAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_consumoServAtencion = $("#tblCSAtencion").dataTable(parms);


    }
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
                    data: 'usuario',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }


            ]

        }

        var tableWrapper = $('#tblEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Evaluaciones = $("#tblEvaluaciones").dataTable(parms);


    }
    return {
        init: function () {
            CargaInicial();
            plugins();
            eventos();
            initDatablesConsumoAtencion();
            initDatablesEvaluaciones();
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