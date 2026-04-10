var FechaDia;
var ID_ParteDiarioAtencion = {


    inicializarComponentes() {
        $("#cboDepartamento").on('change', function () {
            ID_ParteDiarioAtencion.cargarComboEspecialidades();
        });
        $("#cboEspecialidad").on('change', function () {
            //ID_ParteDiarioCitas.cargarComboEspecialidades();
            ID_ParteDiarioAtencion.cargarComboServicios();
        });
        $("#cboTipoServicio").on('change', function () {
            ID_ParteDiarioAtencion.cargarComboServicios();
        });
        $('#cboServicio').val($("#hdnIdTipoServicio").val());
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#txtFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $('#txtFecha').val(FechaDia);
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
                url: "/Reportes/ListarDepartamentos?area=Reportes",
                datatype: "json",
                type: "get",
                success: function (datos) {
                    $('#cboDepartamento').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboDepartamento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
             url: "/Atencion/ListarTiposConsulta?area=ConsultaExterna",
             datatype: "json",
             type: "get",
             success: function (datos) {
                 console.log(datos);
                 $('#cboDestino').empty();
                 $(datos.table).each(function (i, obj) {
                     $('#cboDestino').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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


         $(".hide_search").chosen({ disable_search_threshold: 10 });
         $('.chzn-select').chosen().trigger("chosen:updated");
         $('.chosen-container').css({ 'width': '100%' });

    },

    cargarComboEspecialidades() {
        var midata = new FormData();
        midata.append('idDepartamento', $('#cboDepartamento').val());
        $.ajax({
            method: "POST",
            url: "/Reportes/ListarEspecialidadesxIdDepartamento?area=Reportes",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                
                $('#cboEspecialidad').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboEspecialidad').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboEspecialidad').change();
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


    /*cargarComboServicios() {
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
    },*/

    cargarComboServicios() {
        var midata = new FormData();

        midata.append('idTipoServicio', $('#cboTipoServicio').val());
        midata.append('idDepartamento', $('#cboDepartamento').val());
        midata.append('idEspecialidad', $('#cboEspecialidad').val());
        midata.append('idServicio', 0);
        $.ajax({
            async: false,
            method: "POST",
            //url: "/Reportes/ListarServiciosxTipoServicioyIdTipoEspecialidad?area=Reportes",
            url: "/Servicios/ListarServicios?area=Reportes",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos);
                datos = datos?.lsResultado;
                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    //$('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboServicio').append('<option  value="' + obj.idServicio + '">' + obj.servicio + '</option>');
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
        var idTipoServicio=$("#cboTipoServicio").val();
        var idDepartamento=$("#cboDepartamento").val();
        var idEspecialidad=$("#cboEspecialidad").val();
        var idServicio=$("#cboServicio").val();      
        var idDestino=$("#cboDestino").val();
        var Fecha = $("#txtFecha").val();
        var splFecIni = Fecha.split("/");
        Fecha = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
        var url = "/Reportes/ParteAtencionDiario?area=Reportes&idTipoServicio=" + idTipoServicio
                + "&idDepartamento=" + idDepartamento + "&idEspecialidad=" + idEspecialidad
                + "&idServicio=" + idServicio + "&idDestino=" + idDestino + "&Fecha=" + Fecha;
        window.location.href = url;
    },


}
$(document).ready(function () {
    ID_ParteDiarioAtencion.inicializarComponentes();
    ID_ParteDiarioAtencion.listarCombos();
    ID_ParteDiarioAtencion.cargarComboServicios();
    ID_ParteDiarioAtencion.cargarComboEspecialidades();

});
