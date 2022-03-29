interface RubotConfig {
    organization: string,
    repository: string
    port?: number,
}

export function loadConfig(): RubotConfig {
    const data = Deno.readTextFileSync("./rubot.json");
    return JSON.parse(data);
}