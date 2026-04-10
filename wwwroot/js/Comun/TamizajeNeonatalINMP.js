let TamizajeNeonatal = {

    TipoRegistro: $('#hdTipoRegistro').val(),
    IdPaciente: 0,
    IdCuentaAtencion: 0,
    IdAtencion: 0,
    IdMovimiento: 0,
    IdOrden: 0,
    IdOrdenPago: 0,
    Code: '',
    StatusFirma: 0,
    Insumos: [],
    Productos: [],



    IdRnTamizaje: 0,
    IdRegistroTamizaje: 0,
    IdEstablecimientoOrigen: 0,
    IdInstitucionRegistraMuestra: 0,



    IdMedico: 974,


    DataSetAfiliacion: [],

    IdSiaSis: '',
    CodigoSis: '',

    IdTipoDocumento: 0,
    NroDocumento: 0,

    ListaAtenciones: [],


    IdEspecialidadMedico: 0,

    IdEstablecimientoSIGH: 0,

    NroHistoria: 0,
    IdTipoSexo: '',



    registroIpress: 0,

    idPersonaAcreditaMuestra: 0,

    idEstadoMuestraLab: 0,

    idTipoServicio: 1,

    accion: 0, // 1 -> agregar, 0 -> nada

    guardando: 0,

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
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



        $('#txtFechaInicio, #txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $("#txtFechaInicio, #txtFechaFin").mask("Dd/Mm/abcd");



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

        $("#txtHoraIngreso").mask("Hn:Nn");
        $("#txtHoraNacimiento").mask("Hn:Nn");
        $("#txtHoraMuestra").mask("Hn:Nn");
        $("#txtHoraUltimaLactancia").mask("Hn:Nn");
        $("#txtHoraRecepcion").mask("Hn:Nn");
        $("#txtHoraRecepcionSIS").mask("Hn:Nn");
        $("#txtHoraRegistroSospecha").mask("Hn:Nn");

        $('#txtFechaIngreso').datepicker("setDate", fechaP)
        $('#txtFechaRegistroBusqueda').datepicker("setDate", fechaP)

        $('.chzn-select').chosen().trigger("chosen:updated")

        $(".chosen-select").chosen();

    },

    CargaInicial: async () => {

        $('#cboAnioCierreBusqueda').empty()
        $('#cboAnioCierreBusqueda').append('<option  value="0">Seleccione una opción</option>');
        for (i = 1; i < 50; i++) {
            $('#cboAnioCierreBusqueda').append('<option  value="' + (2022 + i) + '">' + (2022 + i) + '</option>');
        }

        $('#btnEliminarFua').hide()

        //let dt = new Date();
        //$('#cboAnioCierreBusqueda').val(dt.getFullYear())

        $('.chosen-select').chosen().trigger("chosen:updated")
        $('.chzn-select').chosen().trigger("chosen:updated")


        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        //console.log(permisosGenerales);
        if (!isEmpty(permisosGenerales)) {

            permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
        }

        let rolesUsuario = await TamizajeNeonatal.RolesPermisosXidEmpleadoXidPermiso($('#hdIdUsuario').val(), 901)

        if (rolesUsuario.table.length > 0) {
            if (rolesUsuario.table[0].permiso == 1) {
                $('#btnEliminarFua').show()
            }

        }
        console.log('rolesUsuario', rolesUsuario.table)
    },

    BuscarPacienteReniec: function (NroDocumento) { // JDELGADO003
        let formData = new FormData();

        formData.append("dniAuto", $('#').val())
        formData.append("dniCon", NroDocumento)

        if (NroDocumento.length != 8) {
            alerta(4, 'Busqueda solo para pacientes con DNI valido.')
            return false
        }
        return HttpClient.Post('/Sis/listarReniec?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
                    } else {
                        alerta('2', 'No es posible realizar la busqueda por RENIEC (No esta autorizado)')
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })

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
                $('#cboTipoDocPaciente').empty();
                $(response.lsDocumentos.table).each(function (i, obj) {
                    if (obj.idDocIdentidad == 1 || obj.idDocIdentidad == 5 || obj.idDocIdentidad == 7) {
                        $('#cboTipoDocPaciente').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                    }

                })

                $('#cboTipoDocPaciente').val(7)
                $('.chosen-select').chosen().trigger("chosen:updated");
            })
    },

    ListarTipoFormatoSISV2: function (idFuenteFinanciamiento) {

        return HttpClient.Get('/Citas/ListarTipoFormatoSISV2')
            .then(res => {

                $('#cboTipoAfiliacion').empty();
                $('#cboTipoAfiliacionMadre').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboTipoAfiliacion').append(`<option value="${0}">Seleccionar</option>`)
                        $('#cboTipoAfiliacionMadre').append(`<option value="${0}">Seleccionar</option>`)
                        $(res.data.table).each(function (i, obj) {
                            if ((obj.tfrm_Descripcion == 'Afiliación AUS' || obj.tfrm_Descripcion == 'Afiliacion Temporal') && obj.com_Descripcion == 'Subsidiado') {
                                $('#cboTipoAfiliacion').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
                                $('#cboTipoAfiliacionMadre').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
                            }

                        })

                        $(`#cboTipoAfiliacion`).val(0)
                        $(`#cboTipoAfiliacionMadre`).val(0)
                        $('.chosen-select').chosen().trigger("chosen:updated")

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

    ListaDepartamentosReferencia: async function () {
        HttpClient.Get('/Utilitario/ListaDepartamentos?area=Comun').then(res => {
            $('#cmbdepEstbuscar').empty();
            $('#cmbdepEstbuscar').append(`<option value="0">-- Seleccionar --</option>`)
            $(res.lsDeparta.table).each(function (i, obj) {
                if (obj.idDepartamento == 1 || obj.idDepartamento == 2 || obj.idDepartamento == 6 || obj.idDepartamento == 10 || obj.idDepartamento == 13 || obj.idDepartamento == 14 || obj.idDepartamento == 15 || obj.idDepartamento == 16 || obj.idDepartamento == 19 || obj.idDepartamento == 20 || obj.idDepartamento == 22 || obj.idDepartamento == 24 || obj.idDepartamento == 25) {
                    $('#cmbdepEstbuscar').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
                }
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
                $('.chosen-select').chosen().trigger("chosen:updated");
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
                $('.chosen-select').chosen().trigger("chosen:updated");

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

                        $('#cboServicioIngreso').val(110)

                        $('.chosen-select').chosen().trigger("chosen:updated");

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

                        $('.chosen-select').chosen().trigger("chosen:updated");

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
                        $('#cboFuenteFinanciamiento').val(3)
                        $('.chosen-select').chosen().trigger("chosen:updated");

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

                    $('.chosen-select').chosen().trigger("chosen:updated");
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

    ListarEmpleadosDigitanMuestrasTamizaje: function () {

        let formData = new FormData()

        //formData.append('IdEstablecimientoExterno', TamizajeNeonatal.IdInstitucionRegistraMuestra)

        return HttpClient.Post('/TamizajeNeonatalInmp/ListarEmpleadosDigitanMuestrasTamizaje', formData)
            .then(res => {

                $('#cboMuestraTomadaPor').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboMuestraTomadaPor').append(`<option value="${0}">Seleccionar</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboMuestraTomadaPor').append(`<option value="${obj.idEmpleado}">${obj.empleado}</option>`)
                        })

                        $('.chosen-select').chosen().trigger("chosen:updated");

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

    SeleccionarEstadosMuestra: function () {

        let formData = new FormData()

        //formData.append('IdEstablecimientoExterno', TamizajeNeonatal.IdInstitucionRegistraMuestra)

        return HttpClient.Post('/TamizajeNeonatalInmp/SeleccionarEstadosMuestra', formData)
            .then(res => {

                $('#cboEstadoMuestraLaboratorio').empty();
                $('#cboResultadoMuestraLaboratorio').empty();
                $('#cboEstadoMuestraSis').empty();

                $('#cboFiltrosEstadoLaboratorio').empty();
                $('#cboFiltrosEstadosSIS').empty();
                if (res.estado) {
                    if (res.data.table.length > 0) {


                        $('#cboEstadoMuestraLaboratorio').append(`<option value="${0}">Seleccionar</option>`)
                        $('#cboResultadoMuestraLaboratorio').append(`<option value="${0}">Seleccionar</option>`)
                        $('#cboEstadoMuestraSis').append(`<option value="${0}">Seleccionar</option>`)

                        $('#cboFiltrosEstadoLaboratorio').append(`<option value="${0}">Seleccionar</option>`)
                        $('#cboFiltrosEstadosSIS').append(`<option value="${0}">Seleccionar</option>`)
                        $(res.data.table).each(function (i, obj) {


                            if (obj.idTipoEstado == 3 && obj.idEstadoMuestra != 13 && obj.idEstadoMuestra != 9 && obj.idEstadoMuestra != 15) {
                                $('#cboEstadoMuestraLaboratorio').append(`<option value="${obj.idEstadoMuestra}">${obj.descripcion}</option>`)
                                $('#cboFiltrosEstadoLaboratorio').append(`<option value="${obj.idEstadoMuestra}">${obj.descripcion}</option>`)
                            }

                            if (obj.idEstadoMuestra == 15) {
                                $('#cboResultadoMuestraLaboratorio').append(`<option value="${obj.idEstadoMuestra}">${obj.descripcion}</option>`)
                            }


                            if (obj.idTipoEstado == 2) {
                                $('#cboEstadoMuestraSis').append(`<option value="${obj.idEstadoMuestra}">${obj.descripcion}</option>`)
                                $('#cboFiltrosEstadosSIS').append(`<option value="${obj.idEstadoMuestra}">${obj.descripcion}</option>`)
                            }

                        })

                        $('.chosen-select').chosen().trigger("chosen:updated");

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

    ListarMotivosRechazoTamizaje: function () {

        let formData = new FormData()

        //formData.append('IdEstablecimientoExterno', TamizajeNeonatal.IdInstitucionRegistraMuestra)

        return HttpClient.Post('/TamizajeNeonatalInmp/ListarMotivosRechazoTamizaje', formData)
            .then(res => {

                $('#cboMotivoRechazo').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {


                        $('#cboMotivoRechazo').append(`<option value="${0}">Seleccionar</option>`)
                        $(res.data.table).each(function (i, obj) {


                            $('#cboMotivoRechazo').append(`<option value="${obj.idMotivo}">${obj.descripcion}</option>`)

                            if (obj.estado == 1 && obj.idSubMenu != 99) {
                                $('#cboMotivoRechazo2').append(`<option value="${obj.idMotivo}">${obj.descripcion}</option>`)
                            }

                            if (obj.idSubMenu == 99) {
                                $('#cboOtroMotivoRechazo2').append(`<option value="${obj.idMotivo}">${obj.descripcion}</option>`)
                            }


                        })

                        $('.chosen-select').chosen().trigger("chosen:updated");

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

    ListarMuestrasTamizajeByNroDocumentoMadre: function (NroDocumentoMadre) {
        let formData = new FormData();
        formData.append('NroDocumentoMadre', NroDocumentoMadre)

        return HttpClient.Post('/TamizajeNeonatalInmp/ListarMuestrasTamizajeByNroDocumentoMadre?area=Comun', formData)
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

    ListarEstablecimientosTamizajeIpress: async () => {
        let res = await HttpClient.Get('/TamizajeNeonatalInmp/ListarEstablecimientosTamizajeIpress')
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            return false
        }

        data = res.data

        $('#cboEstablecimientoBusqueda').empty();

        $('#cboEstablecimientoBusqueda').append('<option  value="0">Seleccione una opción</option>');
        $(data.table).each(function (i, obj) {
            $('#cboEstablecimientoBusqueda').append('<option  value="' + obj.idEstablecimiento + '">' + obj.codigo + '-' + obj.nombre + '</option>');
        });
        $('#cboEstablecimientoBusqueda').val(0)
        $('.chosen-select').chosen().trigger("chosen:updated");
    },

    ListarCierresByAnioAndIdInstitucion: async (Anio, IdInstitucion) => {

        Cargando(1)

        let res = await HttpClient.Get(`/TamizajeNeonatalInmp/ListarCierresByAnioAndIdInstitucion?Anio=${Anio}&IdInstitucion=${IdInstitucion}`)
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            Cargando(0)
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            Cargando(0)
            return false
        }

        data = res.data

        $('#cboNroCierreBusqueda').empty();

        $(data.table).each(function (i, obj) {
            $('#cboNroCierreBusqueda').append('<option  value="' + obj.nroCierre + '">' + '(N° Cierre) ' + obj.nroCierre + ' - (N° Ref) ' + obj.nroReferencia + '</option>');
        });
        $('#cboNroCierreBusqueda').val(0)
        $('.chosen-select').chosen().trigger("chosen:updated");
        Cargando(0)
    },

    ListarMuestrasTamizajeNeonatalByIpress: async (
        FechaRegistro, Anio, IdEstablecimiento, NroCierre, NroDocumentoBusqueda, NroApellidoPaternoBusqueda, NroApellidoMaternoBusqueda, NombresBusqueda, NroDocumentoMadreBusqueda,
        CodigoBarras, NroCorrelativo, ApellidoMaternoMadre, ApellidoPaternoMadre, NombresMadre, EstablecimientoOrigen, Tipo) => {

        let formData = new FormData()

        formData.append('FechaRegistro', FechaRegistro)
        formData.append('Anio', Anio)
        formData.append('IdEstablecimiento', IdEstablecimiento)
        formData.append('NroCierre', NroCierre)
        formData.append('NroDocumentoBusqueda', NroDocumentoBusqueda)
        formData.append('NroApellidoPaternoBusqueda', NroApellidoPaternoBusqueda)
        formData.append('NroApellidoMaternoBusqueda', NroApellidoMaternoBusqueda)
        formData.append('NombresBusqueda', NombresBusqueda)
        formData.append('NroDocumentoMadreBusqueda', NroDocumentoMadreBusqueda)
        formData.append('NroEnvio', $('#txtNroEnvioBusqueda').val())
        formData.append('CodigoBarras', CodigoBarras)
        formData.append('NroCorrelativo', NroCorrelativo)
        formData.append('ApellidoMaternoMadre', ApellidoMaternoMadre)
        formData.append('ApellidoPaternoMadre', ApellidoPaternoMadre)
        formData.append('NombresMadre', NombresMadre)
        formData.append('EstablecimientoOrigen', EstablecimientoOrigen)
        formData.append('Tipo', Tipo)
        formData.append('EstadoLab', $('#cboFiltrosEstadoLaboratorio').val())
        formData.append('EstadoSis', $('#cboFiltrosEstadosSIS').val())


        Cargando(1)

        let res = await HttpClient.Post(`/TamizajeNeonatalInmp/ListarMuestrasTamizajeNeonatalByIpress`, formData)
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            Cargando(0)
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            Cargando(0)
            return false
        }

        data = res.data

        oTable_atenciones.fnClearTable()
        if (data.table.length > 0) {

            TamizajeNeonatal.ListaAtenciones = data.table

            let ListaAtencionesFiltro = TamizajeNeonatal.ListaAtenciones

            oTable_atenciones.fnClearTable()

            if (ListaAtencionesFiltro.length > 0) {

                oTable_atenciones.fnAddData(ListaAtencionesFiltro)
            }

        }

        Cargando(0)
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

    ResultadosLaboratorioTamizajeNeonatal: async function (IdCuentaAtencion) {

        let formData = new FormData()

        formData.append('IdCuentaAtencion', IdCuentaAtencion)

        $('#cboResultadoMuestraLaboratorio').val(0)

        Cargando(1)

        let res = await HttpClient.Post(`/TamizajeNeonatalInmp/ResultadosLaboratorioTamizajeNeonatal`, formData)

        if (!isEmpty(res.data)) {
            if (res.data.table.length > 0) {
                let resultados = res.data.table[0]

                $('#valorTSH').text(resultados.ntsH_VALOR_ANALITO)
                $('#valorFEN').text(resultados.neoPhe_VALOR_ANALITO)
                $('#valor17OHP').text(resultados.n17OHP_VALOR_ANALITO)
                $('#valorIRT').text(resultados.irT_VALOR_ANALITO)


                $('#estadoTSH').text(resultados.ntsH_REF_ANALITO)
                $('#estadoFEN').text(resultados.neoPhe_REF_ANALITO)
                $('#estado17OHP').text(resultados.n17OHP_REF_ANALITO)
                $('#estadoIRT').text(resultados.irT_REF_ANALITO)


                if (resultados.ntsH_REF_ANALITO == 'REACTIVO') {
                    $('#estadoTSH').html(`<span class="chip danger">${resultados.ntsH_REF_ANALITO}</span>`)
                    $('#cboResultadoMuestraLaboratorio').val(15)
                }

                if (resultados.neoPhe_REF_ANALITO == 'REACTIVO') {
                    $('#estadoFEN').html(`<span class="chip danger">${resultados.neoPhe_REF_ANALITO}</span>`)
                    $('#cboResultadoMuestraLaboratorio').val(15)
                }

                if (resultados.n17OHP_REF_ANALITO == 'REACTIVO') {
                    $('#estado17OHP').html(`<span class="chip danger">${resultados.n17OHP_REF_ANALITO}</span>`)
                    $('#cboResultadoMuestraLaboratorio').val(15)
                }

                if (resultados.irT_REF_ANALITO == 'REACTIVO') {
                    $('#estadoIRT').html(`<span class="chip danger">${resultados.irT_REF_ANALITO}</span>`)
                    $('#cboResultadoMuestraLaboratorio').val(15)
                }

                $('.chosen-select').chosen().trigger("chosen:updated");
            }
        }
        console.log('res', res)


        Cargando(0)
    },

    SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo: async (idSiasis, Codigo) => {

        Cargando(1)

        let res = await HttpClient.Get(`/TamizajeNeonatalInmp/SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo?idSiasis=${idSiasis}&Codigo=${Codigo}`)
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            Cargando(0)
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            Cargando(0)
            return false
        }

        data = res.data

        return data
    },

    SeleccionarPacienteConHistoria: function (ApellidoPaterno, ApellidoMaterno, Nombres, IdDocIdentidad, NroDocumento) {
        let formData = new FormData();


        formData.append("ApellidoPaterno", ApellidoPaterno)
        formData.append("ApellidoMaterno", ApellidoMaterno)
        formData.append("Nombres", Nombres)
        formData.append("IdDocIdentidad", IdDocIdentidad)
        formData.append("NroDocumento", NroDocumento)

        return HttpClient.Post('/TamizajeNeonatalInmp/SeleccionarPacienteConHistoria?area=Comun', formData)
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

    FiltrarMedicosTamizaje: function () {

        return HttpClient.Get('/Utilitario/FiltrarMedicosTamizaje')
            .then(res => {

                $('#cboMedicoResponsable').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        $('#cboMedicoResponsable').append(`<option value="${0}">--Seleccionar--</option>`)
                        $(res.data.table).each(function (i, obj) {
                            $('#cboMedicoResponsable').append(`<option value="${obj.idMedico}" data-empleado="${obj.idEmpleado}">${obj.colegiatura} - ${obj.apellidoPaterno} ${obj.apellidoMaterno} ${obj.nombres}</option>`)
                        })

                        $('#cboMedicoResponsable').val(974)
                        TamizajeNeonatal.IdMedico = 974

                        $('.chosen-select').chosen().trigger("chosen:updated");

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

    ListarPacientesByDatosPacienteAndNroDocumentoMadre: function () {
        let formData = new FormData();
        formData.append("NroDocumento", $('#txtNroDocumentoBusqPaciente').val())
        formData.append("NroHistoriaClinica", $('#txtNrohistoriaBusqPaciente').val())
        formData.append("ApellidoPaterno", $('#txtApellidoPaternoBusqPaciente').val())
        formData.append("ApellidoMaterno", $('#txtApellidoMaternoBusqPaciente').val())
        formData.append("PrimerNombre", $('#txtPrimerNombreBusqPaciente').val())
        formData.append("madreDocumento", $('#txtNumDocMadreBusqPaciente').val())

        return HttpClient.Post('/Paciente/ListarPacientesByDatosPacienteAndNroDocumentoMadre', formData)
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
                        //alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
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

    ConsultarAfiliadoFuaE: async function (intOpcion, strTipoDocumento, strNroDocumento, strDisa, strTipoFormato, strNroContrato, strCorrelativo) {

        let formData = new FormData();

        formData.append("intOpcion", intOpcion)
        formData.append("strTipoDocumento", strTipoDocumento)
        formData.append("strNroDocumento", strNroDocumento)
        formData.append("strDisa", strDisa)
        formData.append("strTipoFormato", strTipoFormato)
        formData.append("strNroContrato", strNroContrato)
        formData.append("strCorrelativo", strCorrelativo)

        return HttpClient.Post('/MicroServicios/ConsultarAfiliadoFuaE', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error al consultar con la WebService del SIS, vuelve a intentarlo ')
                Cargando(0)
                return null
            })

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

    InitDatablesBusquedaPacientes: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaNacimietnoDMA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_busquedaPacientes = $("#tblBusquedaPaciente").dataTable(parms);
    },

    InitDatablesAtenciones: () => {

        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            order: [[0, 'desc']],
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "fechaNacimientoHora",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "peso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "talla",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "sexoRN",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '20%',
                    targets: 4,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '5%',
                    targets: 5,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '5%',
                    targets: 6,
                    data: "fechaTomaMuestra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '5%',
                    targets: 7,
                    data: "horaTomaMuestra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '10%',
                    targets: 8,
                    data: "codigoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '10%',
                    targets: 9,
                    data: "fechaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {

                        if (rowData.idAtencion != 0) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '5%',
                    targets: 12,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoMuestraSIS == 5) {          //Aceptado
                            $(td).html('<span class="chip teal">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 6) {           //Migrado
                            $(td).html('<span class="chip primary">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 7) {           //No Acredita
                            $(td).html('<span class="chip danger">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 17) {           //No Acredita / Fallecido
                            $(td).html('<span class="chip danger">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 18) {           //No Acredita / Sin Seguro
                            $(td).html('<span class="chip danger">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 12) {           //Pendiente
                            $(td).html('<span class="chip orange">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 14) {           //Fua Físico
                            $(td).html('<span class="chip secondary">' + rowData.estadoMuestraSIS + '</span >');
                        } else if (rowData.idEstadoMuestraSIS == 16) {       //No Enviado
                            $(td).html('<span class="chip warning">' + rowData.estadoMuestraSIS + '</span >');
                        } else {
                            $(td).html('');
                        }


                        if (rowData.esMuestraSospechosa == 1) {
                            $($(td).parent()[0]).attr('style', 'background: #e7d722; color: #000; font-weight: bold;');
                        }
                    }

                },
                {
                    width: '5%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoMuestraLab == 8) {          //Aceptado
                            $(td).html('<span class="chip teal">' + rowData.estadoMuestraLab + '</span >');
                        } else if (rowData.idEstadoMuestraLab == 9) {            //Procesado
                            $(td).html('<span class="chip info">' + rowData.estadoMuestraLab + '</span >');
                        } else if (rowData.idEstadoMuestraLab == 10) {       //Rechazado
                            $(td).html('<span class="chip danger">' + rowData.estadoMuestraLab + '</span >');
                        } else if (rowData.idEstadoMuestraLab == 11) {       //No Enviado
                            $(td).html('<span class="chip warning">' + rowData.estadoMuestraLab + '</span >');
                        } else if (rowData.idEstadoMuestraLab == 15) {       //Sospechosa
                            $(td).html('<span class="chip" style="background: #fcff34">' + rowData.estadoMuestraLab + '</span >');
                            //$(td).parent().css('font-weight', 'bold');
                            //$(td).parent().css('color', '#bdc100');
                        } else {
                            $(td).html('');
                        }

                    }

                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 12,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.registroIpress == 1) {          //Aceptado
                            $(td).html('<span class="chip info">PILOTO</span >');
                        } else if (rowData.registroIpress == 0) {            //Procesado
                            $(td).html('<span class="chip" style="background: #df79ce; color: #fff;">NO_PILOTO</span >');
                        } else {
                            $(td).html('');
                        }
                    }

                },
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
                },
                {
                    width: '10%',
                    targets: 7,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

                        ////const examen = await TamizajeNeonatal.SeleccionarExamenLaboratorioTamizaje(rowData.idCuentaAtencion);

                        //console.log('examen', examen)

                        if (rowData.resultado != 0) {
                            btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } /*else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';                                   
                                }*/

                                if (rowData.statusFirmaEmpleado == 0 && rowData.statusFirmaOrden == 0) {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            } else {
                                btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-secondary glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            }

                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

                    }
                }

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },

    async HabilitarFormulario() {

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

        $('#txtFechaRecepcion').datepicker("setDate", fechaP)
        $('#txtHoraRecepcion').val(time)

        $('#cboFuenteFinanciamiento').val(3)

        await TamizajeNeonatal.ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2(3)

        $('#cboMuestraTomadaPor').val($('#hdIdUsuario').val())
        $('#cboProductoPlan').val(2)
        $('.chosen-select').chosen().trigger("chosen:updated")

    },

    CargarDatosAtencion: async (atencion) => {
        TamizajeNeonatal.IdAtencion = atencion.idAtencion

        TamizajeNeonatal.IdSiaSis = atencion.idSiaSisNeo
        TamizajeNeonatal.CodigoSis = atencion.codigoSisNeo

        $('#hdIdSiaSis').val(atencion.idSiaSisNeo)
        $('#hdCodigo').val(atencion.codigoSisNeo)

        TamizajeNeonatal.IdRegistroTamizaje = atencion.idRegistroTamizaje
        TamizajeNeonatal.IdInstitucionRegistraMuestra = atencion.idInstitucion
        TamizajeNeonatal.IdEstablecimientoOrigen = atencion.idEstablecimientoOrigen
        TamizajeNeonatal.IdRnTamizaje = atencion.idRnTamizaje

        TamizajeNeonatal.idTipoServicio = atencion.idTipoServicio

        TamizajeNeonatal.IdPaciente = atencion.idPaciente
        TamizajeNeonatal.NroHistoria = atencion.nroHistoriaClinica

        TamizajeNeonatal.IdEstablecimientoSIGH = atencion.idEstablecimientoSIGH

        atencion.idMedicoIngreso == null ? TamizajeNeonatal.IdMedico = 974 : TamizajeNeonatal.IdMedico = atencion.idMedicoIngreso

        TamizajeNeonatal.idPersonaAcreditaMuestra = atencion.idPersonaAcreditaMuestra

        TamizajeNeonatal.idEstadoMuestraLab = atencion.idEstadoMuestraLab

        //TamizajeNeonatal.ListarEmpleadosTomaMuestraByEstablecimiento()

        TamizajeNeonatal.DataSetAfiliacion = [
            atencion.paterno, atencion.materno, atencion.nombres, '', atencion.fnacimiento, atencion.afiliacionDisa + '-' + atencion.afiliacionNroFormato, 0, '', atencion.documentoNumero, atencion.genero,
            atencion.idUbigeo, atencion.afiliacionDisa, atencion.afiliacionTipoFormato, atencion.afiliacionNroFormato, '', atencion.codigo, atencion.idSiasis, '', atencion.codigoEstablAdscripcion, atencion.afiliacionFecha
        ]

        let dt = new Date();
        let time = (dt.getHours() < 10 ? ("0" + dt.getHours()) : dt.getHours()) + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy


        if (atencion.fechaRecepcion != '') {
            $('#txtFechaRecepcion').datepicker("setDate", atencion.fechaRecepcion)
        } else {
            $('#txtFechaRecepcion').datepicker("setDate", fechaP)
        }

        if (atencion.horaRecepcion != '') {
            $('#txtHoraRecepcion').val(atencion.horaRecepcion)
        } else {
            $('#txtHoraRecepcion').val(time)
        }

        if (atencion.fechaSospechoso != '') {
            $('#txtFechaRegistroSospecha').datepicker("setDate", atencion.fechaSospechoso)
        } else {
            $('#txtFechaRegistroSospecha').datepicker("setDate", fechaP)
        }

        if (atencion.horaSospecha != '') {
            $('#txtHoraRegistroSospecha').val(atencion.horaSospecha)
        } else {
            $('#txtHoraRegistroSospecha').val(time)
        }

        if (atencion.fechaRecepcionSIS != '') {
            $('#txtFechaRecepcionSIS').datepicker("setDate", atencion.fechaRecepcionSIS)
        } else {
            if ($('#tipoBusqueda').val() == 2) {
                $('#txtFechaRecepcionSIS').datepicker("setDate", fechaP)
            }
        }

        if (atencion.horaRecepcionSIS != '') {
            $('#txtHoraRecepcionSIS').val(atencion.horaRecepcionSIS)
        } else {
            if ($('#tipoBusqueda').val() == 2) {
                $('#txtHoraRecepcionSIS').val(time)
            }
        }


        if (isEmpty(TamizajeNeonatal.idPersonaAcreditaMuestra) || TamizajeNeonatal.idPersonaAcreditaMuestra == 0 || TamizajeNeonatal.idPersonaAcreditaMuestra == '') {
            $('#txtFechaIngreso').datepicker("setDate", fechaP)
            $('#txtHoraIngreso').val('12:00')
        } else {
            //$('#txtFechaRecepcion').datepicker("setDate", fechaP)
            $('#txtFechaIngreso').datepicker("setDate", atencion.fechaIngreso)
            $('#txtHoraIngreso').val(atencion.horaIngreso)
        }

        $('#txtPersonalQueRealizoTomaMuestra').val(atencion.personalQueRealizoTomaMuestra)


        await TamizajeNeonatal.ResultadosLaboratorioTamizajeNeonatal(atencion.idCuentaAtencion)
        //atencion.fechaIngreso !== '' ? $('#txtFechaIngreso').val(atencion.fechaIngreso) : null
        //atencion.horaIngreso !== '' ? $('#txtHoraIngreso').val(atencion.horaIngreso) : $('#txtHoraIngreso').val('12.00')

        $('#lblDescripcionEstablecimiento').text(atencion.establecimientoRegistra)

        $('#txtInstitucion').val(atencion.desEstablecimientoSIGH)

        atencion.idMedicoIngreso == null ? atencion.idResponsableMuestraMGP == null ? $('#cboMedicoResponsable').val(974) : $('#cboMedicoResponsable').val(atencion.idResponsableMuestraMGP) : $('#cboMedicoResponsable').val(atencion.idMedicoIngreso)

        $('#txtIdReferenciaCita').val(atencion.codigoEstablecimientoAfiliacion)
        $('#txtDescripcionReferenciaCita').val(atencion.nombreEstablecimientoAfiliacion)

        if (atencion.idEstadoMuestraSIS == 5) {
            $('#txtDisa').val(atencion.afiliacionDisa)
            $('#txtTipo').val(atencion.afiliacionTipoFormato)
            $('#txtNroAfiliacion').val(atencion.afiliacionNroFormato)
            if (atencion.afiliacionTipoFormato == '2') {
                $('#cboTipoAfiliacion').val(7)
            } else if (atencion.afiliacionTipoFormato == 'E') {
                $('#cboTipoAfiliacion').val(8)
            }
        } else {
            $('#txtDisa').val(atencion.nroDisaAfiliacion)
            $('#txtTipo').val(atencion.tipoAfiliacion)
            $('#txtNroAfiliacion').val(atencion.nroAfiliacion)
            $('#cboTipoAfiliacion').val(atencion.idTipoAfiliacion)
        }

        $('#txtNroHistoriaRn').val(atencion.nroHistoriaClinica)
        $('#cboTipoDocPaciente').val(atencion.idDocIdentidad)


        $('#cboEstadoMuestraLaboratorio').val(atencion.idEstadoMuestraLab)


        if (isEmpty(atencion.idEstadoMuestraSIS) || atencion.idEstadoMuestraSIS == 0) {

            if (TamizajeNeonatal.TipoRegistro == 2) {

                if (atencion.idEstadoMuestraLab == 10) {
                    $('#cboEstadoMuestraSis').val(7)
                } else if (atencion.idEstadoMuestraLab == 11) {
                    $('#cboEstadoMuestraSis').val(16)
                } else {
                    $('#cboEstadoMuestraSis').val(5)
                }
            } else {
                $('#cboEstadoMuestraSis').val(atencion.idEstadoMuestraSIS)
            }

        } else {
            $('#cboEstadoMuestraSis').val(atencion.idEstadoMuestraSIS)
        }



        $('#txtObservacionLaboratorio').val(atencion.observacionLaboratorio)

        atencion.idCuentaAtencion !== '' ? $('#txtNroCuenta').val(atencion.idCuentaAtencion) : null

        atencion.edad !== '' ? $('#txtEdadAtencion').val(atencion.edad) : null
        atencion.idTipoEdad !== '' ? $('#cboTipoEdadAtencion').val(atencion.idTipoEdad) : null

        $('#txtPersonaAcredita').val(atencion.personaAcreditaMuestra)
        $('#txtPersonaRecepcionaSIS').val(atencion.personaRecepcionaSIS)

        $('#txtNroReferenciaOrigen').val(atencion.nroReferenciaOrigen)
        $('#txtNroReferenciaDestino').val(atencion.nroReferenciaDestino)
        $('#txtNumeroEnvio').val(atencion.nroEnvioSis)

        !isEmpty(atencion.observacion) ? $('#chbObservacionTamizaje').prop('checked', true) : $('#chbObservacionTamizaje').prop('checked', false)

        $('#txtNumeroAutg').val(atencion.idAutogenerado)
        $('#txtNumeroCorrelativo').val(atencion.numeroCorrelativo)

        $('#txtNroDocumentoMadre').val(atencion.nroDocumentoMadre)
        $('#txtHistoriaClinicaMadre').val(atencion.nroHistoriaClinicaMadre)
        $('#txtApellidoPaternoMadre').val(atencion.apellidoPaternoMadre)
        $('#txtApellidoMaternoMadre').val(atencion.apellidoMaternoMadre)

        $('#txtPrimerNombreMadre').val(atencion.primerNombreMadre)
        $('#txtSegundoNombreMadre').val(atencion.segundoNombreMadre)
        $('#cboTipoSexo').val(atencion.idTipoSexoMadre)
        $('#txtEdadMadre').val(atencion.edadMadre)
        $('#txtTiempoGestSemanas').val(atencion.tiempoGestacion)
        $('#txtTelefono').val(atencion.telefono)
        $('#txtDireccionMadre').val(atencion.direccion)

        $('#txtNroDocumentoPaciente').val(atencion.nroDocumento)
        $('#txtApellidoPaternoPaciente').val(atencion.apellidoPaterno)
        $('#txtApellidoMaternoPaciente').val(atencion.apellidoMaterno)
        $('#txtPrimerNombrePaciente').val(atencion.primerNombre)
        $('#txtSegundoNombrePaciente').val(atencion.segundoNombre)
        $('#txtFechaNacimiento').datepicker("setDate", atencion.fechaNacimiento);
        $('#txtHoraNacimiento').val(atencion.horaNacimiento)
        $('#cboTipoSexoPaciente').val(atencion.idTipoSexoRn)
        $('#txtHoraUltimaLactancia').val(atencion.horaUltimaLactancia)
        $('#txtPeso').val(atencion.peso)
        $('#txtTalla').val(atencion.talla)
        atencion.prematuro == 1 ? $('#rdbPrematuroSi').prop('checked', true) : atencion.prematuro == 2 ? $('#rdbPrematuroNo').prop('checked', true) : ''
        atencion.transfundido == 1 ? $('#rdbTransfundidoSi').prop('checked', true) : atencion.transfundido == 2 ? $('#rdbTransfundidoNo').prop('checked', true) : ''
        $('#txtCodigoEstablecimientoSIS').val(atencion.codigoEstablecimientoAfiliacion)
        $('#txtEstablecimientoSIS').val(atencion.nombreEstablecimientoAfiliacion)

        if (atencion.idPersonalTomaMuestra == null) {
            if (atencion.idResponsableMuestraLaboratorio == null) {
                $('#cboMuestraTomadaPor').val($('#hdIdUsuario').val())
            } else {
                $('#cboMuestraTomadaPor').val(atencion.idResponsableMuestraLaboratorio)
            }
        } else {
            $('#cboMuestraTomadaPor').val(atencion.idPersonalTomaMuestra)
        }

        $('#txtNumeroTarjeta').val(atencion.nroTarjeta)
        $('#txtNumeroReferencia').val(atencion.nroReferencia)
        atencion.nroMuestra == 1 ? $('#rdbNroMuestraPrimera').prop('checked', true) : atencion.nroMuestra == 2 ? $('#rdbNroMuestraSegunda').prop('checked', true) : atencion.nroMuestra == 3 ? $('#rdbNroMuestraTercera').prop('checked', true) : atencion.nroMuestra == 4 ? $('#rdbNroMuestraCuarta').prop('checked', true) : ''
        atencion.muestraTalon == 1 ? $('#rdbMuestraTalonSi').prop('checked', true) : atencion.muestraTalon == 2 ? $('#rdbMuestraTalonNo').prop('checked', true) : ''
        $('#txtFechaTomaMuestra').datepicker("setDate", atencion.fechaTomaMuestra);
        $('#txtHoraMuestra').val(atencion.horaTomaMuestra)
        atencion.tsh == 1 ? $('#chkTSH').prop('checked', true) : ''
        atencion.ohp == 1 ? $('#chkOHP').prop('checked', true) : ''
        atencion.fen == 1 ? $('#chkFEN').prop('checked', true) : ''
        atencion.gal == 1 ? $('#chkGAL').prop('checked', true) : ''
        atencion.irt == 1 ? $('#chkIRT').prop('checked', true) : ''
        atencion.otro == 1 ? $('#chkOTRO').prop('checked', true) : ''

        $('#cboMotivoRechazo').val(atencion.idMotivoRechazo)
        $('#txtOtroMotivoRechazo').val(atencion.otroMotivoRechazo)
        atencion.tshRechazado == 1 ? $('#chkTSHRechazado').prop('checked', true) : ''
        atencion.ohpRechazado == 1 ? $('#chkOHPRechazado').prop('checked', true) : ''
        atencion.fenRechazado == 1 ? $('#chkFENRechazado').prop('checked', true) : ''
        atencion.galRechazado == 1 ? $('#chkGALRechazado').prop('checked', true) : ''
        atencion.irtRechazado == 1 ? $('#chkIRTRechazado').prop('checked', true) : ''
        atencion.otroRechazado == 1 ? $('#chkOTRORechazado').prop('checked', true) : ''

        $('#cboMotivoRechazo2').val(atencion.motivoRechazo2?.split(','));
        $('#cboOtroMotivoRechazo2').val(atencion.otroMotivoRechazo2?.split(','));

        $("#rdbTipoBusquedaReniec").prop('checked', true)
        $("#rdbTipoBusquedaReniec").click()

        if ($('#rdbNroMuestraPrimera').is(':checked')) {

            $('#chkTSH').prop('checked', true)
            $('#chkFEN').prop('checked', true)
            $('#chkOHP').prop('checked', true)
            $('#chkIRT').prop('checked', true)

            $('#chkTSH').prop('disabled', true)
            $('#chkFEN').prop('disabled', true)
            $('#chkOHP').prop('disabled', true)
            $('#chkIRT').prop('disabled', true)

        } else {

            $('#chkTSH').prop('disabled', false)
            $('#chkFEN').prop('disabled', false)
            $('#chkOHP').prop('disabled', false)
            $('#chkIRT').prop('disabled', false)

        }

        $("#txtCorrelativoLaboratorio").val(atencion.correlativoLab);           //KHOYOSI

        atencion.observacionSegundaMuestraTamizaje == 1 ? $('#chbObservacionSegundaMuestraTamizaje').prop('checked', true) : $('#chbObservacionSegundaMuestraTamizaje').prop('checked', false)
        $("#txtObservacionSis").val(atencion.observacionSis);


        atencion.idCuentaAtencion
        ////////////////////KHOYOSI/////////////////////////////////////////////////////
        const examen = await TamizajeNeonatal.SeleccionarExamenLaboratorioTamizaje(atencion.idCuentaAtencion);
        const cpt = await TamizajeNeonatal.SeleccionarCatalogoProductoCPT(14, 2, 1, '80099', 1);     //80099: Codigo CPT de Tamizaje
        //console.log(examen);
        //console.log(cpt);
        $("#ResultadoTamizajeContent").hide();
        if (isEmpty(examen) == false) {
            TamizajeNeonatal.IdCuentaAtencion = examen.idCuentaAtencion;
            TamizajeNeonatal.IdMovimiento = examen.idMovimiento;
            TamizajeNeonatal.IdOrden = examen.idOrden;
            TamizajeNeonatal.IdOrdenPago = examen.idOrdenPago;

            if (isEmpty(examen.code) == false) {
                TamizajeNeonatal.Code = examen.code;
                TamizajeNeonatal.StatusFirma = examen.statusFirma;
                $("#ResultadoTamizajeContent").show();
            }
        } else {
            TamizajeNeonatal.IdCuentaAtencion = atencion.idCuentaAtencion;
            TamizajeNeonatal.IdMovimiento = 0;
            TamizajeNeonatal.IdOrden = 0;
            TamizajeNeonatal.IdOrdenPago = 0;
            TamizajeNeonatal.Code = "";
            TamizajeNeonatal.StatusFirma = "";
        }

        if (isEmpty(cpt) == false) {
            TamizajeNeonatal.Insumos = [];
            var objRowIns = {
                idProductoCPT: 0,
                idProducto: 0,
                cantidadFallada: 0,
                cantidad: 0
            }
            TamizajeNeonatal.Insumos.push(objRowIns);

            TamizajeNeonatal.Productos = [];
            var objRowProd = {
                idProductoCPT: cpt.idProducto,
                cantidad: 1,
                precio: cpt.precioUnitario,
                importe: cpt.precioUnitario * 1,
                totalPorPagar: cpt.precioUnitario * 1,
                total: cpt.precioUnitario * 1,
                labConfHIS: '',
                grupoHIS: 0,
                subgrupoHIS: 0,
            }
            TamizajeNeonatal.Productos.push(objRowProd);
        }

        $("#btnAprobarLaboratorio").hide();
        $("#btnRechazarLaboratorio").show();
        $("#LaboratorioCard").show();
        if (atencion.idEstadoMuestraSIS == 5) {
            $("#btnAprobarLaboratorio").show();
            $("#btnRechazarLaboratorio").show();
            $("#LaboratorioCard").show();
        }

        if (TamizajeNeonatal.IdMovimiento > 0 && atencion.idEstadoMuestraLab == 8) {
            $("#btnAprobarLaboratorio").hide();
            $("#btnRechazarLaboratorio").hide();
            $("#LaboratorioCard").show();
        }


        $('#cboEstadoMuestraLaboratorio').trigger('change')

        $('.chzn-select').chosen().trigger("chosen:updated")
        $('.chosen-select').chosen().trigger("chosen:updated")
    },

    GuardarRegistroTamizajeNeonatal: async function () {

        try {
            if (this.TipoRegistro == 1) { // Laboratorio
                if ($('#cboEstadoMuestraLaboratorio').val() == 8 || $('#cboEstadoMuestraLaboratorio').val() == 15) {
                    if ($('#cboServicioIngreso').val() == 0) {
                        alerta(2, 'Elija el Servicio de Ingreso')
                        return false
                    }

                    if ($('#cboMedicoResponsable').val() == 0 || isEmpty($('#cboMedicoResponsable').val())) {
                        alerta(2, 'Selecciona el Responsable')
                        return false
                    }

                    if ($('#txtFechaIngreso').val() == '') {
                        alerta(2, 'La Fecha de Ingreso es obligatoria')
                        $('#txtFechaIngreso').focus()
                        return false
                    }

                    if ($('#txtHoraIngreso').val() == '') {
                        alerta(2, 'Ingrese la hora de la atención.')
                        $('#txtHoraIngreso').focus()
                        return false
                    }

                    if ($('#txtCorrelativoLaboratorio').val() == '') {
                        alerta(2, 'Ingrese el correlativo.')
                        $('#txtCorrelativoLaboratorio').focus()
                        return false
                    }

                    TamizajeNeonatal.guardando = 1
                    Cargando(1)

                    const correlativo = await TamizajeNeonatal.CorrelativoLaboratorioTamizajeSeleccionar($("#txtCorrelativoLaboratorio").val());

                    if (!isEmpty(correlativo) && (TamizajeNeonatal.accion == 1 || TamizajeNeonatal.IdAtencion == 0)) {
                        alerta(2, 'El numero de corraltivo ya existe, ingresa otro por favor.')
                        $('#txtCorrelativoLaboratorio').focus()
                        TamizajeNeonatal.guardando = 0
                        Cargando(0)
                        return false
                    }
                }
            } // Termina Validacion laboratorio

            let pacientes = null

            let paciente = await TamizajeNeonatal.PacientesSeleccionarPorId(TamizajeNeonatal.IdPaciente)

            if (isEmpty(paciente)) {
                pacientes = await TamizajeNeonatal.PacientesFiltrarTodosSoloHistorias(
                    nroHistoriaClinica = '', apellidoPaterno = '', apellidoMaterno = '', primerNombre = '', segundoNombre = '', idDocIdentidad = $('#cboTipoDocPaciente').val(), nroDocumento = $('#txtNroDocumentoPaciente').val()
                )

                if (!isEmpty(pacientes)) {
                    paciente = await TamizajeNeonatal.PacientesSeleccionarPorId(pacientes[0].idPaciente)
                }
            }

            if (!isEmpty(paciente)) {
                TamizajeNeonatal.IdPaciente = paciente.idPaciente
                TamizajeNeonatal.NroHistoria = paciente.nroHistoriaClinica
            }

            let registroMuestra = await TamizajeNeonatal.CrearModificarRegistroTamizajeNeonatal()

            if (registroMuestra.errorNumber == 0) {

                TamizajeNeonatal.LimpiarCamposRegistro()

                $('#btnBuscarAtenciones').click()
                $('#modalRegistroTamizaje').modal('hide')

                swal({
                    title: 'Atenciones',
                    text: registroMuestra.successMessage,
                    type: 'success',
                    allowOutsideClick: false,
                }).done();
            } else {
                swal({
                    title: 'Atenciones',
                    text: registroMuestra.errorMessage,
                    type: 'error',
                    allowOutsideClick: false,
                }).done();
            }

            TamizajeNeonatal.guardando = 0

            Cargando(0)
        } catch (e) {
            TamizajeNeonatal.guardando = 0
            Cargando(0)
        }


    },
    AnularAtencionesTamizajeNeonatal: function (IdCuentaAtencion, IdRegistroTamizaje, EsRegistroIpress) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("IdCuentaAtencion", IdCuentaAtencion)
        formData.append("IdRegistroTamizaje", IdRegistroTamizaje)
        formData.append("EsRegistroIpress", EsRegistroIpress)

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

    AnularFUATamizajeNeonatal: function (IdCuentaAtencion) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("IdCuentaAtencion", IdCuentaAtencion)

        return HttpClient.Post('/TamizajeNeonatalInmp/AnularFUATamizajeNeonatal?area=ConsultaExterna', formData)
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

    RolesPermisosXidEmpleadoXidPermiso(IdUsuario, IdPermiso) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("IdUsuario", IdUsuario)
        formData.append("IdPermiso", IdPermiso)

        return HttpClient.Post('/TamizajeNeonatalInmp/RolesPermisosXidEmpleadoXidPermiso?area=ConsultaExterna', formData)
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

    LimpiarCamposRegistro: () => {

        $('#txtNumeroEnvio').val('')
        $('#txtDocumentoMadre').val('')
        $('#txtDisaCabecera').val('')
        $('#txtTipoCabecera').val('')
        $('#txtNroAfiliacionCabecera').val('')
        $("#chbObservacionTamizaje").prop('checked', false)

        $('#txtNroHistoria').val('')
        $('#cboTipoHistoria').val(4)
        $('#txtApellidoPaterno').val('')
        $('#txtApellidoMaterno').val('')
        $('#txtPrimerNombre').val('')
        $('#txtSegundoNombre').val('')
        $('#cboTipoSexo').val(0)
        $('#txtFechaNacimiento').val('')
        $('#txtHoraNacimiento').val('')
        //$('#txtIdReferenciaCita').val('')
        //$('#txtDescripcionReferenciaCita').val('')

        $('#cboServicioIngreso').val(110)
        $('#cboMedicoResponsable').val(974)
        $('#txtFechaIngreso').val('')
        $('#txtHoraIngreso').val('')
        $('#txtEdadAtencion').val('')
        $('#cboTipoEdadAtencion').val(0)
        //$('#cboFuenteFinanciamiento').val(0)
        $('#txtNroReferenciaOrigen').val('')
        $('#txtNroReferenciaDestino ').val('')
        $('#txtNroCuenta').val('')


        $('#txtResponsable').val('')
        $('#txtDocumentoResponsable').val('')

        $('#txtNumeroCorrelativo').val('')
        $('#txtNroHistoriaRn').val('')


        $('#txtNroDocumentoMadreBusqueda').val('')
        $('#cboTipoAfiliacionMadre').val(0)
        $('#txtDisaMadre').val('')
        $('#txtTipoMadre').val('')
        $('#txtNroAfiliacionMadre').val('')
        $('#txtNroDocumentoMadre').val('')
        $('#txtApellidoPaternoMadre').val('')
        $('#txtApellidoMaternoMadre').val('')
        $('#txtPrimerNombreMadre').val('')
        $('#txtSegundoNombreMadre').val('')
        $('#cboTipoSexo').val(0)
        $('#txtEdadMadre').val('')
        $('#txtTiempoGestSemanas').val('')
        $('#txtTelefono').val('')
        $('#txtDireccionMadre').val('')

        $('#cboTipoAfiliacion').val(0)
        $('#txtDisa').val('')
        $('#txtTipo').val('')
        $('#txtNroAfiliacion').val('')
        $('#txtNroDocumentoPaciente').val('')
        $('#txtApellidoPaternoPaciente').val('')
        $('#txtApellidoMaternoPaciente').val('')
        $('#txtPrimerNombrePaciente').val('')
        $('#txtSegundoNombrePaciente').val('')
        $('#txtFechaNacimiento').val('')
        $('#txtHoraNacimiento').val('')
        $('#cboTipoSexoPaciente').val(0)
        $('#txtHoraUltimaLactancia').val('')
        $('#txtPeso').val('')
        $('#txtTalla').val('')
        $('#rdbPrematuroSi').prop('checked', false)
        $('#rdbPrematuroNo').prop('checked', false)
        $('#rdbTransfundidoSi').prop('checked', false)
        $('#rdbTransfundidoNo').prop('checked', false)
        $('#txtCodigoEstablecimientoSIS').val('')
        $('#txtEstablecimientoSIS').val('')

        //$('#cboMuestraTomadaPor').val(0)
        $('#txtNumeroTarjeta').val('')
        $('#txtNumeroReferencia').val('')
        $('#rdbNroMuestraPrimera').prop('checked', false)
        $('#rdbNroMuestraSegunda').prop('checked', false)
        $('#rdbNroMuestraTercera').prop('checked', false)
        $('#rdbNroMuestraCuarta').prop('checked', false)

        $('#rdbMuestraTalonSi').prop('checked', false)
        $('#rdbMuestraTalonNo').prop('checked', false)

        $('#txtFechaTomaMuestra').val('')
        $('#txtHoraMuestra').val('')

        $('#txtCorrelativoLaboratorio').val('') //KHOYOSI

        $('#chkTSH').prop('checked', false)
        $('#chkFEN').prop('checked', false)
        $('#chkOHP').prop('checked', false)
        $('#chkIRT').prop('checked', false)

        $('#cboMotivoRechazo').val(0)
        $('#txtOtroMotivoRechazo').val('')
        $('#chkTSHRechazado').prop('checked', false)
        $('#chkFENRechazado').prop('checked', false)
        $('#chkOHPRechazado').prop('checked', false)
        $('#chkIRTRechazado').prop('checked', false)

        $('#chbObservacionSegundaMuestraTamizaje').prop('checked', false)
        $("#txtObservacionSis").val('');

        $('#hdIdSiaSis').val('') //
        $('#hdCodigo').val('') //
        $('#hdAfiliacionDisa').val('') //
        $('#hdAfiliacionTipoFormato').val('') //
        $('#hdAfiliacionNroFormato').val('') //
        $('#hdAfiliacionNroIntegrante').val('') //
        $('#hdDocumentoTipo').val('')
        $('#hdCodigoEstablAdscripcion').val('') //
        $('#hdAfiliacionFecha').val('') //
        $('#hdPaterno').val('') //
        $('#hdMaterno').val('') //
        $('#hdPnombre').val('') //
        $('#hdOnombres').val('')
        $('#hdGenero').val('') //
        $('#hdFnacimiento').val('') //
        $('#hdIdDistritoDomicilio').val('') //
        $('#hdEstado').val(0) //
        $('#hdFbaja').val('') //
        $('#hdDocumentoNumero').val('') //
        $('#hdMotivoBaja').val('') //txtIdReferenciaCita

        $('#txtObservacionLaboratorio').val('') //

        if (TamizajeNeonatal.TipoRegistro == 2) {
            $('#cboEstadoMuestraSis').val('5') //
        }


        $('#txtNroHistoriaRn').val('') //txtIdReferenciaCita
        $('#txtFechaRecepcionSIS').val('') //txtIdReferenciaCita
        $('#txtHoraRecepcionSIS').val('') //txtIdReferenciaCita

        TamizajeNeonatal.DataSetAfiliacion = []

        TamizajeNeonatal.IdSiaSis = ''
        TamizajeNeonatal.CodigoSis = ''
        TamizajeNeonatal.IdRegistroTamizaje = 0
        TamizajeNeonatal.IdTipoDocumento = 0
        TamizajeNeonatal.NroDocumento = 0
        TamizajeNeonatal.IdPaciente = 0
        //TamizajeNeonatal.IdEstablecimientoOrigen = 0


        TamizajeNeonatal.IdAtencion = 0
        TamizajeNeonatal.IdEspecialidadMedico = 0
        TamizajeNeonatal.IdMedico = 974
        TamizajeNeonatal.idTipoServicio = 1


        TamizajeNeonatal.IdEstablecimientoSIGH = 0
        TamizajeNeonatal.IdInstitucionRegistraMuestra = 0

        TamizajeNeonatal.NroHistoria = 0
        TamizajeNeonatal.IdTipoSexo = ''

        TamizajeNeonatal.IdRnTamizaje = 0

        /////////////////////KHOYOSI//////////////////////////////
        TamizajeNeonatal.IdCuentaAtencion = 0;
        TamizajeNeonatal.IdMovimiento = 0;
        TamizajeNeonatal.IdOrden = 0;
        TamizajeNeonatal.IdOrdenPago = 0;
        TamizajeNeonatal.Code = "";
        TamizajeNeonatal.StatusFirma = "";
        ///////////////////////////////////////////////////////////

        TamizajeNeonatal.idPersonaAcreditaMuestra = 0;

        TamizajeNeonatal.idEstadoMuestraLab = 0;

        TamizajeNeonatal.accion = 0
        TamizajeNeonatal.guardando = 0


        $('#cboEstadoMuestraLaboratorio').val(0)


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
        $('#txtHoraIngreso').val('12:00')
        $('#cboEstadoMuestraLaboratorio').trigger('change')

        $('.chosen-select').chosen().trigger("chosen:updated");
        $('#cboFuenteFinanciamiento').trigger('change')
    },


    BuscarEstablecimientoSalud: function () {
        let formData = new FormData()

        formData.append('codigoRenaes', $('#codigoEstBuscar').val())
        formData.append('nombreEstablecimiento', $('#nombreEstBuscar').val())
        formData.append('idDepartamento', $('#cmbdepEstbuscar').val())
        formData.append('idProvincia', $('#cmbprovEstBuscar').val())
        formData.append('idDistrito', $('#cmbdistEstBuscar').val())
        Cargando(1)
        fetch('/citas/ListarEstablecimientosReferenciaV2?area=ConsultaExterna', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(response => {

                oTable_establecimientos.fnClearTable()
                if (response.dataSet.table.length > 0) {
                    let filterTable = response.dataSet.table.filter(obj => obj.idDepartamento == 1 || obj.idDepartamento == 2 || obj.idDepartamento == 6 || obj.idDepartamento == 10 || obj.idDepartamento == 13 || obj.idDepartamento == 14 || obj.idDepartamento == 15 || obj.idDepartamento == 16 || obj.idDepartamento == 19 || obj.idDepartamento == 20 || obj.idDepartamento == 22 || obj.idDepartamento == 24 || obj.idDepartamento == 25)
                    oTable_establecimientos.fnAddData(filterTable);
                }
                Cargando(0)
            });
    },

    BuscarPacienteSis: async function () {
        if ($('#cboTipoAfiliacion').val() == 0) {
            alerta(2, 'Seleccine el tipo de afiliacion')
            return false
        }

        if ($('#txtDisa').val() == '') {
            alerta(2, 'La "DISA DE AFILIACIÓN" es un dato obligatorio.')
            $('#txtDisa').focus()
            return false
        }

        if ($('#txtTipo').val() == '') {
            alerta(2, 'El "TIPO DE AFILIACIÓN" es un dato obligatorio.')
            $('#txtTipo').focus()
            return false
        }

        if ($('#txtNroAfiliacion').val() == '') {
            alerta(2, 'El "NÚMERO DE AFILIACIÓN" es un dato obligatorio.')
            $('#txtNroAfiliacion').focus()
            return false
        }

        Cargando(1)

        TamizajeNeonatal.idPersonaAcreditaMuestra = $('#hdIdUsuario').val()


        let response = await TamizajeNeonatal.ConsultarAfiliadoFuaE(
            intOpcion = $('#cboTipoAfiliacion').val() == '7' ? '1' : '2', strTipoDocumento = $('#txtTipo').val().trim() == '2' ? '1' : '3', strNroDocumento = $('#txtNroAfiliacion').val().trim(),
            strDisa = $('#txtDisa').val().trim(), strTipoFormato = $('#txtTipo').val().trim(), strNroContrato = $('#txtNroAfiliacion').val().trim(), strCorrelativo = '1')


        let datosAfiliacion = response.data

        console.log('datosAfiliacion', datosAfiliacion)

        if (datosAfiliacion.idError == '14') {
            alerta(2, datosAfiliacion.resultado)
            Cargando(0)
            return false
        }

        if (datosAfiliacion.estado != 'ACTIVO') {
            swal({
                title: 'Cuidado',
                text: "La afiliacion de este paciente tiene probelmas \n\n Motivo de baja: \nEstado: " + datosAfiliacion.estado,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            })
            Cargando(0)
            return false
        } else {

            alerta(1, datosAfiliacion.resultado)

            let establecimiento = await TamizajeNeonatal.ListaEstablecimientosByCodigo(datosAfiliacion.eess.substr(3, 5))

            if (isEmpty(establecimiento)) {
                alerta(2, 'No existe el establecimiento para este paciente, consultar con soporte técnico.')
                Cargando(0)
                return false
            }

            $('#hdIdSiaSis').val(datosAfiliacion.idNumReg) //
            $('#hdCodigo').val(datosAfiliacion.tabla) //
            $('#hdAfiliacionDisa').val(datosAfiliacion.disa) //
            $('#hdAfiliacionTipoFormato').val(datosAfiliacion.tipoFormato) //
            $('#hdAfiliacionNroFormato').val(datosAfiliacion.nroContrato) //
            $('#hdAfiliacionNroIntegrante').val(datosAfiliacion.correlativo) //
            $('#hdDocumentoTipo').val(datosAfiliacion.tipoDocumento)
            $('#hdCodigoEstablAdscripcion').val(datosAfiliacion.eess) //
            $('#hdAfiliacionFecha').val(datosAfiliacion.fecAfiliacion) //
            $('#hdPaterno').val(datosAfiliacion.apePaterno) //
            $('#hdMaterno').val(datosAfiliacion.apeMaterno) //
            $('#hdPnombre').val(datosAfiliacion.nombres.split(' ')[0]) //
            $('#hdOnombres').val(datosAfiliacion.nombres.split(' ')[1])
            $('#hdGenero').val(datosAfiliacion.genero) //
            $('#hdFnacimiento').val(datosAfiliacion.fecNacimiento) //
            $('#hdIdDistritoDomicilio').val(datosAfiliacion.eessUbigeo) //
            $('#hdEstado').val(0) //
            $('#hdFbaja').val('') //
            $('#hdDocumentoNumero').val(datosAfiliacion.nroDocumento) //
            $('#hdMotivoBaja').val('') //

            //TamizajeNeonatal.IdEstablecimientoOrigen = establecimiento.idEstablecimiento
            $('#txtCodigoEstablecimientoSIS').val(establecimiento.codigo)
            $('#txtEstablecimientoSIS').val(establecimiento.nombre)

            let edad = getEdad(datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(6, 2) + '/' + datosAfiliacion.fecNacimiento.substr(0, 4))[0]
            let tipoEdad = getEdad(datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(6, 2) + '/' + datosAfiliacion.fecNacimiento.substr(0, 4))[1]

            TamizajeNeonatal.CodigoSis = datosAfiliacion.tabla
            TamizajeNeonatal.IdSiaSis = datosAfiliacion.idNumReg

            $('#txtNroDocumentoPaciente').val(datosAfiliacion.nroContrato)
            $('#txtApellidoPaternoPaciente').val(datosAfiliacion.apePaterno)
            $('#txtApellidoMaternoPaciente').val(datosAfiliacion.apeMaterno)
            $('#txtPrimerNombrePaciente').val(datosAfiliacion.nombres.split(' ')[0])
            $('#txtSegundoNombrePaciente').val(datosAfiliacion.nombres.split(' ')[1])
            $('#txtFechaNacimiento').datepicker("setDate", datosAfiliacion.fecNacimiento.substr(6, 2) + '/' + datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(0, 4))
            //$('#txtHoraNacimiento').val('00:00')
            $('#cboTipoSexoPaciente').val(datosAfiliacion.genero == 1 ? 1 : 2)


            TamizajeNeonatal.DataSetAfiliacion = [
                datosAfiliacion.apePaterno, datosAfiliacion.apeMaterno, datosAfiliacion.nombres, '', datosAfiliacion.fecNacimiento.substr(6, 2) + '/' + datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(0, 4),
                datosAfiliacion.disa + '-' + datosAfiliacion.contrato, 0, '', datosAfiliacion.nroDocumento, (datosAfiliacion.genero == '0' ? '2' : '1'), datosAfiliacion.idUbigeo, datosAfiliacion.disa, datosAfiliacion.tipoFormato, datosAfiliacion.nroContrato, '',
                datosAfiliacion.tabla, datosAfiliacion.idNumReg, '', datosAfiliacion.eess, datosAfiliacion.fecAfiliacion.substr(6, 2) + '/' + datosAfiliacion.fecAfiliacion.substr(4, 2) + '/' + datosAfiliacion.fecAfiliacion.substr(0, 4)
            ]

            TamizajeNeonatal.IdTipoDocumento = (TamizajeNeonatal.DataSetAfiliacion[12] == '2' ? '1' : '7')
            TamizajeNeonatal.NroDocumento = TamizajeNeonatal.DataSetAfiliacion[13]
            TamizajeNeonatal.IdTipoSexo = (TamizajeNeonatal.DataSetAfiliacion[9] == '1' ? 1 : 2)

            edad = getEdad(datosAfiliacion.fecNacimiento.substr(0, 4) + '/' + datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(6, 2))[0]
            tipoEdad = getEdad(datosAfiliacion.fecNacimiento.substr(0, 4) + '/' + datosAfiliacion.fecNacimiento.substr(4, 2) + '/' + datosAfiliacion.fecNacimiento.substr(6, 2))[1]


            $('#cboTipoDocPaciente').val(TamizajeNeonatal.IdTipoDocumento)
            $('#txtEdadAtencion').val(edad)
            $('#cboTipoEdadAtencion').val(tipoEdad)

            $('#txtPrimerNombrePaciente').val(datosAfiliacion.nombres)
            $('#txtSegundoNombrePaciente').val('')

            $('#txtPersonaAcredita').val('')

            $('.chosen-select').chosen().trigger("chosen:updated")
            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        }
    },

    CrearModificarRegistroTamizajeNeonatal: async function () {
        let formData = new FormData();

        formData.append("IdPaciente", TamizajeNeonatal.IdPaciente);
        formData.append("ApellidoPaterno", $('#txtApellidoPaternoPaciente').val());
        formData.append("ApellidoMaterno", $('#txtApellidoMaternoPaciente').val());
        formData.append("PrimerNombre", $('#txtPrimerNombrePaciente').val());
        formData.append("SegundoNombre", $('#txtSegundoNombrePaciente').val());
        formData.append("TercerNombre", '');
        formData.append("FechaNacimiento", $('#txtFechaNacimiento').val() + ' ' + $('#txtHoraNacimiento').val());
        formData.append("NroDocumento", $('#txtNroDocumentoPaciente').val());
        formData.append("IdTipoSexo", $('#cboTipoSexoPaciente').val());
        formData.append("IdDocIdentidad", $('#cboTipoDocPaciente').val());
        formData.append("NroHistoriaClinica", $('#txtNroHistoriaRn').val());
        formData.append("madreDocumento", $('#txtNroDocumentoMadre').val());
        formData.append("madreTipoDocumento", 1);


        formData.append("idCuentaAtencion", TamizajeNeonatal.IdCuentaAtencion);
        formData.append("idAtencion", TamizajeNeonatal.IdAtencion);
        formData.append("idMedicoIngreso", $('#cboMedicoResponsable').val());
        formData.append("idServicioIngreso", $('#cboServicioIngreso').val());
        formData.append("idEspecialidadIngreso", $('#cboServicioIngreso>option:selected').attr("idEspecialidad"));
        formData.append("fechaIngreso", $('#txtFechaIngreso').val());
        formData.append("horaIngreso", $('#txtHoraNacimiento').val());


        formData.append("idSiasis", $('#hdIdSiaSis').val())
        formData.append("Codigo", $('#hdCodigo').val())
        formData.append("AfiliacionDisa", $('#hdAfiliacionDisa').val())
        formData.append("AfiliacionTipoFormato", $('#hdAfiliacionTipoFormato').val())
        formData.append("AfiliacionNroFormato", $('#hdAfiliacionNroFormato').val())
        formData.append("AfiliacionNroIntegrante", $('#hdAfiliacionNroIntegrante').val())
        formData.append("DocumentoTipo", $('#hdDocumentoTipo').val())
        formData.append("CodigoEstablAdscripcion", $('#hdCodigoEstablAdscripcion').val())
        formData.append("AfiliacionFecha", $('#hdAfiliacionFecha').val())
        formData.append("Paterno", $('#hdPaterno').val())
        formData.append("Materno", $('#hdMaterno').val())
        formData.append("Pnombre", $('#hdPnombre').val())
        formData.append("Onombres", $('#hdOnombres').val())
        formData.append("Genero", $('#hdGenero').val())
        formData.append("Fnacimiento", $('#hdFnacimiento').val())
        formData.append("IdDistritoDomicilio", $('#hdIdDistritoDomicilio').val())
        formData.append("Estado", $('#hdEstado').val())
        formData.append("Fbaja", $('#hdFbaja').val())
        formData.append("DocumentoNumero", $('#hdDocumentoNumero').val())
        formData.append("MotivoBaja", $('#hdMotivoBaja').val())
        formData.append("FbajaOK", $('#').val())


        formData.append("IdRnTamizaje", TamizajeNeonatal.IdRnTamizaje)
        formData.append("HoraNacimiento", $('#txtHoraNacimiento').val())
        formData.append("HoraUltimaLactancia", $('#txtHoraUltimaLactancia').val())
        formData.append("Peso", $('#txtPeso').val())
        formData.append("Talla", $('#txtTalla').val())
        formData.append("Prematuro", $('#rdbPrematuroSi').is(':checked') ? 1 : $('#rdbPrematuroNo').is(':checked') ? 2 : 0)
        formData.append("Transfundido", $('#rdbTransfundidoSi').is(':checked') ? 1 : $('#rdbTransfundidoNo').is(':checked') ? 2 : 0)
        formData.append("IdEstablecimientoOrigen", TamizajeNeonatal.IdEstablecimientoOrigen)
        formData.append("NroDisaAfiliacion", $('#txtDisa').val())
        formData.append("TipoAfiliacion", $('#txtTipo').val())
        formData.append("NroAfiliacion", $('#txtNroAfiliacion').val())
        formData.append("IdTipoAfiliacion", $('#cboTipoAfiliacion').val())


        formData.append("IdRegistroTamizaje", TamizajeNeonatal.IdRegistroTamizaje);
        formData.append("IdAutogenerado", $('#txtNumeroAutg').val());
        formData.append("IdInstitucion", TamizajeNeonatal.IdInstitucionRegistraMuestra);
        formData.append("IdTipoInstitucion", $('#cboTipoInstitucion').val());
        formData.append("NumeroCorrelativo", $('#txtNumeroCorrelativo').val());
        formData.append("NroDocumentoMadre", $('#txtNroDocumentoMadre').val());
        formData.append("NroHistoriaClinicaMadre", $('#txtHistoriaClinicaMadre').val());
        formData.append("ApellidoPaternoMadre", $('#txtApellidoPaternoMadre').val());
        formData.append("ApellidoMaternoMadre", $('#txtApellidoMaternoMadre').val());
        formData.append("PrimerNombreMadre", $('#txtPrimerNombreMadre').val());
        formData.append("SegundoNombreMadre", $('#txtSegundoNombreMadre').val());
        formData.append("IdTipoSexoMadre", $('#cboTipoSexo').val());
        formData.append("EdadMadre", $('#txtEdadMadre').val());
        formData.append("TiempoGestacion", $('#txtTiempoGestSemanas').val());
        formData.append("Telefono", $('#txtTelefono').val());
        formData.append("Direccion", $('#txtDireccionMadre').val());
        formData.append("IdPersonalTomaMuestra", $('#cboMuestraTomadaPor').val());
        formData.append("NroTarjeta", $('#txtNumeroTarjeta').val());
        formData.append("NroReferencia", $('#txtNumeroReferencia').val());
        formData.append("NroMuestra", $('input[name="rdbNroMuestra"]:checked').val())
        formData.append("MuestraTalon", $('input[name="rdbMuestraTalon"]:checked').val());
        formData.append("FechaTomaMuestra", $('#txtFechaTomaMuestra').val());
        formData.append("HoraTomaMuestra", $('#txtHoraMuestra').val());
        formData.append("TSH", $('#chkTSH').is(':checked') ? 1 : 0);
        formData.append("OHP", $('#chkOHP').is(':checked') ? 1 : 0);
        formData.append("FEN", $('#chkFEN').is(':checked') ? 1 : 0);
        formData.append("GAL", $('#chkGAL').is(':checked') ? 1 : 0);
        formData.append("IRT", $('#chkIRT').is(':checked') ? 1 : 0);
        formData.append("OTRO", $('#chkOTRO').is(':checked') ? 1 : 0);
        formData.append("FechaRecepcion", $('#txtFechaRecepcion').val())
        formData.append("HoraRecepcion", $('#txtHoraRecepcion').val())
        formData.append("ObservacionLaboratorio", $('#txtObservacionLaboratorio').val())
        formData.append("ObservacionSegundaMuestraTamizaje", $('#chbObservacionSegundaMuestraTamizaje').is(':checked') ? 1 : 0);
        formData.append("ObservacionSis", $('#txtObservacionSis').val());
        formData.append("Observacion", $('#chbObservacionTamizaje').is(':checked') ? 'Muestra de control por prematuridad' : '');
        formData.append("FechaRecepcionSIS", $('#txtFechaRecepcionSIS').val());
        formData.append("HoraRecepcionSIS", $('#txtHoraRecepcionSIS').val());
        formData.append("IdResponsableMuestraMGP", $('#cboMedicoResponsable').val());
        if ($('#tipoBusqueda').val() == 1) {
            formData.append("IdResponsableRecepcionaSISMGP", null);
        } else {
            formData.append("IdResponsableRecepcionaSISMGP", $('#hdIdUsuario').val());
        }
        formData.append("IdResponsableMuestraLaboratorio", $('#cboMuestraTomadaPor').val());
        formData.append("IdEstablecimientoOrigen", TamizajeNeonatal.IdEstablecimientoOrigen);
        formData.append("IdMotivoRechazo", $('#cboMotivoRechazo').val());
        formData.append("OtroMotivoRechazo", $('#txtOtroMotivoRechazo').val());
        formData.append("TSHRechazado", $('#chkTSHRechazado').is(':checked') ? 1 : 0);
        formData.append("OHPRechazado", $('#chkOHPRechazado').is(':checked') ? 1 : 0);
        formData.append("FENRechazado", $('#chkFENRechazado').is(':checked') ? 1 : 0);
        formData.append("GALRechazado", $('#chkGALRechazado').is(':checked') ? 1 : 0);
        formData.append("IRTRechazado", $('#chkIRTRechazado').is(':checked') ? 1 : 0);
        formData.append("OTRORechazado", $('#chkOTRORechazado').is(':checked') ? 1 : 0);
        formData.append("CorrelativoLab", $('#txtCorrelativoLaboratorio').val());
        formData.append("FechaSospechoso", $('#txtFechaRegistroSospecha').val());
        formData.append("HoraSospecha", $('#txtHoraRegistroSospecha').val());
        formData.append("PersonalQueRealizoTomaMuestra", $('#txtPersonalQueRealizoTomaMuestra').val());
        formData.append("EstadoLaboratorio", $('#cboEstadoMuestraLaboratorio').val());
        formData.append("EstadoSIS", $('#cboEstadoMuestraSis').val());
        formData.append("NroEnvioSis", $('#txtNumeroEnvio').val());
        formData.append("NroReferenciaOrigen", $('#txtNroReferenciaOrigen').val());
        formData.append("NroReferenciaDestino", $('#txtNroReferenciaDestino').val());

        formData.append('MotivoRechazo2', $('#cboMotivoRechazo2').val());
        formData.append('OtroMotivoRechazo2', $('#cboOtroMotivoRechazo2').val());


        formData.append('IdMovimiento', TamizajeNeonatal.IdMovimiento);
        formData.append('IdOrden', TamizajeNeonatal.IdOrden);
        formData.append('IdOrdenPago', TamizajeNeonatal.IdOrdenPago);
        formData.append('IdReceta', 0);
        formData.append('MovTipo', 'S');
        formData.append('IdPuntoCarga', 14);
        formData.append('IdPersonaRecoge', null);
        formData.append('TipoAP', '');
        formData.append('IdComprobantePago', null);
        formData.append('CorrelativoAnual', null);
        formData.append('IdDiagnostico', null);
        formData.append('EsDiagnosticoDefinitivo', null);


        formData.append('InsumosCPT', JSON.stringify(TamizajeNeonatal.Insumos));
        formData.append('ProductosCPT', JSON.stringify(TamizajeNeonatal.Productos));


        formData.append("TipoRegistro", TamizajeNeonatal.TipoRegistro);
        formData.append("registroIpress", TamizajeNeonatal.registroIpress);
        formData.append("idListBar", ObtenerItemListBar());


        let res = await HttpClient.Post(`/TamizajeNeonatalInmp/CrearModificarRegistroTamizajeNeonatal`, formData)

        if (isEmpty(res)) {
            return false
        }

        let data = res.data.table[0]

        return data

    },

    Events: () => {
        // Establecimientos de salud
        $('#cboEstadoMuestraLaboratorio').on('change', function () {

            $('#divMuestraRechazada').hide()
            $('#divMuestraSospechosa').hide()

            if ($('#cboEstadoMuestraLaboratorio').val() == 10) {
                $('#divMuestraRechazada').show()
            }

            if ($('#cboEstadoMuestraLaboratorio').val() == 15) {
                let dt = new Date();
                let time = (dt.getHours() < 10 ? ("0" + dt.getHours()) : dt.getHours()) + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

                var dia = dt.getDate()
                var mes = parseInt(dt.getMonth()) + 1
                var yyy = dt.getFullYear()
                if (dia < 10)
                    dia = '0' + dia //agrega cero si el menor de 10
                if (mes < 10)
                    mes = '0' + mes
                fechaP = dia + "/" + mes + "/" + yyy

                if ($('#txtFechaRegistroSospecha').val() == '') {
                    $('#txtFechaRegistroSospecha').datepicker("setDate", fechaP)
                    $('#txtHoraRegistroSospecha').val(time)
                }


                $('#divMuestraSospechosa').show()
            }

            //else {
            //    //$('#cboMotivoRechazo').val(0)
            //    //$('#txtOtroMotivoRechazo').val('')
            //    $('#divMuestraRechazada').hide()
            //}
        })
        $('#btnOpenModalEstablecimientoReferenciaCita').on('click', function () {

            //$('#btnLimpiarBusquedaEstablecimiento').trigger('click')
            $('#modalEstablecimientosBuscar').modal('show')

        })

        $('#btnBuscarPacientesNeo').on('click', async function () {


            if ($('#txtNrohistoriaBusqPaciente').val() == '' && $('#txtNroDocumentoBusqPaciente').val() == '' && $('#txtApellidoPaternoBusqPaciente').val() == '' &&
                $('#txtApellidoMaternoBusqPaciente').val() == '' && $('#txtPrimerNombreBusqPaciente').val() == '' && $('#txtNumDocMadreBusqPaciente').val() == '') {

                alerta(2, 'Debe Ingresar al menos un campo para la busqueda')

                return false

            }

            Cargando(1)

            let listaPacientes = await TamizajeNeonatal.ListarPacientesByDatosPacienteAndNroDocumentoMadre()

            oTable_busquedaPacientes.fnClearTable()
            if (!isEmpty(listaPacientes) && listaPacientes.length > 0) {
                oTable_busquedaPacientes.fnAddData(listaPacientes)
            }

            Cargando(0)
        })

        $('#btnLimpiarBuscarPacientesNeo').on('click', async function () {

            Cargando(1)

            $('#txtNrohistoriaBusqPaciente').val('')
            $('#txtNroDocumentoBusqPaciente').val('')
            $('#txtApellidoPaternoBusqPaciente').val('')
            $('#txtApellidoMaternoBusqPaciente').val('')
            $('#txtPrimerNombreBusqPaciente').val('')
            $('#txtNumDocMadreBusqPaciente').val('')

            Cargando(0)
        })

        $('#btnBuscarNroHistoria').on('click', async function () {
            $('#modalBusquedaPaciente').modal('show')
        })

        $('#tblBusquedaPaciente tbody').on('click', 'tr', function (e) {
            oTable_busquedaPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })

        $('#tblBusquedaPaciente tbody').on('dblclick', 'tr', function (e) {

            oTable_busquedaPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_busquedaPacientes.api(true).row('.selected').data();

            TamizajeNeonatal.IdPaciente = objrow.idPaciente
            TamizajeNeonatal.NroHistoria = objrow.nroHistoriaClinica
            TamizajeNeonatal.IdTipoDocumento = objrow.idDocIdentidad
            TamizajeNeonatal.NroDocumento = objrow.nroDocumento
            TamizajeNeonatal.IdTipoSexo = objrow.idTipoSexo

            $('#txtNroDocumentoPaciente').val(objrow.nroDocumento)
            $('#txtApellidoPaternoPaciente').val(objrow.apellidoPaterno)
            $('#txtApellidoMaternoPaciente').val(objrow.apellidoMaterno)
            $('#txtPrimerNombrePaciente').val(objrow.primerNombre)
            $('#txtSegundoNombrePaciente').val(objrow.segundoNombre)
            $('#txtFechaNacimiento').datepicker("setDate", objrow.fecNacimiento)
            $('#txtHoraNacimiento').val(objrow.horaNacimiento)
            $('#cboTipoSexoPaciente').val(objrow.idTipoSexo)
            $('#cboTipoDocPaciente').val(objrow.idDocIdentidad)
            $('#txtNroHistoriaRn').val(objrow.nroHistoriaClinica)


            $('.chosen-select').chosen().trigger("chosen:updated");
            $('#modalBusquedaPaciente').modal('hide')
        })

        $('#codigoEstBuscar').on('keypress', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                TamizajeNeonatal.BuscarEstablecimientoSalud()
            }
        });

        $('#nombreEstBuscar').on('keypress', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                TamizajeNeonatal.BuscarEstablecimientoSalud()
            }
        });

        $('#btnBuscarEstablecimiento').on('click', function () {

            TamizajeNeonatal.BuscarEstablecimientoSalud()
        })

        $('#btnLimpiarBusquedaEstablecimiento').on('click', () => {
            Cargando(1)
            $('#codigoEstBuscar').val('')
            $('#nombreEstBuscar').val('')

            $('#cmbdepEstbuscar').val(0)
            $('#cmbdepEstbuscar').trigger('change')
            $('.chosen-select').chosen().trigger("chosen:updated")

            oTable_establecimientos.fnClearTable()
            Cargando(0)
        })

        $('#btnCerraEstablecimientoBuscar').on('click', function () {
            $('#modalEstablecimientosBuscar').modal('hide')
        })

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


            $('#modalEstablecimientosBuscar').modal('hide')
        })

        // End Establecimientos de salud

        // Busquedas
        $('#btnBuscarAtenciones').on('click', () => {

            let tipo

            if ($('#tipoBusqueda').val() == 2) {
                tipo = 2
            } else {
                tipo = 1
            }

            TamizajeNeonatal.ListarMuestrasTamizajeNeonatalByIpress($('#txtFechaRegistroBusqueda').val(), $('#cboAnioCierreBusqueda').val(), $('#cboEstablecimientoBusqueda').val(), $('#cboNroCierreBusqueda').val(),
                $('#txtNroDocumentoBusqueda').val(), $('#txtApellidoPaternoBusqueda').val(), $('#txtApellidoMaternoBusqueda').val(), $('#txtNombresBusqueda').val(), $('#txtNroDocumentoMadreBusquedaPrinc').val(),
                $('#txtCodigoBarrasBusqueda').val(), $('#txtNroCorrelativoBusqueda').val(), $('#txtApellidoMaternoMadreBusqueda').val(), $('#txtApellidoPaternoMadreBusqueda').val(), $('#txtNombresMadreBusqueda').val(), $('#cboEstablecimientoOrigenBusqueda').val(),
                tipo)

            return false

        })

        $('#btnLimpiarFiltroAtenciones').on('click', () => {

            Cargando(1)
            $('#cboAnioCierreBusqueda').val(0)
            $('#cboEstablecimientoBusqueda').val(0)
            $('#cboNroCierreBusqueda').val(0)

            $('#cboEstablecimientoOrigenBusqueda').val(0)
            $('#txtNroDocumentoBusqueda').val('')
            $('#txtApellidoPaternoBusqueda').val('')
            $('#txtApellidoMaternoBusqueda').val('')
            $('#txtNombresBusqueda').val('')
            $('#txtNroDocumentoMadreBusquedaPrinc').val('')
            $('#txtNroEnvioBusqueda').val('')

            $('#txtCodigoBarrasBusqueda').val('')
            $('#txtNroCorrelativoBusqueda').val('')
            $('#txtApellidoPaternoMadreBusqueda').val('')
            $('#txtApellidoMaternoMadreBusqueda').val('')
            $('#txtNombresMadreBusqueda').val('')

            $('#cboFiltrosEstadosSIS').val(0)
            $('#cboFiltrosEstadoLaboratorio').val(0)

            $('.chosen-select').chosen().trigger("chosen:updated")

            Cargando(0)

            return false;

        })

        $('#txtNroDocumentoMadre').on('keypress', async function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                $('#txtApellidoPaternoMadre').val('')
                $('#txtApellidoMaternoMadre').val('')
                $('#txtPrimerNombreMadre').val('')
                $('#txtSegundoNombreMadre').val('')
                $('#cboTipoSexo').val(0)
                $('#txtEdadMadre').val('')

                $('.chosen-select').chosen().trigger("chosen:updated")

                Cargando(1)
                if ($('#txtNroDocumentoMadre').val() != '') {
                    try {
                        let registroReniec = await TamizajeNeonatal.BuscarPacienteReniec($('#txtNroDocumentoMadre').val())
                        if (registroReniec.estado) {
                            if (registroReniec.data[0] != '0000') {
                                alerta(2, 'No se encontro paciente en la Base de Datos de RENIEC')
                            } else {
                                alerta(1, 'Se encontraron datos del paciente en la Base de Datos de RENIEC')

                                let datosPaciente = registroReniec.data

                                let edad = getEdad(datosPaciente[18].substr(4, 2) + '/' + datosPaciente[18].substr(6, 2) + '/' + datosPaciente[18].substr(0, 4))[0]

                                $('#txtApellidoPaternoMadre').val(datosPaciente[1])
                                $('#txtApellidoMaternoMadre').val(datosPaciente[2])
                                $('#txtPrimerNombreMadre').val(datosPaciente[3].split(' ')[0])
                                $('#txtSegundoNombreMadre').val(datosPaciente[3].split(' ')[1])
                                $('#cboTipoSexo').val(datosPaciente[17])
                                $('#txtEdadMadre').val(edad)

                                $('.chosen-select').chosen().trigger("chosen:updated")
                            }
                        }
                        console.log('registroReniec', registroReniec)
                        Cargando(0)
                    } catch (ex) {
                        alerta(2, 'Problemas con la busqueda en la Base de Datos de RENIEC, debes ingresar los datos de forma manual.')
                        console.error(ex)
                        Cargando(0)
                    }
                }

                Cargando(0)
            }
        });

        $('#btnBuscarDatosMadre').on('click', async () => {

            $('#txtApellidoPaternoMadre').val('')
            $('#txtApellidoMaternoMadre').val('')
            $('#txtPrimerNombreMadre').val('')
            $('#txtSegundoNombreMadre').val('')
            $('#cboTipoSexo').val(0)
            $('#txtEdadMadre').val('')

            $('.chosen-select').chosen().trigger("chosen:updated")

            Cargando(1)
            if ($('#txtNroDocumentoMadre').val() != '') {
                try {
                    let registroReniec = await TamizajeNeonatal.BuscarPacienteReniec($('#txtNroDocumentoMadre').val())
                    if (registroReniec.estado) {
                        if (registroReniec.data[0] != '0000') {
                            alerta(2, 'No se encontro paciente en la Base de Datos de RENIEC')
                        } else {
                            alerta(1, 'Se encontraron datos del paciente en la Base de Datos de RENIEC')

                            let datosPaciente = registroReniec.data

                            let edad = getEdad(datosPaciente[18].substr(4, 2) + '/' + datosPaciente[18].substr(6, 2) + '/' + datosPaciente[18].substr(0, 4))[0]

                            $('#txtApellidoPaternoMadre').val(datosPaciente[1])
                            $('#txtApellidoMaternoMadre').val(datosPaciente[2])
                            $('#txtPrimerNombreMadre').val(datosPaciente[3].split(' ')[0])
                            $('#txtSegundoNombreMadre').val(datosPaciente[3].split(' ')[1])
                            $('#cboTipoSexo').val(datosPaciente[17])
                            $('#txtEdadMadre').val(edad)

                            $('.chosen-select').chosen().trigger("chosen:updated")
                        }
                    }
                    console.log('registroReniec', registroReniec)
                    Cargando(0)
                } catch (ex) {
                    alerta(2, 'Problemas con la busqueda en la Base de Datos de RENIEC, debes ingresar los datos de forma manual.')
                    console.error(ex)
                    Cargando(0)
                }
            }

            Cargando(0)

        })
        // End Busquedas

        // Eventos Atencion
        $('#btnGuardarRegistroTamizaje').on('click', async function () {

            if ($('#txtNroDocumentoMadre').val() == '') {
                alerta(2, 'El Numero de Documento de la Madre es obligatorio')
                $('#txtNroDocumentoMadre').focus()
                return false
            }
            if ($('#txtApellidoPaternoMadre').val() == '') {
                alerta(2, 'El Apellido Paterno de la Madre es obligatorio')
                $('#txtApellidoPaternoMadre').focus()
                return false
            }
            if ($('#txtPrimerNombreMadre').val() == '') {
                alerta(2, 'El primer nombre de la Madre es obligatorio')
                $('#txtPrimerNombreMadre').focus()
                return false
            }
            if ($('#txtTiempoGestSemanas').val() == '') {
                alerta(2, 'El tiempo de gestacion de la Madre es obligatorio')
                $('#txtTiempoGestSemanas').focus()
                return false
            }
            if ($('#txtPrimerNombrePaciente').val() == '') {
                alerta(2, 'El Primer Nombre es obligatorio')
                $('#txtPrimerNombrePaciente').focus()
                return false
            }
            if ($('#txtHoraUltimaLactancia').val() == '') {
                alerta(2, 'Ingrese la hora de ultima lactancia')
                $('#txtHoraUltimaLactancia').focus()
                return false
            }

            if ($('#txtPeso').val() == '') {
                alerta(2, 'El peso del neonato es obligatorio')
                $('#txtPeso').focus()
                return false
            }
            if ($('#txtTalla').val() == '') {
                alerta(2, 'La talla del neonato es obligatorio')
                $('#txtTalla').focus()
                return false
            }

            if (!$('#rdbNroMuestraPrimera').is(':checked') && !$('#rdbNroMuestraSegunda').is(':checked') && !$('#rdbNroMuestraTercera').is(':checked') && !$('#rdbNroMuestraCuarta').is(':checked')) {
                alerta(2, 'Debe seleccionar el número de muestra')
                return false
            }

            if ($('#txtFechaTomaMuestra').val() == '') {
                alerta(2, 'Ingrese la Fecha de toma de Muestra')
                $('#txtFechaTomaMuestra').focus()
                return false
            }
            if ($('#txtHoraMuestra').val() == '') {
                alerta(2, 'Ingrese la Hora de Toma de Muestra')
                $('#txtHoraMuestra').focus()
                return false
            }

            if (!esFormatoHora($('#txtHoraMuestra').val())) {
                alerta(2, 'Ingresa una Hora de Muestra válida.')
                $('#txtHoraMuestra').focus()
                return false
            }

            if ($('#txtNumeroTarjeta').val() == '') {
                alerta(2, 'El codigo de barras de tarjeta es obligatorio.')
                $('#txtNumeroTarjeta').focus()
                return false
            }

            if (!$('#chkTSH').is(':checked') && !$('#chkFEN').is(':checked') && !$('#chkOHP').is(':checked') && !$('#chkIRT').is(':checked')) {
                alerta(2, 'Debe seleccionar al menos un examen')
                return false
            }

            if ($('#cboEstadoMuestraLaboratorio').val() == 0 || isEmpty($('#cboEstadoMuestraLaboratorio').val())) {
                alerta(2, 'Selecciona el estado de la muestra')
                $('#cboEstadoMuestraLaboratorio').focus()
                return false
            }

            if ($('#txtIdReferenciaCita').val() == '') {
                alerta(2, 'El establecimiento es obligatorio.')
                $('#txtIdReferenciaCita').focus()
                return false
            }

            if ($('#txtFechaNacimiento').val() == '') {
                alerta(2, 'La Fecha de Nacimiento es obligatoria.')
                $('#txtFechaNacimiento').focus()
                return false
            }

            if ($('#txtHoraNacimiento').val() == '') {
                alerta(2, 'La Hora de Nacimiento es obligatoria.')
                $('#txtHoraNacimiento').focus()
                return false
            }

            if (!esFormatoHora($('#txtHoraNacimiento').val())) {
                alerta(2, 'Ingresa una Hora de Nacimiento válida.')
                $('#txtHoraNacimiento').focus()
                return false
            }

            if (TamizajeNeonatal.idEstadoMuestraLab == 8 && $('#cboEstadoMuestraSis').val() == 5) {
                if ($('#txtNroDocumentoPaciente').val() == '') {
                    alerta(2, 'Debe registrar los datos del Neonato para continuar')
                    $('#txtNroDocumentoPaciente').focus()
                    return false
                }

                if ($('#txtPrimerNombrePaciente').val() == '') {
                    alerta(2, 'El Primer Nombre es obligatorio')
                    $('#txtPrimerNombrePaciente').focus()
                    return false
                }

                if ($('#txtFechaNacimiento').val() == '') {
                    alerta(2, 'La Fecha de Nacimiento es obligatoria')
                    $('#txtFechaNacimiento').focus()
                    return false
                }


                if ($('#txtHoraNacimiento').val() == '') {
                    alerta(2, 'Ingrese la hora de nacimiento')
                    $('#txtHoraNacimiento').focus()
                    return false
                }
            }

            if (TamizajeNeonatal.TipoRegistro == 2) {
                if ($('#txtNumeroEnvio').val() == '') {
                    alerta(2, 'El numero de envio es obligatorio')
                    $('#txtNumeroEnvio').focus()
                    return false
                }

                if ($('#txtNroReferenciaOrigen').val() == '') {
                    alerta(2, 'El numero referencia origen es obligatorio')
                    $('#txtNroReferenciaOrigen').focus()
                    return false
                }

                if ($('#txtNroReferenciaDestino').val() == '') {
                    alerta(2, 'El numero referencia destino es obligatorio')
                    $('#txtNroReferenciaDestino').focus()
                    return false
                }

                if (isEmpty($('#cboEstadoMuestraSis').val())) {
                    alerta(2, 'Debe seleccionar el estado de la Muestra')
                    return false
                }
            }


            if (TamizajeNeonatal.DataSetAfiliacion[0] == null && TamizajeNeonatal.idEstadoMuestraLab == 8 && $('#cboEstadoMuestraSis').val() == 5) {
                alerta(2, 'Debe validar la afiliacion del paciente para continuar')
                //$('#txtHoraIngreso').focus()
                return false
            }


            if ((TamizajeNeonatal.idEstadoMuestraLab == 8 && $('#cboEstadoMuestraSis').val() == 5) || (TamizajeNeonatal.idEstadoMuestraLab == 15 && $('#cboEstadoMuestraSis').val() == 5)) {

                objRowSis = TamizajeNeonatal.DataSetAfiliacion

                let establecimiento = await TamizajeNeonatal.ListaEstablecimientosByCodigo(objRowSis[18].substr(3, 5))

                if (isEmpty(establecimiento)) {
                    alerta(2, 'No existe el establecimiento para este paciente, consultar con soporte técnico.')
                    Cargando(0)
                    return false
                }
            }


            /*let fechaHoy = await Utilitario.FechaHoraServidor();*/
            let fechaNacimiento = $('#txtFechaNacimiento').val();
            let fechaIngreso = $('#txtFechaIngreso').val();
            let fechaMuestra = $('#txtFechaTomaMuestra').val();
            let fechaRecepcion = $('#txtFechaRecepcion').val();

            let fn = moment(ConvertirFormatoFecha(fechaNacimiento), "YYYY-MM-DD").toDate();
            let fi = moment(ConvertirFormatoFecha(fechaIngreso), "YYYY-MM-DD").toDate();
            let fm = moment(ConvertirFormatoFecha(fechaMuestra), "YYYY-MM-DD").toDate();
            let fr = moment(ConvertirFormatoFecha(fechaRecepcion), "YYYY-MM-DD").toDate();
            let hoy = moment().startOf('day').toDate(); // fecha actual sin hora

            // Validar Fecha de Muestra >= Fecha de Nacimiento
            if (fm < fn) {
                alerta2("info", "", "La Fecha de Muestra no puede ser menor a la Fecha de Nacimiento.");
                return;
            }
            // Validar Fecha de Ingreso <= Fecha actual
            if (fi > hoy) {
                alerta2("info", "", "La Fecha de Ingreso no puede ser mayor a la Fecha Actual.");
                return;
            }
            // Validar Fecha de Ingreso <= Fecha actual
            if (fr > hoy) {
                alerta2("info", "", "La Fecha de Recepción no puede ser mayor a la Fecha Actual.");
                return;
            }

            if (TamizajeNeonatal.TipoRegistro == 1) {
                //if (parseInt($('#txtEdadMadre').val()) < 11 || parseInt($('#txtEdadMadre').val()) > 50) {
                //    alerta2("info", "", "La Edad de la Madre debe ser entre 11-50 Años.");
                //    return;
                //}


                //if (parseInt($('#txtTiempoGestSemanas').val()) < 20 || parseInt($('#txtTiempoGestSemanas').val()) > 42) {
                //    alerta2("info", "", "La Edad Gestacional debe ser entre 20-42 Semanas.");
                //    return;
                //}

                if (parseInt($('#txtPeso').val()) < 500 || parseInt($('#txtPeso').val()) > 10000) {
                    alerta2("info", "", "El peso debe tener un valor valido (500 gr. - 6000 gr.).");
                    return;
                }

                if (parseInt($('#txtTalla').val()) < 25 || parseInt($('#txtTalla').val()) > 60) {
                    alerta2("info", "", "La talla debe tener un valor valido (25 cm.-60 cm.).");
                    return;
                }
            }


            if (isEmpty($('#cboEstadoMuestraLaboratorio').val())) {
                alerta(2, 'Debe seleccionar el estado de la Muestra')
                return false
            }

            if (esFormatoFecha($("#txtFechaNacimiento").val())) {
                let edad = getEdad(ConvertirFormatoFecha($("#txtFechaNacimiento").val()))[0]
                if (edad > 2) {
                    let edadBebe = await alertaAsync('question', '', 'La edad del Paciente es mayor a 2 años, desea continuar')

                    if (!edadBebe) {
                        return false
                    }
                }
            }

            // bloquear evento enter
            if (TamizajeNeonatal.guardando == 1) {

                return false
            }

            let muestraByNroDocumento = await TamizajeNeonatal.ListarMuestrasTamizajeByNroDocumentoMadre($('#txtNroDocumentoMadre').val())


            if (!isEmpty(muestraByNroDocumento) && TamizajeNeonatal.accion == 1) {
                Cargando(0)
                swal({
                    title: 'Atenciones',
                    text: `Ya se registro el Nro de Documento de la Madre para otra muestra, ¿Desea continuar?`,
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true
                })
                    .then(async (res) => {
                        if (res) {
                            TamizajeNeonatal.GuardarRegistroTamizajeNeonatal()
                        }
                    })
            } else {
                TamizajeNeonatal.GuardarRegistroTamizajeNeonatal()
            }

        })

        $('#btnEliminarAtenciones').on('click', async () => {
            let row = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            let anularCuenta = await alertaAsync('warning', 'Cuidado', '¿Deseas anular esta cuenta?')

            if (anularCuenta.isConfirmed) {
                let atencion = await TamizajeNeonatal.AnularAtencionesTamizajeNeonatal(row.idCuentaAtencion, row.idRegistroTamizaje, row.registroIpress)

                console.log('atencion', atencion)

                $('#btnBuscarAtenciones').click()
            }
        })

        $('#btnEliminarFua').on('click', async () => {
            let row = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            swal({
                title: 'Cuidado',
                text: "¿Deseas anular el FUA?",
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            }).then(async (res) => {

                if (res) {
                    let atencion = await TamizajeNeonatal.AnularFUATamizajeNeonatal(row.idCuentaAtencion)

                    console.log('atencion', atencion)

                    $('#btnBuscarAtenciones').click()
                }
            })


        })
        // End Eventos Atencion

        $('#searchForm input, #searchForm select').keydown(function (event) {
            console.log('si funciona')
            //var code = (event.keyCode ? event.keyCode : e.which);
            //if (code == 13) {
            //    event.preventDefault(); // Prevenir el comportamiento por defecto de Enter
            //    $('#btnBuscarAtenciones').click(); // Hacer clic en el botón de búsqueda
            //}
            if (event.key === "Enter") {
                event.preventDefault(); // Prevenir el comportamiento por defecto de Enter
                $('#btnBuscarAtenciones').click(); // Hacer clic en el botón de búsqueda
                return false
            }
        });

        // Combobox
        $('#cboEstablecimientoBusqueda').on('change', () => {
            TamizajeNeonatal.ListarCierresByAnioAndIdInstitucion($('#cboAnioCierreBusqueda').val(), $('#cboEstablecimientoBusqueda').val())
        })
        $('#cboAnioCierreBusqueda').on('change', () => {
            TamizajeNeonatal.ListarCierresByAnioAndIdInstitucion($('#cboAnioCierreBusqueda').val(), $('#cboEstablecimientoBusqueda').val())
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
                $('#txtDisa').val('250')
                $('#txtTipo').val('2')
            }
        })

        $('#cboTipoAfiliacionMadre').on('change', () => {
            if ($('#cboTipoAfiliacionMadre').val() == 8) {
                $('#txtDisaMadre').val('250')
                $('#txtTipoMadre').val('E')
            } else {
                $('#txtDisaMadre').val('250')
                $('#txtTipoMadre').val('2')
            }
        })

        $('#cmbdepEstbuscar').on('change', function () {
            TamizajeNeonatal.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
            TamizajeNeonatal.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')

            TamizajeNeonatal.BuscarEstablecimientoSalud()
        })
        $('#cmbprovEstBuscar').on('change', function () {
            TamizajeNeonatal.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')

            TamizajeNeonatal.BuscarEstablecimientoSalud()
        })

        $('#cmbdistEstBuscar').on('change', function () {

            TamizajeNeonatal.BuscarEstablecimientoSalud()
        })

        $('#txtDisa').on('keypress', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                TamizajeNeonatal.BuscarPacienteSis()
            }
        });

        $('#txtTipo').on('keypress', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                TamizajeNeonatal.BuscarPacienteSis()
            }
        });

        $('#txtNroAfiliacion').on('keypress', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                // La tecla Enter fue presionada
                event.preventDefault(); // Evita acciones predeterminadas, como el envío de un formulario
                // Llama a la función que desees ejecutar
                TamizajeNeonatal.BuscarPacienteSis()
            }
        });

        $('#btnBuscarPacientes').on('click', async function () {

            TamizajeNeonatal.BuscarPacienteSis()

        })

        $('#btnAgregar').on('click', async function () {

            Cargando(1)

            TamizajeNeonatal.LimpiarCamposRegistro()

            await TamizajeNeonatal.HabilitarFormulario()

            TamizajeNeonatal.registroIpress = 0;
            TamizajeNeonatal.accion = 1

            ////////////////////KHOYOSI/////////////////////////////////////////////////////
            const cpt = await TamizajeNeonatal.SeleccionarCatalogoProductoCPT(2, 2, 1, '80099', 1);     //80099: Codigo CPT de Tamizaje

            if (isEmpty(cpt) == false) {
                TamizajeNeonatal.Insumos = [];
                var objRowIns = {
                    idProductoCPT: 0,
                    idProducto: 0,
                    cantidadFallada: 0,
                    cantidad: 0
                }
                TamizajeNeonatal.Insumos.push(objRowIns);

                TamizajeNeonatal.Productos = [];
                var objRowProd = {
                    idProductoCPT: cpt.idProducto,
                    cantidad: 1,
                    precio: cpt.precioUnitario,
                    importe: cpt.precioUnitario * 1,
                    totalPorPagar: cpt.precioUnitario * 1,
                    total: cpt.precioUnitario * 1,
                    labConfHIS: '',
                    grupoHIS: 0,
                    subgrupoHIS: 0,
                }
                TamizajeNeonatal.Productos.push(objRowProd);
            }
            ////////////////////KHOYOSI/////////////////////////////////////////////////////

            $(".bloquear").prop('disabled', false)

            $('#btnGuardarLaboratorio').show()
            $('#btnGuardar').show()

            $('.chosen-select').chosen().trigger("chosen:updated");
            $('#modalRegistroTamizaje').modal('show')

            $('.chosen-select').chosen().trigger("chosen:updated");

            Cargando(0)

        })

        $('#btnModificarAtenciones').on('click', async function () {
            let atencion = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(atencion)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            ////////////////////KHOYOSI/////////////////////////////////////////////////////
            const cpt = await TamizajeNeonatal.SeleccionarCatalogoProductoCPT(2, 2, 1, '80099', 1);     //80099: Codigo CPT de Tamizaje

            if (isEmpty(cpt) == false) {
                TamizajeNeonatal.Insumos = [];
                var objRowIns = {
                    idProductoCPT: 0,
                    idProducto: 0,
                    cantidadFallada: 0,
                    cantidad: 0
                }
                TamizajeNeonatal.Insumos.push(objRowIns);

                TamizajeNeonatal.Productos = [];
                var objRowProd = {
                    idProductoCPT: cpt.idProducto,
                    cantidad: 1,
                    precio: cpt.precioUnitario,
                    importe: cpt.precioUnitario * 1,
                    totalPorPagar: cpt.precioUnitario * 1,
                    total: cpt.precioUnitario * 1,
                    labConfHIS: '',
                    grupoHIS: 0,
                    subgrupoHIS: 0,
                }
                TamizajeNeonatal.Productos.push(objRowProd);
            }
            ////////////////////KHOYOSI/////////////////////////////////////////////////////


            //if (atencion.idEstadoMuestra == 2) {
            if (true) {
                TamizajeNeonatal.accion = 0

                await TamizajeNeonatal.HabilitarFormulario()

                if (atencion.registroIpress == 1) {
                    $('#btnGuardarLaboratorio').show()
                    $('#btnGuardar').show()
                    TamizajeNeonatal.registroIpress = 1
                } else {
                    $('#btnGuardarLaboratorio').show()
                    $('#btnGuardar').show()
                    TamizajeNeonatal.registroIpress = 0
                }


                if (atencion.idSiaSisNeo != null && atencion.idSiaSisNeo != 'null' && atencion.idSiaSisNeo != '') {
                    await TamizajeNeonatal.SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo(atencion.idSiaSisNeo, atencion.codigoSisNeo)
                }



                $(".bloquear").prop('disabled', false)
                //$("#btnGuardar").show()

                TamizajeNeonatal.CargarDatosAtencion(atencion)

                Cargando(0)

                $('#modalRegistroTamizaje').modal('show')
            } else {
                alerta(2, 'Este registro no se puede editar, debe estar en estado "Cerrado". \n Estado Actual (' + atencion.estadoMuestra + ')')
                return false
            }


        })

        $('#btnConsultarAtenciones').on('click', async function () {
            let atencion = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(atencion)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            await TamizajeNeonatal.SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo(atencion.idSiaSisNeo, atencion.codigoSisNeo)

            $(".bloquear").prop('disabled', true)
            //$("#btnGuardar").show()

            TamizajeNeonatal.CargarDatosAtencion(atencion)

            Cargando(0)

            $('#modalRegistroTamizaje').modal('show')


        })

        $('#btnCerrarModal').on('click', function () {

            TamizajeNeonatal.LimpiarCamposRegistro()

            $('#modalRegistroTamizaje').modal('hide')
        })

        $('#btnGenerarRptTamizaje').on('click', () => {

            if ($('#txtFechaInicio').val() == '') {
                $('#txtFechaInicio').focus()
                alerta(2, 'Ingresa la Fecha de Inicio.')
                return false
            }
            if ($('#txtFechaFin').val() == '') {
                $('#txtFechaFin').focus()
                alerta(2, 'Ingresa la Fecha de Inicio.')
                return false
            }

            let tipo

            if ($('#tipoBusqueda').val() == 2) {
                tipo = 2
            } else {
                tipo = 1
            }

            let formData = new FormData()
            formData.append('FechaInicio', $('#txtFechaInicio').val())
            formData.append('FechaFin', $("#txtFechaFin").val())
            formData.append('Tipo', tipo)
            formData.append('IdEstablecimiento', TamizajeNeonatal.IdInstitucionRegistraMuestra)
            Cargando(1)

            fetch('/Sis/GeneraRptTamizajeNeonatalPorTipo?area=Sis', {
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

        $('#btnAbrirModalReporteTamizaje').on('click', () => {
            $('#modalReporteTamizaje').modal('show')
        })

        // Tables
        $('#tblAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdfTamizaje(row.idCuentaAtencion, row.idCuentaAtencion);

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
            Utilitario.TipoArchivoFirmar = 'FUA';
            /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.code); }*/
            if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua); }
            if (permisoFirmaDigital == 2) { await Utilitario.AbrirServicioFirmaPeru(row.code); }
            Cargando(0);
        });
        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblAtencion tbody').on('click', '.ImprimeInformeResultadoSF', async function () {
            //let objOrden = oTable_atenciones.api(true).row('.selected').data()
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            let tipoFormato = 'LAB-RES';
            const examen = await TamizajeNeonatal.SeleccionarExamenLaboratorioTamizaje(row.idCuentaAtencion);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeResultado);               //KHOYOSI


            if (typeof firma === 'undefined') {
                var url = "/LaboratorioResultados/GenerarFormatoResultadosPorItemMemoria?area=ConsultaExterna&idCuentaAtencion=" + examen.idCuentaAtencion + "&idOrden=" + examen.idOrden + "&idMovimiento=" + examen.idMovimiento + "&idProducto=" + examen.idProductoCPT + "&tipoFormato=" + tipoFormato
                //$('#ifrmTicketCita').attr('src', url)
                newIframe.src = url;
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
        });

        ///////////////////////////KHOYOSI/////////////////////////////////////////
        $('#btnResultadoTamizaje').on('click', async function () {
            if (isEmpty(TamizajeNeonatal.Code) == false) {
                if (TamizajeNeonatal.StatusFirma == 0) {
                    const firma = await Utilitario.SeleccionarFirmaDigitalV2(TamizajeNeonatal.Code)
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                } else if (TamizajeNeonatal.StatusFirma == 1) {
                    await Utilitario.AbrirDocumentoFirmadoBit4Id(TamizajeNeonatal.Code);
                }

            }
        });
        //////////////////////////////////////////////////////////////////////////

        $("input[name=rdbNroMuestra]").on('click', () => {

            if ($('#rdbNroMuestraPrimera').is(':checked')) {

                $('#chkTSH').prop('checked', true)
                $('#chkFEN').prop('checked', true)
                $('#chkOHP').prop('checked', true)
                $('#chkIRT').prop('checked', true)

                $('#chkTSH').prop('disabled', true)
                $('#chkFEN').prop('disabled', true)
                $('#chkOHP').prop('disabled', true)
                $('#chkIRT').prop('disabled', true)

            } else {

                $('#chkTSH').prop('checked', false)
                $('#chkFEN').prop('checked', false)
                $('#chkOHP').prop('checked', false)
                $('#chkIRT').prop('checked', false)

                $('#chkTSH').prop('disabled', false)
                $('#chkFEN').prop('disabled', false)
                $('#chkOHP').prop('disabled', false)
                $('#chkIRT').prop('disabled', false)

            }
        })

        $('#cboEstablecimientoOrigenBusqueda').next('.chosen-container').find('.chosen-search input').on('input', function () {
            let inputVal = $(this).val().trim();
            let select = $('#cboEstablecimientoOrigenBusqueda');

            var formData = new FormData();
            formData.append('Filtro', inputVal);

            if (inputVal.length > 3) {
                $.ajax({
                    method: "POST",
                    url: "/TamizajeNeonatalInmp/BuscarEstablecimientoByCodigoNombre?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (datos) {

                        console.log('productos', datos)

                        let searchInput = select.next('.chosen-container').find('.chosen-search input');
                        let currentSearch = searchInput.val();


                        $('#cboEstablecimientoOrigenBusqueda').empty();

                        $('#cboEstablecimientoOrigenBusqueda').append('<option value="0">Seleccione una opción</option>');
                        $(datos.lstData.table).each(function (i, obj) {
                            $('#cboEstablecimientoOrigenBusqueda').append(`<option value="${obj.idEstablecimiento}">${obj.establecimiento}</option>`);
                        });


                        // Actualizar Chosen para incluir la nueva opción
                        select.trigger('chosen:updated');

                        // Restablecer el valor del input de búsqueda
                        searchInput.val(currentSearch);
                    },
                    error: function (msg) {
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }
                });
            } else {
                let searchInput = select.next('.chosen-container').find('.chosen-search input');
                let currentSearch = searchInput.val();

                $('#cboItemRegistro').empty();
                select.trigger('chosen:updated');

                $('#cboItemRegistro').append('<option value="0">Seleccione una opción</option>');
                select.trigger('chosen:updated');

                searchInput.val(currentSearch);
            }
        });

        $('#modalRegistroTamizaje').on('shown.bs.modal', function (e) {

            if (TamizajeNeonatal.TipoRegistro == 1) {
                BloquearCamposLaboratorio()
            } else if (TamizajeNeonatal.TipoRegistro == 2) {
                BloquearCamposSis()
            }

            $('.chosen-select').chosen().trigger("chosen:updated")
            $('.chzn-select').chosen().trigger("chosen:updated")
        });
    },
    ////////////KHOYOSI/////////////////////////////


    async SeleccionarExamenLaboratorioTamizaje(idCuentaAtencion) {
        var respuesta;
        var resp = null;
        let datos
        var data = new FormData();

        if (idCuentaAtencion > 0) {
            data.append('idCuentaAtencion', idCuentaAtencion);
            Cargando(1);
            try {

                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/TamizajeNeonatalInmp/ExamenLaboratorioTamizajeSeleccionar?area=Sis",
                        //contentType: "application/json; charset=utf-8",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                //console.log(datos)
                if (datos.respuesta.table.length > 0) {
                    resp = datos.respuesta.table[0];
                }
                else {
                    resp = null;
                }
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }
        }

        return resp;
    },

    async SeleccionarCatalogoProductoCPT(idPuntoCarga, idTipoFinaciamiento, idFiltroTipo, filtro, idTipoServicio) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idPuntoCarga', idPuntoCarga);
        data.append('idTipoFinaciamiento', idTipoFinaciamiento);
        data.append('idFiltroTipo', idFiltroTipo);
        data.append('filtro', filtro);
        data.append('idTipoServicio', idTipoServicio);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Catalogo/FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            //console.log(datos)
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async CorrelativoLaboratorioTamizajeSeleccionar(correlativoLab) {
        var respuesta;
        var resp = null;
        let datos
        var data = new FormData();

        data.append('correlativoLab', correlativoLab);
        //Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TamizajeNeonatalInmp/CorrelativoLaboratorioTamizajeSeleccionar?area=Sis",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);
            //console.log(datos)
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
            else {
                resp = null;
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

}

$(document).ready(() => {

    TamizajeNeonatal.Plugins()
    TamizajeNeonatal.CargaInicial()

    TamizajeNeonatal.Events()

    TamizajeNeonatal.InitDatablesAtenciones()
    TamizajeNeonatal.InitDatablesEstablecimientos()
    TamizajeNeonatal.InitDatablesBusquedaPacientes()

    TamizajeNeonatal.ListarTipoFormatoSISV2()
    TamizajeNeonatal.ListaDepartamentosReferencia()

    TamizajeNeonatal.DevuelveServiciosQueSonPuntosCarga()
    TamizajeNeonatal.TiposEdadSeleccionarTodosV2()

    TamizajeNeonatal.ListarFuentesFinanciamientoSegunFiltroV2()
    TamizajeNeonatal.ListarEstablecimientosTamizajeIpress()
    TamizajeNeonatal.ListarEmpleadosDigitanMuestrasTamizaje()

    TamizajeNeonatal.SeleccionarEstadosMuestra()
    TamizajeNeonatal.ListarMotivosRechazoTamizaje()
    TamizajeNeonatal.ListaTiposDocumentos()

    TamizajeNeonatal.FiltrarMedicosTamizaje()

    var $chosenSelect = $('.chzn-select').chosen({
        no_results_text: "No se encontraron resultados"
    });

    // Función de búsqueda personalizada
    $.fn.chosenSearch = function (searchText) {
        var $this = $(this);
        var options = $this.children('option');
        var regex = new RegExp(searchText, 'i');

        options.each(function () {
            var $option = $(this);
            if ($option.text().search(regex) !== -1) {
                $option.show();
            } else {
                $option.hide();
            }
        });

        $this.trigger('chosen:updated');
    };

    // Evento de entrada personalizado para el campo de búsqueda de Chosen
    $chosenSelect.on('keyup', '.chosen-search input', function () {
        var searchText = $(this).val();
        $chosenSelect.chosenSearch(searchText);
    });

    // Redibujar Chosen después de la búsqueda personalizada
    $chosenSelect.on('chosen:showing_dropdown', function () {
        var searchText = $('.chosen-search input').val();
        $chosenSelect.chosenSearch(searchText);
    });

})

function getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)

    console.log('dateString', dateString)
    console.log('fechaNacimiento', fechaNacimiento)

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()

    let anios = edad
    let meses = diferenciaMeses < 0 ? -diferenciaMeses : diferenciaMeses
    let dias

    return [anios, 1]
}

var newIframe = document.getElementById('iframePrintDoc');
newIframe.addEventListener('load', function () {
    // La lógica que quieras ejecutar después de que el iframe haya cargado completamente
    //console.log('El iframe ha cargado completamente.');
    // Ejemplo: Obtener el contenido del iframe
    var contenidoIframe = newIframe.contentDocument || newIframe.contentWindow.document;
    newIframe.contentWindow.focus();
    newIframe.contentWindow.print();
});

function BloquearCamposLaboratorio() {
    $('#txtNumeroEnvio').prop('disabled', true)
    $('#txtNroReferenciaOrigen').prop('disabled', true)
    $('#txtNroReferenciaDestino').prop('disabled', true)

    $('#cboFuenteFinanciamiento').prop('disabled', true)
    $('#cboProductoPlan').prop('disabled', true)
    $('#txtPersonaRecepcionaSIS').prop('disabled', true)
    $('#txtPersonaAcredita').prop('disabled', true)

    $('#chbObservacionTamizaje').prop('disabled', true)
    $('#chbObservacionSegundaMuestraTamizaje').prop('disabled', true)

    $('#cboTipoAfiliacion').prop('disabled', true)
    $('#txtDisa').prop('disabled', true)
    $('#txtTipo').prop('disabled', true)
    $('#txtNroAfiliacion').prop('disabled', true)
    $('#txtObservacionSis').prop('disabled', true)
    $('#cboEstadoMuestraSis').prop('disabled', true)

    $('.chzn-select').chosen().trigger("chosen:updated")
}
function BloquearCamposSis() {
    $('#txtFechaRecepcion').prop('disabled', true)
    $('#txtHoraRecepcion').prop('disabled', true)
    $('#txtPersonalQueRealizoTomaMuestra').prop('disabled', true)
    $('#txtObservacionLaboratorio').prop('disabled', true)
    $('#cboEstadoMuestraLaboratorio').prop('disabled', true)
    $('#txtCorrelativoLaboratorio').prop('disabled', true)
    $('#txtFechaRegistroSospecha').prop('disabled', true)
    $('#txtHoraRegistroSospecha').prop('disabled', true)

    $('#txtNumeroTarjeta').prop('disabled', true)
    $('#rdbNroMuestraPrimera').prop('disabled', true)
    $('#rdbNroMuestraSegunda').prop('disabled', true)
    $('#rdbNroMuestraTercera').prop('disabled', true)
    $('#rdbNroMuestraCuarta').prop('disabled', true)
    $('#rdbMuestraTalonSi').prop('disabled', true)
    $('#rdbMuestraTalonNo').prop('disabled', true)
    $('#txtFechaTomaMuestra').prop('disabled', true)
    $('#txtHoraMuestra').prop('disabled', true)
    $('#chkTSH').prop('disabled', true)
    $('#chkFEN').prop('disabled', true)
    $('#chkOHP').prop('disabled', true)
    $('#chkIRT').prop('disabled', true)
    $('#txtPersonalQueRealizoTomaMuestra').prop('disabled', true)

    $('.chzn-select').chosen().trigger("chosen:updated")
}

function parseDateDMY(fecha) {
    const partes = fecha.split('/');
    // partes[0]: día, partes[1]: mes, partes[2]: año
    return new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
}