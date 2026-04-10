var recognitionSpeech = new webkitSpeechRecognition();
var dataIdSpeech = "";
var Speech = {

    Eventos() {
        //const child = document.getElementById('speech');

        $('.speech').on('click', function handleClick(event) {
            // 👇️ "parent"            
            dataIdSpeech = $(this).attr("data-speech");            
            //console.log(dataIdSpeech);
            $("#SpeechModal").modal("show");
        });

        $('#cerrarModalSpeech').on('click', function handleClick(event) {
            $("#SpeechModal").modal("hide");
        });

        $("#SpeechModal").on('show.bs.modal', function () {
            Speech.IniciarReconocimientoVoz();
            //alert("Esta accion se ejecuta al cerrar el modal");
        });

        $("#SpeechModal").on('hidden.bs.modal', function () {
            Speech.DetenerReconocimientoVoz();
            $("#" + dataIdSpeech).val($("#speechTextRec").val());
            //alert("Esta accion se ejecuta al cerrar el modal");
        });

        //console.log("EVNETOS");
    },

    IniciarReconocimientoVoz() {
        recognitionSpeech.start();
    },

    DetenerReconocimientoVoz() {
        recognitionSpeech.stop();
    },

    IniciarScript() {
        Speech.Eventos();
             
        recognitionSpeech.continuous = true;
        recognitionSpeech.lang = "es";
              
        recognitionSpeech.onresult = function (event) {
            console.log("EVENTO");
            finalResult = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    confianza = event.results[0][0].confidence;
                    finalResult = event.results[i][0].transcript;
                    //$('#search_input').val(finalResult);                    
                    $("#speechTextRec").val($("#speechTextRec").val() + finalResult);
                    console.log('Estoy seguro al ' + confianza + ' % que dijo ' + finalResult)
                }
            }
        };
    }
}