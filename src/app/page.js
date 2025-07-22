// src/app/page.tsx
import Link from 'next/link';
import { BookOpen, BarChart3, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Plateforme de Test de Présélection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Évaluez votre niveau en anglais et logique avec notre test interactif complet
          </p>
        </div>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Test d'Anglais</h3>
            <p className="text-gray-600">11 questions pour évaluer votre niveau selon le CECR (A1, A2, B1)</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Test de Logique</h3>
            <p className="text-gray-600">10 questions de raisonnement logique et mathématique</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suivi des Résultats</h3>
            <p className="text-gray-600">Tableau de bord complet pour analyser les performances</p>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Informations sur le test</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  Durée : 30 minutes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  21 questions au total
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Évaluation automatique
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Résultats instantanés
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Niveaux d'évaluation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Anglais (CECR)</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">A1 (0-5)</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">A2 (6-9)</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">B1 (10-11)</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Logique</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Débutant (0-4)</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Intermédiaire (5-8)</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Avancé (9-10)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/test" className="group ">
            <button className="w-full sm:w-auto cursor-pointer  bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <span className="flex items-center justify-center">
                Commencer le Test
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <Link href="/recruiter/results" className="group cursor-pointer">
            <button className="w-full cursor-pointer sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 shadow-lg">
              <span className="flex items-center justify-center">
                Voir les Résultats
                <BarChart3 className="ml-2 h-5 w-5" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}