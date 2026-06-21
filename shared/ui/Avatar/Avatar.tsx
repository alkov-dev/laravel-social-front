
import { Avatar as MantineAvatar, AvatarProps } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

interface AppAvatarProps extends AvatarProps {
    name?: string;
    src?: string | null;
}

export function AppAvatar({ name, src, ...props }: AppAvatarProps) {
    return (
        <MantineAvatar
            src={src}
            alt={name || 'User'}
            radius="xl"
            color="cyan"
            {...props}
        >
            {!src && <IconUser size={20} />}
        </MantineAvatar>
    );
}
