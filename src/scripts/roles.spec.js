import { describe, expect, it } from 'vitest'
import { primaryRole } from './roles'

describe('primaryRole', () => {
    it('prefers owner over manager and customer regardless of order', () => {
        expect(primaryRole([{ name: 'customer' }, { name: 'manager' }, { name: 'owner' }])).toBe('owner')
        expect(primaryRole([{ name: 'manager' }, { name: 'owner' }])).toBe('owner')
    })

    it('prefers superadmin over every other role', () => {
        expect(primaryRole([{ name: 'owner' }, { name: 'superadmin' }])).toBe('superadmin')
    })

    it('returns a single role as is', () => {
        expect(primaryRole([{ name: 'customer' }])).toBe('customer')
        expect(primaryRole([{ name: 'car wash' }])).toBe('car wash')
    })

    it('accepts plain role names', () => {
        expect(primaryRole(['customer', 'owner'])).toBe('owner')
    })

    it('falls back to the first unknown role, or null when there are none', () => {
        expect(primaryRole([{ name: 'auditor' }])).toBe('auditor')
        expect(primaryRole([])).toBeNull()
        expect(primaryRole(null)).toBeNull()
        expect(primaryRole(undefined)).toBeNull()
    })
})
