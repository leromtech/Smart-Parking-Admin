// A user can hold several roles (e.g. a zone owner who is also staff and a
// customer). The API does not order them, so pick the most privileged one
// instead of trusting roles[0].
const ROLE_PRIORITY = ['superadmin', 'owner', 'manager', 'operator', 'car wash', 'customer']

export const primaryRole = (roles = []) => {
    const names = (roles ?? [])
        .map((role) => (typeof role === 'string' ? role : role?.name))
        .filter(Boolean)

    return ROLE_PRIORITY.find((role) => names.includes(role)) ?? names[0] ?? null
}
