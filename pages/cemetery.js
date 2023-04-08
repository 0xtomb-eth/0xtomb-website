import {
  Box,
  Container,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle,
  Dialog,
  Button,
  Card,
  Slide,
} from '@mui/material';
import Layout from '../layout/Layout';
import React from 'react';
import { useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import WILL_ABI from '../abi/willAbi.json';
import NFT_ABI from '../abi/nftAbi.json';
import MintTomb from '../components/MintTomb';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cemetery() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const nftConfig = {
    address: '0x43c4Ebf956F7804596c333B209Ff246a476594DA',
    abi: NFT_ABI,
    chainId: 420,
  };

  const { data: totalDate } = useContractRead({
    ...nftConfig,
    functionName: 'totalSupply',
  });

  const { data: nftList, error } = useContractReads({
    contracts: Array.from({ length: parseInt(totalDate, 16) }, (_, x) => x).map(
      (val) => {
        return {
          ...nftConfig,
          functionName: 'tokenURI',
          args: [val + ''],
        };
      }
    ),
  });
  console.log(totalDate, nftList, error);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const data = [
    {
      name: '李安卓',
      img: 'https://bafkreiagtyckpr7yrllttow2kmk3fxdfjo4o32jopwe6wl4wunpv3bkw6i.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
    {
      name: '赵宇翔',
      img: 'https://bafkreihtreeeejcrr4gcxzuq7g7cj43nfeuvjjnmdjvgzqq5k25vocaqv4.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
    {
      name: '朱天宇',
      img: 'https://bafkreigznh4suem54pwapzhmaktu3rhc7p4iirspx5j7s3q26tmgrsioxi.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
    {
      name: '范一鸣',
      img: 'https://bafkreiha3u4j34widp77gzjujmbjtihwuqfc4npybmvp5vxhp5z5uf4x3m.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
    {
      name: '熊云飞',
      img: 'https://bafkreibatdmtzll3dzbj6oxzcx4sekhfejtixjwf7df7otikmlx7bn3rma.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
    {
      name: '孙世林',
      img: 'https://bafkreigdmsmn7xujzsf4q3znwpklc4twn5ek4rjjzllprm26wvrkbmc4uu.ipfs.nftstorage.link/',
      content:
        '当你们看到这个文件时，我已经离开了这个世界。在这个世界上我度过了美好的时光，与你们分享了许多乐趣与欢笑，但是生命的尽头终将会到来。\n\n首先，我要感谢我的父母，在他们的爱和关心下我度过了美好的童年和青春年华。我要感谢我的配偶和孩子，你们是我生命中最重要的人，曾经我花费了你们很多时间和精力，但是我真诚地希望你们知道这是我毕生的愿望，为你们付出一切都是值得的。\n\n我相信你们会在没有我存在的日子里继续生活，对于我的离开，请你们不要过于悲伤，更不用自责。我一直在你们心中，我的生命和回忆将与你们永远在一起。\n\n在此，我希望我的遗愿能得以执行：\n\n1.我希望我的遗体能够捐献给科学研究，以期能够为医学研究作出贡献。\n\n2.我希望我的家人和朋友之间能够和睦相处，不要因我的离去而产生隔阂或争端。\n\n3.关于财产分配，我已经做出了安排，希望大家都能够理解和尊重我的决定。\n\n最后，我想告诉你们，我虽然已经离开了这个世界，但是我的爱和关心会一直传递到你们的心中，让你们始终享有温暖和快乐。\n\n再次感谢你们，祝你们幸福安康。',
    },
  ];
  return (
    <>
      <Layout>
        <Container
          // maxWidth="lg"
          width="100%"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: 'full',
            justifyContent: 'start',
            mt: 6,
            gap: 2,
          }}
        >
          {data.map((v, index) => {
            return (
              <Card
                key={index}
                onClick={() => {
                  setCurrent(index);
                  handleClickOpen();
                }}
                sx={{
                  width: 270,

                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box component={'img'} src={v.img} width="250px" />
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    fontSize: '30px',
                    lineHeight: '40px',
                  }}
                >
                  {v.name}的坟墓
                </Box>
              </Card>
            );
          })}
        </Container>
      </Layout>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{data?.length && data[current].name}的遗嘱</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ whiteSpace: 'pre-line' }}
          >
            {data?.length && data[current].content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Cemetery;
