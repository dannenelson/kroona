'use client';
import { useState } from 'react';
import { products } from '../data/products'; // anpassa sökväg
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';
import { QuestionInput } from '../components/QuestionInput';


export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
	if (!question.trim()) return;

	setLoading(true);
	setAnswer('');
	setProduct(null);

	try {
	  const response = await fetch('/api/query', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt: input }),
	  });
	  const data = await response.json();
	  console.log('Data från API:', data);
	  setAnswer(data.answer);
	  	  
		if (data.product) {
			// Om det är ett namn (string)
			if (typeof data.product === 'string') {
			const found = products.find(p => p.name === data.product);
			setProduct(found || null);
			} else {
			// Om det redan är ett produktobjekt
			setProduct(data.product);
			}
		} else {
			setProduct(null);
		}	  
	 
	} catch (err) {
	  console.error('Kunde inte hämta svar:', err);
	  setAnswer('Ett fel uppstod.');
	} finally {
	  setLoading(false);
	}
  };

  // Hitta liknande produkter, dvs de som inte är huvudprodukten
  const similarProducts = product
	? products.filter(p => p.name !== product?.name)
	: [];

  return (
	<div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
	  <h1>Fråga efter en produkt</h1>
	  
	  <QuestionInput
		question={question}
		setQuestion={setQuestion}
		handleAsk={handleAsk}
	  />

	  {loading && (
		<div style={{ marginTop: '2rem', textAlign: 'center' }}>
		  <Spinner />
		  <p>Letar efter bästa produkten åt dig…</p>
		</div>
	  )}

	  {!loading && answer && (
		<div style={{ marginTop: '2rem' }}>
		  <h3>Rekommenderad produkt:</h3>
		  <p>{answer}</p>

		  {products.length > 0 && (
			<>
			  <ProductCard product={products[0]} />
			  {products.length > 1 && (
				<>
				  <h4>Liknande produkter:</h4>
				  {products.slice(1).map((p, i) => (
					<ProductCard key={i} product={p} />
				  ))}
				</>
			  )}
			</>
		  )}
		</div>
	  )}
	</div>
  );
  
  
}