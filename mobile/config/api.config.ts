// Configurações para a API
//
// __DEV__ é true no Expo Go / desenvolvimento
// e false em builds de produção.
//
// Em desenvolvimento, substitua o IP pelo IPv4 da sua máquina
// (obtido com `ipconfig` no Windows ou `ifconfig` no Linux/Mac).
// O celular precisa estar na mesma rede Wi-Fi.
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://10.0.0.109:3001"
    : "https://pizzaria-9bti.onrender.com",
  TIMEOUT: 12000, // 12 segundos
};
