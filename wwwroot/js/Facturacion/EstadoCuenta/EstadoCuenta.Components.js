export class EstadoCuentaComponents {

    constructor(context) {
        this.ctx = context;
    }

    async init() {
        this.DataTableServicios();
        this.DataTableFarmacia();
        this.DataTableConsolidado();
        this.DataTableReembolso();
        this.DataTableFarmaciaDonaciones();
        this.DataTableListaPacientes();
        this.DataTableListaPacientesPreventas();
        this.DataTableListaPacientesExoFarmacia();
        this.DataTableListaPacientesExternos();
        this.DataTableListaPacientesBusqueda();
        this.DataTableListaCuentasPacientesBusqueda();

    }

    DataTableServicios() {

        const self = this;

        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            scrollY: '45vh',
            responsive: false,

            scrollX: true,
            autoWidth: false,
            destroy: true,
            columns: [
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)

                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return FormatearFecha(row.fechaCreacion) + ' ' + row.horaCreacion

                        }
                    }
                },
                {
                    data: "desPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subTotal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                { // Solo se meustra si es paciente sis
                    data: "cantidadFinanciadaSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let table = self.ctx.oTable_TableServicios;
                        // table.fnSetColumnVis(col, self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
                                return `<input class="input-table input-table-cantidad-sis solo-numero" value="${data}">`;
                            } else {
                                return data;
                            }

                        }
                    }
                },
                { // Solo se meustra si es paciente sis
                    data: "precioFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        let table = self.ctx.oTable_TableServicios;
                        // table.fnSetColumnVis(col, self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
                    }
                },
                {
                    data: "totalFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalFinanciadoSoat",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "importeExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        let table = self.ctx.oTable_TableServicios;
                        // table.fnSetColumnVis(col, !(self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2))
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 9 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
                                return `<input class="input-table input-table-exonera solo-decimal" value="${data}">`;
                            } else {
                                return data;
                            }

                        }
                    }
                },
                {
                    data: "usuarioExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidadPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidadDevuelta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadosFacturacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "docReembolso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servInternamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroComprobante",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dfinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcionPorItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movtipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioEstancia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaDespacho",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaDespacho) + ' ' + rowData.horaDespacho)
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return FormatearFecha(row.fechaDespacho) + ' ' + row.horaDespacho

                        }
                    }
                },

            ],

            createdRow: function (row, data, dataIndex) {
                if (data.idProducto == self.ctx.idPagosACuenta) {
                    $(row).css('color', '#189fff');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == self.ctx.idDevoluciones) {
                    $(row).css('color', '#2dc71b');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == 4692) {
                    $(row).css('color', '#ff3535');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == 4693) {
                    $(row).css('color', '#H3049FA');
                    $(row).css('font-weight', 'bold');
                } else if (data.cantidadPagar > 0 && data.idTipoFinanciamiento == 2) {
                    $(row).css('color', '#FF00FF');
                    $(row).css('font-weight', 'bold');
                }
            }
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableServicios = $("#tblServicios").dataTable(parms);

        this.ctx.oTable_TableServicios.fnAdjustColumnSizing();
    }
    DataTableFarmacia() {

        const self = this;

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            scrollY: '45vh',
            responsive: false,

            scrollX: true,
            autoWidth: false,
            destroy: true,
            columns: [
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)

                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return FormatearFecha(row.fechaCreacion) + ' ' + row.horaCreacion

                        }
                    }
                },
                {
                    data: "desPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subTotal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                { // Solo se meustra si es paciente sis
                    data: "cantidadFinanciadaSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let table = self.ctx.oTable_TableFarmacia;
                        // table.fnSetColumnVis(col, self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2) {
                                return `<input class="input-table input-table-cantidad-sis solo-numero" value="${data}">`;
                            } else {
                                return data;
                            }

                        }
                    }
                },
                { // Solo se meustra si es paciente sis
                    data: "precioFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let table = self.ctx.oTable_TableFarmacia;
                        // table.fnSetColumnVis(col, self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2)
                    }
                },
                {
                    data: "totalFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalFinanciadoSoat",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "importeExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let table = self.ctx.oTable_TableFarmacia;
                        // table.fnSetColumnVis(col, !(self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2))
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 9 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
                                return `<input class="input-table input-table-exonera solo-decimal" value="${data}">`;
                            } else {
                                return data;
                            }

                        }
                    }
                },
                {
                    data: "usuarioExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidadPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidadDevuelta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadosFacturacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "docReembolso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servInternamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroComprobante",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dfinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcionPorItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "movtipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioEstancia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaDespacho",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaDespacho) + ' ' + rowData.horaDespacho)
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return FormatearFecha(row.fechaDespacho) + ' ' + row.horaDespacho

                        }
                    }
                },

            ],

            createdRow: function (row, data, dataIndex) {
                if (data.idProducto == self.ctx.idPagosACuenta) {
                    $(row).css('color', '#189fff');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == self.ctx.idDevoluciones) {
                    $(row).css('color', '#2dc71b');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == 4692) {
                    $(row).css('color', '#H16CD32');
                    $(row).css('font-weight', 'bold');
                } else if (data.idProducto == 4693) {
                    $(row).css('color', '#H3049FA');
                    $(row).css('font-weight', 'bold');
                } else if (data.cantidadPagar > 0 && data.idTipoFinanciamiento == 2) {
                    $(row).css('color', '#FF00FF');
                    $(row).css('font-weight', 'bold');
                }
            }
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableFarmacia = $("#tblFarmacia").dataTable(parms);
    }
    DataTableConsolidado() {

        const self = this;

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            scrollY: '45vh',
            responsive: false,

            scrollX: true,
            autoWidth: false,
            destroy: true,
            columns: [
                {
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)
                    }
                },
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioEstancia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html("")
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableConsolidado = $("#tblConsolidado").dataTable(parms);
    }
    DataTableReembolso() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableReembolso = $("#tblReembolso").dataTable(parms);
    }
    DataTableFarmaciaDonaciones() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subGrupo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableFarmaciaDonaciones = $("#tblFarmaciaDonaciones").dataTable(parms);
    }
    DataTableListaPacientes() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idCuentaAtencion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "t_Financiamiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoPlan",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "ultimoServicio",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "plan",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "horaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "horaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fecNacim",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fecNacim));
                    }
                },
                {
                    data: "edad",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaPacientes = $("#tblListaPacientes").dataTable(parms);
    }
    DataTableListaPacientesPreventas() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "nroOrdenPago",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "pto_Carga",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idOrden",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaPacientesPreventas = $("#tblListaPacientesPreventas").dataTable(parms);
    }
    DataTableListaPacientesExoFarmacia() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "nroDocumento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipo Doc",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "farmacia",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroMovimiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaPacientesExoFarmacia = $("#tblListaPacientesExoFarmacia").dataTable(parms);
    }
    DataTableListaPacientesExternos() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idCuentaAtencion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "plan",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoPlan",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "ultimoServicio",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    data: "fechaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "horaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fecNacim",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fecNacim));
                    }
                },
                {
                    data: "edad",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaPacientesExternos = $("#tblListaPacientesExternos").dataTable(parms);
    }
    DataTableListaPacientesBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "apellidoPaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fecNacimiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoServicio",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaPacientesBusqueda = $("#tblListaPacientesBusqueda").dataTable(parms);
    }
    DataTableListaCuentasPacientesBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idCuentaAtencion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoCuenta",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaIngreso))
                    }
                },
                {
                    data: "fechaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaEgreso))
                    }
                },
                {
                    data: "horaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "edad",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_TableListaCuentasPacientesBusqueda = $("#tblListaCuentasPacientesBusqueda").dataTable(parms);
    }
}