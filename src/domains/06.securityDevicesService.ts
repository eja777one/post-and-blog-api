import { TokensMetaRepository } from '../repositories/06.tokensDBRepo';
import { TokensQueryMetaRepository } from '../repositories/06.tokensQRepo';
import { jwtService } from "../application/jwt-service";

export class SecurityDevicesService {

  tokensMetaRepository: TokensMetaRepository;
  tokensQueryMetaRepository: TokensQueryMetaRepository;

  constructor() {
    this.tokensMetaRepository = new TokensMetaRepository();
    this.tokensQueryMetaRepository = new TokensQueryMetaRepository();
  }

  async getUsersSessions(refreshToken: string) {

    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return null;

    const sessions = await this.tokensQueryMetaRepository
      .getUsersSessions(payload.userId);

    if (!sessions) return null
    return sessions;
  }

  async deleteOtherSessions(refreshToken: string) {

    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return false;

    const deletedSessions = await this.tokensMetaRepository
      .deleteOtherSessions(payload.userId, payload.deviceId);

    return deletedSessions;
  }

  async deleteThisSession(refreshToken: string, deviceId: string) {

    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return 'UNAUTHORIZED_401';

    const getSession = await this.tokensQueryMetaRepository
      .getSessionByDeviceId(deviceId);

    if (!getSession) return 'NOT_FOUND_404';
    if (getSession.userId !== payload.userId) return 'FORBIDDEN_403';

    const deleteThisSessions = await this.tokensMetaRepository
      .deleteThisSessions(payload.userId, deviceId);

    return deleteThisSessions ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }
};