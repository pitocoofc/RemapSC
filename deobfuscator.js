const prettier = require("prettier");

module.exports = {
    async clean(code) {
        try {
            // 1. Limpeza de Hex e Unicode (O básico que funciona)
            let processed = code.replace(/\\x([0-9a-fA-F]{2})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });

            processed = processed.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });

            // 2. Tenta "embelezar" o código para torná-lo legível
            // O Prettier organiza a estrutura que a ofuscação tentou quebrar
            const prettyCode = await prettier.format(processed, {
                semi: true,
                parser: "babel",
            });

            return prettyCode;
        } catch (e) {
            // Se o código for muito quebrado, retorna a versão limpa básica
            return `[Aviso: Formatação falhou]\n${code.replace(/\\x([0-9a-fA-F]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))}`;
        }
    }
};
