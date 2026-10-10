/**
 * Aryan Electronics - Image Discovery, Verification & Dataset Integrator
 */

const fs = require('fs');
const path = require('path');
const { PRODUCTS_METADATA } = require('./products_part1');
const { PRODUCTS_PART2 } = require('./products_part2');
const { PRODUCTS_PART3 } = require('./products_part3');

const allNewProducts = [...PRODUCTS_METADATA, ...PRODUCTS_PART2, ...PRODUCTS_PART3];
console.log(`Loaded ${allNewProducts.length} new product specifications.`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function verifyImageUrl(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    const ct = res.headers.get('content-type') || '';
    if (res.status === 200 && (ct.startsWith('image/') || ct.includes('octet-stream'))) {
      return true;
    }
  } catch (err) {}
  return false;
}

async function searchAmazonImage(query) {
  try {
    const url = 'https://www.amazon.in/s?k=' + encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Match Amazon product image URLs
    const matches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9+_-]+(?:\._[a-zA-Z0-9,_]+)?\.jpg/g) || [];
    for (const rawUrl of matches) {
      if (rawUrl.includes('icon') || rawUrl.includes('badge') || rawUrl.includes('sprite')) continue;
      // Extract image ID and test high-res version
      const idMatch = rawUrl.match(/\/images\/I\/([a-zA-Z0-9+_-]+)/);
      if (idMatch && idMatch[1]) {
        const highRes = `https://m.media-amazon.com/images/I/${idMatch[1]}._AC_SL1500_.jpg`;
        if (await verifyImageUrl(highRes)) return highRes;
        const mediumRes = `https://m.media-amazon.com/images/I/${idMatch[1]}._SL1000_.jpg`;
        if (await verifyImageUrl(mediumRes)) return mediumRes;
      }
      if (await verifyImageUrl(rawUrl)) return rawUrl;
    }
  } catch (err) {}
  return null;
}

async function searchWikimediaImage(query) {
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AryanElectronicsCatalogBot/1.0 (catalog@aryanelectronics.in)' }
    });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const thumb = p.imageinfo?.[0]?.thumburl;
      if (thumb && (thumb.includes('.jpg') || thumb.includes('.png') || thumb.includes('.webp'))) {
        if (await verifyImageUrl(thumb)) return thumb;
      }
    }
  } catch (err) {}
  return null;
}

async function processAll() {
  console.log('Beginning automated discovery and verification of 100 products...');
  const verifiedProducts = [];

  for (let i = 0; i < allNewProducts.length; i++) {
    const prod = allNewProducts[i];
    process.stdout.write(`[${i + 1}/${allNewProducts.length}] (${prod.sector}) ID ${prod.id}: ${prod.title.slice(0, 35)}... `);

    let imageUrl = null;

    // 1. Try Amazon search
    if (prod.searchQuery) {
      imageUrl = await searchAmazonImage(prod.searchQuery);
    }

    // 2. Fallback to title query on Amazon
    if (!imageUrl) {
      imageUrl = await searchAmazonImage(prod.title);
    }

    // 3. Fallback to Wikimedia Commons
    if (!imageUrl) {
      imageUrl = await searchWikimediaImage(prod.title);
    }

    // 4. Fallback to brand + category on Wikimedia Commons
    if (!imageUrl) {
      imageUrl = await searchWikimediaImage(`${prod.brand} ${prod.category}`);
    }

    if (imageUrl) {
      console.log(`✓ OK: ${imageUrl.slice(0, 50)}...`);
      prod.thumbnail = imageUrl;
      prod.images = [imageUrl];
      delete prod.searchQuery;
      verifiedProducts.push(prod);
    } else {
      console.log(`✗ FAILED`);
      // Keep it in list so we see what failed
      prod.thumbnail = null;
      verifiedProducts.push(prod);
    }

    await sleep(400); // polite rate limit
  }

  const failedCount = verifiedProducts.filter(p => !p.thumbnail).length;
  console.log(`\n=====================================================`);
  console.log(`Discovery Complete: ${verifiedProducts.length - failedCount}/100 verified.`);
  console.log(`Failed: ${failedCount}`);

  // Write temporary progress file
  fs.writeFileSync(path.resolve(__dirname, 'verified_100_progress.json'), JSON.stringify(verifiedProducts, null, 2));
}

processAll().catch(console.error);
