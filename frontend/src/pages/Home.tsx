import { Link } from 'react-router-dom';
import { Card } from '../components/ui';

const Home = () => {
  const features = [
    {
      title: 'WorldTree',
      subtitle: '大事なことを毎日思い出す',
      description: '私にとって最も大事なことを文章で記録し、それを鮮明に想像できるように分化発展させます。',
      icon: '🌳',
      path: '/worldtree',
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Compact',
      subtitle: '未来をいま生きる',
      description: '未来を圧縮して眺め、1週間を一気に生きる体験をすることで、調和のとれた時間配分を確認します。',
      icon: '📅',
      path: '/compact',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Immersion',
      subtitle: '明日を準備する',
      description: '時間ごとに区切られた明日を眼の前に表示し、どのように動くことで調和が得られるのか事前にメモします。',
      icon: '⏰',
      path: '/immersion',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'ReLiving',
      subtitle: '過去を意味づける',
      description: 'その日一日を追体験し、その時々での学びを記録することで、大事なことを為す仕方を上手くします。',
      icon: '📔',
      path: '/reliving',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-primary-800 dark:text-dark-text-primary mb-4">
          「私」という意識現象を知り、より自由になる
        </h2>
        <p className="text-lg text-primary-600 dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
          「私」という意識現象が存在しなければ、「世界」は存在しないし、
          <br />
          「世界」が存在しなければ、「私」という意識現象は存在しない。
          <br />
          そんな、当たり前だけど気が付きづらい実感から始めて、自由を獲得するために。
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="group relative bg-primary-50 dark:bg-dark-bg-secondary rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary-200 dark:border-dark-border-primary"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-900/5 to-primary-900/5 dark:from-dark-accent-primary/10 dark:to-dark-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`text-4xl`}>{feature.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-800 dark:text-dark-text-primary">{feature.title}</h3>
                  <p className="text-sm text-primary-600 dark:text-dark-text-secondary">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-primary-700 dark:text-dark-text-secondary leading-relaxed">{feature.description}</p>
              <div className="mt-6 flex items-center text-accent-700 dark:text-dark-accent-primary font-medium group-hover:translate-x-2 transition-transform">
                詳しく見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Philosophy Section */}
      <Card className="bg-primary-50/60 dark:bg-dark-bg-secondary/80 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-primary-800 dark:text-dark-text-primary mb-4">どんな私が便利だと感じるか</h3>
        <ul className="space-y-3 text-primary-700 dark:text-dark-text-secondary">
          <li className="flex items-start">
            <span className="text-accent-700 dark:text-dark-accent-primary mr-3 mt-1">•</span>
            <span>自身の奥底から湧き上がる力に突き動かされず、漫然と生きていることに焦燥感を感じている。</span>
          </li>
          <li className="flex items-start">
            <span className="text-accent-700 dark:text-dark-accent-primary mr-3 mt-1">•</span>
            <span>つい、眼の前に飛び込んでくる誘惑に惹かれ、重要なことを忘れてしまう。</span>
          </li>
          <li className="flex items-start">
            <span className="text-accent-700 dark:text-dark-accent-primary mr-3 mt-1">•</span>
            <span>明日のこと、もっと先のこと、それらを考えたくない。でも大事な気がしている。</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Home;
