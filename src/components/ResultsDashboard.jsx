import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Download, Search, Filter, Eye, Calendar, MapPin, Briefcase } from 'lucide-react';

const ResultsDashboard = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/responses');
      const data = await response.json();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date', 'Email', 'Nom', 'Poste', 'Entreprise', 'Ville', 'Objectif',
      'Score Anglais', 'Niveau Anglais', '% Anglais',
      'Score Logique', 'Niveau Logique', '% Logique'
    ];

    const csvContent = [
      headers.join(','),
      ...responses.map(r => [
        new Date(r.createdAt).toLocaleDateString(),
        r.email,
        r.fullName,
        r.position,
        r.company || '',
        r.city?.name || '',
        r.objective.replace(/,/g, ';'),
        r.englishScore,
        r.englishLevel,
        r.englishPercent + '%',
        r.logicScore,
        r.logicLevel,
        r.logicPercent + '%'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats_test_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterLevel === 'all' || 
      response.englishLevel === filterLevel || 
      response.logicLevel === filterLevel;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: responses.length,
    avgEnglishScore: responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + r.englishScore, 0) / responses.length) : 0,
    avgLogicScore: responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + r.logicScore, 0) / responses.length) : 0,
    topPerformers: responses.filter(r => r.englishScore >= 9 && r.logicScore >= 8).length
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-red-100 text-red-800',
      'A2': 'bg-yellow-100 text-yellow-800',
      'B1': 'bg-green-100 text-green-800',
      'Débutant': 'bg-red-100 text-red-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-green-100 text-green-800',
      'Expert': 'bg-blue-100 text-blue-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const ResponseModal = ({ response, onClose }) => {
    if (!response) return null;

    const englishQuestions = [
      'I _______ a software engineer.',
      'Where _______ you from?',
      'It\'s very _______ today.',
      'My colleague _______ football every Sunday.',
      'Which sentence is correct?',
      'Sarah works in a tech company. She takes the metro. What does she do on weekends?',
      'I\'ve worked here _______ 2020.',
      'If the meeting ______ tomorrow, we\'ll attend remotely.',
      'You _______ smoke in the office.',
      'Choose the correct sentence:',
      'I _______ to the conference last week.'
    ];

    const logicQuestions = [
      '3 – 6 – 12 – 24 – ?',
      '7 – 14 – 28 – 56 – ?',
      '1 – 1 – 2 – 3 – 5 – 8 – ?',
      'A – C – F – J – ?',
      'Tous les développeurs utilisent un ordinateur. Marc utilise un ordinateur. → Marc est-il développeur ?',
      'Si je travaille tard, je suis fatigué. Or je ne suis pas fatigué. → Ai-je travaillé tard ?',
      'Aucun manager ne fait d\'erreurs. Sophie est manager. → Sophie fait-elle des erreurs ?',
      'Tous les ingénieurs aiment les maths. Paul aime les maths. → Paul est-il ingénieur ?',
      'Tu as 5 allumettes. Quelle est la forme géométrique fermée la plus simple que tu peux créer avec ces allumettes (sans les casser) ?',
      'Tu croises 3 portes... Une mène à la sortie, une à une boucle infinie, une à un piège. Un gardien dit toujours la vérité, un ment toujours, un répond aléatoirement. → Quelle question poses-tu à un seul gardien pour trouver la porte de sortie ?'
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Détails de la réponse</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nom:</strong> {response.fullName}</div>
                <div><strong>Email:</strong> {response.email}</div>
                <div><strong>Poste:</strong> {response.position}</div>
                <div><strong>Entreprise:</strong> {response.company || 'Non spécifié'}</div>
                <div><strong>Ville:</strong> {response.city?.name || 'Non spécifiée'}</div>
                <div><strong>Date:</strong> {new Date(response.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-3">
                <strong>Objectif:</strong> {response.objective}
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Score Anglais</h3>
                <div className="text-3xl font-bold text-green-600">{response.englishScore}/11</div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${getLevelColor(response.englishLevel)}`}>
                    {response.englishLevel}
                  </span>
                  <span className="text-sm text-gray-600">{response.englishPercent}%</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Score Logique</h3>
                <div className="text-3xl font-bold text-purple-600">{response.logicScore}/10</div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${getLevelColor(response.logicLevel)}`}>
                    {response.logicLevel}
                  </span>
                  <span className="text-sm text-gray-600">{response.logicPercent}%</span>
                </div>
              </div>
            </div>

            {/* Detailed Answers */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Réponses détaillées</h3>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Questions d'Anglais</h4>
                <div className="space-y-2">
                  {englishQuestions.map((question, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-700">Q{index + 1}. {question}</div>
                      <div className="text-gray-600 ml-4">→ {response[`q${index + 1}`]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Questions de Logique</h4>
                <div className="space-y-2">
                  {logicQuestions.map((question, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-gray-700">Q{index + 12}. {question}</div>
                      <div className="text-gray-600 ml-4">→ {response[`q${index + 12}`]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord des résultats</h1>
          <p className="text-gray-600">Analysez les performances des candidats au test de présélection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total candidats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Moy. Anglais</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgEnglishScore}/11</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Moy. Logique</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgLogicScore}/10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top performers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.topPerformers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tous les niveaux</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste & Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Anglais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Logique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{response.fullName}</div>
                        <div className="text-sm text-gray-500">{response.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{response.position}</div>
                          <div className="text-sm text-gray-500">{response.company || 'Non spécifié'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{response.city?.name || 'Non spécifiée'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{response.englishScore}/11</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(response.englishLevel)}`}>
                        {response.englishLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{response.logicScore}/10</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(response.logicLevel)}`}>
                        {response.logicLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedResponse(response);
                          setShowModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">Aucun résultat trouvé</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ResponseModal
          response={selectedResponse}
          onClose={() => {
            setShowModal(false);
            setSelectedResponse(null);
          }}
        />
      )}
    </div>
  );
};

export default ResultsDashboard;