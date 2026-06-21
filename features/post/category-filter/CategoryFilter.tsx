'use client';

import { Group, Chip, ScrollArea } from '@mantine/core';
import { useCategories } from '@/entities/category/api/useCategories';
import classes from './CategoryFilter.module.scss';

interface CategoryFilterProps {
    value?: number;
    onChange: (value: number | undefined) => void;
    className?: string;
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
    const { data: categories, isLoading } = useCategories();

    if (isLoading || !categories) return null;

    return (
        <ScrollArea className={className}>
            <Group gap="xs" wrap="nowrap">
                <Chip
                    variant={value === undefined ? 'filled' : 'light'}
                    color="cyan"
                    onClick={() => onChange(undefined)}
                >
                    Все
                </Chip>

                {categories.map((category) => (
                    <Chip
                        key={category.id}
                        variant={value === category.id ? 'filled' : 'light'}
                        color="cyan"
                        onClick={() => onChange(category.id === value ? undefined : category.id)}
                    >
                        {category.icon && <span style={{ marginRight: 4 }}>{category.icon}</span>}
                        {category.name}
                    </Chip>
                ))}
            </Group>
        </ScrollArea>
    );
}