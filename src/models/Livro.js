import mongoose from "mongoose";
//import { autorSchema } from "./Autor.js";

const livroSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    titulo: { 
        type: mongoose.Schema.Types.String, 
        required: [true, "O título do livro é obrigatório."] 
    },
    editora: { 
        type: mongoose.Schema.Types.String,
        required: [true, "A editora é obrigatória."],
        enum: {
            values: ["Casa do código", "Alura", "Classicos"],
            message: "A editora {VALUE} não é um valor permitido."
        }
    },
    preco: { type: mongoose.Schema.Types.Number },
    paginas: { 
        type: mongoose.Schema.Types.Number,
        // min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}."],
        // max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}."]
        validate: {
            validator: (value) => value >= 10 && value <= 500,
            message: "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}."
        }
    },
    autor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "autores",
        required: [true, "O(a) autor(a) é obrigatório."]
     }
}, { versionKey: false });

const livro = mongoose.model("livros", livroSchema);

export default livro;