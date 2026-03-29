const safeList = ["google.com", "github.com", "stackoverflow.com"];

module.exports = {
    check(url) {
        try {
            const domain = new URL(url).hostname;
            if (safeList.some(safe => domain.includes(safe))) {
                return "✅ SEGURA";
            }
            return "❌ PERIGOSA / DESCONHECIDA";
        } catch (e) {
            return "❓ URL MALFORMADA";
        }
    }
};
