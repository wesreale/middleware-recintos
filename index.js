const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// rota de teste (healthcheck)
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Middleware Recintos ativo"
  });
});

// rota que o Bubble vai chamar
app.post("/recintos/empresa", async (req, res) => {
  try {
    const { cnpj } = req.body;

    if (!cnpj) {
      return res.status(400).json({ error: "CNPJ é obrigatório" });
    }

    // 🔴 SIMULAÇÃO por enquanto
    // aqui no futuro entra a chamada real para a Receita
    const respostaSimulada = {
      cnpj,
      razaoSocial: "EMPRESA TESTE LTDA",
      situacao: "ATIVA",
      ambiente: "SIMULACAO"
    };

    return res.json(respostaSimulada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no middleware" });
  }
});

const PORT = process.env.PORT || 3000;
// rota para receber eventos do Bubble
app.post("/recintos/evento", async (req, res) => {
  try {
    const {
      placa,
      cpf,
      codigo_recinto,
      tipo_evento,
      data_evento
    } = req.body;

    // validação básica
    if (!placa || !codigo_recinto || !tipo_evento) {
      return res.status(400).json({
        status: "erro",
        message: "Campos obrigatórios não informados"
      });
    }

    console.log("Evento recebido do Bubble:", req.body);

    // por enquanto só devolvemos sucesso
    return res.json({
      status: "ok",
      message: "Evento recebido com sucesso",
      recebido_em: new Date(),
      dados: req.body
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "erro",
      message: "Erro interno no middleware"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Middleware rodando na porta ${PORT}`);
});
