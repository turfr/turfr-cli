import { createInterface } from "node:readline/promises";

export async function confirm(
    readline: ReturnType<typeof createInterface>,
    message: string,
): Promise<boolean> {
    while (true) {
        const answer = await readline.question(`${message} [Y/n]: `);

        const normalized = answer.trim().toLowerCase();

        if (normalized === "" || normalized === "y" || normalized === "yes") {
            return true;
        }

        if (normalized === "n" || normalized === "no") {
            return false;
        }

        console.log("⚠️  Please enter Y or N.");
    }
}