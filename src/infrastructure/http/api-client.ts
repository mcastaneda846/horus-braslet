export async function apiFetch(
    input: RequestInfo,
    init?: RequestInit
): Promise<Response> {

    let response = await fetch(input, {
        ...init,
        credentials: "same-origin",
    });

    // 2. Access token expirado
    if (response.status === 401) {

        // 3. Llama el endpoint de refresh que ya tienes
        const refreshed = await fetch("/api/auth/refresh", {
            method:      "POST",
            credentials: "same-origin",
        });

        if (refreshed.ok) {
            // 4. Las cookies ya fueron rotadas por tu endpoint
            //    Reintenta la llamada original con los nuevos tokens
            response = await fetch(input, {
                ...init,
                credentials: "same-origin",
            });
        } else {
            // 5. Refresh token también expiró (7 días)
            //    Llama tu endpoint de logout que limpia las cookies
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        }
    }

    return response;
}