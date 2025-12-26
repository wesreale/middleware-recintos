const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// healthcheck
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Middleware Recintos ativo"
  });
});

// simulação empresa
app.post("/recintos/empresa", async (req, res) => {
  try {
    const { cnpj } = req.body;

    if (!cnpj) {
      return res.status(400).json({ error: "CNPJ é obrigatório" });
    }

    return res.json({
      cnpj,
      razaoSocial: "EMPRESA TESTE LTDA",
      situacao: "ATIVA",
      ambiente: "SIMULACAO"
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro interno" });
  }
});

// eventos recintos
app.post("/recintos/evento", async (req, res) => {
  try {

    // 👉 permite Initialize call do Bubble
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({
        status: "ok",
        message: "Initialize call do Bubble"
      });
    }

    const {
      tipo_evento,
      data_evento,
      recinto,
      veiculo,
      motorista
    } = req.body;

    const placa = veiculo?.placa;
    const cpf = motorista?.cpf;
    const codigo_recinto = recinto?.codigo;

    // 👉 validação REAL
    if (!placa || !codigo_recinto || !tipo_evento) {
      return res.status(400).json({
        status: "erro",
        message: "Campos obrigatórios não informados",
        recebido: req.body
      });
    }

    console.log("Evento recebido:", req.body);

    return res.json({
      status: "ok",
      message: "Evento recebido com sucesso",
      recebido_em: new Date(),
      dados: {
        tipo_evento,
        data_evento,
        placa,
        cpf,
        codigo_recinto
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "erro",
      message: "Erro interno no middleware"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Middleware rodando na porta ${PORT}`);
});
