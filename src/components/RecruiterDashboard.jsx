"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  MapPin, 
  Search, 
  Filter, 
  Download,
  Eye,
  Star,
  Brain,
  BookOpen,
  Calendar,
  Building2,
  Mail,
  Phone,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

const RecruiterDashboard = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    englishLevel: '',
    logicLevel: '',
    sortBy: 'totalScore',
    sortOrder: 'desc'
  });

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch cities and responses in parallel
      const [citiesResponse, responsesResponse] = await Promise.all([
        fetch('/api/cities'),
        fetch('/api/responses')
      ]);

      if (!citiesResponse.ok || !responsesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const citiesData = await citiesResponse.json();
      const responsesData = await responsesResponse.json();

      setCities(citiesData);
      setResponses(responsesData);
      setFilteredResponses(responsesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors du chargement des données. Veuillez actualiser la page.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total score
  const getTotalScore = (response) => {
    return Math.round((response.englishPercent + response.logicPercent) / 2);
  };

  // Get level color
  const getLevelColor = (level) => {
    switch (level) {
      case 'A1':
      case 'Débutant':
        return 'bg-red-100 text-red-800';
      case 'A2':
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'B1':
      case 'Avancé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort responses
  useEffect(() => {
    let filtered = responses.filter(response => {
      return (
        response.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        response.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        response.position.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.city === '' || response.cityId === filters.city) &&
      (filters.englishLevel === '' || response.englishLevel === filters.englishLevel) &&
      (filters.logicLevel === '' || response.logicLevel === filters.logicLevel);
    });

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'totalScore':
          aValue = getTotalScore(a);
          bValue = getTotalScore(b);
          break;
        case 'englishScore':
          aValue = a.englishPercent;
          bValue = b.englishPercent;
          break;
        case 'logicScore':
          aValue = a.logicPercent;
          bValue = b.logicPercent;
          break;
        case 'name':
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = getTotalScore(a);
          bValue = getTotalScore(b);
      }

      if (filters.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredResponses(filtered);
  }, [responses, filters]);

  // Statistics calculations
  const stats = {
    total: responses.length,
    avgEnglish: responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + r.englishPercent, 0) / responses.length) : 0,
    avgLogic: responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + r.logicPercent, 0) / responses.length) : 0,
    avgTotal: responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + getTotalScore(r), 0) / responses.length) : 0
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export function
  const exportData = () => {
    const csvContent = [
      // Header
      ['Nom', 'Email', 'Poste', 'Entreprise', 'Ville', 'Score Anglais (%)', 'Niveau Anglais', 'Score Logique (%)', 'Niveau Logique', 'Score Total (%)', 'Date'].join(','),
      // Data
      ...filteredResponses.map(response => [
        `"${response.fullName}"`,
        `"${response.email}"`,
        `"${response.position}"`,
        `"${response.company || ''}"`,
        `"${response.city.name}"`,
        response.englishPercent,
        response.englishLevel,
        response.logicPercent,
        response.logicLevel,
        getTotalScore(response),
        `"${formatDate(response.createdAt)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `resultats_test_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-700 bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Recruteur</h1>
          <p className="text-gray-600">Analyse des résultats du test de présélection</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Candidats</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Moy. Anglais</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgEnglish}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Moy. Logique</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgLogic}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Score Total Moy.</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgTotal}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, poste..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>

            <select
              value={filters.englishLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, englishLevel: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Niveau Anglais</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>

            <select
              value={filters.logicLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, logicLevel: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Niveau Logique</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="totalScore-desc">Score Total ↓</option>
              <option value="totalScore-asc">Score Total ↑</option>
              <option value="englishScore-desc">Anglais ↓</option>
              <option value="englishScore-asc">Anglais ↑</option>
              <option value="logicScore-desc">Logique ↓</option>
              <option value="logicScore-asc">Logique ↑</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="date-desc">Plus récent</option>
              <option value="date-asc">Plus ancien</option>
            </select>

            <button 
              onClick={() => exportData()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Résultats des candidats ({filteredResponses.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste & Ville
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Total
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anglais
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logique
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {responses.length === 0 ? 'Aucun candidat trouvé' : 'Aucun résultat pour ces filtres'}
                        </h3>
                        <p className="text-gray-500">
                          {responses.length === 0 
                            ? 'Les candidats apparaîtront ici une fois qu\'ils auront complété le test.'
                            : 'Essayez de modifier vos critères de recherche.'
                          }
                        </p>
                        {responses.length > 0 && (
                          <button
                            onClick={() => setFilters({
                              search: '',
                              city: '',
                              englishLevel: '',
                              logicLevel: '',
                              sortBy: 'totalScore',
                              sortOrder: 'desc'
                            })}
                            className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            Réinitialiser les filtres
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((response, index) => {
                  const totalScore = getTotalScore(response);
                  return (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {response.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{response.fullName}</div>
                            <div className="text-sm text-gray-500">{response.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{response.position}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {response.city.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            totalScore >= 80 ? 'bg-green-100 text-green-800' :
                            totalScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {totalScore >= 80 && <Star className="h-3 w-3 mr-1" />}
                            {totalScore}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{response.englishPercent}%</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(response.englishLevel)}`}>
                            {response.englishLevel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{response.logicPercent}%</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(response.logicLevel)}`}>
                            {response.logicLevel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDate(response.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedStudent(response)}
                          className="inline-flex items-center p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Profil du candidat</h3>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800">{selectedStudent.fullName}</h4>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedStudent.email}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Building2 className="h-4 w-4 mr-2" />
                      {selectedStudent.position}
                      {selectedStudent.company && ` • ${selectedStudent.company}`}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedStudent.city.name}
                    </p>
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Objectif</h5>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedStudent.objective}</p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-green-800">Anglais</h6>
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">{selectedStudent.englishPercent}%</p>
                    <p className="text-sm text-green-700">{selectedStudent.englishLevel}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-purple-800">Logique</h6>
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{selectedStudent.logicPercent}%</p>
                    <p className="text-sm text-purple-700">{selectedStudent.logicLevel}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-blue-800">Total</h6>
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{getTotalScore(selectedStudent)}%</p>
                    <div className="flex items-center mt-1">
                      {getTotalScore(selectedStudent) >= 80 && <Star className="h-4 w-4 text-blue-600 mr-1" />}
                      <p className="text-sm text-blue-700">
                        {getTotalScore(selectedStudent) >= 80 ? 'Excellent' : 
                         getTotalScore(selectedStudent) >= 60 ? 'Bon' : 'À améliorer'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Date */}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Test effectué le {formatDate(selectedStudent.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;