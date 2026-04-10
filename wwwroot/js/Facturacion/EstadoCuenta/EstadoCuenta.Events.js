export class EstadoCuentaEvents {

    constructor(context) {
        this.ctx = context;
    }





    async bindAll() {
        ////////////////////////////////////// EVENTS BUTTONS //////////////////////////////////////
        $('#btnBuscarListaPacientes').on('click', async () => {
            await this.ctx.actions.BuscarListaPacientes();
        })
        $('#btnLimpiarBusqueda').on('click', async () => {
            let FechaHora = await Utilitario.FechaHoraServidor();
            let FechaDia = FechaHora.substring(0, 10);

            let fechaDividida = FechaDia.split('/'); // partes[0]=día, partes[1]=mes, partes[2]=año

            // Construir el primer día del mes
            let primerDiaDelMes = `01/${fechaDividida[1]}/${fechaDividida[2]}`;


            $("#txtFechaIngresoBusq").datepicker("setDate", primerDiaDelMes);
            $("#txtFechaHastaBusq").datepicker("setDate", FechaDia);

            this.ctx.oTable_TableListaPacientes.fnClearTable();
            this.ctx.oTable_TableListaPacientesPreventas.fnClearTable();
            this.oTable_TableListaPacientesExoFarmacia.fnClearTable();
            this.oTable_TableListaPacientesExternos.fnClearTable();
        })

        $('#btnCuentaPagada').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaPacientePagada();
        })
        $('#btnPendientePagoSeguros').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaPendienteDePagoSeguros()
        })
        $('#btnAbrirCuenta').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaAbierta()
        })

        $('#btnCerrarCuenta').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaCerrada()
        })
        $('#btnCuentaAnulada').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaAnulada()
        })
        $('#btnCuentaConGarante').on('click', async () => {
            await this.ctx.actions.CambiarEstadoCuentaConGarante()
        })
        $('#btnActualizaExoneracionSis').on('click', async (e) => {

            if ($(e.currentTarget).prop('disabled')) return;

            $(e.currentTarget).prop('disabled', true);

            await this.ctx.actions.GenerarExoneracionCuentaPaciente()

            $(e.currentTarget).prop('disabled', false);

        })






        $('#btnEstadoCuentaPorPtocCarga').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();
            let url

            let tipoReporte = await alertaAsync('question', '', '¿Consumos consolidados?', 'No')
            
            let res

            if (tipoReporte.isConfirmed) {
                Cargando(1)
                res = await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=2`)
                Cargando(0)
            } else {
                Cargando(1)
                res = await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=1`)
                Cargando(0)
            }

            console.log("res", res)
        });
        $('#btnEstadoCuentaPorServicioHosp').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();
            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=3`)
            Cargando(0)

        });
        $('#btnLiquidacion').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();

            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=4`)
            Cargando(0)

        });
        $('#btnExoneracion').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();
            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=5`)
            Cargando(0)

        });
        $('#btnResumenLquidacion').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();
            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=6`)
            Cargando(0)

        });
        $('#btnEstadoCuentaHospEmergTotal').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();

            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=7`)
            Cargando(0)

        });
        $('#btnEstadoCuentaHospEmergSis').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();

            Cargando(1)
            await HttpClient.Get(`/ExcelReportEstadoCuenta/GenerarReporte?idCuentaAtencion=${idCuentaAtencion}&modeloReporte=8`)
            Cargando(0)
            
        });


        // $('#btnEstadoCuentaPorPtocCarga').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url

        //     let tipoReporte = await alertaAsync('question', '', '¿Consumos consolidados?', 'No')

        //     if (tipoReporte.isConfirmed) {
        //         url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '2';
        //     } else {
        //         url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '1';
        //     }

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnEstadoCuentaPorServicioHosp').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '3';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnLiquidacion').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '4';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnExoneracion').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '5';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnResumenLquidacion').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '6';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnEstadoCuentaHospEmergTotal').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '7';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });
        // $('#btnEstadoCuentaHospEmergSis').on('click', async () => {

        //     let idCuentaAtencion = $('#txtNroCuenta').val();
        //     let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '8';

        //     Cargando(1)

        //     $("#modalReporte").modal('hide');

        //     $('#ifrmReporte').attr('src', url);
        //     $('#ifrmReporte').one('load', () => {
        //         $("#modalReporte").modal('show');
        //         Cargando(0)
        //     });
        // });





        $('#btnConsumoEnElServicio').on('click', async () => {

            let idCuentaAtencion = $('#txtNroCuenta').val();
            let url = "/EstadoCuenta/GeneraFormatoReportesEstadoCuenta?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&modeloReporte=" + '3';

            Cargando(1)

            $("#modalReporte").modal('hide');

            $('#ifrmReporte').attr('src', url);
            $('#ifrmReporte').one('load', () => {
                $("#modalReporte").modal('show');
                Cargando(0)
            });
        });
        $('#btnCerrarModalReporte').on('click', () => {

            $("#modalReporte").modal('hide')
        })
        $('#btnCambioFuenteFinanciamiento').on('click', async (e) => {
            // if ($(e.currentTarget).prop('disabled')) return;

            // $(e.currentTarget).prop('disabled', true);

            this.ctx.actions.CambiarFuenteFinanciamientoPaciente()

            // $(this).prop('disabled', false);
        })
        $('#btnNroCuentaBusq').on('click', async () => {
            $('#txtDniPacienteBusqueda').val('')
            $('#txtNroHistoriaPacienteBusqueda').val('')
            $('#txtApPaternoPacienteBusqueda').val('')
            $('#txtApMaternoPacienteBusqueda').val('')
            $('#txtPrimerNombrePacienteBusqueda').val('')
            $('#modalBusquedaPacientes').modal('show')

            this.ctx.oTable_TableListaPacientesBusqueda.fnClearTable();
        })
        $('#btnCerrarModalListaPacientes').on('click', async () => {

            $('#modalBusquedaPacientes').modal('hide')
        })
        $('#btnBuscarPacientes').on('click', async () => {
            await this.ctx.actions.BuscarPacientes()
        })
        $('#btnCerrarModalListaCuentasPaciente').on('click', async () => {

            $('#modalBusquedaCuentasPaciente').modal('hide')
        })
        $('#btnLimpiarBusquedaPacientes').on('click', async () => {
            $('#txtDniPacienteBusqueda').val('')
            $('#txtNroHistoriaPacienteBusqueda').val('')
            $('#txtApPaternoPacienteBusqueda').val('')
            $('#txtApMaternoPacienteBusqueda').val('')
            $('#txtPrimerNombrePacienteBusqueda').val('')
            this.ctx.oTable_TableListaPacientesBusqueda.fnClearTable();

        })
        ////////////////////////////////////// EVENTS BUTTONS //////////////////////////////////////

        ////////////////////////////////////// EVENTS TEXTS //////////////////////////////////////
        $('#txtNroCuentaBusq').keypress(async (e) => {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();

                let idCuentaAtencion = $('#txtNroCuentaBusq').val()

                await this.ctx.actions.BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion)
            }
        });

        $('#btnActualizarEstadoCuenta').on('click', async (e) => {
            let idCuentaAtencion = $('#txtNroCuenta').val()

            await this.ctx.actions.BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion)
        });

        $('#txtContraseniaConfirmacion').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();

                $('.swal2-confirm').trigger('click')

            }
        });
        $('.busquedaPaciente').keypress(async (e) => {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();

                await this.ctx.actions.BuscarPacientes()
            }
        });
        ////////////////////////////////////// EVENTS TEXTS //////////////////////////////////////


        ///////////////////////////////////// EVENTS TABLES //////////////////////////////////////
        $('#tblServicios').on('input', '.input-table-cantidad-sis', (e) => {
            this.ctx.actions.ModificarCantidadServiciosSis($(e.currentTarget));
        });
        $('#tblServicios').on('focusout', '.input-table-cantidad-sis', (e) => {
            this.ctx.actions.ValidarCantidadServiciosSis($(e.currentTarget));
        });

        $('#tblServicios').on('input', '.input-table-exonera', (e) => {
            const input = $(e.currentTarget);
            const tr = input.closest('tr');
            const table = this.ctx.oTable_TableServicios.api(true);
            const row = table.row(tr);
            const data = row.data();


            const valor = input.val();

            if (valor[valor.length - 1] == '.') return;

            const importeExonera = parseFloat(input.val());

            data.importeExonera = importeExonera || 0;

            let calculoTotal = parseFloat(data.subTotal) - importeExonera;
            if (isNaN(calculoTotal)) calculoTotal = parseFloat(data.subTotal);

            if (calculoTotal < 0) {
                input.val(input.val().substr(0, input.val().length - 1))
                return
            }

            // Si hay un cálculo adicional
            data.totalPagar = calculoTotal

            const colIndex = input.closest('td').index(); // para ubicar el input exacto
            const rowIndex = row.index();

            // Reasignar los datos para que el render se active
            row.data(data).draw();

            // Esperar al redibujado y volver a enfocar
            const nuevoInput = $('#tblServicios tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-exonera');
            nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
        });


        $('#tblFarmacia').on('input', '.input-table-cantidad-sis', (e) => {
            this.ctx.actions.ModificarCantidadFarmaciaSis($(e.currentTarget));
        });
        $('#tblFarmacia').on('focusout', '.input-table-cantidad-sis', (e) => {
            this.ctx.actions.ValidarCantidadFarmaciaSis($(e.currentTarget));
        });

        $('#tblFarmacia').on('input', '.input-table-exonera', (e) => {
            const input = $(e.currentTarget);
            const tr = input.closest('tr');
            const table = this.ctx.oTable_TableFarmacia.api(true);
            const row = table.row(tr);
            const data = row.data();


            const valor = input.val();

            if (valor[valor.length - 1] == '.') return;

            const importeExonera = parseFloat(input.val());

            data.importeExonera = importeExonera || 0;

            let calculoTotal = parseFloat(data.subTotal) - importeExonera;
            if (isNaN(calculoTotal)) calculoTotal = parseFloat(data.subTotal);

            if (calculoTotal < 0) {
                input.val(input.val().substr(0, input.val().length - 1))
                return
            }

            // Si hay un cálculo adicional
            data.totalPagar = calculoTotal

            const colIndex = input.closest('td').index(); // para ubicar el input exacto
            const rowIndex = row.index();

            // Reasignar los datos para que el render se active
            row.data(data).draw();

            // Esperar al redibujado y volver a enfocar
            const nuevoInput = $('#tblFarmacia tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-exonera');
            nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
        });


        // $('#tblListaPacientes').on('click', 'tr', async function() {
        //     this.ctx.actions.SeleccionarFilaTablaPacientes($(this));
        // })
        $('#tblListaPacientes').on('dblclick', 'tr', (e) => {
            this.ctx.actions.SeleccionarFilaTablaPacientes($(e.currentTarget));
        });


        $('#tblListaPacientesPreventas').on('click', 'tr', async () => {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableListaPacientesPreventas.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblListaPacientesPreventas').on('dblclick', 'tr', async () => {

            oTable_TableListaPacientesPreventas.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')
        })


        $('#tblListaPacientesExoFarmacia').on('click', 'tr', async () => {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableListaPacientesExoFarmacia.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblListaPacientesExoFarmacia').on('dblclick', 'tr', async () => {

            oTable_TableListaPacientesExoFarmacia.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')
        })


        $('#tblListaPacientesExternos').on('click', 'tr', async () => {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableListaPacientesExternos.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblListaPacientesExternos').on('dblclick', 'tr', async () => {

            oTable_TableListaPacientesExternos.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')
        })

        // $('#tblListaPacientesBusqueda').on('click', 'tr', async () => {

        //     if ($(this).hasClass('selected')) {
        //         $(this).removeClass('selected')
        //     } else {
        //         oTable_TableListaPacientesBusqueda.$('tr.selected').removeClass('selected')
        //         $(this).addClass('selected')
        //     }
        // })
        $('#tblListaPacientesBusqueda').on('dblclick', 'tr', async (e) => {

            this.ctx.actions.SeleccionarFilaTablaPacientesBusqueda(e.currentTarget)

        })

        // $('#tblListaCuentasPacientesBusqueda').on('click', 'tr', async () => {

        //     if ($(this).hasClass('selected')) {
        //         $(this).removeClass('selected')
        //     } else {
        //         oTable_TableListaCuentasPacientesBusqueda.$('tr.selected').removeClass('selected')
        //         $(this).addClass('selected')
        //     }
        // })
        $('#tblListaCuentasPacientesBusqueda').on('dblclick', 'tr', async (e) => {
            this.ctx.actions.SeleccionarPacienteListaCuentasPacientesBusqueda(e.currentTarget)
        })

        ///////////////////////////////////// EVENTS TABLES //////////////////////////////////////


        ///////////////////////////////////// EVENTS CHECKBOX //////////////////////////////////////
        $('#chkTodosNingunoSis').on('click', () => {

            let rows = this.ctx.oTable_TableServicios.$('tr')

            if ($('#chkTodosNingunoSis').is(':checked')) {
                for (let i in rows) {

                    let tr = rows[i];     // Valor en ese índice

                    const table = this.ctx.oTable_TableServicios.api(true);
                    const row = table.row(tr);
                    const data = row.data();

                    console.log(row)
                    console.log(data)

                    if (!isEmpty(data) && data.length > 0) {
                        continue
                    }

                    let calculoTotal = data.subTotal

                    data.cantidadFinanciadaSis = 0
                    data.cantidadPagar = data.cantidad
                    data.totalPagar = calculoTotal


                    if (calculoTotal > 0) {
                        $(tr).css({
                            'color': '#FF00FF',
                            'font-weight': 'bold'
                        });
                    } else {
                        // Restablecer estilos si ya no cumple la condición
                        $(tr).css({
                            'color': '',
                            'font-weight': ''
                        });
                    }

                    row.data(data).draw();
                }

            } else {
                for (let i in rows) {

                    let tr = rows[i];     // Valor en ese índice

                    const table = this.ctx.tables.ctx.oTable_TableServicios.api(true);
                    const row = table.row(tr);
                    const data = row.data();


                    if (!isEmpty(data) && data.length > 0) {
                        continue
                    }

                    let calculoTotal = 0

                    data.cantidadFinanciadaSis = data.cantidad
                    data.cantidadPagar = 0
                    data.totalPagar = data.totalFinanciadoSis

                    if (calculoTotal > 0) {
                        $(tr).css({
                            'color': '#FF00FF',
                            'font-weight': 'bold'
                        });
                    } else {
                        // Restablecer estilos si ya no cumple la condición
                        $(tr).css({
                            'color': '',
                            'font-weight': ''
                        });
                    }

                    row.data(data).draw();
                }
            }
        })

        ///////////////////////////////////// EVENTS TABS //////////////////////////////////////
        $('.nav-link').on('shown.bs.tab', () => {

            this.ctx.oTable_TableServicios.fnDraw()
            this.ctx.oTable_TableFarmacia.fnDraw()
            this.ctx.oTable_TableConsolidado.fnDraw()
        })
        ///////////////////////////////////// EVENTS TABS //////////////////////////////////////

        ///////////////////////////////////// EVENTS SELECT //////////////////////////////////////
        $('#cboSeleccionarCuenta').on('change', async () => {
            let idCuentaAtencion = $('#cboSeleccionarCuenta').val()
            $('#txtNroCuentaBusq').val($('#cboSeleccionarCuenta').val())
            await this.ctx.actions.BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion)
        })
        $('#cboFuenteFinancimiento').on('change', async () => {
            await this.ctx.actions.ListarProductoPlanPorFuenteFinanciamiento($('#cboFuenteFinancimiento').val())
        })
        ///////////////////////////////////// EVENTS SELECT //////////////////////////////////////

        ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
        $('#modalBusquedaCuentasPaciente').on('shown.bs.modal', () => {
            this.ctx.actions.TableListaCuentasPacientesBusquedafnDraw()
        });
        ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
    }


}