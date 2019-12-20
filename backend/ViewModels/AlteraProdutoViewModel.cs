using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class AlteraProdutoViewModel
    {
       
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Informe o nome do produto")]
        public string Nome {get; set;}

       
        public string ImagemProduto { get; set; }

    }
}