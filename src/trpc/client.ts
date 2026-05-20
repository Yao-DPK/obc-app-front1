import { createTRPCReact, httpBatchLink, type CreateTRPCReact } from "@trpc/react-query";

import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "./router";

export const trpc: CreateTRPCReact<AppRouter, any> = createTRPCReact<AppRouter, object>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
    links:[
        httpBatchLink({
            url: `${process.env.VITE_API_URL}/trpc`,
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