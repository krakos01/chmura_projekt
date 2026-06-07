import { api } from './client';

/** Backend-supported moderation action types. */
export const MODERATION_ACTIONS = [
  'HIDE_POST',
  'DELETE_POST',
  'BAN_USER',
  'LOCK_THREAD',
  'UNLOCK_THREAD',
] as const;

export type ModerationActionType = (typeof MODERATION_ACTIONS)[number];

/** Frontend-friendly moderation action input. */
export interface ModerationAction {
  action: ModerationActionType;
  targetType: 'THREAD' | 'POST' | 'USER';
  targetId: number | string;
  reason?: string;
  banUntil?: string;
}

/** Backend ModerationRequest DTO. */
interface ModerationRequestDto {
  actionType: string;
  targetUserId?: number | string;
  targetThreadId?: number | string;
  targetPostId?: number | string;
  reason?: string;
  banUntil?: string;
}

function toModerationRequest(body: ModerationAction): ModerationRequestDto {
  const dto: ModerationRequestDto = {
    actionType: body.action,
    reason: body.reason,
    banUntil: body.banUntil,
  };

  switch (body.targetType) {
    case 'THREAD':
      dto.targetThreadId = body.targetId;
      break;
    case 'POST':
      dto.targetPostId = body.targetId;
      break;
    case 'USER':
      dto.targetUserId = body.targetId;
      break;
  }

  return dto;
}

export const moderationApi = {
  perform: (body: ModerationAction) =>
    api.post<unknown>('/mod/actions', toModerationRequest(body)),
};
