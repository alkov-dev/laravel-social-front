import { User } from '@/shared/api/types/mock-users-api';
import classes from './user-avatar.module.scss';

interface UserAvatarProps {
    user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
    return (
        <div className={classes.avatar}>
            <img src={user.avatar} alt={user.name} className={classes.avatarImage} />
        </div>
    );
}