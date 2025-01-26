import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ContractCallArgs, ChangeOwner, ClaimVault, FtOnTransfer, GetListDeposits, GetVaults, New, SetCountdownPeriodWithdraw, SetTreasury } from './contract_types';

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

const CONTRACT_ID = "vault.hat-coin.near";

app.post('/api/change_owner', (req: Request, res: Response) => {
  const { new_owner_id } = req.body as ChangeOwner;

  if (!new_owner_id) {
    return res.status(400).json({ error: "new_owner_id is required" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "change_owner",
      args: { new_owner_id },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/claim_vault', (req: Request, res: Response) => {
  const { index } = req.body as ClaimVault;

  if (typeof index !== 'number') {
    return res.status(400).json({ error: "index must be a number" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "claim_vault",
      args: { index },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/ft_on_transfer', (req: Request, res: Response) => {
  const { sender_id, amount, msg } = req.body as FtOnTransfer;

  if (!sender_id || !amount || !msg) {
    return res.status(400).json({ error: "sender_id, amount, and msg are required" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "ft_on_transfer",
      args: { sender_id, amount, msg },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/get_list_deposits', (req: Request, res: Response) => {
  const { from_index, limit } = req.body as GetListDeposits;

  if (typeof from_index !== 'number' || typeof limit !== 'number') {
    return res.status(400).json({ error: "from_index and limit must be numbers" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "get_list_deposits",
      args: { from_index, limit },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/get_vaults', (req: Request, res: Response) => {
  const { start_index, limit } = req.body as GetVaults;

  if (typeof start_index !== 'number' || typeof limit !== 'number') {
    return res.status(400).json({ error: "start_index and limit must be numbers" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "get_vaults",
      args: { start_index, limit },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/new', (req: Request, res: Response) => {
  const { ft_token_id, countdown_period_withdraw, owner_id, treasury_id, treasury_fee } = req.body as New;

  if (!ft_token_id || typeof countdown_period_withdraw !== 'number' || !owner_id || !treasury_id || typeof treasury_fee !== 'number') {
    return res.status(400).json({ error: "All fields are required and must be of correct type" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "new",
      args: { ft_token_id, countdown_period_withdraw, owner_id, treasury_id, treasury_fee },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/set_countdown_period_withdraw', (req: Request, res: Response) => {
  const { new_countdown } = req.body as SetCountdownPeriodWithdraw;

  if (typeof new_countdown !== 'number') {
    return res.status(400).json({ error: "new_countdown must be a number" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "set_countdown_period_withdraw",
      args: { new_countdown },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.post('/api/set_treasury', (req: Request, res: Response) => {
  const { new_treasury_id } = req.body as SetTreasury;

  if (!new_treasury_id) {
    return res.status(400).json({ error: "new_treasury_id is required" });
  }

  const functionCall: FunctionCallAction = {
    type: "FunctionCall",
    params: {
      methodName: "set_treasury",
      args: { new_treasury_id },
      gas: "10000000000000",
      deposit: "0"
    }
  };

  return res.json(functionCall);
});

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.get('/.well-known/ai-plugin.json', (req: Request, res: Response) => {
  dotenv.config();
  const url = JSON.parse(process.env.BITTE_CONFIG || '{}').url;

  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "Vault Hat Coin Contract Assistant",
      description: "You are an assistant designed to interact with the vault.hat-coin.near contract on the Near Protocol. Your main functions are:\n\n1. Use the /api/[function_name] endpoints to perform write operations. These endpoints will return valid function calls which you should be able to send. Ensure all required parameters are provided by the user as described in the paths section below.\n\n2. Use the /api/[function_name] endpoints to retrieve data from the contract.\n\nWhen performing write operations:\n- Ensure all required parameters are non-empty and of the correct type.\n- Avoid using any special characters or formatting that might cause issues with the contract.\n- If the user provides invalid input, kindly ask them to provide valid data according to the parameter specifications.\n\nWhen performing view operations:\n- Simply use the appropriate /api/[function_name] endpoint and return the result to the user.\n\nImportant: For all write operations, the endpoints will return a function call object. You should clearly indicate to the user that this is a function call that needs to be sent to the blockchain, and not the final result of the operation.",
      version: "1.0.0"
    },
    servers: [
      {
        url: url
      }
    ],
    "x-mb": {
      "account-id": "mypatchessewallet.near",
      "assistant": {
        "name": "Vault Hat Coin Assistant",
        "description": "An assistant for interacting with the vault.hat-coin.near contract.",
        "instructions": "You are an assistant designed to interact with the vault.hat-coin.near contract on the Near Protocol. Your main functions are:\n\n1. Use the /api/[function_name] endpoints to perform write operations. These endpoints will return valid function calls which you should be able to send. Ensure all required parameters are provided by the user as described in the paths section below.\n\n2. Use the /api/[function_name] endpoints to retrieve data from the contract.\n\nWhen performing write operations:\n- Ensure all required parameters are non-empty and of the correct type.\n- Avoid using any special characters or formatting that might cause issues with the contract.\n- If the user provides invalid input, kindly ask them to provide valid data according to the parameter specifications.\n\nWhen performing view operations:\n- Simply use the appropriate /api/[function_name] endpoint and return the result to the user.\n\nImportant: For all write operations, the endpoints will return a function call object. You should clearly indicate to the user that this is a function call that needs to be sent to the blockchain, and not the final result of the operation.",
        "tools": [{
          "type": "generate-transaction"
        }]
      }
    },
    paths: {
      "/api/change_owner": {
        post: {
          tags: ["Owner Management"],
          summary: "Change the owner of the vault",
          description: "This endpoint allows you to change the owner of the vault. Provide the new owner's account ID.",
          operationId: "change-owner",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    new_owner_id: {
                      type: "string",
                      description: "The new owner's account ID."
                    }
                  },
                  required: ["new_owner_id"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                new_owner_id: {
                                  type: "string"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/claim_vault": {
        post: {
          tags: ["Vault Management"],
          summary: "Claim a vault",
          description: "This endpoint allows you to claim a vault by providing the index of the vault.",
          operationId: "claim-vault",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    index: {
                      type: "integer",
                      description: "The index of the vault to claim."
                    }
                  },
                  required: ["index"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                index: {
                                  type: "integer"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/ft_on_transfer": {
        post: {
          tags: ["Token Management"],
          summary: "Handle FT on transfer",
          description: "This endpoint allows you to handle fungible token transfers.",
          operationId: "ft-on-transfer",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sender_id: {
                      type: "string",
                      description: "The account ID of the sender."
                    },
                    amount: {
                      type: "string",
                      description: "The amount of tokens being transferred."
                    },
                    msg: {
                      type: "string",
                      description: "Optional message."
                    }
                  },
                  required: ["sender_id", "amount", "msg"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                sender_id: {
                                  type: "string"
                                },
                                amount: {
                                  type: "string"
                                },
                                msg: {
                                  type: "string"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get_list_deposits": {
        post: {
          tags: ["Vault Management"],
          summary: "Get list of deposits",
          description: "This endpoint retrieves a list of deposits from the vault.",
          operationId: "get-list-deposits",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    from_index: {
                      type: "integer",
                      description: "The starting index for the list of deposits."
                    },
                    limit: {
                      type: "integer",
                      description: "The maximum number of deposits to retrieve."
                    }
                  },
                  required: ["from_index", "limit"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                from_index: {
                                  type: "integer"
                                },
                                limit: {
                                  type: "integer"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get_vaults": {
        post: {
          tags: ["Vault Management"],
          summary: "Get vaults",
          description: "This endpoint retrieves vaults starting from a specific index.",
          operationId: "get-vaults",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    start_index: {
                      type: "integer",
                      description: "The starting index for the vaults."
                    },
                    limit: {
                      type: "integer",
                      description: "The maximum number of vaults to retrieve."
                    }
                  },
                  required: ["start_index", "limit"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                start_index: {
                                  type: "integer"
                                },
                                limit: {
                                  type: "integer"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/new": {
        post: {
          tags: ["Vault Management"],
          summary: "Create a new vault",
          description: "This endpoint allows you to create a new vault with specified parameters.",
          operationId: "create-new-vault",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ft_token_id: {
                      type: "string",
                      description: "The fungible token ID."
                    },
                    countdown_period_withdraw: {
                      type: "integer",
                      description: "The countdown period for withdrawals."
                    },
                    owner_id: {
                      type: "string",
                      description: "The account ID of the owner."
                    },
                    treasury_id: {
                      type: "string",
                      description: "The treasury account ID."
                    },
                    treasury_fee: {
                      type: "integer",
                      description: "The fee for the treasury."
                    }
                  },
                  required: ["ft_token_id", "countdown_period_withdraw", "owner_id", "treasury_id", "treasury_fee"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                ft_token_id: {
                                  type: "string"
                                },
                                countdown_period_withdraw: {
                                  type: "integer"
                                },
                                owner_id: {
                                  type: "string"
                                },
                                treasury_id: {
                                  type: "string"
                                },
                                treasury_fee: {
                                  type: "integer"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/set_countdown_period_withdraw": {
        post: {
          tags: ["Vault Management"],
          summary: "Set countdown period for withdrawals",
          description: "This endpoint allows you to set a new countdown period for withdrawals.",
          operationId: "set-countdown-period-withdraw",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    new_countdown: {
                      type: "integer",
                      description: "The new countdown period."
                    }
                  },
                  required: ["new_countdown"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                new_countdown: {
                                  type: "integer"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/set_treasury": {
        post: {
          tags: ["Treasury Management"],
          summary: "Set new treasury ID",
          description: "This endpoint allows you to set a new treasury ID.",
          operationId: "set-treasury",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    new_treasury_id: {
                      type: "string",
                      description: "The new treasury account ID."
                    }
                  },
                  required: ["new_treasury_id"]
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response with function call object",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["FunctionCall"]
                        },
                        params: {
                          type: "object",
                          properties: {
                            methodName: {
                              type: "string"
                            },
                            args: {
                              type: "object",
                              properties: {
                                new_treasury_id: {
                                  type: "string"
                                }
                              }
                            },
                            gas: {
                              type: "string"
                            },
                            deposit: {
                              type: "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  res.json(openApiSpec);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});