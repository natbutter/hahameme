import React, { useState } from 'react';
import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;

const MemeGenerator = () => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [loading, setLoading] = useState(false);

  const prompts = [
    "Shitcoins",
    "Pumping",
    "Bought",
    "The Dip",
    "Hodling through chaos"
  ];

  const generateText = async () => {
    setLoading(true);

    // Load the text generation pipeline with GPT-2
    const generator = await pipeline('text-generation', 'Xenova/distilgpt2');

    // Randomly select two prompts
    const prompt1 = prompts[Math.floor(Math.random() * prompts.length)];
    const prompt2 = prompts[Math.floor(Math.random() * prompts.length)];

    // Generate the first text
    const output1 = await generator(prompt1, {
        temperature: 200,
        max_new_tokens: 15,
        // repetition_penalty: 1.5,
        // no_repeat_ngram_size: 2,
        num_beams: 1,
        num_return_sequences: 1,
    });

    // Generate the second text
    const output2 = await generator(prompt2, {
        temperature: 0.1,
        max_new_tokens: 15,
        // repetition_penalty: 1.5,
        // no_repeat_ngram_size: 2,
        num_beams: 1,
        num_return_sequences: 1,
    });

    setTopText(output1[0].generated_text);
    setBottomText(output2[0].generated_text);

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Meme Text Generator</h1>
      <button onClick={generateText} disabled={loading}>
        {loading ? 'Generating...' : 'Use magic computer make funny words'}
      </button>

      <div >
      Or use big brain
      </div>
      

      <div className="inputs">
        <label htmlFor="top-text-input">Add funny OG word:</label>
        <input
          type="text"
          id="top-text-input"
          placeholder="Enter top text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />

        <label htmlFor="bottom-text-input">Add funny GG word:</label>
        <input
          type="text"
          id="bottom-text-input"
          placeholder="Enter bottom text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
      </div>

        <div className="meme-container">
          <img id="meme-image" src="funnymeme.jpg" alt="Meme Image" />
          <div className="text top-meme-text" id="top-text">
            {topText}
          </div>
          <div className="text bottom-meme-text" id="bottom-text">
            {bottomText}
          </div>
        </div>
      
    </div>
  );
};

export default MemeGenerator;
