var BusquedaDiagnosticos = {
    InicializarComponentes() {
       /* $('#modalBusquedaDiagnostico').modal({
            backdrop: 'static',
            keyboard: false,
            maxWidth: 200,

        });*/

        $('#lstDiagnosticosBusqueda').DataTable().clear().destroy()

        $('#modalBusquedaDiagnostico').modal('hide');
        //ObjtableBusquedaDiagnostico = $(Diagnosticos.PanelDx + "#lstDiagnosticosBusqueda").dataTable({
        ObjtableBusquedaDiagnostico = $("#lstDiagnosticosBusqueda").dataTable({
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                { "data": "iddiagnostico", className: 'ContCenter', "visible": false },
                { "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { "data": "codigoCIE10", className: 'ContCenter', width: '12%' },
                { "data": "descripcion", width: '88%' },
                { "data": "esActivo", className: 'ContCenter', "visible": false },
                { "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { "data": "intrahospitalario", className: 'ContCenter', "visible": false }
            ]
        });

    },

    Eventos() {
        $('#modalBusquedaDiagnostico').on('shown.bs.modal', function () {
            ObjtableBusquedaDiagnostico.resize()
        });

        ObjtableBusquedaDiagnostico.on('click', function (e, datatable, key, cell, originalEvent) {
            BusquedaDiagnosticos.AgregarDiagnosticoBusqueda();
        })

        $('#txtDescripcionDiagFiltro').off().keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                BusquedaDiagnosticos.BuscarDiagnosticoBusqueda();
            }
        });

        $('#lstDiagnosticosBusqueda tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosBusqueda  tbody tr').removeClass("selected");
            $(this).addClass('selected');
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
                ObjtableBusquedaDiagnostico.resize()
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    AgregarDiagnosticoBusqueda() {

        Diagnosticos.objDiagSel = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
        $(Diagnosticos.PanelDx + "#txtCodigoDiag").val(Diagnosticos.objDiagSel.codigoCIE10);
        $(Diagnosticos.PanelDx + "#hdnIdDiagnostico").val(Diagnosticos.objDiagSel.iddiagnostico);
        $(Diagnosticos.PanelDx + "#txtDescripcionDiag").val(Diagnosticos.objDiagSel.descripcion);
        setTimeout(function () {
            $('#cboTipoDiagnostico').trigger("chosen:open");
        }, 0);
        //$('#cboTipoDiagnostico').trigger("chosen:open");
        //$('#cboTipoDiagnostico').focus();
        BusquedaDiagnosticos.CerrarModalBusqueda()

    },

    AbrirModalBusqueda() {
        $("#txtCodigoDiagFiltro").val("");
        $("#txtDescripcionDiagFiltro").val("");
        ObjtableBusquedaDiagnostico.fnClearTable();        
        $('#modalBusquedaDiagnostico').modal('show');
    },

    CerrarModalBusqueda() {
        $('#modalBusquedaDiagnostico').modal('hide');
    },

    LimpiarFiltros() {
        $("#txtCodigoDiagFiltro").val("");
        $("#txtDescripcionDiagFiltro").val("");
    },


     /////////////////////////INICAR SCRIPT//////////////////////////////
    IniciarScript() {
        BusquedaDiagnosticos.InicializarComponentes();
        BusquedaDiagnosticos.Eventos();
    }
}