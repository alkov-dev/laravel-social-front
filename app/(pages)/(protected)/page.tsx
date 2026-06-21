import { Feed } from '@/widgets/feed/Feed';

export default function HomePage() {
  return <Feed />;
}




// 'use client';

// import { Title, Text, Card, SimpleGrid } from '@mantine/core';
// import { IconShield, IconRocket, IconPalette } from '@tabler/icons-react';
// import { Header } from '@/widgets/header';
// import classes from './home-page.module.scss';

// export default function HomePage() {

//   return (
//     <>
//       <Header />
//       <div className={classes.container}>
//         <div className={classes.content}>
//           {true ? (
//             <>
//               <Card className={classes.welcomeCard}>
//                 <Title order={2} className={classes.title}>
//                   Добро пожаловать, test! 👋
//                 </Title>
//                 <Text className={classes.text}>
//                   Вы успешно вошли в систему. Это ваша персональная страница.
//                 </Text>
//               </Card>

//               <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} className={classes.features}>
//                 <Card className={classes.featureCard}>
//                   <IconShield size={32} color="var(--mantine-color-indigo-6)" />
//                   <Title order={4} className={classes.featureTitle}>
//                     Безопасность
//                   </Title>
//                   <Text size="sm" color="dimmed">
//                     Ваши данные защищены современными методами шифрования
//                   </Text>
//                 </Card>

//                 <Card className={classes.featureCard}>
//                   <IconRocket size={32} color="var(--mantine-color-indigo-6)" />
//                   <Title order={4} className={classes.featureTitle}>
//                     Скорость
//                   </Title>
//                   <Text size="sm" color="dimmed">
//                     Быстрая работа приложения благодаря современным технологиям
//                   </Text>
//                 </Card>

//                 <Card className={classes.featureCard}>
//                   <IconPalette size={32} color="var(--mantine-color-indigo-6)" />
//                   <Title order={4} className={classes.featureTitle}>
//                     Дизайн
//                   </Title>
//                   <Text size="sm" color="dimmed">
//                     Красивый и удобный интерфейс для комфортной работы
//                   </Text>
//                 </Card>
//               </SimpleGrid>
//             </>
//           ) : (
//             <Card className={classes.welcomeCard}>
//               <Title order={2} className={classes.title}>
//                 Добро пожаловать! 🎉
//               </Title>
//               <Text className={classes.text}>
//                 Пожалуйста, войдите в систему или зарегистрируйтесь, чтобы получить доступ ко всем функциям.
//               </Text>
//             </Card>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }