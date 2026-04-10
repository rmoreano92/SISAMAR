var FechaDia;
var ID_ParteProduccionPlanixServicio = {
    inicializarComponentes() {
        $("#cboTipoServicio").on('change', function () {
            ID_ParteProduccionPlanixServicio.cargarComboServicios();
        });
        $('#cboTipoServicio').val($("#hdnIdTipoServicio").val());
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    listarCombos() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListarServicio?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                console.log(datos);
                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/Reportes/ListarAnios?area=Reportes",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboAnio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboAnio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/Reportes/ListarMeses?area=Reportes",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboMes').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMes').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },



    cargarComboServicios() {
        var midata = new FormData();
        midata.append('idTipoServicio', $('#cboTipoServicio').val());
        $.ajax({
            async: false,
            method: "POST",
            url: "/Reportes/ListarServiciosxTipoServicioyIdTipoEspecialidad?area=Reportes",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
    },
    CerrarModal() {
        $('#modalReporte').modal('hide');
    },
    GenerarReporte() {
        var nombreMes = $("#cboMes option:selected").text();
        var idServicio = $("#cboServicio").val();
        var idAnio = $("#cboAnio").val();
        var idMes = $("#cboMes").val();
        var TipoServicio = $("#hdnIdTipoServicio").val();

        TipoServicio

        //if (idServicio == -1) {
        //    alerta('2', 'Ingrese el servicio.');
        //    return false;
        //};

        if (idAnio == -1) {
            alerta('2', 'Ingrese el año.');
            return false;
        };

        if (idMes == -1) {
            alerta('2', 'Ingrese el mes.');
            return false;
        };
        var url = "/Reportes/GenerarReportePPFFConsolidado?area=Reportes&Mes=" + nombreMes + "&idServicio=" + idServicio + "&idAnio=" + idAnio + "&idMes=" + idMes + "&TipoServicio=" + TipoServicio;
        window.location.href = url;
    },
}
$(document).ready(function () {
    ID_ParteProduccionPlanixServicio.inicializarComponentes();
    ID_ParteProduccionPlanixServicio.listarCombos();
    ID_ParteProduccionPlanixServicio.cargarComboServicios();

});
