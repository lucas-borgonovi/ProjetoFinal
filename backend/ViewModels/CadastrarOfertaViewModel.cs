using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class CadastrarOfertaViewModel
    {
        [Required(ErrorMessage = "Cidade é obrigatório")]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Informe a sua cidade")]        
        public string Cidade { get; set; }

        [Required(ErrorMessage = "Região é obrigatório")]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Informe a sua Região")]        
        public string Regiao { get; set; }

        [Required(ErrorMessage = "Descrição da oferta obrigatório")]
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Informe a descrição")]
        public string Descricao {get; set;}

        [Required(ErrorMessage="Quantidade do produto obrigatório")]
        public decimal Quantidade{get;set;}

        [Required(ErrorMessage="Validade do produto obrigatório")]
        [StringLength(255, MinimumLength = 1, ErrorMessage = "Informa a quantidade de dias")]          
        public string Validade { get; set; }

        [Required(ErrorMessage="Preço da oferta obrigatório")]
        public double preco{get;set;}

        [Required(ErrorMessage="Produto da oferta obrigatório")]
        public int ProdutoId {get; set;}




    }
}