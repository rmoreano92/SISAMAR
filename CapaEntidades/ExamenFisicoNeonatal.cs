using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ExamenFisicoNeonatal
    {
        public int IdExamenNeonatal { get; set; }
        public int IdAtencion { get; set; }
        public int NroEvaluacion { get; set; }

        public int EstadoGeneralSensorio { get; set; }
        public string DEstadoGeneralSensorio { get; set; }
        public string EEstadoGeneralSensorio { get; set; }

        public int Piel { get; set; }
        public string DPiel { get; set; }

        public int Craneo { get; set; }
        public string DCraneo { get; set; }

        public int PabellonAuricular { get; set; }
        public string DPabellonAuricular { get; set; }

        public int Cara { get; set; }
        public string DCara { get; set; }

        public int BocaORL { get; set; }
        public string DBocaORL { get; set; }

        public int Cuello { get; set; }
        public string DCuello { get; set; }

        public int Clavicula { get; set; }
        public string DClavicula { get; set; }

        public int ToraxSilv { get; set; }
        public string DToraxSilv { get; set; }

        public int Ojos { get; set; }               //KHOYOSI 230625
        public string DOjos { get; set; }           //KHOYOSI 230625

        public int ReflejoRojo { get; set; }               //KHOYOSI 240625
        public string DReflejoRojo { get; set; }           //KHOYOSI 240625

        public int AparatoCardioVascular { get; set; }
        public string DAparatoCardioVascular { get; set; }
        public string RAparatoCardioVascular { get; set; }

        public int Abdomen { get; set; }
        public string DAbdomen { get; set; }

        public int Ombligo { get; set; }
        public string DOmbligo { get; set; }

        public int Ano { get; set; }
        public string DAno { get; set; }

        public int Genitales { get; set; }
        public string DGenitales { get; set; }

        public int ExtSuperiores { get; set; }
        public string DExtSuperiores { get; set; }

        public int ExtInferiores { get; set; }
        public string DExtInferiores { get; set; }

        public int Columna { get; set; }
        public string DColumna { get; set; }

        public int SistemaNervioso { get; set; }
        public string DSistemaNervioso { get; set; }


        public string Relato { get; set; }
    }
}
