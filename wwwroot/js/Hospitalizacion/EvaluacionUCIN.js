let EvaluacionesUCI = {
    Iniciar() {
        EvaluacionesUCI.Plugins();
        EvaluacionesUCI.InitDatablesAtencionesUCI();
        EvaluacionesUCI.Eventos();

        /////////////DIAGNOSTICOS//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        ///////////////////////////////////////

        /////////ORDENES MEDICAS////////////////
        OrdenMedica.IniciarScript();
        ////////////////////////////////////////

        /////////RESULTADOS LABORATORIO////////////////
        Resultados.IniciarScript();
        ////////////////////////////////////////

    },

    async Plugins() {
        //$(".hide_search").chosen({ disable_search_threshold: 10 })
        //$(".chzn-select").chosen({ allow_single_deselect: false })
        //$(".chzn-select-deselect,#select2_sample").chosen()
        //$('.chzn-select').chosen().trigger("chosen:updated")

        $('.maskFecha').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        await Utilitario.AsignarFechaHoy("#txtFechaInicioBuscar,#txtFechaFinBuscar");

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

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });

        //Transferencias.tipoServicio = 'UCI';
        //AltaMedica.tipoServicio = "UCI";
        //AltaMedica.EventosInicial();

        //EstablecimientosSalud.IniciarScript()

    },


    /////////////////////DATATABLES////////////////////////////////////////////////////////////////////////////////////////////////
    InitDatablesAtencionesUCI() {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            scrollCollapse: true,
            bFilter: false,
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
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '4%',
                    targets: 3,
                    data: "codigoCama",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaEgresoAdministrativo + ' ' + rowData.horaEgresoAdministrativo);

                    }
                },
                {
                    width: '9%',
                    targets: 7,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '9%',
                    targets: 7,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 8,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "cantEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "estadoFacturacion",
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        //let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        //$(td).html(estado.descripcionEstado);

                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        //let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        if (rowData.cantEvaluacion > 0) {
                            $(td).parent().css('color', '#5a73ff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.idEstadoAtencion != 1) {
                            $(td).parent().css('color', '#c76d14');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.idEstadoFacturacion == 12) {
                            $(td).parent().css('color', '#8e24aa');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.conAlta == 1) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (!isEmpty(rowData.fechaEgresoAdministrativo)) {
                            $(td).parent().css('color', '#607D8B');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

                        if (rowData.cantEvaluacion > 0) {
                            //btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            //if (rowData.code != '0') {
                            //    if (rowData.statusFirma == 1) {
                            //        btnImprimeSinF = "";
                            //        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                            //    } else {
                            //        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                            //    }
                            //}

                            btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);


                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html("");
                        }

                    }
                },
                {
                    width: '8%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";


                        //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                        if (rowData.codeInformeMedico != '0') {
                            btnImprimeSinF = '<button class="ImprimeAltaSF btn btn-sm btn-warning glow_button" title="Visualiza Alta" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.statusFirmaInformeMedico == 1) {
                                btnImprimeSinF = "";
                                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeAltaCF" title="Imprime Alta Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarAltaSF" title="Firmar Alta" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                            }
                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

                    }
                }
            ]
        }

        var tableWrapper = $('#tblAtencionesUCI'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AtencionesUCI = $("#tblAtencionesUCI").dataTable(parms);
    },



    //////////////////////EVENTOS////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscarFiltroAtencionesUCIN").click();
            }
        });

        $('#cboServicioBuscar').on('change', function () {
            EvaluacionesUCI.ListarAtenciones();
        });

        $('#btnBuscarFiltroAtencionesUCIN').on('click', function () {
            if (isEmpty($('#txtNroHistoriaBuscar').val()) && isEmpty($('#txtNroCuentaBuscar').val()) && isEmpty($('#txtNroDniBuscar').val()) && isEmpty($('#txtApPaternoBuscar').val()) &&
                isEmpty($('#txtFechaInicioBuscar').val()) && isEmpty($('#cboServicioBuscar').val()) && isEmpty($('#txtFechaFinBuscar').val())) {

                alerta2("info", "", 'Debe ingresar al menos un campo para la busqueda');
                return false
            }

            EvaluacionesUCI.ListarAtenciones();
        });

        $('#tblAtencionesUCI tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_AtencionesUCI.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnModificarAtencion').on('click', async function () {
            let objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data()

            //if (EvaluacionesUCI.VaidarEstadoAtencion()) {
            //    MostrarAreaRegistro();
            //} 
            MostrarAreaRegistro();
            
        });

        $("#btncerrar").on('click', function () {
            swal({
                title: 'CERRAR',
                text: "¿Esta seguro de cerrar el módulo de evaluación?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function () {
                //AdmisionEmergencia.limpiarRecetas()
                //EvaluacionNeonatal.LimpiarModuloNeonatal();
                //AdmisionEmergencia.CerrarModulo();
                //ReposicionarVista();
                //MostrarAreaLista();
                $('#TabBusqueda').click();
            }, function (dimiss) {

            });
        });


    },

    ///////////////////////METODOS//////////////////////////////////////////////////////////////////////////////////////////////////////////
    VaidarEstadoAtencion() {
        var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            //alerta(2, 'Seleccione un registro por favor.');
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            //alerta(2, 'La cuenta esta cerrada.');
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (AdmisionHospitalizacion.accion == 'M') {
                return false;
            }

            //if (AdmisionHospitalizacion.accion == 'AM') {
            //    return false;
            //}
        }

        if (!isEmpty(objrowTb.fechaEgreso)) {
            //alerta(2, 'El paciente tiene alta médica.');
            alerta2('warning', '', 'El paciente tiene alta médica.');
            return false;
            //if (AdmisionHospitalizacion.accion == 'M') {
            //    return false;
            //}

            //if (AdmisionHospitalizacion.accion == 'AM') {
            //    return true;
            //}
        }

        if (isEmpty(objrowTb.idCamaIngreso)) {
            alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
            return false;
        }

        if (objrowTb.llegoAlServicio == 0) {
            alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
            return false;
        }

        //if (objrowTb.llegoAlServicio == 0) {
        //    swal({
        //        title: 'Transferencia',
        //        text: 'Debe confirmar que el paciente <strong style="font-weight: 900;text-decoration: underline;">Llegó al Servicio Transferido</strong>.<br>Cama Nro: ' + objrowTb.codigoCama + ' <br>¿Esta seguro de confirmar la llegada?',
        //        type: 'warning',
        //        showCancelButton: true,
        //        confirmButtonColor: '#4fb7fe',
        //        cancelButtonColor: '#6c6c6c',
        //        confirmButtonText: 'SÍ LLEGÓ',
        //        cancelButtonText: 'CANCELAR',
        //    }).then(async function () {
        //        const llegada = await Transferencias.ConfirmarLlegadaAlServicio(objrowTb.idEstanciaHospitalariaActual);
        //        if (llegada) {
        //            AdmisionHospitalizacion.ListarAtenciones(1);
        //            ReposicionarVista();
        //        }
        //    }, function (dimiss) {
        //        AdmisionHospitalizacion.ListarAtenciones(1);
        //        ReposicionarVista();
        //    });

        //    return false;
        //}

        return true;
    },


    /////////////////////CONSUMO CONTROLADORES///////////////////////////////////////////////////////////////////////////////////////////////
    async ListarAtenciones() {
        let resp = false;
        let datos
        let midata = new FormData();
                        
        midata.append('historiaClinica', $('#txtNroHistoriaBuscar').val());
        midata.append('idCuentaAtencion', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('apellidoPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fechaIngreso', $('#txtFechaInicioBuscar').val());
        midata.append('fechaFin', $('#txtFechaFinBuscar').val());
        midata.append('idServicio', $('#cboServicioBuscar').val());

        try {
            Cargando(1);
            oTable_AtencionesUCI.fnClearTable();
            datos = await
            $.ajax({
                method: "POST",
                url: "/EvaluacionUCIN/ListarAtencionesUCIN?area=Hospitalizacion",
                //contentType: "application/json; charset=utf-8",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_AtencionesUCI.fnAddData(datos.respuesta.table);
                oTable_AtencionesUCI.resize();
            }
            else {
                resp = false;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
               
    },



}



$(document).ready(() => {
    
    EvaluacionesUCI.Iniciar();

    //EvaluacionesUCI.InitDatablesAtencionesUCI()
    //EvaluacionesUCI.IniciarDataTablesInformeEvaluacion()

   

    //EvaluacionesUCI.ServicioSeleccionarPorTipoServicioYEspecialidad(3)

    //EvaluacionesUCI.EventosIniciales();


    //EvaluacionesUCI.Events()

    //PermisoGeneral.ValidarServicioFirmaDigital();
})