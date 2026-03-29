const fs = require('fs');
const htmlparser2 = require('htmlparser2');

// Importando os sistemas de suporte
const deobfuscator = require('./deobfuscator');
const urlShielder = require('./url_shielder');

// 1. Carregar Regras e Arquivo de Entrada
const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));
const codeToTest = fs.readFileSync('./input.html', 'utf8');

console.log("🚀 Iniciando SuperGrep HTML INTEGRADO...");
console.log("-------------------------------------------");

let issuesFound = 0;

// 2. Configurar o Parser
const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
        // --- Verificação de Atributos Perigosos ---
        rules.html_attributes.forEach(attr => {
            if (attribs[attr]) {
                console.warn(`[!] ATRIBUTO PERIGOSO: '${attr}' na tag <${name}>`);
                issuesFound++;
            }
        });

        // --- Verificação de URLs (Nova Função) ---
        const link = attribs.href || attribs.src;
        if (link && link.startsWith('http')) {
            const status = urlShielder.check(link);
            console.log(`🌐 URL DETECTADA: ${link} -> [${status}]`);
            if (status.includes("PERIGOSA")) issuesFound++;
        }
    },

    ontext(text) {
        // --- Verificação de Funções JS ---
        rules.js_functions.forEach(func => {
            if (text.includes(func)) {
                console.warn(`[!] FUNÇÃO JS SUSPEITA: '${func}' detectada.`);
                issuesFound++;
            }
        });

        // --- Verificação de Ofuscação (Nova Função) ---
        const suspicious = rules.obfuscation_patterns.some(p => new RegExp(p).test(text));
        if (suspicious) {
            console.warn("⚠️ CÓDIGO OFUSCADO DETECTADO! Tentando revelar...");
            const clean = deobfuscator.clean(text);
            console.log("✨ CONTEÚDO REVELADO:\n" + clean);
            issuesFound++;
        }
    }
}, { decodeEntities: true });

// 3. Executar
parser.write(codeToTest);
parser.end();

console.log("-------------------------------------------");
if (issuesFound === 0) {
    console.log("✅ Verificação concluída: Nenhum problema encontrado.");
} else {
    console.log(`⚠️ Verificação concluída: ${issuesFound} sinalizações encontradas.`);
}
