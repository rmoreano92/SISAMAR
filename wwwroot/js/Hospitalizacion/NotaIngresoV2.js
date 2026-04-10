let NotaIngreso = {
    esNeo: false,
    accion: '',

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaAtencionBuscar, #txtFUR, #txtFUE, #txtFPP, #txtFechaTransferencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        Ordenes.tipoServicio = 'HOSP'
    },
    CargaInicial: () => {
        let fecha = new Date();
        let dia = fecha.getDate();
        let mes = parseInt(fecha.getMonth()) + 1;
        let yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionBuscar').val(fechaP);
    },

    TiposServicio: () => {
        $.ajax({
            async: false,
            cache: false,
            url: "/DashBoardHosp/ListarServicio?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboServicioAtenciones').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');

                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                alerta(3, "Error listar tipos de servicio!", "2");
            }
        });
    },
    ListaPacientesHosp: () => {

        Cargando(1)
        oTable_atencionesEmer.fnClearTable();

        var midata = new FormData();
        midata.append('historiaClinica', $('#txtNroHistoriaBuscar').val());
        midata.append('idCuentaAtencion', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('apellidoPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fechaIngreso', $('#txtFechaAtencionBuscar').val());
        midata.append('idServicio', $('#cboServicio').val());
        midata.append('fechaTransferencia', $('#txtFechaTransferencia').val());

        $.ajax({ //jdelgado010
            method: "POST",
            url: "/NotaIngreso/ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFecha?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    console.log("consulta este")
                    if (datos.lstPacientesHops.table.length > 0) {
                        oTable_atencionesEmer.fnAddData(datos.lstPacientesHops.table);
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

    async Mostrar(row) {
        let antecedentes = await PermisoGeneral.SeleccionaParametros(1009)
        let examenFisico = await PermisoGeneral.SeleccionaParametros(1010)
        let examenObstetrico = await PermisoGeneral.SeleccionaParametros(1011)
        let trabajoParto = await PermisoGeneral.SeleccionaParametros(1012)


        $("#modulo").html("");

        if (antecedentes[0].valorTexto.split(',').includes(row.idServicioEgreso.toString())) {
            
            NotaIngreso.esNeo = false
            await NotaIngreso.CargarModulo('notaingreso');
            await NotaIngresoRegistrar.IniciarModulo();
        } else {

            NotaIngreso.esNeo = true
            await NotaIngreso.CargarModulo('neonatal');
            await EvaluacionNeonatal.IniciarModulo();
        }

        await MostrarAreaRegistro()

        BusquedaDiagnosticos.IniciarScript();
        /////////////DIAGNOSTICOS//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        ///////////////////////////////////////
        ConsumoServicio.IniciarScript();
        Ordenes.IniciarScript();
        await Ordenes.IniciarData();

        //if (objrowTb.tipoModuloEmergencia == "ginecobstetra") { EvaluacionEmergencia.ModificarEvaluacion(); }
        //if (NotaIngreso.esNeo) { EvaluacionNeonatal.ModificarEvaluacion(); }
        if (!NotaIngreso.esNeo) {
            await NotaIngresoRegistrar.IniciaFormulario(1);
        } else {
            await EvaluacionNeonatal.ModificarEvaluacion();
        }
    },

    
    ImprimiInformeSF: (idCuentaAtencion, idItem, idServicio) => {

        var url = "/Atencion/HospGineObstetrsPdfSinFirma?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idItem=" + idItem + "&idServicio=" + idServicio;

        $('#ifrmReportes').attr('src', url);
        $('#ifrmReportes').show()
    },
    ImprimeReevaluacion: (idCuentaAtencion, idItem, idServicio) => { // JDELGADO001.1
        console.log("imprimeReevaluacion")
        var url = "/Atencion/HospReevaluacionSF?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idItem=" + idItem + "&idServicio=" + idServicio;

        console.log('url', url)
        $('#ifrmReportes').attr('src', url);
        $('#ifrmReportes').show()
    },

    InitDatables: () => {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
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
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
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
                    width: '5%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fecNacim));
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "tipoPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: "cantEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: '7%',
                    targets: 12,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.id) && rowData.id > 0) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            //btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            /*SE COMENTO PORQUE SOLO PERMITIRA FIRMAR DESDE EL MODULO DEL DETALLE DE LA EVALUACION
                            if (rowData.statusFirma == 0) {
                                btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip"> <i class="fa fa-pencil"></i></a>';
                            }*/

                            //if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirEvalNeoEmerConF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';

                                //btnRuta = "";
                            } else {
                                btnImprimeSinF = '<button class="ImprimirEvalNeoEmerSinF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                        if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.conAlta == 1) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }
            ]
        }
        var tableWrapper = $('#tblAtencionEmer'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesEmer = $("#tblAtencionEmer").dataTable(parms);
    },

    CargarModulo: async (modulo) => {
        var midata = new FormData();
        midata.append('modulo', modulo);
        $("#ModuloAlta").html("");
        $("#modulo").html("");

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AdmisionEmergencia/CargarModulo?area=Emergencia",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $("#modulo").html(datos);
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    Events: () => {

        $("#txtFUR").on('change', function () {

            if ($("#txtFUR").val() != "") {
                var midata = new FormData();

                midata.append('FechaCita', fehaDiaActual());
                midata.append('Fecha', $("#txtFUR").val());
                midata.append('SemanasEco', 0);
                midata.append('DiasEco', 0);
                midata.append('Tipo', 1);

                $.ajax({
                    method: "POST",
                    url: "/Atencion/DevolverEdadGestacional?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (datos) {
                        if (isEmpty(datos) == false) {
                            $("#txtEdadGestacionalSemanas").val(datos.cantSemanas);
                            $("#txtEdadGestacionalDias").val(datos.cantDias);
                            $("#txtFPP").val(datos.fpp);
                        }
                    },
                    error: function (msg) {
                        setTimeout(function () {
                            //                    Cargando(0);
                            alerta("ERROR", "Error al calcular la edad gestacional!", "2");
                        }, 900)
                    }
                });

            }
            else {
                alerta(3, "Debe ingresar la fecha de ultima regla");
                $("#txtFUM").focus();
            }

        });

        $("#chkFUR").on('click', function () { // JDELGADO001.2
            if ($("#chkFUR").is(':checked')) {
                $("#txtFUR").attr('disabled', true);
                $("#txtFUR").val('');
            } else {
                $("#txtFUR").attr('disabled', false);
            }
        })
        $("#chkFUE").on('click', function () { // JDELGADO001.2
            if ($("#chkFUE").is(':checked')) {
                $("#txtFUE").attr('disabled', true);
                $("#txtFUE").val('');
            } else {
                $("#txtFUE").attr('disabled', false);
            }
        })

        $("#rdbTactoVaginalSi").on("click", function () {
            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(2);
        });
        $("#rdbTactoVaginalDiferido").on("click", function () {
            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(1);
        });

        
        $('#cboServicio').on('change', function () {
            NotaIngreso.ListaPacientesHosp();
        });

        $('#btnBuscarAtencionesHospitalizacion').on('click', function () {
            if ($('#txtNroHistoriaBuscar').val() == '' && $('#txtNroCuentaBuscar').val() == '' && $('#txtNroDniBuscar').val() == '' && $('#txtApPaternoBuscar').val() == '' &&
                $('#txtFechaAtencionBuscar').val() == '' && $('#txtFechaTransferencia').val() == '' && $('#cboServicio').val() == 0) {

                alerta(2, 'Debe ingresar al menos un campo para la busqueda');
                return false
            }
            NotaIngreso.ListaPacientesHosp();
        })
        $('#btnLimpiarFiltro').on('click', function () {
            $('#txtNroHistoriaBuscar').val('')
            $('#txtNroCuentaBuscar').val('')
            $('#txtNroDniBuscar').val('')
            $('#txtApPaternoBuscar').val('')
            $('#txtFechaAtencionBuscar').val('')
            $('#txtFechaTransferencia').val('')
            $(`#cboServicio`).val(0)
            $('.chzn-select').chosen().trigger("chosen:updated")
        })
        $("#btnAgregarNI").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            //AdmisionEmergencia.accion = "M";
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro');
                return false;
            } else {

                let estado = await ConsumoServicio.verificarEstadosCuenta(objrowTb.idCuentaAtencion, 1);

                if (estado.estado != 1) {
                    swal({
                        title: 'Atenciones',
                        text: `Verificar cuenta \n
                            Estado: ${estado.estado} - ${estado.descripcionEstado}  \n
                            Servicio actual: ${objrowTb.servicioActual}`,
                        type: 'info',
                    }).done();
                    return false;
                }
                Variables.Cargar(objrowTb);
                NotaIngreso.Mostrar(objrowTb)

            }

        })
        
        ///////////////////////////////EVENTO ALTA MEDICA///////////////////////////////
        $("#btnAltaMedica").on('click', async function () {
            $("#ModuloAlta").html("");

            NotaIngreso.accion = "AM";
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            Cargando(1);
            if (NotaIngreso.ValidaCargaModulo()) {
                Variables.Cargar(objrowTb);
                AltaMedica.tipoServicio = 1;
                await Utilitario.CargarModuloAlta();
                await AltaMedica.IniciarScript();
                await AltaMedica.ModificarAltaMedica();
            }
            Cargando(0);

            //AdmisionEmergencia.ListarAtenciones();
        });
        //////////////////////////////////////////////////////////////////////////////
        
        

        //$('#tblAtencionEmer tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_atencionesEmer.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //    //var pos = oTable_atencionesEmer.api(true).row($(this)).index();
        //    //var row = oTable_atencionesEmer.fnGetData(pos);
        //})

    },


    /// <summary>
    /// VALIDACIONES
    /// </summary>
    /// Lista de metodos que se encargan de realizar validaciones
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ValidaCargaModulo() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            //alerta(2, 'Seleccione un registro por favor.');
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            //alerta(2, 'La cuenta esta cerrada.');
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (AdmisionEmergencia.accion == 'M') {
                return false;
            }

            if (AdmisionEmergencia.accion == 'AM') {
                return true;
            }
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            //alerta(2, 'El paciente tiene alta médica.');
            alerta2('warning', '', 'El paciente tiene alta médica.');
            if (AdmisionEmergencia.accion == 'M') {
                return false;
            }

            if (AdmisionEmergencia.accion == 'AM') {
                return true;
            }
        }

        if (objrowTb.esObservacionEmergencia) {
            if (objrowTb.llegoAlServicio == 0) {
                swal({
                    title: 'Transferencia',
                    text: 'Debe confirmar que el paciente <strong style="font-weight: 900;text-decoration: underline;">Llegó al Servicio Transferido</strong>.<br>Cama Nro: ' + objrowTb.codigoCama + ' <br>¿Esta seguro de confirmar la llegada?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'SÍ LLEGÓ',
                    cancelButtonText: 'CANCELAR',
                }).then(async function () {
                    const llegada = await Transferencias.ConfirmarLlegadaAlServicio(objrowTb.idEstanciaHospitalariaActual);
                    if (llegada) {
                        AdmisionEmergencia.ListarAtenciones();
                        ReposicionarVista();
                    }
                }, function (dimiss) {
                    AdmisionEmergencia.ListarAtenciones();
                    ReposicionarVista();
                });

                return false;
            }
        }

        return true;
    },

}


$(document).ready(() => {

    NotaIngreso.Plugins()

    NotaIngreso.TiposServicio()

    //NotaIngreso.InitDatables()

    NotaIngreso.Events()

    ConsumoServicio.IniciarScript()
})


function asigna_FechaHoraAtencion(f) {
    //('#cboFechaInicioAtencion').empty();
    // cargo por defecto la hora
    var dt = new Date();
    var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes());
    //var date = ((dt.getDay() + 1) < 10 ? ("0" + (dt.getDay() + 1)) : (dt.getDay() + 1)) + "/" + ((dt.getMonth() + 1) < 10 ? ("0" + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) + "/" + dt.getFullYear();

    if (f == null) {
        var fecha = new Date();
        var fecha2 = new Date();
    } else {
        var fecha = new Date(f);
        var fecha2 = new Date(f);
    }


    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#HoraInicioAtencion').val(time);
    $('#FechaInicioAtencion').val(fechaP);
    $('#FechaInicioAtencion').attr("max", fechaP);

    //$('#cboFechaInicioAtencion').append('<option  value="' + fechaP + '">' + fechaP + '</option>');


    fecha2.setDate(fecha.getDate() - 1);
    dia = fecha2.getDate();
    mes = parseInt(fecha2.getMonth()) + 1;
    yyy = fecha2.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#FechaInicioAtencion').attr("min", fechaP);
}