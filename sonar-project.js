module.exports = {
    sonar: {
        host: {
            url: "http://localhost:9000"
        },
        projectKey: "meu-projeto-devops",
        projectName: "Meu Projeto DevOps",
        sources: ".",
        language: "js",
        sourceEncoding: "UTF-8",
        qualitygate: {
            wait: true,
            timeout: 300
        }
    }
};