import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { confirm } from "./confirmation.js";
import { createPlayer } from "../api/client.js";

export async function addPlayer(
    name?: string,
    phone?: string,
): Promise<void> {
    const readline = createInterface({ input, output });

    try {
        if (name === undefined) {
            name = await readline.question("Player name: ");
        }

        if (phone === undefined) {
            phone = await readline.question("WhatsApp number: ");
        }

        console.log();
        console.log("Player details:");
        console.log(`Name:  ${name}`);
        console.log(`Phone: ${phone || "Not provided"}`);

        const confirmed = await confirm(readline, "Create player?");

        if (!confirmed) {
            console.log("Cancelled.");
            return;
        }

        console.log("Creating player...");

        const player = await createPlayer({
            name,
            ...(phone && { phone }),
        });

        console.log("Player created.");
        console.log(`Name:  ${player.name}`);
        console.log(`Phone: ${player.phone || "Not provided"}`);
    } finally {
        readline.close();
    }
}