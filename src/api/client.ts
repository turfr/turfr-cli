

const API_URL = "https://api.turfr.svur.dev";

export type CreatePlayerInput = {
    name: string;
    phone?: string;
};

export type Player = {
    name: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
};

export async function createPlayer(
    input: CreatePlayerInput,
): Promise<Player> {
    const response = await fetch(`${API_URL}/players`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const body = await response.json() as Player | { error: string };

    if (!response.ok) {
        if ("error" in body) {
            throw new Error(body.error);
        }

        throw new Error(`API request failed with status ${response.status}.`);
    }

    return body as Player;
}