let EventosAdversos = {
    IdPaciente: 0,
    IdEventoAdverso: 0,
    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('.chzn-select').chosen().trigger("chosen:updated")



        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $('#txtFechaRegistroBusq, #txtFechaNotificacion, #txtFechaIngreso').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $('#txtFechaRegistroBusq, #txtFechaNotificacion, #txtFechaIngreso').mask("Dd/Mm/abcd");


        $("#txtHoraNotificacion, #txtHoraEvento, #txtHoraIngreso").mask("Hn:Nn");
    },

    InitDatablesEventosAdversos() {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '80vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "idEventoAdverso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 4,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "edad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "fechaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

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

        var tableWrapper = $('#tblEventosAdversos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EventosAdversos = $("#tblEventosAdversos").dataTable(parms);
    },

    GuardarDatos: async function () {

        let formData = new FormData()

        formData.append('IdEventoAdverso', EventosAdversos.IdEventoAdverso);
        formData.append('IdPaciente', EventosAdversos.IdPaciente);
        formData.append('FechaNotificacion', $('#txtFechaNotificacion').val());
        formData.append('HoraNotificacion', $('#txtHoraNotificacion').val());
        formData.append('ServicioNotifica', $('#cboServicioNotifica').val());
        formData.append('LugarOcurrencia', $('#txtLugarOcurrencia').val());
        formData.append('HoraEvento', $('#txtHoraEvento').val());
        formData.append('FechaIngreso', $('#txtFechaIngreso').val());
        formData.append('HoraIngreso', $('#txtHoraIngreso').val());
        formData.append('MuerteMaterna', $('#chkMuerteMaterna').is(':checked'));
        formData.append('ObitoFetalIntrahospitalaria', $('#chkObitoFetalIntrahospitalaria').is(':checked'));
        formData.append('MuerteNeonatal', $('#chkMuerteNeonatal').is(':checked'));
        formData.append('EventoEquipoBiomedico', $('#chkEventoEquipoBiomedico').is(':checked'));

        formData.append('SepsisPostOperatoria', $('#chkSepsisPostOperatoria').is(':checked'));
        formData.append('InfeccionHeridaOperatoria', $('#chkInfeccionHeridaOperatoria').is(':checked'));
        formData.append('Endometria', $('#chkEndometria').is(':checked'));
        formData.append('SepsisNeonatal', $('#chkSepsisNeonatal').is(':checked'));
        formData.append('Flebitis', $('#chkFlebitis').is(':checked'));

        formData.append('CefaloHematoma', $('#chkCefaloHematoma').is(':checked'));
        formData.append('LesionPlexoBraquial', $('#chkLesionPlexoBraquial').is(':checked'));
        formData.append('FracturaClavicula', $('#chkFracturaClavicula').is(':checked'));
        formData.append('AsfixiaNeonatal', $('#chkAsfixiaNeonatal').is(':checked'));
        formData.append('SindromeAspiracionLiquido', $('#chkSindromeAspiracionLiquido').is(':checked'));

        formData.append('ComplicacionesAnestesicas', $('#chkComplicacionesAnestesicas').is(':checked'));
        formData.append('LesionIntraoperatoriaRecienNacido', $('#chkLesionIntraoperatoriaRecienNacido').is(':checked'));
        formData.append('PerforacionUterinaPostLegrado', $('#chkPerforacionUterinaPostLegrado').is(':checked'));
        formData.append('CaidaPaciente', $('#chkCaidaPaciente').is(':checked'));
        formData.append('ErrorIdentificacionSexoRecienNacido', $('#chkErrorIdentificacionSexoRecienNacido').is(':checked'));
        formData.append('CuerpoExtranioPostCirugia', $('#chkCuerpoExtranioPostCirugia').is(':checked'));
        formData.append('ComplicacionesIntraPostOperatorio', $('#chkComplicacionesIntraPostOperatorio').is(':checked'));
        formData.append('EventoAdversoRelacionadoIntubacion', $('#chkEventoAdversoRelacionadoIntubacion').is(':checked'));
        formData.append('RelacionTransfusional', $('#chkRelacionTransfusional').is(':checked'));

        formData.append('ErrorMedicacion', $('#chkErrorMedicacion').is(':checked'));
        formData.append('ReaccionAdversa', $('#chkReaccionAdversa').is(':checked'));

        formData.append('DesgarroVaginal', $('#chkDesgarroVaginal').is(':checked'));
        formData.append('Hematomas', $('#chkHematomas').is(':checked'));
        formData.append('RupturaUterina', $('#chkRupturaUterina').is(':checked'));
        formData.append('DesgarroCervical', $('#chkDesgarroCervical').is(':checked'));
        formData.append('AnemiaAgudaPostProcedimiento', $('#chkAnemiaAgudaPostProcedimiento').is(':checked'));
        formData.append('RetencionGasaVaginalPostParto', $('#chkRetencionGasaVaginalPostParto').is(':checked'));
        formData.append('TraumaObstetricoMaternoOtros', $('#chkTraumaObstetricoMaternoOtros').is(':checked'));
        formData.append('DescripcionTraumaObstetricoMaternoOtros', $('#txtTraumaObstetricoMaternoOtros').val());

        formData.append('LaceracionEsparadrapo', $('#chkLaceracionEsparadrapo').is(':checked'));
        formData.append('QuemaduraTermicaElectrica', $('#chkQuemaduraTermicaElectrica').is(':checked'));
        formData.append('NeumoniaVentiladorMecanico', $('#chkNeumoniaVentiladorMecanico').is(':checked'));
        formData.append('DehiscenciaEspisorrafia', $('#chkDehiscenciaEspisorrafia').is(':checked'));
        formData.append('ObitoFetalExtrahospitalario', $('#chkObitoFetalExtrahospitalario').is(':checked'));
        formData.append('InfeccionTractoUrinarioPostCateter', $('#chkInfreccionTractoUrinarioPostCateter').is(':checked'));
        formData.append('ConjuntivitisRecienNacido', $('#chkConjuntivitisRecienNacido').is(':checked'));
        formData.append('Onfalitis', $('#chkOnfalitis').is(':checked'));
        formData.append('PiodermitisNeonatal', $('#chkPiodermitisNeonatal').is(':checked'));
        formData.append('OtrasFracturasRecienNacido', $('#chkOtrasFracturasRecienNacido').is(':checked'));
        formData.append('OtrosEventosAdversos', $('#chkOtrosEventosAdversos').is(':checked'));
        formData.append('DescripcionOtrosEventosAdversos', $('#txtOtrosEventosAdversos').val());

        formData.append('DescripcionEventoAdverso', $('#txtDescripcionEventoAdverso').val());
        formData.append('EventoAdversoPrevenible', $('input[name="rdbEventoAdversoPrevenible"]:checked').val());
        formData.append('ComoPrevenirEventoAdverso', $('#txtComoPrevenirEventoAdverso').val());

        ////////////////////DIAGNOSTICOS//////////////////////////////
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        /////////////////////////////////////////////////////////////

        let response = await HttpClient.Post(`/EventoAdverso/GuardarEventoAdverso`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        //NotaEnfermeria.IdNotaEnfermeria = data[0].idNotaEnfermeria

        console.log('data', data)

    },

    CargarDatos: async function (data) {

        EventosAdversos.IdEventoAdverso = data.idEventoAdverso
        EventosAdversos.IdPaciente = data.idPaciente

        $('#txtDatoHistoria').val(data.nroHistoriaClinica);
        $('#txtDatoCuenta').val(data.idCuentaAtencion);
        $('#txtDatoPaciente').val(data.paciente);
        $('#txtDatoEdad').val(data.edad);

        $('#txtFechaNotificacion').datepicker("setDate", FormatearFecha(data.fechaNotificacion))

        $('#txtHoraNotificacion').val(data.horaNotificacion);
        $('#cboServicioNotifica').val(data.servicioNotifica);
        $('#txtLugarOcurrencia').val(data.lugarOcurrencia);
        $('#txtHoraEvento').val(data.horaEvento);
        $('#txtFechaIngreso').datepicker("setDate", FormatearFecha(data.fechaIngreso))
        $('#txtHoraIngreso').val(data.horaIngreso);

        $('#chkMuerteMaterna').prop('checked', data.muerteMaterna);
        $('#chkObitoFetalIntrahospitalaria').prop('checked', data.obitoFetalIntrahospitalaria);
        $('#chkMuerteNeonatal').prop('checked', data.muerteNeonatal);
        $('#chkEventoEquipoBiomedico').prop('checked', data.eventoEquipoBiomedico);

        $('#chkSepsisPostOperatoria').prop('checked', data.sepsisPostOperatoria);
        $('#chkInfeccionHeridaOperatoria').prop('checked', data.infeccionHeridaOperatoria);
        $('#chkEndometria').prop('checked', data.endometria);
        $('#chkSepsisNeonatal').prop('checked', data.sepsisNeonatal);
        $('#chkFlebitis').prop('checked', data.flebitis);

        $('#chkCefaloHematoma').prop('checked', data.cefaloHematoma);
        $('#chkLesionPlexoBraquial').prop('checked', data.lesionPlexoBraquial);
        $('#chkFracturaClavicula').prop('checked', data.fracturaClavicula);
        $('#chkAsfixiaNeonatal').prop('checked', data.asfixiaNeonatal);
        $('#chkSindromeAspiracionLiquido').prop('checked', data.sindromeAspiracionLiquido);

        $('#chkComplicacionesAnestesicas').prop('checked', data.complicacionesAnestesicas);
        $('#chkLesionIntraoperatoriaRecienNacido').prop('checked', data.lesionIntraoperatoriaRecienNacido);
        $('#chkPerforacionUterinaPostLegrado').prop('checked', data.perforacionUterinaPostLegrado);
        $('#chkCaidaPaciente').prop('checked', data.caidaPaciente);
        $('#chkErrorIdentificacionSexoRecienNacido').prop('checked', data.errorIdentificacionSexoRecienNacido);
        $('#chkCuerpoExtranioPostCirugia').prop('checked', data.cuerpoExtranioPostCirugia);
        $('#chkComplicacionesIntraPostOperatorio').prop('checked', data.complicacionesIntraPostOperatorio);
        $('#chkEventoAdversoRelacionadoIntubacion').prop('checked', data.eventoAdversoRelacionadoIntubacion);
        $('#chkRelacionTransfusional').prop('checked', data.relacionTransfusional);

        $('#chkErrorMedicacion').prop('checked', data.errorMedicacion);
        $('#chkReaccionAdversa').prop('checked', data.reaccionAdversa);

        $('#chkDesgarroVaginal').prop('checked', data.desgarroVaginal);
        $('#chkHematomas').prop('checked', data.hematomas);
        $('#chkRupturaUterina').prop('checked', data.rupturaUterina);
        $('#chkDesgarroCervical').prop('checked', data.desgarroCervical);
        $('#chkAnemiaAgudaPostProcedimiento').prop('checked', data.anemiaAgudaPostProcedimiento);
        $('#chkRetencionGasaVaginalPostParto').prop('checked', data.retencionGasaVaginalPostParto);
        $('#chkTraumaObstetricoMaternoOtros').prop('checked', data.traumaObstetricoMaternoOtros);
        $('#txtTraumaObstetricoMaternoOtros').val(data.descripcionTraumaObstetricoMaternoOtros);

        $('#chkLaceracionEsparadrapo').prop('checked', data.laceracionEsparadrapo);
        $('#chkQuemaduraTermicaElectrica').prop('checked', data.quemaduraTermicaElectrica);
        $('#chkNeumoniaVentiladorMecanico').prop('checked', data.neumoniaVentiladorMecanico);
        $('#chkDehiscenciaEspisorrafia').prop('checked', data.dehiscenciaEspisorrafia);
        $('#chkObitoFetalExtrahospitalario').prop('checked', data.obitoFetalExtrahospitalario);
        $('#chkInfreccionTractoUrinarioPostCateter').prop('checked', data.infeccionTractoUrinarioPostCateter);
        $('#chkConjuntivitisRecienNacido').prop('checked', data.conjuntivitisRecienNacido);
        $('#chkOnfalitis').prop('checked', data.onfalitis);
        $('#chkPiodermitisNeonatal').prop('checked', data.piodermitisNeonatal);
        $('#chkOtrasFracturasRecienNacido').prop('checked', data.otrasFracturasRecienNacido);
        $('#chkOtrosEventosAdversos').prop('checked', data.otrosEventosAdversos);
        $('#txtOtrosEventosAdversos').val(data.descripcionOtrosEventosAdversos);

        $('#txtDescripcionEventoAdverso').val(data.descripcionEventoAdverso);
        $('input[name="rdbEventoAdversoPrevenible"][value="' + data.eventoAdversoPrevenible + '"]').prop('checked', true);
        $('#txtComoPrevenirEventoAdverso').val(data.comoPrevenirEventoAdverso);

        await Diagnosticos.SeleccionarDiagnosticosEventosAdversos(data.idEventoAdverso, 1);

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    ServiciosFiltrar: async function (codigo, descripcion) {
        Cargando(1);

        let formData = new FormData();

        let filtro = `where Servicios.idEstado=1`

        //oTable_Servicios.fnClearTable()

        //if (codigo != '') {
        //    filtro += ` and Servicios.Codigo = '${codigo}'`
        //}

        //if (descripcion != '') {
        //    filtro += ` and Servicios.Nombre like '%${descripcion}%'`
        //}

        filtro += ' order by Servicios.Nombre, Especialidades.Nombre'

        formData.append('lcFiltro', filtro);

        const res = await HttpClient.Post('/Utilitario/ServiciosFiltrar?area=Comun', formData);

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {

            $(data).each(function (i, obj) {
                $('#cboServicioNotifica').append(`<option value="${obj.idServicio}">${obj.nombre}</option>`)
            })
        }

        $('.chzn-select').chosen().trigger("chosen:updated")
        Cargando(0)
    },

    PacientesSeleccionarPorNroHistoriaClinicaAsync: async function () {

        let formData = new FormData()

        formData.append('nroHistoria', $('#txtDatoHistoria').val());

        let response = await HttpClient.Post(`/Paciente/PacientesSeleccionarPorNroHistoriaClinicaAsyncMethod`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        //NotaEnfermeria.IdNotaEnfermeria = data[0].idNotaEnfermeria
        return data

    },

    ListarEventosAdversos: async function () {

        let formData = new FormData()

        formData.append('nroHistoria', $('#txtDatoHistoria').val());

        let response = await HttpClient.Post(`/EventoAdverso/ListarEventosAdversos`, formData)

        oTable_EventosAdversos.fnClearTable()

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        oTable_EventosAdversos.fnAddData(data)

        //NotaEnfermeria.IdNotaEnfermeria = data[0].idNotaEnfermeria
        return data

    },

    SeleccionarEventoAdversoById: async function (IdEventoAdverso) {

        let formData = new FormData()

        formData.append('IdEventoAdverso', IdEventoAdverso)

        let response = await HttpClient.Post(`/EventoAdverso/SeleccionarEventoAdversoById`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        //NotaEnfermeria.IdNotaEnfermeria = data[0].idNotaEnfermeria
        return data[0]

    },

    LimpiarFormulario: function () {

        EventosAdversos.IdEventoAdverso = 0
        EventosAdversos.IdPaciente = 0
        
        $('#txtDatoHistoria').val('');
        $('#txtDatoCuenta').val('');
        $('#txtDatoPaciente').val('');
        $('#txtDatoEdad').val('');

        $('#txtFechaNotificacion').val('');
        $('#txtHoraNotificacion').val('');
        $('#cboServicioNotifica').val('');
        $('#txtLugarOcurrencia').val('');
        $('#txtHoraEvento').val('');
        $('#txtFechaIngreso').val('');
        $('#txtHoraIngreso').val('');

        // Desmarcar todos los checkboxes
        $('input[type="checkbox"]').prop('checked', false);

        // Limpiar los campos de texto adicionales
        $('#txtTraumaObstetricoMaternoOtros').val('');
        $('#txtOtrosEventosAdversos').val('');
        $('#txtDescripcionEventoAdverso').val('');
        $('#txtComoPrevenirEventoAdverso').val('');

        // Desmarcar los radio buttons
        $('input[name="rdbEventoAdversoPrevenible"]').prop('checked', false);

        Diagnosticos.LimpiarDiagnosticosAtencion();

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    Events: function () {

        /*------------------------------------- BUTTONS -------------------------------------*/
        $('#btnBuscarAtenciones').on('click', async function () {
            let evento = await EventosAdversos.ListarEventosAdversos()
        })

        $('#btnAgregar').on('click', function () {
            EventosAdversos.LimpiarFormulario()
            MostrarAreaRegistro()
        })
        $('#btnModificarAtenciones').on('click', async function () {

            let objRow = oTable_EventosAdversos.api(true).row('.selected').data()

            let data = await EventosAdversos.SeleccionarEventoAdversoById(objRow.idEventoAdverso)

            await EventosAdversos.CargarDatos(data)

            MostrarAreaRegistro()
        })
        $('#btnCerrarAtencion').on('click', async function () {

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
            }).then(async function () {
                EventosAdversos.LimpiarFormulario()

                MostrarAreaLista()
            }).catch(swal.noop);

           
        })



        $('#btnguardar').on('click', async function () {

            if (EventosAdversos.IdPaciente == 0) {
                swal({
                    title: 'Atenciones',
                    text: "Por favor ingresa un Nro de Historia Valido.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return
            }

            if ($('#txtFechaNotificacion').val() == '') {
                swal({
                    title: 'Atenciones',
                    text: "La fecha de notificación es obligatoria.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return
            }

            if ($('#txtHoraNotificacion').val() == '') {
                swal({
                    title: 'Atenciones',
                    text: "La hora de notificación es obligatoria.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return
            }

            if ($('#txtFechaIngreso').val() == '') {
                swal({
                    title: 'Atenciones',
                    text: "La fecha de ingreso es obligatoria.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return
            }

            if ($('#txtHoraIngreso').val() == '') {
                swal({
                    title: 'Atenciones',
                    text: "La hora de ingreso es obligatoria.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return
            }

            let evento = await EventosAdversos.GuardarDatos()

            swal({
                title: 'Atenciones',
                text: "Registro exitoso",
                type: 'success',
                allowOutsideClick: false,
            }).done();

            $('#btnBuscarAtenciones').click()

            EventosAdversos.LimpiarFormulario()
            MostrarAreaLista()
        })


        /*------------------------------------- TEXTS -------------------------------------*/
        $('#txtDatoHistoria').on('focusout', async function () {
            let paciente = await EventosAdversos.PacientesSeleccionarPorNroHistoriaClinicaAsync()

            if (isEmpty(paciente)) {
                swal({
                    title: 'Atención',
                    text: "No existe registros para esta historia.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
                return
            }

            if (paciente.length < 0) {
                swal({
                    title: 'Atención',
                    text: "No existe registros para esta historia.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
                return
            }

            EventosAdversos.IdPaciente = paciente[0].idPaciente

            $('#txtDatoCuenta').val(paciente[0].idPaciente)
            $('#txtDatoPaciente').val(paciente[0].apellidoPaterno + ' ' + paciente[0].apellidoMaterno + ' ' + paciente[0].primerNombre + ' ' + paciente[0].segundoNombre)
            $('#txtDatoEdad').val(CalcularEdadAnioMesDia(FormatearFecha(paciente[0].fechaNacimiento)).años)
            console.log('paciente', paciente)
        })

        /*------------------------------------- TABLES -------------------------------------*/
        $('#tblEventosAdversos tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_EventosAdversos.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })

        $('#tblEventosAdversos tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_EventosAdversos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EventosAdversos.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, vuelva a guardar la atención.')
                
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);          
        });

        $('#tblEventosAdversos tbody').on('click', '.ImprimeInformeCF', async function () {
            var objrow = oTable_EventosAdversos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EventosAdversos.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblEventosAdversos tbody').on('click', '.FirmarInformeSF', async function () {
            var objrow = oTable_EventosAdversos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EventosAdversos.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            if (firma) {
                await Utilitario.IniciarServicioFirmaPeru(row.code);
            }
            Cargando(0);
        });

    },

    Init: async function () {
        EventosAdversos.Plugins()

        EventosAdversos.InitDatablesEventosAdversos()

        await EventosAdversos.ServiciosFiltrar()

        EventosAdversos.Events()

        BusquedaDiagnosticos.IniciarScript();
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
    }
}

$(document).ready(function () {
    EventosAdversos.Init()
})