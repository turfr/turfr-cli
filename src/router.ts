import { addPlayer } from "./commands/player.js";

export async function route(args: string[]): Promise<void> {
    const [command, subcommand, name, phone] = args;

    if (command === "player" && subcommand === "add") {
        await addPlayer(name, phone);
        return;
    }

    console.log("Unknown command");
}