import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AccountTree,
  ViewWeek,
  WbTwilight,
  AutoStories,
  ArrowForward,
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      title: 'WorldTree',
      subtitle: '大事なことを毎日思い出す',
      description: '私にとって最も大事なことを文章で記録し、それを鮮明に想像できるように分化発展させます。',
      path: '/worldtree',
      icon: <AccountTree fontSize="large" />,
      color: '#047857',
    },
    {
      title: 'Compact',
      subtitle: '未来をいま生きる',
      description: '未来を圧縮して眺め、1週間を一気に生きる体験をすることで、調和のとれた時間配分を確認します。',
      path: '/compact',
      icon: <ViewWeek fontSize="large" />,
      color: '#059669',
    },
    {
      title: 'Immersion',
      subtitle: '明日を準備する',
      description: '時間ごとに区切られた明日を眼の前に表示し、どのように動くことで調和が得られるのか事前にメモします。',
      path: '/immersion',
      icon: <WbTwilight fontSize="large" />,
      color: '#10b981',
    },
    {
      title: 'ReLiving',
      subtitle: '過去を意味づける',
      description: 'その日一日を追体験し、その時々での学びを記録することで、大事なことを為す仕方を上手くします。',
      path: '/reliving',
      icon: <AutoStories fontSize="large" />,
      color: '#065f46',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: 6,
          mb: 6,
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1f2e 0%, #252b3b 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          「私」という意識現象を知り、より自由になる
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
          「私」という意識現象が存在しなければ、「世界」は存在しないし、
          <br />
          「世界」が存在しなければ、「私」という意識現象は存在しない。
          <br />
          そんな、当たり前だけど気が付きづらい実感から始めて、自由を獲得するために。
        </Typography>
      </Paper>

      {/* Features */}
      <Typography variant="h4" gutterBottom fontWeight="medium" sx={{ mb: 3 }}>
        4つの機能
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} md={6} key={feature.path}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: feature.color, mr: 2 }}>{feature.icon}</Box>
                  <Box>
                    <Typography variant="h5" component="h3" fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.subtitle}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={RouterLink}
                  to={feature.path}
                  endIcon={<ArrowForward />}
                  sx={{ color: feature.color }}
                >
                  詳しく見る
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Target User Profile */}
      <Paper elevation={1} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight="medium">
          どんな私が便利だと感じるか
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="自身の奥底から湧き上がる力に突き動かされず、漫然と生きていることに焦燥感を感じている。"
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="つい、眼の前に飛び込んでくる誘惑に惹かれ、重要なことを忘れてしまう。"
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="明日のこと、もっと先のこと、それらを考えたくない。でも大事な気がしている。"
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Home;
