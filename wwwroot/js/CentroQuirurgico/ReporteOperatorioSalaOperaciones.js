let ReporteOperatorio = {

    IdPaciente: 0,
    IdReporteOperatorio: 0,



    //IdEstadoSolicitud: 0,
    NroHistoriaClinica: 0,
    //NroSolicitud: '',
    IdCuentaAtencion: 0,
    IdSolicitudSOP: 0,

    TipoDiagnostico: 0,
    objDiagSel: '',

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaCirugia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });
        $('.chosen-container').css({ "width": "100%" });
        $('.chosen-drop').css({ minWidth: '80%', width: 'auto' });

        $('.chzn-select').chosen().trigger("chosen:updated")

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $("#txtHoraCirugia, #txtHoraFinalCirugia").mask("Hn:Nn");
    },

    CargaInicial: function () {
        ProgramacionSalaOperaciones.ConfigurarCamposPorDefecto()
    },

    Init: async function () {
        Cargando(1)
        try {

            ReporteOperatorio.InitDatablesDiagnosticos()
            ReporteOperatorio.InitDatablesBusquedaDiagnostico()
            ReporteOperatorio.InitDatablesSolicitudCQx()
            ReporteOperatorio.InitDatablesPacientesBusqueda()

            await ReporteOperatorio.ListarM_ClaseIntervencionCQx()
            await ReporteOperatorio.ListarM_ClasificacionPacienteCQx()
            await ReporteOperatorio.ListarM_TipoCirugiaCQx()
            
            await ReporteOperatorio.ListarM_SalaCQx()
            await ReporteOperatorio.ListarM_AnestesiaCQx()

            ReporteOperatorio.InitDatablesReporteOperatorio()

            ReporteOperatorio.Plugins()
            //ProgramacionSalaOperaciones.CargaInicial()
            ReporteOperatorio.Events()




            //await ProgramacionSalaOperaciones.ListarTipoServicio()
            await ReporteOperatorio.ListarTipoSexo()
            await ReporteOperatorio.ListarMedicos()
            await ReporteOperatorio.ListarCamasByIdServicio(88)
            //await ProgramacionSalaOperaciones.ListaTiposDocumentos()

            await ReporteOperatorio.ServicioSeleccionarPorTipoServicio(0)


            ///////////////DIAGNOSTICO////////////////////
            //BusquedaDiagnosticos.IniciarScript();
            //Diagnosticos.PanelDx = '#PanelDiagnostico ';
            //Diagnosticos.IniciarScript();
            /////////////////////////////////////////////


            Cargando(0)
        } catch (e) {
            alerta(3, 'Error: ' + e)
            Cargando(0)
        }

    },

    ListarTipoSexo: () => {
        return HttpClient.Get('/Utilitario/ListaTiposSexo?area=Comun').then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.lsSexos.table;

                $('#cboSexo').empty();

                if (datos.length > 0) {

                    $('#cboSexo').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboSexo').append(`<option value="${obj.idTipoSexo}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },

    ListarM_ClaseIntervencionCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_ClaseIntervencionCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboClaseIntervencion').empty();

                if (datos.length > 0) {

                    $('#cboClaseIntervencion').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboClaseIntervencion').append(`<option value="${obj.idClaseIntervencion}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },
    ListarM_ClasificacionPacienteCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_ClasificacionPacienteCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboClasePlaciente').empty();

                if (datos.length > 0) {

                    $('#cboClasePlaciente').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboClasePlaciente').append(`<option value="${obj.idClasificacion}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },
    ListarM_TipoCirugiaCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_TipoCirugiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboTipoCirugia').empty();
                $('#cboTipoCirugiaProg').empty();

                if (datos.length > 0) {

                    $('#cboTipoCirugia').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTipoCirugiaProg').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTipoCirugia').append(`<option value="${obj.idTipoCirugiaCqx}">${obj.descripcion}</option>`)
                        $('#cboTipoCirugiaProg').append(`<option value="${obj.idTipoCirugiaCqx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },
    ListarM_TurnosCirugiaCQx: (IdTipoTurno) => {
        let formData = new FormData()

        formData.append('IdTipoTurno', IdTipoTurno)
        return HttpClient.Post('/SalaOperaciones/ListarM_TurnosCirugiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboTurno').empty();
                $('#cboTurnoQx').empty();

                if (datos.length > 0) {

                    $('#cboTurno').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTurnoQx').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTurno').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
                        $('#cboTurnoQx').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },

    ListarM_OrdenCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_OrdenCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboOrdenSugerido').empty();
                $('#cboOrdenProg').empty();

                if (datos.length > 0) {
                    $('#cboOrdenSugerido').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboOrdenProg').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        if (obj.idSalaCqx == $('#cboSala').val() && obj.idQuirofanoCqx == $('#cboQuirofano').val() && obj.idTurnoCQx == $('#cboTurnoQx').val()) {
                            if (obj.idPaciente != ReporteOperatorio.IdPaciente) {
                                if (obj.idOrdenCqx == -1) {
                                    //isDisabled = 'disabled'
                                    isDisabled = ''
                                }
                                $('#cboOrdenSugerido').append('<option ' + isDisabled + ' value="' + obj.idOrdenCqx + '">' + obj.paciente + '</option>');
                                $('#cboOrdenProg').append('<option ' + isDisabled + ' value="' + obj.idOrdenCqx + '">' + obj.paciente + '</option>');
                            } else {
                                $('#cboOrdenSugerido').append('<option ' + isDisabled + ' value="' + ReporteOperatorio.idOrdenProg + '">' + obj.paciente + '</option>');
                                $('#cboOrdenProg').append('<option ' + isDisabled + ' value="' + ReporteOperatorio.idOrdenProg + '">' + obj.paciente + '</option>');
                            }
                        }

                        isDisabled = '';
                    })

                    //$('#cboOrdenSugerido').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboOrdenProg').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$(datos).each(function (i, obj) {
                    //    $('#cboOrdenSugerido').append(`<option value="${obj.idOrdenCqx}">${obj.descripcion}</option>`)
                    //    $('#cboOrdenProg').append(`<option value="${obj.idOrdenCqx}">${obj.descripcion}</option>`)
                    //})

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },

    ListarM_SalaCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_SalaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboSala').empty();

                if (datos.length > 0) {

                    $('#cboSala').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboSala').append(`<option value="${obj.idSalaCqx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },


    ListarM_QuirofanoCQx: (IdSala) => {
        let formData = new FormData()

        formData.append('IdSala', IdSala)

        return HttpClient.Post('/SalaOperaciones/ListarM_QuirofanoCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboQuirofano').empty();

                if (datos.length > 0) {

                    $('#cboQuirofano').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboQuirofano').append(`<option value="${obj.idQuirofanoCqx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },



    ListarM_AnestesiaCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_AnestesiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboAnestesiaUno').empty();
                $('#cboAnestesiaDos').empty();

                if (datos.length > 0) {

                    $('#cboAnestesiaUno').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboAnestesiaDos').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboAnestesiaUno').append(`<option value="${obj.idAnestesiaCqx}">${obj.descripcion}</option>`)
                        $('#cboAnestesiaDos').append(`<option value="${obj.idAnestesiaCqx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },


    ListarM_TipoAnestesiaCQx: (IdAnestesiaCqx) => {
        let formData = new FormData()

        formData.append('IdAnestesiaCqx', IdAnestesiaCqx)

        return HttpClient.Post('/SalaOperaciones/ListarM_TipoAnestesiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboTipoAnestesiaUno').empty();
                $('#cboTipoAnestesiaDos').empty();

                if (datos.length > 0) {

                    $('#cboTipoAnestesiaUno').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTipoAnestesiaDos').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTipoAnestesiaUno').append(`<option value="${obj.idTipoAnestesiaCqx}">${obj.descripcion}</option>`)
                        $('#cboTipoAnestesiaDos').append(`<option value="${obj.idTipoAnestesiaCqx}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },

    ServicioSeleccionarPorTipoServicio: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboServicioOrigen').empty()
                $('#cboServicioOpera').empty()

                $('#cboServicioOrigen').append('<option  value="0">Seleccionar una opcion</option>')
                $('#cboServicioOpera').append('<option  value="0">Seleccionar una opcion</option>')
                $(data.table).each(function (i, obj) {
                    $('#cboServicioOrigen').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                    $('#cboServicioOpera').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    ListarMedicos: () => {
        let formData = new FormData()

        return HttpClient.Post('/Utilitario/ListarMedicos?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.dataSet.table;

                $('#cboMedicoSolicita').empty();

                $('#cboMedicoPrincipal').empty();
                $('#cboMedicoAyudanteI').empty();
                $('#cboAnestesiologo').empty();
                $('#cboInstrumentistaI').empty();
                $('#cboTecEnfermeria').empty();
                $('#cboCirujanoII').empty();
                $('#cboMedicoAyudanteII').empty();
                $('#cboAyudanteAnestesiologo').empty();
                $('#cboInstrumentistaII').empty();

                if (datos.length > 0) {

                    $('#cboMedicoSolicita').append(`<option value="0">Seleccionar una opcion</option>`)

                    $('#cboMedicoPrincipal').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboMedicoAyudanteI').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboInstrumentistaI').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTecEnfermeria').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboCirujanoII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboMedicoAyudanteII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboAyudanteAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboInstrumentistaII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboMedicoSolicita').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)

                        $('#cboMedicoPrincipal').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboMedicoAyudanteI').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboAnestesiologo').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboInstrumentistaI').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboTecEnfermeria').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboCirujanoII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboMedicoAyudanteII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboAyudanteAnestesiologo').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboInstrumentistaII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },
    ListarCamasByIdServicio: async (idServicio) => {
        let camas = await Utilitario.SeleccionarCamaByIdServicio(idServicio)

        if (!isEmpty(camas)) {
            if (camas.table.length > 0) {
                $('#cboNroCama').empty()
                $('#cboNroCama').append('<option  value="0">--Seleccionar--</option>')
                $(camas.table).each(function (i, obj) {
                    $('#cboNroCama').append('<option  value="' + obj.idCama + '">' + obj.codigo + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    ListarSolicitudesSalaOperaciones: async (NroHistoria, NroSolicitud, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud) => {
        let formData = new FormData()

        formData.append('NroHistoria', NroHistoria)
        formData.append('NroSolicitud', NroSolicitud)
        formData.append('NroDocumento', NroDocumento)
        formData.append('ApellidoPaterno', ApellidoPaterno)
        formData.append('ApellidoMaterno', ApellidoMaterno)
        formData.append('FechaSolicitud', FechaSolicitud)

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/SeleccionarSolicitudesParaReporteOperatorio?area=Comun&nroHistoria=${NroHistoria}`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },

    // tipo: 1 = Preoperatorio, 2 = Postoperatorio
    AbrirModalBusqueda: (tipo) => {
        ReporteOperatorio.TipoDiagnostico = tipo;
        $('#modalBusquedaDiagnostico').modal('show');
    },
    CerrarModalBusqueda() {
        $('#modalBusquedaDiagnostico').modal('hide');
    },
    ExisteDiagnosticos(tipo) {

        if (tipo == 1) {
            let lstDiagnosticos = oTable_DiagnosticosPreOperatorio.api(true).rows().data();

            if (lstDiagnosticos.length == 0) {
                return false;
            }

            for (var i = 0; i < lstDiagnosticos.length; i++) {
                if (lstDiagnosticos[i].iddiagnostico == $("#hdnIdDiagnosticoPre").val()) {
                    return true;
                }
            }

            return false;
        } else if (tipo == 2) {
            let lstDiagnosticos = oTable_DiagnosticosPostOperatorios.api(true).rows().data();

            if (lstDiagnosticos.length == 0) {
                return false;
            }

            for (var i = 0; i < lstDiagnosticos.length; i++) {
                if (lstDiagnosticos[i].iddiagnostico == $("#hdnIdDiagnosticoPost").val()) {
                    return true;
                }
            }

            return false;
        }


    },
    BuscarDiagnosticoBusqueda() {
        var midata = new FormData();
        midata.append('Codigo', $("#txtCodigoDiagFiltro").val());
        midata.append('Descripcion', $("#txtDescripcionDiagFiltro").val());
        $.ajax({
            method: "POST",
            url: "/PlanificacionFamiliar/ObtenerDiagnosticoV2?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                ObjtableBusquedaDiagnostico.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableBusquedaDiagnostico.fnAddData(datos.table);
                    }

                }

            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    BuscarDiagnostico(Codigo) {
        var midata = new FormData();
        midata.append('Codigo', Codigo);
        midata.append('Descripcion', $("#txtDescripcionDiagFiltro").val());
        $.ajax({
            method: "POST",
            url: "/PlanificacionFamiliar/ObtenerDiagnostico?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                ObjtableBusquedaDiagnostico.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableBusquedaDiagnostico.fnAddData(datos.table);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    AgregarDiagnosticoBusqueda() {
        ReporteOperatorio.objDiagSel = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
        if (ReporteOperatorio.TipoDiagnostico == 1) {
            $("#txtCodigoDiagPre").val(ReporteOperatorio.objDiagSel.codigoCIE10);
            $("#hdnIdDiagnosticoPre").val(ReporteOperatorio.objDiagSel.iddiagnostico);
            $("#txtDescripcionDiagPre").val(ReporteOperatorio.objDiagSel.descripcion);
            ReporteOperatorio.CerrarModalBusqueda()
        } else if (ReporteOperatorio.TipoDiagnostico == 2) {
            $("#txtCodigoDiagPost").val(ReporteOperatorio.objDiagSel.codigoCIE10);
            $("#hdnIdDiagnosticoPost").val(ReporteOperatorio.objDiagSel.iddiagnostico);
            $("#txtDescripcionDiagPost").val(ReporteOperatorio.objDiagSel.descripcion);
            ReporteOperatorio.CerrarModalBusqueda()
        }


    },
    AgregarDiagnostico(tipo) {
        let TipoDiag = ''

        if (tipo == 1) {
            TipoDiag = 'Pre'
        } else if (tipo == 2) {
            TipoDiag = 'Post'
        }

        $("#cboTipoDiagnostico" + TipoDiag).trigger("chosen:updated");
        if ($("#txtDescripcionDiag" + TipoDiag).val() == "") { alerta(2, "Debe seleccionar el Diagnóstico"); $("#txtCodigoDiag" + TipoDiag).focus(); return false; }
        if ($("#cboTipoDiagnostico" + TipoDiag).val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $("#cboTipoDiagnostico" + TipoDiag).focus(); return false; }

        if (ReporteOperatorio.ExisteDiagnosticos(tipo)) {
            alerta(2, "El Diagnóstico ya fue agregado.");
            return false;
        } else {
            var idTipoDx = '';
            var txtTipoDx = '';

            idTipoDx = $("#cboTipoDiagnostico" + TipoDiag).val();
            txtTipoDx = $('#cboTipoDiagnostico' + TipoDiag + ' option:selected').text();

            var objRow = {
                codigoCIE10: ReporteOperatorio.objDiagSel.codigoCIE10,
                codigoCIEsinPto: ReporteOperatorio.objDiagSel.codigoCIEsinPto,
                descripcion: ReporteOperatorio.objDiagSel.descripcion,
                esActivo: ReporteOperatorio.objDiagSel.esActivo,
                fechaInicioVigencia: ReporteOperatorio.objDiagSel.fechaInicioVigencia,
                iddiagnostico: ReporteOperatorio.objDiagSel.iddiagnostico,
                idTipoDiagnostico: idTipoDx,
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: txtTipoDx,
                //lab: $('#hdUsaLabs').val() == '1' ? $('#txtLabDiagnostico').val() : $('#cbolabDiagnostico').val(),
                intrahospitalario: ReporteOperatorio.objDiagSel.intrahospitalario
            }

            if (tipo == 1) {
                oTable_DiagnosticosPreOperatorio.api(true).row.add(objRow).draw(false);
            } else if (tipo == 2) {
                oTable_DiagnosticosPostOperatorios.api(true).row.add(objRow).draw(false);
            }



            //ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
            $("#txtDescripcionDiag" + TipoDiag).val("");
            $("#txtCodigoDiag" + TipoDiag).val("");
            $("#cboTipoDiagnostico" + TipoDiag).val(-1);

            $('#txtLabDiagnostico' + TipoDiag).val('')

            $('#cbolabDiagnostico' + TipoDiag).val(-1)

            $('#cbolabDiagnostico' + TipoDiag).trigger("chosen:updated");
            $("#cboTipoDiagnostico" + TipoDiag).trigger("chosen:updated");
            return true;
        };
    },
    QuitarDiagnostico(tipo) {
        if (tipo == 1) {
            var objrowDiag = oTable_DiagnosticosPreOperatorio.api(true).row('.selected').data();

            if (!isEmpty(objrowDiag)) {
                oTable_DiagnosticosPreOperatorio.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
            }
        } else if (tipo == 2) {
            var objrowDiag = oTable_DiagnosticosPostOperatorios.api(true).row('.selected').data();

            if (!isEmpty(objrowDiag)) {
                oTable_DiagnosticosPostOperatorios.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
            }
        }
    },

    ListarReporteOperatorioCQx: async (nroHistoria) => {
        let formData = new FormData()

        formData.append('NroHistoria', $('#txtHistoriaBusq').val())
        formData.append('IdCuentaAtencion', 0)
        formData.append('NroDocumento', $('#txtNroDocumentoBusq').val())
        formData.append('ApellidoPaterno', $('#txtApPaternoBusq').val())
        formData.append('ApellidoMaterno', $('#txtApMaternoBusq').val())
        formData.append('FechaSolicitud', $('#txtFechaSolicitudBusq').val())

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/ListarReporteOperatorioCQx?area=Comun`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },

    SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta: async (NroCuenta) => {
        let formData = new FormData()

        try {
            const response = await HttpClient.Get(`/SalaOperaciones/SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta?area=Comun&NroCuenta=${NroCuenta}`)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos[0]
            }
            return null
        } catch (error) {
            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }
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
    SeleccionarDiagnosticos: async (idAtencion, clasificacion) => {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        oTable_DiagnosticosPreOperatorio.fnClearTable()
        oTable_DiagnosticosPostOperatorios.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;

            $(datos.table).each((i, obj) => {
                if (obj.idTipoDiagnosticoCQx == 1) {
                    oTable_DiagnosticosPreOperatorio.api(true).row.add(obj).draw(false);
                } else if (obj.idTipoDiagnosticoCQx == 2) {
                    oTable_DiagnosticosPostOperatorios.api(true).row.add(obj).draw(false);
                }

            })


            //if (datos.table.length !== 0) {

            //    if (!isEmpty(datos.table)) {
            //        oTable_DiagnosticosPreOperatorio.fnClearTable()
            //        oTable_DiagnosticosPostOperatorios.fnClearTable()
            //    }
            //}
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },
    ListarProcedimientosCQx: async function (NroSolicitud) {
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroSolicitud', NroSolicitud);

        try {

            oTable_solicitudCQx.fnClearTable()

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ListarProcedimientosCQx?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (!isEmpty(datos.table)) {
                if (datos.table.length !== 0)
                    oTable_solicitudCQx.fnAddData(datos.table);
                //else
                //    Ordenes.listaFecha();
            }

            resp = true;
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },

    CrearModificarReporteOperatorioCQx: async () => {
        let formData = new FormData()

        formData.append('IdReporteOperatorio', ReporteOperatorio.IdReporteOperatorio)
        formData.append('IdSolicitudSOP', ReporteOperatorio.IdSolicitudSOP)
        formData.append('IdCuentaAtencion', ReporteOperatorio.IdCuentaAtencion)

        formData.append('IdTurno', $('#cboTurnoQx').val())
        formData.append('IdSala', $('#cboSala').val())
        formData.append('IdTipoCirugia', $('#cboTipoCirugiaProg').val())
        formData.append('IdQuirofano', $('#cboQuirofano').val())
        formData.append('IdOrden', $('#cboOrdenProg').val())
        formData.append('FechaCirugia', $('#txtFechaCirugia').val())
        formData.append('HoraCirugia', $('#txtHoraCirugia').val())
        formData.append('HoraFinalCirugia', $('#txtHoraFinalCirugia').val())
        formData.append('IdGasa', $('#cboGasas').val())
        formData.append('CantidadGasa', $('#txtCantGasas').val())
        formData.append('IdDepressing', $('#cboDepressing').val())
        formData.append('CantidadDepressing', $('#txtCantDepressing').val())
        formData.append('IdPrimeraAnestesia', $('#cboAnestesiaUno').val())
        formData.append('IdTipoPrimeraAnestesia', $('#cboTipoAnestesiaUno').val())
        formData.append('IdSegundaAnestesia', $('#cboAnestesiaDos').val())
        formData.append('IdTipoSegundaAnestesia', $('#cboTipoAnestesiaDos').val())
        formData.append('ProcedimientoCqx', $('#txtProcedimientoCqx').val())
        formData.append('Tecnicas', $('#txtTecnicas').val())
        formData.append('Hallazgos', $('#txtHallazgos').val())
        formData.append('IncidentesAccidentes', $('#txtIncidentesAccidentes').val())

        formData.append('MaterialesCqx', $('#txtMaterialesCqx').val())
        formData.append('AnatomiaPatologica', $('#cboAnatomiaPatologica').val())
        formData.append('TejidoOrganoExaminar', $('#txtTejidoOrganoExaminar').val())
        formData.append('EventoAdversoTransoperativo', $('#cboEventoTransoperativo').val())
        formData.append('EventoAdversoTransanestesico', $('#cboEventoTansanestesico').val())
        formData.append('PinzamientoCorteCordonUmbilical', $('#cboPinzamientoCorteCordonUmbilical').val())
        formData.append('Destino', $('#cboDestino').val())

        formData.append('IdMedicoPrincipal', $('#cboMedicoPrincipal').val())
        formData.append('IdCirujanoII', $('#cboCirujanoII').val())
        formData.append('IdMedicoAyudanteI', $('#cboMedicoAyudanteI').val())
        formData.append('IdMedicoAyudanteII', $('#cboMedicoAyudanteII').val())
        formData.append('IdAnestesiologo', $('#cboAnestesiologo').val())
        formData.append('IdAyudanteAnestesiologo', $('#cboAyudanteAnestesiologo').val())
        formData.append('IdInstrumentistaI', $('#cboInstrumentistaI').val())
        formData.append('IdInstrumentistaII', $('#cboInstrumentistaII').val())
        formData.append('IdTecnicoEnfermeria', $('#cboTecEnfermeria').val())

        formData.append('lstDiagnosticosPre', JSON.stringify(oTable_DiagnosticosPreOperatorio.api(true).data().toArray()));
        formData.append('lstDiagnosticosPost', JSON.stringify(oTable_DiagnosticosPostOperatorios.api(true).data().toArray()));

        //formData.append('NroReporteOperatorio', $('#txtNroReporteOperatorio').val())
        //formData.append('NroFolio', $('#txtNroFolio').val())
        //formData.append('IdCirugiaRealizada', $('#hdIdCirugiaRealizadaCodigo').val())

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/CrearModificarReporteOperatorioCQx?area=ProgramacionSalaOperaciones`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos[0]
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },


    CargarDatosReporteOperatorioQx: async (objRow) => {

        Variables.Cargar(objRow)

        ReporteOperatorio.IdPaciente = objRow.idPaciente
        ReporteOperatorio.IdSolicitudSOP = objRow.idSolicitudSOP
        ReporteOperatorio.idOrdenProg = objRow.idOrdenProg
        //ReporteOperatorio.IdEstadoSolicitud = objRow.idEstado
        ReporteOperatorio.NroHistoriaClinica = objRow.nroHistoriaClinica
        //ReporteOperatorio.NroSolicitud = objRow.nroSolicitud
        ReporteOperatorio.IdCuentaAtencion = objRow.idCuentaAtencion
        ReporteOperatorio.IdReporteOperatorio = objRow.idReporteOperatorio

        await ReporteOperatorio.ListarM_TurnosCirugiaCQx(objRow.idTIpoIntervencion)
        await ReporteOperatorio.ListarM_QuirofanoCQx(objRow.idSalaProg)
        await ReporteOperatorio.ListarM_TipoAnestesiaCQx(objRow.idPrimeraAnestesia)

        $('#txtNroSolicitudBusq').val(objRow.nroSolicitud)
        $('#txtNroCuenta').val(objRow.idCuentaAtencion)
        $('#txtNroHistoriaSolicitud').val(objRow.nroHistoriaClinica)
        $('#cboMedicoSolicita').val(objRow.idMedicoSolicita)
        $('#txtEstado').val(objRow.estado)
        $('#txtDatosPaciente').val(objRow.paciente)
        $('#txtNroSolicitud').val(objRow.nroSolicitud)
        $("#txtEdadAnioSolicitud").val(objRow.edadEnAnio)
        $("#txtEdadMesSolicitud").val(objRow.edadEnMes)
        $("#txtEdadDiaSolicitud").val(objRow.edadEnDia)
        $("#txtSexoSolicitud").val(objRow.sexo)
        $("#txtServicioSolicitud").val(objRow.servicio)
        $("#txtCamaSolicitud").val(objRow.cama)
        $('#cboUbicacionPaciente').val(objRow.idUbicacionPaciente)
        $("#cboClaseIntervencion").val(objRow.idTIpoIntervencion)
        $("#cboClasePlaciente").val(objRow.idTipoPaciente)
        $("#txtFechaParaCQx").val(objRow.fechaSugerida)
        $("#txtHoraParaCqx").val(objRow.horaSugerida)
        $("#txtFechaSolicitudCQx").val(objRow.fechaSolicitud)
        $("#txtHoraSolicitudCQx").val(objRow.horaSolicitud)
        $("#txtFechaSolicitudCQxAceptada").val(objRow.fechaAceptada)
        $("#txtHoraSolicitudCQxAceptada").val(objRow.horaAceptada)
        $('#cboTipoCirugia').val(objRow.idTipoCirugia)
        $('#cboTurno').val(objRow.idTurno)
        $('#cboOrdenSugerido').val(objRow.idOrdenSugerido)

        $('#cboTurnoQx').val(objRow.idTurnoProg)
        $('#cboSala').val(objRow.idSalaProg)
        $('#cboTipoCirugiaProg').val(objRow.idTipoCirugiaProg)
        $('#cboQuirofano').val(objRow.idQuirofano)
       
        $('#txtFechaCirugia').val(objRow.fechaCirugia)
        $('#txtHoraCirugia').val(objRow.horaCirugia)
        $('#txtHoraFinalCirugia').val(objRow.horaFinalCirugia)
        $('#txtObservacionProgramacion').val(objRow.observacionProgramacion)

        $('#cboMedicoPrincipal').val(objRow.idMedicoPrincipal)
        $('#cboCirujanoII').val(objRow.idCirujanoII)
        $('#cboMedicoAyudanteI').val(objRow.idMedicoAyudanteI)
        $('#cboMedicoAyudanteII').val(objRow.idMedicoAyudanteII)
        $('#cboAnestesiologo').val(objRow.idAnestesiologo)
        $('#cboAyudanteAnestesiologo').val(objRow.idAyudanteAnestesiologo)
        $('#cboInstrumentistaI').val(objRow.idInstrumentistaI)
        $('#cboInstrumentistaII').val(objRow.idInstrumentistaII)
        $('#cboTecEnfermeria').val(objRow.idTecnicoEnfermeria)

        $('#cboGasas').val(objRow.idGasa)
        $('#txtCantGasas').val(objRow.cantidadGasa)
        $('#cboDepressing').val(objRow.idDepressing)
        $('#txtCantDepressing').val(objRow.cantidadDepressing)
        $('#cboAnestesiaUno').val(objRow.idPrimeraAnestesia)
        $('#cboTipoAnestesiaUno').val(objRow.idTipoPrimeraAnestesia)
        $('#cboAnestesiaDos').val(objRow.idSegundaAnestesia)
        $('#cboTipoAnestesiaDos').val(objRow.idTipoSegundaAnestesia)

        $('#txtProcedimientoCqx').val(objRow.procedimientoCqx)
        $('#txtTecnicas').val(objRow.tecnicas)
        $('#txtHallazgos').val(objRow.hallazgos)
        $('#txtIncidentesAccidentes').val(objRow.incidentesAccidentes)
        $('#txtMaterialesCqx').val(objRow.materialesCqx)
        $('#cboAnatomiaPatologica').val(objRow.anatomiaPatologica)
        $('#txtTejidoOrganoExaminar').val(objRow.tejidoOrganoExaminar)
        $('#cboEventoTransoperativo').val(objRow.eventoAdversoTransoperativo)
        $('#cboEventoTansanestesico').val(objRow.eventoAdversoTransanestesico)
        $('#cboPinzamientoCorteCordonUmbilical').val(objRow.pinzamientoCorteCordonUmbilical)
        $('#cboDestino').val(objRow.destino)

        $('#cboPuntoCargaRegistro').val(1060)

        await ReporteOperatorio.ListarM_OrdenCQx()
        $('#cboOrdenProg').val(objRow.idOrdenProg)

        await ReporteOperatorio.ListarProcedimientosCQx(objRow.nroSolicitud)
        await ReporteOperatorio.SeleccionarDiagnosticos(objRow.idAtencion, 8)

        await ConsumoServicio.ListaCptByPuntoCargaByFuente(1060, objRow.idFormaPago)
        await ReporteOperatorio.BuscaAtencionesCptCEparaFormatoHIS(ReporteOperatorio.IdCuentaAtencion)

        $('.chzn-select').chosen().trigger("chosen:updated")


    },

    LimpiarCamposReporteOperatorioQx: () => {
        Variables.Limpiar()

        ReporteOperatorio.IdPaciente = 0
        ReporteOperatorio.IdSolicitudSOP = 0
        //ReporteOperatorio.IdEstadoSolicitud = objRow.idEstado
        ReporteOperatorio.NroHistoriaClinica = 0
        //ReporteOperatorio.NroSolicitud = objRow.nroSolicitud
        ReporteOperatorio.IdCuentaAtencion = 0
        ReporteOperatorio.IdReporteOperatorio = 0

        $('#txtNroSolicitudBusq').val('')
        $('#txtNroCuenta').val('')
        $('#txtNroHistoriaSolicitud').val('')
        $('#cboMedicoSolicita').val(0)
        $('#txtEstado').val('')
        $('#txtDatosPaciente').val('')
        $('#txtNroSolicitud').val('')
        $("#txtEdadAnioSolicitud").val('')
        $("#txtEdadMesSolicitud").val('')
        $("#txtEdadDiaSolicitud").val('')
        $("#txtSexoSolicitud").val('')
        $("#txtServicioSolicitud").val('')
        $("#txtCamaSolicitud").val('')
        $('#cboUbicacionPaciente').val(0)
        $("#cboClaseIntervencion").val(0)
        $("#cboClasePlaciente").val(0)
        $("#txtFechaParaCQx").val('')
        $("#txtHoraParaCqx").val('')
        $("#txtFechaSolicitudCQx").val('')
        $("#txtHoraSolicitudCQx").val('')
        $("#txtFechaSolicitudCQxAceptada").val('')
        $("#txtHoraSolicitudCQxAceptada").val('')
        $('#cboTipoCirugia').val(0)
        $('#cboTurno').val(0)
        $('#cboOrdenSugerido').val(0)

        $('#cboTurnoQx').val(0)
        $('#cboSala').val(0)
        $('#cboTipoCirugiaProg').val(0)
        $('#cboQuirofano').val(0)
        $('#cboOrdenProg').val(0)
        $('#txtFechaCirugia').val('')
        $('#txtHoraCirugia').val('')
        $('#txtHoraFinalCirugia').val('')
        $('#txtObservacionProgramacion').val('')

        $('#cboMedicoPrincipal').val(0)
        $('#cboCirujanoII').val(0)
        $('#cboMedicoAyudanteI').val(0)
        $('#cboMedicoAyudanteII').val(0)
        $('#cboAnestesiologo').val(0)
        $('#cboAyudanteAnestesiologo').val(0)
        $('#cboInstrumentistaI').val(0)
        $('#cboInstrumentistaII').val(0)
        $('#cboTecEnfermeria').val(0)

        $('#cboGasas').val(0)
        $('#txtCantGasas').val('')
        $('#cboDepressing').val(0)
        $('#txtCantDepressing').val('')
        $('#cboAnestesiaUno').val(0)
        $('#cboTipoAnestesiaUno').val(0)
        $('#cboAnestesiaDos').val(0)
        $('#cboTipoAnestesiaDos').val(0)

        $('#txtProcedimientoCqx').val('')
        $('#txtTecnicas').val('')
        $('#txtHallazgos').val('')
        $('#txtIncidentesAccidentes').val('')
        $('#txtMaterialesCqx').val('')
        $('#cboAnatomiaPatologica').val(0)
        $('#txtTejidoOrganoExaminar').val('')
        $('#cboEventoTransoperativo').val(0)
        $('#cboEventoTansanestesico').val(0)
        $('#cboPinzamientoCorteCordonUmbilical').val(0)
        $('#cboDestino').val(0)

        //$('#cboPuntoCargaRegistro').val(1060)

        oTable_consumoServAtencion.fnClearTable()
        oTable_DiagnosticosPostOperatorios.fnClearTable()
        oTable_DiagnosticosPreOperatorio.fnClearTable()
        oTable_solicitudCQx.fnClearTable()

        $('.chzn-select').chosen().trigger("chosen:updated")

    },

    HabilitarDeshabilitarCampos: (estado) => {

        $('#txtNroSolicitudBusq').prop('disabled', estado);
        $('#btnBuscarNroSolicitud').prop('disabled', estado);
        $('#txtNroCuenta').prop('disabled', estado);
        $('#btnBuscarNroCuenta').prop('disabled', estado);

        $('#btnAgregarCSAtencion').prop('disabled', estado);
        $('#btnEliminarCSAtencion').prop('disabled', estado);

        $('#cboTurnoQx').prop('disabled', estado);
        $('#cboSala').prop('disabled', estado);
        $('#cboTipoCirugiaProg').prop('disabled', estado);
        $('#cboQuirofano').prop('disabled', estado);
        $('#cboOrdenProg').prop('disabled', estado);
        $('#txtFechaCirugia').prop('disabled', estado);
        //$('#txtObservacionProgramacion').prop('disabled', estado);

        $('#cboMedicoPrincipal').prop('disabled', estado);
        $('#cboCirujanoII').prop('disabled', estado);
        $('#cboMedicoAyudanteI').prop('disabled', estado);
        $('#cboMedicoAyudanteII').prop('disabled', estado);
        $('#cboAnestesiologo').prop('disabled', estado);
        $('#cboAyudanteAnestesiologo').prop('disabled', estado);
        $('#cboInstrumentistaI').prop('disabled', estado);
        $('#cboInstrumentistaII').prop('disabled', estado);
        $('#cboTecEnfermeria').prop('disabled', estado);

        $('#cboGasas').prop('disabled', estado);
        $('#txtCantGasas').prop('disabled', estado);
        $('#cboDepressing').prop('disabled', estado);
        $('#txtCantDepressing').prop('disabled', estado);
        $('#cboAnestesiaUno').prop('disabled', estado);
        $('#cboTipoAnestesiaUno').prop('disabled', estado);
        $('#cboAnestesiaDos').prop('disabled', estado);
        $('#cboTipoAnestesiaDos').prop('disabled', estado);

        $('#txtCodigoDiagPre').prop('disabled', estado);
        $('#cboTipoDiagnosticoPre').prop('disabled', estado);
        $('#btnAñadirDiagnostico').prop('disabled', estado);
        $('#btnQuitarDiagnostico').prop('disabled', estado);

        $('#txtCodigoDiagPost').prop('disabled', estado);
        $('#cboTipoDiagnosticoPost').prop('disabled', estado);
        $('#btnAñadirDiagnostico').prop('disabled', estado);
        $('#btnQuitarDiagnostico').prop('disabled', estado);

        $('#btnGuardar').show()

        if (estado) {
            $('#btnGuardar').hide()
        }

        $('.chzn-select').chosen().trigger("chosen:updated")

    },
    //ListarTipoServicio: () => {
    //    return HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun').then(res => {
    //        if (res.session) {
    //            // Procesar los datos de las empresas
    //            const datos = res.dataSet.table;

    //            $('#cboUbicacionPaciente').empty();

    //            if (datos.length > 0) {

    //                $(datos).each(function (i, obj) {
    //                    if (obj.valor == 0) {
    //                        $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">Seleccionar una opcion</option>`)
    //                    } else {
    //                        $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
    //                    }

    //                })

    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //                return true
    //            } else {
    //                console.log("No se encontraron datos.");
    //                return false
    //            }
    //        } else {
    //            console.log("La sesión ha expirado.");
    //            return false
    //        }
    //    })
    //},



    //ListaTiposDocumentos: () => {

    //    fetch('/Utilitario/ListaTiposDocumentos?area=Comun', {
    //        method: 'GET',
    //        headers: {
    //            'Content-Type': 'application/json'
    //        }
    //    })
    //        .then(res => res.json())
    //        .catch(error => console.error('Error:', error))
    //        .then(response => {
    //            $('#cboTipoDocTutor').empty();
    //            $(response.lsDocumentos.table).each(function (i, obj) {
    //                $('#cboTipoDocTutor').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
    //            })
    //            $('.chzn-select').chosen().trigger("chosen:updated");
    //        })
    //},



    SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion: async (IdCuentaAtencion, NroSolicitud) => {
        let formData = new FormData()

        try {
            const response = await HttpClient.Get(`/SalaOperaciones/SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion?area=Comun&IdCuentaAtencion=${IdCuentaAtencion}&NroSolicitud=${NroSolicitud}`)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos[0]
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },

    ListarProcedimientosCQx: async function (NroSolicitud) {
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroSolicitud', NroSolicitud);

        try {

            oTable_solicitudCQx.fnClearTable()

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ListarProcedimientosCQx?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (!isEmpty(datos.table)) {
                if (datos.table.length !== 0)
                    oTable_solicitudCQx.fnAddData(datos.table);
                //else
                //    Ordenes.listaFecha();
            }

            resp = true;
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },



    //ConfigurarCamposPorDefecto: () => {
    //    $('#txtHc').prop('disabled', true)
    //    $('#btnBuscarHC').prop('disabled', true)

    //    $('#txtPeso').prop('disabled', true)
    //    $('#cboSexo').prop('disabled', true)

    //    $('#cboUbicacionPaciente').prop('disabled', true)
    //    $('#cboTipoSolicitud').prop('disabled', true)
    //    $('#cboMedicoSolicita').prop('disabled', true)
    //    $('#cboTipoInterCQx').prop('disabled', true)
    //    $('#cboTipointervencion').prop('disabled', true)
    //    $('#cboTurno').prop('disabled', true)
    //    $('#cboTipoOperacion').prop('disabled', true)
    //    $('#cboTipoCirugia').prop('disabled', true)
    //    $('#cboSala').prop('disabled', true)
    //    $('#cboEspecialidad').prop('disabled', true)
    //    $('#cboCondicion').prop('disabled', true)
    //    $('#cboQuirifano').prop('disabled', true)
    //    $('#cboServicioOrigen').prop('disabled', true)
    //    $('#cboNroCama').prop('disabled', true)
    //    $('#txtFechaCirugia').prop('disabled', true)
    //    $('#txtHoraCirugia').prop('disabled', true)
    //    $('#txtDescripcioncirugia').prop('disabled', true)
    //    $('#txtRiesgosDerivados').prop('disabled', true)
    //    $('#cboTipoDocTutor').prop('disabled', true)
    //    $('#txtNroDocumentoMaterno').prop('disabled', true)
    //    $('#cboParentesco').prop('disabled', true)
    //    $('#cboMedicoPrincipal').prop('disabled', true)
    //    $('#cboCirujanoII').prop('disabled', true)
    //    $('#cboMedicoAyudanteI').prop('disabled', true)
    //    $('#cboMedicoAyudanteII').prop('disabled', true)
    //    $('#cboAnestesiologo').prop('disabled', true)
    //    $('#cboAyudanteAnestesiologo').prop('disabled', true)
    //    $('#cboInstrumentistaI').prop('disabled', true)
    //    $('#cboInstrumentistaII').prop('disabled', true)
    //    $('#cboTecEnfermeria').prop('disabled', true)

    //    $('.chzn-select').chosen().trigger("chosen:updated")
    //},

    //LimpiarDatosSolicitudSalaQx: () => {

    //    ProgramacionSalaOperaciones.IdPaciente = 0
    //    ProgramacionSalaOperaciones.IdSolicitudSOP = 0
    //    ProgramacionSalaOperaciones.IdEstadoSolicitud = 0
    //    ProgramacionSalaOperaciones.NroHistoriaClinica = 0

    //    $('#cboUbicacionPaciente').val(0)
    //    $('#txtDatosPaciente').val('')
    //    $('#txtNroSolicitud').val('')
    //    $('#txtHcPaciente').val('')
    //    $('#txtEdad').val('')
    //    $('#txtPeso').val('')
    //    $('#cboSexo').val(0)
    //    $('#txtFechaSolicitudSalaOp').val('')
    //    $('#cboTipoSolicitud').val(0)
    //    $('#cboMedicoSolicita').val(0)
    //    $('#txtEstado').val('')
    //    $('#cboTipoInterCQx').val(0)
    //    $('#cboTipointervencion').val(0)
    //    $('#cboTurno').val(0)
    //    $('#cboTipoOperacion').val(0)
    //    $('#cboTipoCirugia').val(0)
    //    $('#cboSala').val(0)
    //    $('#cboEspecialidad').val(0)
    //    $('#cboCondicion').val(0)
    //    $('#cboQuirifano').val(0)
    //    $('#cboServicioOrigen').val(0)
    //    $('#cboNroCama').val(0)
    //    $('#txtFechaCirugia').val('')
    //    $('#txtHoraCirugia').val('')
    //    $('#txtDescripcioncirugia').val('')
    //    $('#txtRiesgosDerivados').val('')
    //    $('#cboTipoDocTutor').val(0)
    //    $('#txtNroDocumentoMaterno').val('')
    //    $('#cboParentesco').val(0)
    //    $('#cboMedicoPrincipal').val(0)
    //    $('#cboCirujanoII').val(0)
    //    $('#cboMedicoAyudanteI').val(0)
    //    $('#cboMedicoAyudanteII').val(0)
    //    $('#cboAnestesiologo').val(0)
    //    $('#cboAyudanteAnestesiologo').val(0)
    //    $('#cboInstrumentistaI').val(0)
    //    $('#cboInstrumentistaII').val(0)
    //    $('#cboTecEnfermeria').val(0)



    //    $('#cboServicioOpera').val(0)
    //    $('#cboBancoSangre').val(0)
    //    $('#txtCantBancoSangre').val('')
    //    $('#txtGrupoSanguineo').val('')
    //    $('#txtFactorRH').val('')
    //    $('#cboRiesgoQx').val(0)
    //    $('#txtReqInstrumental').val('')
    //    $('#cboTurnoQx').val(0)
    //    $('#txtTiempoQx').val('')
    //    $('#txtHoraFinalCirugia').val('')
    //    $('#txtResumenCirugia').val('')

    //    $('.chzn-select').chosen().trigger("chosen:updated")
    //},
    //HabilitarDeshabilitarCamposSolicitudQx: (estado) => {

    //    $('#txtHc').prop('disabled', estado)
    //    $('#btnBuscarHC').prop('disabled', estado)

    //    $('#txtPeso').prop('disabled', estado)
    //    $('#cboSexo').prop('disabled', estado)

    //    $('#cboUbicacionPaciente').prop('disabled', estado)
    //    $('#cboTipoSolicitud').prop('disabled', estado)
    //    $('#cboMedicoSolicita').prop('disabled', estado)
    //    $('#cboTipoInterCQx').prop('disabled', estado)
    //    $('#cboTipointervencion').prop('disabled', estado)
    //    $('#cboTurno').prop('disabled', estado)
    //    $('#cboTipoOperacion').prop('disabled', estado)
    //    $('#cboTipoCirugia').prop('disabled', estado)
    //    $('#cboSala').prop('disabled', estado)
    //    $('#cboEspecialidad').prop('disabled', estado)
    //    $('#cboCondicion').prop('disabled', estado)
    //    $('#cboQuirifano').prop('disabled', estado)
    //    $('#cboServicioOrigen').prop('disabled', estado)
    //    $('#cboNroCama').prop('disabled', estado)
    //    $('#txtFechaCirugia').prop('disabled', estado)
    //    $('#txtHoraCirugia').prop('disabled', estado)
    //    $('#txtDescripcioncirugia').prop('disabled', estado)
    //    $('#txtRiesgosDerivados').prop('disabled', estado)
    //    $('#cboTipoDocTutor').prop('disabled', estado)
    //    $('#txtNroDocumentoMaterno').prop('disabled', estado)
    //    $('#cboParentesco').prop('disabled', estado)
    //    $('#cboMedicoPrincipal').prop('disabled', estado)
    //    $('#cboCirujanoII').prop('disabled', estado)
    //    $('#cboMedicoAyudanteI').prop('disabled', estado)
    //    $('#cboMedicoAyudanteII').prop('disabled', estado)
    //    $('#cboAnestesiologo').prop('disabled', estado)
    //    $('#cboAyudanteAnestesiologo').prop('disabled', estado)
    //    $('#cboInstrumentistaI').prop('disabled', estado)
    //    $('#cboInstrumentistaII').prop('disabled', estado)
    //    $('#cboTecEnfermeria').prop('disabled', estado)

    //    $('.chzn-select').chosen().trigger("chosen:updated")
    //},

    InitDatablesReporteOperatorio: () => {

        var parms = {
            "scrollY": "600px",
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
                    data: "nroSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(rowData.nroSolicitud.padStart(9, 0))
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "nroReporteOperatorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "nroFolio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'nroHistoriaClinica',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 5,
                    data: 'paciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: 'estado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                        if (rowData.idEstado == 1) {
                            $(td).html('<span class="chip secondary">' + rowData.estado + '</span >');
                        }
                        if (rowData.idEstado == 2) {
                            $(td).html('<span class="chip blue">' + rowData.estado + '</span >');
                            $(td).parent().css('color', '#758cff');
                        }
                        if (rowData.idEstado == 3) {
                            $(td).html('<span class="chip" style="background: #a206cb; color: #fff;">' + rowData.estado + '</span >');
                            $(td).parent().css('color', '#a206cb');
                        }
                        if (rowData.idEstado == 4) {
                            $(td).html('<span class="chip success">' + rowData.estado + '</span >');
                            $(td).parent().css('color', '#00cc99');
                        }
                        if (rowData.idEstado == 10) {
                            $(td).html('<span class="chip danger">' + rowData.estado + '</span >');
                            $(td).parent().css('color', '#df4a44');
                        }
                    }
                },
                {
                    width: '8%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

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


                    }
                }
            ]
        }

        var tableWrapper = $('#tblReporteOperatorio'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ReporteOperatorio = $("#tblReporteOperatorio").dataTable(parms);

    },

    InitDatablesDiagnosticos: () => {

        let params = {
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            "autoWidth": false,
            scrollCollapse: true,
            bLengthChange: false,
            bPaginate: false,
            buttons: [],
            columns: [
                {
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', visible: false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', visible: false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": true },
                { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": false }

            ]
        }

        //var tableWrapper = $('#tblListaSolicitudes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DiagnosticosPreOperatorio = $("#lstDiagnosticosPreOperatorio").dataTable(params);
        oTable_DiagnosticosPostOperatorios = $("#lstDiagnosticosPostOperatorio").dataTable(params);

    },
    InitDatablesBusquedaDiagnostico: () => {

        ObjtableBusquedaDiagnostico = $("#lstDiagnosticosBusqueda").dataTable({
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

    InitDatablesSolicitudCQx() {
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
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero" disabled>'
                        $(td).html(inputCantidad);
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogoSolicitudCQx'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_solicitudCQx = $("#tblCatalogoSolicitudCQx").dataTable(parms);
        $('#tblCatalogoSolicitudCQx_length').css('display', 'none')
    },

    InitDatablesPacientesBusqueda: () => {

        var parms = {
            "scrollY": "600px",
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
                    width: '5%',
                    targets: 0,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "nroSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '24%',
                    targets: 2,
                    data: 'paciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'sexo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'fechaNacimientoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: 'idCuentaAtencion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: 'fechaIngreso',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '12%',
                //    targets: 6,
                //    data: 'servicioIngreso',
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '12%',
                //    targets: 7,
                //    data: 'servicioEgreso',
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '12%',
                    targets: 7,
                    data: 'tipoServicio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblPacientesBusqueda'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PacientesBusqueda = $("#tblPacientesBusqueda").dataTable(parms);

    },
    Events: function () {
        /* Button Events */
        $("#btnAgregarReporte").on("click", function () {
            ReporteOperatorio.LimpiarCamposReporteOperatorioQx()
            ReporteOperatorio.HabilitarDeshabilitarCampos(false)
            $("#modalSolicitudSalaOp").modal("show");
        })
        $('#btnBuscarPacientes').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            Cargando(1)

            let response = await ReporteOperatorio.ListarReporteOperatorioCQx()

            oTable_ReporteOperatorio.fnClearTable()

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos.')
                Cargando(0)
                return false
            }

            oTable_ReporteOperatorio.fnAddData(response)



            Cargando(0)
        })
        $('#btnBuscarNroCuenta').on('click', async () => {

            $('#modalPacientesBusqueda').modal('show')

            $('.chzn-select').chosen().trigger("chosen:updated")
            //if ($('#txtNroCuenta').val() == '') {
            //    alerta(2, 'Ingrese un N° de Cuenta por favor.')
            //    $('#txtNroCuenta').focus()
            //    return false
            //}

            //Cargando(1)

            //let response = await ReporteOperatorio.SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta($('#txtNroCuenta').val())

            //if (isEmpty(response)) {
            //    alerta(4, 'No se encontraron datos para el N° Cuenta ingresado.')
            //    Cargando(0)
            //    return false
            //}

            //ReporteOperatorio.CargarDatosReporteOperatorioQx(response)

            //$('.chzn-select').chosen().trigger("chosen:updated")

            //Cargando(0)

        })

        $('#btnBuscarNroSolicitud').on('click', async () => {

            $('#modalPacientesBusqueda').modal('show')

            $('.chzn-select').chosen().trigger("chosen:updated")

            //if ($('#txtNroSolicitudBusq').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Solicitud para la busqueda.')
            //    $('#txtNroSolicitudBusq').focus()
            //    return false
            //}

            //Cargando(1)

            //let response = await ProgramacionSalaOperaciones.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud($('#txtNroSolicitudBusq').val())

            //if (isEmpty(response)) {
            //    alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
            //    Cargando(0)
            //    return false
            //}

            //if (response.idProgramacionSala > 0) {
            //    swal({
            //        title: 'Atención',
            //        text: `Esta solicitud ya se encuentra registrada. \n N° Solicitud: ${response.nroSolicitud} \n N° Historia: ${response.nroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
            //        type: 'info',
            //        allowOutsideClick: false,
            //    }).done();
            //    Cargando(0)
            //    return false
            //}

            //ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(response)


            ////$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
            ////
            ////$('#txtHcPaciente').val(response.nroHistoriaClinica)
            ////$('#cboSexo').val(response.idTipoSexo)
            ////



            //console.log('response', response)


            //$('.chzn-select').chosen().trigger("chosen:updated")

            //Cargando(0)
        })

        //$('#btnBuscarNroSolicitud').on('click', async () => {
        //    if ($('#txtNroSolicitudBusq').val() == '') {
        //        alerta(2, 'Debe ingresar un Nro. de Solicitud para la busqueda.')
        //        $('#txtNroSolicitudBusq').focus()
        //        return false
        //    }

        //    Cargando(1)

        //    let response = await ReporteOperatorio.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud($('#txtNroSolicitudBusq').val())

        //    if (isEmpty(response)) {
        //        alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
        //        Cargando(0)
        //        return false
        //    }

        //    //if (response.idProgramacionSala > 0) {
        //    //    swal({
        //    //        title: 'Atención',
        //    //        text: `Esta solicitud ya se encuentra registrada. \n N° Solicitud: ${response.nroSolicitud} \n N° Historia: ${response.nroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
        //    //        type: 'info',
        //    //        allowOutsideClick: false,
        //    //    }).done();
        //    //    Cargando(0)
        //    //    return false
        //    //}

        //    ReporteOperatorio.CargarDatosReporteOperatorioQx(response)


        //    //$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
        //    //
        //    //$('#txtHcPaciente').val(response.nroHistoriaClinica)
        //    //$('#cboSexo').val(response.idTipoSexo)
        //    //



        //    console.log('response', response)


        //    $('.chzn-select').chosen().trigger("chosen:updated")

        //    Cargando(0)
        //})

        $('#btnGuardar').on('click', async () => {

            if (ReporteOperatorio.IdPaciente == 0) {
                alerta(2, 'Debe seleccionar un paciente')
                $('#txtHc').focus()
                return false
            }

            Cargando(1)

            let response = await ReporteOperatorio.CrearModificarReporteOperatorioCQx() // falta agregar nro de cuenta y numero de solicitud

            if (!isEmpty(response)) {
                swal({
                    title: 'Atención',
                    text: `El registro se realizo con exito.`,
                    type: 'info',
                    allowOutsideClick: false,
                }).done();


            }

            $('#btnBuscarPacientes').click()
            $('#modalSolicitudSalaOp').modal('hide')


            console.log('response', response)


            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        $("#btnModificarRegistro").on("click", function () {
            ReporteOperatorio.LimpiarCamposReporteOperatorioQx()
            ReporteOperatorio.HabilitarDeshabilitarCampos(false)

            let objRow = oTable_ReporteOperatorio.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro de la tabla.')
                return false
            }

            //ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

            //$('#txtHc').prop('disabled', true)
            //$('#btnBuscarHC').prop('disabled', true)
            //$('#txtNroSolicitudBusq').prop('disabled', true)
            //$('#btnGuardar').show()

            //ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()
            ReporteOperatorio.CargarDatosReporteOperatorioQx(objRow)

            $("#modalSolicitudSalaOp").modal("show");
        })

        $("#btnConsultar").on("click", function () {
            ReporteOperatorio.LimpiarCamposReporteOperatorioQx()
            ReporteOperatorio.HabilitarDeshabilitarCampos(true)

            let objRow = oTable_ReporteOperatorio.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro de la tabla.')
                return false
            }

            //ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

            //$('#txtHc').prop('disabled', true)
            //$('#btnBuscarHC').prop('disabled', true)
            //$('#txtNroSolicitudBusq').prop('disabled', true)
            //$('#btnGuardar').show()

            //ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()
            ReporteOperatorio.CargarDatosReporteOperatorioQx(objRow)

            $("#modalSolicitudSalaOp").modal("show");
        })

        $('#btnBuscarSolicitud').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            Cargando(1)

            let response = await ReporteOperatorio.ListarSolicitudesSalaOperaciones(NroHistoria = $('#txtHistoriaBusqSolicitud').val(), NroSolicitud = $('#txtNroSolicitudBusqSolicitud').val(),
                IdCuentaAtencion = 0, NroDocumento = $('#txtNroSolicitudBusqSolicitud').val(), ApellidoPaterno = $('#txtApPaternoBusqSolicitud').val(),
                ApellidoMaterno = $('#txtApMaternoBusqSolicitud').val(), FechaSolicitud = $('#txtFechaSolicitudBusqSolicitud').val())

            oTable_PacientesBusqueda.fnClearTable()

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos.')
                Cargando(0)
                return false
            }

            for (let obj of response) {
                if (obj.idEstado == 3) {
                    oTable_PacientesBusqueda.api(true).row.add(obj).draw(false);
                }
            }


            //ObjtableDiagnosticosSolicitudCQx.api(true).row.add(objRow).draw(false);

            //oTable_PacientesBusqueda.(response)



            Cargando(0)
        })

        //$('#btnAgregarCSAtencion').on('click', async function () {
        //    //await ConsumoServicio.IniciarData();

        //    //ConsumoServicio.bloqueoProcedencia();
        //    //ConsumoServicio.limpiar();
        //    ////var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        //    ////$("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
        //    ////ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1); // bloquear aqui

        //    //$("#txtNroCuentaRegistro").val(Variables.IdCuentaAtencion);
        //    //await ConsumoServicio.listaPorCuenta(Variables.IdCuentaAtencion, 1); // bloquear aqui           
        //    //$("#txtNroCuentaRegistro").attr('disabled', true);
        //    //$("#txtCantidadCpt").val(1);



        //    //$('#cbolabCpt').trigger("chosen:updated");

        //    $('#modalConsumoServicio').modal('show');
        //});


        $('#txtDescripcionDiagFiltro').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                ReporteOperatorio.BuscarDiagnosticoBusqueda();
            }
        });

        $("#txtCodigoDiagPre").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                if ($("#txtCodigoDiagPre").val() != "") {
                    ReporteOperatorio.AbrirModalBusqueda(1);
                    ReporteOperatorio.BuscarDiagnostico($("#txtCodigoDiagPre").val());
                    $("#txtCodigoDiagFiltro").val($("#txtCodigoDiagPre").val());
                } else {
                    alerta(2, "Debe ingresar el código");
                }
            }
        });

        $("#txtCodigoDiagPost").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                if ($("#txtCodigoDiagPost").val() != "") {
                    ReporteOperatorio.AbrirModalBusqueda(2);
                    ReporteOperatorio.BuscarDiagnostico($("#txtCodigoDiagPost").val());
                    $("#txtCodigoDiagFiltro").val($("#txtCodigoDiagPost").val());
                } else {
                    alerta(2, "Debe ingresar el código");
                }
            }
        });

        $('#lstDiagnosticosPreOperatorio tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosPreOperatorio  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });
        $('#lstDiagnosticosPostOperatorio tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosPostOperatorio  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });
        $('#lstDiagnosticosBusqueda tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosBusqueda  tbody tr').removeClass("selected");
            $(this).addClass('selected');
        });

        ObjtableBusquedaDiagnostico.on('click', function (e, datatable, key, cell, originalEvent) {
            ReporteOperatorio.AgregarDiagnosticoBusqueda();
        })

        /* Select Events */

        $('#cboSala').on('change', async () => {

            Cargando(1)

            await ReporteOperatorio.ListarM_QuirofanoCQx($('#cboSala').val())

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        $('#cboAnestesiaUno').on('change', async () => {

            Cargando(1)

            await ReporteOperatorio.ListarM_TipoAnestesiaCQx($('#cboAnestesiaUno').val())

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        /* Table Events */
        $('#tblReporteOperatorio tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ReporteOperatorio.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })

        $('#tblPacientesBusqueda tbody').on('click', 'tr', function (e) {
            oTable_PacientesBusqueda.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })

        $('#tblPacientesBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_PacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let objrow = oTable_PacientesBusqueda.api(true).row('.selected').data()

            Cargando(1)

            let response = await ReporteOperatorio.SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion(objrow.idCuentaAtencion, objrow.nroSolicitud)

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
                Cargando(0)
                return false
            }

            //if (response.idProgramacionSala > 0) {
            //    swal({
            //        title: 'Atención',
            //        text: `Esta solicitud ya se encuentra registrada. \n N° Solicitud: ${response.nroSolicitud} \n N° Historia: ${response.nroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
            //        type: 'info',
            //        allowOutsideClick: false,
            //    }).done();
            //    Cargando(0)
            //    return false
            //}

            ReporteOperatorio.CargarDatosReporteOperatorioQx(response)


            //$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
            //
            //$('#txtHcPaciente').val(response.nroHistoriaClinica)
            //$('#cboSexo').val(response.idTipoSexo)
            //



            $('#modalPacientesBusqueda').modal('hide')

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        $('#tblReporteOperatorio tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_ReporteOperatorio.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ReporteOperatorio.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                
                const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idAtencion, row.idProCabecera, tipoFormato, tipoHoja);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
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

        //$("#btnAgregarProgramacion").on("click", function () {

        //    ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

        //    $('#txtHc').prop('disabled', false)
        //    $('#btnBuscarHC').prop('disabled', false)
        //    $('#btnGuardar').show()

        //    ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()

        //    $("#txtFechaSolicitudSalaOp").datepicker("setDate", moment().toDate().format('dd/mm/yyyy'))

        //    $("#modalSolicitudSalaOp").modal("show");
        //})



        //$("#btnConsultar").on("click", function () {
        //    let objRow = oTable_ListaSolicitudes.api(true).row('.selected').data()

        //    if (isEmpty(objRow)) {
        //        alerta(2, 'Selecciona un registro de la tabla.')
        //        return false
        //    }

        //    ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

        //    $('#txtHc').prop('disabled', true)
        //    $('#btnBuscarHC').prop('disabled', true)
        //    $('#btnGuardar').hide()

        //    ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()
        //    ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(objRow)

        //    $("#modalSolicitudSalaOp").modal("show");
        //})



        //$('#btnBuscarNroSolicitud').on('click', async () => {
        //    if ($('#txtNroSolicitudBusq').val() == '') {
        //        alerta(2, 'Debe ingresar un Nro. de Solicitud para la busqueda.')
        //        $('#txtNroSolicitudBusq').focus()
        //        return false
        //    }

        //    Cargando(1)

        //    let response = await ProgramacionSalaOperaciones.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud($('#txtNroSolicitudBusq').val())

        //    if (isEmpty(response)) {
        //        alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
        //        Cargando(0)
        //        return false
        //    }

        //    ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(response)


        //    //$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
        //    //
        //    //$('#txtHcPaciente').val(response.nroHistoriaClinica)
        //    //$('#cboSexo').val(response.idTipoSexo)
        //    //



        //    console.log('response', response)


        //    $('.chzn-select').chosen().trigger("chosen:updated")

        //    Cargando(0)
        //})




    },
}

$(document).ready(() => {
    ReporteOperatorio.Init()

    ConsumoServicio.IniciarScript()
    ConsumoServicio.IniciarData()
})