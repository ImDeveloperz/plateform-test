'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Home } from 'lucide-react'
import Image from 'next/image'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false, // Changed to false to handle errors properly
        callbackUrl: '/recruiter/results',
      })
      
      if (res?.error) {
        // Handle specific error messages
        if (res.error === 'CredentialsSignin') {
          setError('Email ou mot de passe incorrect. Veuillez vérifier vos informations.')
        } else if (res.error === 'Invalid credentials') {
          setError('Email ou mot de passe incorrect. Veuillez vérifier vos informations.')
        } else if (res.error === 'User not found') {
          setError('Aucun compte trouvé avec cette adresse email.')
        } else if (res.error === 'Invalid password') {
          setError('Mot de passe incorrect. Veuillez réessayer.')
        } else if (res.error === 'Invalid email') {
          setError('Adresse email invalide. Veuillez vérifier le format.')
        } else {
          setError(res.error)
        }
      } else if (res?.ok) {
        // Successful login - redirect manually
        router.push('/recruiter/results')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      
      <div className="max-w-md w-full space-y-8 mx-6">
        {/* Home Button */}
        

        {/* Header */}
        <div className="text-center">
          <div className="flex cursor-pointer justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Web4jobs Logo"
              width={100}
              height={100}
              className="object-cover"
              onClick={()=>{
                handleGoHome()
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion
          </h2>
          <p className="text-gray-600">
            Développez votre carrière avec Web4jobs
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mx-4">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>


        </div>

        {/* Bottom Text */}
        <div className="text-center mx-4">
          <p className="text-xs text-gray-500">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors">
              conditions d&apos;utilisation
            </a>{' '}
            et notre{' '}
            <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors">
              politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}