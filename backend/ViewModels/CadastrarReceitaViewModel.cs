using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class CadastrarReceitaViewModel
    {   
        [Required(ErrorMessage = "Nome da receita obrigatório")]
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe o título da receita")]
        public string Titulo {get; set;}

        [Required(ErrorMessage = "Conteúdo da receita obrigatório")]
        [StringLength(9999, MinimumLength = 1, ErrorMessage = "Limite de caracter deve ser até 255!")]
        public string Conteudo {get; set;}
        
        public string Imagem_Receita { get; set; }


    }
}