import { TrendingUp, Leaf, Shield, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const quickStarts = [
    { text: 'Analyze Bitcoin', icon: TrendingUp },
    { text: 'Tell me about Ethereum', icon: Sparkles },
    { text: 'What about Solana?', icon: Leaf },
    { text: 'Is crypto safe?', icon: Shield },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 shadow-lg">
            <TrendingUp size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Meet SAINT
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Strategic Analytics Intelligence Network Terminal
          </p>
          <p className="text-slate-500">
            Your decisive cryptocurrency advisor with data-driven insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            What I Can Do
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp size={14} className="text-blue-600" />
              </div>
              <p className="text-slate-700">
                <span className="font-semibold">Profitability Analysis:</span> Market trends, price movements, trading volume
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf size={14} className="text-green-600" />
              </div>
              <p className="text-slate-700">
                <span className="font-semibold">Sustainability Assessment:</span> Energy efficiency, project viability
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                <Sparkles size={14} className="text-cyan-600" />
              </div>
              <p className="text-slate-700">
                <span className="font-semibold">Decisive Recommendations:</span> Clear, data-backed investment insights
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
            Quick Start
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickStarts.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => onStartChat(item.text)}
                  className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <Icon size={20} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Ethics Alert:</span> Cryptocurrency investments carry significant risk. This analysis is for informational purposes only. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
