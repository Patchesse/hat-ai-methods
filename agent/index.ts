import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ClaimVault, FtBalanceOf } from "./contract_types";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

interface FunctionCallAction {
  type: "FunctionCall";
  params: {
    methodName: string;
    args: object;
    gas: string;
    deposit: string;
  };
}

// POST: /api/get_last_vault
app.post("/api/get_last_vault", (req: Request, res: Response) => {
  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "get_last_vault",
      args: {},
      gas: "10000000000000",
      deposit: "0",
    },
  };

  return res.json(functionCall);
});

// POST: /api/claim_vault
app.post("/api/claim_vault", (req: Request, res: Response) => {
  const { index } = req.body as ClaimVault;

  if (typeof index !== "number") {
    return res.status(400).json({ error: "index must be a number" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "claim_vault",
      args: { index },
      gas: "10000000000000",
      deposit: "0",
    },
  };

  return res.json(functionCall);
});

// POST: /api/get_auction_info
app.post("/api/get_auction_info", (req: Request, res: Response) => {
  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "get_auction_info",
      args: {},
      gas: "10000000000000",
      deposit: "0",
    },
  };

  return res.json(functionCall);
});

// POST: /api/start_or_place_bid
app.post("/api/start_or_place_bid", (req: Request, res: Response) => {
  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "start_or_place_bid",
      args: {}, // Si se necesitan parámetros, agrégalos aquí
      gas: "30000000000000",
      deposit: "1", // Modifica si se requiere un depósito diferente
    },
  };

  return res.json(functionCall);
});

// POST: /api/claim_tokens
app.post("/api/claim_tokens", (req: Request, res: Response) => {
  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "claim_tokens",
      args: {}, // Si se necesitan parámetros, agrégalos aquí
      gas: "30000000000000",
      deposit: "0",
    },
  };

  return res.json(functionCall);
});

// POST: /api/ft_balance_of
app.post("/api/ft_balance_of", (req: Request, res: Response) => {
  const { account_id } = req.body as FtBalanceOf;

  if (!account_id) {
    return res.status(400).json({ error: "account_id is required" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "ft_balance_of",
      args: { account_id },
      gas: "10000000000000",
      deposit: "0",
    },
  };

  return res.json(functionCall);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
