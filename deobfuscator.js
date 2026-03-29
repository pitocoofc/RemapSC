const fs = require('fs');

module.exports = {
    clean(code) {
        // 1. Carregar recursos (Verifica se o dicionário existe para não quebrar)
        if (!fs.existsSync('./dictionary.json')) {
            fs.writeFileSync('./dictionary.json', '{}');
        }
        
        const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));
        const dictionary = JSON.parse(fs.readFileSync('./dictionary.json', 'utf8'));

        let content = code.trim();
        let wasTranslated = false;

        // 2. Tenta traduzir pelo dicionário
        // Ele percorre o JSON procurando as versões ofuscadas
        for (const [obfuscated, plain] of Object.entries(dictionary)) {
            if (content.includes(obfuscated)) {
                content = content.replace(new RegExp(obfuscated.replace(/\\/g, '\\\\'), 'g'), plain);
                wasTranslated = true;
            }
        }

        // 3. REGRA DE OURO: Se tem sinal de ofuscação (\x, \u, etc) mas não foi traduzido
        const hasObfuscationSigns = /\\x|\\u|atob\(|String\.fromCharCode/.test(code);
        
        if (hasObfuscationSigns && !wasTranslated) {
            return "⚠️ BLOQUEADO: Ofuscação desconhecida ou não autorizada.";
        }

        // 4. VERIFICAÇÃO FINAL: O conteúdo (traduzido ou original) é proibido nas regras?
        const isForbidden = rules.js_functions.some(func => content.includes(func));
        
        if (isForbidden) {
            // Se traduziu algo como \x65\x76\x61\x6c para "eval", ele cai aqui
            return `❌ BLOQUEADO: Função perigosa detectada -> (${content})`;
        }

        // 5. Se passou por tudo, retorna o conteúdo limpo
        return `✅ SEGURO: ${content}`;
    }
};
