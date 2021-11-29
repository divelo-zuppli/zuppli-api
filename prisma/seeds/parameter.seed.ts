import { Parameter, PrismaClient } from '@prisma/client';

const parameters: Parameter[] = [
  {
    id: 1,
    name: 'BASIC_ACL_CUSTOMER_ROLE_CODE',
    value: '01C',
  },
];

const seed = async (prisma: PrismaClient) => {
  await prisma.parameter.createMany({
    data: parameters,
    skipDuplicates: true,
  });
};

export default seed;
