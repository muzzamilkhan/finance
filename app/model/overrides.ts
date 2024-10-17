import { PrismaClient, Prisma } from '@prisma/client';
import { DateTime } from 'luxon';

export default function Overrides() {
  const client = new PrismaClient();

  const run = async (
    op: (prisma: PrismaClient) => Promise<any>
  ): Promise<any> => {
    const result = await op(client);
    await client.$disconnect();

    return result;
  };

  const create = async (data: Prisma.OverridesUncheckedCreateInput) => {
    return run(async (prisma) => {
      return await prisma.overrides.create({ data });
    });
  };

  const update = async (id: number, data: Prisma.OverridesUpdateInput) => {
    return run(async (prisma) => {
      return await prisma.overrides.update({
        where: {
          id,
        },
        data,
      });
    });
  };

  const get = async (id: number) => {
    return run(async (prisma) => {
      return await prisma.overrides.findFirst({
        where: { id },
        include: { particular: true },
      });
    });
  };

  const list = async () => {
    return run(async (prisma) => {
      return await prisma.overrides.findMany({ include: { particular: true } });
    });
  };

  const reset = async () => {
    return run(async (prisma) => {
      return await prisma.overrides.deleteMany();
    });
  };

  const prune = async () => {
    return run(async (prisma) => {
      const today = DateTime.now().startOf('day').toSeconds();
      return await prisma.overrides.deleteMany({
        where: {
          date: {
            lt: today,
          },
        },
      });
    });
  };

  const remove = async (id: number) => {
    return run(async (prisma) => {
      return await prisma.overrides.delete({ where: { id } });
    });
  };

  return {
    list,
    get,
    update,
    create,
    reset,
    remove,
    prune,
  };
}
