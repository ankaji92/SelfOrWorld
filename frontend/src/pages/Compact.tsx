import { useState } from 'react';
import { Card, Button, Hint } from '../components/ui';

interface WeekActivity {
  day: string;
  date: string;
  activities: {
    category: string;
    hours: number;
    color: string;
  }[];
}

const Compact = () => {
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const weekData: WeekActivity[] = [
    {
      day: '月',
      date: '12/2',
      activities: [
        { category: '仕事', hours: 8, color: 'bg-blue-500' },
        { category: '家族', hours: 3, color: 'bg-pink-500' },
        { category: '睡眠', hours: 7, color: 'bg-gray-400' },
        { category: '自己成長', hours: 2, color: 'bg-green-500' },
        { category: 'その他', hours: 4, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '火',
      date: '12/3',
      activities: [
        { category: '仕事', hours: 9, color: 'bg-blue-500' },
        { category: '家族', hours: 2, color: 'bg-pink-500' },
        { category: '睡眠', hours: 7, color: 'bg-gray-400' },
        { category: '自己成長', hours: 1, color: 'bg-green-500' },
        { category: 'その他', hours: 5, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '水',
      date: '12/4',
      activities: [
        { category: '仕事', hours: 8, color: 'bg-blue-500' },
        { category: '家族', hours: 3, color: 'bg-pink-500' },
        { category: '睡眠', hours: 8, color: 'bg-gray-400' },
        { category: '自己成長', hours: 2, color: 'bg-green-500' },
        { category: 'その他', hours: 3, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '木',
      date: '12/5',
      activities: [
        { category: '仕事', hours: 7, color: 'bg-blue-500' },
        { category: '家族', hours: 4, color: 'bg-pink-500' },
        { category: '睡眠', hours: 7, color: 'bg-gray-400' },
        { category: '自己成長', hours: 2, color: 'bg-green-500' },
        { category: 'その他', hours: 4, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '金',
      date: '12/6',
      activities: [
        { category: '仕事', hours: 8, color: 'bg-blue-500' },
        { category: '家族', hours: 2, color: 'bg-pink-500' },
        { category: '睡眠', hours: 7, color: 'bg-gray-400' },
        { category: '自己成長', hours: 1, color: 'bg-green-500' },
        { category: 'その他', hours: 6, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '土',
      date: '12/7',
      activities: [
        { category: '仕事', hours: 2, color: 'bg-blue-500' },
        { category: '家族', hours: 6, color: 'bg-pink-500' },
        { category: '睡眠', hours: 9, color: 'bg-gray-400' },
        { category: '自己成長', hours: 3, color: 'bg-green-500' },
        { category: 'その他', hours: 4, color: 'bg-yellow-500' },
      ],
    },
    {
      day: '日',
      date: '12/8',
      activities: [
        { category: '仕事', hours: 0, color: 'bg-blue-500' },
        { category: '家族', hours: 7, color: 'bg-pink-500' },
        { category: '睡眠', hours: 9, color: 'bg-gray-400' },
        { category: '自己成長', hours: 4, color: 'bg-green-500' },
        { category: 'その他', hours: 4, color: 'bg-yellow-500' },
      ],
    },
  ];

  const totalsByCategory = weekData.reduce((acc, day) => {
    day.activities.forEach((activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = { hours: 0, color: activity.color };
      }
      acc[activity.category].hours += activity.hours;
    });
    return acc;
  }, {} as Record<string, { hours: number; color: string }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-primary-800">Compact</h2>
            <p className="text-primary-600 mt-2">未来を圧縮して眺める</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setViewMode('chart')}
              variant={viewMode === 'chart' ? 'primary' : 'secondary'}
            >
              チャート表示
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
            >
              リスト表示
            </Button>
          </div>
        </div>

        <Hint>
          <p className="text-sm">
            <strong>💡 ヒント:</strong> 1週間を様々な形態で眺めてみましょう。
            好ましくないものに時間を取られすぎていないか、確認してみてください。
          </p>
        </Hint>
      </Card>

      {/* Week Overview */}
      {viewMode === 'chart' && (
        <Card>
          <h3 className="text-xl font-bold text-primary-800 mb-6">週間時間配分（12/2 - 12/8）</h3>
          <div className="grid grid-cols-7 gap-4">
            {weekData.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{day.day}</div>
                  <div className="text-xs text-gray-500">{day.date}</div>
                </div>
                <div className="h-96 bg-gray-100 rounded-lg overflow-hidden flex flex-col">
                  {day.activities.map((activity, idx) => {
                    const heightPercent = (activity.hours / 24) * 100;
                    return (
                      <div
                        key={idx}
                        className={`${activity.color} flex items-center justify-center text-white text-xs font-medium relative group`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="hidden group-hover:block absolute bg-black/75 px-2 py-1 rounded text-xs whitespace-nowrap">
                          {activity.category}: {activity.hours}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {Object.entries(totalsByCategory).map(([category, data]) => (
              <div key={category} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${data.color}`} />
                <span className="text-sm text-gray-700">
                  {category} ({data.hours}h)
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {viewMode === 'list' && (
        <Card>
          <h3 className="text-xl font-bold text-primary-800 mb-6">週間詳細（12/2 - 12/8）</h3>
          <div className="space-y-4">
            {weekData.map((day) => (
              <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">
                  {day.day}曜日 ({day.date})
                </h4>
                <div className="space-y-2">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded ${activity.color}`} />
                        <span className="text-gray-700">{activity.category}</span>
                      </div>
                      <span className="font-medium text-gray-900">{activity.hours}時間</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reflection */}
      <Card>
        <h3 className="text-xl font-bold text-primary-800 mb-4">振り返り</h3>
        <textarea
          className="w-full h-32 p-4 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-transparent"
          placeholder="この1週間を眺めて、どう感じましたか？調和はとれていますか？"
        />
        <Button className="mt-4" size="lg">
          保存
        </Button>
      </Card>
    </div>
  );
};

export default Compact;
