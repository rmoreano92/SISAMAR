import { EstadoCuenta } from "./EstadoCuenta/EstadoCuenta.js";


$(document).ready(function () {
    const estadoCuenta = new EstadoCuenta();

    estadoCuenta.init()
})



// let EstadoCuenta = {

//     idAreaLabora: 0,
//     idUsuarioConPermisoEnSISoEXOoSOATconf: 0,
//     idTipoFinanciamiento: 0,
//     idPagosACuenta: 0,
//     idDevoluciones: 0,

//     IdCuentaAtencion: 0,
//     IdPaciente: 0,
//     IdEstadoCuentaAtencion: 0,
//     VecesAbierto: 0,

//     async Plugins() {
//         let FechaHora = await Utilitario.FechaHoraServidor();        
//         let FechaDia = FechaHora.substring(0, 10);

//         let fechaDividida = FechaDia.split('/'); // partes[0]=día, partes[1]=mes, partes[2]=año

//         // Construir el primer día del mes
//         let primerDiaDelMes = `01/${fechaDividida[1]}/${fechaDividida[2]}`;

//         $('.maskFecha').datepicker({
//             todayHighlight: true,
//             autoclose: true,
//             orientation: "bottom"
//         });

//         $("#txtFechaIngresoBusq").datepicker("setDate", primerDiaDelMes);
//         $("#txtFechaHastaBusq").datepicker("setDate", FechaDia);

//         $.mask.definitions['D'] = '[0123]';
//         $.mask.definitions['d'] = '[123456789]';
//         $.mask.definitions['M'] = '[01]';
//         $.mask.definitions['m'] = '[0123456789]';
//         $.mask.definitions['a'] = '[12]';
//         $.mask.definitions['b'] = '[0123456789]';
//         $.mask.definitions['c'] = '[0123456789]';
//         $.mask.definitions['d'] = '[0123456789]';
//         $(".maskFecha").mask("Dd/Mm/abcd");


//         $.mask.definitions['H'] = '[012]';
//         $.mask.definitions['N'] = '[012345]';
//         $.mask.definitions['n'] = '[0123456789]';
//         $(".maskHora").mask("Hn:Nn");

//         $(".chzn-select").chosen({ allow_single_deselect: true });
//         $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
//     },

//     DataTableServicios: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": false,
//             "ordering": false,
//             "info": false,
//             scrollY: '45vh',
//             responsive: false,

//             scrollX: true,
//             autoWidth: false,
//             destroy: true,
//             columns: [
//                 {
//                     data: "fechaCreacion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).text(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)

//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             return FormatearFecha(row.fechaCreacion) + ' ' + row.horaCreacion

//                         }
//                     }
//                 },
//                 {
//                     data: "desPuntoCarga",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroDocumento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "codigo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombre",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidad",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "precioUnitario",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subTotal",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 { // Solo se meustra si es paciente sis
//                     data: "cantidadFinanciadaSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             if (EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
//                                 return `<input class="input-table input-table-cantidad-sis solo-numero" value="${data}">`;
//                             } else {
//                                 return data;
//                             }

//                         }
//                     }
//                 },
//                 { // Solo se meustra si es paciente sis
//                     data: "precioFinanciadoSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
//                     }
//                 },
//                 {
//                     data: "totalFinanciadoSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "totalFinanciadoSoat",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "importeExonera",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, !(EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2))
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             if (EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 9 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
//                                 return `<input class="input-table input-table-exonera solo-decimal" value="${data}">`;
//                             } else {
//                                 return data;
//                             }

//                         }
//                     }
//                 },
//                 {
//                     data: "usuarioExonera",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidadPagar",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "totalPagar",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidadDevuelta",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "estadosFacturacion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "docReembolso",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servInternamiento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "idOrden",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroComprobante",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "dfinanciamiento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "descripcionPorItem",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "movNumero",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "movtipo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servicioEstancia",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "idOrdenPago",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaDespacho",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).text(FormatearFecha(rowData.fechaDespacho) + ' ' + rowData.horaDespacho)
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             return FormatearFecha(row.fechaDespacho) + ' ' + row.horaDespacho

//                         }
//                     }
//                 },

//             ],

//             createdRow: function (row, data, dataIndex) {
//                 if (data.idProducto == EstadoCuenta.idPagosACuenta) {
//                     $(row).css('color', '#189fff');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == EstadoCuenta.idDevoluciones) {
//                     $(row).css('color', '#2dc71b');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == 4692) {
//                     $(row).css('color', '#H16CD32');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == 4693) {
//                     $(row).css('color', '#H3049FA');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.cantidadPagar > 0 && data.idTipoFinanciamiento == 2) {
//                     $(row).css('color', '#FF00FF');
//                     $(row).css('font-weight', 'bold');
//                 }
//             }
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableServicios = $("#tblServicios").dataTable(parms);

//         oTable_TableServicios.fnAdjustColumnSizing();
//     },
//     DataTableFarmacia: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": false,
//             "ordering": false,
//             "info": false,
//             scrollY: '45vh',
//             responsive: false,

//             scrollX: true,
//             autoWidth: false,
//             destroy: true,
//             columns: [
//                 {
//                     data: "fechaCreacion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).text(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)

//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             return FormatearFecha(row.fechaCreacion) + ' ' + row.horaCreacion

//                         }
//                     }
//                 },
//                 {
//                     data: "desPuntoCarga",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroDocumento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "codigo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombre",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidad",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "precioUnitario",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subTotal",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 { // Solo se meustra si es paciente sis
//                     data: "cantidadFinanciadaSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             if (EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2) {
//                                 return `<input class="input-table input-table-cantidad-sis solo-numero" value="${data}">`;
//                             } else {
//                                 return data;
//                             }

//                         }
//                     }
//                 },
//                 { // Solo se meustra si es paciente sis
//                     data: "precioFinanciadoSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
//                     }
//                 },
//                 {
//                     data: "totalFinanciadoSis",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "totalFinanciadoSoat",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "importeExonera",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         oTable_TableServicios.fnSetColumnVis(col, !(EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 2))
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             if (EstadoCuenta.idUsuarioConPermisoEnSISoEXOoSOATconf == 9 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
//                                 return `<input class="input-table input-table-exonera solo-decimal" value="${data}">`;
//                             } else {
//                                 return data;
//                             }

//                         }
//                     }
//                 },
//                 {
//                     data: "usuarioExonera",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidadPagar",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "totalPagar",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "cantidadDevuelta",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "estadosFacturacion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "docReembolso",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servInternamiento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "idOrden",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroComprobante",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "dfinanciamiento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "descripcionPorItem",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "movNumero",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "movtipo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servicioEstancia",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "idOrdenPago",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaDespacho",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).text(FormatearFecha(rowData.fechaDespacho) + ' ' + rowData.horaDespacho)
//                     },
//                     render: function (data, type, row, meta) {
//                         if (type === 'display') {
//                             return FormatearFecha(row.fechaDespacho) + ' ' + row.horaDespacho

//                         }
//                     }
//                 },

//             ],

//             createdRow: function (row, data, dataIndex) {
//                 if (data.idProducto == EstadoCuenta.idPagosACuenta) {
//                     $(row).css('color', '#189fff');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == EstadoCuenta.idDevoluciones) {
//                     $(row).css('color', '#2dc71b');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == 4692) {
//                     $(row).css('color', '#H16CD32');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.idProducto == 4693) {
//                     $(row).css('color', '#H3049FA');
//                     $(row).css('font-weight', 'bold');
//                 } else if (data.cantidadPagar > 0 && data.idTipoFinanciamiento == 2) {
//                     $(row).css('color', '#FF00FF');
//                     $(row).css('font-weight', 'bold');
//                 }
//             }
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableFarmacia = $("#tblFarmacia").dataTable(parms);
//     },
//     DataTableConsolidado: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": false,
//             "ordering": false,
//             "info": false,
//             scrollY: '45vh',
//             responsive: false,

//             scrollX: true,
//             autoWidth: false,
//             destroy: true,
//             columns: [
//                 {
//                     data: "puntoCarga",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaCreacion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)
//                     }
//                 },
//                 {
//                     data: "nroDocumento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servicioEstancia",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "totalPagar",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: null,
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html("")
//                     }
//                 },

//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableConsolidado = $("#tblConsolidado").dataTable(parms);
//     },
//     DataTableReembolso: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": false,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "codigo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombreMinsa",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombreMinsa",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },

//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableReembolso = $("#tblReembolso").dataTable(parms);
//     },
//     DataTableFarmaciaDonaciones: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": false,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "codigo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombreMinsa",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nombreMinsa",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "subGrupo",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },

//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableFarmaciaDonaciones = $("#tblFarmaciaDonaciones").dataTable(parms);
//     },
//     DataTableListaPacientes: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "idCuentaAtencion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoPaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoMaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "primerNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "segundoNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroHistoriaClinica",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "t_Financiamiento",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "estadoPlan",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "ultimoServicio",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "plan",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "horaIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaEgreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "horaEgreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fecNacim",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html(FormatearFecha(rowData.fecNacim));
//                     }
//                 },
//                 {
//                     data: "edad",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },

//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaPacientes = $("#tblListaPacientes").dataTable(parms);
//     },
//     DataTableListaPacientesPreventas: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "nroOrdenPago",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "pto_Carga",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaCreacion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "idOrden",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroHistoriaClinica",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoPaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoMaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "primerNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "segundoNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaPacientesPreventas = $("#tblListaPacientesPreventas").dataTable(parms);
//     },
//     DataTableListaPacientesExoFarmacia: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "nroDocumento",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "tipo Doc",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaCreacion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "farmacia",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroMovimiento",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 }
//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaPacientesExoFarmacia = $("#tblListaPacientesExoFarmacia").dataTable(parms);
//     },
//     DataTableListaPacientesExternos: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "idCuentaAtencion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoPaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoMaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "primerNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "segundoNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroHistoriaClinica",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "plan",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "estadoPlan",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "ultimoServicio",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },

//                 {
//                     data: "fechaIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "horaIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fecNacim",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html(FormatearFecha(rowData.fecNacim));
//                     }
//                 },
//                 {
//                     data: "edad",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },

//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaPacientesExternos = $("#tblListaPacientesExternos").dataTable(parms);
//     },
//     DataTableListaPacientesBusqueda: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "apellidoPaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "apellidoMaterno",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "primerNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "segundoNombre",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroHistoriaClinica",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "nroDocumento",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fecNacimiento",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "tipoServicio",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servicioIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 }
//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaPacientesBusqueda = $("#tblListaPacientesBusqueda").dataTable(parms);
//     },
//     DataTableListaCuentasPacientesBusqueda: function () {
//         var parms = {
//             "paging": false,
//             "bFilter": true,
//             "ordering": false,
//             "info": false,
//             "scrollX": true,
//             scrollY: '45vh',
//             columns: [
//                 {
//                     data: "idCuentaAtencion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "estadoCuenta",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "fechaIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html(FormatearFecha(rowData.fechaIngreso))
//                     }
//                 },
//                 {
//                     data: "fechaEgreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html(FormatearFecha(rowData.fechaEgreso))
//                     }
//                 },
//                 {
//                     data: "horaEgreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "servicioIngreso",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "descripcion",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: "edad",
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                     }
//                 },
//                 {
//                     data: null,
//                     width: "10%",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr('align', 'left')
//                         $(td).html('')
//                     }
//                 }
//             ]
//         }

//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_TableListaCuentasPacientesBusqueda = $("#tblListaCuentasPacientesBusqueda").dataTable(parms);
//     },



//     AtencionesListaCuentasXpaciente: async function () {
//         Cargando(1);

//         let formData = new FormData();

//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);

//         const res = await HttpClient.Post('/EstadoCuenta/AtencionesListaCuentasXpaciente?area=Comun', formData);

//         $('#cboSeleccionarCuenta').empty();

//         if (isEmpty(res.data)) {
//             alerta(2, 'Error al listar las fuentes de financiamiento')
//             return
//         }
//         $(res.data.table).each(function (i, obj) {

//             $('#cboSeleccionarCuenta').append(`<option value="${obj.idCuentaAtencion}">${obj.datosCuenta}</option>`)
//         })
//         $('#cboSeleccionarCuenta').val(0)
//         $('.chzn-select').chosen().trigger("chosen:updated")

//         Cargando(0)
//     },
//     FuentesFinanciamientoSegunFiltro: async function (lcFiltro) {
//         Cargando(1);

//         let formData = new FormData();

//         formData.append('lcFiltro', lcFiltro);

//         const res = await HttpClient.Post('/Utilitario/FuentesFinanciamientoSegunFiltro?area=Comun', formData);

//         $('#cboFuenteFinancimiento').empty();

//         if (isEmpty(res.data)) {
//             alerta(2, 'Error al listar las fuentes de financiamiento')
//             return
//         }
//         $(res.data.table).each(function (i, obj) {

//             $('#cboFuenteFinancimiento').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
//         })
//         $('#cboFuenteFinancimiento').val(0)
//         $('.chzn-select').chosen().trigger("chosen:updated")

//         Cargando(0)
//     },
//     TiposFinanciamientosTarifaSeleccionarPorPlan: async function (idFuenteFinanciamiento) {
//         Cargando(1);

//         let formData = new FormData();

//         formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

//         const res = await HttpClient.Post('/Utilitario/TiposFinanciamientosTarifaSeleccionarPorPlan?area=Comun', formData);

//         $('#cboProductoPlan').empty();

//         if (isEmpty(res.data)) {
//             alerta(2, 'Error al listar el producto plan')
//             return
//         }
//         $(res.data.table).each(function (i, obj) {
//             $('#cboProductoPlan').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
//         })

//         $('#cboProductoPlan').val(0)


//         $('.chzn-select').chosen().trigger("chosen:updated")

//         Cargando(0)
//     },
//     DevuelveSubAreaDondeLaboraElUsuarioDelSistema: async function (idLaboraArea) {
//         let formData = new FormData();
//         formData.append('idLaboraArea', idLaboraArea);

//         let areaLabora = await HttpClient.Post("/Empleados/DevuelveSubAreaDondeLaboraElUsuarioDelSistema?area=Seguridad", formData)

//         if (areaLabora.lstData.table.length <= 0) {
//             return 0
//         }

//         return areaLabora.lstData.table[0].idLaboraSubArea
//     },
//     TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta: async function (IdtipoFinanciamiento) {
//         let formData = new FormData();
//         formData.append('IdtipoFinanciamiento', IdtipoFinanciamiento);

//         let res = await HttpClient.Post("/EstadoCuenta/TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta?area=Seguridad", formData)

//         if (res.data.table.length <= 0) {
//             return 0
//         }

//         return res.data.table[0]
//     },
//     ConfiguraPermisosUsuario: async function (IdtipoFinanciamiento) {
//         let TrabajaEstadosCuenta = await EstadoCuenta.TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(IdtipoFinanciamiento)
//         EstadoCuenta.idAreaLabora = await this.DevuelveSubAreaDondeLaboraElUsuarioDelSistema(4)


//         if ((EstadoCuenta.idAreaLabora == TrabajaEstadosCuenta.generaPago) || (EstadoCuenta.idAreaLabora == 9 && TrabajaEstadosCuenta.generaPago == 1)) {
//             this.idUsuarioConPermisoEnSISoEXOoSOATconf = EstadoCuenta.idAreaLabora

//             if (this.idUsuarioConPermisoEnSISoEXOoSOATconf == 9) {
//                 $('#thImpExoServicios').attr('style', 'background: red !important')
//                 $('.contExoneracion').show()
//                 $('#btnActualizaExoneracionSis').html('<i class="fa fa-file mb-1" style="font-size: 20px;"></i> <br /> ACTUALIZA EXONERACIONES')
//             } else if (this.idUsuarioConPermisoEnSISoEXOoSOATconf == 2 && IdtipoFinanciamiento == 2) {
//                 $('.tb-header-sis').attr('style', 'background: red !important')
//                 $('.contTodosNingunoSis').show()
//                 $('.contExoneracion').show()
//                 $('#btnActualizaExoneracionSis').html('<i class="fa fa-file mb-1" style="font-size: 20px;"></i> <br /> ACTUALIZA SIS')

//             }
//         } else {
//             this.idUsuarioConPermisoEnSISoEXOoSOATconf = 0
//         }
//     },




//     PacientesFiltrarTodosSoloHistorias: async function () {
//         Cargando(1)

//         let formData = new FormData()

//         let idDocIdentidad = ''

//         if ($('#txtDniPacienteBusqueda').val().length == 8) {
//             idDocIdentidad = 1
//         } else if ($('#txtDniPacienteBusqueda').val().length == 9) {
//             idDocIdentidad = 2
//         }


//         formData.append("nroHistoriaClinica", $('#txtNroHistoriaPacienteBusqueda').val())
//         formData.append("apellidoPaterno", $('#txtApPaternoPacienteBusqueda').val())
//         formData.append("apellidoMaterno", $('#txtApMaternoPacienteBusqueda').val())
//         formData.append("primerNombre", $('#txtPrimerNombrePacienteBusqueda').val())
//         formData.append("segundoNombre", '')
//         formData.append("idDocIdentidad", idDocIdentidad)
//         formData.append("nroDocumento", $('#txtDniPacienteBusqueda').val())

//         oTable_TableListaPacientesBusqueda.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/PacientesFiltrarTodosSoloHistorias`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             Cargando(0)
//             return false
//         }

//         let data = response.data.table

//         oTable_TableListaPacientesBusqueda.fnAddData(data)

//         Cargando(0)
//     },
//     AtencionesSeleccionarPorTipoServicio: async function () {
//         Cargando(1)

//         let formData = new FormData()

//         formData.append("idTipoServicio", $('input[name="rdbTipoBusqueda"]:checked').val());
//         formData.append("FechaIni", $('#txtFechaIngresoBusq').val());
//         formData.append("FechaFin", $('#txtFechaHastaBusq').val());

//         oTable_TableListaPacientes.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/AtencionesSeleccionarPorTipoServicio`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             Cargando(0)
//             return false
//         }

//         let data = response.data.table

//         oTable_TableListaPacientes.fnAddData(data)

//         Cargando(0)
//     },

//     FactOrdenServicioPreventasServicio: async function () {
//         Cargando(1)

//         let formData = new FormData()

//         formData.append("FechaInicio", $('#txtFechaIngresoBusq').val());
//         formData.append("FechaFin", $('#txtFechaHastaBusq').val());

//         oTable_TableListaPacientesPreventas.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/FactOrdenServicioPreventasServicio`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             Cargando(0)
//             return false
//         }

//         let data = response.data.table

//         oTable_TableListaPacientesPreventas.fnAddData(data)

//         Cargando(0)
//     },

//     farmMovimientoVentasExoneracionesEnFarmacia: async function () {
//         Cargando(1)

//         let formData = new FormData()

//         formData.append("FechaInicio", $('#txtFechaIngresoBusq').val());
//         formData.append("FechaFin", $('#txtFechaHastaBusq').val());

//         oTable_TableListaPacientesExoFarmacia.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/farmMovimientoVentasExoneracionesEnFarmacia`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             Cargando(0)
//             return false
//         }

//         let data = response.data.table

//         oTable_TableListaPacientesExoFarmacia.fnAddData(data)

//         Cargando(0)
//     },

//     AtencionesSeleccionarPacExtPorFechas: async function () {
//         Cargando(1)

//         let formData = new FormData()

//         formData.append("ldFechaIni", $('#txtFechaIngresoBusq').val());
//         formData.append("ldFechaFin", $('#txtFechaHastaBusq').val());

//         oTable_TableListaPacientesExternos.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/AtencionesSeleccionarPacExtPorFechas`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             Cargando(0)
//             return false
//         }

//         let data = response.data.table

//         oTable_TableListaPacientesExternos.fnAddData(data)

//         Cargando(0)
//     },

//     AtencionesFiltraDatosCabecera: async function (IdCuentaAtencion) {

//         let formData = new FormData()

//         formData.append("IdCuentaAtencion", IdCuentaAtencion);

//         let response = await HttpClient.Post(`/EstadoCuenta/AtencionesFiltraDatosCabecera`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             return false
//         }

//         let data = response.data.table

//         return data

//     },

//     FacturacionServicioDespachoXcuenta: async function (idCuentaAtencion) {

//         let formData = new FormData()

//         formData.append("idCuentaAtencion", idCuentaAtencion);

//         oTable_TableServicios.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/FacturacionServicioDespachoXcuenta`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             return false
//         }

//         let data = response.data.table

//         oTable_TableServicios.fnAddData(data)

//         return data

//     },

//     FarmMovimientoVentasDetalleXcuenta: async function (idCuentaAtencion) {

//         let formData = new FormData()

//         formData.append("idCuentaAtencion", idCuentaAtencion);

//         oTable_TableFarmacia.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/FarmMovimientoVentasDetalleXcuenta`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             return false
//         }

//         let data = response.data.table

//         oTable_TableFarmacia.fnAddData(data)

//         return data

//     },

//     ListarConsolidadoPorEstadoCuenta: async function (idCuentaAtencion) {

//         let formData = new FormData()

//         formData.append("idCuentaAtencion", idCuentaAtencion);

//         oTable_TableConsolidado.fnClearTable()

//         let response = await HttpClient.Post(`/EstadoCuenta/ListarConsolidadoPorEstadoCuenta`, formData)

//         if (isEmpty(response) || response.data.table <= 0) {
//             return false
//         }

//         let data = response.data.table

//         oTable_TableConsolidado.fnAddData(data)

//         return response.data

//     },

//     SolicitarConfirmacionCredenciales: async function () {
//         let verificar = await alertaAsync(
//             '',
//             'Confirmar Usuario',
//             `<label for="txtUsuarioConfirmacion" style="text-align:left; display:block; margin-bottom:15px !important;">Usuario</label>
//             <div class="form-group">
//                 <input type="text" id="txtUsuarioConfirmacion" class="form-control" placeholder="Ingrese usuario" value=${$('#hdIdUsuario').val()} disabled>
//             </div>
            
//             <label for="txtContraseniaConfirmacion" style="text-align:left; display:block; margin-bottom:15px !important;">Contraseña</label>
//             <div class="form-group">
//             <input type="password" id="txtContraseniaConfirmacion" class="form-control" placeholder="Ingrese contraseña">
//             </div>
            
//             `,
//             'Cancelar',
//             async function () {
//                 let password = $('#txtContraseniaConfirmacion').val();
//                 if (!password) {
//                     Swal.showValidationMessage('Debe ingresar una contraseña');
//                     return false; // No cierra
//                 }
//                 return password; // Devuelve password, irá a result.value
//             }
//         );

//         if (verificar.isConfirmed) {

//             let usuario = $('#txtUsuarioConfirmacion').val()
//             let password = $('#txtContraseniaConfirmacion').val()

//             //Cargando(1)

//             let validacion = await EstadoCuenta.ValidarInicioSesion(usuario, password)

//             //Cargando(0)

//             if (validacion.success) {
//                 return true
//             } else {
//                 alerta(2, 'La contraseña no es correcta, intentalo nuevamente.')

//                 return this.SolicitarConfirmacionCredenciales()
//             }

//         } else {
//             return false
//         }
//     },
//     ValidarInicioSesion: async function (usuario, contrasenia) {

//         let formData = new FormData()

//         formData.append("usuario", usuario);
//         formData.append("contrasenia", contrasenia);


//         let response = await HttpClient.Post(`/EstadoCuenta/ValidarInicioSesion`, formData)

//         return response
//     },

//     ValidarPermisoAbrirCuentas: async function () {

//         let formData = new FormData()

//         let response = await HttpClient.Post(`/EstadoCuenta/ValidarPermisoAbrirCuentas`, formData)

//         return response.data.table[0]
//     },
//     PacientesSeleccionarPorId: async function (idPaciente) {

//         let formData = new FormData();

//         formData.append("idPaciente", idPaciente);

//         let res = await HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData);

//         if (!res.estado) {
//             //alerta(3, res.msg);
//             return null;
//         }

//         if (res.data.table?.length) {
//             return res.data.table[0];
//         }
//         return null;

//     },




//     FacturacionCuentasAtencionPagada: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionPagada?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La cuenta paso a estado (PAGADA)`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },
//     FacturacionCuentasAtencionPendientePagoSeguro: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionPendientePagoSeguroEstadoCuenta?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La Cuenta se ha Cerrado correctamente`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },
//     FacturacionCuentasAtencionAbrir: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAbrir?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La Cuenta se ha Abierto correctamente`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },
//     FacturacionCuentasAtencionCerrar: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionCerrar?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La Cuenta se ha Cerrado correctamente`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },
//     FacturacionCuentasAtencionAnulada: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAnulada?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La Cuenta pasó a estado=ANULADA`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },
//     FacturacionCuentasAtencionAltaConDeudaYGarante: async function () {

//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion);
//         formData.append('IdPaciente', EstadoCuenta.IdPaciente);
//         formData.append('IdListItem', ObtenerItemListBar());

//         let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAltaConDeudaYGarante?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]

//         if (data.successNumber == 1) {
//             alerta2('success', '', `La Cuenta pasó a estado=CUENTA CERRADA, PENDIENTE DE PAGO CON GARANTE`)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }
//         return res
//     },


//     GenerarExoneracionCuentaPaciente: async function () {

//         let formData = new FormData()

//         formData.append('IdCuentaAtencion', $('#txtNroCuenta').val())
//         formData.append('lstServicios', JSON.stringify(oTable_TableServicios.api(true).data().toArray()))
//         formData.append('lstFarmacias', JSON.stringify(oTable_TableFarmacia.api(true).data().toArray()))
//         formData.append('IdListBarItem', ObtenerItemListBar())

//         let res = await HttpClient.Post('/EstadoCuenta/GenerarExoneracionCuentaPaciente?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]


//         if (data.successNumber == 1) {
//             alerta2('success', '', data.successMessage)

//             await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }


//     },

//     CambiarFuenteFinancimiento: async function () {

//         let formData = new FormData()

//         formData.append('IdFuenteFinanciamiento', $('#cboFuenteFinancimiento').val())
//         formData.append('IdTipoFinanciamiento', $('#cboProductoPlan').val())
//         formData.append('IdCuentaAtencion', EstadoCuenta.IdCuentaAtencion)

//         formData.append('IdListBarItem', ObtenerItemListBar())

//         let res = await HttpClient.Post('/EstadoCuenta/CambiarFuenteFinancimiento?area=Farmacia', formData)

//         if (!res.success) {
//             alerta2('error', '', res.statusText)
//             return
//         }

//         let data = res.data.table[0]


//         if (data.successNumber == 1) {
//             alerta2('success', '', data.successMessage)

//             await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//         } else {
//             alerta2('error', '', data.errorMessage)
//         }


//     },

//     BuscarEstadoCuentaPacientePorIdCuentaAtencion: async function (idCuentaAtencion) {
//         Cargando(1)
//         let res = await EstadoCuenta.AtencionesFiltraDatosCabecera(idCuentaAtencion)

//         if (isEmpty(res)) {
//             Cargando(0)
//             return
//         }

//         let data = res[0]

//         if (data.idEstado != 1) {
//             alerta2('warning', 'Estado Cuenta', `Fijese el ESTADO de este N° Cuenta [Estado: ${data.estadoCta}] <br> La cuenta se encuentra CERRADA`)
//         }

//         Variables.Cargar(data)

//         EstadoCuenta.IdCuentaAtencion = data.idCuentaAtencion
//         EstadoCuenta.IdPaciente = data.idPaciente
//         EstadoCuenta.idTipoFinanciamiento = data.idTipoFinanciamiento
//         EstadoCuenta.IdEstadoCuentaAtencion = data.idEstado
//         EstadoCuenta.VecesAbierto = data.vecesAbierto

//         let config = await EstadoCuenta.ConfiguraPermisosUsuario(data.idTipoFinanciamiento)

//         let servicios = await EstadoCuenta.FacturacionServicioDespachoXcuenta(idCuentaAtencion)
//         let farmacia = await EstadoCuenta.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion)
//         let consolidado = await EstadoCuenta.ListarConsolidadoPorEstadoCuenta(idCuentaAtencion)
//         let listaCuentas = await EstadoCuenta.AtencionesListaCuentasXpaciente()


//         if (consolidado) {
//             let totalesConsolidado = consolidado.table1[0]


//             $('#txtTotalPagar').val(totalesConsolidado?.totalServicios)
//             $('#txtTotalSeguros').val(totalesConsolidado?.totalFinanciadoServicios)

//             $('#txtTotalPagarFarm').val(totalesConsolidado?.totalFarmacia)
//             $('#txtTotalSegurosFarm').val(totalesConsolidado?.totalFinanciadoFarmacia)

//             $('#txtPagoCuentaFarm').val(totalesConsolidado?.pagoCuentaFarmacia)
//             $('#txtPagoCuenta').val(totalesConsolidado?.pagoCuentaServicios)

//             $('#txtDevolucionConsolidado').val(totalesConsolidado?.devolucion)
//             $('#txtPagosCuentaConsolidado').val(totalesConsolidado?.pagoCuenta)
//             $('#txtSaldoFinalConsolidado').val(totalesConsolidado?.totalSaldoFinal)
//             $('#txtTotalConsumoConsolidado').val(totalesConsolidado?.totalConsumo)
//             $('#txtExoneracionConsolidado').val(totalesConsolidado?.exoneraciones)
//             $('#txtSegurosConsolidado').val(totalesConsolidado?.totalSeguros)
//         }

//         //$('#txtPagoCuenta').val(totalesConsolidado?.pagoCuenta)

//         /////////////////////////////// CALCULAR TOTAL PAGAR CON PAGO CUENTA 

//         $('#txtNroCuenta').val(data.idCuentaAtencion)
//         $('#txtNroHistoria').val(data.nroHistoriaClinica)
//         $('#txtNombrePaciente').val(data.paciente)
//         $('#txtDomicilioPaciente').val(data.direccionDomicilio)

//         $('#txtDatosCuenta').val(`(${data.estadoCta}) IAFA: ${data.dFuenteFinanciamiento} PP: ${data.dTipoFinanciamiento}`)
//         $('#txtFechaIngreso').val(FormatearFecha(data.fechaIngreso))
//         $('#txtFechaAltaMedica').val(FormatearFecha(data.fechaEgreso))
//         $('#txtFechaAperturaCuenta').val(FormatearFecha(data.fechaCreacion))
//         $('#txtFechaEgresoAdministrativo').val(FormatearFecha(data.fechaEgresoAdministrativo))

//         $('#txtServicioEgreso').val(`${data.servActual} (${data.dTipoServicio}) Cod.Cama ${data.camaActual}`)
//         $('#txtDiagnosticoEgreso').val(data.diagnostico)

//         $('.nav-tabs a[href="#TabPorPaciente"]').tab('show');

//         Cargando(0)
//     },

//     Events: function () {

//         ////////////////////////////////////// EVENTS BUTTONS //////////////////////////////////////
//         $('#btnBuscarListaPacientes').on('click', async function () {

//             let fechaInicioDate = parseDateDMY($('#txtFechaIngresoBusq').val());
//             let fechaFinDate = parseDateDMY($('#txtFechaHastaBusq').val());

//             if (fechaInicioDate > fechaFinDate) {
//                 alerta(2, 'La fecha inicio no puede ser mayor que la fecha fin');
//                 return
//             }

//             if (fechaInicioDate == '' || fechaFinDate == '') {
//                 alerta2('warning', '', 'Por favor ingrese la Fecha de Inicio y Fin')
//                 return
//             }

//             Cargando(1)

//             $('#contListaPacientesTipoServicio').hide()
//             $('#contListaPacientesPreventas').hide()
//             $('#contListaPacientesExoFarmacia').hide()
//             $('#contListaPacientesExternos').hide()

//             let opcion = $('input[name="rdbTipoBusqueda"]:checked').val()

//             if (opcion <= 3) {
//                 await EstadoCuenta.AtencionesSeleccionarPorTipoServicio()
//                 $('#contListaPacientesTipoServicio').show()
//             } else {

//                 if (opcion == 4) {
//                     await EstadoCuenta.FactOrdenServicioPreventasServicio()
//                     $('#contListaPacientesPreventas').show()
//                 } else if (opcion == 5) {
//                     await EstadoCuenta.farmMovimientoVentasExoneracionesEnFarmacia()
//                     $('#contListaPacientesExoFarmacia').show()
//                 } else if (opcion == 6) {
//                     await EstadoCuenta.AtencionesSeleccionarPacExtPorFechas()
//                     $('#contListaPacientesExternos').show()
//                 }
//             }

//             Cargando(0)
//         })
//         $('#btnCuentaPagada').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado = PENDIENTE PAGO SEGURO?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionPagada()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnPendientePagoSeguros').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let verificaTipoDoc = (await Utilitario.SeleccionarParametro(403)).valorTexto

//             if (verificaTipoDoc == 1) {
//                 let paciente = await EstadoCuenta.PacientesSeleccionarPorId(EstadoCuenta.IdPaciente)

//                 if (!isEmpty(paciente)) {
//                     if (paciente.idDocIdentidad == 0) {
//                         alerta2('warning', '', 'No se puede cerrar la cuenta porque tiene que regularizar su tipo de documento de indentidad, no se permite alta con tipo de documento -> (SIN DOCUMENTO), ACERCARSE A ADMISION')
//                         return
//                     }
//                 } else {
//                     alerta2('warning', '', 'No se puede cerrar la cuenta porque tiene que regularizar su tipo de documento de indentidad, no se permite alta con tipo de documento -> (SIN DOCUMENTO), ACERCARSE A ADMISION')
//                     return
//                 }

//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado = PENDIENTE PAGO SEGURO?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionPendientePagoSeguro()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnAbrirCuenta').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let permisoAbrirCuenta = await EstadoCuenta.ValidarPermisoAbrirCuentas()

//             if (permisoAbrirCuenta?.permiso != 1) {
//                 alerta2('warning', '', 'No cuenta con permiso para abrir cuentas')
//                 return
//             }

//             if (EstadoCuenta.IdEstadoCuentaAtencion == 1) {
//                 alerta2('info', '', 'La cuenta esta ABIERTA')
//                 return
//             }

//             //if (EstadoCuenta.IdEstadoCuentaAtencion == 4) {
//             //    alerta2('info', '', 'La cuenta esta PAGADA Y CERRADA. No se podra abrir.')
//             //    return
//             //}

//             if (EstadoCuenta.IdEstadoCuentaAtencion == 12) {
//                 alerta2('info', '', 'La cuenta esta CERRADA porque el paciente tiene una transferencia pendiente. Por favor recepcione al paciente en el servicio. Si desea ABRIR la cuenta es posible que genere inconsistencia en la cuenta del paciente.')
//                 return
//             }

//             if (obtenerDiasTranscurridos($('#txtFechaEgresoAdministrativo').val()) > 30) {
//                 alerta2('info', '', 'La cuenta esta CERRADA más de 30 dias. No se podra abrir.')
//                 return
//             }

//             if (EstadoCuenta.VecesAbierto >= 1) {
//                 alerta2('info', '', 'Ya se realizó una apertura anterior de cuenta, por favor notifique al personal de la Unidad de Seguros')
//                 return
//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea ABRIR la Cuenta?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionAbrir()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnCerrarCuenta').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea CERRAR la Cuenta?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionCerrar()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnCuentaAnulada').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado=ANULADA?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionAnulada()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnCuentaConGarante').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debes ingresar un numero de cuenta')
//                 return
//             }

//             let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea CERRAR la CUENTA del paciente que tiene un GARANTE Y DEUDA PENDIENTE?')

//             if (confirmar.isConfirmed) {
//                 let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales()

//                 if (validarInicioSesion) {
//                     let cuentaPagada = await EstadoCuenta.FacturacionCuentasAtencionAltaConDeudaYGarante()

//                     await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(EstadoCuenta.IdCuentaAtencion)
//                 }
//             }

//         })
//         $('#btnActualizaExoneracionSis').on('click', async function () {

//             if ($(this).prop('disabled')) return;

//             $(this).prop('disabled', true);

//             try {
//                 if (EstadoCuenta.IdCuentaAtencion == 0) {
//                     alerta2('warning', '', 'Debes ingresar un número de cuenta');
//                     return;
//                 }

//                 let confirmar = await alertaAsync('question', '', 'Para realizar este paso todos los procesos tienen que haberse cumplido correctamente <br><br> ¿Está seguro de realizar este paso?');

//                 if (confirmar.isConfirmed) {
//                     let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales();
                   
//                     if (validarInicioSesion) {
//                         Cargando(1);
//                         let exoneracion = await EstadoCuenta.GenerarExoneracionCuentaPaciente();
//                         Cargando(0);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error en proceso de exoneración:', error);
//             } finally {
//                 $(this).prop('disabled', false);
//                 Cargando(0);
//             }

//         })

//         $('#btnEstadoCuentaPorPtocCarga').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url

//             let tipoReporte = await alertaAsync('question', '', '¿Consumos consolidados?', 'No')

//             if (tipoReporte.isConfirmed) {
//                 url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '2';
//             } else {
//                 url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '1';
//             }

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnEstadoCuentaPorServicioHosp').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '3';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnLiquidacion').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '4';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnExoneracion').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '5';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnResumenLquidacion').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '6';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnEstadoCuentaHospEmergTotal').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '7';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnEstadoCuentaHospEmergSis').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '8';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnConsumoEnElServicio').on('click', async function () {

//             let idCuentaAtencion = $('#txtNroCuenta').val();
//             let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&tipoReporte=" + '3';

//             Cargando(1)

//             $("#modalReporte").modal('hide');

//             $('#ifrmReporte').attr('src', url);
//             $('#ifrmReporte').one('load', function () {
//                 $("#modalReporte").modal('show');
//                 Cargando(0)
//             });
//         });
//         $('#btnCerrarModalReporte').on('click', function () {

//             $("#modalReporte").modal('hide')
//         })

//         $('#btnCambioFuenteFinanciamiento').on('click', async function () {

//             if (EstadoCuenta.IdCuentaAtencion == 0) {
//                 alerta2('warning', '', 'Debe ingresar un número de cuenta');
//                 return;
//             }

//             if (isEmpty($('#cboFuenteFinancimiento').val()) || isEmpty($('#cboFuenteFinancimiento').val())) {
//                 alerta2('info', '', 'Tiene que elegir un nuevo plan de atención del paciente.')
//                 return
//             }

//             if ($(this).prop('disabled')) return;

//             $(this).prop('disabled', true);

//             try {

//                 let confirmar = await alertaAsync('question', '', '¿Está seguro del Cambio de Plan de Cuenta de Atención ?');

//                 if (confirmar.isConfirmed) {
//                     let validarInicioSesion = await EstadoCuenta.SolicitarConfirmacionCredenciales();

//                     if (validarInicioSesion) {
//                         Cargando(1);
//                         let exoneracion = await EstadoCuenta.CambiarFuenteFinancimiento();
//                         Cargando(0);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error en proceso de exoneración:', error);
//             } finally {
//                 $(this).prop('disabled', false);
//                 Cargando(0);
//             }
//         })

//         $('#btnNroCuentaBusq').on('click', async function () {
//             $('#txtDniPacienteBusqueda').val('')
//             $('#txtNroHistoriaPacienteBusqueda').val('')
//             $('#txtApPaternoPacienteBusqueda').val('')
//             $('#txtApMaternoPacienteBusqueda').val('')
//             $('#txtPrimerNombrePacienteBusqueda').val('')
//             $('#modalBusquedaPacientes').modal('show')
//         })

//         $('#btnCerrarModalListaPacientes').on('click', async function () {

//             $('#modalBusquedaPacientes').modal('hide')
//         })

//         $('#btnBuscarPacientes').on('click', async function () {

//             if ($('#txtDniPacienteBusqueda').val() == '' && $('#txtNroHistoriaPacienteBusqueda').val() == '' && $('#txtApPaternoPacienteBusqueda').val() == ''
//                 && $('#txtApMaternoPacienteBusqueda').val() == '' && $('#txtPrimerNombrePacienteBusqueda').val() == '') {
//                     alerta(2, 'Debe ingresar al menos un campo para la busqueda.')
//                 return
//             }

//             await EstadoCuenta.PacientesFiltrarTodosSoloHistorias()
//         })

//         $('#btnCerrarModalListaCuentasPaciente').on('click', async function () {

//             $('#modalBusquedaCuentasPaciente').modal('hide')
//         })
        

//         $('#btnLimpiarBusquedaPacientes').on('click', async function () {
//             $('#txtDniPacienteBusqueda').val('')
//             $('#txtNroHistoriaPacienteBusqueda').val('')
//             $('#txtApPaternoPacienteBusqueda').val('')
//             $('#txtApMaternoPacienteBusqueda').val('')
//             $('#txtPrimerNombrePacienteBusqueda').val('')
//         })
       
//         ////////////////////////////////////// EVENTS BUTTONS //////////////////////////////////////

//         ////////////////////////////////////// EVENTS TEXTS //////////////////////////////////////
//         $('#txtNroCuentaBusq').keypress(async function (e) {
//             // Comprobar si la tecla presionada es 'Enter' (código 13)
//             if (e.which == 13) {
//                 e.preventDefault();

//                 let idCuentaAtencion = $('#txtNroCuentaBusq').val()

//                 await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion)


//             }
//         });
//         $('#txtContraseniaConfirmacion').keypress(async function (e) {
//             // Comprobar si la tecla presionada es 'Enter' (código 13)
//             if (e.which == 13) {
//                 e.preventDefault();

//                 $('.swal2-confirm').trigger('click')

//             }
//         });
//         ////////////////////////////////////// EVENTS TEXTS //////////////////////////////////////


//         ///////////////////////////////////// EVENTS TABLES //////////////////////////////////////
//         $('#tblServicios').on('input', '.input-table-cantidad-sis', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableServicios.api(true);
//             const row = table.row(tr);
//             const data = row.data();


//             const valor = input.val();

//             if (valor == '') {
//                 return
//             }
//             if (valor > data.cantidad) {
//                 alerta2('info', '', `La cantidad autorizada (SIS, SOAT) = ${valor} <br> pasa de la cantidad ${data.cantidad}`)
//                 input.val(0)
//                 return
//             }

//             console.log(valor)
//             let calculoTotal = parseFloat(data.precioUnitario) * (data.cantidad - valor);

//             data.cantidadFinanciadaSis = valor
//             data.cantidadPagar = data.cantidad - valor
//             data.totalPagar = calculoTotal

//             const colIndex = input.closest('td').index(); // para ubicar el input exacto
//             const rowIndex = row.index();

//             if (calculoTotal > 0) {
//                 tr.css({
//                     'color': '#FF00FF',
//                     'font-weight': 'bold'
//                 });
//             } else {
//                 // Restablecer estilos si ya no cumple la condición
//                 tr.css({
//                     'color': '',
//                     'font-weight': ''
//                 });
//             }

//             // Reasignar los datos para que el render se active
//             row.data(data).draw();


//             // Esperar al redibujado y volver a enfocar
//             const nuevoInput = $('#tblServicios tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-cantidad-sis');
//             nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
//         });
//         $('#tblServicios').on('focusout', '.input-table-cantidad-sis', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableServicios.api(true);
//             const row = table.row(tr);
//             const data = row.data();

//             const valor = input.val();

//             if (valor == '') {
//                 alerta2('info', '', `Ingrse un valor valido`)
//                 input.val(data.cantidadFinanciadaSis)
//                 input.focus()
//                 return
//             }
//         });

//         $('#tblServicios').on('input', '.input-table-exonera', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableServicios.api(true);
//             const row = table.row(tr);
//             const data = row.data();


//             const valor = input.val();

//             if (valor[valor.length - 1] == '.') return;

//             const importeExonera = parseFloat(input.val());

//             data.importeExonera = importeExonera || 0;

//             let calculoTotal = parseFloat(data.subTotal) - importeExonera;
//             if (isNaN(calculoTotal)) calculoTotal = parseFloat(data.subTotal);

//             if (calculoTotal < 0) {
//                 input.val(input.val().substr(0, input.val().length - 1))
//                 return
//             }

//             // Si hay un cálculo adicional
//             data.totalPagar = calculoTotal

//             const colIndex = input.closest('td').index(); // para ubicar el input exacto
//             const rowIndex = row.index();

//             // Reasignar los datos para que el render se active
//             row.data(data).draw();

//             // Esperar al redibujado y volver a enfocar
//             const nuevoInput = $('#tblServicios tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-exonera');
//             nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
//         });


//         $('#tblFarmacia').on('input', '.input-table-cantidad-sis', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableFarmacia.api(true);
//             const row = table.row(tr);
//             const data = row.data();


//             const valor = input.val();

//             if (valor == '') {
//                 return
//             }
//             if (valor > data.cantidad) {
//                 alerta2('info', '', `La cantidad autorizada (SIS, SOAT) = ${valor} <br> pasa de la cantidad ${data.cantidad}`)
//                 input.val(0)
//                 return
//             }

//             console.log(valor)
//             let calculoTotal = parseFloat(data.precioUnitario) * (data.cantidad - valor);

//             data.cantidadFinanciadaSis = valor
//             data.cantidadPagar = data.cantidad - valor
//             data.totalPagar = calculoTotal

//             const colIndex = input.closest('td').index(); // para ubicar el input exacto
//             const rowIndex = row.index();

//             if (calculoTotal > 0) {
//                 tr.css({
//                     'color': '#FF00FF',
//                     'font-weight': 'bold'
//                 });
//             } else {
//                 // Restablecer estilos si ya no cumple la condición
//                 tr.css({
//                     'color': '',
//                     'font-weight': ''
//                 });
//             }

//             // Reasignar los datos para que el render se active
//             row.data(data).draw();


//             // Esperar al redibujado y volver a enfocar
//             const nuevoInput = $('#tblFarmacia tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-cantidad-sis');
//             nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
//         });
//         $('#tblFarmacia').on('focusout', '.input-table-cantidad-sis', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableFarmacia.api(true);
//             const row = table.row(tr);
//             const data = row.data();

//             const valor = input.val();

//             if (valor == '') {
//                 alerta2('info', '', `Ingrse un valor valido`)
//                 input.val(data.cantidadFinanciadaSis)
//                 input.focus()
//                 return
//             }
//         });

//         $('#tblFarmacia').on('input', '.input-table-exonera', function () {
//             const input = $(this);
//             const tr = input.closest('tr');
//             const table = oTable_TableFarmacia.api(true);
//             const row = table.row(tr);
//             const data = row.data();


//             const valor = input.val();

//             if (valor[valor.length - 1] == '.') return;

//             const importeExonera = parseFloat(input.val());

//             data.importeExonera = importeExonera || 0;

//             let calculoTotal = parseFloat(data.subTotal) - importeExonera;
//             if (isNaN(calculoTotal)) calculoTotal = parseFloat(data.subTotal);

//             if (calculoTotal < 0) {
//                 input.val(input.val().substr(0, input.val().length - 1))
//                 return
//             }

//             // Si hay un cálculo adicional
//             data.totalPagar = calculoTotal

//             const colIndex = input.closest('td').index(); // para ubicar el input exacto
//             const rowIndex = row.index();

//             // Reasignar los datos para que el render se active
//             row.data(data).draw();

//             // Esperar al redibujado y volver a enfocar
//             const nuevoInput = $('#tblFarmacia tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-exonera');
//             nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
//         });


//         $('#tblListaPacientes').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaPacientes.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaPacientes').on('dblclick', 'tr', async function () {

//             oTable_TableListaPacientes.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')


//             let objRow = oTable_TableListaPacientes.api(true).row('.selected').data()


//             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             if (isEmpty(objRow)) {
//                 alerta(2, 'Ingrese un registro valido')
//                 return false
//             }

//             await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(objRow.idCuentaAtencion)
//             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         })


//         $('#tblListaPacientesPreventas').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaPacientesPreventas.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaPacientesPreventas').on('dblclick', 'tr', async function () {

//             oTable_TableListaPacientesPreventas.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')
//         })


//         $('#tblListaPacientesExoFarmacia').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaPacientesExoFarmacia.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaPacientesExoFarmacia').on('dblclick', 'tr', async function () {

//             oTable_TableListaPacientesExoFarmacia.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')
//         })


//         $('#tblListaPacientesExternos').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaPacientesExternos.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaPacientesExternos').on('dblclick', 'tr', async function () {

//             oTable_TableListaPacientesExternos.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')
//         })

//         $('#tblListaPacientesBusqueda').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaPacientesBusqueda.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaPacientesBusqueda').on('dblclick', 'tr', async function () {

//             oTable_TableListaPacientesBusqueda.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')

//             let objRow = oTable_TableListaPacientesBusqueda.api(true).row('.selected').data()

//             await EstadoCuenta.ListarAtencionesPorPaciente(objRow.idPaciente)

//             $('#modalBusquedaCuentasPaciente').modal('show')
//         })

//         $('#tblListaCuentasPacientesBusqueda').on('click', 'tr', async function () {

//             if ($(this).hasClass('selected')) {
//                 $(this).removeClass('selected')
//             } else {
//                 oTable_TableListaCuentasPacientesBusqueda.$('tr.selected').removeClass('selected')
//                 $(this).addClass('selected')
//             }
//         })
//         $('#tblListaCuentasPacientesBusqueda').on('dblclick', 'tr', async function () {

//             oTable_TableListaCuentasPacientesBusqueda.$('tr.selected').removeClass('selected')
//             $(this).addClass('selected')


//             let objRow = oTable_TableListaCuentasPacientesBusqueda.api(true).row('.selected').data()


//             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             if (isEmpty(objRow)) {
//                 alerta(2, 'Ingrese un registro valido')
//                 return false
//             }

//             await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(objRow.idCuentaAtencion)

//             $('.modal').modal('hide')
//             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         })

//         ///////////////////////////////////// EVENTS TABLES //////////////////////////////////////


//         ///////////////////////////////////// EVENTS CHECKBOX //////////////////////////////////////
//         $('#chkTodosNingunoSis').on('click', function () {

//             let rows = oTable_TableServicios.$('tr')

//             if ($(this).is(':checked')) {
//                 for (let i in rows) {

//                     let tr = rows[i];     // Valor en ese índice

//                     const table = oTable_TableServicios.api(true);
//                     const row = table.row(tr);
//                     const data = row.data();

//                     let calculoTotal = data.subTotal

//                     data.cantidadFinanciadaSis = 0
//                     data.cantidadPagar = data.cantidad
//                     data.totalPagar = calculoTotal


//                     if (calculoTotal > 0) {
//                         $(tr).css({
//                             'color': '#FF00FF',
//                             'font-weight': 'bold'
//                         });
//                     } else {
//                         // Restablecer estilos si ya no cumple la condición
//                         $(tr).css({
//                             'color': '',
//                             'font-weight': ''
//                         });
//                     }

//                     row.data(data).draw();
//                 }

//             } else {
//                 for (let i in rows) {

//                     let tr = rows[i];     // Valor en ese índice

//                     const table = oTable_TableServicios.api(true);
//                     const row = table.row(tr);
//                     const data = row.data();

//                     let calculoTotal = 0

//                     data.cantidadFinanciadaSis = data.cantidad
//                     data.cantidadPagar = 0
//                     data.totalPagar = data.totalFinanciadoSis

//                     if (calculoTotal > 0) {
//                         $(tr).css({
//                             'color': '#FF00FF',
//                             'font-weight': 'bold'
//                         });
//                     } else {
//                         // Restablecer estilos si ya no cumple la condición
//                         $(tr).css({
//                             'color': '',
//                             'font-weight': ''
//                         });
//                     }

//                     row.data(data).draw();
//                 }
//             }
//         })

//         ///////////////////////////////////// EVENTS TABS //////////////////////////////////////
//         $('.nav-link').on('shown.bs.tab', function () {
//             oTable_TableServicios.fnDraw()
//             oTable_TableFarmacia.fnDraw()
//             oTable_TableConsolidado.fnDraw()
//         })
//         ///////////////////////////////////// EVENTS TABS //////////////////////////////////////

//         ///////////////////////////////////// EVENTS SELECT //////////////////////////////////////
//         $('#cboSeleccionarCuenta').on('change', async function () {

//             let idCuentaAtencion = $('#cboSeleccionarCuenta').val()

//             await EstadoCuenta.BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion)

//         })
//         $('#cboFuenteFinancimiento').on('change', async function () {

//             await EstadoCuenta.TiposFinanciamientosTarifaSeleccionarPorPlan($('#cboFuenteFinancimiento').val())

//         })
//         ///////////////////////////////////// EVENTS SELECT //////////////////////////////////////

//         ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
//         $('#modalBusquedaCuentasPaciente').on('shown.bs.modal', function () {
//             oTable_TableListaCuentasPacientesBusqueda.fnDraw()
//         });
//         ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
//     },


//     Init: async function () {

//         this.Plugins()

//         ///////////CONSUMO EN EL SERVICIO//////////////
//         ConsumoServicio.IniciarScript();
//         /////////////////////////////////////////////

//         this.DataTableServicios()
//         this.DataTableFarmacia()
//         this.DataTableConsolidado()
//         this.DataTableReembolso()
//         this.DataTableFarmaciaDonaciones()
//         this.DataTableListaPacientes()
//         this.DataTableListaPacientesPreventas()
//         this.DataTableListaPacientesExoFarmacia()
//         this.DataTableListaPacientesExternos()
//         this.DataTableListaPacientesBusqueda()
//         this.DataTableListaCuentasPacientesBusqueda()

//         this.FuentesFinanciamientoSegunFiltro('UtilizadoEn=1 or UtilizadoEn=3  or UtilizadoEn=2')

//         EstadoCuenta.idPagosACuenta = (await Utilitario.SeleccionarParametro(245)).valorTexto
//         EstadoCuenta.idDevoluciones = (await Utilitario.SeleccionarParametro(265)).valorTexto

//         this.Events()
//     }
// }

// function obtenerDiasTranscurridos(fecha) {
//     // fecha en formato 'dd/mm/yyyy'
//     let partes = fecha.split('/');
//     let fechaInicio = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
//     let fechaActual = new Date();

//     // Calcular diferencia en milisegundos y convertir a días
//     let diferencia = fechaActual - fechaInicio;
//     return Math.floor(diferencia / (1000 * 60 * 60 * 24));
// }

// function parseDateDMY(fecha) {
//     const partes = fecha.split('/');
//     // partes[0]: día, partes[1]: mes, partes[2]: año
//     return new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
// }

// $(document).ready(function () {

//     EstadoCuenta.Init()
// })

