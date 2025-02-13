import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js"

async function paginar(req, res, next) {
    try {
        let { limite = 5, pagina = 1, ordenacao = "_id:-1" } = req.query;

        let [campoOrdenacao, ordem] = ordenacao.split(":");

        limite = parseInt(limite);
        pagina = parseInt(pagina);
        ordem = parseInt(ordem);

        const resultado = req.resultado;

        if(limite > 0 && pagina > 0 && (ordem == 1 || ordem == -1)) {
            const resultadoPaginado = await resultado
            .collation({locale: "pt"})
            .sort({[campoOrdenacao]: ordem})
            .skip(limite * (pagina -1))
            .limit(limite)

            res.status(200).json(resultadoPaginado);
        } else {
            next(new RequisicaoIncorreta());
        }
    } catch(erro) {
        next(erro);
    }
}

export default paginar;