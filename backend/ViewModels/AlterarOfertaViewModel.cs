using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class AlterarOfertaViewModel
    {
        
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Informe a sua cidade")]        
        public string Cidade { get; set; }

      
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Informe a sua Região")]        
        public string Regiao { get; set; }

        
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe a descrição")]
        public string Descricao {get; set;}

        
        public decimal Quantidade{get;set;}

        
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Informa a quantidade de dias")]          
        public string Validade { get; set; }

        
        public double preco{get;set;}

        
        public int ProdutoId {get; set;}
    }
}