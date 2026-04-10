//var OrdenesRecetas = [];

var OrdenesYResultados = {
    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaVigencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });
    },

    listaFecha() {
        var midata = new FormData();
        midata.append('idParametro', 356);
        $.ajax({
            method: "POST",
            url: "/Parametros/SeleccionaFilaParametro?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


                var fecha = new Date();
                var dias = parseInt(datos.table[0]['valorTexto']); // Número de días a agregar
                fecha.setDate(fecha.getDate() + dias);


                var dia = fecha.getDate();
                var mes = parseInt(fecha.getMonth()) + 1;
                var yyy = fecha.getFullYear();

                fechaP = dia + "/" + mes + "/" + yyy

                $('#txtFechaVigencia').val(fechaP);
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar fecha!", "2");
                }, 900)
            }
        });
    },

    

    CargarDatosRecetaDetalle(datos) {
        
        $('#hdIdRecetaRXOrdRes').val(0)
        $('#lblRxOrdRes').html(0)

        $('#hdIdRecetaEcoObsOrdRes').val(0)
        $('#lblEcoObsOrdRes').html(0)

        $('#hdIdRecetaEcoObsProcOrdRes').val(0)
        $('#lblEcoObsProcOrdRes').html(0)

        $('#hdIdRecetaEcoGeneOrdRes').val(0)
        $('#lblEcoGeneOrdRes').html(0)

        $('#hdIdRecetaPatoClinicaOrdRes').val(0)
        $('#lblPatoClinicaOrdRes').html(0)

        $('#hdIdRecetaAnaPatologicaOrdRes').val(0)
        $('#lblanaPatologicaOrdRes').html(0)

        $('#hdIdRecetabancoSangreOrdRes').val(0)
        $('#lblbancoSangreOrdRes').html(0)

        $('#hdIdRecetaFarmaciaOrdRes').val(0)
        $('#lblFarmaciaOrdRes').html(0)

        $('[href="#farmaciaOrdRes"]').closest('li').hide();
        $('[href="#ecoObstOrdRes"]').closest('li').hide();
        $('[href="#ecoObstProcOrdRes"]').closest('li').hide();
        $('[href="#ecoMedFetOrdRes"]').closest('li').hide();
        $('[href="#rayosOrdRes"]').closest('li').hide();
        $('[href="#ecoGeneOrdRes"]').closest('li').hide();
        $('[href="#anatoPatoOrdRes"]').closest('li').hide();
        $('[href="#patoClinicaOrdRes"]').closest('li').hide();
        $('[href="#bancoSangreOrdRes"]').closest('li').hide();
        $('[href="#tomografiaOrdRes"]').closest('li').hide();
        $('[href="#interconsultasOrdRes"]').closest('li').hide();

        if (!isEmpty(datos)) {//rx
            $(datos).each(function (i, obj) {
                if (obj.idPuntoCarga == 21) //rx
                {
                    $('.nav-tabs a[href="#rayosOrdRes"]').tab('show');
                    $('#lblRxOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaRXOrdRes').val(obj.idReceta);
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
                    if (obj.idEstado === 1) {

                    }
                    else {
                        $('#lblRxOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 23) {//eco obs
                    $('.nav-tabs a[href="#ecoMedFetOrdRes"]').tab('show');
                    $('.nav-tabs a[href="#ecoObstOrdRes"]').tab('show');
                    $('#lblEcoObsOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaEcoObsOrdRes').val(obj.idReceta);
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
                    if (obj.idEstado === 1) {

                    }
                    else {

                        $('#lblEcoObsOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 24) {//eco obs proc
                    $('.nav-tabs a[href="#ecoMedFetOrdRes"]').tab('show');
                    $('.nav-tabs a[href="#ecoObstProcOrdRes"]').tab('show');
                    $('#lblEcoObsProcOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaEcoObsProcOrdRes').val(obj.idReceta);
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 24)
                    if (obj.idEstado === 1) {

                    }
                    else {

                        $('#lblEcoObsProcOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 20) {//eco gene
                    $('.nav-tabs a[href="#ecoGeneOrdRes"]').tab('show');
                    $('#lblEcoGeneOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaEcoGeneOrdRes').val(obj.idReceta);
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
                    if (obj.idEstado === 1) {
                    }
                    else {

                        $('#lblEcoGeneOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 2) {//pt clinica
                    $('.nav-tabs a[href="#patoClinicaOrdRes"]').tab('show');
                    $('#lblPatoClinicaOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaPatoClinicaOrdRes').val(obj.idReceta);
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
                    if (obj.idEstado === 1) {
                    }
                    else {
                        $('#lblPatoClinicaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 3) {//anat patologica
                    $('.nav-tabs a[href="#anatoPatoOrdRes"]').tab('show');
                    $('#lblanaPatologicaOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaAnaPatologicaOrdRes').val(obj.idReceta)
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
                    if (obj.idEstado === 1) {

                    }
                    else {

                        $('#lblanaPatologicaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 11) {//sangre
                    $('.nav-tabs a[href="#bancoSangreOrdRes"]').tab('show');
                    $('#lblbancoSangreOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetabancoSangreOrdRes').val(obj.idReceta)
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

                    if (obj.idEstado === 1) {

                    }
                    else {
                        $('#lblbancoSangreOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 5) {//farmacia
                    $('.nav-tabs a[href="#farmaciaOrdRes"]').tab('show');
                    $('#lblFarmaciaOrdRes').html("Receta Nro.: " + obj.idReceta);
                    $('#hdIdRecetaFarmaciaOrdRes').val(obj.idReceta)
                    $('#txtFechaVigencia').val(obj.fechaVigenciaWeb)
                    OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
                    if (obj.idEstado === 1) {
                    }
                    else {
                        $('#lblFarmaciaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }


            });
        }
    },

    listaCabeceraRecetasByIdCuenta(idCuentaAtencion, idTipoFuenteFina) {

        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);



        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                $('#hdIdRecetaRXOrdRes').val(0)
                $('#lblRxOrdRes').html(0)

                $('#hdIdRecetaEcoObsOrdRes').val(0)
                $('#lblEcoObsOrdRes').html(0)

                $('#hdIdRecetaEcoObsProcOrdRes').val(0)
                $('#lblEcoObsProcOrdRes').html(0)

                $('#hdIdRecetaEcoGeneOrdRes').val(0)
                $('#lblEcoGeneOrdRes').html(0)

                $('#hdIdRecetaPatoClinicaOrdRes').val(0)
                $('#lblPatoClinicaOrdRes').html(0)

                $('#hdIdRecetaAnaPatologicaOrdRes').val(0)
                $('#lblanaPatologicaOrdRes').html(0)

                $('#hdIdRecetabancoSangreOrdRes').val(0)
                $('#lblbancoSangreOrdRes').html(0)

                $('#hdIdRecetaFarmaciaOrdRes').val(0)
                $('#lblFarmaciaOrdRes').html(0)

                if (datos.table.length > 0) {//rx


                    $(datos.table).each(function (i, obj) {

                        if (obj.idPuntoCarga == 21) //rx
                        {
                            $('#lblRxOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaRXOrdRes').val(obj.idReceta);
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
                            if (obj.idEstado === 1) {

                            }
                            else {
                                $('#lblRxOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 23) {//eco obs
                            $('#lblEcoObsOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoObsOrdRes').val(obj.idReceta);
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
                            if (obj.idEstado === 1) {

                            }
                            else {

                                $('#lblEcoObsOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 24) {//eco obs proc
                            $('#lblEcoObsProcOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoObsProcOrdRes').val(obj.idReceta);
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 24)
                            if (obj.idEstado === 1) {

                            }
                            else {

                                $('#lblEcoObsProcOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 20) {//eco gene
                            $('#lblEcoGeneOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoGeneOrdRes').val(obj.idReceta);
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
                            if (obj.idEstado === 1) {
                            }
                            else {

                                $('#lblEcoGeneOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 2) {//pt clinica
                            $('#lblPatoClinicaOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaPatoClinicaOrdRes').val(obj.idReceta);
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
                            if (obj.idEstado === 1) {
                            }
                            else {
                                $('#lblPatoClinicaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 3) {//anat patologica
                            $('#lblanaPatologicaOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaAnaPatologicaOrdRes').val(obj.idReceta)
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
                            if (obj.idEstado === 1) {

                            }
                            else {

                                $('#lblanaPatologicaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 11) {//sangre
                            $('#lblbancoSangreOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetabancoSangreOrdRes').val(obj.idReceta)
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

                            if (obj.idEstado === 1) {

                            }
                            else {
                                $('#lblbancoSangreOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 5) {//farmacia
                            $('#lblFarmaciaOrdRes').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaFarmaciaOrdRes').val(obj.idReceta)
                            $('#txtFechaVigencia').val(obj.fechaVigenciaWeb)
                            OrdenesYResultados.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
                            if (obj.idEstado === 1) {
                            }
                            else {
                                $('#lblFarmaciaOrdRes').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }


                    });

                    
                    //VisorReceta.CargarVisorRecetas(datos.table);
                    //console.log(OrdenesRecetasMedicasSeguimiento);
                }
                OrdenesRecetasMedicasSeguimiento = datos.table;
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar recetas!", "2");
                }, 900)
            }
        });
    },
    listaRecetasByIdRecetaByPuntoCarga(idReceta, idPuntoCarga) {

        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idPuntoCarga', idPuntoCarga);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetaDetalle?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {

                switch (idPuntoCarga) {
                    case 21:
                        if (!isEmpty(datos.table)) {
                            oTable_rayosOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_rayosOrdRes.fnAddData(datos.table);
                            }

                        }
                        break;
                    case 23:
                        if (!isEmpty(datos.table)) {
                            oTable_ecoObsOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_ecoObsOrdRes.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 24:
                        if (!isEmpty(datos.table)) {
                            oTable_ecoObsProcOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_ecoObsProcOrdRes.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 20:
                        if (!isEmpty(datos.table)) {
                            oTable_ecoGeneralOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_ecoGeneralOrdRes.fnAddData(datos.table);
                            }

                        }
                        break;
                    case 2:
                        if (!isEmpty(datos.table)) {
                            oTable_PatoClinicaOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_PatoClinicaOrdRes.fnAddData(datos.table);
                            }
                        }

                        break;
                    case 3:
                        if (!isEmpty(datos.table)) {
                            oTable_anatPatologicaOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_anatPatologicaOrdRes.fnAddData(datos.table);
                            }
                        }


                        break;
                    case 11:
                        if (!isEmpty(datos.table)) {
                            oTable_bancoSangreOrdRes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_bancoSangreOrdRes.fnAddData(datos.table);
                            }
                        }

                        break;
                    case 5:
                        if (!isEmpty(datos.table)) {
                            oTable_farmaciaOrdes.fnClearTable();
                            if (datos.table.length !== 0) {
                                oTable_farmaciaOrdes.fnAddData(datos.table);
                            }
                            else {
                                OrdenesYResultados.listaFecha();
                            }
                        }

                        break;

                }

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar receta detalle!", "2");
                }, 900)
            }
        });
    },
    listaRecetasByIdRecetaByPuntoCargaGeneral(hc, idPuntoCarga) {

        var midata = new FormData();
        midata.append('hc', hc);
        midata.append('idPuntoCarga', idPuntoCarga);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetaDetalleGeneral?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {

                switch (idPuntoCarga) {
                    case 21:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_rayosOrdResGenerales.fnAddData(datos.table);
                            }

                        }
                        break;
                    case 22:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                //otable_.fnAddData(datos.table);
                            }

                        }
                        break;
                    case 23:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_ecoObsOrdResGenerales.fnAddData(datos.table);
                            }
                        }
                        break
                    case 24:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_ecoObsProcOrdResGenerales.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 20:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_ecoGeneralOrdResGenerales.fnAddData(datos.table);
                            }

                        }
                        break;
                    case 2:
                        if (!isEmpty(datos.table)) {

                            if (datos.table.length !== 0) {
                                oTable_PatoClinicaOrdResGenerales.fnAddData(datos.table);
                            }
                        }

                        break;
                    case 3:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_anatPatologicaOrdResGenerales.fnAddData(datos.table);
                            }
                        }


                        break;
                    case 11:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_bancoSangreOrdResGenerales.fnAddData(datos.table);
                            }
                        }

                        break;
                    case 5:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0) {
                                oTable_farmaciaOrdes.fnAddData(datos.table);
                            }
                            else {
                                OrdenesYResultados.listaFecha();
                            }
                        }

                        break;

                }

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar receta detalle!", "2");
                }, 900)
            }
        });
    },

    ////////////////////////DATATABLE/////////////////////////////////////////////////////////
    initDatablesFarmacia() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }


            ]

        }

        var tableWrapper = $('#tblCatalogoFarmaciaOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmaciaOrdes = $("#tblCatalogoFarmaciaOrdRes").dataTable(parms);
        $('#tblCatalogoFarmaciaOrdRes_length').css('display', 'none')
    },
          
    initDatablesAnatomiaPatologica() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoAnaPatologicaOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_anatPatologicaOrdRes = $("#tblCatalogoAnaPatologicaOrdRes").dataTable(parms);
        $('#tblCatalogoAnaPatologicaOrdRes_length').css('display', 'none')

    },

    initDatablesParologiaClinica() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoPatoClinicaOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PatoClinicaOrdRes = $("#tblCatalogoPatoClinicaOrdRes").dataTable(parms);
        $('#tblCatalogoPatoClinicaOrdRes_length').css('display', 'none')

    },

    initDatablesBancoSangre() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogobancoSangreOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_bancoSangreOrdRes = $("#tblCatalogobancoSangreOrdRes").dataTable(parms);
        $('#tblCatalogobancoSangreOrdRes_length').css('display', 'none')

    },

    initDatablesEcoObs() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')




                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoEcoObsOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObsOrdRes = $("#tblCatalogoEcoObsOrdRes").dataTable(parms);
        $('#tblCatalogoEcoObsOrdRes_length').css('display', 'none')

    },

    initDatablesEcoObsProc() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoEcoObsProcOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObsProcOrdRes = $("#tblCatalogoEcoObsProcOrdRes").dataTable(parms);
        $('#tblCatalogoEcoObsProcOrdRes_length').css('display', 'none')

    },

    initDatablesEcoGeneral() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "40%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoEcoGeneOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoGeneralOrdRes = $("#tblCatalogoEcoGeneOrdRes").dataTable(parms);
        $('#tblCatalogoEcoGeneOrdRes_length').css('display', 'none')

    },

    initDatablesRayos() {
        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "producto",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidadPedida",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogoRayosOrdRes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_rayosOrdRes = $("#tblCatalogoRayosOrdRes").dataTable(parms);
        $('#tblCatalogoRayosOrdRes_length').css('display', 'none')

    },

    ////////////////////////DATATABLES GENERALES//////////////////////////////////////////////////////////////
    initDatablesAnatomiaPatologicaGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
            ]

        }

        var tableWrapper = $('#tblCatalogoAnaPatologicaOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_anatPatologicaOrdResGenerales = $("#tblCatalogoAnaPatologicaOrdResGenerales").dataTable(parms);
        $('#tblCatalogoAnaPatologicaOrdResGenerales_length').css('display', 'none')

    },

    initDatablesBancoSangreGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
            ]

        }

        var tableWrapper = $('#tblCatalogobancoSangreOrdResResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_bancoSangreOrdResGenerales = $("#tblCatalogobancoSangreOrdResResGenerales").dataTable(parms);
        $('#tblCatalogobancoSangreOrdResResGenerales_length').css('display', 'none')

    },

    initDatablesParologiaClinicaGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
            ]

        }


        var tableWrapper = $('#tblCatalogopatoClinicaOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PatoClinicaOrdResGenerales = $("#tblCatalogopatoClinicaOrdResGenerales").dataTable(parms);
        $('#tblCatalogopatoClinicaOrdResGenerales_length').css('display', 'none')

    },

    initDatablesEcoObsGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }


        var tableWrapper = $('#tblCatalogoEcoObsOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObsOrdResGenerales = $("#tblCatalogoEcoObsOrdResGenerales").dataTable(parms);
        $('#tblCatalogoEcoObsOrdResGenerales_length').css('display', 'none')

    },

    initDatablesEcoObsProcGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }


        var tableWrapper = $('#tblCatalogoEcoObsProcOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObsProcOrdResGenerales = $("#tblCatalogoEcoObsProcOrdResGenerales").dataTable(parms);
        $('#tblCatalogoEcoObsProcOrdResGenerales_length').css('display', 'none')

    },

    initDatablesEcoGeneralGenerales() {
        var parms = {
            order: [[0, "desc"]],
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }

                    }
                }
            ]

        }

        var tableWrapper = $('#tblCatalogoecoGeneOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoGeneralOrdResGenerales = $("#tblCatalogoecoGeneOrdResGenerales").dataTable(parms);
        $('#tblCatalogoecoGeneOrdResGenerales_length').css('display', 'none')

    },       

    initDatablesRayosGenerales() {


        var parms = {
            "scrollY": "250px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            order: [[0, "desc"]],
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            //buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    visible: false,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }
                ,
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if ((rowData.resultado > 0)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');

                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCatalogorayosOrdResGenerales'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_rayosOrdResGenerales = $("#tblCatalogorayosOrdResGenerales").dataTable(parms);
        $('#tblCatalogorayosOrdResGenerales_length').css('display', 'none')

    },

    initDatablesResultaos() {


        var parms = {
            "scrollY": "440px",
            "scrollCollapse": true,
            "targets": 'no-sort',
            "bSort": false,
            //data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //buttons: ['copy', 'csv', 'print']
            //columns: [

            //    {

            //        data: "grupo",
            //        createdCell: function (td, cellData, rowData, row, col) {
            //            $(td).attr('align', 'left')

            //        }
            //    }
            //    ,
            //    {
            //        data: "item",
            //        createdCell: function (td, cellData, rowData, row, col) {
            //            $(td).attr('align', 'left')

            //        }
            //    }
            //    ,
            //    {
            //        data: "valor",
            //        createdCell: function (td, cellData, rowData, row, col) {
            //            $(td).attr('align', 'left')

            //        }
            //    }







            //]

        }

        var tableWrapper = $('#tblResultadosExamenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_resultadosOrdenes = $("#tblResultadosExamenes").dataTable(parms);
        $('#tblResultadosExamenes_length').css('display', 'none')
        $('#tblResultadosExamenes').DataTable().columns.adjust();

    },

    DevolverRecetaDetalle(idCatalogo) {
        var lstRecetadetalle = []
        var html = "";
        html += '[';
        switch (idCatalogo) {
            case 21:

                dataRx = oTable_rayosOrdRes.api(true).rows().data();
                dataRx.each(function (value, index) {
                    html += '{"idItem":"' + dataRx[index]["idItem"] + '","cantidadPedida":"' + dataRx[index]["cantidadPedida"] + '","precio":"' + dataRx[index]["precio"] + '","total":"' + dataRx[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });

                break;
            case 23:

                dataEcoObs = oTable_ecoObsOrdRes.api(true).rows().data();
                dataEcoObs.each(function (value, index) {
                    html += '{"idItem":"' + dataEcoObs[index]["idItem"] + '","cantidadPedida":"' + dataEcoObs[index]["cantidadPedida"] + '","precio":"' + dataEcoObs[index]["precio"] + '","total":"' + dataEcoObs[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 24:

                dataEcoObsProc = oTable_ecoObsProcOrdRes.api(true).rows().data();
                dataEcoObsProc.each(function (value, index) {
                    html += '{"idItem":"' + dataEcoObsProc[index]["idItem"] + '","cantidadPedida":"' + dataEcoObsProc[index]["cantidadPedida"] + '","precio":"' + dataEcoObsProc[index]["precio"] + '","total":"' + dataEcoObsProc[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 20:

                dataEcoGeneral = oTable_ecoGeneralOrdRes.api(true).rows().data();
                dataEcoGeneral.each(function (value, index) {
                    html += '{"idItem":"' + dataEcoGeneral[index]["idItem"] + '","cantidadPedida":"' + dataEcoGeneral[index]["cantidadPedida"] + '","precio":"' + dataEcoGeneral[index]["precio"] + '","total":"' + dataEcoGeneral[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 3:

                dataanatPatologica = oTable_anatPatologicaOrdRes.api(true).rows().data();
                dataanatPatologica.each(function (value, index) {
                    html += '{"idItem":"' + dataanatPatologica[index]["idItem"] + '","cantidadPedida":"' + dataanatPatologica[index]["cantidadPedida"] + '","precio":"' + dataanatPatologica[index]["precio"] + '","total":"' + dataanatPatologica[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 2:

                dataPatoClinica = oTable_PatoClinicaOrdRes.api(true).rows().data();
                dataPatoClinica.each(function (value, index) {
                    html += '{"idItem":"' + dataPatoClinica[index]["idItem"] + '","cantidadPedida":"' + dataPatoClinica[index]["cantidadPedida"] + '","precio":"' + dataPatoClinica[index]["precio"] + '","total":"' + dataPatoClinica[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 11:

                databancoSangre = oTable_bancoSangreOrdRes.api(true).rows().data();
                databancoSangre.each(function (value, index) {
                    html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 5:

                databafarmacia = oTable_farmaciaOrdes.api(true).rows().data();
                databafarmacia.each(function (value, index) {
                    html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
        }
        html += ']';
        var htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },
            
    eventos() {
        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });
        $('#btnResultadoImgLab').on('click', function () {

            $('#modalResultadoImgLab').modal('hide');
        })

        $('#btnResultadoImgLabGenerales').on('click', function () {

            $('#modalResultadoImgLabGenerales').modal('hide');
        })

        $('#tblCatalogoEcoGeneOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamen').html("");
            }
            else {
                oTable_ecoGeneralOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoGeneralOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 20);    
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'IMG');
            }


        });

       

        $('#tblCatalogoEcoObsOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ecoObsOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoObsOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 23)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'IMG');
            }


        });

        $('#tblCatalogoEcoObsProcOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ecoObsProcOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoObsProcOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 24)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'IMG');
            }


        });

        $('#tblCatalogoecoGeneOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamenGenerales').html("");
            }
            else {
                oTable_ecoGeneralOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoGeneralOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.nombre);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 20)
            }


        });

        $('#tblCatalogorayosOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamenGenerales').html("");
            }
            else {
                oTable_rayosOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_rayosOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.nombre);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 21)
            }


        });

        $('#bancoSangreOrdResResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamenGenerales').html("");
            }
            else {
                oTable_bancoSangreOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_bancoSangreOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.nombre);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden,11)
            }


        });

        $('#tblCatalogoEcoObsOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamenGenerales').html("");
            }
            else {
                oTable_ecoObsOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoObsOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.nombre);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 23)
            }


        });

        $('#tblCatalogoEcoObsProcOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $('#lblNombreExamenGenerales').html("");
            }
            else {
                oTable_ecoObsProcOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_ecoObsProcOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.nombre);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 24)
            }


        });


        $('#tblCatalogoRayosOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_rayosOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_rayosOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 21)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'IMG');
            }


        });

        $('#tblCatalogoAnaPatologicaOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_anatPatologicaOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_anatPatologicaOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 3)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'LAB');
            }


        });

        $('#tblCatalogoAnaPatologicaOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_anatPatologicaOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_anatPatologicaOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamenGenerales').html(objrow.producto);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 3)
            }


        });


        $('#tblCatalogoPatoClinicaOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_PatoClinicaOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_PatoClinicaOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 2)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'LAB');
            }
        });

        $('#tblCatalogopatoClinicaOrdResGenerales tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_PatoClinicaOrdResGenerales.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_PatoClinicaOrdResGenerales.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(objrow.idProducto, objrow.idOrden, 2)
            }


        });

        $('#tblCatalogobancoSangreOrdRes tbody').on('click', 'tr', async function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_bancoSangreOrdRes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var objrow = oTable_bancoSangreOrdRes.api(true).row('.selected').data();
                $('#lblNombreExamen').html(objrow.producto);
                //OrdenesYResultados.ListaResultadosDeImagenesByIdOrdenByIdProducto(objrow.idReceta, objrow.idItem, 11)
                await OrdenesYResultados.CargarResultadosImagenesLaboratorio(objrow.idItem, objrow.idOrden, 'LAB');
            }


        });


        $('#tblCatalogoFarmaciaOrdRes tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_farmaciaOrdes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });


    },
    limpiarREsultadosGenerales() {
        oTable_rayosOrdResGenerales.fnClearTable()
        oTable_PatoClinicaOrdResGenerales.fnClearTable();
        oTable_ecoObsOrdResGenerales.fnClearTable();
        oTable_ecoObsProcOrdResGenerales.fnClearTable();
        oTable_bancoSangreOrdResGenerales.fnClearTable();
        oTable_ecoGeneralOrdResGenerales.fnClearTable();
        oTable_anatPatologicaOrdResGenerales.fnClearTable();
    },
    limpiarCatalogo() {
        //oTable_catalogo.fnClearTable();
        $('.nav-tabs a[href="#farmaciaOrdRes"]').tab('show');
        oTable_rayosOrdRes.fnClearTable();
        oTable_ecoObsOrdRes.fnClearTable();
        oTable_ecoObsProcOrdRes.fnClearTable();
        oTable_ecoGeneralOrdRes.fnClearTable();
        oTable_anatPatologicaOrdRes.fnClearTable();
        oTable_bancoSangreOrdRes.fnClearTable();
        oTable_PatoClinicaOrdRes.fnClearTable();
        oTable_farmaciaOrdes.fnClearTable();
        oTable_resultadosOrdenes.fnClearTable();

        
    },
    CargaInicial() {

        $('#tblResultadosExamenes').DataTable({
            info: false,
            "targets": 'no-sort',
            "bSort": false,
            "scrollY": "440px",
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

    },

    ListaResultadosDeImagenesByIdOrdenByIdProducto(idReceta, idProducto, idTipo) {
        Cargando(1)
        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idProducto', idProducto);
        midata.append('idTipo', idTipo);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaResultadosDeImagenesByIdOrdenByIdProducto?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                Cargando(0)
                oTable_resultadosOrdenes.fnClearTable();
                var hmltTabla = ""
                $('#tbodyResultados').html("");
                if (datos.table.length > 0) {

                    var grupos = [];

                    datos.table.forEach(function (dato) {
                        if (grupos.indexOf(dato.grupo) == -1) {
                            grupos.push(dato.grupo);
                        }
                    });


                    console.log(grupos);

                    jQuery.each(grupos, function (i, val) {
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + val + "</b> </td><td> </td><td> </td></tr>";
                        jQuery.each(datos.table, function (x, valor) {

                            if (valor.grupo == val) {
                                hmltTabla = hmltTabla + "<tr><td style='width: 150px;'></td><td style='width: 100px;'> " + valor.item + " </td><td style='width: 100px;'>" + valor.valor + "</td></tr>";
                            }

                        });
                    });

                    $('#txtObserOrdRes').val(datos.table[0]["obseracionesGenerales"]);


                    $('#tbodyResultados').html(hmltTabla);
                    $('#tblResultadosExamenes').DataTable().columns.adjust();
                    //oTable_resultadosOrdenes.columns.adjust().draw();
                    $('#modalResultadoImgLab').modal('show');

                }

            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar receta detalle!", "2");
                }, 900)
            }
        });
    },

    ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(idProducto, idOrden, idTipo) {
        Cargando(1)
        var midata = new FormData();
        midata.append('idProducto', idProducto);
        midata.append('idOrden', idOrden);
        midata.append('idTipo', idTipo);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                Cargando(0)
                oTable_resultadosOrdenes.fnClearTable();
                var hmltTabla = ""
                $('#tbodyResultadosGenerales').html("");
                if (datos.table.length > 0) {

                    var grupos = [];

                    datos.table.forEach(function (dato) {
                        if (grupos.indexOf(dato.grupo) == -1) {
                            grupos.push(dato.grupo);
                        }
                    });


                    console.log(grupos);

                    jQuery.each(grupos, function (i, val) {
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + val + "</b> </td><td> </td><td> </td></tr>";
                        jQuery.each(datos.table, function (x, valor) {

                            if (valor.grupo == val) {
                                hmltTabla = hmltTabla + "<tr><td style='width: 150px;'></td><td style='width: 100px;'> " + valor.item + " </td><td style='width: 100px;'>" + valor.valor + "</td></tr>";
                            }

                        });
                    });
                    
                    $('#txtObserOrdResGenerales').val(datos.table[0]["obseracionesGenerales"]);

                    $('#tbodyResultadosGenerales').html(hmltTabla);
                    $('#tblResultadosExamenesGenereales').DataTable().columns.adjust();
                    //oTable_resultadosOrdenes.columns.adjust().draw();
                    $('#modalResultadoImgLabGenerales').modal('show');

                }

            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar receta detalle!", "2");
                }, 900)
            }
        });
    },

    async CargarResultadosImagenesLaboratorio(idProducto, idOrden, tipo) {
        var hmltTabla = "";
        var data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idProducto', idProducto);
        data.append('tipo', tipo);

        try {
            oTable_resultadosOrdenesSegui.fnClearTable();
            $('#lblNombreExamenSegui').html("");
            $('#tbodyResultadosSegui').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarResultadosLabImg?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsResultados.table.length > 0) {
                var resultados = datos.lsResultados.table;
                var idGrupoRes = 0
                var idItemRes = 0
                resultados.forEach(function (valor) {
                    $('#lblNombreExamenSegui').html(valor.producto);
                    if (valor.idGrupo != idGrupoRes) {
                        idGrupoRes = valor.idGrupo;
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" + valor.grupo + "</b> </td></tr>";
                    }

                    if (valor.idItem != idItemRes) {
                        idItemRes = valor.idItem;
                        hmltTabla = hmltTabla + "<tr><td>" + valor.item + " </td><td>" + valor.valor + "</td><td>" + valor.valorReferencial + "</td></tr>";
                    }
                    $('#txtObserOrdResSegui').val(valor.observaciones + '\n' + valor.conclusiones);
                });
                $('#tbodyResultadosSegui').html(hmltTabla);
                $('#modalResultadosLabImgSegui').modal('show');

            } else {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }

    },

};

$(document).ready(function () {

    OrdenesYResultados.CargaInicial();
    OrdenesYResultados.plugins();
    OrdenesYResultados.initDatablesFarmacia();
    OrdenesYResultados.initDatablesAnatomiaPatologica();
    OrdenesYResultados.initDatablesParologiaClinica();
    OrdenesYResultados.initDatablesBancoSangre();
    OrdenesYResultados.initDatablesEcoObs();
    OrdenesYResultados.initDatablesEcoObsProc();
    OrdenesYResultados.initDatablesEcoGeneral();
    OrdenesYResultados.initDatablesRayos();

    OrdenesYResultados.initDatablesAnatomiaPatologicaGenerales();
    OrdenesYResultados.initDatablesParologiaClinicaGenerales();
    OrdenesYResultados.initDatablesBancoSangreGenerales();
    OrdenesYResultados.initDatablesParologiaClinicaGenerales();
    OrdenesYResultados.initDatablesEcoObsGenerales();
    OrdenesYResultados.initDatablesEcoObsProcGenerales();
    OrdenesYResultados.initDatablesEcoGeneralGenerales();
    OrdenesYResultados.initDatablesRayosGenerales();
        
    OrdenesYResultados.initDatablesResultaos();    
    
    OrdenesYResultados.eventos();
});



