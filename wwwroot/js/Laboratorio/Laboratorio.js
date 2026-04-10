let codigo;
let resultado;
let LabMovimiento = {
  accion: "",
  idCuentaAtencion: 0,
  idAtencion: 0,
  idPaciente: 0,
  idMovimiento: 0,
  idOrden: 0,
  idOrdenPago: 0,
  idReceta: 0,
  idComprobantePago: 0,
  idTipoFinanciamiento: 0,
  idMovApReemplazo: 0,
  detalleExamenes: null,
  detalleInsumos: null,
};

let Laboratorio = {
  idCuentaAtencion: 0,
  idOrden: 0,
  idMovimiento: 0,
  idProducto: 0,
  idPuntoCarga: 0,
  puntoCarga: "",
  idCargoResponsable: 0,
  tipoResponsableEstudio: "",

  Plugins: () => {
    $(".hide_search").chosen({ disable_search_threshold: 10 });
    $(".chzn-select").chosen({ allow_single_deselect: true });
    $(".chzn-select-deselect,#select2_sample").chosen();

    $(
      "#txtBusqFechaInicio, #txtBusqFechaFin, #txtFechaResultado, #txtResFechaNacimiento, #txtMovFechaNacimiento, #txtFechaInicioReporteAnatomiaPatologica, #txtFechaFinReporteAnatomiaPatologica",
    ).datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
      dateFormat: "dd/mm/yy",
    });

    $.mask.definitions["D"] = "[0123]";
    $.mask.definitions["d"] = "[123456789]";
    $.mask.definitions["M"] = "[01]";
    $.mask.definitions["m"] = "[0123456789]";
    $.mask.definitions["a"] = "[12]";
    $.mask.definitions["b"] = "[0123456789]";
    $.mask.definitions["c"] = "[0123456789]";
    $.mask.definitions["d"] = "[0123456789]";
    $(
      "#txtBusqFechaInicio, #txtBusqFechaFin, #txtFechaResultado, #txtResFechaNacimiento, #txtMovFechaNacimiento, #txtFechaInicioReporteAnatomiaPatologica, #txtFechaFinReporteAnatomiaPatologica",
    ).mask("Dd/Mm/abcd");

    $.mask.definitions["H"] = "[012]";
    $.mask.definitions["N"] = "[012345]";
    $.mask.definitions["n"] = "[0123456789]";
    $(
      "#txtBusqHoraInicio, #txtBusqHoraFin, #txtHoraResultado, #txtMovHoraNacimiento",
    ).mask("Hn:Nn");

    $(".chosen-select").chosen();
  },

  CargaInicial: async () => {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes;
    fechaP = dia + "/" + mes + "/" + yyy;

    $("#txtBusqFechaInicio").datepicker("setDate", fechaP);
    $("#txtBusqFechaFin").datepicker("setDate", fechaP);
    $("#txtFechaInicioReporteAnatomiaPatologica").datepicker("setDate", fechaP);
    $("#txtFechaFinReporteAnatomiaPatologica").datepicker("setDate", fechaP);

    $("#txtBusqHoraInicio").val("00:00:00");
    $("#txtBusqHoraFin").val("23:59:59");

    Laboratorio.idPuntoCarga = $("#PuntoCarga").html();
    $("#frameAnatomiaPatologica").hide();
    $("#frameCargarImagenResLab").hide();
    if (Laboratorio.idPuntoCarga == 2) {
      Laboratorio.idCargoResponsable = 10;
      Laboratorio.puntoCarga = "Patología Clínica";
    }
    if (Laboratorio.idPuntoCarga == 3) {
      $("#frameAnatomiaPatologica").show();
      Laboratorio.idCargoResponsable = 11;
      Laboratorio.tipoResponsableEstudio = $("#ResposanbleTipoEstudio").html();
      //Laboratorio.tipoResponsableEstudio == 'C' ? $('#rdbMovTipoEstudioCito').prop("checked", true) : (Laboratorio.tipoResponsableEstudio == 'H' ? $('#rdbMovTipoEstudioHisto').prop("checked", true) : false)          //SE COMENTO A PETICIO DEL ING. ROLY
      Laboratorio.puntoCarga = "Anatomía Patológica";
    }
    if (Laboratorio.idPuntoCarga == 11) {
      Laboratorio.idCargoResponsable = 19;
      Laboratorio.puntoCarga = "Banco de Sangre";
    }
    if (Laboratorio.idPuntoCarga == 13) {
      $("#frameCargarImagenResLab").show();
      Laboratorio.idCargoResponsable = 43;
      Laboratorio.puntoCarga = "Genética";
    }
    if (Laboratorio.idPuntoCarga == 14) {
      $("#frameCargarImagenResLab").show();
      Laboratorio.idCargoResponsable = 43;
      Laboratorio.puntoCarga = "Tamizaje Neonatal";
    }

    BusqRecetasPacientes.idPuntoCarga = Laboratorio.idPuntoCarga;

    $(".chzn-select").chosen().trigger("chosen:updated");

    const permisoResultados = await Utilitario.ValidarPermiso(701);
    if (permisoResultados == false) {
      $("#btnModificarResultadoLab").remove();
      $("#btnEliminarResultadoLab").remove();
    }
  },

  CargarCombos() {
    $.ajax({
      async: false,
      cache: false,
      url: "/Utilitario/listarTipoServicio?area=Comun",
      datatype: "json",
      type: "get",
      success: function (datos) {
        $("#cboBusqTipoServicio").empty();
        $(datos.data.table).each(function (i, obj) {
          if (obj.valor < 4) {
            $("#cboBusqTipoServicio").append(
              '<option  value="' +
                obj.valor +
                '">' +
                obj.descripcion +
                "</option>",
            );
          }
        });
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2("danger", "", "Error listar tipos servicio!");
        }, 900);
      },
    });

    $.ajax({
      async: false,
      cache: false,
      url: "/ConfiguracionResultadosLaboratorio/LabGruposSeleccionarTodos?area=FactConfig",
      datatype: "json",
      type: "post",
      success: function (datos) {
        $("#cboBusqGrupoExamen").empty();
        $("#cboBusqGrupoExamen").append('<option value="0">Todos</option>');
        $(datos.dataSet.table).each(function (i, obj) {
          $("#cboBusqGrupoExamen").append(
            '<option  value="' +
              obj.idGrupo +
              '">' +
              obj.nombreGrupo +
              "</option>",
          );
        });
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2("danger", "", "Error listar grupos examen!");
        }, 900);
      },
    });

    $.ajax({
      async: false,
      cache: false,
      url: "/LaboratorioResultados/EmpleadosLaboratorioTodos?area=Laboratorio",
      datatype: "json",
      type: "post",
      success: function (datos) {
        $("#cboBusqRealizaExamen").empty();
        $("#cboBusqRealizaExamen").append('<option value="0">Todos</option>');
        $(datos.dataSet.table).each(function (i, obj) {
          $("#cboBusqRealizaExamen").append(
            '<option  value="' +
              obj.idEmpleado +
              '">' +
              obj.apNom +
              "</option>",
          );
        });
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2("danger", "", "Error listar empleados laboratorio!");
        }, 900);
      },
    });

    let formDataCargo = new FormData();
    formDataCargo.append("idCargo", Laboratorio.idCargoResponsable);
    $.ajax({
      async: false,
      cache: false,
      url: "/LaboratorioResultados/EmpleadosLaboratorioPorCargo?area=Laboratorio",
      datatype: "json",
      type: "post",
      data: formDataCargo,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboMovRegistraOrden").empty();
        $(datos.dataSet.table).each(function (i, obj) {
          $("#cboMovRegistraOrden").append(
            '<option  value="' +
              obj.idEmpleado +
              '">' +
              obj.apNom +
              "</option>",
          );
        });
        $("#cboMovRegistraOrden").val("");
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2(
            "danger",
            "",
            "Error listar empleados por cargo laboratorio!",
          );
        }, 900);
      },
    });

    $.ajax({
      async: false,
      cache: false,
      url: "/Empleados/ListarMedicosTodos?area=Seguridad",
      datatype: "json",
      type: "post",
      success: function (datos) {
        $("#cboMovMedicoSolicita").empty();
        $("#cboMovMedicoRealiza").empty();
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboMovMedicoSolicita").append(
            '<option  value="' +
              obj.idEmpleado +
              '">' +
              obj.apNom +
              "</option>",
          );
          $("#cboMovMedicoRealiza").append(
            '<option  value="' +
              obj.idEmpleado +
              '">' +
              obj.apNom +
              "</option>",
          );
        });
        $("#cboMovMedicoSolicita").val("");
        $("#cboMovMedicoRealiza").val("");
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2(
            "danger",
            "",
            "ERROR",
            "Error listar medicos solciita y realiza",
          );
        }, 900);
      },
    });

    $.ajax({
      async: false,
      cache: false,
      url: "/Utilitario/ListaTiposSexo?area=Comun",
      datatype: "json",
      type: "get",
      success: function (datos) {
        $("#cboMovSexo").empty();
        $(datos.lsSexos.table).each(function (i, obj) {
          $("#cboMovSexo").append(
            '<option  value="' +
              obj.idTipoSexo +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $("#cboMovSexo").val("");
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2(
            "danger",
            "",
            "ERROR",
            "Error listar medicos solciita y realiza",
          );
        }, 900);
      },
    });

    $.ajax({
      async: false,
      cache: false,
      url: "/Utilitario/ListarTiposFinanciamientos?area=Comun",
      datatype: "json",
      type: "post",
      success: function (datos) {
        $("#cboMovPlan").empty();
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboMovPlan").append(
            '<option  value="' +
              obj.idTipoFinanciamiento +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $("#cboMovPlan").val("");
      },
      error: function (msg) {
        setTimeout(function () {
          alerta2(
            "danger",
            "",
            "ERROR",
            "Error listar medicos solciita y realiza",
          );
        }, 900);
      },
    });

    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  //FactOrdenServicioPorFechasLabPaciente: () => {
  //    let formData = new FormData()
  //    formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
  //    formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
  //    formData.append('idPuntoCarga', Laboratorio.idPuntoCarga) // cambiar por parametro

  //    //oTable_patologiaClinica.fnClearTable()
  //    //oTable_reporteICIDonaciones.fnClearTable()
  //    return HttpClient.Post('/LaboratorioResultados/FactOrdenServicioPorFechasLabPaciente?area=Laboratorio', formData)
  //        .then(res => {
  //            if (res.estado) {
  //                return res.data.table
  //            } else {
  //                alerta(3, res.mensaje)
  //                return null
  //            }
  //        })
  //        .catch(e => {
  //            alerta(2, 'Error: ' + e)
  //            return null
  //        })
  //},

  LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga: (
    idOrden,
    idPuntoCarga,
    idMovimiento,
  ) => {
    let formData = new FormData();
    formData.append("idOrden", idOrden);
    formData.append("idPuntoCarga", idPuntoCarga);
    formData.append("idMovimiento", idMovimiento); // cambiar por parametro

    //oTable_patologiaClinica.fnClearTable()
    //oTable_reporteICIDonaciones.fnClearTable()
    return HttpClient.Post(
      "/LaboratorioResultados/LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga?area=Laboratorio",
      formData,
    )
      .then((res) => {
        if (res.estado) {
          if (res.data.table.length > 0) {
            return res.data.table;
          } else {
            return null;
          }
        } else {
          alerta(3, res.mensaje);
          return null;
        }
      })
      .catch((e) => {
        alerta(2, "Error: " + e);
        return null;
      });
  },

  FactOrdenServicioPorFechasLabPaciente: () => {
    let formData = new FormData();
    formData.append("idMovimiento", $("#txtBusqNroMovimiento").val());
    formData.append("idCuenta", $("#txtBusqNroCuenta").val());
    formData.append("historia", $("#txtBusqNroHistoria").val());
    formData.append("nombres", $("#txtBusqNombres").val());
    formData.append(
      "fechaInicio",
      $("#txtBusqFechaInicio").val() + " " + $("#txtBusqHoraInicio").val(),
    );
    formData.append(
      "fechaFin",
      $("#txtBusqFechaFin").val() + " " + $("#txtBusqHoraFin").val(),
    );
    formData.append("idTipoServicio", $("#cboBusqTipoServicio").val());
    formData.append("idGrupoExamen", $("#cboBusqGrupoExamen").val());
    formData.append("idRealizaExamen", $("#cboBusqRealizaExamen").val());
    formData.append("idPuntoCarga", Laboratorio.idPuntoCarga); // cambiar por parametro

    //oTable_patologiaClinica.fnClearTable()
    //oTable_reporteICIDonaciones.fnClearTable()
    return HttpClient.Post(
      "/LaboratorioResultados/ListarMovimientosLaboratorio?area=Laboratorio",
      formData,
    )
      .then((res) => {
        if (res.estado) {
          return res.data.table;
        } else {
          alerta(3, res.mensaje);
          return null;
        }
      })
      .catch((e) => {
        alerta(2, "Error: " + e);
        return null;
      });
  },

  ListarMovimientosLaboratorioTamizaje: () => {
    let formData = new FormData();
    formData.append("idMovimiento", $("#txtBusqNroMovimiento").val());
    formData.append("idCuenta", $("#txtBusqNroCuenta").val());
    formData.append("historia", $("#txtBusqNroHistoria").val());
    formData.append("nombres", $("#txtBusqNombres").val());
    formData.append(
      "fechaInicio",
      $("#txtBusqFechaInicio").val() + " " + $("#txtBusqHoraInicio").val(),
    );
    formData.append(
      "fechaFin",
      $("#txtBusqFechaFin").val() + " " + $("#txtBusqHoraFin").val(),
    );
    formData.append("idTipoServicio", $("#cboBusqTipoServicio").val());
    formData.append("idGrupoExamen", $("#cboBusqGrupoExamen").val());
    formData.append("idRealizaExamen", $("#cboBusqRealizaExamen").val());
    formData.append("idPuntoCarga", Laboratorio.idPuntoCarga); // cambiar por parametro

    //oTable_patologiaClinica.fnClearTable()
    //oTable_reporteICIDonaciones.fnClearTable()
    return HttpClient.Post(
      "/LaboratorioResultados/ListarMovimientosLaboratorioTamizaje?area=Laboratorio",
      formData,
    )
      .then((res) => {
        if (res.estado) {
          return res.data.table;
        } else {
          alerta(3, res.mensaje);
          return null;
        }
      })
      .catch((e) => {
        alerta(2, "Error: " + e);
        return null;
      });
  },

  FactOrdenServicioPorIdMovimiento: (idMovimiento, idPuntoCarga) => {
    let formData = new FormData();
    formData.append("idMovimiento", idMovimiento);
    formData.append("idPuntoCarga", idPuntoCarga); // cambiar por parametro

    //oTable_patologiaClinica.fnClearTable()
    //oTable_reporteICIDonaciones.fnClearTable()
    return HttpClient.Post(
      "/PatologiaClinica/FactOrdenServicioPorIdMovimiento?area=Laboratorio",
      formData,
    )
      .then((res) => {
        if (res.estado) {
          return res.data.table;
        } else {
          alerta(3, res.mensaje);
          return null;
        }
      })
      .catch((e) => {
        alerta(2, "Error: " + e);
        return null;
      });
  },

  async EmpleadosLaboratorioResultados(idGrupo) {
    let respuesta = null;
    let resp = false;
    let data = new FormData();

    data.append("idGrupo", idGrupo);

    try {
      $("#cboRealizaPrueba").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/EmpleadosLaboratorioPorGrupo?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboRealizaPrueba").append(
          '<option  value="' + obj.idEmpleado + '">' + obj.apNom + "</option>",
        );
      });
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async ListarTiposMuestraLab() {
    let respuesta = null;
    let resp = false;
    let data = new FormData();

    try {
      $("#cboTipoMuestra").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarTiposMuestraLab?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboTipoMuestra").append(
          '<option  value="' +
            obj.idTipoMuestra +
            '">' +
            obj.nombreMuestra +
            "</option>",
        );
      });

      $("#cboTipoMuestra").val(0);
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async ListarEstadoEstudio() {
    let respuesta = null;
    let resp = false;
    let data = new FormData();

    try {
      $("#cboEstadoEstudio").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarEstadoEstudio?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboEstadoEstudio").append(
          '<option  value="' +
            obj.idEstadoEstudio +
            '">' +
            obj.nombreEstado +
            "</option>",
        );
      });

      $("#cboEstadoEstudio").val(0);
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async ListarGradoDiferenciacion() {
    let data = new FormData();

    try {
      $("#cboGradoDiferenciacion").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarGradoDiferenciacion?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboGradoDiferenciacion").append(
          '<option  value="' +
            obj.codigo +
            '">' +
            obj.valor +
            "</option>",
        );
      });

      $("#cboGradoDiferenciacion").val(0);
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async ListarLateralidad() {
    let data = new FormData();

    try {
      $("#cboLateralidad").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarLateralidad?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboLateralidad").append(
          '<option  value="' +
            obj.codigo +
            '">' +
            obj.valor +
            "</option>",
        );
      });

      $("#cboLateralidad").val(0);
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async ListarMetodoDiagnostico() {
    let data = new FormData();

    try {
      $("#cboMetodoDiagnostico").empty();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarMetodoDiagnostico?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      $(datos.dataSet.table).each(function (i, obj) {
        $("#cboMetodoDiagnostico").append(
          '<option  value="' +
            obj.codigo +
            '">' +
            obj.valor +
            "</option>",
        );
      });

      $("#cboMetodoDiagnostico").val(0);
      $(".chzn-select").chosen().trigger("chosen:updated");
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  async CargarDatosResultadosLaboratorio(datos) {
    Laboratorio.LimpiarCamposResultados();
    $("#TituloModalResLab").text("(" + datos.codigo + ") " + datos.nombre);
    await Laboratorio.EmpleadosLaboratorioResultados(datos.idGrupo);

    await Laboratorio.ListarTiposMuestraLab();
    await Laboratorio.ListarEstadoEstudio();
    await Laboratorio.ListarGradoDiferenciacion();
    await Laboratorio.ListarLateralidad();
    await Laboratorio.ListarMetodoDiagnostico();

    Laboratorio.idCuentaAtencion = datos.idCuentaAtencion;
    Laboratorio.idOrden = datos.idOrden;
    Laboratorio.idMovimiento = datos.idMovimiento;
    Laboratorio.idProducto = datos.idProducto;
    $("#txtGrupoExamen").val(datos.grupo);
    //$("#txtFechaResultado").val();
    $("#txtFechaResultado").datepicker("setDate", datos.fechaResultado);
    $("#txtHoraResultado").val(datos.horaResultado);
    $("#txtCodigoIngreso").val(datos.codigoIngreso);
    $("#txtMedicoSolicitante").val(datos.medicoSolicitante);
    $("#cboRealizaPrueba").val(datos.idRealizaAnalisis);

    $("#cboTipoMuestra").val(datos.idTipoMuestra);
    $("#cboEstadoEstudio").val(datos.idEstadoEstudio);
    $("#cboGradoDiferenciacion").val(datos.gradoDiferenciacion);
    //$("#cboMetodoDiagnostico").val(datos.metodoDiagnostico);
    $("#cboLateralidad").val(datos.lateralidad);

    await Laboratorio.ListarDiagnosticosLaboratorio(
      datos.idCuentaAtencion,
      datos.idOrden,
    );
    await Laboratorio.ListarDiagnosticosCIE0Laboratorio(
      datos.idCuentaAtencion,
      datos.idOrden,
    );

    await Laboratorio.ListarDiagnosticosCIE0LaboratorioMorfologico(
          datos.idCuentaAtencion,
          datos.idOrden,
    )

    $("#txtResNroHistoria").val(datos.nroHistoriaClinica);
    $("#txtResTipoHistoria").val(datos.tipoHistoria);
    $("#txtResApPaterno").val(datos.apPaterno);
    $("#txtResApMaterno").val(datos.apMaterno);
    $("#txtResNombres").val(datos.nombres);
    $("#txtResSexo").val(datos.sexo);
    //$("#txtResFechaNacimiento").val(respuesta.fechaNacimiento);
    $("#txtResFechaNacimiento").datepicker("setDate", datos.fechaNacimiento);
    //$("#txtResEdad").val(CalcularEdadSegunFecha(datos.fechaNacimiento, datos.fechaOrden));
    let edad = null;
    edad = CalcularEdadAnioMesDiaSegunFecha(
      datos.fechaNacimiento,
      datos.fechaOrden,
    );
    $("#txtResEdad").val(
      edad.años + "A " + edad.meses + "M " + edad.días + "D ",
    );
    $("#txtResObservaciones").val(datos.obseraciones);
    $(".chzn-select").chosen().trigger("chosen:updated");

    $(".chosen-select").chosen().trigger("chosen:updated");
    //const cabecera = await Laboratorio.CargarCabeceraResultadosLaboratorio(idProducto, idOrden);
    //if (cabecera) {
    const formato = await Laboratorio.CargarFormatoResultado(datos.idProducto);
    if (formato) {
      const resultados = await Laboratorio.CargarResultadosLaboratorio(
        datos.idProducto,
        datos.idOrden,
        "LAB",
      );
      if (resultados) {
        $("#modalLabResultado").modal("show");
      }
    }
    //}
  },

  async CargarCabeceraResultadosLaboratorio(idProducto, idOrden) {
    let respuesta = null;
    let resp = false;
    let data = new FormData();

    data.append("idOrden", idOrden);
    data.append("idProducto", idProducto);
    data.append("tipo", "LAB");

    try {
      oTable_resultadosOrdenes.fnClearTable();
      $("#lblNombreExamen").html("");
      $("#tbodyResultados").html("");
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarCabeceraResultados?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      if (datos.lsResultados.table.length > 0) {
        respuesta = datos.lsResultados.table[0];
        $("#txtGrupoExamen").val(respuesta.grupo);
        //$("#txtFechaResultado").val();
        $("#txtFechaResultado").datepicker("setDate", respuesta.fechaResultado);
        $("#txtCodigoIngreso").val(respuesta.codigoIngreso);
        $("#txtMedicoSolicitante").val(respuesta.medicoSolicitante);
        $("#cboRealizaPrueba").val(respuesta.idRealizaAnalisis);

        $("#txtResNroHistoria").val(respuesta.nroHistoriaClinica);
        $("#txtResTipoHistoria").val(respuesta.tipoHistoria);
        $("#txtResApPaterno").val(respuesta.apPaterno);
        $("#txtResApMaterno").val(respuesta.apMaterno);
        $("#txtResNombres").val(respuesta.nombres);
        $("#txtResSexo").val(respuesta.sexo);
        //$("#txtResFechaNacimiento").val(respuesta.fechaNacimiento);
        $("#txtResFechaNacimiento").datepicker(
          "setDate",
          respuesta.fechaNacimiento,
        );
        $("#txtResEdad").val(
          CalcularEdadSegunFecha(
            respuesta.fechaNacimiento,
            respuesta.fechaResultado,
          ),
        );
        $(".chzn-select").chosen().trigger("chosen:updated");
        resp = true;
      } else {
        alerta2(
          "info",
          "",
          "No existen resultados para el examen seleccionado.",
        );
      }
    } catch (error) {
      alerta2("error", "", error);
    }

    return resp;
  },

  async CargarFormatoResultado(idProducto) {
    let resp = false;
    let i = 0;
    let j = 0;
    let lenT = 0;
    let lenC = 0;
    let valor = null;
    let valorCombo = null;
    const formato =
      await ConfigReslab.CargarFormatoResultadosLaboratorio(idProducto);
    lenT = formato.length;

    if (!isEmpty(formato)) {
      let hmltTablaFormato = "";
      //var resultados = datos.lsResultados.table;
      let htmlGrupo = "";
      let htmlItem = "";
      let htmlValorNumero = "";
      let htmlValorTexto = "";
      let htmlValorCombo = "";
      let htmlValorComboOption = "";
      let htmlValorCheck = "";
      let htmlValorReferencial = "";
      let controlValor = false;
      let controlCombo = false;
      let idCombo = "";
      let idComboTemp = "";
      //let htmlGrupoCombo = "";
      //let htmlItemCombo = "";

      oTable_ResultadosLaboratorio.fnClearTable();

      while (i < lenT) {
        valor = formato[i];

        controlValor = true;

        htmlGrupo = "<td>" + valor.grupo + "</td>";
        htmlItem = "<td>" + valor.item + "</td>";

        if (valor.soloNumero == 1 && controlValor == true) {
          htmlValorNumero =
            "<td><input type='text' class='form-control form-control-sm solo-numero campoResultado' id='numValorResultado_" +
            valor.idProductoCpt +
            "_" +
            valor.idGrupo +
            "_" +
            valor.idItemGrupo +
            "_" +
            valor.idItem +
            "_" +
            valor.ordenXresultado +
            "' data-ordenXresultado='" +
            valor.ordenXresultado +
            "' autocomplete='off'></td>";
          controlValor = false;
        } else {
          htmlValorNumero = "<td></td>";
        }

        if (valor.soloTexto == 1 && controlValor == true) {
          htmlValorTexto =
            "<td><input type='text' class='form-control form-control-sm campoResultado' id='txtValorResultado_" +
            valor.idProductoCpt +
            "_" +
            valor.idGrupo +
            "_" +
            valor.idItemGrupo +
            "_" +
            valor.idItem +
            "_" +
            valor.ordenXresultado +
            "' data-ordenXresultado='" +
            valor.ordenXresultado +
            "' autocomplete='off'></td>";
          controlValor = false;
        } else {
          htmlValorTexto = "<td></td>";
        }

        if (valor.soloCombo == 1 && controlValor == true) {
          controlCombo = true;
          //htmlGrupoCombo = "<td>" + valor.grupo + "</td>";
          //htmlItemCombo = "<td>" + valor.item + "</td>";
          htmlValorComboOption = "<option value=''></option>";
          idCombo =
            valor.idProductoCpt +
            "_" +
            valor.idGrupo +
            "_" +
            valor.idItemGrupo +
            "_" +
            valor.idItem;
          while (controlCombo && i < lenT) {
            valor = formato[i];
            idComboTemp =
              valor.idProductoCpt +
              "_" +
              valor.idGrupo +
              "_" +
              valor.idItemGrupo +
              "_" +
              valor.idItem;
            if (valor.soloCombo == 1 && idCombo == idComboTemp) {
              htmlValorComboOption =
                htmlValorComboOption +
                "<option value='" +
                valor.ordenXresultado +
                "' data-ordenXresultado='" +
                valor.ordenXresultado +
                "'>" +
                valor.valorSiEsCombo +
                "</option>";
              i++;

              if (i == lenT) {
                htmlValorCombo =
                  "<td>" +
                  "<select class='chzn-select-deselect w-100 campoResultado' data-placeholder='Seleccione una opción' id='cmbValorResultado_" +
                  idCombo +
                  "'>" +
                  htmlValorComboOption +
                  "</select>" +
                  "</td>";

                controlCombo = false;
                controlValor = false;
              }
            } else {
              htmlValorCombo =
                "<td>" +
                "<select class='chzn-select-deselect w-100 campoResultado' data-placeholder='Seleccione una opción' id='cmbValorResultado_" +
                idCombo +
                "'>" +
                htmlValorComboOption +
                "</select>" +
                "</td>";

              controlCombo = false;
              controlValor = false;
              i--;
            }
          }
        } else {
          htmlValorCombo = "<td></td>";
        }

        if (valor.soloCheck == 1 && controlValor == true) {
          //htmlValorCheck = "<td><input type='text' class='form-control form-control-sm' id='txtValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "' autocomplete='off'></td>";
          htmlValorCheck =
            "<td><div class='check__toggle text-sm-center'>" +
            "<label class='toggle'>" +
            "<input class='toggle__input campo bloquear-campos campoResultado' type='checkbox' id='chkValorResultado_" +
            valor.idProductoCpt +
            "_" +
            valor.idGrupo +
            "_" +
            valor.idItemGrupo +
            "_" +
            valor.idItem +
            "_" +
            valor.ordenXresultado +
            "' data-ordenXresultado='" +
            valor.ordenXresultado +
            "'>" +
            "<span class='toggle__label'></span>" +
            "</label>" +
            "</div>" +
            "</td>";
          controlValor = false;
        } else {
          htmlValorCheck = "<td></td>";
        }

        htmlValorReferencial =
          "<td><div id='txtValorReferencial_" +
          valor.idProductoCpt +
          "_" +
          valor.idGrupo +
          "_" +
          valor.idItemGrupo +
          "_" +
          valor.idItem +
          "_" +
          valor.ordenXresultado +
          "'>" +
          isNull(valor.valorReferencial, "") +
          "</div></td>";

        if (controlValor == false) {
          hmltTablaFormato =
            hmltTablaFormato +
            "<tr>" +
            htmlGrupo +
            htmlItem +
            htmlValorNumero +
            htmlValorTexto +
            htmlValorCombo +
            htmlValorCheck +
            htmlValorReferencial +
            "</tr>";
        }

        i++;
      }

      $("#tbodyFormatoResultadosLab").html(hmltTablaFormato);
      oTable_ResultadosLaboratorio.resize();
      //$('#tblResultadosExamenes').DataTable().columns.adjust();
      $(".chzn-select").chosen().trigger("chosen:updated");
      $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
      $("#tblFormatoResultadosLab .chzn-select").val("");
      $("#modalLabResultado").modal("show");

      return true;
    } else {
      alerta2(
        "info",
        "",
        "No existe formato de resultados para el exámen seleccionado.",
      );
      return false;
    }
  },

  async CargarResultadosLaboratorio(idProducto, idOrden, tipo) {
    let hmltTabla = "";
    let resp = false;
    let data = new FormData();

    data.append("idOrden", idOrden);
    data.append("idProducto", idProducto);
    data.append("tipo", tipo);

    try {
      oTable_resultadosOrdenes.fnClearTable();
      $("#lblNombreExamen").html("");
      $("#tbodyResultados").html("");
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarResultados?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      if (datos.lsResultados.table.length > 0) {
        let resultados = datos.lsResultados.table;
        let idGrupoRes = 0;
        let idItemRes = 0;
        resultados.forEach(function (valor) {
          if (valor.soloNumero) {
            $(
              "#numValorResultado_" +
                valor.idProductoCpt +
                "_" +
                valor.idGrupoCpt +
                "_" +
                valor.idItemGrupo +
                "_" +
                valor.idItem +
                "_" +
                valor.ordenXresultado,
            ).val(valor.valor);
          }

          if (valor.soloTexto) {
            $(
              "#txtValorResultado_" +
                valor.idProductoCpt +
                "_" +
                valor.idGrupoCpt +
                "_" +
                valor.idItemGrupo +
                "_" +
                valor.idItem +
                "_" +
                valor.ordenXresultado,
            ).val(valor.valor);
          }

          if (valor.soloCombo) {
            $(
              "#cmbValorResultado_" +
                valor.idProductoCpt +
                "_" +
                valor.idGrupoCpt +
                "_" +
                valor.idItemGrupo +
                "_" +
                valor.idItem,
            ).val(valor.ordenXresultado);
          }

          if (valor.soloCheck) {
            $(
              "#chkValorResultado_" +
                valor.idProductoCpt +
                "_" +
                valor.idGrupoCpt +
                "_" +
                valor.idItemGrupo +
                "_" +
                valor.idItem +
                "_" +
                valor.ordenXresultado,
            ).val(valor.valor);
          }

          $(
            "txtValorReferencial_" +
              valor.idProductoCpt +
              "_" +
              valor.idGrupoCpt +
              "_" +
              valor.idItemGrupo +
              "_" +
              valor.idItem +
              "_" +
              valor.ordenXresultado,
          ).html(valor);

          $("#lblNombreExamen").html(valor.producto);
          if (valor.idGrupo != idGrupoRes) {
            idGrupoRes = valor.idGrupo;
            hmltTabla =
              hmltTabla +
              "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" +
              valor.grupo +
              "</b> </td></tr>";
          }

          if (valor.idItem != idItemRes) {
            idItemRes = valor.idItem;
            hmltTabla =
              hmltTabla +
              "<tr><td>" +
              valor.item +
              " </td><td>" +
              valor.valor +
              "</td><td>" +
              valor.valorReferencial +
              "</td></tr>";
          }
          //$('#txtObserOrdRes').val(valor.observaciones + '\n' + valor.conclusiones);
        });
        //$('#tbodyResultados').html(hmltTabla);
        //$('#modalResultadosLabImg').modal('show');
        $(".chzn-select-deselect").chosen().trigger("chosen:updated");
      } else {
        if (isEmpty($("#txtResObservaciones").val())) {
          let FechaHora = await Utilitario.FechaHoraServidor();
          $("#txtFechaResultado").datepicker(
            "setDate",
            FechaHora.substring(0, 10),
          );
          $("#txtHoraResultado").val(FechaHora.substring(11, 16));
          alerta2(
            "info",
            "",
            "No existen resultados para el examen seleccionado.",
          );
        }
      }

      return true;
    } catch (error) {
      alerta2("error", "", error);
      return false;
    }
  },

  async CargarResultadosImagenesLaboratorio(idProducto, idOrden, tipo) {
    var hmltTabla = "";
    var data = new FormData();

    data.append("idOrden", idOrden);
    data.append("idProducto", idProducto);
    data.append("tipo", tipo);

    try {
      oTable_resultadosOrdenes.fnClearTable();
      $("#lblNombreExamen").html("");
      $("#tbodyResultados").html("");
      datos = await $.ajax({
        method: "POST",
        url: "/Utilitario/ListarResultadosLabImg?area=Comun",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      if (datos.lsResultados.table.length > 0) {
        var resultados = datos.lsResultados.table;
        var idGrupoRes = 0;
        var idItemRes = 0;
        resultados.forEach(function (valor) {
          $("#lblNombreExamen").html(valor.producto);
          if (valor.idGrupo != idGrupoRes) {
            idGrupoRes = valor.idGrupo;
            //hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + valor.grupo + "</b> </td><td> </td><td> </td></tr>";
            hmltTabla =
              hmltTabla +
              "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" +
              valor.grupo +
              "</b> </td></tr>";
          }

          if (valor.idItem != idItemRes) {
            idItemRes = valor.idItem;
            //hmltTabla = hmltTabla + "<tr><td></td><td>" + valor.item + " </td><td>" + valor.valor + "</td></tr>";
            hmltTabla =
              hmltTabla +
              "<tr><td>" +
              valor.item +
              " </td><td>" +
              valor.valor +
              "</td><td>" +
              valor.valorReferencial +
              "</td></tr>";
          }
          $("#txtObserOrdRes").val(
            valor.observaciones + "\n" + valor.conclusiones,
          );
        });
        $("#tbodyResultados").html(hmltTabla);
        //$('#tblResultadosExamenes').DataTable().columns.adjust();
        $("#modalResultadosLabImg").modal("show");
      } else {
        alerta2(
          "info",
          "",
          "No existen resultados para el examen seleccionado.",
        );
      }
    } catch (error) {
      alerta2("error", "", error);
    }
  },

  //ListarSaldosPorAlmacenConFechaCorte: () => {
  //    let formData = new FormData()
  //    formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
  //    formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())

  //    //oTable_patologiaClinica.fnClearTable()
  //    //oTable_reporteICIDonaciones.fnClearTable()
  //    HttpClient.Post('/PatologiaClinica/ListarExamenesConResultadoPorFecha?area=Farmacia', formData)
  //        .then(res => {
  //            if (res.estado) {
  //                if (res.data.table.length > 0) {
  //                    //oTable_patologiaClinica.fnAddData(res.data.table)
  //                }
  //                Cargando(0)
  //            } else {
  //                alerta(3, res.mensaje)
  //                Cargando(0)
  //            }
  //            return res
  //            Cargando(0)
  //        })
  //        .catch(e => {
  //            alerta(2, 'Error: ' + e)
  //            Cargando(0)
  //        })
  //},

  DataTableProductosBuscados() {
    var parms = {
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      scrollX: true,
      scrollY: "28vh",
      autoWidth: false,
      columns: [
        {
          width: "0%",
          targets: 0,
          visible: false,
          data: "idProducto",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "0%",
          targets: 0,
          visible: false,
          data: "idPuntoCarga",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "10%",
          targets: 1,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "75%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "15%",
          targets: 1,
          data: "precioUnitario",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblProductosBuscados");
    oTable_ProductosBuscados = $("#tblProductosBuscados").dataTable(parms);
    $("#tblProductosBuscados_length").css("display", "none");

    //let offSetElement = $('#frameBusquedaProductos').offset();
    //$('#frameResultadosBusquedaProdutos').css({
    //    top: offSetElement.top,
    //    left: offSetElement.left
    //});
  },

  InitDatablesDetalleProductos: () => {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      scrollY: "20vh",
      columns: [
        {
          width: "0%",
          targets: 0,
          visible: false,
          data: "idProducto",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "0%",
          targets: 0,
          visible: false,
          data: "idPuntoCarga",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "0%",
          targets: 0,
          visible: false,
          data: "seUsaSinPrecio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "10%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");

            if (rowData.idLabEstado == 0) {
              $(td).parent().css("color", "#f44336");
              $(td).parent().css("font-weight", "bold");
            }
          },
        },
        {
          width: "41%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "8%",
          targets: 2,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
            let inputCantidad =
              '  <input type="text" id="txtCantLabMov_' +
              rowData.idProducto +
              '" data-fila="' +
              rowData.index +
              '" value="' +
              isNull(rowData.cantidad, 1) +
              '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCampoDetalle dCantLabMov">';
            $(td).html(inputCantidad);
          },
        },
        {
          width: "8%",
          targets: 3,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
            let inputPrecio =
              '<div id="htmlPrecioLabMov_' +
              rowData.idProducto +
              '" data-fila="' +
              rowData.index +
              '" class="dPrecioLabMov">' +
              isNull(rowData.precioUnitario, 0.0) +
              "</div>";
            $(td).html(inputPrecio);
          },
        },
        {
          width: "8%",
          targets: 4,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
            let inputTotal =
              '<div id="htmlSubTotalLabMov_' +
              rowData.idProducto +
              '" data-fila="' +
              rowData.index +
              '" class="dSubTotalLabMov">' +
              isNull(rowData.importe, rowData.precioUnitario) +
              "</div>";
            $(td).html(inputTotal);
          },
        },
        {
          width: "25%",
          targets: 5,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
            let inputObservaciones =
              '  <input type="text" id="txtObsLabMov_' +
              rowData.idProducto +
              '" data-fila="' +
              rowData.index +
              '" value="' +
              isNull(rowData.observaciones, "") +
              '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm dCampoDetalle dObsLabMov">';
            $(td).html(inputObservaciones);
          },
        },
      ],
    };

    var tableWrapper = $("#tblLabMovDetalleProductos"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_LabMovDetalleProductos = $("#tblLabMovDetalleProductos").dataTable(
      parms,
    );
  },

  InitDatablesListaOrdenes: () => {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      scrollY: "20vh",
      columns: [
        {
          width: "5%",
          targets: 0,
          data: "idMovimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");

            if (rowData.idLabEstado == 0) {
              $(td).parent().css("color", "#f44336");
              $(td).parent().css("font-weight", "bold");
            }
          },
        },
        {
          width: "5%",
          targets: 1,
          data: "idCuentaAtencion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 2,
          data: "nroHistoriaClinica",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "10%",
          targets: 3,
          data: "paciente",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 4,
          data: "estadoOrden",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 5,
          data: "fechaDespacho",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "10%",
          targets: 6,
          data: "ordenaPrueba",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 7,
          data: "fechaNacimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 8,
          //data: "idTipoSexo",
          data: "sexo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },

        //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
        //{
        //    width: '8%',
        //    targets: 7,
        //    data: null,
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).css('text-align', 'center')
        //        var btnRuta = "";
        //        var btnImprime = "";
        //        var btnImprimeSinF = "";
        //        //var rutaBit4Id = "";

        //        btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
        //        if (rowData.code != '0') {
        //            if (rowData.statusFirma == 1) {
        //                btnImprimeSinF = "";
        //                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
        //            } else {
        //                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
        //            }
        //        }

        //        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

        //    }
        //}
      ],
    };

    var tableWrapper = $("#tblListadoOrdenes"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_ListaOrdenes = $("#tblListadoOrdenes").dataTable(parms);
  },

  InitDatablesListaOrdenesDetalle: () => {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "13%",
          targets: 1,
          data: "grupo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "25%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "17%",
          targets: 1,
          data: "realizaExamen",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 2,
          data: "cantidad",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 3,
          data: "precio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 4,
          data: "total",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 5,
          data: "resultado",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 3,
          data: "tipoMuestra",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "7%",
          targets: 3,
          data: "estadoEstudio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        /*{
                    width: '7%',
                    targets: 3,
                    data: "diagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },*/
        //{
        //    width: '20%',
        //    targets: 6,
        //    data: "obseraciones",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')

        //    }
        //},
        {
          width: "10%",
          targets: 7,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).css("text-align", "center");
            var btnRuta = "";
            var btnImprime = "";
            var btnImprimeSinF = "";
            //var rutaBit4Id = "";
            codigo = rowData.code;
            resultado = rowData.resultado;
            if (rowData.resultado == "SI" && rowData.code != "") {
              btnImprimeSinF =
                '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
              if (rowData.code != "0") {
                if (rowData.statusFirma == 1) {
                  btnImprimeSinF = "";
                  btnImprime =
                    ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                } /*else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';                                   
                                }*/

                if (
                  rowData.statusFirmaEmpleado == 0 &&
                  rowData.statusFirmaOrden == 0
                ) {
                  btnRuta =
                    '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                }
              } else {
                btnImprimeSinF =
                  '<button class="ImprimeInformeResultadoSF btn btn-sm btn-secondary glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
              }
            }

            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
          },
        },
      ],
    };

    var tableWrapper = $("#tblListadoOrdenesDetalle"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_ListaOrdenesDetalle = $("#tblListadoOrdenesDetalle").dataTable(
      parms,
    );
  },

  IniciarDataTableResultados() {
    var parms = {
      scrollY: "400px",
      scrollCollapse: true,
      targets: "no-sort",
      bSort: false,
      //data: null,
      destroy: true,
      info: false,
      bFilter: false,
      paging: false,
      responsive: true,
      //buttons: ['copy', 'csv', 'print']
      //columns: [
    };

    var tableWrapper = $("#tblResultadosExamenes"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_resultadosOrdenes = $("#tblResultadosExamenes").dataTable(parms);
    $("#tblResultadosExamenes_length").css("display", "none");
    $("#tblResultadosExamenes").DataTable().columns.adjust();
  },

  InitDataTableFormatoResultado() {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      scrollY: "25vh",
    };

    var tableWrapper = $("#tblFormatoResultadosLab"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_ResultadosLaboratorio = $("#tblFormatoResultadosLab").dataTable(
      parms,
    );
    $("#tblFormatoResultadosLab_length").css("display", "none");
    $("#tblFormatoResultadosLab").DataTable().columns.adjust();
  },

  InitDatablesListaImagenesAdjuntas: () => {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      scrollY: "25vh",
      columns: [
        {
          width: "30%",
          targets: 1,
          data: "nro",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 0,
          data: null,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
            let btnImagen =
              '<button class="btnResultadoImagenLab btn btn-sm btn-warning glow_button" title="Visualiza Imagen Resultado" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
            $(td).html(btnImagen);
          },
        },
      ],
    };

    var tableWrapper = $("#tblLabResImagenesAdjuntas"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_LabResImagenesAdjuntas = $("#tblLabResImagenesAdjuntas").dataTable(
      parms,
    );
  },

  InitDatablesListaCodigosApDisponibles: () => {
    var parms = {
      paging: false,
      bFilter: false,
      ordering: false,
      info: false,
      scrollX: true,
      scrollY: "25vh",
      columns: [
        {
          width: "25%",
          targets: 1,
          data: "movimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "25%",
          targets: 0,
          data: "año",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "25%",
          targets: 1,
          data: "tipo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "25%",
          targets: 1,
          data: "numeracion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };

    var tableWrapper = $("#tblLabCodigosApDisponibles"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    oTable_ListaCodigosApDisponibles = $(
      "#tblLabCodigosApDisponibles",
    ).dataTable(parms);
  },

  //InitDatablesFormatoResultado: () => {

  //    var parms = {
  //        "paging": false,
  //        "bFilter": false,
  //        "ordering": false,
  //        "info": false,
  //        "scrollX": true,
  //        scrollY: '40vh',
  //        columns: [
  //            {
  //                width: '15%',
  //                targets: 1,
  //                data: "grupo",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')
  //                }
  //            },
  //            {
  //                width: '15%',
  //                targets: 0,
  //                data: "item",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')
  //                }
  //            },
  //            {
  //                width: '10%',
  //                targets: 1,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')
  //                    if (rowData.soloNumero == 1 && controlValor == false) {
  //                        htmlValorNumero = "<td><input type='text' class='form-control form-control-sm' id='txtValorResultado_" + rowData.idProductoCpt + "_" + rowData.idGrupo + "_" + rowData.idItemGrupo + "_" + rowData.idItem + "_" + rowData.ordenXresultado + "' autocomplete='off'></td>";
  //                        controlValor = true;
  //                    } else {
  //                        htmlValorNumero = "<td></td>";
  //                    }
  //                    $(td).html(htmlValorNumero);
  //                }
  //            },
  //            {
  //                width: '15%',
  //                targets: 2,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '15%',
  //                targets: 3,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '10%',
  //                targets: 4,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '20%',
  //                targets: 5,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },

  //        ]

  //    }

  //    var tableWrapper = $('#tblFormatoResultadosLab'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
  //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
  //    oTable_ListaResultadosLab = $("#tblFormatoResultadosLab").dataTable(parms);

  //},

  //InitDatablesPatologiaClinica: () => {

  //    var parms = {
  //        "paging": false,
  //        "bFilter": false,
  //        "ordering": true,
  //        "info": false,
  //        "scrollX": true,
  //        columns: [
  //            {
  //                width: '6%',
  //                targets: 0,
  //                data: "idCuentaAtencion",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')
  //                }
  //            },
  //            {
  //                width: '6%',
  //                targets: 1,
  //                data: "idOrden",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')
  //                }
  //            },
  //            {
  //                width: '10%',
  //                targets: 2,
  //                data: "idMovimiento",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '6%',
  //                targets: 3,
  //                data: "codigo",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '40%',
  //                targets: 4,
  //                data: "nombre",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '12%',
  //                targets: 5,
  //                data: "fechaRecepcion",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },
  //            {
  //                width: '12%',
  //                targets: 6,
  //                data: "fechaResultado",
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).attr('align', 'left')

  //                }
  //            },

  //            //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
  //            {
  //                width: '8%',
  //                targets: 7,
  //                data: null,
  //                createdCell: function (td, cellData, rowData, row, col) {
  //                    $(td).css('text-align', 'center')
  //                    var btnRuta = "";
  //                    var btnImprime = "";
  //                    var btnImprimeSinF = "";
  //                    //var rutaBit4Id = "";

  //                    btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
  //                    if (rowData.code != '0') {
  //                        if (rowData.statusFirma == 1) {
  //                            btnImprimeSinF = "";
  //                            btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
  //                        } else {
  //                            btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
  //                        }
  //                    }

  //                    $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

  //                }
  //            }
  //        ]

  //    }

  //    var tableWrapper = $('#tblResultadosPatologiaClinica'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
  //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
  //    oTable_patologiaClinica = $("#tblResultadosPatologiaClinica").dataTable(parms);

  //},

  Events: () => {
    //$('#btnListarOrdenesPatologia').on('click', () => {
    //    Laboratorio.ListarSaldosPorAlmacenConFechaCorte()
    //})
    /*$('#cboDiagnosticoRs_chosen').on('keyup', '.search-field input', async function (e) {
            let filtro = $(this).val();

            if (e.keyCode === 38 || e.keyCode === 40) {
                return
            }

            if (filtro.length >= 3) {
                await Laboratorio.ListaDiagnosticosPorFiltroV2(filtro);

                // Después de actualizar Chosen, volver a poner el texto en el input
                $('#cboDiagnosticoRs_chosen .search-field input').val(filtro).focus();
            }
        });*/

    $("#cboDiagnosticoRs").select2({
      width: "100%",
      multiple: true,
      minimumInputLength: 3,
      language: {
        inputTooShort: function () {
          return "Por favor ingrese 3 o más caracteres";
        },
        noResults: function () {
          return "No hay resultado";
        },
        searching: function () {
          return "Buscando..";
        },
      },
      ajax: {
        url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
        type: "POST",
        dataType: "json",
        delay: 300,
        data: function (params) {
          return {
            filtro: params.term,
          };
        },
        processResults: function (data) {
          return {
            results: data.table.map((x) => ({
              id: x.idDiagnostico,
              text: x.diagnostico,
              cie10: x.codigoCIE10,
            })),
          };
        },
      },
    });

    $("#cboDiagnosticoCIE0").select2({
      width: "100%",
      multiple: true,
      minimumInputLength: 3,
      language: {
        inputTooShort: function () {
          return "Por favor ingrese 3 o más caracteres";
        },
        noResults: function () {
          return "No hay resultado";
        },
        searching: function () {
          return "Buscando..";
        },
      },
      ajax: {
        url: "/Diagnosticos/ListaDiagnosticosCIE0PorFiltro?area=Comun",
        type: "POST",
        dataType: "json",
        delay: 300,
        data: function (params) {
          return {
            filtro: params.term,
            tipo: 1,
          };
        },
        processResults: function (data) {
          return {
            results: data.table.map((x) => ({
              id: x.idDiagnosticoCIE0,
              text: x.diagnostico,
              cie10: x.codigoCIE0,
            })),
          };
        },
      },
    });

    $("#cboDiagnosticoCIE0Morfologica").select2({
      width: "100%",
      multiple: true,
      minimumInputLength: 3,
      language: {
        inputTooShort: function () {
          return "Por favor ingrese 3 o más caracteres";
        },
        noResults: function () {
          return "No hay resultado";
        },
        searching: function () {
          return "Buscando..";
        },
      },
      ajax: {
        url: "/Diagnosticos/ListaDiagnosticosCIE0PorFiltro?area=Comun",
        type: "POST",
        dataType: "json",
        delay: 300,
        data: function (params) {
          return {
            filtro: params.term,
            tipo: 2,
          };
        },
        processResults: function (data) {
          return {
            results: data.table.map((x) => ({
              id: x.idDiagnosticoCIE0,
              text: x.diagnostico,
              cie10: x.codigoCIE0,
            })),
          };
        },
      },
    });

    $("#modalLabMovimiento").on("shown.bs.modal", function (e) {
      oTable_LabMovDetalleProductos.resize();
    });

    $("#modalLabResultado").on("shown.bs.modal", function (e) {
      oTable_ResultadosLaboratorio.resize();
    });

    $("#modalLabResultadoImagenesAdjuntas").on("shown.bs.modal", function (e) {
      oTable_LabResImagenesAdjuntas.resize();
    });

    $(".search").keypress(function (e) {
      if (e.which == 13) {
        e.preventDefault();
        $(".search").blur();
        $("#btnListarOrdenesLaboratorio").click();
      }
    });

    $("#btnAgregarMovimiento").on("click", async () => {
      Cargando(1);
      Laboratorio.LimpiarCamposMovimiento();
      LabMovimiento.accion = "A";
      $("#frameResultadosBusquedaProdutos").hide();
      Laboratorio.DesbloquearCamposMovimiento();
      $("#modalLabMovimiento").modal("show");
      Cargando(0);
    });

    $("#btnModificarMovimiento").on("click", async () => {
      let objMov = oTable_ListaOrdenes.api(true).row(".selected").data();
      if (isEmpty(objMov)) {
        alerta2("info", "", "Por favor seleccione un registro.");
        return;
      }

      if (objMov.idLabEstado == 0) {
        alerta2(
          "info",
          "",
          "El movimiento ha sido anulado.<br>No es posible modificar este registro.",
        );
        return;
      }

      Cargando(1);
      Laboratorio.LimpiarCamposMovimiento();
      LabMovimiento.accion = "M";
      await Laboratorio.SeleccionarLabMovimiento(objMov.idMovimiento);
      $("#frameResultadosBusquedaProdutos").hide();
      Laboratorio.DesbloquearCamposMovimiento();
      $("#modalLabMovimiento").modal("show");
      Cargando(0);
    });

    $("#btnConsultarMovimiento").on("click", async () => {
      let objMov = oTable_ListaOrdenes.api(true).row(".selected").data();
      if (isEmpty(objMov)) {
        alerta2("info", "", "Por favor seleccione un registro.");
        return;
      }

      Cargando(1);
      Laboratorio.LimpiarCamposMovimiento();
      LabMovimiento.accion = "C";
      await Laboratorio.SeleccionarLabMovimiento(objMov.idMovimiento);
      $("#frameResultadosBusquedaProdutos").hide();
      Laboratorio.BloquearCamposMovimiento();
      $("#modalLabMovimiento").modal("show");
      Cargando(0);
    });

    $("#btnEliminarMovimiento").on("click", async () => {
      //Cargando(1);
      //Laboratorio.LimpiarCamposMovimiento();
      //LabMovimiento.accion = "E";
      let objMov = oTable_ListaOrdenes.api(true).row(".selected").data();
      if (isEmpty(objMov)) {
        alerta2("info", "", "Por favor seleccione un registro.");
        return;
      }

      if (objMov.idLabEstado == 0) {
        alerta2("info", "", "El movimiento ha sido anulado.");
        return;
      }
      //await Laboratorio.SeleccionarLabMovimiento(objMov.idMovimiento);
      //$("#frameResultadosBusquedaProdutos").hide();
      //$("#modalLabMovimiento").modal("show");
      //Cargando(0);

      swal({
        title: "ELIMINAR",
        text:
          "¿Esta seguro de anular la Órden de Laboratorio?" +
          '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' +
          objMov.idMovimiento +
          "</th></tr></table>",
        type: "error",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#ea423e",
        cancelButtonColor: "#6c6c6c",
        confirmButtonText: "ELIMINAR",
        cancelButtonText: "CANCELAR",
      }).then(
        async function () {
          await Laboratorio.EliminarLabMovimiento(objMov.idMovimiento);
        },
        function (dimiss) {},
      );
    });

    $("#btnCancelarMovimiento").on("click", async () => {
      swal({
        title: "CERRAR",
        text: "¿Esta seguro de cerrar el módulo de registro de ordenes?",
        type: "question",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#4fb7fe",
        cancelButtonColor: "#6c6c6c",
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then(
        function () {
          Cargando(1);
          Laboratorio.LimpiarCamposMovimiento();
          //$('#btnListarOrdenesLaboratorio').click();
          $("#modalLabMovimiento").modal("hide");
          Cargando(0);
        },
        function (dimiss) {},
      );
    });

    $("#tblLabCodigosApDisponibles tbody").on("click", "tr", function () {
      $(this).removeClass("selected");
      oTable_ListaCodigosApDisponibles.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $("#btnReemplazarAP").on("click", async () => {
      await Laboratorio.CargarCodigosApDisponibles();
    });

    $("#btnCargarCodigoAp").on("click", async () => {
      let objCodigoAp = oTable_ListaCodigosApDisponibles
        .api(true)
        .row(".selected")
        .data();

      if (isEmpty(objCodigoAp)) {
        alerta2("info", "", "Por favor seleccione un Código AP disponible.");
        return false;
      }

      LabMovimiento.idMovApReemplazo = objCodigoAp.movimiento;
      $("#txtMovAnioAP").val(objCodigoAp.año);
      $("#txtMovTipoAP").val(objCodigoAp.tipo);
      $("#txtMovNumeracionAP").val(objCodigoAp.numeracion);
      $("#modalCodigosApDisponibles").modal("hide");
    });

    $("#btnCancelarCodigoAp").on("click", async () => {
      $("#modalCodigosApDisponibles").modal("hide");
    });

    $("#chkMovIAFAnoCubre").change(function () {
      if ($("#chkMovIAFAnoCubre").is(":checked")) {
        $("#cboMovPlan").val(1);
      } else {
        $("#cboMovPlan").val(LabMovimiento.idTipoFinanciamiento);
      }
      $(".chzn-select").chosen().trigger("chosen:updated");
    });

    $("#btnListarOrdenesLaboratorio").on("click", async () => {
      Cargando(1);

      oTable_ListaOrdenes.fnClearTable();
      oTable_ListaOrdenesDetalle.fnClearTable();
      let ordenServicioPorFechas =
        await Laboratorio.FactOrdenServicioPorFechasLabPaciente();
      //console.log(ordenServicioPorFechas);
      if (ordenServicioPorFechas.length == 0) {
        Cargando(0);
        alerta(2, "No se encontro resultados para la busqueda indicada.");
        return false;
      }

      oTable_ListaOrdenes.fnAddData(ordenServicioPorFechas);
      oTable_ListaOrdenes.resize();
      Cargando(0);
    });

    $("#btnListarOrdenesLaboratorioTamizaje").on("click", async () => {
      Cargando(1);

      oTable_ListaOrdenes.fnClearTable();
      oTable_ListaOrdenesDetalle.fnClearTable();
      let ordenServicioPorFechas =
        await Laboratorio.ListarMovimientosLaboratorioTamizaje();
      //console.log(ordenServicioPorFechas);
      if (ordenServicioPorFechas.length == 0) {
        Cargando(0);
        alerta(2, "No se encontro resultados para la busqueda indicada.");
        return false;
      }

      oTable_ListaOrdenes.fnAddData(ordenServicioPorFechas);
      oTable_ListaOrdenes.resize();
      Cargando(0);
    });

    //$('#btnGenerarTodosOrdenesPatologia').on('click', () => {
    //    let objrows = oTable_patologiaClinica.api(true).data()

    //    Cargando(1)
    //    $(objrows).each(async (i, row) => {
    //        const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
    //        if (typeof firma === 'undefined') {
    //            //alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

    //            let tipoFormato = 'LAB-PC';
    //            const pdf = await Utilitario.GenerarFormatoResultadosPorItem(row.idCuentaAtencion, row.idOrden, row.idMovimiento, row.idProducto, tipoFormato);

    //            //if (pdf) {
    //            //    alerta('1', 'Se generó el documento correctamente.')
    //            //}
    //        }
    //    })
    //    Cargando(0)
    //    $("#btnListarOrdenesPatologia").click();

    //    //PatologiaClinica.ListarSaldosPorAlmacenConFechaCorte()
    //})

    //$('#btnImprimirTodosResultados').on('click', async () => {
    //    let objRowOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
    //    Cargando(1)
    //    if (isEmpty(objRowOrden)) {
    //        alerta(2, 'Selecciona un elemento de la lista de Ordenes')
    //        Cargando(0)
    //        return false
    //    }

    //    const ordenServicio = await Laboratorio.FactOrdenServicioPorIdMovimiento(objRowOrden.idMovimiento, objRowOrden.idPuntoCarga)

    //    if (ordenServicio.length > 0) {

    //        let firma = await Utilitario.SeleccionarFirmaDigitalV2(ordenServicio[0].code)
    //        if (typeof firma === 'undefined') {
    //            alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

    //            let tipoFormato = 'LAB-PCT';
    //            const pdf = await Utilitario.GenerarFormatoResultados(objRowOrden.idOrden, objRowOrden.idPuntoCarga, objRowOrden.idMovimiento, tipoFormato);

    //            if (pdf) {
    //                alerta('1', 'Se generó el documento correctamente.')
    //            }
    //        } else {
    //            //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
    //            AbrirVisorDocumento(firma.rutaArchivo, 0);
    //        }

    //        Cargando(0)
    //    }

    //    //KHOYOSI

    //})

    $("#btnImprimirTodosResultados").on("click", async function () {
      let objOrden = oTable_ListaOrdenes.api(true).row(".selected").data();
      //var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();

      if (isEmpty(objOrden)) {
        alerta2("info", "", "Por favor seleccione un registro.");
        return false;
      }

      Cargando(1);
      let tipoFormato = "LAB-RES-GRUPO";
      const firma = await Utilitario.SeleccionarFirmaDigitalPorGrupo(
        objOrden.idMovimiento,
        tipoFormato,
      );
      if (typeof firma === "undefined") {
        alerta2(
          "info",
          "",
          "El documento no ha podido ser generado por falta de información. Por favor guarde algun resultado del movimiento seleccionado.",
        );
        //const pdf = await Utilitario.GenerarFormatoResultadosPorGrupo(objOrden.idCuentaAtencion, objOrden.idOrden, objOrden.idMovimiento, tipoFormato);
        //if (pdf) {
        //    Laboratorio.ListarDetalleOrden();
        //    alerta('1', 'Se generó el documento correctamente.');
        //} else {
        //    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.');
        //}
      } else {
        await Utilitario.GenerarGrupoDocumentoPdf(
          objOrden.idMovimiento,
          tipoFormato,
        );
        //var url = "/Utilitario/GenerarGrupoDocumentosPdf?area=Comun&idRegistro=" + objOrden.idMovimiento + "&tipo=" + tipoFormato
        //AbrirVisorDocumento(url, 0);
      }
      Cargando(0);

      //var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
      //const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code);               //KHOYOSI
      //if (typeof firma === 'undefined') {
      //    alerta('2', 'El documento no esta generado, se procedera a generar el documento.');

      //    let tipoFormato = 'LAB-RES';
      //    //console.log('row', row) /// verificar aqui los parametros y los datos que se enviaran
      //    const pdf = await Utilitario.GenerarFormatoResultadosPorItem(objOrden.idCuentaAtencion, row.idOrden, objOrden.idMovimiento, row.idProducto, tipoFormato);

      //    if (pdf) {
      //        Laboratorio.ListarDetalleOrden();
      //        alerta('1', 'Se generó el documento correctamente.');
      //    } else {
      //        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.');
      //    }
      //} else {
      //    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
      //    AbrirVisorDocumento(firma.rutaArchivo, 0);
      //}
    });

    $("#tblListadoOrdenes tbody").on("click", "tr", async function () {
      oTable_ListaOrdenes.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
      await Laboratorio.ListarDetalleOrden();
    });

    $("#tblListadoOrdenesDetalle tbody").on("click", "tr", async function () {
      oTable_ListaOrdenesDetalle.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $("#tblListadoOrdenesDetalle tbody").on(
      "click",
      ".ImprimeInformeResultadoSF",
      async function () {
        let objOrden = oTable_ListaOrdenes.api(true).row(".selected").data();
        let objrow = oTable_ListaOrdenesDetalle
          .api(true)
          .row($(this).parents("tr")[0])
          .index();

        Cargando(1);
        let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
        const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code); //KHOYOSI
        if (typeof firma === "undefined") {
          alerta(
            "2",
            "El documento no esta generado, se procedera a generar el documento.",
          );

          let tipoFormato = "LAB-RES";
          let tipoFormatoGrupo = "LAB-RES-GRUPO";
          //console.log('row', row) /// verificar aqui los parametros y los datos que se enviaran
          const pdf = await Utilitario.GenerarFormatoResultadosPorItem(
            objOrden.idCuentaAtencion,
            row.idOrden,
            objOrden.idMovimiento,
            row.idProducto,
            tipoFormato,
          );
          const pdfGrupo = await Utilitario.GenerarFormatoResultadosPorGrupo(
            objOrden.idCuentaAtencion,
            objOrden.idOrden,
            objOrden.idMovimiento,
            row.idProducto,
            tipoFormatoGrupo,
          );

          if (pdf == true && pdfGrupo == true) {
            Laboratorio.ListarDetalleOrden();
            alerta("1", "Se generó el documento correctamente.");
          } else {
            alerta(
              "2",
              "El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.",
            );
          }
        } else {
          //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
          AbrirVisorDocumento(firma.rutaArchivo, 0);
        }
        Cargando(0);
      },
    );

    $("#btnModificarResultadoLab").on("click", async function () {
      let objrowTb = oTable_ListaOrdenesDetalle
        .api(true)
        .row(".selected")
        .data();
      if (!isEmpty(objrowTb)) {
        //await Laboratorio.CargarDatosResultadosLaboratorio(objrowTb.idProducto, objrowTb.idOrden, objrowTb.idGrupo);
        await Laboratorio.CargarDatosResultadosLaboratorio(objrowTb);
      } else {
        alerta2("warning", "", "No se ha seleccionado ninguna examen.");
      }
      //$('#modalLabResultado').modal('show');
    });

    $("#btnCancelarResultado").on("click", async function () {
      $("#modalLabResultado").modal("hide");
    });

    $("#btnConsultarResultadoLab").on("click", async function () {
      let objrowTb = oTable_ListaOrdenesDetalle
        .api(true)
        .row(".selected")
        .data();
      if (!isEmpty(objrowTb)) {
        await Laboratorio.CargarResultadosImagenesLaboratorio(
          objrowTb.idProducto,
          objrowTb.idOrden,
          "LAB",
        );
      } else {
        alerta2("info", "", "No se ha seleccionado ninguna examen.");
      }
    });

    $("#btnEliminarResultadoLab").on("click", async function () {
      let objrowTb = oTable_ListaOrdenesDetalle
        .api(true)
        .row(".selected")
        .data();
      if (isEmpty(objrowTb)) {
        alerta2("info", "", "No se ha seleccionado ningun examen.");
        return;
      }

      if (objrowTb.resultado == "NO") {
        alerta2(
          "info",
          "",
          "No existen resultados para el examen seleccionado.",
        );
        return;
      }

      swal({
        title: "ELIMINAR",
        text:
          "¿Esta seguro de eliminar los resultados del examen <span class='font-weight-bold'>(" +
          objrowTb.codigo +
          ") " +
          objrowTb.nombre +
          "</span> ?",
        type: "error",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#ea423e",
        cancelButtonColor: "#6c6c6c",
        confirmButtonText: "ELIMINAR",
        cancelButtonText: "CANCELAR",
      }).then(
        async function () {
          await Laboratorio.EliminarResultado(
            objrowTb.idMovimiento,
            objrowTb.idProducto,
          );
        },
        function (dimiss) {},
      );
    });

    $("#btnCerrarResultadoLabImg").on("click", function () {
      oTable_resultadosOrdenes.fnClearTable();
      $("#modalResultadosLabImg").modal("hide");
    });

    /*==============================FIRMA DIGITAL===========================================*/
    $("#tblListadoOrdenesDetalle tbody").on(
      "click",
      ".FirmarInformeResultadoSF",
      async function () {
        let objrow = oTable_ListaOrdenesDetalle
          .api(true)
          .row($(this).parents("tr")[0])
          .index();
        let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);

        Cargando(1);
        //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI
        //if (firma) {

        //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
        //}
        Utilitario.TipoArchivoFirmar = "LAB-RES";
        if (permisoFirmaDigital == 1) {
          await Utilitario.IniciarServicioFirmaBit4Id(row.code);
        }
        if (permisoFirmaDigital == 2) {
          await Utilitario.IniciarServicioFirmaPeru(row.code);
        }
        //            await Utilitario.IniciarServicioFirmaBit4Id(row.code);

        Cargando(0);
      },
    );

    $("#tblListadoOrdenesDetalle tbody").on(
      "click",
      ".ImprimeInformeResultadoCF",
      async function () {
        let objrow = oTable_ListaOrdenesDetalle
          .api(true)
          .row($(this).parents("tr")[0])
          .index();
        let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
        await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
      },
    );

    $("#btnFirmaMovimiento").on("click", async function () {
      let objrow = oTable_ListaOrdenes.api(true).row(".selected").data();

      if (isEmpty(objrow)) {
        alerta2("info", "", "Por favor seleccione un registro.");
        return false;
      }

      if (objrow.idLabEstado == 0) {
        swal({
          title: "Movimiento",
          text: "El movimiento se encuentra anulado.",
          type: "warning",
          allowOutsideClick: false,
        }).done();
        //alerta(2, "La cuenta del paciente se encuentra anulado.");
        return false;
      }

      Cargando(1);
      Utilitario.TipoArchivoFirmar = "LAB-RES";
      if (permisoFirmaDigital == 1) {
        const paquete = await Utilitario.CrearPaqueteArchivos(
          "",
          objrow.idMovimiento,
          "'LAB-RES','LAB-RES-GRUPO'",
        );
        if (!isEmpty(paquete)) {
          await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
        }
      } else if (permisoFirmaDigital == 2) {
        const paquete = await Utilitario.CrearPaqueteArchivos7zip(
          "",
          objrow.idMovimiento,
          "'LAB-RES','LAB-RES-GRUPO'",
        );
        if (!isEmpty(paquete)) {
          await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
        }
      }

      Cargando(0);
    });

    $("#btnFirmaLote").on("click", async function () {
      let listMovimientos = oTable_ListaOrdenes.api(true).data();
      let numMovimientos = [];

      Cargando(1);
      $(listMovimientos).each(async (i, obj) => {
        if (obj.idLabEstado != 0) {
          numMovimientos.push(obj.idMovimiento);
        }
      });

      Utilitario.TipoArchivoFirmar = "LAB-RES";
      if (permisoFirmaDigital == 1) {
        const paquete = await Utilitario.CrearPaqueteArchivos(
          "",
          numMovimientos,
          "'LAB-RES','LAB-RES-GRUPO'",
        );
        if (!isEmpty(paquete)) {
          await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
        }
      } else if (permisoFirmaDigital == 2) {
        const paquete = await Utilitario.CrearPaqueteArchivos7zip(
          "",
          numMovimientos,
          "'LAB-RES','LAB-RES-GRUPO'",
        );
        if (!isEmpty(paquete)) {
          await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
        }
      }

      Cargando(0);
    });

    $("#btnLimpiarBusqueda").on("click", () => {
      Laboratorio.Limpiar();
      Laboratorio.CargaInicial();
    });

    /*=================================REGISTRO RESULTADOS IMAGENES================================ */
    $("#btnImagenesAdjuntasLab").on("click", async () => {
      await Laboratorio.ListarImagenesAdjuntas(
        Laboratorio.idOrden,
        Laboratorio.idMovimiento,
        Laboratorio.idProducto,
      );
      $("#modalLabResultadoImagenesAdjuntas").modal("show");
    });

    $("#tblLabResImagenesAdjuntas tbody").on("click", "tr", async function () {
      oTable_LabResImagenesAdjuntas.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $("#tblLabResImagenesAdjuntas tbody").on(
      "click",
      ".btnResultadoImagenLab",
      async function () {
        // KHOYOSI
        let objrow = oTable_LabResImagenesAdjuntas
          .api(true)
          .row($(this).parents("tr")[0])
          .index();
        let row = oTable_LabResImagenesAdjuntas.fnGetData(objrow);
        let rutaArchivoImagen = PathServerFiles + "/" + row.rutaImagen;

        AbrirVisorImagen(rutaArchivoImagen, "Imagen Resultado");
      },
    );

    $("#btnCancelarResultadoImagenesAdjuntas").on("click", () => {
      oTable_LabResImagenesAdjuntas.fnClearTable();
      $("#modalLabResultadoImagenesAdjuntas").modal("hide");
    });

    $("#btnSubirImagenLab").on("click", () => {
      $("#imagenLab").click();
    });

    $("#imagenLab").change(function () {
      // Verificar si se seleccionó al menos un archivo
      if (this.files.length > 0) {
        // Mostrar el nombre del archivo seleccionado
        //alerta2("question", "", "Archivo seleccionado:" + this.files[0].name);
        //console.log("Archivo seleccionado:", this.files[0].name);
        swal({
          title: "Imagen Adjunta",
          text:
            'Se ha seleccionado la imagen <strong style="font-weight: 900;text-decoration: underline;">' +
            this.files[0].name +
            "</strong>. <br> ¿Esta seguro de subir esta imagen?",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#4fb7fe",
          cancelButtonColor: "#6c6c6c",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          allowOutsideClick: false,
        }).then(
          async function () {
            let fileImage = document.getElementById("imagenLab").files[0];
            let resp = await Laboratorio.GuardarImagenAdjunta(
              Laboratorio.idCuentaAtencion,
              Laboratorio.idOrden,
              Laboratorio.idMovimiento,
              Laboratorio.idProducto,
              "LAB-RES",
              fileImage,
            );
            if (resp) {
              await Laboratorio.ListarImagenesAdjuntas(
                Laboratorio.idOrden,
                Laboratorio.idMovimiento,
                Laboratorio.idProducto,
              );
            }
          },
          function (dimiss) {},
        );
      } else {
        alerta2("info", "", "No se seleccionó ninguna imagen.");
      }
      //let archivo = $(this).val(); // Obtener el valor del input file (la ruta del archivo)

      //if (archivo) {
      //    $('#txtNombreArchivo').val("ARCHIVO CARGADO");
      //} else {
      //    $('#txtNombreArchivo').val('SIN ARCHIVO');
      //}
    });

    $("#btnEliminarImagenLab").on("click", async function () {
      let objrow = oTable_LabResImagenesAdjuntas
        .api(true)
        .row(".selected")
        .data();

      if (isEmpty(objrow)) {
        alerta2("info", "", "Por favor seleccione una imagen.");
        return false;
      }

      swal({
        title: "Imagen Adjunta",
        text: "¿Esta seguro de eliminar esta imagen?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#4fb7fe",
        cancelButtonColor: "#6c6c6c",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
      }).then(
        async function () {
          let resp = await Laboratorio.EliminarImagenAdjunta(
            objrow.idLabResultadoImagen,
          );
          if (resp) {
            await Laboratorio.ListarImagenesAdjuntas(
              Laboratorio.idOrden,
              Laboratorio.idMovimiento,
              Laboratorio.idProducto,
            );
          }
        },
        function (dimiss) {},
      );
    });

    /*==============================================================================================*/

    /*=========================REGISTRO DE RESULTADOS===========================================*/
    $(document).on("keyup", ".campoResultado", function (e) {
      if (e.which == 13) {
        e.preventDefault();
        let focused = $(":focus");
        // Encontrar el siguiente elemento que puede recibir foco
        let next = $("input, textarea").eq(
          $("input, textarea").index(focused) + 1,
        );
        // Pasar el foco al siguiente elemento
        next.focus();
      }
    });

    $("#btnGuardarResultado").on("click", async () => {
      Cargando(1);
      valida = Laboratorio.ValidarDatosObligatoriosResultados();
      if (valida) {
        const res = await Laboratorio.GuardarResultado();
        if (res) {
          await Laboratorio.ListarDetalleOrden();
          $("#modalLabResultado").modal("hide");
        }
      }
      Cargando(0);
    });

    /*===============================================================================================*/

    /*===============================BUSQUEDA DE PRODUCTOS==============================================*/
    $("#tblProductosBuscados tbody").on("click", "tr", function () {
      $(this).removeClass("selected");
      oTable_ProductosBuscados.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $("#tblProductosBuscados tbody").on("dblclick", "tr", function () {
      $(this).removeClass("selected");
      oTable_ProductosBuscados.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");

      let objrowTb = oTable_ProductosBuscados.api(true).row(".selected").data();
      Laboratorio.AgregarProducto(objrowTb);

      //console.log(objrowTb);
    });

    $("#btnAgregaProducto").on("click", async function () {
      let objrowTb = oTable_ProductosBuscados.api(true).row(".selected").data();

      if (isEmpty(objrowTb) == false) {
        Laboratorio.AgregarProducto(objrowTb);
      } else {
        alerta2("info", "", "Por favor seleccione un producto para agregar.");
      }
    });

    $("#btnQuitarProducto").on("click", async function () {
      let objrowTb = oTable_LabMovDetalleProductos
        .api(true)
        .row(".selected")
        .data();

      if (isEmpty(objrowTb) == false) {
        Laboratorio.QuitarProducto(objrowTb);
      } else {
        alerta2("info", "", "Por favor seleccione un producto para eliminar.");
      }
    });
    $("#txtCodigoProductoBusqueda").on("keyup", async function (event) {
      if (
        event.keyCode != 121 &&
        event.keyCode != 37 &&
        event.keyCode != 38 &&
        event.keyCode != 39 &&
        event.keyCode != 40 &&
        event.keyCode != 13
      ) {
        event.preventDefault();
        if (
          LabMovimiento.idTipoFinanciamiento > 0 &&
          (LabMovimiento.idPaciente > 0 || LabMovimiento.idComprobantePago > 0)
        ) {
          $("#txtNombreProductoBusqueda").val("");
          let busqueda = $("#txtCodigoProductoBusqueda").val().trim();
          await Laboratorio.ListarProductosBuscados(
            "C",
            busqueda,
            $("#cboMovPlan").val(),
            Laboratorio.idPuntoCarga,
            1,
          );
        } else {
          alerta2("info", "", "Por favor, primero seleccione un paciente.");
        }
      }
    });

    $("#txtNombreProductoBusqueda").on("keyup", async function (event) {
      if (
        event.keyCode != 121 &&
        event.keyCode != 37 &&
        event.keyCode != 38 &&
        event.keyCode != 39 &&
        event.keyCode != 40 &&
        event.keyCode != 13
      ) {
        event.preventDefault();
        if (
          LabMovimiento.idTipoFinanciamiento > 0 &&
          (LabMovimiento.idPaciente > 0 || LabMovimiento.idComprobantePago > 0)
        ) {
          $("#txtCodigoProductoBusqueda").val("");
          let busqueda = $("#txtNombreProductoBusqueda").val().trim();
          await Laboratorio.ListarProductosBuscados(
            "N",
            busqueda,
            $("#cboMovPlan").val(),
            Laboratorio.idPuntoCarga,
            1,
          );
        } else {
          alerta2("info", "", "Por favor, primero seleccione un paciente.");
        }
      }
    });

    $(document).on("keydown", function (e) {
      if (e.keyCode === 121) {
        // 121 es el keyCode de F10
        e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
      }
    });

    $(document).on("keyup", function (e) {
      let indice = 0;
      let selectedRow = null;

      if (e.keyCode === 121) {
        e.preventDefault();
        $("#txtNombreProductoBusqueda").focus();
      }

      //if (e.keyCode === 38) {
      //    e.preventDefault();
      //    selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
      //    indice = selectedRow.index()
      //    if (isEmpty(indice) == false) {
      //        indice = indice - 1 ;
      //    } else {
      //        indice = 0;
      //    }

      //    if (indice >= 0) {
      //        oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
      //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
      //    }
      //}

      //if (e.keyCode === 40) {
      //    e.preventDefault();
      //    selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
      //    indice = selectedRow.index()
      //    if (isEmpty(indice) == false) {
      //        indice = indice + 1;
      //    } else {
      //        indice = 0;
      //    }

      //    if (indice >= 0) {
      //        oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
      //        $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
      //    }
      //}

      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
        let selectedRow = oTable_ProductosBuscados.api(true).row(".selected");
        let indice = selectedRow.index();

        if (!isEmpty(indice)) {
          indice = e.keyCode === 38 ? indice - 1 : indice + 1;
        } else {
          indice = 0;
        }

        if (indice >= 0) {
          oTable_ProductosBuscados.$("tr.selected").removeClass("selected");
          let newRow = $("#tblProductosBuscados tbody tr:eq(" + indice + ")");
          newRow.addClass("selected");

          // Desplazar el scroll para que la fila sea visible
          newRow[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }

      if (e.which == 13) {
        if ($("#frameResultadosBusquedaProdutos").is(":visible")) {
          e.preventDefault();
          //let objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();

          //if (isEmpty(objrowTb) == false) {
          //    Laboratorio.AgregarProducto(objrowTb);
          //} else {
          //    alerta2("info", "", "Por favor seleccione un producto para agregar.");
          //}
          $("#btnAgregaProducto").click();
        }
      }
    });
    /*===============================================================================================*/

    /*===============================REGISTRO DE MOVIMIENTOS==============================================*/

    /*------------BUSQUEDA DE CUENTAS----------------------------------*/
    $("#txtMovNroCuenta").keypress(async function (e) {
      // Comprobar si la tecla presionada es 'Enter' (código 13)
      if (e.which == 13) {
        e.preventDefault();
        $("#txtMovNroCuenta").blur();
        let nroCuenta = $("#txtMovNroCuenta").val();
        Laboratorio.LimpiarCamposMovimiento();
        await Laboratorio.BuscarNumeroCuenta(nroCuenta);
      }
    });

    $("#btnAceptarCAPaciente").on("click", async function () {
      let cuenta = oTable_CuentasAtencionesPacientes
        .api(true)
        .row(".selected")
        .data();
      if (isEmpty(cuenta)) {
        alerta2("info", "", "Seleccione un registro por favor.");
      } else {
        if (cuenta.idEstado != 1) {
          alerta2(
            "info",
            "",
            "La cuenta seleccionada NO se encuentra ABIERTA.",
          );
          return;
        }
        $(".searchCAPaciente").val("");
        oTable_BusquedaCAPacientes.fnClearTable();
        oTable_CuentasAtencionesPacientes.fnClearTable();
        $("#modalBusquedaCuentasAtenciones").modal("hide");
        Laboratorio.LimpiarCamposMovimiento();
        await Laboratorio.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
      }
    });

    /*------------BUSQUEDA DE RECETAS----------------------------------*/
    $("#txtMovNroReceta").keypress(async function (e) {
      // Comprobar si la tecla presionada es 'Enter' (código 13)
      if (e.which == 13) {
        e.preventDefault();
        $("#txtMovNroReceta").blur();
        let nroReceta = $("#txtMovNroReceta").val();
        if (isEmpty(nroReceta) == false) {
          Laboratorio.LimpiarCamposMovimiento();
          await Laboratorio.BuscarNumeroReceta(nroReceta);
        }
      }
    });

    $("#btnAceptarRecetaPaciente").on("click", async function () {
      let receta = oTable_BusquedaRecetasPacientes
        .api(true)
        .row(".selected")
        .data();
      if (isEmpty(receta)) {
        alerta2("info", "", "Seleccione un registro por favor.");
      } else {
        if (receta.idEstadoAtencion != 1) {
          alerta2(
            "info",
            "",
            "La cuenta seleccionada NO se encuentra ABIERTA.",
          );
          return;
        }
        $(".searchRecetaPaciente").val("");
        BusqRecetasPacientes.CargarFechaHoy();
        oTable_BusquedaRecetasPacientes.fnClearTable();
        $("#modalBusquedaRecetas").modal("hide");
        Laboratorio.LimpiarCamposMovimiento();
        await Laboratorio.BuscarNumeroReceta(receta.idReceta);
      }
    });
    /*-----------------------------------------------------------------*/

    /*------------BUSQUEDA COMPROBANTE PAGO----------------------------------*/
    $("#txtMovNroCorrelativoBoleta , #txtMovNroDocumentoBoleta").keypress(
      async function (e) {
        // Comprobar si la tecla presionada es 'Enter' (código 13)
        if (e.which == 13) {
          e.preventDefault();
          let nroSerie = $("#txtMovNroCorrelativoBoleta").val();
          let nroDocumento = $("#txtMovNroDocumentoBoleta").val();
          if (isEmpty(nroSerie) == false && isEmpty(nroDocumento) == false) {
            Laboratorio.LimpiarCamposMovimiento();
            await Laboratorio.BuscarComprobantePago(
              nroSerie,
              nroDocumento,
              Laboratorio.idPuntoCarga,
            );
          }
        }
      },
    );
    /*-----------------------------------------------------------------*/

    /*-----------------------------DATOS PACIENTE------------------------------------------------*/
    $("#txtMovFechaNacimiento").change(function () {
      if (isEmpty($("#txtMovFechaNacimiento").val()) == false) {
        let edad = CalcularEdadAnioMesDia($("#txtMovFechaNacimiento").val());
        $("#txtMovEdad").val(
          edad.años + "A " + edad.meses + "M " + edad.dias + "D ",
        );
      }
    });
    /*-----------------------------------------------------------------------------*/

    $("#btnGuardarMovimiento").on("click", async function () {
      await Laboratorio.GuardarMovimiento();
    });

    /*-----------------------------DETALLE DE PRODUCTOS---------------------------------------------------------*/
    $("#tblLabMovDetalleProductos tbody").on("click", "tr", function () {
      $(this).removeClass("selected");
      oTable_LabMovDetalleProductos.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $(document).on("keyup", ".dCantLabMov", function () {
      let idElement = $(this).prop("id");
      let idProducto = idElement.split("_");
      let cantidad = parseInt($("#" + idElement).val());
      let precio = parseFloat($("#htmlPrecioLabMov_" + idProducto[1]).html());
      let total = parseFloat((cantidad * precio).toFixed(3));
      $("#htmlSubTotalLabMov_" + idProducto[1]).html(total);
      Laboratorio.Totalizar();
    });
    /*-----------------------------------------------------------------------------------------------------*/

    /*====================================================================================================*/
  },

  /*---------------------------------------------BUSQEUDA DE PRODUCTOS------------------------------------------------------*/
  async ListarProductosBuscados(
    tipoBusqueda,
    busqueda,
    idTipoFinanciamiento,
    idPuntoCarga,
    tipoServicioOfrecido,
  ) {
    resp = null;
    let filtroBusqueda = "";
    let midata = new FormData();

    try {
      oTable_ProductosBuscados.fnClearTable();
      if (busqueda.length >= 2 && idTipoFinanciamiento > 0) {
        if (idPuntoCarga != 1 && idPuntoCarga != 99) {
          filtroBusqueda =
            filtroBusqueda +
            " and FactCatalogoServiciosPtos.idPuntoCarga = " +
            idPuntoCarga;
        }

        if (idTipoFinanciamiento != 0) {
          filtroBusqueda =
            filtroBusqueda +
            " and FactCatalogoServiciosHosp.idTipoFinanciamiento = " +
            idTipoFinanciamiento;
        }

        if (tipoServicioOfrecido != 0) {
          filtroBusqueda =
            filtroBusqueda +
            " and FactCatalogoServicios.EsCPT = " +
            tipoServicioOfrecido;
        }

        if (busqueda != "") {
          if (tipoBusqueda == "C") {
            //C: busqeuda por codigo
            filtroBusqueda =
              filtroBusqueda +
              " and FactCatalogoServicios.Codigo like '" +
              busqueda +
              "%' ";
          } else if (tipoBusqueda == "N") {
            //N: busqeuda por nombre
            filtroBusqueda =
              filtroBusqueda +
              " and FactCatalogoServicios.Nombre like '%" +
              busqueda +
              "%' ";
          }
        }

        //midata.append('lnIdAlmacen', $('#cboFarmaciaDestinoNI').val());
        midata.append("lcFiltro", filtroBusqueda);

        Cargando(1);
        $("#frameResultadosBusquedaProdutos").show();
        datos = await $.ajax({
          method: "POST",
          url: "/LaboratorioResultados/FactCatalogoServiciosSeleccionarServiciosLike?area=Laboratorio",
          data: midata,
          dataType: "json",
          cache: false,
          processData: false,
          contentType: false,
        });
        Cargando(0);
        if (datos.lstData.table.length > 0) {
          oTable_ProductosBuscados.fnAddData(datos.lstData.table);
          oTable_ProductosBuscados.resize();

          //resp = datos.lstData.table[0];

          if (
            !isElementFullVisible(
              document.getElementById("frameResultadosBusquedaProdutos"),
            )
          ) {
            //console.log("El div NOOOOO es completamente visible y necesita scroll.");
            smoothScrollToContent($("#frameResultadosBusquedaProdutos"));
          }
        }
      } else {
        $("#frameResultadosBusquedaProdutos").hide();
      }
    } catch (error) {
      Cargando(0);
      alerta2("error", "", error.toString());
    }
    //return resp;
  },

  QuitarProducto() {
    oTable_LabMovDetalleProductos
      .api(true)
      .row(".selected")
      .remove()
      .draw(false);
    oTable_LabMovDetalleProductos.resize();

    Laboratorio.Totalizar();
  },

  AgregarProducto(examen) {
    oTable_ProductosBuscados.fnClearTable();
    $("#txtCodigoProductoBusqueda").val("");
    $("#txtNombreProductoBusqueda").val("");
    $("#frameResultadosBusquedaProdutos").hide();

    if (Laboratorio.ItemYaExiste(examen.idProducto) == false) {
      examen.nombre = examen.nombre
        .replace(/</g, "(")
        .replace(/>/g, ")")
        .replace(/(\r\n|\n|\r)/g, "");
      //producto.precioUnitario = await NotaIngreso.DevuelvePrecioSegunTipoConcepto(producto.idProducto, NotaIngreso.tipoPrecioParaNiNs);

      //NotaIngreso.indexDetalle = NotaIngreso.indexDetalle + 1;
      //producto.index = NotaIngreso.indexDetalle;

      oTable_LabMovDetalleProductos.fnAddData(examen);
      oTable_LabMovDetalleProductos.resize();

      Laboratorio.Totalizar();
    }
  },

  ItemYaExiste(idProducto) {
    resp = false;
    let lstDetalleLabMov = Laboratorio.DevolverDetalleMovimiento();
    lstDetalleLabMov.forEach(function (detalle) {
      if (detalle.idProductoCPT == idProducto) {
        resp = true;
        alerta2("info", "", "Este examen ya se encuentra registrado");
      }
    });

    return resp;
  },

  Totalizar() {
    let lstDetalleLabMov = Laboratorio.DevolverDetalleMovimiento();
    let total = 0.0;
    lstDetalleLabMov.forEach(function (detalle) {
      total = parseFloat(total) + parseFloat(detalle.importe);
    });

    $("#TotalDetalleLabMov").html("S/. " + parseFloat(total).toFixed(3));
  },

  DevolverDetalleMovimiento() {
    let detalleLabMov = [];
    let objItemDetalle = null;
    let lstDetalleLabMov = oTable_LabMovDetalleProductos
      .api(true)
      .data()
      .toArray();

    for (let [i, obj] of lstDetalleLabMov.entries()) {
      objItemDetalle = {
        index: obj.index, //para controlar cada fila como unica
        idProductoCPT: obj.idProducto,
        idPuntoCarga: obj.idPuntoCarga,
        cantidad: parseInt(
          $(
            "#txtCantLabMov_" +
              obj.idProducto +
              "[data-fila='" +
              obj.index +
              "']",
          ).val(),
        ),
        precio: obj.precioUnitario,
        importe: parseFloat(
          obj.precioUnitario *
            parseInt(
              $(
                "#txtCantLabMov_" +
                  obj.idProducto +
                  "[data-fila='" +
                  obj.index +
                  "']",
              ).val(),
            ),
        ).toFixed(3),
        totalPorPagar: parseFloat(
          obj.precioUnitario *
            parseInt(
              $(
                "#txtCantLabMov_" +
                  obj.idProducto +
                  "[data-fila='" +
                  obj.index +
                  "']",
              ).val(),
            ),
        ).toFixed(3),
        total: parseFloat(
          obj.precioUnitario *
            parseInt(
              $(
                "#txtCantLabMov_" +
                  obj.idProducto +
                  "[data-fila='" +
                  obj.index +
                  "']",
              ).val(),
            ),
        ).toFixed(3),
        labConfHIS: "",
        grupoHIS: 0,
        subgrupoHIS: 0,
        observaciones: "",
        seUsaSinPrecio: obj.seUsaSinPrecio,
      };

      detalleLabMov.push(objItemDetalle);
    }

    return detalleLabMov;
  },

  DevolverDetalleInsumo() {
    let detalleInsuMov = [];

    let objRowIns = {
      idProductoCPT: 0,
      idProducto: 0,
      cantidadFallada: 0,
      cantidad: 0,
    };

    detalleInsuMov.push(objRowIns);

    return detalleInsuMov;
  },

  ValidarDetalleMovimiento() {
    let cantidad = 0;
    let idPuntoCarga = 0;
    let lstDetalleLabMov = oTable_LabMovDetalleProductos
      .api(true)
      .data()
      .toArray();

    for (let [i, obj] of lstDetalleLabMov.entries()) {
      cantidad = parseInt(
        $(
          "#txtCantLabMov_" +
            obj.idProducto +
            "[data-fila='" +
            obj.index +
            "']",
        ).val(),
      );
      //idPuntoCarga = parseInt($('#txtIdPtoCargaLabMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val());

      if (cantidad <= 0) {
        alerta2(
          "info",
          "",
          "El examen " + obj.nombre + " tiene problemas con la cantidad.",
        );
        return false;
      }

      if (obj.seUsaSinPrecio == false) {
        if (obj.precioUnitario <= 0) {
          alerta2(
            "info",
            "",
            "El examen " + obj.nombre + " tiene problemas con el precio.",
          );
          return false;
        }
      }

      if (obj.idPuntoCarga != Laboratorio.idPuntoCarga) {
        alerta2(
          "info",
          "",
          "Los examenes a realizar no pertenecen a " +
            Laboratorio.puntoCarga +
            ".",
        );
        Laboratorio.LimpiarCamposMovimiento();
        return false;
      }
    }

    return true;
  },

  /*-------------------------------------------------------------------------------------------------------------------------------------*/

  /*------------BUSQUEDA DE CUENTAS----------------------------------*/
  async BuscarNumeroCuenta(idCuentaAtencion) {
    let datos =
      await Utilitario.AtencionesSelecionarPorCuenta(idCuentaAtencion);

    if (isEmpty(datos)) {
      return;
    }

    if (datos.idEstadoAtencion != 1) {
      alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
      return;
    }

    if (datos.idTipoServicio == 1) {
      if (datos.idTipoFinanciamiento == 1) {
        alerta2(
          "info",
          "",
          "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.",
        );
        return;
      }
    }

    LabMovimiento.idCuentaAtencion = datos.idCuentaAtencion;
    LabMovimiento.idOrden = 0;
    LabMovimiento.idPaciente = datos.idPaciente;
    //LabMovimiento.idReceta = null;
    LabMovimiento.idTipoFinanciamiento = datos.idTipoFinanciamiento;

    $("#txtMovTipoHistoria").val(datos.tipoNumeracionHistoria);
    $("#txtMovNroHistoria").val(datos.nroHistoriaClinica);
    $("#txtMovApPaterno").val(datos.apellidoPaterno);
    $("#txtMovApMaterno").val(datos.apellidoMaterno);
    $("#txtMovPrimerNombre").val(datos.primerNombre);
    $("#txtMovSegundoNombre").val(datos.segundoNombre);
    let edad = CalcularEdadAnioMesDia(datos.fechaNacimiento);
    $("#txtMovEdad").val(
      edad.años + "A " + edad.meses + "M " + edad.días + "D ",
    );
    //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
    $("#txtMovFechaNacimiento").datepicker("setDate", datos.fechaNacimiento);
    $("#txtMovHoraNacimiento").val(datos.horaNacimiento);
    $("#cboMovSexo").val(datos.idTipoSexo);

    if (LabMovimiento.idPaciente > 0) {
      $("#txtMovFechaNacimiento").attr("disabled", true);
      $("#txtMovHoraNacimiento").attr("disabled", true);
      $("#cboMovSexo").attr("disabled", true);
    } else {
      $("#txtMovFechaNacimiento").removeAttr("disabled");
      $("#txtMovHoraNacimiento").removeAttr("disabled");
      $("#cboMovSexo").removeAttr("disabled");
    }

    $("#txtMovNroCuenta").val(datos.idCuentaAtencion);
    $("#txtMovEstadoCuenta").val(
      "F.Ing: " + datos.fechaIngreso + " - " + datos.tipoServicio,
    );
    $("#txtMovProcedencia").val(datos.servicio);
    $("#cboMovPlan").val(datos.idTipoFinanciamiento);
    $("#txtMovFuenteFinanciamiento").val("IAFA Act.: " + datos.planA);

    if (datos.idCuentaAtencion > 0) {
      $("#cboMovMedicoSolicita_chosen").removeClass("d-none");
      $("#txtMovMedicoSolicita").hide();
    } else {
      $("#cboMovMedicoSolicita_chosen").addClass("d-none");
      $("#txtMovMedicoSolicita").show();
    }

    $(".chzn-select").chosen().trigger("chosen:updated");

    console.log(datos);
  },

  /*------------BUSQUEDA DE RECETAS----------------------------------*/
  async BuscarNumeroReceta(idReceta) {
    let datos =
      await Utilitario.RecetaCabeceraDetalleSeleccionaPorNroReceta(idReceta);
    let cabecera = datos.table[0];
    let detalle = datos.table1;

    if (cabecera.idEstadoReceta == 0) {
      alerta2("info", "", "La receta se encuentra anulada");
      return;
    }

    if (
      cabecera.idEstadoReceta == 2 ||
      (cabecera.idEstadoReceta == 3 &&
        cabecera.idComprobantePago > 0 &&
        isEmpty(cabecera.documentoDespachado) == false)
    ) {
      alerta2(
        "info",
        "",
        "La receta se encuentra despachada con <br>Nº Movimiento: " +
          cabecera.documentoDespachado,
      );
      return;
    }

    if (cabecera.idEstadoAtencion != 1) {
      alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
      return;
    }

    if (cabecera.idPuntoCarga != Laboratorio.idPuntoCarga) {
      alerta2(
        "info",
        "",
        "La receta NO pertenece al servicio de " + Laboratorio.puntoCarga,
      );
      return;
    }

    if (cabecera.idTipoServicio == 1) {
      if (cabecera.idTipoFinanciamiento == 1) {
        if (isNull(cabecera.idComprobantePago, 0) == 0) {
          alerta2(
            "info",
            "",
            "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.",
          );
          return;
        } else {
          alerta2(
            "info",
            "",
            "La receta solo tiene BOLETA, aún no es ATENDIDA.<br><span class='font-weight-bold'>Nº Cuenta: </span>" +
              cabecera.idCuentaAtencion +
              " <span class='font-weight-bold'>Boleta: </span>" +
              cabecera.comprobantePago,
          );
          return;
        }
      }
    }

    LabMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
    LabMovimiento.idOrden = 0;
    LabMovimiento.idPaciente = cabecera.idPaciente;
    LabMovimiento.idReceta = cabecera.idReceta;
    LabMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

    $("#txtMovTipoHistoria").val(cabecera.tipoNumeracionHistoria);
    $("#txtMovNroHistoria").val(cabecera.nroHistoriaClinica);
    $("#txtMovApPaterno").val(cabecera.apellidoPaterno);
    $("#txtMovApMaterno").val(cabecera.apellidoMaterno);
    $("#txtMovPrimerNombre").val(cabecera.primerNombre);
    $("#txtMovSegundoNombre").val(cabecera.segundoNombre);
    let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento);
    $("#txtMovEdad").val(
      edad.años + "A " + edad.meses + "M " + edad.días + "D ",
    );
    //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
    $("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
    $("#txtMovHoraNacimiento").val(cabecera.horaNacimiento);
    $("#cboMovSexo").val(cabecera.idTipoSexo);

    if (LabMovimiento.idPaciente > 0) {
      $("#txtMovFechaNacimiento").attr("disabled", true);
      $("#txtMovHoraNacimiento").attr("disabled", true);
      $("#cboMovSexo").attr("disabled", true);
    } else {
      $("#txtMovFechaNacimiento").removeAttr("disabled");
      $("#txtMovHoraNacimiento").removeAttr("disabled");
      $("#cboMovSexo").removeAttr("disabled");
    }

    $("#txtMovNroReceta").val(cabecera.idReceta);
    $("#txtMovNroCuenta").val(cabecera.idCuentaAtencion);
    $("#txtMovEstadoCuenta").val(
      "F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio,
    );
    $("#txtMovProcedencia").val(cabecera.servicio);
    $("#cboMovPlan").val(cabecera.idTipoFinanciamiento);
    $("#txtMovFuenteFinanciamiento").val("IAFA Act.: " + cabecera.planA);

    //$('#cboMovMedicoSolicita').val(cabecera.idMedicoSolicita);
    if (cabecera.idReceta > 0 && cabecera.idMedicoSolicita > 0) {
      $("#cboMovMedicoSolicita_chosen").removeClass("d-none");
      $("#cboMovMedicoSolicita").val(cabecera.idMedicoSolicita);
      $("#txtMovMedicoSolicita").hide();
    } else {
      $("#cboMovMedicoSolicita_chosen").addClass("d-none");
      $("#txtMovMedicoSolicita").show();
    }

    $(".chzn-select").chosen().trigger("chosen:updated");

    oTable_LabMovDetalleProductos.fnAddData(detalle);
    Laboratorio.Totalizar();

    console.log(cabecera);
    console.log(detalle);
  },

  /*------------BUSQUEDA DE COMPROBANTE PAGO----------------------------------*/
  async BuscarComprobantePago(nroSerie, nroDocumento, idPuntoCarga) {
    let datos =
      await Utilitario.RecetaCabeceraDetalleSeleccionaPorComprobantePago(
        nroSerie,
        nroDocumento,
        idPuntoCarga,
      );
    let cabecera = datos.table[0];
    let detalle = datos.table1;

    if (cabecera.idEstadoComprobante != 4) {
      alerta2("info", "", "El comprobante se encuentra anulada");
      return;
    }

    if (cabecera.idMovimientoLab > 0) {
      alerta2(
        "info",
        "",
        "El comprobante se encuentra despachado con <br>Nº Movimiento: " +
          cabecera.idMovimientoLab,
      );
      return;
    }

    //if (cabecera.idEstadoReceta == 2 || (cabecera.idEstadoReceta == 3 && cabecera.idComprobantePago > 0 && isEmpty(cabecera.documentoDespachado) == false)) {
    //    alerta2("info", "", "La receta se encuentra despachada con <br>Nº Movimiento: " + cabecera.documentoDespachado);
    //    return;
    //}

    //if (cabecera.idEstadoAtencion != 1) {
    //    alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
    //    return;
    //}

    //if (cabecera.idPuntoCarga != Laboratorio.idPuntoCarga) {
    //    alerta2("info", "", "La receta NO pertenece al servicio de " + Laboratorio.puntoCarga);
    //    return;
    //}

    //if (cabecera.idTipoServicio == 1 && isNull(cabecera.idComprobantePago, 0) == 0) {
    //    alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
    //    return;
    //} else {
    //    alerta2("info", "", "La receta solo tiene BOLETA, aún no es ATENDIDA.<br><span class='font-weight-bold'>Nº Cuenta: </span>" + cabecera.idCuentaAtencion + " <span class='font-weight-bold'>Boleta: </span>" + cabecera.comprobantePago);
    //    return;
    //}

    LabMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
    LabMovimiento.idOrden = cabecera.idOrden;
    LabMovimiento.idComprobantePago = cabecera.idComprobantePago;
    LabMovimiento.idOrdenPago = cabecera.idOrdenPago;
    LabMovimiento.idPaciente = cabecera.idPaciente;
    LabMovimiento.idReceta = cabecera.idReceta;
    LabMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

    $("#txtMovTipoHistoria").val(cabecera.tipoNumeracionHistoria);
    $("#txtMovNroHistoria").val(cabecera.nroHistoriaClinica);
    $("#txtMovApPaterno").val(cabecera.apellidoPaterno);
    $("#txtMovApMaterno").val(cabecera.apellidoMaterno);
    $("#txtMovPrimerNombre").val(isNull(cabecera.primerNombre, "_"));

    if (LabMovimiento.idPaciente > 0) {
      $("#txtMovFechaNacimiento").datepicker(
        "setDate",
        cabecera.fechaNacimiento,
      );
      $("#txtMovHoraNacimiento").val(cabecera.horaNacimiento);
      $("#cboMovSexo").val(cabecera.idTipoSexo);

      $("#txtMovFechaNacimiento").attr("disabled", true);
      $("#txtMovHoraNacimiento").attr("disabled", true);
      $("#cboMovSexo").attr("disabled", true);
    } else {
      $("#txtMovFechaNacimiento").removeAttr("disabled");
      $("#txtMovHoraNacimiento").removeAttr("disabled");
      $("#cboMovSexo").removeAttr("disabled");
    }
    //$('#txtMovSegundoNombre').val(cabecera.segundoNombre);
    //let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento)
    //$('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
    //$("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
    //$('#txtMovHoraNacimiento').val(cabecera.horaNacimiento);
    //$('#cboMovSexo').val(cabecera.idTipoSexo);

    $("#txtMovNroCorrelativoBoleta").val(cabecera.nroSerie);
    $("#txtMovNroDocumentoBoleta").val(cabecera.nroDocumento);
    $("#txtMovNroOrden").val(cabecera.idOrden);

    //$('#txtMovNroReceta').val(cabecera.idReceta);
    //$('#txtMovNroCuenta').val(cabecera.idCuentaAtencion);
    //$('#txtMovEstadoCuenta').val("F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio);
    //$('#txtMovProcedencia').val(cabecera.servicio);
    //$('#cboMovPlan').val(cabecera.tipoFinanciamiento);
    //$('#txtMovFuenteFinanciamiento').val("IAFA Act.: " + cabecera.planA);

    if (cabecera.idReceta > 0 && cabecera.idMedicoSolicita > 0) {
      $("#cboMovMedicoSolicita_chosen").removeClass("d-none");
      $("#cboMovMedicoSolicita").val(cabecera.idMedicoSolicita);
      $("#txtMovMedicoSolicita").hide();
    } else {
      $("#cboMovMedicoSolicita_chosen").addClass("d-none");
      $("#txtMovMedicoSolicita").show();
    }

    $("#frameBusquedaProductos").hide();

    $(".chzn-select").chosen().trigger("chosen:updated");

    oTable_LabMovDetalleProductos.fnAddData(detalle);
    Laboratorio.ValidarDetalleMovimiento();
    Laboratorio.Totalizar();

    console.log(cabecera);
    console.log(detalle);
  },

  /*-----------------------------------------------------------------*/
  ValidarDatosObligatoriosMovimiento() {
    LabMovimiento.detalleInsumos = Laboratorio.DevolverDetalleInsumo();
    LabMovimiento.detalleExamenes = Laboratorio.DevolverDetalleMovimiento();

    if (LabMovimiento.idMovimiento == 0) {
      if (
        isNull(LabMovimiento.idCuentaAtencion, 0) == 0 &&
        isNull(LabMovimiento.idComprobantePago, 0) == 0
      ) {
        alerta2(
          "info",
          "",
          "Por favor ingrese un paciente por receta, cuenta o comprobante de pago",
        );
        return false;
      }
    }

    if (Laboratorio.idPuntoCarga == 3) {
      if (
        $("#rdbMovTipoEstudioCito").is(":checked") == false &&
        $("#rdbMovTipoEstudioHisto").is(":checked") == false
      ) {
        alerta2(
          "info",
          "",
          "Por favor seleccione si es un examen de Citología o Histología",
        );
        return false;
      }
    }

    if (isEmpty($("#cboMovRegistraOrden").val())) {
      alerta2("info", "", "Por favor seleccione quien Registra Orden");
      return false;
    }

    // if (LabMovimiento.idCuentaAtencion > 0) {
    //    if (isEmpty($("#cboMovMedicoSolicita").val())) {
    //        alerta2("info", "", "Por favor seleccione Médico Solicita");
    //        return false;
    //    }
    //} else {
    //    if (isEmpty($("#txtMovMedicoSolicita").val())) {
    //        alerta2("info", "", "Por favor ingrese Médico Solicita");
    //        return false;
    //    }
    //}

    if ($("#txtMovMedicoSolicita").is(":visible")) {
      if (isEmpty($("#txtMovMedicoSolicita").val())) {
        alerta2("info", "", "Por favor ingrese Médico Solicita");
        return false;
      }
    }

    if ($("#cboMovMedicoSolicita").is(":visible")) {
      if (isEmpty($("#cboMovMedicoSolicita").val())) {
        alerta2("info", "", "Por favor seleccione Médico Solicita");
        return false;
      }
    }

    //if (isEmpty($("#cboMovMedicoRealiza").val())) {
    //    alerta2("info", "", "Por favor seleccione Médico Realiza");
    //    return false;
    //}

    if (isEmpty($("#txtMovApPaterno").val())) {
      alerta2(
        "info",
        "",
        "Por favor ingrese el Apellido Paterno del paciente.",
      );
      return false;
    }

    if (isEmpty($("#txtMovApMaterno").val())) {
      alerta2(
        "info",
        "",
        "Por favor ingrese el Apellido Materno del paciente.",
      );
      return false;
    }

    if (isEmpty($("#txtMovPrimerNombre").val())) {
      alerta2("info", "", "Por favor ingrese el Primer Nombre del paciente.");
      return false;
    }

    if (isEmpty($("#txtMovFechaNacimiento").val())) {
      alerta2(
        "info",
        "",
        "Por favor ingrese la Fecha Nacimiento del paciente.",
      );
      return false;
    }

    if (isEmpty($("#cboMovSexo").val())) {
      alerta2("info", "", "Por favor seleccione el Sexo del paciente.");
      return false;
    }

    //if (LabMovimiento.detalleInsumos.length == 0) {
    //    alerta2("info", "", "Por favor agregue los insumos.");
    //}

    if (LabMovimiento.detalleExamenes.length == 0) {
      alerta2("info", "", "Por favor agregue los examenes.");
      return false;
    } else {
      if (Laboratorio.ValidarDetalleMovimiento() == false) {
        return false;
      }
    }

    return true;
  },
  async ListarDiagnosticosLaboratorio(IdCuentaAtencion, idOrden) {
    let resp = false;
    let midata = new FormData();
    midata.append("IdCuentaAtencion", IdCuentaAtencion);
    midata.append("idOrden", idOrden);

    let datos;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarDiagnosticosLaboratorio?area=Facturacion",
        data: midata,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);
      if (datos.respuesta.table.length > 0) {
        $("#cboDiagnosticoRs").empty();

        // Cargar options
        datos.respuesta.table.forEach((obj) => {
          $("#cboDiagnosticoRs").append(
              `<option value="${obj.idDiagnostico}">
                ${obj.diagnostico}
             </option>`,
          );
        });

        // Seleccionar todos los diagnósticos devueltos
        let ids = datos.respuesta.table.map((x) => x.idDiagnostico.toString());

        $("#cboDiagnosticoRs").val(ids).trigger("change");

        resp = true;
      }
    } catch (error) {
      //console.error(error)
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
  },
  async ListarDiagnosticosCIE0Laboratorio(IdCuentaAtencion, idOrden) {
    let resp = false;
    let midata = new FormData();
    midata.append("IdCuentaAtencion", IdCuentaAtencion);
    midata.append("idOrden", idOrden);

    let datos;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarDiagnosticosLaboratorioCIE0?area=Facturacion",
        data: midata,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);
      if (datos.respuesta.table.length > 0) {
        $("#cboDiagnosticoCIE0").empty();

        // Cargar options
        datos.respuesta.table.forEach((obj) => {
          $("#cboDiagnosticoCIE0").append(
            `<option value="${obj.idDiagnostico}">
                ${obj.diagnostico}
             </option>`,
          );
        });

        // Seleccionar todos los diagnósticos devueltos
        let ids = datos.respuesta.table.map((x) => x.idDiagnostico.toString());

        $("#cboDiagnosticoCIE0").val(ids).trigger("change");

        resp = true;
      }
    } catch (error) {
      //console.error(error)
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
    },
    async ListarDiagnosticosCIE0LaboratorioMorfologico(IdCuentaAtencion, idOrden) {
        let resp = false;
        let midata = new FormData();
        midata.append("IdCuentaAtencion", IdCuentaAtencion);
        midata.append("idOrden", idOrden);

        let datos;
        try {
            Cargando(1);
            datos = await $.ajax({
                method: "POST",
                url: "/LaboratorioResultados/ListarDiagnosticosLaboratorioCIE0Morfologico?area=Facturacion",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                $("#cboDiagnosticoCIE0Morfologica").empty();

                // Cargar options
                datos.respuesta.table.forEach((obj) => {
                    $("#cboDiagnosticoCIE0Morfologica").append(
                        `<option value="${obj.idDiagnostico}">
                ${obj.diagnostico}
             </option>`,
                    );
                });

                // Seleccionar todos los diagnósticos devueltos
                let ids = datos.respuesta.table.map((x) => x.idDiagnostico.toString());

                $("#cboDiagnosticoCIE0Morfologica").val(ids).trigger("change");

                resp = true;
            }
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },
  async ListaDiagnosticosPorFiltro(filtro) {
    let datos = null;
    let midata = new FormData();
    //let filtro = '';

    $("#cboDiagnosticoRs").empty();
    $("#cboDiagnosticoRs").append('<option value=""></option>');
    $("#cboDiagnosticoRs").val("0");
    $(".chzn-select-deselect").chosen().trigger("chosen:updated");
    if (filtro.length >= 3) {
      try {
        midata.append("filtro", filtro);

        //Cargando(1);
        datos = await $.ajax({
          method: "POST",
          url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
          data: midata,
          dataType: "json",
          cache: false,
          processData: false,
          contentType: false,
        });

        //Cargando(0)
        $("#cboDiagnosticoRs").append('<option value=""></option>');
        $(datos.table).each(function (i, obj) {
          $("#cboDiagnosticoRs").append(
            '<option data-cie10="' +
              obj.codigoCIE10 +
              '" value="' +
              obj.idDiagnostico +
              '">' +
              obj.diagnostico +
              "</option>",
          );
        });

        $("#cboDiagnosticoRs").val("0");
        $(".chzn-select-deselect").chosen().trigger("chosen:updated");
      } catch (error) {
        resp = false;
        //console.error(error)
        alerta(3, error);
      }
    }

    $("#cboDiagnosticoRs_chosen .chosen-drop .chosen-search input").val(filtro);
  },
  async ListaDiagnosticosPorFiltroV2(filtro) {
    if (filtro.length < 3) return;

    let $select = $("#cboDiagnosticoRs");

    // Guardar los seleccionados (value y texto)
    let seleccionados = [];
    $select.find("option:selected").each(function () {
      seleccionados.push({
        value: $(this).val(),
        text: $(this).text(),
        cie10: $(this).data("cie10"),
      });
    });

    let midata = new FormData();
    midata.append("filtro", filtro);

    try {
      let datos = await $.ajax({
        method: "POST",
        url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
        data: midata,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      // Limpiar solo las opciones NO seleccionadas
      $select.find("option").not(":selected").remove();

      // Agregar las opciones filtradas
      $(datos.table).each(function (i, obj) {
        // Evitar agregar duplicados (ya seleccionados)
        if (!seleccionados.some((s) => s.value == obj.idDiagnostico)) {
          $select.append(
            `<option data-cie10="${obj.codigoCIE10}" value="${obj.idDiagnostico}">${obj.diagnostico}</option>`,
          );
        }
      });

      // Restaurar las opciones seleccionadas (aseguramos que existan en el select)
      seleccionados.forEach((s) => {
        if ($select.find(`option[value="${s.value}"]`).length === 0) {
          $select.append(
            `<option data-cie10="${s.cie10}" value="${s.value}" selected>${s.text}</option>`,
          );
        }
      });

      // Actualizar Chosen
      $select.trigger("chosen:updated");
    } catch (error) {
      alerta(3, error);
    }
  },

  async GuardarMovimiento() {
    if (Laboratorio.ValidarDatosObligatoriosMovimiento() == false) {
      return false;
    }

    var respuesta;
    var resp = false;
    let datos;
    var data = new FormData();

    LabMovimiento.detalleInsumos = Laboratorio.DevolverDetalleInsumo();
    LabMovimiento.detalleExamenes = Laboratorio.DevolverDetalleMovimiento();

    data.append("IdCuentaAtencion", LabMovimiento.idCuentaAtencion);
    data.append("IdMovimiento", LabMovimiento.idMovimiento);
    data.append("IdOrden", LabMovimiento.idOrden);
    data.append("IdOrdenPago", LabMovimiento.idOrdenPago);
    data.append("IdReceta", LabMovimiento.idReceta);
    data.append("MovTipo", "S");
    data.append("IdTipoConcepto", 3);
    data.append("IdPuntoCarga", Laboratorio.idPuntoCarga); //NUEVO PUNTO DE CARGA GENETICA, PARA TAMIZAJE
    data.append("MedicoSolicita", $("#txtMovMedicoSolicita").val());
    data.append("IdMedicoSolicita", $("#cboMovMedicoSolicita").val());
    data.append("IdMedicoRealiza", $("#cboMovMedicoRealiza").val());
    data.append("IdPersonaTomaLab", $("#cboMovRegistraOrden").val());
    data.append("IdPersonaRecoge", null);
    data.append(
      "TipoAP",
      $("#rdbMovTipoEstudioCito").is(":checked")
        ? "C"
        : $("#rdbMovTipoEstudioHisto").is(":checked")
          ? "H"
          : "",
    );
    data.append("IdMovApReemplazo", LabMovimiento.idMovApReemplazo);
    data.append("IdComprobantePago", LabMovimiento.idComprobantePago);
    data.append("CorrelativoAnual", null);
    data.append("IdDiagnostico", null);
    data.append("EsDiagnosticoDefinitivo", null);
    data.append("CubreIAFA", $("#chkMovIAFAnoCubre").is(":checked") ? 1 : 0);
    data.append(
      "FechaHoraNacimiento",
      $("#txtMovFechaNacimiento").val() +
        " " +
        isNull($("#txtMovHoraNacimiento").val(), "00:00"),
    );
    data.append("IdTipoSexo", $("#cboMovSexo").val());
    data.append("InsumosCPT", JSON.stringify(LabMovimiento.detalleInsumos));
    data.append("ProductosCPT", JSON.stringify(LabMovimiento.detalleExamenes));

    try {
      Cargando(1);
      return HttpClient.Post(
        "/LaboratorioMovimiento/GuardarMovimiento?area=Laboratorio",
        data,
      )
        .then((datos) => {
          console.log(datos);
          Cargando(0);
          //if (datos.respuesta.length > 0) {
          if (datos.respuesta > 0) {
            //let resp1 = datos.respuesta[0];
            let resp1 = datos.respuesta;
            let nroMovimiento = datos.movimiento;
            let codigoAp = datos.codigoAp;

            if (LabMovimiento.accion == "A") {
              Laboratorio.LimpiarCamposMovimiento();
              LabMovimiento.accion = "A";
              $("#frameResultadosBusquedaProdutos").hide();
              Laboratorio.DesbloquearCamposMovimiento();
            } else {
              $("#btnListarOrdenesLaboratorio").click();
              $("#modalLabMovimiento").modal("hide");
            }

            let mensajeResp = "";
            if (Laboratorio.idPuntoCarga == 3) {
              mensajeResp =
                'Los datos se han registrado correctamente. <br><table class="table table-bordered border mx-auto" style="width: 330px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' +
                nroMovimiento +
                '</th></tr><tr><th class="text-sm-center" style="width: 170px;background: #c7b0de;">Código AP</th><th class="text-sm-center">' +
                codigoAp +
                "</th></tr></table>";
            } else {
              mensajeResp =
                'Los datos se han registrado correctamente. <br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' +
                nroMovimiento +
                "</th></tr></table>";
            }

            //alerta2("success", "", "Los datos se han registrado correctamente. Se ha generado el número de movimiento: " + resp1.idMovimiento);
            alerta2("success", "", mensajeResp);
          } else {
            resp = false;
            alerta2("error", "", "Hubo un error en el registro de los datos.");
          }
        })
        .catch((e) => {
          Cargando(0);
          //alerta(3, 'Algo salio mal ' + e)
          alerta2("error", "", JSON.stringify(e));
          return null;
        }); /// falta hcer los cambios aqui
    } catch (error) {
      Cargando(0);
      alerta2("error", "", JSON.stringify(error));
      console.log("error lab", error);
      alerta(3, error);
    }

    return resp;
  },

  async EliminarLabMovimiento(idMovimiento) {
    let cabecera = null;
    let detalle = null;
    let resp = false;
    let datos;
    var data = new FormData();

    data.append("idMovimiento", idMovimiento);

    try {
      Cargando(1);

      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioMovimiento/EliminarMovimiento?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);

      if (datos.respuesta.table.length > 0) {
        let respuesta = datos.respuesta.table[0];

        if (respuesta.error == 0) {
          $("#btnListarOrdenesLaboratorio").click();
          alerta2("success", "", respuesta.mensaje);
        } else {
          alerta2("warning", "", respuesta.mensaje);
        }
      } else {
        resp = false;
        alerta2("error", "", "Hubo un error en la eliminacion de los datos.");
      }
    } catch (error) {
      resp = false;
      Cargando(0);
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
  },

  async SeleccionarLabMovimiento(idMovimiento) {
    let cabecera = null;
    let detalle = null;
    let resp = false;
    let datos;
    var data = new FormData();

    data.append("idMovimiento", idMovimiento);

    try {
      Cargando(1);

      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioMovimiento/SeleccionarMovimiento?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);

      if (datos.respuesta.table.length > 0) {
        cabecera = datos.respuesta.table[0];
        detalle = datos.respuesta.table1;

        LabMovimiento.idMovimiento = cabecera.idMovimiento;
        LabMovimiento.idOrden = cabecera.idOrden;
        LabMovimiento.idOrdenPago = cabecera.idOrdenPago;
        LabMovimiento.idComprobantePago = cabecera.idComprobantePago;
        LabMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
        LabMovimiento.idPaciente = cabecera.idPaciente;
        LabMovimiento.idReceta = cabecera.idReceta;
        LabMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

        $("#txtMovNroMovimiento").val(cabecera.idMovimiento);
        $("#txtMovEstadoMovimiento").val(cabecera.estadoOrden);
        $("#txtMovFechaRegistroMovimiento").val(cabecera.fechaRegistro);
        $("#txtMovFechaRealizaMovimiento").val(cabecera.fechaRealizaCpt);

        $("#txtMovTipoHistoria").val(cabecera.tipoNumeracionHistoria);
        $("#txtMovNroHistoria").val(cabecera.nroHistoriaClinica);
        $("#txtMovApPaterno").val(cabecera.apellidoPaterno);
        $("#txtMovApMaterno").val(cabecera.apellidoMaterno);
        $("#txtMovPrimerNombre").val(cabecera.primerNombre);
        $("#txtMovSegundoNombre").val(cabecera.segundoNombre);

        let edad = null;
        if (LabMovimiento.idMovimiento > 0) {
          edad = CalcularEdadAnioMesDiaSegunFecha(
            cabecera.fechaNacimiento,
            cabecera.fechaAtencion,
          );
        } else {
          edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento);
        }
        //console.log(edad);
        $("#txtMovEdad").val(
          edad.años + "A " + edad.meses + "M " + edad.días + "D ",
        );
        //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
        $("#txtMovFechaNacimiento").datepicker(
          "setDate",
          cabecera.fechaNacimiento,
        );
        $("#txtMovHoraNacimiento").val(cabecera.horaNacimiento);
        $("#cboMovSexo").val(cabecera.idTipoSexo);

        if (cabecera.idCuentaAtencion > 0) {
          $("#TabPacienteConCuenta").show();
          $("#TabPacienteExterno").hide();
          $('#tabLabMovimiento a[href="#TabPanelPacienteConCuenta"]').tab(
            "show",
          );
          $("#txtMovNroCuenta").val(cabecera.idCuentaAtencion);
          $("#txtMovEstadoCuenta").val(
            "F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio,
          );
          $("#txtMovProcedencia").val(cabecera.servicio);
          $("#cboMovPlan").val(cabecera.idTipoFinanciamiento);
          $("#txtMovFuenteFinanciamiento").val("IAFA Act.: " + cabecera.planA);
        } else {
          $("#TabPacienteExterno").show();
          $("#TabPacienteConCuenta").hide();
          $('#tabLabMovimiento a[href="#TabPanelPacienteExterno"]').tab("show");
          $("#txtMovNroCorrelativoBoleta").val(cabecera.nroSerie);
          $("#txtMovNroDocumentoBoleta").val(cabecera.nroDocumento);
          $("#txtMovNroOrden").val(cabecera.idOrden);
        }

        if (cabecera.tipoAP == "C") {
          $("#rdbMovTipoEstudioCito").prop("checked", true);
        } else if (cabecera.tipoAP == "H") {
          $("#rdbMovTipoEstudioHisto").prop("checked", true);
        }

        $("#txtMovAnioAP").val(cabecera.anioAP);
        $("#txtMovTipoAP").val(cabecera.tipoAP);
        $("#txtMovNumeracionAP").val(cabecera.numeracionAP);

        $("#cboMovRegistraOrden").val(cabecera.idRegistraOrden);
        $("#cboMovMedicoSolicita").val(cabecera.idSolicitaPrueba);
        $("#cboMovMedicoRealiza").val(cabecera.idRealizaPrueba);

        if (cabecera.idPaciente > 0) {
          $("#txtMovFechaNacimiento").attr("disabled", true);
          $("#txtMovHoraNacimiento").attr("disabled", true);
          $("#cboMovSexo").attr("disabled", true);
        } else {
          let datosPaciente = cabecera.paciente.split(" ");
          $("#txtMovTipoHistoria").val("");
          $("#txtMovNroHistoria").val("");
          $("#txtMovApPaterno").val(
            isEmpty(datosPaciente[0]) ? "" : datosPaciente[0],
          );
          $("#txtMovApMaterno").val(
            isEmpty(datosPaciente[1]) ? "" : datosPaciente[1],
          );
          $("#txtMovPrimerNombre").val(
            isEmpty(datosPaciente[2]) ? "" : datosPaciente[2],
          );
          $("#txtMovSegundoNombre").val(
            isEmpty(datosPaciente[3]) ? "" : datosPaciente[3],
          );

          $("#txtMovFechaNacimiento").removeAttr("disabled");
          $("#txtMovHoraNacimiento").removeAttr("disabled");
          $("#cboMovSexo").removeAttr("disabled");
        }

        if (cabecera.idSolicitaPrueba > 0) {
          $("#cboMovMedicoSolicita_chosen").removeClass("d-none");
          $("#txtMovMedicoSolicita").hide();
          $("#txtMovMedicoSolicita").val("");
        } else {
          $("#cboMovMedicoSolicita_chosen").addClass("d-none");
          $("#txtMovMedicoSolicita").show();
          $("#txtMovMedicoSolicita").val(cabecera.solicitaPrueba);
        }

        $(".chzn-select").chosen().trigger("chosen:updated");

        oTable_LabMovDetalleProductos.fnAddData(detalle);
        Laboratorio.Totalizar();
      } else {
        resp = false;
        alerta2("error", "", "Hubo un error en la seleccion de los datos.");
      }
    } catch (error) {
      resp = false;
      Cargando(0);
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
  },

  async CargarCodigosApDisponibles() {
    let cabecera = null;
    let detalle = null;
    let resp = false;
    let datos;
    var data = new FormData();

    data.append(
      "TipoAp",
      $("#rdbMovTipoEstudioCito").is(":checked")
        ? "C"
        : $("#rdbMovTipoEstudioHisto").is(":checked")
          ? "H"
          : "",
    );

    try {
      Cargando(1);
      oTable_ListaCodigosApDisponibles.fnClearTable();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioMovimiento/ListarCodigosApDisponibles?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);

      if (datos.respuesta.table.length > 0) {
        detalle = datos.respuesta.table;

        oTable_ListaCodigosApDisponibles.fnAddData(detalle);

        $("#modalCodigosApDisponibles").modal("show");
      } else {
        resp = false;
        alerta2("info", "", "No existen codigos disponibles.");
      }
    } catch (error) {
      resp = false;
      Cargando(0);
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
  },

  /*========================IMAGENES ADJUNTAS===================================================================== */
  async GuardarImagenAdjunta(
    idCuenta,
    idOrden,
    idMovimiento,
    idProducto,
    tipo,
    fileImage,
  ) {
    var formData = new FormData();
    let datos;
    let resp = false;
    //let fileImage = document.getElementById('imagenLab').files[0];

    formData.append("idCuenta", idCuenta);
    formData.append("idOrden", idOrden);
    formData.append("idMovimiento", idMovimiento);
    formData.append("idProducto", idProducto);
    formData.append("tipo", tipo);
    formData.append("imageArchivo", fileImage);
    Cargando(1);
    try {
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/GuardarImagenAdjunta?area=Laboratorio",
        data: formData,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);
      resp = true;
    } catch (error) {
      Cargando(0);
      resp = false;
      alerta2("error", "", error);
    }

    return resp;
  },

  async EliminarImagenAdjunta(idLabResultadoImagen) {
    var formData = new FormData();
    let datos;
    let resp = false;

    formData.append("idLabResultadoImagen", idLabResultadoImagen);
    Cargando(1);
    try {
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/EliminarImagenAdjunta?area=Laboratorio",
        data: formData,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);
      resp = true;
    } catch (error) {
      Cargando(0);
      resp = false;
      alerta2("error", "", error);
    }

    return resp;
  },

  async ListarImagenesAdjuntas(idOrden, idMovimiento, idProducto) {
    var formData = new FormData();
    let datos;
    let resp = false;

    formData.append("idOrden", idOrden);
    formData.append("idMovimiento", idMovimiento);
    formData.append("idProducto", idProducto);
    Cargando(1);
    try {
      oTable_LabResImagenesAdjuntas.fnClearTable();
      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/ListarImagenesAdjuntas?area=Laboratorio",
        data: formData,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);
      if (datos.lsResultados.table.length > 0) {
        let imagenes = datos.lsResultados.table;
        oTable_LabResImagenesAdjuntas.fnAddData(imagenes);
      }
      oTable_LabResImagenesAdjuntas.resize();
    } catch (error) {
      Cargando(0);
      resp = false;
      alerta2("error", "", error);
    }

    return resp;
  },

  /*====================================================================================================================== */

  ValidarDatosObligatoriosResultados() {
    if (isEmpty($("#txtFechaResultado").val())) {
      alerta2("info", "", "Ingrese la Fecha Resultado.");
      return false;
    }

    if (isEmpty($("#txtHoraResultado").val())) {
      alerta2("info", "", "Ingrese la Hora Resultado.");
      return false;
    }

    if (isEmpty($("#cboRealizaPrueba").val())) {
      alerta2("info", "", "Seleccione quien Realiza Prueba.");
      return false;
    }

    return true;
  },

  async GuardarResultado() {
    var respuesta;
    var resp = false;
    let datos;
    var data = new FormData();

    let detalleResultado = Laboratorio.DevolverDetalleResultado();

    data.append("IdCuentaAtencion", Laboratorio.idCuentaAtencion);
    data.append("IdOrden", Laboratorio.idOrden);
    data.append("IdMovimiento", Laboratorio.idMovimiento);
    data.append("IdProducto", Laboratorio.idProducto);
    data.append("IdRealizaAnalisis", $("#cboRealizaPrueba").val());
    data.append(
      "FechaResultado",
      $("#txtFechaResultado").val() + " " + $("#txtHoraResultado").val(),
    );
    data.append("CodigoIngreso", $("#txtCodigoIngreso").val());
    data.append("detalleResultado", JSON.stringify(detalleResultado));
    data.append("Observaciones", $("#txtResObservaciones").val());
    data.append("TipoMuestra", $("#cboTipoMuestra").val());
    data.append("EstadoEstudio", $("#cboEstadoEstudio").val());
    data.append("Resultado", resultado);
    data.append("Code", codigo);
    if (
      $("#cboDiagnosticoRs").val() == "" ||
      isEmpty($("#cboDiagnosticoRs").val())
    ) {
      data.append("diagnosticos", "");
    } else {
      data.append("diagnosticos", $("#cboDiagnosticoRs").val().join(","));
    }

    if (
      $("#cboDiagnosticoCIE0").val() == "" ||
      isEmpty($("#cboDiagnosticoCIE0").val())
    ) {
      data.append("diagnosticosCIE0", "");
    } else {
      data.append("diagnosticosCIE0", $("#cboDiagnosticoCIE0").val().join(","));
    }

    if (
        $("#cboDiagnosticoCIE0Morfologica").val() == "" ||
        isEmpty($("#cboDiagnosticoCIE0Morfologica").val())
    ) {
        data.append("diagnosticoCIE0Morfologica", "");
    } else {
        data.append("diagnosticoCIE0Morfologica", $("#cboDiagnosticoCIE0Morfologica").val().join(","));
    }
    data.append("GradoDiferenciacion", $("#cboGradoDiferenciacion").val());
    data.append("Lateralidad", $("#cboLateralidad").val());
    data.append("MetodoDiagnostico", 0/*$("#cboMetodoDiagnostico").val()*/);

    try {
      Cargando(1);

      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/GuardarResultados?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);

      if (datos.respuesta) {
        alerta2("success", "", "Los resultados se guardaron correctamente.");
        resp = true;
      }
    } catch (error) {
      resp = false;
      Cargando(0);
      alerta2("danger", "", JSON.stringify(error));
    }

    return resp;
  },

  async EliminarResultado(idMovimiento, idProducto) {
    let cabecera = null;
    let detalle = null;
    let resp = false;
    let datos;
    var data = new FormData();

    data.append("idMovimiento", idMovimiento);
    data.append("idProducto", idProducto);

    try {
      Cargando(1);

      datos = await $.ajax({
        method: "POST",
        url: "/LaboratorioResultados/EliminarResultado?area=Laboratorio",
        //contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });

      Cargando(0);

      if (datos.respuesta.table.length > 0) {
        let respuesta = datos.respuesta.table[0];

        if (respuesta.error == 0) {
          await Laboratorio.ListarDetalleOrden();
          alerta2("success", "", respuesta.mensaje);
        } else {
          alerta2("warning", "", respuesta.mensaje);
        }
      } else {
        resp = false;
        alerta2("error", "", "Hubo un error en la eliminación de los datos.");
      }
    } catch (error) {
      resp = false;
      Cargando(0);
      alerta2("error", "", JSON.stringify(error));
    }

    return resp;
  },

  DevolverDetalleResultado() {
    let detalleResultado = [];
    let objItemDetalle = null;
    let lstDetalleResultado = oTable_ResultadosLaboratorio
      .api(true)
      .data()
      .toArray();

    let valorNumero = "";
    let valorTexto = "";
    let valorCombo = "";
    let valorCheck = "";

    $("#tblFormatoResultadosLab tbody tr").each(function () {
      valorNumero =
        $(this).find("td:eq(2) input").length == 0
          ? null
          : $(this).find("td:eq(2) input").val();
      valorTexto =
        $(this).find("td:eq(3) input").length == 0
          ? null
          : $(this).find("td:eq(3) input").val();
      valorCombo =
        $(this).find("td:eq(4) select").length == 0
          ? null
          : isNull($(this).find("td:eq(4) select option:selected").text(), 0);
      valorCheck =
        $(this).find("td:eq(5) input").length == 0
          ? null
          : $(this).find("td:eq(5) input").is(":checked") == true
            ? 1
            : 0;

      ordenNumero =
        $(this).find("td:eq(2) input").length == 0
          ? 0
          : $(this).find("td:eq(2) input").attr("data-ordenxresultado");
      ordenTexto =
        $(this).find("td:eq(3) input").length == 0
          ? 0
          : $(this).find("td:eq(3) input").attr("data-ordenxresultado");
      ordenCombo =
        $(this).find("td:eq(4) select").length == 0
          ? 0
          : isNull(
              $(this)
                .find("td:eq(4) select option:selected")
                .attr("data-ordenxresultado"),
              0,
            );
      ordenCheck =
        $(this).find("td:eq(5) input").length == 0
          ? 0
          : $(this).find("td:eq(5) input").attr("data-ordenxresultado");

      ordenXresultado =
        parseInt(ordenNumero) +
        parseInt(ordenTexto) +
        parseInt(ordenCombo) +
        parseInt(ordenCheck);

      if (ordenXresultado > 0) {
        if (
          !isEmpty(ordenNumero) ||
          !isEmpty(ordenTexto) ||
          !isEmpty(ordenCombo) ||
          !isEmpty(ordenCheck)
        ) {
          objItemDetalle = {
            IdOrden: Laboratorio.idOrden,
            IdProducto: Laboratorio.idProducto,
            OrdenResultado: ordenXresultado,
            ValorNumero: valorNumero,
            ValorTexto: valorTexto,
            ValorCombo: valorCombo,
            ValorCheck: valorCheck,
            //realizaAnalisis: $("#cboRealizaPrueba").val(),
            //CodigoIngreso: $("#txtCodigoIngreso").val()
          };
          detalleResultado.push(objItemDetalle);
        }
      }

      //console.log(valorTexto);
      //console.log(valorCombo);
      //console.log(valorCheck);
      //console.log("-------------------------------");
    });

    console.log(detalleResultado);

    return detalleResultado;
  },

  async ListarDetalleOrden() {
    Cargando(1);
    let objRow = oTable_ListaOrdenes.api(true).row(".selected").data();

    if (isEmpty(objRow)) {
      alerta(2, "Selecciona una orden");
      Cargando(0);
      return false;
    }

    let facturacionServicioDespacho =
      await Laboratorio.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(
        objRow.idOrden,
        objRow.idPuntoCarga,
        objRow.idMovimiento,
      );
    console.log(facturacionServicioDespacho);
    oTable_ListaOrdenesDetalle.fnClearTable();
    if (!isEmpty(facturacionServicioDespacho)) {
      oTable_ListaOrdenesDetalle.fnAddData(facturacionServicioDespacho);
    }
    Cargando(0);
  },

  Limpiar() {
    $(".search").val("");
    $("#cboBusqTipoServicio").val("0");
    $("#cboBusqGrupoExamen").val("0");
    $("#cboBusqRealizaExamen").val("0");
  },

  LimpiarCamposResultados() {
    Laboratorio.idCuentaAtencion = 0;
    Laboratorio.idOrden = 0;
    Laboratorio.idMovimiento = 0;
    Laboratorio.idProducto = 0;
    //Laboratorio.tipoResponsableEstudio = '';
    $(".campoRes").val("");
    $(".chzn-select").chosen().trigger("chosen:updated");
    oTable_ResultadosLaboratorio.fnClearTable();
  },

  BloquearCamposMovimiento() {
    $(".campoMov").attr("disabled", true);
    $(".campoMovBusq").attr("disabled", true);
    $("#btnReemplazarAP").hide();
    $(".dCampoDetalle").attr("disabled", true);
    $("#frameBusquedaProductos").hide();
    $("#btnGuardarMovimiento").hide();
    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  DesbloquearCamposMovimiento() {
    $(".campoMov").removeAttr("disabled");
    $("#btnReemplazarAP").show();

    $("#frameBusquedaProductos").show();
    $("#btnGuardarMovimiento").show();

    if (LabMovimiento.accion == "A") {
      $(".campoMovBusq").removeAttr("disabled");
      $("#formMovIAFAnoCubre").show();
      $("#btnReemplazarAP").hide();

      $("#TabPacienteConCuenta").show();
      $("#TabPacienteExterno").show();
      $('#tabLabMovimiento a[href="#TabPanelPacienteConCuenta"]').tab("show");

      $("#cboMovMedicoSolicita_chosen").removeClass("d-none");
      $("#txtMovMedicoSolicita").hide();

      $(".rdbMovTipoEstudio").removeAttr("disabled");
    } else {
      $(".campoMovBusq").attr("disabled", true);
      $(".rdbMovTipoEstudio").attr("disabled", true);
      $("#formMovIAFAnoCubre").hide();
      if (LabMovimiento.idPaciente > 0) {
        $("#txtMovFechaNacimiento").attr("disabled", true);
        $("#txtMovHoraNacimiento").attr("disabled", true);
        $("#cboMovSexo").attr("disabled", true);
      } else {
        $("#txtMovFechaNacimiento").removeAttr("disabled");
        $("#txtMovHoraNacimiento").removeAttr("disabled");
        $("#cboMovSexo").removeAttr("disabled");
      }

      if (LabMovimiento.idComprobantePago > 0) {
        $("#btnGuardarMovimiento").hide();
        $("#frameBusquedaProductos").hide();
      }
    }

    //$('#cboMovMedicoSolicita_chosen').removeClass("d-none");
    //$('#txtMovMedicoSolicita').hide();

    $(".dCampoDetalle").removeAttr("disabled");

    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  LimpiarCamposMovimiento() {
    //LabMovimiento.accion = "";
    LabMovimiento.idCuentaAtencion = null;
    LabMovimiento.idAtencion = null;
    LabMovimiento.idPaciente = 0;
    LabMovimiento.idMovimiento = 0;
    LabMovimiento.idOrden = 0;
    LabMovimiento.idOrdenPago = null;
    LabMovimiento.idReceta = null;
    LabMovimiento.idComprobantePago = null;
    LabMovimiento.idTipoFinanciamiento = null;
    LabMovimiento.detalleExamenes = null;
    LabMovimiento.detalleInsumos = null;

    $(".campoMov").val("");
    $("#modalLabMovimiento input").val("");
    $("#modalLabMovimiento select").val("");
    $(".rdbMovTipoEstudio").prop("checked", false);

    //if (LabMovimiento.accion == "A") {

    //}
    //Laboratorio.tipoResponsableEstudio == 'C' ? $('#rdbMovTipoEstudioCito').prop("checked", true) : (Laboratorio.tipoResponsableEstudio == 'H' ? $('#rdbMovTipoEstudioHisto').prop("checked", true) : false)          //SE COMENTO A PETICIION  DEL ING. ROLY

    $(".chzn-select").chosen().trigger("chosen:updated");
    $("#TotalDetalleLabMov").html("");
    oTable_LabMovDetalleProductos.fnClearTable();
  },
};

$(document).ready(() => {
  $("#btnListarOrdenesLaboratorioTamizaje").hide();

  Laboratorio.Plugins();
  Laboratorio.CargaInicial();
  Laboratorio.CargarCombos();
  Laboratorio.InitDatablesListaOrdenes();
  Laboratorio.InitDatablesListaOrdenesDetalle();
  Laboratorio.IniciarDataTableResultados();
  Laboratorio.InitDataTableFormatoResultado();
  Laboratorio.InitDatablesListaImagenesAdjuntas();
  Laboratorio.InitDatablesDetalleProductos();
  Laboratorio.DataTableProductosBuscados();
  Laboratorio.InitDatablesListaCodigosApDisponibles();
  //Laboratorio.InitDatablesPatologiaClinica()

  Laboratorio.Events();

  BusqCuentasPacientes.Iniciar();
  BusqRecetasPacientes.Iniciar();

  PermisoGeneral.ValidarServicioFirmaDigital();

  $("#btnReporteAnatomiaPatologica").on("click", async () => {
    $("#modalReporteAnatomiaPatologica").modal("show");
  });

  $("#btnCerrarReporteAnatomiaPatologica").on("click", async () => {
    $("#modalReporteAnatomiaPatologica").modal("hide");
  });

  $("#btnGenerarReporteAnatomiaPatologica").on("click", async () => {
    let FechaInicio = $("#txtFechaInicioReporteAnatomiaPatologica").val();
    let FechaFin = $("#txtFechaFinReporteAnatomiaPatologica").val();
    let splFecIni = FechaInicio.split("/");
    let splFecFin = FechaFin.split("/");
    FechaInicio = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
    FechaFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];
    var url =
      "/Reportes/ReporteAnatomiaPatologica?area=Reportes&FechaInicio=" +
      FechaInicio +
      "&FechaFin=" +
      FechaFin;
    window.location.href = url;
  });

  if (Laboratorio.idPuntoCarga == 14) {
    $("#btnListarOrdenesLaboratorioTamizaje").show();
  }
});
