const resolvers = {
    games: () => games,
    game: ({ id }) => games.find((game) => game.id === id) || null
};

export { resolvers };