import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decode JWT token (Keycloak formatted token)
      const decoded: any = jwt.decode(token);
      if (!decoded) {
        throw new UnauthorizedException('Malformed token');
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new UnauthorizedException('Token has expired');
      }

      // Attach user profile to request
      request.user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.preferred_username || decoded.name,
        roles: decoded.realm_access?.roles || [],
      };

      // Role check if roles are required
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.some((role) => request.user.roles.includes(role));
        if (!hasRole) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
