import { Group, Text } from '@mantine/core';
import { User } from '@/shared/api/types/mock-users-api';
import { UserAvatar } from '@/entities/user';
import classes from './user-info.module.scss';

interface UserInfoProps {
    user: User;
}

export function UserInfo({ user }: UserInfoProps) {
    return (
        <Group className={classes.userInfo}>
            <UserAvatar user={user} />
            <div className={classes.userDetails}>
                <Text className={classes.userName}>{user.name}</Text>
                <Text className={classes.userEmail}>{user.email}</Text>
            </div>
        </Group>
    );
}