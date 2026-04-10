let ReportesFarmacia = {
  Plugins: async () => {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes;
    fechaP = dia + "/" + mes + "/" + yyy;

    let fechaHoy = await Utilitario.FechaHoraServidor();
    fechaHoy = fechaHoy.substring(0, 10);

    $(".hide_search").chosen({ disable_search_threshold: 10 });
    $(".chzn-select").chosen({
      allow_single_deselect: true,
      placeholder_text_single: "Seleccione una opción",
    });
    $(".chzn-select-deselect,#select2_sample").chosen();

    $("#txtFechaInicioICI, #txtFechaFinICI").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioIDI, #txtFechaFinIDI").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioFajo, #txtFechaFinFajo").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $(
      "#txtFechaCorteSaldosPorAlmacen, #txtFechaInicioConsumoServicio, #txtFechaFinConsumoServicio",
      "#txtFechaInicioRecetasMedicas",
      "#txtFechaFinRecetasMedicas",
    ).datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $(
      "#txtFechaInicioRecetaPorServicio, #txtFechaFinRecetaPorServicio, #txtFechaInicioRegistroVentas, #txtFechaFinRegistroVentas",
    ).datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $(
      "#txtFechaInicioConsumoPorServicioFarmacia, #txtFechaFinConsumoPorServicioFarmacia",
    ).datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioTotalVentas, #txtFechaFinTotalVentas").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioPsicotropicos, #txtFechaFinPsicotropicos").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioAntimicrobianos, #txtFechaFinAntimicrobianos").datepicker(
      {
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom",
      },
    );

    $("#txtFechaInicioMovimiento, #txtFechaFinMovimiento").datepicker({
      todayHighlight: true,
      autoclose: true,
      orientation: "bottom",
    });

    $("#txtFechaInicioICI").val(fechaHoy);
    $("#txtFechaFinICI").val(fechaHoy);

    $("#txtFechaInicioIDI").val(fechaHoy);
    $("#txtFechaFinIDI").val(fechaHoy);
    $("#txtFechaCorteSaldosPorAlmacen").val(fechaHoy);

    $("#txtFechaInicioConsumoServicio").datepicker("setDate", fechaHoy);
    $("#txtFechaFinConsumoServicio").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioRecetasMedicas").datepicker("setDate", fechaHoy);
    $("#txtFechaFinRecetasMedicas").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioRegistroVentas").datepicker("setDate", fechaHoy);
    $("#txtFechaFinRegistroVentas").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioConsumoPorServicioFarmacia").datepicker(
      "setDate",
      fechaHoy,
    );
    $("#txtFechaFinConsumoPorServicioFarmacia").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioTotalVentas").datepicker("setDate", fechaHoy);
    $("#txtFechaFinTotalVentas").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioPsicotropicos").datepicker("setDate", fechaHoy);
    $("#txtFechaFinPsicotropicos").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioAntimicrobianos").datepicker("setDate", fechaHoy);
    $("#txtFechaFinAntimicrobianos").datepicker("setDate", fechaHoy);

    $("#txtFechaInicioMovimiento").datepicker("setDate", fechaHoy);
    $("#txtFechaFinMovimiento").datepicker("setDate", fechaHoy);

    $.mask.definitions["D"] = "[0123]";
    $.mask.definitions["d"] = "[123456789]";
    $.mask.definitions["M"] = "[01]";
    $.mask.definitions["m"] = "[0123456789]";
    $.mask.definitions["a"] = "[12]";
    $.mask.definitions["b"] = "[0123456789]";
    $.mask.definitions["c"] = "[0123456789]";
    $.mask.definitions["d"] = "[0123456789]";
    $(
      "#txtFechaInicioICI, #txtFechaFinICI, #txtFechaInicioIDI, #txtFechaFinIDI, #txtFechaCorteSaldosPorAlmacen, #txtFechaInicioConsumoServicio, #txtFechaFinConsumoServicio, #txtFechaInicioRecetasMedicas, #txtFechaFinRecetasMedicas, " +
        "#txtFechaInicioRegistroVentas, #txtFechaFinRegistroVentas, #txtFechaInicioConsumoPorServicioFarmacia, #txtFechaFinConsumoPorServicioFarmacia,#txtFechaInicioTotalVentas, #txtFechaFinTotalVentas, " +
        "#txtFechaInicioPsicotropicos, #txtFechaFinPsicotropicos, #txtFechaInicioAntimicrobianos, #txtFechaFinAntimicrobianos",
    ).mask("Dd/Mm/abcd");

    $.mask.definitions["H"] = "[012]";
    $.mask.definitions["N"] = "[012345]";
    $.mask.definitions["n"] = "[0123456789]";
    $(
      "#txtHoraInicioICI, #txtHoraFinICI, #txtHoraCorteSaldosPorAlmacen, #txtHoraInicioRegistroVentas , #txtHoraFinRegistroVentas, #txtHoraInicioPsicotropicos, #txtHoraFinPsicotropicos",
    ).mask("Hn:Nn");

    $("#txtHoraInicioPsicotropicos").val("00:00");
    $("#txtHoraFinPsicotropicos").val("23:59");

    $("#txtHoraInicioMovimiento").val("00:00");
    $("#txtHoraFinMovimiento").val("23:59");
  },

  InitDatablesICI: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "2%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 2,
          data: "precioDistribucion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 3,
          data: "saldo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        //{
        //    width: '2%',
        //    targets: 4,
        //    data: "compra",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 5,
        //    data: "devol",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 6,
        //    data: "ingresoInterv",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 7,
        //    data: "otrasUe",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 8,
        //    data: "anulaciones",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        {
          width: "2%",
          targets: 9,
          data: "totalIngresos",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        //{
        //    width: '2%',
        //    targets: 10,
        //    data: "ventas",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 11,
        //    data: "sis",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 12,
        //    data: "intervenSan",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 13,
        //    data: "salidaOtraUe",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 14,
        //    data: "consumoInst",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        {
          width: "5%",
          targets: 15,
          data: "totalSalidas",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 16,
          data: "stockFinCalculado",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 17,
          data: "stockFinal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 18,
          data: "fechaVencimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblReporteICI"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteICI = $("#tblReporteICI").dataTable(parms);
  },

  InitDatablesICI_MGP: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "1%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 2,
          data: "precio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },
        {
          width: "5%",
          targets: 16,
          data: "cantidad_mgp",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },
        {
          width: "2%",
          targets: 3,
          data: "cantidad_SIS",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },
        {
          width: "2%",
          targets: 9,
          data: "cantidad_IS",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },

        {
          width: "5%",
          targets: 15,
          data: "cantidad",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },

        {
          width: "5%",
          targets: 15,
          data: "stock",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "center");
          },
        },
      ],
    };
    var tableWrapper = $("#tblReporteICI_MGP"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteICI_MGP = $("#tblReporteICI_MGP").dataTable(parms);
  },

  InitDatablesICIDonaciones: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "2%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 2,
          data: "precio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 3,
          data: "saldo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 4,
          data: "ingresos",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 5,
          data: "consumo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 6,
          data: "stockFinal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 7,
          data: "fechaVencimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblReporteICIDonaciones"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteICIDonaciones = $("#tblReporteICIDonaciones").dataTable(
      parms,
    );
  },

  InitDatablesIDI: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "2%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 2,
          data: "precioDistribucion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 3,
          data: "saldo Anterior",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        //{
        //    width: '2%',
        //    targets: 4,
        //    data: "compra",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 5,
        //    data: "devol",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 6,
        //    data: "ingresoInterv",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 7,
        //    data: "otrasUe",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 8,
        //    data: "anulaciones",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        {
          width: "2%",
          targets: 9,
          data: "(a) + (b)",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        //{
        //    width: '2%',
        //    targets: 10,
        //    data: "ventas",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '2%',
        //    targets: 11,
        //    data: "sis",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 12,
        //    data: "intervenSan",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 13,
        //    data: "salidaOtraUe",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        //{
        //    width: '5%',
        //    targets: 14,
        //    data: "consumoInst",
        //    createdCell: function (td, cellData, rowData, row, col) {
        //        $(td).attr('align', 'left')
        //    }
        //},
        {
          width: "5%",
          targets: 15,
          data: "totalSalida",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 16,
          data: "saldoFinal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 17,
          data: "saldoFinal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 18,
          data: "fechaVencimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblReporteIDI"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteIDI = $("#tblReporteIDI").dataTable(parms);
  },
  InitDatablesIDIDonaciones: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "2%",
          targets: 0,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "70%",
          targets: 1,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 2,
          data: "precio",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 3,
          data: "saldo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 4,
          data: "ingresos",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 5,
          data: "consumo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 6,
          data: "stockFinal",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "2%",
          targets: 7,
          data: "fechaVencimiento",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblReporteIDIDonaciones"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteIDIDonaciones = $("#tblReporteIDIDonaciones").dataTable(
      parms,
    );
  },
  InitDatablesSaldosPorAlmacenConFechaCorte: function () {
    let parms = {
      //"paging": true,
      //"ordering": true,
      //"info": false,
      //bFilter: true,
      //"scrollX": true,
      paging: true,
      ordering: true,
      info: false,
      scrollX: true,
      columns: [
        {
          width: "15%",
          targets: 0,
          data: "farmacia",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 1,
          data: "codigo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "25%",
          targets: 2,
          data: "nombre",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 3,
          data: "precioCompra",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 4,
          data: "precioUltCompra",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 5,
          data: "precioDistribucion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 6,
          data: "precioDonacion",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
        {
          width: "5%",
          targets: 7,
          data: "saldo",
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).attr("align", "left");
          },
        },
      ],
    };
    var tableWrapper = $("#tblSaldosPorAlmacenConFechaCorte"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    oTable_reporteSaldosPorAlmacenConFechaCorte = $(
      "#tblSaldosPorAlmacenConFechaCorte",
    ).dataTable(parms);
  },

  Events: () => {
    $("#btnGenerarSaldosPorAlmacen").on("click", () => {
      //window.open(
      //    ,
      //    '_blank' // <- This is what makes it open in a new window.
      //);

      fetch(
        `/ReportesFarmacia/rptSaldosPorAlamacen?area=Farmacia&idAlmacen=${$("#cboFarmAlmacen").val()}&idTipoBusqueda=${$("#cboTipoReporteFarmacia").val()}`,
        {
          method: "GET",
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "saldoPorAlmacen.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta(1, "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta(2, "Error al descargar documento, intente nuevamente.");
          Cargando(0);
        });
    });

    $("#btnGenerarReporteICI_MGP").on("click", () => {
      //generarVistaPreviaDesdeTabla(oTable_reporteICI_MGP, {
      //    titulo: "Reporte ICI - MGP",
      //    subtitulo: "Instituto Nacional Materno Perinatal",
      //    colorHeader: "#9b1b30",
      //    colorTextoHeader: "#fff"
      //});

      generarVistaPreviaDesdeTabla(oTable_reporteICI_MGP, {
        titulo: "Reporte ICI - MGP",
        subtitulo: "Instituto Nacional Materno Perinatal",
        colorHeader: "#9b1b30",
        colorTextoHeader: "#fff",
        orientacion: "landscape", // "portrait" o "landscape"
        margenIzqDer: "2mm",
      });

      //if ($('#txtFechaInicioICI').val() == '' || $('#txtHoraInicioICI').val() == '' || $('#txtFechaFinICI').val() == '' || $('#txtHoraFinICI').val() == '') {
      //    alerta(2, 'Las fechas y horas son obligatorias')
      //    Cargando(0)
      //    return false
      //}
      //let formData = new FormData()
      //formData.append('FechaInicio', $("#txtFechaInicioICI").val() + ' ' + $("#txtHoraInicioICI").val())
      //formData.append('FechaFin', $("#txtFechaFinICI").val() + ' ' + $("#txtHoraFinICI").val())
      //formData.append('IdAlmacen', $("#cboFarmaciaICI").val())
      //Cargando(1)

      //if ($("#cboTipoReporteICI").val() == 1) {
      //    fetch('/ReportesFarmacia/rptGeneraICI?area=Farmacia', {
      //        method: "POST",
      //        body: formData
      //    })
      //        .then(response => response.blob())
      //        .then(blob => {
      //            var url = window.URL.createObjectURL(blob)
      //            var a = document.createElement('a')
      //            a.href = url
      //            a.download = "ReporteICI.xlsx"
      //            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      //            a.click();
      //            a.remove();  //afterwards we remove the element again
      //            alerta(1, 'La descarga se realizo con exito.')
      //            Cargando(0)
      //        })
      //        .catch((e) => {
      //            alerta(2, 'Error al descargar documento, intente nuevamente.')
      //            Cargando(0)
      //        })
      //} else {
      //    fetch('/ReportesFarmacia/rptGeneraICIDonaciones?area=Farmacia', {
      //        method: "POST",
      //        body: formData
      //    })
      //        .then(response => response.blob())
      //        .then(blob => {
      //            var url = window.URL.createObjectURL(blob)
      //            var a = document.createElement('a')
      //            a.href = url
      //            a.download = "ReporteICIDonaciones.xlsx"
      //            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      //            a.click();
      //            a.remove();  //afterwards we remove the element again
      //            alerta(1, 'La descarga se realizo con exito.')
      //            Cargando(0)
      //        })
      //        .catch((e) => {
      //            alerta(2, 'Error al descargar documento, intente nuevamente.')
      //            Cargando(0)
      //        })
      //}
    });

    $("#btnGenerarICI").on("click", () => {
      if (
        $("#txtFechaInicioICI").val() == "" ||
        $("#txtHoraInicioICI").val() == "" ||
        $("#txtFechaFinICI").val() == "" ||
        $("#txtHoraFinICI").val() == ""
      ) {
        alerta(2, "Las fechas y horas son obligatorias");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioICI").val() + " " + $("#txtHoraInicioICI").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinICI").val() + " " + $("#txtHoraFinICI").val(),
      );
      formData.append("IdAlmacen", $("#cboFarmaciaICI").val());

      Cargando(1);
      oTable_reporteICI.fnClearTable();
      oTable_reporteICIDonaciones.fnClearTable();

      if ($("#cboTipoReporteICI").val() == 1) {
        HttpClient.Post("/ReportesFarmacia/GenerarICI?area=Farmacia", formData)
          .then((res) => {
            console.log("si entra al reporte ici", res);
            if (res.estado) {
              if (res.data.table.length > 0) {
                oTable_reporteICI.fnAddData(res.data.table);
              }
              Cargando(0);
            } else {
              alerta(3, res.mensaje);
              Cargando(0);
            }
            return res;
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error: " + e);
            Cargando(0);
          });
      } else {
        HttpClient.Post(
          "/ReportesFarmacia/GenerarICIDonaciones?area=Farmacia",
          formData,
        )
          .then((res) => {
            console.log("si entra al reporte ici", res);
            if (res.estado) {
              if (res.data.table.length > 0) {
                oTable_reporteICIDonaciones.fnAddData(res.data.table);
              }
              Cargando(0);
            } else {
              alerta(3, res.mensaje);
              Cargando(0);
            }
            return res;
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error: " + e);
            Cargando(0);
          });
      }
    });

    //JAA
    $("#btnGenerarICI_MGP").on("click", () => {
      if (
        $("#txtFechaInicioICI_MGP").val() == "" ||
        $("#txtHoraInicioICI_MGP").val() == "" ||
        $("#txtFechaFinICI_MGP").val() == "" ||
        $("#txtHoraFinICI_MGP").val() == ""
      ) {
        alerta(2, "Las fechas y horas son obligatorias");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioICI_MGP").val() +
          " " +
          $("#txtHoraInicioICI_MGP").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinICI_MGP").val() + " " + $("#txtHoraFinICI_MGP").val(),
      );
      //formData.append('IdAlmacen', $("#cboFarmaciaICI_MGP").val())
      formData.append("IdAlmacen", "6");
      Cargando(1);
      oTable_reporteICI_MGP.fnClearTable();
      //oTable_reporteICIDonaciones.fnClearTable()

      //if ($("#cboTipoReporteICI").val() == 1) {
      HttpClient.Post(
        "/ReportesFarmacia/GenerarICI_MGP?area=Farmacia",
        formData,
      )
        .then((res) => {
          console.log("si entra al reporte ici", res);
          if (res.estado) {
            if (res.data.table.length > 0) {
              oTable_reporteICI_MGP.fnAddData(res.data.table);
            }
            Cargando(0);
          } else {
            alerta(3, res.mensaje);
            Cargando(0);
          }
          return res;
          Cargando(0);
        })
        .catch((e) => {
          alerta(2, "Error: " + e);
          Cargando(0);
        });
      //} else {
      //    HttpClient.Post('/ReportesFarmacia/GenerarICIDonaciones?area=Farmacia', formData)
      //        .then(res => {
      //            console.log('si entra al reporte ici', res)
      //            if (res.estado) {
      //                if (res.data.table.length > 0) {
      //                    oTable_reporteICIDonaciones.fnAddData(res.data.table)
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
      //}
    });

    $("#btnGenerarIDI").on("click", () => {
      if (
        $("#txtFechaInicioIDI").val() == "" ||
        $("#txtHoraInicioIDI").val() == "" ||
        $("#txtFechaFinIDI").val() == "" ||
        $("#txtHoraFinIDI").val() == ""
      ) {
        alerta(2, "Las fechas y horas son obligatorias");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioIDI").val() + " " + $("#txtHoraInicioIDI").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinIDI").val() + " " + $("#txtHoraFinIDI").val(),
      );
      formData.append("IdAlmacen", $("#cboFarmaciaIDI").val());

      Cargando(1);
      oTable_reporteICI.fnClearTable();
      oTable_reporteICIDonaciones.fnClearTable();

      if ($("#cboTipoReporteIDI").val() == 1) {
        HttpClient.Post("/ReportesFarmacia/GenerarIDI?area=Farmacia", formData)
          .then((res) => {
            console.log("si entra al reporte ici", res);
            if (res.estado) {
              if (res.data.table.length > 0) {
                oTable_reporteIDI.fnAddData(res.data.table);
              }
              Cargando(0);
            } else {
              alerta(3, res.mensaje);
              Cargando(0);
            }
            return res;
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error: " + e);
            Cargando(0);
          });
      } else {
        HttpClient.Post(
          "/ReportesFarmacia/GenerarIDIDonaciones?area=Farmacia",
          formData,
        )
          .then((res) => {
            console.log("si entra al reporte ici", res);
            if (res.estado) {
              if (res.data.table.length > 0) {
                oTable_reporteIDIDonaciones.fnAddData(res.data.table);
              }
              Cargando(0);
            } else {
              alerta(3, res.mensaje);
              Cargando(0);
            }
            return res;
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error: " + e);
            Cargando(0);
          });
      }

      //window.open(
      //    `/ReportesFarmacia/rptSaldosPorAlamacen?area=Farmacia&idAlmacen=${$('#cboFarmAlmacen').val()}&idTipoBusqueda=${ $('#cboTipoReporteFarmacia').val() }`,
      //    '_blank' // <- This is what makes it open in a new window.
      //);
    });

    $("#btnGenerarReporteIDI").on("click", () => {
      if (
        $("#txtFechaInicioIDI").val() == "" ||
        $("#txtHoraInicioIDI").val() == "" ||
        $("#txtFechaFinIDI").val() == "" ||
        $("#txtHoraFinIDI").val() == ""
      ) {
        alerta(2, "Las fechas y horas son obligatorias");
        Cargando(0);
        return false;
      }
      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioIDI").val() + " " + $("#txtHoraInicioIDI").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinIDI").val() + " " + $("#txtHoraFinIDI").val(),
      );
      formData.append("IdAlmacen", $("#cboFarmaciaIDI").val());
      Cargando(1);

      if ($("#cboTipoReporteICI").val() == 1) {
        fetch("/ReportesFarmacia/rptGeneraIDI?area=Farmacia", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "ReporteIDI.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            alerta(1, "La descarga se realizo con exito.");
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error al descargar documento, intente nuevamente.");
            Cargando(0);
          });
      } else {
        fetch("/ReportesFarmacia/rptGeneraIDIDonaciones?area=Farmacia", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "ReporteICIDonaciones.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            alerta(1, "La descarga se realizo con exito.");
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error al descargar documento, intente nuevamente.");
            Cargando(0);
          });
      }
    });

    $("#btnBuscarSaldosConFechaCorte").on("click", () => {
      if (
        $("#txtFechaCorteSaldosPorAlmacen").val() == "" ||
        $("#txtHoraCorteSaldosPorAlmacen").val() == ""
      ) {
        alerta(2, "Ingresa la fecha");
        Cargando(0);
        return false;
      }

      if ($("#txtFechaCorteSaldosPorAlmacen").val() == "") {
        alerta(2, "Selecciona un almacen");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("idTipoAlmacen", $("#cboFarmAlmacenPorFecha").val());
      formData.append(
        "fechaCorte",
        $("#txtFechaCorteSaldosPorAlmacen").val() +
          " " +
          $("#txtHoraCorteSaldosPorAlmacen").val(),
      );

      Cargando(1);
      oTable_reporteSaldosPorAlmacenConFechaCorte.fnClearTable();
      //oTable_reporteICIDonaciones.fnClearTable()

      if ($("#cboTipoReporteICI").val() == 1) {
        HttpClient.Post(
          "/ReportesFarmacia/ListarSaldosPorAlmacenConFechaCorte?area=Farmacia",
          formData,
        )
          .then((res) => {
            console.log("si entra al reporte ici", res);
            if (res.estado) {
              if (res.data.table.length > 0) {
                oTable_reporteSaldosPorAlmacenConFechaCorte.fnAddData(
                  res.data.table,
                );
              }
              Cargando(0);
            } else {
              alerta(3, res.mensaje);
              Cargando(0);
            }
            return res;
            Cargando(0);
          })
          .catch((e) => {
            alerta(2, "Error: " + e);
            Cargando(0);
          });
      }
    });

    $("#btnGenerarSaldosPorAlmacenPorFecha").on("click", () => {
      if (
        $("#txtFechaCorteSaldosPorAlmacen").val() == "" ||
        $("#txtHoraCorteSaldosPorAlmacen").val() == ""
      ) {
        alerta(2, "Ingresa la fecha");
        Cargando(0);
        return false;
      }

      if ($("#txtFechaCorteSaldosPorAlmacen").val() == "") {
        alerta(2, "Selecciona un almacen");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("idTipoAlmacen", $("#cboFarmAlmacenPorFecha").val());
      formData.append(
        "fechaCorte",
        $("#txtFechaCorteSaldosPorAlmacen").val() +
          " " +
          $("#txtHoraCorteSaldosPorAlmacen").val(),
      );
      Cargando(1);

      fetch(
        "/ReportesFarmacia/rptGeneraSaldosPorAlmacenConFechaCorte?area=Farmacia",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "SaldosPorAlmacenConFechaCorte.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta(1, "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta(2, "Error al descargar documento, intente nuevamente.");
          Cargando(0);
        });
    });

    $("#btnGenerarRptProductosEnDesabastecimiento").on("click", () => {
      let formData = new FormData();

      Cargando(1);

      fetch("/ReportesFarmacia/rptProductosEnDesabastecimiento?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ProductosEnDesabastecimiento.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta(1, "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta(2, "Error al descargar documento, intente nuevamente.");
          Cargando(0);
        });
    });

    $("#btnGenerarRptProductosEnSobrestock").on("click", () => {
      let formData = new FormData();

      Cargando(1);

      fetch("/ReportesFarmacia/rptProductosEnSobrestock?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ProductosEnSobrestock.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta(1, "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta(2, "Error al descargar documento, intente nuevamente.");
          Cargando(0);
        });
    });

    $("#cboTipoReporteICI").on("change", async () => {
      let farmacias;

      oTable_reporteICI.fnClearTable();
      oTable_reporteICIDonaciones.fnClearTable();

      if ($("#cboTipoReporteICI").val() == 1) {
        $("#tblReporteICI_wrapper").show();
        $("#tblReporteICIDonaciones_wrapper").hide();

        farmacias = await ReportesFarmacia.CargarComboFarmaciasICIIDI(
          "F",
          "01",
        );
      } else {
        $("#tblReporteICI_wrapper").hide();
        $("#tblReporteICIDonaciones_wrapper").show();

        farmacias = await ReportesFarmacia.CargarComboFarmaciasICIIDI(
          "F",
          "02",
        );
      }

      $("#cboFarmaciaICI").empty();
      $("#cboFarmaciaICI").append(
        '<option  value="0">Seleccione una opción</option>',
      );
      $(farmacias).each(function (i, obj) {
        $("#cboFarmaciaICI").append(
          '<option  value="' +
            obj.idAlmacen +
            '">' +
            obj.descripcion +
            "</option>",
        );
      });
      $("#cboFarmaciaICI").val(0);

      $(".chzn-select").chosen().trigger("chosen:updated");
    });

    $("#cboTipoReporteIDI").on("change", async () => {
      let farmacias;

      oTable_reporteIDI.fnClearTable();
      oTable_reporteIDIDonaciones.fnClearTable();
      if ($("#cboTipoReporteIDI").val() == 1) {
        $("#tblReporteIDI_wrapper").show();
        $("#tblReporteIDIDonaciones_wrapper").hide();

        farmacias = await ReportesFarmacia.CargarComboFarmaciasICIIDI(
          "A",
          "01",
        );
      } else {
        $("#tblReporteIDI_wrapper").hide();
        $("#tblReporteIDIDonaciones_wrapper").show();

        farmacias = await ReportesFarmacia.CargarComboFarmaciasICIIDI(
          "A",
          "02",
        );
      }

      $("#cboFarmaciaIDI").empty();
      $("#cboFarmaciaIDI").append(
        '<option  value="0">Seleccione una opción</option>',
      );
      $(farmacias).each(function (i, obj) {
        $("#cboFarmaciaIDI").append(
          '<option  value="' +
            obj.idAlmacen +
            '">' +
            obj.descripcion +
            "</option>",
        );
      });
      $("#cboFarmaciaIDI").val(0);

      $(".chzn-select").chosen().trigger("chosen:updated");
    });

    $("#cboTipoServFajo").on("change", async () => {
      let filtro = ` (${$("#cboTipoServFajo").val()}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`;
      await ReportesFarmacia.DevuelveServiciosDelHospitalFiltro(filtro);
    });

    ///////////////////////KHOYOSI REPORTE CONSUMO SERVICIO DE FARMACIA//////////////////////////////////////////////////////////
    $("#btnConsumoServicioFarmacia").on("click", () => {
      if ($("#cboUsuarioConsumoServicio").val() == "") {
        alerta2("info", "", "Selecciona un usuario.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaInicioConsumoServicio").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinConsumoServicio").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("idUsuario", $("#cboUsuarioConsumoServicio").val());
      formData.append("fechaInicio", $("#txtFechaInicioConsumoServicio").val());
      formData.append("fechaFin", $("#txtFechaFinConsumoServicio").val());
      Cargando(1);

      fetch(
        "/ReportesFarmacia/rptListarConsumoServicioCPTFarmacia?area=Farmacia",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ReporteConsumoServicioFarmacia.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnCerrarConsumoServicioFarmacia").on("click", () => {
      $("#cboUsuarioConsumoServicio").val(0);
      $("#txtFechaInicioConsumoServicio").datepicker("setDate", fechaP);
      $("#txtFechaFinConsumoServicio").datepicker("setDate", fechaP);
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#btnConsumoPorServicioFarmacia").on("click", () => {
      if (isEmpty($("#cboFarmaciaConsumoPorServicio").val())) {
        alerta2("info", "", "Selecciona una farmacia.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaInicioConsumoPorServicioFarmacia").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinConsumoPorServicioFarmacia").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioConsumoPorServicioFarmacia").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinConsumoPorServicioFarmacia").val(),
      );
      formData.append(
        "IdAlmacenOrigen",
        $("#cboFarmaciaConsumoPorServicio").val(),
      );
      formData.append(
        "IdTipoServicio",
        $("#cboTipoServiciopConsumoServFarmacia").val(),
      );
      Cargando(1);

      fetch(
        "/ReportesFarmacia/ReporteConsumoPorServicioFarmacia?area=Farmacia",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ReporteConsumoServicioFarmacia.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnGenerarReporteFajo").on("click", () => {
      //if ($('#cboUsuarioConsumoServicio').val() == '') {
      //    alerta2('info', '', 'Selecciona un usuario.')
      //    Cargando(0)
      //    return false
      //}

      if (isEmpty($("#txtFechaInicioFajo").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtHoraInicioFajo").val())) {
        alerta2("info", "", "Ingresa la hora de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinFajo").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtHoraFinFajo").val())) {
        alerta2("info", "", "Ingresa la hora final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioFajo").val() + " " + $("#txtHoraInicioFajo").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinFajo").val() + " " + $("#txtHoraFinFajo").val(),
      );
      formData.append("idAlmacen", $("#cboAlmacenFajo").val());
      formData.append("movTipo", "S");
      formData.append("idUsuario", $("#cboVendedorFajo").val());
      formData.append("idTipoFinanciamiento", $("#cboProductoPlanFajo").val());
      formData.append("idTipoServicio", $("#cboTipoServFajo").val());
      formData.append("idServicio", $("#cboServicioFajo").val());

      Cargando(1);
      fetch("/ReportesFarmacia/rptMovimientoFajos?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "Fajos.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnRecetaPorServicioFarmacia").on("click", () => {
      //if ($('#cboUsuarioConsumoServicio').val() == '') {
      //    alerta2('info', '', 'Selecciona un usuario.')
      //    Cargando(0)
      //    return false
      //}

      if (isEmpty($("#cboFarmaciaRecetaPorServicio").val())) {
        alerta2("info", "", "Seleccione la farmacia");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaInicioRecetaPorServicio").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinRecetaPorServicio").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("IdAlmacen", $("#cboFarmaciaRecetaPorServicio").val());
      formData.append("IdTipo", $("#cboTipoRecetaPorServicio").val());
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioRecetaPorServicio").val(),
      );
      formData.append("FechaFin", $("#txtFechaFinRecetaPorServicio").val());

      Cargando(1);
      fetch("/ReportesFarmacia/rptRecetasPorServicio?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "RecetasPorServicio.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnRegistroVentasFarmacia").on("click", () => {
      //if ($('#cboUsuarioConsumoServicio').val() == '') {
      //    alerta2('info', '', 'Selecciona un usuario.')
      //    Cargando(0)
      //    return false
      //}

      //if (isEmpty($('#cboFarmaciaRecetaPorServicio').val())) {
      //    alerta2('info', '', 'Seleccione la farmacia')
      //    Cargando(0)
      //    return false
      //}

      if (isEmpty($("#txtFechaInicioRegistroVentas").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinRegistroVentas").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append(
        "FechaInicio",
        $("#txtFechaInicioRegistroVentas").val() +
          " " +
          $("#txtHoraInicioRegistroVentas").val(),
      );
      formData.append(
        "FechaFin",
        $("#txtFechaFinRegistroVentas").val() +
          " " +
          $("#txtHoraFinRegistroVentas").val(),
      );
      formData.append("IdCaja", $("#cboCajaRegistroVentas").val());
      formData.append("IdTurno", $("#cboTurnoRegistroVentas").val());
      formData.append("IdCajero", $("#cboCajeroRegistroVentas").val());
      formData.append(
        "IdTipoComprobante",
        $("#cboComprobanteRegistroVentas").val(),
      );
      formData.append(
        "IdTipoReporte",
        $("#cboTipoReporteRegistroVentas").val(),
      );
      formData.append(
        "IdVendedorFarmacia",
        $("#cboVendedorRegistroVentas").val(),
      );
      formData.append("IdTipo", $("#cboTipoRegistroVentas").val());
      formData.append("IdFarmacia", $("#cboFarmaciaRegistroVentas").val());

      Cargando(1);
      fetch("/ReportesFarmacia/rptRegistroDeVentas?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "RegistroVentas.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    ///////////////////////KHOYOSI REPORTE RECETAS MEDICAS EMITITDAS//////////////////////////////////////////////////////////
    $("#btnRecetasMedicas").on("click", () => {
      if ($("#cboUsuarioRecetasMedicas").val() == "") {
        alerta2("info", "", "Selecciona un usuario.");
        Cargando(0);
        return false;
      }

      if ($("#cboEstadoRecetasMedicas").val() == "") {
        alerta2("info", "", "Selecciona el estado.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaInicioRecetasMedicas").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        Cargando(0);
        return false;
      }

      if (isEmpty($("#txtFechaFinRecetasMedicas").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("idUsuario", $("#cboUsuarioRecetasMedicas").val());
      formData.append("idEstado", $("#cboEstadoRecetasMedicas").val());
      formData.append("fechaInicio", $("#txtFechaInicioRecetasMedicas").val());
      formData.append("fechaFin", $("#txtFechaFinRecetasMedicas").val());
      Cargando(1);

      fetch("/ReportesFarmacia/rptListarRecetasEmitidas?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ReporteRecetasEmitidas.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnProductosPorVencer").on("click", () => {
      if ($("#txtCantidadFechaVencimiento").val() == "") {
        alerta2("info", "", "Ingrese un rango.");
        Cargando(0);
        return false;
      }

      if ($("#cboTipoTiempoVencimiento").val() == "") {
        alerta2("info", "", "Seleccione el tipo.");
        Cargando(0);
        return false;
      }

      let formData = new FormData();
      formData.append("rango", $("#txtCantidadFechaVencimiento").val());
      formData.append("tipo", $("#cboTipoTiempoVencimiento").val());

      Cargando(1);

      fetch("/ReportesFarmacia/rptListarMedicamentosPorVencer?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "ReporteRecetasEmitidas.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          alerta2("success", "", "La descarga se realizo con exito.");
          Cargando(0);
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnCerrarRecetasMedicas").on("click", () => {
      $("#cboUsuarioRecetasMedicas").val(0);
      $("#cboEstadoRecetasMedicas").val(0);
      $("#txtFechaInicioRecetasMedicas").datepicker("setDate", fechaP);
      $("#txtFechaFinRecetasMedicas").datepicker("setDate", fechaP);
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#btnCerrarProductosPorVencer").on("click", () => {
      $("#cboTipoTiempoVencimiento").val(0);
      $("#txtCantidadFechaVencimiento").val("");
    });

    ///////////////////////KHOYOSI REPORTE TOTAL DE VENTAS//////////////////////////////////////////////////////////
    $("#btnGenerarReporteTotalVentas").on("click", () => {
      if ($("#cboFarmaciaTotalVentas").val() == "") {
        alerta2("info", "", "Selecciona una farmacia o almacen.");
        return false;
      }

      if (isEmpty($("#txtFechaInicioTotalVentas").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        return false;
      }

      if (isEmpty($("#txtFechaFinTotalVentas").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        return false;
      }

      if (
        $("#txtFechaInicioTotalVentas").val() >
        $("#txtFechaFinTotalVentas").val()
      ) {
        alerta2(
          "info",
          "",
          "La fecha de inicio debe ser menor o igual a la fecha final.",
        );
        return false;
      }

      if (isEmpty($('input[name="rdbTipoReporteTotalVentas"]:checked').val())) {
        alerta2("info", "", "Por favor seleccione una opcion.");
        return false;
      }

      let formData = new FormData();
      formData.append("idFarmacia", $("#cboFarmaciaTotalVentas").val());
      formData.append("fechaInicio", $("#txtFechaInicioTotalVentas").val());
      formData.append("fechaFin", $("#txtFechaFinTotalVentas").val());
      formData.append(
        "tipoReporte",
        $('input[name="rdbTipoReporteTotalVentas"]:checked').val(),
      );
      formData.append(
        "farmacia",
        $("#cboFarmaciaTotalVentas option:selected").text(),
      );

      Cargando(1);

      fetch("/ReportesFarmacia/rptListarTotalVentasFarmacia?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status === 204) {
            alerta2("info", "", "No existen datos para descargar.");
            Cargando(0);
            return;
          }
          return response.blob();
        })
        .then((blob) => {
          if (isEmpty(blob) == false) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "ReporteTotalventas.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            alerta2("success", "", "La descarga se realizo con exito.");
            Cargando(0);
          }
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnCerrarReporteTotalVentas").on("click", () => {
      $("#cboFarmaciaTotalVentas").val("");
      $("#txtFechaInicioTotalVentas").datepicker("setDate", fechaP);
      $("#txtFechaFinTotalVentas").datepicker("setDate", fechaP);
      $('input[name="rdbTipoReporteTotalVentas"]').removeAttr("checked");
      $(".chzn-select").chosen().trigger("chosen:updated");

      $("#modalReporteTotalVentas").modal("hide");
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////KHOYOSI REPORTE PSICOTROPICOS//////////////////////////////////////////////////////////
    $("#btnGenerarReportePsicotropicos").on("click", () => {
      if (
        $("#cboFarmaciaPsicotropicos").val() < 0 ||
        $("#cboFarmaciaPsicotropicos").val() == ""
      ) {
        alerta2("info", "", "Selecciona una farmacia o almacen.");
        return false;
      }

      if (isEmpty($("#cboTipoPsicotropicos").val())) {
        alerta2("info", "", "Selecciona el tipo.");
        return false;
      }

      if (isEmpty($("#txtFechaInicioPsicotropicos").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        return false;
      }

      if (isEmpty($("#txtHoraInicioPsicotropicos").val())) {
        alerta2("info", "", "Ingresa la hora de inicio.");
        return false;
      }

      if (isEmpty($("#txtFechaFinPsicotropicos").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        return false;
      }

      if (isEmpty($("#txtHoraFinPsicotropicos").val())) {
        alerta2("info", "", "Ingresa la hora final.");
        return false;
      }

      if (
        $("#txtFechaInicioPsicotropicos").val() >
        $("#txtFechaFinPsicotropicos").val()
      ) {
        alerta2(
          "info",
          "",
          "La fecha de inicio debe ser menor o igual a la fecha final.",
        );
        return false;
      }

      if (
        $("#txtHoraInicioPsicotropicos").val() >
        $("#txtHoraFinPsicotropicos").val()
      ) {
        alerta2(
          "info",
          "",
          "La hora de inicio debe ser menor o igual a la hora final.",
        );
        return false;
      }

      let formData = new FormData();
      formData.append("idFarmacia", $("#cboFarmaciaPsicotropicos").val());
      formData.append("tipo", $("#cboTipoPsicotropicos").val());
      formData.append("fechaInicio", $("#txtFechaInicioPsicotropicos").val());
      formData.append("horaInicio", $("#txtHoraInicioPsicotropicos").val());
      formData.append("fechaFin", $("#txtFechaFinPsicotropicos").val());
      formData.append("horaFin", $("#txtHoraFinPsicotropicos").val());
      formData.append(
        "farmacia",
        $("#cboFarmaciaPsicotropicos option:selected").text(),
      );
      formData.append(
        "tipoReporte",
        $("#cboTipoPsicotropicos option:selected").text(),
      );

      Cargando(1);

      fetch("/ReportesFarmacia/rptListarPsicotropicosFarmacia?area=Farmacia", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.status === 204) {
            alerta2("info", "", "No existen datos para descargar.");
            Cargando(0);
            return;
          }
          return response.blob();
        })
        .then((blob) => {
          if (isEmpty(blob) == false) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "ReportePsicotropicos.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            alerta2("success", "", "La descarga se realizo con exito.");
            Cargando(0);
          }
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnCerrarReportePsicotropicos").on("click", () => {
      $("#cboFarmaciaPsicotropicos").val("0");
      $("#cboTipoPsicotropicos").val("");
      $("#txtFechaInicioPsicotropicos").datepicker("setDate", fechaP);
      $("#txtHoraInicioPsicotropicos").val("00:00");
      $("#txtFechaFinPsicotropicos").datepicker("setDate", fechaP);
      $("#txtHoraFinPsicotropicos").val("23:59");
      $(".chzn-select").chosen().trigger("chosen:updated");

      $("#modalReportePsicotropicos").modal("hide");
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////KHOYOSI REPORTE ANTIMICROBIANOS//////////////////////////////////////////////////////////
    $("#btnGenerarReporteAntimicrobianos").on("click", () => {
      if (
        $("#cboFarmaciaAntimicrobianos").val() < 0 ||
        $("#cboFarmaciaAntimicrobianos").val() == ""
      ) {
        alerta2("info", "", "Selecciona una farmacia o almacen.");
        return false;
      }

      // if (isEmpty($('#cboServicioAntimicrobianos').val())) {
      //     alerta2('info', '', 'Selecciona el servicio.');
      //     return false
      // }

      if (isEmpty($("#txtFechaInicioAntimicrobianos").val())) {
        alerta2("info", "", "Ingresa la fecha de inicio.");
        return false;
      }

      //if (isEmpty($('#txtHoraInicioPsicotropicos').val())) {
      //    alerta2('info', '', 'Ingresa la hora de inicio.');
      //    return false
      //}

      if (isEmpty($("#txtFechaFinAntimicrobianos").val())) {
        alerta2("info", "", "Ingresa la fecha final.");
        return false;
      }

      //if (isEmpty($('#txtHoraFinPsicotropicos').val())) {
      //    alerta2('info', '', 'Ingresa la hora final.');
      //    return false
      //}

      if (
        $("#txtFechaInicioAntimicrobianos").val() >
        $("#txtFechaFinAntimicrobianos").val()
      ) {
        alerta2(
          "info",
          "",
          "La fecha de inicio debe ser menor o igual a la fecha final.",
        );
        return false;
      }

      //if ($('#txtFechaInicioAntimicrobianos').val() > $('#txtFechaFinAntimicrobianos').val()) {
      //    alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
      //    return false
      //}

      let formData = new FormData();
      formData.append("idFarmacia", $("#cboFarmaciaAntimicrobianos").val());
      formData.append("idServicio", $("#cboServicioAntimicrobianos").val());
      formData.append("fechaInicio", $("#txtFechaInicioAntimicrobianos").val());
      //formData.append('horaInicio', $("#txtHoraInicioPsicotropicos").val());
      formData.append("fechaFin", $("#txtFechaFinAntimicrobianos").val());
      //formData.append('horaFin', $("#txtHoraFinPsicotropicos").val());
      formData.append(
        "farmacia",
        $("#cboFarmaciaAntimicrobianos option:selected").text(),
      );
      formData.append(
        "servicio",
        $("#cboServicioAntimicrobianos option:selected").text(),
      );

      Cargando(1);

      fetch(
        "/ReportesFarmacia/rptListarAntimicrobianosFarmacia?area=Farmacia",
        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => {
          if (response.status === 204) {
            alerta2("info", "", "No existen datos para descargar.");
            Cargando(0);
            return;
          }
          return response.blob();
        })
        .then((blob) => {
          if (isEmpty(blob) == false) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "ReporteAntimicrobianos.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            alerta2("success", "", "La descarga se realizo con exito.");
            Cargando(0);
          }
        })
        .catch((e) => {
          alerta2(
            "danger",
            "",
            "Error al descargar documento, intente nuevamente.",
          );
          Cargando(0);
        });
    });

    $("#btnCerrarReporteAntimicrobianos").on("click", () => {
      $("#cboFarmaciaAntimicrobianos").val("0");
      $("#cboTipoServicioAntimicrobianos").val("");
      $("#cboServicioAntimicrobianos").empty();
      $("#cboServicioAntimicrobianos").val("");
      $("#txtFechaInicioAntimicrobianos").datepicker("setDate", fechaP);
      //$("#txtHoraInicioPsicotropicos").val("00:00");
      $("#txtFechaFinAntimicrobianos").datepicker("setDate", fechaP);
      //$("#txtHoraFinPsicotropicos").val("23:59");
      $(".chzn-select").chosen().trigger("chosen:updated");

      $("#modalReporteAntimicrobianos").modal("hide");
    });

    $("#cboTipoServicioAntimicrobianos").on("change", async () => {
      let filtro = ` (${$("#cboTipoServicioAntimicrobianos").val()}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`;
      await ReportesFarmacia.ListarServicioPorFiltro(
        filtro,
        "#cboServicioAntimicrobianos",
      );
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    $("#btnCerrarReporteMovimientoEntradaSalida").on("click", () => {
      $("#modalReporteMovimientoEntradaSalida").modal("hide");
    });
  },

  //////////////////////////////KHOYOSI////////////////////////////////////////////////////////////////
  ListarUsuarioFarmaciaConsumoServicio: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/ListarUsuarioFarmaciaConsumoServicio?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboUsuarioConsumoServicio").empty();
        $("#cboUsuarioConsumoServicio").append(
          '<option value="0">---------------Todos---------------</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboUsuarioConsumoServicio").append(
            '<option value="' +
              obj.idEmpleado +
              '">' +
              obj.usuario +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  EmpleadosSeleccionarTodos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/EmpleadosSeleccionarTodos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboVendedorFajo").empty();
        $("#cboVendedorRegistroVentas").empty();
        $("#cboVendedorFarm").empty();
        $("#cboVendedorFajo").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $("#cboVendedorRegistroVentas").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $("#cboVendedorFarm").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboVendedorFajo").append(
            '<option value="' +
              obj.idEmpleado +
              '">' +
              obj.dEmpleado +
              "</option>",
          );
          $("#cboVendedorRegistroVentas").append(
            '<option value="' +
              obj.idEmpleado +
              '">' +
              obj.dEmpleado +
              "</option>",
          );
          $("#cboVendedorFarm").append(
            '<option value="' +
              obj.idEmpleado +
              '">' +
              obj.dEmpleado +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  CajaCajaSeleccionarTodos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/CajaCajaSeleccionarTodos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboCajaRegistroVentas").empty();
        $("#cboCajaRegistroVentas").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboCajaRegistroVentas").append(
            '<option value="' +
              obj.idCaja +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  CajaTurnoSeleccionarTodos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/CajaTurnoSeleccionarTodos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboTurnoRegistroVentas").empty();
        $("#cboTurnoRegistroVentas").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboTurnoRegistroVentas").append(
            '<option value="' +
              obj.idTurno +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  CajerosSeleccionarTodos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/CajerosSeleccionarTodos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboCajeroRegistroVentas").empty();
        $("#cboCajeroRegistroVentas").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboCajeroRegistroVentas").append(
            '<option value="' +
              obj.idEmpleado +
              '">' +
              obj.dCajero +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  CajaTiposComprobanteSeleccionarTodos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/ReportesFarmacia/CajaTiposComprobanteSeleccionarTodos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.data)) {
        $("#cboComprobanteRegistroVentas").empty();
        $("#cboComprobanteRegistroVentas").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.data.table).each(function (i, obj) {
          $("#cboComprobanteRegistroVentas").append(
            '<option value="' +
              obj.idTipoComprobante +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  CargarComboFarmacias() {
    let filtroFarmacia =
      "idTipoLocales='F' and idtipoSuministro='01' and idEstado=1";
    var dataFiltroFarmacia = new FormData();
    dataFiltroFarmacia.append("filtro", filtroFarmacia);
    $.ajax({
      method: "POST",
      url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
      data: dataFiltroFarmacia,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboAlmacenFajo").empty();
        $("#cboFarmaciaRecetaPorServicio").empty();
        $("#cboFarmaciaRegistroVentas").empty();
        $("#cboFarmaciaConsumoPorServicio").empty();
        $("#cboFarmaciaPsicotropicos").empty();
        $("#cboFarmaciaAntimicrobianos").empty();
        $("#cboAlmacenOrigen").empty();
        $("#cboAlmacenDestino").empty();

        $("#cboFarmaciaPsicotropicos").append(
          '<option  value="0">Todos</option>',
        );
        $("#cboFarmaciaAntimicrobianos").append(
          '<option  value="0">Todos</option>',
        );

        $("#cboAlmacenOrigen").append('<option  value="0">Todos</option>');
        $("#cboAlmacenDestino").append('<option  value="0">Todos</option>');
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboAlmacenFajo").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboFarmaciaRecetaPorServicio").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboFarmaciaRegistroVentas").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboFarmaciaConsumoPorServicio").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboFarmaciaPsicotropicos").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboFarmaciaAntimicrobianos").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );

          $("#cboAlmacenOrigen").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
          $("#cboAlmacenDestino").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $("#cboAlmacenFajo").val("");
        $("cboAlmacen").val("");
        $("#cboFarmaciaRecetaPorServicio").val("");
        $("#cboFarmaciaRegistroVentas").val("");
        $("#cboFarmaciaConsumoPorServicio").val("");
        $("#cboFarmaciaPsicotropicos").val("0");
        $("#cboFarmaciaAntimicrobianos").val("0");

        $("#cboAlmacenOrigen").val("0");
        $("#cboAlmacenDestino").val("0");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar farmacias!", "2");
      },
    });

    $(".chzn-select").chosen().trigger("chosen:updated");
  },
  async CargarComboAlmacenes() {
    Cargando(1);

    var respuesta;
    let datos;

    try {
      datos = await $.ajax({
        method: "POST",
        url: "/Kardex/ListarTodosAlmacenMenosExternos?area=Farmacia",
        data: null,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      if (datos.table.length > 0) {
        $("#cboAlmacen").empty();
        $(datos.table).each(function (i, obj) {
          $("#cboAlmacen").append(
            '<option value="' +
              obj.idAlmacen +
              '" alt="' +
              obj.idTipoSuministro +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        $("#cboAlmacen").val("");
        $(".chzn-select").chosen().trigger("chosen:updated");
        Cargando(0);
      } else {
        Cargando(0);
        respuesta = {};
      }
    } catch (error) {
      Cargando(0);
      //console.error(error)
      alerta(3, error);
    }
  },
  CargarComboFarmaciaConcepto() {
    $.ajax({
      method: "POST",
      url: "/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos",
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboConcepto").empty();

        $("#cboConcepto").append(
          '<option  value="0">Seleccione Concepto</option>',
        );
        $(datos).each(function (i, obj) {
          $("#cboConcepto").append(
            '<option  value="' + obj.id + '">' + obj.nombre + "</option>",
          );
        });
        $("#cboConcepto").val("0");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar farmacias!", "2");
      },
    });

    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  CargarComboFarmaciasAlmacenes() {
    let filtroFarmacia =
      "idTipoLocales IN ('F','A') and idtipoSuministro='01' and idEstado=1";
    var dataFiltroFarmacia = new FormData();
    dataFiltroFarmacia.append("filtro", filtroFarmacia);
    $.ajax({
      method: "POST",
      url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
      data: dataFiltroFarmacia,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboFarmaciaTotalVentas").empty();
        $("#cboFarmaciaTotalVentas").append(
          '<option  value="0">Todos</option>',
        );
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboFarmaciaTotalVentas").append(
            '<option  value="' +
              obj.idAlmacen +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });

        $("#cboFarmaciaTotalVentas").val("");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar farmacias y almacenes!", "2");
      },
    });

    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  async CargarComboFarmaciasICIIDI(idTipoLocales, idtipoSuministro) {
    let filtroFarmacia = `idTipoLocales='${idTipoLocales}' and idtipoSuministro='${idtipoSuministro}' and idEstado=1`;
    var dataFiltroFarmacia = new FormData();
    dataFiltroFarmacia.append("filtro", filtroFarmacia);
    datos = await $.ajax({
      method: "POST",
      url: "/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia",
      data: dataFiltroFarmacia,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
    });

    if (datos.lstData.table.length > 0) {
      return datos.lstData.table;
    } else {
      return null;
    }
    $(".chzn-select").chosen().trigger("chosen:updated");
  },

  async TipoFinanciamientosDevuelveSoloFarmacia(Filtro) {
    let dataFiltroFarmacia = new FormData();
    dataFiltroFarmacia.append("Filtro", Filtro);

    try {
      Cargando(1);

      datos = await $.ajax({
        method: "POST",
        url: "/Farmacias/TipoFinanciamientosDevuelveSoloFarmacia?area=Farmacia",
        data: dataFiltroFarmacia,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (datos.lstData.table.length > 0) {
        $("#cboProductoPlanFajo").empty();
        $("#cboProductoPlanFajo").append(
          '<option value="0">Seleccionar opción</option>',
        );
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboProductoPlanFajo").append(
            '<option  value="' +
              obj.idTipoFinanciamiento +
              '">' +
              obj.descripcion +
              "</option>",
          );
        });
        //resp = datos.lstData.table[0];
      }
    } catch (error) {
      alerta2("danger", "", error.toString());
    }
  },

  async DevuelveServiciosDelHospitalFiltro(filtro) {
    var dataFiltro = new FormData();
    dataFiltro.append("Filtro", filtro);
    $.ajax({
      method: "POST",
      url: "/Farmacias/DevuelveServiciosDelHospitalFiltro?area=Farmacia",
      data: dataFiltro,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboServicioFajo").empty();

        $("#cboServicioFajo").append(
          '<option value="' + 0 + '">Seleccione una opción</option>',
        );
        $(datos.lstData.table).each(function (i, obj) {
          $("#cboServicioFajo").append(
            '<option value="' +
              obj.idServicio +
              '">' +
              obj.dservicioHosp +
              "</option>",
          );
        });

        $(".chzn-select").chosen().trigger("chosen:updated");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar farmacias!", "2");
      },
    });
  },

  async ListarServicioPorFiltro(filtro, idCboServicio) {
    var dataFiltro = new FormData();
    dataFiltro.append("Filtro", filtro);
    $.ajax({
      method: "POST",
      url: "/Farmacias/DevuelveServiciosDelHospitalFiltro?area=Farmacia",
      data: dataFiltro,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $(idCboServicio).empty();

        $(idCboServicio).append('<option value=""></option>');
        $(idCboServicio).append('<option value="0">Todos</option>');
        $(datos.lstData.table).each(function (i, obj) {
          $(idCboServicio).append(
            '<option value="' +
              obj.idServicio +
              '">' +
              obj.servicio +
              "</option>",
          );
        });

        $(".chzn-select").chosen().trigger("chosen:updated");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar servicios!", "2");
      },
    });
  },

  async CargarTiposPsicotropicos(filtro) {
    var dataFiltro = new FormData();

    $.ajax({
      method: "POST",
      url: "/Farmacias/ListarTiposPsicotropicos?area=Farmacia",
      data: null,
      dataType: "json",
      async: false,
      cache: false,
      processData: false,
      contentType: false,
      success: function (datos) {
        $("#cboTipoPsicotropicos").empty();

        $("#cboTipoPsicotropicos").append(
          '<option value="' + 0 + '">Seleccione una opción</option>',
        );
        $(datos.table).each(function (i, obj) {
          $("#cboTipoPsicotropicos").append(
            '<option value="' + obj.tipo + '">' + obj.descripcion + "</option>",
          );
        });

        $(".chzn-select").chosen().trigger("chosen:updated");
      },
      error: function (msg) {
        alerta("ERROR", "Error listar farmacias!", "2");
      },
    });
  },

  //////////////////////////////KHOYOSI////////////////////////////////////////////////////////////////
  ListarMedicos: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/Utilitario/ListarMedicos?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.dataSet)) {
        $("#cboUsuarioRecetasMedicas").empty();
        $("#cboUsuarioRecetasMedicas").append(
          '<option value="0">---------------Todos---------------</option>',
        );
        $(datos.dataSet.table).each(function (i, obj) {
          if (obj.idMedico > 0) {
            $("#cboUsuarioRecetasMedicas").append(
              '<option value="' +
                obj.idMedico +
                '">' +
                obj.medico +
                "</option>",
            );
          }
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },

  ListarEstadosRecetas: async () => {
    //var formData = new FormData();
    let datos;
    let resp = null;
    try {
      Cargando(1);
      datos = await $.ajax({
        method: "POST",
        url: "/Utilitario/ListarEstadosRecetas?area=Comun",
        data: null,
        //dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
      });
      Cargando(0);
      if (!isEmpty(datos.dataSet)) {
        $("#cboEstadoRecetasMedicas").empty();
        $("#cboEstadoRecetasMedicas").append(
          '<option value="-1">---------------Todos---------------</option>',
        );
        $(datos.dataSet.table).each(function (i, obj) {
          $("#cboEstadoRecetasMedicas").append(
            '<option value="' + obj.idEstado + '">' + obj.estado + "</option>",
          );
        });
        $(".chzn-select").chosen().trigger("chosen:updated");
      } else {
        resp = null;
      }
      //console.log(datos);
    } catch (error) {
      //console.error(error)
      Cargando(0);
      alerta(3, error);
    }

    return resp;
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};

$(document).ready(() => {
  ReportesFarmacia.Plugins();

  ReportesFarmacia.InitDatablesICI_MGP();

  ReportesFarmacia.InitDatablesICI();
  ReportesFarmacia.InitDatablesICIDonaciones();

  ReportesFarmacia.InitDatablesIDI();
  ReportesFarmacia.InitDatablesIDIDonaciones();

  ReportesFarmacia.InitDatablesSaldosPorAlmacenConFechaCorte();

  ReportesFarmacia.Events();

  ReportesFarmacia.ListarUsuarioFarmaciaConsumoServicio();
  ReportesFarmacia.EmpleadosSeleccionarTodos();

  ReportesFarmacia.ListarMedicos();
  ReportesFarmacia.ListarEstadosRecetas();

  ReportesFarmacia.CargarComboFarmacias();
  ReportesFarmacia.CargarComboAlmacenes();
  ReportesFarmacia.CargarComboFarmaciaConcepto();
  ReportesFarmacia.CargarComboFarmaciasAlmacenes();

  ReportesFarmacia.CajaTurnoSeleccionarTodos();
  ReportesFarmacia.CajaCajaSeleccionarTodos();
  ReportesFarmacia.CajerosSeleccionarTodos();
  ReportesFarmacia.CajaTiposComprobanteSeleccionarTodos();

  ReportesFarmacia.CargarTiposPsicotropicos();

  ReportesFarmacia.TipoFinanciamientosDevuelveSoloFarmacia(
    " and dbo.TiposFinanciamiento.esFuenteFinanciamiento=1",
  );

  $("#cboTipoReporteICI").trigger("change");
  $("#cboTipoReporteIDI").trigger("change");
  $("#cboTipoServFajo").trigger("change");
  $(".chzn-select").chosen().trigger("chosen:updated");

  /*$("#rdbConsolidadoIngresoSalida").on("click", () => {
    $("#btnIngresoDetalle").prop("disabled", true);
    $("#fsFiltros select").prop("disabled", false).trigger("chosen:updated");
    $("#fsFiltros").prop("disabled", false);
  });

  $("#rdbDetalleIngresos").on("click", () => {
    $("#fsFiltros").prop("disabled", true);
    $("#fsFiltros select").prop("disabled", true).trigger("chosen:updated");
    $("#btnIngresoDetalle").prop("disabled", false);
  });*/

  $("#btnGenerarReporteMovimientoEntradaSalida").on("click", () => {
    console.log("Hola :V");
  });

  $("#cboTipoMovimientoAlmacen").on("change", function () {
    let tipo = $(this).val();

    if (tipo === "1") {
      $("#dboAlmacenDestino").prop("disabled", false);
      $("#cboAlmacenDestino").prop("disabled", true);
    } else if (tipo === "2") {
      $("#dboAlmacenDestino").prop("disabled", true);
      $("#cboAlmacenDestino").prop("disabled", false);
    } else {
      $("#dboAlmacenDestino").prop("disabled", true);
      $("#cboAlmacenDestino").prop("disabled", true);
    }
    $(".chzn-select").trigger("chosen:updated");
  });
});
