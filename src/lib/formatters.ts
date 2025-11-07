export function formatCPF(cpf: string): string {
  if (!cpf) return "";
  const numbers = cpf.replace(/\D/g, "");
  const limited = numbers.slice(0, 11);

  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(
      6,
      9
    )}-${limited.slice(9)}`;
  }
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const numbers = phone.replace(/\D/g, "");
  const limited = numbers.slice(0, 11);
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(
      6
    )}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
      7
    )}`;
  }
}

export function formatCEP(cep: string): string {
  if (!cep) return "";

  const numbers = cep.replace(/\D/g, "");
  const limited = numbers.slice(0, 8);
  if (limited.length <= 5) {
    return limited;
  } else {
    return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  }
}

export function unformatCEP(cep: string): string {
  return cep.replace(/\D/g, "");
}
