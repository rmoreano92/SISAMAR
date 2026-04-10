const Helpers = {
    inicializarChosen() {
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    inicializarDatepicker() {
        $(".maskFecha").datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
        });

        $.mask.definitions["D"] = "[0123]";
        $.mask.definitions["d"] = "[123456789]";
        $.mask.definitions["M"] = "[01]";
        $.mask.definitions["m"] = "[0123456789]";
        $.mask.definitions["a"] = "[12]";
        $.mask.definitions["b"] = "[0123456789]";
        $.mask.definitions["c"] = "[0123456789]";
        $.mask.definitions["d"] = "[0123456789]";
        $(".maskFecha").mask("Dd/Mm/abcd");

        $.mask.definitions["H"] = "[012]";
        $.mask.definitions["N"] = "[012345]";
        $.mask.definitions["n"] = "[0123456789]";
        $(".maskHora").mask("Hn:Nn");
    },

    toggleRowSelection(table, trElement) {
        if ($(trElement).hasClass('selected')) {
            $(trElement).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(trElement).addClass('selected');
        }
    },

    toggleRowSelectionReturnData(table, trElement) {
        table.$('tr.selected').removeClass('selected')
        $(trElement).addClass("selected")

        let objRow = table.api(true).row('.selected').data()

        return objRow
    }
}

export default Helpers