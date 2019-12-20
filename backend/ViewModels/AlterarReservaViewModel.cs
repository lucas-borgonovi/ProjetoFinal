using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class AlterarReservaViewModel
    {   
        [Range(0.500, 1000, ErrorMessage = "Quantidade Mínima é de 1kg")] 
        public decimal Quantidade {get; set;}                
        
    }
}