import type { ReactNode } from 'react';

type ProviderProps = {
    readonly children: ReactNode
}

export const Providers = ({ children }: ProviderProps) => {
    return (
        <div>
            Providers
            {children}
        </div>
    )
}