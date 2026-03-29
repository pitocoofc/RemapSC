const fs = require('fs');
const htmlparser2 = require('htmlparser2');

// 1. Carregar Regras e Arquivo de Entrada
const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8'));
const codeToTest = fs.readFileSync('./input.html', 'utf8');

console.log("🚀 Iniciando SuperGrep HTML...");
console.log("-------------------------------------------");

let issuesFound = 0;

// 2. Configurar o Parser
const parser = new htmlparser2.Parser({
    // Verifica tags e atributos (Ex: <button onclick="...">)
    onopentag(name, attribs) {
        rules.html_attributes.forEach(attr => {
            if (attribs[attr]) {
                console.warn(`[!] ATRIBUTO PERIGOSO: '${attr}' encontrado na tag <${name}>`);
                issuesFound++;
            }
        });
    },

    // Verifica o conteúdo dentro de <script> ou textos
    ontext(text) {
        rules.js_functions.forEach(func => {
            if (text.includes(func)) {
                console.warn(`[!] FUNÇÃO JS SUSPEITA: '${func}' detectada no código.`);
                issuesFound++;
            }
        });
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
