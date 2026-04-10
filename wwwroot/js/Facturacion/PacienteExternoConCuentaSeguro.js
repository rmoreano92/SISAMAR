let TamizajeNeonatal = {

    IdPaciente: 0,
    IdEspecialidadMedico: 22,
    IdMedico: 0,
    IdAtencion: 0,
    IdOrden: 0,
    IdSiaSis: '',
    CodigoSis: '',
    IdEstablecimientoOrigen: '',
    IdEstablecimientoDestino: '',
    NroHistoria: 0,
    IdTipoDocumento: 0,
    NroDocumento: 0,
    SisFechaBaja: '',

    accion: 0, // 1 -> agregar, 0 -> nada

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaNacimiento, #txtFechaIngreso, #txtFechaAtencion, #txtFechaInicio, #txtFechaFin').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $("#txtHoraNacimiento, #txtHoraIngreso").mask("Hn:Nn");

        $('#txtFechaAtencion').datepicker("setDate", fechaP)
        $('#txtFechaInicio').datepicker("setDate", fechaP)
        $('#txtFechaFin').datepicker("setDate", fechaP)

    },

    TiposNumeracionHistoriaSeleccionarTodos: function () {
        return HttpClient.Get('/Paciente/TiposNumeracionHistoriaSeleccionarTodos')
            .then(res => {

                $('#cboTipoHistoria').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoHistoria').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboTipoHistoria').append(`<option value="${obj.idTipoNumeracion}">${obj.descripcionLarga}</option>`)
                        })

                        $(`#cboTipoHistoria`).val(4);
                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    TiposSexoSeleccionarTodos: function () {
        return HttpClient.Get('/Paciente/TiposSexoSeleccionarTodos')
            .then(res => {

                $('#cboTipoSexo').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoSexo').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboTipoSexo').append(`<option value="${obj.idTipoSexo}">${obj.descripcionLarga}</option>`)
                        })

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    TiposEdadSeleccionarTodosV2: function () {
        return HttpClient.Get('/Utilitario/TiposEdadSeleccionarTodosV2')
            .then(res => {

                $('#cboTipoEdadAtencion').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoEdadAtencion').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboTipoEdadAtencion').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
                        })

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    DevuelveServiciosQueSonPuntosCarga: function () {
        let formData = new FormData()
        formData.append('filtro', '(1,2,3,4,5,6,7) and  dbo.Servicios.idEstado=1 ORDER BY dbo.Servicios.Nombre')

        return HttpClient.Post('/Servicios/DevuelveServiciosQueSonPuntosCarga', formData)
            .then(res => {

                $('#cboServicioIngreso').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboServicioIngreso').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboServicioIngreso').append(`<option idPuntoCarga="${obj.idPuntoCarga}" idEspecialidad="${obj.idEspecialidad}" value="${obj.idServicio}">${obj.dservicioHosp}</option>`)
                        })

                        $('#cboServicioIngreso').val(0)

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarFuentesFinanciamientoSegunFiltroV2: function () {

        return HttpClient.Get('/Citas/ListarFuentesFinanciamientoSegunFiltroV2')
            .then(res => {

                $('#cboFuenteFinanciamiento').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboFuenteFinanciamiento').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboFuenteFinanciamiento').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
                        })

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2: function (idFuenteFinanciamiento) {
        let formData = new FormData()

        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento)

        return HttpClient.Post('/Citas/ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2', formData)
            .then(res => {

                $('#cboProductoPlan').empty();

                if (res.estado) {
                    $('#cboProductoPlan').append(`<option value="${0}">--Seleccionar--</option>`)
                    $(res.data.table).each(function (i, obj) {
                        $('#cboProductoPlan').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarTipoFormatoSISV2: function (idFuenteFinanciamiento) {

        return HttpClient.Get('/Citas/ListarTipoFormatoSISV2')
            .then(res => {

                $('#cboTipoAfiliacion').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoAfiliacion').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            if ((obj.tfrm_Descripcion == 'Afiliación AUS' || obj.tfrm_Descripcion == 'Afiliacion Temporal') && obj.com_Descripcion == 'Subsidiado') {
                                $('#cboTipoAfiliacion').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
                            }

                        })

                        $(`#cboTipoAfiliacion`).val(7)
                        $('.chzn-select').chosen().trigger("chosen:updated")

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListaEstablecimientosByCodigo: function (codigo) {
        let formData = new FormData();
        formData.append('codigo', codigo)

        return HttpClient.Post('/Utilitario/ListaEstablecimientosByCodigo?area=Comun', formData)
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
    ListaDepartamentosReferencia: async function () {
        HttpClient.Get('/Utilitario/ListaDepartamentos?area=Comun').then(res => {
            $('#cmbdepEstbuscar').empty();
            $('#cmbdepEstbuscar').append(`<option value="0">-- Seleccionar --</option>`)
            $(res.lsDeparta.table).each(function (i, obj) {
                $('#cmbdepEstbuscar').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
            })


            TamizajeNeonatal.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
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

    ListarAtencionesTamizajeByIdPaciente: function (IdPaciente) {
        let formData = new FormData()

        formData.append('IdPaciente', IdPaciente)

        return HttpClient.Post('/Inmunizaciones/ListarAtencionesTamizajeByIdPaciente', formData)
            .then(res => {
                if (res.estado) {
                    return res
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS: function (NroCuenta, HistoriaClinica, ApellidoPaterno, fechaIngreso) {
        let formData = new FormData();
        formData.append("NroCuenta", NroCuenta)
        formData.append("HistoriaClinica", HistoriaClinica)
        formData.append("ApellidoPaterno", ApellidoPaterno)
        formData.append("FechaIngreso", fechaIngreso)

        return HttpClient.Post('/Atencion/AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        //alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        Cargando(0)
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarAfiliadosSis: function (disa, tipoFormato, contrato, tipoTabla) {
        let formData = new FormData();

        formData.append("disa", disa)
        formData.append("tipoFormato", tipoFormato)
        formData.append("contrato", contrato)
        formData.append("tipoTabla", tipoTabla)

        return HttpClient.Post('/Sis/ListarAfiliadosSis', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res.data.body.buscarAseguradosResult
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarAfiliadosSis: function (disa, tipoFormato, contrato, tipoTabla) {
        let formData = new FormData();

        formData.append("disa", disa)
        formData.append("tipoFormato", tipoFormato)
        formData.append("contrato", contrato)
        formData.append("tipoTabla", tipoTabla)

        return HttpClient.Post('/Sis/ListarAfiliadosSis', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res.data.body.buscarAseguradosResult
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    SisFiltraPacientesAfiliados: function (paterno, materno, pnombre, onombres, genero, fnacimiento) {
        let formData = new FormData();

        formData.append("paterno", paterno)
        formData.append("materno", materno)
        formData.append("pnombre", pnombre)
        formData.append("onombres", onombres)
        formData.append("genero", genero)
        formData.append("fnacimiento", fnacimiento)

        return HttpClient.Post('/Citas/SisFiltraPacientesAfiliados', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    if (res.data.table.length > 0) {
                        return res.data.table[0]
                    }
                    return null
                } else {
                    alerta(3, 'Error: ' + e)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    PacientesFiltrarTodosSoloHistorias: function (nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, idDocIdentidad, nroDocumento) {
        let formData = new FormData();
        formData.append("nroHistoriaClinica", nroHistoriaClinica)
        formData.append("apellidoPaterno", apellidoPaterno)
        formData.append("apellidoMaterno", apellidoMaterno)
        formData.append("primerNombre", primerNombre)
        formData.append("segundoNombre", segundoNombre)
        formData.append("idDocIdentidad", idDocIdentidad)
        formData.append("nroDocumento", nroDocumento)

        return HttpClient.Post('/Paciente/PacientesFiltrarTodosSoloHistorias', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    PacientesSeleccionarPorId: function (idPaciente) {
        let formData = new FormData();
        formData.append("idPaciente", idPaciente)
        return HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    console.log('que esta pasando ', res)
                    if (res.data.table.length > 0) {
                        return res.data.table[0]
                    } else {
                        alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
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
    FiltrarMedicos: function () {
        let formData = new FormData();
        formData.append("CodigoPlanilla", $('#txtNCodPlanillaMedico').val())
        formData.append("ApellidoPaterno", $('#txtApellidoPaternoMedico').val())
        formData.append("ApellidoMaterno", $('#txtApellidoMaternoMedico').val())
        formData.append("Nombres", $('#txtNombresMedico').val())
        formData.append("IdEspecialidad", $('#cboServicioIngreso>option:selected').attr("idEspecialidad"))

        return HttpClient.Post('/Utilitario/FiltrarMedicos', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    FiltrarMedicosTamizaje: function () {

        return HttpClient.Get('/Utilitario/FiltrarMedicosTamizaje')
            .then(res => {

                $('#cboMedicoResponsable').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboMedicoResponsable').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboMedicoResponsable').append(`<option value="${obj.idMedico}">${obj.colegiatura} - ${obj.apellidoPaterno} ${obj.apellidoMaterno} ${obj.nombres}</option>`)
                        })

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        return res.data.table[0]
                    } else {
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    ValidarPacienteSis: async (objRowSis) => {

        let pacientes = null
        let paciente = null

        pacientes = await TamizajeNeonatal.PacientesFiltrarTodosSoloHistorias('', objRowSis[0], objRowSis[1], objRowSis[2], objRowSis[3], '', objRowSis[8])

        if (isEmpty(pacientes)) {
            alerta(2, 'No se encontro el paciente en la Base de Datos del establecimiento')
            Cargando(0)
            return false
        }

        if (pacientes.length > 0) {
            paciente = await TamizajeNeonatal.PacientesSeleccionarPorId(pacientes[0].idPaciente)

            let establecimiento = await TamizajeNeonatal.ListaEstablecimientosByCodigo(objRowSis[18].substr(5, 5))

            let edad = getEdad(paciente.fechaNacimiento.substr(5, 2) + '/' + paciente.fechaNacimiento.substr(8, 2) + '/' + paciente.fechaNacimiento.substr(0, 4))[0]
            let tipoEdad = getEdad(paciente.fechaNacimiento.substr(5, 2) + '/' + paciente.fechaNacimiento.substr(8, 2) + '/' + paciente.fechaNacimiento.substr(0, 4))[1]

            if (isEmpty(establecimiento)) {
                alerta(2, 'No existe el establecimiento para este paciente, consultar con soporte técnico.')
                Cargando(0)
                return false
            }

            $('#txtIdReferenciaCita').val(establecimiento.codigo)
            $('#txtDescripcionReferenciaCita').val(establecimiento.nombre)

            $('#txtNroHistoria').val(paciente.nroHistoriaClinica)
            $('#txtApellidoPaterno').val(paciente.apellidoPaterno)
            $('#txtApellidoMaterno').val(paciente.apellidoMaterno)
            $('#txtPrimerNombre').val(paciente.primerNombre)
            $('#txtSegundoNombre').val(paciente.segundoNombre)
            $('#cboTipoSexo').val(paciente.idTipoSexo)
            $('#txtFechaNacimiento').datepicker("setDate", paciente.fecNacimiento.substr(0, 10))
            $("#txtHoraNacimiento").val(paciente.horaNacimiento.substr(0, 5))
            $('#txtEdadAtencion').val(edad)
            $(`#cboTipoEdadAtencion`).val(tipoEdad)
            $(`#txtDocumentoMadre`).val(paciente.madreDocumento)

            TamizajeNeonatal.IdPaciente = paciente.idPaciente
            TamizajeNeonatal.NroHistoria = paciente.nroHistoriaClinica

            TamizajeNeonatal.IdSiaSis = objRowSis[16]
            TamizajeNeonatal.CodigoSis = objRowSis[15]

            TamizajeNeonatal.IdEstablecimientoOrigen = establecimiento.idEstablecimiento
            TamizajeNeonatal.IdEstablecimientoDestino = establecimiento.idEstablecimiento

            console.log('establecimiento', establecimiento)

            let sisFiliacion = await TamizajeNeonatal.SisFiltraPacientesAfiliados($('#txtApellidoPaterno').val(), $('#txtApellidoMaterno').val(), $('#txtPrimerNombre').val(), $('#txtSegundoNombre').val(), $('#cboTipoSexo').val(), $('#txtFechaNacimiento').val())

            if (isEmpty(sisFiliacion)) {
                swal({
                    title: 'Atenciones',
                    text: `No se encontró Paciente en tabla de FILIACIONES DEL SIS (SIGH_EXTERNA) \n\n Los Apellidos, Nombres, Sexo, F. Nacimiento (SisGalenPlus) deben ser iguales en la tabla de FILIACIONES (SIS) \n\n "Haga una CITA y la ANULA, luego usa esta opción, en caso usa la WEB de Afiliados SIS"`,
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();

                $('#cboFuenteFinanciamiento').val(0)
                $('#cboFuenteFinanciamiento').trigger('change')
                $('.chzn-select').chosen().trigger("chosen:updated");

                $('#modalBusquedaSis').modal('hide')
                Cargando(0)
                return false
            }
            console.log('sisFiliacion', sisFiliacion)

            await TamizajeNeonatal.ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2(3)

            $('#cboFuenteFinanciamiento').val(3)
            $('#cboProductoPlan').val(2)
        }


        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#modalBusquedaSis').modal('hide')
    },
    ValidarPacienteCrearHistoria: async (objRowSis) => {
        let paciente = null
        let pacientes = null

        TamizajeNeonatal.SisFechaBaja = objRowSis[7]

        if ($('#cboTipoAfiliacion').val() == 8) {
            pacientes = await TamizajeNeonatal.PacientesFiltrarTodosSoloHistorias(
                nroHistoriaClinica = '', apellidoPaterno = objRowSis[0], apellidoMaterno = objRowSis[1], primerNombre = objRowSis[2], segundoNombre = objRowSis[3], idDocIdentidad = '', nroDocumento = ''
            )
            TamizajeNeonatal.NroDocumento = ''
            TamizajeNeonatal.IdTipoDocumento = 0
        } else {
            let idDocIdentidad = 1

            if (objRowSis[13].trim().length == 9) {
                idDocIdentidad = 2
            }
            pacientes = await TamizajeNeonatal.PacientesFiltrarTodosSoloHistorias(
                nroHistoriaClinica = '', apellidoPaterno = '', apellidoMaterno = '', primerNombre = '', segundoNombre = '', idDocIdentidad = idDocIdentidad, nroDocumento = objRowSis[13]
            )
            TamizajeNeonatal.NroDocumento = objRowSis[13]
            TamizajeNeonatal.IdTipoDocumento = idDocIdentidad
        }

        if (isEmpty(pacientes)) {
            swal({
                title: 'Atenciones',
                text: `El Paciente no se encuentra registrado, ¿Desea crear HC?`,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            })
                .then(async (res) => {
                    if (res) {

                        Cargando(1)

                        let idSiaSis = await TamizajeNeonatal.SisFiliacionesAgregar(
                            idSiasis = objRowSis[16], Codigo = objRowSis[15], AfiliacionDisa = objRowSis[11], AfiliacionTipoFormato = objRowSis[12], AfiliacionNroFormato = objRowSis[13],
                            AfiliacionNroIntegrante = objRowSis[14], DocumentoTipo = '', CodigoEstablAdscripcion = objRowSis[18], AfiliacionFecha = objRowSis[19], Paterno = objRowSis[0],
                            Materno = objRowSis[1], Pnombre = objRowSis[2], Onombres = objRowSis[3], Genero = objRowSis[9], Fnacimiento = objRowSis[4], IdDistritoDomicilio = objRowSis[10],
                            Estado = objRowSis[6], Fbaja = objRowSis[7], DocumentoNumero = objRowSis[8], MotivoBaja = objRowSis[17], FbajaOK = ''
                        )

                        let idPaciente = await TamizajeNeonatal.CrearModificarHistoria(
                            IdPaciente = TamizajeNeonatal.IdPaciente, ApellidoPaterno = objRowSis[0], ApellidoMaterno = objRowSis[1], PrimerNombre = objRowSis[2], SegundoNombre = objRowSis[3], TercerNombre = '',
                            FechaNacimiento = objRowSis[4], NroDocumento = objRowSis[13], IdTipoSexo = (objRowSis[9] == 0 ? 2 : 1), IdDocIdentidad = 1, NroHistoriaClinica = TamizajeNeonatal.NroHistoria,
                            IdTipoNumeracion = 1, madreDocumento = $('#txtDocumentoMadre').val(), madreTipoDocumento = '1'
                        )

                        TamizajeNeonatal.IdPaciente = idPaciente

                        if (!isEmpty(idPaciente)) {
                            alerta(4, 'La historia fue creada con exito')
                        }

                        $('#txtDisaCabecera').val(objRowSis[11])
                        $('#txtTipoCabecera').val(objRowSis[12])
                        $('#txtNroAfiliacionCabecera').val(objRowSis[13])

                        await TamizajeNeonatal.ValidarPacienteSis(objRowSis)

                        Cargando(0)
                    }

                });
            Cargando(0)
            return false
        }

        $('#txtDisaCabecera').val(objRowSis[11])
        $('#txtTipoCabecera').val(objRowSis[12])
        $('#txtNroAfiliacionCabecera').val(objRowSis[13])
        await TamizajeNeonatal.ValidarPacienteSis(objRowSis)
    },

    CrearModificarFacturacionCuentasAtencion: function (
        TotalPorPagar, IdEstado, TotalPagado, TotalAsegurado, TotalExonerado, HoraCierre, FechaCierre, HoraApertura,
        FechaApertura, IdPaciente, IdCuentaAtencion) {
        let formData = new FormData();

        formData.append("TotalPorPagar", TotalPorPagar)
        formData.append("IdEstado", IdEstado)
        formData.append("TotalPagado", TotalPagado)
        formData.append("TotalAsegurado", TotalAsegurado)
        formData.append("TotalExonerado", TotalExonerado)
        formData.append("HoraCierre", HoraCierre)
        formData.append("FechaCierre", FechaCierre)
        formData.append("HoraApertura", HoraApertura)
        formData.append("FechaApertura", FechaApertura)
        formData.append("IdPaciente", IdPaciente)
        formData.append("IdCuentaAtencion", IdCuentaAtencion)

        return HttpClient.Post('/Atencion/CrearModificarFacturacionCuentasAtencion?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }

            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })

    },
    CrearModificarAtenciones: function (
        HoraIngreso, FechaIngreso, IdTipoServicio, IdPaciente, IdAtencion, IdTipoCondicionALEstab, FechaEgresoAdministrativo, IdCamaEgreso, IdCamaIngreso,
        IdServicioEgreso, IdTipoAlta, IdCondicionAlta, IdTipoEdad, IdOrigenAtencion, IdDestinoAtencion, HoraEgresoAdministrativo, IdTipoCondicionAlServicio,
        HoraEgreso, FechaEgreso, IdMedicoEgreso, Edad, IdEspecialidadMedico, IdMedicoIngreso, IdServicioIngreso, IdTipoGravedad, IdCuentaAtencion,
        idFormaPago, idFuenteFinanciamiento, idEstadoAtencion, EsPacienteExterno, idSunasaPacienteHistorico, EsDecretoUrgencia) {

        let formData = new FormData()

        formData.append("horaIngreso", HoraIngreso)
        formData.append("fechaIngreso", FechaIngreso)
        formData.append("idTipoServicio", IdTipoServicio)
        formData.append("idPaciente", IdPaciente)
        formData.append("idAtencion", IdAtencion)
        formData.append("IdTipoCondicionALEstab", IdTipoCondicionALEstab)
        formData.append("FechaEgresoAdministrativo", FechaEgresoAdministrativo)
        formData.append("idCamaEgreso", IdCamaEgreso)
        formData.append("idCamaIngreso", IdCamaIngreso)
        formData.append("idServicioEgreso", IdServicioEgreso)
        formData.append("idTipoAlta", IdTipoAlta)
        formData.append("idCondicionAlta", IdCondicionAlta)
        formData.append("idTipoEdad", IdTipoEdad)
        formData.append("idOrigenAtencion", IdOrigenAtencion)
        formData.append("idDestinoAtencion", IdDestinoAtencion)
        formData.append("horaEgresoAdministrativo", HoraEgresoAdministrativo)
        formData.append("idTipoCondicionAlServicio", IdTipoCondicionAlServicio)
        formData.append("horaEgreso", HoraEgreso)
        formData.append("fechaEgreso", FechaEgreso)
        formData.append("idMedicoEgreso", IdMedicoEgreso)
        formData.append("edad", Edad)
        formData.append("idEspecialidadMedico", IdEspecialidadMedico)
        formData.append("idMedicoIngreso", IdMedicoIngreso)
        formData.append("idServicioIngreso", IdServicioIngreso)
        formData.append("idTipoGravedad", IdTipoGravedad)
        formData.append("idCuentaAtencion", IdCuentaAtencion)
        formData.append("idFormaPago", idFormaPago)
        formData.append("idFuenteFinanciamiento", idFuenteFinanciamiento)
        formData.append("idEstadoAtencion", idEstadoAtencion)
        formData.append("esPacienteExterno", EsPacienteExterno)
        formData.append("idSunasaPacienteHistorico", idSunasaPacienteHistorico)
        formData.append("esDecretoUrgencia", EsDecretoUrgencia)


        return HttpClient.Post('/Atencion/CrearModificarAtenciones?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },
    CrearModificarAtencionesDatosAdicionales: function (
        idAtencion, DireccionDomicilio, NombreAcompaniante, TelefonoAcompaniante, Observacion, ProximaCita, NumeroDeHijos, IdSiaSis,
        FuaCodigoPrestacion, SisCodigo, IdTipoReferenciaDestino, IdTipoReferenciaOrigen, IdEstablecimientoDestino, IdEstablecimientoOrigen,
        IdEstablecimientoNoMinsaDestino, IdEstablecimientoNoMinsaOrigen, HuboInfeccionIntraHospitalaria, TieneNecropsia, IdMedicoRespNacimiento,
        RecienNacido, NroReferenciaOrigen, NroReferenciaDestino, IdReferencia, NroEnvioSis
    ) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("idAtencion", idAtencion)
        formData.append("DireccionDomicilio", DireccionDomicilio)
        formData.append("NombreAcompaniante", NombreAcompaniante)
        formData.append("TelefonoAcompaniante", TelefonoAcompaniante)
        formData.append("Observacion", Observacion)
        formData.append("ProximaCita", ProximaCita)
        formData.append("NumeroDeHijos", NumeroDeHijos)
        formData.append("IdSiaSis", IdSiaSis) //
        formData.append("FuaCodigoPrestacion", FuaCodigoPrestacion)
        formData.append("SisCodigo", SisCodigo) //
        formData.append("IdTipoReferenciaDestino", IdTipoReferenciaDestino)
        formData.append("IdTipoReferenciaOrigen", IdTipoReferenciaOrigen)
        formData.append("IdEstablecimientoDestino", IdEstablecimientoDestino)
        formData.append("IdEstablecimientoOrigen", IdEstablecimientoOrigen)
        formData.append("IdEstablecimientoNoMinsaDestino", IdEstablecimientoNoMinsaDestino)
        formData.append("IdEstablecimientoNoMinsaOrigen", IdEstablecimientoNoMinsaOrigen)
        formData.append("HuboInfeccionIntraHospitalaria", HuboInfeccionIntraHospitalaria)
        formData.append("TieneNecropsia", TieneNecropsia)
        formData.append("IdMedicoRespNacimiento", IdMedicoRespNacimiento)
        formData.append("RecienNacido", RecienNacido)
        formData.append("NroReferenciaOrigen", NroReferenciaOrigen)
        formData.append("NroReferenciaDestino", NroReferenciaDestino)
        formData.append("IdReferencia", IdReferencia)
        formData.append("NroEnvioSis", NroEnvioSis)

        return HttpClient.Post('/Atencion/CrearModificarAtencionesDatosAdicionales?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },
    InsertFactCatalogo: async function (
        idOrden, idOrdenPago, idPuntoCarga, idPaciente, idCuentaAtencion, idServicioPaciente, idTipoFinanciamiento, idFuenteFinanciamiento,
        idEstadoFacturacion, FechaHoraRealizaCpt) {

        let items = await TamizajeNeonatal.FactCatalogoServiciosXidTipoFinanciamiento(50021, idTipoFinanciamiento)
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

        formData.append('IdOrden', idOrden);
        formData.append('idOrdenPago', idOrdenPago);
        formData.append('IdPuntoCarga', idPuntoCarga);
        formData.append('IdPaciente', idPaciente);
        formData.append('IdCuentaAtencion', idCuentaAtencion);
        formData.append('IdServicioPaciente', idServicioPaciente);
        formData.append('idTipoFinanciamiento', idTipoFinanciamiento);
        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        formData.append('IdEstadoFacturacion', idEstadoFacturacion);
        formData.append('FechaHoraRealizaCpt', FechaHoraRealizaCpt);
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    CrearModificarAtencionTamizajeNeonatal: function (idAtencion) { // JDELGADO003-C
        let formData = new FormData()

        let ListaDiagnosticos = [{
            "codigoCIE10": "Z13.8  ",
            "codigoCIEsinPto": "Z138  ",
            "descripcion": "Examen de pesquisa especial para otras enfermedades y trastornos especificados",
            "esActivo": true,
            "fechaInicioVigencia": "2019-01-01T00:00:00",
            "iddiagnostico": 15982,
            "idTipoDiagnostico": "101",
            "tipoDiagnostico": " P = Presuntivo  ",
            "intrahospitalario": false
        }]

        formData.append('idAtencion', idAtencion)
        formData.append('lstDiagnosticos', JSON.stringify(ListaDiagnosticos))

        return HttpClient.Post('/PacientesExternosSeguro/GuardarDiagnosticosTamizaje?area=Facturacion', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },
    SisFiliacionesAgregar: function (
        idSiasis, Codigo, AfiliacionDisa, AfiliacionTipoFormato, AfiliacionNroFormato, AfiliacionNroIntegrante, DocumentoTipo, CodigoEstablAdscripcion,
        AfiliacionFecha, Paterno, Materno, Pnombre, Onombres, Genero, Fnacimiento, IdDistritoDomicilio, Estado, Fbaja, DocumentoNumero, MotivoBaja, FbajaOK
    ) {
        let formData = new FormData();
        formData.append("idSiasis", idSiasis)
        formData.append("Codigo", Codigo)
        formData.append("AfiliacionDisa", AfiliacionDisa)
        formData.append("AfiliacionTipoFormato", AfiliacionTipoFormato)
        formData.append("AfiliacionNroFormato", AfiliacionNroFormato)
        formData.append("AfiliacionNroIntegrante", AfiliacionNroIntegrante)
        formData.append("DocumentoTipo", DocumentoTipo)
        formData.append("CodigoEstablAdscripcion", CodigoEstablAdscripcion)
        formData.append("AfiliacionFecha", AfiliacionFecha)
        formData.append("Paterno", Paterno)
        formData.append("Materno", Materno)
        formData.append("Pnombre", Pnombre)
        formData.append("Onombres", Onombres)
        formData.append("Genero", Genero)
        formData.append("Fnacimiento", Fnacimiento)
        formData.append("IdDistritoDomicilio", IdDistritoDomicilio)
        formData.append("Estado", Estado)
        formData.append("Fbaja", Fbaja)
        formData.append("DocumentoNumero", DocumentoNumero)
        formData.append("MotivoBaja", MotivoBaja)
        formData.append("FbajaOK", FbajaOK)

        return HttpClient.Post('/Sis/web_SisFiliacionesAgregar?area=Comun', formData)
            .then(res => {
                if (res.estado) {
                    return res
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
            })
    },
    AnularAtencionesTamizajeNeonatal: function (IdCuentaAtencion) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("IdCuentaAtencion", IdCuentaAtencion)

        return HttpClient.Post('/Inmunizaciones/AnularAtencionesTamizajeNeonatal?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },

    CrearModificarHistoria: (
        IdPaciente, ApellidoPaterno, ApellidoMaterno, PrimerNombre, SegundoNombre, TercerNombre, FechaNacimiento, NroDocumento, IdTipoSexo, IdDocIdentidad, NroHistoriaClinica, IdTipoNumeracion,
        madreDocumento, madreTipoDocumento
    ) => {
        let formData = new FormData();
        formData.append("IdPaciente", IdPaciente);
        formData.append("ApellidoPaterno", ApellidoPaterno);
        formData.append("ApellidoMaterno", ApellidoMaterno);
        formData.append("PrimerNombre", PrimerNombre);
        formData.append("SegundoNombre", SegundoNombre);
        formData.append("TercerNombre", TercerNombre);
        formData.append("FechaNacimiento", FechaNacimiento);
        formData.append("NroDocumento", NroDocumento);
        formData.append("IdTipoSexo", IdTipoSexo);
        formData.append("IdDocIdentidad", IdDocIdentidad);
        formData.append("NroHistoriaClinica", NroHistoriaClinica);
        formData.append("IdTipoNumeracion", IdTipoNumeracion);
        formData.append("madreDocumento", madreDocumento);
        formData.append("madreTipoDocumento", madreTipoDocumento);

        return HttpClient.Post('/Paciente/CrearModificarHistoriaTamizaje?area=Comun', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },


    ListarAtenciones: async function () {
        Cargando(1)

        let atenciones = await TamizajeNeonatal.AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS($('#txtNroCuentaBusqueda').val(), $('#txtNroHistoriaBusqueda').val(), $('#txtNroApellidoPaternoBusqueda').val(), $('#txtFechaAtencion').val())

        if (isEmpty(atenciones)) {
            alerta(2, 'No se encontraron datos')
            Cargando(0)
            return
        }

        oTable_atenciones.fnClearTable()
        if (atenciones.length > 0) {
            oTable_atenciones.fnAddData(atenciones)
        }

        Cargando(0)
    },

    FechaCorrecta: (fecha1, fecha2) => {

        var midata = new FormData();

        midata.append('fecha1', fecha1);
        midata.append('fecha2', fecha2);

        valor = false

        $.ajax({
            method: "POST",
            url: "/Atencion/validaFechaMayor?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                valor = datos.resultado
            },
            error: function (msg) {
                setTimeout(function () {
                    valor = false
                }, 900)
            }
        });

        return valor
    },


    InitDatablesAtenciones: () => {

        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "fecNacim",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 6,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 7,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 8,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 9,
                    data: "tipoNumeracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 10,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 11,
                    data: "idEstadoAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 12,
                    data: "generaPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 13,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.idCuentaFua > 0) {
                            btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                            if (rowData.codeFua != '0') {
                                if (rowData.statusFirmaFua == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }
                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                }
                ///////////////////////////////////////////////////////////////////////////
                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                //{
                //    width: '8%',
                //    targets: 11,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";
                //            //var rutaBit4Id = "";

                //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            if (rowData.code != '0') {
                //                if (rowData.statusFirma == 1) {
                //                    btnImprimeSinF = "";
                //                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //                } else {
                //                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //                }
                //            }

                //            //if (rowData.idFirmaAtencion > 0) {                            
                //            //    if (AtencionMedica.permisoFirma4Identity == '1') {
                //            //        if (rowData.statusFirma == 0) {
                //            //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            //            //rutaBit4Id = '/Utilitario/FirmaDigitalBitFourId?server=' + PathServerFiles +'&idCuenta=' + rowData.idCuentaAtencion + '&idRegistro=' + rowData.idCuentaAtencion + '&tipo=CE-A';
                //            //            //btnRuta = '<a href="' + rutaBit4Id + '" target="_blank" class="btn btn-sm btn-info" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                //            //            btnRuta = '<button onclick="Utilitario.AbrirServicioFirmaBit4Id(' + rowData.idCuentaAtencion + ',' + rowData.idCuentaAtencion + ', \'CE-A\')" class="btn btn-sm btn-info btnFirmaCE" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //            //            //btnRuta = '<button class="Firma4Identity btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                //            //        } else {
                //            //            //btnImprime = ' <button class="btnFirma4IdentityImprime btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                //            //            btnImprime = ' <button onclick="Utilitario.AbrirDocumentoFirmadoBit4Id(' + rowData.idCuentaAtencion + ',' + rowData.idCuentaAtencion + ', \'CE-A\')" class="btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            //        }
                //            //    } else {
                //            //        if (rowData.statusFirma == 0) {
                //            //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            //            btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                //            //        }
                //            //        if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                //            //            btnImprime = ' <button class="ImprimeInforme btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            //        }
                //            //    }
                //            //}

                //            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },
    InitDatablesBusquedaPacientes: function () {
        let parms = {
            scrollY: '40vh',
            scrollCollapse: true,
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '30%',
                    targets: 0,
                    data: "apellidosYNombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 1,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 2,
                    data: "fecNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '12%',
                    targets: 3,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '18%',
                    targets: 4,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 5,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 6,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 7,
                    data: "idEstadoHistoria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblPacientesBusqueda'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_pacientesBusqueda = $("#tblPacientesBusqueda").dataTable(parms);
    },
    InitDatablesBusquedaMedicos: function () {
        let parms = {
            scrollY: '40vh',
            scrollCollapse: true,
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "na",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "codigoPlanilla",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '12%',
                    targets: 2,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '12%',
                    targets: 3,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 4,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 5,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "colegiatura",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblMedicosBusqueda'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_medicosBusqueda = $("#tblMedicosBusqueda").dataTable(parms);
    },
    InitDatablesBusquedaSis: function () {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '40vh',
            scrollCollapse: true,
            columns: [
                { title: 'ApPaterno' },
                { title: 'ApMaterno' },
                { title: 'PNombre' },
                { title: 'SNombre' },
                { title: 'Fnacimiento' },
                { title: 'cAfiliacion' },
                { title: 'estado' },
                { title: 'fBajaOK' },
                { title: 'DNI' },
                { title: 'sexo' },
                { title: 'distritoDomicilio' },
                { title: 'cDisa' },
                { title: 'cFormato' },
                { title: 'cNumero' },
                { title: 'AfiliacionNroIntegrante' },
                { title: 'codigo' },
                { title: 'idSiaSis' },
                { title: 'MotivoBaja' },
                { title: 'CodigoEstablAdscripcion' },
                { title: 'AfiliacionFecha' }
            ]
        }

        var tableWrapper = $('#tblBusquedaSis'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_busquedaSis = $("#tblBusquedaSis").dataTable(parms);
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
        oTable_establecimientos = $("#tblEstSalud").dataTable(parms);
    },


    Events: () => {

        $('#btnBuscarAtenciones').on('click', function () {

            TamizajeNeonatal.ListarAtenciones()

        })
        $('#btnAgregar').on('click', function () {

            TamizajeNeonatal.accion = 1

            let dt = new Date();
            let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

            var dia = dt.getDate()
            var mes = parseInt(dt.getMonth()) + 1
            var yyy = dt.getFullYear()
            if (dia < 10)
                dia = '0' + dia //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes
            fechaP = dia + "/" + mes + "/" + yyy

            $(".bloquear").prop('disabled', false)
            $("#txtDniBusquedaPaciente").prop('disabled', false)
            $("#cboTipoAfiliacion").prop('disabled', false)
            $("#txtDisa").prop('disabled', false)
            $("#txtTipo").prop('disabled', false)
            $("#txtNroAfiliacion").prop('disabled', false)
            $("#chbBusquedaSis").prop('disabled', false)
            $("#btnBuscarPacientes").prop('disabled', false)
            $("#btnLimpiarCampos").prop('disabled', false)
            $("#btnGuardar").show()

            $('#txtFechaIngreso').datepicker("setDate", fechaP);
            $('#txtHoraIngreso').val(time)
            $('.chzn-select').chosen().trigger("chosen:updated");
            //$("#chbBusquedaSis").prop('checked', true)

            $('#modalRegistroTamizaje').modal('show')

        })
        $('#btnModificarAtenciones').on('click', async function () {
            let atencion = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(atencion)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            TamizajeNeonatal.accion = 0

            $(".bloquear").prop('disabled', false)
            $("#btnGuardar").show()

            $("#txtDniBusquedaPaciente").prop('disabled', true)
            $("#cboTipoAfiliacion").prop('disabled', true)
            $("#txtDisa").prop('disabled', true)
            $("#txtTipo").prop('disabled', true)
            $("#txtNroAfiliacion").prop('disabled', true)
            $("#chbBusquedaSis").prop('disabled', true)
            $("#btnBuscarPacientes").prop('disabled', true)
            $("#btnLimpiarCampos").prop('disabled', true)


            await TamizajeNeonatal.ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2(atencion.idFuenteFinanciamiento)

            console.log('atencion', atencion)

            $('#txtNumeroEnvio').val(atencion.nroEnvioSis)
            $('#txtDocumentoMadre').val(atencion.madreDocumento)
            $('#txtDisaCabecera').val(atencion.afiliacionDisa)
            $('#txtTipoCabecera').val(atencion.afiliacionTipoFormato)
            $('#txtNroAfiliacionCabecera').val(atencion.afiliacionNroFormato)
            !isEmpty(atencion.observacion) ? $('#chbObservacionTamizaje').prop('checked', true) : $('#chbObservacionTamizaje').prop('checked', false)

            $('#txtNroHistoria').val(atencion.nroHistoriaClinica)
            $('#cboTipoHistoria').val(atencion.idTipoNumeracion)
            $('#txtApellidoPaterno').val(atencion.apellidoPaterno)
            $('#txtApellidoMaterno').val(atencion.apellidoMaterno)
            $('#txtPrimerNombre').val(atencion.primerNombre)
            $('#txtSegundoNombre').val(atencion.segundoNombre)
            $('#cboTipoSexo').val(atencion.idTipoSexo)
            $("#txtFechaNacimiento").datepicker("setDate", atencion.fecNacim)
            $("#txtHoraNacimiento").val(atencion.horaNacimiento.substr(0, 5))

            $('#cboServicioIngreso').val(atencion.idServicioIngreso)
            $('#txtResponsable').val(atencion.apellidoPaternoMedico + " " + atencion.apellidoMaternoMedico + " " + atencion.nombresMedico)
            $('#txtDocumentoResponsable').val(atencion.colegiatura)
            $("#txtFechaIngreso").datepicker("setDate", atencion.fechaIngreso)
            $('#txtHoraIngreso').val(atencion.horaIngreso)
            $('#txtEdadAtencion').val(atencion.edad)
            $(`#cboTipoEdadAtencion`).val(atencion.idTipoEdad)
            $('#cboFuenteFinanciamiento').val(atencion.idFuenteFinanciamiento)
            $('#cboProductoPlan').val(atencion.idFormaPago)
            $('#txtNroReferenciaOrigen').val(atencion.nroReferenciaOrigen)
            $('#txtNroReferenciaDestino ').val(atencion.nroReferenciaDestino)
            $('#txtNroCuenta').val(atencion.idCuentaAtencion)
            $('#cboMedicoResponsable').val(atencion.idMedico)

            $('#txtIdReferenciaCita').val(atencion.codigoEstablecimientoOrigen)
            $('#txtDescripcionReferenciaCita').val(atencion.nombreEstablecimientoOrigen)


            TamizajeNeonatal.IdPaciente = atencion.idPaciente
            TamizajeNeonatal.NroHistoria = atencion.nroHistoriaClinica

            TamizajeNeonatal.IdEspecialidadMedico = atencion.idEspecialidad
            TamizajeNeonatal.IdMedico = atencion.idMedico

            TamizajeNeonatal.IdAtencion = atencion.idAtencion

            TamizajeNeonatal.IdSiaSis = atencion.idSiaSis
            TamizajeNeonatal.CodigoSis = atencion.sisCodigo

            TamizajeNeonatal.IdEstablecimientoOrigen = atencion.idEstablecimientoOrigen
            TamizajeNeonatal.IdEstablecimientoDestino = atencion.idEstablecimientoDestino

            $('.chzn-select').chosen().trigger("chosen:updated");

            //$('#cboFuenteFinanciamiento').trigger('change')

            $('#modalRegistroTamizaje').modal('show')
        })
        $('#btnConsultarAtenciones').on('click', async function () {
            let atencion = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(atencion)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            TamizajeNeonatal.accion = 0

            $(".bloquear").prop('disabled', true)
            $("#btnGuardar").hide()

            console.log('atencion', atencion)

            $('#txtNumeroEnvio').val(atencion.nroEnvioSis)
            $('#txtDocumentoMadre').val(atencion.madreDocumento)
            $('#txtDisaCabecera').val(atencion.afiliacionDisa)
            $('#txtTipoCabecera').val(atencion.afiliacionTipoFormato)
            $('#txtNroAfiliacionCabecera').val(atencion.afiliacionNroFormato)
            !isEmpty(atencion.observacion) ? $('#chbObservacionTamizaje').prop('checked', true) : $('#chbObservacionTamizaje').prop('checked', false)

            $('#txtNroHistoria').val(atencion.nroHistoriaClinica)
            $('#cboTipoHistoria').val(atencion.idTipoNumeracion)
            $('#txtApellidoPaterno').val(atencion.apellidoPaterno)
            $('#txtApellidoMaterno').val(atencion.apellidoMaterno)
            $('#txtPrimerNombre').val(atencion.primerNombre)
            $('#txtSegundoNombre').val(atencion.segundoNombre)
            $('#cboTipoSexo').val(atencion.idTipoSexo)
            $("#txtFechaNacimiento").datepicker("setDate", atencion.fecNacim)
            $("#txtHoraNacimiento").val(atencion.horaNacimiento.substr(0, 5))

            $('#cboServicioIngreso').val(atencion.idServicioIngreso)
            $('#txtResponsable').val(atencion.apellidoPaternoMedico + " " + atencion.apellidoMaternoMedico + " " + atencion.nombresMedico)
            $('#txtDocumentoResponsable').val(atencion.colegiatura)
            $("#txtFechaIngreso").datepicker("setDate", atencion.fechaIngreso)
            $('#txtHoraIngreso').val(atencion.horaIngreso)
            $('#txtEdadAtencion').val(atencion.edad)
            $(`#cboTipoEdadAtencion`).val(atencion.idTipoEdad)
            $('#cboFuenteFinanciamiento').val(atencion.idFuenteFinanciamiento)
            $('#cboProductoPlan').val(atencion.idFormaPago)
            $('#txtNroReferenciaOrigen').val(atencion.nroReferenciaOrigen)
            $('#txtNroReferenciaDestino ').val(atencion.nroReferenciaDestino)
            $('#txtNroCuenta').val(atencion.idCuentaAtencion)
            $('#cboMedicoResponsable').val(atencion.idMedico)

            $('#txtIdReferenciaCita').val(atencion.codigoEstablecimientoOrigen)
            $('#txtDescripcionReferenciaCita').val(atencion.nombreEstablecimientoOrigen)


            TamizajeNeonatal.IdPaciente = atencion.idPaciente
            TamizajeNeonatal.NroHistoria = atencion.nroHistoriaClinica

            TamizajeNeonatal.IdEspecialidadMedico = atencion.idEspecialidad
            TamizajeNeonatal.IdMedico = atencion.idMedico

            TamizajeNeonatal.IdAtencion = atencion.idAtencion

            TamizajeNeonatal.IdSiaSis = atencion.idSiaSis
            TamizajeNeonatal.CodigoSis = atencion.sisCodigo

            TamizajeNeonatal.IdEstablecimientoOrigen = atencion.idEstablecimientoOrigen
            TamizajeNeonatal.IdEstablecimientoDestino = atencion.idEstablecimientoDestino

            $('.chzn-select').chosen().trigger("chosen:updated");

            //$('#cboFuenteFinanciamiento').trigger('change')

            $('#modalRegistroTamizaje').modal('show')
        })

        $('#btnCerrarModal').on('click', function () {
            TamizajeNeonatal.LimpiarCampos()
            TamizajeNeonatal.LimpiarCamposRegistro()

            $('#modalRegistroTamizaje').modal('hide')
        })
        $('#btnBuscarPacientes').on('click', async function () {

            Cargando(1)

            let pacientes = null


            TamizajeNeonatal.LimpiarCamposRegistro()
            if ($('#chbBusquedaSis').is(':checked')) {
                if ($('#txtDniBusquedaPaciente').val()) {

                    let tipoBusqueda = 2

                    if ($('#txtDniBusquedaPaciente').val().trim().length == 9) {
                        tipoBusqueda = 3
                    } 

                    pacientes = await TamizajeNeonatal.ListarAfiliadosSis(250, tipoBusqueda, $('#txtDniBusquedaPaciente').val(), $('#cboTipoAfiliacion').val())
                } else {
                    pacientes = await TamizajeNeonatal.ListarAfiliadosSis($('#txtDisa').val(), $('#txtTipo').val(), $('#txtNroAfiliacion').val(), $('#cboTipoAfiliacion').val())
                }

                if (!isEmpty(pacientes)) {
                    if (pacientes != '') {
                        let array_data = pacientes.split('|')

                        if (array_data[0] != '-1') {
                            let dataSet = [
                                array_data[9], array_data[10], array_data[11], array_data[12], array_data[14], array_data[2] + ' ' + array_data[3] + ' ' + array_data[4],
                                array_data[16], array_data[17], array_data[18], array_data[13], array_data[15], array_data[2], array_data[3], array_data[4], array_data[5],
                                array_data[1], array_data[0], array_data[19], array_data[7], array_data[8]
                            ]
                            oTable_busquedaSis.fnClearTable()
                            oTable_busquedaSis.fnAddData(dataSet)

                            $('#modalBusquedaSis').modal('show')

                            Cargando(0)
                        } else {
                            alerta(2, 'No existe afiliacion para los datos ingresados')
                            Cargando(0)
                            return
                        }

                    } else {
                        alerta(2, 'No existe afiliacion para los datos ingresados')
                        Cargando(0)
                        return
                    }
                } else {
                    alerta(2, 'PROBLEMAS CON LA WEB \n Hay problemas con el Web Service del SIS')
                    Cargando(0)
                    return
                }
            } else {

                pacientes = await TamizajeNeonatal.PacientesFiltrarTodosSoloHistorias(
                    $('#txtNroHistoriaBusquedaPaciente').val(), $('#txtApePaternoBusquedaPaciente').val(), $('#txtApeMaternoBusquedaPaciente').val(),
                    $('#txtPrimerNombreBusquedaPaciente').val(), $('#txtSegundoNombreBusquedaPaciente').val(), 1, $('#txtDniBusquedaPaciente').val()
                )

                if (isEmpty(pacientes)) {
                    alerta(2, 'No se encontraron resultados')
                    Cargando(0)
                    return
                }

                oTable_pacientesBusqueda.fnClearTable()
                if (pacientes.length > 0) {
                    oTable_pacientesBusqueda.fnAddData(pacientes)
                } else {
                    alerta(2, 'No se encontraron resultados')
                    Cargando(0)
                    return
                }

                $('#modalPacientesBusqueda').modal('show')

                Cargando(0)
            }

        })

        $('#btnLimpiarCampos').on('click', async function () {

            Cargando(1)
            TamizajeNeonatal.LimpiarCampos()
            TamizajeNeonatal.LimpiarCamposRegistro()

            let dt = new Date();
            let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

            var dia = dt.getDate()
            var mes = parseInt(dt.getMonth()) + 1
            var yyy = dt.getFullYear()
            if (dia < 10)
                dia = '0' + dia //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes
            fechaP = dia + "/" + mes + "/" + yyy

            $('#txtFechaIngreso').datepicker("setDate", fechaP);
            $('#txtHoraIngreso').val(time)

            $("#chbBusquedaSis").prop('checked', true)
            Cargando(0)

        })

        $('#btnModalMedicos').on('click', async function () {

            Cargando(1)

            if ($('#cboServicioIngreso').val() == 0) {
                alerta(2, 'Selecciona el Servicio de Ingreso')
                Cargando(0)
                return false
            }

            $('#modalMedicosBusqueda').modal('show')

            Cargando(0)
        })
        $('#btnBuscarMedicos').on('click', async function () {

            Cargando(1)

            let medicos = await TamizajeNeonatal.FiltrarMedicos()

            console.log('medicos', medicos)

            oTable_medicosBusqueda.fnClearTable()
            if (!isEmpty(medicos)) {
                oTable_medicosBusqueda.fnAddData(medicos)
            } else {
                alerta(2, 'No se encontraron resultados')
            }

            //$('#modalPacientesBusqueda').modal('show')

            Cargando(0)
        })
        $('#btnOpenModalEstablecimientoReferenciaCita').on('click', function () {

            $('#divCodigoRenaes').show()
            $('#modalEstablecimientosBuscar').modal('show')
        })
        $('#btnBuscarEstablecimiento').on('click', function () {
            let formData = new FormData()

            formData.append('codigoRenaes', $('#codigoEstBuscar').val())
            formData.append('nombreEstablecimiento', $('#nombreEstBuscar').val())
            formData.append('idDepartamento', $('#cmbdepEstbuscar').val())
            formData.append('idProvincia', $('#cmbprovEstBuscar').val())
            formData.append('idDistrito', $('#cmbdistEstBuscar').val())

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
        $('#btnCerraEstablecimientoBuscar').on('click', function () {
            $('#modalEstablecimientosBuscar').modal('hide')
        })

        $('#btnGuardar').on('click', async function () {


            if ($('#txtApellidoPaterno').val() == '') {
                alerta(2, 'Ingrese el Apellido Paterno')
                return false
            }
            if ($('#txtApellidoMaterno').val() == '') {
                alerta(2, 'Ingrese el Apellido Materno')
                return false
            }
            if ($('#txtPrimerNombre').val() == '') {
                alerta(2, 'Ingrese el Primer Nombre')
                return false
            }
            if ($('#cboTipoSexo').val() == 0) {
                alerta(2, 'Elija el Sexo')
                return false
            }

            if ($('#txtNumeroEnvio').val() == '') {
                alerta(2, 'Ingresa el Número de envio')
                $('#txtNumeroEnvio').focus()
                return false
            }
            if ($('#txtDocumentoMadre').val() == '') {
                alerta(2, 'Ingresa el N° Documento del Apoderado')
                $('#txtDocumentoMadre').focus()
                return false
            }

            if ($('#cboServicioIngreso').val() == 0) {
                alerta(2, 'Elija el Servicio de Ingreso')
                return false
            }

            if ($('#cboMedicoResponsable').val() == 0) {
                alerta(2, 'Selecciona el Responsable')
                return false
            }

            if ($('#txtFechaIngreso').val() == '') {
                alerta(2, 'La Fecha de Ingreso es obligatoria')
                $('#txtFechaIngreso').focus()
                return false
            }

            if ($('#txtHoraIngreso').val() == '') {
                alerta(2, 'La Hora de Ingreso es obligatoria')
                $('#txtHoraIngreso').focus()
                return false
            }

            if ($('#txtEdadAtencion').val() == '') {
                alerta(2, 'Ingrese la Edad')
                return false
            }
            if ($('#cboProductoPlan').val() == 0) {
                alerta(2, 'Elija el Plan de Atención')
                return false
            }
            if ($('#cboFuenteFinanciamiento').val() == 0) {
                alerta(2, 'Elija el Tipo de Financiamiento')
                return false
            }

            //if ($('#txtNroReferenciaOrigen').val() == '') {
            //    alerta(2, 'Ingresa el N° de Referencia de Origen')
            //    $('#txtNroReferenciaOrigen').focus()
            //    return false
            //}

            //if ($('#txtNroReferenciaDestino').val() == '') {
            //    alerta(2, 'Ingresa el N° de Referencia de Destino')
            //    $('#txtNroReferenciaDestino').focus()
            //    return false
            //}

            if (TamizajeNeonatal.SisFechaBaja != '') {
                valorFecha = TamizajeNeonatal.FechaCorrecta($('#txtFechaIngreso').val(), TamizajeNeonatal.SisFechaBaja)

                if (valorFecha) {
                    swal({
                        title: 'Atencion',
                        text: "No se puede agregar una atencion si la fecha de ingreso es posterior a la fecha de baja de afiliacion (" + TamizajeNeonatal.SisFechaBaja + ")",
                        type: 'warning',
                        allowOutsideClick: false,
                    }).done();
                    return false
                }
            }

            let atencionesByIdPaciente = await TamizajeNeonatal.ListarAtencionesTamizajeByIdPaciente(TamizajeNeonatal.IdPaciente)

            if (!isEmpty(atencionesByIdPaciente)) {
                if (atencionesByIdPaciente.data.table.length > 0 && TamizajeNeonatal.accion == 1) {
                    swal({
                        title: 'Atenciones',
                        text: `Este paciente ya cuenta con una atencion registrada, ¿Deseas continuar?`,
                        type: 'warning',
                        allowOutsideClick: false,
                        showCancelButton: true
                    })
                        .then(async (res) => {
                            if (res) {
                                Cargando(1)

                                let FactCuentaAtencion = await TamizajeNeonatal.CrearModificarFacturacionCuentasAtencion('', 1, '', '', '', '', '', $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), TamizajeNeonatal.IdPaciente, $('#txtNroCuenta').val())

                                if (FactCuentaAtencion == 0) {
                                    alerta(3, 'Algo salio mal (FactCuentaAtencion)')
                                    Cargando(0)
                                    return false;
                                }

                                let Atencion = await TamizajeNeonatal.CrearModificarAtenciones(
                                    $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), 1, TamizajeNeonatal.IdPaciente, TamizajeNeonatal.IdAtencion, 1, '', '', '', '', '', '', $('#cboTipoEdadAtencion').val(), 12, '', '', 1, '', '', '',
                                    $('#txtEdadAtencion').val(), TamizajeNeonatal.IdEspecialidadMedico, TamizajeNeonatal.IdMedico, $('#cboServicioIngreso').val(), '', FactCuentaAtencion, $('#cboProductoPlan').val(),
                                    $('#cboFuenteFinanciamiento').val(), 1, 1, '', 0)

                                if (Atencion == 0) {
                                    alerta(3, 'Algo salio mal (Atencion)')
                                    Cargando(0)
                                    return false;
                                }

                                let AtencionDatosAdicionales = await TamizajeNeonatal.CrearModificarAtencionesDatosAdicionales(
                                    Atencion, '', '', '', $('#chbObservacionTamizaje').is(':checked') ? 'Muestra de control por prematuridad' : '', '', '', TamizajeNeonatal.IdSiaSis, '071', TamizajeNeonatal.CodigoSis, '', '', TamizajeNeonatal.IdEstablecimientoDestino,
                                    TamizajeNeonatal.IdEstablecimientoOrigen, '', '', '', '', '', '', $('#txtNroReferenciaOrigen').val(), $('#txtNroReferenciaDestino').val(), '', $('#txtNumeroEnvio').val())

                                if (AtencionDatosAdicionales == 0) {
                                    alerta(3, 'Algo salio mal (AtencionDatosAdicionales)')
                                    Cargando(0)
                                    return false;
                                }


                                let idPaciente = await TamizajeNeonatal.CrearModificarHistoria(
                                    IdPaciente = TamizajeNeonatal.IdPaciente, ApellidoPaterno = $('#txtApellidoPaterno').val(), ApellidoMaterno = $('#txtApellidoMaterno').val(), PrimerNombre = $('#txtPrimerNombre').val(),
                                    SegundoNombre = $('#txtSegundoNombre').val(), TercerNombre = '', FechaNacimiento = $('#txtFechaNacimiento').val(), NroDocumento = TamizajeNeonatal.NroDocumento, IdTipoSexo = $('#cboTipoSexo').val(),
                                    IdDocIdentidad = TamizajeNeonatal.IdTipoDocumento, NroHistoriaClinica = TamizajeNeonatal.NroHistoria, IdTipoNumeracion = 1, madreDocumento = $('#txtDocumentoMadre').val(), madreTipoDocumento = '1'
                                )

                                TamizajeNeonatal.IdPaciente = idPaciente

                                console.log('idPaciente', idPaciente)

                                if (TamizajeNeonatal.accion == 1) {
                                    let FactCatalogoServicio = await TamizajeNeonatal.InsertFactCatalogo(
                                        TamizajeNeonatal.IdOrden, 0, 6, TamizajeNeonatal.IdPaciente, FactCuentaAtencion, $('#cboServicioIngreso').val(), $('#cboProductoPlan').val(),
                                        $('#cboFuenteFinanciamiento').val(), 1, $('#txtFechaIngreso').val())

                                    console.log('FactCatalogoServicio', FactCatalogoServicio)
                                }

                                if ($('#cboProductoPlan').val() == 2) {

                                    //let Diagnosticos = await TamizajeNeonatal.CrearModificarAtencionTamizajeNeonatal(Atencion)

                                    //const datafua = await Utilitario.GenerarFuaPdfTamizaje(FactCuentaAtencion, FactCuentaAtencion);

                                    //console.log('Diagnosticos', Diagnosticos)
                                }


                                swal({
                                    title: 'Atenciones',
                                    text: `Los datos se agregaron correctamente para la Historia N° ${TamizajeNeonatal.NroHistoria} \n\n\n N° Cuenta ${FactCuentaAtencion}`,
                                    type: 'warning',
                                    allowOutsideClick: false,
                                }).done();

                                TamizajeNeonatal.LimpiarCampos()
                                TamizajeNeonatal.LimpiarCamposRegistro()

                                $('#btnBuscarAtenciones').click()

                                $('#modalRegistroTamizaje').modal('hide')

                                Cargando(0)
                            }
                        })
                } else {
                    Cargando(1)

                    let FactCuentaAtencion = await TamizajeNeonatal.CrearModificarFacturacionCuentasAtencion('', 1, '', '', '', '', '', $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), TamizajeNeonatal.IdPaciente, $('#txtNroCuenta').val())

                    if (FactCuentaAtencion == 0) {
                        alerta(3, 'Algo salio mal (FactCuentaAtencion)')
                        Cargando(0)
                        return false;
                    }

                    let Atencion = await TamizajeNeonatal.CrearModificarAtenciones(
                        $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), 1, TamizajeNeonatal.IdPaciente, TamizajeNeonatal.IdAtencion, 1, '', '', '', '', '', '', $('#cboTipoEdadAtencion').val(), 12, '', '', 1, '', '', '',
                        $('#txtEdadAtencion').val(), TamizajeNeonatal.IdEspecialidadMedico, TamizajeNeonatal.IdMedico, $('#cboServicioIngreso').val(), '', FactCuentaAtencion, $('#cboProductoPlan').val(),
                        $('#cboFuenteFinanciamiento').val(), 1, 1, '', 0)

                    if (Atencion == 0) {
                        alerta(3, 'Algo salio mal (Atencion)')
                        Cargando(0)
                        return false;
                    }

                    let AtencionDatosAdicionales = await TamizajeNeonatal.CrearModificarAtencionesDatosAdicionales(
                        Atencion, '', '', '', $('#chbObservacionTamizaje').is(':checked') ? 'Muestra de control por prematuridad' : '', '', '', TamizajeNeonatal.IdSiaSis, '071', TamizajeNeonatal.CodigoSis, '', '', TamizajeNeonatal.IdEstablecimientoDestino,
                        TamizajeNeonatal.IdEstablecimientoOrigen, '', '', '', '', '', '', $('#txtNroReferenciaOrigen').val(), $('#txtNroReferenciaDestino').val(), '', $('#txtNumeroEnvio').val())

                    if (AtencionDatosAdicionales == 0) {
                        alerta(3, 'Algo salio mal (AtencionDatosAdicionales)')
                        Cargando(0)
                        return false;
                    }


                    let idPaciente = await TamizajeNeonatal.CrearModificarHistoria(
                        IdPaciente = TamizajeNeonatal.IdPaciente, ApellidoPaterno = $('#txtApellidoPaterno').val(), ApellidoMaterno = $('#txtApellidoMaterno').val(), PrimerNombre = $('#txtPrimerNombre').val(),
                        SegundoNombre = $('#txtSegundoNombre').val(), TercerNombre = '', FechaNacimiento = $('#txtFechaNacimiento').val(), NroDocumento = TamizajeNeonatal.NroDocumento, IdTipoSexo = $('#cboTipoSexo').val(),
                        IdDocIdentidad = TamizajeNeonatal.IdTipoDocumento, NroHistoriaClinica = TamizajeNeonatal.NroHistoria, IdTipoNumeracion = 1, madreDocumento = $('#txtDocumentoMadre').val(), madreTipoDocumento = '1'
                    )

                    TamizajeNeonatal.IdPaciente = idPaciente

                    console.log('idPaciente', idPaciente)

                    if (TamizajeNeonatal.IdAtencion == 0) {
                        let FactCatalogoServicio = await TamizajeNeonatal.InsertFactCatalogo(
                            TamizajeNeonatal.IdOrden, 0, 6, TamizajeNeonatal.IdPaciente, FactCuentaAtencion, $('#cboServicioIngreso').val(), $('#cboProductoPlan').val(),
                            $('#cboFuenteFinanciamiento').val(), 1, $('#txtFechaIngreso').val())

                        console.log('FactCatalogoServicio', FactCatalogoServicio)
                    }

                    if ($('#cboProductoPlan').val() == 2) {

                        let Diagnosticos = await TamizajeNeonatal.CrearModificarAtencionTamizajeNeonatal(Atencion)

                        const datafua = await Utilitario.GenerarFuaPdfTamizaje(FactCuentaAtencion, FactCuentaAtencion);

                        console.log('Diagnosticos', Diagnosticos)
                    }


                    swal({
                        title: 'Atenciones',
                        text: `Los datos se agregaron correctamente para la Historia N° ${TamizajeNeonatal.NroHistoria} \n\n\n N° Cuenta ${FactCuentaAtencion}`,
                        type: 'warning',
                        allowOutsideClick: false,
                    }).done();

                    TamizajeNeonatal.LimpiarCampos()
                    TamizajeNeonatal.LimpiarCamposRegistro()

                    $('#btnBuscarAtenciones').click()

                    $('#modalRegistroTamizaje').modal('hide')

                    Cargando(0)
                }
            } else {
                alerta(2, 'Algo salio mal')
                return false
            }



        })
        $('#btnEliminarAtenciones').on('click', async () => {
            let row = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            swal({
                title: 'Cuidado',
                text: "¿Deseas anular esta cuenta?",
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            }).then(async (res) => {

                if (res) {
                    let atencion = await TamizajeNeonatal.AnularAtencionesTamizajeNeonatal(row.idCuentaAtencion)

                    console.log('atencion', atencion)

                    $('#btnBuscarAtenciones').click()
                }
            })


        })

        $('#btnAbrirModalReporteTamizaje').on('click', () => {
            $('#modalReporteTamizaje').modal('show')
        })
        $('#btnGenerarRptTamizaje').on('click', () => {

            let formData = new FormData()
            formData.append('FechaInicio', $('#txtFechaInicio').val())
            formData.append('FechaFin', $("#txtFechaFin").val())
            Cargando(1)

            fetch('/Sis/GeneraRptTamizajeNeonatal?area=Sis', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "TamizajeNeonatal.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta(1, 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta(2, 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        })

        $('#btnGuardarAtencion').on('click', async function () {


            if ($('#txtApellidoPaterno').val() == '') {
                alerta(2, 'Ingrese el Apellido Paterno')
                return false
            }
            if ($('#txtApellidoMaterno').val() == '') {
                alerta(2, 'Ingrese el Apellido Materno')
                return false
            }
            if ($('#txtPrimerNombre').val() == '') {
                alerta(2, 'Ingrese el Primer Nombre')
                return false
            }
            if ($('#cboTipoSexo').val() == 0) {
                alerta(2, 'Elija el Sexo')
                return false
            }

            if ($('#txtDocumentoMadre').val() == '') {
                alerta(2, 'Ingresa el N° Documento del Apoderado')
                $('#txtDocumentoMadre').focus()
                return false
            }

            if ($('#cboServicioIngreso').val() == 0) {
                alerta(2, 'Elija el Servicio de Ingreso')
                return false
            }

            if ($('#cboMedicoResponsable').val() == 0) {
                alerta(2, 'Selecciona el Responsable')
                return false
            }

            if ($('#txtFechaIngreso').val() == '') {
                alerta(2, 'La Fecha de Ingreso es obligatoria')
                $('#txtFechaIngreso').focus()
                return false
            }

            if ($('#txtHoraIngreso').val() == '') {
                alerta(2, 'La Hora de Ingreso es obligatoria')
                $('#txtHoraIngreso').focus()
                return false
            }

            if ($('#txtEdadAtencion').val() == '') {
                alerta(2, 'Ingrese la Edad')
                return false
            }
            if ($('#cboProductoPlan').val() == 0) {
                alerta(2, 'Elija el Plan de Atención')
                return false
            }
            if ($('#cboFuenteFinanciamiento').val() == 0) {
                alerta(2, 'Elija el Tipo de Financiamiento')
                return false
            }

            // if ($('#txtIdReferenciaCita').val() == '') {
            //     alerta(2, 'Ingresa el Establecimiento de Referencia')
            //     $('#txtIdReferenciaCita').focus()
            //     return false
            // }

            //if ($('#txtNroReferenciaDestino').val() == '') {
            //    alerta(2, 'Ingresa el N° de Referencia de Destino')
            //    $('#txtNroReferenciaDestino').focus()
            //    return false
            //}

            if (TamizajeNeonatal.SisFechaBaja != '') {
                valorFecha = TamizajeNeonatal.FechaCorrecta($('#txtFechaIngreso').val(), TamizajeNeonatal.SisFechaBaja)

                if (valorFecha) {
                    swal({
                        title: 'Atencion',
                        text: "No se puede agregar una atencion si la fecha de ingreso es posterior a la fecha de baja de afiliacion (" + TamizajeNeonatal.SisFechaBaja + ")",
                        type: 'warning',
                        allowOutsideClick: false,
                    }).done();
                    return false
                }
            }

            let atencionesByIdPaciente = await TamizajeNeonatal.ListarAtencionesTamizajeByIdPaciente(TamizajeNeonatal.IdPaciente)

            if (!isEmpty(atencionesByIdPaciente)) {
                if (atencionesByIdPaciente.data.table.length > 0 && TamizajeNeonatal.accion == 1) {
                    swal({
                        title: 'Atenciones',
                        text: `Este paciente ya cuenta con una atencion registrada, ¿Deseas continuar?`,
                        type: 'warning',
                        allowOutsideClick: false,
                        showCancelButton: true
                    })
                        .then(async (res) => {
                            if (res) {
                                Cargando(1)

                                let FactCuentaAtencion = await TamizajeNeonatal.CrearModificarFacturacionCuentasAtencion('', 1, '', '', '', '', '', $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), TamizajeNeonatal.IdPaciente, $('#txtNroCuenta').val())

                                if (FactCuentaAtencion == 0) {
                                    alerta(3, 'Algo salio mal (FactCuentaAtencion)')
                                    Cargando(0)
                                    return false;
                                }

                                let Atencion = await TamizajeNeonatal.CrearModificarAtenciones(
                                    $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), 1, TamizajeNeonatal.IdPaciente, TamizajeNeonatal.IdAtencion, 1, '', '', '', '', '', '', $('#cboTipoEdadAtencion').val(), 12, '', '', 1, '', '', '',
                                    $('#txtEdadAtencion').val(), TamizajeNeonatal.IdEspecialidadMedico, TamizajeNeonatal.IdMedico, $('#cboServicioIngreso').val(), '', FactCuentaAtencion, $('#cboProductoPlan').val(),
                                    $('#cboFuenteFinanciamiento').val(), 1, 1, '', 0)

                                if (Atencion == 0) {
                                    alerta(3, 'Algo salio mal (Atencion)')
                                    Cargando(0)
                                    return false;
                                }

                                let AtencionDatosAdicionales = await TamizajeNeonatal.CrearModificarAtencionesDatosAdicionales(
                                    Atencion, '', '', '', $('#chbObservacionTamizaje').is(':checked') ? 'Muestra de control por prematuridad' : '', '', '', TamizajeNeonatal.IdSiaSis, '071', TamizajeNeonatal.CodigoSis, '', '', TamizajeNeonatal.IdEstablecimientoDestino,
                                    TamizajeNeonatal.IdEstablecimientoOrigen, '', '', '', '', '', '', $('#txtNroReferenciaOrigen').val(), $('#txtNroReferenciaDestino').val(), '', $('#txtNumeroEnvio').val())

                                if (AtencionDatosAdicionales == 0) {
                                    alerta(3, 'Algo salio mal (AtencionDatosAdicionales)')
                                    Cargando(0)
                                    return false;
                                }


                                let idPaciente = await TamizajeNeonatal.CrearModificarHistoria(
                                    IdPaciente = TamizajeNeonatal.IdPaciente, ApellidoPaterno = $('#txtApellidoPaterno').val(), ApellidoMaterno = $('#txtApellidoMaterno').val(), PrimerNombre = $('#txtPrimerNombre').val(),
                                    SegundoNombre = $('#txtSegundoNombre').val(), TercerNombre = '', FechaNacimiento = $('#txtFechaNacimiento').val(), NroDocumento = TamizajeNeonatal.NroDocumento, IdTipoSexo = $('#cboTipoSexo').val(),
                                    IdDocIdentidad = TamizajeNeonatal.IdTipoDocumento, NroHistoriaClinica = TamizajeNeonatal.NroHistoria, IdTipoNumeracion = 1, madreDocumento = $('#txtDocumentoMadre').val(), madreTipoDocumento = '1'
                                )

                                TamizajeNeonatal.IdPaciente = idPaciente

                                console.log('idPaciente', idPaciente)

                                if (TamizajeNeonatal.accion == 1) {
                                    let FactCatalogoServicio = await TamizajeNeonatal.InsertFactCatalogo(
                                        TamizajeNeonatal.IdOrden, 0, 6, TamizajeNeonatal.IdPaciente, FactCuentaAtencion, $('#cboServicioIngreso').val(), $('#cboProductoPlan').val(),
                                        $('#cboFuenteFinanciamiento').val(), 1, $('#txtFechaIngreso').val())

                                    console.log('FactCatalogoServicio', FactCatalogoServicio)
                                }

                                if ($('#cboProductoPlan').val() == 2) {

                                    let Diagnosticos = await TamizajeNeonatal.CrearModificarAtencionTamizajeNeonatal(Atencion)

                                    //const datafua = await Utilitario.GenerarFuaPdfTamizaje(FactCuentaAtencion, FactCuentaAtencion);

                                    console.log('Diagnosticos', Diagnosticos)
                                }


                                swal({
                                    title: 'Atenciones',
                                    text: `Los datos se agregaron correctamente para la Historia N° ${TamizajeNeonatal.NroHistoria} \n\n\n N° Cuenta ${FactCuentaAtencion}`,
                                    type: 'warning',
                                    allowOutsideClick: false,
                                }).done();

                                TamizajeNeonatal.LimpiarCampos()
                                TamizajeNeonatal.LimpiarCamposRegistro()

                                $('#btnBuscarAtenciones').click()

                                $('#modalRegistroTamizaje').modal('hide')

                                Cargando(0)
                            }
                        })
                } else {
                    Cargando(1)

                    let FactCuentaAtencion = await TamizajeNeonatal.CrearModificarFacturacionCuentasAtencion('', 1, '', '', '', '', '', $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), TamizajeNeonatal.IdPaciente, $('#txtNroCuenta').val())

                    if (FactCuentaAtencion == 0) {
                        alerta(3, 'Algo salio mal (FactCuentaAtencion)')
                        Cargando(0)
                        return false;
                    }

                    let Atencion = await TamizajeNeonatal.CrearModificarAtenciones(
                        $('#txtHoraIngreso').val(), $('#txtFechaIngreso').val(), 1, TamizajeNeonatal.IdPaciente, TamizajeNeonatal.IdAtencion, 1, '', '', '', '', '', '', $('#cboTipoEdadAtencion').val(), 12, '', '', 1, '', '', '',
                        $('#txtEdadAtencion').val(), TamizajeNeonatal.IdEspecialidadMedico, TamizajeNeonatal.IdMedico, $('#cboServicioIngreso').val(), '', FactCuentaAtencion, $('#cboProductoPlan').val(),
                        $('#cboFuenteFinanciamiento').val(), 1, 1, '', 0)

                    if (Atencion == 0) {
                        alerta(3, 'Algo salio mal (Atencion)')
                        Cargando(0)
                        return false;
                    }

                    let AtencionDatosAdicionales = await TamizajeNeonatal.CrearModificarAtencionesDatosAdicionales(
                        Atencion, '', '', '', $('#chbObservacionTamizaje').is(':checked') ? 'Muestra de control por prematuridad' : '', '', '', TamizajeNeonatal.IdSiaSis, '071', TamizajeNeonatal.CodigoSis, '', '', TamizajeNeonatal.IdEstablecimientoDestino,
                        TamizajeNeonatal.IdEstablecimientoOrigen, '', '', '', '', '', '', $('#txtNroReferenciaOrigen').val(), $('#txtNroReferenciaDestino').val(), '', $('#txtNumeroEnvio').val())

                    if (AtencionDatosAdicionales == 0) {
                        alerta(3, 'Algo salio mal (AtencionDatosAdicionales)')
                        Cargando(0)
                        return false;
                    }


                    let idPaciente = await TamizajeNeonatal.CrearModificarHistoria(
                        IdPaciente = TamizajeNeonatal.IdPaciente, ApellidoPaterno = $('#txtApellidoPaterno').val(), ApellidoMaterno = $('#txtApellidoMaterno').val(), PrimerNombre = $('#txtPrimerNombre').val(),
                        SegundoNombre = $('#txtSegundoNombre').val(), TercerNombre = '', FechaNacimiento = $('#txtFechaNacimiento').val(), NroDocumento = TamizajeNeonatal.NroDocumento, IdTipoSexo = $('#cboTipoSexo').val(),
                        IdDocIdentidad = TamizajeNeonatal.IdTipoDocumento, NroHistoriaClinica = TamizajeNeonatal.NroHistoria, IdTipoNumeracion = 1, madreDocumento = $('#txtDocumentoMadre').val(), madreTipoDocumento = '1'
                    )

                    TamizajeNeonatal.IdPaciente = idPaciente

                    console.log('idPaciente', idPaciente)

                    if (TamizajeNeonatal.IdAtencion == 0) {
                        let FactCatalogoServicio = await TamizajeNeonatal.InsertFactCatalogo(
                            TamizajeNeonatal.IdOrden, 0, 6, TamizajeNeonatal.IdPaciente, FactCuentaAtencion, $('#cboServicioIngreso').val(), $('#cboProductoPlan').val(),
                            $('#cboFuenteFinanciamiento').val(), 1, $('#txtFechaIngreso').val())

                        console.log('FactCatalogoServicio', FactCatalogoServicio)
                    }

                    if ($('#cboProductoPlan').val() == 2) {

                        let Diagnosticos = await TamizajeNeonatal.CrearModificarAtencionTamizajeNeonatal(Atencion)

                        const datafua = await Utilitario.GenerarFuaPdfTamizaje(FactCuentaAtencion, FactCuentaAtencion);

                        console.log('Diagnosticos', Diagnosticos)
                    }


                    swal({
                        title: 'Atenciones',
                        text: `Los datos se agregaron correctamente para la Historia N° ${TamizajeNeonatal.NroHistoria} \n\n\n N° Cuenta ${FactCuentaAtencion}`,
                        type: 'warning',
                        allowOutsideClick: false,
                    }).done();

                    TamizajeNeonatal.LimpiarCampos()
                    TamizajeNeonatal.LimpiarCamposRegistro()

                    $('#btnBuscarAtenciones').click()

                    $('#modalRegistroTamizaje').modal('hide')

                    Cargando(0)
                }
            } else {
                alerta(2, 'Algo salio mal')
                return false
            }



        })


        $('#cboFuenteFinanciamiento').on('change', async function () {

            Cargando(1)
            if (this.value == 3) {
                let sisFiliacion = await TamizajeNeonatal.SisFiltraPacientesAfiliados($('#txtApellidoPaterno').val(), $('#txtApellidoMaterno').val(), $('#txtPrimerNombre').val(), $('#txtSegundoNombre').val(), $('#cboTipoSexo').val(), $('#txtFechaNacimiento').val())

                if (isEmpty(sisFiliacion)) {
                    swal({
                        title: 'Atenciones',
                        text: `No se encontró Paciente en tabla de FILIACIONES DEL SIS (SIGH_EXTERNA) \n\n Los Apellidos, Nombres, Sexo, F. Nacimiento (SisGalenPlus) deben ser iguales en la tabla de FILIACIONES (SIS) \n\n "Haga una CITA y la ANULA, luego usa esta opción, en caso usa la WEB de Afiliados SIS"`,
                        type: 'warning',
                        allowOutsideClick: false,
                    }).done();

                    $('#cboFuenteFinanciamiento').val(0)
                    $('#cboFuenteFinanciamiento').trigger('change')
                    $('.chzn-select').chosen().trigger("chosen:updated");

                    TamizajeNeonatal.ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2(0)
                    Cargando(0)
                    return false
                }
            }

            TamizajeNeonatal.ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2($('#cboFuenteFinanciamiento').val())
            Cargando(0)

        })
        $('#cboMedicoResponsable').on('change', () => {

            TamizajeNeonatal.IdEspecialidadMedico = $('#cboServicioIngreso>option:selected').attr("idEspecialidad")
            TamizajeNeonatal.IdMedico = $('#cboMedicoResponsable').val()
        })
        $('#cboTipoAfiliacion').on('change', () => {
            if ($('#cboTipoAfiliacion').val() == 8) {
                $('#txtDisa').val('250')
                $('#txtTipo').val('E')
            } else {
                $('#txtDisa').val('')
                $('#txtTipo').val('')
            }
        })

        $('#cmbdepEstbuscar').on('change', function () {
            TamizajeNeonatal.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
            TamizajeNeonatal.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })
        $('#cmbprovEstBuscar').on('change', function () {
            TamizajeNeonatal.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })


        $('#tblAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
        $('#tblPacientesBusqueda tbody').on('click', 'tr', async function (e) {
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        })
        $('#tblPacientesBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let objrow = oTable_pacientesBusqueda.api(true).row('.selected').data()
            let paciente = await TamizajeNeonatal.PacientesSeleccionarPorId(objrow.idPaciente)

            let edad = getEdad(paciente.fechaNacimiento.substr(5, 2) + '/' + paciente.fechaNacimiento.substr(8, 2) + '/' + paciente.fechaNacimiento.substr(0, 4))[0]
            let tipoEdad = getEdad(paciente.fechaNacimiento.substr(5, 2) + '/' + paciente.fechaNacimiento.substr(8, 2) + '/' + paciente.fechaNacimiento.substr(0, 4))[1]

            $('#txtNroHistoria').val(paciente.nroHistoriaClinica)
            $('#cboTipoHistoria').val(paciente.idTipoNumeracion)
            $('#txtApellidoPaterno').val(paciente.apellidoPaterno)
            $('#txtApellidoMaterno').val(paciente.apellidoMaterno)
            $('#txtPrimerNombre').val(paciente.primerNombre)
            $('#txtSegundoNombre').val(paciente.segundoNombre)
            $('#cboTipoSexo').val(paciente.idTipoSexo)
            $("#txtFechaNacimiento").datepicker("setDate", paciente.fecNacimiento)
            $("#txtHoraNacimiento").val(objrow.horaNacimiento.substr(0, 5))
            $('#txtEdadAtencion').val(edad)
            $(`#cboTipoEdadAtencion`).val(tipoEdad)

            TamizajeNeonatal.IdPaciente = paciente.idPaciente
            TamizajeNeonatal.NroHistoria = paciente.nroHistoriaClinica

            $('.chzn-select').chosen().trigger("chosen:updated");

            $('#modalPacientesBusqueda').modal('hide')

            Cargando(0)
        })
        $('#tblMedicosBusqueda tbody').on('click', 'tr', async function (e) {
            oTable_medicosBusqueda.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblMedicosBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_medicosBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let objrow = oTable_medicosBusqueda.api(true).row('.selected').data()

            $('#txtResponsable').val(objrow.apellidoPaterno + " " + objrow.apellidoMaterno + " " + objrow.nombres)
            $('#txtDocumentoResponsable').val(objrow.colegiatura)

            TamizajeNeonatal.IdEspecialidadMedico = objrow.idEspecialidad
            TamizajeNeonatal.IdMedico = objrow.idMedico

            $('#modalMedicosBusqueda').modal('hide')

            Cargando(0)
        })
        $('#tblBusquedaSis tbody').on('click', 'tr', function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        })
        $('#tblBusquedaSis tbody').on('dblclick', 'tr', async function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')

            let objRowSis = oTable_busquedaSis.api(true).row('.selected').data()

            Cargando(1)

            if (objRowSis[6] == 1) {
                swal({
                    title: 'Cuidado',
                    text: "La afiliacion de este paciente tiene probelmas \n\n Motivo de baja: \nEstado: " + (objRowSis[6] == 1 ? "Inactivo " : objRowSis[6]) +
                        "\nFecha Baja:  " + objRowSis[7] + "\n",
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true
                }).then(async (res) => {

                    if (res) {
                        await TamizajeNeonatal.ValidarPacienteCrearHistoria(objRowSis)
                    }

                })
                Cargando(0)
                return false
            }

            await TamizajeNeonatal.ValidarPacienteCrearHistoria(objRowSis)
            Cargando(0)

        })

        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);

        });
        $('#tblAtencion tbody').on('click', '.FirmarFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            //const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'FUA')               //KHOYOSI
            //AtencionMedica.ImprimirDocumentoConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo)
            Cargando(1);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua)               //KHOYOSI            
            //if (firma) {
            //    await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            //}

            await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            Cargando(0);
        });
        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblEstSalud tbody').on('click', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblEstSalud tbody').on('dblclick', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_establecimientos.api(true).row('.selected').data();

            $('#txtIdReferenciaCita').val(objrow.codigo)
            $('#txtDescripcionReferenciaCita').val(objrow.nombre)

            TamizajeNeonatal.IdEstablecimientoOrigen = objrow.idEstablecimiento
            TamizajeNeonatal.IdEstablecimientoDestino = objrow.idEstablecimiento


            $('#modalEstablecimientosBuscar').modal('hide')
        })
    },

    LimpiarCampos: () => {
        $('#txtNroHistoriaBusquedaPaciente').val('')
        $('#txtApePaternoBusquedaPaciente').val('')
        $('#txtApeMaternoBusquedaPaciente').val('')
        $('#txtPrimerNombreBusquedaPaciente').val('')
        $('#txtSegundoNombreBusquedaPaciente').val('')
        $('#txtDniBusquedaPaciente').val('')
        $('#cboTipoAfiliacion').val(7)
        $('#txtDisa').val('')
        $('#txtTipo').val('')
        $('#txtNroAfiliacion').val('')
        $("#chbBusquedaSis").prop('checked', false)

        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#cboFuenteFinanciamiento').trigger('change')
    },

    LimpiarCamposRegistro: () => {
        $('#txtNroHistoria').val('')
        $('#cboTipoHistoria').val(4)
        $('#txtApellidoPaterno').val('')
        $('#txtApellidoMaterno').val('')
        $('#txtPrimerNombre').val('')
        $('#txtSegundoNombre').val('')
        $('#cboTipoSexo').val(0)
        $('#txtFechaNacimiento').val('')
        $('#txtHoraNacimiento').val('')
        $('#cboServicioIngreso').val(0)
        $('#txtResponsable').val('')
        $('#txtDocumentoResponsable').val('')
        $('#cboMedicoResponsable').val(0)
        //$('#txtFechaIngreso').val('')
        //$('#txtHoraIngreso').val('')ss
        $('#txtEdadAtencion').val('')
        $('#cboTipoEdadAtencion').val(0)
        $('#cboFuenteFinanciamiento').val(0)

        $('#txtNroReferenciaOrigen').val('')
        $('#txtNroReferenciaDestino ').val('')
        $('#txtNroCuenta').val('')

        $('#txtNumeroEnvio').val('')
        $('#txtDocumentoMadre').val('')
        $('#txtDisaCabecera').val('')
        $('#txtTipoCabecera').val('')
        $('#txtNroAfiliacionCabecera').val('')

        $('#txtIdReferenciaCita').val('')
        $('#txtDescripcionReferenciaCita').val('')

        $('#chbObservacionTamizaje').prop('checked', false)

        TamizajeNeonatal.IdPaciente = 0
        TamizajeNeonatal.NroHistoria = 0
        TamizajeNeonatal.IdEspecialidadMedico = 22
        TamizajeNeonatal.IdMedico = 0
        TamizajeNeonatal.IdAtencion = 0
        TamizajeNeonatal.IdOrden = 0
        TamizajeNeonatal.IdSiaSis = ''
        TamizajeNeonatal.CodigoSis = ''
        TamizajeNeonatal.IdEstablecimientoOrigen = ''
        TamizajeNeonatal.IdEstablecimientoDestino = ''
        TamizajeNeonatal.NroHistoria = 0
        TamizajeNeonatal.SisFechaBaja = ''
        TamizajeNeonatal.NroDocumento = 0
        TamizajeNeonatal.IdTipoDocumento = 0
        TamizajeNeonatal.SisFechaBaja = ''

        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#cboFuenteFinanciamiento').trigger('change')
    }


}

$(document).ready(() => {

    TamizajeNeonatal.Plugins()

    TamizajeNeonatal.TiposNumeracionHistoriaSeleccionarTodos()
    TamizajeNeonatal.TiposSexoSeleccionarTodos()
    TamizajeNeonatal.TiposEdadSeleccionarTodosV2()
    TamizajeNeonatal.DevuelveServiciosQueSonPuntosCarga()
    TamizajeNeonatal.ListarFuentesFinanciamientoSegunFiltroV2()
    TamizajeNeonatal.ListarTipoFormatoSISV2()
    TamizajeNeonatal.ListaDepartamentosReferencia()

    TamizajeNeonatal.FiltrarMedicosTamizaje()

    TamizajeNeonatal.InitDatablesAtenciones()
    TamizajeNeonatal.InitDatablesBusquedaPacientes()
    TamizajeNeonatal.InitDatablesBusquedaMedicos()
    TamizajeNeonatal.InitDatablesBusquedaSis()
    TamizajeNeonatal.InitDatablesEstablecimientos()

    TamizajeNeonatal.Events()
})

function getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()

    let anios = edad
    let meses = diferenciaMeses < 0 ? -diferenciaMeses : diferenciaMeses
    let dias

    if (anios != 0) {
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--
            anios = edad
        }
        return [anios, 1]
    } else if (meses != 0) {
        return [meses, 2]
    } else {
        dias = hoy.getDate() - fechaNacimiento.getDate()
        return [dias, 3]
    }
}