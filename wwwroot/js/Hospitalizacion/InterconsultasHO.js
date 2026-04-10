var permisoFirma4Identity = "";
var permisoClasiPaciente = "";

let InterconsultasHO = {

    EstablecimientoProcedenciaReferido: 0,

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()

        //$('#txtFechaIngreso').datepicker({ // se agrego txtProximaConsulta RQ0002
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom"
        //})
    },
    CargaInicial: async function () {
        //permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY");
        //permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC");

        InterconsultasHO.TiposClasificacionPaciente()


        if (permisoClasiPaciente == '0') { // jdelgado para el control de versiones
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }

        $("#ceAtencion-tab").css("pointer-events", "none");
    },

    TiposClasificacionPaciente: function () {
        let formData = new FormData();
        return HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=ConsultaExterna', formData).then(res => {

            if (res.lsClasiPac.table.length > 0) {
                $('#cboClasisifcacion').empty();
                $(res.lsClasiPac.table).each(function (i, obj) {
                    console.log()
                    $('#cboClasisifcacion').append('<option  value="' + obj.id + '" '+ (obj.id==7?'selected':'') +'>' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            } else {
                alerta(2, 'Error listar clasificacion!')
            }
        })
    },
    ServicioSeleccionarPorTipoServicio: function () {
        let formData = new FormData();
        formData.append('idTipoServicio', 3)

        return HttpClient.Post('/Servicios/ServicioSeleccionarPorTipoServicio?area=Comun', formData)
            .then(res => {
                console.log("ServicioSeleccionarPorTipoServicio", res.data.table)

                $('#cboServicio').empty();
                $('#cboServicio').append('<option  value="' + 0 + '"> Seleccionar Opcion </option>')
                $(res.data.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.idServicio + '">' + obj.codigo + ' - ' + obj.descripcion + '</option>')
                });
                //$(".hide_search").chosen({ disable_search_threshold: 10 });
                $('.chzn-select').chosen().trigger("chosen:updated")
            })
    },
    ListaPacientesHosp: function () {
        let formData = new FormData();
        formData.append('historiaClinica', $('#txtHistoria').val());
        formData.append('idReceta', $('#txtNroReceta').val());
        formData.append('dni', $('#txtNroDni').val());
        formData.append('apellidoPaterno', $('#txtApPaterno').val());
        formData.append('fechaIngreso', $('#txtFechaIngreso').val());
        formData.append('idServicio', $('#cboServicio').val());

        return HttpClient.Post('/InterconsultasHO/ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta?area=Hospitalizacion', formData)
            .then(res => {
                return res.data.table
            })
    },

    ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta: async function (idReceta) {

        let formData = new FormData()

        formData.append('historiaClinica', 0);
        formData.append('idReceta', idReceta);
        formData.append('dni', 0);
        formData.append('apellidoPaterno', '');
        formData.append('fechaIngreso', '');
        formData.append('idServicio', '');

        let response = await HttpClient.Post(`/InterconsultasHO/ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]
    },

    ListaAtencionByIdCuentaAtencionInterConsulta: function (idCuenta) { // JDELGADO J0 CAMBIO AJAX
        let formData = new FormData();
        formData.append('idCuenta', idCuenta);

        return HttpClient.Post('/Atencion/ListaAtencionByIdCuentaAtencionInterConsulta?area=ConsultaExterna', formData).then(res => {
            if (res.lstAtenciones.table.length > 0) {
                return res.lstAtenciones.table[0]
            }
            return null
        })
    },
    AtencionesDiagnosticosSeleccionarPorInterconsulta: function (idAtencion, idServicio, idAtencionInterconsulta) {
        Diagnosticos.LimpiarDiagnosticosAtencion();

        var formData = new FormData();
        formData.append('idAtencionInterconsulta', idAtencionInterconsulta);
        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);

        return HttpClient.Post('/Hospitalizacion/AtencionesDiagnosticosSeleccionarPorInterconsulta?area=Hospitalizacion', formData)
            .then(res => {
                console.log('diagnosticos', res)
                if (!isEmpty(res)) {
                    if (res.lsAtencionsCE.table.length > 0) {
                        Diagnosticos.ListaDiagnosticosAtencion(res.lsAtencionsCE.table);
                    }
                }

            })
    },
    ListaAtencionDetalleInterconsultaByIdCuentaAtencion: function (idCuenta, idReceta, idProducto) { // JDELGADO J0 CAMBIO AJAX
        let formData = new FormData();
        formData.append('idCuenta', idCuenta);
        formData.append('idReceta', idReceta);
        formData.append('idProducto', idProducto);

        return HttpClient.Post('/InterconsultasHO/ListaAtencionDetalleInterconsultaByIdCuentaAtencion?area=ConsultaExterna', formData).then(res => {
            if (!isEmpty(res) && res.lstAtenciones.table.length > 0) {
                console.log(res)
                return res.lstAtenciones.table[0]
            }
            return null
        })
    },
    CreateUpdateAtencionDetalleInterconsulta: function (idAtencionInterconsulta, idReceta, idCuentaAtencion, idProducto, idAtencion) {
        let formData = new FormData();
        let ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        presion = $("#txtPA").val() + "/" + $("#txtPAD").val()


        formData.append('idAtencionInterconsulta', idAtencionInterconsulta);
        formData.append('idReceta', idReceta);
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('TriajePresion', presion);
        formData.append('TriajeFrecuenciaCardiaca', $('#txtFc').val());
        formData.append('TriajeTemperatura', $('#txtT').val());
        formData.append('TriajePeso', $('#txtPeso').val());
        formData.append('TriajeTalla', $('#txtTalla').val());
        formData.append('TriajeSaturacionOxigeno', $('#txtSO').val());
        formData.append('TriajePC', $('#txtPC').val());
        formData.append('IdClasificacionPaciente', $('#cboClasisifcacion').val());
        formData.append('NroControles', $('#txtControles').val());
        formData.append('EdadGestacional', $('#txtEdadGestacional').val());
        formData.append('NroGestas', $('#txtGestas').val());
        formData.append('motivoInterconsulta', $('#txtMotivoCons').val());
        formData.append('apetito', $('#txtApetito').val());
        formData.append('orina', $('#txtOrina').val());
        formData.append('suenio', $('#txtSuenio').val());
        formData.append('sed', $('#txtSed').val());
        formData.append('deposiciones', $('#txtDiposiciones').val());
        formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
        formData.append('antecedAlergico', $('#txtAlergias').val());
        formData.append('antecedPatologico', $('#txtPatologicos').val());
        formData.append('antecedentes', $('#txtOtros').val());
        formData.append('antecedObstetrico', $('#txtObstetricos').val());
        formData.append('antecedFamiliar', $('#txtFamiliares').val());
        formData.append('examenClinico', $('#txtExamenC').val());
        formData.append('resumenHistoriaClinica', $('#txtResumenHistoriaClinica').val());
        formData.append('idProducto', idProducto);
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        formData.append('idAtencion', idAtencion);
        formData.append('hIniAtencion', $('#HoraInicioAtencion').val());

        formData.append('idTipoDestino', $('#cboDestino').val());
        formData.append('idTipoTeleconsulta', $('#cboTipoTeleconsulta').val());
        formData.append('idEstablecimientoReferencia', InterconsultasHO.EstablecimientoProcedenciaReferido);
        formData.append('otrasObservaciones', $('#txtOtrasObservacionesGe').val());
        formData.append('PlanTrabajo', $('#txtPlanTrabajo').val());
        formData.append('Tratamiento', $('#txtTratamiento').val());

        return HttpClient.Post('/InterconsultasHO/CreateUpdateAtencionDetalleInterconsulta?area=Hospitalizacion', formData)
            .then(res => {
                if (res.resp > 0) {
                    alerta(1, "La interconsulta fue registrada con exito")
                    $('#modalInterconsultasHo').modal('hide')
                }
            })
    },

    ListaDepartamentosReferencia: async function () {
        HttpClient.Get('/Utilitario/ListaDepartamentos?area=Comun').then(res => {
            $('#cmbdepEstbuscar').empty();
            $('#cmbdepEstbuscar').append(`<option value="0">-- Seleccionar --</option>`)
            $(res.lsDeparta.table).each(function (i, obj) {
                $('#cmbdepEstbuscar').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
            })


            InterconsultasHO.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
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
    ListaDestinosCE: () => {
        //console.log('oTable_atenciones', objrow)
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboDestino').empty();
                $(datos.table).each(function (i, obj) {

                    if (obj.idDestinoAtencion == 12 || obj.idDestinoAtencion == 61 || obj.idDestinoAtencion == 70) {
                        $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                    }


                });
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0)
                //AtencionMedica.listaDestinosCE();
                alerta("ERROR", "Error listar destinos!", "2");
            }
        });
    },

    CargarDatosInterconsulta: async function (cita) { // JDELGADO J0 CAMBIO ASYNC METHOD
        Cargando(1)

        Diagnosticos.LimpiarCampos()
        Limpiar()


        if (cita.idEstadoDetalle != 4) {
            Triaje.listaTriaje(cita.idAtencionEmeg_CE)
            objrowAtencion = await InterconsultasHO.ListaAtencionByIdCuentaAtencionInterConsulta(cita.idCuentaAtencion)

        } else {
            Triaje.listaTriajeInterconsulta(cita.idAtencion)
            objrowAtencion = await InterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(cita.idCuentaAtencion, cita.idOrden, cita.idProducto)

        }

        let objRowPacientes = await this.ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(cita.idOrden)

        //if (objRowPacientes.codigo == '99499.11') {
        $('#contTabDestino').show()
        //} else {
        //    $('#contTabDestino').hide()
        //}

        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        await InterconsultasHO.AtencionesDiagnosticosSeleccionarPorInterconsulta(objRowPacientes.idAtencion, 0, objRowPacientes.idAtencionInterconsulta)
        await VisorProcedimientos.BuscaAtencionesCptCEparaFormatoHISInterconsulta(objRowPacientes.idCuentaAtencion)

        $('#HoraInicioAtencion').val((objRowPacientes.horaInicioAtencion == "     " || objRowPacientes.horaInicioAtencion == "" ? time : objRowPacientes.horaInicioAtencion))
        // TRIAJE
        $("#txtPA").change()
        $("#txtPAD").change()
        $("#txtFc").change()
        $("#txtFr").change()
        $("#txtT").change()
        // END TRIAJE

        // DATOS PACIENTE
        $('#txtDatoCuenta').val(objRowPacientes.idCuentaAtencion)
        $('#txtDatoPaciente').val(objRowPacientes.apellidoPaterno + ' ' + objRowPacientes.apellidoMaterno + ' ' + objRowPacientes.nombres)
        $('#txtDatoHistoria').val(objRowPacientes.nroHistoriaClinica)
        $('#txtDatoEdad').val(objRowPacientes.edadPaciente)
        // END DATOS PACIENTE

        // ENTREVISTA
        $('#cboClasisifcacion').val(objRowPacientes.idClasificacionPaciente)
        $('#txtControles').val(objRowPacientes.nroControles)
        $('#txtEdadGestacional').val(objRowPacientes.edadGestacional)
        $('#txtGestas').val(objRowPacientes.nroGestas)
        $('#txtMotivoCons').val(objrowAtencion.motivoInterconsulta)
        $("#txtApetito").val(objrowAtencion.apetito)
        $("#txtSuenio").val(objrowAtencion.suenio)
        $("#txtSed").val(objrowAtencion.sed)
        $("#txtOrina").val(objrowAtencion.orina)
        $("#txtDiposiciones").val(objrowAtencion.deposiciones)
        $('#txtQuirurgicos').val(objrowAtencion.antecedQuirurgico)
        $('#txtPatologicos').val(objrowAtencion.antecedPatologico)
        $('#txtObstetricos').val(objrowAtencion.antecedObstetrico)
        $('#txtAlergias').val(objrowAtencion.antecedAlergico)
        $('#txtOtros').val(objrowAtencion.antecedentes)
        $('#txtFamiliares').val(objrowAtencion.antecedFamiliar)
        $('#txtExamenC').val(objrowAtencion.examenClinico)
        $('#txtResumenHistoriaClinica').val(objrowAtencion.resumenHistoriaClinica)
        // END ENTREVISTA

        // DIAGNOSTICOS
        $('#txtPlanTrabajo').val(objrowAtencion.planTrabajo)
        $('#txtTratamiento').val(objrowAtencion.tratamiento)
        // END DIAGNOSTICOS

        $('#cboDestino').val(objRowPacientes.idTipoDestino)
        $('#cboTipoTeleconsulta').val(objRowPacientes.idTipoTeleconsulta)
        $('#txtOtrasObservacionesGe').val(objRowPacientes.otrasObservaciones)

        $('#txtIdReferenciaCita').val(objRowPacientes.codigoEstablecimiento)
        $('#txtDescripcionReferenciaCita').val(objRowPacientes.nombreEstablecimiento)



        InterconsultasHO.EstablecimientoProcedenciaReferido = objRowPacientes.IdEstablecimientoReferencia


        $('.chzn-select').chosen().trigger("chosen:updated")

        bloqueo($('#cboClasisifcacion').val());

        //if (tipoBoton == '1') {
        //    BloquearMostrarCampos(false)
        //} else {
        //    BloquearMostrarCampos(true)
        //}

        //$('.nav-tabs a[href="#ceAtencion"]').tab('show')

        Cargando(0)

    },

    InitDatablesPacintesHosp: function () {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '7%',
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "descripcionProcedimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.idEstadoDetalle == 4) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "10%",
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirEvalCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarEvalSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirEvalSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]
        }

        var tableWrapper = $('#tblPacientesHosp') // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

        oTable_PacientesHosp = $("#tblPacientesHosp").dataTable(parms)
    },
    InitDatablesConsumoAtencion() {

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
                    width: '20%',
                    targets: 0,
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
                    width: '60%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 2,
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

    Events: function () {
        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            let valorClas = $("#cboClasisifcacion").val()
            bloqueo(valorClas)

        })

        $('#cmbdepEstbuscar').on('change', function () {
            InterconsultasHO.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
            InterconsultasHO.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })
        $('#cmbprovEstBuscar').on('change', function () {
            InterconsultasHO.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })

        $('#btnBuscarPacientes').on('click', async function () {
            Cargando(1)

            if ($('#txtHistoria').val() == '' && $('#txtNroReceta').val() == '' && $('#txtNroDni').val() == '' && $('#txtApPaterno').val() == '' && $('#txtFechaIngreso').val() == '' && $('#cboServicio').val() == 0) {
                alerta(2, 'Ingresa al menos uno de los criterios de busqueda')
                Cargando(0)
                return false
            }

            let listaPacientes = await InterconsultasHO.ListaPacientesHosp()
            oTable_PacientesHosp.fnClearTable()
            if (listaPacientes.length > 0) {
                oTable_PacientesHosp.fnAddData(listaPacientes)
            }
            Cargando(0)
        })

        $('#btnAgregarCSAtencion').on('click', function () {
            ConsumoServicio.bloqueoProcedencia()
            ConsumoServicio.limpiar()
            let objRowPacientes = oTable_PacientesHosp.api(true).row('.selected').data()
            $("#txtNroCuentaRegistro").val(objRowPacientes.idCuentaAtencion)
            ConsumoServicio.listaPorCuenta(objRowPacientes.idCuentaAtencion, 1)
            $('#modalConsumoServicio').modal('show')
        })
        $('#btnModificarAtenciones').on('click', function () {
            Mostrar('1')
        })
        $('#btnConsultarAtenciones').on('click', function () {
            Mostrar('2')
        })
        $('#btnguardar').on('click', function () {

            let cantidadtDiagnosticos = Diagnosticos.DevolverDiagnosticos();

            if (permisoClasiPaciente == 1) {
                if (isEmpty($("#cboClasisifcacion").val())) {
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                    alerta('2', 'Seleccione Clasificacion de Paciente');
                    $("#cboClasisifcacion").focus()
                    return false
                }
            }

            if (cantidadtDiagnosticos.count() == 0) {
                alerta('2', 'Ingrese Diagnosticos');
                $('.nav-tabs a[href="#diagnosticos"]').tab('show');
                return false;
            }
            Guardar()
        })

        $('#btnguardarInterconsulta').on('click', async function () {

            let objCupo = oTable_cupos.api(true).row('.selected').data()

            let cita = await CitasTerapia.ListaCitaTerapiaByIdCita(objCupo.idCita)

            let cantidadtDiagnosticos = Diagnosticos.DevolverDiagnosticos();

            if (permisoClasiPaciente == 1) {
                if (isEmpty($("#cboClasisifcacion").val())) {
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                    alerta('2', 'Seleccione Clasificacion de Paciente');
                    $("#cboClasisifcacion").focus()
                    return false
                }
            }

            if (cantidadtDiagnosticos.count() == 0) {
                alerta('2', 'Ingrese Diagnosticos');
                $('.nav-tabs a[href="#diagnosticos"]').tab('show');
                return false;
            }

            await GuardarInterconsulta(cita)
        })
        $('#btnCerrarAtencion').on('click', function () {
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
        })

        $('#btnOpenModalEstablecimientoReferenciaCita').on('click', function () {

            $('#divCodigoRenaes').show()
            $('#modalEstablecimientosBuscar').modal('show')
        })
        $('#btnCerraEstablecimientoBuscar').on('click', function () {

            $('#modalEstablecimientosBuscar').modal('hide')
        })


        $('#btnImprimeInforme').on('click', async function () {
            Cargando(1);
            let objCupo = oTable_cupos.api(true).row('.selected').data()

            let cita = await CitasTerapia.ListaCitaTerapiaByIdCita(objCupo.idCita)

            var row = await InterconsultasHO.ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(cita.idOrden)

            
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarInterconsultaPdfV2(row.idCuentaAtencion, row.idAtencionInterconsulta, row.idProducto, row.idReceta);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarPacientes").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

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

        $('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporte');
            objFra.contentWindow.focus();
            objFra.contentWindow.print();

            ListaAtencionesCE();
        });
        $("#modalConsumoServicio").on('hidden.bs.modal', function () {
            let objRowPacientes = oTable_PacientesHosp.api(true).row('.selected').data()
            VisorProcedimientos.BuscaAtencionesCptCEparaFormatoHISInterconsulta(objRowPacientes.idCuentaAtencion)
        });

        $('#tblPacientesHosp tbody').on('click', '.ImprimeInformeSF', async function () {

            var objrow = oTable_PacientesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_PacientesHosp.fnGetData(objrow);

            Cargando(1);
            console.log('row', row)
            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idAtencionInterconsulta, 'INTER')               //KHOYOSI

            console.log('firma', firma)
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                //idCuentaAtencion, idAtencionInterconsulta, idProducto
                const pdf = await Utilitario.GenerarInterconsultaPdfV2(row.idCuentaAtencion, row.idAtencionInterconsulta, row.idProducto, row.idReceta);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);

            //console.log('objRowPacientes', objRowPacientes)
            //console.log('objRowPacientes', objRowPacientes)

            //AbrirVisorDocumento(objRowPacientes.rutaArchivoInterconsulta, 0);
        });
        $('#tblPacientesHosp tbody').on('click', 'tr', function () {
            oTable_PacientesHosp.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')
        })
        $('#tblCSAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
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

            InterconsultasHO.EstablecimientoProcedenciaReferido = objrow.idEstablecimiento


            $('#modalEstablecimientosBuscar').modal('hide')
        })

        $('#tblPacientesHosp tbody').on('click', '.ImprimirEvalSF', async function () {
            var objrow = oTable_PacientesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_PacientesHosp.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarInterconsultaPdfV2(row.idCuentaAtencion, row.idAtencionInterconsulta, row.idProducto, row.idReceta);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarPacientes").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblPacientesHosp tbody').on('click', '.FirmarEvalSF', async function () {
            var objrow = oTable_PacientesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_PacientesHosp.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'INTER-HO';
                //await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                await Utilitario.IniciarServicioFirmaBit4Id(row.code);
                //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code);
                //if (firma) {
                //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                //}
            }
            Cargando(0);
        });

        $('#tblPacientesHosp tbody').on('click', '.ImprimirEvalCF', async function () {
            var objrow = oTable_PacientesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_PacientesHosp.fnGetData(objrow);

            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });
    }
}

function Limpiar() {
    $('#chkNuevo').prop('checked', false)
    $('#chkCierre').prop('checked', false)
    $('#idCuentaAtencion').val(0);
    //$('#txtHoraCia').val("");
    //$('#HoraInicioAtencion').val(""); verificar si van o no
}

//  tipoBoton -> 1 - Modificar, 2 - Consultar
async function Mostrar(tipoBoton) { // JDELGADO J0 CAMBIO ASYNC METHOD
    Cargando(1)
    let objRowPacientes = oTable_PacientesHosp.api(true).row('.selected').data()


    Diagnosticos.LimpiarCampos()
    Limpiar()
    if (isEmpty(objRowPacientes)) {
        alerta(2, 'Seleccione un registro')
        $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
        Cargando(0)
        return false
    }

    if (objRowPacientes.idEstadoDetalle != 4) {
        Triaje.listaTriaje(objRowPacientes.idAtencionEmeg_CE)
        objrowAtencion = await InterconsultasHO.ListaAtencionByIdCuentaAtencionInterConsulta(objRowPacientes.idCuentaAtencion)
        console.log('estado detalle != 4', objrowAtencion)
    } else {
        Triaje.listaTriajeInterconsulta(objRowPacientes.idAtencion)
        objrowAtencion = await InterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(objRowPacientes.idCuentaAtencion, objRowPacientes.idReceta, objRowPacientes.idProducto)
        console.log('objRowPacientes', objRowPacientes)
        console.log('estado detalle == 4', objrowAtencion)
    }

    if (objRowPacientes.codigo == '99499.11') {
        $('#contTabDestino').show()
    } else {
        $('#contTabDestino').hide()
    }

    let dt = new Date();
    let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

    await InterconsultasHO.AtencionesDiagnosticosSeleccionarPorInterconsulta(objRowPacientes.idAtencion, 0, objRowPacientes.idAtencionInterconsulta)
    await VisorProcedimientos.BuscaAtencionesCptCEparaFormatoHISInterconsulta(objRowPacientes.idCuentaAtencion)

    $('#HoraInicioAtencion').val((objRowPacientes.horaInicioAtencion == "     " || objRowPacientes.horaInicioAtencion == "" ? time : objRowPacientes.horaInicioAtencion))
    // TRIAJE
    $("#txtPA").change()
    $("#txtPAD").change()
    $("#txtFc").change()
    $("#txtFr").change()
    $("#txtT").change()
    // END TRIAJE

    // DATOS PACIENTE
    $('#txtDatoCuenta').val(objRowPacientes.idCuentaAtencion)
    $('#txtDatoPaciente').val(objRowPacientes.apellidoPaterno + ' ' + objRowPacientes.apellidoMaterno + ' ' + objRowPacientes.nombres)
    $('#txtDatoHistoria').val(objRowPacientes.nroHistoriaClinica)
    $('#txtDatoEdad').val(objRowPacientes.edadPaciente)
    // END DATOS PACIENTE

    // ENTREVISTA
    $('#cboClasisifcacion').val(objRowPacientes.idClasificacionPaciente)
    $('#txtControles').val(objRowPacientes.nroControles)
    $('#txtEdadGestacional').val(objRowPacientes.edadGestacional)
    $('#txtGestas').val(objRowPacientes.nroGestas)
    $('#txtMotivoCons').val(objrowAtencion.motivoInterconsulta)
    $("#txtApetito").val(objrowAtencion.apetito)
    $("#txtSuenio").val(objrowAtencion.suenio)
    $("#txtSed").val(objrowAtencion.sed)
    $("#txtOrina").val(objrowAtencion.orina)
    $("#txtDiposiciones").val(objrowAtencion.deposiciones)
    $('#txtQuirurgicos').val(objrowAtencion.antecedQuirurgico)
    $('#txtPatologicos').val(objrowAtencion.antecedPatologico)
    $('#txtObstetricos').val(objrowAtencion.antecedObstetrico)
    $('#txtAlergias').val(objrowAtencion.antecedAlergico)
    $('#txtOtros').val(objrowAtencion.antecedentes)
    $('#txtFamiliares').val(objrowAtencion.antecedFamiliar)
    $('#txtExamenC').val(objrowAtencion.examenClinico)
    $('#txtResumenHistoriaClinica').val(objrowAtencion.resumenHistoriaClinica)
    // END ENTREVISTA

    // DIAGNOSTICOS
    $('#txtPlanTrabajo').val(objrowAtencion.planTrabajo)
    $('#txtTratamiento').val(objrowAtencion.tratamiento)
    // END DIAGNOSTICOS

    $('#cboDestino').val(objRowPacientes.idTipoDestino)
    $('#cboTipoTeleconsulta').val(objRowPacientes.idTipoTeleconsulta)
    $('#txtOtrasObservacionesGe').val(objRowPacientes.otrasObservaciones)

    $('#txtIdReferenciaCita').val(objRowPacientes.codigoEstablecimiento)
    $('#txtDescripcionReferenciaCita').val(objRowPacientes.nombreEstablecimiento)



    InterconsultasHO.EstablecimientoProcedenciaReferido = objRowPacientes.IdEstablecimientoReferencia


    $('.chzn-select').chosen().trigger("chosen:updated")

    bloqueo($('#cboClasisifcacion').val());

    if (tipoBoton == '1') {
        BloquearMostrarCampos(false)
    } else {
        BloquearMostrarCampos(true)
    }

    $('.nav-tabs a[href="#ceAtencion"]').tab('show')

    Cargando(0)
    Cargando(0)

}

async function Guardar() {


    Cargando(1)

    let objRowPacientes = oTable_PacientesHosp.api(true).row('.selected').data()
    let objrowAtencion

    //if (objRowPacientes.idEstadoDetalle != 4) {
    //    objrowAtencion = await InterconsultasHO.ListaAtencionByIdCuentaAtencionInterConsulta(objRowPacientes.idCuentaAtencion)
    //} else {
    //    objrowAtencion = await InterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(objRowPacientes.idCuentaAtencion, objRowPacientes.idReceta, objRowPacientes.idProducto)
    //}

    await InterconsultasHO.CreateUpdateAtencionDetalleInterconsulta(objRowPacientes.idAtencionInterconsulta, objRowPacientes.idReceta, objRowPacientes.idCuentaAtencion, objRowPacientes.idProducto, objRowPacientes.idAtencion)

    $('.nav-tabs a[href="#lsAtenciones"]').tab('show');

    $('#btnBuscarPacientes').trigger('click')

    //if (objrowAtencion.idEstadoAtencion == 1) { // preguntar esta validacion

    //    await InterconsultasHO.CreateUpdateAtencionDetalleInterconsulta(objRowPacientes.idAtencionInterconsulta, objRowPacientes.idReceta, objRowPacientes.idCuentaAtencion, objRowPacientes.idProducto, objRowPacientes.idAtencion)

    //    $('.nav-tabs a[href="#lsAtenciones"]').tab('show');

    //    $('#btnBuscarPacientes').trigger('click')
    //}
    //else {
    //    alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
    //}




    Cargando(0)
}

async function GuardarInterconsulta(cita) {


    Cargando(1)

    let objRowPacientes = await InterconsultasHO.ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(cita.idOrden)
    let objrowAtencion

    //if (objRowPacientes.idEstadoDetalle != 4) {
    //    objrowAtencion = await InterconsultasHO.ListaAtencionByIdCuentaAtencionInterConsulta(objRowPacientes.idCuentaAtencion)
    //} else {
    //    objrowAtencion = await InterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(objRowPacientes.idCuentaAtencion, objRowPacientes.idReceta, objRowPacientes.idProducto)
    //}

    await InterconsultasHO.CreateUpdateAtencionDetalleInterconsulta(objRowPacientes.idAtencionInterconsulta, objRowPacientes.idReceta, objRowPacientes.idCuentaAtencion, objRowPacientes.idProducto, objRowPacientes.idAtencion)

    //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');

    //$('#btnBuscarPacientes').trigger('click')

    //if (objrowAtencion.idEstadoAtencion == 1) { // preguntar esta validacion

    //    await InterconsultasHO.CreateUpdateAtencionDetalleInterconsulta(objRowPacientes.idAtencionInterconsulta, objRowPacientes.idReceta, objRowPacientes.idCuentaAtencion, objRowPacientes.idProducto, objRowPacientes.idAtencion)

    //    $('.nav-tabs a[href="#lsAtenciones"]').tab('show');

    //    $('#btnBuscarPacientes').trigger('click')
    //}
    //else {
    //    alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
    //}




    Cargando(0)
}

function BloquearMostrarCampos(estado) {
    // TRIAJE
    $("#txtPA").attr("disabled", estado)
    $("#txtPAD").attr("disabled", estado)
    $("#txtFc").attr("disabled", estado)
    $("#txtFr").attr("disabled", estado)
    $("#txtT").attr("disabled", estado)
    $("#txtPeso").attr("disabled", estado)
    $("#txtTalla").attr("disabled", estado)
    $("#txtSO").attr("disabled", estado)
    // END TRIAJE

    // DATOS PACIENTE
    //$('#txtDatoCuenta').attr("disabled", estado)
    //$('#txtDatoPaciente').attr("disabled", estado)
    //$('#txtDatoHistoria').attr("disabled", estado)
    //$('#txtDatoEdad').attr("disabled", estado)
    // END DATOS PACIENTE

    // ENTREVISTA
    $('#cboClasisifcacion').attr("disabled", estado)
    $('#txtControles').attr("disabled", estado)
    $('#txtEdadGestacional').attr("disabled", estado)
    $('#txtGestas').attr("disabled", estado)
    $('#txtMotivoCons').attr("disabled", estado)
    $("#txtApetito").attr("disabled", estado)
    $("#txtSuenio").attr("disabled", estado)
    $("#txtSed").attr("disabled", estado)
    $("#txtOrina").attr("disabled", estado)
    $("#txtDiposiciones").attr("disabled", estado)
    $('#txtQuirurgicos').attr("disabled", estado)
    $('#txtPatologicos').attr("disabled", estado)
    $('#txtObstetricos').attr("disabled", estado)
    $('#txtAlergias').attr("disabled", estado)
    $('#txtOtros').attr("disabled", estado)
    $('#txtFamiliares').attr("disabled", estado)
    $('#txtExamenC').attr("disabled", estado)
    $('#txtResumenHistoriaClinica').attr("disabled", estado)
    // END ENTREVISTA

    // DIAGNOSTICOS
    $('#txtPlanTrabajo').attr("disabled", estado)
    $('#txtTratamiento').attr("disabled", estado)
    // END DIAGNOSTICOS

    $('#btnguardar').attr("disabled", estado)
    if (estado) {
        $('#btnguardar').css("visibility", 'hidden')
    } else {
        $('#btnguardar').css("visibility", 'visible');
    }
}
function bloqueo(valorClas) {
    switch (valorClas) {
        case "1":
            $('#txtControles').attr("disabled", false);
            $('#txtEdadGestacional').attr("disabled", false);
            $('#txtGestas').attr("disabled", false);
            break;
        case "2":
            $('#txtControles').attr("disabled", false);
            $('#txtEdadGestacional').attr("disabled", true);
            $('#txtGestas').attr("disabled", false);
            break;
        case "3":
            $('#txtControles').attr("disabled", false);
            $('#txtEdadGestacional').attr("disabled", true);
            $('#txtGestas').attr("disabled", true);

            break;
        case "4":
            $('#txtControles').attr("disabled", false);
            $('#txtEdadGestacional').attr("disabled", true);
            $('#txtGestas').attr("disabled", false);
            break;
        default:
            $('#txtControles').attr("disabled", true);
            $('#txtEdadGestacional').attr("disabled", true);
            $('#txtGestas').attr("disabled", true);
            break;
        // code block
    }
}
$(document).ready(function () {
    InterconsultasHO.Plugins()
    InterconsultasHO.CargaInicial()

    InterconsultasHO.ServicioSeleccionarPorTipoServicio()

    InterconsultasHO.InitDatablesPacintesHosp()
    InterconsultasHO.InitDatablesConsumoAtencion()
    InterconsultasHO.InitDatablesEstablecimientos()

    InterconsultasHO.ListaDepartamentosReferencia()
    InterconsultasHO.ListaDestinosCE()

    InterconsultasHO.Events()
});