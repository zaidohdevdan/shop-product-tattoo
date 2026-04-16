"use client";

import React from "react";
import { JsonLd } from "./JsonLd";

interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    image: string;
    price: number;
    sku: string;
    slug: string;
    category?: string;
  };
  siteUrl: string;
}

export function ProductJsonLd({ product, siteUrl }: ProductJsonLdProps) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "ShopTattoo"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/products/${product.slug}`,
      "priceCurrency": "BRL",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return <JsonLd data={jsonLdData} />;
}
