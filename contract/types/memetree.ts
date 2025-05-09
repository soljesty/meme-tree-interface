/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/memetree.json`.
 */
export type Memetree = {
  "address": "F3MTcGwPoqES7a6X41mYnSAjad74jVGr8NsPuumePJLR",
  "metadata": {
    "name": "memetree",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "walletInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "myToken"
              }
            ]
          }
        },
        {
          "name": "marketingWallet",
          "docs": [
            "CHECK"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "myToken"
              }
            ]
          }
        },
        {
          "name": "myToken",
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "treasury",
          "docs": [
            "CHECK"
          ],
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "treasuryWallet",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "marketingWallet",
          "docs": [
            "CHECK"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "myToken"
              }
            ]
          }
        },
        {
          "name": "myToken",
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "treasury",
          "docs": [
            "CHECK"
          ],
          "writable": true
        },
        {
          "name": "targetWallet",
          "docs": [
            "CHECK"
          ],
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "discriminator": [
        163,
        46,
        74,
        168,
        216,
        123,
        133,
        98
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficiencyError",
      "msg": "Money is insufficient for transaction"
    }
  ],
  "types": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketingWallet",
            "type": "pubkey"
          },
          {
            "name": "treasuryWallet",
            "type": "pubkey"
          },
          {
            "name": "tokenAddr",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
