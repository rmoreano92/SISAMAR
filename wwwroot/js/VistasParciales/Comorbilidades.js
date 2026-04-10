var ComorbilidadPlani = {

    InicializarComponentes() {  
       
         ObjtableComorbilidadPlani = $("#lstComorbilidadsPlani").dataTable({
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
                 { "data": "idComorbilidad", className: 'ContCenter' },
                 { "data": "descripcion", className: 'ContCenter' },
                 
             ]
         });
         $(".hide_search").chosen({ disable_search_threshold: 10 });
         $('.chzn-select').chosen().trigger("chosen:updated");
         $('.chosen-container').css({ 'width': '100%' });


        Cargando(0);
     },
       
    Eventos() {
 


        $('#lstComorbilidadsPlani tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
               
            }
            else {              
                $(this).addClass('selected');
            }
        });


    },
    

    AgregarComorbilidad() {
        if ($("#cboTipoComorbilidad").val() == -1) { alerta(2, "Debe seleccionar el Tipo de comorbilidad."); $("#cboTipoComorbilidad").focus(); return false; }
        if (ComorbilidadPlani.ExisteComorbilidadPlani()) {
            alerta(2, "la comorbilidad ya fue agregado.");
            return false;
        } else {
            var objRow = {
                idComorbilidad: $("#cboTipoComorbilidad").val(),
                descripcion: $('select[name="cboTipoComorbilidad"] option:selected').text()
            }
            ObjtableComorbilidadPlani.api(true).row.add(objRow).draw(false);
           
            $("#cboTipoComorbilidad").val(-1);
            $("#cboTipoComorbilidad").trigger("chosen:updated");
            return true;
        };


    },

    ExisteComorbilidadPlani() {
        lstComorbilidadsPlani = ObjtableComorbilidadPlani.api(true).rows().data();
        if (lstComorbilidadsPlani.length == 0) {
            return false;
        }

        for (var i = 0; i < lstComorbilidadsPlani.length; i++) {
            if (lstComorbilidadsPlani[i].idComorbilidad == $("#cboTipoComorbilidad").val()) {
                return true;
            }
        }
                
        return false;
    },
    QuitarComorbilidad() {
        var objrowDiag = ObjtableComorbilidadPlani.api(true).row('.selected').data();
        if (!isEmpty(objrowDiag)) {
            ObjtableComorbilidadPlani.api(true).row('.selected').remove().draw(false);
           
        } else {
            alerta(2, "Debe Seleccionar la comorbilidad a eliminar.");
        }
    },

    DevolverComorbilidadPlani() {
        var lstComorbilidad = ObjtableComorbilidadPlani.api(true).rows().data();
        return lstComorbilidad;
    },

    ListaComorbilidadPlaniAtencion(Datos) {
        console.log(Datos);
        ObjtableComorbilidadPlani.fnAddData(Datos);
    },


    LimpiarComorbilidadPlaniAtencion() {
        ObjtableComorbilidadPlani.fnClearTable();
    },

    HabilitarBotones() {
        $("#btnAñadirDiagnostico").removeAttr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").removeAttr('disabled', 'disabled');

    },
    DeshablitarBotones() {
        $("#btnAñadirDiagnostico").attr('disabled', 'disabled');
        $("#btnQuitarDiagnostico").attr('disabled', 'disabled');
    },

};

$(document).ready(function () {
    ComorbilidadPlani.InicializarComponentes();
    ComorbilidadPlani.Eventos();

});