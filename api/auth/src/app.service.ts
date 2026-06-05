import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from INSUREFLOW AUTH API!';
  }

  generateToken(username: string, roles: string[]): string {
    const payload = {
      sub: `user-${Math.floor(Math.random() * 1000)}`,
      email: `${username.toLowerCase()}@insureflow.fr`,
      preferred_username: username,
      name: username,
      realm_access: {
        roles: roles && roles.length > 0 ? roles : ['UNDERWRITER']
      },
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 // 24 hours expiry
    };

    return jwt.sign(payload, 'insureflow-secret-dev-key');
  }
}
