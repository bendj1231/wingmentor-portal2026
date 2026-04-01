import React, { useState } from 'react';
import { Icons } from '../icons';

interface Question {
    text: string;
    options: string[];
    correct: number;
}

const MOCK_QUESTIONS: Record<string, Question[]> = {
    'philippines': [
        {
            text: "What is the primary transition altitude in the Philippines?",
            options: ["11,000 ft", "13,000 ft", "18,000 ft", "Variable"],
            correct: 0
        },
        {
            text: "Which agency regulates civil aviation in the Philippines?",
            options: ["FAA", "CAAP", "EASA", "CAB"],
            correct: 1
        }
    ],
    'faa': [
        {
            text: "What is the standard transponder code for VFR in the US?",
            options: ["7000", "1200", "7500", "7600"],
            correct: 1
        }
    ],
    'easa': [
        {
            text: "What is the standard VFR transponder code in EASA airspace?",
            options: ["1200", "7000", "2000", "7700"],
            correct: 1
        }
    ]
};

export const ExaminationTerminal: React.FC = () => {
    const [region, setRegion] = useState<'philippines' | 'faa' | 'easa' | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (index: number) => {
        if (!region) return;
        if (index === MOCK_QUESTIONS[region][currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < MOCK_QUESTIONS[region].length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    if (!region) {
        return (
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-800">Select Region</h3>
                <div className="grid grid-cols-1 gap-3">
                    {['Philippines', 'FAA', 'EASA'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRegion(r.toLowerCase() as any)}
                            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left font-semibold text-slate-700 flex justify-between items-center"
                        >
                            {r} Certification Prep
                            <Icons.ArrowRight style={{ width: 18, height: 18 }} />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.CheckCircle style={{ width: 32, height: 32, color: '#10b981' }} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Examination Complete</h3>
                <p className="text-slate-500 mb-6">You scored {score} out of {MOCK_QUESTIONS[region].length}</p>
                <button
                    onClick={() => {
                        setRegion(null);
                        setShowResults(false);
                        setCurrentQuestion(0);
                        setScore(0);
                    }}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    Try Another Region
                </button>
            </div>
        );
    }

    const question = MOCK_QUESTIONS[region][currentQuestion];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{region} Regional Exam</span>
                <span className="text-xs font-medium text-slate-400">Question {currentQuestion + 1} of {MOCK_QUESTIONS[region].length}</span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 leading-tight">
                {question.text}
            </h3>

            <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-white transition-all text-left text-slate-700 font-medium"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};
