var SGCConfiguracion = {
    Iniciar() {
        SGCConfiguracion.Eventos();
        SGCConfiguracion.ListarVentanillas();
    },

    Eventos() {
        $('#btnSubirVideos').click(async function () {
            if ($('#archivosVideos')[0].files.length > 0) {
                await SGCConfiguracion.SubirVideos();
            } else {
                alerta2("info","","Por favor seleccione un archivo de video en formato mp4.")
            }            
        });
    },

    async SubirVideos() {
        var resp = false;
        let datos;
        var formData = new FormData();
        var file = $('#archivosVideos')[0].files[0];
        formData.append('video', file);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SGCConfiguracion/SubirVideo",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $('#archivosVideos').val("")
            Cargando(0);
            alerta2("success", "", "Se guardo los videos con éxito.");
        } catch (error) {
            Cargando(0);
            alerta(error);
        }
    },

    async ListarVentanillas() {
        var resp = false;
        let datos;
        //var data = new FormData();
        //data.append('tv', tv);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SGCConfiguracion/ListarVentanillas",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //console.log(datos.respuesta.table[0]);
            SGCConfiguracion.CargarVistaVentanillas(datos);
        } catch (error) {
            Cargando(0);
            alert(error);
        }
        //return resp;
    },

    async AbrirCerrarVentanilla(idVentannilla) {
        var resp = false;
        let datos;
        var data = new FormData();
        data.append('idVentanilla', idVentannilla);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SGCConfiguracion/AbrirCerrarVentanilla",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);        
            SGCConfiguracion.ListarVentanillas();
            //console.log(datos.respuesta.table[0]);
            
        } catch (error) {
            Cargando(0);
            alert(error);
        }
        //return resp;
    },


    CargarVistaVentanillas(datos) {
        $('#Ventanillas').html('');

        $(datos.table).each(function (i, obj) {
            $('#Ventanillas').append(
                '<div class="col-md-4 col-xl-3 col-xxl-2">' +
                '<div class="form-group m-0">' +
                '<label style="width: 100%;font-weight:bold">' + obj.nombre + '</label>' +
                '<div class="switch-field">' +
                '<input type="radio" id="rdbVentanilla'+obj.idVentanilla+'Si" name="rdbVentanilla'+obj.idVentanilla+'" class="rdbVentanilla" />' +
                '<label for="rdbVentanilla' + obj.idVentanilla +'Si" class="rdbAbierto" onClick="SGCConfiguracion.AbrirCerrarVentanilla('+obj.idVentanilla+')">ABIERTO</label>' +
                '<input type="radio" id="rdbVentanilla'+obj.idVentanilla+'No" name="rdbVentanilla'+obj.idVentanilla+'" class="rdbVentanilla" />' +
                '<label for="rdbVentanilla'+obj.idVentanilla+'No" class="rdbCerrado" onClick="SGCConfiguracion.AbrirCerrarVentanilla('+obj.idVentanilla+')">CERRADO</label>' +
                '</div>' +
                '</div>' +
                '</div>'
            );

            if (obj.estado == 1) {
                $('#rdbVentanilla' + obj.idVentanilla + 'Si').prop('checked', true);
            } else if (obj.estado == 0) {
                $('#rdbVentanilla' + obj.idVentanilla + 'No').prop('checked', true);
            }

            //index++;
        });
    },

}


$(document).ready(function () {
    //$("#MenuConfiguracion").addClass("active");
    SGCConfiguracion.Iniciar();
    //Admision.Redimenzionar();
    //ConsultaExterna.ListarFlujoAtencionConsultaExterna();
    //setInterval("ConsultaExterna.ListarFlujoAtencionConsultaExterna()", 5000);
});