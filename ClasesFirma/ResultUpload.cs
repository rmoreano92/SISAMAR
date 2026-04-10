using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.ClasesFirma
{
    public class ResultUpload
    {
        public string signUrl { get; set; }
        public string code { get; set; }
        public int status { get; set; }
        public string documentId { get; set; }

        public List<DocumentFileMapperList> documentFileMapperList { get; set; }
        public string pathDownloadSignDocument { get; set; }
    }
}
