using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domains;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class FiltroRepository : IFiltro
    {
        public async Task<List<Oferta>> BuscarPorNome(string NomeProduto)
        {
           using(CoorganicasContext _contexto = new CoorganicasContext()){

                var oferta =  await _contexto.Oferta.Include("Usuario").Include("Produto").Where(x => x.Produto.Nome.StartsWith(NomeProduto)).ToListAsync();
                                
                return oferta;
            }
        }

        public async Task<List<Oferta>> Listar()
        {
            using(CoorganicasContext _contexto = new CoorganicasContext()){

                var oferta =  await _contexto.Oferta.Include("Usuario").Include("Produto").ToListAsync();
                                
                return oferta;
            }
        }

       


    }
}