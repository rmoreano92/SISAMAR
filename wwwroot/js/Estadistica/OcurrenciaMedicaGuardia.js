var Guardia = {
    IdOcurrenciaMedica: 0,
    medicos: [],
    estadoCargaData: false,

    async Iniciar() {
        Guardia.InitPlugin();
        Guardia.InitDataTableBusqueda();
        Guardia.InitDataTableMedicos();
        Guardia.Eventos();
        await Guardia.CargarComboTurnos();
        await Guardia.CargarCombosEstadosOcurrencias();
        //await Guardia.CargarCombosMedicos();

        await PermisoGeneral.ValidarServicioFirmaDigital();
    },

    InitPlugin() {
        $('#txtFiltroFecha, #txtFechaOcurrencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });       

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $('#txtFiltroFecha').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraNacimientoRn").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
    },

    InitDataTableBusqueda() {
        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "nroFolio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "fechaOcurrencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "turno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "jefeGuardia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    width: '7%',
                    targets: 4,
                    data: "dEstadoOcurrencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (rowData.estado == 1) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } /*else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }*/

                                if (rowData.statusFirmaEmpleado == 0) {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }                    
                    }
                }

            ]

        }

        var tableWrapper = $('#tblOcurrenciasMedicas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        ObjtableOcurrenciasMedicas = $("#tblOcurrenciasMedicas").dataTable(parms);
    },

    InitDataTableMedicos() {
        var parms = {
            scrollY: "200px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
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
                    data: "cargoMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "nombreMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },

            ]

        }

        var tableWrapper = $('#tblMedicos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        ObjtableMedicosGinecologos = $("#tblMedicosGinecologos").dataTable(parms);
        ObjtableMedicosNeonatologos = $("#tblMedicosNeonatologos").dataTable(parms);
        ObjtableMedicosAnestesiologos = $("#tblMedicosAnestesiologos").dataTable(parms);
        ObjtableMedicosIntensivistas = $("#tblMedicosIntensivistas").dataTable(parms);
        ObjtableMedicosResidentes = $("#tblMedicosResidentes").dataTable(parms);
    },

    Eventos() {
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnFiltroBuscar").click();
            }
        });

        $('#tblOcurrenciasMedicas tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableOcurrenciasMedicas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblMedicos tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableMedicos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnFiltroBuscar').on('click', function () {
            Guardia.ListarOcurrenciaMedica();
        });

        $('#btnFiltroLimpiar').on('click', function () {
            Guardia.LimpiarFiltros();
        });

        ///////////////////////////////////////////////////////////////
        $('#btnAgregar').on('click', function () {
            Guardia.EjecutarAccion("A");
            Guardia.AgregarOcurrenciaMedica();
        });

        $('#btnModificar').on('click', function () {
            Guardia.EjecutarAccion("M");
            Guardia.CargarOcurrenciaMedica();
        });

        $('#btnEliminar').on('click', function () {
            Guardia.EjecutarAccion("E");
            Guardia.EliminarOcurrenciaMedica();
        });

        $('#btnConsultar').on('click', function () {
            Guardia.EjecutarAccion("C");
            Guardia.CargarOcurrenciaMedica();
        });
        ///////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////
        $('#btnCancelarOcurrencia').on('click', function () {
            Guardia.CancelarOcurrencia();
        });

        $('#btnGuardarOcurrencia').on('click', async function () {
            if (Guardia.ValidarDatosObligatorios()) {
                await Guardia.GuardarOcurrenciaMedica();
            }            
        });
        ///////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////
        $('#txtFechaOcurrencia').on('change', async function () {
            if (Guardia.estadoCargaData) {
                //await Guardia.CargarCombosMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
                await Guardia.CargarTiposMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
                await Guardia.CantidadAtenciones($("#txtFechaOcurrencia").val(), $("#cboTurno").val());                
            }            
        });        

        $('#cboTurno').on('change', async function () {
            if (Guardia.estadoCargaData) {
                //await Guardia.CargarCombosMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
                await Guardia.CargarTiposMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
                await Guardia.CantidadAtenciones($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
            }
        }); 
        
        ///////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////
        $('#cboJefeGuardia').on('change', function () {
            if ($('#cboJefeGuardia').val() == $('#cboJefeGuardiaEntrante').val()) {
                alerta2("info", "", "El jefe de guardia saliente no puede ser igual al jefe de guardia entrante.");
                $('#cboJefeGuardia').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
        });

        $('#cboJefeGuardiaEntrante').on('change', function () {
            if ($('#cboJefeGuardiaEntrante').val() == $('#cboJefeGuardia').val()) {
                alerta2("info", "", "El jefe de guardia entrante no puede ser igual al jefe de guardia saliente.");
                $('#cboJefeGuardiaEntrante').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
        });

        $('#cboTiposMedico').on('change', async function () {
            await Guardia.CargarCombosMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val(), $("#cboTiposMedico").val());
        });

        $('#btnAgregarMedico').on('click', function () {
            Guardia.AgregarMedico();
        });

        $('#btnEliminarMedico').on('click', function () {
            Guardia.QuitarMedico();
        });

        $('#tblMedicosGinecologos tbody').on('click', 'tr', function () {
            $('#tblMedicosGinecologos  tbody tr').removeClass("selected");
            $('#tblMedicosNeonatologos  tbody tr').removeClass("selected");
            $('#tblMedicosAnestesiologos  tbody tr').removeClass("selected");
            $('#tblMedicosIntensivistas  tbody tr').removeClass("selected");
            $('#tblMedicosResidentes  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblMedicosNeonatologos tbody').on('click', 'tr', function () {
            $('#tblMedicosGinecologos  tbody tr').removeClass("selected");
            $('#tblMedicosNeonatologos  tbody tr').removeClass("selected");
            $('#tblMedicosAnestesiologos  tbody tr').removeClass("selected");
            $('#tblMedicosIntensivistas  tbody tr').removeClass("selected");
            $('#tblMedicosResidentes  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblMedicosAnestesiologos tbody').on('click', 'tr', function () {
            $('#tblMedicosGinecologos  tbody tr').removeClass("selected");
            $('#tblMedicosNeonatologos  tbody tr').removeClass("selected");
            $('#tblMedicosAnestesiologos  tbody tr').removeClass("selected");
            $('#tblMedicosIntensivistas  tbody tr').removeClass("selected");
            $('#tblMedicosResidentes  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblMedicosIntensivistas tbody').on('click', 'tr', function () {
            $('#tblMedicosGinecologos  tbody tr').removeClass("selected");
            $('#tblMedicosNeonatologos  tbody tr').removeClass("selected");
            $('#tblMedicosAnestesiologos  tbody tr').removeClass("selected");
            $('#tblMedicosIntensivistas  tbody tr').removeClass("selected");
            $('#tblMedicosResidentes  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblMedicosResidentes tbody').on('click', 'tr', function () {
            $('#tblMedicosGinecologos  tbody tr').removeClass("selected");
            $('#tblMedicosNeonatologos  tbody tr').removeClass("selected");
            $('#tblMedicosAnestesiologos  tbody tr').removeClass("selected");
            $('#tblMedicosIntensivistas  tbody tr').removeClass("selected");
            $('#tblMedicosResidentes  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        ///////////////////////////////////////////////////////////////

        ///////////////////////INFORME/////////////////////////////////////////////
        $('#tblOcurrenciasMedicas tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = ObjtableOcurrenciasMedicas.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableOcurrenciasMedicas.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                //alerta('2', 'El documento no esta generado, se procedera a generar el documento.')                
                //const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idAtencion, row.idProCabecera, tipoFormato, tipoHoja);
            } else {                   
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);          
        });

        $('#tblOcurrenciasMedicas tbody').on('click', '.ImprimeInformeCF', async function () {
            var objrow = ObjtableOcurrenciasMedicas.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableOcurrenciasMedicas.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblOcurrenciasMedicas tbody').on('click', '.FirmarInformeSF', async function () {
            var objrow = ObjtableOcurrenciasMedicas.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableOcurrenciasMedicas.fnGetData(objrow);

            Utilitario.TipoArchivoFirmar = 'GUARDIA';
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            if (firma) {
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                //await Utilitario.IniciarServicioFirmaBit4Id(row.code);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////
        
    },

    async AgregarOcurrenciaMedica() {
        Guardia.LimpiarForm();    
        //await Guardia.CargarCombosMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
        await Guardia.CargarCombosJefesGuardia($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
        await Guardia.CargarTiposMedicos($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
        await Guardia.CantidadAtenciones($("#txtFechaOcurrencia").val(), $("#cboTurno").val());
        Guardia.estadoCargaData = true;
        MostrarAreaRegistro();
    },

    async CargarOcurrenciaMedica() {
        var objrowTb = ObjtableOcurrenciasMedicas.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta2('info', '', 'Seleccione un registro por favor.');
        } else {
            data = await Guardia.SeleccionarOcurrenciaMedica(objrowTb.idOcurrenciaMedica);
            Guardia.medicos = await Guardia.SeleccionarMedicoGuardiaOcurrencia(objrowTb.idOcurrenciaMedica);
            //await Guardia.CargarCombosMedicos(data.fechaOcurrencia, data.idTurno);
            await Guardia.CargarCombosJefesGuardia(data.fechaOcurrencia, data.idTurno);
            await Guardia.CargarTiposMedicos(data.fechaOcurrencia, data.idTurno);
            Guardia.CargarDatosAlFormulario(data);
        }
    },

    EliminarOcurrenciaMedica() {

    },

    CargarDatosAlFormulario(data) {
        if (!isEmpty(data)) {
            Guardia.IdOcurrenciaMedica = data.idOcurrenciaMedica;

            $("#txtFechaOcurrencia").datepicker("setDate", data.fechaOcurrencia);
            $('#cboJefeGuardia').val(data.nroDocJefeGuardia);
            $('#cboJefeGuardiaEntrante').val(data.nroDocJefeGuardiaEntrante);
            $('#cboTurno').val(data.idTurno);
            $('#txtFolio').val(data.nroFolio);
            $('#txtMuertesMaternas').val(data.muertesMaternas);
            $('#txtMuertesMaternasComentarios').val(data.dMuertesMaternas);
            $('#txtEventosAdversos').val(data.eventosAdversos);
            $('#txtEventosAdversosComentarios').val(data.dEventosAdversos);
            $('#txtPacienteCriticos').val(data.pacientesCriticos);
            $('#txtPacienteCriticosComentarios').val(data.dPacientesCriticos);
            $('#txtReintervencionesQx').val(data.reintervencionesQx);
            $('#txtReintervencionesQxComentarios').val(data.dReintervencionesQx);
            $('#txtCasosMedicoLegal').val(data.casosMedicoLegal);
            $('#txtCasosMedicoLegalComentarios').val(data.dCasosMedicoLegal);

            $('#txtEmerAtObstetricas').val(data.atEmerObstetricas);
            $('#txtEmerAtGinecologicas').val(data.atEmerGinecologicas);
            $('#txtEmerAtPediatricas').val(data.atEmerPediatricas);
            $('#txtEmerAtObservacion').val(data.atEmerObservacion);
            $('#txtEmerAtTraumaShock').val(data.atEmerTraumaShock);
            $('#txtEmerEcografias').val(data.atEmerEcografias);
            $('#txtEmerCesareas').val(data.atEmerCesareas);
            $('#txtEmerLaparatomias').val(data.atEmerLaparatomias);
            $('#txtEmerLaparascopias').val(data.atEmerLaparascopias);
            $('#txtEmerLegrados').val(data.atEmerLegrados);
            $('#txtEmerPartos').val(data.atEmerPartos);
            $('#txtEmerTocolisis').val(data.atEmerTocolisis);
            $('#txtPacientesEmerComentarios').val(data.dPacientesEmer);

            $('#txtCOCesareas').val(data.atCoCesareas);
            $('#txtCOLaparatomias').val(data.atCoLapratomias);
            $('#txtCOLaparascopias').val(data.atCoLaparascopias);
            $('#txtCOLegrados').val(data.atCoLegrados);
            $('#txtCOPartos').val(data.atCoPartos);
            $('#txtCOTocolisis').val(data.atCoTocolisis);
            $('#txtPacientesCOComentarios').val(data.dPacientesCO);

            $('#txtPerCesareas').val(data.atPerCesareas);
            $('#txtPerLaparatomias').val(data.atPerLaparatomias);
            $('#txtPerLaparascopias').val(data.atPerLaparascopias);
            $('#txtPerLegrados').val(data.atPerLegrados);
            $('#txtPerPartos').val(data.atPerPartos);
            $('#txtPerTocolisis').val(data.atPerTocolisis);
            $('#txtPacientesPerComentarios').val(data.dPacientesPer);

            $('#txtEmerCesareasPend').val(data.atEmerCesareasPend);
            $('#txtEmerAmeuPend').val(data.atEmerAmeuPend);
            $('#txtEmerEcografiasPend').val(data.atEmerEcografiasPend);
            $('#txtEmerLaparascopiasPend').val(data.atEmerLaparascopiasPend);
            $('#txtEmerLaparatomiasPend').val(data.atEmerLaparatomiasPend);
            $('#txtEmerReferidosPorLlegarPend').val(data.atEmerReferidosPorLlegarPend);
            $('#txtCOCesareasPend').val(data.atCoCesareasPend);
            $('#txtCOAmeuPend').val(data.atCoAmeuPend);
            $('#txtCOEcografiasPend').val(data.atCoEcografiasPend);
            $('#txtCOLaparascopiasPend').val(data.atCoLaparascopiasPend);
            $('#txtCOLaparatomiasPend').val(data.atCoLaparatomiasPend);
            $('#txtCOReferidosPorLlegarPend').val(data.atCoReferidosPorLlegarPend);
            $('#txtPerCesareasPend').val(data.atPerCesareasPend);
            $('#txtPerAmeuPend').val(data.atPerAmeuPend);
            $('#txtPerEcografiasPend').val(data.atPerEcografiasPend);
            $('#txtPerLaparascopiasPend').val(data.atPerLaparascopiasPend);
            $('#txtPerLaparatomiasPend').val(data.atPerLaparatomiasPend);
            $('#txtPerReferidosPorLlegarPend').val(data.atPerReferidosPorLlegarPend);

            $('#txtPacientesUCI').val(data.pacientesUCI);
            $('#txtPacientesUCIComentarios').val(data.dPacientesUCI);

            $('#txtOcurrencias').val(data.ocurrencias);         

            $('.chzn-select').chosen().trigger("chosen:updated");

            Guardia.estadoCargaData = true;

            MostrarAreaRegistro();
        }        
    },

    ValidarDatosObligatorios() {
        if (isEmpty($('#txtFechaOcurrencia').val())) {
            alerta2('warning', '', 'Debe de ingresar la Fecha de Ocurrencia.');
            return false;
        }
        if (isEmpty($('#cboTurno').val())) {
            alerta2('warning', '', 'Debe de seleccionar el Turno.');
            return false;
        }
        if (isEmpty($('#cboJefeGuardia').val())) {
            alerta2('warning', '', 'Debe de seleccionar el Jefe de Guardia Saliente.');
            return false;
        }
        if (isEmpty($('#cboJefeGuardiaEntrante').val())) {
            alerta2('warning', '', 'Debe de seleccionar el Jefe de Guardia Entrante.');
            return false;
        }
        if (Guardia.DevolverMedicos().length == 0) {
            alerta2('warning', '', 'Debe de agregar los Médicos de Guardia.');
            return false;
        }

        return true;
    },

    CargarDatosAlControlador() {
        var formData = new FormData();

        formData.append('IdOcurrenciaMedica', Guardia.IdOcurrenciaMedica);
        
        formData.append('NroDocJefeGuardia', $('#cboJefeGuardia').val());
        formData.append('NroDocJefeGuardiaEntrante', $('#cboJefeGuardiaEntrante').val());
        formData.append('IdTurno', $('#cboTurno').val());
        formData.append('MuertesMaternas', $('#txtMuertesMaternas').val());
        formData.append('DMuertesMaternas', $('#txtMuertesMaternasComentarios').val());
        formData.append('EventosAdversos', $('#txtEventosAdversos').val());
        formData.append('DEventosAdversos', $('#txtEventosAdversosComentarios').val());
        formData.append('PacientesCriticos', $('#txtPacienteCriticos').val());
        formData.append('DPacientesCriticos', $('#txtPacienteCriticosComentarios').val());
        formData.append('ReintervencionesQx', $('#txtReintervencionesQx').val());
        formData.append('DReintervencionesQx', $('#txtReintervencionesQxComentarios').val());
        formData.append('CasosMedicoLegal', $('#txtCasosMedicoLegal').val());
        formData.append('DCasosMedicoLegal', $('#txtCasosMedicoLegalComentarios').val());

        formData.append('AtEmerObstetricas', $('#txtEmerAtObstetricas').val());
        formData.append('AtEmerGinecologicas', $('#txtEmerAtGinecologicas').val());
        formData.append('AtEmerPediatricas', $('#txtEmerAtPediatricas').val());
        formData.append('AtEmerObservacion', $('#txtEmerAtObservacion').val());
        formData.append('AtEmerTraumaShock', $('#txtEmerAtTraumaShock').val());
        formData.append('AtEmerEcografias', $('#txtEmerEcografias').val());
        formData.append('AtEmerCesareas', $('#txtEmerCesareas').val());
        formData.append('AtEmerLaparatomias', $('#txtEmerLaparatomias').val());
        formData.append('AtEmerLaparascopias', $('#txtEmerLaparascopias').val());
        formData.append('AtEmerLegrados', $('#txtEmerLegrados').val());
        formData.append('AtEmerPartos', $('#txtEmerPartos').val());
        formData.append('AtEmerTocolisis', $('#txtEmerTocolisis').val());

        formData.append('AtCoCesareas', $('#txtCOCesareas').val());
        formData.append('AtCoLapratomias', $('#txtCOLaparatomias').val());
        formData.append('AtCoLaparascopias', $('#txtCOLaparascopias').val());
        formData.append('AtCoLegrados', $('#txtCOLegrados').val());
        formData.append('AtCoPartos', $('#txtCOPartos').val());
        formData.append('AtCoTocolisis', $('#txtCOTocolisis').val());

        formData.append('AtPerCesareas', $('#txtPerCesareas').val());
        formData.append('AtPerLaparatomias', $('#txtPerLaparatomias').val());
        formData.append('AtPerLaparascopias', $('#txtPerLaparascopias').val());
        formData.append('AtPerLegrados', $('#txtPerLegrados').val());
        formData.append('AtPerPartos', $('#txtPerPartos').val());
        formData.append('AtPerTocolisis', $('#txtPerTocolisis').val());
                
        formData.append('AtEmerCesareasPend', $('#txtEmerCesareasPend').val());
        formData.append('AtEmerAmeuPend', $('#txtEmerAmeuPend').val());
        formData.append('AtEmerEcografiasPend', $('#txtEmerEcografiasPend').val());
        formData.append('AtEmerLaparascopiasPend', $('#txtEmerLaparascopiasPend').val());
        formData.append('AtEmerLaparatomiasPend', $('#txtEmerLaparatomiasPend').val());
        formData.append('AtEmerReferidosPorLlegarPend', $('#txtEmerReferidosPorLlegarPend').val());
        formData.append('DPacientesEmer', $('#txtPacientesEmerComentarios').val());

        formData.append('AtCoCesareasPend', $('#txtCOCesareasPend').val());
        formData.append('AtCoAmeuPend', $('#txtCOAmeuPend').val());
        formData.append('AtCoEcografiasPend', $('#txtCOEcografiasPend').val());
        formData.append('AtCoLaparascopiasPend', $('#txtCOLaparascopiasPend').val());
        formData.append('AtCoLaparatomiasPend', $('#txtCOLaparatomiasPend').val());
        formData.append('AtCoReferidosPorLlegarPend', $('#txtCOReferidosPorLlegarPend').val());
        formData.append('DPacientesCO', $('#txtPacientesCOComentarios').val());

        formData.append('AtPerCesareasPend', $('#txtPerCesareasPend').val());
        formData.append('AtPerAmeuPend', $('#txtPerAmeuPend').val());
        formData.append('AtPerEcografiasPend', $('#txtPerEcografiasPend').val());
        formData.append('AtPerLaparascopiasPend', $('#txtPerLaparascopiasPend').val());
        formData.append('AtPerLaparatomiasPend', $('#txtPerLaparatomiasPend').val());
        formData.append('AtPerReferidosPorLlegarPend', $('#txtPerReferidosPorLlegarPend').val());
        formData.append('DPacientesPer', $('#txtPacientesPerComentarios').val());

        formData.append('PacientesUCI', $('#txtPacientesUCI').val());
        formData.append('DPacientesUCI', $('#txtPacientesUCIComentarios').val());

        formData.append('Ocurrencias', $('#txtOcurrencias').val());
        formData.append('FechaOcurrencia', $('#txtFechaOcurrencia').val());

        var lstMedicos = Guardia.DevolverMedicos();
        formData.append('lstMedicos', JSON.stringify(lstMedicos));

        return formData;
        
    },

    CancelarOcurrencia() {
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
            Guardia.CerrarForm();
            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
        }).catch(swal.noop);
    },

    AgregarMedico() {        
        if (!isEmpty($("#cboMedicos").val())) {
            let medico = {
                nroDocMedico: $("#cboMedicos").val(),
                idCargoMedico: $("#cboMedicos option:selected").attr("data-idCargo"),
                cargoMedico: $("#cboMedicos option:selected").attr("data-cargo"),
                nombreMedico: $("#cboMedicos option:selected").text()
            }

            let idCargo = $("#cboMedicos option:selected").attr("data-idCargo");
            if (idCargo == 1) {
                $('#Medicos-TabList a[href="#ginecologos-tab"]').tab('show');
                ObjtableMedicosGinecologos.fnAddData(medico);
            }
            if (idCargo == 2) {
                $('#Medicos-TabList a[href="#neonatologos-tab"]').tab('show');
                ObjtableMedicosNeonatologos.fnAddData(medico);
            }
            if (idCargo == 3) {
                $('#Medicos-TabList a[href="#anestesiologos-tab"]').tab('show');
                ObjtableMedicosAnestesiologos.fnAddData(medico);
            }
            if (idCargo == 4) {
                $('#Medicos-TabList a[href="#intensivistas-tab"]').tab('show');
                ObjtableMedicosIntensivistas.fnAddData(medico);
            }
            if (idCargo == 5) {
                $('#Medicos-TabList a[href="#residentes-tab"]').tab('show');
                ObjtableMedicosResidentes.fnAddData(medico);
            }

            Guardia.medicos.push(medico);

            $("#cboMedicos option[value='" + $("#cboMedicos").val() + "']").prop("disabled", true);
            $("#cboMedicos").val('');
            $(".chzn-select").trigger("chosen:updated");
        } else {
            alerta2("info", "", "Debe seleccionar un médico para agregar.");
        }
        
    },

    QuitarMedico() {
        var objrowMedicoGineco = ObjtableMedicosGinecologos.api(true).row('.selected').data();
        var objrowMedicoNeo = ObjtableMedicosNeonatologos.api(true).row('.selected').data();
        var objrowMedicoAnestesio = ObjtableMedicosAnestesiologos.api(true).row('.selected').data();
        var objrowMedicoIntensivo = ObjtableMedicosIntensivistas.api(true).row('.selected').data();
        var objrowMedicoResidente = ObjtableMedicosResidentes.api(true).row('.selected').data();

        if (!isEmpty(objrowMedicoGineco)) {
            ObjtableMedicosGinecologos.api(true).row('.selected').remove().draw(false);
            $("#cboMedicos option[value='" + objrowMedicoGineco.nroDocMedico + "']").prop("disabled", false);
        }
        if (!isEmpty(objrowMedicoNeo)) {
            ObjtableMedicosNeonatologos.api(true).row('.selected').remove().draw(false);
            $("#cboMedicos option[value='" + objrowMedicoNeo.nroDocMedico + "']").prop("disabled", false);
        }
        if (!isEmpty(objrowMedicoAnestesio)) {
            ObjtableMedicosAnestesiologos.api(true).row('.selected').remove().draw(false);
            $("#cboMedicos option[value='" + objrowMedicoAnestesio.nroDocMedico + "']").prop("disabled", false);
        }
        if (!isEmpty(objrowMedicoIntensivo)) {
            ObjtableMedicosIntensivistas.api(true).row('.selected').remove().draw(false);
            $("#cboMedicos option[value='" + objrowMedicoIntensivo.nroDocMedico + "']").prop("disabled", false);
        }
        if (!isEmpty(objrowMedicoResidente)) {
            ObjtableMedicosResidentes.api(true).row('.selected').remove().draw(false);
            $("#cboMedicos option[value='" + objrowMedicoResidente.nroDocMedico + "']").prop("disabled", false);
        }
        $("#cboMedicos").val("");
        $(".chzn-select").trigger("chosen:updated");
    },

    DevolverMedicos() {
        var lstMedicosGinecologos = ObjtableMedicosGinecologos.api(true).rows().data().toArray();
        var lstMedicosNeonatologos = ObjtableMedicosNeonatologos.api(true).rows().data().toArray();
        var lstMedicosAnestesiologos = ObjtableMedicosAnestesiologos.api(true).rows().data().toArray();
        var lstMedicosIntesivistas = ObjtableMedicosIntensivistas.api(true).rows().data().toArray();
        var lstMedicosResidentes = ObjtableMedicosResidentes.api(true).rows().data().toArray();

        const lstMedicos = lstMedicosGinecologos.concat(lstMedicosNeonatologos, lstMedicosAnestesiologos, lstMedicosIntesivistas, lstMedicosResidentes);

        return lstMedicos;
    },
        
    CerrarForm() {
        //$('#modalRegistroRN').modal('hide');
        Guardia.LimpiarForm();
        MostrarAreaLista();
        ReposicionarVista();
    },

    EjecutarAccion(accion) {
        $("#btnGuardarOcurrencia").hide();
        if (accion == "A" || accion == "M") {
            $(".campo").prop("disabled", false);
            $(".btn-opciones").show();
            $("#btnGuardarOcurrencia").show();
        }

        if (accion == "C" || accion == "E") {            
            $(".campo").prop("disabled", true);
            $(".btn-opciones").hide();
        }

        $('.chzn-select').chosen().trigger("chosen:updated");       
    },

    LimpiarFiltros() {        
        $(".search").val("");
        $("#txtFiltroFecha").datepicker("setDate", FechaDia);

    },

    LimpiarForm() {
        Guardia.IdOcurrenciaMedica = 0;
        Guardia.medicos = []
        Guardia.estadoCargaData = false;
        //$("#cboMedicos option[disabled]").prop("disabled", false);
        ObjtableMedicosGinecologos.fnClearTable();
        ObjtableMedicosNeonatologos.fnClearTable();
        ObjtableMedicosAnestesiologos.fnClearTable();
        ObjtableMedicosIntensivistas.fnClearTable();
        ObjtableMedicosResidentes.fnClearTable();
        $('#cboMedicos').empty();
        $('#cboJefeGuardia').empty();
        $('#cboJefeGuardiaEntrante').empty();

        $(".campo").val("");
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFechaOcurrencia').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        
    },

    async CargarComboTurnos() {
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
            $.ajax({
                method: "GET",
                url: "/Utilitario/ListarTiposTurnosLaborales?area=Emergencia",                
                data: null,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            //Cargando(0)
            if (datos.session) {
                if (datos.estado) {
                    $('#cboTurno').empty();
                    $(datos.data.table).each(function (i, obj) {
                        if (obj.id == 1 || obj.id == 2) {
                            $('#cboTurno').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                        }                        
                    });                    
                } else {
                    alerta2("error", "", datos.msj);                                        
                }
                $("#cboTurno").trigger("chosen:updated");
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async CargarCombosEstadosOcurrencias() {
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListarEstadosHojaOcurrenciaMedica?area=Comun",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0)
            if (datos.session) {
                if (datos.estado) {
                    $('#cboFiltroEstado').empty();
                    $(datos.data.table).each(function (i, obj) {
                        $('#cboFiltroEstado').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                } else {
                    alerta2("error", "", datos.msj);
                }
                $("#cboFiltroEstado").trigger("chosen:updated");
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async CargarCantidadAtenciones(fecha, idTurno) {
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListarEstadosHojaOcurrenciaMedica?area=Comun",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0)
            if (datos.session) {
                if (datos.estado) {
                    $('#cboFiltroEstado').empty();
                    $(datos.data.table).each(function (i, obj) {
                        $('#cboFiltroEstado').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                } else {
                    alerta2("error", "", datos.msj);
                }
                $("#cboFiltroEstado").trigger("chosen:updated");
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async CargarTiposMedicos(fecha, idTurno) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (!isEmpty(fecha) && esFormatoFecha(fecha)) {
            data.append('fecha', fecha);
            data.append('idTurno', idTurno);

            try {
                ObjtableMedicosGinecologos.fnClearTable();
                ObjtableMedicosNeonatologos.fnClearTable();
                ObjtableMedicosAnestesiologos.fnClearTable();
                ObjtableMedicosIntensivistas.fnClearTable();
                ObjtableMedicosResidentes.fnClearTable();
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Utilitario/ListarMedicosPorMarcacionPorTurnoControlAsistencia?area=Comun",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                let grupo = 0;
                let idGrupo = '';
                if (datos.session) {
                    if (datos.estado) {
                        $('#cboTiposMedico').empty();
                        $('#cboMedicos').empty();
                        $('#cboJefeGuardia').empty();
                        $('#cboJefeGuardiaEntrante').empty();
                        $(datos.data.table).each(function (i, obj) {
                            if (obj.idTipoCargo != grupo) {
                                grupo = obj.idTipoCargo;
                                idGrupo = 'grupo-' + obj.idTipoCargo;
                                $('#cboTiposMedico').append('<option  value="' + grupo + '">' + obj.cargo_medico + '</option>');
                            }

                            //$('#' + idGrupo).append('<option data-idCargo="' + obj.idTipoCargo + '" data-cargo="' + obj.cargo_medico + '"  value="' + obj.dni + '">' + obj.medico + '</option>');
                            $('#cboJefeGuardia').append('<option  value="' + obj.dni + '">' + obj.medico + '</option>');
                            $('#cboJefeGuardiaEntrante').append('<option  value="' + obj.dni + '">' + obj.medico + '</option>');
                        });
                                                
                        
                        //Guardia.medicos = [];
                        $('.chzn-select').chosen().trigger("chosen:updated");

                    } else {
                        alerta2("error", "", datos.msj);
                    }

                    $('#cboTiposMedico').val("");
                    $("#cboMedicos").val("");
                    $("#cboJefeGuardia").val("");
                    $("#cboJefeGuardiaEntrante").val("");

                    $("#cboTiposMedico").trigger("chosen:updated");
                    $("#cboMedicos").trigger("chosen:updated");
                    $("#cboJefeGuardia").trigger("chosen:updated");
                    $("#cboJefeGuardiaEntrante").trigger("chosen:updated");
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina.")
                    Cargando(0);
                    location.reload();
                }

                for (var i = 0; i < Guardia.medicos.length; i++) {
                    let medico = {
                        nroDocMedico: Guardia.medicos[i].nroDocMedico,
                        idCargoMedico: Guardia.medicos[i].idCargoMedico,
                        cargoMedico: Guardia.medicos[i].cargoMedico,
                        nombreMedico: Guardia.medicos[i].nombreMedico
                    }

                    let idCargo = Guardia.medicos[i].idCargoMedico;
                    if (idCargo == 1) {
                        ObjtableMedicosGinecologos.fnAddData(medico);
                    }
                    if (idCargo == 2) {
                        ObjtableMedicosNeonatologos.fnAddData(medico);
                    }
                    if (idCargo == 3) {
                        ObjtableMedicosAnestesiologos.fnAddData(medico);
                    }
                    if (idCargo == 4) {
                        ObjtableMedicosIntensivistas.fnAddData(medico);
                    }
                    if (idCargo == 5) {
                        ObjtableMedicosResidentes.fnAddData(medico);
                    }

                    $("#cboMedicos option[value='" + Guardia.medicos[i].nroDocMedico + "']").prop("disabled", true);
                }
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        }

        //return datos;
        return resp;
    },

    async CantidadAtenciones(fecha, idTurno) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (!isEmpty(fecha) && esFormatoFecha(fecha)) {
            data.append('fecha', fecha);
            data.append('idTurno', idTurno);

            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/OcurrenciasMedicas/SeleccionarCantidadAtencionesGuardiaOcurrencia?area=Estadistica",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                if (datos.session) {
                    $(datos.respuesta.table).each(function (i, obj) {
                        $('#txtEmerAtObstetricas').val(obj.atencionesObstetricas);
                        $('#txtEmerAtGinecologicas').val(obj.atencionesGinecologicas);
                        $('#txtEmerAtPediatricas').val(obj.atencionesNeonatales);
                        $('#txtEmerAtObservacion').val(obj.atencionesSalaObservacion);
                        $('#txtEmerAtTraumaShock').val(obj.atencionesTraumaShock);
                    });
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina.")
                    Cargando(0);
                    location.reload();
                }
                
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        }

        //return datos;
        return resp;
    },

    async CargarCombosMedicos(fecha, idTurno, idTipoMedico) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (!isEmpty(fecha)) {
            data.append('fecha', fecha);
            data.append('idTurno', idTurno);

            try {
                ObjtableMedicosGinecologos.fnClearTable();
                ObjtableMedicosNeonatologos.fnClearTable();
                ObjtableMedicosAnestesiologos.fnClearTable();
                ObjtableMedicosIntensivistas.fnClearTable();
                ObjtableMedicosResidentes.fnClearTable();
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Utilitario/ListarMedicosPorMarcacionPorTurnoControlAsistencia?area=Comun",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                if (datos.session) {
                    if (datos.estado) {
                        $('#cboMedicos').empty();
                        $(datos.data.table).each(function (i, obj) {
                            if (obj.idTipoCargo == idTipoMedico) {
                                //$('#cboMedicos').append('<option  value="' + obj.dni + '">' + obj.medico + '</option>');
                                $('#cboMedicos').append('<option data-idCargo="' + obj.idTipoCargo + '" data-cargo="' + obj.cargo_medico + '"  value="' + obj.dni + '">' + obj.medico + '</option>');
                            }
                        });

                        for (var i = 0; i < Guardia.medicos.length; i++) {
                            var medico = {
                                nroDocMedico: Guardia.medicos[i].nroDocMedico,
                                idCargoMedico: Guardia.medicos[i].idCargoMedico,
                                cargoMedico: Guardia.medicos[i].cargoMedico,
                                nombreMedico: Guardia.medicos[i].nombreMedico
                            }

                            let idCargo = Guardia.medicos[i].idCargoMedico;
                            if (idCargo == 1) {
                                ObjtableMedicosGinecologos.fnAddData(medico);
                            }
                            if (idCargo == 2) {
                                ObjtableMedicosNeonatologos.fnAddData(medico);
                            }
                            if (idCargo == 3) {
                                ObjtableMedicosAnestesiologos.fnAddData(medico);
                            }
                            if (idCargo == 4) {
                                ObjtableMedicosIntensivistas.fnAddData(medico);
                            }
                            if (idCargo == 5) {
                                ObjtableMedicosResidentes.fnAddData(medico);
                            }

                            $("#cboMedicos option[value='" + Guardia.medicos[i].nroDocMedico + "']").prop("disabled", true);
                        }
                        //Guardia.medicos = [];
                        $('.chzn-select').chosen().trigger("chosen:updated");

                    } else {
                        alerta2("error", "", datos.msj);
                    }

                    $("#cboMedicos").val("");                    
                    $("#cboMedicos").trigger("chosen:updated");
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina.")
                    Cargando(0)
                    location.reload()
                }
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        }        

        //return datos;
        return resp;
    },

    async CargarCombosJefesGuardia(fecha, idTurno) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (!isEmpty(fecha)) {
            data.append('fecha', fecha);
            data.append('idTurno', idTurno);

            try {                
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Utilitario/ListarMedicosPorMarcacionPorTurnoControlAsistencia?area=Comun",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                if (datos.session) {
                    if (datos.estado) {                        
                        $('#cboJefeGuardia').empty();
                        $('#cboJefeGuardiaEntrante').empty();
                        $(datos.data.table).each(function (i, obj) {                           
                            $('#cboJefeGuardia').append('<option  value="' + obj.dni + '">' + obj.medico + '</option>');
                            $('#cboJefeGuardiaEntrante').append('<option  value="' + obj.dni + '">' + obj.medico + '</option>');
                        });
                                                
                        $('.chzn-select').chosen().trigger("chosen:updated");

                    } else {
                        alerta2("error", "", datos.msj);
                    }
                    
                    $("#cboJefeGuardia").val("");
                    $("#cboJefeGuardiaEntrante").val("");

                    $("#cboJefeGuardia").trigger("chosen:updated");
                    $("#cboJefeGuardiaEntrante").trigger("chosen:updated");
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina.")
                    Cargando(0)
                    location.reload()
                }
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        }

        //return datos;
        return resp;
    },

    ////////////////////////////SELECCIONAR//////////////////////////////////
    async ListarOcurrenciaMedica() {
        var respuesta;
        let datos
        var data = new FormData();

        data.append('nroFolio', $('#txtFiltroFolio').val());
        data.append('fechaOcurrencia', $('#txtFiltroFecha').val());
        data.append('estadoOcurrencia', $('#cboFiltroEstado').val());

        Cargando(1);
        ObjtableOcurrenciasMedicas.fnClearTable();
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/OcurrenciasMedicas/ListarOcurrenciasMedicas?area=Estadistica",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                respuesta = datos.respuesta.table;
                ObjtableOcurrenciasMedicas.fnAddData(respuesta);
            }
            else {
                respuesta = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;
    },

    async SeleccionarOcurrenciaMedica(id) {
        var respuesta;
        let datos
        var data = new FormData();

        data.append('idOcurrenciaMedica', id);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/OcurrenciasMedicas/SeleccionarOcurrenciaMedica?area=Estadistica",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                respuesta = datos.respuesta.table[0];
            }
            else {
                respuesta = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;        
    },

    async SeleccionarMedicoGuardiaOcurrencia(id) {
        var respuesta;        
        let datos
        var data = new FormData();

        data.append('idOcurrenciaMedica', id);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/OcurrenciasMedicas/SeleccionarMedicoGuardiaOcurrencia?area=Estadistica",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                respuesta = datos.respuesta.table;
            }
            else {
                respuesta = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;
    },

    /////////////////////////////////////////GUARDAR//////////////////////////////////////////////////
    async GuardarOcurrenciaMedica() {
        var data = Guardia.CargarDatosAlControlador();
        var respuesta = false;        
        let datos
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/OcurrenciasMedicas/GuardarOcurrenciaMedica?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.estado) {
                    respuesta = true;
                    Guardia.CerrarForm();
                    Guardia.ListarOcurrenciaMedica();
                    alerta2('success', 'Ocurrencia Médica', 'El registro se guardó correctamente.');
                } else {                    
                    alerta2('danger', 'Ocurrencia Médica', datos.msj);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2('danger', 'Ocurrencia Médica', error);
        }

        //return datos;
        return respuesta;
    },

}

$(document).ready(function () {
    Guardia.Iniciar();

    
});