'use client';

import { Container } from '@mantine/core';
import { CreatePostForm } from '@/features/post/create-post/CreatePostForm';

export default function CreatePostPage() {
    return (
        <Container size="md" py="xl">
            <CreatePostForm />
        </Container>
    );
}