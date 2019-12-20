using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class CadastrarReservaViewModel
    {
        [Required(ErrorMessage = "Quantidade é obrigatório")]
        [Range(0.500, 1000, ErrorMessage = "Quantidade mínima de 1kg")]       
        public decimal Quantidade {get; set;}

        [Required(ErrorMessage = "Oferta é obrigatório")]       
        public int OfertaId {get; set;}


    }
}