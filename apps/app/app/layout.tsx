import type { ReactNode } from "react";
import { Providers } from "./providers";

type RootLayoutProps = {
    readonly children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <div>
            <Providers>
                <h1>RootLayout</h1>
                {children}
            </Providers>
        </div>
    )
}