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
                    checked={value === undefined}
                    variant={value === undefined ? 'filled' : 'light'}
                    color="violet"
                    onClick={() => onChange(undefined)}
                >
                    Все
                </Chip>

                {categories.map((category) => {
                    const isSelected = value === Number(category.id);
                    return <Chip
                        key={category.id}
                        checked={isSelected}
                        variant={value === category.id ? 'filled' : 'light'}
                        color="violet"
                        onChange={() => onChange(isSelected ? undefined : Number(category.id))}
                    >
                        {category.icon && <span style={{ marginRight: 4 }}>{category.icon}</span>}
                        {category.name}
                    </Chip>;
                })}
            </Group>
        </ScrollArea>
    );
}