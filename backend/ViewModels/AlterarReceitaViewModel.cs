using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class AlterarReceitaViewModel
    {
       
        [StringLength(255, MinimumLength = 5, ErrorMessage = "Informe o título da receita")]
        public string Titulo {get; set;}

        
        [StringLength(255, MinimumLength = 10, ErrorMessage = "Informe o conteudo")]
        public string Conteudo {get; set;}
       
        public string Imagem_Receita { get; set; }

    }
}