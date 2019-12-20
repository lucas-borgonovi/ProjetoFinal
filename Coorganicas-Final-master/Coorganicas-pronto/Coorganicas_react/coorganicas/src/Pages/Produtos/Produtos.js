import React, { Component } from 'react';

import { MDBDataTable, MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter,  MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from 'mdbreact'; // MDBInput
import Axios from 'axios';
import toastr from 'toastr';
//import produtoImg from '../../img/produtos/Agrupar49.png';
import Contato from '../../Componentes/Contato/Contato';
import '../../Assets/css/produtos.css';
import '../../Assets/css/estilo.css'
// import {Link} from 'react-router-dom';
import Header from '../../Componentes/Header/Header';
import Footer from '../../Componentes/Footer/Footer';
import {Link,withRouter} from 'react-router-dom';
import { usuarioAutenticado, parseJwt } from '../../Services/auth';


toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "10000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

class Produto extends Component {    
    constructor(props) {
        super(props);

        this.state = {
            modal : false,
            modal13: false,

            produtos : [],
            IdProduto : "",

            ProdutosPorPagina : [],
            TotalProdutos : 0,
            Quantidade_Por_Pagina: 9,
            Pg : 1,
            QtdPaginas : 0,
            
            TodasOfertas : [],
            ListaOferta : [],

            Telefones : [],
            value: "",
            
            isLoading : false,

            Cooperativa : "",
            IdOferta : "",

            contato : {
              telefone : "",
              dados  : ""
            },
            
            ProdutoNome : "",

            // Não Esquecer de colocar um botão para limpar os filtros e colcar esse objeto como padrão
            filtrarOferta : {
              produto : "", // Definir como vazio para validar quando o usuario clicar no filtrar sem informar os filtros
              cidade : "Selecionar cidade",
              regiao : "Selecionar região",
              validade : "Selecionar validade"
            },

            filtrado : false
        }

    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleForm = () => {
        this.setState({
            modal13: !this.state.modal13
        });

        if(this.state.modal13 === false) {
            this.setState({value : 0});
        }
    }

     // Antes de carregar nosso Dom
    UNSAFE_componentWillMount() {
       
    }
       
        
    // Após renderizar o componente
    async componentDidMount() {
      console.log("Carregado...");
      
      await this.ListarProdutosPorPagina();
      await this.ListarProdutos();

      this.PegarTelefone();
      
      //await this.ListarOfertas();

      this.setState({ QtdPaginas : Math.ceil(this.state.TotalProdutos / this.state.Quantidade_Por_Pagina)});
      console.log("Qtd: ",this.state.QtdPaginas);
           
      
    }

    
    // Quando a uma atualização no componente
    componentDidUpdate() {
      console.log("Atualizando...");
    }
    

   async ListarProdutos() {     
       
     await fetch("http://localhost:5000/api/produto")
            .then(response => response.json())
            .then(data => {
                this.setState({ produtos : data });
                this.setState({TotalProdutos : this.state.produtos.length})
                console.log(data);
                console.log(this.state.TotalProdutos);
             })
            .catch(error => console.log(error));       
    }

    async ListarProdutosPorPagina() {
        let config = {
            headers: {
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin":"*" // Cors
            }
        }

      let pular = (this.state.Pg - 1) * this.state.Quantidade_Por_Pagina;
      let pegar = this.state.Quantidade_Por_Pagina;
      console.log("Pula: ", pular)

     await Axios.get(`http://localhost:5000/api/produto/paginacao/${pular}/${pegar}`,config)
      .then(response => {
        console.log("Axios: ", response.data);
        this.setState({ProdutosPorPagina : response.data});
      })
      .catch(error => {
        console.log(error);
      });

    }

   async ListarOfertas() {
      let config = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*" // Cors
        }
       }
              
      await Axios.get("http://localhost:5000/api/oferta", config)
      .then(response => {
        console.log("Ofertas: ", response.data);
        this.setState({TodasOfertas : response.data});
      
      })
      .catch(error => {
        console.log(error);
      });

    }
  
   PegarTelefone = () => {
      let config = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*" // Cors
        }
      }
      
     Axios.get(`http://localhost:5000/api/telefone`, config)
      .then(response => {        
        this.setState({Telefones : response.data});   
        console.log("Tel: ", this.state.Telefones);
      })
      .catch(error => {
        console.log(error);
      });     
  }
  
   async VerOfertas(id) {
        // Abrir Modal
        console.log("Id do Produto: ", id);
        this.setState({IdProduto : id});
        await this.ListarOfertas();
        
        let OfertaFiltrada = [];

        let options = {
          year: 'numeric', month: 'numeric', day: 'numeric',         
          hour12: false,
          timeZone: 'America/Sao_Paulo' 
        };
        
        this.state.TodasOfertas.map(async function(oferta){
            console.log("Oferta: ", oferta)
            if(oferta.produtoId === id) {
              let Obj = {} //new Object();

              let Telefone = "";

              this.state.Telefones.forEach(element => {
                    if(element.usuarioId === oferta.usuario.usuarioId) {
                        Telefone = element.telefone1;
                    }
              });

              // Obj.ações = <MDBBtn color="purple" size="sm" onClick={() => this.ReservarProduto(oferta, Telefone)}>Reservar</MDBBtn>;
              Obj.ações = <button className="btns1" onClick={() => this.ReservarProduto(oferta, Telefone)}>Reservar</button>;
              Obj.produto = oferta.produto.nome;
              Obj.descrição = oferta.descricao;
              Obj.cidade = oferta.cidade;
              Obj.região = oferta.regiao;
              Obj.preço = "R$: " + oferta.preco.toFixed(2);
              Obj.quantidade = oferta.quantidade.toFixed(3) + " Kg";
              Obj.validade = new Intl.DateTimeFormat('pt-BR', options).format(Date.parse(oferta.validade))
              Obj.cooperativa = oferta.usuario.nome;
              Obj.contato = Telefone ? Telefone : "Sem Telefone";

              OfertaFiltrada.push(Obj);
            }
            
         

         }.bind(this));
        
         if(OfertaFiltrada.length !== 0){

           this.setState({ListaOferta : OfertaFiltrada});
           
           this.toggle();

         } else {
           toastr.info("Esse produto não está sendo ofertado no momento!", "Desculpe :( ");
         }
    }

    ReservarProduto = (Oferta, Telefone) => {
      console.log("IdOferta: ", Oferta.ofertaId )
      console.log("Nome: ", Oferta.usuario.nome)

      this.setState({Cooperativa : Oferta.usuario.nome});
      this.setState({IdOferta : Oferta.ofertaId});
      this.setState({contato : {
        telefone : Telefone,
        dados : Oferta
      }})
      this.setState({ProdutoNome : Oferta.produto.nome})
      this.toggleForm();      

    }

    ConcluirReserva = () => {
      console.log("Concluir Reserva");
      let config = {
            headers: {
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas")
            }
        }
        console.log("valor", this.state.value)
        console.log("Id", this.state.IdOferta)
        if(this.state.value > 0) {
            Axios.post("http://localhost:5000/api/reserva",{
                quantidade : this.state.value,
                ofertaId : this.state.IdOferta
    
            }, config)
            .then((response) => {                  
                console.log("Resp: ", response.data);
                if(response.status === 200) {
                  toastr.success(`Sua reserva foi feita você tera até 5 dias para entrar em contato com a cooperativa ${this.state.Cooperativa}.`, response.data.mensagem);                  
                  
                  if(this.state.filtrado === false) {                   
                      this.VerOfertas(this.state.IdProduto);
                      this.toggle();
                      // Fechar Form
                      this.toggleForm();

                  } else {                     
                      // Fechar Form
                      this.toggleForm();
                      
                      // Fechar Datable
                      this.toggle();
                      
                      //
                      
                      if(this.state.filtrado === true) {
                        this.FiltrarOferta();
                      }
                  }


                } else {
                  toastr.info(response.data.mensagem + ".", "Atenção!");
                }                  
    
            })
            .catch((erro) => {
              console.log(erro.status);
              toastr.error("Não foi possível efetuar sua reserva")
            })
        }
        else {
          toastr.info("A quantidade não foi informada.", "Atenção!");
        }


    }
    

    VisualizarProduto = (event) => {
        event.preventDefault();
    }

    SetPg = (row) => {
      this.setState({Pg : row})
      console.log("Pagina: ", this.state.Pg);
      setTimeout(() => {
        this.ListarProdutosPorPagina();
      }, 380);
    }

    renderPagina = (row) => {
      if(row === this.state.Pg){
        return  <MDBPageItem onClick={() => this.SetPg(row)} key={row} active>
                  <MDBPageNav>
                      {row}
                  </MDBPageNav>
                </MDBPageItem>  
         
      } else {
        return  <MDBPageItem onClick={() => this.SetPg(row)} key={row}>
                  <MDBPageNav>
                      {row}
                  </MDBPageNav>
                </MDBPageItem>         

      }


    }

    decrease = () => {
      if(this.state.value > 0) {
        this.setState({ value: parseFloat(this.state.value - 0.500)});
      }
    }
  
    increase = () => {
      this.setState({ value: parseFloat(this.state.value + 0.500)});     
    }
    
    AtulizaValueReserva = (input) => {
      this.setState({ value : parseFloat(input.target.value)});
    }

    // Utilizamos para atualizar os states dos inputs
    AtualizaFiltroOferta = (input) => {    

      this.setState({ 
        filtrarOferta : {
          ...this.state.filtrarOferta, [input.target.name] : input.target.value }
      });  
     
    }

  FiltrarOferta = (event) => {

      if(this.state.filtrado === false) {
        event.preventDefault();
      }

      console.log("Filtrando Oferta");
      
      let config = {
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin":"*" // Cors
        }
       }      
      
    if(this.state.filtrarOferta.regiao !== "Selecionar região" || this.state.filtrarOferta.cidade !== "Selecionar cidade"
        || this.state.filtrarOferta.validade !== "Selecionar validade" || this.state.filtrarOferta.produto !== ""
    
    ) {
      
      Axios.post("http://localhost:5000/api/filtro",{
           produto : this.state.filtrarOferta.produto,
           regiao : this.state.filtrarOferta.regiao !== "Selecionar região" ? this.state.filtrarOferta.regiao : "",
           cidade : this.state.filtrarOferta.cidade !== "Selecionar cidade" ? this.state.filtrarOferta.cidade : "",
           validade : this.state.filtrarOferta.validade !== "Selecionar validade" ? this.state.filtrarOferta.validade : "",
      }, config)
       .then(response => {
         console.log("Ofertas filtro: ", response.data);          
         
         if(response.status === 200) {

           this.setState({TodasOfertas : response.data});

           let OfertaFiltrada = [];

           let options = {
             year: 'numeric', month: 'numeric', day: 'numeric',         
             hour12: false,
             timeZone: 'America/Sao_Paulo' 
           };
           
           this.state.TodasOfertas.map(async function(oferta){
               console.log("Oferta Modal: ", oferta)
              
                 let Obj = {} //new Object();
   
                 let Telefone = "";
                 //let Coooperativa = "";


                 console.log("telefones", this.state.Telefones)
   
                 this.state.Telefones.forEach(element => {
                       if(element.usuarioId === oferta.usuarioId) {
                           Telefone = element.telefone1;
                           //Coooperativa = element.usuario.nome;
                       }
                 });    
                
                 Obj.ações = <button className="btns1" onClick={() => this.ReservarProduto(oferta, Telefone)}>Reservar</button>;
                 Obj.produto = oferta.produto.nome;
                 Obj.descrição = oferta.descricao;
                 Obj.cidade = oferta.cidade;
                 Obj.região = oferta.regiao;
                 Obj.preço = "R$: " + oferta.preco.toFixed(2);
                 Obj.quantidade = oferta.quantidade.toFixed(3) + " Kg";
                 Obj.validade = new Intl.DateTimeFormat('pt-BR', options).format(Date.parse(oferta.validade))
                 Obj.cooperativa = oferta.usuario.nome;//Coooperativa;
                 Obj.contato = Telefone ? Telefone : "Sem telefone";
   
                 OfertaFiltrada.push(Obj);
                 //this.setState({ListaOferta : ""})
   
            }.bind(this));
           
           
            this.setState({ListaOferta : OfertaFiltrada});

            this.setState({filtrado : true});

            this.toggle();

         } else {
           toastr.warning(response.data.mensagem, "Desculpe :(")
           console.log("Ret: ", response.data);
         }

       })
       .catch((error) => {
          console.log("erro ",error.response);
          if(error.response.status === 404) {
            toastr.warning(error.response.data.mensagem+".", "Desculpe :(");

          }
       });

    } else {
      toastr.info("Filtros vazios.", "Atenção!");
    }
  }

  LimparFiltros = () => {

      this.setState({ filtrarOferta : {
        produto : "", // Definir como vazio para validar quando o usuario clicar no filtrar sem informar os filtros
        cidade : "Selecionar cidade",
        regiao : "Selecionar região",
        validade : "Selecionar validade"
      }});
      
      this.setState({filtrado : false});
      this.toggle();    

  }
   
  render(){

      let paginas = [];
     
      for(let i = 0; i < this.state.QtdPaginas; i++) {      
          paginas.push(i + 1);
      }      

      const data = {

          columns: [
            {
              label: 'Ações',
              field: 'ações',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Cooperativa',
              field: 'cooperativa',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Contato',
              field: 'contato',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Produto',
              field: 'produto',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Descrição',
              field: 'descrição',
              sort: 'asc',
              width: 270
            },
            {
              label: 'Cidade',
              field: 'cidade',
              sort: 'asc',
              width: 200
            },
            {
              label: 'Região',
              field: 'região',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Preço',
              field: 'preço',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Quantidade Por Kilo',
              field: 'quantidade',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Validade',
              field: 'validade',
              sort: 'asc',
              width: 100
            }           
           
          ],         
          rows : this.state.ListaOferta          
            
      }
               
        return( 
            <div>
                <Header/>
                
                
                <div className="container_produto">
                    <form method="get" id="formde_busca" className="espaço_busca">
                      <label>
                          <input 
                              input type="text"
                              id="nomeProduto" 
                              placeholder="Digite o produto..." 
                              className="form_busca"
                              aria-label="buscar produto"
                              name = "produto"
                              value = {this.state.filtrarOferta.produto}
                              onChange={this.AtualizaFiltroOferta}
                          />
                      </label>

                    </form>

                    <form id="formde_filtro" className="filtro" onSubmit={this.FiltrarOferta}>
                        <select name="cidade" value={this.state.filtrarOferta.cidade} onChange={this.AtualizaFiltroOferta}>
                            <option value="Selecionar cidade" disabled>Selecionar cidade</option>
                            <option value="são paulo">São Paulo</option>                            
                        </select>
                        <select name="regiao" value={this.state.filtrarOferta.regiao} onChange={this.AtualizaFiltroOferta}>
                            <option value="Selecionar região" disabled>Selecionar região</option>
                            <option value="norte">Região Norte</option>
                            <option value="sul">Região Sul</option>
                            <option value="leste">Região Leste</option>
                            <option value="oeste">Região Oeste</option>
                            <option value="central">Região Central</option>
                        </select>
                        <select name="validade" value={this.state.filtrarOferta.validade} onChange={this.AtualizaFiltroOferta}>
                            <option value="Selecionar validade" disabled>Selecionar validade</option>
                            <option value={5}>Até 5 dias</option>
                            <option value={10}>Até 10 dias</option>
                            <option value={15}>Até 15 dias</option>
                            <option value={20}>Até 20 dias</option>
                        </select>
                        <label>
                            <button type="submit" class="btns_" id="filtro">Filtrar</button>
                        </label>
                      </form>

                    <form id="produtos" className="produtos_todo" onSubmit={this.VisualizarProduto}>
                        {
                            this.state.ProdutosPorPagina.map(function(produto){
                                
                                return(
                                    <div className="card_produtos" key={produto.produtoId}>
                                      {/* produto.imagemProduto != null ? produto.imagemProduto : produtoImg                     */}
                                      {/* produto.imagemProduto && this.PegarImagem(produto.imagemProduto)  */}
                                        <img src={produto.imagemProduto && require(`../../Assets/images/produtos/${produto.imagemProduto}`)} alt="teste"/>
                                <p className="p_produto_aparecer">{produto.nome}</p>
                                        <div className="card_btn">
                                            <label>
                                              
                                            {usuarioAutenticado() && parseJwt().Role === "Agricultor" ?(
                                    <>
                                      <Link to="/Perfil"><button type="button" className="btn2">Fornecer</button></Link>
                                     </>
                                     ) : (
                                        <>
                                        <Link to="/login"><button type="button" className="btn2">Fornecer</button></Link>
                                        </>
                                       )} 
                                            </label>
                                            <label>
                                                <button type="submit" className="btn1" onClick={() => this.VerOfertas(produto.produtoId)}>Ver Ofertas</button>
                                            </label>
                                        </div>
                                    </div>
                                )

                            }.bind(this))
                        }
                       
                     </form>   
                     <MDBRow className="mdbRow">
                            <MDBCol>
                                <MDBPagination className="mb-5" color="red" >
                                <MDBPageItem onClick={() => this.SetPg(1)}>
                                    <MDBPageNav aria-label="Previous">
                                      <span aria-hidden="true" >Primeira</span>
                                    </MDBPageNav>
                                </MDBPageItem>
                                    {
                                                                             
                                      paginas.map(this.renderPagina)
                                      
                                    }

                                    {/* <MDBPageItem>
                                        <MDBPageNav>
                                          1
                                        </MDBPageNav>
                                    </MDBPageItem>                                                                 */}
                                <MDBPageItem onClick={() => this.SetPg(this.state.QtdPaginas)}>
                                    <MDBPageNav aria-label="Previous">
                                    <span aria-hidden="true">Última</span>
                                    </MDBPageNav>
                                </MDBPageItem>
                                </MDBPagination>
                            </MDBCol>
                    </MDBRow>                    
                </div>
               
                  <div className="container">                        
                      <MDBContainer>                           
                          
                          <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="fluid">
                          <MDBModalHeader toggle={() => this.LimparFiltros()}>Ofertas</MDBModalHeader>
                              <MDBModalBody>
                                  <MDBDataTable                                      
                                      responsive                                        
                                      striped
                                      bordered
                                      small
                                      hover
                                      barReverse
                                      entriesLabel = "Mostrar entradas"
                                      infoLabel={["Mostrando de", "até", "de", "registros"]}
                                      paginationLabel={["Anterior", "Próximo"]}
                                      searchLabel="Procurar"
                                      theadColor="dark"                                      
                                      theadTextWhite 
                                      entries={5}
                                      entriesOptions={[ 5, 10, 15, 20]}                                       
                                      noRecordsFoundLabel="Zero records to render"
                                      data={data}
                                  />
                              </MDBModalBody>
                              <MDBModalFooter>
                                  {/* <MDBBtn color="warning" onClick={this.toggle}>Fechar</MDBBtn>                                        */}
                                  {/* <MDBBtn color="primary" type="submit">Salvar</MDBBtn> */}
                                  <button className="btns_fechar" onClick={() => this.LimparFiltros()}>Fechar</button>
                              </MDBModalFooter>
                          </MDBModal>
                          
                      </MDBContainer>
                      
                      <MDBContainer>                        
                        <MDBModal isOpen={this.state.modal13} toggle={this.toggleForm} size="md">
                          <MDBModalHeader toggle={this.toggleForm}>Reservar - {this.state.ProdutoNome} <i className="fas fa-shopping-cart"></i></MDBModalHeader>
                          <MDBModalBody>                                                       
                            <div className="centralizar_">
                              <div className="def-number-input number-input">
                                  <label className="label_prod centralizar_">Quantidade do produto</label><br/>
                                  <button onClick={this.decrease} className="minus"><i className="fas fa-minus"></i></button>
                                  <input className="quantity centralizar_" name="quantity" value={this.state.value} onChange={this.AtulizaValueReserva}
                                  type="number" step={0.500} min={0}/>
                                  <button onClick={this.increase} className="plus"><i className="fas fa-plus"></i></button>
                              </div>
                            </div>                            
                            <Contato telefone={this.state.contato.telefone} dados={this.state.contato.dados}/> 
                          </MDBModalBody>                          
                          <MDBModalFooter>                           
                              {/* <MDBBtn color="warning" onClick={this.toggleForm}>Fechar</MDBBtn> */}
                              {/* <MDBBtn color="purple" onClick={() => this.ConcluirReserva()}>Concluir Reserva</MDBBtn> */}
                              <button className="btns_fechar" onClick={this.toggleForm}>Fechar</button>
                              <button className="btns_concluir" onClick={() => this.ConcluirReserva()}>Efetivar</button>
                          </MDBModalFooter>                         
                        </MDBModal>
                    </MDBContainer>                     

                  </div>

                  <Footer/>
                
            </div>
        );
    }
    
}

export default Produto;