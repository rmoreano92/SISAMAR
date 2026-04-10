let ServicioSocial = {

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        //$('#txtFechaIngresoBusqueda').datepicker({ // se agrego txtProximaConsulta RQ0002
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom",
        //    dateFormat: 'dd/mm/yy'

        //});

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        year = moment().format('L').toString().substr(6, 4)
        month = moment().format('L').toString().substr(0, 2)
        day = moment().format('L').toString().substr(3, 2)

        $('#txtFechaIngresoServS').val(year + '-' + month + '-' + day)
        //$("tagMedicoProgramado").hide();
    },

    ServicioSeleccionarPorTipoServicio: () => {

        let formData = new FormData()

        formData.append('IdTipoServicio', 0)

        $('#cboServicioBusqueda').empty();
        $('#cboServicioServS').empty();

        HttpClient.Post('/ServicioSocial/ServicioSeleccionarPorTipoServicio?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    $('#cboServicioBusqueda').append('<option  value="' + 0 + '">' + 'Seleccionar' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboServicioBusqueda').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    });

                    $('#cboServicioServS').append('<option  value="' + 0 + '">' + 'Seleccionar' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboServicioServS').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alerta(2, res.msj)
                }
            })
    },

    ListarEmpleados: () => {

        let formData = new FormData()

        $('#cboAsistentaServS').empty();
        HttpClient.Post('/ServicioSocial/ListarEmpleados?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    $('#cboAsistentaServS').append('<option  value="' + 0 + '">' + 'Seleccionar' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboAsistentaServS').append('<option  value="' + obj.idEmpleado + '">' + obj.asistenta + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alerta(2, res.msj)
                }
            })
    },
    ListarTurnos: () => {

        let formData = new FormData()

        $('#cboTurnosLaboradosServS').empty();
        HttpClient.Post('/ServicioSocial/ListarTurnos?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    $('#cboTurnosLaboradosServS').append('<option  value="' + 0 + '">' + 'Seleccionar' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboTurnosLaboradosServS').append('<option  value="' + obj.idTurno + '">' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alerta(2, res.msj)
                }
            })
    },
    

    ListarAtencionesParaEstadisticasServicioSocial: () => {

        let formData = new FormData()

        formData.append('NroDocumento', $('#txtDniBusqueda').val())
        formData.append('ApellidoPaterno', $('#txtApellPaternoBusqueda').val())
        formData.append('FechaIngreso', $('#txtFechaIngresoBusqueda').val())
        formData.append('IdServicio', $('#cboServicioBusqueda').val())

        oTable_ServicioSocial.fnClearTable()

        Cargando(1)
        HttpClient.Post('/ServicioSocial/ListarAtencionesParaEstadisticasServicioSocial?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {
                        oTable_ServicioSocial.fnAddData(res.dataSet.table)
                    }
                } else {
                    alerta(2, res.msj)
                }
                Cargando(0)
            })
    },
    SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro: (IdRegistro) => {

        let formData = new FormData()

        formData.append('IdRegistro', IdRegistro)

        Cargando(1)
        HttpClient.Post('/ServicioSocial/SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    let registro = res.dataSet.table[0]

                    console.log('registro', registro)

                    $('#hdIdRegistro').val(registro.idRegistro)
                    $('#txtFechaIngresoServS').val(registro.fecha)
                    $('#cboServicioServS').val(registro.idServicio)
                    $('#cboAsistentaServS').val(registro.idUsuarioAsistente)
                    $('#txtNroIngresosServS').val(registro.nroIngresos)
                    $('#cboTurnosLaboradosServS').val(registro.turnosLaborados)
                    $('#txtEntrevistaServS').val(registro.entrevistas)
                    $('#txtARSServS').val(registro.ars)
                    $('#txtMRSServS').val(registro.mrs)
                    $('#txtBRSServS').val(registro.brs)
                    $('#txtTotalRiesgoSocialServS').val(registro.totalRiesgoSocial)
                    $('#txtGestionCoordinacionServS').val(registro.gestiones_Coordinaciones)
                    $('#txtReunionParejaFamServS').val(registro.reunionPareja_Familia)
                    $('#txtConsejeriaSocialServS').val(registro.consejeriaSocial)
                    $('#txtInformeTramiteServS').val(registro.informeSocial_TramiteJudicial)
                    $('#txtActaEntregaServS').val(registro.actaEntrega)
                    $('#txtInterconsultaServS').val(registro.interconsulta)
                    $('#txtReferenciaServS').val(registro.referencia)
                    $('#txtTotalAtencionesSocialesServS').val(registro.totalAtencionesSociales)
                    $('#txtInscripSegIntegSaludServS').val(registro.inscripSegIntegSalud)
                    $('#txtRegularizacionSisServS').val(registro.regularizacionSIS)
                    $('#txtValidacionSisServS').val(registro.validacionSIS)
                    $('#txtOrientacionInformacionServS').val(registro.orientacionInformacion)
                    $('#txtCharlaServS').val(registro.charla)
                    $('#txtEducacionSanitariaServS').val(registro.educacionSanitaria)
                    $('#txtDistMatInforEducServS').val(registro.distMatInforEduc)
                    $('#txtDisenioMaterialInforEducServS').val(registro.disenioMaterialInfor_Educ)
                    $('#txtVisitaDomiciliariaRealizadaServS').val(registro.visitaDomiciliariaRealizada)
                    $('#txtNroPacientesExoneradosServS').val(registro.nroPacientesExonerados)
                    $('#txtNroCasosViolenciaServS').val(registro.nroCasosViolencia)
                    $('#txtObservacionesServS').val(registro.observaciones)

                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alerta(2, res.msj)
                }
                Cargando(0)
            })
    },

    CrearModificarRegistroServicioSocial: () => {

        let formData = new FormData()

        formData.append("IdRegistro", $('#hdIdRegistro').val())
        formData.append("FechaIngreso", $('#txtFechaIngresoServS').val())
        formData.append("IdServicio", $('#cboServicioServS').val())
        formData.append("IdUsuarioAsistente", $('#cboAsistentaServS').val())
        formData.append("NroIngresos", $('#txtNroIngresosServS').val())
        formData.append("TurnosLaborados", $('#cboTurnosLaboradosServS').val())
        formData.append("Entrevistas", $('#txtEntrevistaServS').val())
        formData.append("ARS", $('#txtARSServS').val())
        formData.append("MRS", $('#txtMRSServS').val())
        formData.append("BRS", $('#txtBRSServS').val())
        formData.append("TotalRiesgoSocial", $('#txtTotalRiesgoSocialServS').val())
        formData.append("Gestiones_Coordinaciones", $('#txtGestionCoordinacionServS').val())
        formData.append("ReunionPareja_Familia", $('#txtReunionParejaFamServS').val())
        formData.append("ConsejeriaSocial", $('#txtConsejeriaSocialServS').val())
        formData.append("InformeSocial_TramiteJudicial", $('#txtInformeTramiteServS').val())
        formData.append("ActaEntrega", $('#txtActaEntregaServS').val())
        formData.append("Interconsulta", $('#txtInterconsultaServS').val())
        formData.append("Referencia", $('#txtReferenciaServS').val())
        formData.append("TotalAtencionesSociales", $('#txtTotalAtencionesSocialesServS').val())
        formData.append("InscripSegIntegSalud", $('#txtInscripSegIntegSaludServS').val())
        formData.append("RegularizacionSIS", $('#txtRegularizacionSisServS').val())
        formData.append("ValidacionSIS", $('#txtValidacionSisServS').val())
        formData.append("OrientacionInformacion", $('#txtOrientacionInformacionServS').val())
        formData.append("Charla", $('#txtCharlaServS').val())
        formData.append("EducacionSanitaria", $('#txtEducacionSanitariaServS').val())
        formData.append("DistMatInforEduc", $('#txtDistMatInforEducServS').val())
        formData.append("DisenioMaterialInfor_Educ", $('#txtDisenioMaterialInforEducServS').val())
        formData.append("VisitaDomiciliariaRealizada", $('#txtVisitaDomiciliariaRealizadaServS').val())
        formData.append("NroPacientesExonerados", $('#txtNroPacientesExoneradosServS').val())
        formData.append("NroCasosViolencia", $('#txtNroCasosViolenciaServS').val())
        formData.append("Observaciones", $('#txtObservacionesServS').val())

        Cargando(1)
        HttpClient.Post('/ServicioSocial/CrearModificarRegistroServicioSocial?area=Estadistica', formData)
            .then(res => {
                if (res.estado) {
                    alerta(1, res.msj)
                    ServicioSocial.LimiarCampos()
                    $('#modalRegistroServicioSocial').modal('hide')
                } else {
                    alerta(2, res.msj)
                }
                Cargando(0)
            })
    },

    LimiarCampos: () => {
        $('#hdIdRegistro').val('')
        $('#txtFechaIngresoServS').val('')
        $('#cboServicioServS').val(0)
        $('#cboAsistentaServS').val(0)
        $('#txtNroIngresosServS').val('')
        $('#cboTurnosLaboradosServS').val(0)
        $('#txtEntrevistaServS').val('')
        $('#txtARSServS').val('')
        $('#txtMRSServS').val('')
        $('#txtBRSServS').val('')
        $('#txtTotalRiesgoSocialServS').val('')
        $('#txtGestionCoordinacionServS').val('')
        $('#txtReunionParejaFamServS').val('')
        $('#txtConsejeriaSocialServS').val('')
        $('#txtInformeTramiteServS').val('')
        $('#txtActaEntregaServS').val('')
        $('#txtInterconsultaServS').val('')
        $('#txtReferenciaServS').val('')
        $('#txtTotalAtencionesSocialesServS').val('')
        $('#txtInscripSegIntegSaludServS').val('')
        $('#txtRegularizacionSisServS').val('')
        $('#txtValidacionSisServS').val('')
        $('#txtOrientacionInformacionServS').val('')
        $('#txtCharlaServS').val('')
        $('#txtEducacionSanitariaServS').val('')
        $('#txtDistMatInforEducServS').val('')
        $('#txtDisenioMaterialInforEducServS').val('')
        $('#txtVisitaDomiciliariaRealizadaServS').val('')
        $('#txtNroPacientesExoneradosServS').val('')
        $('#txtNroCasosViolenciaServS').val('')
        $('#txtObservacionesServS').val('')

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearCampos: (estado) => {
        $('#hdIdRegistro').attr('disabled', estado)
        $('#txtFechaIngresoServS').attr('disabled', estado)
        $('#cboServicioServS').attr('disabled', estado)
        $('#cboAsistentaServS').attr('disabled', estado)
        $('#txtNroIngresosServS').attr('disabled', estado)
        $('#cboTurnosLaboradosServS').attr('disabled', estado)
        $('#txtEntrevistaServS').attr('disabled', estado)
        $('#txtARSServS').attr('disabled', estado)
        $('#txtMRSServS').attr('disabled', estado)
        $('#txtBRSServS').attr('disabled', estado)
        $('#txtGestionCoordinacionServS').attr('disabled', estado)
        $('#txtReunionParejaFamServS').attr('disabled', estado)
        $('#txtConsejeriaSocialServS').attr('disabled', estado)
        $('#txtInformeTramiteServS').attr('disabled', estado)
        $('#txtActaEntregaServS').attr('disabled', estado)
        $('#txtInterconsultaServS').attr('disabled', estado)
        $('#txtReferenciaServS').attr('disabled', estado)
        $('#txtInscripSegIntegSaludServS').attr('disabled', estado)
        $('#txtRegularizacionSisServS').attr('disabled', estado)
        $('#txtValidacionSisServS').attr('disabled', estado)
        $('#txtOrientacionInformacionServS').attr('disabled', estado)
        $('#txtCharlaServS').attr('disabled', estado)
        $('#txtEducacionSanitariaServS').attr('disabled', estado)
        $('#txtDistMatInforEducServS').attr('disabled', estado)
        $('#txtDisenioMaterialInforEducServS').attr('disabled', estado)
        $('#txtVisitaDomiciliariaRealizadaServS').attr('disabled', estado)
        $('#txtNroPacientesExoneradosServS').attr('disabled', estado)
        $('#txtNroCasosViolenciaServS').attr('disabled', estado)
        $('#txtObservacionesServS').attr('disabled', estado)
    },

    InitDatables: () => {

        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            paging: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 6,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblServicioSocial'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ServicioSocial = $("#tblServicioSocial").dataTable(parms);
    },


    Events: () => {

        $('#btnBuscar').on('click', async () => {
            ServicioSocial.ListarAtencionesParaEstadisticasServicioSocial()
        })
        $('#btnLimpiar').on('click', async () => {
            $('#txtDniBusqueda').val('')
            $('#txtApellPaternoBusqueda').val('')
            $('#txtFechaIngresoBusqueda').val('')
            $('#cboServicioBusqueda').val(0)

            $('.chzn-select').chosen().trigger("chosen:updated");
        })

        $('#btnAgregarServSocial').on('click', async () => {
            ServicioSocial.LimiarCampos()
            ServicioSocial.BloquearCampos(false)

            $('#txtFechaIngresoServS').val(year + '-' + month + '-' + day)
            $('#btnGuardarRegistroServicioSocial').show()
            $('#hdIdRegistro').val(0)
            $('#modalRegistroServicioSocial').modal('show')
        })
        $('#btnModificarServSocial').on('click', async () => {
            var objrow = oTable_ServicioSocial.api(true).row('.selected').data();

            ServicioSocial.LimiarCampos()

            $('#btnGuardarRegistroServicioSocial').show()

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un Registro')
            } else {
                $('#hdIdRegistro').val(objrow.idRegistro)
                ServicioSocial.BloquearCampos(false)
                ServicioSocial.SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro(objrow.idRegistro)
                $('#modalRegistroServicioSocial').modal('show')
            }
            
        })
        $('#btnConsultarServSocial').on('click', async () => {
            var objrow = oTable_ServicioSocial.api(true).row('.selected').data();

            ServicioSocial.LimiarCampos()

            $('#btnGuardarRegistroServicioSocial').hide()

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un Registro')
            } else {
                $('#hdIdRegistro').val(objrow.idRegistro)
                ServicioSocial.BloquearCampos(true)
                ServicioSocial.SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro(objrow.idRegistro)
                $('#modalRegistroServicioSocial').modal('show')
            }

        })

        $('#btnGuardarRegistroServicioSocial').on('click', async () => {
            ServicioSocial.CrearModificarRegistroServicioSocial()
        })
        $('#btnCerrarModalRegistroServicioSocial').on('click', async () => {
            $('#modalRegistroServicioSocial').modal('hide')
        })

        $('#txtARSServS').on('focusout', () => {
            $('#txtTotalRiesgoSocialServS').val((parseInt($('#txtARSServS').val()) ? parseInt($('#txtARSServS').val()) : 0) + (parseInt($('#txtMRSServS').val()) ? parseInt($('#txtMRSServS').val()) : 0) + (parseInt($('#txtBRSServS').val()) ? parseInt($('#txtBRSServS').val()) : 0) )
        })
        $('#txtMRSServS').on('focusout', () => {
            $('#txtTotalRiesgoSocialServS').val((parseInt($('#txtARSServS').val()) ? parseInt($('#txtARSServS').val()) : 0) + (parseInt($('#txtMRSServS').val()) ? parseInt($('#txtMRSServS').val()) : 0) + (parseInt($('#txtBRSServS').val()) ? parseInt($('#txtBRSServS').val()) : 0))
        })
        $('#txtBRSServS').on('focusout', () => {
            $('#txtTotalRiesgoSocialServS').val((parseInt($('#txtARSServS').val()) ? parseInt($('#txtARSServS').val()) : 0) + (parseInt($('#txtMRSServS').val()) ? parseInt($('#txtMRSServS').val()) : 0) + (parseInt($('#txtBRSServS').val()) ? parseInt($('#txtBRSServS').val()) : 0))
        })


        $('#txtGestionCoordinacionServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtReunionParejaFamServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtConsejeriaSocialServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtInformeTramiteServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtActaEntregaServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtInterconsultaServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })
        $('#txtReferenciaServS').on('focusout', () => {
            $('#txtTotalAtencionesSocialesServS').val(
                (parseInt($('#txtGestionCoordinacionServS').val()) ? parseInt($('#txtGestionCoordinacionServS').val()) : 0) +
                (parseInt($('#txtReunionParejaFamServS').val()) ? parseInt($('#txtReunionParejaFamServS').val()) : 0) +
                (parseInt($('#txtConsejeriaSocialServS').val()) ? parseInt($('#txtConsejeriaSocialServS').val()) : 0) +
                (parseInt($('#txtInformeTramiteServS').val()) ? parseInt($('#txtInformeTramiteServS').val()) : 0) +
                (parseInt($('#txtActaEntregaServS').val()) ? parseInt($('#txtActaEntregaServS').val()) : 0) +
                (parseInt($('#txtInterconsultaServS').val()) ? parseInt($('#txtInterconsultaServS').val()) : 0) +
                (parseInt($('#txtReferenciaServS').val()) ? parseInt($('#txtReferenciaServS').val()) : 0)
            )
        })

        $('#tblServicioSocial tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ServicioSocial.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


    }
}

$(document).ready(() => {

    ServicioSocial.Plugins()

    ServicioSocial.InitDatables()

    ServicioSocial.ServicioSeleccionarPorTipoServicio()
    ServicioSocial.ListarEmpleados()
    ServicioSocial.ListarTurnos()

    ServicioSocial.Events()

})