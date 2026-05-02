let RegistroEvaluacionesUCI = {

    idCuentaAtencion: 0,
    idAtencion: 0,
    idAtencionUCI: 0,
    IdAtencionDetalleUCI: 0,
    IdServicio: 0,
    IdCama: 0,

    nroEvaluacion: 0,

    EstablecimientoProcedenciaReferido: 0,
    EstablecimientoProcedenciaInstitucional: 0,
    IdComentarioApreciacion: 0,

    ////////KHOYOSI//////////////
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    ////////////////////////////

    IniciarScripts() {
        RegistroEvaluacionesUCI.Plugins()

        RegistroEvaluacionesUCI.Iniciar()

        RegistroEvaluacionesUCI.InitDatablesEvaluaciones()
        RegistroEvaluacionesUCI.InitDatablesOtrasPatologias()

        RegistroEvaluacionesUCI.InitDatablesSoporteVentilatorio()
        RegistroEvaluacionesUCI.InitDatablesParametrosSoporteVentilatorio()

        RegistroEvaluacionesUCI.InitDatablesMonitoreoHemodinamico()
        RegistroEvaluacionesUCI.InitDatablesParametrosMonitoreoHemodinamico()
        RegistroEvaluacionesUCI.InitDatablesNeurologico()
        RegistroEvaluacionesUCI.InitDatablesParametrosNeurologico()
        RegistroEvaluacionesUCI.InitDatablesUltrasonografia()
        RegistroEvaluacionesUCI.InitDatablesParametrosUltrasonografia()

        RegistroEvaluacionesUCI.InitDatablesBusquedaOtrasPat()

        RegistroEvaluacionesUCI.InitDatablesComentarioApreciacion()
        //RegistroEvaluacionesUCI.InitDatablesEstablecimientos()

        RegistroEvaluacionesUCI.Events()

        OrdenMedica.tipoServicio = "UCI";
    },

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: false })
        $(".chzn-select-deselect,#select2_sample").chosen()
        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaIngresoMGP, #txtFechaIngresoUCIM, #FechaInicioAtencion, #txtFechaUltimaVacunaCovid, #txtFechaUltimaCiruQuirur, #txtFechaInicioVm, #txtFechaUltimoVm, #txtFechaUltimaMensGinecoObst, #txtFechaUltimaCesareaGinecoObst').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaTomaHemocultivo, #txtFechaResultadosHemocultivo, #txtFechaTomaSecrecionBronquial, #txtFechaResultadosSecrecionBronquial').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaTomaOrina, #txtFechaResultadosOrina, #txtFechaTomaHeces, #txtFechaResultadosHeces, #txtFechaTomaSecreciones, #txtFechaResultadosSecreciones, #txtFechaAltaPlanApreciacion').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaRegistroNotaAdicional').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $("#txtHoraAtencionUCI, #txtHoraIngresoMGP, #HoraInicioAtencion, #txtHoraRegistroNotaAdicional, #txtHoraMonitoreoAvanzado").mask("Hn:Nn");

        $(".chosen-select").chosen();
    },

    Iniciar: () => {

        RegistroEvaluacionesUCI.ListaDepartamentosReferencia()

        RegistroEvaluacionesUCI.ListarExamenesImagenologicosYPruebasEspeciales()
        RegistroEvaluacionesUCI.ListarExamenesLaboratorialesEspeciales()

        RegistroEvaluacionesUCI.ListarMedicos()
        RegistroEvaluacionesUCI.ListarTiposDestinoAtencionHospitalizacion()

        /////////////DIAGNOSTICO////////////////////
        BusquedaDiagnosticos.IniciarScript();
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        /////////////////////////////////////////////

        ///////////CONSUMO EN EL SERVICIO//////////////
        ConsumoServicio.IniciarScript();
        /////////////////////////////////////////////

        /////////ORDENES MEDICAS////////////////
        OrdenMedica.IniciarScript();
        ////////////////////////////////////////

        /////////////ORDENES Y RECETAS///////////////
        Ordenes.tipoServicio = 'HOSP';
        Ordenes.IniciarScript();
        Ordenes.IniciarData();
        /////////////////////////////////////////////





        $('#contLabDiag').hide()
    },

    ListarExamenesImagenologicosYPruebasEspeciales: async function () {
        const res = await HttpClient.Get('/EvaluacionesUCI/ListarExamenesImagenologicosYPruebasEspeciales?area=Comun');
        $('#cboExamenImagenologico').empty()
        $(res.data.table).each(function (i, obj) {

            $('#cboExamenImagenologico').append(`<option value="${obj.id}">${obj.descripcion}</option>`)
        })

        $('.chosen-select').chosen().trigger("chosen:updated")
    },
    ListarExamenesLaboratorialesEspeciales: async function () {
        const res = await HttpClient.Get('/EvaluacionesUCI/ListarExamenesLaboratorialesEspeciales?area=Comun');
        $('#cboExamenLaboratorial').empty()
        $(res.data.table).each(function (i, obj) {

            $('#cboExamenLaboratorial').append(`<option value="${obj.id}">${obj.descripcion}</option>`)
        })

        $('.chosen-select').chosen().trigger("chosen:updated")
    },


    ListaDepartamentosReferencia: async function () {
        HttpClient.Get('/Utilitario/ListaDepartamentos?area=Comun').then(res => {
            $('#cmbdepEstbuscar').empty();
            $('#cmbdepEstbuscar').append(`<option value="0">-- Seleccionar --</option>`)
            $(res.lsDeparta.table).each(function (i, obj) {
                $('#cmbdepEstbuscar').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
            })


            RegistroEvaluacionesUCI.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
        })

    },
    ListaProvinciasByDepartamentos: async (idDepartamento, cboProvincia) => {
        let formData = new FormData();
        formData.append("idDepartamento", idDepartamento)

        await fetch('/Utilitario/ListaProvinciasByDepartamentos?area=Comun', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#' + cboProvincia).empty();
                $('#' + cboProvincia).append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsProvincias.table).each(function (i, obj) {
                    $('#' + cboProvincia).append(`<option value="${obj.idProvincia}">${obj.nombre}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    ListaDistritosByProvincia: (idDProvincia, cboDistrito) => {
        let formData = new FormData();
        formData.append("idDProvincia", idDProvincia)
        fetch('/Utilitario/ListaDistritosByProvincia?area=Comun', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#' + cboDistrito).empty();
                $('#' + cboDistrito).append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsDistrito.table).each(function (i, obj) {
                    $('#' + cboDistrito).append(`<option value="${obj.idDistrito}">${obj.nombre}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");

            })
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
                $('#cboMedicoComentario').empty();
                $('#cboMedicoComentarioEvaluacion').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboMedicoComentario').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    $('#cboMedicoComentarioEvaluacion').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                });


                $('#cboMedicoComentario').val($('#idMedicotxt').val());
                $('#cboMedicoComentarioEvaluacion').val($('#idMedicotxt').val());


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

    ListarTiposDestinoAtencionHospitalizacion: async () => {
        //let data = await Utilitario.TiposDestinoAtencionHospitalizacion()
        //if (!isEmpty(data)) {
        //    if (data.table.length > 0) {
        //        $('#cboDestinoComentario').empty()
        //        $('#cboDestinoComentario').append('<option  value="0">--Seleccionar--</option>')
        //        $(data.table).each(function (i, obj) {
        //            $('#cboDestinoComentario').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcion + '</option>')
        //        });

        //        $('.chzn-select').chosen().trigger("chosen:updated")
        //    }
        //}
    },

    PacientesSeleccionarPorId: async (idPaciente) => {
        let formData = new FormData()

        formData.append('idPaciente', idPaciente)
        return HttpClient.Post('/Paciente/PacientesSeleccionarPorId?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data.table[0]
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
    ListarResultadosLaboratorioByIdCuentaAtencion: async (idCuentaAtencion) => {
        let formData = new FormData()

        formData.append('idCuentaAtencion', idCuentaAtencion)

        return HttpClient.Post('/Utilitario/ListarResultadosLaboratorioByIdCuentaAtencion?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI: async (IdAtencionUCI) => {
        let formData = new FormData()

        formData.append('IdAtencionUCI', IdAtencionUCI)

        return HttpClient.Post('/EvaluacionesUCI/ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    SeleccionarExamenFisicoEvaluacionUCI: async (IdAtencionDetalleUCI) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarExamenFisicoEvaluacionUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarIntervencionesEvaluacionUCI: async (IdAtencionDetalleUCI) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarIntervencionesEvaluacionUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarExamenesAuxiliaresUCI: async (IdAtencionDetalleUCI) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarExamenesAuxiliaresUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarMonitoreoSoporteVentilatorioUCI: async (IdAtencionDetalleUCI, NroEvaluacion) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMonitoreoSoporteVentilatorioUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarMonitoreoSoporteVentilatorioUCIManiobras: async (IdAtencionDetalleUCI, NroEvaluacion) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMonitoreoSoporteVentilatorioUCIManiobras?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    SeleccionarMonitoreoHemodinamicoUCI: async (IdAtencionDetalleUCI, NroEvaluacion) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMonitoreoHemodinamicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarParametrosMonitoreoHemodinamicoUCI: async (IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('IdMonitoreo', IdMonitoreo)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarParametrosMonitoreoHemodinamicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    SeleccionarMonitoreoNeurologicoUCI: async (IdAtencionDetalleUCI, NroEvaluacion) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMonitoreoNeurologicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarParametrosMonitoreoNeurologicoUCI: async (IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('IdMonitoreo', IdMonitoreo)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarParametrosMonitoreoNeurologicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle: async (IdAtencionDetalleUCI, NroEvaluacion) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },
    SeleccionarParametrosMonitoreoUltrasonografiaUCI: async (IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('IdMonitoreo', IdMonitoreo)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarParametrosMonitoreoUltrasonografiaUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    SeleccionarParametroSoporteVentilatorioUCI: async (IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo) => {
        let formData = new FormData()

        formData.append('IdAtencionDetalleUCI', IdAtencionDetalleUCI)
        formData.append('NroEvaluacion', NroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('IdMonitoreo', IdMonitoreo)

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarParametroSoporteVentilatorioUCI?area=Hospitalizacion', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    ListaTriajeEmgHosp: async (idAtencion, idServicio, idNumero) => {

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        midata.append('idNumero', idNumero);
        await $.ajax({
            url: "/Atencion/ListaTriajeEmgHosp?area=ConsultaExterna",
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
                if (datos.table.length > 0) {
                    presionAr = datos.table[0].triajePresion

                    if (!(presionAr == null) && presionAr != '/') {
                        presionSep = presionAr.split("/");

                        $("#txtEFisicoPA").val(presionSep[0]);
                        $("#txtEFisicoPAD").val(presionSep[1]);

                        if ($("#txtEFisicoPA").val() != '' && $("#txtEFisicoPAD").val() != '') {
                            $('#txtEFisicoPAM').val((((2 * parseFloat($('#txtEFisicoPAD').val())) + parseInt($('#txtEFisicoPA').val())) / 3).toFixed(2))
                        }

                    }
                    if (datos.table[0].triajeFrecuenciaCardiaca != 0) {
                        $("#txtEFisicoFc").val(datos.table[0].triajeFrecuenciaCardiaca);
                    }
                    if (datos.table[0].triajeFrecuenciaRespiratoria != 0) {
                        $("#txtEFisicoFr").val(datos.table[0].triajeFrecuenciaRespiratoria);
                    }
                    $("#txtEFisicoSpO2").val(datos.table[0].triajeSaturacionOxigeno);
                    $("#txtEFisicoT").val(datos.table[0].triajeTemperatura);
                    $("#txtEFisicoPeso").val(datos.table[0].triajePeso);

                    if (!isEmpty(datos.table[0].triajeTalla) && datos.table[0].triajeTalla != '' && datos.table[0].triajeTalla != 'NaN') {
                        $("#txtEFisicoTalla").val(parseFloat((datos.table[0].triajeTalla) / 100).toFixed(2));
                    }


                    if ($("#txtEFisicoPeso").val() != '' && $("#txtEFisicoTalla").val() != '') {
                        $('#txtEFisicoIMC').val((parseFloat($('#txtEFisicoPeso').val()) / (parseFloat($('#txtEFisicoTalla').val()) * parseFloat($('#txtEFisicoTalla').val()))).toFixed(2))
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

    GuardarTriajeHospEmeg(idAtencion, idServicio, idEvaluacion) {
        var formData = new FormData();

        presion = $("#txtEFisicoPA").val() + "/" + $("#txtEFisicoPAD").val()
        formData.append("TriajePresion", presion);
        formData.append("TriajeTemperatura", $("#txtEFisicoT").val());
        formData.append("TriajeFrecRespiratoria", $("#txtEFisicoFr").val());
        formData.append("TriajeFrecCardiaca", $("#txtEFisicoFc").val());
        formData.append("TriajePeso", $("#txtEFisicoPeso").val());
        formData.append("TriajeTalla", parseInt(parseFloat($("#txtEFisicoTalla").val()) * 100));
        formData.append("TriajeSaturacionOxigeno", $("#txtEFisicoSpO2").val());

        formData.append("idServicio", idServicio);
        formData.append("idNumero", idEvaluacion);
        formData.append("idAtencion", idAtencion);

        HttpClient.Post('/Atencion/ModificarTriajeEmgHosp?area=ConsultaExterna', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error guardar triaje! " + e, "2");
                return null;
            })
    },

    CrearModificarMonitoreoSoporteVentilatorioUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, Descripcion, Cantidad, Precio, Total, VentiladorMecanicoMarca, FechaInicioVM, FechaTerminaVM, ModoVentilatorioConvencional, ModoVentilatorioNoConvencional) {
        var formData = new FormData();

        formData.append("IdAtencionDetalleUCI", IdAtencionDetalleUCI);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("IdItem", IdItem);
        formData.append("Descripcion", Descripcion);
        formData.append("Cantidad", Cantidad);
        formData.append("Precio", Precio);
        formData.append("Total", Total);
        formData.append("VentiladorMecanicoMarca", VentiladorMecanicoMarca);
        formData.append("FechaInicioVM", FechaInicioVM);
        formData.append("FechaTerminaVM", FechaTerminaVM);
        formData.append("ModoVentilatorioConvencional", ModoVentilatorioConvencional);
        formData.append("ModoVentilatorioNoConvencional", ModoVentilatorioNoConvencional);

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarMonitoreoSoporteVentilatorioUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    CrearModificarParametrosSoporteVentilatorioUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, Parametros) {
        let formData = new FormData()

        formData.append('idMonitoreo', idMonitoreo)
        formData.append('idAtencionDetalleUCI', idAtencionDetalleUCI)
        formData.append('nroEvaluacion', nroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('LstParametros', Parametros)

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarParametrosSoporteVentilatorioUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    CrearModificarMonitoreoHemodinamicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdEquipo, NombreEquipo, IdTipoMonitoreo, TipoMonitoreo, Cantidad, Precio, Total) {
        var formData = new FormData();

        formData.append("IdAtencionDetalleUCI", IdAtencionDetalleUCI);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("IdEquipo", IdEquipo);
        formData.append("NombreEquipo", NombreEquipo);
        formData.append("IdTipoMonitoreo", IdTipoMonitoreo);
        formData.append("TipoMonitoreo", TipoMonitoreo);
        formData.append("Cantidad", Cantidad);
        formData.append("Precio", Precio);
        formData.append("Total", Total);

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarMonitoreoHemodinamicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    CrearModificarParametrosMonitoreoHemodinamicoUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, Parametros) {
        let formData = new FormData()

        formData.append('idMonitoreo', idMonitoreo)
        formData.append('idAtencionDetalleUCI', idAtencionDetalleUCI)
        formData.append('nroEvaluacion', nroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('LstParametros', Parametros)

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarParametrosMonitoreoHemodinamicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    CrearModificarMonitoreoNeurologicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, NombreEquipo, IdTipoMonitoreo, TipoMonitoreo, Cantidad, Precio, Total) {
        var formData = new FormData();

        formData.append("IdAtencionDetalleUCI", IdAtencionDetalleUCI);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("IdItem", IdItem);
        formData.append("NombreEquipo", NombreEquipo);
        formData.append("IdTipoMonitoreo", IdTipoMonitoreo);
        formData.append("TipoMonitoreo", TipoMonitoreo);
        formData.append("Cantidad", Cantidad);
        formData.append("Precio", Precio);
        formData.append("Total", Total);

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarMonitoreoNeurologicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    CrearModificarParametrosMonitoreoNeurologicoUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, Parametros) {
        let formData = new FormData()

        formData.append('idMonitoreo', idMonitoreo)
        formData.append('idAtencionDetalleUCI', idAtencionDetalleUCI)
        formData.append('nroEvaluacion', nroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('LstParametros', Parametros)

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarParametrosMonitoreoNeurologicoUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    CrearModificarMonitoreoUltrasonografiaUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, Descripcion, Cantidad, Precio, Total, DescripcionHallazgos) {
        var formData = new FormData();

        formData.append("IdAtencionDetalleUCI", IdAtencionDetalleUCI);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("IdItem", IdItem);
        formData.append("Descripcion", Descripcion);
        formData.append("Cantidad", Cantidad);
        formData.append("Precio", Precio);
        formData.append("Total", Total);
        formData.append("DescripcionHallazgos", DescripcionHallazgos);

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarMonitoreoUltrasonografiaUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    CrearModificarParametrosMonitoreoUltrasonografiaUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, Parametros) {
        let formData = new FormData()

        formData.append('idMonitoreo', idMonitoreo)
        formData.append('idAtencionDetalleUCI', idAtencionDetalleUCI)
        formData.append('nroEvaluacion', nroEvaluacion)
        formData.append('IdItem', IdItem)
        formData.append('LstParametros', Parametros)

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarParametrosMonitoreoUltrasonografiaUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    EliminarParametrosMonitoreo(IdAtencionDetalleUCI, IdMonitoreo, NroEvaluacion, TipoMonitoreo) {
        var formData = new FormData();

        formData.append("IdAtencionDetalleUCI", IdAtencionDetalleUCI);
        formData.append("IdMonitoreo", IdMonitoreo);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("TipoMonitoreo", TipoMonitoreo);

        return HttpClient.Post('/EvaluacionesUCI/EliminarParametrosMonitoreo?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    CrearModificarComentarioApreciacionUCI(idCuenta, IdComentarioApreciacion, IdAtencionUCI, OrganoAfectado, Medico, Destino, ComentarioApreciacion, Plan, Fecha, Hora) {
        var formData = new FormData();

        formData.append("idCuenta", idCuenta);
        formData.append("IdComentarioApreciacion", IdComentarioApreciacion);
        formData.append("IdAtencionUCI", IdAtencionUCI);
        formData.append("OrganoAfectado", OrganoAfectado);
        formData.append("Medico", Medico);
        formData.append("Destino", Destino);
        formData.append("ComentarioApreciacion", ComentarioApreciacion);
        formData.append("Plan", Plan);
        formData.append("Fecha", Fecha);
        formData.append("Hora", Hora);

        return HttpClient.Post('/EvaluacionesUCI/CrearModificarComentarioApreciacionUCI?area=Hospitalizacion', formData)
            .then((res) => {
                return res
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    SeleccionarMedicamentosSedanesUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMedicamentosSedanesUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarMedicamentosAnalgesicosUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMedicamentosAnalgesicosUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarMedicamentosBloqueanteNeuromuscularUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMedicamentosBloqueanteNeuromuscularUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarMedicamentosVasodilatadorUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMedicamentosVasodilatadorUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarMedicamentosVasoconstrictorUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarMedicamentosVasoconstrictorUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarAccesosVascularesUCI(idAtencionDetalleUCI, nroEvaluacion) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);
        formData.append("nroEvaluacion", nroEvaluacion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarAccesosVascularesUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    SeleccionarIntervencionesHemoderivadosUCI(idAtencionDetalleUCI) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarIntervencionesHemoderivadosUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarIntervencionesCorticoidesUCI(idAtencionDetalleUCI) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarIntervencionesCorticoidesUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },
    SeleccionarIntervencionesFluidoterapiaUCI(idAtencionDetalleUCI) {
        var formData = new FormData();

        formData.append("idAtencionDetalleUCI", idAtencionDetalleUCI);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarIntervencionesFluidoterapiaUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },


    SeleccionarComentarioApreciacionUCIByIdAtencionUCI(IdAtencionUCI) {
        var formData = new FormData();

        formData.append("IdAtencionUCI", IdAtencionUCI);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarComentarioApreciacionUCIByIdAtencionUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    SeleccionarOtraPatologiasObstetricasUCI(IdAtencion) {
        var formData = new FormData();

        formData.append("IdAtencion", IdAtencion);

        return HttpClient.Post('/EvaluacionesUCI/SeleccionarOtraPatologiasObstetricasUCI?area=Hospitalizacion', formData)
            .then((res) => {
                console.log('nel pastel', res)
                return res.data.table
            })
            .catch(e => {
                alerta("ERROR", "Error al guardar monitoreo! " + e, "2");
                return null;
            })
    },

    BuscarOtrasPatBusqueda() {
        var midata = new FormData();
        midata.append('Codigo', $("#txtCodigoOtrasPatFiltro").val());
        midata.append('Descripcion', $("#txtDescripcionOtrasPatFiltro").val());
        $.ajax({
            method: "POST",
            url: "/PlanificacionFamiliar/ObtenerDiagnosticoV2?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                oTable_OtrasPatBusqueda.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        oTable_OtrasPatBusqueda.fnAddData(datos.table);
                    }

                }

            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    BuscaAtencionesCptCEparaFormatoHIS: (idCuentaAtencion) => {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHISConDescripcion?area=Facturacion",
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

    LimpiarFiltros() {
        $("#txtCodigoOtrasPatFiltro").val("");
        $("#txtDescripcionOtrasPatFiltro").val("");
    },


    InitDatablesEvaluaciones: () => {

        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '30%',
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.idNumero + ' - ' + rowData.fechaEvaluacion);
                    }
                },
                {
                    width: '70%',
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
        oTable_Evaluaciones = $("#tblEvaluaciones").dataTable(parms);

    },
    InitDatablesOtrasPatologias: () => {

        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [

                {
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": visible },
                { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }
            ]
        }

        var tableWrapper = $('#tblOtrasPatologias'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_OtrasPatologias = $("#tblOtrasPatologias").dataTable(parms);

    },


    InitDatablesSoporteVentilatorio: () => {

        var parms = {
            "scrollY": "500px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'cantidad',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'precio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblMonitoreoSoporteVentilatorio'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MonitoreoSoporteVentilatorio = $("#tblMonitoreoSoporteVentilatorio").dataTable(parms);

    },
    InitDatablesParametrosSoporteVentilatorio: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '80%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "valorParametro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtSopVentCant_' + rowData.idParametro + '" value="' + rowData.valorParametro + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                //{
                //    width: '30%',
                //    targets: 1,
                //    data: 'valorParametro',
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }

        var tableWrapper = $('#tblParametrosSoporteVentilatorio'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ParametrosSoporteVentilatorio = $("#tblParametrosSoporteVentilatorio").dataTable(parms);

    },


    InitDatablesMonitoreoHemodinamico: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '35%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '35%',
                    targets: 1,
                    data: 'tipoMonitoreo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'cantidad',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'precio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblMonitoreoHemodinamico'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MonitoreoHemodinamico = $("#tblMonitoreoHemodinamico").dataTable(parms);

    },
    InitDatablesParametrosMonitoreoHemodinamico: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '80%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "valorParametro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtHemoCant_' + rowData.idParametro + '" value="' + rowData.valorParametro + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
            ]
        }

        var tableWrapper = $('#tblParametrosMonitoreoHemodinamico'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ParametrosMonitoreoHemodinamico = $("#tblParametrosMonitoreoHemodinamico").dataTable(parms);

    },
    InitDatablesUltrasonografia: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '40%',
                //    targets: 1,
                //    data: "descripcionHallazgos",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '10%',
                    targets: 2,
                    data: 'cantidad',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'precio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblMonitoreoUltrasonografia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MonitoreoUltrasonografia = $("#tblMonitoreoUltrasonografia").dataTable(parms);

    },
    InitDatablesParametrosUltrasonografia: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '80%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "valorParametro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtUltraCant_' + rowData.idParametro + '" value="' + rowData.valorParametro + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
            ]
        }

        var tableWrapper = $('#tblParametrosUltrasonografia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ParametrosUltrasonografia = $("#tblParametrosUltrasonografia").dataTable(parms);

    },
    InitDatablesNeurologico: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'cantidad',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'precio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblMonitoreoNeurologico'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MonitoreoNeurologico = $("#tblMonitoreoNeurologico").dataTable(parms);

    },
    InitDatablesParametrosNeurologico: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '80%',
                    targets: 0,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "valorParametro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtNeuroCant_' + rowData.idParametro + '" value="' + rowData.valorParametro + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
            ]
        }

        var tableWrapper = $('#tblParametrosNeurologico'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ParametrosNeurologico = $("#tblParametrosNeurologico").dataTable(parms);

    },

    InitDatablesBusquedaOtrasPat: () => {
        oTable_OtrasPatBusqueda = $("#tblOtrasPatBusqueda").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            "autoWidth": false,
            scrollCollapse: true,
            bLengthChange: false,
            buttons: [],
            columns: [
                { "data": "iddiagnostico", className: 'ContCenter', "visible": false },
                { "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { "data": "codigoCIE10", className: 'ContCenter', width: '10%' },
                { "data": "descripcion" },
                { "data": "esActivo", className: 'ContCenter', "visible": false },
                { "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { "data": "intrahospitalario", className: 'ContCenter', "visible": false }
            ]
        });
    },

    InitDatablesComentarioApreciacion: () => {

        var parms = {
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "fila",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '30%',
                    targets: 2,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '30%',
                    targets: 3,
                    data: "destino",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: "10%",
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarComentarioSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                        if (rowData.code != '' && rowData.code != 0) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirComentarioCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarComentarioSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirComentarioSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]
        }

        var tableWrapper = $('#tblComentarioApreciacion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ComentarioApreciacion = $("#tblComentarioApreciacion").dataTable(parms);

    },
    InitDatablesEstablecimientos: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "codigo",
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
                    data: "distrito",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "provincia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<span class="chip orange">' + 'Estab' + '</span >');
                    }
                }
            ]
        }
        oTable_establecimientos = $("#tblEstSaludUci").dataTable(parms);

        //oTable_EstSalud = $("#tblEstSalud").dataTable(parms);
    },

    EventosIniciales() {
        $('#tblEstSaludUci tbody').on('click', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblEstSaludUci tbody').on('dblclick', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_establecimientos.api(true).row('.selected').data();

            $('#txtIdReferenciaCita').val(objrow.codigo)
            $('#txtDescripcionReferenciaCita').val(objrow.nombre)

            RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = objrow.idEstablecimiento


            $('#modalEstablecimientosUciBuscar').modal('hide')
        })
    },

    Events: async () => {
        $('#cmbdepEstbuscar').on('change', function () {
            RegistroEvaluacionesUCI.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
            RegistroEvaluacionesUCI.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })
        $('#cmbprovEstBuscar').on('change', function () {
            RegistroEvaluacionesUCI.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })

        $('#cboTranstornoHipertenEmbarazo').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroTranstornoHipertenEmbarazo').parent()[0]).show()
            } else {
                $($('#txtOtroTranstornoHipertenEmbarazo').parent()[0]).hide()
            }
        })
        $('#cboOtrasEnfHipertenEmbarazo').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroOtrasEnfHipertenEmbarazo').parent()[0]).show()
            } else {
                $($('#txtOtroOtrasEnfHipertenEmbarazo').parent()[0]).hide()
            }
        })
        $('#cboMotivoInfeccioso').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroMotivoInfeccioso').parent()[0]).show()
            } else {
                $($('#txtOtroMotivoInfeccioso').parent()[0]).hide()
            }
        })
        $('#cboMotivoGastroEnterico').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroMotivoGastroEnterico').parent()[0]).show()
            } else {
                $($('#txtOtroMotivoGastroEnterico').parent()[0]).hide()
            }
        })
        $('#cboMotivoRespiratorio').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroMotivoRespiratorio').parent()[0]).show()
            } else {
                $($('#txtOtroMotivoRespiratorio').parent()[0]).hide()
            }
        })
        $('#cboMotivoEndocrinoMetabolico').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroMotivoEndocrinoMetabolico').parent()[0]).show()
            } else {
                $($('#txtOtroMotivoEndocrinoMetabolico').parent()[0]).hide()
            }
        })
        $('#cboMotivoCardiovascular').on('change', function () {

            if (this.value == 99) {
                $($('#txtOtroMotivoCardiovascular').parent()[0]).show()
            } else {
                $($('#txtOtroMotivoCardiovascular').parent()[0]).hide()
            }
        })

        $('#cboEFisicoSedantes').on('change', function () {
            if ($('#cboEFisicoSedantes').val() == 99) {
                $('#txtEFisicoSedantesOtros').show()
            } else {
                $('#txtEFisicoSedantesOtros').hide()
            }
        })
        $('#cboEFisicoSedantesMed').on('change', function () {
            if ($('#cboEFisicoSedantesMed').val() == 99) {
                $('#txtEFisicoSedantesMedOtros').show()
            } else {
                $('#txtEFisicoSedantesMedOtros').hide()
            }
        })

        $('#cboEFisicoAnalgesicos').on('change', function () {
            if ($('#cboEFisicoAnalgesicos').val() == 99) {
                $('#txtEFisicoAnalgesicosOtros').show()
            } else {
                $('#txtEFisicoAnalgesicosOtros').hide()
            }
        })
        $('#cboEFisicoAnalgesicosMed').on('change', function () {
            if ($('#cboEFisicoAnalgesicosMed').val() == 99) {
                $('#txtEFisicoAnalgesicosMedOtros').show()
            } else {
                $('#txtEFisicoAnalgesicosMedOtros').hide()
            }
        })

        $('#cboEFisicoRNM').on('change', function () {
            if ($('#cboEFisicoRNM').val() == 99) {
                $('#txtEFisicoRNMOtros').show()
            } else {
                $('#txtEFisicoRNMOtros').hide()
            }
        })
        $('#cboEFisicoRNMMed').on('change', function () {
            if ($('#cboEFisicoRNMMed').val() == 99) {
                $('#txtEFisicoRNMMedOtros').show()
            } else {
                $('#txtEFisicoRNMMedOtros').hide()
            }
        })

        $('#cboEFisicoCardioVasodilatador').on('change', function () {
            if ($('#cboEFisicoCardioVasodilatador').val() == 99) {
                $('#txtEFisicoCardioVasodilatadorOtros').show()
            } else {
                $('#txtEFisicoCardioVasodilatadorOtros').hide()
            }
        })
        $('#cboEFisicoCardioVasodilatadorMed').on('change', function () {
            if ($('#cboEFisicoCardioVasodilatadorMed').val() == 99) {
                $('#txtEFisicoCardioVasodilatadorMedOtros').show()
            } else {
                $('#txtEFisicoCardioVasodilatadorMedOtros').hide()
            }
        })

        $('#cboEFisicoCardioVasoconstrictor').on('change', function () {
            if ($('#cboEFisicoCardioVasoconstrictor').val() == 99) {
                $('#txtEFisicoCardioVasoconstrictorOtros').show()
            } else {
                $('#txtEFisicoCardioVasoconstrictorOtros').hide()
            }
        })
        $('#cboEFisicoCardioVasoconstrictorMed').on('change', function () {
            if ($('#cboEFisicoCardioVasoconstrictorMed').val() == 99) {
                $('#txtEFisicoCardioVasoconstrictorMedOtros').show()
            } else {
                $('#txtEFisicoCardioVasoconstrictorMedOtros').hide()
            }
        })

        $('#cboEFisicoTipoAccesoVascular').on('change', function () {
            if ($('#cboEFisicoTipoAccesoVascular').val() == 99) {
                $('#txtEFisicoTipoAccesoVascularOtro').show()
            } else {
                $('#txtEFisicoTipoAccesoVascularOtro').hide()
            }
        })
        $('#cboEFisicoUbicacionAccesoVascular').on('change', function () {
            if ($('#cboEFisicoUbicacionAccesoVascular').val() == 99) {
                $('#txtEFisicoUbicacionAccesoVascularOtro').show()
            } else {
                $('#txtEFisicoUbicacionAccesoVascularOtro').hide()
            }
        })
        $('#cboIntervencionesTipoHemoderivado').on('change', function () {
            if ($('#cboIntervencionesTipoHemoderivado').val() == 99) {
                $('#txtIntervencionesTipoHemoderivadoOtros').show()
            } else {
                $('#txtIntervencionesTipoHemoderivadoOtros').hide()
            }
        })

        $('input[name=rdbEstudioPorImagenes]').on('click', function () {
            if ($('#rdbEstudioPorImagenesSi').is(':checked')) {
                $('#contEstudiPorImagenes').show()
            } else {
                $('#contEstudiPorImagenes').hide()
            }
        })

        $('input[name=rdbHallazgos]').on('click', function () {
            if ($('#rdbHallazgosSi').is(':checked')) {
                $('#contHallzagos').show()
            } else {
                $('#contHallzagos').hide()
            }
        })

        $('input[name=rdbSedantes]').on('click', function () {
            if ($('#rdbSedantesSi').is(':checked')) {
                $('#contSedantes').show()
            } else {
                $('#contSedantes').hide()
            }
        })

        $('input[name=rdbAnalgesicos]').on('click', function () {
            if ($('#rdbAnalgesicosSi').is(':checked')) {
                $('#contAnalgesicos').show()
            } else {
                $('#contAnalgesicos').hide()
            }
        })

        $('input[name=rdbBloqueanteNeuromuscular]').on('click', function () {
            if ($('#rdbBloqueanteNeuromuscularSi').is(':checked')) {
                $('#contBloqueanteNeuromuscular').show()
            } else {
                $('#contBloqueanteNeuromuscular').hide()
            }
        })

        $('input[name=rdbVasodilatador]').on('click', function () {
            if ($('#rdbVasodilatadorSi').is(':checked')) {
                $('#contVasodilatador').show()
            } else {
                $('#contVasodilatador').hide()
            }
        })
        $('input[name=rdbVasoconstrictor]').on('click', function () {
            if ($('#rdbVasoconstrictorSi').is(':checked')) {
                $('#contVasoconstrictor').show()
            } else {
                $('#contVasoconstrictor').hide()
            }
        })
        $('input[name=rdbBloqueanteNeuromuscular]').on('click', function () {
            if ($('#rdbBloqueanteNeuromuscularSi').is(':checked')) {
                $('#contBloqueanteNeuromuscular').show()
            } else {
                $('#contBloqueanteNeuromuscular').hide()
            }
        })

        $('input[name=rdbTerapiaInfusionRenal]').on('click', function () {
            if ($('#rdbTerapiaInfusionRenalSi').is(':checked')) {
                $('#contTerapiaInfusionRenal').show()
            } else {
                $('#contTerapiaInfusionRenal').hide()
            }
        })

        $('input[name=rdbInforme]').on('click', function () {
            if ($('#rdbInformeSi').is(':checked')) {
                $('#contMotivoInforme').show()
            } else {
                $('#contMotivoInforme').hide()
                $('#txtMotivoEvaluacionUCI').val('')
            }
        })


        $("#btnNuevaEvaluacion").on('click', () => {

            if ($('#cboCondicionIngreso').val() == 0) {
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#motivoAtencion"]').tab('show');

                $("#cboCondicionIngreso").focus()
                $("#cboCondicionIngreso_chosen").addClass("chosen-container-active")

                alerta(2, 'Debe seleccionar el tipo de paciente')
                return false
            }

            if ($('#txtEdadGestacionalSemanas').val() == '' && $('#txtEdadGestacionalDias').val() == '') {
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#motivoAtencion"]').tab('show');

                $("#txtEdadGestacionalSemanas").focus()
                alerta(2, 'Debe ingresar la edad gestacional')
                return false
            }

            if ($('#txtSofaPreUCI').val() == '') {
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#motivoAtencion"]').tab('show');

                $("#txtSofaPreUCI").focus()
                alerta(2, 'Debe ingresar un valor para SOFA Pre-UCI')
                return false
            }


            RegistroEvaluacionesUCI.HabilitarNuevaEvaluacion()
        })
        $('#btnGuardar').on('click', async () => {

            if (RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                alerta(2, 'Seleccione o agregue una evaluacion')
                return false;
            }

            if ($('#txtFechaIngresoMGP').val() == '') {
                alerta(2, 'Fecha de Ingreso al MGP')
                $('#txtFechaIngresoMGP').focus()
                return false;
            }

            if ($('#txtHoraIngresoMGP').val() == '') {
                alerta(2, 'La hora de Ingreso al MGP es un campo obligatorio')
                $('#txtHoraIngresoMGP').focus()
                return false;
            }


            if ($('#txtFechaIngresoUCIM').val() == '') {
                alerta(2, 'Fecha de Ingreso a UCIM')
                $('#txtFechaIngresoUCIM').focus()
                return false;
            }

            if ($('#txtHoraAtencionUCI').val() == '') {
                alerta(2, 'La hora de Ingreso a UCIM es un campo obligatorio')
                $('#txtHoraAtencionUCI').focus()
                return false;
            }

            if ($('#FechaInicioAtencion').val() == '') {
                alerta(2, 'La fecha de evaluacion es obligatoria')
                $('#FechaInicioAtencion').focus()
                return false;
            }

            if ($('#HoraInicioAtencion').val() == '') {
                alerta(2, 'La hora de evaluacion es obligatoria')
                $('#HoraInicioAtencion').focus()
                return false;
            }

            if (isEmpty($('#cboTipoIngresoUCIM').val())) {
                alerta(2, 'El tipo de ingreso a UCIM es obligatorio')
                return false;
            }

            if ($('#txtGrupoSanguineo').val() == '') {
                alerta(2, 'El grupo samguineo es obligatorio')
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#antecedentes"]').tab('show');
                $('.nav-tabs a[href="#antecedentesPersonales-tab"]').tab('show');

                $('#txtGrupoSanguineo').focus()
                return false;
            }

            if ($('#txtFactor').val() == '') {
                alerta(2, 'El factor es obligatorio')
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#antecedentes"]').tab('show');
                $('.nav-tabs a[href="#antecedentesPersonales-tab"]').tab('show');

                $('#txtFactor').focus()
                return false;
            }

            if ($('#txtEdadGestacionalSemanas').val() == '') {
                alerta(2, 'La edad gestacional es obligatoria')
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#enfermedadActual"]').tab('show');

                $('#txtEdadGestacionalSemanas').focus()
                return false;
            }

            if ($('#txtEdadGestacionalDias').val() == '') {
                alerta(2, 'La edad gestacional es obligatoria')
                $('.nav-tabs a[href="#notaIngreso"]').tab('show');
                $('.nav-tabs a[href="#enfermedadActual"]').tab('show');

                $('#txtEdadGestacionalDias').focus()
                return false;
            }

            if ($('#txtEFisicoTalla').val() == '') {
                alerta(2, 'La Talla es obligatoria')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
                $('.nav-tabs a[href="#examenFisico-tab"]').tab('show');

                $('#txtEFisicoTalla').focus()
                return false;
            }

            if ($('#txtEFisicoPeso').val() == '') {
                alerta(2, 'El peso es obligatorio')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
                $('.nav-tabs a[href="#examenFisico-tab"]').tab('show');
                $('#txtEFisicoPeso').focus()
                return false;
            }

            if ($('#txtEFisicoRespFIO').val() == '') {
                alerta(2, 'Debe registrar un valor para Fracción inspiratoria de O2 0.21')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
                $('.nav-tabs a[href="#examenFisicoRespiratorio-tab"]').tab('show');

                $('#txtEFisicoRespFIO').focus()
                return false;
            }

            if ($('#txtIngresosFluidossvo6h').val() == '') {
                alerta(2, 'Debe registrar un valor para Ingresos fluidos s/vo 6h')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
                $('.nav-tabs a[href="#examenFisicoCardiovascular-tab"]').tab('show');

                $('#txtIngresosFluidossvo6h').focus()
                return false;
            }

            if ($('#txtInterBh6').val() == '') {
                alerta(2, 'Debe registrar un valor para Bh 6h')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
                $('.nav-tabs a[href="#examenFisicoCardiovascular-tab"]').tab('show');

                $('#txtInterBh6').focus()
                return false;
            }

            if (Diagnosticos.DevolverDiagnosticos().toArray().length <= 0) {
                alerta(2, 'Debe registrar al menos un diagnostico')

                $('.nav-tabs a[href="#evaluaciones"]').tab('show');
                $('.nav-tabs a[href="#diagnosticos-tab-link"]').tab('show');
                return false;
            }

            //Diagnosticos.DevolverDiagnosticos().toArray()


            Cargando(1)

            let formData = new FormData()

            formData.append('IdAtencionUCI', RegistroEvaluacionesUCI.idAtencionUCI)
            formData.append('IdAtencion', RegistroEvaluacionesUCI.idAtencion)
            formData.append('TipoProcedencia', $('#cboProcedenciaUCI').val())
            //formData.append('EstablecimientoProcedenciaReferido', ($('#cboProcedenciaUCI').val() == 1 ? $('#cboProcedenciaHospital').val() : 0))
            //formData.append('EstablecimientoProcedenciaInstitucional', ($('#cboProcedenciaUCI').val() == 2 ? $('#cboProcedenciaServicio').val() : 0))
            formData.append('EstablecimientoProcedenciaReferido', RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido)
            formData.append('EstablecimientoProcedenciaInstitucional', $('#cboProcedenciaServicio').val())
            formData.append('TipoIngresoUCI', $('#cboTipoIngresoUCIM').val())
            formData.append('FechaIngresoMGP', $('#txtFechaIngresoMGP').val())
            formData.append('HoraIngresoMGP', $('#txtHoraIngresoMGP').val())
            formData.append('FechaIngresoUCI', $('#txtFechaIngresoUCIM').val())
            formData.append('HoraIngresoUCI', $('#txtHoraAtencionUCI').val())

            formData.append('IdCamaUCI', $('#cboCamaHospitalizacion').val())


            formData.append('Diabetes', $('#rdbDiabetesFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('DiabetesDescripcion', $('#txtDiabetesFamiliar').val())
            formData.append('DiabetesPatMat', $('#rdbDiabetesFamiliarPaterno').is(':checked') ? 1 : $('#rdbDiabetesFamiliarMaterno').is(':checked') ? 2 : $('#rdbDiabetesFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('TBC', $('#rdbTBCFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('TBCDescripcion', $('#txtTBCFamiliar').val())
            formData.append('TBCPatMat', $('#rdbTBCFamiliarPaterno').is(':checked') ? 1 : $('#rdbTBCFamiliarMaterno').is(':checked') ? 2 : $('#rdbTBCFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('Hipertension', $('#rdbHipertensionFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('HipertensionDescripcion', $('#txtHipertensionFamiliar').val())
            formData.append('HipertensionPatMat', $('#rdbHipertensionFamiliarPaterno').is(':checked') ? 1 : $('#rdbHipertensionFamiliarMaterno').is(':checked') ? 2 : $('#rdbHipertensionFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('NeoCancer', $('#rdbMeoplasicoCancerFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('NeoCancerDescripcion', $('#txtMeoplasicoCancerFamiliar').val())
            formData.append('NeoCancerPatMat', $('#rdbMeoplasicoCancerFamiliarPaterno').is(':checked') ? 1 : $('#rdbMeoplasicoCancerFamiliarMaterno').is(':checked') ? 2 : $('#rdbMeoplasicoCancerFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('EnfTiroidea', $('#rdbEnfTiroideaFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('EnfTiroideaDescripcion', $('#txtEnfTiroideaFamiliar').val())
            formData.append('EnfTiroideaPatMat', $('#rdbEnfTiroideaFamiliarPaterno').is(':checked') ? 1 : $('#rdbEnfTiroideaFamiliarMaterno').is(':checked') ? 2 : $('#rdbEnfTiroideaFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('EnfReumatica', $('#rdbEnfReumaticaFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('EnfReumaticaDescripcion', $('#txtEnfReumaticaFamiliar').val())
            formData.append('EnfReumaticaPatMat', $('#rdbEnfReumaticaFamiliarPaterno').is(':checked') ? 1 : $('#rdbEnfReumaticaFamiliarMaterno').is(':checked') ? 2 : $('#rdbEnfReumaticaFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('Asma', $('#rdbAsmaFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('AsmaDescripcion', $('#txtAsmaFamiliar').val())
            formData.append('AsmaPatMat', $('#rdbAsmaFamiliarPaterno').is(':checked') ? 1 : $('#rdbAsmaFamiliarMaterno').is(':checked') ? 2 : $('#rdbAsmaFamiliarAmbos').is(':checked') ? 3 : 0)
            formData.append('Otros', $('#rdbOtrosFamiliarSi').is(':checked') ? 1 : 0)
            formData.append('OtrosDescripcion', $('#txtOtrosFamiliar').val())
            formData.append('OtrosPatMat', $('#rdbOtrosFamiliarPaterno').is(':checked') ? 1 : $('#rdbOtrosFamiliarMaterno').is(':checked') ? 2 : $('#rdbOtrosFamiliarAmbos').is(':checked') ? 3 : 0)

            formData.append('GrupoSanguineo', $('#txtGrupoSanguineo').val());
            formData.append('Factor', $('#txtFactor').val());
            formData.append('ActividadFisica', $('#cboActividadFisica').val());

            formData.append('EstadoNutricional', $('input[name="rdbEstadoNutricional"]:checked').val());
            formData.append('GravedadEnfermedad', $('input[name="rdbGravedadEnfermedad"]:checked').val());
            formData.append('IncrementoPeso', $('#txtIncrementoPeso').val());

            formData.append('Alimentacion1', $('#cboAlimentacion').val());
            //formData.append('Alimentacion2', $('#chkAlimentacion2').is(':checked') ? 1 : 0);
            //formData.append('Alimentacion3', $('#chkAlimentacion3').is(':checked') ? 1 : 0);
            formData.append('AlimentacionMas3', $('#chkAlimentacionMas3').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionCarnes', $('#chkTipoAlimentacionCarnes').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionMixta', $('#chkTipoAlimentacionMixta').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionVegetariana', $('#chkTipoAlimentacionVegetariana').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionProcesados', $('#chkTipoAlimentacionProcesados').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionOtro', $('#chkTipoAlimentacionOtro').is(':checked') ? 1 : 0);
            formData.append('TipoAlimentacionOtroDescripcion', $('#txtTipoAlimentacionOtroDescripcion').val());

            formData.append('VacunaInfluenza', $('#rdbVacunaInfluenzaSi').is(':checked') ? 1 : 0)
            formData.append('VacunaInfluenzaDescripcion', $('#txtVacunaInfluenza').val())
            formData.append('VacunaDTAdulta', $('#rdbVacunaDTAdultoSi').is(':checked') ? 1 : 0)
            formData.append('VacunaDTAdultaDescripcion', $('#txtVacunaDTAdulto').val())
            formData.append('VacunaTexoideTetanico', $('#rdbVacunaTexoideTetanicoSi').is(':checked') ? 1 : 0)
            formData.append('VacunaTexoideTetanicoDescripcion', $('#txtVacunaTexoideTetanico').val())
            formData.append('VacunaFiebreAmarilla', $('#rdbVacunaFiebreAmarillaSi').is(':checked') ? 1 : 0)
            formData.append('VacunaFiebreAmarillaDescripcion', $('#txtVacunaFiebreAmarilla').val())
            formData.append('VacunaHepatitisB', $('#rdbVacunaHepatitisBSi').is(':checked') ? 1 : 0)
            formData.append('VacunaHepatitisBDescripcion', $('#txtVacunaHepatitisB').val())
            formData.append('VacunaBCG', $('#rdbVacunaBCGSi').is(':checked') ? 1 : 0)
            formData.append('VacunaBCGDescripcion', $('#txtVacunaBCG').val())
            formData.append('VacunaPapilomavirus', $('#rdbVacunaPapilomavirusSi').is(':checked') ? 1 : 0)
            formData.append('VacunaPapilomavirusDescripcion', $('#txtVacunaPapilomavirus').val())
            formData.append('VacunaOtra', $('#rdbVacunaOtraSi').is(':checked') ? 1 : 0)
            formData.append('VacunaOtraDescripcion', $('#txtVacunaOtra').val())

            formData.append('VacunaCovidNroDosis', $('#cboNroDosisVacunaCovid').val())
            formData.append('FechaUltimaVacunaCovid', $('#txtFechaUltimaVacunaCovid').val())

            formData.append('HbBebidasAlcoholicas', $('#rdbBebidasAlcoholicasHabNocSi').is(':checked') ? 1 : 0)
            formData.append('HbBebidasAlcoholicasDescripcion', $('#txtBebidasAlcoholicasHabNoc').val())
            formData.append('HbDrogas', $('#rdbDrogasHabNocSi').is(':checked') ? 1 : 0)
            formData.append('HbDrogasDescripcion', $('#txtDrogasHabNoc').val())
            formData.append('HbTabacoCigarros', $('#rdbTabacoCigarrosHabNocSi').is(':checked') ? 1 : 0)
            formData.append('HbTabacoCigarrosDescripcion', $('#txtTabacoCigarrosHabNoc').val())
            formData.append('HbOtros', $('#rdbOtrosHabNocSi').is(':checked') ? 1 : 0)
            formData.append('HbOtrosDescripcion', $('#txtOtrosHabNoc').val())

            formData.append('AlergFarmacologicas', $('#rdbFarmacologicasAlerSi').is(':checked') ? 1 : 0)
            formData.append('AlergFarmacologicasDescripcion', $('#txtFarmacologicasAler').val())
            formData.append('AlergAlimentacion', $('#rdbAlimentacionAlerSi').is(':checked') ? 1 : 0)
            formData.append('AlergAlimentacionDescripcion', $('#txtAlimentacionAler').val())
            formData.append('AlergOtros', $('#rdbOtrosAlerSi').is(':checked') ? 1 : 0)
            formData.append('AlergOtrosDescripcion', $('#txtOtrosAler').val())
            formData.append('AlergSignosSintomas', $('#txtSignosSintomasAler').val())
            formData.append('Ram', $('#txtRam').val())

            formData.append('PatInfecciosaCovid19', $('#chkCovid19Pat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaVIH', $('#chkVihPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaSifilis', $('#chkSifilisPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaTuberculosis', $('#chkTuberculosisPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaHepatitis', $('#chkHepatitisPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaMalaria', $('#chkMalariaPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaDengue', $('#chkDenguePat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaNinguna', $('#chkInfecciosaNingunaPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaOtro', $('#chkOtroInfecciosaPat').is(':checked') ? 1 : 0)
            formData.append('PatInfecciosaOtroDescripcion', $("#txtDescripcionOtroInfecciosaPat").val())
            formData.append('PatMetaBiabetesMellitusI', $('#chkDiabetesMellitusIPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaBiabetesMellitusII', $('#chkDiabetesMellitusIIPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaObesidad', $('#chkObesidadPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaCirrosis', $('#chkCirrosisPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaHipotiroidismo', $('#chkHipotiroidismoPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaHipertiroidismo', $('#chkHipertiroidismoPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaHigadoGraso', $('#chkHigadoGrasoPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaNinguna', $('#chkMetabolicaNingunaPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaOtro', $('#chkOtroMetabolicaPat').is(':checked') ? 1 : 0)
            formData.append('PatMetaOtroDescripcion', $("#txtDescripcionOtroMetabolicaPat").val())
            formData.append('PatCardioHipertenArterial', $('#chkHiperArterialPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioAsma', $('#chkAsmaPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioFibrosisPulmonar', $('#chkFibrosisPulmPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioEnfPulmonarObstructivaCronica', $('#chkPulmObstruPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioCardiopatiaCongenita', $('#chkCardioConPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioInsuficienciaCardiaca', $('#chkInsuCardPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioNinguna', $('#chkCardiorespiratoriaNingunaPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioOtro', $('#chkOtroCardioPat').is(':checked') ? 1 : 0)
            formData.append('PatCardioOtroDescripcion', $("#txtDescripcionOtroCardioPat").val())
            formData.append('PatNeuroEnfCerebrovascular', $('#chkEnfCerebrovascularPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroEpilepsia', $('#chkEpilepsiaPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroSdGuillainBarre', $('#chkSdGuillanBarrePat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroEncefaHipoxicaPostRCP', $('#chkEncefalopatiaHipoxicaPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroELA', $('#chkELAPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroAusenciaExtremidad', $('#chkAusenciaExtremidadPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroNinguna', $('#chkNeurologicaNingunaPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroOtro', $('#chkOtroNeuroPat').is(':checked') ? 1 : 0)
            formData.append('PatNeuroOtroDescripcion', $("#txtDescripcionOtroNeuroPat").val())
            formData.append('PatReumaLupusEritematoso', $('#chkLupusEritematosoPat').is(':checked') ? 1 : 0)
            formData.append('PatReumaArtritisReumatoide', $('#chkArtritisReumatoidePat').is(':checked') ? 1 : 0)
            formData.append('PatReumaSindromeAntifosfolipidico', $('#chkSindromeAntifosPat').is(':checked') ? 1 : 0)
            formData.append('PatReumaCancer', $('#chkCancerPat').is(':checked') ? 1 : 0)
            formData.append('PatReumaTrasplante', $('#chkTrasplantePat').is(':checked') ? 1 : 0)
            formData.append('PatReumaNinguna', $('#chkReumaticaNingunaPat').is(':checked') ? 1 : 0)
            formData.append('PatReumaOtro', $('#chkOtroReumaPat').is(':checked') ? 1 : 0)
            formData.append('PatReumaOtroDescripcion', $("#txtDescripcionOtroReumaPat").val())
            formData.append('CirugiasPrevias', $('#rdbCirugiasPreviasQuirurSi').is(':checked') ? 1 : 0)
            formData.append('CirugiasPreviasDescripcion', $("#txtCirugiasPreviasQuirur").val())
            formData.append('FechaUltimaCirugia', $("#txtFechaUltimaCiruQuirur").val())
            formData.append('MedicacionHabitual', $("#txtMedicacionHabitual").val())
            formData.append('AnioUltimaVacunaCovid', $("#txtAnioUltimaVacunaCovid").val())

            /*-------------------------------------------- Motivo Atencion --------------------------------------------*/
            formData.append('Primipaternidad', $('input[name="rdbPrimipaternidad"]:checked').val())
            formData.append('NroGestaciones', $('#txtObstNroGestaciones').val())
            formData.append('NroPartosTermino', $('#txtNroPartosTermino').val())
            formData.append('NroPartosPreTermino', $('#txtNroPartosPreTermino').val())
            formData.append('NGestacionesFrustras', $('#txtNroGestacionesFrustras').val())
            formData.append('NroHijosVivos', $('#txtNroHijosVivos').val())
            formData.append('PeriodoIntergenesico', $('#txtPeriodoIntergenesicoGinecoObst').val())
            formData.append('FUltimaRegla', $('#txtFechaUltimaMensGinecoObst').val())
            formData.append('Cesarea', $('#cboCesareaGinecoObst').val())
            formData.append('FechaUltimaCesarea', $('#txtFechaUltimaCesareaGinecoObst').val())
            formData.append('Menos2500g', $('#ch2500').is(':checked') ? 1 : 0)
            formData.append('Multiple', $('#chMultiple').is(':checked') ? 1 : 0)
            formData.append('Menos37S', $('#ch37Sem').is(':checked') ? 1 : 0)
            formData.append('Mayor4000g', $('#ch4000g').is(':checked') ? 1 : 0)
            formData.append('Obito', $('#chObito').is(':checked') ? 1 : 0)
            formData.append('AntecedenteEnfermedadHipertensivaEmbarazo', $('#cboAnteEnfHipertenEmbarazoGinecoObst').val())
            /*-------------------------------------------- End Motivo Atencion --------------------------------------------*/

            /*-------------------------------------------- Motivo Atencion --------------------------------------------*/
            formData.append('CondicionIngreso', $('#cboCondicionIngreso').val())
            formData.append('EdadGestacionalFinalSemanas', $('#txtEdadGestacionalSemanas').val())
            formData.append('EdadGestacionalFinalDias', $('#txtEdadGestacionalDias').val())
            formData.append('TipoParto', $('#cboTipoParto').val())
            formData.append('CondicionProducto', $('#cboCondicionProducto').val())
            formData.append('TiempoEnfermedadDias', $('#txtTiempoEnfermedadDias').val())
            formData.append('TiempoEnfermedadHoras', $('#txtTiempoEnfermedadHoras').val())
            formData.append('SOFAPreUCI', $('#txtSofaPreUCI').val())
            formData.append('PrioridadIngresoUCI', $('#cboPrioridadIngresoUCI').val())
            formData.append('TranstornoHipertensivoEmbarazo', $('#cboTranstornoHipertenEmbarazo').val())
            formData.append('TranstornoHipertensivoEmbarazoOtros', $('#txtOtroTranstornoHipertenEmbarazo').val())
            formData.append('OtrasEnfermedadesHipertensivasAfectanEmbarazo', $('#cboOtrasEnfHipertenEmbarazo').val())
            formData.append('OtrasEnfermedadesHipertensivasAfectanEmbarazoOtros', $('#txtOtroOtrasEnfHipertenEmbarazo').val())
            formData.append('Hemorragicas', $('#cboMotivoHemorragicas').val())
            formData.append('Infecciosas', $('#cboMotivoInfeccioso').val())
            formData.append('InfecciosasOtros', $('#txtOtroMotivoInfeccioso').val())
            formData.append('GastroEnterico', $('#cboMotivoGastroEnterico').val())
            formData.append('GastroEntericoOtros', $('#txtOtroMotivoGastroEnterico').val())
            formData.append('Respiratorio', $('#cboMotivoRespiratorio').val())
            formData.append('RespiratorioOtros', $('#txtOtroMotivoRespiratorio').val())
            formData.append('EndocrinoMetabolico', $('#cboMotivoEndocrinoMetabolico').val())
            formData.append('EndocrinoMetabolicoOtros', $('#txtOtroMotivoEndocrinoMetabolico').val())
            formData.append('Cardiovascular', $('#cboMotivoCardiovascular').val())
            formData.append('CardiovascularOtros', $('#txtOtroMotivoCardiovascular').val())
            formData.append('CirugiaIntrauterina', $('#cboMotivoCirugiaIntrauterina').val())
            formData.append('Quirurgicas', $('#cboMotivoQuirurgicas').val())
            formData.append('Traumatismo', $('#cboMotivoTraumatismo').val())

            /*-------------------------------------------- End Motivo Atencion --------------------------------------------*/

            /*-------------------------------------------- Examen Fisico --------------------------------------------*/
            formData.append('Ectoscopia', $('#txtEFisicoEctoscopia').val())
            formData.append('ExamenNeurologico', $('#txtEFisicoNeurologico').val())
            formData.append('EscalaGlasgow', $('#txtEFisicoEscalaGlasgow').val())
            formData.append('NivelConciencia', $('#cboEFisicoNivelConciencia').val())
            formData.append('Delirio', $('#cboEFisicoDelirio').val())
            formData.append('EscalaSedacion', $('#txtEFisicoEscalaSedacion').val())
            formData.append('MonitoreoSedacionBISS', $('#txtEFisicoBISS').val())
            formData.append('FuerzaMuscular', $('#cboEFisicoFMS').val())
            formData.append('NeurologicoReflejo4', $('#cboEFisicoReflejoNeuro').val())
            formData.append('EscalaDolor', $('#txtEFisicoEscalaDolor').val())
            formData.append('EvaluacionCardiovascular', $('#txtEFisicoCardioEvaluacionCardiovascular').val())
            formData.append('RitmoCardiaco', $('#cboEFisicoRitmocardiaco').val())
            formData.append('TipoRitmoCardiaco', $('#txtEFisicoTipoRitmocardiaco').val())
            formData.append('IndiceShock', $('#txtEFisicoCardioIShock').val())
            formData.append('GastoCardiacoNoinvasivo', $('#txtEFisicoCardioGCNoInva').val())
            formData.append('IndiceCardiaco', $('#txtEFisicoCardioIndiceCardiaco').val())
            formData.append('ExamenRespiratorio', $('#txtEFisicoRespiratorioExamenResp').val())
            formData.append('ManejoViaAerea', $('#cboEFisicoRespManejoViaAerea').val())
            formData.append('TipoSoporteOxigenatorioVentilatorio', $('#cboEFisicoRespSoporteVentilatorio').val())
            formData.append('FraccionInspiratoriaO2', $('#txtEFisicoRespFIO').val())
            formData.append('SaturacionOxigenoFio2', $('#txtEFisicoSoFio2').val())
            formData.append('IndiceKirbyPaO2FiO2', $('#txtEFisicoIndiceKirby').val())
            formData.append('IndiceRox', $('#txtEFisicoIndiceRox').val())
            formData.append('IndiceOxigenatorio', $('#txtEFisicoIOxigenatorio').val())
            formData.append('PresionMediaViaAerea', $('#txtEFisicoPMedViaArea').val())
            formData.append('RadiografiaToraxPatologica', $('#cboEFisicoRadioTorax').val())
            formData.append('CuadrantesAfectados', $('#txtEFisicoCuadrantesAfectados').val())

            formData.append('EstudioPorImagenes', $('#rdbEstudioPorImagenesSi').is(':checked') ? 1 : 0)
            formData.append('Hallazgos', $('#rdbHallazgosSi').is(':checked') ? 1 : 0)

            formData.append('RadioToraxDescripcion', $('#txtEFisicoRadioToraxDescripcion').val())
            formData.append('EcografiaPulmonarHallazgoSliding', $('#cboEFisicoEcoPulmonar').val())
            formData.append('PerfilEcografico', $('#txtEFisicoPerfilEcografico').val())
            formData.append('TomografiaToracicaPatologica', $('#cboEFisicoTomToracicaPatologica').val())
            formData.append('TomografiaTorax', $('#txtEFisicoTomografiaTorax').val())
            formData.append('OtroEstudio', $('#cboEFisicoEstudioImagenesOtro').val())
            formData.append('OtroEstudioDescripcion', $('#txtEFisicoEstudioImagenesOtroDescripcion').val())
            formData.append('Neumotorax', $('#cboEFisicoNeumotorax').val())
            formData.append('SindromeDistresRespiratorio', $('#cboEFisicoSDRA').val())
            formData.append('GradoDistresRespiratorio', $('#cboEFisicoGDRA').val())
            formData.append('DrenajeToracicoSistemaSimple', $('#chkDrenajeToracicoSistemaSimple').is(':checked') ? 1 : 0)
            formData.append('DrenajeToracicoSistemaTresCamaras', $('#chkDrenajeToracicoSistemaTresCamaras').is(':checked') ? 1 : 0)
            formData.append('PresionNegativaContinua', $('#chkPresionNegativaContinua').is(':checked') ? 1 : 0)
            formData.append('OtroDispositivo', $('#chkOtroDispositivo').is(':checked') ? 1 : 0)
            formData.append('DescripcionOtroDispositivo', $('#txtDescripcionOtroDispositivo').val())
            formData.append('ExamenAbdominal', $('#txtEFisicoAbdomenExamenAbdominal').val())
            formData.append('Incisiones', $('#cboEAbdomenIncisiones').val())
            formData.append('AfectacionesActuales', $('#cboEAbdomenAceptacion').val())
            formData.append('DrenajeAbdominal', $('#rdbDrenajeAbdominalSi').is(':checked') ? 1 : 0)
            formData.append('DrenajeAbdominalDescripcion', $('#txtDrenajeAbdominal').val())
            formData.append('SondaNasogastrica', $('#rdbSondaNasogastricaSi').is(':checked') ? 1 : 0)
            formData.append('SondaNasogastricaDescripcion', $('#txtSondaNasogastrica').val())
            formData.append('BolsaLaparotomia', $('#rdbBolsaLaparotomiaSi').is(':checked') ? 1 : 0)
            formData.append('BolsaLaparotomiaDescripcion', $('#txtBolsaLaparotomia').val())
            formData.append('Vac', $('#rdbVacSi').is(':checked') ? 1 : 0)
            formData.append('VacDescripcion', $('#txtVac').val())
            formData.append('SondaUrinaria', $('#rdbSondaUrinariaSi').is(':checked') ? 1 : 0)
            formData.append('SondaUrinariaDescripcion', $('#txtSondaUrinaria').val())

            formData.append('DispositivoMedicionPIA', $('#rdbDispositivoMedicionPIASi').is(':checked') ? 1 : 0)
            formData.append('DispositivoMedicionPIADescripcion', $('#txtDispositivoMedicionPIA').val())

            formData.append('TaponamientoPelvico', $('#rdbTaponamientoPelvicoSi').is(':checked') ? 1 : 0)
            formData.append('TaponamientoPelvicoDescripcion', $('#txtTaponamientoPelvico').val())

            formData.append('TaponamientoHepatico', $('#rdbTaponamientoHepaticoSi').is(':checked') ? 1 : 0)
            formData.append('TaponamientoHepaticoDescripcion', $('#txtTaponamientoHepatico').val())

            formData.append('OtroInvasivoDispositivo', $('#rdbOtroInvasivoDispositivoSi').is(':checked') ? 1 : 0)
            formData.append('OtroInvasivoDispositivoDescripcion', $('#txtOtroInvasivoDispositivo').val())
            formData.append('PerimetroAbd6h', $('#txtPerimetroAbd6').val())
            formData.append('PIA6h', $('#txtPIA6').val())
            formData.append('PerimetroAbd12h', $('#txtPerimetroAbd12').val())
            formData.append('PIA12h', $('#txtPIA12').val())
            formData.append('PerimetroAbd18h', $('#txtPerimetroAbd18').val())
            formData.append('PIA18h', $('#txtPIA18').val())
            formData.append('PerimetroAbd24h', $('#txtPerimetroAbd24').val())
            formData.append('PIA24h', $('#txtPIA24').val())
            formData.append('Gastrocineticos', $('#chkEAbdomenGastrocineticos').is(':checked') ? 1 : 0)
            formData.append('Deposiciones', $('#txtDeposiciones').val())
            formData.append('ExamenUrinarioRenal', $('#txtEFisicoExamenUrinarioRenal').val())
            formData.append('Diuresis6H', $('#txtDiuresis6').val())
            formData.append('Diuresis12H', $('#txtDiuresis12').val())
            formData.append('Diuresis24H', $('#txtDiuresis24').val())
            formData.append('Diuretico', $('#chkUrinarioDiuretico').is(':checked') ? 1 : 0)
            formData.append('NombreDiuretico', $('#txtUrinarioNombreDiuretico').val())
            formData.append('DosisDiuretico', $('#cboUrinarioDiureticoDosis').val())
            formData.append('DescripcionDosisDiuretico', $('#txtUrinarioOtraDiureticoDosis').val())
            formData.append('TerapiaReemplazoRenal', $('#cboUrinarioTRR').val())
            formData.append('NroSesion', $('#txtUrinarioNroSesion').val())
            formData.append('Ultrafiltrado', $('#txtUrinarioUltrafiltrado').val())
            formData.append('ExamenPielFaneras', $('#txtEFisicoExamenPielFaneras').val())
            formData.append('EdemaPielFaneras', $('#cboPielFanerasEdema').val())
            formData.append('LesionPorPresion', $('#rdbLesionPorPresionSi').is(':checked') ? 1 : 0)
            formData.append('GradoPielFaneras', $('#cboPielGradoLesionPresion').val())
            formData.append('UbicacionPielFaneras', $('#cboPielLesionPresionUbicacion').val())
            formData.append('LesionPorHumedad', $('#rdbLesionPorHumedadSi').is(':checked') ? 1 : 0)
            formData.append('GradoLesionPorHumedad', $('#cboPielGradoLesionHumedad').val())
            formData.append('UbicacionLesionPorHumedad', $('#txtPielLesionHumedadUbicacion').val())
            formData.append('SignosHipoperfusionNinguno', $('#chkSignosHipoperfusionNinguno').is(':checked') ? 1 : 0)
            formData.append('SignosHipoperfusionAcrocianosis', $('#chkSignosHipoperfusionAcrocianosis').is(':checked') ? 1 : 0)
            formData.append('SignosHipoperfusionMoteado', $('#chkSignosHipoperfusionMoteado').is(':checked') ? 1 : 0)
            formData.append('SignosHipoperfusionFrialdadDistal', $('#chkSignosHipoperfusionFrialdadDistal').is(':checked') ? 1 : 0)
            formData.append('SignosHipoperfusionLlenadoCapilar', $('#chkSignosHipoperfusionLlenadoCapilar').is(':checked') ? 1 : 0)
            formData.append('ExamenExtremidades', $('#txtEFisicoExamenExtremidades').val())
            formData.append('ExamenColumna', $('#cboEFisicoExamenColumna').val())
            formData.append('ExamenGinecologico', $('#txtDescripcionExamenGinecologico').val())
            formData.append('GlandulaMamaria', $('#cboEGinecoGlandulaMamaria').val())
            formData.append('LCF', $('#textEGinecoLFC').val())
            formData.append('MOVFETALES', $('#textEGinecoMovFetales').val())
            formData.append('Utero', $('#cboEGinecoUtero').val())
            formData.append('GEyBUS', $('#rdbGEyBUSSi').is(':checked') ? 1 : 0)
            formData.append('GEyBUSDescripcion', $('#txtGEyBUS').val())
            formData.append('Vagina', $('#rdbVaginaSi').is(':checked') ? 1 : 0)
            formData.append('VaginaDescripcion', $('#txtVagina').val())
            formData.append('Cervix', $('#rdbCervixSi').is(':checked') ? 1 : 0)
            formData.append('CervixDescripcion', $('#txtCervix').val())
            formData.append('Utero1', $('#rdbUteroSi').is(':checked') ? 1 : 0)
            formData.append('Utero1Descripcion', $('#txtUtero').val())
            formData.append('Anexos', $('#rdbAnexosSi').is(':checked') ? 1 : 0)
            formData.append('AnexosDescripcion', $('#txtAnexos').val())
            formData.append('FsDouglas', $('#rdbFSDouglasSi').is(':checked') ? 1 : 0)
            formData.append('FsDouglasDescripcion', $('#txtFSDouglas').val())
            formData.append('Parametrios', $('#rdbParametriosSi').is(':checked') ? 1 : 0)
            formData.append('ParametriosDescripcion', $('#txtParametrios').val())
            formData.append('Mamas', $('#rdbMamasSi').is(':checked') ? 1 : 0)
            formData.append('MamasDescripcion', $('#txtMamas').val())
            formData.append('InfeccionComunitaria', $('#rdbInfeccioComunitariaSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionComunitariaDescripcion', $('#txtInfeccioComunitaria').val())
            formData.append('InfeccionIntrahospitalaria', $('#rdbInfeccionIntrahospitalariaSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionIntrahospitalariaDescripcion', $('#txtInfeccionIntrahospitalaria').val())

            formData.append('InfeccionHemocultivo', $('#rdbInfeccionHemocultivoSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionHemocultivoDescripcion', $('#txtInfeccionHemocultivo').val())
            formData.append('InfeccionFechaTomaHemocultivo', $('#txtFechaTomaHemocultivo').val())
            formData.append('InfeccionFechaResultadosHemocultivo', $('#txtFechaResultadosHemocultivo').val())

            formData.append('InfeccionSecrecionBronquial', $('#rdbInfeccionSecrecionBronquialSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionSecrecionBronquialDescripcion', $('#txtInfeccionSecrecionBronquial').val())
            formData.append('InfeccionFechaTomaSecrecionBronquial', $('#txtFechaTomaSecrecionBronquial').val())
            formData.append('InfeccionFechaResultadosSecrecionBronquial', $('#txtFechaResultadosSecrecionBronquial').val())

            formData.append('InfeccionOrina', $('#rdbInfeccionOrinaSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionOrinaDescripcion', $('#txtInfeccionOrina').val())
            formData.append('InfeccionFechaTomaOrina', $('#txtFechaTomaOrina').val())
            formData.append('InfeccionFechaResultadosOrina', $('#txtFechaResultadosOrina').val())

            formData.append('InfeccionHeces', $('#rdbInfeccionHecesSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionHecesDescripcion', $('#txtInfeccionHeces').val())
            formData.append('InfeccionFechaTomaHeces', $('#txtFechaTomaHeces').val())
            formData.append('InfeccionFechaResultadosHeces', $('#txtFechaResultadosHeces').val())

            formData.append('InfeccionSecreciones', $('#rdbInfeccionSecrecionesSi').is(':checked') ? 1 : 0)
            formData.append('InfeccionSecrecionesDescripcion', $('#txtInfeccionSecreciones').val())
            formData.append('InfeccionFechaTomaSecreciones', $('#txtFechaTomaSecreciones').val())
            formData.append('InfeccionFechaResultadosSecreciones', $('#txtFechaResultadosSecreciones').val())


            formData.append('sedantes', $('input[name="rdbSedantes"]:checked').val())
            formData.append('analgesicos', $('input[name="rdbAnalgesicos"]:checked').val())
            formData.append('bloqueanteNeuromuscular', $('input[name="rdbBloqueanteNeuromuscular"]:checked').val())

            formData.append('vasodilatador', $('input[name="rdbVasodilatador"]:checked').val())
            formData.append('vasoconstrictor', $('input[name="rdbVasoconstrictor"]:checked').val())
            formData.append('terapiaInfusionRenal', $('input[name="rdbTerapiaInfusionRenal"]:checked').val())

            formData.append('presionArterialMasAlta', $('#txtEFisicoPresionArterialMasAlta').val())
            formData.append('presionArterialMasBaja', $('#txtEFisicoPresionArterialMasBaja').val())

            formData.append('FrecuenciaCardiacaMayor', $('#txtEFisicoFrecuenciaCardiacaMayor').val())
            formData.append('FrecuenciaCardiacaMenor', $('#txtEFisicoFrecuenciaCardiacaMenor').val())


            //formData.append('Cultivos', $('#cboCultivos').val())
            //formData.append('Resultado', $('#txtInfecciosoResultado').val())
            /*-------------------------------------------- End Examen Fisico --------------------------------------------*/

            /*-------------------------------------------- Intervenciones --------------------------------------------*/
            formData.append('CLNA09', $('#chkCLNA09').is(':checked') ? 1 : 0)
            formData.append('Dextrosa5', $('#chkDextrosa5').is(':checked') ? 1 : 0)
            formData.append('Dextrosa10', $('#chkDextrosa10').is(':checked') ? 1 : 0)
            formData.append('Dextrosa33', $('#chkDextrosa33').is(':checked') ? 1 : 0)
            formData.append('Isofundin', $('#chkIsofundin').is(':checked') ? 1 : 0)
            formData.append('RingerLactato', $('#chkRingerLactato').is(':checked') ? 1 : 0)
            formData.append('Plasmalyte', $('#chkPlasmalyte').is(':checked') ? 1 : 0)
            formData.append('POLIGELINA', $('#chkPOLIGELINA').is(':checked') ? 1 : 0)
            formData.append('GELAFUSIN', $('#chkGELAFUSIN').is(':checked') ? 1 : 0)
            formData.append('ALBUMINA20', $('#chkALBUMINA20').is(':checked') ? 1 : 0)
            formData.append('Manitol20', $('#chkManitol20').is(':checked') ? 1 : 0)
            formData.append('AguaDestilada', $('#chkAguaDestilada').is(':checked') ? 1 : 0)
            formData.append('IngresosFluidossvo6h', $('#txtIngresosFluidossvo6h').val())
            formData.append('IngresosFluidossvo12h', $('#txtIngresosFluidossvo12h').val())
            formData.append('IngresosFluidossvo24h', $('#txtIngresosFluidossvo24h').val())
            formData.append('Bh6h', $('#txtInterBh6').val())
            formData.append('Bh12h', $('#txtInterBh12').val())
            formData.append('Bh24h', $('#txtInterBh24').val())
            /*-------------------------------------------- End Intervenciones --------------------------------------------*/

            /*-------------------------------------------- Examenes Auxiliares --------------------------------------------*/
            formData.append('LeucocitosNumero', $('#txtAuxLeucocitoNumero').val())
            formData.append('Neutrofilos', $('#txtAuxNeutrofilos').val())
            formData.append('Abastonados', $('#txtAuxAbastonado').val())
            formData.append('Linfocitos', $('#txtAuxLinfocitos').val())
            formData.append('Hemoglobina', $('#txtAuxHemoglobina').val())
            formData.append('Hematocrito', $('#txtAuxHematocrito').val())
            formData.append('Plaquetas', $('#txtAuxPlaquetas').val())
            formData.append('Glucosa', $('#txtAuxGlucosa').val())
            formData.append('Urea', $('#txtAuxUrea').val())
            formData.append('Creatinina', $('#txtAuxCreatinina').val())
            formData.append('Albumina', $('#txtAuxAlbumina').val())
            formData.append('Globulina', $('#txtAuxGlobulina').val())
            formData.append('BilirrubinaTotal', $('#txtAuxBilirrubinaTotal').val())
            formData.append('BilirrubinaDirecta', $('#txtAuxBilirrubinaDirecta').val())
            formData.append('FosfatasaAlcalina', $('#txtAuxFosfatasaAlcalina').val())
            formData.append('TGO', $('#txtAuxTGO').val())
            formData.append('TGP', $('#txtAuxTGP').val())
            formData.append('LactatoDeshidrogenasa', $('#txtAuxLactatoDeshidrogenasa').val())
            formData.append('Magnesio', $('#txtAuxMagnesio').val())
            formData.append('Fosforo', $('#txtAuxFosforo').val())
            formData.append('CalcioSerico', $('#txtAuxCalcioSerico').val())
            formData.append('IndiceAlbumina', $('#txtAuxIndiceAlbumina').val())
            formData.append('IndiceGlobulina', $('#txtAuxIndiceGlobulina').val())
            formData.append('PresiónOncoticaPo', $('#txtAuxPresionOncoticaPo').val())
            formData.append('IndiceDeBriones', $('#txtAuxIndiceBriones').val())
            formData.append('TiempoDeProtrombina', $('#txtAuxTiempoProtrombina').val())
            formData.append('TiempoParcialDeTromboplastinaActivada', $('#txtAuxTTPA').val())
            formData.append('Fibrinogeno', $('#txtAuxFibrinogeno').val())
            formData.append('DímeroD', $('#txtAuxDimeroD').val())
            formData.append('MarcadoresInflamatorios', $('#txtAuxMarcadoresInflamatorios').val())
            formData.append('ProteinaCReactiva', $('#txtAuxProteinaCReactiva').val())
            formData.append('Procalcitonina', $('#txtAuxProcalcitonina').val())
            formData.append('PH', $('#txtAuxPH').val())
            formData.append('PresionParcialDeCO2', $('#txtAuxPCO2').val())
            formData.append('BicarbonatoDeSodio', $('#txtAuxHCO3').val())
            formData.append('ExcesoDeBase', $('#txtAuxBE').val())
            formData.append('Lactato', $('#txtAuxLactato').val())
            formData.append('Sodio', $('#txtAuxSodio').val())
            formData.append('Potasio', $('#txtAuxPotasio').val())
            formData.append('Cloro', $('#txtAuxCloro').val())
            formData.append('Calcio', $('#txtAuxCalcio').val())
            formData.append('GradienteAlveoloArterialDeO2', $('#txtAuxGAa').val())
            formData.append('po2', $('#txtAuxPO2').val())
            /*-------------------------------------------- END Examenes Auxiliares --------------------------------------------*/

            /*----------------------------------------------- Apreciacion Plan ----------------------------------------------*/
            formData.append('DisfuncionesNinguno', $('#chkDisfuncionesNinguno').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesRespiratorio', $('#chkDisfuncionesRespiratorio').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesHematologico', $('#chkDisfuncionesHematologico').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesRenal', $('#chkDisfuncionesRenal').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesHepatico', $('#chkDisfuncionesHepatico').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesNeurologico', $('#chkDisfuncionesNeurologico').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesMetabolico', $('#chkDisfuncionesMetabolico').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesUterina', $('#chkDisfuncionesUterina').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesCardiovascular', $('#chkDisfuncionesCardiovascular').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesGastrointestinal', $('#chkDisfuncionesGastrointestinal').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesOtro', $('#chkDisfuncionesOtros').is(':checked') ? 1 : 0)
            formData.append('DisfuncionesOtroDescripcion', $('#txtDisfuncionesOtros').val())

            formData.append('SignosSintomasCefaleaHolocraneana', $('#chkMotivoCefaleaHolocraneana').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasCefaleaFocalizada', $('#chkMotivoCefaleaFocalizada').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasEscotomas', $('#chkMotivoEscotomas').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasTinitus', $('#chkMotivoTinitus').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasVisionBorrosa', $('#chkMotivoVisionBorrosa').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasDesorientacionDelirio', $('#chkMotivoDesorientacionDelirio').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasConvulsiones', $('#chkMotivoConvulsiones').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasDisnea', $('#chkMotivoDisnea').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasNauseasVomitos', $('#chkMotivoNauseaVomito').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasEpigastralgia', $('#chkMotivoEpigastralgia').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasDolorHipocondrioDerecho', $('#chkMotivoDolorHipocondrioDerecho').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasDolorAbdominalDifuso', $('#chkMotivoDolorAbdominal').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasContraccionesAnormales', $('#chkMotivoContraccionesAnormales').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasEdema', $('#chkMotivoEdema').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasOrinaEspumosa', $('#chkMotivoOrinaEspumosa').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasAlteracionesUrinarias', $('#chkMotivoAlteracionesUrinarias').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasPerdidaliquidoAmniotico', $('#chkMotivoPerdidaLiquidoAmniotico').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasSangradoVaginal', $('#chkMotivoSangradoVaginal').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasOtroDolorLocalizado', $('#chkMotivoOtroDolorFocalizado').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasDolorGeneralizado', $('#chkMotivoDolorGeneralizado').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasFiebre', $('#chkMotivoFiebre').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasOtro', $('#chkMotivoOtrosSignosYSintomas').is(':checked') ? 1 : 0)
            formData.append('SignosSintomasOtroDescripcion', $('#txtMotivoOtrosSignosYSintomas').val())
            formData.append('RelatoCronologico', $('#txtRelatoCronologico').val())

            formData.append('ComentarioApreciacionEvaluacion', $('#txtComentarioApreciacionEvaluacion').val()) // terminar de ingresar el lunes
            formData.append('PlanEvaluacion', $('#txtPlanEvaluacion').val())
            formData.append('ExamenImagenologico', $('#cboExamenImagenologico').val())
            formData.append('ExamenLaboratorial', $('#cboExamenLaboratorial').val())

            formData.append('DescripcionExamenImagenologico', $('#txtExamenImagenologico').val())
            formData.append('DescripcionExamenLaboratorial', $('#txtExamenLaboratorial').val())

            formData.append('MotivoEvaluacionUCI', $('#txtMotivoEvaluacionUCI').val())
            formData.append('MedicoComentarioEvaluacion', $('#cboMedicoComentarioEvaluacion').val())
            formData.append('DestinoComentarioEvaluacion', $('#cboDestinoComentarioEvaluacion').val())
            formData.append('FechaAltaPlanApreciacion', $('#txtFechaAltaPlanApreciacion').val())
            /*-------------------------------------------- END Apreciacion Plan --------------------------------------------*/

            /*-------------------------------------------- Monitoreo Avanzado --------------------------------------------*/
            formData.append('Fecha', $('#txtFechaMonitoreoAvanzado').val());
            formData.append('Hora', $('#txtHoraMonitoreoAvanzado').val());
            //formData.append('VentiladorMecanicoMarca', $('#txtVmMarca').val());
            //formData.append('FechaInicioVM', $('#txtFechaInicioVm').val());
            //formData.append('FechaTerminaVM', $('#txtFechaUltimoVm').val());
            //formData.append('ModoVentilatorioConvencional', $('#cboModoVentConvencional').val());
            //formData.append('ModoVentilatorioNoConvencional', $('#txtModoVentNoConvencional').val());
            //formData.append('FraccionInspiratoriaO2', $('#txtFiO2Ma').val());
            //formData.append('VolumenTidal', $('#txtVolTMa').val());
            //formData.append('PresionInspiratoria', $('#txtPInspMa').val());
            //formData.append('PresionInspiratoriaPico', $('#txtPpicoMa').val());
            //formData.append('PresionFinalEspiracion', $('#txtPEEPMa').val());
            //formData.append('FrecuenciaRespiratoriaProgramada', $('#txtFRMa').val());
            //formData.append('Flujo', $('#txtFlujoMa').val());
            //formData.append('PresionMediaViaAerea', $('#txtPMediaMa').val());
            //formData.append('VolumenMinuto', $('#txtVolMinMa').val());
            //formData.append('PresionSoporte', $('#txtPSMa').val());
            //formData.append('ComplianceEstatica', $('#txtComplianceEstaticaMa').val());
            //formData.append('ComplianceDinamica', $('#txtComplianceDinamicaMa').val());
            //formData.append('ResistenciaViaAerea', $('#txtResistenciaViaAreaMa').val());
            //formData.append('DiferenciaPresiones', $('#txtDPMa').val());
            //formData.append('PresionParcialOxigeno', $('#txtPO2Ma').val());
            //formData.append('IndiceOxigenatorio', $('#txtIOxigenatorioMa').val());
            //formData.append('MurrayScore', $('#txtMurrayScoreMa').val());
            //formData.append('CantidadCO2EnAireExhalado', $('#txtETCO2Ma').val());
            formData.append('PeepMaxSinReclutamiento', $('#txtPeepMaxSinReclutamientoMa').val());
            formData.append('Pronacion', $('#chkPronacionMa').is(':checked') ? 1 : 0);
            formData.append('HorasPrePronacion', $('#txtHrsPreProMa').val());
            formData.append('NroCicloProno', $('#txtNCicloPronoMa').val());
            formData.append('Reclutamiento', $('#chkReclutamientoMa').is(':checked') ? 1 : 0);
            formData.append('PeepMaxConReclutamiento', $('#txtPEEPMaxReclutamientoMa').val());
            formData.append('TitulacionPeep', $('#chkTitulacionPEEPMa').is(':checked') ? 1 : 0);
            /*-------------------------------------------- END Monitoreo Avanzado --------------------------------------------*/


            formData.append('lstOtrasPatologias', JSON.stringify(oTable_OtrasPatologias.api(true).data().toArray()));

            formData.append('lstSedantes', JSON.stringify(oTable_NeurologicoSedantes.api(true).data().toArray()));
            formData.append('lstAnalgesicos', JSON.stringify(oTable_NeurologicoAnalgesicos.api(true).data().toArray()));
            formData.append('lstBloqueanteNeuromuscular', JSON.stringify(oTable_NeurologicoRelajanteNeuromuscular.api(true).data().toArray()));
            formData.append('lstVasodilatador', JSON.stringify(oTable_CardioVasodilatador.api(true).data().toArray()));
            formData.append('lstVasoconstrictor', JSON.stringify(oTable_CardioVasoconstrictor.api(true).data().toArray()));

            formData.append('lstHemoderivados', JSON.stringify(oTable_IntervencionesHemoderivado.api(true).data().toArray()));
            formData.append('lstCorticoides', JSON.stringify(oTable_IntervencionesCorticoide.api(true).data().toArray()));
            formData.append('lstFluidoterapia', JSON.stringify(oTable_IntervencionesFluidoterapia.api(true).data().toArray()));

            formData.append('lstAccesosVasculares', JSON.stringify(oTable_AccesosVasculares.api(true).data().toArray()));

            formData.append('lstDiagnosticos', JSON.stringify(Diagnosticos.DevolverDiagnosticos().toArray()));


            formData.append('IdServicio', RegistroEvaluacionesUCI.IdServicio)
            formData.append('IdAtencionDetalleUCI', RegistroEvaluacionesUCI.IdAtencionDetalleUCI)
            formData.append('NroEvaluacion', RegistroEvaluacionesUCI.nroEvaluacion)

            formData.append('FechaEvaluacion', $('#FechaInicioAtencion').val())
            formData.append('HoraEvaluacion', $('#HoraInicioAtencion').val())

            formData.append('ImpresionDiagnostica', $('#txtImpresionDiagnostica').val())
            formData.append('Tratamiento', $('#txtTratamiento').val())
            formData.append('Sofa', $('#txtDatoCalculadoSOFA').val())

            formData.append('idCuenta', RegistroEvaluacionesUCI.idCuentaAtencion)

            await HttpClient.Post('/EvaluacionesUCI/CrearModificarAtencionesEvaluacionUCI?area=Comun', formData)
                .then(async res => {
                    if (!isEmpty(res)) {
                        if (res.estado) {

                            RegistroEvaluacionesUCI.idAtencionUCI = res.data.value.idAtencionUCI
                            RegistroEvaluacionesUCI.IdAtencionDetalleUCI = res.data.value.idAtencionDetalleUCI

                            await RegistroEvaluacionesUCI.GuardarTriajeHospEmeg(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.IdServicio, RegistroEvaluacionesUCI.nroEvaluacion)
                            console.log('res detalle uci', res)
                            const pdf = await Utilitario.GenerarHojaInformeUCI(RegistroEvaluacionesUCI.idCuentaAtencion, RegistroEvaluacionesUCI.idAtencion, res.data.value.idAtencionDetalleUCI, RegistroEvaluacionesUCI.IdServicio, RegistroEvaluacionesUCI.nroEvaluacion);

                            //==========COMENTADO POR KHOYOSI (PARA EL CONTROL DEL FLUJO DE EMISION DE RECETAS)===================//
                            //if (pdf) {
                            //    alerta('1', 'Se generó el documento correctamente.')
                            //    //$("#btnBuscarAtenciones").click();
                            //} else {
                            //    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                            //}

                            //swal({
                            //    title: 'Evaluaciones UCI',
                            //    text: 'Registro Satisfactorio',
                            //    type: 'info',
                            //}).done();

                            //RegistroEvaluacionesUCI.LimpiarCampos()
                            //MostrarAreaLista();
                            //ReposicionarVista();
                            //CerrarModulo();
                            //$('#btnBuscarAtenciones').click()
                            //==================================================//

                            //=====================KHOYOSI===============================================//



                            let nuevaEval = RegistroEvaluacionesUCI.nuevaEvaluacion;

                            let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencionUCI)

                            oTable_Evaluaciones.fnClearTable()

                            if (!isEmpty(evaluacionesUCI)) {
                                if (evaluacionesUCI.length > 0) {
                                    oTable_Evaluaciones.fnAddData(evaluacionesUCI)
                                    //oTable_Evaluaciones.$('tr.selected').removeClass('selected');
                                    $('#tblEvaluaciones tbody').find('tr').eq(RegistroEvaluacionesUCI.nroEvaluacion - 1).addClass("selected");

                                    var objrowTb = oTable_Evaluaciones.api(true).row('.selected').data();

                                    RegistroEvaluacionesUCI.SeleccionarEvaluacion(objrowTb)

                                    OrdenMedica.nroEvaluaciones = evaluacionesUCI.length;


                                }
                            }

                            //EvaluacionesUCI.CargarEvaluacionDetalle(RegistroEvaluacionesUCI.nroEvaluacion); 
                            if (nuevaEval == true) {
                                swal({
                                    title: 'EVALUACIÓN UCI',
                                    text: "La evaluación se guardó correctamente. <br><br>¿Desea generar una receta/orden médica?",
                                    type: 'success',
                                    allowOutsideClick: false,
                                    showCancelButton: true,
                                    confirmButtonColor: '#4fb7fe',
                                    cancelButtonColor: '#6c6c6c',
                                    confirmButtonText: 'Si',
                                    cancelButtonText: 'No',
                                }).then(async function (result) {
                                    if (result.isConfirmed) {

                                        $('.nav-tabs a[href="#ordenes-tab"]').tab('show');
                                        $('#btnAgregarOrdenMedica').click();
                                    }
                                    //let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencionUCI)

                                    //if (!isEmpty(evaluacionesUCI)) {
                                    //    if (evaluacionesUCI.length > 0) {
                                    //        oTable_Evaluaciones.fnAddData(evaluacionesUCI)
                                    //    }
                                    //}
                                }, async function (dimiss) {
                                    //let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencionUCI)

                                    //if (!isEmpty(evaluacionesUCI)) {
                                    //    if (evaluacionesUCI.length > 0) {
                                    //        oTable_Evaluaciones.fnAddData(evaluacionesUCI)
                                    //    }
                                    //}
                                });
                            } else {
                                alerta2('success', 'EVALUACIÓN UCI', 'La evaluación se guardó correctamente.');
                                //let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencionUCI)

                                //if (!isEmpty(evaluacionesUCI)) {
                                //    if (evaluacionesUCI.length > 0) {
                                //        oTable_Evaluaciones.fnAddData(evaluacionesUCI)
                                //    }
                                //}
                            }
                            //============================================================================//


                            Cargando(0)
                        } else {
                            alerta('3', 'Error: ' + res.msg)
                            return null
                        }
                    }

                })
                .catch((e) => {
                    alerta(3, 'Algo salio mal ' + e)
                    Cargando(0)
                    return null
                })




        })

        $('#btnAgregarSedantes').on('click', function () {

            if ($('#cboEFisicoSedantes').val() == 0 || $('#cboEFisicoSedantesMed').val() == 0 || $('#txtEFisicoSedantesDosis').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtEFisicoSedantesDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idItem: $('#cboEFisicoSedantes').val(),
                descripcion: $('#cboEFisicoSedantes').val() == 99 ? $('#txtEFisicoSedantesOtros').val() : $('#cboEFisicoSedantes option:selected').text(),
                idMedida: $('#cboEFisicoSedantesMed').val(),
                medida: $('#cboEFisicoSedantesMed').val() == 99 ? $('#txtEFisicoSedantesMedOtros').val() : $('#cboEFisicoSedantesMed option:selected').text(),
                dosis: $('#txtEFisicoSedantesDosis').val(),
                velocidad: $('#txtEFisicoSedantesVelocidad').val()
            }
            oTable_NeurologicoSedantes.api(true).row.add(objRow).draw(false);

            $('#txtEFisicoSedantesDosis').val('')
            $('#txtEFisicoSedantesVelocidad').val('')
        })
        $('#btnQuitarSedantes').on('click', function () {
            let objRow = oTable_NeurologicoSedantes.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_NeurologicoSedantes.api(true).row('.selected').remove().draw(false);
            }
        })


        $('#btnAgregarAnalgesicos').on('click', function () {

            if ($('#cboEFisicoAnalgesicos').val() == 0 || $('#cboEFisicoAnalgesicosMed').val() == 0 || $('#txtEFisicoAnalgesicosDosis').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtEFisicoAnalgesicosDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idItem: $('#cboEFisicoAnalgesicos').val(),
                descripcion: $('#cboEFisicoAnalgesicos').val() == 99 ? $('#txtEFisicoAnalgesicosOtros').val() : $('#cboEFisicoAnalgesicos option:selected').text(),
                idMedida: $('#cboEFisicoAnalgesicosMed').val(),
                medida: $('#cboEFisicoAnalgesicosMed').val() == 99 ? $('#txtEFisicoAnalgesicosMedOtros').val() : $('#cboEFisicoAnalgesicosMed option:selected').text(),
                dosis: $('#txtEFisicoAnalgesicosDosis').val(),
                velocidad: $('#txtEFisicoAnalgesicosVelocidad').val()
            }
            oTable_NeurologicoAnalgesicos.api(true).row.add(objRow).draw(false);

            $('#txtEFisicoAnalgesicosDosis').val('')
            $('#txtEFisicoAnalgesicosVelocidad').val('')
        })
        $('#btnQuitarAnalgesicos').on('click', function () {
            let objRow = oTable_NeurologicoAnalgesicos.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_NeurologicoAnalgesicos.api(true).row('.selected').remove().draw(false);
            }
        })


        $('#btnAgregarRelajanteNeuromuscular').on('click', function () {

            if ($('#cboEFisicoRNM').val() == 0 || $('#cboEFisicoRNMMed').val() == 0 || $('#txtEFisicoRNM').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtEFisicoRNM').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idItem: $('#cboEFisicoRNM').val(),
                descripcion: $('#cboEFisicoRNM').val() == 99 ? $('#txtEFisicoRNMOtros').val() : $('#cboEFisicoRNM option:selected').text(),
                idMedida: $('#cboEFisicoRNMMed').val(),
                medida: $('#cboEFisicoRNMMed').val() == 99 ? $('#txtEFisicoRNMMedOtros').val() : $('#cboEFisicoRNMMed option:selected').text(),
                dosis: $('#txtEFisicoRNM').val(),
                velocidad: $('#txtEFisicoRNMVelocidad').val()
            }
            oTable_NeurologicoRelajanteNeuromuscular.api(true).row.add(objRow).draw(false);

            $('#txtEFisicoRNM').val('')
            $('#txtEFisicoRNMVelocidad').val('')
        })
        $('#btnQuitarRelajanteNeuromuscular').on('click', function () {
            let objRow = oTable_NeurologicoRelajanteNeuromuscular.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_NeurologicoRelajanteNeuromuscular.api(true).row('.selected').remove().draw(false);
            }
        })


        $('#btnAgregarVasodilatador').on('click', function () {
            if ($('#cboEFisicoCardioVasodilatador').val() == 0 || $('#cboEFisicoCardioVasodilatadorMed').val() == 0 || $('#txtEFisicoCardioVasodilatadorDosis').val() == '' || $('#txtEFisicoCardioVasodilatadorVelocidad').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtEFisicoCardioVasodilatadorVelocidad').val() <= 0) {
                alerta(2, 'La velocidad tiene que ser mayor a cero')
                return false
            }

            if ($('#txtEFisicoCardioVasodilatadorDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idItem: $('#cboEFisicoCardioVasodilatador').val(),
                descripcion: $('#cboEFisicoCardioVasodilatador').val() == 99 ? $('#txtEFisicoCardioVasodilatadorOtros').val() : $('#cboEFisicoCardioVasodilatador option:selected').text(),
                idMedida: $('#cboEFisicoCardioVasodilatadorMed').val(),
                medida: $('#cboEFisicoCardioVasodilatadorMed').val() == 99 ? $('#txtEFisicoCardioVasodilatadorMedOtros').val() : $('#cboEFisicoCardioVasodilatadorMed option:selected').text(),
                dosis: $('#txtEFisicoCardioVasodilatadorDosis').val(),
                velocidad: $('#txtEFisicoCardioVasodilatadorVelocidad').val()
            }
            oTable_CardioVasodilatador.api(true).row.add(objRow).draw(false);
        })
        $('#btnQuitarVasodilatador').on('click', function () {
            let objRow = oTable_CardioVasodilatador.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_CardioVasodilatador.api(true).row('.selected').remove().draw(false);
            }
        })

        $('#btnAgregarVasoconstrictor').on('click', function () {

            if ($('#cboEFisicoCardioVasoconstrictor').val() == 0 || $('#cboEFisicoCardioVasoconstrictorMed').val() == 0 || $('#txtEFisicoCardioVasoconstrictorDosis').val() == '' || $('#txtEFisicoCardioVasoconstrictorVelocidad').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtEFisicoCardioVasoconstrictorVelocidad').val() <= 0) {
                alerta(2, 'La velocidad tiene que ser mayor a cero')
                return false
            }

            if ($('#txtEFisicoCardioVasoconstrictorDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idItem: $('#cboEFisicoCardioVasoconstrictor').val(),
                descripcion: $('#cboEFisicoCardioVasoconstrictor').val() == 99 ? $('#txtEFisicoCardioVasoconstrictorOtros').val() : $('#cboEFisicoCardioVasoconstrictor option:selected').text(),
                idMedida: $('#cboEFisicoCardioVasoconstrictorMed').val(),
                medida: $('#cboEFisicoCardioVasoconstrictorMed').val() == 99 ? $('#txtEFisicoCardioVasoconstrictorMedOtros').val() : $('#cboEFisicoCardioVasoconstrictorMed option:selected').text(),
                dosis: $('#txtEFisicoCardioVasoconstrictorDosis').val(),
                velocidad: $('#txtEFisicoCardioVasoconstrictorVelocidad').val()
            }
            oTable_CardioVasoconstrictor.api(true).row.add(objRow).draw(false);
        })
        $('#btnQuitarVasoconstrictor').on('click', function () {
            let objRow = oTable_CardioVasoconstrictor.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_CardioVasoconstrictor.api(true).row('.selected').remove().draw(false);
            }
        })

        $('#btnAgregarHemoderivado').on('click', function () {

            if ($('#cboIntervencionesTipoHemoderivado').val() == 0 || $('#txtIntervencionesHemoderivadoNroUnidades').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtIntervencionesHemoderivadoNroUnidades').val() <= 0) {
                alerta(2, 'El Nro. de Unidades tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idIntervencionesItem: $('#cboIntervencionesTipoHemoderivado').val(),
                descripcionIntervencionesItem: $('#cboIntervencionesTipoHemoderivado').val() == 99 ? $('#txtIntervencionesTipoHemoderivadoOtros').val() : $('#cboIntervencionesTipoHemoderivado option:selected').text(),
                nroUnidades: $('#txtIntervencionesHemoderivadoNroUnidades').val()
            }
            oTable_IntervencionesHemoderivado.api(true).row.add(objRow).draw(false);

            let total = 0
            let data = oTable_IntervencionesHemoderivado.api(true).data()

            $(data).each((i, obj) => {
                total += parseInt(obj.nroUnidades)
            })

            $('#txtTotalUnidadesHemoderivado').val(total)
        })
        $('#btnQuitarHemoderivado').on('click', function () {
            let objRow = oTable_IntervencionesHemoderivado.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_IntervencionesHemoderivado.api(true).row('.selected').remove().draw(false);
            }
        })

        $('#btnAgregarCorticoide').on('click', function () {
            if ($('#cboIntervencionesCorticoide').val() == 0 || $('#txtIntervencionesCorticoideDosis').val() == '' || $('#txtIntervencionesCorticoideHorario').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtIntervencionesCorticoideDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idIntervencionesItem: $('#cboIntervencionesCorticoide').val(),
                descripcionIntervencionesItem: $('#cboIntervencionesCorticoide option:selected').text(),
                dosis: $('#txtIntervencionesCorticoideDosis').val(),
                horario: $('#txtIntervencionesCorticoideHorario').val()
            }
            oTable_IntervencionesCorticoide.api(true).row.add(objRow).draw(false);
        })
        $('#btnQuitarCorticoide').on('click', function () {
            let objRow = oTable_IntervencionesCorticoide.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_IntervencionesCorticoide.api(true).row('.selected').remove().draw(false);
            }
        })

        $('#btnAgregarFluidoterapia').on('click', function () {
            if ($('#cboIntervencionesFluidoterapia').val() == 0 || $('#txtIntervencionesFluidoterapiaDosis').val() == '' || $('#txtIntervencionesFluidoterapiaVolumen').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            if ($('#txtIntervencionesFluidoterapiaVolumen').val() <= 0) {
                alerta(2, 'eL volumen tiene que ser mayor a cero')
                return false
            }

            if ($('#txtIntervencionesFluidoterapiaDosis').val() <= 0) {
                alerta(2, 'La dosis tiene que ser mayor a cero')
                return false
            }

            var objRow = {
                idIntervencionesItem: $('#cboIntervencionesFluidoterapia').val(),
                descripcionIntervencionesItem: $('#cboIntervencionesFluidoterapia option:selected').text(),
                dosis: $('#txtIntervencionesFluidoterapiaDosis').val(),
                volumen: $('#txtIntervencionesFluidoterapiaVolumen').val()
            }
            oTable_IntervencionesFluidoterapia.api(true).row.add(objRow).draw(false);

            let total = 0
            let data = oTable_IntervencionesFluidoterapia.api(true).data()

            $(data).each((i, obj) => {
                total += parseFloat(obj.volumen)
            })

            $('#txtTotalVolumenFluidoterapia').val(total)
        })
        $('#btnQuitarFluidoterapia').on('click', function () {
            let objRow = oTable_IntervencionesFluidoterapia.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_IntervencionesFluidoterapia.api(true).row('.selected').remove().draw(false);
            }
        })

        $('#btnAgregarAccesoVascular').on('click', function () {

            if ($('#cboEFisicoTipoAccesoVascular').val() == 0 || $('#cboEFisicoUbicacionAccesoVascular').val() == 0 || $('#txtEFisicoDeterminarCambiosAccesosVasculares').val() == '') {
                alerta(2, 'Complete todos los campos para poder agregar un elemento')
                return false
            }

            var objRow = {
                idTipoAcceso: $('#cboEFisicoTipoAccesoVascular').val(),
                tipoAcceso: $('#cboEFisicoTipoAccesoVascular').val() == 99 ? $('#txtEFisicoTipoAccesoVascularOtro').val() : $('#cboEFisicoTipoAccesoVascular option:selected').text(),
                idUbicacion: $('#cboEFisicoUbicacionAccesoVascular').val(),
                ubicacion: $('#cboEFisicoUbicacionAccesoVascular').val() == 99 ? $('#txtEFisicoUbicacionAccesoVascularOtro').val() : $('#cboEFisicoUbicacionAccesoVascular option:selected').text(),
                cambios: $('#txtEFisicoDeterminarCambiosAccesosVasculares').val()
            }
            oTable_AccesosVasculares.api(true).row.add(objRow).draw(false);
        })
        $('#btnQuitarAccesoVascular').on('click', function () {
            let objRow = oTable_AccesosVasculares.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            } else {
                oTable_AccesosVasculares.api(true).row('.selected').remove().draw(false);
            }
        })


        $('#btnAgregarMonitoreoSoporteVentilatorio').on('click', async () => {
            if (RegistroEvaluacionesUCI.IdAtencionDetalleUCI == 0 && RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                alerta(2, 'Selecciona una evaluacion')
                return false
            }

            if ($('#cboNombreEquipoSoporteVentilatorio').val() == 0) {
                alerta(2, 'Selecciona el nombre del equipo')
                return false
            }

            if ($('#txtCantidadSoporteVentilatorio').val() == '') {
                alerta(2, 'La cantidad es obligatoria')
                $('#txtCantidadSoporteVentilatorio').focus()
                return false
            }

            let monitoreo = await RegistroEvaluacionesUCI.CrearModificarMonitoreoSoporteVentilatorioUCI(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion,
                IdItem = $('#cboNombreEquipoSoporteVentilatorio').val(), Descripcion = $('#cboNombreEquipoSoporteVentilatorio>option:selected').text(),
                Cantidad = $('#txtCantidadSoporteVentilatorio').val(), Precio = 0, Total = 0,
                VentiladorMecanicoMarca = $('#txtVmMarca').val(), FechaInicioVM = $('#txtFechaInicioVm').val(), FechaTerminaVM = $('#txtFechaUltimoVm').val(), ModoVentilatorioConvencional = $('#cboModoVentConvencional').val(),
                ModoVentilatorioNoConvencional = $('#txtModoVentNoConvencional').val())

            oTable_MonitoreoSoporteVentilatorio.fnClearTable()
            if (monitoreo.data.table.length > 0) {
                oTable_MonitoreoSoporteVentilatorio.fnAddData(monitoreo.data.table)
            }
        })
        $('#btnQuitarMonitoreoSoporteVentilatorio').on('click', async () => {
            let objRow = oTable_MonitoreoSoporteVentilatorio.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            }

            let monitoreo = await RegistroEvaluacionesUCI.EliminarParametrosMonitoreo(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, IdMonitoreo = objRow.idMonitoreo, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion, TipoMonitoreo = 1
            )

            oTable_MonitoreoSoporteVentilatorio.fnClearTable()

            if (!isEmpty(monitoreo.data.table)) {
                if (monitoreo.data.table.length > 0) {
                    oTable_MonitoreoSoporteVentilatorio.fnAddData(monitoreo.data.table)
                }
            }

            oTable_ParametrosSoporteVentilatorio.fnClearTable()
        })

        $('#btnAgregarParametrosSoporteVentilatorio').on('click', async () => {

            let objMonitoreo = oTable_MonitoreoSoporteVentilatorio.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Selecciona un item de la tabla principal')
                return false
            }
            console.log('entra o nell')

            Cargando(1)
            let parametros = await RegistroEvaluacionesUCI.CrearModificarParametrosSoporteVentilatorioUCI(objMonitoreo.idMonitoreo, objMonitoreo.idAtencionDetalleUCI, objMonitoreo.nroEvaluacion, objMonitoreo.idItem, RegistroEvaluacionesUCI.DevolverParametrosMonitoreo(oTable_ParametrosSoporteVentilatorio, 'txtSopVentCant_'))
            Cargando(0)
            console.log('parametros', parametros)
        })

        $('#btnAgregarMonitoreoHemodinamico').on('click', async () => {
            if (RegistroEvaluacionesUCI.IdAtencionDetalleUCI == 0 && RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                alerta(2, 'Selecciona una evaluacion')
                return false
            }

            if ($('#cboNombreEquipoHemodinamico').val() == 0) {
                alerta(2, 'Selecciona el nombre del equipo')
                return false
            }

            if ($('#cboTipoMonitoreoHemodinamico').val() == 0) {
                alerta(2, 'Selecciona el tipo de monitoreo')
                return false
            }

            let agregaMonitoreo = true

            let lstMonitoreoHemodinamico = oTable_MonitoreoHemodinamico.api(true).rows().data();
            for (var i = 0; i < lstMonitoreoHemodinamico.length; i++) {
                if (lstMonitoreoHemodinamico[i].idEquipo == $("#cboNombreEquipoHemodinamico").val()) {
                    agregaMonitoreo = false;
                }
            }


            if (agregaMonitoreo) {
                let monitoreoHemodinamico = await RegistroEvaluacionesUCI.CrearModificarMonitoreoHemodinamicoUCI(
                    IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion,
                    IdEquipo = $('#cboNombreEquipoHemodinamico').val(), NombreEquipo = $('#cboNombreEquipoHemodinamico>option:selected').text(),
                    IdTipoMonitoreo = $('#cboTipoMonitoreoHemodinamico').val(), TipoMonitoreo = $('#cboTipoMonitoreoHemodinamico>option:selected').text(),
                    Cantidad = $('#txtCantidadEquipoHemodinamico').val(), Precio = 0, Total = 0
                )

                oTable_MonitoreoHemodinamico.fnClearTable()
                if (monitoreoHemodinamico.data.table.length > 0) {
                    oTable_MonitoreoHemodinamico.fnAddData(monitoreoHemodinamico.data.table)
                }
            } else {
                alerta(2, 'El item ya fue agregado')
            }


        })
        $('#btnQuitarMonitoreoHemodinamico').on('click', async () => {
            let objRow = oTable_MonitoreoHemodinamico.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            }

            let monitoreo = await RegistroEvaluacionesUCI.EliminarParametrosMonitoreo(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, IdMonitoreo = objRow.idMonitoreo, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion, TipoMonitoreo = 2
            )

            oTable_MonitoreoHemodinamico.fnClearTable()

            if (!isEmpty(monitoreo.data.table)) {
                if (monitoreo.data.table.length > 0) {
                    oTable_MonitoreoHemodinamico.fnAddData(monitoreo.data.table)
                }
            }

            oTable_ParametrosMonitoreoHemodinamico.fnClearTable()
        })

        $('#btnAgregarParametrosMonitoreoHemodinamico').on('click', async () => {
            let objMonitoreo = oTable_MonitoreoHemodinamico.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Selecciona un item de la tabla principal')
                return false
            }
            console.log('entra o nell')

            Cargando(1)
            let parametros = await RegistroEvaluacionesUCI.CrearModificarParametrosMonitoreoHemodinamicoUCI(objMonitoreo.idMonitoreo, objMonitoreo.idAtencionDetalleUCI, objMonitoreo.nroEvaluacion, objMonitoreo.idItem, RegistroEvaluacionesUCI.DevolverParametrosMonitoreo(oTable_ParametrosMonitoreoHemodinamico, 'txtHemoCant_'))
            Cargando(0)
            console.log('parametros', parametros)
        })
        $('#btnQuitarParametrosMonitoreoHemodinamico').on('click', () => {

        })

        $('#btnAgregarMonitoreoNeurologico').on('click', async () => {
            if (RegistroEvaluacionesUCI.IdAtencionDetalleUCI == 0 && RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                alerta(2, 'Selecciona una evaluacion')
                return false
            }

            if ($('#cboNombreEquipoNeurologico').val() == 0) {
                alerta(2, 'Selecciona el nombre del equipo')
                return false
            }

            if ($('#cboTipoMonitoreoNeurologico').val() == 0) {
                alerta(2, 'Selecciona el tipo de monitoreo')
                return false
            }

            let agregar = true

            let lstMonitoreo = oTable_MonitoreoNeurologico.api(true).rows().data();
            for (var i = 0; i < lstMonitoreo.length; i++) {
                if (lstMonitoreo[i].idEquipo == $("#cboNombreEquipoNeurologico").val()) {
                    agregar = false;
                }
            }


            if (agregar) {
                let monitoreo = await RegistroEvaluacionesUCI.CrearModificarMonitoreoNeurologicoUCI(
                    IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion,
                    IdEquipo = $('#cboNombreEquipoNeurologico').val(), NombreEquipo = $('#cboNombreEquipoNeurologico>option:selected').text(),
                    IdTipoMonitoreo = $('#cboTipoMonitoreoNeurologico').val(), TipoMonitoreo = $('#cboTipoMonitoreoNeurologico>option:selected').text(),
                    Cantidad = $('#txtCantidadNeurologico').val(), Precio = 0, Total = 0
                )

                oTable_MonitoreoNeurologico.fnClearTable()
                if (monitoreo.data.table.length > 0) {
                    oTable_MonitoreoNeurologico.fnAddData(monitoreo.data.table)
                }
            } else {
                alerta(2, 'El item ya fue agregado')
            }


        })
        $('#btnQuitarMonitoreoNeurologico').on('click', async () => {
            let objRow = oTable_MonitoreoNeurologico.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            }

            let monitoreo = await RegistroEvaluacionesUCI.EliminarParametrosMonitoreo(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, IdMonitoreo = objRow.idMonitoreo, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion, TipoMonitoreo = 3
            )

            oTable_MonitoreoNeurologico.fnClearTable()

            if (!isEmpty(monitoreo.data.table)) {
                if (monitoreo.data.table.length > 0) {
                    oTable_MonitoreoNeurologico.fnAddData(monitoreo.data.table)
                }
            }

            oTable_ParametrosNeurologico.fnClearTable()
        })

        $('#btnAgregarParametrosNeurologico').on('click', async () => {
            let objMonitoreo = oTable_MonitoreoNeurologico.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Selecciona un item de la tabla principal')
                return false
            }
            console.log('entra o nell')

            Cargando(1)
            let parametros = await RegistroEvaluacionesUCI.CrearModificarParametrosMonitoreoNeurologicoUCI(objMonitoreo.idMonitoreo, objMonitoreo.idAtencionDetalleUCI, objMonitoreo.nroEvaluacion, objMonitoreo.idItem, RegistroEvaluacionesUCI.DevolverParametrosMonitoreo(oTable_ParametrosNeurologico, 'txtNeuroCant_'))
            Cargando(0)
            console.log('parametros', parametros)
        })
        $('#btnQuitarParametrosNeurologico').on('click', () => {

        })

        $('#btnAgregarMonitoreoUltrasonografia').on('click', async () => {
            if (RegistroEvaluacionesUCI.IdAtencionDetalleUCI == 0 && RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                alerta(2, 'Selecciona una evaluacion')
                return false
            }

            if ($('#cboDescripcionUltrasonografia').val() == 0) {
                alerta(2, 'Selecciona un item para agregar')
                return false
            }

            let monitoreo = await RegistroEvaluacionesUCI.CrearModificarMonitoreoUltrasonografiaUCI(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion,
                IdItem = $("#cboDescripcionUltrasonografia").val(), Descripcion = $('#cboDescripcionUltrasonografia>option:selected').text(),
                Cantidad = $('#txtCantidadUltrasonografia').val(), Precio = 0, Total = 0, DescripcionHallazgos = $('#txtDescripcionHallazgosUltrasonografia').val()
            )

            oTable_MonitoreoUltrasonografia.fnClearTable()
            if (monitoreo.data.table.length > 0) {
                oTable_MonitoreoUltrasonografia.fnAddData(monitoreo.data.table)
            }
        })
        $('#btnQuitarMonitoreoUltrasonografia').on('click', async () => {
            let objRow = oTable_MonitoreoUltrasonografia.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro a eliminar')
            }

            let monitoreo = await RegistroEvaluacionesUCI.EliminarParametrosMonitoreo(
                IdAtencionDetalleUCI = RegistroEvaluacionesUCI.idAtencion, IdMonitoreo = objRow.idMonitoreo, NroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion, TipoMonitoreo = 4
            )

            oTable_MonitoreoUltrasonografia.fnClearTable()

            if (!isEmpty(monitoreo.data.table)) {
                if (monitoreo.data.table.length > 0) {
                    oTable_MonitoreoUltrasonografia.fnAddData(monitoreo.data.table)
                }
            }

            oTable_ParametrosUltrasonografia.fnClearTable()
        })

        $('#btnAgregarParametrosUltrasonografia').on('click', async () => {

            let objMonitoreo = oTable_MonitoreoUltrasonografia.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Selecciona un item de la tabla principal')
                return false
            }
            console.log('entra o nell')

            Cargando(1)
            let parametros = await RegistroEvaluacionesUCI.CrearModificarParametrosMonitoreoUltrasonografiaUCI(objMonitoreo.idMonitoreo, objMonitoreo.idAtencionDetalleUCI, objMonitoreo.nroEvaluacion, objMonitoreo.idItem, RegistroEvaluacionesUCI.DevolverParametrosMonitoreo(oTable_ParametrosUltrasonografia, 'txtUltraCant_'))
            Cargando(0)
            console.log('parametros', parametros)
        })
        $('#btnQuitarParametrosUltrasonografia').on('click', () => {

        })

        $('#btnGuardarComentarioApreciacion').on('click', async () => {

            if ($('#txtFechaRegistroNotaAdicional').val() == '') {
                alerta(2, 'La fecha de registro es obligatoria')
                $('#txtFechaRegistroNotaAdicional').focus()
                return false
            }

            if ($('#txtHoraRegistroNotaAdicional').val() == '') {
                alerta(2, 'La hora de registro es obligatoria')
                $('#txtHoraRegistroNotaAdicional').focus()
                return false
            }

            if ($('#cboMedicoComentario').val() == 0) {
                alerta(2, 'Seleccione un médico')
                $('#cboMedicoComentario').focus()
                return false
            }

            if ($('#cboDestinoComentario').val() == 0) {
                alerta(2, 'Seleccione un destino')
                $('#cboDestinoComentario').focus()
                return false
            }

            Cargando(1)

            let comentario = await RegistroEvaluacionesUCI.CrearModificarComentarioApreciacionUCI(
                idCuenta = RegistroEvaluacionesUCI.idCuentaAtencion,
                IdComentarioApreciacion = RegistroEvaluacionesUCI.IdComentarioApreciacion, IdAtencionUCI = RegistroEvaluacionesUCI.idAtencion, OrganoAfectado = $('#cboOrganoAfectado').val(),
                Medico = $('#cboMedicoComentario').val(), Destino = $('#cboDestinoComentario').val(), ComentarioApreciacion = $('#txtComentarioApreciacion').val(), Plan = $('#txtPlan').val(),
                Fecha = $('#txtFechaRegistroNotaAdicional').val(), Hora = $('#txtHoraRegistroNotaAdicional').val()
            )

            oTable_ComentarioApreciacion.fnClearTable()

            let comentarios = await RegistroEvaluacionesUCI.SeleccionarComentarioApreciacionUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencion)
            if (!isEmpty(comentarios)) {
                if (comentarios.length > 0)
                    oTable_ComentarioApreciacion.fnAddData(comentarios)
            }

            $('#txtComentarioApreciacion').val('')
            $('#txtPlan').val('')
            $('#cboDestinoComentario').val(0)
            $('#cboMedicoComentario').val(0)

            $('#txtFechaRegistroNotaAdicional').val('')
            $('#txtHoraRegistroNotaAdicional').val('')

            $('.chzn-select').chosen().trigger("chosen:updated")

            $('#modalNotaAdicional').modal('hide')

            Cargando(0)
        })

        $('#btnOpenModalEstablecimientoReferenciaCita').on('click', function () {

            $('#divCodigoRenaes').show()
            $('#modalEstablecimientosUciBuscar').modal('show')
        })
        $('#btnBuscarEstablecimientoUci').on('click', function () {
            let formData = new FormData()

            formData.append('codigoRenaes', $('#codigoEstUciBuscar').val())
            formData.append('nombreEstablecimiento', $('#nombreEstUciBuscar').val())
            formData.append('idDepartamento', $('#cmbdepEstUcibuscar').val())
            formData.append('idProvincia', $('#cmbprovEstUciBuscar').val())
            formData.append('idDistrito', $('#cmbdistEstUciBuscar').val())

            fetch('/citas/ListarEstablecimientosReferenciaV2?area=ConsultaExterna', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .catch(error => console.error('error:', error))
                .then(response => {
                    Cargando(1)
                    oTable_establecimientos.fnClearTable()
                    if (response.dataSet.table.length > 0) {
                        oTable_establecimientos.fnAddData(response.dataSet.table);
                    }
                    Cargando(0)
                });
        })
        $('#btnCerraEstablecimientoBuscarUci').on('click', function () {
            $('#modalEstablecimientosUciBuscar').modal('hide')
        })


        $('#btnAgregarNotaAdicional').on('click', () => {

            RegistroEvaluacionesUCI.IdComentarioApreciacion = 0

            $('#txtFechaRegistroNotaAdicional').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
            $('#txtHoraRegistroNotaAdicional').val(moment().toDate().format('HH:MM'));

            $('#txtComentarioApreciacion').val('')
            $('#txtPlan').val('')
            $('#cboDestinoComentario').val(0)
            $('#cboMedicoComentario').val(0)

            //$('#txtFechaRegistroNotaAdicional').val('')
            //$('#txtHoraRegistroNotaAdicional').val('')

            $('.chzn-select').chosen().trigger("chosen:updated")

            $('#modalNotaAdicional').modal('show')
        })
        $('#btnModificarNotaAdicional').on('click', () => {
            let objRow = oTable_ComentarioApreciacion.api(true).row('.selected').data()

            RegistroEvaluacionesUCI.IdComentarioApreciacion = objRow.idComentarioApreciacion

            $('#txtFechaRegistroNotaAdicional').datepicker("setDate", objRow.fechaRegistro);
            $('#txtHoraRegistroNotaAdicional').val(objRow.hora);
            $('#txtComentarioApreciacion').val(objRow.comentarioApreciacion);
            $('#txtPlan').val(objRow.plan);
            $('#cboMedicoComentario').val(objRow.idMedico);
            $('#cboDestinoComentario').val(objRow.idDestinoAtencion);

            $('.chzn-select').chosen().trigger("chosen:updated")

            $('#modalNotaAdicional').modal('show')
        })


        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                text: '¿Estas seguro de  Salir?',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {
                RegistroEvaluacionesUCI.LimpiarCampos()
                $('#btnBuscarAtenciones').click()
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                ReposicionarVista();        //KHOYOSI
                MostrarAreaLista();         //KHOYOSI
                CerrarModulo();             //KHOYOSI
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }).catch(swal.noop);

        });

        $("#btnModalSOFA").on('click', () => {


            $('#cphMainContent_txtFiO2').val($('#txtEFisicoRespFIO').val() * 100)
            $('#cphMainContent_txtPaO2').val($('#txtAuxPO2').val())
            $('#cphMainContent_txtPlatelets').val($('#txtAuxPlaquetas').val())

            $('#cphMainContent_txtBilirubin').val($('#txtAuxBilirrubinaTotal').val().split(' ')[0])
            $('#cphMainContent_txtMAP').val($('#txtEFisicoPAM').val())

            $('#cphMainContent_txtGCS').val($('#txtEFisicoEscalaGlasgow').val())
            $('#cphMainContent_txtCreatinine').val(($('#txtAuxCreatinina').val().replace(/[a-zA-Z/]/g, '')).trim())

            $('#modalSofa').modal('show')
        })

        $("btnCerrarModalSOFA").on('click', () => {
            $('#modalSofa').modal('hide')
        })

        $("#btnCalcularSofa").on('click', () => {

            let respiracion = (parseFloat($('#cphMainContent_txtPaO2').val()) / parseFloat($('#cphMainContent_txtFiO2').val())) * 100
            let ventilacionMecanica = $('input[name="ctl00$cphMainContent$rdoMechVent"]:checked').val() == 1 ? true : false
            let respiracionPuntaje

            let coagulacion = $('#cphMainContent_txtPlatelets').val()
            let coagulacionPuntaje

            let bilirrubina = parseFloat($('#cphMainContent_txtBilirubin').val())
            let bilirrubinaPuntaje


            let pam = parseFloat($('#cphMainContent_txtMAP').val())
            let dopamina = parseFloat($('#cphMainContent_txtDopamine').val())
            let dobutamina = parseFloat($('#cphMainContent_txtDobutamine').val())
            let epinephrine = parseFloat($('#cphMainContent_txtEpi').val())
            let norepinephrine = parseFloat($('#cphMainContent_txtNorepi').val())
            let vasopresores = $('input[name="ctl00$cphMainContent$rdoPressors"]:checked').val() == 1 ? true : false
            let cardiovascularPuntaje

            let glasgow = parseFloat($('#cphMainContent_txtGCS').val())
            let neurologicalPuntaje

            let creatinina = parseFloat($('#cphMainContent_txtCreatinine').val())
            let renalPuntaje

            let diuresisPuntaje

            if (respiracion >= 400) {
                respiracionPuntaje = 0
            } else if (respiracion >= 300 && respiracion < 400) {
                respiracionPuntaje = 1
            } else if (respiracion >= 200 && respiracion < 300) {
                respiracionPuntaje = 2
            } else if (respiracion >= 100 && respiracion < 200 && ventilacionMecanica) {
                respiracionPuntaje = 3
            } else if (respiracion < 100 && ventilacionMecanica) {
                respiracionPuntaje = 4
            } else {
                respiracionPuntaje = 2
            }

            if (coagulacion >= 150000) {
                coagulacionPuntaje = 0
            } else if (coagulacion >= 100000) {
                coagulacionPuntaje = 1
            } else if (coagulacion >= 50000) {
                coagulacionPuntaje = 2
            } else if (coagulacion >= 20000) {
                coagulacionPuntaje = 3
            } else {
                coagulacionPuntaje = 4
            }

            if (bilirrubina >= 12) {
                bilirrubinaPuntaje = 4
            } else if (bilirrubina >= 6 && bilirrubina < 12) {
                bilirrubinaPuntaje = 3
            } else if (bilirrubina >= 2 && bilirrubina < 6) {
                bilirrubinaPuntaje = 2
            } else if (bilirrubina >= 1.2 && bilirrubina < 2) {
                bilirrubinaPuntaje = 1
            } else if (bilirrubina < 1.2) {
                bilirrubinaPuntaje = 0
            }


            if (!vasopresores) {
                if (pam < 70) {
                    cardiovascularPuntaje = 1
                } else {
                    cardiovascularPuntaje = 0
                }
            } else {
                if (dopamina <= 5 || dobutamina <= 5) {
                    cardiovascularPuntaje = 2
                } else {
                    if (epinephrine <= 0.1 || norepinephrine <= 0.1) {
                        cardiovascularPuntaje = 3
                    } else {
                        cardiovascularPuntaje = 4
                    }
                }
            }


            if (glasgow == 15) {
                neurologicalPuntaje = 0
            } else if (glasgow >= 13 && glasgow <= 14) { // Verificar cantidades no cuadra el 12
                neurologicalPuntaje = 1
            } else if (glasgow >= 10 && glasgow <= 12) {
                neurologicalPuntaje = 2
            } else if (glasgow >= 6 && glasgow <= 9) {
                neurologicalPuntaje = 3
            } else if (glasgow < 6) {
                neurologicalPuntaje = 4
            }

            if (creatinina < 1.2) {
                renalPuntaje = 0
            } else if (creatinina >= 1.2 && creatinina <= 1.9) { // Verificar cantidades no cuadra el 12
                renalPuntaje = 1
            } else if (creatinina >= 2 && creatinina <= 3.4) {
                renalPuntaje = 2
            } else if (creatinina >= 3.5 && creatinina <= 4.9) {
                renalPuntaje = 3
            } else if (creatinina > 5) {
                renalPuntaje = 4
            }

            if ($('#cphMainContent_drpUOP').val() == 'gt500') { // > 500
                diuresisPuntaje = 0
            } else if ($('#cphMainContent_drpUOP').val() == 'lt500') { // 200 - 500
                diuresisPuntaje = 3
            } else if ($('#cphMainContent_drpUOP').val() == 'lt200') { // < 200
                diuresisPuntaje = 4
            }

            if (diuresisPuntaje > renalPuntaje) {
                renalPuntaje = diuresisPuntaje
            }


            let totalPuntaje = respiracionPuntaje + coagulacionPuntaje + bilirrubinaPuntaje + cardiovascularPuntaje + neurologicalPuntaje + renalPuntaje

            console.log('respiracionPuntaje', respiracionPuntaje)
            console.log('coagulacionPuntaje', coagulacionPuntaje)
            console.log('bilirrubinaPuntaje', bilirrubinaPuntaje)
            console.log('cardiovascularPuntaje', cardiovascularPuntaje)
            console.log('neurologicalPuntaje', neurologicalPuntaje)
            console.log('neurologicalPuntaje', neurologicalPuntaje)


            let mortality

            if (totalPuntaje <= 6) {
                mortality = '< 10%'
            } else if (totalPuntaje >= 7 && totalPuntaje <= 9) {
                mortality = '15 - 20%'
            } else if (totalPuntaje >= 10 && totalPuntaje <= 12) {
                mortality = '40 - 50%'
            } else if (totalPuntaje >= 13 && totalPuntaje <= 14) {
                mortality = '50 - 60%'
            } else if (totalPuntaje == 15) {
                mortality = '> 80%'
            } else if (totalPuntaje > 15 && totalPuntaje <= 24) {
                mortality = '> 90%'
            }

            $('#txtDatoCalculadoSOFA').val(totalPuntaje);
            $('#mortality').text('Mortalidad: ' + mortality);

        })

        //$("#btnCalcularSofa").on('click', () => {



        //    


        //    console.log('respiracionPuntaje', respiracionPuntaje)
        //    console.log('coagulacionPuntaje', coagulacionPuntaje)
        //    console.log('bilirrubinaPuntaje', bilirrubinaPuntaje)
        //    console.log('cardiovascularPuntaje', cardiovascularPuntaje)
        //    console.log('neurologicalPuntaje', neurologicalPuntaje)
        //    console.log('renalPuntaje', renalPuntaje)

        //    $('#txtDatoCalculadoSOFA').val('Puntaje: ' + totalPuntaje + ' ' + mortality);

        //})

        $('#ImprimirEvalEmerSF').on('click', async function () {
            var objrow = oTable_Evaluaciones.api(true).row('.selected').index();
            var row = oTable_Evaluaciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {

                    const pdf = await Utilitario.GenerarHojaInformeUCI(row.idCuentaAtencion, row.idAtencion, row.idAtencionDetalleUCI, row.idServicioIngreso, row.nroEvaluacion);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        $('#FirmarEvalEmer').on('click', async function () {
            var objrow = oTable_Evaluaciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_Evaluaciones.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'UCI-EVA';
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code);
                if (firma) {
                    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                }
            }
            Cargando(0);
        });
        $('#ImprimirEvalEmerCF').on('click', async function () {
            var objrowTb = oTable_Evaluaciones.api(true).row('.selected').data();
            Cargando(1);
            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            }
            Cargando(0);
        });





        $('#btnImprimeRecetas').on('click', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}
            //var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            //var row = oTable_atenciones.fnGetData(objrow)
            const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
            VisorReceta.AbrirVisorRecetas(recetas);
        })

        //$('#tblComentarioApreciacion tbody').on('click', '.ImprimirComentarioSF', async function () {
        //    var objrow = oTable_ComentarioApreciacion.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_ComentarioApreciacion.fnGetData(objrow);
        //    //console.log(row);
        //    Cargando(1);
        //    if (isEmpty(row)) {
        //        alerta(2, 'Seleccione una evaluación por favor.');
        //    } else {
        //        await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        //    }
        //    Cargando(0);
        //});

        $('#tblComentarioApreciacion tbody').on('click', '.ImprimirComentarioSF', async function () {
            var objrow = oTable_ComentarioApreciacion.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ComentarioApreciacion.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarHojaNotaAdicionalUCI(RegistroEvaluacionesUCI.idCuentaAtencion, RegistroEvaluacionesUCI.idAtencion, row.idComentarioApreciacion);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')

                    let comentarios = await RegistroEvaluacionesUCI.SeleccionarComentarioApreciacionUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencion)

                    oTable_ComentarioApreciacion.fnClearTable()

                    if (!isEmpty(comentarios)) {
                        if (comentarios.length > 0)
                            oTable_ComentarioApreciacion.fnAddData(comentarios)
                    }
                    //$("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
                Cargando(0);
            }
            Cargando(0);
        });

        $('#tblComentarioApreciacion tbody').on('click', '.FirmarComentarioSF', async function () {
            var objrow = oTable_ComentarioApreciacion.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ComentarioApreciacion.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'NA-UCI';
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code);
                if (firma) {
                    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                }
            }
            Cargando(0);
        });




        $('#tblEvaluaciones tbody').on('click', 'tr', async function () {
            //EvaluacionEmergencia.LimpiarVistaModuloEvaluacionDetalle();
            //EvaluacionEmergencia.BloquearOpcionesModificacion();

            oTable_Evaluaciones.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_Evaluaciones.api(true).row('.selected').data();

            await RegistroEvaluacionesUCI.LimpiarCamposEvaluacion()

            if (!isEmpty(objrowTb)) {
                console.log('objrowTb', objrowTb)

                RegistroEvaluacionesUCI.SeleccionarEvaluacion(objrowTb)

                $("#evaluaciones-tab").click();
                //EvaluacionDetalle.Cargar(objrowTb);
                //if (EvaluacionDetalle.IdNumero > 0) {
                //    //await EvaluacionEmergencia.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionEmergencia.nroEvaluacion);                    
                //    await EvaluacionEmergencia.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
                //}
                //$("#evaluaciones-tab").click();
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No se ha seleccionado ninguna evaluación.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });

        $('#tblMonitoreoSoporteVentilatorio tbody').on('click', 'tr', async function () {

            oTable_MonitoreoSoporteVentilatorio.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objMonitoreo = oTable_MonitoreoSoporteVentilatorio.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Seleciona un equipo de monitoreo para agregar los parametros')
                return false
            }

            Cargando(1)

            let parametrosMonitoreo = await RegistroEvaluacionesUCI.SeleccionarParametroSoporteVentilatorioUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion, objMonitoreo.idItem, objMonitoreo.idMonitoreo)

            console.log('parametrosMonitoreo', parametrosMonitoreo)
            oTable_ParametrosSoporteVentilatorio.fnClearTable()
            if (parametrosMonitoreo.length > 0) {
                oTable_ParametrosSoporteVentilatorio.fnAddData(parametrosMonitoreo)
            }

            Cargando(0)
        });

        $('#tblMonitoreoHemodinamico tbody').on('click', 'tr', async function () {

            oTable_MonitoreoHemodinamico.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objMonitoreoHemodinamico = oTable_MonitoreoHemodinamico.api(true).row('.selected').data()

            if (isEmpty(objMonitoreoHemodinamico)) {
                alerta(2, 'Seleciona un equipo de monitoreo para agregar los parametros')
                return false
            }

            Cargando(1)

            let parametrosMonitoreoHemodinamico = await RegistroEvaluacionesUCI.SeleccionarParametrosMonitoreoHemodinamicoUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion, objMonitoreoHemodinamico.idItem, objMonitoreoHemodinamico.idMonitoreo)

            oTable_ParametrosMonitoreoHemodinamico.fnClearTable()
            if (parametrosMonitoreoHemodinamico.length > 0) {
                oTable_ParametrosMonitoreoHemodinamico.fnAddData(parametrosMonitoreoHemodinamico)
            }

            Cargando(0)
        });

        $('#tblMonitoreoNeurologico tbody').on('click', 'tr', async function () {

            oTable_MonitoreoNeurologico.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objMonitoreo = oTable_MonitoreoNeurologico.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Seleciona un equipo de monitoreo para agregar los parametros')
                return false
            }

            Cargando(1)


            let parametrosMonitoreoNeurologico = await RegistroEvaluacionesUCI.SeleccionarParametrosMonitoreoNeurologicoUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion, objMonitoreo.idItem, objMonitoreo.idMonitoreo)

            oTable_ParametrosNeurologico.fnClearTable()
            if (parametrosMonitoreoNeurologico.length > 0) {
                oTable_ParametrosNeurologico.fnAddData(parametrosMonitoreoNeurologico)
            }

            Cargando(0)
        });

        $('#tblMonitoreoUltrasonografia tbody').on('click', 'tr', async function () {

            oTable_MonitoreoUltrasonografia.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objMonitoreo = oTable_MonitoreoUltrasonografia.api(true).row('.selected').data()

            if (isEmpty(objMonitoreo)) {
                alerta(2, 'Seleciona un equipo de monitoreo para agregar los parametros')
                return false
            }

            Cargando(1)

            console.log('objMonitoreo', objMonitoreo)

            $('#txtVisualizarDescripcionHallazgosUltrasonografia').val(objMonitoreo.descripcionHallazgos)

            let parametrosMonitoreoUltrasonografia = await RegistroEvaluacionesUCI.SeleccionarParametrosMonitoreoUltrasonografiaUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion, objMonitoreo.idItem, objMonitoreo.idMonitoreo)

            oTable_ParametrosUltrasonografia.fnClearTable()
            if (parametrosMonitoreoUltrasonografia.length > 0) {
                oTable_ParametrosUltrasonografia.fnAddData(parametrosMonitoreoUltrasonografia)
            }

            Cargando(0)
        });

        $('#tblOtrasPatBusqueda tbody').on('click', 'tr', function () {
            $('#tblOtrasPatBusqueda  tbody tr').removeClass("selected");
            $(this).addClass('selected');

            let lstTableOtrasPatologias = oTable_OtrasPatBusqueda.api(true).row('.selected').data();

            $("#txtCodigoOtrasPat").val(lstTableOtrasPatologias.codigoCIE10);
            $("#hdnIdOtrasPat").val(lstTableOtrasPatologias.iddiagnostico);
            $("#txtDescripcionOtrasPat").val(lstTableOtrasPatologias.descripcion);
            RegistroEvaluacionesUCI.CerrarModalBusquedaOtrasPat()
        });

        $('#tblComentarioApreciacion tbody').on('click', 'tr', async function () {

            oTable_ComentarioApreciacion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objRow = oTable_ComentarioApreciacion.api(true).row('.selected').data()

            Cargando(1)

            $('#txtComentarioApreciacionDetalle').val(objRow.comentarioApreciacion)
            $('#txtPlanDetalle').val(objRow.plan)

            Cargando(0)
        });



        $('#btnLimpiarReferencia').on('click', function (e) {

            $('#txtIdReferenciaCita').val('')
            $('#txtDescripcionReferenciaCita').val('')

            RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = 0
        })


        $('#tblOtrasPatologias tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_OtrasPatologias.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })

        $('#tblNeurologicoSedantes tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NeurologicoSedantes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblNeurologicoAnalgesicos tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NeurologicoAnalgesicos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblNeurologicoRelajanteNeuromuscular tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_NeurologicoRelajanteNeuromuscular.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblCardioVasodilatador tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_CardioVasodilatador.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblCardioVasoconstrictor tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_CardioVasoconstrictor.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblAccesosVasculares tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_AccesosVasculares.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })

        $('#tblIntervencionesHemoderivado tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionesHemoderivado.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblIntervencionesCorticoide tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionesCorticoide.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        $('#tblIntervencionesFluidoterapia tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionesFluidoterapia.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })


        $('#examenesEval-tab, #resultadosAux-tab, #diagnosticos-tab, #monitoreoAvanzado-tab, #procedimientosUCI-tab').on('click', function () {
            if (RegistroEvaluacionesUCI.nroEvaluacion == 0) {
                swal({
                    title: 'Atencion',
                    text: "Debe agregar o seleccionar una evaluación",
                    type: 'warning',
                }).done();
                $('#antecedentes-tab').click()
                return false
            }
        })

        $('#txtEFisicoPeso').on('change', () => {
            if ($('#txtEFisicoPeso').val() != '' && $('#txtEFisicoTalla').val() != '') {
                $('#txtEFisicoIMC').val((parseFloat($('#txtEFisicoPeso').val()) / (parseFloat($('#txtEFisicoTalla').val()) * parseFloat($('#txtEFisicoTalla').val()))).toFixed(2))
            } else {
                $('#txtEFisicoIMC').val('')
            }
        })

        $('#txtEFisicoTalla').on('change', () => {
            if ($('#txtEFisicoPeso').val() != '' && $('#txtEFisicoTalla').val() != '') {
                $('#txtEFisicoIMC').val((parseFloat($('#txtEFisicoPeso').val()) / (parseFloat($('#txtEFisicoTalla').val()) * parseFloat($('#txtEFisicoTalla').val()))).toFixed(2))
            } else {
                $('#txtEFisicoIMC').val('')
            }
        })

        $('#btnModalIncrementoPeso').on('click', function () {

            $('#modalIncrementoPeso').modal('show')
        })

        $('input[name="rdbEstadoNutricional"]').on('click', function () {
            let estadoNutricional = parseInt(isEmpty($('input[name="rdbEstadoNutricional"]:checked').val()) ? 0 : $('input[name="rdbEstadoNutricional"]:checked').val())
            let gravedadEnfermedad = parseInt(isEmpty($('input[name="rdbGravedadEnfermedad"]:checked').val()) ? 0 : $('input[name="rdbGravedadEnfermedad"]:checked').val())


            $('#txtIncrementoPeso').val(estadoNutricional + gravedadEnfermedad)
        })

        $('input[name="rdbGravedadEnfermedad"]').on('click', function () {
            let estadoNutricional = parseInt(isEmpty($('input[name="rdbEstadoNutricional"]:checked').val()) ? 0 : $('input[name="rdbEstadoNutricional"]:checked').val())
            let gravedadEnfermedad = parseInt(isEmpty($('input[name="rdbGravedadEnfermedad"]:checked').val()) ? 0 : $('input[name="rdbGravedadEnfermedad"]:checked').val())


            $('#txtIncrementoPeso').val(estadoNutricional + gravedadEnfermedad)
        })
    },

    HabilitarNuevaEvaluacion: async function () {
        Cargando(1);

        let evaluaciones = oTable_Evaluaciones.api(true).data()

        console.log('evaluaciones', evaluaciones, evaluaciones.length)

        RegistroEvaluacionesUCI.nroEvaluacion = evaluaciones.length + 1
        RegistroEvaluacionesUCI.IdAtencionDetalleUCI = 0

        let eval = oTable_Evaluaciones.DataTable().data().count();
        OrdenMedica.nroEvaluaciones = eval;

        $('#hdNroEvaluacion').val(RegistroEvaluacionesUCI.nroEvaluacion);

        oTable_Evaluaciones.$('tr.selected').removeClass('selected');

        swal({
            title: 'Evaluaciones',
            text: "Paciente iniciará la evaluación N° " + (RegistroEvaluacionesUCI.nroEvaluacion),
            type: 'info',
        }).done()

        $('#lblNumeroEvaluacion').text(`Evaluación N° ${RegistroEvaluacionesUCI.nroEvaluacion}`)

        $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

        await RegistroEvaluacionesUCI.LimpiarCamposEvaluacion()
        let resultados = await RegistroEvaluacionesUCI.ListarResultadosLaboratorioByIdCuentaAtencion(RegistroEvaluacionesUCI.idCuentaAtencion)

        await RegistroEvaluacionesUCI.LimpiarExamenes()

        if (!isEmpty(resultados)) {
            await RegistroEvaluacionesUCI.CompletarResultadosExamenes(resultados)
        }

        if (RegistroEvaluacionesUCI.nroEvaluacion < 2) {
            RegistroEvaluacionesUCI.HabilitarDeshabilitarCamposPrimeraEvaluacion(false)
        } else {
            RegistroEvaluacionesUCI.HabilitarDeshabilitarCamposPrimeraEvaluacion(true)
        }

        $('#cboMedicoComentario').val($('#idMedicotxt').val());
        $('#cboMedicoComentarioEvaluacion').val($('#idMedicotxt').val());

        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#evaluaciones-tab").click()

        //=======================KHOYOSI==============================================//
        RegistroEvaluacionesUCI.nuevaEvaluacion = true;
        RegistroEvaluacionesUCI.modificaEvaluacion = false;
        $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
        $('.nav-tabs a[href="#examenFisico-tab"]').tab('show');
        $('.nav-tabs a[href="#examenFisicoNeurologico-tab"]').tab('show');
        //=============================================================================//

        Cargando(0);
    },

    CompletarResultadosExamenes: async (data) => {

        let grupoRhResAnest = ''

        $(data).each((i, obj) => {

            console.log('revisando', obj)


            // ANTECEDENTES PERSONALES Grupo sanguíneo - Factor RH
            if (obj.codigo == '86900' && obj.idItem == '84' && RegistroEvaluacionesUCI.nroEvaluacion < 2) { // Grupo sanguíneo ABO
                $('#txtGrupoSanguineo').val(obj.valorTexto)
            }
            if (obj.codigo == '86901' && obj.idItem == '84' && RegistroEvaluacionesUCI.nroEvaluacion < 2) { // TIPIFICACION SANGUINEA RH
                $('#txtFactor').val(obj.valorCombo)
            }
            // END ANTECEDENTES PERSONALES Grupo sanguíneo - Factor RH

            // ------------------------ HEMOGRAMA
            if (obj.codigo == '85027' && obj.idItem == '5') { // Leucocitos
                $('#txtAuxLeucocitoNumero').val(obj.valorNumero)
            }
            // NO HAY NEUTROFILOS
            if (obj.codigo == '85027' && obj.idItem == '6') { // Abastonados
                $('#txtAuxAbastonado').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '11') { // Linfocitos
                $('#txtAuxLinfocitos').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '1') { // Hemoglobina
                $('#txtHbAnest').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '2') { // Hematocrito
                $('#txtHtoAnest').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '4') { // Plaquetas
                $('#txtAuxPlaquetas').val(obj.valorNumero)
            }
            // ------------------------ END HEMOGRAMA

            // ------------------------ BIOQUÍMICO
            if (obj.codigo == '84520' && obj.idItem == '84') { // UREA
                $('#txtAuxUrea').val(obj.ValorTexto)
            }

            // FALTA GLUCOSA

            if (obj.codigo == '82565' && obj.idItem == '84') { // CREATININA EN SANGRE
                $('#txtAuxCreatinina').val(obj.valorTexto)
            }

            if (obj.codigo == '84165' && obj.idItem == '25') { // PROTEINAS TOTALES/FRACCIONADAS Albumina
                $('#txtAuxAlbumina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '25' && $('#txtAuxAlbumina').val() == '') { // PERFIL HEPATICO Albumina
                $('#txtAuxAlbumina').val(obj.valorNumero)
            }

            if (obj.codigo == '84165' && obj.idItem == '26') { // PROTEINAS TOTALES/FRACCIONADAS Globulina
                $('#txtAuxGlobulina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '26' && $('#txtAuxGlobulina').val() == '') { // PERFIL HEPATICO Globulina
                $('#txtAuxGlobulina').val(obj.valorNumero)
            }

            if (obj.codigo == '82247' && obj.idItem == '89') { // BILIRRUBINAS TOTAL Bilirrubina Total
                $('#txtAuxBilirrubinaTotal').val(obj.valorTexto)
            }

            if (obj.codigo == '82248' && obj.idItem == '117') { // BILIRRUBINA  DIRECTA Directa
                $('#txtAuxBilirrubinaDirecta').val(obj.valorTexto)
            }

            if (obj.codigo == '84075' && obj.idItem == '84') { // FOSFATASA ALCALINA
                $('#txtAuxFosfatasaAlcalina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '29' && $('#txtAuxFosfatasaAlcalina').val() == '') { // PERFIL HEPATICO Fosfatasa alcalina
                $('#txtAuxFosfatasaAlcalina').val(obj.valorNumero)
            }

            if (obj.codigo == '84450' && obj.idItem == '84') { // Transaminasa(TGO)
                $('#txtAuxTGO').val(obj.valorTexto)
            }
            if (obj.codigo == '84460' && obj.idItem == '84') { // Transaminasa(TGP)
                $('#txtAuxTGP').val(obj.valorTexto)
            }

            if (obj.codigo == '89051.01' && obj.idItem == '405') { // lactato deshidrogenasa LDH
                $('#txtAuxLactatoDeshidrogenasa').val(obj.valorNumero)
            }

            // FALTA Magnesio

            // FALTA Fosforo

            if (obj.codigo == '82310' && obj.idItem == '391') { // CALCIO SERICO
                $('#txtAuxCalcioSerico').val(obj.valorTexto)
            }

            if ($('#txtAuxAlbumina').val() != '') {
                $('#txtAuxIndiceAlbumina').val((parseFloat($('#txtAuxAlbumina').val()) * 5.54).toFixed(3))
            }
            if ($('#txtAuxGlobulina').val() != '') {
                $('#txtAuxIndiceGlobulina').val((parseFloat($('#txtAuxGlobulina').val()) * 1.43).toFixed(3))
            }
            if ($('#txtAuxIndiceAlbumina').val() != '' && $('#txtAuxIndiceGlobulina').val() != '') { // Presión oncótica Po
                $('#txtAuxPresionOncoticaPo').val((parseFloat($('#txtAuxIndiceAlbumina').val()) + parseFloat($('#txtAuxIndiceGlobulina').val())).toFixed(3))
            }
            if ($('#txtAuxPresionOncoticaPo').val() != '' && $('#txtEFisicoPAM').val() != '') { // Índice de Briones
                $('#txtAuxIndiceBriones').val((parseFloat($('#txtAuxPresionOncoticaPo').val()) / parseFloat($('#txtEFisicoPAM').val())).toFixed(3))
            }

            // ------------------------ END BIOQUÍMICO

            // ------------------------ PERFIL DE COAGULACIÓN
            if (obj.codigo == '80063' && obj.idItem == '85') { // Tiempo de Protrombina
                $('#txtAuxTiempoProtrombina').val(obj.valorTexto)
            }

            if (obj.codigo == '80063' && obj.idItem == '86') { // Tiempo Parcial de Tromboplastina
                $('#txtAuxTTPA').val(obj.valorTexto)
            }

            if (obj.codigo == '80063' && obj.idItem == '87') { // Fibrinógeno
                $('#txtAuxFibrinogeno').val(obj.valorTexto)
            }

            // Falta Dimero D

            // Marcadores inflamatorios

            if (obj.codigo == '86140' && obj.idItem == '84') { // PROTEINA C REACTIVA
                $('#txtAuxProteinaCReactiva').val(obj.valorTexto + '')
            }

            // Procalcitonina

            // ------------------------ END PERFIL DE COAGULACIÓN


            // ------------------------ GASOMETRÍA
            if (obj.codigo == '81001' && obj.idItem == '92') { // EXAMEN COMPLETO DE ORINA (PH)
                $('#txtAuxPH').val(obj.valorTexto + '')
            }
            if (obj.codigo == '81000' && obj.idItem == '92' && $('#txtAuxPH').val() == '') { // Examen Completo de Orina.... (PH)
                $('#txtAuxPH').val(obj.valorTexto + '')
            }



            // ------------------------ END GASOMETRÍA



            //if (obj.codigo == '82947' && obj.idItem == '84') { // GLUCOSA EN SANGRE CUANTITATIVO
            //    $('#txtGlucosaResAnest').val(obj.valorTexto + '')
            //}



            //if (obj.codigo == '86592' && obj.idItem == '84') { // RPR/VDRL
            //    $('#txtVdrlAnest').val(obj.valorCombo)
            //}
            //if (obj.codigo == '86703' && obj.idItem == '84') { // HIV 1 - 2 Ag/Ac
            //    $('#txtHivResAnest').val(obj.valorCombo)
            //}


            //if (obj.codigo == '80063' && obj.idItem == '4') { // Plaquetas
            //    $('#txtRecPlaquetasAnest').val(obj.valorTexto)
            //}





            //if (obj.codigo == '87635.02' && obj.idItem == '84') { // Prueba Rapida Antigénica (Covid-19)
            //    $('#txtCovidResAnest').val(obj.valorCombo)
            //}


            //$('#').val()
            //$('#txtRxToraxResAnest').val()
            //$('#txtRqAnest').val()
            //$('#txtOrinaResAnest').val()
        })

        $('#txtGrupoRhResAnest').val(grupoRhResAnest)
    },
    CompletarDatosRegistro: async (atencion) => {
        let paciente = await RegistroEvaluacionesUCI.PacientesSeleccionarPorId(atencion.idPaciente)

        RegistroEvaluacionesUCI.idCuentaAtencion = atencion.idCuentaAtencion
        RegistroEvaluacionesUCI.idAtencion = atencion.idAtencion
        if (atencion.idAtencionUCI > 0) {
            RegistroEvaluacionesUCI.idAtencionUCI = atencion.idAtencionUCI
        }



        if (atencion.idServicioEgreso != '' && atencion.idServicioEgreso != null) {
            RegistroEvaluacionesUCI.IdServicio = atencion.idServicioEgreso
            RegistroEvaluacionesUCI.IdCama = atencion.idCamaActual
        } else {
            RegistroEvaluacionesUCI.IdServicio = atencion.idServicio
            RegistroEvaluacionesUCI.IdCama = atencion.idCamaIngreso

        }


        if (atencion.idCamaUCI != 0) {
            RegistroEvaluacionesUCI.IdCama = atencion.idCamaUCI
        }


        await Resultados.CargarLaboratorioMovimientosPorIdCuentaAtencion(atencion.idCuentaAtencion)
        await Resultados.CargarImagenesMovimientosPorIdCuentaAtencion(atencion.idCuentaAtencion)

        RegistroEvaluacionesUCI.nroEvaluacion = 1

        let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencionUCI)

        let comentarios = await RegistroEvaluacionesUCI.SeleccionarComentarioApreciacionUCIByIdAtencionUCI(RegistroEvaluacionesUCI.idAtencion)

        let otrasPatologias = await RegistroEvaluacionesUCI.SeleccionarOtraPatologiasObstetricasUCI(RegistroEvaluacionesUCI.idAtencion)

        let camas = await Utilitario.SeleccionarCamaByIdServicio(RegistroEvaluacionesUCI.IdServicio)

        if (!isEmpty(camas)) {
            if (camas.table.length > 0) {
                $('#cboCamaHospitalizacion').empty()
                $('#cboCamaHospitalizacion').append('<option  value="0">--Seleccionar--</option>')
                $(camas.table).each(function (i, obj) {
                    console.log('obj', obj)
                    $('#cboCamaHospitalizacion').append('<option  value="' + obj.idCama + '">' + obj.codigo + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }

        console.log('camas', camas)

        oTable_Evaluaciones.fnClearTable()
        oTable_ComentarioApreciacion.fnClearTable()
        oTable_OtrasPatologias.fnClearTable()

        $("#hdIdTipoFuenteFian").val(atencion.idTipoFinanciamiento);

        if (!isEmpty(evaluacionesUCI)) {
            if (evaluacionesUCI.length > 0) {
                oTable_Evaluaciones.fnAddData(evaluacionesUCI)
                $('#tblEvaluaciones tbody').find('tr').eq(0).addClass("selected");

                var objrowTb = oTable_Evaluaciones.api(true).row('.selected').data();

                RegistroEvaluacionesUCI.SeleccionarEvaluacion(objrowTb)

                OrdenMedica.nroEvaluaciones = evaluacionesUCI.length;

            } else {
                swal({
                    title: 'Evaluaciones',
                    text: 'Se iniciara con la Evaluacion N° 1 (Nota de Ingreso)',
                    type: 'info',
                }).done();

                $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
                $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

                Variables.NumeroEvaluacion = 1

                $('#lblNumeroEvaluacion').text(`Evaluación N° 1`)

                let monitoreoSoporteVentilatorio = await RegistroEvaluacionesUCI.SeleccionarMonitoreoSoporteVentilatorioUCI(RegistroEvaluacionesUCI.idAtencion, 1)
                let equiposMonitoreoHemodinamico = await RegistroEvaluacionesUCI.SeleccionarMonitoreoHemodinamicoUCI(RegistroEvaluacionesUCI.idAtencion, 1)
                let monitoreoNeurologico = await RegistroEvaluacionesUCI.SeleccionarMonitoreoNeurologicoUCI(RegistroEvaluacionesUCI.idAtencion, 1)
                let monitoreoUltrasonografia = await RegistroEvaluacionesUCI.SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle(RegistroEvaluacionesUCI.idAtencion, 1)

                oTable_MonitoreoSoporteVentilatorio.fnClearTable()
                oTable_MonitoreoHemodinamico.fnClearTable()
                oTable_MonitoreoNeurologico.fnClearTable()
                oTable_MonitoreoUltrasonografia.fnClearTable()

                if (monitoreoSoporteVentilatorio.length > 0) {
                    oTable_MonitoreoSoporteVentilatorio.fnAddData(monitoreoSoporteVentilatorio)
                }
                if (equiposMonitoreoHemodinamico.length > 0) {
                    oTable_MonitoreoHemodinamico.fnAddData(equiposMonitoreoHemodinamico)
                }
                if (monitoreoNeurologico.length > 0) {
                    oTable_MonitoreoNeurologico.fnAddData(monitoreoNeurologico)
                }
                if (monitoreoUltrasonografia.length > 0) {
                    oTable_MonitoreoUltrasonografia.fnAddData(monitoreoUltrasonografia)
                }

                await RegistroEvaluacionesUCI.LimpiarExamenes()

                let resultados = await RegistroEvaluacionesUCI.ListarResultadosLaboratorioByIdCuentaAtencion(RegistroEvaluacionesUCI.idCuentaAtencion)

                if (!isEmpty(resultados)) {
                    await RegistroEvaluacionesUCI.CompletarResultadosExamenes(resultados)
                }

            }
        }

        if (!isEmpty(comentarios)) {
            if (comentarios.length > 0)
                oTable_ComentarioApreciacion.fnAddData(comentarios)
        }

        if (!isEmpty(otrasPatologias)) {
            if (otrasPatologias.length > 0)
                oTable_OtrasPatologias.fnAddData(otrasPatologias)
        }

        //$('#cboProcedenciaUCI').val(atencion.tipoProcedencia)
        //$('#cboProcedenciaUCI').trigger('change')

        RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = atencion.establecimientoProcedenciaReferido
        RegistroEvaluacionesUCI.EstablecimientoProcedenciaInstitucional = atencion.establecimientoProcedenciaInstitucional

        await OrdenMedica.CargarOrdenesMedicasPorIdCuentaAtencion(Variables.IdCuentaAtencion);

        $('#cboProcedenciaHospital').val(atencion.establecimientoProcedenciaReferido)
        $('#cboProcedenciaServicio').val(isEmpty(atencion.establecimientoProcedenciaInstitucional) ? atencion.idServicioIngreso : atencion.establecimientoProcedenciaInstitucional)

        $('#txtIdReferenciaCita').val(atencion.codigoEstablecimientoOrigen)
        $('#txtDescripcionReferenciaCita').val(atencion.nombreEstablecimientoOrigen)

        $('#cboTipoIngresoUCIM').val(atencion.tipoIngresoUCI)

        $("#txtFechaIngresoMGP").datepicker("setDate", isEmpty(atencion.fechaIngresoMGP) ? atencion.fechaIngreso2 : atencion.fechaIngresoMGP)
        $('#txtHoraIngresoMGP').val(isEmpty(atencion.horaIngresoMGP) ? atencion.horaIngreso : atencion.horaIngresoMGP)

        //$("#txtFechaIngresoUCIM").datepicker("setDate", isEmpty(atencion.fechaIngresoUCI) ? moment().toDate().format('dd/mm/yyyy') : atencion.fechaIngresoUCI)
        //$('#txtHoraAtencionUCI').val(isEmpty(atencion.horaIngresoUCI) ? moment().toDate().format('HH:MM') : atencion.horaIngresoUCI)

        $("#txtFechaIngresoUCIM").datepicker("setDate", isEmpty(atencion.fechaIngresoUCI) ? '' : atencion.fechaIngresoUCI)
        $('#txtHoraAtencionUCI').val(isEmpty(atencion.horaIngresoUCI) ? '' : atencion.horaIngresoUCI)


        $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

        $('#cboCamaHospitalizacion').val(RegistroEvaluacionesUCI.IdCama)


        $('#txtNroCuenta').val(atencion.idCuentaAtencion)
        $('#txtNroHistoria').val(paciente.nroHistoriaClinica)
        $('#txtApellidosNombrePaciente').val(paciente.nombres)
        $('#cboEstadoCivil').val(paciente.idEstadoCivil)
        $("#txtFechaNacimiento").datepicker("setDate", paciente.fecNacimiento)
        $("#txtEdad").val(atencion.edadPaciente)
        $("#cboNacionalidad").val(paciente.idPaisNacimiento)
        $("#cboGradoInstruccion").val(paciente.idGradoInstruccion)
        $("#txtTelefono").val(paciente.telefono)
        $("#txtDireccion").val(paciente.direccionDomicilio)
        $("#txtDepartamentoProcedencia").val(paciente.nombreDepartamentoDomicilio)
        $("#txtProvinciaProcedencia").val(paciente.nombreProvinciaDomicilio)
        $("#txtDistritoProcedencia").val(paciente.nombreDistritoDomicilio)
        $("#txtCentroPobladoProcedencia").val(paciente.nombreCentroPobladoDomicilio)
        $("#txtPaisProcedencia").val(paciente.nombrePaisDomicilio)

        atencion.primipaternidad == 1 ? $('#rdbPrimipaternidadSi').prop('checked', true) : $('#rdbPrimipaternidadSi').prop('checked', false)
        $('#txtObstNroGestaciones').val(atencion.nroGestaciones)
        $('#txtNroPartosTermino').val(atencion.nroPartosTermino)
        $('#txtNroPartosPreTermino').val(atencion.nroPartosPreTermino)
        $('#txtNroGestacionesFrustras').val(atencion.nGestacionesFrustras)
        $('#txtNroHijosVivos').val(atencion.nroHijosVivos)
        $('#txtPeriodoIntergenesicoGinecoObst').val(atencion.periodoIntergenesico)
        $("#txtFechaUltimaMensGinecoObst").datepicker("setDate", atencion.fUltimaRegla)
        $('#cboCesareaGinecoObst').val(atencion.cesarea)
        $("#txtFechaUltimaCesareaGinecoObst").datepicker("setDate", atencion.fechaUltimaCesarea)
        atencion.menos2500g == 1 ? $('#ch2500').prop('checked', true) : $('#ch2500').prop('checked', false)
        atencion.multiple == 1 ? $('#chMultiple').prop('checked', true) : $('#chMultiple').prop('checked', false)
        atencion.menos37S == 1 ? $('#ch37Sem').prop('checked', true) : $('#ch37Sem').prop('checked', false)
        atencion.mayor4000g == 1 ? $('#ch4000g').prop('checked', true) : $('#ch4000g').prop('checked', false)
        atencion.obito == 1 ? $('#chObito').prop('checked', true) : $('#chObito').prop('checked', false)
        $('#cboAnteEnfHipertenEmbarazoGinecoObst').val(atencion.antecedenteEnfermedadHipertensivaEmbarazo)


        /* ---------------------------------------- Motivo Atención ---------------------------------------- */
        $('#cboCondicionIngreso').val(atencion.condicioningreso)
        $('#txtEdadGestacionalSemanas').val(atencion.edadgestacionalfinalsemanas)
        $('#txtEdadGestacionalDias').val(atencion.edadgestacionalfinaldias)
        $('#cboTipoParto').val(atencion.tipoparto)
        $('#cboCondicionProducto').val(atencion.condicionproducto)
        $('#txtTiempoEnfermedadDias').val(atencion.tiempoenfermedaddias)
        $('#txtTiempoEnfermedadHoras').val(atencion.tiempoenfermedadhoras)
        $('#txtSofaPreUCI').val(atencion.sofapreuci)
        $('#cboPrioridadIngresoUCI').val(atencion.prioridadingresouci)
        $('#cboTranstornoHipertenEmbarazo').val(atencion.transtornohipertensivoembarazo)
        $('#txtOtroTranstornoHipertenEmbarazo').val(atencion.transtornohipertensivoembarazootros)
        $('#cboOtrasEnfHipertenEmbarazo').val(atencion.otrasenfermedadeshipertensivasafectanembarazo)
        $('#txtOtroOtrasEnfHipertenEmbarazo').val(atencion.otrasenfermedadeshipertensivasafectanembarazootros)
        $('#cboMotivoHemorragicas').val(atencion.hemorragicas)
        $('#cboMotivoInfeccioso').val(atencion.infecciosas)
        $('#txtOtroMotivoInfeccioso').val(atencion.infecciosasotros)
        $('#cboMotivoGastroEnterico').val(atencion.gastroenterico)
        $('#txtOtroMotivoGastroEnterico').val(atencion.gastroentericootros)
        $('#cboMotivoRespiratorio').val(atencion.respiratorio)
        $('#txtOtroMotivoRespiratorio').val(atencion.respiratoriootros)
        $('#cboMotivoEndocrinoMetabolico').val(atencion.endocrinometabolico)
        $('#txtOtroMotivoEndocrinoMetabolico').val(atencion.endocrinometabolicootros)
        $('#cboMotivoCardiovascular').val(atencion.cardiovascular)
        $('#txtOtroMotivoCardiovascular').val(atencion.cardiovascularotros)
        $('#cboMotivoCirugiaIntrauterina').val(atencion.cirugiaintrauterina)
        $('#cboMotivoQuirurgicas').val(atencion.quirurgicas)
        $('#cboMotivoTraumatismo').val(atencion.traumatismo)
        //atencion.disfuncionesninguno == 1 ? $('#chkDisfuncionesNinguno').prop('checked', true) : $('#chkDisfuncionesNinguno').prop('checked', false)
        //atencion.disfuncionesrespiratorio == 1 ? $('#chkDisfuncionesRespiratorio').prop('checked', true) : $('#chkDisfuncionesRespiratorio').prop('checked', false)
        //atencion.disfuncioneshematologico == 1 ? $('#chkDisfuncionesHematologico').prop('checked', true) : $('#chkDisfuncionesHematologico').prop('checked', false)
        //atencion.disfuncionesrenal == 1 ? $('#chkDisfuncionesRenal').prop('checked', true) : $('#chkDisfuncionesRenal').prop('checked', false)
        //atencion.disfuncioneshepatico == 1 ? $('#chkDisfuncionesHepatico').prop('checked', true) : $('#chkDisfuncionesHepatico').prop('checked', false)
        //atencion.disfuncionesneurologico == 1 ? $('#chkDisfuncionesNeurologico').prop('checked', true) : $('#chkDisfuncionesNeurologico').prop('checked', false)
        //atencion.disfuncionesmetabolico == 1 ? $('#chkDisfuncionesMetabolico').prop('checked', true) : $('#chkDisfuncionesMetabolico').prop('checked', false)
        //atencion.disfuncionesuterina == 1 ? $('#chkDisfuncionesUterina').prop('checked', true) : $('#chkDisfuncionesUterina').prop('checked', false)
        //atencion.disfuncionescardiovascular == 1 ? $('#chkDisfuncionesCardiovascular').prop('checked', true) : $('#chkDisfuncionesCardiovascular').prop('checked', false)
        //atencion.disfuncionesgastrointestinal == 1 ? $('#chkDisfuncionesGastrointestinal').prop('checked', true) : $('#chkDisfuncionesGastrointestinal').prop('checked', false)
        //atencion.disfuncionesotro == 1 ? $('#chkDisfuncionesOtros').prop('checked', true) : $('#chkDisfuncionesOtros').prop('checked', false)
        //$('#txtDisfuncionesOtros').val(atencion.disfuncionesotrodescripcion)
        atencion.signossintomascefaleaholocraneana == 1 ? $('#chkMotivoCefaleaHolocraneana').prop('checked', true) : $('#chkMotivoCefaleaHolocraneana').prop('checked', false)
        atencion.signossintomascefaleafocalizada == 1 ? $('#chkMotivoCefaleaFocalizada').prop('checked', true) : $('#chkMotivoCefaleaFocalizada').prop('checked', false)
        atencion.signossintomasescotomas == 1 ? $('#chkMotivoEscotomas').prop('checked', true) : $('#chkMotivoEscotomas').prop('checked', false)
        atencion.signossintomastinitus == 1 ? $('#chkMotivoTinitus').prop('checked', true) : $('#chkMotivoTinitus').prop('checked', false)
        atencion.signossintomasvisionborrosa == 1 ? $('#chkMotivoVisionBorrosa').prop('checked', true) : $('#chkMotivoVisionBorrosa').prop('checked', false)
        atencion.signossintomasdesorientaciondelirio == 1 ? $('#chkMotivoDesorientacionDelirio').prop('checked', true) : $('#chkMotivoDesorientacionDelirio').prop('checked', false)
        atencion.signossintomasconvulsiones == 1 ? $('#chkMotivoConvulsiones').prop('checked', true) : $('#chkMotivoConvulsiones').prop('checked', false)
        atencion.signossintomasdisnea == 1 ? $('#chkMotivoDisnea').prop('checked', true) : $('#chkMotivoDisnea').prop('checked', false)
        atencion.signossintomasnauseasvomitos == 1 ? $('#chkMotivoNauseaVomito').prop('checked', true) : $('#chkMotivoNauseaVomito').prop('checked', false)
        atencion.signossintomasepigastralgia == 1 ? $('#chkMotivoEpigastralgia').prop('checked', true) : $('#chkMotivoEpigastralgia').prop('checked', false)
        atencion.signossintomasdolorhipocondrioderecho == 1 ? $('#chkMotivoDolorHipocondrioDerecho').prop('checked', true) : $('#chkMotivoDolorHipocondrioDerecho').prop('checked', false)
        atencion.signossintomasdolorabdominaldifuso == 1 ? $('#chkMotivoDolorAbdominal').prop('checked', true) : $('#chkMotivoDolorAbdominal').prop('checked', false)
        atencion.signossintomascontraccionesanormales == 1 ? $('#chkMotivoContraccionesAnormales').prop('checked', true) : $('#chkMotivoContraccionesAnormales').prop('checked', false)
        atencion.signossintomasedema == 1 ? $('#chkMotivoEdema').prop('checked', true) : $('#chkMotivoEdema').prop('checked', false)
        atencion.signossintomasorinaespumosa == 1 ? $('#chkMotivoOrinaEspumosa').prop('checked', true) : $('#chkMotivoOrinaEspumosa').prop('checked', false)
        atencion.signossintomasalteracionesurinarias == 1 ? $('#chkMotivoAlteracionesUrinarias').prop('checked', true) : $('#chkMotivoAlteracionesUrinarias').prop('checked', false)
        atencion.signossintomasperdidaliquidoamniotico == 1 ? $('#chkMotivoPerdidaLiquidoAmniotico').prop('checked', true) : $('#chkMotivoPerdidaLiquidoAmniotico').prop('checked', false)
        atencion.signossintomassangradovaginal == 1 ? $('#chkMotivoSangradoVaginal').prop('checked', true) : $('#chkMotivoSangradoVaginal').prop('checked', false)
        atencion.signossintomasotrodolorlocalizado == 1 ? $('#chkMotivoOtroDolorFocalizado').prop('checked', true) : $('#chkMotivoOtroDolorFocalizado').prop('checked', false)
        atencion.signossintomasdolorgeneralizado == 1 ? $('#chkMotivoDolorGeneralizado').prop('checked', true) : $('#chkMotivoDolorGeneralizado').prop('checked', false)
        atencion.signossintomasfiebre == 1 ? $('#chkMotivoFiebre').prop('checked', true) : $('#chkMotivoFiebre').prop('checked', false)
        atencion.signossintomasotro == 1 ? $('#chkMotivoOtrosSignosYSintomas').prop('checked', true) : $('#chkMotivoOtrosSignosYSintomas').prop('checked', false)
        $('#txtMotivoOtrosSignosYSintomas').val(atencion.signossintomasotrodescripcion)
        $('#txtRelatoCronologico').val(atencion.relatocronologico)
        /* ---------------------------------------- End Motivo Atención ---------------------------------------- */


        atencion.diabetes == 1 ? $('#rdbDiabetesFamiliarSi').prop('checked', true) : $('#rdbDiabetesFamiliarNo').prop('checked', true)
        $("#txtDiabetesFamiliar").val(atencion.diabetesDescripcion)
        atencion.diabetesPatMat == 1 ? $('#rdbDiabetesFamiliarPaterno').prop('checked', true) : atencion.diabetesPatMat == 2 ? $('#rdbDiabetesFamiliarMaterno').prop('checked', true) : atencion.diabetesPatMat == 3 ? $('#rdbDiabetesFamiliarAmbos').prop('checked', true) : ''

        atencion.tbc == 1 ? $('#rdbTBCFamiliarSi').prop('checked', true) : $('#rdbTBCFamiliarNo').prop('checked', true)
        $("#txtTBCFamiliar").val(atencion.tbcDescripcion)
        atencion.tbcPatMat == 1 ? $('#rdbTBCFamiliarPaterno').prop('checked', true) : atencion.tbcPatMat == 2 ? $('#rdbTBCFamiliarMaterno').prop('checked', true) : atencion.tbcPatMat == 3 ? $('#rdbTBCFamiliarAmbos').prop('checked', true) : ''

        atencion.hipertension == 1 ? $('#rdbHipertensionFamiliarSi').prop('checked', true) : $('#rdbHipertensionFamiliarNo').prop('checked', true)
        $("#txtHipertensionFamiliar").val(atencion.hipertensionDescripcion)
        atencion.hipertensionPatMat == 1 ? $('#rdbHipertensionFamiliarPaterno').prop('checked', true) : atencion.hipertensionPatMat == 2 ? $('#rdbHipertensionFamiliarMaterno').prop('checked', true) : atencion.hipertensionPatMat == 3 ? $('#rdbHipertensionFamiliarAmbos').prop('checked', true) : ''

        atencion.neoCancer == 1 ? $('#rdbMeoplasicoCancerFamiliarSi').prop('checked', true) : $('#rdbMeoplasicoCancerFamiliarNo').prop('checked', true)
        $("#txtMeoplasicoCancerFamiliar").val(atencion.neoCancerDescripcion)
        atencion.neoCancerPatMat == 1 ? $('#rdbMeoplasicoCancerFamiliarPaterno').prop('checked', true) : atencion.neoCancerPatMat == 2 ? $('#rdbMeoplasicoCancerFamiliarMaterno').prop('checked', true) : atencion.neoCancerPatMat == 3 ? $('#rdbMeoplasicoCancerFamiliarAmbos').prop('checked', true) : ''

        atencion.enfTiroidea == 1 ? $('#rdbEnfTiroideaFamiliarSi').prop('checked', true) : $('#rdbEnfTiroideaFamiliarNo').prop('checked', true)
        $("#txtEnfTiroideaFamiliar").val(atencion.enfTiroideaDescripcion)
        atencion.enfTiroideaPatMat == 1 ? $('#rdbEnfTiroideaFamiliarPaterno').prop('checked', true) : atencion.enfTiroideaPatMat == 2 ? $('#rdbEnfTiroideaFamiliarMaterno').prop('checked', true) : atencion.enfTiroideaPatMat == 3 ? $('#rdbEnfTiroideaFamiliarAmbos').prop('checked', true) : ''

        atencion.enfReumatica == 1 ? $('#rdbEnfReumaticaFamiliarSi').prop('checked', true) : $('#rdbEnfReumaticaFamiliarNo').prop('checked', true)
        $("#txtEnfReumaticaFamiliar").val(atencion.enfReumaticaDescripcion)
        atencion.enfReumaticaPatMat == 1 ? $('#rdbEnfReumaticaFamiliarPaterno').prop('checked', true) : atencion.enfReumaticaPatMat == 2 ? $('#rdbEnfReumaticaFamiliarMaterno').prop('checked', true) : atencion.enfReumaticaPatMat == 3 ? $('#rdbEnfReumaticaFamiliarAmbos').prop('checked', true) : ''

        atencion.asma == 1 ? $('#rdbAsmaFamiliarSi').prop('checked', true) : $('#rdbAsmaFamiliarNo').prop('checked', true)
        $("#txtAsmaFamiliar").val(atencion.asmaDescripcion)
        atencion.asmaPatMat == 1 ? $('#rdbAsmaFamiliarPaterno').prop('checked', true) : atencion.asmaPatMat == 2 ? $('#rdbAsmaFamiliarMaterno').prop('checked', true) : atencion.asmaPatMat == 3 ? $('#rdbAsmaFamiliarAmbos').prop('checked', true) : ''

        atencion.otros == 1 ? $('#rdbOtrosFamiliarSi').prop('checked', true) : $('#rdbOtrosFamiliarNo').prop('checked', true)
        $("#txtOtrosFamiliar").val(atencion.otrosDescripcion)
        atencion.otrosPatMat == 1 ? $('#rdbOtrosFamiliarPaterno').prop('checked', true) : atencion.otrosPatMat == 2 ? $('#rdbOtrosFamiliarMaterno').prop('checked', true) : atencion.otrosPatMat == 3 ? $('#rdbOtrosFamiliarAmbos').prop('checked', true) : ''

        $("#txtGrupoSanguineo").val(atencion.grupoSanguineo)
        $("#txtFactor").val(atencion.factor)
        $("#cboActividadFisica").val(atencion.actividadFisica)

        $('#cboAlimentacion').val(atencion.alimentacion1)

        $(`input[name="rdbEstadoNutricional"][value="${atencion.estadoNutricional}"]`).prop('checked', true)
        $(`input[name="rdbGravedadEnfermedad"][value="${atencion.gravedadEnfermedad}"]`).prop('checked', true)
        $('#txtIncrementoPeso').val(atencion.incrementoPeso)
        //atencion.alimentacion1 == 1 ? $('#chkAlimentacion1').prop('checked', true) : $('#chkAlimentacion1').prop('checked', false)
        //atencion.alimentacion2 == 1 ? $('#chkAlimentacion2').prop('checked', true) : $('#chkAlimentacion2').prop('checked', false)
        //atencion.alimentacion3 == 1 ? $('#chkAlimentacion3').prop('checked', true) : $('#chkAlimentacion3').prop('checked', false)


        atencion.alimentacionMas3 == 1 ? $('#chkAlimentacionMas3').prop('checked', true) : $('#chkAlimentacionMas3').prop('checked', false)
        atencion.tipoAlimentacionCarnes == 1 ? $('#chkTipoAlimentacionCarnes').prop('checked', true) : $('#chkTipoAlimentacionCarnes').prop('checked', false)
        atencion.tipoAlimentacionMixta == 1 ? $('#chkTipoAlimentacionMixta').prop('checked', true) : $('#chkTipoAlimentacionMixta').prop('checked', false)
        atencion.tipoAlimentacionVegetariana == 1 ? $('#chkTipoAlimentacionVegetariana').prop('checked', true) : $('#chkTipoAlimentacionVegetariana').prop('checked', false)
        atencion.tipoAlimentacionProcesados == 1 ? $('#chkTipoAlimentacionProcesados').prop('checked', true) : $('#chkTipoAlimentacionProcesados').prop('checked', false)
        atencion.tipoAlimentacionOtro == 1 ? $('#chkTipoAlimentacionOtro').prop('checked', true) : $('#chkTipoAlimentacionOtro').prop('checked', false)
        $("#txtTipoAlimentacionOtroDescripcion").val(atencion.tipoAlimentacionOtroDescripcion)

        atencion.vacunaInfluenza == 1 ? $('#rdbVacunaInfluenzaSi').prop('checked', true) : $('#rdbVacunaInfluenzaNo').prop('checked', true)
        $("#txtVacunaInfluenza").val(atencion.vacunaInfluenzaDescripcion)
        atencion.vacunaDTAdulta == 1 ? $('#rdbVacunaDTAdultoSi').prop('checked', true) : $('#rdbVacunaDTAdultoNo').prop('checked', true)
        $("#txtVacunaDTAdulto").val(atencion.vacunaDTAdultaDescripcion)
        atencion.vacunaTexoideTetanico == 1 ? $('#rdbVacunaTexoideTetanicoSi').prop('checked', true) : $('#rdbVacunaTexoideTetanicoNo').prop('checked', true)
        $("#txtVacunaTexoideTetanico").val(atencion.vacunaTexoideTetanicoDescripcion)
        atencion.vacunaFiebreAmarilla == 1 ? $('#rdbVacunaFiebreAmarillaSi').prop('checked', true) : $('#rdbVacunaFiebreAmarillaNo').prop('checked', true)
        $("#txtVacunaFiebreAmarilla").val(atencion.vacunaFiebreAmarillaDescripcion)
        atencion.vacunaHepatitisB == 1 ? $('#rdbVacunaHepatitisBSi').prop('checked', true) : $('#rdbVacunaHepatitisBNo').prop('checked', true)
        $("#txtVacunaHepatitisB").val(atencion.vacunaHepatitisBDescripcion)
        atencion.vacunaBCG == 1 ? $('#rdbVacunaBCGSi').prop('checked', true) : $('#rdbVacunaBCGNo').prop('checked', true)
        $("#txtVacunaBCG").val(atencion.vacunaBCGDescripcion)
        atencion.vacunaPapilomavirus == 1 ? $('#rdbVacunaPapilomavirusSi').prop('checked', true) : $('#rdbVacunaPapilomavirusNo').prop('checked', true)
        $("#txtVacunaPapilomavirus").val(atencion.vacunaPapilomavirusDescripcion)
        atencion.vacunaOtra == 1 ? $('#rdbVacunaOtraSi').prop('checked', true) : $('#rdbVacunaOtraNo').prop('checked', true)
        $("#txtVacunaOtra").val(atencion.vacunaOtraDescripcion)

        $(`input[name="rdbBebidasAlcoholicasHabNoc"][value="${atencion.hbBebidasAlcoholicas ?? 0}"]`).prop("checked", true);
        $("#txtBebidasAlcoholicasHabNoc").val(atencion.hbBebidasAlcoholicasDescripcion ?? "");

        $(`input[name="rdbDrogasHabNoc"][value="${atencion.hbDrogas ?? 0}"]`).prop("checked", true);
        $("#txtDrogasHabNoc").val(atencion.hbDrogasDescripcion ?? "");

        $(`input[name="rdbTabacoCigarrosHabNoc"][value="${atencion.hbTabacoCigarros ?? 0}"]`).prop("checked", true);
        $("#txtTabacoCigarrosHabNoc").val(atencion.hbTabacoCigarrosDescripcion ?? "");

        $(`input[name="rdbOtrosHabNoc"][value="${atencion.hbOtros ?? 0}"]`).prop("checked", true);
        $("#txtOtrosHabNoc").val(atencion.hbOtrosDescripcion ?? "");



        atencion.alergFarmacologicas == 1 ? $('#rdbFarmacologicasAlerSi').prop('checked', true) : $('#rdbFarmacologicasAlerNo').prop('checked', true)
        $("#txtFarmacologicasAler").val(atencion.alergFarmacologicasDescripcion)
        atencion.alergAlimentacion == 1 ? $('#rdbAlimentacionAlerSi').prop('checked', true) : $('#rdbAlimentacionAlerNo').prop('checked', true)
        $("#txtAlimentacionAler").val(atencion.alergAlimentacionDescripcion)
        atencion.alergOtros == 1 ? $('#rdbOtrosAlerSi').prop('checked', true) : $('#rdbOtrosAlerNo').prop('checked', true)
        $("#txtOtrosAler").val(atencion.alergOtrosDescripcion)
        $("#txtSignosSintomasAler").val(atencion.alergSignosSintomas)
        $("#txtRam").val(atencion.ram)

        $('#chkCovid19Pat').prop('checked', atencion.patInfecciosaCovid19 == 1);
        $('#chkVihPat').prop('checked', atencion.patInfecciosaVIH == 1);
        $('#chkSifilisPat').prop('checked', atencion.patInfecciosaSifilis == 1);
        $('#chkTuberculosisPat').prop('checked', atencion.patInfecciosaTuberculosis == 1);
        $('#chkHepatitisPat').prop('checked', atencion.patInfecciosaHepatitis == 1);
        $('#chkMalariaPat').prop('checked', atencion.patInfecciosaMalaria == 1);
        $('#chkDenguePat').prop('checked', atencion.patInfecciosaDengue == 1);
        $('#chkInfecciosaNingunaPat').prop('checked', atencion.patInfecciosaNinguna == 1);
        $('#chkOtroInfecciosaPat').prop('checked', atencion.patInfecciosaOtro == 1);
        $("#txtDescripcionOtroInfecciosaPat").val(atencion.patInfecciosaOtroDescripcion)

        $('#chkDiabetesMellitusIPat').prop('checked', atencion.patMetaBiabetesMellitusI == 1);
        $('#chkDiabetesMellitusIIPat').prop('checked', atencion.patMetaBiabetesMellitusII == 1);
        $('#chkObesidadPat').prop('checked', atencion.patMetaObesidad == 1);
        $('#chkCirrosisPat').prop('checked', atencion.patMetaCirrosis == 1);
        $('#chkHipotiroidismoPat').prop('checked', atencion.patMetaHipotiroidismo == 1);
        $('#chkHipertiroidismoPat').prop('checked', atencion.patMetaHipertiroidismo == 1);
        $('#chkHigadoGrasoPat').prop('checked', atencion.patMetaHigadoGraso == 1);
        $('#chkMetabolicaNingunaPat').prop('checked', atencion.patMetaNinguna == 1);
        $('#chkOtroMetabolicaPat').prop('checked', atencion.patMetaOtro == 1);
        $("#txtDescripcionOtroMetabolicaPat").val(atencion.patMetaOtroDescripcion)

        $('#chkHiperArterialPat').prop('checked', atencion.patCardioHipertenArterial == 1);
        $('#chkAsmaPat').prop('checked', atencion.patCardioAsma == 1);
        $('#chkFibrosisPulmPat').prop('checked', atencion.patCardioFibrosisPulmonar == 1);
        $('#chkPulmObstruPat').prop('checked', atencion.patCardioEnfPulmonarObstructivaCronica == 1);
        $('#chkCardioConPat').prop('checked', atencion.patCardioCardiopatiaCongenita == 1);
        $('#chkInsuCardPat').prop('checked', atencion.patCardioInsuficienciaCardiaca == 1);
        $('#chkCardiorespiratoriaNingunaPat').prop('checked', atencion.patCardioNinguna == 1);
        $('#chkOtroCardioPat').prop('checked', atencion.patCardioOtro == 1);
        $("#txtDescripcionOtroCardioPat").val(atencion.patCardioOtroDescripcion)

        $('#chkEnfCerebrovascularPat').prop('checked', atencion.patNeuroEnfCerebrovascular == 1);
        $('#chkEpilepsiaPat').prop('checked', atencion.patNeuroEpilepsia == 1);
        $('#chkSdGuillanBarrePat').prop('checked', atencion.patNeuroSdGuillainBarre == 1);
        $('#chkEncefalopatiaHipoxicaPat').prop('checked', atencion.patNeuroEncefaHipoxicaPostRCP == 1);
        $('#chkELAPat').prop('checked', atencion.patNeuroELA == 1);
        $('#chkAusenciaExtremidadPat').prop('checked', atencion.patNeuroAusenciaExtremidad == 1);
        $('#chkNeurologicaNingunaPat').prop('checked', atencion.patNeuroNinguna == 1);
        $('#chkOtroNeuroPat').prop('checked', atencion.patNeuroOtro == 1);
        $("#txtDescripcionOtroNeuroPat").val(atencion.patNeuroOtroDescripcion)

        $('#chkLupusEritematosoPat').prop('checked', atencion.patReumaLupusEritematoso == 1);
        $('#chkArtritisReumatoidePat').prop('checked', atencion.patReumaArtritisReumatoide == 1);
        $('#chkSindromeAntifosPat').prop('checked', atencion.patReumaSindromeAntifosfolipidico == 1);
        $('#chkCancerPat').prop('checked', atencion.patReumaCancer == 1);
        $('#chkTrasplantePat').prop('checked', atencion.patReumaTrasplante == 1);
        $('#chkReumaticaNingunaPat').prop('checked', atencion.patReumaNinguna == 1);
        $('#chkOtroReumaPat').prop('checked', atencion.patReumaOtro == 1);
        $("#txtDescripcionOtroReumaPat").val(atencion.patReumaOtroDescripcion)

        $(`input[name="rdbCirugiasPreviasQuirur"][value="${atencion.cirugiasPrevias ?? 0}"]`).prop("checked", true);
        $("#txtCirugiasPreviasQuirur").val(atencion.cirugiasPreviasDescripcion)
        $("#txtFechaUltimaCiruQuirur").datepicker("setDate", atencion.fecUltimaCirugia)

        $("#txtMedicacionHabitual").val(atencion.medicacionHabitual)
        $("#txtAnioUltimaVacunaCovid").val(atencion.anioUltimaVacunaCovid)

        RegistroEvaluacionesUCI.HabilitarDeshabilitarInputs()

        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#cboTranstornoHipertenEmbarazo').trigger('change')
        $('#cboOtrasEnfHipertenEmbarazo').trigger('change')
        $('#cboMotivoInfeccioso').trigger('change')
        $('#cboMotivoGastroEnterico').trigger('change')
        $('#cboMotivoRespiratorio').trigger('change')
        $('#cboMotivoEndocrinoMetabolico').trigger('change')
        $('#cboMotivoCardiovascular').trigger('change')
    },
    CargarDatosEvaluacion: async (examenFisico, intervenciones, examenesAuxiliares, monitoreo) => {
        console.log('examenFisico', examenFisico)


        $('#txtEFisicoEctoscopia').val(!isEmpty(examenFisico) ? examenFisico.ectoscopia : '')
        $('#txtEFisicoNeurologico').val(!isEmpty(examenFisico) ? examenFisico.examenneurologico : '')
        $('#txtEFisicoEscalaGlasgow').val(!isEmpty(examenFisico) ? examenFisico.escalaglasgow : '')
        $('#cboEFisicoNivelConciencia').val(!isEmpty(examenFisico) ? examenFisico.nivelconciencia : '')
        $('#cboEFisicoDelirio').val(!isEmpty(examenFisico) ? examenFisico.delirio : '')
        $('#txtEFisicoEscalaSedacion').val(!isEmpty(examenFisico) ? examenFisico.escalasedacion : '')
        $('#txtEFisicoBISS').val(!isEmpty(examenFisico) ? examenFisico.monitoreosedacionbiss : '')
        $('#cboEFisicoFMS').val(!isEmpty(examenFisico) ? examenFisico.fuerzamuscular : '')
        $('#cboEFisicoReflejoNeuro').val(!isEmpty(examenFisico) ? examenFisico.neurologicoreflejo4 : '')
        $('#txtEFisicoEscalaDolor').val(!isEmpty(examenFisico) ? examenFisico.escaladolor : '')
        $('#txtEFisicoCardioEvaluacionCardiovascular').val(!isEmpty(examenFisico) ? examenFisico.evaluacioncardiovascular : '')
        $('#cboEFisicoRitmocardiaco').val(!isEmpty(examenFisico) ? examenFisico.ritmocardiaco : '')
        $('#txtEFisicoTipoRitmocardiaco').val(!isEmpty(examenFisico) ? examenFisico.tiporitmocardiaco : '')
        $('#txtEFisicoCardioIShock').val(!isEmpty(examenFisico) ? examenFisico.indiceshock : '')
        $('#txtEFisicoCardioGCNoInva').val(!isEmpty(examenFisico) ? examenFisico.gastocardiaconoinvasivo : '')
        $('#txtEFisicoCardioIndiceCardiaco').val(!isEmpty(examenFisico) ? examenFisico.indicecardiaco : '')
        $('#txtEFisicoRespiratorioExamenResp').val(!isEmpty(examenFisico) ? examenFisico.examenrespiratorio : '')
        $('#cboEFisicoRespManejoViaAerea').val(!isEmpty(examenFisico) ? examenFisico.manejoviaaerea : '')
        $('#cboEFisicoRespSoporteVentilatorio').val(!isEmpty(examenFisico) ? examenFisico.tiposoporteoxigenatorioventilatorio : '')
        $('#txtEFisicoRespFIO').val(!isEmpty(examenFisico) ? examenFisico.fraccioninspiratoriao2 : '')
        $('#txtEFisicoSoFio2').val(!isEmpty(examenFisico) ? examenFisico.saturacionoxigenofio2 : '')
        $('#txtEFisicoIndiceKirby').val(!isEmpty(examenFisico) ? examenFisico.indicekirbypao2fio2 : '')
        $('#txtEFisicoIndiceRox').val(!isEmpty(examenFisico) ? examenFisico.indicerox : '')
        $('#txtEFisicoIOxigenatorio').val(!isEmpty(examenFisico) ? examenFisico.indiceoxigenatorio : '')
        $('#txtEFisicoPMedViaArea').val(!isEmpty(examenFisico) ? examenFisico.presionmediaviaaerea : '')
        $('#cboEFisicoRadioTorax').val(!isEmpty(examenFisico) ? examenFisico.radiografiatoraxpatologica : '')
        $('#txtEFisicoCuadrantesAfectados').val(!isEmpty(examenFisico) ? examenFisico.cuadrantesafectados : '')
        $('#txtEFisicoRadioToraxDescripcion').val(!isEmpty(examenFisico) ? examenFisico.radiotoraxdescripcion : '')
        $('#cboEFisicoEcoPulmonar').val(!isEmpty(examenFisico) ? examenFisico.ecografiapulmonarhallazgosliding : '')
        $('#txtEFisicoPerfilEcografico').val(!isEmpty(examenFisico) ? examenFisico.perfilecografico : '')
        $('#cboEFisicoTomToracicaPatologica').val(!isEmpty(examenFisico) ? examenFisico.tomografiatoracicapatologica : '')
        $('#txtEFisicoTomografiaTorax').val(!isEmpty(examenFisico) ? examenFisico.tomografiatorax : '')
        $('#cboEFisicoEstudioImagenesOtro').val(!isEmpty(examenFisico) ? examenFisico.otroestudio : '')
        $('#txtEFisicoEstudioImagenesOtroDescripcion').val(!isEmpty(examenFisico) ? examenFisico.otroestudiodescripcion : '')
        $('#cboEFisicoNeumotorax').val(!isEmpty(examenFisico) ? examenFisico.neumotorax : '')
        $('#cboEFisicoSDRA').val(!isEmpty(examenFisico) ? examenFisico.sindromedistresrespiratorio : '')
        $('#cboEFisicoGDRA').val(!isEmpty(examenFisico) ? examenFisico.gradodistresrespiratorio : '')
        !isEmpty(examenFisico) && examenFisico.drenajetoracicosistemasimple == 1 ? $('#chkDrenajeToracicoSistemaSimple').prop('checked', true) : $('#chkDrenajeToracicoSistemaSimple').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.drenajetoracicosistematrescamaras == 1 ? $('#chkDrenajeToracicoSistemaTresCamaras').prop('checked', true) : $('#chkDrenajeToracicoSistemaTresCamaras').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.presionnegativacontinua == 1 ? $('#chkPresionNegativaContinua').prop('checked', true) : $('#chkPresionNegativaContinua').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.otrodispositivo == 1 ? $('#chkOtroDispositivo').prop('checked', true) : $('#chkOtroDispositivo').prop('checked', false)
        $('#txtDescripcionOtroDispositivo').val(!isEmpty(examenFisico) ? examenFisico.descripcionotrodispositivo : '')
        $('#txtEFisicoAbdomenExamenAbdominal').val(!isEmpty(examenFisico) ? examenFisico.examenabdominal : '')
        $('#cboEAbdomenIncisiones').val(!isEmpty(examenFisico) ? examenFisico.incisiones : '')
        $('#cboEAbdomenAceptacion').val(!isEmpty(examenFisico) ? examenFisico.afectacionesactuales : '')
        !isEmpty(examenFisico) && examenFisico.drenajeabdominal == 1 ? $('#rdbDrenajeAbdominalSi').prop('checked', true) : $('#rdbDrenajeAbdominalNo').prop('checked', true)
        $('#txtDrenajeAbdominal').val(!isEmpty(examenFisico) ? examenFisico.drenajeabdominaldescripcion : '')
        !isEmpty(examenFisico) && examenFisico.sondanasogastrica == 1 ? $('#rdbSondaNasogastricaSi').prop('checked', true) : $('#rdbSondaNasogastricaNo').prop('checked', true)
        $('#txtSondaNasogastrica').val(!isEmpty(examenFisico) ? examenFisico.sondanasogastricadescripcion : '')
        !isEmpty(examenFisico) && examenFisico.bolsalaparotomia == 1 ? $('#rdbBolsaLaparotomiaSi').prop('checked', true) : $('#rdbBolsaLaparotomiaNo').prop('checked', true)
        $('#txtBolsaLaparotomia').val(!isEmpty(examenFisico) ? examenFisico.bolsalaparotomiadescripcion : '')
        !isEmpty(examenFisico) && examenFisico.vac == 1 ? $('#rdbVacSi').prop('checked', true) : $('#rdbVacNo').prop('checked', true)
        $('#txtVac').val(!isEmpty(examenFisico) ? examenFisico.vacdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.sondaurinaria == 1 ? $('#rdbSondaUrinariaSi').prop('checked', true) : $('#rdbSondaUrinariaNo').prop('checked', true)
        $('#txtSondaUrinaria').val(!isEmpty(examenFisico) ? examenFisico.sondaurinariadescripcion : '')
        !isEmpty(examenFisico) && examenFisico.otroinvasivodispositivo == 1 ? $('#rdbOtroInvasivoDispositivoSi').prop('checked', true) : $('#rdbOtroInvasivoDispositivoNo').prop('checked', true)
        $('#txtOtroInvasivoDispositivo').val(!isEmpty(examenFisico) ? examenFisico.otroinvasivodispositivodescripcion : '')
        $('#txtPerimetroAbd6').val(!isEmpty(examenFisico) ? examenFisico.perimetroabd6h : '')
        $('#txtPIA6').val(!isEmpty(examenFisico) ? examenFisico.pia6h : '')
        $('#txtPerimetroAbd12').val(!isEmpty(examenFisico) ? examenFisico.perimetroabd12h : '')
        $('#txtPIA12').val(!isEmpty(examenFisico) ? examenFisico.pia12h : '')
        $('#txtPerimetroAbd18').val(!isEmpty(examenFisico) ? examenFisico.perimetroabd18h : '')
        $('#txtPIA18').val(!isEmpty(examenFisico) ? examenFisico.pia18h : '')
        $('#txtPerimetroAbd24').val(!isEmpty(examenFisico) ? examenFisico.perimetroabd24h : '')
        $('#txtPIA24').val(!isEmpty(examenFisico) ? examenFisico.pia24h : '')
        !isEmpty(examenFisico) && examenFisico.gastrocineticos == 1 ? $('#chkEAbdomenGastrocineticos').prop('checked', true) : $('#chkEAbdomenGastrocineticos').prop('checked', false)
        $('#txtDeposiciones').val(!isEmpty(examenFisico) ? examenFisico.deposiciones : '')
        $('#txtEFisicoExamenUrinarioRenal').val(!isEmpty(examenFisico) ? examenFisico.examenurinariorenal : '')
        $('#txtDiuresis6').val(!isEmpty(examenFisico) ? examenFisico.diuresis6h : '')
        $('#txtDiuresis12').val(!isEmpty(examenFisico) ? examenFisico.diuresis12h : '')
        $('#txtDiuresis24').val(!isEmpty(examenFisico) ? examenFisico.diuresis24h : '')
        !isEmpty(examenFisico) && examenFisico.diuretico == 1 ? $('#chkUrinarioDiuretico').prop('checked', true) : $('#chkUrinarioDiuretico').prop('checked', false)
        $('#txtUrinarioNombreDiuretico').val(!isEmpty(examenFisico) ? examenFisico.nombrediuretico : '')
        $('#cboUrinarioDiureticoDosis').val(!isEmpty(examenFisico) ? examenFisico.dosisdiuretico : '')
        $('#txtUrinarioOtraDiureticoDosis').val(!isEmpty(examenFisico) ? examenFisico.descripciondosisdiuretico : '')
        $('#cboUrinarioTRR').val(!isEmpty(examenFisico) ? examenFisico.terapiareemplazorenal : '')
        $('#txtUrinarioNroSesion').val(!isEmpty(examenFisico) ? examenFisico.nrosesion : '')
        $('#txtUrinarioUltrafiltrado').val(!isEmpty(examenFisico) ? examenFisico.ultrafiltrado : '')
        $('#txtEFisicoExamenPielFaneras').val(!isEmpty(examenFisico) ? examenFisico.examenpielfaneras : '')
        $('#cboPielFanerasEdema').val(!isEmpty(examenFisico) ? examenFisico.edemapielfaneras : '')
        !isEmpty(examenFisico) && examenFisico.lesionporpresion == 1 ? $('#rdbLesionPorPresionSi').prop('checked', true) : $('#rdbLesionPorPresionNo').prop('checked', true)
        $('#cboPielGradoLesionPresion').val(!isEmpty(examenFisico) ? examenFisico.gradopielfaneras : '')
        $('#cboPielLesionPresionUbicacion').val(!isEmpty(examenFisico) ? examenFisico.ubicacionpielfaneras : '')
        !isEmpty(examenFisico) && examenFisico.signoshipoperfusionninguno == 1 ? $('#chkSignosHipoperfusionNinguno').prop('checked', true) : $('#chkSignosHipoperfusionNinguno').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.signoshipoperfusionacrocianosis == 1 ? $('#chkSignosHipoperfusionAcrocianosis').prop('checked', true) : $('#chkSignosHipoperfusionAcrocianosis').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.signoshipoperfusionmoteado == 1 ? $('#chkSignosHipoperfusionMoteado').prop('checked', true) : $('#chkSignosHipoperfusionMoteado').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.signoshipoperfusionfrialdaddistal == 1 ? $('#chkSignosHipoperfusionFrialdadDistal').prop('checked', true) : $('#chkSignosHipoperfusionFrialdadDistal').prop('checked', false)
        !isEmpty(examenFisico) && examenFisico.signoshipoperfusionllenadocapilar == 1 ? $('#chkSignosHipoperfusionLlenadoCapilar').prop('checked', true) : $('#chkSignosHipoperfusionLlenadoCapilar').prop('checked', false)
        $('#txtEFisicoExamenExtremidades').val(!isEmpty(examenFisico) ? examenFisico.examenextremidades : '')
        $('#cboEFisicoExamenColumna').val(!isEmpty(examenFisico) ? examenFisico.examencolumna : '')
        $('#txtDescripcionExamenGinecologico').val(!isEmpty(examenFisico) ? examenFisico.examenginecologico : '')
        $('#cboEGinecoGlandulaMamaria').val(!isEmpty(examenFisico) ? examenFisico.glandulamamaria : '')
        $('#textEGinecoLFC').val(!isEmpty(examenFisico) ? examenFisico.lcf : '')
        $('#textEGinecoMovFetales').val(!isEmpty(examenFisico) ? examenFisico.movfetales : '')
        $('#cboEGinecoUtero').val(!isEmpty(examenFisico) ? examenFisico.utero : '')
        !isEmpty(examenFisico) && examenFisico.geybus == 1 ? $('#rdbGEyBUSSi').prop('checked', true) : $('#rdbGEyBUSNo').prop('checked', true)
        $('#txtGEyBUS').val(!isEmpty(examenFisico) ? examenFisico.geybusdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.vagina == 1 ? $('#rdbVaginaSi').prop('checked', true) : $('#rdbVaginaNo').prop('checked', true)
        $('#txtVagina').val(!isEmpty(examenFisico) ? examenFisico.vaginadescripcion : '')
        !isEmpty(examenFisico) && examenFisico.cervix == 1 ? $('#rdbCervixSi').prop('checked', true) : $('#rdbCervixNo').prop('checked', true)
        $('#txtCervix').val(!isEmpty(examenFisico) ? examenFisico.cervixdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.utero1 == 1 ? $('#rdbUteroSi').prop('checked', true) : $('#rdbUteroNo').prop('checked', true)
        $('#txtUtero').val(!isEmpty(examenFisico) ? examenFisico.utero1descripcion : '')
        !isEmpty(examenFisico) && examenFisico.anexos == 1 ? $('#rdbAnexosSi').prop('checked', true) : $('#rdbAnexosNo').prop('checked', true)
        $('#txtAnexos').val(!isEmpty(examenFisico) ? examenFisico.anexosdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.fsdouglas == 1 ? $('#rdbFSDouglasSi').prop('checked', true) : $('#rdbFSDouglasNo').prop('checked', true)
        $('#txtFSDouglas').val(!isEmpty(examenFisico) ? examenFisico.fsdouglasdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.parametrios == 1 ? $('#rdbParametriosSi').prop('checked', true) : $('#rdbParametriosNo').prop('checked', true)
        $('#txtParametrios').val(!isEmpty(examenFisico) ? examenFisico.parametriosdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.mamas == 1 ? $('#rdbMamasSi').prop('checked', true) : $('#rdbMamasNo').prop('checked', true)
        $('#txtMamas').val(!isEmpty(examenFisico) ? examenFisico.mamasdescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccioncomunitaria == 1 ? $('#rdbInfeccioComunitariaSi').prop('checked', true) : $('#rdbInfeccioComunitariaNo').prop('checked', true)
        $('#txtInfeccioComunitaria').val(!isEmpty(examenFisico) ? examenFisico.infeccioncomunitariadescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccionintrahospitalaria == 1 ? $('#rdbInfeccionIntrahospitalariaSi').prop('checked', true) : $('#rdbInfeccionIntrahospitalariaNo').prop('checked', true)
        $('#txtInfeccionIntrahospitalaria').val(!isEmpty(examenFisico) ? examenFisico.infeccionintrahospitalariadescripcion : '')

        !isEmpty(examenFisico) && examenFisico.infeccionHemocultivo == 1 ? $('#rdbInfeccionHemocultivoSi').prop('checked', true) : $('#rdbInfeccionHemocultivoNo').prop('checked', true)
        $('#txtInfeccionHemocultivo').val(!isEmpty(examenFisico) ? examenFisico.infeccionHemocultivoDescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccionSecrecionBronquial == 1 ? $('#rdbInfeccionSecrecionBronquialSi').prop('checked', true) : $('#rdbInfeccionSecrecionBronquialNo').prop('checked', true)
        $('#txtInfeccionSecrecionBronquial').val(!isEmpty(examenFisico) ? examenFisico.infeccionSecrecionBronquialDescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccionOrina == 1 ? $('#rdbInfeccionOrinaSi').prop('checked', true) : $('#rdbInfeccionOrinaNo').prop('checked', true)
        $('#txtInfeccionOrina').val(!isEmpty(examenFisico) ? examenFisico.infeccionOrinaDescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccionHeces == 1 ? $('#rdbInfeccionHecesSi').prop('checked', true) : $('#rdbInfeccionHecesNo').prop('checked', true)
        $('#txtInfeccionHeces').val(!isEmpty(examenFisico) ? examenFisico.infeccionHecesDescripcion : '')
        !isEmpty(examenFisico) && examenFisico.infeccionSecreciones == 1 ? $('#rdbInfeccionSecrecionesSi').prop('checked', true) : $('#rdbInfeccionSecrecionesNo').prop('checked', true)
        $('#txtInfeccionSecreciones').val(!isEmpty(examenFisico) ? examenFisico.infeccionSecrecionesDescripcion : '')

        $('#txtFechaTomaHemocultivo').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaTomaHemocultivo : '')
        $('#txtFechaResultadosHemocultivo').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaResultadosHemocultivo : '')
        $('#txtFechaTomaSecrecionBronquial').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaTomaSecrecionBronquial : '')
        $('#txtFechaResultadosSecrecionBronquial').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaResultadosSecrecionBronquial : '')
        $('#txtFechaTomaOrina').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaTomaOrina : '')
        $('#txtFechaResultadosOrina').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaResultadosOrina : '')
        $('#txtFechaTomaHeces').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaTomaHeces : '')
        $('#txtFechaResultadosHeces').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaResultadosHeces : '')
        $('#txtFechaTomaSecreciones').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaTomaSecreciones : '')
        $('#txtFechaResultadosSecreciones').val(!isEmpty(examenFisico) ? examenFisico.infeccionFechaResultadosSecreciones : '')

        !isEmpty(examenFisico) && examenFisico.estudioPorImagenes == 1 ? $('#rdbEstudioPorImagenesSi').prop('checked', true) : $('#rdbEstudioPorImagenesNo').prop('checked', true)
        !isEmpty(examenFisico) && examenFisico.hallazgos == 1 ? $('#rdbHallazgosSi').prop('checked', true) : $('#rdbHallazgosNo').prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.estudioPorImagenes == 1 ? $('#contEstudiPorImagenes').show() : $('#contEstudiPorImagenes').hide()
        !isEmpty(examenFisico) && examenFisico.hallazgos == 1 ? $('#contHallzagos').show() : $('#contHallzagos').hide()

        !isEmpty(examenFisico) && examenFisico.dispositivoMedicionPIA == 1 ? $('#rdbDispositivoMedicionPIASi').prop('checked', true) : $('#rdbDispositivoMedicionPIANo').prop('checked', true)
        $('#txtDispositivoMedicionPIA').val(!isEmpty(examenFisico) ? examenFisico.dispositivoMedicionPIADescripcion : '')

        !isEmpty(examenFisico) && examenFisico.taponamientoPelvico == 1 ? $('#rdbTaponamientoPelvicoSi').prop('checked', true) : $('#rdbTaponamientoPelvicoNo').prop('checked', true)
        $('#txtTaponamientoPelvico').val(!isEmpty(examenFisico) ? examenFisico.taponamientoPelvicoDescripcion : '')

        !isEmpty(examenFisico) && examenFisico.taponamientoHepatico == 1 ? $('#rdbTaponamientoHepaticoSi').prop('checked', true) : $('#rdbTaponamientoHepaticoNo').prop('checked', true)
        $('#txtTaponamientoHepatico').val(!isEmpty(examenFisico) ? examenFisico.taponamientoHepaticoDescripcion : '')

        !isEmpty(examenFisico) && examenFisico.lesionPorHumedad == 1 ? $('#rdbLesionPorHumedadSi').prop('checked', true) : $('#rdbLesionPorHumedadNo').prop('checked', true)
        $('#cboPielGradoLesionHumedad').val(!isEmpty(examenFisico) ? examenFisico.gradoLesionPorHumedad : '')
        $('#txtPielLesionHumedadUbicacion').val(!isEmpty(examenFisico) ? examenFisico.ubicacionLesionPorHumedad : '')



        !isEmpty(examenFisico) && examenFisico.sedantes == 1 ? $('#contSedantes').show() : $('#contSedantes').hide()
        $(`input[name="rdbSedantes"][value="${examenFisico.sedantes}"]`).prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.analgesicos == 1 ? $('#contAnalgesicos').show() : $('#contAnalgesicos').hide()
        $(`input[name="rdbAnalgesicos"][value="${examenFisico.analgesicos}"]`).prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.bloqueanteNeuromuscular == 1 ? $('#contBloqueanteNeuromuscular').show() : $('#contBloqueanteNeuromuscular').hide()
        $(`input[name="rdbBloqueanteNeuromuscular"][value="${examenFisico.bloqueanteNeuromuscular}"]`).prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.vasodilatador == 1 ? $('#contVasodilatador').show() : $('#contVasodilatador').hide()
        $(`input[name="rdbVasodilatador"][value="${examenFisico.vasodilatador}"]`).prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.vasoconstrictor == 1 ? $('#contVasoconstrictor').show() : $('#contVasoconstrictor').hide()
        $(`input[name="rdbVasoconstrictor"][value="${examenFisico.vasoconstrictor}"]`).prop('checked', true)

        !isEmpty(examenFisico) && examenFisico.terapiaInfusionRenal == 1 ? $('#contTerapiaInfusionRenal').show() : $('#contTerapiaInfusionRenal').hide()
        $(`input[name="rdbTerapiaInfusionRenal"][value="${examenFisico.terapiaInfusionRenal}"]`).prop('checked', true)

        $('#txtEFisicoPresionArterialMasAlta').val(!isEmpty(examenFisico) ? examenFisico.presionArterialMasAlta : '')
        $('#txtEFisicoPresionArterialMasBaja').val(!isEmpty(examenFisico) ? examenFisico.presionArterialMasBaja : '')

        $('#txtEFisicoFrecuenciaCardiacaMayor').val(!isEmpty(examenFisico) ? examenFisico.frecuenciaCardiacaMayor : '')
        $('#txtEFisicoFrecuenciaCardiacaMenor').val(!isEmpty(examenFisico) ? examenFisico.frecuenciaCardiacaMenor : '')
        //$('#cboCultivos').val(!isEmpty(examenFisico) ? examenFisico.cultivos : '')
        //$('#txtInfecciosoResultado').val(!isEmpty(examenFisico) ? examenFisico.resultado : '')

        !isEmpty(intervenciones) && intervenciones.clna09 == 1 ? $('#chkCLNA09').prop('checked', true) : $('#chkCLNA09').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.dextrosa5 == 1 ? $('#chkDextrosa5').prop('checked', true) : $('#chkDextrosa5').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.dextrosa10 == 1 ? $('#chkDextrosa10').prop('checked', true) : $('#chkDextrosa10').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.dextrosa33 == 1 ? $('#chkDextrosa33').prop('checked', true) : $('#chkDextrosa33').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.isofundin == 1 ? $('#chkIsofundin').prop('checked', true) : $('#chkIsofundin').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.ringerlactato == 1 ? $('#chkRingerLactato').prop('checked', true) : $('#chkRingerLactato').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.plasmalyte == 1 ? $('#chkPlasmalyte').prop('checked', true) : $('#chkPlasmalyte').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.poligelina == 1 ? $('#chkPOLIGELINA').prop('checked', true) : $('#chkPOLIGELINA').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.gelafusin == 1 ? $('#chkGELAFUSIN').prop('checked', true) : $('#chkGELAFUSIN').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.albumina20 == 1 ? $('#chkALBUMINA20').prop('checked', true) : $('#chkALBUMINA20').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.manitol20 == 1 ? $('#chkManitol20').prop('checked', true) : $('#chkManitol20').prop('checked', false)
        !isEmpty(intervenciones) && intervenciones.aguadestilada == 1 ? $('#chkAguaDestilada').prop('checked', true) : $('#chkAguaDestilada').prop('checked', false)
        $('#txtIngresosFluidossvo6h').val(!isEmpty(intervenciones) ? intervenciones.ingresosfluidossvo6h : '')
        $('#txtIngresosFluidossvo12h').val(!isEmpty(intervenciones) ? intervenciones.ingresosfluidossvo12h : '')
        $('#txtIngresosFluidossvo24h').val(!isEmpty(intervenciones) ? intervenciones.ingresosfluidossvo24h : '')
        $('#txtInterBh6').val(!isEmpty(intervenciones) ? intervenciones.bh6h : '')
        $('#txtInterBh12').val(!isEmpty(intervenciones) ? intervenciones.bh12h : '')
        $('#txtInterBh24').val(!isEmpty(intervenciones) ? intervenciones.bh24h : '')


        if (!isEmpty(examenesAuxiliares)) {
            console.log('hay examenes')
            $('#txtAuxLeucocitoNumero').val(examenesAuxiliares.leucocitosnumero)
            $('#txtAuxNeutrofilos').val(examenesAuxiliares.neutrofilos)
            $('#txtAuxAbastonado').val(examenesAuxiliares.abastonados)
            $('#txtAuxLinfocitos').val(examenesAuxiliares.linfocitos)
            $('#txtAuxHemoglobina').val(examenesAuxiliares.hemoglobina)
            $('#txtAuxHematocrito').val(examenesAuxiliares.hematocrito)
            $('#txtAuxPlaquetas').val(examenesAuxiliares.plaquetas)
            $('#txtAuxGlucosa').val(examenesAuxiliares.glucosa)
            $('#txtAuxUrea').val(examenesAuxiliares.urea)
            $('#txtAuxCreatinina').val(examenesAuxiliares.creatinina)
            $('#txtAuxAlbumina').val(examenesAuxiliares.albumina)
            $('#txtAuxGlobulina').val(examenesAuxiliares.globulina)
            $('#txtAuxBilirrubinaTotal').val(examenesAuxiliares.bilirrubinatotal)
            $('#txtAuxBilirrubinaDirecta').val(examenesAuxiliares.bilirrubinadirecta)
            $('#txtAuxFosfatasaAlcalina').val(examenesAuxiliares.fosfatasaalcalina)
            $('#txtAuxTGO').val(examenesAuxiliares.tgo)
            $('#txtAuxTGP').val(examenesAuxiliares.tgp)
            $('#txtAuxLactatoDeshidrogenasa').val(examenesAuxiliares.lactatodeshidrogenasa)
            $('#txtAuxMagnesio').val(examenesAuxiliares.magnesio)
            $('#txtAuxFosforo').val(examenesAuxiliares.fosforo)
            $('#txtAuxCalcioSerico').val(examenesAuxiliares.calcioserico)
            $('#txtAuxIndiceAlbumina').val(examenesAuxiliares.indicealbumina)
            $('#txtAuxIndiceGlobulina').val(examenesAuxiliares.indiceglobulina)
            $('#txtAuxPresionOncoticaPo').val(examenesAuxiliares.presiónoncoticapo)
            $('#txtAuxIndiceBriones').val(examenesAuxiliares.indicedebriones)
            $('#txtAuxTiempoProtrombina').val(examenesAuxiliares.tiempodeprotrombina)
            $('#txtAuxTTPA').val(examenesAuxiliares.tiempoparcialdetromboplastinaactivada)
            $('#txtAuxFibrinogeno').val(examenesAuxiliares.fibrinogeno)
            $('#txtAuxDimeroD').val(examenesAuxiliares.dímerod)
            $('#txtAuxMarcadoresInflamatorios').val(examenesAuxiliares.marcadoresinflamatorios)
            $('#txtAuxProteinaCReactiva').val(examenesAuxiliares.proteinacreactiva)
            $('#txtAuxProcalcitonina').val(examenesAuxiliares.procalcitonina)
            $('#txtAuxPH').val(examenesAuxiliares.ph)
            $('#txtAuxPCO2').val(examenesAuxiliares.presionparcialdeco2)
            $('#txtAuxHCO3').val(examenesAuxiliares.bicarbonatodesodio)
            $('#txtAuxBE').val(examenesAuxiliares.excesodebase)
            $('#txtAuxLactato').val(examenesAuxiliares.lactato)
            $('#txtAuxSodio').val(examenesAuxiliares.sodio)
            $('#txtAuxPotasio').val(examenesAuxiliares.potasio)
            $('#txtAuxCloro').val(examenesAuxiliares.cloro)
            $('#txtAuxCalcio').val(examenesAuxiliares.calcio)
            $('#txtAuxGAa').val(examenesAuxiliares.gradientealveoloarterialdeo2)
            $('#txtAuxPO2').val(examenesAuxiliares.po2)
        } else {
            console.log('no hay examenes, se procede a buscar')
            let resultados = await RegistroEvaluacionesUCI.ListarResultadosLaboratorioByIdCuentaAtencion(RegistroEvaluacionesUCI.idCuentaAtencion)

            if (!isEmpty(resultados)) {
                await RegistroEvaluacionesUCI.CompletarResultadosExamenes(resultados)
            }
        }


        $('#txtFechaMonitoreoAvanzado').datepicker("setDate", !isEmpty(monitoreo) ? monitoreo.fecha : '')
        $('#txtHoraMonitoreoAvanzado').val(!isEmpty(monitoreo) ? monitoreo.hora : '')
        //$('#txtVmMarca').val(!isEmpty(monitoreo) ? monitoreo.ventiladorMecanicoMarca : '')
        //$('#txtFechaInicioVm').datepicker("setDate", !isEmpty(monitoreo) ? monitoreo.fechaInicioVM : '')
        //$('#txtFechaUltimoVm').datepicker("setDate", !isEmpty(monitoreo) ? monitoreo.fechaTerminaVM : '')
        //$('#cboModoVentConvencional').val(!isEmpty(monitoreo) ? monitoreo.modoVentilatorioConvencional : '')
        //$('#txtModoVentNoConvencional').val(!isEmpty(monitoreo) ? monitoreo.modoVentilatorioNoConvencional : '')
        //$('#txtFiO2Ma').val(!isEmpty(monitoreo) ? monitoreo.fraccionInspiratoriaO2 : '')
        //$('#txtVolTMa').val(!isEmpty(monitoreo) ? monitoreo.volumenTidal : '')
        //$('#txtPInspMa').val(!isEmpty(monitoreo) ? monitoreo.presionInspiratoria : '')
        //$('#txtPpicoMa').val(!isEmpty(monitoreo) ? monitoreo.presionInspiratoriaPico : '')
        //$('#txtPEEPMa').val(!isEmpty(monitoreo) ? monitoreo.presionFinalEspiracion : '')
        //$('#txtFRMa').val(!isEmpty(monitoreo) ? monitoreo.frecuenciaRespiratoriaProgramada : '')
        //$('#txtFlujoMa').val(!isEmpty(monitoreo) ? monitoreo.flujo : '')
        //$('#txtPMediaMa').val(!isEmpty(monitoreo) ? monitoreo.presionMediaViaAerea : '')
        //$('#txtVolMinMa').val(!isEmpty(monitoreo) ? monitoreo.volumenMinuto : '')
        //$('#txtPSMa').val(!isEmpty(monitoreo) ? monitoreo.presionSoporte : '')
        //$('#txtComplianceEstaticaMa').val(!isEmpty(monitoreo) ? monitoreo.complianceEstatica : '')
        //$('#txtComplianceDinamicaMa').val(!isEmpty(monitoreo) ? monitoreo.complianceDinamica : '')
        //$('#txtResistenciaViaAreaMa').val(!isEmpty(monitoreo) ? monitoreo.resistenciaViaAerea : '')
        //$('#txtDPMa').val(!isEmpty(monitoreo) ? monitoreo.diferenciaPresiones : '')
        //$('#txtPO2Ma').val(!isEmpty(monitoreo) ? monitoreo.presionParcialOxigeno : '')
        //$('#txtIOxigenatorioMa').val(!isEmpty(monitoreo) ? monitoreo.indiceOxigenatorio : '')
        //$('#txtMurrayScoreMa').val(!isEmpty(monitoreo) ? monitoreo.murrayScore : '')
        //$('#txtETCO2Ma').val(!isEmpty(monitoreo) ? monitoreo.cantidadCO2EnAireExhalado : '')
        $('#txtPeepMaxSinReclutamientoMa').val(!isEmpty(monitoreo) ? monitoreo.peepMaxSinReclutamiento1 : '')
        !isEmpty(monitoreo) && monitoreo.pronacion == 1 ? $('#chkPronacionMa').prop('checked', true) : $('#chkPronacionMa').prop('checked', false)
        $('#txtHrsPreProMa').val(!isEmpty(monitoreo) ? monitoreo.horasPrePronacion : '')
        $('#txtNCicloPronoMa').val(!isEmpty(monitoreo) ? monitoreo.nroCicloProno : '')
        !isEmpty(monitoreo) && monitoreo.reclutamiento == 1 ? $('#chkReclutamientoMa').prop('checked', true) : $('#chkReclutamientoMa').prop('checked', false)
        $('#txtPEEPMaxReclutamientoMa').val(!isEmpty(monitoreo) ? monitoreo.peepMaxConReclutamiento : '')
        !isEmpty(monitoreo) && monitoreo.titulacionPeep == 1 ? $('#chkTitulacionPEEPMa').prop('checked', true) : $('#chkTitulacionPEEPMa').prop('checked', false)


        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    SeleccionarEvaluacion: async (objEvaluacion) => {
        Cargando(1)

        if (objEvaluacion.statusFirma == 0) {
            $('#ImprimirEvalEmerCF').hide()
            $('#FirmarEvalEmer').show()
            $('#ImprimirEvalEmerSF').show()
        } else {
            $('#ImprimirEvalEmerCF').show()
            $('#FirmarEvalEmer').hide()
            $('#ImprimirEvalEmerSF').hide()
        }

        //if (objEvaluacion.idEmpleado != $('#idUsuariotxt').val()) {
        //    swal({
        //        title: 'Evaluaciones UCI',
        //        text: 'Solo el usuario que creo el registro puede modificar la evaluación',
        //        type: 'info',
        //    }).done();
        //    RegistroEvaluacionesUCI.BloquearParaUsuarioDiferente(true)
        //} else {
        //    RegistroEvaluacionesUCI.BloquearParaUsuarioDiferente(false)
        //}


        RegistroEvaluacionesUCI.nroEvaluacion = objEvaluacion.idNumero
        RegistroEvaluacionesUCI.IdAtencionDetalleUCI = objEvaluacion.idAtencionDetalleUCI

        Variables.NumeroEvaluacion = RegistroEvaluacionesUCI.nroEvaluacion

        $('#hdIdCuentaAtencion').val(RegistroEvaluacionesUCI.idCuentaAtencion)
        $('#hdNroEvaluacion').val(RegistroEvaluacionesUCI.nroEvaluacion)
        $('#hdIdServicioPaciente').val(RegistroEvaluacionesUCI.IdServicio)
        $('#hdIdTipoServicio').val(3)

        $('#lblNumeroEvaluacion').text(`Evaluación N° ${RegistroEvaluacionesUCI.nroEvaluacion}`)

        if (RegistroEvaluacionesUCI.nroEvaluacion < 2) {
            RegistroEvaluacionesUCI.HabilitarDeshabilitarCamposPrimeraEvaluacion(false)
        } else {
            RegistroEvaluacionesUCI.HabilitarDeshabilitarCamposPrimeraEvaluacion(true)
        }

        $('#FechaInicioAtencion').attr('readonly', 'readonly');
        //$('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
        //$('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());

        if (isEmpty(objEvaluacion.fechaEvaluacion)) {
            $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        } else {
            $('#FechaInicioAtencion').datepicker("setDate", objEvaluacion.fechaEvaluacion);
        }

        if (isEmpty(objEvaluacion.horaEvaluacion)) {
            $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));
        } else {
            $('#HoraInicioAtencion').val(objEvaluacion.horaEvaluacion);
        }


        objEvaluacion.disfuncionesNinguno == 1 ? $('#chkDisfuncionesNinguno').prop('checked', true) : $('#chkDisfuncionesNinguno').prop('checked', false)
        objEvaluacion.disfuncionesRespiratorio == 1 ? $('#chkDisfuncionesRespiratorio').prop('checked', true) : $('#chkDisfuncionesRespiratorio').prop('checked', false)
        objEvaluacion.disfuncionesHematologico == 1 ? $('#chkDisfuncionesHematologico').prop('checked', true) : $('#chkDisfuncionesHematologico').prop('checked', false)
        objEvaluacion.disfuncionesRenal == 1 ? $('#chkDisfuncionesRenal').prop('checked', true) : $('#chkDisfuncionesRenal').prop('checked', false)
        objEvaluacion.disfuncionesHepatico == 1 ? $('#chkDisfuncionesHepatico').prop('checked', true) : $('#chkDisfuncionesHepatico').prop('checked', false)
        objEvaluacion.disfuncionesNeurologico == 1 ? $('#chkDisfuncionesNeurologico').prop('checked', true) : $('#chkDisfuncionesNeurologico').prop('checked', false)
        objEvaluacion.disfuncionesMetabolico == 1 ? $('#chkDisfuncionesMetabolico').prop('checked', true) : $('#chkDisfuncionesMetabolico').prop('checked', false)
        objEvaluacion.disfuncionesUterina == 1 ? $('#chkDisfuncionesUterina').prop('checked', true) : $('#chkDisfuncionesUterina').prop('checked', false)
        objEvaluacion.disfuncionesCardiovascular == 1 ? $('#chkDisfuncionesCardiovascular').prop('checked', true) : $('#chkDisfuncionesCardiovascular').prop('checked', false)
        objEvaluacion.disfuncionesGastrointestinal == 1 ? $('#chkDisfuncionesGastrointestinal').prop('checked', true) : $('#chkDisfuncionesGastrointestinal').prop('checked', false)
        objEvaluacion.disfuncionesOtro == 1 ? $('#chkDisfuncionesOtros').prop('checked', true) : $('#chkDisfuncionesOtros').prop('checked', false)
        $('#txtDisfuncionesOtros').val(objEvaluacion.disfuncionesOtrodescripcion)

        let examenFisico = await RegistroEvaluacionesUCI.SeleccionarExamenFisicoEvaluacionUCI(objEvaluacion.idAtencionDetalleUCI)
        let intervenciones = await RegistroEvaluacionesUCI.SeleccionarIntervencionesEvaluacionUCI(objEvaluacion.idAtencionDetalleUCI)
        let examenesAuxiliares = await RegistroEvaluacionesUCI.SeleccionarExamenesAuxiliaresUCI(objEvaluacion.idAtencionDetalleUCI)

        let monitoreo = await RegistroEvaluacionesUCI.SeleccionarMonitoreoSoporteVentilatorioUCIManiobras(objEvaluacion.idAtencionDetalleUCI)




        $('#txtComentarioApreciacionEvaluacion').val(objEvaluacion.comentarioApreciacionEvaluacion)
        $('#txtPlanEvaluacion').val(objEvaluacion.planEvaluacion)

        $('#cboExamenImagenologico').val(objEvaluacion.examenImagenologico?.split(','))
        $('#cboExamenLaboratorial').val(objEvaluacion.examenLaboratorial?.split(','))

        $('#txtExamenImagenologico').val(objEvaluacion.descripcionExamenImagenologico)
        $('#txtExamenLaboratorial').val(objEvaluacion.descripcionExamenLaboratorial)

        $('#txtMotivoEvaluacionUCI').val(objEvaluacion.motivoEvaluacionUCI)


        $('#cboMedicoComentarioEvaluacion').val(objEvaluacion.medicoComentarioEvaluacion)
        $('#cboDestinoComentarioEvaluacion').val(objEvaluacion.destinoComentarioEvaluacion)
        $('#txtFechaAltaPlanApreciacion').val(objEvaluacion.fechaAltaPlanApreciacion)


        $('#txtImpresionDiagnostica').val(objEvaluacion.impresionDiagnostica)
        $('#txtTratamiento').val(objEvaluacion.tratamiento)
        $('#txtDatoCalculadoSOFA').val(objEvaluacion.sofa)

        await RegistroEvaluacionesUCI.CargarDatosEvaluacion(examenFisico[0], intervenciones[0], examenesAuxiliares[0], monitoreo[0])


        await RegistroEvaluacionesUCI.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
        await Diagnosticos.SeleccionarDiagnosticosPorEvaluacion(objEvaluacion.idAtencion, objEvaluacion.idServicioIngreso, objEvaluacion.idNumero, 3);

        await RegistroEvaluacionesUCI.ListaTriajeEmgHosp(objEvaluacion.idAtencion, objEvaluacion.idServicioIngreso, objEvaluacion.idNumero)

        let monitoreoSoporteVentilatorio = await RegistroEvaluacionesUCI.SeleccionarMonitoreoSoporteVentilatorioUCI(objEvaluacion.idAtencion, RegistroEvaluacionesUCI.nroEvaluacion)
        let equiposMonitoreoHemodinamico = await RegistroEvaluacionesUCI.SeleccionarMonitoreoHemodinamicoUCI(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.nroEvaluacion)
        let monitoreoNeurologico = await RegistroEvaluacionesUCI.SeleccionarMonitoreoNeurologicoUCI(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.nroEvaluacion)
        let monitoreoUltrasonografia = await RegistroEvaluacionesUCI.SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.nroEvaluacion)

        let lstSedantes = await RegistroEvaluacionesUCI.SeleccionarMedicamentosSedanesUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)
        let lstAnalgesicos = await RegistroEvaluacionesUCI.SeleccionarMedicamentosAnalgesicosUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)
        let lstBloqueanteNeuromuscular = await RegistroEvaluacionesUCI.SeleccionarMedicamentosBloqueanteNeuromuscularUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)
        let lstVasodilatador = await RegistroEvaluacionesUCI.SeleccionarMedicamentosVasodilatadorUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)
        let lstVasoconstrictor = await RegistroEvaluacionesUCI.SeleccionarMedicamentosVasoconstrictorUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)
        let lstAccesosVasculares = await RegistroEvaluacionesUCI.SeleccionarAccesosVascularesUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI, RegistroEvaluacionesUCI.nroEvaluacion)

        let lstHemoderivados = await RegistroEvaluacionesUCI.SeleccionarIntervencionesHemoderivadosUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI)
        let lstCorticoides = await RegistroEvaluacionesUCI.SeleccionarIntervencionesCorticoidesUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI)
        let lstFluidoterapia = await RegistroEvaluacionesUCI.SeleccionarIntervencionesFluidoterapiaUCI(RegistroEvaluacionesUCI.IdAtencionDetalleUCI)

        oTable_NeurologicoSedantes.fnClearTable()
        oTable_NeurologicoAnalgesicos.fnClearTable()
        oTable_NeurologicoRelajanteNeuromuscular.fnClearTable()
        oTable_CardioVasodilatador.fnClearTable()
        oTable_CardioVasoconstrictor.fnClearTable()

        oTable_AccesosVasculares.fnClearTable()

        oTable_MonitoreoSoporteVentilatorio.fnClearTable()
        oTable_MonitoreoHemodinamico.fnClearTable()
        oTable_MonitoreoNeurologico.fnClearTable()
        oTable_MonitoreoUltrasonografia.fnClearTable()

        oTable_IntervencionesHemoderivado.fnClearTable()
        oTable_IntervencionesCorticoide.fnClearTable()
        oTable_IntervencionesFluidoterapia.fnClearTable()

        if (lstSedantes.length > 0) {
            oTable_NeurologicoSedantes.fnAddData(lstSedantes)
        }
        if (lstAnalgesicos.length > 0) {
            oTable_NeurologicoAnalgesicos.fnAddData(lstAnalgesicos)
        }
        if (lstBloqueanteNeuromuscular.length > 0) {
            oTable_NeurologicoRelajanteNeuromuscular.fnAddData(lstBloqueanteNeuromuscular)
        }
        if (lstVasodilatador.length > 0) {
            oTable_CardioVasodilatador.fnAddData(lstVasodilatador)
        }
        if (lstVasoconstrictor.length > 0) {
            oTable_CardioVasoconstrictor.fnAddData(lstVasoconstrictor)
        }
        if (lstAccesosVasculares.length > 0) {
            oTable_AccesosVasculares.fnAddData(lstAccesosVasculares)
        }

        if (monitoreoSoporteVentilatorio.length > 0) {
            oTable_MonitoreoSoporteVentilatorio.fnAddData(monitoreoSoporteVentilatorio)
        }
        if (equiposMonitoreoHemodinamico.length > 0) {
            oTable_MonitoreoHemodinamico.fnAddData(equiposMonitoreoHemodinamico)
        }
        if (monitoreoNeurologico.length > 0) {
            oTable_MonitoreoNeurologico.fnAddData(monitoreoNeurologico)
        }
        if (monitoreoUltrasonografia.length > 0) {
            oTable_MonitoreoUltrasonografia.fnAddData(monitoreoUltrasonografia)
        }

        if (lstHemoderivados.length > 0) {
            oTable_IntervencionesHemoderivado.fnAddData(lstHemoderivados)

            let total = 0

            $(lstHemoderivados).each((i, obj) => {
                total += parseInt(obj.nroUnidades)
            })

            $('#txtTotalUnidadesHemoderivado').val(total)
        }
        if (lstCorticoides.length > 0) {
            oTable_IntervencionesCorticoide.fnAddData(lstCorticoides)
        }
        if (lstFluidoterapia.length > 0) {
            oTable_IntervencionesFluidoterapia.fnAddData(lstFluidoterapia)

            let totalFlu = 0

            $(lstFluidoterapia).each((i, obj) => {
                totalFlu += parseFloat(obj.volumen)
            })

            $('#txtTotalVolumenFluidoterapia').val(totalFlu)
        }

        //=======================KHOYOSI=======================//
        RegistroEvaluacionesUCI.nuevaEvaluacion = false;
        RegistroEvaluacionesUCI.modificaEvaluacion = true;
        //====================================================//

        $('.chosen-select').chosen().trigger("chosen:updated")

        RegistroEvaluacionesUCI.HabilitarDeshabilitarInputsEvaluacion()
        Cargando(0)
    },

    HabilitarDeshabilitarCamposPrimeraEvaluacion(estado) {
        $("#antecedentesFamiliares-tab input[type=text]").prop("disabled", estado);
        $("#antecedentesFamiliares-tab input[type=radio]").prop("disabled", estado);

        $("#antecedentesPersonales-tab input[type=text]").prop("disabled", estado);
        $("#antecedentesPersonales-tab input[type=radio]").prop("disabled", estado);
        $("#antecedentesPersonales-tab input[type=checkbox]").prop("disabled", estado);
        $("#antecedentesPersonales-tab .chzn-select").attr('disabled', estado).trigger("chosen:updated")
        $("#txtMedicacionHabitual").attr('disabled', estado)
        $("#txtAnioUltimaVacunaCovid").attr('disabled', estado)

        $("#antecedentesObstetricos-tab input[type=text]").prop("disabled", estado);
        $("#antecedentesObstetricos-tab input[type=radio]").prop("disabled", estado);
        $("#antecedentesObstetricos-tab input[type=checkbox]").prop("disabled", estado);
        $("#antecedentesObstetricos-tab .chzn-select").attr('disabled', estado).trigger("chosen:updated")

        $("#motivoAtencion input[type=text]").prop("disabled", estado);
        $("#motivoAtencion input[type=checkbox]").prop("disabled", estado);
        $("#motivoAtencion .chzn-select").attr('disabled', estado).trigger("chosen:updated")




        if (!estado) {
            RegistroEvaluacionesUCI.HabilitarDeshabilitarInputs()
        }

    },
    HabilitarDeshabilitarInputs() {
        activarDesactivarRB('rdbDiabetesFamiliarSi', 'txtDiabetesFamiliar', 'rdbDiabetesFamiliarParen')
        activarDesactivarRB('rdbTBCFamiliarSi', 'txtTBCFamiliar', 'rdbTBCFamiliarParen')
        activarDesactivarRB('rdbHipertensionFamiliarSi', 'txtHipertensionFamiliar', 'rdbHipertensionFamiliarParen')
        activarDesactivarRB('rdbMeoplasicoCancerFamiliarSi', 'txtMeoplasicoCancerFamiliar', 'rdbMeoplasicoCancerFamiliarParen')
        activarDesactivarRB('rdbEnfTiroideaFamiliarSi', 'txtEnfTiroideaFamiliar', 'rdbEnfTiroideaFamiliarParen')
        activarDesactivarRB('rdbEnfReumaticaFamiliarSi', 'txtEnfReumaticaFamiliar', 'rdbEnfReumaticaFamiliarParen')
        activarDesactivarRB('rdbAsmaFamiliarSi', 'txtAsmaFamiliar', 'rdbAsmaFamiliarParen')
        activarDesactivarRB('rdbOtrosFamiliarSi', 'txtOtrosFamiliar', 'rdbOtrosFamiliarParen')
        activarDesactivarRB('chkTipoAlimentacionOtro', 'txtTipoAlimentacionOtroDescripcion', '')
        activarDesactivarRB('rdbVacunaInfluenzaSi', 'txtVacunaInfluenza', '')
        activarDesactivarRB('rdbVacunaDTAdultoSi', 'txtVacunaDTAdulto', '')
        activarDesactivarRB('rdbVacunaTexoideTetanicoSi', 'txtVacunaTexoideTetanico', '')
        activarDesactivarRB('rdbVacunaFiebreAmarillaSi', 'txtVacunaFiebreAmarilla', '')
        activarDesactivarRB('rdbVacunaHepatitisBSi', 'txtVacunaHepatitisB', '')
        activarDesactivarRB('rdbVacunaBCGSi', 'txtVacunaBCG', '')
        activarDesactivarRB('rdbVacunaPapilomavirusSi', 'txtVacunaPapilomavirus', '')
        activarDesactivarRB('rdbVacunaOtraSi', 'txtVacunaOtra', '')
        activarDesactivarRB('rdbBebidasAlcoholicasHabNocSi', 'txtBebidasAlcoholicasHabNoc', '')
        activarDesactivarRB('rdbDrogasHabNocSi', 'txtDrogasHabNoc', '')
        activarDesactivarRB('rdbTabacoCigarrosHabNocSi', 'txtTabacoCigarrosHabNoc', '')
        activarDesactivarRB('rdbOtrosHabNocSi', 'txtOtrosHabNoc', '')
        activarDesactivarRB('rdbFarmacologicasAlerSi', 'txtFarmacologicasAler', '')
        activarDesactivarRB('rdbAlimentacionAlerSi', 'txtAlimentacionAler', '')
        activarDesactivarRB('rdbOtrosAlerSi', 'txtOtrosAler', '')
        activarDesactivarRB('chkOtroInfecciosaPat', 'txtDescripcionOtroInfecciosaPat', '')
        activarDesactivarRB('chkOtroMetabolicaPat', 'txtDescripcionOtroMetabolicaPat', '')
        activarDesactivarRB('chkOtroCardioPat', 'txtDescripcionOtroCardioPat', '')
        activarDesactivarRB('chkOtroNeuroPat', 'txtDescripcionOtroNeuroPat', '')
        activarDesactivarRB('chkOtroReumaPat', 'txtDescripcionOtroReumaPat', '')
        activarDesactivarRB('rdbCirugiasPreviasQuirurSi', 'txtCirugiasPreviasQuirur', '')
        activarDesactivarRB('rdbCirugiasPreviasQuirurSi', 'txtFechaUltimaCiruQuirur', '')

        activarDesactivarRB('chkDisfuncionesOtros', 'txtDisfuncionesOtros', '')
        activarDesactivarRB('chkMotivoOtrosSignosYSintomas', 'txtMotivoOtrosSignosYSintomas', '')
    },
    HabilitarDeshabilitarInputsEvaluacion() {
        activarDesactivarRB('chkOtroDispositivo', 'txtDescripcionOtroDispositivo', '')
        activarDesactivarRB('rdbDrenajeAbdominalSi', 'txtDrenajeAbdominal', '')
        activarDesactivarRB('rdbSondaNasogastricaSi', 'txtSondaNasogastrica', '')
        activarDesactivarRB('rdbBolsaLaparotomiaSi', 'txtBolsaLaparotomia', '')
        activarDesactivarRB('rdbVacSi', 'txtVac', '')
        activarDesactivarRB('rdbSondaUrinariaSi', 'txtSondaUrinaria', '')
        activarDesactivarRB('rdbDispositivoMedicionPIASi', 'txtDispositivoMedicionPIA', '')
        activarDesactivarRB('rdbTaponamientoPelvicoSi', 'txtTaponamientoPelvico', '')
        activarDesactivarRB('rdbTaponamientoHepaticoSi', 'txtTaponamientoHepatico', '')
        activarDesactivarRB('rdbOtroInvasivoDispositivoSi', 'txtOtroInvasivoDispositivo', '')
        activarDesactivarRB('rdbGEyBUSSi', 'txtGEyBUS', '')
        activarDesactivarRB('rdbVaginaSi', 'txtVagina', '')
        activarDesactivarRB('rdbCervixSi', 'txtCervix', '')
        activarDesactivarRB('rdbAnexosSi', 'txtAnexos', '')
        activarDesactivarRB('rdbFSDouglasSi', 'txtFSDouglas', '')
        activarDesactivarRB('rdbParametriosSi', 'txtParametrios', '')
        activarDesactivarRB('rdbMamasSi', 'txtMamas', '')
        activarDesactivarRB('rdbInfeccioComunitariaSi', 'txtInfeccioComunitaria', '')
        activarDesactivarRB('rdbInfeccionIntrahospitalariaSi', 'txtInfeccionIntrahospitalaria', '')

        activarDesactivarRB('rdbInfeccionHemocultivoSi', 'txtInfeccionHemocultivo', '')
        activarDesactivarRB('rdbInfeccionSecrecionBronquialSi', 'txtInfeccionSecrecionBronquial', '')
        activarDesactivarRB('rdbInfeccionOrinaSi', 'txtInfeccionOrina', '')
        activarDesactivarRB('rdbInfeccionHecesSi', 'txtInfeccionHeces', '')
        activarDesactivarRB('rdbInfeccionSecrecionesSi', 'txtInfeccionSecreciones', '')
    },

    AgregarDiagnostico() {
        //$(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");
        if ($("#txtDescripcionOtrasPat").val() == "") { alerta(2, "Debe seleccionar una patología"); $("#txtDescripcionOtrasPat").focus(); return false; }
        //if ($("#cboTipoDiagnostico").val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").focus(); return false; }
        if (RegistroEvaluacionesUCI.ExisteEnTablaOtrasPat()) {
            alerta(2, "La patología ya fue agregada.");
            return false;
        } else {

            var idTipoDx = '';
            var txtTipoDx = '';
            idTipoDx = $("#cboTipoDiagnosticoOtrasPat").val();
            txtTipoDx = $('#cboTipoDiagnosticoOtrasPat option:selected').text();

            //$("#txtCodigoOtrasPat").val(lstTableOtrasPatologias.codigoCIE10);
            //$("#hdnIdOtrasPat").val(lstTableOtrasPatologias.iddiagnostico);
            //$("#txtDescripcionOtrasPat").val(lstTableOtrasPatologias.descripcion);


            var objRow = {
                codigoCIE10: $("#txtCodigoOtrasPat").val(),
                codigoCIEsinPto: $("#txtCodigoOtrasPat").val(),
                descripcion: $("#txtDescripcionOtrasPat").val(),
                esActivo: 1,
                fechaInicioVigencia: '',
                iddiagnostico: $("#hdnIdOtrasPat").val(),
                idTipoDiagnostico: '',
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: '',
                lab: '',
                intrahospitalario: ''
            }

            //var objRow = {
            //    codigo: '1',
            //    descripcion: '1',
            //}
            oTable_OtrasPatologias.api(true).row.add(objRow).draw(false);

            //$(Diagnosticos.PanelDx + "#txtDescripcionDiag").val("");
            //$(Diagnosticos.PanelDx + "#txtCodigoDiag").val("");
            //$(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val(-1);

            //$('#cbolabDiagnostico').val(-1)

            //$('#cbolabDiagnostico').trigger("chosen:updated");
            //$(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");
            return true;
        };
    },
    QuitarDiagnostico() {
        let objRow = oTable_OtrasPatologias.api(true).row('.selected').data()

        if (isEmpty(objRow)) {
            alerta(2, 'Selecciona un registro a eliminar')
        } else {
            oTable_OtrasPatologias.api(true).row('.selected').remove().draw(false);
        }
        return true;
    },


    DevolverParametrosMonitoreo(objTable, input) {
        let json = "["
        dataTable = objTable.api(true).rows().data();
        dataTable.each(function (value, index) {
            var txtCant = "#" + input + dataTable[index]["idParametro"];            //KHOYOSI
            //html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idDosisRecetada":"' + databafarmacia[index]["idDosisRecetada"] + '","idViaAdministracion":"' + databafarmacia[index]["idViaAdministracion"] + '","observaciones":"' + $(txtFrec).val() + '"},';       //KHOYOSI(COMENTADO)

            json += `{"idMonitoreo": "${dataTable[index]["idMonitoreo"]}","idAtencionDetalleUCI": "${dataTable[index]["idAtencionDetalleUCI"]}","idParametro": "${dataTable[index]["idParametro"]}","descripcion": "${dataTable[index]["descripcion"]}", "valorParametro": "${$(txtCant).val()}", "idItem":  "${dataTable[index]["idItem"]}", "nroEvaluacion": "${dataTable[index]["nroEvaluacion"]}"},`
        });

        json += ']';
        var jsonComplete = json.replace(",]", "]")
        return jsonComplete;
    },

    ExisteEnTablaOtrasPat() {
        lstOtrasPat = oTable_OtrasPatologias.api(true).rows().data();
        //lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        if (lstOtrasPat.length == 0) {
            return false;
        }

        for (var i = 0; i < lstOtrasPat.length; i++) {
            if (lstOtrasPat[i].iddiagnostico == $("#hdnIdOtrasPat").val()) {
                return true;
            }
        }

        return false;
    },

    LimpiarCamposEvaluacion: async () => {
        $("#evaluacionFisica-tab input[type=text]").not("#txtEFisicoPeso, #txtEFisicoTalla, #txtEFisicoIMC").val('')
        $("#evaluacionFisica-tab input[type=checkbox]").attr("checked", false)
        $("#evaluacionFisica-tab input[type=radio]").attr("checked", false)
        $("#evaluacionFisica-tab textarea").val('')
        $("#evaluacionFisica-tab select").val(0)

        $("#resultadosAux-tab input[type=text]").val('')
        $("#resultadosAux-tab input[type=checkbox]").attr("checked", false)
        $("#resultadosAux-tab input[type=radio]").attr("checked", false)
        $("#resultadosAux-tab textarea").val('')
        $("#resultadosAux-tab select").val(0)

        $("#apreaciacionClinica-tab input[type=text]").val('')
        $("#apreaciacionClinica-tab input[type=checkbox]").attr("checked", false)
        $("#apreaciacionClinica-tab input[type=radio]").attr("checked", false)
        $("#apreaciacionClinica-tab textarea").val('')
        $("#apreaciacionClinica-tab select").val(0)

        $("#plan-tab input[type=text]").val('')
        $("#plan-tab input[type=checkbox]").attr("checked", false)
        $("#plan-tab input[type=radio]").attr("checked", false)
        $("#plan-tab textarea").val('')
        $("#plan-tab select").val(0)

        oTable_NeurologicoSedantes.fnClearTable()
        oTable_NeurologicoAnalgesicos.fnClearTable()
        oTable_NeurologicoRelajanteNeuromuscular.fnClearTable()
        oTable_CardioVasoconstrictor.fnClearTable()
        oTable_CardioVasodilatador.fnClearTable()
        oTable_IntervencionesHemoderivado.fnClearTable()
        oTable_IntervencionesCorticoide.fnClearTable()
        oTable_IntervencionesFluidoterapia.fnClearTable()

        oTable_AccesosVasculares.fnClearTable()

        ObjtableDiagnosticos.fnClearTable()

        oTable_OtrasPatologias.fnClearTable()
        oTable_MonitoreoSoporteVentilatorio.fnClearTable()
        oTable_ParametrosSoporteVentilatorio.fnClearTable()
        oTable_MonitoreoHemodinamico.fnClearTable()
        oTable_ParametrosMonitoreoHemodinamico.fnClearTable()
        oTable_MonitoreoUltrasonografia.fnClearTable()
        oTable_ParametrosUltrasonografia.fnClearTable()
        oTable_MonitoreoNeurologico.fnClearTable()
        oTable_ParametrosNeurologico.fnClearTable()
        oTable_OtrasPatBusqueda.fnClearTable()

        // Verificar
        //await RegistroEvaluacionesUCI.ListaTriajeEmgHosp(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.IdServicio, RegistroEvaluacionesUCI.nroEvaluacion - 1)

        await Diagnosticos.SeleccionarDiagnosticosPorEvaluacion(RegistroEvaluacionesUCI.idAtencion, RegistroEvaluacionesUCI.IdServicio, RegistroEvaluacionesUCI.nroEvaluacion - 1, 3);

        $('.chzn-select').chosen().trigger("chosen:updated")

        //$('#txtAuxLeucocitoNumero').val('')
        //$('#txtAuxNeutrofilos').val('')
        //$('#txtAuxAbastonado').val('')
        //$('#txtAuxLinfocitos').val('')
        //$('#txtAuxHemoglobina').val('')
        //$('#txtAuxHematocrito').val('')
        //$('#txtAuxPlaquetas').val('')
        //$('#txtAuxGlucosa').val('')
        //$('#txtAuxUrea').val('')
        //$('#txtAuxCreatinina').val('')
        //$('#txtAuxAlbumina').val('')
        //$('#txtAuxGlobulina').val('')
        //$('#txtAuxBilirrubinaTotal').val('')
        //$('#txtAuxBilirrubinaDirecta').val('')
        //$('#txtAuxFosfatasaAlcalina').val('')
        //$('#txtAuxTGO').val('')
        //$('#txtAuxTGP').val('')
        //$('#txtAuxLactatoDeshidrogenasa').val('')
        //$('#txtAuxMagnesio').val('')
        //$('#txtAuxFosforo').val('')
        //$('#txtAuxCalcioSerico').val('')
        //$('#txtAuxIndiceAlbumina').val('')
        //$('#txtAuxIndiceGlobulina').val('')
        //$('#txtAuxPresionOncoticaPo').val('')
        //$('#txtAuxIndiceBriones').val('')
        //$('#txtAuxTiempoProtrombina').val('')
        //$('#txtAuxTTPA').val('')
        //$('#txtAuxFibrinogeno').val('')
        //$('#txtAuxDimeroD').val('')
        //$('#txtAuxMarcadoresInflamatorios').val('')
        //$('#txtAuxProteinaCReactiva').val('')
        //$('#txtAuxProcalcitonina').val('')
        //$('#txtAuxPH').val('')
        //$('#txtAuxPCO2').val('')
        //$('#txtAuxHCO3').val('')
        //$('#txtAuxBE').val('')
        //$('#txtAuxLactato').val('')
        //$('#txtAuxSodio').val('')
        //$('#txtAuxPotasio').val('')
        //$('#txtAuxCloro').val('')
        //$('#txtAuxCalcio').val('')
        //$('#txtAuxGAa').val('')
        //$('#txtComentarioApreciacionEvaluacion').val('')
        //$('#txtPlanEvaluacion').val('')
        //$('#cboMedicoComentarioEvaluacion').val(0)
        //$('#cboDestinoComentarioEvaluacion').val(0)
    },

    LimpiarCampos: () => {
        RegistroEvaluacionesUCI.idCuentaAtencion = 0
        RegistroEvaluacionesUCI.idAtencion = 0
        RegistroEvaluacionesUCI.idAtencionUCI = 0
        RegistroEvaluacionesUCI.IdAtencionDetalleUCI = 0
        RegistroEvaluacionesUCI.IdServicio = 0

        RegistroEvaluacionesUCI.nroEvaluacion = 0

        RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = 0
        RegistroEvaluacionesUCI.EstablecimientoProcedenciaInstitucional = 0

        $('.campoRegistro').val('')
        $('.campoRegistroSelect').val(0)

        $(".ContenedorRegistroEvaluacionUCI input[type=text]").val('')
        $(".ContenedorRegistroEvaluacionUCI input[type=checkbox]").attr("checked", false)
        $(".ContenedorRegistroEvaluacionUCI input[type=radio]").attr("checked", false)
        $(".ContenedorRegistroEvaluacionUCI textarea").val('')
        $(".ContenedorRegistroEvaluacionUCI select").val(0)

        $("#hdIdTipoFuenteFian").val('');

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    BloquearParaUsuarioDiferente: (estado) => {


        $(".ContenedorRegistroEvaluacionUCI input[type=text]").prop("disabled", estado);
        $(".ContenedorRegistroEvaluacionUCI input[type=checkbox]").prop("disabled", estado);
        $(".ContenedorRegistroEvaluacionUCI input[type=radio]").prop("disabled", estado);
        $(".ContenedorRegistroEvaluacionUCI textarea").prop("disabled", estado);
        $(".ContenedorRegistroEvaluacionUCI select").prop("disabled", estado);

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    AbrirModalBusquedaOtrasPat() {
        $('#modalBusquedaOtrasPatologias').modal('show');
    },

    CerrarModalBusquedaOtrasPat() {
        $('#modalBusquedaOtrasPatologias').modal('hide');
    },

    LimpiarExamenes() {
        $('#txtAuxLeucocitoNumero').val('')
        $('#txtAuxNeutrofilos').val('')
        $('#txtAuxAbastonado').val('')
        $('#txtAuxLinfocitos').val('')
        $('#txtAuxHemoglobina').val('')
        $('#txtAuxHematocrito').val('')
        $('#txtAuxPlaquetas').val('')
        $('#txtAuxGlucosa').val('')
        $('#txtAuxUrea').val('')
        $('#txtAuxCreatinina').val('')
        $('#txtAuxAlbumina').val('')
        $('#txtAuxGlobulina').val('')
        $('#txtAuxBilirrubinaTotal').val('')
        $('#txtAuxBilirrubinaDirecta').val('')
        $('#txtAuxFosfatasaAlcalina').val('')
        $('#txtAuxTGO').val('')
        $('#txtAuxTGP').val('')
        $('#txtAuxLactatoDeshidrogenasa').val('')
        $('#txtAuxMagnesio').val('')
        $('#txtAuxFosforo').val('')
        $('#txtAuxCalcioSerico').val('')
        $('#txtAuxIndiceAlbumina').val('')
        $('#txtAuxIndiceGlobulina').val('')
        $('#txtAuxPresionOncoticaPo').val('')
        $('#txtAuxIndiceBriones').val('')
        $('#txtAuxTiempoProtrombina').val('')
        $('#txtAuxTTPA').val('')
        $('#txtAuxFibrinogeno').val('')
        $('#txtAuxDimeroD').val('')
        $('#txtAuxMarcadoresInflamatorios').val('')
        $('#txtAuxProteinaCReactiva').val('')
        $('#txtAuxProcalcitonina').val('')
        $('#txtAuxPH').val('')
        $('#txtAuxPCO2').val('')
        $('#txtAuxHCO3').val('')
        $('#txtAuxBE').val('')
        $('#txtAuxLactato').val('')
        $('#txtAuxSodio').val('')
        $('#txtAuxPotasio').val('')
        $('#txtAuxCloro').val('')
        $('#txtAuxCalcio').val('')
        $('#txtAuxGAa').val('')
    },


}

$(document).ready(() => {

    //    RegistroEvaluacionesUCI.Plugins()

    //    RegistroEvaluacionesUCI.Iniciar()

    //    RegistroEvaluacionesUCI.InitDatablesEvaluaciones()
    //    RegistroEvaluacionesUCI.InitDatablesOtrasPatologias()

    //    RegistroEvaluacionesUCI.InitDatablesSoporteVentilatorio()
    //    RegistroEvaluacionesUCI.InitDatablesParametrosSoporteVentilatorio()

    //    RegistroEvaluacionesUCI.InitDatablesMonitoreoHemodinamico()
    //    RegistroEvaluacionesUCI.InitDatablesParametrosMonitoreoHemodinamico()
    //    RegistroEvaluacionesUCI.InitDatablesNeurologico()
    //    RegistroEvaluacionesUCI.InitDatablesParametrosNeurologico()
    //    RegistroEvaluacionesUCI.InitDatablesUltrasonografia()
    //    RegistroEvaluacionesUCI.InitDatablesParametrosUltrasonografia()

    //    RegistroEvaluacionesUCI.InitDatablesBusquedaOtrasPat()

    //    RegistroEvaluacionesUCI.InitDatablesComentarioApreciacion()
    RegistroEvaluacionesUCI.InitDatablesEstablecimientos()

    //    RegistroEvaluacionesUCI.Events()
    RegistroEvaluacionesUCI.EventosIniciales()

})

rdoMechVent = 'ctl00$cphMainContent$rdoMechVent';
rdoPressors = 'ctl00$cphMainContent$rdoPressors';
rdoEpi = 'ctl00$cphMainContent$rdoEpi';
rdoNorepi = 'ctl00$cphMainContent$rdoNorepi';

$(function () {
    VasopressorChanged();


});

function VasopressorChanged() {
    if ($("input[name='" + rdoPressors + "']:checked").attr('id') == 'cphMainContent_rdoPressorsYes') {
        $('#trDopamine').show();
        $('#trDobutamine').show();
        $('#trEpi').show();
        $('#trNorepi').show();
        $('#trWeight').show();
    } else {
        $('#trDopamine').hide();
        $('#trDobutamine').hide();
        $('#trEpi').hide();
        $('#trNorepi').hide();
        $('#trWeight').hide();
    }
    PressorUnitsChanged();
}

function PressorUnitsChanged() {
    $('#trWeight').hide();

    var EpiZero = false;
    if (eval($('#cphMainContent_txtEpi').val()) == 0) { EpiZero = true; }

    var NorepiZero = false;
    if (eval($('#cphMainContent_txtNorepi').val()) == 0) { NorepiZero = true; }

    if (($("input[name='" + rdoEpi + "']:checked").attr('id') == 'cphMainContent_rdoEpiFlat') && (!EpiZero)) {
        $('#trWeight').show();
    }
    if (($("input[name='" + rdoNorepi + "']:checked").attr('id') == 'cphMainContent_rdoNorepiFlat') && (!NorepiZero)) {
        $('#trWeight').show();
    }
    if ($('#trDopamine').is(':visible') == false) {
        $('#trWeight').hide();
    }
}
