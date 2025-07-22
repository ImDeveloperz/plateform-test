"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Clock, BookOpen, Brain, CheckCircle } from 'lucide-react';

const TestForm = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    position: '',
    company: '',
    objective: '',
    cityId: '',
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '', q11: '',
    q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: '', q21: ''
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: 0, name: 'Informations', icon: BookOpen, color: 'bg-blue-500' },
    { id: 1, name: 'Anglais', icon: BookOpen, color: 'bg-green-500' },
    { id: 2, name: 'Logique', icon: Brain, color: 'bg-purple-500' }
  ];

  const englishQuestions = [
    { id: 'q1', text: 'I _______ a software engineer.', options: ['am', 'is', 'are', 'be'] },
    { id: 'q2', text: 'Where _______ you from?', options: ['is', 'are', 'am', 'be'] },
    { id: 'q3', text: 'It\'s very _______ today.', options: ['hot', 'heat', 'heating', 'heated'] },
    { id: 'q4', text: 'My colleague _______ football every Sunday.', options: ['play', 'plays', 'playing', 'played'] },
    { id: 'q5', text: 'Which sentence is correct?', options: ['I visited London last year.', 'I visit London last year.', 'I have visit London last year.', 'I visiting London last year.'] },
    { id: 'q6', text: 'Sarah works in a tech company. She takes the metro. What does she do on weekends?', options: ['She visits museums or goes hiking.', 'She work on weekends.', 'She always stay home.', 'She don\'t like weekends.'] },
    { id: 'q7', text: 'I\'ve worked here _______ 2020.', options: ['for', 'since', 'from', 'at'] },
    { id: 'q8', text: 'If the meeting ______ tomorrow, we\'ll attend remotely.', options: ['happen', 'happens', 'happening', 'happened'] },
    { id: 'q9', text: 'You _______ smoke in the office.', options: ['can\'t', 'mustn\'t', 'don\'t', 'won\'t'] },
    { id: 'q10', text: 'Choose the correct sentence:', options: ['She doesn\'t like remote work.', 'She don\'t like remote work.', 'She not like remote work.', 'She no like remote work.'] },
    { id: 'q11', text: 'I _______ to the conference last week.', options: ['go', 'goes', 'went', 'going'] }
  ];

  const logicQuestions = [
    { id: 'q12', text: '3 – 6 – 12 – 24 – ?', options: ['36', '48', '60', '72'] },
    { id: 'q13', text: '7 – 14 – 28 – 56 – ?', options: ['84', '112', '98', '126'] },
    { id: 'q14', text: '1 – 1 – 2 – 3 – 5 – 8 – ?', options: ['11', '13', '15', '16'] },
    { id: 'q15', text: 'A – C – F – J – ?', options: ['M', 'N', 'O', 'P'] },
    { id: 'q16', text: 'Tous les développeurs utilisent un ordinateur. Marc utilise un ordinateur. → Marc est-il développeur ?', options: ['Oui', 'Non', 'Pas forcément', 'Impossible à dire'] },
    { id: 'q17', text: 'Si je travaille tard, je suis fatigué. Or je ne suis pas fatigué. → Ai-je travaillé tard ?', options: ['Oui', 'Non', 'Pas forcément', 'Impossible à dire'] },
    { id: 'q18', text: 'Aucun manager ne fait d\'erreurs. Sophie est manager. → Sophie fait-elle des erreurs ?', options: ['Oui', 'Non', 'Pas forcément', 'Impossible à dire'] },
    { id: 'q19', text: 'Tous les ingénieurs aiment les maths. Paul aime les maths. → Paul est-il ingénieur ?', options: ['Oui', 'Non', 'Pas forcément', 'Impossible à dire'] },
    { id: 'q20', text: 'Tu as 5 allumettes. Quelle est la forme géométrique fermée la plus simple que tu peux créer avec ces allumettes (sans les casser) ?', options: ['Carré', 'Triangle', 'Pentagone', 'Hexagone'] },
    { id: 'q21', text: 'Tu croises 3 portes... Une mène à la sortie, une à une boucle infinie, une à un piège. Un gardien dit toujours la vérité, un ment toujours, un répond aléatoirement. → Quelle question poses-tu à un seul gardien pour trouver la porte de sortie ?', options: ['Où est la sortie ?', 'Si je demandais à l\'autre gardien quelle porte mène à la sortie, que me dirait-il ?', 'Êtes-vous le gardien qui dit la vérité ?', 'Quelle porte ne mène pas à la sortie ?'] }
  ];

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getProgress = () => {
    const totalQuestions = 21 + 5; // 21 test questions + 5 personal info fields
    const answered = Object.values(formData).filter(value => value !== '').length;
    return Math.round((answered / totalQuestions) * 100);
  };

  const getTabProgress = (tabId) => {
    if (tabId === 0) {
      const personalFields = ['email', 'fullName', 'position', 'objective', 'cityId'];
      const answered = personalFields.filter(field => formData[field] !== '').length;
      return Math.round((answered / personalFields.length) * 100);
    } else if (tabId === 1) {
      const englishFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11'];
      const answered = englishFields.filter(field => formData[field] !== '').length;
      return Math.round((answered / englishFields.length) * 100);
    } else if (tabId === 2) {
      const logicFields = ['q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21'];
      const answered = logicFields.filter(field => formData[field] !== '').length;
      return Math.round((answered / logicFields.length) * 100);
    }
    return 0;
  };

  const canProceed = (tabId) => {
    if (tabId === 0) {
      return formData.email && formData.fullName && formData.position && formData.objective && formData.cityId;
    } else if (tabId === 1) {
      return englishQuestions.every(q => formData[q.id] !== '');
    } else if (tabId === 2) {
      return logicQuestions.every(q => formData[q.id] !== '');
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!canProceed(2)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Soumis!</h2>
          <p className="text-gray-600">Merci d'avoir complété le test de présélection. Vos résultats ont été enregistrés.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test de Présélection</h1>
          <p className="text-gray-600">Anglais & Logique</p>
          <div className="mt-4 bg-white rounded-full p-1 inline-flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">30-40 minutes</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression générale</span>
            <span>{getProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const progress = getTabProgress(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentTab === tab.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Icon className={`h-6 w-6 ${currentTab === tab.id ? 'text-purple-600' : 'text-gray-500'}`} />
                </div>
                <div className="text-sm font-medium text-gray-800">{tab.name}</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${tab.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Personal Information Tab */}
          {currentTab === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations Personnelles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonction/Poste actuel *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: Développeur, Étudiant..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => handleInputChange('cityId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise/École
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nom de votre entreprise ou école"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectif principal *
                </label>
                <textarea
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="Décrivez votre objectif principal..."
                />
              </div>
            </div>
          )}

          {/* English Questions Tab */}
          {currentTab === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Questions d'Anglais</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Niveau:</span>
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">A1 (0-5)</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">A2 (6-9)</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">B1 (10-11)</span>
                  </div>
                </div>
              </div>

              {englishQuestions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Q{index + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={formData[question.id] === option}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Logic Questions Tab */}
          {currentTab === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Questions de Logique</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Niveau:</span>
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Débutant (0-4)</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Intermédiaire (5-8)</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Avancé (9-10)</span>
                  </div>
                </div>
              </div>

              {logicQuestions.map((question, index) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Q{index + 12}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={formData[question.id] === option}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
            disabled={currentTab === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              currentTab === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Précédent</span>
          </button>

          {currentTab < 2 ? (
            <button
              onClick={() => setCurrentTab(currentTab + 1)}
              disabled={!canProceed(currentTab)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                canProceed(currentTab)
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed(currentTab) || loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                canProceed(currentTab) && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Soumettre</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestForm;