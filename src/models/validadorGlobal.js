import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
    validator: (value) => value.trim() !== "",
    message: (mensagem) => `O campo ${mensagem.path} foi fornecido em branco.` 
});