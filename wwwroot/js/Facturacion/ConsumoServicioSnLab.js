

var ConsumoServicio = {

    idOrden: 0,
    idProducto: 0,
    codeProcedimiento: '',

    /////////////////////////INICAR SCRIPT//////////////////////////////
    IniciarScript() {
        ConsumoServicio.plugins();
        ConsumoServicio.cargaInicial();
        ConsumoServicio.initDatables();
        ConsumoServicio.initDatablesConsumoServicio();
        ConsumoServicio.initDatablesConsumoAtencion();

        ConsumoServicio.InitDatablesDiagnosticos();
        ConsumoServicio.InitDatablesBusquedaDiagnostico();

        ConsumoServicio.eventos();
    },

    async IniciarData() {
        await ConsumoServicio.listaPuntosCarga();
        await ConsumoServicio.listaServicios();
        await ConsumoServicio.listaPlan();
        await ConsumoServicio.listaDx();
    },
    ///////////////////////////////////////////////////////////////////

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaIniLista,#txtFechaFinLista,#txtFechaRealiza, #txtFechaCirugia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $("#txtHoraCirugia, #txtHoraFinalCirugia, #txtHoraInicioAtencionProcedimiento").mask("Hn:Nn");

        $('.chosen-container').css({ "width": "100%" });
        $('.chosen-drop').css({ minWidth: '80%', width: 'auto' });
    },

    cargaInicial() {
        $("#txtFechaIniLista").val(ConsumoServicio.fechaDiaActual());
        $("#txtFechaFinLista").val(ConsumoServicio.fechaDiaActual());
    },

    eventos() {
        $('#btnLimpiarCS').on('click', function () {
            Cargando(1)
            $('#txtNroCuentaLista').val("");
            $('#txtNroHistoriaLista').val("");
            $('#txtNroOdenLista').val("");
            $("#txtFechaIniLista").val(ConsumoServicio.fechaDiaActual());
            $("#txtFechaFinLista").val(ConsumoServicio.fechaDiaActual());
            Cargando(0)
        });

        $("#chkPlanCubre").on('change', async function () {
            if ($("#chkPlanCubre").is(':checked')) {
                $("#cboPlan").val(1);
                $('#hIdTipoFinanciamiento').val(1);
                $('#hIdFuenteFinanciamiento').val(1);
                $('#hdIdTipoFuenteFianConsumo').val(1)
                await ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), 1)
            } else {
                $("#txtNroCuentaRegistro").change();
                await ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), $("#cboPlan").val())
            }
            $('#lblTotal').html('Total S/0.00');
            $("#cboProcedencia").change();
            oTable_DetalleConsumo.fnClearTable();
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#btnModificar').on('click', async function () {
            ConsumoServicio.limpiar()
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro');
                return false;
            } else {
                await ConsumoServicio.listaPorIdorden(objrow.idOrden, 2);
                oTable_DetalleConsumo.resize();
            }

        });

        $('#btnConsultar').on('click', async function () {
            ConsumoServicio.limpiar()
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            await ConsumoServicio.listaPorIdorden(objrow.idOrden, 3);
            oTable_DetalleConsumo.resize();
            $('#btnguardarConsumo').css("visibility", 'hidden');

        });

        $('#btnBuscar').on('click', async function () {
            await ConsumoServicio.ListaConsumoServicioByfechas()
        });

        $('#btnguardarConsumo').on('click', function () {

            if (isEmpty($('#hdIdPuntoCarga').val())) {
                alerta(3, "Error en el punto de carga");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            if (isEmpty($('#hdIdCuentaAtencion').val())) {
                alerta(3, "Error en el numero de cuenta de atención");
                alerta(2, "Guarde la atencion y vuelva a seleccionar correctamente el paciente");
                return false;
            }

            var formData = new FormData();
            var LstDetalleConsumo = oTable_DetalleConsumo.api(true).rows().data();
            formData.append('IdOrden', $('#hdIdOrden').val());
            formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
            formData.append('IdPuntoCarga', $('#hdIdPuntoCarga').val());
            formData.append('IdPaciente', $('#hdIdPaciente').val());
            formData.append('IdCuentaAtencion', $('#hdIdCuentaAtencion').val());
            formData.append('IdServicioPaciente', $('#hdIdServicioPaciente').val());
            formData.append('idTipoFinanciamiento', $('#hIdTipoFinanciamiento').val());
            formData.append('idFuenteFinanciamiento', $('#hIdFuenteFinanciamiento').val());

            formData.append('IdEstadoFacturacion', $('#hIdEstadoFac').val());
            formData.append('FechaHoraRealizaCpt', $('#txtFechaRealiza').val());
            formData.append('LstDetalleConsumo', JSON.stringify(LstDetalleConsumo.toArray()));
            formData.append('permiso', $('#hIdPermiso').val());

            $.ajax({
                type: 'POST',
                url: "/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion",
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                success: function (datos) {

                    if (datos.session) {
                        if (datos.msjReceta == "") {
                            alerta('1', "Se  registro correctamente la consumo");
                            $('#modalConsumoServicio').modal('hide');
                            swal({
                                title: 'Consumo en el servicio',
                                text: "N° de orden de pago: " + datos.ordenPago,
                                type: 'info',
                            }).done();
                            ConsumoServicio.ListaConsumoServicioByfechas();
                            return false;
                        }
                        else {
                            alerta('2', datos.msjReceta);
                            return false;
                        }
                    }
                    else {
                        Cargando(0);
                        location.reload();
                    }
                },
                error: function (result) {
                    Cargando(0);
                    alerta('3', 'Ocurrio un error al registrar');
                    return false;
                }
            });

        })

        $('#tblCSAtencion tbody').on('click', '.btnAbrirModalInformeProcedimiento', async function () {

            var objrow = oTable_consumoServAtencion.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_consumoServAtencion.fnGetData(objrow);

            ConsumoServicio.idOrden = row.idOrden
            ConsumoServicio.idProducto = row.idProducto
            ConsumoServicio.codeProcedimiento = row.codeInformeProd

            $('#txtNroCuentaProcedimiento').val(Variables.IdCuentaAtencion)
            $('#txtDatosPacienteProcedimiento').val($('#txtDatoPaciente').val())
            $('#txtHcPacienteProcedimiento').val($('#txtDatoHistoria').val())
            $('#txtEdadProcedimiento').val($('#txtDatoEdad').val())

            $('#cboServicioOrigenProcedimiento').val(Variables.IdServicioIngreso)

            Cargando(1)

            await ConsumoServicio.CompletarInformeProcedimiento(Variables.IdAtencion, ConsumoServicio.idOrden, ConsumoServicio.idProducto)

            oTable_DiagnosticosPreOperatorio.fnClearTable();
            let diagnosticos = ObjtableDiagnosticos.api(true).data()
            let tableDiagnosticos = []

            if (!isEmpty(diagnosticos[0])) {
                $(diagnosticos).each((i, obj) => {
                    //console.log(i, obj)
                    let objRow = {
                        codigoCIE10: obj.codigoCIE10,
                        codigoCIEsinPto: obj.codigoCIEsinPto,
                        descripcion: obj.descripcion,
                        esActivo: obj.esActivo,
                        fechaInicioVigencia: obj.fechaInicioVigencia,
                        iddiagnostico: obj.iddiagnostico,
                        idTipoDiagnostico: obj.idTipoDiagnostico,
                        //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                        tipoDiagnostico: obj.tipoDiagnostico,
                        intrahospitalario: obj.intrahospitalario
                    }
                    tableDiagnosticos.push(objRow)
                })
                oTable_DiagnosticosPreOperatorio.fnAddData(tableDiagnosticos);
            }

            if (ConsumoServicio.codeProcedimiento != '') {
                $('#btnInformeProcedimiento').show()
            } else {
                $('#btnInformeProcedimiento').hide()
            }

            $('.chzn-select').chosen().trigger("chosen:updated")

            $('#modalInformeProcedimiento').modal('show')

            Cargando(0)
        })

        $('#btnGuardarInformeProcedimiento').on('click', async function () {

            Cargando(1)
            let formData = new FormData();
            formData.append("IdCuentaAtencion", Variables.IdCuentaAtencion);
            formData.append("IdAtencion", Variables.IdAtencion);
            formData.append("IdPaciente", Variables.IdPaciente);
            formData.append("IdOrden", ConsumoServicio.idOrden);
            formData.append("IdProducto", ConsumoServicio.idProducto);
            formData.append("IdMedico", Variables.IdMedico);
            formData.append("TipoIntervencion", $('#cboTipoIntervencion').val());
            formData.append("FechaCirugia", $('#txtFechaCirugia').val());
            formData.append("HoraCirugia", $('#txtHoraCirugia').val());
            formData.append("HoraFinalCirugia", $('#txtHoraFinalCirugia').val());
            formData.append("Gasas", $('#cboGasas').val());
            formData.append("CantGasas", $('#txtCantGasas').val());
            formData.append("Apositos", $('#cboApositos').val());
            formData.append("CantApositos", $('#txtCantApositos').val());
            formData.append("PrimeraAnestesia", $('#cboAnestesiaUno').val());

            formData.append("TipoPrimeraAnestesia", $('#cboTipoAnestesiaUno').val());
            formData.append("SegundaAnestesia", $('#cboAnestesiaDos').val());
            formData.append("TipoSegundaAnestesia", $('#cboTipoAnestesiaDos').val());
            formData.append("PlanTrabajo", $('#txtPlanTrabajoProcedimiento').val());
            formData.append("HoraInicioAtencion", $('#txtHoraInicioAtencionProcedimiento').val());
            formData.append("Tecnicas", $('#txtTecnicas').val());
            formData.append("Hallazgos", $('#txtHallazgos').val());

            formData.append("IncidentesAccidentes", $('#txtIncidentesAccidentes').val());
            formData.append("AnatomiaPatologica", $('#cboAnatomiaPatologica').val());
            formData.append("TejidoOrganoExaminar", $('#txtTejidoOrganoExaminar').val());
            formData.append("Destino", $('#cboDestinoInformeProcedimiento').val());

            formData.append('lstDiagnosticos', JSON.stringify(oTable_DiagnosticosPreOperatorio.api(true).data().toArray()));

            return HttpClient.Post('/ConsumoServicio/RegistraModificaInformeProcedimientos?area=Comun', formData)
                .then(async res => {
                    //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                    if (res.estado) {

                        await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
                        await AtencionMedica.ListaDiagnosticosAtenciones(Variables.IdAtencion)

                        $('#modalInformeProcedimiento').modal('hide')

                        alerta(1, 'Registro Exitoso')
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
        })
        $('#btnCerrarModalInformeProcedimiento').on('click', function () {

            $('#modalInformeProcedimiento').modal('hide')

        })

        $('#btnInformeProcedimiento').on('click', async function () {

            if (!isEmpty(ConsumoServicio.codeProcedimiento)) {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(ConsumoServicio.codeProcedimiento)
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('info', '', 'No existe informe para el procedimiento selccionado.')
            }

        })

        $("#txtCodigoDiagPre").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                if ($("#txtCodigoDiagPre").val() != "") {
                    ConsumoServicio.AbrirModalBusqueda(1);
                    ConsumoServicio.BuscarDiagnostico($("#txtCodigoDiagPre").val());
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
                    ConsumoServicio.AbrirModalBusqueda(2);
                    ConsumoServicio.BuscarDiagnostico($("#txtCodigoDiagPost").val());
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

        $('#lstDiagnosticosBusqueda').on('click', function (e, datatable, key, cell, originalEvent) {
            ConsumoServicio.AgregarDiagnosticoBusqueda();
        })
        //ObjtableBusquedaDiagnostico.on('click', function (e, datatable, key, cell, originalEvent) {
        //    ConsumoServicio.AgregarDiagnosticoBusqueda();
        //})

        $('#btnEliminarPS').on('click', function () {
            var objselec = oTable_DetalleConsumo.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_DetalleConsumo.api(true).row('.selected').remove().draw(false);
                $('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        })

        $('#btnEliminar').on('click', async function () {
            var objrow = oTable_ConsumoServicio.api(true).row('.selected').data();
            if (objrow.idEstadoFacturacion == 1) {
                swal({
                    title: 'Eliminar',
                    text: 'Estas seguro de eliminar orden?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(async function () {

                    await ConsumoServicio.eliminar(objrow.idOrden)
                    await ConsumoServicio.ListaConsumoServicioByfechas();
                });
            }
            else {
                alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                return false;
            }
        });

        $('#tblConsumoServicio tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ConsumoServicio.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblDetalleConsumo tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_DetalleConsumo.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarPS').on('click', async function () {
            await ConsumoServicio.agregarProdConsumo();
            $("#cboProductoServicio").focus();
        })

        $("#cboProcedencia").on('change', async function () {
            await ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), $('#cboPlan').val())
        })

        $("#txtNroCuentaRegistro").on('change', async function () {
            const cuenta = await ConsumoServicio.listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
            $("#cboProductoServicio").focus();
        })

        $("#btnAgregar").on('click', function () {
            ConsumoServicio.limpiar()
            $('#modalConsumoServicio').modal('show');
            oTable_DetalleConsumo.resize();
        })

        $('#btnImprimeRecetas').on('click', function () {
            $('#farmaciaRece-tab').click();
            $('#modalReceta').modal('show');
        })

        $('#btnCerrarRecetas').on('click', function () {
            $('#modalReceta').modal('hide');
        })

        /////////////EVENTOS CONSUMO EN EL SERVICIO//////////////////////
        $('#tblCSAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $("#modalConsumoServicio").on('hidden.bs.modal', async function () {
            //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
            await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
        });


        $('#btnEliminarCSAtencion').on('click', function () {
            //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
            var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();

            if (isEmpty(objrowConsumoServ)) {
                alerta(2, 'Seleccione el procedimiento que desea eliminar.');
                return false;
            }

            //if (objrow.idEstadoAtencion == 2) {
            if (Variables.IdEstadoAtencion == 2) {
                alerta('2', 'Verifique el estado de la atencion');
                return false;
            }
            else {
                if (objrowConsumoServ.idEstadoFacturacion == 1) {
                    swal({
                        title: 'Eliminar',
                        text: 'Estas seguro de eliminar orden?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    }).then(async function () {

                        await ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
                        //AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                        await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
                    }).catch(swal.noop);;
                }
                else {
                    alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                    return false;
                }
            }

        });

        $('#btnActualizaCSAtencion').on('click', async function () {
            //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
            await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
        });

        $('#btnAgregarCSAtencion').on('click', async function () {
            await ConsumoServicio.IniciarData();

            ConsumoServicio.bloqueoProcedencia();
            ConsumoServicio.limpiar();
            //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //$("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
            //ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1); // bloquear aqui

            $("#txtNroCuentaRegistro").val(Variables.IdCuentaAtencion);
            await ConsumoServicio.listaPorCuenta(Variables.IdCuentaAtencion, 1); // bloquear aqui           
            $("#txtNroCuentaRegistro").attr('disabled', true);
            $("#txtCantidadCpt").val(1);

            $('#txtLabCpt').val('')

            $('#cbolabCpt').val(-1)

            $('#contLabCpt').hide()

            if ($('#hdUsaLabs').val() == 1) {
                $('#contUsaLabCpt').show()
                $('#contRelDx').show()
            } else {
                $('#contUsaLabCpt').hide()
                $('#contRelDx').hide()
            }


            $('#cbolabCpt').trigger("chosen:updated");

            $('#modalConsumoServicio').modal('show');
        });

        $("#btnSeguimiento").on('click', async function () {
            SeguimientoPaciente.limpiaDatos();
            //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            //SeguimientoPaciente.llendaDatos(objrow.nroHistoriaClinica, 0)

            //SeguimientoPaciente.llendaDatos(Variables.NroHistoriaClinica, 0)
            await SeguimientoPaciente.llenaDatos(Variables.NroHistoriaClinica, 1);
            $("#modalSeguimiento").modal('show');
        });
        ////////////////////////////////////////////////////////////////
    },

    initDatablesConsumoAtencion() {
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
                    width: '15%',
                    targets: 0,
                    data: "idOrdenPago",
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
                    width: '55%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
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

    initDatablesConsumoServicio() {
        var parms = {
            destroy: true,
            responsive: true,
            bFilter: false,
            "order": [[0, "desc"]],
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "estadoOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                }
                ,
                {
                    data: "ordeN_PAGO",
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
                }


            ]

        }

        var tableWrapper = $('#tblConsumoServicio'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ConsumoServicio = $("#tblConsumoServicio").dataTable(parms);


    },

    initDatables() {
        var parms = {
            "scrollY": "200px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {

                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "labConfHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapper = $('#tblDetalleConsumo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DetalleConsumo = $("#tblDetalleConsumo").dataTable(parms);
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

    AbrirModalBusqueda: (tipo) => {
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
                    ObjtableBusquedaDiagnostico.fnAddData(datos.table);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },
    AgregarDiagnosticoBusqueda() {
        ConsumoServicio.objDiagSel = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
        $("#txtCodigoDiagPre").val(ConsumoServicio.objDiagSel.codigoCIE10);
        $("#hdnIdDiagnosticoPre").val(ConsumoServicio.objDiagSel.iddiagnostico);
        $("#txtDescripcionDiagPre").val(ConsumoServicio.objDiagSel.descripcion);
        ConsumoServicio.CerrarModalBusqueda()


    },
    AgregarDiagnostico(tipo) {
        let TipoDiag = ''

        TipoDiag = 'Pre'

        $("#cboTipoDiagnostico" + TipoDiag).trigger("chosen:updated");
        if ($("#txtDescripcionDiag" + TipoDiag).val() == "") { alerta(2, "Debe seleccionar el Diagnóstico"); $("#txtCodigoDiag" + TipoDiag).focus(); return false; }
        if ($("#cboTipoDiagnostico" + TipoDiag).val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $("#cboTipoDiagnostico" + TipoDiag).focus(); return false; }

        if (ConsumoServicio.ExisteDiagnosticos(tipo)) {
            alerta(2, "El Diagnóstico ya fue agregado.");
            return false;
        } else {
            var idTipoDx = '';
            var txtTipoDx = '';

            idTipoDx = $("#cboTipoDiagnostico" + TipoDiag).val();
            txtTipoDx = $('#cboTipoDiagnostico' + TipoDiag + ' option:selected').text();

            var objRow = {
                codigoCIE10: ConsumoServicio.objDiagSel.codigoCIE10,
                codigoCIEsinPto: ConsumoServicio.objDiagSel.codigoCIEsinPto,
                descripcion: ConsumoServicio.objDiagSel.descripcion,
                esActivo: ConsumoServicio.objDiagSel.esActivo,
                fechaInicioVigencia: ConsumoServicio.objDiagSel.fechaInicioVigencia,
                iddiagnostico: ConsumoServicio.objDiagSel.iddiagnostico,
                idTipoDiagnostico: idTipoDx,
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: txtTipoDx,
                //lab: $('#hdUsaLabs').val() == '1' ? $('#txtLabDiagnostico').val() : $('#cbolabDiagnostico').val(),
                intrahospitalario: ConsumoServicio.objDiagSel.intrahospitalario
            }

            oTable_DiagnosticosPreOperatorio.api(true).row.add(objRow).draw(false);



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
        var objrowDiag = oTable_DiagnosticosPreOperatorio.api(true).row('.selected').data();

        if (!isEmpty(objrowDiag)) {
            oTable_DiagnosticosPreOperatorio.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
        }
    },

    SeleccionarInformeProcedimiento: async (idAtencion, idOrden, idProducto) => {
        let formData = new FormData();
        formData.append("IdAtencion", idAtencion);
        formData.append("IdOrden", idOrden);
        formData.append("IdProducto", idProducto);

        return HttpClient.Post('/ConsumoServicio/SeleccionarInformeProcedimiento?area=Comun', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    //alerta(1, 'Registro Exitoso')
                    return res.data
                    Cargando(0)
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
                Cargando(0)
            })
    },

    CompletarInformeProcedimiento: async (idAtencion, idOrden, idProducto) => {

        let informeProdecimiento = await ConsumoServicio.SeleccionarInformeProcedimiento(idAtencion, idOrden, idProducto)

        $('#cboTipoIntervencion').val('')
        $('#txtFechaCirugia').val('')
        $('#txtHoraCirugia').val('')
        $('#txtHoraFinalCirugia').val('')
        $('#cboGasas').val('')
        $('#txtCantGasas').val('')
        $('#cboApositos').val('')
        $('#txtCantApositos').val('')
        $('#cboAnestesiaUno').val('')
        $('#cboTipoAnestesiaUno').val('')
        $('#cboAnestesiaDos').val('')
        $('#cboTipoAnestesiaDos').val('')
        $('#txtPlanTrabajoProcedimiento').val()
        $('#txtHoraInicioAtencionProcedimiento').val('')
        $('#txtTecnicas').val('')
        $('#txtHallazgos').val('')
        $('#txtIncidentesAccidentes').val('')
        $('#cboAnatomiaPatologica').val('')
        $('#txtTejidoOrganoExaminar').val('')
        $('#cboDestinoInformeProcedimiento').val('')

        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        $("#txtHoraInicioAtencionProcedimiento").val(time);

        if (!isEmpty(informeProdecimiento)) {

            if (informeProdecimiento.table.length > 0) {
                let informeProcData = informeProdecimiento.table[0]

                console.log('informeProcData', informeProcData)

                $('#cboTipoIntervencion').val(informeProcData.tipoIntervencion)
                $('#txtFechaCirugia').val(informeProcData.fechaCirugia)
                $('#txtHoraCirugia').val(informeProcData.horaCirugia)
                $('#txtHoraFinalCirugia').val(informeProcData.horaFinalCirugia)
                $('#cboGasas').val(informeProcData.gasas)
                $('#txtCantGasas').val(informeProcData.cantGasas)
                $('#cboApositos').val(informeProcData.apositos)
                $('#txtCantApositos').val(informeProcData.cantApositos)
                $('#cboAnestesiaUno').val(informeProcData.primeraAnestesia)
                $('#cboTipoAnestesiaUno').val(informeProcData.tipoPrimeraAnestesia)
                $('#cboAnestesiaDos').val(informeProcData.segundaAnestesia)
                $('#cboTipoAnestesiaDos').val(informeProcData.tipoSegundaAnestesia)
                $('#txtPlanTrabajoProcedimiento').val(informeProcData.planTrabajo)
                $('#txtHoraInicioAtencionProcedimiento').val(informeProcData.horaInicioAtencion)
                $('#txtTecnicas').val(informeProcData.tecnicas)
                $('#txtHallazgos').val(informeProcData.hallazgos)
                $('#txtIncidentesAccidentes').val(informeProcData.incidentesAccidentes)
                $('#cboAnatomiaPatologica').val(informeProcData.anatomiaPatologica)
                $('#txtTejidoOrganoExaminar').val(informeProcData.tejidoOrganoExaminar)
                $('#cboDestinoInformeProcedimiento').val(informeProcData.destino)
            }

        }
    },

    ServicioSeleccionarPorTipoServicio: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboServicioOrigenProcedimiento').empty()

                $('#cboServicioOrigenProcedimiento').append('<option  value="0">Seleccionar una opcion</option>')
                $(data.table).each(function (i, obj) {
                    $('#cboServicioOrigenProcedimiento').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    async verificarEstadosCuenta(nroCuenta, permiso) {
        var midata = new FormData();
        let estado, descripcionEstado;

        midata.append('idCuenta', nroCuenta);
        await $.ajax({
            method: "POST",
            url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {

                    estado = datos.table[0].idEstado;
                    descripcionEstado = datos.table[0].estadoCta;
                    servicioAnterior = datos.table[0].servicioAnterior;
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return { estado, descripcionEstado, servicioAnterior };
    },

    calculaTotal() {
        total = 0.00
        otableConsumo = oTable_DetalleConsumo.api(true).rows().data();
        otableConsumo.each(function (value, index) {
            total = parseInt(total) + parseInt(otableConsumo[index]["total"])
        });
        return total
    },

    async listaDx() {

        if ((typeof ObjtableDiagnosticos) != 'undefined') {
            let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

            if (lstDx.length > 0) {
                $(lstDx).each(function (i, obj) {
                    $('#cboDxCpt').append('<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>');
                });

                //$(td).html(caja)
            }
        } else {
            let formData = new FormData()

            formData.append('IdAtencion', Variables.IdAtencion)
            HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                .then(res => {
                    if (!isEmpty(res)) {
                        if (res.estado) {
                            let data = res.data
                            if (data.table.length > 0) {
                                $(data.table).each(function (i, obj) {
                                    $('#cboDxCpt').append('<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>');
                                });
                            }
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
        }
    },

    async listaPuntosCarga() {

        $.ajax({
            async: false,
            cache: false,
            url: "/ConsumoServicio/ListaPuntoCargas?area=Facturacion",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboPuntoCarga').empty();
                $('#cboPuntoCargaRegistro').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboPuntoCarga').append('<option  value="' + obj.idPuntoCarga + '">' + obj.descripcion + '</option>');
                    $('#cboPuntoCargaRegistro').append('<option  value="' + obj.idPuntoCarga + '">' + obj.descripcion + '</option>');

                });
                $('#cboPuntoCarga').val(1);
                $('.chzn-select').chosen().trigger("chosen:updated");
                //$('.chzn-select').chosen();
                //$('.chzn-drop').css({ "width": "300px" });

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar puntos de carga!", "2");
                }, 900)
            }
        });
    },

    async listaServicios() {

        $.ajax({
            async: false,
            cache: false,
            url: "/ConsumoServicio/ListaServiciosQueSonPuntosCarga?area=Facturacion",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboConsultorio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedencia').append('<option  ptcarga=' + obj.idPuntoCarga + ' value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
                //$('.chzn-select').chosen();
                //$('.chzn-drop').css({ "width": "300px" });

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },

    async listaPlan() {
        var midata = new FormData();
        midata.append('filtro', ' ');

        $.ajax({
            type: "post",
            url: "/ConsumoServicio/TipoFinanciamientosDevuelveSoloFarmacia?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboPlan').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboPlan').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },

    existeProd(idproducto) {

        lstProductosConsumo = oTable_DetalleConsumo.api(true).rows().data();
        if (lstProductosConsumo.length == 0) {
            return false;
        }

        for (var i = 0; i < lstProductosConsumo.length; i++) {
            if (lstProductosConsumo[i].idProducto == idproducto) {

                return true;
            }
        }

    },

    async agregarProdConsumo() {
        var objselec = $("#cboProductoServicio").val();

        if (ConsumoServicio.existeProd(objselec)) {

            alerta(2, $('#cboProductoServicio option:selected').text() + " ya fue agregado.");
            return false;
        }
        else {
            precioUnitario = await ConsumoServicio.asignaPrecio(objselec, $('#hdIdTipoFuenteFianConsumo').val())

            if ($('#txtCantidadCpt').val() > 0) {
                var objRow = {
                    idProducto: objselec,
                    nombre: $('#cboProductoServicio option:selected').text(),
                    cantidad: $('#txtCantidadCpt').val(),
                    precio: precioUnitario,
                    total: precioUnitario * $('#txtCantidadCpt').val(),
                    labConfHIS: $('#hdUsaLabs').val() == '1' ? $('#txtLabCpt').val() : $('#cbolabCpt').val(),
                    dx: $('#cboDxCpt').val()

                }
                oTable_DetalleConsumo.api(true).row.add(objRow).draw(false);

                $('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())

                $('#txtLabCpt').val('')

                $('#cbolabCpt').val(-1)
                $('#cbolabCpt').trigger("chosen:updated");
            }
            else {
                alerta(2, "Ingrese una cantidad correcta");
                $("#txtCantidadCpt").focus();
                return false;
            }
        }
    },

    async asignaPrecio(idproducto, idTipoFinanciamiento) {
        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idproducto);
        midata.append('idpuntoCarga', 0);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);


        $.ajax({
            method: "POST",
            url: "/Catalogo/ProductoByIdByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                if (datos.session) {
                    if (datos.listaCatalogo.table.length > 0) {

                        precio = datos.listaCatalogo.table[0]["precioUnitario"]
                    }
                    else {
                        precio = 0
                    }

                }
                else {
                    Alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }


            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error asignar precio!", "2");
                    return 0
                }, 900)
            }
        });

        return precio;
    },

    async AtencionesEstanciaHospitalariaPorIdCuenta(idCuenta) {
        //Cargando(1)
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);

        var idServicio = 0

        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Atencion/AtencionesEstanciaHospitalariaPorIdCuenta?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length > 0) {
                    idServicio = datos.table[0].idServicio
                }
                else {
                    idServicio = 0
                }

            },
            error: function (msg) {
                idServicio = 0
            }
        });

        return idServicio
    },

    async ListaCptByPuntoCargaByFuente(idPuntoCarga, idTipoFinanciamiento) {
        Cargando(1)
        var midata = new FormData();
        midata.append('idPuntoCarga', idPuntoCarga);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);
        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Catalogo/ListaCptByPuntoCargaByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                $('#cboProductoServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProductoServicio').append('<option  value="' + obj.idProducto + '">( ' + obj.codigo + ' ) - ' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    async ListaConsumoServicioByfechas() { // JDELGADO001.2
        Cargando(1)
        oTable_ConsumoServicio.fnClearTable();

        var midata = new FormData();

        if ($("#txtFechaIniLista").val() == undefined) {
            midata.append('FechaInicio', ConsumoServicio.fechaDiaActual());
            midata.append('FechaFin', ConsumoServicio.fechaDiaActual());
            midata.append('idPuntoCarga', $("#cboPuntoCarga").val());
            midata.append('idCuenta', $("#txtNroCuentaLista").val());
            midata.append('historia', $("#txtNroHistoriaLista").val());
            midata.append('idOrden', $("#txtNroOdenLista").val());
            console.log("no hay fechas ConsumoServicio.js")
        } else {
            midata.append('FechaInicio', $("#txtFechaIniLista").val());
            midata.append('FechaFin', $("#txtFechaFinLista").val());
            midata.append('idPuntoCarga', $("#cboPuntoCarga").val());
            midata.append('idCuenta', $("#txtNroCuentaLista").val());
            midata.append('historia', $("#txtNroHistoriaLista").val());
            midata.append('idOrden', $("#txtNroOdenLista").val());
            console.log("si hay fechas ConsumoServicio.js")
        }

        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/ListaConsumoServicioByfechas?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.lsconsumo.table.length > 0) {
                        oTable_ConsumoServicio.fnAddData(datos.lsconsumo.table);
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
        });
    },

    async listaPorIdorden(idOrden, permiso) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        midata.append('permiso', permiso);

        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FactOrdenServicioSeleccionarPorId?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {

                    $("#txtNroOrden").val(datos.table[0].idOrden);
                    $("#hdIdOrden").val(datos.table[0].idOrden);
                    $("#txtNroCuentaRegistro").val(datos.table[0].idCuentaAtencion);
                    //alert(datos.table[0].estadoFacturacion);
                    $("#txtEstado").val(datos.table[0].estadoFacturacion);
                    //$("#txtNroOrden").val(datos.table[0].idOrden);

                    //1. respetar el orden
                    $("#txtNroCuentaRegistro").change();
                    // 1. Fin /////////////////////

                    $("#txtFechaRegistro").val(datos.table[0].fechaCreacion2);
                    $("#txtFechaRealiza").val(datos.table[0].fechaCreacion2);
                    $("#txtFechaDespacho").val(datos.table[0].fechaDespacho2);

                    ConsumoServicio.listaDetalleDespacho(datos.table[0].idOrden)


                    $("#txtNroOrdenPago").val((datos.table[0].idTipoFinanciamiento == 2) ? 0 : ConsumoServicio.listaFactOrdenServicioPagosSeleccionarPorIdOrden(datos.table[0].idOrden))
                    $("#hdIdOrdenPago").val($("#txtNroOrdenPago").val())
                    $('#modalConsumoServicio').modal('show');
                    $('#hIdPermiso').val(permiso);

                    $("#chkPlanCubre").css("visibility", 'hidden');


                    //este if usa los datos llenados en el evento change de  txtNroCuentaRegistro  1. /
                    if (datos.table[0].idTipoFinanciamiento != $("#cboPlan").val()) {

                        planOrden = datos.table[0].idTipoFinanciamiento
                        planCuenta = $("#cboPlan").val()
                        desPlanCuenta = $("#txtDesPlan").val();
                        $("#cboPlan").val(planOrden) //cambio el valor de la cuenta por el de la orden
                        $('.chzn-select').chosen().trigger("chosen:updated");
                        $("#txtDesPlan").val(""); // limpio para asignar nuevo plan
                        $("#txtDesPlan").val($('#cboPlan option:selected').html() + ' /' + desPlanCuenta);
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                        alerta(3, "No se podrá modificar datos, porque el despacho tubo otra PRODUCTO/PLAN, hubo RECALCULO");
                        //$('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
                    }

                    if (datos.table[0].idEstadoFacturacion == 4) {
                        alerta(2, 'La orden ya fue pagada, ya no se puede modificar');
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                        //$('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
                        return false;
                    }
                    else {

                        if (datos.table[0].idEstadoFacturacion == 9) {
                            alerta(2, 'La orden ya fue eliminada, ya no se puede modificar');
                            $('#btnguardarConsumo').css("visibility", 'hidden');
                            //$('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
                            return false;
                        }

                    }

                    if ($("#hdIdEstadoCuenta").val() != 1) {
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                    }
                    else {
                        $('#btnguardarConsumo').css("visibility", 'visible');
                    }

                    if (permiso == 3) {
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    limpiar() {
        $("#txtDesPlan").val("");
        $("#txtNroOrdenPago").val("");
        $("#txtNroOrden").val("");
        $("#hdIdOrden").val(0);
        $("#txtNroCuentaRegistro").val("");
        $("#txtFechaRegistro").val("");
        $("#txtFechaRealiza").val("");
        $("#txtFechaDespacho").val("");
        $("#txtPacienteRegistro").val("");
        $("#txtDesPlan").val("");
        $("#txtDesFuenteFinan").val("");
        $("#txtEstado").val("Registro");
        oTable_DetalleConsumo.fnClearTable();
        $('#btnguardarConsumo').css("visibility", 'visible');
        $("#chkPlanCubre").css("visibility", 'visible');
        $('#lblTotal').html('Total S/0.00')
        $('#chkPlanCubre').prop('checked', false);
    },

    async listaDetalleDespacho(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        oTable_DetalleConsumo.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FacturacionServicioDespachoDetalleFiltraPorIdOrden?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.data.table.length !== 0) {
                    oTable_DetalleConsumo.fnAddData(datos.data.table);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });

        $('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
    },

    async listaFactOrdenServicioPagosSeleccionarPorIdOrden(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);

        idOrdenPago = 0

        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FactOrdenServicioPagosSeleccionarPorIdOrden?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.table.length !== 0) {
                    idOrdenPago = datos.table[0].idOrdenPago
                }
            },
            error: function (msg) {
                idOrdenPago = 0
            }
        });

        return idOrdenPago;
    },

    async eliminar(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/EliminaConsumoServicio?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.session) {
                    Cargando(0);
                    if (datos.respuesta) {
                        alerta('1', "Se elimino correctamente la orden");
                    }
                    else {
                        alerta('3', datos.mensaje);
                        return false;
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0);
                alerta('3', "Error al eliminar orden");
            }
        });

    },

    async listaPorCuenta(nroCuenta, permiso) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        var sigue = true;

        data.append('idCuenta', nroCuenta);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.table.length > 0) {
                //falta codigo
                ////Fin-------
                if (sigue) {
                    $("#txtDesFuenteFinan").val("F.Ing: " + datos.table[0].fechaIngreso2 + " - " + (datos.table[0].idTipoServicio == 1 ? "Consultorios Externos" : datos.table[0].idTipoServicio == 3 ? "Hospitalización" : "Emergencia") + "- Est: " + datos.table[0].estadoCta)
                    $("#txtDesPlan").val("IAFA Act: " + datos.table[0].dFuenteFinanciamiento);
                    $("#txtPacienteRegistro").val(datos.table[0].apellidoPaterno + " " + datos.table[0].apellidoMaterno + " " + datos.table[0].primerNombre);
                    $("#cboPlan").val(datos.table[0].idFormaPago);
                    $("#txtFechaRegistro").val(ConsumoServicio.fechaDiaActual());
                    $("#txtFechaRealiza").val(ConsumoServicio.fechaDiaActual());
                    //$("#txtEstado").val(datos.table[0].estadoCta);
                    $("#hdIdTipoFuenteFianConsumo").val(datos.table[0].idFormaPago);
                    $("#txtFechaDespacho").val(ConsumoServicio.fechaDiaActual());

                    $("#cboPuntoCargaRegistro").val(1);

                    if (datos.table[0].idPaciente == 0) {
                        $('#rbdTipoVentaPreVenta').prop('checked', true)
                    }
                    else {
                        $('#rbdTipoVentaDirecta').prop('checked', true)
                    }

                    idServicio = await ConsumoServicio.AtencionesEstanciaHospitalariaPorIdCuenta(nroCuenta)

                    $('#hdIdPuntoCarga').val($("#cboPuntoCargaRegistro").val());
                    $('#hdIdPaciente').val(datos.table[0].idPaciente);
                    $('#hdIdCuentaAtencion').val(datos.table[0].idCuentaAtencion);
                    $("#hdIdEstadoCuenta").val(datos.table[0].idEstado)
                    $('#hIdTipoFinanciamiento').val(datos.table[0].idFormaPago);
                    $('#hIdFuenteFinanciamiento').val(datos.table[0].idFuenteFinanciamiento);
                    console.log(datos.table[0].idServicioIngreso);

                    $("#cboProcedencia").val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio);
                    $('#hdIdServicioPaciente').val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio)

                    await ConsumoServicio.ListaCptByPuntoCargaByFuente($('#cboProcedencia>option:selected').attr("ptcarga"), datos.table[0].idFormaPago)
                    $('#hIdPermiso').val(permiso)
                    $('.chzn-select').chosen().trigger("chosen:updated");

                    console.log(datos);

                    if (datos.table[0].idEstado != 1) {
                        alerta(2, "Ese estado de Cuenta no se encuentra ABIERTA");
                        $('#btnguardarConsumo').css("visibility", 'hidden');
                        return false;
                    }
                }
            }
            else {
                resp = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async AsignarDatosDeCuenta(datos) {

    },

    fechaDiaActual() {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaDia = dia + "/" + mes + "/" + yyy
        return fechaDia;
    },

    bloqueoProcedencia() {
        $("#cboProcedencia").attr('disabled', true);
    },

    async BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion) {
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


};



