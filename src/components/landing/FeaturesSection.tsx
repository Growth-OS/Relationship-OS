import { Mail, MessageSquare, Clock, Zap } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Email Management Block */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Integrated Email Management
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Fly through your email twice as fast as before. Our smart inbox helps you focus on what matters most, eliminating email anxiety once and for all.
                </p>
              </div>
            </div>
          </div>

          {/* Team Communication Block */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Smart Team Communication
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Keep your team aligned with integrated chat, threads, and real-time collaboration tools. Make decisions faster and keep everyone in the loop.
                </p>
              </div>
            </div>
          </div>

          {/* Task Management Block */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Efficient Task Management
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Transform how you handle tasks with our intuitive system. Set priorities, track progress, and achieve more with less effort.
                </p>
              </div>
            </div>
          </div>

          {/* Automation Block */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  AI-Powered Automation
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Let AI handle repetitive tasks while you focus on what matters. Automate workflows and boost your productivity with smart suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};