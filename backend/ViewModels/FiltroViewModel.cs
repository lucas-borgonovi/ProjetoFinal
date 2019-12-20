using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class FiltroViewModel
    {
                
        // [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe o nome")]
        public string Cidade { get; set; }

        // [StringLength(255, MinimumLength = 1, ErrorMessage = "Informa a quantidade de dias")]          
        public string Validade { get; set; }

        // [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe o nome")]
        public string Regiao { get; set; }

       
        // [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe o nome")]
        public string Produto { get; set; }
 
    }
}