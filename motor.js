const fs = require('fs');
const htmlparser2 = require('htmlparser2');
const deobfuscator = require('./deobfuscator');
const urlShielder = require('./url_shielder');

// 1. Carregar Regras e Arquivo de Entrada
const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));
const codeToTest = fs.readFileSync('./input.html', 'utf8');

console.log("🚀 Iniciando SuperGrep HTML INTEGRADO...");
console.log("-------------------------------------------");

let issuesFound = 0;

// 2. Configurar o Parser com Suporte a Async
const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
        // --- Verificação de Atributos Perigosos ---
        rules.html_attributes.forEach(attr => {
            if (attribs[attr]) {
                console.warn(`[!] ATRIBUTO PERIGOSO: '${attr}' na tag <${name}>`);
                issuesFound++;
            }
        });

        // --- Verificação de URLs ---
        const link = attribs.href || attribs.src;
        if (link && link.startsWith('http')) {
            const status = urlShielder.check(link);
            console.log(`🌐 URL DETECTADA: ${link} -> [${status}]`);
            if (status.includes("PERIGOSA")) issuesFound++;
        }
    },

    async ontext(text) {
        // Ignorar espaços vazios
        if (!text.trim()) return;

        // --- Verificação de Funções JS ---
        rules.js_functions.forEach(func => {
            if (text.includes(func)) {
                console.warn(`[!] FUNÇÃO JS SUSPEITA: '${func}' detectada.`);
                issuesFound++;
            }
        });

        // --- Verificação de Ofuscação (Async) ---
        const suspicious = rules.obfuscation_patterns.some(p => new RegExp(p).test(text));
        if (suspicious) {
            console.warn("⚠️ CÓDIGO OFUSCADO DETECTADO! Tentando revelar...");
            try {
                // O await aqui garante que o código venha limpo, não como Promise
                const clean = await deobfuscator.clean(text);
                console.log("✨ CONTEÚDO REVELADO:\n----------------------------\n" + clean + "\n----------------------------");
            } catch (err) {
                console.error("[!] Erro ao processar ofuscação.");
            }
            issuesFound++;
        }
    }
}, { decodeEntities: true });

// 3. Função de Execução para lidar com o fluxo Async
async function run() {
    parser.write(codeToTest);
    parser.end();

    // Pequeno delay para garantir que todos os ontext async terminaram
    setTimeout(() => {
        console.log("-------------------------------------------");
        if (issuesFound === 0) {
            console.log("✅ Verificação concluída: Nenhum problema encontrado.");
        } else {
            console.log(`⚠️ Verificação concluída: ${issuesFound} sinalizações encontradas.`);
        }
    }, 500);
}

run();
