import React, { useState, useRef, useEffect } from 'react';
import { pipeline, env } from '@xenova/transformers';
// import TextField from '@mui/material/TextField';
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

    ctx.font = '12px Comic Sans MS';
    // ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.1;
    ctx.textAlign = 'left';

    // const canvasWidth = ctx.canvas.width;
    // const canvasHeight = ctx.canvas.Height;

    if (topText) {
      const lines = [];
      for (let i = 0; i < topText.length; i += 10) {
        lines.push(topText.substring(i, i + 10));
      }

      ctx.fillText(lines[0], 45, 170);
      ctx.fillText(lines[1], 45, 180);
      ctx.fillText(lines[2], 45, 190);
      ctx.fillText(lines[3], 45, 200);
      // ctx.fillText(topText, 45, 170); 
    }

    if (bottomText) {

      const lines = [''];
      for (let i = 0; i < bottomText.length; i += 10) {
        lines.push(bottomText.substring(i, i + 10));
      }

      ctx.fillText(lines[0], 390, 170);
      ctx.fillText(lines[1], 390, 180);
      ctx.fillText(lines[2], 390, 190);
      ctx.fillText(lines[3], 390, 200);

      // ctx.strokeText(bottomText, canvasWidth / 2, canvasHeight - 20);
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
      <h1>Life in the Trenches</h1>
      <button onClick={generateText} disabled={loading}>
        {loading ? 'Generating...' : 'Use magic computer make funny words'}
      </button>

      <div >
        Or use big brain
      </div>


      <div className="inputs">
        <div className="input-group">
          <label htmlFor="top-text-input">Add funny GG word:</label>
          <textarea
            id="top-text-input"
            placeholder="green guy words"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            rows="3"
            maxLength={40}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bottom-text-input">Add funny OG word:</label>
          <textarea
            id="bottom-text-input"
            placeholder="orange guy words"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            rows="3"
            maxLength={40}
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
