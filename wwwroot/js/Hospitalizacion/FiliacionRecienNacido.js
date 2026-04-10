var FiliacionRn = {
    idPaciente: 0,
    idCuentaAtencion: 0,
    idCuentaAtencionMadre: 0,



    async GuardarFiliacion() {
        let resp = null;

        if (FiliacionRn.ValidarCampos() == false) {
            return null;
        }

        //let nroRn = 0
        //if (!isEmpty($("#cboNumeroGemelar").val())) {
        //    let gemelar = $('#cboNumeroGemelar option:selected').text();
        //    if (gemelar == "PUN") {
        //        nroRn = 0;
        //    } else {
        //        nroRn = gemelar.match(/\d+/);
        //    }
        //}

        var midata = new FormData();        
        midata.append("IdCuentaAtencionMadre", FiliacionRn.idCuentaAtencionMadre);
        
        midata.append("FechaNacimiento", $("#txtFechaNacimiento").val());
        midata.append("HoraNacimiento", $("#txtHoraNacimiento").val());
        midata.append("IdTipoSexo", $("#cboTipoSexo").val());        
        midata.append("NroGemelar", $("#cboNumeroGemelar").val());
                
        midata.append("IdServicioIngreso", $("#cboServicioIngreso").val());
        midata.append("IdDiagnosticoIngreso", $("#cboDiagnosticoIngreso").val());
        midata.append("IdMedicoIngreso", $("#cboMedicoIngreso").val());

        midata.append('idListBar', ObtenerItemListBar());
                
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FiliacionPaciente/FiliacionRecienNacidoGuardar?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = null;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = null;
                    }

                    if (datos.successNumber > 0) {
                        //alerta2("success", "", datos.successMessage);
                        resp = datos;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },


    ValidarCampos() {
        //if (TriajeRn.idCuentaMadre == 0) { alerta2("info", "", "Debe ingresar la cuenta de la madre."); $('#nacimiento-tab-link').trigger('click'); $("#txtNroCuentaMadre").focus(); return false; }
        if (isEmpty($("#txtFechaNacimiento").val())) { alerta2("info", "", "Debe ingresar la fecha de nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#txtFechaNacimiento").focus(); return false; }
        if (isEmpty($("#txtHoraNacimiento").val())) { alerta2("info", "", "Debe ingresar la hora de nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#txtHoraNacimiento").focus(); return false; }
        if (isEmpty($("#cboTipoSexo").val())) { alerta2("info", "", "Debe seleccionar el Sexo."); $('#nacimiento-tab-link').trigger('click'); $("#cboTipoSexo").focus(); $("#cboTipoSexo_chosen").addClass("chosen-container-active"); return false; }
        if ($("#cboNumeroGemelar").val() == '') { alerta2("info", "", "Debe seleccionar el Gemelar."); $('#nacimiento-tab-link').trigger('click'); $("#cboNumeroGemelar").focus(); $("#cboNumeroGemelar_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboServicioIngreso").val())) { alerta2("info", "", "Debe seleccionar el Servicio de Ingreso."); $('#nacimiento-tab-link').trigger('click'); $("#cboServicioIngreso").focus(); $("#cboServicioIngreso_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboDiagnosticoIngreso").val())) { alerta2("info", "", "Debe seleccionar el Diagnostico de Ingreso."); $('#nacimiento-tab-link').trigger('click'); $("#cboDiagnosticoIngreso").focus(); $("#cboDiagnosticoIngreso_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboMedicoIngreso").val())) { alerta2("info", "", "Debe seleccionar el Médico de Ingreso."); $('#nacimiento-tab-link').trigger('click'); $("#cboMedicoIngreso").focus(); $("#cboMedicoIngreso_chosen").addClass("chosen-container-active"); return false; }

        return true;
    },


}