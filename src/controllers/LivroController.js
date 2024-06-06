import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor, livro } from "../models/index.js"

class LivroController {

    static listarLivros(req, res, next) {
        try{
            const buscaLivros = livro.find()
            .populate("autor");

            req.resultado = buscaLivros;

            next();
        } catch(erro) {
            next(erro);
        }
    }

    static async listarLivroPorId(req, res, next) {
        try{
            const id = req.params.id;
            const livroEncontrado = await livro.findById(id)
            .populate("autor", "nome")

            if(livroEncontrado) {
                res.status(200).json(livroEncontrado);
            } else {
                next(new NaoEncontrado("Id do Livro não localizado"))
            }
        } catch(erro) {
            next(erro);
        }
    }

    static async cadastrarLivro(req, res, next) {
        try {
            const idAutor = req.body.autor;
            const autorEncontrado = await autor.findById(idAutor);
            if(autorEncontrado) {
                const novoLivro = await livro.create(req.body);
                res.status(201).json({message: "criado com sucesso", livro: novoLivro});
            } else {
                next(new NaoEncontrado("Id do Autor não localizado."));
            }
        } catch(erro) {
            next(erro);
        }
    }

    static async atualizarLivro(req, res, next) {
        try{
            if(req.body.autor) {
                const autorEncontrado = await autor.findById(req.body.autor);
                if(!autorEncontrado) {
                    next(new NaoEncontrado("Id do Autor não localizado."));
                }
            }
            const id = req.params.id;
            const livroAtualizado = await livro.findByIdAndUpdate(id, req.body, {runValidators: true});
            if(livroAtualizado) {
                res.status(200).json({message: "livro atualizado com sucesso"});
            } else {
                next(new NaoEncontrado("Id do Livro não localizado"))
            }
        } catch(erro) {
            next(erro);
        }
    }

    static async excluirLivro(req, res, next) {
        try{
            const id = req.params.id;
            const livroExcluido = await livro.findByIdAndDelete(id);
            if(livroExcluido) {
                res.status(200).json({message: "livro excluído com sucesso", livro: livroExcluido});
            } else {
                next(new NaoEncontrado("Id do Livro não localizado"))
            }
        } catch(erro) {
            next(erro);
        }

    }

    static async listarLivrosPorFiltro(req, res, next) {
        try {
            // filtro OU
            // const busca = req.query;
            // const buscador = Object.keys(busca).map((chave) => ({[chave]: busca[chave]}));
            // const filtro = (buscador.length === 0)? [{}] : buscador;
            // const livrosFiltrados = await livro.find({$or: filtro});
            // filtro titulo AND editora
            // const regex = new RegExp(titulo, "i");

            const busca = await processaBusca(req.query);
            
            const livrosFiltrados = livro.find(busca)
            .populate("autor");

            req.resultado = livrosFiltrados;

            next();
        } catch(erro) {
            next(erro);
        }
    }    
    
};

async function processaBusca(parametros) {
    const { titulo, editora, maxPaginas, minPaginas, nomeAutor } = parametros;
    const busca = {};

    if(titulo) busca.titulo = { $regex: titulo, $options: "i" };
    if(editora) busca.editora = editora;
    if(minPaginas || maxPaginas) busca.paginas = {};
    if(minPaginas) busca.paginas.$gte = minPaginas;
    if(maxPaginas) busca.paginas.$lte = maxPaginas;
    if(nomeAutor) {
        const autorProcurado = await autor.find({nome: nomeAutor});        
        const idAutorProcurado = autorProcurado.map((autor) => autor._id);
        busca.autor = {$in: idAutorProcurado};
    }

    return busca;
}

export default LivroController;