type UserGatewayDTO = {
  validateUserId: (id: string) => Promise<string>;
};

export type { UserGatewayDTO };
