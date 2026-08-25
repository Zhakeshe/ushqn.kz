import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { chatPeerLabel, initialsFromChatLabel } from './chatPeerLabel'

const t = ((key: string, values?: { id?: string }) => (values?.id ? `${key}:${values.id}` : key)) as TFunction

describe('chat peer labels', () => {
  it('prefers display name, then username', () => {
    expect(chatPeerLabel({ id: '1', display_name: '  Asem  ', username: 'asem' }, t)).toBe('Asem')
    expect(chatPeerLabel({ id: '1', display_name: ' ', username: 'asem' }, t)).toBe('@asem')
  })

  it('uses a non-sensitive short id fallback', () => {
    expect(chatPeerLabel({ id: '12345678-abcd', display_name: null, username: null }, t)).toBe('chat.peerShortId:12345678')
  })

  it('creates stable initials', () => {
    expect(initialsFromChatLabel('Asem Zhan')).toBe('AZ')
    expect(initialsFromChatLabel('@ushqn')).toBe('US')
  })
})
