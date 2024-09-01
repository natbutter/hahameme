import React, { useState, useRef, useEffect } from 'react';
import { pipeline, env } from '@xenova/transformers';
env.allowLocalModels = false;

const MemeGenerator = () => {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    if (image.complete) {
      drawMeme(ctx, image);
    } else {
      image.onload = () => drawMeme(ctx, image);
    }
  }, [topText, bottomText]);

  const drawMeme = (ctx, image) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = '12px ComicSans';
    // ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.1;
    ctx.textAlign = 'center';

    const canvasWidth = ctx.canvas.width;

    if (topText) {
      ctx.fillText(topText, canvasWidth / 6, 50);
      // ctx.strokeText(topText, canvasWidth / 2, 50);
    }

    if (bottomText) {
      ctx.fillText(bottomText, canvasWidth / 2, ctx.canvas.height - 20);
      ctx.strokeText(bottomText, canvasWidth / 2, ctx.canvas.height - 20);
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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
        <div className="input-group">
          <label htmlFor="top-text-input">Add funny GG word:</label>
          <input
            type="text"
            id="top-text-input"
            placeholder="Enter top text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bottom-text-input">Add funny OG word:</label>
          <input
            type="text"
            id="bottom-text-input"
            placeholder="Enter bottom text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </div>
      </div>


      <div className="meme-preview">
        <canvas ref={canvasRef} width={500} height={500} style={{ border: '1px solid black' }}></canvas>
      </div>

      <img
        ref={imageRef}
        src="ltt.png"
        alt="HaHa Meme"
        style={{ display: 'none' }}
        onLoad={() => drawMeme(canvasRef.current.getContext('2d'), imageRef.current)}
      />

      <button onClick={downloadMeme} disabled={loading}>
        Save this Picaso you fucking genius
      </button>

    </div>
  );
};

export default MemeGenerator;
