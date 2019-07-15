import { Injectable } from '@nestjs/common';
import { EmailAddress } from 'mailparser';

import { Board } from '../../board/interfaces/board.interface';
import { UserService } from '../../auth/user.service';
import { EmailMember } from '../../email/interfaces';
import { TaskRoles } from '../../task/interfaces/task-roles.interface';
import { AuthReduce } from '../interfaces';
import { LISTDO_EMAIL } from '../../constants';

@Injectable()
export class ParseUtilService {
  constructor(private readonly userService: UserService) {}

  public isAuthenticated(emailMembers: EmailMember[], board: Board) {
    return emailMembers.reduce(
      (acc: AuthReduce, emailMember: EmailMember) => {
        const isMember = board.members.includes(emailMember.user.id);

        if (isMember) {
          acc.auth = [emailMember, ...acc.auth];
          return acc;
        }

        acc.noAuth = [
          {
            path: 'inbound_parse_error',
            message: `${emailMember.user.email} is not authorized for '${board.name}' board`,
          },
          ...acc.noAuth,
        ];

        return acc;
      },
      { auth: [], noAuth: [] } as AuthReduce,
    );
  }

  public async isAuthorized(members: EmailAddress[], role: TaskRoles) {
    return members.reduce(
      async (accumulator: Promise<AuthReduce>, member: EmailAddress) => {
        const acc = await accumulator;

        if (member.address.includes(LISTDO_EMAIL)) {
          return acc;
        }

        const user = await this.userService.findByEmail(member.address);

        if (!user) {
          acc.noAuth = [
            {
              path: 'inbound_parse_error',
              message: `${role} account not found: ${member.address}`,
            },
            ...acc.noAuth,
          ];
          return acc;
        }

        acc.auth = [{ user, role }, ...acc.auth];
        return acc;
      },
      Promise.resolve({ auth: [], noAuth: [] }) as Promise<AuthReduce>,
    );
  }
}
