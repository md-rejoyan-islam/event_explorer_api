import SeedService from "../../services/seed.service";

const mutation = {
  createSeedUsers: async () => {
    return await SeedService.seedUsers();
  },
  createSeedEvents: async () => {
    return await SeedService.seedEvents();
  },
  createSeedEnrolledEvents: async () => {
    return await SeedService.seedEnrolledEvents();
  },
};

const seedResolver = {
  Mutation: mutation,
};

export default seedResolver;
