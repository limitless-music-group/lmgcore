import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability";
import { type User } from "@packages/database";
import { auth } from "auth";

type UserSubject = User


type Permission = 
    | ["read", UserSubject] 

export function getUserPermissions(
    user: typeof auth.$Infer.Session.user | undefined
) {
    const { build, can: allow } = new AbilityBuilder<MongoAbility<Permission>>(
        createMongoAbility
    )

    allow("read", "Todo", { public: true })

    if (user != null) {
        allow("read", "Todo", { userId: user.id })
        allow("update", "Todo", { userId: user.id })
        allow("create", "Todo", { userId: user.id })
        allow("delete", "Todo", { userId: user.id })

        if (user.role === 'admin') {
            allow('read', 'Todo')
            allow('read', 'User', { role: 'user'})
            allow('read', 'Todo', ['complete'], { public: true })
        }
    }

    return build()
}