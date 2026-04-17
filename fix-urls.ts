import { prisma } from './src/lib/prisma';

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    let changed = false;
    const newImages = product.images.map(url => {
      if (url.includes('/image/upload/e_background_removal/c_pad')) {
        changed = true;
        return url.replace('/image/upload/e_background_removal/c_pad,w_1080,h_1080,q_auto,f_png/', '/image/upload/');
      }
      if (url.includes('/image/upload/c_fill')) {
        changed = true;
        return url.replace('/image/upload/c_fill,w_1080,h_1080,q_auto,f_auto/', '/image/upload/');
      }
      if (url.includes('/image/upload/c_pad')) {
        changed = true;
        return url.replace('/image/upload/c_pad,w_1080,h_1080,q_auto,f_auto/', '/image/upload/');
      }
      return url;
    });

    if (changed) {
      console.log(`Fixing URLs for product ${product.id}`);
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      });
    }
  }
  console.log("Done");
}

main().catch(console.error).finally(() => process.exit(0));
