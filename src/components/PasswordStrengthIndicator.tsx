import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const requirements: PasswordRequirement[] = [
    {
      label: 'Pelo menos 8 caracteres',
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: 'Pelo menos uma letra maiúscula',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Pelo menos uma letra minúscula',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: 'Pelo menos um número',
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      label: 'Pelo menos um caractere especial (!@#$...)',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    },
  ];

  const getMetRequirements = () => {
    return requirements.filter(req => req.test(password)).length;
  };

  const getStrengthColor = () => {
    const metCount = getMetRequirements();
    if (metCount === requirements.length) return 'bg-green-500';
    if (metCount >= 3) return 'bg-yellow-500';
    if (metCount >= 1) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    const metCount = getMetRequirements();
    if (metCount === requirements.length) return 'Senha forte';
    if (metCount >= 3) return 'Senha média';
    if (metCount >= 1) return 'Senha fraca';
    return 'Senha muito fraca';
  };

  if (!password) return null;

  const metCount = getMetRequirements();
  const strengthPercentage = (metCount / requirements.length) * 100;

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de força da senha */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>

      {/* Texto de força da senha */}
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium ${
          metCount === requirements.length 
            ? 'text-green-600 dark:text-green-400' 
            : metCount >= 3 
            ? 'text-yellow-600 dark:text-yellow-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {getStrengthText()}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {metCount}/{requirements.length} requisitos atendidos
        </span>
      </div>

      {/* Lista de requisitos */}
      <ul className="space-y-1 text-xs">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li
              key={index}
              className={`flex items-center gap-2 transition-colors ${
                isMet 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${isMet ? 'text-green-500' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {isMet ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;

// Função utilitária para validar senha
export const validatePassword = (password: string): boolean => {
  const requirements = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];
  
  return requirements.every(req => req === true);
};
