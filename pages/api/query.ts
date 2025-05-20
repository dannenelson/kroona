// pages/api/query.ts
import { OpenAI } from 'openai';
import { products } from '../../data/products';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { question } = req.body;

 try {
   console.log("Fråga från frontend:", question);
 
	const productDescriptions = products.map((p, i) => {
	return `Namn: ${p.name}\nBeskrivning: ${p.description}`;
	}).join('\n\n');
	
	const userMessage = `
	Här är en lista med produkter:
	
	${productDescriptions}
	
	Fråga: "${question}"
	
	Vilken produkt passar bäst? Svara med produktens namn och en kort förklaring.
	`;

   const chatResponse = await openai.chat.completions.create({
	 model: "gpt-3.5-turbo", //gpt-4
	 messages: [
	   { role: "system", content: "Du är en expert på elcyklar och hjälper användare att hitta rätt cykel." },
	   { role: "user", content: userMessage }
	 ]
   });
 
   console.log("OpenAI svar:", chatResponse);
 
   const answerText = chatResponse.choices[0]?.message?.content || '';
   
   let matchedProduct = null;
   for (const p of products) {
	 if (answerText.toLowerCase().includes(p.name.toLowerCase())) {
	   matchedProduct = p;
	   break;
	 }
   }
 
   if (!product) {
	 console.log("Ingen produkt matchade svaret.");
	 return res.status(200).json({ answer: answerText, products: [] });
   }
 
   return res.status(200).json({ answer: answerText, products: [product] });
 
 } catch (error) {
   console.error("OpenAI error:", error);
   return res.status(500).json({ error: "Något gick fel: " + (error instanceof Error ? error.message : error) });
 }
}