"use client";

import type {
  ResolveMentionSuggestionsArgs,
  ResolveUsersArgs,
} from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import type { ComponentProps, ReactNode } from "react";

type RoomProps = ComponentProps<typeof LiveblocksProvider> & {
  id: string;
  children: ReactNode;
  authEndpoint: string;
  fallback: ReactNode;
  resolveUsers?: (
    args: ResolveUsersArgs
  ) => Promise<Liveblocks["UserMeta"]["info"][]>;
  resolveMentionSuggestions?: (
    args: ResolveMentionSuggestionsArgs
  ) => Promise<string[]>;
};

export const Room = ({
  id,
  children,
  authEndpoint,
  fallback,
  ...props
}: RoomProps) => (
  <LiveblocksProvider authEndpoint={authEndpoint} {...props}>
    <RoomProvider id={id} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
    </RoomProvider>
  </LiveblocksProvider>
);
