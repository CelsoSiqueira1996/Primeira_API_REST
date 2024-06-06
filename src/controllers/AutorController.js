import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor } from "../models/index.js";

class AutorController {

    static listarAutores(req, res, next) {
        try{
            const listaAutores = autor.find();

            req.resultado = listaAutores;

            next();
        } catch(erro) {
            next(erro);
        }
    }

    static async listarAutor(req, res, next) {
        try{
            const autorEncontrado = await autor.findById(req.params.id);
            if(autorEncontrado) {
                res.status(200).json(autorEncontrado);
            } else {
                next(new NaoEncontrado("Id do Autor não localizado."))
            }
        } catch(erro) {
            next(erro);
        }
    }

    static async cadastrarAutor(req, res, next) {
        try {
            const novoAutor = await autor.create(req.body);
            res.status(201).json({message: "criado com sucesso", autor: novoAutor});
        } catch(erro) {
            next(erro);
        }
    }

    static async atualizarAutor(req, res, next) {
        try{
            const autorAtualizado = await autor.findByIdAndUpdate(req.params.id, req.body, {runValidators: true});
            if(autorAtualizado){
                res.status(200).json({message: "autor atualizado com sucesso"});
            } else {
                next(new NaoEncontrado("Id do Autor não localizado."));
            }
        } catch(erro) {
            next(erro);
        }
    }

    static async excluirAutor(req, res, next) {
        try{
            const autorExcluido = await autor.findByIdAndDelete(req.params.id);
            if(autorExcluido) {
                res.status(200).json({message: "autor excluído com sucesso", autor: autorExcluido});
            } else {
                next(new NaoEncontrado("Id do Autor não localizado."));
            }
        } catch(erro) {
            next(erro);
        }
    }
}

export default AutorController;