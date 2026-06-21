import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export function formatDistanceToNow(date: string): string {
    return dayjs(date).fromNow();
}

export function formatDate(date: string): string {
    return dayjs(date).format('DD.MM.YYYY');
}

export function formatDateTime(date: string): string {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}