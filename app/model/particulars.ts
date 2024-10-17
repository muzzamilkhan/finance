import { PrismaClient, Prisma } from '@prisma/client';

export default function Particulars() {
  const client = new PrismaClient();

  const run = async (
    op: (prisma: PrismaClient) => Promise<any>
  ): Promise<any> => {
    const result = await op(client);
    await client.$disconnect();

    return result;
  };

  const create = async (data: Prisma.ParticularsCreateInput) => {
    return run(async (prisma) => {
      return await prisma.particulars.create({ data });
    });
  };

  const update = async (id: number, data: Prisma.ParticularsUpdateInput) => {
    return run(async (prisma) => {
      return await prisma.particulars.update({
        where: {
          id,
        },
        data,
      });
    });
  };

  const get = async (id: number) => {
    return run(async (prisma) => {
      return await prisma.particulars.findFirst({ where: { id } });
    });
  };

  const remove = async (id: number) => {
    return run(async (prisma) => {
      return await prisma.particulars.delete({ where: { id } });
    });
  };

  const list = async () => {
    return run(async (prisma) => {
      return await prisma.particulars.findMany();
    });
  };

  const reset = async () => {
    return run(async (prisma) => {
      return await prisma.particulars.deleteMany({ where: { locked: false } });
    });
  };

  return {
    list,
    get,
    update,
    create,
    reset,
    remove,
  };
}
