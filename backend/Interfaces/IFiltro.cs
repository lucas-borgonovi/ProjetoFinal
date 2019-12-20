using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domains;

namespace Backend.Interfaces
{
    public interface IFiltro
    {
        Task<List<Oferta>> BuscarPorNome(string NomeProduto);

        Task<List<Oferta>> Listar();
    }
}