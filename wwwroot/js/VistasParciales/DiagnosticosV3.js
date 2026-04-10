var Diagnosticos = {

    InicializarComponentes() {
        $('#modalBusquedaDiagnostico').modal({
            backdrop: 'static',
            keyboard: false,
            maxWidth: 200,

        });
        $('#modalBusquedaDiagnostico').modal('hide');
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
                { "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false }
            ]
        });
        ObjtableDiagnosticos = $("#lstDiagnosticos").dataTable({
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
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter' }
            ]
        });
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        Cargando(0);
    },

    Eventos() {

        ObjtableBusquedaDiagnostico.on('click', function (e, datatable, key, cell, originalEvent) {

            Diagnosticos.AgregarDiagnosticoBusqueda();

        })

        $("#txtCodigoDiag").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                if ($("#txtCodigoDiag").val() != "") {
                    Diagnosticos.AbrirModalBusqueda();
                    Diagnosticos.BuscarDiagnostico($("#txtCodigoDiag").val());
                    $("#txtCodigoDiagFiltro").val($("#txtCodigoDiag").val());
                } else {
                    alerta(2, "Debe ingresar el código");
                }
            }
        });

        $('#txtDescripcionDiagFiltro').on('keypress', function (e) {
            if (e.which == 13) {
                Diagnosticos.BuscarDiagnosticoBusqueda();
            }
        });

        $('#lstDiagnosticosBusqueda tbody').on('click', 'tr', function () {

            $('#lstDiagnosticosBusqueda  tbody tr').removeClass("selected");
            $(this).addClass('selected');

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


    },

    AbrirModalBusqueda() {
        $('#modalBusquedaDiagnostico').modal('show');
    },

    CerrarModalBusqueda() {
        $('#modalBusquedaDiagnostico').modal('hide');
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

    BuscarDiagnosticoBusqueda() {
        var midata = new FormData();
        midata.append('Codigo', $("#txtCodigoDiagFiltro").val());
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

    AgregarDiagnosticoBusqueda() {

        Diagnosticos.objDiagSel = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
        $("#txtCodigoDiag").val(Diagnosticos.objDiagSel.codigoCIE10);
        $("#hdnIdDiagnostico").val(Diagnosticos.objDiagSel.iddiagnostico);
        $("#txtDescripcionDiag").val(Diagnosticos.objDiagSel.descripcion);
        Diagnosticos.CerrarModalBusqueda()

    },

    AgregarDiagnostico() {
        $("#cboTipoDiagnostico").trigger("chosen:updated");
        if ($("#txtDescripcionDiag").val() == "") { alerta(2, "Debe seleccionar el diagnóstico"); $("#txtCodigoDiag").focus(); return false; }
        if ($("#cboTipoDiagnostico").val() == -1) { alerta(2, "Debe seleccionar el Tipo de diagnóstico."); $("#cboTipoDiagnostico").focus(); return false; }
        if (Diagnosticos.ExisteDiagnosticos()) {
            alerta(2, "el diagnóstico ya fue agregado.");
            return false;
        } else {
            console.log(Diagnosticos.objDiagSel);
            console.log($('select[name="cboTipoDiagnostico"] option:selected').text());
            var objRow = {
                codigoCIE10: Diagnosticos.objDiagSel.codigoCIE10,
                codigoCIEsinPto: Diagnosticos.objDiagSel.codigoCIEsinPto,
                descripcion: Diagnosticos.objDiagSel.descripcion,
                esActivo: Diagnosticos.objDiagSel.esActivo,
                fechaInicioVigencia: Diagnosticos.objDiagSel.fechaInicioVigencia,
                iddiagnostico: Diagnosticos.objDiagSel.iddiagnostico,
                idTipoDiagnostico: $("#cboTipoDiagnostico").val(),
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: $('#cboTipoDiagnostico option:selected').text()
            }
            ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
            $("#txtDescripcionDiag").val("");
            $("#txtCodigoDiag").val("");
            $("#cboTipoDiagnostico").val(-1);
            $("#cboTipoDiagnostico").trigger("chosen:updated");
            return true;
        };
    },

    SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {

        Diagnosticos.LimpiarDiagnosticosAtencion();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('clasificacionDiagnostico', clasiDiagnostico);

        $.ajax({
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
        lstDiagnosticos = ObjtableDiagnosticos.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].iddiagnostico == $("#hdnIdDiagnostico").val()) {
                return true;
            }
        }

        return false;
    },
    QuitarDiagnostico() {
        var objrowDiag = ObjtableDiagnosticos.api(true).row('.selected').data();
        if (!isEmpty(objrowDiag)) {
            ObjtableDiagnosticos.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
        }
    },

    LimpiarFiltros() {
        $("#txtCodigoDiagFiltro").val("");
        $("#txtDescripcionDiagFiltro").val("");

    },
    LimpiarCampos() {

        $("#txtDescripcionDiag").val("");
        $("#txtCodigoDiag").val("");
        $("#cboTipoDiagnostico").val(-1);
        $("#cboTipoDiagnostico").trigger("chosen:updated");

    }
    ,
    DevolverDiagnosticos() {
        var lstDiagnostico = ObjtableDiagnosticos.api(true).rows().data();
        return lstDiagnostico;
    },

    ListaDiagnosticosAtencion(Datos) {
        ObjtableDiagnosticos.fnAddData(Datos);
    },

    LimpiarDiagnosticosAtencion() {
        ObjtableDiagnosticos.fnClearTable();
    },

    HabilitarBotones() {
        $("#btnAñadirDiagnostico").removeAttr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").removeAttr('disabled', 'disabled');

    },
    DeshablitarBotones() {
        $("#btnAñadirDiagnostico").attr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").attr('disabled', 'disabled');
    },

    /////////////////////////INICAR SCRIPT//////////////////////////////
    IniciarScript() {
        Diagnosticos.InicializarComponentes();
        Diagnosticos.Eventos();
    }

};

