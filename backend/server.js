require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://controle-financeiro-blue-zeta.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.log("Erro ao conectar", err);
  else console.log("Conectado ao MySQL");
});

//testando se o banco esta rodando
app.get("/", (req, res) => {
  res.json({ message: "Servidor rodando com sucesso" });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token nao fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalido" });
  }
};

app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senhaCriptografada], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email ja cadastrado" });
        }
        return res.status(500).json({ message: "Erro no servidor" });
      }
      res.status(201).json({ message: "Usuario cadastrado com sucesso" });
    });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }
  db.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (result.length === 0)
        return res.status(401).json({ message: "Usuario nao encontrado" });
      const user = result[0];
      const valido = await bcrypt.compare(senha, user.senha);
      if (!valido) return res.status(401).json({ message: "Senha incorreta" });
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({
        message: "Login realizado com sucesso",
        token,
        user: { id: user.id, nome: user.nome, email: user.email },
      });
    },
  );
});

app.get("/debito", authMiddleware, (req, res) => {
  const { mes, ano } = req.query;
  let sql = "SELECT * FROM debitos WHERE usuario_id = ?";
  const params = [req.user.id];

  if (mes && ano) {
    sql += " AND MONTH(registro) = ? AND YEAR(registro) = ?";
    params.push(mes, ano);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    res.json(result);
  });
});
app.get("/provento", authMiddleware, (req, res) => {
  const { mes, ano } = req.query;
  let sql = "SELECT * FROM proventos WHERE usuario_id = ?";
  const params = [req.user.id];

  if (mes && ano) {
    sql += " AND MONTH(registro) = ? AND YEAR(registro) = ?";
    params.push(mes, ano);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    res.json(result);
  });
});

app.get("/debito/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM debitos WHERE id = ? AND usuario_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (!result[0])
        return res.status(404).json({ message: "Debito nao encontrado" });
      res.json(result[0]);
    },
  );
});
app.get("/provento/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM proventos WHERE id = ? AND usuario_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (!result[0])
        return res.status(404).json({ message: "Provento nao encontrado" });
      res.json(result[0]);
    },
  );
});

app.post("/debito", authMiddleware, (req, res) => {
  const { categoria, tipo, nome, valor, parcela, registro } = req.body;
  if (!categoria || !tipo || !nome || !valor) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }
  const sql =
    "INSERT INTO debitos (usuario_id, categoria, tipo, nome, valor, parcela, registro) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sql,
    [
      req.user.id,
      categoria,
      tipo,
      nome,
      valor,
      parcela || null,
      registro || null,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      res.status(201).json({ message: "Debito cadastrado" });
    },
  );
});
app.post("/provento", authMiddleware, (req, res) => {
  const { categoria, tipo, nome, frequencia, valor, registro } = req.body;
  if (!categoria || !tipo || !nome || !frequencia || !valor) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }
  const sql =
    "INSERT INTO proventos (usuario_id, categoria, tipo, nome, frequencia, valor, registro) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sql,
    [req.user.id, categoria, tipo, nome, frequencia, valor, registro || null],
    (err) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      res.status(201).json({ message: "Provento cadastrado" });
    },
  );
});

app.put("/debito/:id", authMiddleware, (req, res) => {
  const debitoId = req.params.id;
  const usuarioId = req.user.id;
  const { categoria, tipo, nome, valor, parcela, registro } = req.body;
  db.query(
    "SELECT * FROM debitos WHERE id = ? AND usuario_id = ?",
    [debitoId, usuarioId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (result.length === 0)
        return res.status(403).json({ message: "Sem permissão para editar" });
      const sql =
        "UPDATE debitos SET categoria=?, tipo=?, nome=?, valor=?, parcela=?, registro=? WHERE id=?";
      db.query(
        sql,
        [
          categoria,
          tipo,
          nome,
          valor,
          parcela || null,
          registro || null,
          debitoId,
        ],
        (err) => {
          if (err) return res.status(500).json({ message: "Erro no servidor" });
          res.json({ message: "Atualizado com sucesso" });
        },
      );
    },
  );
});
app.put("/provento/:id", authMiddleware, (req, res) => {
  const proventoId = req.params.id;
  const usuarioId = req.user.id;
  const { categoria, tipo, nome, frequencia, valor, registro } = req.body;
  db.query(
    "SELECT * FROM proventos WHERE id = ? AND usuario_id = ?",
    [proventoId, usuarioId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      if (result.length === 0)
        return res.status(403).json({ message: "Sem permissão para editar" });
      const sql =
        "UPDATE proventos SET categoria=?, tipo=?, nome=?, frequencia=?, valor=?, registro=? WHERE id=?";
      db.query(
        sql,
        [
          categoria,
          tipo,
          nome,
          frequencia,
          valor,
          registro || null,
          proventoId,
        ],
        (err) => {
          if (err) return res.status(500).json({ message: "Erro no servidor" });
          res.json({ message: "Atualizado com sucesso" });
        },
      );
    },
  );
});

app.delete("/debito/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM debitos WHERE id = ? AND usuario_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Erro interno no servidor" });
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Sem permissao para excluir" });
      res.json({ message: "Atualizado com sucesso" });
    },
  );
});
app.delete("/provento/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM proventos WHERE id = ? AND usuario_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Erro interno no servidor" });
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Sem permissao para excluir" });
      res.json({ message: "Atualizado com sucesso" });
    },
  );
});

app.get("/resumo", authMiddleware, (req, res) => {
  const { mes, ano } = req.query;

  const sql = `
        SELECT 
            (SELECT COALESCE(SUM(valor), 0) FROM proventos WHERE usuario_id = ? AND MONTH(registro) = ? AND YEAR(registro) = ?) AS totalProventos,
            (SELECT COALESCE(SUM(valor), 0) FROM debitos WHERE usuario_id = ? AND MONTH(registro) = ? AND YEAR(registro) = ?) AS totalDebitos
    `;

  db.query(
    sql,
    [req.user.id, mes, ano, req.user.id, mes, ano],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erro no servidor" });
      const { totalProventos, totalDebitos } = result[0];
      res.json({
        totalProventos,
        totalDebitos,
        economia: totalProventos - totalDebitos,
      });
    },
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
