import { createTRPCReact, httpBatchLink, type CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@obc-app/trpc/router";
import { QueryClient } from "@tanstack/react-query";

export const trpc: CreateTRPCReact<AppRouter, any> = createTRPCReact<AppRouter, object>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
    links:[
        httpBatchLink({
            url: "http://localhost:3000/trpc",
        })
    ]
})

/* async function test(){
    try {
        const result = await trpcClient.document.greet.query({"name": "Alice"});
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

test(); */