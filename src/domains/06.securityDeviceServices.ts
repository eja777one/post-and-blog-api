import { tokensMetaRepository } from './../repositories/06.tokensDBRepository';
import { jwtService } from "../application/jwt-service";

export const securityDeviceServices = {

  async getUsersSessions(refreshToken: string) {

    const payload = await jwtService.
      getPayloadRefToken(refreshToken);

    if (!payload) return null;

    const sessions = await tokensMetaRepository
      .getUsersSessions(payload.userId);

    if (!sessions) return null

    return sessions;
  },

  async deleteOtherSessions(refreshToken: string) {

    const payload = await jwtService.
      getPayloadRefToken(refreshToken);

    if (!payload) return false;

    const deletedSessions = await tokensMetaRepository
      .deleteOtherSessions(payload.userId, payload.deviceId);

    return deletedSessions >= 0;
  },

  async deleteThisSession(refreshToken: string, deviceId: string) {

    const payload = await jwtService.
      getPayloadRefToken(refreshToken);

    if (!payload) return 'UNAUTHORIZED_401';

    const getSession = await tokensMetaRepository
      .getSessionByDeviceId(deviceId);

    if (!getSession) return 'NOT_FOUND_404';

    if (getSession.userId !== payload.userId) return 'FORBIDDEN_403';

    const deleteThisSessions = await tokensMetaRepository
      .deleteThisSessions(payload.userId, deviceId);

    return deleteThisSessions ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  },
};