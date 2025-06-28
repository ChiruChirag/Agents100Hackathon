import React, { useState, useEffect } from 'react';
import { 
  BeakerIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { agentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ExamCoachPage = () => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('practice');
  const [evaluating, setEvaluating] = useState(false);
  
  const [newExam, setNewExam] = useState({
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    question_count: 10,
    time_limit: 30,
    question_types: ['mcq']
  });

  useEffect(() => {
    fetchExams();
    fetchExamHistory();
  }, []);

  // Timer effect for current exam
  useEffect(() => {
    let timer;
    
    if (currentExam && currentExam.timeRemaining > 0) {
      timer = setInterval(() => {
        setCurrentExam(prev => {
          // Safety check
          if (!prev || typeof prev.timeRemaining !== 'number') {
            console.error('Invalid exam state in timer');
            return prev;
          }
          
          if (prev.timeRemaining <= 1) {
            // Time's up - auto finish exam
            toast.warning('Time is up! Exam submitted automatically.');
            
            // Use setTimeout to avoid state conflicts
            setTimeout(() => {
              try {
                finishExam();
              } catch (error) {
                console.error('Error auto-finishing exam:', error);
                toast.error('Failed to auto-submit exam');
              }
            }, 100);
            
            return prev;
          }
          
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentExam?.id]); // Only depend on exam ID to prevent unnecessary re-renders

  const fetchExams = async () => {
    try {
      // Get current user ID
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.user_id || userData.id || localStorage.getItem('user_id') || 'demo-user';
      
      // Use user-specific localStorage key
      const savedExams = localStorage.getItem(`examCoachExams_${userId}`);
      if (savedExams) {
        setExams(JSON.parse(savedExams));
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      // Start with empty array if localStorage fails
      setExams([]);
    }
  };

  const fetchExamHistory = async () => {
    try {
      // Get current user ID
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.user_id || userData.id || localStorage.getItem('user_id') || 'demo-user';
      
      // Use user-specific localStorage key
      const savedHistory = localStorage.getItem(`examCoachHistory_${userId}`);
      if (savedHistory) {
        setExamHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to fetch exam history:', error);
      setExamHistory([]);
    }
  };

  // Helper function to create subject-specific questions
  const createSubjectSpecificQuestion = (subject, topic, questionNumber, questionType) => {
    const subjectLower = subject.toLowerCase();
    const topicLower = topic.toLowerCase();
    
    // Math/Algebra questions
    if (subjectLower.includes('math') || subjectLower.includes('algebra')) {
      const algebraQuestions = [
        {
          question: "What is the solution to the equation 2x + 5 = 13?",
          options: ["x = 4", "x = 9", "x = 3", "x = 6"],
          correct_answer: "x = 4",
          explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
        },
        {
          question: "Which property allows us to write a(b + c) = ab + ac?",
          options: ["Distributive Property", "Commutative Property", "Associative Property", "Identity Property"],
          correct_answer: "Distributive Property",
          explanation: "The distributive property allows multiplication to be distributed over addition."
        },
        {
          question: "What is the slope of the line y = 3x - 7?",
          options: ["3", "-7", "1/3", "7"],
          correct_answer: "3",
          explanation: "In slope-intercept form y = mx + b, the coefficient of x (m) is the slope."
        },
        {
          question: "Simplify: (x²)(x³)",
          options: ["x⁵", "x⁶", "x⁵", "2x⁵"],
          correct_answer: "x⁵",
          explanation: "When multiplying powers with the same base, add the exponents: x² × x³ = x^(2+3) = x⁵"
        },
        {
          question: "What is the y-intercept of the line 2x + 3y = 12?",
          options: ["(0, 4)", "(0, 6)", "(6, 0)", "(4, 0)"],
          correct_answer: "(0, 4)",
          explanation: "Set x = 0: 2(0) + 3y = 12, so 3y = 12, y = 4. The y-intercept is (0, 4)."
        }
      ];
      
      const question = algebraQuestions[questionNumber % algebraQuestions.length];
      return {
        id: `q_${Date.now()}_${questionNumber}`,
        type: questionType,
        question: question.question,
        options: questionType === 'mcq' ? question.options : null,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      };
    }
    
    // Biology questions
    else if (subjectLower.includes('biology')) {
      const biologyQuestions = [
        {
          question: "What is the powerhouse of the cell?",
          options: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"],
          correct_answer: "Mitochondria",
          explanation: "Mitochondria produce ATP through cellular respiration, providing energy for cellular processes."
        },
        {
          question: "Which process converts light energy into chemical energy?",
          options: ["Photosynthesis", "Cellular Respiration", "Fermentation", "Glycolysis"],
          correct_answer: "Photosynthesis",
          explanation: "Photosynthesis uses light energy to convert CO₂ and water into glucose and oxygen."
        },
        {
          question: "What are the building blocks of proteins?",
          options: ["Amino acids", "Nucleotides", "Fatty acids", "Monosaccharides"],
          correct_answer: "Amino acids",
          explanation: "Proteins are polymers made up of amino acid monomers linked by peptide bonds."
        },
        {
          question: "Which organelle contains the cell's genetic material?",
          options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"],
          correct_answer: "Nucleus",
          explanation: "The nucleus contains chromosomes made of DNA, which stores genetic information."
        },
        {
          question: "What is the basic unit of life?",
          options: ["Cell", "Tissue", "Organ", "Molecule"],
          correct_answer: "Cell",
          explanation: "The cell is the smallest structural and functional unit of all living organisms."
        }
      ];
      
      const question = biologyQuestions[questionNumber % biologyQuestions.length];
      return {
        id: `q_${Date.now()}_${questionNumber}`,
        type: questionType,
        question: question.question,
        options: questionType === 'mcq' ? question.options : null,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      };
    }
    
    // Chemistry questions
    else if (subjectLower.includes('chemistry')) {
      const chemistryQuestions = [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Au", "Ag", "Cu", "Fe"],
          correct_answer: "Au",
          explanation: "Au comes from the Latin word 'aurum' meaning gold."
        },
        {
          question: "How many electrons can the first shell hold?",
          options: ["2", "8", "18", "32"],
          correct_answer: "2",
          explanation: "The first electron shell (K shell) can hold a maximum of 2 electrons."
        },
        {
          question: "What type of bond forms between a metal and a non-metal?",
          options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
          correct_answer: "Ionic bond",
          explanation: "Metals lose electrons and non-metals gain electrons, forming ionic bonds."
        },
        {
          question: "What is the pH of pure water at 25°C?",
          options: ["7", "0", "14", "1"],
          correct_answer: "7",
          explanation: "Pure water is neutral with a pH of 7 at standard temperature."
        },
        {
          question: "Which gas makes up about 78% of Earth's atmosphere?",
          options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Argon"],
          correct_answer: "Nitrogen",
          explanation: "Nitrogen (N₂) comprises approximately 78% of the atmosphere."
        }
      ];
      
      const question = chemistryQuestions[questionNumber % chemistryQuestions.length];
      return {
        id: `q_${Date.now()}_${questionNumber}`,
        type: questionType,
        question: question.question,
        options: questionType === 'mcq' ? question.options : null,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      };
    }
    
    // Physics questions
    else if (subjectLower.includes('physics')) {
      const physicsQuestions = [
        {
          question: "What is the unit of force in the SI system?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correct_answer: "Newton",
          explanation: "The Newton (N) is the SI unit of force, defined as kg⋅m/s²."
        },
        {
          question: "What is the speed of light in vacuum?",
          options: ["3.00 × 10⁸ m/s", "3.00 × 10⁶ m/s", "3.00 × 10¹⁰ m/s", "3.00 × 10⁴ m/s"],
          correct_answer: "3.00 × 10⁸ m/s",
          explanation: "The speed of light in vacuum is approximately 299,792,458 m/s or 3.00 × 10⁸ m/s."
        },
        {
          question: "According to Newton's first law, an object at rest will:",
          options: ["Stay at rest unless acted upon by a force", "Always accelerate", "Move at constant velocity", "Eventually stop"],
          correct_answer: "Stay at rest unless acted upon by a force",
          explanation: "Newton's first law states that objects remain in their state of motion unless acted upon by an unbalanced force."
        },
        {
          question: "What type of energy does a moving object possess?",
          options: ["Kinetic energy", "Potential energy", "Thermal energy", "Chemical energy"],
          correct_answer: "Kinetic energy",
          explanation: "Kinetic energy is the energy of motion, calculated as KE = ½mv²."
        },
        {
          question: "What happens to the wavelength of light as its frequency increases?",
          options: ["Decreases", "Increases", "Stays the same", "Becomes zero"],
          correct_answer: "Decreases",
          explanation: "Wavelength and frequency are inversely related: λ = c/f, where c is the speed of light."
        }
      ];
      
      const question = physicsQuestions[questionNumber % physicsQuestions.length];
      return {
        id: `q_${Date.now()}_${questionNumber}`,
        type: questionType,
        question: question.question,
        options: questionType === 'mcq' ? question.options : null,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      };
    }
    
    // Generic fallback for other subjects
    else {
      const genericQuestions = [
        {
          question: `What is a fundamental principle in ${topic}?`,
          options: [`Understanding core concepts`, `Memorizing definitions`, `Ignoring applications`, `Avoiding practice`],
          correct_answer: `Understanding core concepts`,
          explanation: `Understanding fundamental principles is key to mastering ${topic}.`
        },
        {
          question: `Which approach is most effective for learning ${topic}?`,
          options: [`Active practice and application`, `Passive reading only`, `Avoiding difficult problems`, `Skipping foundational concepts`],
          correct_answer: `Active practice and application`,
          explanation: `Active engagement with the material leads to better understanding and retention.`
        },
        {
          question: `What is the best way to apply ${topic} knowledge?`,
          options: [`Solve real-world problems`, `Memorize formulas only`, `Avoid challenging questions`, `Study in isolation`],
          correct_answer: `Solve real-world problems`,
          explanation: `Applying knowledge to real-world scenarios helps reinforce learning and understanding.`
        }
      ];
      
      const question = genericQuestions[questionNumber % genericQuestions.length];
      return {
        id: `q_${Date.now()}_${questionNumber}`,
        type: questionType,
        question: question.question,
        options: questionType === 'mcq' ? question.options : null,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      };
    }
  };

  const generateExam = async () => {
    if (!newExam.subject || !newExam.topic) {
      toast.error('Please fill in subject and topic');
      return;
    }

    setLoading(true);
    try {
      // Get current user ID
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.user_id || userData.id || localStorage.getItem('user_id') || 'demo-user';

      const response = await agentAPI.examCoachGenerate({
        topic: newExam.topic,
        subject: newExam.subject,
        question_count: newExam.question_count,
        difficulty: newExam.difficulty,
        question_types: newExam.question_types
      });
      
      if (response.data.success) {
        console.log('Backend response:', response.data); // Debug log
        
        // Parse the AI-generated questions from the backend response
        let generatedQuestions = [];
        
        try {
          console.log('Backend response:', response.data); // Debug log
          console.log('Response result type:', typeof response.data.result); // Debug log
          console.log('Response result content:', response.data.result); // Debug log
          
          // The backend should return a structured JSON with questions
          const result = response.data.result;
          
          // Check if we have a structured result with questions
          if (result && typeof result === 'object' && result.questions && Array.isArray(result.questions)) {
            console.log('Found structured questions:', result.questions); // Debug log
            
            // Use the questions directly from the backend
            generatedQuestions = result.questions.slice(0, newExam.question_count).map((question, index) => {
              const questionType = newExam.question_types[index % newExam.question_types.length];
              
              return {
                id: question.id || `q_${Date.now()}_${index + 1}`,
                question: question.question,
                type: questionType,
                options: question.options || null,
                correct_answer: question.correct_answer,
                explanation: question.explanation || `This question tests your understanding of ${newExam.topic}.`
              };
            });
            
            console.log('Processed questions:', generatedQuestions); // Debug log
            
          } else if (typeof result === 'string' && result.includes('{')) {
            // Try to parse JSON from string
            console.log('Trying to parse JSON from string result...'); // Debug log
            try {
              const jsonStart = result.indexOf('{');
              const jsonEnd = result.lastIndexOf('}') + 1;
              const jsonStr = result.substring(jsonStart, jsonEnd);
              const parsedResult = JSON.parse(jsonStr);
              
              if (parsedResult.questions && Array.isArray(parsedResult.questions)) {
                console.log('Successfully parsed JSON questions:', parsedResult.questions); // Debug log
                
                generatedQuestions = parsedResult.questions.slice(0, newExam.question_count).map((question, index) => {
                  const questionType = newExam.question_types[index % newExam.question_types.length];
                  
                  return {
                    id: question.id || `q_${Date.now()}_${index + 1}`,
                    question: question.question,
                    type: questionType,
                    options: question.options || null,
                    correct_answer: question.correct_answer,
                    explanation: question.explanation || `This question tests your understanding of ${newExam.topic}.`
                  };
                });
              }
            } catch (jsonParseError) {
              console.log('Failed to parse JSON from string:', jsonParseError);
            }
          } else {
            // Fallback: try to parse if result is a string (old behavior)
            const aiResult = typeof result === 'string' ? result : JSON.stringify(result);
            console.log('AI Result as string:', aiResult); // Debug log
            
            // Improved parser to extract questions and options from text
            const questionBlocks = aiResult.split(/(?=(?:Question \d+|Q\d+|\d+\.))/).filter(block => block.trim());
            
            if (questionBlocks && questionBlocks.length > 0) {
              console.log('Found question blocks:', questionBlocks); // Debug log
              
              generatedQuestions = questionBlocks.slice(0, newExam.question_count).map((block, index) => {
                // Extract question text (everything before options)
                const questionMatch = block.match(/(?:Question \d+:?|Q\d+:?|\d+\.)\s*([^A-D]*?)(?=[A-D]\)|$)/s);
                const questionText = questionMatch ? questionMatch[1].trim().replace(/\?$/, '') + '?' : `Question ${index + 1} from ${newExam.topic}`;
                
                const questionType = newExam.question_types[index % newExam.question_types.length];
                
                let question = {
                  id: `q_${Date.now()}_${index + 1}`,
                  question: questionText,
                  type: questionType,
                  explanation: `This question tests your understanding of ${newExam.topic}.`
                };
                
                if (questionType === 'mcq') {
                  // Extract options (A), B), C), D) format
                  const optionMatches = block.match(/[A-D]\)\s*([^\n\r]+)/g);
                  
                  if (optionMatches && optionMatches.length >= 2) {
                    question.options = optionMatches.map(match => 
                      match.replace(/^[A-D]\)\s*/, '').trim()
                    );
                    
                    // Try to find the correct answer in the text
                    const correctAnswerMatch = block.match(/(?:Answer|Correct|Solution)[:\s]*([A-D])/i);
                    if (correctAnswerMatch) {
                      const correctLetter = correctAnswerMatch[1].toUpperCase();
                      const correctIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                      question.correct_answer = question.options[correctIndex] || question.options[0];
                    } else {
                      question.correct_answer = question.options[0];
                    }
                  } else {
                    // Create subject-specific fallback questions instead of generic ones
                    question = createSubjectSpecificQuestion(newExam.subject, newExam.topic, index + 1, questionType);
                  }
                } else {
                  // For text questions, try to extract answer from the AI response
                  const answerMatch = block.match(/(?:Answer|Solution)[:\s]*([^\n\r]+)/i);
                  question.correct_answer = answerMatch ? answerMatch[1].trim() : `Sample answer for ${newExam.topic}`;
                  question.options = null;
                }
                
                return question;
              });
            }
          }
        } catch (parseError) {
          console.log('Could not parse AI questions, using fallback:', parseError);
        }
        
        // If we still don't have questions, create subject-specific ones
        if (generatedQuestions.length === 0) {
          console.log('Creating subject-specific fallback questions...');
          for (let i = 0; i < newExam.question_count; i++) {
            const questionType = newExam.question_types[i % newExam.question_types.length];
            generatedQuestions.push(createSubjectSpecificQuestion(newExam.subject, newExam.topic, i + 1, questionType));
          }
        }
        
        console.log('Final generated questions:', generatedQuestions); // Debug log
        
        // Create the exam object
        const generatedExam = {
          id: `exam_${Date.now()}`,
          subject: newExam.subject,
          topic: newExam.topic,
          difficulty: newExam.difficulty,
          question_count: newExam.question_count,
          time_limit: newExam.time_limit,
          question_types: newExam.question_types,
          ai_result: response.data.result, // Store the raw AI result
          created_at: new Date().toISOString(),
          questions: generatedQuestions
        };
        
        // Save to localStorage
        try {
          const updatedExams = [...exams, generatedExam];
          setExams(updatedExams);
          localStorage.setItem(`examCoachExams_${userId}`, JSON.stringify(updatedExams));
          
          toast.success('Exam generated successfully!');
          
          // Reset form
          setNewExam({
            subject: '',
            topic: '',
            difficulty: 'intermediate',
            question_count: 10,
            time_limit: 30,
            question_types: ['mcq']
          });
          setShowCreateForm(false);
          
        } catch (storageError) {
          console.error('Failed to save exam to localStorage:', storageError);
          toast.error('Exam generated but failed to save locally');
        }
        
      } else {
        throw new Error('Backend did not return success');
      }
    } catch (error) {
      console.error('Failed to generate exam:', error);
      
      // Show more specific error messages
      if (error.response?.status === 429) {
        toast.error('AI service quota exceeded. Please try again later.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Failed to generate exam: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const startExam = (exam) => {
    // Validate exam data before starting
    if (!exam) {
      toast.error('Invalid exam data');
      return;
    }
    
    if (!exam.questions || exam.questions.length === 0) {
      toast.error('This exam has no questions. Please generate a new exam.');
      return;
    }
    
    // Validate question structure
    const invalidQuestions = exam.questions.filter(q => !q.question || !q.id);
    if (invalidQuestions.length > 0) {
      toast.error('Some questions are invalid. Please generate a new exam.');
      return;
    }
    
    try {
      setCurrentExam({ 
        ...exam, 
        startTime: new Date(), 
        currentQuestion: 0, 
        answers: {},
        timeRemaining: exam.time_limit * 60 // Convert to seconds
      });
      
      toast.success('Exam started! Good luck!');
    } catch (error) {
      console.error('Failed to start exam:', error);
      toast.error('Failed to start exam. Please try again.');
    }
  };

  const submitAnswer = (questionIndex, answer) => {
    setCurrentExam(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer
      }
    }));
  };

  const nextQuestion = () => {
    setCurrentExam(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1
    }));
  };

  const finishExam = async () => {
    if (!currentExam) {
      toast.error('No active exam found');
      return;
    }
    
    setEvaluating(true);
    
    try {
      // Get current user ID
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.user_id || userData.id || localStorage.getItem('user_id') || 'demo-user';
      
      // Validate exam data
      if (!currentExam.questions || currentExam.questions.length === 0) {
        throw new Error('Invalid exam data - no questions found');
      }
      
      let correctAnswers = 0;
      const totalQuestions = currentExam.questions.length;
      const questionResults = [];
      
      // Calculate score by comparing answers
      currentExam.questions.forEach((question, index) => {
        const userAnswer = currentExam.answers[index];
        const isCorrect = userAnswer === question.correct_answer;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        questionResults.push({
          question_id: question.id,
          question: question.question,
          user_answer: userAnswer || 'No answer',
          correct_answer: question.correct_answer,
          is_correct: isCorrect,
          explanation: question.explanation || ''
        });
      });
      
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Try to call backend evaluation if available (optional)
      try {
        const submissionData = {
          exam_id: currentExam.id,
          answers: Object.entries(currentExam.answers).map(([questionIndex, answer]) => ({
            question_id: currentExam.questions[parseInt(questionIndex)]?.id || questionIndex,
            user_answer: answer
          }))
        };
        
        const evaluationResponse = await agentAPI.examCoachEvaluate(submissionData);
        
        if (evaluationResponse.data.success) {
          console.log('Backend evaluation successful');
        }
      } catch (evaluationError) {
        console.log('Backend evaluation not available, using local evaluation');
      }
      
      // Calculate time taken
      const timeElapsed = currentExam.time_limit * 60 - currentExam.timeRemaining;
      const timeTakenMinutes = Math.round(timeElapsed / 60);
      
      // Create exam result
      const examResult = {
        id: `result_${Date.now()}`,
        exam_id: currentExam.id,
        subject: currentExam.subject,
        topic: currentExam.topic,
        difficulty: currentExam.difficulty,
        score: score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        time_taken: timeTakenMinutes, // in minutes
        completed_at: new Date().toISOString(),
        question_results: questionResults,
        feedback: score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job! Keep practicing.' : 'Keep studying and try again.'
      };
      
      // Save to exam history with error handling
      try {
        const currentHistory = [...examHistory];
        const updatedHistory = [examResult, ...currentHistory];
        
        // Update state first
        setExamHistory(updatedHistory);
        
        // Then save to localStorage
        localStorage.setItem(`examCoachHistory_${userId}`, JSON.stringify(updatedHistory));
        
        // Show success message
        toast.success(`Exam completed! Score: ${score}% (${correctAnswers}/${totalQuestions})`);
        
        // Wait a bit before clearing current exam to ensure state updates
        setTimeout(() => {
          setCurrentExam(null);
          setActiveTab('history'); // Switch to history tab to show results
        }, 500);
        
      } catch (saveError) {
        console.error('Failed to save exam results:', saveError);
        toast.error('Exam completed but failed to save results locally');
        
        // Still show the score and clear the exam
        toast.success(`Score: ${score}% (${correctAnswers}/${totalQuestions})`);
        setTimeout(() => {
          setCurrentExam(null);
          setActiveTab('history');
        }, 500);
      }
      
    } catch (error) {
      console.error('Failed to finish exam:', error);
      toast.error(`Failed to complete exam: ${error.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  const ExamCard = ({ exam, onStart }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{exam.subject}</h3>
          <p className="text-sm text-gray-600">{exam.topic}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          exam.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
          exam.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {exam.difficulty}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          {exam.question_count} questions
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          {exam.time_limit} minutes
        </div>
      </div>

      <button
        onClick={() => onStart(exam)}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
      >
        <PlayIcon className="h-4 w-4 mr-2" />
        Start Exam
      </button>
    </div>
  );

  if (currentExam) {
    const currentQuestion = currentExam.questions?.[currentExam.currentQuestion];
    const progress = ((currentExam.currentQuestion + 1) / currentExam.questions?.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Exam Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentExam.subject}</h1>
                <p className="text-gray-600">{currentExam.topic}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className="text-lg font-semibold text-red-600">
                  {Math.floor(currentExam.timeRemaining / 60)}:
                  {(currentExam.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Question {currentExam.currentQuestion + 1} of {currentExam.questions?.length}
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.type === 'mcq' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentExam.currentQuestion}`}
                        value={option}
                        checked={currentExam.answers[currentExam.currentQuestion] === option}
                        onChange={(e) => submitAnswer(currentExam.currentQuestion, e.target.value)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <textarea
                  value={currentExam.answers[currentExam.currentQuestion] || ''}
                  onChange={(e) => submitAnswer(currentExam.currentQuestion, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentExam(prev => ({ ...prev, currentQuestion: Math.max(0, prev.currentQuestion - 1) }))}
              disabled={currentExam.currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentExam.currentQuestion < currentExam.questions?.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={finishExam}
                disabled={evaluating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {evaluating ? 'Evaluating...' : 'Finish Exam'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BeakerIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exam Coach</h1>
                <p className="text-lg text-gray-600">Practice with AI-generated exams and assessments</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Generate Exam
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('practice')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'practice'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Practice Exams
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exam History
            </button>
          </nav>
        </div>

        {/* Create Exam Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Exam</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={newExam.topic}
                  onChange={(e) => setNewExam({ ...newExam, topic: e.target.value })}
                  placeholder="e.g., Calculus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={newExam.difficulty}
                  onChange={(e) => setNewExam({ ...newExam, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                <select
                  value={newExam.question_count}
                  onChange={(e) => setNewExam({ ...newExam, question_count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                <select
                  value={newExam.time_limit}
                  onChange={(e) => setNewExam({ ...newExam, time_limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={generateExam}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Exam'}
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <ExamCard key={index} exam={exam} onStart={startExam} />
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {examHistory.map((result, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.subject} - {result.topic}</h3>
                    <p className="text-sm text-gray-600">Completed on {new Date(result.completed_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{result.score}%</div>
                    <div className="text-sm text-gray-600">{result.correct_answers}/{result.total_questions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty states */}
        {activeTab === 'practice' && exams.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practice exams yet</h3>
            <p className="text-gray-600 mb-4">Generate your first exam to start practicing!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Generate Your First Exam
            </button>
          </div>
        )}

        {activeTab === 'history' && examHistory.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exam history yet</h3>
            <p className="text-gray-600">Complete practice exams to see your results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCoachPage; 