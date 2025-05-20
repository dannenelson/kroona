// components/ProductCard.tsx
import React from "react";
import '../styles/ProductCard.css'; 

type Store = {
  name: string;
  logo: string;
  delivery: string;
};

type Product = {
  name: string;
  image: string;
  price: number;
  url: string;
  store: Store;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
	<a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.card}>
	  <img src={product.image} alt={product.name} className={styles.image} />
	  <div className={styles.info}>
		<h3>{product.name}</h3>
		<p className={styles.price}>{product.price.toLocaleString()} kr</p>
		<div className={styles.store}>
		  <img src={product.store.logo} alt={product.store.name} className={styles.logo} />
		  <span>{product.store.delivery}</span>
		</div>
	  </div>
	</a>
  );
}