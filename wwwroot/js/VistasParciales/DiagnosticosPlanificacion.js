var DiagnosticosPlani = {

    InicializarComponentes() {
         $('#modalBusquedaDiagnostico').modal({
             backdrop: 'static',
             keyboard: false,         
             maxWidth: 200,

         });
         $('#modalBusquedaDiagnostico').modal('hide');    
         ObjtableBusquedaDiagnostico = $("#lstDiagnosticosPlaniBusqueda").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            scrollCollapse: true,
             bLengthChange: false,
             "responsive": true,
             "bAutoWidth": true ,
            buttons: [],
            columns: [
                { "data": "iddiagnostico", "visible": false  },
                { "data": "codigoCIEsinPto",  "visible": false  },
                { "data": "codigo" },
                { "data": "descripcion" },           
                { "data": "codigoCIE10" },
                { "data": "esActivo",  "visible": false  },
                { "data": "fechaInicioVigencia",  "visible": false  }
            ]
         });
         ObjtableDiagnosticosPlani = $("#lstDiagnosticosPlani").dataTable({
             destroy: true,
             data: null,
             info: false,
             bFilter: false,
             scrollY: '70vh',
             scrollCollapse: true,
             bLengthChange: false,
             bPaginate: false,
             buttons: [],
             columns: [
                 { "data": "iddiagnostico", className: 'ContCenter', "visible": false },
                 { "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                 { "data": "codigo", className: 'ContCenter' },
                 { "data": "descripcion", className: 'ContCenter' },
                 { "data": "esActivo", className: 'ContCenter', "visible": false },
                 { "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                 { "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                 { "data": "tipoDiagnostico", className: 'ContCenter'}
             ]
         });
         $(".hide_search").chosen({ disable_search_threshold: 10 });
         $('.chzn-select').chosen().trigger("chosen:updated");
         $('.chosen-container').css({ 'width': '100%' });


        Cargando(0);
     },
       
    Eventos() {
        $("#txtCodigoDiag").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
               // if ($("#txtCodigoDiag").val() != "") {
                DiagnosticosPlani.BuscarDiagnostico($("#txtCodigoDiag").val());
                $("#txtCodigoDiagFiltro").val($("#txtCodigoDiag").val());
                DiagnosticosPlani.AbrirModalBusqueda();
                  
                //} else {
                //    alerta(2, "Debe ingresar el código");
                //}
            }
        });


        $('#lstDiagnosticosPlaniBusqueda tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                DiagnosticosPlani.objDiagSel = null;
            }
            else {
                ObjtableBusquedaDiagnostico.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                DiagnosticosPlani.objDiagSel = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
              
                $("#txtCodigoDiag").val(DiagnosticosPlani.objDiagSel.codigo);
                $("#hdnIdDiagnostico").val(DiagnosticosPlani.objDiagSel.iddiagnostico);
                $("#txtDescripcionDiag").val(DiagnosticosPlani.objDiagSel.descripcion);
                DiagnosticosPlani.CerrarModalBusqueda();
            }
        });


        $('#lstDiagnosticosPlani tbody').on('click', 'tr', function () {
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
            url: "/PlanificacionFamiliar/ObtenerDiagnosticoPlanificacion?area=Comun",
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
            url: "/PlanificacionFamiliar/ObtenerDiagnosticoPlanificacion?area=Comun",
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

    AgregarDiagnostico() {
        if ($("#txtDescripcionDiag").val() == "") { alerta(2, "Debe seleccionar el diagnóstico"); $("#txtCodigoDiag").focus(); return false; }
        if ($("#cboTipoDiagnostico").val() == -1) { alerta(2, "Debe seleccionar el Tipo de diagnóstico."); $("#cboTipoDiagnostico").focus(); return false; }
        if (DiagnosticosPlani.ExisteDiagnosticosPlani()) {
            alerta(2, "el diagnóstico ya fue agregado.");
            return false;
        } else {
            debugger;
            var objRow = {
                codigo: DiagnosticosPlani.objDiagSel.codigo,
                codigoCIEsinPto: DiagnosticosPlani.objDiagSel.codigoCIEsinPto,
                descripcion: DiagnosticosPlani.objDiagSel.descripcion,
                esActivo: DiagnosticosPlani.objDiagSel.esActivo,
                fechaInicioVigencia: DiagnosticosPlani.objDiagSel.fechaInicioVigencia,
                iddiagnostico: DiagnosticosPlani.objDiagSel.iddiagnostico,
                idTipoDiagnostico: $("#cboTipoDiagnostico").val(),
                tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
            }
            ObjtableDiagnosticosPlani.api(true).row.add(objRow).draw(false);
            $("#txtDescripcionDiag").val("");
            $("#txtCodigoDiag").val("");
            $("#cboTipoDiagnostico").val(-1);
            $("#cboTipoDiagnostico").trigger("chosen:updated");
            return true;
        };


    },

    ExisteDiagnosticosPlani() {
        lstDiagnosticosPlani = ObjtableDiagnosticosPlani.api(true).rows().data();
        if (lstDiagnosticosPlani.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDiagnosticosPlani.length; i++) {
            if (lstDiagnosticosPlani[i].iddiagnostico == $("#hdnIdDiagnostico").val()) {
                return true;
            }
        }
                
        return false;
    },
    QuitarDiagnostico() {
        var objrowDiag = ObjtableDiagnosticosPlani.api(true).row('.selected').data();
        if (!isEmpty(objrowDiag)) {
            ObjtableDiagnosticosPlani.api(true).row('.selected').remove().draw(false);
           
        } else {
            alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
        }
    },

    DevolverDiagnosticosPlani() {
      var   lstDiagnostico = ObjtableDiagnosticosPlani.api(true).rows().data();
        return lstDiagnostico;
    },

    ListaDiagnosticosPlaniAtencion(Datos) {
        ObjtableDiagnosticosPlani.fnAddData(Datos);
    },

    LimpiarDiagnosticosPlaniAtencion() {
        ObjtableDiagnosticosPlani.fnClearTable();
    },

    HabilitarBotones() {
        $("#btnAñadirDiagnostico").removeAttr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").removeAttr('disabled', 'disabled');

    },
    DeshablitarBotones() {
        $("#btnAñadirDiagnostico").attr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").attr('disabled', 'disabled');
    },
    LimpiarFiltros() {
        $("#txtCodigoDiagFiltro").val("");
        $("#txtDescripcionDiagFiltro").val("");
        DiagnosticosPlani.BuscarDiagnostico("");
    },

};

$(document).ready(function () {
    DiagnosticosPlani.InicializarComponentes();
    DiagnosticosPlani.Eventos();

});