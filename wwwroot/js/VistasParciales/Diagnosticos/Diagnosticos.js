var Diagnosticos = {

    PanelDx: '',
    IdDxIngreso: 0,
    IdDxPrincipal: 0,
    IdCausaBasica: 0,
    IdCausaIntermedia: 0,
    IdCausaFinal:0,

    InicializarComponentes() {
        visible = true;
        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            visible = false;
        }

        params = {
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
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": visible },
                { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }
                
            ]
        }

        //ObjtableDx = $(Diagnosticos.PanelDx + "#lstDiagnosticos").dataTable(params);

        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            ObjtableDiagnosticos = $(Diagnosticos.PanelDx + "#lstDiagnosticos").dataTable(params);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            ObjtableDiagnosticos2 = $(Diagnosticos.PanelDx + "#lstDiagnosticos2").dataTable(params);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            ObjtableDiagnosticos3 = $(Diagnosticos.PanelDx + "#lstDiagnosticos3").dataTable(params);
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            ObjtableComplicaciones = $(Diagnosticos.PanelDx + "#lstDiagnosticos4").dataTable(params);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            ObjtableDiagnosticosClap = $(Diagnosticos.PanelDx + "#lstDiagnosticosClap").dataTable(params);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            ObjtableDiagnosticosIngreso = $(Diagnosticos.PanelDx + "#lstDiagnosticosIngreso").dataTable(params);
        }


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        $('#txtLabDiagnostico').val('')

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");

        //Cargando(0);
    },

    Eventos() {
        $(Diagnosticos.PanelDx + "#txtCodigoDiag").off().keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                if ($(Diagnosticos.PanelDx + "#txtCodigoDiag").val() != "") {
                    BusquedaDiagnosticos.AbrirModalBusqueda();
                    BusquedaDiagnosticos.BuscarDiagnostico($(Diagnosticos.PanelDx + "#txtCodigoDiag").val());
                    $("#txtCodigoDiagFiltro").val($(Diagnosticos.PanelDx + "#txtCodigoDiag").val());
                } else {
                    alerta(2, "Debe ingresar el código");
                }
            }
        });
        

        $('#lstDiagnosticos tbody').on('click', 'tr', function () {
            $('#lstDiagnosticos  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#lstDiagnosticos2 tbody').on('click', 'tr', function () {
            $('#lstDiagnosticos2  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#lstDiagnosticos3 tbody').on('click', 'tr', function () {
            $('#lstDiagnosticos3  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#lstDiagnosticos4 tbody').on('click', 'tr', function () {
            $('#lstDiagnosticos4  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#lstDiagnosticosClap tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosClap  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#lstDiagnosticosIngreso tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosIngreso  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });
    },
        

    AgregarDiagnostico() {
        $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");
        if ($(Diagnosticos.PanelDx + "#txtDescripcionDiag").val() == "") { alerta(2, "Debe seleccionar el Diagnóstico"); $(Diagnosticos.PanelDx + "#txtCodigoDiag").focus(); return false; }
        if ($(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").focus(); return false; }
        if (Diagnosticos.ExisteDiagnosticos()) {
            alerta(2, "El Diagnóstico ya fue agregado.");
            return false;
        } else {
            console.log(Diagnosticos.objDiagSel);
            console.log($('select[name="cboTipoDiagnostico"] option:selected').text());

            var idTipoDx = '';
            var txtTipoDx = '';
            if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
                idTipoDx = 0;
                txtTipoDx = '';
            } else {
                idTipoDx = $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val();
                txtTipoDx = $(Diagnosticos.PanelDx + '#cboTipoDiagnostico option:selected').text();                
            }

            var objRow = {
                codigoCIE10: Diagnosticos.objDiagSel.codigoCIE10,
                codigoCIEsinPto: Diagnosticos.objDiagSel.codigoCIEsinPto,
                descripcion: Diagnosticos.objDiagSel.descripcion,
                esActivo: Diagnosticos.objDiagSel.esActivo,
                fechaInicioVigencia: Diagnosticos.objDiagSel.fechaInicioVigencia,
                iddiagnostico: Diagnosticos.objDiagSel.iddiagnostico,
                idTipoDiagnostico: idTipoDx,
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: txtTipoDx,
                //lab: $('#hdUsaLabs').val() == '1' ? $('#txtLabDiagnostico').val() : $('#cbolabDiagnostico').val(),
                lab: '',
                intrahospitalario: Diagnosticos.objDiagSel.intrahospitalario
            }
            if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
                ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
                ObjtableDiagnosticos2.api(true).row.add(objRow).draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
                ObjtableDiagnosticos3.api(true).row.add(objRow).draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
                ObjtableComplicaciones.api(true).row.add(objRow).draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
                ObjtableDiagnosticosClap.api(true).row.add(objRow).draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
                ObjtableDiagnosticosIngreso.api(true).row.add(objRow).draw(false);
            }
            //ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
            $(Diagnosticos.PanelDx + "#txtDescripcionDiag").val("");
            $(Diagnosticos.PanelDx + "#txtCodigoDiag").val("");
            $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val(-1);

            $('#txtLabDiagnostico').val('')

            $('#cbolabDiagnostico').val(-1)

            $('#cbolabDiagnostico').trigger("chosen:updated");
            $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");

            $('#txtCodigoDiag').focus()

            return true;
        };
    },

    //AgregarDiagnostico() {
    //    $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");
    //    if ($(Diagnosticos.PanelDx + "#txtDescripcionDiag").val() == "") { alerta(2, "Debe seleccionar el Diagnóstico"); $(Diagnosticos.PanelDx + "#txtCodigoDiag").focus(); return false; }
    //    if ($(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").focus(); return false; }
    //    if (Diagnosticos.ExisteDiagnosticos()) {
    //        alerta(2, "El Diagnóstico ya fue agregado.");
    //        return false;
    //    } else {
    //        console.log(Diagnosticos.objDiagSel);
    //        console.log($('select[name="cboTipoDiagnostico"] option:selected').text());

    //        var idTipoDx = '';
    //        var txtTipoDx = '';
    //        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
    //            idTipoDx = 0;
    //            txtTipoDx = '';
    //        } else {
    //            idTipoDx = $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val();
    //            txtTipoDx = $(Diagnosticos.PanelDx + '#cboTipoDiagnostico option:selected').text();
    //        }

    //        var objRow = {
    //            codigoCIE10: Diagnosticos.objDiagSel.codigoCIE10,
    //            codigoCIEsinPto: Diagnosticos.objDiagSel.codigoCIEsinPto,
    //            descripcion: Diagnosticos.objDiagSel.descripcion,
    //            esActivo: Diagnosticos.objDiagSel.esActivo,
    //            fechaInicioVigencia: Diagnosticos.objDiagSel.fechaInicioVigencia,
    //            iddiagnostico: Diagnosticos.objDiagSel.iddiagnostico,
    //            idTipoDiagnostico: idTipoDx,
    //            //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
    //            tipoDiagnostico: txtTipoDx,
    //            lab: $('#hdUsaLabs').val() == '1' ? $('#txtLabDiagnostico').val() : $('#cbolabDiagnostico').val(),
    //            intrahospitalario: Diagnosticos.objDiagSel.intrahospitalario
    //        }
    //        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
    //            ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
    //        }

    //        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
    //            ObjtableDiagnosticos2.api(true).row.add(objRow).draw(false);
    //        }

    //        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
    //            ObjtableDiagnosticos3.api(true).row.add(objRow).draw(false);
    //        }

    //        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
    //            ObjtableComplicaciones.api(true).row.add(objRow).draw(false);
    //        }
    //        //ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
    //        $(Diagnosticos.PanelDx + "#txtDescripcionDiag").val("");
    //        $(Diagnosticos.PanelDx + "#txtCodigoDiag").val("");
    //        $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val(-1);

    //        $('#txtLabDiagnostico').val('')

    //        $('#cbolabDiagnostico').val(-1)

    //        $('#cbolabDiagnostico').trigger("chosen:updated");
    //        $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");
    //        return true;
    //    };
    //},
    //SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {

    //    Diagnosticos.LimpiarDiagnosticosAtencion();
    //    var midata = new FormData();
    //    midata.append('idAtencion', idAtencion);
    //    midata.append('clasificacionDiagnostico', clasiDiagnostico);

    //    $.ajax({
    //        method: "POST",
    //        url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
    //        //contentType: "application/json; charset=utf-8",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {

    //            Cargando(0)
    //            if (datos.table.length !== 0) {
    //                if (!isEmpty(datos.table)) {
    //                    Diagnosticos.ListaDiagnosticosAtencion(datos.table);
    //                }
    //            }
    //            else {
    //                Cargando(0)
    //            }

    //        },
    //        error: function (msg) {
    //            Cargando(0)
    //        }
    //    })
    //},

    async SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {        
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        Diagnosticos.LimpiarDiagnosticosAtencion();
        
        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasiDiagnostico);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                }
            }
            //else {
            //    Cargando(0)
            //}
            resp = true;
        } catch (error) {
            //console.error(error)
            resp = false;
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async SeleccionarDiagnosticosEventosAdversos(idEventoAdverso, clasiDiagnostico) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        Diagnosticos.LimpiarDiagnosticosAtencion();

        data.append('idEventoAdverso', idEventoAdverso);
        data.append('clasificacionDiagnostico', clasiDiagnostico);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarEventosAdversos?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
                        ObjtableDiagnosticos.fnAddData(datos.table);
                        
                    }
                }
            }
            //else {
            //    Cargando(0)
            //}
            resp = true;
        } catch (error) {
            //console.error(error)
            resp = false;
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, clasiDiagnostico) {

        Diagnosticos.LimpiarDiagnosticosAtencion();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('clasificacionDiagnostico', clasiDiagnostico);

        return $.ajax({
            method: "POST",
            url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                if (datos.table.length !== 0) {
                    return datos.table
                }
                else {
                    return null
                }

            },
            error: function (msg) {
                return null
            }
        })
    },

    async HuboDiagnosticoInfeccion(idAtencion, clasiDiagnostico) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        //Diagnosticos.LimpiarDiagnosticosAtencion();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasiDiagnostico);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {                    
                    miArray = datos.table;
                    console.log(datos.table);
                    miArray.forEach(function (valor, indice, array) {
                        console.log(valor['intrahospitalario']);
                        if (valor['intrahospitalario']) {
                            resp = true;
                            return true;
                        }                        
                    });                    
                }
            }
            //else {
            //    Cargando(0)
            //}
            
        } catch (error) {
            //console.error(error)
            //resp = [];
            alerta(3, error);
        }

        //return datos;
        return resp;
    },


    GuardarDiagnosticosPorEvaluacion(idAtencion, clasificacionDx, idServicio, nroEvalaucion) {

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        midata.append('clasificacionDiagnostico', clasificacionDx);
        midata.append('idServicio', idServicio);
        midata.append('nroEvaluacion', nroEvalaucion);

        $.ajax({
            method: "POST",
            url: "/Diagnosticos/GuardarDiagnosticosPorEvaluacion?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                //if (datos.table.length !== 0) {
                //    if (!isEmpty(datos.table)) {
                //        Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                //    }
                //}
                //else {
                //    Cargando(0)
                //}

            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ExisteDiagnosticos() {
        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            lstDiagnosticos = ObjtableDiagnosticos2.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            lstDiagnosticos = ObjtableDiagnosticos3.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            lstDiagnosticos = ObjtableComplicaciones.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            lstDiagnosticos = ObjtableDiagnosticosClap.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            lstDiagnosticos = ObjtableDiagnosticosIngreso.api(true).rows().data();
        }
        //lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].iddiagnostico == $(Diagnosticos.PanelDx + "#hdnIdDiagnostico").val()) {
                return true;
            }
        }

        return false;
    },

    ValidaExisteDiagnostico() {
        lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }
        return true;
    },

    ValidaExisteDiagnostico2() {
        lstDiagnosticos = ObjtableDiagnosticos2.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }
        return true;
    },

    ValidaExisteDiagnostico3() {
        lstDiagnosticos = ObjtableDiagnosticos3.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }
        return true;
    },

    ValidaExisteComplicacion() {
        lstDiagnosticos = ObjtableComplicaciones.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }
        return true;
    },

    ValidaExisteDxPrincipal() {
        lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].idTipoDiagnostico == 301) {
                return true;
            }
        }

        return false;
    },

    ValidaExisteCausaBasica() {
        lstDiagnosticos = ObjtableDiagnosticos3.api(true).rows().data();
        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].idTipoDiagnostico == 305) {
                return true;
            }
        }

        return false;
    },

    ValidaExisteCausaIntermedia() {
        lstDiagnosticos = ObjtableDiagnosticos3.api(true).rows().data();
        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].idTipoDiagnostico == 304) {
                return true;
            }
        }

        return false;
    },

    ValidaExisteCausaFinal() {
        lstDiagnosticos = ObjtableDiagnosticos3.api(true).rows().data();
        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].idTipoDiagnostico == 303) {
                return true;
            }
        }

        return false;
    },

    QuitarDiagnostico() {
        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            var objrowDiag = ObjtableDiagnosticos.api(true).row('.selected').data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            var objrowDiag = ObjtableDiagnosticos2.api(true).row('.selected').data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            var objrowDiag = ObjtableDiagnosticos3.api(true).row('.selected').data();
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            var objrowDiag = ObjtableComplicaciones.api(true).row('.selected').data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            var objrowDiag = ObjtableDiagnosticosClap.api(true).row('.selected').data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            var objrowDiag = ObjtableDiagnosticosIngreso.api(true).row('.selected').data();
        }
        //var objrowDiag = ObjtableDiagnosticos.api(true).row('.selected').data();
        if (!isEmpty(objrowDiag)) {
            if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
                ObjtableDiagnosticos.api(true).row('.selected').remove().draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
                ObjtableDiagnosticos2.api(true).row('.selected').remove().draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
                ObjtableDiagnosticos3.api(true).row('.selected').remove().draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
                ObjtableComplicaciones.api(true).row('.selected').remove().draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
                ObjtableDiagnosticosClap.api(true).row('.selected').remove().draw(false);
            }

            if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
                ObjtableDiagnosticosIngreso.api(true).row('.selected').remove().draw(false);
            }
            //ObjtableDiagnosticos.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
        }
    },
       
    LimpiarCampos() {
        $(Diagnosticos.PanelDx + "#txtDescripcionDiag").val("");
        $(Diagnosticos.PanelDx + "#txtCodigoDiag").val("");
        $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").val(-1);
        $(Diagnosticos.PanelDx + "#cboTipoDiagnostico").trigger("chosen:updated");

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");
    }
    ,
    DevolverDiagnosticos() {
        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            var lstDiagnostico = ObjtableDiagnosticos.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            var lstDiagnostico = ObjtableDiagnosticos2.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            var lstDiagnostico = ObjtableDiagnosticos3.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            var lstDiagnostico = ObjtableComplicaciones.api(true).rows().data();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            var lstDiagnostico = ObjtableDiagnosticosClap.api(true).rows().data();
        }
        //var l

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            var lstDiagnostico = ObjtableDiagnosticosIngreso.api(true).rows().data();
        }
        //var lstDiagnostico = ObjtableDiagnosticos.api(true).rows().data();
        return lstDiagnostico;
    },

    ListaDiagnosticosAtencion(Datos) {
        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            ObjtableDiagnosticos.fnAddData(Datos);
            //oTable_DiagnosticosInterconsulta.fnAddData(Datos);    //COMENTADO POR KHOYOSI HASTA REUBICAR MEJOR
            //console.log(Datos);
            if (typeof oTable_DiagnosticosInterconsulta !== 'undefined') {
                oTable_DiagnosticosInterconsulta.fnAddData(Datos); // VERIFICANDO AGREGANDO PARA INTERCONSULTA JDELGADOM                
            } else {
                
            }            
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            ObjtableDiagnosticos2.fnAddData(Datos);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            ObjtableDiagnosticos3.fnAddData(Datos);
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            ObjtableComplicaciones.fnAddData(Datos);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoInterconsulta ") {
            oTable_DiagnosticosInterconsulta.fnAddData(Datos);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            ObjtableDiagnosticosClap.fnAddData(Datos);
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            ObjtableDiagnosticosIngreso.fnAddData(Datos);
        }
        //ObjtableDiagnosticos.fnAddData(Datos);
    },

    LimpiarDiagnosticosAtencion() {
        if (Diagnosticos.PanelDx == "#PanelDiagnostico ") {
            ObjtableDiagnosticos.fnClearTable();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico2 ") {
            ObjtableDiagnosticos2.fnClearTable();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnostico3 ") {
            ObjtableDiagnosticos3.fnClearTable();
        }

        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            ObjtableComplicaciones.fnClearTable();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoClap ") {
            ObjtableDiagnosticosClap.fnClearTable();
        }

        if (Diagnosticos.PanelDx == "#PanelDiagnosticoIngreso ") {
            ObjtableDiagnosticosIngreso.fnClearTable();
        }
        //ObjtableDiagnosticos.fnClearTable();
    },

    /////////////////////////////////////OBTIENE DIAGNOSTICOS /////////////////////////////
    async SeleccionarDiagnosticos(idAtencion, clasificacion) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();
                        
        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        Diagnosticos.LimpiarDiagnosticosAtencion();
        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0)
            resp = true;
            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                }
            }
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////OBTIENE DIAGNOSTICOS POR EVALUACION/////////////////////////////
    async SeleccionarDiagnosticosPorEvaluacion(idAtencion, idServicio, nroEvaluacion, clasificacion) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();
                
        data.append('idAtencion', idAtencion);
        data.append('idServicio', idServicio);
        data.append('clasificacionDiagnostico', clasificacion);
        data.append('nroEvaluacion', nroEvaluacion);        

        Diagnosticos.LimpiarDiagnosticosAtencion();                
        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/Diagnosticos/DiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion?area=Comun",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0)
            resp = true;
            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                }
            }
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////



    HabilitarBotones() {
        $(Diagnosticos.PanelDx + "#btnAñadirDiagnostico").removeAttr('disabled', 'disabled');
        $(Diagnosticos.PanelDx + "#btnQuitarDiagnostico").removeAttr('disabled', 'disabled');

    },
    DeshablitarBotones() {
        $(Diagnosticos.PanelDx + "#btnAñadirDiagnostico").attr('disabled', 'disabled');
        $(Diagnosticos.PanelDx + "#btnQuitarDiagnostico").attr('disabled', 'disabled');
    },

    /////////////////////////INICAR SCRIPT//////////////////////////////
    IniciarScript() {
        Diagnosticos.InicializarComponentes();
        Diagnosticos.Eventos();
    }

};

