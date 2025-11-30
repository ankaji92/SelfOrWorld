import { useState } from 'react';

interface Moment {
  time: string;
  event: string;
  feeling: 'positive' | 'neutral' | 'negative';
  reflection: string;
  learning: string;
}

const ReLiving = () => {
  const [selectedDate, setSelectedDate] = useState('2024-12-02');
  const [moments] = useState<Moment[]>([
    {
      time: '08:00',
      event: 'プロジェクトミーティングで新しいアイデアを提案した',
      feeling: 'positive',
      reflection: '準備をしっかりしていたので、自信を持って発表できた',
      learning: '事前準備の重要性を再確認。次回も同じように準備しよう',
    },
    {
      time: '10:30',
      event: 'コードレビューで厳しい指摘を受けた',
      feeling: 'negative',
      reflection: '最初は落ち込んだが、後で考えると建設的なフィードバックだった',
      learning: '批判を個人攻撃と受け取らず、成長の機会として捉える',
    },
    {
      time: '12:00',
      event: '同僚とランチを取りながら雑談',
      feeling: 'positive',
      reflection: 'リラックスした会話で午後への活力が湧いた',
      learning: '人との繋がりが仕事のモチベーションに大きく影響する',
    },
    {
      time: '14:00',
      event: '難しいバグの原因を特定できた',
      feeling: 'positive',
      reflection: '諦めずに粘り強く調査した結果、解決策が見つかった',
      learning: '困難な問題こそ、一歩ずつ確実に進めることが大切',
    },
    {
      time: '16:00',
      event: '予定していたタスクが終わらなかった',
      feeling: 'negative',
      reflection: '見積もりが甘かった。割り込みタスクも多かった',
      learning: 'バッファ時間を設ける。割り込みを想定した計画を立てる',
    },
    {
      time: '19:00',
      event: '家族と夕食を囲んだ',
      feeling: 'positive',
      reflection: '仕事のことを忘れて、楽しい時間を過ごせた',
      learning: 'オンオフの切り替えが重要。家族との時間を大切にする',
    },
    {
      time: '21:00',
      event: '技術書を読んだ',
      feeling: 'neutral',
      reflection: '疲れていて集中できなかった',
      learning: '学習時間は午前中など、エネルギーが高い時間帯に設定する',
    },
  ]);

  const feelingColors = {
    positive: 'bg-green-100 border-green-500 text-green-900',
    neutral: 'bg-gray-100 border-gray-500 text-gray-900',
    negative: 'bg-red-100 border-red-500 text-red-900',
  };

  const feelingIcons = {
    positive: '😊',
    neutral: '😐',
    negative: '😔',
  };

  const feelingLabels = {
    positive: 'ポジティブ',
    neutral: 'ニュートラル',
    negative: 'ネガティブ',
  };

  const [showLearnings, setShowLearnings] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">ReLiving</h2>
            <p className="text-gray-600 mt-2">過去を追体験し、意味づける</p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-900">
            <strong>💡 ヒント:</strong> その日一日を追体験し、その時々での学びを記録します。
            過去から学ぶにつれて、大事なことを為す仕方は、上手くなってゆくことでしょう。
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {new Date(selectedDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLearnings}
              onChange={(e) => setShowLearnings(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="text-sm text-gray-700">学びを表示</span>
          </label>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">一日の軌跡</h3>
        <div className="space-y-4">
          {moments.map((moment, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-5 transition-all ${feelingColors[moment.feeling]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{feelingIcons[moment.feeling]}</span>
                  <div>
                    <span className="font-bold text-lg">{moment.time}</span>
                    <span className="ml-3 px-2 py-1 bg-white/50 rounded text-xs font-medium">
                      {feelingLabels[moment.feeling]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold mb-1">出来事</h4>
                  <p className="text-sm">{moment.event}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-1">振り返り</h4>
                  <p className="text-sm italic">{moment.reflection}</p>
                </div>

                {showLearnings && moment.learning && (
                  <div className="mt-3 p-3 bg-white/70 rounded-lg border-2 border-dashed border-current">
                    <h4 className="font-bold mb-1 flex items-center">
                      <span className="mr-2">📚</span>
                      学び
                    </h4>
                    <p className="text-sm font-medium">{moment.learning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="text-3xl mb-2">😊</div>
          <div className="text-2xl font-bold text-green-900">
            {moments.filter((m) => m.feeling === 'positive').length}
          </div>
          <div className="text-sm text-green-800">ポジティブな出来事</div>
        </div>

        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
          <div className="text-3xl mb-2">😐</div>
          <div className="text-2xl font-bold text-gray-900">
            {moments.filter((m) => m.feeling === 'neutral').length}
          </div>
          <div className="text-sm text-gray-800">ニュートラルな出来事</div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="text-3xl mb-2">😔</div>
          <div className="text-2xl font-bold text-red-900">
            {moments.filter((m) => m.feeling === 'negative').length}
          </div>
          <div className="text-sm text-red-800">ネガティブな出来事</div>
        </div>
      </div>

      {/* Daily Reflection */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">一日の総括</h3>
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent mb-4"
          placeholder="今日一日を振り返って、どんな学びがありましたか？明日からどのように活かしますか？"
        />
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          保存
        </button>
      </div>

      {/* Accumulated Learnings */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">今日の学び一覧</h3>
        <div className="space-y-2">
          {moments
            .filter((m) => m.learning)
            .map((moment, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-600 font-bold">{index + 1}.</span>
                <p className="text-sm text-indigo-900">{moment.learning}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReLiving;
