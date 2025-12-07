import { useState } from 'react';
import { Card, Button, Input, Hint } from '../components/ui';

interface TimeBlock {
  time: string;
  duration: number;
  title: string;
  description: string;
  category: 'work' | 'family' | 'self' | 'rest' | 'other';
  notes: string;
}

const Immersion = () => {
  const [selectedDate, setSelectedDate] = useState('2024-12-03');
  const [schedule] = useState<TimeBlock[]>([
    {
      time: '06:00',
      duration: 1,
      title: '朝の準備',
      description: '起床、朝食、身支度',
      category: 'rest',
      notes: '早めに起きて、ゆっくり朝食を取る',
    },
    {
      time: '07:00',
      duration: 1,
      title: '通勤・自己成長',
      description: 'ポッドキャストを聴きながら通勤',
      category: 'self',
      notes: '新しいエピソードをダウンロードしておく',
    },
    {
      time: '08:00',
      duration: 2,
      title: '集中タイム',
      description: '重要なタスクに取り組む',
      category: 'work',
      notes: 'メールチェック前に最も重要な仕事を終わらせる',
    },
    {
      time: '10:00',
      duration: 1,
      title: 'ミーティング',
      description: 'チーム定例会議',
      category: 'work',
      notes: '進捗報告の資料を事前に準備',
    },
    {
      time: '11:00',
      duration: 2,
      title: 'プロジェクト作業',
      description: '新機能の実装',
      category: 'work',
      notes: '設計ドキュメントを見直してから着手',
    },
    {
      time: '13:00',
      duration: 1,
      title: '昼食・休憩',
      description: 'ランチと散歩',
      category: 'rest',
      notes: '外に出て気分転換する',
    },
    {
      time: '14:00',
      duration: 3,
      title: '午後の作業',
      description: 'コードレビューとタスク消化',
      category: 'work',
      notes: '15時にコーヒーブレイク',
    },
    {
      time: '17:00',
      duration: 1,
      title: '振り返りと明日の準備',
      description: '今日の成果確認と明日の計画',
      category: 'work',
      notes: 'タスクリストを整理',
    },
    {
      time: '18:00',
      duration: 1,
      title: '帰宅',
      description: '通勤時間',
      category: 'other',
      notes: '音楽を聴いてリラックス',
    },
    {
      time: '19:00',
      duration: 2,
      title: '家族との時間',
      description: '夕食と団らん',
      category: 'family',
      notes: '今日あったことを共有する',
    },
    {
      time: '21:00',
      duration: 1,
      title: '自己成長',
      description: '読書または学習',
      category: 'self',
      notes: '新しい技術書を30ページ読む',
    },
    {
      time: '22:00',
      duration: 1,
      title: '就寝準備',
      description: 'お風呂とリラックスタイム',
      category: 'rest',
      notes: '遅くとも23時には就寝',
    },
  ]);

  const categoryColors = {
    work: 'bg-blue-100 border-blue-500 text-blue-900',
    family: 'bg-pink-100 border-pink-500 text-pink-900',
    self: 'bg-green-100 border-green-500 text-green-900',
    rest: 'bg-gray-100 border-gray-500 text-gray-900',
    other: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  };

  const categoryLabels = {
    work: '仕事',
    family: '家族',
    self: '自己成長',
    rest: '休息',
    other: 'その他',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-primary-800">Immersion</h2>
            <p className="text-primary-600 mt-2">明日を準備し、今日を生きる</p>
          </div>
          <Input
            type="date"
            variant="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <Hint>
          <p className="text-sm">
            <strong>💡 ヒント:</strong> 時間ごとに区切られた現実を眼の前に表示します。
            どのように動くことで調和が得られるのか、事前にメモしておきましょう。
          </p>
        </Hint>
      </Card>

      {/* Timeline View */}
      <Card>
        <h3 className="text-xl font-bold text-primary-800 mb-6">
          {new Date(selectedDate).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </h3>

        <div className="space-y-3">
          {schedule.map((block, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${
                categoryColors[block.category]
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-lg">{block.time}</span>
                    <span className="text-sm opacity-75">({block.duration}時間)</span>
                    <span className="px-2 py-1 bg-white/50 rounded text-xs font-medium">
                      {categoryLabels[block.category]}
                    </span>
                  </div>
                  <h4 className="font-bold mb-1">{block.title}</h4>
                  <p className="text-sm opacity-90 mb-2">{block.description}</p>
                  {block.notes && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-sm">
                      <span className="font-medium">📝 メモ: </span>
                      {block.notes}
                    </div>
                  )}
                </div>
                <button className="ml-4 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card>
        <h3 className="text-xl font-bold text-primary-800 mb-4">時間配分サマリー</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const totalHours = schedule
              .filter((block) => block.category === key)
              .reduce((sum, block) => sum + block.duration, 0);
            return (
              <div
                key={key}
                className={`p-4 rounded-lg border-l-4 ${
                  categoryColors[key as keyof typeof categoryColors]
                }`}
              >
                <div className="text-2xl font-bold">{totalHours}h</div>
                <div className="text-sm font-medium">{label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Preparation Notes */}
      <Card>
        <h3 className="text-xl font-bold text-primary-800 mb-4">事前準備チェックリスト</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 bg-primary-100 rounded-lg hover:bg-primary-200 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-accent-700 rounded" />
            <span>明日の服を準備する</span>
          </label>
          <label className="flex items-center space-x-3 p-3 bg-primary-100 rounded-lg hover:bg-primary-200 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-accent-700 rounded" />
            <span>ミーティング資料を確認する</span>
          </label>
          <label className="flex items-center space-x-3 p-3 bg-primary-100 rounded-lg hover:bg-primary-200 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-accent-700 rounded" />
            <span>昼食の準備をする</span>
          </label>
          <label className="flex items-center space-x-3 p-3 bg-primary-100 rounded-lg hover:bg-primary-200 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-accent-700 rounded" />
            <span>読書用の本を手元に置く</span>
          </label>
        </div>
        <Button className="mt-4" variant="secondary">
          + 新しい準備項目を追加
        </Button>
      </Card>
    </div>
  );
};

export default Immersion;
