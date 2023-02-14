import { inject, injectable } from 'inversify';
import { BLLResponse, DeviceViewModel } from '../../../models';
import { TokensMetaRepository } from '../infrastructure/tokensDBRepo';
import { TokensQueryMetaRepository } from '../infrastructure/tokensQRepo';
import { jwtService } from "../../../application/jwt-service";

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(TokensMetaRepository) protected tokensMetaRepository:
      TokensMetaRepository,
    @inject(TokensQueryMetaRepository) protected tokensQueryMetaRepository:
      TokensQueryMetaRepository,
  ) { }

  async getUsersSessions(refreshToken: string) {
    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return new BLLResponse<undefined>(401);

    const sessions = await this.tokensQueryMetaRepository
      .getUsersSessions(payload.userId);

    if (!sessions) return new BLLResponse<undefined>(401);
    return new BLLResponse<DeviceViewModel[]>(200, sessions);
  }

  async deleteOtherSessions(refreshToken: string) {
    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return new BLLResponse<undefined>(401);

    const deletedSessions = await this.tokensMetaRepository
      .deleteOtherSessions(payload.userId, payload.deviceId);

    if (!deletedSessions) return new BLLResponse<undefined>(401);
    else return new BLLResponse<undefined>(204);
  }

  async deleteThisSession(refreshToken: string, deviceId: string) {
    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return new BLLResponse<undefined>(401);

    const getSession = await this.tokensQueryMetaRepository
      .getSessionByDeviceId(deviceId);

    if (!getSession) return new BLLResponse<undefined>(404);
    if (getSession.userId !== payload.userId)
      return new BLLResponse<undefined>(403);

    const deleteThisSessions = await this.tokensMetaRepository
      .deleteThisSessions(payload.userId, deviceId);

    if (!deleteThisSessions) return new BLLResponse<undefined>(404);
    else return new BLLResponse<undefined>(204);
  }
};