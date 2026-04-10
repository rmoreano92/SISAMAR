var ConsejeriaPsicoprofilaxis = {
    
    async Iniciar() {
        ConsejeriaPsicoprofilaxis.Plugins();
        ConsejeriaPsicoprofilaxis.InitDataTableDiagnosticosBasico();
        ConsejeriaPsicoprofilaxis.Eventos();
        await ConsejeriaPsicoprofilaxis.CargarCombos();
        //await AtencionConsejeria.ListarDestinosAtencion();
    },

    Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaFUR, #txtFechaFPP').datepicker({
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
        $('#txtFechaFUR, #txtFechaFPP').mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        //$("#HoraInicioAtencion").mask("Hn:Nn");
    },

    async CargarCombos() {
        await ConsejeriaPsicoprofilaxis.ListarFactoresRiesgo();  
        await ConsejeriaPsicoprofilaxis.ListarDetalleTiposAtencion();
        await ConsejeriaPsicoprofilaxis.ListarTiposDocumentos();
        await ConsejeriaPsicoprofilaxis.ListarTiposParentesco();
    },

    /*==============EVENTOS JQUERY===================================================================================================================================================================*/
    Eventos() {
        $("#txtFechaFUR").on('change', async function () {
            let valor = $(this).val();
            await ConsejeriaPsicoprofilaxis.MovCalcularEdadGestacional(valor);
        });

        $("#txtNroSesionAcompaniante").on('change', async function () {
            let valor = $(this).val();
            ConsejeriaPsicoprofilaxis.CalcularCondicionAcompaniante(valor);
        });
    },

    /*==============DATATABLES===================================================================================================================================================================*/
    InitDataTableDiagnosticosBasico() {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "tipoDiagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
            ]
        }

        var tableWrapper = $('#tblDiagnosticosUltimoControl'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DiagnosticosUltimoControl = $("#tblDiagnosticosUltimoControl").dataTable(parms);

    },

    /*==============CONSUMO APIS====================================================================================================================================================================*/
    async ListarFactoresRiesgo() {

        try {
            Cargando(1);
            $("#cboFactorRiesgo").empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsejeriaPsicoprofilaxis/ListarFactoresRiesgo?area=ConsultaExterna",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                $(datos.respuesta.table).each(function (i, obj) {
                    $('#cboFactorRiesgo').append('<option value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboFactorRiesgo").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }
    },

    async ListarDetalleTiposAtencion() {
        
        try {
            Cargando(1);
            $("#cboDetalleAtencion").empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsejeriaPsicoprofilaxis/ListarDetalleTiposAtencion?area=ConsultaExterna",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                $(datos.respuesta.table).each(function (i, obj) {
                    $('#cboDetalleAtencion').append('<option value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboDetalleAtencion").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }  
    },

    async ListarTiposDocumentos() {

        try {
            Cargando(1);
            $("#cboTipoDocumentoAcompaniante").empty();
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListaTiposDocumentos?area=ConsultaExterna",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                $(datos.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocumentoAcompaniante').append('<option value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                });
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboTipoDocumentoAcompaniante").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }
    },

    async ListarTiposParentesco() {

        try {
            Cargando(1);
            $("#cboTipoParentescoAcompaniante").empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposParentesco?area=ConsultaExterna",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                $(datos.respuesta.table).each(function (i, obj) {
                    $('#cboTipoParentescoAcompaniante').append('<option value="' + obj.vparentescO_CODIGO + '">' + obj.vparenstescO_DESCRIPCION + '</option>');
                });
                $('#cboTipoParentescoAcompaniante').append('<option value="900">OTRO</option>');
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboTipoParentescoAcompaniante").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }
    },

    async SeleccionarConsejeriaPsicoprofilaxis() {
        let resp = {
            atencion: null,
            diagnosticos: null,
            anteObs: null
        };
        let midata = new FormData();
        midata.append('idAtencion', Variables.IdAtencion);
        midata.append('idCitaTerapia', Variables.IdCita);

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsejeriaPsicoprofilaxis/SeleccionarConsejeriaPsicoprofilaxis?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0 ) {
                    resp.atencion = datos.respuesta.table;
                }    
                if (datos.respuesta.table1.length > 0) {
                    resp.diagnosticos = datos.respuesta.table1;
                }
                if (datos.respuesta.table2.length > 0) {
                    resp.anteObs = datos.respuesta.table2;
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboTipoParentescoAcompaniante").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }

        return resp;
    },

    async GuardarConsejeriaPsicoprofilaxis() {
        let resp = null;
        let midata = new FormData();

        if (isEmpty($("#HoraInicioAtencion").val())) {
            $("#HoraInicioAtencion").focus();
            alerta2("info", "", "Por favor ingrese la hora de inicio de atención.");            
            return;
        }

        midata.append('idAtencion', Variables.IdAtencion);
        midata.append('idCitaTerapia', Variables.IdCita);        
        midata.append('fur', $("#txtFechaFUR").val());
        midata.append('fpp', $("#txtFechaFPP").val());
        midata.append('edadGestSem', $("#txtEdadGestSem").val());
        midata.append('edadGestDias', $("#txtEdadGestDias").val());
        midata.append('paridad1', $("#txtParidad1").val());
        midata.append('paridad2', $("#txtParidad2").val());
        midata.append('paridad3', $("#txtParidad3").val());
        midata.append('paridad4', $("#txtParidad4").val());
        midata.append('idFactorRiesgo', $("#cboFactorRiesgo").val());
        midata.append('factorRiesgo', $("#txtFactorRiesgo").val());
        midata.append('idProductoDetalleAtencion', $("#cboDetalleAtencion").val());
        midata.append('nroSesionEducativa', $("#txtSesionEducativa").val());
        midata.append('motivoAtencion', $("#txtMotivoAtencion").val());
        midata.append('gestantePreparada', $("input[name='rdbPreparadaParto']:checked").val());
        midata.append('idTipoDocumentoAcompaniante', $("#cboTipoDocumentoAcompaniante").val());
        midata.append('nroDocumentoAcompaniante', $("#txtNroDocumentoAcompaniante").val());
        midata.append('nombresAcompaniante', $("#txtNombresAcompaniante").val());
        midata.append('idParentescoAcompaniante', $("#cboTipoParentescoAcompaniante").val());
        midata.append('nroSesionAcompaniante', $("#txtNroSesionAcompaniante").val());
        midata.append('idMedicoAtiende', Variables.IdMedico);
        midata.append('HoraInicioAtencion', $("#HoraInicioAtencion").val());
        midata.append('IdListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsejeriaPsicoprofilaxis/GuardarConsejeriaPsicoprofilaxis?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }  
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboTipoParentescoAcompaniante").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }

        return resp;
    },

    async EliminarConsejeriaPsicoprofilaxis(IdAtencion, IdCita) {
        let resp = false;
        let midata = new FormData();
        midata.append('idAtencion', IdAtencion);
        midata.append('idCitaTerapia', IdCita);
        midata.append('IdListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConsejeriaPsicoprofilaxis/EliminarConsejeriaPsicoprofilaxis?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }                
            } else {
                Utilitario.CargarModalInicioSesion();
            }

        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }

        return resp;
    },

    /*==============METODOS==========================================================================================================================================================================================*/
    async MovCalcularEdadGestacional(fecha) {
        $("#txtFechaFPP").val("");
        $("#txtEdadGestSem").val("");
        $("#txtEdadGestDias").val("");
        if (isEmpty(fecha) == false) {
            if (esFormatoFecha(fecha)) {
                //let fechaHoraHoy = await Utilitario.FechaHoraServidor();
                //let fechaRegistro = isNull($("#txtMovFechaRegistroMovimiento").val(), fechaHoraHoy);
                //fechaRegistro = fechaRegistro.substring(0, 10);

                let edadGest = Utilitario.CalcularEdadGestacional(Variables.FechaInicioCita, fecha, "", "", 1);
                $("#txtFechaFPP").datepicker("setDate", edadGest.fpp);
                $("#txtEdadGestSem").val(edadGest.cantSemanas);
                $("#txtEdadGestDias").val(edadGest.cantDias);

            }
        }
    },

    CalcularCondicionAcompaniante(sesion) {
        if (sesion >= 5) {
            $("#txtCondicionAcompaniante").val("Preparado");
        } else {
            $("#txtCondicionAcompaniante").val("No Preparado");
        }
    },

    async GuardarDatosPsicoprofilaxis() {
        let resp = false;
        resp = await ConsejeriaPsicoprofilaxis.GuardarConsejeriaPsicoprofilaxis();
        return resp;
    },

    async CargarDatosPsicoprofilaxis() {
        let datos = await ConsejeriaPsicoprofilaxis.SeleccionarConsejeriaPsicoprofilaxis();        

        if (isEmpty(datos.diagnosticos) == false) {
            let diagnosticos = datos.diagnosticos;
            oTable_DiagnosticosUltimoControl.fnAddData(diagnosticos);
            oTable_DiagnosticosUltimoControl.resize();
        }      

        if (isEmpty(datos.anteObs) == false) {
            let anteObs = datos.anteObs[0];

            $("#txtFechaFUR").datepicker("setDate", anteObs.fur);
            $("#txtFechaFPP").datepicker("setDate", anteObs.fpp);
            //$("#txtGesta").val(anteObs.gesta);
            $("#txtParidad1").val(anteObs.paridad1);
            $("#txtParidad2").val(anteObs.paridad2);
            $("#txtParidad3").val(anteObs.paridad3);
            $("#txtParidad4").val(anteObs.paridad4);
            $("#txtEdadGestSem").val(anteObs.edadGestacional);
            $("#txtEdadGestDias").val(anteObs.diasGestacional);
        }

        if (isEmpty(datos.atencion) == false) {
            let atencion = datos.atencion[0];
            $("#HoraInicioAtencion").val(atencion.horaInicioAtencion);

            $("#txtFechaFUR").datepicker("setDate", atencion.fur);
            $("#txtFechaFPP").datepicker("setDate", atencion.fpp);
            //$("#txtGesta").val(atencion.gesta);
            $("#txtParidad1").val(atencion.paridad1);
            $("#txtParidad2").val(atencion.paridad2);
            $("#txtParidad3").val(atencion.paridad3);
            $("#txtParidad4").val(atencion.paridad4);
            $("#txtEdadGestSem").val(atencion.edadGestSem);
            $("#txtEdadGestDias").val(atencion.edadGestDias);

            $("#cboFactorRiesgo").val(atencion.idFactorRiesgo);
            $("#txtFactorRiesgo").val(atencion.factorRiesgo);
            $("#cboDetalleAtencion").val(atencion.idProductoDetalleAtencion);
            $("#txtSesionEducativa").val(atencion.nroSesionEducativa);
            $("#txtMotivoAtencion").val(atencion.motivoAtencion);
            $("input[name='rdbPreparadaParto'][value='" + atencion.gestantePreparada + "']").prop("checked", true);
            $("#cboTipoDocumentoAcompaniante").val(atencion.idTipoDocumentoAcompaniante);
            $("#txtNroDocumentoAcompaniante").val(atencion.nroDocumentoAcompaniante);
            $("#txtNombresAcompaniante").val(atencion.nombresAcompaniante);
            $("#cboTipoParentescoAcompaniante").val(atencion.idParentescoAcompaniante);
            $("#txtNroSesionAcompaniante").val(atencion.nroSesionAcompaniante);

            $("#txtNroSesionAcompaniante").change()
        }

        $(".chzn-select").chosen().trigger("chosen:updated");
    },

    async EliminarDatosPsicoprofilaxis(idAtencion, IdCita) {
        let resp = false;
        resp = await ConsejeriaPsicoprofilaxis.EliminarConsejeriaPsicoprofilaxis(idAtencion, IdCita);
        return resp;
    },

}