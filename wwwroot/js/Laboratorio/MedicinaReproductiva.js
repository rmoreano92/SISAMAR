var MedRepro = {
    IdMedicinaReproductiva: 0,
    IdOrden: 0,
    IdProducto: 0,
    idCuentaAtencion: 0,
    IdAtencion: 0,
    IdCuentaAtencion: 0,
    IdMedReproMacroscopica: 0,
    IdMedReproMicroscopica: 0,
    registro: null,

    Iniciar() {
        MedRepro.DataTableBusqueda();
        MedRepro.Eventos();
        //MedRepro.LLenarCombos();

        MedRepro.Plugins();


        //$("#txtPreTotalMovilidad").attr("disabled", true);
    },

    Plugins() {
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia ='0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes ='0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $("#txtFechaIngresoIniBusq, #txtFechaIngresoFinBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] ='[0123]';
        $.mask.definitions['d'] ='[123456789]';
        $.mask.definitions['M'] ='[01]';
        $.mask.definitions['m'] ='[0123456789]';
        $.mask.definitions['a'] ='[12]';
        $.mask.definitions['b'] ='[0123456789]';
        $.mask.definitions['c'] ='[0123456789]';
        $.mask.definitions['d'] ='[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");
        

        $.mask.definitions['H'] ='[012]';
        $.mask.definitions['N'] ='[012345]';
        $.mask.definitions['n'] ='[0123456789]';
        $(".maskHora").mask("Hn:Nn");
        
        $(".chzn-select").chosen({ allow_single_deselect: true });
    },

    IniciarModulo() {
        $(".maskFecha").mask("Dd/Mm/abcd");
        $(".maskHora").mask("Hn:Nn");
    },

    Eventos() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let tabId = $(e.target).attr('id');
            //console.log(tabId);
            if (tabId === 'TabBusqueda') { 
                oTable_MedicinaReproductiva.resize();
            }
        });

        $('#btnBuscar').on('click', async function () {
            await MedRepro.ListarMedicinaReproductiva();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', async function () {
            await MedRepro.LimpiarCamposBusqueda();
        });

        $('#tblMedicinaReproductiva tbody').on('click','tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_MedicinaReproductiva.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', function () {
            MedRepro.LimpiarCamposRegistro();
            //MedRepro.DeshabilitarRegistro();
            MostrarAreaRegistro();
        });

        $('#btnModificar').on('click', async function () {            
            let objrowTb = oTable_MedicinaReproductiva.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            //if (objrowTb.idEstadoAtencion != 1) {
            //    alerta2("info", "", "El estado de la cuenta NO se ecuentra ABIERTA.");
            //    return false;
            //}

            if (objrowTb.esPagante == "Si") {
                if (isEmpty(objrowTb.idComprobantePago)) {
                    alerta2("info", "", "La orden de pago <span class='font-weight-bold'>Nº " + objrowTb.idOrdenPago + "</span> aún no ha sido pagada.");
                    return false;
                }
            }

            MedRepro.LimpiarCamposRegistro();
            const resp = await MedRepro.SeleccionarMedicinaReproductiva(objrowTb);
            if (resp) {
                MedRepro.DesbloquearRegistro();                
                MostrarAreaRegistro();
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_MedicinaReproductiva.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            if (objrowTb.idEstadoAtencion != 1) {
                alerta2("info", "", "La estado de la cuenta NO se ecuentra ABIERTA.");
            }

            if (objrowTb.esPagante == "Si") {
                if (isEmpty(objrowTb.idComprobantePago)) {
                    alerta2("info", "", "La orden de pago <span class='font-weight-bold'>Nº " + objrowTb.idOrdenPago + "</span> aún no ha sido pagada.");
                    return false;
                }
            }

            if (objrowTb.estado == 0) {
                alerta2("info", "", "No existen resultados para consultar.");
                return false;
            }

            MedRepro.LimpiarCamposRegistro();
            const resp = await MedRepro.SeleccionarMedicinaReproductiva(objrowTb);
            if (resp) {
                MedRepro.BloquearRegistro();
                MostrarAreaRegistro();
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_MedicinaReproductiva.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            if (objrowTb.idEstadoAtencion != 1) {
                alerta2("info", "", "La estado de la cuenta NO se ecuentra ABIERTA.");
                return false;
            }

            if (objrowTb.esPagante == "Si") {
                if (isEmpty(objrowTb.idComprobantePago)) {
                    alerta2("info", "", "La orden de pago <span class='font-weight-bold'>Nº " + objrowTb.idOrdenPago + "</span> aún no ha sido pagada.");
                    return false;
                }
            }

            if (objrowTb.estado == 0) {
                alerta2("info", "", "No existen resultados para eliminar.");
                return false;
            }

            MedRepro.LimpiarCamposRegistro();
            const resp = await MedRepro.SeleccionarMedicinaReproductiva(objrowTb);
            if (resp) {
                MedRepro.BloquearRegistro();
                $("#btnEliminarMedicinaReproductiva").show();
                MostrarAreaRegistro();
            }            
        });

        $(document).on("click", "#btnGuardarMedicinaReproductiva", function () {
            if (isEmpty($("#txtCodigoEspe").val())) {
                alerta2("info", "", "Por favor registre el CODIGO ESPE");
                return;
            }

            if (isEmpty($("#cboProfesionalBiologo").val())) {
                alerta2("info", "", "Por favor seleccione el Profesional Biologo.");
                return;
            }

            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                const resp = await MedRepro.ModificarMedicinaReproductiva();
                if (resp) {                    
                    $("#ModuloMedicinaReprodutiva").html("");                    
                    MedRepro.ListarMedicinaReproductiva();
                    alerta2("success", "", "El registro se guardó correctamente.");
                    MostrarAreaLista();
                }       
            }, function (dimiss) {

            });
                      
        });

        $(document).on("click", "#btnCancelarMedicinaReproductiva", async function () {
            swal({
                title: 'Salir',
                text: "¿Esta seguro de salir?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {
                $("#ModuloMedicinaReprodutiva").html("");
                MostrarAreaLista();
            }, function (dimiss) {

            });
        });

        $(document).on("click", "#btnEliminarMedicinaReproductiva", function () {
            swal({
                title: 'Eliminar',
                text: "¿Esta seguro de eliminar el registro?",
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                const resp = await MedRepro.EliminarMedicinaReproductiva();
                if (resp) {
                    $("#ModuloMedicinaReprodutiva").html("");
                    MedRepro.ListarMedicinaReproductiva();
                    alerta2("success", "", "El registro se eliminó correctamente.");
                    MostrarAreaLista();
                }  
            }, function (dimiss) {

            });
        });

        $(document).on("click", "input[name='EvalMacroColor']", function (e) {
            let tabId = $(e.target).attr('id');
            //console.log(tabId);
            if (tabId === 'EvalMacroColorOpt9') {
                $("#txtEvalMacroColorOpt9").removeAttr("disabled");
            } else {
                $("#txtEvalMacroColorOpt9").val("");
                $("#txtEvalMacroColorOpt9").attr("disabled", true);
            }
        });

        $(document).on("change", "#cboLugarObtencion", function (e) {
            let lugar = $('#cboLugarObtencion').val();
            if (lugar == 9) {
                $("#txtLugarObtencion").removeAttr("disabled");
            } else {
                $("#txtLugarObtencion").val("");
                $("#txtLugarObtencion").attr("disabled", true);
            }
        });

        $(document).on("change", "#cboMetodoObtencion", function (e) {
            let lugar = $('#cboMetodoObtencion').val();
            if (lugar == 9) {
                $("#txtMetodoObtencion").removeAttr("disabled");
            } else {
                $("#txtMetodoObtencion").val("");
                $("#txtMetodoObtencion").attr("disabled", true);
            }
        });
        
        $(document).on("keyup", ".volumen", function (e) {
            MedRepro.Volumen_Change();
        });

        $(document).on("keyup", ".movilidad", function (e) {
            MedRepro.Movilidad_Change();
        });

        $(document).on("keyup", ".vitalidad", function (e) {
            MedRepro.Vitalidad_Change();
        });

        $(document).on("keyup", ".concentracion", function (e) {
            MedRepro.Concentracion_Change();
        });

        $(document).on("keyup", ".morfologia", function (e) {
            MedRepro.Morfologia_Change();
        });

        $(document).on("keyup", ".examenDirecto", function (e) {
            MedRepro.ExamenDirecto_Change();
        });

        $(document).on("keyup", ".preProgresiva", function (e) {
            MedRepro.PreProgresiva_Change();
        });

        $(document).on("keyup", ".preNumero", function (e) {
            MedRepro.PreNumero_Change();
        });
                        
        $(document).on("keyup", ".postProgresiva", function (e) {
            MedRepro.PostProgresiva_Change();
            MedRepro.PostRem_Change();
        });

        $(document).on("keyup", ".postNumero", function (e) {
            MedRepro.PostNumero_Change();
            MedRepro.PostMillTotal_Change();
            MedRepro.PostRem_Change();
        });

        $(document).on("keyup", ".postMill", function (e) {
            MedRepro.PostMillTotal_Change();
            MedRepro.PostRem_Change();
        });

        /////////////////////////////FIRMA DIGITAL INFORME RESUTLADO//////////////////////////////////////
        $('#tblMedicinaReproductiva tbody').on('click', '.ImprimirResultadoSF', async function () {
            var objrow = oTable_MedicinaReproductiva.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_MedicinaReproductiva.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblMedicinaReproductiva tbody').on('click', '.ImprimirResultadoCF', async function () {
            var objrow = oTable_MedicinaReproductiva.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_MedicinaReproductiva.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });

        $('#tblMedicinaReproductiva tbody').on('click', '.FirmarResultadoSF', async function () {
            var objrow = oTable_MedicinaReproductiva.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_MedicinaReproductiva.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'MED-REPRO';
                Cargando(1);
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
                if (firma) {
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                    //await Utilitario.IniciarServicioFirmaBit4Id(row.code);
                }
                Cargando(0);
            }
            Cargando(0);
        });

        $('#btnFirmaLote').on('click', async function () {
            let listOrdenes = oTable_MedicinaReproductiva.api(true).data();
            let numOrdenes = [];

            Cargando(1)
            $(listOrdenes).each(async (i, obj) => {
                if (obj.estado == 1 && obj.code != '') {
                    numOrdenes.push(obj.idOrden);
                }
            })

            Utilitario.TipoArchivoFirmar = 'MED-REPRO';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos('', numOrdenes, "'MED-REPRO'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numOrdenes, "'MED-REPRO'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            }
            
            Cargando(0)
        });
        
    },

    Volumen_Change() {
        let volumen = parseFloat(isNull($("#EvalMacroPeso2").val(), 0)) - parseFloat(isNull($("#EvalMacroPeso1").val(), 0));
        $("#EvalMacroVolumen").val(volumen.toFixed(2));
        $("#txtConcentracionMill").val(volumen.toFixed(2));  
        $("#txtPreMill").val(volumen.toFixed(2));  
        //$("#txtPostMill").val(volumen.toFixed(2));  
        
        MedRepro.Concentracion_Change();
        //MedRepro.PreMillTotal_Change();
        //MedRepro.PostMillTotal_Change();
        //MedRepro.PostRem_Change();
    },

    Movilidad_Change() {
        let movTotal = parseFloat(isNull($("#txtPreProgresivaRapida").val(), 0)) + parseFloat(isNull($("#txtPreProgresivaLenta").val(), 0)) + parseFloat(isNull($("#txtPreNoProgresiva").val(), 0)) + parseFloat(isNull($("#txtPreInmoviles").val(), 0));
        $("#txtPreTotalMovilidad").val(movTotal.toFixed(0));
    },

    Vitalidad_Change() {
        let vitaTotal = parseFloat(isNull($("#txtEspermatozoidesVivos").val(), 0)) + parseFloat(isNull($("#txtEspermatozoidesMuertos").val(), 0));
        $("#txtTotalMovilidad").val(vitaTotal.toFixed(0));
    },
    
    Concentracion_Change() {
        let conce = parseFloat(isNull($("#txtConcentracionNumeroA").val(), 0)) / parseFloat(isNull($("#txtConcentracionNumeroB").val(), 0));
        $("#txtConcentracionNumeroTotal").val(conce.toFixed(1));

        if (conce == 0) {
            $("#txtPreTotalMovilidad").val(0);
            $("#txtTotalMovilidad").val(0);
        }

        let concTotal = parseFloat(isNull($("#txtConcentracionNumeroTotal").val(), 0)) * parseFloat(isNull($("#txtConcentracionMill").val(), 0));
        if (concTotal >= 10) {
            $("#txtConcentracionMillTotal").val(Math.round(concTotal.toFixed(0)));
        } else {
            $("#txtConcentracionMillTotal").val(concTotal.toFixed(1));
        }       
    },

    Morfologia_Change() {
        let morfN = (parseFloat(isNull($("#txMorfologiaNormalA").val(), 0)) * 100.00 ) / 200.00;
        $("#txMorfologiaNormalB").val(morfN.toFixed(2));

        let morfA = (parseFloat(isNull($("#txMorfologiaAnormalA").val(), 0)) * 100.00) / 200.00;
        $("#txMorfologiaAnormalB").val(morfA.toFixed(2));

        let morfTotal = parseFloat(isNull($("#txMorfologiaNormalA").val(), 0)) + parseFloat(isNull($("#txMorfologiaAnormalA").val(), 0));

        $("#txMorfologiaTotal").val(morfTotal.toFixed(0));
    },

    ExamenDirecto_Change() {
        let leuco = parseFloat(isNull($("#txtExaDirectoLeucocitos").val(), 0)) * 25000;
        $("#txtExaDirectoLeucocitosTotal").val(leuco.toFixed(0));

        let inmad = parseFloat(isNull($("#txtExaDirectoCelEspermInmaduras").val(), 0)) * 25000;
        $("#txtExaDirectoCelEspermInmadurasTotal").val(inmad.toFixed(0));

        let redo = parseFloat(isNull($("#txtExaDirectoLeucocitosTotal").val(), 0)) + parseFloat(isNull($("#txtExaDirectoCelEspermInmadurasTotal").val(), 0));

        redo = Math.round(redo.toFixed(2));

        if (redo >= 1000) {
            redo = redo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        } else {
            redo = redo.toString();
        }

        $("#txtCelRedondas").val(redo);
    },
    
    PreProgresiva_Change() {
        let movTotal = parseFloat(isNull($("#txtPreProgresiva").val(), 0)) + parseFloat(isNull($("#txtPreNoProgresiva").val(), 0)) + parseFloat(isNull($("#txtPreInmoviles").val(), 0));
        $("#txtPreTotalMovilidad").val(Math.round(movTotal.toFixed(0)));
    },

    PreNumero_Change() {
        let nume = parseFloat(isNull($("#txtPreNumeroA").val(), 0)) / parseFloat(isNull($("#txtPreNumeroB").val(), 0));
        $("#txtPreNumeroTotal").val(nume.toFixed(2));

        MedRepro.PreMillTotal_Change();
    },

    PreMillTotal_Change() {
        let mill = parseFloat(isNull($("#txtPreNumeroTotal").val(), 0)) * parseFloat(isNull($("#txtPreMill").val(), 0));
        $("#txtPreMillTotal").val(mill.toFixed(0));
    },

    PostProgresiva_Change() {
        let movTotal = parseFloat(isNull($("#txtPostProgresiva").val(), 0)) + parseFloat(isNull($("#txtPostNoProgresiva").val(), 0)) + parseFloat(isNull($("#txtPostInmoviles").val(), 0));
        $("#txtPostTotalMovilidad").val(Math.round(movTotal.toFixed(2)));
    },

    PostNumero_Change() {
        let nume = parseFloat(isNull($("#txtPostNumeroA").val(), 0)) / parseFloat(isNull($("#txtPostNumeroB").val(), 0));
        $("#txtPostNumeroTotal").val(nume.toFixed(2));

        MedRepro.PreMillTotal_Change();
    },

    PostMillTotal_Change() {
        let mill = parseFloat(isNull($("#txtPostNumeroTotal").val(), 0)) * parseFloat(isNull($("#txtPostMill").val(), 0));
        $("#txtPostMillTotal").val(mill.toFixed(2));
    },

    PostRem_Change() {
        let rem = (parseFloat(isNull($("#txtPostMillTotal").val(), 0)) * parseFloat(isNull($("#txtPostProgresiva").val(), 0))) / 100.00;
        $("#txtPostRem").val(rem.toFixed(2));
    },

    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idCuentaAtencion",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "paciente",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "pareja",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "idOrden",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "codigo",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "producto",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "servicioActual",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: "planFinanciamiento",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align','left')
                    }
                },
                {
                    data: null,
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');

                        if (rowData.estado == 1) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirResultadoCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        } 
                    }
                },
                
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_MedicinaReproductiva = $("#tblMedicinaReproductiva").dataTable(parms);
    },



    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async ListarMedicinaReproductiva() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        /*if ($("#txtNroOrdenBusq").val() == "" && $("#txtNroCuentaBusq").val() == "" && $("#txtNroDniBusq").val() == "" && $("#txtNroHistoriaBusq").val() == "" &&
            $("#txtApPaternoBusq").val() == "" && $("#txtFechaIngresoBusq").val() == "") {
            alerta2("info", "", "Por favor ingrese algun de los filtros de busqueda.");
            return false;
        }*/

        data.append('NroOrden', $("#txtNroOrdenBusq").val());
        data.append('NroCuenta', $("#txtNroCuentaBusq").val());
        data.append('NroDocumento', $("#txtNroDniBusq").val());
        data.append('NroHistoria', $("#txtNroHistoriaBusq").val());
        data.append('ApPaterno', $("#txtApPaternoBusq").val());
        //data.append('ApMaterno', $("#txtApMaternoBusq").val());
        data.append('FechaIngresoIni', $("#txtFechaIngresoIniBusq").val());
        data.append('FechaIngresoFin', $("#txtFechaIngresoFinBusq").val());


        try {
            Cargando(1);
            oTable_MedicinaReproductiva.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MedicinaReproductiva/ListarOrdenesMedicinaReproductiva?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_MedicinaReproductiva.fnAddData(datos.respuesta.table);
                oTable_MedicinaReproductiva.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarMedicinaReproductiva(obj) {
        let resp = false;
        let midata = new FormData();
        midata.append('IdOrden', obj.idOrden);
        midata.append('IdAtencion', obj.idAtencion);
        midata.append('IdProducto', obj.idProducto);
        midata.append('tipoExamen', obj.tipoExamen);

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MedicinaReproductiva/SeleccionarOrdenMedicinaReproductiva?area=Laboratorio",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $("#ModuloMedicinaReprodutiva").html(datos);
            MedRepro.IniciarModulo();
            MedRepro.CargarDatosALaVista();
            //var tablaJson = @ViewBag.MedicinaRep;
            //let tablaData = JSON.parse(tablaJson);
            //console.log(MedRepro.registro[0]);
            $(".chzn-select").chosen({ allow_single_deselect: true });
            resp = true;
            //$("#modalAltaMedica").modal("show");
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    CargarDatosALaVista() {
        let obj = MedRepro.registro[0];
        console.log(obj);
        MedRepro.IdMedicinaReproductiva = obj.IdMedicinaReproductiva;        
        MedRepro.IdOrden = obj.IdOrden;
        MedRepro.IdProducto = obj.IdProductoCpt;
        MedRepro.IdAtencion = obj.IdAtencion;
        MedRepro.IdCuentaAtencion = obj.IdCuentaAtencion;
        MedRepro.IdMedReproMacroscopica = obj.IdMedReproMacroscopica;
        MedRepro.IdMedReproMicroscopica = obj.IdMedReproMicroscopica;
        $("#txtCodigoEspe").val(obj.Codigo);
        $("#txtCodigoEspePareja").val(obj.IdMedicinaReproductiva);

        $("#txtNroCuentaPareja").val(obj.DIdCuentaAtencionPareja);
        $("#txtNroHistoriaMadrePareja").val(obj.DNroHistoriaPareja);
        $("#txtNombreMadrePareja").val(obj.DNombrePareja);
        $("#txtEdadMadrePareja").val(obj.DEdadPareja);

        $("#txtNroCuentaPaciente").val(obj.DIdCuentaAtencionPaciente);
        $("#txtNroHistoriaPaciente").val(obj.DNroHistoriaPaciente);
        $("#txtNombrePaciente").val(obj.DNombrePaciente);
        $("#txtEdadPaciente").val(obj.DEdadPaciente);

        $("#txtVihRprPaciente").val(obj.VihRprPaciente);
        $("#txtFechaExamen").datepicker("setDate", obj.FechaExamen);
        $("#txtHoraRecoleccion").val(obj.HoraRecoleccion);
        $("#txtHoraEvaluacion").val(obj.HoraEvaluacion);
        $("#cboMetodoObtencion").val(obj.MetodoObtencion);
        $("#txtMetodoObtencion").val(obj.OtroMetodoObtencion);
        $("#txtAbstinenciaSexual").val(obj.DiasAbstineciaSexual);
        $("#txtDificultad").val(isEmpty(obj.Dificultad) ? 'Ninguna' : obj.Dificultad);
        $("#cboLugarObtencion").val(obj.LugarObtencion);
        $("#txtLugarObtencion").val(obj.OtroLugarObtencion);

        $('input:radio[name=EvalMacroColor][value="' + obj.TipoColor + '"]').attr('checked', true);
        $("#txtEvalMacroColorOpt9").val(obj.TipoOtroColor);
        
        $('input:radio[name=EvalMacroOlor][value="' + obj.TipoOlor + '"]').attr('checked', true);
        $('input:radio[name=EvalMacroAspecto][value="' + obj.TipoAspecto + '"]').attr('checked', true);
        $('input:radio[name=EvalMacroLicuefaccion][value="' + obj.TipoLicuefaccion + '"]').attr('checked', true);
        $('input:radio[name=EvalMacroViscocidad][value="' + obj.TipoViscocidad + '"]').attr('checked', true);
        $("#EvalMacroVolumen").val(obj.Volumen);
        $("#EvalMacroPeso1").val(obj.PesoUno);
        $("#EvalMacroPeso2").val(obj.PesoDos);
        $("#EvalMacroPh").val(obj.Ph);
        
        $("#txtPreProgresivaRapida").val(obj.MovPreProgresionRapida);
        $("#txtPreProgresivaLenta").val(obj.MovPreProgresionLenta);
        $("#txtPreNoProgresiva").val(obj.MovPreNoProgresiva);
        $("#txtPreProgresiva").val(obj.MovPreProgresiva);
        $("#txtPreInmoviles").val(obj.MovPreInmoviles);
        $("#txtPreTotalMovilidad").val(obj.MovPreTotal);
        $("#txtPreNumeroA").val(obj.MovPreNumeroNumerador);
        $("#txtPreNumeroB").val(obj.MovPreNumeroDenominador);
        $("#txtPreNumeroTotal").val(obj.MovPreLineas);
        $("#txtPreMill").val(obj.MovPreCantidad);
        $("#txtPreMillTotal").val(obj.MovPreCantidadTotal);

        $("#txtPostProgresivaRapida").val(obj.MovPostProgresionRapida);
        $("#txtPostProgresivaLenta").val(obj.MovPostProgresionLenta);
        $("#txtPostProgresiva").val(obj.MovPostProgresiva);
        $("#txtPostNoProgresiva").val(obj.MovPostNoProgresiva);
        $("#txtPostInmoviles").val(obj.MovPostInmoviles);
        $("#txtPostTotalMovilidad").val(obj.MovPostTotal);
        $("#txtPostNumeroA").val(obj.MovPostNumeroNumerador);
        $("#txtPostNumeroB").val(obj.MovPostNumeroDenominador);
        $("#txtPostNumeroTotal").val(obj.MovPostLineas);
        $("#txtPostMill").val(obj.MovPostCantidad);
        $("#txtPostMillTotal").val(obj.MovPostCantidadTotal);
        $("#txtPostRem").val(obj.MovPostRem);

        $('input:radio[id=optMetodoGradienteDensidad][value="' + obj.MetodoGradienteDensidad + '"]').attr('checked', true);
        $('input:radio[id=optMetodoSwimUp][value="' + obj.MetodoSwinUp + '"]').attr('checked', true);
        $('input:radio[id=optMetodoCompactacion][value="' + obj.MetodoCompactacion + '"]').attr('checked', true);
        //$('#chkMetodoGradienteDensidad').prop('checked', obj.MetodoGradienteDensidad);
        //$('#chkMetodoSwimUp').prop('checked', obj.MetodoSwinUp);
        //$('#chkMetodoCompactacion').prop('checked', obj.MetodoCompactacion);
        $("#txtEspermatozoidesVivos").val(obj.VitEspermaVivos);
        $("#txtEspermatozoidesMuertos").val(obj.VitEspermaMuertos);
        $("#txtTotalMovilidad").val(obj.VitEspermaTotal);
        $("#txtConcentracionNumeroA").val(obj.ConcNumeroNumerador);
        $("#txtConcentracionNumeroB").val(obj.ConcNumeroDenominador);
        $("#txtConcentracionNumeroTotal").val(obj.ConcNumeroTotal);
        $("#txtConcentracionMill").val(obj.ConcCantidad);
        $("#txtConcentracionMillTotal").val(obj.ConcCantidadTotal);
        $("#txMorfologiaNormalA").val(obj.MorfNormalNumero);
        $("#txMorfologiaNormalB").val(obj.MorfNormalPorcentaje);
        $("#txMorfologiaAnormalA").val(obj.MorfAnormalNumero);
        $("#txMorfologiaAnormalB").val(obj.MorfAnormalPorcentaje);
        $("#txMorfologiaTotal").val(obj.MorfTotal);
        $("#txtExaDirectoLeucocitos").val(obj.ExaDirLeucocitos);
        $("#txtExaDirectoLeucocitosTotal").val(obj.ExaDirLeucocitosTotal);
        $("#txtExaDirectoCelEspermInmaduras").val(obj.ExaDirCelEspInmaduras);
        $("#txtExaDirectoCelEspermInmadurasTotal").val(obj.ExaDirCelEspInmadurasTotal);
        $("#txtCelRedondas").val(isEmpty(obj.ExaDirCelEspRedondas) ? '' : (obj.ExaDirCelEspRedondas >= 1000 ? obj.ExaDirCelEspRedondas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : obj.ExaDirCelEspRedondas));
        $('input:radio[name=Aglutinacion][value="' + obj.TipoAglutinacion + '"]').attr('checked', true);
        $('input:radio[name=Agregacion][value="' + obj.TipoAgregacion + '"]').attr('checked', true);
        $("#txtObservacion").val(obj.Observacion);
        $("#cboProfesionalBiologo").val(obj.IdProfesionalBiologo);

        
    },

    async ModificarMedicinaReproductiva() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        
                
        data.append('IdMedicinaReproductiva', MedRepro.IdMedicinaReproductiva);
        data.append('Codigo', $("#txtCodigoEspe").val());
        data.append('IdOrden', MedRepro.IdOrden);
        data.append('IdProducto', MedRepro.IdProducto);
        data.append('IdAtencion', MedRepro.IdAtencion);
        data.append('IdCuentaAtencion', MedRepro.IdCuentaAtencion);
        data.append('NombrePareja', $("#txtNombreMadrePareja").val());
        data.append('EdadPareja', $("#txtEdadMadrePareja").val());
        data.append('NombrePaciente', $("#txtNombrePaciente").val());
        data.append('EdadPaciente', $("#txtEdadPaciente").val());
        data.append('VihRprPaciente', $("#txtVihRprPaciente").val());
        data.append('FechaExamen', $("#txtFechaExamen").val());
        data.append('HoraRecoleccion', $("#txtHoraRecoleccion").val());
        data.append('HoraEvaluacion', $("#txtHoraEvaluacion").val());
        data.append('MetodoObtencion', $("#cboMetodoObtencion").val());
        data.append('OtroMetodoObtencion', $("#txtMetodoObtencion").val());
        data.append('DiasAbstineciaSexual', $("#txtAbstinenciaSexual").val());
        data.append('Dificultad', $("#txtDificultad").val());
        data.append('LugarObtencion', $("#cboLugarObtencion").val());
        data.append('OtroLugarObtencion', $("#txtLugarObtencion").val());
        data.append('IdMedReproMacroscopica', MedRepro.IdMedReproMacroscopica);
        data.append('TipoColor', isNull($('input[name="EvalMacroColor"]:checked').val(), 0));
        data.append('TipoOtroColor', $("#txtEvalMacroColorOpt9").val());
        data.append('TipoOlor', isNull($('input[name="EvalMacroOlor"]:checked').val(), 0));
        data.append('TipoAspecto', isNull($('input[name="EvalMacroAspecto"]:checked').val(), 0));
        data.append('TipoLicuefaccion', isNull($('input[name="EvalMacroLicuefaccion"]:checked').val(), 0));
        data.append('TipoViscocidad', isNull($('input[name="EvalMacroViscocidad"]:checked').val(), 0));
        data.append('Volumen', $("#EvalMacroVolumen").val());
        data.append('PesoUno', $("#EvalMacroPeso1").val());
        data.append('PesoDos', $("#EvalMacroPeso2").val());
        data.append('Ph', $("#EvalMacroPh").val());
        data.append('IdMedReproMicroscopica', MedRepro.IdMedReproMicroscopica);
        data.append('MovPreProgresionRapida', $("#txtPreProgresivaRapida").val());
        data.append('MovPreProgresionLenta', $("#txtPreProgresivaLenta").val());
        data.append('MovPreNoProgresiva', $("#txtPreNoProgresiva").val());
        data.append('MovPreProgresiva', $("#txtPreProgresiva").val());
        data.append('MovPreInmoviles', $("#txtPreInmoviles").val());
        data.append('MovPreTotal', $("#txtPreTotalMovilidad").val());
        data.append('MovPreNumeroNumerador', $("#txtPreNumeroA").val());
        data.append('MovPreNumeroDenominador', $("#txtPreNumeroB").val());
        data.append('MovPreLineas', $("#txtPreNumeroTotal").val());
        data.append('MovPreCantidad', $("#txtPreMill").val());
        data.append('MovPreCantidadTotal', $("#txtPreMillTotal").val());
        data.append('MovPostProgresionRapida', $("#txtPostProgresivaRapida").val());
        data.append('MovPostProgresionLenta', $("#txtPostProgresivaLenta").val());
        data.append('MovPostProgresiva', $("#txtPostProgresiva").val());
        data.append('MovPostNoProgresiva', $("#txtPostNoProgresiva").val());
        data.append('MovPostInmoviles', $("#txtPostInmoviles").val());
        data.append('MovPostTotal', $("#txtPostTotalMovilidad").val());
        data.append('MovPostNumeroNumerador', $("#txtPostNumeroA").val());
        data.append('MovPostNumeroDenominador', $("#txtPostNumeroB").val());
        data.append('MovPostLineas', $("#txtPostNumeroTotal").val());
        data.append('MovPostCantidad', $("#txtPostMill").val());
        data.append('MovPostCantidadTotal', $("#txtPostMillTotal").val());
        data.append('MovPostRem', $("#txtPostRem").val());
        data.append('MetodoGradienteDensidad', isNull($('input[id="optMetodoGradienteDensidad"]:checked').val(), 0));
        data.append('MetodoSwinUp', isNull($('input[id="optMetodoSwimUp"]:checked').val(), 0));
        data.append('MetodoCompactacion', isNull($('input[id="optMetodoCompactacion"]:checked').val(), 0));
        //data.append('MetodoGradienteDensidad', $('#chkMetodoGradienteDensidad').is(":checked") ? 1 : 0);
        //data.append('MetodoSwinUp', $('#chkMetodoSwimUp').is(":checked") ? 1 : 0);
        //data.append('MetodoCompactacion', $('#chkMetodoCompactacion').is(":checked") ? 1 : 0);
        data.append('VitEspermaVivos', $("#txtEspermatozoidesVivos").val());
        data.append('VitEspermaMuertos', $("#txtEspermatozoidesMuertos").val());
        data.append('VitEspermaTotal', $("#txtTotalMovilidad").val());
        data.append('ConcNumeroNumerador', $("#txtConcentracionNumeroA").val());
        data.append('ConcNumeroDenominador', $("#txtConcentracionNumeroB").val());
        data.append('ConcNumeroTotal', $("#txtConcentracionNumeroTotal").val());
        data.append('ConcCantidad', $("#txtConcentracionMill").val());
        data.append('ConcCantidadTotal', $("#txtConcentracionMillTotal").val());
        data.append('MorfNormalNumero', $("#txMorfologiaNormalA").val());
        data.append('MorfNormalPorcentaje', $("#txMorfologiaNormalB").val());
        data.append('MorfAnormalNumero', $("#txMorfologiaAnormalA").val());
        data.append('MorfAnormalPorcentaje', $("#txMorfologiaAnormalB").val());
        data.append('MorfTotal', $("#txMorfologiaTotal").val());
        data.append('ExaDirLeucocitos', $("#txtExaDirectoLeucocitos").val());
        data.append('ExaDirLeucocitosTotal', $("#txtExaDirectoLeucocitosTotal").val());
        data.append('ExaDirCelEspInmaduras', $("#txtExaDirectoCelEspermInmaduras").val());
        data.append('ExaDirCelEspInmadurasTotal', $("#txtExaDirectoCelEspermInmadurasTotal").val());
        data.append('ExaDirCelEspRedondas', (isEmpty($("#txtCelRedondas").val()) ? "" : $("#txtCelRedondas").val().replace(/ /g, "")));
        data.append('TipoAglutinacion', isNull($('input[name="Aglutinacion"]:checked').val(), 0));
        data.append('TipoAgregacion', isNull($('input[name="Agregacion"]:checked').val(), 0));
        data.append('Observacion', $("#txtObservacion").val());
        data.append('IdProfesionalBiologo', $("#cboProfesionalBiologo").val());


        try {
            Cargando(1);
            oTable_MedicinaReproductiva.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MedicinaReproductiva/ModificarResultadoMedicinaReproductiva?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta) {
                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async EliminarMedicinaReproductiva() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdMedicinaReproductiva', MedRepro.IdMedicinaReproductiva);
        data.append('IdMedReproMacroscopica', MedRepro.IdMedReproMacroscopica);
        data.append('IdMedReproMicroscopica', MedRepro.IdMedReproMicroscopica);
        data.append('IdOrden', MedRepro.IdOrden);
        data.append('IdProducto', MedRepro.IdProducto);
        data.append('IdAtencion', MedRepro.IdAtencion);
        data.append('IdCuentaAtencion', MedRepro.IdCuentaAtencion);
        
        try {
            Cargando(1);
            oTable_MedicinaReproductiva.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MedicinaReproductiva/EliminarResultadoMedicinaReproductiva?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta) {
                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    /*HabilitarRegistro() {
        $(".field").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#txtNroCuentaMadre").attr('disabled','disabled');
    },

    DeshabilitarRegistro() {
        $(".field").attr('disabled','disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#txtNroCuentaMadre").removeAttr("disabled");
        $("#btnBuscarMadre").show();
        $("#btnCambiarMadre").hide();
    },*/

    BloquearRegistro() {
        $(".field").attr('disabled','disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#btnGuardarMedicinaReproductiva").hide();
        $("#btnEliminarMedicinaReproductiva").hide();
    },

    DesbloquearRegistro() {
        $(".field").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#btnGuardarMedicinaReproductiva").show();
        $("#btnEliminarMedicinaReproductiva").hide();

        let color = $('input[name="EvalMacroColor"]:checked').val();
        if (color == 9) {
            $("#txtEvalMacroColorOpt9").removeAttr("disabled");
        } else {
            $("#txtEvalMacroColorOpt9").attr("disabled", true);
        }

        let lugar = $('#cboLugarObtencion').val();
        if (lugar == 9) {
            $("#txtLugarObtencion").removeAttr("disabled");
        } else {
            $("#txtLugarObtencion").attr("disabled", true);
        }

        let metodo = $('#cboMetodoObtencion').val();
        if (metodo == 9) {
            $("#txtMetodoObtencion").removeAttr("disabled");
        } else {
            $("#txtMetodoObtencion").attr("disabled", true);
        }
    },

    LimpiarCamposRegistro() {
        MedRepro.IdMedicinaReproductiva = 0;
        MedRepro.IdOrden = 0;
        MedRepro.IdProducto = 0;
        MedRepro.IdAtencion = 0;
        MedRepro.IdCuentaAtencion = 0;
        MedRepro.IdMedReproMacroscopica = 0;
        MedRepro.IdMedReproMicroscopica = 0;
        $('.field').val('');
        $("#txtDificultad").val("Ninguna");
    },

    LimpiarCamposBusqueda() {
        $('.search').val('');
    },



}


$(document).ready(function () {
    MedRepro.Iniciar();   

    PermisoGeneral.ValidarServicioFirmaDigital();
});