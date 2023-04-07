import { useEffect, useRef, useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';

import { Box, Button, useTheme } from '@mui/material';
import { Stack } from '@mui/system';

// import abi from '../abi.json'
import WILL_ABI from '../abi/willAbi';
import showMessage from './showMessage';

export default function MintTomb() {
  const { address } = useAccount();
  const theme = useTheme();
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [modifiedImgSrc, setModifiedImgSrc] = useState('');

  const { data, writeAsync } = useContractWrite({
    address: '0x43c4Ebf956F7804596c333B209Ff246a476594DA',
    abi: WILL_ABI,
    functionName: 'mint',
    mode: 'recklesslyUnprepared',
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const handleMint = async () => {
    try {
      setMintLoading(true);
      const response = await fetch('/api/upload/png', {
        method: 'POST',
        body: modifiedImgSrc,
      });
      const body = await response.json();
      const { cid } = body;
      const data = btoa(
        JSON.stringify({
          name: 'mflayer2-badge',
          description: 'mflayer2-badge',
          image: `ipfs://${cid}`,
        })
      );
      console.log(cid);
      // const res = await writeAsync?.({
      //   recklesslySetUnpreparedArgs: ['data:application/json;base64,' + data],
      // });
      // console.log(res);
      setMintLoading(false);
    } catch (err) {
      console.log(err);
      showMessage({
        type: 'error',
        title: 'Estimate Fail',
        body: 'You may have already minted or other reason.',
      });
      setMintLoading(false);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      showMessage({
        type: 'success',
        title: `Mint Successfully`,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    // 获取 canvas 元素和上下文对象
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1E1E1E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 在组件加载时，加载图片
    const img = new Image();
    img.src = '/svg/tomb.svg';
    img.onload = () => {
      // 将图片绘制到 canvas 上
      ctx.drawImage(img, 0, 0);
      setImgLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (imgLoaded) {
      // 获取 canvas 元素和上下文对象
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.wrapText = function (text, x, y, maxWidth, lineHeight) {
        if (
          typeof text != 'string' ||
          typeof x != 'number' ||
          typeof y != 'number'
        ) {
          return;
        }

        var context = this;
        var canvas = context.canvas;

        if (typeof maxWidth == 'undefined') {
          maxWidth = (canvas && canvas.width) || 300;
        }
        if (typeof lineHeight == 'undefined') {
          lineHeight =
            (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
            parseInt(window.getComputedStyle(document.body).lineHeight);
        }

        // 字符分隔为数组
        var arrText = text.split('');
        var line = '';

        for (var n = 0; n < arrText.length; n++) {
          var testLine = line + arrText[n];
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = arrText[n];
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      };

      // 在 canvas 上执行绘制操作
      ctx.fillStyle = '#E9E9E9';
      ctx.font = '40px Open Sans';
      ctx.fillText(`章鱼哥的梦想`, 480, 320);
      ctx.fillText(`2000.01.03-2010.03.03`, 420, 400);
      // ctx.fillText(`Death in ${new Date().getTime()}`, 392, 460);
      ctx.wrapText(
        '在这里安息的是章鱼哥，他用他闪闪发光的精神和勇气，追求了他心中最大的梦想。',
        392,
        520,
        440,
        50
      );

      ctx.fillStyle = '#6C6C6C';
      ctx.font = '40px Open Sans';
      ctx.fillText(address, 530, 2033);

      // 将修改后的图片转换为 base64 格式
      const modifiedImgSrc = canvas.toDataURL('image/png');
      setModifiedImgSrc(modifiedImgSrc);
      console.log(modifiedImgSrc);
    }
  }, [imgLoaded]);

  return (
    <Stack
      gap={'28px'}
      marginTop={2}
      alignItems="center"
      sx={{
        background: theme?.palette?.mode === 'dark' ? '#010101' : '#f6f6f6',
        borderRadius: '18px',
        paddingY: '28px',
      }}
    >
      <Box sx={{ borderRadius: '18px' }}>
        <canvas
          ref={canvasRef}
          width={1200}
          height={1200}
          style={{
            zoom: '0.25',
            border: '1px solid #FFFFFF',
            // borderRadius: '98px',
          }}
        ></canvas>
      </Box>

      <Button
        variant="contained"
        disabled={isLoading | mintLoading}
        onClick={handleMint}
        sx={{
          width: '265px',
          height: '64px',
          fontSize: '20px',
          fontWeight: '800',
          textTransform: 'capitalize',
          borderRadius: '18px',
          background: '#000',
          border: '1px solid #FFFFFF',
          '&:hover': {
            backgroundColor: '#333333',
          },
        }}
      >
        {isLoading | mintLoading ? 'Claiming...' : 'Claim'}
      </Button>
    </Stack>
  );
}
