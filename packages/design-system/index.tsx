import type { ThemeProviderProps } from "next-themes";

type DesignSystemProviderProps = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const DesignSystemProvider = ({
    children,
    privacyUrl,
    termsUrl,
    helpUrl,
    ...props
}: DesignSystemProviderProps) => (
    
)
