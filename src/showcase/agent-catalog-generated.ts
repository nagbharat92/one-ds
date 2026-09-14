export const agentCatalogGeneratedFacts = {
  "button": {
    "api": [
      {
        "name": "variant",
        "type": "\"link\" | \"default\" | \"tertiary\" | \"primary\" | \"secondary\" | \"ghost\" | \"destructive\" | null | undefined",
        "required": false,
        "choices": [
          "default",
          "tertiary",
          "primary",
          "secondary",
          "ghost",
          "destructive",
          "link"
        ],
        "default": "tertiary",
        "sourceLine": 18,
        "status": "owned"
      },
      {
        "name": "size",
        "type": "\"default\" | \"expressive\" | \"icon\" | \"icon-expressive\" | null | undefined",
        "required": false,
        "choices": [
          "default",
          "expressive",
          "icon",
          "icon-expressive"
        ],
        "default": "default",
        "sourceLine": 30,
        "status": "owned"
      },
      {
        "name": "primaryColor",
        "type": "ButtonPrimaryColor | undefined",
        "required": false,
        "choices": [
          "purple",
          "pink"
        ],
        "default": "purple",
        "sourceLine": 73,
        "status": "owned"
      },
      {
        "name": "selected",
        "type": "boolean | undefined",
        "required": false,
        "choices": [
          false,
          true
        ],
        "default": null,
        "sourceLine": 74,
        "status": "owned"
      },
      {
        "name": "asChild",
        "type": "boolean | undefined",
        "required": false,
        "choices": [
          false,
          true
        ],
        "default": false,
        "sourceLine": 75,
        "status": "owned"
      },
      {
        "name": "tooltip",
        "type": "React.ReactNode",
        "required": false,
        "choices": null,
        "default": null,
        "sourceLine": 76,
        "status": "owned"
      },
      {
        "name": "tooltipSide",
        "type": "\"top\" | \"right\" | \"bottom\" | \"left\" | undefined",
        "required": false,
        "choices": [
          "top",
          "right",
          "bottom",
          "left"
        ],
        "default": "top",
        "sourceLine": 77,
        "status": "owned"
      }
    ],
    "props": [
      "variant",
      "size",
      "primaryColor",
      "selected",
      "asChild",
      "tooltip",
      "tooltipSide"
    ],
    "fingerprint": "sha256:adf153b31276f06a76d85beb1c9b137acc704e0cf79038c9a361b994a8bdd218"
  },
  "card": {
    "api": [
      {
        "name": "size",
        "type": "\"default\" | \"sm\" | \"expressive\" | undefined",
        "required": false,
        "choices": [
          "default",
          "sm",
          "expressive"
        ],
        "default": "default",
        "sourceLine": 17,
        "status": "owned"
      },
      {
        "name": "variant",
        "type": "\"code\" | \"default\" | undefined",
        "required": false,
        "choices": [
          "code",
          "default"
        ],
        "default": "default",
        "sourceLine": 18,
        "status": "owned"
      },
      {
        "name": "hang",
        "type": "HangOffset | undefined",
        "required": false,
        "choices": null,
        "default": false,
        "sourceLine": 19,
        "status": "owned"
      }
    ],
    "props": [
      "size",
      "variant",
      "hang"
    ],
    "fingerprint": "sha256:82f6f440053b3fbb9a07ae4b7dd85d8f06e592f98a3a8bfe3a63cf4c9deed41a"
  },
  "response": {
    "api": [
      {
        "name": "streaming",
        "type": "boolean | undefined",
        "required": false,
        "choices": [
          false,
          true
        ],
        "default": false,
        "sourceLine": 47,
        "status": "owned"
      }
    ],
    "props": [
      "streaming"
    ],
    "fingerprint": "sha256:28844e9575d640c4da314f004a78e54d3e0b6cf9adf0b63880bd5cecd852c8c6"
  }
} as const
