var listaDxRefCon = [{}];
var tratamientoRefCon = '';
var responsable = 0;
var responsableEESS = 0;
var moduloActualRefCon = '';
var estadoGuardadoRefCon = false;
var codigoIpress = '6208';


var Referencias = {
    idPaciente: 0,
    estadoGuardadoRefCon: false,

    idReferencia: 0,
    idContraReferencia: 0,

    listadoUps: [],
    listadoEstablecimientos: [],
    datosReferencia: {},
    datosAfiliacion: {},
    idProgramacion: 0,

    CargaInicial() {
        //Referencias.limpiar();

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionRefCon').val(fechaP);

        $("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");

        $('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        $('.modalRefCon').modal('hide');

        //EstablecimientosSaludTodos();
        //ListaDepartamentos();


    },

    /*
    limpiar() {
        $('#chkNuevo').prop('checked', false)
        $('#chkCierre').prop('checked', false)
        $('#idCuentaAtencion').val(0);
        $('#txtMotivoConsultaPeri').val("");
        $('#txtHoraCia').val("");
        $('#HoraInicioAtencion').val("");
    },*/

    plugins() {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");
        //$(".chzn-select").chosen({ );


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

    },

    CompletarDatosAtencionPorAfiliacion: async function (data) {
        let dataReferencia = Referencias.datosReferencia

        let establecimiento = await Referencias.ListaEstablecimientosByCodigo(dataReferencia.datos_referencia.codigo_establecimiento_origen.toString().padStart(5, '0'))

        if (isEmpty(establecimiento)) {
            alerta2('warning', 'Atención', 'No se encontró el establecimiento de salud asociado al afiliado, consultar con soporte tecnico.')
            return
        }


        Referencias.datosAfiliacion = data

        $('#txtNroReferenciaCita').val(dataReferencia.datos_referencia.numero_referencia)

        $('#hdIdEstablecimientoReferenciaOrigen').val(establecimiento.idEstablecimiento)
        $('#txtCodigoReferencia').val(establecimiento.codigo)
        $('#txtDescripcionReferenciaCita').val(establecimiento.nombre)
    },


    Eventos() {

        //* BUTTONS *//
        $('#btnConsultarAfiliacionSis').on('click', async function () {

            let data = await Referencias.ConsultarAfiliacionSis()

            if (data.idError != '0') {
                alerta2('error', 'Consulta SIS', data.resultado)
                // return
            } else {
                alerta2('success', 'Consulta SIS', 'El paciente cuenta con una afiliacion activa en el SIS')
            }

            await Referencias.CompletarDatosAtencionPorAfiliacion(data)
        });
        $('#btnguardarCita').on('click', async function () {

            let programacionMedica = oTable_ProgramacionMedica.api(true).row('.selected').data()

            if (isEmpty(programacionMedica)) {
                alerta2('warning', 'Guardar Cita', 'Debe seleccionar una programación médica válida.')
                return
            }

            if ($('txtFechaCupoSeleccionado').val() == '') {
                alerta2('warning', 'Guardar Cita', 'Debe seleccionar una fecha de cita válida.')
                return
            }
            if (isEmpty($('#cboCuposDisponibles').val()) || $('#cboCuposDisponibles').val() == '') {
                alerta2('warning', 'Guardar Cita', 'Debe seleccionar un horario disponible para la cita.')
                return
            }
            if (isEmpty($('#cboCodPrestacion').val()) || $('#cboCodPrestacion').val() == '' || $('#cboCodPrestacion').val() == '0') {
                alerta2('warning', 'Guardar Cita', 'Debe seleccionar una prestación válida.')
                return
            }

            if (programacionMedica.activaProcedimiento == 1) {
                if (isEmpty($('#cboIdProductoImg').val()) || $('#cboIdProductoImg').val() == '') {
                    alerta2('warning', 'Guardar Cita', 'Debe seleccionar un procedimiento válido.')
                    return
                }
            }

            Cargando(1);
            let data = await Referencias.CrearModificarCitaRefcon()

            if (data.errorNumber != '0') {
                alerta2('error', 'Guardar Cita', data.errorMessage)
            } else {
                alerta2('success', 'Guardar Cita', data.successMessage)

                let resCita = await Referencias.recibirCita(
                    codUnicoDestino = codigoIpress,
                    consultorio = data.consultorio,
                    fecha = data.fecha,
                    hora = data.hora,
                    turno = data.turno,
                    apePaternoMedico = data.apePaternoMedico,
                    apeMaternoMedico = data.apeMaternoMedico,
                    nombresMedico = data.nombresMedico,
                    tipoDocumentoMedico = data.tipoDocumentoMedico,
                    numeroDocumentoMedico = data.numeroDocumentoMedico,
                    fechaNacimientoMedico = data.fechaNacimientoMedico,
                    sexoMedico = data.sexoMedico,
                    idReferencia = data.idReferencia,
                    idColegio = data.idColegio,
                    idProfesion = data.idprofesion
                )

                if (resCita.codigo == '0000') {
                    alerta2('success', 'Cita Referencia', 'La cita ha sido enviada correctamente al sistema de REFCON.')

                    Referencias.LimpiarCampos()
                    $('#modalCitarPaciente').modal('hide')
                } else {
                    alerta2('error', 'Cita Referencia', `Error al enviar la cita al sistema de REFCON. Código: ${resCita.codigo} - Mensaje: ${resCita.mensaje}`)
                }
            }

            Cargando(0);
        });
        $('#btnCerrarModalCita').on('click', async function () {
            $('#modalCitarPaciente').modal('hide')
        });


        //* TABLAS *//
        $('#tblProgramacionMedica tbody').on('click', 'tr', async function () {
            oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var pos = oTable_ProgramacionMedica.api(true).row($(this)).index();
            var row = oTable_ProgramacionMedica.fnGetData(pos);

            let cuposDisponibles = [];

            Cargando(1)

            if (row.activaProcedimiento == 1) {
                cuposDisponibles = await Referencias.ListarCupoCitasProcedimiento(row.idProgramacion);
            } else {
                cuposDisponibles = await Referencias.ListarCupoCitas(row.idProgramacion);
            }

            $('#contProductoCitaProcedimiento').hide()
            $('#cboCodPrestacion').val(0)

            if (row.activaProcedimiento == 1) {
                $('#cboCodPrestacion').val('071')
                $('#contProductoCitaProcedimiento').show()
            }

            $('#cboCuposDisponibles').empty();

            if (isEmpty(cuposDisponibles)) {
                alerta2()('warning', 'Atención', 'No se encontraron cupos disponibles para la programación seleccionada')
                Cargando(0)
                return
            }

            Referencias.idProgramacion = row.idProgramacion

            $(cuposDisponibles).each(function (i, obj) {
                if (obj.idEstadoCita == 0) {
                    $('#cboCuposDisponibles').append(`<option data-horaingreso="${obj.turnoHoraInicio}" data-horafin="${obj.turnoHoraFin.substr(0, 5)}" value="${obj.turnoHoraInicio}"> ${obj.turnoHoraInicio} - ${obj.turnoHoraFin.substr(0, 5)} </option>`)
                }
            });

            $('#cboCuposDisponibles').val(0);

            $('#hdIdEspecialidad').val(row.idEspecialidad);
            $('#txtEspecialidadCita').val(row.especialidad);
            $('#hdIdServicioIngreso').val(row.idServicio);
            $('#txtConsultorioCita').val(row.servicio);
            $('#hdIdMedicoCita').val(row.idMedico);
            $('#txtMedicoCita').val(row.medico);
            $('#txtFechaCupoSeleccionado').datepicker('setDate', $('#txtFechaCita').val());
            // $('#txtHoraInicioCita').val(0);
            // $('#txtHoraFinCita').val(0);


            Cargando(0)

            $('.chzn-select').chosen().trigger("chosen:updated");
        });
        $('#tblAtencionRefCon tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atenciones.api(true).row($(this)).index();
            var row = oTable_atenciones.fnGetData(pos);

            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);

            if (row.tipoRef == 1) {
                $('.txtTituloRefCon').html('Referencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            } else if (row.tipoRef == 2) {
                $('.txtTituloRefCon').html('Contrareferencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            }
        });
        $('#cboCuposDisponibles').on('change', async function () {
            let horaIngreso = $('#cboCuposDisponibles option:selected').attr('data-horaingreso');
            let horaFin = $('#cboCuposDisponibles option:selected').attr('data-horafin');

            $('#txtHoraInicioCita').val(horaIngreso);
            $('#txtHoraFinCita').val(horaFin);
        });


        //* TEXT *//
        $('#txtDniPaciente').keypress(async function (e) {
            if (e.which == 13) {
                e.preventDefault();

                let pacienteEncontrado = await Referencias.PacientesFiltrarTodosSoloHistoriasDefinitivas($('#cboTipoDocPaciente').val(), $('#txtDniPaciente').val())

                if (!isEmpty(pacienteEncontrado)) {
                    // Cargando(0)
                    let confirmarPacienteExistente = await alertaAsync('warning', 'Atención', 'El paciente ya se encuentra registrado en el sistema, ¿Desea cargar sus datos?')

                    if (confirmarPacienteExistente.isConfirmed) {
                        Referencias.idPaciente = pacienteEncontrado.idPaciente

                        let pacienteSeleccionado = await Referencias.PacientesSeleccionarPorId(Referencias.idPaciente)

                        RegistroPaciente.CompletarDatosPaciente(pacienteSeleccionado, 1)
                    }

                } else {
                    let confirmarPacienteExistente = await alertaAsync('warning', 'Atención', 'No se encontraron datos para el número de documento consultado. Por favor, complete la información correspondiente.')

                }
            }
        });
        $('.searchRefCon').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarAtencionesRefCon").click();
            }
        });



        $('.nav-link').on('shown.bs.tab', () => {

            oTable_ProgramacionMedica.fnDraw()
        })












        //* DATA TABLES *//
        $('#tblAtencionRefConMinsa tbody').on('click', '.btnCitarPaciente', async function () {

            Referencias.LimpiarCampos()

            var objrow = oTable_atencionesRefconMinsa.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefconMinsa.fnGetData(objrow);



            const paciente_refcon = row.paciente;

            let diagnosticoReferencia = ''
            let procedimientoImagenologia = ''

            Referencias.datosReferencia = row

            Cargando(1);

            let data = await Referencias.ConsultarAfiliacionSis()

            for (const item of Referencias.datosReferencia.diagnosticos) {

                let resDiagnostico = await Referencias.SeleccionarDiagnosticoByCodigoCIEsinPto(item.codigo_ciex)

				if(!isEmpty(resDiagnostico)) {
					
                diagnosticoReferencia += '(' + resDiagnostico?.codigoCIEsinPto + ') ' + resDiagnostico?.descripcion + '\n'
				}
            }

            for (const item of Referencias.datosReferencia.cpt_imagenes) {

                let resProcImag = await Referencias.SeleccionarProcedimientoByCodigo(item.cpt)
				
				if(!isEmpty(resProcImag))
				{
					procedimientoImagenologia += '(' + resProcImag.codigo + ') ' + resProcImag.nombre + '\n'

					$("#cboIdProductoImg").val(resProcImag.idProducto);
				}
                
            }



            $('#txtMotivoReferencia').val(Referencias.datosReferencia.datos_referencia.motivo_referencia)
            $('#txtExamenFisico').val(Referencias.datosReferencia.datos_referencia.resume_exfisico)
            $('#txtDiagnosticosReferencia').val(diagnosticoReferencia)
            $('#txtImagenesReferencia').val(procedimientoImagenologia)

            if (data.idError != '0') {
                alerta2('error', 'Consulta SIS', data.resultado)
                Cargando(0);
                // return
            } else {
                Cargando(0);
                await alertaAsync('success', 'Consulta SIS', 'El paciente cuenta con una afiliacion activa en el SIS')
            }

            Cargando(1);
            await Referencias.CompletarDatosAtencionPorAfiliacion(data)

            let pacienteEncontrado = await Referencias.PacientesFiltrarTodosSoloHistoriasDefinitivas(paciente_refcon.tipo_documento, paciente_refcon.numero_documento)

            let datosUbigeo = await Referencias.SeleccionarDepartamentoProvinciaDistritoByIdDistrito(paciente_refcon.ubigeo1 || "");

            let fecha = new Date()
            dia = fecha.getDate()
            mes = parseInt(fecha.getMonth()) + 1
            let yyy = fecha.getFullYear()
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            $("#cboTipoHistoriaPaciente").val(1);
            $('#txtFechaCreacionPaciente').val(dia + "/" + mes + "/" + yyy)
            $("#cboTipoOrigenCita").val(12);
            $("#cboTipoServicioCita").val(1);

            // Asignar valores a los inputs
            $("#cboTipoDocPaciente").val(paciente_refcon.tipo_documento || "");
            $("#txtDniPaciente").val(paciente_refcon.numero_documento || "");
            $("#txtApellidoPaternoPaciente").val(paciente_refcon.primer_apellido || "");
            $("#txtApellidoMaternoPaciente").val(paciente_refcon.segundo_apellido || "");
            $("#txtPrimerNombrePaciente").val(paciente_refcon.nombres || "");
            $("#cboSexoPaciente").val((paciente_refcon.sexo == 'M' ? 1 : 2) || "");
            $("#txtDireccionDomicilio").val(paciente_refcon.direccion || "");
            // $("#txtUbigeo1").val(paciente.ubigeo1 || "");
            // $("#txtUbigeo2").val(paciente.ubigeo2 || "");

            await RegistroPaciente.ListaProvinciasByDepartamentos(datosUbigeo?.idDepartamento, 'cboProvinciaDomicilio')
            await RegistroPaciente.ListaDistritosByProvincia(datosUbigeo?.idProvincia, 'cboDistritoDomicilio')
            await RegistroPaciente.ListaCentroPobladoByDistrito(datosUbigeo?.idDistrito, 'cboCentroPobladoDomicilio')

            $("#cboDepartamentoDomicilio").val(datosUbigeo?.idDepartamento || "");
            $("#cboProvinciaDomicilio").val(datosUbigeo?.idProvincia || "");
            $("#cboDistritoDomicilio").val(datosUbigeo?.idDistrito || "");

            $("#txtPacienteFechaNacimiento").datepicker('setDate', paciente_refcon.fecha_nacimiento || "");
            $("#txtTelefonoPaciente").val(paciente_refcon.celular || "");


            // VALIDAR UNA MEJOR FORMA DE HACERLO, NO ME GUSTA
            if (!isEmpty(pacienteEncontrado)) {
                Cargando(0)
                let confirmarPacienteExistente = await alertaAsync('warning', 'Atención', 'El paciente ya se encuentra registrado en el sistema, ¿Desea cargar sus datos?')

                if (confirmarPacienteExistente.isConfirmed) {
                    Referencias.idPaciente = pacienteEncontrado.idPaciente

                    let pacienteSeleccionado = await Referencias.PacientesSeleccionarPorId(Referencias.idPaciente)

                    RegistroPaciente.CompletarDatosPaciente(pacienteSeleccionado, 1)
                }

            }

            $('#modalCitarPaciente').modal('show')

            $('.chzn-select').chosen().trigger("chosen:updated");

            Cargando(0);
        });

        //$("#txtFechaAtencionRefCon").keypress(function (e) {
        //    $('#lblMedicoProgramado').html("")
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        oTable_atenciones.fnClearTable();
        //        if ($("#txtFechaAtencionRefCon").val() == "") {
        //            alerta('2', 'Ingrese fecha de atencion');
        //            return false;
        //        }
        //        else {
        //            Referencias.ListaServicios();
        //        }

        //    }
        //});

        //$('#txtFechaAtencionRefCon').on('change', function () {
        //    $('#lblMedicoProgramado').html("")
        //    oTable_atenciones.fnClearTable();
        //    if ($("#txtFechaAtencionRefCon").val() == "") {
        //        alerta('2', 'Ingrese fecha de atencion');
        //        return false;
        //    }
        //    else {
        //        Referencias.ListaServicios()
        //        Referencias.ListarAtenciones();

        //        //ListaAtencionesCE();

        //    }

        //});

        $('#btnBuscarAtencionesRefCon').on('click', function () {
            $('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionRefCon').val() == "") {
                alerta('2', 'Ingrese fecha de atencion');
                return false;
            }
            else {
                $('#lblMedicoProgramado').html("Medico: " + $('#cboConsultorioRefCon>option:selected').attr("med"))
                Referencias.ListarAtenciones();
            }
            $('html, body').animate({
                scrollTop: $(".head").offset().top
            }, 1000);
        });

        $('#btnBuscarPacientesRefCon').on('click', async function () {

            let rangoFechas = convertirFechaConRango();

            await Referencias.ConsultaBandejaReferidosRecibidos(codUnicoDestino = codigoIpress, fechaInicio = rangoFechas.fechaInicio, fechaFin = rangoFechas.fechaFin, limite = '200', pagina = '1', upsDestino = $('#cboServicioOrigen').val())
        });

        $('#cboServicioDestinoCR').on('change', function () {
            //$('#lblMedicoProgramado').html("")
            $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
            //console.log("Seleccionadnooo");
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeInformeAtencion)               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0);
            Cargando(0);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeInformeCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeInformeAtencion);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeRefCon)               //KHOYOSI            
            AbrirVisorDocumento(firma.rutaArchivo, 0);
            Cargando(0);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            var tipo = '';

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeRefCon);
        });

        //////////
        //$('#tblAtencionRefCon tbody').on('click', '.ImprimeInformeSF', async function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);
        //    //tipoFormato = 0;
        //    //if (typeof row.usaModuloMaterno === 'undefined') {
        //    //    alerta(2, "Seleccione Fila");
        //    //} else {
        //    //    if (row.usaModuloMaterno) {
        //    //        tipoFormato = 1;
        //    //    }
        //    //    else if (row.usaModuloNinoSano) {
        //    //        tipoFormato = 2;
        //    //    }
        //    //    else {
        //    //        tipoFormato = 0;
        //    //    }
        //    //    imprimiInformeAtencionSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
        //    //}
        //    tipoFormato = 0;
        //    Cargando(1);

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI

        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        if (typeof row.usaModuloMaterno === 'undefined') {
        //            alerta(2, "Seleccione Fila");
        //        } else {
        //            if (row.usaModuloMaterno) {
        //                tipoFormato = 1;
        //            }
        //            else if (row.usaModuloNinoSano) {
        //                tipoFormato = 2;
        //            }
        //            else {
        //                tipoFormato = 0;
        //            }
        //            //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
        //        }

        //        const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idProCabecera, tipoFormato);

        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#btnBuscarAtenciones").click();
        //        } else {
        //            alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
        //        }
        //    } else {
        //        //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
        //        AbrirVisorDocumento(firma.rutaArchivo, 0);
        //    }
        //    Cargando(0);
        //});
        //////////



        ////////////////
        //$('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConSinF', async function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);
        //    var idRefCon = 0;
        //    var tipo = '';

        //    if (row.idReferencia != null) {
        //        idRefCon = row.idReferencia;
        //        tipo = 'RF';
        //    } else {
        //        if (row.idContraReferencia != null) {
        //            idRefCon = row.idContraReferencia;
        //            tipo = 'CRF';
        //        }
        //    }

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
        //    AbrirVisorDocumento(firma.rutaArchivo, 0);
        //});

        //$('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConConF', async function () {
        //    //var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    //var row = oTable_atenciones.fnGetData(objrow);
        //    //tipoDoc = '';
        //    //if (row.idReferencia > 0) {
        //    //    tipoDoc = 'RF';
        //    //}
        //    //if (row.idContraReferencia > 0) {
        //    //    tipoDoc = 'CRF';
        //    //}
        //    //ImprimirRefConFirmado(row.idCuentaAtencion, row.idRegistroRefCon, row.codeRefCon, "", tipoDoc)
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);

        //    if (row.idReferencia != null) {
        //        idRefCon = row.idReferencia;
        //        tipo = 'RF';
        //    } else {
        //        if (row.idContraReferencia != null) {
        //            idRefCon = row.idContraReferencia;
        //            tipo = 'CRF';
        //        }
        //    }

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
        //    ImprimirRefConFirmado(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);
        //});
        ///////

        $('#tblAtencionRefCon tbody').on('click', '.ModalMigracionRefcon', function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            $('#txtCodRespuestaRefCon').val('')
            $('#txtMensajeRespuestaRefCon').val('')

            $('#txtIdReferenciaRespuestaRefCon').val('')
            $('#txtNroReferenciaRespuestaRefCon').val('')

            $('#hdnIdCuentaAtencionMigracionRefCon').val(row.idCuentaAtencion)

            $('#btnEnviarReferencia').show()
            $('#btnEnviarContraReferencia').hide()

            $('#modalMigracionRefCon').modal('show')
        });



        $('#tblAtencionRefCon tbody').on('click', '.ModalMigracionContraref', function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            $('#txtCodRespuestaRefCon').val('')
            $('#txtMensajeRespuestaRefCon').val('')

            $('#txtIdReferenciaRespuestaRefCon').val('')
            $('#txtNroReferenciaRespuestaRefCon').val('')

            $('#hdnIdCuentaAtencionMigracionRefCon').val(row.idCuentaAtencion)

            $('#btnEnviarReferencia').hide()
            $('#btnEnviarContraReferencia').show()

            $('#modalMigracionRefCon').modal('show')
        });


        $('#ifrmReporteRefCon').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporteRefCon');
            //$('#ifrmReporteRefCon').on('load', function () { //your code (will be called once iframe is done loading)
            //    let objFra = document.getElementById('ifrmReporteRefCon');

            //    objFra.contentWindow.focus();
            //    objFra.contentWindow.print();

            //    Referencias.ListarAtenciones();

        });

        $('#btnEnviarReferencia').on('click', () => { // jdelgado
            console.log('idCuenta si captura', $('#hdnIdCuentaAtencionMigracionRefCon').val())
            Referencias.MigrarRefCon($('#hdnIdCuentaAtencionMigracionRefCon').val())
        })

        $('#btnEnviarContraReferencia').on('click', () => { // jdelgado
            console.log('idCuenta si captura', $('#hdnIdCuentaAtencionMigracionRefCon').val())
            Referencias.MigrarContraRef($('#hdnIdCuentaAtencionMigracionRefCon').val())
        })

        $('#btnCerrarModalEnvioReferencia').on('click', () => { // jdelgado

            $('#modalMigracionRefCon').modal('hide')
        })

        $('#txtFechaCita').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        }).on('show', async function () {
            let res = await Referencias.ListarProgramacionServicionRefCon(Referencias.datosReferencia.datos_referencia.servicio_destino, '')

            await Referencias.ListarFechasFuturasProgramacionMedicaRefcon(res[0].idEspecialidad, 0, FormatearFecha(res[0].fechaIngreso), Referencias.datosReferencia.datos_referencia.servicio_destino, '#a09afd');
        });

        $("#txtFechaCita").on("change", async function () {
            const fecha = $(this).val();

            Cargando(1)

            let res = await Referencias.ListarProgramacionServicionRefCon(Referencias.datosReferencia.datos_referencia.servicio_destino, fecha)

            oTable_ProgramacionMedica.fnClearTable()

            if (isEmpty(res)) {
                alerta2('warning', 'Atención', 'No se encontraron programaciones para la fecha seleccionada')
                Cargando(0)
                return
            }

            oTable_ProgramacionMedica.fnAddData(res)
            console.log('Programacion del dia', res);

            Cargando(0)
        });


        /*
        $('#btnModificarAtenciones').on('click', function () {
            mostrar(1);
        });

        $('#btnEliminarAtenciones').on('click', function () {
            //mostrar(3);
        });
        $('#btnConsultarAtenciones').on('click', function () {
            mostrar(4);
        });


        $('#btnEstablecimientoOrigen').on('click', function () {
            opcionEst = 1;
            $('#modalEstablecimientosBuscar').modal('show')
        });

        $('#btnEstablecimientoDestino').on('click', function () {
            opcionEst = 2;
            $('#modalEstablecimientosBuscar').modal('show')
        });
        

        $('#btnGuardarRefCon').on('click', function () {
            
            console.log(formData.append);
            Guardar(formData);
        });*/

    },

    LimpiarModal() {
        //$('.campo').val("");
        $("#modalRef input").val("");
        $("#modalRef textarea").val("");
        //$("#modalRef select").html("");
        $('#modalRef .chzn-select').chosen().trigger("chosen:updated");

        $("#modalConRef input").val("");
        $("#modalConRef textarea").val("");
        // $("#modalConRef select").html("");
        $('#modalConRef .chzn-select').chosen().trigger("chosen:updated");

        this.responsable = 0;
        this.responsableEESS = 0;
    },

    DeshabilitarModal() {
        $(".campo").attr('disabled', 'disabled');
    },

    HabilitarModal() {
        $(".campo").removeAttr('disabled', 'disabled');
    },

    AbrirModalRef() {
        $('#modalRef').modal('show');
    },

    AbrirModalConRef() {
        $('#modalConRef').modal('show');
    },

    CerrarModal() {
        $('.modalRefCon').modal('hide');
    },




    ListarUPServiciosOrigen: async function (codigoups) {

        var formData = new FormData();
        formData.append('codigoups', codigoups);

        $('#cboServicioOrigen').empty();
        $('#cboServicioOrigenCR').empty();

        let response = await HttpClient.Post("/Referencia/ListarUPServiciosRefCon?area=Comun", formData);

        Referencias.listadoUps = response.data.datos;

        let data = response.data
        if (data.codigo = '0000') {
            $(data.datos).each(function (i, obj) {
                $('#cboServicioOrigen').append('<option  value="' + obj.codUps + '">' + obj.codUps + ' - ' + obj.descripcion + '</option>');
                $('#cboServicioOrigenCR').append('<option  value="' + obj.codUps + '">' + obj.codUps + ' - ' + obj.descripcion + '</option>');
            });
            $('#cboServicioOrigen').val(0);
            $('#cboServicioOrigenCR').val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");
        }
    },
    SeleccionarDepartamentoProvinciaDistritoByIdDistrito: async function (IdDistrito) {

        let formData = new FormData();
        formData.append('IdDistrito', IdDistrito);

        let response = await HttpClient.Post('/Referencia/SeleccionarDepartamentoProvinciaDistritoByIdDistrito?area=Comun', formData)

        let data = response.data
        if (data.table.length > 0) {
            return data.table[0];
        }
        return null;
    },
    BuscarEstablecimiento: async function () {
        let filtro = "WHERE ISNULL(Activo, 1) = 1";

        let formData = new FormData();
        formData.append('filtro', filtro);

        let response = await HttpClient.Post('/Utilitario/EstablecimientosFiltrar?area=Comun', formData)

        Referencias.listadoEstablecimientos = response.data.table;
    },
    ListarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos: async function () {
        let res = await HttpClient.Get('/Utilitario/listarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos?area=Comun')

        $('#cboTipoOrigenCita').empty();
        $(res.dataSet.table).each(function (i, obj) {
            $('#cboTipoOrigenCita').append(`<option value="${obj.idOrigenAtencion}">${obj.descripcionLarga}</option>`)
        })
        $('#cboTipoOrigenCita').val(12);
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    ListarTipoServicio: async function () {
        let res = await HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun')

        $('#cboTipoServicioCita').empty();
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoServicioCita').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
        })
        $('#cboTipoServicioCita').val(1);
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarProgramacionServicionRefCon: async function (CodigoServicioSuSalud, FechaProgramacion) {
        let formData = new FormData();
        formData.append('CodigoServicioSuSalud', CodigoServicioSuSalud);
        formData.append('FechaProgramacion', FechaProgramacion);

        let response = await HttpClient.Post('/Referencia/ListarProgramacionServicionRefCon?area=Comun', formData)

        let data = response.data
        if (data.table.length > 0) {
            return data.table;
        }
        return null;
    },
    ListarCupoCitas: async function (idProgrmacion) {
        let formData = new FormData();
        formData.append('idProgrmacion', idProgrmacion);

        let response = await HttpClient.Post('/Referencia/ListarCupoCitas?area=Comun', formData)

        let data = response.data
        if (data.table.length > 0) {
            return data.table;
        }
        return null;
    },
    ListarCupoCitasProcedimiento: async function (idProgrmacion) {
        let formData = new FormData();
        formData.append('idProgrmacion', idProgrmacion);

        let response = await HttpClient.Post('/Referencia/ListarCupoCitasProcedimiento?area=Comun', formData)

        let data = response.data
        if (data.table.length > 0) {
            return data.table;
        }
        return null;
    },
    ListaEstablecimientosByCodigo: async function (codigo) {
        let formData = new FormData();
        formData.append('codigo', codigo)

        let res = await HttpClient.Post('/Utilitario/ListaEstablecimientosByCodigo?area=Comun', formData)
        if (!isEmpty(res)) {
            return res.data.table[0]
        } else {
            return null
        }
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

        let res = await HttpClient.Post('/MicroServicios/ConsultarAfiliadoFuaE', formData)

        if (res.estado) {
            //alerta(1, res.msg)
            return res
        } else {
            return null
        }
    },
    ListarSisServiciosSeleccionarPorFiltro: async function () {
        let res = await HttpClient.Get('/Citas/listarSisServiciosSeleccionarPorFiltro?area=ConsultaExterna')

        $('#cboCodPrestacion').empty();
        $('#cboCodPrestacion').append(`<option value="0">--Seleccionar--</option>`)
        $(res.dataSet.table).each(function (i, obj) {
            $('#cboCodPrestacion').append(`<option value="${obj.dServicioCodigo}">${obj.dServicioCodigo} - ${obj.dServicio}</option>`)
        })
    },
    PacientesFiltrarTodosSoloHistoriasDefinitivas: async function (idDocIdentidad, nroDocumento) {
        let formData = new FormData();
        // formData.append("nroHistoriaClinica", $('#txtNroHistoria').val())
        // formData.append("apellidoPaterno", $('#txtApellidoPaterno').val())
        // formData.append("apellidoMaterno", $('#txtApellidoMaterno').val())
        // formData.append("primerNombre", $('#txtPrimerNombre').val())
        // formData.append("segundoNombre", $('#txtSegundoNombre').val())
        formData.append("idDocIdentidad", idDocIdentidad)
        formData.append("nroDocumento", nroDocumento)

        let res = await HttpClient.Post('/Citas/PacientesFiltrarTodosSoloHistoriasDefinitivas', formData)

        if (!isEmpty(res)) {
            return res.data.table[0] || null
        } else {
            return null
        }
    },
    PacientesSeleccionarPorId: async function (idPaciente) {
        let formData = new FormData();
        formData.append("idPaciente", idPaciente)

        let res = await HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData)

        return res.data.table[0] || null
    },
    ConsultarAfiliacionSis: async function () {
        let response = {};

        let paciente_refcon = Referencias.datosReferencia.paciente

        let numero_seguro = paciente_refcon.numero_seguro

        let tipoSeguro = numero_seguro.split('-')[0]
        let numSeguro = numero_seguro.split('-')[1]

        let strTipoDocumento = tipoSeguro == 2 ? '1' : '3'

        if (tipoSeguro == 'E') {
            response = await Referencias.ConsultarAfiliadoFuaE(
                intOpcion = '2', strTipoDocumento = strTipoDocumento, strNroDocumento = numSeguro,
                strDisa = '250', strTipoFormato = tipoSeguro, strNroContrato = numSeguro, strCorrelativo = '1')
        } else {
            response = await Referencias.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = strTipoDocumento, strNroDocumento = numSeguro,
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        }


        return response.data
    },
    CrearModificarCitaRefcon: async function () {
        let formData = new FormData();

        formData.append("IdPaciente", $("#txtIdPaciente").val());
        formData.append("IdDocIdentidad", $("#cboTipoDocPaciente").val());
        formData.append("NroDocumento", $("#txtDniPaciente").val());
        formData.append("ApellidoPaterno", $("#txtApellidoPaternoPaciente").val());
        formData.append("ApellidoMaterno", $("#txtApellidoMaternoPaciente").val());
        formData.append("PrimerNombre", $("#txtPrimerNombrePaciente").val());
        formData.append("SegundoNombre", $("#txtSegundoNombrePaciente").val());
        formData.append("FechaNacimiento", $("#txtPacienteFechaNacimiento").val() + ' ' + $("#txtHoraNacimientoPaciente").val());
        formData.append("IdTipoSexo", $("#cboSexoPaciente").val());
        formData.append("IdEstadoCivil", $("#cboEstadoCivilPaciente").val());
        formData.append("IdEtnia", $("#cboEtniaPaciente").val());
        formData.append("IdIdioma", $("#cboIdiomaMaternoPaciente").val());
        formData.append("IdGradoInstruccion", $("#cboGradoInstruccionPaciente").val());
        formData.append("IdTipoOcupacion", $("#cboOcupacionPaciente").val());
        formData.append("IdProcedencia", $("#cboProcedenciaPaciente").val());
        formData.append("Religion", $("#cboReligionPaciente").val());
        formData.append("Telefono", $("#txtTelefonoPaciente").val());
        formData.append("Email", $("#txtEmailPaciente").val());
        formData.append("NombrePadre", $("#txtNombrePadrePaciente").val());
        formData.append("Observacion", $("#txtObservacionPaciente").val());
        formData.append("NroOrdenHijo", $("#txtEsNroHijoPaciente").val());

        // Datos de la madre
        formData.append("madreTipoDocumento", $("#cboTipoDocMadre").val());
        formData.append("madreDocumento", $("#txtNroDocMadre").val());
        formData.append("madreApellidoPaterno", $("#txtApellidoPaternoMadre").val());
        formData.append("madreApellidoMaterno", $("#txtApellidoMaternoMadre").val());
        formData.append("madrePrimerNombre", $("#txtPrimerNombreMadre").val());
        formData.append("madreSegundoNombre", $("#txtSegundoNombreMadre").val());

        // Domicilio
        formData.append("IdPaisDomicilio", $("#cboPaisDomicilio").val());
        formData.append("IdDepartamentoDomicilio", $("#cboDepartamentoDomicilio").val());
        formData.append("IdDistritoDomicilio", $("#cboDistritoDomicilio").val());
        formData.append("IdCentroPobladoDomicilio", $("#cboCentroPobladoDomicilio").val());
        formData.append("DireccionDomicilio", $("#txtDireccionDomicilio").val());

        // Procedencia
        formData.append("IdPaisProcedencia", $("#cboPaisProcedencia").val());
        formData.append("IdDepartamentoProcedencia", $("#cboDepartamentoProcedencia").val());
        formData.append("IdDistritoProcedencia", $("#cboDistritoProcedencia").val());
        formData.append("IdCentroPobladoProcedencia", $("#cboCentroPobladoProcedencia").val());

        // Nacimiento
        formData.append("IdPaisNacimiento", $("#cboPaisNacimiento").val());
        formData.append("IdDepartamentoNacimiento", $("#cboDepartamentoNacimiento").val());
        formData.append("IdDistritoNacimiento", $("#cboDistritoNacimiento").val());
        formData.append("IdCentroPobladoNacimiento", $("#cboCentroPobladoNacimiento").val());

        // Datos de la cuenta
        formData.append("IdCuentaAtencion", $("#hdnIdCuentaAtencion").val());
        formData.append("IdAtencion", $("#hdnIdAtencion").val());
        formData.append("IdMedicoIngreso", $('#hdIdMedicoCita').val());
        formData.append("IdServicioIngreso", $('#hdIdServicioIngreso').val());
        formData.append("IdEspecialidadIngreso", $("#hdIdEspecialidad").val());
        formData.append("Edad", $("#txtEdadPaciente").val());
        formData.append("IdTipoEdad", $("#cboTipoEdadPaciente").val());
        formData.append("IdOrigenAtencion", $("#cboTipoOrigenCita").val());
        formData.append("IdTipoServicio", $("#cboTipoServicioCita").val());
        formData.append("FechaIngreso", $("#txtFechaCupoSeleccionado").val());
        formData.append("HoraIngreso", $("#txtHoraInicioCita").val());
        formData.append("HoraFin", $("#txtHoraFinCita").val());
        formData.append("IdEstablecimientoOrigen", $('#hdIdEstablecimientoReferenciaOrigen').val());
        formData.append("NroReferenciaOrigen", $("#txtNroReferenciaCita").val());
        formData.append("FuaCodigoPrestacion", $("#cboCodPrestacion").val());
        formData.append("IdProgramacion", Referencias.idProgramacion);
        formData.append("IdProductoImg", $('#cboIdProductoImg').val());

        // Afiliación SIS / SUSALUD
        formData.append("idSiasis", Referencias.datosAfiliacion.idNumReg);
        formData.append("Codigo", Referencias.datosAfiliacion.tabla);
        formData.append("AfiliacionDisa", Referencias.datosAfiliacion.disa);
        formData.append("AfiliacionTipoFormato", Referencias.datosAfiliacion.contrato.split('-')[0]);
        formData.append("AfiliacionNroFormato", Referencias.datosAfiliacion.contrato.split('-')[1]);
        formData.append("AfiliacionNroIntegrante", 0);
        formData.append("DocumentoTipo", Referencias.datosAfiliacion.tipoDocumento);
        formData.append("CodigoEstablAdscripcion", Referencias.datosAfiliacion.eess);
        formData.append("AfiliacionFecha", Referencias.datosAfiliacion.fecAfiliacion);
        formData.append("Paterno", Referencias.datosAfiliacion.apePaterno);
        formData.append("Materno", Referencias.datosAfiliacion.apeMaterno);
        formData.append("Pnombre", Referencias.datosAfiliacion.nombres);
        formData.append("Onombres", '');
        formData.append("Genero", Referencias.datosAfiliacion.genero);
        formData.append("Fnacimiento", Referencias.datosAfiliacion.fecNacimiento);
        formData.append("Estado", 0);
        formData.append("Fbaja", '');
        formData.append("DocumentoNumero", Referencias.datosAfiliacion.nroDocumento);
        formData.append("MotivoBaja", '');

        formData.append("IdReferencia", Referencias.datosReferencia.datos_referencia.id_referencia);
        formData.append("CodigoEspecialidad", Referencias.datosReferencia.datos_referencia.codigo_especialidad);
        formData.append("Condicion", Referencias.datosReferencia.datos_referencia.condicion);
        formData.append("FechaReferencia", Referencias.datosReferencia.datos_referencia.fecha_referencia);
        formData.append("HoraReferencia", Referencias.datosReferencia.datos_referencia.hora_referencia);
        formData.append("TipoTransporte", Referencias.datosReferencia.datos_referencia.tipo_transporte);
        formData.append("ServicioOrigen", Referencias.datosReferencia.datos_referencia.servicio_origen);
        formData.append("CodigoEstablecimientoOrigen", Referencias.datosReferencia.datos_referencia.codigo_establecimiento_origen);
        formData.append("ServicioDestino", Referencias.datosReferencia.datos_referencia.servicio_destino);
        formData.append("NumeroReferencia", Referencias.datosReferencia.datos_referencia.numero_referencia);
        formData.append("FechaEnvio", Referencias.datosReferencia.datos_referencia.fecha_envio);
        formData.append("ResumeAnamnesis", Referencias.datosReferencia.datos_referencia.resume_anamnesis);
        formData.append("ResumeExFisico", Referencias.datosReferencia.datos_referencia.resume_exfisico);
        formData.append("MotivoReferencia", Referencias.datosReferencia.datos_referencia.motivo_referencia);
        formData.append("TipoFinanciador", Referencias.datosReferencia.datos_referencia.tipo_financiador);
        formData.append("FechaAceptacion", Referencias.datosReferencia.datos_referencia.fecha_aceptacion);

        // ==== DATOS DEL TUTOR ====
        formData.append("TipoDocumento_tutor", Referencias.datosReferencia.datos_tutor.tipo_documento);
        formData.append("NumeroDocumento_tutor", Referencias.datosReferencia.datos_tutor.numero_documento);
        formData.append("Nombres_tutor", Referencias.datosReferencia.datos_tutor.nombres);
        formData.append("PrimerApellido_tutor", Referencias.datosReferencia.datos_tutor.primer_apellido);
        formData.append("SegundoApellido_tutor", Referencias.datosReferencia.datos_tutor.segundo_apellido);
        formData.append("Celular_tutor", Referencias.datosReferencia.datos_tutor.celular);
        formData.append("Correo_tutor", Referencias.datosReferencia.datos_tutor.correo);

        // ==== DATOS DEL PERSONAL ====
        formData.append("TipoDocumento_personal", Referencias.datosReferencia.personal_refiere.tipo_documento);
        formData.append("NumeroDocumento_personal", Referencias.datosReferencia.personal_refiere.numero_documento);
        formData.append("Nombres_personal", Referencias.datosReferencia.personal_refiere.nombres);
        formData.append("PrimerApellido_personal", Referencias.datosReferencia.personal_refiere.primer_apellido);
        formData.append("SegundoApellido_personal", Referencias.datosReferencia.personal_refiere.segundo_apellido);


        formData.append('diagnosticos', JSON.stringify(Referencias.datosReferencia.diagnosticos));
        formData.append('tratamiento', JSON.stringify(Referencias.datosReferencia.tratamiento));

        formData.append("idListBar", ObtenerItemListBar());



        let res = await HttpClient.Post(`/Referencia/CrearModificarCitaRefcon`, formData)

        if (isEmpty(res)) {
            return false
        }

        let data = res.data.table[0]

        return data

    },
    SeleccionarProcedimientosImagenologiaRefcon: async function () {
        let formData = new FormData();

        let res = await HttpClient.Post('/Referencia/SeleccionarProcedimientosImagenologiaRefcon', formData)

        $('#cboIdProductoImg').empty();
        $(res.data.table).each(function (i, obj) {
            $('#cboIdProductoImg').append(`<option value="${obj.idProducto}">${obj.codigo} - ${obj.nombre}</option>`)
        })

        $('#cboIdProductoImg').val(0)
    },
    SeleccionarDiagnosticoByCodigoCIEsinPto: async function (codigoCIEsinPto) {
        let formData = new FormData();

        formData.append('codigoCIEsinPto', codigoCIEsinPto)

        let res = await HttpClient.Post('/Referencia/SeleccionarDiagnosticoByCodigoCIEsinPto', formData)

        return res.data.table[0]

    },
    SeleccionarProcedimientoByCodigo: async function (Codigo) {
        let formData = new FormData();

        formData.append('Codigo', Codigo)

        let res = await HttpClient.Post('/Referencia/SeleccionarProcedimientoByCodigo', formData)

        return res.data.table[0]

    },

























    ConsultaBandejaReferidosRecibidos: async function (codUnicoDestino, fechaInicio, fechaFin, limite, pagina, upsDestino) {
        var formData = new FormData();

        oTable_atencionesRefconMinsa.fnClearTable()

        formData.append('codUnicoDestino', codUnicoDestino);
        formData.append('fechaInicio', fechaInicio);
        formData.append('fechaFin', fechaFin);
        formData.append('limite', limite);
        formData.append('pagina', pagina);
        formData.append('upsDestino', upsDestino);

        Cargando(1)


        oTable_atencionesRefconMinsa.fnClearTable()

        let response = await HttpClient.Post('/Referencia/ConsultaBandejaReferidosRecibidos?area=Comun', formData)

        let data = response.data
        if (data?.codigo == '6000') {
            alerta2('warning', 'Atención', data.mensaje)
            Cargando(0)
            return
        }

        let listaDatos = data.datos.datos; // tu array


        // Creamos un nuevo arreglo con los datos estructurados
        let pacientesData = listaDatos.map(item => {
            let data = item.data || {};

            let filterUps = (Referencias.listadoUps.filter(obj => obj.codUps == data.datos_referencia.servicio_destino))[0]
            let servicio_destino = (isEmpty(filterUps?.codUps) ? '' : filterUps?.codUps) + ' - ' + (isEmpty(filterUps?.descripcion) ? '' : filterUps?.descripcion);
            let filterEstablecimiento = (Referencias.listadoEstablecimientos.filter(obj => obj.codigo == data.datos_referencia.codigo_establecimiento_origen.toString().padStart(5, '0')))[0]
            // console.log('Establecimiento origen', filterEstablecimiento);
            let establecimiento_origen = filterEstablecimiento?.codigo + ' - ' + filterEstablecimiento?.nombre;

            return ({
                id_referencia: data.datos_referencia.id_referencia,
                establecimiento_origen: establecimiento_origen,
                especialidad: data.datos_referencia.codigo_especialidad,
                servicio_detino: servicio_destino,
                nombres_paciente: data.paciente.primer_apellido + ' ' + data.paciente.segundo_apellido + ' ' + data.paciente.nombres,
                tipo_documento: data.paciente.tipo_documento,
                numero_documento: data.paciente.numero_documento,
                sexo: data.paciente.sexo,
                fecha_referencia: data.datos_referencia.fecha_referencia + ' ' + data.datos_referencia.hora_referencia,
                fecha_aceptacion: data.datos_referencia.fecha_aceptacion,


                paciente: {
                    tipo_documento: data.paciente.tipo_documento,
                    numero_documento: data.paciente.numero_documento,
                    nombres: data.paciente.nombres,
                    primer_apellido: data.paciente.primer_apellido,
                    segundo_apellido: data.paciente.segundo_apellido,
                    sexo: data.paciente.sexo,
                    direccion: data.paciente.direccion,
                    ubigeo1: data.paciente.ubigeo1,
                    ubigeo2: data.paciente.ubigeo2,
                    fecha_nacimiento: data.paciente.fecha_nacimiento,
                    numero_seguro: data.paciente.numero_seguro,
                    fecha_vencimiento_sis: data.paciente.fecha_vencimiento_sis,
                    celular: data.paciente.celular
                },
                datos_tutor: {
                    tipo_documento: data.datos_tutor.tipo_documento,
                    numero_documento: data.datos_tutor.numero_documento,
                    nombres: data.datos_tutor.nombres,
                    primer_apellido: data.datos_tutor.primer_apellido,
                    segundo_apellido: data.datos_tutor.segundo_apellido,
                    celular: data.datos_tutor.celular,
                    correo: data.datos_tutor.correo
                },
                datos_referencia: {
                    codigo_especialidad: data.datos_referencia.codigo_especialidad,
                    condicion: data.datos_referencia.condicion,
                    fecha_referencia: data.datos_referencia.fecha_referencia,
                    hora_referencia: data.datos_referencia.hora_referencia,
                    tipo_transporte: data.datos_referencia.tipo_transporte,
                    servicio_origen: data.datos_referencia.servicio_origen,
                    codigo_establecimiento_origen: data.datos_referencia.codigo_establecimiento_origen,
                    servicio_destino: data.datos_referencia.servicio_destino,
                    numero_referencia: data.datos_referencia.numero_referencia,
                    id_referencia: data.datos_referencia.id_referencia,
                    fecha_envio: data.datos_referencia.fecha_envio,
                    resume_anamnesis: data.datos_referencia.resume_anamnesis,
                    resume_exfisico: data.datos_referencia.resume_exfisico,
                    motivo_referencia: data.datos_referencia.motivo_referencia,
                    tipo_financiador: data.datos_referencia.tipo_financiador,
                    fecha_aceptacion: data.datos_referencia.fecha_aceptacion
                },
                personal_refiere: {
                    tipo_documento: data.personal_refiere.tipo_documento,
                    numero_documento: data.personal_refiere.numero_documento,
                    nombres: data.personal_refiere.nombres,
                    primer_apellido: data.personal_refiere.primer_apellido,
                    segundo_apellido: data.personal_refiere.segundo_apellido
                },
                personal_responsable: {
                    tipo_documento: data.personal_responsable.tipo_documento,
                    numero_documento: data.personal_responsable.numero_documento,
                    nombres: data.personal_responsable.nombres,
                    primer_apellido: data.personal_responsable.primer_apellido,
                    segundo_apellido: data.personal_responsable.segundo_apellido
                },
                diagnosticos: data.diagnosticos ? data.diagnosticos.map(d => ({
                    id: d.id,
                    codigo_ciex: d.codigo_ciex,
                    tipo_diagnostico: d.tipo_diagnostico
                })) : [],
                tratamiento: data.tratamiento ? data.tratamiento.map(t => ({
                    codigo_medicamento: t.codigo_medicamento,
                    concentracion: t.concentracion,
                    presentacion: t.presentacion,
                    ff: t.ff,
                    cantidad: t.cantidad,
                    frecuencia: t.frecuencia,
                    periodo: t.periodo
                })) : [],
                cpt_imagenes: data.cpt_imagenes ? data.cpt_imagenes.map(d => ({
                    cpt: d.cpt1
                })) : [],
                cpt_laboratorio: data.cpt_laboratorio ? data.cpt_laboratorio.map(d => ({
                    cpt: d.cpt
                })) : [],
                cpt_procedimiento: data.cpt_procedimiento ? data.cpt_procedimiento.map(d => ({
                    cpt: d.cpt
                })) : [],
            })
        });

        if (pacientesData.length > 0) {
            oTable_atencionesRefconMinsa.fnAddData(pacientesData)
        }

        Cargando(0)
        // Cargando(1)
        // $.ajax({
        //     method: "POST",
        //     url: "/Referencia/ConsultaBandejaReferidosRecibidos?area=Comun",
        //     //contentType: "application/json; charset=utf-8",
        //     data: midata,
        //     dataType: "json",
        //     cache: false,
        //     processData: false,
        //     contentType: false,
        //     async: true,
        //     success: function (res) {

        //         const fechaActual = new Date();

        //         // Formatear la fecha en formato yyyymmdd
        //         const yyyy = fechaActual.getFullYear();
        //         const mm = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
        //         const dd = String(fechaActual.getDate()).padStart(2, '0');

        //         const fechaFormateada = `${yyyy}${mm}${dd}`

        //         if (res.estado) {

        //             if (res.data.codigo == '6000') {
        //                 swal({
        //                     title: 'Referencias',
        //                     text: "No existe registros",
        //                     type: 'info',
        //                 }).done()
        //                 Cargando(0)
        //                 return false
        //             }

        //             let datos = res.data.datos.datos

        //             let pacientesRefcon = []
        //             console.log('datos', datos)

        //             if (!isEmpty(datos)) {
        //                 for (const [key, value] of Object.entries(datos)) {
        //                     let data = value.data

        //                     let datos_referencia = data.datos_referencia
        //                     let paciente = data.paciente
        //                     let personal_refiere = data.personal_refiere
        //                     let datos_tutor = data.datos_tutor

        //                     const fecha_referenciaPartes = datos_referencia.fecha_referencia.split('/');
        //                     const dd1 = fecha_referenciaPartes[0];
        //                     const mm1 = fecha_referenciaPartes[1];
        //                     const yyyy1 = fecha_referenciaPartes[2];

        //                     const fechaReferenciaFormateada = `${yyyy1}${mm1}${dd1}`;

        //                     console.log(key, value);


        //                     pacientesRefcon.push({
        //                         tipFinanciador: 2,
        //                         numeroSeguro: paciente.numero_documento,
        //                         fechaVencimientoSis: '',
        //                         tipDocumento: paciente.tipo_documento == 'DNI' ? 1 : 2,
        //                         dni: paciente.numero_documento,
        //                         apePaterno: paciente.primer_apellido,
        //                         apeMaterno: paciente.segundo_apellido,
        //                         nombres: paciente.nombres,
        //                         fecNacimiento: paciente.fecha_nacimiento,
        //                         direccion: paciente.direccion,
        //                         sexo: paciente.sexo == 'M' ? 1 : 2,
        //                         ubigeo1: paciente.ubigeo,
        //                         ubigeo2: '',
        //                         celular: paciente.celular,
        //                         condicionPaciente: datos_referencia.condicion,
        //                         tipDocumentoMedico: personal_refiere.tipo_documento,
        //                         numDocumentoMedico: personal_refiere.numero_documento,
        //                         fecActual: fechaFormateada,
        //                         fecSolicitudReferencia: fechaReferenciaFormateada,
        //                         fecCita: fechaFormateada,
        //                         codServicio: datos_referencia.servicio_destino,
        //                         especialidad: datos_referencia.codigo_especialidad,
        //                         nroReferencia: datos_referencia.numero_referencia,
        //                         resAnamnesis: datos_referencia.resume_anamnesis,
        //                         resExaFisico: datos_referencia.resume_exfisico,
        //                         diagnostico1: "",
        //                         tipoDiagnostico1: "",
        //                         diagnostico2: "",
        //                         tipoDiagnostico2: "",
        //                         diagnostico3: "",
        //                         tipoDiagnostico3: "",
        //                         codRenipressOrigen: datos_referencia.numero_referencia.split('-')[0],
        //                         codRenipressDestino: "2698",
        //                         ubigeoRenipress: "",
        //                         cpt1: "",
        //                         cpt2: "",
        //                         cpt3: "",
        //                         cpt4: "",
        //                         cpt5: "",
        //                         cpt6: "",
        //                         cpt7: "",
        //                         cpt8: "",
        //                         cpt9: "",

        //                         tipDocumentoTutor: datos_tutor.tipo_documento,
        //                         numDocumentoTutor: datos_tutor.numero_documento,
        //                         apePaternoTutor: datos_tutor.primer_apellido,
        //                         apeMaternoTutor: datos_tutor.segundo_apellido,
        //                         nombreTutor: datos_tutor.nombres,
        //                         idReferencia: datos_referencia.id_referencia,

        //                         id_referencia: datos_referencia.id_referencia,
        //                         establecimiento_origen: datos_referencia.codigo_establecimiento_origen,
        //                         especialidad: datos_referencia.codigo_especialidad,
        //                         servicio_detino: datos_referencia.servicio_destino,
        //                         primer_apellido: paciente.primer_apellido,
        //                         segundo_apellido: paciente.segundo_apellido,
        //                         nombres: paciente.nombres,
        //                         tipo_documento: paciente.tipo_documento,
        //                         numero_documento: paciente.numero_documento,
        //                         sexo: paciente.sexo
        //                     })
        //                 }

        //                 if (pacientesRefcon.length > 0) {
        //                     oTable_atencionesRefconMinsa.fnAddData(pacientesRefcon)
        //                 }

        //                 console.log('pacientesRefcon', pacientesRefcon)
        //             }



        //             Cargando(0)

        //         } else {
        //             alerta(res.tipo, res.msj)
        //             console.log(res)
        //             Cargando(0)
        //         }


        //         //Cargando(0)
        //     }
        // });
    },
    recibirCita: async function (
        codUnicoDestino,
        consultorio,
        fecha,
        hora,
        turno,
        apePaternoMedico,
        apeMaternoMedico,
        nombresMedico,
        tipoDocumentoMedico,
        numeroDocumentoMedico,
        fechaNacimientoMedico,
        sexoMedico,
        idReferencia,
        idColegio,
        idProfesion
    ) {
        let formData = new FormData();

        formData.append('data', JSON.stringify({
            "codUnicoDestino": codUnicoDestino,
            "datosCita": {
                "consultorio": consultorio,
                "fecha": fecha,
                "hora": hora,
                "turno": turno
            },
            "datosMedico": {
                "apellidoMaterno": apeMaternoMedico,
                "apellidoPaterno": apePaternoMedico,
                "fechaNacimiento": fechaNacimientoMedico,
                "nombres": nombresMedico,
                "nroDocumento": numeroDocumentoMedico,
                "sexo": sexoMedico,
                "tipoDocumento": tipoDocumentoMedico
            },
            "idReferencia": idReferencia,
            "personalRegistra": {
                "apellidoMaterno": apeMaternoMedico,
                "apellidoPaterno": apePaternoMedico,
                "fechaNacimiento": fechaNacimientoMedico,
                "idcolegio": idColegio,
                "idprofesion": idProfesion,
                "nombres": nombresMedico,
                "nroDocumento": numeroDocumentoMedico,
                "sexo": sexoMedico,
                "tipoDocumento": tipoDocumentoMedico
            }
        }));

        let response = await HttpClient.Post("/Referencia/recibirCita?area=Comun", formData);

        return response.data;
    },
    ListarFechasFuturasProgramacionMedicaRefcon: async function (idEspecialidad, idMedico, fechaAtencion, codigoServicioSuSalud, codigoColor) {
        let datos;
        let midata = new FormData();
        midata.append('idEspecialidad', idEspecialidad);
        midata.append('idMedico', idMedico);
        midata.append('fechaAtencion', fechaAtencion);
        midata.append('codigoServicioSuSalud', codigoServicioSuSalud);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarFechasFuturasProgramacionMedicaRefcon?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.dataSet.table.length > 0) {
                datos = datos.dataSet.table;
                $(datos).each(function (i, obj) {
                    ResaltarFechaDatePicker(obj.fecha, codigoColor);
                });
            }
        } catch (error) {
            Cargando(0)
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },



    LimpiarCampos: function () {
        Referencias.idPaciente = 0

        Referencias.idReferencia = 0
        Referencias.idContraReferencia = 0

        Referencias.datosReferencia = {}
        Referencias.datosAfiliacion = {}
        Referencias.idProgramacion = 0

        $('#tabPaciente').find('input, select, textarea').each(function () {
            if ($(this).is(':checkbox') || $(this).is(':radio')) {
                $(this).prop('checked', false); // desmarca checkboxes y radios
            } else {
                $(this).val(''); // limpia textos, fechas, números, etc.
            }
        });
        $('#tabCita').find('input, select, textarea').each(function () {
            if ($(this).is(':checkbox') || $(this).is(':radio')) {
                $(this).prop('checked', false); // desmarca checkboxes y radios
            } else {
                $(this).val(''); // limpia textos, fechas, números, etc.
            }
        });

        $('#txtFechaCita').val('')
        oTable_ProgramacionMedica.fnClearTable()

        $('.chzn-select').chosen().trigger("chosen:updated");
    },



















    async ConsultarRefCon() {
        //console.log("ENTROOOOO");    
        var objrowTb = oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        this.LimpiarModal();
        this.DeshabilitarModal();
        await this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardarRefCon").hide();
    },

    async ModificarRefCon() {
        //console.log("ENTROOOOO");       
        var objrowTb = oTable_atenciones.api(true).row('.selected').data();
        //console.log(objrowTb);
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        this.LimpiarModal();
        this.HabilitarModal();
        await this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardarRefCon").show();
    },

    GuardarRef() {
        if (this.ValidarVariablesRef()) {
            Cargando(1);
            var data = this.CargarVariablesRef();
            $.ajax({
                method: "POST",
                url: "/Referencia/GuardarReferencia?area=Comun",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                success: function (datos) {
                    Cargando(0);
                    var respuesta;
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            respuesta = datos.respuesta.table[0];
                            if (respuesta.mensaje == "Exito") {
                                Referencias.estadoGuardadoRefCon = true;
                                alerta(1, 'La Referencia se modificó correctamente.');
                                Referencias.idReferencia = 0
                                Referencias.idContraReferencia = 0
                                Referencias.CerrarModal();
                                if (moduloActualRefCon == '') {
                                    //console.log("ENTROOOOOO");
                                    Referencias.ListarAtenciones();
                                }

                            } else {
                                alerta(2, respuesta.mensaje);
                            }
                            //console.log(respuesta);
                        }
                        else {
                            respuesta = {};
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        //location.reload();
                    }
                }
            });
        }
    },

    GuardarConRef() {
        if (this.ValidarVariablesConRef()) {
            Cargando(1);
            var data = this.CargarVariablesConRef();
            $.ajax({
                method: "POST",
                url: "/Referencia/GuardarContraReferencia?area=Comun",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                success: function (datos) {
                    Cargando(0);
                    var respuesta;
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            respuesta = datos.respuesta.table[0];
                            if (respuesta.mensaje == "Exito") {
                                Referencias.estadoGuardadoRefCon = true;
                                alerta(1, 'La Contrareferencia se modificó correctamente.');
                                Referencias.CerrarModal();
                                if (moduloActualRefCon == '') {
                                    //console.log("ENTROOOOOO");
                                    Referencias.ListarAtenciones();
                                }
                            }
                            //console.log(respuesta);
                        }
                        else {
                            respuesta = {};
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        //location.reload();
                    }
                }
            });
        }
    },



    REFCONSP_REGISTRO_CITA: async function (obj) {
        var formData = new FormData();
        formData.append("tipFinanciador", obj.tipFinanciador || "");
        formData.append("numeroSeguro", obj.numeroSeguro || "");
        formData.append("fechaVencimientoSis", obj.fechaVencimientoSis || "");
        formData.append("tipDocumento", obj.tipDocumento || "");
        formData.append("dni", obj.dni || "");
        formData.append("apePaterno", obj.apePaterno || "");
        formData.append("apeMaterno", obj.apeMaterno || "");
        formData.append("nombres", obj.nombres || "");
        formData.append("fecNacimiento", obj.fecNacimiento || "");
        formData.append("direccion", obj.direccion || "");
        formData.append("sexo", obj.sexo || "");
        formData.append("ubigeo1", obj.ubigeo1 || "");
        formData.append("ubigeo2", obj.ubigeo2 || "");
        formData.append("celular", obj.celular || "");
        formData.append("condicionPaciente", obj.condicionPaciente || "");
        formData.append("tipDocumentoMedico", obj.tipDocumentoMedico || "");
        formData.append("numDocumentoMedico", obj.numDocumentoMedico || "");
        formData.append("fecActual", obj.fecActual || "");
        formData.append("fecSolicitudReferencia", obj.fecha_referencia || "");
        formData.append("fecCita", obj.fecCita || "");
        formData.append("codServicio", obj.codServicio || "");
        formData.append("especialidad", obj.especialidad || "");
        formData.append("nroReferencia", obj.nroReferencia || "");
        formData.append("resAnamnesis", obj.resAnamnesis || "");
        formData.append("resExaFisico", obj.resExaFisico || "");
        formData.append("diagnostico1", obj.diagnostico1 || "");
        formData.append("tipoDiagnostico1", obj.tipoDiagnostico1 || "");
        formData.append("diagnostico2", obj.diagnostico2 || "");
        formData.append("tipoDiagnostico2", obj.tipoDiagnostico2 || "");
        formData.append("diagnostico3", obj.diagnostico3 || "");
        formData.append("tipoDiagnostico3", obj.tipoDiagnostico3 || "");
        formData.append("codRenipressOrigen", obj.codRenipressOrigen || "");
        formData.append("codRenipressDestino", obj.codRenipressDestino || "");
        formData.append("ubigeoRenipress", obj.ubigeoRenipress || "");
        formData.append("cpt1", obj.cpt1 || "");
        formData.append("cpt2", obj.cpt2 || "");
        formData.append("cpt3", obj.cpt3 || "");
        formData.append("cpt4", obj.cpt4 || "");
        formData.append("cpt5", obj.cpt5 || "");
        formData.append("cpt6", obj.cpt6 || "");
        formData.append("cpt7", obj.cpt7 || "");
        formData.append("cpt8", obj.cpt8 || "");
        formData.append("cpt9", obj.cpt9 || "");
        formData.append("tipDocumentoTutor", obj.tipDocumentoTutor || "");
        formData.append("numDocumentoTutor", obj.numDocumentoTutor || "");
        formData.append("apePaternoTutor", obj.apePaternoTutor || "");
        formData.append("apeMaternoTutor", obj.apeMaternoTutor || "");
        formData.append("nombreTutor", obj.nombreTutor || "");
        formData.append("idReferencia", obj.idReferencia || "");
        formData.append("resultado", obj.resultado || "");

        Cargando(1)
        try {
            // Primera llamada AJAX
            const res1 = await $.ajax({
                method: "POST",
                url: "/Referencia/REFCONSP_REGISTRO_CITA?area=Comun",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
            });

            if (isEmpty(res1.data)) {
                swal({
                    title: 'Atenciones',
                    text: "Algo salió mal en la primera llamada",
                    type: 'info',
                }).done();
                Cargando(0);
                return;
            }

            if (res1.data.table.length > 0) {
                let dataCita = res1.data.table[0];

                console.log('dataCita', dataCita)

                // Preparar los datos para la segunda llamada
                let data = new FormData();
                data.append('data', JSON.stringify({
                    "codUnicoDestino": dataCita.codigoRenipressDestino,
                    "datosCita": {
                        "consultorio": dataCita.nombreConsultorio,
                        "fecha": dataCita.fechaCita,
                        "hora": dataCita.horaCita,
                        "turno": dataCita.turnoServicio
                    },
                    "datosMedico": {
                        "apellidoMaterno": dataCita.apeMaternoMedico,
                        "apellidoPaterno": dataCita.apePaternoMedico,
                        "fechaNacimiento": dataCita.fechaNacimientoMedico,
                        "nombres": dataCita.nombresMedico,
                        "nroDocumento": dataCita.numeroDocumentoMedico,
                        "sexo": dataCita.sexoMedicoo,
                        "tipoDocumento": dataCita.tipoDocumentoMedico
                    },
                    "idReferencia": obj.idReferencia,
                    "personalRegistra": {
                        "apellidoMaterno": dataCita.apeMaternoMedico,
                        "apellidoPaterno": dataCita.apePaternoMedico,
                        "fechaNacimiento": dataCita.fechaNacimientoMedico,
                        "idcolegio": "1",
                        "idprofesion": "1",
                        "nombres": dataCita.nombresMedico,
                        "nroDocumento": dataCita.numeroDocumentoMedico,
                        "sexo": dataCita.sexoMedicoo,
                        "tipoDocumento": dataCita.tipoDocumentoMedico
                    }
                }));

                // Segunda llamada AJAX
                const res2 = await $.ajax({
                    method: "POST",
                    url: "/Referencia/recibirCita?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                });

                if (res2.data.codigo == '0000') {
                    swal({
                        title: 'Atenciones',
                        text: `La referencia fue aceptada: fecha cita ${dataCita.fechaCita} hora: ${dataCita.horaCita} consultorio: ${dataCita.nombreServicio}`,
                        type: 'info',
                    }).done();
                } else {
                    swal({
                        title: 'Atenciones',
                        text: "Error al generar cita, por favor intentalo nuevamente",
                        type: 'error',
                    }).done();
                }
                // Si la segunda llamada fue exitosa

            }
        } catch (error) {
            // Manejo de errores en cualquier llamada
            swal({
                title: 'Atenciones',
                text: "Ocurrió un error durante el proceso",
                type: 'error',
            }).done();
            Cargando(0);
        } finally {
            // Finalizar la carga
            Cargando(0);
        }
    },
    /*
    GenerarHojaRefCon(idCuenta, idRefCon, tipo, tipoDoc) {
        if (this.ValidarVariablesConRef()) {
            Cargando(1);
            var data = this.CargarVariablesConRef();
            $.ajax({
                method: "POST",
                url: "/Referencia/GuardarContraReferencia?area=Comun",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0);
                    var respuesta;
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            respuesta = datos.respuesta.table[0];
                            if (respuesta.mensaje == "Exito") {
                                alerta(1, 'La Contrareferencia se modificó correctamente.');
                                Referencias.CerrarModal();
                            }
                            console.log(respuesta);
                        }
                        else {
                            respuesta = {};
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        location.reload();
                    }
                }
            });
        }
    },*/

    async CargarData(IdCuentaAtencion, IdAtencion, TipoRef) {

        //await Referencias.ListarEspecialidades();
        //await Referencias.ListarUPServiciosOrigen('6208');
        //await Referencias.ListarCondicionUsuario();

        if (this.ValidarCargaData()) {
            //var objrowTb = oTable_atenciones.api(true).row('.selected').data();

            if (TipoRef == 1) {
                await this.CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef);
            } else if (TipoRef == 2) {
                await this.CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef);
            }
        }
    },

    async CargarDataSinValidar(IdCuentaAtencion, IdAtencion, TipoRef, modulo) {
        this.LimpiarModal();
        this.HabilitarModal();
        moduloActualRefCon = modulo;
        //console.log(TipoRef);
        if (TipoRef == 1) {
            await this.CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef);
        } else if (TipoRef == 2) {
            await this.CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef);
        }
    },

    async CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef) {
        //var objrowTb = oTable_atenciones.api(true).row('.selected').data();
        Cargando(1);
        const objrow = await this.AtencionReferenciaSeleccionarPorIdCuenta(IdCuentaAtencion, TipoRef);
        const dxAt = await this.ListaDiagnosticosAtencion(IdAtencion);
        const respEESS = await this.ReferenciaResponsableEESSSelecionar();

        //await this.ListarUPServiciosOrigen(objrow.codigoEstablecimientoOrigen);

        if (objrow.ipressDestino != '') {
            await this.ListarUPServiciosDestino(objrow.ipressDestino);
        }

        this.responsable = objrow.idEmpleadoMedico;
        this.responsableEESS = respEESS.idEmpleadoEESS;

        //$('#txtNroReferencia').val('6208-01090');
        $('#ipressorigen').val(objrow.codigoEstablecimientoOrigen);
        $('#origen').val(objrow.nombreEstablecimientoOrigen);
        //$('#servicioorigen').val(objrow.servicioOrigen + ' / ' + objrow.especialidadOrigen);
        $('#cboServicioOrigen').val(objrow.upsOrigen);
        //$('#servicioorigen').val(objrow.idServicioOrigen);
        $('#ipressdestino').val(objrow.ipressDestino);
        $('#destino').val(objrow.nombreEstablecimientoDestino);
        $('#cboServicioDestino').val(objrow.upsDestino);
        //$('#serviciodestino').val(objrow.servicioDestino + ' / ' + objrow.especialidadDestino);
        //$('#serviciodestino').val(objrow.idServicioDestino);
        $('#txtTipoDoc').val(objrow.tipoDocumentoPaciente);
        $('#txtNumDoc').val(objrow.nrodocumentoPaciente);
        //$('#txtFinanciador').val('USUARIO');
        $('#txtFinanciador').val(objrow.financiador);
        $('#txtNumAfiliacion').val(objrow.nroAfiliacion);
        $('#txtNumHistoria').val(objrow.historiaPaciente);
        $('#txtApPaterno').val(objrow.apPaternoPaciente);
        $('#txtApMaterno').val(objrow.apMaternoPaciente);
        $('#txtNombresR').val(objrow.nombresPaciente);
        $('#txtSexo').val(objrow.sexoPaciente);
        $('#txtFechaNacimiento').val(objrow.fechaNacimientoPaciente);
        $('#txtEdad').val(objrow.edadPaciente);
        $('#txtDomicilio').val(objrow.direccionPaciente);
        $('#txtDepartamento').val(objrow.departamentoPaciente);
        $('#txtProvincia').val(objrow.provinciaPaciente);
        $('#txtDistrito').val(objrow.distritoPaciente);
        $('#txtOrigenRef').val(objrow.nombreEstablecimientoDestino);
        $('#txtServContraRef').val(objrow.servicioOrigen);
        $('#txtEspContraRef').val(objrow.especialidadOrigen);

        $('#txtMedico').val(objrow.medico);
        $('#txtProfesionMedico').val(objrow.profesionMedico);
        $('#txtColegioProfesional').val(objrow.colegioMedico);

        $('#txtMedicoEESS').val(respEESS.medicoEESS);
        $('#txtProfesionMedicoESS').val(respEESS.profesionMedicoEESS);
        $('#txtColegioProfesionalEESS').val(respEESS.colegioMedicoEESS);

        //////////REFERENCIA//////////////
        $('#txtNroReferencia').val('6208-' + objrow.nroReferenciaOrigen);
        $('#txtAnamnesisRef').val(objrow.anamnesis);
        $('#txtTPRef').val(objrow.tp);
        $('#txtPARef').val(objrow.pa);
        $('#txtFRRef').val(objrow.fr);
        $('#txtFCRef').val(objrow.fc);
        $('#txtExamenFisicoRef').val(objrow.examenFisico);
        //$('#txtMotivoRef').val(objrow.motivo);
        $("#cboMotivoRef").val(objrow.motivo);
        $('#txtDetalleMotivoRef').val(objrow.detalleMotivo);
        $('#txtNotasObsRef').val(objrow.observaciones);
        $('#cboCondicion').val(objrow.condicionPaciente);
        $('#cbotransporte').val(objrow.tipoTransporte);
        $('#cboEspecialidadRef').val(objrow.especialidadDestino);
        ////////////////////////////////////

        $('#txtDxEgresoRef').val('');
        $.each(dxAt, function (i, item) {
            //alert(data.result[i].PageName);
            //var dx = $('#txtDxEgreso').val() + '\n';
            $('#txtDxEgresoRef').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');
        });
        $('#txtTratamientoRef').val(objrow.tratamiento);

        if (moduloActualRefCon == 'ModuloCE' || moduloActualRefCon == 'ModuloNinoSano' || moduloActualRefCon == 'ModuloMaterno') {
            $('#txtDxEgresoRef').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoRef').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });

            if (objrow.idRefCon == null) {
                if (moduloActualRefCon == 'ModuloMaterno') {
                    $('#txtAnamnesisRef').val($('#txtMotivoConsultaPeri').val());
                }
                if (moduloActualRefCon == 'ModuloCE') {
                    $('#txtAnamnesisRef').val($('#txtMotivoCons').val());
                    $('#txtExamenFisicoRef').val($('#txtExamenC').val());
                }

                $('#txtTratamientoRef').val($('#txtTratamiento').val());
            }
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
        Cargando(0);
        this.AbrirModalRef();
    },

    async CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef) {
        //var objrowTb = oTable_atenciones.api(true).row('.selected').data();
        //console.log(objrowTb);
        Cargando(1);
        const objrow = await this.AtencionReferenciaSeleccionarPorIdCuenta(IdCuentaAtencion, TipoRef);
        const dxAt = await this.ListaDiagnosticosAtencion(IdAtencion);
        const respEESS = await this.ReferenciaResponsableEESSSelecionar();

        //await this.ListarUPServiciosOrigen(objrow.codigoEstablecimientoOrigen);
        await this.ListarUPServiciosDestino(objrow.codigoEstablecimientoDestino);

        this.responsable = objrow.idEmpleadoMedico;
        this.responsableEESS = respEESS.idEmpleadoEESS;

        $('#ipressorigenCR').val(objrow.codigoEstablecimientoOrigen);
        $('#origenCR').val(objrow.nombreEstablecimientoOrigen);
        $('#cboServicioOrigenCR').val(objrow.upsOrigen);
        //$('#servicioorigenCR').val(objrow.servicioOrigen + ' / ' + objrow.especialidadOrigen);
        //$('#servicioorigen').val(objrow.idServicioOrigen);
        $('#ipressdestinoCR').val(objrow.codigoEstablecimientoDestino);
        $('#destinoCR').val(objrow.nombreEstablecimientoDestino);
        $('#cboServicioDestinoCR').val(objrow.upsDestino);
        //$('#serviciodestino').val(objrow.servicioDestino + ' / ' + objrow.especialidadDestino);
        //$('#serviciodestino').val(objrow.idServicioDestino);
        $('#txtTipoDocCR').val(objrow.tipoDocumentoPaciente);
        $('#txtNumDocCR').val(objrow.nrodocumentoPaciente);
        //$('#txtFinanciador').val('USUARIO');
        $('#txtFinanciadorCR').val(objrow.financiador);
        $('#txtNumAfiliacionCR').val(objrow.nroAfiliacion);
        $('#txtNumHistoriaCR').val(objrow.historiaPaciente);
        $('#txtApPaternoCR').val(objrow.apPaternoPaciente);
        $('#txtApMaternoCR').val(objrow.apMaternoPaciente);
        $('#txtNombresCR').val(objrow.nombresPaciente);
        $('#txtSexoCR').val(objrow.sexoPaciente);
        $('#txtFechaNacimientoCR').val(objrow.fechaNacimientoPaciente);
        $('#txtEdadCR').val(objrow.edadPaciente);
        $('#txtDomicilioCR').val(objrow.direccionPaciente);
        $('#txtDepartamentoCR').val(objrow.departamentoPaciente);
        $('#txtProvinciaCR').val(objrow.provinciaPaciente);
        $('#txtDistritoCR').val(objrow.distritoPaciente);
        $('#txtOrigenRefCR').val(objrow.nombreEstablecimientoDestino);
        //$('#txtServContraRefCR').val(objrow.servicioOrigen);

        //$('#txtEspContraRefCR').val(objrow.especialidadOrigen);
        //$('#cboEspecialidadCR').val(objrow.especialidadOrigen)
        $('#cboEspecialidadCR').val(objrow.especialidad)
        $('#txtMedicoCR').val(objrow.medico);
        $('#txtProfesionMedicoCR').val(objrow.profesionMedico);
        $('#txtColegioProfesionalCR').val(objrow.colegioMedico);

        $('#txtNroContraReferencia').val(objrow.nroHoja);
        $('#txtDxOrigenCR').val(objrow.dxOrigen);
        $('#txtDxIngresoCR').val(objrow.dxIngreso);
        $('#txtCalificaRefCR').val(objrow.calificacion);
        $('#txtRecomendaciones').val(objrow.recomendaciones);
        $('#cboCondicionUsuario').val(objrow.idCondicionUsuario);

        $('#txtDxEgresoCR').val('');
        $.each(dxAt, function (i, item) {
            $('#txtDxEgresoCR').val($('#txtDxEgresoCR').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto.trim() + '- ' + dxAt[i].descripcion.trim() + '  (' + dxAt[i].subclasDiagnostico.trim() + ') \n');
        });
        $('#txtTratamientoCR').val(objrow.tratamiento);

        if (moduloActualRefCon == 'ModuloCE' || moduloActualRefCon == 'ModuloNinoSano' || moduloActualRefCon == 'ModuloMaterno') {
            $('#txtDxEgresoCR').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoCR').val($('#txtDxEgresoCR').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });

            if (objrow.idRefCon == null) {
                $('#txtTratamientoCR').val($('#txtTratamiento').val());
            }

        }

        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
        Cargando(0);
        this.AbrirModalConRef();
    },


    ValidarCargaData() {
        var objrowTb = oTable_atenciones.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro.');
            return false;
        }
        //var objrow = AtencionReferenciaSeleccionarPorIdCuenta(objrowTb.idCuentaAtencion, objrowTb.TipoRef);
        //var dxAt = ListaDiagnosticosAtencion(objrow.idAtencion);

        if (objrowTb.idEstadoAtencion == 2) {
            alerta(2, 'La cuenta se encuentra cerrada.');
            return false;
        }
        return true;
    },

    ValidarVariablesConRef() {
        if ($("#cboServicioOrigenCR").val() == "" || $("#cboServicioOrigenCR").val() == null) { alerta(2, "Debe seleccionar el Servicio de Origen."); $("#cboServicioOrigenCR").focus(); return false; }
        if ($("#cboServicioDestinoCR").val() == "" || $("#cboServicioDestinoCR").val() == null) { alerta(2, "Debe seleccionar el Servicio de Destino."); $("#cboServicioDestinoCR").focus(); return false; }
        if ($("#txtTratamientoCR").val() == "" || $("#txtTratamientoCR").val() == null) { alerta(2, "Debe ingresar el Tratamiento Realizado."); $("#txtTratamientoCR").focus(); return false; }
        if ($("#cboEspecialidadCR").val() == "" || $("#cboEspecialidadCR").val() == null) { alerta(2, "Debe seleccionar la Especialidad que Ordena la Contrareferencia."); $("#cboEspecialidadCR").focus(); return false; }
        if ($("#cboCondicionUsuario").val() == "" || $("#cboCondicionUsuario").val() == null) { alerta(2, "Debe seleccionar la Condición del Usuario."); $("#cboCondicionUsuario").focus(); return false; }
        if ($("#txtRecomendaciones").val() == "" || $("#txtRecomendaciones").val() == null) { alerta(2, "Debe ingresar las Recomendaciones e Indicaciones."); $("#txtRecomendaciones").focus(); return false; }
        return true;
    },

    ValidarVariablesRef() {
        if ($("#cboServicioOrigen").val() == "" || $("#cboServicioOrigen").val() == null) { alerta(2, "Debe seleccionar el Servicio de Origen."); $("#cboServicioOrigen").focus(); return false; }
        if ($("#cboServicioDestino").val() == "" || $("#cboServicioDestino").val() == null) { alerta(2, "Debe seleccionar el Servicio de Destino."); $("#cboServicioDestino").focus(); return false; }
        if ($("#txtAnamnesisRef").val() == "" || $("#txtAnamnesisRef").val() == null) { alerta(2, "Debe ingresar la Anamnesis."); $("#txtAnamnesisRef").focus(); return false; }
        if ($("#txtExamenFisicoRef").val() == "" || $("#txtExamenFisicoRef").val() == null) { alerta(2, "Debe ingresar el Examen Físico."); $("#txtExamenFisicoRef").focus(); return false; }
        if ($("#txtTratamientoRef").val() == "" || $("#txtTratamientoRef").val() == null) { alerta(2, "Debe ingresar el Tratamiento."); $("#txtTratamientoRef").focus(); return false; }
        //if ($("#txtMotivoRef").val() == "" || $("#txtMotivoRef").val() == null) { alerta(2, "Debe ingresar el Motivo de la Referencia."); $("#txtMotivoRef").focus(); return false; }
        if ($("#cboMotivoRef").val() == "" || $("#cboMotivoRef").val() == null) { alerta(2, "Debe seleccionar el Motivo de la Referencia."); $("#cboMotivoRef").focus(); return false; }
        if ($("#txtDetalleMotivoRef").val() == "" || $("#txtDetalleMotivoRef").val() == null) { alerta(2, "Debe ingresar el Detalle del Motivo de la Referencia."); $("#txtDetalleMotivoRef").focus(); return false; }
        if ($("#txtNotasObsRef").val() == "" || $("#txtNotasObsRef").val() == null) { alerta(2, "Debe ingresar Notas/Observaciones de la Referencia."); $("#txtNotasObsRef").focus(); return false; }

        if ($("#cboEspecialidadRef").val() == "" || $("#cboEspecialidadRef").val() == null) { alerta(2, "Debe seleccionar la Especialidad del Destino."); $("#cboEspecialidadRef").focus(); return false; }
        if ($("#cboCondicion").val() == "" || $("#cboCondicion").val() == null) { alerta(2, "Debe seleccionar la Condición del Paciente."); $("#cboCondicion").focus(); return false; }
        if ($("#cbotransporte").val() == "" || $("#cbotransporte").val() == null) { alerta(2, "Debe seleccionar el Tipo de Transporte."); $("#cbotransporte").focus(); return false; }
        return true;
    },

    CargarVariablesConRef() {

        var objrow = oTable_atenciones.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        }

        //fechaDiaValor = fechaDia();
        //valorFecha = fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)

        //console.log(objrow.idCuentaAtencion);

        var formData = new FormData();
        formData.append('NroHojaContraReferencia', $('#txtNroContraReferencia').val());
        formData.append('IdCuentaAtencion', objrow.idCuentaAtencion);
        formData.append('IpressOrigen', $('#ipressorigenCR').val());
        formData.append('IpressDestino', $('#ipressdestinoCR').val());
        formData.append('ServicioOrigen', $('#cboServicioOrigenCR').val());
        formData.append('ServicioDestino', $('#cboServicioDestinoCR').val());
        formData.append('Especialidad', $('#cboEspecialidadCR').val());
        formData.append('DxOrigen', $('#txtDxOrigenCR').val());
        formData.append('DxIngreso', $('#txtDxIngresoCR').val());
        formData.append('DxEgreso', $('#txtDxEgresoCR').val());
        formData.append('Tratamiento', $('#txtTratamientoCR').val());
        formData.append('Recomendaciones', $('#txtRecomendaciones').val());
        formData.append('Calificacion', $('#txtCalificaRefCR').val());
        formData.append('CondicionUsuario', $('#cboCondicionUsuario').val());

        $('.chzn-select').chosen().trigger("chosen:updated");

        formData.append('DescOrigen', $('#origenCR').val());
        formData.append('DescServicioOrigen', $('#cboServicioOrigenCR_chosen').text());
        formData.append('DescDestino', $('#destinoCR').val());
        formData.append('DescServicioDestino', $('#cboServicioDestinoCR_chosen').text());
        formData.append('DxEgreso', $('#txtDxEgresoCR').val());
        formData.append('DescEspecialidad', $('#cboEspecialidadCR_chosen').text());

        formData.append('IdResponsable', this.responsable);
        formData.append('IdResponsableEESS', this.responsableEESS);

        //////////////Para Firma DIgital////////////////////
        formData.append('codigoFD', objrow.codeCRef);
        formData.append('IdTipoServicioFD', objrow.idTipoServicio);
        formData.append('IdServicioFD', objrow.idServicioIngreso);
        formData.append('IdEmpleadoFD', objrow.idEmpleadoMedico);
        formData.append('IdServicioFD', objrow.idServicioIngreso);
        formData.append('fechaFD', objrow.fechaIngreso2);
        ////////////////////////////////////////////////////


        return formData;
    },

    CargarVariablesRef() {
        var objrow = oTable_atenciones.api(true).row('.selected').data();
        //fechaDiaValor = fechaDia();
        //valorFecha = fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)
        if (isEmpty(objrow)) {
            objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        }
        //console.log(objrow.idCuentaAtencion);

        var formData = new FormData();
        formData.append('NroHojaReferencia', $('#NroHojaReferencia').val());
        formData.append('IdCuentaAtencion', objrow.idCuentaAtencion);
        formData.append('IpressOrigen', $('#ipressorigen').val());
        formData.append('IpressDestino', $('#ipressdestino').val());
        formData.append('ServicioOrigen', $('#cboServicioOrigen').val());
        formData.append('ServicioDestino', $('#cboServicioDestino').val());
        formData.append('Anamnesis', $('#txtAnamnesisRef').val());
        formData.append('ExamenFisico', $('#txtExamenFisicoRef').val());
        formData.append('Tratamiento', $('#txtTratamientoRef').val());
        //formData.append('Motivo', $('#txtMotivoRef').val())
        formData.append('Motivo', $('#cboMotivoRef').val())
        formData.append('DetalleMotivo', $('#txtDetalleMotivoRef').val());
        formData.append('NotasObservaciones', $('#txtNotasObsRef').val());
        formData.append('EspecialidadDestino', $('#cboEspecialidadRef').val());
        formData.append('CondicionPaciente', $('#cboCondicion').val());
        formData.append('TipoTransporte', $('#cbotransporte').val());

        $('.chzn-select').chosen().trigger("chosen:updated");

        formData.append('DescOrigen', $('#origen').val());
        formData.append('DescServicioOrigen', $('#cboServicioOrigen_chosen').text());
        formData.append('DescDestino', $('#destino').val());
        formData.append('DescServicioDestino', $('#cboServicioDestino_chosen').text());
        formData.append('DxEgreso', $('#txtDxEgresoRef').val());
        formData.append('DescEspecialidad', $('#cboEspecialidadRef_chosen').text());

        formData.append('IdResponsable', this.responsable);
        formData.append('IdResponsableEESS', this.responsableEESS);

        //////////////Para Firma DIgital////////////////////
        formData.append('codigoFD', objrow.codeCRef);
        formData.append('IdTipoServicioFD', objrow.idTipoServicio);
        formData.append('IdServicioFD', objrow.idServicioIngreso);
        formData.append('IdEmpleadoFD', objrow.idEmpleadoMedico);
        formData.append('IdServicioFD', objrow.idServicioIngreso);
        formData.append('fechaFD', objrow.fechaIngreso2);
        ////////////////////////////////////////////////////

        return formData;
    },

    async AtencionReferenciaSeleccionarPorIdCuenta(idCuenta, tipo) {


        var respuesta;
        let datos;

        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        midata.append('tipo', tipo);
        var dataReferencia = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/AtencionReferenciaSeleccionarPorIdCuenta?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsReferencia.table.length > 0) {
                    dataReferencia = datos.lsReferencia.table[0];
                }
                else {
                    dataReferencia = {};
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataReferencia;
    },

    //async AtencionReferenciaSeleccionarPorIdCuenta(idCuenta, tipo) {
    //    Cargando(1);
    //    //console.log("F1");
    //    var midata = new FormData();
    //    midata.append('idCuenta', idCuenta);
    //    midata.append('tipo', tipo);
    //    var dataReferencia = {};

    //    $.ajax({
    //        method: "POST",
    //        url: "/Referencia/AtencionReferenciaSeleccionarPorIdCuenta?area=ConsultaExterna",
    //        //contentType: "application/json; charset=utf-8",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        async: false,
    //        success: function (datos) {
    //            Cargando(0);
    //            if (datos.session) {
    //                if (datos.lsReferencia.table.length > 0) {
    //                    dataReferencia = datos.lsReferencia.table[0];
    //                }
    //                else {
    //                    dataReferencia = {};
    //                }

    //            }
    //            else {
    //                alert("La sesion ya expiro se volvera a recargar la pagina")
    //                location.reload();
    //            }
    //        }
    //    })
    //    //console.log(dataReferencia);
    //    return dataReferencia;
    //},

    async ReferenciaResponsableEESSSelecionar() {


        var respuesta;
        let datos;
        var dataResponsableEESS = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/ReferenciaResponsableEESSSelecionar?area=ConsultaExterna",
                    //data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    dataResponsableEESS = datos.respuesta.table[0];
                }
                else {
                    dataReferencia = {};
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataResponsableEESS;
    },

    //async ReferenciaResponsableEESSSelecionar() {
    //    Cargando(1);
    //    //console.log("F1");
    //    /*var midata = new FormData();
    //    midata.append('idCuenta', idCuenta);
    //    midata.append('tipo', tipo);*/
    //    var dataResponsableEESS = {};

    //    $.ajax({
    //        method: "POST",
    //        url: "/Referencia/ReferenciaResponsableEESSSelecionar?area=ConsultaExterna",
    //        //contentType: "application/json; charset=utf-8",
    //        //data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        async: false,
    //        success: function (datos) {
    //            Cargando(0);
    //            if (datos.session) {
    //                if (datos.respuesta.table.length > 0) {
    //                    dataResponsableEESS = datos.respuesta.table[0];
    //                }
    //                else {
    //                    dataReferencia = {};
    //                }

    //            }
    //            else {
    //                alert("La sesion ya expiro se volvera a recargar la pagina")
    //                location.reload();
    //            }
    //        }
    //    })
    //    //console.log(dataResponsableEESS);
    //    return dataResponsableEESS;
    //},

    async ListaDiagnosticosAtencion(idAtencion) {

        var respuesta;
        let datos;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataDiagnosticos = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/AtencionesDiagnosticosSeleccionarXidAtencion?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    dataDiagnosticos = datos.table;
                }
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataDiagnosticos;
    },

    //async ListaDiagnosticosAtencion(idAtencion) {
    //    Cargando(1);
    //    //console.log("F2");
    //    var midata = new FormData();
    //    midata.append('idAtencion', idAtencion);
    //    var dataDiagnosticos = {};
    //    $.ajax({
    //        method: "POST",
    //        url: "/Atencion/AtencionesDiagnosticosSeleccionarXidAtencion?area=ConsultaExterna",
    //        //contentType: "application/json; charset=utf-8",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        async: false,
    //        success: function (datos) {
    //            Cargando(0)
    //            if (datos.table.length !== 0) {
    //                if (!isEmpty(datos.table)) {
    //                    dataDiagnosticos = datos.table;
    //                }
    //            }
    //        },
    //        error: function (msg) {
    //            Cargando(0)
    //        }
    //    })
    //    //console.log(dataDiagnosticos);
    //    return dataDiagnosticos;
    //},
    /*
    var ServiciosPorFiltro = function () {
        var midata = new FormData();
        midata.append('lcfiltro', ' AND Servicios.IdTipoServicio = 1');
        var dataServicios = {};
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Referencia/ServiciosFiltrar?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


                if (datos.session) {
                    if (datos.lsServiciosFiltro.table.length > 0) {
                        dataServicios = datos.lsServiciosFiltro.table[0];                        
                        $('#cboServicioOrigen').empty();
                        $('#cboServicioDestino').empty();
                        $(dataServicios).each(function (i, obj) {
                            $('#cboServicioOrigen').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                            $('#cboServicioDestino').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                        });

                        $('.chzn-select').chosen().trigger("chosen:updated");
                        Cargando(0);
                    }
                    else {
                        dataServicios = {};
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            }

        })
        //console.log(dataServicios);
        //return dataReferencia;


    }*/
    async ListarEspecialidades() {

        var respuesta;
        let datos;
        $('#cboEspecialidadCR').empty();
        $('#cboEspecialidadRef').empty();

        try {
            Cargando(1);
            datos = { "codigo": "0000", "data": [ { "codigo_especialidad": "1-0001", "especialidad": "ADMINISTRACIÓN DE HOSPITALES" }, { "codigo_especialidad": "3-0001", "especialidad": "CIRUGÍA BUCAL MÁXILO FACIAL" }, { "codigo_especialidad": "8-0001", "especialidad": "PSICOLOGÍA CLÍNICA Y DE LA SALUD" }, { "codigo_especialidad": "9-0001", "especialidad": "TERAPIA FÍSICA Y REHABILITACIÓN" }, { "codigo_especialidad": "1-0002", "especialidad": "ADMINISTRACIÓN DE SALUD" }, { "codigo_especialidad": "3-0002", "especialidad": "CARIELOGÍA Y ENDODONCIA" }, { "codigo_especialidad": "8-0002", "especialidad": "PSICOLOGÍA JURÍDICA" }, { "codigo_especialidad": "9-0002", "especialidad": "LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "1-0003", "especialidad": "ADOLESCENTOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "3-0003", "especialidad": "MEDICINA Y PATOLOGÍA ESTOMATOLÓGICA" }, { "codigo_especialidad": "8-0003", "especialidad": "PSICOLOGÍA ORGANIZACIONAL" }, { "codigo_especialidad": "9-0003", "especialidad": "RADIOLOGÍA" }, { "codigo_especialidad": "1-0004", "especialidad": "ANATOMÍA HUMANA" }, { "codigo_especialidad": "3-0004", "especialidad": "ODONTOPEDIATRÍA" }, { "codigo_especialidad": "8-0004", "especialidad": "PSICOLOGÍA EDUCACIONAL" }, { "codigo_especialidad": "9-0004", "especialidad": "OPTOMETRÍA" }, { "codigo_especialidad": "1-0005", "especialidad": "ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "3-0005", "especialidad": "ORTODONCIA Y ORTOPEDIA MAXILAR" }, { "codigo_especialidad": "8-0005", "especialidad": "PSICOLOGÍA POLICIAL-MILITAR" }, { "codigo_especialidad": "9-0005", "especialidad": "TERAPIA OCUPACIONAL" }, { "codigo_especialidad": "1-0006", "especialidad": "ANATOMÍA PATOLÓGICA-PATOLOGÍA CLÍNICA" }, { "codigo_especialidad": "3-0006", "especialidad": "PERIODONCIA" }, { "codigo_especialidad": "8-0006", "especialidad": "PSICOLOGÍA DEL DEPORTE" }, { "codigo_especialidad": "9-0006", "especialidad": "TERAPIA DE LENGUAJE" }, { "codigo_especialidad": "3-0007", "especialidad": "RADIOLOGÍA BUCAL Y MÁXILO FACIAL" }, { "codigo_especialidad": "8-0007", "especialidad": "PSICOLOGÍA SOCIAL-COMUNITARIA" }, { "codigo_especialidad": "1-0008", "especialidad": "ANESTESIOLOGÍA" }, { "codigo_especialidad": "3-0008", "especialidad": "REHABILITACIÓN ORAL" }, { "codigo_especialidad": "8-0008", "especialidad": "PSICOLOGÍA DEL ADULTO MAYOR" }, { "codigo_especialidad": "1-0009", "especialidad": "ANGIOLOGÍA" }, { "codigo_especialidad": "3-0009", "especialidad": "SALUD PÚBLICA ESTOMATOLÓGICA" }, { "codigo_especialidad": "8-0009", "especialidad": "PSICOLOGÍA DE LAS EMERGENCIAS Y DESASTRES" }, { "codigo_especialidad": "1-0010", "especialidad": "BIOQUÍMICA 2" }, { "codigo_especialidad": "3-0010", "especialidad": "ODONTOLOGÍA FORENSE" }, { "codigo_especialidad": "8-0010", "especialidad": "PSICOLOGÍA DE LA FAMILIA" }, { "codigo_especialidad": "1-0011", "especialidad": "CARDIOLOGÍA" }, { "codigo_especialidad": "3-0011", "especialidad": "ESTOMATOLÓGICA DE PACIENTES ESPECIALES" }, { "codigo_especialidad": "8-0011", "especialidad": "PSICOLOGÍA DE LAS ADICCIONES" }, { "codigo_especialidad": "1-0012", "especialidad": "PEDIATRÍA - CIRUGÍA CARDIOVASCULAR PEDIÁTRICA" }, { "codigo_especialidad": "8-0012", "especialidad": "PSICOLOGÍA AMBIENTAL" }, { "codigo_especialidad": "1-0013", "especialidad": "CIRUGÍA DE CABEZA Y CUELLO" }, { "codigo_especialidad": "8-0013", "especialidad": "PSICOLOGÍA POLÍTICA" }, { "codigo_especialidad": "1-0014", "especialidad": "TRAUMATOLOGÍA Y ORTOPEDIA - CIRUGÍA DE MANO" }, { "codigo_especialidad": "8-0014", "especialidad": "PSICOLOGÍA PENITENCIARIA" }, { "codigo_especialidad": "1-0015", "especialidad": "CIRUGÍA GENERAL" }, { "codigo_especialidad": "1-0016", "especialidad": "CIRUGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0017", "especialidad": "CIRUGÍA NEUMOLÓGICA" }, { "codigo_especialidad": "1-0018", "especialidad": "CIRUGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0019", "especialidad": "CIRUGÍA PLÁSTICA" }, { "codigo_especialidad": "1-0020", "especialidad": "CIRUGÍA DE TÓRAX Y CARDIOVASCULAR" }, { "codigo_especialidad": "1-0021", "especialidad": "DERMATOLOGÍA" }, { "codigo_especialidad": "1-0022", "especialidad": "EMBRIONOLOGÍA" }, { "codigo_especialidad": "1-0023", "especialidad": "ENDOCRINOLOGÍA" }, { "codigo_especialidad": "1-0024", "especialidad": "ENDOCRINOLOGÍA PEDIÁTRICA Y GENÉTICA" }, { "codigo_especialidad": "1-0025", "especialidad": "ENFERMEDADES INFECCIOSAS Y TROPICALES" }, { "codigo_especialidad": "1-0026", "especialidad": "EPIDEMIOLOGÍA" }, { "codigo_especialidad": "1-0027", "especialidad": "FARMACOLOGÍA" }, { "codigo_especialidad": "1-0028", "especialidad": "FISIOLOGÍA" }, { "codigo_especialidad": "1-0029", "especialidad": "GASTROENTEROLOGÍA" }, { "codigo_especialidad": "1-0030", "especialidad": "GASTROENTEROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0031", "especialidad": "GENÉTICA" }, { "codigo_especialidad": "1-0032", "especialidad": "GERIATRÍA" }, { "codigo_especialidad": "1-0033", "especialidad": "GINECOLOGÍA Y OBSTETRICIA - GINECOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0034", "especialidad": "GINECOLOGÍA Y OBSTETRICIA" }, { "codigo_especialidad": "1-0035", "especialidad": "HEMATOLOGÍA" }, { "codigo_especialidad": "1-0036", "especialidad": "HISTOLOGÍA" }, { "codigo_especialidad": "1-0037", "especialidad": "HISTOPATOLOGÍA" }, { "codigo_especialidad": "1-0038", "especialidad": "PEDIATRÍA - INFECTOLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0039", "especialidad": "INMUNOLOGÍA Y ALERGIA" }, { "codigo_especialidad": "1-0040", "especialidad": "INMUNOLOGÍA Y REUMATOLOGÍA" }, { "codigo_especialidad": "1-0041", "especialidad": "LABORATORIO CLÍNICO" }, { "codigo_especialidad": "1-0042", "especialidad": "LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "1-0043", "especialidad": "MEDICINA DE EMERGENCIA Y DESASTRES" }, { "codigo_especialidad": "1-0044", "especialidad": "MEDICINA DEL DEPORTE " }, { "codigo_especialidad": "1-0045", "especialidad": "MEDICINA DEL TRABAJO " }, { "codigo_especialidad": "1-0046", "especialidad": "MEDICINA FAMILIAR " }, { "codigo_especialidad": "1-0047", "especialidad": "MEDICINA DE REHABILITACIÓN" }, { "codigo_especialidad": "1-0048", "especialidad": "MEDICINA GENERAL INTEGRAL " }, { "codigo_especialidad": "1-0049", "especialidad": "MEDICINA GENERAL" }, { "codigo_especialidad": "1-0050", "especialidad": "MEDICINA INTEGRAL Y GESTIÓN EN SALUD" }, { "codigo_especialidad": "1-0051", "especialidad": "MEDICINA INTENSIVA" }, { "codigo_especialidad": "1-0052", "especialidad": "PEDIATRÍA - MEDICINA INTENSIVA PEDIÁTRICA" }, { "codigo_especialidad": "1-0053", "especialidad": "MEDICINA INTERNA " }, { "codigo_especialidad": "1-0054", "especialidad": "MEDICINA LEGAL " }, { "codigo_especialidad": "1-0055", "especialidad": "MEDICINA OCUPACIONAL Y MEDIO AMBIENTE" }, { "codigo_especialidad": "1-0056", "especialidad": "MEDICINA NUCLEAR" }, { "codigo_especialidad": "1-0057", "especialidad": "NEFROLOGÍA" }, { "codigo_especialidad": "1-0058", "especialidad": "PEDIATRÍA - NEFROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0059", "especialidad": "NEONATOLOGÍA" }, { "codigo_especialidad": "1-0060", "especialidad": "NEUMOLOGÍA" }, { "codigo_especialidad": "1-0061", "especialidad": "PEDIATRÍA - NEUMOLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0062", "especialidad": "NEUROCIRUGÍA" }, { "codigo_especialidad": "1-0063", "especialidad": "NEUROLOGÍA" }, { "codigo_especialidad": "1-0064", "especialidad": "PEDIATRÍA - NEUROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0065", "especialidad": "NUTRICIÓN" }, { "codigo_especialidad": "1-0066", "especialidad": "OFTALMOLOGÍA" }, { "codigo_especialidad": "1-0067", "especialidad": "OFTALMOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0068", "especialidad": "MEDICINA ONCOLÓGICA" }, { "codigo_especialidad": "1-0069", "especialidad": "ONCOLOGÍA QUIRÚRGICA " }, { "codigo_especialidad": "1-0070", "especialidad": "TRAUMATOLOGÍA Y ORTOPEDIA" }, { "codigo_especialidad": "1-0071", "especialidad": "OTORRINOLARINGOLOGÍA" }, { "codigo_especialidad": "1-0072", "especialidad": "PARASITOLOGÍA" }, { "codigo_especialidad": "1-0073", "especialidad": "PATOLOGÍA CLÍNICA " }, { "codigo_especialidad": "1-0074", "especialidad": "PATOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0075", "especialidad": "PATOLOGÍA Y LABORATORIO CLÍNICO" }, { "codigo_especialidad": "1-0076", "especialidad": "PEDIATRÍA" }, { "codigo_especialidad": "1-0077", "especialidad": "PROCTOLOGÍA" }, { "codigo_especialidad": "1-0078", "especialidad": "PSIQUIATRÍA" }, { "codigo_especialidad": "1-0079", "especialidad": "PSIQUIATRÍA INFANTIL" }, { "codigo_especialidad": "1-0080", "especialidad": "RADIODIAGNÓSTICO" }, { "codigo_especialidad": "1-0081", "especialidad": "RADIOLOGÍA" }, { "codigo_especialidad": "1-0082", "especialidad": "RADIOTERAPIA" }, { "codigo_especialidad": "1-0083", "especialidad": "REUMATOLOGÍA" }, { "codigo_especialidad": "1-0084", "especialidad": "SALUD PÚBLICA " }, { "codigo_especialidad": "1-0085", "especialidad": "UROLOGÍA" }, { "codigo_especialidad": "1-0086", "especialidad": "UROLOGÍA GENERAL Y ONCOLÓGICA" }, { "codigo_especialidad": "1-0087", "especialidad": "VENEREOLOGÍA" }, { "codigo_especialidad": "1-0089", "especialidad": "SISTEMAS HOSPITALARIOS" }, { "codigo_especialidad": "1-0091", "especialidad": "ODONTOLOGIA" }, { "codigo_especialidad": "99-092", "especialidad": "NO APLICA" }, { "codigo_especialidad": "99-093", "especialidad": "ACTUALIZAR" } ] }


            $(datos.data).each(function (i, obj) {
                $('#cboEspecialidadCR').append('<option value="' + obj.codigo_especialidad + '">' + obj.especialidad + '</option>');
                $('#cboEspecialidadRef').append('<option value="' + obj.codigo_especialidad + '">' + obj.especialidad + '</option>');
            });
            $('#cboEspecialidadCR').val(0);
            $('#cboEspecialidadRef').val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");
            Cargando(0);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    //async ListarEspecialidades() {
    //    $.ajax({
    //        url: "/Referencia/ListarEspecialidadesRefCon?area=Comun",            
    //        //data: midata,
    //        dataType: "json",
    //        type: "POST",
    //        processData: false,
    //        contentType: false,
    //        //async: false,
    //        success: function (datos) {
    //            console.log(datos.data);
    //            $('#cboEspecialidadCR').empty();
    //            $('#cboEspecialidadRef').empty();
    //            if (datos.data.estado = 'OK') {
    //                //console.log(datos.lsUps.table);
    //                $(datos.data.motivoReferencias).each(function (i, obj) {
    //                    $('#cboEspecialidadCR').append('<option  value="' + obj.codigo + '">' + obj.esp_descripcion + '</option>');
    //                    $('#cboEspecialidadRef').append('<option  value="' + obj.codigo + '">' + obj.esp_descripcion + '</option>');
    //                });
    //                $('#cboEspecialidadCR').val(0);
    //                $('#cboEspecialidadRef').val(0);
    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //            }
    //            else {
    //                //location.reload();
    //                alerta("ERROR", "Error al listar Especialidades!", "2");
    //            }
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error al listar Especialidades!", "2");
    //            }, 900)
    //        }
    //    });
    //},



    //async ListarUPServiciosOrigen(codigoups) {
    //    var midata = new FormData();
    //    midata.append('codigoups', codigoups);
    //    $.ajax({
    //        url: "/Referencia/ListarUPServiciosRefCon?area=Comun",
    //        data: midata,
    //        dataType: "json",
    //        type: "POST",
    //        processData: false,
    //        contentType: false,
    //        //async: false,
    //        success: function (datos) {
    //            console.log(datos.data);
    //            $('#cboServicioOrigen').empty();
    //            $('#cboServicioOrigenCR').empty();
    //            if (datos.data.codigo_respuesta = '0000') {
    //                //console.log(datos.lsUps.table);
    //                $(datos.data.codigos_servicios_ups).each(function (i, obj) {
    //                    $('#cboServicioOrigen').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
    //                    $('#cboServicioOrigenCR').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
    //                });
    //                $('#cboServicioOrigen').val(0);
    //                $('#cboServicioOrigenCR').val(0);
    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //            }
    //            else {
    //                //location.reload();
    //                alerta("ERROR", "Error al listar UPS!", "2");
    //            }
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error al listar UPS!", "2");
    //            }, 900)
    //        }
    //    });
    //},

    async ListarUPServiciosDestino(codigoups) {
        Cargando(1);

        var respuesta;
        let datos;

        var midata = new FormData();
        midata.append('codigoups', codigoups);
        $('#cboServicioDestino').empty();
        $('#cboServicioDestinoCR').empty();

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/ListarUPServiciosRefCon?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            console.log(datos.data);
            if (datos.data.codigo_respuesta = '0000') {
                //console.log(datos.lsUps.table);
                $(datos.data.codigos_servicios_ups).each(function (i, obj) {
                    $('#cboServicioDestino').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                    $('#cboServicioDestinoCR').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                });
                $('#cboServicioDestino').val(0);
                $('#cboServicioDestinoCR').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                //location.reload();
                alerta("ERROR", "Error al listar UPS!", "2");
            }
            Cargando(0);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    //async ListarUPServiciosDestino(codigoups) {
    //    var midata = new FormData();
    //    midata.append('codigoups', codigoups);
    //    $.ajax({
    //        url: "/Referencia/ListarUPServiciosRefCon?area=Comun",
    //        datatype: "json",
    //        type: "POST",
    //        data: midata,
    //        //crossDomain: true,
    //        processData: false,
    //        contentType: false,
    //        /*headers: {
    //            'Access-Control-Allow-Origin': '*',
    //            'Content-Type': 'application/json'
    //        },*/
    //        //async: false,
    //        success: function (datos) {
    //            console.log(datos.data);
    //            $('#cboServicioDestino').empty();
    //            $('#cboServicioDestinoCR').empty();
    //            if (datos.data.codigo_respuesta = '0000') {
    //                //console.log(datos.lsUps.table);
    //                $(datos.data.codigos_servicios_ups).each(function (i, obj) {
    //                    $('#cboServicioDestino').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
    //                    $('#cboServicioDestinoCR').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
    //                });
    //                $('#cboServicioDestino').val(0);
    //                $('#cboServicioDestinoCR').val(0);
    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //            }
    //            else {
    //                //location.reload();
    //                alerta("ERROR", "Error al listar UPS!", "2");
    //            }
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error al listar UPS!", "2");
    //            }, 900)
    //        }
    //    });
    //},

    async ListarCondicionUsuario() {
        $.ajax({
            url: "/Utilitario/CondicionUsuarioReferenciaSeleccionarTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {

                $('#cboCondicionUsuario').empty();
                if (datos.session) {
                    //console.log(datos.lsCondUsu.table);
                    $(datos.lsCondUsu.table).each(function (i, obj) {
                        $('#cboCondicionUsuario').append('<option  value="' + obj.idCondicion + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboCondicionUsuario').val(0);

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar UPS!", "2");
                }, 900)
            }
        });
    },

    ServiciosPorFiltro() {

        var midata = new FormData();
        midata.append('lcfiltro', ' AND Servicios.IdTipoServicio = 1');
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Referencia/ServiciosFiltrar?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0);
                $('#cboServicioOrigen').empty();
                $('#cboServicioDestino').empty();
                $(datos.lsFiltro.table).each(function (i, obj) {
                    $('#cboServicioOrigen').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                    $('#cboServicioDestino').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },


    ListaServicios() {
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencionRefCon').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0);
                $('#cboConsultorioRefCon').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConsultorioRefCon').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" value="' + obj.valor + '">' + obj.nombreServicio + '</option>');


                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },



    ListarAtenciones() {

        Cargando(1)
        oTable_atenciones.fnClearTable();
        //alert($('#cboConsultorioRefCon>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencionRefCon').val());
        midata.append('idServicio', $('#cboConsultorioRefCon').val());
        midata.append('idTipoServicio', 1);
        midata.append('idTipoRef', $('#cboTipoRef').val());
        midata.append('prog', $('#cboConsultorioRefCon>option:selected').attr("prog"));
        $.ajax({
            method: "POST",
            url: "/Referencia/ListarAtencionesReferencia?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lstAtenciones.table.length > 0) {
                        oTable_atenciones.fnAddData(datos.lstAtenciones.table);
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }


            },
            error: function (msg) {
                Cargando(0)
            }
        })


    },

    MigrarRefCon(idCuentaAtencion) {

        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/MigrarRefCon?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.estado) {
                    alerta(res.tipo, res.msj)

                    $('#txtCodRespuestaRefCon').val(res.data.respuesta.codRespuesta)
                    $('#txtMensajeRespuestaRefCon').val(res.data.respuesta.mensajeRespuesta)

                    $('#txtIdReferenciaRespuestaRefCon').val(res.data.idReferencia)
                    $('#txtNroReferenciaRespuestaRefCon').val(res.data.nro_referencia)

                } else {
                    alerta(res.tipo, res.msj)
                    console.log(res)
                }


                Cargando(0)
            }
        });
    },

    MigrarContraRef(idCuentaAtencion) {

        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/MigrarContraRef?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {
                console.log('res', res)
                if (res.estado) {
                    alerta(res.tipo, res.msj)

                    $('#txtCodRespuestaRefCon').val(res.data.respuesta.codRespuesta)
                    $('#txtMensajeRespuestaRefCon').val(res.data.respuesta.codRespuesta + ' ' + res.data.respuesta.mensajeRespuesta)

                    $('#txtIdReferenciaRespuestaRefCon').val(res.data.idReferencia)
                    $('#txtNroReferenciaRespuestaRefCon').val(res.data.nro_referencia)

                } else {
                    alerta(res.tipo, res.msj)
                    console.log(res)
                }


                Cargando(0)
            }
        });
    },

    EstadoReferencia(idReferencia) {

        var midata = new FormData();
        midata.append('idReferencia', idReferencia);
        Cargando(1)
        return $.ajax({
            method: "POST",
            url: "/Referencia/EstadoReferencia?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.estado) {
                    return res

                } else {
                    return res
                }


                Cargando(0)
            }
        });
    },

    initDatables() {


        var parms = {
            "paging": false,
            "ordering": true,
            "info": true,
            "searching": true,
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
                    data: "fechaIngreso2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '5%',
                    targets: 6,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaEgreso)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }

                },
                {
                    width: '10%',
                    targets: 8,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaEgreso)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }

                },
                {
                    width: '5%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            //$(td).parent().css('color', '#347dff');
                            //$(td).parent().css('font-weight', 'bold');

                            if (rowData.tipoRef == 1) {
                                $(td).html("Referido");
                            } else {
                                if (rowData.tipoRef == 2) {
                                    $(td).html("Contrareferido");
                                }
                            }
                        }

                    }

                },
                {
                    width: '10%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            //var rutaBit4Id = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.codeInformeAtencion != '0') {
                                if (rowData.statusFirmaInformeAtencion == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                        //$(td).css('text-align', 'center')
                        //if (!isEmpty(rowData.fechaEgreso)) {
                        //    var btnRuta = "";
                        //    var btnImprime = "";
                        //    var btnImprimeSinF = "";

                        //    btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                        //    $(td).html(btnImprimeSinF);
                        //}
                        //else {
                        //    $(td).html('');
                        //}
                    }
                },
                {
                    width: '15%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idReferencia > 0 || rowData.idContraReferencia > 0) {
                                btnImprimeSinF = '<button class="ImprimeHojaRefConSF btn btn-sm btn-warning glow_button" title="Visualiza REFCON" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                if (rowData.codeRefCon != '0' || rowData.codeRefCon != '0') {
                                    if (rowData.statusFirmaRefCon == 1 || rowData.statusFirmaRefCon == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeHojaRefConCF" title="Imprime REFCON Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                        //$(td).css('text-align', 'center')                        
                        //if ((rowData.idReferencia > 0 || rowData.idContraReferencia > 0) ) {
                        //    var btnRuta = "";
                        //    var btnImprime = "";
                        //    var btnImprimeSinF = "";

                        //    btnImprimeSinF = '<button class="ImprimeHojaRefConSinF btn btn-sm btn-warning glow_button" title="Visualiza Ref/Con" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                        //    $(td).html(btnImprimeSinF);
                        //}
                        //else {
                        //    $(td).html('');
                        //}
                    },

                },
                {
                    width: '15%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        if (rowData.idReferenciaMigracion != '') {
                            let referencia = await Referencias.EstadoReferencia(rowData.idReferenciaMigracion)

                            console.log('referencia ' + rowData.idCuentaAtencion, referencia)

                            if (referencia.estado) {
                                if (referencia.data.referencia.estado == 'REGISTRADA') {
                                    $(td).parent().css('color', '#000000');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'OBSERVADA') {
                                    $(td).parent().css('color', '#ff8033');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'PENDIENTE') {
                                    $(td).parent().css('color', '#990033');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'ACEPTADA') {
                                    $(td).parent().css('color', '#3a0');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'PACIENTE CITADO') {
                                    $(td).parent().css('color', '#992b99');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'RECHAZADA') {
                                    $(td).parent().css('color', '#a3a3a3');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'RECIBIDO') {
                                    $(td).parent().css('color', '#0080ff');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'CONTRAREFERIDO') {
                                    $(td).parent().css('color', '#ffaa00');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'ANULADA') {
                                    $(td).parent().css('color', '#ff2b33');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                            }


                        }


                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnReferencia = "";

                            if ($('#cboTipoRef').val() == 1) {
                                btnReferencia = '<button class="ModalMigracionRefcon btn btn-sm btn-indigo glow_button" title="Migrar a RefCon" data-toggle="tooltip" style="margin: 2px;"><i class="fa-regular fa-cloud-arrow-up"></i></button>';
                            } else if ($('#cboTipoRef').val() == 2) {
                                btnReferencia = '<button class="ModalMigracionContraref btn btn-sm btn-indigo glow_button" title="Migrar a RefCon" data-toggle="tooltip" style="margin: 2px;"><i class="fa-regular fa-cloud-arrow-up"></i></button>';
                            }

                            $(td).html(btnReferencia);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblAtencionRefCon'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencionRefCon").dataTable(parms);


    },

    initDatablesRefconMinsa() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": true,
            "searching": true,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "id_referencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "fecha_referencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "fecha_aceptacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "establecimiento_origen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "servicio_detino",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 3,
                    data: "nombres_paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "tipo_documento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "numero_documento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaEgreso)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }

                },
                {
                    width: '5%',
                    targets: 8,
                    data: "sexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //if (!isEmpty(rowData.fechaEgreso)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }

                },

                {
                    width: '5%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')



                        btnReferencia = '<button class="btnCitarPaciente btn btn-sm btn-indigo glow_button" title="Migrar a RefCon" data-toggle="tooltip" style="margin: 2px;"><i class="fa-regular fa-cloud-arrow-up"></i></button>';

                        $(td).html(btnReferencia);
                    }
                }

            ]

        }

        var tableWrapper = $('#tblAtencionRefConMinsa'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesRefconMinsa = $("#tblAtencionRefConMinsa").dataTable(parms);


    },

    InitDataTableProgramacionMedica() {

        var parms = {
            paging: false,
            ordering: false,
            columns: [
                {
                    width: '10px',
                    data: "idProgramacion",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                },
                {
                    width: '80px',
                    data: "servicio",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                },
                {
                    width: '10px',
                    data: "codigoTurno",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                },
                {
                    width: '50px',
                    data: "medico",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                },
                {
                    width: '5px',
                    data: "cupos",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                },
                {
                    width: '5px',
                    data: "cuposDisponibles",
                    createdCell: function (td) {
                        $(td).css('text-align', 'left');
                    }
                }
            ]
        };

        oTable_ProgramacionMedica = $("#tblProgramacionMedica").dataTable(parms);


    }
}

var imprimiInformeAtencionSF = function (idCuentaAtencion, idProCabecera, tipoFormato) {
    var url = "/Atencion/AtencionPdfSinFirma?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idProCabecera=" + idProCabecera + "&tipoFormato=" + tipoFormato;

    $('#ifrmReporteRefCon').attr('src', url);

}

var ImprimirRefCon = function (rutaArchivoRefCon) {
    $('#ifrmReporteRefCon').attr('src', rutaArchivoRefCon);
    var myIframe = document.getElementById("ifrmReporteRefCon").contentWindow;
    myIframe.focus();
    myIframe.print();
    //console.log(myIframe);
}
var ImprimirRefConFirmado = function (idCuentaAtencion, idRegistro, code, idDoc, tipo) {
    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Referencia/statusAndDownload?area=Comun&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {
        if (this.response.size > 0) {
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = tipo + idCuentaAtencion + "-" + $.now()
            //a.click();

            AbrirVisorDocumento(url, 1);
            //ATENCIONES.ListaAtencionesCE();
            $("#btnBuscarAtenciones").click();
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);
    }
    request.send();
}

$(document).ready(function () {
    Referencias.CargaInicial();
    Referencias.plugins();
    Referencias.initDatables();
    Referencias.initDatablesRefconMinsa();

    Referencias.InitDataTableProgramacionMedica();

    Referencias.Eventos();

    Referencias.ListarEspecialidades();
    Referencias.ListarUPServiciosOrigen(codigoIpress);
    Referencias.BuscarEstablecimiento()
    Referencias.ListarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos()
    Referencias.ListarTipoServicio()
    Referencias.ListarSisServiciosSeleccionarPorFiltro()
    Referencias.SeleccionarProcedimientosImagenologiaRefcon()

    // Referencias.ListarCondicionUsuario();



});

function convertirFechaConRango() {
    // Obtener la fecha del campo en formato dd/mm/yyyy
    let fechaOriginal = $('#txtFechaAtencionRefCon').val(); // Ejemplo: '20/01/2025'

    // Dividir la fecha en día, mes y año
    let partesFecha = fechaOriginal.split('/'); // ['20', '01', '2025']
    let dia = parseInt(partesFecha[0], 10);
    let mes = parseInt(partesFecha[1], 10) - 1; // Restar 1 porque los meses en JavaScript empiezan en 0
    let anio = parseInt(partesFecha[2], 10);

    // Crear el objeto de fecha
    let fecha = new Date(anio, mes, dia);

    // Obtener la fecha inicio (un mes antes)
    let fechaInicio = new Date(fecha);
    fechaInicio.setDate(fechaInicio.getDate() - 45);

    // Formatear las fechas en el formato deseado (yyyymmdd)
    let fechaFormateadaInicio = formatearFecha(fechaInicio);
    let fechaFormateadaFin = formatearFecha(fecha);

    // Retornar el rango de fechas
    console.log("Fecha Inicio:", fechaFormateadaInicio);
    console.log("Fecha Fin:", fechaFormateadaFin);

    return {
        fechaInicio: fechaFormateadaInicio,
        fechaFin: fechaFormateadaFin
    };
}

// Función para formatear una fecha en formato yyyymmdd
function formatearFecha(fecha) {
    let anio = fecha.getFullYear();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Asegurar 2 dígitos
    let dia = fecha.getDate().toString().padStart(2, '0'); // Asegurar 2 dígitos
    return `${anio}${mes}${dia}`;
}