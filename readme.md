# 🛡️ SuperGrep v1.0.0 - SkillForge

O **SuperGrep** é um motor de análise estática e deofuscação em tempo real desenvolvido para identificar vetores de ataque em arquivos HTML e JavaScript, com foco especial em ambientes mobile (Termux/Android).

Diferente de scanners comuns, o SuperGrep utiliza um sistema de **Polimorfismo Reverso** para traduzir payloads ocultos em Hexadecimal, Unicode e Base64 antes de aplicar as regras de bloqueio.

## 🚀 Funcionalidades Principais

* **Deofuscação Multicamada:** Identifica e traduz automaticamente strings maliciosas em `\xXX`, `\uXXXX` e `Base64`.
* **Análise de Atributos DOM:** Detecta eventos perigosos como `onmouseover`, `onclick` e `onerror` em tags HTML.
* **Detecção de Funções Críticas:** Bloqueia automaticamente chamadas a funções sensíveis como `eval()`, `document.cookie` e `child_process`.
* **Whitelist Security (Zero Trust):** Se uma ofuscação não estiver no dicionário de tradução, o motor bloqueia o código por precaução.
* **Otimizado para Termux:** Leve, rápido e construído para rodar em hardware limitado.

## 📂 Estrutura do Projeto

* `motor.js`: O núcleo do sistema que processa o HTML.
* `deobfuscator.js`: A lógica de limpeza e tradução de códigos.
* `7.json`: Dicionário de assinaturas (Hex/Uni/B64).
* `rules.json`: Lista negra de funções e comportamentos proibidos.

## 🛠️ Como Instalar e Rodar

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu Termux:
   ```bash
   pkg install nodejs
   

2. Clone o repositório:
    ```bash
    git clone [https://github.com/pitocoofc/Ndj-lib.git](https://github.com/pitocoofc/Ndj-lib.git)
