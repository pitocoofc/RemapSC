const axios = require('axios');
const cheerio = require('cheerio');

async function checkExternalLinks(html) {
    const $ = cheerio.load(html);
    const links = [];

    $('a, script, img').each((i, el) => {
        const url = $(el).attr('href') || $(el).attr('src');
        if (url && url.startsWith('http')) {
            links.push(url);
        }
    });

    for (const url of links) {
        try {
            console.log(`📡 Verificando URL: ${url}`);
            const response = await axios.get(url, { timeout: 5000 });
            // Aqui o motor pode chamar a função 'analyze' novamente para o conteúdo da URL
            console.log(`🟢 Status: ${response.status} (Acessível)`);
        } catch (error) {
            console.log(`🔴 Erro ao acessar ${url}: ${error.message}`);
        }
    }
}
