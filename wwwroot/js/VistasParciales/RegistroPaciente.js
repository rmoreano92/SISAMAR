
var RegistroPaciente = {
    plugins() {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaVigencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

    },
   listaTiposDocumentos() {

        $.ajax({
            url: "/Utilitario/ListaTiposDocumentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboTipoDocumento').empty();
                $('#cboTipoDocumentoMT').empty();

                if (datos.session) {
                    $(datos.lsDocumentos.table).each(function (i, obj) {

                        $('#cboTipoDocumento').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcionLarga + '</option>');
                        $('#cboTipoDocumentoMT').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcionLarga + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de documentos!", "2");
                }, 900)
            }
        });
    },

    listaTiposSexo() {

        $.ajax({
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboSexo').empty();

                if (datos.session) {
                    $(datos.lsSexos.table).each(function (i, obj) {

                        $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');

                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de sexos!", "2");
                }, 900)
            }
        });
    },

    listaTiposHistoriaClinica() {
        var midata = new FormData();
        midata.append('tipoServicio', $('#idServicio').val());
        $.ajax({
            url: "/Utilitario/TiposGeneracionHistorias?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                
                $('#cboHistoria').empty();
                if (datos.session) {
                    $(datos.lsSexos.table).each(function (i, obj) {
                        $('#cboHistoria').append('<option  value="' + obj.idTipoNumeracion + '">' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de historia!", "2");
                }, 900)
            }
        });
    },
    listaListaTiposEstadoCivilTodos() {
        
        $.ajax({
            url: "/Utilitario/ListaTiposEstadoCivilTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboEstadoCivil').empty();
                if (datos.session) {
                    $(datos.lsEstadoCivil.table).each(function (i, obj) {
                        $('#cboEstadoCivil').append('<option  value="' + obj.idEstadoCivil + '">' + obj.dCorto + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de estado civil!", "2");
                }, 900)
            }
        });
    },
    TiposGradoInstruccionTodos() {

        $.ajax({
            url: "/Utilitario/TiposGradoInstruccionTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboGradoInstruccion').empty();
                if (datos.session) {
                    $(datos.lsGradosIns.table).each(function (i, obj) {
                        $('#cboGradoInstruccion').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar grados de instruccion!", "2");
                }, 900)
            }
        });
    },
    TiposEdadSeleccionarTodos() {

        $.ajax({
            url: "/Utilitario/TiposEdadSeleccionarTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboEdadActual').empty();
                if (datos.session) {
                    $(datos.lsTiposEdad.table).each(function (i, obj) {
                        $('#cboEdadActual').append('<option  value="' + obj.idTipoEdad + '">' + obj.descripcionLarga + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de edad!", "2");
                }, 900)
            }
        });
    },
    TiposProcedenciaTodos() {

        $.ajax({
            url: "/Utilitario/TiposProcedenciaTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboProcedencia').empty();
                if (datos.session) {
                    $(datos.lsTProcedencias.table).each(function (i, obj) {
                        $('#cboProcedencia').append('<option  value="' + obj.idProcedencia + '">' + obj.dCorto + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de edad!", "2");
                }, 900)
            }
        });
    },
    TiposOcupacionTodos() {

        $.ajax({
            url: "/Utilitario/TiposOcupacionTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboOcupacion').empty();
                if (datos.session) {
                    $(datos.lsOcupacion.table).each(function (i, obj) {
                        $('#cboOcupacion').append('<option  value="' + obj.idTipoOcupacion + '">' + obj.dCorto + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de edad!", "2");
                }, 900)
            }
        });
    },
    TiposIdiomasSeleccionarTodos() {

        $.ajax({
            url: "/Utilitario/TiposIdiomasSeleccionarTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboIdioma').empty();
                if (datos.session) {
                    $(datos.lsIdiomas.table).each(function (i, obj) {
                        $('#cboIdioma').append('<option  value="' + obj.idIdioma + '">' + obj.lengua + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de edad!", "2");
                }, 900)
            }
        });
    },
    TiposEtnia() {

        $.ajax({
            url: "/Utilitario/TiposEtnia?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboEtnia').empty();
                if (datos.session) {
                    $(datos.lsEtnia.table).each(function (i, obj) {
                        $('#cboEtnia').append('<option  value="' + obj.codetni + '">' + obj.desetni + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de edad!", "2");
                }, 900)
            }
        });
    },
    TiposReligion() {

        $.ajax({
            url: "/Utilitario/TiposReligion?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboReligion').empty();
                if (datos.session) {
                    $(datos.lsReligion.table).each(function (i, obj) {
                        $('#cboReligion').append('<option  value="' + obj.codReligion + '">' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar tipos de religion!", "2");
                }, 900)
            }
        });
    },
    ListaDepartamentos() {

        $.ajax({
            url: "/Utilitario/ListaDepartamentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboDepartamentoDomicilio').empty();
                if (datos.session) {
                    $(datos.lsDeparta.table).each(function (i, obj) {
                        $('#cboDepartamentoDomicilio').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar departamentos!", "2");
                }, 900)
            }
        });
    },
    ListaProvincias() {
        var midata = new FormData();
        midata.append('idDepartamento', $('#cboDepartamentoDomicilio').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboProvinciaDomicilio').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cboProvinciaDomicilio').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });
    },
    ListaDistrito() {
        var midata = new FormData();
        midata.append('idDProvincia', $('#cboProvinciaDomicilio').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboDistritoDomicilio').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cboDistritoDomicilio').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },
    ListaCentroPoblado() {
        //alert(1)
        var midata = new FormData();
        midata.append('idDistrito', $('#cboDistritoDomicilio').val());
        $.ajax({
            url: "/Utilitario/ListaCentroPobladoByDistrito?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboCentroPoblado').empty();
                $('#cboCentroPoblado').append('<option  value="0">Seleccione</option>');
                if (datos.session) {
                    $(datos.lsCentroPoblado.table).each(function (i, obj) {
                        $('#cboCentroPoblado').append('<option  value="' + obj.idCentroPoblado + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },
    ListaPaises() {
        $.ajax({
            url: "/Utilitario/ListaPaises?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cboPaisDomicilio').empty();
                if (datos.session) {
                    $(datos.lsCentroPoblado.table).each(function (i, obj) {
                        $('#cboPaisDomicilio').append('<option  value="' + obj.idPais + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar paises!", "2");
                }, 900)
            }
        });
    },
    eventos() {
        $('#cboDepartamentoDomicilio').on('change', function () {
            
            RegistroPaciente.ListaProvincias();
            RegistroPaciente.ListaDistrito();
            $('#cboCentroPoblado').empty();
            
        });
        $('#cboProvinciaDomicilio').on('change', function () {
          
            RegistroPaciente.ListaDistrito();
            RegistroPaciente.ListaCentroPoblado();
        });
        $('#cboDistritoDomicilio').on('change', function () {

            RegistroPaciente.ListaCentroPoblado();

        });
    },
    crearModificarHistoria() {
        //alert(1)
        var midata = new FormData();
        midata.append("IdPaciente", $("#").val());
        midata.append("ApellidoPaterno", $("#txtApellidoPaterno").val());
        midata.append("ApellidoMaterno", $("#txtApellidoMaterno").val());
        midata.append("PrimerNombre", $("#txtPrimerNombre").val());
        midata.append("SegundoNombre", $("#txtSegundoNombre").val());
        midata.append("TercerNombre", $("#txtTercerNombre").val());
        midata.append("FechaNacimiento", $("#txtFechaNac").val());
        midata.append("NroDocumento", $("#txtNumeroDoc").val());
        midata.append("Telefono", $("#txtTelefono").val());
        midata.append("DireccionDomicilio", $("#txtDireccion").val());
        midata.append("Autogenerado", $("#").val()); //verificar
        midata.append("IdTipoSexo", $("#cboSexo").val());
        midata.append("IdProcedencia", $("#cboProcedencia").val());
        midata.append("IdGradoInstruccion", $("#cboGradoInstruccion").val());
        midata.append("IdEstadoCivil", $("#cboEstadoCivil").val());
        midata.append("IdDocIdentidad", $("#cboTipoDocumento").val());
        midata.append("IdTipoOcupacion", $("#cboOcupacion").val());
        midata.append("IdCentroPobladoNacimiento", $("#").val());
        midata.append("IdCentroPobladoDomicilio", $("#cboCentroPoblado").val());
        midata.append("NombrePadre", $("#txtNombrePadre").val());
        midata.append("NombreMadre", $("#txtPrimerNombreMT").val());
        midata.append("NroHistoriaClinica", $("#txtNumeroHc").val());
        midata.append("IdTipoNumeracion", $("#cboHistoria").val());
       // midata.append("IdCentroPobladoProcedencia", $("#").val());
       // midata.append("Observacion", $("#").val());
        midata.append("IdPaisDomicilio", $("#cboPaisDomicilio").val());
       // midata.append("IdPaisProcedencia", $("#").val());
       // midata.append("IdPaisNacimiento", $("#").val());
       //  midata.append("IdDistritoProcedencia", $("#").val());
        midata.append("IdDistritoDomicilio", $("#cboDistritoDomicilio").val());
       // midata.append("IdDistritoNacimiento", $("#").val());
       //  midata.append("FichaFamiliar", $("#").val());
        midata.append("IdEtnia", $("#cboEtnia").val());
       //  midata.append("GrupoSanguineo", $("#").val());
      //  midata.append("FactorRh", $("#").val());
      //  midata.append("UsoWebReniec", $("#").val());
        midata.append("IdIdioma", $("#cboIdioma").val());
        midata.append("Email", $("#txtEmail").val());
        midata.append("madreDocumento", $("#txtNumeroDocMT").val()); 
        midata.append("madreApellidoPaterno", $("#txtApellidoPaternoMT").val());
        midata.append("madreApellidoMaterno", $("#txtApellidoMaternoMT").val());
        midata.append("madrePrimerNombre", $("#txtPrimerNombreMT").val());
        midata.append("madreSegundoNombre", $("#txtSegundoNombreMT").val());
        midata.append("NroOrdenHijo", $("#txtHijo").val());
        midata.append("madreTipoDocumento", $("#cboTipoDocumentoMT").val());
       // midata.append("Sector", $("#").val());
       // midata.append("Sectorista", $("#").val());
      //  midata.append("EstadoMigracion", $("#").val());
        midata.append("Religion", $("#cboReligion").val());
      //  midata.append("Acompaniante", $("#").val());

        $.ajax({
            url: "/Paciente/CrearModificarHistoria?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {   
                if (datos.session) {
                 
                }
                else {
                 
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al crear/modificar historia!", "2");
                }, 900)
            }
        });
    },
    CargaInicial() {
        RegistroPaciente.listaTiposDocumentos();
        RegistroPaciente.listaTiposHistoriaClinica();
        RegistroPaciente.listaTiposSexo();
        RegistroPaciente.listaListaTiposEstadoCivilTodos();
        RegistroPaciente.TiposGradoInstruccionTodos();
        RegistroPaciente.TiposEdadSeleccionarTodos();
        RegistroPaciente.TiposProcedenciaTodos();
        RegistroPaciente.TiposOcupacionTodos();
        RegistroPaciente.TiposIdiomasSeleccionarTodos();
        RegistroPaciente.TiposEtnia();
        RegistroPaciente.TiposReligion();
        RegistroPaciente.ListaDepartamentos();
        RegistroPaciente.ListaProvincias();
        RegistroPaciente.ListaDistrito();
        RegistroPaciente.ListaPaises();
    },

};

$(document).ready(function () {

    RegistroPaciente.eventos();
    RegistroPaciente.CargaInicial();
       

});


