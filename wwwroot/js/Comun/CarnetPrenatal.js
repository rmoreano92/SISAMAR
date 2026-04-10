var CarnetPrenatal = {

    /*
    async GenerarCarnetVista(idPaciente) {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idPaciente', idPaciente);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CarnetPrenatal/GenerarPdf?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                //permisoRefcon = datos.respuesta;
                resp = datos.respuesta.table[0];
                //console.log(permisoRefcon);
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },
    */

    async GenerarCarnetVista(idPaciente) {
        Cargando(1);
        
        var formData = new FormData();
        formData.append('idPaciente', idPaciente);

        var url = "/CarnetPrenatal/GenerarCarnetPrenatal?area=Comun";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);
        
        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "CarnetPrenatal-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    AbrirVisorDocumentoPersonalizado(url, "Carnet Control Prenatal");
                } 
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }           
        }
        request.send(formData);
        //Cargando(0);        
    },
}