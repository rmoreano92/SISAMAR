namespace WebAppMaternidad.CapaEntidades
{
    public class ProductoCPT
    {
        public int idProductoCPT {  get; set; }
        public int cantidad { get; set; }
        public decimal precio { get; set; }
        public decimal importe { get; set; }
        public decimal totalPorPagar { get; set; }
        public decimal total { get; set; }
        public string labConfHIS { get; set; }
        public int grupoHIS { get; set; }
        public int subgrupoHIS { get; set; }
    }
}
