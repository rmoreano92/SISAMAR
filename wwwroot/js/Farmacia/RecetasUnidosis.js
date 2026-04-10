var RecetaUnidosis = {
    accion: '',
    idRecetaSelect: '',
    idTipoServicio: 0,
    idServicio: 0,
    idServicioSelect: 0,
    idMedicoSelect: 0,
    idFarmacia: 0,
    idCuentaAtencion: 0,

    async IniciarScript() {
        RecetaUnidosis.CargaInicial();
        RecetaUnidosis.plugins();
        RecetaUnidosis.initDatablesRecetaGeneral();
        RecetaUnidosis.initDatablesFarmacia();
        RecetaUnidosis.eventos();
        //listaServicios();
        //listaMedicos();
        //await RecetaUnidosis.IniciarData();cboFarmacia

        //RecetaUnidosis.IniciarScript();
        //await RecetaUnidosis.IniciarData();
        await RecetaUnidosis.listaServicios();
        await RecetaUnidosis.listaMedicos();
        await RecetaUnidosis.listaFarmacias();
        await RecetaUnidosis.ListarDosis();
        await RecetaUnidosis.ListarVias();

        VisorReceta.Eventos();      //KHOYOSI

    },

    //async IniciarData() {
    //    await RecetaUnidosis.listaServicios();

    //    const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        
    //    if (!isEmpty(permisosGenerales)) {
    //        permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
    //    }
    //},

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaVigencia').datepicker({
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
        $("#txtFechaVigencia").mask("Dd/Mm/abcd");
    },

    CargaInicial() {
        $('#txtFechaVigencia').val(RecetaUnidosis.fechaDiaActualMasdias());
    },


    //async SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {
    //    var respuesta;
    //    var resp = false;
    //    let datos;
    //    var data = new FormData();

    //    oTable_DiagnosticosInterconsulta.fnClearTable()

    //    data.append('idAtencion', idAtencion);
    //    data.append('clasificacionDiagnostico', clasiDiagnostico);

    //    try {
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        if (datos.table.length !== 0) {
    //            if (!isEmpty(datos.table)) {
    //                oTable_DiagnosticosInterconsulta.fnAddData(datos.table); // VERIFICANDO JDELGADOM
    //            }
    //        }
    //        //else {
    //        //    Cargando(0)
    //        //}
    //        resp = true;
    //    } catch (error) {
    //        //console.error(error)
    //        resp = false;
    //        alerta(3, error);
    //    }

    //    //return datos;
    //    return resp;
    //}, // SE AÑADE PARA INTERCONSULTAS JDELGADOM

    eventos() {
        $('.searchReceta').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscar").click();
            }
        });

        $('.searchCuentaReceta').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                //listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
                $("#txtNroCuentaRegistro").blur();
                //$("#cboProductoServicio").focus();
            }
        });

        $("#txtNroCuentaRegistro").on('blur', async function () {
            await RecetaUnidosis.listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);

            //await RecetaUnidosis.SeleccionarDiagnosticos(Variables.IdAtencion, 1); // AGREGAR PARA INTERCONSULTA JDELGADOM

            $("#cboProductoServicio").focus();
        });

        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });

        $('#cboProcedencia').change(async function () {
            $('#hdIdServicioPaciente').val($('#cboProcedencia').val());
            RecetaUnidosis.idServicioSelect = $('#cboProcedencia').val();
            //await RecetaUnidosis.ListarCatalogoTotal();
        });

        $('#cboMedicoReceta').change(async function () {
            RecetaUnidosis.idMedicoSelect = $('#cboMedicoReceta').val();
        });

        $("#cboFarmacia").on("change", function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idFarmacia', $("#cboFarmacia").val());
            $.ajax({
                method: "POST",
                url: "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0);
                    $('#cboMedicamento').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboMedicamento').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');


                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");

                },
                error: function (msg) {
                    Cargando(0);
                    setTimeout(function () {
                        //                    Cargando(0);
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }, 900)
                }
            });

        })

        $('#btnImprimeRecetas').on('click', async function () {
            var objrow = oTable_RecetaUnidosis.api(true).row('.selected').data();
            //console.log(objrow)
            const recetas = await RecetaUnidosis.SeleccionarRecetasCabeceraPorIdReceta(objrow.idReceta, $('#hdIdTipoFuenteFian').val(), objrow.idServicioReceta, objrow.idMedicoReceta);
            VisorReceta.AbrirVisorRecetas(recetas);
        });

        $('#btnEliminar').on('click', function () {
            var objrow = oTable_RecetaUnidosis.api(true).row('.selected').data();
            if (objrow.idEstado == 1) {
                swal({
                    title: 'Eliminar',
                    text: 'Estas seguro de eliminar la receta?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                }).then(function () {

                    RecetaUnidosis.eliminar(objrow.idReceta)
                    //ListaRecetas();
                    RecetaUnidosis.ListaRecetasV2();   //KHOYOSI
                }, function (dimiss) { });
            }
            else {
                if (objrow.idEstado == 2 && objrow.movimiento != "") {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, ya se encuentra despachada. <br><span class="font-weight-bold">Movim: ' + objrow.movimiento + '</span>');
                } else if (objrow.idEstado == 3 && objrow.boleta != "") {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, ya se encuentra con boleta. <br><span class="font-weight-bold">Boleta: ' + objrow.boleta + '</span>');
                } else {
                    alerta2('warning', '', 'Esta receta no se puede eliminar, verifique el estado');
                }
                return false;
            }
        });

        $('#btnLimpiarCS').on('click', function () {
            Cargando(1);
            $('#txtNroReceta').val("");
            $("#txtNroCuenta").val("");
            $("#txtNroDni").val("");
            $("#txtNroHistoria").val("");
            $("#txtApPaterno").val("");
            $("#txtApMaterno").val("");
            Cargando(0);
        });

        $('#btnBuscar').on('click', function () {
            //ListaRecetas();
            RecetaUnidosis.ListaRecetasV2();   //KHOYOSI
        });

        $('#btnAgregar').on('click', async function () {
            RecetaUnidosis.accion = 'A';
            oTable_RecetaUnidosis.$('tr.selected').removeClass('selected');
            $('#txtNroCuentaRegistro').attr('disabled', false)
            RecetaUnidosis.limpiar();
            //RecetaUnidosis.LimpiarOrdenesMedicas();           

            await RecetaUnidosis.GeneraPreUnidosisEnFormaAutomatica();
            await RecetaUnidosis.ListarProductosUnidosisTodos();
            RecetaUnidosis.DesbloquearRegistro();
            //$(".OpcionesOrdenes").hide();          //KHOYOSI
            $('#modalReceta').modal('show');
            
            
        });

        $('#btnConsultar').on('click', async function () {
            RecetaUnidosis.limpiar();
            RecetaUnidosis.accion = "C";
            $('#txtNroCuentaRegistro').attr('disabled', false)
            //RecetaUnidosis.LimpiarOrdenesMedicas();
            await RecetaUnidosis.ListarProductosUnidosisTodos();
            //$(".OpcionesOrdenes").hide();          //KHOYOSI
            RecetaUnidosis.BloquearRegistro();
            await RecetaUnidosis.cargaDatosReceta()
            
        });
        //$("#txtNroCuentaRegistro").on('change', function () {

        //    listaPorCuenta($("#txtNroCuentaRegistro").val(), 1);
        //    $("#cboProductoServicio").focus();

        //})
        
        $('#btnModificar').on('click', async function () {
            var objrow = oTable_RecetaUnidosis.api(true).row('.selected').data();
            RecetaUnidosis.limpiar();
            RecetaUnidosis.accion = 'M';
            
            if (objrow.idEstado == 1) {
                
                //RecetaUnidosis.limpiarCatalogo();
                //RecetaUnidosis.LimpiarOrdenesMedicas();
                await RecetaUnidosis.ListarProductosUnidosisTodos();
                RecetaUnidosis.DesbloquearRegistro();
                await RecetaUnidosis.cargaDatosReceta();              
                //$(".OpcionesOrdenes").show();          //KHOYOSI
                
            } else {
                RecetaUnidosis.DesbloquearRegistro();
                if (objrow.idEstado == 2 && objrow.movimiento != "") {
                    alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra despachada. <br><span class="font-weight-bold">Movim: ' + objrow.movimiento + '</span>');
                } else if (objrow.idEstado == 3 && objrow.boleta != "") {
                    alerta2('warning', '', 'Esta receta no se puede modificar, ya se encuentra con boleta. <br><span class="font-weight-bold">Boleta: ' + objrow.boleta + '</span>');
                } else {
                    alerta2('warning', '', 'Esta receta no se puede modificar, verifique el estado');
                }
                return false;
            }
            

        });

        $('#tblRecetaGeneral tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_RecetaUnidosis.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#btnguardar').on('click', async function () {
            let valido = RecetaUnidosis.ValidarDatosObligatorios();

            if (valido == false) {
                return true;
            }

            const datarec = await RecetaUnidosis.Guardar();
            console.log(datarec);
            if (datarec.length > 0) {

                if (RecetaUnidosis.accion == 'A') {
                    //const recetas = await RecetaUnidosis.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, $('#hdIdTipoFuenteFian').val(), RecetaUnidosis.idServicioSelect, RecetaUnidosis.idMedicoSelect);
                    VisorReceta.AbrirVisorRecetas(datarec);
                } else if (RecetaUnidosis.accion == 'M') {
                    //const recetas = await RecetaUnidosis.SeleccionarRecetasCabeceraPorIdReceta(RecetaUnidosis.idRecetaSelect, $('#hdIdTipoFuenteFian').val(), RecetaUnidosis.idServicioSelect, RecetaUnidosis.idMedicoSelect);
                    VisorReceta.AbrirVisorRecetas(datarec);
                } else {
                    const recetas = null;
                    VisorReceta.AbrirVisorRecetas(recetas);
                }

                //RecetaUnidosis.LimpiarOrdenesMedicas();
                Variables.Limpiar();
                RecetaUnidosis.limpiar();

                
                RecetaUnidosis.BuscarRecetas();   //KHOYOSI
                $('#modalReceta').modal('hide');
               

            }
            
        });

        $('#btnCerrarRecetasGeneral').on('click', async function () {
            RecetaUnidosis.limpiar();
            //RecetaUnidosis.activaTabs();
            //RecetaUnidosis.limpiarCatalogo();
            RecetaUnidosis.LimpiarOrdenesMedicas();
            $('#modalReceta').modal('hide');
        });

    },

    initDatablesRecetaGeneral() {
        var parms = {
            "order": [[7, "desc"]],
            destroy: true,
            responsive: true,
            bFilter: false,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    data: "fechaReceta",
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
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }

                }
                ,
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }

                }
                ,
                {
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "desptCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "descEstado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstado == 0) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstado == 3) {
                            $(td).parent().css('color', '#ff9933');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                }
            ]

        }

        var tableWrapper = $('#tblRecetaGeneral'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RecetaUnidosis = $("#tblRecetaGeneral").dataTable(parms);
    },

    initDatablesFarmacia() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '35vh',
            autoWidth: false,
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
                    width: '75%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idProductoConPunto + '" value="0" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCant">'
                        $(td).html(inputCantidad);
                    }
                },               
            ]
        }
        var tableWrapper = $('#tblCatalogoFarmacia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmacia = $("#tblCatalogoFarmacia").dataTable(parms);
        $('#tblCatalogoFarmacia_length').css('display', 'none');
    },


    AtencionesEstanciaHospitalariaPorIdCuenta(idCuenta) {
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

    async listaPorCuenta(nroCuenta, permiso) {
        //Cargando(1);
        let datos;
        let resp = false;
        flagEstadoCuenta = false
        var midata = new FormData();
        midata.append('idCuenta', nroCuenta);
        var sigue = true;

        $(".OpcionesOrdenes").hide();          //KHOYOSI
        $('#btnguardar').hide();

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionEstadosCompletosByIdCuenta?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.table.length !== 0) {
                Variables.Cargar(datos.table[0]);

                //$('#btnguardar').css("visibility", 'visible');
                
                $("#txtDesPlan").val("IAFA Act: " + datos.table[0].dFuenteFinanciamiento);
                $("#txtPacienteRegistro").val(datos.table[0].apellidoPaterno + " " + datos.table[0].apellidoMaterno + " " + datos.table[0].primerNombre);

                if (datos.table[0].idEstado != 1) {
                    //alerta(3, "El estado de Cuenta no se encuentra ABIERTO");
                    var msj = ''
                    if (datos.table[0].idEstado == 5 || datos.table[0].idEstado == 11 || datos.table[0].idEstado == 13) {
                        msj = 'La cuenta se encuentra CERRADA.';
                    }
                    if (datos.table[0].idEstado == 4) {
                        msj = 'La cuenta se encuentra en estado PAGADA.';
                    }
                    if (datos.table[0].idEstado == 9) {
                        msj = 'La cuenta se encuentra ANULADA.';
                    }
                    if (datos.table[0].idEstado == 10) {
                        msj = 'La cuenta se encuentra en ALTA MÉDICA.';
                    }
                    if (datos.table[0].idEstado == 12) {
                        msj = 'El paciente esta pendiente de recepcionar en el servicio.';
                    }

                    swal({
                        title: 'Alerta',
                        html: "<h4><b>" + msj + "<b></h4>",
                        type: 'warning',
                    }).done();

                    //$('#btnguardar').css("visibility", 'hidden');
                    $('#btnguardar').hide();
                    flagEstadoCuenta = true;
                    $(".OpcionesOrdenes").hide();           //KHOYOSI
                    $(".dCant").attr("disabled", true);

                    return false;

                } else {
                    $('#btnguardar').show();
                    $(".dCant").removeAttr("disabled");
                }



                let idServicio = (datos.table[0].idServicioEgreso === null ? 0 : datos.table[0].idServicioEgreso);
                //alert(idServicio);
                $("#cboProcedencia").val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio);
                $('#hdIdServicioPaciente').val(idServicio == 0 ? datos.table[0].idServicioIngreso : idServicio)
                $('#hdIdTipoFuenteFian').val(datos.table[0].idFormaPago)
                $('#hdIdPaciente').val(datos.table[0].idPaciente);
                $('#hdIdCuentaAtencion').val(datos.table[0].idCuentaAtencion);
                $('#hdNroEvaluacion').val(0);
                RecetaUnidosis.idCuentaAtencion = datos.table[0].idCuentaAtencion;

                if (permiso == 1) {
                    //$('#cboMedico').val(datos.table[0].idMedicoIngreso);
                    $('#cboMedicoReceta').val(datos.table[0].idMedicoIngreso);
                    //RecetaUnidosis.ubicaMedico(RecetaUnidosis.ObtenerIdMedicoSesion());
                }

                let fechaRegistro = await Utilitario.FechaHoraServidor();
                $("#txtFechaVigencia").datepicker("setDate", fechaRegistro)
                               
                $('#cboFarmacia').change();

                $(".OpcionesOrdenes").show();          //KHOYOSI
                                              

                if (permiso == 3) {
                    $('#btnguardar').css("visibility", 'hidden');
                    $(".OpcionesOrdenes").hide();          //KHOYOSI
                    flagEstadoCuenta = true
                }

                resp = true;
            }

        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;

    },

    fechaDiaActualMasdias() {
        var fecha = new Date();
        // Número de días a agregar
        fecha.setDate(fecha.getDate() + 7);
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();

        fechaP = dia + "/" + mes + "/" + yyy

        return fechaP;
    },

    async ListaRecetas() {
        Cargando(1)
        oTable_RecetaUnidosis.fnClearTable();
        var midata = new FormData();
        midata.append('nroReceta', $("#txtNroReceta").val());
        midata.append('nroCuenta', $("#txtNroCuenta").val());
        midata.append('nroDni', $("#txtNroDni").val());
        midata.append('nroHistoria', $("#txtNroHistoria").val());
        midata.append('apellidoPaterno', $("#txtApPaterno").val());
        midata.append('apellidoMaterno', $("#txtApMaterno").val());
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        var sigue = true;
        $.ajax({
            method: "POST",
            url: "/Receta/ListarRecetas?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.listaRecetas.table.length > 0) {
                        oTable_RecetaUnidosis.fnAddData(datos.listaRecetas.table);
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

    async ListaRecetasV2() {
        const data1 = await RecetaUnidosis.BuscarRecetas();
    },

    async BuscarRecetas() {
        Cargando(1);
        //console.log("ListaRecetasV2");
        oTable_RecetaUnidosis.fnClearTable();
        var midata = new FormData();
        midata.append('nroReceta', $("#txtNroReceta").val());
        midata.append('nroCuenta', $("#txtNroCuenta").val());
        midata.append('nroDni', $("#txtNroDni").val());
        midata.append('nroHistoria', $("#txtNroHistoria").val());
        midata.append('apellidoPaterno', $("#txtApPaterno").val());
        midata.append('apellidoMaterno', $("#txtApMaterno").val());
        //midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        var sigue = true;
        var respuesta;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Unidosis/ListarRecetas?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                Cargando(0)
                if (datos.listaRecetas.table.length > 0) {
                    oTable_RecetaUnidosis.fnAddData(datos.listaRecetas.table);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    async listaServicios() {

        var midata = new FormData();
        midata.append('idTipoServicio', 3);

        $.ajax({
            //async: false,
            //cache: false,
            //url: "/Servicios/ListaServiciobyTipoServicio?area=Comun",
            //datatype: "json",
            //data: midata,
            //type: "post",
            url: "/Servicios/ListaServiciobyTipoServicio?area=Comun",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboProcedencia').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedencia').append('<option  value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });
                $('#cboProcedencia').val("");
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

    listaMedicos() {
        $.ajax({
            method: "POST",
            url: "/Receta/ListaMedicos?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMedicoReceta').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMedicoReceta').append('<option  value="' + obj.idMedico + '">' + obj.dmedico + '</option>');
                });
                $('#cboMedicoReceta').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar farmacias!", "2");
                }, 900)
            }
        });
    },

    async listaFarmacias() {
        var formData = new FormData();
        formData.append("filtro", "esUnidosis=1 and idTipoLocales='F' and idTipoSuministro='01' and idEstado=1");

        $.ajax({
            method: "POST",
            url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboFarmacia').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboFarmacia').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar farmacias!", "2");
                }, 900)
            }
        });
    },
    //RQ0003 RMOREANO 
    async ListarDosis() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Receta/ListarDosis?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboDosis').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDosis').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar las dosis!", "2");
                }, 900)
            }
        });
    },

    async ListarVias() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Receta/ListarViasAdministracion?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboVia').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboVia').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar las vias de administración!", "2");
                }, 900)
            }
        });
    },

    async ListarProductosUnidosisTodos() {
       
        let resp = false;
        let datos
        let data = new FormData();
        
        try {
            oTable_farmacia.fnClearTable();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Unidosis/ListarProductosUnidosisTodos?area=Unidosis",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_farmacia.fnAddData(datos.respuesta.table);
                oTable_farmacia.resize();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

    },

    async GeneraPreUnidosisEnFormaAutomatica() {

        let resp = false;
        let datos
        let data = new FormData();

        try {
            $("#txtNroPreUnidosis").val("");
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Unidosis/GeneraPreUnidosisEnFormaAutomatica?area=Unidosis",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                $("#txtNroPreUnidosis").val(datos.respuesta.table[0].nroPreUnidosis);
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

    },

    
    async Guardar() {
        let formData = new FormData();
        let datos;
        let resp = [];
        
        let ListaRecetaDetalleFarmacia = RecetaUnidosis.DevolverRecetaDetalle(5);

        formData.append('idReceta', RecetaUnidosis.idRecetaSelect); 
        formData.append('idCuentaAtencion', RecetaUnidosis.idCuentaAtencion);
        formData.append('idServicioReceta', $('#cboProcedencia').val());
        formData.append('idMedico', $('#cboMedicoReceta').val());
        formData.append('fechaVigencia', ConvertirFormatoFecha($('#txtFechaVigencia').val()));
        formData.append('nroPreUnidosis', $('#txtNroPreUnidosis').val());

        //farmacia
        formData.append('lstRecetaFarmacia', ListaRecetaDetalleFarmacia);        
        
        //formData.append('idMedico', $('#cboMedico').val());
        
        
        //formData.append('idServicioReceta', $('#cboProcedencia').val());
        
        //formData.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        //formData.append('nroEvaluacion', $('#hdNroEvaluacion').val());

        //formData.append('lstDiagnosticosPre', JSON.stringify(ObjtableDiagnosticosSolicitudCQx.api(true).data().toArray()));

        //alerta(4, 'Generando recetas, por favor espere.');
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Unidosis/RegistraRecetas?area=Unidosis",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.rpt) {
                    if (datos.msjReceta != "") {
                        //console.log(datos.objRecetas);
                        var objRecetas = datos.objRecetas;
                        var recetas = [
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmacia, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 5)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 5).code },
                        ]
                        //VisorReceta.AbrirVisorRecetas(recetas);

                        resp = recetas;

                        swal({
                            title: 'Recetas',
                            text: datos.msjReceta,
                            type: 'info',
                        }).done();


                    }

                    //alerta2('success', '', 'Se registro correctamente la receta.');
                    return resp;
                }
                else {
                    alerta2('error', '', datos.msjReceta);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async eliminar(idReceta) {
        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Receta/EliminaReceta?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {

                    if (datos.rpt) {
                        alerta2("success", "", "Se elimino correctamente la receta");
                    }
                    else {
                        alerta2("warning", "", datos.msj);
                        return false;
                    }
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0);
                alerta2("danger", "", "Error al eliminar receta");
            }
        });

    },

    ValidarDatosObligatorios() {

        if ($('#txtNroCuentaRegistro').val() == "" || RecetaUnidosis.idCuentaAtencion == 0) {
            alerta2('info', '', 'Ingrese un Nro. de cuenta.');
            return false
        }

        if (isEmpty($('#cboProcedencia').val())) {
            alerta2('info', '', 'Seleccione el servicio.');
            return false
        }

        if (isEmpty($('#cboMedicoReceta').val())) {
            alerta2('info', '', 'Seleccione el médico.');
            return false
        }

        if (isEmpty($('#cboFarmacia').val())) {
            alerta2('info', '', 'Seleccione la farmacia.');
            return false
        }

        if (isEmpty($('#txtFechaVigencia').val()) || esFormatoFecha($('#txtFechaVigencia').val()) == false) {
            alerta2('info', '', 'Ingrese una fecha de vigencia válida.');
            return false
        }
        
        let ListaRecetaDetalleFarmacia = RecetaUnidosis.DevolverRecetaDetalle();
        if (ListaRecetaDetalleFarmacia == "[]") {
            alerta2('warning', '', 'No existe ningún item para registrar en la receta.');
            return false;
        }

        return true;
    },

    DevolverRecetaDetalle() {
        let lstRecetadetalle = []
        let html = "";
        html += '[';

        let index = 0;
        lstFarmacia = oTable_farmacia.api(true).rows().data().toArray();
        lstFarmacia.forEach(async function (obj) {
            let cant = parseInt($("#txtCant_" + obj.idProductoConPunto).val());            //KHOYOSI
            if (cant > 0) {
                index = index + 1;
                html += '{"idItem":"' + parseInt(obj.idProductoConPunto) + '","cantidadPedida":"' + cant + '","precio":"' + parseFloat(obj.precioUnitario).toFixed(2) + '","total":"' + parseFloat(obj.precioUnitario * cant).toFixed(2) + '","idDosisRecetada":"0","idViaAdministracion":null,"observaciones":null,"dx":null},';       //KHOYOSI
            }

            //console.log(obj)
        });
        
        html += ']';
        let htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },

    limpiar() {
        $('#txtNroCuentaRegistro').val("");
        $("#txtDesPlan").val("");
        $("#txtPacienteRegistro").val("");
        $("#cboProcedencia").val("");
        $('#hdIdServicioPaciente').val("");
        $('#hdIdTipoFuenteFian').val("");
        $('#hdIdPaciente').val("");
        $('#hdIdCuentaAtencion').val("");
        $('#hdNroEvaluacion').val("");

        //$(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
        //$(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
        //$('#txtResumenHistoriaClinica').val('')
        //$('#txtMotivoInterconsulta').val('')

        $("#cboProcedencia").val("");
        $("#cboMedicoReceta").val("");
        $("#txtFechaVigencia").val("");
        $("#txtNroPreUnidosis").val("");
        oTable_farmacia.fnClearTable();

        //RecetaUnidosis.hdIdServicio = 0;
        //RecetaUnidosis.hdNroEvaluacion = 0;

        RecetaUnidosis.idRecetaSelect = 0;
        RecetaUnidosis.idServicioSelect = 0;
        RecetaUnidosis.idMedicoSelect = 0;
        RecetaUnidosis.idCuentaAtencion = 0;

        $('#btnguardar').css("visibility", 'visible');
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    LimpiarOrdenesMedicas() {
        oTable_farmacia.fnClearTable();

        //$('#txtCAntidadFarmacia').val(1);
        
        //$('#hdIdRecetaFarmacia').val(0)
        //$('#lblFarmacia').html(0)
        
                
        //$('#btnAgregaFarmacia').css("visibility", 'visible');
        //$('#btnQuitarFarmacia').css("visibility", 'visible');
        
        //$(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
        //$(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
        //$('#txtResumenHistoriaClinica').val('')
        
        //Ordenes.listaFecha();
    },




    async cargaDatosReceta() {
        let datos;
        let resp = false;
        var objrow = oTable_RecetaUnidosis.api(true).row('.selected').data();
        var midata = new FormData();


        if (isEmpty(objrow)) {
            alerta2("info", "", "Seleccione un registro");
            return false;
        }

        midata.append('idReceta', objrow.idReceta);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Unidosis/SeleccionarRecetaCabecera?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //RecetaUnidosis.limpiar();
            let receta = datos.lstReceta.table[0];
            if (datos.session) {
                $('#txtNroCuentaRegistro').attr('disabled', true)

                $("#txtNroCuentaRegistro").val(receta.idCuentaAtencion);
                $("#txtPacienteRegistro").val(receta.paciente);
                $("#txtDesPlan").val("IAFA Act: " + receta.dFuenteFinanciamiento);
                $("#cboProcedencia").val(receta.idServicioReceta);
                $('#cboMedicoReceta').val(receta.idMedicoReceta);
                //$('#cboFarmacia').val(receta.idServicioReceta);
                $("#txtFechaVigencia").datepicker("setDate", FormatearFecha(receta.fechaVigencia))
                $("#txtNroPreUnidosis").val(receta.preUnidosis);
                $('.chzn-select').chosen().trigger("chosen:updated");
                
                //RecetaUnidosis.limpiarCatalogo();
                //RecetaUnidosis.LimpiarOrdenesMedicas();
                
                await RecetaUnidosis.SeleccionarRecetaDetalle(receta.idReceta, 5);
                RecetaUnidosis.idRecetaSelect = receta.idReceta;
                RecetaUnidosis.idServicioSelect = receta.idServicioReceta;
                RecetaUnidosis.idMedicoSelect = receta.idMedicoReceta;
                RecetaUnidosis.idCuentaAtencion = receta.idCuentaAtencion;

                $('#modalReceta').modal('show');

                resp = true;

            } else {
                Cargando(0);
                location.reload();
            }

        } catch (error) {
            //console.error(error)            
            Cargando(0);
            alerta(3, error);
        }

        return resp;

    },

    async SeleccionarRecetaDetalle(idReceta, idPuntoCarga) {
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idReceta', idReceta);
        data.append('idPuntoCarga', idPuntoCarga);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetaDetalle?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                $(datos.table).each(function (i, obj) {
                    $("#txtCant_" + obj.idItem).val(obj.cantidadPedida);                    
                });
            }
            
            resp = true;
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },

    BloquearRegistro() {
        $(".searchCuentaReceta").attr("disabled", true);
        $(".campo").attr("disabled", true);
        $(".dCant").attr("disabled", true);
        $('#btnguardar').hide();
    },

    DesbloquearRegistro() {
        $(".searchCuentaReceta").removeAttr("disabled", true);
        if (RecetaUnidosis.accion == "M") {
            $(".searchCuentaReceta").attr("disabled", true);
        }
        
        $(".campo").removeAttr("disabled", true);
        $(".dCant").removeAttr("disabled", true);
        $('#btnguardar').show();
    }

}
