const fs = require('fs');
const htmlparser2 = require('htmlparser2');

// Carrega as regras
const rules = JSON.parse(fs.readFileSync('./rules/definitions.json', 'utf8'));

function analyze(content) {
    const findings = [];

    const parser = new htmlparser2.Parser({
        onopentag(name, attribs) {
            // Verifica atributos perigosos (onclick, etc)
            rules.html_attributes.forEach(attr => {
                if (attribs[attr]) {
                    findings.push(`[Sinal] Atributo sensível '${attr}' encontrado na tag <${name}>`);
                }
            });
        },
        ontext(text) {
            // Verifica funções de JS perigosas no texto/script
            rules.js_functions.forEach(func => {
                if (text.includes(func)) {
                    findings.push(`[Aviso] Possível uso de função de risco: ${func}`);
                }
            });
        }
    });

    parser.write(content);
    parser.end();
    return findings;
}

// Exemplo de execução
const codeToTest = fs.readFileSync('./workspace/input.html', 'utf8');
const results = analyze(codeToTest);
console.log(results.length > 0 ? results : "✅ Nenhum problema óbvio encontrado.");
