let RegistroAdmision = {

    IdPaciente: 0,
    IdAtencion: 0,
    IdAtencionEmeg_CE: 0,
    IdCuentaAtencion: 0,
    IdCamaIngreso: 0,
    IdEspecialidad: 0,
    opcion: '',

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';

        $.mask.definitions['H'] = '[012]';

        $('#txtFechaIngresoAdmision').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaIngresoAdmision').mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraIngresoAdmision").mask("Hn:Nn");
    },
    CargaInicial: function () {
        $('#divContDerivacionEmergencia').hide()

        if ($('#hdIdTipoServicio').val() == 2) { // Muestra derivacion si es emergencia
            $('#divContDerivacionEmergencia').show()
            RegistroAdmision.BloquearDerivacion()
        }

        Diagnosticos.PanelDx = '#PanelDiagnosticoIngreso ';

        Diagnosticos.IniciarScript()
        BusquedaDiagnosticos.IniciarScript();
    },

    InitDatablesServicios: function () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "codigoServicioHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblServicios');

        oTable_Servicios = $("#tblServicios").dataTable(parms);
    },
    InitDatablesMedicoTopico: function () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '70%',
                    targets: 0,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.apellidoPaterno.toUpperCase() + ' ' + rowData.apellidoMaterno.toUpperCase() + ' ' + rowData.nombres.toUpperCase());
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "colegiatura",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblMedicoTopico');

        oTable_MedicoTopico = $("#tblMedicoTopico").dataTable(parms);
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
                { title: 'ApPaterno', data: 'apePaterno' },
                { title: 'ApMaterno', data: 'apeMaterno' },
                { title: 'PNombre', data: 'nombres' },
                { title: 'SNombre', data: 'snombre' },  // No hay en JSON, queda vacío
                { title: 'Fnacimiento', data: 'fecNacimiento', render: formatFecha },
                { title: 'cAfiliacion', data: 'contrato' },
                { title: 'estado', data: 'estado' },
                { title: 'fBajaOK', data: 'fBajaOK' },  // No hay en JSON, queda vacío
                { title: 'DNI', data: 'nroDocumento' },
                { title: 'sexo', data: 'genero', render: (data) => (data === '1' ? '1' : '2') },
                { title: 'distritoDomicilio', data: 'idUbigeo' },
                { title: 'cDisa', data: 'disa' },
                { title: 'cFormato', data: 'tipoFormato' },
                { title: 'cNumero', data: 'nroContrato' },
                { title: 'codigo', data: 'tabla' },
                { title: 'idSiaSis', data: 'idNumReg' },
                { title: 'MotivoBaja', data: 'motivoBaja' },  // No hay en JSON
                { title: 'CodigoEstablAdscripcion', data: 'eess' },
                { title: 'AfiliacionFecha', data: 'fecAfiliacion', render: formatFecha },
                { title: 'IdTipoDoc', data: 'tipoDocumento' }
            ]
        }

        oTable_busquedaSis = $("#tblBusquedaSis").dataTable(parms);
    },
    InitDatablesBusquedaPacientes: function () {
        let parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": true,
            "scrollX": true,
            scrollY: '75vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaNacimiento))
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "idEstadoHistoria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_pacientesBusqueda = $("#tblPacientesBusqueda").dataTable(parms);
    },
    InitDatablesPacienteProviene: function () {
        let parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": true,
            "scrollX": true,
            scrollY: '75vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaEgreso))
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "horaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "consultorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "idAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "fuentesFinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_pacienteProviene = $("#tblPacienteProviene").dataTable(parms);
    },
    ListarCamas: async function (idServicio) {
        var midata = new FormData();
        let datos;
        var isDisabled;

        midata.append('idServicio', idServicio);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Camas/ListarCamasPorServicio?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboCamaIngresoAdmision').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    if (obj.idPaciente != RegistroAdmision.IdPaciente) {
                        if (obj.idCama == -1) {
                            isDisabled = 'disabled'
                        }
                        $('#cboCamaIngresoAdmision').append('<option ' + isDisabled + ' value="' + obj.idCama + '">' + obj.paciente + '</option>');
                    } else {
                        $('#cboCamaIngresoAdmision').append('<option ' + isDisabled + ' value="' + RegistroAdmision.IdCamaIngreso + '">' + obj.paciente + '</option>');
                    }

                    isDisabled = '';
                });
                $('#cboCamaIngresoAdmision').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    AtencionesCESeleccionarPorId: async function (idAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idAtencion', idAtencion);

        try {
            let res = await HttpClient.Post('/Atencion/AtencionesCESeleccionarPorId?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    AtencionesSinAdmHospitalizacion: async function (ProvieneDeEmergencia) {
        Cargando(1);
        let formData = new FormData();
        formData.append('ProvieneDeEmergencia', ProvieneDeEmergencia);

        try {
            let res = await HttpClient.Post('/AdmisionHospitalizacion/AtencionesSinAdmHospitalizacion?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data?.table ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    RecetasByCuentaByEstado: async function (idCuentaAtencion, idEstado) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idEstado', idEstado);

        try {
            let res = await HttpClient.Post('/Receta/RecetasByCuentaByEstado?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data?.table ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    AtencionesActualizarEstadoCuentaHosp: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        try {
            let res = await HttpClient.Post('/Atencion/AtencionesActualizarEstadoCuentaHosp?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    AtencionesActualizarEstadoCuentaHospConSeguro: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        try {
            let res = await HttpClient.Post('/Atencion/AtencionesActualizarEstadoCuentaHospConSeguro?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    AtencionesSeleccionarPorIdPaciente: async function (idPaciente, idTipoServicio) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idTipoServicio', idTipoServicio);

        try {
            let res = await HttpClient.Post('/Atencion/AtencionesSeleccionarPorIdPaciente?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data?.table ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    AtencionesSeleccionarPorId: async function (idAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idAtencion', idAtencion);

        try {
            let res = await HttpClient.Post('/Atencion/AtencionesSeleccionarPorId?area=Comun', formData);
            Cargando(0);

            if (res.estado && res.data?.table.length > 0) {
                return res.data?.table[0] ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },

    TipoPacienteEnEspecialidad: function (idPaciente, idEspecialidad) {
        var formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idEspecialidad', idEspecialidad);

        if (idEspecialidad == 1456 || idEspecialidad == 1457) {
            return HttpClient.Post('/Utilitario/TipoPacienteEnEspecialidadEmergencia', formData).then(res => {
                return res.dataSet.table.length > 0 ? res.dataSet.table[0] : null;
            })
        }

        return HttpClient.Post('/Utilitario/TipoPacienteEnEspecialidad', formData).then(res => {
            return res.dataSet.table.length > 0 ? res.dataSet.table[0] : null;
        })
    },

    /*BuscarFuentePorDNI: function (idPaciente, idEspecialidad) {
        var formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idEspecialidad', idEspecialidad);

        return HttpClient.Post('/Paciente/BuscarFuentePorDNI?comun=ConsultaExterna', formData).then(res => {
            return res.dataSet.table[0]
        })
    },*/
    //==============KHOYOSI 20032026===============================================================================
    BuscarFuentePorDNI: function (nroDocumento) {
        var formData = new FormData();        
        formData.append('nroDocumento', nroDocumento);

        return HttpClient.Post('/Paciente/BuscarFuentePorDNI?comun=ConsultaExterna', formData).then(res => {
            return res.lsPacientes.table.length > 0 ? res.lsPacientes.table[0] : null
        })
    },
    //==============================================================================================================

    RetornaTotalPagosServiciosPendientesPorNroCuentaDEBB: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        let total = 0
        let usados = [];

        try {
            let res = await HttpClient.Post('/Atencion/FacturacionServicioPagosPorCuenta?area=Comun', formData);
            Cargando(0);


            if (!res.estado && res.data.table.length === 0) {
                return 0;
            }

            let registros = res.data.table
            registros = registros.filter(item => item.estadoFacOrdenServicio != 9)
            registros.forEach(function (registro) {
                const idOrdenPago = registro.idOrdenPago;

                // Evitar procesar el mismo idOrdenPago más de una vez
                if (usados.includes(idOrdenPago)) return;
                usados.push(idOrdenPago);

                // Filtrar todos los registros del mismo idOrdenPago
                const grupo = registros.filter(r => r.idOrdenPago === idOrdenPago);

                // Si alguno tiene ImporteExonerado > 0, restarlo una sola vez
                const exonerado = grupo.find(r => r.ImporteExonerado > 0);
                if (exonerado) {
                    total -= exonerado.ImporteExonerado;
                }

                // Sumar todos los totalPorPagar del grupo
                grupo.forEach(r => {
                    total += r.totalPorPagar;
                });
            });

            return total
        } catch (e) {
            Cargando(0);
            console.log(3, `Error inesperado: ${e.message || e}`);
            return total;
        }
    },
    FacturacionBienesPagosSeleccionarPorCuenta: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        try {
            let res = await HttpClient.Post('/Atencion/FacturacionBienesPagosSeleccionarPorCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data?.table ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    RetornaConsumoPacienteServiciosConSeguroPorNroCuenta: async function (idCuentaAtencion, lbAunNoTieneReembolso) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('lbAunNoTieneReembolso', lbAunNoTieneReembolso);

        let lnTotal = 0
        try {
            let res = await HttpClient.Post('/EstadoCuenta/RetornaConsumoPacienteServiciosConSeguroPorNroCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                $(res.data.table1).each((i, obj) => {
                    lnTotal += obj.totalFinanciado
                })

                return lnTotal;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    FarmaciaFinanciamientosPorNroCuenta: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        let lnTotal = 0
        try {
            let res = await HttpClient.Post('/EstadoCuenta/FarmaciaFinanciamientosPorNroCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                $(res.data.table1).each((i, obj) => {
                    lnTotal += obj.totalFinanciado
                })

                return lnTotal;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta: async function (idCuentaAtencion, idParametro) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idParametro', idParametro);

        let lnTotal = 0
        try {
            let res = await HttpClient.Post('/EstadoCuenta/CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                $(res.data.table).each((i, obj) => {
                    lnTotal += obj.total
                })

                return lnTotal;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    RetornaImporteDePagosAdelantadosPorNroCuenta: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idParametro', 245);

        let lnTotal = 0
        try {
            let res = await HttpClient.Post('/EstadoCuenta/CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                $(res.data.table).each((i, obj) => {
                    lnTotal += obj.total
                })

                return lnTotal;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    RetornaImporteDePagosXdevolucionesPorNroCuenta: async function (idCuentaAtencion) {
        Cargando(1);
        let formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idParametro', 265);

        let lnTotal = 0
        try {
            let res = await HttpClient.Post('/EstadoCuenta/CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                $(res.data.table).each((i, obj) => {
                    lnTotal += obj.total
                })

                return lnTotal;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos de las atenciones'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },
    RetornaTotalPagosFarmaciaPendientesPorNroCuentaDEBB: async function (idCuentaAtencion) {
        let lnTotal = 0;
        let total = 0
        let usados = [];

        try {
            let response = await RegistroAdmision.FacturacionBienesPagosSeleccionarPorCuenta(idCuentaAtencion)

            if (!response || response.length === 0) {
                return 0;
            }

            // Filtra registros donde movNumero no sea null
            let registros = response.filter(item => item.movNumero !== null);

            registros.forEach(function (registro) {
                const idOrden = registro.idOrden;

                // Evitar procesar el mismo idOrdenPago más de una vez
                if (usados.includes(idOrden)) return;
                usados.push(idOrden);

                // Filtrar todos los registros del mismo idOrdenPago
                const grupo = registros.filter(r => r.idOrden === idOrden);

                // Si alguno tiene ImporteExonerado > 0, restarlo una sola vez
                const exonerado = grupo.find(r => r.ImporteExonerado > 0);
                if (exonerado) {
                    total -= exonerado.ImporteExonerado;
                }

                // Sumar todos los totalPorPagar del grupo
                grupo.forEach(r => {
                    total += r.totalPorPagar;
                });
            });

        } catch (error) {
            console.error('Error en la consulta de pagos pendientes:', error);
        }

        return total;
    },
    TiposFinanciamientoGeneraReciboPago: async function (IdTipoFinanciamiento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdTipoFinanciamiento', IdTipoFinanciamiento);

        try {
            //Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/TiposFinanciamientoGeneraReciboPago?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);

            resp = datos.lstData

        } catch (error) {
            Cargando(0);
            alerta(2, JSON.stringify(error));
        }

        return resp;
    },
    ListaEstablecimientosByCodigo: async function (codigo) {
        Cargando(1);
        let formData = new FormData();
        formData.append('codigo', codigo);

        try {
            let res = await HttpClient.Post('/Utilitario/ListaEstablecimientosByCodigo?area=Comun', formData);
            Cargando(0);

            if (res.estado) {
                return res.data?.table?.[0] ?? null;
            } else {
                alerta(3, `Error: ${res.msg || 'No se pudo obtener datos del establecimiento'}`);
                return null;
            }
        } catch (e) {
            Cargando(0);
            alerta(3, `Error inesperado: ${e.message || e}`);
            return null;
        }
    },

    SeleccionarServicioById: async function (idServicio) {
        try {
            let formData = new FormData();
            formData.append('idServicio', idServicio);

            let res = await HttpClient.Post('/Citas/SeleccionarServicioById?area=ConsultaExterna', formData);

            if (res && res.estado) {
                if (res.data && res.data.table && res.data.table.length > 0) {
                    return res.data.table[0];
                } else {
                    alerta(2, 'No se encontraron datos del servicio.');
                    return null;
                }
            } else {
                alerta(3, 'Error: ' + (res?.msg || 'Respuesta no válida'));
                return null;
            }
        } catch (error) {
            alerta(3, 'Error en la consulta del servicio: ' + error.message);
            return null;
        }
    },
    ListarTipoFormatoSIS: async function () {
        const res = await HttpClient.Get('/Utilitario/TipoFormatoSIS?area=Comun');

        $('#cboTipoAfiliacion').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de formato sis')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoAfiliacion').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
        })

        $('#cboTipoAfiliacion').val(7)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposReferenciaSeleccionarTodos: async function () {
        const res = await HttpClient.Get('/Utilitario/TiposReferenciaSeleccionarTodos?area=Comun');

        $('#cboTipoReferenciaAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de referencia')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoReferenciaAdmision').append(`<option value="${obj.idTipoReferencia}">${obj.descripcion}</option>`)
        })

        $('#cboTipoReferenciaAdmision').val(7)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarSisServiciosSeleccionarPorFiltro: async function () {

        const res = await HttpClient.Get('/Citas/listarSisServiciosSeleccionarPorFiltro?area=ConsultaExterna');

        $('#cboCodPrestacion').empty();

        $(res.dataSet.table).each(function (i, obj) {
            $('#cboCodPrestacion').append(`<option value="${obj.dServicioCodigo}">${obj.dServicioCodigo} - ${obj.dServicio}</option>`)
        })

        $('#cboCodPrestacion').val('0')

    },
    ReglasDeConsistenciasAntesDeCargarFormulario: async function (idTipoServicio, tipoSexo, edadEnYYYYMMDD) {

        let formData = new FormData()

        formData.append('idTipoServicio', idTipoServicio)
        formData.append('tipoSexo', tipoSexo)
        formData.append('edadEnYYYYMMDD', edadEnYYYYMMDD)

        const res = await HttpClient.Post('/Citas/ReglasDeConsistenciasAntesDeCargarFormulario?area=ConsultaExterna', formData);

        $('#cboCodPrestacion').empty();

        $(res.dataSet.table).each(function (i, obj) {
            $('#cboCodPrestacion').append(`<option value="${obj.dServicioCodigo}">${obj.dServicioCodigo} - ${obj.dServicio}</option>`)
        })
        $('#cboCodPrestacion').val('0')
    },
    ListarTipoServicio: async function () {

        const res = await HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun');

        $('#cboTipoServicioAdmision').empty();
        $('#cboTipoServicioBuscar').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoServicioAdmision').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
            $('#cboTipoServicioBuscar').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
        })

        $('#cboTipoServicioAdmision').val($('#hdIdTipoServicio').val())
        $('#cboTipoServicioBuscar').val($('#hdIdTipoServicio').val())
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia?area=Comun');

        $('#cboTipoOrigenAdmision').empty();

        if (isEmpty(res.dataSet)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.dataSet.table).each(function (i, obj) {
            $('#cboTipoOrigenAdmision').append(`<option codigo="${obj.codigo}" value="${obj.idOrigenAtencion}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoOrigenAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposOrigenAtencionSeleccionarViasDeHospitalizacion: async function (TipoServicioHosp) {

        const res = await HttpClient.Get('/Utilitario/TiposOrigenAtencionSeleccionarViasDeHospitalizacion?area=Comun&TipoServicioHosp=' + TipoServicioHosp);

        $('#cboTipoOrigenAdmision').empty();

        if (isEmpty(res.dataSet)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.dataSet.table).each(function (i, obj) {
            $('#cboTipoOrigenAdmision').append(`<option codigo="${obj.codigo}" value="${obj.idOrigenAtencion}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoOrigenAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia?area=Comun');

        $('#cboTipoOrigenAdmision').empty();

        if (isEmpty(res.dataSet)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.dataSet.table).each(function (i, obj) {
            $('#cboTipoOrigenAdmision').append(`<option codigo="${obj.codigo}" value="${obj.idOrigenAtencion}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoOrigenAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaCausaExternaMorbilidadSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaCausaExternaMorbilidadSeleccionarTodos?area=Comun');

        $('#cboCausaExternaMorbilidadAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboCausaExternaMorbilidadAdmision').append(`<option value="${obj.idCausaExternaMorbilidad}">${obj.descripcionLarga}</option>`)
        })
        $('#cboCausaExternaMorbilidadAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaLugarEventoSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaLugarEventoSeleccionarTodos?area=Comun');

        $('#cboLugarEventoAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboLugarEventoAdmision').append(`<option value="${obj.idLugarEvento}">${obj.descripcionLarga}</option>`)
        })
        $('#cboLugarEventoAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaTipoEventoSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaTipoEventoSeleccionarTodos?area=Comun');

        $('#cboTipoEventoAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoEventoAdmision').append(`<option value="${obj.idTipoEvento}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoEventoAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaRelacionAgresorVictimaSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaRelacionAgresorVictimaSeleccionarTodos?area=Comun');

        $('#cboRelacionAgresorVictimaAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboRelacionAgresorVictimaAdmision').append(`<option value="${obj.idRelacionAgresorVictima}">${obj.descripcionLarga}</option>`)
        })
        $('#cboRelacionAgresorVictimaAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaSeguridadSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaSeguridadSeleccionarTodos?area=Comun');

        $('#cboSeguridadAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboSeguridadAdmision').append(`<option value="${obj.idSeguridad}">${obj.descripcionLarga}</option>`)
        })
        $('#cboSeguridadAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaClaseAccidenteSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaClaseAccidenteSeleccionarTodos?area=Comun');

        $('#cboClaseAccidenteAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboClaseAccidenteAdmision').append(`<option value="${obj.idClaseAccidente}">${obj.descripcionLarga}</option>`)
        })
        $('#cboClaseAccidenteAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaTipoVehiculoSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaTipoVehiculoSeleccionarTodos?area=Comun');

        $('#cboTipoVehiculoAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoVehiculoAdmision').append(`<option value="${obj.idTipoVehiculo}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoVehiculoAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaTipoTransporteSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaTipoTransporteSeleccionarTodos?area=Comun');

        $('#cboTipoTransporteAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoTransporteAdmision').append(`<option value="${obj.idTipoTransporte}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoTransporteAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaUbicacionLesionadoSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaUbicacionLesionadoSeleccionarTodos?area=Comun');

        $('#cboUbicacionLesionadoAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUbicacionLesionadoAdmision').append(`<option value="${obj.idUbicacionLesionado}">${obj.descripcionLarga}</option>`)
        })
        $('#cboUbicacionLesionadoAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaGrupoOcupacionalALABSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaGrupoOcupacionalALABSeleccionarTodos?area=Comun');

        $('#cboPosicionLesionadoAlabAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboPosicionLesionadoAlabAdmision').append(`<option value="${obj.idGrupoOcupacionalALAB}">${obj.descripcionLarga}</option>`)
        })
        $('#cboPosicionLesionadoAlabAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaPosicionLesionadoALABSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaPosicionLesionadoALABSeleccionarTodos?area=Comun');

        $('#cboGrupoOcupacionalAlabAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboGrupoOcupacionalAlabAdmision').append(`<option value="${obj.idPosicionLesionadoALAB}">${obj.descripcionLarga}</option>`)
        })
        $('#cboGrupoOcupacionalAlabAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EmergenciaTipoAgenteAGANSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/EmergenciaTipoAgenteAGANSeleccionarTodos?area=Comun');

        $('#cboTipoAgenteAganAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoAgenteAganAdmision').append(`<option value="${obj.idTipoAgenteAGAN}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoAgenteAganAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    ServiciosFiltrar: async function (codigo, descripcion) {
        Cargando(1);

        let formData = new FormData();

        let filtro = `where  Servicios.IdTipoServicio = ${$('#cboTipoServicioBuscar').val()} and  Servicios.idEstado=1`

        oTable_Servicios.fnClearTable()

        if (codigo != '') {
            filtro += ` and Servicios.Codigo = '${codigo}'`
        }

        if (descripcion != '') {
            filtro += ` and Servicios.Nombre like '%${descripcion}%'`
        }

        filtro += ' order by Servicios.Nombre, Especialidades.Nombre'

        formData.append('lcFiltro', filtro);

        const res = await HttpClient.Post('/Utilitario/ServiciosFiltrar?area=Comun', formData);

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {
            oTable_Servicios.fnAddData(data)
        }

        Cargando(0)
    },
    MedicosFiltrar: async function (codigoPlanilla, apellidoPaterno, apellidoMaterno, nombres) {
        Cargando(1);

        let formData = new FormData();

        let filtro = ` where  MedicosEspecialidad.IdEspecialidad <> 50 AND MedicosEspecialidad.IdEspecialidad = ${RegistroAdmision.IdEspecialidad}`

        oTable_MedicoTopico.fnClearTable()

        if (codigoPlanilla != '') {
            filtro += ` and Empleados.CodigoPlanilla = '${codigoPlanilla}'`
        }

        if (apellidoPaterno != '') {
            filtro += ` and Empleados.ApellidoPaterno like '${apellidoPaterno}%'`
        }

        if (apellidoMaterno != '') {
            filtro += ` and Empleados.ApellidoMaterno like '${apellidoMaterno}%'`
        }

        if (nombres != '') {
            filtro += ` and Empleados.Nombres like '%${nombres}%'`
        }


        filtro += ' order by Empleados.ApellidoPaterno, Empleados.ApellidoMaterno, Empleados.Nombres'

        formData.append('lcFiltro', filtro);

        const res = await HttpClient.Post('/Utilitario/MedicosFiltrar?area=Comun', formData);

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {
            oTable_MedicoTopico.fnAddData(data)
        }

        Cargando(0)
    },
    TiposGravedadAtencionSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposGravedadAtencionSeleccionarTodos?area=Comun');

        $('#cboGravedadAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de gravedad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboGravedadAdmision').append(`<option value="${obj.idTipoGravedad}">${obj.descripcionLarga}</option>`)
        })

        $('#cboGravedadAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposEdadSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposEdadSeleccionarTodos?area=Comun');

        $('#cboTipoEdadAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de edad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoEdadAdmision').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoEdadAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    FuentesFinanciamientoSegunFiltro: async function (lcFiltro) {
        Cargando(1);

        let formData = new FormData();

        formData.append('lcFiltro', lcFiltro);

        const res = await HttpClient.Post('/Utilitario/FuentesFinanciamientoSegunFiltro?area=Comun', formData);

        $('#cboFuenteFinanciamientoAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar las fuentes de financiamiento')
            return
        }
        $(res.data.table).each(function (i, obj) {

            if ($('#hdIdTipoServicio').val() == 2) { // Emergencia
                //if (obj.idFuenteFinanciamiento == 3 || obj.idFuenteFinanciamiento == 5 || obj.idFuenteFinanciamiento == 24) {
                    $('#cboFuenteFinanciamientoAdmision').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
                //}
            }
            if ($('#hdIdTipoServicio').val() == 3) { // Emergencia
                //if (obj.idFuenteFinanciamiento == 3 || obj.idFuenteFinanciamiento == 5) {
                    $('#cboFuenteFinanciamientoAdmision').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
                //}
            }
        })
        $('#cboFuenteFinanciamientoAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },
    TiposFinanciamientosTarifaSeleccionarPorPlan: async function (idFuenteFinanciamiento) {
        Cargando(1);

        let formData = new FormData();

        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        const res = await HttpClient.Post('/Utilitario/TiposFinanciamientosTarifaSeleccionarPorPlan?area=Comun', formData);

        $('#cboProductoPlanAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el producto plan')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboProductoPlanAdmision').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
        })

        $('#cboProductoPlanAdmision').val(0)

        if (idFuenteFinanciamiento == 3) {
            $('#cboProductoPlanAdmision').val(2)
        }
       
        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },
    ListarDerivacionById: async function (IdDerivacion) {

        let formData = new FormData();

        formData.append('IdDerivacion', IdDerivacion);

        const res = await HttpClient.Post('/AdmisionEmergencia/ListarDerivacionById?area=Comun', formData);

        if (isEmpty(res.data.table)) {
            return null
        }
        return res.data.table[0]
    },
    PacientesFiltraPorNroDocumentoYtipo: async function () {
        let formData = new FormData();
        formData.append("idDocIdentidad", 1)
        formData.append("nroDocumento", $('#txtDniBusqueda').val())

        let res = await HttpClient.Post('/Citas/PacientesFiltraPorNroDocumentoYtipo?area=Comun', formData)

        if (!isEmpty(res)) {
            if (res.estado && res.data.table.length > 0) {
                return res.data.table
            } else {
                console.log('3', 'Error: ' + res.msg)
                return null
            }
        } else {
            console.log('Error', 'PacientesFiltraPorNroDocumentoYtipo')
            return null
        }

    },
    PacientesSeleccionarPorId: async function (idPaciente) {
        try {
            let formData = new FormData();
            formData.append("idPaciente", idPaciente);

            let res = await HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData);
            Cargando(0); // Finaliza la carga tras recibir la respuesta

            if (!res.estado) {
                alerta(3, res.msg);
                return null;
            }

            if (res.data.table?.length) {
                return res.data.table[0];
            }

            alerta(2, 'No se encontraron datos del paciente, intente nuevamente');
            return null;

        } catch (e) {
            Cargando(0); // Asegura que se detenga la carga en caso de error
            alerta(3, 'Error: ' + e.message);
            return null;
        }
    },
    PacientesFiltrarTodosSoloHistoriasDefinitivas: async function () {
        try {
            let formData = new FormData();
            formData.append("nroHistoriaClinica", $('#txtNroHistoriaBusqueda').val());
            formData.append("apellidoPaterno", $('#txtApellidoPaternoBusqueda').val());
            formData.append("apellidoMaterno", $('#txtApellidoMaternoBusqueda').val());
            formData.append("primerNombre", $('#txtPrimerNombreBusqueda').val());
            formData.append("segundoNombre", $('#txtSegundoNombreBusqueda').val());
            formData.append("idDocIdentidad", 1);
            formData.append("nroDocumento", $('#txtDniBusqueda').val());

            let res = await HttpClient.Post('/Citas/PacientesFiltrarTodosSoloHistoriasDefinitivas', formData);

            if (res?.estado) {
                return res.data.table;
            }

            alerta(3, 'Error: ' + (res?.msg || 'Respuesta no válida'));
            return null;

        } catch (e) {
            alerta(3, 'Algo salió mal: ' + e.message);
            return null;
        }
    },

    BuscarPacienteEnEstablecimiento: async function () {

        if ($('#txtDniBusqueda').val() != '') {
            let paciente = await RegistroAdmision.PacientesFiltraPorNroDocumentoYtipo()

            if (isEmpty(paciente)) {
                alerta(2, 'No se encontro información en la Base de Datos del Establecimiento')
                return
            }

            if (paciente.length > 1) {
                let pacientes = await RegistroAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()
                oTable_pacientesBusqueda.fnClearTable()
                oTable_pacientesBusqueda.fnAddData(pacientes)
                $('#modalPacientesBusqueda').modal('show')
            } else {
                paciente = paciente[0]
                paciente = await RegistroAdmision.PacientesSeleccionarPorId(paciente.idPaciente)

                //----------------------------------------------------------------------------------------------------------------
                let buscaSiEstaHospitalizado = await RegistroAdmision.BuscaSiEstaHospitalizado(paciente.idPaciente, $('#hdIdTipoServicio').val())

                if (!buscaSiEstaHospitalizado) {

                    let tipoSexo = paciente.idTipoSexo == 1 ? 'M' : 'F'
                    let edadEnYYYYMMDD = RegistroAdmision.EdadActualEnFormatoYYYYMMDD(FormatearFecha(paciente.fechaNacimiento), $('#txtFechaIngresoAdmision').val())

                    await RegistroAdmision.ReglasDeConsistenciasAntesDeCargarFormulario($('#hdIdTipoServicio').val(), tipoSexo, edadEnYYYYMMDD)

                    await RegistroPaciente.CompletarDatosPaciente(paciente, 1)
                    $('#modalPacientesBusqueda').modal('hide')
                }
                //----------------------------------------------------------------------------------------------------------------
            }


        } else {
            let pacientes = await RegistroAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()

            if (pacientes.length > 0) {
                oTable_pacientesBusqueda.fnClearTable()
                oTable_pacientesBusqueda.fnAddData(pacientes)
                $('#modalPacientesBusqueda').modal('show')
            }
        }
    },
    CamasLimpiaIdPaciente: async (idPaciente) => {
        try {
            let formData = new FormData();
            formData.append("idPaciente", idPaciente);

            let res = await HttpClient.Post('/Camas/CamasLimpiaIdPaciente?area=Comun', formData);

            if (res.estado) {
                return res.data;
            } else {
                alerta(3, res.msg);
                Cargando(0);
                return null;
            }
        } catch (e) {
            alerta(3, 'Error: ' + e);
            return null;
        }
    },
    FacturacionCuentasAtencionPendientePagoSeguro: async (IdCuentaAtencion, HoraCierre, DeudaPendiente) => {
        try {
            let formData = new FormData();
            formData.append("IdCuentaAtencion", IdCuentaAtencion);
            formData.append("HoraCierre", HoraCierre);
            formData.append("DeudaPendiente", DeudaPendiente);

            let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionPendientePagoSeguro?area=Facturacion', formData);

            if (res.estado) {
                return res.data;
            } else {
                alerta(3, res.msg);
                Cargando(0);
                return null;
            }
        } catch (e) {
            alerta(3, 'Error: ' + e);
            return null;
        }
    },
    FacturacionCuentasAtencionCerradoAutomatico: async (IdCuentaAtencion, HoraCierre) => {
        try {
            let formData = new FormData();
            formData.append("IdCuentaAtencion", IdCuentaAtencion);
            formData.append("HoraCierre", HoraCierre);

            let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionCerradoAutomatico?area=Facturacion', formData);

            if (res.estado) {
                return res.data;
            } else {
                alerta(3, res.msg);
                Cargando(0);
                return null;
            }
        } catch (e) {
            alerta(3, 'Error: ' + e);
            return null;
        }
    },
    FactCatalogoServiciosXidTipoFinanciamiento: async function (IdProducto) {
        let formData = new FormData();

        formData.append("idProducto", IdProducto)
        formData.append("idTipoFinanciamiento", $('#cboProductoPlanAdmision').val())

        let res = await HttpClient.Post('/Utilitario/FactCatalogoServiciosXidTipoFinanciamiento?area=Comun', formData)

        if (res.dataSet.table.length > 0) {
            return res.dataSet.table
        } else {
            return null
        }
    },
    FarmMovimientoVentasDetalleSeleccionarPorCuenta: async function (idCuentaAtencion) {
        let resp = null;
        let datos = null;
        let data = new FormData();

        data.append('idCuentaAtencion', idCuentaAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Farmacias/FarmMovimientoVentasDetalleSeleccionarPorCuenta?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstData.table.length > 0) {
                return datos.lstData.table
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    InsertFactCatalogo: async function (idCuentaAtencion, idPaciente, IdProducto) {
        let items = await RegistroAdmision.FactCatalogoServiciosXidTipoFinanciamiento(IdProducto)
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

        formData.append('IdOrden', $('#hdIdOrden').val());
        formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
        formData.append('IdPuntoCarga', 6);
        formData.append('IdPaciente', idPaciente);
        formData.append('IdCuentaAtencion', idCuentaAtencion);
        formData.append('IdServicioPaciente', $('#hdIdServicioIngresoAdmision').val());
        formData.append('idTipoFinanciamiento', $('#cboProductoPlanAdmision').val());
        formData.append('idFuenteFinanciamiento', $('#cboFuenteFinanciamientoAdmision').val());

        formData.append('IdEstadoFacturacion', 1);
        formData.append('FechaHoraRealizaCpt', $('#txtFechaIngresoAdmision').val());
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res
                    Cargando(0)
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
    CrearModificarCuentasAtenciones: async function (idCuentaAtencion, idAtencion, idPaciente, estadoAtencion) {
        let formData = new FormData();

        formData.append("IdCuentaAtencion", idCuentaAtencion)
        //formData.append("TotalPorPagar", null)
        formData.append("IdEstado", estadoAtencion == 0 ? 9 : estadoAtencion)
        //formData.append("TotalPagado", null)
        //formData.append("TotalAsegurado", null)
        //formData.append("TotalExonerado", null)
        //formData.append("HoraCierre", null)
        //formData.append("FechaCierre", null)
        formData.append("HoraApertura", $('#txtHoraIngresoAdmision').val())
        formData.append("FechaApertura", $('#txtFechaIngresoAdmision').val())
        formData.append("IdPaciente", idPaciente)
        formData.append("FechaCreacion", Date.now())



        formData.append("horaIngreso", $('#txtHoraIngresoAdmision').val())
        formData.append("fechaIngreso", $('#txtFechaIngresoAdmision').val())
        formData.append("idTipoServicio", $('#hdIdTipoServicio').val())
        formData.append("idPaciente", idPaciente)
        formData.append("idAtencion", idAtencion)
        formData.append("idTipoCondicionALEstab", $('#hdtipoCondicionPaciente').val())
        formData.append("idTipoEdad", $('#cboTipoEdadPaciente').val())
        formData.append("idOrigenAtencion", $('#cboTipoOrigenAdmision').val())
        formData.append("idTipoCondicionAlServicio", $('#hdtipoCondicionPaciente').val())
        formData.append("edad", $('#txtEdadPaciente').val())
        formData.append("idEspecialidadMedico", $('#hdIdEspecialidadMedicoIngreso').val())
        formData.append("idMedicoIngreso", $('#hdIdMedicoIngreso').val())
        formData.append("idServicioIngreso", $('#hdIdServicioIngresoAdmision').val())
        formData.append("idServicioEgreso", $('#hdIdServicioIngresoAdmision').val())
        formData.append("idCuentaAtencion", idCuentaAtencion)
        formData.append("idFormaPago", $('#cboProductoPlanAdmision').val()) // Capturar el valor - 1 -> Contado
        formData.append("idFuenteFinanciamiento", $('#cboFuenteFinanciamientoAdmision').val())

        formData.append("idEstadoAtencion", estadoAtencion)
        formData.append("esPacienteExterno", 0)
        formData.append("idSunasaPacienteHistorico", null)
        formData.append("esDecretoUrgencia", 0)


        formData.append("idAtencion", idAtencion)
        formData.append("horaIngreso", $('#txtHoraIngresoAdmision').val())
        formData.append("fechaIngreso", $('#txtFechaIngresoAdmision').val())
        formData.append("idTipoServicio", 1)
        formData.append("idPaciente", idPaciente)
        //formData.append("idAtencion", objrowCita != 'undefined' ? objrowCita?.idAtencion : 0)
        formData.append("idTipoCondicionALEstab", $('#hdtipoCondicionPaciente').val())
        formData.append("idTipoEdad", $('#cboTipoEdadPaciente').val())
        formData.append("idOrigenAtencion", $('#cboTipoOrigenAdmision').val())
        formData.append("idTipoCondicionAlServicio", $('#hdtipoCondicionPaciente').val())
        formData.append("edad", $('#txtEdadPaciente').val())

        formData.append("idCuentaAtencion", idCuentaAtencion)

        formData.append("idEstadoAtencion", estadoAtencion)
        formData.append("esPacienteExterno", 0)
        formData.append("esDecretoUrgencia", 0)



        formData.append("DireccionDomicilio", $('#txtDireccionDomicilio').val())
        formData.append("NombreAcompaniante", $('#txtNombreAcompanianteAdmision').val())
        formData.append("TelefonoAcompaniante", $('#txtTelefonoAcompanianteAdmision').val())
        formData.append("Observacion", $('#txtObservacionPaciente').val())
        //formData.append("ProximaCita", null)
        //formData.append("NumeroDeHijos", null)
        formData.append("IdSiaSis", $('#hdIdSiaSis').val()) //
        formData.append("FuaCodigoPrestacion", $('#cboCodPrestacion').val())
        formData.append("SisCodigo", $('#hdCodigo').val()) //
        //formData.append("IdTipoReferenciaDestino", null)
        formData.append("IdTipoReferenciaOrigen", $('#cboTipoReferenciaAdmision').val())
        //formData.append("IdEstablecimientoDestino", null)
        formData.append("IdEstablecimientoOrigen", $('#cboTipoReferenciaAdmision').val() == 1 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("IdEstablecimientoNoMinsaDestino", null)
        formData.append("IdEstablecimientoNoMinsaOrigen", $('#cboTipoReferenciaAdmision').val() == 2 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("HuboInfeccionIntraHospitalaria", )
        //formData.append("TieneNecropsia", null)
        //formData.append("IdMedicoRespNacimiento", null)

        //formData.append("RecienNacido", null)
        formData.append("NroReferenciaOrigen", $('#txtNroReferenciaAdmision').val())
        formData.append("NroReferenciaOrigen", $('#txtNroReferenciaAdmision').val())
        //formData.append("NroReferenciaDestino", null)
        formData.append("idTipoGravedad", $('#cboGravedadAdmision').val())
        formData.append("idDerivacion", $('#txtNroDerivacion').val())
        formData.append("idAtencionEmeg_CE", RegistroAdmision.IdAtencionEmeg_CE)
        formData.append("idCamaIngreso", $('#cboCamaIngresoAdmision').val())

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        try {
            let res = await HttpClient.Post('/Atencion/CrearModificarCuentasAtencionesCeHospEmer?area=ConsultaExterna', formData)
            if (res.estado) {
                return res.data
                Cargando(0)
            } else {
                alerta(3, res.msg)
                Cargando(0)
                return null
            }
        } catch (e) {
            return null
        }



    },
    AtencionesEmergenciaAgregar: async function (IdAtencion) {
        let formData = new FormData();

        formData.append("IdTipoAgenteAGAN", $('#cboTipoAgenteAganAdmision').val())
        formData.append("IdGrupoOcupacionalALAB", $('#cboGrupoOcupacionalAlabAdmision').val())
        formData.append("IdPosicionLesionadoALAB", $('#cboPosicionLesionadoAlabAdmision').val())
        formData.append("IdUbicacionLesionado", $('#cboUbicacionLesionadoAdmision').val())
        formData.append("IdTipoTransporte", $('#cboTipoTransporteAdmision').val())
        formData.append("IdTipoVehiculo", $('#cboTipoVehiculoAdmision').val())
        formData.append("IdClaseAccidente", $('#cboClaseAccidenteAdmision').val())

        formData.append("IdRelacionAgresorVictima", $('#cboRelacionAgresorVictimaAdmision').val())
        formData.append("IdSeguridad", $('#cboSeguridadAdmision').val())
        formData.append("IdTipoEvento", $('#cboTipoEventoAdmision').val())
        formData.append("IdLugarEvento", $('#cboLugarEventoAdmision').val())
        formData.append("IdCausaExternaMorbilidad", $('#cboCausaExternaMorbilidadAdmision').val())
        formData.append("IdAtencion", IdAtencion)


        try {
            let res = await HttpClient.Post('/Atencion/AtencionesEmergenciaAgregar?area=ConsultaExterna', formData)
            if (res.estado) {
                return res.data
                Cargando(0)
            } else {
                alerta(3, res.msg)
                Cargando(0)
                return null
            }
        } catch (e) {
            return null
        }



    },
    RegistarAdmision: async function (tipo) {
        //// tipo = 1: Guardar, tipo = 2: Modificar, tipo = 3: Eliminar

        let paciente
        let idPaciente
        let idEstadoAtencion = 1

        if (!RegistroPaciente.ValidarCampos()) {
            return false
        }

        let validarDatosObligatorios = await RegistroAdmision.ValidarDatosObligatorios($('#hdIdTipoServicio').val())
        if (!validarDatosObligatorios) {
            return false
        }

        if (RegistroPaciente.IdPaciente != 0) {
            let validarRnEnHospital = await RegistroAdmision.ValidarRnEnHospital(RegistroPaciente.IdPaciente)
            if (!validarRnEnHospital) {
                return
            }
        }
       

        let validarReglas = await RegistroAdmision.ValidarReglas()

        if (validarReglas) {
            ////////////////////////// GUARDAR ATENCION

            let movimientosFarmaCuenta = await RegistroAdmision.FarmMovimientoVentasDetalleSeleccionarPorCuenta(RegistroAdmision.IdCuentaAtencion)
            if (!isEmpty(movimientosFarmaCuenta) && movimientosFarmaCuenta.length > 0 && RegistroAdmision.opcion == 'E') {
                alerta2('warning', 'Consulta Externa', 'La Anulación tendrá que realizarlo FACTURACIÓN.')
                return 
            }


            if (RegistroAdmision.opcion == 'A' || RegistroAdmision.opcion == 'M') {
                idPaciente = await RegistroPaciente.CrearModificarHistoria()

                if (isEmpty(idPaciente) || idPaciente == 0) {
                    alerta2('warning', 'Historia', 'Hubo un problema con la creacion de la historia clínica, intentelo nuevamente.')
                    return
                }
            } else {
                idPaciente = RegistroAdmision.IdPaciente
            }

            
            paciente = await RegistroAdmision.PacientesSeleccionarPorId(idPaciente)

            let IdProductoIngreso
            if ($('#hdIdTipoServicio').val() == 2) {
                let consultaEmergencia = await Utilitario.SeleccionarParametro(22)
                IdProductoIngreso = consultaEmergencia.valorInt
            } else if ($('#hdIdTipoServicio').val() == 3) {
                //let consultaEmergencia = await Utilitario.SeleccionarParametro(22)
                //IdProductoIngreso = consultaEmergencia.valorInt
            }
            
             
            if (RegistroAdmision.opcion == 'E') {
                idEstadoAtencion = 0
            }
            let cuentasAtencion = await RegistroAdmision.CrearModificarCuentasAtenciones(RegistroAdmision.IdCuentaAtencion, RegistroAdmision.IdAtencion, paciente.idPaciente, idEstadoAtencion)

            RegistroAdmision.IdAtencion = cuentasAtencion.value.idAtencion
            RegistroAdmision.IdCuentaAtencion = cuentasAtencion.value.idCuentaAtencion
            RegistroAdmision.IdPaciente = paciente.idPaciente

            if (RegistroAdmision.IdAtencion > 0 && RegistroAdmision.IdCuentaAtencion > 0) {
                if ($('#hdIdTipoServicio').val() == 2 && (RegistroAdmision.opcion == 'A' || RegistroAdmision.opcion == 'M')) {
                    
                    let atencionesEmergenciaAgregar = await RegistroAdmision.AtencionesEmergenciaAgregar(RegistroAdmision.IdAtencion)

                    if (RegistroAdmision.opcion == 'A') {

                        insertFactCatalogo = await RegistroAdmision.InsertFactCatalogo(RegistroAdmision.IdCuentaAtencion, paciente.idPaciente, IdProductoIngreso)
                    }

                }

                if (RegistroAdmision.opcion == 'A') {
                    let msg
                    if (typeof insertFactCatalogo != undefined) {
                        msg = `
                         <b>La admisión se agregó con exito: </b>
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 16px; font-weight: bold;">
                            <tbody>
                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Historia</th>
                                <td style="text-align: left !important;"> ${paciente.nroHistoriaClinica}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Paciente</th>
                                <td style="text-align: left !important;"> ${paciente?.apellidoPaterno} ${paciente?.apellidoMaterno} ${paciente?.primerNombre}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Cuenta</th>
                                <td style="text-align: left !important;"> ${RegistroAdmision.IdCuentaAtencion}</td>
                            </tr>
                            </tbody>
                        </table>`
                    } else {
                        msg = `
                         <b>La admisión se agregó con exito: </b>
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 16px; font-weight: bold;">
                            <tbody>
                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Historia</th>
                                <td style="text-align: left !important;"> ${paciente.nroHistoriaClinica}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Paciente</th>
                                <td style="text-align: left !important;"> ${paciente?.apellidoPaterno} ${paciente?.apellidoMaterno} ${paciente?.primerNombre}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Cuenta</th>
                                <td style="text-align: left !important;"> ${RegistroAdmision.IdCuentaAtencion}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Orden Pago</th>
                                <td style="text-align: left !important;"> ${insertFactCatalogo?.ordenPago}</td>
                            </tr>
                            </tbody>
                        </table>`
                    }

                    alerta2('success', 'Atención', msg)
                    $('#btnRegistrarAdmision').prop('disabled', true)
                    $('#btnBuscarDatosPaciente').prop('disabled', true)
                    $('#btnLimpiarDatosPaciente').prop('disabled', true)

                    $('#btnImprimeHojaFiliacionConsultorio').prop('disabled', false)
                    $('#btnImprimirTicket').prop('disabled', false)
                    $('#ImprimeFormatoFiliacionArchivoClinico').prop('disabled', false)
                    $('#txtNroDerivacion').prop('disabled', true)
                    //$('#modalAdmision').modal('hide')
                } else if (RegistroAdmision.opcion == 'M') {
                    let msg = `
                        <b>La admisión se modificó con exito: </b>
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 16px; font-weight: bold;">
                            <tbody>
                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Historia</th>
                                <td style="text-align: left !important;"> ${paciente.nroHistoriaClinica}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Paciente</th>
                                <td style="text-align: left !important;"> ${paciente?.apellidoPaterno} ${paciente?.apellidoMaterno} ${paciente?.primerNombre}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Cuenta</th>
                                <td style="text-align: left !important;"> ${RegistroAdmision.IdCuentaAtencion}</td>
                            </tr>
                            </tbody>
                        </table>`
                    alerta2('success', 'Atención', msg)

                    //$('#modalAdmision').modal('hide')
                } else if (RegistroAdmision.opcion == 'E') {
                    let msg = `
                        <b>Se anulo la admisión: </b>
                        <table class="table table-bordered mt-1 mb-1" style="font-size: 16px; font-weight: bold;">
                            <tbody>
                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Historia</th>
                                <td style="text-align: left !important;"> ${paciente.nroHistoriaClinica}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Paciente</th>
                                <td style="text-align: left !important;"> ${paciente?.apellidoPaterno} ${paciente?.apellidoMaterno} ${paciente?.primerNombre}</td>
                            </tr>

                            <tr>
                                <th style="width: 30%; background: #f0f0f0; text-align: left; !important">N° Cuenta</th>
                                <td style="text-align: left !important;"> ${RegistroAdmision.IdCuentaAtencion}</td>
                            </tr>
                            </tbody>
                        </table>`
                    alerta2('info', 'Atención', msg)

                    $('#btnLimpiarDatosPaciente').prop('disabled', true)
                    $('#modalAdmision').modal('hide')
                    $('#btnBuscarAtencionesEmergencia').click()
                }

            }

        }

    },

    CargarDatosDerivacion: function (derivacion) {
        if (isEmpty(derivacion)) {
            alerta2('warning', 'Atención', 'El Número de Derivación no existe')
            return
        }

        if (derivacion.idAtencion > 0) {
            alerta2('warning', 'Atención', 'El Número de Derivación ya fue utilizado')
            return
        }

        swal({
            title: 'Atención',
            text: `EL Número de Derivación (${derivacion.idDerivacion}) pertenece a: ${derivacion.nombresCompletos}`,
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async function () {

            RegistroAdmision.DesbloquearDerivacion()

            RegistroAdmision.IdEspecialidad = derivacion.idEspecialidad
            $('#hdIdServicioIngresoAdmision').val(derivacion.idServicio)
            $('#txtServicioIngresoAdmision').val(derivacion.idCodigoServicio + ' - ' + derivacion.nombreServicio)
            $('#hdIdMedicoIngreso').val(derivacion.idMedico)
            $('#hdIdEspecialidadMedicoIngreso').val(derivacion.idEspecialidad)
            $('#txtMedicoIngreso').val(derivacion.nombreMedico)
            $('#cboGravedadAdmision').val(derivacion.idGravedad)

            $('.chzn-select').chosen().trigger("chosen:updated");

        }).catch(swal.noop);

        console.log('derivacion', derivacion)
    },

    RetornaConsumoFarmaciaServiciosPorNroCuenta: async function (idCuenta) {
        let consumoServicio = await RegistroAdmision.RetornaConsumoPacienteServiciosConSeguroPorNroCuenta(idCuenta, false)
        let consumoFarmacia = await RegistroAdmision.FarmaciaFinanciamientosPorNroCuenta(idCuenta)
        let pagosAdelantados = await RegistroAdmision.CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta(idCuenta, 245)

        return consumoServicio + consumoFarmacia + pagosAdelantados
    },

    CuentaAtencionPendientePagoSeguros: async function (idCuentaAtencion, idPaciente, esConsultaExterna) {

        let limpiarCamas = await RegistroAdmision.CamasLimpiaIdPaciente(idPaciente)
        let totalDeuda = await RegistroAdmision.RetornaConsumoFarmaciaServiciosPorNroCuenta(idCuentaAtencion)
        let pendientePagoSeguro = await RegistroAdmision.FacturacionCuentasAtencionPendientePagoSeguro(idCuentaAtencion, getCurrentHour(), totalDeuda)
    },
    CuentaAtencionCerradoAutomatico: async function (idCuentaAtencion, idPaciente, esConsultaExterna) {

        let limpiarCamas = await RegistroAdmision.CamasLimpiaIdPaciente(idPaciente)
        let pendientePagoSeguro = await RegistroAdmision.FacturacionCuentasAtencionCerradoAutomatico(idCuentaAtencion, getCurrentHour())
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
                alerta(3, 'Error: ' + e)
            })

    },
    CompletarDatosAfiliacion: async function () {

        let response

        if ($('#txtDniBusqueda').val() != '') {

            let tipoDoc = $('#txtDniBusqueda').val().length == 8 ? 1 : 3

            response = await RegistroAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = tipoDoc, strNroDocumento = $('#txtDniBusqueda').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        } else {

            if ($('#txtTipo').val().trim() == 3) {
                response = await RegistroAdmision.ConsultarAfiliadoFuaE(
                    intOpcion = '1', strTipoDocumento = '3', strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                    strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
            } else {
                response = await RegistroAdmision.ConsultarAfiliadoFuaE(
                    intOpcion = '2', strTipoDocumento = $('#txtTipo').val().trim(), strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                    strDisa = $('#txtDisa').val().trim(), strTipoFormato = $('#txtTipo').val().trim(), strNroContrato = $('#txtNroAfiliacion').val().trim(), strCorrelativo = '1')
            }
        }

        if (response.data.idError == '0') {

            let data = response.data

            //let dataSet = [
            //    data.apePaterno, data.apeMaterno, data.nombres, '', data.fecNacimiento.substr(6, 2) + '/' + data.fecNacimiento.substr(4, 2) + '/' + data.fecNacimiento.substr(0, 4),
            //    data.disa + '-' + data.contrato, 0, '', data.nroDocumento, (data.genero == '1' ? '1' : '2'), data.idUbigeo, data.disa, data.tipoFormato, data.nroContrato, '',
            //    data.tabla, data.idNumReg, '', data.eess, data.fecAfiliacion.substr(6, 2) + '/' + data.fecAfiliacion.substr(4, 2) + '/' + data.fecAfiliacion.substr(0, 4),
            //    data.tipoDocumento

            //]

            data.snombre = ''
            data.fBajaOK = ''
            data.motivoBaja = ''

            oTable_busquedaSis.fnClearTable()
            oTable_busquedaSis.fnAddData(data)

            $('#modalBusquedaSis').modal('show')
        } else {
            swal({
                title: 'Atención',
                text: response.data.resultado,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            })
            Cargando(0)
        }
    },

    //========KHOYOSI 29032026======================================================================================================
    ConsultarAfiliadoIAFAS: async function (strNroDocumento) {

        let formData = new FormData();

        formData.append("nroDocumento", strNroDocumento)

        return HttpClient.Post('/MicroServicios/ConsultarAfiliadoIAFAS', formData)
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
                alerta(3, 'Error: ' + e)
            })

    },

    ConsultarAfiliadoPN: async function (strNroDocumento) {

        let formData = new FormData();

        formData.append("nroDocumento", strNroDocumento)

        return HttpClient.Post('/Paciente/SelectBuscarFuentePorDNI?comun=ConsultaExterna', formData)
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
                alerta(3, 'Error: ' + e)
            })

    },

    async CompletarDatosAfiliacionIAFAS() {

        let response
        let dni = $('#txtDniBusqueda').val()
        
        response = await RegistroAdmision.ConsultarAfiliadoIAFAS($('#txtDniBusqueda').val().trim());

        function separarNombreCompleto(paciente) {
            if (!paciente) return null;

            const partes = paciente.trim().split(/\s+/);

            let apellidoPaterno = "";
            let apellidoMaterno = "";
            let nombres = "";

            if (partes.length >= 2) {
                apellidoPaterno = partes[0];
                apellidoMaterno = partes[1];
                nombres = partes.slice(2).join(" ");
            } else if (partes.length === 1) {
                nombres = partes[0];
            }

            return {
                apellidoPaterno,
                apellidoMaterno,
                nombres
            };
        }
        response.data = JSON.parse(response.data);

        if (response.data.CodigoResult == '00') {
            console.log('response', response)

            let data = response.data.AfiliadosIafas[0];
            let dataNombres = separarNombreCompleto(data.PACIENTE);

            let dataSet = [
                dataNombres.apellidoPaterno,
                dataNombres.apellidoMaterno,
                dataNombres.nombres,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                1
            ]

            oTable_busquedaSis.fnClearTable()
            oTable_busquedaSis.fnAddData(dataSet)

            $('#modalBusquedaSis').modal('show')
        } else {
            swal({
                title: 'Cuidado',
                text: response.data.resultado,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            })
            Cargando(0)
        }



    },

     async CompletarDatosAfiliacionPN () {

        let response
         let dni = $('#txtDniBusqueda').val()

         response = await CitasAdmision.ConsultarAfiliadoPN($('#txtDniBusqueda').val().trim());

        function separarNombreCompleto(paciente) {
            if (!paciente) return null;

            const partes = paciente.trim().split(/\s+/);

            let apellidoPaterno = "";
            let apellidoMaterno = "";
            let nombres = "";

            if (partes.length >= 2) {
                apellidoPaterno = partes[0];
                apellidoMaterno = partes[1];
                nombres = partes.slice(2).join(" ");
            } else if (partes.length === 1) {
                nombres = partes[0];
            }

            return {
                apellidoPaterno,
                apellidoMaterno,
                nombres
            };
        }
        response.data = JSON.parse(response.data);

        if (response.data.CodigoResult == '00') {
            console.log('response', response)

            let data = response.data.AfiliadosIafas[0];
            let dataNombres = separarNombreCompleto(data.PACIENTE);

            let dataSet = [
                dataNombres.apellidoPaterno,
                dataNombres.apellidoMaterno,
                dataNombres.nombres,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                1
            ]

            oTable_busquedaSis.fnClearTable()
            oTable_busquedaSis.fnAddData(dataSet)

            $('#modalBusquedaSis').modal('show')
        } else {
            swal({
                title: 'Cuidado',
                text: response.data.resultado,
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true
            })
            Cargando(0)
        }



    },
    //==============================================================================================================================
    

    CargarDatosAtencion: async function (idAtencion) {

        let atencion = await RegistroAdmision.AtencionesSeleccionarPorId(idAtencion)

        console.log('atencion', atencion)

        if (RegistroAdmision.opcion == 'M' || RegistroAdmision.opcion == 'E') {
            if (atencion.idEstadoAtencion != 1) {
                alerta2('info', 'Atención', `No se puede abrir la atencion Estado: ${atencion.estadosAtencion}`);
                return false
            }

            if (!isEmpty(atencion.fechaEgreso)) {
                alerta2('info', 'Atención', `El paciente tiene alta`);
                return false
            }
        }

        if (RegistroAdmision.opcion == 'E') {
            let aceptaEliminar = await alertaAsync('question', 'Atención', `¿Esta seguro de eliminar la atención?`);

            if (typeof aceptaEliminar == undefined) {
                return false
            }
        }

        RegistroAdmision.IdAtencion = atencion.idAtencion
        RegistroAdmision.IdCuentaAtencion = atencion.idCuentaAtencion
        RegistroAdmision.IdPaciente = atencion.idPaciente
        RegistroAdmision.IdCamaIngreso = atencion.idCamaIngreso

        await RegistroAdmision.TiposFinanciamientosTarifaSeleccionarPorPlan(atencion.idFuenteFinanciamiento)
        await RegistroAdmision.ListarCamas(atencion.idServicioIngreso)

        await Diagnosticos.SeleccionarDiagnosticos(atencion.idAtencion, 2) // Hospitalizacion Ingreso

        $('#cboTipoOrigenAdmision').val(atencion.idOrigenAtencion)
        $('#hdIdMedicoIngreso').val(atencion.idMedicoIngreso)
        $('#txtMedicoIngreso').val(atencion.medicoIngreso)
        $('#hdIdServicioIngresoAdmision').val(atencion.idServicioIngreso)
        $('#txtServicioIngresoAdmision').val(atencion.codigoServicioIngreso + ' - ' + atencion.servicioIngreso)
        $("#txtFechaIngresoAdmision").datepicker("setDate", FormatearFecha(atencion.fechaIngreso));
        $('#txtHoraIngresoAdmision').val(atencion.horaIngreso)

        $('#txtEdadAdmision').val(atencion.edad)
        $('#cboTipoEdadAdmision').val(atencion.idTipoEdad)
        $('#cboGravedadAdmision').val(atencion.idTipoGravedad)
        $('#cboCamaIngresoAdmision').val(atencion.idCamaIngreso)

        $('#cboFuenteFinanciamientoAdmision').val(atencion.idFuenteFinanciamiento)
        $('#cboProductoPlanAdmision').val(atencion.idFormaPago)

        $('#txtNroCuentaPaciente').val(atencion.idCuentaAtencion)
        //$('#txtOrdenPagoPaciente').val(atencion.horaIngreso)
        $('#txtidAtencion').val(atencion.idAtencion)
        $('#txtNombreAcompanianteAdmision').val(atencion.nombreAcompaniante)
        $('#txtTelefonoAcompanianteAdmision').val(atencion.telefonoAcompaniante)

        $('#cboTipoReferenciaAdmision').val(atencion.idTipoReferenciaOrigen)
        $('#hdIdEstablecimientoReferenciaOrigen').val(atencion.idEstablecimientoOrigen)
        $('#txtCodigoReferenciaAdmision').val(atencion.codigoEstablecimientoOrigen)
        $('#txtDescripcionReferenciaAdmision').val(atencion.establecimientoOrigen)
        $('#txtNroReferenciaAdmision').val(atencion.nroReferenciaOrigen)
        $('#cboCodPrestacion').val(atencion.fuaCodigoPrestacion)

        $('#cboCausaExternaMorbilidadAdmision').val(atencion.idCausaExternaMorbilidad)
        $('#cboLugarEventoAdmision').val(atencion.idLugarEvento)
        $('#cboTipoEventoAdmision').val(atencion.idTipoEvento)
        $('#cboSeguridadAdmision').val(atencion.idSeguridad)
        $('#cboRelacionAgresorVictimaAdmision').val(atencion.idRelacionAgresorVictima)
        $('#cboClaseAccidenteAdmision').val(atencion.idClaseAccidente)
        $('#cboTipoVehiculoAdmision').val(atencion.idTipoVehiculo)
        $('#cboTipoTransporteAdmision').val(atencion.idTipoTransporte)
        $('#cboUbicacionLesionadoAdmision').val(atencion.idUbicacionLesionado)
        $('#cboPosicionLesionadoAlabAdmision').val(atencion.idPosicionLesionadoALAB)
        $('#cboGrupoOcupacionalAlabAdmision').val(atencion.idGrupoOcupacionalALAB)
        $('#cboTipoAgenteAganAdmision').val(atencion.idTipoAgenteAGAN)


        RegistroAdmision.MostrarBoletaCodiogPrestPorTipoFuenteFinanciamiento(atencion.idFuenteFinanciamiento)

        RegistroAdmision.DesbloquearAtencion()
        RegistroAdmision.DesbloquearCausasMorbilidad()

        $('#cboTipoOrigenAdmision').trigger('change')

        $('.chzn-select').chosen().trigger("chosen:updated")

        return true

        //$('.chzn-select').chosen().trigger("chosen:updated")
    },

    ValidarRnEnHospital: async function (idPaciente) {

        let paciente = await RegistroAdmision.PacientesSeleccionarPorId(idPaciente)

        let codigoOrigen = $('#cboTipoOrigenAdmision option:selected').attr('codigo')
        let codigoTipoDocumento = $('#cboTipoDocPaciente').val()

        let fechaCreacion = FormatearFecha(paciente.fechaCreacionHistoria)
        let fechaNacimiento = FormatearFecha(paciente.fechaNacimiento)

        let resultado = true

        // Si el tipo de servicio es 3 -> Hospitalización
        if ($('#hdIdTipoServicio').val() == 3 && (codigoOrigen == 'J' || codigoOrigen == 'N')) {

            if (fechaCreacion.trim() !== fechaNacimiento.trim()) {
                try {
                    resultado = await alertaAsync('question', 'Atención', `la fecha de nacimiento es diferente a la fecha de creación ¿Desea Continuar?`)
                } catch (e) {
                    console.log('Accion de usuario: No se permite continuar', e)
                    return false
                }
            }


            if (codigoTipoDocumento != 7) {
                try {
                    resultado = await alertaAsync('question', 'Atención', `El documento de un recien nacido en el hospital debe ser C.I.U ¿Desea Continuar?`)
                } catch (e) {
                    console.log('Accion de usuario: No se permite continuar', e)
                    return false
                }
            }
        }
        return resultado
    },

    ValidarDatosObligatorios: async function (idTipoServicio) {
        let codigoIpress = await Utilitario.SeleccionarParametro(208)
        let tipoOrigenAdmision = idTipoServicio == '1' ? '12' : idTipoServicio == '2' ? '21' : '33'


        if ($('#hdIdTipoServicio').val() == 2) {
            if (RegistroAdmision.opcion == 'A' && $('#txtNroDerivacion').val() == '') {
                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                $('#txtNroDerivacion').focus()
                alerta2('warning', 'Atención', 'Por favor ingrese un Numero de Derivacion');
                return false
            }
        }

        //------------------------ VALIDA CODIGO PRESTACIONAL SI ES SIS
        if (RegistroAdmision.opcion == 'A') {
            if (isEmpty($('#cboCodPrestacion').val()) && $('#cboFuenteFinanciamientoAdmision').val() == 3) {
                alerta2('info', 'Atención', "Seleccione Cod. Prestación (SIS)")
                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                return false
            }
        }


        //------------------------ VALIDA DATOS DE LA CUENTA DE ATENCION
        if ($('#txtMedicoIngreso').val() == '') {
            alerta2('info', 'Atención', "Ingrese el médico de ingreso")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if (isEmpty($('#cboProductoPlanAdmision').val())) {
            alerta2('info', 'Atención', "Elija el Plan de Atención")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }

        //------------------------ VALIDA DATOS DE LA ATENCION

        //if ( $('#hdIdTipoServicio').val() != 3 && codigoIpress.valorTexto != $('#hdCodigoEstablAdscripcion').val().substr(3, 5) && $('#cboFuenteFinanciamientoAdmision').val() == 3 && $('#hdIdEstablecimientoReferenciaOrigen').val() == '' && RegistroAdmision.opcion == 'A') {
        //    alerta2('info', 'SIS', 'La afiliacion es de otro establecimiento se registrara como una referencia')

        //    let establecimiento = await RegistroAdmision.ListaEstablecimientosByCodigo($('#hdCodigoEstablAdscripcion').val().substr(3, 5))

        //    console.log('establecimiento', establecimiento)

        //    $('#hdIdEstablecimientoReferenciaOrigen').val(establecimiento.idEstablecimiento)
        //    $('#txtCodigoReferenciaAdmision').val(establecimiento.codigo)
        //    $('#txtDescripcionReferenciaAdmision').val(establecimiento.nombre)

        //    if ($('#hdIdTipoServicio').val() == 1) {
        //        $('#cboTipoOrigenAdmision').val(12)
        //    } else if ($('#hdIdTipoServicio').val() == 2) {
        //        $('#cboTipoOrigenAdmision').val(21)
        //    } else if ($('#hdIdTipoServicio').val() == 3) {
        //        $('#cboTipoOrigenAdmision').val(33)
        //    }


        //    $('#cboTipoReferenciaAdmision').val(1)

        //    $('.chzn-select').chosen().trigger("chosen:updated")
        //    $('#cboTipoReferenciaAdmision').trigger('change')
        //    $('#cboTipoOrigenAdmision').trigger('change')
        //    return false
        //}

        if (isEmpty($('#cboTipoOrigenAdmision').val())) {
            alerta2('info', 'Atención', "Ingrese el valor de origen")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if ($('#txtServicioIngresoAdmision').val() == '') {
            alerta2('info', 'Atención', "Ingrese el valor del servicio de ingreso")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if ($('#txtHoraIngresoAdmision').val() == '') {
            alerta2('info', 'Atención', "Ingrese el valor de Hora de Ingreso")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if ($('#txtFechaIngresoAdmision').val() == '') {
            alerta2('info', 'Atención', "Ingrese el valor de la Fecha de Ingreso")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if (isEmpty($('#cboTipoServicioAdmision').val())) {
            alerta2('info', 'Atención', "Ingrese el valor del tipo de servicio")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if ($('#txtEdadAdmision').val() == '') {
            alerta2('info', 'Atención', "Ingrese el valor de la edad")
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        //if (isEmpty(('#cboTipoServicioAdmision').val())) {
        //    alerta2('info', 'Atención', "Ingrese el valor del origen")
        //    $('.nav-tabs a[href="#tabAtencion"]').tab('show');
        //    return false
        //}
        if (RegistroAdmision.opcion == 'M') {
            if ($('#contLlegoAlServicio').is(':visible')) {
                if (!$('#chkLlegoAlServicio').is(':checked')) {
                    alerta2('info', 'Atención', 'Por favor seleccione llegó al Servicio Ingreso')
                    return false
                }
            }

            if ($('#contCamaIngreso').is(':visible')) {
                if ($('#txtCamaIngresoAdmision').val() == '') {
                    alerta2('info', 'Atención', 'Por favor asigne la Cama')
                    return false
                }
            }
        }

        if (idTipoServicio == 1) { // Consulta Externa
            if ($('#cboTipoOrigenCita').val() == tipoOrigenAdmision && $('#txtNroReferenciaCita').val() == '') {
                alerta2('info', 'Atención', 'EL numero de referencia es obligatorio')
                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                $('#txtNroReferenciaCita').focus()
                return false
            }
        }



        if (idTipoServicio == 2) {
            //if (isEmpty($('#cboCausaExternaMorbilidadAdmision').val())) {
            //    alerta2('info', 'Atención', 'Por favor elija Causa Externa de Morbilidad')
            //    $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            //    return false
            //}

            if (isEmpty($('#cboGravedadAdmision').val())) {
                alerta2('info', 'Atención', 'Por favor seleccione la gravedad')
                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                return false
            }
        }

        return true
    },
    ValidaEdadMaximaYSexoSegunServicioHosp: async function (lnEdad, lnTipoEdad, lnTipoSexo, lnIdServicioHospital) {
        let lnEdadEnDias = 0;

        // Calcular edad en días según tipo de edad
        switch (lnTipoEdad) {
            case 1: // Años
                lnEdadEnDias = 365 * lnEdad;
                break;
            case 2: // Meses
                lnEdadEnDias = 30 * lnEdad;
                break;
            case 3: // Días
                lnEdadEnDias = lnEdad;
                break;
            default: // Horas
                lnEdadEnDias = 1;
                break;
        }

        try {
            // Obtener servicio por ID
            let servicio = await RegistroAdmision.SeleccionarServicioById(lnIdServicioHospital);

            if (!servicio || servicio.length === 0) {
                //alert("No existe el SERVICIO DEL HOSPITAL");
                alerta2('warning', 'Atención', 'Por favor selecciona un servicio de origen');
                return false;
            }

            let { edadValida, mensaje } = RegistroAdmision.DevuelveRangoEdadesDiaMesAnio($('#txtEdadAdmision').val(), $('#cboTipoEdadAdmision').val(), servicio.minimaEdad, servicio.maximaEdad)

            let lcMensaje1 = `Para el Servicio: ${servicio.nombre}\n${mensaje}`;

            // Validar edad dentro del rango permitido
            if (!edadValida) {
                alerta2('warning', 'Atención', lcMensaje1);
                return false;
            }

            // Validar sexo si aplica
            if (servicio.soloTipoSexo !== 3) {
                if (servicio.soloTipoSexo && servicio.soloTipoSexo != lnTipoSexo) {
                    alerta2('warning', 'Atención', `Para el Servicio: ${servicio.nombre}\nSolo acepta Pacientes con Sexo: ${servicio.soloTipoSexo === 1 ? "Masculino" : "Femenino"}`);
                    return false;
                }
            }

            return true; // Si pasa todas las validaciones
        } catch (error) {
            console.error("Error en la validación:", error);
            return false;
        }
    },

    ValidarReglas: async function () {


        let lIdDxIngreso = ObjtableDiagnosticosIngreso.api(true).data().toArray()

        let validaEdadMaximaYSexoSegunServicioHosp = await RegistroAdmision.ValidaEdadMaximaYSexoSegunServicioHosp($('#txtEdadAdmision').val(), $('#cboTipoEdadAdmision').val(), $('#cboSexoPaciente').val(), $('#hdIdServicioIngresoAdmision').val())

        if (!validaEdadMaximaYSexoSegunServicioHosp) {
            return false
        }

        // Si el tipo de servicio es 3 -> Hospitalización
        if ($('#hdIdTipoServicio').val() == 3) {
            if (RegistroAdmision.opcion == 'M' && $('#contLlegoAlServicio').is(':visible') && lIdDxIngreso.length == 0) {
                alerta2('warning', 'Atención', 'Por favor asigne el Diagnóstico de INGRESO');
                return false
            }
        }

        // Si el tipo de servicio es 2 -> Emergencia
        if ($('#hdIdTipoServicio').val() == 2) {
            if ($('#txtNombreAcompanianteAdmision').val() == '') {
                alerta2('warning', 'Atención', 'Por favor ingrese el nombre de algun acompañante');

                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                $('#txtNombreAcompanianteAdmision').focus()
                return false
            }

            if ($('#txtTelefonoAcompanianteAdmision').val() == '') {
                alerta2('warning', 'Atención', 'Por favor ingrese el teléfono o celular del acompañante');

                $('.nav-tabs a[href="#tabAtencion"]').tab('show');
                $('#txtTelefonoAcompanianteAdmision').focus()
                return false
            }
        }

        let wxParametro302 = await Utilitario.SeleccionarParametro(302)
        
        if (wxParametro302.valorTexto == 'S' && $('#cboFuenteFinanciamientoAdmision').val() == 3 && RegistroAdmision.opcion == 'E') {
            const sisFua = await Utilitario.SisFuaAtencionSeleccionarPorId(RegistroAdmision.IdCuentaAtencion);

            if (typeof sisFua != 'undefined') {
                alerta2('info', 'Atención', `El formato FUA ya fué generado: ${sisFua.fuaDisa} - ${sisFua.fuaLote} - ${sisFua.fuaNumero} Debe eliminar el formato FUA (módulo: SIS, opción: Formato FUA)`)
                return false
            }
        }

        if (RegistroAdmision.opcion == 'M' || RegistroAdmision.opcion == 'E') {
            let lstAtencionCe = await RegistroAdmision.AtencionesCESeleccionarPorId(RegistroAdmision.IdAtencion)

            if (!isEmpty(lstAtencionCe) && lstAtencionCe.length > 0) {
                let objAtencionCe = lstAtencionCe[0]

                if (!isEmpty(objAtencionCe.citaDiagMed) && objAtencionCe.citaDiagMed.trim().length > 0) {
                    if (RegistroAdmision.opcion == 'E') {
                        alerta2('info', 'Atención', `No puede Eliminar la Cita, la Atención ya fue registrada. Revise el registro de atenciones.`)
                    }

                    if (RegistroAdmision.opcion == 'M') {
                        alerta2('info', 'Atención', `No puede Modificar la Cita, la Atención ya fue registrada. Revise el registro de atenciones.`)
                    }

                    return false
                } else {
                    if (!isEmpty(objAtencionCe.triajeFecha)) {
                        if (RegistroAdmision.opcion == 'E') {
                            alerta2('info', 'Atención', `No puede Eliminar la Cita, el paciente ya paso por Triaje.`)
                        }

                        if (RegistroAdmision.opcion == 'M') {
                            alerta2('info', 'Atención', `No puede Modificar la Cita, el paciente ya paso por Triaje.`)
                        }

                        return false
                    }
                }
            }
        }


        return true
    },
    DevuelveRangoEdadesDiaMesAnio: function (edad, tipoEdad, lnMinEdad, lnMaxEdad) {

        let edadValida = false

        let minDias = parseInt(lnMinEdad, 10) || 0;
        let maxDias = parseInt(lnMaxEdad, 10) || 0;

        let minMeses = Math.round(minDias / 30);
        let maxMeses = Math.round(maxDias / 30);

        let minAnios = Math.round(minDias / 365);
        let maxAnios = Math.round(maxDias / 365);


        if (tipoEdad == 1) {
            if (edad >= minAnios && edad <= maxAnios) {
                edadValida = true
            }
        } else if (tipoEdad == 2) {
            if (edad >= minMeses && edad <= maxMeses) {
                edadValida = true
            }
        } else if (tipoEdad == 3) {
            if (edad >= minDias && edad <= maxDias) {
                edadValida = true
            }
        } else {
            edadValida = false
        }

        let mensaje = `La Edad es entre: ${minDias} y ${maxDias} días`;
        mensaje += ` (en meses: ${minMeses}, ${maxMeses})`;
        mensaje += ` (en años: ${minAnios}, ${maxAnios})`;

        return { edadValida, mensaje };
    },
    
    EdadActualEnFormatoYYYYMMDD: function (fechaNacimiento, fechaActual) {
        const [dN, mN, yN] = fechaNacimiento.split('/').map(Number);
        const [dA, mA, yA] = fechaActual.split('/').map(Number);

        let años = yA - yN;
        let meses = mA - mN;
        let dias = dA - dN;

        if (dias < 0) {
            meses--;
            const ultimoMes = new Date(yA, mA + 1, 0); // días del mes anterior
            dias += ultimoMes.getDate();
        }

        if (meses < 0) {
            años--;
            meses += 12;
        }

        return `${años.toString().padStart(4, '0')}${meses.toString().padStart(2, '0')}${dias.toString().padStart(2, '0')}`;
    },
    LimpiarCamposPaciente: function () {

        RegistroPaciente.IdPaciente = 0

        $('#txtUsuarioCrea').val('')
        $('#txtUsuarioModifica').val('')

        $('#txtNroCuentaPaciente').val('')
        $('#txtidAtencion').val('')

        $('#txtDni').val('')
        $('#txtNroHistoria').val('')
        $('#txtApellidoPaterno').val('')
        $('#txtApellidoMaterno').val('')
        $('#txtPrimerNombre').val('')
        $('#txtSegundoNombre').val('')
        $('#txtDisa').val('')
        $('#txtTipo').val('')
        $('#txtNroAfiliacion').val('')

        $(`#cboTipoDocPaciente`).val(0)
        $('#txtDniPaciente').val('')
        $('#txtNroHistoriaPaciente').val('')
        $('#txtFechaCreacionPaciente').val('')

        $('#txtApellidoPaternoPaciente').val('')
        $('#txtApellidoMaternoPaciente').val('')
        $('#txtPrimerNombrePaciente').val('')
        $('#txtSegundoNombrePaciente').val('')
        $('#txtTercerNombrePaciente').val('')
        $('#txtIdPaciente').val('')

        $('#txtPacienteFechaNacimiento').val('')
        $('#txtHoraNacimientoPaciente').val('00:00')
        $('#txtEdadPaciente').val('')
        $(`#cboTipoEdadPaciente`).val(0)
        $('#txtEsNroHijoPaciente').val('')
        $(`#cboSexoPaciente`).val(0)
        $(`#cboEstadoCivilPaciente`).val(2)
        $(`#cboEtniaPaciente`).val(0)

        $(`#cboIdiomaMaternoPaciente`).val(0)
        $(`#cboGradoInstruccionPaciente`).val(0)
        $(`#cboOcupacionPaciente`).val(142)
        $(`#cboProcedenciaPaciente`).val(4)
        $(`#cboReligionPaciente`).val(4)

        $('#txtTelefonoPaciente').val('')
        $('#txtEmailPaciente').val('')
        $('#txtNombrePadrePaciente').val('')
        $('#txtObservacionPaciente').val('')


        $(`#cboTipoDocMadre`).val(0)
        $('#txtNroDocMadre').val('')
        $('#txtApellidoPaternoMadre').val('')
        $('#txtApellidoMaternoMadre').val('')
        $('#txtPrimerNombreMadre').val('')
        $('#txtSegundoNombreMadre').val('')


        //$(`#cboDepartamentoDomicilio`).val(15)
        $('#cboProvinciaDomicilio').empty();
        $('#cboDistritoDomicilio').empty();
        //$(`#cboDepartamentoDomicilio`).trigger('change')
        $(`#cboProvinciaDomicilio`).trigger('change')
        $(`#cboDistritoDomicilio`).trigger('change')
        $(`#cboPaisDomicilio`).val(166)
        $('#txtDireccionDomicilio').val('')

        $(`#cboDepartamentoProcedencia`).val(0)
        $('#cboProvinciaProcedencia').empty();
        $('#cboDistritoProcedencia').empty();
        $(`#cboDepartamentoProcedencia`).trigger('change')
        $(`#cboProvinciaProcedencia`).trigger('change')
        $(`#cboDistritoProcedencia`).trigger('change')
        $(`#cboPaisProcedencia`).val(166)

        $(`#cboDepartamentoNacimiento`).val(0)
        $('#cboProvinciaNacimiento').empty();
        $('#cboDistritoNacimiento').empty();
        $(`#cboDepartamentoNacimiento`).trigger('change')
        $(`#cboProvinciaNacimiento`).trigger('change')
        $(`#cboDistritoNacimiento`).trigger('change')
        $(`#cboPaisNacimiento`).val(166)

        $(`#cboPaisDomicilio`).trigger('change')
        $(`#cboPaisProcedencia`).trigger('change')
        $(`#cboPaisNacimiento`).trigger('change')


        $('#cboTipoOrigenCita').val(10)
        $('#cboTipoOrigenCita').trigger('change')

        $('#cboFuenteFinanciamientoCita').val(0)
        $('#cboFuenteFinanciamientoCita').trigger('change')


        $('#txtIdReferenciaCita').val('')
        $('#txtDescripcionReferenciaCita').val('')
        $('#txtNroReferenciaCita').val('')


        $("#chbBusquedaSis").prop('checked', false)
        $("#chbPacienteNuevo").prop('checked', false)
        $("#chbBusquedaReniec").prop('checked', false)


        $("#txtDni").prop('disabled', false)
        $("#txtNroHistoria").prop('disabled', false)
        $("#txtApellidoPaterno").prop('disabled', false)
        $("#txtApellidoMaterno").prop('disabled', false)
        $("#txtPrimerNombre").prop('disabled', false)
        $("#txtSegundoNombre").prop('disabled', false)


        // Borrar Campos Ocultos
        $('#tipoPaciente').html("")
        $('#hdtipoCondicionPaciente').val('')


        $('#hdIdEstablecimientoReferenciaOrigen').val('')


        $('#hdIdSiaSis').val('')
        $('#hdCodigo').val('')
        $('#hdAfiliacionDisa').val('')
        $('#hdAfiliacionTipoFormato').val('')
        $('#hdAfiliacionNroFormato').val('')
        $('#hdAfiliacionNroIntegrante').val('')
        $('#hdDocumentoTipo').val('')
        $('#hdCodigoEstablAdscripcion').val('')
        $('#hdAfiliacionFecha').val('')
        $('#hdPaterno').val('')
        $('#hdMaterno').val('')
        $('#hdPnombre').val('')
        $('#hdOnombres').val('')
        $('#hdGenero').val('')
        $('#hdFnacimiento').val('')
        $('#hdIdDistritoDomicilio').val('')
        $('#hdEstado').val('')
        $('#hdFbaja').val('')
        $('#hdDocumentoNumero').val('')
        $('#hdMotivoBaja').val('')
        $('#hdtipoCondicionPaciente').val('')

        $('#hdIdOrden').val('')
        $('#hdIdOrdenPago').val('')

        //CitasAdmision.tipoAccion = 0
        // Borrar Campos Ocultos
        $('.chzn-select').chosen().trigger("chosen:updated")

    },

    LimpiarCamposAtencion: function () {

        RegistroAdmision.IdAtencion = 0
        RegistroAdmision.IdCuentaAtencion = 0
        RegistroAdmision.opcion = ''
        RegistroAdmision.IdEspecialidad = ''

        $('#chbBusquedaSis').prop('checked', false)
        $('#chbPacienteNuevo').prop('checked', false)
        $('#chbBusquedaReniec').prop('checked', false)

        $('#txtDniBusqueda').val('')
        $('#txtNroHistoriaBusqueda').val('')
        $('#txtApellidoPaternoBusqueda').val('')
        $('#txtApellidoMaternoBusqueda').val('')
        $('#txtPrimerNombreBusqueda').val('')
        $('#txtSegundoNombreBusqueda').val('')

        $('#cboTipoAfiliacion').val(0)
        $('#txtDisa').val('')
        $('#txtTipo').val('')
        $('#txtNroAfiliacion').val('')

        $('#cboCamaIngresoAdmision').empty()

        $('#txtNroDerivacion').val('')
        $('#cboTipoOrigenAdmision').val(0)
        $('#hdIdServicioIngresoAdmision').val('')
        $('#txtServicioIngresoAdmision').val('')
        $('#hdIdMedicoIngreso').val('')
        $('#txtMedicoIngreso').val('')
        $('#txtEdadAdmision').val('')
        $('#cboTipoEdadAdmision').val(0)
        $('#cboGravedadAdmision').val(0)
        $('#cboCamaIngresoAdmision').val(0)
        $('#cboFuenteFinanciamientoAdmision').val(0)
        $('#cboProductoPlanAdmision').val(0)
        $('#txtNroCuentaPaciente').val('')
        $('#txtOrdenPagoPaciente').val('')
        $('#txtidAtencion').val('')
        $('#txtNombreAcompanianteAdmision').val('')
        $('#txtTelefonoAcompanianteAdmision').val('')
        $('#cboTipoReferenciaAdmision').val(0)
        $('#hdIdEstablecimientoReferenciaOrigen').val('')
        $('#txtCodigoReferenciaAdmision').val('')
        $('#txtDescripcionReferenciaAdmision').val('')
        $('#txtNroReferenciaAdmision').val('')

        $('#btnRegistrarAdmision').prop('disabled', false)
        $('#btnBuscarDatosPaciente').prop('disabled', false)
        $('#btnLimpiarDatosPaciente').prop('disabled', false)
        $('#txtNroDerivacion').prop('disabled', false)

        $('#cboParentescoPaciente').val(0) //MGAMERO

        $('.chzn-select').chosen().trigger("chosen:updated")

    },
    BloquearDerivacion: async function () {

        $('#tabAtencion input').prop('disabled', true)
        $('#tabAtencion select').prop('disabled', true)
        $('#tabAtencion textarea').prop('disabled', true)
        $('#tabAtencion button').prop('disabled', true)

        $('#txtNroDerivacion').prop('disabled', false)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    DesbloquearDerivacion: async function () {

        $('#tabAtencion input').prop('disabled', false)
        $('#tabAtencion select').prop('disabled', false)
        $('#tabAtencion textarea').prop('disabled', false)
        $('#tabAtencion button').prop('disabled', false)

        $('#cboTipoServicioAdmision').prop('disabled', true)
        $('#txtServicioIngresoAdmision').prop('disabled', true)
        $('#txtMedicoIngreso').prop('disabled', true)

        $('#cboTipoReferenciaAdmision').prop('disabled', true)
        $('#txtCodigoReferenciaAdmision').prop('disabled', true)
        $('#btnOpenModalEstablecimientoReferenciaAdmision').prop('disabled', true)
        $('#txtDescripcionReferenciaAdmision').prop('disabled', true)
        $('#txtNroReferenciaAdmision').prop('disabled', true)

        $('#txtNroCuentaPaciente').prop('disabled', true)
        $('#txtOrdenPagoPaciente').prop('disabled', true)
        $('#txtidAtencion').prop('disabled', true)
        $('#txtIdNroBoleta').prop('disabled', true)
        $('#txtNroBoleta').prop('disabled', true)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    DesbloquearAtencion: async function () {

        $('#tabAtencion input').prop('disabled', false)
        $('#tabAtencion select').prop('disabled', false)
        $('#tabAtencion textarea').prop('disabled', false)
        $('#tabAtencion button').prop('disabled', false)

        $('#cboTipoServicioAdmision').prop('disabled', true)
        $('#txtServicioIngresoAdmision').prop('disabled', true)
        $('#txtMedicoIngreso').prop('disabled', true)

        $('#cboTipoReferenciaAdmision').prop('disabled', true)
        $('#txtCodigoReferenciaAdmision').prop('disabled', true)
        $('#btnOpenModalEstablecimientoReferenciaAdmision').prop('disabled', true)
        $('#txtDescripcionReferenciaAdmision').prop('disabled', true)
        $('#txtNroReferenciaAdmision').prop('disabled', true)
        $('#txtNroCuentaPaciente').prop('disabled', true)
        $('#txtOrdenPagoPaciente').prop('disabled', true)
        $('#txtidAtencion').prop('disabled', true)

        $('#txtEdadAdmision').prop('disabled', true)
        $('#cboTipoEdadAdmision').prop('disabled', true)

        if (RegistroAdmision.opcion == 'M') {
            $('#cboFuenteFinanciamientoAdmision').prop('disabled', true)
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCausasMorbilidad: async function () {

        let causaExternaMorbilidad = $('#cboCausaExternaMorbilidadAdmision').val()

        $('#cboLugarEventoAdmision').prop('disabled', true)
        $('#cboTipoEventoAdmision').prop('disabled', true)
        $('#cboSeguridadAdmision').prop('disabled', true)
        $('#cboRelacionAgresorVictimaAdmision').prop('disabled', true)
        $('#cboClaseAccidenteAdmision').prop('disabled', true)
        $('#cboTipoVehiculoAdmision').prop('disabled', true)
        $('#cboTipoTransporteAdmision').prop('disabled', true)
        $('#cboUbicacionLesionadoAdmision').prop('disabled', true)
        $('#cboPosicionLesionadoAlabAdmision').prop('disabled', true)
        $('#cboGrupoOcupacionalAlabAdmision').prop('disabled', true)
        $('#cboTipoAgenteAganAdmision').prop('disabled', true)

        switch (causaExternaMorbilidad) {
            case '1':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboRelacionAgresorVictimaAdmision').prop('disabled', false)
                break;
            case '2':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                $('#cboClaseAccidenteAdmision').prop('disabled', false)
                $('#cboTipoVehiculoAdmision').prop('disabled', false)
                $('#cboTipoTransporteAdmision').prop('disabled', false)
                $('#cboUbicacionLesionadoAdmision').prop('disabled', false)
                break;
            case '3':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                $('#cboClaseAccidenteAdmision').prop('disabled', false)
                $('#cboTipoVehiculoAdmision').prop('disabled', false)
                $('#cboTipoTransporteAdmision').prop('disabled', false)
                $('#cboUbicacionLesionadoAdmision').prop('disabled', false)
                break;
            case '4':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                break;
            case '5':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                $('#cboPosicionLesionadoAlabAdmision').prop('disabled', false)
                $('#cboGrupoOcupacionalAlabAdmision').prop('disabled', false)
                break;
            case '6':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                $('#cboTipoAgenteAganAdmision').prop('disabled', false)
                break;
            case '7':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                break;
            case '8':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                break;
            case '9':
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', false)
                break;
            case '10':
                $('#cboLugarEventoAdmision').prop('disabled', true)
                break;
            case '11':
                $('#cboLugarEventoAdmision').prop('disabled', true)
                break;
            case '12':
                $('#cboLugarEventoAdmision').prop('disabled', true)
                break;
            case '13':
                $('#cboLugarEventoAdmision').prop('disabled', true)
                break;
            default:
                $('#cboLugarEventoAdmision').prop('disabled', false)
                $('#cboTipoEventoAdmision').prop('disabled', false)
                $('#cboSeguridadAdmision').prop('disabled', true)
                $('#cboRelacionAgresorVictimaAdmision').prop('disabled', false)
                $('#cboClaseAccidenteAdmision').prop('disabled', true)
                $('#cboTipoVehiculoAdmision').prop('disabled', true)
                $('#cboTipoTransporteAdmision').prop('disabled', true)
                $('#cboUbicacionLesionadoAdmision').prop('disabled', true)
                $('#cboPosicionLesionadoAlabAdmision').prop('disabled', true)
                $('#cboGrupoOcupacionalAlabAdmision').prop('disabled', true)
                $('#cboTipoAgenteAganAdmision').prop('disabled', true)
                break;
        }


        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    MostrarBoletaCodiogPrestPorTipoFuenteFinanciamiento: function (idFuenteFinanciamiento) {
        if (idFuenteFinanciamiento == 3) {
            $('#divParticular').hide()
            $('#divSis').show()
        } else {
            $('#divParticular').show()
            $('#divSis').hide()
        }
    },
    ValidaRecetas: async function (idCuentaAtencion, idEstado) {
        let recetas = await RegistroAdmision.RecetasByCuentaByEstado(idCuentaAtencion, idEstado)
        let msg = ``
        Cargando(0)
        if (recetas.length > 0) {
            msg = msg + `<table class="table table-bordered mt-1 mb-1" style="font-size: 12px;"><tbody>
                <tr>
                    <th style="width: 30%; background: #f0f0f0; text-align: left; !important">Descripcion</th>
                    <th style="width: 30%; background: #f0f0f0; text-align: left; !important">Receta</th>
                </tr>`
            for (obj of recetas) {
                msg = msg + `<tr>
                    <td style="text-align: left !important;"> ${obj.descripcion}</td>
                    <td style="text-align: left !important;"> ${obj.idReceta}</td>
                </tr>
                `
            }
            msg = msg + `</tbody></table>`

            msg = msg + `<h3>DESEA CERRAR LA CUENTA IGUALMENTE?</h3>`
        }

        if (msg != '') {
            try {
                let continuar = await alertaAsync('question', 'El Paciente tiene RECETAS/ORDENES POR RECOGER:', msg)
                return continuar
            } catch (e) {
                return false
            }
        }
        return false
    },
    RetornaTotalPagosPendientesPorNroCuentaDEBB: async function (idCuentaAtencion) {
        let consumoServicio = await RegistroAdmision.RetornaTotalPagosServiciosPendientesPorNroCuentaDEBB(idCuentaAtencion)
        let consumoFarmacia = await RegistroAdmision.RetornaTotalPagosFarmaciaPendientesPorNroCuentaDEBB(idCuentaAtencion)

        let pagosAdelantados = 0
        let pagosXdevoluciones = 0

        if (consumoServicio > 0 || consumoFarmacia > 0) {
            pagosAdelantados = await RegistroAdmision.RetornaImporteDePagosAdelantadosPorNroCuenta(idCuentaAtencion)
            pagosXdevoluciones = await RegistroAdmision.RetornaImporteDePagosXdevolucionesPorNroCuenta(idCuentaAtencion)
        }

        return consumoServicio + consumoFarmacia + pagosAdelantados + pagosXdevoluciones
    },
    //ValidarHospitalizacionPaciente__: async function (paciente, idTipoServicio) {
    BuscaSiEstaHospitalizado: async function (idPaciente, idTipoServicio) {
        let lstIdEstadosCta = "4,5,9,11,13,14";
        let msg = ''
        let atenciones = null
        let acepta = false

        let buscaSiEstaHospitalizado = false

        // Hospitalizacion
        atenciones = await RegistroAdmision.AtencionesSeleccionarPorIdPaciente(idPaciente, 3)

        if (atenciones.length > 0) {
            const ultAtencion = atenciones[atenciones.length - 1]

            if (!lstIdEstadosCta.split(',').includes(ultAtencion.idEstado.toString())) {
                msg = `El paciente tiene una atención pendiente en Hospitalización <br>
                Fecha Ingreso: ${FormatearFecha(ultAtencion.fechaIngreso)} Cuenta: ${ultAtencion.idCuentaAtencion} - ${ultAtencion.dPlan} <br><br>
                Debe dar de alta al paciente antes de agregar otra atención`

                alerta2('warning', 'Atención', msg)
                buscaSiEstaHospitalizado = true
            }
        }

        // Emergencia - Consultorios
        atenciones = await RegistroAdmision.AtencionesSeleccionarPorIdPaciente(idPaciente, 2)

        if (atenciones.length > 0) {
            const ultAtencion = atenciones[atenciones.length - 1]

            if (ultAtencion.idEstado == 10) {
                let generaPago = await RegistroAdmision.TiposFinanciamientoGeneraReciboPago(ultAtencion.idFormaPago)

                if (generaPago == 0) {
                    msg = `El paciente tiene ALTA MEDICA en Consultorio-Emergencia <br>
                    Fecha Ingreso: ${FormatearFecha(ultAtencion.fechaIngreso)}  Cuenta:  ${ultAtencion.idCuentaAtencion} - ${ultAtencion.dPlan} <br><br> 
                    ¿Desea realizar otra Admisión?`

                    try {
                        acepta = await alertaAsync('question', 'Atención', msg)
                    } catch (e) {
                        acepta = false
                    }
                } else {
                    lnTotalDeuda = await RegistroAdmision.RetornaTotalPagosPendientesPorNroCuentaDEBB(ultAtencion.idCuentaAtencion)

                    if (lnTotalDeuda > 0) {
                        msg = `El paciente tiene ALTA MEDICA en Consultorio-Emergencia <br>
                        Fecha Ingreso: ${FormatearFecha(ultAtencion.fechaIngreso)} Cuenta: ${ultAtencion.idCuentaAtencion} - ${ultAtencion.dPlan} - Debe: ${lnTotalDeuda} <br><br>
                        ¿Desea realizar otra Admisión?`

                        try {
                            acepta = await alertaAsync('question', 'Atención', msg)
                        } catch (e) {
                            acepta = false
                        }
                    } else {
                        acepta = true
                    }
                }

                if (acepta) {
                    buscaSiEstaHospitalizado = false
                } else {
                    buscaSiEstaHospitalizado = true
                }

            } else {
                if (!lstIdEstadosCta.split(',').includes(ultAtencion.idEstado.toString())) {
                    msg = `El paciente tiene una atención pendiente en Emergencia-Consultorios <br>
                    Fecha Ingreso: ${FormatearFecha(ultAtencion.fechaIngreso)} Cuenta: ${ultAtencion.idCuentaAtencion} - ${ultAtencion.dPlan} <br><br>
                    Debe dar de alta al paciente antes de agregar otra atención`

                    alerta2('warning', 'Atención', msg)
                    buscaSiEstaHospitalizado = true
                }
            }
        }

        // CE
        if ($('#hdIdTipoServicio').val() != 1) {
            atenciones = await RegistroAdmision.AtencionesSeleccionarPorIdPaciente(idPaciente, 1)

            if (atenciones.length > 0) {
                const ultAtencion = atenciones[atenciones.length - 1]

                if (!lstIdEstadosCta.split(',').includes(ultAtencion.idEstado.toString())) {

                    msg = `El paciente tiene una atención pendiente en Consultorios Externo <br> 
                    Fecha Ingreso: ${FormatearFecha(ultAtencion.fechaIngreso)} Cuenta: ${ultAtencion.idCuentaAtencion} - ${ultAtencion.dPlan} <br><br>
                    ¿Desea Cerrar la Cuenta?`

                    let generaPago = await RegistroAdmision.TiposFinanciamientoGeneraReciboPago(ultAtencion.idFormaPago)

                    try {
                        acepta = await alertaAsync('question', 'Atención', msg)
                    } catch (e) {
                        acepta = false
                    }

                    if (acepta) {
                        if (generaPago == 0) {
                            await RegistroAdmision.CuentaAtencionPendientePagoSeguros(ultAtencion.idCuentaAtencion, idPaciente, idTipoServicio)
                        } else {
                            await RegistroAdmision.CuentaAtencionCerradoAutomatico(ultAtencion.idCuentaAtencion, idPaciente, idTipoServicio)
                        }
                        buscaSiEstaHospitalizado = false
                    } else {
                        buscaSiEstaHospitalizado = true
                    }
                }
            }
        }

        return buscaSiEstaHospitalizado
    },

    TraeDiagnosticosHasta24HorasDeEmergencia: async function (idAtencion, idPaciente, idTipoServicioProviene) {
        
        if ($('#hdIdTipoServicio').val() == 3) {
            if (idTipoServicioProviene == 1) {
                // let atenciones = await RegistroAdmision.AtencionesSeleccionarPorIdPaciente(idAtencion, idPaciente, 1)

                // if (atenciones.length > 0) {
                //     let ultimaAtencion = atenciones[0]

                //     if (ultimaAtencion.idEstado != 9) {
                //         await Diagnosticos.SeleccionarDiagnosticos(idAtencion, 1) // Hospitalizacion Ingreso
                //     }
                // }
                await Diagnosticos.SeleccionarDiagnosticos(idAtencion, 1) // Hospitalizacion Ingreso
            }
            if (idTipoServicioProviene == 2) {
                // let atenciones = await RegistroAdmision.AtencionesSeleccionarPorIdPaciente(idPaciente, 2)

                // if (atenciones.length > 0) {
                //     let ultimaAtencion = atenciones[0]

                //     if (ultimaAtencion.idEstado != 9) {
                //         await Diagnosticos.SeleccionarDiagnosticos(idAtencion, 3) // Hospitalizacion Ingreso
                //     }
                // }
                await Diagnosticos.SeleccionarDiagnosticos(idAtencion, 3) // Hospitalizacion Ingreso
            }
        }

        
    },
    ActualizaCAMAyLlegoAlServicioHospitalizacion: async function (opcion) {
        if ($('#hdIdTipoServicio').val() == 3 && opcion == 'A') {
            let consultaEmergencia = await Utilitario.SeleccionarParametro(22)
            if (consultaEmergencia.valorTexto == 'C') {

            }
        }
    },


    Events: function () {

        $('.search-modal').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search-modal').blur();
                $("#btnBuscarDatosPaciente").click();
            }
        });


        /*_________________________________________________ TABLES _______________________________________________*/
        $('#tblServicios tbody').on('click', 'tr', function () {

            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');
            //}
            //else {
                oTable_Servicios.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            //}

            var pos = oTable_Servicios.api(true).row($(this)).index();
            var row = oTable_Servicios.fnGetData(pos);

        });

        $('#tblServicios tbody').on('dblclick', 'tr', async function () {

            var objRowTb = oTable_Servicios.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            $('#hdIdMedicoIngreso').val('')
            $('#txtMedicoIngreso').val('')
            $('#hdIdEspecialidadMedicoIngreso').val('')

            RegistroAdmision.IdEspecialidad = objRowTb.idEspecialidad
            $('#hdIdServicioIngresoAdmision').val(objRowTb.idServicio)
            $('#txtServicioIngresoAdmision').val(objRowTb.codigo + ' - ' + objRowTb.nombre)

            await RegistroAdmision.ListarCamas(objRowTb.idServicio)

            $('#modalServicios').modal('hide')
        })

        $('#tblMedicoTopico tbody').on('click', 'tr', function () {

            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');
            //}
            //else {
                oTable_MedicoTopico.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            //}

            var pos = oTable_MedicoTopico.api(true).row($(this)).index();
            var row = oTable_MedicoTopico.fnGetData(pos);

        });
        $('#tblMedicoTopico tbody').on('dblclick', 'tr', function () {

            var objRowTb = oTable_MedicoTopico.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            $('#hdIdMedicoIngreso').val(objRowTb.idMedico)
            $('#txtMedicoIngreso').val(objRowTb.idMedico + ' - ' + objRowTb.apellidoPaterno + ' ' + objRowTb.apellidoMaterno + ' ' + objRowTb.nombres)
            $('#hdIdEspecialidadMedicoIngreso').val(objRowTb.idEspecialidad)

            $('#modalMedicoTopico').modal('hide')
        })

        $('#tblBusquedaSis tbody').on('click', 'tr', function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        })
        $('#tblBusquedaSis tbody').on('dblclick', 'tr', async function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')

            let objRowSis = oTable_busquedaSis.api(true).row('.selected').data()

            //if (objRowSis[6] == 1) {
            //    swal({
            //        title: 'Cuidado',
            //        text: "La afiliacion de este paciente tiene probelmas \n\n Motivo de baja: \nEstado: " + (objRowSis[6] == 1 ? "Inactivo " : objRowSis[6]) +
            //            "\nFecha Baja:  " + objRowSis[7] + "\n",
            //        type: 'warning',
            //        allowOutsideClick: false,
            //    }).done();

            //    return false
            //}

            $('#hdIdSiaSis').val(objRowSis.idNumReg) //
            $('#hdCodigo').val(objRowSis.tabla) //
            $('#hdAfiliacionDisa').val(objRowSis.disa) //
            $('#hdAfiliacionTipoFormato').val(objRowSis.tipoFormato) //
            $('#hdAfiliacionNroFormato').val(objRowSis.nroContrato) //
            $('#hdAfiliacionNroIntegrante').val('') //
            $('#hdDocumentoTipo').val(objRowSis.tipoDocumento)
            $('#hdCodigoEstablAdscripcion').val(objRowSis.eess) //
            $('#hdAfiliacionFecha').val(formatFecha(objRowSis.fecAfiliacion)) //
            $('#hdPaterno').val(objRowSis.apePaterno) //
            $('#hdMaterno').val(objRowSis.apeMaterno) //
            $('#hdPnombre').val(objRowSis.nombres) //
            $('#hdOnombres').val(objRowSis.snombre)
            $('#hdGenero').val(objRowSis.genero == '1' ? 1 : 2) //
            $('#hdFnacimiento').val(formatFecha(objRowSis.fecNacimiento)) //
            $('#hdIdDistritoDomicilio').val(objRowSis.idUbigeo) //
            $('#hdEstado').val(1) //
            $('#hdFbaja').val(objRowSis.fecCaducidad) //
            $('#hdDocumentoNumero').val(objRowSis.nroDocumento) //
            $('#hdMotivoBaja').val(objRowSis.motivoBaja) //

            $('#txtApellidoPaterno').val(objRowSis.apePaterno)
            $('#txtApellidoMaterno').val(objRowSis.apeMaterno)
            $('#txtPrimerNombre').val(objRowSis.nombres)
            $('#txtSegundoNombre').val(objRowSis.snombre)

            $(`#cboFuenteFinanciamientoAdmision`).val(3);
            $('.chzn-select').chosen().trigger("chosen:updated")
            $(`#cboFuenteFinanciamientoAdmision`).trigger('change')


            $('#modalBusquedaSis').modal('hide')

            //await BuscarPacientes()
            await RegistroAdmision.BuscarPacienteEnEstablecimiento()
        })
        $('#tblPacientesBusqueda tbody').on('click', 'tr', function (e) {
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblPacientesBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');



            let objrow = oTable_pacientesBusqueda.api(true).row('.selected').data()
            let paciente = await RegistroAdmision.PacientesSeleccionarPorId(objrow.idPaciente)
            //----------------------------------------------------------------------------------------------------------------
            let buscaSiEstaHospitalizado = await RegistroAdmision.BuscaSiEstaHospitalizado(paciente.idPaciente, $('#hdIdTipoServicio').val())

            if (!buscaSiEstaHospitalizado) {

                let tipoSexo = paciente.idTipoSexo == 1 ? 'M' : 'F'
                let edadEnYYYYMMDD = RegistroAdmision.EdadActualEnFormatoYYYYMMDD(FormatearFecha(paciente.fechaNacimiento), $('#txtFechaIngresoAdmision').val())

                await RegistroAdmision.ReglasDeConsistenciasAntesDeCargarFormulario($('#hdIdTipoServicio').val(), tipoSexo, edadEnYYYYMMDD)

                await RegistroPaciente.CompletarDatosPaciente(paciente, 1)

                $('#modalPacientesBusqueda').modal('hide')
            }
            //----------------------------------------------------------------------------------------------------------------


            Cargando(0)

        })
        $('#tblPacienteProviene tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_pacienteProviene.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let tipoServicio = $('#hdIdTipoServicio').val()

            let objrow = oTable_pacienteProviene.api(true).row('.selected').data()

            if (tipoServicio == 3) { // Valida si el tipo de servicio es hospitalizacion
                let validaReceta = await RegistroAdmision.ValidaRecetas(objrow.idCuentaAtencion, 1)
                Cargando(1)
                if (validaReceta) {
                    if (objrow.idFormaPago == 1) { // SI ES PAGANTE
                        let estadoCuenta = await RegistroAdmision.AtencionesActualizarEstadoCuentaHosp(objrow.idCuentaAtencion)
                        if (estadoCuenta > 0) {
                            alerta2('success', 'Atención', `La Cuenta ${objrow.idCuentaAtencion} fue cerrada correctamente`)
                        } else {
                            alerta2('success', 'Atención', `Error al cerrar cuenta ${objrow.idCuentaAtencion}`)
                        }
                    } else { // SI TIENE ALGUN SEGURO
                        let estadoCuenta = await RegistroAdmision.AtencionesActualizarEstadoCuentaHospConSeguro(objrow.idCuentaAtencion)
                        if (estadoCuenta > 0) {
                            alerta2('success', 'Atención', `La Cuenta ${objrow.idCuentaAtencion} fue cerrada correctamente`)
                        } else {
                            alerta2('success', 'Atención', `Error al cerrar cuenta ${objrow.idCuentaAtencion}`)
                        }
                    }
                }

            }

            let paciente = await RegistroAdmision.PacientesSeleccionarPorId(objrow.idPaciente)
            //----------------------------------------------------------------------------------------------------------------
            let buscaSiEstaHospitalizado = await RegistroAdmision.BuscaSiEstaHospitalizado(paciente.idPaciente, $('#hdIdTipoServicio').val())

            if (!buscaSiEstaHospitalizado) {

                

                let tipoSexo = paciente.idTipoSexo == 1 ? 'M' : 'F'
                let edadEnYYYYMMDD = RegistroAdmision.EdadActualEnFormatoYYYYMMDD(FormatearFecha(paciente.fechaNacimiento), $('#txtFechaIngresoAdmision').val())
                await RegistroAdmision.ReglasDeConsistenciasAntesDeCargarFormulario($('#hdIdTipoServicio').val(), tipoSexo, edadEnYYYYMMDD)

                ///////////////////////////// Cargar datos de la atencion de origen /////////////////////////////
                RegistroAdmision.IdAtencionEmeg_CE = objrow.idAtencion
                let fuenteFinanciamiento = objrow.idFuenteFinanciamiento == 1 ? '5' : objrow.idFuenteFinanciamiento == 3 ? '3' : '0'
                await RegistroAdmision.TiposFinanciamientosTarifaSeleccionarPorPlan(fuenteFinanciamiento)
                $('#cboFuenteFinanciamientoAdmision').val(fuenteFinanciamiento)
                $('#cboProductoPlanAdmision').val(objrow.idFormaPago)
                RegistroAdmision.MostrarBoletaCodiogPrestPorTipoFuenteFinanciamiento(fuenteFinanciamiento)
                if (objrow.idTipoServicio == 1) {
                    $('#cboTipoOrigenAdmision').val(30)
                } else if (objrow.idTipoServicio == 2) {
                    $('#cboTipoOrigenAdmision').val(31)
                }
                await RegistroAdmision.TraeDiagnosticosHasta24HorasDeEmergencia(objrow.idAtencion, paciente.idPaciente, objrow.idTipoServicio)

                $('#txtNombreAcompanianteAdmision').val(objrow.nombreAcompaniante)
                $('#txtTelefonoAcompanianteAdmision').val(objrow.telefonoAcompaniante)

                $('.chzn-select').chosen().trigger("chosen:updated")
                ///////////////////////////// END Cargar datos de la atencion de origen /////////////////////////////

                $('#modalPacienteProviene').modal('hide')
                await RegistroPaciente.CompletarDatosPaciente(paciente, 1)

            }
            //----------------------------------------------------------------------------------------------------------------


            Cargando(0)

        })





        /*_________________________________________________ BUTTONS _______________________________________________*/
        $('#btnBuscarDatosPaciente').on('click', async function () {

            Cargando(1)

            if (!$('#chbBusquedaSis').is(':checked') && !$('#chbPacienteNuevo').is(':checked') && !$('#chbBusquedaReniec').is(':checked')) {
                if ($('#txtDniBusqueda').val() == '' && $('#txtNroHistoriaBusqueda').val() == '' && $('#txtApellidoPaternoBusqueda').val() == '' && $('#txtApellidoMaternoBusqueda').val() == ''
                    && $('#txtPrimerNombreBusqueda').val() == '' && $('#txtSegundoNombreBusqueda').val() == '') {
                    alerta(2, 'Ingrese alguno de los valores de busqueda')
                    Cargando(0)
                    return false
                }
            }

            if ($('#chbBusquedaReniec').is(':checked')) {

                if ($('#txtDni').val() == '') {
                    alerta2('info', 'Atención', 'Debe ingresar el DNI')
                    Cargando(0)
                    return false
                }

                try {
                    let paciente = await CitasAdmision.BuscarPacienteReniec();
                    if (!paciente.estado || paciente.data[0] !== '0000') {
                        alerta(2, 'No existen datos de la persona');
                        return Cargando(0);
                    }

                    let datosReniec = paciente.data;
                    let nombres = datosReniec[3].split(' ');

                    $('#cboTipoDocPaciente').val(1);
                    $('#txtDniPaciente').val(datosReniec[21]);
                    $('#txtApellidoPaternoPaciente').val(datosReniec[1]);
                    $('#txtApellidoMaternoPaciente').val(datosReniec[2]);
                    $('#txtPrimerNombrePaciente').val(nombres[0] || '');
                    $('#txtSegundoNombrePaciente').val(nombres[1] || '');
                    $('#cboSexoPaciente').val(datosReniec[17]);
                    $('#txtDireccionDomicilio').val(datosReniec[16]);
                    $("#txtPacienteFechaNacimiento").datepicker("setDate", FormatearFecha(moment(datosReniec[18])));
                    $('#txtPacienteFechaNacimiento').trigger('input');

                    await RegistroAdmision.BuscarPacienteEnEstablecimiento();
                } catch (error) {
                    alerta(3, 'Error en la consulta RENIEC: ' + error.message);
                }

                Cargando(0)
                return false
            }

            if ($('#chbBusquedaSis').is(':checked')) {
                $(`#cboFuenteFinanciamientoCita`).val(3);

                //RegistroAdmision.CompletarDatosAfiliacion()               //KHOYOSI 29032026
                RegistroAdmision.CompletarDatosAfiliacionIAFAS()          //KHOYOSI 29032026
                Cargando(0)
                return false;
            }

            await RegistroAdmision.BuscarPacienteEnEstablecimiento()

            Cargando(0)

        })
        $('#btnProcedeConsultaExterna').on('click', async function () {
            $('#modalPacienteProviene').modal('show')
            let data = await RegistroAdmision.AtencionesSinAdmHospitalizacion(1)
            oTable_pacienteProviene.fnClearTable()
            if (!isEmpty(data) && data.length > 0) {
                oTable_pacienteProviene.fnAddData(data)
            }
            console.log('data', data)
        })
        $('#btnProcedeEmergencia').on('click', async function () {
            $('#modalPacienteProviene').modal('show')
            let data = await RegistroAdmision.AtencionesSinAdmHospitalizacion(2)
            oTable_pacienteProviene.fnClearTable()
            if (!isEmpty(data) && data.length > 0) {
                oTable_pacienteProviene.fnAddData(data)
            }
            console.log('data', data)
        })
        $('#btnCerrarModalPacienteProviene').on('click', function () {
            $('#modalPacienteProviene').modal('hide')
        })
        $('#btnModalServicioIngreso').on('click', async function () {
            $('#modalServicios').modal('show')
            await RegistroAdmision.ServiciosFiltrar('', '')
        })
        $('#btnCerrarModalServicio').on('click', function () {
            $('#modalServicios').modal('hide')
        })
        $('#btnCerrarModalPacienteSIS').on('click', function () {
            $('#modalBusquedaSis').modal('hide')
        })
        $('#btnBuscarServicio').on('click', async function () {
            await RegistroAdmision.ServiciosFiltrar($('#txtCodigoServicioBuscar').val(), $('#txtNombreServicioBuscar').val())
        })
        $('#btnSeleccionarServicio').on('click', async function () {

            var objRowTb = oTable_Servicios.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            RegistroAdmision.IdEspecialidad = objRowTb.idEspecialidad
            $('#hdIdServicioIngresoAdmision').val(objRowTb.idServicio)
            $('#txtServicioIngresoAdmision').val(objRowTb.codigo + ' - ' + objRowTb.nombre)

            await RegistroAdmision.ListarCamas(objRowTb.idServicio)

            $('#modalServicios').modal('hide')
        })

        $('#btnModalMedicoIngreso').on('click', async function () {

            if ($('#hdIdServicioIngresoAdmision').val() == '') {
                alerta(2, 'Debe seleccionar el Servicio de Ingreso')
                return
            }
            $('#modalMedicoTopico').modal('show')
            await RegistroAdmision.MedicosFiltrar('', '', '', '')
        })
        $('#btnCerrarModalMedicoTopico').on('click', function () {
            $('#modalMedicoTopico').modal('hide')
        })

        $('#btnBuscarMedicoTopico').on('click', async function () {
            await RegistroAdmision.MedicosFiltrar($('#txtCodigoPlanillaMedicoTopicoBuscar').val(), $('#txtApellidoPaternoMedicoTopicoBuscar').val(),
                $('#txtApellidoMaternoMedicoTopicoBuscar').val(), $('#txtNombresMedicoTopicoBuscar').val())
        })
        $('#btnLimpiarFiltroMedicoTopico').on('click', async function () {
            $('#txtCodigoPlanillaMedicoTopicoBuscar').val('')
            $('#txtApellidoPaternoMedicoTopicoBuscar').val('')
            $('#txtApellidoMaternoMedicoTopicoBuscar').val('')
            $('#txtNombresMedicoTopicoBuscar').val('')
        })


        $('#btnBuscarServicio').on('click', async function () {
            await RegistroAdmision.ServiciosFiltrar($('#txtCodigoServicioBuscar').val(), $('#txtNombreServicioBuscar').val())
        })
        $('#btnLimpiarFiltroServicio').on('click', async function () {
            $('#txtCodigoServicioBuscar').val('')
            $('#txtNombreServicioBuscar').val('')
        })


        $('#btnSeleccionarMedicoTopico').on('click', async function () {

            var objRowTb = oTable_MedicoTopico.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            $('#hdIdMedicoIngreso').val(objRowTb.idMedico)
            $('#txtMedicoIngreso').val(objRowTb.idMedico + ' - ' + objRowTb.apellidoPaterno + ' ' + objRowTb.apellidoMaterno + ' ' + objRowTb.nombres)
            $('#hdIdEspecialidadMedicoIngreso').val(objRowTb.idEspecialidad)

            $('#modalMedicoTopico').modal('hide')
        })

        $('#btnOpenModalEstablecimientoReferenciaAdmision').on('click', function () {

            if (($('#cboTipoReferenciaAdmision').val() == 0)) {
                alert("Seleccionar el tipo de referencia/contrareferencia")
                return false
            }

            EstablecimientoSalud.opcionEst = 'ADM'

            //oTable_establecimientos.fnClearTable()
            if ($('#cboTipoReferenciaAdmision').val() == 2) {
                $('#divCodigoRenaes').hide()
            } else {
                $('#divCodigoRenaes').show()
            }
            $('#modalEstablecimientosBuscar').modal('show')
        })

        $('#btnLimpiarDatosPaciente').on('click', () => {
            Cargando(1)

            RegistroAdmision.LimpiarCamposPaciente()
            RegistroAdmision.LimpiarCamposAtencion()
            Cargando(0)
        })
        $('#btnRegistrarAdmision').on('click', async function () {

            RegistroAdmision.RegistarAdmision(1)

        })
        $('#btnCerrarModalBusquedaPaciente').on('click', function () {
            $('#modalPacientesBusqueda').modal('hide')
        })
        $('#btnCerrarModalAdmision').on('click', async function () {
            Cargando(1)
            
            RegistroAdmision.LimpiarCamposPaciente()
            RegistroAdmision.LimpiarCamposAtencion()

            $('#modalAdmision').modal('hide')

            Cargando(0)
        })

        $('#btnCerrarTicket').on('click', function () {
            $('#modalTicket').modal('hide')
        })
       

        /*_________________________________________________ COMBO BOX _______________________________________________*/
        $('#cboTipoOrigenAdmision').on('change', function () {


            if ($('#hdIdTipoServicio').val() == 2) { // Emergencia

                if ($('#cboTipoOrigenAdmision>option:selected').val() == 21) {
                    $('#cboTipoReferenciaAdmision').attr('disabled', false)
                    $('#txtNroReferenciaAdmision').attr('disabled', false)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', false)

                    $('#lblTipoRefCon').text('Tipo Referencia')
                    $('#lblEstabRefCon').text('Estab. Referencia')

                } else if ($('#cboTipoOrigenAdmision>option:selected').val() == 22) {
                    $('#cboTipoReferenciaAdmision').attr('disabled', false)
                    $('#txtNroReferenciaAdmision').attr('disabled', false)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', false)

                    $('#lblTipoRefCon').text('Tipo Contrareferencia')
                    $('#lblEstabRefCon').text('Estab. Contrareferencia')

                } else {
                    $('#cboTipoReferenciaCita').attr('disabled', true)
                    $('#cboTipoReferenciaAdmision').attr('disabled', true)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', true)

                    $(`#cboTipoReferenciaCita`).val(0);
                    $('#txtIdReferenciaCita').val('')
                    $('#txtDescripcionReferenciaCita').val('')
                    $('#cboTipoReferenciaAdmision').val('')
                }
            }

            $('.chzn-select').chosen().trigger("chosen:updated")
        })
        $('#cboFuenteFinanciamientoAdmision').on('change', async function () {
            
            await RegistroAdmision.TiposFinanciamientosTarifaSeleccionarPorPlan($('#cboFuenteFinanciamientoAdmision').val())

            $('#cboCodPrestacion').val('0')
            $('.chzn-select').chosen().trigger("chosen:updated");

            RegistroAdmision.MostrarBoletaCodiogPrestPorTipoFuenteFinanciamiento(this.value)
        })
        $('#cboCausaExternaMorbilidadAdmision').on('change', async function () {

            RegistroAdmision.DesbloquearCausasMorbilidad()
        })


        /*_________________________________________________ MODALS _______________________________________________*/
        $('#modalServicios').on('shown.bs.modal', function (e) {
            oTable_Servicios.fnDraw()
        });
        $('#modalMedicoTopico').on('shown.bs.modal', function (e) {
            oTable_MedicoTopico.fnDraw()
        });

        /*_________________________________________________ TEXTS _______________________________________________*/
        $('#txtNroDerivacion').keypress(async function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('#txtNroDerivacion').blur();

                let datosDerivacion = await RegistroAdmision.ListarDerivacionById($('#txtNroDerivacion').val())

                await RegistroAdmision.CargarDatosDerivacion(datosDerivacion)
            }
        });


        /*_________________________________________________ CHECKBOX _______________________________________________*/
        $('#chbPacienteNuevo').on('click',async function () {
            if ($('#chbPacienteNuevo').is(':checked')) {


                if ($('#hdIdSiaSis').val() != '') {
                    $('#cboTipoDocPaciente').val(($('#hdAfiliacionTipoFormato').val() == 2 ? 1 : 2))

                    $('#txtDniPaciente').val($('#hdAfiliacionNroFormato').val())

                    $('#txtApellidoPaternoPaciente').val($('#hdPaterno').val())
                    $('#txtApellidoMaternoPaciente').val($('#hdMaterno').val())
                    $('#txtPrimerNombrePaciente').val($('#hdPnombre').val())
                    $('#txtSegundoNombrePaciente').val($('#hdOnombres').val())
                    $('#txtPacienteFechaNacimiento').val($('#hdFnacimiento').val())
                    $('#cboSexoPaciente').val(($('#hdGenero').val() == 1 ? 1 : 2))

                    $('#txtPacienteFechaNacimiento').trigger('input')

                    let tipoSexo = ($('#hdGenero').val() == 1 ? 'M' : 'F')
                    let edadEnYYYYMMDD = RegistroAdmision.EdadActualEnFormatoYYYYMMDD($('#txtPacienteFechaNacimiento').val(), $('#txtFechaIngresoAdmision').val())

                    await RegistroAdmision.ReglasDeConsistenciasAntesDeCargarFormulario($('#hdIdTipoServicio').val(), tipoSexo, edadEnYYYYMMDD)

                    $('.chzn-select').chosen().trigger("chosen:updated")
                } else {
                    LimpiarCampos()
                }

                $('#chbPacienteNuevo').prop('checked', true)

                $('#txtNroHistoria').prop("disabled", true)
                $('#txtDni').prop("disabled", true)
                $('#txtApellidoPaterno').prop("disabled", true)
                $('#txtApellidoMaterno').prop("disabled", true)
                $('#txtPrimerNombre').prop("disabled", true)
                $('#txtSegundoNombre').prop("disabled", true)
                $('#cboTipoAfiliacion').prop("disabled", true)
                $('#txtDisa').prop("disabled", true)
                $('#txtTipo').prop("disabled", true)
                $('#txtNroAfiliacion').prop("disabled", true)
            } else {
                $('#txtNroHistoria').prop("disabled", false)
                $('#txtDni').prop("disabled", false)
                $('#txtApellidoPaterno').prop("disabled", false)
                $('#txtApellidoMaterno').prop("disabled", false)
                $('#txtPrimerNombre').prop("disabled", false)
                $('#txtSegundoNombre').prop("disabled", false)
                $('#cboTipoAfiliacion').prop("disabled", false)
                $('#txtDisa').prop("disabled", false)
                $('#txtTipo').prop("disabled", false)
                $('#txtNroAfiliacion').prop("disabled", false)
            }
        })
    },


    Init: function () {
        $('#modalAdmision #modalLabelsuccess').text('Registro Admision')

        RegistroAdmision.Plugins()
        RegistroAdmision.CargaInicial()

        RegistroAdmision.InitDatablesServicios()
        RegistroAdmision.InitDatablesMedicoTopico()
        RegistroAdmision.InitDatablesBusquedaSis()
        RegistroAdmision.InitDatablesBusquedaPacientes()
        RegistroAdmision.InitDatablesPacienteProviene()
        //RegistroAdmision.InitDatablesEstablecimientos()

        //RegistroAdmision.ListarSisServiciosSeleccionarPorFiltro()
        RegistroAdmision.ListarTipoFormatoSIS()
        RegistroAdmision.TiposReferenciaSeleccionarTodos()
        RegistroAdmision.ListarTipoServicio()

        if ($('#hdIdTipoServicio').val() == 2) {
            RegistroAdmision.TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia()
        } else if ($('#hdIdTipoServicio').val() == 3) {
            RegistroAdmision.TiposOrigenAtencionSeleccionarViasDeHospitalizacion(1)
        } else if ($('#hdIdTipoServicio').val() == 4) {
            RegistroAdmision.TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia()
        }


        RegistroAdmision.TiposGravedadAtencionSeleccionarTodos()
        RegistroAdmision.TiposEdadSeleccionarTodos()
        RegistroAdmision.FuentesFinanciamientoSegunFiltro('UtilizadoEn=1 or UtilizadoEn=3  or UtilizadoEn=2')
        RegistroAdmision.EmergenciaCausaExternaMorbilidadSeleccionarTodos()
        RegistroAdmision.EmergenciaLugarEventoSeleccionarTodos()
        RegistroAdmision.EmergenciaTipoEventoSeleccionarTodos()
        RegistroAdmision.EmergenciaRelacionAgresorVictimaSeleccionarTodos()
        RegistroAdmision.EmergenciaSeguridadSeleccionarTodos()
        RegistroAdmision.EmergenciaClaseAccidenteSeleccionarTodos()
        RegistroAdmision.EmergenciaTipoVehiculoSeleccionarTodos()
        RegistroAdmision.EmergenciaTipoTransporteSeleccionarTodos()
        RegistroAdmision.EmergenciaUbicacionLesionadoSeleccionarTodos()
        RegistroAdmision.EmergenciaGrupoOcupacionalALABSeleccionarTodos()
        RegistroAdmision.EmergenciaPosicionLesionadoALABSeleccionarTodos()
        RegistroAdmision.EmergenciaTipoAgenteAGANSeleccionarTodos()


        RegistroAdmision.Events()


    }
}

$(document).ready(function () {
    RegistroAdmision.Init()
})

function formatFecha(data, type, row) {
    if (!data) return '';
    return `${data.substr(6, 2)}/${data.substr(4, 2)}/${data.substr(0, 4)}`;
}