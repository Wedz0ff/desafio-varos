import { useState, useCallback } from "react";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface UseCepReturn {
  loading: boolean;
  error: string | null;
  fetchAddress: (cep: string) => Promise<ViaCepResponse | null>;
}

export function useCep(): UseCepReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(
    async (cep: string): Promise<ViaCepResponse | null> => {
      const cleanCep = cep.replace(/\D/g, "");

      if (cleanCep.length !== 8) {
        setError("CEP inválido");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar CEP");
        }

        const data: ViaCepResponse = await response.json();

        if (data.erro) {
          setError("CEP não encontrado");
          return null;
        }

        return data;
      } catch (err) {
        setError("Erro ao buscar CEP");
        console.error("Erro ao buscar CEP:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, fetchAddress };
}
