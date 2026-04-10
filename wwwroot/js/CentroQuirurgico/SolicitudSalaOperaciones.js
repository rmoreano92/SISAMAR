let SolicitudSalaOperaciones = {

    IdPaciente: 0,
    IdSolicitudSOP: 0,
    IdEstadoSolicitud: 0,
    NroHistoriaClinica: 0,
    NroSolicitud: '',
    IdCuentaAtencion: 0,
    IdTipoEdad: 0,

    IdFormaPago: 0,
    IdFuenteFinanciamiento: 0,
    DireccionDomicilio: '',
    IdSiaSis: 0,
    SisCodigo: '',
    IdTipoServicio: '',

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $('#txtFechaSolicitudBusq, #txtFechaSolicitudSalaOp, #txtFechaCirugia, #txtFechaSolicitudBusqSolicitud, #txtFechaSolicitudCQx, #txtFechaParaCQx, #txtFechaSolicitudCQxAceptada').datepicker({
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

        $("#txtHoraCirugia, #txtHoraSolicitudCQx, #txtHoraParaCqx, #txtHoraSolicitudCQxAceptada").mask("Hn:Nn");
    },

    CargaInicial: function () {
        $('#cboUbicacionPaciente').prop('disabled', true)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    Init: async function () {
        Cargando(1)
        try {
            SolicitudSalaOperaciones.Plugins()
            SolicitudSalaOperaciones.CargaInicial()
            SolicitudSalaOperaciones.Events()

            SolicitudSalaOperaciones.InitDatablesListaSolicitudes()
            SolicitudSalaOperaciones.InitDatablesPacientesBusqueda()
            SolicitudSalaOperaciones.InitDatableDiagnostico()
            SolicitudSalaOperaciones.InitDatablesSolicitudCQx()


            await SolicitudSalaOperaciones.ListarTipoServicio()
            await SolicitudSalaOperaciones.ListarTipoSexo()
            await SolicitudSalaOperaciones.ListarMedicos()
            await SolicitudSalaOperaciones.ListarCamasByIdServicio(88)
            await SolicitudSalaOperaciones.ListaTiposDocumentos()

            await SolicitudSalaOperaciones.ListarM_ClaseIntervencionCQx()
            await SolicitudSalaOperaciones.ListarM_ClasificacionPacienteCQx()
            await SolicitudSalaOperaciones.ListarM_TipoCirugiaCQx()
            await SolicitudSalaOperaciones.ListarEstadosSolicitudCQx()
            //await SolicitudSalaOperaciones.ListarM_OrdenCQx()
            //await SolicitudSalaOperaciones.ListarM_ClasificacionPacienteCQx()

            await SolicitudSalaOperaciones.ServicioSeleccionarPorTipoServicio(0)


            /////////////DIAGNOSTICO////////////////////
            BusquedaDiagnosticos.IniciarScript();
            Diagnosticos.PanelDx = '#PanelDiagnostico ';
            Diagnosticos.IniciarScript();
            ///////////////////////////////////////////


            Cargando(0)
        } catch (e) {
            alerta(3, 'Error: ' + e)
            Cargando(0)
        }

    },


    ListarTipoServicio: () => {
        return HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun').then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboUbicacionPaciente').empty();

                if (datos.length > 0) {

                    $(datos).each(function (i, obj) {
                        if (obj.valor == 0) {
                            $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">Seleccionar una opcion</option>`)
                        } else {
                            $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
                        }

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

                    //$('#cboMedicoSolicita').append(`<option value="0">Seleccionar una opcion</option>`)

                    //$('#cboMedicoPrincipal').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboMedicoAyudanteI').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboInstrumentistaI').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboTecEnfermeria').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboCirujanoII').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboMedicoAyudanteII').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboAyudanteAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    //$('#cboInstrumentistaII').append(`<option value="0">Seleccionar una opcion</option>`)
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
    ListaTiposDocumentos: () => {

        fetch('/Utilitario/ListaTiposDocumentos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboTipoDocTutor').empty();
                $(response.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocTutor').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },

    //////////////////////////////////////////////////////////////////////////////////////////////

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

                if (datos.length > 0) {

                    $('#cboTipoCirugia').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTipoCirugia').append(`<option value="${obj.idTipoCirugiaCqx}">${obj.descripcion}</option>`)
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

                if (datos.length > 0) {

                    $('#cboTurno').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTurno').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
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

                if (datos.length > 0) {

                    $('#cboOrdenSugerido').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboOrdenSugerido').append(`<option value="${obj.idOrdenCqx}">${obj.descripcion}</option>`)
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
    ListarEstadosSolicitudCQx: () => {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarEstadosSolicitudCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboEstadoSolicitud').empty();

                if (datos.length > 0) {

                    $(datos).each(function (i, obj) {
                        //if (obj.idEstado == 2) {
                            $('#cboEstadoSolicitud').append(`<option value="${obj.idEstado}">${obj.descripcion}</option>`)
                        //}
                       
                    })

                    $('#cboEstadoSolicitud').val(2)
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

    //////////////////////////////////////////////////////////////////////////////////////////////
    ServicioSeleccionarPorTipoServicio: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboServicioOrigen').empty()
                $('#cboServicioOrigen').append('<option  value="0">Seleccionar una opcion</option>')
                $(data.table).each(function (i, obj) {
                    $('#cboServicioOrigen').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    PacientesSeleccionarPorNroHistoriaClinica: async (nroHistoria) => {
        let formData = new FormData()

        try {
            const response = await HttpClient.Get(`/Paciente/PacientesSeleccionarPorNroHistoriaClinicaV2?area=Comun&nroHistoria=${nroHistoria}`)

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

    PacientesSeleccionarCuentasAbiertasByIdPaciente: async (nroHistoria) => {
        let formData = new FormData()

        try {
            const response = await HttpClient.Get(`/Paciente/PacientesSeleccionarCuentasAbiertasByIdPaciente?area=Comun&nroHistoria=${nroHistoria}`)

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


    ListarSolicitudesSalaOperaciones: async (NroHistoria, NroSolicitud, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud) => {
        let formData = new FormData()

        formData.append('NroHistoria', NroHistoria)
        formData.append('NroSolicitud', NroSolicitud)
        formData.append('NroDocumento', NroDocumento)
        formData.append('ApellidoPaterno', ApellidoPaterno)
        formData.append('ApellidoMaterno', ApellidoMaterno)
        formData.append('FechaSolicitud', FechaSolicitud)

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/ListarSolicitudesSalaOperaciones?area=Comun&nroHistoria=${NroHistoria}`, formData)

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

    CrearModificarSalaOperacionesCQx: async () => {
        let formData = new FormData()

        SolicitudSalaOperaciones.IdEstadoSolicitud = $('#cboEstadoSolicitud').val()

        formData.append('IdSolicitudSOP', SolicitudSalaOperaciones.IdSolicitudSOP)
        formData.append('NroSolicitud', SolicitudSalaOperaciones.NroSolicitud)
        formData.append('IdCuentaAtencion', SolicitudSalaOperaciones.IdCuentaAtencion)
        formData.append('IdUbicacionPaciente', $('#cboUbicacionPaciente').val())
        formData.append('IdPaciente', SolicitudSalaOperaciones.IdPaciente)
        formData.append('Edad', $('#txtEdadAnioSolicitud').val())
        formData.append('Peso', $('#txtPeso').val())
        formData.append('FechaSolicitud', $('#txtFechaSolicitudCQx').val())
        formData.append('HoraSolicitudCQx', $('#txtHoraSolicitudCQx').val())
        formData.append('IdTipoSolicitud', $('#cboTipoSolicitud').val())
        formData.append('IdMedicoSolicita', $('#cboMedicoSolicita').val())
        formData.append('IdEstado', SolicitudSalaOperaciones.IdEstadoSolicitud)
        formData.append('IdTipoIntervencionCQx', $('#cboTipoInterCQx').val())
        formData.append('IdTipoIntervencion', $('#cboClaseIntervencion').val())
        formData.append('IdTipoPaciente', $('#cboClasePlaciente').val())
        formData.append('IdTurno', $('#cboTurno').val())
        formData.append('IdTipoOperación', $('#cboTipoOperacion').val())
        formData.append('IdTipoCirugia', $('#cboTipoCirugia').val())
        formData.append('IdSala', $('#cboSala').val())
        formData.append('IdEspecialidad', $('#cboEspecialidad').val())
        formData.append('IdCondicion', $('#cboCondicion').val())
        formData.append('IdQuirofano', $('#cboQuirifano').val())
        formData.append('IdServicioOrigen', $('#cboServicioOrigen').val())
        formData.append('IdCama', $('#cboNroCama').val())
        formData.append('FechaCirugia', $('#txtFechaCirugia').val())
        formData.append('HoraCirugia', $('#txtHoraCirugia').val())
        formData.append('DescripcionCirugiaProcedimiento', $('#txtDescripcioncirugia').val())
        formData.append('RiesgosDerivados', $('#txtRiesgosDerivados').val())
        formData.append('IdTipoDocTutor', $('#cboTipoDocTutor').val())
        formData.append('NroDocumento', $('#txtNroDocumentoMaterno').val())
        formData.append('IdParentesco', $('#cboParentesco').val())
        formData.append('IdMedicoPrincipal', $('#cboMedicoPrincipal').val())
        formData.append('IdCirujanoII', $('#cboCirujanoII').val())
        formData.append('IdMedicoAyudanteI', $('#cboMedicoAyudanteI').val())
        formData.append('IdMedicoAyudanteII', $('#cboMedicoAyudanteII').val())
        formData.append('IdAnestesiologo', $('#cboAnestesiologo').val())
        formData.append('IdAyudanteAnestesiologo', $('#cboAyudanteAnestesiologo').val())
        formData.append('IdInstrumentistaI', $('#cboInstrumentistaI').val())
        formData.append('IdInstrumentistaII', $('#cboInstrumentistaII').val())
        formData.append('IdTecnicoEnfermeria', $('#cboTecEnfermeria').val())


        formData.append('FechaSolicitudCQxAceptada', $('#txtFechaSolicitudCQxAceptada').val())
        formData.append('HoraSolicitudCQxAceptada', $('#txtHoraSolicitudCQxAceptada').val())



        formData.append('IdFormaPago', SolicitudSalaOperaciones.IdFormaPago)
        formData.append('IdFuenteFinanciamiento', SolicitudSalaOperaciones.IdFuenteFinanciamiento)
        formData.append('DireccionDomicilio', SolicitudSalaOperaciones.DireccionDomicilio)
        formData.append('IdSiaSis', SolicitudSalaOperaciones.IdSiaSis)
        formData.append('SisCodigo', SolicitudSalaOperaciones.SisCodigo)
        formData.append('IdTipoEdad', SolicitudSalaOperaciones.IdTipoEdad)

        formData.append('IdTipoServicio', SolicitudSalaOperaciones.IdTipoServicio)
        formData.append('IdOrdenSugerido', $('#cboOrdenSugerido').val())

        formData.append('lstDiagnosticosPre', JSON.stringify(ObjtableDiagnosticosSolicitudCQx.api(true).data().toArray()));

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/CrearModificarSalaOperacionesCQx?area=SolicitudSalaOperaciones`, formData)

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

    InsertFactCatalogo: async function (IdOrden, idOrdenPago, IdPuntoCarga, IdPaciente, IdCuentaAtencion, IdServicioPaciente, idTipoFinanciamiento, idFuenteFinanciamiento, FechaHoraRealizaCpt, idProducto) {

        let items = await SolicitudSalaOperaciones.FactCatalogoServiciosXidTipoFinanciamiento(idProducto, idTipoFinanciamiento)
        let detalleConsumo = []
        $(items).each((i, item) => {
            detalleConsumo.push({
                "idProducto": item.idProducto,
                "cantidad": 1,
                "precio": item.precioUnitario,
                "total": item.precioUnitario,
                "labConfHIS": "",
                "grupoHIS": 0,
                "subgrupoHIS": 0,
            })
        })

        var formData = new FormData();

        formData.append('IdOrden', IdOrden);
        formData.append('idOrdenPago', idOrdenPago);
        formData.append('IdPuntoCarga', IdPuntoCarga);
        formData.append('IdPaciente', IdPaciente);
        formData.append('IdCuentaAtencion', IdCuentaAtencion);
        formData.append('IdServicioPaciente', IdServicioPaciente);
        formData.append('idTipoFinanciamiento', idTipoFinanciamiento);
        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        formData.append('IdEstadoFacturacion', 1);
        formData.append('FechaHoraRealizaCpt', FechaHoraRealizaCpt);
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res
                    //Cargando(0)
                } else {
                    alerta(3, res.msg)
                    //Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    FactCatalogoServiciosXidTipoFinanciamiento: function (idProducto, idTipoFinanciamiento) {
        let formData = new FormData();
        formData.append("idProducto", idProducto)
        formData.append("idTipoFinanciamiento", idTipoFinanciamiento)

        return HttpClient.Post('/Utilitario/FactCatalogoServiciosXidTipoFinanciamiento?area=Comun', formData).then(res => {
            if (res.dataSet.table.length > 0) {
                return res.dataSet.table
            } else {
                return null
            }

        })
    },
    SeleccionarDiagnosticos: async (idAtencion, clasificacion) => {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
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
                    ObjtableDiagnosticosSolicitudCQx.api(true).row.add(obj).draw(false);
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
    CargarDatosSolicitudSalaQx: async function (objRow) {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        let time1 = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? ("0" + fecha.getMinutes()) : fecha.getMinutes())

        SolicitudSalaOperaciones.IdPaciente = objRow.idPaciente
        SolicitudSalaOperaciones.IdSolicitudSOP = objRow.idSolicitudSOP
        SolicitudSalaOperaciones.IdEstadoSolicitud = objRow.idEstado
        SolicitudSalaOperaciones.NroHistoriaClinica = objRow.nroHistoriaClinica
        SolicitudSalaOperaciones.NroSolicitud = objRow.nroSolicitud
        SolicitudSalaOperaciones.IdCuentaAtencion = objRow.idCuentaAtencion

        SolicitudSalaOperaciones.IdFormaPago = objRow.idFormaPago
        SolicitudSalaOperaciones.IdFuenteFinanciamiento = objRow.idFuenteFinanciamiento
        SolicitudSalaOperaciones.DireccionDomicilio = objRow.direccionDomicilio
        SolicitudSalaOperaciones.IdSiaSis = objRow.idSiaSis
        SolicitudSalaOperaciones.SisCodigo = objRow.sisCodigo
        SolicitudSalaOperaciones.IdTipoEdad = objRow.idTipoEdad
        SolicitudSalaOperaciones.IdTipoServicio = objRow.idTipoServicio

        await SolicitudSalaOperaciones.ListarM_TurnosCirugiaCQx(objRow.idTIpoIntervencion)

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

        
        //$('#txtFechaAtencion').val(fechaP)
        //if (isEmpty(objRow.fechaAceptada)) {
        //    $("#txtFechaSolicitudCQxAceptada").datepicker("setDate", fechaP);
        //    $('#txtHoraSolicitudCQxAceptada').val(time1)
        //} else {
        //    $("#txtFechaSolicitudCQxAceptada").val(objRow.fechaAceptada)
        //    $("#txtHoraSolicitudCQxAceptada").val(objRow.horaAceptada)
        //}

        $("#txtFechaSolicitudCQxAceptada").val(objRow.fechaAceptada)
        $("#txtHoraSolicitudCQxAceptada").val(objRow.horaAceptada)
        
        

        $('#cboTipoCirugia').val(objRow.idTipoCirugia)
        $('#cboTurno').val(objRow.idTurno)
        $('#cboOrdenSugerido').val(objRow.idOrdenSugerido)
        $('#cboEstadoSolicitud').val(objRow.idEstado)

        $('#cboMedicoPrincipal').val(objRow.idMedicoPrincipal)
        $('#cboCirujanoII').val(objRow.idCirujanoII)
        $('#cboMedicoAyudanteI').val(objRow.idMedicoAyudanteI)
        $('#cboMedicoAyudanteII').val(objRow.idMedicoAyudanteII)

        await SolicitudSalaOperaciones.SeleccionarDiagnosticos(objRow.idAtencion, 8)
        await SolicitudSalaOperaciones.ListarProcedimientosCQx(objRow.nroSolicitud)

        
        
        //$('#txtHcPaciente').val(objRow.nroHistoriaClinica)
        //$('#txtEdad').val(objRow.edad)
        //$('#txtPeso').val(objRow.peso)
        //$('#cboSexo').val(objRow.idTipoSexo)
        ////$('#txtFechaSolicitudSalaOp').val(objRow.fechaSolicitud)
        //$('#cboTipoSolicitud').val(objRow.idTipoSolicitud)
        //
        //$('#txtEstado').val(objRow.estado)
        //$('#cboTipoInterCQx').val(objRow.idTipoIntervencionCQx)
        //$('#cboTipointervencion').val(objRow.idTIpoIntervencion)
        //
        //$('#cboTipoOperacion').val(objRow.idTipoOperación)
        //
        //$('#cboSala').val(objRow.idSala)
        //$('#cboEspecialidad').val(objRow.idEspecialidad)
        //$('#cboCondicion').val(objRow.idCondicion)
        //$('#cboQuirifano').val(objRow.idQuirofano)
        //$('#cboServicioOrigen').val(objRow.idServicioOrigen)
        //$('#cboNroCama').val(objRow.idCama)
        //$('#txtFechaCirugia').val(objRow.fechaCirugia)
        //$('#txtHoraCirugia').val(objRow.horaCirugia)
        //$('#txtDescripcioncirugia').val(objRow.descripcionCirugiaProcedimiento)
        //$('#txtRiesgosDerivados').val(objRow.riesgosDerivados)
        //$('#cboTipoDocTutor').val(objRow.idTipoDocTutor)
        //$('#txtNroDocumentoMaterno').val(objRow.nroDocumentoTutor)
        //$('#cboParentesco').val(objRow.idParentesco)
        
        //$('#cboAnestesiologo').val(objRow.idAnestesiologo)
        //$('#cboAyudanteAnestesiologo').val(objRow.idAyudanteAnestesiologo)
        //$('#cboInstrumentistaI').val(objRow.idInstrumentistaI)
        //$('#cboInstrumentistaII').val(objRow.idInstrumentistaII)
        //$('#cboTecEnfermeria').val(objRow.idTecnicoEnfermeria)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    LimpiarDatosSolicitudSalaQx: () => {

        SolicitudSalaOperaciones.IdPaciente = 0
        SolicitudSalaOperaciones.IdSolicitudSOP = 0
        SolicitudSalaOperaciones.IdEstadoSolicitud = 0
        SolicitudSalaOperaciones.NroHistoriaClinica = 0
        SolicitudSalaOperaciones.NroSolicitud = ''
        SolicitudSalaOperaciones.IdCuentaAtencion = 0
        SolicitudSalaOperaciones.IdTipoEdad = 0

        SolicitudSalaOperaciones.IdFormaPago = 0
        SolicitudSalaOperaciones.IdFuenteFinanciamiento = 0
        SolicitudSalaOperaciones.DireccionDomicilio = ''
        SolicitudSalaOperaciones.IdSiaSis = 0
        SolicitudSalaOperaciones.SisCodigo = ''
        SolicitudSalaOperaciones.IdTipoServicio = ''

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
        $('#cboEstadoSolicitud').val(0)

        $('#cboMedicoPrincipal').val(0)
        $('#cboCirujanoII').val(0)
        $('#cboMedicoAyudanteI').val(0)
        $('#cboMedicoAyudanteII').val(0)

        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        let time1 = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? ("0" + fecha.getMinutes()) : fecha.getMinutes())
        //$('#txtFechaAtencion').val(fechaP)
        $("#txtFechaSolicitudCQxAceptada").datepicker("setDate", fechaP);
        $('#txtHoraSolicitudCQxAceptada').val(time1)

        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
        oTable_solicitudCQx.fnClearTable()

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    HabilitarDeshabilitarCamposSolicitudQx: (estado) => {

        //$('#txtNroSolicitud').prop('disabled', estado)
        $('#btnBuscarHC').prop('disabled', estado)

        $('#cboMedicoSolicita').prop('disabled', estado)
        $('#cboClaseIntervencion').prop('disabled', estado)
        $('#cboClasePlaciente').prop('disabled', estado)
        //$('#txtFechaSolicitudCQx').prop('disabled', estado)
        //$('#txtHoraSolicitudCQx').prop('disabled', estado)
        $('#txtFechaParaCQx').prop('disabled', estado)
        $('#txtHoraParaCqx').prop('disabled', estado)
        //$('#txtFechaSolicitudCQxAceptada').prop('disabled', estado)
        //$('#txtHoraSolicitudCQxAceptada').prop('disabled', estado)
        $('#cboTipoCirugia').prop('disabled', estado)
        $('#cboTurno').prop('disabled', estado)
        $('#cboOrdenSugerido').prop('disabled', estado)
        $('#cboEstadoSolicitud').prop('disabled', estado)
        $('#cboMedicoPrincipal').prop('disabled', estado)
        $('#cboCirujanoII').prop('disabled', estado)
        $('#cboMedicoAyudanteI').prop('disabled', estado)
        $('#cboMedicoAyudanteII').prop('disabled', estado)


        //$('#cboMedicoSolicita').prop('disabled', estado)
        //$('#cboTipoInterCQx').prop('disabled', estado)
        //$('#cboTipointervencion').prop('disabled', estado)
        //$('#cboTurno').prop('disabled', estado)
        //$('#cboTipoOperacion').prop('disabled', estado)
        //$('#cboTipoCirugia').prop('disabled', estado)
        //$('#cboSala').prop('disabled', estado)
        //$('#cboEspecialidad').prop('disabled', estado)
        //$('#cboCondicion').prop('disabled', estado)
        //$('#cboQuirifano').prop('disabled', estado)
        //$('#cboServicioOrigen').prop('disabled', estado)
        //$('#cboNroCama').prop('disabled', estado)
        //$('#txtFechaCirugia').prop('disabled', estado)
        //$('#txtHoraCirugia').prop('disabled', estado)
        //$('#txtDescripcioncirugia').prop('disabled', estado)
        //$('#txtRiesgosDerivados').prop('disabled', estado)
        //$('#cboTipoDocTutor').prop('disabled', estado)
        //$('#txtNroDocumentoMaterno').prop('disabled', estado)
        //$('#cboParentesco').prop('disabled', estado)
        
        //$('#cboAnestesiologo').prop('disabled', estado)
        //$('#cboAyudanteAnestesiologo').prop('disabled', estado)
        //$('#cboInstrumentistaI').prop('disabled', estado)
        //$('#cboInstrumentistaII').prop('disabled', estado)
        //$('#cboTecEnfermeria').prop('disabled', estado)
        //$('#txtPeso').prop('disabled', estado)
        //$('#cboSexo').prop('disabled', estado)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    InitDatablesListaSolicitudes: () => {

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
                    data: 'fechaSolicitud',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'nroHistoriaClinica',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    targets: 3,
                    data: 'paciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
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
                }
            ]
        }

        var tableWrapper = $('#tblListaSolicitudes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ListaSolicitudes = $("#tblListaSolicitudes").dataTable(parms);

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
    InitDatableDiagnostico() {
        visible = true;


        params = {
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
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": visible },
                //{ width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }

            ]
        }

        ObjtableDiagnosticosSolicitudCQx = $("#lstDiagnosticosSolicitudCQx").dataTable(params);

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        $('#txtLabDiagnostico').val('')

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");

        //Cargando(0);
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
                },
                
                //{
                //    width: '0%',
                //    targets: 3,
                //    visible: false,
                //    data: "idEspecialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '20%',
                //    targets: 4,
                //    data: "especialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }
        var tableWrapper = $('#tblCatalogoSolicitudCQx'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_solicitudCQx = $("#tblCatalogoSolicitudCQx").dataTable(parms);
        $('#tblCatalogoSolicitudCQx_length').css('display', 'none')
    },
    Events: function () {
        /* Button Events */
        $('#btnBuscarPacientes').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            Cargando(1)

            let response = await SolicitudSalaOperaciones.ListarSolicitudesSalaOperaciones(NroHistoria = $('#txtHistoriaBusq').val(), NroSolicitud = $('#txtNroSolicitudBusq').val(),
                IdCuentaAtencion = 0, NroDocumento = $('#txtNroDocumentoBusq').val(), ApellidoPaterno = $('#txtApPaternoBusq').val(),
                ApellidoMaterno = $('#txtApMaternoBusq').val(), FechaSolicitud = $('#txtFechaSolicitudBusq').val())

            oTable_ListaSolicitudes.fnClearTable()

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos.')
                Cargando(0)
                return false
            }

            //for (let obj of response) {
            //    if (obj.idEstado != 1) {
            //        oTable_ListaSolicitudes.api(true).row.add(obj).draw(false);
            //    }
            //}
            oTable_ListaSolicitudes.fnAddData(response)



            Cargando(0)
        })

        $('#btnBuscarSolicitud').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            Cargando(1)

            let response = await SolicitudSalaOperaciones.ListarSolicitudesSalaOperaciones(NroHistoria = $('#txtHistoriaBusqSolicitud').val(), NroSolicitud = $('#txtNroSolicitudBusqSolicitud').val(),
                IdCuentaAtencion = 0, NroDocumento = $('#txtNroSolicitudBusqSolicitud').val(), ApellidoPaterno = $('#txtApPaternoBusqSolicitud').val(),
                ApellidoMaterno = $('#txtApMaternoBusqSolicitud').val(), FechaSolicitud = $('#txtFechaSolicitudBusqSolicitud').val())

            oTable_PacientesBusqueda.fnClearTable()

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos.')
                Cargando(0)
                return false
            }

            for (let obj of response) {
                if (obj.idEstado == 1) {
                    oTable_PacientesBusqueda.api(true).row.add(obj).draw(false);
                }
            }


            //ObjtableDiagnosticosSolicitudCQx.api(true).row.add(objRow).draw(false);

            //oTable_PacientesBusqueda.(response)



            Cargando(0)
        })

        $('#btnLimpiarFiltro').on('click', async () => {
            Cargando(1)

            oTable_ListaSolicitudes.fnClearTable()

            $('#txtHistoriaBusq').val('')
            $('#txtNroDocumentoBusq').val('')
            $('#txtApPaternoBusq').val('')
            $('#txtApMaternoBusq').val('')
            $('#txtFechaSolicitudBusq').val('')

            Cargando(0)
        })

        $("#btnAgregar").on("click", function () {

            SolicitudSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(false)

            $('#txtHc').prop('disabled', false)
            $('#btnBuscarHC').prop('disabled', false)
            $('#btnGuardar').show()

            SolicitudSalaOperaciones.LimpiarDatosSolicitudSalaQx()

            $("#txtFechaSolicitudSalaOp").datepicker("setDate", moment().toDate().format('dd/mm/yyyy'))

            $("#modalSolicitudSalaOp").modal("show");
        })

        $("#btnModificar").on("click", function () {
            let objRow = oTable_ListaSolicitudes.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro de la tabla.')
                return false
            }

            if (objRow.idEstado == 3 || objRow.idEstado == 4) {
            //if (objRow.idEstado == 4) {
                swal({
                    title: 'Atención',
                    html: `La solicitud con estado <b>${objRow.estado}</b>, no se puede modificar.`,
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();

                return false
            }

            SolicitudSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(false)

            $('#txtHc').prop('disabled', true)
            $('#btnBuscarHC').prop('disabled', true)
            $('#btnGuardar').show()

            SolicitudSalaOperaciones.LimpiarDatosSolicitudSalaQx()
            SolicitudSalaOperaciones.CargarDatosSolicitudSalaQx(objRow)

            $("#modalSolicitudSalaOp").modal("show");
        })

        $("#btnConsultar").on("click", function () {
            let objRow = oTable_ListaSolicitudes.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro de la tabla.')
                return false
            }

            SolicitudSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

            $('#txtHc').prop('disabled', true)
            $('#btnBuscarHC').prop('disabled', true)
            $('#btnGuardar').hide()

            SolicitudSalaOperaciones.LimpiarDatosSolicitudSalaQx()
            SolicitudSalaOperaciones.CargarDatosSolicitudSalaQx(objRow)

            $("#modalSolicitudSalaOp").modal("show");
        })



        $('#btnBuscarHC').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            //Cargando(1)

            //oTable_PacientesBusqueda.fnClearTable()

            ////let response = await SolicitudSalaOperaciones.PacientesSeleccionarPorNroHistoriaClinica($('#txtHc').val())
            //let response = await SolicitudSalaOperaciones.PacientesSeleccionarCuentasAbiertasByIdPaciente($('#txtHc').val())

            //if (isEmpty(response)) {
            //    alerta(4, 'No se encontraron datos para el número de historia ingresado.')
            //    Cargando(0)
            //    return false
            //}

            //oTable_PacientesBusqueda.fnAddData(response)


            //console.log('response', response)

            $('#modalPacientesBusqueda').modal('show')

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        $('#btnGuardar').on('click', async () => {

            if (SolicitudSalaOperaciones.IdPaciente == 0) {
                alerta(2, 'Debe seleccionar un paciente')
                $('#txtHc').focus()
                return false
            }

            if ($('#txtFechaCirugia').val() == '') {
                alerta(2, 'Ingrese la Fecha de Cirugia')
                $('#txtFechaCirugia').focus()
                return false
            }

            Cargando(1)

            let response = await SolicitudSalaOperaciones.CrearModificarSalaOperacionesCQx()

            let procedimientos = oTable_solicitudCQx.api(true).data().toArray()
            for (let procedimiento of procedimientos) {
                console.log(procedimiento)
                let factCatalogo = await SolicitudSalaOperaciones.InsertFactCatalogo(IdOrden = procedimiento.idOrden, idOrdenPago = procedimiento.idOrdenPago, IdPuntoCarga = 1060, IdPaciente = SolicitudSalaOperaciones.IdPaciente,
                    IdCuentaAtencion = response.idCuentaAtencion, IdServicioPaciente = response.idServicioOrigen, idTipoFinanciamiento = SolicitudSalaOperaciones.IdFormaPago,
                    idFuenteFinanciamiento = SolicitudSalaOperaciones.IdFuenteFinanciamiento, FechaHoraRealizaCpt = $('#txtFechaSolicitudCQx').val(), procedimiento.idItem)

                console.log('factCatalogo', factCatalogo)
            }

            

            console.log('response', response)


            if (!isEmpty(response)) {
                swal({
                    title: 'Centro Quirúrgico',
                    text: `La solicitud se registro con exito. \n N° Solicitud: ${response.nroSolicitud.padStart(9, 0)} \n N° Historia: ${SolicitudSalaOperaciones.NroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }

            $("#modalSolicitudSalaOp").modal("hide");
            $("#btnBuscarPacientes").click();

            //console.log('response', response)


            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        /* Select Events */
        $('#cboClaseIntervencion').on('change', async () => {

            Cargando(1)

            await SolicitudSalaOperaciones.ListarM_TurnosCirugiaCQx($('#cboClaseIntervencion').val())

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        /* Table Events */
        $('#tblListaSolicitudes tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ListaSolicitudes.$('tr.selected').removeClass('selected');
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
            

            if (objrow.idTipoServicio == 1) {
                SolicitudSalaOperaciones.IdCuentaAtencion = 0
            } else {
                SolicitudSalaOperaciones.IdCuentaAtencion = objrow.idCuentaAtencion
            }

            SolicitudSalaOperaciones.LimpiarDatosSolicitudSalaQx()
            SolicitudSalaOperaciones.CargarDatosSolicitudSalaQx(objrow)

            ////let paciente = await CitasAdmision.PacientesSeleccionarPorId(objrow.idPaciente)

            //SolicitudSalaOperaciones.IdPaciente = objrow.idPaciente
            //SolicitudSalaOperaciones.NroHistoriaClinica = objrow.nroHistoriaClinica
            ////SolicitudSalaOperaciones.IdCuentaAtencion = 0

            //SolicitudSalaOperaciones.IdFormaPago = objrow.idFormaPago
            //SolicitudSalaOperaciones.IdFuenteFinanciamiento = objrow.idFuenteFinanciamiento
            //SolicitudSalaOperaciones.DireccionDomicilio = objrow.direccionDomicilio
            //SolicitudSalaOperaciones.IdSiaSis = objrow.idSiaSis
            //SolicitudSalaOperaciones.SisCodigo = objrow.sisCodigo
            //SolicitudSalaOperaciones.IdTipoEdad = objrow.idTipoEdad
            //SolicitudSalaOperaciones.IdTipoServicio = objrow.idTipoServicio


            //$('#cboUbicacionPaciente').val(objrow.idTipoServicio)
            //$('#txtDatosPaciente').val(objrow.paciente)
            //$('#txtHcPaciente').val(objrow.nroHistoriaClinica)
            //$('#txtEdad').val(objrow.edad)


            //$('#cboSexo').val(objrow.idTipoSexo)

            //isEmpty(objrow.idServicioEgreso) || objrow.idServicioEgreso == 0 ? $('#cboServicioOrigen').val(objrow.idServicioIngreso) : $('#cboServicioOrigen').val(objrow.idServicioEgreso)


            $('#modalPacientesBusqueda').modal('hide')

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })
    },
}

$(document).ready(() => {
    SolicitudSalaOperaciones.Init()
})