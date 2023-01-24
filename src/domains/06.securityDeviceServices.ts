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

    if (!payload) return '401';

    const getSession = await tokensMetaRepository
      .getSessionByDeviceId(deviceId);

    if (!getSession) return '404';

    if (getSession.userId !== payload.userId) return '403';

    const deleteThisSessions = await tokensMetaRepository
      .deleteThisSessions(payload.userId, payload.deviceId);

    return deleteThisSessions === 1 ? '204' : '404';
  },
};