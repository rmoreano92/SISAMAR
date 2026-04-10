let AtencionMedica = {
    ListaAtencionByCuenta: function (idCuenta) { // JDELGADO J0 CAMBIO AJAX
        let formData = new FormData();
        formData.append('idCuenta', idCuenta);

        return HttpClient.Post('/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna', formData).then(res => {
            if (res.lstAtenciones.table.length > 0) {
                return res.lstAtenciones.table[0]
            }
            return null
        })
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
    }
}

var ATENCIONES = function () {
    listaEpisodios = [{}];

    //////COMENTADO POR KHOYOSI
    //var idRecetaRX = 0;
    //var idRecetaPatCli = 0;
    //var idRecetaAnatPat = 0;
    //var idRecetaBs = 0;
    //var idRecetaEcoGene = 0;
    //var idRecetaEcoObs = 0;
    //var idRecetaFarm = 0;
    //var idRecetaInterconsulta = 0; // jdelgado011

    //var permisoRefcon = "";
    //var permisoFua = "";
    //var permisoFirma4Identity = "";
    //var permisoClasiPaciente = "";

    var plugins = function () {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            //            "scrollX": true,
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFinEmb,#txtFechaAtencion,#txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        //$("tagMedicoProgramado").hide();
    }


    ///////////////////////KHOYOSI////////////////////////////
    var BloquearCampos = function() {
        $("#ceAtencion .campo input[type=text]").attr('disabled', 'disabled');
        $("#ceAtencion .campo textarea").attr('disabled', 'disabled');
        $("#ceAtencion .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#ceAtencion .campo input[type=radio]").attr('disabled', 'disabled');
        $("#ceAtencion .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesCPT").hide();
        $(".OpcionesOrdenes").hide();
        $(".OpcionesDiagnosticos").hide();
    }

    var DesbloquearCampos = function() {
        $("#ceAtencion .campo input[type=text]").removeAttr("disabled");
        $("#ceAtencion .campo textarea").removeAttr("disabled");
        $("#ceAtencion .campo input[type=checkbox]").removeAttr("disabled");
        $("#ceAtencion .campo input[type=radio]").removeAttr("disabled");
        $("#ceAtencion .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
                
        $(".OpcionesCPT").show();
        $(".OpcionesOrdenes").show();
        $(".OpcionesDiagnosticos").show();
    }
    ///////////////////////////////////////////////////////



    var listaServicios = function () {

        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencion').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                $('#cboConsultorio').empty();
                var servicios = datos.table
                $(servicios).each(function (i, obj) {
                    $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
                });
                // JDELGADO001
                $("#cboConsultorio option").each(function () {
                    if ($('#idEmpleadotxt').val() == $(this).context.attributes.idempleado.nodeValue) {
                        //console.log("Tiene programacion")
                        $(`#cboConsultorio option[value='${$(this).context.attributes[5].nodeValue}']`).attr("selected", true);
                        $('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
                        return
                    } else {
                        //console.log("No tiene programacion")
                    }
                });
                //END JDELGADO001

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
    }

    var generaParteDiarios = function () {
        Cargando(1);
        var midata = new FormData();
        midata.append('programacion', $('#cboConsultorio>option:selected').attr("prog"));
        //Cargando(1);
        $.ajax({
            method: "POST",
            //url: "/Atencion/GeneraParteDiario?area=ConsultaExterna", 
            url: "/Atencion/GeneraLlamadaAPDfParteDiario?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.resultadoGeneraPdf.resulfirma) {
                    alerta('1', 'Se genero correctamente el envio de los datos para firmar');
                    $("#codeParte").val(datos.resultadoGeneraPdf.lstFirma.table[0]["code"])
                    $("#statusParte").val(datos.resultadoGeneraPdf.lstFirma.table[0]["statusFirma"])
                    window.open(datos.resultadoGeneraPdf.lstFirma.table[0]["ruta"], '_blank');
                    ListaAtencionesCE();
                }



            },
            error: function (msg) {
                Cargando(0);
                alerta("ERROR", "Error listar servicios!", "2");
            }
        });
    }

    //RQ0002 RMOREANOC
    var listaTiposConsulta = function () {
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListarTiposConsulta?area=ConsultaExterna",
            datatype: "json",
            type: "get",
            success: function (datos) {

                $('#cboTipoConsulta').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoConsulta').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                //$(".hide_search").chosen({ disable_search_threshold: 10 });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipo de consultas!", "2");
                }, 900)
            }
        });
    }

    
    //////////////////KHOYOSI//////////////////////////
    var ListaRecetasCabeceras = async function () {
        var formData = new FormData();
        let datos;
        let resp;

        //var objrow = oTable_atenciones.api(true).row('.selected').data();

        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //COEMNTADO POR KHOYOSI
            //if (datos.table.length == 0) {                
            //    $("#btnImprimeRecetas").prop('disabled', true);
            //    //$("#btnImprimeRecetas").html('No hay recetas por imprimir');
            //} else {                
            //    $("#btnImprimeRecetas").prop('disabled', false);
            //    //$("#btnImprimeRecetas").html('Rec. Médicas');
            //}
            resp = datos.table;
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    }
    /////////////////////////////////////////////////

    //COMENTADO POR KHOYOSI
    //var listaRecetasCabeceras = function () {
    //    var objrow = oTable_atenciones.api(true).row('.selected').data();
    //    var midata = new FormData();
    //    midata.append('idCuentaAtencion', objrow.idCuentaAtencion);

    //    //limpiarRecetas();

    //    $.ajax({
    //        type: "post",
    //        url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=ConsultaExterna",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        async: false,
    //        success: function (datos) {

    //            // JDELGADO J0
    //            if (datos.table.length == 0) {
    //                $("#btnImprimeRecetas").prop('disabled', true);
    //                $("#btnImprimeRecetas").html('No hay recetas por imprimir');
    //            } else {
    //                $("#btnImprimeRecetas").prop('disabled', false);
    //                $("#btnImprimeRecetas").html('Imp. Recetas');
    //            }

    //            $(datos.table).each(function (i, obj) {

    //                switch (obj.idPuntoCarga) {
    //                    case 21: idRecetaRX = obj.idReceta; break;
    //                    case 2: idRecetaPatCli = obj.idReceta; break;
    //                    case 3: idRecetaAnatPat = obj.idReceta; break;
    //                    case 11: idRecetaBs = obj.idReceta; break;
    //                    case 20: idRecetaEcoGene = obj.idReceta; break;
    //                    case 23: idRecetaEcoObs = obj.idReceta; break;
    //                    case 5: idRecetaFarm = obj.idReceta; break;
    //                    case 12: idRecetaInterconsulta = obj.idReceta; break;

    //                    default: break;
    //                }

    //            });


    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error listar recetas!", "2");
    //            }, 900)
    //        }
    //    });
    //}

    // JDELGADO J0 CAMBIAR RECETAS
    let tabSelect = '';
    function showHideTabs(idReceta, tab) {
        if (idReceta == 0) {
            $(`a[href="${tab}"]`).closest('li').hide()
        } else {
            $(`a[href="${tab}"]`).closest('li').show()
            tabSelect = tab
            //$(`a[href="${tab}"]`).click();
            //$(`.nav-tabs a[href="${tab}"]`).tab('show');
        }
    }
    // JDELGADO J0 CAMBIAR RECETAS

    var TiposClasificacionPaciente = function () {
        $.ajax({
            method: "POST",
            url: "/Atencion/TiposClasificacionPaciente?area=ConsultaExterna",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {

                if (res.lsClasiPac.table.length > 0) {
                    $('#cboClasisifcacion').empty();
                    $(res.lsClasiPac.table).each(function (i, obj) {
                        $('#cboClasisifcacion').append('<option  value="' + obj.id + '" '+ (obj.id==7?'selected':'') +'>' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");

                } else {
                    alerta(2, 'Error listar clasificacion!')
                }

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar clasificacion!", "2");
                }, 900)
            }
        });
    }
    var CondicionEstablecimiento = function (idCuentaAtencion, idServicio) {
        var midata = new FormData();
        midata.append('idNroCuenta', idCuentaAtencion);
        midata.append('idServicio', idServicio);

        $.ajax({
            method: "POST",
            url: "/Atencion/CondicionEstablecimiento?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $(datos.table).each(function (i, obj) {
                    if (obj.categoria == "MGP") {
                        //$('#lblDesEstablecimiento').html("En el estab: " + obj.descripcion)
                        $('#lblDesEstablecimiento').html(obj.descripcion)       //KHOYOSI
                        $('#idEnEstablecimiento').val(obj.idTipoCondicionPaciente)
                    }

                    if (obj.categoria == "ServicioMGP") {
                        //$('#lblDesServicio').html("En el servicio: " + obj.descripcion)
                        $('#lblDesServicio').html(obj.descripcion)      //KHOYOSI
                        $('#idEnServicio').val(obj.idTipoCondicionPaciente)
                    }

                });


            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar condicion de establecimiento!", "2");
                }, 900)
            }
        });
    }
    var listaDestinosCE = function () {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboDestino').empty();
                $(datos.table).each(function (i, obj) {
                    if (!isEmpty(objrow)) {
                        if (objrow.idFuenteFinanciamiento != 3 && (obj.idDestinoAtencion == 12 || obj.idDestinoAtencion == 13)) {
                            false;
                        } else {
                            $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                        }
                    }

                });
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0)
                listaDestinosCE();
                alerta("ERROR", "Error listar destinos!", "2");
            }
        });
    }
    var listaEpisodiosByPaciente = function (idPaciente) {
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

        $.ajax({

            url: "/Atencion/ListaEpisodiosByAtencion?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                var nroEpisodio = 0
                var fecha = null
                $('#cboEpisodio').empty();
                $('#cboEpisodio').append('<option  value="0">-Seleccione-</option>');

                $(datos.table).each(function (i, obj) {
                    $('#cboEpisodio').append('<option atencion="' + obj.idAtencion + '" value="' + obj.idEpisodio + '"> N°. ' + obj.idEpisodio + ' -  Fech. Apertura: ' + obj.fechaApertura +
                        ' -  Diagnostico: ' + obj.diagnosticoWeb +
                        ' -  FechaCierre: ' + obj.fechaCierre +
                        ' -  Servicio ' + obj.servicioGeneralweb + '</option>');

                    if (obj.idAtencion == $('#idAtencion').val()) {
                        nroEpisodio = obj.idEpisodio;
                        $('#chkNuevo').prop('checked', true)
                        fecha = obj.fechaCierre;
                    }

                });

                if (isEmpty(fecha)) {
                    $('#chkCierre').prop('checked', false)
                }
                else {
                    $('#chkCierre').prop('checked', true)
                }
                $('#cboEpisodio').val(nroEpisodio);
                $('.chzn-select').chosen().trigger("chosen:updated");
                listaEpisodios = datos


            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0)
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    }

    var ListaAtencionByCuenta = async function (idCuenta) { // JDELGADO J0 CAMBIO AJAX
        //Cargando(1);
        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        var dataAtencin = {};
        await $.ajax({
            method: "POST",
            url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                //console.log("datos")
                //console.log(datos)
                //Cargando(0);
                if (datos.session) {
                    if (datos.lstAtenciones.table.length > 0) {
                        dataAtencin = datos.lstAtenciones.table[0];
                    }
                    else {
                        dataAtencin = {};
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }

        })

        return dataAtencin;


    }
    var llamaAlertaGeneraPdf = function () {

    }
    var ListaAtencionesCE = function () {

        Cargando(1)
        AtencionMedicaInit.oTable_atenciones.fnClearTable();
        //alert($('#cboConsultorio>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencion').val());
        midata.append('idServicio', $('#cboConsultorio').val());
        midata.append('prog', $('#cboConsultorio>option:selected').attr("prog"));
        $.ajax({ // JDELGADO J1 CAMBIOS EN AJAX
            method: "POST",
            url: "/Atencion/ListarAtencionesCE?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                if (datos.session) {
                    Cargando(0)
                    if (datos.lstAtenciones.table.length > 0) {
                        AtencionMedicaInit.oTable_atenciones.fnAddData(datos.lstAtenciones.table);
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    //Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })


    }
    var ListaDiagnosticosAtenciones = function (idAtencion) {

        Diagnosticos.LimpiarDiagnosticosAtencion();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        $.ajax({

            method: "POST",
            url: "/Atencion/AtencionesDiagnosticosSeleccionarPorAtencion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                Cargando(0)
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {
                        Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                    }
                }
                else {
                    Cargando(0)
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })


    };

    var ListaRecetas = function (idAtencion, idTipoFuenteFinan) {

        Ordenes.limpiarCatalogo();
        //Ordenes.listaRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
        Ordenes.listaCabeceraRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)


    };

    var refresacaCombox = function () {
        alerta(1, "Se esta recargando los datos de los combobox");
        var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro de la lista de pacientes');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Cargando(1);
            listaDestinosCE()
            listaEpisodiosByPaciente($('#idPaciente').val());
            Ordenes.listaFarmacias();
            //Ordenes.BuscarCatalogo(21, 0);
            //Ordenes.BuscarCatalogo(23, 0);
            //Ordenes.BuscarCatalogo(20, 0);
            //Ordenes.BuscarCatalogo(3, 0);
            //Ordenes.BuscarCatalogo(2, 0);
            //Ordenes.BuscarCatalogo(11, 0);

            Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
            Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
            Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
            Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
            Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
            Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());

            Cargando(0);
        }        
    }

    ////////////////////KEVIN//////////////////////////////
    var CargarCatalogo = function () {
        Cargando(1);
        Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());
        Cargando(0);
    }
    //////////////////////////////////////////////////////

    var initDatables = function () {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
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
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 4,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '5%',
                    targets: 5,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '8%',
                    targets: 7,
                    data: "planA",
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
                    width: '7%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //KHOYOSI
                        if (rowData.estadoCita == "Separada") {
                            $(td).html('<span class="chip orange">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Atendido") {
                            $(td).html('<span class="chip success">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Pagada") {
                            $(td).html('<span class="chip blue">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Vencida (No pagada)") {
                            $(td).html('<span class="chip secondary">' + rowData.estadoCita + '</span >');
                        }
                        //KHOYOSI
                    }
                }
                ,
                {
                    width: '5%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.usaModuloMaterno) {
                            $(td).html('<button class="btnCarnetPrenatal btn btn-sm btn-indigo glow_button" title="Visualiza Carnet Prenatal" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-address-card"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                }
                ,
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

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (permisoFirma4Identity == '1') {
                                if (rowData.statusFirma == 0) {
                                    btnRuta = '<button class="Firma4Identity btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                                } else {
                                    btnImprime = ' <button class="btnFirma4IdentityImprime btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                                }
                            } else {
                                if (rowData.statusFirma == 0) {
                                    btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                }
                                if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                                    btnImprime = ' <button class="ImprimeInforme btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                }
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },

                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                {
                    width: '10%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                        if ((rowData.idReferencia > 0 || rowData.idContraReferencia > 0) && rowData.idFirmaRefCon != null && permisoRefcon == '1' ) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeHojaRefConSinF btn btn-sm btn-warning glow_button" title="Visualiza Ref/Con" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (rowData.statusFirmaRefCon == 0) {
                                btnRuta = '<a href="' + rowData.rutaRefCon + '" class="btn btn-sm btn-danger" title="Firmar Hoja Ref/Con" data-toggle="tooltip"> <i class="fa fa-pencil"></i></a>';
                            }
                            if (rowData.statusFirmaRefCon == 1 || rowData.statusFirmaRefCon == 0) {
                                btnImprime = ' <button class="ImprimeHojaRefConConF btn btn-sm btn-success glow_button" title="Imprime Hoja Ref/Con Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';

                                //btnRuta = "";
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                            //$(td).html(btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },
                ////////////////////////////////////////////////////////////////////

                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '10%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                        if (!isEmpty(rowData.fechaEgreso) && rowData.idFirmaFua != null && permisoFua == '1') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            if (permisoFirma4Identity == '1') {
                                if (rowData.statusFirmaFua == 0) {
                                    btnRuta = '<button class="Firma4IdentityFUA btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                                } else {
                                    btnImprime = ' <button class="btnFirma4IdentityImprimeFUA btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                                }
                            } else {
                                if (rowData.statusFirmaFua == 0) {
                                    btnRuta = '<a href="' + rowData.rutaFua + '" class="btn btn-sm btn-danger" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                }
                                if (rowData.statusFirmaFua == 1 || rowData.statusFirmaFua == 0) {
                                    btnImprime = ' <button class="ImprimeFuaCF btn btn-sm btn-success glow_button" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';

                                    //btnRuta = "";
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                }
                ///////////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);


    };

    ///////////////////////////////////////////
    //function ValidarServicioCarnetPrenatal(idServicio) {
    //    if (idServicio == 9 || idServicio == 10 || idServicio == 11 || idServicio == 12 || idServicio == 13 ||
    //        idServicio == 14 || idServicio == 15 || idServicio == 16 || idServicio == 135 || idServicio == 136 ||
    //        idServicio == 137 || idServicio == 138 || idServicio == 139 || idServicio == 140 || idServicio == 141 ||
    //        idServicio == 142 || idServicio == 155 || idServicio == 157 || idServicio == 158 || idServicio == 159) {
    //        return true;
    //    } else {
    //        return false;
    //    }
    //}
    //////////////////////////////////////////

    async function mostrar(tipoBoton) { // JDELGADO J0 CAMBIO ASYNC METHOD

        //return false
        Diagnosticos.LimpiarCampos();
        Ordenes.ubicaFarmacia(116);

        limpiar();
        Ordenes.limpiarCatalogo

        // JDELGADO VALIDACIONES PRE-ANESTESICA
        if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
            console.log("pre anestesica")
            $('#contenedorChkEsEvaluacionPreAnestesica').show()
        } else {
            console.log("especialidad")
            $('#contenedorChkEsEvaluacionPreAnestesica').hide()
        }

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado
        $('#chkEsEvaluacionPreAnestesica').attr('disabled', false)

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $('[href="#examenEvalAnest"]').closest('li').hide();
        $('[href="#resultadosAnest"]').closest('li').hide();

        // JDELGADO VALIDACIONES PRE-ANESTESICA

        var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');            
        }
        let objrow = await ListaAtencionByCuenta(objrowTb.idCuentaAtencion); // JDELGADO J0 CAMBIO ASYNC METHOD

        // await Anestesiologia.ListarExamenesAnestesiologiaByCuenta(objrowTb.idCuentaAtencion)
        

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Ordenes.ubicaMedico(objrowTb.idMedico); //KHOYOSI
            listaDestinosCE();  //KHOYOSI
            if (objrow.idEstadoAtencion == 2) {
                ///////KHOYOSI//////////                
                if (tipoBoton == 1) {
                    swal({
                        title: 'Alerta',
                        html: "<h4><b>La cuenta ya se encuentra cerrada<b></h4>",
                        type: 'warning',                        
                    }).done();
                    return false;
                }

                if (tipoBoton == 3) {
                    alerta(3, "La cuenta ya se encuentra cerrada");
                }
                ///////KHOYOSI//////////
            }

            await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
            //$('#lblEstadoAtencion').html("Estado Atencion: " + objrow.descEstadoAtencion)
            $('#lblEstadoAtencion').html(objrow.descEstadoAtencion)             //KHOYOSI
            if (objrow.idTipoFinanciamiento == "" || objrow.idTipoFinanciamiento == 0) {
                alerta(3, "Seleccione correctamente el paciente, problemas con el plan");
                return false
            }
            if ($('#idPaciente').val() !== "") {
                //Lista Recetas
                //listaRecetasCabeceras();          //COMENTADO POR KHOYOSI
                BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                //Lista Triaje
                Triaje.listaTriaje(objrow.idAtencion);
                $("#txtPA").change();
                $("#txtPAD").change();
                $("#txtFc").change();
                $("#txtFr").change();
                $("#txtT").change();
                //anm
                IdCuentaAtencionTemp = objrow.idCuentaAtencion;
                $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);
                $('#txtQuirurgicos').val(objrow.antecedQuirurgico);
                $('#txtPatologicos').val(objrow.antecedPatologico);
                $('#txtObstetricos').val(objrow.antecedObstetrico);
                $('#txtAlergias').val(objrow.antecedAlergico);
                $('#txtFamiliares').val(objrow.antecedFamiliar);
                $('#txtOtros').val(objrow.antecedentes);
                //$('#txtMotivoCons').val(objrow.citaMotivo);

                //NINIO SANO cmbia citamotivo
                if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
                    $('#txtMotivoCons').val(objrow.citaMotivo);
                    $('#txtExamenC').val(objrow.citaExamenClinico);
                    $("#txtPC").attr("disabled", true);
                }
                else {
                    if (objrow.usaModuloNinoSano) {
                        NinioAltoRiesgo.limpiarDatos();
                        $('#txtMotivoConsNinio').val(objrow.citaMotivo);
                        $('#txtExamenCNinio').val(objrow.citaExamenClinico);
                        $('#txtEnfermedadActual').val(objrow.enfermedadActual);
                        $('#txtTiempoEmfermedad').val(objrow.tiempoEnfermedad);
                        $("#txtPC").attr("disabled", false);
                    }
                    if (objrow.usaModuloMaterno) {
                        $('#txtMotivoConsultaPeri').val(objrow.citaMotivo);
                    }

                }
                // FIN NINIO SANO


                // ANESTESIOLOGIA - JDELGADO0
                if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
                    let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(objrow.idAtencion)

                    if (atencionAnestesiologia.length > 0) {
                        $('#chkEsEvaluacionPreAnestesica').prop('checked', true)

                        $('#contenedorPreAnestesica').show()
                        $('#contenedorEspecialidades').hide()

                        $('[href="#examenEvalAnest"]').closest('li').show();
                        $('[href="#resultadosAnest"]').closest('li').show();

                        $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)

                        Anestesiologia.CompletarAtencionAnestesio(objrow.idAtencion, objrow.idCuentaAtencion)
                    } else {
                        $('#chkEsEvaluacionPreAnestesica').prop('checked', false)

                        $('#contenedorPreAnestesica').hide()
                        $('#contenedorEspecialidades').show()

                        $('[href="#examenEvalAnest"]').closest('li').hide();
                        $('[href="#resultadosAnest"]').closest('li').hide();
                    }
                } 
                // ANESTESIOLOGIA - JDELGADO0


                var dt = new Date();
                var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())
                $('#HoraInicioAtencion').val((objrow.horaInicioAtencion == "     " ? time : objrow.horaInicioAtencion));

                $('#txtHoraCia').val(objrowTb.horaInicio);
                $('#txtAtencedentes').val(objrow.citaAntecedente);
                $('#txtOtrasObservacionesGe').val(objrow.citaObservaciones); //nuevo
                //lleno entrevista 
                $('#txtControles').val(objrow.nroControles);
                $('#txtEdadGestacional').val(objrow.edadGestacional);
                $('#txtGestas').val(objrow.nroGestas);
                $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
                $('.chzn-select').chosen().trigger("chosen:updated");
                bloqueo($('#cboClasisifcacion').val());


                CondicionEstablecimiento(objrow.idCuentaAtencion, objrow.idServicioIngreso)

                //alert(objrow.idEstadoAtencion);

                if (objrow.idEstadoAtencion !== 1) {
                    $('#btnguardar').css("visibility", 'hidden');
                }
                else {

                    switch (tipoBoton) {
                        case 1:
                            $('#btnguardar').attr("disabled", false);
                            $('#btnguardar').css("visibility", 'visible');
                            Diagnosticos.HabilitarBotones();
                            break;
                        case 4:

                            $('#btnguardar').attr("disabled", true);
                            $('#btnguardar').css("visibility", 'hidden');
                            Diagnosticos.DeshablitarBotones();
                            break;

                        default:
                        // code block
                    }
                }

                if (objrow.costoCeroCE == "S") {
                    listaEpisodiosByPaciente($('#idPaciente').val());
                    ListaDiagnosticosAtenciones($('#idAtencion').val())
                    ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                    $('#cboDestino').val($('#idDestinoAtencion').val());
                    $("#cboDestino").trigger("chosen:updated");
                    //$('#modalAgregar').modal('show');
                    $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                    //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                }
                else {

                    let fuentesFin = await PermisoGeneral.SeleccionaParametros(1008)
                    let arrayFuentesFin = fuentesFin[0].valorTexto.split(',')

                    if (arrayFuentesFin.includes(objrow.idFuenteFinanciamiento.toString())) {
                        listaEpisodiosByPaciente($('#idPaciente').val())
                        ListaDiagnosticosAtenciones($('#idAtencion').val())
                        ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                        $('#cboDestino').val($('#idDestinoAtencion').val());
                        $("#cboDestino").trigger("chosen:updated");
                        //$('#modalAgregar').modal('show');
                        $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                        //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                    }
                    else {
                        if (objrow.idEstadoCita == 4 || objrow.idEstadoCita == 2) {
                            listaEpisodiosByPaciente($('#idPaciente').val());
                            ListaDiagnosticosAtenciones($('#idAtencion').val())
                            ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                            $('#cboDestino').val($('#idDestinoAtencion').val());
                            $("#cboDestino").trigger("chosen:updated");
                            // $('#modalAgregar').modal('show');
                            $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                            //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                        }
                        else {
                            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
                            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                            alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pago");
                            return false;
                        }
                    }
                }


                //NINNIO SANO ACTIVA TAB
                if (objrow.usaModuloMaterno == true) {
                    $('[href="#entrevista"]').closest('li').hide();
                    $('[href="#NinoSano"]').closest('li').hide();

                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('[href="#Perinatal"]').closest('li').show();

                    Perinatal.ListaProCabByIdAten(objrow.idAtencion, objrow.idPaciente)
                }
                else if (objrow.usaModuloNinoSano == true) {
                    $('[href="#entrevista"]').closest('li').hide();
                    $('[href="#Perinatal"]').closest('li').hide();
                    $('.nav-tabs a[href="#NinoSano"]').tab('show');
                    $('[href="#NinoSano"]').closest('li').show();
                    NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
                    NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
                }
                else {

                    $('[href="#NinoSano"]').closest('li').hide();
                    $('[href="#Perinatal"]').closest('li').hide();
                    $('[href="#entrevista"]').closest('li').show();
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                }

                //fin


                //rmoreanoc RQ0002
                $('#txtProximaConsulta').val(objrow.proximaCita);
                $('#cboTipoConsulta').val(objrow.idTipoConsultaProxCita)
                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#cboDestino').change();
                //fin rmoreano

                $('#txtPlanTrabajo').val(objrow.planTrabajo);
                $('#txtTratamiento').val(objrow.tratamiento);

                //NINIO SANO CAMBIA CARGA DE SIGNOS BIOLOGICOS
                if (objrow.usaModuloNinoSano == true) {
                    $("#txtApetitoNinio").val(objrow.apetito);
                    $("#txtSuenioNinio").val(objrow.suenio);
                    $("#txtSedNinio").val(objrow.sed);
                    $("#txtOrinaNinio").val(objrow.orina);
                    $("#txtDiposicionesNinio").val(objrow.deposiciones);
                }
                else {
                    $("#txtApetito").val(objrow.apetito);
                    $("#txtSuenio").val(objrow.suenio);
                    $("#txtSed").val(objrow.sed);
                    $("#txtOrina").val(objrow.orina);
                    $("#txtDiposiciones").val(objrow.deposiciones);
                }

                /////////KHOYOSI (Valida si ya se ha generado un hoja de refcon)////////////
                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                if (permisoRefcon == '1') {
                    if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {
                        estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon
                    }
                }                
                ///////////////////////////////////////////////////////////////////////////


                //Validamos si los combobox cargaron correctamente
                if ($("#cboDestino").children('option').length == 0) {
                    listaDestinosCE();
                }
                if ($("#cboFarmacia").children('option').length == 0) {
                    Ordenes.listaFarmacias();                    
                }
                if ($("#cboRx").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(21, 0);                                        //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(21, objrow.idServicioIngreso);        //KHOYOSI                    
                }

                if ($("#cboEcoObs").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(23, 0);                                        //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(23, objrow.idServicioIngreso);        //KHOYOSI
                }

                if ($("#cboecoGene").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(20, 0);                                        //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(20, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cboanaPatologica").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(3, 0);                                         //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(3, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cboPatoClinica").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(2, 0);                                         //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(2, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cbobancoSangre").children('option').length == 0) {
                    //Ordenes.BuscarCatalogo(11, 0);                                        //KHOYOSI (COMENTADO)
                    Ordenes.BuscarCatalogoPorServicio(11, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cboClasisifcacion").children('option').length == 0) {
                    TiposClasificacionPaciente();
                }                          

                // JDELGADO J0
                $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                // JDELGADO J0

                $('#hdIdServicioPaciente').val(objrow.idServicioIngreso);
                $('#hdIdTipoServicio').val(1);


                ///////////////KHOYOSI////////////////////////////
                //if (ValidarServicioCarnetPrenatal(objrow.idServicioIngreso)) {
                if (objrow.usaModuloMaterno) {
                    $('#btnCarnetPrenatal').show();
                } else {
                    $('#btnCarnetPrenatal').hide();
                }

                //$('#btnAbrirModalCierreCiclo').hide();          //DESCOEMNTAR CUANDO SALGA A PRODUCCION
                //$('#btnImprimeSeguimientoCPN').hide();          //DESCOEMNTAR CUANDO SALGA A PRODUCCION
            }
            else {
                alerta(2, 'Seleccione un registro');
                return false;
            }
        }

    }
    var bloqueo = function (valorClas) {
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

    ////////////COMENTADO POR KHOYOSI/////////////////
    //var limpiarRecetas = function () {
    //    idRecetaRX = 0;
    //    idRecetaPatCli = 0;
    //    idRecetaAnatPat = 0;
    //    idRecetaBs = 0;
    //    idRecetaEcoGene = 0;
    //    idRecetaEcoObs = 0;
    //    idRecetaFarm = 0;
    //    idRecetaInterconsulta = 0; // jdelgado011


    //    $("#ifrmRecetaFarm").contents().find("body").html('');
    //    $("#ifrmRecetaRx").contents().find("body").html('');
    //    $("#ifrmRecetaEcoObs").contents().find("body").html('');
    //    $("#ifrmRecetaEcoGene").contents().find("body").html('');
    //    $("#ifrmRecetaAnaPatolg").contents().find("body").html('');
    //    $("#ifrmRecetaPatoClini").contents().find("body").html('');
    //    $("#ifrmRecetaBs").contents().find("body").html('');
    //    $("#ifrmRecetaInterconsulta").contents().find("body").html('');

    //}
    var fechaDia = function () {
        var fechaG = new Date();
        var diaG = fechaG.getDate();
        var mesG = parseInt(fechaG.getMonth()) + 1;
        var yyyG = fechaG.getFullYear();

        fechaA = diaG + "/" + mesG + "/" + yyyG
        return fechaA
    }
    var eventos = function () {

        //////////////////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'FUA')               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0);
        });

        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'FUA')               //KHOYOSI
            imprimirDocumentoConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo);
        });               
        /////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////EVENTOS IMPRIMIR REFCON/////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConSinF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }
            
            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0);
        });

        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConConF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            ImprimirRefConFirmado(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////


        //luis
        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });
        $('#ceAtencion-tab').on('click', function () {
            var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                swal({
                    title: 'Alerta',
                    text: "Seleccione un registro",
                    type: 'warning',
                }).done();
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                return false;
            }

        })
        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                text: '¿Estas seguro de  Salir?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',                
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {

                ListaAtencionesCE();
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }).catch(swal.noop);

        });
        $('#btnCboRefresca').on('click', function () {
            //$('#farmaciaRece-tab').click();
            refresacaCombox();
        });

        $('#btnDescargaParte').on('click', async function () {

            ////COMENTADO POR KHOYOSI
            //if ($("#codeParte").val() == "") {
            //    alerta('2', 'No tiene CODE asigando, primero genere la firma');
            //}
            //else {
            //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            //    var row = oTable_atenciones.fnGetData(objrow);
            //    imprimiParte2($('#cboConsultorio>option:selected').attr("prog"), $("#codeParte").val(), 0);
            //}

            var programacion = $('#cboConsultorio>option:selected').attr("prog");
            const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'Hubo un error al cargar el documento del Parte Diario.');
            } else {
                imprimiParteDiarioConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo);
            }
            
        });

        $('#btnDescargaParteSF').on('click', async function () {
            var programacion = $('#cboConsultorio>option:selected').attr("prog");
            Cargando(1);
            const data = await GeneraParteDiario(programacion);
            Cargando(0);
            if (data == true) {
                alerta(1, 'El Parte Diario se genero correctamente.');
                const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI

                if (typeof firma === 'undefined') {
                    alerta('2', 'Hubo un error al cargar el documento del Parte Diario.');
                } else {
                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            } else {
                alerta(2, 'Hubo un error al generar el Parte Diario.');
            }
            //imprimiParteDiarioSF($('#cboConsultorio>option:selected').attr("prog"));
        });

        $('#btnGeneraParte').on('click', async function () {
            swal({
                title: 'Generar Parte Diario',
                text: 'Estas seguro generar y firmar el parte diario?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            }).then(async function () {
                var programacion = $('#cboConsultorio>option:selected').attr("prog");
                const data = await GeneraParteDiario(programacion);
                if (data == true) {
                    alerta(1, 'El Parte Diario se genero correctamente.');
                    const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI
                    if (typeof firma === 'undefined') {
                        alerta('2', 'Hubo un error al cargar el documento del Parte Diario.');
                    } else {
                        $("#codeParte").val(firma.code)
                        $("#statusParte").val(firma.statusFirma)
                        window.open(firma.ruta, '_blank');
                        //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                        //AbrirVisorDocumento(firma.rutaArchivo, 0);
                    }
                } else {
                    alerta(2, 'Hubo un error al generar el Parte Diario.');
                }
                //COMENTADO POR KHOYOSI
                //generaParteDiarios();
            });

        });

        $('#cboConsultorio').on('change', function () {
            $("#codeParte").val($('#cboConsultorio>option:selected').attr("code"))
            $("#statusParte").val($('#cboConsultorio>option:selected').attr("status"));

            //console.log($('#cboConsultorio>option:selected').attr("idEmpleado"));

            if ($('#cboConsultorio>option:selected').attr("code") != "" && $('#cboConsultorio>option:selected').attr("status") == 1) {
                $('#btnGeneraParte').css("visibility", 'hidden');
            }
            else {
                $('#btnGeneraParte').css("visibility", 'visible');
            }
            $('#btnBuscarAtenciones').click();
        });

        $("#txtFechaAtencion").focusout(function (e) { // JDELGADO001
            $('#lblMedicoProgramado').html("")
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                AtencionMedicaInit.oTable_atenciones.fnClearTable();
                if ($("#txtFechaAtencion").val() == "") {
                    alerta('2', 'Ingrese fecha de atencion');
                    return false;
                }
                else {
                    listaServicios();
                }
            }
        });
        $('#txtFechaAtencion').on('change', function () {
            $('#lblMedicoProgramado').html("")
            AtencionMedicaInit.oTable_atenciones.fnClearTable();
            if ($("#txtFechaAtencion").val() == "") {
                alerta('2', 'Ingrese fecha de atencion');
                return false;
            }
            else {
                listaServicios();
            }
        });
        $('#tblAtencion tbody').on('click', '.ImprimeInforme', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI
            const informe = await imprimiInforme2(firma.idCuentaAtencion, firma.code, firma.idDoc)
        });

        $('#tblAtencion tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            tipoFormato = 0;
            Cargando(1);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI

            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {
                    if (row.usaModuloMaterno) {
                        tipoFormato = 1;
                    }
                    else if (row.usaModuloNinoSano) {
                        tipoFormato = 2;
                    }
                    else {
                        tipoFormato = 0;
                    }
                    //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
                }
                
                const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idProCabecera, tipoFormato);
                
                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {                
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });


        //////////////////////////////KHOYOSI///////////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.btnCarnetPrenatal', async function () {        
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(row.idPaciente);

            //AbrirVisorDocumento(carnet, 0);
            //Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        $('#btnCarnetPrenatal').on('click', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            
            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(objrow.idPaciente);

            //AbrirVisorDocumento(carnet, 0);
            //Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        ///////////////////////////////////////////////////////////////////////////////////

        ///COMENTADO POR KHOYOSI
        //$('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
        //    let objFra = document.getElementById('ifrmReporte');

        //    objFra.contentWindow.focus();
        //    objFra.contentWindow.print();

        //    ListaAtencionesCE();

        //});

        //fin luis


        // jdelgado firma 4identity
        $('#tblAtencion tbody').on('click', '.Firma4Identity', function (event) {
            event.preventDefault();

            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivo}`);
            $('#bit4id-documentName').text(row.rutaArchivo.substr(row.rutaArchivo.indexOf("/") + 1,).substr(row.rutaArchivo.substr(row.rutaArchivo.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivo},${row.idCuentaAtencion},A,ConsultaExterna,AtencionMedica`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            
            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });

        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprime', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivo, 0);
        });


        $('#tblAtencion tbody').on('click', '.Firma4IdentityFUA', function (event) {
            event.preventDefault();

            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivoFua}`);
            $('#bit4id-documentName').text(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).substr(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivoFua},${row.idCuentaAtencion},FUA`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });

        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprimeFUA', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivoFua, 0);
        });
                
        $("#modalReceta").on('hidden.bs.modal', function () {

            //ListaAtencionesCE();
        });
        $("#modalConsumoServicio").on('hidden.bs.modal', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });
        $('#btnEliminarCSAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
            var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();
            if (objrow.idEstadoAtencion == 2) {
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
                    }).then(function () {

                        ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
                        BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                    });
                }
                else {
                    alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                    return false;
                }
            }

        });

        $('#btnActualizaCSAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });

        $('#btnAgregarCSAtencion').on('click', function () {
            ConsumoServicio.bloqueoProcedencia();
            ConsumoServicio.limpiar();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
            ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1);
            $('#modalConsumoServicio').modal('show');
        });

        // JDELGADO J0

        //$("#txtPeso").on('change', function () {

        //    $("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val()))
        //    $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        //}); // cambio calculo imc

        $("#txtPesoPregesta").on('focusout', function () {
            //console.log("funciono");
            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        });

        //$("#txtTalla").on('change', function () {

        //    $("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val()))
        //    $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))

        //}); // cambio calculo imc

        $("#txtTalla").on('change', function () {

            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))

        });

        // JDELGADO

        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            var valorClas = $("#cboClasisifcacion").val()
            bloqueo(valorClas)
        })

        //rmoreano RQ0002
        $("#cboDestino").on('change', async function () {

            if ($("#cboDestino").val() == 60) {
                $('#txtProximaConsulta').attr("disabled", false);
                $("#cboTipoConsulta").removeAttr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");
            } else {
                $('#txtProximaConsulta').val("");
                $('#cboTipoConsulta').val(-1);
                $('#txtProximaConsulta').attr("disabled", true);
                $("#cboTipoConsulta").attr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");
            }

            //KHOYOSI (START)   (validamos que boton mostrar de acuerdo al destino que se seleccione)
            const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
            if (permisoRefcon == '1') {
                if ($("#cboDestino").val() == 12 || $("#cboDestino").val() == 13) {
                    estadoGuardadoRefCon = false;           //asigna que no aun no se ha guardado la hoja de refcon, a causa de que se ha seleccionado un nuevo destino
                    if ($("#cboDestino").val() == 12) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Referencia")
                    }
                    if ($("#cboDestino").val() == 13) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Contrareferencia")
                    }
                    $('#btnRefCon').show();
                } else {
                    estadoGuardadoRefCon = true;            //asiga que se ha guardado la hoja de refcon, ya que el destino es diferente a las opciones de Referencia o Contrareferencia
                    $('#btnRefCon').hide();
                }
            }            
            //KHOYOSI (END)


        })
        //fin rmoreano RQ0002

        $("#btnImprimeSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            SeguimientoPaciente.llendaDatos(objrow.nroHistoriaClinica, 0)
            $("#modalSeguimiento").modal('show');
        })
        $("#btnCerrarSeguimiento").on('click', function () {
            $("#modalSeguimiento").modal('hide');
        })

        //jdelgado
        $("#btnImprimeSeguimientoCPN").on('click', function () {
            SeguimientoPacienteCPN.limpiaDatos();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data()
            console.log(objrow)
            SeguimientoPacienteCPN.llendaDatos(objrow.nroHistoriaClinica)
            $("#modalSeguimientoCPN").modal('show');
        })
        $("#btnCerrarSeguimientoCPN").on('click', function () {
            $("#modalSeguimientoCPN").modal('hide');
        })
        //jdelgado

        $('#cboEpisodio').on('change', function () {
            var fecha = null
            var episodio = 0
            var idAtencion = $("#cboEpisodio option:selected").attr("atencion");
            episodio = $('#cboEpisodio').val()
            $('#chkNuevo').prop('checked', false)
            $('#chkCierre').prop('checked', false)

            $(listaEpisodios.table).each(function (i, obj) {
                //console.log(obj.idEpisodio + '---' + episodio );

                if (obj.idEpisodio == episodio) {
                    if (isEmpty(obj.fechaCierre)) {
                        $('#chkCierre').prop('checked', false)
                    }
                    else {
                        $('#chkCierre').prop('checked', true)
                    }
                }
                if (obj.idAtencion == idAtencion) {
                    $('#chkNuevo').prop('checked', true)
                }
            });
        })



        ////========================KHOYOS========================================//        COEMTNADO POR KHOYOSI
        //$("#farmaciaRece-tab").on("click", async function () {            
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaFarm;
        //    $('#btnifrmRecetaFarm').hide();               //KHOYOSI
        //    $('#btnifrmRecetaFarm').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaFarm, 'REC-F')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaFarm, 'F');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#farmaciaRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaFarm').show();
        //            $('#btnifrmRecetaFarm').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaFarm').attr('src', url);
        //    }
        //});
        //$("#rayosRece-tab").on("click", async function () {
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaRX;
        //    $('#btnifrmRecetaRx').hide();               //KHOYOSI
        //    $('#btnifrmRecetaRx').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaRX, 'REC-RX')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaRX, 'RX');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#rayosRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaRx').show();
        //            $('#btnifrmRecetaRx').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaRx').attr('src', url);
        //    }
        //});
        //$("#ecoObstRece-tab").on("click", async function () {
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaEcoObs;
        //    $('#btnifrmRecetaEcoObs').hide();               //KHOYOSI
        //    $('#btnifrmRecetaEcoObs').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaEcoObs, 'REC-EO')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaEcoObs, 'EO');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#ecoObstRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaEcoObs').show();
        //            $('#btnifrmRecetaEcoObs').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaEcoObs').attr('src', url);
        //    }
        //});
        //$("#ecoGeneRece-tab").on("click", async function () {
        //    //console.log("#ecoGeneRece-tab")
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaEcoGene;
        //    $('#btnifrmRecetaEcoGene').hide();               //KHOYOSI
        //    $('#btnifrmRecetaEcoGene').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaEcoGene, 'REC-EG')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaEcoGene, 'EG');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#ecoGeneRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaEcoGene').show();
        //            $('#btnifrmRecetaEcoGene').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaEcoGene').attr('src', url);
        //    }
        //});
        //$("#anatoPatoRece-tab").on("click", async function () {
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaAnatPat;
        //    $('#btnifrmRecetaAnaPatolg').hide();               //KHOYOSI
        //    $('#btnifrmRecetaAnaPatolg').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaAnatPat, 'REC-AP')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaAnatPat, 'AP');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#anatoPatoRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaAnaPatolg').show();
        //            $('#btnifrmRecetaAnaPatolg').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaAnaPatolg').attr('src', url);
        //    }
        //});
        //$("#patoClinicaRece-tab").on("click", async function () {
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaPatCli;
        //    $('#btnifrmRecetaPatoClini').hide();               //KHOYOSI
        //    $('#btnifrmRecetaPatoClini').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaPatCli, 'REC-PC')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaPatCli, 'PC');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#patoClinicaRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaPatoClini').show();
        //            $('#btnifrmRecetaPatoClini').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaPatoClini').attr('src', url);
        //    }
        //});
        //$("#bancoSangreRece-tab").on("click", async function () {
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaBs;
        //    $('#btnifrmRecetaBs').hide();               //KHOYOSI
        //    $('#btnifrmRecetaBs').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaBs, 'REC-BS')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaBs, 'BS');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#bancoSangreRece-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaBs').show();
        //            $('#btnifrmRecetaBs').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaBs').attr('src', url);
        //    }
        //});
        //$("#interconsulta-tab").on("click", async function () { //jdelgado011
        //    console.log("no funciona", idRecetaInterconsulta)            
        //    //var url = "/Atencion/ImprimeRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + $('#hdIdCuentaAtencion').val() + "&idReceta=" + idRecetaInterconsulta; // jdelgado011;
        //    $('#btnifrmRecetaInterconsulta').hide();               //KHOYOSI
        //    $('#btnifrmRecetaInterconsulta').attr('href', '#');               //KHOYOSI
        //    $('#modalReceta iframe').attr('src', '');               //KHOYOSI
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaInterconsulta, 'REC-I')               //KHOYOSI
        //    if (typeof firma === 'undefined') {
        //        alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //        const pdf = await Utilitario.GenerarRecetaPdf($('#hdIdCuentaAtencion').val(), idRecetaInterconsulta, 'I');
        //        if (pdf) {
        //            alerta('1', 'Se generó el documento correctamente.')
        //            $("#interconsulta-tab").click();
        //        }
        //    } else {
        //        if (firma.statusFirma == 0) {
        //            $('#btnifrmRecetaInterconsulta').show();
        //            $('#btnifrmRecetaInterconsulta').attr('href', firma.ruta);               //KHOYOSI
        //        }
        //        url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
        //        $('#ifrmRecetaInterconsulta').attr('src', url);
        //    }            
        //});
        ////=============================================================================//

        //// JDELGADO J0 CAMBIAR RECETA                 //COMENTADO POR KHOYOSI
        //function syncFile(idCuenta, idReceta) {
        //    fetch("/Atencion/FirmaRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuenta + "&idReceta=" + idReceta, {
        //        method: 'GET',
        //        headers: {
        //            "Content-Type": "application/json",
        //        },
        //    })
        //        .then(res => res.json())
        //        .then(res => {
        //            //console.log(res);
        //            window.open(res.resulfirma)
        //        });
        //}

        //function openSyncFile(idCuenta, idReceta) {
        //    fetch("/Atencion/GetRecetasByIdReceta?area=ConsultaExterna&idCuentaAtencion=" + idCuenta + "&idReceta=" + idReceta, {
        //        method: 'GET',
        //        headers: {
        //            "Content-Type": "application/json",
        //        },
        //    })
        //        .then(res => res.json())
        //        .then(res => {
        //            imprimiInforme3(idCuenta, res.data.table[0].code, res.data.table[0].idDoc, idReceta)
        //        });
        //}

        ////////////////////////COEMTNADO POR KHOYOSI - REEMPLAZADO POR NUEVA VERSION//////////////////////////////
        //$("#btnifrmRecetaFarm").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaFarm);
        //});
        //$("#btnifrmRecetaRx").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaRX);
        //});
        //$("#btnifrmRecetaEcoObs").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaEcoObs);
        //});
        //$("#btnifrmRecetaEcoGene").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaEcoGene);
        //});
        //$("#btnifrmRecetaAnaPatolg").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaAnatPat);
        //});
        //$("#btnifrmRecetaPatoClini").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaPatCli);
        //});
        //$("#btnifrmRecetaBs").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaBs);
        //});
        //$("#btnifrmRecetaInterconsulta").on("click", function () {
        //    syncFile($('#hdIdCuentaAtencion').val(), idRecetaInterconsulta);  // jdelgado011
        //});
        //////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////KHOYOSI////////////////////////////////////////////////////////COEMNTADO POR KHOYOSI
        //$("#btnifrmRecetaFarmFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaFarm);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaFarm, 'REC-F')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaRxFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaRX);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaRX, 'REC-RX')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaEcoObsFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaEcoObs);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaEcoObs, 'REC-EO')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaEcoGeneFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaEcoGene);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaEcoGene, 'REC-EG')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaAnaPatolgFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaAnatPat);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaAnatPat, 'REC-AP')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaPatoCliniFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaPatCli);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaPatCli, 'REC-PC')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaBsFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaBs);
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaBs, 'REC-BS')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        //$("#btnifrmRecetaInterconsultaFirmado").on("click", async function () {
        //    //openSyncFile($('#hdIdCuentaAtencion').val(), idRecetaInterconsulta); // jdelgado011
        //    const firma = await Utilitario.SeleccionarFirmaDigital($('#hdIdCuentaAtencion').val(), idRecetaInterconsulta, 'REC-I')           //KHOYOSI
        //    imprimirRecetaConFirma(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);           //KHOYOSI
        //});
        ////////////////////////////////////////////////////////////////////////////////////////////////
        

        $('#btnModificarAtenciones').on('click', async function () {
            DesbloquearCampos();
            await mostrar(1)            
        })

        $('#btnEliminarAtenciones').on('click', function () {
            //mostrar(3);
        })

        $('#btnConsultarAtenciones').on('click', async function () {            
            await mostrar(4);
            BloquearCampos();
        })

        $('#btnImprimeAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            tipoFormato = 0;
            if (objrow.usaModuloMaterno) {
                tipoFormato = 1;
            }
            else {
                tipoFormato = 0;
            }
            imprimiInforme(objrow.idCuentaAtencion, tipoFormato, objrow.idProCabecera)
        })

        $('#btnImprimeRecetas').on('click', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}

            const recetas = await ListaRecetasCabeceras();
            //console.log(recetas);
            VisorReceta.AbrirVisorRecetas(recetas);

            //$('#modalReceta').modal('show');

            //// JDELGADO J0 CAMBIAR RECETAS
            //showHideTabs(idRecetaFarm, '#farmaciaRece');
            //showHideTabs(idRecetaRX, '#rayosRece');
            //showHideTabs(idRecetaEcoObs, '#ecoObstRece');
            //showHideTabs(idRecetaEcoGene, '#ecoGeneRece');
            //showHideTabs(idRecetaAnatPat, '#anatoPatoRece');
            //showHideTabs(idRecetaPatCli, '#patoClinicaRece');
            //showHideTabs(idRecetaBs, '#bancoSangreRece');
            //showHideTabs(idRecetaInterconsulta, '#interconsultaRece'); //jdelgado011

            ////$(`.nav-tabs a[href="${tabSelect}"]`).tab('show');
            //setTimeout(() => {
            //    $(`a[href="${tabSelect}"]`).click();
            //}, 800)

            // END JDELGADO J0 CAMBIAR RECETAS
        })

        ///COMENTADO POR KHOYOSI
        //$('#btnCerrarRecetas').on('click', function () {
        //    $('#modalReceta iframe').attr('src', '');
        //    $('#modalReceta').modal('hide');
        //})

        //$('#btnguardar').on('click', async function () { // comentar para pruebas de modularizacion
            
        //    Cargando(1);

        //    const data = await GuardarAtencion();
        //    if (data == true) {
        //        const datarec = await Ordenes.GuardarOrdenesMedicas();
        //        console.log(datarec);
        //        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        //        ListaAtencionesCE();
        //    }

        //    Cargando(0);
        //});


        $('#tblCSAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                AtencionMedicaInit.oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = AtencionMedicaInit.oTable_atenciones.api(true).row($(this)).index();
            var row = AtencionMedicaInit.oTable_atenciones.fnGetData(pos);

            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);
            $('#txtDatos').html('N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            $('#txtDatoCuenta').val(row.idCuentaAtencion);
            $('#txtDatoPaciente').val(row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres);
            $('#txtDatoHistoria').val(row.nroHistoriaClinica);
            $('#txtDatoEdad').val(row.edadPaciente);
        });



        //$('#btnBuscarAtenciones').on('click', async function () { // probablemente se deba borrar si la modularizacion funciona
        //    $('#lblMedicoProgramado').html('');
        //    if ($('#txtFechaAtencion').val() == "") {
        //        alerta('2', 'Ingrese fecha de atencion');
        //        return false;
        //    }
        //    else {
        //        //$('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
        //        $('#lblMedicoProgramado').html($('#cboConsultorio>option:selected').attr("med"))            //KHOYOSI
        //        ListaAtencionesCE();
        //        await CargarCatalogo();                   //KHOYOSI
        //        await CargarModulo($('#cboConsultorio').val());
        //    }
        //    $('html, body').animate({
        //        scrollTop: $(".head").offset().top
        //    }, 1000);


        //});

    }


    /////////////////////////FUNCION GUARDAR ATENCION//////////////////////////////// si funciona modularizacion se debe eliminar
    async function GuardarAtencion() {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        fechaDiaValor = fechaDia();
        valorFecha = fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)


        if (valorFecha) {
            alerta('3', 'No se puede relizar una atencion antes de la fecha de la cita');
            return false;
        }
        // datos triaje
        if ($("#txtPeso").val() == "") {
            $("#txtPeso").focus();
            alerta('2', 'Ingrese peso de triaje');
            return false
        }

        if ($("#txtTalla").val() == "") {
            $("#txtTalla").focus();
            alerta('2', 'Ingrese talla de triaje');
            return false
        }

        //NINIO SANO INICIO
        if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
            if (validaEntrevista($("#cboClasisifcacion").val()) == false) {
                $('.nav-tabs a[href="#entrevista"]').tab('show');
                return false;
            }


            if (AtencionMedicaInit.permisoClasiPaciente == 1) {
                if (isEmpty($("#cboClasisifcacion").val())) {
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                    alerta('2', 'Seleccione Clasificacion de Paciente');
                    $("#cboClasisifcacion").focus()
                    return false
                }
            }

        }
        else {
            // ESTO SOLO ES PARA PERINATAL
            if (objrow.usaModuloMaterno) {
                if ($("#chkCalculaFechaEco").is(':checked')) {
                    if ($("#txtFEcog").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('2', 'Ingrese fecha ecografica');
                        return false;
                    }

                }

                if ($("#chkMuestraEco").is(':checked')) {
                    if ($("#txtFEcog").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('3', 'Ingrese fecha ecografica');
                        return false;
                    }
                    if (!($("#chkCalculaFechaEco").is(':checked'))) {
                        alerta('2', 'Seleccione calcule con ecografía para realizar los calculos de semas y dias de gestación');
                        $("#chkCalculaFechaEco").focus();
                        return false;
                    }
                }
                else {
                    if ($("#txtFUM").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        alerta('2', 'Ingrese fecha de ultima regla');
                        $("#txtFUM").focus();
                        return false;
                    }
                }

                if ($("#txtSemanas").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese semanas de gestacion');
                    return false;
                }

                if ($("#txtDias").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese dias de gestacion');
                    return false;
                }

                if ($("#txtFPP").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese fecha probable de parto');
                    return false;
                }

                if ($('#txtGestasP').val() != "") {
                    if ($('#txtGestasP').val() >= 1) {
                        if ($("#txtFinEmb").val() == "") {
                            $('.nav-tabs a[href="#Perinatal"]').tab('show');
                            $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                            $('.nav-tabs a[href="#anteceObst"]').tab('show');
                            $("#txtFinEmb").focus();
                            alerta('2', 'Ingrese fin de embarazo anterior');
                            return false;
                        }

                        fechaEm = fechaCorrecta($("#txtFinEmb").val(), objrow.fechaIngreso2)

                        if (fechaEm) {
                            $('.nav-tabs a[href="#Perinatal"]').tab('show');
                            $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                            $('.nav-tabs a[href="#anteceObst"]').tab('show');
                            $("#txtFinEmb").focus();
                            alerta('3', 'La Fecha de fin de embarazo anterior no puede ser mayor a la fecha del control');
                            return false;
                        }
                    }
                }

                if ($("#txtPesoPregesta").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                    $('.nav-tabs a[href="#anteceObst"]').tab('show');
                    $("#txtPesoPregesta").focus();
                    alerta('2', 'Ingrese peso Pregestacional - kg ');

                    return false;
                }

                if ($('#cboTipoEmbrazo').val() == 2) {
                    if ($("#txtNroFetos").val() == "") {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        $('.nav-tabs a[href="#controlPer"]').tab('show');
                        $('.nav-tabs a[href="#dtosBasales"]').tab('show');
                        $("#txtNroFetos").focus();
                        alerta('2', 'Ingrese peso N° de fetos');

                        return false;
                    }
                }

                if ($('#txtMotivoConsultaPeri').val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('.nav-tabs a[href="#controlPer"]').tab('show');
                    $("#txtMotivoConsultaPeri").focus();
                    alerta('2', 'Ingrese motivo de consulta');
                    return false;
                }
            }
        }

        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var cantidadtDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (cantidadtDiagnosticos.count() == 0) {
            alerta('2', 'Ingrese Diagnosticos');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        if ($('#chkNuevo').prop('checked') === false) {
            alerta('2', 'Seleccione un Episodio');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $('#chkNuevo').focus();
            return false;
        }



        if (isEmpty($("#cboDestino").val())) {
            alerta('2', 'Seleccione Destino');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $("#cboDestino").focus()
            return false
        }
        //RQ0002 RMOREANOC
        if ($("#cboDestino").val() == 60) {

            if (isEmpty($("#txtProximaConsulta").val())) {
                alerta('2', 'Ingrese la fecha de su próxima cita.');
                $("#txtProximaConsulta").focus();
                return false;
            }

            if ($("#cboTipoConsulta").val() == -1) {
                alerta('2', 'Elegir el tipo de consulta.');
                $("#cboTipoConsulta").focus();
                return false;
            }

        }

        if (isEmpty($('#txtFechaVigencia').val())) {
            alerta('2', 'Ingrese fecha de vigencia');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $('.nav-tabs a[href="#farmacia"]').tab('show');
            $("#txtFechaVigencia").focus();

            return false;
        }
        //RQ0002 RMOREANOC

        /////////////KHYOOSI (verficia si se ha guardado la hoja de refcon)///////////////////// 
        const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
        if (permisoRefcon == '1') {
            if (estadoGuardadoRefCon == false) {
                alerta('2', 'No ha guardado los datos de Referencia o Contrareferencia.');
                return false;
            }
        }
        ////////////////////////////////////////

        if (objrow.idEstadoAtencion == 1) {
            var epiNuevo = 0
            var epiCierre = 0
            if ($('#chkNuevo').prop('checked') === true) {
                epiNuevo = 1
            }

            if ($('#chkCierre').prop('checked') === true) {
                epiCierre = 1
            }

            var formData = new FormData();

            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
            var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
            var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
            var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
            var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
            var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
            var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
            var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12) // jdelgado011


            //-----------------------------DATOS EXTERNOS
            formData.append('fechaIngreso', objrow.fechaIngreso);
            formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
            formData.append('antecedPatologico', $('#txtPatologicos').val());
            formData.append('antecedObstetrico', $('#txtObstetricos').val());
            formData.append('antecedAlergico', $('#txtAlergias').val());
            formData.append('antecedFamiliar', $('#txtFamiliares').val());
            formData.append('antecedentes', $('#txtOtros').val());


            if ($('#chkEsEvaluacionPreAnestesica').is(':checked')) { // para atención pre-anestésica
                Anestesiologia.GuardarAtencionAnestesiologia()
            }

            //NINIO SANO cambia motivo de consulta
            if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
                formData.append('CitaMotivo', $('#txtMotivoCons').val());
                formData.append('CitaExamenClinico', $('#txtExamenC').val());
            }
            else {
                if (objrow.usaModuloNinoSano) {
                    formData.append('CitaMotivo', $('#txtMotivoConsNinio').val());
                    formData.append('CitaExamenClinico', $('#txtExamenCNinio').val());
                    formData.append('enfermedadActual', $('#txtEnfermedadActual').val());
                    formData.append('tiempoEnfermedad', $('#txtTiempoEmfermedad').val());
                }
                if (objrow.usaModuloMaterno) {
                    formData.append('CitaMotivo', $('#txtMotivoConsultaPeri').val());
                }

            }



            // Fin NINIO SANO

            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());
            formData.append('CitaAntecedente', $('#txtAtencedentes').val());
            //--------------------------------------------------------------------
            formData.append('idEnEstablecimiento', $('#idEnEstablecimiento').val());
            formData.append('idEnServicio', $('#idEnServicio').val());

            formData.append('tipoClasificacion', $('#cboClasisifcacion').val());
            formData.append('nroHistoria', objrow.nroHistoriaClinica);
            formData.append('nroControles', $('#txtControles').val());
            formData.append('edadGestacional2', $('#txtEdadGestacional').val());
            formData.append('nroGestas', $('#txtGestas').val());

            formData.append('idMedico', objrow.idMedico);
            formData.append('idServicioIngreso', objrow.idServicioIngreso);
            formData.append('idCuentaAtencion', objrow.idCuentaAtencion);
            formData.append('nroEpisodio', $('#cboEpisodio').val());
            formData.append('idPaciente', $('#idPaciente').val());
            formData.append('epiNuevo', epiNuevo);
            formData.append('epiCierre', epiCierre);
            formData.append('idAtencion', $('#idAtencion').val());

            //DATOS DE LA ATENCION CE

            formData.append('idDestino', $('#cboDestino').val());
            formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
            formData.append('lstRecetaRx', ListaRecetaDetalleRx);
            formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
            formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
            formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());

            //RQ0002 DATOS ADICIONALES DE LA ATENCION 

            formData.append('ProximaCita', $('#txtProximaConsulta').val());
            formData.append('idTipoConsultaProxCita', $("#cboTipoConsulta").val());

            // FIN RQ0002


            //DATOS DE PERINATAL
            //DATOS PROCABECERA

            if (objrow.usaModuloMaterno == true) {
                formData.append('CEperinatal', true);
            }
            else {
                formData.append('CEperinatal', false);
            }

            formData.append('IdPrograma', 1);
            formData.append('IdProcabecera', $("#idCabecera").val());

            if ($("#idControl").val() == 0) {
                formData.append('IdControl', 1);
            }
            else {
                formData.append('IdControl', $("#idControl").val());
            }

            formData.append('FechaControl', $('#txtFechaControl').val());
            //DATOS EVAL. EMERGENCIA

            formData.append("IdAtencion", objrow.idAtencion);
            formData.append("FechaUR", $("#txtFUM").val());
            formData.append("FechaPP", $("#txtFPP").val());
            formData.append("EdadGestacional", $("#txtSemanas").val());
            formData.append("NroFetos", $("#txtNroFetos").val());
            formData.append("DiasGestacionalEco", $("#txtDiasEco").val());
            formData.append("SemanaGestacionalEco", $("#txtSemasEco").val());



            if ($('#chkMuestraEco').prop('checked') === false) {
                formData.append("FechaEcoAct", 0);
                formData.append("FechaEco", "");
            }
            else {
                formData.append("FechaEcoAct", 1);
                formData.append("FechaEco", $("#txtFEcog").val());
            }

            formData.append("DiasGestacional", $("#txtDias").val());

            if ($('#chkCalculaFechaEco').prop('checked') === false) {
                formData.append("CalculaFE", 0);
            }
            else {
                formData.append("CalculaFE", 1);
            }


            /***********************ANTECEDENTES PERSONALES*****************************/
            formData.append("Tbc", $('#rdbTbcPSi').prop('checked'));
            formData.append("TbcDescripcion", $("#txtTbcP").val());
            formData.append("Diabetes", $('#rdbPDiabSi').prop('checked'));
            formData.append("DiabetesDescripcion", $("#txtPDiabe").val());
            formData.append("PreeclampsiaEclampsia", $('#rdbPreePSi').prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcion", $("#txtPreeP").val());
            formData.append("Vih", $('#rdbVIHSi').prop('checked'));
            formData.append("vihDescripcion", $("#txtVihP").val());
            formData.append("Alergia", $('#rdbAlergSi').prop('checked'));
            formData.append("AlergiaDescripcion", $("#txtAlergiaP").val());
            formData.append("Otros", $('#rdbOtrosAntePerSi').prop('checked'));
            formData.append("OtrosDescripcion", $("#txtOtrosP").val());
            formData.append("CirugiaMayor", $('#rdbCMSi').prop('checked'));
            formData.append("CirugiaMayorDescripcion", $("#txtCM").val());
            formData.append("Violencia", $('#rdbVioSi').prop('checked'));
            formData.append("ViolenciaDescripcion", $("#txtVio").val());
            formData.append("Hipertencion", $('#rdbHiperPSi').prop('checked'));
            formData.append("HipertencionDescripcion", $("#txtHiperP").val());

            formData.append("VacunaPrevia", $('#rdbVacunaPreSi').prop('checked'));
            formData.append("VacunaPreviaDescripcion", $("#txtVacunaPre").val());


            /***********************ANTECEDENTES FAMILIARES*****************************/
            formData.append("TbcFam", $("#rdbTbcSi").prop('checked'));
            formData.append("TbcDescripcionFam", $("#txtTbc").val());
            formData.append("DiabetesFam", $("#rdbDiabSi").prop('checked'));
            formData.append("DiabetesDescripcionFam", $("#txtDiabe").val());
            formData.append("PreeclampsiaEclampsiaFam", $("#rdbPreeSi").prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcionFam", $("#txtPree").val());
            formData.append("OtraCondMedGraveDescripcionFam", $("#txtOtrosFam").val());
            formData.append("OtraCondMedGraveFam", $("#rdbOtrosSi").prop('checked'));
            formData.append("HipertencionFam", $("#rdbHiperSi").prop('checked'));
            formData.append("HipertencionDescripcionFam", $("#txtHiper").val());
            /***********************ANTECEDENTES OBSTETRICOS**************************************/

            formData.append("Gestas", $("#txtGestasP").val());
            formData.append("abortos", $("#txtAbortos").val());
            formData.append("Vaginales", $("#txtVaginales").val());
            formData.append("NacidosVivos", $("#txtNacidosVivos").val());
            formData.append("Viven", $("#txtViven").val());
            formData.append("Partos", $("#txtPartos").val());
            formData.append("Cesareas", $("#txtCesareas").val());
            formData.append("NacidosMuertos", $("#txtNacMuertos").val());
            formData.append("Muerto1Seman", $("#txt1Sem").val());
            formData.append("Despues1Seman", $("#txtDesp1Sem").val());

            formData.append("ceromastres", $("#cho3").prop('checked'));//cho3
            formData.append("menor2500gr", $("#ch2500").prop('checked'));
            formData.append("Multiple", $("#chMult").prop('checked'));
            formData.append("memor37sm", $("#ch37Sem").prop('checked'));

            formData.append("PesoPregestacional", $("#txtPesoPregesta").val());
            formData.append("FechaFinEmbarazoAnt", $("#txtFinEmb").val());
            formData.append("idTerminacion", $("#cboTerminacion").val());

            //alert($("#cboAborto").val());

            formData.append("idAborto", $("#cboAborto").val());
            formData.append("FracasoMetodo", $("#cbofracaso").val());
            formData.append("EmbarazoPlaneado", $("#cboEmbplaneado").val());
            formData.append("EmbarazoEctopico", $("#chEtopico").prop('checked'));
            formData.append("mayor4000g", $("#ch4000g").prop('checked'));
            formData.append("P1", $("#txtPar1").val());
            formData.append("P2", $("#txtPar2").val());
            formData.append("P3", $("#txtPar3").val());
            formData.append("P4", $("#txtPar4").val());

            //GIENCOOBSTETRA
            //formData.append("IdAtencion", $("#").val());
            formData.append("LGeBus", ($('#rdbGBNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LVagina", ($('#rdVaginadNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LCervix", ($('#rdbCervixNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LUtero", ($('#rdbUteroNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DGeBus", $("#txtGB").val());
            formData.append("DVagina", $("#txtVagina").val());
            formData.append("DCervix", $("#txtCervix").val());
            formData.append("DUtero", $("#txtUtero").val());
            formData.append("LAnexos", ($('#rdbAnexosNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LDouglas", ($('#rdbFsDouglasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LParametros", ($('#rdbParamNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LMamas", ($('#rdbMamasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DAnexos", $("#txtAnexos").val());
            formData.append("DDouglas", $("#txtFsDouglas").val());
            formData.append("DParametros", $("#txtParam").val());
            formData.append("DMamas", $("#txtMamas").val());

            formData.append("LUA", $("#txtAlturaUterina").val());
            formData.append("LLCF", $("#txtLfc").val());
            formData.append("LDU", $("#txtDU").val());

            var situacion, posicion, presentacion, dips = 0;
            situacion = $('#rdbSitLongitudinal').prop('checked') == true ? 1 : $('#rdbSitTransversal').prop('checked') == true ? 0 : 5
            formData.append("LSituacion", situacion);

            posicion = $('#rdbPosDerecha').prop('checked') == true ? 1 : $('#rdbPosIzquierda').prop('checked') == true ? 0 : 5
            formData.append("LPosicion", posicion);

            presentacion = $('#rdbPreCefalica').prop('checked') == true ? 1 : $('#rdbPrePodalica').prop('checked') == true ? 0 : 5
            formData.append("LPresentacion", presentacion);

            dips = $('#rdbDipsI').prop('checked') == true ? 1 : $('#rdbDipsII').prop('checked') == true ? 2 : $('#rdbDipsIII').prop('checked') == true ? 3 : 4
            formData.append("LDips", dips);

            formData.append("DF1Spp", $("#txtF1SiPoPr").val());
            formData.append("DF2Spp", $("#txtF2SiPoPr").val());
            formData.append("DF3Spp", $("#txtF3SiPoPr").val());
            formData.append("LF1Lcf", $("#txtF1Lfc").val());
            formData.append("LF2Lcf", $("#txtF2Lfc").val());
            formData.append("LF3Lcf", $("#txtF3Lfc").val());

            formData.append("LSoplos", ($('#rdbSoplosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LHidraminios", ($('#rdbHidromiosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPonderado", $("#txtPonderado").val());


            //formData.append("LDilatacion", $("#txtPonderado").val());

            formData.append("DObservaciones", $("#txtObserControl").val());
            formData.append("LEstadoGeneral", ($('#rdbEstGSNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoCV", ($('#rdbCardNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAbdomen", ($('#rdbAbdomenNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoR", ($('#rdbAptRespNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoU", ($('#rdbAptUrinpNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LExtremidades", ($('#rdbExtremNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DEstadoGeneral", $("#txtEstdGeneSens").val());
            formData.append("DAparatoCV", $("#txtCardvas").val());
            formData.append("DAbdomen", $("#txtAbdomenNormal").val());
            formData.append("DAparatoR", $("#txtbAptResp").val());
            formData.append("DAparatoU", $("#txtbAptUrin").val());
            formData.append("DExtremidades", $("#txtExtrem").val());
            formData.append("LTipoEmbarazo", $("#cboTipoEmbrazo").val());

            formData.append("DEdemas", $("#txtEdemas").val());
            formData.append("DReflejos", $("#txtReflejos").val());

            formData.append("ObservacionGinecologica", $("#txtObserExamenes").val());

            formData.append("Proteinura", $("#txtProteinuria").val());
            formData.append("MovFetales", $("#txtMovFetales").val());
            formData.append("MFF01", $("#txtF1Mf").val());
            formData.append("MFF02", $("#txtF2Mf").val());
            formData.append("MFF03", $("#txtF3Mf").val());

            formData.append("SignosAlarma", $("#txtsignosAlarma").val());
            formData.append("Pap", $('#rdbPapSi').prop('checked'));

            //Traije
            formData.append("NroHistoriaClinica", objrow.nroHistoriaClinica);
            formData.append("CitaFecha", objrow.fechaIngreso2);
            formData.append("CitaIdServicio", objrow.idServicioIngreso);

            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()


            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePerimCefalico", $("#txtPC").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());
            formData.append("CitaObservaciones", $("#txtOtrasObservacionesGe").val()); //se 

            //pelvis
            formData.append("LPelvisGinecoide", $('#rdbPelvisGSI').prop('checked') == true ? 1 : 0);
            formData.append("LCompatibilidadF", $('#rdbCompativilidadSI').prop('checked') == true ? 1 : $('#rdbCompativilidadNo').prop('checked') == true ? 2 : 0);

            //nuevos 
            formData.append("Tratamiento", $("#txtTratamiento").val());
            formData.append("PlanTrabajo", $("#txtPlanTrabajo").val());

            //JDELGADO011 INTERCONSULTA
            formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
            formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
            formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
            formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
            //JDELGADO011 INTERCONSULTA

            // jdelgado anestesio
            formData.append("esPreAnestesica", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0)
            // jdelgado anestesio

            //NINIO SANO 
            //ninio sano remplaza tencion

            if (objrow.usaModuloNinoSano == true) {
                formData.append("Apetito", $("#txtApetitoNinio").val());
                formData.append("Suenio", $("#txtSuenioNinio").val());
                formData.append("Sed", $("#txtSedNinio").val());
                formData.append("Orina", $("#txtOrinaNinio").val());
                formData.append("Deposiciones", $("#txtDiposicionesNinio").val());

                formData.append('CEninioSano', true);
                formData.append("tipoEmbarazo", $('#rdbEmbarazoNormal').prop('checked') == true ? 1 : 2);
                formData.append("patologias", $("#txtPatologia").val());
                formData.append("nroEmbarazo", $("#txtNroEmbarazo").val());
                formData.append("atencionPrenatal", $('#rdbAtenPrenatalSi').prop('checked') == true ? 1 : 2);
                formData.append("nroApn", $("#txtNroAPN").val());
                formData.append("lugarApn", $("#txtLugarAPN").val());
                formData.append("tipoParto", $('#rdbPartoEutocico').prop('checked') == true ? 1 : 2);
                formData.append("complicacionParto", $("#txtComplicaciones").val());
                formData.append("lugarParto", $('#rdbLugarPartoEeSs').prop('checked') == true ? 1 : $('#rdbLugarPartoDomicilio').prop('checked') == true ? 2 : 3);
                formData.append("atendidoPor", $('#rdbAtendidoPorPS').prop('checked') == true ? 1 : $('#rdbAtendidoPorTec').prop('checked') == true ? 2 : $('#rdbAtendidoPorACS').prop('checked') == true ? 3 : $('#rdbAtendidoPorFM').prop('checked') == true ? 4 : 5);
                formData.append("atendidoPorotro", $("#txtAtendidoPorOtro").val());
                //->nacimiento
                formData.append("estaGestacionalAlNacer", $("#txtEdadGestacionalNacer").val());
                formData.append("pesoAlNacer", $("#txtPesoNacer").val());
                formData.append("tallaAlNacer", $("#txtTallaNacer").val());
                formData.append("perimetroCefalico", $("#txtPerimetricoCefalico").val());
                formData.append("perimetroToracico", $("#txtPerimetricoToracico").val());

                formData.append("inmedito", $('#rdbInmediatoSi').prop('checked') == true ? 1 : 2);
                formData.append("apgar1min", $("#txtAPGAR1").val());
                formData.append("apgar5min", $("#txtAPGAR5").val());
                formData.append("reanimacion", $('#rdbReanimacionSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatal", $('#rdbPatologiaNeoSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatalDescripcion", $("#txtEspecifique").val());
                formData.append("hospitalizacion", $('#rdbHospitalizacionSi').prop('checked') == true ? 1 : 2);
                formData.append("tiempoHospitalizado", $("#txtTiempoHospitalizacion").val());

                //->alimentacion/patologicos
                formData.append("alimentPrimerosSeisMeses", $('#rdbPrimMesesLME').prop('checked') == true ? 1 : $('#rdbPrimMesesMIXTA').prop('checked') == true ? 2 : 3);
                formData.append("alimentInicioAlimentacionComplementaria", $("#txtIncioAlimComplementaria").val());
                formData.append("alimentSumplementoFe", $('#rdbSumplementoSi').prop('checked') == true ? 1 : 2);

                formData.append("patTbc", $('#rdbNinoTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("patSobaAsma", $('#rdbNinoSobaAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("patEpilepsia", $('#rdbNinoEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patInfecciones", $('#rdbNinoInfeccionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patHospitalizaciones", $('#rdbNinoHospitalizacionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patTransferenciaSangre", $('#rdbNinoTransfucionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patCirugia", $('#rdbNinoCirugiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patDisplacia", $('#rdbNinoDisplacíaSi').prop('checked') == true ? 1 : 2);
                formData.append("patHipotiroidismo", $('#rdbNinoHipotiroidismoSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergia", $('#rdbNinoAlergiaMedSi').prop('checked') == true ? 1 : 2);
                formData.append("patOtroAntecedentes", $('#rdbNinoOtrosAntecSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergiaDesc", $("#txtNinoSanoAlergiaMedicamentos").val());
                formData.append("patOtroAntecedentesDesc", $("#txtNinoSanoOtroAntec").val());

                //->Familaires/Viveinda 
                formData.append("famiTuberculosis", $('#rdbNinoFamiliaresTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiTuberculosisDesc", $("#txtNinoFamiliaresTbc").val());
                formData.append("famiAsma", $('#rdbNinoFamiliaresAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAsmaDesc", $("#txtNinoFamiliaresAsma").val());
                formData.append("famiVih", $('#rdbNinoFamiliaresSidaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiVihDesc", $("#txtNinoFamiliaresSida").val());
                formData.append("famiDiabetes", $('#rdbNinoFamiliaresDiabetesSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDiabetesDesc", $("#txtNinoFamiliaresDiabetesSi").val());
                formData.append("famiEpilepsia", $('#rdbNinoFamiliaresEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiEpilepsiaDesc", $("#txtNinoFamiliaresEpilepsia").val());
                formData.append("famiAlerMedica", $('#rdbNinoFamiliaresAlergiaMedcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlerMedicaDesc", $("#txtNinoFamiliaresAlergiaMedc").val());
                formData.append("famiViolenciaFami", $('#rdbNinoFamiliaresViolenciaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiViolenciaFamiDesc", $("#txtNinoFamiliaresViolencia").val());
                formData.append("famiAlcoholismo", $('#rdbNinoFamiliaresAlcoholismoSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlcoholismoDesc", $("#txtNinoFamiliaresAlcoholismo").val());
                formData.append("famiDrogadiccion", $('#rdbNinoFamiliaresDrogadiccionSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDrogadiccionDesc", $("#txtNinoFamiliaresDrogadiccion").val());
                formData.append("famiHepatitisB", $('#rdbNinoFamiliaresHepatitisSi').prop('checked') == true ? 1 : 2);
                formData.append("famiHepatitisBDesc", $("#txtNinoFamiliaresHepatitis").val());
                formData.append("viviendaAguaPotable", $('#rdbAguaPotableSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaAguaPotableDesc", $("#txtAguaPotable").val());
                formData.append("viviendaDesague", $('#rdbDesagueSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaDesagueDesc", $("#txtDesague").val());

                var listaItmsEValuar = NinioAltoRiesgo.DevolverItems();
                formData.append('listaItmsEValuar', listaItmsEValuar);
                formData.append("idPlanDesarrolloPaciente", $("#hdidPlanDesarrolloPaciente").val());
                formData.append("idPlanIntegralPaciente", $("#hdidPlanIntegralPaciente").val());
                formData.append("fechaProgramada", $("#txtFechaProgramada").val());
                formData.append("fechaEjecucion", $("#txtFechaEjecucion").val());
                formData.append("idEstablecimiento", $("#hdidEstablecimiento").val());
                formData.append("evaluacion", NinioAltoRiesgo.obtenerEvaluacion());

                if (!NinioAltoRiesgo.validaItems()) {
                    alerta('2', 'Seleccione todos los items a eveluar');
                    return false;
                }
            }
            else {
                formData.append('CEninioSano', false);

                formData.append("Apetito", $("#txtApetito").val());
                formData.append("Suenio", $("#txtSuenio").val());
                formData.append("Sed", $("#txtSed").val());
                formData.append("Orina", $("#txtOrina").val());
                formData.append("Deposiciones", $("#txtDiposiciones").val());
            }

            alerta(4, 'Guardando Atención, por favor espere.');
            let datos;
            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Atencion/RegitraModifcaEpisodio?area=ConsultaExterna",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                console.log(datos);
                if (datos) {
                    if (datos.session) {
                        ///////////////COMENTADO POR KHOYOSI////////////
                        //if (datos.msjReceta != "" && datos.respuesta == true) {
                        //    VisorReceta.AbrirVisorRecetas(datos.listRecetas.table);
                        //    $('.nav-tabs a[href="#lsAtenciones"]').tab('show');

                        //    swal({
                        //        title: 'Recetas',
                        //        text: datos.msjReceta,
                        //        type: 'info',
                        //    }).done();
                        //    ListaAtencionesCE();
                        //}
                        //else {
                            if (datos.respuesta == true) {
                                alerta('1', 'Se  registro correctamente la atención');
                                //Cargando(0);
                                //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                                //ListaAtencionesCE();
                                return true
                            }
                            else {
                                alerta('2', datos.mesanje);
                                return false;
                            }

                        //}     //////////////COMENTADO POR KHOYOSI//////////////
                    }
                    else {
                        swal({
                            title: 'Atenciones',
                            text: "Su session ya expiro, vuelva a ingresar en otra ventana",
                            type: 'info',
                        }).done();
                    }
                } else {
                    alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
                }
                return false;
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }

            /////COMENTADO POR KHOYOSI
            //    Cargando(1);                
            //    $.ajax({
            //        type: 'POST',
            //        url: "/Atencion/RegitraModifcaEpisodio?area=ConsultaExterna",
            //        data: formData,
            //        dataType: "json",
            //        cache: false,
            //        contentType: false,
            //        processData: false,
            //        success: function (datos) {
            //            Cargando(0);                        
            //            if (datos) {
            //                if (datos.session) {
            //                    if (datos.msjReceta != "" && datos.respuesta == true) {
            //                        VisorReceta.AbrirVisorRecetas(datos.listRecetas.table);
            //                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');

            //                        //COEMNTADO POR KHOYOSI
            //                       //$(datos.listRecetas.table).each(function (i, obj) {

            //                       //     switch (obj.idPuntoCarga) {
            //                       //         case 21: idRecetaRX = obj.idReceta; break;
            //                       //         case 2: idRecetaPatCli = obj.idReceta; break;
            //                       //         case 3: idRecetaAnatPat = obj.idReceta; break;
            //                       //         case 11: idRecetaBs = obj.idReceta; break;
            //                       //         case 20: idRecetaEcoGene = obj.idReceta; break;
            //                       //         case 23: idRecetaEcoObs = obj.idReceta; break;
            //                       //         case 5: idRecetaFarm = obj.idReceta; break;
            //                       //         case 12: idRecetaInterconsulta = obj.idReceta; break;
            //                       //         default: break;
            //                       //     }
            //                       // });

            //                       // //$('#modalAgregar').modal('hide');
            //                       // Cargando(0);
            //                       // setTimeout(function () {
            //                       //     // JDELGADO J0 CAMBIAR RECETAS

            //                       //     showHideTabs(idRecetaFarm, '#farmaciaRece');
            //                       //     showHideTabs(idRecetaRX, '#rayosRece');
            //                       //     showHideTabs(idRecetaEcoObs, '#ecoObstRece');
            //                       //     showHideTabs(idRecetaEcoGene, '#ecoGeneRece');
            //                       //     showHideTabs(idRecetaAnatPat, '#anatoPatoRece');
            //                       //     showHideTabs(idRecetaPatCli, '#patoClinicaRece');
            //                       //     showHideTabs(idRecetaBs, '#bancoSangreRece');
            //                       //     showHideTabs(idRecetaInterconsulta, '#interconsultaRece');
        $('#tblCSAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

            //                       //     $(`a[href="${tabSelect}"]`).click();
            //                       //     $('#modalReceta').modal('show');

            //                       //     // END JDELGADO J0 CAMBIAR RECETAS
            //                       // }, 800);


            //                        swal({
            //                            title: 'Recetas',
            //                            text: datos.msjReceta,
            //                            type: 'info',
            //                        }).done();
            //                        ListaAtencionesCE();
            //                    }
            //                    else {
            //                        if (datos.respuesta == true) {
            //                            alerta('1', 'Se  registro correctamente la atencion');
            //                            //Cargando(0);
            //                            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            //                            ListaAtencionesCE();
            //                            return false
            //                        }
            //                        else {
            //                            alerta('2', datos.mesanje); // JDELGADO J0 CAMBIO MENSAJE RESPUESTA
            //                            //Cargando(0);
            //                            return false;
            //                        }

            //                    }
            //                }
            //                else {
            //                    swal({
            //                        title: 'Atenciones',
            //                        text: "Su session ya expiro, vuelva a ingresar en otra ventana",
            //                        type: 'info',
            //                    }).done();
            //                }


            //            } else {
            //                alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
            //            }
            //            return false;
            //        },
            //        error: function (result) {
            //            Cargando(0);
            //            alerta('3', datos.mesanje);
            //            return false;
            //        }
            //    });
        }
        else {
            alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
            return false
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////

    function fechaCorrecta(fecha1, fecha2) {

        var midata = new FormData();

        midata.append('fecha1', fecha1);
        midata.append('fecha2', fecha2);

        valor = false

        $.ajax({
            method: "POST",
            url: "/Atencion/validaFechaMayor?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                valor = datos.resultado
            },
            error: function (msg) {
                setTimeout(function () {
                    valor = false
                }, 900)
            }
        });

        return valor
    }

    function validaEntrevista(tipo) {
        valor = true;

        switch (tipo) {
            case "1":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtEdadGestacional').val() == "" || $('#txtEdadGestacional').val() == 0) {
                    alerta('2', 'Ingrese edad gestacional');
                    $('#txtEdadGestacional').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "2":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "") {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "3":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }
                break;
            case "4":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }

                break;

            default:
                valor = true;
            // code block
        }

        return valor

    }

    var GeneraParteDiario = async function (programacion) {
        var formData = new FormData();
        let datos;
        let resp = false;

        formData.append('programacion', programacion);        
        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/GeneraParteDiario?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);
            if (datos.estadoCreacion == 'Ok') {
                resp = true;
            } else {
                if (datos.estadoCreacion == 'NONE') {
                    alerta(2, 'No existen datos para mostrar.');
                }
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    }

    var imprimiParteDiarioSF = async function (programacion) {

        var url = "/Atencion/ParteDiarioPdfSinFirma?area=ConsultaExterna&programacion=" + programacion;
        $('#ifrmReporte').attr('src', url);
        
    }

    //var imprimiInformeSF = function (idCuentaAtencion, idProCabecera, tipoFormato) {
    //    var url = "/Atencion/AtencionPdfSinFirma?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idProCabecera=" + idProCabecera + "&tipoFormato=" + tipoFormato;

    //    $('#ifrmReporte').attr('src', url);

    //}

    var imprimiInforme2 = async function (idCuentaAtencion, code, idDoc) {
        Cargando(1);
        //var objrow = oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=A";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "CE-" + idCuentaAtencion + "-" + $.now()
                    //a.click();
                    Cargando(0);
                    AbrirVisorDocumento(url, 1);
                    
                    ListaAtencionesCE();

                } else {
                    Cargando(0);
                    alerta(2, "El documento aún no está firmado digitalmente.")
                }
                
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
            }           
        }
        request.send();
    }
    var imprimiInforme3 = function (idCuentaAtencion, code, idDoc, idReceta) { //JDELGADO J0 CAMBIAR RECETAS
        Cargando(1);
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idReceta + "&code=" + code + "&documentId=" + idDoc + "&tipo=O";
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
                a.download = "CE-" + idCuentaAtencion + "-" + $.now()
                //a.click();

                AbrirVisorDocumento(url, 1);
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
            Cargando(0);
        }
        request.send();
    }
    var imprimiParte2 = function (idRegistro, code, idDoc) {
        Cargando(1);
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idRegistro + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=P";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            if (this.response.size > 0) {
                var idServicio = $("#cboConsultorio").val()
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = "CE-" + idRegistro + "-" + $.now()
                //a.click();
                listaServicios();
                $("#cboConsultorio").val(idServicio)
                $('.chzn-select').chosen().trigger("chosen:updated");
                $("#cboConsultorio").change();
                Cargando(0);

                AbrirVisorDocumento(url, 1);
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
        }
        Cargando(0);

        request.send();
    }

    //////////////////////KHOYOSI////////////////////////////////
    var imprimirDocumentoConFirma = function (idCuentaAtencion, code, idDoc, tipo) {
        //var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();
        Cargando(1);
        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
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

                ListaAtencionesCE();
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
            Cargando(0);
        }
        request.send();
    }


    var imprimiParteDiarioConFirma = function (idRegistro, code, idDoc, tipo) {
        Cargando(1);
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idRegistro + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            if (this.response.size > 0) {
                var idServicio = $("#cboConsultorio").val()
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = "CE-" + idRegistro + "-" + $.now()
                //a.click();
                listaServicios();
                $("#cboConsultorio").val(idServicio)
                $('.chzn-select').chosen().trigger("chosen:updated");
                $("#cboConsultorio").change();
                Cargando(0);

                AbrirVisorDocumento(url, 1);
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
        }
        Cargando(0);

        request.send();
    }
    ////COMENTADO POR KHOYOSI
    //var imprimirRecetaConFirma = function (idCuentaAtencion, idRegistro, code, idDoc, tipo) {
    //    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //    //var midata = new FormData();
    //    Cargando(1);
    //    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //    //$('#ifrmReporte').attr('src', url);

    //    var request = new XMLHttpRequest();
    //    request.responseType = "blob";
    //    request.open("GET", url);
    //    request.onload = function () {
    //        if (this.response.size > 0) {
    //            var url = window.URL.createObjectURL(this.response);
    //            var a = document.createElement("a");
    //            document.body.appendChild(a);
    //            a.href = url;
    //            //a.download = this.response.name || "CE-" + $.now()
    //            a.download = tipo + idCuentaAtencion + "-" + $.now()
    //            //a.click();


    //            AbrirVisorDocumento(url, 1);
    //            if (tipo == 'REC-F') { $("#farmaciaRece-tab").click(); }
    //            if (tipo == 'REC-RX') { $("#rayosRece-tab").click(); }
    //            if (tipo == 'REC-EO') { $("#ecoObstRece-tab").click(); }
    //            if (tipo == 'REC-EG') { $("#ecoGeneRece-tab").click(); }
    //            if (tipo == 'REC-PC') { $("#patoClinicaRece-tab").click(); }
    //            if (tipo == 'REC-AP') { $("#anatoPatoRece-tab").click(); }
    //            if (tipo == 'REC-BS') { $("#bancoSangreRece-tab").click(); }
    //            if (tipo == 'REC-I') { $("#interconsulta-tab").click(); }
    //            //ListaAtencionesCE();
    //        } else {
    //            alerta(2, "El documento aún no está firmado digitalmente.")
    //        }
    //        Cargando(0);
    //    }
    //    request.send();
    //}
    //////////////////////////////////////////////////////////////////
      


    function limpiar() {
        $('#chkNuevo').prop('checked', false)
        $('#chkCierre').prop('checked', false)
        $('#hdIdCuentaAtencion').val(0);
        $('#txtMotivoConsultaPeri').val("");
        $('#txtHoraCia').val("");
        $('#HoraInicioAtencion').val("");

        IdCuentaAtencionTemp = 0;
    }


    var CargaInicial = function () {
        limpiar();
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        //$('#txtFechaAtencion').val(fechaP); // borrar si funciona la modularizacion

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");

        console.log("AtencionMedicaInit.permisoClasiPaciente", AtencionMedicaInit.permisoClasiPaciente)
        if (AtencionMedicaInit.permisoClasiPaciente == '0') { // jdelgado para el control de versiones
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }
    }


    var statusDownload = function () {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        var midata = new FormData();
        //console.log(objrow.code);
        midata.append('code', objrow.code);
        midata.append('documentId', objrow.idDoc);
        midata.append('idCuentaAtencion', objrow.idCuentaAtencion);
        midata.append('tipo', "A");

        $.ajax({
            method: "POST",
            url: "/Atencion/statusAndDownload?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


            },
            error: function (msg) {
                alerta(3, "Error al listar Cpt");
                Cargando(0)
            }
        });

    }

    var BuscaAtencionesCptCEparaFormatoHIS = function (idCuentaAtencion) {
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
            async: false,
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

    }
    var initDatablesConsumoAtencion = function () {


        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
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
                    data: "idOrdenPago",
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

    }



    return {
        init: async function () {
            /*permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC");*/
            CargaInicial();
            plugins();
            
            eventos();
            listaDestinosCE();
            listaServicios();
            listaTiposConsulta();
            TiposClasificacionPaciente();

            //initDatables();
            initDatablesConsumoAtencion();

            //permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
            //permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");

            /*permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY");*/
            
            //const refcon = await SeleccionarPermisoRefCon();
            //console.log(refcon);
            //SeleccionarPermisoFua();

            //VisorReceta.Eventos();         //KHOYOSI
        }
    };
}()

function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function

/////////////////////////KHOYOSI//////////////////////////////////
async function ModificarRefCon() {
    const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
    if (permisoRefcon == '1') {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if ($("#cboDestino").val() == 12) {
            var tipoRef = 1
        }
        if ($("#cboDestino").val() == 13) {
            var tipoRef = 2
        }

        if (objrow.usaModuloMaterno) {
            var modulo = "ModuloMaterno";
        } else if (objrow.usaModuloNinoSano) {
            var modulo = "ModuloNinoSano";
        } else {
            var modulo = "ModuloCE"
        }

        //tratamientoRefCon = $('#txtTratamiento').val();
        //$.each(lstDiagnosticos, function (i, item) {
        //    //alert(data.result[i].PageName);
        //    //var dx = $('#txtDxEgreso').val() + '\n';
        //    listaDxRefCon = listaDxRefCon + 'Dx ' + (i + 1) + ' = ' + lstDiagnosticos[i].codigoCIE10 + '- ' + lstDiagnosticos[i].descripcion + '  (' + lstDiagnosticos[i].tipoDiagnostico + ') \n';
        //    //$('#txtDxEgreso').val($('#txtDxEgreso').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');
        //});

        //Referencias.LimpiarModal();
        //Referencias.HabilitarModal();
        const data = await Referencias.CargarDataSinValidar(objrow.idCuentaAtencion, objrow.idAtencion, tipoRef, modulo);
        //const data = async () => {
        //    Referencias.CargarDataSinValidar(objrow.idCuentaAtencion, objrow.idAtencion, tipoRef, modulo);
        //    console.log(globalData);
        //}
        $("#btnGuardar").show();
    }    
}


async function CargarModulo(idServicio) {
    var midata = new FormData();
    midata.append('idServicio', idServicio);
    $("#modulo").html("");

    console.log('se busco', AtencionMedicaInit.oTable_atenciones)

    let datos;
    try {
        datos = await
            $.ajax({
                method: "POST",
                url: "/Atencion/CargarModulo?area=ConsultaExterna",
                data: midata,
                dataType: "HTML",
                cache: false,
                processData: false,
                contentType: false,
            });
        $("#modulo").html(datos);
        //$("#modulo").load('/Atencion/CargarModulo');
        //console.log(datos);
    } catch (error) {
        //console.error(error)
        alerta(3, JSON.stringify(error));
    }
}

//////////////////////////////////////////////////////////////////////




///////////////////////////////////////KHOYOSI////////////////////////////////////////
/*function GeneraFormatoFua(idCuenta) {    
    var url = "/Sis/GenerarFUA?area=Comun&idCuentaAtencion=" + idCuenta;
    window.location.href = url;
}*/

//async function GeneraFormatoFua(idCuenta) {
//    //const data1 = await RegistroRN.GenerarParteDiario(idCuenta, fecha);
//    Cargando(1);
//    var url = "/Sis/GenerarFormatoFua?area=Comun";

//    $("#visorDocumento").attr("src", url);
//    $('#modalVisorDocumento').modal('show');

//    Cargando(0);
//    /*var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

//    if (EvaluacionEmergencia.ValidarVariablesEvaluacionNeonatal()) {
//        Cargando(1);
//        //Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
//        const data1 = await EvaluacionEmergencia.GuardarEvaluacionNeonatal();
//        const data2 = await EvaluacionEmergencia.GuardarAntecedentes();
//        const data3 = await EvaluacionEmergencia.GuardarExamenNeonatal();
//        if (nuevaEvalNeo == true || modificaEvalNeo == true) {
//            const data4 = await EvaluacionEmergencia.GuardarEvaluacionDetalleNeonatal();
//        }

//        AdmisionEmergencia.ListarAtenciones();
//        EvaluacionEmergencia.CerrarModalNeonatal();
//        Cargando(0);
//    }*/
//}
/////////////////////////////////////////////////////////////////////////////////////