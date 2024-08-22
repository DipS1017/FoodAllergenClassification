import {PrismaClient} from '@prisma/client';

const prisma =new PrismaClient();

async function main(){

try{
await prisma.$connect();
  }catch(error){
    console.log('failed to connect');
  }finally{
    await prisma.$disconnect();
  }






}
main();
