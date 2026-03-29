const fs = require('fs');

module.exports = {
    isSafe(code) {
        // 1. Carregar recursos
        const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));
        const dictionary = JSON.parse(fs.readFileSync('./dictionary.json', 'utf8'));

        let content = code.trim();
        let wasTranslated = false;

        // 2. Tenta traduzir pelo dicionário
        for (const [obfuscated, plain] of Object.entries(dictionary)) {
            if (content.includes(obfuscated)) {
                content = content.replace(obfuscated, plain);
                wasTranslated = true;
            }
        }

        // 3. REGRA DE OURO: Se tem sinal de ofuscação mas não foi traduzido = PERIGO
        const hasObfuscationSigns = /\\x|\\u|atob\(|String\.fromCharCode/.test(code);
        if (hasObfuscationSigns && !wasTranslated) {
            return false; // Desconhecido = Inseguro
        }

        // 4. VERIFICAÇÃO FINAL: O conteúdo (traduzido ou original) é proibido?
        const isForbidden = rules.js_functions.some(func => content.includes(func));
        if (isForbidden) {
            return false; // Proibido pelo rules.json
        }

        return true; // Passou em todos os testes
    }
};
